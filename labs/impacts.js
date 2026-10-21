/* Tarixiy to'qnashuvlar — qaysi jism qachon qaysi osmon jismiga urilgan: real suratlar, ma'lumot va 3D qayta ijro */
(function(){
const {register,T,esc}=window.LAB;
const TX={ name:{uz:'Tarixiy to\'qnashuvlar',ru:'Исторические столкновения',en:'Historic impacts'},
  sub:{uz:'Qaysi jism qachon qaysi osmon jismiga urilgan — haqiqiy suratlar va 3D ko\'rinish',ru:'Что, когда и во что врезалось — настоящие снимки и 3D-вид',en:'What hit what, and when — real images and a 3D replay'},
  tgt:{uz:'Nishon',ru:'Цель',en:'Target'}, obj:{uz:'Urilgan jism',ru:'Ударник',en:'Impactor'}, size:{uz:'O\'lchami',ru:'Размер',en:'Size'},
  v:{uz:'Tezligi',ru:'Скорость',en:'Speed'}, E:{uz:'Energiya',ru:'Энергия',en:'Energy'}, res:{uz:'Oqibati',ru:'Последствия',en:'Outcome'},
  view:{uz:'🔭 3D da ko\'rish',ru:'🔭 Смотреть в 3D',en:'🔭 View in 3D'}, src:{uz:'manba',ru:'источник',en:'source'},
  scale:{uz:'Kichik hodisalar ko\'rinishi uchun masshtab kattalashtirilgan',ru:'Для наглядности масштаб малых событий увеличен',en:'Small events are scaled up so they are visible'} };
const I=(src,uz,ru,en,by,lic,page)=>({src,c:{uz,ru,en},by,lic,page});
const WM='https://commons.wikimedia.org/wiki/File:';
const EV=[
 { id:'theia', short:{uz:'Teya → Yer',ru:'Тейя → Земля',en:'Theia → Earth'},
   n:{uz:'Teya va Yer — Oyning tug\'ilishi',ru:'Тейя и Земля — рождение Луны',en:'Theia and Earth — birth of the Moon'},
   date:{uz:'~4,5 mlrd yil oldin',ru:'~4,5 млрд лет назад',en:'~4.5 billion years ago'},
   tgt:{uz:'Yosh Yer',ru:'Молодая Земля',en:'Young Earth'}, obj:{uz:'Teya — protosayyora',ru:'Тейя — протопланета',en:'Theia — a protoplanet'},
   size:{uz:'~6 000 km (Mars kattaligida)',ru:'~6 000 км (размером с Марс)',en:'~6,000 km (Mars-sized)'}, v:'~4 km/s',
   E:{uz:'Yer po\'sti to\'liq erigan',ru:'Кора Земли полностью расплавилась',en:'Earth’s crust melted completely'},
   res:{uz:'Chiqib ketgan moddadan Oy yig\'ilgan',ru:'Из выброшенного вещества собралась Луна',en:'The ejected debris gathered into the Moon'},
   d:{uz:'«Gigant to\'qnashuv» gipotezasiga ko\'ra yosh Yerga Mars kattaligidagi Teya qiya burchak ostida urilgan. Ikkala jismning bir qismi bug\'lanib, Yer atrofida qaynoq disk hosil qilgan va u tez orada Oyga yig\'ilgan. Apollon olib kelgan tuproq namunalarining tarkibi bu gipotezani qo\'llab-quvvatlaydi.',
      ru:'По гипотезе «гигантского столкновения» в молодую Землю по касательной врезалась Тейя размером с Марс. Часть вещества обоих тел испарилась, образовав вокруг Земли раскалённый диск, из которого вскоре собралась Луна. Состав образцов грунта «Аполлонов» поддерживает эту гипотезу.',
      en:'In the giant-impact hypothesis a Mars-sized body, Theia, struck the young Earth at a glancing angle. Part of both bodies vaporised into a hot disk around Earth that soon gathered into the Moon. The chemistry of Apollo soil samples supports the idea.'},
   img:[I('photos/impact-theia-1.jpg','Rassom tasavvuri: HD 172555 yulduzi atrofidagi sayyoralar to\'qnashuvi — Teya hodisasiga o\'xshash','Художественное изображение: столкновение планет у звезды HD 172555 — аналог события Тейи','Artist’s concept: a planetary collision at HD 172555 — an analogue of Theia','NASA/JPL-Caltech','Public domain',WM+'Artist%27s_concept_of_collision_at_HD_172555.jpg')],
   v3:{target:'earth',lat:8,lon:20,k:0.5,s:1.25,ang:58,tin:3.8,cam:6.5,theia:1,body:'theia'} },
 { id:'vredefort', short:{uz:'Vredefort',ru:'Вредефорт',en:'Vredefort'},
   n:{uz:'Vredefort krateri',ru:'Кратер Вредефорт',en:'Vredefort crater'},
   date:{uz:'~2 mlrd yil oldin',ru:'~2 млрд лет назад',en:'~2 billion years ago'},
   tgt:{uz:'Yer (Janubiy Afrika)',ru:'Земля (Южная Африка)',en:'Earth (South Africa)'}, obj:{uz:'Asteroid',ru:'Астероид',en:'Asteroid'},
   size:{uz:'~20–25 km',ru:'~20–25 км',en:'~20–25 km'}, v:'~20 km/s',
   E:{uz:'Chiksulubdan bir necha barobar kuchli',ru:'В несколько раз мощнее Чиксулуба',en:'Several times Chicxulub'},
   res:{uz:'Yerdagi eng katta ma\'lum krater (~250–300 km)',ru:'Крупнейший известный кратер Земли (~250–300 км)',en:'Largest known crater on Earth (~250–300 km)'},
   d:{uz:'Yerdagi eng qadimgi va eng katta tasdiqlangan zarba izi. Krater milliardlab yillar davomida yemirilgan, bugun faqat uning markaziy ko\'tarilgan gumbazi va halqasimon tepaliklari qolgan. 2005-yildan YUNESKO Jahon merosi ro\'yxatida.',
      ru:'Древнейший и крупнейший подтверждённый след удара на Земле. За миллиарды лет кратер сильно разрушен — сохранились лишь центральный купол и кольцевые холмы. С 2005 года — объект Всемирного наследия ЮНЕСКО.',
      en:'The oldest and largest confirmed impact scar on Earth. Billions of years of erosion have left only its central dome and ring of hills. A UNESCO World Heritage Site since 2005.'},
   img:[I('photos/impact-vredefort-1.jpg','Landsat 8 sun\'iy yo\'ldoshidan Vredefort gumbazi (2018)','Купол Вредефорт со спутника Landsat 8 (2018)','The Vredefort Dome from Landsat 8 (2018)','NASA Earth Observatory','Public domain',WM+'Vredefort_Crater,_South_Africa,_OLI_satellite_image,_27_June_2018.jpg')],
   v3:{target:'earth',lat:-27,lon:27.5,body:'vredefort',k:0.025,s:0.42,ang:40,cam:3.2} },
 { id:'chicxulub', short:{uz:'Chiksulub',ru:'Чиксулуб',en:'Chicxulub'},
   n:{uz:'Chiksulub — dinozavrlar oxiri',ru:'Чиксулуб — конец динозавров',en:'Chicxulub — end of the dinosaurs'},
   date:{uz:'66 mln yil oldin',ru:'66 млн лет назад',en:'66 million years ago'},
   tgt:{uz:'Yer (Yukatan, Meksika)',ru:'Земля (Юкатан, Мексика)',en:'Earth (Yucatán, Mexico)'}, obj:{uz:'Asteroid',ru:'Астероид',en:'Asteroid'},
   size:{uz:'~10 km',ru:'~10 км',en:'~10 km'}, v:'~20 km/s',
   E:{uz:'~100 mln megatonna',ru:'~100 млн мегатонн',en:'~100 million megatons'},
   res:{uz:'Krater 180 km; turlarning ~75% i, jumladan dinozavrlar yo\'qolgan',ru:'Кратер 180 км; вымерло ~75% видов, включая динозавров',en:'180 km crater; ~75% of species died out, dinosaurs included'},
   d:{uz:'Bo\'r davri oxirida sayoz dengizga urilgan asteroid gigant tsunami, o\'rmon yong\'inlari va yillar davom etgan «zarba qishi»ni keltirib chiqardi. Butun dunyo bo\'ylab shu davr qatlamida iridiy ko\'p — bu uning izi. Krater bugun Yukatan yarim oroli ostida ko\'milgan.',
      ru:'В конце мелового периода астероид упал в мелкое море, вызвав гигантское цунами, лесные пожары и многолетнюю «ударную зиму». По всему миру слой этого времени обогащён иридием — это его след. Сегодня кратер погребён под полуостровом Юкатан.',
      en:'At the end of the Cretaceous an asteroid hit a shallow sea, unleashing giant tsunamis, wildfires and a years-long “impact winter”. Worldwide, rock layers from that moment are rich in iridium — its fingerprint. The crater now lies buried beneath the Yucatán Peninsula.'},
   img:[I('photos/impact-chicxulub-1.jpg','Rassom tasavvuri: asteroid Yerga urilgan lahza (NASA)','Художественное изображение момента удара (NASA)','Artist’s impression of the moment of impact (NASA)','Donald E. Davis','Public domain',WM+'Chicxulub_impact_-_artist_impression.jpg'),
        I('photos/impact-chicxulub-2.png','Krater joylashuvi — Yukatan yarim oroli','Расположение кратера — полуостров Юкатан','Crater location — the Yucatán Peninsula','Anynobody','CC BY-SA 3.0',WM+'Chicxulub_crater.png')],
   v3:{target:'earth',lat:21.4,lon:-89.5,body:'chicxulub',k:0.02,s:0.34,ang:50,cam:3.1} },
 { id:'barringer', short:{uz:'Arizona krateri',ru:'Аризонский кратер',en:'Meteor Crater'},
   n:{uz:'Arizona meteorit krateri (Barringer)',ru:'Аризонский метеоритный кратер (Бэррингер)',en:'Meteor Crater (Barringer), Arizona'},
   date:{uz:'~50 000 yil oldin',ru:'~50 000 лет назад',en:'~50,000 years ago'},
   tgt:{uz:'Yer (Arizona, AQSh)',ru:'Земля (Аризона, США)',en:'Earth (Arizona, USA)'}, obj:{uz:'Temir meteorit',ru:'Железный метеорит',en:'Iron meteorite'},
   size:{uz:'~50 m',ru:'~50 м',en:'~50 m'}, v:'~13 km/s',
   E:{uz:'~10 megatonna',ru:'~10 мегатонн',en:'~10 megatons'},
   res:{uz:'Krater 1,2 km, chuqurligi 170 m',ru:'Кратер 1,2 км, глубина 170 м',en:'1.2 km wide, 170 m deep'},
   d:{uz:'Yerdagi eng yaxshi saqlangan zarba krateri. Aynan shu yerda olimlar kraterlar vulqondan emas, balki kosmosdan tushgan jismlardan hosil bo\'lishini birinchi bo\'lib isbotlagan. Atrofdan Canyon Diablo temir meteoritining bo\'laklari topilgan.',
      ru:'Лучше всего сохранившийся ударный кратер Земли. Именно здесь впервые доказали, что такие кратеры создают тела из космоса, а не вулканы. Вокруг найдены обломки железного метеорита Каньон Диабло.',
      en:'The best-preserved impact crater on Earth — the place where scientists first proved such craters come from space rather than volcanoes. Fragments of the Canyon Diablo iron meteorite litter the surroundings.'},
   img:[I('photos/impact-barringer-1.jpg','Krater havodan — Arizona sahrosi','Кратер с воздуха — пустыня Аризоны','The crater from above — Arizona desert','USGS National Map','Public domain',WM+'Meteor_Crater_-_Arizona.jpg')],
   v3:{target:'earth',lat:35.03,lon:-111.02,body:'iron',k:0.007,s:0.07,ang:40,cam:2.2,small:1} },
 { id:'tunguska', short:{uz:'Tunguska',ru:'Тунгуска',en:'Tunguska'},
   n:{uz:'Tunguska hodisasi',ru:'Тунгусское событие',en:'The Tunguska event'},
   date:{uz:'1908-yil 30-iyun',ru:'30 июня 1908',en:'30 June 1908'},
   tgt:{uz:'Yer (Sibir, Rossiya)',ru:'Земля (Сибирь, Россия)',en:'Earth (Siberia, Russia)'}, obj:{uz:'Tosh asteroid yoki kometa bo\'lagi',ru:'Каменный астероид или обломок кометы',en:'Stony asteroid or comet fragment'},
   size:{uz:'~50–60 m',ru:'~50–60 м',en:'~50–60 m'}, v:'~27 km/s',
   E:{uz:'10–15 megatonna',ru:'10–15 мегатонн',en:'10–15 megatons'},
   res:{uz:'5–10 km balandlikda portlagan; 2 150 km² o\'rmon (~80 mln daraxt) qulagan, krater yo\'q',ru:'Взрыв на высоте 5–10 км; повалено 2 150 км² леса (~80 млн деревьев), кратера нет',en:'Exploded 5–10 km up; 2,150 km² of forest (~80 million trees) flattened, no crater'},
   d:{uz:'Yozilgan tarixdagi eng kuchli zarba hodisasi. Jism yerga yetmay havoda portlagan, shuning uchun krater qolmagan. Portlash to\'lqini yuzlab kilometr uzoqdagi oynalarni sindirgan, keyingi tunlarda Yevropa osmoni g\'ayrioddiy yorug\' bo\'lgan.',
      ru:'Самое мощное ударное событие в письменной истории. Тело взорвалось в воздухе, не долетев до земли, поэтому кратера нет. Ударная волна выбивала стёкла за сотни километров, а ночи над Европой ещё несколько дней были необычно светлыми.',
      en:'The largest impact event in recorded history. The body burst in the air before reaching the ground, so no crater formed. The blast broke windows hundreds of kilometres away, and night skies over Europe glowed for days.'},
   img:[I('photos/impact-tunguska-1.jpg','Epimarkaz atrofidagi botqoqlik — ekspeditsiya surati (1930)','Болота у эпицентра — снимок экспедиции (1930)','Swamps near the epicentre — expedition photo (1930)','noma\'lum / unknown','Public domain',WM+'%D0%A2%D1%83%D0%BD%D0%B3%D1%83%D1%81_%D0%BC%D0%B5%D1%82%D0%B5%D0%BE%D1%80%D0%B8%D1%82_%D0%A2%D0%BE%D0%BF%D0%B8_%D0%A2%D1%83%D0%BD%D0%B3%D1%83%D1%81%D0%BA%D0%B8_%D0%B4%D0%BE14%D1%81%D0%B5%D0%BD%D1%821930_%D0%92%D0%A11931.JPG')],
   v3:{target:'earth',lat:60.9,lon:101.9,body:'stony',k:0.006,s:0.15,air:0.04,ang:55,cam:2.4,small:1} },
 { id:'sl9', short:{uz:'Shoemaker–Levy 9',ru:'Шумейкеров–Леви 9',en:'Shoemaker–Levy 9'},
   n:{uz:'Shoemaker–Levy 9 kometasi → Yupiter',ru:'Комета Шумейкеров–Леви 9 → Юпитер',en:'Comet Shoemaker–Levy 9 → Jupiter'},
   date:{uz:'1994-yil 16–22-iyul',ru:'16–22 июля 1994',en:'16–22 July 1994'},
   tgt:{uz:'Yupiter',ru:'Юпитер',en:'Jupiter'}, obj:{uz:'Kometa — 21 bo\'lak',ru:'Комета — 21 фрагмент',en:'Comet — 21 fragments'},
   size:{uz:'bo\'laklar 2 km gacha',ru:'фрагменты до 2 км',en:'fragments up to 2 km'}, v:'~60 km/s',
   E:{uz:'eng katta bo\'lak (G) ~6 mln megatonna',ru:'крупнейший фрагмент (G) ~6 млн мегатонн',en:'largest fragment (G) ~6 million megatons'},
   res:{uz:'Yerdan katta qora izlar oylab ko\'rinib turgan',ru:'Тёмные пятна крупнее Земли были видны месяцами',en:'Dark scars bigger than Earth lingered for months'},
   d:{uz:'Yupiter tortishish kuchi kometani 21 bo\'lakka ajratib yuborgan va bir hafta davomida ular ketma-ket sayyoraga urilgan. Odamzod ikki osmon jismining to\'qnashuvini birinchi marta jonli kuzatgan — Hubble va Galileo zondi ham suratga olgan.',
      ru:'Гравитация Юпитера разорвала комету на 21 фрагмент, и за неделю они один за другим врезались в планету. Человечество впервые наблюдало столкновение двух небесных тел вживую — его снимали «Хаббл» и зонд «Галилео».',
      en:'Jupiter’s gravity tore the comet into 21 pieces, which slammed into the planet one after another over a week. It was the first collision of two Solar System bodies ever watched live — Hubble and the Galileo probe both imaged it.'},
   img:[I('photos/impact-sl9-1.jpg','Hubble: Yupiterdagi zarba izlari zanjiri (1994)','«Хаббл»: цепочка следов ударов на Юпитере (1994)','Hubble: the chain of impact scars on Jupiter (1994)','NASA / Hubble','Public domain',WM+'Comet_Shoemaker-Levy_9_Leaves_Impact_Sites_on_Jupiter_(1994-31-175).jpg'),
        I('photos/impact-sl9-2.jpg','Hubble: izlar va qutb shafaqlari ultrabinafsha nurda','«Хаббл»: следы ударов и полярные сияния в ультрафиолете','Hubble: impact sites and aurorae in ultraviolet','Hubble Space Telescope Comet Team and NASA','Public domain',WM+'Jupiter_showing_SL9_impact_sites.jpg')],
   v3:{target:'jupiter',lat:-44,lon:0,body:'comet',k:0.012,s:0.12,ang:45,frags:5,cam:3} },
 { id:'chelyabinsk', short:{uz:'Chelyabinsk',ru:'Челябинск',en:'Chelyabinsk'},
   n:{uz:'Chelyabinsk meteori',ru:'Челябинский метеорит',en:'The Chelyabinsk meteor'},
   date:{uz:'2013-yil 15-fevral',ru:'15 февраля 2013',en:'15 February 2013'},
   tgt:{uz:'Yer (Ural, Rossiya)',ru:'Земля (Урал, Россия)',en:'Earth (Urals, Russia)'}, obj:{uz:'Tosh asteroid',ru:'Каменный астероид',en:'Stony asteroid'},
   size:{uz:'~18–20 m',ru:'~18–20 м',en:'~18–20 m'}, v:'~19 km/s',
   E:{uz:'~500 kiloton (Xirosimadan ~30 marta)',ru:'~500 килотонн (~30 Хиросим)',en:'~500 kilotons (~30 Hiroshimas)'},
   res:{uz:'~30 km balandlikda portlagan; ~1 500 kishi jarohatlangan',ru:'Взрыв на высоте ~30 км; ~1 500 пострадавших',en:'Burst ~30 km up; ~1,500 people injured'},
   d:{uz:'Tongda osmonni Quyoshdan yorqinroq yoritgan olovli shar minglab kameralarga tushgan. Asteroid juda qiya burchak ostida kirgan va havoda parchalangan. Portlash to\'lqini 7 200 dan ortiq binoning oynalarini sindirgan; eng katta bo\'lagi (~650 kg) Chebarkul ko\'lidan chiqarilgan.',
      ru:'Утренний болид ярче Солнца попал на тысячи камер. Астероид вошёл в атмосферу под очень пологим углом и разрушился в воздухе. Ударная волна выбила стёкла более чем в 7 200 зданиях; крупнейший обломок (~650 кг) подняли со дна озера Чебаркуль.',
      en:'A dawn fireball brighter than the Sun was caught on thousands of cameras. The asteroid came in at a very shallow angle and broke apart in the air. The shock wave shattered windows in over 7,200 buildings; the largest piece (~650 kg) was lifted from Lake Chebarkul.'},
   img:[I('photos/impact-chelyabinsk-1.jpg','Meteor qoldirgan tutun izi — Chelyabinsk osmoni','Дымный след метеора над Челябинском','The meteor’s smoke trail over Chelyabinsk','Alex Alishevskikh','CC BY-SA 2.0',WM+'2013_Chelyabinsk_meteor_trace.jpg')],
   v3:{target:'earth',lat:54.8,lon:61.1,body:'chondrite',k:0.005,s:0.1,air:0.05,ang:74,cam:2.3,small:1} },
 { id:'mars2021', short:{uz:'Mars 2021',ru:'Марс 2021',en:'Mars 2021'},
   n:{uz:'Marsdagi yangi krater (Amazoniya tekisligi)',ru:'Новый кратер на Марсе (равнина Амазония)',en:'A fresh crater on Mars (Amazonis Planitia)'},
   date:{uz:'2021-yil 24-dekabr',ru:'24 декабря 2021',en:'24 December 2021'},
   tgt:{uz:'Mars',ru:'Марс',en:'Mars'}, obj:{uz:'Meteoroid',ru:'Метеороид',en:'Meteoroid'},
   size:{uz:'~5–12 m',ru:'~5–12 м',en:'~5–12 m'}, v:'—',
   E:{uz:'InSight 4-magnitudali zilzilani qayd etgan',ru:'InSight зафиксировал марсотрясение магнитудой 4',en:'InSight recorded a magnitude-4 marsquake'},
   res:{uz:'Krater ~150 m; yuzaga yer osti muzi chiqib qolgan',ru:'Кратер ~150 м; на поверхность выброшен подземный лёд',en:'~150 m crater; buried ice thrown onto the surface'},
   d:{uz:'InSight qo\'nuvchi apparati 3 500 km uzoqdan zilzilani sezgan, keyin Mars Reconnaissance Orbiter yangi kraterni suratga olgan. Atrofga sochilgan oq bo\'laklar — muz. Bu muz ekvatorga shu qadar yaqinda topilishi kelajakdagi ekspeditsiyalar uchun muhim.',
      ru:'Посадочный модуль InSight почувствовал толчок за 3 500 км, а затем Mars Reconnaissance Orbiter сфотографировал свежий кратер. Белые обломки вокруг — это лёд. Лёд так близко к экватору важен для будущих экспедиций.',
      en:'The InSight lander felt the quake 3,500 km away; Mars Reconnaissance Orbiter then photographed the fresh crater. The white chunks around it are ice — finding ice this close to the equator matters for future crewed missions.'},
   img:[I('photos/impact-mars2021-1.jpg','MRO HiRISE: yangi krater va sochilgan muz bo\'laklari','MRO HiRISE: свежий кратер и разбросанный лёд','MRO HiRISE: the fresh crater and scattered ice','NASA/JPL-Caltech/University of Arizona','Public domain',WM+'HiRISE_ESP_073077_2155.jpg')],
   v3:{target:'mars',lat:35,lon:-170,body:'meteoroid',k:0.012,s:0.09,ang:45,cam:2.4,small:1} },
 { id:'dart', short:{uz:'DART → Dimorf',ru:'DART → Диморф',en:'DART → Dimorphos'},
   n:{uz:'DART zondi → Dimorf asteroidi',ru:'Зонд DART → астероид Диморф',en:'DART spacecraft → asteroid Dimorphos'},
   date:{uz:'2022-yil 26-sentabr',ru:'26 сентября 2022',en:'26 September 2022'},
   tgt:{uz:'Dimorf (Didim yo\'ldoshi)',ru:'Диморф (спутник Дидима)',en:'Dimorphos (moon of Didymos)'}, obj:{uz:'NASA DART zondi, 570 kg',ru:'Зонд NASA DART, 570 кг',en:'NASA DART probe, 570 kg'},
   size:{uz:'Dimorf ~160 m',ru:'Диморф ~160 м',en:'Dimorphos ~160 m'}, v:'6,1 km/s',
   E:{uz:'~10 GJ (~2,5 t trotil)',ru:'~10 ГДж (~2,5 т тротила)',en:'~10 GJ (~2.5 t of TNT)'},
   res:{uz:'Orbital davr 32 daqiqaga qisqargan',ru:'Орбитальный период сократился на 32 минуты',en:'Orbital period shortened by 32 minutes'},
   d:{uz:'Insoniyatning birinchi sayyoraviy mudofaa sinovi: zond ataylab kichik asteroidga urilib, uning orbitasini o\'zgartirgan. Zarbadan keyin Dimorfdan minglab kilometrga cho\'zilgan chang dumi paydo bo\'lgan. Kelajakda xavfli asteroidni shu usulda yo\'ldan burish mumkin.',
      ru:'Первый в истории тест планетарной защиты: зонд намеренно врезался в небольшой астероид и изменил его орбиту. После удара у Диморфа появился пылевой хвост длиной в тысячи километров. Так в будущем можно отвести опасный астероид.',
      en:'Humanity’s first planetary-defence test: the probe deliberately rammed a small asteroid and changed its orbit. Afterwards Dimorphos sprouted a dust tail thousands of kilometres long. A dangerous asteroid could one day be nudged aside this way.'},
   img:[I('photos/impact-dart-1.png','DART olgan Dimorfning oxirgi to\'liq surati — zarbadan ~2 soniya oldin','Последний полный снимок Диморфа с DART — за ~2 с до удара','DART’s last full image of Dimorphos — ~2 s before impact','NASA/Johns Hopkins APL','Public domain',WM+'Last_image_showing_all_of_Dimorphos_by_DART.png'),
        I('photos/impact-dart-2.png','Oxirgi 10 kadrdan yig\'ilgan kompozitsiya','Композиция из последних 10 кадров','Composite of the final 10 frames','NASA/Johns Hopkins APL','Public domain',WM+'Dimorphos_North-Up_Image_Composition_(final_10_full-frame_images).png')],
   v3:{target:'dart',body:'dart',k:0.12,s:0.9,ang:30,tin:3.2,cam:22} }
];
/* 3D ko'rish: Yerning o'sha davrdagi holati va zarba ta'sir qilgan hududlar (radius, km) */
const Z=(km,uz,ru,en)=>[km,{uz,ru,en}];
const ERA3={
 theia:{era:'theia',t:{uz:'Yer ~4,5 mlrd yil avval: magma okeani, Oy hali yo\'q',ru:'Земля ~4,5 млрд лет назад: магматический океан, Луны ещё нет',en:'Earth ~4.5 bn years ago: a magma ocean, no Moon yet'},
  z:[Z(2500,'Zarba nuqtasi — mantiya ochilib qolgan','Точка удара — обнажённая мантия','Impact point — mantle laid bare'),Z(20000,'Butun sayyora po\'sti erigan','Расплавилась вся кора планеты','The whole planet’s crust melted')]},
 vredefort:{era:'p2ga',t:{uz:'Yer ~2 mlrd yil avval: quruqlikda hayot yo\'q, qit\'alar kichik',ru:'Земля ~2 млрд лет назад: на суше нет жизни, континенты малы',en:'Earth ~2 bn years ago: lifeless land, small continents'},
  z:[Z(150,'Krater Ø ~300 km','Кратер Ø ~300 км','Crater Ø ~300 km'),Z(1000,'Erigan jinslar va zilzila','Расплав пород и землетрясения','Molten rock and quakes'),Z(3500,'Otilgan jinslar qatlami','Слой выброшенных пород','Ejecta blanket')]},
 chicxulub:{era:'k66',plat:24.5,plon:-73.3,t:{uz:'Yer 66 mln yil avval: Bo\'r davri qit\'alari, qutblarda muz yo\'q',ru:'Земля 66 млн лет назад: континенты мелового периода, без полярных льдов',en:'Earth 66 million years ago: Cretaceous continents, no polar ice'},
  z:[Z(90,'Krater Ø 180 km','Кратер Ø 180 км','Crater Ø 180 km'),Z(1500,'Megatsunami va M~11 zilzila','Мегацунами и землетрясение M~11','Mega-tsunami and M~11 quake'),Z(4500,'O\'rmon yong\'inlari, olovli jinslar yomg\'iri','Лесные пожары, дождь раскалённых обломков','Wildfires, rain of hot ejecta'),Z(20000,'Global «zarba qishi» — turlarning 75% i yo\'qoldi','Глобальная «ударная зима» — вымерло 75% видов','Global “impact winter” — 75% of species lost')]},
 barringer:{era:'ice',t:{uz:'Yer ~50 ming yil avval: muzlik davri, shimolda ulkan muz qalqonlari',ru:'Земля ~50 тыс. лет назад: ледниковый период, огромные ледники на севере',en:'Earth ~50,000 years ago: Ice Age, vast northern ice sheets'},
  z:[Z(0.6,'Krater Ø 1,2 km','Кратер Ø 1,2 км','Crater Ø 1.2 km'),Z(4,'Olovli shar — hamma narsa kuygan','Огненный шар — всё сгорело','Fireball — everything burned'),Z(20,'Zarba to\'lqini — daraxtlar va hayvonlar halok','Ударная волна — погибли деревья и животные','Shock wave — trees and animals killed')]},
 tunguska:{era:'now',t:{uz:'Yer 1908-yilda: sun\'iy yo\'ldoshlar hali yo\'q',ru:'Земля в 1908 году: спутников ещё нет',en:'Earth in 1908: no satellites yet'},
  z:[Z(8,'Epimarkaz — daraxtlar tik holda kuygan','Эпицентр — деревья сгорели стоя','Epicentre — trees scorched standing'),Z(26,'2 150 km² o\'rmon qulagan','Повалено 2 150 км² леса','2,150 km² of forest flattened'),Z(65,'Vanavara — odamlar yiqilgan','Ванавара — людей сбило с ног','Vanavara — people knocked down'),Z(600,'Oynalar singan, zarba eshitilgan','Выбиты стёкла, слышен грохот','Windows broken, blast heard')]},
 chelyabinsk:{era:'now',t:{uz:'Yer 2013-yilda',ru:'Земля в 2013 году',en:'Earth in 2013'},
  z:[Z(15,'Portlash ostidagi hudud (~30 km balandlik)','Под точкой взрыва (высота ~30 км)','Beneath the burst (~30 km up)'),Z(120,'7 200 bino oynasi singan, ~1 500 jarohat','Выбиты окна 7 200 зданий, ~1 500 пострадавших','Windows of 7,200 buildings broken, ~1,500 injured')]},
 sl9:{z:[Z(3000,'Har bir bo\'lak izi — Yer kattaligida','След каждого обломка — размером с Землю','Each fragment’s scar — Earth-sized'),Z(12000,'Qorong\'i izlar zanjiri — oylab ko\'rindi','Цепочка тёмных пятен — видна месяцами','Chain of dark scars — visible for months')]},
 mars2021:{z:[Z(0.075,'Krater Ø 150 m','Кратер Ø 150 м','Crater Ø 150 m'),Z(37,'Otilgan jinslar ~37 km gacha','Выбросы — до ~37 км','Ejecta up to ~37 km'),Z(3500,'InSight zilzilani sezdi','InSight зафиксировал толчок','InSight felt the quake')]}
};
register('impacts',{ ico:'☄', name:TX.name, sub:TX.sub,
  build(body, lab){
    lab.sel=lab.sel||'chicxulub'; lab.ph=0;
    const card='flex:0 0 160px;display:flex;flex-direction:column;gap:5px;padding:6px 6px 8px;border-radius:13px;border:1px solid var(--glass-brd);background:rgba(255,255,255,.04);color:var(--text);cursor:pointer;text-align:left;font:inherit';
    body.innerHTML=`<div id="ipTl" style="display:flex;gap:10px;overflow-x:auto;padding:2px 2px 10px;margin-bottom:12px;scrollbar-width:thin">${EV.map(e=>`<button data-e="${e.id}" style="${card}"><img src="${e.img[0].src}" alt="" loading="lazy" style="width:100%;height:84px;object-fit:cover;border-radius:9px;display:block" /><span style="font-size:11px;color:var(--neon);font-weight:700">${esc(T(e.date))}</span><span style="font-size:12.5px;font-weight:700;line-height:1.25">${esc(T(e.short))}</span></button>`).join('')}</div>
      <div class="lab-grid"><div><div style="border-radius:14px;overflow:hidden;border:1px solid var(--glass-brd);background:#02030a;aspect-ratio:16/10"><img id="ipImg" alt="" style="width:100%;height:100%;object-fit:contain;display:block;cursor:zoom-in" /></div>
        <div id="ipTh" style="display:flex;gap:8px;margin-top:8px"></div><p class="lab-note" id="ipCap" style="margin-top:8px"></p></div>
        <div><h4 id="ipN" style="font-size:20px;margin:0 0 4px;line-height:1.25"></h4><div id="ipD" style="font-size:12.5px;color:var(--neon);font-weight:700;margin-bottom:10px"></div>
          <p class="lab-p" id="ipDesc"></p><button class="lab-chip on" id="ipGo" style="font-size:14px;padding:10px 16px;margin-bottom:14px">${esc(T(TX.view))}</button><div class="lab-kv" id="ipKv"></div></div></div>`;
    const $=id=>body.querySelector('#'+id);
    const photo=()=>{ const e=EV.find(x=>x.id===lab.sel), p=e.img[lab.ph]||e.img[0];
      $('ipImg').src=p.src; $('ipImg').onclick=()=>window.open(p.page,'_blank','noopener');
      $('ipCap').innerHTML=`${esc(T(p.c))} — ${esc(p.by)} · ${esc(p.lic)} · <a href="${p.page}" target="_blank" rel="noopener" style="color:var(--neon)">${esc(T(TX.src))}</a>`;
      $('ipTh').querySelectorAll('button').forEach((b,i)=>b.style.borderColor=i===lab.ph?'var(--neon)':'var(--glass-brd)'); };
    const show=()=>{ const e=EV.find(x=>x.id===lab.sel); lab.ph=0;
      body.querySelectorAll('[data-e]').forEach(b=>{ const on=b.dataset.e===lab.sel; b.style.borderColor=on?'var(--neon)':'var(--glass-brd)'; b.style.background=on?'rgba(78,168,255,.12)':'rgba(255,255,255,.04)'; });
      $('ipTh').innerHTML=e.img.length>1?e.img.map((p,i)=>`<button data-p="${i}" style="width:74px;height:48px;padding:0;border-radius:8px;overflow:hidden;border:2px solid var(--glass-brd);background:none;cursor:pointer"><img src="${p.src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block" /></button>`).join(''):'';
      $('ipTh').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ lab.ph=+b.dataset.p; photo(); window.LAB.click(720); });
      $('ipN').textContent=T(e.n); $('ipD').textContent=T(e.date); $('ipDesc').textContent=T(e.d);
      const kv=[[TX.tgt,T(e.tgt)],[TX.obj,T(e.obj)],[TX.size,T(e.size)],[TX.v,e.v],[TX.E,T(e.E),1],[TX.res,T(e.res),1]];
      $('ipKv').innerHTML=kv.map(([k,v,w])=>`<div${w?' style="grid-column:1/-1"':''}><div class="k">${esc(T(k))}</div><div class="v">${esc(v)}</div></div>`).join('');
      photo(); };
    body.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{ lab.sel=b.dataset.e; show(); window.LAB.click(640); });
    $('ipGo').onclick=()=>{ const e=EV.find(x=>x.id===lab.sel); window.LAB.closeLab('impacts');
      if(window.__solar && window.__solar.impact) { const x=ERA3[e.id]||{};
        window.__solar.impact(Object.assign({},e.v3,{era:x.era,plat:x.plat,plon:x.plon}),{name:T(e.n),date:T(e.date),note:e.v3.small?T(TX.scale):'',era:x.t?T(x.t):'',zones:(x.z||[]).map(z=>[z[0],T(z[1])]),lab:'impacts'}); } };
    show();
  }
});
})();
