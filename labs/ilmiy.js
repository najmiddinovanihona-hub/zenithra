// Ilmiy bo'lim — alohida to'liq ekran (UZ / RU / EN)
(function(){
const UI={
 uz:{title:"Ilmiy bo'lim",sub:"Haqiqiy tadqiqotlar, raqamlar va kashfiyotlar",back:"Orqaga",topics:"Mavzular",about:"Tavsif",more:"Batafsil",res:"Ilmiy izlanishlar va kashfiyotlar",chart:"Grafik",table:"Jadval",gl:"Atamalar lug'ati",q:"Ochiq savollar — fan hali javob topmagan",facts:"Qiziqarli faktlar",prev:"Oldingi",next:"Keyingi"},
 ru:{title:"Научный раздел",sub:"Реальные исследования, цифры и открытия",back:"Назад",topics:"Темы",about:"Описание",more:"Подробнее",res:"Научные исследования и открытия",chart:"График",table:"Таблица",gl:"Словарь терминов",q:"Открытые вопросы — на них наука пока не ответила",facts:"Интересные факты",prev:"Предыдущая",next:"Следующая"},
 en:{title:"Science section",sub:"Real research, numbers and discoveries",back:"Back",topics:"Topics",about:"Overview",more:"In depth",res:"Research & discoveries",chart:"Chart",table:"Table",gl:"Glossary",q:"Open questions — science has no answer yet",facts:"Fun facts",prev:"Previous",next:"Next"}
};
const LOC={uz:'uz-UZ',ru:'ru-RU',en:'en-US'};
const COL=['#4ea8ff','#a26bff','#ffc861','#5fe0b0','#ff7a8a','#7fd4ff'];
const L=()=>{const l=(typeof LANG!=='undefined'?LANG:localStorage.getItem('solar_lang'))||'uz';return UI[l]?l:'uz';};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function fmt(v,l){const o=Math.abs(v)>=1e5?{notation:'compact',maximumFractionDigits:1}:{maximumSignificantDigits:3};try{return new Intl.NumberFormat(LOC[l],o).format(v);}catch(e){return String(v);}}
function bar(c,labels,l){
 const n=c.vals.length,rowH=36,lw=190,W=600,bw=W-lw-80,H=n*rowH+8;let lo,hi,pos;
 if(c.log){const m=Math.min(...c.vals),M=Math.max(...c.vals);lo=Math.floor(Math.log10(m))-0.3;hi=Math.log10(M);pos=v=>(Math.log10(v)-lo)/(hi-lo);}
 else{lo=c.min||0;hi=Math.max(...c.vals);pos=v=>(v-lo)/(hi-lo||1);}
 let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">`;
 c.vals.forEach((v,i)=>{const y=i*rowH+4,w=Math.max(4,pos(v)*bw);
  s+=`<text x="${lw-10}" y="${y+20}" text-anchor="end" fill="currentColor" font-size="13" opacity=".85">${esc(labels[i])}</text><rect x="${lw}" y="${y+5}" width="${bw}" height="22" rx="6" fill="rgba(255,255,255,.05)"></rect><rect x="${lw}" y="${y+5}" width="${w}" height="22" rx="6" fill="${COL[i%COL.length]}"></rect><text x="${lw+w+8}" y="${y+21}" fill="currentColor" font-size="13" font-weight="700">${fmt(v,l)}</text>`;});
 return s+'</svg>';
}
function donut(c,labels,l){
 const tot=c.vals.reduce((a,b)=>a+b,0),R=60,C=2*Math.PI*R;let off=0;
 let s=`<div style="display:flex;flex-wrap:wrap;align-items:center;gap:22px"><svg viewBox="0 0 160 160" width="170" height="170" style="flex:none;transform:rotate(-90deg)">`;
 c.vals.forEach((v,i)=>{const d=v/tot*C;s+=`<circle cx="80" cy="80" r="${R}" fill="none" stroke="${COL[i%COL.length]}" stroke-width="26" stroke-dasharray="${d} ${C-d}" stroke-dashoffset="${-off}"></circle>`;off+=d;});
 s+=`</svg><div style="display:flex;flex-direction:column;gap:9px;min-width:160px;flex:1">`;
 c.vals.forEach((v,i)=>{s+=`<div style="display:flex;align-items:center;gap:10px;font-size:14px"><span style="width:12px;height:12px;border-radius:3px;flex:none;background:${COL[i%COL.length]}"></span><span style="flex:1">${esc(labels[i])}</span><b>${fmt(v,l)}%</b></div>`;});
 return s+'</div></div>';
}
const css=`#ilmiy{position:fixed;inset:0;z-index:90;display:none;flex-direction:column;color:var(--text);background:radial-gradient(ellipse at 70% 0%,rgba(40,60,140,.35),transparent 60%),radial-gradient(ellipse at 0% 100%,rgba(110,60,180,.22),transparent 55%),#04060f}
#ilmiy.open{display:flex}
.ilm-top{display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid rgba(140,170,255,.12);flex:none}
.ilm-top h1{font-size:18px;font-weight:800;flex:1;min-width:0;letter-spacing:.02em}
.ilm-btn{padding:8px 14px;border-radius:12px;font-size:13px;color:var(--text);background:rgba(255,255,255,.05);border:1px solid rgba(140,170,255,.18);cursor:pointer}
.ilm-btn:hover{border-color:var(--neon)}
.ilm-btn.on{border-color:var(--neon);box-shadow:0 0 12px rgba(78,168,255,.35)}
.ilm-langs{display:flex;gap:6px}
.ilm-wrap{flex:1;min-height:0;display:grid;grid-template-columns:260px minmax(0,1fr)}
.ilm-side{overflow:auto;padding:22px 14px;border-right:1px solid rgba(140,170,255,.1);display:flex;flex-direction:column;gap:6px}
.ilm-side small{font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.6;padding:0 10px 8px}
.ilm-side button{display:flex;gap:10px;align-items:center;text-align:left;padding:11px 12px;border-radius:12px;font-size:14px;color:var(--text);background:transparent;border:1px solid transparent;cursor:pointer}
.ilm-side button:hover{background:rgba(255,255,255,.04)}
.ilm-side button.on{background:rgba(78,168,255,.1);border-color:rgba(78,168,255,.45)}
.ilm-main{overflow:auto;padding:34px clamp(18px,4vw,56px) 60px}
.ilm-art{max-width:920px;margin:0 auto}
.ilm-hero{display:flex;gap:18px;align-items:center;margin-bottom:22px}
.ilm-hero span{font-size:48px;line-height:1}
.ilm-hero h2{font-size:clamp(28px,4vw,40px);font-weight:800;line-height:1.1;background:linear-gradient(120deg,#fff,var(--neon) 60%,var(--neon-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.ilm-art h4{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--neon);margin:34px 0 14px}
.ilm-art p{font-size:16px;line-height:1.75;margin-bottom:14px;text-wrap:pretty}
.ilm-tl{display:flex;flex-direction:column;gap:12px;border-left:2px solid rgba(78,168,255,.3);padding-left:18px}
.ilm-tl>div{display:grid;grid-template-columns:100px minmax(0,1fr);gap:14px;font-size:15px;line-height:1.6}
.ilm-tl b{color:var(--neon)}
.ilm-box{padding:18px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(140,170,255,.12)}
.ilm-box small{display:block;font-size:13px;opacity:.8;margin-bottom:12px}
.ilm-tbl{width:100%;border-collapse:collapse;font-size:14px}
.ilm-tbl th{text-align:left;font-weight:700;color:var(--neon);padding:9px 10px;border-bottom:1px solid rgba(140,170,255,.25)}
.ilm-tbl td{padding:9px 10px;border-bottom:1px solid rgba(140,170,255,.08);vertical-align:top}
.ilm-gl{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.ilm-gl div{padding:14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(140,170,255,.12);font-size:14px;line-height:1.55}
.ilm-gl b{display:block;color:var(--neon);margin-bottom:4px}
.ilm-list{display:flex;flex-direction:column;gap:10px;list-style:none;padding:0}
.ilm-list li{padding:13px 16px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(140,170,255,.12);font-size:15px;line-height:1.6}
.ilm-q li{border-color:rgba(162,107,255,.3)}
.ilm-nav{display:flex;justify-content:space-between;gap:12px;margin-top:40px}
@media(max-width:820px){.ilm-wrap{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}.ilm-side{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid rgba(140,170,255,.1);padding:10px}.ilm-side small{display:none}.ilm-side button{flex:none;white-space:nowrap}.ilm-tl>div{grid-template-columns:1fr;gap:2px}.ilm-top h1{font-size:15px}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const ov=document.createElement('div');ov.id='ilmiy';
ov.innerHTML=`<div class="ilm-top"><button class="ilm-btn" id="ilmBack"></button><h1 id="ilmTitle"></h1><div class="ilm-langs" id="ilmLangs"></div></div><div class="ilm-wrap"><nav class="ilm-side" id="ilmSide"></nav><main class="ilm-main" id="ilmMain"><article class="ilm-art" id="ilmArt"></article></main></div>`;
document.body.appendChild(ov);
const $=id=>ov.querySelector('#'+id);
let cur=0,lastLang=null;
const btn=document.createElement('button');btn.id='ilmiyBtn';btn.className='icon-btn';btn.textContent='🔬';
function go(i){cur=i;render();$('ilmMain').scrollTop=0;}
function render(){
 const D=window.ILMIY||[],X=window.ILMIY_X||{};if(!D.length)return;
 const l=L(),u=UI[l];lastLang=l;btn.title=u.title;
 $('ilmBack').textContent='← '+u.back;$('ilmTitle').textContent='🔬 '+u.title;
 $('ilmLangs').innerHTML=['uz','ru','en'].map(k=>`<button class="ilm-btn${k===l?' on':''}" data-l="${k}">${k.toUpperCase()}</button>`).join('');
 const side=$('ilmSide');side.innerHTML=`<small>${u.topics}</small>`;
 D.forEach((x,i)=>{const b=document.createElement('button');b.innerHTML=`<span>${x.ico}</span><span>${esc(x[l].t)}</span>`;if(i===cur)b.className='on';b.onclick=()=>go(i);side.appendChild(b);});
 const T=D[cur],x=T[l],e=(X[cur]||{})[l]||{};
 let h=`<div class="ilm-hero"><span>${T.ico}</span><div><h2>${esc(x.t)}</h2><p style="margin:6px 0 0;opacity:.7;font-size:14px">${u.sub}</p></div></div>`;
 h+=`<h4>${u.about}</h4>${x.d.map(p=>`<p>${esc(p)}</p>`).join('')}`;
 if(e.more)h+=`<h4>${u.more}</h4>${e.more.map(p=>`<p>${esc(p)}</p>`).join('')}`;
 h+=`<h4>${u.res}</h4><div class="ilm-tl">${x.res.map(r=>`<div><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('')}</div>`;
 h+=`<h4>${u.chart}</h4><div class="ilm-box"><small>${esc(x.chartTitle)}</small>${T.chart.type==='donut'?donut(T.chart,x.labels,l):bar(T.chart,x.labels,l)}</div>`;
 h+=`<h4>${u.table}</h4><div class="ilm-box" style="overflow-x:auto"><table class="ilm-tbl"><thead><tr>${x.table.h.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${x.table.r.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(e.g)h+=`<h4>${u.gl}</h4><div class="ilm-gl">${e.g.map(g=>`<div><b>${esc(g[0])}</b>${esc(g[1])}</div>`).join('')}</div>`;
 if(e.q)h+=`<h4>${u.q}</h4><ul class="ilm-list ilm-q">${e.q.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
 h+=`<h4>${u.facts}</h4><ul class="ilm-list">${x.f.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
 const p=D[cur-1],n=D[cur+1];
 h+=`<div class="ilm-nav">${p?`<button class="ilm-btn" data-go="${cur-1}">← ${u.prev}: ${esc(p[l].t)}</button>`:'<span></span>'}${n?`<button class="ilm-btn" data-go="${cur+1}">${u.next}: ${esc(n[l].t)} →</button>`:''}</div>`;
 $('ilmArt').innerHTML=h;
 if(window.ILMIY_HOOK)try{window.ILMIY_HOOK(T,l,$('ilmArt'));}catch(err){console.warn(err);}
}
ov.addEventListener('click',ev=>{const g=ev.target.closest('[data-go]');if(g)go(+g.dataset.go);const lb=ev.target.closest('[data-l]');if(lb&&window.applyLanguage){window.applyLanguage(lb.dataset.l);render();}});
const close=()=>ov.classList.remove('open');
$('ilmBack').onclick=close;
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&ov.classList.contains('open'))close();});
btn.onclick=()=>{render();ov.classList.add('open');};
const ub=document.getElementById('ubBtn');
if(ub)ub.after(btn);else document.querySelector('#topbar .controls')?.prepend(btn);
render();
setInterval(()=>{if(L()!==lastLang){if(ov.classList.contains('open'))render();else{lastLang=L();btn.title=UI[lastLang].title;}}},500);
})();
