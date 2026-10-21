/* DARSLIK · 3-mavzu (6–8-§). Osmon koordinatalari. Yulduz xaritalari. Ko'rinma yulduz kattaliklari */
(function(){
const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const TX={
  title:X('Osmon koordinatalari. Yulduz xaritalari. Yulduz kattaliklari','Небесные координаты. Звёздные карты. Звёздные величины','Celestial coordinates. Star maps. Stellar magnitudes'),
  sub:X('6–8-§ · To‘g‘ri chiqish va og‘ish, soat burchagi, yulduz xaritasi, Pogson formulasi','§6–8 · Прямое восхождение и склонение, часовой угол, звёздная карта, формула Погсона','§6–8 · Right ascension and declination, hour angle, star maps, Pogson’s formula'),
  intro:X('Yer sirtidagi har bir joy ikki son — <b>geografik uzunlama λ</b> va <b>kenglama φ</b> bilan belgilanadi; hisob boshi — Grinvich meridianining ekvator bilan kesishgan nuqtasi. Osmonning <b>ekvatorial koordinatalar sistemasida</b> ham yoritgich o‘rni ikki son bilan beriladi: <b>to‘g‘ri chiqish α</b> va <b>og‘ish δ</b>. Bu yerda hisob boshi — ekliptika bilan osmon ekvatori kesishgan <b>bahorgi tengkunlik nuqtasi ^</b>.',
    'Каждое место на Земле задаётся двумя числами — <b>географической долготой λ</b> и <b>широтой φ</b>; начало отсчёта — точка пересечения Гринвичского меридиана с экватором. В <b>экваториальной системе</b> положение светила тоже задают два числа: <b>прямое восхождение α</b> и <b>склонение δ</b>. Начало отсчёта — точка пересечения эклиптики с экватором, <b>точка весеннего равноденствия ^</b>.',
    'Every place on Earth is fixed by two numbers — <b>longitude λ</b> and <b>latitude φ</b>, counted from where the Greenwich meridian meets the equator. In the <b>equatorial system</b> a star’s position is likewise two numbers: <b>right ascension α</b> and <b>declination δ</b>, counted from where the ecliptic meets the equator — the <b>March equinox point ^</b>.'),
  s1:X('Ekvatorial koordinatalar: α, δ va soat burchagi t','Экваториальные координаты: α, δ и часовой угол t','Equatorial coordinates: α, δ and hour angle t'),
  aD:X('<b>To‘g‘ri chiqish α</b> — ^ nuqtadan yoritgichning og‘ish aylanasi ekvatorni kesgan K nuqtagacha bo‘lgan yoy (^OK burchak). Osmonning sutkalik aylanishiga qarama-qarshi yo‘nalishda, 0ʰ dan 24ʰ gacha soat, minut, sekundlarda o‘lchanadi.','<b>Прямое восхождение α</b> — дуга от ^ до точки K, где круг склонения светила пересекает экватор (угол ^OK). Отсчитывается против суточного вращения неба, от 0ʰ до 24ʰ, в часах, минутах и секундах.','<b>Right ascension α</b> is the arc from ^ to point K, where the star’s hour circle meets the equator (angle ^OK). It is counted against the daily rotation, from 0ʰ to 24ʰ, in hours, minutes and seconds.'),
  dD:X('<b>Og‘ish δ</b> — K nuqtadan og‘ish aylanasi bo‘ylab yoritgichgacha bo‘lgan yoy (KOM burchak). Gradus, minut, sekundlarda 0° dan ±90° gacha o‘lchanadi; minus — osmonning janubiy yarimsharidagi yoritgichlar uchun.','<b>Склонение δ</b> — дуга от K вдоль круга склонения до светила (угол KOM). Измеряется в градусах, минутах и секундах от 0° до ±90°; минус — для светил южного полушария неба.','<b>Declination δ</b> is the arc from K along the hour circle to the star (angle KOM), from 0° to ±90° in degrees, minutes and seconds; minus for stars in the southern sky.'),
  tD:X('<b>Soat burchagi t</b> — osmon meridianining janubiy qismi ekvatorni kesgan Q nuqtadan K gacha bo‘lgan yoy (QOK burchak). 0ʰ dan ±12ʰ gacha (yoki 0ʰ–24ʰ) o‘lchanadi. Osmon aylangani sari t o‘zgaradi, α va δ esa o‘zgarmaydi.','<b>Часовой угол t</b> — дуга от точки Q, где южная часть небесного меридиана пересекает экватор, до K (угол QOK). Измеряется от 0ʰ до ±12ʰ (или 0ʰ–24ʰ). При вращении неба t меняется, а α и δ — нет.','<b>Hour angle t</b> is the arc from Q, where the southern meridian meets the equator, to K (angle QOK), from 0ʰ to ±12ʰ (or 0ʰ–24ʰ). As the sky turns, t changes while α and δ stay fixed.'),
  ra:X('To‘g‘ri chiqish α','Прямое восхождение α','Right ascension α'), de:X('Og‘ish δ','Склонение δ','Declination δ'), sid:X('Osmon aylanishi (yulduz vaqti)','Поворот неба (звёздное время)','Sky rotation (sidereal time)'),
  ha:X('Soat burchagi t','Часовой угол t','Hour angle t'), star:X('Yulduz','Звезда','Star'),
  tabT:X('1-jadval · Yoy va vaqt o‘lchamlari','Таблица 1 · Дуговая и временная меры','Table 1 · Arc and time units'), arcU:X('Yoy o‘lchamida','В дуговой мере','In arc'), timeU:X('Vaqt o‘lchamida','Во временной мере','In time'),
  s2:X('Yulduz xaritasi','Звёздная карта','A star map'),
  s2D:X('Yulduz xaritasida α va δ o‘zaro perpendikular o‘qlarda beriladi. Vertikal chiziqlar — og‘ish aylanalari yoylari, gorizontal chiziqlar — sutkalik parallellar yoylari. Yulduzni bosing: undan α o‘qiga va δ o‘qiga chiziq tushadi. Kitobdagi M yulduz — Savr turkumidagi Aldebaran: α ≈ 4ʰ35ᵐ, δ ≈ +16°.',
    'На звёздной карте α и δ отложены по взаимно перпендикулярным осям. Вертикальные линии — дуги кругов склонения, горизонтальные — дуги суточных параллелей. Нажмите на звезду: от неё пройдут линии к осям α и δ. Звезда M из учебника — Альдебаран в Тельце: α ≈ 4ʰ35ᵐ, δ ≈ +16°.',
    'On a star map α and δ run along perpendicular axes. Vertical lines are arcs of hour circles; horizontal lines are arcs of diurnal circles. Tap a star to drop lines to the α and δ axes. The book’s star M is Aldebaran in Taurus: α ≈ 4ʰ35ᵐ, δ ≈ +16°.'),
  eqL:X('Osmon ekvatori','Небесный экватор','Celestial equator'), eclL:X('Ekliptika','Эклиптика','Ecliptic'), con:X('Turkum','Созвездие','Constellation'),
  s3:X('Ko‘rinma yulduz kattaliklari','Видимые звёздные величины','Apparent magnitudes'),
  s3D:X('Yulduzlarning ko‘rinma ravshanligi lukslarda emas, nisbiy birlik — <b>yulduz kattaligi m</b> bilan ifodalanadi. Shkala …, −2ᵐ, −1ᵐ, 0ᵐ, 1ᵐ, 2ᵐ, … ko‘rinishida bo‘lib, m ortgan sayin yulduz xiralashadi. Uni mil. avv. II asrda Gipparx boshlagan. Ravshanliklari 100 marta farq qilgan ikki yulduzning kattaliklari farqi 5 ga teng deb qabul qilingan, demak 1 kattalik farqi <b>⁵√100 ≈ 2,512</b> martaga to‘g‘ri keladi.',
    'Видимый блеск звёзд выражают не в люксах, а в относительных единицах — <b>звёздных величинах m</b>. Шкала …, −2ᵐ, −1ᵐ, 0ᵐ, 1ᵐ, 2ᵐ, …: чем больше m, тем слабее звезда. Начало положил Гиппарх во II в. до н. э. Разность величин двух звёзд, блеск которых различается в 100 раз, принята равной 5, поэтому одна величина — это <b>⁵√100 ≈ 2,512</b> раза.',
    'A star’s apparent brightness is given not in lux but in a relative unit — the <b>magnitude m</b>. The scale runs …, −2ᵐ, −1ᵐ, 0ᵐ, 1ᵐ, 2ᵐ, …; the larger m, the fainter the star. Hipparchus began it in the 2nd century BC. A brightness ratio of 100 is set to 5 magnitudes, so one magnitude is <b>⁵√100 ≈ 2.512</b> times.'),
  scaleT:X('Yulduz kattaliklari shkalasi','Шкала звёздных величин','The magnitude scale'), eye:X('Oddiy ko‘z ko‘radi (≤ 6ᵐ)','Видно глазом (≤ 6ᵐ)','Naked eye (≤ 6ᵐ)'),
  stepT:X('Har bir kattalik — 2,512 marta xiraroq','Каждая величина — в 2,512 раза слабее','Each magnitude is 2.512× fainter'),
  pogT:X('Pogson formulasi: ikki yoritgichni solishtiring','Формула Погсона: сравните два светила','Pogson’s formula: compare two objects'),
  brighter:X('marta yorug‘roq','раз ярче','times brighter'), same:X('bir xil ravshan','одинаковый блеск','equally bright'),
  pogN:X('Odamning normal ko‘zi 6-kattalikkacha yulduzlarni ko‘radi. Hozirgi teleskoplar undan 100 mln marta xira (+24ᵐ, +25ᵐ) yulduzlarni ko‘ra oladi.','Нормальный глаз видит звёзды до 6-й величины. Современные телескопы видят в 100 млн раз более слабые (+24ᵐ, +25ᵐ).','The normal eye sees stars down to 6th magnitude; modern telescopes reach 100 million times fainter (+24ᵐ, +25ᵐ).'),
  tm:X('marta','раз','times')
};
const OBJ=[[-26.7,X('Quyosh','Солнце','Sun')],[-12.5,X('To‘lin Oy','Полная Луна','Full Moon')],[-4.4,X('Venera','Венера','Venus')],[-1.46,X('Sirius','Сириус','Sirius')],[0.04,X('Vega','Вега','Vega')],[2.0,X('Qutb yulduzi','Полярная','Polaris')],[6,X('Ko‘z chegarasi','Предел глаза','Eye limit')],[25,X('Teleskop chegarasi','Предел телескопа','Telescope limit')]];
const PRE=[[4.598,16.51,'Aldebaran'],[18.616,38.78,'Vega'],[6.752,-16.72,'Sirius'],[2.53,89.26,X('Qutb yulduzi','Полярная','Polaris')],[5.919,7.41,'Betelgeuse']];
// Xarita yulduzlari: [nom, α soat, δ°, m]
const MS={ ald:['Aldebaran',4.598,16.51,.85], eln:['Elnath',5.438,28.61,1.65], zTau:['ζ Tau',5.627,21.14,3], gTau:['γ Tau',4.33,15.63,3.65], dTau:['δ Tau',4.382,17.54,3.76], eTau:['ε Tau',4.477,19.18,3.53], thTau:['θ² Tau',4.478,15.87,3.4],
  alc:[X('Hulkar','Плеяды','Pleiades'),3.791,24.1,2.87], ham:['Hamal',2.12,23.46,2], she:['Sheratan',1.911,20.81,2.64], mes:['Mesarthim',1.892,19.29,3.9],
  bet:['Betelgeuse',5.919,7.41,.5], rig:['Rigel',5.242,-8.2,.13], bel:['Bellatrix',5.419,6.35,1.64], min:['Mintaka',5.533,-.3,2.23], aln:['Alnilam',5.604,-1.2,1.69], alt:['Alnitak',5.679,-1.94,1.77], sai:['Saiph',5.796,-9.67,2.09], mei:['Meissa',5.585,9.93,3.4],
  cas:['Castor',7.577,31.89,1.58], pol:['Pollux',7.755,28.03,1.14], alh:['Alhena',6.629,16.4,1.93], meb:['Mebsuta',6.732,25.13,3], tej:['Tejat',6.383,22.51,2.87], was:['Wasat',7.335,21.98,3.5],
  pro:['Procyon',7.655,5.22,.34], gom:['Gomeisa',7.453,8.29,2.9], sir:['Sirius',6.752,-16.72,-1.46], mir:['Mirzam',6.378,-17.96,1.98], adh:['Adhara',6.977,-28.97,1.5], wez:['Wezen',7.14,-26.39,1.83], alu:['Aludra',7.402,-29.3,2.45],
  bCnc:['Altarf',8.275,9.19,3.5], dCnc:['Asellus Australis',8.745,18.15,3.94], aCnc:['Acubens',8.975,11.86,4.25], iCnc:['ι Cnc',8.778,28.76,4],
  reg:['Regulus',10.14,11.97,1.35], mnk:['Menkar',3.038,4.09,2.5], dip:['Diphda',.727,-17.99,2.0] };
const MC=[[X('Savr','Телец','Taurus'),[['eln','eTau','dTau','gTau'],['gTau','thTau','ald','zTau']]],[X('Hamal','Овен','Aries'),[['ham','she','mes']]],
  [X('Orion','Орион','Orion'),[['bet','mei','bel'],['bet','alt','sai','rig','min','bel'],['min','aln','alt']]],[X('Javzo','Близнецы','Gemini'),[['cas','meb','tej'],['pol','was','alh'],['cas','pol']]],
  [X('Katta It','Большой Пёс','Canis Major'),[['sir','mir'],['sir','wez','adh'],['wez','alu']]],[X('Kichik It','Малый Пёс','Canis Minor'),[['pro','gom']]],[X('Saraton','Рак','Cancer'),[['aCnc','dCnc','iCnc'],['dCnc','bCnc']]],
  [X('Asad','Лев','Leo'),[['reg']]],[X('Kit','Кит','Cetus'),[['mnk'],['dip']]]];
const GL=[
 [X('Ekvatorial koordinatalar','Экваториальные координаты','Equatorial coordinates'),X('Yoritgich o‘rnini osmon ekvatori va bahorgi tengkunlik nuqtasiga nisbatan α va δ bilan beruvchi sistema.','Система, задающая положение светила числами α и δ относительно экватора и точки весеннего равноденствия.','A system giving a star’s place by α and δ relative to the equator and the March equinox point.')],
 [X('To‘g‘ri chiqish α','Прямое восхождение α','Right ascension α'),X('^ nuqtadan yoritgich og‘ish aylanasining ekvator bilan kesishgan nuqtasigacha yoy; 0ʰ–24ʰ.','Дуга от ^ до пересечения круга склонения светила с экватором; 0ʰ–24ʰ.','Arc from ^ to where the star’s hour circle crosses the equator; 0ʰ–24ʰ.')],
 [X('Og‘ish δ','Склонение δ','Declination δ'),X('Ekvatordan og‘ish aylanasi bo‘ylab yoritgichgacha yoy; 0° dan ±90° gacha.','Дуга от экватора по кругу склонения до светила; от 0° до ±90°.','Arc from the equator along the hour circle to the star; 0° to ±90°.')],
 [X('Soat burchagi t','Часовой угол t','Hour angle t'),X('Meridianning janubiy qismi ekvatorni kesgan Q nuqtadan K gacha yoy; 0ʰ dan ±12ʰ gacha.','Дуга от точки Q (юг меридиана на экваторе) до K; от 0ʰ до ±12ʰ.','Arc from Q (south meridian on the equator) to K; 0ʰ to ±12ʰ.')],
 [X('Yulduz xaritasi','Звёздная карта','Star map'),X('Yulduzlarning α va δ bo‘yicha tekislikdagi proyeksiyasi.','Проекция звёзд на плоскость по α и δ.','A flat projection of the stars by α and δ.')],
 [X('Yulduz kattaligi m','Звёздная величина m','Magnitude m'),X('Yoritgich ravshanligining nisbiy, logarifmik o‘lchovi; m ortgan sayin yoritgich xiralashadi.','Относительная логарифмическая мера блеска; чем больше m, тем слабее светило.','A relative, logarithmic measure of brightness; larger m means fainter.')],
 [X('Pogson formulasi','Формула Погсона','Pogson’s formula'),X('E₁/E₂ = 2,512^(m₂−m₁) yoki lg(E₁/E₂) = 0,4·(m₂−m₁).','E₁/E₂ = 2,512^(m₂−m₁) или lg(E₁/E₂) = 0,4·(m₂−m₁).','E₁/E₂ = 2.512^(m₂−m₁), or lg(E₁/E₂) = 0.4·(m₂−m₁).')]
];
const QA=[
 [X('Yulduzlar xaritasida vertikal chiziqlar osmon sferasidagi qanday aylanalarning yoylarini ifodalaydi? Gorizontal chiziqlar-chi?','Дуги каких кругов небесной сферы изображают вертикальные линии на звёздной карте? А горизонтальные?','What circles do the vertical lines on a star map show? And the horizontal ones?'),X('Vertikal chiziqlar — og‘ish aylanalari (α = const), gorizontal chiziqlar — sutkalik parallellar (δ = const).','Вертикальные — круги склонения (α = const), горизонтальные — суточные параллели (δ = const).','Vertical lines are hour circles (α = const); horizontal lines are diurnal circles (δ = const).')],
 [X('To‘g‘ri chiqish (α) va og‘ish (δ) qanday o‘lchanadi?','Как измеряются прямое восхождение (α) и склонение (δ)?','How are right ascension (α) and declination (δ) measured?'),X('α — ^ nuqtadan K gacha ekvator bo‘ylab, sutkalik aylanishga qarshi, 0ʰ–24ʰ. δ — K dan og‘ish aylanasi bo‘ylab yoritgichgacha, 0° dan ±90° gacha.','α — от ^ до K по экватору против суточного вращения, 0ʰ–24ʰ. δ — от K по кругу склонения до светила, от 0° до ±90°.','α runs from ^ to K along the equator against the daily rotation, 0ʰ–24ʰ. δ runs from K along the hour circle to the star, 0° to ±90°.')],
 [X('Yoritgichning soat burchagi (t) qanday koordinata va u qanday o‘lchanadi?','Что такое часовой угол (t) и как он измеряется?','What is the hour angle (t) and how is it measured?'),X('Q nuqtadan (meridianning janubiy qismi ekvatorni kesgan joy) K gacha yoy; soat, minut, sekundlarda 0ʰ dan ±12ʰ gacha. Osmon aylangani sari u o‘zgaradi.','Дуга от Q (юг меридиана на экваторе) до K в часах, минутах, секундах, от 0ʰ до ±12ʰ. Меняется при вращении неба.','The arc from Q (where the southern meridian meets the equator) to K, in hours, minutes and seconds, 0ʰ to ±12ʰ. It changes as the sky turns.')],
 [X('Yulduzlarning ko‘rinma kattaliklari va yoritilganliklari orasidagi munosabat qanday ataladi?','Как называется связь между видимыми величинами и освещённостями?','What is the relation between magnitudes and illuminance called?'),X('Pogson formulasi.','Формула Погсона.','Pogson’s formula.')],
 [X('Pogson formulasini tushuntiring.','Объясните формулу Погсона.','Explain Pogson’s formula.'),X('Ikki yulduzning yoritilganliklari nisbati E₁/E₂ = 2,512^(m₂−m₁). Logarifmlasak: lg(E₁/E₂) = 0,4·(m₂−m₁). Masalan, 5 kattalik farqi — 100 marta.','Отношение освещённостей двух звёзд E₁/E₂ = 2,512^(m₂−m₁); логарифмируя: lg(E₁/E₂) = 0,4·(m₂−m₁). Разность 5 величин — 100 раз.','The illuminance ratio is E₁/E₂ = 2.512^(m₂−m₁); taking logs, lg(E₁/E₂) = 0.4·(m₂−m₁). A 5-magnitude gap is 100×.')]
];
const QZ=[
 [X('Ekvatorial koordinatalarda hisob boshi qilib nima olinadi?','Что принято за начало отсчёта в экваториальных координатах?','What is the origin of equatorial coordinates?'),[X('Bahorgi tengkunlik nuqtasi ^','Точка весеннего равноденствия ^','The March equinox point ^'),X('Zenit','Зенит','The zenith'),X('Grinvich meridiani','Гринвичский меридиан','The Greenwich meridian')]],
 [X('To‘g‘ri chiqish α qanday chegarada o‘lchanadi?','В каких пределах измеряется α?','What range does α take?'),[X('0ʰ dan 24ʰ gacha','От 0ʰ до 24ʰ','0ʰ to 24ʰ'),X('0° dan ±90° gacha','От 0° до ±90°','0° to ±90°'),X('0ʰ dan ±12ʰ gacha','От 0ʰ до ±12ʰ','0ʰ to ±12ʰ')]],
 [X('Og‘ish δ qanday chegarada o‘lchanadi?','В каких пределах измеряется δ?','What range does δ take?'),[X('0° dan ±90° gacha','От 0° до ±90°','0° to ±90°'),X('0ʰ dan 24ʰ gacha','От 0ʰ до 24ʰ','0ʰ to 24ʰ'),X('0° dan 360° gacha','От 0° до 360°','0° to 360°')]],
 [X('Vaqt o‘lchamidagi 1ʰ yoy o‘lchamida nechaga teng?','Чему равен 1ʰ в дуговой мере?','What is 1ʰ in arc?'),[X('15°','15°','15°'),X('1°','1°','1°'),X('4°','4°','4°')]],
 [X('Yoy o‘lchamidagi 1° vaqt o‘lchamida nechaga teng?','Чему равен 1° во временной мере?','What is 1° in time?'),[X('4ᵐ','4ᵐ','4ᵐ'),X('1ʰ','1ʰ','1ʰ'),X('15ᵐ','15ᵐ','15ᵐ')]],
 [X('1 yulduz kattaligi farqi necha marta ravshanlik farqiga teng?','Скольким разам блеска соответствует разность в 1 величину?','A 1-magnitude difference equals what brightness ratio?'),[X('≈ 2,512','≈ 2,512','≈ 2.512'),X('10','10','10'),X('100','100','100')]],
 [X('Odamning normal ko‘zi necha kattalikkacha yulduzlarni ko‘radi?','До какой величины видит звёзды нормальный глаз?','Down to which magnitude does the normal eye see?'),[X('6ᵐ','6ᵐ','6ᵐ'),X('1ᵐ','1ᵐ','1ᵐ'),X('25ᵐ','25ᵐ','25ᵐ')]],
 [X('Qaysi yoritgich eng yorug‘?','Какое светило самое яркое?','Which is brightest?'),[X('Quyosh (−26,7ᵐ)','Солнце (−26,7ᵐ)','The Sun (−26.7ᵐ)'),X('Vega (+0,04ᵐ)','Вега (+0,04ᵐ)','Vega (+0.04ᵐ)'),X('Venera (−4,4ᵐ)','Венера (−4,4ᵐ)','Venus (−4.4ᵐ)')]],
 [X('Osmon aylangani sari qaysi koordinata o‘zgaradi?','Какая координата меняется при вращении неба?','Which coordinate changes as the sky turns?'),[X('Soat burchagi t','Часовой угол t','Hour angle t'),X('To‘g‘ri chiqish α','Прямое восхождение α','Right ascension α'),X('Og‘ish δ','Склонение δ','Declination δ')]]
];
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';

function build(el, api){
  const K=K0.kit(el,api), {T,L,click,$,$$,fmtN,dms,hm,C,fit,sec,chips,mark,on,kv}=K;
  const nm=n=>typeof n==='string'?n:T(n);
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<div class="t1-split">
    <div class="t1-stage" id="t3Stage"><canvas></canvas><div class="t1-lbls"></div>
      <div class="t1-bar"><button class="lab-chip" id="t3Play">▶</button></div><div class="t1-hint">${T(K.U.drag)}</div></div>
    <div class="t1-side">
      <div class="t2-els">${PRE.map((p,i)=>`<button class="lab-chip" data-pr="${i}">✦ ${nm(p[2])}</button>`).join('')}</div>
      <label class="t1-ctl"><span><i class="t1-sw" style="background:#ffc65c"></i>${T(TX.ra)}: <b id="t3AV"></b></span><input type="range" class="lab-range" id="t3A" min="0" max="23.95" step="0.0833"></label>
      <label class="t1-ctl"><span><i class="t1-sw" style="background:#c08bff"></i>${T(TX.de)}: <b id="t3DV"></b></span><input type="range" class="lab-range" id="t3D" min="-89" max="89" step="0.5"></label>
      <label class="t1-ctl"><span>${T(TX.sid)}: <b id="t3SV"></b></span><input type="range" class="lab-range" id="t3S" min="0" max="23.95" step="0.0833"></label>
      <div class="lab-kv" id="t3Kv"></div>
    </div></div>
    <div class="t3-defs"><div class="dz-card"><p class="t1-p">${T(TX.aD)}</p></div><div class="dz-card"><p class="t1-p">${T(TX.dD)}</p></div><div class="dz-card"><p class="t1-p">${T(TX.tD)}</p></div></div>
    <div class="dz-card t3-tabw"><h4>${T(TX.tabT)}</h4><table class="t3-tab"><tr><th>${T(TX.arcU)}</th><td>360°</td><td>15°</td><td>1°</td><td>15′</td><td>1′</td><td>15″</td></tr><tr><th>${T(TX.timeU)}</th><td>24ʰ</td><td>1ʰ</td><td>4ᵐ</td><td>1ᵐ</td><td>4ˢ</td><td>1ˢ</td></tr></table></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv t3-map" id="t3Map"></canvas><div class="lab-kv t2-kv5" id="t3MKv"></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p>
    <div class="dz-card t1-chart"><h4>${T(TX.scaleT)}</h4><canvas class="t1-cv" id="t3Scale"></canvas></div>
    <div class="t1-two">
      <div class="dz-card t1-chart"><h4>${T(TX.stepT)}</h4><canvas class="t1-cv t2-photo" id="t3Steps"></canvas></div>
      <div class="dz-card t1-chart"><h4>${T(TX.pogT)}</h4>
        <div class="t3-pog"><select class="lab-date" id="t3P1">${OBJ.map((o,i)=>`<option value="${i}"${i===4?' selected':''}>${T(o[1])} (${fmtN(o[0],2).replace(/[.,]?0+$/,'')}ᵐ)</option>`).join('')}</select><span>↔</span>
        <select class="lab-date" id="t3P2">${OBJ.map((o,i)=>`<option value="${i}"${i===6?' selected':''}>${T(o[1])} (${fmtN(o[0],2).replace(/[.,]?0+$/,'')}ᵐ)</option>`).join('')}</select></div>
        <div class="t1-formula">E₁ / E₂ = 2,512<sup>(m₂ − m₁)</sup> &nbsp;·&nbsp; lg(E₁/E₂) = 0,4·(m₂ − m₁)</div>
        <div class="lab-kv" id="t3PKv"></div><p class="t1-cap">${T(TX.pogN)}</p></div></div>`)}
  ${sec('04',K.U.gl,K.glHTML(GL))}
  ${sec('05',K.U.qa,K.qaHTML(QA))}
  ${sec('06',K.U.test,`<div class="dz-card t1-quiz" id="t3Quiz"></div>`)}`;

  /* 01 · 3D */
  let A=4.598, Dd=16.51, Sh=6.1, tObj=null, tLbl=null, tick=0;
  const thetaOf=s=>(s+6)*15*D2R;
  const st=K.stage($('#t3Stage'),{ run:false, theta:thetaOf(Sh), build(a){ const {V,RS,SKY,FIX,ring,tube,dot,label,line,arcPts,basis}=a, {p,u,w,e2}=basis(), O=V(0,0,0);
      const eps=K0.EPS*D2R, ev=lm=>u.clone().multiplyScalar(Math.cos(lm)).addScaledVector(e2,Math.sin(lm)*Math.cos(eps)).addScaledVector(p,Math.sin(lm)*Math.sin(eps)).multiplyScalar(RS);
      const ep=[]; for(let i=0;i<160;i++) ep.push(ev(i/160*TAU)); SKY.add(line(ep,'#ffb347',.45,true));
      const g=dot('#ffb347',.1); g.position.copy(u).multiplyScalar(RS); SKY.add(g); label(SKY,u.clone().multiplyScalar(RS*1.1),'^','#ffb347');
      const a1=A*15*D2R, d1=Dd*D2R, Kd=u.clone().multiplyScalar(Math.cos(a1)).addScaledVector(e2,Math.sin(a1)), M=Kd.clone().multiplyScalar(Math.cos(d1)).addScaledVector(p,Math.sin(d1));
      SKY.add(line(arcPts(O,p,Kd,RS,0,Math.PI,90),'#c08bff',.5));
      SKY.add(tube(arcPts(O,u,e2,RS,0,a1),'#ffc65c',.045));
      SKY.add(tube(arcPts(O,Kd,p,RS,0,d1),'#c08bff',.045));
      const kd=dot('#ffffff',.08); kd.position.copy(Kd).multiplyScalar(RS); SKY.add(kd); label(SKY,Kd.clone().multiplyScalar(RS*1.09),'K','#ffffff');
      const md=dot('#ffe9a8',.15); md.position.copy(M).multiplyScalar(RS); SKY.add(md); label(SKY,M.clone().multiplyScalar(RS*1.1),'M','#ffe9a8');
      if(a1>.15){ const mid=u.clone().multiplyScalar(Math.cos(a1/2)).addScaledVector(e2,Math.sin(a1/2)); label(SKY,mid.multiplyScalar(RS*.9),'α','#ffc65c','t3-gl'); }
      if(Math.abs(d1)>.15){ const mid=Kd.clone().multiplyScalar(Math.cos(d1/2)).addScaledVector(p,Math.sin(d1/2)); label(SKY,mid.multiplyScalar(RS*.9),'δ','#c08bff','t3-gl'); }
      tObj=null; tLbl=null; tArc(a); },
    frame(a,dt,run){ if(run){ tick+=dt; if(tick>.1){ tick=0; Sh=((st.theta()/D2R/15-6)%24+24)%24; $('#t3S').value=Sh; tArc(a); out(); } } } });
  function tArc(a){ if(!a) return; const {V,RS,FIX,tube,label,arcPts,basis,disposeG}=a, {u,w}=basis();
    if(tObj){ FIX.remove(tObj); tObj.geometry&&tObj.geometry.dispose(); tObj.material&&tObj.material.dispose(); tObj=null; } if(tLbl){ a.dropLabels([tLbl]); tLbl=null; }
    let t=((Sh-A)%24+24)%24; if(t>12) t-=24; const tr=t*15*D2R;
    if(Math.abs(tr)>.02){ tObj=tube(arcPts(V(0,0,0),w,u.clone().negate(),RS,0,tr),'#5fd39a',.05); FIX.add(tObj);
      const mid=w.clone().multiplyScalar(Math.cos(tr/2)).addScaledVector(u,-Math.sin(tr/2)); const ob=new a.THREE.Object3D(); tLbl=label(FIX,mid.multiplyScalar(RS*.86),'t','#5fd39a','t3-gl'); } }
  function out(){ let t=((Sh-A)%24+24)%24; if(t>12) t-=24;
    $('#t3AV').textContent=hm(A)+' = '+fmtN(A*15,1)+'°'; $('#t3DV').textContent=dms(Dd); $('#t3SV').textContent=hm(Sh);
    $('#t3Kv').innerHTML=kv(T(TX.ra),hm(A)+' · '+fmtN(A*15,1)+'°')+kv(T(TX.de),dms(Dd))+kv(T(TX.ha)+' = S − α',hm(t,true)+' · '+(t<0?'−':'+')+fmtN(Math.abs(t*15),1)+'°',true); }
  const setStar=(a,d)=>{ A=a; Dd=d; $('#t3A').value=a; $('#t3D').value=d; st.rebuild(); out(); };
  $('#t3A').oninput=e=>{ A=+e.target.value; mark('pr',''); st.rebuild(); out(); };
  $('#t3D').oninput=e=>{ Dd=+e.target.value; mark('pr',''); st.rebuild(); out(); };
  $('#t3S').oninput=e=>{ Sh=+e.target.value; st.setTheta(thetaOf(Sh)); tArc(st.api); out(); };
  on('pr',i=>{ const p=PRE[+i]; mark('pr',i); setStar(p[0],p[1]); });
  let pl=false; $('#t3Play').onclick=()=>{ pl=!pl; st.play(pl); $('#t3Play').textContent=pl?'⏸':'▶'; click(700); };
  $('#t3S').value=Sh; setStar(A,Dd); mark('pr',0);

  /* 02 · Xarita */
  let sel='ald', hit=[];
  const drawMap=K.draw(function(){ const cv=$('#t3Map'); const {x,w,h}=fit(cv,.56,480), c=C();
    const pl=16, pr=46, pt=16, pb=34, X0=a=>pl+(10-a)/10*(w-pl-pr), Y0=d=>pt+(45-d)/90*(h-pt-pb);
    x.lineWidth=1; x.strokeStyle=c.brd; x.font='10.5px system-ui,sans-serif'; x.fillStyle=c.dim;
    for(let a=0;a<=10;a++){ x.beginPath(); x.moveTo(X0(a),pt); x.lineTo(X0(a),h-pb); x.stroke(); if(a%2===0){ x.textAlign='center'; x.fillText(a+'ʰ',X0(a),h-pb+15); } }
    for(let d=-45;d<=45;d+=15){ x.beginPath(); x.moveTo(pl,Y0(d)); x.lineTo(w-pr,Y0(d)); x.stroke(); x.textAlign='left'; x.fillText((d>0?'+':d<0?'−':'')+Math.abs(d)+'°',w-pr+5,Y0(d)+3.5); }
    x.textAlign='right'; x.fillText('α ←',w-pr,h-6); x.textAlign='left'; x.fillText('δ ↑',w-pr+5,pt-4>8?pt-4:10);
    x.strokeStyle=c.neon; x.lineWidth=1.6; x.beginPath(); x.moveTo(pl,Y0(0)); x.lineTo(w-pr,Y0(0)); x.stroke();
    x.fillStyle=c.neon; x.font='600 10.5px system-ui,sans-serif'; x.textAlign='left'; x.fillText(T(TX.eqL),pl+4,Y0(0)-5);
    x.strokeStyle=c.gold; x.lineWidth=1.3; x.setLineDash([6,4]); x.beginPath(); let f=true;
    for(let l=0;l<=160;l+=1){ const lr=l*D2R, e=K0.EPS*D2R, a=((Math.atan2(Math.sin(lr)*Math.cos(e),Math.cos(lr))/D2R+360)%360)/15, d=Math.asin(Math.sin(e)*Math.sin(lr))/D2R; if(a>10){ break; } f?x.moveTo(X0(a),Y0(d)):x.lineTo(X0(a),Y0(d)); f=false; } x.stroke(); x.setLineDash([]);
    x.fillStyle=c.gold; x.fillText(T(TX.eclL),X0(8.6),Y0(21)-6);
    MC.forEach(([n,lines])=>{ x.strokeStyle=c.dim; x.globalAlpha=.55; x.lineWidth=1; lines.forEach(sq=>{ if(sq.length<2) return; x.beginPath(); sq.forEach((k,i)=>{ const s=MS[k]; i?x.lineTo(X0(s[1]),Y0(s[2])):x.moveTo(X0(s[1]),Y0(s[2])); }); x.stroke(); });
      x.globalAlpha=1; const ids=[...new Set(lines.flat())]; let mx=0,my=0; ids.forEach(k=>{ mx+=X0(MS[k][1]); my+=Y0(MS[k][2]); });
      x.font='italic 11px system-ui,sans-serif'; x.fillStyle=c.dim; x.textAlign='center'; x.fillText(T(n),mx/ids.length,my/ids.length+(ids.length>2?26:16)); });
    hit=[]; Object.keys(MS).forEach(k=>{ const s=MS[k], px=X0(s[1]), py=Y0(s[2]), r=Math.max(1.4,4.8-s[3]*.85); hit.push([k,px,py]);
      x.fillStyle=k===sel?c.neon2:c.text; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); });
    const s=MS[sel], px=X0(s[1]), py=Y0(s[2]);
    x.lineWidth=1.4; x.setLineDash([4,4]); x.strokeStyle=c.neon2; x.beginPath(); x.moveTo(px,py); x.lineTo(px,h-pb); x.stroke(); x.strokeStyle=c.gold; x.beginPath(); x.moveTo(px,py); x.lineTo(w-pr,py); x.stroke(); x.setLineDash([]);
    x.strokeStyle=c.neon2; x.lineWidth=2; x.beginPath(); x.arc(px,py,8,0,TAU); x.stroke();
    x.font='700 11px system-ui,sans-serif'; x.fillStyle=c.neon2; x.textAlign='center'; x.fillText(hm(s[1]),px,h-pb-5); x.fillStyle=c.gold; x.textAlign='right'; x.fillText(dms(s[2]),w-pr-4,py-5);
    x.fillStyle=c.text; x.textAlign='left'; x.fillText(nm(s[0])+(sel==='ald'?' (M)':''),px+11,py-9);
    const con=MC.find(m=>m[1].flat().includes(sel));
    $('#t3MKv').innerHTML=kv(T(TX.star),nm(s[0]))+kv(T(TX.ra),hm(s[1]))+kv(T(TX.de),dms(s[2]))+kv(T(TX.con),con?T(con[0]):'—')+kv('m',fmtN(s[3],2)+'ᵐ'); });
  const mapCv=$('#t3Map'), pick=e=>{ const r=mapCv.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top; let b=null, bd=20; hit.forEach(([k,px,py])=>{ const d=Math.hypot(px-mx,py-my); if(d<bd){ bd=d; b=k; } }); return b; };
  mapCv.onclick=e=>{ const k=pick(e); if(k){ click(740); sel=k; drawMap(); } };
  mapCv.onmousemove=e=>{ mapCv.style.cursor=pick(e)?'pointer':'default'; };

  /* 03 · Kattaliklar */
  K.draw(function drawScale(){ const cv=$('#t3Scale'); const {x,w,h}=fit(cv,.3,190), c=C();
    const pl=18, pr=18, y0=h/2, X0=m=>pl+(m+28)/(54)*(w-pl-pr);
    x.fillStyle=c.day?'rgba(45,92,174,.12)':'rgba(78,168,255,.14)'; x.fillRect(X0(-28),y0-9,X0(6)-X0(-28),18);
    const g=x.createLinearGradient(X0(-28),0,X0(26),0); g.addColorStop(0,'#fff6d6'); g.addColorStop(.6,c.neon); g.addColorStop(1,c.day?'#2b2934':'#0b1022'); x.fillStyle=g; x.fillRect(X0(-28),y0-3,X0(26)-X0(-28),6);
    x.font='10px system-ui,sans-serif'; x.fillStyle=c.dim; x.textAlign='center';
    for(let m=-25;m<=25;m+=5){ x.fillRect(X0(m)-.5,y0+5,1,6); x.fillText((m>0?'+':m<0?'−':'')+Math.abs(m)+'ᵐ',X0(m),y0+22); }
    x.fillStyle=c.neon; x.font='600 10.5px system-ui,sans-serif'; x.textAlign='left'; x.fillText(T(TX.eye),X0(-28)+2,y0-14);
    OBJ.forEach(([m,n],i)=>{ const px=X0(m), up=i%2===0, yy=up?y0-34:y0+40; x.strokeStyle=c.text; x.globalAlpha=.6; x.lineWidth=1; x.beginPath(); x.moveTo(px,y0+(up?-4:4)); x.lineTo(px,yy+(up?6:-12)); x.stroke(); x.globalAlpha=1;
      x.fillStyle=m<0?'#ffc34d':c.text; x.beginPath(); x.arc(px,y0,Math.max(2.5,6-m*.18),0,TAU); x.fill();
      x.fillStyle=c.text; x.font='600 11px system-ui,sans-serif'; x.textAlign=i===0?'left':(i===OBJ.length-1?'right':'center'); x.fillText(T(n),px+(i===0?-6:0),yy); x.fillStyle=c.dim; x.font='10px system-ui,sans-serif'; x.fillText((m>0?'+':m<0?'−':'')+fmtN(Math.abs(m),2).replace(/[.,]?0+$/,'')+'ᵐ',px+(i===0?-6:0),yy+12); }); });
  K.draw(function drawSteps(){ const cv=$('#t3Steps'); const {x,w,h}=fit(cv,.5,240);
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h); const n=6, cy=h*.46;
    for(let i=0;i<n;i++){ const px=(i+.5)/n*w, E=Math.pow(2.512,-i), r=6+28*Math.sqrt(E);
      const g=x.createRadialGradient(px,cy,0,px,cy,r*2.2); g.addColorStop(0,`rgba(255,250,235,${Math.min(1,.25+E)})`); g.addColorStop(.25,`rgba(200,220,255,${.7*E+.05})`); g.addColorStop(1,'rgba(150,180,255,0)');
      x.fillStyle=g; x.beginPath(); x.arc(px,cy,r*2.2,0,TAU); x.fill();
      x.fillStyle='#e8edff'; x.font='700 12px system-ui,sans-serif'; x.textAlign='center'; x.fillText(i+'ᵐ',px,h-34); x.fillStyle='#9aa6cc'; x.font='10.5px system-ui,sans-serif'; x.fillText(i?'÷'+fmtN(Math.pow(2.512,i),i<2?3:0):'1',px,h-18); }
    x.strokeStyle='#ffc65c'; x.lineWidth=1.2; x.beginPath(); x.moveTo(w/12,12); x.lineTo(w*11/12,12); x.stroke(); x.fillStyle='#ffc65c'; x.font='700 11px system-ui,sans-serif'; x.textAlign='center'; x.fillText('5ᵐ = 100 '+T(TX.tm),w/2,26); });
  const big=v=>{ if(v<1e6) return fmtN(v,v<10?2:0); const e=Math.floor(Math.log10(v)), m=v/Math.pow(10,e); return fmtN(m,1)+' × 10'+String(e).split('').map(d=>SUP[+d]).join(''); };
  function pog(){ const a=OBJ[+$('#t3P1').value], b=OBJ[+$('#t3P2').value], dm=b[0]-a[0], r=Math.pow(2.512,Math.abs(dm));
    const br=dm>=0?a:b, dk=dm>=0?b:a;
    $('#t3PKv').innerHTML=kv('m₂ − m₁',(dm<0?'−':'')+fmtN(Math.abs(dm),2)+'ᵐ')+kv('lg(E₁/E₂)',fmtN(.4*dm,2))+kv(Math.abs(dm)<.005?T(TX.same):T(br[1])+' / '+T(dk[1]),Math.abs(dm)<.005?'1':'≈ '+big(r)+' '+T(TX.brighter),true); }
  $('#t3P1').onchange=pog; $('#t3P2').onchange=pog; pog();

  K.bindQA(); K.quiz($('#t3Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK) return setTimeout(add,50); window.DARSLIK.add({ id:'t03', GL, QZ, ico:'🧭', title:TX.title, sub:TX.sub, build }); };
add();
})();
