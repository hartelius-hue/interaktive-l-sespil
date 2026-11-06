/**
 * Sprogkontrol for Læseværkstedet 3.C.
 * Kør lokalt med: node redaktionel-sprogkontrol.js
 * Kontrollerer syntaks, basale sprogfejl, facit, spilhenvisninger og råd.
 * En automatiseret kontrol erstatter ikke manuel faglig korrektur.
 */
"use strict";
function sprogkontrol(files){
  const fejl=[];
  const original=files["index.html"],ekstra=files["st3-traening.html"],start=files["starttest.html"],avatar=files["laesemakker.js"];
  for(const [navn,indhold] of Object.entries(files)){
    if(navn.endsWith(".html")){
      for(const match of indhold.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
        try{new Function(match[1]);}catch(e){fejl.push(navn+": ugyldigt JavaScript: "+e.message);}
      }
    }else if(navn.endsWith(".js"))try{new Function(indhold)}catch(e){fejl.push(navn+": ugyldigt JavaScript: "+e.message);}
    if(!navn.endsWith(".css")&&/\bbag\s+linj(?:erne|en)\b/i.test(indhold))fejl.push(navn+": brug på eller mellem linjerne.");
  }
  const config=JSON.parse(original.match(/const CONFIG=(\[[\s\S]*?\]);\nconst ONSETS=/)[1]);
  const games=JSON.parse(ekstra.match(/<script>const G=([\s\S]*?);<\/script>/)[1]);
  const m=start.match(/const DOMAINS=(\[[\s\S]*?\]), QUESTIONS=(\[[\s\S]*?\]);/);
  const domains=JSON.parse(m[1]),questions=JSON.parse(m[2]);
  const tips=JSON.parse(ekstra.match(/const READING_TIPS=([\s\S]*?);\nconst READING_TIP_BY_GAME=/)[1]);
  const voiceTips=JSON.parse(avatar.match(/const TIPS=([\s\S]*?);\nconst GAME_TIP=/)[1]);
  if(config.length!==15||games.length!==22)fejl.push("Spilantallet er ikke 37.");
  if(questions.length!==24||domains.length!==6)fejl.push("Starttestens antal er ændret.");
  const ids=new Set([...config,...games].map(g=>g.id));
  for(const d of domains)for(const [id] of d.games)if(!ids.has(id))fejl.push("Ukendt spil fra starttest: "+id);
  questions.forEach((q,i)=>{if(!q.o?.includes(q.a))fejl.push("Ugyldigt facit i startspørgsmål "+(i+1));});
  for(const g of games)for(const q of g.qs)if(!["order","nonword","write","dictation"].includes(g.kind)&&!q.o?.includes(q.a))fejl.push("Ugyldigt facit i "+g.id);
  if(tips.length!==11||voiceTips.length!==11||tips.some((t,i)=>t.tip!==voiceTips[i]?.body))fejl.push("Læsemakkerens råd afviger fra guiden.");
  if(start.includes("localStorage")||start.includes("sessionStorage"))fejl.push("Starttesten gemmer svar i browseren.");
  for(const name of ["index.html","st3-traening.html","starttest.html"])if(!files[name].includes('laesemakker.js'))fejl.push("Avatar mangler på "+name);
  if(!original.includes("u.lang='da-DK'")||!ekstra.includes("utterance.lang='da-DK'")||!avatar.includes('u.lang="da-DK"'))fejl.push("Dansk oplæsning mangler.");
  return {fejl,spil:config.length+games.length,startopgaver:questions.length,laeseraad:tips.length};
}
if(typeof module!=="undefined"&&module.exports){
  module.exports=sprogkontrol;
  if(require.main===module){
    const fs=require("node:fs"),files={};
    for(const p of ["index.html","st3-traening.html","starttest.html","laesemakker.js","laesemakker.css"])files[p]=fs.readFileSync(p,"utf8");
    const result=sprogkontrol(files);
    console.log(JSON.stringify(result,null,2));
    if(result.fejl.length)process.exitCode=1;
  }
}
