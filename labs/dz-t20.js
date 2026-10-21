/* DARSLIK · 20-mavzu (46–48-§). Yillik parallaks. Yulduzlarning o'lchamlari, rangi va temperaturasi */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const ST=[[X('Proksima Sentavra','Проксима Центавра','Proxima Centauri'),.768,11.05,15.5,3050,.154],[X('Sirius','Сириус','Sirius'),.379,-1.46,1.42,9940,1.71],[X('Vega','Вега','Vega'),.130,.03,.58,9600,2.36],[X('Arktur','Арктур','Arcturus'),.0889,-.05,-.3,4290,25.4],[X('Betelgeyze','Бетельгейзе','Betelgeuse'),.0055,.5,-5.6,3500,760],[X('Antares','Антарес','Antares'),.0059,1.06,-5.1,3400,680],[X('Rigel','Ригель','Rigel'),.0038,.13,-7.0,12100,79]];
const SZ=[[X('Neytron yulduzi','Нейтронная звезда','Neutron star'),1.4e-5,'#b8c8ff'],[X('Oq mitti (Eridan 40 B)','Белый карлик (40 Эридана B)','White dwarf (40 Eri B)'),.014,'#e8eeff'],[X('Yer','Земля','Earth'),.00917,'#3f7fe0'],[X('Volf 475 / qizil mitti','Вольф 475 / красный карлик','Red dwarf'),.2,'#ff7a5a'],[X('Quyosh','Солнце','Sun'),1,'#ffd27a'],[X('Sirius','Сириус','Sirius'),1.71,'#cfe0ff'],[X('Vega','Вега','Vega'),2.36,'#dfe8ff'],[X('Arktur','Арктур','Arcturus'),25.4,'#ffb070'],[X('Kanopus','Канопус','Canopus'),71,'#f4f0e0'],[X('Antares','Антарес','Antares'),680,'#ff6a4a'],[X('Sefey VV','VV Цефея','VV Cephei'),1000,'#ff5a3a']];
const TX={
 title:X('Yillik parallaks. Yulduzlarning o‘lchamlari, rangi va temperaturasi','Годичный параллакс. Размеры, цвет и температура звёзд','Annual parallax. Sizes, colours and temperatures of stars'),
 sub:X('46–48-§ · Yillik parallaks va parsek, spektral parallaks, yulduz diametri, yorqinlik–radius–temperatura bog‘lanishi, rang ko‘rsatkichi','§46–48 · Годичный параллакс и парсек, спектральный параллакс, диаметр звезды, связь светимости, радиуса и температуры, показатель цвета','§46–48 · Annual parallax and the parsec, spectroscopic parallax, stellar diameters, the luminosity–radius–temperature link, colour index'),
 intro:X('Yulduzlargacha masofani aniqlash ularning <b>yillik parallaktik siljishi</b>ga asoslanadi. Quyosh atrofida radiusi ≈150 mln km li aylana bo‘ylab harakatlanayotgan Yerdan qaraganda yaqin yulduzlar uzoqdagi yulduzlar fonida bir yilda <b>aylana</b> (yulduz Yer orbita tekisligiga tik yo‘nalishda bo‘lsa) yoki <b>ellips</b> (burchak ostida bo‘lsa) chizadi.','Расстояния до звёзд определяют по их <b>годичному параллактическому смещению</b>. Наблюдателю на Земле, движущейся вокруг Солнца по окружности радиусом ≈150 млн км, близкие звёзды на фоне далёких описывают за год <b>окружность</b> (если звезда в направлении, перпендикулярном плоскости орбиты) или <b>эллипс</b> (если под углом).','Stellar distances rest on the <b>annual parallactic shift</b>. Seen from Earth, which circles the Sun on a ≈150 million km radius, nearby stars trace a <b>circle</b> against distant ones over a year (if perpendicular to the orbital plane) or an <b>ellipse</b> (if at an angle).'),
 s1:X('Yillik parallaks va parsek','Годичный параллакс и парсек','Annual parallax and the parsec'),
 s1D:X('Yulduzdan qaraganda qarash chizig‘iga tik bo‘lgan Yer orbitasi radiusining ko‘rinish burchagi — <b>yillik parallaks π</b> (90-rasm). To‘g‘ri burchakli QEM uchburchakdan sin π = r/l, ya’ni l = r/sin π. π juda kichik va yoy sekundlarida o‘lchangani uchun, r = 1 a.b. = 1/206265 pk bo‘lsa, <b>l = 1/π″</b> pk. 1837-yilda bu metod bilan birinchi marta <b>Vega</b> (Lira α) ning parallaksini o‘lchab, masofasini Pulkovo observatoriyasi asoschisi <b>V. Y. Struve</b> aniqladi. Metod nisbatan yaqin (π ≥ 0,01″) yulduzlar uchun ishlaydi.','Угол, под которым со звезды виден радиус земной орбиты, перпендикулярный лучу зрения, — <b>годичный параллакс π</b> (рис. 90). Из прямоугольного треугольника QEM: sin π = r/l, т. е. l = r/sin π. Так как π очень мал и измеряется в секундах дуги, при r = 1 а. е. = 1/206265 пк получаем <b>l = 1/π″</b> пк. Впервые этим методом параллакс <b>Веги</b> (α Лиры) измерил основатель Пулковской обсерватории <b>В. Я. Струве</b>. Метод применим к сравнительно близким звёздам (π ≥ 0,01″).','The angle the Earth’s orbital radius (perpendicular to the line of sight) subtends at the star is the <b>annual parallax π</b> (Fig. 90). From right triangle QEM, sin π = r/l, so l = r/sin π. As π is tiny and measured in arcseconds, with r = 1 AU = 1/206265 pc we get <b>l = 1/π″</b> pc. <b>V. Ya. Struve</b>, founder of Pulkovo Observatory, first measured a parallax this way — that of <b>Vega</b> (α Lyrae). The method works for relatively close stars (π ≥ 0.01″).'),
 bNote:X('Kitobda yil 1886 deb yozilgan; tarixiy manbalarda Struve Vega parallaksini 1837-yilda e’lon qilgan.','В учебнике указан 1886 год; по историческим данным Струве опубликовал параллакс Веги в 1837 г.','The book gives 1886; historically Struve published Vega’s parallax in 1837.'),
 pi:X('Parallaks π','Параллакс π','Parallax π'), l:X('Masofa l = 1/π','Расстояние l = 1/π','Distance l = 1/π'), ly:X('yorug‘lik yili','световых лет','light years'), au:X('a.b.','а. е.','AU'), beta:X('Ekliptik kenglik β','Эклиптическая широта β','Ecliptic latitude β'), month:X('Oy','Месяц','Month'),
 shape:X('Siljish shakli','Форма смещения','Shape of the shift'), circ:X('aylana','окружность','circle'), ell:X('ellips','эллипс','ellipse'), line:X('to‘g‘ri chiziq','отрезок','line'),
 s2:X('Spektral parallaks','Спектральный параллакс','Spectroscopic parallax'),
 s2D:X('Juda uzoq yulduzlar uchun masofa parseklarda <b>ko‘rinma (m)</b> va <b>absolut (M)</b> yulduz kattaliklari bo‘yicha topiladi — bu <b>spektral parallaks</b>: <b>lg r = (m − M + 5)/5</b>. Absolut kattalik yulduz spektridan aniqlanadi.','Для очень далёких звёзд расстояние в парсеках находят по <b>видимой (m)</b> и <b>абсолютной (M)</b> звёздным величинам — это <b>спектральный параллакс</b>: <b>lg r = (m − M + 5)/5</b>. Абсолютная величина определяется по спектру звезды.','For very distant stars the distance in parsecs comes from the <b>apparent (m)</b> and <b>absolute (M)</b> magnitudes — the <b>spectroscopic parallax</b>: <b>lg r = (m − M + 5)/5</b>. M is found from the star’s spectrum.'),
 m:X('Ko‘rinma kattalik m','Видимая величина m','Apparent magnitude m'), M:X('Absolut kattalik M','Абсолютная величина M','Absolute magnitude M'), mod:X('Masofa moduli m − M','Модуль расстояния m − M','Distance modulus m − M'),
 s3:X('Yulduzlarning o‘lchamlari','Размеры звёзд','Sizes of stars'),
 s3D:X('Yulduzlar juda uzoq, eng katta teleskopda ham nuqta bo‘lib ko‘rinadi; faqat ayrimlarining burchak o‘lchamini <b>yulduz interferometrlari</b> bilan o‘lchash mumkin. Ko‘rinma diametri d″ va masofa l ma’lum bo‘lsa: <b>D = l·sin d″</b>. Ko‘pchilik yulduzlar uchun esa ularni absolut qora jism deb, Stefan–Bolsman qonunidan foydalaniladi: L = 4πR²·σT⁴. Quyosh bilan nisbatini olsak: <b>L/L☉ = (T/T☉)⁴·(R/R☉)²</b>, bundan <b>lg R = ½·lg L − 2·lg(T/T☉)</b> (R, L Quyosh birliklarida). Misol: Quyoshning ko‘rinma radiusi ρ = 16′, R☉ = 1,5·10¹¹·tg 16′ ≈ 7·10⁸ m ≈ 700 000 km.','Звёзды очень далеки и даже в крупнейшие телескопы видны точками; лишь у некоторых угловой размер измеряют <b>звёздными интерферометрами</b>. Если известны видимый диаметр d″ и расстояние l: <b>D = l·sin d″</b>. Для большинства звёзд их считают абсолютно чёрными телами и пользуются законом Стефана–Больцмана: L = 4πR²·σT⁴. В отношении к Солнцу: <b>L/L☉ = (T/T☉)⁴·(R/R☉)²</b>, откуда <b>lg R = ½·lg L − 2·lg(T/T☉)</b> (R и L в солнечных единицах). Пример: видимый радиус Солнца ρ = 16′, R☉ = 1,5·10¹¹·tg 16′ ≈ 7·10⁸ м ≈ 700 000 км.','Stars are so far that even the largest telescopes show points; only a few have angular sizes measured with <b>stellar interferometers</b>. Knowing the apparent diameter d″ and distance l: <b>D = l·sin d″</b>. For most stars, treating them as black bodies, Stefan–Boltzmann gives L = 4πR²·σT⁴. Relative to the Sun: <b>L/L☉ = (T/T☉)⁴·(R/R☉)²</b>, so <b>lg R = ½·lg L − 2·lg(T/T☉)</b> (R, L in solar units). Example: the Sun’s apparent radius ρ = 16′ gives R☉ = 1.5·10¹¹·tan 16′ ≈ 7·10⁸ m ≈ 700,000 km.'),
 sizeD:X('Gigant va o‘tagigant yulduzlar orasida radiusi Quyoshnikidan ming marta kattalari bor: Sefey yulduz turkumidagi <b>VV</b> yulduzi radiusi kitobga ko‘ra Quyoshnikidan 6000 marta katta (hozirgi baholar ≈1000). Katta It turkumining eng yorug‘ yulduzi <b>Sirius</b>ning radiusi ≈2 marta katta (1 400 000 km). Ba’zi yulduzlar Quyoshdan o‘nlab marta kichik, diametri planetalarnikidek — bir necha ming km; ular ko‘pincha oq rangda bo‘lib, <b>oq mittilar</b> deyiladi (91-rasm).','Среди гигантов и сверхгигантов встречаются звёзды с радиусом в тысячу раз больше солнечного: радиус <b>VV Цефея</b>, по учебнику, в 6000 раз больше солнечного (современные оценки ≈1000). Радиус <b>Сириуса</b>, ярчайшей звезды Большого Пса, примерно в 2 раза больше (1 400 000 км). Некоторые звёзды в десятки раз меньше Солнца, их диаметры как у планет — несколько тысяч км; чаще всего они белые и называются <b>белыми карликами</b> (рис. 91).','Among giants and supergiants are stars a thousand times the Sun’s radius: the book gives <b>VV Cephei</b> 6000 solar radii (modern estimates ≈1000). <b>Sirius</b>, brightest in Canis Major, is about twice the Sun (1,400,000 km). Some stars are tens of times smaller than the Sun, planet-sized at a few thousand km; usually white, they are <b>white dwarfs</b> (Fig. 91).'),
 L:X('Yorqinlik L/L☉','Светимость L/L☉','Luminosity L/L☉'), Tk:X('Temperatura T','Температура T','Temperature T'), R:X('Radius R/R☉','Радиус R/R☉','Radius R/R☉'), km:X('km','км','km'),
 cmpT:X('Yulduzlar o‘lchamlari (91-rasm)','Размеры звёзд (рис. 91)','Star sizes (Fig. 91)'), zoom:X('Masshtab','Масштаб','Zoom'),
 s4:X('Yulduzlarning rangi va temperaturasi','Цвет и температура звёзд','Colours and temperatures of stars'),
 s4D:X('Yulduzlar rangiga ko‘ra farqlanadi: Quyosh — sariq, sirti ≈6000 K; to‘q qizillar 2500–3000 K, zarg‘aldoqlar 3500–4000 K, oqlar 17 000–18 000 K atrofida; eng «qaynog‘i» — ko‘k-havorang, 25 000–50 000 K. Temperatura spektrdagi energiya taqsimotidan <b>Vin qonuni</b> bilan topiladi: λ_max·T = 0,29 sm·K (92-rasm). Shuningdek, rang filtrlarida o‘lchangan kattaliklar farqi — <b>rang ko‘rsatkichi</b> CI = m_pg − m_pv bo‘yicha ham topiladi: yulduz rangi ko‘kka yaqinlashgan sayin temperaturasi ortadi. Bu sirt temperaturasi; ichki temperatura nazariy hisoblanadi — bir necha milliondan o‘nlab million gradusgacha: Quyosh markazida 15 mln, qaynoq yulduzlarda 50–100 mln gradus.','Звёзды различаются цветом: Солнце жёлтое, поверхность ≈6000 K; тёмно-красные — 2500–3000 K, оранжевые — 3500–4000 K, белые — около 17 000–18 000 K; самые «горячие» — голубые, 25 000–50 000 K. Температуру находят по распределению энергии в спектре с помощью <b>закона Вина</b>: λ_max·T = 0,29 см·К (рис. 92). Её определяют и по <b>показателю цвета</b> CI = m_pg − m_pv — разности величин в цветных фильтрах: чем звезда голубее, тем она горячее. Это температура поверхности; внутреннюю вычисляют теоретически — от нескольких до десятков миллионов градусов: в центре Солнца 15 млн, у горячих звёзд 50–100 млн градусов.','Stars differ in colour: the Sun is yellow at ≈6000 K; deep red stars are 2500–3000 K, orange 3500–4000 K, white around 17,000–18,000 K; the hottest are blue, 25,000–50,000 K. Temperature follows from the spectrum’s energy distribution via <b>Wien’s law</b>: λ_max·T = 0.29 cm·K (Fig. 92). It is also found from the <b>colour index</b> CI = m_pg − m_pv, the magnitude difference through colour filters: the bluer the star, the hotter. That is the surface; interiors are computed theoretically — millions to tens of millions of degrees: 15 million in the Sun’s core, 50–100 million in hot stars.'),
 peak:X('Maksimum λ_max','Максимум λ_max','Peak λ_max'), col:X('Rangi','Цвет','Colour'), ci:X('Rang ko‘rsatkichi CI (taxm.)','Показатель цвета CI (ок.)','Colour index CI (approx.)')
};
const GL=[
 [X('Yillik parallaks π','Годичный параллакс π','Annual parallax π'),X('Yulduzdan Yer orbitasi radiusining (qarash chizig‘iga tik) ko‘rinish burchagi.','Угол, под которым со звезды виден радиус земной орбиты (перпендикулярный лучу зрения).','The angle the Earth’s orbital radius subtends at the star.')],
 [X('Parsek','Парсек','Parsec'),X('Parallaksi 1″ bo‘lgan yulduzgacha masofa: l = 1/π″ pk.','Расстояние до звезды с параллаксом 1″: l = 1/π″ пк.','The distance at which π = 1″: l = 1/π″ pc.')],
 [X('Spektral parallaks','Спектральный параллакс','Spectroscopic parallax'),X('m va M bo‘yicha masofa: lg r = (m − M + 5)/5.','Расстояние по m и M: lg r = (m − M + 5)/5.','Distance from m and M: lg r = (m − M + 5)/5.')],
 [X('Yulduz interferometri','Звёздный интерферометр','Stellar interferometer'),X('Yulduzlarning burchak o‘lchamini o‘lchaydigan maxsus teleskop.','Особый телескоп для измерения угловых размеров звёзд.','A special telescope that measures stars’ angular sizes.')],
 [X('Oq mitti','Белый карлик','White dwarf'),X('Diametri planetalarnikidek (bir necha ming km) bo‘lgan oq rangli yulduz.','Белая звезда диаметром как у планеты (несколько тысяч км).','A white star the size of a planet (a few thousand km).')],
 [X('Rang ko‘rsatkichi','Показатель цвета','Colour index'),X('CI = m_pg − m_pv — turli filtrlardagi kattaliklar farqi; temperaturani ko‘rsatadi.','CI = m_pg − m_pv — разность величин в разных фильтрах; указывает температуру.','CI = m_pg − m_pv — the magnitude difference between filters; indicates temperature.')]
];
const QA=[
 [X('Yulduz uchun yillik parallaks burchagini chizmada ko‘rsating.','Покажите на чертеже годичный параллакс звезды.','Show a star’s annual parallax on a diagram.'),X('Quyosh Q, Yer E va yulduz M uchburchagida M dagi burchak — π (1-bo‘limdagi chizma, 90-rasm).','В треугольнике Солнце Q — Земля E — звезда M угол при M — это π (чертёж в разделе 1, рис. 90).','In the triangle Sun Q — Earth E — star M, the angle at M is π (diagram in section 1, Fig. 90).')],
 [X('Berilgan yillik parallaksga ko‘ra masofa parseklarda qanday topiladi?','Как по годичному параллаксу найти расстояние в парсеках?','How is distance in parsecs found from parallax?'),X('l = 1/π″ (pk).','l = 1/π″ (пк).','l = 1/π″ (pc).')],
 [X('Spektral parallaks asosida masofa qanday topiladi?','Как найти расстояние по спектральному параллаксу?','How is distance found by spectroscopic parallax?'),X('Spektrdan M topiladi, m o‘lchanadi: lg r = (m − M + 5)/5.','По спектру находят M, измеряют m: lg r = (m − M + 5)/5.','Find M from the spectrum, measure m: lg r = (m − M + 5)/5.')],
 [X('Yorqinlik va radius orasida qanday bog‘lanish bor?','Как связаны светимость и радиус?','How are luminosity and radius related?'),X('L = 4πR²σT⁴; Quyosh birliklarida L = R²·(T/T☉)⁴, lg R = ½ lg L − 2 lg(T/T☉).','L = 4πR²σT⁴; в солнечных единицах L = R²·(T/T☉)⁴, lg R = ½ lg L − 2 lg(T/T☉).','L = 4πR²σT⁴; in solar units L = R²·(T/T☉)⁴, lg R = ½ lg L − 2 lg(T/T☉).')],
 [X('Yulduz temperaturasi qanday metodlar bilan topiladi?','Какими методами находят температуру звезды?','How is a star’s temperature found?'),X('Spektrdagi energiya maksimumidan Vin qonuni bilan (λ_max·T = 0,29 sm·K) va rang ko‘rsatkichi CI bo‘yicha.','По максимуму энергии в спектре — законом Вина (λ_max·T = 0,29 см·К) и по показателю цвета CI.','From the spectral peak via Wien’s law (λ_max·T = 0.29 cm·K) and from the colour index CI.')]
];
const QZ=[
 [X('Parallaksi 0,1″ bo‘lgan yulduzgacha masofa:','Расстояние до звезды с π = 0,1″:','Distance to a star with π = 0.1″:'),[X('10 pk','10 пк','10 pc'),X('0,1 pk','0,1 пк','0.1 pc'),X('100 pk','100 пк','100 pc')]],
 [X('1 pk necha a.b.?','Сколько а. е. в 1 пк?','How many AU in 1 pc?'),[X('206 265','206 265','206,265'),X('63 240','63 240','63,240'),X('3,26','3,26','3.26')]],
 [X('Yaqin yulduz Yer orbita tekisligiga tik yo‘nalishda bo‘lsa, bir yilda chizadi:','Если звезда в направлении, перпендикулярном орбите Земли, за год она описывает:','A star perpendicular to Earth’s orbit traces in a year a:'),[X('aylana','окружность','circle'),X('to‘g‘ri chiziq','отрезок','line'),X('parabola','параболу','parabola')]],
 [X('Birinchi parallaks (Vega) ni kim o‘lchagan?','Кто измерил первый параллакс (Вега)?','Who measured the first parallax (Vega)?'),[X('V. Y. Struve','В. Я. Струве','V. Ya. Struve'),X('Galiley','Галилей','Galileo'),X('Kepler','Кеплер','Kepler')]],
 [X('m = 10, M = 0 bo‘lsa, masofa:','При m = 10, M = 0 расстояние:','If m = 10 and M = 0, the distance is:'),[X('1000 pk','1000 пк','1000 pc'),X('100 pk','100 пк','100 pc'),X('10 pk','10 пк','10 pc')]],
 [X('Yulduzning T si Quyoshnikidek, L = 100 L☉. Radiusi:','T звезды как у Солнца, L = 100 L☉. Радиус:','A star with the Sun’s T and L = 100 L☉ has radius:'),[X('10 R☉','10 R☉','10 R☉'),X('100 R☉','100 R☉','100 R☉'),X('2 R☉','2 R☉','2 R☉')]],
 [X('Quyosh radiusi (ρ = 16′ bo‘yicha):','Радиус Солнца (по ρ = 16′):','The Sun’s radius (from ρ = 16′):'),[X('≈ 700 000 km','≈ 700 000 км','≈ 700,000 km'),X('≈ 70 000 km','≈ 70 000 км','≈ 70,000 km'),X('≈ 7 mln km','≈ 7 млн км','≈ 7 million km')]],
 [X('Ko‘k-havorang yulduzlar temperaturasi:','Температура голубых звёзд:','Temperature of blue stars:'),[X('25 000–50 000 K','25 000–50 000 K','25,000–50,000 K'),X('2500–3000 K','2500–3000 K','2500–3000 K'),X('6000 K','6000 K','6000 K')]],
 [X('Diametri planetalarnikidek oq yulduzlar:','Белые звёзды размером с планету:','White stars the size of planets:'),[X('oq mittilar','белые карлики','white dwarfs'),X('qizil gigantlar','красные гиганты','red giants'),X('o‘tagigantlar','сверхгиганты','supergiants')]]
];
const wlRGB=l=>{ let r=0,g=0,b=0; if(l<440){ r=-(l-440)/60; b=1; } else if(l<490){ g=(l-440)/50; b=1; } else if(l<510){ g=1; b=-(l-510)/20; } else if(l<580){ r=(l-510)/70; g=1; } else if(l<645){ r=1; g=-(l-645)/65; } else r=1; return [r,g,b].map(v=>Math.round(255*Math.max(0,Math.min(1,v)))); };
const planck=(lnm,T)=>{ const l=lnm*1e-9; return 1/(l**5*(Math.exp(0.014388/(l*T))-1)); };
const starCol=T=>{ let r=0,g=0,b=0; for(let l=400;l<=700;l+=5){ const p=planck(l,T), cc=wlRGB(l); r+=cc[0]*p; g+=cc[1]*p; b+=cc[2]*p; } const m=Math.max(r,g,b); return `rgb(${255*r/m|0},${255*g/m|0},${255*b/m|0})`; };
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const ln=(x,a,b,c2,d,col,w,dash)=>{ x.strokeStyle=col; x.lineWidth=w||1; x.setLineDash(dash||[]); x.beginPath(); x.moveTo(a,b); x.lineTo(c2,d); x.stroke(); x.setLineDash([]); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><p class="t1-cap">${T(TX.bNote)}</p><div class="t1-formula">sin π = r / l · l = 1 / π″ (pk)</div>
    <div class="t1-two"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t20G"></canvas></div><div class="dz-card t1-chart"><canvas class="t1-cv" id="t20S"></canvas></div></div>
    <div class="t1-split"><div class="t1-side"><label class="t1-ctl"><span>${T(TX.month)}: <b id="t20MV"></b></span><input type="range" class="lab-range" id="t20Mo" min="0" max="12" step="0.02" value="3"></label>
      <label class="t1-ctl"><span>${T(TX.beta)}: <b id="t20BV"></b></span><input type="range" class="lab-range" id="t20B" min="0" max="90" step="1" value="40"></label>
      <label class="t1-ctl"><span>${T(TX.pi)}: <b id="t20PV"></b></span><input type="range" class="lab-range" id="t20P" min="-2.5" max="0" step="0.005" value="-0.42"></label></div>
      <div class="t1-side"><div class="lab-row" style="margin:0">${chips('ps',ST.slice(0,4).map((s,i)=>[i,T(s[0])]))}</div><div class="lab-kv" id="t20PKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">lg r = (m − M + 5) / 5</div>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0">${chips('sp',ST.map((s,i)=>[i,T(s[0])]))}</div>
      <label class="t1-ctl"><span>${T(TX.m)}: <b id="t20mV"></b></span><input type="range" class="lab-range" id="t20m" min="-2" max="20" step="0.01" value="0.5"></label>
      <label class="t1-ctl"><span>${T(TX.M)}: <b id="t20MMV"></b></span><input type="range" class="lab-range" id="t20MM" min="-8" max="16" step="0.01" value="-5.6"></label><div class="lab-kv" id="t20SKv"></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-formula">L / L☉ = (R / R☉)² · (T / T☉)⁴</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t20R"></canvas></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.L)}: <b id="t20LV"></b></span><input type="range" class="lab-range" id="t20L" min="-4" max="6" step="0.01" value="0"></label>
        <label class="t1-ctl"><span>${T(TX.Tk)}: <b id="t20TV"></b></span><input type="range" class="lab-range" id="t20T" min="2500" max="40000" step="50" value="5780"></label><div class="lab-kv" id="t20RKv"></div></div></div>
    <p class="t1-p">${T(TX.sizeD)}</p>
    <div class="dz-card t1-chart"><h4>${T(TX.cmpT)}</h4><canvas class="t1-cv" id="t20Z"></canvas><label class="t1-ctl"><span>${T(TX.zoom)}</span><input type="range" class="lab-range" id="t20ZS" min="0" max="1" step="0.002" value="0.35"></label></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-formula">λ_max · T = 0,29 sm · K</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t20W"></canvas><canvas class="t1-cv" id="t20Bar"></canvas><label class="t1-ctl"><span>${T(TX.Tk)}: <b id="t20WV"></b></span><input type="range" class="lab-range" id="t20WT" min="2500" max="50000" step="50" value="6000"></label></div>
    <div class="lab-kv" id="t20WKv"></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t20Quiz"></div>`)}`;

  /* 01 · Yillik parallaks */
  const drawP=K.draw(function(){ const mo=+$('#t20Mo').value, b=+$('#t20B').value*D2R, p=10**+$('#t20P').value, lam=mo/12*TAU, c=C();
    { const cv=$('#t20G'); const {x,w,h}=fit(cv,.8,320), qx=w*.32, qy=h*.72, R=Math.min(w*.2,h*.22), sx=w*.72, sy=h*.12;
      x.fillStyle=c.day?'#f3ead6':'#05081a'; x.fillRect(0,0,w,h);
      x.strokeStyle=c.brd; x.beginPath(); x.ellipse(qx,qy,R,R*.35,0,0,TAU); x.stroke();
      const ex=qx+R*Math.cos(lam), ey=qy+R*.35*Math.sin(lam), e2x=qx-R*Math.cos(lam), e2y=qy-R*.35*Math.sin(lam);
      dot(x,qx,qy,7,'#ffc34d'); lbl(x,'Q',qx-12,qy+4,c.text,'right'); dot(x,ex,ey,5,'#3f7fe0'); lbl(x,'E',ex+8,ey+14,c.text,'left');
      ln(x,qx,qy,sx,sy,c.dim,1,[4,4]); ln(x,ex,ey,sx,sy,c.gold,1.6); ln(x,qx,qy,ex,ey,c.text,1.6); lbl(x,'r',(qx+ex)/2,(qy+ey)/2-6,c.text);
      dot(x,sx,sy,5,'#fff'); lbl(x,'M',sx+10,sy+4,c.text,'left');
      const a1=Math.atan2(qy-sy,qx-sx), a2=Math.atan2(ey-sy,ex-sx); x.strokeStyle='#e0604f'; x.lineWidth=2; x.beginPath(); x.arc(sx,sy,36,Math.min(a1,a2),Math.max(a1,a2)); x.stroke(); lbl(x,'π',sx+44*Math.cos((a1+a2)/2),sy+44*Math.sin((a1+a2)/2)+4,'#e0604f');
      lbl(x,'l',(qx+sx)/2+10,(qy+sy)/2,c.dim,'left'); }
    { const cv=$('#t20S'); const {x,w,h}=fit(cv,.8,320), cx=w/2, cy=h/2, A=Math.min(w,h)*.38;
      x.fillStyle='#03050f'; x.fillRect(0,0,w,h); let s=4; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<110;i++) dot(x,r()*w,r()*h,.6+r(),'rgba(220,230,255,.6)');
      x.strokeStyle='rgba(255,198,92,.55)'; x.setLineDash([3,4]); x.beginPath(); x.ellipse(cx,cy,A,Math.max(.5,A*Math.sin(b)),0,0,TAU); x.stroke(); x.setLineDash([]);
      const px=cx-A*Math.sin(lam), py=cy+A*Math.sin(b)*Math.cos(lam); dot(x,px,py,5,'#ffe9b0'); lbl(x,'M',px+9,py-6,'#ffe9b0','left');
      lbl(x,'2π = '+(p<.1?fmtN(2*p,3):fmtN(2*p,2))+'″',cx,h-8,'#9aa6cc'); }
    const l=1/p, sh=b>85*D2R?TX.circ:b<3*D2R?TX.line:TX.ell; const ms=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    $('#t20MV').textContent=ms[Math.floor(mo)%12]; $('#t20BV').textContent=Math.round(b/D2R)+'°'; $('#t20PV').textContent=fmtN(p,p<.1?4:3)+'″';
    $('#t20PKv').innerHTML=kv(T(TX.pi),fmtN(p,p<.1?4:3)+'″')+kv(T(TX.l),fmtN(l,l<10?2:0)+' pk',true)+kv('',fmtN(l*3.26,l<10?2:0)+' '+T(TX.ly))+kv('',fmtN(l*206265)+' '+T(TX.au))+kv(T(TX.shape),T(sh)); });
  ['#t20Mo','#t20B','#t20P'].forEach(s=>$(s).oninput=()=>{ mark('ps',''); drawP(); });
  on('ps',v=>{ $('#t20P').value=Math.log10(ST[+v][1]); mark('ps',v); drawP(); });
  { let run=false, L=0; }

  /* 02 · Spektral parallaks */
  const sp=()=>{ const m=+$('#t20m').value, M=+$('#t20MM').value, r=10**((m-M+5)/5); $('#t20mV').textContent=fmtN(m,2); $('#t20MMV').textContent=fmtN(M,2);
    $('#t20SKv').innerHTML=kv(T(TX.mod),fmtN(m-M,2))+kv('r',(r<100?fmtN(r,2):fmtN(r))+' pk',true)+kv('',fmtN(r*3.26,r<10?1:0)+' '+T(TX.ly))+kv('π = 1/r',fmtN(1/r,4)+'″'); };
  ['#t20m','#t20MM'].forEach(s=>$(s).oninput=()=>{ mark('sp',''); sp(); });
  on('sp',v=>{ const s=ST[+v]; $('#t20m').value=s[2]; $('#t20MM').value=s[3]; mark('sp',v); sp(); }); sp();

  /* 03 · Radius kalkulyatori */
  const drawR=K.draw(function(){ const cv=$('#t20R'); const {x,w,h}=fit(cv,.7,300), c=C(), L=10**+$('#t20L').value, Tk=+$('#t20T').value, R=Math.sqrt(L)*(5780/Tk)**2;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const big=Math.max(1,R), k=Math.min(w*.2,h*.4)/big, rs=Math.max(1.5,1*k), rr=Math.max(1.5,R*k);
    const g=x.createRadialGradient(w*.3,h/2,0,w*.3,h/2,rs); g.addColorStop(0,'#fff'); g.addColorStop(1,starCol(5780)); x.fillStyle=g; x.beginPath(); x.arc(w*.3,h/2,rs,0,TAU); x.fill(); lbl(x,T(X('Quyosh','Солнце','Sun')),w*.3,h/2+Math.max(rs,10)+16,'#cfd6f2');
    const g2=x.createRadialGradient(w*.7,h/2,0,w*.7,h/2,rr); g2.addColorStop(0,'#fff'); g2.addColorStop(1,starCol(Tk)); x.fillStyle=g2; x.beginPath(); x.arc(w*.7,h/2,rr,0,TAU); x.fill(); lbl(x,'R = '+fmtN(R,R<.1?3:2)+' R☉',w*.7,h/2+Math.max(rr,10)+16,'#cfd6f2');
    $('#t20LV').textContent=L<.01?L.toExponential(1).replace('.',','):fmtN(L,L<10?2:0); $('#t20TV').textContent=fmtN(Tk)+' K';
    $('#t20RKv').innerHTML=kv('lg R = ½ lg L − 2 lg(T/T☉)',fmtN(.5*Math.log10(L)-2*Math.log10(Tk/5780),3))+kv(T(TX.R),fmtN(R,R<.1?4:2),true)+kv('R',fmtN(R*696000)+' '+T(TX.km)); });
  $('#t20L').oninput=drawR; $('#t20T').oninput=drawR;
  const drawZ=K.draw(function(){ const cv=$('#t20Z'); const {x,w,h}=fit(cv,.36,240), c=C(), z=+$('#t20ZS').value, Rmax=10**(-2+z*5), k=(h*.42)/Rmax, cy=h*.48;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const vis=SZ.filter(s=>s[1]*k>.4&&s[1]<=Rmax*1.3); let tot=vis.reduce((a,s)=>a+Math.min(s[1]*k,w)*2+18,0), px=Math.max(10,(w-tot)/2);
    if(tot>w){ const big=vis[vis.length-1]; const r=big[1]*k; const g=x.createRadialGradient(-r+w*.25,cy,0,-r+w*.25,cy,r); g.addColorStop(0,'#fff'); g.addColorStop(1,big[2]); x.fillStyle=g; x.beginPath(); x.arc(-r+w*.25,cy,r,0,TAU); x.fill(); lbl(x,T(big[0]),w*.12,cy+4,'#2a0d00'); px=w*.3; vis.pop(); tot=0; }
    vis.forEach(s=>{ const r=Math.max(.8,s[1]*k); px+=r; const g=x.createRadialGradient(px-r*.3,cy-r*.3,0,px,cy,r); g.addColorStop(0,'#fff'); g.addColorStop(1,s[2]); x.fillStyle=g; x.beginPath(); x.arc(px,cy,r,0,TAU); x.fill(); lbl(x,T(s[0]),px,cy+Math.max(r,6)+14,'#cfd6f2'); px+=r+18; });
    lbl(x,'1 R☉ = 696 000 km',w-8,h-8,'#9aa6cc','right'); });
  $('#t20ZS').oninput=drawZ;

  /* 04 · Rang va temperatura */
  const drawW=K.draw(function(){ const c=C(), Tk=+$('#t20WT').value, pk=0.0029/Tk*1e9;
    { const cv=$('#t20W'); const {x,w,h}=fit(cv,.42,280), pl=36, pr=12, pt=12, pb=34, L1=2000, sx=l=>pl+l/L1*(w-pl-pr);
      const Ts=[4500,5000,5500,6000,6500,7000], ymax=planck(0.0029/7000*1e9,7000), sy=v=>pt+(1-v/ymax)*(h-pt-pb);
      for(let i=0;i<sx(780)-sx(380);i++){ const cc=wlRGB(380+i/(sx(780)-sx(380))*400); x.fillStyle=`rgb(${cc})`; x.fillRect(sx(380)+i,h-pb+6,1.2,8); }
      x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,h-pb); x.lineTo(w-pr,h-pb); x.stroke();
      [0,500,1000,1500,2000].forEach(l=>lbl(x,String(l),sx(l),h-pb+28,c.dim)); lbl(x,'λ, nm',w-pr,h-pb-6,c.dim,'right');
      Ts.forEach(t=>{ x.strokeStyle=t===6000?c.gold:c.dim; x.lineWidth=t===6000?2:1; x.beginPath(); for(let l=100;l<=L1;l+=10){ const yy=Math.max(pt,sy(planck(l,t))); l===100?x.moveTo(sx(l),yy):x.lineTo(sx(l),yy); } x.stroke(); const lp=0.0029/t*1e9; lbl(x,t+'°',sx(lp),Math.max(pt+10,sy(planck(lp,t))-4),t===6000?c.gold:c.dim); });
      x.strokeStyle=c.neon; x.lineWidth=2.4; x.beginPath(); for(let l=60;l<=L1;l+=6){ const yy=Math.max(pt,sy(planck(l,Tk))); l===60?x.moveTo(sx(l),yy):x.lineTo(sx(l),yy); } x.stroke();
      if(pk<L1){ ln(x,sx(pk),pt,sx(pk),h-pb,c.text,1,[3,3]); } }
    { const cv=$('#t20Bar'); const {x,w,h}=fit(cv,.12,70), T0=2500, T1=50000, sx=t=>10+(Math.log(t/T0)/Math.log(T1/T0))*(w-20);
      for(let i=0;i<w-20;i++){ const t=T0*(T1/T0)**(i/(w-20)); x.fillStyle=starCol(t); x.fillRect(10+i,10,1.2,24); }
      x.strokeStyle='#fff'; x.lineWidth=2; x.strokeRect(sx(Tk)-3,7,6,30);
      [[2750,X('to‘q qizil','тёмно-красные','deep red')],[3750,X('zarg‘aldoq','оранжевые','orange')],[6000,X('sariq','жёлтые','yellow')],[17500,X('oq','белые','white')],[37000,X('ko‘k-havorang','голубые','blue')]].forEach(([t,n])=>lbl(x,T(n),sx(t),h-8,C().dim)); }
    const CI=Tk>0?(-0.5+7090/Tk*0.85-0.15):0;
    $('#t20WV').textContent=fmtN(Tk)+' K';
    const name=Tk<3200?X('to‘q qizil','тёмно-красный','deep red'):Tk<4500?X('zarg‘aldoq','оранжевый','orange'):Tk<7000?X('sariq','жёлтый','yellow'):Tk<20000?X('oq','белый','white'):X('ko‘k-havorang','голубой','blue');
    $('#t20WKv').innerHTML=kv(T(TX.peak),fmtN(pk)+' nm',true)+kv(T(TX.col),T(name))+kv(T(TX.ci),(CI>=0?'+':'')+fmtN(CI,2)+'ᵐ'); });
  $('#t20WT').oninput=drawW;

  K.bindQA(); K.quiz($('#t20Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t20', GL, QZ, ico:'⭐', title:TX.title, sub:TX.sub, build });
}; go0();
})();
