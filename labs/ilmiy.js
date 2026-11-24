// Ilmiy bo'lim — alohida to'liq ekran (UZ / RU / EN)
(function(){
const UI={
 uz:{title:"Ilmiy bo'lim",sub:"Haqiqiy tadqiqotlar, raqamlar va kashfiyotlar",back:"Orqaga",topics:"Mavzular",about:"Tavsif",more:"Batafsil",res:"Ilmiy izlanishlar va kashfiyotlar",chart:"Grafik",table:"Jadval",gl:"Atamalar lug'ati",q:"Ochiq savollar — fan hali javob topmagan",facts:"Qiziqarli faktlar",prev:"Oldingi",next:"Keyingi",src:"Manba",data:"Grafik ma'lumotlari (jadval)",item:"Ko'rsatkich",log:"log. shkala",e1:"chiziqlar — 1σ noaniqlik",tu:["s","min","soat","kun","yil"]},
 ru:{title:"Научный раздел",sub:"Реальные исследования, цифры и открытия",back:"Назад",topics:"Темы",about:"Описание",more:"Подробнее",res:"Научные исследования и открытия",chart:"График",table:"Таблица",gl:"Словарь терминов",q:"Открытые вопросы — на них наука пока не ответила",facts:"Интересные факты",prev:"Предыдущая",next:"Следующая",src:"Источник",data:"Данные графика (таблица)",item:"Показатель",log:"лог. шкала",e1:"планки — погрешность 1σ",tu:["с","мин","ч","сут","г."]},
 en:{title:"Science section",sub:"Real research, numbers and discoveries",back:"Back",topics:"Topics",about:"Overview",more:"In depth",res:"Research & discoveries",chart:"Chart",table:"Table",gl:"Glossary",q:"Open questions — science has no answer yet",facts:"Fun facts",prev:"Previous",next:"Next",src:"Source",data:"Chart data (table)",item:"Item",log:"log scale",e1:"error bars: 1σ uncertainty",tu:["s","min","h","d","yr"]}
};
const LOC={uz:'uz-UZ',ru:'ru-RU',en:'en-US'};
// Grafik ranglari — dataviz validatoridan o'tgan (qorong'i fon #0c0e17, OKLCH L 0.48–0.67, kontrast ≥ 3:1),
// qo'shni juftlar: CVD ΔE ≥ 10.8, oddiy ko'z ΔE ≥ 18.1. Tartib qat'iy: moviy, oltin, yalpiz, binafsha, pushti
const COL=['#3b96ec','#bc8807','#13ab7f','#a36efe','#e36173'];
const SURF='#0c0e17';
const L=()=>{const l=(typeof LANG!=='undefined'?LANG:localStorage.getItem('solar_lang'))||'uz';return UI[l]?l:'uz';};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const escA=s=>esc(s).replace(/"/g,'&quot;');
// Brauzerda o'zbek raqam formati bo'lmasa (Chrome), u bilan bir xil qoida — ru-RU (bo'sh joy, vergul) + o'zbekcha qisqartmalar
const UZN=(()=>{try{return new Intl.NumberFormat('uz-UZ').format(1.5)==='1,5';}catch(e){return false;}})();   // Chrome 'uz' ni tan oladi, lekin en-US qoidasi bilan yozadi
const nf=(v,l,o)=>{try{if(l==='uz'&&!UZN)return new Intl.NumberFormat('ru-RU',o).format(v).replace('трлн','trln').replace('млрд','mlrd').replace('млн','mln').replace('тыс.','ming');return new Intl.NumberFormat(LOC[l],o).format(v);}catch(e){return String(v);}};
function fmt(v,l){return nf(v,l,Math.abs(v)>=1e5?{notation:'compact',maximumFractionDigits:1}:{maximumSignificantDigits:3});}
const pct=(v,l)=>nf(v/100,l,{style:'percent',maximumFractionDigits:1});
const SUP={'-':'⁻',0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹'};
// Matn kengligini o'lchash (yorliqlar ustma-ust tushmasligi uchun)
let FF='sans-serif',MC=null;
function tw(s,px,wt){if(!MC)MC=document.createElement('canvas').getContext('2d');MC.font=`${wt||400} ${px}px ${FF}`;return MC.measureText(String(s)).width;}
function wrap(s,maxW,px,wt){const out=[];let cur='';String(s).split(' ').forEach(w=>{const t=cur?cur+' '+w:w;if(cur&&tw(t,px,wt)>maxW){out.push(cur);cur=w;}else cur=t;});if(cur)out.push(cur);return out;}
// Vaqtni odam o'qiydigan birlikda: s → min → soat → kun → yil
function human(s,l){const t=UI[l].tu,[d,k]=s<60?[1,0]:s<3600?[60,1]:s<172800?[3600,2]:s<63115200?[86400,3]:[31557600,4];return fmt(s/d,l)+' '+t[k];}
// Belgi yonidagi qisqa qiymat matni (± xatolik, foiz, vaqt)
function vtxt(c,i,l){const v=c.vals[i];if(c.time)return human(v,l);if(c.pct||c.type==='part')return pct(v,l);
 const o=c.dp!=null?{minimumFractionDigits:c.dp,maximumFractionDigits:c.dp}:null,f=x=>o?nf(x,l,o):fmt(x,l);
 return c.err?f(v)+' ± '+f(c.err[i]):f(v);}
// Tooltip/aria uchun to'liq matn (birlik bilan)
function ftxt(c,x,i,l){const s=vtxt(c,i,l);return c.time?s+' ('+fmt(c.vals[i],l)+' '+x.u+')':(x.u&&!c.pct&&c.type!=='part'?s+' '+x.u:s);}
// Qiymat o'qi: chiziqli (1-2-5 qadam) yoki logarifmik (o'nlik bo'linmalar 10ⁿ + oraliq 2…9)
function axisOf(c,lo,hi,len,log,l){
 if(log){const e0=Math.floor(Math.log10(lo)+1e-9),e1=Math.ceil(Math.log10(hi)-1e-9),pd=len/((e1-e0)||1),k=Math.max(1,Math.ceil(40/pd)),plain=e0>=-1&&e1<=3,t=[],m=[];
  for(let e=e0;e<=e1;e++){t.push({v:10**e,s:(e-e0)%k?'':plain?nf(10**e,l,{maximumFractionDigits:1}):'10'+String(e).replace(/./g,ch=>SUP[ch])});if(e<e1&&pd>=44)for(let j=2;j<10;j++)m.push(j*10**e);}
  return {f:v=>(Math.log10(v)-e0)/((e1-e0)||1),t,m};}
 const n=Math.max(2,Math.min(6,Math.floor(len/80))),raw=(hi-lo)/n,p=10**Math.floor(Math.log10(raw)),r=raw/p,st=p*(r>=7.5?10:r>=3.5?5:r>=1.5?2:1);
 const a=c.min!=null?c.min:Math.floor(lo/st)*st,b=c.max!=null?c.max:Math.ceil(hi/st)*st,t=[];
 for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9;v+=st){const q=+v.toFixed(9);t.push({v:q,s:c.pct?pct(q,l):fmt(q,l)});}
 return {f:v=>(v-a)/((b-a)||1),t,m:[]};}
// Pastki (gorizontal) qiymat o'qi: panjara, bo'linmalar, sarlavha (birlik bilan); qaytaradi [svg, balandlik]
function xAxis(ax,X0,X1,Y0,Y1,W,title){
 const px=v=>X0+ax.f(v)*(X1-X0);let s='<g aria-hidden="true">';
 ax.m.forEach(v=>{const p=px(v);s+=`<line class="tk" x1="${p}" x2="${p}" y1="${Y1}" y2="${Y1+3}"/>`;});
 ax.t.forEach(t=>{const p=px(t.v);s+=`<line class="gr" x1="${p}" x2="${p}" y1="${Y0}" y2="${Y1}"/><line class="tk" x1="${p}" x2="${p}" y1="${Y1}" y2="${Y1+5}"/>`;
  if(t.s){const w=tw(t.s,12)/2,cx=Math.max(w+1,Math.min(W-w-1,p));s+=`<text class="tl" x="${cx}" y="${Y1+18}" text-anchor="middle">${esc(t.s)}</text>`;}});
 const tl=wrap(title,W-8,12);s+=`<line class="ax" x1="${X0}" x2="${X1}" y1="${Y1}" y2="${Y1}"/><text class="at" x="${(X0+X1)/2}" y="${Y1+38}" text-anchor="middle">`;
 tl.forEach((t,j)=>{const w=tw(t,12)/2;s+=`<tspan x="${Math.max(w,Math.min(W-w,(X0+X1)/2))}" dy="${j?15:0}">${esc(t)}</tspan>`;});
 return [s+'</text></g>',30+tl.length*15];}
// Chap (vertikal) qiymat o'qi; sarlavha o'qning tepasida gorizontal yoziladi (uzun ruscha nomlar sig'ishi uchun)
function yAxis(ax,X0,X1,Y0,Y1){
 const py=v=>Y1-ax.f(v)*(Y1-Y0);let s='<g aria-hidden="true">';
 ax.m.forEach(v=>{const p=py(v);s+=`<line class="tk" x1="${X0-3}" x2="${X0}" y1="${p}" y2="${p}"/>`;});
 ax.t.forEach(t=>{const p=py(t.v);s+=`<line class="gr" x1="${X0}" x2="${X1}" y1="${p}" y2="${p}"/><line class="tk" x1="${X0-5}" x2="${X0}" y1="${p}" y2="${p}"/>`;if(t.s)s+=`<text class="tl" x="${X0-8}" y="${p+4}" text-anchor="end">${esc(t.s)}</text>`;});
 return s+`<line class="ax" x1="${X0}" x2="${X0}" y1="${Y0}" y2="${Y1}"/></g>`;}
function yTitle(title,W){const tl=wrap(title,W-8,12);return [`<text class="at" x="0" y="13" aria-hidden="true">${tl.map((t,j)=>`<tspan x="0" dy="${j?15:0}">${esc(t)}</tspan>`).join('')}</text>`,tl.length*15+10];}
const barPath=(x,y,w,h)=>{const r=Math.min(4,w/2,h/2);return `M${x},${y}h${w-r}a${r},${r} 0 0 1 ${r},${r}v${h-2*r}a${r},${r} 0 0 1 ${-r},${r}h${r-w}z`;};   // uchi yumaloq, asosi to'g'ri
const colPath=(x,y,w,h)=>{const r=Math.min(4,w/2,h/2);return `M${x},${y+h}v${r-h}a${r},${r} 0 0 1 ${r},${-r}h${w-2*r}a${r},${r} 0 0 1 ${r},${r}v${h-r}z`;};
const mark=(i,lab,hit,inner)=>`<g class="m" data-i="${i}" tabindex="0" role="img" aria-label="${escA(lab)}">${hit}${inner}</g>`;
const hitR=(x,y,w,h)=>`<rect class="hit" x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" rx="6"/>`;
const ring=(cx,cy,c,r)=>`<circle class="mk" cx="${cx}" cy="${cy}" r="${r||5}" fill="${c}" stroke="${SURF}" stroke-width="2"/>`;
// Gorizontal qatorlar: ustun (chiziqli, 0 dan) yoki nuqta (log o'q / xatolik chiziqlari). Tor ekranda yorliq belgining ustida
function drawRows(c,x,l,W,tips){
 const n=c.vals.length,narrow=W<520,dot=c.type==='dot',e=c.err,u=UI[l];
 const vt=c.vals.map((_,i)=>vtxt(c,i,l)),vw=Math.max(...vt.map(s=>tw(s,12,600)));
 const lo=e?Math.min(...c.vals.map((v,i)=>v-e[i])):dot?Math.min(...c.vals):0,hi=e?Math.max(...c.vals.map((v,i)=>v+e[i])):Math.max(...c.vals);
 const lw=narrow?0:Math.min(Math.max(...x.labels.map(s=>tw(s,13))),W*.34);
 const X0=narrow?14:lw+18,X1=W-(dot?18:vw+14),ax=axisOf(c,lo,hi,X1-X0,!!c.log,l),px=v=>X0+ax.f(v)*(X1-X0);
 let y=4;const rows=x.labels.map(s=>{const L_=wrap(s,narrow?W-4:lw,13),h=narrow?L_.length*16+30:Math.max(36,L_.length*16+14),r={y,h,L:L_};y+=h;return r;});
 const Y0=2,Y1=y+6;let back='',fr='';
 rows.forEach((r,i)=>{const v=c.vals[i],cy=narrow?r.y+r.L.length*16+15:r.y+r.h/2,col=e?COL[i%COL.length]:COL[0],full=ftxt(c,x,i,l);
  back+=r.L.map((t,j)=>narrow?`<text class="cl" x="0" y="${r.y+13+j*16}">${esc(t)}</text>`:`<text class="cl" x="${X0-14}" y="${cy+4.5+(j-(r.L.length-1)/2)*16}" text-anchor="end">${esc(t)}</text>`).join('');
  let inner='',ax_=px(v);
  if(dot){back+=`<line class="gd" x1="${X0}" x2="${X1}" y1="${cy}" y2="${cy}"/>`;
   let a=ax_,b=ax_;
   if(e){a=px(v-e[i]);b=px(v+e[i]);back=`<rect x="${a}" y="${Y0}" width="${b-a}" height="${Y1-Y0}" fill="${col}" opacity=".13"/>`+back;   // ±1σ yo'lagi
    inner+=`<g class="mk" stroke="${col}" stroke-width="2" stroke-linecap="round"><line x1="${a}" x2="${b}" y1="${cy}" y2="${cy}"/><line x1="${a}" x2="${a}" y1="${cy-5}" y2="${cy+5}"/><line x1="${b}" x2="${b}" y1="${cy-5}" y2="${cy+5}"/></g>`;}
   inner+=ring(ax_,cy,col);
   const tx=Math.max(b,ax_+5)+8,tw_=tw(vt[i],12,600),left=tx+tw_>W-2;
   inner+=`<text class="vl" x="${left?Math.min(a,ax_-5)-8:tx}" y="${cy+4}" text-anchor="${left?'end':'start'}">${esc(vt[i])}</text>`;}
  else{const w=Math.max(2,ax_-X0);inner+=`<path class="mk" d="${barPath(X0,cy-9,w,18)}" fill="${col}"/><text class="vl" x="${X0+w+6}" y="${cy+4}">${esc(vt[i])}</text>`;}
  fr+=mark(i,x.labels[i]+': '+full,hitR(0,r.y+1,W,r.h-2),inner);
  tips[i]={v:full,k:x.labels[i],c:col,x:ax_,y:cy-8};});
 const [axs,ah]=xAxis(ax,X0,X1,Y0,Y1,W,x.ax+(c.log?' · '+u.log:''));
 return {h:Y1+ah,svg:back+axs+fr};}
// Vertikal ustunlar (tartibli toifalar, masalan kuzatuv bosqichlari)
function drawCol(c,x,l,W,tips){
 const n=c.vals.length,narrow=W<520,[tt,th]=yTitle(x.ax,W),Y0=th+16,ph=narrow?180:210,Y1=Y0+ph;
 const ax=axisOf(c,0,Math.max(...c.vals),ph*1.6,false,l),X0=Math.max(...ax.t.map(t=>tw(t.s,12)))+14,X1=W-6,py=v=>Y1-ax.f(v)*ph,band=(X1-X0)/n,bw=Math.min(24,band*.5);
 let s=tt+yAxis(ax,X0,X1,Y0,Y1),fr='';
 c.vals.forEach((v,i)=>{const cx=X0+band*(i+.5),m=/^(.*?)\s*\((.*)\)$/.exec(x.labels[i])||[0,x.labels[i],''],yv=py(v),full=ftxt(c,x,i,l);
  s+=`<text class="cl" x="${cx}" y="${Y1+18}" text-anchor="middle">${esc(m[1])}</text>`+(m[2]?`<text class="tl" x="${cx}" y="${Y1+34}" text-anchor="middle">${esc(m[2])}</text>`:'');
  fr+=mark(i,x.labels[i]+': '+full,hitR(X0+band*i+2,Y0-14,band-4,ph+52),`<path class="mk" d="${colPath(cx-bw/2,yv,bw,Y1-yv)}" fill="${COL[0]}"/><text class="vl" x="${cx}" y="${yv-7}" text-anchor="middle">${esc(vtxt(c,i,l))}</text>`);
  tips[i]={v:full,k:x.labels[i],c:COL[0],x:cx,y:yv-14};});
 return {h:Y1+42,svg:s+fr};}
// Chiziq + nuqtalar (uzluksiz o'zgaruvchiga bog'liq qator, log–log ham mumkin); kursor chizig'i eng yaqin nuqtaga yopishadi
function drawLine(c,x,l,W,tips){
 const narrow=W<520,u=UI[l],[tt,th]=yTitle(x.ax+(c.log?' · '+u.log:''),W),Y0=th+10,ph=narrow?210:250,Y1=Y0+ph;
 const ay=axisOf(c,Math.min(...c.vals),Math.max(...c.vals),ph*1.6,!!c.log,l),X0=Math.max(...ay.t.map(t=>t.s?tw(t.s,12):0))+14,X1=W-16;
 const axx=axisOf({},Math.min(...c.x),Math.max(...c.x),X1-X0,!!c.xlog,l),px=v=>X0+axx.f(v)*(X1-X0),py=v=>Y1-ay.f(v)*ph;
 const P=c.vals.map((v,i)=>[px(c.x[i]),py(v)]),[xs,ah]=xAxis(axx,X0,X1,Y0,Y1,W,x.ax2+(c.xlog?' · '+u.log:''));
 let s=tt+yAxis(ay,X0,X1,Y0,Y1)+xs+`<path d="M${P.map(p=>p.join(',')).join('L')}" fill="none" stroke="${COL[0]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`,fr='';
 P.forEach(([cx,cy],i)=>{const a=i?(P[i-1][0]+cx)/2:X0-8,b=i<P.length-1?(P[i+1][0]+cx)/2:X1+8,full=ftxt(c,x,i,l);
  fr+=mark(i,x.labels[i]+': '+full,hitR(a,Y0,b-a,ph),`<line class="xh" x1="${cx}" x2="${cx}" y1="${Y0}" y2="${Y1}"/>`+ring(cx,cy,COL[0],c.hl===i?6:4.5));
  tips[i]={v:full,k:x.labels[i],c:COL[0],x:cx,y:cy-8};});
 if(c.hl!=null){const [cx,cy]=P[c.hl],t=x.labels[c.hl],w=tw(t,12,600),r=cx+10+w<W;s+=`<text class="vl" x="${r?cx+10:cx-10}" y="${cy-10}" text-anchor="${r?'start':'end'}">${esc(t)}</text>`;}   // faqat ajratilgan nuqtaga to'g'ridan-to'g'ri yorliq
 return {h:Y1+ah,svg:s+fr};}
// Bir butunning qismlari (yig'indi 100 %): baland bo'lakli chiziq + ostida afsona
function drawPart(c,x,l,W,tips){
 const n=c.vals.length,tot=c.vals.reduce((a,b)=>a+b,0),g=2,h=28,avail=W-g*(n-1);let X=0,s='',leg='';
 c.vals.forEach((v,i)=>{const w=avail*v/tot,t=vtxt(c,i,l),fits=tw(t,13,700)+16<=w,full=ftxt(c,x,i,l);
  s+=mark(i,x.labels[i]+': '+full,hitR(X-1,0,w+2,h+8),`<rect class="mk" x="${X}" y="4" width="${w}" height="${h}" rx="4" fill="${COL[i%COL.length]}"/>`+(fits?`<text class="il" x="${X+8}" y="${4+h/2+4.5}">${esc(t)}</text>`:''));
  leg+=`<span><i style="background:${COL[i%COL.length]}"></i>${esc(x.labels[i])}${fits?'':' — '+esc(t)}</span>`;
  tips[i]={v:full,k:x.labels[i],c:COL[i%COL.length],x:X+w/2,y:0};X+=w+g;});
 return {h:h+8,svg:s,after:`<div class="ich-leg" aria-hidden="true">${leg}</div>`};}
// Grafikni o'lchamga qarab chizadi; o'lcham o'zgarsa qayta chiziladi
const RO=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>es.forEach(e=>{const f=e.target;if(f._draw)requestAnimationFrame(f._draw);})):null;
function mount(fig,T,x,l){
 const c=T.chart,k=c.type==='donut'?'part':c.type==='bar'&&(c.log||c.err)?'dot':c.type;   // eski turlar ham ishlaydi
 const C=k===c.type?c:Object.assign({},c,{type:k});
 fig._draw=()=>{const W=Math.floor(fig.clientWidth);if(!W||W===fig._w)return;fig._w=W;FF=getComputedStyle(fig).fontFamily||FF;
  const tips=[],r=(k==='line'?drawLine:k==='col'?drawCol:k==='part'?drawPart:drawRows)(C,x,l,W,tips);
  fig._tips=tips;fig.innerHTML=`<svg width="${W}" height="${Math.ceil(r.h)}" role="group" aria-label="${escA(x.chartTitle)}">${r.svg}</svg>${r.after||''}<div class="ich-tip" aria-hidden="true"><i></i><div><b></b><span></span></div></div>`;};
 const tip=()=>fig.querySelector('.ich-tip');
 const hide=()=>{const t=tip();if(t)t.style.display='none';fig.classList.remove('hov');fig.querySelectorAll('.m.on').forEach(g=>g.classList.remove('on'));};
 const show=g=>{const t=fig._tips[+g.dataset.i],el=tip();if(!t||!el)return;hide();
  el.querySelector('i').style.background=t.c;el.querySelector('b').textContent=t.v;el.querySelector('span').textContent=t.k;   // matn — textContent orqali
  g.classList.add('on');fig.classList.add('hov');el.style.display='flex';
  const W=fig.clientWidth,w=el.offsetWidth,hh=el.offsetHeight;let ty=t.y-hh-10;if(ty<-4)ty=t.y+26;
  el.style.left=Math.max(0,Math.min(W-w,t.x-w/2))+'px';el.style.top=ty+'px';};
 fig.addEventListener('pointerover',e=>{const g=e.target.closest('.m');if(g&&!g.classList.contains('on'))show(g);});
 fig.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hide();});   // sensorli ekranda tooltip fokus yo'qolguncha turadi
 fig.addEventListener('focusin',e=>{const g=e.target.closest('.m');if(g)show(g);});
 fig.addEventListener('focusout',hide);
 fig.addEventListener('keydown',e=>{const g=e.target.closest('.m');if(!g)return;   // ← → / ↑ ↓ belgilar orasida yurish
  const all=[...fig.querySelectorAll('.m')],i=all.indexOf(g),d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];
  if(d){e.preventDefault();const nx=all[(i+d+all.length)%all.length];nx&&nx.focus();}else if(e.key==='Escape'){hide();}});
 if(RO){RO.disconnect();RO.observe(fig);}else fig._draw();   // RO birinchi kuzatuvda (tabiiy layoutdan keyin) chizadi — maqola layouti bilan bitta uzun vazifa bo'lmasin
}
// Grafik ma'lumotlari jadvali (ochiladigan) — qiymatlar tooltipsiz ham o'qiladi
function dataTbl(c,x,l){const u=UI[l],hd=[c.x?x.ax2:u.item,x.ax];if(c.err)hd.push('± 1σ');
 const rows=c.vals.map((v,i)=>{const o=c.dp!=null?{minimumFractionDigits:c.dp,maximumFractionDigits:c.dp}:null,f=y=>o?nf(y,l,o):fmt(y,l);
  const val=c.time?(v<60?fmt(v,l):fmt(v,l)+' ≈ '+human(v,l)):c.pct||c.type==='part'||c.type==='donut'?pct(v,l):f(v);return [x.labels[i],val].concat(c.err?[f(c.err[i])]:[]);});
 return `<details class="ich-data"><summary>${u.data}</summary><table class="ilm-tbl"><thead><tr>${hd.map(h=>`<th>${esc(h||'')}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></details>`;}
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
.ich{position:relative;margin:8px 0 0;min-width:0}
.ich svg{display:block;overflow:visible;font-family:inherit;-webkit-user-select:none;user-select:none}
.ich .gr{stroke:rgba(140,170,255,.11);shape-rendering:crispEdges}
.ich .ax,.ich .tk{stroke:rgba(170,190,255,.4);shape-rendering:crispEdges}
.ich .gd{stroke:rgba(140,170,255,.07)}
.ich .tl{fill:#9aa6cc;font-size:12px;font-variant-numeric:tabular-nums}
.ich .at{fill:#9aa6cc;font-size:12px}
.ich .cl{fill:var(--text);font-size:13px}
.ich .vl{fill:var(--text);font-size:12px;font-weight:600}
.ich .il{fill:#fff;font-size:13px;font-weight:700;pointer-events:none}
.ich .hit{fill:transparent}
.ich .m{outline:none}
.ich .m.on .hit{fill:rgba(140,170,255,.06)}
.ich .m:focus-visible .hit{stroke:var(--neon);stroke-width:1.5}
.ich .mk{transition:opacity .15s}
.ich.hov .m:not(.on) .mk{opacity:.4}
.ich .xh{stroke:rgba(200,215,255,.4);visibility:hidden}
.ich .m.on .xh{visibility:visible}
.ich-tip{position:absolute;display:none;z-index:2;pointer-events:none;gap:8px;align-items:flex-start;padding:8px 11px;border-radius:10px;background:rgba(8,12,28,.97);border:1px solid rgba(140,170,255,.28);box-shadow:0 6px 20px rgba(0,0,0,.5);max-width:min(280px,100%);font-size:12.5px;line-height:1.4}
.ich-tip i{flex:none;width:12px;height:3px;border-radius:2px;margin-top:8px}
.ich-tip b{display:block;font-size:14px;color:#fff;font-variant-numeric:tabular-nums}
.ich-tip span{display:block;color:#9aa6cc}
.ich-leg{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:12px;font-size:13.5px}
.ich-leg span{display:inline-flex;align-items:center;gap:8px}
.ich-leg i{width:12px;height:12px;border-radius:3px;flex:none}
.ilm-art p.ich-src{font-size:12px;line-height:1.5;color:#9aa6cc;margin:12px 0 0}
.ich-data{margin-top:10px;font-size:13px;max-width:100%;overflow-x:auto}
.ich-data summary{cursor:pointer;color:#9aa6cc;width:max-content;max-width:100%}
.ich-data summary:hover{color:var(--text)}
.ich-data .ilm-tbl{margin-top:8px}
.ich-data td:not(:first-child),.ich-data th:not(:first-child){text-align:right;font-variant-numeric:tabular-nums}
.ich-data td:not(:first-child){white-space:nowrap}
@media(forced-colors:active){.ich .mk,.ich-leg i{forced-color-adjust:none}}
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
 const C=T.chart;   // grafik joyi; o'lchamga qarab mount() chizadi
 h+=`<h4>${u.chart}</h4><div class="ilm-box"><small>${esc(x.chartTitle)}</small><figure class="ich" data-ich></figure>${C.src?`<p class="ich-src">${u.src}: ${esc(C.src)}${C.err?' · '+u.e1:''}</p>`:''}${dataTbl(C,x,l)}</div>`;
 h+=`<h4>${u.table}</h4><div class="ilm-box" style="overflow-x:auto"><table class="ilm-tbl"><thead><tr>${x.table.h.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${x.table.r.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(e.g)h+=`<h4>${u.gl}</h4><div class="ilm-gl">${e.g.map(g=>`<div><b>${esc(g[0])}</b>${esc(g[1])}</div>`).join('')}</div>`;
 if(e.q)h+=`<h4>${u.q}</h4><ul class="ilm-list ilm-q">${e.q.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
 h+=`<h4>${u.facts}</h4><ul class="ilm-list">${x.f.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
 const p=D[cur-1],n=D[cur+1];
 h+=`<div class="ilm-nav">${p?`<button class="ilm-btn" data-go="${cur-1}">← ${u.prev}: ${esc(p[l].t)}</button>`:'<span></span>'}${n?`<button class="ilm-btn" data-go="${cur+1}">${u.next}: ${esc(n[l].t)} →</button>`:''}</div>`;
 $('ilmArt').innerHTML=h;
 const fig=$('ilmArt').querySelector('[data-ich]');if(fig)mount(fig,T,x,l);
 if(window.ILMIY_HOOK)try{window.ILMIY_HOOK(T,l,$('ilmArt'));}catch(err){console.warn(err);}
}
ov.addEventListener('click',ev=>{const g=ev.target.closest('[data-go]');if(g)go(+g.dataset.go);const lb=ev.target.closest('[data-l]');if(lb&&window.applyLanguage){window.applyLanguage(lb.dataset.l);render();}});
const close=()=>{ov.classList.remove('open');window.__labCover=false;};   // asosiy 3D sahna yana chiziladi
$('ilmBack').onclick=close;
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&ov.classList.contains('open'))close();});
// Avval ochiladi, keyin chiziladi — 3D ko'rgazma faqat ochiq oynada quriladi; orqadagi asosiy sahna pauza
// WebGL konteksti (0,1–0,3 s) maqola+grafik vazifasiga qo'shilmasin: kursor tugmaga yetganda bo'sh vaqtda,
// bo'lmasa bosilgandan keyin alohida vazifada (ma'lumot yuklanayotganda) yaratiladi
const pre3d=()=>{if(window.ILM3D&&window.ILM3D.preinit)window.ILM3D.preinit();};
btn.addEventListener('pointerenter',()=>{(window.requestIdleCallback||(f=>setTimeout(f,50)))(pre3d,{timeout:400});},{once:true});
btn.onclick=()=>{ov.classList.add('open');window.__labCover=true;
 setTimeout(()=>{if(ov.classList.contains('open'))pre3d();},0);
 if(!(window.ILMIY||[]).length){$('ilmArt').innerHTML='<p style="opacity:.6;padding:24px">…</p>';}
 (window.LAZY?window.LAZY.load('ilmiy'):Promise.resolve()).then(render);};   // ma'lumot fayllari birinchi ochilishda (labs/lazy.js)
const ub=document.getElementById('ubBtn');
if(ub)ub.after(btn);else document.querySelector('#topbar .controls')?.prepend(btn);
render();
setInterval(()=>{if(L()!==lastLang){if(ov.classList.contains('open'))render();else{lastLang=L();btn.title=UI[lastLang].title;}}},500);
})();
