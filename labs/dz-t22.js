/* DARSLIK · 22-mavzu (52–53-§). Qo'shaloq yulduzlar. Yulduzlar massalari */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const BIN=[[X('Sirius A + B','Сириус A + B','Sirius A + B'),20,50.1,2.06,1.02],[X('α Sentavr A + B','α Центавра A + B','α Centauri A + B'),23.4,79.9,1.1,.91],[X('Katta Ayiq ξ','ξ Большой Медведицы','ξ Ursae Majoris'),21,59.9,1.05,.9],[X('Prosion A + B','Процион A + B','Procyon A + B'),15,40.8,1.5,.6]];
const TX={
 title:X('Qo‘shaloq yulduzlar va ularning turlari. Yulduzlar massalarini hisoblash','Двойные звёзды и их типы. Вычисление масс звёзд','Binary stars and their types. Computing stellar masses'),
 sub:X('52–53-§ · Optik va fizik qo‘shaloqlar, vizual, tutiluvchi va spektral qo‘shaloqlar, Keplerning aniqlashtirilgan III qonuni, massa–yorqinlik bog‘lanishi','§52–53 · Оптические и физические двойные, визуальные, затменные и спектральные двойные, уточнённый III закон Кеплера, связь масса–светимость','§52–53 · Optical and physical doubles, visual, eclipsing and spectroscopic binaries, Kepler’s refined third law, the mass–luminosity relation'),
 intro:X('Osmonda yulduzlar yakka-yakka tuyulsa-da, aslida ularning ko‘pchiligi ikkitadan, uchtadan va undan ko‘p bo‘lib, o‘zaro <b>dinamik bog‘langan</b>. Umumiy massa markazi atrofida aylanayotgan qo‘shaloqlarning orbitalari bir tekislikda yotadi va davrlari bir xil. Ammo qo‘shaloq ko‘ringanlarning hammasi qo‘shaloq emas: turli masofada yotib, bir qarash chizig‘i yaqinida bo‘lgani uchungina yaqin tuyuladiganlari — <b>optik qo‘shaloqlar</b>.','Хотя на небе звёзды кажутся одиночными, большинство их на самом деле объединены по две, три и более и <b>динамически связаны</b>. Орбиты двойных, обращающихся вокруг общего центра масс, лежат в одной плоскости, периоды одинаковы. Но не все кажущиеся двойными таковы: звёзды на разных расстояниях, лишь случайно близкие к одному лучу зрения, — <b>оптические двойные</b>.','Stars look single in the sky, yet most come in twos, threes and more, <b>bound by gravity</b>. Binaries orbiting their common centre of mass lie in one plane with equal periods. Not every apparent pair is real, though: stars at different distances that merely line up are <b>optical doubles</b>.'),
 s1:X('Fizik qo‘shaloqlarning turlari','Типы физических двойных','Types of physical binaries'),
 tV:X('Vizual','Визуальные','Visual'), tE:X('Tutiluvchi','Затменные','Eclipsing'), tS:X('Spektral','Спектральные','Spectroscopic'), tO:X('Optik (soxta)','Оптические (ложные)','Optical (false)'),
 dV:X('Quvvatli teleskopda tashkil etuvchilarini bevosita ajratib ko‘rish mumkin.','Компоненты можно непосредственно различить в мощный телескоп.','Components can be split directly in a powerful telescope.'),
 dE:X('Juda yaqin, ajratib bo‘lmaydi; orbita tekisligi qarash chizig‘i bo‘ylab yotgani uchun bir-birini to‘sib, ravshanlik davriy o‘zgaradi (fotometrik metod).','Очень тесные, не разрешаются; плоскость орбиты вдоль луча зрения, звёзды затмевают друг друга, блеск периодически меняется (фотометрический метод).','Too close to split; the orbit is edge-on, so the stars eclipse each other and brightness varies periodically (photometry).'),
 dS:X('Ajratib bo‘lmaydi; ustma-ust tushgan spektrlardagi umumiy chiziqlar bir-biriga nisbatan davriy siljiydi (spektral metod).','Не разрешаются; общие линии наложенных спектров периодически смещаются друг относительно друга (спектральный метод).','Unresolved; shared lines in the overlapping spectra shift back and forth periodically (spectroscopy).'),
 dO:X('Turli masofadagi, dinamik bog‘lanmagan yulduzlar — faqat bir yo‘nalishda yotadi.','Звёзды на разных расстояниях без динамической связи — лишь в одном направлении.','Unrelated stars at different distances that just lie in the same direction.'),
 s2:X('Vizual qo‘shaloqlar','Визуальные двойные','Visual binaries'),
 s2D:X('Misol — Katta Ayiq «cho‘mich bandi» ning oxiridan ikkinchi yulduzi va uning yonidagi ko‘z zo‘rg‘a ilg‘aydigan yulduzcha: qadimda arablar ularni <b>Mitsar</b> va <b>Alqor</b> («Chavandoz») deb atashgan; orasi atigi <b>11′</b>. Oddiy dala durbinida ko‘p vizual qo‘shaloqlarni ko‘rish mumkin (94-rasm). 95-rasmda Katta Ayiqning <b>ξ</b> yulduzi yo‘ldoshining asosiy yulduzga nisbatan 1822–1955-yillarda kuzatilgan orbitasi ko‘rsatilgan.','Пример — предпоследняя звезда «ручки ковша» Большой Медведицы и едва видимая звёздочка рядом: древние арабы назвали их <b>Мицар</b> и <b>Алькор</b> («Всадник»); расстояние между ними всего <b>11′</b>. В простой бинокль видно много визуальных двойных (рис. 94). На рис. 95 — орбита спутника звезды <b>ξ</b> Большой Медведицы относительно главной по наблюдениям 1822–1955 гг.','An example is the second star from the end of the Big Dipper’s handle and the faint star beside it: the Arabs called them <b>Mizar</b> and <b>Alcor</b> (“the Rider”), just <b>11′</b> apart. Binoculars show many visual doubles (Fig. 94). Fig. 95 shows the orbit of <b>ξ</b> Ursae Majoris’s companion relative to the primary, observed 1822–1955.'),
 bNote:X('Kitobda nomlar teskari: yorug‘ yulduz — Mitsar (2,2ᵐ), uning yonidagi xira yulduzcha — Alqor (4,0ᵐ).','В учебнике названия переставлены: яркая звезда — Мицар (2,2ᵐ), слабая рядом — Алькор (4,0ᵐ).','The book swaps the names: the bright star is Mizar (2.2ᵐ), the faint one beside it is Alcor (4.0ᵐ).'),
 yr:X('Yil','Год','Year'), sep:X('Burchak oralig‘i','Угловое расстояние','Separation'), pa:X('Pozitsion burchak','Позиционный угол','Position angle'),
 s3:X('Tutiluvchi qo‘shaloqlar: Algol','Затменные двойные: Алголь','Eclipsing binaries: Algol'),
 s3D:X('Tipik vakili — qadimda arablar <b>Algul</b> («Devning ko‘zi») deb atagan Persey <b>β</b> si. Orbita tekisligi qarash chizig‘i bo‘ylab yotgani uchun yulduzlar umumiy massa markazi atrofida aylanib bir-birini to‘sadi va ravshanlik davriy (≈3 sutka) o‘zgaradi: 2,3ᵐ dan 3,5ᵐ gacha (96-rasm).','Типичный представитель — <b>β</b> Персея, которую древние арабы назвали <b>Аль-Гуль</b> («глаз демона»). Плоскость орбиты лежит вдоль луча зрения, звёзды при обращении вокруг центра масс затмевают друг друга, блеск периодически (≈3 сут) меняется от 2,3ᵐ до 3,5ᵐ (рис. 96).','The prototype is <b>β</b> Persei, called <b>al-Ghul</b> (“the demon’s eye”) by the Arabs. The orbit is edge-on, so as the stars circle their centre of mass they eclipse each other and the brightness varies every ≈3 days, from 2.3ᵐ to 3.5ᵐ (Fig. 96).'),
 t:X('Vaqt','Время','Time'), dd:X('sutka','сут','d'), mag:X('Yulduz kattaligi','Звёздная величина','Magnitude'), inc:X('Orbita og‘maligi i','Наклон орбиты i','Inclination i'), ecl:X('tutilish','затмение','eclipse'), noecl:X('tutilish yo‘q — qo‘shaloq ko‘rinmaydi','затмений нет — двойственность не видна','no eclipses — binarity hidden'),
 s4:X('Spektral qo‘shaloqlar','Спектральные двойные','Spectroscopic binaries'),
 s4D:X('Qo‘shaloqligi ularning ustma-ust tushgan spektrlaridagi umumiy chiziqlarning bir-biriga nisbatan <b>davriy siljishi</b>dan bilinadi: yo‘ldosh asosiy yulduz atrofida aylanib, bizga yaqinlashganda chiziqlari binafsha, uzoqlashganda qizil tomonga siljiydi (Dopler effekti).','Двойственность обнаруживается по <b>периодическому смещению</b> общих линий наложенных спектров: когда спутник при обращении приближается к нам, его линии смещаются к фиолетовому краю, когда удаляется — к красному (эффект Доплера).','Binarity shows as a <b>periodic shift</b> of shared lines in the overlapping spectra: as the companion approaches us its lines move violet-ward, as it recedes red-ward (Doppler effect).'),
 vel:X('Nuriy tezliklar','Лучевые скорости','Radial velocities'), split:X('Chiziqlar bo‘linishi','Расщепление линий','Line splitting'),
 s5:X('Yulduzlar massalarini hisoblash','Вычисление масс звёзд','Computing stellar masses'),
 s5D:X('Massa — yulduzning eng muhim, ammo eng qiyin aniqlanadigan kattaligi. Yo‘ldoshi bo‘lsa, Keplerning <b>aniqlashtirilgan III qonuni</b> bilan topiladi. Davr T va yo‘ldosh orbitasining katta yarim o‘qi A bo‘yicha: <b>T²(M_a + m_y)/A³ = 4π²/G = 5,9·10¹¹ kg·s²/m³</b>, ya’ni M_a + m_y = 5,9·10¹¹·A³/T² (T — sekundda, A — metrda, M — kg da). Quyosh birliklarida (A — a.b., T — yil): <b>M_a + m_y = A³/T²</b>. Massa markaziga nisbatan katta yarim o‘qlar a_a va a_y alohida o‘lchansa: <b>M_a/m_y = a_y/a_a</b>.','Масса — важнейшая, но труднее всего определяемая характеристика звезды. При наличии спутника её находят по <b>уточнённому III закону Кеплера</b>. По периоду T и большой полуоси A орбиты спутника: <b>T²(M_a + m_y)/A³ = 4π²/G = 5,9·10¹¹ кг·с²/м³</b>, т. е. M_a + m_y = 5,9·10¹¹·A³/T² (T в секундах, A в метрах, M в кг). В солнечных единицах (A в а. е., T в годах): <b>M_a + m_y = A³/T²</b>. Если измерены большие полуоси относительно центра масс a_a и a_y: <b>M_a/m_y = a_y/a_a</b>.','Mass is a star’s most important property and the hardest to measure. With a companion it follows from Kepler’s <b>refined third law</b>. From the period T and the companion’s semi-major axis A: <b>T²(M_a + m_y)/A³ = 4π²/G = 5.9·10¹¹ kg·s²/m³</b>, so M_a + m_y = 5.9·10¹¹·A³/T² (T in s, A in m, M in kg). In solar units (A in AU, T in years): <b>M_a + m_y = A³/T²</b>. If the semi-major axes about the centre of mass a_a and a_y are measured: <b>M_a/m_y = a_y/a_a</b>.'),
 A:X('Katta yarim o‘q A','Большая полуось A','Semi-major axis A'), T:X('Davr T','Период T','Period T'), sum:X('Massalar yig‘indisi','Сумма масс','Total mass'), q:X('Massalar nisbati a_y/a_a','Отношение масс a_y/a_a','Mass ratio a_y/a_a'), Ma:X('Asosiy yulduz','Главная звезда','Primary'), my:X('Yo‘ldosh','Спутник','Companion'), au:X('a.b.','а. е.','AU'), y:X('yil','лет','yr'), ref:X('Ma’lumotnoma','Справочно','Reference'),
 s6:X('Massa–yorqinlik bog‘lanishi','Связь масса–светимость','The mass–luminosity relation'),
 s6D:X('Qo‘shaloqlar bo‘yicha topilgan massalar <b>0,1 M☉ dan 100 M☉ gacha</b>; 10–50 M☉ li yulduzlar kam uchraydi. Yakka yulduzlar massasini bevosita aniqlab bo‘lmaydi, ammo bosh ketma-ketlik yulduzlari uchun yorqinlik va massa orasida empirik bog‘lanish topilgan (97-rasm): bolometrik (to‘la) yorqinlik <b>L_b ≈ M³·⁹</b>. Bundan ko‘rinadiki, bosh ketma-ketlikning tepasida eng massiv yulduzlar, pastga qarab massa kamayadi.','Массы, найденные по двойным, — <b>от 0,1 M☉ до 100 M☉</b>; звёзды 10–50 M☉ сравнительно редки. Массу одиночной звезды прямо найти нельзя, но для звёзд главной последовательности найдена эмпирическая связь светимости и массы (рис. 97): болометрическая (полная) светимость <b>L_b ≈ M³·⁹</b>. Отсюда видно, что вверху главной последовательности — самые массивные звёзды, книзу масса уменьшается.','Masses from binaries span <b>0.1 to 100 M☉</b>; stars of 10–50 M☉ are fairly rare. A single star’s mass cannot be measured directly, but main-sequence stars follow an empirical luminosity–mass relation (Fig. 97): bolometric (total) luminosity <b>L_b ≈ M³·⁹</b>. So the most massive stars sit at the top of the main sequence and mass falls toward the bottom.'),
 mm:X('Massa M/M☉','Масса M/M☉','Mass M/M☉'), LL:X('Yorqinlik L/L☉','Светимость L/L☉','Luminosity L/L☉'), MM:X('Absolut kattalik','Абсолютная величина','Absolute magnitude'), life:X('Taxminiy umr (M/L × 10 mlrd yil)','Примерное время жизни (M/L × 10 млрд лет)','Approx. lifetime (M/L × 10 Gyr)')
};
const GL=[
 [X('Optik qo‘shaloq','Оптическая двойная','Optical double'),X('Bir yo‘nalishda ko‘rinadigan, ammo dinamik bog‘lanmagan ikki yulduz.','Две звезды в одном направлении, не связанные динамически.','Two stars in the same direction with no physical link.')],
 [X('Fizik qo‘shaloq','Физическая двойная','Physical binary'),X('Umumiy massa markazi atrofida aylanuvchi, tortishish bilan bog‘langan yulduzlar.','Звёзды, связанные тяготением и обращающиеся вокруг общего центра масс.','Gravitationally bound stars orbiting a common centre of mass.')],
 [X('Vizual qo‘shaloq','Визуальная двойная','Visual binary'),X('Teleskopda tashkil etuvchilari bevosita ajralib ko‘rinadigan qo‘shaloq.','Двойная, компоненты которой видны раздельно в телескоп.','A binary whose components can be seen separately.')],
 [X('Tutiluvchi qo‘shaloq','Затменная двойная','Eclipsing binary'),X('Bir-birini to‘sib, ravshanligi davriy o‘zgaradigan qo‘shaloq (Algol).','Двойная, компоненты которой затмевают друг друга, блеск меняется (Алголь).','A binary whose stars eclipse each other, varying in brightness (Algol).')],
 [X('Spektral qo‘shaloq','Спектральная двойная','Spectroscopic binary'),X('Spektr chiziqlarining davriy siljishidan aniqlanadigan qo‘shaloq.','Двойная, обнаруживаемая по периодическому смещению линий.','A binary revealed by periodic line shifts.')],
 [X('Massa markazi','Центр масс','Centre of mass'),X('Qo‘shaloq yulduzlar aylanadigan umumiy nuqta; M_a·a_a = m_y·a_y.','Общая точка, вокруг которой обращаются компоненты; M_a·a_a = m_y·a_y.','The common point both stars orbit; M_a·a_a = m_y·a_y.')],
 [X('Massa–yorqinlik bog‘lanishi','Связь масса–светимость','Mass–luminosity relation'),X('Bosh ketma-ketlik yulduzlari uchun L ≈ M³·⁹ (Quyosh birliklarida).','Для звёзд главной последовательности L ≈ M³·⁹ (в солнечных единицах).','For main-sequence stars L ≈ M³·⁹ (solar units).')]
];
const QA=[
 [X('Fizik qo‘shaloq yulduzlarning qanday turlari bor?','Какие бывают физические двойные?','What kinds of physical binary are there?'),X('Vizual, tutiluvchi va spektral qo‘shaloqlar.','Визуальные, затменные и спектральные.','Visual, eclipsing and spectroscopic.')],
 [X('Vizual va tutiluvchi qo‘shaloqlar deb qanday qo‘shaloqlarga aytiladi? Tutiluvchilarning ravshanlik egriligi nega davriy?','Что такое визуальные и затменные двойные? Почему кривая блеска затменных периодична?','What are visual and eclipsing binaries? Why is an eclipsing light curve periodic?'),X('Vizual — teleskopda ajratib ko‘rinadigan. Tutiluvchi — orbitasi qarash chizig‘i bo‘ylab yotib, yulduzlar har aylanishda bir-birini to‘sadi, shuning uchun ravshanlik davr bilan qaytariladi.','Визуальные — разрешаются в телескоп. Затменные — орбита вдоль луча зрения, компоненты на каждом обороте затмевают друг друга, поэтому блеск повторяется с периодом.','Visual: resolved in a telescope. Eclipsing: the orbit is edge-on, so the stars eclipse each other every orbit and the light curve repeats with the period.')],
 [X('Spektral qo‘shaloqlarning qo‘shaloqligi qanday bilinadi?','Как узнают двойственность спектральных двойных?','How is a spectroscopic binary recognised?'),X('Ustma-ust tushgan spektrlardagi umumiy chiziqlarning bir-biriga nisbatan davriy siljishidan.','По периодическому взаимному смещению общих линий наложенных спектров.','From periodic mutual shifts of shared lines in the overlapping spectra.')],
 [X('Qo‘shaloq yulduzlar massalari qaysi qonunga asosan topiladi?','По какому закону находят массы двойных?','Which law gives binary masses?'),X('Keplerning aniqlashtirilgan III qonuni: M_a + m_y = A³/T² (a.b., yil); nisbat M_a/m_y = a_y/a_a.','Уточнённый III закон Кеплера: M_a + m_y = A³/T² (а. е., годы); отношение M_a/m_y = a_y/a_a.','Kepler’s refined third law: M_a + m_y = A³/T² (AU, yr); ratio M_a/m_y = a_y/a_a.')],
 [X('Yorqinlik va massa orasida qanday empirik bog‘lanish topilgan?','Какая эмпирическая связь найдена между светимостью и массой?','What empirical luminosity–mass link was found?'),X('L_b ≈ M³·⁹ — bosh ketma-ketlik yulduzlari uchun.','L_b ≈ M³·⁹ — для звёзд главной последовательности.','L_b ≈ M³·⁹ — for main-sequence stars.')],
 [X('Yulduzlar massalari Quyosh birligida qanday chegarada?','В каких пределах массы звёзд в солнечных единицах?','What range do stellar masses span?'),X('0,1 M☉ dan 100 M☉ gacha; 10–50 M☉ lilari kam uchraydi.','От 0,1 до 100 M☉; звёзды 10–50 M☉ редки.','From 0.1 to 100 M☉; 10–50 M☉ stars are rare.')]
];
const QZ=[
 [X('Turli masofadagi, faqat bir yo‘nalishda ko‘ringan ikki yulduz:','Две звезды на разных расстояниях, видимые в одном направлении:','Two stars at different distances seen in one direction:'),[X('optik qo‘shaloq','оптическая двойная','optical double'),X('vizual qo‘shaloq','визуальная двойная','visual binary'),X('tutiluvchi qo‘shaloq','затменная двойная','eclipsing binary')]],
 [X('Mitsar va Alqor orasidagi masofa:','Расстояние между Мицаром и Алькором:','Separation of Mizar and Alcor:'),[X('≈ 11′','≈ 11′','≈ 11′'),X('≈ 11°','≈ 11°','≈ 11°'),X('≈ 1″','≈ 1″','≈ 1″')]],
 [X('Algol qaysi turkumda?','В каком созвездии Алголь?','Which constellation is Algol in?'),[X('Persey','Персей','Perseus'),X('Orion','Орион','Orion'),X('Katta Ayiq','Большая Медведица','Ursa Major')]],
 [X('Algol ravshanligi o‘zgarish davri:','Период изменения блеска Алголя:','Algol’s period of variation:'),[X('≈ 3 sutka','≈ 3 сут','≈ 3 days'),X('≈ 1 yil','≈ 1 год','≈ 1 yr'),X('≈ 11 yil','≈ 11 лет','≈ 11 yr')]],
 [X('Spektral qo‘shaloqlik nimadan bilinadi?','Как обнаруживается спектральная двойственность?','How is spectroscopic binarity detected?'),[X('chiziqlarning davriy siljishidan','по периодическому смещению линий','periodic line shifts'),X('ravshanlik o‘zgarishidan','по изменению блеска','brightness changes'),X('teleskopda ajratib','разделением в телескоп','splitting in a telescope')]],
 [X('A = 20 a.b., T = 50 yil bo‘lsa, M_a + m_y ≈','При A = 20 а. е., T = 50 лет M_a + m_y ≈','If A = 20 AU and T = 50 yr, M_a + m_y ≈'),[X('3,2 M☉','3,2 M☉','3.2 M☉'),X('8 M☉','8 M☉','8 M☉'),X('0,4 M☉','0,4 M☉','0.4 M☉')]],
 [X('a_y = 3·a_a bo‘lsa, M_a/m_y =','Если a_y = 3·a_a, то M_a/m_y =','If a_y = 3·a_a, then M_a/m_y ='),[X('3','3','3'),X('1/3','1/3','1/3'),X('9','9','9')]],
 [X('Massa–yorqinlik bog‘lanishi:','Связь масса–светимость:','The mass–luminosity relation:'),[X('L ≈ M³·⁹','L ≈ M³·⁹','L ≈ M³·⁹'),X('L ≈ M','L ≈ M','L ≈ M'),X('L ≈ M⁻²','L ≈ M⁻²','L ≈ M⁻²')]],
 [X('Massasi 2 M☉ bo‘lgan bosh ketma-ketlik yulduzi yorqinligi:','Светимость звезды главной последовательности массой 2 M☉:','Luminosity of a 2 M☉ main-sequence star:'),[X('≈ 15 L☉','≈ 15 L☉','≈ 15 L☉'),X('≈ 2 L☉','≈ 2 L☉','≈ 2 L☉'),X('≈ 100 L☉','≈ 100 L☉','≈ 100 L☉')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const star=(x,px,py,r,col)=>{ const g=x.createRadialGradient(px,py,0,px,py,r*1.8); g.addColorStop(0,'#fff'); g.addColorStop(.45,col); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.beginPath(); x.arc(px,py,r*1.8,0,TAU); x.fill(); };
  const play=(btn,key,fn,speed)=>{ let run=false, L=0; const st=n=>{ if(!run) return; fn(Math.min(.05,(n-L)/1000)*speed); L=n; K.rafs[key]=requestAnimationFrame(st); };
    $(btn).onclick=()=>{ run=!run; $(btn).textContent=run?'⏸':'▶'; click(700); if(run){ L=performance.now(); K.rafs[key]=requestAnimationFrame(st); } }; };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<div class="t22-ty">${[[TX.tV,TX.dV,'🔭'],[TX.tE,TX.dE,'🌗'],[TX.tS,TX.dS,'🌈'],[TX.tO,TX.dO,'👁']].map(([a,b,i])=>`<div class="dz-card"><b>${i} ${T(a)}</b><p class="t1-p">${T(b)}</p></div>`).join('')}</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t22O"></canvas></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><p class="t1-cap">${T(TX.bNote)}</p>
    <div class="t1-two"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t22M"></canvas></div>
      <div class="dz-card t1-chart"><canvas class="t1-cv" id="t22X"></canvas><label class="t1-ctl"><span>${T(TX.yr)}: <b id="t22XV"></b></span><input type="range" class="lab-range" id="t22XY" min="1822" max="1955" step="0.1" value="1900"></label><div class="lab-kv" id="t22XKv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t22E"></canvas>
    <div class="lab-row"><button class="lab-chip" id="t22EP">▶</button><span class="t1-lab">${T(TX.inc)}: <b id="t22IV"></b></span><input type="range" class="lab-range" id="t22I" min="60" max="90" step="0.5" value="82" style="flex:1"></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t22S"></canvas><div class="lab-row"><button class="lab-chip" id="t22SP">▶</button></div></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p><div class="t1-formula">M_a + m_y = A³ / T²  (a.b., yil, M☉) · M_a / m_y = a_y / a_a</div>
    <div class="lab-row" style="margin:0">${chips('bn',BIN.map((b,i)=>[i,T(b[0])]))}</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t22K"></canvas></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.A)}: <b id="t22AV"></b></span><input type="range" class="lab-range" id="t22A" min="1" max="60" step="0.1" value="20"></label>
        <label class="t1-ctl"><span>${T(TX.T)}: <b id="t22TV"></b></span><input type="range" class="lab-range" id="t22T" min="1" max="200" step="0.1" value="50.1"></label>
        <label class="t1-ctl"><span>${T(TX.q)}: <b id="t22QV"></b></span><input type="range" class="lab-range" id="t22Q" min="1" max="5" step="0.01" value="2.02"></label><div class="lab-kv" id="t22KKv"></div></div></div>`)}
  ${sec('06',TX.s6,`<p class="t1-p">${T(TX.s6D)}</p><div class="t1-formula">L_b ≈ M³·⁹</div><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t22L"></canvas></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.mm)}: <b id="t22LV"></b></span><input type="range" class="lab-range" id="t22LM" min="-1" max="2" step="0.005" value="0"></label><div class="lab-kv" id="t22LKv"></div></div></div>`)}
  ${sec('07',K.U.gl,K.glHTML(GL))}
  ${sec('08',K.U.qa,K.qaHTML(QA))}
  ${sec('09',K.U.test,`<div class="dz-card t1-quiz" id="t22Quiz"></div>`)}`;

  /* 01 · optik vs fizik */
  K.draw(function(){ const cv=$('#t22O'); const {x,w,h}=fit(cv,.3,200), c=C(), ey=h/2, ex=24;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); dot(x,ex,ey,6,'#3f7fe0'); lbl(x,T(X('Yer','Земля','Earth')),ex,ey+20,'#cfd6f2');
    const half=w/2; x.strokeStyle='rgba(255,255,255,.18)'; x.setLineDash([3,4]); x.beginPath(); x.moveTo(ex,ey); x.lineTo(w-10,ey-26); x.moveTo(ex,ey); x.lineTo(w-10,ey+26); x.stroke(); x.setLineDash([]);
    star(x,half*.75,ey-6,5,'#ffd27a'); star(x,w-30,ey-24,7,'#ff9a6a'); lbl(x,T(TX.tO),half*.75+70,ey-34,'#ff9a6a');
    const bx=half*1.25, by=ey+18; x.strokeStyle='rgba(160,200,255,.5)'; x.beginPath(); x.ellipse(bx,by,26,9,0,0,TAU); x.stroke(); star(x,bx-14,by,5,'#cfe0ff'); star(x,bx+18,by+3,3.5,'#ffd27a'); lbl(x,T(X('Fizik qo‘shaloq','Физическая двойная','Physical binary'),),bx,by+26,'#cfe0ff'); });

  /* 02 · Mitsar-Alqor va ξ UMa */
  K.draw(function(){ const cv=$('#t22M'); const {x,w,h}=fit(cv,.75,280), c=C(); x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const pts=[[.12,.55,'Dubhe'],[.22,.68,'Merak'],[.36,.62,'Phecda'],[.32,.47,'Megrez'],[.5,.42,'Alioth'],[.66,.37,T(X('Mitsar','Мицар','Mizar'))],[.85,.5,'Benetnash']];
    x.strokeStyle='rgba(160,180,255,.35)'; x.beginPath(); [0,1,2,3,0].forEach((i,k)=>{ const p=pts[i]; k?x.lineTo(p[0]*w,p[1]*h):x.moveTo(p[0]*w,p[1]*h); }); [3,4,5,6].forEach(i=>x.lineTo(pts[i][0]*w,pts[i][1]*h)); x.stroke();
    pts.forEach(p=>{ star(x,p[0]*w,p[1]*h,3.5,'#e8eeff'); lbl(x,p[2],p[0]*w,p[1]*h+16,'#9aa6cc'); });
    const mx=pts[5][0]*w, my=pts[5][1]*h, ax=mx+w*.03, ay=my-h*.07; star(x,ax,ay,1.8,'#e8eeff'); lbl(x,T(X('Alqor','Алькор','Alcor')),ax+6,ay-6,'#ffd27a','left');
    x.strokeStyle=c.gold; x.lineWidth=1; x.beginPath(); x.arc(mx,my,22,0,TAU); x.stroke(); lbl(x,'11′',mx-26,my-14,c.gold,'right'); });
  const XI=[[1822,1.9,200],[1830,.9,260],[1835,.5,330],[1840,1.4,30],[1850,2.4,80],[1860,2.7,115],[1870,2.6,145],[1880,1.9,190],[1890,.95,250],[1895,.55,320],[1900,1.45,25],[1910,2.45,75],[1920,2.7,110],[1930,2.55,145],[1940,1.9,190],[1950,1.05,245],[1955,.6,300]];
  const xip=y=>{ for(let i=0;i<XI.length-1;i++){ const a=XI[i], b=XI[i+1]; if(y>=a[0]&&y<=b[0]){ const t=(y-a[0])/(b[0]-a[0]); let da=b[2]-a[2]; if(da<-180) da+=360; return [a[1]+(b[1]-a[1])*t,(a[2]+da*t+360)%360]; } } return [XI[XI.length-1][1],XI[XI.length-1][2]]; };
  const drawX=K.draw(function(){ const cv=$('#t22X'); const {x,w,h}=fit(cv,.75,280), c=C(), cx=w/2, cy=h/2, s=Math.min(w,h)*.42/3, y=+$('#t22XY').value;
    x.fillStyle=c.day?'#f3ead6':'#05081a'; x.fillRect(0,0,w,h);
    [.5,1,1.5,2,2.5].forEach(r=>{ x.strokeStyle=c.brd; x.beginPath(); x.arc(cx,cy,r*s,0,TAU); x.stroke(); lbl(x,fmtN(r,1)+'″',cx+r*s+2,cy-2,c.dim,'left'); });
    [[0,'0°'],[90,'90°'],[180,'180°'],[270,'270°']].forEach(([a,s2])=>lbl(x,s2,cx+Math.sin(a*D2R)*(2.85*s),cy-Math.cos(a*D2R)*(2.85*s)+4,c.dim));
    x.strokeStyle=c.neon; x.lineWidth=1.8; x.beginPath(); for(let yy=1822;yy<=1955;yy+=.5){ const [r,p]=xip(yy), px=cx+Math.sin(p*D2R)*r*s, py=cy-Math.cos(p*D2R)*r*s; yy===1822?x.moveTo(px,py):x.lineTo(px,py); } x.stroke();
    star(x,cx,cy,6,'#ffe9b0'); const [r,p]=xip(y); dot(x,cx+Math.sin(p*D2R)*r*s,cy-Math.cos(p*D2R)*r*s,5,c.gold);
    $('#t22XV').textContent=Math.floor(y); $('#t22XKv').innerHTML=kv(T(TX.sep),fmtN(r,2)+'″',true)+kv(T(TX.pa),Math.round(p)+'°')+kv(T(TX.T),'≈ 60 '+T(TX.y)); });
  $('#t22XY').oninput=drawX;

  /* 03 · Algol */
  let et=0;
  const drawE=K.draw(function(){ const cv=$('#t22E'); const {x,w,h}=fit(cv,.5,320), c=C(), P=2.867, ph=(et%P)/P, inc=+$('#t22I').value*D2R, top=h*.42;
    x.fillStyle='#03050f'; x.fillRect(0,0,w*.38,top*1.0+10);
    const cx=w*.19, cy=top*.5, a=w*.13, R1=w*.035, R2=w*.042, cosi=Math.cos(inc);
    const pos=f=>{ const ang=f*TAU; return [Math.sin(ang)*a, -Math.cos(ang)*a*cosi, Math.cos(ang)]; };
    const flux=f=>{ const [dx,dy,dz]=pos(f), d=Math.hypot(dx,dy)/a*w*.13; const ov=(r1,r2,dd)=>{ if(dd>=r1+r2) return 0; if(dd<=Math.abs(r1-r2)) return Math.PI*Math.min(r1,r2)**2; const A1=r1*r1*Math.acos((dd*dd+r1*r1-r2*r2)/(2*dd*r1)), A2=r2*r2*Math.acos((dd*dd+r2*r2-r1*r1)/(2*dd*r2)); return A1+A2-.5*Math.sqrt((-dd+r1+r2)*(dd+r1-r2)*(dd-r1+r2)*(dd+r1+r2)); };
      const S1=1, S2=.16, A1=Math.PI*R1*R1, A2=Math.PI*R2*R2, o=ov(R1,R2,d); return dz<0 ? S1+S2*(1-o/A2)*0+S2-(S1*o/A1) : S1+S2-S2*o/A2; };
    const F=flux(ph), F0=flux(.25);
    const [dx,dy,dz]=pos(ph);
    const draw1=()=>star(x,cx,cy,R1,'#cfe0ff'), draw2=()=>{ x.fillStyle='#ff9a5a'; x.beginPath(); x.arc(cx+dx,cy+dy,R2,0,TAU); x.fill(); };
    if(dz<0){ draw1(); draw2(); } else { draw2(); draw1(); }
    lbl(x,T(X('Yerdan ko‘rinishi','Вид с Земли','View from Earth')),cx,top-4,'#9aa6cc');
    const gx=w*.42, gw=w-gx-12, gy0=12, gh=top-6;
    const mOf=f=>-2.5*Math.log10(flux(f)/F0)+2.3, sy=m=>gy0+(m-2.1)/(3.7-2.1)*gh;
    x.strokeStyle=c.brd; x.strokeRect(gx,gy0,gw,gh);
    [2.3,3.5].forEach(m=>{ x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(fmtN(m,1)+'ᵐ',gx-4,sy(m)+3); });
    x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); for(let i=0;i<=gw;i++){ const f=i/gw*2%1, m=mOf(f); i?x.lineTo(gx+i,sy(m)):x.moveTo(gx+i,sy(m)); } x.stroke();
    const mx=gx+(ph/2)*gw; dot(x,mx,sy(mOf(ph)),4,c.gold); dot(x,mx+gw/2,sy(mOf(ph)),4,c.gold);
    [0,1,2,3,4,5].forEach(d=>lbl(x,String(d),gx+d/(2*P)*gw,gy0+gh+14,c.dim)); lbl(x,'t, '+T(TX.dd),gx+gw,gy0+gh+28,c.dim,'right');
    const depth=mOf(0)-2.3; lbl(x,depth<.02?T(TX.noecl):'Δm = '+fmtN(depth,2)+'ᵐ',gx+gw/2,h-8,depth<.02?c.dim:c.gold);
    $('#t22IV').textContent=fmtN(inc/D2R,1)+'°'; });
  $('#t22I').oninput=drawE; play('#t22EP','e',dt=>{ et+=dt; drawE(); },.8);

  /* 04 · Spektral qo'shaloq */
  let st=0;
  const drawS=K.draw(function(){ const cv=$('#t22S'); const {x,w,h}=fit(cv,.42,280), c=C(), ph=st/4*TAU, K1=60, K2=110;
    x.fillStyle='#03050f'; x.fillRect(0,0,w*.32,h);
    const cx=w*.16, cy=h*.4, a=w*.11; x.strokeStyle='rgba(160,200,255,.3)'; x.beginPath(); x.ellipse(cx,cy,a,a*.32,0,0,TAU); x.stroke();
    star(x,cx+Math.cos(ph)*a*.35,cy+Math.sin(ph)*a*.35*.32,7,'#cfe0ff'); star(x,cx-Math.cos(ph)*a*.65,cy-Math.sin(ph)*a*.65*.32,5,'#ffd27a');
    lbl(x,'↓ '+T(X('Yerga','к Земле','to Earth')),cx,h*.8,'#9aa6cc');
    const v1=K1*Math.sin(ph), v2=-K2*Math.sin(ph), sx0=w*.36, sw=w-sx0-12, sy=14, sh=h*.34;
    for(let i=0;i<sw;i++){ const l=640+i/sw*30; x.fillStyle=`rgb(255,${120+i/sw*30|0},${60})`; x.fillRect(sx0+i,sy,1.2,sh); }
    const Lx=l=>sx0+(l-640)/30*sw, l0=656.28, s1=l0*(1+v1/3e5), s2=l0*(1+v2/3e5);
    x.fillStyle='rgba(0,0,0,.85)'; x.fillRect(Lx(s1)-2,sy,4,sh); x.fillStyle='rgba(0,0,0,.55)'; x.fillRect(Lx(s2)-1.5,sy,3,sh);
    x.strokeStyle='rgba(255,255,255,.4)'; x.setLineDash([3,3]); x.beginPath(); x.moveTo(Lx(l0),sy-4); x.lineTo(Lx(l0),sy+sh+4); x.stroke(); x.setLineDash([]); lbl(x,'Hα λ₀',Lx(l0),sy+sh+16,c.dim);
    const gy=h*.62, gh=h*.32, gsy=v=>gy+gh/2-v/130*gh/2; x.strokeStyle=c.brd; x.beginPath(); x.moveTo(sx0,gsy(0)); x.lineTo(sx0+sw,gsy(0)); x.stroke();
    [[K1,'#cfe0ff',0],[K2,'#ffd27a',Math.PI]].forEach(([Kv,col,o])=>{ x.strokeStyle=col; x.lineWidth=2; x.beginPath(); for(let i=0;i<=sw;i++){ const p=i/sw*TAU*2, v=Kv*Math.sin(p+o); i?x.lineTo(sx0+i,gsy(v)):x.moveTo(sx0+i,gsy(v)); } x.stroke(); });
    const cxp=sx0+((ph%(TAU*2))/(TAU*2))*sw; x.strokeStyle=c.gold; x.beginPath(); x.moveTo(cxp,gy); x.lineTo(cxp,gy+gh); x.stroke();
    lbl(x,T(TX.vel)+' (km/s)',sx0,gy-4,c.dim,'left'); });
  play('#t22SP','s',dt=>{ st+=dt; drawS(); },1);

  /* 05 · Massalar */
  const drawK=K.draw(function(){ const cv=$('#t22K'); const {x,w,h}=fit(cv,.75,300), c=C(), A=+$('#t22A').value, Tt=+$('#t22T').value, q=+$('#t22Q').value, M=A**3/Tt**2, Ma=M*q/(1+q), my=M/(1+q), aa=A/(1+q), ay=A*q/(1+q);
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); const cx=w/2, cy=h/2, s=Math.min(w,h)*.42/A, an=-(performance.now()/1000)*0;
    x.strokeStyle='rgba(207,224,255,.45)'; x.beginPath(); x.arc(cx,cy,aa*s,0,TAU); x.stroke(); x.strokeStyle='rgba(255,210,122,.45)'; x.beginPath(); x.arc(cx,cy,ay*s,0,TAU); x.stroke();
    x.fillStyle='#fff'; x.fillRect(cx-3,cy-.5,6,1); x.fillRect(cx-.5,cy-3,1,6); lbl(x,T(X('massa markazi','центр масс','centre of mass')),cx,cy+16,'#9aa6cc');
    star(x,cx-aa*s,cy,4+Math.cbrt(Ma)*3,'#cfe0ff'); star(x,cx+ay*s,cy,4+Math.cbrt(my)*3,'#ffd27a');
    lbl(x,'a_a',cx-aa*s/2,cy-8,'#cfe0ff'); lbl(x,'a_y',cx+ay*s/2,cy-8,'#ffd27a');
    $('#t22AV').textContent=fmtN(A,1)+' '+T(TX.au); $('#t22TV').textContent=fmtN(Tt,1)+' '+T(TX.y); $('#t22QV').textContent=fmtN(q,2);
    const b=BIN.find(b=>Math.abs(b[1]-A)<.05&&Math.abs(b[2]-Tt)<.05);
    $('#t22KKv').innerHTML=kv(T(TX.sum),fmtN(M,2)+' M☉',true)+kv(T(TX.Ma),fmtN(Ma,2)+' M☉')+kv(T(TX.my),fmtN(my,2)+' M☉')+kv('5,9·10¹¹·A³/T²',(M*1.989e30).toExponential(2).replace('.',',')+' kg')+(b?kv(T(TX.ref),fmtN(b[3],2)+' + '+fmtN(b[4],2)+' M☉'):''); });
  ['#t22A','#t22T','#t22Q'].forEach(s=>$(s).oninput=()=>{ mark('bn',''); drawK(); });
  on('bn',v=>{ const b=BIN[+v]; $('#t22A').value=b[1]; $('#t22T').value=b[2]; $('#t22Q').value=b[3]/b[4]; mark('bn',v); drawK(); });

  /* 06 · Massa-yorqinlik */
  const drawL=K.draw(function(){ const cv=$('#t22L'); const {x,w,h}=fit(cv,.75,320), c=C(), pl=44, pr=40, pt=12, pb=28, sx=lm=>pl+(lm+1)/3*(w-pl-pr), sy=lL=>pt+(1-(lL+6)/14)*(h-pt-pb), lm=+$('#t22LM').value;
    [-6,-4,-2,0,2,4,6,8].forEach(v=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(v)); x.lineTo(w-pr,sy(v)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText('10'+(v<0?'⁻':'')+'⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.abs(v)],pl-4,sy(v)+3); x.textAlign='left'; x.fillText((4.8-2.5*v>0?'+':'')+fmtN(4.8-2.5*v,0),w-pr+4,sy(v)+3); });
    [.1,.2,.5,1,2,5,10,30,50,100].forEach(m=>lbl(x,String(m).replace('.',','),sx(Math.log10(m)),h-10,c.dim));
    let s=3; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<70;i++){ const l=-1+r()*3, L=3.9*l+(r()-.5)*.8; dot(x,sx(l),sy(L),2.3,'rgba(150,180,255,.6)'); }
    x.strokeStyle=c.gold; x.lineWidth=2; x.beginPath(); x.moveTo(sx(-1),sy(-3.9)); x.lineTo(sx(2),sy(7.8)); x.stroke(); lbl(x,'L ~ M³·⁹',sx(1.6),sy(6.8)-8,c.gold);
    dot(x,sx(0),sy(0),4,'#ffd27a'); lbl(x,T(X('Quyosh','Солнце','Sun')),sx(0)+8,sy(0)+4,'#ffd27a','left');
    const L=10**(3.9*lm); x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); x.arc(sx(lm),sy(3.9*lm),7,0,TAU); x.stroke();
    lbl(x,'M/M☉',w-pr,h-pb+2,c.dim,'right'); lbl(x,'L/L☉',pl+4,pt+10,c.dim,'left');
    const m=10**lm; $('#t22LV').textContent=fmtN(m,m<1?2:1);
    const life=m/L*10; $('#t22LKv').innerHTML=kv(T(TX.LL),L<.01?L.toExponential(1).replace('.',','):fmtN(L,L<10?2:0),true)+kv(T(TX.MM),(4.8-2.5*3.9*lm>=0?'+':'')+fmtN(4.8-2.5*3.9*lm,1))+kv(T(TX.life),life<1?fmtN(life*1000,0)+' mln':fmtN(life,1)+' mlrd'); });
  $('#t22LM').oninput=drawL;

  K.bindQA(); K.quiz($('#t22Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t22', GL, QZ, ico:'♊', title:TX.title, sub:TX.sub, build });
}; go0();
})();
