/* DARSLIK · 28-mavzu (61-§). Koinotning kengayishi. Xabbl qonuni */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU;
const TX={
 title:X('Koinotning kengayishi. Xabbl qonuni','Расширение Вселенной. Закон Хаббла','The expanding Universe. Hubble’s law'),
 sub:X('61-§ · Galaktikalarning qochishi, Koinot yoshi, A. Fridman modellari, «qaynoq portlash», relikt nurlanish, Metagalaktika','§61 · Разбегание галактик, возраст Вселенной, модели А. Фридмана, «горячий взрыв», реликтовое излучение, Метагалактика','§61 · Receding galaxies, the age of the Universe, Friedmann’s models, the “hot Big Bang”, relic radiation, the Metagalaxy'),
 intro:X('Barcha tomondagi galaktikalarda <b>qizilga siljish</b> kuzatilgani bizning Galaktika Koinot markazida degani emas: istalgan boshqa galaktikadagi faraziy kuzatuvchi ham atrofidagi galaktikalarning hammasi undan uzoqlashayotganini ko‘rardi. Bu — butun fazoning bir tekis <b>kengayishi</b>.','То, что во всех галактиках наблюдается <b>красное смещение</b>, не значит, что наша Галактика — центр Вселенной: наблюдатель в любой другой галактике тоже увидел бы, что все галактики удаляются от него. Это — равномерное <b>расширение</b> всего пространства.','Seeing <b>redshifts</b> in every direction does not put our Galaxy at the centre: an observer in any other galaxy would also see all galaxies receding. It is a uniform <b>expansion</b> of space itself.'),
 s1:X('Har bir galaktikadan qaraganda','Взгляд из любой галактики','The view from any galaxy'),
 s1D:X('Quyidagi modelda fazo bir tekis kengayadi. Istalgan galaktikani «uy» qilib tanlang: qolganlarning hammasi undan uzoqlashadi va uzoqroqdagilari tezroq qochadi — <b>v = H·r</b>.','В модели ниже пространство расширяется равномерно. Выберите любую галактику «домом»: все остальные удаляются от неё, и чем дальше — тем быстрее, <b>v = H·r</b>.','In the model below space expands uniformly. Make any galaxy “home”: all others recede from it, faster the farther they are — <b>v = H·r</b>.'),
 home:X('Uy galaktikasini bosing','Нажмите на галактику-«дом»','Click a galaxy to make it home'), scale:X('Masshtab omili a','Масштабный фактор a','Scale factor a'),
 s2:X('Kengayish qachon boshlangan?','Когда началось расширение?','When did expansion begin?'),
 s2D:X('Kengayish o‘tmishda ham shunday sur’atda bo‘lgan deb faraz qilsak, uning boshlanish vaqtini hisoblash mumkin: barcha galaktikalar bir nuqtada bo‘lgan payt — t ≈ r/v = <b>1/H</b>. Kitob bo‘yicha kengayish <b>15–20 mlrd yil</b> oldin boshlangan.','Если считать, что расширение и в прошлом шло так же, можно найти время его начала — когда все галактики были в одной точке: t ≈ r/v = <b>1/H</b>. По учебнику расширение началось <b>15–20 млрд лет</b> назад.','Assuming the same rate in the past, we can date the start — when all galaxies were together: t ≈ r/v = <b>1/H</b>. The book says expansion began <b>15–20 billion years</b> ago.'),
 bNote:X('Hozirgi o‘lchovlar (Planck, 2018) bo‘yicha Koinot yoshi ≈ 13,8 mlrd yil, H ≈ 67–73 km/s/Mpk.','По современным данным (Planck, 2018) возраст Вселенной ≈ 13,8 млрд лет, H ≈ 67–73 км/с/Мпк.','Modern data (Planck, 2018) give an age of ≈ 13.8 billion years and H ≈ 67–73 km/s/Mpc.'),
 H:X('Xabbl doimiysi H','Постоянная Хаббла H','Hubble constant H'), age:X('Xabbl vaqti 1/H','Хаббловское время 1/H','Hubble time 1/H'), gyr:X('mlrd yil','млрд лет','Gyr'),
 s3:X('A. Fridman modellari','Модели А. Фридмана','Friedmann’s models'),
 s3D:X('1922–1924-yillarda rus olimi <b>A. A. Fridman</b> Eynshteynning umumiy nisbiylik nazariyasi asosida Koinot modeli <b>statsionar (muqim) emas</b>, u kengayishga yoki siqilishga moyil ekanini ko‘rsatdi. Ko‘p o‘tmay kengayish dalillari topildi. Koinotning taqdiri undagi materiya zichligiga bog‘liq: kritik zichlikdan kichik bo‘lsa — <b>ochiq</b> (cheksiz kengayadi), teng bo‘lsa — <b>yassi</b>, katta bo‘lsa — <b>yopiq</b> (keyin siqiladi).','В 1922–1924 гг. <b>А. А. Фридман</b> на основе общей теории относительности Эйнштейна показал, что модель Вселенной <b>не стационарна</b>: она должна расширяться или сжиматься. Вскоре были найдены доказательства расширения. Судьба Вселенной зависит от плотности материи: меньше критической — <b>открытая</b> (расширяется вечно), равна — <b>плоская</b>, больше — <b>закрытая</b> (затем сжимается).','In 1922–1924 <b>A. A. Friedmann</b>, using Einstein’s general relativity, showed the Universe <b>cannot be static</b>: it must expand or contract. Evidence of expansion soon followed. Its fate depends on matter density: below critical — <b>open</b> (expands forever), equal — <b>flat</b>, above — <b>closed</b> (eventually recollapses).'),
 om:X('Zichlik Ω = ρ/ρ_kr','Плотность Ω = ρ/ρ_кр','Density Ω = ρ/ρ_cr'), op:X('ochiq','открытая','open'), fl:X('yassi','плоская','flat'), cl:X('yopiq','закрытая','closed'), t:X('vaqt','время','time'),
 s4:X('«Qaynoq portlash» va relikt nurlanish','«Горячий взрыв» и реликтовое излучение','The “hot Big Bang” and relic radiation'),
 s4D:X('Koinotning kengayishi uni qadimda ro‘y bergan <b>«qaynoq portlash»</b>ning oqibati deyishga asos bo‘ldi. Unda na yulduz, na galaktika bo‘lmagan davrning «elchilari» — <b>birlamchi (relikt, qoldiq) nurlanish</b> — ham kengayishda ishtirok etgan va sovigan. Uning mavjudligi nazariy jihatdan oldindan bashorat qilingan edi; <b>1965-yilda</b> amerikalik astronomlar uni tasodifan topdilar. Bu «qaynoq portlash» gipotezasining kuzatuv bilan tasdig‘i bo‘ldi. Metagalaktika (Koinotning ko‘rinadigan qismi) evolutsiyasi saqlanish qonunlariga zid emas va hech qanday g‘ayritabiiy kuchlarni talab qilmaydi.','Расширение Вселенной дало основание считать его следствием древнего <b>«горячего взрыва»</b>. В расширении участвовало и остыло <b>первичное (реликтовое) излучение</b> — «посланник» эпохи, когда не было ни звёзд, ни галактик. Его существование было предсказано теоретически; в <b>1965 г.</b> американские астрономы случайно его обнаружили. Это подтвердило гипотезу «горячего взрыва» наблюдениями. Эволюция Метагалактики (видимой части Вселенной) не нарушает законов сохранения и не требует сверхъестественных сил.','The expansion suggested it resulted from an ancient <b>“hot Big Bang”</b>. The <b>primordial (relic) radiation</b>, a messenger from before stars and galaxies, also expanded and cooled. It had been predicted theoretically, and in <b>1965</b> American astronomers found it by chance — observational proof of the hot Big Bang. The evolution of the Metagalaxy (the observable Universe) obeys conservation laws and needs no supernatural forces.'),
 Tz:X('Temperatura T = 2,725·(1 + z) K','Температура T = 2,725·(1 + z) K','Temperature T = 2.725·(1 + z) K'), zz:X('Qizilga siljish z (o‘tmish)','Красное смещение z (прошлое)','Redshift z (the past)'), peak:X('Maksimum λ_max','Максимум λ_max','Peak λ_max'), band:X('Diapazon','Диапазон','Band'),
 rNote:X('Relikt nurlanish temperaturasi va maksimum to‘lqini (≈1 mm) — zamonaviy qiymatlar; kitobda keltirilmagan.','Температура реликтового излучения и длина волны максимума (≈1 мм) — современные значения; в учебнике не приводятся.','The relic radiation’s temperature and peak wavelength (≈1 mm) are modern values not given in the book.'),
 s5:X('Xabbl qonuni','Закон Хаббла','Hubble’s law'),
 s5D:X('Empirik tarzda qizilga siljish logarifmi va galaktikalarning ko‘rinma kattaliklari orasida chiziqli bog‘lanish topilgan — bu masofa va uzoqlashish tezligi orasidagi bog‘lanishni bildiradi: <b>v_r = c·Δλ/λ = H·r</b>, bunda v_r — nuriy tezlik, c — yorug‘lik tezligi, Δλ — qizil siljish, H — Xabbl doimiysi, r — galaktikagacha masofa.','Эмпирически найдена линейная связь логарифма красного смещения и видимых величин галактик — она означает связь расстояния и скорости удаления: <b>v_r = c·Δλ/λ = H·r</b>, где v_r — лучевая скорость, c — скорость света, Δλ — красное смещение, H — постоянная Хаббла, r — расстояние до галактики.','Empirically the log of the redshift is linear in galaxies’ apparent magnitudes — meaning distance and recession speed are related: <b>v_r = c·Δλ/λ = H·r</b>, where v_r is radial velocity, c light speed, Δλ the redshift, H the Hubble constant and r the distance.'),
 mpc:X('Mpk','Мпк','Mpc')
};
const GL=[
 [X('Metagalaktika','Метагалактика','Metagalaxy'),X('Koinotning kuzatish mumkin bo‘lgan qismi.','Наблюдаемая часть Вселенной.','The observable part of the Universe.')],
 [X('Qizilga siljish','Красное смещение','Redshift'),X('Uzoqlashayotgan galaktikalar spektr chiziqlarining uzun to‘lqin tomonga siljishi; z = Δλ/λ.','Смещение линий удаляющихся галактик к длинным волнам; z = Δλ/λ.','Shift of receding galaxies’ lines to longer wavelengths; z = Δλ/λ.')],
 [X('Xabbl qonuni','Закон Хаббла','Hubble’s law'),X('v = H·r — galaktikaning uzoqlashish tezligi masofasiga proporsional.','v = H·r — скорость удаления пропорциональна расстоянию.','v = H·r — recession speed is proportional to distance.')],
 [X('Xabbl vaqti','Хаббловское время','Hubble time'),X('1/H — kengayish boshlanganidan beri o‘tgan vaqt bahosi.','1/H — оценка времени с начала расширения.','1/H — an estimate of the time since expansion began.')],
 [X('Fridman modellari','Модели Фридмана','Friedmann models'),X('Nisbiylik nazariyasiga ko‘ra kengayuvchi yoki siqiluvchi (nostatsionar) Koinot modellari.','Нестационарные (расширяющиеся или сжимающиеся) модели Вселенной по ОТО.','Non-static (expanding or contracting) universe models from general relativity.')],
 [X('«Qaynoq portlash»','«Горячий взрыв»','Hot Big Bang'),X('Koinot juda zich va issiq holatdan kengaya boshlagani haqidagi gipoteza.','Гипотеза о расширении Вселенной из очень плотного и горячего состояния.','The idea that the Universe expanded from a very dense, hot state.')],
 [X('Relikt nurlanish','Реликтовое излучение','Relic (CMB) radiation'),X('Ilk Koinotdan qolgan, kengayishda sovigan birlamchi nurlanish; 1965-yilda topilgan.','Первичное излучение ранней Вселенной, остывшее при расширении; открыто в 1965 г.','Primordial radiation from the early Universe, cooled by expansion; found in 1965.')]
];
const QA=[
 [X('Metagalaktika deganda Koinotning qanday qismini tasavvur qilasiz?','Что понимают под Метагалактикой?','What is the Metagalaxy?'),X('Koinotning hozirgi vositalar bilan kuzatish mumkin bo‘lgan qismi.','Часть Вселенной, доступную современным наблюдениям.','The part of the Universe accessible to observation.')],
 [X('Koinotda «qizilga siljish» deb qanday jarayonga aytiladi?','Что такое «красное смещение»?','What is the cosmological redshift?'),X('Galaktikalar spektr chiziqlarining uzun to‘lqin tomonga siljishi — ular uzoqlashayotganini (fazo kengayayotganini) bildiradi.','Смещение линий галактик к длинным волнам — признак их удаления (расширения пространства).','The shift of galaxies’ lines to longer wavelengths, showing they recede as space expands.')],
 [X('Fridman va Eynshteynning Koinot modeli haqidagi fikrlari?','Взгляды Фридмана и Эйнштейна на модель Вселенной?','Friedmann’s and Einstein’s views on the model?'),X('Fridman umumiy nisbiylik nazariyasiga tayanib Koinot statsionar emas, u kengayishi yoki siqilishi kerakligini ko‘rsatdi.','Фридман на основе ОТО Эйнштейна показал, что Вселенная нестационарна — должна расширяться или сжиматься.','Using Einstein’s general relativity, Friedmann showed the Universe is not static — it must expand or contract.')],
 [X('Relikt nurlanish nima? U qanday modelga asos bo‘lgan?','Что такое реликтовое излучение? Какую модель оно подтверждает?','What is relic radiation and which model does it support?'),X('Ilk Koinotdan qolgan, kengayishda sovigan nurlanish (1965); u «qaynoq portlash» modelini tasdiqlaydi.','Остывшее при расширении излучение ранней Вселенной (1965); подтверждает модель «горячего взрыва».','Cooled radiation from the early Universe (1965); it supports the hot Big Bang model.')],
 [X('Xabbl qonuni qanday parametrlar orasidagi bog‘lanishni aks ettiradi?','Связь каких параметров отражает закон Хаббла?','Which quantities does Hubble’s law relate?'),X('Galaktikaning uzoqlashish (nuriy) tezligi va masofasi: v = c·Δλ/λ = H·r.','Скорость удаления (лучевую скорость) и расстояние: v = c·Δλ/λ = H·r.','Recession (radial) speed and distance: v = c·Δλ/λ = H·r.')]
];
const QZ=[
 [X('Barcha galaktikalar uzoqlashishi nimani bildiradi?','Что означает удаление всех галактик?','What does every galaxy receding mean?'),[X('fazo kengaymoqda','пространство расширяется','space is expanding'),X('biz markazdamiz','мы в центре','we are at the centre'),X('galaktikalar siqilmoqda','галактики сжимаются','galaxies are shrinking')]],
 [X('Koinot statsionar emasligini kim ko‘rsatgan?','Кто показал нестационарность Вселенной?','Who showed the Universe is not static?'),[X('A. Fridman','А. Фридман','A. Friedmann'),X('I. Nyuton','И. Ньютон','I. Newton'),X('T. Brage','Т. Браге','T. Brahe')]],
 [X('Relikt nurlanish qachon topilgan?','Когда открыто реликтовое излучение?','When was the relic radiation found?'),[X('1965-yil','1965','1965'),X('1925-yil','1925','1925'),X('1846-yil','1846','1846')]],
 [X('Xabbl vaqti:','Хаббловское время:','The Hubble time:'),[X('1/H','1/H','1/H'),X('H²','H²','H²'),X('c·H','c·H','c·H')]],
 [X('H = 70 km/s/Mpk da 1/H ≈','При H = 70 км/с/Мпк 1/H ≈','For H = 70 km/s/Mpc, 1/H ≈'),[X('14 mlrd yil','14 млрд лет','14 Gyr'),X('1,4 mlrd yil','1,4 млрд лет','1.4 Gyr'),X('140 mlrd yil','140 млрд лет','140 Gyr')]],
 [X('Zichlik kritikdan katta bo‘lsa, Koinot:','Если плотность больше критической, Вселенная:','If density exceeds critical, the Universe is:'),[X('yopiq — keyin siqiladi','закрытая — затем сжимается','closed — recollapses'),X('ochiq','открытая','open'),X('o‘zgarmas','неизменная','static')]],
 [X('Xabbl qonuni formulasi:','Формула закона Хаббла:','Hubble’s law formula:'),[X('v = H·r','v = H·r','v = H·r'),X('v = H/r','v = H/r','v = H/r'),X('v = c/H','v = c/H','v = c/H')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t28E" style="cursor:pointer"></canvas>
    <div class="lab-row"><button class="lab-chip" id="t28EP">▶</button><span class="t1-lab">${T(TX.scale)}: <b id="t28EV"></b></span><span class="t1-cap">${T(TX.home)}</span></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><p class="t1-cap">${T(TX.bNote)}</p><div class="dz-card t4-m"><label class="t1-ctl"><span>${T(TX.H)}: <b id="t28HV"></b></span><input type="range" class="lab-range" id="t28H" min="45" max="100" step="0.5" value="70"></label><div class="lab-kv" id="t28HKv"></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t28F"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.om)}: <b id="t28OV"></b></span><input type="range" class="lab-range" id="t28O" min="0.1" max="3" step="0.01" value="1"></label><div class="lab-kv" id="t28FKv"></div></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t28C"></canvas><p class="t1-cap">${T(TX.rNote)}</p></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.zz)}: <b id="t28ZV"></b></span><input type="range" class="lab-range" id="t28Z" min="0" max="3.04" step="0.01" value="0"></label><div class="lab-kv" id="t28CKv"></div></div></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p><div class="t1-formula">v_r = c · Δλ / λ = H · r</div><div class="dz-card t1-chart"><canvas class="t1-cv" id="t28L"></canvas></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t28Quiz"></div>`)}`;

  /* 01 · Kengayish modeli */
  const G=[]; { let s=17; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<36;i++) G.push([(r()-.5)*1.8,(r()-.5)*1.1]); }
  let a=1, home=0, eRun=false, eL=0;
  const drawE=K.draw(function(){ const cv=$('#t28E'); const {x,w,h}=fit(cv,.5,340), c=C(), cx=w/2, cy=h/2, s=Math.min(w,h)*.42, hx=G[home][0], hy=G[home][1];
    x.fillStyle='#02030a'; x.fillRect(0,0,w,h);
    G.forEach(([gx,gy],i)=>{ const px=cx+(gx-hx)*a*s, py=cy+(gy-hy)*a*s; if(px<-20||px>w+20||py<-20||py>h+20) return;
      if(i!==home&&a>1.001){ const dx=(gx-hx), dy=(gy-hy); x.strokeStyle='rgba(255,140,110,.55)'; x.lineWidth=1.2; x.beginPath(); x.moveTo(px,py); x.lineTo(px+dx*s*.12,py+dy*s*.12); x.stroke(); }
      const g=x.createRadialGradient(px,py,0,px,py,6); g.addColorStop(0,i===home?'#ffe9a0':'#fff'); g.addColorStop(1,'rgba(180,200,255,0)'); x.fillStyle=g; x.beginPath(); x.ellipse(px,py,7,4,i*.7,0,TAU); x.fill(); });
    x.strokeStyle='#ffd27a'; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,10,0,TAU); x.stroke();
    $('#t28EV').textContent=fmtN(a,2); });
  $('#t28E').addEventListener('click',e=>{ const cv=$('#t28E'), b=cv.getBoundingClientRect(), cx=b.width/2, cy=b.height/2, s=Math.min(b.width,b.height)*.42, mx=e.clientX-b.left, my=e.clientY-b.top; let best=0, bd=1e9; G.forEach(([gx,gy],i)=>{ const px=cx+(gx-G[home][0])*a*s, py=cy+(gy-G[home][1])*a*s, d=Math.hypot(px-mx,py-my); if(d<bd){ bd=d; best=i; } }); if(bd<30){ home=best; click(700); drawE(); } });
  const eStep=n=>{ if(!eRun) return; a+=Math.min(.05,(n-eL)/1000)*.12; eL=n; if(a>2.2) a=1; drawE(); K.rafs.e=requestAnimationFrame(eStep); };
  $('#t28EP').onclick=()=>{ eRun=!eRun; $('#t28EP').textContent=eRun?'⏸':'▶'; click(700); if(eRun){ eL=performance.now(); K.rafs.e=requestAnimationFrame(eStep); } };

  /* 02 · Xabbl vaqti */
  const age=()=>{ const H=+$('#t28H').value, t=977.8/H; $('#t28HV').textContent=fmtN(H,1)+' '+T(X('km/s/Mpk','км/с/Мпк','km/s/Mpc')); $('#t28HKv').innerHTML=kv(T(TX.age),fmtN(t,1)+' '+T(TX.gyr),true)+kv(T(X('1 Mpk / H','1 Мпк / H','1 Mpc / H')),fmtN(3.086e19/H/3.156e16,2)+' '+T(TX.gyr))+kv('2/3 · 1/H',fmtN(t*2/3,1)+' '+T(TX.gyr)); };
  $('#t28H').oninput=age; age();

  /* 03 · Fridman modellari */
  const drawF=K.draw(function(){ const cv=$('#t28F'); const {x,w,h}=fit(cv,.62,300), c=C(), O=+$('#t28O').value, pl=36, pr=12, pt=12, pb=26, sx=t=>pl+t/3*(w-pl-pr), sy=v=>pt+(1-v/2.4)*(h-pt-pb);
    x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(0)); x.lineTo(w-pr,sy(0)); x.moveTo(pl,pt); x.lineTo(pl,sy(0)); x.stroke(); lbl(x,'a',pl-14,pt+8,c.dim); lbl(x,T(TX.t)+' →',w-pr,sy(0)-6,c.dim,'right');
    const sim=(Om,col,w2)=>{ let A=1e-3, t=0, v; x.strokeStyle=col; x.lineWidth=w2; x.beginPath(); let first=true, up=true;
      for(let i=0;i<4000;i++){ const H2=Om/A**3+(1-Om)/A**2; if(H2<=0) up=false; const da=(up?1:-1)*A*Math.sqrt(Math.abs(H2))*.004; A+=da; t+=.004; if(A<1e-3||A>2.4||t>3) break; const px=sx(t), py=sy(A); first?x.moveTo(px,py):x.lineTo(px,py); first=false; } x.stroke(); };
    sim(.3,'rgba(110,200,140,.45)',1.4); sim(1,'rgba(150,180,255,.45)',1.4); sim(2.5,'rgba(255,140,110,.45)',1.4); sim(O,c.gold,2.6);
    lbl(x,T(TX.op),sx(2.4),sy(2.25),'rgba(110,200,140,.9)'); lbl(x,T(TX.fl),sx(2.75),sy(1.75),'rgba(150,180,255,.9)'); lbl(x,T(TX.cl),sx(1.4),sy(.55),'rgba(255,140,110,.9)');
    $('#t28OV').textContent=fmtN(O,2);
    $('#t28FKv').innerHTML=kv(T(TX.om),fmtN(O,2))+kv('→',T(O<.98?TX.op:O>1.02?TX.cl:TX.fl),true); });
  $('#t28O').oninput=drawF;

  /* 04 · Relikt nurlanish */
  const planck=(lmm,T0)=>{ const l=lmm*1e-3; return 1/(l**5*(Math.exp(0.014388/(l*T0))-1)); };
  const drawC=K.draw(function(){ const cv=$('#t28C'); const {x,w,h}=fit(cv,.6,280), c=C(), z=10**+$('#t28Z').value-1, Tk=2.725*(1+z), pl=36, pr=12, pt=12, pb=26, L0=-6, L1=1.3, sx=l=>pl+(Math.log10(l)-L0)/(L1-L0)*(w-pl-pr), pk=2.898/Tk, ym=planck(pk,Tk), sy=v=>pt+(1-v/ym)*(h-pt-pb);
    x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,h-pb); x.lineTo(w-pr,h-pb); x.stroke();
    [[1e-6,'1 nm'],[1e-3,'1 mkm'],[1,'1 mm'],[10,'1 sm']].forEach(([l,s])=>lbl(x,s,sx(l),h-8,c.dim));
    x.fillStyle=c.day?'rgba(45,92,174,.12)':'rgba(78,168,255,.15)'; x.beginPath(); x.moveTo(sx(10**L0),h-pb); for(let lg=L0;lg<=L1;lg+=.01){ const l=10**lg; x.lineTo(sx(l),sy(planck(l,Tk))); } x.lineTo(sx(10**L1),h-pb); x.closePath(); x.fill();
    x.strokeStyle=c.neon; x.lineWidth=2.2; x.beginPath(); for(let lg=L0;lg<=L1;lg+=.01){ const l=10**lg, yy=sy(planck(l,Tk)); lg===L0?x.moveTo(sx(l),yy):x.lineTo(sx(l),yy); } x.stroke();
    x.strokeStyle=c.gold; x.setLineDash([3,3]); x.beginPath(); x.moveTo(sx(pk),pt); x.lineTo(sx(pk),h-pb); x.stroke(); x.setLineDash([]);
    const band=pk>1?X('mikroto‘lqin (radio)','микроволновый (радио)','microwave (radio)'):pk>7e-4?X('infraqizil','инфракрасный','infrared'):pk>4e-4?X('ko‘rinadigan','видимый','visible'):X('ultrabinafsha','ультрафиолет','ultraviolet');
    $('#t28ZV').textContent=fmtN(z,z<10?2:0);
    $('#t28CKv').innerHTML=kv(T(TX.Tz),Tk<1e4?fmtN(Tk,Tk<10?3:0)+' K':fmtN(Tk)+' K',true)+kv(T(TX.peak),pk>=1?fmtN(pk,2)+' mm':fmtN(pk*1e3,pk>.01?1:3)+' mkm')+kv(T(TX.band),T(band)); });
  $('#t28Z').oninput=drawC;

  /* 05 · Xabbl diagrammasi */
  K.draw(function(){ const cv=$('#t28L'); const {x,w,h}=fit(cv,.42,280), c=C(), pl=50, pr=12, pt=12, pb=28, sx=r=>pl+r/500*(w-pl-pr), sy=v=>pt+(1-v/36000)*(h-pt-pb);
    [0,10000,20000,30000].forEach(v=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(v)); x.lineTo(w-pr,sy(v)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(fmtN(v),pl-4,sy(v)+3); });
    [0,100,200,300,400,500].forEach(r=>lbl(x,String(r),sx(r),h-10,c.dim)); lbl(x,'r, '+T(TX.mpc),w-pr,h-pb-4,c.dim,'right'); lbl(x,'v, km/s',pl+4,pt+10,c.dim,'left');
    let s=4; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<60;i++){ const d=10+r()*480, v=70*d*(1+(r()-.5)*.18); dot(x,sx(d),sy(v),2.6,'rgba(150,180,255,.75)'); }
    x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.moveTo(sx(0),sy(0)); x.lineTo(sx(500),sy(35000)); x.stroke(); lbl(x,'H = 70',sx(420),sy(29400)-8,c.gold); });

  K.bindQA(); K.quiz($('#t28Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t28', GL, QZ, ico:'🎈', title:TX.title, sub:TX.sub, build });
}; go0();
})();
