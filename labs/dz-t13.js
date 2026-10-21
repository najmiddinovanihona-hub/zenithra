/* DARSLIK · 13-mavzu (34–35-§). Quyosh — eng yaqin yulduz. Fotosfera va dog'lar */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const PLR=[[X('Merkuriy','Меркурий','Mercury'),.383,'#b9a48c'],[X('Venera','Венера','Venus'),.949,'#e8c27a'],[X('Yer','Земля','Earth'),1,'#3f7fe0'],[X('Mars','Марс','Mars'),.532,'#d8603a'],[X('Yupiter','Юпитер','Jupiter'),11.21,'#d9a873'],[X('Saturn','Сатурн','Saturn'),9.45,'#e3cf8e'],[X('Uran','Уран','Uranus'),4.01,'#8fd3dc'],[X('Neptun','Нептун','Neptune'),3.88,'#4f78e0']];
const SSN=[[1755,8],[1761,86],[1766,11],[1769,116],[1775,7],[1778,158],[1784,10],[1788,141],[1798,4],[1805,49],[1810,0],[1816,46],[1823,2],[1830,71],[1833,8],[1837,138],[1843,11],[1848,125],[1856,4],[1860,96],[1867,7],[1870,139],[1878,3],[1883,64],[1889,6],[1894,78],[1901,3],[1906,64],[1913,1],[1917,104],[1923,6],[1928,78],[1933,6],[1937,114],[1944,10],[1947,152],[1954,4],[1958,190],[1964,10],[1968,106],[1976,13],[1979,155],[1986,13],[1989,158],[1996,9],[2000,120],[2008,3],[2014,82],[2019,4],[2024.8,160]];
const TX={
 title:X('Quyosh — eng yaqin yulduz. Fotosfera va Quyosh dog‘lari','Солнце — ближайшая звезда. Фотосфера и солнечные пятна','The Sun — our nearest star. The photosphere and sunspots'),
 sub:X('34–35-§ · Quyosh haqida umumiy ma’lumot, Quyosh doimiysi va yorqinligi, differensial aylanish, granulatsiya, mash’allar, dog‘lar va 11,1 yillik sikl','§34–35 · Общие сведения, солнечная постоянная и светимость, дифференциальное вращение, грануляция, факелы, пятна и 11,1-летний цикл','§34–35 · General facts, the solar constant and luminosity, differential rotation, granulation, faculae, sunspots and the 11.1-year cycle'),
 intro:X('Agar Quyosh so‘nsa, Yerni qorong‘ilik qoplardi: Oy va planetalar ham ko‘rinmay qolar, osmonni faqat yulduzlarning xira shu’lasi yoritardi. Bir haftaga qolmay tropiklar qor bilan qoplanar, daryolar to‘xtab, dengiz va okeanlar tubigacha muzlar, shamol ham esmay qolardi. Quyosh milliardlab yulduzlarning biri, kattaligi va temperaturasiga ko‘ra <b>o‘rtacha yulduz</b>. Ammo Yer unga boshqa yulduzlarga qaraganda millionlab marta yaqin, shuning uchun u bizga <b>32′</b> burchak ostida ko‘rinadi.','Если бы Солнце погасло, Землю окутала бы тьма: Луна и планеты тоже исчезли бы, небо освещали бы лишь тусклые звёзды. Не прошло бы и недели, как тропики покрылись бы снегом, реки остановились, моря и океаны промёрзли до дна, стих бы ветер. Солнце — одна из миллиардов звёзд, по размеру и температуре <b>средняя звезда</b>. Но Земля к нему в миллионы раз ближе, чем к другим звёздам, поэтому оно видно под углом <b>32′</b>.','If the Sun went out, darkness would fall: the Moon and planets would vanish too, leaving only faint starlight. Within a week the tropics would be under snow, rivers would stop, seas would freeze to the bottom and the wind would die. The Sun is one of billions of stars — an <b>average star</b> in size and temperature. But we are millions of times closer to it than to other stars, so it spans <b>32′</b> in our sky.'),
 s1:X('Quyosh haqida umumiy ma’lumot','Общие сведения о Солнце','The Sun in numbers'),
 s1D:X('Yerdan Quyoshgacha masofa 149,6 mln km — <b>1 a.b.</b>; nur uni salkam 8,5 minutda o‘tadi. Diametri 1 391 000 km — Yernikidan ≈110 marta katta; hajmiga 1 300 000 dan ortiq Yer sig‘adi, massasi Yernikidan 330 000 marta og‘ir (44-rasm). Sirt temperaturasi ≈5800°, markazda ≈15 mln gradus, bosim 200 mlrd atmosfera, o‘rtacha zichlik 1,41 g/sm³. Quyosh — <b>plazma</b>dan (ionlashgan atomlar va erkin elektronlar) iborat ulkan olov shar. Plazma tutash spektr beradi, atmosfera atomlari esa uni chiziqli yutilish spektriga aylantiradi (45-rasm).','Расстояние до Солнца 149,6 млн км — <b>1 а. е.</b>; свет проходит его почти за 8,5 минуты. Диаметр 1 391 000 км — в ≈110 раз больше земного; в объёме уместится более 1 300 000 Земель, масса в 330 000 раз больше (рис. 44). Температура поверхности ≈5800°, в центре ≈15 млн градусов, давление 200 млрд атмосфер, средняя плотность 1,41 г/см³. Солнце — огромный огненный шар из <b>плазмы</b> (ионизованных атомов и свободных электронов). Плазма даёт сплошной спектр, а атомы атмосферы превращают его в линейчатый спектр поглощения (рис. 45).','The Sun is 149.6 million km away — <b>1 AU</b>; light covers it in about 8.5 minutes. Its diameter of 1,391,000 km is ≈110 Earths; over 1,300,000 Earths would fit inside, and it is 330,000 times more massive (Fig. 44). The surface is ≈5800°, the core ≈15 million degrees, central pressure 200 billion atmospheres, mean density 1.41 g/cm³. It is a giant fireball of <b>plasma</b> (ionised atoms and free electrons), which gives a continuous spectrum turned into an absorption-line spectrum by its atmosphere (Fig. 45).'),
 cmpT:X('Quyosh va planetalar o‘lchami (44-rasm)','Размеры Солнца и планет (рис. 44)','The Sun and planets to scale (Fig. 44)'),
 s2:X('Quyosh doimiysi va yorqinligi','Солнечная постоянная и светимость','The solar constant and luminosity'),
 s2D:X('O‘rtacha masofada, atmosferadan tashqarida, nurlarga tik 1 sm² yuzaga 1 minutda tushadigan energiya — <b>Quyosh doimiysi</b>: 2 kal/(sm²·min) yoki <b>1,4·10³ W/m²</b>. Uni radiusi 1 a.b. bo‘lgan sfera yuzasiga ko‘paytirsak, Quyosh <b>yorqinligi</b> L☉ = 4·10²⁶ W chiqadi — Krasnoyarsk GESi (6·10⁶ kW) quvvatidan 6,67·10¹⁶ marta ko‘p. 1 sekunddagi energiya 12 ming trillion tonna ko‘mir yoqilganiga teng; Yerga uning atigi 2 milliarddan bir qismi tushadi.','Энергия, падающая за 1 минуту на 1 см², перпендикулярный лучам, за пределами атмосферы на среднем расстоянии, — <b>солнечная постоянная</b>: 2 кал/(см²·мин), или <b>1,4·10³ Вт/м²</b>. Умножив её на площадь сферы радиусом 1 а. е., получим <b>светимость</b> L☉ = 4·10²⁶ Вт — в 6,67·10¹⁶ раз больше мощности Красноярской ГЭС (6·10⁶ кВт). Энергия за 1 секунду равна сжиганию 12 тысяч триллионов тонн угля; Земля получает лишь одну двухмиллиардную часть.','The energy falling per minute on 1 cm² perpendicular to the rays, outside the atmosphere at mean distance, is the <b>solar constant</b>: 2 cal/(cm²·min), or <b>1.4·10³ W/m²</b>. Multiplying by the area of a 1 AU sphere gives the <b>luminosity</b> L☉ = 4·10²⁶ W — 6.67·10¹⁶ times the Krasnoyarsk hydro plant (6·10⁶ kW). One second’s output equals burning 12 thousand trillion tonnes of coal; Earth receives just one two-billionth of it.'),
 d:X('Quyoshdan masofa','Расстояние от Солнца','Distance from the Sun'), flux:X('Tushadigan oqim','Падающий поток','Incoming flux'), sph:X('Sfera yuzasi 4πd²','Площадь сферы 4πd²','Sphere area 4πd²'), Lsun:X('Yorqinlik L = E·4πd²','Светимость L = E·4πd²','Luminosity L = E·4πd²'), ang:X('Ko‘rinma diametri','Видимый диаметр','Apparent diameter'),
 s3:X('Differensial aylanish','Дифференциальное вращение','Differential rotation'),
 s3D:X('Quyosh ham o‘z o‘qi atrofida aylanadi, ammo <b>differensial</b>: ekvator sohasi ≈25 sutkada, qutblar sohasi 28–29 kunda aylanadi. Shuning uchun bir meridian bo‘ylab qo‘yilgan belgilar vaqt o‘tishi bilan egilib ketadi.','Солнце тоже вращается, но <b>дифференциально</b>: экваториальная зона — за ≈25 суток, полярные — за 28–29 суток. Поэтому метки, поставленные вдоль одного меридиана, со временем изгибаются.','The Sun rotates too, but <b>differentially</b>: the equator in ≈25 days, the polar regions in 28–29 days. So markers placed along one meridian bend over time.'),
 days:X('O‘tgan vaqt','Прошло','Elapsed'), dd:X('sutka','сут','days'), lat:X('Kenglik','Широта','Latitude'), per:X('Aylanish davri','Период вращения','Rotation period'),
 s4:X('Fotosfera, granulatsiya va mash’allar','Фотосфера, грануляция и факелы','Photosphere, granulation and faculae'),
 s4D:X('Quyosh atmosferasining asosan ko‘rinadigan nurlarni chiqaruvchi ostki qatlami — <b>fotosfera</b> (46-rasm). Stratosferaga geliy to‘ldirilgan ballonlarda uchirilgan teleskoplar uning sirtida asalari uyasini eslatuvchi donadorlikni — <b>granulatsiya</b>ni ko‘rsatdi («granula» — mayda dona). U fotosferadagi <b>konvektiv</b> jarayonni aks ettiradi: o‘rtacha granula ≈500 km, odatda 200 dan 700–800 km gacha (47-rasm). Fotosferada zanjirsimon shu’lali sohalar — <b>mash’allar</b> ham ko‘rinadi; ular ko‘pincha dog‘lar bilan birga uchraydi.','Нижний слой атмосферы Солнца, излучающий в основном видимый свет, — <b>фотосфера</b> (рис. 46). Телескопы, поднятые в стратосферу на аэростатах с гелием, показали на ней зернистость, похожую на пчелиные соты, — <b>грануляцию</b> («гранула» — зёрнышко). Она отражает <b>конвекцию</b>: средняя гранула ≈500 км, обычно от 200 до 700–800 км (рис. 47). В фотосфере видны и цепочки ярких областей — <b>факелы</b>; они чаще всего сопровождают пятна.','The lower layer of the solar atmosphere, emitting mostly visible light, is the <b>photosphere</b> (Fig. 46). Telescopes lifted into the stratosphere on helium balloons revealed a honeycomb-like texture — <b>granulation</b> (“granule” = little grain). It traces <b>convection</b>: a typical granule is ≈500 km, usually 200 to 700–800 km (Fig. 47). Chains of bright patches — <b>faculae</b> — are also seen, mostly near sunspots.'),
 gran:X('Granula hujayralari (konveksiya)','Ячейки грануляции (конвекция)','Granulation cells (convection)'), scale:X('≈ 1000 km','≈ 1000 км','≈ 1000 km'),
 s5:X('Quyosh dog‘lari — magnit orollari','Солнечные пятна — магнитные острова','Sunspots — magnetic islands'),
 s5D:X('Dog‘lar bir necha ming km dan bir necha yuz ming km gacha bo‘ladi. 1610-yilda Galiley ular Quyosh sirtiga tegishli ekanini teleskopda aniqladi. Dog‘larda <b>kuchli magnit maydon</b> mujassam; ular yakka kam uchraydi, ko‘pincha guruh bo‘lib, bitta yoki ikkita yirik <b>qarama-qarshi qutbli</b> dog‘ va bir necha mayda dog‘dan iborat (48-rasm). Temperaturasi fotosferadan ≈<b>1500°</b> past, shuning uchun qorayib ko‘rinadi. Bir necha kundan bir-ikki oygacha «yashaydi», faqat ±5° dan ±40° gacha kengliklarda paydo bo‘ladi.','Пятна бывают от нескольких тысяч до сотен тысяч километров. В 1610 году Галилей в телескоп установил, что они принадлежат поверхности Солнца. В пятнах сосредоточено <b>сильное магнитное поле</b>; одиночные пятна редки, чаще — группы из одного-двух крупных пятен <b>противоположной полярности</b> и нескольких мелких (рис. 48). Они на ≈<b>1500°</b> холоднее фотосферы и поэтому кажутся тёмными. Живут от нескольких дней до одного-двух месяцев, возникают лишь на широтах от ±5° до ±40°.','Spots range from a few thousand to hundreds of thousands of km. In 1610 Galileo established with his telescope that they lie on the Sun’s surface. They hold <b>strong magnetic fields</b>; lone spots are rare — usually groups of one or two large spots of <b>opposite polarity</b> plus smaller ones (Fig. 48). Being ≈<b>1500°</b> cooler than the photosphere, they look dark. They last from days to a month or two and appear only between ±5° and ±40° latitude.'),
 dark:X('Nega qora ko‘rinadi','Почему тёмные','Why they look dark'), tP:X('Fotosfera','Фотосфера','Photosphere'), tS:X('Dog‘','Пятно','Spot'), ratio:X('Nurlanish nisbati (T⁴)','Отношение излучения (T⁴)','Brightness ratio (T⁴)'),
 cycT:X('Dog‘lar sonining 11,1 yillik sikli (Volf soni)','11,1-летний цикл числа пятен (число Вольфа)','The 11.1-year sunspot cycle (Wolf number)'),
 cycD:X('Shveysariyalik olim Rudolf Volf qariyb 100 yillik ma’lumotni yig‘ib, havaskorlar orasida dog‘larni sistemali kuzatishni yo‘lga qo‘ydi va dog‘lar soni o‘zgarishining o‘rtacha davrini <b>11,1 yil</b> deb topdi. Dog‘lar Quyoshdagi eng faol jarayon bo‘lib, boshqa barcha faol hodisalar bilan bog‘liq, shuning uchun bu davr <b>Quyosh faolligi davri</b> deb qabul qilingan.','Швейцарский учёный Рудольф Вольф собрал данные почти за 100 лет, наладил систематические наблюдения пятен любителями и нашёл средний период изменения их числа — <b>11,1 года</b>. Пятна — самый активный процесс на Солнце и связаны со всеми другими активными явлениями, поэтому этот период принят за <b>период солнечной активности</b>.','Swiss scientist Rudolf Wolf collected nearly a century of data, organised systematic observations by amateurs and found the mean period of the spot count — <b>11.1 years</b>. Spots are the Sun’s most active process and linked to all other activity, so this is taken as the <b>solar activity period</b>.'),
 yr:X('Yil','Год','Year'), max:X('maksimum','максимум','maximum'), min:X('minimum','минимум','minimum'), cyc:X('Sikl','Цикл','Cycle'), phase:X('Faza','Фаза','Phase'), wolf:X('Volf soni (taxm.)','Число Вольфа (ок.)','Wolf number (approx.)'),
 cap:X('Ma’lumotlar — har sikl maksimumi va minimumining yillik qiymatlari (taxminiy).','Данные — годовые значения в максимумах и минимумах циклов (приближённо).','Data: approximate yearly values at each cycle’s maximum and minimum.')
};
const GL=[
 [X('Plazma','Плазма','Plasma'),X('Ionlashgan atomlar va erkin elektronlardan iborat qaynoq gaz.','Горячий газ из ионизованных атомов и свободных электронов.','Hot gas of ionised atoms and free electrons.')],
 [X('Quyosh doimiysi','Солнечная постоянная','Solar constant'),X('1 a.b. masofada atmosferadan tashqarida nurlarga tik 1 m² ga tushadigan quvvat — 1,4·10³ W/m² (2 kal/(sm²·min)).','Мощность на 1 м², перпендикулярный лучам, на 1 а. е. вне атмосферы — 1,4·10³ Вт/м² (2 кал/(см²·мин)).','Power per m² perpendicular to the rays at 1 AU above the atmosphere — 1.4·10³ W/m².')],
 [X('Yorqinlik','Светимость','Luminosity'),X('Quyoshning to‘la nurlanish quvvati: L☉ = 4·10²⁶ W.','Полная мощность излучения Солнца: L☉ = 4·10²⁶ Вт.','The Sun’s total radiated power: L☉ = 4·10²⁶ W.')],
 [X('Differensial aylanish','Дифференциальное вращение','Differential rotation'),X('Ekvator ≈25, qutblar 28–29 sutkada aylanadi.','Экватор вращается за ≈25, полюса — за 28–29 суток.','Equator in ≈25 days, poles in 28–29.')],
 [X('Fotosfera','Фотосфера','Photosphere'),X('Quyosh atmosferasining asosan ko‘rinadigan nur chiqaruvchi ostki qatlami.','Нижний слой атмосферы Солнца, излучающий в основном видимый свет.','The lowest solar atmospheric layer, emitting mostly visible light.')],
 [X('Granulatsiya','Грануляция','Granulation'),X('Fotosferaning konveksiyani aks ettiruvchi donador tuzilishi; granula ≈500 km.','Зернистая структура фотосферы, отражающая конвекцию; гранула ≈500 км.','The grainy texture of the photosphere caused by convection; granules ≈500 km.')],
 [X('Mash’al','Факел','Facula'),X('Fotosferadagi zanjirsimon shu’lali soha; ko‘pincha dog‘lar yonida.','Цепочка ярких областей фотосферы; обычно рядом с пятнами.','A chain of bright photospheric patches, usually near spots.')],
 [X('Quyosh dog‘i','Солнечное пятно','Sunspot'),X('Kuchli magnit maydonli, fotosferadan ≈1500° sovuqroq qora soha.','Тёмная область с сильным магнитным полем, на ≈1500° холоднее фотосферы.','A dark, strongly magnetic region ≈1500° cooler than the photosphere.')],
 [X('Quyosh faolligi davri','Период солнечной активности','Solar activity cycle'),X('Dog‘lar soni o‘zgarishining o‘rtacha 11,1 yillik davri (R. Volf).','Средний 11,1-летний период изменения числа пятен (Р. Вольф).','The mean 11.1-year period of the spot count (R. Wolf).')]
];
const QA=[
 [X('Quyosh qanday osmon jismi hisoblanadi?','Каким небесным телом является Солнце?','What kind of body is the Sun?'),X('Yulduz — kattaligi va temperaturasiga ko‘ra o‘rtacha yulduz; plazmadan iborat ulkan qaynoq shar.','Звезда — средняя по размеру и температуре; огромный раскалённый шар из плазмы.','A star — average in size and temperature; a huge hot ball of plasma.')],
 [X('Quyosh o‘lchamlarini Yernikiga solishtiring.','Сравните размеры Солнца и Земли.','Compare the Sun’s size with Earth’s.'),X('Diametri ≈110 marta, hajmi 1,3 mln marta, massasi 330 000 marta katta.','Диаметр в ≈110 раз, объём в 1,3 млн раз, масса в 330 000 раз больше.','≈110× the diameter, 1.3 million× the volume, 330,000× the mass.')],
 [X('Quyosh fotosferasi qanday spektrga ega?','Какой спектр у фотосферы?','What spectrum does the photosphere have?'),X('Tutash spektr, atmosfera atomlari yutgani uchun qora chiziqlar bilan kesilgan — chiziqli yutilish spektri.','Сплошной, пересечённый тёмными линиями поглощения — линейчатый спектр поглощения.','Continuous, crossed by dark absorption lines — an absorption-line spectrum.')],
 [X('Quyosh qanday modda va elementlardan tashkil topgan?','Из чего состоит Солнце?','What is the Sun made of?'),X('Plazmadan; spektrida vodorod, natriy, kalsiy, magniy, temir va boshqa elementlar chiziqlari bor (45-rasm).','Из плазмы; в спектре — линии водорода, натрия, кальция, магния, железа и др. (рис. 45).','Plasma; its spectrum shows hydrogen, sodium, calcium, magnesium, iron and more (Fig. 45).')],
 [X('Quyosh doimiysi deganda nima tushuniladi?','Что такое солнечная постоянная?','What is the solar constant?'),X('1 a.b. da, atmosferadan tashqarida, nurlarga tik 1 sm² ga 1 minutda tushadigan energiya: 2 kal/(sm²·min) = 1,4·10³ W/m².','Энергия на 1 см² за 1 мин на 1 а. е. вне атмосферы перпендикулярно лучам: 2 кал/(см²·мин) = 1,4·10³ Вт/м².','Energy per cm² per minute at 1 AU outside the atmosphere: 2 cal/(cm²·min) = 1.4·10³ W/m².')],
 [X('Fotosfera deganda Quyoshning qaysi qatlami tushuniladi?','Какой слой называют фотосферой?','Which layer is the photosphere?'),X('Asosan ko‘rinadigan nurlarni chiqaruvchi atmosferaning ostki qatlami.','Нижний слой атмосферы, излучающий в основном видимый свет.','The lowest atmospheric layer, emitting mostly visible light.')],
 [X('Fotosferada qanday obyektlar kuzatiladi? Granulatsiya qanday struktura?','Что видно в фотосфере? Что такое грануляция?','What is seen in the photosphere? What is granulation?'),X('Granulalar, mash’allar va dog‘lar. Granulatsiya — asalari uyasiga o‘xshash donadorlik, konveksiya izi; granulalar 200–800 km.','Гранулы, факелы и пятна. Грануляция — сотовидная зернистость, след конвекции; гранулы 200–800 км.','Granules, faculae and spots. Granulation is a honeycomb texture from convection; granules 200–800 km.')],
 [X('Dog‘lar ochilish tarixi va nega qora ko‘rinishi haqida so‘zlang.','Расскажите об открытии пятен и почему они тёмные.','Tell how spots were discovered and why they look dark.'),X('1610-yilda Galiley teleskopda ularning Quyosh sirtiga tegishli ekanini aniqladi. Dog‘ fotosferadan ≈1500° sovuq, T⁴ qonuniga ko‘ra 2–3 marta kam nurlanadi — fonida qora ko‘rinadi.','В 1610 г. Галилей в телескоп установил, что они на поверхности Солнца. Пятно на ≈1500° холоднее, по закону T⁴ излучает в 2–3 раза слабее и кажется тёмным.','In 1610 Galileo found by telescope that they lie on the surface. A spot is ≈1500° cooler, so by T⁴ it emits 2–3× less and looks dark.')],
 [X('Dog‘lar soni qanday davr bilan o‘zgaradi? Guruhlar magnit maydoni qanday?','С каким периодом меняется число пятен? Каково поле групп?','What is the spot cycle period? What are group fields like?'),X('O‘rtacha 11,1 yil. Guruhda bitta-ikkita yirik qarama-qarshi qutbli dog‘ va mayda dog‘lar bo‘ladi.','В среднем 11,1 года. В группе одно-два крупных пятна противоположной полярности и мелкие пятна.','11.1 years on average. A group has one or two large spots of opposite polarity plus small ones.')]
];
const QZ=[
 [X('Quyosh diametri Yernikidan taxminan:','Диаметр Солнца больше земного примерно в:','The Sun’s diameter is about … Earth’s:'),[X('110 marta katta','110 раз','110×'),X('330 000 marta','330 000 раз','330,000×'),X('11 marta','11 раз','11×')]],
 [X('Nur Quyoshdan Yergacha qancha vaqtda keladi?','За сколько свет идёт от Солнца до Земли?','How long does sunlight take to reach Earth?'),[X('≈ 8,5 minut','≈ 8,5 мин','≈ 8.5 min'),X('≈ 1 soat','≈ 1 ч','≈ 1 h'),X('≈ 1 sekund','≈ 1 с','≈ 1 s')]],
 [X('Quyosh doimiysi:','Солнечная постоянная:','The solar constant:'),[X('1,4·10³ W/m²','1,4·10³ Вт/м²','1.4·10³ W/m²'),X('4·10²⁶ W','4·10²⁶ Вт','4·10²⁶ W'),X('5800 W/m²','5800 Вт/м²','5800 W/m²')]],
 [X('Quyosh yorqinligi:','Светимость Солнца:','The Sun’s luminosity:'),[X('4·10²⁶ W','4·10²⁶ Вт','4·10²⁶ W'),X('1,4·10³ W','1,4·10³ Вт','1.4·10³ W'),X('6·10⁶ kW','6·10⁶ кВт','6·10⁶ kW')]],
 [X('Quyosh ekvatori qancha vaqtda aylanadi?','За сколько оборачивается экватор Солнца?','How long does the solar equator take to rotate?'),[X('≈ 25 sutka','≈ 25 сут','≈ 25 days'),X('≈ 29 sutka','≈ 29 сут','≈ 29 days'),X('1 sutka','1 сут','1 day')]],
 [X('Granulalarning o‘rtacha o‘lchami:','Средний размер гранул:','Typical granule size:'),[X('≈ 500 km','≈ 500 км','≈ 500 km'),X('≈ 50 km','≈ 50 км','≈ 50 km'),X('≈ 50 000 km','≈ 50 000 км','≈ 50,000 km')]],
 [X('Dog‘lar fotosferadan qancha sovuq?','Насколько пятна холоднее фотосферы?','How much cooler are spots than the photosphere?'),[X('≈ 1500°','≈ 1500°','≈ 1500°'),X('≈ 150°','≈ 150°','≈ 150°'),X('≈ 5000°','≈ 5000°','≈ 5000°')]],
 [X('Dog‘lar qaysi kengliklarda paydo bo‘ladi?','На каких широтах возникают пятна?','At which latitudes do spots appear?'),[X('±5° — ±40°','±5° — ±40°','±5° to ±40°'),X('faqat qutblarda','только у полюсов','only near the poles'),X('istalgan joyda','где угодно','anywhere')]],
 [X('Quyosh faolligi davri:','Период солнечной активности:','The solar activity cycle:'),[X('11,1 yil','11,1 года','11.1 years'),X('25 sutka','25 суток','25 days'),X('22 yil','22 года','22 years')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const sunG=(x,cx,cy,r)=>{ const g=x.createRadialGradient(cx,cy,0,cx,cy,r); g.addColorStop(0,'#fff1b8'); g.addColorStop(.7,'#ffb347'); g.addColorStop(1,'#e8792a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r,0,TAU); x.fill(); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p>
    <div class="lab-kv t2-kv5">${kv('D☉','1 391 000 km')+kv('D☉ / D⊕','≈ 110')+kv('V☉ / V⊕','> 1 300 000')+kv('M☉ / M⊕','330 000')+kv('T (sirt / yadro)','5800° / 15·10⁶°')+kv('ρ̄','1,41 g/sm³')+kv('p (markaz)','2·10¹¹ atm')+kv('t (nur)','≈ 8,5 min')}</div>
    <div class="dz-card t1-chart"><h4>${T(TX.cmpT)}</h4><canvas class="t1-cv" id="t13Sz"></canvas></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">L☉ = E · 4π · (1 a.b.)² = 1,4·10³ · 4π · (1,496·10¹¹)² ≈ 4·10²⁶ W</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t13F"></canvas></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.d)}: <b id="t13DV"></b></span><input type="range" class="lab-range" id="t13D" min="0.3" max="10" step="0.01" value="1"></label>
        <div class="lab-row" style="margin:0">${chips('fd',[[.387,'☿'],[.723,'♀'],[1,'⊕'],[1.524,'♂'],[5.2,'♃'],[9.54,'♄']])}</div><div class="lab-kv" id="t13FKv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t13R"></canvas><div class="lab-row"><button class="lab-chip" id="t13RP">▶</button><span class="t1-lab">${T(TX.days)}: <b id="t13RV"></b></span><input type="range" class="lab-range" id="t13RS" min="0" max="60" step="0.1" value="0" style="flex:1"></div></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.lat)}: <b id="t13LV"></b></span><input type="range" class="lab-range" id="t13L" min="0" max="80" step="1" value="0"></label><div class="lab-kv" id="t13RKv"></div></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="dz-card t1-chart"><h4>${T(TX.gran)}</h4><canvas class="t1-cv" id="t13G"></canvas></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p><div class="t1-two">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t13Sp"></canvas></div>
    <div class="dz-card t4-m"><h4>${T(TX.dark)}</h4><div class="lab-kv">${kv(T(TX.tP),'≈ 5800°')+kv(T(TX.tS),'≈ 4300°')+kv(T(TX.ratio),'(4300/5800)⁴ ≈ '+fmtN((4300/5800)**4,2),true)}</div></div></div>
    <div class="dz-card t1-chart"><h4>${T(TX.cycT)}</h4><p class="t1-p">${T(TX.cycD)}</p><canvas class="t1-cv" id="t13C"></canvas>
      <label class="t1-ctl"><span>${T(TX.yr)}: <b id="t13YV"></b></span><input type="range" class="lab-range" id="t13Y" min="1755" max="2030" step="0.1" value="2025"></label><div class="lab-kv" id="t13CKv"></div><p class="t1-cap">${T(TX.cap)}</p></div>`)}
  ${sec('06',K.U.gl,K.glHTML(GL))}
  ${sec('07',K.U.qa,K.qaHTML(QA))}
  ${sec('08',K.U.test,`<div class="dz-card t1-quiz" id="t13Quiz"></div>`)}`;

  /* 01 · O'lchamlar */
  K.draw(function(){ const cv=$('#t13Sz'); const {x,w,h}=fit(cv,.42,300), c=C(), R=h*1.5, cx=-R+w*.22, cy=h/2;
    x.save(); x.beginPath(); x.rect(0,0,w,h); x.clip(); sunG(x,cx,cy,R); x.restore(); lbl(x,T(X('Quyosh','Солнце','Sun')),w*.1,cy+4,'#7a3b10');
    const k=R/109, x0=w*.3, gap=(w-x0-10); let px=x0; const tot=PLR.reduce((s,p)=>s+p[1]*2*k+14,0), sc=Math.min(1,gap/tot);
    PLR.forEach(p=>{ const r=p[1]*k*sc; px+=r+7*sc; dot(x,px,cy,Math.max(1.2,r),p[2]); lbl(x,T(p[0]),px,cy+Math.max(r,4)+14,c.text); px+=r+7*sc; }); });

  /* 02 · Oqim */
  const drawF=K.draw(function(){ const cv=$('#t13F'); const {x,w,h}=fit(cv,.62,340), c=C(), d=+$('#t13D').value, cx=w*.08, cy=h/2;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); sunG(x,cx,cy,22);
    const sx=w*.08+Math.min(1,Math.log10(d*3.4)/Math.log10(34))*w*.82, half=(sx-cx)*.32;
    for(let i=-6;i<=6;i++){ x.strokeStyle='rgba(255,198,92,.25)'; x.beginPath(); x.moveTo(cx,cy); x.lineTo(sx+20,cy+i*half/6*1.06); x.stroke(); }
    x.strokeStyle='#ffc65c'; x.lineWidth=2; x.strokeRect(sx-3,cy-half*.17,6,half*.34);
    lbl(x,'1 m²',sx+12,cy-half*.17-6,'#ffc65c','left');
    const E=1367/d**2, ang=32/d;
    $('#t13DV').textContent=fmtN(d,2)+' a.b.';
    $('#t13FKv').innerHTML=kv(T(TX.flux),fmtN(E)+' W/m²',true)+kv('E / E⊕',fmtN(1/d**2,3))+kv(T(TX.sph),(4*Math.PI*(d*1.496e11)**2).toExponential(2).replace('.',',')+' m²')+kv(T(TX.Lsun),'≈ 4·10²⁶ W')+kv(T(TX.ang),ang<1?fmtN(ang*60)+'″':fmtN(ang,1)+'′'); mark('fd',''); });
  $('#t13D').oninput=drawF; on('fd',v=>{ $('#t13D').value=v; drawF(); mark('fd',v); });

  /* 03 · Differensial aylanish */
  let td=0, run=false, lt=0;
  const Pof=b=>{ const s=Math.sin(b*D2R)**2; return 360/(14.71-2.39*s-1.78*s*s); };
  const drawR=K.draw(function(){ const cv=$('#t13R'); const {x,w,h}=fit(cv,.8,380), c=C(), R=Math.min(w,h)*.42, cx=w/2, cy=h/2;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); sunG(x,cx,cy,R);
    x.strokeStyle='rgba(120,40,0,.25)'; x.lineWidth=1; for(let b=-60;b<=60;b+=30){ const yy=cy-R*Math.sin(b*D2R), rr=R*Math.cos(b*D2R); x.beginPath(); x.moveTo(cx-rr,yy); x.lineTo(cx+rr,yy); x.stroke(); }
    x.strokeStyle='#5a1d00'; x.lineWidth=3; x.beginPath(); let f=true;
    for(let b=-80;b<=80;b+=2){ const lon=(-50+td/Pof(b)*360)*D2R, cl=Math.cos(lon); if(cl<0){ f=true; continue; } const px=cx+R*Math.cos(b*D2R)*Math.sin(lon), py=cy-R*Math.sin(b*D2R); f?x.moveTo(px,py):x.lineTo(px,py); f=false; } x.stroke();
    for(let b=-75;b<=75;b+=15){ const lon=(-50+td/Pof(b)*360)*D2R; if(Math.cos(lon)<0) continue; dot(x,cx+R*Math.cos(b*D2R)*Math.sin(lon),cy-R*Math.sin(b*D2R),3.5,'#3a1000'); }
    const b=+$('#t13L').value; $('#t13LV').textContent=b+'°'; $('#t13RV').textContent=fmtN(td,1)+' '+T(TX.dd);
    $('#t13RKv').innerHTML=kv(T(TX.per)+' ('+b+'°)',fmtN(Pof(b),1)+' '+T(TX.dd),true)+kv(T(TX.per)+' (0°)',fmtN(Pof(0),1)+' '+T(TX.dd))+kv(T(TX.per)+' (60°)',fmtN(Pof(60),1)+' '+T(TX.dd)); });
  $('#t13L').oninput=drawR; $('#t13RS').oninput=e=>{ td=+e.target.value; drawR(); };
  const rStep=n=>{ if(!run) return; td+=Math.min(.05,(n-lt)/1000)*4; lt=n; if(td>60) td=0; $('#t13RS').value=td; drawR(); K.rafs.r=requestAnimationFrame(rStep); };
  $('#t13RP').onclick=()=>{ run=!run; $('#t13RP').textContent=run?'⏸':'▶'; click(700); if(run){ lt=performance.now(); K.rafs.r=requestAnimationFrame(rStep); } };

  /* 04 · Granulatsiya (Voronoi) */
  K.draw(function(){ const cv=$('#t13G'); const {x,w,h}=fit(cv,.36,240), c=C(), n=Math.round(w*h/1400), P=[]; let s=7;
    const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
    for(let i=0;i<n;i++) P.push([rnd()*w,rnd()*h,.75+rnd()*.25]);
    const img=x.createImageData(Math.ceil(w),Math.ceil(h)), dpr=1;
    const W=Math.ceil(w), H=Math.ceil(h), cell=40, grid={};
    P.forEach((p,i)=>{ const k=(p[0]/cell|0)+','+(p[1]/cell|0); (grid[k]=grid[k]||[]).push(i); });
    for(let yy=0;yy<H;yy++) for(let xx=0;xx<W;xx++){ let d1=1e9,d2=1e9,bi=0; const gx=xx/cell|0, gy=yy/cell|0;
      for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++){ const L=grid[(gx+a)+','+(gy+b)]; if(!L) continue; for(const i of L){ const dx=P[i][0]-xx, dy=P[i][1]-yy, d=dx*dx+dy*dy; if(d<d1){ d2=d1; d1=d; bi=i; } else if(d<d2) d2=d; } }
      const e=Math.sqrt(d2)-Math.sqrt(d1), k=Math.min(1,e/5)*P[bi][2]*(1-Math.sqrt(d1)/60*.35), o=(yy*W+xx)*4;
      img.data[o]=120+135*k; img.data[o+1]=50+140*k; img.data[o+2]=10+70*k; img.data[o+3]=255; }
    const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=H; tmp.getContext('2d').putImageData(img,0,0); x.drawImage(tmp,0,0,w,h);
    x.fillStyle='#fff'; x.fillRect(w-80,h-14,56,3); lbl(x,T(TX.scale),w-52,h-20,'#fff'); });

  /* 05 · Dog'lar */
  K.draw(function(){ const cv=$('#t13Sp'); const {x,w,h}=fit(cv,.75,320), c=C(), R=Math.min(w,h)*.44, cx=w/2, cy=h/2;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); sunG(x,cx,cy,R);
    const g=x.createRadialGradient(cx,cy,R*.6,cx,cy,R); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(90,30,0,.45)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.fill();
    x.fillStyle='rgba(255,140,40,.18)'; [[5,40],[-40,-5]].forEach(([a,b])=>{ const y1=cy-R*Math.sin(b*D2R), y2=cy-R*Math.sin(a*D2R); x.fillRect(cx-R,y1,2*R,y2-y1); });
    x.save(); x.beginPath(); x.arc(cx,cy,R,0,TAU); x.clip();
    const spot=(lat,lon,s)=>{ const px=cx+R*Math.cos(lat*D2R)*Math.sin(lon*D2R), py=cy-R*Math.sin(lat*D2R), f=Math.cos(lon*D2R); x.fillStyle='rgba(150,60,10,.75)'; x.beginPath(); x.ellipse(px,py,s*1.8*f,s*1.8,0,0,TAU); x.fill(); x.fillStyle='#2a0d00'; x.beginPath(); x.ellipse(px,py,s*f,s,0,0,TAU); x.fill(); };
    [[18,-20,7],[16,-12,4],[19,-6,5],[-14,25,6],[-12,33,3],[-25,-35,4],[28,40,3]].forEach(s=>spot(...s));
    x.fillStyle='rgba(255,240,200,.45)'; [[20,-30],[22,-2],[-10,40],[-16,18]].forEach(([a,b])=>{ const px=cx+R*Math.cos(a*D2R)*Math.sin(b*D2R), py=cy-R*Math.sin(a*D2R); for(let i=0;i<5;i++){ x.beginPath(); x.arc(px+i*4-8,py+(i%2)*3,2.2,0,TAU); x.fill(); } });
    x.restore();
    lbl(x,'+40°',cx+R+6,cy-R*Math.sin(40*D2R)+4,c.dim,'left'); lbl(x,'+5°',cx+R+6,cy-R*Math.sin(5*D2R)+4,c.dim,'left'); lbl(x,'−5°',cx+R+6,cy+R*Math.sin(5*D2R)+8,c.dim,'left'); lbl(x,'−40°',cx+R+6,cy+R*Math.sin(40*D2R)+4,c.dim,'left'); });
  const ssn=y=>{ for(let i=0;i<SSN.length-1;i++){ const a=SSN[i], b=SSN[i+1]; if(y>=a[0]&&y<=b[0]){ const t=(y-a[0])/(b[0]-a[0]), e=(1-Math.cos(t*Math.PI))/2; return [a[1]+(b[1]-a[1])*e, b[1]>a[1]]; } } return [SSN[SSN.length-1][1],false]; };
  const drawC=K.draw(function(){ const cv=$('#t13C'); const {x,w,h}=fit(cv,.3,220), c=C(), pl=30, pr=10, pt=10, pb=22, Y0=1755, Y1=2030, sx=y=>pl+(y-Y0)/(Y1-Y0)*(w-pl-pr), sy=v=>pt+(1-v/200)*(h-pt-pb), yr=+$('#t13Y').value;
    x.font='10px system-ui';
    [0,100,200].forEach(v=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(v)); x.lineTo(w-pr,sy(v)); x.stroke(); x.fillStyle=c.dim; x.textAlign='right'; x.fillText(v,pl-4,sy(v)+3); });
    for(let y=1800;y<=2000;y+=50) lbl(x,String(y),sx(y),h-6,c.dim);
    x.fillStyle=c.day?'rgba(200,120,40,.25)':'rgba(255,170,60,.25)'; x.beginPath(); x.moveTo(sx(Y0),sy(0)); for(let y=Y0;y<=2024.8;y+=.25) x.lineTo(sx(y),sy(ssn(y)[0])); x.lineTo(sx(2024.8),sy(0)); x.closePath(); x.fill();
    x.strokeStyle='#e8792a'; x.lineWidth=1.6; x.beginPath(); for(let y=Y0;y<=2024.8;y+=.25){ const v=sy(ssn(y)[0]); y===Y0?x.moveTo(sx(y),v):x.lineTo(sx(y),v); } x.stroke();
    x.strokeStyle=c.gold; x.lineWidth=1.5; x.setLineDash([3,3]); x.beginPath(); x.moveTo(sx(yr),pt); x.lineTo(sx(yr),h-pb); x.stroke(); x.setLineDash([]);
    const [v,rising]=yr<=2024.8?ssn(yr):[160*(1-(yr-2024.8)/5.5*.6),false], cyc=Math.floor((yr-1755.2)/11.1)+1, ph=((yr-1755.2)%11.1)/11.1;
    $('#t13YV').textContent=fmtN(yr,1);
    $('#t13CKv').innerHTML=kv(T(TX.cyc),'№ '+cyc)+kv(T(TX.wolf),'≈ '+fmtN(Math.max(0,v)),true)+kv(T(TX.phase),T(v>110?TX.max:v<25?TX.min:rising?X('o‘sish','рост','rising'):X('pasayish','спад','declining'))); });
  $('#t13Y').oninput=drawC;

  K.bindQA(); K.quiz($('#t13Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t13', GL, QZ, ico:'☀️', title:TX.title, sub:TX.sub, build });
}; go0();
})();
