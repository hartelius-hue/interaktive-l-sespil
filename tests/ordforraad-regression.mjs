import {readFileSync} from "node:fs";
import {strict as assert} from "node:assert";
import {runInNewContext,Script} from "node:vm";
const read=(x)=>readFileSync(new URL("../"+x,import.meta.url),"utf8");
const ids=["betydningsbro","begrebsvaerksted","ordvalg","ordlaboratorium"];
const script=read("ordforraad-spil.js"),index=read("index.html"),css=read("ordforraad-spil.css"),homeCss=read("design-3d.css");
assert.doesNotThrow(()=>new Script(script,{filename:"ordforraad-spil.js"}),"JS syntax");
assert.match(index,/ordforraad-spil\.html/);
assert.match(index,/42 spil/);
assert.match(homeCss,/word3d-pan/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
for(const id of ids){
 assert.ok(index.includes('"'+id+'"'),id+" is in the main page");
 assert.ok(read("assets/3d/banners/"+id+".svg").startsWith("<svg"),id+" 3D SVG");
}
function create(level=2,selected=""){
 const store=new Map(),app={innerHTML:"",querySelector(){return {disabled:false};}},live={textContent:""};
 const location={search:"?niveau="+level+(selected?"&spil="+selected:""),href:"https://example.com/ordforraad-spil.html?niveau="+level+(selected?"&spil="+selected:"")};
 const dom={getElementById:function(id){return id==="app"?app:live;}};
 const sandbox={
  window:{location,scrollTo(){},addEventListener(){},Laesemakker:{setAdvice(){}},Laeringsmaal:{intro(){return "";},result(){return "<div class='learning-result'>Done</div>";}}},
  location,document:dom,URL,URLSearchParams,history:{replaceState(){}},
  localStorage:{getItem(k){return store.get(k)||null;},setItem(k,v){store.set(k,v);}},
  console
 };
 runInNewContext(script,sandbox,{timeout:3000});
 return {api:sandbox.window.Ordforraad,app,live,store};
}
const base=create();
assert.ok(base.app.innerHTML.includes("Betydningsbroen")&&base.app.innerHTML.includes("Brug ordet!"),"catalog renders");
let checked=0;
for(const id of ids){
 const g=base.api.GAMES[id];assert.ok(g,id);
 assert.equal(g.questions.length,id==="ordlaboratorium"?9:12,id+" question bank");
 for(const level of [1,2,3]){
  const qs=g.questions.filter(q=>q.l===level);
  assert.equal(qs.length,id==="ordlaboratorium"?3:4,id+" level "+level);
  for(const q of qs){
   assert.ok(q.l===level);
   if(id==="ordlaboratorium"){
    assert.ok(q.word&&q.definition&&q.example&&q.starter);
    assert.ok(q.example.toLocaleLowerCase("da-DK").includes(q.word.toLocaleLowerCase("da-DK")),id+" example includes target");
   }else{
    assert.ok(Array.isArray(q.options)&&new Set(q.options).size===q.options.length,"unique choices");
    assert.equal(q.options.filter(v=>v===q.answer).length,1,id+" exactly one answer");
    assert.ok(q.why.length>30,id+" clear didactic explanation");
   }
   checked++;
  }
  const {api,app,store}=create(level,id);
  assert.equal(api.getState().level,level);
  assert.equal(api.getState().roundCount,qs.length);
  assert.ok(app.innerHTML.includes(g.title));
  if(id==="ordlaboratorium"){
   for(let round=0;round<qs.length;round++){
    api.reviewWriting();assert.equal(api.getState().review,false,"blank text not accepted");
    const word=app.innerHTML.match(/class="word-token">([^<]+)</)?.[1];assert.ok(word);
    api.setText("meaning","Det betyder noget, som hjælper med at forstå verden.");
    api.setText("sentence","Jeg bruger ordet "+word+" i denne sætning, og det er meget spændende.");
    api.reviewWriting();assert.equal(api.getState().review,true,"writing goes to teacher-reviewed phase");
    api.finishWriting();assert.equal(api.getState().finished,false,"must check reflection before completing");
    api.setCheck(0,true);api.setCheck(1,true);api.finishWriting();
    assert.equal(api.getState().finished,true);
    api.next();
   }
   assert.ok(app.innerHTML.includes("ikke vurderet"),"does not claim to grade writing");
   assert.ok(!store.get("laese3c_extra_done")?.includes("denne sætning"),"writing text never saved");
  }else{
   for(let round=0;round<qs.length;round++){
    let solved=false;
    for(let option=0;option<4;option++){
     api.answer(option);
     if(api.getState().finished){solved=true;break;}
    }
    assert.ok(solved,id+" always solvable through one of displayed buttons");
    api.next();
   }
   assert.match(app.innerHTML,/rigtigt i første forsøg/i);
  }
  const done=JSON.parse(store.get("laese3c_extra_done")||"[]");
  assert.ok(done.includes(id),"completed state persisted without personal answers");
 }
}
console.log("PASS: "+checked+" unique prompts across 3 levels, 4 games, semantic feedback, written reflections, 3D assets, homepage, progress persistence.");
