import {chromium} from "playwright";
import {strict as assert} from "node:assert";
const base="http://127.0.0.1:8765",browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:850}});
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
page.on("response",r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push("HTTP "+r.status()+" "+r.url());});
const visit=p=>page.goto(base+p,{waitUntil:"networkidle"});
try{
 await visit("/index.html");
 const original=await page.evaluate(()=>CONFIG.map(c=>({id:c.id,name:c.name})));
 assert.equal(original.length,15,"15 integrated games");
 let starts=0;
 for(const entry of original){
  for(const level of [1,2,3]){
   const info=await page.evaluate(({id,level})=>{
     difficulty=level;newGame(id);
     return {active,finished:game.finished,panel:document.querySelector(".play-panel")?.innerText?.trim()||"",html:document.querySelector(".play-panel")?.innerHTML?.length||0};
   },{id:entry.id,level});
   assert.equal(info.active,entry.id);
   assert.equal(info.finished,false,entry.id+" level "+level+" starts");
   assert.ok(info.html>250,entry.id+" level "+level+" renders a usable task panel");
   assert.ok(info.panel.length>15,entry.id+" level "+level+" has pupil instructions");
   starts++;
  }
 }
 await visit("/st3-traening.html");
 const extras=await page.evaluate(()=>G.map(g=>({id:g.id,name:g.title,kind:g.kind})));
 assert.equal(extras.length,23,"23 external training games");
 for(const entry of extras){
  for(const level of [1,2,3]){
   const info=await page.evaluate(({id,level})=>{
     lvl=level;start(id);
     return {id:g.id,kind:g.kind,count:qs.length,stage:document.querySelector("#app")?.innerText?.trim()||"",html:document.querySelector("#app")?.innerHTML?.length||0};
   },{id:entry.id,level});
   assert.equal(info.id,entry.id);
   assert.ok(info.count>0,entry.id+" level "+level+" has at least one task");
   assert.ok(info.html>250,entry.id+" level "+level+" has rendered task");
   assert.ok(info.stage.length>20,entry.id+" level "+level+" provides visible instructions");
   starts++;
  }
 }
 await page.evaluate(()=>home()); // cancel flash timers before the last check
 assert.equal(errors.length,0,"no errors in any game start: "+errors.join(" | "));
 console.log("PASS all-game render smoke: "+starts+" runs across 38 original/training games × 3 levels, no JS errors or missing task banks; other 4 games covered by vocabulary end-to-end suite.");
}finally{await browser.close();}
