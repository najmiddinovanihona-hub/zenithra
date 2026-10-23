/* 👨‍🔬 Astronom olimlar — alohida ekran: chapda qidiruv va filtrlar (davr, soha, mintaqa) bilan ro'yxat; o'ngda olim sahifasi
   (portret, hayoti, asarlari, kashfiyotlari, asboblari, formulalari, xronologiya, jadval, suratlar) va «Taqqoslash» (umr chizig'i + jadval).
   Ma'lumotlar — labs/sci-data-*.js (window.SCI_DATA), suratlar — labs/sci-photos.js (window.SCI_PHOTOS). Klasslar rasadxonalar ekrani bilan umumiy (obsw-*). */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=document.documentElement.lang; return LANGS.indexOf(l)>=0?l:'uz'; };
const T=o=>o==null?'':(typeof o==='string'||typeof o==='number'?String(o):(o[L()]!=null?o[L()]:o.uz));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const click=f=>{ try{ window.__solar&&window.__solar.click&&window.__solar.click(f); }catch(e){} };
const t3=(uz,ru,en)=>({uz,ru,en});

const TX={
  title:t3('Astronom olimlar','Астрономы','Astronomers'),
  sub:t3('Qadimgi Yunonistondan bugungacha — hayoti, asarlari, asboblari va formulalari','От Древней Греции до наших дней — жизнь, труды, инструменты и формулы','From ancient Greece to today — lives, works, instruments and formulas'),
  search:t3('Qidirish: ism, kashfiyot, asar…','Поиск: имя, открытие, труд…','Search: name, discovery, work…'),
  eraT:t3('Davri','Эпоха','Era'), fieldT:t3('Sohasi','Область','Field'), regT:t3('Mintaqa','Регион','Region'),
  all:t3('Hammasi','Все','All'),
  eras:{ ancient:t3('Antik davr','Античность','Antiquity'), medieval:t3('O‘rta asrlar','Средние века','Middle Ages'), revolution:t3('Ilmiy inqilob','Научная революция','Scientific Revolution'),
    classic:t3('XVIII–XIX asrlar','XVIII–XIX века','18th–19th c.'), modern:t3('XX–XXI asrlar','XX–XXI века','20th–21st c.') },
  fields:{ planets:t3('🪐 Sayyoralar','🪐 Планеты','🪐 Planets'), stars:t3('⭐ Yulduzlar','⭐ Звёзды','⭐ Stars'), cosmology:t3('🌌 Koinot','🌌 Вселенная','🌌 Cosmology'),
    mechanics:t3('🌀 Osmon mexanikasi','🌀 Небесная механика','🌀 Celestial mechanics'), instruments:t3('🔭 Asbob va kuzatuv','🔭 Инструменты','🔭 Instruments'),
    math:t3('➗ Matematika','➗ Математика','➗ Mathematics'), calendar:t3('📅 Vaqt va taqvim','📅 Время и календарь','📅 Time & calendar'), space:t3('🚀 Kosmonavtika','🚀 Космонавтика','🚀 Spaceflight') },
  regions:{ ancient_greece:t3('Qadimgi Yunoniston','Древняя Греция','Ancient Greece'), asia:t3('Hindiston va Xitoy','Индия и Китай','India & China'), islamic:t3('Islom dunyosi','Исламский мир','Islamic world'),
    central_asia:t3('Markaziy Osiyo','Центральная Азия','Central Asia'), europe:t3('Yevropa','Европа','Europe'), americas:t3('Amerika','Америка','Americas') },
  tabs:{ over:t3('📋 Umumiy','📋 Обзор','📋 Overview'), bio:t3('📖 Hayoti','📖 Жизнь','📖 Life'), works:t3('📚 Asarlari','📚 Труды','📚 Works'), disc:t3('🔬 Kashfiyotlari','🔬 Открытия','🔬 Discoveries'),
    instr:t3('🛠 Asboblari','🛠 Инструменты','🛠 Instruments'), form:t3('∑ Formulalar','∑ Формулы','∑ Formulas'), tl:t3('📅 Xronologiya','📅 Хронология','📅 Timeline'), table:t3('📊 Jadval','📊 Таблица','📊 Table'), photos:t3('📷 Suratlar','📷 Фото','📷 Photos') },
  life:t3('Yashagan yillari','Годы жизни','Lifetime'), place:t3('Tug‘ilgan joyi','Место рождения','Born in'), role:t3('Kim bo‘lgan','Кем был','Known as'), region:t3('Mintaqa','Регион','Region'),
  facts:t3('Qiziqarli faktlar','Интересные факты','Did you know?'), legacy:t3('Merosi','Наследие','Legacy'),
  nWorks:t3('asar','трудов','works'), nDisc:t3('kashfiyot','открытий','discoveries'), nForm:t3('formula','формул','formulas'), nInstr:t3('asbob','инструментов','instruments'),
  open3d:t3('3D modelni ochish →','Открыть 3D-модель →','Open the 3D model →'), vars:t3('Belgilar','Обозначения','Symbols'),
  compare:t3('📊 Taqqoslash','📊 Сравнение','📊 Compare'), back:t3('← Ro‘yxat','← Список','← List'), count:t3(' ta olim',' учёных',' astronomers'),
  empty:t3('Hech kim topilmadi.','Никого не найдено.','No one found.'), reset:t3('Filtrni tozalash','Сбросить фильтр','Clear filters'),
  cmpT:t3('Umr chiziqlari: 2300 yillik astronomiya','Линии жизни: 2300 лет астрономии','Lifelines: 2,300 years of astronomy'),
  cmpS:t3('Shkala siqilgan: 1400-yilgacha bo‘lgan davr qisqaroq ko‘rsatilgan. Chiziqni bosing — olim sahifasi ochiladi.','Шкала сжата: период до 1400 г. показан короче. Нажмите на линию — откроется страница учёного.','Compressed scale: the years before 1400 are drawn shorter. Click a bar to open that astronomer.'),
  tblT:t3('Barcha olimlar jadvali','Таблица всех учёных','All astronomers'), chart:t3('Grafik','График','Chart'), table:t3('Jadval','Таблица','Table'),
  colName:t3('Ism','Имя','Name'), colLife:t3('Yillari','Годы','Years'), colReg:t3('Mintaqa','Регион','Region'), colField:t3('Sohasi','Область','Field'), colMain:t3('Asosiy hissasi','Главный вклад','Main contribution'),
  alive:t3('hozir ham ijod qilmoqda','живёт и работает','still active'), age:t3('yosh','лет','years'),
  photoSrc:t3('Suratlar: Wikimedia Commons — erkin litsenziyalar. Muallif va litsenziya har bir surat ostida.','Фото: Wikimedia Commons — свободные лицензии. Автор и лицензия — под каждым снимком.','Photos: Wikimedia Commons — free licences. Author and licence under each photo.'),
  by:t3('Foto','Фото','Photo'), noPhoto:t3('Erkin litsenziyali surat topilmadi','Свободное фото не найдено','No free-licence photo found'),
  hint:t3('Boshqa olimga o‘tish uchun ro‘yxatdan tanlang yoki ← → tugmalarini bosing.','Выберите учёного в списке или нажмите ← →.','Pick someone in the list or press ← →.'),
};
const ERAS=['ancient','medieval','revolution','classic','modern'], FIELDS=['planets','stars','cosmology','mechanics','instruments','math','calendar','space'], REGS=['ancient_greece','asia','islamic','central_asia','europe','americas'];
// mintaqa ranglari — dataviz palitrasi (qorong'i sirt uchun tekshirilgan: CVD va kontrast)
const RCOL={ ancient_greece:'#3987e5', asia:'#d95926', islamic:'#199e70', central_asia:'#c98500', europe:'#d55181', americas:'#008300' };
const eraOf=s=>{ const y=s.born+40; return y<600?'ancient':y<1500?'medieval':y<1730?'revolution':y<1880?'classic':'modern'; };

const S={ el:null, open:false, sel:null, tab:'over', q:'', era:'all', field:'all', reg:'all', cmp:false, tbl:false, sort:'born', dir:1 };
const all=()=>(window.SCI_DATA||[]).slice().sort((a,b)=>a.born-b.born);
const norm=s=>String(s).toLowerCase().replace(/[‘’ʻʼ`'«»]/g,'');
const multi=o=>o&&typeof o==='object'?LANGS.map(l=>o[l]||'').join(' '):String(o||'');
const hay=s=>s._hay||(s._hay=norm([s.name,s.role,s.short,s.place,s.life].map(multi).concat((s.works||[]).map(w=>multi(w[1])),(s.disc||[]).map(d=>multi(d[1])),(s.formulas||[]).map(f=>multi(f.name))).join(' ')));
const list=()=>all().filter(s=>(S.era==='all'||eraOf(s)===S.era)&&(S.field==='all'||(s.fields||[]).indexOf(S.field)>=0)&&(S.reg==='all'||s.region===S.reg)&&(!S.q||norm(S.q).split(/\s+/).every(w=>hay(s).indexOf(w)>=0)));
const photos=id=>(window.SCI_PHOTOS||{})[id]||[];
const fmtF=f=>esc(f).replace(/\^\{([^}]*)\}/g,'<sup>$1</sup>').replace(/_\{([^}]*)\}/g,'<sub>$1</sub>');
const initials=s=>T(s.name).split(/[\s-]+/).filter(w=>/^[A-ZА-ЯЁŌ]/i.test(w)).slice(-2).map(w=>w[0]).join('').toUpperCase();
const avatar=(s,cls)=>{ const p=photos(s.id)[0]; return p?'<img class="'+cls+'" src="'+p.src+'" alt="" loading="lazy">':'<span class="'+cls+' sciw-ini" style="--rc:'+RCOL[s.region]+'">'+esc(initials(s))+'</span>'; };

/* ---------- Ro'yxat va filtrlar ---------- */
function chips(box,key,vals,labels){ box.innerHTML=['all'].concat(vals).map(v=>{ const n=v==='all'?null:all().filter(s=>key==='field'?(s.fields||[]).indexOf(v)>=0:key==='era'?eraOf(s)===v:s.region===v).length;
    return n===0?'':'<button class="sn-chip'+(S[key]===v?' on':'')+'" data-v="'+v+'">'+(key==='reg'&&v!=='all'?'<i class="sciw-dot" style="background:'+RCOL[v]+'"></i>':'')+esc(T(v==='all'?TX.all:labels[v]))+(n!=null?' <i>'+n+'</i>':'')+'</button>'; }).join('');
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ click(620); S[key]=b.dataset.v; renderFilters(); renderList(); })); }
function renderFilters(){ const q=s=>S.el.querySelector(s); chips(q('.sciw-eras'),'era',ERAS,TX.eras); chips(q('.sciw-fields'),'field',FIELDS,TX.fields); chips(q('.sciw-regs'),'reg',REGS,TX.regions); }
function renderList(){ const box=S.el.querySelector('.obsw-items'), items=list();
  box.innerHTML=items.length?items.map(s=>'<button class="obsw-it sciw-it'+(S.sel===s.id&&!S.cmp?' on':'')+'" data-id="'+s.id+'">'+avatar(s,'sciw-av')+'<span class="obsw-tx"><b>'+esc(T(s.name))+'</b><small>'+esc(T(s.role))+'</small></span><span class="obsw-yr">'+esc(T(s.life))+'</span></button>').join('')
    :'<div class="insw-empty"><p>'+esc(T(TX.empty))+'</p><button class="ac-link" id="sciwReset">'+esc(T(TX.reset))+'</button></div>';
  box.querySelectorAll('.obsw-it').forEach(b=>b.addEventListener('click',()=>{ click(700); select(b.dataset.id); }));
  const r=box.querySelector('#sciwReset'); if(r) r.addEventListener('click',()=>{ click(620); S.era=S.field=S.reg='all'; S.q=''; S.el.querySelector('.insw-q').value=''; renderFilters(); renderList(); });
  S.el.querySelector('.obsw-count').textContent=items.length+' / '+all().length+T(TX.count); }

/* ---------- Olim sahifasi ---------- */
function tabsOf(s){ const ph=photos(s.id); return ['over','bio','works','disc','instr','form','tl','table','photos'].filter(k=>
  k==='over'||(k==='bio'&&s.bio&&s.bio.length)||(k==='works'&&s.works&&s.works.length)||(k==='disc'&&s.disc&&s.disc.length)||(k==='instr'&&s.instr&&s.instr.length)||
  (k==='form'&&s.formulas&&s.formulas.length)||(k==='tl'&&s.tl&&s.tl.length)||(k==='table'&&s.table&&s.table.rows&&s.table.rows.length)||(k==='photos'&&ph.length>1)); }
const credit=p=>'<span class="obsw-cr">'+esc(T(TX.by))+': '+esc(p.artist)+' · <a href="'+esc(p.licUrl||p.page)+'" target="_blank" rel="noopener noreferrer">'+esc(p.lic)+'</a> · <a href="'+esc(p.page)+'" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></span>';
function body(s){ const k=S.tab, ph=photos(s.id);
  if(k==='bio') return '<div class="obsw-art">'+s.bio.map((p,i)=>'<section style="--i:'+i+'"><p>'+esc(T(p))+'</p></section>').join('')+'</div>';
  if(k==='works') return '<ol class="obsw-tl">'+s.works.map((w,i)=>'<li style="--i:'+i+'"><b>'+esc(w[0]!=null?w[0]:'')+'</b><span><strong>'+esc(T(w[1]))+'</strong><br>'+esc(T(w[2]))+'</span></li>').join('')+'</ol>';
  if(k==='disc') return '<div class="obsw-ach">'+s.disc.map((a,i)=>'<div class="obsw-acard" style="--i:'+i+'"><div class="ic">'+a[0]+'</div><div><b>'+esc(T(a[1]))+'</b><p>'+esc(T(a[2]))+'</p></div></div>').join('')+'</div>';
  if(k==='instr') return '<div class="insw-parts">'+s.instr.map((a,i)=>'<div class="insw-part sciw-ins" style="--i:'+i+'"><b>'+esc(T(a[0]))+'</b><span>'+esc(T(a[1]))+'</span>'+(a[2]?'<button class="ac-link" data-ref="'+esc(a[2])+'">'+esc(T(TX.open3d))+'</button>':'')+'</div>').join('')+'</div>';
  if(k==='form') return '<div class="sciw-forms">'+s.formulas.map((f,i)=>'<div class="sciw-form" style="--i:'+i+'"><h5>'+esc(T(f.name))+'</h5><div class="sciw-eq">'+fmtF(f.f)+'</div><p>'+esc(T(f.expl))+'</p>'+
      (f.vars&&f.vars.length?'<dl>'+f.vars.map(v=>'<dt>'+fmtF(v[0])+'</dt><dd>'+esc(T(v[1]))+'</dd>').join('')+'</dl>':'')+'</div>').join('')+'</div>';
  if(k==='tl') return '<ol class="obsw-tl">'+s.tl.map((h,i)=>'<li style="--i:'+i+'"><b>'+esc(h[0]<0?Math.abs(h[0])+' '+T(t3('mil. avv.','до н. э.','BC')):h[0])+'</b><span>'+esc(T(h[1]))+'</span></li>').join('')+'</ol>';
  if(k==='table'){ const tb=s.table; return '<h5>'+esc(T(tb.title))+'</h5><div class="sciw-twrap"><table class="obsw-table"><thead><tr>'+tb.cols.map(c=>'<th>'+esc(T(c))+'</th>').join('')+'</tr></thead><tbody>'+
      tb.rows.map(r=>'<tr>'+r.map(c=>'<td>'+esc(T(c))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+(tb.note?'<p class="obsw-hint">'+esc(T(tb.note))+'</p>':''); }
  if(k==='photos') return '<div class="obsw-gal">'+ph.map((p,i)=>'<button class="obsw-gi" data-ph="'+i+'" style="--i:'+i+'"><img src="'+p.src+'" alt="'+esc(p.title)+'" loading="lazy"><span>'+esc(p.title)+'</span></button>').join('')+'</div><p class="obsw-src">'+esc(T(TX.photoSrc))+'</p>';
  // umumiy
  const n=(a,l)=>a&&a.length?'<div class="obsw-stat"><b>'+a.length+'</b><span>'+esc(T(l))+'</span></div>':'';
  const age=s.died!=null?(s.died-s.born):null;
  return '<p class="obsw-lead">'+esc(T(s.about))+'</p>'+
    '<div class="obsw-stats">'+n(s.works,TX.nWorks)+n(s.disc,TX.nDisc)+n(s.instr,TX.nInstr)+n(s.formulas,TX.nForm)+'</div>'+
    '<h5>'+esc(T(TX.facts))+'</h5><ul>'+(s.facts||[]).map(f=>'<li>'+esc(T(f))+'</li>').join('')+'</ul>'+
    (s.legacy?'<h5>'+esc(T(TX.legacy))+'</h5><p class="sciw-p">'+esc(T(s.legacy))+'</p>':'')+
    (ph.length?'<p class="obsw-src">'+esc(T(TX.photoSrc))+'</p>':'')+(age!=null&&age>0?'':'');
}
function renderPerson(s){ const v=S.el.querySelector('.sciw-view'), ph=photos(s.id), tabs=tabsOf(s); if(tabs.indexOf(S.tab)<0) S.tab='over';
  const age=s.died!=null?(s.died-s.born):null;
  v.innerHTML='<div class="sciw-hero">'+(ph.length?'<button class="sciw-por" data-ph="0" title="'+esc(T(ph[0].title))+'"><img src="'+ph[0].src+'" alt="'+esc(T(s.name))+'"></button>':'<div class="sciw-por sciw-noph"><span class="sciw-ini" style="--rc:'+RCOL[s.region]+'">'+esc(initials(s))+'</span><small>'+esc(T(TX.noPhoto))+'</small></div>')+
    '<div class="sciw-hd"><h2>'+esc(T(s.name))+'</h2><p class="sciw-role">'+esc(T(s.role))+'</p><p class="sciw-short">'+esc(T(s.short))+'</p>'+
    '<div class="obsw-kv"><div><span>'+esc(T(TX.life))+'</span><b>'+esc(T(s.life))+(age!=null&&age>0&&s.born>0?' · '+age+' '+esc(T(TX.age)):s.died==null?' · '+esc(T(TX.alive)):'')+'</b></div><div><span>'+esc(T(TX.place))+'</span><b>'+esc(T(s.place))+'</b></div>'+
    '<div><span>'+esc(T(TX.region))+'</span><b><i class="sciw-dot" style="background:'+RCOL[s.region]+'"></i>'+esc(T(TX.regions[s.region]))+'</b></div><div><span>'+esc(T(TX.eraT))+'</span><b>'+esc(T(TX.eras[eraOf(s)]))+'</b></div></div>'+
    '<div class="insw-use">'+(s.fields||[]).map(f=>'<span>'+esc(T(TX.fields[f]))+'</span>').join('')+'</div>'+(ph.length?credit(ph[0]):'')+'</div></div>'+
    '<div class="obsw-info sciw-info"><div class="obsw-ihead"><div class="obsw-itabs">'+tabs.map(k=>'<button class="sn-chip'+(k===S.tab?' on':'')+'" data-k="'+k+'">'+esc(T(TX.tabs[k]))+'</button>').join('')+'</div></div><div class="obsw-ibody">'+body(s)+'</div></div>'+
    '<div class="sciw-nav"><button class="sn-chip" data-go="-1">←</button><span>'+esc(T(TX.hint))+'</span><button class="sn-chip" data-go="1">→</button></div>';
  v.querySelectorAll('.obsw-itabs button').forEach(b=>b.addEventListener('click',()=>{ click(620); S.tab=b.dataset.k; renderPerson(s); const tb=v.querySelector('.sciw-info'); if(tb) v.scrollTop=tb.offsetTop-8; }));
  v.querySelectorAll('[data-ph]').forEach(b=>b.addEventListener('click',()=>{ click(760); lightbox(ph,+b.dataset.ph); }));
  v.querySelectorAll('[data-ref]').forEach(b=>b.addEventListener('click',()=>{ click(760); openRef(b.dataset.ref); }));
  v.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>step(+b.dataset.go))); }
function step(d){ const l=list(); if(!l.length) return; const i=l.findIndex(x=>x.id===S.sel); const n=l[(i+d+l.length)%l.length]; click(620); select(n.id); }
function openRef(ref){ const [kind,id]=String(ref).split(':'); close();
  setTimeout(()=>{ if(kind==='ins'&&window.INS_WORLD){ window.INS_WORLD.open(); window.INS_WORLD.select(id); } else if(kind==='obs'&&window.OBS_WORLD){ window.OBS_WORLD.open(); window.OBS_WORLD.select(id); } },80); }
function select(id){ const s=all().find(x=>x.id===id); if(!s) return; if(S.sel!==id) S.tab='over'; S.sel=id; S.cmp=false; S.el.classList.add('viewing'); syncHead();
  S.el.querySelectorAll('.obsw-it').forEach(b=>b.classList.toggle('on',b.dataset.id===id)); renderPerson(s); S.el.querySelector('.sciw-view').scrollTop=0; }

/* ---------- Taqqoslash: umr chiziqlari (SVG) va jadval ---------- */
// siqilgan vaqt shkalasi: −350…1400 — kenglikning 40%, 1400…2030 — qolgani
const X0=-350, XB=1400, X1=2030, FB=0.4;
const xs=(y,w)=>y<=XB?(y-X0)/(XB-X0)*FB*w:(FB+(y-XB)/(X1-XB)*(1-FB))*w;
function chartLife(){ const items=list(), W=760, LW=158, RH=19, H=items.length*RH+40, cw=W-LW-12, now=new Date().getFullYear();
  let g='<svg class="obsw-svg sciw-life" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(T(TX.cmpT))+'">';
  [-300,0,400,800,1400,1500,1600,1700,1800,1900,2000].forEach(y=>{ const x=LW+xs(y,cw); g+='<line x1="'+x+'" x2="'+x+'" y1="22" y2="'+(H-4)+'" class="grid"/><text x="'+x+'" y="14" class="ax" text-anchor="middle">'+(y<0?Math.abs(y)+' '+T(t3('m.a.','до н.э.','BC')):y)+'</text>'; });
  const xb=LW+xs(XB,cw); g+='<path d="M'+(xb-4)+' 18 l4 4 l4 -4" class="brk"/>';
  items.forEach((s,i)=>{ const y=28+i*RH, a=LW+xs(s.born,cw), b=LW+xs(s.died!=null?s.died:now,cw), col=RCOL[s.region];
    g+='<g class="row" data-id="'+s.id+'" data-tip="'+esc(T(s.name)+' · '+T(s.life)+' · '+T(TX.regions[s.region]))+'"><rect x="0" y="'+(y-RH/2+1)+'" width="'+W+'" height="'+(RH-2)+'" class="hit"/>'+
      '<text x="'+(LW-8)+'" y="'+(y+4)+'" text-anchor="end" class="nm">'+esc(T(s.name))+'</text>'+
      '<rect x="'+a+'" y="'+(y-5)+'" width="'+Math.max(4,b-a)+'" height="10" rx="4" fill="'+col+'"'+(s.died==null?' class="alive"':'')+'/></g>'; });
  return g+'</svg>'; }
function legend(){ return '<div class="sciw-leg">'+REGS.map(r=>'<span><i class="sciw-dot" style="background:'+RCOL[r]+'"></i>'+esc(T(TX.regions[r]))+'</span>').join('')+'</div>'; }
function tableAll(){ const items=list().slice(), k=S.sort, d=S.dir, val=s=>k==='born'?s.born:k==='name'?T(s.name):k==='reg'?T(TX.regions[s.region]):T(TX.fields[(s.fields||[])[0]]||'');
  items.sort((a,b)=>{ const x=val(a), y=val(b); return (typeof x==='number'?x-y:String(x).localeCompare(String(y)))*d; });
  const th=(key,l)=>'<th data-sort="'+key+'" class="'+(k===key?'on':'')+'">'+esc(T(l))+(k===key?(d>0?' ▲':' ▼'):'')+'</th>';
  return '<div class="sciw-twrap"><table class="obsw-table sciw-all"><thead><tr>'+th('name',TX.colName)+th('born',TX.colLife)+th('reg',TX.colReg)+th('field',TX.colField)+'<th>'+esc(T(TX.colMain))+'</th></tr></thead><tbody>'+
    items.map(s=>'<tr data-id="'+s.id+'"><td><b>'+esc(T(s.name))+'</b></td><td>'+esc(T(s.life))+'</td><td><i class="sciw-dot" style="background:'+RCOL[s.region]+'"></i>'+esc(T(TX.regions[s.region]))+'</td><td>'+(s.fields||[]).map(f=>esc(T(TX.fields[f]).split(' ')[0])).join(' ')+'</td><td>'+esc(T(s.short))+'</td></tr>').join('')+'</tbody></table></div>'; }
function renderCompare(){ const v=S.el.querySelector('.sciw-view');
  v.innerHTML='<div class="obsw-info sciw-info"><div class="obsw-ihead"><h4>'+esc(T(S.tbl?TX.tblT:TX.cmpT))+'</h4><div class="obsw-itabs"><button class="sn-chip'+(S.tbl?'':' on')+'" data-m="0">'+esc(T(TX.chart))+'</button><button class="sn-chip'+(S.tbl?' on':'')+'" data-m="1">'+esc(T(TX.table))+'</button></div></div>'+
    (S.tbl?tableAll():'<p class="sub sciw-sub">'+esc(T(TX.cmpS))+'</p>'+legend()+'<div class="obsw-chart">'+chartLife()+'</div>')+'</div><div class="obsw-tip sciw-tip" role="tooltip"></div>';
  v.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>{ click(620); S.tbl=b.dataset.m==='1'; renderCompare(); }));
  v.querySelectorAll('th[data-sort]').forEach(h=>h.addEventListener('click',()=>{ click(620); if(S.sort===h.dataset.sort) S.dir*=-1; else { S.sort=h.dataset.sort; S.dir=1; } renderCompare(); }));
  v.querySelectorAll('[data-id]').forEach(r=>r.addEventListener('click',()=>{ click(700); select(r.dataset.id); }));
  const tip=v.querySelector('.sciw-tip');
  v.querySelectorAll('[data-tip]').forEach(el=>{ el.addEventListener('pointerenter',()=>{ tip.textContent=el.dataset.tip; tip.classList.add('on'); });
    el.addEventListener('pointermove',e=>{ const r=v.getBoundingClientRect(); tip.style.transform='translate('+(e.clientX-r.left+12)+'px,'+(e.clientY-r.top+v.scrollTop-34)+'px)'; });
    el.addEventListener('pointerleave',()=>tip.classList.remove('on')); }); }
function toggleCompare(){ click(700); S.cmp=!S.cmp; syncHead(); if(S.cmp){ S.el.classList.add('viewing'); S.el.querySelectorAll('.obsw-it').forEach(b=>b.classList.remove('on')); renderCompare(); }
  else { const s=all().find(x=>x.id===S.sel)||list()[0]; if(s) select(s.id); } }
function syncHead(){ const b=S.el.querySelector('.sciw-cmp'); b.textContent=T(TX.compare); b.classList.toggle('on',S.cmp); }

/* ---------- Katta ko'rinish (suratlar) ---------- */
function lightbox(ph,k){ let lb=document.getElementById('sciwLb');
  if(!lb){ lb=document.createElement('div'); lb.id='sciwLb'; lb.className='obsw-lb'; lb.innerHTML='<button class="obsw-lbx" aria-label="close">✕</button><button class="obsw-lbn prev" aria-label="prev">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="obsw-lbn next" aria-label="next">›</button>';
    document.body.appendChild(lb); const go=d=>{ lb._k=(lb._k+d+lb._ph.length)%lb._ph.length; show(); };
    lb.addEventListener('click',e=>{ if(e.target===lb||e.target.classList.contains('obsw-lbx')) lb.classList.remove('on'); });
    lb.querySelector('.prev').addEventListener('click',()=>go(-1)); lb.querySelector('.next').addEventListener('click',()=>go(1));
    window.addEventListener('keydown',e=>{ if(!lb.classList.contains('on')) return; if(e.key==='Escape'){ e.stopImmediatePropagation(); lb.classList.remove('on'); } if(e.key==='ArrowLeft'){ e.stopImmediatePropagation(); go(-1); } if(e.key==='ArrowRight'){ e.stopImmediatePropagation(); go(1); } },true); }
  const show=()=>{ const p=lb._ph[lb._k]; lb.querySelector('img').src=p.src; lb.querySelector('figcaption').innerHTML='<b>'+esc(p.title)+'</b> <small>'+(lb._k+1)+' / '+lb._ph.length+'</small><br>'+credit(p); lb.querySelectorAll('.obsw-lbn').forEach(b=>b.style.display=lb._ph.length>1?'':'none'); };
  lb._ph=ph; lb._k=k; show(); lb.classList.add('on'); }

/* ---------- Ekran ---------- */
function build(){
  const el=document.createElement('div'); el.id='sciWorld'; el.className='obsw sciw'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  el.innerHTML='<div class="obsw-card glass"><div class="obsw-head"><button class="ac-link obsw-back" type="button"></button><div><h3></h3><p></p></div><button class="sn-chip sciw-cmp" type="button"></button><span class="obsw-count"></span><button class="panel-close obsw-x" type="button" aria-label="close">✕</button></div>'+
    '<div class="obsw-main"><aside class="obsw-list"><label class="insw-search"><span aria-hidden="true">🔍</span><input class="insw-q" type="search" autocomplete="off"></label>'+
    '<div class="insw-flt"><small class="t1"></small><div class="obsw-cats sciw-eras"></div><small class="t2"></small><div class="obsw-cats sciw-fields"></div><small class="t3"></small><div class="obsw-cats sciw-regs"></div></div><div class="obsw-items"></div></aside>'+
    '<section class="obsw-view sciw-view"></section></div></div>';
  document.body.appendChild(el); S.el=el;
  el.querySelector('.obsw-x').addEventListener('click',close);
  el.querySelector('.obsw-back').addEventListener('click',()=>{ click(520); el.classList.remove('viewing'); });
  el.querySelector('.sciw-cmp').addEventListener('click',toggleCompare);
  const qi=el.querySelector('.insw-q'); qi.addEventListener('input',()=>{ S.q=qi.value.trim(); renderList(); if(S.cmp) renderCompare(); });
  qi.addEventListener('keydown',e=>{ if(e.key==='Escape'&&qi.value){ e.stopPropagation(); qi.value=''; S.q=''; renderList(); } if(e.key==='Enter'){ const f=list()[0]; if(f) select(f.id); } });
  el.addEventListener('pointerdown',e=>{ if(e.target===el) close(); });
  texts(); }
function texts(){ if(!S.el) return; const q=s=>S.el.querySelector(s);
  q('h3').textContent='👨‍🔬 '+T(TX.title); q('.obsw-head p').textContent=T(TX.sub); q('.obsw-back').textContent=T(TX.back);
  q('.insw-q').placeholder=T(TX.search); q('.t1').textContent=T(TX.eraT); q('.t2').textContent=T(TX.fieldT); q('.t3').textContent=T(TX.regT); syncHead();
  renderFilters(); renderList(); if(S.cmp) renderCompare(); else { const s=all().find(x=>x.id===S.sel); if(s) renderPerson(s); }
  const b=document.getElementById('sciBtn'); if(b) b.title=T(TX.title); }
function open(){ if(S.open) return; if(window.OBS_WORLD) window.OBS_WORLD.close(); if(window.INS_WORLD) window.INS_WORLD.close();
  if(!S.el) build(); S.open=true; S.el.classList.add('on'); document.body.classList.add('obswmode'); window.__labCover=true; texts(); click(760);
  const first=S.sel||(all().find(x=>x.id==='ulugbek')||all()[0]||{}).id; if(window.innerWidth>760&&first&&!S.cmp) select(first); }
function close(){ if(!S.open) return; S.open=false; S.el.classList.remove('on','viewing'); document.body.classList.remove('obswmode'); window.__labCover=false; click(440); }
window.addEventListener('keydown',e=>{ if(!S.open) return; if(e.key==='Escape') close();
  else if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!S.cmp&&S.sel&&!/input|textarea/i.test((document.activeElement||{}).tagName||'')) step(e.key==='ArrowLeft'?-1:1); });
new MutationObserver(()=>{ texts(); }).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
function wireBtn(){ const b=document.getElementById('sciBtn'); if(b&&!b._sci){ b._sci=1; b.title=T(TX.title); b.addEventListener('click',()=>{ S.open?close():open(); }); } }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wireBtn); else wireBtn();
window.SCI_WORLD={ open, close, select, isOpen:()=>S.open };
})();
