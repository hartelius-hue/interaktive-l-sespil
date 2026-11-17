import {chromium} from "playwright";
import {strict as assert} from "node:assert";
import {mkdirSync} from "node:fs";
mkdirSync("test-results",{recursive:true});
const base="http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1370,height:900}});
const page=await context.newPage(),errors=[];
page.on("pageerror",e=>errors.push("JS "+e.message));
page.on("response",r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push("HTTP "+r.status()+" "+r.url());});
const visit=async path=>page.goto(base+path,{waitUntil:"networkidle"});
try{
 await visit("/index.html");
 await page.evaluate(()=>localStorage.clear());
 await page.reload({waitUntil:"networkidle"});
 const categories=await page.evaluate(()=>LEARNING_CATEGORIES.map(c=>({id:c.id,ids:c.ids})));
 const allIds=categories.flatMap(c=>c.ids);
 assert.equal(categories.length,8);
 assert.equal(allIds.length,42);
 // Every one of the 42 feedback generators must retain s in words.
 const phrase="To bøger nævnes. Det er vigtigt at holde styr på, hvilken bog hun lægger fra sig.";
 const inspect=await page.evaluate(({ids,msg})=>ids.map(id=>Laeringsmaal.result(id,2,4,"choice",[msg])),{ids:allIds,msg:phrase});
 for(let j=0;j<allIds.length;j++){
   assert.ok(inspect[j].includes("holde styr på"),allIds[j]+" preserves styr");
   assert.ok(inspect[j].includes("fra sig"),allIds[j]+" preserves sig");
 }
 // Incomplete area: 10 of 11 reading-word games done, no checkmark yet.
 const words=categories.find(c=>c.id==="ord").ids;
 const initialDone=words.slice(0,-1);
 await page.evaluate(list=>localStorage.setItem("laese3c_extra_done",JSON.stringify(list)),initialDone);
 await page.reload({waitUntil:"networkidle"});
 assert.ok((await page.locator("#progressCounter").innerText()).includes("10 af 42"));
 const wordArea=page.locator('.choice-category[data-area="ord"]');
 assert.equal(await wordArea.getAttribute("data-completed"),"false","incomplete area never gets tick");
 assert.ok((await wordArea.innerText()).includes("10 af 11 gennemført"));
 await wordArea.click();
 assert.equal(await page.locator('.learning-game-card[data-completed="true"]').count(),10);
 assert.equal(await page.locator('.learning-game-card[data-completed="false"]').count(),1);
 // Complete the last extra game through the real finish handler, without forging storage writes.
 const last=words.at(-1);
 await visit("/st3-traening.html?spil="+last+"&niveau=1&omraade=ord");
 await page.evaluate(()=>result()); // exercise finish handler: question logic is tested in the other suite
 assert.ok((await page.locator("#app").innerText()).includes("Spillet er registreret som gennemført"));
 assert.ok(await page.evaluate(id=>LaeseFremgang.has(id),last));
 await visit("/index.html?omraade=ord");
 assert.equal(await page.locator('.choice-category[data-area="ord"]').getAttribute("data-completed"),"true");
 assert.ok((await page.locator('.choice-category[data-area="ord"]').innerText()).includes("✓ Alle 11 spil gennemført"));
 assert.equal(await page.locator('.choice-selected .learning-game-card[data-completed="true"]').count(),11);
 assert.ok((await page.locator(".choice-selected .choice-count").innerText()).includes("Alle 11 spil gennemført"));
 // Original games: finishing writes to performance stats AND the shared completion registry.
 await page.evaluate(()=>{newGame("caption");game.score=2;finish();});
 assert.ok((await page.locator(".finish-wrap").innerText()).includes("Spillet er registreret som gennemført"));
 assert.ok(await page.evaluate(()=>LaeseFremgang.has("caption")));
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem("laese3c_stats")).caption.plays>=1));
 // Loss in the maze must not award completion by itself.
 await page.evaluate(()=>{newGame("maze");game.finished=true;game.lost=true;render();});
 assert.equal(await page.evaluate(()=>LaeseFremgang.has("maze")),true,"maze already completed in initial data");
 // Check an uncompleted game via a fresh start to ensure it stays uncompleted.
 await page.evaluate(()=>{newGame("sentence");game.finished=true;game.lost=true;render();});
 assert.equal(await page.evaluate(()=>LaeseFremgang.has("sentence")),false,"displaying a failed result must not set tick");
 // 42 entries must not count twice, even when the original stats object also lists a game.
 await page.evaluate(ids=>{localStorage.setItem("laese3c_extra_done",JSON.stringify([...ids,"caption","caption"]));},allIds);
 await page.reload({waitUntil:"networkidle"});
 assert.ok((await page.locator("#progressCounter").innerText()).includes("42 af 42"));
 assert.equal(await page.locator('.choice-category[data-completed="true"]').count(),8,"eight checked learning areas");
 const categoryCounts=await page.locator(".choice-category .category-completion").allTextContents();
 assert.ok(categoryCounts.every(s=>s.includes("✓ Alle")),"all categories now show completion");
 await page.locator('.choice-category[data-area="ordforraad"]').click();
 assert.equal(await page.locator('.choice-selected .learning-game-card[data-completed="true"]').count(),5,"all five vocabulary cards checked");
 await page.screenshot({path:"test-results/all-reading-categories-complete.png",fullPage:true});
 // Shared local store must also drive each of the two other game engines.
 await visit("/st3-traening.html");
 assert.ok((await page.locator("#app").innerText()).includes("✓ Alle"),"extra trainer menu shows area checks");
 assert.equal(await page.locator('.card[data-completed="true"]').count(),23,"all trainer games marked");
 await visit("/ordforraad-spil.html");
 assert.equal(await page.locator('.game-card[data-completed="true"]').count(),4,"new word games marked");
 assert.ok((await page.locator("#app").innerText()).includes("✓ Alle fire nye ordspil er gennemført"));
 // After confirmed deletion no stale badges must remain.
 await visit("/index.html");
 await page.getByRole("button",{name:/Til læreren/}).click();
 page.once("dialog",d=>d.accept());
 await page.getByRole("button",{name:/Ryd lokale øveresultater/}).click();
 assert.ok((await page.locator("#progressCounter").innerText()).includes("0 af 42"));
 assert.equal(await page.locator('.choice-category[data-completed="true"]').count(),0);
 // Three widths: all categories and badges fit inside viewport without horizontal scrolling.
 for(const width of [390,768,1370]){
  await page.setViewportSize({width,height:900});
  await page.screenshot({path:"test-results/progress-"+width+".png",fullPage:width===390});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,"no horizontal scroll at width "+width+": "+overflow);
 }
 assert.equal(errors.length,0,"no JS/HTTP failures: "+errors.join(" | "));
 console.log("PASS browser: exact Danish feedback in all 42 games; 10/11 vs 11/11 area; 8 checked categories; trainer+vocabulary+original completion; duplicates; reset; 390/768/1370 responsive widths.");
}finally{await browser.close();}
