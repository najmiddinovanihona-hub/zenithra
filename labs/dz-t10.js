/* DARSLIK · 10-mavzu (27-§). Ikki jism masalasi. Kosmik tezliklar */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const BOD=[[X('Yer','Земля','Earth'),3.986e5,6370,'#3f7fe0'],[X('Oy','Луна','Moon'),4903,1737,'#cfcfcf'],[X('Mars','Марс','Mars'),42828,3390,'#d8603a'],[X('Yupiter','Юпитер','Jupiter'),1.2669e8,69911,'#d9a873'],[X('Quyosh','Солнце','Sun'),1.3271e11,696000,'#ffb347']];
const TX={
 title:X('Ikki jism masalasi. Kosmik tezliklar','Задача двух тел. Космические скорости','The two-body problem. Cosmic velocities'),
 sub:X('27-§ · Konus kesimlari bo‘ylab harakat, birinchi va ikkinchi kosmik tezliklar, tortishishning markaziy maydoni','§27 · Движение по коническим сечениям, первая и вторая космические скорости, центральное поле тяготения','§27 · Motion along conic sections, first and second cosmic velocities, the central gravitational field'),
 intro:X('Nyuton butun olam tortishish qonuni tufayli planetalar Kepler qonunlari bo‘yicha harakatlanishini isbotladi va ularni aniqlashtirdi. U jism boshqa jismning tortishish maydonida faqat ellips emas, balki <b>aylana, parabola va giperbola</b> — konus kesimlari bo‘ylab ham harakatlanishi mumkinligini ko‘rsatdi.','Ньютон доказал, что благодаря закону всемирного тяготения планеты движутся по законам Кеплера, и уточнил их. Он показал, что тело в поле тяготения другого тела может двигаться не только по эллипсу, но и по <b>окружности, параболе и гиперболе</b> — коническим сечениям.','Newton proved that universal gravitation makes planets obey Kepler’s laws, and refined them. He showed that a body in another’s gravitational field can move not only on an ellipse but also on a <b>circle, parabola or hyperbola</b> — the conic sections.'),
 s1:X('Yer tortishish maydonida trayektoriyalar','Траектории в поле тяготения Земли','Trajectories in Earth’s gravity'),
 s1D:X('Jism h balandlikdan gorizontal uloqtiriladi. Tezlik v = √(GM/(R+h)) bo‘lsa — <b>aylana</b> (1). Undan katta bo‘lsa — <b>ellips</b> (2, 3, 4). v = √(2GM/(R+h)) bo‘lsa — <b>parabola</b> (5), undan katta bo‘lsa — <b>giperbola</b> (6): cheksizlikda jism asimptotaga yaqinlashib, deyarli to‘g‘ri chiziq bo‘ylab ketadi. Kichik tezlikda jism Yerga qaytib tushadi. Atmosfera tufayli h kamida 150 km bo‘lishi kerak.','Тело бросают горизонтально с высоты h. При v = √(GM/(R+h)) — <b>окружность</b> (1). При большей скорости — <b>эллипс</b> (2, 3, 4). При v = √(2GM/(R+h)) — <b>парабола</b> (5), при ещё большей — <b>гипербола</b> (6): вдали тело приближается к асимптоте и уходит почти по прямой. При малой скорости тело падает на Землю. Из-за атмосферы h должно быть не меньше 150 км.','A body is launched horizontally from height h. At v = √(GM/(R+h)) the path is a <b>circle</b> (1); faster gives an <b>ellipse</b> (2, 3, 4); at v = √(2GM/(R+h)) a <b>parabola</b> (5); faster still a <b>hyperbola</b> (6), approaching its asymptote and leaving almost in a straight line. Too slow and it falls back. Because of the atmosphere h must be at least 150 km.'),
 v:X('Boshlang‘ich tezlik v','Начальная скорость v','Launch speed v'), h:X('Balandlik h','Высота h','Height h'), type:X('Trayektoriya','Траектория','Trajectory'), ecc:X('Ekssentrisitet e','Эксцентриситет e','Eccentricity e'), apo:X('Eng uzoq nuqta balandligi','Высота апогея','Apogee height'), per:X('Aylanish davri','Период обращения','Period'),
 fall:X('Yerga qulaydi','падает на Землю','falls to Earth'), circ:X('aylana','окружность','circle'), ell:X('ellips','эллипс','ellipse'), par:X('parabola','парабола','parabola'), hyp:X('giperbola','гипербола','hyperbola'), inf:X('cheksiz','бесконечность','infinite'),
 s2:X('Birinchi va ikkinchi kosmik tezliklar','Первая и вторая космические скорости','First and second cosmic velocities'),
 s2D:X('Atmosferasiz, bir jinsli shar sirtidan gorizontal uchirilgan jism aylanma orbitaga chiqishi uchun <b>birinchi kosmik tezlik</b> v₁ = √(GM/R) kerak; Yer uchun (G = 6,67·10⁻¹¹ N·m²/kg², R = 6370 km, M = 6·10²⁴ kg) <b>7,91 km/s</b>. <b>Ikkinchi kosmik tezlik</b> v₂ = √(2GM/R) = v₁·√2 — Yer uchun <b>11,2 km/s</b> (7,91 × 1,41); bunda jism parabola bo‘ylab tortishishdan butunlay chiqib ketadi.','Чтобы тело, брошенное горизонтально с поверхности однородного шара без атмосферы, вышло на круговую орбиту, нужна <b>первая космическая скорость</b> v₁ = √(GM/R); для Земли (G = 6,67·10⁻¹¹ Н·м²/кг², R = 6370 км, M = 6·10²⁴ кг) — <b>7,91 км/с</b>. <b>Вторая космическая</b> v₂ = √(2GM/R) = v₁·√2 — для Земли <b>11,2 км/с</b> (7,91 × 1,41); тело уходит по параболе и покидает поле тяготения.','To reach a circular orbit from the surface of a uniform airless sphere, a body needs the <b>first cosmic velocity</b> v₁ = √(GM/R); for Earth (G = 6.67·10⁻¹¹ N·m²/kg², R = 6370 km, M = 6·10²⁴ kg) that is <b>7.91 km/s</b>. The <b>second cosmic velocity</b> v₂ = √(2GM/R) = v₁·√2 is <b>11.2 km/s</b> for Earth (7.91 × 1.41) — the body escapes on a parabola.'),
 body:X('Jism','Тело','Body'),
 s3:X('Tortishishning markaziy maydoni','Центральное поле тяготения','The central gravitational field'),
 s3D:X('Yer yonida harakatlanayotgan sun’iy yo‘ldoshga boshqa planetalar va hatto Quyosh ta’siri tufayli olinadigan chetlantiruvchi tezlanish Yer bergan tezlanishdan juda kichik. Shuning uchun masala <b>ikki jism masalasi</b> sifatida yechiladi. Trayektoriya fokusida turgan ideal sferik, bir jinsli jism maydoni — <b>tortishishning markaziy maydoni</b>; uning butun massasi markazidagi nuqtada mujassamlashgan deb qaraladi.','Возмущающие ускорения спутника у Земли от других планет и даже Солнца намного меньше ускорения от Земли. Поэтому задача решается как <b>задача двух тел</b>. Поле идеально сферического однородного тела, находящегося в фокусе траектории, — <b>центральное поле тяготения</b>; его массу считают сосредоточенной в точке-центре.','For a satellite near Earth, the perturbing accelerations from other planets and even the Sun are tiny compared with Earth’s pull, so it is solved as a <b>two-body problem</b>. The field of an ideal uniform sphere at the trajectory’s focus is a <b>central gravitational field</b>; its whole mass is treated as concentrated at the centre.'),
 cmp:X('Yo‘ldoshga tezlanishlar (h = 400 km)','Ускорения спутника (h = 400 км)','Accelerations on a satellite (h = 400 km)'), fromE:X('Yerdan','от Земли','from Earth'), fromM:X('Oydan','от Луны','from the Moon'), fromS:X('Quyoshdan (farq)','от Солнца (приливное)','from the Sun (tidal)')
};
const GL=[
 [X('Konus kesimlari','Конические сечения','Conic sections'),X('Aylana, ellips, parabola va giperbola — markaziy tortishish maydonidagi trayektoriyalar.','Окружность, эллипс, парабола и гипербола — траектории в центральном поле.','Circle, ellipse, parabola and hyperbola — the paths in a central field.')],
 [X('Birinchi kosmik tezlik','Первая космическая скорость','First cosmic velocity'),X('Aylanma orbita uchun tezlik v₁ = √(GM/R); Yer uchun 7,91 km/s.','Скорость круговой орбиты v₁ = √(GM/R); для Земли 7,91 км/с.','Circular-orbit speed v₁ = √(GM/R); 7.91 km/s for Earth.')],
 [X('Ikkinchi kosmik tezlik','Вторая космическая скорость','Second cosmic velocity'),X('Parabolik (qochish) tezlik v₂ = √(2GM/R) = v₁√2; Yer uchun 11,2 km/s.','Параболическая скорость v₂ = √(2GM/R) = v₁√2; для Земли 11,2 км/с.','Parabolic (escape) speed v₂ = √(2GM/R) = v₁√2; 11.2 km/s for Earth.')],
 [X('Asimptota','Асимптота','Asymptote'),X('Giperbolik trayektoriya cheksizlikda yaqinlashadigan to‘g‘ri chiziq.','Прямая, к которой стремится гиперболическая траектория.','The straight line a hyperbolic path approaches.')],
 [X('Markaziy maydon','Центральное поле','Central field'),X('Massasi markazda mujassam deb qaraladigan sferik bir jinsli jismning tortishish maydoni.','Поле тяготения однородного шара, масса которого считается сосредоточенной в центре.','The gravity of a uniform sphere treated as a point mass at its centre.')]
];
const QA=[
 [X('Tortishish maydonida harakatlanayotgan jism trayektoriyalari qanday bo‘ladi?','Какими бывают траектории тела в поле тяготения?','What trajectories can a body follow in a gravitational field?'),X('Konus kesimlari: aylana, ellips, parabola yoki giperbola — boshlang‘ich tezlikka bog‘liq.','Конические сечения: окружность, эллипс, парабола или гипербола — в зависимости от начальной скорости.','Conic sections — circle, ellipse, parabola or hyperbola — depending on the launch speed.')],
 [X('Birinchi va ikkinchi kosmik tezliklar qanday formulalardan topiladi?','По каким формулам находят первую и вторую космические скорости?','What are the formulas for the first and second cosmic velocities?'),X('v₁ = √(GM/R), v₂ = √(2GM/R) = v₁√2 (h balandlikda R o‘rniga R + h).','v₁ = √(GM/R), v₂ = √(2GM/R) = v₁√2 (на высоте h вместо R — R + h).','v₁ = √(GM/R), v₂ = √(2GM/R) = v₁√2 (at height h use R + h).')],
 [X('Tortishishning markaziy maydoni deb qanday jismning maydoni qabul qilingan?','Поле какого тела принимают за центральное поле тяготения?','Whose field is taken as the central gravitational field?'),X('Trayektoriya fokusida joylashgan ideal sferik shakldagi bir jinsli jismning maydoni; massasi uning markazida mujassam deb qaraladi.','Поле однородного идеально сферического тела в фокусе траектории; его масса считается сосредоточенной в центре.','That of an ideal uniform sphere at the trajectory’s focus, its mass treated as concentrated at the centre.')]
];
const QZ=[
 [X('Yer uchun birinchi kosmik tezlik:','Первая космическая скорость для Земли:','Earth’s first cosmic velocity:'),[X('7,91 km/s','7,91 км/с','7.91 km/s'),X('11,2 km/s','11,2 км/с','11.2 km/s'),X('29,8 km/s','29,8 км/с','29.8 km/s')]],
 [X('Ikkinchi kosmik tezlik birinchisidan necha marta katta?','Во сколько раз вторая космическая больше первой?','How many times larger is v₂ than v₁?'),[X('√2 ≈ 1,41','√2 ≈ 1,41','√2 ≈ 1.41'),X('2','2','2'),X('√3','√3','√3')]],
 [X('v = v₂ bo‘lganda trayektoriya:','При v = v₂ траектория:','At v = v₂ the path is a:'),[X('parabola','парабола','parabola'),X('aylana','окружность','circle'),X('giperbola','гипербола','hyperbola')]],
 [X('v₁ < v < v₂ bo‘lganda trayektoriya:','При v₁ < v < v₂ траектория:','For v₁ < v < v₂ the path is a:'),[X('ellips','эллипс','ellipse'),X('parabola','парабола','parabola'),X('to‘g‘ri chiziq','прямая','straight line')]],
 [X('Yo‘ldosh orbitasi uchun minimal balandlik (atmosfera tufayli):','Минимальная высота орбиты (из-за атмосферы):','Minimum orbital height (because of the atmosphere):'),[X('≈ 150 km','≈ 150 км','≈ 150 km'),X('≈ 10 km','≈ 10 км','≈ 10 km'),X('≈ 6370 km','≈ 6370 км','≈ 6370 km')]],
 [X('h balandlikda aylanma tezlik:','Круговая скорость на высоте h:','Circular speed at height h:'),[X('√(GM/(R+h))','√(GM/(R+h))','√(GM/(R+h))'),X('√(GM·(R+h))','√(GM·(R+h))','√(GM·(R+h))'),X('GM/(R+h)','GM/(R+h)','GM/(R+h)')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K, MU=3.986e5, RE=6370;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11.5px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t10O"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.v)}: <b id="t10VV"></b></span><input type="range" class="lab-range" id="t10V" min="4" max="13" step="0.01" value="9.2"></label>
      <label class="t1-ctl"><span>${T(TX.h)}: <b id="t10HV"></b></span><input type="range" class="lab-range" id="t10H" min="150" max="3000" step="10" value="400"></label>
      <div class="lab-row" style="margin:0">${chips('tr',[['1','1 · '+T(TX.circ)],['2','2'],['3','3'],['4','4 · '+T(TX.ell)],['5','5 · '+T(TX.par)],['6','6 · '+T(TX.hyp)]])}<button class="lab-chip" id="t10P">▶</button></div>
      <div class="lab-kv" id="t10OKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">v₁ = √(GM/R) · v₂ = √(2GM/R) = v₁·√2</div>
    <div class="t1-two"><div class="dz-card t4-m"><div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.body)}</span>${chips('bd',BOD.map((b,i)=>[i,T(b[0])]))}</div><div class="lab-kv" id="t10BKv"></div></div>
      <div class="dz-card t1-chart"><canvas class="t1-cv" id="t10B"></canvas></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="dz-card t4-m"><h4>${T(TX.cmp)}</h4><div class="lab-kv" id="t10CKv"></div></div>`)}
  ${sec('04',K.U.gl,K.glHTML(GL))}
  ${sec('05',K.U.qa,K.qaHTML(QA))}
  ${sec('06',K.U.test,`<div class="dz-card t1-quiz" id="t10Quiz"></div>`)}`;

  /* 01 · Trayektoriyalar */
  let nu=0, run=false, lt=0;
  const st=()=>{ const v=+$('#t10V').value, r0=RE+ +$('#t10H').value, e0=r0*v*v/MU-1, e=Math.abs(e0-1)<.01?1:e0, p=r0*v*v*r0/MU; return {v,r0,e,p,v1:Math.sqrt(MU/r0),v2:Math.sqrt(2*MU/r0)}; };
  const drawO=K.draw(function(){ const cv=$('#t10O'); const {x,w,h}=fit(cv,.8,440), c=C(), s=st(), VR=9*RE, sc=Math.min(w,h)/2/VR, cx=w*.62, cy=h/2;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const g=x.createRadialGradient(cx-RE*sc*.3,cy-RE*sc*.3,0,cx,cy,RE*sc); g.addColorStop(0,'#6fb0ff'); g.addColorStop(1,'#16336a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,RE*sc,0,TAU); x.fill();
    lbl(x,T(X('Yer','Земля','Earth')),cx,cy+4,'#e8edff');
    const pt=th=>{ const r=s.p/(1+s.e*Math.cos(th)); return [cx+r*Math.sin(th)*sc*-1, cy-r*Math.cos(th)*sc]; };
    const lim=s.e>=1?Math.acos(-1/s.e)-.02:Math.PI, open=s.e>=1;
    x.strokeStyle='#ffc65c'; x.lineWidth=2; x.beginPath(); let f=true, hit=null;
    for(let th=0;th<=lim;th+=.004){ const r=s.p/(1+s.e*Math.cos(th)); if(r<RE&&th>.01){ hit=th; break; } if(r>VR*3) break; const q=pt(th); f?x.moveTo(q[0],q[1]):x.lineTo(q[0],q[1]); f=false; }
    if(!open&&!hit){ for(let th=Math.PI;th<=TAU;th+=.004){ const q=pt(th); x.lineTo(q[0],q[1]); } } x.stroke();
    if(s.e>1){ const ta=Math.acos(-1/s.e), dx=-Math.sin(ta), dy=-Math.cos(ta), q=pt(ta-.25); x.strokeStyle='rgba(255,198,92,.35)'; x.setLineDash([4,5]); x.beginPath(); x.moveTo(q[0]-dx*w,q[1]+dy*w); x.lineTo(q[0]+dx*w,q[1]-dy*w); x.stroke(); x.setLineDash([]); lbl(x,T(X('Asimptota','Асимптота','Asymptote')),20,20,'rgba(255,198,92,.8)','left'); }
    const q0=pt(0); dot(x,q0[0],q0[1],4,'#e8edff');
    const thN=hit?Math.min(nu,hit):(s.e<1?nu%TAU:Math.min(nu,lim)), qn=pt(thN); dot(x,qn[0],qn[1],6,'#ff6a5a');
    let type=hit?TX.fall:Math.abs(s.e)<.01?TX.circ:s.e===1?TX.par:s.e<1?TX.ell:TX.hyp;
    const a=s.e<1?s.p/(1-s.e*s.e):0, apo=s.e<1&&s.e>=0?s.p/(1-s.e)-RE:s.e<0?s.r0-RE:Infinity, P=s.e<1?TAU*Math.sqrt(a**3/MU)/60:0;
    $('#t10VV').textContent=fmtN(s.v,2)+' km/s'; $('#t10HV').textContent=fmtN(+$('#t10H').value)+' km';
    $('#t10OKv').innerHTML=kv(T(TX.type),T(type),true)+kv('v₁ (h)',fmtN(s.v1,2)+' km/s')+kv('v₂ (h)',fmtN(s.v2,2)+' km/s')+kv(T(TX.ecc),fmtN(Math.abs(s.e),3))
      +kv(T(TX.apo),isFinite(apo)?fmtN(apo)+' km':T(TX.inf))+kv(T(TX.per),hit||s.e>=1?'—':P<600?fmtN(P,1)+' min':fmtN(P/60,1)+' h'); });
  const reset=()=>{ nu=0; mark('tr',''); drawO(); };
  $('#t10V').oninput=reset; $('#t10H').oninput=reset;
  on('tr',k=>{ const s=st(); const m={1:1,2:1.08,3:1.18,4:1.3,5:Math.SQRT2,6:1.62}[k]; $('#t10V').value=(s.v1*m).toFixed(2); nu=0; drawO(); mark('tr',k); });
  const step=n=>{ if(!run) return; const s=st(), dt=Math.min(.05,(n-lt)/1000); lt=n; const r=s.p/(1+s.e*Math.cos(nu)); nu+=dt*2.2*(s.r0/r)**2; if(nu>40) nu=0; drawO(); K.rafs.o=requestAnimationFrame(step); };
  $('#t10P').onclick=()=>{ run=!run; $('#t10P').textContent=run?'⏸':'▶'; click(700); if(run){ lt=performance.now(); K.rafs.o=requestAnimationFrame(step); } };

  /* 02 · Jismlar */
  let bd=0;
  const drawB=K.draw(function(){ const cv=$('#t10B'); const {x,w,h}=fit(cv,.6,280), c=C(), pl=8, pr=60, rows=BOD.length, rh=(h-10)/rows, L0=0, L1=Math.log10(700);
    const sx=v=>pl+Math.max(0,Math.log10(v)-L0)/(L1-L0)*(w-pl-pr);
    BOD.forEach((b,i)=>{ const v1=Math.sqrt(b[1]/b[2]), v2=v1*Math.SQRT2, y=5+i*rh;
      x.fillStyle=i===bd?'rgba(255,198,92,.12)':'transparent'; x.fillRect(0,y,w,rh-2);
      x.fillStyle=c.neon; x.fillRect(pl,y+rh*.42,sx(v1)-pl,rh*.18); x.fillStyle=c.gold; x.fillRect(pl,y+rh*.64,sx(v2)-pl,rh*.18);
      lbl(x,T(b[0]),pl+2,y+rh*.32,c.text,'left'); lbl(x,fmtN(v2,1),sx(v2)+6,y+rh*.8,c.dim,'left'); });
    const b=BOD[bd], v1=Math.sqrt(b[1]/b[2]); mark('bd',bd);
    $('#t10BKv').innerHTML=kv('GM',fmtN(b[1])+' km³/s²')+kv('R',fmtN(b[2])+' km')+kv('v₁',fmtN(v1,2)+' km/s',true)+kv('v₂',fmtN(v1*Math.SQRT2,2)+' km/s',true); });
  on('bd',v=>{ bd=+v; drawB(); });

  /* 03 · Tezlanishlar */
  { const r=RE+400, aE=MU/r**2*1e3, aM=4903/(384400-r)**2*1e3-4903/384400**2*1e3, aS=2*1.3271e11*r/149.6e6**3*1e3;
    $('#t10CKv').innerHTML=kv(T(TX.fromE),fmtN(aE,2)+' m/s²',true)+kv(T(TX.fromM),(aM).toExponential(1).replace('.',',')+' m/s²')+kv(T(TX.fromS),(aS).toExponential(1).replace('.',',')+' m/s²')+kv('a_Oy / a_Yer','≈ 1 : '+fmtN(aE/aM)); }

  K.bindQA(); K.quiz($('#t10Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t10', GL, QZ, ico:'🚀', title:TX.title, sub:TX.sub, build });
}; go0();
})();
