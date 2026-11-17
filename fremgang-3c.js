/* Læseværksted 3.C: én gennemførelsesstatus på tværs af de 42 spil.
   Bevarer eksisterende lokal statistik. Ingen navn, netværkskald eller elevtekster. */
(function(){
 "use strict";
 const STATS="laese3c_stats",EXTRA="laese3c_extra_done",LOST="laese3c_maze_lost";
 function getStorage(){try{return window.localStorage;}catch(e){return null;}}
 function stats(){
   try{const value=JSON.parse(getStorage()?.getItem(STATS)||"{}");
     return value&&typeof value==="object"&&!Array.isArray(value)?value:{};
   }catch(e){return {};}
 }
 function extras(){
   try{const value=JSON.parse(getStorage()?.getItem(EXTRA)||"[]");
     return Array.isArray(value)?value.filter(id=>typeof id==="string"):[];
   }catch(e){return [];}
 }
 function completedIds(onlyIds){
   const stored=stats(),all=new Set(extras());
   for(const [id,record] of Object.entries(stored)){
     if(record&&typeof record==="object"&&!Array.isArray(record)&&
       (Number(record.plays)>=1||Number.isFinite(Number(record.total))))all.add(id);
   }
   if(!Array.isArray(onlyIds))return [...all];
   const unique=new Set(onlyIds.filter(id=>typeof id==="string"));
   return [...unique].filter(id=>all.has(id));
 }
 function has(id){return completedIds().includes(id);}
 function count(ids){return completedIds(ids).length;}
 function record(id){
   if(typeof id!=="string"||!/^[a-z0-9-]+$/.test(id))return false;
   const store=getStorage();if(!store)return false;
   try{
     const next=new Set(extras());next.add(id);
     store.setItem(EXTRA,JSON.stringify([...next]));
     const saved=JSON.parse(store.getItem(EXTRA)||"[]");
     const ok=Array.isArray(saved)&&saved.includes(id);
     if(ok)window.dispatchEvent(new Event("laese3c-progress"));
     return ok;
   }catch(e){return false;}
 }
 function clear(){
   const store=getStorage();if(!store)return false;
   try{store.removeItem(STATS);store.removeItem(EXTRA);store.removeItem(LOST);
     return !store.getItem(STATS)&&!store.getItem(EXTRA)&&!store.getItem(LOST);
   }catch(e){return false;}
 }
 function notice(saved){
   return saved?
      '<p class="completion-confirmation" role="status">✓ Spillet er registreret som gennemført i denne browser. Fluebenet vises i spiloversigten.</p>':
      '<p class="completion-warning" role="alert">Spillet er gennemført, men denne browser kunne ikke gemme fluebenet. Prøv at åbne spillet i et almindeligt browservindue på samme enhed, eller bed din lærer om hjælp.</p>';
 }
 window.LaeseFremgang={completedIds,has,count,record,clear,notice,stats,extras};
})();