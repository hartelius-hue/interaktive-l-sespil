
(function(){
"use strict";
if(document.getElementById("laesemakker-root"))return;
const TIPS=[
 {title:"Lyt, sig og skriv",body:"Lyt til hele ordet. Sig det langsomt for dig selv, og læg mærke til hver lyd. Skriv ordet. Lyt igen, hvis du bliver i tvivl."},
 {title:"Træk lydene sammen",body:"Se på bogstaverne fra venstre mod højre. Sig lydene, og træk dem sammen til et ord. Læs det bagefter i ét stræk."},
 {title:"Klap stavelserne",body:"Sig ordet højt, og klap dets stavelser. Skriv én del ad gangen. Til sidst læser du hele ordet."},
 {title:"Undersøg stavemønstret",body:"Lyt til vokalen. Se på bogstaverne omkring den. Sammenlign med ord som sommer og kasse. Skal der være én eller to konsonanter?"},
 {title:"Hold øje med endelserne",body:"Læs hele sætningen. Er der én eller flere? Er det noget, personen gør lige nu? Det kan hjælpe dig med at stave endelsen."},
 {title:"Find ordets betydningsdele",body:"Prøv at dele et langt ord i ord, du kender. I regnjakke finder du regn og jakke. Hvad fortæller de to dele tilsammen?"},
 {title:"Find tekstens spor",body:"Hvad står der faktisk? Og hvad kan du slutte? Find de ord eller sætninger, som hjælper dig med at forklare svaret."},
 {title:"Læs igen, hvis noget driller",body:"Hvis en sætning ikke giver mening, så læs den igen. Læg mærke til små ord som ikke, men og i stedet."},
 {title:"Læs med flyd og forståelse",body:"Du må gerne få mere flyd, når du læser samme tekst igen. Men læs stadig præcist, og læg mærke til, hvad historien fortæller."},
 {title:"Sammenhold oplysninger",body:"Læs begge tekstkort, før du svarer. Er påstanden støttet, modsagt, eller mangler du en oplysning? Peg på det sted i teksten, der viser det."}
];
const GAME_TIP={
 "maze":1,"onset":1,"blend":1,"picture":7,"caption":6,"story":6,"order":6,"double":3,"syllable":2,"sort":1,"sentence":4,"infer":6,"noise":7,"vocab":5,"compass":6,
 "lydbro":1,"vrovle":1,"ordblik":7,"stavelser":2,"vokaler":3,"dobbelte":3,"stumme":7,"endelser":4,"sammensat":5,"nutidsr":4,"skriv":2,"tekstspor":6,"tekstkompas":6,"genlaes":8,"diktat-ord":0,"diktat-vrovle":0,"ordglimt":8,"flydelaesning":8,"tekstkilder":9,"teksttjek":9
};
const SVG='<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="60" cy="79" rx="50" ry="47" fill="#236c7c"/><path d="M18 53L15 20l27 19M102 53l3-33-27 19" fill="#236c7c" stroke="#174b61" stroke-width="4" stroke-linejoin="round"/><ellipse cx="60" cy="66" rx="42" ry="35" fill="#fff2dc"/><circle cx="44" cy="62" r="21" fill="none" stroke="#183554" stroke-width="6"/><circle cx="78" cy="62" r="21" fill="none" stroke="#183554" stroke-width="6"/><path d="M65 57h-4" stroke="#183554" stroke-width="6"/><circle cx="44" cy="62" r="5" fill="#233755"/><circle cx="78" cy="62" r="5" fill="#233755"/><path d="M54 78l7 9 7-9z" fill="#edb951"/><path d="M23 93L61 103l39-10v30l-38 8-39-8z" fill="#fff6d9" stroke="#183e58" stroke-width="4" stroke-linejoin="round"/><path d="M61 103v28" stroke="#183e58" stroke-width="4"/><path d="M32 105l20 5M70 110l20-5" stroke="#9dbbc7" stroke-width="3" stroke-linecap="round"/></svg>';
const root=document.createElement("div");root.id="laesemakker-root";root.className="lm-wiggle";
root.innerHTML='<button class="lm-launch" type="button" aria-expanded="false" aria-controls="lm-panel" aria-label="Åbn Læsemakker og få et læseråd"><span class="lm-avatar">'+SVG+'</span><span class="lm-launch-label">💛 Få et læseråd</span></button><section class="lm-panel" id="lm-panel" role="dialog" aria-label="Læsemakkers gode råd" hidden><div class="lm-head"><span class="lm-avatar">'+SVG+'</span><div><strong>Læsemakker</strong><span>Din ven, når du læser og staver</span></div><button class="lm-close" type="button" aria-label="Luk Læsemakker">✕</button></div><div class="lm-bubble"><p class="lm-context"></p><p class="lm-text"></p></div><div class="lm-actions"><button class="lm-speak" type="button">🔊 Hør rådet</button><button class="lm-next" type="button">↻ Et andet råd</button><button class="lm-stop" type="button">■ Stop lyd</button></div><p class="lm-note" aria-live="polite">Rådene bliver læst op med en dansk computerstemme, hvis din enhed har en.</p></section>';
document.body.appendChild(root);
const launch=root.querySelector(".lm-launch"),panel=root.querySelector(".lm-panel"),close=root.querySelector(".lm-close"),context=root.querySelector(".lm-context"),copy=root.querySelector(".lm-text"),note=root.querySelector(".lm-note");
let activeId=null,tipIndex=6,manual=false,externalTip=null;
function cancel(){if("speechSynthesis" in window){try{speechSynthesis.cancel()}catch(e){}}}
function render(){const item=externalTip||TIPS[tipIndex];context.textContent=item.title;copy.textContent=item.body;}
function setContext(id){if(id===activeId)return;activeId=id;manual=false;externalTip=null;tipIndex=Object.hasOwn(GAME_TIP,id)?GAME_TIP[id]:6;render();}
function setAdvice(title,body){manual=false;externalTip={title:String(title),body:String(body)};render();}
function toggle(open){panel.hidden=!open;launch.setAttribute("aria-expanded",String(open));if(!open){cancel();note.textContent="Rådene kan læses højt med en dansk computerstemme.";launch.focus();}else {render();close.focus();}}
launch.addEventListener("click",()=>toggle(panel.hidden));
close.addEventListener("click",()=>toggle(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false)});
root.querySelector(".lm-next").addEventListener("click",()=>{cancel();externalTip=null;tipIndex=(tipIndex+1)%TIPS.length;manual=true;render();});
root.querySelector(".lm-stop").addEventListener("click",()=>{cancel();note.textContent="Oplæsningen er stoppet."});
root.querySelector(".lm-speak").addEventListener("click",()=>{
 if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance==="undefined"){note.textContent="Denne enhed kan ikke læse teksten højt. Du kan læse rådet i boblen.";return;}
 const voices=speechSynthesis.getVoices(),danish=voices.find(v=>/^da(?:-|_|$)/i.test(v.lang));
 if(voices.length>0&&!danish){note.textContent="Der er ingen dansk oplæsningsstemme på enheden. Læs rådet i boblen, eller vælg dansk stemme i enhedens indstillinger.";return;}
 cancel();
 const tip=externalTip||TIPS[tipIndex];
 const u=new SpeechSynthesisUtterance(tip.title+". "+tip.body);u.lang="da-DK";u.rate=.88;u.pitch=1;
 if(danish)u.voice=danish;
 u.onerror=()=>{note.textContent="Oplæsningen kunne ikke starte. Du kan stadig læse rådet i boblen.";};
 u.onend=()=>{note.textContent="Du kan høre rådet igen eller vælge et nyt.";};
 try{speechSynthesis.speak(u);note.textContent="Læsemakker læser rådet højt …";}catch(e){note.textContent="Oplæsningen kunne ikke startes på denne enhed.";}
});
window.Laesemakker={setContext,setAdvice,open:()=>toggle(true),stop:cancel,tips:TIPS.map(t=>({title:t.title,body:t.body}))};
const params=new URLSearchParams(location.search);const initial=params.get("spil");if(initial)setContext(initial);else setContext("home");
})();
