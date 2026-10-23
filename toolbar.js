/* Yuqori panel tartibi: 20 ta tugma bir qatorda sig'masdi (kompyuterda bir qismi kesilardi, telefonda yarmi
   yashirin edi). Endi:
     [ASTRO]  [Sayohat ▾] [O'rganish ▾] [Laboratoriya ▾]            [?] [UZ] [👤]
   pastda: [⏸ tezlik ⤢] + sayyoralar paneli; telefonda panel pastki navigatsiyaga aylanadi.
   Mavjud tugmalar O'CHIRILMAYDI — o'z id'lari va ishlovchilari bilan guruh panellariga ko'chiriladi, shuning uchun
   script.js / labs / guide.js dagi barcha mantiq o'zgarmaydi. Band yozuvi — tugmaning title'i (3 tilda). */
(function(){
  const $=id=>document.getElementById(id);
  const topbar=$('topbar'), controls=topbar && topbar.querySelector('.controls');
  if(!controls) return;
  const TX={
    tour:{uz:'Sayohat',ru:'Путешествия',en:'Explore'},
    learn:{uz:'O‘rganish',ru:'Обучение',en:'Learn'},
    lab:{uz:'Laboratoriya',ru:'Лаборатория',en:'Labs'},
    labs:{uz:'Barcha laboratoriyalar',ru:'Все лаборатории',en:'All labs'},
    sky:{uz:'Osmon',ru:'Небо',en:'Sky'},
    sim:{uz:'Sahna boshqaruvi',ru:'Управление сценой',en:'Scene controls'},
  };
  const L=()=>{ const l=document.documentElement.lang; return TX.tour[l]?l:'uz'; };
  const T=o=>o[L()]||o.uz;
  const wrapOf=id=>{ const b=$(id); return b ? (b.closest('.tours-wrap')||b) : null; };

  /* ---------- "Barcha laboratoriyalar" (avval "Kashf etish" ichiga yashiringan edi) ---------- */
  const labsWrap=document.createElement('div'); labsWrap.className='tours-wrap';
  labsWrap.innerHTML='<button id="labsBtn" class="icon-btn" type="button" aria-haspopup="true">🧪</button><div id="labsMenu" class="glass tours-menu" role="menu"></div>';
  const labsBtn=labsWrap.firstChild, labsMenu=labsWrap.lastChild;
  labsBtn.addEventListener('click',e=>{ e.stopPropagation();
    if(!labsMenu.classList.contains('open')){ labsMenu.innerHTML=''; if(window.LABS_MENU) window.LABS_MENU(labsMenu); }
    closeSubs(labsMenu); labsMenu.classList.toggle('open'); });

  /* ---------- Guruhlar ---------- */
  const GROUPS=[
    { key:'tour',  ico:'🚀', items:['toursBtn','discBtn','rtBtn'] },
    { key:'learn', ico:'📖', items:['darsBtn','quizBtn2','ilmiyBtn','sciBtn','astBtn'] },
    { key:'lab',   ico:'🔬', items:[labsWrap,'lsBtn','seasonsBtn','ubBtn','obsWorldBtn','insBtn','skyBtn','weatherBtn','gridBtn','conBtn'] },
  ];
  const groupsEl=document.createElement('div'); groupsEl.className='tb-groups';
  const groups=GROUPS.map(g=>{
    const el=document.createElement('div'); el.className='tb-group';
    el.innerHTML=`<button class="tb-trig" type="button" aria-haspopup="true" aria-expanded="false"><span class="tb-ico" aria-hidden="true">${g.ico}</span><span class="tb-lbl"></span><span class="tb-caret" aria-hidden="true"></span></button><div class="tb-panel glass" role="menu"></div>`;
    const trig=el.firstChild, panel=el.lastChild;
    g.items.forEach(it=>{ const node=typeof it==='string'?wrapOf(it):it; if(node){ node.classList.add('tb-row'); panel.appendChild(node); } });
    trig.addEventListener('click',e=>{ e.stopPropagation(); const open=!el.classList.contains('open'); closeAll(); if(open){ el.classList.add('open'); trig.setAttribute('aria-expanded','true'); document.body.classList.add('tb-open'); } });
    // Oddiy band (yoki ichki menyudagi band) bosilganda guruh yopiladi; ichki menyu tugmasi esa uni ochadi
    panel.addEventListener('click',e=>{
      const sub=e.target.closest('.tours-wrap > .icon-btn');
      if(sub){ const m=sub.parentNode.querySelector('.tours-menu'); setTimeout(()=>closeSubs(m),0); return; }
      if(e.target.closest('.tour-item, .icon-btn')) setTimeout(closeAll,0);
    });
    groupsEl.appendChild(el);
    return { g, el, trig, panel };
  });
  // Ichki menyu (Osmon, Barcha laboratoriyalar) pastki panel ostiga kirib ketmasin: sig'masa yuqoriga suriladi
  // (guruh paneli tepasigacha), baribir sig'masa — ichida aylantiriladi. Telefonda menyu panel ichida (static) — tegilmaydi.
  function fitSub(m){
    m.style.top=''; m.style.maxHeight='';
    if(!m.classList.contains('open') || getComputedStyle(m).position==='static') return;
    const bb=document.getElementById('bottomBar'), bbTop=bb && !bb.classList.contains('hidden') ? bb.getBoundingClientRect().top : innerHeight;
    const limit=Math.min(innerHeight, bbTop)-12, top0=m.closest('.tb-panel').getBoundingClientRect().top;
    const r=m.getBoundingClientRect(), shift=Math.max(0, Math.min(r.bottom-limit, r.top-top0));
    if(shift) m.style.top=(parseFloat(getComputedStyle(m).top)-shift)+'px';
    m.style.maxHeight=Math.max(160, limit-(r.top-shift))+'px';
  }
  const subObs=new MutationObserver(ms=>ms.forEach(x=>fitSub(x.target)));
  groups.forEach(x=>x.panel.querySelectorAll('.tours-menu').forEach(m=>subObs.observe(m,{ attributes:true, attributeFilter:['class'] })));
  addEventListener('resize',()=>document.querySelectorAll('.tb-panel .tours-menu.open').forEach(fitSub));
  function closeSubs(except){ document.querySelectorAll('.tb-panel .tours-menu.open').forEach(m=>{ if(m!==except) m.classList.remove('open'); }); }
  function closeAll(){ groups.forEach(x=>{ x.el.classList.remove('open'); x.trig.setAttribute('aria-expanded','false'); }); closeSubs(); document.body.classList.remove('tb-open'); }
  document.addEventListener('click',e=>{ if(!e.target.closest('.tb-group')) closeAll(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && groups.some(x=>x.el.classList.contains('open'))){ closeAll(); } });

  /* ---------- O'ng tomon: yordam, til, profil ---------- */
  const right=document.createElement('div'); right.className='tb-right';
  [$('langDrop'), $('userBtn')].forEach(n=>n&&right.appendChild(n));
  const placeGuide=()=>{ const gb=$('guideBtn'); if(gb && gb.parentNode!==right) right.prepend(gb); };

  /* ---------- Pastki qator: sahna boshqaruvi + sayyoralar ---------- */
  const bottom=document.createElement('div'); bottom.id='bottomBar';
  const sim=document.createElement('div'); sim.className='tb-sim glass'; sim.setAttribute('role','group');
  const speed=topbar.querySelector('.speed-ctl'), reset=$('resetBtn'), dock=$('dock');
  if(speed) sim.appendChild(speed);
  if(reset) sim.appendChild(reset);
  bottom.appendChild(sim); if(dock) bottom.appendChild(dock);
  document.body.appendChild(bottom);

  controls.innerHTML='';   // endi bo'sh (barcha elementlar ko'chirildi)
  controls.append(groupsEl, right);
  placeGuide();
  // guide.js yordam tugmasini resetBtn oldiga qo'yadi (u endi pastki qatorda) — qaerda paydo bo'lsa ham o'ngga ko'chiramiz
  new MutationObserver(placeGuide).observe(sim,{ childList:true });

  // Pastki qator yuqori panel bilan birga ko'rinadi/yashirinadi (intro, "toza" rejim)
  const syncHidden=()=>bottom.classList.toggle('hidden', topbar.classList.contains('hidden'));
  new MutationObserver(syncHidden).observe(topbar,{ attributes:true, attributeFilter:['class'] }); syncHidden();

  /* ---------- Matnlar (3 tilda) ---------- */
  function labels(){
    groups.forEach(x=>{ x.trig.querySelector('.tb-lbl').textContent=T(TX[x.g.key]); });
    labsBtn.title=T(TX.labs); const sky=$('skyBtn'); if(sky) sky.title=T(TX.sky);
    sim.setAttribute('aria-label',T(TX.sim));
  }
  labels();
  new MutationObserver(labels).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
})();
