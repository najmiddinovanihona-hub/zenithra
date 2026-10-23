/* 🧭 Astronomik asboblar — alohida ekran: chapda qidiruv va filtrlar (vazifasi, davri), ro'yxat; o'ngda realistik 3D model va ma'lumot.
   3D dvigatel — labs/observatories.js (window.OBS_ENGINE); modellar — labs/ins-models.js, labs/ins-models2.js (window.INS_MODELS).
   Ekran rasadxonalar ekrani bilan bir xil tuzilishda (obsw-* klasslari), ikkalasi bir vaqtda ochilmaydi. */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=document.documentElement.lang; return LANGS.indexOf(l)>=0?l:'uz'; };
const T=o=>o==null?'':(typeof o==='string'?o:(o[L()]!=null?o[L()]:o.uz));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const click=f=>{ try{ window.__solar&&window.__solar.click&&window.__solar.click(f); }catch(e){} };

const TX={
  title:{uz:'Astronomik asboblar',ru:'Астрономические инструменты',en:'Astronomical instruments'},
  sub:{uz:'Gnomondan kosmik teleskopgacha — har biri 3D, vazifasi va ishlash tamoyili bilan',ru:'От гномона до космического телескопа — каждый в 3D, с назначением и принципом работы',en:'From the gnomon to the space telescope — each in 3D, with its purpose and how it works'},
  search:{uz:'Qidirish: nomi, vazifasi, ixtirochisi…',ru:'Поиск: название, назначение, автор…',en:'Search: name, purpose, inventor…'},
  useT:{uz:'Vazifasi',ru:'Назначение',en:'Purpose'}, eraT:{uz:'Davri',ru:'Эпоха',en:'Era'},
  uses:{ all:{uz:'Hammasi',ru:'Все',en:'All'}, time:{uz:'⏱ Vaqt o‘lchash',ru:'⏱ Измерение времени',en:'⏱ Timekeeping'},
    angle:{uz:'📐 Burchak va koordinata',ru:'📐 Углы и координаты',en:'📐 Angles & positions'}, observe:{uz:'🔭 Kuzatish',ru:'🔭 Наблюдение',en:'🔭 Observing'},
    model:{uz:'🌐 Model va hisoblash',ru:'🌐 Модель и расчёт',en:'🌐 Models & computing'}, light:{uz:'🌈 Nurlanish va signal',ru:'🌈 Излучение и сигналы',en:'🌈 Light & signals'},
    nav:{uz:'🧭 Navigatsiya',ru:'🧭 Навигация',en:'🧭 Navigation'} },
  eras:{ all:{uz:'Barcha davrlar',ru:'Все эпохи',en:'All eras'}, ancient:{uz:'Qadimgi dunyo',ru:'Древний мир',en:'Ancient'}, medieval:{uz:'O‘rta asrlar',ru:'Средние века',en:'Middle Ages'},
    tele:{uz:'Teleskop davri',ru:'Эпоха телескопа',en:'Telescope era'}, modern:{uz:'Zamonaviy',ru:'Современность',en:'Modern'} },
  empty:{uz:'Hech narsa topilmadi.',ru:'Ничего не найдено.',en:'Nothing found.'}, reset:{uz:'Filtrni tozalash',ru:'Сбросить фильтр',en:'Clear filters'},
  play:{uz:'▶ Ishlatib ko‘rish',ru:'▶ Показать в работе',en:'▶ See it work'}, stop:{uz:'⏸ To‘xtatish',ru:'⏸ Стоп',en:'⏸ Stop'},
  cut:{uz:'✂ Ichini ko‘rish',ru:'✂ Разрез',en:'✂ Cutaway'}, spin:{uz:'⟳ Aylantirish',ru:'⟳ Вращать',en:'⟳ Spin'}, view:{uz:'↺ Umumiy',ru:'↺ Общий вид',en:'↺ Overview'},
  back:{uz:'← Ro‘yxat',ru:'← Список',en:'← List'}, loading:{uz:'Model qurilmoqda…',ru:'Строим модель…',en:'Building the model…'},
  noGl:{uz:'Bu qurilmada 3D ko‘rinish ishlamadi (WebGL yo‘q).',ru:'На этом устройстве 3D недоступно (нет WebGL).',en:'3D is not available on this device (no WebGL).'},
  count:{uz:' ta asbob',ru:' инструментов',en:' instruments'},
  tabs:[{uz:'📋 Umumiy',ru:'📋 Обзор',en:'📋 Overview'},{uz:'⚙️ Qanday ishlaydi',ru:'⚙️ Как работает',en:'⚙️ How it works'},{uz:'🧩 Qismlari',ru:'🧩 Детали',en:'🧩 Parts'}],
  year:{uz:'Paydo bo‘lgan',ru:'Появился',en:'Introduced'}, who:{uz:'Ixtirochi / kelib chiqishi',ru:'Автор / происхождение',en:'Inventor / origin'},
  size:{uz:'O‘lchami',ru:'Размер',en:'Size'}, era:{uz:'Davri',ru:'Эпоха',en:'Era'}, purpose:{uz:'Nima uchun kerak',ru:'Для чего нужен',en:'What it is for'},
  facts:{uz:'Qiziqarli faktlar',ru:'Интересные факты',en:'Did you know?'},
  partHint:{uz:'Qismni bosing — kamera unga yaqinlashadi va 3D’da belgilanadi.',ru:'Нажмите на деталь — камера приблизится к ней.',en:'Tap a part — the camera flies to it.'},
  hint:{uz:'Sichqoncha bilan aylantiring, g‘ildirakcha bilan yaqinlashtiring.',ru:'Вращайте мышью, приближайте колёсиком.',en:'Drag to rotate, scroll to zoom.'},
};
const USES=['time','angle','observe','model','light','nav'], ERAS=['ancient','medieval','tele','modern'];
const eraOf=m=>m.yearN<500?'ancient':m.yearN<1600?'medieval':m.yearN<1900?'tele':'modern';

const I={ el:null, open:false, use:'all', era:'all', q:'', sel:null, itab:0, play:false };
const EN=()=>window.OBS_ENGINE, Eg=()=>EN()&&EN().E;
const all=()=>(window.INS_MODELS||[]).slice().sort((a,b)=>a.yearN-b.yearN);
// Qidiruv: barcha tillardagi nom, vazifa, ixtirochi va qismlar bo'yicha (katta-kichik harf, o'zbek apostroflari farqsiz)
const norm=s=>String(s).toLowerCase().replace(/[‘’ʻʼ`']/g,'');
const hay=m=>{ if(m._hay) return m._hay; const parts=[m.name,m.who,m.short,m.year].concat((m.parts||[]).map(p=>p[0])); return (m._hay=norm(parts.map(o=>o&&typeof o==='object'?LANGS.map(l=>o[l]).join(' '):o).join(' '))); };
const list=()=>all().filter(m=>(I.use==='all'||m.use.indexOf(I.use)>=0)&&(I.era==='all'||eraOf(m)===I.era)&&(!I.q||norm(I.q).split(/\s+/).every(w=>hay(m).indexOf(w)>=0)));

function syncTools(){ if(!I.el) return; const E=Eg(), m=E&&E.cur, q=s=>I.el.querySelector(s), mine=m&&m._ins;
  q('#inswCut').style.display=mine&&m.feat&&m.feat.cut?'':'none'; q('#inswCut').classList.toggle('on',!!(E&&E.cut));
  q('#inswPlay').style.display=mine&&m.feat&&m.feat.play?'':'none'; q('#inswPlay').textContent=T(I.play?TX.stop:TX.play); q('#inswPlay').classList.toggle('on',I.play);
  q('#inswSpin').classList.toggle('on',!!(E&&E.spin)); }
function renderFilters(){ const q=s=>I.el.querySelector(s);
  q('.insw-uses').innerHTML=['all'].concat(USES).map(u=>{ const n=all().filter(m=>u==='all'||m.use.indexOf(u)>=0).length; return '<button class="sn-chip'+(I.use===u?' on':'')+'" data-u="'+u+'">'+esc(T(TX.uses[u]))+' <i>'+n+'</i></button>'; }).join('');
  q('.insw-eras').innerHTML=['all'].concat(ERAS).map(e=>'<button class="sn-chip'+(I.era===e?' on':'')+'" data-e="'+e+'">'+esc(T(TX.eras[e]))+'</button>').join('');
  q('.insw-uses').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ click(620); I.use=b.dataset.u; renderFilters(); renderList(); }));
  q('.insw-eras').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ click(620); I.era=b.dataset.e; renderFilters(); renderList(); })); }
function renderList(){ const box=I.el.querySelector('.obsw-items'), items=list();
  box.innerHTML=items.length?items.map(m=>'<button class="obsw-it insw-it'+(I.sel===m.id?' on':'')+'" data-id="'+m.id+'"><span class="obsw-ic">'+m.icon+'</span><span class="obsw-tx"><b>'+esc(T(m.name))+'</b><small>'+esc(T(m.short))+'</small><span class="insw-tags">'+m.use.map(u=>'<em>'+esc(T(TX.uses[u]).split(' ')[0])+'</em>').join('')+'</span></span><span class="obsw-yr">'+esc(T(m.year))+'</span></button>').join('')
    :'<div class="insw-empty"><p>'+esc(T(TX.empty))+'</p><button class="ac-link" id="inswReset">'+esc(T(TX.reset))+'</button></div>';
  box.querySelectorAll('.obsw-it').forEach(b=>b.addEventListener('click',()=>{ click(700); select(b.dataset.id); }));
  const r=box.querySelector('#inswReset'); if(r) r.addEventListener('click',()=>{ click(620); I.use='all'; I.era='all'; I.q=''; I.el.querySelector('.insw-q').value=''; renderFilters(); renderList(); });
  I.el.querySelector('.obsw-count').textContent=items.length+' / '+all().length+T(TX.count); }
function flyTo(m,k){ const E=Eg(); if(!E||!E.cam) return; const name=m.parts[k][0], l=E.labels.find(x=>x.t===name); if(!l) return;
  const THREE=window.THREE, dir=E.cam.position.clone().sub(E.ctl.target).normalize(), d=(m.partDist||E.home.pos.distanceTo(E.home.tgt)*0.42);
  E.camGoal={ pos:l.p.clone().add(dir.multiplyScalar(d)), tgt:l.p.clone() };
  E.labels.forEach(x=>x.el.classList.toggle('hl',x===l)); clearTimeout(I.hlT); I.hlT=setTimeout(()=>E.labels.forEach(x=>x.el.classList.remove('hl')),2600); }
function renderInfo(m){ const i=I.el.querySelector('.obsw-info');
  const head='<div class="obsw-ihead"><h4>'+m.icon+' '+esc(T(m.name))+'</h4><div class="obsw-itabs">'+TX.tabs.map((t,k)=>'<button class="sn-chip'+(k===I.itab?' on':'')+'" data-k="'+k+'">'+esc(T(t))+'</button>').join('')+'</div></div>';
  let body='';
  if(I.itab===0){ body='<div class="insw-use">'+m.use.map(u=>'<span>'+esc(T(TX.uses[u]))+'</span>').join('')+'</div>'+
      '<p class="obsw-lead">'+esc(T(m.about))+'</p>'+
      '<div class="obsw-kv"><div><span>'+esc(T(TX.year))+'</span><b>'+esc(T(m.year))+'</b></div><div><span>'+esc(T(TX.era))+'</span><b>'+esc(T(TX.eras[eraOf(m)]))+'</b></div><div><span>'+esc(T(TX.who))+'</span><b>'+esc(T(m.who))+'</b></div><div><span>'+esc(T(TX.size))+'</span><b>'+esc(T(m.size))+'</b></div></div>'+
      '<h5>'+esc(T(TX.purpose))+'</h5><ul>'+m.tasks.map(f=>'<li>'+esc(T(f))+'</li>').join('')+'</ul>'+
      '<h5>'+esc(T(TX.facts))+'</h5><ul>'+m.facts.map(f=>'<li>'+esc(T(f))+'</li>').join('')+'</ul><p class="obsw-hint">'+esc(T(TX.hint))+'</p>'; }
  else if(I.itab===1){ body='<ol class="insw-steps">'+m.how.map((h,k)=>'<li style="--i:'+k+'"><b>'+(k+1)+'</b><p>'+esc(T(h))+'</p></li>').join('')+'</ol>'+
      (m.feat&&m.feat.play?'<button class="auth-btn obsw-more" id="inswPlay2"><span class="auth-btn-tx">'+esc(T(I.play?TX.stop:TX.play))+'</span></button>':''); }
  else { body='<p class="obsw-hint" style="margin-top:0">'+esc(T(TX.partHint))+'</p><div class="insw-parts">'+m.parts.map((p,k)=>'<button class="insw-part" data-k="'+k+'" style="--i:'+k+'"><b>'+esc(T(p[0]))+'</b><span>'+esc(T(p[1]))+'</span></button>').join('')+'</div>'; }
  i.innerHTML=head+'<div class="obsw-ibody">'+body+'</div>';
  i.querySelectorAll('.obsw-itabs button').forEach(b=>b.addEventListener('click',()=>{ click(620); I.itab=+b.dataset.k; renderInfo(m); i.scrollTop=0; }));
  i.querySelectorAll('.insw-part').forEach(b=>b.addEventListener('click',()=>{ click(700); flyTo(m,+b.dataset.k); }));
  const p2=i.querySelector('#inswPlay2'); if(p2) p2.addEventListener('click',togglePlay); }
function togglePlay(){ click(700); I.play=!I.play; syncTools(); const m=all().find(x=>x.id===I.sel); if(m&&I.itab===1) renderInfo(m); }
function select(id){ const m=all().find(x=>x.id===id), en=EN(); if(!m||!en) return; I.sel=id; I.play=false; I.el.classList.add('viewing');
  I.el.querySelectorAll('.obsw-it').forEach(b=>b.classList.toggle('on',b.dataset.id===id)); renderInfo(m);
  const E=en.E, host=I.el.querySelector('.obsw-3d');
  if(!E.ok && !en.init(host)){ host.classList.add('nogl'); host.querySelector('.obsw-msg').textContent=T(TX.noGl); return; }
  const ld=I.el.querySelector('.obsw-load'); ld.classList.add('on');
  setTimeout(()=>{ m._ins=true; E.ctxExt={ play:()=>I.play, img:url=>{ const t=new window.THREE.TextureLoader().load(url); t.encoding=window.THREE.sRGBEncoding; t.anisotropy=8; E.disp.push(t); return t; } };
    try{ en.load(m); }catch(e){ console.error('[ins]',m.id,e); } ld.classList.remove('on'); syncTools(); en.start(); },30); }
function build(){
  const el=document.createElement('div'); el.id='insWorld'; el.className='obsw insw'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  el.innerHTML='<div class="obsw-card glass"><div class="obsw-head"><button class="ac-link obsw-back" type="button"></button><div><h3></h3><p></p></div><span class="obsw-count"></span><button class="panel-close obsw-x" type="button" aria-label="close">✕</button></div>'+
    '<div class="obsw-main"><aside class="obsw-list"><label class="insw-search"><span aria-hidden="true">🔍</span><input class="insw-q" type="search" autocomplete="off"></label>'+
    '<div class="insw-flt"><small class="insw-ft1"></small><div class="obsw-cats insw-uses"></div><small class="insw-ft2"></small><div class="obsw-cats insw-eras"></div></div><div class="obsw-items"></div></aside>'+
    '<section class="obsw-view"><div class="obsw-3d"><canvas></canvas><div class="obsw-lbls"></div><div class="obsw-msg"></div><div class="obsw-load"><i></i><span></span></div>'+
    '<div class="obsw-tools"><button class="sn-chip" id="inswPlay"></button><button class="sn-chip" id="inswCut"></button><button class="sn-chip" id="inswSpin"></button><button class="sn-chip" id="inswHome"></button><button class="sn-chip obsw-fs"></button></div></div>'+
    '<div class="obsw-info"></div></section></div></div>';
  document.body.appendChild(el); I.el=el;
  el.querySelector('.obsw-x').addEventListener('click',close);
  el.querySelector('.obsw-back').addEventListener('click',()=>{ click(520); el.classList.remove('viewing'); });
  el.querySelector('#inswPlay').addEventListener('click',togglePlay);
  el.querySelector('#inswCut').addEventListener('click',()=>{ click(620); const E=Eg(); E.cut=!E.cut; syncTools(); });
  el.querySelector('#inswSpin').addEventListener('click',()=>{ click(620); const E=Eg(); E.spin=!E.spin; if(E.ctl) E.ctl.autoRotate=E.spin; syncTools(); });
  EN().fullWire(el.querySelector('.obsw-3d'));
  el.querySelector('#inswHome').addEventListener('click',()=>{ click(620); const E=Eg(); if(E.home) E.camGoal={ pos:E.home.pos.clone(), tgt:E.home.tgt.clone() }; });
  const qi=el.querySelector('.insw-q'); qi.addEventListener('input',()=>{ I.q=qi.value.trim(); renderList(); });
  qi.addEventListener('keydown',e=>{ if(e.key==='Escape'&&qi.value){ e.stopPropagation(); qi.value=''; I.q=''; renderList(); } if(e.key==='Enter'){ const f=list()[0]; if(f) select(f.id); } });
  el.addEventListener('pointerdown',e=>{ if(e.target===el) close(); });
  texts(); }
function texts(){ if(!I.el) return; const q=s=>I.el.querySelector(s);
  q('h3').textContent='🧭 '+T(TX.title); q('.obsw-head p').textContent=T(TX.sub); q('.obsw-back').textContent=T(TX.back); q('.obsw-load span').textContent=T(TX.loading);
  q('.insw-q').placeholder=T(TX.search); q('.insw-ft1').textContent=T(TX.useT); q('.insw-ft2').textContent=T(TX.eraT);
  q('#inswCut').textContent=T(TX.cut); q('#inswSpin').textContent=T(TX.spin); q('#inswHome').textContent=T(TX.view);
  renderFilters(); renderList(); const m=all().find(x=>x.id===I.sel); if(m){ renderInfo(m); const E=Eg(); if(E) E.labels.forEach(l=>{ l.el.textContent=T(l.t); }); } syncTools();
  const b=document.getElementById('insBtn'); if(b) b.title=T(TX.title); }
function open(){ if(I.open) return; if(!EN()) return; if(window.OBS_WORLD) window.OBS_WORLD.close(); if(window.SCI_WORLD) window.SCI_WORLD.close();
  const ubv=document.getElementById('ubView'); if(ubv&&ubv.classList.contains('on')){ const c=document.getElementById('ubClose'); if(c) c.click(); }
  if(!I.el) build(); I.open=true; I.el.classList.add('on'); document.body.classList.add('obswmode'); window.__labCover=true; texts(); click(760);
  const first=I.sel||(list()[0]&&list()[0].id); if(window.innerWidth>760&&first) select(first); }
function close(){ if(!I.open) return; I.open=false; I.play=false; I.el.classList.remove('on','viewing'); document.body.classList.remove('obswmode'); EN().dispose(); window.__labCover=false; click(440); }
window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&I.open&&!document.querySelector('.obsw-lb.on')) close(); });
new MutationObserver(()=>{ texts(); }).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
function wireBtn(){ const b=document.getElementById('insBtn'); if(b&&!b._ins){ b._ins=1; b.title=T(TX.title); b.addEventListener('click',()=>{ I.open?close():open(); }); } }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wireBtn); else wireBtn();
window.INS_WORLD={ open, close, select, isOpen:()=>I.open };
})();
