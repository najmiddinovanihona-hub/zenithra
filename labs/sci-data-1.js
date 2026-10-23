/* Astronom olimlar — ma'lumotlar (1-qism): Aristarx, Eratosfen, Gipparx, Ptolemey, Ariabhata, Chjan Xen, al-Xorazmiy, al-Farg‘oniy, al-Battoniy, as-Sufiy, Beruniy */
(function(){
'use strict';
const S=window.SCI_DATA=window.SCI_DATA||[];
const t=(uz,ru,en)=>({uz,ru,en});

/* ───────────── Aristarx Samoslik ───────────── */
S.push({
  id:'aristarchus',
  born:-310, died:-230,
  region:'ancient_greece',
  fields:['planets','cosmology','instruments'],
  name:t('Aristarx Samoslik','Аристарх Самосский','Aristarchus of Samos'),
  life:t('~mil. avv. 310 – ~230','~310 – ~230 до н. э.','c. 310 – c. 230 BC'),
  place:t('Samos oroli, Gretsiya','остров Самос, Греция','Island of Samos, Greece'),
  role:t('Qadimgi yunon astronomi va matematigi','Древнегреческий астроном и математик','Ancient Greek astronomer and mathematician'),
  short:t(
    'Tarixda birinchi bo‘lib Quyoshni olam markaziga qo‘ygan va Quyosh hamda Oygacha bo‘lgan masofalarni geometriya yordamida o‘lchashga uringan olim.',
    'Первым в истории поместил Солнце в центр мира и попытался измерить расстояния до Солнца и Луны с помощью геометрии.',
    'The first known thinker to place the Sun at the centre of the world, and to try to measure the distances to the Sun and Moon by geometry.'),
  about:t(
    'Aristarx Samoslik — miloddan avvalgi III asrda yashagan yunon astronomi. U Yer Quyosh atrofida aylanadi, degan geliotsentrik g‘oyani Kopernikdan qariyb 1800 yil oldin ilgari surgan. Uning yagona saqlanib qolgan asari — «Quyosh va Oyning kattaliklari va masofalari haqida» risolasi — osmon jismlarining o‘lchamlarini sof geometrik mulohaza bilan aniqlashga qaratilgan ilk ilmiy urinishdir. Natijalari son jihatdan noaniq bo‘lsa-da, usulining o‘zi fan tarixida burilish nuqtasi bo‘ldi.',
    'Аристарх Самосский — греческий астроном III века до н. э. Он выдвинул гелиоцентрическую идею о том, что Земля обращается вокруг Солнца, почти за 1800 лет до Коперника. Его единственное сохранившееся сочинение — трактат «О величинах и расстояниях Солнца и Луны» — первая научная попытка определить размеры небесных тел чисто геометрическим рассуждением. Хотя численные результаты были неточными, сам метод стал поворотным пунктом в истории науки.',
    'Aristarchus of Samos was a Greek astronomer of the 3rd century BC. He put forward the heliocentric idea that the Earth revolves around the Sun almost 1,800 years before Copernicus. His only surviving work, the treatise «On the Sizes and Distances of the Sun and Moon», is the first scientific attempt to determine the sizes of celestial bodies by purely geometric reasoning. Although his numerical results were inaccurate, the method itself became a turning point in the history of science.'),
  bio:[
    t('Aristarx taxminan miloddan avvalgi 310-yilda Egey dengizidagi Samos orolida tug‘ilgan. Bu orol avvalroq Pifagorning ham vatani bo‘lgan. Uning bolaligi va oilasi haqida deyarli hech qanday ishonchli ma’lumot saqlanmagan. Qadimgi mualliflarning yozishicha, u Afinadagi Litsey maktabining rahbari, fizik Straton Lampsakliyning shogirdi bo‘lgan.',
      'Аристарх родился около 310 года до н. э. на острове Самос в Эгейском море — родине Пифагора. О его детстве и семье почти не сохранилось надёжных сведений. По словам древних авторов, он был учеником физика Стратона из Лампсака, главы афинского Ликея.',
      'Aristarchus was born around 310 BC on the island of Samos in the Aegean Sea, which had earlier been the homeland of Pythagoras. Almost no reliable information about his childhood or family has survived. According to ancient authors, he was a pupil of the physicist Strato of Lampsacus, head of the Lyceum in Athens.'),
    t('Aristarx ellinizm davrida, ya’ni Iskandar Zulqarnayn yurishlaridan keyin yunon ilmi Iskandariya kabi yangi markazlarda gullab-yashnagan paytda ijod qilgan. Ptolemeyning «Almagest» asarida keltirilishicha, Aristarx miloddan avvalgi 280-yilda yozgi Quyosh turishini kuzatgan. Bu uning hayotiga oid aniq sanaga ega yagona ma’lumotlardan biridir.',
      'Аристарх работал в эллинистическую эпоху, когда после походов Александра Македонского греческая наука процветала в новых центрах, таких как Александрия. Согласно «Альмагесту» Птолемея, Аристарх наблюдал летнее солнцестояние в 280 году до н. э. Это одно из немногих точно датированных свидетельств о его жизни.',
      'Aristarchus worked in the Hellenistic era, when, after the campaigns of Alexander the Great, Greek science flourished in new centres such as Alexandria. According to Ptolemy’s «Almagest», Aristarchus observed the summer solstice in 280 BC. This is one of the very few precisely dated pieces of information about his life.'),
    t('Uning eng mashhur g‘oyasi — geliotsentrik tizim — o‘z asarlarida emas, balki Arximedning «Qum donalari hisobi» (Psammit) risolasida saqlanib qolgan. Arximedning yozishicha, Aristarx qo‘zg‘almas yulduzlar va Quyosh harakatsiz, Yer esa Quyosh atrofida aylana bo‘ylab aylanadi, deb faraz qilgan. Bundan tashqari, yulduzlar sferasi shunchalik ulkanki, Yer orbitasi unga nisbatan nuqtadek kichik, deb hisoblagan — bu yulduzlarda parallaks ko‘rinmasligini to‘g‘ri tushuntirar edi.',
      'Его самая знаменитая идея — гелиоцентрическая система — сохранилась не в его собственных трудах, а в трактате Архимеда «Исчисление песчинок» (Псаммит). По словам Архимеда, Аристарх предполагал, что неподвижные звёзды и Солнце не движутся, а Земля обращается вокруг Солнца по окружности. Кроме того, он считал сферу звёзд настолько огромной, что орбита Земли по сравнению с ней подобна точке, — это верно объясняло, почему у звёзд не заметен параллакс.',
      'His most famous idea, the heliocentric system, survives not in his own writings but in Archimedes’ treatise «The Sand Reckoner» (Psammites). According to Archimedes, Aristarchus supposed that the fixed stars and the Sun remain motionless, while the Earth revolves around the Sun in a circle. He also held that the sphere of the stars is so vast that the Earth’s orbit is like a point compared to it, which correctly explained why no stellar parallax could be seen.'),
    t('Plutarxning yozishicha, stoik faylasuf Kleanf Aristarxni Yerni — «olam o‘chog‘ini» — harakatga keltirgani uchun dahriylikda ayblash kerak, degan fikrni bildirgan. Geliotsentrik g‘oya qadimda keng qo‘llab-quvvatlanmagan: undan keyingi bir necha asr davomida Yer markazidagi (geotsentrik) tizim hukmron bo‘lib qoldi. Ma’lum bo‘lishicha, faqat miloddan avvalgi II asrda yashagan bobillik Selevk bu g‘oyani yoqlagan.',
      'По сообщению Плутарха, философ-стоик Клеанф считал, что Аристарха следует обвинить в нечестии за то, что тот сдвинул с места Землю — «очаг мира». Гелиоцентрическая идея не получила в древности широкой поддержки: несколько веков после него господствовала геоцентрическая система. Известно, что эту идею поддержал лишь Селевк из Вавилона во II веке до н. э.',
      'According to Plutarch, the Stoic philosopher Cleanthes thought Aristarchus should be charged with impiety for setting the Earth, «the hearth of the world», in motion. The heliocentric idea found little support in antiquity: for several centuries afterwards the Earth-centred (geocentric) system prevailed. As far as is known, only Seleucus of Babylon supported the idea in the 2nd century BC.'),
    t('Aristarx amaliy astronomiya bilan ham shug‘ullangan. Rim me’mori Vitruviyning ma’lumotiga ko‘ra, u yarim sharsimon quyosh soati — «skafe»ni ixtiro qilgan yoki takomillashtirgan. Uning vafot etgan joyi va sanasi aniq ma’lum emas; odatda taxminan miloddan avvalgi 230-yil deb ko‘rsatiladi. Oradan ko‘p asrlar o‘tib, Kopernik o‘z qo‘lyozmasida Aristarxning nomini tilga olgan va uning g‘oyasi nihoyat tiklangan.',
      'Аристарх занимался и практической астрономией. По сведениям римского архитектора Витрувия, он изобрёл или усовершенствовал полусферические солнечные часы — «скафе». Место и дата его смерти точно неизвестны; обычно указывают около 230 года до н. э. Много веков спустя Коперник упомянул имя Аристарха в своей рукописи, и его идея наконец была возрождена.',
      'Aristarchus also worked in practical astronomy. According to the Roman architect Vitruvius, he invented or improved the hemispherical sundial known as the «scaphe». The place and date of his death are not precisely known; it is usually given as around 230 BC. Many centuries later Copernicus mentioned Aristarchus by name in his manuscript, and his idea was finally revived.')
  ],
  works:[
    [-280, t('Yozgi Quyosh turishi kuzatuvi','Наблюдение летнего солнцестояния','Observation of the summer solstice'),
      t('Ptolemey «Almagest»da keltirgan kuzatuv. Keyinchalik Gipparx undan tropik yil uzunligini aniqlashda foydalangan.',
        'Наблюдение, приведённое Птолемеем в «Альмагесте». Позже Гиппарх использовал его для определения длины тропического года.',
        'An observation cited by Ptolemy in the «Almagest». Hipparchus later used it to determine the length of the tropical year.')],
    [-270, t('«Quyosh va Oyning kattaliklari va masofalari haqida»','«О величинах и расстояниях Солнца и Луны»','«On the Sizes and Distances of the Sun and Moon»'),
      t('Yagona saqlanib qolgan asari. 18 ta teoremadan iborat bo‘lib, Oy fazalari va Oy tutilishi kuzatuvlariga asoslanib, Quyosh va Oyning masofalari va o‘lchamlarini geometrik usulda hisoblaydi. Aniq yozilgan yili noma’lum.',
        'Единственное сохранившееся сочинение. Состоит из 18 теорем и на основе наблюдений лунных фаз и лунных затмений геометрически вычисляет расстояния и размеры Солнца и Луны. Точный год написания неизвестен.',
        'His only surviving work. It consists of 18 propositions and, on the basis of observations of lunar phases and lunar eclipses, geometrically calculates the distances and sizes of the Sun and Moon. The exact year of writing is unknown.')],
    [-250, t('Geliotsentrik faraz (Arximed bayonida)','Гелиоцентрическая гипотеза (в изложении Архимеда)','Heliocentric hypothesis (as reported by Archimedes)'),
      t('Aristarxning bu mavzudagi asari yo‘qolgan; g‘oya Arximedning «Qum donalari hisobi»da qisqacha bayon etilgan. Sana shartli.',
        'Сочинение Аристарха на эту тему утрачено; идея кратко изложена в «Исчислении песчинок» Архимеда. Дата условна.',
        'Aristarchus’ own work on this subject is lost; the idea is briefly described in Archimedes’ «Sand Reckoner». The date is approximate.')]
  ],
  disc:[
    ['☀️', t('Geliotsentrik olam modeli','Гелиоцентрическая модель мира','Heliocentric model of the world'),
      t('Yer o‘z o‘qi atrofida aylanadi va Quyosh atrofida harakatlanadi, Quyosh esa markazda harakatsiz turadi, degan g‘oya. Bu Kopernik tizimining eng qadimgi ma’lum o‘tmishdoshidir.',
        'Идея о том, что Земля вращается вокруг своей оси и движется вокруг Солнца, а Солнце неподвижно стоит в центре. Это самый ранний известный предшественник системы Коперника.',
        'The idea that the Earth spins on its axis and moves around the Sun, while the Sun stands motionless at the centre. It is the earliest known forerunner of the Copernican system.')],
    ['🌓', t('Oy choragi usuli','Метод лунной четверти','Half-moon (dichotomy) method'),
      t('Oy aniq yarmi yoritilganda Yer–Oy–Quyosh to‘g‘ri burchakli uchburchak hosil qiladi. Aristarx Oy va Quyosh orasidagi burchakni 87° deb o‘lchab, Quyosh Oydan 18–20 marta uzoqroq degan xulosaga kelgan. Usul to‘g‘ri, lekin burchakni aniq o‘lchash juda qiyin edi (haqiqiysi ~89°50′).',
        'Когда Луна освещена ровно наполовину, Земля, Луна и Солнце образуют прямоугольный треугольник. Измерив угол между Луной и Солнцем как 87°, Аристарх заключил, что Солнце в 18–20 раз дальше Луны. Метод верен, но точно измерить угол было очень трудно (истинное значение ~89°50′).',
        'When the Moon is exactly half lit, the Earth, Moon and Sun form a right triangle. Measuring the angle between the Moon and the Sun as 87°, Aristarchus concluded that the Sun is 18–20 times farther away than the Moon. The method is correct, but measuring the angle precisely was very difficult (the true value is about 89°50′).')],
    ['🌑', t('Tutilish yordamida Oy o‘lchamini aniqlash','Определение размера Луны по затмению','Sizing the Moon from an eclipse'),
      t('Oy tutilishi paytida Yer soyasining kengligini Oy diametri bilan taqqoslab, Oyning Yerdan ancha kichikligini ko‘rsatgan. U Oy diametrini Yer diametrining taxminan uchdan biri deb topgan (haqiqiysi ~0,27).',
        'Сравнивая ширину земной тени во время лунного затмения с диаметром Луны, он показал, что Луна значительно меньше Земли. Он нашёл диаметр Луны примерно равным трети диаметра Земли (истинное ~0,27).',
        'By comparing the width of the Earth’s shadow during a lunar eclipse with the diameter of the Moon, he showed that the Moon is much smaller than the Earth. He found the Moon’s diameter to be roughly a third of the Earth’s (true value ~0.27).')],
    ['🌍', t('Quyosh Yerdan ancha katta','Солнце намного больше Земли','The Sun is far larger than the Earth'),
      t('Hisoblariga ko‘ra Quyosh diametri Yernikidan 6–7 baravar katta, hajmi esa taxminan 300 baravar katta. Ehtimol, aynan katta jism kichigi atrofida aylanmasligi kerak, degan mulohaza uni geliotsentrizmga olib kelgan.',
        'По его расчётам, диаметр Солнца в 6–7 раз больше земного, а объём — примерно в 300 раз. Вероятно, именно мысль о том, что большое тело не должно обращаться вокруг меньшего, привела его к гелиоцентризму.',
        'By his calculations the Sun’s diameter is 6–7 times that of the Earth and its volume about 300 times greater. Probably the thought that a large body should not revolve around a smaller one led him to heliocentrism.')]
  ],
  instr:[
    [t('Skafe — yarim sharsimon quyosh soati','Скафе — полусферические солнечные часы','Scaphe — hemispherical sundial'),
      t('Vitruviyning yozishicha, Aristarx ichi chuqur kosa shaklidagi quyosh soatini ixtiro qilgan: kosa ichiga tushgan gnomon soyasi vaqtni va fasllarni ko‘rsatgan.',
        'По словам Витрувия, Аристарх изобрёл солнечные часы в виде углублённой чаши: тень гномона внутри чаши показывала время и времена года.',
        'According to Vitruvius, Aristarchus invented a sundial shaped like a hollow bowl: the shadow of the gnomon inside the bowl showed the time of day and the season.'),
      'ins:sundial']
  ],
  formulas:[
    { f:'d_{☉} / d_{☾} = 1 / cos θ', name:t('Aristarxning masofalar nisbati','Отношение расстояний Аристарха','Aristarchus’ distance ratio'),
      expl:t('Oy chorak fazasida Yer–Oy–Quyosh uchburchagida Oy uchidagi burchak to‘g‘ri. Shuning uchun Quyosh va Oygacha masofalar nisbati Yerdan o‘lchangan θ burchak kosinusiga teskari. θ = 87° da nisbat ≈ 19; haqiqiy θ ≈ 89°50′ da ≈ 390.',
        'В четверти Луны угол у Луны в треугольнике Земля–Луна–Солнце прямой. Поэтому отношение расстояний до Солнца и Луны обратно косинусу угла θ, измеренного с Земли. При θ = 87° отношение ≈ 19; при истинном θ ≈ 89°50′ — ≈ 390.',
        'At quarter Moon the angle at the Moon in the Earth–Moon–Sun triangle is a right angle. Hence the ratio of the distances to the Sun and Moon is the reciprocal of the cosine of the angle θ measured from the Earth. With θ = 87° the ratio is ≈ 19; with the true θ ≈ 89°50′ it is ≈ 390.'),
      vars:[ ['d_{☉}', t('Yerdan Quyoshgacha masofa','расстояние от Земли до Солнца','Earth–Sun distance')], ['d_{☾}', t('Yerdan Oygacha masofa','расстояние от Земли до Луны','Earth–Moon distance')], ['θ', t('Oy va Quyosh orasidagi burchak (chorak paytida)','угол между Луной и Солнцем (в четверти)','angle between Moon and Sun (at quarter)')] ] }
  ],
  tl:[
    [-310, t('Samos orolida tug‘ildi (taxminan)','Родился на острове Самос (приблизительно)','Born on the island of Samos (approx.)')],
    [-287, t('Straton Lampsakliy Litseyga rahbar bo‘ldi; Aristarx uning shogirdi sanaladi','Стратон из Лампсака возглавил Ликей; Аристарх считается его учеником','Strato of Lampsacus becomes head of the Lyceum; Aristarchus is counted among his pupils')],
    [-280, t('Yozgi Quyosh turishini kuzatdi (Ptolemey ma’lumoti)','Наблюдал летнее солнцестояние (по Птолемею)','Observed the summer solstice (according to Ptolemy)')],
    [-270, t('«Quyosh va Oyning kattaliklari va masofalari haqida» risolasi (taxminiy sana)','Трактат «О величинах и расстояниях Солнца и Луны» (примерная дата)','Treatise «On the Sizes and Distances of the Sun and Moon» (approximate date)')],
    [-250, t('Arximed «Qum donalari hisobi»da Aristarxning geliotsentrik farazini bayon qildi (taxminan)','Архимед изложил гелиоцентрическую гипотезу Аристарха в «Исчислении песчинок» (около)','Archimedes describes Aristarchus’ heliocentric hypothesis in «The Sand Reckoner» (approx.)')],
    [-230, t('Vafot etdi (taxminan)','Умер (приблизительно)','Died (approx.)')],
    [1543, t('Kopernikning «Osmon sferalarining aylanishi haqida» asari nashr etildi — geliotsentrizm qayta tiklandi','Издан труд Коперника «О вращении небесных сфер» — гелиоцентризм возрождён','Copernicus’ «On the Revolutions of the Heavenly Spheres» is published — heliocentrism revived')]
  ],
  table:{
    title:t('Aristarx natijalari va bugungi qiymatlar','Результаты Аристарха и современные значения','Aristarchus’ results and modern values'),
    cols:[t('Kattalik','Величина','Quantity'), t('Aristarx','Аристарх','Aristarchus'), t('Bugungi qiymat','Современное значение','Modern value')],
    rows:[
      [t('Chorak paytidagi Oy–Quyosh burchagi','Угол Луна–Солнце в четверти','Moon–Sun angle at quarter'), '87°', '≈ 89°50′'],
      [t('Quyosh masofasi / Oy masofasi','Расстояние до Солнца / до Луны','Sun distance / Moon distance'), '18–20', '≈ 390'],
      [t('Quyosh diametri / Yer diametri','Диаметр Солнца / диаметр Земли','Sun diameter / Earth diameter'), '≈ 6,3–7,2', '≈ 109'],
      [t('Oy diametri / Yer diametri','Диаметр Луны / диаметр Земли','Moon diameter / Earth diameter'), '≈ 0,32–0,40', '≈ 0,27']
    ],
    note:t('Aristarxning qiymatlari «Quyosh va Oyning kattaliklari va masofalari haqida» risolasidagi chegaralardan olingan.','Значения Аристарха взяты из границ, приведённых в трактате «О величинах и расстояниях Солнца и Луны».','Aristarchus’ values are taken from the bounds given in «On the Sizes and Distances of the Sun and Moon».')
  },
  facts:[
    t('Aristarxning geliotsentrik g‘oyasi haqida biz asosan Arximed tufayli bilamiz — uning o‘z asari saqlanmagan.','О гелиоцентрической идее Аристарха мы знаем в основном благодаря Архимеду — его собственный труд не сохранился.','We know of Aristarchus’ heliocentric idea mainly thanks to Archimedes; his own work has not survived.'),
    t('Arximedning yozishicha, Aristarx keyinchalik Oy va Quyoshning ko‘rinma diametrini zodiak doirasining 1/720 qismi, ya’ni yarim gradus deb aniqlagan — bu haqiqatga juda yaqin.','По словам Архимеда, Аристарх позднее определил видимый диаметр Солнца и Луны как 1/720 зодиакального круга, т. е. полградуса, — это очень близко к истине.','According to Archimedes, Aristarchus later found the apparent diameter of the Sun and Moon to be 1/720 of the zodiac circle, i.e. half a degree, which is very close to the truth.'),
    t('Aristarx usulidagi asosiy xato burchakni o‘lchashda edi: 87° o‘rniga 89°50′ bo‘lishi kerak edi. Bor-yo‘g‘i 3° farq natijani qariyb 20 baravar o‘zgartirib yuboradi.','Главная ошибка метода Аристарха была в измерении угла: вместо 87° должно быть 89°50′. Разница всего в 3° меняет результат почти в 20 раз.','The main error in Aristarchus’ method lay in measuring the angle: it should be 89°50′ rather than 87°. A difference of only 3° changes the result by a factor of almost 20.'),
    t('Kopernik qo‘lyozmasida Aristarxni eslatgan, ammo 1543-yilda nashr etilgan kitobdan bu jumla olib tashlangan.','Коперник упоминал Аристарха в рукописи, но в изданной в 1543 году книге этот фрагмент был вычеркнут.','Copernicus mentioned Aristarchus in his manuscript, but the passage was removed from the book published in 1543.')
  ],
  legacy:t(
    'Oydagi eng yorqin kraterlardan biri — Aristarx krateri va 3999 Aristarchus asteroidi uning nomi bilan atalgan. Aristarx tabiatni kuzatuv va geometriya bilan o‘lchash mumkinligini ko‘rsatgan birinchi olimlardan biri bo‘ldi. Bugun u ko‘pincha «qadimgi davrning Kopernigi» deb ataladi.',
    'Один из самых ярких кратеров Луны — кратер Аристарх — и астероид 3999 Аристарх названы в его честь. Аристарх одним из первых показал, что природу можно измерять наблюдением и геометрией. Сегодня его часто называют «Коперником древности».',
    'One of the brightest craters on the Moon, the crater Aristarchus, and the asteroid 3999 Aristarchus are named after him. Aristarchus was among the first to show that nature can be measured by observation and geometry. Today he is often called «the Copernicus of antiquity».')
});

/* ───────────── Eratosfen ───────────── */
S.push({
  id:'eratosthenes',
  born:-276, died:-194,
  region:'ancient_greece',
  fields:['calendar','math'],
  name:t('Eratosfen','Эратосфен Киренский','Eratosthenes of Cyrene'),
  life:t('~mil. avv. 276 – ~194','~276 – ~194 до н. э.','c. 276 – c. 194 BC'),
  place:t('Kirena (hozirgi Shahhat), Liviya','Кирена (ныне Шаххат), Ливия','Cyrene (modern Shahhat), Libya'),
  role:t('Yunon olimi, Iskandariya kutubxonasi rahbari, geograf va matematik','Греческий учёный, глава Александрийской библиотеки, географ и математик','Greek scholar, head of the Library of Alexandria, geographer and mathematician'),
  short:t(
    'Yer aylanasining uzunligini birinchi bo‘lib soya va geometriya yordamida hayratlanarli aniqlikda o‘lchagan olim.',
    'Первым измерил длину окружности Земли с помощью тени и геометрии — с поразительной точностью.',
    'The first to measure the circumference of the Earth, using a shadow and geometry, with remarkable accuracy.'),
  about:t(
    'Eratosfen — ellinizm davrining eng ko‘p qirrali olimlaridan biri: astronom, geograf, matematik, tarixchi va shoir. U Iskandariya kutubxonasiga rahbarlik qilgan va «geografiya» so‘zini ilmiy muomalaga kiritgan. Uning eng mashhur yutug‘i — ikki shahardagi Quyosh soyalari farqidan Yer aylanasini hisoblash. Tub sonlarni topish usuli — «Eratosfen g‘alviri» bugun ham matematikada o‘rgatiladi.',
    'Эратосфен — один из самых разносторонних учёных эллинистической эпохи: астроном, географ, математик, историк и поэт. Он возглавлял Александрийскую библиотеку и ввёл в научный оборот слово «география». Его самое известное достижение — вычисление окружности Земли по разнице солнечных теней в двух городах. Способ нахождения простых чисел — «решето Эратосфена» — изучают в математике и сегодня.',
    'Eratosthenes was one of the most versatile scholars of the Hellenistic age: astronomer, geographer, mathematician, historian and poet. He headed the Library of Alexandria and introduced the word «geography» into scholarly use. His most famous achievement is calculating the Earth’s circumference from the difference in solar shadows in two cities. His method of finding prime numbers, the «sieve of Eratosthenes», is still taught in mathematics today.'),
  bio:[
    t('Eratosfen taxminan miloddan avvalgi 276-yilda Shimoliy Afrikadagi yunon shahri Kirenada tug‘ilgan. Yoshligida u Afinaga borib, falsafa va adabiyotni o‘rgangan; u yerda stoik Zenon va Arkesilay kabi faylasuflar maktablari bilan tanishgan. Afinada u shoir va olim sifatida tanila boshladi.',
      'Эратосфен родился около 276 года до н. э. в греческом городе Кирена в Северной Африке. В юности он отправился в Афины, где изучал философию и литературу и познакомился со школами таких философов, как стоик Зенон и Аркесилай. В Афинах он стал известен как поэт и учёный.',
      'Eratosthenes was born around 276 BC in the Greek city of Cyrene in North Africa. As a young man he went to Athens to study philosophy and literature, becoming acquainted with the schools of philosophers such as the Stoic Zeno and Arcesilaus. In Athens he began to gain a reputation as a poet and scholar.'),
    t('Taxminan miloddan avvalgi 245-yilda Misr podshosi Ptolemey III Everget uni Iskandariyaga taklif qilgan. Eratosfen shahzoda (bo‘lajak Ptolemey IV) ning murabbiyi bo‘lgan va keyinroq qadimgi dunyoning eng yirik ilm markazi — Iskandariya kutubxonasining bosh kutubxonachisi lavozimini egallagan. U umrining oxirigacha shu lavozimda qolgan.',
      'Около 245 года до н. э. египетский царь Птолемей III Эвергет пригласил его в Александрию. Эратосфен стал наставником царевича (будущего Птолемея IV), а затем занял пост главного библиотекаря Александрийской библиотеки — крупнейшего научного центра древнего мира. Он оставался на этой должности до конца жизни.',
      'Around 245 BC the Egyptian king Ptolemy III Euergetes invited him to Alexandria. Eratosthenes became tutor to the crown prince (the future Ptolemy IV) and later took the post of chief librarian of the Library of Alexandria, the greatest centre of learning in the ancient world. He held this position for the rest of his life.'),
    t('Zamondoshlari uni «Beta» deb atashgan: go‘yo u har bir sohada ikkinchi o‘rinda, lekin barcha sohalarda yetuk edi. Yana bir laqabi — «Pentatlos» (beshkurashchi) — uning ko‘plab fanlarda bir vaqtda faol bo‘lganini anglatgan. Arximed unga o‘zining «Usul» nomli asarini bag‘ishlagan, bu esa Eratosfenning matematik obro‘si yuqori bo‘lganini ko‘rsatadi.',
      'Современники прозвали его «Бета»: будто бы во всех областях он был вторым, но зато во всех сразу. Другое прозвище — «Пентатл» (пятиборец) — означало, что он был активен одновременно во многих науках. Архимед посвятил ему своё сочинение «Метод», что говорит о высоком математическом авторитете Эратосфена.',
      'His contemporaries nicknamed him «Beta», as if he were second-best in every field, yet accomplished in all of them. Another nickname, «Pentathlos» (all-round athlete), referred to his activity in many sciences at once. Archimedes dedicated his work «The Method» to him, which shows Eratosthenes’ high standing as a mathematician.'),
    t('Eratosfenning eng mashhur ishi — Yer aylanasini o‘lchash. U yozgi Quyosh turishi kuni Siyenada (hozirgi Asvon) Quyosh tush paytida zenitda turishini, Iskandariyada esa shu paytda gnomon soyasi to‘liq doiraning 1/50 qismiga teng burchak hosil qilishini bilgan. Ikki shahar orasidagi masofani 5000 stadiy deb olib, u Yer aylanasini 250 000 stadiy deb hisoblagan (keyinchalik 252 000 stadiyga yaxlitlangan).',
      'Самая знаменитая работа Эратосфена — измерение окружности Земли. Он знал, что в день летнего солнцестояния в Сиене (ныне Асуан) Солнце в полдень стоит в зените, а в Александрии в тот же момент тень гномона образует угол, равный 1/50 полного круга. Приняв расстояние между городами за 5000 стадиев, он вычислил окружность Земли как 250 000 стадиев (позже округлено до 252 000).',
      'Eratosthenes’ most famous work is the measurement of the Earth’s circumference. He knew that on the day of the summer solstice the noon Sun stands at the zenith in Syene (modern Aswan), while at the same moment in Alexandria the shadow of a gnomon makes an angle of 1/50 of a full circle. Taking the distance between the cities as 5,000 stadia, he calculated the Earth’s circumference as 250,000 stadia (later rounded to 252,000).'),
    t('U geografiyani alohida fan sifatida shakllantirib, meridian va parallellar to‘riga asoslangan dunyo xaritasini tuzgan. Tarixda u voqealarni Troya qulashidan boshlab ilmiy sanash tizimini — xronologiyani yaratishga uringan. Rivoyatlarga ko‘ra, keksayib ko‘zi ojiz bo‘lib qolgach, u o‘qiy olmasligidan iztirob chekib, ochlik bilan o‘z joniga qasd qilgan; u taxminan miloddan avvalgi 194-yilda Iskandariyada vafot etgan.',
      'Он сформировал географию как отдельную науку и составил карту мира на основе сетки меридианов и параллелей. В истории он попытался создать научную систему датировки событий — хронологию, начиная с падения Трои. По преданию, ослепнув в старости и страдая от невозможности читать, он уморил себя голодом; он умер около 194 года до н. э. в Александрии.',
      'He shaped geography as a separate science and drew a world map based on a grid of meridians and parallels. In history he attempted to create a scientific system for dating events, a chronology starting from the fall of Troy. According to tradition, having gone blind in old age and grieving that he could no longer read, he starved himself to death; he died around 194 BC in Alexandria.')
  ],
  works:[
    [-240, t('«Yerning o‘lchami haqida»','«Об измерении Земли»','«On the Measurement of the Earth»'),
      t('Yer aylanasini o‘lchash usuli bayon etilgan asar. O‘zi saqlanmagan; mazmuni Kleomed va boshqa mualliflar orqali ma’lum. Sana taxminiy.',
        'Труд, где был изложен метод измерения окружности Земли. Сам он не сохранился; содержание известно через Клеомеда и других авторов. Дата приблизительна.',
        'The work describing his method of measuring the Earth’s circumference. It has not survived; its content is known through Cleomedes and other authors. Date approximate.')],
    [-230, t('«Geografika» (3 kitob)','«География» (3 книги)','«Geographika» (3 books)'),
      t('Ma’lum bo‘lgan dunyoning geografik tavsifi va meridian–parallellar to‘riga asoslangan xarita. «Geografiya» atamasining ilk qo‘llanishi shu asar bilan bog‘lanadi.',
        'Географическое описание известного мира и карта на основе сетки меридианов и параллелей. С этим трудом связывают первое употребление термина «география».',
        'A geographical description of the known world and a map based on a grid of meridians and parallels. The first use of the term «geography» is associated with this work.')],
    [-225, t('«Platonik» va kubni ikkilantirish yechimi','«Платоник» и решение удвоения куба','«Platonicus» and the doubling of the cube'),
      t('Matematika va musiqa nazariyasiga oid asar; Eratosfen kubni ikkilantirish masalasi uchun «mezolabium» nomli mexanik qurilmani taklif qilgan. Sana taxminiy.',
        'Сочинение по математике и теории музыки; для задачи удвоения куба Эратосфен предложил механическое приспособление «мезолабий». Дата приблизительна.',
        'A work on mathematics and music theory; for the problem of doubling the cube Eratosthenes proposed a mechanical device called the «mesolabe». Date approximate.')],
    [-220, t('«Xronografiya»','«Хронография»','«Chronographiai»'),
      t('Troya qulashidan boshlab muhim siyosiy va madaniy voqealarni sanalar bilan tartiblashga urinish — ilmiy xronologiyaning boshlanishi. Sana taxminiy.',
        'Попытка упорядочить по датам важные политические и культурные события начиная с падения Трои — начало научной хронологии. Дата приблизительна.',
        'An attempt to order important political and cultural events by date starting from the fall of Troy — the beginning of scientific chronology. Date approximate.')]
  ],
  disc:[
    ['🌍', t('Yer aylanasining o‘lchanishi','Измерение окружности Земли','Measuring the Earth’s circumference'),
      t('Ikki shahar orasidagi Quyosh balandligi farqi (7,2°) va masofa (5000 stadiy) asosida Yer aylanasini 250 000 stadiy deb topgan. Stadiy uzunligi aniq bo‘lmagani uchun natija taxminan 39 000–46 000 km ga to‘g‘ri keladi; haqiqiysi — 40 075 km.',
        'По разнице высоты Солнца в двух городах (7,2°) и расстоянию (5000 стадиев) он нашёл окружность Земли — 250 000 стадиев. Поскольку длина стадия точно неизвестна, результат соответствует примерно 39 000–46 000 км; истинное значение — 40 075 км.',
        'From the difference in the Sun’s altitude between two cities (7.2°) and the distance between them (5,000 stadia) he found the Earth’s circumference to be 250,000 stadia. Because the length of the stadion is uncertain, the result corresponds to roughly 39,000–46,000 km; the true value is 40,075 km.')],
    ['🔢', t('Eratosfen g‘alviri','Решето Эратосфена','Sieve of Eratosthenes'),
      t('Tub sonlarni topishning oddiy algoritmi: ketma-ket sonlardan har bir tub sonning karralilari o‘chirib boriladi, qolganlari tub sonlar bo‘ladi. Bugun ham dasturlashda keng qo‘llaniladi.',
        'Простой алгоритм нахождения простых чисел: из ряда чисел последовательно вычёркиваются кратные каждого простого, оставшиеся числа — простые. Широко применяется и сегодня в программировании.',
        'A simple algorithm for finding prime numbers: from a list of numbers the multiples of each prime are crossed out in turn, and what remains are the primes. It is still widely used in programming today.')],
    ['📐', t('Ekliptika og‘ishini o‘lchash','Измерение наклона эклиптики','Measuring the obliquity of the ecliptic'),
      t('Ptolemeyning yozishicha, Eratosfen qabul qilgan qiymat — tropiklar orasidagi yoy yarim doiraning 11/83 qismi — ekliptika og‘ishini taxminan 23°51′ deb beradi. Bu o‘sha davr uchun juda yaxshi natija.',
        'По Птолемею, значение, принятое Эратосфеном, — дуга между тропиками равна 11/83 полуокружности — даёт наклон эклиптики около 23°51′. Для своего времени это очень хороший результат.',
        'According to Ptolemy, the value accepted by Eratosthenes, that the arc between the tropics equals 11/83 of a semicircle, gives an obliquity of about 23°51′. For its time this is a very good result.')],
    ['🗺️', t('Ilmiy geografiyaning asosi','Основание научной географии','Foundation of scientific geography'),
      t('Joylarning o‘rnini meridian va parallellar orqali belgilash g‘oyasini tizimli qo‘llagan; bu kelajakdagi geografik uzunlik va kenglik tizimining boshlanishi bo‘ldi.',
        'Систематически применил идею определения положения мест по меридианам и параллелям; это стало началом будущей системы географических долгот и широт.',
        'He systematically applied the idea of locating places by meridians and parallels; this was the beginning of the later system of geographic longitude and latitude.')]
  ],
  instr:[
    [t('Gnomon','Гномон','Gnomon'),
      t('Tik o‘rnatilgan tayoqcha soyasining uzunligidan Quyoshning tush paytidagi balandligi aniqlangan. Iskandariyadagi gnomon soyasi Yer aylanasini hisoblashning asosiy kuzatuvi bo‘lgan.',
        'По длине тени вертикального стержня определялась полуденная высота Солнца. Тень гномона в Александрии была ключевым наблюдением для расчёта окружности Земли.',
        'The noon altitude of the Sun was determined from the length of the shadow of a vertical rod. The gnomon’s shadow in Alexandria was the key observation for calculating the Earth’s circumference.'),
      'ins:gnomon']
  ],
  formulas:[
    { f:'C = (360° / θ) · s', name:t('Eratosfen usuli','Метод Эратосфена','Eratosthenes’ method'),
      expl:t('Quyosh nurlari parallel bo‘lgani uchun ikki shahardagi soya burchaklarining farqi ular orasidagi markaziy burchakka teng. θ = 7,2° = 360°/50 va s = 5000 stadiy bo‘lsa, C = 50 · 5000 = 250 000 stadiy.',
        'Поскольку солнечные лучи параллельны, разница углов теней в двух городах равна центральному углу между ними. При θ = 7,2° = 360°/50 и s = 5000 стадиев C = 50 · 5000 = 250 000 стадиев.',
        'Because the Sun’s rays are parallel, the difference in shadow angles between two cities equals the central angle between them. With θ = 7.2° = 360°/50 and s = 5,000 stadia, C = 50 · 5,000 = 250,000 stadia.'),
      vars:[ ['C', t('Yer aylanasi','окружность Земли','Earth’s circumference')], ['θ', t('Iskandariyadagi soya burchagi (markaziy burchak)','угол тени в Александрии (центральный угол)','shadow angle in Alexandria (central angle)')], ['s', t('Siyena–Iskandariya masofasi','расстояние Сиена–Александрия','Syene–Alexandria distance')] ] }
  ],
  tl:[
    [-276, t('Kirenada tug‘ildi (taxminan)','Родился в Кирене (приблизительно)','Born in Cyrene (approx.)')],
    [-260, t('Afinada falsafa va adabiyotni o‘rgandi (taxminan)','Изучал философию и литературу в Афинах (около)','Studied philosophy and literature in Athens (approx.)')],
    [-245, t('Ptolemey III taklifi bilan Iskandariyaga keldi','По приглашению Птолемея III прибыл в Александрию','Came to Alexandria at the invitation of Ptolemy III')],
    [-240, t('Iskandariya kutubxonasining bosh kutubxonachisi bo‘ldi; Yer aylanasini o‘lchadi (taxminiy sanalar)','Стал главным библиотекарем Александрийской библиотеки; измерил окружность Земли (примерные даты)','Became chief librarian of the Library of Alexandria; measured the Earth’s circumference (approximate dates)')],
    [-230, t('«Geografika» asarini yozdi (taxminan)','Написал «Географию» (около)','Wrote the «Geographika» (approx.)')],
    [-194, t('Iskandariyada vafot etdi (taxminan)','Умер в Александрии (приблизительно)','Died in Alexandria (approx.)')]
  ],
  table:{
    title:t('Eratosfen o‘lchovlari va bugungi qiymatlar','Измерения Эратосфена и современные значения','Eratosthenes’ measurements and modern values'),
    cols:[t('Kattalik','Величина','Quantity'), t('Eratosfen','Эратосфен','Eratosthenes'), t('Bugungi qiymat','Современное значение','Modern value')],
    rows:[
      [t('Siyena–Iskandariya burchak farqi','Угловая разница Сиена–Александрия','Syene–Alexandria angle'), '7,2° (1/50)', '≈ 7,1°'],
      [t('Yer aylanasi, stadiy','Окружность Земли, стадии','Earth’s circumference, stadia'), '250 000 – 252 000', '—'],
      [t('Yer aylanasi, km','Окружность Земли, км','Earth’s circumference, km'), '≈ 39 000 – 46 000', '40 075'],
      [t('Ekliptika og‘ishi','Наклон эклиптики','Obliquity of the ecliptic'), '≈ 23°51′', '≈ 23°43′']
    ],
    note:t('Kilometrdagi qiymat qaysi stadiy (157,5 m yoki 185 m) nazarda tutilganiga bog‘liq. Og‘ishning bugungi qiymati Eratosfen davri (mil. avv. ~230-yil) uchun hisoblangan; hozir u ≈ 23°26′.','Значение в километрах зависит от того, какой стадий (157,5 м или 185 м) имелся в виду. Современное значение наклона рассчитано для эпохи Эратосфена (~230 г. до н. э.); сейчас он ≈ 23°26′.','The value in kilometres depends on which stadion (157.5 m or 185 m) was meant. The modern obliquity value is computed for Eratosthenes’ epoch (c. 230 BC); today it is ≈ 23°26′.')
  },
  facts:[
    t('Eratosfen Yerni aylanib chiqmasdan, faqat bir tayoq soyasi va geometriya yordamida uning o‘lchamini aniqlagan.','Эратосфен определил размер Земли, не обходя её, — только с помощью тени палки и геометрии.','Eratosthenes found the size of the Earth without travelling around it, using only the shadow of a stick and geometry.'),
    t('Zamondoshlari uni «Beta» deb atashgan — har bir fanda «ikkinchi», ammo barcha fanlarni egallagan olim.','Современники называли его «Бета» — «второй» в каждой науке, но владеющий всеми.','His contemporaries called him «Beta»: «second» in every science, yet master of them all.'),
    t('Arximed o‘zining «Usul» asarini Eratosfenga atab yozgan.','Архимед посвятил Эратосфену своё сочинение «Метод».','Archimedes addressed his work «The Method» to Eratosthenes.'),
    t('Bugun dunyo maktablarida «Eratosfen tajribasi» o‘tkaziladi: turli shaharlardagi o‘quvchilar bir kunda soyani o‘lchab, Yer aylanasini qayta hisoblaydi.','Сегодня в школах мира проводят «эксперимент Эратосфена»: ученики из разных городов в один день измеряют тень и заново вычисляют окружность Земли.','Today schools around the world run the «Eratosthenes experiment»: students in different cities measure a shadow on the same day and recalculate the Earth’s circumference.')
  ],
  legacy:t(
    'Oydagi Eratosfen krateri uning nomi bilan atalgan, Oy geologik tarixidagi bir davr esa «Eratosfen davri» deb nomlanadi. U geografiyaning otasi va ilmiy geodeziyaning asoschisi hisoblanadi. Uning usuli — kuzatuv, oddiy asbob va aniq mantiqning birikmasi — ilmiy fikrlashning ramzi bo‘lib qoldi.',
    'Кратер Эратосфен на Луне назван в его честь, а один из периодов геологической истории Луны называется «эратосфенским». Он считается отцом географии и основателем научной геодезии. Его метод — сочетание наблюдения, простого инструмента и строгой логики — стал символом научного мышления.',
    'The lunar crater Eratosthenes is named after him, and one period of the Moon’s geological history is called the «Eratosthenian period». He is regarded as the father of geography and the founder of scientific geodesy. His method, a combination of observation, a simple instrument and rigorous logic, has become a symbol of scientific thinking.')
});

/* ───────────── Gipparx ───────────── */
S.push({
  id:'hipparchus',
  born:-190, died:-120,
  region:'ancient_greece',
  fields:['stars','math','instruments'],
  name:t('Gipparx','Гиппарх','Hipparchus'),
  life:t('~mil. avv. 190 – ~120','~190 – ~120 до н. э.','c. 190 – c. 120 BC'),
  place:t('Nikeya (hozirgi Iznik), Turkiya','Никея (ныне Изник), Турция','Nicaea (modern İznik), Turkey'),
  role:t('Qadimgi yunon astronomi, trigonometriya asoschisi','Древнегреческий астроном, основатель тригонометрии','Ancient Greek astronomer, founder of trigonometry'),
  short:t(
    'Tengkunliklar presessiyasini kashf etgan, ilk yirik yulduz katalogini tuzgan va trigonometriyaga asos solgan antik davrning eng buyuk kuzatuvchi astronomi.',
    'Величайший астроном-наблюдатель античности: открыл прецессию равноденствий, составил первый крупный звёздный каталог и заложил основы тригонометрии.',
    'The greatest observational astronomer of antiquity: he discovered the precession of the equinoxes, compiled the first major star catalogue and laid the foundations of trigonometry.'),
  about:t(
    'Gipparx miloddan avvalgi II asrda asosan Rodos orolida ishlagan. U Bobil kuzatuvlari va o‘zining aniq o‘lchovlarini birlashtirib, astronomiyani sifat tavsifidan miqdoriy, hisoblanadigan fanga aylantirgan. Uning Quyosh va Oy nazariyalari, yulduz katalogi va xorda jadvallari keyinchalik Ptolemeyning «Almagest» asariga asos bo‘ldi. Asarlarining deyarli barchasi yo‘qolgan bo‘lsa-da, ularning mazmuni asosan Ptolemey orqali bizgacha yetib kelgan.',
    'Гиппарх работал во II веке до н. э., главным образом на острове Родос. Объединив вавилонские наблюдения со своими точными измерениями, он превратил астрономию из качественного описания в количественную, вычислительную науку. Его теории Солнца и Луны, звёздный каталог и таблицы хорд позже легли в основу «Альмагеста» Птолемея. Хотя почти все его сочинения утрачены, их содержание дошло до нас главным образом через Птолемея.',
    'Hipparchus worked in the 2nd century BC, mainly on the island of Rhodes. By combining Babylonian observations with his own precise measurements, he turned astronomy from a qualitative description into a quantitative, computational science. His theories of the Sun and Moon, his star catalogue and his tables of chords later formed the basis of Ptolemy’s «Almagest». Although almost all his writings are lost, their content has come down to us mainly through Ptolemy.'),
  bio:[
    t('Gipparx taxminan miloddan avvalgi 190-yilda Kichik Osiyodagi Nikeya shahrida (hozirgi Turkiyadagi Iznik) tug‘ilgan. Uning yoshligi va ta’limi haqida ma’lumot saqlanmagan. Rim davrida Nikeya tangalarida uning tasviri zarb etilgan bo‘lib, bu vatandoshlari uni qanchalik qadrlaganini ko‘rsatadi.',
      'Гиппарх родился около 190 года до н. э. в городе Никея в Малой Азии (ныне Изник в Турции). О его юности и образовании сведений не сохранилось. В римскую эпоху его изображение чеканили на монетах Никеи, что показывает, как высоко ценили его земляки.',
      'Hipparchus was born around 190 BC in the city of Nicaea in Asia Minor (modern İznik in Turkey). No information about his youth or education has survived. In Roman times his image was struck on coins of Nicaea, which shows how highly his fellow citizens valued him.'),
    t('Ptolemey keltirgan sanali kuzatuvlarga ko‘ra, Gipparx miloddan avvalgi 147–127-yillar oralig‘ida faol ishlagan. Kuzatuvlarining katta qismi Rodos orolida o‘tkazilgan; ba’zilari Iskandariyada bajarilgan bo‘lishi mumkin. U o‘zidan oldingi yunon astronomlari va ayniqsa Bobil astronomlarining asrlar davomida to‘plangan tutilish yozuvlaridan unumli foydalangan.',
      'По датированным наблюдениям, приведённым Птолемеем, Гиппарх активно работал в 147–127 годах до н. э. Большая часть его наблюдений проводилась на Родосе; некоторые, возможно, — в Александрии. Он широко использовал труды предшествующих греческих астрономов и особенно записи затмений, веками накопленные вавилонскими астрономами.',
      'According to the dated observations cited by Ptolemy, Hipparchus was active between 147 and 127 BC. Most of his observations were made on Rhodes; some may have been made in Alexandria. He made extensive use of the work of earlier Greek astronomers and especially of the eclipse records accumulated over centuries by Babylonian astronomers.'),
    t('Gipparxning eng katta kashfiyoti — tengkunliklar presessiyasi. U Spika yulduzining o‘zi o‘lchagan holatini taxminan 150 yil avval Timoxaris o‘lchagan holat bilan taqqoslab, yulduzlar uzunligi bir yo‘nalishda asta-sekin o‘zgarayotganini aniqlagan. Uning xulosasiga ko‘ra, bu siljish asrda kamida 1° ni tashkil etadi. Natijada u tropik yil (fasllar yili) yulduz yilidan biroz qisqa ekanini tushungan.',
      'Крупнейшее открытие Гиппарха — прецессия равноденствий. Сравнив измеренное им положение звезды Спика с положением, измеренным Тимохарисом примерно на 150 лет раньше, он установил, что долготы звёзд медленно смещаются в одном направлении. По его выводу, смещение составляет не менее 1° за столетие. В результате он понял, что тропический год (год сезонов) несколько короче звёздного.',
      'Hipparchus’ greatest discovery was the precession of the equinoxes. Comparing his own measurement of the position of the star Spica with that made by Timocharis about 150 years earlier, he found that the longitudes of the stars slowly shift in one direction. He concluded that the shift amounts to at least 1° per century. As a result he understood that the tropical year (the year of the seasons) is slightly shorter than the sidereal year.'),
    t('Pliniy Kattaning yozishicha, Gipparx osmonda yangi yulduz paydo bo‘lganini ko‘rib, yulduzlar ham o‘zgarishi mumkinligi haqida o‘ylagan va keyingi avlodlar o‘zgarishlarni kuzata olishi uchun yulduzlar ro‘yxatini tuzishga kirishgan. Uning katalogida taxminan 850 ta yulduzning koordinatalari bo‘lgan deb hisoblanadi. An’anaga ko‘ra, yulduzlarni yorqinligiga qarab olti kattalik sinfiga ajratish ham Gipparx nomi bilan bog‘lanadi.',
      'По сообщению Плиния Старшего, Гиппарх, увидев на небе новую звезду, задумался о том, что и звёзды могут меняться, и взялся составить список звёзд, чтобы потомки могли следить за изменениями. Считается, что его каталог содержал координаты примерно 850 звёзд. По традиции с именем Гиппарха связывают и деление звёзд по яркости на шесть классов величин.',
      'According to Pliny the Elder, Hipparchus, after seeing a new star appear in the sky, reflected that even the stars may change, and set out to compile a list of stars so that later generations could follow any changes. His catalogue is believed to have contained the coordinates of about 850 stars. By tradition, the division of stars by brightness into six classes of magnitude is also associated with Hipparchus.'),
    t('Gipparx Quyosh va Oyning notekis harakatini tushuntiruvchi geometrik modellar — ekstsentrik va epitsikl nazariyalarini ishlab chiqqan, bahor va yoz fasllarining uzunligi har xil (94½ va 92½ kun) ekanini hisobga olgan. U tutilishlarni oldindan hisoblash usulini yaratgan va Oygacha masofani Yer radiusining taxminan 60–70 baravari deb baholagan. Uning yagona saqlanib qolgan asari — Aratning yulduzlar haqidagi she’riy asariga yozilgan sharh. U taxminan miloddan avvalgi 120-yilda, ehtimol Rodosda vafot etgan.',
      'Гиппарх разработал геометрические модели, объясняющие неравномерное движение Солнца и Луны, — теории эксцентра и эпицикла, учтя, что весна и лето имеют разную продолжительность (94½ и 92½ дня). Он создал метод предвычисления затмений и оценил расстояние до Луны примерно в 60–70 земных радиусов. Его единственное сохранившееся сочинение — комментарий к поэме Арата о звёздах. Он умер около 120 года до н. э., вероятно на Родосе.',
      'Hipparchus developed geometric models explaining the uneven motion of the Sun and Moon, the eccentric and epicycle theories, taking into account that spring and summer have different lengths (94½ and 92½ days). He created a method for predicting eclipses and estimated the distance to the Moon at roughly 60–70 Earth radii. His only surviving work is a commentary on Aratus’ poem about the stars. He died around 120 BC, probably on Rhodes.')
  ],
  works:[
    [-140, t('Arat va Evdoks «Fenomenlar»iga sharh','Комментарий к «Явлениям» Арата и Евдокса','Commentary on the «Phaenomena» of Aratus and Eudoxus'),
      t('Gipparxning bizgacha to‘liq yetib kelgan yagona asari. Unda u yulduz turkumlarining avvalgi tavsiflaridagi xatolarni tuzatib, yulduzlarning chiqish va botish vaqtlarini aniq keltirgan. Sana taxminiy.',
        'Единственное полностью дошедшее до нас сочинение Гиппарха. В нём он исправил ошибки прежних описаний созвездий и точно привёл моменты восхода и захода звёзд. Дата приблизительна.',
        'The only work of Hipparchus to survive complete. In it he corrected errors in earlier descriptions of the constellations and gave precise times of the rising and setting of stars. Date approximate.')],
    [-130, t('«Kun-tun tengligi va Quyosh turishi nuqtalarining siljishi haqida»','«О смещении точек солнцестояний и равноденствий»','«On the Displacement of the Solstitial and Equinoctial Points»'),
      t('Presessiya kashfiyoti bayon etilgan asar. O‘zi yo‘qolgan, mazmuni Ptolemey orqali ma’lum. Sana taxminiy.',
        'Сочинение, где изложено открытие прецессии. Утрачено, содержание известно через Птолемея. Дата приблизительна.',
        'The work in which the discovery of precession was set out. It is lost; its content is known through Ptolemy. Date approximate.')],
    [-130, t('«Yil uzunligi haqida»','«О длине года»','«On the Length of the Year»'),
      t('Tropik yilni 365 + 1/4 − 1/300 kun deb aniqlagan asar. Yo‘qolgan; Ptolemey iqtibos keltirgan.',
        'Труд, в котором длина тропического года определена как 365 + 1/4 − 1/300 суток. Утрачен; цитируется Птолемеем.',
        'The work that determined the tropical year as 365 + 1/4 − 1/300 days. Lost; quoted by Ptolemy.')],
    [-129, t('Yulduz katalogi','Звёздный каталог','Star catalogue'),
      t('Taxminan 850 yulduzning holati va yorqinligi qayd etilgan ilk yirik katalog. Asli saqlanmagan; Ptolemey katalogining asosi bo‘lgan deb hisoblanadi. Sana taxminiy.',
        'Первый крупный каталог, где зафиксированы положения и блеск около 850 звёзд. Оригинал не сохранился; считается, что он лёг в основу каталога Птолемея. Дата приблизительна.',
        'The first major catalogue recording the positions and brightness of about 850 stars. The original has not survived; it is believed to have been the basis of Ptolemy’s catalogue. Date approximate.')]
  ],
  disc:[
    ['🌀', t('Tengkunliklar presessiyasi','Прецессия равноденствий','Precession of the equinoxes'),
      t('Bahorgi tengkunlik nuqtasi yulduzlarga nisbatan sekin g‘arbga siljishini aniqlagan. U siljishni asrda kamida 1° deb baholagan; bugungi qiymat — yiliga 50,3″, ya’ni har 71,6 yilda 1°.',
        'Установил, что точка весеннего равноденствия медленно смещается к западу относительно звёзд. Он оценил смещение не менее чем в 1° за столетие; современное значение — 50,3″ в год, т. е. 1° за 71,6 года.',
        'He found that the vernal equinox point slowly moves westward relative to the stars. He estimated the shift at no less than 1° per century; the modern value is 50.3″ per year, i.e. 1° every 71.6 years.')],
    ['⭐', t('Yulduz katalogi va kattaliklar','Звёздный каталог и величины','Star catalogue and magnitudes'),
      t('Taxminan 850 yulduz koordinatalarini o‘lchagan. Yulduzlarni yorqinligi bo‘yicha 1-dan 6-gacha kattalikka ajratish an’anasi uning nomi bilan bog‘lanadi — bu tizim zamonaviy yulduz kattaliklari shkalasining asosidir.',
        'Измерил координаты примерно 850 звёзд. С его именем связывают традицию деления звёзд по блеску на величины от 1-й до 6-й — эта система лежит в основе современной шкалы звёздных величин.',
        'He measured the coordinates of about 850 stars. The tradition of dividing stars by brightness into magnitudes 1 to 6 is associated with his name; this system underlies the modern stellar magnitude scale.')],
    ['📐', t('Trigonometriya: xordalar jadvali','Тригонометрия: таблица хорд','Trigonometry: table of chords'),
      t('Aylanadagi markaziy burchak va unga mos xorda uzunligi jadvalini tuzgan. Bu sinus funksiyasining o‘tmishdoshi bo‘lib, sferik osmon masalalarini son bilan yechish imkonini bergan. Shu sababli Gipparx trigonometriyaning asoschisi deb ataladi.',
        'Составил таблицу длин хорд, соответствующих центральным углам окружности. Это предшественник функции синуса, позволивший численно решать задачи небесной сферы. Поэтому Гиппарха называют основателем тригонометрии.',
        'He compiled a table of the lengths of chords corresponding to central angles of a circle. This forerunner of the sine function made it possible to solve problems of the celestial sphere numerically. For this reason Hipparchus is called the founder of trigonometry.')],
    ['☀️', t('Quyosh va Oy nazariyasi','Теория Солнца и Луны','Theory of the Sun and Moon'),
      t('Fasllarning teng emasligini Quyoshning ekstsentrik orbitasi bilan tushuntirgan; Oy harakati uchun ham geometrik model yaratib, tutilishlarni oldindan hisoblash imkonini bergan. Sinodik oy uzunligi uchun 29,53059 kun qiymatidan foydalangan.',
        'Объяснил неравенство времён года эксцентрической орбитой Солнца; создал геометрическую модель и для движения Луны, что позволило предвычислять затмения. Использовал для синодического месяца значение 29,53059 суток.',
        'He explained the inequality of the seasons by an eccentric orbit of the Sun; he also created a geometric model for the Moon’s motion, making it possible to predict eclipses. He used the value 29.53059 days for the synodic month.')],
    ['📏', t('Tropik yil uzunligi','Длина тропического года','Length of the tropical year'),
      t('Aristarx va o‘z kuzatuvlarini solishtirib, tropik yilni 365 kun 5 soat 55 daqiqa deb topgan — bugungi qiymatdan atigi ~6,5 daqiqa ko‘p.',
        'Сравнив наблюдения Аристарха и свои, нашёл тропический год равным 365 суткам 5 часам 55 минутам — всего на ~6,5 минуты больше современного значения.',
        'Comparing Aristarchus’ observations with his own, he found the tropical year to be 365 days 5 hours 55 minutes, only about 6.5 minutes longer than the modern value.')]
  ],
  instr:[
    [t('Armillyar sfera','Армиллярная сфера','Armillary sphere'),
      t('Osmon koordinatalarini o‘lchash uchun halqalardan iborat asbob. Ptolemeyning ma’lumotiga ko‘ra, Gipparx Iskandariyadagi ekvatorial halqa yordamida tengkunlik vaqtlarini kuzatgan.',
        'Прибор из колец для измерения небесных координат. По сведениям Птолемея, Гиппарх наблюдал моменты равноденствий с помощью экваториального кольца в Александрии.',
        'An instrument made of rings for measuring celestial coordinates. According to Ptolemy, Hipparchus observed the times of the equinoxes using the equatorial ring in Alexandria.'),
      'ins:armillary'],
    [t('Dioptra','Диоптра','Dioptra'),
      t('Oy va Quyoshning ko‘rinma diametrini o‘lchash uchun ko‘zlagichli nishon chizg‘ich; Gipparx uning bir turidan foydalangani Ptolemey orqali ma’lum.',
        'Визирная линейка для измерения видимого диаметра Солнца и Луны; через Птолемея известно, что Гиппарх пользовался одной из её разновидностей.',
        'A sighting rod for measuring the apparent diameter of the Sun and Moon; we know through Ptolemy that Hipparchus used a version of it.'),
      null]
  ],
  formulas:[
    { f:'crd θ = 2R · sin(θ/2)', name:t('Xorda funksiyasi','Функция хорды','Chord function'),
      expl:t('Gipparx jadvallarida R radiusli aylanadagi θ markaziy burchakka mos xorda uzunligi berilgan. Bugungi tilda bu sinus funksiyasi orqali ifodalanadi: xorda yarim burchak sinusining ikki baravariga (R birligida) teng.',
        'В таблицах Гиппарха приводилась длина хорды, соответствующей центральному углу θ в окружности радиуса R. На современном языке она выражается через синус: хорда равна удвоенному синусу половинного угла (в единицах R).',
        'Hipparchus’ tables gave the length of the chord corresponding to a central angle θ in a circle of radius R. In modern terms it is expressed through the sine: the chord equals twice the sine of half the angle (in units of R).'),
      vars:[ ['crd θ', t('θ burchakka mos xorda','хорда, стягивающая угол θ','chord subtending angle θ')], ['R', t('aylana radiusi','радиус окружности','radius of the circle')], ['θ', t('markaziy burchak','центральный угол','central angle')] ] },
    { f:'T_{trop} = 365 + 1/4 − 1/300 kun', name:t('Gipparx yili','Год Гиппарха','Hipparchus’ year'),
      expl:t('Gipparx tropik yilni Kallipp yilidan (365¼ kun) 1/300 kunga qisqa deb topgan: bu 365,2467 kun yoki 365 kun 5 soat 55 daqiqa 12 soniyaga teng.',
        'Гиппарх нашёл тропический год на 1/300 суток короче каллиппова (365¼ суток): это 365,2467 суток, или 365 суток 5 часов 55 минут 12 секунд.',
        'Hipparchus found the tropical year to be 1/300 of a day shorter than the Callippic year (365¼ days): that is 365.2467 days, or 365 days 5 hours 55 minutes 12 seconds.'),
      vars:[ ['T_{trop}', t('tropik yil uzunligi','длина тропического года','length of the tropical year')] ] }
  ],
  tl:[
    [-190, t('Nikeyada tug‘ildi (taxminan)','Родился в Никее (приблизительно)','Born in Nicaea (approx.)')],
    [-147, t('Ma’lum bo‘lgan eng qadimgi sanali kuzatuvi (kuzgi tengkunlik)','Самое раннее известное датированное наблюдение (осеннее равноденствие)','Earliest known dated observation (autumn equinox)')],
    [-141, t('Oy tutilishlarini kuzatib, Oy nazariyasi ustida ishladi','Наблюдал лунные затмения, работая над теорией Луны','Observed lunar eclipses while working on lunar theory')],
    [-134, t('Pliniy ma’lumotiga ko‘ra, «yangi yulduz»ni kuzatdi — katalog g‘oyasi tug‘ildi (taxminiy sana)','По Плинию, наблюдал «новую звезду» — возникла идея каталога (примерная дата)','According to Pliny, observed a «new star», prompting the idea of a catalogue (approximate date)')],
    [-130, t('Presessiyani kashf etdi (taxminan)','Открыл прецессию (около)','Discovered precession (approx.)')],
    [-127, t('Ma’lum bo‘lgan eng so‘nggi sanali kuzatuvi','Последнее известное датированное наблюдение','Latest known dated observation')],
    [-120, t('Vafot etdi (taxminan)','Умер (приблизительно)','Died (approx.)')],
    [1989, t('ESA «Hipparcos» astrometrik sun’iy yo‘ldoshini uchirdi','ЕКА запустило астрометрический спутник «Гиппаркос»','ESA launches the astrometric satellite «Hipparcos»')]
  ],
  table:{
    title:t('Gipparx qiymatlari va bugungi qiymatlar','Значения Гиппарха и современные значения','Hipparchus’ values and modern values'),
    cols:[t('Kattalik','Величина','Quantity'), t('Gipparx','Гиппарх','Hipparchus'), t('Bugungi qiymat','Современное значение','Modern value')],
    rows:[
      [t('Presessiya, yiliga','Прецессия, в год','Precession, per year'), '≥ 36″', '50,3″'],
      [t('Tropik yil, kun','Тропический год, сутки','Tropical year, days'), '365,2467', '365,2422'],
      [t('Sinodik oy, kun','Синодический месяц, сутки','Synodic month, days'), '29,53059', '29,53059'],
      [t('Oygacha masofa, Yer radiusida','Расстояние до Луны, в радиусах Земли','Distance to the Moon, Earth radii'), '≈ 60–70', '≈ 60,3']
    ],
    note:t('Gipparx qiymatlari Ptolemeyning «Almagest»i orqali ma’lum. Sinodik oy qiymati Bobil astronomiyasidan meros bo‘lishi mumkin.','Значения Гиппарха известны через «Альмагест» Птолемея. Значение синодического месяца, возможно, унаследовано от вавилонской астрономии.','Hipparchus’ values are known through Ptolemy’s «Almagest». The synodic month value may have been inherited from Babylonian astronomy.')
  },
  facts:[
    t('Gipparx o‘nlab asar yozgan, lekin ulardan faqat bittasi — Aratga sharh — to‘liq saqlangan.','Гиппарх написал десятки сочинений, но полностью сохранилось лишь одно — комментарий к Арату.','Hipparchus wrote dozens of works, but only one, the commentary on Aratus, survives complete.'),
    t('Uning tasviri Rim davrida Nikeya shahri tangalarida zarb etilgan.','В римскую эпоху его изображение чеканили на монетах города Никеи.','In Roman times his portrait was struck on the coins of the city of Nicaea.'),
    t('1989–1993-yillarda ishlagan ESA sun’iy yo‘ldoshi «Hipparcos» 118 mingdan ortiq yulduzning holatini yuqori aniqlikda o‘lchagan — nomi Gipparx sharafiga tanlangan.','Спутник ЕКА «Гиппаркос», работавший в 1989–1993 годах, с высокой точностью измерил положения более 118 тысяч звёзд — название выбрано в честь Гиппарха.','The ESA satellite «Hipparcos», which operated from 1989 to 1993, measured the positions of over 118,000 stars with high precision; its name was chosen in honour of Hipparchus.'),
    t('Gipparx Bobil astronomlarining asrlar davomida to‘plangan kuzatuvlarini yunon geometriyasi bilan birlashtirgan birinchi olimlardan biri edi.','Гиппарх был одним из первых, кто соединил многовековые наблюдения вавилонских астрономов с греческой геометрией.','Hipparchus was one of the first to combine centuries of Babylonian observations with Greek geometry.')
  ],
  legacy:t(
    'Oydagi Gipparx krateri va 4000 Hipparchus asteroidi uning nomi bilan atalgan. ESA ning «Hipparcos» astrometriya missiyasi va uning merosxo‘ri «Gaia» Gipparx boshlagan ishni — yulduzlar holatini aniq o‘lchashni davom ettirmoqda. Yulduz kattaliklari shkalasi, presessiya tushunchasi va trigonometriya bugun ham astronomiyaning asosiy vositalari bo‘lib qolmoqda.',
    'Кратер Гиппарх на Луне и астероид 4000 Гиппарх названы в его честь. Астрометрическая миссия ЕКА «Гиппаркос» и её преемница «Гайя» продолжают начатое Гиппархом дело — точное измерение положений звёзд. Шкала звёздных величин, понятие прецессии и тригонометрия и сегодня остаются основными инструментами астрономии.',
    'The lunar crater Hipparchus and the asteroid 4000 Hipparchus are named after him. ESA’s astrometry mission «Hipparcos» and its successor «Gaia» continue the work Hipparchus began: the precise measurement of stellar positions. The stellar magnitude scale, the concept of precession and trigonometry remain fundamental tools of astronomy today.')
});

/* ───────────── Klavdiy Ptolemey ───────────── */
S.push({
  id:'ptolemy',
  born:100, died:170,
  region:'ancient_greece',
  fields:['planets','stars','math'],
  name:t('Klavdiy Ptolemey','Клавдий Птолемей','Claudius Ptolemy'),
  life:t('~100 – ~170','~100 – ~170','c. 100 – c. 170'),
  place:t('Misr (ehtimol, Iskandariya)','Египет (вероятно, Александрия)','Egypt (probably Alexandria)'),
  role:t('Iskandariyalik astronom, matematik va geograf','Александрийский астроном, математик и географ','Alexandrian astronomer, mathematician and geographer'),
  short:t(
    'Qadimgi astronomiyaning cho‘qqisi bo‘lgan «Almagest» muallifi; uning geotsentrik tizimi 1400 yil davomida Yevropa va Islom olamida asosiy ilmiy model bo‘lib qoldi.',
    'Автор «Альмагеста» — вершины античной астрономии; его геоцентрическая система 1400 лет оставалась основной научной моделью в Европе и исламском мире.',
    'Author of the «Almagest», the summit of ancient astronomy; his geocentric system remained the main scientific model in Europe and the Islamic world for 1,400 years.'),
  about:t(
    'Klavdiy Ptolemey — Rim imperiyasi tarkibidagi Misrda, Iskandariyada ishlagan yunon tilli olim. Uning «Matematik tuzilma» asari arab tilida «al-Majistiy» deb atalib, Yevropaga «Almagest» nomi bilan qaytgan. Asarda Yer markazidagi olam modeli epitsikl, deferent va ekvant yordamida sayyoralar harakatini katta aniqlik bilan hisoblash imkonini bergan. Ptolemey shuningdek geografiya, optika va musiqa nazariyasi bo‘yicha ham muhim asarlar yozgan.',
    'Клавдий Птолемей — грекоязычный учёный, работавший в Александрии в римском Египте. Его «Математическое сочинение» в арабском переводе называлось «аль-Маджисти» и вернулось в Европу под названием «Альмагест». Изложенная в нём геоцентрическая модель с эпициклами, деферентами и эквантом позволяла с большой точностью вычислять движение планет. Птолемей также написал важные труды по географии, оптике и теории музыки.',
    'Claudius Ptolemy was a Greek-speaking scholar who worked in Alexandria in Roman Egypt. His «Mathematical Syntaxis» was called «al-Majisti» in Arabic and returned to Europe under the name «Almagest». The Earth-centred model it set out, with epicycles, deferents and the equant, made it possible to calculate the motions of the planets with great accuracy. Ptolemy also wrote important works on geography, optics and music theory.'),
  bio:[
    t('Ptolemeyning shaxsiy hayoti haqida juda kam ma’lumot bor. Uning ismi ikki qismdan iborat: «Klavdiy» Rim fuqaroligini, «Ptolemey» esa Misrdagi yunon-makedon muhitiga mansubligini ko‘rsatadi. U taxminan 100-yilda tug‘ilgan deb hisoblanadi. Uning Ptolemeylar sulolasidan bo‘lgan podsholar bilan qarindoshligi yo‘q.',
      'О личной жизни Птолемея известно очень мало. Его имя состоит из двух частей: «Клавдий» указывает на римское гражданство, а «Птолемей» — на принадлежность к греко-македонской среде Египта. Считается, что он родился около 100 года. С царями из династии Птолемеев он в родстве не состоял.',
      'Very little is known about Ptolemy’s personal life. His name has two parts: «Claudius» indicates Roman citizenship, while «Ptolemaeus» points to the Greco-Macedonian milieu of Egypt. He is thought to have been born around the year 100. He was not related to the kings of the Ptolemaic dynasty.'),
    t('«Almagest»da keltirilgan o‘z kuzatuvlari 127–141-yillarga oid bo‘lib, ular Iskandariyada o‘tkazilgan. Ptolemey Gipparx va boshqa o‘tmishdoshlarning ishlarini puxta o‘rganib, ularni yagona, izchil matematik tizimga birlashtirgan. U taxminan 150-yilda «Almagest»ni yakunlagan; asar 13 kitobdan iborat bo‘lib, Quyosh, Oy, tutilishlar, yulduzlar va sayyoralar nazariyasini qamrab olgan.',
      'Собственные наблюдения, приведённые в «Альмагесте», относятся к 127–141 годам и выполнены в Александрии. Птолемей тщательно изучил труды Гиппарха и других предшественников и объединил их в единую последовательную математическую систему. Около 150 года он завершил «Альмагест»; сочинение из 13 книг охватывает теорию Солнца, Луны, затмений, звёзд и планет.',
      'His own observations cited in the «Almagest» date from 127 to 141 and were made in Alexandria. Ptolemy carefully studied the work of Hipparchus and other predecessors and united it into a single, coherent mathematical system. He completed the «Almagest» around 150; the work, in 13 books, covers the theory of the Sun, Moon, eclipses, stars and planets.'),
    t('«Almagest»ning VII–VIII kitoblarida 48 ta yulduz turkumiga taqsimlangan 1022 ta yulduz katalogi berilgan. Bu 48 turkum bugungi 88 ta xalqaro yulduz turkumining asosini tashkil etadi. Sayyoralar harakatini tushuntirish uchun Ptolemey ekvant nuqtasini kiritgan: sayyora epitsiklining markazi aynan shu nuqtadan qaraganda tekis tezlikda harakat qiladi. Bu yangilik modelning aniqligini sezilarli oshirgan.',
      'В VII–VIII книгах «Альмагеста» приведён каталог 1022 звёзд, распределённых по 48 созвездиям. Эти 48 созвездий составляют основу современных 88 международных созвездий. Для объяснения движения планет Птолемей ввёл точку экванта: центр эпицикла планеты движется равномерно именно при взгляде из этой точки. Это нововведение заметно повысило точность модели.',
      'Books VII–VIII of the «Almagest» contain a catalogue of 1,022 stars arranged in 48 constellations. These 48 constellations form the basis of today’s 88 international constellations. To explain planetary motion Ptolemy introduced the equant point: the centre of a planet’s epicycle moves uniformly as seen from precisely this point. This innovation noticeably increased the accuracy of the model.'),
    t('Ptolemey «Almagest»dan tashqari bir qancha muhim asarlar yozgan. «Geografiya»da u taxminan 8000 ta joyning kenglik va uzunlik koordinatalarini berib, xarita chizish usullarini bayon qilgan. «Qo‘l jadvallari» astronomik hisob-kitoblarni osonlashtirgan, «Sayyoralar farazlari» esa olamning fizik tuzilishini tasvirlagan. «Optika»da u nurning sinishini tajriba yo‘li bilan o‘rgangan, «Tetrabiblos» astrologiyaga bag‘ishlangan.',
      'Помимо «Альмагеста», Птолемей написал ряд важных трудов. В «Географии» он привёл координаты широты и долготы около 8000 мест и изложил способы построения карт. «Подручные таблицы» облегчали астрономические расчёты, а «Планетные гипотезы» описывали физическое устройство мира. В «Оптике» он экспериментально изучал преломление света, «Тетрабиблос» посвящён астрологии.',
      'Besides the «Almagest», Ptolemy wrote several important works. In the «Geography» he gave the latitude and longitude of about 8,000 places and set out methods of map projection. The «Handy Tables» simplified astronomical calculations, while the «Planetary Hypotheses» described the physical structure of the cosmos. In the «Optics» he studied the refraction of light experimentally, and the «Tetrabiblos» is devoted to astrology.'),
    t('Ptolemey taxminan 170-yilda vafot etgan. IX asrda Bag‘doddagi «Bayt ul-hikma»da «Almagest» bir necha marta arab tiliga tarjima qilingan va Islom olami olimlari — al-Farg‘oniy, al-Battoniy, Beruniy va boshqalar uni o‘rganib, tuzatib, rivojlantirgan. 1175-yilda Gerard Kremonskiy uni arab tilidan lotin tiliga o‘girgan. Ptolemey tizimi faqat XVI–XVII asrlarda Kopernik, Kepler va Galiley ishlari bilan o‘rnini geliotsentrik tizimga bo‘shatdi.',
      'Птолемей умер около 170 года. В IX веке в багдадском «Доме мудрости» «Альмагест» несколько раз переводили на арабский, и учёные исламского мира — аль-Фаргани, аль-Баттани, Бируни и другие — изучали, исправляли и развивали его. В 1175 году Герард Кремонский перевёл его с арабского на латынь. Система Птолемея уступила место гелиоцентрической лишь в XVI–XVII веках благодаря трудам Коперника, Кеплера и Галилея.',
      'Ptolemy died around 170. In the 9th century the «Almagest» was translated into Arabic several times at the «House of Wisdom» in Baghdad, and scholars of the Islamic world, including al-Farghani, al-Battani and al-Biruni, studied, corrected and developed it. In 1175 Gerard of Cremona translated it from Arabic into Latin. Ptolemy’s system gave way to the heliocentric system only in the 16th and 17th centuries through the work of Copernicus, Kepler and Galileo.')
  ],
  works:[
    [150, t('«Almagest» (Matematik tuzilma, 13 kitob)','«Альмагест» («Математическое сочинение», 13 книг)','«Almagest» («Mathematical Syntaxis», 13 books)'),
      t('Antik astronomiyaning to‘liq qomusi: geotsentrik model, Quyosh va Oy nazariyasi, tutilishlar, 1022 yulduzli katalog va sayyoralar harakati. Sana taxminiy.',
        'Полная энциклопедия античной астрономии: геоцентрическая модель, теория Солнца и Луны, затмения, каталог 1022 звёзд и движение планет. Дата приблизительна.',
        'A complete encyclopaedia of ancient astronomy: the geocentric model, solar and lunar theory, eclipses, a 1,022-star catalogue and planetary motion. Date approximate.')],
    [150, t('«Geografiya» (8 kitob)','«География» (8 книг)','«Geography» (8 books)'),
      t('Taxminan 8000 joyning koordinatalari va xarita proyeksiyalari. Uyg‘onish davrida qayta kashf etilib, Yevropa kartografiyasiga katta ta’sir ko‘rsatgan. Sana taxminiy.',
        'Координаты около 8000 мест и картографические проекции. Вновь открыта в эпоху Возрождения и оказала большое влияние на европейскую картографию. Дата приблизительна.',
        'Coordinates of about 8,000 places and map projections. Rediscovered in the Renaissance, it had a great influence on European cartography. Date approximate.')],
    [160, t('«Qo‘l jadvallari»','«Подручные таблицы»','«Handy Tables»'),
      t('Sayyoralar, Quyosh va Oy holatlarini tez hisoblash uchun jadvallar to‘plami — keyingi zij (astronomik jadval)larning namunasi. Sana taxminiy.',
        'Собрание таблиц для быстрого расчёта положений планет, Солнца и Луны — образец для последующих зиджей (астрономических таблиц). Дата приблизительна.',
        'A collection of tables for quick calculation of the positions of the planets, Sun and Moon, a model for later zijes (astronomical tables). Date approximate.')],
    [160, t('«Sayyoralar farazlari»','«Планетные гипотезы»','«Planetary Hypotheses»'),
      t('Sayyoralar sferalari bir-birining ichiga joylashgan fizik olam modelini va masofalar tartibini tasvirlagan asar. Sana taxminiy.',
        'Сочинение, описывающее физическую модель мира с вложенными друг в друга сферами планет и порядок расстояний. Дата приблизительна.',
        'A work describing a physical model of the cosmos with nested planetary spheres and the order of distances. Date approximate.')],
    [160, t('«Optika»','«Оптика»','«Optics»'),
      t('Yorug‘likning qaytishi va sinishi bo‘yicha tajribalar; astronomik refraksiya masalasiga ham to‘xtalgan. Sana taxminiy.',
        'Опыты по отражению и преломлению света; затрагивается и вопрос астрономической рефракции. Дата приблизительна.',
        'Experiments on the reflection and refraction of light; it also touches on astronomical refraction. Date approximate.')]
  ],
  disc:[
    ['🌐', t('Ptolemey geotsentrik tizimi','Геоцентрическая система Птолемея','Ptolemaic geocentric system'),
      t('Yer markazda, sayyoralar esa deferent bo‘ylab harakatlanuvchi epitsikllarda aylanadi. Model sayyoralarning ortga (retrograd) harakatini tushuntirgan va ularning holatini bir necha daraja aniqlikda oldindan aytib bergan.',
        'Земля в центре, а планеты обращаются по эпициклам, движущимся по деферентам. Модель объясняла попятное (ретроградное) движение планет и предсказывала их положения с точностью до нескольких градусов.',
        'The Earth is at the centre, and the planets move on epicycles that travel along deferents. The model explained the retrograde motion of the planets and predicted their positions to within a few degrees.')],
    ['⚖️', t('Ekvant','Эквант','The equant'),
      t('Ekvant — epitsikl markazining burchak tezligi doimiy ko‘rinadigan nuqta. U Kepler qonunlari kashf etilgunga qadar sayyoralar tezligining o‘zgarishini eng yaxshi ifodalovchi usul bo‘lgan.',
        'Эквант — точка, из которой угловая скорость центра эпицикла кажется постоянной. До открытия законов Кеплера это был лучший способ описать изменение скорости планет.',
        'The equant is the point from which the angular velocity of the epicycle’s centre appears constant. Until Kepler’s laws were discovered, it was the best way to describe the varying speed of the planets.')],
    ['🌙', t('Oy evektsiyasi','Эвекция Луны','Lunar evection'),
      t('Oy harakatidagi ikkinchi notekislikni — evektsiyani kashf etgan va uni hisobga oladigan Oy modelini yaratgan.',
        'Открыл второе неравенство в движении Луны — эвекцию — и создал учитывающую её модель Луны.',
        'He discovered the second inequality in the Moon’s motion, evection, and created a lunar model that accounted for it.')],
    ['✨', t('1022 yulduzli katalog va 48 yulduz turkumi','Каталог 1022 звёзд и 48 созвездий','1,022-star catalogue and 48 constellations'),
      t('Yulduzlarning ekliptik koordinatalari va kattaliklari keltirilgan katalog. Uning 48 yulduz turkumi bugungi yulduz turkumlari tizimining poydevori.',
        'Каталог с эклиптическими координатами и величинами звёзд. Его 48 созвездий — фундамент современной системы созвездий.',
        'A catalogue giving the ecliptic coordinates and magnitudes of stars. Its 48 constellations are the foundation of today’s system of constellations.')]
  ],
  instr:[
    [t('Armillyar sfera («astrolabon»)','Армиллярная сфера («астролабон»)','Armillary sphere («astrolabon»)'),
      t('«Almagest»da tasvirlangan, bir-biriga kiygizilgan halqalardan iborat asbob; Ptolemey u bilan Oy va yulduzlarning ekliptik koordinatalarini o‘lchagan.',
        'Описанный в «Альмагесте» прибор из вложенных колец; Птолемей измерял с его помощью эклиптические координаты Луны и звёзд.',
        'An instrument of nested rings described in the «Almagest»; Ptolemy used it to measure the ecliptic coordinates of the Moon and stars.'),
      'ins:armillary'],
    [t('Devoriy kvadrant (plinf)','Стенной квадрант (плинфа)','Mural quadrant (plinth)'),
      t('Meridian tekisligida o‘rnatilgan tosh plita va uning chorak yoyi; tush paytida Quyosh balandligini o‘lchab, ekliptika og‘ishini aniqlashda ishlatilgan.',
        'Каменная плита с четвертью дуги, установленная в плоскости меридиана; служила для измерения полуденной высоты Солнца и определения наклона эклиптики.',
        'A stone slab with a quarter arc set in the meridian plane; it was used to measure the noon altitude of the Sun and determine the obliquity of the ecliptic.'),
      'ins:quadrant'],
    [t('Stereografik proyeksiya («Planisferiy»)','Стереографическая проекция («Планисферий»)','Stereographic projection («Planisphaerium»)'),
      t('Ptolemeyning «Planisferiy» risolasi osmon sferasini tekislikka proyeksiyalashni tushuntiradi — bu usul keyinchalik astrolyabiyaning matematik asosiga aylangan.',
        'Трактат Птолемея «Планисферий» объясняет проекцию небесной сферы на плоскость — этот способ позже стал математической основой астролябии.',
        'Ptolemy’s treatise «Planisphaerium» explains how to project the celestial sphere onto a plane; this method later became the mathematical basis of the astrolabe.'),
      'ins:astrolabe']
  ],
  formulas:[
    { f:'AC · BD = AB · CD + AD · BC', name:t('Ptolemey teoremasi','Теорема Птолемея','Ptolemy’s theorem'),
      expl:t('Aylanaga ichki chizilgan ABCD to‘rtburchakda diagonallar ko‘paytmasi qarama-qarshi tomonlar ko‘paytmalarining yig‘indisiga teng. Ptolemey bu teorema yordamida «Almagest»dagi xordalar jadvalini (½° qadam bilan) hisoblagan; undan sinuslarning qo‘shish formulalari kelib chiqadi.',
        'Во вписанном в окружность четырёхугольнике ABCD произведение диагоналей равно сумме произведений противоположных сторон. С помощью этой теоремы Птолемей вычислил таблицу хорд «Альмагеста» (с шагом ½°); из неё следуют формулы сложения синусов.',
        'In a quadrilateral ABCD inscribed in a circle, the product of the diagonals equals the sum of the products of the opposite sides. With this theorem Ptolemy computed the table of chords in the «Almagest» (in steps of ½°); the sine addition formulas follow from it.'),
      vars:[ ['AC, BD', t('to‘rtburchak diagonallari','диагонали четырёхугольника','diagonals of the quadrilateral')], ['AB, CD, AD, BC', t('to‘rtburchak tomonlari','стороны четырёхугольника','sides of the quadrilateral')] ] }
  ],
  tl:[
    [100, t('Misrda tug‘ildi (taxminan)','Родился в Египте (приблизительно)','Born in Egypt (approx.)')],
    [127, t('«Almagest»da keltirilgan eng qadimgi o‘z kuzatuvi','Самое раннее собственное наблюдение, приведённое в «Альмагесте»','Earliest of his own observations cited in the «Almagest»')],
    [141, t('Ma’lum bo‘lgan eng so‘nggi kuzatuvi','Последнее известное наблюдение','Latest known observation')],
    [150, t('«Almagest» yakunlandi (taxminan)','Завершён «Альмагест» (около)','«Almagest» completed (approx.)')],
    [170, t('Vafot etdi (taxminan)','Умер (приблизительно)','Died (approx.)')],
    [827, t('Bag‘dodda «Almagest»ning arabcha tarjimalaridan biri tayyorlandi (taxminan)','В Багдаде подготовлен один из арабских переводов «Альмагеста» (около)','One of the Arabic translations of the «Almagest» prepared in Baghdad (approx.)')],
    [1175, t('Gerard Kremonskiy «Almagest»ni lotin tiliga tarjima qildi','Герард Кремонский перевёл «Альмагест» на латынь','Gerard of Cremona translates the «Almagest» into Latin')],
    [1543, t('Kopernik geliotsentrik tizimni e’lon qildi — Ptolemey modelining inqirozi boshlandi','Коперник опубликовал гелиоцентрическую систему — начался закат модели Птолемея','Copernicus publishes the heliocentric system; the decline of the Ptolemaic model begins')]
  ],
  facts:[
    t('«Almagest» nomi arabcha «al-Majistiy» («eng buyuk») so‘zidan kelib chiqqan.','Название «Альмагест» происходит от арабского «аль-Маджисти» («величайший»).','The name «Almagest» comes from the Arabic «al-Majisti» («the greatest»).'),
    t('Ptolemeyning 48 yulduz turkumi hozir ham 88 ta rasmiy yulduz turkumi tarkibida saqlanib qolgan (Argo kemasi keyinchalik uch qismga bo‘lingan).','48 созвездий Птолемея и сейчас входят в число 88 официальных созвездий (созвездие Корабль Арго позднее разделили на три).','Ptolemy’s 48 constellations are still among the 88 official constellations (Argo Navis was later split into three).'),
    t('Ptolemey tizimi qariyb 1400 yil davomida sayyoralar holatini hisoblashda amaliy jihatdan muvaffaqiyatli ishlagan.','Система Птолемея почти 1400 лет практически успешно использовалась для расчёта положений планет.','Ptolemy’s system was used successfully in practice to calculate planetary positions for almost 1,400 years.'),
    t('«Geografiya»dagi xatolar — xususan Yer aylanasini kichik olish — Yevropada Osiyoga g‘arbdan suzib borish mumkin, degan fikrning paydo bo‘lishiga sabab bo‘lgan.','Ошибки «Географии» — в частности, заниженная окружность Земли — способствовали появлению в Европе мысли, что до Азии можно доплыть на запад.','Errors in the «Geography», notably an underestimated circumference of the Earth, encouraged the idea in Europe that Asia could be reached by sailing west.')
  ],
  legacy:t(
    'Oydagi Ptolemey krateri va Marsdagi Ptolemey krateri uning nomi bilan atalgan. «Almagest» Islom olami va o‘rta asrlar Yevropasi astronomiyasining asosiy darsligi bo‘lgan: Markaziy Osiyo olimlari ham uni sharhlab, tuzatgan. Uning modeli keyinchalik rad etilgan bo‘lsa-da, kuzatuvni matematik model bilan bog‘lash usuli zamonaviy fanning asosiy tamoyillaridan biridir.',
    'Кратер Птолемей на Луне и кратер Птолемей на Марсе названы в его честь. «Альмагест» был главным учебником астрономии исламского мира и средневековой Европы: его комментировали и исправляли и учёные Центральной Азии. Хотя его модель позже была отвергнута, метод связи наблюдений с математической моделью — один из основных принципов современной науки.',
    'The crater Ptolemaeus on the Moon and the crater Ptolemaeus on Mars are named after him. The «Almagest» was the main astronomy textbook of the Islamic world and medieval Europe; scholars of Central Asia also commented on and corrected it. Although his model was later rejected, the method of linking observation with a mathematical model is one of the fundamental principles of modern science.')
});

/* ───────────── Ariabhata ───────────── */
S.push({
  id:'aryabhata',
  born:476, died:550,
  region:'asia',
  fields:['planets','math'],
  name:t('Ariabhata','Ариабхата','Aryabhata'),
  life:t('476 – ~550','476 – ~550','476 – c. 550'),
  place:t('Kusumapura (Pataliputra, hozirgi Patna), Hindiston','Кусумапура (Паталипутра, ныне Патна), Индия','Kusumapura (Pataliputra, modern Patna), India'),
  role:t('Hind astronomi va matematigi','Индийский астроном и математик','Indian astronomer and mathematician'),
  short:t(
    'Yer o‘z o‘qi atrofida aylanadi, degan fikrni ilgari surgan, π sonini to‘rt xona aniqlikda bergan va tutilishlarning haqiqiy sababini tushuntirgan hind olimi.',
    'Индийский учёный, утверждавший, что Земля вращается вокруг своей оси, давший число π с точностью до четырёх знаков и объяснивший истинную причину затмений.',
    'Indian scholar who held that the Earth rotates on its axis, gave π to four decimal places and explained the true cause of eclipses.'),
  about:t(
    'Ariabhata — hind mumtoz astronomiyasi va matematikasining ilk yirik namoyandasi. U 23 yoshida yozgan «Ariabhatiya» asari qisqa she’riy satrlarda arifmetika, algebra, trigonometriya va astronomiyani qamrab olgan. Uning sinuslar jadvali, Yerning sutkalik aylanishi haqidagi g‘oyasi va tutilishlarning soya orqali izohi hind va keyinchalik Islom olami astronomiyasiga katta ta’sir ko‘rsatgan. Hindistonning birinchi sun’iy yo‘ldoshi uning nomi bilan atalgan.',
    'Ариабхата — первый крупный представитель классической индийской астрономии и математики. Его трактат «Ариабхатия», написанный в 23 года, в кратких стихотворных строках охватывает арифметику, алгебру, тригонометрию и астрономию. Его таблица синусов, идея суточного вращения Земли и объяснение затмений тенью оказали большое влияние на индийскую, а затем и исламскую астрономию. Первый спутник Индии назван в его честь.',
    'Aryabhata was the first major figure of classical Indian astronomy and mathematics. His treatise «Aryabhatiya», written at the age of 23, covers arithmetic, algebra, trigonometry and astronomy in short verses. His sine table, his idea of the Earth’s daily rotation and his explanation of eclipses by shadows had a great influence on Indian and later Islamic astronomy. India’s first satellite was named after him.'),
  bio:[
    t('Ariabhata o‘z asarida Kali-yuga davridan 3600 yil o‘tganda 23 yoshda bo‘lganini yozgan; bu milodiy 499-yilga to‘g‘ri keladi. Shunga ko‘ra u 476-yilda tug‘ilgan deb hisoblanadi. Uning tug‘ilgan joyi aniq ma’lum emas; ba’zi sharhlovchilar uni janubiy hududlar bilan bog‘laydi, lekin u hayotining asosiy qismini Gupta imperiyasining poytaxti Kusumapura (Pataliputra) shahrida o‘tkazgani ishonchli.',
      'Ариабхата сам написал в своём труде, что ему было 23 года, когда истекло 3600 лет эпохи Кали-юги; это соответствует 499 году н. э. Поэтому считается, что он родился в 476 году. Место его рождения точно неизвестно; некоторые комментаторы связывают его с южными областями, но достоверно, что большую часть жизни он провёл в Кусумапуре (Паталипутре), столице империи Гуптов.',
      'Aryabhata wrote in his own work that he was 23 years old when 3,600 years of the Kali Yuga had elapsed; this corresponds to AD 499. He is therefore believed to have been born in 476. His birthplace is not known for certain; some commentators link him with southern regions, but it is reliable that he spent most of his life in Kusumapura (Pataliputra), the capital of the Gupta Empire.'),
    t('Pataliputra o‘sha davrda Hindistonning muhim ilm markazi bo‘lgan. Ba’zi manbalar Ariabhata Nalanda ilm maskani bilan bog‘liq bo‘lgan bo‘lishi mumkin deb taxmin qiladi, ammo bu aniq isbotlanmagan. U Gupta davrining «oltin asri»da — fan, adabiyot va san’at gullagan paytda ijod qilgan.',
      'Паталипутра в то время была важным научным центром Индии. Некоторые источники предполагают, что Ариабхата мог быть связан с учёной обителью Наланда, но это достоверно не доказано. Он работал в «золотой век» эпохи Гуптов — время расцвета науки, литературы и искусства.',
      'At that time Pataliputra was an important centre of learning in India. Some sources suggest that Aryabhata may have been connected with the centre of learning at Nalanda, but this has not been firmly established. He worked during the «golden age» of the Gupta period, a time when science, literature and the arts flourished.'),
    t('499-yilda u «Ariabhatiya» asarini yakunlagan. Asar 4 bo‘limdan iborat: «Gitikapada» (asosiy astronomik kattaliklar), «Ganitapada» (matematika), «Kalakriyapada» (vaqt hisobi va sayyoralar harakati) va «Golapada» (osmon sferasi). Butun asar taxminan 121 ta she’riy satrdan tashkil topgan bo‘lib, yod olish uchun juda ixcham yozilgan. Ariabhata sonlarni harflar bilan ifodalovchi o‘ziga xos alifboli raqam tizimini ham ishlatgan.',
      'В 499 году он завершил «Ариабхатию». Трактат состоит из 4 разделов: «Гитикапада» (основные астрономические величины), «Ганитапада» (математика), «Калакрияпада» (счёт времени и движение планет) и «Голапада» (небесная сфера). Всё сочинение — около 121 стихотворной строфы, написанных очень сжато для запоминания. Ариабхата использовал и своеобразную алфавитную систему записи чисел буквами.',
      'In 499 he completed the «Aryabhatiya». The treatise has 4 sections: «Gitikapada» (basic astronomical constants), «Ganitapada» (mathematics), «Kalakriyapada» (reckoning of time and planetary motion) and «Golapada» (the celestial sphere). The whole work consists of about 121 verses, written very concisely for memorisation. Aryabhata also used a distinctive alphabetic numeral system that expressed numbers with letters.'),
    t('Ariabhata osmon sferasining sutkalik aylanishi aslida Yerning o‘z o‘qi atrofida aylanishidan kelib chiqadi, degan fikrni bildirgan va buni qayiqdagi odamga qirg‘oq orqaga harakatlanayotgandek ko‘rinishi bilan taqqoslagan. U Oy va sayyoralar Quyosh nurini qaytarib porlashini, Oy va Quyosh tutilishlari esa Yer va Oy soyalari tufayli sodir bo‘lishini tushuntirgan. Bu g‘oyalar uning davrida keng tarqalgan afsonaviy talqinlardan farq qilgan.',
      'Ариабхата высказал мысль, что суточное вращение небесной сферы на самом деле вызвано вращением Земли вокруг своей оси, и сравнил это с тем, как человеку в лодке кажется, будто берег движется назад. Он объяснил, что Луна и планеты светят отражённым солнечным светом, а лунные и солнечные затмения происходят из-за теней Земли и Луны. Эти идеи отличались от распространённых в его время мифологических толкований.',
      'Aryabhata stated that the daily rotation of the celestial sphere is really caused by the Earth turning on its axis, comparing it to how the shore seems to move backwards to a man in a boat. He explained that the Moon and planets shine by reflected sunlight, and that lunar and solar eclipses occur because of the shadows of the Earth and Moon. These ideas differed from the mythological interpretations widespread in his time.'),
    t('U taxminan 550-yilda vafot etgan. Uning maktabi juda ta’sirli bo‘lgan: Bhaskara I (VII asr) «Ariabhatiya»ga sharh yozgan, keyingi hind astronomlari esa uni asosiy manba sifatida o‘rgangan. Ariabhatadan kelgan hind astronomiyasi an’analari VIII–IX asrlarda Bag‘dodga yetib borib, Islom olami olimlariga, jumladan al-Xorazmiyning «Sindhind zij»iga ta’sir ko‘rsatgan.',
      'Он умер около 550 года. Его школа была весьма влиятельной: Бхаскара I (VII век) написал комментарий к «Ариабхатии», а последующие индийские астрономы изучали её как основной источник. Традиции индийской астрономии, восходящие к Ариабхате, в VIII–IX веках достигли Багдада и повлияли на учёных исламского мира, в том числе на «Зидж ас-Синдхинд» аль-Хорезми.',
      'He died around 550. His school was very influential: Bhaskara I (7th century) wrote a commentary on the «Aryabhatiya», and later Indian astronomers studied it as a primary source. Traditions of Indian astronomy going back to Aryabhata reached Baghdad in the 8th–9th centuries and influenced scholars of the Islamic world, including al-Khwarizmi’s «Zij al-Sindhind».')
  ],
  works:[
    [499, t('«Ariabhatiya»','«Ариабхатия»','«Aryabhatiya»'),
      t('Sanskrit tilidagi she’riy risola: arifmetika, algebra, tekis va sferik trigonometriya, sayyoralar harakati, tutilishlar va osmon sferasi. Hind astronomiyasining asosiy matnlaridan biri.',
        'Стихотворный трактат на санскрите: арифметика, алгебра, плоская и сферическая тригонометрия, движение планет, затмения и небесная сфера. Один из основных текстов индийской астрономии.',
        'A verse treatise in Sanskrit: arithmetic, algebra, plane and spherical trigonometry, planetary motion, eclipses and the celestial sphere. One of the fundamental texts of Indian astronomy.')],
    [510, t('«Ariabhata-siddhanta»','«Арьябхата-сиддханта»','«Aryabhata-siddhanta»'),
      t('Astronomik hisoblar bo‘yicha boshqa asari; o‘zi yo‘qolgan, keyingi mualliflarning iqtiboslari orqali qisman ma’lum. Unda bir qancha astronomik asboblar tasvirlangani aytiladi. Sana taxminiy.',
        'Другое сочинение по астрономическим расчётам; утрачено, частично известно по цитатам поздних авторов. Говорится, что в нём были описаны некоторые астрономические инструменты. Дата приблизительна.',
        'Another work on astronomical computation; it is lost and partly known from quotations by later authors. It is said to have described several astronomical instruments. Date approximate.')]
  ],
  disc:[
    ['🌍', t('Yerning o‘z o‘qi atrofida aylanishi','Вращение Земли вокруг оси','Rotation of the Earth on its axis'),
      t('Yulduzlarning sutkalik harakatini Yerning aylanishi bilan tushuntirgan. U yulduz sutkasini 23 soat 56 daqiqa 4,1 soniya deb bergan — bu bugungi qiymatga juda yaqin.',
        'Объяснил суточное движение звёзд вращением Земли. Он дал звёздные сутки равными 23 часам 56 минутам 4,1 секунды — очень близко к современному значению.',
        'He explained the daily motion of the stars by the rotation of the Earth. He gave the sidereal day as 23 hours 56 minutes 4.1 seconds, very close to the modern value.')],
    ['🥧', t('π sonining aniq qiymati','Точное значение числа π','Accurate value of π'),
      t('Diametri 20 000 bo‘lgan aylananing uzunligini taxminan 62 832 deb bergan: π ≈ 3,1416. U bu qiymatni «taqribiy» deb atagan.',
        'Дал длину окружности диаметром 20 000 примерно равной 62 832: π ≈ 3,1416. Он назвал это значение «приближённым».',
        'He gave the circumference of a circle of diameter 20,000 as approximately 62,832: π ≈ 3.1416. He called this value «approximate».')],
    ['📐', t('Sinuslar jadvali','Таблица синусов','Sine table'),
      t('Chorak aylanani 24 qismga (3°45′ qadam bilan) bo‘lib, sinus (jya) qiymatlari ayirmalarining jadvalini bergan. «Sinus» so‘zi aynan sanskritcha «jya» so‘zining arabcha va lotincha o‘zgarishlari orqali paydo bo‘lgan.',
        'Разделив четверть окружности на 24 части (с шагом 3°45′), дал таблицу разностей значений синуса (джья). Слово «синус» возникло именно через арабские и латинские изменения санскритского слова «джья».',
        'Dividing a quarter circle into 24 parts (in steps of 3°45′), he gave a table of differences of sine (jya) values. The word «sine» arose precisely through Arabic and Latin transformations of the Sanskrit word «jya».')],
    ['🌒', t('Tutilishlar va Oy nuri','Затмения и свет Луны','Eclipses and moonlight'),
      t('Oy va sayyoralar o‘z nurini emas, Quyosh nurini qaytaradi; tutilishlar Yer va Oy soyalari tufayli bo‘ladi, deb to‘g‘ri tushuntirgan va tutilishlarni hisoblash usullarini bergan.',
        'Верно объяснил, что Луна и планеты светят не своим, а отражённым солнечным светом, а затмения вызваны тенями Земли и Луны, и дал методы расчёта затмений.',
        'He correctly explained that the Moon and planets shine not with their own light but with reflected sunlight, and that eclipses are caused by the shadows of the Earth and Moon, and gave methods for calculating eclipses.')]
  ],
  instr:[],
  formulas:[
    { f:'π ≈ 62832 / 20000 = 3,1416', name:t('Ariabhataning π qiymati','Значение π Ариабхаты','Aryabhata’s value of π'),
      expl:t('«Ariabhatiya»da: 100 ga 4 ni qo‘shib, 8 ga ko‘paytirib, yana 62 000 ni qo‘shing — diametri 20 000 bo‘lgan aylananing taqribiy uzunligi hosil bo‘ladi. (100 + 4) · 8 + 62 000 = 62 832.',
        'В «Ариабхатии»: прибавь 4 к 100, умножь на 8 и прибавь 62 000 — получится приближённая длина окружности диаметром 20 000. (100 + 4) · 8 + 62 000 = 62 832.',
        'In the «Aryabhatiya»: add 4 to 100, multiply by 8 and add 62,000; the result is the approximate circumference of a circle of diameter 20,000. (100 + 4) · 8 + 62,000 = 62,832.'),
      vars:[ ['π', t('aylana uzunligining diametrga nisbati','отношение длины окружности к диаметру','ratio of circumference to diameter')] ] }
  ],
  tl:[
    [476, t('Tug‘ildi (o‘z asaridagi ma’lumotga ko‘ra)','Родился (по сведениям из его труда)','Born (according to his own work)')],
    [499, t('23 yoshida «Ariabhatiya»ni yakunladi','В 23 года завершил «Ариабхатию»','Completed the «Aryabhatiya» at the age of 23')],
    [550, t('Vafot etdi (taxminan)','Умер (приблизительно)','Died (approx.)')],
    [629, t('Bhaskara I «Ariabhatiya»ga sharh yozdi','Бхаскара I написал комментарий к «Ариабхатии»','Bhaskara I writes a commentary on the «Aryabhatiya»')],
    [1975, t('Hindistonning birinchi sun’iy yo‘ldoshi «Aryabhata» orbitaga chiqarildi','Первый индийский спутник «Ариабхата» выведен на орбиту','India’s first satellite, «Aryabhata», is launched into orbit')],
    [2004, t('Nainitalda Ariabhata nomidagi kuzatuv fanlari ilmiy-tadqiqot instituti (ARIES) tashkil etildi','В Найнитале основан Научно-исследовательский институт наблюдательных наук имени Ариабхаты (ARIES)','The Aryabhatta Research Institute of Observational Sciences (ARIES) is established in Nainital')]
  ],
  table:{
    title:t('Ariabhata qiymatlari va bugungi qiymatlar','Значения Ариабхаты и современные значения','Aryabhata’s values and modern values'),
    cols:[t('Kattalik','Величина','Quantity'), t('Ariabhata','Ариабхата','Aryabhata'), t('Bugungi qiymat','Современное значение','Modern value')],
    rows:[
      [t('π soni','Число π','π'), '3,1416', '3,14159…'],
      [t('Yulduz sutkasi','Звёздные сутки','Sidereal day'), '23 h 56 min 4,1 s', '23 h 56 min 4,09 s'],
      [t('Yulduz yili','Звёздный год','Sidereal year'), '365 d 6 h 12 min 30 s', '365 d 6 h 9 min 10 s']
    ],
    note:t('Ariabhata qiymatlari «Ariabhatiya»dagi davr sonlaridan hisoblangan.','Значения Ариабхаты вычислены из чисел периодов «Ариабхатии».','Aryabhata’s values are computed from the period numbers in the «Aryabhatiya».')
  },
  facts:[
    t('Ariabhata o‘z asarini atigi 23 yoshida yozib tugatgan.','Ариабхата закончил свой трактат всего в 23 года.','Aryabhata finished his treatise at the age of only 23.'),
    t('«Sinus» so‘zi sanskritcha «jya» → arabcha «jiba» → lotincha «sinus» yo‘li bilan kelib chiqqan.','Слово «синус» произошло по пути: санскритское «джья» → арабское «джиба» → латинское «sinus».','The word «sine» came by the path Sanskrit «jya» → Arabic «jiba» → Latin «sinus».'),
    t('Hindistonning 1975-yilda uchirilgan birinchi sun’iy yo‘ldoshi «Aryabhata» deb nomlangan; uning tasviri hind banknotlarida ham bosilgan.','Первый индийский спутник, запущенный в 1975 году, получил название «Ариабхата»; его изображение печаталось и на индийских банкнотах.','India’s first satellite, launched in 1975, was named «Aryabhata»; its image was also printed on Indian banknotes.'),
    t('Uning Yer aylanishi haqidagi g‘oyasini keyingi ko‘plab hind astronomlari qabul qilmagan va sharhlovchilar ba’zan matnni o‘zgartirib talqin qilgan.','Его идею вращения Земли многие последующие индийские астрономы не приняли, и комментаторы порой истолковывали текст иначе.','Many later Indian astronomers did not accept his idea of the Earth’s rotation, and commentators sometimes reinterpreted the text.')
  ],
  legacy:t(
    'Hindistonning birinchi sun’iy yo‘ldoshi (1975) va Nainitaldagi ARIES ilmiy instituti Ariabhata nomi bilan atalgan. Uning «Ariabhatiya» asari hind astronomiyasining ming yillik an’anasiga asos bo‘lgan va Bag‘dod orqali Islom olami fani bilan bog‘langan. Ariabhata bugun Hindistonda ilm-fan ramzlaridan biri sifatida qadrlanadi.',
    'Первый индийский спутник (1975) и научный институт ARIES в Найнитале названы в честь Ариабхаты. Его «Ариабхатия» легла в основу тысячелетней традиции индийской астрономии и через Багдад была связана с наукой исламского мира. Сегодня в Индии Ариабхата почитается как один из символов науки.',
    'India’s first satellite (1975) and the ARIES research institute in Nainital are named after Aryabhata. His «Aryabhatiya» became the foundation of a thousand-year tradition of Indian astronomy and was connected through Baghdad with the science of the Islamic world. Today Aryabhata is honoured in India as one of the symbols of science.')
});

/* ───────────── Chjan Xen ───────────── */
S.push({
  id:'zhangheng',
  born:78, died:139,
  region:'asia',
  fields:['instruments','stars','math'],
  name:t('Chjan Xen','Чжан Хэн','Zhang Heng'),
  life:t('78 – 139','78 – 139','78 – 139'),
  place:t('Nanyang, Xenan viloyati, Xitoy','Наньян, провинция Хэнань, Китай','Nanyang, Henan province, China'),
  role:t('Xitoy astronomi, ixtirochi, matematik va shoir','Китайский астроном, изобретатель, математик и поэт','Chinese astronomer, inventor, mathematician and poet'),
  short:t(
    'Suv kuchi bilan aylanadigan armillyar sferani va dunyodagi birinchi seysmoskopni yaratgan, 2500 dan ortiq yulduzni qayd etgan Sharqiy Xan davri olimi.',
    'Учёный эпохи Восточной Хань, создавший вращаемую силой воды армиллярную сферу и первый в мире сейсмоскоп и описавший более 2500 звёзд.',
    'Scholar of the Eastern Han dynasty who created a water-driven armillary sphere and the world’s first seismoscope, and recorded more than 2,500 stars.'),
  about:t(
    'Chjan Xen — qadimgi Xitoyning eng ko‘p qirrali olimlaridan biri. U Sharqiy Xan saroyida bosh astronom (Taishi ling) lavozimida ishlab, osmonni kuzatish, taqvim va asboblar yasash bilan shug‘ullangan. Uning suv bilan harakatlanuvchi armillyar sferasi va zilzila yo‘nalishini ko‘rsatuvchi seysmoskopi texnika tarixida alohida o‘rin tutadi. U shu bilan birga mashhur shoir va adabiyotchi ham bo‘lgan.',
    'Чжан Хэн — один из самых разносторонних учёных древнего Китая. Он служил при дворе Восточной Хань главным астрономом (тайши лин), занимаясь наблюдением неба, календарём и созданием приборов. Его приводимая в движение водой армиллярная сфера и сейсмоскоп, указывающий направление землетрясения, занимают особое место в истории техники. Он был также известным поэтом и литератором.',
    'Zhang Heng was one of the most versatile scholars of ancient China. He served at the Eastern Han court as Chief Astronomer (Taishi ling), working on observing the sky, the calendar and building instruments. His water-driven armillary sphere and his seismoscope, which indicated the direction of an earthquake, hold a special place in the history of technology. He was also a famous poet and man of letters.'),
  bio:[
    t('Chjan Xen 78-yilda Nanyang qo‘mondonligidagi Xi’e shahrida (hozirgi Xenan viloyati) taniqli, lekin boy bo‘lmagan oilada tug‘ilgan. Uning bobosi viloyat hokimi bo‘lgan. Yoshligida u o‘qish uchun poytaxtlar — Chan’an va Loyanga borgan va u yerda mumtoz adabiyot hamda falsafani chuqur o‘rgangan.',
      'Чжан Хэн родился в 78 году в городе Сиэ округа Наньян (ныне провинция Хэнань) в знатной, но небогатой семье. Его дед был правителем области. В юности он отправился учиться в столицы — Чанъань и Лоян, где глубоко изучил классическую литературу и философию.',
      'Zhang Heng was born in 78 in the town of Xi’e in Nanyang commandery (modern Henan province) into a distinguished but not wealthy family. His grandfather had been a provincial governor. As a young man he went to study in the capitals, Chang’an and Luoyang, where he studied classical literature and philosophy in depth.'),
    t('Dastlab u adabiyot sohasida shuhrat qozongan: uning «Ikki poytaxt haqida qasida» (Erjing fu) asari ikki poytaxt hayotini tasvirlagan va ko‘p yillik mehnat natijasida yaratilgan. U bir muddat Nanyang mahalliy ma’muriyatida kotib bo‘lib ishlagan. Shu yillarda u astronomiya va matematikaga qiziqa boshlagan.',
      'Сначала он прославился в литературе: его «Оды о двух столицах» (Эрцзин фу) описывали жизнь двух столиц и были плодом многолетнего труда. Некоторое время он служил секретарём местной администрации Наньяна. В эти годы он начал увлекаться астрономией и математикой.',
      'He first won fame in literature: his «Rhapsody on the Two Capitals» (Erjing fu) described life in the two capitals and was the fruit of many years’ work. For a time he served as a secretary in the local administration of Nanyang. During these years he became interested in astronomy and mathematics.'),
    t('Imperator An davrida, 115-yilda u saroyga chaqirilib, bosh astronom — Taishi ling lavozimiga tayinlangan va bu vazifani bir necha yil, keyin yana 120-yillar o‘rtalaridan boshlab bajargan. Bu lavozim osmon hodisalarini kuzatish, taqvimni yuritish va g‘ayrioddiy belgilar haqida imperatorga hisobot berishni o‘z ichiga olgan. Shu davrda u suv kuchi bilan aylanadigan armillyar sferani yasagan.',
      'При императоре Ань-ди, в 115 году, его вызвали ко двору и назначили главным астрономом — тайши лин; эту должность он занимал несколько лет, а затем снова с середины 120-х годов. Она включала наблюдение небесных явлений, ведение календаря и доклады императору о необычных знамениях. В этот период он построил армиллярную сферу, вращаемую силой воды.',
      'Under Emperor An, in 115, he was summoned to court and appointed Chief Astronomer (Taishi ling); he held this post for several years and again from the mid-120s. The post involved observing celestial phenomena, keeping the calendar and reporting unusual omens to the emperor. During this period he built an armillary sphere turned by water power.'),
    t('«Lingxian» («Olamning ruhiy tuzilishi») risolasida Chjan Xen koinot haqidagi «huntyan» nazariyasini — osmon tovuq tuxumi kabi sferik, Yer esa uning ichidagi sarig‘i kabi, degan qarashni bayon qilgan. U Oy Quyosh nurini qaytarib porlashini va Oy tutilishi Yer soyasi Oyga tushganda sodir bo‘lishini tushuntirgan. Risolada 124 ta yulduz guruhi, ulardan 320 tasining nomi va 2500 ta asosiy yulduz qayd etilgan.',
      'В трактате «Линсянь» («Духовное устройство Вселенной») Чжан Хэн изложил теорию «хуньтянь»: небо сферично, как куриное яйцо, а Земля внутри него — как желток. Он объяснил, что Луна светит отражённым солнечным светом, а лунное затмение происходит, когда на Луну падает тень Земли. В трактате отмечены 124 группы звёзд, из них 320 названных, и 2500 основных звёзд.',
      'In the treatise «Ling Xian» («The Spiritual Constitution of the Universe») Zhang Heng set out the «huntian» theory: the sky is spherical like a hen’s egg, and the Earth inside it is like the yolk. He explained that the Moon shines with reflected sunlight and that a lunar eclipse occurs when the Earth’s shadow falls on the Moon. The treatise records 124 star groups, 320 of them named, and 2,500 principal stars.'),
    t('132-yilda u zilzilalarni qayd etuvchi asbob — «houfeng didong yi» seysmoskopini taqdim etgan. Tarixiy yilnomalarga ko‘ra, 138-yilda asbob poytaxtda sezilmagan zilzilani ko‘rsatgan va bir necha kundan keyin g‘arbdagi Longxi hududidan zilzila haqida xabar kelgan. Umrining oxirida u Xejyan knyazligida bosh vazir bo‘lib ishlagan, so‘ng poytaxtga qaytib, 139-yilda vafot etgan.',
      'В 132 году он представил прибор для регистрации землетрясений — сейсмоскоп «хоуфэн дидун и». Согласно историческим хроникам, в 138 году прибор указал на землетрясение, не ощущавшееся в столице, а через несколько дней с запада, из области Лунси, пришло известие о землетрясении. В конце жизни он служил главным министром в княжестве Хэцзянь, затем вернулся в столицу и умер в 139 году.',
      'In 132 he presented an instrument for registering earthquakes, the seismoscope «houfeng didong yi». According to the historical annals, in 138 the instrument indicated an earthquake that was not felt in the capital, and a few days later news arrived of an earthquake in the Longxi region to the west. Late in life he served as chief minister of the principality of Hejian, then returned to the capital and died in 139.')
  ],
  works:[
    [107, t('«Ikki poytaxt haqida qasida» (Erjing fu)','«Оды о двух столицах» (Эрцзин фу)','«Rhapsody on the Two Capitals» (Erjing fu)'),
      t('Chan’an va Loyan hayotini tasvirlagan yirik adabiy asar; Xan davri she’riyatining namunasi. Sana taxminiy.',
        'Крупное литературное произведение, описывающее жизнь Чанъаня и Лояна; образец поэзии эпохи Хань. Дата приблизительна.',
        'A major literary work depicting life in Chang’an and Luoyang; an example of Han-era poetry. Date approximate.')],
    [118, t('«Lingxian» — «Olamning ruhiy tuzilishi»','«Линсянь» — «Духовное устройство Вселенной»','«Ling Xian» — «The Spiritual Constitution of the Universe»'),
      t('Koinot tuzilishi, Oy nuri, tutilishlar va yulduzlar haqidagi astronomik risola. Sana taxminiy.',
        'Астрономический трактат об устройстве Вселенной, свете Луны, затмениях и звёздах. Дата приблизительна.',
        'An astronomical treatise on the structure of the universe, moonlight, eclipses and the stars. Date approximate.')],
    [125, t('«Huntyan yi» — suvli armillyar sfera tavsifi','«Хуньтянь и» — описание водяной армиллярной сферы','«Huntian yi» — description of the water-driven armillary sphere'),
      t('Suv soati bilan harakatlanuvchi osmon modeli va uning tuzilishi haqidagi matn (qisman saqlangan). Sana taxminiy.',
        'Текст о модели неба, приводимой в движение водяными часами, и её устройстве (сохранился частично). Дата приблизительна.',
        'A text on the model of the heavens driven by a water clock and its construction (partly preserved). Date approximate.')],
    [136, t('«To‘rt qayg‘u she’ri»','«Стихи о четырёх печалях»','«Four Sorrows»'),
      t('Xitoy she’riyatida yetti bo‘g‘inli she’r shaklining ilk namunalaridan biri hisoblanadigan lirik asar. Sana taxminiy.',
        'Лирическое произведение, считающееся одним из ранних образцов семисложного стиха в китайской поэзии. Дата приблизительна.',
        'A lyric work regarded as one of the early examples of the seven-syllable verse form in Chinese poetry. Date approximate.')]
  ],
  disc:[
    ['🌐', t('Suvli armillyar sfera','Водяная армиллярная сфера','Water-powered armillary sphere'),
      t('Suv soatining bir tekis oqimi yordamida osmon sferasi modelini sutka davomida aylantirib, yulduzlarning chiqishi va botishini ko‘rsatgan. Bu osmon modelini mexanik harakatga keltirishning ma’lum bo‘lgan eng qadimgi urinishlaridan biri.',
        'Равномерным потоком водяных часов вращал модель небесной сферы в течение суток, показывая восход и заход звёзд. Это одна из древнейших известных попыток механически привести в движение модель неба.',
        'Using the steady flow of a water clock, he turned a model of the celestial sphere through the day, showing the rising and setting of the stars. It is one of the earliest known attempts to drive a model of the heavens mechanically.')],
    ['🐉', t('Birinchi seysmoskop','Первый сейсмоскоп','The first seismoscope'),
      t('Bronza idish atrofida sakkizta ajdar boshi bo‘lib, zilzila bo‘lganda ulardan biri og‘zidagi sharchani pastdagi qurbaqa og‘ziga tushirgan va zilzila yo‘nalishini ko‘rsatgan. Ichki mexanizmning aniq tuzilishi saqlanmagan.',
        'Вокруг бронзового сосуда располагались восемь драконьих голов; при землетрясении одна из них роняла шарик в пасть жабы внизу, указывая направление толчка. Точное устройство внутреннего механизма не сохранилось.',
        'Around a bronze vessel were eight dragon heads; during an earthquake one of them dropped a ball into the mouth of a toad below, indicating the direction of the shock. The exact design of the internal mechanism has not survived.')],
    ['🌕', t('Oy nuri va tutilishlar izohi','Объяснение света Луны и затмений','Explaining moonlight and eclipses'),
      t('Oyning o‘zi nur sochmasligini, u Quyosh nurini qaytarishini va Oy tutilishi Yer soyasi tufayli bo‘lishini yozgan.',
        'Писал, что Луна не светит сама, а отражает свет Солнца, и что лунное затмение вызвано тенью Земли.',
        'He wrote that the Moon does not shine by itself but reflects the light of the Sun, and that a lunar eclipse is caused by the Earth’s shadow.')],
    ['⭐', t('Yulduzlar xaritasi','Карта звёзд','Star map'),
      t('124 yulduz guruhida 2500 ta asosiy yulduzni qayd etgan va kichik yulduzlar bilan birga ularning umumiy sonini 11 520 ta deb ko‘rsatgan.',
        'Отметил 2500 основных звёзд в 124 группах, а вместе с мелкими звёздами указал их общее число — 11 520.',
        'He recorded 2,500 principal stars in 124 groups and, together with the faint stars, gave their total number as 11,520.')]
  ],
  instr:[
    [t('Huntyan yi — suvli armillyar sfera','Хуньтянь и — водяная армиллярная сфера','Huntian yi — water-driven armillary sphere'),
      t('Suv soati bilan bog‘langan halqalar tizimi osmon sferasini sutka davomida aylantirgan; kuzatuvchilar uni haqiqiy osmon bilan taqqoslagan.',
        'Система колец, соединённая с водяными часами, вращала небесную сферу в течение суток; наблюдатели сравнивали её с настоящим небом.',
        'A system of rings connected to a water clock turned the celestial sphere through the day; observers compared it with the real sky.'),
      'ins:armillary'],
    [t('Houfeng didong yi — seysmoskop','Хоуфэн дидун и — сейсмоскоп','Houfeng didong yi — seismoscope'),
      t('132-yilda taqdim etilgan bronza asbob; zilzila sodir bo‘lganini va uning taxminiy yo‘nalishini ko‘rsatgan.',
        'Бронзовый прибор, представленный в 132 году; показывал, что произошло землетрясение, и его примерное направление.',
        'A bronze instrument presented in 132; it showed that an earthquake had occurred and its approximate direction.'),
      null]
  ],
  formulas:[],
  tl:[
    [78, t('Nanyangda tug‘ildi','Родился в Наньяне','Born in Nanyang')],
    [95, t('Chan’an va Loyanga o‘qish uchun bordi (taxminan)','Отправился учиться в Чанъань и Лоян (около)','Went to study in Chang’an and Luoyang (approx.)')],
    [100, t('Nanyang ma’muriyatida kotib bo‘lib ishladi (taxminan)','Служил секретарём администрации Наньяна (около)','Served as secretary in the Nanyang administration (approx.)')],
    [115, t('Bosh astronom (Taishi ling) etib tayinlandi','Назначен главным астрономом (тайши лин)','Appointed Chief Astronomer (Taishi ling)')],
    [125, t('Suvli armillyar sferani yaratdi (taxminan)','Создал водяную армиллярную сферу (около)','Built the water-driven armillary sphere (approx.)')],
    [132, t('Seysmoskopni saroyga taqdim etdi','Представил двору сейсмоскоп','Presented the seismoscope to the court')],
    [138, t('Seysmoskop uzoqdagi Longxi zilzilasini qayd etdi','Сейсмоскоп зарегистрировал далёкое землетрясение в Лунси','The seismoscope registered the distant Longxi earthquake')],
    [139, t('Vafot etdi','Умер','Died')]
  ],
  facts:[
    t('Chjan Xen nafaqat olim, balki Xan davrining eng mashhur shoirlaridan biri ham bo‘lgan.','Чжан Хэн был не только учёным, но и одним из самых известных поэтов эпохи Хань.','Zhang Heng was not only a scientist but also one of the most famous poets of the Han era.'),
    t('Uning seysmoskopi zilzilaning o‘zini emas, balki u sodir bo‘lganini va yo‘nalishini qayd etgan — shuning uchun u «seysmograf» emas, «seysmoskop» deb ataladi.','Его сейсмоскоп регистрировал не само землетрясение, а факт и направление толчка — поэтому его называют «сейсмоскопом», а не «сейсмографом».','His seismoscope recorded not the earthquake itself but the fact and direction of a shock, which is why it is called a «seismoscope» rather than a «seismograph».'),
    t('Zamonaviy olimlar uning seysmoskopini tarixiy tavsif asosida bir necha bor qayta tiklashga uringan — ichki tuzilishi haqida turli farazlar bor.','Его сейсмоскоп в Китае не раз пытались реконструировать современные учёные по историческому описанию — о внутреннем устройстве существуют разные гипотезы.','Modern scholars in China have tried several times to reconstruct his seismoscope from the historical description; there are various hypotheses about its internal design.'),
    t('2018-yilda Xitoy uchirgan zilzilalarni elektromagnit usulda o‘rganuvchi sun’iy yo‘ldosh «Zhangheng-1» deb nomlangan.','Запущенный Китаем в 2018 году спутник для электромагнитного изучения землетрясений назван «Чжан Хэн-1».','The satellite launched by China in 2018 to study earthquakes electromagnetically is named «Zhangheng-1».')
  ],
  legacy:t(
    'Oydagi Chang Heng krateri, 1802 Zhang Heng asteroidi va «Zhangheng-1» sun’iy yo‘ldoshi uning nomi bilan atalgan. Chjan Xen Xitoyda ilm-fan va ijodkorlikni birlashtirgan olim timsoli sifatida qadrlanadi. Uning asboblari mexanik astronomik modellar va seysmologiya tarixida muhim bosqich hisoblanadi.',
    'Кратер Чан Хэн на Луне, астероид 1802 Чжан Хэн и спутник «Чжан Хэн-1» названы в его честь. В Китае Чжан Хэн почитается как символ учёного, соединившего науку и творчество. Его приборы считаются важной вехой в истории механических астрономических моделей и сейсмологии.',
    'The lunar crater Chang Heng, the asteroid 1802 Zhang Heng and the satellite «Zhangheng-1» are named after him. In China Zhang Heng is honoured as the embodiment of a scholar who united science and creativity. His instruments are regarded as an important milestone in the history of mechanical astronomical models and seismology.')
});

/* ───────────── Muhammad al-Xorazmiy ───────────── */
S.push({
  id:'alkhwarizmi',
  born:780, died:850,
  region:'central_asia',
  fields:['math','planets','calendar'],
  name:t('Muhammad al-Xorazmiy','Мухаммад аль-Хорезми','Muhammad al-Khwarizmi'),
  life:t('~780 – ~850','~780 – ~850','c. 780 – c. 850'),
  place:t('Xorazm, O‘zbekiston','Хорезм, Узбекистан','Khwarazm, Uzbekistan'),
  role:t('Xorazmlik matematik, astronom va geograf, algebra asoschisi','Хорезмийский математик, астроном и географ, основатель алгебры','Khwarazmian mathematician, astronomer and geographer, founder of algebra'),
  short:t(
    'Algebra fanining asoschisi, o‘nli pozitsion sanoq tizimini Islom olami va Yevropaga tanitgan olim; «algoritm» so‘zi uning nomidan kelib chiqqan.',
    'Основатель алгебры, познакомивший исламский мир и Европу с десятичной позиционной системой счисления; слово «алгоритм» происходит от его имени.',
    'Founder of algebra, who introduced the decimal positional number system to the Islamic world and Europe; the word «algorithm» comes from his name.'),
  about:t(
    'Abu Abdulloh Muhammad ibn Muso al-Xorazmiy — IX asrda Bag‘doddagi «Bayt ul-hikma» (Donishmandlik uyi)da ishlagan buyuk xorazmlik olim. Uning «al-Jabr va-l-muqobala» kitobi algebrani mustaqil fan sifatida shakllantirgan, hind raqamlari haqidagi risolasi esa o‘nli sanoq tizimini keng tarqatgan. Uning «Zij»i — astronomik jadvallari — Islom olamidagi ilk yirik zijlardan biri bo‘lib, lotin tiliga tarjima qilingan. «Surat al-arz» asarida u Ptolemey geografiyasini qayta ishlab, minglab joylarning koordinatalarini bergan.',
    'Абу Абдуллах Мухаммад ибн Муса аль-Хорезми — великий хорезмийский учёный IX века, работавший в багдадском «Байт аль-хикма» («Доме мудрости»). Его книга «аль-Джабр валь-мукабала» сформировала алгебру как самостоятельную науку, а трактат об индийских цифрах широко распространил десятичную систему счисления. Его «Зидж» — астрономические таблицы — один из первых крупных зиджей исламского мира, переведённый на латынь. В труде «Сурат аль-ард» он переработал географию Птолемея и привёл координаты тысяч мест.',
    'Abu Abdallah Muhammad ibn Musa al-Khwarizmi was a great 9th-century scholar from Khwarazm who worked at the «Bayt al-Hikma» (House of Wisdom) in Baghdad. His book «al-Jabr wa-l-muqabala» established algebra as an independent science, and his treatise on Hindu numerals spread the decimal number system widely. His «Zij», a set of astronomical tables, was one of the first major zijes of the Islamic world and was translated into Latin. In the work «Surat al-ard» he reworked Ptolemy’s geography and gave the coordinates of thousands of places.'),
  bio:[
    t('Al-Xorazmiy taxminan 780-yilda tug‘ilgan. Uning nisbasi — «al-Xorazmiy» — u yoki uning ajdodlari Amudaryo quyi oqimidagi qadimiy Xorazm vohasidan ekanini ko‘rsatadi. Uning bolaligi va ilk ta’limi haqida ishonchli ma’lumot saqlanmagan. Xorazm o‘sha davrda qadimiy dehqonchilik, savdo va ilm an’analariga ega o‘lka bo‘lgan.',
      'Аль-Хорезми родился около 780 года. Его нисба «аль-Хорезми» указывает, что он или его предки происходили из древнего Хорезмского оазиса в низовьях Амударьи. Надёжных сведений о его детстве и раннем образовании не сохранилось. Хорезм в то время был краем с древними традициями земледелия, торговли и науки.',
      'Al-Khwarizmi was born around 780. His nisba, «al-Khwarizmi», shows that he or his ancestors came from the ancient oasis of Khwarazm on the lower Amu Darya. No reliable information about his childhood or early education has survived. At that time Khwarazm was a land with ancient traditions of agriculture, trade and learning.'),
    t('U Abbosiy xalifa al-Ma’mun (813–833-yillar hukmronlik qilgan) davrida Bag‘dodga borib, «Bayt ul-hikma» ilmiy markazida faoliyat yuritgan. Bu markazda yunon, hind va fors ilmiy asarlari arab tiliga tarjima qilinar, olimlar birgalikda kuzatuv va tadqiqotlar olib borar edi. Al-Xorazmiy bu muhitda yetakchi olimlardan biriga aylangan va o‘z asarlarining bir qismini al-Ma’munga bag‘ishlagan.',
      'Во времена аббасидского халифа аль-Мамуна (правил в 813–833 годах) он переехал в Багдад и работал в научном центре «Байт аль-хикма». Здесь греческие, индийские и персидские научные труды переводились на арабский, а учёные совместно вели наблюдения и исследования. Аль-Хорезми стал одним из ведущих учёных этой среды и посвятил часть своих трудов аль-Мамуну.',
      'In the time of the Abbasid caliph al-Ma’mun (reigned 813–833) he moved to Baghdad and worked at the «Bayt al-Hikma» research centre. There Greek, Indian and Persian scientific works were translated into Arabic, and scholars carried out observations and research together. Al-Khwarizmi became one of the leading scholars of this circle and dedicated some of his works to al-Ma’mun.'),
    t('Taxminan 820–830-yillarda u «al-Kitob al-muxtasar fi hisob al-jabr va-l-muqobala» asarini yozgan. Kitobda chiziqli va kvadrat tenglamalarni yechishning tizimli usullari, geometrik isbotlari bilan birga, berilgan; «al-jabr» (to‘ldirish) va «al-muqobala» (qarama-qarshi qo‘yish, qisqartirish) amallari tenglamalarni soddalashtirish uchun qo‘llangan. Asarning ikkinchi qismi meros taqsimoti, savdo va yer o‘lchash kabi amaliy masalalarga bag‘ishlangan.',
      'Около 820–830 годов он написал «аль-Китаб аль-мухтасар фи хисаб аль-джабр валь-мукабала». В книге даны систематические методы решения линейных и квадратных уравнений вместе с геометрическими доказательствами; действия «аль-джабр» (восполнение) и «аль-мукабала» (противопоставление, сокращение) применялись для упрощения уравнений. Вторая часть труда посвящена практическим задачам — разделу наследства, торговле и измерению земель.',
      'Around 820–830 he wrote «al-Kitab al-mukhtasar fi hisab al-jabr wa-l-muqabala». The book gives systematic methods for solving linear and quadratic equations together with geometric proofs; the operations «al-jabr» (restoration) and «al-muqabala» (balancing, reduction) were used to simplify equations. The second part of the work is devoted to practical problems such as dividing inheritances, trade and land measurement.'),
    t('Astronomiyada uning eng muhim asari — «Zij as-Sindhind» astronomik jadvallari. Unda hind astronomiyasi usullari asosida Quyosh, Oy va sayyoralar holatini, tutilishlarni hisoblash, sinus jadvallari va taqvim masalalari berilgan. Bu zijning arabcha asli saqlanmagan, ammo andalusiyalik Maslama al-Majritiy qayta ishlagan nusxasi XII asrda Adelard Batlik tomonidan lotin tiliga tarjima qilingan va Yevropada keng tarqalgan.',
      'В астрономии его важнейший труд — астрономические таблицы «Зидж ас-Синдхинд». В них на основе методов индийской астрономии даны расчёты положений Солнца, Луны и планет, затмений, таблицы синусов и вопросы календаря. Арабский оригинал этого зиджа не сохранился, но обработанная андалусцем Масламой аль-Маджрити версия была в XII веке переведена на латынь Аделардом Батским и широко распространилась в Европе.',
      'In astronomy his most important work is the «Zij al-Sindhind», a set of astronomical tables. Based on the methods of Indian astronomy, it gives calculations of the positions of the Sun, Moon and planets, eclipses, sine tables and calendar questions. The Arabic original of this zij has not survived, but the version revised by the Andalusian Maslama al-Majriti was translated into Latin in the 12th century by Adelard of Bath and spread widely in Europe.'),
    t('Al-Xorazmiy «Kitob surat al-arz» («Yer surati kitobi») asarida Ptolemey «Geografiya»sini tanqidiy qayta ishlab, shaharlar, tog‘lar, daryolar va dengizlarning koordinatalarini bergan va ko‘p xatolarni, jumladan O‘rta yer dengizining uzunligini tuzatgan. U, shuningdek, astrolyabiya, quyosh soatlari va yahudiy taqvimi haqida risolalar yozgan. Uning hind raqamlari haqidagi arifmetik asari faqat lotincha tarjimada saqlangan. Al-Xorazmiy taxminan 850-yilda Bag‘dodda vafot etgan.',
      'В «Китаб сурат аль-ард» («Книга картины Земли») аль-Хорезми критически переработал «Географию» Птолемея, привёл координаты городов, гор, рек и морей и исправил многие ошибки, в том числе длину Средиземного моря. Он написал также трактаты об астролябии, солнечных часах и еврейском календаре. Его арифметический труд об индийских цифрах сохранился лишь в латинском переводе. Аль-Хорезми умер около 850 года в Багдаде.',
      'In the «Kitab surat al-ard» («Book of the Image of the Earth») al-Khwarizmi critically reworked Ptolemy’s «Geography», gave the coordinates of cities, mountains, rivers and seas, and corrected many errors, including the length of the Mediterranean Sea. He also wrote treatises on the astrolabe, sundials and the Jewish calendar. His arithmetical work on Hindu numerals survives only in Latin translation. Al-Khwarizmi died around 850 in Baghdad.')
  ],
  works:[
    [825, t('«al-Jabr va-l-muqobala» (Algebra)','«аль-Джабр валь-мукабала» («Алгебра»)','«al-Jabr wa-l-muqabala» («Algebra»)'),
      t('Chiziqli va kvadrat tenglamalarni tizimli yechish bo‘yicha birinchi kitob; «algebra» so‘zi uning nomidagi «al-jabr»dan kelib chiqqan. 1145-yilda Robert Chesterlik lotin tiliga tarjima qilgan. Sana taxminiy (820–830).',
        'Первая книга о систематическом решении линейных и квадратных уравнений; слово «алгебра» происходит от «аль-джабр» в её названии. В 1145 году переведена на латынь Робертом Честерским. Дата приблизительна (820–830).',
        'The first book on the systematic solution of linear and quadratic equations; the word «algebra» comes from «al-jabr» in its title. Translated into Latin by Robert of Chester in 1145. Date approximate (820–830).')],
    [825, t('Hind hisobi haqidagi risola («Algoritmi de numero Indorum»)','Трактат об индийском счёте («Algoritmi de numero Indorum»)','Treatise on Hindu reckoning («Algoritmi de numero Indorum»)'),
      t('O‘nli pozitsion sanoq tizimi va nol bilan arifmetik amallarni tushuntirgan asar; lotincha tarjimadagi «Algoritmi» shakli «algoritm» so‘ziga aylangan. Sana taxminiy.',
        'Труд, объясняющий десятичную позиционную систему и арифметические действия с нулём; форма «Algoritmi» из латинского перевода превратилась в слово «алгоритм». Дата приблизительна.',
        'A work explaining the decimal positional system and arithmetic with zero; the form «Algoritmi» in the Latin translation became the word «algorithm». Date approximate.')],
    [830, t('«Zij as-Sindhind»','«Зидж ас-Синдхинд»','«Zij al-Sindhind»'),
      t('Quyosh, Oy va beshta sayyora harakati, tutilishlar va sinuslar jadvallari. 1126-yilda Adelard Batlik lotin tiliga tarjima qilgan. Sana taxminiy.',
        'Таблицы движения Солнца, Луны и пяти планет, затмений и синусов. В 1126 году переведён на латынь Аделардом Батским. Дата приблизительна.',
        'Tables of the motion of the Sun, Moon and five planets, of eclipses and of sines. Translated into Latin by Adelard of Bath in 1126. Date approximate.')],
    [833, t('«Kitob surat al-arz» (Geografiya)','«Китаб сурат аль-ард» («География»)','«Kitab surat al-ard» («Geography»)'),
      t('Ikki mingdan ortiq joyning kenglik va uzunlik koordinatalari keltirilgan geografik asar; Ptolemey ma’lumotlarini tuzatgan va to‘ldirgan. Yagona qo‘lyozmasi Strasburgda saqlanadi. Sana taxminiy.',
        'Географический труд с координатами широты и долготы более двух тысяч мест; исправил и дополнил данные Птолемея. Единственная рукопись хранится в Страсбурге. Дата приблизительна.',
        'A geographical work giving the latitude and longitude of more than two thousand places; it corrected and supplemented Ptolemy’s data. The only manuscript is kept in Strasbourg. Date approximate.')],
    [840, t('Astrolyabiya va quyosh soatlari haqidagi risolalar','Трактаты об астролябии и солнечных часах','Treatises on the astrolabe and sundials'),
      t('Astrolyabiyani yasash va undan foydalanish hamda quyosh soatlarini hisoblash bo‘yicha qisqa risolalar. Sana taxminiy.',
        'Краткие трактаты о построении и использовании астролябии и о расчёте солнечных часов. Дата приблизительна.',
        'Short treatises on constructing and using the astrolabe and on calculating sundials. Date approximate.')]
  ],
  disc:[
    ['🔣', t('Algebra — mustaqil fan','Алгебра — самостоятельная наука','Algebra as an independent science'),
      t('Tenglamalarni oltita kanonik turga ajratib, har biri uchun umumiy yechish qoidasini va geometrik isbotini bergan. Bu algebrani arifmetika va geometriyadan ajralgan alohida fanga aylantirdi.',
        'Разделил уравнения на шесть канонических типов и для каждого дал общее правило решения и геометрическое доказательство. Это превратило алгебру в самостоятельную науку, отдельную от арифметики и геометрии.',
        'He divided equations into six canonical types and gave a general rule of solution and a geometric proof for each. This turned algebra into an independent science, separate from arithmetic and geometry.')],
    ['0️⃣', t('O‘nli sanoq tizimining tarqalishi','Распространение десятичной системы','Spread of the decimal system'),
      t('Hind raqamlari va nolni o‘z ichiga olgan pozitsion tizimni tushuntirib, Islom olami va lotin tarjimasi orqali Yevropada uning qabul qilinishiga hal qiluvchi hissa qo‘shgan. Yevropada bu raqamlar «arab raqamlari» nomi bilan tanilgan.',
        'Объяснив позиционную систему с индийскими цифрами и нулём, внёс решающий вклад в её принятие в исламском мире, а через латинский перевод — в Европе. В Европе эти цифры стали известны как «арабские».',
        'By explaining the positional system with Hindu numerals and zero, he made a decisive contribution to its adoption in the Islamic world and, through the Latin translation, in Europe. In Europe these numerals became known as «Arabic numerals».')],
    ['📊', t('Astronomik jadvallar (zij)','Астрономические таблицы (зидж)','Astronomical tables (zij)'),
      t('Islom olamidagi ilk yirik astronomik jadvallardan birini tuzib, sayyoralar, tutilishlar va sinus funksiyasini hisoblashni tizimlashtirgan. Lotincha tarjimasi Yevropada trigonometrik jadvallarning tarqalishiga yordam bergan.',
        'Составил одни из первых крупных астрономических таблиц исламского мира, систематизировав расчёт планет, затмений и функции синуса. Латинский перевод способствовал распространению в Европе тригонометрических таблиц.',
        'He compiled one of the first major sets of astronomical tables in the Islamic world, systematising the calculation of planets, eclipses and the sine function. Its Latin translation helped spread trigonometric tables in Europe.')],
    ['🗺️', t('Ptolemey geografiyasini tuzatish','Исправление географии Птолемея','Correcting Ptolemy’s geography'),
      t('O‘rta yer dengizining Ptolemey bo‘rttirib ko‘rsatgan uzunligini qisqartirib, Islom olamidagi shahar va hududlar haqidagi yangi ma’lumotlarni qo‘shgan.',
        'Сократил преувеличенную Птолемеем длину Средиземного моря и добавил новые сведения о городах и областях исламского мира.',
        'He reduced the length of the Mediterranean Sea, which Ptolemy had exaggerated, and added new information about the cities and regions of the Islamic world.')]
  ],
  instr:[
    [t('Astrolyabiya','Астролябия','Astrolabe'),
      t('Al-Xorazmiy astrolyabiyani yasash va u bilan Quyosh, yulduzlar balandligi hamda vaqtni aniqlash haqida risola yozgan.',
        'Аль-Хорезми написал трактат о построении астролябии и определении с её помощью высоты Солнца, звёзд и времени.',
        'Al-Khwarizmi wrote a treatise on constructing the astrolabe and using it to find the altitude of the Sun and stars and the time.'),
      'ins:astrolabe'],
    [t('Quyosh soati','Солнечные часы','Sundial'),
      t('Quyosh soatlarini turli kengliklar uchun hisoblash, shuningdek namoz vaqtlarini aniqlash jadvallari bilan shug‘ullangan.',
        'Занимался расчётом солнечных часов для разных широт, а также таблицами для определения времени молитв.',
        'He worked on calculating sundials for different latitudes, as well as on tables for determining prayer times.'),
      'ins:sundial']
  ],
  formulas:[
    { f:'x^{2} + 10x = 39  →  x = √((10/2)^{2} + 39) − 10/2 = 3', name:t('Al-Xorazmiyning mashhur misoli','Знаменитый пример аль-Хорезми','Al-Khwarizmi’s famous example'),
      expl:t('«Kvadrat va o‘nta ildiz o‘ttiz to‘qqizga teng» — al-Xorazmiy kitobidagi mashhur masala. U ildizlar sonining yarmini kvadratga ko‘tarib, 39 ga qo‘shadi, ildiz chiqaradi va yana yarmini ayiradi; bu usulni kvadratni to‘ldirish chizmasi bilan geometrik isbotlaydi.',
        '«Квадрат и десять корней равны тридцати девяти» — знаменитая задача из книги аль-Хорезми. Он возводит в квадрат половину числа корней, прибавляет 39, извлекает корень и вычитает половину; этот способ он доказывает геометрически чертежом дополнения квадрата.',
        '«A square and ten roots equal thirty-nine» is the famous problem from al-Khwarizmi’s book. He squares half the number of roots, adds 39, takes the square root and subtracts the half; he proves this method geometrically with a diagram completing the square.'),
      vars:[ ['x', t('noma’lum («ildiz»)','неизвестное («корень»)','the unknown («root»)')], ['x^{2}', t('«mol» — noma’lumning kvadrati','«маль» — квадрат неизвестного','«mal» — the square of the unknown')] ] },
    { f:'x^{2} + bx = c  →  x = √((b/2)^{2} + c) − b/2', name:t('Kvadratni to‘ldirish qoidasi','Правило дополнения квадрата','Completing-the-square rule'),
      expl:t('Al-Xorazmiy so‘z bilan bayon qilgan umumiy qoidaning bugungi yozuvi (musbat koeffitsiyentlar va musbat ildiz uchun).',
        'Современная запись общего правила, изложенного аль-Хорезми словами (для положительных коэффициентов и положительного корня).',
        'Modern notation of the general rule that al-Khwarizmi stated in words (for positive coefficients and the positive root).'),
      vars:[ ['b', t('ildizlar soni (x oldidagi koeffitsiyent)','число корней (коэффициент при x)','number of roots (coefficient of x)')], ['c', t('ozod son','свободный член','constant term')] ] }
  ],
  tl:[
    [780, t('Xorazmda tug‘ildi (taxminan)','Родился в Хорезме (приблизительно)','Born in Khwarazm (approx.)')],
    [813, t('Al-Ma’mun xalifa bo‘ldi; al-Xorazmiy Bag‘dodda «Bayt ul-hikma»da ishlay boshladi (taxminan)','Аль-Мамун стал халифом; аль-Хорезми начал работать в «Доме мудрости» в Багдаде (около)','Al-Ma’mun becomes caliph; al-Khwarizmi begins working at the House of Wisdom in Baghdad (approx.)')],
    [825, t('«al-Jabr va-l-muqobala» yozildi (taxminan)','Написана «аль-Джабр валь-мукабала» (около)','«al-Jabr wa-l-muqabala» written (approx.)')],
    [830, t('«Zij as-Sindhind» astronomik jadvallari (taxminan)','Астрономические таблицы «Зидж ас-Синдхинд» (около)','«Zij al-Sindhind» astronomical tables (approx.)')],
    [833, t('«Surat al-arz» geografiyasi yakunlandi (taxminan)','Завершена «Сурат аль-ард» (около)','«Surat al-ard» completed (approx.)')],
    [850, t('Bag‘dodda vafot etdi (taxminan)','Умер в Багдаде (приблизительно)','Died in Baghdad (approx.)')],
    [1126, t('Adelard Batlik «Zij»ni lotin tiliga tarjima qildi','Аделард Батский перевёл «Зидж» на латынь','Adelard of Bath translates the «Zij» into Latin')],
    [1145, t('Robert Chesterlik «Algebra»ni lotin tiliga tarjima qildi','Роберт Честерский перевёл «Алгебру» на латынь','Robert of Chester translates the «Algebra» into Latin')],
    [1983, t('Al-Xorazmiy tavalludining 1200 yilligi xalqaro miqyosda nishonlandi','Международно отмечено 1200-летие аль-Хорезми','The 1200th anniversary of al-Khwarizmi is celebrated internationally')]
  ],
  facts:[
    t('«Algebra» so‘zi uning kitobi nomidagi «al-jabr»dan, «algoritm» so‘zi esa nomining lotincha shakli «Algoritmi»dan kelib chiqqan.','Слово «алгебра» происходит от «аль-джабр» в названии его книги, а «алгоритм» — от латинской формы его имени «Algoritmi».','The word «algebra» comes from «al-jabr» in the title of his book, and «algorithm» from the Latin form of his name, «Algoritmi».'),
    t('Ispan tilidagi «guarismo» (raqam) so‘zi ham al-Xorazmiy nomidan kelib chiqqan.','Испанское слово «guarismo» (цифра) тоже происходит от имени аль-Хорезми.','The Spanish word «guarismo» (digit) also derives from al-Khwarizmi’s name.'),
    t('Uning algebrasida hech qanday belgilar ishlatilmagan — barcha tenglamalar va yechimlar so‘z bilan yozilgan.','В его алгебре не использовалось никаких символов — все уравнения и решения записаны словами.','His algebra used no symbols at all; all equations and solutions are written out in words.'),
    t('Xiva shahrida al-Xorazmiyga haykal o‘rnatilgan, Toshkentdagi axborot texnologiyalari universiteti uning nomini oladi.','В Хиве установлен памятник аль-Хорезми, его имя носит Ташкентский университет информационных технологий.','A monument to al-Khwarizmi stands in Khiva, and the Tashkent University of Information Technologies bears his name.')
  ],
  legacy:t(
    'Oyning orqa tomonidagi Al-Khwarizmi krateri va 13498 Al Chwarizmi asteroidi uning nomi bilan atalgan. Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti, Xiva va Urganchdagi haykallar uning xotirasini abadiylashtiradi. Har bir kompyuter dasturi «algoritm» asosida ishlashi — al-Xorazmiy merosining bugungi kundagi eng yorqin ifodasidir.',
    'Кратер аль-Хорезми на обратной стороне Луны и астероид 13498 аль-Хорезми названы в его честь. Ташкентский университет информационных технологий имени Мухаммада аль-Хорезми и памятники в Хиве и Ургенче увековечивают его память. То, что каждая компьютерная программа работает на основе «алгоритма», — самое яркое сегодняшнее выражение наследия аль-Хорезми.',
    'The crater Al-Khwarizmi on the far side of the Moon and the asteroid 13498 Al Chwarizmi are named after him. The Muhammad al-Khwarizmi Tashkent University of Information Technologies and monuments in Khiva and Urgench perpetuate his memory. The fact that every computer program runs on an «algorithm» is the most vivid modern expression of al-Khwarizmi’s legacy.')
});

/* ───────────── Ahmad al-Farg‘oniy ───────────── */
S.push({
  id:'alfarghani',
  born:798, died:865,
  region:'central_asia',
  fields:['planets','instruments','calendar'],
  name:t('Ahmad al-Farg‘oniy','Ахмад аль-Фергани','Ahmad al-Farghani'),
  life:t('~798 – 861-yildan keyin','~798 – после 861','c. 798 – after 861'),
  place:t('Farg‘ona vodiysi, O‘zbekiston','Ферганская долина, Узбекистан','Fergana Valley, Uzbekistan'),
  role:t('Farg‘onalik astronom, matematik va muhandis','Ферганский астроном, математик и инженер','Astronomer, mathematician and engineer from Fergana'),
  short:t(
    'Ptolemey astronomiyasini sodda va aniq bayon qilgan «Astronomiya asoslari» asari bilan Yevropada «Alfraganus» nomi ostida asrlar davomida darslik muallifi bo‘lgan olim.',
    'Учёный, чья книга «Основы астрономии», ясно и просто излагавшая астрономию Птолемея, веками служила в Европе учебником под именем «Альфраганус».',
    'The scholar whose «Elements of Astronomy», a clear and simple exposition of Ptolemaic astronomy, served for centuries in Europe as a textbook under the name «Alfraganus».'),
  about:t(
    'Abul Abbos Ahmad ibn Muhammad ibn Kasir al-Farg‘oniy — IX asrda Bag‘dodda xalifa al-Ma’mun saroyidagi olimlar orasida ishlagan farg‘onalik astronom. Uning «Javome’ ilm an-nujum» («Yulduzlar ilmi jamlanmasi») asari Ptolemey «Almagest»ining asosiy mazmunini murakkab isbotlarsiz, tushunarli tarzda bayon qilgan. XII asrda ikki marta lotin tiliga tarjima qilinib, Yevropa universitetlarida keng o‘qilgan. Al-Farg‘oniy, shuningdek, astrolyabiya nazariyasi bo‘yicha risola yozgan va Qohiradagi mashhur Nilometrni qurishga rahbarlik qilgan.',
    'Абуль-Аббас Ахмад ибн Мухаммад ибн Касир аль-Фергани — ферганский астроном IX века, работавший в Багдаде среди учёных при дворе халифа аль-Мамуна. Его труд «Джавами ильм ан-нуджум» («Свод науки о звёздах») ясно и без сложных доказательств излагал основное содержание «Альмагеста» Птолемея. В XII веке он дважды был переведён на латынь и широко читался в европейских университетах. Аль-Фергани написал также трактат по теории астролябии и руководил строительством знаменитого Ниломера в Каире.',
    'Abu’l-Abbas Ahmad ibn Muhammad ibn Kathir al-Farghani was a 9th-century astronomer from Fergana who worked in Baghdad among the scholars at the court of Caliph al-Ma’mun. His work «Jawami ilm al-nujum» («Compendium of the Science of the Stars») set out the main content of Ptolemy’s «Almagest» clearly and without complicated proofs. In the 12th century it was translated into Latin twice and was widely read in European universities. Al-Farghani also wrote a treatise on the theory of the astrolabe and directed the construction of the famous Nilometer in Cairo.'),
  bio:[
    t('Al-Farg‘oniy VIII asr oxirida tug‘ilgan; uning nisbasi Farg‘ona vodiysidan ekanini bildiradi. An’anaviy ravishda uning tug‘ilgan yili taxminan 798 deb olinadi — 1998-yilda uning 1200 yillik yubileyi YUNESKO ishtirokida nishonlangan. Uning bolaligi va ilk ta’limi haqida aniq ma’lumot saqlanmagan.',
      'Аль-Фергани родился в конце VIII века; его нисба указывает на происхождение из Ферганской долины. Традиционно годом его рождения считают около 798 года — в 1998 году при участии ЮНЕСКО отмечался его 1200-летний юбилей. Точных сведений о его детстве и раннем образовании не сохранилось.',
      'Al-Farghani was born at the end of the 8th century; his nisba indicates that he came from the Fergana Valley. Traditionally his year of birth is taken to be about 798; in 1998 his 1200th anniversary was celebrated with the participation of UNESCO. No precise information about his childhood or early education has survived.'),
    t('Xalifa al-Ma’mun davrida u Bag‘dodga kelib, Markaziy Osiyodan chiqqan boshqa olimlar — al-Xorazmiy va boshqalar bilan bir qatorda xalifa homiyligidagi ilmiy faoliyatda ishtirok etgan. 820–830-yillarda Bag‘doddagi Shammosiya va Damashq yaqinidagi Qosiyun tog‘i rasadxonalarida kuzatuvlar o‘tkazilgan; al-Farg‘oniy ana shu davr astronomlari doirasiga mansub bo‘lgan.',
      'При халифе аль-Мамуне он прибыл в Багдад и наряду с другими выходцами из Центральной Азии — аль-Хорезми и другими — участвовал в научной деятельности под покровительством халифа. В 820–830-х годах велись наблюдения в обсерваториях Шаммасия в Багдаде и на горе Касьюн близ Дамаска; аль-Фергани принадлежал к кругу астрономов этого времени.',
      'In the time of Caliph al-Ma’mun he came to Baghdad and, together with other scholars from Central Asia such as al-Khwarizmi, took part in scientific work under the caliph’s patronage. In the 820s and 830s observations were made at the Shammasiyya observatory in Baghdad and on Mount Qasiyun near Damascus; al-Farghani belonged to the circle of astronomers of this time.'),
    t('Uning asosiy asari — «Javome’ ilm an-nujum» («Yulduzlar ilmi jamlanmasi», ba’zan «Astronomiya asoslari» deb ham ataladi) — taxminan 833-yildan keyin yozilgan. 30 bobdan iborat bu kitobda Yer sharsimonligi, osmon sferasi, iqlimlar, Quyosh, Oy va sayyoralar harakati, ularning masofalari va o‘lchamlari, tutilishlar hamda taqvimlar sodda tilda tushuntirilgan. Asar Ptolemey ma’lumotlarini al-Ma’mun davri olimlarining yangi o‘lchovlari bilan to‘ldirgan.',
      'Его главный труд — «Джавами ильм ан-нуджум» («Свод науки о звёздах», иногда называется «Основы астрономии») — написан, по-видимому, после 833 года. В этой книге из 30 глав простым языком объяснены шарообразность Земли, небесная сфера, климаты, движение Солнца, Луны и планет, их расстояния и размеры, затмения и календари. Труд дополнил данные Птолемея новыми измерениями учёных эпохи аль-Мамуна.',
      'His main work, «Jawami ilm al-nujum» («Compendium of the Science of the Stars», sometimes called «Elements of Astronomy»), was apparently written after 833. In 30 chapters this book explains in simple language the sphericity of the Earth, the celestial sphere, the climes, the motion of the Sun, Moon and planets, their distances and sizes, eclipses and calendars. The work supplemented Ptolemy’s data with new measurements by the scholars of al-Ma’mun’s time.'),
    t('Al-Farg‘oniy amaliy muhandislikda ham faol bo‘lgan. Tarixiy manbalarga ko‘ra, Abbosiy xalifa al-Mutavakkil topshirig‘i bilan 861-yilda Qohira yaqinidagi Ravza orolida Nil daryosi suv sathini o‘lchovchi inshoot — «al-Miqyos» (Nilometr) uning rahbarligida qurilgan. Bu inshoot hozirgacha saqlanib qolgan. Nilometr suv toshqinlari darajasini aniqlash orqali dehqonchilik va soliqlarni rejalashtirishda muhim ahamiyatga ega bo‘lgan.',
      'Аль-Фергани был активен и в практической инженерии. Согласно историческим источникам, по поручению аббасидского халифа аль-Мутаваккиля в 861 году под его руководством на острове Рода близ Каира было построено сооружение для измерения уровня воды Нила — «аль-Микъяс» (Ниломер). Это сооружение сохранилось до наших дней. Определяя уровень разливов, Ниломер имел важное значение для планирования земледелия и налогов.',
      'Al-Farghani was also active in practical engineering. According to historical sources, at the order of the Abbasid caliph al-Mutawakkil, in 861 a structure for measuring the water level of the Nile, «al-Miqyas» (the Nilometer), was built under his direction on Roda Island near Cairo. The structure survives to this day. By determining the level of the floods, the Nilometer was important for planning agriculture and taxes.'),
    t('U astrolyabiya nazariyasi bo‘yicha «al-Komil fi-l-asturlob» («Astrolyabiya haqida mukammal kitob») asarini yozib, stereografik proyeksiyaning matematik asoslarini puxta bayon qilgan. Al-Farg‘oniyning vafot yili aniq ma’lum emas; 861-yildan keyin, ehtimol Misrda vafot etgan. XII asrda uning asosiy asari Ioann Sevilyalik (1135-yil) va Gerard Kremonskiy tomonidan lotin tiliga tarjima qilingan va «Alfraganus» nomi Yevropada mashhur bo‘lgan.',
      'Он написал трактат по теории астролябии «аль-Камиль фи-ль-астурляб» («Полная книга об астролябии»), где обстоятельно изложил математические основы стереографической проекции. Год смерти аль-Фергани точно неизвестен; он умер после 861 года, вероятно в Египте. В XII веке его главный труд был переведён на латынь Иоанном Севильским (1135) и Герардом Кремонским, и имя «Альфраганус» стало знаменитым в Европе.',
      'He wrote a treatise on the theory of the astrolabe, «al-Kamil fi l-asturlab» («The Complete Book on the Astrolabe»), thoroughly setting out the mathematical foundations of stereographic projection. The year of al-Farghani’s death is not known precisely; he died after 861, probably in Egypt. In the 12th century his main work was translated into Latin by John of Seville (1135) and Gerard of Cremona, and the name «Alfraganus» became famous in Europe.')
  ],
  works:[
    [833, t('«Javome’ ilm an-nujum» («Astronomiya asoslari»)','«Джавами ильм ан-нуджум» («Основы астрономии»)','«Jawami ilm al-nujum» («Elements of Astronomy»)'),
      t('Ptolemey astronomiyasining 30 bobli sodda bayoni. Lotincha tarjimalari Yevropada asosiy darsliklardan biri bo‘lgan. Sana taxminiy (833-yildan keyin).',
        'Простое изложение астрономии Птолемея в 30 главах. Латинские переводы были одними из главных учебников в Европе. Дата приблизительна (после 833).',
        'A simple exposition of Ptolemaic astronomy in 30 chapters. Its Latin translations were among the main textbooks in Europe. Date approximate (after 833).')],
    [857, t('«al-Komil fi-l-asturlob»','«аль-Камиль фи-ль-астурляб»','«al-Kamil fi l-asturlab»'),
      t('Astrolyabiya qurilishining matematik nazariyasi, stereografik proyeksiyaning isboti bilan. Sana taxminiy.',
        'Математическая теория построения астролябии с доказательством стереографической проекции. Дата приблизительна.',
        'The mathematical theory of astrolabe construction, with a proof of stereographic projection. Date approximate.')],
    [861, t('Qohiradagi Nilometr (al-Miqyos)','Ниломер в Каире (аль-Микъяс)','The Nilometer in Cairo (al-Miqyas)'),
      t('Ravza orolidagi Nil suv sathini o‘lchash inshooti; al-Farg‘oniy rahbarligida qurilgan va bugungacha saqlangan.',
        'Сооружение для измерения уровня воды Нила на острове Рода; построено под руководством аль-Фергани и сохранилось до наших дней.',
        'A structure on Roda Island for measuring the water level of the Nile; built under al-Farghani’s direction and preserved to this day.')]
  ],
  disc:[
    ['📘', t('Astronomiyaning ommabop darsligi','Популярный учебник астрономии','A popular textbook of astronomy'),
      t('«Almagest»ning murakkab matematik isbotlarini chetlab o‘tib, uning natijalarini tizimli va tushunarli bayon qilgan. Bu kitob orqali Yevropa Ptolemey astronomiyasi bilan «Almagest» to‘liq tarjima qilinishidan oldin tanishgan.',
        'Обойдя сложные математические доказательства «Альмагеста», систематично и понятно изложил его результаты. Через эту книгу Европа познакомилась с астрономией Птолемея ещё до полного перевода «Альмагеста».',
        'Bypassing the complex mathematical proofs of the «Almagest», he set out its results systematically and clearly. Through this book Europe became acquainted with Ptolemaic astronomy even before the full translation of the «Almagest».')],
    ['🌍', t('Yer o‘lchamlari','Размеры Земли','Dimensions of the Earth'),
      t('Al-Ma’mun davridagi meridian yoyini o‘lchash natijasiga tayanib, meridianning bir gradusini 56⅔ arab mili, Yer aylanasini taxminan 20 400 mil, diametrini taxminan 6500 mil deb keltirgan.',
        'Опираясь на результат измерения дуги меридиана при аль-Мамуне, привёл длину одного градуса меридиана в 56⅔ арабской мили, окружность Земли — около 20 400 миль, диаметр — около 6500 миль.',
        'Relying on the result of the meridian-arc measurement under al-Ma’mun, he gave the length of one degree of the meridian as 56⅔ Arabic miles, the Earth’s circumference as about 20,400 miles and its diameter as about 6,500 miles.')],
    ['🪐', t('Sayyoralar masofalari va o‘lchamlari','Расстояния и размеры планет','Distances and sizes of the planets'),
      t('Sayyoralar sferalari bir-biriga tegib joylashgan, degan farazdan foydalanib, Oy, Quyosh va sayyoralargacha bo‘lgan masofalar hamda ularning o‘lchamlari jadvalini bergan; bu jadval o‘rta asrlarda keng iqtibos qilingan.',
        'Исходя из предположения, что сферы планет примыкают друг к другу, дал таблицу расстояний до Луны, Солнца и планет и их размеров; эта таблица широко цитировалась в Средние века.',
        'Assuming that the planetary spheres are nested in contact with one another, he gave a table of the distances to the Moon, Sun and planets and of their sizes; this table was widely quoted in the Middle Ages.')],
    ['🧭', t('Astrolyabiya nazariyasi','Теория астролябии','Theory of the astrolabe'),
      t('Stereografik proyeksiyaning xossalarini qat’iy isbotlab, astrolyabiya yasashni matematik asosga qo‘ygan.',
        'Строго доказав свойства стереографической проекции, поставил построение астролябии на математическую основу.',
        'By rigorously proving the properties of stereographic projection, he put the construction of the astrolabe on a mathematical foundation.')]
  ],
  instr:[
    [t('Astrolyabiya','Астролябия','Astrolabe'),
      t('«al-Komil» risolasida astrolyabiya disklarini turli kengliklar uchun chizish va hisoblash usullarini batafsil bayon qilgan.',
        'В трактате «аль-Камиль» подробно изложил способы построения и расчёта дисков астролябии для разных широт.',
        'In the treatise «al-Kamil» he described in detail how to draw and calculate astrolabe plates for different latitudes.'),
      'ins:astrolabe'],
    [t('Nilometr (al-Miqyos)','Ниломер (аль-Микъяс)','Nilometer (al-Miqyas)'),
      t('Markazida bo‘linmalari bo‘lgan marmar ustunli quduqsimon inshoot; Nil suvi sathining ko‘tarilishini o‘lchash uchun xizmat qilgan.',
        'Колодцеобразное сооружение с мраморной колонной с делениями в центре; служило для измерения подъёма уровня воды Нила.',
        'A well-like structure with a graduated marble column at its centre; it served to measure the rise of the Nile’s water level.'),
      null]
  ],
  formulas:[
    { f:'C = 360 · 56⅔ mil = 20 400 mil', name:t('Yer aylanasi (al-Farg‘oniy bo‘yicha)','Окружность Земли (по аль-Фергани)','Earth’s circumference (after al-Farghani)'),
      expl:t('Meridianning bir gradusi uzunligini 360 ga ko‘paytirib, Yer aylanasi topiladi. Arab mili taxminan 1,97 km bo‘lsa, natija ~40 000 km ga yaqin. Kolumb bu qiymatni arab mili o‘rniga qisqaroq Rim mili deb tushunib, Yerni ancha kichik deb hisoblagan.',
        'Умножив длину одного градуса меридиана на 360, получают окружность Земли. Если арабская миля ≈ 1,97 км, результат близок к ~40 000 км. Колумб принял эти мили за более короткие римские и поэтому считал Землю значительно меньше.',
        'Multiplying the length of one degree of the meridian by 360 gives the Earth’s circumference. If the Arabic mile is about 1.97 km, the result is close to ~40,000 km. Columbus took these miles to be the shorter Roman miles and therefore thought the Earth considerably smaller.'),
      vars:[ ['C', t('Yer aylanasi','окружность Земли','Earth’s circumference')], ['56⅔', t('bir gradus uzunligi, arab milida','длина градуса в арабских милях','length of one degree in Arabic miles')] ] }
  ],
  tl:[
    [798, t('Farg‘ona vodiysida tug‘ildi (an’anaviy sana, taxminiy)','Родился в Ферганской долине (традиционная дата, приблизительно)','Born in the Fergana Valley (traditional date, approx.)')],
    [813, t('Al-Ma’mun xalifa bo‘ldi; Bag‘dodda ilmiy faoliyat kuchaydi','Аль-Мамун стал халифом; в Багдаде расцвела научная деятельность','Al-Ma’mun becomes caliph; scientific activity flourishes in Baghdad')],
    [829, t('Bag‘dodda Shammosiya rasadxonasida kuzatuvlar boshlandi (taxminan)','В Багдаде начались наблюдения в обсерватории Шаммасия (около)','Observations begin at the Shammasiyya observatory in Baghdad (approx.)')],
    [833, t('«Javome’ ilm an-nujum» ustida ishladi (shu yildan keyin)','Работал над «Джавами ильм ан-нуджум» (после этого года)','Worked on «Jawami ilm al-nujum» (after this year)')],
    [857, t('«al-Komil fi-l-asturlob» risolasi (taxminan)','Трактат «аль-Камиль фи-ль-астурляб» (около)','Treatise «al-Kamil fi l-asturlab» (approx.)')],
    [861, t('Qohiradagi Nilometr qurilishiga rahbarlik qildi','Руководил строительством Ниломера в Каире','Directed the construction of the Nilometer in Cairo')],
    [1135, t('Ioann Sevilyalik asosiy asarini lotin tiliga tarjima qildi','Иоанн Севильский перевёл главный труд на латынь','John of Seville translates his main work into Latin')],
    [1998, t('1200 yillik yubileyi YUNESKO ishtirokida nishonlandi','При участии ЮНЕСКО отмечен 1200-летний юбилей','His 1200th anniversary is celebrated with UNESCO’s participation')]
  ],
  facts:[
    t('Dante Aligyeri «Ziyofat» (Convivio) asarida astronomik ma’lumotlarni al-Farg‘oniy kitobidan olgan.','Данте Алигьери в «Пире» (Convivio) использовал астрономические сведения из книги аль-Фергани.','Dante Alighieri used astronomical information from al-Farghani’s book in his «Convivio».'),
    t('Xristofor Kolumb al-Farg‘oniyning gradus uzunligidan foydalangan, lekin arab milini Rim mili deb xato tushungani uchun Yerni haqiqatdagidan kichik deb hisoblagan.','Христофор Колумб пользовался длиной градуса аль-Фергани, но, ошибочно приняв арабскую милю за римскую, считал Землю меньше, чем она есть.','Christopher Columbus used al-Farghani’s length of a degree but, mistaking the Arabic mile for the Roman mile, believed the Earth to be smaller than it is.'),
    t('Al-Farg‘oniy rahbarligida qurilgan Nilometr o‘n bir asrdan ortiq vaqtdan beri saqlanib kelmoqda.','Ниломер, построенный под руководством аль-Фергани, сохраняется уже более одиннадцати веков.','The Nilometer built under al-Farghani’s direction has survived for more than eleven centuries.'),
    t('Farg‘ona shahrida al-Farg‘oniy nomidagi bog‘ va unga o‘rnatilgan haykal bor.','В городе Фергана есть парк имени аль-Фергани и установленный ему памятник.','In the city of Fergana there is a park named after al-Farghani and a monument to him.')
  ],
  legacy:t(
    'Oydagi Alfraganus krateri uning lotincha nomi bilan atalgan. Uning kitobi Yevropada Uyg‘onish davrigacha astronomiyaning asosiy darsliklaridan biri bo‘lib, Regiomontan kabi olimlar ham undan foydalangan. O‘zbekistonda al-Farg‘oniy xalqimizning ilm-fan tarixidagi faxri sifatida ulug‘lanadi.',
    'Кратер Альфраганус на Луне назван его латинским именем. Его книга была одним из главных учебников астрономии в Европе вплоть до эпохи Возрождения; ею пользовались и такие учёные, как Региомонтан. В Узбекистане аль-Фергани почитается как гордость народа в истории науки.',
    'The lunar crater Alfraganus bears his Latin name. His book was one of the main astronomy textbooks in Europe up to the Renaissance, used by scholars such as Regiomontanus. In Uzbekistan al-Farghani is honoured as a source of national pride in the history of science.')
});

/* ───────────── al-Battoniy ───────────── */
S.push({
  id:'albattani',
  born:858, died:929,
  region:'islamic',
  fields:['planets','math','calendar'],
  name:t('al-Battoniy','аль-Баттани','al-Battani'),
  life:t('~858 – 929','~858 – 929','c. 858 – 929'),
  place:t('Harron atrofi, Turkiya','окрестности Харрана, Турция','near Harran, Turkey'),
  role:t('Arab astronomi va matematigi','Арабский астроном и математик','Arab astronomer and mathematician'),
  short:t(
    'Qariyb 40 yil kuzatuv olib borib, yil uzunligi, ekliptika og‘ishi va presessiyani Ptolemeydan ancha aniq o‘lchagan va trigonometriyani astronomiyaga keng joriy qilgan olim.',
    'Учёный, около 40 лет ведший наблюдения, измеривший длину года, наклон эклиптики и прецессию значительно точнее Птолемея и широко внедривший тригонометрию в астрономию.',
    'A scholar who observed for about 40 years, measured the length of the year, the obliquity of the ecliptic and precession far more accurately than Ptolemy, and brought trigonometry widely into astronomy.'),
  about:t(
    'Abu Abdulloh Muhammad ibn Jobir ibn Sinon al-Battoniy — IX–X asrlarda Raqqa shahrida (hozirgi Suriya) ishlagan astronom. Uning 877–918-yillardagi kuzatuvlari asosida yozilgan «az-Zij as-Sobi’» astronomik jadvallari o‘rta asrlarning eng nufuzli astronomik asarlaridan biri bo‘lgan. U Ptolemeyning ko‘plab qiymatlarini yangi o‘lchovlar bilan tuzatgan va xordalar o‘rniga sinuslardan foydalanishni keng joriy etgan. Yevropada «Albategnius» nomi bilan tanilgan va Kopernik, Tixo Brage, Kepler kabi olimlar uning asaridan foydalangan.',
    'Абу Абдуллах Мухаммад ибн Джабир ибн Синан аль-Баттани — астроном IX–X веков, работавший в городе Ракка (ныне Сирия). Его астрономические таблицы «аз-Зидж ас-Саби», составленные на основе наблюдений 877–918 годов, были одним из самых авторитетных астрономических трудов Средневековья. Он исправил многие значения Птолемея новыми измерениями и широко ввёл использование синусов вместо хорд. В Европе он был известен как «Альбатегний», и его трудом пользовались Коперник, Тихо Браге и Кеплер.',
    'Abu Abdallah Muhammad ibn Jabir ibn Sinan al-Battani was a 9th–10th-century astronomer who worked in the city of Raqqa (modern Syria). His astronomical tables, «al-Zij al-Sabi», based on observations from 877 to 918, were among the most authoritative astronomical works of the Middle Ages. He corrected many of Ptolemy’s values with new measurements and widely introduced the use of sines instead of chords. In Europe he was known as «Albategnius», and Copernicus, Tycho Brahe and Kepler made use of his work.'),
  bio:[
    t('Al-Battoniy taxminan 858-yilda Harron shahri atrofida (hozirgi Turkiyaning janubi-sharqi) tug‘ilgan. Uning nisbasi «as-Sobi’» ajdodlari Harronning yulduzlarga qiziqishi bilan mashhur sobiiylar jamoasidan bo‘lganini ko‘rsatadi, lekin uning o‘zi musulmon bo‘lgan. Uning otasi Jobir ibn Sinon astronomik asboblar yasovchi usta bo‘lgani haqida ma’lumot bor; ehtimol, al-Battoniy asbobsozlikni otasidan o‘rgangan.',
      'Аль-Баттани родился около 858 года в окрестностях города Харран (юго-восток современной Турции). Его нисба «ас-Саби» указывает, что его предки принадлежали к общине сабиев Харрана, известной интересом к звёздам, однако сам он был мусульманином. Есть сведения, что его отец Джабир ибн Синан был мастером-изготовителем астрономических инструментов; вероятно, аль-Баттани научился этому ремеслу у отца.',
      'Al-Battani was born around 858 near the city of Harran (south-eastern Turkey today). His nisba «al-Sabi» shows that his ancestors belonged to the Sabian community of Harran, known for its interest in the stars, though he himself was a Muslim. There are reports that his father, Jabir ibn Sinan, was a maker of astronomical instruments; al-Battani probably learned this craft from his father.'),
    t('U umrining asosiy qismini Furot daryosi bo‘yidagi Raqqa shahrida o‘tkazgan va u yerda shaxsiy rasadxonasida 877-yildan 918-yilgacha muntazam kuzatuvlar olib borgan. Qariyb qirq yillik bu kuzatuvlar o‘sha davr uchun noyob uzluksiz ma’lumotlar qatorini hosil qilgan. U Quyosh, Oy va sayyoralarni, shuningdek Quyosh va Oy tutilishlarini katta aniqlikda kuzatgan.',
      'Большую часть жизни он провёл в городе Ракка на берегу Евфрата, где в своей обсерватории с 877 по 918 год вёл регулярные наблюдения. Эти почти сорокалетние наблюдения составили уникальный для своего времени непрерывный ряд данных. Он с большой точностью наблюдал Солнце, Луну и планеты, а также солнечные и лунные затмения.',
      'He spent most of his life in the city of Raqqa on the Euphrates, where from 877 to 918 he made regular observations in his own observatory. These observations, spanning almost forty years, formed a continuous data series unique for its time. He observed the Sun, Moon and planets, as well as solar and lunar eclipses, with great precision.'),
    t('Uning asosiy asari — «az-Zij as-Sobi’» 57 bobdan iborat bo‘lib, unda astronomik nazariya, hisoblash qoidalari va jadvallar berilgan. Al-Battoniy tropik yil uzunligini 365 kun 5 soat 46 daqiqa 24 soniya deb aniqlagan, ekliptika og‘ishini 23°35′ deb o‘lchagan va presessiyani yiliga 54,5″ (66 yilda 1°) deb topgan. U Quyosh apogeyi Ptolemey davridan beri siljiganini aniqlagan.',
      'Его главный труд — «аз-Зидж ас-Саби» — состоит из 57 глав, где изложены астрономическая теория, правила вычислений и таблицы. Аль-Баттани определил длину тропического года в 365 суток 5 часов 46 минут 24 секунды, измерил наклон эклиптики как 23°35′ и нашёл прецессию равной 54,5″ в год (1° за 66 лет). Он установил, что апогей Солнца сместился со времён Птолемея.',
      'His main work, «al-Zij al-Sabi», consists of 57 chapters setting out astronomical theory, rules of calculation and tables. Al-Battani determined the length of the tropical year as 365 days 5 hours 46 minutes 24 seconds, measured the obliquity of the ecliptic as 23°35′ and found precession to be 54.5″ per year (1° in 66 years). He established that the Sun’s apogee had moved since Ptolemy’s time.'),
    t('Matematikada al-Battoniy Ptolemeyning xordalari o‘rniga hind an’anasidan kelgan sinus funksiyasidan izchil foydalangan, kotangens (soya) qiymatlari jadvalini tuzgan va sferik uchburchaklar uchun muhim munosabatlarni qo‘llagan. Bu yondashuv astronomik hisob-kitoblarni ancha soddalashtirgan. U, shuningdek, Oyning ko‘rinma diametri o‘zgarishini kuzatib, halqasimon Quyosh tutilishi bo‘lishi mumkinligini ko‘rsatgan.',
      'В математике аль-Баттани последовательно использовал вместо хорд Птолемея пришедшую из индийской традиции функцию синуса, составил таблицу котангенсов («теней») и применял важные соотношения для сферических треугольников. Такой подход значительно упростил астрономические расчёты. Наблюдая изменение видимого диаметра Луны, он также показал возможность кольцеобразных солнечных затмений.',
      'In mathematics al-Battani consistently used the sine function, which came from the Indian tradition, instead of Ptolemy’s chords, compiled a table of cotangents («shadows») and applied important relations for spherical triangles. This approach greatly simplified astronomical calculations. By observing the variation in the Moon’s apparent diameter, he also showed that annular solar eclipses are possible.'),
    t('929-yilda al-Battoniy Raqqa aholisi nomidan soliqlar bo‘yicha shikoyat bilan Bag‘dodga borgan va qaytish yo‘lida, Samarro yaqinidagi Qasr al-Jiss degan joyda vafot etgan. Uning zijini XII asrda Platon Tivolilik lotin tiliga «De motu stellarum» nomi bilan tarjima qilgan; 1537-yilda Nyurnbergda bosilgan. Kopernik «Osmon sferalarining aylanishi haqida» asarida al-Battoniyni ko‘p marta tilga olgan.',
      'В 929 году аль-Баттани отправился в Багдад с жалобой от имени жителей Ракки по поводу налогов и на обратном пути умер в местечке Каср аль-Джисс близ Самарры. Его зидж в XII веке перевёл на латынь Платон Тиволийский под названием «De motu stellarum»; в 1537 году он был напечатан в Нюрнберге. Коперник многократно упоминает аль-Баттани в труде «О вращении небесных сфер».',
      'In 929 al-Battani travelled to Baghdad with a complaint about taxes on behalf of the people of Raqqa and died on the way back at a place called Qasr al-Jiss near Samarra. His zij was translated into Latin in the 12th century by Plato of Tivoli under the title «De motu stellarum»; it was printed in Nuremberg in 1537. Copernicus mentions al-Battani many times in «On the Revolutions of the Heavenly Spheres».')
  ],
  works:[
    [900, t('«az-Zij as-Sobi’» (Sobiiy zij)','«аз-Зидж ас-Саби» («Сабийский зидж»)','«al-Zij al-Sabi» («The Sabian Tables»)'),
      t('57 bobli astronomik qo‘llanma va jadvallar: Quyosh, Oy, sayyoralar, tutilishlar va yulduz katalogi. Yevropada «De motu stellarum» nomi bilan mashhur bo‘lgan. Sana taxminiy (kuzatuvlar 877–918).',
        'Астрономическое руководство и таблицы в 57 главах: Солнце, Луна, планеты, затмения и звёздный каталог. В Европе известен как «De motu stellarum». Дата приблизительна (наблюдения 877–918).',
        'An astronomical handbook and tables in 57 chapters: Sun, Moon, planets, eclipses and a star catalogue. Known in Europe as «De motu stellarum». Date approximate (observations 877–918).')],
    [1537, t('«De motu stellarum» — lotincha tarjimaning bosma nashri','«De motu stellarum» — печатное издание латинского перевода','«De motu stellarum» — printed edition of the Latin translation'),
      t('XII asrda Platon Tivolilik qilgan lotincha tarjima 1537-yilda Nyurnbergda, 1645-yilda Bolonyada bosilgan.',
        'Латинский перевод, выполненный в XII веке Платоном Тиволийским, напечатан в Нюрнберге в 1537 и в Болонье в 1645 году.',
        'The Latin translation made by Plato of Tivoli in the 12th century was printed in Nuremberg in 1537 and in Bologna in 1645.')]
  ],
  disc:[
    ['📅', t('Tropik yil uzunligi','Длина тропического года','Length of the tropical year'),
      t('Yilni 365 kun 5 soat 46 daqiqa 24 soniya deb o‘lchagan. Bu Ptolemey qiymatidan ancha aniq bo‘lib, keyingi taqvim islohotlari muhokamalarida ham iqtibos keltirilgan.',
        'Измерил год как 365 суток 5 часов 46 минут 24 секунды. Это значительно точнее значения Птолемея и цитировалось даже в обсуждениях последующих календарных реформ.',
        'He measured the year as 365 days 5 hours 46 minutes 24 seconds. This was considerably more accurate than Ptolemy’s value and was quoted even in discussions of later calendar reforms.')],
    ['📐', t('Ekliptika og‘ishi','Наклон эклиптики','Obliquity of the ecliptic'),
      t('23°35′ deb o‘lchagan — o‘z davri uchun hisoblangan haqiqiy qiymatga juda yaqin. Ptolemey qiymati (23°51′) bilan taqqoslash keyinchalik og‘ishning asrlar davomida sekin kamayishini tushunishga yordam bergan.',
        'Измерил его как 23°35′ — очень близко к истинному значению для своей эпохи. Сравнение со значением Птолемея (23°51′) впоследствии помогло понять медленное уменьшение наклона на протяжении веков.',
        'He measured it as 23°35′, very close to the true value for his epoch. Comparison with Ptolemy’s value (23°51′) later helped people understand the slow decrease of the obliquity over the centuries.')],
    ['☀️', t('Quyosh apogeyining harakati','Движение апогея Солнца','Motion of the solar apogee'),
      t('Quyosh orbitasining Yerdan eng uzoq nuqtasi (apogey) Ptolemey davridan beri yulduzlarga nisbatan siljiganini aniqlagan.',
        'Установил, что наиболее удалённая от Земли точка солнечной орбиты (апогей) со времён Птолемея сместилась относительно звёзд.',
        'He established that the point of the Sun’s orbit farthest from the Earth (the apogee) had shifted relative to the stars since Ptolemy’s time.')],
    ['📏', t('Trigonometriyani rivojlantirish','Развитие тригонометрии','Advancing trigonometry'),
      t('Xordalar o‘rniga sinuslardan foydalangan, kotangens jadvalini tuzgan va sferik uchburchaklar uchun kosinuslar munosabatini astronomik masalalarda qo‘llagan.',
        'Использовал синусы вместо хорд, составил таблицу котангенсов и применял соотношение косинусов для сферических треугольников в астрономических задачах.',
        'He used sines instead of chords, compiled a table of cotangents and applied the cosine relation for spherical triangles in astronomical problems.')],
    ['🌘', t('Halqasimon tutilish imkoniyati','Возможность кольцеобразного затмения','Possibility of annular eclipses'),
      t('Oyning ko‘rinma o‘lchami o‘zgarishini hisobga olib, ba’zan Oy Quyoshni to‘liq yopa olmasligi va halqasimon tutilish yuz berishi mumkinligini ko‘rsatgan.',
        'Учтя изменение видимого размера Луны, показал, что иногда Луна не может полностью закрыть Солнце и возможно кольцеобразное затмение.',
        'Taking into account the variation in the Moon’s apparent size, he showed that sometimes the Moon cannot fully cover the Sun, so that an annular eclipse can occur.')]
  ],
  instr:[
    [t('Armillyar sfera','Армиллярная сфера','Armillary sphere'),
      t('Zijda osmon koordinatalarini o‘lchash uchun armillyar sferadan foydalanishni tasvirlagan.',
        'В зидже описал использование армиллярной сферы для измерения небесных координат.',
        'In his zij he described the use of the armillary sphere for measuring celestial coordinates.'),
      'ins:armillary'],
    [t('Devoriy kvadrant','Стенной квадрант','Mural quadrant'),
      t('Meridian bo‘ylab o‘rnatilgan kvadrant bilan Quyoshning tush paytidagi balandligini o‘lchab, ekliptika og‘ishi va yil uzunligini aniqlagan.',
        'Измеряя квадрантом, установленным по меридиану, полуденную высоту Солнца, определял наклон эклиптики и длину года.',
        'By measuring the noon altitude of the Sun with a quadrant set along the meridian, he determined the obliquity of the ecliptic and the length of the year.'),
      'ins:quadrant'],
    [t('Gnomon','Гномон','Gnomon'),
      t('Gnomon soyalari uchun kotangens («soya») jadvalini tuzib, soya uzunligidan Quyosh balandligini hisoblash usulini bergan.',
        'Составив таблицу котангенсов («теней») для гномона, дал способ вычислять высоту Солнца по длине тени.',
        'By compiling a table of cotangents («shadows») for the gnomon, he gave a method of calculating the Sun’s altitude from the length of a shadow.'),
      'ins:gnomon']
  ],
  formulas:[
    { f:'cos a = cos b · cos c + sin b · sin c · cos A', name:t('Sferik uchburchak uchun kosinuslar teoremasi','Теорема косинусов для сферического треугольника','Spherical law of cosines'),
      expl:t('Al-Battoniy osmon sferasidagi masalalarni yechishda shu munosabatga teng kuchli qoidadan foydalangan (masalan, Quyosh balandligi va azimutini hisoblashda). Bu sferik trigonometriyaning asosiy formulalaridan biri.',
        'Аль-Баттани при решении задач на небесной сфере пользовался правилом, равносильным этому соотношению (например, при расчёте высоты и азимута Солнца). Это одна из основных формул сферической тригонометрии.',
        'Al-Battani used a rule equivalent to this relation when solving problems on the celestial sphere (for example, calculating the Sun’s altitude and azimuth). It is one of the fundamental formulas of spherical trigonometry.'),
      vars:[ ['a, b, c', t('sferik uchburchak tomonlari (yoylar)','стороны сферического треугольника (дуги)','sides of the spherical triangle (arcs)')], ['A', t('a tomon qarshisidagi burchak','угол, противолежащий стороне a','angle opposite side a')] ] },
    { f:'h = l · cot θ', name:t('Soya qoidasi','Правило тени','Shadow rule'),
      expl:t('Uzunligi l bo‘lgan gnomon Quyosh balandligi θ bo‘lganda h uzunlikdagi soya tashlaydi. Al-Battoniy shu bog‘lanish uchun «soya» (kotangens) jadvalini tuzgan.',
        'Гномон длины l при высоте Солнца θ отбрасывает тень длины h. Для этой зависимости аль-Баттани составил таблицу «теней» (котангенсов).',
        'A gnomon of length l casts a shadow of length h when the Sun’s altitude is θ. For this relationship al-Battani compiled a table of «shadows» (cotangents).'),
      vars:[ ['h', t('soya uzunligi','длина тени','shadow length')], ['l', t('gnomon balandligi','высота гномона','gnomon height')], ['θ', t('Quyosh balandligi','высота Солнца','Sun’s altitude')] ] }
  ],
  tl:[
    [858, t('Harron atrofida tug‘ildi (taxminan)','Родился в окрестностях Харрана (приблизительно)','Born near Harran (approx.)')],
    [877, t('Raqqada muntazam kuzatuvlarni boshladi','Начал регулярные наблюдения в Ракке','Began regular observations in Raqqa')],
    [880, t('Ekliptika og‘ishini 23°35′ deb o‘lchadi (taxminan)','Измерил наклон эклиптики как 23°35′ (около)','Measured the obliquity of the ecliptic as 23°35′ (approx.)')],
    [900, t('«az-Zij as-Sobi’» ustida ishladi (taxminan)','Работал над «аз-Зидж ас-Саби» (около)','Worked on «al-Zij al-Sabi» (approx.)')],
    [918, t('Ma’lum bo‘lgan eng so‘nggi kuzatuvi','Последнее известное наблюдение','Latest known observation')],
    [929, t('Bag‘doddan qaytishda Samarro yaqinida vafot etdi','Умер близ Самарры на обратном пути из Багдада','Died near Samarra on the way back from Baghdad')],
    [1140, t('XII asrda Platon Tivolilik zijni lotin tiliga tarjima qildi (taxminiy sana)','В XII веке Платон Тиволийский перевёл зидж на латынь (примерная дата)','In the 12th century Plato of Tivoli translates the zij into Latin (approximate date)')],
    [1537, t('Lotincha tarjimasi Nyurnbergda bosildi','Латинский перевод напечатан в Нюрнберге','The Latin translation is printed in Nuremberg')]
  ],
  table:{
    title:t('Al-Battoniy o‘lchovlari va bugungi qiymatlar','Измерения аль-Баттани и современные значения','Al-Battani’s measurements and modern values'),
    cols:[t('Kattalik','Величина','Quantity'), t('Ptolemey','Птолемей','Ptolemy'), t('al-Battoniy','аль-Баттани','al-Battani'), t('Bugungi qiymat','Современное значение','Modern value')],
    rows:[
      [t('Tropik yil','Тропический год','Tropical year'), '365 d 5 h 55 min', '365 d 5 h 46 min 24 s', '365 d 5 h 48 min 45 s'],
      [t('Ekliptika og‘ishi','Наклон эклиптики','Obliquity of the ecliptic'), '23°51′', '23°35′', '≈ 23°35′ (880) / 23°26′ (2000)'],
      [t('Presessiya, yiliga','Прецессия, в год','Precession, per year'), '36″', '54,5″', '50,3″']
    ],
    note:t('Og‘ishning bugungi qiymati al-Battoniy davri (~880-yil) va hozirgi davr uchun berilgan.','Современное значение наклона дано для эпохи аль-Баттани (~880 г.) и для нашего времени.','The modern obliquity value is given for al-Battani’s epoch (c. 880) and for the present.')
  },
  facts:[
    t('Kopernik o‘zining asosiy asarida al-Battoniyni 20 dan ortiq marta tilga olgan.','Коперник упоминает аль-Баттани в своём главном труде более 20 раз.','Copernicus mentions al-Battani more than 20 times in his main work.'),
    t('Al-Battoniy qariyb 40 yil davomida bir joyda — Raqqada uzluksiz kuzatuv olib borgan.','Аль-Баттани почти 40 лет непрерывно наблюдал в одном месте — в Ракке.','Al-Battani observed continuously in one place, Raqqa, for almost 40 years.'),
    t('Uning yil uzunligi bugungi qiymatdan atigi 2 daqiqaga yaqin farq qiladi.','Его длина года отличается от современного значения лишь примерно на 2 минуты.','His length of the year differs from the modern value by only about 2 minutes.'),
    t('«Star Trek» ilmiy-fantastik serialidagi kosmik kemalardan biri «USS Al-Batani» deb nomlangan.','Один из звездолётов научно-фантастического сериала «Звёздный путь» назван «USS Аль-Батани».','One of the starships in the science-fiction series «Star Trek» is named «USS Al-Batani».')
  ],
  legacy:t(
    'Oydagi Albategnius krateri uning lotincha nomi bilan atalgan. Uning aniq kuzatuvlari va trigonometrik usullari Kopernik, Regiomontan, Tixo Brage, Kepler va Galiley kabi Yevropa olimlarining ishlariga ta’sir ko‘rsatgan. Al-Battoniy o‘rta asrlarning eng buyuk kuzatuvchi astronomlaridan biri hisoblanadi.',
    'Кратер Альбатегний на Луне назван его латинским именем. Его точные наблюдения и тригонометрические методы повлияли на работы таких европейских учёных, как Коперник, Региомонтан, Тихо Браге, Кеплер и Галилей. Аль-Баттани считается одним из величайших астрономов-наблюдателей Средневековья.',
    'The lunar crater Albategnius bears his Latin name. His precise observations and trigonometric methods influenced the work of European scholars such as Copernicus, Regiomontanus, Tycho Brahe, Kepler and Galileo. Al-Battani is regarded as one of the greatest observational astronomers of the Middle Ages.')
});

/* ───────────── Abdurahmon as-Sufiy ───────────── */
S.push({
  id:'alsufi',
  born:903, died:986,
  region:'islamic',
  fields:['stars','instruments'],
  name:t('Abdurahmon as-Sufiy','Абд ар-Рахман ас-Суфи','Abd al-Rahman al-Sufi'),
  life:t('903 – 986','903 – 986','903 – 986'),
  place:t('Ray (Tehron yaqinida), Eron','Рей (близ Тегерана), Иран','Rey (near Tehran), Iran'),
  role:t('Fors astronomi, «Qo‘zg‘almas yulduzlar surati kitobi» muallifi','Персидский астроном, автор «Книги изображений неподвижных звёзд»','Persian astronomer, author of the «Book of Fixed Stars»'),
  short:t(
    'Yulduzlar yorqinligi va holatini qayta o‘lchab, ajoyib suratli yulduz atlasini yaratgan hamda Andromeda galaktikasini birinchi bo‘lib yozma qayd etgan olim.',
    'Учёный, заново измеривший блеск и положения звёзд, создавший великолепный иллюстрированный звёздный атлас и первым письменно отметивший галактику Андромеды.',
    'The scholar who remeasured the brightness and positions of the stars, created a magnificent illustrated star atlas, and was the first to record the Andromeda Galaxy in writing.'),
  about:t(
    'Abul Husayn Abdurahmon ibn Umar as-Sufiy — X asrda Buyidlar saroyida ishlagan fors astronomi. Uning «Kitob suvar al-kavokib as-sobita» («Qo‘zg‘almas yulduzlar surati kitobi») asari Ptolemey katalogini o‘z kuzatuvlari bilan tanqidiy qayta ko‘rib chiqqan va har bir yulduz turkumini ikki xil — osmonda ko‘rinishicha va globusda ko‘rinishicha tasvirlagan. U yulduzlarning arabcha an’anaviy nomlarini to‘plagan; ularning ko‘pchiligi bugun ham ishlatiladi. Yevropada u «Azofi» nomi bilan tanilgan.',
    'Абуль-Хусейн Абд ар-Рахман ибн Умар ас-Суфи — персидский астроном X века, работавший при дворе Буидов. Его «Китаб сувар аль-кавакиб ас-сабита» («Книга изображений неподвижных звёзд») критически пересмотрела каталог Птолемея на основе собственных наблюдений и изобразила каждое созвездие в двух видах — каким оно видно на небе и каким на глобусе. Он собрал традиционные арабские названия звёзд; многие из них используются и сегодня. В Европе он был известен как «Азофи».',
    'Abu’l-Husayn Abd al-Rahman ibn Umar al-Sufi was a 10th-century Persian astronomer who worked at the Buyid court. His «Kitab suwar al-kawakib al-thabita» («Book of the Images of the Fixed Stars») critically revised Ptolemy’s catalogue on the basis of his own observations and depicted each constellation in two ways: as seen in the sky and as seen on a globe. He collected the traditional Arabic names of the stars, many of which are still in use today. In Europe he was known as «Azophi».'),
  bio:[
    t('As-Sufiy 903-yil 7-dekabrda Eronning Ray shahrida tug‘ilgan. U yoshligidan astronomiya bilan shug‘ullangan va o‘z davrining ko‘zga ko‘ringan olimlaridan biri sifatida tanilgan. Ba’zi manbalarga ko‘ra, u Ptolemey «Almagest»ini va arablarning yulduzlar haqidagi an’anaviy bilimlarini — «anvo» adabiyotini chuqur o‘rgangan.',
      'Ас-Суфи родился 7 декабря 903 года в городе Рей в Иране. С юности он занимался астрономией и стал известен как один из выдающихся учёных своего времени. По некоторым сведениям, он глубоко изучил «Альмагест» Птолемея и традиционные арабские знания о звёздах — литературу «анва».',
      'Al-Sufi was born on 7 December 903 in the city of Rey in Iran. He studied astronomy from his youth and became known as one of the outstanding scholars of his time. According to some sources, he made a deep study of Ptolemy’s «Almagest» and of the traditional Arabic knowledge of the stars, the «anwa» literature.'),
    t('U Buyidlar sulolasi hukmdori Azud ad-Davla saroyida ishlagan va hukmdorning astronomiya bo‘yicha ustozi bo‘lgan deb hisoblanadi. Buyidlar Sheroz, Isfahon va Bag‘dodda ilm-fanga homiylik qilgan. As-Sufiy Isfahon va Sheroz shaharlarida kuzatuvlar olib borgan, saroy olimlari bilan birgalikda ishlagan.',
      'Он работал при дворе Адуд ад-Даулы, правителя из династии Буидов, и считается его наставником в астрономии. Буиды покровительствовали науке в Ширазе, Исфахане и Багдаде. Ас-Суфи вёл наблюдения в Исфахане и Ширазе, работая вместе с придворными учёными.',
      'He worked at the court of Adud al-Dawla, ruler of the Buyid dynasty, and is believed to have been his teacher in astronomy. The Buyids patronised science in Shiraz, Isfahan and Baghdad. Al-Sufi made observations in Isfahan and Shiraz, working together with the court scholars.'),
    t('Taxminan 964-yilda u o‘zining eng mashhur asari — «Qo‘zg‘almas yulduzlar surati kitobi»ni yakunlab, Azud ad-Davlaga bag‘ishlagan. Kitobda Ptolemeyning 48 yulduz turkumi tasvirlangan: har biri uchun yulduzlar ro‘yxati, ularning uzunlik va kenglik koordinatalari hamda yorqinliklari keltirilgan. As-Sufiy yulduzlar uzunligiga presessiya tuzatmasini qo‘shib, ularni o‘z davriga moslashtirgan va Ptolemey katalogidagi ko‘plab yorqinlik qiymatlarini tuzatgan.',
      'Около 964 года он завершил свой самый известный труд — «Книгу изображений неподвижных звёзд» — и посвятил её Адуд ад-Дауле. В книге описаны 48 созвездий Птолемея: для каждого приведены список звёзд, их долготы и широты и блеск. Ас-Суфи добавил к долготам звёзд поправку на прецессию, приведя их к своей эпохе, и исправил многие значения блеска в каталоге Птолемея.',
      'Around 964 he completed his most famous work, the «Book of the Images of the Fixed Stars», and dedicated it to Adud al-Dawla. The book describes Ptolemy’s 48 constellations: for each it gives a list of stars, their longitudes and latitudes and their brightness. Al-Sufi added a precession correction to the stellar longitudes, bringing them to his own epoch, and corrected many brightness values in Ptolemy’s catalogue.'),
    t('Kitobning eng qimmatli tomonlaridan biri — arab xalq astronomiyasidagi yulduz nomlarining tizimli bayoni. As-Sufiy Andromeda yulduz turkumida «kichik bulut»ni tasvirlagan — bu Andromeda galaktikasining ma’lum bo‘lgan eng qadimgi yozma qaydi. U, shuningdek, janubiy osmondagi «al-Baqar» («Oq ho‘kiz») deb atalgan dog‘ni eslatgan; bu Katta Magellan buluti deb hisoblanadi. Bundan tashqari, Yelkanlar turkumidagi bir yulduz to‘dasini ham qayd etgan.',
      'Одна из самых ценных сторон книги — систематическое изложение названий звёзд из арабской народной астрономии. Ас-Суфи описал «маленькое облако» в созвездии Андромеды — это древнейшая известная письменная запись о галактике Андромеды. Он упомянул также пятно на южном небе под названием «аль-Бакар» («Белый бык»), которое считается Большим Магеллановым Облаком. Кроме того, он отметил звёздное скопление в созвездии Парусов.',
      'One of the most valuable aspects of the book is its systematic account of star names from Arabic folk astronomy. Al-Sufi described a «little cloud» in the constellation Andromeda; this is the oldest known written record of the Andromeda Galaxy. He also mentioned a patch in the southern sky called «al-Baqar» («the White Ox»), which is believed to be the Large Magellanic Cloud. In addition, he noted a star cluster in the constellation Vela.'),
    t('As-Sufiy astrolyabiya bo‘yicha ham keng qamrovli risola yozib, uning ko‘plab amaliy qo‘llanishlarini — vaqtni, yulduzlar balandligini, qibla yo‘nalishini aniqlash va boshqalarni bayon qilgan. U 986-yil 25-mayda Sherozda vafot etgan. Uning kitobi asrlar davomida ko‘chirilib, ko‘plab nafis suratli qo‘lyozmalari yaratilgan; Ulug‘bek ham o‘z yulduz katalogini tuzishda as-Sufiy ishlaridan foydalangan.',
      'Ас-Суфи написал также обширный трактат об астролябии, описав множество её практических применений — определение времени, высоты звёзд, направления киблы и другие. Он умер 25 мая 986 года в Ширазе. Его книга веками переписывалась, было создано множество прекрасно иллюстрированных рукописей; Улугбек при составлении своего звёздного каталога также опирался на труды ас-Суфи.',
      'Al-Sufi also wrote an extensive treatise on the astrolabe, describing many of its practical uses: finding the time, the altitude of stars, the direction of the qibla and more. He died on 25 May 986 in Shiraz. His book was copied for centuries, and many beautifully illustrated manuscripts were produced; Ulugh Beg also drew on al-Sufi’s work when compiling his own star catalogue.')
  ],
  works:[
    [964, t('«Kitob suvar al-kavokib as-sobita» («Qo‘zg‘almas yulduzlar surati kitobi»)','«Китаб сувар аль-кавакиб ас-сабита» («Книга изображений неподвижных звёзд»)','«Kitab suwar al-kawakib al-thabita» («Book of the Images of the Fixed Stars»)'),
      t('48 yulduz turkumining tavsifi, har biri uchun ikki xil surat, yulduzlar koordinatalari va yorqinliklari jadvallari hamda arabcha yulduz nomlari. Islom olamining eng mashhur yulduz atlası.',
        'Описание 48 созвездий с двумя изображениями каждого, таблицами координат и блеска звёзд и арабскими названиями звёзд. Самый знаменитый звёздный атлас исламского мира.',
        'A description of the 48 constellations with two images of each, tables of stellar coordinates and brightness, and Arabic star names. The most famous star atlas of the Islamic world.')],
    [970, t('Astrolyabiyadan foydalanish haqidagi risola','Трактат об использовании астролябии','Treatise on the use of the astrolabe'),
      t('Astrolyabiyaning astronomiya, vaqt hisobi va geografiyadagi ko‘plab amaliy qo‘llanishlari bayon qilingan katta asar. Sana taxminiy.',
        'Большой труд, описывающий многочисленные практические применения астролябии в астрономии, счёте времени и географии. Дата приблизительна.',
        'A large work describing the many practical uses of the astrolabe in astronomy, timekeeping and geography. Date approximate.')]
  ],
  disc:[
    ['🌌', t('Andromeda galaktikasining birinchi qaydi','Первое упоминание галактики Андромеды','First record of the Andromeda Galaxy'),
      t('Andromeda yulduz turkumidagi «kichik bulut»ni tasvirlagan. Bu Somon yo‘lidan tashqaridagi galaktikaning ma’lum bo‘lgan eng qadimgi yozma qaydi; uning galaktika ekani faqat XX asrda isbotlangan.',
        'Описал «маленькое облако» в созвездии Андромеды. Это древнейшее известное письменное упоминание галактики за пределами Млечного Пути; то, что это галактика, доказали лишь в XX веке.',
        'He described a «little cloud» in the constellation Andromeda. It is the oldest known written record of a galaxy beyond the Milky Way; that it is a galaxy was proved only in the 20th century.')],
    ['☁️', t('Katta Magellan buluti','Большое Магелланово Облако','Large Magellanic Cloud'),
      t('Janubiy Arabistondan ko‘rinadigan, Bag‘dod va Shimoliy Arabistondan ko‘rinmaydigan «al-Baqar» («Oq ho‘kiz») dog‘ini eslatgan — bu Katta Magellan buluti deb hisoblanadi.',
        'Упомянул пятно «аль-Бакар» («Белый бык»), видимое из Южной Аравии, но не видимое из Багдада и Северной Аравии; считается, что это Большое Магелланово Облако.',
        'He mentioned the patch «al-Baqar» («the White Ox»), visible from southern Arabia but not from Baghdad or northern Arabia; it is believed to be the Large Magellanic Cloud.')],
    ['✨', t('Yulduz yorqinliklarini qayta o‘lchash','Пересмотр блеска звёзд','Re-evaluating stellar brightness'),
      t('Ptolemey katalogidagi yulduzlar kattaliklarini o‘z kuzatuvlari bilan tekshirib, ko‘plarini tuzatgan va oraliq qiymatlarni ham ko‘rsatgan. Bu o‘rta asrlardagi yulduz fotometriyasining eng muhim ishi bo‘lgan.',
        'Проверил собственными наблюдениями величины звёзд каталога Птолемея, исправил многие из них и указал промежуточные значения. Это была важнейшая работа средневековой звёздной фотометрии.',
        'He checked the magnitudes of stars in Ptolemy’s catalogue against his own observations, corrected many of them and indicated intermediate values. This was the most important work of medieval stellar photometry.')],
    ['🔤', t('Yulduzlarning arabcha nomlari','Арабские названия звёзд','Arabic names of the stars'),
      t('Arab xalq astronomiyasidagi yulduz nomlarini Ptolemey turkumlari bilan bog‘lab, tizimga solgan. Aldebaran, Altair, Deneb kabi bugungi ko‘p nomlar shu an’anadan kelib chiqqan.',
        'Систематизировал названия звёзд арабской народной астрономии, связав их с созвездиями Птолемея. Из этой традиции происходят многие современные названия — Альдебаран, Альтаир, Денеб и другие.',
        'He systematised the star names of Arabic folk astronomy, linking them to Ptolemy’s constellations. Many of today’s names, such as Aldebaran, Altair and Deneb, come from this tradition.')]
  ],
  instr:[
    [t('Astrolyabiya','Астролябия','Astrolabe'),
      t('Astrolyabiyaning ko‘plab amaliy qo‘llanishlarini tavsiflagan katta risola yozgan: vaqtni aniqlash, yulduz balandligi, joy kengligi va boshqalar.',
        'Написал большой трактат, описывающий множество практических применений астролябии: определение времени, высоты звёзд, широты места и др.',
        'He wrote a large treatise describing a great many practical uses of the astrolabe: finding the time, stellar altitudes, the latitude of a place and more.'),
      'ins:astrolabe'],
    [t('Osmon globusi','Небесный глобус','Celestial globe'),
      t('Kitobidagi har bir yulduz turkumi globusdagi ko‘rinishida ham chizilgan; bu suratlar keyinchalik metall osmon globuslarini yasashda namuna bo‘lgan.',
        'Каждое созвездие в его книге нарисовано и в том виде, как оно выглядит на глобусе; эти рисунки позже служили образцом для металлических небесных глобусов.',
        'Every constellation in his book is also drawn as it appears on a globe; these drawings later served as models for metal celestial globes.'),
      'ins:globe']
  ],
  formulas:[],
  tl:[
    [903, t('Rayda tug‘ildi (7-dekabr)','Родился в Рее (7 декабря)','Born in Rey (7 December)')],
    [949, t('Azud ad-Davla Farsda hukmronlik boshladi; as-Sufiy uning saroyida ishladi','Адуд ад-Даула начал правление в Фарсе; ас-Суфи работал при его дворе','Adud al-Dawla begins his rule in Fars; al-Sufi works at his court')],
    [964, t('«Qo‘zg‘almas yulduzlar surati kitobi» yakunlandi (taxminan)','Завершена «Книга изображений неподвижных звёзд» (около)','«Book of the Images of the Fixed Stars» completed (approx.)')],
    [986, t('Sherozda vafot etdi (25-may)','Умер в Ширазе (25 мая)','Died in Shiraz (25 May)')],
    [1009, t('Kitobning ma’lum bo‘lgan eng qadimgi qo‘lyozmalaridan biri ko‘chirildi (Oksforddagi Bodli kutubxonasida saqlanadi)','Переписана одна из древнейших известных рукописей книги (хранится в Бодлианской библиотеке Оксфорда)','One of the oldest known manuscripts of the book is copied (kept in the Bodleian Library, Oxford)')],
    [1437, t('Ulug‘bek yulduz katalogi yakunlandi — unda as-Sufiy merosidan foydalanilgan','Завершён звёздный каталог Улугбека, использовавший наследие ас-Суфи','Ulugh Beg’s star catalogue is completed, drawing on al-Sufi’s legacy')],
    [1925, t('Xabbl Andromeda «tumanligi» alohida galaktika ekanini ko‘rsatgan natijalarini e’lon qildi','Хаббл опубликовал результаты, показавшие, что «туманность» Андромеды — отдельная галактика','Hubble publishes results showing that the Andromeda «nebula» is a separate galaxy')]
  ],
  facts:[
    t('As-Sufiy tasvirlagan «kichik bulut» — Andromeda galaktikasi — oddiy ko‘z bilan ko‘rinadigan eng uzoq ob’ektlardan biri: u bizdan taxminan 2,5 million yorug‘lik yili uzoqda.','«Маленькое облако» ас-Суфи — галактика Андромеды — один из самых далёких объектов, видимых невооружённым глазом: до неё около 2,5 млн световых лет.','Al-Sufi’s «little cloud», the Andromeda Galaxy, is one of the most distant objects visible to the naked eye, about 2.5 million light-years away.'),
    t('Uning kitobidagi har bir turkum ikki marta chizilgan: osmonda ko‘rinishicha va globus sirtidan qaraganda ko‘zgu aksidagidek.','Каждое созвездие в его книге нарисовано дважды: как на небе и зеркально — как на поверхности глобуса.','Every constellation in his book is drawn twice: as in the sky, and mirror-reversed as on the surface of a globe.'),
    t('Uning asari bilan bog‘liq ma’lum bo‘lgan eng qadimgi qo‘lyozmalardan biri 1009-yilga oid bo‘lib, Oksfordda saqlanadi.','Одна из древнейших известных рукописей его труда датируется 1009 годом и хранится в Оксфорде.','One of the oldest known manuscripts of his work dates from 1009 and is kept in Oxford.'),
    t('Bugungi ko‘plab yorqin yulduzlarning nomlari arabcha bo‘lib, ularning tarqalishida as-Sufiy kitobi muhim rol o‘ynagan.','Названия многих ярких звёзд сегодня арабские, и в их распространении важную роль сыграла книга ас-Суфи.','The names of many bright stars today are Arabic, and al-Sufi’s book played an important role in spreading them.')
  ],
  legacy:t(
    'Oydagi Azophi krateri va 12621 Alsufi asteroidi uning nomi bilan atalgan. Uning yulduz atlasi o‘rta asrlarda Islom olami va Yevropada eng ko‘p ko‘chirilgan astronomik kitoblardan biri bo‘lgan. As-Sufiy galaktikadan tashqari olamning birinchi «guvohi» sifatida astronomiya tarixida alohida o‘rin tutadi.',
    'Кратер Азофи на Луне и астероид 12621 Альсуфи названы в его честь. Его звёздный атлас был одной из самых переписываемых астрономических книг Средневековья в исламском мире и Европе. Ас-Суфи занимает особое место в истории астрономии как первый «свидетель» внегалактического мира.',
    'The lunar crater Azophi and the asteroid 12621 Alsufi are named after him. His star atlas was one of the most frequently copied astronomical books of the Middle Ages in the Islamic world and Europe. Al-Sufi holds a special place in the history of astronomy as the first «witness» of the extragalactic universe.')
});

/* ───────────── Abu Rayhon Beruniy ───────────── */
S.push({
  id:'albiruni',
  born:973, died:1048,
  region:'central_asia',
  fields:['planets','calendar','math'],
  name:t('Abu Rayhon Beruniy','Абу Райхан Бируни','Abu Rayhan al-Biruni'),
  life:t('973 – ~1048','973 – ~1048','973 – c. 1048'),
  place:t('Kot, Xorazm (hozirgi Beruniy shahri, Qoraqalpog‘iston), O‘zbekiston','Кят, Хорезм (ныне город Беруни, Каракалпакстан), Узбекистан','Kath, Khwarazm (modern Beruni, Karakalpakstan), Uzbekistan'),
  role:t('Xorazmlik qomusiy olim: astronom, matematik, geograf, geodezist, tarixchi','Хорезмийский учёный-энциклопедист: астроном, математик, географ, геодезист, историк','Khwarazmian polymath: astronomer, mathematician, geographer, geodesist, historian'),
  short:t(
    'Tog‘ cho‘qqisidan ufq pasayishini o‘lchab Yer radiusini hayratlanarli aniqlikda topgan, «Qonuni Mas’udiy» astronomik qomusini yaratgan buyuk xorazmlik qomusiy olim.',
    'Великий хорезмийский энциклопедист, измеривший радиус Земли с поразительной точностью по понижению горизонта с вершины горы и создавший астрономическую энциклопедию «Канон Масуда».',
    'The great Khwarazmian polymath who measured the Earth’s radius with remarkable accuracy from the dip of the horizon seen from a mountain, and created the astronomical encyclopaedia «al-Qanun al-Mas’udi».'),
  about:t(
    'Abu Rayhon Muhammad ibn Ahmad Beruniy — o‘rta asrlarning eng buyuk olimlaridan biri. U astronomiya, matematika, geodeziya, geografiya, mineralogiya, farmakologiya, tarix va xalqlar madaniyatini o‘rganish bo‘yicha 150 ga yaqin asar yozgan. Uning «Qonuni Mas’udiy» asari o‘z davri astronomiyasining eng to‘liq qomusi bo‘lsa, «Hindiston» kitobi boshqa xalq madaniyatini xolis o‘rganishning namunasi hisoblanadi. Beruniy ilmiy bilimni kuzatuv, o‘lchash va tajriba bilan tekshirishni talab qilgan va shu jihatdan zamonaviy ilmiy uslubning o‘tmishdoshlaridan biridir.',
    'Абу Райхан Мухаммад ибн Ахмад Бируни — один из величайших учёных Средневековья. Он написал около 150 трудов по астрономии, математике, геодезии, географии, минералогии, фармакологии, истории и изучению культуры народов. Его «Канон Масуда» — самая полная астрономическая энциклопедия своего времени, а книга «Индия» — образец беспристрастного изучения культуры другого народа. Бируни требовал проверять научное знание наблюдением, измерением и опытом и в этом смысле является одним из предшественников современного научного метода.',
    'Abu Rayhan Muhammad ibn Ahmad al-Biruni was one of the greatest scholars of the Middle Ages. He wrote about 150 works on astronomy, mathematics, geodesy, geography, mineralogy, pharmacology, history and the study of the cultures of peoples. His «al-Qanun al-Mas’udi» was the most complete astronomical encyclopaedia of its time, and his book «India» is a model of the impartial study of another people’s culture. Al-Biruni insisted that scientific knowledge be tested by observation, measurement and experiment, and in this respect he is one of the forerunners of the modern scientific method.'),
  bio:[
    t('Beruniy 973-yil sentyabr oyida Xorazmning qadimiy poytaxti Kot shahri yaqinida tug‘ilgan. «Beruniy» nisbasi «shahar tashqarisidan», ya’ni «chekkalik» degan ma’noni anglatadi deb izohlanadi. Yoshligidan u Xorazm shohlari xonadoniga mansub buyuk matematik va astronom Abu Nasr Mansur ibn Iroq qo‘lida tahsil olgan. Ibn Iroq sferik trigonometriyadagi sinuslar teoremasi bilan bog‘liq ishlari bilan mashhur bo‘lib, shogirdiga katta ta’sir ko‘rsatgan.',
      'Бируни родился в сентябре 973 года близ Кята — древней столицы Хорезма. Нисбу «Бируни» объясняют как «из предместья», то есть «живущий за городом». С юности он учился у великого математика и астронома Абу Насра Мансура ибн Ирака, принадлежавшего к роду хорезмшахов. Ибн Ирак, известный работами, связанными с теоремой синусов в сферической тригонометрии, оказал на ученика большое влияние.',
      'Al-Biruni was born in September 973 near Kath, the ancient capital of Khwarazm. The nisba «Biruni» is explained as meaning «from the outskirts», i.e. «living outside the town». From his youth he studied with the great mathematician and astronomer Abu Nasr Mansur ibn Iraq, a member of the Khwarazmshah family. Ibn Iraq, known for work connected with the sine theorem in spherical trigonometry, had a great influence on his pupil.'),
    t('Yoshligidayoq Beruniy amaliy kuzatuvlar bilan shug‘ullangan: Kot shahrining kengligini aniqlash uchun Quyoshning tush paytidagi balandligini o‘lchagan. 995-yilda Xorazmdagi siyosiy notinchliklar — Ma’muniylar Kotni egallashi — tufayli u vatanini tark etishga majbur bo‘lgan. Bir muddat Rayda yashagan, so‘ng Jurjonda (Gurgon) Ziyoriylar hukmdori Qobus ibn Vushmagir saroyida ishlagan. 997-yilda u Kotda, Abul Vafo Buzjoniy esa Bag‘dodda bir Oy tutilishini kuzatib, ikki shahar orasidagi uzunlik farqini aniqlashgan.',
      'Уже в юности Бируни занимался практическими наблюдениями: для определения широты Кята он измерял полуденную высоту Солнца. В 995 году из-за политических смут в Хорезме — захвата Кята Мамунидами — он был вынужден покинуть родину. Некоторое время он жил в Рее, затем работал в Джурджане (Гургане) при дворе зиярида Кабуса ибн Вушмагира. В 997 году он в Кяте, а Абуль-Вафа аль-Бузджани в Багдаде наблюдали одно и то же лунное затмение и определили разность долгот двух городов.',
      'As a young man al-Biruni was already making practical observations: to determine the latitude of Kath he measured the noon altitude of the Sun. In 995, owing to political turmoil in Khwarazm, the seizure of Kath by the Ma’munids, he was forced to leave his homeland. He lived for a time in Rey, then worked in Jurjan (Gurgan) at the court of the Ziyarid ruler Qabus ibn Wushmagir. In 997 he in Kath and Abu’l-Wafa al-Buzjani in Baghdad observed the same lunar eclipse and determined the difference in longitude between the two cities.'),
    t('Taxminan 1000-yilda Jurjonda u «Qadimgi xalqlardan qolgan yodgorliklar» (al-Osor al-boqiya) asarini yozib, Qobusga bag‘ishlagan. Bu kitobda turli xalqlar — forslar, so‘g‘diylar, xorazmliklar, yunonlar, yahudiylar, arablar va boshqalarning taqvimlari, eralari va bayramlari taqqoslab o‘rganilgan. Shu yillarda u Ibn Sino bilan tabiat falsafasi va astronomiya masalalari bo‘yicha mashhur savol-javob yozishmasini olib borgan. Taxminan 1004-yilda u Xorazmga qaytib, Gurganjda Ma’muniy hukmdor Abul Abbos Ma’mun saroyida yetakchi olim bo‘lgan.',
      'Около 1000 года в Джурджане он написал труд «Памятники минувших поколений» (аль-Асар аль-бакийя) и посвятил его Кабусу. В этой книге сравнительно изучены календари, эры и праздники разных народов — персов, согдийцев, хорезмийцев, греков, иудеев, арабов и других. В эти годы он вёл с Ибн Синой знаменитую переписку в форме вопросов и ответов по вопросам натурфилософии и астрономии. Около 1004 года он вернулся в Хорезм и стал ведущим учёным при дворе мамунида Абуль-Аббаса Мамуна в Гургандже.',
      'Around 1000, in Jurjan, he wrote «The Remaining Traces of Past Centuries» (al-Athar al-baqiya) and dedicated it to Qabus. This book makes a comparative study of the calendars, eras and festivals of different peoples: Persians, Sogdians, Khwarazmians, Greeks, Jews, Arabs and others. In these years he conducted his famous question-and-answer correspondence with Ibn Sina on questions of natural philosophy and astronomy. Around 1004 he returned to Khwarazm and became the leading scholar at the court of the Ma’munid ruler Abu’l-Abbas Ma’mun in Gurganj.'),
    t('1017-yilda G‘azna sultoni Mahmud Xorazmni bosib olgach, Beruniy boshqa olimlar bilan birga G‘aznaga olib ketilgan. U Mahmudning Hindistonga yurishlarida qatnashib, sanskrit tilini o‘rgangan va hind olimlari bilan muloqot qilgan. Hindistonning shimolidagi Nandana qal’asi yaqinidagi tog‘dan foydalanib, u ufqning pasayish burchagini o‘lchagan va Yer radiusini hisoblagan. 1025-yilda u «Turar joylar orasidagi masofalarni tuzatish uchun joylarning chegaralarini aniqlash» (Tahdid) nomli geodeziya asarini yakunlagan, taxminan 1030-yilda esa mashhur «Hindiston» kitobini yozgan.',
      'В 1017 году, после захвата Хорезма газневидским султаном Махмудом, Бируни вместе с другими учёными был увезён в Газну. Он участвовал в походах Махмуда в Индию, изучил санскрит и общался с индийскими учёными. Используя гору близ крепости Нандана на севере Индии, он измерил угол понижения горизонта и вычислил радиус Земли. В 1025 году он завершил геодезический труд «Определение границ мест для уточнения расстояний между поселениями» («Тахдид»), а около 1030 года написал знаменитую книгу «Индия».',
      'In 1017, after Sultan Mahmud of Ghazni conquered Khwarazm, al-Biruni and other scholars were taken to Ghazni. He accompanied Mahmud’s campaigns into India, learned Sanskrit and conversed with Indian scholars. Using a mountain near the fort of Nandana in northern India, he measured the angle of dip of the horizon and calculated the radius of the Earth. In 1025 he completed the geodetic work «The Determination of the Coordinates of Places for the Correction of Distances between Cities» («Tahdid»), and around 1030 he wrote his famous book «India».'),
    t('Mahmudning o‘g‘li sulton Mas’ud davrida, taxminan 1030–1031-yillarda, Beruniy astronomiyadagi eng yirik asari — «al-Qonun al-Mas’udiy»ni yozib, uni sultonga bag‘ishlagan. Keyingi yillarda u mineralogiya bo‘yicha «Javohirlar haqida kitob» (qimmatbaho toshlar va metallarning solishtirma og‘irliklari bilan) va farmakologiya bo‘yicha «Saydana» asarlarini yaratgan. 1036-yilda o‘z asarlari ro‘yxatini tuzgan. Beruniy taxminan 1048-yilda G‘aznada vafot etgan; ba’zi ma’lumotlarga ko‘ra, u 1050-yildan keyin ham hayot bo‘lgan.',
      'При сыне Махмуда султане Масуде, около 1030–1031 годов, Бируни написал свой крупнейший астрономический труд — «аль-Канун аль-Масуди» — и посвятил его султану. В последующие годы он создал труд по минералогии «Книга о драгоценных камнях» (с удельными весами драгоценных камней и металлов) и труд по фармакологии «Сайдана». В 1036 году он составил список своих трудов. Бируни умер около 1048 года в Газне; по некоторым сведениям, он был жив и после 1050 года.',
      'Under Mahmud’s son Sultan Mas’ud, around 1030–1031, al-Biruni wrote his greatest astronomical work, «al-Qanun al-Mas’udi», and dedicated it to the sultan. In the following years he produced a work on mineralogy, the «Book on Precious Stones» (with the specific gravities of gems and metals), and a work on pharmacology, the «Saydana». In 1036 he compiled a list of his own works. Al-Biruni died around 1048 in Ghazni; according to some reports, he was still alive after 1050.')
  ],
  works:[
    [1000, t('«Qadimgi xalqlardan qolgan yodgorliklar» (al-Osor al-boqiya)','«Памятники минувших поколений» (аль-Асар аль-бакийя)','«The Remaining Traces of Past Centuries» (al-Athar al-baqiya)'),
      t('Turli xalqlar taqvimlari, eralari, bayramlari va astronomik asoslarining qiyosiy tadqiqi; Xorazm va So‘g‘d taqvimlari haqidagi noyob ma’lumotlarni saqlagan. Sana taxminiy.',
        'Сравнительное исследование календарей, эр, праздников и их астрономических основ у разных народов; сохранило уникальные сведения о хорезмийском и согдийском календарях. Дата приблизительна.',
        'A comparative study of the calendars, eras, festivals and their astronomical foundations among different peoples; it preserves unique information about the Khwarazmian and Sogdian calendars. Date approximate.')],
    [1025, t('«Tahdid nihoyot al-amokin» (Geodeziya)','«Тахдид нихайат аль-амакин» («Геодезия»)','«Tahdid nihayat al-amakin» («Geodesy»)'),
      t('Joylarning kenglik va uzunligini aniqlash, shaharlar orasidagi masofalar va qibla yo‘nalishini hisoblash usullari; matematik geografiyaning muhim asari.',
        'Методы определения широты и долготы мест, расчёта расстояний между городами и направления киблы; важный труд математической географии.',
        'Methods for determining the latitude and longitude of places and calculating distances between cities and the direction of the qibla; an important work of mathematical geography.')],
    [1029, t('«at-Tafhim li-avoil sinoat at-tanjim»','«Ат-Тафхим ли-аваиль синаат ат-танджим»','«al-Tafhim li-awa’il sina’at al-tanjim»'),
      t('Geometriya, arifmetika, astronomiya va xronologiya asoslari bo‘yicha savol-javob shaklidagi darslik; arab va fors tillarida yozilgan.',
        'Учебник в форме вопросов и ответов по основам геометрии, арифметики, астрономии и хронологии; написан на арабском и персидском языках.',
        'A textbook in question-and-answer form on the elements of geometry, arithmetic, astronomy and chronology; written in Arabic and Persian.')],
    [1030, t('«Hindiston» (Tahqiq mo li-l-Hind)','«Индия» («Тахкик ма ли-ль-Хинд»)','«India» («Tahqiq ma li-l-Hind»)'),
      t('Hindiston dini, falsafasi, fani, astronomiyasi, taqvimi va urf-odatlarining xolis va chuqur tavsifi; ilmiy sharqshunoslikning asosiy asarlaridan biri.',
        'Беспристрастное и глубокое описание религии, философии, науки, астрономии, календаря и обычаев Индии; один из основополагающих трудов научного востоковедения.',
        'An impartial and thorough description of India’s religion, philosophy, science, astronomy, calendar and customs; one of the foundational works of scholarly oriental studies.')],
    [1031, t('«al-Qonun al-Mas’udiy» («Mas’ud qonuni»)','«аль-Канун аль-Масуди» («Канон Масуда»)','«al-Qanun al-Mas’udi» («The Mas’udic Canon»)'),
      t('11 kitobdan iborat astronomiya qomusi: trigonometriya, xronologiya, Quyosh, Oy, sayyoralar, yulduzlar, geografik koordinatalar jadvallari. Sana taxminiy (1030–1031).',
        'Астрономическая энциклопедия из 11 книг: тригонометрия, хронология, Солнце, Луна, планеты, звёзды, таблицы географических координат. Дата приблизительна (1030–1031).',
        'An encyclopaedia of astronomy in 11 books: trigonometry, chronology, the Sun, Moon, planets, stars and tables of geographic coordinates. Date approximate (1030–1031).')],
    [1041, t('«Javohirlar haqida kitob» (Mineralogiya)','«Книга о драгоценных камнях» («Минералогия»)','«Book on Precious Stones» («Mineralogy»)'),
      t('Qimmatbaho toshlar va metallarning xossalari, ularning solishtirma og‘irligini aniq o‘lchash natijalari bilan. Sana taxminiy.',
        'Свойства драгоценных камней и металлов с результатами точного измерения их удельного веса. Дата приблизительна.',
        'Properties of precious stones and metals, with the results of precise measurements of their specific gravity. Date approximate.')]
  ],
  disc:[
    ['🌍', t('Yer radiusini o‘lchashning yangi usuli','Новый метод измерения радиуса Земли','A new method of measuring the Earth’s radius'),
      t('Balandligi ma’lum tog‘ cho‘qqisidan ufqning pasayish burchagini o‘lchab, Yer radiusini birgina joyda turib hisoblagan. Uning natijasi taxminan 6340 km bo‘lib, bugungi o‘rtacha qiymatdan (6371 km) 1% dan kamroq farq qiladi.',
        'Измерив угол понижения горизонта с вершины горы известной высоты, вычислил радиус Земли, находясь в одном месте. Его результат — около 6340 км — отличается от современного среднего значения (6371 км) менее чем на 1%.',
        'By measuring the angle of dip of the horizon from the top of a mountain of known height, he calculated the Earth’s radius while standing in one place. His result of about 6,340 km differs from the modern mean value (6,371 km) by less than 1%.')],
    ['🌗', t('Tutilish orqali uzunliklarni aniqlash','Определение долгот по затмению','Determining longitude by eclipse'),
      t('997-yilda Kot va Bag‘dodda bir Oy tutilishini bir vaqtda kuzatish orqali ikki shahar orasidagi uzunlik farqini topgan. U ko‘plab shaharlarning koordinatalarini aniqlagan va jadvallarga kiritgan.',
        'В 997 году по одновременному наблюдению одного лунного затмения в Кяте и Багдаде нашёл разность долгот двух городов. Он определил координаты многих городов и включил их в таблицы.',
        'In 997, by simultaneous observation of a lunar eclipse in Kath and Baghdad, he found the difference in longitude between the two cities. He determined the coordinates of many cities and entered them in tables.')],
    ['🔄', t('Yer aylanishi masalasi','Вопрос о вращении Земли','The question of the Earth’s rotation'),
      t('Yerning o‘z o‘qi atrofida aylanishi astronomik hisoblarga zid emasligini ta’kidlagan va bu masalani matematik emas, tabiat falsafasi hal qilishi kerakligini yozgan. U bu masalani ochiq muhokama qilgan kam sonli o‘rta asr olimlaridan biri.',
        'Подчёркивал, что вращение Земли вокруг оси не противоречит астрономическим расчётам, и писал, что этот вопрос должна решать натурфилософия, а не математика. Он был одним из немногих средневековых учёных, открыто обсуждавших этот вопрос.',
        'He stressed that the rotation of the Earth on its axis does not contradict astronomical calculations, and wrote that the question must be settled by natural philosophy rather than mathematics. He was one of the few medieval scholars to discuss the question openly.')],
    ['📐', t('Trigonometriya va hisoblash usullari','Тригонометрия и вычислительные методы','Trigonometry and computational methods'),
      t('«Qonuni Mas’udiy»da sinus va tangens jadvallarini aniqlashtirgan, sferik trigonometriyani tizimli bayon qilgan va jadvallar orasidagi qiymatlarni interpolyatsiya qilish usullarini qo‘llagan.',
        'В «Каноне Масуда» уточнил таблицы синусов и тангенсов, систематически изложил сферическую тригонометрию и применял методы интерполяции между табличными значениями.',
        'In «al-Qanun al-Mas’udi» he refined tables of sines and tangents, systematically set out spherical trigonometry and applied methods of interpolation between tabulated values.')],
    ['⚖️', t('Solishtirma og‘irlikni aniq o‘lchash','Точное измерение удельного веса','Precise measurement of specific gravity'),
      t('Maxsus idish yordamida siqib chiqarilgan suv hajmini o‘lchab, ko‘plab metall va qimmatbaho toshlarning solishtirma og‘irligini o‘z davri uchun juda yuqori aniqlikda aniqlagan.',
        'Измеряя объём вытесненной воды с помощью особого сосуда, определил удельный вес многих металлов и драгоценных камней с очень высокой для своего времени точностью.',
        'By measuring the volume of displaced water with a special vessel, he determined the specific gravity of many metals and precious stones with very high accuracy for his time.')],
    ['📅', t('Qiyosiy xronologiya','Сравнительная хронология','Comparative chronology'),
      t('Turli xalqlarning taqvim tizimlarini astronomik asosda taqqoslab, ular orasidagi sanalarni o‘girish usullarini bergan. Xorazm va So‘g‘d taqvimlari haqidagi ma’lumotlar aynan uning asarlari orqali saqlangan.',
        'Сравнив календарные системы разных народов на астрономической основе, дал способы перевода дат между ними. Сведения о хорезмийском и согдийском календарях сохранились именно благодаря его трудам.',
        'By comparing the calendar systems of different peoples on an astronomical basis, he gave methods for converting dates between them. Information about the Khwarazmian and Sogdian calendars has survived precisely through his works.')]
  ],
  instr:[
    [t('Astrolyabiya','Астролябия','Astrolabe'),
      t('Astrolyabiya yasashning turli usullari haqida maxsus risola yozgan va undan Quyosh hamda yulduzlar balandligini, joy kengligini aniqlashda foydalangan; Nandanadagi o‘lchovda ham ufq pasayish burchagini burchak o‘lchovchi asbob bilan o‘lchagan.',
        'Написал особый трактат о различных способах построения астролябии и пользовался ею для определения высоты Солнца и звёзд, широты места; при измерении в Нандане угол понижения горизонта также измерялся угломерным инструментом.',
        'He wrote a special treatise on the various methods of constructing astrolabes and used them to find the altitude of the Sun and stars and the latitude of a place; in the Nandana measurement the dip angle of the horizon was likewise measured with an angle-measuring instrument.'),
      'ins:astrolabe'],
    [t('Kvadrant va katta halqa','Квадрант и большое кольцо','Quadrant and large ring'),
      t('Yoshligida Kotda Quyoshning tush paytidagi balandligini o‘lchash uchun meridian tekisligiga o‘rnatilgan darajalangan katta yarim halqa asbobdan foydalangan; keyinchalik G‘aznada ham shunday o‘lchovlar o‘tkazgan.',
        'В юности в Кяте для измерения полуденной высоты Солнца пользовался большим градуированным полукольцом, установленным в плоскости меридиана; позднее проводил подобные измерения и в Газне.',
        'As a young man in Kath he used a large graduated half-ring set in the meridian plane to measure the noon altitude of the Sun; later he made similar measurements in Ghazni too.'),
      'ins:quadrant'],
    [t('Yer globusi','Земной глобус','Terrestrial globe'),
      t('Ma’lumotlarga ko‘ra, Beruniy joylarning koordinatalarini ko‘rsatish uchun katta Yer globusini yasagan; u globus va xaritalar uchun proyeksiya usullarini ham ishlab chiqqan.',
        'По сведениям, Бируни изготовил большой земной глобус для отображения координат мест; он разработал также способы проекции для глобусов и карт.',
        'According to reports, al-Biruni made a large terrestrial globe to show the coordinates of places; he also developed projection methods for globes and maps.'),
      'ins:globe']
  ],
  formulas:[
    { f:'R = h · cos α / (1 − cos α)', name:t('Beruniyning Yer radiusi formulasi','Формула радиуса Земли Бируни','Al-Biruni’s Earth-radius formula'),
      expl:t('Balandligi h bo‘lgan cho‘qqidan ufqqa qaragan nur Yer sirtiga urinma bo‘ladi; urinma, radius va markazdan cho‘qqigacha bo‘lgan masofa to‘g‘ri burchakli uchburchak hosil qiladi. Shunda cos α = R / (R + h), bundan R kelib chiqadi. Beruniy ufqning pasayish burchagini α ≈ 34′ deb o‘lchagan.',
        'Луч от вершины высотой h к горизонту касается поверхности Земли; касательная, радиус и расстояние от центра до вершины образуют прямоугольный треугольник. Тогда cos α = R / (R + h), откуда следует R. Бируни измерил угол понижения горизонта как α ≈ 34′.',
        'The line of sight from a peak of height h to the horizon is tangent to the Earth’s surface; the tangent, the radius and the distance from the centre to the peak form a right triangle. Then cos α = R / (R + h), from which R follows. Al-Biruni measured the dip angle of the horizon as α ≈ 34′.'),
      vars:[ ['R', t('Yer radiusi','радиус Земли','Earth’s radius')], ['h', t('tog‘ balandligi','высота горы','height of the mountain')], ['α', t('ufqning pasayish burchagi','угол понижения горизонта','dip angle of the horizon')] ] },
    { f:'cos α = R / (R + h)', name:t('Ufq pasayishi geometriyasi','Геометрия понижения горизонта','Geometry of horizon dip'),
      expl:t('Asosiy formulaning kelib chiqishi: Yer markazi, kuzatuvchi va urinish nuqtasi to‘g‘ri burchakli uchburchakning uchlari. Ufqning pasayish burchagi markazdagi burchakka teng.',
        'Вывод основной формулы: центр Земли, наблюдатель и точка касания — вершины прямоугольного треугольника. Угол понижения горизонта равен углу при центре.',
        'Derivation of the main formula: the Earth’s centre, the observer and the tangent point are the vertices of a right triangle. The dip angle of the horizon equals the angle at the centre.'),
      vars:[ ['R + h', t('Yer markazidan kuzatuvchigacha masofa','расстояние от центра Земли до наблюдателя','distance from Earth’s centre to the observer')] ] }
  ],
  tl:[
    [973, t('Kot shahri yaqinida tug‘ildi (sentyabr)','Родился близ Кята (сентябрь)','Born near Kath (September)')],
    [990, t('Kotda Quyosh balandligini o‘lchab, shahar kengligini aniqladi (taxminan)','Измерив высоту Солнца в Кяте, определил широту города (около)','Measured the Sun’s altitude in Kath to determine the city’s latitude (approx.)')],
    [995, t('Xorazmdagi notinchlik tufayli vatanini tark etdi','Из-за смуты в Хорезме покинул родину','Left his homeland because of turmoil in Khwarazm')],
    [997, t('Abul Vafo bilan bir vaqtda Oy tutilishini kuzatib, uzunliklar farqini aniqladi','Одновременно с Абуль-Вафой наблюдал лунное затмение и определил разность долгот','Observed a lunar eclipse simultaneously with Abu’l-Wafa to determine the difference in longitude')],
    [1000, t('Jurjonda «Qadimgi xalqlardan qolgan yodgorliklar»ni yozdi (taxminan)','В Джурджане написал «Памятники минувших поколений» (около)','Wrote «The Remaining Traces of Past Centuries» in Jurjan (approx.)')],
    [1004, t('Xorazmga qaytib, Gurganjda Ma’muniylar saroyida ishladi (taxminan)','Вернулся в Хорезм и работал при дворе Мамунидов в Гургандже (около)','Returned to Khwarazm and worked at the Ma’munid court in Gurganj (approx.)')],
    [1017, t('Mahmud G‘aznaviy Xorazmni egalladi; Beruniy G‘aznaga olib ketildi','Махмуд Газневи захватил Хорезм; Бируни увезён в Газну','Mahmud of Ghazni conquers Khwarazm; al-Biruni is taken to Ghazni')],
    [1025, t('«Tahdid» geodeziya asarini yakunladi','Завершил геодезический труд «Тахдид»','Completed the geodetic work «Tahdid»')],
    [1030, t('«Hindiston» kitobini yozdi; «Qonuni Mas’udiy» ustida ishladi','Написал «Индию»; работал над «Каноном Масуда»','Wrote «India»; worked on «al-Qanun al-Mas’udi»')],
    [1048, t('G‘aznada vafot etdi (taxminan)','Умер в Газне (приблизительно)','Died in Ghazni (approx.)')]
  ],
  table:{
    title:t('Beruniyning Yer radiusi o‘lchovi','Измерение радиуса Земли Бируни','Al-Biruni’s measurement of the Earth’s radius'),
    cols:[t('Kattalik','Величина','Quantity'), t('Beruniy','Бируни','al-Biruni'), t('Bugungi qiymat','Современное значение','Modern value')],
    rows:[
      [t('Ufq pasayish burchagi','Угол понижения горизонта','Dip angle of the horizon'), '≈ 34′', '—'],
      [t('Yer radiusi','Радиус Земли','Earth’s radius'), '≈ 6340 km', '6371 km'],
      [t('Nisbiy xato','Относительная ошибка','Relative error'), '< 1%', '—']
    ],
    note:t('Kilometrdagi qiymat Beruniy ishlatgan uzunlik birligini (arab tirsagi, mili) zamonaviy birlikka o‘girishga bog‘liq, shuning uchun taxminiy.','Значение в километрах зависит от перевода использованных Бируни единиц длины (арабский локоть, миля) в современные и поэтому приблизительно.','The value in kilometres depends on converting the length units al-Biruni used (Arabic cubit, mile) into modern ones, and is therefore approximate.')
  },
  facts:[
    t('Beruniy 1036-yilda o‘z asarlari ro‘yxatini tuzgan; umumiy hisobda u 150 ga yaqin asar yozgan deb hisoblanadi.','В 1036 году Бируни составил список своих трудов; считается, что всего он написал около 150 сочинений.','In 1036 al-Biruni compiled a list of his works; in total he is believed to have written about 150.'),
    t('Uning Ibn Sino bilan yozishmasi o‘rta asrlarning eng mashhur ilmiy bahslaridan biri hisoblanadi.','Его переписка с Ибн Синой считается одной из самых известных научных дискуссий Средневековья.','His correspondence with Ibn Sina is regarded as one of the most famous scientific debates of the Middle Ages.'),
    t('Beruniy Yer radiusini bir joyda turib, birgina tog‘ yordamida o‘lchagan — Eratosfen usulidagidek ikki shahar orasidagi masofani o‘lchash shart bo‘lmagan.','Бируни измерил радиус Земли, находясь в одном месте и используя лишь одну гору, — без измерения расстояния между двумя городами, как в методе Эратосфена.','Al-Biruni measured the Earth’s radius from a single place using just one mountain, with no need to measure the distance between two cities as in Eratosthenes’ method.'),
    t('1973-yilda Beruniy tavalludining 1000 yilligi YUNESKO ishtirokida xalqaro miqyosda nishonlangan.','В 1973 году при участии ЮНЕСКО международно отмечено 1000-летие со дня рождения Бируни.','In 1973 the 1000th anniversary of al-Biruni’s birth was celebrated internationally with UNESCO’s participation.')
  ],
  legacy:t(
    'Oydagi Al-Biruni krateri va 9936 Al-Biruni asteroidi uning nomi bilan atalgan. O‘zbekistonda Qoraqalpog‘istondagi Beruniy shahri, Toshkent davlat texnika universiteti, O‘zbekiston Fanlar akademiyasi Sharqshunoslik instituti va Beruniy nomidagi Davlat mukofoti uning xotirasini abadiylashtiradi. Beruniy o‘z asarlarida dalil va tajribaga tayanish, boshqa xalqlar bilimiga hurmat bilan qarash namunasini ko‘rsatgan va bugun jahon ilm-fanining buyuk siymolaridan biri sifatida e’tirof etiladi.',
    'Кратер Аль-Бируни на Луне и астероид 9936 Аль-Бируни названы в его честь. В Узбекистане его память увековечивают город Беруни в Каракалпакстане, Ташкентский государственный технический университет, Институт востоковедения Академии наук Узбекистана и Государственная премия имени Беруни. Бируни показал в своих трудах пример опоры на доказательства и опыт и уважительного отношения к знаниям других народов и сегодня признан одним из великих деятелей мировой науки.',
    'The lunar crater Al-Biruni and the asteroid 9936 Al-Biruni are named after him. In Uzbekistan his memory is perpetuated by the town of Beruni in Karakalpakstan, the Tashkent State Technical University, the Institute of Oriental Studies of the Uzbek Academy of Sciences and the Beruni State Prize. In his works al-Biruni set an example of relying on evidence and experiment and of respect for the knowledge of other peoples, and today he is recognised as one of the great figures of world science.')
});

})();
