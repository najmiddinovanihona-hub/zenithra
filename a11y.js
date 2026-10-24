/* Kirish imkoniyati (ekran o'quvchi dasturlar uchun): faqat ikonkadan iborat tugmalarga nom beradi.
   - title'i bor tugma (yuqori panel 🚀📖🎓…) — title matni aria-label'ga ko'chiriladi (u allaqachon 3 tilda);
   - ✕ / ◀ / ▶ kabi belgili tugmalar — 3 tilli "Yopish / Oldingi / Keyingi".
   Butun DOM'ni doimiy kuzatish o'rniga (sahna har kadrda matn yangilaydi — ortiqcha yuk) yuklanganda,
   til o'zgarganda va har bosishdan keyin (yangi panel/laboratoriya ochilganda) bir marta tekshiriladi. */
(function(){
  const TX={ close:{uz:'Yopish',ru:'Закрыть',en:'Close'}, prev:{uz:'Oldingi',ru:'Назад',en:'Previous'}, next:{uz:'Keyingi',ru:'Далее',en:'Next'} };
  const lang=()=>{ const l=document.documentElement.lang; return TX.close[l]?l:'uz'; };
  const WORDY=/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ0-9]{2,}/;   // ichida so'z bo'lsa — tugma o'zi nomlangan
  function label(b){
    const txt=(b.textContent||'').trim();
    if(WORDY.test(txt)) return;
    let name=(b.getAttribute('title')||'').trim();
    if(!name){
      if(/^[✕×✖]$/.test(txt)) name=TX.close[lang()];
      else if(/^[◀‹←⟨]$/.test(txt)) name=TX.prev[lang()];
      else if(/^[▶›→⟩]$/.test(txt)) name=TX.next[lang()];
    }
    if(name && b.getAttribute('aria-label')!==name) b.setAttribute('aria-label',name);
  }
  let pending=0;
  function scan(){ pending=0; document.querySelectorAll('button').forEach(label); }
  const later=()=>{ if(!pending) pending=window.requestIdleCallback?requestIdleCallback(scan,{timeout:400}):setTimeout(scan,0); };   // 3D sahna doim band — timeout bo'lmasa skan juda kechikardi
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scan); else scan();
  window.addEventListener('load',()=>setTimeout(scan,1500));
  document.addEventListener('click',later,true);
  document.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') later(); },true);
  new MutationObserver(later).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  // ba'zi modullar tugma sarlavhasini til almashgandan biroz keyin yangilaydi — aria-label shunga ergashadi (faqat title kuzatiladi, yengil)
  new MutationObserver(ms=>ms.forEach(m=>{ if(m.target.tagName==='BUTTON') label(m.target); })).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['title']});
})();
