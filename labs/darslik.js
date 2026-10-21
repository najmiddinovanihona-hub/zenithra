/* DARSLIK — alohida to'liq ekran: mavzular ro'yxati + har bir mavzu uchun 3D, grafik va matn.
   Yangi mavzu: window.DARSLIK.add({ id, ico, title:{uz,ru,en}, sub:{uz,ru,en}, build(el, api) → cleanup() }) */
(function(){
const {register,T,esc,click}=window.LAB;
const TX={ name:{uz:'Darslik',ru:'Учебник',en:'Textbook'},
  sub:{uz:'Astronomiya mavzulari: 3D modellar, grafiklar va izohlar',ru:'Темы астрономии: 3D-модели, графики и пояснения',en:'Astronomy topics: 3D models, charts and explanations'},
  back:{uz:'Orqaga',ru:'Назад',en:'Back'}, topics:{uz:'Mavzular',ru:'Темы',en:'Topics'},
  empty:{uz:'Mavzular hali qo‘shilmagan',ru:'Темы ещё не добавлены',en:'No topics yet'},
  emptyD:{uz:'Har bir mavzu shu yerda alohida sahifa bo‘lib ochiladi — 3D model, grafiklar va tushuntirish bilan.',ru:'Каждая тема откроется здесь отдельной страницей — с 3D-моделью, графиками и пояснением.',en:'Each topic will open here as its own page — with a 3D model, charts and an explanation.'},
  pick:{uz:'Chapdagi ro‘yxatdan mavzuni tanlang',ru:'Выберите тему в списке слева',en:'Pick a topic from the list'},
  prev:{uz:'Oldingi',ru:'Предыдущая',en:'Previous'}, next:{uz:'Keyingi',ru:'Следующая',en:'Next'},
  topic:{uz:'Mavzu',ru:'Тема',en:'Topic'}, find:{uz:'Mavzu qidirish…',ru:'Поиск темы…',en:'Search topics…'},
  fAll:{uz:'Hammasi',ru:'Все',en:'All'}, fNew:{uz:'O‘qilmagan',ru:'Не прочитано',en:'Unread'}, fSeen:{uz:'O‘qilgan',ru:'Прочитано',en:'Read'}, fTest:{uz:'Test topshirilgan',ru:'Тест сдан',en:'Test done'}, fNoTest:{uz:'Test qolgan',ru:'Тест не сдан',en:'Test pending'}, fExtra:{uz:'Qo‘shimcha',ru:'Дополнительно',en:'Extras'},
  load:{uz:'Mavzular yuklanmoqda…',ru:'Темы загружаются…',en:'Loading topics…'},
  pres:{uz:'▶ Taqdimot',ru:'▶ Презентация',en:'▶ Present'}, pdf:{uz:'📄 PDF yuklab olish',ru:'📄 Скачать PDF',en:'📄 Download PDF'},
  pdfT:{uz:'Mavzuni PDF qilib saqlash',ru:'Сохранить тему в PDF',en:'Save this topic as PDF'}, pdfD:{uz:'Matn, grafiklar, atamalar, savollar javoblari bilan va test (javoblar kaliti oxirida). Ochilgan oynada «PDF sifatida saqlash» ni tanlang.',ru:'Текст, графики, термины, вопросы с ответами и тест (ключ в конце). В открывшемся окне выберите «Сохранить как PDF».',en:'Text, charts, key terms, questions with answers and the quiz (answer key at the end). In the window that opens choose “Save as PDF”.'},
  popup:{uz:'Oynani ochib bo‘lmadi — brauzerda qalqib chiquvchi oynalarga ruxsat bering.',ru:'Не удалось открыть окно — разрешите всплывающие окна.',en:'Could not open the window — please allow pop-ups.'},
  g3d:{uz:'3D model — interaktiv versiyada',ru:'3D-модель — в интерактивной версии',en:'3D model — see the interactive version'}, key:{uz:'Test javoblari kaliti',ru:'Ключ к тесту',en:'Quiz answer key'},
  exit:{uz:'Chiqish',ru:'Выход',en:'Exit'}, slide:{uz:'Slayd',ru:'Слайд',en:'Slide'}, fs:{uz:'To‘liq ekran',ru:'Полный экран',en:'Full screen'},
  read:{uz:'o‘qildi',ru:'прочитано',en:'read'}, tests:{uz:'test',ru:'тест',en:'tests'}, noHit:{uz:'Mos mavzu topilmadi',ru:'Ничего не найдено',en:'No matching topics'}, reset:{uz:'Belgilarni tozalash',ru:'Сбросить отметки',en:'Reset progress'}, resetQ:{uz:'Barcha o‘qilgan belgilari va test natijalari o‘chirilsinmi?',ru:'Удалить все отметки и результаты тестов?',en:'Clear all read marks and test scores?'}, day:{uz:'Kunduzgi',ru:'Дневной',en:'Day'}, night:{uz:'Tungi',ru:'Ночной',en:'Night'} };
const TOPICS=[], LANGS=[['uz','O‘zbekcha'],['ru','Русский'],['en','English']];
let lab=null, cur=null, off=null, themeCbs=[];
const isDay=()=>localStorage.getItem('dz_theme')==='day';
const PK='dz_prog', pLoad=()=>{ try{ return JSON.parse(localStorage.getItem(PK))||{}; }catch(e){ return {}; } }, pCbs=[];
const pSave=p=>{ try{ localStorage.setItem(PK,JSON.stringify(p)); }catch(e){} pCbs.forEach(f=>{ try{ f(); }catch(e){} }); };
window.DZP={ all:pLoad, get:id=>pLoad()[id]||null,
  seen(id){ const p=pLoad(); if(p[id]&&p[id].v) return; p[id]=Object.assign(p[id]||{},{v:1}); pSave(p); },
  score(id,sc,tot){ if(!id) return; const p=pLoad(), o=p[id]||{}; o.v=1; o.s=sc; o.t=tot; o.b=Math.max(o.b||0,sc); o.d=Date.now(); p[id]=o; pSave(p); },
  reset(){ pSave({}); }, on:f=>pCbs.push(f) };
const isMain=t=>/^t\d+$/.test(t.id);
let fq='', ff='all';
window.DARSLIK={ add(t){ const i=TOPICS.findIndex(x=>x.id===t.id); if(i>=0) TOPICS[i]=t; else TOPICS.push(t); if(lab&&lab.root&&lab.render) lab.render(); }, list:()=>TOPICS.slice() };

register('darslik',{ ico:'📖', bare:true, nomenu:true, name:TX.name, sub:TX.sub,
  build(body, L){
    lab=L; L.root.classList.add('dz');
    body.innerHTML=`<header class="dz-top">
        <button class="dz-menu lab-chip" id="dzMenu" title="${esc(T(TX.topics))}" aria-label="${esc(T(TX.topics))}">☰</button>
        <button class="lab-chip dz-back" id="dzBack">← ${esc(T(TX.back))}</button>
        <div class="dz-ttl"><h2>📖 ${esc(T(TX.name))}</h2><span>${esc(T(TX.sub))}</span></div>
        <div class="dz-langw"><button class="lab-chip dz-lang" id="dzLang" aria-haspopup="true" aria-expanded="false">🌐 <b>${window.LAB.L().toUpperCase()}</b> <span class="dz-car">▾</span></button>
          <div class="dz-lmenu" id="dzLMenu">${LANGS.map(([k,n])=>`<button class="dz-lopt${k===window.LAB.L()?' on':''}" data-lang="${k}"><b>${k.toUpperCase()}</b>${n}</button>`).join('')}</div></div>
        <button class="lab-chip dz-theme" id="dzTheme"></button>
      </header>
      <div class="dz-wrap">
        <nav class="dz-side" id="dzSide"></nav>
        <main class="dz-main" id="dzMain"></main>
      </div>`;
    const $=id=>body.querySelector('#'+id);
    const theme=()=>{ const d=isDay(); L.root.classList.toggle('dz-day',d); $('dzTheme').textContent=d?'🌙 '+T(TX.night):'☀ '+T(TX.day); };
    theme();
    $('dzTheme').onclick=()=>{ click(720); localStorage.setItem('dz_theme',isDay()?'night':'day'); theme(); themeCbs.forEach(f=>{ try{ f(); }catch(e){} }); };
    $('dzBack').onclick=()=>window.LAB.closeLab('darslik');
    const lm=$('dzLMenu'), lb=$('dzLang'), lmShow=o=>{ lm.classList.toggle('open',o); lb.setAttribute('aria-expanded',o); };
    lb.onclick=e=>{ e.stopPropagation(); click(700); lmShow(!lm.classList.contains('open')); };
    body.onpointerdown=e=>{ if(!e.target.closest('.dz-langw')) lmShow(false); };
    lm.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{ const k=b.dataset.lang; lmShow(false); if(k===window.LAB.L()) return; click(760);
      if(typeof window.applyLanguage==='function') window.applyLanguage(k); else localStorage.setItem('solar_lang',k);
      const m=$('dzMain'), y=m?m.scrollTop:0; stop(); L.lang=k; L.build(body,L); const m2=body.querySelector('#dzMain'); if(m2) m2.scrollTop=y; });
    if(localStorage.getItem('dz_side')==='shut') body.classList.add('dz-side-shut');
    body.querySelector('.dz-wrap').addEventListener('transitionend',e=>{ if(e.propertyName==='grid-template-columns') window.dispatchEvent(new Event('resize')); });
    $('dzMenu').onclick=()=>{ click(700); if(window.innerWidth<=760) body.classList.toggle('dz-side-open'); else { const s=body.classList.toggle('dz-side-shut'); localStorage.setItem('dz_side',s?'shut':'open'); setTimeout(()=>window.dispatchEvent(new Event('resize')),450); } };
    const FL=[['all',TX.fAll],['new',TX.fNew],['seen',TX.fSeen],['test',TX.fTest],['notest',TX.fNoTest],['extra',TX.fExtra]];
    function side(){ const s=$('dzSide');
      if(!s.querySelector('#dzFind')){
        s.innerHTML=`<div class="sec-title">${esc(T(TX.topics))} <span class="dz-cnt" id="dzCnt"></span></div>
        <div style="display:grid;gap:8px;margin:0 0 10px"><input id="dzFind" type="search" placeholder="${esc(T(TX.find))}" style="width:100%;box-sizing:border-box;padding:8px 11px;border-radius:9px;border:1px solid var(--glass-brd);background:transparent;color:inherit;font:inherit;font-size:13px">
          <div style="display:flex;flex-wrap:wrap;gap:5px" id="dzFl">${FL.map(([k,l])=>`<button class="lab-chip" data-fl="${k}" style="font-size:11.5px;padding:4px 9px">${esc(T(l))}</button>`).join('')}</div>
          <div id="dzProg" style="font-size:12px;color:var(--text-dim)"></div></div>
        <div class="dz-list" id="dzList"></div>
        <button class="lab-chip" id="dzReset" style="margin-top:10px;font-size:11.5px;opacity:.75">↺ ${esc(T(TX.reset))}</button>`;
        const f=s.querySelector('#dzFind'); f.value=fq; f.oninput=()=>{ fq=f.value; list(); };
        s.querySelectorAll('[data-fl]').forEach(b=>b.onclick=()=>{ click(720); ff=b.dataset.fl; list(); });
        s.querySelector('#dzReset').onclick=()=>{ if(confirm(T(TX.resetQ))){ click(500); window.DZP.reset(); } }; }
      list(); }
    function list(){ const s=$('dzSide'); if(!s) return; const P=pLoad(), q=fq.trim().toLowerCase(), mains=TOPICS.filter(isMain);
      s.querySelectorAll('[data-fl]').forEach(b=>b.classList.toggle('on',b.dataset.fl===ff));
      const nSeen=mains.filter(t=>P[t.id]&&P[t.id].v).length, nTest=mains.filter(t=>P[t.id]&&P[t.id].t).length;
      s.querySelector('#dzProg').innerHTML=`<div style="display:flex;justify-content:space-between;gap:8px"><span>${nSeen} / ${mains.length} ${esc(T(TX.read))}</span><span>${nTest} ${esc(T(TX.tests))}</span></div><div style="height:4px;border-radius:3px;background:var(--glass-brd);margin-top:5px;overflow:hidden"><i style="display:block;height:100%;width:${mains.length?nSeen/mains.length*100:0}%;background:var(--neon)"></i></div>`;
      const ok=(t,i)=>{ const p=P[t.id]||{}, m=isMain(t);
        if(ff==='new'&&(!m||p.v)) return false; if(ff==='seen'&&(!m||!p.v)) return false; if(ff==='test'&&(!m||!p.t)) return false; if(ff==='notest'&&(!m||p.t)) return false; if(ff==='extra'&&m) return false;
        if(!q) return true; const n=String(i+1); return n===q||String(i+1).padStart(2,'0')===q||(T(t.title)+' '+(t.sub?T(t.sub):'')).toLowerCase().includes(q); };
      const vis=TOPICS.map((t,i)=>[t,i]).filter(([t,i])=>ok(t,i));
      s.querySelector('#dzCnt').textContent=vis.length===TOPICS.length?TOPICS.length:vis.length+' / '+TOPICS.length;
      const L2=s.querySelector('#dzList');
      L2.innerHTML=vis.length?vis.map(([t,i])=>{ const p=P[t.id]||{}, sc=p.t?`<span title="${esc(T(TX.tests))}" style="margin-left:auto;flex:none;font-size:10.5px;font-weight:700;padding:1px 6px;border-radius:8px;background:${p.b>=p.t?'rgba(95,211,154,.22)':'rgba(255,198,92,.2)'};color:${p.b>=p.t?'#5fd39a':'#ffc65c'}">${p.b}/${p.t}</span>`:(p.v&&isMain(t)?`<span style="margin-left:auto;flex:none;color:#5fd39a;font-size:12px">✓</span>`:'');
        return `<button class="dz-item${cur===t.id?' on':''}" data-id="${esc(t.id)}" style="${p.v&&cur!==t.id&&isMain(t)?'opacity:.82':''}"><span class="dz-n">${t.num?esc(T(t.num)):String(i+1).padStart(2,'0')}</span><span class="dz-i">${t.ico||'✦'}</span><span class="dz-l">${esc(T(t.title))}</span>${sc}</button>`; }).join('')
        :`<p class="lab-note">${esc(T(TOPICS.length?TX.noHit:TX.empty))}</p>`;
      L2.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{ click(720); body.classList.remove('dz-side-open'); open(b.dataset.id); }); }
    window.DZP.on(list);
    let pres=null;
    function stop(){ if(pres) pres.end(); if(off){ try{ off(); }catch(e){} off=null; } themeCbs=[]; }
    function open(id){ stop(); cur=id; shown=id; window.DZP.seen(id); side(); const m=$('dzMain'), i=TOPICS.findIndex(x=>x.id===id), t=TOPICS[i];
      if(!t){ cur=null; return main(); }
      m.innerHTML=`<div class="dz-lesson"><div class="dz-lh"><span class="dz-badge">${t.badge?esc(T(t.badge)):esc(T(TX.topic))+' '+(i+1)}</span><h3>${esc(T(t.title))}</h3>${t.sub?`<p class="lab-sub">${esc(T(t.sub))}</p>`:''}<div class="dz-tools" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="lab-chip" id="dzPres">${esc(T(TX.pres))}</button><button class="lab-chip" id="dzPdf1">${esc(T(TX.pdf))}</button></div></div>
        <div class="dz-content" id="dzContent"></div>
        <section class="dz-sec dz-card dz-pdfbox" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:16px 18px"><div style="flex:1 1 260px;min-width:0"><b style="display:block;margin-bottom:4px">${esc(T(TX.pdfT))}</b><span style="font-size:13px;color:var(--text-dim);text-wrap:pretty">${esc(T(TX.pdfD))}</span></div><button class="lab-chip on" id="dzPdf2" style="padding:9px 16px">${esc(T(TX.pdf))}</button></section>
        <div class="dz-pn">${i>0?`<button class="lab-chip" id="dzPrev">← ${esc(T(TX.prev))}</button>`:'<span></span>'}${i<TOPICS.length-1?`<button class="lab-chip" id="dzNext">${esc(T(TX.next))} →</button>`:''}</div></div>`;
      m.scrollTop=0;
      if($('dzPrev')) $('dzPrev').onclick=()=>{ click(720); open(TOPICS[i-1].id); };
      if($('dzNext')) $('dzNext').onclick=()=>{ click(720); open(TOPICS[i+1].id); };
      $('dzPres').onclick=()=>{ click(760); present(t,i); };
      $('dzPdf1').onclick=$('dzPdf2').onclick=()=>{ click(760); makePdf(t,i); };
      try{ const r=t.build($('dzContent'),{id:t.id,open,T,esc,click,L:window.LAB.L,hiDPI:window.LAB.hiDPI,isDay,onTheme:f=>themeCbs.push(f)}); if(typeof r==='function') off=r; }catch(e){ console.error(e); } }
    function present(t,i){ if(pres) return; const les=$('dzMain').querySelector('.dz-lesson'); if(!les) return;
      const slides=[les.querySelector('.dz-lh'),...les.querySelectorAll('#dzContent > .dz-sec')].filter(Boolean); let k=0;
      const bar=document.createElement('div'); bar.className='dz-pres-bar';
      bar.innerHTML=`<button class="lab-chip" data-p="prev">←</button><span class="dz-pres-n"></span><button class="lab-chip" data-p="next">→</button><button class="lab-chip" data-p="fs" title="${esc(T(TX.fs))}">⛶</button><button class="lab-chip" data-p="x">✕ ${esc(T(TX.exit))}</button>`;
      les.classList.add('dz-pres'); les.appendChild(bar);
      const go=n=>{ k=Math.max(0,Math.min(slides.length-1,n)); slides.forEach((s2,j)=>s2.classList.toggle('dz-pres-off',j!==k)); les.scrollTop=0;
        bar.querySelector('.dz-pres-n').textContent=T(TX.slide)+' '+(k+1)+' / '+slides.length; setTimeout(()=>window.dispatchEvent(new Event('resize')),30); };
      const key=e=>{ if(e.target.closest&&e.target.closest('input,textarea,select')) return;
        if(['ArrowRight','PageDown',' '].includes(e.key)){ e.preventDefault(); go(k+1); } else if(['ArrowLeft','PageUp'].includes(e.key)){ e.preventDefault(); go(k-1); }
        else if(e.key==='Home') go(0); else if(e.key==='End') go(slides.length-1); else if(e.key==='Escape'&&!document.fullscreenElement) end(); };
      const fsc=()=>{ setTimeout(()=>window.dispatchEvent(new Event('resize')),60); };
      function end(){ document.removeEventListener('keydown',key); document.removeEventListener('fullscreenchange',fsc); les.classList.remove('dz-pres'); slides.forEach(s2=>s2.classList.remove('dz-pres-off')); bar.remove(); pres=null;
        if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); setTimeout(()=>window.dispatchEvent(new Event('resize')),60); }
      bar.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ click(720); const p=b.dataset.p; if(p==='prev') go(k-1); else if(p==='next') go(k+1); else if(p==='x') end();
        else if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); else if(les.requestFullscreen) les.requestFullscreen().catch(()=>{}); });
      document.addEventListener('keydown',key); document.addEventListener('fullscreenchange',fsc);
      if(les.requestFullscreen) les.requestFullscreen().catch(()=>{});
      pres={end}; go(0); }
    function makePdf(t,i){ const w=window.open('','_blank'); if(!w){ alert(T(TX.popup)); return; }
      const src=$('dzContent'), night=!isDay();
      if(night){ L.root.classList.add('dz-day'); themeCbs.forEach(f=>{ try{ f(); }catch(e){} }); }
      const imgs=[...src.querySelectorAll('canvas')].map(cv=>{ let d=null; try{ if(cv._x||(cv.getContext&&cv.getContext('2d'))) d=cv.toDataURL('image/png'); }catch(e){} return d; });
      if(night){ L.root.classList.remove('dz-day'); themeCbs.forEach(f=>{ try{ f(); }catch(e){} }); }
      const c=src.cloneNode(true);
      c.querySelectorAll('canvas').forEach((cv,j)=>{ if(imgs[j]){ const im=document.createElement('img'); im.src=imgs[j]; im.style.cssText='width:100%;height:auto;display:block;border-radius:8px'; cv.replaceWith(im); } else { const n=document.createElement('div'); n.className='pdf-3d'; n.textContent='🧊 '+T(TX.g3d); cv.replaceWith(n); } });
      c.querySelectorAll('.t1-lbls,.dz-pdfbox,script').forEach(x=>x.remove());
      c.querySelectorAll('.t2-ans').forEach(a=>a.hidden=false);
      c.querySelectorAll('input').forEach(x=>x.remove());
      const QZ=(()=>{ try{ return t.QZ||[]; }catch(e){ return []; } })(), keyL=[];
      c.querySelectorAll('.t1-quiz').forEach(q=>{ q.innerHTML=QZ.length?'<ol class="pdf-q">'+QZ.map((z,j)=>{ const o=z[1].map((x,k2)=>[x,k2]).sort((a,b)=>((a[1]*7+j*3)%5)-((b[1]*7+j*3)%5)); keyL.push((j+1)+') '+'ABCD'[o.findIndex(x=>x[1]===0)]);
        return '<li><b>'+esc(T(z[0]))+'</b><div class="pdf-o">'+o.map((x,k2)=>'<span>'+'ABCD'[k2]+') '+esc(T(x[0]))+'</span>').join('')+'</div></li>'; }).join('')+'</ol>':''; });
      c.querySelectorAll('button').forEach(b=>b.remove());
      const css=new URL('style.css',location.href).href, ttl=T(t.title);
      w.document.open(); w.document.write(`<!doctype html><html lang="${window.LAB.L()}"><head><meta charset="utf-8"><title>${esc(ttl)}</title><link rel="stylesheet" href="${css}"><style>
        @page{size:A4;margin:13mm 12mm}html,body{background:#fff!important;color:#222;overflow:visible!important;height:auto!important}body{margin:0;font-family:system-ui,"Segoe UI",sans-serif}
        .lab.dz{position:static!important;inset:auto!important;width:auto!important;height:auto!important;overflow:visible!important;background:#fff!important;display:block!important;opacity:1!important;transform:none!important;visibility:visible!important}
        .pdf-w{max-width:186mm;margin:0 auto;display:flex;flex-direction:column;gap:14px}.pdf-h{border-bottom:.4mm solid #2d5cae;padding-bottom:4mm}.pdf-h small{color:#2d5cae;font-weight:700;letter-spacing:.15em;text-transform:uppercase;font-size:8.5pt}.pdf-h h1{font-size:19pt;margin:2mm 0;line-height:1.15}.pdf-h p{margin:0;color:#555;font-size:9.5pt}
        .dz-sec,.dz-card{break-inside:auto}.dz-card,.t1-formula,.lab-kv>div,img,.pdf-q li,dl>div{break-inside:avoid}.t1-split,.t1-two{display:grid!important;grid-template-columns:1fr!important}
        .pdf-3d{padding:8mm;border:.3mm dashed #aaa;border-radius:3mm;text-align:center;color:#777;font-size:10pt}.pdf-q{margin:0;padding-left:6mm;display:grid;gap:3mm}.pdf-o{display:grid;grid-template-columns:1fr 1fr;gap:1mm 6mm;margin-top:1.5mm;font-size:10pt}
        .pdf-k{font-size:10pt;color:#333;border-top:.3mm solid #ccc;padding-top:3mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact;animation:none!important;transition:none!important}</style></head>
        <body><div class="lab dz dz-day"><div class="pdf-w"><div class="pdf-h"><small>${esc(t.badge?T(t.badge):T(TX.topic)+' '+(i+1))}</small><h1>${esc(ttl)}</h1>${t.sub?'<p>'+esc(T(t.sub))+'</p>':''}</div>${c.innerHTML}
        ${keyL.length?'<div class="pdf-k"><b>'+esc(T(TX.key))+':</b> '+keyL.join(' · ')+'</div>':''}</div></div>
        <script>window.onload=()=>setTimeout(()=>window.print(),400);<\/script></body></html>`); w.document.close(); }
    function main(){ const m=$('dzMain');
      const ld=window.DZLOAD&&!window.DZLOAD.ready;
      m.innerHTML=`<div class="dz-empty"><div class="dz-empty-ico">📖</div><h3>${esc(T(TOPICS.length?TX.pick:ld?TX.load:TX.empty))}</h3>${TOPICS.length||ld?'':`<p class="lab-p">${esc(T(TX.emptyD))}</p>`}</div>`; }
    let shown=null, rt=0;
    L.render=()=>{ if(shown&&shown===cur&&TOPICS.some(x=>x.id===cur)){ clearTimeout(rt); rt=setTimeout(list,60); return; }
      if(!cur&&TOPICS.length) cur=TOPICS[0].id; side(); if(cur&&TOPICS.some(x=>x.id===cur)){ shown=cur; open(cur); } else main(); };
    if(window.DZLOAD&&!window.DZLOAD.ready){ window.DZLOAD.now(); }
    L.render();
  },
  open(){ window.__labCover=true; document.body.classList.add('dz-on'); },
  close(){ document.body.classList.remove('dz-on'); if(off){ try{ off(); }catch(e){} off=null; } themeCbs=[]; if(lab){ lab.root&&lab.root.remove(); lab.root=null; } }
});
function hook(){ const b=document.getElementById('darsBtn'); if(!b) return; b.title=T(TX.name);
  b.addEventListener('click',()=>{ click(720); window.LAB.openLab('darslik'); }); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook); else hook();
})();
