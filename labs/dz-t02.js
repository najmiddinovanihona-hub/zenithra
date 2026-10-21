/* DARSLIK · 2-mavzu (2–5-§). Yoritgichlarning sutkalik ko'rinma harakatlari. Yulduz turkumlari.
   Yerning aylanishiga dalillar. Osmon sferasi. Quyoshning yillik harakati, ekliptika */
(function(){
const X=(uz,ru,en)=>({uz,ru,en});
const D2R=Math.PI/180, TAU=Math.PI*2, EPS=23.44;
const TX={
  title:X('Yoritgichlarning sutkalik ko‘rinma harakatlari. Yulduz turkumlari','Суточное видимое движение светил. Созвездия','Daily apparent motion of the sky. Constellations'),
  sub:X('2–5-§ · Osmon sferasi, Yerning aylanishiga dalillar, Quyoshning yillik harakati va ekliptika','§2–5 · Небесная сфера, доказательства вращения Земли, годовое движение Солнца и эклиптика','§2–5 · The celestial sphere, proof of Earth’s rotation, the Sun’s yearly motion and the ecliptic'),
  intro:X('Bulutsiz tunda oddiy ko‘z bilan osmonning yarim sferasida <b>3000 dan ortiq</b> yulduz ko‘rinmaydi. Ularni bir necha soat kuzatsangiz, butun osmon kuzatuvchidan o‘tuvchi faraziy o‘q — <b>olam o‘qi</b> atrofida aylanayotganini ko‘rasiz. Bu aylanish davri — bir sutka. Janubga qarab turgan kuzatuvchiga yoritgichlar chapdan o‘ngga, soat strelkasi yo‘nalishida harakatlanayotgandek ko‘rinadi.',
    'В безоблачную ночь невооружённым глазом на полусфере неба видно <b>не более 3000</b> звёзд. Если наблюдать их несколько часов, видно, что всё небо вращается вокруг воображаемой оси, проходящей через наблюдателя, — <b>оси мира</b>. Период вращения — одни сутки. Наблюдателю, смотрящему на юг, светила движутся слева направо, по часовой стрелке.',
    'On a clear night the naked eye sees <b>no more than 3,000</b> stars on one half of the sky. Watch them for a few hours and the whole sky turns around an imaginary line through the observer — the <b>axis of the world</b>. One turn takes a day. Facing south, the stars drift from left to right, clockwise.'),
  s1:X('Osmon sferasi: asosiy nuqta, chiziq va aylanalar','Небесная сфера: основные точки, линии и круги','The celestial sphere: main points, lines and circles'),
  s1D:X('<b>Osmon sferasi</b> — radiusi ixtiyoriy, markazi kuzatuvchining ko‘zida yotgan sfera; unda yulduzlar osmonda qanday ko‘rinsa, shundayligicha proyeksiyalanadi. Elementni tanlang — modelda ajralib ko‘rinadi.',
    '<b>Небесная сфера</b> — сфера произвольного радиуса с центром в глазу наблюдателя, на которую звёзды проецируются так, как видны на небе. Выберите элемент — он выделится на модели.',
    'The <b>celestial sphere</b> is a sphere of any radius centred on the observer’s eye, onto which the stars are projected just as they appear. Pick an element to highlight it.'),
  all:X('Hammasi','Все','All'), lat:X('Geografik kenglik φ','Географическая широта φ','Latitude φ'),
  eqP:X('Ekvator','Экватор','Equator'), tash:X('Toshkent','Ташкент','Tashkent'), pole:X('Qutb','Полюс','Pole'), paris:X('Parij','Париж','Paris'),
  drag:X('Aylantirish — sichqoncha, yaqinlashtirish — g‘ildirakcha','Вращение — мышь, масштаб — колесо','Drag to rotate, scroll to zoom'),
  polNote:X('Modelda ko‘ring: olam qutbining gorizontdan balandligi kenglikka teng.','Посмотрите на модели: высота полюса мира над горизонтом равна широте.','See it in the model: the pole’s height above the horizon equals the latitude.'),
  s2:X('Yulduzlarning sutkalik aylanishi','Суточное вращение звёзд','The daily rotation of the stars'),
  s2D:X('Fotoapparat osmonning shimoliy qismiga qaratib, uzoq vaqt ochiq qoldirilsa, ba’zi yulduzlar sharqdan chiqib, g‘arbga botadi, botmaydiganlari esa qo‘zg‘almas nuqta — Qutb yulduzi atrofida konsentrik aylanalar chizadi. Aslida bu Yerning o‘z o‘qi atrofida aylanishi tufayli sodir bo‘ladi.',
    'Если фотоаппарат, направленный на северную часть неба, долго держать открытым, одни звёзды восходят на востоке и заходят на западе, а незаходящие чертят концентрические окружности вокруг неподвижной точки — Полярной звезды. На самом деле это следствие вращения Земли вокруг оси.',
    'Point a camera at the northern sky with a long exposure: some stars rise in the east and set in the west, while the never-setting ones trace concentric circles around a fixed point near Polaris. It all happens because the Earth spins on its axis.'),
  expo:X('Suratga olish vaqti','Выдержка','Exposure'), h:X('soat','ч','h'), shoot:X('Suratga olish','Снять','Shoot'),
  turn:X('Yulduzlar burilishi','Поворот звёзд','Rotation of stars'), circ:X('Botmaydigan yulduzlar','Незаходящие звёзды','Never-setting stars'),
  north:X('Shimol','Север','North'), polaris:X('Qutb yulduzi','Полярная','Polaris'),
  rateT:X('Har soatda 15° · 360° : 15° = 24 soat','15° в час · 360° : 15° = 24 часа','15° per hour · 360° ÷ 15° = 24 hours'),
  moveT:X('Quyosh, Oy va planetalar','Солнце, Луна и планеты','The Sun, Moon and planets'),
  moveD:X('Ular ham sharqdan g‘arbga sutkalik harakatda ishtirok etadi, lekin yulduzlardan farqli o‘laroq chiqish-botish nuqtalari va eng katta balandliklari kun sayin o‘zgaradi. Yulduzlar fonida esa ular g‘arbdan sharqqa siljiydi:',
    'Они тоже участвуют в суточном движении с востока на запад, но, в отличие от звёзд, точки их восхода и захода и наибольшая высота меняются день ото дня. На фоне звёзд же они смещаются с запада на восток:',
    'They too share the daily east-to-west motion, but unlike stars their rising and setting points and greatest height change day by day. Against the stars they drift west to east:'),
  moon:X('Oy','Луна','Moon'), sun:X('Quyosh','Солнце','Sun'),
  moonD:X('≈ 13° / sutka · 27,32 sutkada to‘la aylanadi','≈ 13° / сутки · полный оборот за 27,32 сут','≈ 13° / day · full circle in 27.32 days'),
  sunD:X('≈ 1° / sutka · bir yilda to‘la aylanadi (Yerning yillik harakati tufayli)','≈ 1° / сутки · полный оборот за год (из-за годового движения Земли)','≈ 1° / day · full circle in a year (due to Earth’s yearly motion)'),
  s3:X('Yulduz turkumlari','Созвездия','Constellations'),
  s3D:X('Qadim Sharqda kishilar mo‘ljal olish uchun yorug‘ yulduzlarni to‘dalarga ajratib, ularni <b>yulduz turkumlari</b> deb atagan. Bugun osmon sferasi <b>88</b> yulduz turkumiga bo‘lingan. Turkumning yorug‘ yulduzlari xira yulduzlarni topishda mo‘ljal bo‘ladi — masalan, Katta Ayiqning ikki chetki yulduzi Qutb yulduziga «ko‘rsatadi».',
    'На Древнем Востоке яркие звёзды для ориентирования объединяли в группы — <b>созвездия</b>. Сегодня небесная сфера разделена на <b>88</b> созвездий. Яркие звёзды созвездия служат ориентиром для поиска слабых — например, две крайние звезды Большой Медведицы «указывают» на Полярную.',
    'In the ancient East people grouped bright stars for orientation and called them <b>constellations</b>. Today the sky is divided into <b>88</b> of them. Bright stars guide you to faint ones — the two end stars of the Big Dipper “point” to Polaris.'),
  find:X('Qutb yulduzini topish','Найти Полярную','Find Polaris'), time:X('Vaqt','Время','Time'),
  cat1:X('Hayvonlar va jonivorlar','Животные','Animals'), cat1L:X('Katta Ayiq, Oqqush, Arslon, Ajdaho, Kit','Большая Медведица, Лебедь, Лев, Дракон, Кит','Great Bear, Swan, Lion, Dragon, Whale'),
  cat2:X('Yunon afsonalari qahramonlari','Герои греческих мифов','Heroes of Greek myths'), cat2L:X('Kassiopeya, Andromeda, Pegas','Кассиопея, Андромеда, Пегас','Cassiopeia, Andromeda, Pegasus'),
  cat3:X('Shakl va buyumlar','Фигуры и предметы','Shapes and objects'), cat3L:X('Uchburchak, Tarozi, Cho‘mich','Треугольник, Весы, Ковш','Triangle, Scales, the Dipper'),
  mapC:X('Shimoliy osmon xaritasi: markazda — olam qutbi. «Vaqt»ni sursangiz, osmon Qutb yulduzi atrofida aylanadi.','Карта северного неба: в центре — полюс мира. Сдвиньте «Время» — небо повернётся вокруг Полярной.','Northern sky map with the celestial pole at the centre. Move “Time” and the sky turns around Polaris.'),
  s4:X('Yerning o‘z o‘qi atrofida aylanishiga dalillar · Fuko mayatnigi','Доказательства вращения Земли · маятник Фуко','Proof of the Earth’s rotation · Foucault’s pendulum'),
  s4D:X('Qutb tepasiga osilgan mayatnik (shar o‘rniga tubida teshigi bor, qum to‘ldirilgan chelakcha) tebrantirilsa, qum bir chiziq bo‘ylab emas, vaqt o‘tishi bilan soat strelkasi yo‘nalishida burilib boruvchi chiziqlar bo‘ylab sepiladi. Mayatnik o‘z tebranish tekisligini o‘zgartirmaydi — demak, uning ostida Yer aylanmoqda. Parijdagi soborda uzunligi 60 metrli Fuko mayatnigi bilan shu namoyish qilinadi. Balanddan tashlangan tosh ham sharq tomonga siljib tushadi.',
    'Если над полюсом подвесить маятник (вместо шара — ведёрко с песком и отверстием в дне) и раскачать его, песок ложится не вдоль одной линии: линия со временем поворачивается по часовой стрелке. Маятник сохраняет плоскость качания — значит, под ним вращается Земля. В парижском соборе это показывают маятником Фуко длиной 60 м. И камень, брошенный с высоты, отклоняется к востоку.',
    'Hang a pendulum above the pole (a sand-filled bucket with a hole instead of a ball) and swing it: the sand doesn’t fall along one line — the line slowly turns clockwise. The pendulum keeps its plane, so the Earth must be turning beneath it. A 60-metre Foucault pendulum shows this in a Paris cathedral. A stone dropped from a height also lands slightly to the east.'),
  elapsed:X('O‘tgan vaqt','Прошло','Elapsed'), rot:X('Tekislik burildi','Плоскость повернулась','Plane turned'), per:X('To‘la aylanish','Полный оборот','Full turn'),
  never:X('burilmaydi','не поворачивается','no turn'), reset:X('Boshidan','Сначала','Reset'),
  fNote:X('Burilish tezligi = 15° × sin φ soatiga. Qutbda tekislik 24 soatda to‘la aylanadi, ekvatorda esa burilmaydi.','Скорость поворота = 15° × sin φ в час. На полюсе плоскость делает оборот за 24 ч, на экваторе не поворачивается.','Turning rate = 15° × sin φ per hour. At the pole the plane turns once in 24 h; at the equator it does not turn.'),
  s5:X('Quyoshning yillik ko‘rinma harakati. Ekliptika','Годовое видимое движение Солнца. Эклиптика','The Sun’s yearly apparent motion. The ecliptic'),
  s5D:X('Quyosh yulduzlar oralab g‘arbdan sharqqa har sutkada salkam 1° siljiydi. Uning yillik ko‘rinma yo‘li — katta aylana, <b>ekliptika</b>. Yil davomida Quyoshning ekvatordan og‘ishi +23°26′ dan −23°26′ gacha o‘zgaradi: demak, ekliptikaning ekvatorga og‘maligi <b>ε = 23°26′</b>. Bu Yer ekvatorining o‘z orbita tekisligiga og‘maligi bilan bir xil.',
    'Солнце смещается среди звёзд с запада на восток почти на 1° в сутки. Его годовой видимый путь — большой круг, <b>эклиптика</b>. За год склонение Солнца меняется от +23°26′ до −23°26′: наклон эклиптики к экватору <b>ε = 23°26′</b> — такой же, как наклон земного экватора к плоскости орбиты.',
    'The Sun moves west to east among the stars by almost 1° a day. Its yearly path is a great circle — the <b>ecliptic</b>. Over a year its declination swings from +23°26′ to −23°26′, so the ecliptic is tilted to the equator by <b>ε = 23°26′</b> — the same as Earth’s equator to its orbit.'),
  date:X('Sana','Дата','Date'), today:X('Bugun','Сегодня','Today'),
  decT:X('Quyoshning og‘ishi (δ) yil davomida','Склонение Солнца (δ) за год','The Sun’s declination (δ) over the year'),
  zodT:X('Zodiak soha: Quyosh qaysi turkumda','Зодиак: в каком созвездии Солнце','The zodiac: where the Sun is'),
  zodC:X('Ekliptika bo‘ylab joylashgan 12 turkum — zodiak soha. * Quyosh 30-noyabr – 17-dekabr kunlari Ilonchi turkumidan ham o‘tadi; u an’anaviy 12 turkumga kirmaydi.','12 созвездий вдоль эклиптики — зодиак. * С 30 ноября по 17 декабря Солнце проходит и через Змееносец, не входящий в традиционные 12.','The 12 constellations along the ecliptic form the zodiac. * From Nov 30 to Dec 17 the Sun also crosses Ophiuchus, which is not among the traditional 12.'),
  dec:X('Og‘ish δ','Склонение δ','Declination δ'), noon:X('Tushdagi balandlik','Высота в полдень','Noon altitude'), dayL:X('Kunduz uzunligi','Долгота дня','Day length'),
  rise:X('Chiqish nuqtasi','Точка восхода','Sunrise point'), inC:X('Turkum','Созвездие','Constellation'),
  ofE:X('sharqdan','от востока','from east'), toN:X('shimolga','к северу','to the north'), toS:X('janubga','к югу','to the south'), exE:X('aniq sharqda','точно на востоке','due east'),
  polD:X('qutb kuni','полярный день','polar day'), polN:X('qutb tuni','полярная ночь','polar night'), forLoc:X('Joy','Место','Place'),
  k1:X('Bahorgi tengkunlik','Весеннее равноденствие','March equinox'), k2:X('Yozgi quyosh turishi','Летнее солнцестояние','June solstice'), k3:X('Kuzgi tengkunlik','Осеннее равноденствие','September equinox'), k4:X('Qishki quyosh turishi','Зимнее солнцестояние','December solstice'),
  s6:X('Tayanch tushunchalar','Ключевые понятия','Key terms'),
  s7:X('Savol va topshiriqlar','Вопросы и задания','Questions and tasks'), show:X('Javobni ko‘rish','Показать ответ','Show answer'), hide:X('Yashirish','Скрыть','Hide'), go3d:X('3D modelga o‘tish','Перейти к 3D-модели','Go to the 3D model'),
  s8:X('O‘zingizni sinang','Проверьте себя','Test yourself'), qOf:X('Savol','Вопрос','Question'), qNext:X('Keyingi','Далее','Next'), qDone:X('Natija','Результат','Result'), qAgain:X('Qaytadan','Заново','Try again'), qRes:X('to‘g‘ri javob','правильных ответов','correct answers')
};
// Osmon sferasi elementlari
const EL=[
 ['zen','#ffffff',X('Zenit va nadir','Зенит и надир','Zenith & nadir'),X('Kuzatuvchidan o‘tkazilgan vertikal chiziqning osmon sferasi bilan kesishgan ikki nuqtasi: bosh tomondagisi — <b>zenit (Z)</b>, unga qarama-qarshisi — <b>nadir (Z′)</b>. Ularni tutashtiruvchi to‘g‘ri chiziq — vertikal chiziq.','Две точки пересечения отвесной линии через наблюдателя с небесной сферой: над головой — <b>зенит (Z)</b>, напротив — <b>надир (Z′)</b>. Соединяющая их прямая — отвесная линия.','Where the plumb line through the observer meets the sphere: overhead is the <b>zenith (Z)</b>, opposite is the <b>nadir (Z′)</b>. The line joining them is the vertical line.')],
 ['hor','#5fd39a',X('Matematik gorizont','Математический горизонт','Celestial horizon'),X('Sfera markazidan vertikal chiziqqa perpendikular tekislik bilan kesishishidan hosil bo‘lgan katta aylana. Unda <b>Shimol (N)</b>, <b>Janub (S)</b>, <b>Sharq (E)</b> va <b>G‘arb (W)</b> nuqtalari yotadi.','Большой круг, образованный плоскостью через центр сферы перпендикулярно отвесной линии. На нём лежат точки <b>севера (N)</b>, <b>юга (S)</b>, <b>востока (E)</b> и <b>запада (W)</b>.','The great circle cut by the plane through the centre perpendicular to the vertical. It holds the <b>North (N)</b>, <b>South (S)</b>, <b>East (E)</b> and <b>West (W)</b> points.')],
 ['vert','#9aa6cc',X('Vertikal aylana','Вертикальный круг','Vertical circle'),X('Sferaning vertikal o‘q orqali o‘tuvchi tekisliklar bilan kesishishidan hosil bo‘lgan katta aylanalar. Modelda — sharq va g‘arb nuqtalaridan o‘tuvchisi.','Большие круги, образованные плоскостями через отвесную линию. На модели — круг через точки востока и запада.','Great circles cut by planes containing the vertical line. The model shows the one through East and West.')],
 ['axis','#ff7a6b',X('Olam qutblari va olam o‘qi','Полюсы и ось мира','Celestial poles & axis'),X('Yer o‘qi davomlarining sfera bilan kesishgan nuqtalari — <b>olam qutblari</b>: shimoliy P va janubiy P′. Ularni tutashtiruvchi o‘q — <b>olam o‘qi</b>; butun osmon shu o‘q atrofida aylanadi.','Точки пересечения продолжения земной оси со сферой — <b>полюсы мира</b>: северный P и южный P′. Соединяющая их ось — <b>ось мира</b>; вокруг неё вращается всё небо.','Where Earth’s axis, extended, meets the sphere — the <b>celestial poles</b> P (north) and P′ (south). The line between them is the <b>axis of the world</b>; the whole sky turns around it.')],
 ['eq','#4ea8ff',X('Osmon ekvatori','Небесный экватор','Celestial equator'),X('Sfera markazidan olam o‘qiga tik tekislik bilan kesishishidan hosil bo‘lgan katta aylana. U Yer ekvatori bilan bir tekislikda yotadi va gorizontni sharq hamda g‘arb nuqtalarida kesadi.','Большой круг, образованный плоскостью через центр сферы перпендикулярно оси мира. Лежит в плоскости земного экватора и пересекает горизонт в точках востока и запада.','The great circle cut by the plane through the centre perpendicular to the axis. It lies in the plane of Earth’s equator and crosses the horizon at East and West.')],
 ['par','#ffd36b',X('Sutkalik parallel','Суточная параллель','Diurnal circle'),X('Osmon ekvatori tekisligiga parallel tekisliklar bilan kesishishdan hosil bo‘lgan aylanalar. Yulduz sutka davomida o‘z parallelini chizadi: gorizontdan to‘liq yuqoridagisi — botmaydi.','Круги, образованные плоскостями, параллельными плоскости экватора. За сутки звезда описывает свою параллель; если она целиком над горизонтом — звезда не заходит.','Circles cut by planes parallel to the equator. Each star traces its own in a day; if it lies wholly above the horizon, the star never sets.')],
 ['mer','#c08bff',X('Osmon meridiani','Небесный меридиан','Celestial meridian'),X('Olam qutblari, zenit va nadirdan o‘tuvchi katta aylana. U gorizontni Shimol va Janub nuqtalarida kesadi; ularni tutashtiruvchi kesma — <b>tush chizig‘i</b>.','Большой круг через полюсы мира, зенит и надир. Пересекает горизонт в точках севера и юга; соединяющий их отрезок — <b>полуденная линия</b>.','The great circle through the poles, zenith and nadir. It meets the horizon at North and South; the segment between them is the <b>noon line</b>.')],
 ['ecl','#ffb347',X('Ekliptika','Эклиптика','Ecliptic'),X('Quyoshning yillik ko‘rinma yo‘li. Ekvatorga 23°26′ og‘gan; u bilan <b>bahorgi (^)</b> va <b>kuzgi (Ω)</b> tengkunlik nuqtalarida kesishadi, <b>yozgi (E)</b> va <b>qishki (E′)</b> quyosh turishi nuqtalarida ekvatordan eng uzoqda bo‘ladi. Modeldagi sariq shar — bugungi Quyosh.','Годовой видимый путь Солнца. Наклонена к экватору на 23°26′; пересекает его в точках <b>весеннего (^)</b> и <b>осеннего (Ω)</b> равноденствий, дальше всего от него — в точках <b>летнего (E)</b> и <b>зимнего (E′)</b> солнцестояний. Жёлтый шар — сегодняшнее Солнце.','The Sun’s yearly path, tilted 23°26′ to the equator. It crosses it at the <b>March (^)</b> and <b>September (Ω)</b> equinoxes and is farthest at the <b>June (E)</b> and <b>December (E′)</b> solstices. The yellow ball is today’s Sun.')]
];
// Yulduzlar: [ra soat, dec°, yulduz kattaligi]
const ST={ dubhe:[11.062,61.75,1.8], merak:[11.031,56.38,2.4], phecda:[11.897,53.69,2.4], megrez:[12.257,57.03,3.3], alioth:[12.9,55.96,1.8], mizar:[13.399,54.93,2.2], alkaid:[13.792,49.31,1.9],
  polaris:[2.53,89.26,2.0], yildun:[17.537,86.59,4.4], epsUMi:[16.766,82.04,4.2], zetUMi:[15.734,77.79,4.3], kochab:[14.845,74.16,2.1], pherkad:[15.345,71.83,3.0], etaUMi:[16.292,75.76,5.0],
  caph:[0.153,59.15,2.3], schedar:[0.675,56.54,2.2], gamCas:[0.945,60.72,2.5], ruchbah:[1.43,60.24,2.7], segin:[1.907,63.67,3.4],
  deneb:[20.69,45.28,1.25], sadr:[20.37,40.26,2.2], gienah:[20.77,33.97,2.5], delCyg:[19.75,45.13,2.9], albireo:[19.512,27.96,3.1],
  regulus:[10.139,11.97,1.35], etaLeo:[10.122,16.76,3.5], algieba:[10.333,19.84,2.0], adhafera:[10.278,23.42,3.4], rasalas:[9.88,26.0,3.9], epsLeo:[9.764,23.77,3.0], zosma:[11.235,20.52,2.6], denebola:[11.818,14.57,2.1], chertan:[11.237,15.43,3.3],
  triA:[1.885,29.58,3.4], triB:[2.159,34.99,3.0], triG:[2.289,33.85,4.0] };
const CON=[
 ['uma',X('Katta Ayiq','Большая Медведица','Great Bear'),[['alkaid','mizar','alioth','megrez','dubhe','merak','phecda','megrez']]],
 ['umi',X('Kichik Ayiq','Малая Медведица','Little Bear'),[['polaris','yildun','epsUMi','zetUMi','kochab','pherkad','etaUMi','zetUMi']]],
 ['cas',X('Kassiopeya','Кассиопея','Cassiopeia'),[['caph','schedar','gamCas','ruchbah','segin']]],
 ['cyg',X('Oqqush','Лебедь','Swan'),[['deneb','sadr','albireo'],['gienah','sadr','delCyg']]],
 ['leo',X('Arslon','Лев','Lion'),[['regulus','etaLeo','algieba','adhafera','rasalas','epsLeo'],['algieba','zosma','denebola','chertan','regulus'],['zosma','chertan']]],
 ['tri',X('Uchburchak','Треугольник','Triangle'),[['triA','triB','triG','triA']]]
];
// Zodiak: ekliptik uzunlama bo'yicha boshlanishi (°)
const ZOD=[[351.6,X('Hut','Рыбы','Pisces')],[28.7,X('Hamal','Овен','Aries')],[53.4,X('Savr','Телец','Taurus')],[90.1,X('Javzo','Близнецы','Gemini')],[118.2,X('Saraton','Рак','Cancer')],[138,X('Asad','Лев','Leo')],[173.9,X('Sunbula','Дева','Virgo')],
  [217.8,X('Mezon','Весы','Libra')],[241,X('Aqrab','Скорпион','Scorpius')],[247.7,X('Ilonchi*','Змееносец*','Ophiuchus*'),1],[266.3,X('Qavs','Стрелец','Sagittarius')],[299.7,X('Jaddi','Козерог','Capricornus')],[327.9,X('Dalv','Водолей','Aquarius')]];
const MON={uz:['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const MONS={uz:['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'],ru:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const YEAR=2026;
const dateOf=doy=>new Date(Date.UTC(YEAR,0,1)+doy*86400000);
function sunLon(doy){ const Dd=(Date.UTC(YEAR,0,1,12)+doy*86400000-Date.UTC(2000,0,1,12))/86400000, g=(357.529+0.98560028*Dd)*D2R, q=280.459+0.98564736*Dd;
  return (((q+1.915*Math.sin(g)+0.02*Math.sin(2*g))%360)+360)%360; }
const sunDec=doy=>Math.asin(Math.sin(EPS*D2R)*Math.sin(sunLon(doy)*D2R))/D2R;
const KEYD=[[79,'k1','^'],[172,'k2','E'],[265,'k3','Ω'],[355,'k4','E′']];
const GL=[
 [X('Olam o‘qi','Ось мира','Axis of the world'),X('Kuzatuvchidan o‘tuvchi, osmon sutka davomida atrofida aylanadigan faraziy o‘q; olam qutblarini tutashtiradi.','Воображаемая ось через наблюдателя, вокруг которой небо вращается за сутки; соединяет полюсы мира.','The imaginary axis through the observer around which the sky turns daily; it joins the celestial poles.')],
 [X('Yulduz turkumi','Созвездие','Constellation'),X('Osmonning yorug‘ yulduzlari ajratilgan qismi; osmon 88 turkumga bo‘lingan.','Участок неба с группой ярких звёзд; небо разделено на 88 созвездий.','A region of sky with a group of bright stars; the sky is split into 88.')],
 [X('Osmon sferasi','Небесная сфера','Celestial sphere'),X('Markazi kuzatuvchi ko‘zida bo‘lgan ixtiyoriy radiusli sfera; yoritgichlar unga proyeksiyalanadi.','Сфера произвольного радиуса с центром в глазу наблюдателя, на которую проецируются светила.','A sphere of any radius centred on the observer’s eye, onto which the sky is projected.')],
 [X('Zenit · Nadir','Зенит · Надир','Zenith · Nadir'),X('Vertikal chiziqning sfera bilan kesishgan nuqtalari: bosh ustida — zenit, qarama-qarshisi — nadir.','Точки пересечения отвесной линии со сферой: над головой — зенит, напротив — надир.','Where the vertical meets the sphere: overhead — zenith; opposite — nadir.')],
 [X('Og‘ish aylanasi','Круг склонения','Hour circle'),X('Olam o‘qi orqali o‘tuvchi tekisliklar bilan sfera kesishishidan hosil bo‘lgan katta aylanalar.','Большие круги, образованные плоскостями через ось мира.','Great circles cut by planes containing the axis of the world.')],
 [X('Tush chizig‘i','Полуденная линия','Noon line'),X('Gorizontning Shimol va Janub nuqtalarini tutashtiruvchi to‘g‘ri chiziq kesmasi.','Отрезок, соединяющий точки севера и юга горизонта.','The segment joining the North and South points of the horizon.')],
 [X('Ekliptika','Эклиптика','Ecliptic'),X('Quyoshning yillik ko‘rinma yo‘li; ekvatorga ε = 23°26′ og‘gan katta aylana.','Годовой видимый путь Солнца; большой круг, наклонённый к экватору на ε = 23°26′.','The Sun’s yearly path; a great circle tilted ε = 23°26′ to the equator.')],
 [X('Tengkunlik nuqtalari','Точки равноденствий','Equinox points'),X('Ekliptika va ekvatorning kesishgan nuqtalari: bahorgi (^, 21-mart) va kuzgi (Ω, 23-sentabr).','Точки пересечения эклиптики и экватора: весеннее (^, 21 марта) и осеннее (Ω, 23 сентября).','Where the ecliptic crosses the equator: March (^, Mar 21) and September (Ω, Sep 23).')],
 [X('Quyosh turish nuqtalari','Точки солнцестояний','Solstice points'),X('Ekliptikaning ekvatordan eng uzoq nuqtalari: yozgi (E, +23°26′, 22-iyun) va qishki (E′, −23°26′, 22-dekabr).','Наиболее удалённые от экватора точки эклиптики: летнее (E, +23°26′, 22 июня) и зимнее (E′, −23°26′, 22 декабря).','The ecliptic’s farthest points from the equator: June (E, +23°26′, Jun 22) and December (E′, −23°26′, Dec 22).')],
 [X('Zodiak soha','Зодиакальный пояс','Zodiac'),X('Quyoshning yillik yo‘li bo‘ylab joylashgan yulduz turkumlari sohasi: Hut, Hamal, Savr, Javzo, Saraton, Asad, Sunbula, Mezon, Aqrab, Qavs, Jaddi, Dalv.','Пояс созвездий вдоль годового пути Солнца: Рыбы, Овен, Телец, Близнецы, Рак, Лев, Дева, Весы, Скорпион, Стрелец, Козерог, Водолей.','The belt of constellations along the Sun’s yearly path: Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpius, Sagittarius, Capricornus, Aquarius.')],
 [X('Fuko mayatnigi','Маятник Фуко','Foucault pendulum'),X('Tebranish tekisligining Yerga nisbatan burilishi orqali Yerning o‘z o‘qi atrofida aylanishini ko‘rsatuvchi mayatnik.','Маятник, показывающий вращение Земли поворотом плоскости качания относительно Земли.','A pendulum whose swing plane turns relative to the ground, showing that the Earth rotates.')]
];
const QA=[
 [X('Yulduzlar osmonining sharqdan g‘arbga aylanishining sababi nimada?','В чём причина вращения звёздного неба с востока на запад?','Why does the starry sky turn from east to west?'),X('Yerning o‘z o‘qi atrofida g‘arbdan sharqqa bir sutkada bir marta aylanishi. Osmonning aylanishi — ko‘rinma harakat.','Вращение Земли вокруг оси с запада на восток один раз в сутки. Вращение неба — видимое движение.','The Earth spins on its axis west to east once a day; the sky’s turning is only apparent.')],
 [X('Quyosh va Oyning Yer atrofida sharqdan g‘arbga tomon harakatlari haqiqiy harakatmi?','Является ли движение Солнца и Луны вокруг Земли с востока на запад истинным?','Is the east-to-west motion of the Sun and Moon around the Earth real?'),X('Yo‘q, bu sutkalik ko‘rinma harakat — Yer aylanishi tufayli. Yulduzlar fonida esa Oy g‘arbdan sharqqa sutkasiga ≈13° siljib, Yer atrofida 27,32 sutkada haqiqatan aylanadi; Quyoshning ≈1° lik siljishi esa Yerning Quyosh atrofidagi yillik harakatidan.','Нет, это суточное видимое движение из-за вращения Земли. На фоне звёзд Луна действительно движется с запада на восток ≈13° в сутки и обходит Землю за 27,32 суток; смещение Солнца ≈1° в сутки — следствие годового движения Земли.','No — it’s the daily apparent motion caused by Earth’s spin. Against the stars the Moon really moves west to east ≈13° a day, circling Earth in 27.32 days; the Sun’s ≈1° a day comes from Earth’s yearly orbit.')],
 [X('Yerning o‘z o‘qi atrofida aylanishi qanday isbotlanadi?','Как доказывается вращение Земли вокруг оси?','How is Earth’s rotation proven?'),X('Fuko mayatnigi: tebranish tekisligi Yerga nisbatan soat strelkasi bo‘yicha buriladi. Shuningdek, balanddan tashlangan tosh sharq tomonga siljib tushadi.','Маятник Фуко: плоскость качания поворачивается относительно Земли по часовой стрелке. Также камень, брошенный с высоты, отклоняется к востоку.','Foucault’s pendulum: its swing plane turns clockwise relative to the ground. A stone dropped from a height also lands to the east.')],
 [X('Osmon sferasining nuqta, chiziq va aylanalarini modelda ko‘rsating.','Покажите на модели точки, линии и круги небесной сферы.','Show the points, lines and circles of the celestial sphere on a model.'),X('Yuqoridagi 3D modelda har bir elementni tanlab ko‘ring: Z, Z′, N, S, E, W, P, P′, gorizont, ekvator, meridian, sutkalik parallel va ekliptika.','Выберите каждый элемент на 3D-модели выше: Z, Z′, N, S, E, W, P, P′, горизонт, экватор, меридиан, суточную параллель и эклиптику.','Pick each element in the 3D model above: Z, Z′, N, S, E, W, P, P′, horizon, equator, meridian, diurnal circle and ecliptic.'),1],
 [X('Ekliptika tekisligi osmon ekvatoriga qanday burchak ostida og‘gan?','Под каким углом плоскость эклиптики наклонена к небесному экватору?','At what angle is the ecliptic tilted to the celestial equator?'),X('ε = 23°26′ — Yer ekvatorining orbita tekisligiga og‘maligi bilan bir xil.','ε = 23°26′ — столько же, сколько наклон земного экватора к плоскости орбиты.','ε = 23°26′ — the same as Earth’s equator to its orbital plane.')],
 [X('Ekliptikaning asosiy nuqtalarini ta’riflang.','Дайте определение основным точкам эклиптики.','Define the main points of the ecliptic.'),X('Bahorgi tengkunlik (^) — Quyosh janubiy yarimshardan shimoliyga o‘tadigan kesishish nuqtasi, 21-mart. Kuzgi tengkunlik (Ω) — 23-sentabr. Yozgi quyosh turishi (E) — eng katta shimoliy og‘ish +23°26′, 22-iyun. Qishki quyosh turishi (E′) — −23°26′, 22-dekabr.','Весеннее равноденствие (^) — точка, где Солнце переходит из южного полушария неба в северное, 21 марта. Осеннее (Ω) — 23 сентября. Летнее солнцестояние (E) — наибольшее северное склонение +23°26′, 22 июня. Зимнее (E′) — −23°26′, 22 декабря.','March equinox (^): where the Sun crosses from the southern to the northern sky, Mar 21. September equinox (Ω): Sep 23. June solstice (E): greatest northern declination +23°26′, Jun 22. December solstice (E′): −23°26′, Dec 22.')]
];
const QZ=[
 [X('Oddiy ko‘z bilan osmonning yarim sferasida nechta yulduz ko‘rinadi?','Сколько звёзд видно глазом на полусфере неба?','How many stars can the naked eye see on half the sky?'),[X('3000 dan ortmaydi','Не более 3000','No more than 3,000'),X('30 000 ga yaqin','Около 30 000','About 30,000'),X('Millionlab','Миллионы','Millions')]],
 [X('Osmon sferasi nechta yulduz turkumiga bo‘lingan?','На сколько созвездий разделена небесная сфера?','How many constellations is the sky divided into?'),[X('88','88','88'),X('12','12','12'),X('48','48','48')]],
 [X('Yulduzlar har soatda qancha siljiydi?','На сколько смещаются звёзды за час?','How far do the stars shift each hour?'),[X('15°','15°','15°'),X('1°','1°','1°'),X('13°','13°','13°')]],
 [X('Oy yulduzlar fonida har sutkada qancha siljiydi?','На сколько смещается Луна среди звёзд за сутки?','How far does the Moon move among the stars per day?'),[X('≈ 13°','≈ 13°','≈ 13°'),X('≈ 1°','≈ 1°','≈ 1°'),X('15°','15°','15°')]],
 [X('Ekliptikaning osmon ekvatoriga og‘maligi qancha?','Каков наклон эклиптики к небесному экватору?','What is the tilt of the ecliptic to the equator?'),[X('23°26′','23°26′','23°26′'),X('41°18′','41°18′','41°18′'),X('66°34′','66°34′','66°34′')]],
 [X('Quyosh bahorgi tengkunlik nuqtasidan qachon o‘tadi?','Когда Солнце проходит точку весеннего равноденствия?','When does the Sun pass the March equinox point?'),[X('21-mart','21 марта','March 21'),X('22-iyun','22 июня','June 22'),X('23-sentabr','23 сентября','September 23')]],
 [X('Zenitga diametral qarama-qarshi nuqta qanday ataladi?','Как называется точка, диаметрально противоположная зениту?','What is the point opposite the zenith called?'),[X('Nadir','Надир','Nadir'),X('Olam qutbi','Полюс мира','Celestial pole'),X('Janub nuqtasi','Точка юга','South point')]],
 [X('Yulduzlarning sutkalik ko‘rinma aylanishiga nima sabab?','Чем вызвано суточное видимое вращение звёзд?','What causes the daily apparent rotation of the stars?'),[X('Yerning o‘z o‘qi atrofida aylanishi','Вращение Земли вокруг оси','Earth spinning on its axis'),X('Yerning Quyosh atrofida aylanishi','Обращение Земли вокруг Солнца','Earth orbiting the Sun'),X('Yulduzlarning Yer atrofida aylanishi','Обращение звёзд вокруг Земли','Stars orbiting the Earth')]],
 [X('Parijdagi Fuko mayatnigining uzunligi qancha?','Какова длина маятника Фуко в Париже?','How long is the Foucault pendulum in Paris?'),[X('60 m','60 м','60 m'),X('6 m','6 м','6 m'),X('600 m','600 м','600 m')]]
];

function stage(host,T,lam){
  const cv=host.querySelector('canvas'), lb=host.querySelector('.t1-lbls');
  if(!window.THREE||!THREE.OrbitControls){ host.classList.add('t1-no3d'); return {destroy(){},lat(){},focus(){},play(){},speed(){}}; }
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:true}); R.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1)); R.setClearColor(0x070a1c,1);
  const S=new THREE.Scene(), cam=new THREE.PerspectiveCamera(40,1,0.1,200); cam.position.set(9.5,5.2,10.5);
  const ctl=new THREE.OrbitControls(cam,cv); ctl.enableDamping=true; ctl.enablePan=false; ctl.minDistance=7; ctl.maxDistance=26; ctl.target.set(0,.4,0);
  const RS=5, V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(RS,48,32),new THREE.MeshBasicMaterial({color:0x4ea8ff,transparent:true,opacity:.06,side:THREE.BackSide,depthWrite:false})); S.add(shell);
  const ground=new THREE.Mesh(new THREE.CircleGeometry(RS,72),new THREE.MeshBasicMaterial({color:0x173a2a,transparent:true,opacity:.62,side:THREE.DoubleSide,depthWrite:false})); ground.rotation.x=-Math.PI/2; ground.renderOrder=2; S.add(ground);
  const man=new THREE.Group(); const mm=new THREE.MeshBasicMaterial({color:0xe8edff}); const body=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,.42,10),mm); body.position.y=.21; const head=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),mm); head.position.y=.5; man.add(body,head); S.add(man);
  const FIX=new THREE.Group(), SKY=new THREE.Group(); S.add(FIX,SKY);
  let mats={}, labs=[], phi=41.3, theta=0, run=true, spd=1, alive=true, raf=0, last=performance.now(), seen=true, focusK='';
  const vio=new IntersectionObserver(es=>{ seen=es[0].isIntersecting; }); vio.observe(host);
  const col=k=>new THREE.Color(EL.find(e=>e[0]===k)[1]);
  const mkLine=(pts,k,op,loop)=>{ const m=new THREE.LineBasicMaterial({color:col(k),transparent:true,opacity:op}); m.userData.b=op; (mats[k]=mats[k]||[]).push(m); const g=new THREE.BufferGeometry().setFromPoints(pts); return loop?new THREE.LineLoop(g,m):new THREE.Line(g,m); };
  const ring=(c,a,b,r,k,op)=>{ const p=[]; for(let i=0;i<160;i++){ const t=i/160*TAU; p.push(c.clone().addScaledVector(a,r*Math.cos(t)).addScaledVector(b,r*Math.sin(t))); } return mkLine(p,k,op,true); };
  const dotM=(k,r)=>{ const m=new THREE.MeshBasicMaterial({color:col(k),transparent:true,opacity:1}); m.userData.b=1; (mats[k]=mats[k]||[]).push(m); return new THREE.Mesh(new THREE.SphereGeometry(r||.08,12,8),m); };
  const label=(parent,pos,text,k)=>{ const o=new THREE.Object3D(); o.position.copy(pos); parent.add(o); const d=document.createElement('div'); d.className='t1-lbl t2-lbl'; d.innerHTML=text; d.style.color=EL.find(e=>e[0]===k)[1]; lb.appendChild(d); labs.push([d,o,k]); };
  const disposeG=g=>{ g.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); while(g.children.length) g.remove(g.children[0]); };
  // yulduzlar (osmon bilan aylanadi)
  const N=320, sp=new Float32Array(N*3); { let s=11; const rnd=()=>(s=(s*16807)%2147483647)/2147483647; for(let i=0;i<N;i++){ const u=rnd()*2-1, a=rnd()*TAU, q=Math.sqrt(1-u*u); sp[i*3]=RS*.995*q*Math.cos(a); sp[i*3+1]=RS*.995*u; sp[i*3+2]=RS*.995*q*Math.sin(a); } }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3)); const stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xdfe6ff,size:.07,transparent:true,opacity:.9})); S.add(stars);
  const sunM=new THREE.Mesh(new THREE.SphereGeometry(.2,16,12),new THREE.MeshBasicMaterial({color:0xffd060}));
  function build(){
    SKY.remove(sunM); disposeG(FIX); disposeG(SKY); mats={}; labs.forEach(l=>l[0].remove()); labs=[];
    const s=Math.sin(phi*D2R), c=Math.cos(phi*D2R), p=V(0,s,-c), u=V(1,0,0), w=V(0,c,s), e2=V(0,-c,-s), O=V(0,0,0);
    FIX.add(mkLine([V(0,RS,0),V(0,-RS,0)],'zen',.9)); const z1=dotM('zen'); z1.position.set(0,RS,0); const z2=dotM('zen'); z2.position.set(0,-RS,0); FIX.add(z1,z2);
    label(FIX,V(0,RS+.35,0),'Z','zen'); label(FIX,V(0,-RS-.35,0),'Z′','zen');
    FIX.add(ring(O,V(1,0,0),V(0,0,1),RS,'hor',.95)); mats.hor.push(ground.material); ground.material.userData.b=.62;
    [['N',V(0,0,-RS)],['S',V(0,0,RS)],['E',V(RS,0,0)],['W',V(-RS,0,0)]].forEach(([n,v])=>{ const d=dotM('hor',.09); d.position.copy(v); FIX.add(d); label(FIX,v.clone().multiplyScalar(1.08),n,'hor'); });
    FIX.add(ring(O,V(1,0,0),V(0,1,0),RS,'vert',.5));
    FIX.add(mkLine([p.clone().multiplyScalar(RS*1.12),p.clone().multiplyScalar(-RS*1.12)],'axis',.95)); const P1=dotM('axis',.1); P1.position.copy(p).multiplyScalar(RS); const P2=dotM('axis',.1); P2.position.copy(p).multiplyScalar(-RS); FIX.add(P1,P2);
    label(FIX,p.clone().multiplyScalar(RS*1.18),'P','axis'); label(FIX,p.clone().multiplyScalar(-RS*1.18),'P′','axis');
    FIX.add(ring(O,u,w,RS,'eq',.95)); label(FIX,w.clone().multiplyScalar(RS*1.08),'Q','eq'); label(FIX,w.clone().multiplyScalar(-RS*1.08),'Q′','eq');
    FIX.add(ring(O,V(0,1,0),V(0,0,1),RS,'mer',.8));
    [62,18].forEach(dc=>{ const r=RS*Math.cos(dc*D2R), cc=p.clone().multiplyScalar(RS*Math.sin(dc*D2R)); FIX.add(ring(cc,u,w,r,'par',.85)); const st=dotM('par',.11); st.position.copy(cc).addScaledVector(u,r); SKY.add(st); });
    const ep=[]; const eps=EPS*D2R, ev=lm=>u.clone().multiplyScalar(Math.cos(lm)).addScaledVector(e2,Math.sin(lm)*Math.cos(eps)).addScaledVector(p,Math.sin(lm)*Math.sin(eps)).multiplyScalar(RS);
    for(let i=0;i<160;i++) ep.push(ev(i/160*TAU)); SKY.add(mkLine(ep,'ecl',.95,true));
    [[0,'^'],[90,'E'],[180,'Ω'],[270,'E′']].forEach(([a,n])=>{ const d=dotM('ecl',.09); d.position.copy(ev(a*D2R)); SKY.add(d); label(SKY,ev(a*D2R).multiplyScalar(1.09),n,'ecl'); });
    sunM.position.copy(ev(lam*D2R)); SKY.add(sunM); (mats.ecl).push(sunM.material); sunM.material.userData.b=1;
    stars.userData.p=p; applyFocus(); }
  function applyFocus(){ Object.keys(mats).forEach(k=>mats[k].forEach(m=>{ m.opacity=m.userData.b*(!focusK||focusK===k?1:.16); })); labs.forEach(([d,,k])=>d.style.opacity=!focusK||focusK===k?1:.25); }
  const q=new THREE.Quaternion(), v=new THREE.Vector3();
  function size(){ const w=host.clientWidth, h=host.clientHeight; if(!w||!h) return; const c=R.getSize(new THREE.Vector2()); if(c.x!==w||c.y!==h){ R.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix(); } }
  function frame(now){ if(!alive) return; raf=requestAnimationFrame(frame); const dt=Math.min(.05,(now-last)/1000); last=now; if(!seen||document.hidden) return;
    if(run) theta+=dt*spd*TAU/24; const p=stars.userData.p; q.setFromAxisAngle(p,-theta); SKY.quaternion.copy(q); stars.quaternion.copy(q);
    ctl.update(); size(); R.render(S,cam); const w=host.clientWidth, h=host.clientHeight;
    labs.forEach(([d,o])=>{ o.getWorldPosition(v); v.project(cam); const vis=v.z<1; d.style.display=vis?'':'none'; if(vis) d.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px) translate(-50%,-50%)`; }); }
  build(); raf=requestAnimationFrame(frame);
  return { lat(f){ phi=f; build(); }, focus(k){ focusK=k; applyFocus(); }, play(b){ run=b; }, speed(s){ spd=s; },
    destroy(){ alive=false; cancelAnimationFrame(raf); vio.disconnect(); disposeG(FIX); disposeG(SKY); [shell,ground,body,head].forEach(m=>{ m.geometry.dispose(); m.material.dispose(); }); sg.dispose(); stars.material.dispose(); sunM.geometry.dispose(); sunM.material.dispose(); ctl.dispose(); R.dispose(); try{ R.forceContextLoss(); }catch(e){} } };
}

function build(el, api){
  const {T,click}=api, L=api.L(), offs=[], rafs={};
  const fmtN=(n,d)=>{ const s=Number(n).toLocaleString('en-US',{maximumFractionDigits:d||0,minimumFractionDigits:d||0}); return L==='en'?s:s.replace(/,/g,'\u202f').replace('.',','); };
  const dms=x=>{ const s=x<0?'−':'+', a=Math.abs(x), d=Math.floor(a), m=Math.round((a-d)*60); return s+(m===60?d+1:d)+'°'+String(m===60?0:m).padStart(2,'0')+'′'; };
  const dLbl=doy=>{ const d=dateOf(doy), n=d.getUTCDate(), m=d.getUTCMonth(); return L==='uz'?n+'-'+MON.uz[m]:(L==='ru'?n+' '+MON.ru[m]:MON.en[m]+' '+n); };
  const C=()=>{ const s=getComputedStyle(el), g=k=>s.getPropertyValue(k).trim(); return {text:g('--text'),dim:g('--text-dim'),brd:g('--glass-brd'),neon:g('--neon'),neon2:g('--neon-2'),gold:g('--dz-gold'),chart:g('--dz-chart'),earth:g('--dz-earth'),day:!!el.closest('.dz-day')}; };
  const now=new Date(), todayDoy=Math.min(364,Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(now.getFullYear(),0,1))/86400000));
  const myLoc=window.LAB&&window.LAB.loc?window.LAB.loc():{lat:41.3}, myLat=+myLoc.lat||41.3, myName=window.LAB&&window.LAB.locName?window.LAB.locName(myLoc):T(TX.tash);
  const sec=(n,t,inner,id)=>`<section class="dz-sec"${id?` id="${id}"`:''}><div class="sec-title">${n} · ${T(t)}</div>${inner}</section>`;
  const latChips=(attr,list)=>list.map(([v,k])=>`<button class="lab-chip" data-${attr}="${v}">${T(TX[k])} ${fmtN(v,1).replace(/[.,]0$/,'')}°</button>`).join('');
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split">
    <div class="t1-stage" id="t2Stage"><canvas></canvas><div class="t1-lbls"></div>
      <div class="t1-bar"><button class="lab-chip" id="t2Play">⏸</button><button class="lab-chip on" data-sp="1">1×</button><button class="lab-chip" data-sp="4">4×</button></div><div class="t1-hint">${T(TX.drag)}</div></div>
    <div class="t1-side">
      <div class="t2-els"><button class="lab-chip on" data-f="">${T(TX.all)}</button>${EL.map(e=>`<button class="lab-chip" data-f="${e[0]}"><i class="t1-sw" style="background:${e[1]}"></i>${T(e[2])}</button>`).join('')}</div>
      <div class="dz-card t2-def" id="t2Def"></div>
      <label class="t1-ctl"><span>${T(TX.lat)}: <b id="t2LatV"></b></span><input type="range" class="lab-range" id="t2Lat" min="0" max="90" step="0.1" value="41.3"></label>
      <div class="lab-row" style="margin:0">${latChips('lt',[[0,'eqP'],[41.3,'tash'],[90,'pole']])}</div>
      <p class="t1-cap">${T(TX.polNote)}</p>
    </div></div>`,'t2Sph')}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv t2-photo" id="t2Trail"></canvas></div>
    <div class="t1-side">
      <label class="t1-ctl"><span>${T(TX.expo)}: <b id="t2HV"></b></span><input type="range" class="lab-range" id="t2H" min="0.5" max="12" step="0.5" value="6"></label>
      <div class="lab-row" style="margin:0">${latChips('tl',[[0,'eqP'],[41.3,'tash'],[90,'pole']])}<button class="lab-chip" id="t2Shoot">📷 ${T(TX.shoot)}</button></div>
      <div class="lab-kv" id="t2TKv"></div>
      <div class="t1-formula">${T(TX.rateT)}</div>
    </div></div>
    <div class="dz-card t2-move"><h4>${T(TX.moveT)}</h4><p class="t1-p">${T(TX.moveD)}</p>
      <div class="t2-bars"><div class="t2-bar"><span class="t2-bn">🌙 ${T(TX.moon)}</span><div class="t2-track"><i style="width:100%"></i></div><span class="t2-bd">${T(TX.moonD)}</span></div>
      <div class="t2-bar"><span class="t2-bn">☀ ${T(TX.sun)}</span><div class="t2-track"><i style="width:${100/13}%"></i></div><span class="t2-bd">${T(TX.sunD)}</span></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t2Map"></canvas>
      <div class="lab-row"><span class="t1-lab">${T(TX.time)}</span><input type="range" class="lab-range" id="t2MapT" min="0" max="24" step="0.25" value="0" style="flex:1"></div><p class="t1-cap">${T(TX.mapC)}</p></div>
    <div class="t1-side">
      <div class="t2-els"><button class="lab-chip t2-find" data-c="find">✦ ${T(TX.find)}</button>${CON.map(c=>`<button class="lab-chip" data-c="${c[0]}">${T(c[1])}</button>`).join('')}</div>
      <div class="t2-cats">${[['cat1','cat1L','🐻'],['cat2','cat2L','👑'],['cat3','cat3L','△']].map(([a,b,i])=>`<div class="dz-card"><div class="t2-ci">${i}</div><b>${T(TX[a])}</b><span>${T(TX[b])}</span></div>`).join('')}</div>
    </div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t2Fou"></canvas><div class="lab-row"><button class="lab-chip" id="t2FPlay">⏸</button><button class="lab-chip on" data-fs="2">1×</button><button class="lab-chip" data-fs="8">4×</button><button class="lab-chip" id="t2FRe">↺ ${T(TX.reset)}</button></div></div>
    <div class="t1-side">
      <div class="lab-row" style="margin:0">${latChips('fl',[[90,'pole'],[48.9,'paris'],[41.3,'tash'],[0,'eqP']])}</div>
      <div class="lab-kv" id="t2FKv"></div>
      <p class="t1-cap">${T(TX.fNote)}</p>
    </div></div>`)}
  ${sec('05',TX.s5,`<p class="t1-p">${T(TX.s5D)}</p>
    <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.date)}: <b id="t2DV"></b></span><input type="range" class="lab-range" id="t2Day" min="0" max="364" step="1" style="flex:1;min-width:160px"></div>
    <div class="lab-row" style="margin:0">${KEYD.map(([d,k,s])=>`<button class="lab-chip" data-d="${d}">${s} · ${T(TX[k])}</button>`).join('')}<button class="lab-chip" data-d="${todayDoy}">📍 ${T(TX.today)}</button></div>
    <div class="t1-two">
      <div class="dz-card t1-chart"><h4>${T(TX.decT)}</h4><canvas class="t1-cv" id="t2Dec"></canvas></div>
      <div class="dz-card t1-chart"><h4>${T(TX.zodT)}</h4><canvas class="t1-cv" id="t2Zod"></canvas><p class="t1-cap">${T(TX.zodC)}</p></div></div>
    <div class="lab-kv t2-kv5" id="t2SKv"></div>`)}
  ${sec('06',TX.s6,`<dl class="t1-gl">${GL.map(g=>`<div class="dz-card"><dt>${T(g[0])}</dt><dd>${T(g[1])}</dd></div>`).join('')}</dl>`)}
  ${sec('07',TX.s7,`<div class="t2-qa">${QA.map((q,i)=>`<div class="dz-card t2-qi"><div class="t2-qq"><span class="t2-qn">${i+1}</span><b>${T(q[0])}</b></div><div class="t2-ans" hidden>${T(q[1])}${q[2]?` <button class="lab-chip" data-go3d>↑ ${T(TX.go3d)}</button>`:''}</div><button class="lab-chip t2-tog" data-qa="${i}">${T(TX.show)}</button></div>`).join('')}</div>`)}
  ${sec('08',TX.s8,`<div class="dz-card t1-quiz" id="t2Quiz"></div>`)}`;
  const $=s=>el.querySelector(s), $$=s=>el.querySelectorAll(s);
  const fit=(cv,ratio,maxH)=>{ const w=Math.max(200,Math.round(cv.getBoundingClientRect().width||cv.parentElement.clientWidth)), h=Math.round(Math.min(maxH,w*ratio)); if(cv._w!==w||cv._h!==h){ cv.style.height=h+'px'; cv._x=api.hiDPI(cv,w,h); cv._w=w; cv._h=h; } const x=cv._x; x.globalAlpha=1; x.setLineDash([]); return {x,w,h}; };
  const anim=(key,ms,draw)=>{ cancelAnimationFrame(rafs[key]); const t0=performance.now(); const st=n=>{ const p=Math.min(1,(n-t0)/ms); draw(p); if(p<1) rafs[key]=requestAnimationFrame(st); }; rafs[key]=requestAnimationFrame(st); };
  const onChips=(attr,fn)=>$$(`[data-${attr}]`).forEach(b=>b.onclick=()=>{ click(730); fn(b.dataset[attr],b); });
  const mark=(attr,val)=>$$(`[data-${attr}]`).forEach(b=>b.classList.toggle('on',b.dataset[attr]===String(val)));

  /* 01 · Osmon sferasi */
  const st=stage($('#t2Stage'),T,sunLon(todayDoy)); offs.push(st.destroy);
  const setF=k=>{ mark('f',k); st.focus(k); const e=EL.find(x=>x[0]===k); $('#t2Def').innerHTML=e?`<h4 style="color:${e[1]}">${T(e[2])}</h4><p class="t1-p">${T(e[3])}</p>`:`<p class="t1-p">${T(TX.s1D)}</p>`; };
  onChips('f',k=>setF(k)); setF('');
  const setLat=f=>{ f=Math.max(0,Math.min(90,+f)); $('#t2Lat').value=f; $('#t2LatV').textContent=fmtN(f,1)+'°'; mark('lt',f); st.lat(f); };
  $('#t2Lat').oninput=e=>setLat(e.target.value); onChips('lt',v=>setLat(v)); setLat(41.3);
  let pl=true; $('#t2Play').onclick=()=>{ pl=!pl; st.play(pl); $('#t2Play').textContent=pl?'⏸':'▶'; click(700); };
  onChips('sp',(v,b)=>{ mark('sp',v); st.speed(+v); });

  /* 02 · Yulduz izlari */
  let tLat=41.3, tP=1; const TS=[]; { let s=5; const rnd=()=>(s=(s*16807)%2147483647)/2147483647; for(let i=0;i<190;i++) TS.push([100*Math.sqrt(rnd()),rnd()*TAU,rnd(),rnd()]); }
  function drawTrail(){ const cv=$('#t2Trail'); const {x,w,h}=fit(cv,.72,420); const H=+$('#t2H').value*tP, hy=h-44, k=(hy-24)/Math.max(56,tLat+10), px=w/2, py=hy-tLat*k;
    const g=x.createLinearGradient(0,0,0,hy); g.addColorStop(0,'#03050f'); g.addColorStop(1,'#0c1636'); x.fillStyle=g; x.fillRect(0,0,w,h);
    const da=H*15*D2R; x.lineCap='round';
    TS.forEach(([rho,a0,m,c])=>{ const r=rho*k; if(r<1) return; x.strokeStyle=c<.2?'rgba(255,206,150,':c<.4?'rgba(170,200,255,':'rgba(232,238,255,'; x.strokeStyle+=(.35+m*.55)+')'; x.lineWidth=.6+m*1.4;
      x.beginPath(); if(da>0.002) x.arc(px,py,r,a0,a0-da,true); else { x.arc(px+r*Math.cos(a0),py+r*Math.sin(a0),.8+m,0,TAU); } x.stroke(); });
    x.fillStyle='#fff'; x.beginPath(); x.arc(px,py,2.6,0,TAU); x.fill();
    x.fillStyle='#04060c'; x.beginPath(); x.moveTo(0,hy); for(let i=0;i<=24;i++){ const xx=i/24*w; x.lineTo(xx,hy-6-7*Math.abs(Math.sin(i*1.7))-(i%5===0?6:0)); } x.lineTo(w,h); x.lineTo(0,h); x.fill();
    x.font='600 12px system-ui,sans-serif'; x.textAlign='center'; x.fillStyle='#c9d3f5'; x.fillText('N · '+T(TX.north),px,h-16);
    if(py>16) { x.textAlign='left'; x.fillText('✦ '+T(TX.polaris),px+8,py-8); }
    $('#t2HV').textContent=fmtN(+$('#t2H').value,1)+' '+T(TX.h);
    $('#t2TKv').innerHTML=`<div><div class="k">${T(TX.turn)}</div><div class="v">${fmtN(+$('#t2H').value,1)} × 15° = ${fmtN(+$('#t2H').value*15)}°</div></div><div><div class="k">${T(TX.circ)}</div><div class="v">δ > ${fmtN(90-tLat,1)}°</div></div>`; }
  const shoot=()=>anim('trail',2400,p=>{ tP=p; drawTrail(); });
  $('#t2H').oninput=()=>{ tP=1; drawTrail(); }; $('#t2Shoot').onclick=()=>{ click(760); shoot(); };
  onChips('tl',v=>{ tLat=+v; mark('tl',v); tP=1; drawTrail(); }); mark('tl',41.3);

  /* 03 · Yulduz xaritasi */
  let cSel='find'; const BG=[]; { let s=23; const rnd=()=>(s=(s*16807)%2147483647)/2147483647; for(let i=0;i<260;i++) BG.push([rnd()*24,90-Math.acos(rnd())/D2R,rnd()]); }
  function drawMap(){ const cv=$('#t2Map'); const {x,w,h}=fit(cv,1,460), c=C(); x.clearRect(0,0,w,h);
    const cx=w/2, cy=h/2, Rm=Math.min(w,h)/2-18, rot=+$('#t2MapT').value/24*TAU;
    const P=(ra,dec)=>{ const r=(90-dec)/90*Rm, a=ra/24*TAU-rot+Math.PI/2; return [cx+r*Math.cos(a),cy+r*Math.sin(a)]; };
    x.strokeStyle=c.brd; x.lineWidth=1; [30,60,90].forEach(d=>{ x.beginPath(); x.arc(cx,cy,d/90*Rm,0,TAU); x.stroke(); });
    for(let i=0;i<12;i++){ const a=i/12*TAU-rot+Math.PI/2; x.beginPath(); x.moveTo(cx+Rm/6*Math.cos(a),cy+Rm/6*Math.sin(a)); x.lineTo(cx+Rm*Math.cos(a),cy+Rm*Math.sin(a)); x.stroke(); }
    x.font='10px system-ui,sans-serif'; x.fillStyle=c.dim; x.textAlign='center'; [60,30].forEach(d=>x.fillText('+'+d+'°',cx+3,cy-(90-d)/90*Rm-3));
    BG.forEach(([ra,dec,m])=>{ const [X0,Y0]=P(ra,dec); x.globalAlpha=.2+m*.35; x.fillStyle=c.dim; x.beginPath(); x.arc(X0,Y0,.5+m*.9,0,TAU); x.fill(); }); x.globalAlpha=1;
    CON.forEach(([id,nm,lines])=>{ const on=cSel===id||(cSel==='find'&&(id==='uma'||id==='umi')); x.strokeStyle=on?c.neon:c.dim; x.globalAlpha=on?1:.45; x.lineWidth=on?2:1;
      lines.forEach(seq=>{ x.beginPath(); seq.forEach((s,i)=>{ const [X0,Y0]=P(ST[s][0],ST[s][1]); i?x.lineTo(X0,Y0):x.moveTo(X0,Y0); }); x.stroke(); });
      const ids=[...new Set(lines.flat())]; let mx=0,my=0; ids.forEach(s=>{ const [X0,Y0]=P(ST[s][0],ST[s][1]); mx+=X0; my+=Y0; x.fillStyle=c.text; x.beginPath(); x.arc(X0,Y0,Math.max(1.3,4.6-ST[s][2]),0,TAU); x.fill(); });
      x.globalAlpha=on?1:.6; x.font=(on?'700 ':'')+'12px system-ui,sans-serif'; x.fillStyle=on?c.neon:c.dim; x.fillText(T(nm),mx/ids.length,my/ids.length+(id==='umi'?26:-14)); });
    x.globalAlpha=1;
    if(cSel==='find'){ const a=P(ST.merak[0],ST.merak[1]), b=P(ST.dubhe[0],ST.dubhe[1]), p=P(ST.polaris[0],ST.polaris[1]);
      x.strokeStyle=c.gold; x.lineWidth=1.6; x.setLineDash([6,5]); x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(p[0],p[1]); x.stroke(); x.setLineDash([]);
      x.fillStyle=c.gold; x.beginPath(); x.arc(p[0],p[1],5.5,0,TAU); x.fill(); x.font='700 12px system-ui,sans-serif'; x.textAlign='left'; x.fillText(T(TX.polaris),p[0]+9,p[1]+4);
      [a,b].forEach(q=>{ x.strokeStyle=c.gold; x.lineWidth=1.5; x.beginPath(); x.arc(q[0],q[1],7,0,TAU); x.stroke(); }); } }
  $('#t2MapT').oninput=drawMap; onChips('c',v=>{ cSel=v; mark('c',v); drawMap(); }); mark('c','find');

  /* 04 · Fuko */
  let fLat=90, fH=0, fRun=true, fSpd=2, fPh=0, fTr=[], fLast=performance.now(), fSeen=false, fAlive=true;
  function drawFou(){ const cv=$('#t2Fou'); const {x,w,h}=fit(cv,.78,400), c=C(); x.clearRect(0,0,w,h);
    const cx=w/2, cy=h/2, R=Math.min(w,h)/2-22, ang=15*Math.sin(fLat*D2R)*fH*D2R;
    x.fillStyle=c.day?'#e3d9c3':'#121a33'; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.fill(); x.strokeStyle=c.brd; x.lineWidth=1.5; x.stroke();
    x.strokeStyle=c.dim; x.lineWidth=1; for(let i=0;i<72;i++){ const a=i/72*TAU, l=i%6?5:11; x.beginPath(); x.moveTo(cx+(R-l)*Math.cos(a),cy+(R-l)*Math.sin(a)); x.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a)); x.stroke(); }
    x.strokeStyle=c.day?'rgba(140,96,30,.22)':'rgba(255,205,120,.16)'; x.lineWidth=2.2;
    fTr.forEach(a=>{ x.beginPath(); x.moveTo(cx-(R-14)*Math.cos(a),cy-(R-14)*Math.sin(a)); x.lineTo(cx+(R-14)*Math.cos(a),cy+(R-14)*Math.sin(a)); x.stroke(); });
    x.strokeStyle=c.neon2; x.lineWidth=1.2; x.setLineDash([4,4]); x.beginPath(); x.moveTo(cx-(R-14),cy); x.lineTo(cx+(R-14),cy); x.stroke(); x.setLineDash([]);
    x.strokeStyle=c.gold; x.lineWidth=2.4; x.beginPath(); x.moveTo(cx-(R-14)*Math.cos(ang),cy-(R-14)*Math.sin(ang)); x.lineTo(cx+(R-14)*Math.cos(ang),cy+(R-14)*Math.sin(ang)); x.stroke();
    const b=Math.cos(fPh)*(R-20); const bx=cx+b*Math.cos(ang), by=cy+b*Math.sin(ang);
    x.strokeStyle=c.dim; x.lineWidth=1; x.beginPath(); x.moveTo(cx,cy); x.lineTo(bx,by); x.stroke();
    x.fillStyle=c.text; x.beginPath(); x.arc(cx,cy,3,0,TAU); x.fill(); x.fillStyle=c.gold; x.beginPath(); x.arc(bx,by,9,0,TAU); x.fill(); x.strokeStyle=c.text; x.lineWidth=1.5; x.stroke();
    if(Math.abs(ang)>.05){ x.strokeStyle=c.neon2; x.lineWidth=1.6; x.beginPath(); x.arc(cx,cy,34,0,Math.min(ang,TAU)); x.stroke(); }
    const per=fLat<.5?null:24/Math.sin(fLat*D2R), deg=15*Math.sin(fLat*D2R)*fH;
    const hh=Math.floor(fH), mi=Math.floor((fH-hh)*60);
    $('#t2FKv').innerHTML=`<div><div class="k">${T(TX.elapsed)}</div><div class="v">${hh} ${T(TX.h)} ${String(mi).padStart(2,'0')}′</div></div><div><div class="k">${T(TX.rot)}</div><div class="v">${fmtN(deg,1)}°</div></div><div style="grid-column:1/-1"><div class="k">${T(TX.per)} = 24 ${T(TX.h)} / sin φ</div><div class="v">${per?fmtN(per,1)+' '+T(TX.h):'∞ — '+T(TX.never)}</div></div>`; }
  let fTick=0;
  function fFrame(n){ if(!fAlive) return; rafs.fou=requestAnimationFrame(fFrame); const dt=Math.min(.05,(n-fLast)/1000); fLast=n; if(!fSeen||document.hidden) return;
    if(fRun){ fH+=dt*fSpd; fPh+=dt*TAU*.7; fTick+=dt*fSpd; if(fTick>.12){ fTick=0; fTr.push(15*Math.sin(fLat*D2R)*fH*D2R); if(fTr.length>420) fTr.shift(); } if(fH>48){ fH=0; fTr=[]; } drawFou(); } }
  const fReset=()=>{ fH=0; fTr=[]; fPh=0; drawFou(); };
  onChips('fl',v=>{ fLat=+v; mark('fl',v); fReset(); }); mark('fl',90);
  onChips('fs',v=>{ fSpd=+v; mark('fs',v); });
  $('#t2FPlay').onclick=()=>{ fRun=!fRun; $('#t2FPlay').textContent=fRun?'⏸':'▶'; click(700); }; $('#t2FRe').onclick=()=>{ click(720); fReset(); };
  offs.push(()=>{ fAlive=false; });

  /* 05 · Ekliptika */
  let day=todayDoy;
  const DEC=[]; for(let i=0;i<=364;i++) DEC.push(sunDec(i));
  function drawDec(){ const cv=$('#t2Dec'); const {x,w,h}=fit(cv,.62,320), c=C(); x.clearRect(0,0,w,h);
    const pl=38, pr=12, pt=14, pb=26, X0=d=>pl+d/364*(w-pl-pr), Y0=v=>pt+(30-v)/60*(h-pt-pb);
    x.font='10.5px system-ui,sans-serif'; x.fillStyle=c.dim; x.textAlign='right'; x.strokeStyle=c.brd; x.lineWidth=1;
    [[23.44,'+23°26′'],[0,'0°'],[-23.44,'−23°26′']].forEach(([v,s])=>{ x.setLineDash(v?[4,4]:[]); x.beginPath(); x.moveTo(pl,Y0(v)); x.lineTo(w-pr,Y0(v)); x.stroke(); x.fillText(s,pl-4,Y0(v)+3.5); }); x.setLineDash([]);
    x.textAlign='center'; for(let m=0;m<12;m++){ const d=(Date.UTC(YEAR,m,15)-Date.UTC(YEAR,0,1))/86400000; x.fillText(MONS[L][m],X0(d),h-8); }
    x.strokeStyle=c.gold; x.lineWidth=2.2; x.beginPath(); DEC.forEach((v,i)=>i?x.lineTo(X0(i),Y0(v)):x.moveTo(X0(i),Y0(v))); x.stroke();
    KEYD.forEach(([d,,s])=>{ x.fillStyle=c.chart; x.strokeStyle=c.text; x.lineWidth=1.2; x.beginPath(); x.arc(X0(d),Y0(DEC[d]),4,0,TAU); x.fill(); x.stroke(); x.fillStyle=c.text; x.font='700 11px system-ui,sans-serif'; x.fillText(s,X0(d),Y0(DEC[d])+(DEC[d]>10?-9:DEC[d]<-10?17:-9)); });
    x.strokeStyle=c.neon; x.lineWidth=1; x.beginPath(); x.moveTo(X0(day),pt); x.lineTo(X0(day),h-pb); x.stroke();
    x.fillStyle=c.neon; x.beginPath(); x.arc(X0(day),Y0(DEC[day]),6,0,TAU); x.fill(); }
  function drawZod(){ const cv=$('#t2Zod'); const {x,w,h}=fit(cv,.62,320), c=C(); x.clearRect(0,0,w,h);
    const cx=w/2, cy=h/2, r2=Math.min(w,h)/2-10, r1=r2*.68, A=l=>-l*D2R;
    ZOD.forEach(([s,nm,thin],i)=>{ const e=ZOD[(i+1)%ZOD.length][0], ee=e<s?e+360:e; x.fillStyle=i%2?c.day?'rgba(95,75,45,.08)':'rgba(255,255,255,.05)':c.day?'rgba(95,75,45,.15)':'rgba(255,255,255,.1)';
      x.beginPath(); x.arc(cx,cy,r2,A(s),A(ee),true); x.arc(cx,cy,r1,A(ee),A(s),false); x.closePath(); x.fill();
      const mid=(s+ee)/2, rr=(r1+r2)/2; x.save(); x.translate(cx+rr*Math.cos(A(mid)),cy+rr*Math.sin(A(mid))); x.font=(thin?'':'600 ')+(thin?'9px':'10.5px')+' system-ui,sans-serif'; x.fillStyle=thin?c.dim:c.text; x.textAlign='center'; x.fillText(T(nm),0,3.5); x.restore(); });
    x.strokeStyle=c.gold; x.lineWidth=1.4; x.beginPath(); x.arc(cx,cy,r1,0,TAU); x.stroke();
    [[0,'^'],[90,'E'],[180,'Ω'],[270,'E′']].forEach(([l,s])=>{ const a=A(l); x.fillStyle=c.gold; x.font='700 11px system-ui,sans-serif'; x.textAlign='center'; x.fillText(s,cx+(r1-12)*Math.cos(a),cy+(r1-12)*Math.sin(a)+4); });
    const lm=sunLon(day), a=A(lm), sx=cx+r1*Math.cos(a), sy=cy+r1*Math.sin(a);
    x.strokeStyle=c.neon; x.lineWidth=1.2; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+r2*Math.cos(a),cy+r2*Math.sin(a)); x.stroke();
    x.fillStyle='#3f7fe0'; x.beginPath(); x.arc(cx,cy,6,0,TAU); x.fill(); x.fillStyle=c.text; x.font='600 11px system-ui,sans-serif'; x.fillText(T(X('Yer','Земля','Earth')),cx,cy+19);
    const gl=x.createRadialGradient(sx,sy,0,sx,sy,16); gl.addColorStop(0,'rgba(255,200,80,.9)'); gl.addColorStop(1,'rgba(255,200,80,0)'); x.fillStyle=gl; x.beginPath(); x.arc(sx,sy,16,0,TAU); x.fill();
    x.fillStyle='#ffc34d'; x.beginPath(); x.arc(sx,sy,6.5,0,TAU); x.fill(); }
  const zodOf=lm=>{ if(lm>=ZOD[0][0]||lm<ZOD[1][0]) return ZOD[0]; let r=ZOD[1]; for(let i=1;i<ZOD.length;i++) if(ZOD[i][0]<=lm) r=ZOD[i]; return r; };
  function sunKv(){ const d=DEC[day], f=myLat, noon=90-Math.abs(f-d), ch=-Math.tan(f*D2R)*Math.tan(d*D2R);
    const dl=ch<=-1?24:ch>=1?0:2*Math.acos(ch)/D2R/15, ca=Math.sin(d*D2R)/Math.cos(f*D2R);
    let rise; if(ch<=-1) rise=T(TX.polD); else if(ch>=1) rise=T(TX.polN); else { const off=90-Math.acos(Math.max(-1,Math.min(1,ca)))/D2R; rise=Math.abs(off)<.5?T(TX.exE):fmtN(Math.abs(off),1)+'° '+T(TX.ofE)+' '+T(off>0?TX.toN:TX.toS); }
    const dh=Math.floor(dl), dm=Math.round((dl-dh)*60);
    const kv=(k,v)=>`<div><div class="k">${k}</div><div class="v">${v}</div></div>`;
    $('#t2SKv').innerHTML=kv(T(TX.dec),dms(d))+kv(T(TX.noon)+' · '+myName,noon>0?fmtN(noon,1)+'°':'—')+kv(T(TX.dayL),dh+' '+T(TX.h)+' '+String(dm===60?0:dm).padStart(2,'0')+'′')+kv(T(TX.rise),rise)+kv(T(TX.inC),T(zodOf(sunLon(day))[1]).replace('*','')); }
  const setDay=d=>{ day=Math.max(0,Math.min(364,+d)); $('#t2Day').value=day; $('#t2DV').textContent=dLbl(day); mark('d',day); drawDec(); drawZod(); sunKv(); };
  $('#t2Day').oninput=e=>setDay(e.target.value); onChips('d',v=>setDay(v));

  /* 07 · Savollar */
  $$('[data-qa]').forEach(b=>b.onclick=()=>{ click(720); const a=b.parentElement.querySelector('.t2-ans'); a.hidden=!a.hidden; b.textContent=T(a.hidden?TX.show:TX.hide); });
  $$('[data-go3d]').forEach(b=>b.onclick=()=>{ click(720); const m=el.closest('.dz-main'), s=$('#t2Sph'); if(m&&s) m.scrollTo({top:s.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop-12,behavior:'smooth'}); });

  /* 08 · Test */
  let qi=0, score=0, order=[];
  const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  function qStart(){ qi=0; score=0; order=shuffle(QZ.map((_,i)=>i)); qShow(); }
  function qShow(){ const box=$('#t2Quiz');
    if(qi>=order.length){ box.innerHTML=`<div class="t1-qend"><div class="t1-qsc">${score} / ${order.length}</div><p class="t1-p">${T(TX.qRes)}</p><button class="lab-chip on" id="t2QA">↻ ${T(TX.qAgain)}</button></div>`; $('#t2QA').onclick=()=>{ click(720); qStart(); }; return; }
    const q=QZ[order[qi]], opts=shuffle(q[1].map((o,i)=>[o,i]));
    box.innerHTML=`<div class="t1-qh"><span>${T(TX.qOf)} ${qi+1} / ${order.length}</span><span>${score} ✦</span></div><div class="t1-qbar"><i style="width:${qi/order.length*100}%"></i></div><h4>${T(q[0])}</h4>
      <div class="t1-opts">${opts.map(([o,i])=>`<button class="t1-opt" data-k="${i}">${T(o)}</button>`).join('')}</div><div class="t1-qn"></div>`;
    box.querySelectorAll('.t1-opt').forEach(b=>b.onclick=()=>{ const ok=b.dataset.k==='0'; if(ok) score++; click(ok?900:300);
      box.querySelectorAll('.t1-opt').forEach(x=>{ x.disabled=true; if(x.dataset.k==='0') x.classList.add('ok'); else if(x===b) x.classList.add('no'); });
      const n=box.querySelector('.t1-qn'); n.innerHTML=`<button class="lab-chip on">${T(qi===order.length-1?TX.qDone:TX.qNext)} →</button>`; n.firstChild.onclick=()=>{ click(720); qi++; qShow(); }; }); }
  qStart();

  const redraw=()=>{ drawTrail(); drawMap(); drawFou(); drawDec(); drawZod(); };
  api.onTheme(redraw);
  let rt=0; const onR=()=>{ clearTimeout(rt); rt=setTimeout(redraw,120); }; window.addEventListener('resize',onR); offs.push(()=>window.removeEventListener('resize',onR)); let rw=el.clientWidth; const ro=new ResizeObserver(()=>{ if(el.clientWidth!==rw){ rw=el.clientWidth; onR(); } }); ro.observe(el); offs.push(()=>ro.disconnect());
  setDay(todayDoy); redraw();
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.target.id==='t2Fou'){ fSeen=e.isIntersecting; return; } if(e.isIntersecting){ io.unobserve(e.target); shoot(); } }),{threshold:.3});
  io.observe($('#t2Trail')); io.observe($('#t2Fou')); offs.push(()=>io.disconnect());
  rafs.fou=requestAnimationFrame(fFrame);
  return ()=>{ offs.forEach(f=>{ try{ f(); }catch(e){} }); Object.values(rafs).forEach(cancelAnimationFrame); clearTimeout(rt); };
}

const add=()=>{ if(!window.DARSLIK) return setTimeout(add,50); window.DARSLIK.add({ id:'t02', GL, QZ, ico:'🌌', title:TX.title, sub:TX.sub, build }); };
add();
})();
