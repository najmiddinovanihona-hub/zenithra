/* Yoqilgan funksiyalar paneli: yuqori paneldagi guruhlar ichida yoqilgan tugma (class "active") 
   pastki boshqaruv qatori ustida alohida chip bo'lib chiqadi — [belgi nomi ✕]. ✕ bosilsa funksiya o'chadi va chip yo'qoladi.
   Tugmalarning o'z mantig'i o'zgarmaydi: o'chirish — o'sha tugmani qayta bosish (sayohat — window.__solar.stopTour). */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=document.documentElement.lang; return LANGS.indexOf(l)>=0?l:'uz'; };
const TX={ off:{uz:'O‘chirish',ru:'Выключить',en:'Turn off'}, allOff:{uz:'Hammasini o‘chirish',ru:'Выключить всё',en:'Turn all off'},
  tour:{uz:'Sayohat',ru:'Путешествие',en:'Tour'} };
const T=o=>o[L()]||o.uz;
const click=f=>{ try{ window.__solar&&window.__solar.click&&window.__solar.click(f); }catch(e){} };

let tray=null;
// kuzatiladigan tugmalar: yuqori panel guruhlaridagi barcha .icon-btn (yangi qo'shilganlari ham)
const buttons=()=>[...document.querySelectorAll('.tb-panel .icon-btn')].filter(b=>b.id&&b.id!=='labsBtn'&&b.id!=='skyBtn');
const label=b=>(b.id==='toursBtn'?T(TX.tour):(b.title||b.getAttribute('aria-label')||b.id)).split(' — ')[0];
const icon=b=>(b.textContent||'').trim().slice(0,4);
function turnOff(b){ if(!b||!b.classList.contains('active')) return;
  if(b.id==='toursBtn'){ const s=window.__solar; if(s&&typeof s.stopTour==='function') s.stopTour(true); return; }
  b.click(); }
function render(){ if(!tray) return; const act=buttons().filter(b=>b.classList.contains('active'));
  const keep=new Set(act.map(b=>b.id));
  tray.querySelectorAll('.atr-chip').forEach(c=>{ if(!keep.has(c.dataset.id)&&!c.classList.contains('out')){ c.classList.add('out'); setTimeout(()=>c.remove(),220); } });
  act.forEach(b=>{ let c=tray.querySelector('.atr-chip[data-id="'+b.id+'"]');
    if(!c){ c=document.createElement('div'); c.className='atr-chip glass'; c.dataset.id=b.id; c.setAttribute('role','status');
      c.innerHTML='<span class="atr-dot" aria-hidden="true"></span><span class="atr-ico" aria-hidden="true"></span><span class="atr-lbl"></span><button class="atr-x" type="button">✕</button>';
      c.querySelector('.atr-x').addEventListener('click',e=>{ e.stopPropagation(); click(440); turnOff(document.getElementById(b.id)); setTimeout(render,60); });
      tray.querySelector('.atr-list').appendChild(c); }
    c.querySelector('.atr-ico').textContent=icon(b); c.querySelector('.atr-lbl').textContent=label(b);
    const x=c.querySelector('.atr-x'); x.title=T(TX.off)+': '+label(b); x.setAttribute('aria-label',x.title); });
  const all=tray.querySelector('.atr-all'); all.textContent=T(TX.allOff); all.hidden=act.length<2;
  tray.classList.toggle('on',act.length>0); place(); }
// pastki boshqaruv qatori ustiga joylash (yuqorida sana va boshqa panellar ochiladi); yuqori panel yashirin bo'lsa — ko'rinmaydi
function place(){ if(!tray) return; const tb=document.getElementById('topbar'), bb=document.getElementById('bottomBar');
  const top=bb&&!bb.classList.contains('hidden')?bb.getBoundingClientRect().top:innerHeight; tray.style.top=''; tray.style.bottom=Math.max(12,innerHeight-top+10)+'px';
  tray.classList.toggle('hid',!!(tb&&tb.classList.contains('hidden'))); }
function init(){ if(tray||!document.querySelector('.tb-panel')) return;
  tray=document.createElement('div'); tray.id='activeTray'; tray.setAttribute('aria-live','polite');
  tray.innerHTML='<div class="atr-list"></div><button class="atr-all" type="button" hidden></button>';
  document.body.appendChild(tray);
  tray.querySelector('.atr-all').addEventListener('click',()=>{ click(400); buttons().filter(b=>b.classList.contains('active')).forEach(turnOff); setTimeout(render,80); });
  // tugmalar holati o'zgarishi (class), yangi tugmalar qo'shilishi, til va panel ko'rinishi
  const mo=new MutationObserver(render);
  document.querySelectorAll('.tb-panel').forEach(p=>mo.observe(p,{ subtree:true, childList:true, attributes:true, attributeFilter:['class','title'] }));
  const tb=document.getElementById('topbar'); if(tb) new MutationObserver(place).observe(tb,{ attributes:true, attributeFilter:['class'] });
  new MutationObserver(render).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
  addEventListener('resize',place); render(); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0)); else setTimeout(init,0);
})();
