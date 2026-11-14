/* LAZY — katta ma'lumot fayllari (rasadxonalar, asboblar, olimlar, kosmonavtlar, ilmiy bo'lim)
   sahifa ochilganda emas, tegishli bo'lim BIRINCHI ochilganda yuklanadi (asosiy sahna tezroq ochilishi uchun).
   Tugma ustiga kursor kelganda yuklash oldindan boshlanadi. Har guruh bir marta yuklanadi; tartib saqlanadi. */
(function(){
const G={
  obs:['labs/obs-models.js?v=9','labs/obs-models2.js?v=7','labs/obs-data.js?v=1','labs/obs-photos.js?v=1','labs/obs-text.js?v=1','labs/obs-text-ru.js?v=1'],
  ins:['labs/ins-models.js?v=3','labs/ins-models2.js?v=5'],
  sci:['labs/sci-data-1.js?v=1','labs/sci-data-2.js?v=2','labs/sci-data-3.js?v=2','labs/sci-data-4.js?v=1','labs/sci-data-5.js?v=1','labs/sci-photos.js?v=1'],
  ast:['labs/ast-data-1.js?v=2','labs/ast-data-2.js?v=2','labs/ast-data-3.js?v=2','labs/ast-data-4.js?v=2','labs/ast-data-5.js?v=2','labs/ast-photos.js?v=3'],
  ilmiy:['labs/ilmiy-d1.js?v=1','labs/ilmiy-d2.js?v=1','labs/ilmiy-d3.js?v=1','labs/ilmiy-d4.js?v=1','labs/ilmiy-d5.js?v=1','labs/ilmiy-x1.js?v=1','labs/ilmiy-x2.js?v=1','labs/ilmiy-x3.js?v=1','labs/ilmiy-x4.js?v=1','labs/ilmiy-x5.js?v=1'],
};
const P={};
function load(k){
  if(P[k]) return P[k];
  const files=G[k]||[];
  P[k]=new Promise(res=>{
    if(!files.length) return res();
    let n=0;
    files.forEach(f=>{ const s=document.createElement('script'); s.src=f; s.async=false;   // async=false — tartib saqlanadi
      s.onload=s.onerror=()=>{ if(++n===files.length) res(); }; document.body.appendChild(s); });
  });
  return P[k];
}
const BTN={ obsWorldBtn:'obs', insBtn:'ins', sciBtn:'sci', astBtn:'ast', ilmiyBtn:'ilmiy' };
const SEL='#obsWorldBtn,#insBtn,#sciBtn,#astBtn,#ilmiyBtn';
// kursor/barmoq tugmaga yetganda — oldindan yuklash
['pointerover','pointerdown','focusin'].forEach(ev=>document.addEventListener(ev,e=>{ const b=e.target.closest&&e.target.closest(SEL); if(b&&BTN[b.id]) load(BTN[b.id]); },true));
window.LAZY={ load, loaded:k=>!!P[k], groups:Object.keys(G) };
})();
