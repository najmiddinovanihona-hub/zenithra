/* DARSLIK · 26-mavzu (58-§). Diffuz va chang tumanliklar */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU;
const NEB=[[X('Orion tumanligi','Туманность Ориона','Orion Nebula'),X('Orion','Орион','Orion'),'gas',X('eni 6 pk gacha, oddiy ko‘zga ko‘rinadi','до 6 пк, видна невооружённым глазом','up to 6 pc, naked-eye')],[X('Laguna, Omega, Uchtarmoqli','Лагуна, Омега, Трёхраздельная','Lagoon, Omega, Trifid'),X('Qavs','Стрелец','Sagittarius'),'gas',''],[X('Shimoliy Amerika, Pelikan','Северная Америка, Пеликан','North America, Pelican'),X('Oqqush','Лебедь','Cygnus'),'gas',''],[X('Rozetka','Розетка','Rosette'),X('Yakkashox','Единорог','Monoceros'),'gas',X('108-rasm','рис. 108','Fig. 108')],[X('«Ko‘mir qopi»','«Угольный мешок»','“Coalsack”'),X('Janubiy But','Южный Крест','Crux'),'dust',X('150 pk, o‘lchami ≈8 pk, 3°; Δm = 1,2ᵐ','150 пк, размер ≈8 пк, 3°; Δm = 1,2ᵐ','150 pc, ≈8 pc, 3°; Δm = 1.2ᵐ')],[X('«Ot boshi»','«Конская Голова»','“Horsehead”'),X('Orion','Орион','Orion'),'dust',X('106-rasm','рис. 106','Fig. 106')]];
const TX={
 title:X('Diffuz va chang tumanliklar','Диффузные и пылевые туманности','Diffuse and dust nebulae'),
 sub:X('58-§ · Yulduzlararo chang va yorug‘lik yutilishi, «Ko‘mir qopi» va «Ot boshi», gaz (diffuz) tumanliklar, emission spektr, fluoressensiya','§58 · Межзвёздная пыль и поглощение света, «Угольный мешок» и «Конская Голова», газовые (диффузные) туманности, эмиссионный спектр, флуоресценция','§58 · Interstellar dust and extinction, the Coalsack and Horsehead, gaseous (diffuse) nebulae, emission spectra, fluorescence'),
 intro:X('Yulduzli osmon suratlarida yulduzlar bir tekis taqsimlanmagani ko‘rinadi. Asosiy sababi — ayrim sohalarda yulduzlar nurini kuchli yutadigan yirik <b>chang materiya</b> borligi. Galaktikada bunday muhit borligini yuz yilcha oldin <b>V. Y. Struve</b> bashorat qilgan.','На фотографиях звёздного неба видно, что звёзды распределены неравномерно. Главная причина — в некоторых областях есть крупные массы <b>пылевой материи</b>, сильно поглощающей свет звёзд. Существование такой среды в Галактике около ста лет назад предсказал <b>В. Я. Струве</b>.','Sky photographs show stars are unevenly spread. The main reason is large masses of <b>dust</b> in some regions that strongly absorb starlight. <b>V. Ya. Struve</b> predicted such a medium in the Galaxy about a century ago.'),
 s1:X('Chang tumanliklar va yorug‘lik yutilishi','Пылевые туманности и поглощение света','Dust nebulae and extinction'),
 s1D:X('Misollar — Janubiy Butdagi <b>«Ko‘mir qopi»</b> va Oriondagi <b>«Ot boshi»</b> (106-rasm). «Ko‘mir qopi» bizdan 150 pk da, o‘lchami ≈8 pk, burchak o‘lchami 3°. Uning ichida xira yulduzlar soni tashqaridagi shunday maydondagidan ≈<b>3 marta kam</b> — yutilish yulduzlar kattaligini <b>Δm = 1,2ᵐ</b> ga xiralashtiradi. Oqqushdan Burgut, Ilon, Qavs va Aqrabgacha cho‘zilgan chang tasmasi Somon Yo‘lida ulkan qora ayrilik hosil qiladi; ayniqsa Galaktika markazi (Qavs) tomonda qora tumanlik juda quyuq va markaziy quyilmani o‘rganishga xalaqit beradi.','Примеры — <b>«Угольный мешок»</b> в Южном Кресте и <b>«Конская Голова»</b> в Орионе (рис. 106). «Угольный мешок» находится в 150 пк, размер ≈8 пк, угловой размер 3°. Слабых звёзд в нём примерно в <b>3 раза меньше</b>, чем на такой же площадке вне его, — поглощение ослабляет звёзды на <b>Δm = 1,2ᵐ</b>. Пылевая полоса от Лебедя через Орла, Змею, Стрельца до Скорпиона создаёт в Млечном Пути огромный тёмный провал; особенно густа тёмная материя в направлении центра Галактики (Стрелец), мешая изучать центральное сгущение.','Examples are the <b>Coalsack</b> in Crux and the <b>Horsehead</b> in Orion (Fig. 106). The Coalsack is 150 pc away, ≈8 pc across, 3° in the sky. It contains about <b>3× fewer</b> faint stars than an equal patch outside — extinction dims stars by <b>Δm = 1.2ᵐ</b>. A dust lane from Cygnus through Aquila, Serpens and Sagittarius to Scorpius splits the Milky Way with a great dark rift; toward the galactic centre (Sagittarius) the dust is so thick it hampers study of the central bulge.'),
 dm:X('Yutilish Δm','Поглощение Δm','Extinction Δm'), frac:X('O‘tgan nur ulushi','Доля прошедшего света','Light transmitted'), cnt:X('Ko‘rinadigan yulduzlar','Видимых звёзд','Stars visible'), why:X('Nega 3 marta kam?','Почему в 3 раза меньше?','Why 3× fewer?'),
 whyD:X('Δm = 1,2ᵐ da nur 10^(0,4·1,2) ≈ 3 marta susayadi, shuning uchun teleskop chegarasidagi xira yulduzlar ko‘rinmay qoladi.','При Δm = 1,2ᵐ свет ослабевает в 10^(0,4·1,2) ≈ 3 раза, и слабые звёзды у предела телескопа пропадают.','At Δm = 1.2ᵐ light drops 10^(0.4·1.2) ≈ 3×, so faint stars near the telescope’s limit vanish.'),
 s2:X('Gaz (diffuz) tumanliklar','Газовые (диффузные) туманности','Gaseous (diffuse) nebulae'),
 s2D:X('Eng mashhuri — oddiy ko‘zga ham ko‘rinadigan, eni 6 pk gacha bo‘lgan <b>Orion tumanligi</b> (107-rasm). Qavsda Laguna, Omega va Uchtarmoqli, Oqqushda Shimoliy Amerika va Pelikan, Yakkashoxda <b>Rozetka</b> (108-rasm) tumanliklari bor; Galaktikada jami ≈<b>400</b> ta. Spektri vodorodning <b>Hα, Hβ</b>, ikki marta ionlashgan kislorod <b>[OIII]</b>, azot va boshqa elementlarning <b>emission chiziqlari</b>dan iborat, tutash fon juda xira.','Самая известная — видимая даже невооружённым глазом <b>туманность Ориона</b> шириной до 6 пк (рис. 107). В Стрельце — Лагуна, Омега и Трёхраздельная, в Лебеде — Северная Америка и Пеликан, в Единороге — <b>Розетка</b> (рис. 108); всего в Галактике ≈<b>400</b> таких объектов. Спектр состоит из <b>эмиссионных линий</b> водорода <b>Hα, Hβ</b>, дважды ионизованного кислорода <b>[OIII]</b>, азота и др. на очень слабом непрерывном фоне.','The best known is the <b>Orion Nebula</b>, up to 6 pc wide and visible to the naked eye (Fig. 107). Sagittarius holds the Lagoon, Omega and Trifid, Cygnus the North America and Pelican, Monoceros the <b>Rosette</b> (Fig. 108); about <b>400</b> exist in the Galaxy. Their spectra are <b>emission lines</b> of hydrogen <b>Hα, Hβ</b>, doubly ionised oxygen <b>[OIII]</b>, nitrogen and others on a very faint continuum.'),
 cat:X('Tumanliklar','Туманности','Nebulae'), con:X('Turkum','Созвездие','Constellation'), typ:X('Turi','Тип','Type'), gas:X('gaz (emission)','газовая (эмиссионная)','gas (emission)'), dust:X('chang (qora)','пылевая (тёмная)','dust (dark)'),
 s3:X('Diffuz tumanlik nega nurlanadi: fluoressensiya','Почему светится диффузная туманность: флуоресценция','Why diffuse nebulae glow: fluorescence'),
 s3D:X('Ko‘pincha tumanlik ichida yoki yonida qaynoq <b>O yoki B</b> sinfli yulduz bo‘ladi. Uning quvvatli <b>ultrabinafsha</b> nurlari gaz atomlariga yutilib, ularni <b>ionlaydi</b>. Erkin elektron yana atomga bog‘langanda (<b>rekombinatsiya</b>) atom bitta qattiq UB kvant o‘rniga ko‘rinadigan diapazonda bir nechta kamroq energiyali kvant chiqaradi — <b>fluoressensiya</b>. Shu jarayon tufayli tumanlikda ≈<b>10⁴ °C</b> temperatura qaror topadi; bu uning issiqlik radionurlanishi bilan tasdiqlanadi.','Обычно внутри туманности или рядом есть горячая звезда класса <b>O или B</b>. Её мощное <b>ультрафиолетовое</b> излучение поглощается атомами газа и <b>ионизует</b> их. Когда свободный электрон снова захватывается атомом (<b>рекомбинация</b>), атом вместо одного жёсткого УФ-кванта излучает несколько менее энергичных квантов в видимом диапазоне — <b>флуоресценция</b>. В результате в туманности устанавливается температура ≈<b>10⁴ °C</b>, что подтверждается её тепловым радиоизлучением.','Usually a hot <b>O or B</b> star sits inside or beside the nebula. Its strong <b>ultraviolet</b> light is absorbed by gas atoms and <b>ionises</b> them. When a free electron is recaptured (<b>recombination</b>), the atom emits, instead of one hard UV photon, several lower-energy visible photons — <b>fluorescence</b>. This keeps the nebula at ≈<b>10⁴ °C</b>, confirmed by its thermal radio emission.'),
 go:X('Jarayonni ko‘rsatish','Показать процесс','Show the process'), uv:X('UB kvant','УФ-квант','UV photon'), ion:X('ionlanish','ионизация','ionisation'), rec:X('rekombinatsiya → Hα, Hβ','рекомбинация → Hα, Hβ','recombination → Hα, Hβ')
};
const GL=[
 [X('Chang tumanlik','Пылевая туманность','Dust nebula'),X('Orqadagi yulduzlar nurini yutib, qora ko‘rinadigan chang buluti («Ko‘mir qopi», «Ot boshi»).','Пылевое облако, поглощающее свет звёзд позади и видимое тёмным.','A dust cloud that blocks background starlight and looks dark.')],
 [X('Yorug‘lik yutilishi','Поглощение света','Extinction'),X('Chang tufayli yulduzlar xiralashishi; «Ko‘mir qopi»da Δm = 1,2ᵐ.','Ослабление света звёзд пылью; в «Угольном мешке» Δm = 1,2ᵐ.','Dimming of starlight by dust; Δm = 1.2ᵐ in the Coalsack.')],
 [X('Diffuz (gaz) tumanlik','Диффузная (газовая) туманность','Diffuse (gas) nebula'),X('Qaynoq yulduz UB nuri bilan ionlanib, emission chiziqlarda nurlanadigan gaz buluti.','Газовое облако, ионизованное УФ горячей звезды и светящееся в эмиссионных линиях.','A gas cloud ionised by a hot star’s UV and glowing in emission lines.')],
 [X('Emission spektr','Эмиссионный спектр','Emission spectrum'),X('Xira fonda yorqin chiziqlar (Hα, Hβ, [OIII]) dan iborat spektr.','Спектр из ярких линий (Hα, Hβ, [OIII]) на слабом фоне.','Bright lines (Hα, Hβ, [OIII]) on a faint background.')],
 [X('Rekombinatsiya','Рекомбинация','Recombination'),X('Erkin elektronning ion bilan qayta birikishi.','Повторное соединение свободного электрона с ионом.','A free electron rejoining an ion.')],
 [X('Fluoressensiya','Флуоресценция','Fluorescence'),X('Bitta UB kvant o‘rniga bir nechta ko‘rinadigan kvant chiqarilishi.','Излучение нескольких видимых квантов вместо одного УФ.','Re-emitting several visible photons for one UV photon.')]
];
const QA=[
 [X('Somon Yo‘li tekisligi osmon ekvatoriga qanday burchak ostida og‘gan?','Под каким углом плоскость Млечного Пути наклонена к экватору?','At what angle is the Milky Way tilted to the celestial equator?'),X('62°.','62°.','62°.')],
 [X('Galaktikada nechta sharsimon to‘da topilgan?','Сколько шаровых скоплений найдено в Галактике?','How many globular clusters are known?'),X('≈100 ta.','≈100.','About 100.')],
 [X('Quyosh sistemasi Galaktikaning qayerida?','Где находится Солнечная система?','Where is the Solar System in the Galaxy?'),X('Markazdan ≈33 000 y.y. da, radiusning ≈2/3 qismida.','В ≈33 000 св. лет от центра, на ≈2/3 радиуса.','≈33,000 ly from the centre, ≈2/3 of the radius.')],
 [X('Sharsimon to‘dalarning o‘lchami va tarkibi?','Размеры и состав шаровых скоплений?','Size and make-up of globular clusters?'),X('Diametri ≈40 pk, o‘n minglab yulduz, og‘ir elementlar 0,1–0,01%.','Диаметр ≈40 пк, десятки тысяч звёзд, тяжёлых элементов 0,1–0,01%.','≈40 pc across, tens of thousands of stars, 0.1–0.01% heavy elements.')],
 [X('Sochma to‘dalar sharsimonlardan qanday farq qiladi?','Чем рассеянные отличаются от шаровых?','How do open clusters differ from globulars?'),X('Kamroq va tarqoq yulduzli, 1,5–20 pk, diskda, og‘ir elementlarga boy (1–4%).','Меньше и разреженнее, 1,5–20 пк, в диске, богаты тяжёлыми элементами (1–4%).','Fewer, looser stars, 1.5–20 pc, in the disc, rich in heavy elements (1–4%).')],
 [X('Diffuz gaz tumanliklar chang tumanliklardan nimasi bilan farq qiladi?','Чем газовые туманности отличаются от пылевых?','How do gas nebulae differ from dust nebulae?'),X('Gaz tumanliklar o‘zi nurlanadi (emission spektr), chang tumanliklar esa nurni yutib, qora ko‘rinadi.','Газовые светятся сами (эмиссионный спектр), пылевые поглощают свет и кажутся тёмными.','Gas nebulae glow (emission spectrum); dust nebulae absorb light and look dark.')],
 [X('Diffuz tumanliklar nurlanishiga sabab nima?','Почему светятся диффузные туманности?','What makes diffuse nebulae glow?'),X('Qaynoq O–B yulduz UB nurlari gazni ionlaydi; rekombinatsiyada atomlar ko‘rinadigan nur chiqaradi (fluoressensiya).','УФ горячей звезды O–B ионизует газ; при рекомбинации атомы излучают видимый свет (флуоресценция).','A hot O–B star’s UV ionises the gas; on recombination atoms emit visible light (fluorescence).')]
];
const QZ=[
 [X('Yulduzlararo chang borligini kim bashorat qilgan?','Кто предсказал межзвёздную пыль?','Who predicted interstellar dust?'),[X('V. Y. Struve','В. Я. Струве','V. Ya. Struve'),X('Gershel','Гершель','Herschel'),X('Kepler','Кеплер','Kepler')]],
 [X('«Ko‘mir qopi» qaysi turkumda?','В каком созвездии «Угольный мешок»?','Where is the Coalsack?'),[X('Janubiy But','Южный Крест','Crux'),X('Orion','Орион','Orion'),X('Oqqush','Лебедь','Cygnus')]],
 [X('«Ko‘mir qopi»dagi yutilish:','Поглощение в «Угольном мешке»:','Extinction in the Coalsack:'),[X('Δm = 1,2ᵐ','Δm = 1,2ᵐ','Δm = 1.2ᵐ'),X('Δm = 12ᵐ','Δm = 12ᵐ','Δm = 12ᵐ'),X('Δm = 0,1ᵐ','Δm = 0,1ᵐ','Δm = 0.1ᵐ')]],
 [X('Orion tumanligi qanday tumanlik?','Какая туманность Ориона?','What kind of nebula is Orion’s?'),[X('gaz (diffuz)','газовая (диффузная)','gas (diffuse)'),X('chang','пылевая','dust'),X('planetar','планетарная','planetary')]],
 [X('Galaktikadagi gaz tumanliklar soni:','Число газовых туманностей в Галактике:','Number of gas nebulae in the Galaxy:'),[X('≈ 400','≈ 400','≈ 400'),X('≈ 40','≈ 40','≈ 40'),X('≈ 40 000','≈ 40 000','≈ 40,000')]],
 [X('Diffuz tumanlikni qanday yulduz yoritadi?','Какая звезда возбуждает диффузную туманность?','What star excites a diffuse nebula?'),[X('qaynoq O yoki B','горячая O или B','a hot O or B'),X('qizil mitti','красный карлик','a red dwarf'),X('oq mitti','белый карлик','a white dwarf')]],
 [X('Gaz tumanlik temperaturasi:','Температура газовой туманности:','Temperature of a gas nebula:'),[X('≈ 10⁴ °C','≈ 10⁴ °C','≈ 10⁴ °C'),X('≈ 10² °C','≈ 10² °C','≈ 10² °C'),X('≈ 10⁷ °C','≈ 10⁷ °C','≈ 10⁷ °C')]],
 [X('UB kvant o‘rniga bir nechta ko‘rinadigan kvant chiqishi:','Излучение нескольких видимых квантов вместо УФ:','Several visible photons replacing a UV one:'),[X('fluoressensiya','флуоресценция','fluorescence'),X('difraksiya','дифракция','diffraction'),X('dispersiya','дисперсия','dispersion')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t26D"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.dm)}: <b id="t26DV"></b></span><input type="range" class="lab-range" id="t26DM" min="0" max="4" step="0.05" value="1.2"></label><div class="lab-kv" id="t26DKv"></div><p class="t1-cap">${T(TX.whyD)}</p></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="dz-card t4-m"><div class="t19-h"><div class="h"><b>${T(TX.cat)}</b><b>${T(TX.con)}</b><b>${T(TX.typ)}</b></div>${NEB.map(n=>`<div><b>${T(n[0])}</b><span>${T(n[1])}</span><span>${T(n[2]==='gas'?TX.gas:TX.dust)}${n[3]?' · '+T(n[3]):''}</span></div>`).join('')}</div></div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t26S"></canvas></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t26F"></canvas><div class="lab-row"><button class="lab-chip" id="t26FP">▶ ${T(TX.go)}</button><span class="t1-lab"><b id="t26FV"></b></span></div></div>`)}
  ${sec('04',K.U.gl,K.glHTML(GL))}
  ${sec('05',K.U.qa,K.qaHTML(QA))}
  ${sec('06',K.U.test,`<div class="dz-card t1-quiz" id="t26Quiz"></div>`)}`;

  /* 01 · Chang yutilishi */
  const STS=[]; { let s=5; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<900;i++) STS.push([r(),r(),9+r()*6*Math.pow(r(),.3)]); }
  const drawD=K.draw(function(){ const cv=$('#t26D'); const {x,w,h}=fit(cv,.6,320), c=C(), dm=+$('#t26DM').value, cx=w/2, cy=h/2, R=Math.min(w,h)*.3, lim=14;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const g=x.createRadialGradient(cx,cy,R*.3,cx,cy,R*1.15); g.addColorStop(0,`rgba(0,0,0,${Math.min(.95,dm/3)})`); g.addColorStop(1,'rgba(0,0,0,0)');
    let inn=0, out=0, ni=0, no=0;
    STS.forEach(([u,v,m])=>{ const px=u*w, py=v*h, d=Math.hypot(px-cx,py-cy)/R, ext=d<1?dm*(1-d*d*.35):d<1.15?dm*(1.15-d)/.15*.65:0, me=m+ext; if(d<1){ ni++; if(me<lim) inn++; } else { no++; if(me<lim) out++; } if(me>=lim) return; const b=Math.max(.15,(lim-me)/5); x.fillStyle=`rgba(230,235,255,${Math.min(1,b)})`; x.fillRect(px,py,1+b,1+b); });
    x.fillStyle=g; x.beginPath(); x.arc(cx,cy,R*1.15,0,TAU); x.fill();
    lbl(x,T(NEB[4][0]),cx,cy+R+22,'#cfd6f2');
    const area=ni/(no+ni), dens=inn/Math.max(1,ni), dout=out/Math.max(1,no);
    $('#t26DV').textContent=fmtN(dm,2)+'ᵐ';
    $('#t26DKv').innerHTML=kv(T(TX.frac),fmtN(100*10**(-.4*dm))+'%')+kv(T(TX.cnt)+' (ichida / tashqarida)',fmtN(dens/Math.max(1e-6,dout)*100)+'%',true)+kv('10^(0,4·Δm)',fmtN(10**(.4*dm),2)+'×'); });
  $('#t26DM').oninput=drawD;

  /* 02 · Emission spektr */
  K.draw(function(){ const cv=$('#t26S'); const {x,w,h}=fit(cv,.22,170), c=C(), pl=12, pr=12, W=w-pl-pr, L=l=>pl+(l-390)/(700-390)*W, y=16, bh=h*.42;
    x.fillStyle='#05060c'; x.fillRect(pl,y,W,bh);
    [[656.3,'Hα',1,'#ff3b3b'],[486.1,'Hβ',.6,'#3fc8ff'],[434,'Hγ',.3,'#7a6bff'],[500.7,'[OIII]',.9,'#3fff9a'],[495.9,'[OIII]',.35,'#3fff9a'],[658.4,'[NII]',.4,'#ff4040'],[654.8,'[NII]',.15,'#ff4040'],[587.6,'He',.15,'#ffe060']].forEach(([l,n,s,col],i)=>{ x.globalAlpha=.25+s*.75; x.fillStyle=col; x.fillRect(L(l)-1.5,y,3,bh); x.globalAlpha=1; if(s>.3) lbl(x,n,L(l),y+bh+14+(i%2)*12,col); });
    [400,500,600,700].forEach(l=>lbl(x,l+' nm',L(l),h-4,c.dim)); });

  /* 03 · Fluoressensiya */
  let ft=-1, fL=0, fRun=false;
  const drawF=K.draw(function(){ const cv=$('#t26F'); const {x,w,h}=fit(cv,.38,260), c=C(), sx=w*.12, ax=w*.6, ay=h/2, t=ft;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const g=x.createRadialGradient(sx,ay,0,sx,ay,28); g.addColorStop(0,'#fff'); g.addColorStop(.4,'#9ab8ff'); g.addColorStop(1,'rgba(120,150,255,0)'); x.fillStyle=g; x.beginPath(); x.arc(sx,ay,28,0,TAU); x.fill(); lbl(x,'O/B',sx,ay+44,'#cfe0ff');
    dot(x,ax,ay,10,'#e0604f'); lbl(x,'H⁺',ax,ay+4,'#fff');
    let stage='';
    if(t>=0&&t<1){ const px=sx+30+(ax-sx-40)*t; x.strokeStyle='#b49cff'; x.lineWidth=2; x.beginPath(); for(let i=0;i<30;i++){ const xx=px-i*3, yy=ay+5*Math.sin(i*1.4); i?x.lineTo(xx,yy):x.moveTo(xx,yy); } x.stroke(); stage=TX.uv; }
    if(t>=1&&t<2){ const k=t-1; dot(x,ax+k*90,ay-k*40,4,'#9ad0ff'); lbl(x,'e⁻',ax+k*90+8,ay-k*40-6,'#9ad0ff','left'); stage=TX.ion; } else if(t<1){ dot(x,ax+16*Math.cos(performance.now()/300),ay+16*Math.sin(performance.now()/300),3,'#9ad0ff'); }
    if(t>=2&&t<3.4){ const k=Math.min(1,t-2); dot(x,ax+90*(1-k),ay-40*(1-k),4,'#9ad0ff'); if(t>2.6){ const u=(t-2.6)/.8; [['#ff3b3b',-.6],['#3fc8ff',.1],['#3fff9a',.7]].forEach(([col,a])=>{ const rr=14+u*90; x.strokeStyle=col; x.lineWidth=2; x.beginPath(); for(let i=0;i<14;i++){ const d=rr-i*3, xx=ax+Math.cos(a)*d, yy=ay+Math.sin(a)*d+3*Math.sin(i*1.6); i?x.lineTo(xx,yy):x.moveTo(xx,yy); } x.stroke(); }); } stage=TX.rec; }
    $('#t26FV').textContent=stage?T(stage):''; });
  const fStep=n=>{ if(!fRun) return; ft+=Math.min(.05,(n-fL)/1000)*.8; fL=n; if(ft>3.5){ fRun=false; ft=-1; } drawF(); if(fRun) K.rafs.f=requestAnimationFrame(fStep); };
  $('#t26FP').onclick=()=>{ click(700); ft=0; fRun=true; fL=performance.now(); K.rafs.f=requestAnimationFrame(fStep); };

  K.bindQA(); K.quiz($('#t26Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t26', GL, QZ, ico:'🌫', title:TX.title, sub:TX.sub, build });
}; go0();
})();
