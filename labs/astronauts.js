/* 🧑‍🚀 Kosmonavtlar va astronavtlar — alohida ekran (olimlar ekrani bilan bir xil tuzilish, obsw- va sciw- klasslari):
   chapda qidiruv va filtrlar (davr, mamlakat, yutuq) bilan ro'yxat; o'ngda sahifa (portret, raqamlar, hayoti, parvozlari, yutuqlari, kemalari,
   xronologiya, jadval, suratlar) va «Taqqoslash» (kosmosda o'tkazilgan vaqt grafigi + jadval).
   Ma'lumotlar — labs/ast-data-*.js (window.AST_DATA), suratlar — labs/ast-photos.js (window.AST_PHOTOS). */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=document.documentElement.lang; return LANGS.indexOf(l)>=0?l:'uz'; };
const T=o=>o==null?'':(typeof o==='string'||typeof o==='number'?String(o):(o[L()]!=null?o[L()]:o.uz));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const click=f=>{ try{ window.__solar&&window.__solar.click&&window.__solar.click(f); }catch(e){} };
const t3=(uz,ru,en)=>({uz,ru,en});

const TX={
  title:t3('Kosmonavtlar','Космонавты','Astronauts'),
  sub:t3('Gagarindan bugungacha — hayoti, parvozlari, rekordlari va kemalari','От Гагарина до наших дней — жизнь, полёты, рекорды и корабли','From Gagarin to today — lives, flights, records and spacecraft'),
  search:t3('Qidirish: ism, kema, missiya…','Поиск: имя, корабль, миссия…','Search: name, craft, mission…'),
  eraT:t3('Birinchi parvozi','Первый полёт','First flight'), grpT:t3('Mamlakat','Страна','Country'), tagT:t3('Yutuq','Достижение','Achievement'), all:t3('Hammasi','Все','All'),
  eras:{ e60:t3('1960-yillar','1960-е','1960s'), e70:t3('1970–80-yillar','1970–80-е','1970s–80s'), e90:t3('1990–2000-yillar','1990–2000-е','1990s–2000s'), e10:t3('2010-yillardan','с 2010-х','2010s+') },
  groups:{ ussr:t3('SSSR / Rossiya','СССР / Россия','USSR / Russia'), usa:t3('AQSh','США','USA'), china:t3('Xitoy','Китай','China'), europe:t3('Yevropa','Европа','Europe'),
    asia:t3('Osiyo va Yaqin Sharq','Азия и Ближний Восток','Asia & Middle East'), americas_other:t3('Kanada va boshqalar','Канада и другие','Canada & others') },
  tags:{ first:t3('🥇 Tarixiy «birinchi»','🥇 Исторический «первый»','🥇 Historic first'), moon:t3('🌕 Oyga uchgan','🌕 Полёт к Луне','🌕 Went to the Moon'), eva:t3('🧑‍🚀 Ochiq kosmos','🧑‍🚀 Выход в космос','🧑‍🚀 Spacewalks'),
    long:t3('⏳ Uzoq parvoz','⏳ Длительный полёт','⏳ Long-duration'), station:t3('🛰 Orbital stansiya','🛰 Орбитальная станция','🛰 Space station'), shuttle:t3('🚀 Space Shuttle','🚀 Спейс шаттл','🚀 Space Shuttle'),
    woman:t3('👩‍🚀 Ayollar','👩‍🚀 Женщины','👩‍🚀 Women'), uz:t3('📍 O‘zbekistonga aloqador','📍 Связаны с Узбекистаном','📍 Uzbekistan ties') },
  tabs:{ over:t3('📋 Umumiy','📋 Обзор','📋 Overview'), bio:t3('📖 Hayoti','📖 Жизнь','📖 Life'), mis:t3('🚀 Parvozlari','🚀 Полёты','🚀 Flights'), rec:t3('🏆 Yutuqlari','🏆 Достижения','🏆 Records'),
    craft:t3('🛰 Kemalar','🛰 Корабли','🛰 Spacecraft'), tl:t3('📅 Xronologiya','📅 Хронология','📅 Timeline'), table:t3('📊 Jadval','📊 Таблица','📊 Table'), photos:t3('📷 Suratlar','📷 Фото','📷 Photos') },
  life:t3('Yashagan yillari','Годы жизни','Lifetime'), place:t3('Tug‘ilgan joyi','Место рождения','Born in'), group:t3('Mamlakat','Страна','Country'), firstF:t3('Birinchi parvoz','Первый полёт','First flight'),
  sFlights:t3('kosmik parvoz','космических полёта','spaceflights'), sDays:t3('kosmosda','в космосе','in space'), sEva:t3('ochiq kosmosga chiqish','выходов в открытый космос','spacewalks'), sEvaT:t3('ochiq kosmosda','в открытом космосе','spacewalking'),
  days:t3('kun','сут.','days'), facts:t3('Qiziqarli faktlar','Интересные факты','Did you know?'), legacy:t3('Merosi','Наследие','Legacy'), open3d:t3('3D modelni ochish →','Открыть 3D-модель →','Open the 3D model →'),
  compare:t3('📊 Taqqoslash','📊 Сравнение','📊 Compare'), back:t3('← Ro‘yxat','← Список','← List'), count:t3(' ta kosmonavt',' космонавтов',' astronauts'),
  empty:t3('Hech kim topilmadi.','Никого не найдено.','No one found.'), reset:t3('Filtrni tozalash','Сбросить фильтр','Clear filters'),
  cmpT:t3('Kosmosda o‘tkazilgan jami vaqt','Суммарное время в космосе','Total time in space'),
  cmpS:t3('Barcha parvozlar yig‘indisi, kunlarda. Chiziqni bosing — kosmonavt sahifasi ochiladi.','Сумма всех полётов, в сутках. Нажмите на полосу — откроется страница космонавта.','All flights combined, in days. Click a bar to open that person.'),
  tblT:t3('Barcha kosmonavtlar jadvali','Таблица всех космонавтов','All astronauts'), chart:t3('Grafik','График','Chart'), table:t3('Jadval','Таблица','Table'),
  colName:t3('Ism','Имя','Name'), colFirst:t3('1-parvoz','1-й полёт','1st flight'), colGrp:t3('Mamlakat','Страна','Country'), colFl:t3('Parvozlar','Полёты','Flights'), colDays:t3('Kun','Сутки','Days'), colEva:t3('EVA','ВКД','EVAs'), colMain:t3('Asosiy yutug‘i','Главное достижение','Main achievement'),
  alive:t3('hayot','жив(а)','living'), age:t3('yosh','лет','years'),
  photoSrc:t3('Suratlar: Wikimedia Commons — erkin litsenziyalar (ko‘pchiligi NASA/ESA). Muallif va litsenziya har bir surat ostida.','Фото: Wikimedia Commons — свободные лицензии (в основном NASA/ESA). Автор и лицензия — под каждым снимком.','Photos: Wikimedia Commons — free licences (mostly NASA/ESA). Author and licence under each photo.'),
  by:t3('Foto','Фото','Photo'), noPhoto:t3('Erkin litsenziyali surat topilmadi','Свободное фото не найдено','No free-licence photo found'),
  hint:t3('Boshqa kosmonavtga o‘tish uchun ro‘yxatdan tanlang yoki ← → tugmalarini bosing.','Выберите космонавта в списке или нажмите ← →.','Pick someone in the list or press ← →.'),
};
const ERAS=['e60','e70','e90','e10'], GROUPS=['ussr','usa','china','europe','asia','americas_other'], TAGS=['first','moon','eva','long','station','shuttle','woman','uz'];
// mamlakat ranglari — olimlar ekrani bilan bir xil, qorong'i sirt uchun tekshirilgan palitra
const GCOL={ usa:'#3987e5', ussr:'#d95926', europe:'#199e70', china:'#c98500', asia:'#d55181', americas_other:'#008300' };
const eraOf=s=>s.first<1970?'e60':s.first<1990?'e70':s.first<2010?'e90':'e10';

const S={ el:null, open:false, sel:null, tab:'over', q:'', era:'all', grp:'all', tag:'all', cmp:false, tbl:false, sort:'days', dir:-1 };
// bir yilda uchganlar — ma'lumot fayllaridagi tartibda (Gagarin → Titov → …), tug'ilgan yil bo'yicha emas
const all=()=>(window.AST_DATA||[]).map((s,i)=>[s,i]).sort((a,b)=>a[0].first-b[0].first||a[1]-b[1]).map(p=>p[0]);
const norm=s=>String(s).toLowerCase().replace(/[‘’ʻʼ`'«»]/g,'');
const multi=o=>o&&typeof o==='object'?LANGS.map(l=>o[l]||'').join(' '):String(o||'');
const hay=s=>s._hay||(s._hay=norm([s.name,s.role,s.short,s.place,s.life].map(multi).concat((s.missions||[]).map(m=>multi(m[1])),(s.craft||[]).map(c=>multi(c[0])),(s.records||[]).map(r=>multi(r[1]))).join(' ')));
const list=()=>all().filter(s=>(S.era==='all'||eraOf(s)===S.era)&&(S.grp==='all'||s.group===S.grp)&&(S.tag==='all'||(s.tags||[]).indexOf(S.tag)>=0)&&(!S.q||norm(S.q).split(/\s+/).every(w=>hay(s).indexOf(w)>=0)));
const photos=id=>(window.AST_PHOTOS||{})[id]||[];
const st=s=>s.stats||{};
const fmtDays=d=>{ if(d==null) return '—'; const v=+d; return v<1?(Math.round(v*24*10)/10)+' '+T(t3('soat','ч','h')):(v<10?v.toFixed(1):Math.round(v)).toString().replace('.',L()==='en'?'.':',')+' '+T(TX.days); };
const initials=s=>T(s.name).split(/[\s-]+/).filter(w=>/^[A-ZА-ЯЁ]/i.test(w)).slice(-2).map(w=>w[0]).join('').toUpperCase();
const avatar=(s,cls)=>{ const p=photos(s.id)[0]; return p?'<img class="'+cls+'" src="'+p.src+'" alt="" loading="lazy">':'<span class="'+cls+' sciw-ini" style="--rc:'+GCOL[s.group]+'">'+esc(initials(s))+'</span>'; };

/* ---------- Ro'yxat va filtrlar ---------- */
function chips(box,key,vals,labels,test,dot){ box.innerHTML=['all'].concat(vals).map(v=>{ const n=v==='all'?null:all().filter(s=>test(s,v)).length;
    return n===0?'':'<button class="sn-chip'+(S[key]===v?' on':'')+'" data-v="'+v+'">'+(dot&&v!=='all'?'<i class="sciw-dot" style="background:'+GCOL[v]+'"></i>':'')+esc(T(v==='all'?TX.all:labels[v]))+(n!=null?' <i>'+n+'</i>':'')+'</button>'; }).join('');
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ click(620); S[key]=b.dataset.v; renderFilters(); renderList(); if(S.cmp) renderCompare(); })); }
function renderFilters(){ const q=s=>S.el.querySelector(s);
  chips(q('.astw-eras'),'era',ERAS,TX.eras,(s,v)=>eraOf(s)===v); chips(q('.astw-grps'),'grp',GROUPS,TX.groups,(s,v)=>s.group===v,true); chips(q('.astw-tags'),'tag',TAGS,TX.tags,(s,v)=>(s.tags||[]).indexOf(v)>=0); }
function renderList(){ const box=S.el.querySelector('.obsw-items'), items=list();
  box.innerHTML=items.length?items.map(s=>'<button class="obsw-it sciw-it'+(S.sel===s.id&&!S.cmp?' on':'')+'" data-id="'+s.id+'">'+avatar(s,'sciw-av')+'<span class="obsw-tx"><b>'+esc(T(s.name))+'</b><small>'+esc(T(s.role))+'</small></span><span class="obsw-yr">🚀 '+esc(s.first)+'</span></button>').join('')
    :'<div class="insw-empty"><p>'+esc(T(TX.empty))+'</p><button class="ac-link" id="astwReset">'+esc(T(TX.reset))+'</button></div>';
  box.querySelectorAll('.obsw-it').forEach(b=>b.addEventListener('click',()=>{ click(700); select(b.dataset.id); }));
  const r=box.querySelector('#astwReset'); if(r) r.addEventListener('click',()=>{ click(620); S.era=S.grp=S.tag='all'; S.q=''; S.el.querySelector('.insw-q').value=''; renderFilters(); renderList(); });
  S.el.querySelector('.obsw-count').textContent=items.length+' / '+all().length+T(TX.count); }

/* ---------- Kosmonavt sahifasi ---------- */
function tabsOf(s){ const ph=photos(s.id); return ['over','bio','mis','rec','craft','tl','table','photos'].filter(k=>
  k==='over'||(k==='bio'&&s.bio&&s.bio.length)||(k==='mis'&&s.missions&&s.missions.length)||(k==='rec'&&s.records&&s.records.length)||(k==='craft'&&s.craft&&s.craft.length)||
  (k==='tl'&&s.tl&&s.tl.length)||(k==='table'&&s.table&&s.table.rows&&s.table.rows.length)||(k==='photos'&&ph.length>1)); }
const credit=p=>'<span class="obsw-cr">'+esc(T(TX.by))+': '+esc(p.artist)+' · <a href="'+esc(p.licUrl||p.page)+'" target="_blank" rel="noopener noreferrer">'+esc(p.lic)+'</a> · <a href="'+esc(p.page)+'" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></span>';
function body(s){ const k=S.tab, ph=photos(s.id), x=st(s);
  if(k==='bio') return '<div class="obsw-art">'+s.bio.map((p,i)=>'<section style="--i:'+i+'"><p>'+esc(T(p))+'</p></section>').join('')+'</div>';
  if(k==='mis') return '<ol class="obsw-tl">'+s.missions.map((m,i)=>'<li style="--i:'+i+'"><b>'+esc(m[0]!=null?m[0]:'')+'</b><span><strong>'+esc(T(m[1]))+'</strong><br>'+esc(T(m[2]))+'</span></li>').join('')+'</ol>';
  if(k==='rec') return '<div class="obsw-ach">'+s.records.map((a,i)=>'<div class="obsw-acard" style="--i:'+i+'"><div class="ic">'+a[0]+'</div><div><b>'+esc(T(a[1]))+'</b><p>'+esc(T(a[2]))+'</p></div></div>').join('')+'</div>';
  if(k==='craft') return '<div class="insw-parts">'+s.craft.map((a,i)=>'<div class="insw-part sciw-ins" style="--i:'+i+'"><b>'+esc(T(a[0]))+'</b><span>'+esc(T(a[1]))+'</span>'+(a[2]?'<button class="ac-link" data-ref="'+esc(a[2])+'">'+esc(T(TX.open3d))+'</button>':'')+'</div>').join('')+'</div>';
  if(k==='tl') return '<ol class="obsw-tl">'+s.tl.map((h,i)=>'<li style="--i:'+i+'"><b>'+esc(h[0])+'</b><span>'+esc(T(h[1]))+'</span></li>').join('')+'</ol>';
  if(k==='table'){ const tb=s.table; return '<h5>'+esc(T(tb.title))+'</h5><div class="sciw-twrap"><table class="obsw-table"><thead><tr>'+tb.cols.map(c=>'<th>'+esc(T(c))+'</th>').join('')+'</tr></thead><tbody>'+
      tb.rows.map(r=>'<tr>'+r.map(c=>'<td>'+esc(T(c))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+(tb.note?'<p class="obsw-hint">'+esc(T(tb.note))+'</p>':''); }
  if(k==='photos') return '<div class="obsw-gal">'+ph.map((p,i)=>'<button class="obsw-gi" data-ph="'+i+'" style="--i:'+i+'"><img src="'+p.src+'" alt="'+esc(p.title)+'" loading="lazy"><span>'+esc(p.title)+'</span></button>').join('')+'</div><p class="obsw-src">'+esc(T(TX.photoSrc))+'</p>';
  return '<p class="obsw-lead">'+esc(T(s.about))+'</p>'+
    '<div class="obsw-stats"><div class="obsw-stat"><b>'+esc(x.flights!=null?x.flights:'—')+'</b><span>'+esc(T(TX.sFlights))+'</span></div><div class="obsw-stat"><b>'+esc(x.daysTxt?T(x.daysTxt):fmtDays(x.days))+'</b><span>'+esc(T(TX.sDays))+'</span></div>'+
    '<div class="obsw-stat"><b>'+esc(x.evas!=null?x.evas:'—')+'</b><span>'+esc(T(TX.sEva))+'</span></div>'+(x.evaTxt?'<div class="obsw-stat"><b>'+esc(T(x.evaTxt))+'</b><span>'+esc(T(TX.sEvaT))+'</span></div>':'')+'</div>'+
    '<h5>'+esc(T(TX.facts))+'</h5><ul>'+(s.facts||[]).map(f=>'<li>'+esc(T(f))+'</li>').join('')+'</ul>'+
    (s.legacy?'<h5>'+esc(T(TX.legacy))+'</h5><p class="sciw-p">'+esc(T(s.legacy))+'</p>':'')+(ph.length?'<p class="obsw-src">'+esc(T(TX.photoSrc))+'</p>':''); }
function renderPerson(s){ const v=S.el.querySelector('.sciw-view'), ph=photos(s.id), tabs=tabsOf(s); if(tabs.indexOf(S.tab)<0) S.tab='over';
  const age=s.died!=null?(s.died-s.born):null;
  v.innerHTML='<div class="sciw-hero">'+(ph.length?'<button class="sciw-por" data-ph="0" title="'+esc(ph[0].title)+'"><img src="'+ph[0].src+'" alt="'+esc(T(s.name))+'"></button>':'<div class="sciw-por sciw-noph"><span class="sciw-ini" style="--rc:'+GCOL[s.group]+'">'+esc(initials(s))+'</span><small>'+esc(T(TX.noPhoto))+'</small></div>')+
    '<div class="sciw-hd"><h2>'+esc(T(s.name))+'</h2><p class="sciw-role">'+esc(T(s.role))+'</p><p class="sciw-short">'+esc(T(s.short))+'</p>'+
    '<div class="obsw-kv"><div><span>'+esc(T(TX.life))+'</span><b>'+esc(T(s.life))+(age!=null&&age>0?' · '+age+' '+esc(T(TX.age)):'')+'</b></div><div><span>'+esc(T(TX.place))+'</span><b>'+esc(T(s.place))+'</b></div>'+
    '<div><span>'+esc(T(TX.group))+'</span><b><i class="sciw-dot" style="background:'+GCOL[s.group]+'"></i>'+esc(T(TX.groups[s.group]))+'</b></div><div><span>'+esc(T(TX.firstF))+'</span><b>'+esc(s.first)+'</b></div></div>'+
    '<div class="insw-use">'+(s.tags||[]).map(f=>'<span>'+esc(T(TX.tags[f]))+'</span>').join('')+'</div>'+(ph.length?credit(ph[0]):'')+'</div></div>'+
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

/* ---------- Taqqoslash: kosmosdagi vaqt (gorizontal ustunlar) va jadval ---------- */
function chartDays(){ const items=list().filter(s=>st(s).days!=null).sort((a,b)=>st(b).days-st(a).days), W=760, LW=158, RW=74, RH=19, H=items.length*RH+34, cw=W-LW-RW;
  const max=Math.max(1,...items.map(s=>st(s).days)), step=max>600?200:max>200?100:50, xs=d=>LW+d/max*cw;
  let g='<svg class="obsw-svg sciw-life" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(T(TX.cmpT))+'">';
  for(let d=0;d<=max;d+=step){ const x=xs(d); g+='<line x1="'+x+'" x2="'+x+'" y1="20" y2="'+(H-4)+'" class="grid"/><text x="'+x+'" y="13" class="ax" text-anchor="middle">'+d+'</text>'; }
  items.forEach((s,i)=>{ const y=26+i*RH, d=st(s).days, w=Math.max(3,xs(d)-LW);
    g+='<g class="row" data-id="'+s.id+'" data-tip="'+esc(T(s.name)+' · '+fmtDays(d)+' · '+T(TX.groups[s.group]))+'"><rect x="0" y="'+(y-RH/2+1)+'" width="'+W+'" height="'+(RH-2)+'" class="hit"/>'+
      '<text x="'+(LW-8)+'" y="'+(y+4)+'" text-anchor="end" class="nm">'+esc(T(s.name))+'</text><rect x="'+LW+'" y="'+(y-5)+'" width="'+w+'" height="10" rx="4" fill="'+GCOL[s.group]+'"/>'+
      '<text x="'+(LW+w+6)+'" y="'+(y+4)+'" class="ax">'+esc(fmtDays(d))+'</text></g>'; });
  return g+'</svg>'; }
function legend(){ return '<div class="sciw-leg">'+GROUPS.map(r=>'<span><i class="sciw-dot" style="background:'+GCOL[r]+'"></i>'+esc(T(TX.groups[r]))+'</span>').join('')+'</div>'; }
function tableAll(){ const items=list().slice(), k=S.sort, d=S.dir, val=s=>k==='first'?s.first:k==='name'?T(s.name):k==='grp'?T(TX.groups[s.group]):k==='fl'?(st(s).flights||0):k==='eva'?(st(s).evas||0):(st(s).days||0);
  items.sort((a,b)=>{ const x=val(a), y=val(b); return (typeof x==='number'?x-y:String(x).localeCompare(String(y)))*d; });
  const th=(key,l)=>'<th data-sort="'+key+'" class="'+(k===key?'on':'')+'">'+esc(T(l))+(k===key?(d>0?' ▲':' ▼'):'')+'</th>';
  return '<div class="sciw-twrap"><table class="obsw-table sciw-all"><thead><tr>'+th('name',TX.colName)+th('first',TX.colFirst)+th('grp',TX.colGrp)+th('fl',TX.colFl)+th('days',TX.colDays)+th('eva',TX.colEva)+'<th>'+esc(T(TX.colMain))+'</th></tr></thead><tbody>'+
    items.map(s=>'<tr data-id="'+s.id+'"><td><b>'+esc(T(s.name))+'</b></td><td>'+esc(s.first)+'</td><td><i class="sciw-dot" style="background:'+GCOL[s.group]+'"></i>'+esc(T(TX.groups[s.group]))+'</td><td>'+esc(st(s).flights!=null?st(s).flights:'—')+'</td><td>'+esc(fmtDays(st(s).days))+'</td><td>'+esc(st(s).evas!=null?st(s).evas:'—')+'</td><td>'+esc(T(s.short))+'</td></tr>').join('')+'</tbody></table></div>'; }
function renderCompare(){ const v=S.el.querySelector('.sciw-view');
  v.innerHTML='<div class="obsw-info sciw-info"><div class="obsw-ihead"><h4>'+esc(T(S.tbl?TX.tblT:TX.cmpT))+'</h4><div class="obsw-itabs"><button class="sn-chip'+(S.tbl?'':' on')+'" data-m="0">'+esc(T(TX.chart))+'</button><button class="sn-chip'+(S.tbl?' on':'')+'" data-m="1">'+esc(T(TX.table))+'</button></div></div>'+
    (S.tbl?tableAll():'<p class="sub sciw-sub">'+esc(T(TX.cmpS))+'</p>'+legend()+'<div class="obsw-chart">'+chartDays()+'</div>')+'</div><div class="obsw-tip sciw-tip" role="tooltip"></div>';
  v.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>{ click(620); S.tbl=b.dataset.m==='1'; renderCompare(); }));
  v.querySelectorAll('th[data-sort]').forEach(h=>h.addEventListener('click',()=>{ click(620); if(S.sort===h.dataset.sort) S.dir*=-1; else { S.sort=h.dataset.sort; S.dir=h.dataset.sort==='name'||h.dataset.sort==='grp'||h.dataset.sort==='first'?1:-1; } renderCompare(); }));
  v.querySelectorAll('[data-id]').forEach(r=>r.addEventListener('click',()=>{ click(700); select(r.dataset.id); }));
  const tip=v.querySelector('.sciw-tip');
  v.querySelectorAll('[data-tip]').forEach(el=>{ el.addEventListener('pointerenter',()=>{ tip.textContent=el.dataset.tip; tip.classList.add('on'); });
    el.addEventListener('pointermove',e=>{ const r=v.getBoundingClientRect(); tip.style.transform='translate('+(e.clientX-r.left+12)+'px,'+(e.clientY-r.top+v.scrollTop-34)+'px)'; });
    el.addEventListener('pointerleave',()=>tip.classList.remove('on')); }); }
function toggleCompare(){ click(700); S.cmp=!S.cmp; syncHead(); if(S.cmp){ S.el.classList.add('viewing'); S.el.querySelectorAll('.obsw-it').forEach(b=>b.classList.remove('on')); renderCompare(); }
  else { const s=all().find(x=>x.id===S.sel)||list()[0]; if(s) select(s.id); } }
function syncHead(){ const b=S.el.querySelector('.sciw-cmp'); b.textContent=T(TX.compare); b.classList.toggle('on',S.cmp); }

/* ---------- Katta ko'rinish (suratlar) ---------- */
function lightbox(ph,k){ let lb=document.getElementById('astwLb');
  if(!lb){ lb=document.createElement('div'); lb.id='astwLb'; lb.className='obsw-lb'; lb.innerHTML='<button class="obsw-lbx">✕</button><button class="obsw-lbn prev">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="obsw-lbn next">›</button>';
    document.body.appendChild(lb); const go=d=>{ lb._k=(lb._k+d+lb._ph.length)%lb._ph.length; show(); };
    lb.addEventListener('click',e=>{ if(e.target===lb||e.target.classList.contains('obsw-lbx')) lb.classList.remove('on'); });
    lb.querySelector('.prev').addEventListener('click',()=>go(-1)); lb.querySelector('.next').addEventListener('click',()=>go(1));
    window.addEventListener('keydown',e=>{ if(!lb.classList.contains('on')) return; if(e.key==='Escape'){ e.stopImmediatePropagation(); lb.classList.remove('on'); } if(e.key==='ArrowLeft'){ e.stopImmediatePropagation(); go(-1); } if(e.key==='ArrowRight'){ e.stopImmediatePropagation(); go(1); } },true); }
  const show=()=>{ const p=lb._ph[lb._k]; lb.querySelector('img').src=p.src; lb.querySelector('figcaption').innerHTML='<b>'+esc(p.title)+'</b> <small>'+(lb._k+1)+' / '+lb._ph.length+'</small><br>'+credit(p); lb.querySelectorAll('.obsw-lbn').forEach(b=>b.style.display=lb._ph.length>1?'':'none'); };
  lb._ph=ph; lb._k=k; show(); lb.classList.add('on'); }

/* ---------- Ekran ---------- */
function build(){
  const el=document.createElement('div'); el.id='astWorld'; el.className='obsw sciw astw'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  el.innerHTML='<div class="obsw-card glass"><div class="obsw-head"><button class="ac-link obsw-back" type="button"></button><div><h3></h3><p></p></div><button class="sn-chip sciw-cmp" type="button"></button><span class="obsw-count"></span><button class="panel-close obsw-x" type="button">✕</button></div>'+
    '<div class="obsw-main"><aside class="obsw-list"><label class="insw-search"><span aria-hidden="true">🔍</span><input class="insw-q" type="search" autocomplete="off"></label>'+
    '<div class="insw-flt"><small class="t1"></small><div class="obsw-cats astw-eras"></div><small class="t2"></small><div class="obsw-cats astw-grps"></div><small class="t3"></small><div class="obsw-cats astw-tags"></div></div><div class="obsw-items"></div></aside>'+
    '<section class="obsw-view sciw-view"></section></div></div>';
  document.body.appendChild(el); S.el=el;
  el.querySelector('.obsw-x').addEventListener('click',close);
  el.querySelector('.obsw-back').addEventListener('click',()=>{ click(520); el.classList.remove('viewing'); });
  el.querySelector('.sciw-cmp').addEventListener('click',toggleCompare);
  const qi=el.querySelector('.insw-q'); qi.addEventListener('input',()=>{ S.q=qi.value.trim(); renderList(); if(S.cmp) renderCompare(); });
  qi.addEventListener('keydown',e=>{ if(e.key==='Escape'&&qi.value){ e.stopPropagation(); qi.value=''; S.q=''; renderList(); } if(e.key==='Enter'){ const f=list()[0]; if(f) select(f.id); } });
  el.addEventListener('pointerdown',e=>{ if(e.target===el) close(); });
  texts(); }
function texts(){ const b0=document.getElementById('astBtn'); if(b0) b0.title=T(TX.title); if(!S.el) return; const q=s=>S.el.querySelector(s);
  q('h3').textContent='🧑‍🚀 '+T(TX.title); q('.obsw-head p').textContent=T(TX.sub); q('.obsw-back').textContent=T(TX.back);
  q('.insw-q').placeholder=T(TX.search); q('.t1').textContent=T(TX.eraT); q('.t2').textContent=T(TX.grpT); q('.t3').textContent=T(TX.tagT); syncHead();
  renderFilters(); renderList(); if(S.cmp) renderCompare(); else { const s=all().find(x=>x.id===S.sel); if(s) renderPerson(s); }
  const b=document.getElementById('astBtn'); if(b) b.title=T(TX.title); }
function open(){ if(S.open) return; ['OBS_WORLD','INS_WORLD','SCI_WORLD'].forEach(k=>{ if(window[k]) window[k].close(); });
  if(!S.el) build(); S.open=true; S.el.classList.add('on'); document.body.classList.add('obswmode'); window.__labCover=true; texts(); click(760);
  const first=S.sel||(all().find(x=>x.id==='gagarin')||all()[0]||{}).id; if(window.innerWidth>760&&first&&!S.cmp) select(first); }
function close(){ if(!S.open) return; S.open=false; S.el.classList.remove('on','viewing'); document.body.classList.remove('obswmode'); window.__labCover=false; click(440); }
window.addEventListener('keydown',e=>{ if(!S.open) return; if(e.key==='Escape') close();
  else if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!S.cmp&&S.sel&&!/input|textarea/i.test((document.activeElement||{}).tagName||'')) step(e.key==='ArrowLeft'?-1:1); });
new MutationObserver(()=>{ texts(); }).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
function wireBtn(){ const b=document.getElementById('astBtn'); if(b&&!b._ast){ b._ast=1; b.title=T(TX.title); b.addEventListener('click',()=>{ S.open?close():open(); }); } }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wireBtn); else wireBtn();
window.AST_WORLD={ open, close, select, isOpen:()=>S.open };
})();
