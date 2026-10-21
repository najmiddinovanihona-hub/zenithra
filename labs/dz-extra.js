/* DARSLIK · Qo'shimcha bo'limlar: Atamalar lug'ati va Formulalar varag'i */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X;
const isMain=t=>/^t\d+$/.test(t.id);
const U={
 find:X('Qidirish…','Поиск…','Search…'), onlySeen:X('Faqat o‘qilgan mavzular','Только прочитанные темы','Read topics only'), allT:X('Barcha mavzular','Все темы','All topics'),
 terms:X('atama','терминов','terms'), forms:X('formula','формул','formulas'), none:X('Hech narsa topilmadi','Ничего не найдено','Nothing found'), topic:X('mavzu','тема','topic'), go:X('Mavzuni ochish','Открыть тему','Open topic'),
 print:X('🖨 Chop etish / PDF','🖨 Печать / PDF','🖨 Print / PDF'), sheet:X('Formulalar varag‘i','Шпаргалка формул','Formula sheet'), lex:X('Atamalar lug‘ati','Словарь терминов','Glossary'),
 lexS:X('Darslikning barcha mavzularidagi tayanch tushunchalar — qidiruv va harf bo‘yicha','Ключевые понятия всех тем учебника — поиск и алфавит','Key terms from every topic — search and A–Z'),
 shS:X('Barcha mavzulardagi formulalar bitta varaqda — chop etish yoki PDF qilib saqlash mumkin','Все формулы учебника на одном листе — можно распечатать или сохранить в PDF','Every formula on one sheet — print it or save as PDF'),
 popup:X('Chop etish oynasini ochib bo‘lmadi — brauzerda qalqib chiquvchi oynalarga ruxsat bering.','Не удалось открыть окно печати — разрешите всплывающие окна.','Could not open the print window — allow pop-ups.'),
 cols:X('Ustunlar','Колонки','Columns')
};
const head=(K,T,cnt,extra)=>`<section class="dz-sec dz-card t1-hero" style="display:grid;gap:10px">
  <input id="dxQ" type="search" placeholder="${T(U.find)}" style="width:100%;box-sizing:border-box;padding:11px 14px;border-radius:10px;border:1px solid var(--glass-brd);background:transparent;color:inherit;font:inherit">
  <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${K.chips('sc',[['all',T(U.allT)],['seen',T(U.onlySeen)]])}${extra||''}<span id="dxN" style="margin-left:auto;font-size:12.5px;color:var(--text-dim)"></span></div></section>`;
const topicsOf=sc=>{ const P=window.DZP?window.DZP.all():{}; return window.DARSLIK.list().map((t,i)=>[t,i]).filter(([t])=>isMain(t)&&(sc!=='seen'||(P[t.id]&&P[t.id].v))); };

/* ── Atamalar lug'ati ── */
function buildLex(el,api){
  const K=K0.kit(el,api), {T,$,$$,mark,on}=K; let sc='all', q='', let_='';
  el.innerHTML=head(K,T)+`<div id="dxAZ" style="display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px"></div><div id="dxOut"></div>`;
  const all=()=>{ const out=[]; topicsOf(sc).forEach(([t,i])=>{ let GL=null; try{ GL=t.GL; }catch(e){} (GL||[]).forEach(g=>out.push({k:T(g[0]),d:T(g[1]),id:t.id,n:i+1})); });
    return out.sort((a,b)=>a.k.localeCompare(b.k,api.L())); };
  const first=s=>{ const c=s.replace(/^[^\p{L}\p{N}]+/u,'').charAt(0).toUpperCase(); return c||'#'; };
  function render(){ const A=all(), ql=q.trim().toLowerCase(), F=A.filter(a=>(!ql||(a.k+' '+a.d).toLowerCase().includes(ql)));
    const letters=[...new Set(F.map(a=>first(a.k)))]; if(let_&&!letters.includes(let_)) let_='';
    $('#dxAZ').innerHTML=[['',T(K.U.all)]].concat(letters.map(l=>[l,l])).map(([v,l])=>`<button class="lab-chip${v===let_?' on':''}" data-az="${v}" style="min-width:32px;padding:4px 8px;font-size:12px">${l}</button>`).join('');
    $$('[data-az]').forEach(b=>b.onclick=()=>{ K.click(720); let_=b.dataset.az; render(); });
    const V=F.filter(a=>!let_||first(a.k)===let_); $('#dxN').textContent=V.length+' '+T(U.terms);
    if(!V.length){ $('#dxOut').innerHTML=`<p class="t1-p">${T(U.none)}</p>`; return; }
    const groups={}; V.forEach(a=>(groups[first(a.k)]=groups[first(a.k)]||[]).push(a));
    $('#dxOut').innerHTML=Object.keys(groups).map(l=>`<section class="dz-sec"><div class="sec-title">${l}</div><dl class="t1-gl">${groups[l].map(a=>`<div class="dz-card" style="display:flex;flex-direction:column;gap:6px"><dt>${a.k}</dt><dd style="flex:1">${a.d}</dd><button class="lab-chip" data-go="${a.id}" title="${T(U.go)}" style="align-self:flex-start;font-size:11px;padding:3px 9px">→ ${a.n}-${T(U.topic)}</button></div>`).join('')}</dl></section>`).join('');
    $$('[data-go]').forEach(b=>b.onclick=()=>{ K.click(720); api.open&&api.open(b.dataset.go); }); }
  $('#dxQ').oninput=()=>{ q=$('#dxQ').value; render(); };
  on('sc',v=>{ sc=v; mark('sc',v); render(); }); mark('sc','all'); render();
  return K.start();
}

/* ── Formulalar varag'i ── */
function buildSheet(el,api){
  const K=K0.kit(el,api), {T,$,$$,mark,on}=K; let sc='all', q='', cols=2;
  el.innerHTML=head(K,T,0,`<span style="display:flex;gap:4px;align-items:center"><span class="t1-lab">${T(U.cols)}</span>${K.chips('cl',[[1,'1'],[2,'2'],[3,'3']])}</span><button class="lab-chip on" id="dxP">${T(U.print)}</button>`)+`<div id="dxOut"></div>`;
  const data=()=>{ const ql=q.trim().toLowerCase(); return topicsOf(sc).map(([t,i])=>({t,n:i+1,f:((window.DZF||{})[t.id]||[]).filter(f=>!ql||f.toLowerCase().includes(ql)||T(t.title).toLowerCase().includes(ql))})).filter(g=>g.f.length); };
  function render(){ const D=data(), n=D.reduce((s,g)=>s+g.f.length,0); $('#dxN').textContent=n+' '+T(U.forms);
    $('#dxOut').innerHTML=D.length?`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(${cols===1?'100%':cols===2?'320px':'240px'},1fr));gap:12px">${D.map(g=>`<div class="dz-card" style="padding:14px;display:grid;gap:8px;align-content:start">
      <button data-go="${g.t.id}" style="all:unset;cursor:pointer;font-weight:700;font-size:13.5px;line-height:1.35;text-wrap:pretty">${g.n}. ${g.t.ico||''} ${T(g.t.title)}</button>
      ${g.f.map(f=>`<div class="t1-formula" style="margin:0">${f.replace(/</g,'&lt;')}</div>`).join('')}</div>`).join('')}</div>`:`<p class="t1-p">${T(U.none)}</p>`;
    $$('[data-go]').forEach(b=>b.onclick=()=>{ K.click(720); api.open&&api.open(b.dataset.go); }); }
  $('#dxQ').oninput=()=>{ q=$('#dxQ').value; render(); };
  on('sc',v=>{ sc=v; mark('sc',v); render(); }); mark('sc','all');
  on('cl',v=>{ cols=+v; mark('cl',v); render(); }); mark('cl','2');
  $('#dxP').onclick=()=>{ K.click(760); const D=data(), e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
    const html=`<!doctype html><html lang="${api.L()}"><head><meta charset="utf-8"><title>${e(T(U.sheet))}</title><style>
      @page{size:A4;margin:14mm}body{font:10.5pt/1.4 "Segoe UI",system-ui,sans-serif;color:#111;margin:0}h1{font-size:16pt;margin:0 0 2mm}p.s{margin:0 0 6mm;color:#555;font-size:9pt}
      .g{columns:${Math.max(1,Math.min(3,cols))};column-gap:7mm}.c{break-inside:avoid;margin:0 0 4mm;padding:0 0 3mm;border-bottom:.3mm solid #ccc}.c b{display:block;font-size:10pt;margin:0 0 1.5mm}
      .f{font-family:"Cambria Math","Times New Roman",serif;font-size:11pt;padding:1mm 0}</style></head><body>
      <h1>${e(T(U.sheet))}</h1><p class="s">${e(T(window.DARSLIK.list().length?{uz:'Astronomiya · Darslik',ru:'Астрономия · Учебник',en:'Astronomy · Textbook'}:U.sheet))}</p>
      <div class="g">${D.map(g=>`<div class="c"><b>${g.n}. ${e(T(g.t.title))}</b>${g.f.map(f=>`<div class="f">${e(f)}</div>`).join('')}</div>`).join('')}</div>
      <script>window.onload=()=>{ setTimeout(()=>window.print(),250); };<\/script></body></html>`;
    const w=window.open('','_blank'); if(!w){ alert(T(U.popup)); return; } w.document.open(); w.document.write(html); w.document.close(); };
  render();
  return K.start();
}
window.DARSLIK.add({ id:'lugat', ico:'🔤', num:X('Aa','Aa','Aa'), badge:U.lex, title:U.lex, sub:U.lexS, build:buildLex });
window.DARSLIK.add({ id:'formula', ico:'📐', num:X('ƒ','ƒ','ƒ'), badge:U.sheet, title:U.sheet, sub:U.shS, build:buildSheet });
}; go0();
})();
