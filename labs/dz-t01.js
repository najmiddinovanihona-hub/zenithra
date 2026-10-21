/* DARSLIK · 1-mavzu. Astronomiya nimani o'rganadi? Rivojlanish tarixi va boshqa fanlar bilan aloqasi */
(function(){
const X=(uz,ru,en)=>({uz,ru,en});
const TX={
  title:X('Astronomiya nimani o‘rganadi? Uning rivojlanish tarixi va boshqa fanlar bilan aloqasi','Что изучает астрономия? История её развития и связь с другими науками','What does astronomy study? Its history and links to other sciences'),
  sub:X('1-§ · Ta’rif, Olam tuzilishi haqidagi qarashlar, tarix va fanlararo aloqalar','§1 · Определение, взгляды на устройство мира, история и связи с науками','§1 · Definition, models of the Universe, history and links to other sciences'),
  def:X('Koinotning bizga eng yaqin va uzoq obyektlarini, sistemalarining harakatlari va fizik tabiatlarini o‘rganadigan fan <b>astronomiya</b> deb ataladi.',
        'Наука, изучающая ближайшие и далёкие объекты Вселенной, движения их систем и их физическую природу, называется <b>астрономией</b>.',
        'The science that studies the nearest and the most distant objects of the Universe, the motions of their systems and their physical nature is called <b>astronomy</b>.'),
  star:X('yulduz','звезда','star'), law:X('qonun','закон','law'), astro:X('astronomiya','астрономия','astronomy'), astroD:X('yulduzlar qonuni','закон звёзд','law of the stars'),
  studies:X('Astronomiya osmon jismlarining quyidagi jihatlarini o‘rganadi:','Астрономия изучает у небесных тел:','Astronomy studies these aspects of celestial bodies:'),
  tags:[X('Kelib chiqishi','Происхождение','Origin'),X('Tuzilishi','Строение','Structure'),X('Harakatlari','Движение','Motion'),X('Fizik tabiati','Физическая природа','Physical nature'),X('Evolyutsiyasi','Эволюция','Evolution')],
  s1:X('Olam tuzilishi: ikki qarash','Устройство мира: два взгляда','The structure of the world: two views'),
  geo:X('Geosentrik','Геоцентрическая','Geocentric'), helio:X('Geliosentrik','Гелиоцентрическая','Heliocentric'),
  geoT:X('Geosentrik sistema · Aristotel – Ptolemey','Геоцентрическая система · Аристотель – Птолемей','Geocentric system · Aristotle – Ptolemy'),
  geoD:X('Markazda harakatsiz Yer. Uning atrofida Oy, Merkuriy, Venera, Quyosh, Mars, Yupiter va Saturn aylanadi. Ptolemey planetalarning sirtmoqsimon harakatini tushuntirish uchun ularni kichik aylanalar — <b>episikllar</b> bo‘ylab, episikl markazlarini esa katta aylanalar — <b>deferentlar</b> bo‘ylab harakatlantirdi. Bu ta’limot Olamning haqiqiy manzarasini aks ettirmasa-da, deyarli o‘n besh asr tan olindi.',
        'В центре — неподвижная Земля. Вокруг неё обращаются Луна, Меркурий, Венера, Солнце, Марс, Юпитер и Сатурн. Чтобы объяснить петлеобразное движение планет, Птолемей заставил их двигаться по малым кругам — <b>эпициклам</b>, а центры эпициклов — по большим кругам, <b>деферентам</b>. Хотя учение не отражало истинной картины мира, его признавали почти пятнадцать веков.',
        'A motionless Earth sits at the centre, circled by the Moon, Mercury, Venus, the Sun, Mars, Jupiter and Saturn. To explain the looping motion of the planets, Ptolemy moved them along small circles — <b>epicycles</b> — whose centres travel along large circles — <b>deferents</b>. Though it did not show the true picture, the theory was accepted for almost fifteen centuries.'),
  helioT:X('Geliosentrik sistema · Nikolay Kopernik','Гелиоцентрическая система · Николай Коперник','Heliocentric system · Nicolaus Copernicus'),
  helioD:X('XVI asrda Kopernik Olam markaziga Quyoshni qo‘ydi: Yer ham boshqa planetalar singari Quyosh atrofida aylanadi, Oy esa Yerning yo‘ldoshi. Planetalarning sirtmoqsimon harakati Yerning o‘zi harakatlanayotgani uchun shunday ko‘rinadi — episikllarga ehtiyoj qolmaydi.',
        'В XVI веке Коперник поместил в центр мира Солнце: Земля, как и другие планеты, обращается вокруг Солнца, а Луна — спутник Земли. Петлеобразное движение планет видно потому, что движется сама Земля, — эпициклы больше не нужны.',
        'In the 16th century Copernicus put the Sun at the centre: the Earth, like the other planets, orbits the Sun, and the Moon is Earth’s satellite. Planets seem to loop because the Earth itself is moving — no epicycles needed.'),
  epi:X('Episikl','Эпицикл','Epicycle'), epiD:X('planeta harakatlanadigan kichik aylana','малый круг, по которому движется планета','the small circle the planet moves along'),
  def2:X('Deferent','Деферент','Deferent'), defD:X('episikl markazi harakatlanadigan katta aylana','большой круг, по которому движется центр эпицикла','the large circle carrying the epicycle’s centre'),
  drag:X('Aylantirish — sichqoncha, yaqinlashtirish — g‘ildirakcha','Вращение — мышь, масштаб — колесо','Drag to rotate, scroll to zoom'),
  s2:X('Sirtmoqsimon harakat: Mars Yerdan qanday ko‘rinadi','Петлеобразное движение: Марс с Земли','Looping motion: Mars as seen from Earth'),
  s2D:X('Ptolemey episikllar yordamida tushuntirgan hodisa — planetaning osmonda vaqtincha orqaga yurib, sirtmoq chizishi. Quyidagi grafiklar Yer va Marsning haqiqiy orbitalari asosida hisoblangan.',
        'Явление, которое Птолемей объяснял эпициклами: планета временно идёт по небу назад и описывает петлю. Графики рассчитаны по реальным орбитам Земли и Марса.',
        'The effect Ptolemy explained with epicycles: a planet temporarily moves backwards across the sky and traces a loop. The charts are computed from the real orbits of Earth and Mars.'),
  loopT:X('Yerdan qaraganda Marsning yo‘li (yuqoridan)','Путь Марса относительно Земли (вид сверху)','Mars’s path relative to Earth (top view)'),
  loopC:X('Markazda — Yer. Uzuq chiziq — Quyoshning ko‘rinma yo‘li. Sariq qism — orqaga harakat. Yupqa chiziqlar shu yo‘lni Ptolemey usulida — deferent va episikl bilan — hosil qiladi.',
         'В центре — Земля. Пунктир — видимый путь Солнца. Жёлтое — попятное движение. Тонкие линии строят тот же путь по Птолемею — деферентом и эпициклом.',
         'Earth is at the centre. Dashed: the Sun’s apparent path. Yellow: backward motion. Thin lines build the same path Ptolemy’s way — a deferent plus an epicycle.'),
  years:X('Yillar','Лет','Years'),
  skyT:X('Osmonda ko‘rinishi: qarama-qarshi turish atrofidagi 8 oy','На небе: 8 месяцев вокруг противостояния','In the sky: 8 months around opposition'),
  skyC:X('Raqamlar — oylar. Mars odatda sharqqa siljiydi, sariq qismda esa g‘arbga — orqaga yuradi. Kenglik ko‘rinarli bo‘lishi uchun kattalashtirilgan.',
        'Числа — месяцы. Обычно Марс смещается к востоку, а на жёлтом участке — к западу, назад. Широта увеличена для наглядности.',
        'Numbers are months. Mars normally drifts east; on the yellow stretch it moves west — backwards. Latitude is exaggerated for clarity.'),
  east:X('Sharq','Восток','East'), west:X('G‘arb','Запад','West'), earth:X('Yer','Земля','Earth'), replay:X('Qayta chizish','Нарисовать заново','Redraw'),
  s3:X('Eratosfen Yerni o‘lchaydi','Эратосфен измеряет Землю','Eratosthenes measures the Earth'),
  s3D:X('Mil. avv. III asrda Aleksandriyalik Eratosfen birinchilardan bo‘lib Yer meridiani 1° li yoyining uzunligini, shu asosda planetamiz radiusini o‘lchadi. Yozgi quyosh turishi kuni peshinda Siyenada quyosh nurlari quduq tubiga tik tushgan, Iskandariyada esa tik tayoq soya bergan. Soya burchagi ikki shahar orasidagi meridian yoyiga teng.',
        'В III в. до н. э. Эратосфен Александрийский одним из первых измерил длину дуги меридиана в 1° и по ней — радиус Земли. В полдень летнего солнцестояния в Сиене солнечные лучи падали отвесно на дно колодца, а в Александрии вертикальный шест отбрасывал тень. Угол тени равен дуге меридиана между городами.',
        'In the 3rd century BC Eratosthenes of Alexandria was among the first to measure the length of a 1° arc of the meridian, and from it the Earth’s radius. At noon on the summer solstice, sunlight fell straight down a well in Syene, while a vertical stick in Alexandria cast a shadow. The shadow angle equals the meridian arc between the cities.'),
  ang:X('Soya burchagi φ','Угол тени φ','Shadow angle φ'), dist:X('Shaharlar orasi d','Расстояние d','Distance d'), stad:X('stadiy','стадий','stadia'),
  arc1:X('1° yoy uzunligi','Длина дуги 1°','Length of 1° arc'), circ:X('Yer aylanasi','Окружность Земли','Earth’s circumference'), rad:X('Yer radiusi','Радиус Земли','Earth’s radius'), err:X('Haqiqiydan farq','Отличие от истинного','Difference from true'),
  km:X('km','км','km'), syene:X('Siyena','Сиена','Syene'), alex:X('Iskandariya','Александрия','Alexandria'), rays:X('Quyosh nurlari','Солнечные лучи','Sunlight'),
  exag:X('Rasmda burchak 3 marta kattalashtirilgan · 1 stadiy ≈ 157,5 m','Угол на рисунке увеличен в 3 раза · 1 стадий ≈ 157,5 м','Angle drawn 3× larger · 1 stadion ≈ 157.5 m'),
  real:X('Haqiqiy qiymatlar: aylana 40 008 km, radius 6371 km, 1° ≈ 111,1 km','Истинные значения: окружность 40 008 км, радиус 6371 км, 1° ≈ 111,1 км','True values: circumference 40,008 km, radius 6,371 km, 1° ≈ 111.1 km'),
  s4:X('Rivojlanish tarixi','История развития','History of development'),
  s4D:X('Astronomiya ham boshqa barcha fanlar singari jamiyatning amaliy ehtiyojlari asosida vujudga kelgan. Uning kurtaklari Bobil, Misr, Markaziy Osiyo, Xitoy, Hindiston kabi mamlakatlarda bundan bir necha ming yil avval paydo bo‘lgan. Nuqtani bosing.',
        'Как и все науки, астрономия возникла из практических нужд общества. Её зачатки появились несколько тысяч лет назад в Вавилоне, Египте, Средней Азии, Китае и Индии. Нажмите на точку.',
        'Like every science, astronomy grew out of society’s practical needs. Its beginnings appeared several thousand years ago in Babylon, Egypt, Central Asia, China and India. Tap a point.'),
  all:X('Hammasi','Все','All'),
  s5:X('Boshqa fanlar bilan aloqasi','Связь с другими науками','Links to other sciences'),
  s5D:X('Astronomiya boshqa barcha fanlar bilan uzviy bog‘langan. Uning rivojida, ayniqsa, fizika va matematikaning ahamiyati katta; astronomiya ham o‘z yutuqlari bilan bu fanlar taraqqiyotiga hissa qo‘shib kelmoqda. Fanni tanlang.',
        'Астрономия неразрывно связана со всеми науками. Особенно велика роль физики и математики; астрономия, в свою очередь, своими достижениями вносит вклад в их развитие. Выберите науку.',
        'Astronomy is tightly bound to all other sciences. Physics and mathematics matter most for its progress — and astronomy in turn contributes to theirs. Pick a science.'),
  hub:X('Astronomiya','Астрономия','Astronomy'),
  s6:X('Tayanch tushunchalar','Ключевые понятия','Key terms'),
  s7:X('O‘zingizni sinang','Проверьте себя','Test yourself'),
  qOf:X('Savol','Вопрос','Question'), qNext:X('Keyingi','Далее','Next'), qDone:X('Natija','Результат','Result'), qAgain:X('Qaytadan','Заново','Try again'),
  qRes:X('to‘g‘ri javob','правильных ответов','correct answers')
};
const BODY={ earth:[0x3f7fe0,.36,X('Yer','Земля','Earth')], moon:[0xc9c9c9,.13,X('Oy','Луна','Moon')], mercury:[0xb0a89c,.15,X('Merkuriy','Меркурий','Mercury')],
  venus:[0xe9c47e,.21,X('Venera','Венера','Venus')], sun:[0xffc34d,.62,X('Quyosh','Солнце','Sun')], mars:[0xd5623b,.19,X('Mars','Марс','Mars')],
  jupiter:[0xdaa36a,.38,X('Yupiter','Юпитер','Jupiter')], saturn:[0xe6cd8f,.32,X('Saturn','Сатурн','Saturn')] };
// [jism, deferent radiusi, davri(yil), episikl radiusi, davri(yil)]
const GEO=[['moon',1.25,.075],['mercury',2.2,1,.42,.24],['venus',3.2,1,.55,.615],['sun',4.4,1],['mars',5.6,1.88,.6,1],['jupiter',6.9,11.86,.5,1],['saturn',8.2,29.46,.42,1]];
const HEL=[['mercury',1.35,.24],['venus',2.15,.615],['earth',3.05,1],['mars',4.1,1.88],['jupiter',5.7,11.86],['saturn',7.3,29.46]];
const ERAS={ anc:['#d79a4a',X('Qadimgi dunyo','Древний мир','Ancient world')], gr:['#4ea8ff',X('Yunon astronomiyasi','Греческая астрономия','Greek astronomy')],
  east:['#33b394',X('Sharq allomalari','Учёные Востока','Scholars of the East')], eu:['#a06bff',X('Yevropa','Европа','Europe')] };
const TL=[
 ['anc',X('Mil. avv. bir necha ming yil','Неск. тысяч лет до н. э.','Several millennia BC'),X('Bobil, Misr, Xitoy, Hindiston, Markaziy Osiyo','Вавилон, Египет, Китай, Индия, Средняя Азия','Babylon, Egypt, China, India, Central Asia'),
   X('Astronomiyaning kurtaklari jamiyatning amaliy ehtiyojlari — vaqtni o‘lchash, kalendar tuzish, dehqonchilik ishlarini rejalash asosida paydo bo‘ldi.','Зачатки астрономии возникли из практических нужд — счёта времени, составления календаря, планирования земледельческих работ.','Astronomy began with practical needs — keeping time, making calendars and planning farm work.')],
 ['gr',X('Mil. avv. VI asr','VI в. до н. э.','6th c. BC'),X('Pifagor','Пифагор','Pythagoras'),X('Yerning sharsimon shaklda ekanligi haqida fikr bildirgan.','Высказал мысль о шарообразности Земли.','Suggested that the Earth is a sphere.')],
 ['gr',X('Mil. avv. IV asr','IV в. до н. э.','4th c. BC'),X('Aristotel','Аристотель','Aristotle'),X('Olamning markazida harakatsiz Yer joylashgan degan geosentrik sistemaga asos solgan.','Заложил основы геоцентрической системы: в центре мира — неподвижная Земля.','Founded the geocentric system: a motionless Earth at the centre of the world.')],
 ['gr',X('Mil. avv. III asr','III в. до н. э.','3rd c. BC'),X('Eratosfen','Эратосфен','Eratosthenes'),X('Yer meridiani 1° li yoyining uzunligini va shu asosda planetamiz radiusini o‘lchagan.','Измерил длину дуги меридиана в 1° и по ней — радиус Земли.','Measured the length of a 1° meridian arc and from it the Earth’s radius.')],
 ['gr',X('Mil. avv. II asr','II в. до н. э.','2nd c. BC'),X('Gipparx','Гиппарх','Hipparchus'),X('Yuzlab yulduzlarning koordinatalarini aks ettirgan birinchi yulduzlar katalogini (jadvalini) tuzgan.','Составил первый звёздный каталог с координатами сотен звёзд.','Compiled the first star catalogue with the coordinates of hundreds of stars.')],
 ['gr',X('Milodiy II asr','II в. н. э.','2nd c. AD'),X('Klavdiy Ptolemey','Клавдий Птолемей','Claudius Ptolemy'),X('«Megale sintaksis» (Buyuk tuzilish) asarida yunon astronomiyasi yutuqlarini umumlashtirib, episikl va deferentlarga asoslangan geosentrik ta’limotni yaratgan.','В труде «Мегале синтаксис» обобщил достижения греческой астрономии и создал геоцентрическое учение с эпициклами и деферентами.','In the “Megale Syntaxis” he summed up Greek astronomy and built a geocentric theory of epicycles and deferents.')],
 ['east',X('IX asr','IX в.','9th c.'),X('Al-Xorazmiy','Аль-Хорезми','Al-Khwarizmi'),X('IX–XV asrlarda Yaqin va O‘rta Sharq hamda Markaziy Osiyoda qurilgan yirik rasadxonalarda faoliyat ko‘rsatgan ajdodlarimizdan biri; astronomik jadvallar (zij) muallifi.','Один из учёных, работавших в крупных обсерваториях Ближнего и Среднего Востока и Средней Азии IX–XV вв.; автор астрономических таблиц (зиджа).','One of the scholars of the great observatories of the Near and Middle East and Central Asia (9th–15th c.); author of astronomical tables (zij).')],
 ['east',X('IX asr','IX в.','9th c.'),X('Al-Farg‘oniy','Аль-Фаргани','Al-Farghani'),X('«Astronomiya asoslari» asari o‘sha davr uchun astronomiyadan o‘ziga xos ensiklopediya vazifasini o‘tagan.','Его труд «Основы астрономии» стал своего рода астрономической энциклопедией своего времени.','His “Elements of Astronomy” served as an encyclopedia of astronomy for its time.')],
 ['east',X('IX–X asr','IX–X вв.','9th–10th c.'),X('Al-Battoniy','Аль-Баттани','Al-Battani'),X('Yunon astronomiyasi yutuqlarini umumlashtirib, Oy harakatiga doir ba’zi ma’lumotlarni aniqlagan.','Обобщил достижения греческой астрономии и уточнил ряд данных о движении Луны.','Summed up Greek astronomy and refined data on the Moon’s motion.')],
 ['east',X('X asr','X в.','10th c.'),X('Xo‘jandiy, Buzjoniy, as-So‘fiy, Ibn Yunus','Ходжанди, Бузджани, ас-Суфи, Ибн Юнус','Khujandi, Buzjani, al-Sufi, Ibn Yunus'),X('Abu Mahmud Xo‘jandiy, Abu al-Vafo Buzjoniy, Abdurahmon as-So‘fiy va Ibn Yunus — Sharq rasadxonalarida ishlagan mashhur olimlar.','Абу Махмуд Ходжанди, Абу-ль-Вафа Бузджани, Абдуррахман ас-Суфи и Ибн Юнус — известные учёные восточных обсерваторий.','Abu Mahmud Khujandi, Abu al-Wafa Buzjani, Abd al-Rahman al-Sufi and Ibn Yunus — famed scholars of the eastern observatories.')],
 ['east',X('XI asr','XI в.','11th c.'),X('Abu Rayhon Beruniy','Абу Райхан Бируни','Al-Biruni'),X('Astronomiyaga oid 40 dan ortiq asari ma’lum: Quyosh, Oy va planetalar harakati, ularning tutilishi, kalendarlarga oid ko‘plab ma’lumotlar.','Известно более 40 его трудов по астрономии: о движении Солнца, Луны и планет, затмениях, календарях.','Over 40 of his astronomical works are known: on the motion of the Sun, Moon and planets, eclipses and calendars.')],
 ['east',X('XV asr','XV в.','15th c.'),X('Mirzo Ulug‘bek','Мирзо Улугбек','Ulugh Beg'),X('Samarqandda dunyodagi eng yirik astronomik rasadxonani ishga tushirgan. Bu yerda Qozizoda Rumiy, Jamshid Koshiy va Ali Qushchidan iborat astronomiya maktabi shakllangan.','Открыл в Самарканде крупнейшую в мире обсерваторию. Здесь сложилась школа Казизаде Руми, Джамшида Каши и Али Кушчи.','Opened the world’s largest observatory in Samarkand, home to the school of Qadizada Rumi, Jamshid Kashi and Ali Qushji.')],
 ['eu',X('XVI asr','XVI в.','16th c.'),X('Nikolay Kopernik','Николай Коперник','Nicolaus Copernicus'),X('Polshalik astronom. Olam markaziga Quyoshni qo‘ygan geliosentrik sistemani yaratgan.','Польский астроном, создатель гелиоцентрической системы с Солнцем в центре.','Polish astronomer who created the heliocentric system with the Sun at the centre.')],
 ['eu',X('XVI asr','XVI в.','16th c.'),X('Jordano Bruno','Джордано Бруно','Giordano Bruno'),X('Italiyalik olim. Kopernik ta’limotini rivojlantirib, Olam cheksizligi g‘oyasini ilgari surgan.','Итальянский учёный; развивая учение Коперника, выдвинул идею бесконечности Вселенной.','Italian thinker who extended Copernicus’s ideas to an infinite Universe.')],
 ['eu',X('XVII asr','XVII в.','17th c.'),X('Galileo Galiley','Галилео Галилей','Galileo Galilei'),X('Italiyalik olim. Osmonni birinchilardan bo‘lib teleskop orqali kuzatgan.','Итальянский учёный, одним из первых наблюдал небо в телескоп.','Italian scientist, among the first to observe the sky through a telescope.')],
 ['eu',X('XVII asr','XVII в.','17th c.'),X('Iogann Kepler','Иоганн Кеплер','Johannes Kepler'),X('Nemis matematigi. Planetalar harakat qonunlarini kashf etgan.','Немецкий математик, открывший законы движения планет.','German mathematician who discovered the laws of planetary motion.')],
 ['eu',X('XVII asr','XVII в.','17th c.'),X('Isaak Nyuton','Исаак Ньютон','Isaac Newton'),X('Ingliz fizigi. Mexanika qonunlari va butun olam tortishish qonunini yaratgan.','Английский физик, создатель законов механики и закона всемирного тяготения.','English physicist who formulated the laws of mechanics and universal gravitation.')],
 ['eu',X('XIX asr o‘rtalari','Середина XIX в.','Mid-19th c.'),X('Astrofizika','Астрофизика','Astrophysics'),X('Spektral analizning kashf etilishi va fotografiyaning qo‘llanishi osmon jismlarining fizik tabiatini o‘rganish imkonini berdi — yangi fan, astrofizikaga asos solindi.','Открытие спектрального анализа и применение фотографии позволили изучать физическую природу небесных тел — так возникла астрофизика.','The discovery of spectral analysis and the use of photography made it possible to study the physical nature of celestial bodies — astrophysics was born.')]
];
const SCI=[
 ['⚛',X('Fizika','Физика','Physics'),X('Mexanika qonunlari, nisbiylik nazariyasining asosiy g‘oyalari, kvant fizikasi, atom tuzilishi, yadroviy reaksiyalar, modda va nurlanishning o‘zaro ta’siri — bularning barchasi astronomik tadqiqotlarda sinovdan o‘tib kelmoqda.','Законы механики, основные идеи теории относительности, квантовая физика, строение атома, ядерные реакции, взаимодействие вещества и излучения — всё это проверяется в астрономических исследованиях.','The laws of mechanics, the key ideas of relativity, quantum physics, atomic structure, nuclear reactions and the interaction of matter and radiation are all tested by astronomical research.')],
 ['∑',X('Matematika','Математика','Mathematics'),X('Fizika va matematikaning ko‘plab g‘oya, nazariya va metodlari astronomiyada qo‘llaniladi; astronomiya ham o‘z yutuqlari bilan matematika taraqqiyotiga hissa qo‘shadi.','Многие идеи, теории и методы математики применяются в астрономии; астрономия, в свою очередь, способствует развитию математики.','Many mathematical ideas, theories and methods are applied in astronomy — and astronomy in turn advances mathematics.')],
 ['⚗',X('Kimyo','Химия','Chemistry'),X('Osmon jismlarining kimyoviy tarkibi va atmosferalarni tashkil etgan molekular birikmalar astronomiyaning kimyo bilan bog‘liqligini ko‘rsatadi.','Химический состав небесных тел и молекулярные соединения их атмосфер показывают связь астрономии с химией.','The chemical make-up of celestial bodies and the molecules of their atmospheres link astronomy to chemistry.')],
 ['🧬',X('Biologiya','Биология','Biology'),X('Yerda hayotning paydo bo‘lishi haqidagi masalalar astronomiyani biologiya bilan bog‘laydi.','Вопросы о происхождении жизни на Земле связывают астрономию с биологией.','Questions about the origin of life on Earth tie astronomy to biology.')],
 ['📜',X('Tarix','История','History'),X('Qadimiy qo‘lyozmalarda qayd etilgan astronomik hodisalar asosida tarixiy voqealarning aniq vaqtlari belgilangan hollar ko‘p bo‘lgan.','По астрономическим явлениям, отмеченным в древних рукописях, часто устанавливали точные даты исторических событий.','Astronomical events recorded in ancient manuscripts have often fixed the exact dates of historical events.')],
 ['📡',X('Texnika va radioelektronika','Техника и радиоэлектроника','Engineering & electronics'),X('Astronomik tadqiqot asboblarini takomillashtirish va boshqarishda texnika va radioelektronika alohida ahamiyat kasb etadi.','Техника и радиоэлектроника особенно важны для совершенствования и управления астрономическими приборами.','Engineering and radio-electronics are key to improving and operating astronomical instruments.')],
 ['🌍',X('Ijtimoiy-gumanitar fanlar','Социально-гуманитарные науки','Social sciences & humanities'),X('Astronomiyaning metodologik, dunyoqarash va ekologik masalalari uning ijtimoiy va gumanitar fanlar bilan aloqasini aks ettiradi.','Методологические, мировоззренческие и экологические вопросы астрономии отражают её связь с социальными и гуманитарными науками.','Astronomy’s methodological, world-view and ecological questions connect it with the social sciences and humanities.')]
];
const GL=[
 [X('Astronomiya','Астрономия','Astronomy'),X('Koinot obyektlari, ular sistemalarining harakati va fizik tabiatini o‘rganadigan fan.','Наука об объектах Вселенной, движении их систем и их физической природе.','The science of the Universe’s objects, the motion of their systems and their physical nature.')],
 [X('Geosentrik sistema','Геоцентрическая система','Geocentric system'),X('Olam markazida harakatsiz Yer joylashgan degan ta’limot (Aristotel, Ptolemey).','Учение о неподвижной Земле в центре мира (Аристотель, Птолемей).','The teaching that a motionless Earth sits at the centre of the world (Aristotle, Ptolemy).')],
 [X('Geliosentrik sistema','Гелиоцентрическая система','Heliocentric system'),X('Markazda Quyosh, Yer va planetalar uning atrofida aylanadi (Kopernik).','В центре — Солнце, Земля и планеты обращаются вокруг него (Коперник).','The Sun is at the centre; Earth and the planets orbit it (Copernicus).')],
 [X('Episikl','Эпицикл','Epicycle'),X('Ptolemey nazariyasida planeta harakatlanadigan kichik aylana.','Малый круг, по которому движется планета в теории Птолемея.','The small circle a planet moves along in Ptolemy’s theory.')],
 [X('Deferent','Деферент','Deferent'),X('Episikl markazi harakatlanadigan katta aylana.','Большой круг, по которому движется центр эпицикла.','The large circle along which an epicycle’s centre moves.')],
 [X('Sirtmoqsimon harakat','Петлеобразное движение','Retrograde loop'),X('Planetaning osmonda vaqtincha orqaga yurib, sirtmoq chizishi.','Временное попятное движение планеты по небу с образованием петли.','A planet’s temporary backward motion across the sky, tracing a loop.')],
 [X('Yulduzlar katalogi','Звёздный каталог','Star catalogue'),X('Yulduzlarning koordinatalari jamlangan jadval.','Таблица с координатами звёзд.','A table of star coordinates.')],
 [X('Spektral analiz','Спектральный анализ','Spectral analysis'),X('Yorug‘lik spektri orqali moddaning tarkibini aniqlash usuli.','Метод определения состава вещества по спектру света.','A method of finding what matter is made of from its light spectrum.')],
 [X('Astrofizika','Астрофизика','Astrophysics'),X('Osmon jismlari va ular sistemalarining fizik tabiatini o‘rganadigan fan.','Наука о физической природе небесных тел и их систем.','The science of the physical nature of celestial bodies and their systems.')]
];
const QZ=[
 [X('«Astronomiya» so‘zi qaysi yunoncha so‘zlardan tashkil topgan?','Из каких греческих слов состоит слово «астрономия»?','Which Greek words make up “astronomy”?'),[X('astron – yulduz, nomos – qonun','astron – звезда, nomos – закон','astron – star, nomos – law'),X('aster – osmon, logos – fan','aster – небо, logos – наука','aster – sky, logos – science'),X('astra – nur, nomos – yo‘l','astra – свет, nomos – путь','astra – light, nomos – path')]],
 [X('Geosentrik sistemaga kim asos solgan?','Кто заложил основы геоцентрической системы?','Who founded the geocentric system?'),[X('Aristotel','Аристотель','Aristotle'),X('Kopernik','Коперник','Copernicus'),X('Galiley','Галилей','Galileo')]],
 [X('Yer meridiani 1° yoyining uzunligini birinchilardan bo‘lib kim o‘lchagan?','Кто одним из первых измерил длину дуги меридиана в 1°?','Who was among the first to measure a 1° meridian arc?'),[X('Eratosfen','Эратосфен','Eratosthenes'),X('Gipparx','Гиппарх','Hipparchus'),X('Ptolemey','Птолемей','Ptolemy')]],
 [X('Birinchi yulduzlar katalogini kim tuzgan?','Кто составил первый звёздный каталог?','Who compiled the first star catalogue?'),[X('Gipparx','Гиппарх','Hipparchus'),X('Beruniy','Бируни','Al-Biruni'),X('Kepler','Кеплер','Kepler')]],
 [X('Ptolemey nazariyasida planeta bevosita qaysi aylana bo‘ylab harakatlanadi?','По какому кругу непосредственно движется планета у Птолемея?','In Ptolemy’s theory, which circle does the planet itself move along?'),[X('Episikl','Эпицикл','Epicycle'),X('Deferent','Деферент','Deferent'),X('Ekvator','Экватор','Equator')]],
 [X('XV asrda Samarqandda dunyodagi eng yirik rasadxonani kim ishga tushirgan?','Кто в XV веке открыл в Самарканде крупнейшую в мире обсерваторию?','Who opened the world’s largest observatory in Samarkand in the 15th century?'),[X('Mirzo Ulug‘bek','Мирзо Улугбек','Ulugh Beg'),X('Al-Farg‘oniy','Аль-Фаргани','Al-Farghani'),X('Beruniy','Бируни','Al-Biruni')]],
 [X('Astrofizika qaysi kashfiyotlardan so‘ng vujudga keldi?','После каких открытий возникла астрофизика?','Which discoveries gave rise to astrophysics?'),[X('Spektral analiz va fotografiya','Спектральный анализ и фотография','Spectral analysis and photography'),X('Kompas va soat','Компас и часы','The compass and the clock'),X('Episikllar nazariyasi','Теория эпициклов','The theory of epicycles')]],
 [X('Geosentrik nazariya qancha vaqt tan olingan?','Сколько времени признавалась геоцентрическая теория?','How long was the geocentric theory accepted?'),[X('Deyarli 15 asr','Почти 15 веков','Almost 15 centuries'),X('Taxminan 3 asr','Около 3 веков','About 3 centuries'),X('50 yilcha','Около 50 лет','About 50 years')]]
];
const AM=1.524, PM=1.881, INC=1.85*Math.PI/180, OM=-Math.PI/2, TAU=Math.PI*2;
function geoMars(t){ const e=TAU*t, m=TAU*t/PM; return [AM*Math.cos(m)-Math.cos(e), AM*Math.sin(m)-Math.sin(e), AM*Math.sin(INC)*Math.sin(m-OM)]; }
const lon=t=>{ const g=geoMars(t); return Math.atan2(g[1],g[0]); };
const retro=t=>{ let d=lon(t+0.002)-lon(t); if(d>Math.PI) d-=TAU; if(d<-Math.PI) d+=TAU; return d<0; };

function stage3d(host, T){
  const cv=host.querySelector('canvas'), lb=host.querySelector('.t1-lbls');
  if(!window.THREE||!THREE.OrbitControls){ host.classList.add('t1-no3d'); return {destroy(){},mode(){},play(){},speed(){}}; }
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:true}); R.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1)); R.setClearColor(0x070a1c,1);
  const S=new THREE.Scene(), cam=new THREE.PerspectiveCamera(42,1,0.1,400); cam.position.set(0,10.5,15.5);
  const ctl=new THREE.OrbitControls(cam,cv); ctl.enableDamping=true; ctl.enablePan=false; ctl.minDistance=6; ctl.maxDistance=36;
  S.add(new THREE.AmbientLight(0xffffff,.42)); const PL=new THREE.PointLight(0xfff0d6,1.35,0); S.add(PL);
  const N=700, sp=new Float32Array(N*3); for(let i=0;i<N;i++){ const u=Math.random()*2-1, a=Math.random()*TAU, r=95+Math.random()*40, s=Math.sqrt(1-u*u); sp[i*3]=r*s*Math.cos(a); sp[i*3+1]=r*u; sp[i*3+2]=r*s*Math.sin(a); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
  S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xb8c4ff,size:.55,transparent:true,opacity:.75})));
  const glowTex=(()=>{ const c=document.createElement('canvas'); c.width=c.height=128; const x=c.getContext('2d'), g=x.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0,'rgba(255,220,140,.9)'); g.addColorStop(.35,'rgba(255,170,60,.35)'); g.addColorStop(1,'rgba(255,150,40,0)'); x.fillStyle=g; x.fillRect(0,0,128,128); return new THREE.CanvasTexture(c); })();
  const W=new THREE.Group(); S.add(W);
  const ring=(r,col,op)=>{ const p=[]; for(let i=0;i<=160;i++){ const a=i/160*TAU; p.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)); }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op})); };
  const RT=window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;   // haqiqiy teksturalar (NASA asosida)
  const ball=k=>{ const [c,r]=BODY[k], sun=k==='sun'; const m=new THREE.Mesh(new THREE.SphereGeometry(r,RT?48:24,RT?32:16), sun?new THREE.MeshBasicMaterial({color:c}):new THREE.MeshStandardMaterial({color:c,roughness:.85,metalness:0}));
    if(sun){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})); s.scale.set(r*5,r*5,1); m.add(s); }
    if(k==='saturn'){ const rg=new THREE.Mesh(new THREE.RingGeometry(r*1.35,r*2.1,64),new THREE.MeshBasicMaterial({color:0xd9c08a,side:THREE.DoubleSide,transparent:true,opacity:.6})); rg.rotation.x=-Math.PI/2+.45; m.add(rg);
      if(RT){ const uv=rg.geometry.attributes.uv, pos=rg.geometry.attributes.position, v=new THREE.Vector3();   // radial UV — halqa xaritasi uchun
        for(let i=0;i<uv.count;i++){ v.fromBufferAttribute(pos,i); uv.setXY(i,(v.length()-r*1.35)/(r*.75),.5); }
        RT.texture('saturnRing',{srgb:false}).then(t=>{ const mm=rg.material; mm.map=t; mm.color.set(0xffffff); mm.opacity=1; mm.needsUpdate=true; }).catch(()=>{}); } }
    if(RT){ if(sun) RT.apply(m,'sun',{srgb:false,gain:1.15}); else RT.apply(m,k,{srgb:false,bump:(k==='mercury'||k==='mars'||k==='moon')?.002:0}); }
    return m; };
  let items=[], mode='geo', t=0, run=true, spd=1, alive=true, raf=0, last=performance.now(), labels=[], seen=true;
  const vio=new IntersectionObserver(es=>{ seen=es[0].isIntersecting; },{threshold:0}); vio.observe(host);
  function clear(){ W.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material&&o.material!==undefined&&o.material.map!==glowTex) o.material.dispose&&o.material.dispose(); }); while(W.children.length) W.remove(W.children[0]); items=[]; lb.innerHTML=''; labels=[]; }
  function addLabel(k,mesh){ const d=document.createElement('div'); d.className='t1-lbl'; d.textContent=T(BODY[k][2]); lb.appendChild(d); labels.push([d,mesh,BODY[k][1]]); }
  function setMode(m){ mode=m; clear();
    if(m==='geo'){ const e=ball('earth'); W.add(e); addLabel('earth',e); PL.position.set(0,0,0);
      GEO.forEach(([k,Rd,P,r,p])=>{ W.add(ring(Rd,0x8aa0ff,.28)); const mesh=ball(k); W.add(mesh); addLabel(k,mesh); let ep=null;
        if(r){ ep=ring(r,0xffc65c,.55); W.add(ep); } items.push({k,Rd,P,r,p,mesh,ep}); }); }
    else { const s=ball('sun'); W.add(s); addLabel('sun',s);
      HEL.forEach(([k,Rd,P])=>{ W.add(ring(Rd,0x8aa0ff,.3)); const mesh=ball(k); W.add(mesh); addLabel(k,mesh); const it={k,Rd,P,mesh};
        if(k==='earth'){ const mo=ball('moon'); W.add(mo); addLabel('moon',mo); it.moon=mo; const mr=ring(.6,0xc9c9c9,.3); W.add(mr); it.mr=mr; } items.push(it); }); }
    place(); }
  const pos=(R,a)=>[R*Math.cos(a),-R*Math.sin(a)];
  let sunMesh=null;
  function place(){
    items.forEach(it=>{ const a=TAU*t/it.P; let [x,z]=pos(it.Rd,a);
      if(it.ep){ it.ep.position.set(x,0,z); const [ex,ez]=pos(it.r,TAU*t/it.p); x+=ex; z+=ez; }
      it.mesh.position.set(x,0,z); it.mesh.rotation.y+=.01;
      if(it.moon){ const [mx,mz]=pos(.6,TAU*t/.075); it.moon.position.set(x+mx,0,z+mz); it.mr.position.set(x,0,z); }
      if(it.k==='sun') PL.position.set(x,0,z); });
    if(mode==='helio') PL.position.set(0,0,0); }
  const v=new THREE.Vector3();
  function size(){ const w=host.clientWidth, h=host.clientHeight; if(!w||!h) return; const c=R.getSize(new THREE.Vector2()); if(c.x!==w||c.y!==h){ R.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix(); } }
  function frame(now){ if(!alive) return; raf=requestAnimationFrame(frame); const dt=Math.min(.05,(now-last)/1000); last=now; if(!seen||document.hidden) return;
    if(run){ t+=dt*spd/7; place(); } ctl.update(); size(); R.render(S,cam);
    const w=host.clientWidth, h=host.clientHeight;
    labels.forEach(([d,m,r])=>{ m.getWorldPosition(v); v.y+=r; v.project(cam); const vis=v.z<1; d.style.display=vis?'':'none'; if(vis) d.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px) translate(-50%,-130%)`; }); }
  setMode('geo'); raf=requestAnimationFrame(frame);
  return { mode:setMode, play(b){ run=b; }, speed(s){ spd=s; }, relabel(){ labels.forEach(()=>{}); },
    destroy(){ alive=false; cancelAnimationFrame(raf); vio.disconnect(); clear(); ctl.dispose(); sg.dispose(); glowTex.dispose(); R.dispose(); try{ R.forceContextLoss(); }catch(e){} } };
}

function build(el, api){
  const {T,click}=api, L=api.L(), offs=[], rafs={};
  const fmtN=(n,d)=>{ const s=Number(n).toLocaleString('en-US',{maximumFractionDigits:d||0,minimumFractionDigits:d||0}); return L==='en'?s:s.replace(/,/g,'\u202f').replace('.',','); };
  const C=()=>{ const s=getComputedStyle(el), g=k=>s.getPropertyValue(k).trim(); return {text:g('--text'),dim:g('--text-dim'),brd:g('--glass-brd'),neon:g('--neon'),neon2:g('--neon-2'),gold:g('--dz-gold'),chart:g('--dz-chart'),earth:g('--dz-earth'),day:!!el.closest('.dz-day')}; };
  const sec=(n,t,inner)=>`<section class="dz-sec"><div class="sec-title">${n} · ${T(t)}</div>${inner}</section>`;
  el.innerHTML=`
  <section class="dz-sec t1-hero dz-card">
    <p class="t1-def">${T(TX.def)}</p>
    <div class="t1-ety"><div class="t1-word"><b>astron</b><span>${T(TX.star)}</span></div><span class="t1-op">+</span><div class="t1-word"><b>nomos</b><span>${T(TX.law)}</span></div><span class="t1-op">=</span><div class="t1-word on"><b>${T(TX.astro)}</b><span>${T(TX.astroD)}</span></div></div>
    <div class="t1-study"><span>${T(TX.studies)}</span><div class="t1-tags">${TX.tags.map(x=>`<span class="t1-tag">${T(x)}</span>`).join('')}</div></div>
  </section>
  ${sec('01',TX.s1,`<div class="t1-split">
    <div class="t1-stage" id="t1Stage"><canvas></canvas><div class="t1-lbls"></div>
      <div class="t1-bar"><button class="lab-chip" id="t1Play">⏸</button><button class="lab-chip on" data-sp="1">1×</button><button class="lab-chip" data-sp="4">4×</button></div>
      <div class="t1-hint">${T(TX.drag)}</div></div>
    <div class="t1-side">
      <div class="lab-row" style="margin-top:0"><button class="lab-chip on" data-m="geo">🌍 ${T(TX.geo)}</button><button class="lab-chip" data-m="helio">☀ ${T(TX.helio)}</button></div>
      <h4 id="t1MT"></h4><p class="t1-p" id="t1MD"></p>
      <div class="t1-keys" id="t1Keys"><div><i class="t1-sw" style="background:#ffc65c"></i><b>${T(TX.epi)}</b> — ${T(TX.epiD)}</div><div><i class="t1-sw" style="background:#8aa0ff"></i><b>${T(TX.def2)}</b> — ${T(TX.defD)}</div></div>
    </div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-two">
    <div class="dz-card t1-chart"><h4>${T(TX.loopT)}</h4><canvas class="t1-cv" id="t1Loop"></canvas>
      <div class="lab-row"><span class="t1-lab">${T(TX.years)}: <b id="t1YrV">4</b></span><input type="range" class="lab-range" id="t1Yrs" min="1" max="16" step="1" value="4" style="flex:1"><button class="lab-chip" id="t1Re">↻ ${T(TX.replay)}</button></div>
      <p class="t1-cap">${T(TX.loopC)}</p></div>
    <div class="dz-card t1-chart"><h4>${T(TX.skyT)}</h4><canvas class="t1-cv" id="t1Sky"></canvas><p class="t1-cap">${T(TX.skyC)}</p></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t1Era"></canvas><p class="t1-cap">${T(TX.exag)}</p></div>
    <div class="t1-side">
      <label class="t1-ctl"><span>${T(TX.ang)}: <b id="t1PhV"></b></span><input type="range" class="lab-range" id="t1Ph" min="2" max="15" step="0.1" value="7.2"></label>
      <label class="t1-ctl"><span>${T(TX.dist)}: <b id="t1DV"></b></span><input type="range" class="lab-range" id="t1D" min="2000" max="8000" step="100" value="5000"></label>
      <div class="t1-formula">C = 360° / φ × d</div>
      <div class="lab-kv" id="t1Res"></div>
      <p class="t1-cap">${T(TX.real)}</p>
    </div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p>
    <div class="lab-row" id="t1Eras"><button class="lab-chip on" data-e="">${T(TX.all)}</button>${Object.keys(ERAS).map(k=>`<button class="lab-chip" data-e="${k}"><i class="t1-sw" style="background:${ERAS[k][0]}"></i>${T(ERAS[k][1])}</button>`).join('')}</div>
    <div class="t1-tl"><div class="t1-track">${TL.map((r,i)=>`<button class="t1-node" data-i="${i}" style="--c:${ERAS[r[0]][0]}"><span class="yr">${T(r[1])}</span><span class="dot"></span><span class="nm">${T(r[2])}</span></button>`).join('')}</div></div>
    <div class="dz-card t1-det" id="t1Det"></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p><div class="t1-split t1-split-even">
    <div class="t1-web" id="t1Web"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${SCI.map((s,i)=>{ const a=i/SCI.length*TAU-Math.PI/2; return `<line data-l="${i}" x1="50" y1="50" x2="${(50+38*Math.cos(a)).toFixed(2)}" y2="${(50+38*Math.sin(a)).toFixed(2)}"/>`; }).join('')}</svg>
      <div class="t1-hub">🔭 ${T(TX.hub)}</div>
      ${SCI.map((s,i)=>{ const a=i/SCI.length*TAU-Math.PI/2; return `<button class="t1-sat" data-s="${i}" style="left:${(50+38*Math.cos(a)).toFixed(2)}%;top:${(50+38*Math.sin(a)).toFixed(2)}%"><span>${s[0]}</span>${T(s[1])}</button>`; }).join('')}</div>
    <div class="dz-card" id="t1Sci"></div></div>`)}
  ${sec('06',TX.s6,`<dl class="t1-gl">${GL.map(g=>`<div class="dz-card"><dt>${T(g[0])}</dt><dd>${T(g[1])}</dd></div>`).join('')}</dl>`)}
  ${sec('07',TX.s7,`<div class="dz-card t1-quiz" id="t1Quiz"></div>`)}`;
  const $=s=>el.querySelector(s), $$=s=>el.querySelectorAll(s);
  const fit=(cv,ratio,maxH)=>{ const w=Math.max(200,Math.round(cv.getBoundingClientRect().width||cv.parentElement.clientWidth)), h=Math.round(Math.min(maxH,w*ratio)); if(cv._w!==w||cv._h!==h){ cv.style.height=h+'px'; cv._x=api.hiDPI(cv,w,h); cv._w=w; cv._h=h; } const x=cv._x; x.globalAlpha=1; x.setLineDash([]); return {x,w,h}; };
  const strokeRuns=(x,n,px,py,isR,c,lw)=>{ x.lineWidth=lw; x.lineCap='round'; x.lineJoin='round'; let i=1; while(i<=n){ const r=isR(i); x.strokeStyle=r?c.gold:c.neon; x.beginPath(); x.moveTo(px(i-1),py(i-1)); while(i<=n&&isR(i)===r){ x.lineTo(px(i),py(i)); i++; } x.stroke(); } };
  const anim=(key,ms,draw)=>{ cancelAnimationFrame(rafs[key]); const t0=performance.now(); const st=n=>{ const p=Math.min(1,(n-t0)/ms); draw(p); if(p<1) rafs[key]=requestAnimationFrame(st); }; rafs[key]=requestAnimationFrame(st); };

  /* 01 · 3D */
  const st=stage3d($('#t1Stage'),T); offs.push(st.destroy);
  const setM=m=>{ $$('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===m)); $('#t1MT').textContent=T(m==='geo'?TX.geoT:TX.helioT); $('#t1MD').innerHTML=T(m==='geo'?TX.geoD:TX.helioD); $('#t1Keys').style.display=m==='geo'?'':'none'; st.mode(m); };
  $$('[data-m]').forEach(b=>b.onclick=()=>{ click(740); setM(b.dataset.m); }); setM('geo');
  let playing=true; $('#t1Play').onclick=()=>{ playing=!playing; st.play(playing); $('#t1Play').textContent=playing?'⏸':'▶'; click(700); };
  $$('[data-sp]').forEach(b=>b.onclick=()=>{ $$('[data-sp]').forEach(x=>x.classList.toggle('on',x===b)); st.speed(+b.dataset.sp); click(720); });

  /* 02 · Sirtmoq */
  let loopP=1, LP=null; const loopPts=Y=>{ if(LP&&LP.Y===Y) return LP; const n=Math.round(260*Y), P=new Float32Array((n+1)*2), Rr=new Uint8Array(n+1); for(let i=0;i<=n;i++){ const tt=Y*i/n, g=geoMars(tt); P[2*i]=g[0]; P[2*i+1]=g[1]; Rr[i]=retro(tt)?1:0; } return LP={Y,n,P,Rr}; };
  function drawLoop(){ const cv=$('#t1Loop'); const {x,w,h}=fit(cv,.86,440), c=C(); x.clearRect(0,0,w,h);
    const Y=+$('#t1Yrs').value, cx=w/2, cy=h/2, k=Math.min(w,h)/2*.9/(AM+1), tEnd=Y*loopP;
    const circ=(X0,Y0,r)=>{ x.beginPath(); x.arc(X0,Y0,r,0,TAU); x.stroke(); };
    x.lineWidth=1; x.setLineDash([4,5]); x.strokeStyle=c.gold; x.globalAlpha=.55; circ(cx,cy,k); x.globalAlpha=1; x.setLineDash([]);
    const D=loopPts(Y), n=Math.floor(D.n*loopP); if(n>0) strokeRuns(x,n,i=>cx+D.P[2*i]*k,i=>cy-D.P[2*i+1]*k,i=>D.Rr[i],c,1.7);
    const m=TAU*tEnd/PM, e=TAU*tEnd, Dx=cx+AM*Math.cos(m)*k, Dy=cy-AM*Math.sin(m)*k, g=geoMars(tEnd), Px=cx+g[0]*k, Py=cy-g[1]*k;
    x.lineWidth=1; x.strokeStyle=c.neon2; x.globalAlpha=.75; x.beginPath(); x.moveTo(cx,cy); x.lineTo(Dx,Dy); x.lineTo(Px,Py); x.stroke(); circ(Dx,Dy,k); x.globalAlpha=1;
    const dot=(X0,Y0,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(X0,Y0,r,0,TAU); x.fill(); };
    dot(cx-Math.cos(e)*k,cy+Math.sin(e)*k,5,c.gold); dot(Dx,Dy,2.5,c.neon2); dot(Px,Py,5,'#d5623b'); dot(cx,cy,5.5,'#3f7fe0');
    x.font='600 12px system-ui,sans-serif'; x.fillStyle=c.text; x.textAlign='left'; x.fillText(T(TX.earth),cx+9,cy+4); x.fillText('Mars',Px+8,Py-6);
    x.fillStyle=c.dim; x.font='11px system-ui,sans-serif'; x.fillText(T(BODY.sun[2]),cx-Math.cos(e)*k+8,cy+Math.sin(e)*k+4);
    x.fillStyle=c.neon2; x.fillText(T(TX.def2)+' · '+T(TX.epi),12,h-12); }
  const replayLoop=()=>anim('loop',2600,p=>{ loopP=p; drawLoop(); });
  $('#t1Yrs').oninput=e=>{ $('#t1YrV').textContent=e.target.value; loopP=1; drawLoop(); };
  $('#t1Yrs').onchange=()=>{ click(720); replayLoop(); };
  $('#t1Re').onclick=()=>{ click(720); replayLoop(); };
  let skyP=1; const SKY=[]; for(let i=0;i<=600;i++){ const tt=-.33+.66*i/600, g=geoMars(tt); SKY.push([tt,Math.atan2(g[1],g[0])*180/Math.PI,Math.atan2(g[2],Math.hypot(g[0],g[1]))*180/Math.PI,retro(tt)?1:0]); }
  const SB={lmin:Math.min(...SKY.map(p=>p[1])),lmax:Math.max(...SKY.map(p=>p[1])),bmin:Math.min(...SKY.map(p=>p[2])),bmax:Math.max(...SKY.map(p=>p[2]))};
  const STARS=[]; { let s=7; const rnd=()=>(s=(s*16807)%2147483647)/2147483647; for(let i=0;i<70;i++) STARS.push([rnd(),rnd(),rnd()]); }
  function drawSky(){ const cv=$('#t1Sky'); const {x,w,h}=fit(cv,.86,440), c=C(); x.clearRect(0,0,w,h);
    const {lmin,lmax,bmin,bmax}=SB;
    const pl=24, pr=24, pt=30, pb=46, X0=l=>pl+(lmax-l)/(lmax-lmin)*(w-pl-pr), Y0=b=>pt+(bmax-b)/(bmax-bmin)*(h-pt-pb);
    STARS.forEach(([a,b,s])=>{ x.fillStyle=c.dim; x.globalAlpha=.25+s*.45; x.beginPath(); x.arc(a*w,b*h,.6+s*1.3,0,TAU); x.fill(); }); x.globalAlpha=1;
    x.strokeStyle=c.brd; x.lineWidth=1; x.beginPath(); x.moveTo(pl,h-pb+14); x.lineTo(w-pr,h-pb+14); x.stroke();
    x.font='11px system-ui,sans-serif'; x.fillStyle=c.dim; x.textAlign='left'; x.fillText('← '+T(TX.east),pl,h-12); x.textAlign='right'; x.fillText(T(TX.west)+' →',w-pr,h-12);
    const n=Math.round(600*skyP); if(n>0) strokeRuns(x,n,i=>X0(SKY[i][1]),i=>Y0(SKY[i][2]),i=>SKY[i][3],c,2.2);
    x.textAlign='center'; x.font='600 10.5px system-ui,sans-serif';
    for(let m=0;m<=8;m++){ const i=Math.round(m*30.44/(0.66*365.25)*600); if(i>n||i>600) break; const p=SKY[i], px=X0(p[1]), py=Y0(p[2]);
      x.fillStyle=c.chart; x.strokeStyle=c.text; x.lineWidth=1.2; x.beginPath(); x.arc(px,py,7.5,0,TAU); x.fill(); x.stroke(); x.fillStyle=c.text; x.fillText(String(m+1),px,py+3.6); }
    const p=SKY[n]; x.fillStyle='#d5623b'; x.beginPath(); x.arc(X0(p[1]),Y0(p[2]),5,0,TAU); x.fill(); }
  const replaySky=()=>anim('sky',3200,p=>{ skyP=p; drawSky(); });

  /* 03 · Eratosfen */
  function eraCalc(){ const ph=+$('#t1Ph').value, d=+$('#t1D').value, km=d*.1575, C1=360/ph*km, R1=C1/TAU, err=(C1-40008)/40008*100;
    $('#t1PhV').textContent=fmtN(ph,1)+'°'; $('#t1DV').textContent=fmtN(d)+' '+T(TX.stad)+' ≈ '+fmtN(km)+' '+T(TX.km);
    const kv=(k,v)=>`<div><div class="k">${T(k)}</div><div class="v">${v}</div></div>`;
    $('#t1Res').innerHTML=kv(TX.arc1,fmtN(km/ph,1)+' '+T(TX.km))+kv(TX.circ,fmtN(C1)+' '+T(TX.km))+kv(TX.rad,fmtN(R1)+' '+T(TX.km))+kv(TX.err,(err>0?'+':'')+fmtN(err,1)+'%'); }
  function drawEra(){ const cv=$('#t1Era'); const {x,w,h}=fit(cv,.7,400), c=C(); x.clearRect(0,0,w,h);
    const ph=+$('#t1Ph').value, a=Math.min(48,ph*3)*Math.PI/180, R=Math.min(h*.62,w*.6), cx=w*.6, cy=h*.3+R;
    x.fillStyle=c.earth; x.strokeStyle=c.brd; x.lineWidth=1.5; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.fill(); x.stroke();
    const Sx=cx, Sy=cy-R, Ax=cx-R*Math.sin(a), Ay=cy-R*Math.cos(a), L0=Math.max(30,R*.17), Tx=Ax-L0*Math.sin(a), Ty=Ay-L0*Math.cos(a);
    const gy=X1=>{ const q=R*R-(X1-cx)**2; return q>0?cy-Math.sqrt(q):h; };
    x.strokeStyle=c.gold; x.lineWidth=1.3;
    const xs=[]; for(let X1=Sx-R*1.2;X1<=w+4;X1+=Math.max(26,w/18)) xs.push(X1); xs.push(Sx,Tx);
    xs.forEach(X1=>{ const key=X1===Sx||X1===Tx; x.globalAlpha=key?.95:.35; x.beginPath(); x.moveTo(X1,0); x.lineTo(X1,X1===Sx?Sy+16:(X1===Tx?Ty:gy(X1))); x.stroke(); });
    x.globalAlpha=1; const sh=gy(Tx);
    x.strokeStyle=c.text; x.lineWidth=2; x.beginPath(); x.moveTo(Tx,Ty); x.lineTo(Tx,sh); x.stroke();
    x.strokeStyle=c.dim; x.lineWidth=4; x.beginPath(); x.arc(cx,cy,R,-Math.PI/2-Math.asin(Math.min(1,(cx-Tx)/R)),-Math.PI/2-a); x.stroke();
    x.fillStyle=c.chart; x.fillRect(Sx-5,Sy,10,16); x.strokeStyle=c.text; x.lineWidth=1.2; x.strokeRect(Sx-5,Sy,10,16);
    x.strokeStyle=c.text; x.lineWidth=3; x.beginPath(); x.moveTo(Ax,Ay); x.lineTo(Tx,Ty); x.stroke();
    x.strokeStyle=c.neon; x.lineWidth=3.5; x.beginPath(); x.arc(cx,cy,R,-Math.PI/2-a,-Math.PI/2); x.stroke();
    x.lineWidth=1.2; x.setLineDash([5,4]); x.strokeStyle=c.neon2; x.beginPath(); x.moveTo(Sx,Sy); x.lineTo(cx,cy); x.lineTo(Ax,Ay); x.stroke(); x.setLineDash([]);
    x.lineWidth=1.6; x.beginPath(); x.arc(cx,cy,36,-Math.PI/2-a,-Math.PI/2); x.stroke();
    x.beginPath(); x.arc(Tx,Ty,20,Math.PI/2-a,Math.PI/2); x.stroke();
    x.font='700 13px system-ui,sans-serif'; x.fillStyle=c.neon2; x.textAlign='center';
    x.fillText('φ',cx-50*Math.sin(a/2),cy-50*Math.cos(a/2)+4); x.fillText('φ',Tx+32*Math.sin(a/2),Ty+32*Math.cos(a/2)+4);
    x.fillStyle=c.neon; x.fillText('d',cx-(R+16)*Math.sin(a/2),cy-(R+16)*Math.cos(a/2)+4);
    x.font='600 12px system-ui,sans-serif'; x.fillStyle=c.text; x.textAlign='left'; x.fillText(T(TX.syene),Sx+10,Sy-8);
    x.textAlign='right'; x.fillText(T(TX.alex),Tx-8,Ty-6);
    x.fillStyle=c.gold; x.textAlign='right'; x.fillText('☀ '+T(TX.rays)+' ↓',w-10,18); }
  ['#t1Ph','#t1D'].forEach(s=>$(s).oninput=()=>{ eraCalc(); drawEra(); }); eraCalc();

  /* 04 · Tarix */
  let era='', sel=11;
  function tl(){ $$('#t1Eras [data-e]').forEach(b=>b.classList.toggle('on',b.dataset.e===era));
    $$('.t1-node').forEach(b=>{ const r=TL[+b.dataset.i]; b.classList.toggle('dim',!!era&&r[0]!==era); b.classList.toggle('on',+b.dataset.i===sel); });
    const r=TL[sel], E=ERAS[r[0]];
    $('#t1Det').innerHTML=`<div class="t1-det-h"><span class="t1-era" style="--c:${E[0]}"><i class="t1-sw" style="background:${E[0]}"></i>${T(E[1])}</span><span class="t1-yr">${T(r[1])}</span></div><h4>${T(r[2])}</h4><p class="t1-p">${T(r[3])}</p>`; }
  $$('#t1Eras [data-e]').forEach(b=>b.onclick=()=>{ click(720); era=b.dataset.e; if(era&&TL[sel][0]!==era) sel=TL.findIndex(r=>r[0]===era); tl(); });
  $$('.t1-node').forEach(b=>b.onclick=()=>{ click(740); sel=+b.dataset.i; tl(); });
  tl();

  /* 05 · Fanlar */
  function sci(i){ $$('.t1-sat').forEach(b=>b.classList.toggle('on',+b.dataset.s===i)); $$('#t1Web line').forEach(l=>l.classList.toggle('on',+l.dataset.l===i));
    $('#t1Sci').innerHTML=`<div class="t1-sci-ico">${SCI[i][0]}</div><h4>${T(SCI[i][1])}</h4><p class="t1-p">${T(SCI[i][2])}</p>`; }
  $$('.t1-sat').forEach(b=>b.onclick=()=>{ click(740); sci(+b.dataset.s); }); sci(0);

  /* 07 · Test */
  let qi=0, score=0, order=[];
  const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  function qStart(){ qi=0; score=0; order=shuffle(QZ.map((_,i)=>i)); qShow(); }
  function qShow(){ const box=$('#t1Quiz');
    if(qi>=order.length){ box.innerHTML=`<div class="t1-qend"><div class="t1-qsc">${score} / ${order.length}</div><p class="t1-p">${T(TX.qRes)}</p><button class="lab-chip on" id="t1QA">↻ ${T(TX.qAgain)}</button></div>`; $('#t1QA').onclick=()=>{ click(720); qStart(); }; return; }
    const q=QZ[order[qi]], opts=shuffle(q[1].map((o,i)=>[o,i]));
    box.innerHTML=`<div class="t1-qh"><span>${T(TX.qOf)} ${qi+1} / ${order.length}</span><span>${score} ✦</span></div><div class="t1-qbar"><i style="width:${qi/order.length*100}%"></i></div><h4>${T(q[0])}</h4>
      <div class="t1-opts">${opts.map(([o,i])=>`<button class="t1-opt" data-k="${i}">${T(o)}</button>`).join('')}</div><div class="t1-qn"></div>`;
    box.querySelectorAll('.t1-opt').forEach(b=>b.onclick=()=>{ const ok=b.dataset.k==='0'; if(ok) score++; click(ok?900:300);
      box.querySelectorAll('.t1-opt').forEach(x=>{ x.disabled=true; if(x.dataset.k==='0') x.classList.add('ok'); else if(x===b) x.classList.add('no'); });
      const n=box.querySelector('.t1-qn'); n.innerHTML=`<button class="lab-chip on">${T(qi===order.length-1?TX.qDone:TX.qNext)} →</button>`; n.firstChild.onclick=()=>{ click(720); qi++; qShow(); }; }); }
  qStart();

  const redraw=()=>{ drawLoop(); drawSky(); drawEra(); };
  api.onTheme(redraw);
  let rt=0; const onR=()=>{ clearTimeout(rt); rt=setTimeout(redraw,120); }; window.addEventListener('resize',onR); offs.push(()=>window.removeEventListener('resize',onR)); let rw=el.clientWidth; const ro=new ResizeObserver(()=>{ if(el.clientWidth!==rw){ rw=el.clientWidth; onR(); } }); ro.observe(el); offs.push(()=>ro.disconnect());
  redraw();
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; io.unobserve(e.target); if(e.target.id==='t1Loop') replayLoop(); else replaySky(); }),{threshold:.35});
  io.observe($('#t1Loop')); io.observe($('#t1Sky')); offs.push(()=>io.disconnect());
  return ()=>{ offs.forEach(f=>{ try{ f(); }catch(e){} }); Object.values(rafs).forEach(cancelAnimationFrame); clearTimeout(rt); };
}

const add=()=>{ if(!window.DARSLIK) return setTimeout(add,50); window.DARSLIK.add({ id:'t01', GL, QZ, ico:'🔭', title:TX.title, sub:TX.sub, build }); };
add();
})();
