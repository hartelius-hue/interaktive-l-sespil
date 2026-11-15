/* Fire ordforrådsspil til 3.C. Alt arbejde foregår i browseren. */
(function(){
"use strict";
const GAMES={
 betydningsbro:{
  title:"Betydningsbroen",badge:"ORDS BETYDNINGSRELATIONER",short:"Find ord, der næsten betyder det samme, eller det modsatte.",icon:"🔗",
  focus:"synonymer, antonymer og nuancer i ords betydning",advice:"Når to ord betyder næsten det samme, kan de stadig give lidt forskellig mening. Læs ordene højt, og prøv dem i en sætning.",
  questions:[
   {l:1,relation:"Næsten samme betydning",word:"glad",options:["lykkelig","vred","søvnig","bange"],answer:"lykkelig",why:"Glad og lykkelig betyder næsten det samme, men lykkelig kan beskrive en særlig stærk glæde."},
   {l:1,relation:"Modsat betydning",word:"varm",options:["kold","hed","lun","solrig"],answer:"kold",why:"Varm og kold betyder det modsatte af hinanden."},
   {l:1,relation:"Næsten samme betydning",word:"trist",options:["ked af det","ivrig","modig","stille"],answer:"ked af det",why:"At være trist er omtrent det samme som at være ked af det."},
   {l:1,relation:"Modsat betydning",word:"lys",options:["mørk","blank","gul","klar"],answer:"mørk",why:"Når et rum er lyst, er det ikke mørkt. Det er modsatte betydninger."},
   {l:2,relation:"Næsten samme betydning",word:"modig",options:["tapper","bange","forvirret","træt"],answer:"tapper",why:"Modig og tapper kan begge beskrive én, som tør gøre noget svært."},
   {l:2,relation:"Modsat betydning",word:"smal",options:["bred","lang","tynd","kort"],answer:"bred",why:"En smal sti har ikke den samme bredde som en bred sti."},
   {l:2,relation:"Næsten samme betydning",word:"vred",options:["rasende","rolig","glad","forsigtig"],answer:"rasende",why:"Vred og rasende hænger sammen. Rasende betyder, at man er meget vred."},
   {l:2,relation:"Modsat betydning",word:"tung",options:["let","stor","stærk","hård"],answer:"let",why:"En tung taske og en let taske har forskellig vægt."},
   {l:3,relation:"Næsten samme betydning",word:"varsom",options:["forsigtig","tankeløs","hurtig","usikker"],answer:"forsigtig",why:"At være varsom betyder at handle forsigtigt og være opmærksom."},
   {l:3,relation:"Modsat betydning",word:"sjælden",options:["almindelig","værdifuld","gammel","dyr"],answer:"almindelig",why:"Noget sjældent ser man ikke tit. Noget almindeligt møder man ofte."},
   {l:3,relation:"Næsten samme betydning",word:"tøve",options:["være usikker, før man gør noget","løbe hurtigt frem","glemme noget","grine højt"],answer:"være usikker, før man gør noget",why:"At tøve er at vente lidt, fordi man er usikker på, hvad man skal gøre."},
   {l:3,relation:"Modsat betydning",word:"præcis",options:["upræcis","grundig","tydelig","rigtig"],answer:"upræcis",why:"En præcis forklaring er nøjagtig. En upræcis forklaring er ikke nøjagtig."}
  ]
 },
 begrebsvaerksted:{
  title:"Begrebsbyggeren",badge:"BEGREBER OG KATEGORIER",short:"Find ud af, hvilken gruppe et ord hører til.",icon:"🧺",
  focus:"overbegreber, underbegreber og semantisk kategorisering",advice:"Prøv at sige: En spurv er en slags fugl. Så hjælper et overbegreb dig med at forstå, hvordan ord hænger sammen.",
  questions:[
   {l:1,word:"spurv",options:["Fugle","Fisk","Pattedyr"],answer:"Fugle",why:"En spurv er en fugl. Fugle er et overbegreb, som også rummer duer og solsorte."},
   {l:1,word:"gulerod",options:["Grøntsager","Redskaber","Dyr"],answer:"Grøntsager",why:"En gulerod er en grøntsag. Man kan også finde andre grøntsager i samme gruppe."},
   {l:1,word:"hammer",options:["Redskaber","Fødevarer","Planter"],answer:"Redskaber",why:"En hammer er et redskab, man kan bruge til at slå søm i."},
   {l:1,word:"birk",options:["Træer","Fugle","Musikinstrumenter"],answer:"Træer",why:"Birk er en type træ. Eg og bøg hører også til træer."},
   {l:2,word:"klarinet",options:["Musikinstrumenter","Køretøjer","Følelser"],answer:"Musikinstrumenter",why:"En klarinet er et blæseinstrument og hører til gruppen musikinstrumenter."},
   {l:2,word:"færge",options:["Transportmidler","Musikinstrumenter","Fødevarer"],answer:"Transportmidler",why:"En færge transporterer mennesker og ofte køretøjer over vand."},
   {l:2,word:"feber",options:["Symptomer","Redskaber","Bygninger"],answer:"Symptomer",why:"Feber kan være et symptom på, at kroppen reagerer på sygdom."},
   {l:2,word:"sommerfugl",options:["Insekter","Fugle","Fisk"],answer:"Insekter",why:"Sommerfugle er insekter. De har blandt andet seks ben som voksne."},
   {l:3,word:"termometer",options:["Måleinstrumenter","Vejrtyper","Legetøj"],answer:"Måleinstrumenter",why:"Et termometer er et instrument, man bruger til at måle temperatur."},
   {l:3,word:"fordampning",options:["Processer i naturen","Ting af metal","Levende væsner"],answer:"Processer i naturen",why:"Fordampning er en proces, hvor flydende vand bliver til vanddamp."},
   {l:3,word:"arkitekt",options:["Erhverv","Bygninger","Vejrfænomener"],answer:"Erhverv",why:"Arkitekt er et erhverv. En arkitekt kan for eksempel tegne bygninger."},
   {l:3,word:"gran",options:["Nåletræer","Fugle","Møbler"],answer:"Nåletræer",why:"Gran er en type nåletræ. Fyr er et andet eksempel på et nåletræ."}
  ]
 },
 ordvalg:{
  title:"Ordet der passer",badge:"ORD I SAMMENHÆNG",short:"Læs tekstens spor, og vælg det ord, som passer bedst.",icon:"🔍",
  focus:"ordforståelse, kontekst og præcist ordvalg",advice:"Læs sætningerne før og efter det tomme felt. Det er ofte de andre ord i teksten, som hjælper dig med at vælge.",
  questions:[
   {l:1,text:"Det havde regnet hele natten. Vandet lå stadig i små pytter.",prompt:"Stien var stadig ___.",options:["våd","tør","støvet","frossen"],answer:"våd",why:"Pytterne efter regnen fortæller, at stien stadig er våd."},
   {l:1,text:"Klassen skulle arbejde stille på biblioteket. Ingen måtte forstyrre de andre.",prompt:"Børnene talte med ___ stemmer.",options:["stille","høje","vrede","hæse"],answer:"stille",why:"Når man ikke vil forstyrre, taler man med stille stemmer."},
   {l:1,text:"Det var koldt udenfor, og Alma rystede af kulde.",prompt:"Alma tog sin jakke på, fordi hun ___.",options:["frøs","svedte","grinede","dansede"],answer:"frøs",why:"Hun rystede af kulde. Det er et spor, som viser, at hun frøs."},
   {l:1,text:"Læreren fortalte, hvordan forsøget virkede. Mikkel lyttede godt efter.",prompt:"Bagefter kunne Mikkel ___ forsøget for andre.",options:["forklare","glemme","gemme","ødelægge"],answer:"forklare",why:"Når man har forstået forklaringen, kan man fortælle den videre."},
   {l:2,text:"Amina fik en lukket pakke. Hun ville meget gerne vide, hvad der var indeni.",prompt:"Amina var ___.",options:["nysgerrig","ligeglad","udmattet","mæt"],answer:"nysgerrig",why:"Når man gerne vil vide noget, kan man være nysgerrig."},
   {l:2,text:"Elias så sig godt for til begge sider, før han gik over vejen.",prompt:"Elias var ___.",options:["forsigtig","tankeløs","distræt","uforberedt"],answer:"forsigtig",why:"Han undersøgte trafikken, før han gik. Det viser forsigtighed."},
   {l:2,text:"Gruppen havde dagen før lavet en plan og samlet alle materialerne.",prompt:"Gruppen var godt ___.",options:["forberedt","overrasket","forvirret","fraværende"],answer:"forberedt",why:"De havde lagt en plan og gjort materialerne klar på forhånd."},
   {l:2,text:"Sofie forstod, at hun havde taget fejl. Hun sagde undskyld og ville rette det.",prompt:"Sofie ___ sin fejl.",options:["erkendte","skjulte","gentog","ignorerede"],answer:"erkendte",why:"At erkende en fejl betyder, at man indser og står ved, at man har taget fejl."},
   {l:3,text:"Der var kun én vandflaske tilbage, og der var lang vej hjem. Gruppen talte om mulighederne.",prompt:"Gruppen måtte ___, hvordan vandet skulle deles.",options:["overveje","glemme","udslette","efterligne"],answer:"overveje",why:"De måtte tænke over mulighederne, før de valgte."},
   {l:3,text:"Freja svarede på spørgsmålet og pegede på to sætninger, der støttede hendes svar.",prompt:"Freja kunne ___ sit svar.",options:["begrunde","skjule","forkorte","udskyde"],answer:"begrunde",why:"Hun viste, hvorfor svaret gav mening, ved at bruge spor fra teksten."},
   {l:3,text:"To tekster fortalte forskellige ting om det samme sted. Eleverne undersøgte både ligheder og forskelle.",prompt:"Eleverne ville ___ teksterne.",options:["sammenligne","overmale","forlade","gemme"],answer:"sammenligne",why:"At sammenligne er at se på ligheder og forskelle."},
   {l:3,text:"De første tre forsøg mislykkedes, men gruppen fortsatte og prøvede igen.",prompt:"Gruppen var ___.",options:["vedholdende","ligeglad","utålmodig","passiv"],answer:"vedholdende",why:"Vedholdende betyder, at man bliver ved, også når noget er svært."}
  ]
 },
 ordlaboratorium:{
  title:"Brug ordet!",badge:"AKTIVT ORDFORRÅD",short:"Forklar et nyt ord, og brug det i din egen sætning.",icon:"✍️",
  focus:"aktiv anvendelse af ord og nuanceret ordforståelse",advice:"Forklar ordet med dine egne ord. Skriv en sætning, hvor en anden kan forstå betydningen ud fra sammenhængen.",
  questions:[
   {l:1,word:"nysgerrig",starter:"Jeg blev nysgerrig, da ...",definition:"Nysgerrig betyder, at man gerne vil vide eller undersøge noget.",example:"Jeg blev nysgerrig, da jeg fandt et mærkeligt spor i sandet."},
   {l:1,word:"beskytte",starter:"Jeg vil beskytte ...",definition:"At beskytte er at passe på nogen eller noget, så det ikke tager skade.",example:"Vi vil beskytte den lille fugl mod kulden."},
   {l:1,word:"hjælpsom",starter:"Hun var hjælpsom, fordi ...",definition:"Hjælpsom betyder, at man gerne vil hjælpe andre.",example:"Hun var hjælpsom, da hun bar bøgerne for sin ven."},
   {l:2,word:"undersøge",starter:"Vi vil undersøge ...",definition:"At undersøge er at se nærmere på noget for at lære mere om det.",example:"Vi vil undersøge, hvorfor frøene spirer forskelligt."},
   {l:2,word:"samarbejde",starter:"Det er godt at samarbejde, når ...",definition:"At samarbejde betyder, at flere arbejder sammen om noget.",example:"Vi skal samarbejde om at bygge en bro af papir."},
   {l:2,word:"forberede",starter:"Jeg vil forberede ...",definition:"At forberede er at gøre noget klar, før det skal ske.",example:"Jeg vil forberede mit oplæg ved at øve det højt."},
   {l:3,word:"begrunde",starter:"Jeg kan begrunde ...",definition:"At begrunde er at forklare, hvorfor man mener eller gør noget.",example:"Jeg kan begrunde mit svar ved at vise sporene i teksten."},
   {l:3,word:"overveje",starter:"Vi må overveje ...",definition:"At overveje betyder at tænke grundigt over muligheder, før man vælger.",example:"Vi må overveje, hvilken vej der er sikrest at gå."},
   {l:3,word:"sammenligne",starter:"Jeg vil sammenligne ...",definition:"At sammenligne er at undersøge, hvad der er ens og forskelligt.",example:"Jeg vil sammenligne de to planter og deres blade."}
  ]
 }
};
const IDS=Object.keys(GAMES),titleLevels=["","Basis","På vej","Udfordring"],params=new URLSearchParams(location.search);
const app=document.getElementById("app"),live=document.getElementById("live");
const queryLevel=Number(params.get("niveau"));
let level=[1,2,3].includes(queryLevel)?queryLevel:2;
let state={id:null,rounds:[],at:0,options:[],attempted:false,points:0,finished:false,feedback:"",wrong:false,review:false,checks:[false,false],meaning:"",sentence:""};
function esc(x){return String(x).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
function randomize(input){const a=input.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const tmp=a[i];a[i]=a[j];a[j]=tmp;}return a;}
function say(s){live.textContent=s;}
function helpMarkup(){return '<details class="info"><summary><strong>Til læreren og læsevejlederen – faglig vejledning</strong></summary><p>De fire spil arbejder med forskellige sider af ordforrådet. <strong>Betydningsbroen</strong> træner synonymer, antonymer og betydningsnuancer. <strong>Begrebsbyggeren</strong> lader eleven sortere underbegreber under overbegreber. <strong>Ordet der passer</strong> kræver, at eleven bruger tekstens kontekst til at vælge et ord. <strong>Brug ordet!</strong> støtter aktivt ordforråd, når eleven forklarer og anvender ordet i en selvskrevet sætning.</p><p>Modellér strategien, lad eleverne tale om deres begrundelser, og vend tilbage til de samme ord i nye sammenhænge. Niveauerne er lokale øveniveauer, ikke normerede trin. Et korrekt klik viser kun, hvordan eleven løste den enkelte opgave. Elevernes egne forklaringer og sætninger bliver ikke sprogligt vurderet af programmet; en lærer bør læse dem sammen med eleven.</p><p>Faglig inspiration: <a href="https://emu.dk/grundskole/dansk/systematisk-fokus-paa-ordforraad-og-mundtlighed-er-fundamentet-laesning-og" target="_blank" rel="noopener noreferrer">EMU – ordforråd og mundtlighed i indskolingen</a>.</p></details>';}
function banner(id,tag){
 const g=GAMES[id];
 return '<div class="banner" style="background-image:url(&quot;assets/3d/banners/'+id+'.svg&quot;)"><div class="banner-copy"><span>'+esc(g.badge)+'</span><'+tag+'>'+esc(g.title)+'</'+tag+'><p>'+esc(g.short)+'</p></div><span class="banner-orbit" aria-hidden="true">'+g.icon+'</span><span class="banner-orbit second" aria-hidden="true">✦</span></div>';
}
function catalog(){
 state.id=null;
 let h='<section class="hero"><div><span class="eyebrow">LÆSEVÆRKSTEDET 3.C · FORSTÅ NYE ORD</span><h1>Gå på opdagelse i ordene</h1><p>Fire nye spil, hvor du finder betydninger, opdager ordgrupper og selv bruger nye ord. Vælg et spil og et niveau.</p></div><img src="assets/3d/laesemakker-ugle.svg" alt="" aria-hidden="true"></section>';
 h+='<div class="levels" role="group" aria-label="Vælg niveau"><strong>Dit niveau:</strong>'+[1,2,3].map(function(n){return '<button type="button" class="level" aria-pressed="'+(n===level)+'" onclick="Ordforraad.setLevel('+n+')">'+titleLevels[n]+'</button>';}).join('')+'</div>';
 h+='<div class="game-grid">'+IDS.map(function(id){const g=GAMES[id];return '<article class="game-card">'+banner(id,"h2")+'<div class="game-body"><span class="skill-label">'+esc(g.focus)+'</span><p>'+esc(g.short)+'</p><div class="card-footer"><span class="tiny">'+(id==="ordlaboratorium"?"3 skriveopgaver":"4 opgaver")+' · '+titleLevels[level]+'</span><button class="btn secondary" type="button" onclick="Ordforraad.start(&quot;'+id+'&quot;)">Start spillet →</button></div></div></article>';}).join('')+'</div>';
 h+='<section class="info"><h2>Sådan øver du nye ord</h2><p>Prøv først at løse opgaven selv. Læs forklaringen bagefter, og sig gerne ordet højt. Hvis du skriver dine egne sætninger, skal du selv og gerne en voksen se på, om de giver mening.</p><p>Din tekst gemmes ikke, når du forlader siden. Vi gemmer kun, hvilke spil der er gennemført på denne enhed.</p></section>'+helpMarkup();
 app.innerHTML=h;window.scrollTo(0,0);setAdvice("ordforraad");
}
function setLevel(n){if(![1,2,3].includes(n))return;level=n;catalog();}
function setupRound(){state.attempted=false;state.options=randomize(state.rounds[state.at].options||[]);state.finished=false;state.feedback="";state.wrong=false;state.review=false;state.checks=[false,false];state.meaning="";state.sentence="";}
function start(id){
 if(!GAMES[id]){catalog();return;}
 const g=GAMES[id];state.id=id;state.at=0;state.points=0;state.rounds=randomize(g.questions.filter(function(q){return q.l===level;}));
 if(!state.rounds.length){catalog();return;}
 setupRound();renderPlay();setAdvice(id);
 try{const u=new URL(window.location.href);u.searchParams.set("spil",id);u.searchParams.set("niveau",String(level));history.replaceState(null,"",u);}catch(e){}
}
function setAdvice(id){
 const g=GAMES[id];
 const update=function(){if(window.Laesemakker?.setAdvice){window.Laesemakker.setAdvice(g?"Læsemakkerens råd til "+g.title:"Find nye ord",g?g.advice:"Læs ordene, tal om betydningen, og prøv at bruge dem i nye sætninger.");}};
 update();if(!window.Laesemakker)window.addEventListener("load",update,{once:true});
}
function current(){return state.rounds[state.at];}
function feedback(){
 if(!state.feedback)return "";
 return '<div class="feedback '+(state.finished?"correct":"")+'" role="status"><strong>'+(state.finished?(state.id==="ordlaboratorium"?"Din tekst er klar til en fælles gennemgang":"Godt fundet!"):state.wrong?"Prøv en gang til":"Før du går videre")+'</strong><p>'+esc(state.feedback)+'</p></div>';
}
function choices(){
 return '<div class="'+(state.id==="begrebsvaerksted"?"bins":"answers")+'" role="group" aria-label="Vælg dit svar">'+state.options.map(function(choice,k){
 const isCategory=state.id==="begrebsvaerksted";
 return '<button type="button" '+(state.finished?"disabled":"")+' onclick="Ordforraad.answer('+k+')">'+(isCategory?'<span class="bin-art" aria-hidden="true">▣</span>':'')+esc(choice)+'</button>';
 }).join('')+'</div>';
}
function question(){
 const q=current();if(state.id==="ordlaboratorium")return writing();
 let h='<span class="eyebrow">'+(state.id==="betydningsbro"?esc(q.relation):state.id==="begrebsvaerksted"?"HVILKEN GRUPPE?":"LÆS TEKSTENS SPOR")+'</span>';
 if(state.id==="betydningsbro")h+='<div class="word-token">'+esc(q.word)+'</div><h2>Hvilket ord har '+(q.relation==="Modsat betydning"?"modsat":"næsten samme")+' betydning?</h2>';
 if(state.id==="begrebsvaerksted")h+='<p class="muted">Tryk på den gruppe, som ordet hører til.</p><div class="word-token concept">'+esc(q.word)+'</div><h2>Hvilken kategori passer bedst?</h2>';
 if(state.id==="ordvalg")h+='<div class="context">'+esc(q.text)+'</div><h2>'+esc(q.prompt)+'</h2>';
 h+=choices();
 if(!state.finished&&state.attempted)h+='<p class="muted">Brug ledetrådene, og prøv et andet svar.</p>';
 return h;
}
function writing(){
 const q=current(),limit={1:5,2:7,3:9}[level];
 let h='<span class="eyebrow">FORKLAR · SKRIV · UNDERSØG</span><h2>Dit nye ord</h2><div class="word-token">'+esc(q.word)+'</div>';
 h+='<p>Hvad betyder ordet? Forklar med dine egne ord, og skriv en sætning, hvor du bruger ordet <strong>'+esc(q.word)+'</strong>.</p>';
 h+='<label for="meaning">1. Forklar ordet med dine egne ord</label><textarea id="meaning" rows="3" maxlength="450" placeholder="Jeg tror, at ordet betyder ..." '+(state.review?"readonly":"")+' oninput="Ordforraad.setText(&quot;meaning&quot;,this.value)">'+esc(state.meaning)+'</textarea>';
 h+='<label for="sentence">2. Skriv din egen sætning</label><p class="muted">Du kan begynde sådan: '+esc(q.starter)+' Brug mindst '+limit+' ord, og afslut med punktum, spørgsmålstegn eller udråbstegn.</p>';
 h+='<textarea id="sentence" rows="3" maxlength="650" placeholder="Skriv en sætning med ordet ..." '+(state.review?"readonly":"")+' oninput="Ordforraad.setText(&quot;sentence&quot;,this.value)">'+esc(state.sentence)+'</textarea>';
 if(!state.review)h+='<div class="actions"><button class="btn secondary" type="button" onclick="Ordforraad.reviewWriting()">Se på min sætning →</button></div>';
 if(state.review && !state.finished){
  h+='<div class="example"><strong>Sammenlign med et eksempel</strong><p><strong>Ordet kan forklares sådan:</strong> '+esc(q.definition)+'</p><p><strong>Eksempel på en sætning:</strong> '+esc(q.example)+'</p><p>Det er ikke den eneste rigtige måde at bruge ordet på.</p></div>';
  h+='<p><strong>3. Undersøg dit eget arbejde</strong></p><div class="review">'+[
  "Jeg har forklaret, hvad ordet betyder, med mine egne ord.",
  "Jeg synes, at ordet passer til den sætning, jeg har skrevet."
  ].map(function(t,k){return '<label><input type="checkbox" '+(state.checks[k]?"checked":"")+' onchange="Ordforraad.setCheck('+k+',this.checked)"><span>'+esc(t)+'</span></label>';}).join('')+'</div>';
  h+='<p class="muted">Siden kan tælle ord og se, om du har brugt det valgte ord. Den kan ikke vurdere, om din forklaring og sætning er sprogligt rigtige. Vis dem gerne til din lærer.</p>';
  h+='<div class="actions"><button class="btn secondary" type="button" onclick="Ordforraad.finishWriting()" '+(!state.checks.every(Boolean)?"disabled":"")+'>Jeg har gennemgået mit ord →</button><button class="btn light" type="button" onclick="Ordforraad.editWriting()">Ret min tekst</button></div>';
 }
 return h;
}
function renderPlay(){
 if(!state.id)return catalog();
 const id=state.id,q=current(),g=GAMES[id],total=state.rounds.length;
 let h='<div class="topline"><a class="btn light" href="index.html?omraade=ordforraad">← Vælg øveområde</a><span class="tiny">'+titleLevels[level]+' · Opgave '+(state.at+1)+' af '+total+'</span></div>';
 h+=banner(id,"h1")+'<div class="progress" role="progressbar" aria-label="Fremgang" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+state.at+'"><div style="width:'+(100*state.at/total)+'%"></div></div>';
 h+='<section class="stage"><div class="micro-learning"><span aria-hidden="true">🎯</span><strong>Det øver jeg:</strong> '+esc(g.focus)+'.</div>'+question()+feedback();
 if(state.finished)h+='<div class="actions"><button class="btn secondary" type="button" onclick="Ordforraad.next()">'+(state.at+1===total?"Se min afslutning →":"Næste opgave →")+'</button></div>';
 h+='<details class="learning-details"><summary>📖 Se mine læringsmål og få dem læst højt</summary>'+(window.Laeringsmaal?.intro(id)||'')+'</details></section>';
 h+='<section class="info"><strong>Et læseråd:</strong> '+esc(g.advice)+' <span class="muted">Du kan også trykke på Læsemakkeren og få rådet læst højt.</span></section>';
 app.innerHTML=h;window.scrollTo(0,0);
}
function answer(index){
 if(!state.id||state.id==="ordlaboratorium"||state.finished)return;
 const selected=state.options[index];if(typeof selected!=="string")return;
 const q=current();
 if(selected===q.answer){
  if(!state.attempted)state.points++;
  state.finished=true;state.feedback=q.why;state.wrong=false;
  say("Det passer. "+q.why);
 }else{
  state.attempted=true;state.feedback=state.id==="ordvalg"?"Læs hele teksten igen. Hvilke spor hjælper dig?":state.id==="begrebsvaerksted"?"Prøv at sige: Ordet er en slags ... Hvilken gruppe passer?":"Se på, om der står næsten samme eller modsat betydning.";
  state.wrong=true;say("Prøv igen. "+state.feedback);
 }
 renderPlay();
}
function setText(field,value){if(state.id!=="ordlaboratorium"||state.review||!["meaning","sentence"].includes(field))return;state[field]=String(value).slice(0,field==="meaning"?450:650);}
function setCheck(i,checked){if(state.id!=="ordlaboratorium"||!state.review||![0,1].includes(i))return;state.checks[i]=!!checked;const b=app.querySelector(".review + .muted + .actions .btn");if(b)b.disabled=!state.checks.every(Boolean);}
function editWriting(){if(state.id!=="ordlaboratorium"||!state.review)return;state.review=false;state.feedback="";state.wrong=false;state.checks=[false,false];renderPlay();}
function reviewWriting(){
 if(state.id!=="ordlaboratorium"||state.review)return;
 const q=current(),meaning=state.meaning.trim(),sentence=state.sentence.trim(),min={1:5,2:7,3:9}[level];
 const wordCount=function(s){return (s.match(/[\p{L}]+/gu)||[]).length;};
 const words=(sentence.toLocaleLowerCase("da-DK").match(/[\p{L}]+/gu)||[]);
 let msg="";
 if(wordCount(meaning)<3)msg="Skriv mindst tre ord, når du forklarer betydningen.";
 else if(!words.includes(q.word.toLocaleLowerCase("da-DK")))msg="Brug ordet "+q.word+" præcis som det står på kortet.";
 else if(words.length<min)msg="Skriv lidt mere. Din sætning skal have mindst "+min+" ord.";
 else if(!/[.!?]$/.test(sentence))msg="Husk punktum, spørgsmålstegn eller udråbstegn til sidst.";
 if(msg){state.feedback=msg;state.wrong=true;say(msg);renderPlay();return;}
 state.review=true;state.feedback="Du har skrevet en forklaring og en sætning. Se på eksemplet, og vurder selv betydningen. Programmet har endnu ikke kontrolleret, om ordene er brugt rigtigt.";state.wrong=false;
 renderPlay();say("Læs eksemplet, og gennemgå de to punkter.");
}
function finishWriting(){
 if(state.id!=="ordlaboratorium"||!state.review||!state.checks.every(Boolean))return;
 state.finished=true;state.feedback="Du har gennemgået dit ord og din sætning. Vis gerne dit eksempel til en lærer eller en makker, og lyt til deres forslag. Det er ikke blevet rettet automatisk.";state.wrong=false;say("Du er klar til næste ord.");
 renderPlay();
}
function next(){if(!state.finished||!state.id)return;state.at++;if(state.at>=state.rounds.length)return finish();setupRound();renderPlay();}
function finish(){
 const id=state.id,g=GAMES[id];if(!g)return catalog();
 try{const k="laese3c_extra_done",a=JSON.parse(localStorage.getItem(k)||"[]");const u=new Set(Array.isArray(a)?a:[]);u.add(id);localStorage.setItem(k,JSON.stringify([...u]));}catch(e){}
 const writing=id==="ordlaboratorium",count=state.rounds.length;
 let h='<section class="finish-hero"><span class="eyebrow">DU HAR GENNEMFØRT '+esc(g.title.toLocaleUpperCase("da-DK"))+'</span><h1>Godt arbejdet!</h1>';
 if(writing){h+='<div class="result-value">'+count+' nye ord</div><p>Du har forklaret og brugt tre ord i dine egne sætninger.</p>';}
 else h+='<div class="result-value">'+state.points+' af '+count+'</div><p>Opgaver løst rigtigt i første forsøg. Tallene viser kun, hvordan du svarede i denne runde.</p>';
 h+='<div class="actions"><button class="btn" type="button" onclick="Ordforraad.start(&quot;'+id+'&quot;)">Spil igen ↻</button><a class="btn secondary" href="index.html?omraade=ordforraad">Vælg flere ordspil →</a></div></section>';
 if(writing){
  h+='<div class="info"><h2>Hvad har jeg øvet?</h2><p>Du har arbejdet med at forklare nye ord og bruge dem i egne sætninger. Programmet har ikke vurderet, om dine tekster er rigtige. Fortæl din lærer, hvordan du har brugt ordene, og prøv et nyt eksempel sammen.</p><p><strong>Mit næste skridt:</strong> Brug et af ordene i en ny samtale eller tekst. Kan en anden forstå det ud fra din sætning?</p></div>';
 }else h+=(window.Laeringsmaal?.result(id,state.points,count,"choice",[])||'<div class="info">Prøv at forklare, hvorfor dit svar passer, og find et nyt eksempel.</div>');
 h+='<div class="info"><strong>Til dig og din lærer:</strong> Spillene er selvstændige øveaktiviteter, ikke standardiserede læse- eller sprogprøver. Resultatet skal ses sammen med elevens mundtlige forklaringer og øvrige arbejde.</div>';
 app.innerHTML=h;window.scrollTo(0,0);say("Spillet er gennemført.");
}
window.Ordforraad={GAMES:GAMES,start:start,setLevel:setLevel,answer:answer,next:next,setText:setText,setCheck:setCheck,reviewWriting:reviewWriting,editWriting:editWriting,finishWriting:finishWriting,catalog:catalog,getState:function(){return {id:state.id,level:level,at:state.at,points:state.points,finished:state.finished,review:state.review,roundCount:state.rounds.length};}};
const requested=params.get("spil");
if(GAMES[requested])start(requested);else catalog();
})();
