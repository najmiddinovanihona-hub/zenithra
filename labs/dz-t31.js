/* DARSLIK · 31-mavzu (64-§). Raketa harakati qonunlari. Tortish kuchi */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU;
const ENG=[[X('Porox (qattiq yoqilg‘i)','Порох (твёрдое топливо)','Powder (solid fuel)'),2.4],[X('Kerosin + kislorod','Керосин + кислород','Kerosene + oxygen'),3.0],[X('Vodorod + kislorod','Водород + кислород','Hydrogen + oxygen'),4.4],[X('Ion dvigatel','Ионный двигатель','Ion engine'),30]];
const TX={
 title:X('Raketa harakati qonunlari. Raketaning tortish kuchi','Законы движения ракеты. Сила тяги','Laws of rocket motion. Rocket thrust'),
 sub:X('64-§ · Tortish kuchi F = q·ω, solishtirma impuls, reaktiv tezlanish, Siolkovskiy formulasi, ideal tezlik va Siolkovskiy soni','§64 · Сила тяги F = q·ω, удельный импульс, реактивное ускорение, формула Циолковского, идеальная скорость и число Циолковского','§64 · Thrust F = q·ω, specific impulse, reactive acceleration, Tsiolkovsky’s formula, ideal velocity and the Tsiolkovsky number'),
 intro:X('Raketa harakati qonunlari kosmik uchishlar nazariyasining asosi. Dvigatel yoqilg‘i mahsulotlarini — <b>«ishchi jism»</b>ni bir tomonga chiqaradi va <b>harakat miqdorining saqlanish qonuni</b>ga ko‘ra raketaga qarama-qarshi tomonga yo‘nalgan kuch — <b>tortish kuchi</b> ta’sir qiladi (113-rasm).','Законы движения ракеты — основа теории космических полётов. Двигатель выбрасывает продукты сгорания — <b>«рабочее тело»</b> — в одну сторону, и по <b>закону сохранения импульса</b> на ракету действует противоположно направленная сила — <b>сила тяги</b> (рис. 113).','The laws of rocket motion underpin spaceflight theory. The engine expels combustion products — the <b>“working mass”</b> — one way, and by <b>conservation of momentum</b> a force acts on the rocket the other way: <b>thrust</b> (Fig. 113).'),
 s1:X('Tortish kuchi va solishtirma impuls','Сила тяги и удельный импульс','Thrust and specific impulse'),
 s1D:X('Tortish kuchi vaqt birligida uloqtirilayotgan massaga va uning chiqish tezligiga bog‘liq: <b>F = q·ω</b> (1), bunda q — massaning sekundli sarfi (kg/s), ω — uloqtirilgan massaning raketaga nisbatan tezligi (m/s); F — nyutonda. O‘ng tomonni g = 9,8 m/s² ga ko‘paytirib bo‘lsak: <b>F = I_sol·g·q</b> (2), bunda <b>I_sol = ω/g</b> — <b>solishtirma impuls</b>, sekundda o‘lchanadi; g·q — sekundli og‘irlik sarfi. Ya’ni I_sol har sekundda 1 kG yoqilg‘i sarfidan qancha kG tortish kuchi olinishini ko‘rsatadi va ω ga proporsional: ω = g·I_sol.','Сила тяги зависит от массы, выбрасываемой за единицу времени, и скорости её истечения: <b>F = q·ω</b> (1), где q — секундный расход массы (кг/с), ω — скорость выброса относительно ракеты (м/с); F — в ньютонах. Умножив и разделив правую часть на g = 9,8 м/с²: <b>F = I_уд·g·q</b> (2), где <b>I_уд = ω/g</b> — <b>удельный импульс</b>, измеряется в секундах; g·q — секундный весовой расход. То есть I_уд показывает, сколько кГ тяги даёт расход 1 кГ топлива в секунду, и пропорционален ω: ω = g·I_уд.','Thrust depends on the mass expelled per second and its exhaust speed: <b>F = q·ω</b> (1), with q the mass flow (kg/s) and ω the exhaust speed relative to the rocket (m/s); F is in newtons. Multiplying and dividing by g = 9.8 m/s²: <b>F = I_sp·g·q</b> (2), where <b>I_sp = ω/g</b> is the <b>specific impulse</b>, in seconds, and g·q the weight flow. I_sp tells how many kgf of thrust 1 kgf of fuel per second gives, and is proportional to ω: ω = g·I_sp.'),
 q:X('Massa sarfi q','Расход массы q','Mass flow q'), w:X('Chiqish tezligi ω','Скорость истечения ω','Exhaust speed ω'), F:X('Tortish kuchi F','Сила тяги F','Thrust F'), Isp:X('Solishtirma impuls I_sol','Удельный импульс I_уд','Specific impulse I_sp'), eng:X('Dvigatel turi','Тип двигателя','Engine type'), s:X('s','с','s'),
 s2:X('Reaktiv tezlanish','Реактивное ускорение','Reactive acceleration'),
 s2D:X('Raketaga tortish kuchidan tashqari Yer va boshqa osmon jismlarining tortishishi, atmosfera qarshiligi, yorug‘lik bosimi ham ta’sir qiladi. Tortish kuchi beradigan tezlanish Nyutonning II qonuniga ko‘ra <b>a_rak = F/m</b> (3). Uchishda massa kamayadi, tezlanish esa ortadi. Shuning uchun asosiy xarakteristika — <b>boshlang‘ich reaktiv tezlanish a_p0 = F/m₀</b> (4). Siolkovskiy ta’biri bilan u raketaning faraziy erkin fazodagi tezlanishi.','Помимо тяги на ракету действуют притяжение Земли и других тел, сопротивление атмосферы, давление света. Ускорение от силы тяги по II закону Ньютона <b>a_рак = F/m</b> (3). В полёте масса уменьшается, а ускорение растёт. Поэтому основная характеристика — <b>начальное реактивное ускорение a_р0 = F/m₀</b> (4). По выражению Циолковского, это ускорение ракеты в гипотетическом свободном пространстве.','Besides thrust, Earth’s and other bodies’ gravity, air drag and light pressure act on a rocket. Thrust alone gives <b>a = F/m</b> (3) by Newton’s second law. As mass falls in flight, acceleration grows, so the key figure is the <b>initial reactive acceleration a₀ = F/m₀</b> (4) — in Tsiolkovsky’s words, the rocket’s acceleration in hypothetical free space.'),
 burn:X('Yonish','Горение','Burn'), m:X('Massa m','Масса m','Mass m'), a:X('Tezlanish a = F/m','Ускорение a = F/m','Acceleration a = F/m'), v:X('Tezlik','Скорость','Speed'), g:X('g birligida','в единицах g','in g'), t:X('vaqt','время','time'),
 s3:X('Ideal tezlik. Siolkovskiy soni','Идеальная скорость. Число Циолковского','Ideal velocity. The Tsiolkovsky number'),
 s3D:X('Erkin fazoda massa m₀ dan m_ox gacha kamayganda raketa erishadigan tezlik — Siolkovskiy formulasi: <b>υ = ω·ln(m₀/m_ox) = 2,30259·ω·lg(m₀/m_ox)</b> (5). Bu tezlik raketaning energetik resurslarini xarakterlaydi va <b>ideal xarakteristik tezlik</b> deyiladi. Undan <b>m₀/m_ox = e^(υ/ω)</b> (6), e = 2,71828. Ideal tezlik ω ga va <b>Siolkovskiy soni z = m₀/m_ox</b> ga bog‘liq. Kerakli tezlikka bitta bosqich bilan yetish uchun z juda katta bo‘lishi kerak — shuning uchun raketalar <b>ko‘p bosqichli</b> qilinadi (113-rasm).','Скорость, которую ракета набирает в свободном пространстве при уменьшении массы с m₀ до m_к, даёт формула Циолковского: <b>υ = ω·ln(m₀/m_к) = 2,30259·ω·lg(m₀/m_к)</b> (5). Она характеризует энергетические ресурсы ракеты и называется <b>идеальной характеристической скоростью</b>. Отсюда <b>m₀/m_к = e^(υ/ω)</b> (6), e = 2,71828. Идеальная скорость зависит от ω и <b>числа Циолковского z = m₀/m_к</b>. Чтобы одной ступенью набрать нужную скорость, z должно быть очень велико — поэтому ракеты делают <b>многоступенчатыми</b> (рис. 113).','The speed a rocket gains in free space as mass drops from m₀ to m_f is Tsiolkovsky’s formula: <b>υ = ω·ln(m₀/m_f) = 2.30259·ω·lg(m₀/m_f)</b> (5). It measures the rocket’s energy resources and is the <b>ideal characteristic velocity</b>. Hence <b>m₀/m_f = e^(υ/ω)</b> (6), e = 2.71828. It depends on ω and the <b>Tsiolkovsky number z = m₀/m_f</b>. Reaching orbital speed in one stage needs a huge z — so rockets have <b>several stages</b> (Fig. 113).'),
 tgt:X('Kerakli tezlik υ','Требуемая скорость υ','Required speed υ'), zN:X('Siolkovskiy soni z = e^(υ/ω)','Число Циолковского z = e^(υ/ω)','Tsiolkovsky number z = e^(υ/ω)'), pay:X('Foydali yuk ulushi (1 bosqich)','Доля полезной массы (1 ступень)','Payload fraction (1 stage)'), st:X('Bosqichlar soni','Число ступеней','Number of stages'), zEach:X('Har bosqich z','z каждой ступени','z per stage'), stN:X('Har bosqich konstruksiya massasi 10% deb olingan.','Масса конструкции каждой ступени принята 10%.','Each stage’s structure is taken as 10% of its mass.'), imp:X('erishib bo‘lmaydi','недостижимо','unreachable')
};
const GL=[
 [X('Ishchi jism','Рабочее тело','Working mass'),X('Dvigateldan chiqariladigan yoqilg‘i mahsulotlari.','Продукты сгорания, выбрасываемые двигателем.','Combustion products expelled by the engine.')],
 [X('Tortish kuchi','Сила тяги','Thrust'),X('F = q·ω — ishchi jism chiqarilishi tufayli raketaga ta’sir etuvchi reaktiv kuch.','F = q·ω — реактивная сила от выброса рабочего тела.','F = q·ω — the reactive force from expelling working mass.')],
 [X('Solishtirma impuls','Удельный импульс','Specific impulse'),X('I_sol = ω/g, sekundda; dvigatel samaradorligini ko‘rsatadi.','I_уд = ω/g, в секундах; характеризует эффективность двигателя.','I_sp = ω/g in seconds; a measure of engine efficiency.')],
 [X('Reaktiv tezlanish','Реактивное ускорение','Reactive acceleration'),X('a = F/m; boshlang‘ichi a_p0 = F/m₀.','a = F/m; начальное a_р0 = F/m₀.','a = F/m; initially a₀ = F/m₀.')],
 [X('Ideal xarakteristik tezlik','Идеальная характеристическая скорость','Ideal characteristic velocity'),X('υ = ω·ln(m₀/m_ox) — erkin fazoda raketa erishadigan tezlik.','υ = ω·ln(m₀/m_к) — скорость ракеты в свободном пространстве.','υ = ω·ln(m₀/m_f) — the rocket’s speed in free space.')],
 [X('Siolkovskiy soni','Число Циолковского','Tsiolkovsky number'),X('z = m₀/m_ox — boshlang‘ich va oxirgi massalar nisbati.','z = m₀/m_к — отношение начальной и конечной масс.','z = m₀/m_f — initial to final mass ratio.')]
];
const QA=[
 [X('Raketaning tortish kuchi nimalarga bog‘liq?','От чего зависит сила тяги?','What does thrust depend on?'),X('Sekundli massa sarfi q va ishchi jismning chiqish tezligi ω ga: F = q·ω.','От секундного расхода массы q и скорости истечения ω: F = q·ω.','On mass flow q and exhaust speed ω: F = q·ω.')],
 [X('Solishtirma impuls deganda nima tushuniladi?','Что такое удельный импульс?','What is specific impulse?'),X('I_sol = ω/g — sekundiga 1 kG yoqilg‘i sarfidan olinadigan tortish kuchi (kG), sekundda o‘lchanadi.','I_уд = ω/g — тяга (кГ) от расхода 1 кГ топлива в секунду, в секундах.','I_sp = ω/g — thrust (kgf) per 1 kgf/s of propellant, in seconds.')],
 [X('Solishtirma impuls tortish kuchini qanday xarakterlaydi?','Как удельный импульс характеризует тягу?','How does I_sp characterise thrust?'),X('U chiqish tezligiga proporsional (ω = g·I_sol): bir xil sarfda I_sol katta bo‘lsa, tortish kuchi ham katta.','Он пропорционален скорости истечения (ω = g·I_уд): при одинаковом расходе больший I_уд даёт большую тягу.','It is proportional to exhaust speed (ω = g·I_sp): for the same flow, higher I_sp means more thrust.')],
 [X('Siolkovskiy formulasi bilan qanday kattalik topiladi?','Что находят по формуле Циолковского?','What does Tsiolkovsky’s formula give?'),X('Raketaning ideal xarakteristik tezligi υ = ω·ln(m₀/m_ox).','Идеальную характеристическую скорость υ = ω·ln(m₀/m_к).','The ideal characteristic velocity υ = ω·ln(m₀/m_f).')],
 [X('Ideal tezlik deb qanday tezlikka aytiladi?','Что называют идеальной скоростью?','What is the ideal velocity?'),X('Faqat tortish kuchi ta’sirida, erkin fazoda massa m₀ dan m_ox gacha kamayganda erishiladigan tezlik.','Скорость, набираемую только под действием тяги в свободном пространстве при уменьшении массы с m₀ до m_к.','The speed reached under thrust alone in free space as mass drops from m₀ to m_f.')],
 [X('Siolkovskiy soni deb nimaga aytiladi?','Что называют числом Циолковского?','What is the Tsiolkovsky number?'),X('Boshlang‘ich va yoqilg‘i tugagandagi massalar nisbati z = m₀/m_ox.','Отношение начальной и конечной масс z = m₀/m_к.','The ratio of initial to burnout mass z = m₀/m_f.')]
];
const QZ=[
 [X('Tortish kuchi formulasi:','Формула силы тяги:','The thrust formula:'),[X('F = q·ω','F = q·ω','F = q·ω'),X('F = m·g','F = m·g','F = m·g'),X('F = ω/q','F = ω/q','F = ω/q')]],
 [X('Tortish kuchi qaysi qonunga asoslanadi?','На каком законе основана тяга?','Thrust rests on which law?'),[X('harakat miqdorining saqlanishi','сохранения импульса','conservation of momentum'),X('Kepler III qonuni','III закон Кеплера','Kepler’s third law'),X('Vin qonuni','закон Вина','Wien’s law')]],
 [X('Solishtirma impuls birligi:','Единица удельного импульса:','Unit of specific impulse:'),[X('sekund','секунда','second'),X('nyuton','ньютон','newton'),X('m/s²','м/с²','m/s²')]],
 [X('ω = 2940 m/s bo‘lsa, I_sol =','При ω = 2940 м/с I_уд =','If ω = 2940 m/s, I_sp ='),[X('300 s','300 с','300 s'),X('2940 s','2940 с','2940 s'),X('30 s','30 с','30 s')]],
 [X('Uchishda reaktiv tezlanish:','В полёте реактивное ускорение:','During the burn, acceleration:'),[X('ortadi (massa kamayadi)','растёт (масса уменьшается)','grows (mass falls)'),X('kamayadi','уменьшается','falls'),X('o‘zgarmaydi','не меняется','stays constant')]],
 [X('Siolkovskiy soni:','Число Циолковского:','Tsiolkovsky number:'),[X('z = m₀/m_ox','z = m₀/m_к','z = m₀/m_f'),X('z = Δλ/λ','z = Δλ/λ','z = Δλ/λ'),X('z = F/m','z = F/m','z = F/m')]],
 [X('Nega raketalar ko‘p bosqichli qilinadi?','Почему ракеты многоступенчатые?','Why are rockets multistage?'),[X('bitta bosqich uchun z juda katta bo‘lishi kerak','для одной ступени z должно быть огромным','one stage would need a huge z'),X('chiroyli ko‘rinishi uchun','для красоты','for looks'),X('tezlikni kamaytirish uchun','чтобы снизить скорость','to slow down')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-formula">F = q · ω = I_sol · g · q · I_sol = ω / g</div>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.eng)}</span>${chips('en',ENG.map((e,i)=>[i,T(e[0])]))}</div>
      <label class="t1-ctl"><span>${T(TX.q)}: <b id="t31QV"></b></span><input type="range" class="lab-range" id="t31Q" min="0" max="4" step="0.01" value="3.4"></label>
      <label class="t1-ctl"><span>${T(TX.w)}: <b id="t31WV"></b></span><input type="range" class="lab-range" id="t31W" min="1" max="30" step="0.05" value="3"></label><div class="lab-kv" id="t31FKv"></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">a = F / m · a_p0 = F / m₀</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t31A"></canvas><div class="lab-row"><button class="lab-chip" id="t31AP">▶ ${T(TX.burn)}</button></div></div><div class="t1-side"><div class="lab-kv" id="t31AKv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-formula">υ = ω · ln (m₀ / m_ox) · z = m₀ / m_ox = e^(υ/ω)</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t31S"></canvas><p class="t1-cap">${T(TX.stN)}</p></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.tgt)}: <b id="t31VV"></b></span><input type="range" class="lab-range" id="t31V" min="2" max="16" step="0.1" value="9.5"></label>
        <label class="t1-ctl"><span>${T(TX.st)}: <b id="t31NV"></b></span><input type="range" class="lab-range" id="t31N" min="1" max="4" step="1" value="3"></label><div class="lab-kv" id="t31SKv"></div></div></div>`)}
  ${sec('04',K.U.gl,K.glHTML(GL))}
  ${sec('05',K.U.qa,K.qaHTML(QA))}
  ${sec('06',K.U.test,`<div class="dz-card t1-quiz" id="t31Quiz"></div>`)}`;

  /* 01 · Tortish kuchi */
  const thr=()=>{ const q=10**+$('#t31Q').value, w=+$('#t31W').value*1000, F=q*w, I=w/9.8; $('#t31QV').textContent=fmtN(q,q<10?1:0)+' kg/s'; $('#t31WV').textContent=fmtN(w/1000,2)+' km/s';
    $('#t31FKv').innerHTML=kv(T(TX.F),F<1e6?fmtN(F/1e3,1)+' kN':fmtN(F/1e6,2)+' MN',true)+kv('',fmtN(F/9.8/1000,1)+' t·kuch')+kv(T(TX.Isp),fmtN(I)+' '+T(TX.s)); mark('en',''); };
  $('#t31Q').oninput=thr; $('#t31W').oninput=thr; on('en',v=>{ $('#t31W').value=ENG[+v][1]; thr(); mark('en',v); }); thr();

  /* 02 · Reaktiv tezlanish */
  let bt=0, bRun=false, bL=0; const m0=300, mf=60, Tb=150, F=6e3*1.2*9.8/2;
  const st=t=>{ const q=(m0-mf)/Tb, m=m0-q*Math.min(t,Tb), a=F/m/1000, w=F/q/1000, v=w*Math.log(m0/m); return {m,a,v,q,w}; };
  const drawA=K.draw(function(){ const cv=$('#t31A'); const {x,w,h}=fit(cv,.62,300), c=C(), s=st(bt), pl=36, pr=12, pt=12, pb=26, gx=w*.32, sx=t=>gx+t/Tb*(w-gx-pr), sy=a=>pt+(1-a/st(Tb).a/1.05)*(h-pt-pb);
    x.fillStyle=c.day?'#e8eef8':'#05081a'; x.fillRect(0,0,gx-10,h);
    const ry=h*.82-Math.min(h*.6,s.v*30), rx=(gx-10)/2, frac=(s.m-mf)/(m0-mf);
    x.fillStyle='#cfd6e6'; x.fillRect(rx-9,ry-46,18,46); x.fillStyle='#e0604f'; x.beginPath(); x.moveTo(rx-9,ry-46); x.lineTo(rx,ry-62); x.lineTo(rx+9,ry-46); x.fill();
    x.fillStyle='rgba(255,160,60,.85)'; x.fillRect(rx-6,ry-44+40*(1-frac),12,40*frac);
    if(bt>0&&bt<Tb){ const g=x.createLinearGradient(rx,ry,rx,ry+40); g.addColorStop(0,'rgba(255,230,140,1)'); g.addColorStop(1,'rgba(255,90,40,0)'); x.fillStyle=g; x.beginPath(); x.moveTo(rx-7,ry); x.lineTo(rx,ry+34+Math.random()*8); x.lineTo(rx+7,ry); x.fill(); }
    x.strokeStyle=c.brd; x.beginPath(); x.moveTo(gx,h-pb); x.lineTo(w-pr,h-pb); x.moveTo(gx,pt); x.lineTo(gx,h-pb); x.stroke();
    x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); for(let t=0;t<=Math.min(bt,Tb);t+=1){ const yy=sy(st(t).a); t?x.lineTo(sx(t),yy):x.moveTo(sx(t),yy); } x.stroke();
    lbl(x,'a',gx+6,pt+10,c.dim,'left'); lbl(x,T(TX.t)+' →',w-pr,h-pb-6,c.dim,'right');
    $('#t31AKv').innerHTML=kv(T(TX.m),fmtN(s.m)+' t')+kv(T(TX.a),fmtN(s.a*1000,1)+' m/s² = '+fmtN(s.a*1000/9.8,2)+' '+T(TX.g),true)+kv('a_p0',fmtN(st(0).a*1000,1)+' m/s²')+kv(T(TX.v)+' (ω·ln m₀/m)',fmtN(s.v,2)+' km/s'); });
  const bStep=n=>{ if(!bRun) return; bt+=Math.min(.05,(n-bL)/1000)*30; bL=n; if(bt>=Tb){ bt=Tb; bRun=false; $('#t31AP').textContent='▶ '+T(TX.burn); } drawA(); if(bRun) K.rafs.b=requestAnimationFrame(bStep); };
  $('#t31AP').onclick=()=>{ click(700); if(bt>=Tb) bt=0; bRun=!bRun; $('#t31AP').textContent=bRun?'⏸':'▶ '+T(TX.burn); if(bRun){ bL=performance.now(); K.rafs.b=requestAnimationFrame(bStep); } };

  /* 03 · Ko'p bosqichli */
  const drawS=K.draw(function(){ const cv=$('#t31S'); const {x,w,h}=fit(cv,.62,300), c=C(), v=+$('#t31V').value, n=+$('#t31N').value, om=3, eps=.1, zs=Math.exp(v/n/om), pay1=(1/zs-eps)/(1-eps), pay=pay1>0?pay1**n:0;
    x.fillStyle=c.day?'#e8eef8':'#05081a'; x.fillRect(0,0,w,h);
    const cx=w/2, total=h-40; let y=h-14; const parts=[]; let mass=1; for(let i=0;i<n;i++){ parts.push(mass); mass*=Math.max(0,pay1); }
    const scl=k=>Math.max(14,Math.pow(k,.35)*total/n*1.2);
    for(let i=0;i<n;i++){ const hh=Math.min(total/(n+.8),scl(parts[i])), ww=34-i*5; x.fillStyle=['#7a86a8','#9aa6cc','#b8c4e6','#d0d8f0'][i]; x.fillRect(cx-ww/2,y-hh,ww,hh); lbl(x,(i+1)+'-'+T(X('bosqich','ступень','stage')),cx+ww/2+8,y-hh/2+4,c.text,'left'); y-=hh+2; }
    x.fillStyle='#e0604f'; x.beginPath(); x.moveTo(cx-10,y); x.lineTo(cx,y-22); x.lineTo(cx+10,y); x.fill(); lbl(x,T(X('foydali yuk','полезный груз','payload')),cx+16,y-8,c.text,'left');
    $('#t31VV').textContent=fmtN(v,1)+' km/s'; $('#t31NV').textContent=String(n);
    const z1=Math.exp(v/om);
    $('#t31SKv').innerHTML=kv(T(TX.zN)+' (ω = 3 km/s)',fmtN(z1,1))+kv(T(TX.pay),z1>1/eps?T(TX.imp):fmtN((1/z1-eps)/(1-eps)*100,2)+'%')+kv(T(TX.zEach),fmtN(zs,2))+kv(T(X('Foydali yuk ulushi','Доля полезного груза','Payload fraction'))+' ('+n+')',pay>0?fmtN(pay*100,2)+'%':T(TX.imp),true); });
  $('#t31V').oninput=drawS; $('#t31N').oninput=drawS;

  K.bindQA(); K.quiz($('#t31Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t31', GL, QZ, ico:'🔥', title:TX.title, sub:TX.sub, build });
}; go0();
})();
