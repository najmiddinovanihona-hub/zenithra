/* DARSLIK · 35-mavzu (69–70-§). Yer sun'iy yo'ldoshlarining orbita elementlari. Atmosferada orbita evolutsiyasi */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU, D2R=K0.D2R;
const KE=3.986e5, RE=6371, WE=7.2921e-5, OM=270*D2R;
const RHO=[[100,5.6e-7],[110,9.7e-8],[120,2.2e-8],[150,2.1e-9],[200,2.5e-10],[250,6.2e-11],[300,1.9e-11],[350,7e-12],[400,2.8e-12],[450,1.2e-12],[500,5.2e-13],[600,1.1e-13],[700,3.1e-14],[800,1.1e-14],[900,5e-15],[1000,3e-15]];
const rho=h=>{ if(h<=100) return RHO[0][1]*Math.exp((100-h)/6); for(let i=1;i<RHO.length;i++) if(h<=RHO[i][0]){ const [h0,r0]=RHO[i-1], [h1,r1]=RHO[i], f=(h-h0)/(h1-h0); return Math.exp(Math.log(r0)+f*(Math.log(r1)-Math.log(r0))); } return 3e-15*Math.exp(-(h-1000)/250); };
const TX={
 title:X('Yer sun’iy yo‘ldoshlarining orbita elementlari. Atmosferada orbita evolutsiyasi','Элементы орбит искусственных спутников Земли. Эволюция орбиты в атмосфере','Orbital elements of Earth satellites. Orbit evolution in the atmosphere'),
 sub:X('69–70-§ · Yer atrofi uchishlari, tugunlar va apsida chiziqlari, ko‘tarilish va botish tugunlari, i, h_a, h_p, T, a, e, Ω, ekvatorial, qutbiy, to‘g‘ri va teskari yo‘ldoshlar, geostatsionar orbita, atmosfera qarshiligi, orbitaning so‘nishi','§69–70 · Околоземные полёты, линии узлов и апсид, восходящий и нисходящий узлы, i, h_a, h_p, T, a, e, Ω, экваториальные, полярные, прямые и обратные спутники, геостационарная орбита, сопротивление атмосферы, затухание орбиты','§69–70 · Near-Earth flight, line of nodes and line of apsides, ascending and descending nodes, i, h_a, h_p, T, a, e, Ω, equatorial, polar, prograde and retrograde satellites, geostationary orbit, atmospheric drag, orbital decay'),
 intro:X('Yer atrofi fazosida harakatlanayotgan sun’iy yo‘ldosh (SY) harakati <b>Yer atrofi uchishlari</b> deyiladi. Osmon mexanikasi nuqtayi nazaridan Yer atrofi fazosi — <b>Yer ta’sir sferasi</b> bilan chegaralangan soha; unda jism harakatini faqat Yerning tortish maydonida kuzatilyapti deb qarash mumkin.','Движение искусственного спутника (ИС) в околоземном пространстве называют <b>околоземными полётами</b>. С точки зрения небесной механики околоземное пространство — область, ограниченная <b>сферой действия Земли</b>; в ней движение тела можно считать происходящим только в поле тяготения Земли.','The motion of an artificial satellite in near-Earth space is called <b>near-Earth flight</b>. In celestial mechanics near-Earth space is the region bounded by <b>Earth’s sphere of influence</b>; inside it the motion can be treated as occurring in Earth’s gravity field alone.'),
 s1:X('Sun’iy yo‘ldosh orbitasining elementlari','Элементы орбиты спутника','Elements of a satellite orbit'),
 s1D:X('SYning orbita tekisligi Yer ekvatori tekisligi bilan <b>tugunlar chizig‘i</b> bo‘yicha kesishadi (118-rasm). <b>Ko‘tarilish tuguni</b> ☊ — SY ekvatorni janubiy yarimshardan shimoliyga kesib o‘tadigan nuqta, <b>botish tuguni</b> ☋ — aksincha. P va A — perigey va apogey, ularni tutashtiruvchi chiziq — <b>apsida chizig‘i</b>. Orbita elementlari: 1) <b>i</b> — orbitaning ekvator tekisligiga og‘maligi; 2) <b>h_a</b> — apogey balandligi; 3) <b>h_p</b> — perigey balandligi; 4) <b>T</b> — aylanish davri; 5) <b>a</b> — katta yarim o‘q; 6) <b>e</b> — ekssentrisitet; 7) <b>Ω</b> — ko‘tarilish tugunining ekvator tekisligida bahorgi tengkunlik ♈ yo‘nalishidan burchak uzoqligi. i = 0° — <b>ekvatorial</b>, i = 90° — <b>qutbiy</b> yo‘ldosh; Yer aylanishi yo‘nalishida harakatlansa — <b>to‘g‘ri</b>, i > 90° bo‘lsa — <b>teskari</b> yo‘ldosh (119-rasm). Ekvator ustida Yer bilan bir xil davrda (24ʰ) aylanuvchi SYlar — <b>geostatsionar</b>.','Плоскость орбиты ИС пересекает плоскость экватора Земли по <b>линии узлов</b> (рис. 118). <b>Восходящий узел</b> ☊ — точка, где ИС пересекает экватор из южного полушария в северное, <b>нисходящий</b> ☋ — наоборот. P и A — перигей и апогей, соединяющая их линия — <b>линия апсид</b>. Элементы орбиты: 1) <b>i</b> — наклонение орбиты к плоскости экватора; 2) <b>h_a</b> — высота апогея; 3) <b>h_p</b> — высота перигея; 4) <b>T</b> — период обращения; 5) <b>a</b> — большая полуось; 6) <b>e</b> — эксцентриситет; 7) <b>Ω</b> — угловое расстояние восходящего узла в плоскости экватора от направления на точку весеннего равноденствия ♈. При i = 0° спутник <b>экваториальный</b>, при i = 90° — <b>полярный</b>; движущийся по вращению Земли — <b>прямой</b>, при i > 90° — <b>обратный</b> (рис. 119). ИС, обращающиеся над экватором с периодом Земли (24ʰ), — <b>геостационарные</b>.','The satellite’s orbital plane cuts Earth’s equatorial plane along the <b>line of nodes</b> (Fig. 118). The <b>ascending node</b> ☊ is where the satellite crosses the equator from south to north, the <b>descending node</b> ☋ the reverse. P and A are perigee and apogee, joined by the <b>line of apsides</b>. The elements: 1) <b>i</b> — inclination to the equator; 2) <b>h_a</b> — apogee height; 3) <b>h_p</b> — perigee height; 4) <b>T</b> — period; 5) <b>a</b> — semi-major axis; 6) <b>e</b> — eccentricity; 7) <b>Ω</b> — the angle, in the equatorial plane, of the ascending node from the vernal-equinox direction ♈. i = 0° gives an <b>equatorial</b> satellite, i = 90° a <b>polar</b> one; moving with Earth’s rotation it is <b>prograde</b>, with i > 90° <b>retrograde</b> (Fig. 119). Satellites circling over the equator with Earth’s period (24ʰ) are <b>geostationary</b>.'),
 i:X('Og‘malik i','Наклонение i','Inclination i'), Om:X('Ko‘tarilish tuguni uzunlamasi Ω','Долгота восходящего узла Ω','Longitude of ascending node Ω'), hp:X('Perigey balandligi h_p','Высота перигея h_p','Perigee height h_p'), ha:X('Apogey balandligi h_a','Высота апогея h_a','Apogee height h_a'),
 a:X('Katta yarim o‘q a','Большая полуось a','Semi-major axis a'), T:X('Davr T','Период T','Period T'), typ:X('Yo‘ldosh turi','Тип спутника','Satellite type'), drag:X('Sichqoncha bilan aylantiring','Вращайте мышью','Drag to rotate'), pr:X('Namunalar','Примеры','Examples'),
 pIss:X('XKS','МКС','ISS'), pPol:X('Qutbiy 90°','Полярный 90°','Polar 90°'), pSso:X('Quyosh-sinxron 98°','Солнечно-синхр. 98°','Sun-synchronous 98°'),
 tEq:X('ekvatorial (i = 0°)','экваториальный (i = 0°)','equatorial (i = 0°)'), tPol:X('qutbiy (i = 90°)','полярный (i = 90°)','polar (i = 90°)'), tPro:X('to‘g‘ri — Yer aylanishi yo‘nalishida (i < 90°)','прямой — по вращению Земли (i < 90°)','prograde — with Earth’s rotation (i < 90°)'), tRet:X('teskari — Yer aylanishiga qarshi (i > 90°)','обратный — против вращения Земли (i > 90°)','retrograde — against Earth’s rotation (i > 90°)'), tGeo:X('geostatsionar — ekvator ustida, davri ≈ 24ʰ','геостационарный — над экватором, период ≈ 24ʰ','geostationary — over the equator, period ≈ 24ʰ'),
 s2:X('Yo‘ldosh qaysi kengliklar ustidan uchadi?','Над какими широтами пролетает спутник?','Which latitudes does a satellite fly over?'),
 s2D:X('Orbita tekisligi ekvatorga i burchak ostida og‘gani uchun SY faqat geografik kengligi i dan katta bo‘lmagan hududlar ustidan uchib o‘tadi (teskari yo‘ldosh uchun 180° − i). Balandligi yetarlicha katta bo‘lsa, SYni φ > i rayonlardan ham — ufq ustida ko‘rish mumkin. Yer aylanib turgani uchun har bir keyingi aylanishda yo‘ldoshning Yerdagi izi g‘arbga suriladi. Toshkent (φ = 41,3°) ustidan uchishi uchun i ≥ 41,3° bo‘lishi kerak. Yuqoridagi orbitani o‘zgartirsangiz, iz ham o‘zgaradi.','Так как плоскость орбиты наклонена к экватору на угол i, ИС пролетает только над районами с широтой не больше i (для обратного — 180° − i). При достаточно большой высоте ИС виден и из районов с φ > i — над горизонтом. Из-за вращения Земли с каждым витком след спутника смещается к западу. Чтобы пролетать над Ташкентом (φ = 41,3°), нужно i ≥ 41,3°. Измените орбиту выше — изменится и след.','Because the orbital plane is tilted by i to the equator, a satellite flies only over latitudes no greater than i (180° − i for a retrograde one). If high enough, it can also be seen from φ > i, above the horizon. As Earth turns, each new orbit’s ground track shifts west. To pass over Tashkent (φ = 41.3°) you need i ≥ 41.3°. Change the orbit above and the track follows.'),
 band:X('Ustidan uchadigan kengliklar','Пролетает над широтами','Overflown latitudes'), vis:X('Ufq ustida ko‘rinadigan kengliklar','Виден над горизонтом до широт','Visible above the horizon up to'), trk:X('3 aylanish izi','след 3 витков','3-orbit ground track'),
 tash:X('Toshkent (41,3°)','Ташкент (41,3°)','Tashkent (41.3°)'), tashS:X('Toshkent','Ташкент','Tashkent'), tOver:X('ustidan uchib o‘tadi','пролетает над ним','flies overhead'), tHor:X('faqat ufq ustida ko‘rinadi','виден только над горизонтом','only seen above the horizon'), tNo:X('ko‘rinmaydi','не виден','never visible'), rpd:X('Sutkadagi aylanishlar','Витков в сутки','Orbits per day'),
 s3:X('Atmosfera qarshiligi','Сопротивление атмосферы','Atmospheric drag'),
 s3D:X('Yer atmosferasining SY harakatiga qarshilik kuchi: <b>F_qarsh = c·S·ρ·υ²_nis / 2</b>, bunda c — yuqori qatlamlar uchun 2–2,5 bo‘lgan o‘lchamsiz qarshilik koeffitsiyenti, S — harakat yo‘nalishiga tik maksimal kesim yuzi, ρ — atmosfera zichligi, υ_nis — yo‘ldoshning tashqi muhitga nisbatan tezligi. Chetlantiruvchi tezlanish a = F/m <b>massaga teskari, kesim yuziga to‘g‘ri proporsional</b>. Shuning uchun yonilg‘isi tugagan, ichi deyarli bo‘sh oxirgi bosqich apparatura zich joylashgan konteynerga nisbatan qarshilikni kuchli «his» qilib, tezda orqada qoladi. Darslikda: 200 km da 2,2·10⁻⁴ m/s², 400 km da 3,1·10⁻⁶ m/s², 800 km da atigi 2,6·10⁻⁸ m/s². Hisoblagichdagi zichlik — o‘rtacha Quyosh faolligi uchun; u faollikka qarab bir necha baravar o‘zgaradi.','Сила сопротивления атмосферы движению ИС: <b>F_сопр = c·S·ρ·υ²_отн / 2</b>, где c — безразмерный коэффициент сопротивления (2–2,5 для верхних слоёв), S — максимальная площадь сечения, перпендикулярного движению, ρ — плотность атмосферы, υ_отн — скорость спутника относительно среды. Возмущающее ускорение a = F/m <b>обратно пропорционально массе и прямо пропорционально площади сечения</b>. Поэтому пустая последняя ступень без топлива «чувствует» сопротивление сильнее плотно набитого аппаратурой контейнера и быстро отстаёт. В учебнике: на 200 км 2,2·10⁻⁴ м/с², на 400 км 3,1·10⁻⁶ м/с², на 800 км лишь 2,6·10⁻⁸ м/с². Плотность в калькуляторе — для средней солнечной активности; она меняется в разы.','Atmospheric drag on a satellite: <b>F_drag = c·S·ρ·υ²_rel / 2</b>, where c is the dimensionless drag coefficient (2–2.5 in the upper layers), S the largest cross-section perpendicular to the motion, ρ the air density and υ_rel the speed relative to the air. The perturbing acceleration a = F/m is <b>inversely proportional to mass and directly proportional to cross-section</b>. That is why an empty spent upper stage “feels” drag far more than a densely packed instrument container and quickly falls behind. The textbook gives 2.2·10⁻⁴ m/s² at 200 km, 3.1·10⁻⁶ m/s² at 400 km and only 2.6·10⁻⁸ m/s² at 800 km. The calculator uses densities for average solar activity; they vary several-fold.'),
 hh:X('Balandlik h','Высота h','Altitude h'), cc:X('Qarshilik koeffitsiyenti c','Коэффициент сопротивления c','Drag coefficient c'), SS:X('Kesim yuzi S','Площадь сечения S','Cross-section S'), mm:X('Massa m','Масса m','Mass m'),
 rh:X('Zichlik ρ','Плотность ρ','Density ρ'), vv:X('Orbital tezlik υ','Орбитальная скорость υ','Orbital speed υ'), FF:X('Qarshilik kuchi F','Сила сопротивления F','Drag force F'), aa:X('Chetlantiruvchi tezlanish a','Возмущающее ускорение a','Perturbing acceleration a'),
 life:X('Taxminiy yashash muddati (120 km gacha)','Примерное время жизни (до 120 км)','Approx. lifetime (down to 120 km)'), low:X('110–120 km dan past: navbatdagi aylanishni yakunlay olmaydi','ниже 110–120 км: следующий виток не завершит','below 110–120 km: cannot complete another orbit'),
 oCon:X('Ilmiy konteyner','Научный контейнер','Science container'), oSt:X('Bo‘sh oxirgi bosqich','Пустая последняя ступень','Empty upper stage'), yr:X('yil','лет','yr'), dy:X('sutka','сут','days'), hr:X('soat','ч','h'),
 s4:X('Orbitaning atmosferadagi evolutsiyasi','Эволюция орбиты в атмосфере','Orbit evolution in the atmosphere'),
 s4D:X('110–120 km balandlikdan pastda atmosfera zichligi keskin ortadi va SY navbatdagi aylanishni yakunlay olmaydi. Elliptik orbitada qarshilik asosan perigeyda ta’sir qiladi: har bir o‘tishda tezlik kamayadi, apogey pasayib, orbita aylanaga yaqinlashadi, so‘ng trayektoriya qo‘l soati prujinasi kabi spiralga aylanadi (120-rasm). Tormozlanishni kuzatish atmosfera yuqori qatlamlarining zichligini hisoblashga imkon beradi. Orbitani maqsadli o‘zgartirish (tezlatish, tormozlash, burish) <b>orbital manyovrlar</b> deyiladi — ular keyingi mavzuda.','Ниже 110–120 км плотность атмосферы резко растёт, и ИС не может завершить очередной виток. На эллиптической орбите сопротивление действует в основном в перигее: при каждом прохождении скорость падает, апогей снижается, орбита скругляется, а затем траектория превращается в спираль, как пружина часов (рис. 120). Наблюдения торможения позволяют вычислять плотность верхней атмосферы. Целенаправленное изменение орбиты (разгон, торможение, поворот) называют <b>орбитальными манёврами</b> — о них в следующей теме.','Below 110–120 km the air density rises steeply and the satellite cannot complete another orbit. On an elliptical orbit drag acts mainly at perigee: each pass lowers the speed, the apogee drops and the orbit rounds off, then the path becomes a spiral like a watch spring (Fig. 120). Watching this braking lets us compute the density of the upper atmosphere. Deliberate changes of an orbit (speeding up, braking, turning) are called <b>orbital manoeuvres</b> — the next topic.'),
 dens:X('Atmosfera ta’siri (kuchaytirilgan)','Влияние атмосферы (усилено)','Atmospheric effect (exaggerated)'), rst:X('↻ Qayta boshlash','↻ Заново','↻ Restart'), revs:X('Aylanishlar soni','Число витков','Orbits completed'), st:X('Holat','Состояние','Status'),
 sOrb:X('orbitada — apogey pasaymoqda','на орбите — апогей снижается','in orbit — apogee dropping'), sLow:X('spiral bo‘ylab tushmoqda','снижается по спирали','spiralling down'), sFall:X('atmosferaga kirib yonib ketdi','вошёл в атмосферу и сгорел','re-entered and burned up'), note:X('Vaqt tezlashtirilgan, balandliklar masshtabda','Время ускорено, высоты в масштабе','Time sped up; heights to scale')
};
const GL=[
 [X('Yer atrofi uchishlari','Околоземные полёты','Near-Earth flight'),X('Yer ta’sir sferasi ichida, faqat Yer tortishida deb qaraladigan harakat.','Движение внутри сферы действия Земли, рассматриваемое только в её поле.','Motion inside Earth’s sphere of influence, treated in Earth’s field alone.')],
 [X('Tugunlar chizig‘i','Линия узлов','Line of nodes'),X('Orbita tekisligi bilan ekvator tekisligining kesishish chizig‘i.','Линия пересечения плоскости орбиты с плоскостью экватора.','Where the orbital plane meets the equatorial plane.')],
 [X('Ko‘tarilish / botish tuguni','Восходящий / нисходящий узел','Ascending / descending node'),X('SY ekvatorni janubdan shimolga / shimoldan janubga kesib o‘tadigan nuqta.','Точка пересечения экватора с юга на север / с севера на юг.','Where the satellite crosses the equator south→north / north→south.')],
 [X('Apsida chizig‘i','Линия апсид','Line of apsides'),X('Perigey P va apogey A ni tutashtiruvchi chiziq.','Линия, соединяющая перигей P и апогей A.','The line joining perigee P and apogee A.')],
 [X('Og‘malik i va Ω','Наклонение i и Ω','Inclination i and Ω'),X('i — orbitaning ekvatorga og‘maligi; Ω — ko‘tarilish tugunining ♈ yo‘nalishidan burchak uzoqligi.','i — наклон орбиты к экватору; Ω — угловое расстояние восходящего узла от направления ♈.','i — tilt of the orbit to the equator; Ω — angle of the ascending node from ♈.')],
 [X('Geostatsionar yo‘ldosh','Геостационарный спутник','Geostationary satellite'),X('Ekvator ustida Yer bilan bir xil davrda (24ʰ) aylanadi — osmonda qo‘zg‘almas turadi.','Обращается над экватором с периодом Земли (24ʰ) — неподвижен на небе.','Circles over the equator with Earth’s period (24ʰ), hanging still in the sky.')],
 [X('Atmosfera qarshiligi','Сопротивление атмосферы','Atmospheric drag'),X('F = cSρυ²/2; chetlantiruvchi tezlanish S/m ga proporsional.','F = cSρυ²/2; возмущающее ускорение пропорционально S/m.','F = cSρυ²/2; the perturbing acceleration scales with S/m.')],
 [X('Orbital manyovr','Орбитальный манёвр','Orbital manoeuvre'),X('Orbitani maqsadli o‘zgartirish: tezlatish, tormozlash, burish.','Целенаправленное изменение орбиты: разгон, торможение, поворот.','A deliberate change of orbit: speeding up, braking, turning.')]
];
const QA=[
 [X('SYning qanday orbita elementlarini bilasiz?','Какие элементы орбиты ИС вы знаете?','Which orbital elements of a satellite do you know?'),X('i — og‘malik, h_a — apogey balandligi, h_p — perigey balandligi, T — davr, a — katta yarim o‘q, e — ekssentrisitet, Ω — ko‘tarilish tugunining uzunlamasi.','i — наклонение, h_a — высота апогея, h_p — высота перигея, T — период, a — большая полуось, e — эксцентриситет, Ω — долгота восходящего узла.','i — inclination, h_a — apogee height, h_p — perigee height, T — period, a — semi-major axis, e — eccentricity, Ω — longitude of the ascending node.')],
 [X('To‘g‘ri va teskari yo‘ldoshlar deb qanday SYlarga aytiladi? Qutbiy va ekvatorial-chi?','Какие ИС называют прямыми и обратными? Полярными и экваториальными?','What are prograde and retrograde satellites? Polar and equatorial?'),X('To‘g‘ri — Yer aylanishi yo‘nalishida harakatlanadi (i < 90°), teskari — qarshi (i > 90°). Qutbiy — i = 90°, ekvatorial — i = 0°.','Прямые движутся по вращению Земли (i < 90°), обратные — против (i > 90°). Полярные — i = 90°, экваториальные — i = 0°.','Prograde ones move with Earth’s rotation (i < 90°), retrograde against it (i > 90°). Polar: i = 90°, equatorial: i = 0°.')],
 [X('Yer atmosferasining SY harakatiga qarshiligi qanday topiladi?','Как находится сопротивление атмосферы движению ИС?','How is atmospheric drag on a satellite found?'),X('F = c·S·ρ·υ²/2: c ≈ 2–2,5, S — kesim yuzi, ρ — zichlik, υ — muhitga nisbatan tezlik.','F = c·S·ρ·υ²/2: c ≈ 2–2,5, S — площадь сечения, ρ — плотность, υ — скорость относительно среды.','F = c·S·ρ·υ²/2: c ≈ 2–2.5, S the cross-section, ρ the density, υ the speed relative to the air.')],
 [X('Geostatsionar yo‘ldoshlar deb qanday SYlarga aytiladi?','Какие ИС называют геостационарными?','What are geostationary satellites?'),X('Ekvator ustida Yer bilan bir xil davrda (24ʰ) aylanuvchi SYlar; ular ≈ 35 786 km balandlikda turadi.','ИС, обращающиеся над экватором с периодом Земли (24ʰ); их высота ≈ 35 786 км.','Satellites circling over the equator with Earth’s period (24ʰ), at about 35 786 km.')]
];
const QZ=[
 [X('i = 90° bo‘lgan yo‘ldosh:','Спутник с i = 90°:','A satellite with i = 90° is:'),[X('qutbiy','полярный','polar'),X('ekvatorial','экваториальный','equatorial'),X('geostatsionar','геостационарный','geostationary')]],
 [X('i > 90° bo‘lgan yo‘ldosh:','Спутник с i > 90°:','A satellite with i > 90° is:'),[X('teskari','обратный','retrograde'),X('to‘g‘ri','прямой','prograde'),X('ekvatorial','экваториальный','equatorial')]],
 [X('Ko‘tarilish tuguni — SY ekvatorni kesib o‘tadigan nuqta:','Восходящий узел — точка пересечения экватора:','The ascending node is where the satellite crosses the equator:'),[X('janubdan shimolga','с юга на север','south to north'),X('shimoldan janubga','с севера на юг','north to south'),X('perigeyda','в перигее','at perigee')]],
 [X('Ω elementi nimani bildiradi?','Что означает элемент Ω?','What does Ω describe?'),[X('ko‘tarilish tugunining ♈ dan burchak uzoqligi','угловое расстояние восходящего узла от ♈','the ascending node’s angle from ♈'),X('orbita og‘maligi','наклонение орбиты','the inclination'),X('perigey balandligi','высоту перигея','the perigee height')]],
 [X('Atmosfera qarshiligi kuchi:','Сила сопротивления атмосферы:','Atmospheric drag force:'),[X('F = cSρυ²/2','F = cSρυ²/2','F = cSρυ²/2'),X('F = cSρυ','F = cSρυ','F = cSρυ'),X('F = GMm/r²','F = GMm/r²','F = GMm/r²')]],
 [X('Qarshilik beradigan chetlantiruvchi tezlanish yo‘ldosh massasiga:','Возмущающее ускорение от сопротивления по отношению к массе:','The drag acceleration, with respect to mass, is:'),[X('teskari proporsional','обратно пропорционально','inversely proportional'),X('to‘g‘ri proporsional','прямо пропорционально','directly proportional'),X('bog‘liq emas','не зависит','independent')]],
 [X('Qaysi balandlikdan pastda SY navbatdagi aylanishni yakunlay olmaydi?','Ниже какой высоты ИС не завершит очередной виток?','Below what height can a satellite not complete another orbit?'),[X('110–120 km','110–120 км','110–120 km'),X('400 km','400 км','400 km'),X('800 km','800 км','800 km')]],
 [X('Geostatsionar yo‘ldosh:','Геостационарный спутник:','A geostationary satellite:'),[X('ekvator ustida 24ʰ davr bilan aylanadi','обращается над экватором с периодом 24ʰ','circles over the equator with a 24ʰ period'),X('qutblar ustidan o‘tadi','проходит над полюсами','passes over the poles'),X('90 minutda bir aylanadi','делает виток за 90 минут','orbits every 90 minutes')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,$,fmtN,C,fit,sec,chips,mark,on}=K;
  const kv=(k,v,f)=>K.kv(String(k).split(' ').map(w=>/[_\u0370-\u03FF\u2080-\u209F⊕☉∞′\/]|^[A-Za-z]$/.test(w)?'<span style="text-transform:none">'+w+'</span>':w).join(' '),v,f);
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹', pw=e=>'10'+(e<0?'⁻':'')+String(Math.abs(e)).split('').map(q=>SUP[+q]).join(''), sci=(n,d)=>{ const e=Math.floor(Math.log10(n)); return fmtN(n/10**e,d==null?2:d)+'·'+pw(e); };
  const dur=s=>s<86400?fmtN(s/3600,1)+' '+T(TX.hr):s<86400*365?fmtN(s/86400)+' '+T(TX.dy):fmtN(s/86400/365.25,1)+' '+T(TX.yr);
  const hm=s=>s<7200?fmtN(s/60,1)+' min':fmtN(s/3600,2)+' '+T(TX.hr);
  const nuOf=(M,e)=>{ let E=M+e*Math.sin(M); for(let k=0;k<14;k++) E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E)); return 2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2)); };
  const rng=(id,lab,min,max,step,val)=>`<label class="t1-ctl"><span>${T(lab)}: <b id="${id}V"></b></span><input type="range" class="lab-range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p>
    <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.pr)}</span>${chips('or',[['iss',T(TX.pIss)],['mol','Molniya'],['geo','GEO'],['pol',T(TX.pPol)],['sso',T(TX.pSso)]])}</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t35V" style="touch-action:none;cursor:grab"></canvas></div>
      <div class="t1-side">${rng('t35I',TX.i,0,180,.1,63.4)}${rng('t35O',TX.Om,0,360,1,60)}${rng('t35P',TX.hp,2.18,4.65,.0001,2.699)}${rng('t35A',TX.ha,2.18,4.65,.0001,4.6)}<div class="lab-kv" id="t35OKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t35G"></canvas>
    <div class="t1-p" style="font-size:12px;margin:6px 0 0;display:flex;gap:16px;flex-wrap:wrap"><span style="color:#2f9e6a">━ ${T(TX.band)}</span><span style="color:#c98a1e">┅ ${T(TX.vis)}</span><span style="color:#d0861f">━ ${T(TX.trk)}</span></div>
    <div class="lab-kv" id="t35GKv"></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-formula">F = c · S · ρ · υ² / 2 · a = F / m</div>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0">${chips('ob',[['kon',T(TX.oCon)],['st',T(TX.oSt)],['iss',T(TX.pIss)]])}</div>
      ${rng('t35H',TX.hh,100,1000,5,400)}${rng('t35C',TX.cc,2,2.5,.05,2.2)}${rng('t35S',TX.SS,0,3.4,.01,.602)}${rng('t35M',TX.mm,1.5,5.7,.01,3)}
      <canvas class="t1-cv" id="t35F"></canvas><div class="lab-kv" id="t35FKv"></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0">${chips('rs',[[1,T(TX.rst)]])}</div>${rng('t35X',TX.dens,.3,3,.05,1)}
      <canvas class="t1-cv" id="t35D"></canvas><div class="lab-kv" id="t35DKv"></div></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t35Quiz"></div>`)}`;

  /* 01 · Orbita elementlari (3D) */
  const st=()=>{ const i=+$('#t35I').value, O=+$('#t35O').value; let hp=10**+$('#t35P').value, ha=10**+$('#t35A').value; if(ha<hp) ha=hp; const rp=RE+hp, ra=RE+ha, a=(rp+ra)/2;
    return {i,O,ir:i*D2R,Or:O*D2R,hp,ha,rp,ra,a,e:(ra-rp)/(ra+rp),T:TAU*Math.sqrt(a**3/KE)}; };
  const orb=(o,nu)=>{ const r=o.a*(1-o.e*o.e)/(1+o.e*Math.cos(nu)), u=OM+nu, x1=r*Math.cos(u), y1=r*Math.sin(u), y2=y1*Math.cos(o.ir), z=y1*Math.sin(o.ir); return [x1*Math.cos(o.Or)-y2*Math.sin(o.Or), x1*Math.sin(o.Or)+y2*Math.cos(o.Or), z]; };
  let yaw=-.7, elv=.42, ma=0;
  const drawO=K.draw(function(){ const cv=$('#t35V'); const {x,w,h}=fit(cv,.8,420), o=st();
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const Rq=Math.max(o.ra*1.12,RE*1.9), s=Math.min(w,h)*.44/Rq, cx=w/2, cy=h/2+8, ER=RE*s, cY=Math.cos(yaw), sY=Math.sin(yaw), cE=Math.cos(elv), sE=Math.sin(elv);
    const P=p=>{ const X1=p[0]*cY-p[1]*sY, D=p[0]*sY+p[1]*cY; return [cx+X1*s, cy-(p[2]*cE-D*sE)*s, D*cE+p[2]*sE]; };
    const path=(pts,col,lw,dash,fill)=>{ x.beginPath(); pts.forEach((q,k)=>k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])); if(fill){ x.fillStyle=fill; x.fill(); } if(col){ x.strokeStyle=col; x.lineWidth=lw||1; x.setLineDash(dash||[]); x.stroke(); x.setLineDash([]); } };
    const circ=(r,n)=>{ const a=[]; for(let k=0;k<=n;k++){ const t=k/n*TAU; a.push(P([r*Math.cos(t),r*Math.sin(t),0])); } return a; };
    const add=(a,b,k)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k];
    path(circ(Rq,96),'rgba(78,168,255,.35)',1,null,'rgba(78,168,255,.07)');
    const op=[]; for(let k=0;k<=240;k++) op.push(P(orb(o,k/240*TAU)));
    path(op,null,0,null,'rgba(255,198,92,.06)');
    const seg=front=>{ x.strokeStyle=front?'#ffc65c':'rgba(255,198,92,.38)'; x.lineWidth=front?2.2:1.4; x.beginPath(); for(let k=0;k<240;k++){ const q=op[k], q2=op[k+1]; if(((q[2]+q2[2])/2>=0)!==front) continue; x.moveTo(q[0],q[1]); x.lineTo(q2[0],q2[1]); } x.stroke(); };
    const nodeA=orb(o,-OM), nodeD=orb(o,Math.PI-OM), peri=orb(o,0), apo=orb(o,Math.PI);
    const rays=[[[1,0,0],RE,Rq*1.08,'#ff8a7a',[],'♈'],[[0,0,1],RE,RE*1.45,'#ffffff',[],'N'],[nodeA,RE,1,'#5fd39a',[5,4]],[nodeD,RE,1,'#5fd39a',[5,4]],[peri,RE,1,'#9ad0ff',[2,3]],[apo,RE,1,'#9ad0ff',[2,3]]].map(r=>{ const v=r[0], L=Math.hypot(v[0],v[1],v[2]), u=[v[0]/L,v[1]/L,v[2]/L], r1=r[2]===1?L:r[2]; return {u,r0:r[1],r1,col:r[3],dash:r[4],t:r[5],dep:P(u)[2]-P([0,0,0])[2]}; });
    const ray=(f)=>rays.forEach(r=>{ if((r.dep>=0)!==f) return; const a=P(r.u.map(q=>q*r.r0)), b=P(r.u.map(q=>q*r.r1)); x.strokeStyle=r.col; x.lineWidth=1.3; x.setLineDash(r.dash); x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.stroke(); x.setLineDash([]); if(r.t){ const c2=P(r.u.map(q=>q*r.r1*1.06)); lbl(x,r.t,c2[0],c2[1]+4,r.col); } });
    seg(false); ray(false);
    const g=x.createRadialGradient(cx-ER*.35,cy-ER*.35,0,cx,cy,ER); g.addColorStop(0,'#6fb0ff'); g.addColorStop(1,'#16336a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,ER,0,TAU); x.fill();
    const eq=circ(RE,96); x.strokeStyle='rgba(160,210,255,.8)'; x.lineWidth=1; x.beginPath(); for(let k=0;k<96;k++) if(eq[k][2]>=0){ x.moveTo(eq[k][0],eq[k][1]); x.lineTo(eq[k+1][0],eq[k+1][1]); } x.stroke();
    ray(true); seg(true);
    const oa=[]; for(let k=0;k<=40;k++){ const t=o.Or*k/40; oa.push(P([Rq*.55*Math.cos(t),Rq*.55*Math.sin(t),0])); } if(o.O>1){ path(oa,'#ff8a7a',1.5); const m=P([Rq*.62*Math.cos(o.Or/2),Rq*.62*Math.sin(o.Or/2),0]); lbl(x,'Ω',m[0],m[1]+4,'#ff8a7a'); }
    const e1=[-Math.sin(o.Or),Math.cos(o.Or),0], ra2=Rq*.2, ia=[]; for(let k=0;k<=30;k++){ const t=o.ir*k/30; ia.push(P(add(add(nodeA,e1,ra2*Math.cos(t)),[0,0,1],ra2*Math.sin(t)))); }
    path([P(nodeA),P(add(nodeA,e1,ra2*1.5))],'rgba(78,168,255,.8)',1.2); if(o.i>.5){ path(ia,'#c08bff',1.6); const m=P(add(add(nodeA,e1,ra2*1.35*Math.cos(o.ir/2)),[0,0,1],ra2*1.35*Math.sin(o.ir/2))); lbl(x,'i',m[0],m[1]+4,'#c08bff'); }
    [[nodeA,'☊','#5fd39a'],[nodeD,'☋','#5fd39a'],[peri,'P','#9ad0ff'],[apo,'A','#9ad0ff']].forEach(([v,t,cl])=>{ const q=P(v), hid=q[2]<0&&Math.hypot(q[0]-cx,q[1]-cy)<ER; if(hid) return; dot(x,q[0],q[1],3.5,cl); lbl(x,t,q[0]+10,q[1]-7,cl,'left'); });
    const sq=P(orb(o,nuOf(ma,o.e))); if(!(sq[2]<0&&Math.hypot(sq[0]-cx,sq[1]-cy)<ER)){ x.fillStyle='rgba(255,255,255,.25)'; x.beginPath(); x.arc(sq[0],sq[1],9,0,TAU); x.fill(); dot(x,sq[0],sq[1],4.5,'#fff'); }
    lbl(x,T(TX.drag),10,18,'rgba(255,255,255,.5)','left'); });
  const typ=o=>(o.i<.3&&Math.abs(o.hp-35786)<400&&Math.abs(o.ha-35786)<400)?TX.tGeo:o.i<.05?TX.tEq:Math.abs(o.i-90)<.05?TX.tPol:o.i<90?TX.tPro:TX.tRet;
  const setO=()=>{ const o=st(); $('#t35IV').textContent=fmtN(o.i,1)+'°'; $('#t35OV').textContent=fmtN(o.O)+'°'; $('#t35PV').textContent=fmtN(o.hp)+' km'; $('#t35AV').textContent=fmtN(o.ha)+' km';
    $('#t35OKv').innerHTML=kv(T(TX.a),fmtN(o.a)+' km')+kv('e',fmtN(o.e,3))+kv(T(TX.T),hm(o.T))+kv('h_p / h_a',fmtN(o.hp)+' / '+fmtN(o.ha)+' km')+kv(T(TX.typ),T(typ(o)),true); setG(); };
  ['#t35I','#t35O','#t35P','#t35A'].forEach(id=>$(id).oninput=()=>{ mark('or',''); setO(); });
  on('or',v=>{ const p={iss:[51.6,415,422,40],mol:[63.4,500,39800,60],geo:[0,35786,35786,0],pol:[90,800,800,100],sso:[98,700,700,140]}[v]; $('#t35I').value=p[0]; $('#t35P').value=Math.log10(p[1]); $('#t35A').value=Math.log10(p[2]); $('#t35O').value=p[3]; mark('or',v); setO(); });
  const cvV=$('#t35V'); let drg=null;
  cvV.onpointerdown=e=>{ drg={x:e.clientX,y:e.clientY,yaw,elv}; cvV.setPointerCapture(e.pointerId); cvV.style.cursor='grabbing'; };
  cvV.onpointermove=e=>{ if(!drg) return; yaw=drg.yaw-(e.clientX-drg.x)*.01; elv=Math.max(-1.2,Math.min(1.45,drg.elv+(e.clientY-drg.y)*.01)); };
  cvV.onpointerup=cvV.onpointercancel=()=>{ drg=null; cvV.style.cursor='grab'; };

  /* 02 · Yerdagi iz */
  const drawG=K.draw(function(){ const cv=$('#t35G'); const {x,w,h}=fit(cv,.5,380), o=st();
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const sx=lo=>(lo+180)/360*w, sy=la=>(90-la)/180*h, ip=o.i<=90?o.i:180-o.i, vis=Math.min(90,ip+Math.acos(RE/o.ra)/D2R);
    x.fillStyle='rgba(255,198,92,.08)'; x.fillRect(0,sy(vis),w,sy(-vis)-sy(vis)); x.fillStyle='rgba(95,211,154,.15)'; x.fillRect(0,sy(ip),w,Math.max(1,sy(-ip)-sy(ip)));
    x.strokeStyle='rgba(255,255,255,.08)'; x.lineWidth=1; for(let lo=-150;lo<=150;lo+=30){ x.beginPath(); x.moveTo(sx(lo),0); x.lineTo(sx(lo),h); x.stroke(); }
    [-60,-30,30,60].forEach(la=>{ x.beginPath(); x.moveTo(0,sy(la)); x.lineTo(w,sy(la)); x.stroke(); lbl(x,(la>0?'+':'−')+Math.abs(la)+'°',4,sy(la)-3,'rgba(255,255,255,.4)','left'); });
    x.strokeStyle='rgba(78,168,255,.6)'; x.beginPath(); x.moveTo(0,sy(0)); x.lineTo(w,sy(0)); x.stroke();
    x.setLineDash([5,4]); x.strokeStyle='#5fd39a'; [ip,-ip].forEach(la=>{ x.beginPath(); x.moveTo(0,sy(la)); x.lineTo(w,sy(la)); x.stroke(); }); if(vis<90){ x.strokeStyle='rgba(255,198,92,.6)'; [vis,-vis].forEach(la=>{ x.beginPath(); x.moveTo(0,sy(la)); x.lineTo(w,sy(la)); x.stroke(); }); } x.setLineDash([]);
    const n=TAU/o.T, span=3*o.T, N=900, gp=t=>{ const u=OM+nuOf((n*t)%TAU,o.e), la=Math.asin(Math.sin(o.ir)*Math.sin(u))/D2R; let lo=(Math.atan2(Math.cos(o.ir)*Math.sin(u),Math.cos(u))+o.Or-WE*t)/D2R; lo=((lo+180)%360+360)%360-180; return [lo,la]; };
    x.strokeStyle='#ffc65c'; x.lineWidth=1.8; x.beginPath(); let pl=null; for(let k=0;k<=N;k++){ const [lo,la]=gp(span*k/N); if(pl===null||Math.abs(lo-pl)>180) x.moveTo(sx(lo),sy(la)); else x.lineTo(sx(lo),sy(la)); pl=lo; } x.stroke();
    const tx=sx(69.24), ty=sy(41.3); dot(x,tx,ty,4,'#ff7a6b'); lbl(x,T(TX.tashS),tx+7,ty-6,'#ff7a6b','left');
    const [slo,sla]=gp(ma/n); x.fillStyle='rgba(255,255,255,.25)'; x.beginPath(); x.arc(sx(slo),sy(sla),9,0,TAU); x.fill(); dot(x,sx(slo),sy(sla),4.5,'#fff');
    if(ip>2) lbl(x,'±'+fmtN(ip,1)+'°',w-6,sy(ip)-4,'#5fd39a','right'); });
  const setG=()=>{ const o=st(), ip=o.i<=90?o.i:180-o.i, vis=Math.min(90,ip+Math.acos(RE/o.ra)/D2R);
    $('#t35GKv').innerHTML=kv(T(TX.band),'|φ| ≤ '+fmtN(ip,1)+'°')+kv(T(TX.vis),'|φ| ≤ '+fmtN(vis,1)+'°')+kv(T(TX.rpd),fmtN(86400/o.T,2))+kv(T(TX.tash),T(41.3<=ip?TX.tOver:41.3<=vis?TX.tHor:TX.tNo)); };

  /* 03 · Atmosfera qarshiligi */
  const dp=()=>{ const hh=+$('#t35H').value, c=+$('#t35C').value, S=10**+$('#t35S').value, m=10**+$('#t35M').value; return {hh,c,S,m,B:c*S/m}; };
  const drawF=K.draw(function(){ const cv=$('#t35F'); const {x,w,h}=fit(cv,.42,260), c=C(), p=dp(), pl=50, pr=12, pt=12, pb=28, Y0=-11, Y1=1;
    const acc=hh=>{ const v=Math.sqrt(KE/(RE+hh))*1e3; return p.B*rho(hh)*v*v/2; };
    const sx=hh=>pl+(hh-100)/900*(w-pl-pr), sy=a=>pt+(1-(Math.min(Y1,Math.max(Y0,Math.log10(a)))-Y0)/(Y1-Y0))*(h-pt-pb);
    x.fillStyle='rgba(224,96,79,.16)'; x.fillRect(sx(100),pt,sx(120)-sx(100),h-pt-pb);
    for(let e=Y0;e<=Y1;e+=2){ const yy=sy(10**e); x.strokeStyle=c.brd; x.lineWidth=1; x.beginPath(); x.moveTo(pl,yy); x.lineTo(w-pr,yy); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(pw(e),pl-4,yy+3); }
    for(let hh=100;hh<=1000;hh+=w<480?300:100) lbl(x,String(hh),sx(hh),h-12,c.dim); lbl(x,'km',w-pr,h-2,c.dim,'right'); lbl(x,'m/s²',pl+4,pt+10,c.dim,'left');
    x.strokeStyle=c.neon; x.lineWidth=2.2; x.beginPath(); for(let hh=100;hh<=1000;hh+=5){ hh===100?x.moveTo(sx(hh),sy(acc(hh))):x.lineTo(sx(hh),sy(acc(hh))); } x.stroke();
    dot(x,sx(p.hh),sy(acc(p.hh)),5.5,c.gold);
    const v=Math.sqrt(KE/(RE+p.hh)), r=rho(p.hh), F=p.c*p.S*r*(v*1e3)**2/2; let life=0; for(let hh=p.hh;hh>120;hh-=1) life+=1000/(p.B*rho(hh)*Math.sqrt(3.986e14*(RE+hh)*1e3));
    $('#t35HV').textContent=fmtN(p.hh)+' km'; $('#t35CV').textContent=fmtN(p.c,2); $('#t35SV').textContent=fmtN(p.S,p.S<10?1:0)+' m²'; $('#t35MV').textContent=fmtN(p.m)+' kg';
    $('#t35FKv').innerHTML=kv(T(TX.rh),sci(r)+' kg/m³')+kv(T(TX.vv),fmtN(v,2)+' km/s')+kv(T(TX.FF),sci(F)+' N')+kv(T(TX.aa),sci(F/p.m)+' m/s²')+kv('S / m',fmtN(p.S/p.m,4)+' m²/kg')+kv(T(TX.life),p.hh<=120?T(TX.low):dur(life),true); });
  ['#t35H','#t35C','#t35S','#t35M'].forEach(id=>$(id).oninput=()=>{ mark('ob',''); drawF(); });
  on('ob',v=>{ const p={kon:[1000,4],st:[1500,25],iss:[420000,1500]}[v]; $('#t35M').value=Math.log10(p[0]); $('#t35S').value=Math.log10(p[1]); $('#t35C').value=2.2; mark('ob',v); drawF(); }); mark('ob','kon');

  /* 04 · Orbitaning so'nishi */
  const KK=4.7e-6; let sim;
  const reset=()=>{ const rp=RE+180, ra=RE+3000, a=(rp+ra)/2; sim={x:rp,y:0,vx:0,vy:Math.sqrt(KE*(2/rp-1/a)),tr:[[rp,0]],rev:0,pa:0,done:false,k:0,wait:0}; };
  const osc=()=>{ const r=Math.hypot(sim.x,sim.y), En=(sim.vx**2+sim.vy**2)/2-KE/r, a=-KE/(2*En), hm2=sim.x*sim.vy-sim.y*sim.vx, e=Math.sqrt(Math.max(0,1+2*En*hm2*hm2/KE/KE)); return En<0?[a*(1-e)-RE,a*(1+e)-RE]:[r-RE,r-RE]; };
  const stepSim=dtR=>{ if(sim.done){ sim.wait+=dtR; if(sim.wait>3) reset(); return; } const mult=+$('#t35X').value; let rem=dtR*2400;
    while(rem>0){ const dt=Math.min(5,rem); rem-=dt; const r=Math.hypot(sim.x,sim.y), hh=r-RE; if(hh<=0){ sim.done=true; break; }
      const g=-KE/r**3, kd=KK*mult*Math.exp(-(hh-180)/40)*Math.hypot(sim.vx,sim.vy);
      sim.vx+=(g*sim.x-kd*sim.vx)*dt; sim.vy+=(g*sim.y-kd*sim.vy)*dt; sim.x+=sim.vx*dt; sim.y+=sim.vy*dt;
      const an=Math.atan2(sim.y,sim.x); if(sim.pa<0&&an>=0) sim.rev++; sim.pa=an; if(++sim.k%3===0){ sim.tr.push([sim.x,sim.y]); if(sim.tr.length>9000) sim.tr.splice(0,1000); } } };
  const drawD=K.draw(function(){ const cv=$('#t35D'); const {x,w,h}=fit(cv,.62,400);
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const s=Math.min(w,h)*.47/(RE+3100), cx=w/2, cy=h/2, ER=RE*s;
    const ga=x.createRadialGradient(cx,cy,ER,cx,cy,(RE+400)*s); ga.addColorStop(0,'rgba(120,190,255,.55)'); ga.addColorStop(1,'rgba(120,190,255,0)'); x.fillStyle=ga; x.beginPath(); x.arc(cx,cy,(RE+400)*s,0,TAU); x.fill();
    const g=x.createRadialGradient(cx-ER*.35,cy-ER*.35,0,cx,cy,ER); g.addColorStop(0,'#6fb0ff'); g.addColorStop(1,'#16336a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,ER,0,TAU); x.fill();
    x.setLineDash([3,4]); x.strokeStyle='rgba(224,96,79,.75)'; x.lineWidth=1; x.beginPath(); x.arc(cx,cy,(RE+120)*s,0,TAU); x.stroke(); x.setLineDash([]); lbl(x,'120 km',cx,cy-(RE+120)*s-6,'#e0604f');
    x.strokeStyle='#ffc65c'; x.lineWidth=1.3; x.beginPath(); sim.tr.forEach((q,k)=>k?x.lineTo(cx+q[0]*s,cy-q[1]*s):x.moveTo(cx+q[0]*s,cy-q[1]*s)); x.lineTo(cx+sim.x*s,cy-sim.y*s); x.stroke();
    if(sim.done){ x.fillStyle='rgba(255,122,60,.5)'; x.beginPath(); x.arc(cx+sim.x*s,cy-sim.y*s,10,0,TAU); x.fill(); dot(x,cx+sim.x*s,cy-sim.y*s,4,'#ff7a3c'); } else dot(x,cx+sim.x*s,cy-sim.y*s,4.5,'#fff');
    lbl(x,T(TX.note),10,h-10,'rgba(255,255,255,.45)','left'); });
  const setD=()=>{ const [hp,ha]=osc(); $('#t35XV').textContent='× '+fmtN(+$('#t35X').value,2);
    $('#t35DKv').innerHTML=kv('h_p',fmtN(Math.max(0,hp))+' km')+kv('h_a',fmtN(Math.max(0,ha))+' km')+kv(T(TX.revs),String(sim.rev))+kv(T(TX.st),T(sim.done?TX.sFall:ha-hp<150?TX.sLow:TX.sOrb)); };
  on('rs',()=>{ reset(); setD(); }); $('#t35X').oninput=setD;
  reset(); setO(); setD();

  let last=performance.now(), fr=0;
  const loop=n=>{ const dt=Math.min(.05,Math.max(0,(n-last)/1000)); last=n; ma=(ma+dt*TAU/7)%TAU; stepSim(dt); drawO(); drawG(); drawD(); if(++fr%6===0) setD(); K.rafs.o=requestAnimationFrame(loop); };
  K.rafs.o=requestAnimationFrame(loop);

  K.bindQA(); K.quiz($('#t35Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t35', GL, QZ, ico:'🛰️', title:TX.title, sub:TX.sub, build });
}; go0();
})();
