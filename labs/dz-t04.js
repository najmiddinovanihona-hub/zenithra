/* DARSLIK · 4-mavzu (9–12-§). Olam qutbining balandligi va kenglik. Turli kengliklarda sutkalik aylanish.
   Kulminatsiya. Kenglikni astronomik aniqlash */
(function(){
const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const TX={
  title:X('Olam qutbining balandligi va geografik kenglik. Kulminatsiya','Высота полюса мира и широта. Кульминация','Height of the celestial pole and latitude. Culmination'),
  sub:X('9–12-§ · hₚ = φ, turli kengliklarda osmon aylanishi, kulminatsiya balandliklari, kenglikni aniqlash','§9–12 · hₚ = φ, вращение неба на разных широтах, высоты кульминаций, определение широты','§9–12 · hₚ = φ, the sky at different latitudes, culmination heights, finding your latitude'),
  intro:X('Yer sharining istalgan nuqtasidan kuzatilganda <b>olam qutbining matematik gorizontdan balandligi hₚ shu joyning geografik kenglamasi φ ga teng</b>: hₚ = φ. Shu sababli osmonning sutkalik aylanishi ekvatorda, qutbda va o‘rta kengliklarda butunlay turlicha ko‘rinadi.',
    'Из любой точки Земли <b>высота полюса мира над математическим горизонтом hₚ равна географической широте места φ</b>: hₚ = φ. Поэтому суточное вращение неба выглядит совершенно по-разному на экваторе, на полюсе и в средних широтах.',
    'From anywhere on Earth, <b>the height of the celestial pole above the horizon hₚ equals the latitude φ</b>: hₚ = φ. That is why the daily turning of the sky looks completely different at the equator, at the poles and in between.'),
  s1:X('Isbot: hₚ = φ','Доказательство: hₚ = φ','Proof: hₚ = φ'),
  p1:X('Meridian bo‘ylab zenitdan ekvator tekisligigacha yoy ZQ kuzatuvchi kenglamasi bilan bir xil: ∠QOZ = φ.','Дуга ZQ по меридиану от зенита до плоскости экватора равна широте наблюдателя: ∠QOZ = φ.','The meridian arc ZQ from the zenith to the equator plane equals the observer’s latitude: ∠QOZ = φ.'),
  p2:X('∠NOP va ∠QOZ ning mos tomonlari o‘zaro perpendikular: ON ⟂ OZ va OP ⟂ OQ.','У углов ∠NOP и ∠QOZ соответствующие стороны взаимно перпендикулярны: ON ⟂ OZ и OP ⟂ OQ.','The sides of ∠NOP and ∠QOZ are pairwise perpendicular: ON ⟂ OZ and OP ⟂ OQ.'),
  p3:X('Mos tomonlari perpendikular burchaklar teng: ∠NOP = ∠QOZ. Lekin ∠NOP = hₚ, ∠QOZ = φ — demak, <b>hₚ = φ</b>.','Углы с перпендикулярными сторонами равны: ∠NOP = ∠QOZ. Но ∠NOP = hₚ, ∠QOZ = φ — значит, <b>hₚ = φ</b>.','Angles with perpendicular sides are equal: ∠NOP = ∠QOZ. But ∠NOP = hₚ and ∠QOZ = φ, so <b>hₚ = φ</b>.'),
  lat:X('Kenglik φ','Широта φ','Latitude φ'), hor:X('Gorizont','Горизонт','Horizon'), eqp:X('Ekvator tekisligi','Плоскость экватора','Equator plane'), earth:X('Yer','Земля','Earth'),
  s2:X('Turli kengliklarda osmonning sutkalik aylanishi','Суточное вращение неба на разных широтах','The daily sky at different latitudes'),
  s2D:X('Sutkalik parallellarning gorizont ustidagi qismi yorqin, ostidagisi xira. Sariq — botmaydigan, ko‘k — chiqib-botadigan, qizil — chiqmaydigan yoritgichlar. To‘q sariq chiziq — tanlangan kundagi Quyosh yo‘li.','Части суточных параллелей над горизонтом — яркие, под ним — тусклые. Жёлтые — незаходящие, голубые — восходящие и заходящие, красные — невосходящие светила. Оранжевая линия — путь Солнца в выбранный день.','Diurnal circles are bright above the horizon and faint below. Yellow: never set; blue: rise and set; red: never rise. The orange line is the Sun’s path on the chosen day.'),
  eqC:X('Ekvator','Экватор','Equator'), tash:X('Toshkent','Ташкент','Tashkent'), arc:X('Qutb doirasi','Полярный круг','Arctic Circle'), pole:X('Qutb','Полюс','Pole'),
  c1T:X('1-hol · Ekvator (φ = 0°)','Случай 1 · Экватор (φ = 0°)','Case 1 · Equator (φ = 0°)'),
  c1:X('Olam qutblari gorizontda yotadi, olam o‘qi tush chizig‘i bo‘ylab yo‘naladi, ekvator zenit va nadirdan o‘tadi. Barcha sutkalik parallellar gorizontga tik va u bilan teng ikkiga bo‘linadi: hamma yoritgichlar chiqadi va botadi, gorizont ustida va ostida teng vaqt bo‘ladi. Meridiandagi balandlik h = 90° − |δ|. Yil bo‘yi kunduz tunga teng; 21-mart va 23-sentabrda tushda Quyosh zenitdan o‘tadi.',
    'Полюсы мира лежат на горизонте, ось мира направлена по полуденной линии, экватор проходит через зенит и надир. Все суточные параллели перпендикулярны горизонту и делятся им пополам: все светила восходят и заходят, проводя над и под горизонтом равное время. Высота в меридиане h = 90° − |δ|. Круглый год день равен ночи; 21 марта и 23 сентября в полдень Солнце проходит через зенит.',
    'The celestial poles lie on the horizon, the axis runs along the noon line, and the equator passes through the zenith and nadir. Every diurnal circle stands perpendicular to the horizon and is cut in half: every star rises and sets, spending equal time above and below. Meridian height h = 90° − |δ|. Day equals night all year; on Mar 21 and Sep 23 the noon Sun passes the zenith.'),
  c2T:X('2-hol · Qutb (φ = 90°)','Случай 2 · Полюс (φ = 90°)','Case 2 · Pole (φ = 90°)'),
  c2:X('Olam qutbi zenit bilan, olam o‘qi vertikal bilan, ekvator gorizont bilan ustma-ust tushadi. Shimoliy yarimshar yulduzlari gorizontga parallel aylanadi va botmaydi, balandligi δ ga teng; janubiy yarimshar yulduzlari chiqmaydi. Quyosh 21-martda chiqib, spiral bo‘ylab har kuni chorak gradusga ko‘tariladi, 22-iyunda 23°26′ ga yetadi va 23-sentabrda botadi.',
    'Полюс мира совпадает с зенитом, ось мира — с отвесной линией, экватор — с горизонтом. Звёзды северного полушария движутся параллельно горизонту и не заходят, их высота равна δ; звёзды южного полушария не восходят. Солнце восходит 21 марта, по спирали поднимается каждый день примерно на четверть градуса, 22 июня достигает 23°26′ и заходит 23 сентября.',
    'The pole coincides with the zenith, the axis with the vertical, the equator with the horizon. Northern stars circle parallel to the horizon and never set, at height δ; southern stars never rise. The Sun rises on Mar 21, spirals up about a quarter degree a day, reaches 23°26′ on Jun 22 and sets on Sep 23.'),
  c3T:X('3-hol · O‘rta kengliklar (0° < φ < 90°)','Случай 3 · Средние широты (0° < φ < 90°)','Case 3 · Mid-latitudes (0° < φ < 90°)'),
  c3:X('Sutkalik parallellar gorizont bilan kesishmasligi yoki kesishsa ham teng ikkiga bo‘linmasligi mumkin (ekvator bundan mustasno). Shimoliy yarimshar yoritgichlari gorizont ustida ko‘proq, janubiylari ostida ko‘proq bo‘ladi. <b>δ > 90° − φ</b> bo‘lsa yoritgich botmaydi, <b>|δ| > 90° − φ</b> (janubda) bo‘lsa chiqmaydi. Kenglik 66°34′ dan katta joylarda 22-iyun atrofida Quyosh botmaydi, 22-dekabr atrofida chiqmaydi.',
    'Суточные параллели могут не пересекать горизонт или делиться им неравно (кроме экватора). Светила северного полушария дольше над горизонтом, южного — под ним. При <b>δ > 90° − φ</b> светило не заходит, при <b>|δ| > 90° − φ</b> (на юге) — не восходит. Севернее 66°34′ около 22 июня Солнце не заходит, около 22 декабря — не восходит.',
    'Diurnal circles may miss the horizon or be cut unequally (except the equator). Northern stars stay up longer, southern ones stay down longer. If <b>δ > 90° − φ</b> a star never sets; if <b>|δ| > 90° − φ</b> (south) it never rises. North of 66°34′ the Sun does not set near Jun 22 and does not rise near Dec 22.'),
  circ:X('Botmaydigan','Незаходящие','Never set'), nev:X('Chiqmaydigan','Невосходящие','Never rise'), noon:X('Quyoshning tushdagi balandligi','Высота Солнца в полдень','Sun’s noon height'), dayL:X('Kunduz uzunligi','Долгота дня','Day length'),
  none:X('yo‘q','нет','none'), all:X('hammasi','все','all'),
  s3:X('Yil davomida tushdagi Quyosh balandligi va kunduz uzunligi','Высота Солнца в полдень и долгота дня за год','Noon Sun height and day length through the year'),
  hT:X('Tushdagi balandlik','Высота в полдень','Noon height'), dT:X('Kunduz uzunligi','Долгота дня','Day length'),
  s4:X('Yoritgichlarning kulminatsiyasi','Кульминация светил','Culmination'),
  s4D:X('Yoritgichning sutkalik harakatida osmon meridianini kesib o‘tishi — <b>kulminatsiya</b>. Har sutkada ikki marta bo‘ladi: zenitga yaqini — <b>yuqori (K)</b>, ikkinchisi — <b>quyi (K′)</b> kulminatsiya. Quyoshning yuqori kulminatsiyasi — tush payti, quyisi — yarim kecha.',
    'Пересечение светилом небесного меридиана при суточном движении — <b>кульминация</b>. Бывает дважды в сутки: ближе к зениту — <b>верхняя (K)</b>, другая — <b>нижняя (K′)</b>. Верхняя кульминация Солнца — полдень, нижняя — полночь.',
    'A star crossing the meridian in its daily motion is a <b>culmination</b>. It happens twice a day: the one nearer the zenith is the <b>upper (K)</b>, the other the <b>lower (K′)</b>. The Sun’s upper culmination is noon, its lower one midnight.'),
  dec:X('Og‘ish δ','Склонение δ','Declination δ'), up:X('Yuqori kulminatsiya','Верхняя кульминация','Upper culmination'), lo:X('Quyi kulminatsiya','Нижняя кульминация','Lower culmination'), stt:X('Holati','Состояние','Status'),
  sNever:X('botmaydi','не заходит','never sets'), sNo:X('chiqmaydi','не восходит','never rises'), sRS:X('chiqadi va botadi','восходит и заходит','rises and sets'),
  nZ:X('zenitdan shimolda','к северу от зенита','north of zenith'),
  sunJ:X('Quyosh 22-iyun','Солнце 22 июня','Sun Jun 22'), sunD:X('Quyosh 22-dekabr','Солнце 22 декабря','Sun Dec 22'), pol:X('Qutb yulduzi','Полярная','Polaris'),
  s5:X('Joyning kenglamasini astronomik aniqlash','Определение широты по наблюдениям','Finding latitude from the sky'),
  m1T:X('1-usul · Qutb yulduzi bo‘yicha','Способ 1 · По Полярной','Method 1 · From Polaris'),
  m1D:X('Qutb yulduzi olam qutbidan 1° dan kam uzoqlikda. hₚ = φ bo‘lgani uchun uning gorizontdan balandligini o‘lchash kifoya. Toshkentda bu ≈ 41°20′.','Полярная звезда отстоит от полюса мира меньше чем на 1°. Так как hₚ = φ, достаточно измерить её высоту. В Ташкенте ≈ 41°20′.','Polaris is less than 1° from the pole. Since hₚ = φ, just measure its height. In Tashkent it is ≈ 41°20′.'),
  m2T:X('2-usul · Quyoshning tushdagi balandligi bo‘yicha','Способ 2 · По полуденной высоте Солнца','Method 2 · From the noon Sun'),
  m2D:X('Tushda Quyosh balandligi h☉ o‘lchanadi va shu kundagi og‘ishi δ☉ olinadi: h☉ = 90° − φ + δ☉, bundan φ = 90° − h☉ + δ☉.','В полдень измеряют высоту Солнца h☉ и берут его склонение δ☉ на этот день: h☉ = 90° − φ + δ☉, откуда φ = 90° − h☉ + δ☉.','Measure the Sun’s noon height h☉ and take its declination δ☉ for the day: h☉ = 90° − φ + δ☉, so φ = 90° − h☉ + δ☉.'),
  hp:X('Qutb yulduzi balandligi','Высота Полярной','Height of Polaris'), hs:X('Tushdagi balandlik h☉','Высота в полдень h☉','Noon height h☉'), res:X('Kenglik','Широта','Latitude'), near:X('Shu kenglikda','На этой широте','At this latitude')
};
const GL=[
 [X('Olam qutbining balandligi hₚ','Высота полюса мира hₚ','Pole height hₚ'),X('Olam qutbining matematik gorizontdan balandligi; joyning kenglamasiga teng: hₚ = φ.','Высота полюса мира над горизонтом; равна широте: hₚ = φ.','The pole’s height above the horizon; equals the latitude: hₚ = φ.')],
 [X('Kulminatsiya','Кульминация','Culmination'),X('Yoritgichning sutkalik harakatda osmon meridianini kesib o‘tishi; sutkada ikki marta.','Пересечение светилом небесного меридиана; дважды в сутки.','A star crossing the meridian; twice a day.')],
 [X('Yuqori kulminatsiya','Верхняя кульминация','Upper culmination'),X('Zenitga yaqin kulminatsiya: h = 90° − φ + δ.','Кульминация ближе к зениту: h = 90° − φ + δ.','The one nearer the zenith: h = 90° − φ + δ.')],
 [X('Quyi kulminatsiya','Нижняя кульминация','Lower culmination'),X('Ikkinchi kulminatsiya: h = φ + δ − 90°.','Вторая кульминация: h = φ + δ − 90°.','The other one: h = φ + δ − 90°.')],
 [X('Botmaydigan yoritgich','Незаходящее светило','Circumpolar star'),X('Sutkalik paralleli gorizontdan to‘liq yuqorida: δ > 90° − φ.','Суточная параллель целиком над горизонтом: δ > 90° − φ.','Its diurnal circle lies wholly above the horizon: δ > 90° − φ.')],
 [X('Chiqmaydigan yoritgich','Невосходящее светило','Never-rising star'),X('Sutkalik paralleli gorizontdan to‘liq pastda: |δ| > 90° − φ (janubiy yarimsharda).','Суточная параллель целиком под горизонтом: |δ| > 90° − φ (на юге).','Its diurnal circle lies wholly below: |δ| > 90° − φ (southern sky).')],
 [X('Qutb doirasi','Полярный круг','Polar circle'),X('Kenglik 66°34′; undan shimolda yozda Quyosh botmaydigan, qishda chiqmaydigan kunlar bo‘ladi.','Широта 66°34′; севернее летом бывают дни без заката, зимой — без восхода.','Latitude 66°34′; beyond it there are summer days with no sunset and winter days with no sunrise.')]
];
const QA=[
 [X('Olam qutbining balandligi va joyning kengligi orasida qanday bog‘lanish bor?','Какова связь между высотой полюса мира и широтой?','How are the pole’s height and latitude related?'),X('Ular teng: hₚ = φ. Isbot — mos tomonlari perpendikular burchaklar tengligidan (∠NOP = ∠QOZ).','Они равны: hₚ = φ. Доказательство — равенство углов с перпендикулярными сторонами (∠NOP = ∠QOZ).','They are equal: hₚ = φ, since angles with perpendicular sides are equal (∠NOP = ∠QOZ).')],
 [X('Kuzatuvchi Yerning ixtiyoriy nuqtasida bo‘lganda osmonning sutkalik aylanishi qanday bo‘ladi? Ekvatorda-chi?','Каково суточное вращение неба в произвольной точке Земли? А на экваторе?','What does the daily sky look like anywhere on Earth? And at the equator?'),X('O‘rta kengliklarda parallellar gorizontga qiya: botmaydigan (δ > 90° − φ), chiqmaydigan va chiqib-botadigan yoritgichlar bor. Ekvatorda parallellar gorizontga tik, hammasi chiqadi va botadi, ustida va ostida teng vaqt bo‘ladi.','В средних широтах параллели наклонны к горизонту: есть незаходящие (δ > 90° − φ), невосходящие и восходящие-заходящие светила. На экваторе параллели перпендикулярны горизонту, все светила восходят и заходят, проводя равное время над и под ним.','At mid-latitudes the circles are tilted: some stars never set (δ > 90° − φ), some never rise, the rest rise and set. At the equator the circles are upright; every star rises and sets, spending equal time above and below.')],
 [X('Turli kenglamalarda yil davomida Quyoshning sutkalik harakati qanday kechadi?','Как идёт суточное движение Солнца в течение года на разных широтах?','How does the Sun’s daily motion change through the year at different latitudes?'),X('Ekvatorda kunduz doim tunga teng, Quyosh tengkunliklarda zenitdan o‘tadi. Qutbda Quyosh yarim yil botmaydi (21-mart – 23-sentabr), yarim yil chiqmaydi. O‘rta kengliklarda 21-martdan 23-sentabrgacha kunduz tundan uzun, qolgan davrda qisqa; 66°34′ dan shimolda qutb kuni va tuni bo‘ladi.','На экваторе день всегда равен ночи, в равноденствия Солнце проходит зенит. На полюсе Солнце полгода не заходит (21 марта – 23 сентября) и полгода не восходит. В средних широтах с 21 марта по 23 сентября день длиннее ночи, затем короче; севернее 66°34′ бывают полярные день и ночь.','At the equator day always equals night and the Sun passes the zenith at the equinoxes. At the pole the Sun stays up for half a year (Mar 21 – Sep 23) and down for the other half. At mid-latitudes days are longer than nights from Mar 21 to Sep 23 and shorter after; beyond 66°34′ there are polar days and nights.')],
 [X('Kenglamani taxminan aniqlashning qanday oddiy metodlari bor?','Какие есть простые способы определить широту?','What simple ways are there to find latitude?'),X('1) Qutb yulduzining gorizontdan balandligini o‘lchash: φ ≈ hₚ. 2) Quyoshning tushdagi balandligini o‘lchab, shu kungi og‘ishi bilan: φ = 90° − h☉ + δ☉.','1) Измерить высоту Полярной: φ ≈ hₚ. 2) Измерить полуденную высоту Солнца и с его склонением: φ = 90° − h☉ + δ☉.','1) Measure the height of Polaris: φ ≈ hₚ. 2) Measure the noon Sun and use its declination: φ = 90° − h☉ + δ☉.')],
 [X('Termizda (φ = 35°) olamning shimoliy qutbi qanday balandlikda bo‘ladi?','На какой высоте полюс мира в Термезе (φ = 35°)?','How high is the pole in Termez (φ = 35°)?'),X('hₚ = φ = 35°.','hₚ = φ = 35°.','hₚ = φ = 35°.')],
 [X('Kulminatsiya deb qanday hodisaga aytiladi va u necha xil bo‘ladi?','Что называется кульминацией и какой она бывает?','What is a culmination and what kinds are there?'),X('Yoritgichning osmon meridianini kesib o‘tishi. Ikki xil: yuqori (zenitga yaqin) va quyi kulminatsiya.','Пересечение светилом небесного меридиана. Два вида: верхняя (ближе к зениту) и нижняя.','A star crossing the meridian. Two kinds: upper (nearer the zenith) and lower.')],
 [X('Kulminatsiya balandligi og‘ish va kenglama orqali qanday ifodalanadi?','Как выражаются высоты кульминаций через δ и φ?','How are culmination heights expressed via δ and φ?'),X('Yuqori: hᵧ = 90° − φ + δ. Quyi: h_q = φ + δ − 90°.','Верхняя: h = 90° − φ + δ. Нижняя: h = φ + δ − 90°.','Upper: h = 90° − φ + δ. Lower: h = φ + δ − 90°.')]
];
const QZ=[
 [X('Olam qutbining gorizontdan balandligi nimaga teng?','Чему равна высота полюса мира?','What does the pole’s height equal?'),[X('Joyning geografik kenglamasiga','Географической широте места','The latitude'),X('Joyning uzunlamasiga','Долготе места','The longitude'),X('Har doim 90° ga','Всегда 90°','Always 90°')]],
 [X('Ekvatorda olam qutblari qayerda bo‘ladi?','Где полюсы мира на экваторе?','Where are the poles at the equator?'),[X('Gorizontda','На горизонте','On the horizon'),X('Zenitda','В зените','At the zenith'),X('Gorizontdan 45° balandda','На высоте 45°','45° up')]],
 [X('Qutbda osmon ekvatori nima bilan ustma-ust tushadi?','С чем совпадает экватор на полюсе?','What does the celestial equator coincide with at the pole?'),[X('Matematik gorizont','Математический горизонт','The horizon'),X('Osmon meridiani','Небесный меридиан','The meridian'),X('Ekliptika','Эклиптика','The ecliptic')]],
 [X('O‘rta kengliklarda qaysi shartda yoritgich botmaydi?','При каком условии светило не заходит в средних широтах?','When does a star never set at mid-latitudes?'),[X('δ > 90° − φ','δ > 90° − φ','δ > 90° − φ'),X('δ < φ','δ < φ','δ < φ'),X('δ = 0°','δ = 0°','δ = 0°')]],
 [X('Yuqori kulminatsiya balandligi formulasi:','Формула высоты верхней кульминации:','The upper culmination height is:'),[X('h = 90° − φ + δ','h = 90° − φ + δ','h = 90° − φ + δ'),X('h = φ + δ − 90°','h = φ + δ − 90°','h = φ + δ − 90°'),X('h = φ − δ','h = φ − δ','h = φ − δ')]],
 [X('Quyoshning quyi kulminatsiyasi qachon bo‘ladi?','Когда нижняя кульминация Солнца?','When is the Sun’s lower culmination?'),[X('Yarim kechada','В полночь','At midnight'),X('Tushda','В полдень','At noon'),X('Quyosh chiqqanda','На восходе','At sunrise')]],
 [X('Ekvatorda 22-dekabr kuni tushdagi Quyosh balandligi:','Высота Солнца в полдень 22 декабря на экваторе:','Noon Sun height on the equator on Dec 22:'),[X('66°34′','66°34′','66°34′'),X('90°','90°','90°'),X('23°26′','23°26′','23°26′')]],
 [X('Termizda (φ = 35°) olam qutbining balandligi:','Высота полюса мира в Термезе (φ = 35°):','Pole height in Termez (φ = 35°):'),[X('35°','35°','35°'),X('55°','55°','55°'),X('90°','90°','90°')]]
];

function build(el, api){
  const K=K0.kit(el,api), {T,L,click,$,$$,fmtN,dms,C,fit,sec,chips,mark,on,kv}=K;
  const LC=[[0,TX.eqC],[41.3,TX.tash],[66.56,TX.arc],[90,TX.pole]];
  const latChips=a=>chips(a,LC.map(([v,t])=>[v,T(t)+' '+fmtN(v,1).replace(/[.,]0+$/,'').replace(/([.,]\d)0$/,'$1')+'°']));
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t4Pf"></canvas>
      <label class="t1-ctl"><span>${T(TX.lat)}: <b id="t4PfV"></b></span><input type="range" class="lab-range" id="t4PfL" min="5" max="85" step="0.5" value="41.3"></label></div>
    <div class="t1-side"><ol class="t4-steps"><li>${T(TX.p1)}</li><li>${T(TX.p2)}</li><li>${T(TX.p3)}</li></ol><div class="t1-formula" id="t4PfF"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-split">
    <div class="t1-stage" id="t4Stage"><canvas></canvas><div class="t1-lbls"></div>
      <div class="t1-bar"><button class="lab-chip" id="t4Play">⏸</button><button class="lab-chip on" data-sp="1">1×</button><button class="lab-chip" data-sp="4">4×</button></div><div class="t1-hint">${T(K.U.drag)}</div></div>
    <div class="t1-side">
      <label class="t1-ctl"><span>${T(TX.lat)}: <b id="t4LV"></b></span><input type="range" class="lab-range" id="t4L" min="0" max="90" step="0.5"></label>
      <div class="lab-row" style="margin:0">${latChips('lt')}</div>
      <div class="lab-row" style="margin:0">${chips('dd',K0.KEYD.map(([d,t])=>[d,'☀ '+T(t)]))}</div>
      <div class="lab-kv" id="t4Kv"></div>
      <div class="dz-card t2-def" id="t4Case"></div>
    </div></div>`)}
  ${sec('03',TX.s3,`<div class="dz-card t1-chart"><canvas class="t1-cv" id="t4Yr"></canvas><div class="lab-row"><span class="t4-key"><i style="background:var(--dz-gold)"></i>${T(TX.hT)}</span><span class="t4-key"><i style="background:var(--neon)"></i>${T(TX.dT)}</span><span class="t1-lab" id="t4YrL"></span></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t4Cu"></canvas></div>
    <div class="t1-side">
      <div class="t2-els">${chips('cp',[[89.26,'✦ '+T(TX.pol)],[38.78,'✦ Vega'],[23.44,'☀ '+T(TX.sunJ)],[-23.44,'☀ '+T(TX.sunD)],[-16.72,'✦ Sirius']])}</div>
      <label class="t1-ctl"><span>${T(TX.lat)}: <b id="t4CLV"></b></span><input type="range" class="lab-range" id="t4CL" min="0" max="90" step="0.5" value="41.3"></label>
      <label class="t1-ctl"><span>${T(TX.dec)}: <b id="t4CDV"></b></span><input type="range" class="lab-range" id="t4CD" min="-89" max="89" step="0.5" value="38.78"></label>
      <div class="t1-formula">h<sub>y</sub> = 90° − φ + δ &nbsp;·&nbsp; h<sub>q</sub> = φ + δ − 90°</div>
      <div class="lab-kv" id="t4CKv"></div>
    </div></div>`)}
  ${sec('05',TX.s5,`<div class="t1-two">
    <div class="dz-card t4-m"><h4>${T(TX.m1T)}</h4><p class="t1-p">${T(TX.m1D)}</p>
      <label class="t1-ctl"><span>${T(TX.hp)}: <b id="t4M1V"></b></span><input type="range" class="lab-range" id="t4M1" min="0" max="90" step="0.5" value="41.3"></label><div class="lab-kv" id="t4M1K"></div></div>
    <div class="dz-card t4-m"><h4>${T(TX.m2T)}</h4><p class="t1-p">${T(TX.m2D)}</p>
      <div class="lab-row" style="margin:0">${chips('md',K0.KEYD.map(([d,t])=>[d,T(t)]))}</div>
      <label class="t1-ctl"><span>${T(TX.hs)}: <b id="t4M2V"></b></span><input type="range" class="lab-range" id="t4M2" min="1" max="90" step="0.1" value="72.1"></label><div class="lab-kv" id="t4M2K"></div></div></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t4Quiz"></div>`)}`;

  /* 01 · Isbot chizmasi */
  const drawPf=K.draw(function(){ const cv=$('#t4Pf'); const {x,w,h}=fit(cv,.78,420), c=C(), f=+$('#t4PfL').value*D2R;
    const R=Math.min(h*.3,w*.24), cx=w*.4, cy=h*.56, Ox=cx+R*Math.cos(f), Oy=cy-R*Math.sin(f), Lr=Math.min(w,h)*.42;
    const ln=(a,b,cl,lw,dash)=>{ x.strokeStyle=cl; x.lineWidth=lw||1.4; x.setLineDash(dash||[]); x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.stroke(); x.setLineDash([]); };
    const tx=(s,p,cl,al,b)=>{ x.fillStyle=cl; x.font=(b?'700 ':'600 ')+'12px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,p[0],p[1]); };
    x.fillStyle=c.earth; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.fill(); x.strokeStyle=c.brd; x.lineWidth=1.2; x.stroke();
    ln([cx,cy+R*1.25],[cx,cy-R*1.25],c.dim,1.2,[5,4]); tx('p',[cx+10,cy-R*1.18],c.dim); tx('p′',[cx+10,cy+R*1.22],c.dim);
    ln([cx-R*1.25,cy],[cx+R*1.12,cy],c.dim,1.2,[5,4]); tx('q′',[cx-R*1.2,cy-6],c.dim); tx('q',[cx+R+8,cy+14],c.dim);
    ln([cx,cy],[Ox,Oy],c.text,1.2); x.strokeStyle=c.gold; x.lineWidth=1.6; x.beginPath(); x.arc(cx,cy,R*.32,-f,0); x.stroke(); tx('φ',[cx+R*.42*Math.cos(f/2),cy-R*.42*Math.sin(f/2)+4],c.gold,'center',1);
    const zd=[Math.cos(f),-Math.sin(f)], nd=[-Math.sin(f),-Math.cos(f)];
    const Z=[Ox+zd[0]*Lr*.55,Oy+zd[1]*Lr*.55], N=[Ox+nd[0]*Lr*.75,Oy+nd[1]*Lr*.75], Sx=[Ox-nd[0]*Lr*.45,Oy-nd[1]*Lr*.45], P=[Ox,Oy-Lr*.7], Q=[Ox+Lr*.6,Oy];
    ln(Sx,N,'#3fae7a',2); tx(T(TX.hor),[Sx[0]+6,Sx[1]+16],'#3fae7a','left'); tx('N',[N[0]-8,N[1]-6],'#3fae7a','right',1); tx('S',[Sx[0]+4,Sx[1]-6],'#3fae7a','left',1);
    ln([Ox,Oy],Z,c.text,1.6); tx('Z',[Z[0]+8,Z[1]-4],c.text,'left',1);
    ln([Ox,Oy],P,'#e0604f',2); tx('P',[P[0],P[1]-8],'#e0604f','center',1);
    ln([Ox,Oy],Q,c.neon,2); tx('Q',[Q[0]+10,Q[1]+4],c.neon,'left',1); tx(T(TX.eqp),[Q[0]-4,Q[1]+16],c.neon,'right');
    x.strokeStyle=c.neon2; x.lineWidth=2; x.beginPath(); x.arc(Ox,Oy,34,-Math.PI/2-f,-Math.PI/2); x.stroke(); tx('hₚ',[Ox+46*Math.cos(-Math.PI/2-f/2),Oy+46*Math.sin(-Math.PI/2-f/2)+4],c.neon2,'center',1);
    x.strokeStyle=c.gold; x.beginPath(); x.arc(Ox,Oy,24,-f,0); x.stroke(); tx('φ',[Ox+36*Math.cos(-f/2),Oy+36*Math.sin(-f/2)+4],c.gold,'center',1);
    const sq=(u,v,cl)=>{ const s=10; x.strokeStyle=cl; x.lineWidth=1.2; x.beginPath(); x.moveTo(Ox+u[0]*s,Oy+u[1]*s); x.lineTo(Ox+u[0]*s+v[0]*s,Oy+u[1]*s+v[1]*s); x.lineTo(Ox+v[0]*s,Oy+v[1]*s); x.stroke(); };
    sq(nd,zd,c.dim); sq([0,-1],[1,0],c.dim);
    tx('O',[Ox-10,Oy+14],c.text,'center',1); tx(T(TX.earth),[cx,cy+R*.55],c.dim);
    const v=$('#t4PfL').value; $('#t4PfV').textContent=fmtN(+v,1)+'°'; $('#t4PfF').innerHTML='hₚ = φ = '+fmtN(+v,1)+'°'; });
  $('#t4PfL').oninput=drawPf;

  /* 02 · 3D turli kengliklar */
  let phi=41.3, sday=172, sunObj=null;
  const DEC=[-60,-30,0,30,60];
  const st=K.stage($('#t4Stage'),{ std:{alpha:.85}, build(a){ const {V,RS,FIX,line,dot,label,tube,arcPts,basis}=a, {p,u,w}=basis();
      const par=(d,col,cAbove,cBelow,thick)=>{ const r=RS*Math.cos(d*D2R), cc=p.clone().multiplyScalar(RS*Math.sin(d*D2R)), pts=arcPts(cc,u,w,r,0,TAU,180);
        let run=[pts[0]], up=pts[0].y>=-1e-6; const flush=()=>{ if(run.length>1) FIX.add(thick?tube(run,col,.035,up?1:.3):line(run,col,up?cAbove:cBelow)); };
        for(let i=1;i<pts.length;i++){ const u2=pts[i].y>=-1e-6; if(u2!==up){ run.push(pts[i]); flush(); run=[pts[i]]; up=u2; } else run.push(pts[i]); } flush(); return {cc,r}; };
      const lim=90-phi;
      DEC.forEach(d=>{ const col=d>lim+1e-6?'#ffd36b':(d<-lim-1e-6?'#ff7a6b':'#8fd3ff'); const {cc,r}=par(d,col,.95,.22,false);
        label(FIX,cc.clone().addScaledVector(w,r*1.02),(d>0?'+':d<0?'−':'')+Math.abs(d)+'°',col); });
      const sd=K0.sunDec(sday); const s=par(sd,'#ffb347',1,.3,true); sunObj={cc:s.cc,r:s.r,u,w};
      const sm=dot('#ffd060',.22); FIX.add(sm); sunObj.m=sm; },
    frame(a){ if(sunObj){ const t=st?st.theta():0; sunObj.m.position.copy(sunObj.cc).addScaledVector(sunObj.u,sunObj.r*Math.cos(t)).addScaledVector(sunObj.w,sunObj.r*Math.sin(t)); } } });
  function info(){ const lim=90-phi, sd=K0.sunDec(sday), hn=90-Math.abs(phi-sd), dl=K0.dayLen(phi,sd), dh=Math.floor(dl), dm=Math.round((dl-dh)*60);
    $('#t4LV').textContent=fmtN(phi,1)+'°'; mark('lt',phi); mark('dd',sday);
    $('#t4Kv').innerHTML=kv(T(TX.circ),phi<.5?T(TX.none):(phi>89.5?'δ > 0°':'δ > '+fmtN(lim,1)+'°'))+kv(T(TX.nev),phi<.5?T(TX.none):(phi>89.5?'δ < 0°':'δ < −'+fmtN(lim,1)+'°'))
      +kv(T(TX.noon),hn>0?fmtN(hn,1)+'°':'—')+kv(T(TX.dayL),(dm===60?dh+1:dh)+' '+T(K.U.h)+' '+String(dm===60?0:dm).padStart(2,'0')+'′');
    const cs=phi<.5?['c1T','c1']:(phi>89.5?['c2T','c2']:['c3T','c3']); $('#t4Case').innerHTML=`<h4>${T(TX[cs[0]])}</h4><p class="t1-p">${T(TX[cs[1]])}</p>`; }
  const setPhi=f=>{ phi=Math.max(0,Math.min(90,+f)); $('#t4L').value=phi; st.setLat(phi); info(); drawYr(); };
  $('#t4L').oninput=e=>setPhi(e.target.value); on('lt',v=>setPhi(v)); on('dd',v=>{ sday=+v; st.rebuild(); info(); drawYr(); });
  let pl=true; $('#t4Play').onclick=()=>{ pl=!pl; st.play(pl); $('#t4Play').textContent=pl?'⏸':'▶'; click(700); };
  on('sp',v=>{ mark('sp',v); st.speed(+v); });

  /* 03 · Yil davomida */
  const drawYr=K.draw(function(){ const cv=$('#t4Yr'); const {x,w,h}=fit(cv,.42,340), c=C();
    const pl=40, pr=40, pt=14, pb=26, X0=d=>pl+d/364*(w-pl-pr), YA=v=>pt+(90-v)/120*(h-pt-pb), YD=v=>pt+(24-v)/24*(h-pt-pb);
    x.font='10.5px system-ui,sans-serif'; x.lineWidth=1; x.strokeStyle=c.brd;
    [90,60,30,0,-30].forEach(v=>{ x.beginPath(); x.moveTo(pl,YA(v)); x.lineTo(w-pr,YA(v)); x.stroke(); x.fillStyle=c.gold; x.textAlign='right'; x.fillText((v<0?'−':'')+Math.abs(v)+'°',pl-5,YA(v)+3.5); });
    [0,6,12,18,24].forEach(v=>{ x.fillStyle=c.neon; x.textAlign='left'; x.fillText(v+T(K.U.h).slice(0,1),w-pr+5,YD(v)+3.5); });
    x.fillStyle=c.dim; x.textAlign='center'; for(let m=0;m<12;m++){ const d=(Date.UTC(2026,m,15)-Date.UTC(2026,0,1))/86400000; x.fillText(K0.MONS[L][m],X0(d),h-8); }
    x.strokeStyle=c.dim; x.setLineDash([3,4]); x.beginPath(); x.moveTo(pl,YA(0)); x.lineTo(w-pr,YA(0)); x.stroke(); x.setLineDash([]);
    const A=[], Dl=[]; for(let d=0;d<=364;d++){ const sd=K0.sunDec(d); A.push(90-Math.abs(phi-sd)); Dl.push(K0.dayLen(phi,sd)); }
    x.lineWidth=2.2; x.strokeStyle=c.gold; x.beginPath(); A.forEach((v,i)=>i?x.lineTo(X0(i),YA(Math.max(-30,v))):x.moveTo(X0(i),YA(Math.max(-30,v)))); x.stroke();
    x.strokeStyle=c.neon; x.beginPath(); Dl.forEach((v,i)=>i?x.lineTo(X0(i),YD(v)):x.moveTo(X0(i),YD(v))); x.stroke();
    K0.KEYD.forEach(([d])=>{ x.fillStyle=c.chart; x.strokeStyle=c.text; x.lineWidth=1.2; x.beginPath(); x.arc(X0(d),YA(Math.max(-30,A[d])),4,0,TAU); x.fill(); x.stroke(); });
    x.strokeStyle=c.neon2; x.lineWidth=1; x.beginPath(); x.moveTo(X0(sday),pt); x.lineTo(X0(sday),h-pb); x.stroke();
    $('#t4YrL').textContent='φ = '+fmtN(phi,1)+'°'; });

  /* 04 · Kulminatsiya */
  const drawCu=K.draw(function(){ const cv=$('#t4Cu'); const {x,w,h}=fit(cv,.8,420), c=C(), f=+$('#t4CL').value, d=+$('#t4CD').value, fr=f*D2R, dr=d*D2R;
    const R=Math.min(w*.36,h*.4), cx=w/2, cy=h*.54;
    x.fillStyle=c.day?'rgba(60,120,80,.12)':'rgba(40,110,70,.18)'; x.beginPath(); x.arc(cx,cy,R,0,Math.PI); x.fill();
    x.strokeStyle=c.brd; x.lineWidth=1.4; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.stroke();
    const ln=(a,b,cl,lw,dash)=>{ x.strokeStyle=cl; x.lineWidth=lw||1.4; x.setLineDash(dash||[]); x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.stroke(); x.setLineDash([]); };
    const tx=(s,p,cl,al)=>{ x.fillStyle=cl; x.font='700 12px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,p[0],p[1]); };
    ln([cx-R*1.1,cy],[cx+R*1.1,cy],'#3fae7a',2); tx('S',[cx-R-14,cy+4],'#3fae7a','right'); tx('N',[cx+R+14,cy+4],'#3fae7a','left');
    ln([cx,cy],[cx,cy-R],c.dim,1,[3,4]); tx('Z',[cx,cy-R-8],c.text);
    const ax=[Math.cos(fr),-Math.sin(fr)], eq=[-Math.sin(fr),-Math.cos(fr)];
    ln([cx-ax[0]*R,cy-ax[1]*R],[cx+ax[0]*R,cy+ax[1]*R],'#e0604f',1.6); tx('P',[cx+ax[0]*(R+14),cy+ax[1]*(R+14)+4],'#e0604f');
    ln([cx-eq[0]*R,cy-eq[1]*R],[cx+eq[0]*R,cy+eq[1]*R],c.neon,1.4,[6,4]); tx('Q',[cx+eq[0]*(R+14),cy+eq[1]*(R+14)+4],c.neon);
    const cc=[cx+ax[0]*R*Math.sin(dr),cy+ax[1]*R*Math.sin(dr)], Kp=[cc[0]+eq[0]*R*Math.cos(dr),cc[1]+eq[1]*R*Math.cos(dr)], Kq=[cc[0]-eq[0]*R*Math.cos(dr),cc[1]-eq[1]*R*Math.cos(dr)];
    const yK=Kp[1], yQ=Kq[1];
    if((yK-cy)*(yQ-cy)<0){ const t=(cy-yK)/(yQ-yK), I=[Kp[0]+(Kq[0]-Kp[0])*t,cy]; ln(Kp,I,c.gold,2.6); ln(I,Kq,c.gold,1.2,[4,4]); }
    else if(yK<=cy&&yQ<=cy) ln(Kp,Kq,c.gold,2.6); else ln(Kp,Kq,c.gold,1.2,[4,4]);
    const aK=Math.atan2(Kp[1]-cy,Kp[0]-cx), aQ=Math.atan2(Kq[1]-cy,Kq[0]-cx);
    x.lineWidth=3; x.strokeStyle=c.neon2; x.beginPath(); { let a0=Math.PI, a1=aK<0?aK+TAU:aK; if(a1<a0) a1+=TAU; x.arc(cx,cy,R+5,a0,a1); } x.stroke();
    x.strokeStyle='#33b394'; x.beginPath(); { const a=aQ; if(a<=0) x.arc(cx,cy,R+9,a,0); else x.arc(cx,cy,R+9,0,a); } x.stroke();
    x.fillStyle=c.text; [Kp,Kq].forEach((q,i)=>{ x.beginPath(); x.arc(q[0],q[1],5.5,0,TAU); x.fill(); });
    tx('K',[Kp[0]+eq[0]*16,Kp[1]+eq[1]*16+4],c.text); tx('K′',[Kq[0]-eq[0]*16,Kq[1]-eq[1]*16+4],c.text);
    const hy=90-f+d, hq=f+d-90, st2=hq>0?TX.sNever:(hy<0?TX.sNo:TX.sRS);
    $('#t4CLV').textContent=fmtN(f,1)+'°'; $('#t4CDV').textContent=dms(d); mark('cp',d);
    $('#t4CKv').innerHTML=kv('<i class="t1-sw" style="background:'+c.neon2+'"></i>'+T(TX.up),dms(hy,false).replace('+','')+(hy>90?' · '+dms(180-hy,false)+' '+T(TX.nZ):''))+kv('<i class="t1-sw" style="background:#33b394"></i>'+T(TX.lo),dms(hq))+kv(T(TX.stt),T(st2),true); });
  ['#t4CL','#t4CD'].forEach(s=>$(s).oninput=drawCu); on('cp',v=>{ $('#t4CD').value=v; drawCu(); });

  /* 05 · Kenglikni aniqlash */
  const cities=(window.LAB&&window.LAB.CITIES)||[];
  const nearC=f=>{ if(!cities.length) return '—'; const s=cities.slice().sort((a,b)=>Math.abs(a.lat-f)-Math.abs(b.lat-f)).slice(0,2); return s.map(c=>T(c.n)+' ('+fmtN(c.lat,1)+'°)').join(', '); };
  function m1(){ const v=+$('#t4M1').value; $('#t4M1V').textContent=fmtN(v,1)+'°'; $('#t4M1K').innerHTML=kv(T(TX.res)+' φ ≈ hₚ',dms(v,false))+kv(T(TX.near),nearC(v)); }
  let mday=172; function m2(){ const hs=+$('#t4M2').value, sd=K0.sunDec(mday), f=90-hs+sd; mark('md',mday); $('#t4M2V').textContent=fmtN(hs,1)+'°';
    $('#t4M2K').innerHTML=kv('δ☉',dms(sd))+kv(T(TX.res)+' φ = 90° − h☉ + δ☉',Math.abs(f)<=90?dms(f):'—')+kv(T(TX.near),Math.abs(f)<=90?nearC(f):'—',true); }
  $('#t4M1').oninput=m1; $('#t4M2').oninput=m2; on('md',v=>{ mday=+v; m2(); }); m1(); m2();

  K.bindQA(); K.quiz($('#t4Quiz'),QZ);
  setPhi(41.3);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK) return setTimeout(add,50); window.DARSLIK.add({ id:'t04', GL, QZ, ico:'📐', title:TX.title, sub:TX.sub, build }); };
add();
})();
