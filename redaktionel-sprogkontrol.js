/**
 * Sprogkontrol for Læseværkstedet 3.C.
 * Kør lokalt med: node redaktionel-sprogkontrol.js
 * Kontrollerer syntaks, basale sprogfejl, facit, spilhenvisninger og råd.
 * En automatiseret kontrol erstatter ikke manuel faglig korrektur.
 */
"use strict";
function sprogkontrol(files){
  const fejl=[];
  const original=files["index.html"],ekstra=files["st3-traening.html"],start=files["starttest.html"],avatar=files["laesemakker.js"],learning=files["laeringsmaal.js"];
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
  if(config.length!==15||games.length!==23)fejl.push("Spilantallet er ikke 38.");
  if(questions.length!==24||domains.length!==6)fejl.push("Starttestens antal er ændret.");
  const ids=new Set([...config,...games].map(g=>g.id));
  const catsMatch=original.match(/const LEARNING_CATEGORIES=(\[[^\n]*\]);\nconst EXTRA_CATALOG=(\[[^\n]*\]);/);
  if(!catsMatch)fejl.push("Forsidens øveområder kan ikke læses.");
  else{
    const areas=JSON.parse(catsMatch[1]),catalog=JSON.parse(catsMatch[2]);
    if(areas.length!==7)fejl.push("Forsiden skal vise syv øveområder.");
    const mapped=areas.flatMap(c=>c.ids||[]);
    if(mapped.length!==ids.size||new Set(mapped).size!==ids.size)fejl.push("Et spil mangler eller er placeret flere gange på forsiden.");
    for(const id of ids)if(!mapped.includes(id))fejl.push("Spillet mangler i et øveområde: "+id);
    if(catalog.length!==games.length)fejl.push("Ikke alle ekstra spil findes i forsidens spiloversigt.");
    for(const g of games)if(!catalog.some(c=>c.id===g.id&&c.name===g.title))fejl.push("Forsidens spiloversigt er forældet: "+g.id);
    for(const area of areas)if(!area.title||!area.wish||!area.hint)fejl.push("Der mangler elevnær tekst til øveområdet "+area.id);
    if(!original.includes("omraade='+encodeURIComponent(current.id)"))fejl.push("Spillets link skal huske elevens øveområde.");
  }
  if(!learning)fejl.push("Læringsmål-filen mangler.");
  else{
    const m=learning.match(/const DATA=(\{[\s\S]*?\});\nconst esc=/);
    if(!m)fejl.push("Læringsmålene kan ikke læses.");
    else{
      const goals=JSON.parse(m[1]);
      if(Object.keys(goals).length!==ids.size)fejl.push("Antal læringsmål passer ikke til spillene.");
      for(const id of ids){
        const values=goals[id];
        if(!Array.isArray(values)||values.length!==4||values.some(x=>typeof x!=="string"||x.trim().length<10))fejl.push("Manglende eller ufuldstændigt læringsmål for "+id);
      }
      for(const id of Object.keys(goals))if(!ids.has(id))fejl.push("Læringsmål henviser til ukendt spil: "+id);
    }
    for(const name of ["index.html","st3-traening.html"]){
      if(!files[name].includes('src="laeringsmaal.js"')||!files[name].includes("Laeringsmaal?.intro(")||!files[name].includes("Laeringsmaal?.result("))fejl.push("Læringsmål vises ikke før og efter spillet på "+name);
    }
    if(!learning.includes('u.lang="da-DK"'))fejl.push("Dansk oplæsning af læringsmål mangler.");
  }
  for(const d of domains)for(const [id] of d.games)if(!ids.has(id))fejl.push("Ukendt spil fra starttest: "+id);
  questions.forEach((q,i)=>{if(!q.o?.includes(q.a))fejl.push("Ugyldigt facit i startspørgsmål "+(i+1));});
  for(const g of games)for(const q of g.qs){
    if(g.kind==="morphbuild"){if(!q.parts||q.parts.join("")!==q.a)fejl.push("Ugyldigt sammensat ord i "+g.id);continue;}
    if(g.kind==="morphending"){if(q.stem+q.suffix!==q.a||!q.o?.includes(q.suffix))fejl.push("Ugyldig endelse i "+g.id);continue;}
    if(g.kind==="storywrite"){if(!q.nouns?.length||!q.verbs?.length||!q.adjectives?.length||!q.p)fejl.push("Mangelfuld skriveopgave i "+g.id);continue;}
    if(g.kind==="vowelrule"&&!["kort","lang"].includes(q.vowel))fejl.push("Ugyldig vokallængde i "+g.id);
    if(!["order","nonword","write","dictation"].includes(g.kind)&&!q.o?.includes(q.a))fejl.push("Ugyldigt facit i "+g.id);
  }
  if(tips.length!==21||voiceTips.length!==21||tips.some((t,i)=>t.tip!==voiceTips[i]?.body))fejl.push("Læsemakkerens råd afviger fra guiden.");
  if(start.includes("localStorage")||start.includes("sessionStorage"))fejl.push("Starttesten gemmer svar i browseren.");
  for(const name of ["index.html","st3-traening.html","starttest.html"])if(!files[name].includes('laesemakker.js'))fejl.push("Avatar mangler på "+name);
  if(!original.includes("u.lang='da-DK'")||!ekstra.includes("utterance.lang='da-DK'")||!avatar.includes('u.lang="da-DK"'))fejl.push("Dansk oplæsning mangler.");
  return {fejl,spil:config.length+games.length,startopgaver:questions.length,laeseraad:tips.length,laeringsmaal:ids.size};
}
if(typeof module!=="undefined"&&module.exports){
  module.exports=sprogkontrol;
  if(require.main===module){
    const fs=require("node:fs"),files={};
    for(const p of ["index.html","st3-traening.html","starttest.html","laesemakker.js","laesemakker.css","laeringsmaal.js","laeringsmaal.css"])files[p]=fs.readFileSync(p,"utf8");
    const result=sprogkontrol(files);
    console.log(JSON.stringify(result,null,2));
    if(result.fejl.length)process.exitCode=1;
  }
}
