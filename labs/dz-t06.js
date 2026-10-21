/* DARSLIK · 6-mavzu (15–17-§). Oyning harakati, fazalari va davrlari. Hijriy kalendarlar. Quyosh va Oy tutilishlari */
(function(){
const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU, SYN=29.530588, SID=27.32166;
const TX={
  title:X('Oyning harakati va fazalari. Hijriy kalendarlar. Tutilishlar','Движение и фазы Луны. Календари хиджры. Затмения','The Moon’s motion and phases. Hijri calendars. Eclipses'),
  sub:X('15–17-§ · Siderik va sinodik oy, Oy fazalari, oy-hijriy va quyosh-hijriy kalendarlar, Quyosh va Oy tutilishlari','§15–17 · Сидерический и синодический месяц, фазы, лунный и солнечный календари хиджры, солнечные и лунные затмения','§15–17 · Sidereal and synodic month, lunar phases, lunar and solar Hijri calendars, solar and lunar eclipses'),
  intro:X('Oy — Yerning tabiiy yo‘ldoshi. U Yer atrofida <b>27,32 sutkada</b> (siderik yoki yulduz davri) g‘arbdan sharqqa aylanadi, sekundiga ≈1 km tezlikda, yulduzlarga nisbatan har sutkada ≈13° siljiydi. Oy orbitasi ekliptikaga <b>5°9′</b> og‘gan. Oy o‘z o‘qi atrofida ham aynan 27,32 sutkada aylanadi — shuning uchun Yerga doim bir tomoni bilan qaraydi.',
    'Луна — естественный спутник Земли. Она обращается вокруг Земли с запада на восток за <b>27,32 суток</b> (сидерический, или звёздный, период) со скоростью ≈1 км/с, смещаясь среди звёзд на ≈13° в сутки. Орбита Луны наклонена к эклиптике на <b>5°9′</b>. Вокруг оси Луна вращается тоже за 27,32 суток — поэтому всегда обращена к Земле одной стороной.',
    'The Moon is Earth’s natural satellite. It circles the Earth west to east in <b>27.32 days</b> (the sidereal period) at ≈1 km/s, moving ≈13° a day among the stars. Its orbit is tilted <b>5°9′</b> to the ecliptic. It also spins on its axis in exactly 27.32 days — so it always shows us the same face.'),
  s1:X('Oy fazalari','Фазы Луны','Phases of the Moon'),
  s1D:X('Oy Quyosh nurlarini qaytargani uchun ko‘rinadi; uning shakli Quyoshga nisbatan vaziyatiga bog‘liq. Quyosh botgach g‘arbda ko‘ringan ingichka o‘roq — <b>yangioy (hilol)</b>, odatda oy boshidan keyingi ikkinchi kuni ko‘rinadi. Bunda yoritilmagan qism ham xira kulrang ko‘rinadi — u Yerdan qaytgan Quyosh nurlari bilan yoritilgan.',
    'Луна видна, потому что отражает солнечный свет; её форма зависит от положения относительно Солнца. Тонкий серп на западе после заката — <b>молодая Луна (хилол)</b>, обычно видна на второй день после новолуния. Неосвещённая часть при этом слабо серая — её освещает свет, отражённый Землёй.',
    'We see the Moon by reflected sunlight; its shape depends on where it is relative to the Sun. The thin crescent in the west after sunset is the <b>new crescent (hilal)</b>, usually seen on the second day after new moon. The unlit part then glows faint grey — lit by sunlight reflected from Earth.'),
  age:X('Oy yoshi','Возраст Луны','Moon’s age'), dd:X('sutka','сут','days'), lit:X('Yoritilgan qism','Освещённая часть','Illuminated'), ph:X('Faza','Фаза','Phase'), today:X('Bugungi Oy','Луна сегодня','Today’s Moon'),
  view:X('Yerdan ko‘rinishi','Вид с Земли','Seen from Earth'), rays:X('Quyosh nurlari','Солнечные лучи','Sunlight'),
  s2:X('Siderik va sinodik oy','Сидерический и синодический месяц','Sidereal and synodic month'),
  s2D:X('Oyning ma’lum fazadan (masalan, to‘linoydan) ikki marta ketma-ket o‘tishi orasidagi vaqt — <b>sinodik davr, 29,53 sutka</b>. 27,32 sutkada Oy yana M yulduz to‘g‘risiga keladi (2-holat), ammo Yer bu vaqtda orbitada ≈27° siljigan. Oy kuniga ≈13° yurgani uchun bu 27° ni o‘tishga yana 2 sutkadan ko‘proq kerak — to‘linoy 29,53 sutkadan keyin keladi (3-holat).',
    'Время между двумя последовательными одинаковыми фазами (например, полнолуниями) — <b>синодический период, 29,53 суток</b>. Через 27,32 суток Луна снова напротив звезды M (положение 2), но Земля за это время сместилась по орбите на ≈27°. Луна проходит ≈13° в сутки, и на эти 27° нужно ещё больше 2 суток — полнолуние наступает через 29,53 суток (положение 3).',
    'The time between two identical phases (say, full moons) is the <b>synodic period, 29.53 days</b>. After 27.32 days the Moon is lined up with star M again (position 2), but Earth has moved ≈27° along its orbit. At ≈13° a day the Moon needs more than 2 extra days to cover that, so full moon returns after 29.53 days (position 3).'),
  pos:X('holat','положение','position'), toM:X('M yulduzga','к звезде M','to star M'), full:X('To‘linoy','Полнолуние','Full moon'),
  s3:X('Quyosh va Oy tutilishlari','Солнечные и лунные затмения','Solar and lunar eclipses'),
  sol:X('Quyosh tutilishi','Солнечное затмение','Solar eclipse'), lun:X('Oy tutilishi','Лунное затмение','Lunar eclipse'),
  solD:X('Oy Quyoshni bizdan to‘sadi — har doim <b>yangioy</b> paytida. Oy soyasi (O) ichidagi kuzatuvchi Quyoshni bir necha minut butunlay ko‘rmaydi — <b>to‘la tutilish</b>; yarimsoyadagi (A, B) kuzatuvchi uning bir qismini ko‘radi — <b>qisman tutilish</b>. Ba’zan tutilish <b>halqasimon</b> bo‘ladi.',
    'Луна закрывает от нас Солнце — всегда в <b>новолуние</b>. Наблюдатель в тени Луны (O) несколько минут совсем не видит Солнца — <b>полное затмение</b>; в полутени (A, B) видит часть — <b>частное</b>. Иногда затмение бывает <b>кольцеобразным</b>.',
    'The Moon hides the Sun — always at <b>new moon</b>. In the Moon’s shadow (O) the Sun vanishes for a few minutes — a <b>total eclipse</b>; in the penumbra (A, B) part of it is hidden — a <b>partial eclipse</b>. Sometimes it is <b>annular</b>.'),
  lunD:X('Oy Yer soyasidan o‘tadi — har doim <b>to‘linoy</b> paytida. Soya ichida — to‘la, yarimsoyada — yarimsoyali tutilish. To‘la tutilishda Oy yo‘qolmaydi, <b>to‘q qizil</b> rangda ko‘rinadi: Yer atmosferasi ko‘k nurlarni sochib, Oyga asosan qizil nurlarni sindirib o‘tkazadi. Oy tutilishi Yerning tungi yarimsharining hamma joyidan ko‘rinadi, shuning uchun bir joyda u Quyosh tutilishidan ko‘proq kuzatiladi.',
    'Луна проходит через тень Земли — всегда в <b>полнолуние</b>. В тени — полное, в полутени — полутеневое затмение. При полном затмении Луна не исчезает, а становится <b>тёмно-красной</b>: атмосфера Земли рассеивает синие лучи и преломляет к Луне в основном красные. Лунное затмение видно со всего ночного полушария, поэтому в одном месте его наблюдают чаще солнечного.',
    'The Moon passes through Earth’s shadow — always at <b>full moon</b>. Inside the umbra the eclipse is total; in the penumbra, penumbral. A totally eclipsed Moon doesn’t vanish but turns <b>deep red</b>: Earth’s atmosphere scatters blue light and bends mostly red light onto it. A lunar eclipse is seen from the whole night side, so from one place it is seen more often than a solar one.'),
  umb:X('soya','тень','umbra'), pen:X('yarimsoya','полутень','penumbra'),
  vA:X('A · qisman','A · частное','A · partial'), vO:X('O · to‘la','O · полное','O · total'), vB:X('B · qisman','B · частное','B · partial'), vR:X('halqasimon','кольцеобразное','annular'),
  whyT:X('Nega har oyda tutilish bo‘lmaydi?','Почему затмения бывают не каждый месяц?','Why isn’t there an eclipse every month?'),
  whyD:X('Oy orbitasi ekliptikaga og‘gan, shuning uchun yangioy va to‘linoyda Oy ko‘pincha Quyosh–Yer chizig‘idan yuqori yoki pastdan o‘tadi. Tutilish uchun Quyosh Oy tugunlaridan biriga yaqin bo‘lishi kerak: Quyosh tutilishida <b>16,5° dan</b>, Oy tutilishida <b>10,6° dan</b> kam. Rasmda og‘ish ko‘rinarli bo‘lishi uchun kattalashtirilgan.',
    'Орбита Луны наклонена к эклиптике, поэтому в новолуние и полнолуние Луна чаще проходит выше или ниже линии Солнце–Земля. Для затмения Солнце должно быть близко к одному из узлов лунной орбиты: для солнечного — ближе <b>16,5°</b>, для лунного — ближе <b>10,6°</b>. Наклон на рисунке увеличен.',
    'The Moon’s orbit is tilted, so at new and full moon it usually passes above or below the Sun–Earth line. An eclipse needs the Sun near one of the Moon’s nodes: within <b>16.5°</b> for a solar eclipse, <b>10.6°</b> for a lunar one. The tilt is exaggerated in the drawing.'),
  node:X('Quyoshdan tugungacha','От Солнца до узла','Sun to node'), solY:X('Quyosh tutilishi','Солнечное затмение','Solar eclipse'), lunY:X('Oy tutilishi','Лунное затмение','Lunar eclipse'),
  yes:X('bo‘ladi','будет','yes'), no:X('bo‘lmaydi','не будет','no'), beta:X('Oyning ekliptikadan uzoqligi','Удаление Луны от эклиптики','Moon’s distance from ecliptic'),
  perY:X('Bir yilda: Quyosh tutilishi 2–5 ta, Oy tutilishi 0–3 ta; jami ko‘pi bilan 7 ta, kamida 2 ta (faqat Quyosh).','За год: солнечных затмений 2–5, лунных 0–3; всего не более 7 и не менее 2 (только солнечные).','Per year: 2–5 solar and 0–3 lunar eclipses; at most 7 in total, at least 2 (both solar).'),
  s4:X('Musulmonlarning oy-hijriy va quyosh-hijriy kalendarlari','Лунный и солнечный календари хиджры','The lunar and solar Hijri calendars'),
  s4D:X('Birinchi oy kalendari mil. avv. 2500-yillarda Qadimgi Bobilda paydo bo‘lgan; yetti kunlik hafta ham o‘shanda — yulduzlar fonida harakatlanadigan yetti jism (Quyosh, Oy va 5 planeta) soniga teng qilib joriy qilingan. <b>Oy-hijriy</b> taqvim yili 354 kun, 12 oy 29 va 30 kundan almashinadi; har 3 yilda taxminan bir yil 355 kun. Bu yil milodiydan ≈11 kun qisqa, shuning uchun 33 milodiy yilda 34 hijriy yil o‘tadi. Era — 622-yil 16-iyul (hijrat).',
    'Первый лунный календарь появился около 2500 г. до н. э. в Древнем Вавилоне; тогда же введена семидневная неделя — по числу семи светил, движущихся среди звёзд (Солнце, Луна и 5 планет). Год <b>лунной хиджры</b> — 354 дня, 12 месяцев по 29 и 30 дней; примерно раз в 3 года — 355 дней. Он короче григорианского ≈ на 11 дней, поэтому за 33 наших года проходит 34 года хиджры. Эра — 16 июля 622 г. (хиджра).',
    'The first lunar calendar appeared around 2500 BC in Babylon, together with the seven-day week — one day for each of the seven bodies moving among the stars (Sun, Moon and 5 planets). The <b>lunar Hijri</b> year has 354 days in 12 months of 29 and 30 days, with a 355-day year about every 3 years. It is ≈11 days shorter than ours, so 34 Hijri years pass in 33 of ours. Its era starts on 16 July 622 (the Hijra).'),
  conv:X('Sanani o‘giring','Перевод даты','Convert a date'), greg:X('Milodiy','Григорианский','Gregorian'), hij:X('Oy-hijriy (qamariy)','Лунная хиджра','Lunar Hijri'), shj:X('Quyosh-hijriy (shamsiy)','Солнечная хиджра','Solar Hijri'),
  convN:X('Jadval usulida hisoblangan; oy boshi hilol ko‘rinishiga bog‘liq bo‘lgani uchun 1–2 kun farq bo‘lishi mumkin. Kitobdagi misollar: 1-muharram 1440 = 2018-yil 13-sentabr; quyosh-hijriy 1397-yil = 2018-yil 21-mart.','Расчёт по табличному методу; начало месяца зависит от видимости серпа, поэтому возможна разница в 1–2 дня. Примеры из учебника: 1 мухаррама 1440 = 13 сентября 2018; солнечный 1397 год = 21 марта 2018.','Tabular calculation; months begin with the sighted crescent, so a 1–2 day difference is possible. Book examples: 1 Muharram 1440 = 13 Sep 2018; solar 1397 began 21 Mar 2018.'),
  xT:X('Umar Xayyom kalendari (33 yillik davr)','Календарь Омара Хайяма (33-летний цикл)','Omar Khayyam’s calendar (33-year cycle)'),
  xD:X('XI asrda Nishopurlik shoir va olim Umar Xayyom (1048–1131) Isfahon rasadxonasida «Malikshoh ziji»ni tuzdi va taqvim islohoti kengashiga rahbarlik qildi. Maqsad — yil boshi (Navro‘z) bahorgi tengkunlikdan siljimasin. 33 yilda 8 ta kabisa yili: 4-, 8-, 12-, 16-, 20-, 24-, 28- va 33-yillar. O‘rtacha yil 365 + 8/33 = <b>365,24242</b> kun — tropik yildan atigi 19,5 sekund uzun. Bu kalendar Erondagi Jaloliy taqvimining asosi; oylari Hamal, Savr, Javzo, Saraton, Asad, Sunbula, Mezon, Aqrab, Qavs, Jaddi, Dalv, Hut.',
    'В XI веке поэт и учёный из Нишапура Омар Хайям (1048–1131) составил в Исфаханской обсерватории «Зидж Маликшаха» и возглавил совет по реформе календаря. Цель — чтобы начало года (Навруз) не уходило от весеннего равноденствия. За 33 года — 8 високосных: 4, 8, 12, 16, 20, 24, 28 и 33-й. Средний год 365 + 8/33 = <b>365,24242</b> дня — длиннее тропического всего на 19,5 с. Этот календарь лёг в основу иранского календаря Джалали; месяцы: Хамал, Саур, Джауза, Саратан, Асад, Сунбула, Мизан, Акраб, Каус, Джади, Далв, Хут.',
    'In the 11th century the poet and scientist Omar Khayyam of Nishapur (1048–1131) compiled the “Malikshah Zij” at the Isfahan observatory and led the calendar reform council. The aim: keep New Year (Navruz) on the March equinox. In 33 years there are 8 leap years: the 4th, 8th, 12th, 16th, 20th, 24th, 28th and 33rd. The mean year is 365 + 8/33 = <b>365.24242</b> days — just 19.5 s longer than the tropical year. It underlies Iran’s Jalali calendar; months: Hamal, Sawr, Jawza, Saratan, Asad, Sunbula, Mizan, Aqrab, Qaws, Jadi, Dalw, Hut.'),
  errT:X('1 kunlik xato yig‘ilishi uchun ketadigan vaqt','Время, за которое набегает ошибка в 1 сутки','Time to accumulate a 1-day error'),
  yrs:X('yil','лет','years'), leapY:X('kabisa','високосный','leap'), jul:X('Yulian','Юлианский','Julian'), gre:X('Grigorian','Григорианский','Gregorian'), kh:X('Umar Xayyom','Омар Хайям','Omar Khayyam')
};
const PHN=[X('Yangi oy','Новолуние','New moon'),X('O‘suvchi o‘roq (hilol)','Растущий серп','Waxing crescent'),X('Birinchi chorak','Первая четверть','First quarter'),X('O‘suvchi oy','Растущая Луна','Waxing gibbous'),X('To‘linoy','Полнолуние','Full moon'),X('Kamayuvchi oy','Убывающая Луна','Waning gibbous'),X('Oxirgi chorak','Последняя четверть','Last quarter'),X('Kamayuvchi o‘roq','Убывающий серп','Waning crescent')];
const HM={uz:['Muharram','Safar','Rabi ul-avval','Rabi us-soniy','Jumad ul-avval','Jumad us-soniy','Rajab','Sha’bon','Ramazon','Shavvol','Zulqa’da','Zulhijja'],ru:['Мухаррам','Сафар','Раби аль-авваль','Раби ас-сани','Джумада аль-уля','Джумада ас-сани','Раджаб','Шаабан','Рамадан','Шавваль','Зуль-када','Зуль-хиджа'],en:['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Thani','Rajab','Sha’ban','Ramadan','Shawwal','Dhu al-Qadah','Dhu al-Hijjah']};
const SM={uz:['Hamal','Savr','Javzo','Saraton','Asad','Sunbula','Mezon','Aqrab','Qavs','Jaddi','Dalv','Hut'],ru:['Хамал','Саур','Джауза','Саратан','Асад','Сунбула','Мизан','Акраб','Каус','Джади','Далв','Хут'],en:['Hamal','Sawr','Jawza','Saratan','Asad','Sunbula','Mizan','Aqrab','Qaws','Jadi','Dalw','Hut']};
const GL=[
 [X('Siderik (yulduz) oy','Сидерический месяц','Sidereal month'),X('Oyning yulduzlarga nisbatan Yer atrofida to‘la aylanish davri — 27,32 sutka.','Период обращения Луны относительно звёзд — 27,32 сут.','The Moon’s orbital period relative to the stars — 27.32 days.')],
 [X('Sinodik oy','Синодический месяц','Synodic month'),X('Oy fazalarining qaytarilish davri — 29,53 sutka.','Период смены лунных фаз — 29,53 сут.','The cycle of lunar phases — 29.53 days.')],
 [X('Oy fazalari','Фазы Луны','Lunar phases'),X('Oyning Yerdan turli shakllarda (yangioy, chorak, to‘linoy) ko‘rinishi.','Видимые формы Луны (новолуние, четверть, полнолуние).','The Moon’s changing shapes as seen from Earth (new, quarter, full).')],
 [X('Hilol','Хилол (серп)','Hilal'),X('Quyosh botgach g‘arbda ko‘ringan birinchi ingichka Oy o‘rog‘i.','Первый тонкий серп Луны на западе после заката.','The first thin crescent seen in the west after sunset.')],
 [X('Oy-hijriy kalendar','Лунный календарь хиджры','Lunar Hijri calendar'),X('354/355 kunlik, 12 oyli oy kalendari; erasi 622-yil 16-iyul.','Лунный календарь из 12 месяцев, 354/355 дней; эра — 16 июля 622 г.','A 12-month lunar calendar of 354/355 days; era from 16 July 622.')],
 [X('Quyosh-hijriy kalendar','Солнечный календарь хиджры','Solar Hijri calendar'),X('Umar Xayyom taqvimiga asoslangan quyosh kalendari; yil Navro‘zda boshlanadi.','Солнечный календарь на основе календаря Хайяма; год начинается с Навруза.','A solar calendar based on Khayyam’s; the year begins at Navruz.')],
 [X('Quyosh tutilishi','Солнечное затмение','Solar eclipse'),X('Yangioy paytida Oyning Quyoshni to‘sishi: to‘la, qisman yoki halqasimon.','Закрытие Солнца Луной в новолуние: полное, частное или кольцеобразное.','The Moon hiding the Sun at new moon: total, partial or annular.')],
 [X('Oy tutilishi','Лунное затмение','Lunar eclipse'),X('To‘linoy paytida Oyning Yer soyasidan o‘tishi: to‘la yoki yarimsoyali.','Прохождение Луны через тень Земли в полнолуние: полное или полутеневое.','The Moon passing through Earth’s shadow at full moon: total or penumbral.')]
];
const QA=[
 [X('Oy o‘z o‘qi atrofida qanday davr bilan aylanadi? Yer atrofida-chi?','С каким периодом Луна вращается вокруг оси? А вокруг Земли?','What is the Moon’s rotation period? And its orbital period?'),X('Ikkalasi ham 27,32 sutka.','Оба — 27,32 суток.','Both are 27.32 days.')],
 [X('Oyning har doim Yerga bir tomoni bilan ko‘rinishining sababi nimada?','Почему Луна всегда обращена к Земле одной стороной?','Why does the Moon always show the same side?'),X('Uning o‘z o‘qi va Yer atrofida aylanish davrlari teng (27,32 sutka).','Периоды её вращения вокруг оси и обращения вокруг Земли равны (27,32 сут).','Its rotation and orbital periods are equal (27.32 days).')],
 [X('Oyning asosiy fazalari qanday ataladi?','Как называются основные фазы Луны?','What are the main phases called?'),X('Astronomik yangioy, birinchi chorak, to‘linoy va oxirgi chorak (oralarida o‘roq va qavariq shakllar).','Новолуние, первая четверть, полнолуние и последняя четверть (между ними — серпы и выпуклые фазы).','New moon, first quarter, full moon and last quarter (with crescents and gibbous phases between).')],
 [X('Oyning sinodik davri deb nimaga aytiladi?','Что такое синодический период Луны?','What is the synodic period?'),X('Oyning bir xil fazadan (masalan, to‘linoydan) ikki marta ketma-ket o‘tishi orasidagi vaqt — 29,53 sutka.','Время между двумя одинаковыми фазами подряд (например, полнолуниями) — 29,53 суток.','The time between two successive identical phases (e.g. full moons) — 29.53 days.')],
 [X('Umar Xayyom kalendarining aniqligini grigorian kalendari bilan solishtiring.','Сравните точность календаря Хайяма с григорианским.','Compare the accuracy of Khayyam’s calendar with the Gregorian.'),X('Xayyom: o‘rtacha yil 365,24242 kun, 1 kun xato ≈4500 yilda yig‘iladi. Grigorian: ≈3300 yilda — Xayyom kalendari 1200 yilga aniqroq.','Хайям: средний год 365,24242 дня, ошибка в 1 сутки за ≈4500 лет. Григорианский — за ≈3300 лет: календарь Хайяма точнее на 1200 лет.','Khayyam: a mean year of 365.24242 days, 1-day error in ≈4,500 years. Gregorian: ≈3,300 years — Khayyam’s is 1,200 years better.')],
 [X('Oy va Quyosh tutilishini tushuntiring.','Объясните лунное и солнечное затмения.','Explain solar and lunar eclipses.'),X('Quyosh tutilishi — yangioyda Oy Quyoshni to‘sadi (soyada to‘la, yarimsoyada qisman, ba’zan halqasimon). Oy tutilishi — to‘linoyda Oy Yer soyasidan o‘tadi va qizil tusga kiradi.','Солнечное — в новолуние Луна закрывает Солнце (в тени полное, в полутени частное, иногда кольцеобразное). Лунное — в полнолуние Луна проходит через тень Земли и краснеет.','Solar: at new moon the Moon hides the Sun (total in the umbra, partial in the penumbra, sometimes annular). Lunar: at full moon the Moon enters Earth’s shadow and turns red.')],
 [X('Quyosh nega har yangioyda, Oy nega har to‘linoyda tutilmaydi?','Почему затмения бывают не в каждое новолуние и полнолуние?','Why isn’t there an eclipse at every new and full moon?'),X('Oy orbitasi ekliptikaga 5°9′ og‘gan; tutilish faqat Quyosh Oy tuguniga yaqin bo‘lganda (Quyosh tutilishida 16,5°, Oy tutilishida 10,6° dan kam) ro‘y beradi.','Орбита Луны наклонена к эклиптике на 5°9′; затмение возможно, только когда Солнце близко к узлу (ближе 16,5° для солнечного, 10,6° для лунного).','The orbit is tilted 5°9′; an eclipse happens only when the Sun is near a node (within 16.5° for solar, 10.6° for lunar).')]
];
const QZ=[
 [X('Oyning siderik davri:','Сидерический период Луны:','The Moon’s sidereal period:'),[X('27,32 sutka','27,32 сут','27.32 days'),X('29,53 sutka','29,53 сут','29.53 days'),X('365,25 sutka','365,25 сут','365.25 days')]],
 [X('Oyning sinodik davri:','Синодический период Луны:','The synodic period:'),[X('29,53 sutka','29,53 сут','29.53 days'),X('27,32 sutka','27,32 сут','27.32 days'),X('30 sutka','30 сут','30 days')]],
 [X('Oy orbitasining ekliptikaga og‘maligi:','Наклон лунной орбиты к эклиптике:','Tilt of the Moon’s orbit to the ecliptic:'),[X('5°9′','5°9′','5°9′'),X('23°26′','23°26′','23°26′'),X('0°','0°','0°')]],
 [X('Quyosh tutilishi qaysi fazada bo‘ladi?','В какую фазу бывает солнечное затмение?','Solar eclipses happen at which phase?'),[X('Yangioy','Новолуние','New moon'),X('To‘linoy','Полнолуние','Full moon'),X('Birinchi chorak','Первая четверть','First quarter')]],
 [X('To‘la Oy tutilishida Oy qanday ko‘rinadi?','Как выглядит Луна при полном лунном затмении?','How does the Moon look in a total lunar eclipse?'),[X('To‘q qizil','Тёмно-красной','Deep red'),X('Butunlay yo‘qoladi','Полностью исчезает','It vanishes'),X('Moviy','Голубой','Blue')]],
 [X('Oy-hijriy yili necha kun?','Сколько дней в году лунной хиджры?','How many days in a lunar Hijri year?'),[X('354 (ba’zan 355)','354 (иногда 355)','354 (sometimes 355)'),X('365','365','365'),X('360','360','360')]],
 [X('Hijriy era qachondan boshlanadi?','С какой даты начинается эра хиджры?','When does the Hijri era begin?'),[X('622-yil 16-iyul','16 июля 622 г.','16 July 622'),X('1-yil 1-yanvar','1 января 1 г.','1 January 1 AD'),X('1582-yil','1582 г.','1582')]],
 [X('Umar Xayyom kalendarida 33 yilda nechta kabisa yili bor?','Сколько високосных лет за 33 года у Хайяма?','How many leap years in Khayyam’s 33-year cycle?'),[X('8','8','8'),X('7','7','7'),X('11','11','11')]],
 [X('Bir yilda ko‘pi bilan nechta tutilish bo‘lishi mumkin?','Сколько затмений максимум может быть за год?','What is the maximum number of eclipses in a year?'),[X('7','7','7'),X('2','2','2'),X('12','12','12')]]
];
// Taqvim hisoblari
const jdG=(y,m,d)=>{ const a=Math.floor((14-m)/12), yy=y+4800-a, mm=m+12*a-3; return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045; };
const jdJ=(y,m,d)=>{ const a=Math.floor((14-m)/12), yy=y+4800-a, mm=m+12*a-3; return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-32083; };
const jdAny=(y,m,d)=>(y<1582||(y===1582&&(m<10||(m===10&&d<15))))?jdJ(y,m,d):jdG(y,m,d);
const islJD=(y,m,d)=>d+Math.ceil(29.5*(m-1))+(y-1)*354+Math.floor((3+11*y)/30)+1948440-1;
function toHijri(jd){ const y=Math.floor((30*(jd-1948440)+10646)/10631); let m=Math.min(12,Math.ceil((jd-(29+islJD(y,1,1)))/29.5)+1); m=Math.max(1,m); const d=jd-islJD(y,m,1)+1; return [y,m,d]; }
function toSolarH(y,m,d){ const n=jdG(y,3,21), jd=jdG(y,m,d); let sy=y-621, start=n; if(jd<n){ sy=y-622; start=jdG(y-1,3,21); } const k=jd-start; let mo, dd; if(k<186){ mo=Math.floor(k/31); dd=k%31+1; } else { mo=6+Math.floor((k-186)/30); dd=(k-186)%30+1; if(mo>11){ mo=11; dd=k-186-150+1; } } return [sy,mo,dd]; }

function build(el, api){
  const K=K0.kit(el,api), {T,L,click,$,$$,fmtN,dms,C,fit,sec,chips,mark,on,kv}=K;
  const now=new Date(), ageNow=((((Date.now()-Date.UTC(2000,0,6,18,14))/86400000)%SYN)+SYN)%SYN;
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t6Orb"></canvas></div>
    <div class="t1-side"><div class="dz-card t6-view"><canvas id="t6Moon" width="10" height="10"></canvas><span>${T(TX.view)}</span></div>
      <label class="t1-ctl"><span>${T(TX.age)}: <b id="t6AV"></b></span><input type="range" class="lab-range" id="t6A" min="0" max="29.5" step="0.05"></label>
      <div class="lab-row" style="margin:0"><button class="lab-chip" id="t6Now">🌙 ${T(TX.today)}</button><button class="lab-chip" id="t6Play">▶</button></div>
      <div class="lab-kv" id="t6AKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t6Syn"></canvas><div class="lab-row"><button class="lab-chip" id="t6SP">▶</button><span class="t1-lab"><b id="t6SV"></b></span><input type="range" class="lab-range" id="t6S" min="0" max="29.53" step="0.01" value="0" style="flex:1"></div></div>
    <div class="t1-side"><div class="t1-formula">1/S = 1/T − 1/Y</div><div class="lab-kv" id="t6SKv"></div>
      <div class="lab-row" style="margin:0">${chips('sp',[[0,'1 · '+T(TX.full)],[SID,'2 · 27,32'],[SYN,'3 · 29,53']])}</div></div></div>`)}
  ${sec('03',TX.s3,`<div class="lab-row" style="margin:0">${chips('ek',[['sol','☀ '+T(TX.sol)],['lun','🌕 '+T(TX.lun)]])}</div>
    <p class="t1-p" id="t6ED"></p>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t6Ecl"></canvas><canvas class="t1-cv" id="t6EV"></canvas></div>
    <div class="dz-card t1-chart"><h4>${T(TX.whyT)}</h4><p class="t1-p">${T(TX.whyD)}</p><canvas class="t1-cv" id="t6Node"></canvas>
      <label class="t1-ctl"><span>${T(TX.node)}: <b id="t6NV"></b></span><input type="range" class="lab-range" id="t6N" min="0" max="90" step="0.5" value="8"></label>
      <div class="lab-kv" id="t6NKv"></div><p class="t1-cap">${T(TX.perY)}</p></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p>
    <div class="dz-card t4-m"><h4>${T(TX.conv)}</h4><div class="lab-row" style="margin:0"><input type="date" class="lab-date" id="t6Dt" value="${iso(now)}">${chips('dt',[['2018-09-13','2018-09-13'],['2018-03-21','2018-03-21'],['0622-07-16','622-07-16']])}</div><div class="lab-kv t2-kv5" id="t6DKv"></div><p class="t1-cap">${T(TX.convN)}</p></div>
    <div class="dz-card t4-m"><h4>${T(TX.xT)}</h4><p class="t1-p">${T(TX.xD)}</p><div class="t6-cyc">${Array.from({length:33},(_,i)=>`<span class="${[4,8,12,16,20,24,28,33].includes(i+1)?'on':''}">${i+1}</span>`).join('')}</div>
      <h4>${T(TX.errT)}</h4><div class="t6-err">${[[TX.jul,128,'#e0604f'],[TX.gre,3300,'var(--neon)'],[TX.kh,4500,'var(--dz-gold)']].map(([n,v,c])=>`<div><span>${T(n)}</span><div class="t2-track"><i style="width:${v/4500*100}%;background:${c}"></i></div><b>≈ ${fmtN(v)} ${T(TX.yrs)}</b></div>`).join('')}</div></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t6Quiz"></div>`)}`;

  /* 01 · Fazalar */
  let age=ageNow, aRun=false;
  const phIdx=a=>Math.floor(((a/SYN*8)+.5))%8;
  function moonDisc(x,cx,cy,r,a,c,dark){ const e=a/SYN*TAU, wax=e<Math.PI, ce=Math.cos(e);
    x.fillStyle=dark||'#2a2d3a'; x.beginPath(); x.arc(cx,cy,r,0,TAU); x.fill();
    x.fillStyle='#f3efe2'; x.beginPath(); x.arc(cx,cy,r,-Math.PI/2,Math.PI/2,!wax); x.closePath(); x.fill();
    x.fillStyle=ce>0?(dark||'#2a2d3a'):'#f3efe2'; x.beginPath(); x.ellipse(cx,cy,Math.abs(ce)*r,r,0,0,TAU); x.fill();
    x.strokeStyle='rgba(255,255,255,.18)'; x.lineWidth=1; x.beginPath(); x.arc(cx,cy,r,0,TAU); x.stroke(); }
  const drawPh=K.draw(function(){ const cv=$('#t6Orb'); const {x,w,h}=fit(cv,.78,420), c=C(), cx=w*.56, cy=h/2, R=Math.min(w*.32,h*.38);
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(255,210,120,.35)'; x.lineWidth=1.2; for(let i=0;i<7;i++){ const y=h*(i+.5)/7; x.beginPath(); x.moveTo(8,y); x.lineTo(w*.14,y); x.stroke(); x.beginPath(); x.moveTo(w*.14,y); x.lineTo(w*.14-6,y-4); x.moveTo(w*.14,y); x.lineTo(w*.14-6,y+4); x.stroke(); }
    x.fillStyle='#ffc65c'; x.font='600 11px system-ui,sans-serif'; x.textAlign='left'; x.fillText('☀ '+T(TX.rays),8,14);
    x.strokeStyle='rgba(160,180,255,.3)'; x.setLineDash([4,5]); x.beginPath(); x.arc(cx,cy,R,0,TAU); x.stroke(); x.setLineDash([]);
    for(let i=0;i<8;i++){ const e=i/8*TAU, px=cx+R*Math.cos(Math.PI+e), py=cy-R*Math.sin(Math.PI+e); x.fillStyle='#2a2d3a'; x.beginPath(); x.arc(px,py,9,0,TAU); x.fill(); x.fillStyle='rgba(243,239,226,.55)'; x.beginPath(); x.arc(px,py,9,Math.PI/2,Math.PI*1.5); x.fill();
      x.fillStyle='#9aa6cc'; x.font='10px system-ui,sans-serif'; x.textAlign='center'; x.fillText(String(i+1),cx+(R+22)*Math.cos(Math.PI+e),cy-(R+22)*Math.sin(Math.PI+e)+4); }
    const g=x.createLinearGradient(cx-18,0,cx+18,0); g.addColorStop(0,'#6fb0ff'); g.addColorStop(.5,'#3f7fe0'); g.addColorStop(.5,'#18305e'); g.addColorStop(1,'#0e1d3c'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,18,0,TAU); x.fill();
    x.fillStyle='#e8edff'; x.font='600 11px system-ui,sans-serif'; x.textAlign='center'; x.fillText(T(X('Yer','Земля','Earth')),cx,cy+32);
    const e=age/SYN*TAU, mx=cx+R*Math.cos(Math.PI+e), my=cy-R*Math.sin(Math.PI+e);
    x.strokeStyle='rgba(232,237,255,.35)'; x.beginPath(); x.moveTo(cx,cy); x.lineTo(mx,my); x.stroke();
    x.fillStyle='#2a2d3a'; x.beginPath(); x.arc(mx,my,13,0,TAU); x.fill(); x.fillStyle='#f3efe2'; x.beginPath(); x.arc(mx,my,13,Math.PI/2,Math.PI*1.5); x.fill(); x.strokeStyle='#ffc65c'; x.lineWidth=2; x.beginPath(); x.arc(mx,my,16,0,TAU); x.stroke();
    { const mv=$('#t6Moon'), s=Math.min(200,Math.round(mv.parentElement.clientWidth*.55)), mc=api.hiDPI(mv,s,s); mv.style.width=s+'px'; mv.style.height=s+'px'; mc.clearRect(0,0,s,s); mc.fillStyle='#03050f'; mc.fillRect(0,0,s,s); moonDisc(mc,s/2,s/2,s*.4,age,c,'#2b2e3b'); }
    const k=(1-Math.cos(e))/2;
    $('#t6AV').textContent=fmtN(age,1)+' '+T(TX.dd); $('#t6A').value=age;
    $('#t6AKv').innerHTML=kv(T(TX.ph),T(PHN[phIdx(age)]),true)+kv(T(TX.lit),fmtN(k*100)+'%')+kv(T(TX.age),fmtN(age,1)+' / 29,53'); });
  $('#t6A').oninput=e=>{ age=+e.target.value; drawPh(); };
  $('#t6Now').onclick=()=>{ click(720); age=ageNow; drawPh(); };
  let aL=0; const aStep=n=>{ if(!aRun) return; const dt=Math.min(.05,(n-aL)/1000); aL=n; age=(age+dt*3)%SYN; drawPh(); K.rafs.ph=requestAnimationFrame(aStep); };
  $('#t6Play').onclick=()=>{ aRun=!aRun; $('#t6Play').textContent=aRun?'⏸':'▶'; click(700); if(aRun){ aL=performance.now(); K.rafs.ph=requestAnimationFrame(aStep); } };

  /* 02 · Sinodik davr */
  let sd=0, sRun=false;
  const drawSyn=K.draw(function(){ const cv=$('#t6Syn'); const {x,w,h}=fit(cv,.72,400), c=C(), sx=w*.18, sy=h*.72, OR=w*.62, mr=Math.min(w,h)*.13;
    const EA=d=>-d/365.25*TAU, ep=d=>[sx+OR*Math.cos(EA(d)),sy+OR*Math.sin(EA(d))], MA=d=>EA(0)-d/SID*TAU;
    x.strokeStyle=c.brd; x.lineWidth=1.2; x.setLineDash([4,5]); x.beginPath(); x.arc(sx,sy,OR,-Math.PI*.24,Math.PI*.04); x.stroke(); x.setLineDash([]);
    const g=x.createRadialGradient(sx,sy,0,sx,sy,30); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(sx,sy,30,0,TAU); x.fill();
    x.fillStyle=c.text; x.font='600 11px system-ui,sans-serif'; x.textAlign='center'; x.fillText(T(X('Quyosh','Солнце','Sun')),sx,sy+44);
    [[0,'1'],[SID,'2'],[SYN,'3']].forEach(([d,n])=>{ const [px,py]=ep(d); x.globalAlpha=d<=sd+1e-6?.9:.3; x.strokeStyle=c.dim; x.beginPath(); x.arc(px,py,mr,0,TAU); x.stroke(); x.fillStyle=c.dim; x.fillText(n,px+mr*.7,py+mr+14); x.globalAlpha=1; });
    const [ex,ey]=ep(sd), ma=MA(sd), mx=ex+mr*Math.cos(ma), my=ey+mr*Math.sin(ma);
    x.strokeStyle=c.neon2; x.lineWidth=1.4; x.setLineDash([5,4]); x.beginPath(); x.moveTo(ex,ey); x.lineTo(ex+Math.cos(EA(0))*mr*2.4,ey+Math.sin(EA(0))*mr*2.4); x.stroke();
    const sunDir=Math.atan2(ey-sy,ex-sx); x.strokeStyle=c.gold; x.beginPath(); x.moveTo(ex,ey); x.lineTo(ex+Math.cos(sunDir)*mr*2.4,ey+Math.sin(sunDir)*mr*2.4); x.stroke(); x.setLineDash([]);
    x.fillStyle=c.neon2; x.textAlign='left'; x.fillText('✦ '+T(TX.toM),ex+Math.cos(EA(0))*mr*2.4+4,ey+Math.sin(EA(0))*mr*2.4-4);
    x.fillStyle='#3f7fe0'; x.beginPath(); x.arc(ex,ey,9,0,TAU); x.fill();
    x.fillStyle='#2a2d3a'; x.beginPath(); x.arc(mx,my,7,0,TAU); x.fill(); x.fillStyle='#f3efe2'; x.beginPath(); x.arc(mx,my,7,sunDir+Math.PI/2,sunDir+1.5*Math.PI); x.fill();
    const el=((sunDir-ma)%TAU+TAU)%TAU;
    $('#t6SV').textContent=fmtN(sd,2)+' '+T(TX.dd);
    $('#t6SKv').innerHTML=kv('T (siderik)','27,32 '+T(TX.dd))+kv('Y','365,25 '+T(TX.dd))+kv('S (sinodik)','29,53 '+T(TX.dd),true)
      +kv(T(X('Yer siljidi','Земля сместилась','Earth moved')),fmtN(sd/365.25*360,1)+'°')+kv(T(TX.ph),T(PHN[phIdx(((el/TAU)*SYN+SYN/2)%SYN)])); });
  $('#t6S').oninput=e=>{ sd=+e.target.value; mark('sp',''); drawSyn(); };
  on('sp',v=>{ sd=+v; $('#t6S').value=sd; mark('sp',v); drawSyn(); });
  let sL=0; const sStep=n=>{ if(!sRun) return; const dt=Math.min(.05,(n-sL)/1000); sL=n; sd+=dt*2.5; if(sd>SYN) sd=0; $('#t6S').value=sd; drawSyn(); K.rafs.syn=requestAnimationFrame(sStep); };
  $('#t6SP').onclick=()=>{ sRun=!sRun; $('#t6SP').textContent=sRun?'⏸':'▶'; click(700); if(sRun){ sL=performance.now(); K.rafs.syn=requestAnimationFrame(sStep); } };

  /* 03 · Tutilishlar */
  let ek='sol';
  const drawEcl=K.draw(function(){ const cv=$('#t6Ecl'); const {x,w,h}=fit(cv,.42,300), c=C(); x.fillStyle='#03050f'; x.fillRect(0,0,w,h); const cy=h/2;
    const sunR=h*.34, sunX=sunR*.55;
    const g=x.createRadialGradient(sunX,cy,0,sunX,cy,sunR*1.3); g.addColorStop(0,'#fff3c4'); g.addColorStop(.7,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(sunX,cy,sunR*1.3,0,TAU); x.fill();
    const lab=(s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11.5px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
    const cone=(bx,br,tipX,col)=>{ x.fillStyle=col; x.beginPath(); x.moveTo(bx,cy-br); x.lineTo(tipX,cy); x.lineTo(bx,cy+br); x.closePath(); x.fill(); };
    if(ek==='sol'){ const mX=w*.55, mR=h*.06, eX=w*.86, eR=h*.3;
      const pen=x.createLinearGradient(mX,0,w,0); pen.addColorStop(0,'rgba(120,130,170,.45)'); pen.addColorStop(1,'rgba(120,130,170,.18)');
      const k=(sunR+mR)/(mX-sunX); x.fillStyle=pen; x.beginPath(); x.moveTo(mX,cy-mR); x.lineTo(w,cy-mR-(w-mX)*k*.35); x.lineTo(w,cy+mR+(w-mX)*k*.35); x.lineTo(mX,cy+mR); x.closePath(); x.fill();
      x.fillStyle='#16304f'; x.beginPath(); x.arc(eX,cy,eR,0,TAU); x.fill(); x.fillStyle='#2c5ea8'; x.beginPath(); x.arc(eX,cy,eR,Math.PI/2,Math.PI*1.5); x.fill();
      cone(mX,mR,eX-eR+6,'rgba(0,0,0,.92)');
      x.fillStyle='#bdbdbd'; x.beginPath(); x.arc(mX,cy,mR,0,TAU); x.fill();
      lab(T(X('Oy','Луна','Moon')),mX,cy-mR-10,'#e8edff'); lab(T(X('Yer','Земля','Earth')),eX+eR*.4,cy+eR+16>h?h-6:cy+eR+14,'#e8edff');
      const pA=eX-eR*Math.cos(.35), aY=cy-eR*Math.sin(.35), bY=cy+eR*Math.sin(.35);
      [['A',pA,aY-6],['O',eX-eR-12,cy+4],['B',pA,bY+14]].forEach(([n,px,py])=>lab(n,px,py,'#ffc65c'));
      lab(T(TX.umb),(mX+eX-eR)/2,cy+4,'#9aa6cc'); lab(T(TX.pen),(mX+eX-eR)/2,cy-mR-26,'#9aa6cc'); }
    else { const eX=w*.52, eR=h*.16, mX=w*.86, mR=h*.07, tip=eX+(w*.9);
      x.fillStyle='rgba(120,130,170,.28)'; x.beginPath(); x.moveTo(eX,cy-eR); x.lineTo(w,cy-eR-(w-eX)*.18); x.lineTo(w,cy+eR+(w-eX)*.18); x.lineTo(eX,cy+eR); x.closePath(); x.fill();
      x.fillStyle='rgba(0,0,0,.85)'; x.beginPath(); x.moveTo(eX,cy-eR); x.lineTo(w,cy-eR*.55); x.lineTo(w,cy+eR*.55); x.lineTo(eX,cy+eR); x.closePath(); x.fill();
      x.fillStyle='#16304f'; x.beginPath(); x.arc(eX,cy,eR,0,TAU); x.fill(); x.fillStyle='#2c5ea8'; x.beginPath(); x.arc(eX,cy,eR,Math.PI/2,Math.PI*1.5); x.fill();
      x.strokeStyle='rgba(120,190,255,.5)'; x.lineWidth=3; x.beginPath(); x.arc(eX,cy,eR+2,0,TAU); x.stroke();
      x.fillStyle='#8a2a17'; x.beginPath(); x.arc(mX,cy,mR,0,TAU); x.fill();
      x.strokeStyle='rgba(160,180,255,.35)'; x.setLineDash([4,5]); x.lineWidth=1; x.beginPath(); x.ellipse(eX,cy,mX-eX,mR*1.6,0,-.35,.35); x.stroke(); x.setLineDash([]);
      lab('1 · '+T(X('Quyosh','Солнце','Sun')),sunX,cy+sunR+18>h?h-6:cy+sunR+14,'#e8edff'); lab('2 · '+T(X('Yer','Земля','Earth')),eX,cy+eR+16,'#e8edff'); lab('3 · '+T(X('Oy','Луна','Moon')),mX,cy-mR-10,'#ffb08a');
      lab(T(TX.umb),(eX+mX)/2-10,cy+4,'#9aa6cc'); lab(T(TX.pen),(eX+mX)/2,cy-eR-18,'#9aa6cc'); }
    const v=$('#t6EV'); v.style.display=ek==='sol'?'':'none';
    if(ek==='sol'){ const o=fit(v,.18,130), xx=o.x, W=o.w, H=o.h, r=Math.min(W/10,H*.32);
      xx.fillStyle='#071030'; xx.fillRect(0,0,W,H);
      [[-.9,1,TX.vA],[0,1,TX.vO],[.9,1,TX.vB],[0,.86,TX.vR]].forEach(([off,ms,lb],i)=>{ const cx=W*(i+.5)/4, cy2=H*.42; xx.fillStyle='#ffd27a'; xx.beginPath(); xx.arc(cx,cy2,r,0,TAU); xx.fill();
        if(i===1){ xx.strokeStyle='rgba(255,240,210,.55)'; xx.lineWidth=5; xx.beginPath(); xx.arc(cx,cy2,r+3,0,TAU); xx.stroke(); }
        xx.fillStyle='#071030'; xx.beginPath(); xx.arc(cx+off*r,cy2,r*ms*1.02,0,TAU); xx.fill();
        xx.fillStyle='#e8edff'; xx.font='600 11px system-ui,sans-serif'; xx.textAlign='center'; xx.fillText(T(lb),cx,H-10); }); }
    mark('ek',ek); $('#t6ED').innerHTML=T(ek==='sol'?TX.solD:TX.lunD); });
  on('ek',v=>{ ek=v; drawEcl(); });
  const drawNode=K.draw(function(){ const cv=$('#t6Node'); const {x,w,h}=fit(cv,.34,240), c=C(), d=+$('#t6N').value, cy=h/2, eX=w*.82, mX=w*.5;
    const beta=Math.asin(Math.sin(5.145*D2R)*Math.sin(d*D2R))/D2R, k=h*.38/5.145*0.9, my=cy-beta*k;
    x.strokeStyle=c.brd; x.lineWidth=1.2; x.beginPath(); x.moveTo(10,cy); x.lineTo(w-10,cy); x.stroke(); x.fillStyle=c.dim; x.font='10.5px system-ui,sans-serif'; x.textAlign='left'; x.fillText(T(X('Ekliptika tekisligi','Плоскость эклиптики','Ecliptic plane')),12,cy-6);
    x.fillStyle='#ffc34d'; x.beginPath(); x.arc(22,cy,12,0,TAU); x.fill();
    x.fillStyle='#3f7fe0'; x.beginPath(); x.arc(eX,cy,h*.1,0,TAU); x.fill();
    const solar=d<16.5, lunar=d<10.6;
    x.strokeStyle=solar?c.gold:c.dim; x.lineWidth=1.2; x.setLineDash(solar?[]:[4,4]); x.beginPath(); x.moveTo(mX,my); x.lineTo(eX,cy-beta*k*.15); x.stroke(); x.setLineDash([]);
    x.fillStyle='#bdbdbd'; x.beginPath(); x.arc(mX,my,7,0,TAU); x.fill(); x.fillStyle=c.text; x.textAlign='center'; x.fillText(T(X('Oy','Луна','Moon'))+' · β = '+dms(beta),mX,my-12);
    $('#t6NV').textContent=fmtN(d,1)+'°';
    $('#t6NKv').innerHTML=kv(T(TX.beta),dms(beta))+kv(T(TX.solY)+' (< 16,5°)',T(solar?TX.yes:TX.no))+kv(T(TX.lunY)+' (< 10,6°)',T(lunar?TX.yes:TX.no)); });
  $('#t6N').oninput=drawNode;

  /* 04 · Taqvimlar */
  function conv(){ const v=$('#t6Dt').value; if(!v) return; const [y,m,d]=v.split('-').map(Number); mark('dt',v); const jd=jdAny(y,m,d), [hy,hm,hd]=toHijri(jd), [sy,sm,sdd]=toSolarH(y,m,d);
    $('#t6DKv').innerHTML=kv(T(TX.greg),K0.dLbl((Date.UTC(2026,m-1,d)-Date.UTC(2026,0,1))/86400000,L)+' '+y+(y<1582?' ('+T(X('yulian','юлианский','Julian'))+')':''))+kv(T(TX.hij),hy>0?hd+' '+HM[L][hm-1]+' '+hy:'—')+kv(T(TX.shj),sy>0?sdd+' '+SM[L][sm]+' '+sy:'—'); }
  $('#t6Dt').oninput=conv; on('dt',v=>{ $('#t6Dt').value=v; conv(); }); conv();

  K.bindQA(); K.quiz($('#t6Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK) return setTimeout(add,50); window.DARSLIK.add({ id:'t06', GL, QZ, ico:'🌙', title:TX.title, sub:TX.sub, build }); };
add();
})();
