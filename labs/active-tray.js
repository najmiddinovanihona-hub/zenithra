/* Yoqilgan funksiyalar: yuqori paneldagi guruhlar ichida yoqilgan tugma (class "active") pastki sahna boshqaruvi
   (⏸ tezlik ⤢) ichida kichik dumaloq belgi bo'lib chiqadi; nomi — sichqoncha ustiga borganda. Bosilsa funksiya o'chadi
   va belgi yo'qoladi. Tugmalarning o'z mantig'i o'zgarmaydi: o'chirish — o'sha tugmani qayta bosish (sayohat — window.__solar.stopTour). */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=document.documentElement.lang; return LANGS.indexOf(l)>=0?l:'uz'; };
const TX={ off:{uz:'o‘chirish',ru:'выключить',en:'turn off'}, allOff:{uz:'Hammasini o‘chirish',ru:'Выключить всё',en:'Turn all off'},
  tour:{uz:'Sayohat',ru:'Путешествие',en:'Tour'}, group:{uz:'Yoqilgan funksiyalar',ru:'Включённые функции',en:'Active features'} };
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
function render(){ if(!tray) return; const act=buttons().filter(b=>b.classList.contains('active')), keep=new Set(act.map(b=>b.id));
  tray.querySelectorAll('.atr-chip').forEach(c=>{ if(!keep.has(c.dataset.id)) c.remove(); });
  act.forEach(b=>{ let c=tray.querySelector('.atr-chip[data-id="'+b.id+'"]');
    if(!c){ c=document.createElement('button'); c.type='button'; c.className='atr-chip'; c.dataset.id=b.id; c.innerHTML='<span class="atr-ico" aria-hidden="true"></span><i class="atr-x" aria-hidden="true">✕</i>';
      c.addEventListener('click',e=>{ e.stopPropagation(); click(440); turnOff(document.getElementById(b.id)); setTimeout(render,60); });
      tray.insertBefore(c,tray.querySelector('.atr-all')); }
    c.querySelector('.atr-ico').textContent=icon(b); c.title=label(b)+' — '+T(TX.off); c.setAttribute('aria-label',c.title); });
  const all=tray.querySelector('.atr-all'); all.title=T(TX.allOff); all.setAttribute('aria-label',all.title); all.hidden=act.length<2;
  tray.setAttribute('aria-label',T(TX.group)); tray.hidden=act.length===0; }
function init(){ const sim=document.querySelector('.tb-sim'); if(tray||!sim||!document.querySelector('.tb-panel')) return;
  tray=document.createElement('div'); tray.id='activeTray'; tray.setAttribute('role','group'); tray.hidden=true;
  tray.innerHTML='<button class="atr-all" type="button" hidden>⊘</button>';
  sim.appendChild(tray);
  tray.querySelector('.atr-all').addEventListener('click',e=>{ e.stopPropagation(); click(400); buttons().filter(b=>b.classList.contains('active')).forEach(turnOff); setTimeout(render,80); });
  // tugmalar holati (class), yangi tugmalar va til o'zgarishi
  const mo=new MutationObserver(render);
  document.querySelectorAll('.tb-panel').forEach(p=>mo.observe(p,{ subtree:true, childList:true, attributes:true, attributeFilter:['class','title'] }));
  new MutationObserver(render).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
  render(); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0)); else setTimeout(init,0);
})();
