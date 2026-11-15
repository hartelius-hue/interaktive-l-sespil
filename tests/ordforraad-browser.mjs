import {chromium} from "playwright";
import {strict as assert} from "node:assert";
import {mkdirSync} from "node:fs";
const base="http://127.0.0.1:8765";
mkdirSync("test-results",{recursive:true});
const ids=["betydningsbro","begrebsvaerksted","ordvalg","ordlaboratorium"];
const browser=await chromium.launch({headless:true});
const failures=[];
const page=await browser.newPage({viewport:{width:1400,height:900},deviceScaleFactor:1});
page.on("pageerror",e=>failures.push("JS error: "+e.message));
page.on("response",response=>{if(response.url().startsWith(base)&&response.status()>=400)failures.push("HTTP "+response.status()+" "+response.url());});
try{
 await page.goto(base+"/index.html?omraade=ordforraad",{waitUntil:"networkidle"});
 await page.locator('.choice-selected[data-area="ordforraad"]').waitFor();
 assert.equal(await page.locator('.choice-selected[data-area="ordforraad"] .learning-game-card').count(),5,"five vocabulary games in category");
 for(const id of ids){
  const card=page.locator('.learning-game-card[data-game="'+id+'"]');
  assert.ok((await card.locator("a.learning-start").getAttribute("href")).includes("ordforraad-spil.html?spil="+id),id+" navigation");
  const art=await card.locator(".game-banner-art").evaluate(el=>getComputedStyle(el).backgroundImage);
  assert.ok(art.includes(id+".svg"),id+" its own banner");
 }
 await page.screenshot({path:"test-results/ordforraad-desktop.png",fullPage:true});
 for(const id of ids){
  for(const level of [1,2,3]){
   await page.goto(base+"/ordforraad-spil.html?spil="+id+"&niveau="+level,{waitUntil:"networkidle"});
   await page.locator(".stage").waitFor();
   const rounds=id==="ordlaboratorium"?3:4;
   for(let r=0;r<rounds;r++){
    if(id==="ordlaboratorium"){
     await page.locator("#meaning").fill("Det betyder noget, der er vigtigt, når man lærer nye ord.");
     const word=(await page.locator(".word-token").innerText()).trim();
     await page.locator("#sentence").fill("Jeg vil bruge ordet "+word+" i en sætning, som alle kan læse og forstå.");
     await page.getByRole("button",{name:"Se på min sætning"}).click();
     assert.equal(await page.locator(".review input").count(),2,id+" self-review");
     await page.locator(".review input").first().check();
     await page.locator(".review input").last().check();
     await page.getByRole("button",{name:"Jeg har gennemgået mit ord"}).click();
    }else{
     const choices=page.locator(".stage .answers button, .stage .bins button");
     const total=await choices.count();
     let solved=false;
     for(let i=0;i<total;i++){
      await choices.nth(i).click();
      if(await page.locator('.stage .actions button').count()){solved=true;break;}
     }
     assert.ok(solved,id+" solvable");
    }
    await page.locator(".stage .actions .btn.secondary").last().click();
    if(r!==rounds-1)await page.locator(".stage").waitFor();
   }
   await page.locator(".finish-hero").waitFor();
   assert.ok((await page.locator(".finish-hero").innerText()).includes("Godt arbejdet"));
   if(id==="ordlaboratorium")assert.ok((await page.locator(".info").allInnerTexts()).some(t=>t.includes("ikke vurderet")), "no automatic writing assessment");
   const bg=await page.locator(".finish-hero").evaluate(el=>getComputedStyle(el).backgroundColor);
   assert.ok(bg);
  }
 }
 await page.goto(base+"/ordforraad-spil.html?spil=betydningsbro&niveau=2",{waitUntil:"networkidle"});
 await page.screenshot({path:"test-results/ordforraad-game-desktop.png",fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+"/ordforraad-spil.html?spil=ordlaboratorium&niveau=1",{waitUntil:"networkidle"});
 await page.screenshot({path:"test-results/ordforraad-mobile.png",fullPage:true});
 const sizes=await page.evaluate(()=>({viewport:innerWidth,body:document.body.scrollWidth,document:document.documentElement.scrollWidth}));
 assert.ok(sizes.document<=sizes.viewport+2,"no horizontal overflow on mobile: "+JSON.stringify(sizes));
 assert.equal(failures.length,0,"no console errors or 404s: "+failures.join(" | "));
 console.log("PASS browser: four games x three levels, five-card navigation, 3D SVG banners, writing self-review, mobile viewport, no missing assets/errors.");
}finally{await browser.close();}
