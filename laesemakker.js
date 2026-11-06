
(function(){
"use strict";
if(document.getElementById("laesemakker-root"))return;
const TIPS=[{"title":"Lyt, sig og skriv","body":"Hør ordet. Sig det langsomt for dig selv, og lyt efter lydene. Skriv ordet, og hør det igen, hvis du er i tvivl."},{"title":"Sæt lydene sammen","body":"Læs fra venstre mod højre. Sig lydene en ad gangen, og træk dem sammen. Læs så hele ordet."},{"title":"Klap stavelserne","body":"Sig ordet højt, og klap stavelserne. Skriv én stavelse ad gangen. Læs hele ordet til sidst."},{"title":"Kort vokal og dobbeltkonsonant","body":"Sig ordet højt. Er den betonede vokal kort eller lang? Når en kort vokal står foran en konsonant mellem to vokaler, skriver vi som regel konsonanten to gange: kasse, sommer. Ved lang vokal er der som regel kun én: læse."},{"title":"Kig på endelsen","body":"Læs hele sætningen. Er der én eller flere? Er det noget, der sker lige nu? Det hjælper dig med at vælge den rigtige endelse."},{"title":"Find de små ord i det store","body":"Er ordet sat sammen af to ord, du kender? I regnjakke kan du finde regn og jakke. Hvad betyder de tilsammen?"},{"title":"Find spor i teksten","body":"Hvad står der i teksten? Hvad kan du læse mellem linjerne? Find det sted, der hjælper dig med at forklare svaret."},{"title":"Læs en gang til","body":"Giver sætningen ikke mening? Læs den igen. Små ord som ikke, men og i stedet kan ændre betydningen."},{"title":"Læs med flyd – og forstå det","body":"Når du læser teksten anden gang, bliver nogle ord måske lettere. Husk stadig at læse rigtigt og tænke over, hvad teksten handler om."},{"title":"Brug begge tekster","body":"Læs begge tekstkort. Hvad fortæller de tilsammen? Find de ord, der støtter dit svar. Er der noget, vi ikke kan vide?"},{"title":"Byg ord af morfemer","body":"Find de dele, der betyder noget. I regnjakke betyder både regn og jakke noget. En endelse kan vise, om der er én, flere eller noget bestemt. Prøv at bygge og skrive ordene selv."}];
const GAME_TIP={"maze":1,"onset":1,"blend":1,"picture":7,"caption":6,"story":6,"order":6,"double":3,"syllable":2,"sort":1,"sentence":4,"infer":6,"noise":7,"vocab":5,"compass":6,"lydbro":1,"vrovle":1,"ordblik":7,"stavelser":2,"vokaler":3,"dobbelte":3,"stumme":7,"endelser":4,"sammensat":10,"nutidsr":4,"skriv":2,"tekstspor":6,"tekstkompas":6,"genlaes":8,"diktat-ord":0,"diktat-vrovle":0,"ordglimt":8,"flydelaesning":8,"tekstkilder":9,"teksttjek":9,"morfem-byg":10,"morfem-endelser":10};
const SVG='<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="60" cy="79" rx="50" ry="47" fill="#236c7c"/><path d="M18 53L15 20l27 19M102 53l3-33-27 19" fill="#236c7c" stroke="#174b61" stroke-width="4" stroke-linejoin="round"/><ellipse cx="60" cy="66" rx="42" ry="35" fill="#fff2dc"/><circle cx="44" cy="62" r="21" fill="none" stroke="#183554" stroke-width="6"/><circle cx="78" cy="62" r="21" fill="none" stroke="#183554" stroke-width="6"/><path d="M65 57h-4" stroke="#183554" stroke-width="6"/><circle cx="44" cy="62" r="5" fill="#233755"/><circle cx="78" cy="62" r="5" fill="#233755"/><path d="M54 78l7 9 7-9z" fill="#edb951"/><path d="M23 93L61 103l39-10v30l-38 8-39-8z" fill="#fff6d9" stroke="#183e58" stroke-width="4" stroke-linejoin="round"/><path d="M61 103v28" stroke="#183e58" stroke-width="4"/><path d="M32 105l20 5M70 110l20-5" stroke="#9dbbc7" stroke-width="3" stroke-linecap="round"/></svg>';
const root=document.createElement("div");root.id="laesemakker-root";root.className="lm-wiggle";
root.innerHTML='<button class="lm-launch" type="button" aria-expanded="false" aria-controls="lm-panel" aria-label="Åbn Læsemakker og få et læseråd"><span class="lm-avatar">'+SVG+'</span><span class="lm-launch-label">💛 Få et læseråd</span></button><section class="lm-panel" id="lm-panel" role="dialog" aria-label="Læsemakkers gode råd" hidden><div class="lm-head"><span class="lm-avatar">'+SVG+'</span><div><strong>Læsemakker</strong><span>Gode råd til læsning og stavning</span></div><button class="lm-close" type="button" aria-label="Luk Læsemakker">✕</button></div><div class="lm-bubble"><p class="lm-context"></p><p class="lm-text"></p></div><div class="lm-actions"><button class="lm-speak" type="button">🔊 Hør rådet</button><button class="lm-next" type="button">↻ Et andet råd</button><button class="lm-stop" type="button">■ Stop lyd</button></div><p class="lm-note" aria-live="polite">Du kan få rådet læst højt, hvis din enhed har en dansk stemme.</p></section>';
document.body.appendChild(root);
const launch=root.querySelector(".lm-launch"),panel=root.querySelector(".lm-panel"),close=root.querySelector(".lm-close"),context=root.querySelector(".lm-context"),copy=root.querySelector(".lm-text"),note=root.querySelector(".lm-note");
let activeId=null,tipIndex=6,manual=false,externalTip=null;
function cancel(){if("speechSynthesis" in window){try{speechSynthesis.cancel()}catch(e){}}}
function render(){const item=externalTip||TIPS[tipIndex];context.textContent=item.title;copy.textContent=item.body;}
function setContext(id){if(id===activeId)return;activeId=id;manual=false;externalTip=null;tipIndex=Object.hasOwn(GAME_TIP,id)?GAME_TIP[id]:6;render();}
function setAdvice(title,body){manual=false;externalTip={title:String(title),body:String(body)};render();}
function toggle(open){panel.hidden=!open;launch.setAttribute("aria-expanded",String(open));if(!open){cancel();note.textContent="Du kan få rådet læst højt, hvis der er en dansk stemme på enheden.";launch.focus();}else {render();close.focus();}}
launch.addEventListener("click",()=>toggle(panel.hidden));
close.addEventListener("click",()=>toggle(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false)});
root.querySelector(".lm-next").addEventListener("click",()=>{cancel();externalTip=null;tipIndex=(tipIndex+1)%TIPS.length;manual=true;render();});
root.querySelector(".lm-stop").addEventListener("click",()=>{cancel();note.textContent="Oplæsningen er stoppet."});
root.querySelector(".lm-speak").addEventListener("click",()=>{
 if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance==="undefined"){note.textContent="Her virker oplæsningen ikke. Du kan stadig læse rådet her.";return;}
 const voices=speechSynthesis.getVoices(),danish=voices.find(v=>/^da(?:-|_|$)/i.test(v.lang));
 if(voices.length>0&&!danish){note.textContent="Der er ingen dansk stemme på enheden. Læs rådet her, eller bed en voksen om hjælp med lyden.";return;}
 cancel();
 const tip=externalTip||TIPS[tipIndex];
 const u=new SpeechSynthesisUtterance(tip.title+". "+tip.body);u.lang="da-DK";u.rate=.92;u.pitch=1;
 if(danish)u.voice=danish;
 u.onerror=()=>{note.textContent="Lyden kunne ikke starte. Du kan stadig læse rådet her.";};
 u.onend=()=>{note.textContent="Vil du høre rådet igen? Eller vil du have et andet?";};
 try{speechSynthesis.speak(u);note.textContent="Læsemakker læser op …";}catch(e){note.textContent="Lyden kunne ikke starte på denne enhed.";}
});
window.Laesemakker={setContext,setAdvice,open:()=>toggle(true),stop:cancel,tips:TIPS.map(t=>({title:t.title,body:t.body}))};
const params=new URLSearchParams(location.search);const initial=params.get("spil");if(initial)setContext(initial);else setContext("home");
})();
