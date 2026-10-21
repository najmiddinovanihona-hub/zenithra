/* DARSLIK · 5-mavzu (13–14-§). Vaqtni o'lchash asoslari. Kalendarlar */
(function(){
const K0=window.DZK, X=K0.X, D2R=K0.D2R, TAU=K0.TAU;
const TX={
  title:X('Vaqtni o‘lchash asoslari. Kalendarlar','Основы измерения времени. Календари','Measuring time. Calendars'),
  sub:X('13–14-§ · Quyosh soati, yulduz va Quyosh sutkasi, mahalliy, dunyo va poyas vaqti, yulian va grigorian kalendarlari','§13–14 · Солнечные часы, звёздные и солнечные сутки, местное, всемирное и поясное время, юлианский и григорианский календари','§13–14 · Sundials, sidereal and solar days, local, universal and zone time, Julian and Gregorian calendars'),
  intro:X('Kishilar vaqtni o‘lchashga juda qadimdan ehtiyoj sezgan. Jism soyasining kun davomida yo‘nalishi va uzunligi o‘zgarishini bilib, undan soat sifatida foydalanganlar. Keyinchalik eng qulay usul — <b>Yerning o‘z o‘qi atrofida to‘la aylanish davriga</b> tayanib vaqtni o‘lchash topildi; undan hozir ham foydalanamiz.',
    'Потребность измерять время появилась очень давно. Зная, что тень предмета меняет направление и длину в течение дня, люди использовали её как часы. Позже самым удобным оказался способ, основанный на <b>периоде вращения Земли вокруг оси</b>; им пользуются и сейчас.',
    'People needed to measure time from the earliest days. Knowing that a shadow changes direction and length during the day, they used it as a clock. Later the handiest method turned out to be based on <b>the Earth’s rotation period</b> — and we still use it.'),
  s1:X('Quyosh soati: soya vaqtni ko‘rsatadi','Солнечные часы: тень показывает время','The sundial: a shadow tells the time'),
  s1D:X('Gorizontal tekislikka tik o‘rnatilgan 1 metrli tayoqning soyasi. Soatni sursangiz, soya Quyosh harakatiga qarama-qarshi tomonga buriladi va tushda eng qisqa bo‘ladi. Nuqtali egri chiziq — kun davomida soya uchining izi.','Тень вертикального шеста высотой 1 м. Сдвиньте время: тень поворачивается противоположно Солнцу и в полдень самая короткая. Пунктир — путь конца тени за день.','The shadow of a 1-metre vertical stick. Move the time: the shadow swings opposite the Sun and is shortest at noon. The dotted curve is the path of the shadow tip during the day.'),
  time:X('Quyosh vaqti','Солнечное время','Solar time'), date:X('Sana','Дата','Date'), today:X('Bugun','Сегодня','Today'),
  alt:X('Quyosh balandligi','Высота Солнца','Sun’s height'), az:X('Quyosh tomoni','Сторона Солнца','Sun’s direction'), shad:X('Soya uzunligi','Длина тени','Shadow length'), night:X('Quyosh gorizont ostida','Солнце под горизонтом','Sun below horizon'),
  s2:X('Yulduz sutkasi va Quyosh sutkasi','Звёздные и солнечные сутки','Sidereal and solar days'),
  s2D:X('<b>Yulduz sutkasi</b> — Yerning biror yulduzga nisbatan to‘la aylanish davri. Kundalik hayotimiz Quyoshga bog‘liq, shuning uchun <b>Quyosh sutkasi</b> — Quyoshning ikki marta ketma-ket yuqori kulminatsiyasi (tush) orasidagi vaqt asos qilib olingan. Yer bir sutkada orbitasi bo‘ylab ≈1° siljigani uchun Quyoshni yana meridianga keltirishga biroz ko‘proq aylanish kerak. Quyosh sutkasi yil davomida biroz o‘zgaradi, shuning uchun o‘rtachasi olinib, 24 soat deb belgilangan.',
    '<b>Звёздные сутки</b> — период вращения Земли относительно какой-либо звезды. Наша жизнь связана с Солнцем, поэтому за основу приняты <b>солнечные сутки</b> — время между двумя последовательными верхними кульминациями (полуднями) Солнца. Так как за сутки Земля смещается по орбите на ≈1°, чтобы Солнце снова оказалось на меридиане, нужно повернуться чуть больше. Солнечные сутки за год немного меняются, поэтому берут их среднее — 24 часа.',
    'A <b>sidereal day</b> is one turn of the Earth relative to a star. Our lives follow the Sun, so the <b>solar day</b> — the time between two successive noons — is used. Because the Earth moves ≈1° along its orbit each day, it must turn a little extra to bring the Sun back to the meridian. Solar days vary slightly over the year, so their average is fixed at 24 hours.'),
  hours:X('O‘tgan vaqt','Прошло','Elapsed'), sidD:X('Yulduz sutkasi','Звёздные сутки','Sidereal day'), solD:X('Quyosh sutkasi','Солнечные сутки','Solar day'), diff:X('Farq','Разница','Difference'),
  toStar:X('yulduzga','к звезде','to the star'), toSun:X('Quyoshga','к Солнцу','to the Sun'),
  exag:X('Rasmda Yerning orbitadagi siljishi 10 marta kattalashtirilgan.','На рисунке смещение Земли по орбите увеличено в 10 раз.','Earth’s orbital shift is drawn 10× larger.'),
  s3:X('Mahalliy, dunyo va poyas vaqti','Местное, всемирное и поясное время','Local, universal and zone time'),
  s3D:X('Har bir meridianning o‘z <b>mahalliy vaqti</b> bor: λ₁ − λ₂ = T₁ − T₂. Grinvich meridianining mahalliy vaqti — <b>dunyo vaqti T₀</b>, demak T_λ = T₀ + λ. Cheksiz ko‘p mahalliy vaqtdan foydalanib bo‘lmaydi, shuning uchun Yer shari o‘rtacha 15° li <b>24 poyasga</b> bo‘lingan (0 dan 23 gacha). N-poyas vaqti — uning o‘rtasidan o‘tgan asosiy meridianning mahalliy vaqti: T_p = T_m − λ_m + Nʰ.',
    'У каждого меридиана своё <b>местное время</b>: λ₁ − λ₂ = T₁ − T₂. Местное время Гринвичского меридиана — <b>всемирное время T₀</b>, поэтому T_λ = T₀ + λ. Пользоваться бесчисленными местными временами неудобно, поэтому Земля разделена на <b>24 пояса</b> по ~15° (с 0 по 23). Время N-го пояса — местное время его центрального меридиана: T_p = T_m − λ_m + Nʰ.',
    'Every meridian has its own <b>local time</b>: λ₁ − λ₂ = T₁ − T₂. The local time of Greenwich is <b>universal time T₀</b>, so T_λ = T₀ + λ. Countless local times are impractical, so the globe is split into <b>24 zones</b> of ~15° (numbered 0–23). Zone N’s time is the local time of its central meridian: T_p = T_m − λ_m + Nʰ.'),
  city:X('Joy','Место','Place'), ut:X('Dunyo vaqti T₀','Всемирное время T₀','Universal time T₀'), lt:X('Mahalliy vaqt T_m','Местное время T_m','Local time T_m'), zt:X('Poyas vaqti T_p','Поясное время T_p','Zone time T_p'),
  lon:X('Uzunlama λ','Долгота λ','Longitude λ'), zone:X('Poyas','Пояс','Zone'), dline:X('Sanani o‘zgartirish chizig‘i','Линия перемены дат','Date line'), now:X('Hozir','Сейчас','Now'),
  zNote:X('Amalda davlatlar poyas chegaralarini o‘z hududiga moslab oladi.','На практике границы поясов подстраивают под границы стран.','In practice countries adjust zone borders to fit their territory.'),
  s4:X('Kalendarlar','Календари','Calendars'),
  s4D:X('Uzoq muddatni sutka, hafta, oy va yillar bo‘yicha sistemaga solish — <b>kalendar</b>. Oy fazalarining almashinish davri (29,53 sutka) asos qilingan taqvimlar — <b>oy kalendarlari</b>, yil fasllarining almashinish davri (tropik yil) asos qilinganlari — <b>quyosh kalendarlari</b>.',
    'Система счёта длительных промежутков сутками, неделями, месяцами и годами — <b>календарь</b>. Календари на основе смены фаз Луны (29,53 сут) — <b>лунные</b>, на основе смены времён года (тропического года) — <b>солнечные</b>.',
    'A <b>calendar</b> organises long spans into days, weeks, months and years. Calendars built on the cycle of lunar phases (29.53 days) are <b>lunar</b>; those built on the cycle of seasons (the tropical year) are <b>solar</b>.'),
  driftT:X('Kalendar yili tropik yildan qancha orqada qoladi','Насколько календарный год расходится с тропическим','How far each calendar drifts from the tropical year'),
  driftC:X('Tropik yil — 365,2422 sutka. Yulian kalendarida 1 sutka xato ≈128 yilda, grigorianda ≈3300 yilda yig‘iladi.','Тропический год — 365,2422 сут. В юлианском календаре ошибка в 1 сутки набегает за ≈128 лет, в григорианском — за ≈3300 лет.','The tropical year is 365.2422 days. The Julian calendar gains a 1-day error in ≈128 years, the Gregorian in ≈3,300.'),
  yrs:X('yil','лет','years'), days:X('sutka','сут','days'), jul:X('Yulian (365,25)','Юлианский (365,25)','Julian (365.25)'), gre:X('Grigorian (365,2425)','Григорианский (365,2425)','Gregorian (365.2425)'),
  leapT:X('Kabisa yilini tekshiring','Проверьте високосный год','Check a leap year'), yr:X('Yil','Год','Year'),
  leapR:X('Yulian: har 4-yil kabisa. Grigorian: 4 ga bo‘linadigan yillar kabisa, lekin 100 ga bo‘linib, 400 ga bo‘linmaydiganlari (1700, 1800, 1900) oddiy.','Юлианский: каждый 4-й год високосный. Григорианский: високосны годы, кратные 4, но кратные 100 и не кратные 400 (1700, 1800, 1900) — простые.','Julian: every 4th year is leap. Gregorian: years divisible by 4 are leap, except those divisible by 100 but not 400 (1700, 1800, 1900).'),
  leap:X('kabisa (366 kun)','високосный (366 дней)','leap (366 days)'), comm:X('oddiy (365 kun)','простой (365 дней)','common (365 days)'),
  monT:X('Oylar nomlari qayerdan kelgan','Откуда названия месяцев','Where the month names come from'),
  monC:X('Qadimda yil boshi 1-martda kirgan, shuning uchun sentabr — «yettinchi», dekabr — «o‘ninchi». Keyin yil boshi 1-yanvarga ko‘chirildi; Rossiyada bu 1700-yilda Pyotr I buyrug‘i bilan bo‘ldi.','В древности год начинался 1 марта, поэтому сентябрь — «седьмой», декабрь — «десятый». Позже начало года перенесли на 1 января; в России — в 1700 году указом Петра I.','The year once began on March 1, so September is the “seventh” and December the “tenth”. Later New Year moved to January 1 — in Russia in 1700 by Peter I’s decree.')
};
const HIST=[[X('Mil. avv. ~3000-y.','~3000 г. до н. э.','~3000 BC'),X('Qadimgi Misr: yil 360 kun, 12 oy × 30 kun. Keyin 365 kun: 11 oy 30 kundan, 12-oy 35 kun.','Древний Египет: год 360 дней, 12 месяцев по 30. Затем 365: 11 месяцев по 30 и 12-й — 35 дней.','Ancient Egypt: a 360-day year of 12 × 30 days, later 365 days with a 35-day 12th month.')],
  [X('Mil. avv. III asr','III в. до н. э.','3rd c. BC'),X('Misr astronomlari yil uzunligi 365,25 kun ekanini aniqladi.','Египетские астрономы установили длину года — 365,25 дня.','Egyptian astronomers found the year is 365.25 days.')],
  [X('Mil. avv. I asr','I в. до н. э.','1st c. BC'),X('Yuliy Sezar 365,25 kunlik <b>yulian kalendari</b>ni joriy qildi: 3 yil 365 kun, 4-yil 366 kun (qo‘shimcha kun — fevralga).','Юлий Цезарь ввёл <b>юлианский календарь</b> на 365,25 дня: 3 года по 365, 4-й — 366 (лишний день — в феврале).','Julius Caesar introduced the 365.25-day <b>Julian calendar</b>: three years of 365 days, the fourth 366 (extra day in February).')],
  [X('1582-y. fevral','Февраль 1582 г.','Feb 1582'),X('Rim papasi Grigoriy XIII aniqroq qiymat (365,242 kun) asosida <b>grigorian kalendari</b>ni kiritdi — biz hozir ishlatadigan taqvim.','Папа Григорий XIII на основе более точного значения (365,242 дня) ввёл <b>григорианский календарь</b> — тот, которым мы пользуемся.','Pope Gregory XIII introduced the <b>Gregorian calendar</b> based on a more precise 365.242 days — the one we use today.')],
  [X('1700-y.','1700 г.','1700'),X('Pyotr I buyrug‘i bilan Rossiyada yil boshi 1-yanvarga ko‘chirildi.','Указом Петра I в России начало года перенесено на 1 января.','By Peter I’s decree, New Year in Russia moved to January 1.')]];
const MONO=[[X('Yanvar','Январь','January'),X('Yanus xudosi','бог Янус','the god Janus')],[X('Fevral','Февраль','February'),X('Februus xudosi','бог Фебруус','the god Februus')],[X('Mart','Март','March'),X('Mars xudosi','бог Марс','the god Mars')],[X('Aprel','Апрель','April'),X('«aperire» — ochilish, uyg‘onish','«aperire» — открываться, пробуждаться','“aperire” — to open, to awaken')],
  [X('May','Май','May'),X('Maya ma’budasi','богиня Майя','the goddess Maia')],[X('Iyun','Июнь','June'),X('Yunona ma’budasi','богиня Юнона','the goddess Juno')],[X('Iyul','Июль','July'),X('imperator Yuliy Sezar','император Юлий Цезарь','Emperor Julius Caesar')],[X('Avgust','Август','August'),X('imperator Avgust','император Август','Emperor Augustus')],
  [X('Sentabr','Сентябрь','September'),X('«yettinchi»','«седьмой»','“seventh”')],[X('Oktabr','Октябрь','October'),X('«sakkizinchi»','«восьмой»','“eighth”')],[X('Noyabr','Ноябрь','November'),X('«to‘qqizinchi»','«девятый»','“ninth”')],[X('Dekabr','Декабрь','December'),X('«o‘ninchi»','«десятый»','“tenth”')]];
const XC=[[X('Grinvich (London)','Гринвич (Лондон)','Greenwich (London)'),51.48,0],[X('Nyu-York','Нью-Йорк','New York'),40.71,-74.0],[X('Dehli','Дели','Delhi'),28.61,77.21],[X('Pekin','Пекин','Beijing'),39.9,116.4],[X('Tokio','Токио','Tokyo'),35.69,139.69],[X('Sidney','Сидней','Sydney'),-33.87,151.21]];
const GL=[
 [X('Yulduz sutkasi','Звёздные сутки','Sidereal day'),X('Yerning biror yulduzga nisbatan o‘z o‘qi atrofida to‘la aylanish davri (≈ 23ʰ56ᵐ).','Период вращения Земли относительно звезды (≈ 23ʰ56ᵐ).','Earth’s rotation period relative to a star (≈ 23ʰ56ᵐ).')],
 [X('Quyosh sutkasi','Солнечные сутки','Solar day'),X('Quyoshning ikki marta ketma-ket yuqori kulminatsiyasi (tushi) orasidagi vaqt; o‘rtachasi 24 soat.','Время между двумя последовательными верхними кульминациями Солнца; в среднем 24 ч.','The time between two successive noons; 24 h on average.')],
 [X('Quyosh vaqti','Солнечное время','Solar time'),X('Quyosh markazi quyi kulminatsiyadan osmonning ma’lum nuqtasigacha ketgan vaqt, Quyosh sutkasi ulushlarida.','Время от нижней кульминации центра Солнца до данной точки, в долях солнечных суток.','Time since the Sun’s centre passed lower culmination, in fractions of a solar day.')],
 [X('Mahalliy vaqt','Местное время','Local time'),X('Berilgan meridianga tegishli vaqt; λ₁ − λ₂ = T₁ − T₂.','Время данного меридиана; λ₁ − λ₂ = T₁ − T₂.','The time of a given meridian; λ₁ − λ₂ = T₁ − T₂.')],
 [X('Dunyo vaqti T₀','Всемирное время T₀','Universal time T₀'),X('Grinvich (0°) meridianining mahalliy vaqti; T_λ = T₀ + λ.','Местное время Гринвичского (0°) меридиана; T_λ = T₀ + λ.','Local time of the Greenwich (0°) meridian; T_λ = T₀ + λ.')],
 [X('Poyas vaqti','Поясное время','Zone time'),X('Poyas o‘rtasidagi asosiy meridianning mahalliy vaqti; T_p = T_m − λ_m + Nʰ.','Местное время центрального меридиана пояса; T_p = T_m − λ_m + Nʰ.','Local time of the zone’s central meridian; T_p = T_m − λ_m + Nʰ.')],
 [X('Tropik yil','Тропический год','Tropical year'),X('Yil fasllarining almashinish davri — 365,2422 sutka.','Период смены времён года — 365,2422 сут.','The cycle of the seasons — 365.2422 days.')],
 [X('Yulian kalendari','Юлианский календарь','Julian calendar'),X('Yil 365,25 kun: har 4-yil kabisa (366 kun). Yuliy Sezar joriy qilgan.','Год 365,25 дня: каждый 4-й — високосный. Ввёл Юлий Цезарь.','A 365.25-day year: every 4th is leap. Introduced by Julius Caesar.')],
 [X('Grigorian kalendari','Григорианский календарь','Gregorian calendar'),X('1582-yilda Grigoriy XIII isloh qilgan, yil ≈ 365,2425 kun; hozirgi taqvim.','Реформирован Григорием XIII в 1582 г., год ≈ 365,2425 дня; современный календарь.','Reformed by Gregory XIII in 1582, year ≈ 365.2425 days; today’s calendar.')]
];
const QA=[
 [X('Vaqtni o‘lchashda qaysi osmon jismining davri asos qilib olinadi?','Период какого тела положен в основу измерения времени?','Which body’s period is used to measure time?'),X('Yerning o‘z o‘qi atrofida aylanish davri (Quyoshga nisbatan — Quyosh sutkasi).','Период вращения Земли вокруг оси (относительно Солнца — солнечные сутки).','The Earth’s rotation period (relative to the Sun — the solar day).')],
 [X('Yulduz va Quyosh sutkalari qanday topiladi? Ular tengmi?','Как определяются звёздные и солнечные сутки? Равны ли они?','How are sidereal and solar days defined? Are they equal?'),X('Yulduz sutkasi — biror yulduzga nisbatan to‘la aylanish, Quyosh sutkasi — ketma-ket ikki tush orasi. Teng emas: Yer orbitada siljigani uchun Quyosh sutkasi ≈ 4 minut uzunroq.','Звёздные — оборот относительно звезды, солнечные — между двумя полуднями. Не равны: из-за движения Земли по орбите солнечные сутки длиннее ≈ на 4 минуты.','Sidereal: one turn relative to a star; solar: noon to noon. Not equal — because Earth moves along its orbit, the solar day is ≈ 4 minutes longer.')],
 [X('Mahalliy va dunyo vaqtlari deb qanday vaqtlarga aytiladi?','Что такое местное и всемирное время?','What are local and universal time?'),X('Mahalliy — berilgan meridian vaqti; dunyo vaqti — Grinvich meridianining mahalliy vaqti T₀.','Местное — время данного меридиана; всемирное — местное время Гринвича T₀.','Local: the time of a given meridian; universal: Greenwich local time T₀.')],
 [X('Poyas vaqti qanday topiladi? Vaqtlar orasida qanday bog‘lanish bor?','Как находят поясное время? Как связаны эти времена?','How is zone time found and how are the times related?'),X('Poyas o‘rtasidagi meridianning mahalliy vaqti: T_p = T_m − λ_m + Nʰ yoki T_m = T_p − Nʰ + λ_m.','Местное время центрального меридиана пояса: T_p = T_m − λ_m + Nʰ или T_m = T_p − Nʰ + λ_m.','The local time of the zone’s central meridian: T_p = T_m − λ_m + Nʰ, or T_m = T_p − Nʰ + λ_m.')],
 [X('Kalendarlarni tuzishda qaysi osmon jismlarining davrlari asos qilinadi?','Периоды каких тел лежат в основе календарей?','Which bodies’ periods underlie calendars?'),X('Oy (fazalar almashinish davri, 29,53 sutka) va Quyosh (yil fasllari davri — tropik yil).','Луна (смена фаз, 29,53 сут) и Солнце (смена времён года — тропический год).','The Moon (phase cycle, 29.53 days) and the Sun (the seasons — the tropical year).')],
 [X('Oyning sinodik davri asos qilingan kalendarlar qanday ataladi? Tropik yil asos qilinganlari-chi?','Как называются календари на основе синодического месяца? А тропического года?','What are calendars based on the synodic month called? And on the tropical year?'),X('Oy kalendarlari; tropik yil asosidagilari — quyosh kalendarlari.','Лунные; на основе тропического года — солнечные.','Lunar calendars; those based on the tropical year are solar.')],
 [X('Yulian va grigorian kalendarlari haqida nimalar bilasiz?','Что вы знаете о юлианском и григорианском календарях?','What do you know about the Julian and Gregorian calendars?'),X('Yulian — mil. avv. I asrda Yuliy Sezar joriy qilgan, yil 365,25 kun. Grigorian — 1582-yilda Grigoriy XIII isloh qilgan, yil 365,242 kun asosida; hozir ishlatiladi.','Юлианский ввёл Юлий Цезарь в I в. до н. э., год 365,25 дня. Григорианский — реформа Григория XIII 1582 г. на основе 365,242 дня; используется сейчас.','The Julian was introduced by Julius Caesar in the 1st century BC (365.25 days). The Gregorian is Gregory XIII’s 1582 reform based on 365.242 days; used today.')]
];
const QZ=[
 [X('Yulduz sutkasi Quyosh sutkasidan qanday?','Как соотносятся звёздные и солнечные сутки?','How does the sidereal day compare with the solar day?'),[X('≈ 4 minut qisqa','Короче ≈ на 4 минуты','≈ 4 minutes shorter'),X('Teng','Равны','Equal'),X('≈ 1 soat uzun','Длиннее ≈ на час','≈ 1 hour longer')]],
 [X('Dunyo vaqti qaysi meridianning mahalliy vaqti?','Местное время какого меридиана — всемирное время?','Universal time is the local time of which meridian?'),[X('Grinvich (0°)','Гринвичского (0°)','Greenwich (0°)'),X('Toshkent','Ташкентского','Tashkent'),X('180° meridian','180°','The 180° meridian')]],
 [X('Yer shari nechta vaqt poyasiga bo‘lingan?','На сколько часовых поясов разделена Земля?','How many time zones is the globe divided into?'),[X('24','24','24'),X('12','12','12'),X('36','36','36')]],
 [X('Ikki joy uzunlamasi 15° farq qilsa, mahalliy vaqtlari farqi:','Если долготы различаются на 15°, разность местных времён:','If longitudes differ by 15°, local times differ by:'),[X('1 soat','1 час','1 hour'),X('15 minut','15 минут','15 minutes'),X('4 minut','4 минуты','4 minutes')]],
 [X('Yulian kalendarida yil uzunligi:','Длина года в юлианском календаре:','Year length in the Julian calendar:'),[X('365,25 kun','365,25 дня','365.25 days'),X('365,2425 kun','365,2425 дня','365.2425 days'),X('354 kun','354 дня','354 days')]],
 [X('Grigorian kalendari qachon joriy qilingan?','Когда введён григорианский календарь?','When was the Gregorian calendar introduced?'),[X('1582-yilda','В 1582 г.','In 1582'),X('Mil. avv. I asrda','В I в. до н. э.','In the 1st century BC'),X('1700-yilda','В 1700 г.','In 1700')]],
 [X('Grigorian kalendarida 1900-yil qanday yil?','Каким был 1900 год по григорианскому календарю?','What kind of year was 1900 in the Gregorian calendar?'),[X('Oddiy (365 kun)','Простой (365 дней)','Common (365 days)'),X('Kabisa (366 kun)','Високосный (366 дней)','Leap (366 days)'),X('354 kunlik','354-дневный','354 days')]],
 [X('«Dekabr» so‘zining asl ma’nosi:','Исходное значение слова «декабрь»:','The original meaning of “December”:'),[X('o‘ninchi','десятый','tenth'),X('o‘n ikkinchi','двенадцатый','twelfth'),X('qishki','зимний','wintry')]]
];

function build(el, api){
  const K=K0.kit(el,api), {T,L,click,$,$$,fmtN,dms,hm,C,fit,sec,chips,mark,on,kv}=K;
  const now=new Date(), todayDoy=Math.min(364,Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(now.getFullYear(),0,1))/86400000));
  const myLoc=window.LAB&&window.LAB.loc?window.LAB.loc():{lat:41.3,lon:69.24}, myLat=+myLoc.lat||41.3, myName=window.LAB&&window.LAB.locName?window.LAB.locName(myLoc):'Toshkent';
  const CITIES=[...XC.map(c=>({n:c[0],lat:c[1],lon:c[2]})),...((window.LAB&&window.LAB.CITIES)||[]).map(c=>({n:c.n,lat:c.lat,lon:c.lon}))];
  const tsk=CITIES.findIndex(c=>T(c.n)===T(X('Toshkent','Ташкент','Tashkent')));
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t5Dial"></canvas></div>
    <div class="t1-side">
      <label class="t1-ctl"><span>${T(TX.time)}: <b id="t5HV"></b></span><input type="range" class="lab-range" id="t5H" min="4" max="20" step="0.1" value="10"></label>
      <div class="lab-row" style="margin:0">${chips('sd',K0.KEYD.map(([d,t])=>[d,T(t)]))}<button class="lab-chip" data-sd="${todayDoy}">📍 ${T(TX.today)}</button></div>
      <div class="lab-kv" id="t5DKv"></div><p class="t1-cap">📍 ${myName} · φ = ${fmtN(myLat,1)}°</p>
    </div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-split">
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t5Sid"></canvas><div class="lab-row"><button class="lab-chip" id="t5SP">▶</button><span class="t1-lab">${T(TX.hours)}: <b id="t5SV"></b></span><input type="range" class="lab-range" id="t5S" min="0" max="24.8" step="0.01" value="0" style="flex:1"></div><p class="t1-cap">${T(TX.exag)}</p></div>
    <div class="t1-side"><div class="lab-kv" id="t5SKv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p>
    <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.city)}</span><select class="lab-date" id="t5City">${CITIES.map((c,i)=>`<option value="${i}"${i===tsk?' selected':''}>${T(c.n)} (${c.lon>=0?'+':'−'}${fmtN(Math.abs(c.lon),1)}°)</option>`).join('')}</select>
      <span class="t1-lab">${T(TX.ut)}: <b id="t5UV"></b></span><input type="range" class="lab-range" id="t5U" min="0" max="23.99" step="0.0167" style="flex:1;min-width:140px"><button class="lab-chip" id="t5Now">🕐 ${T(TX.now)}</button></div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t5Clk"></canvas></div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t5Zones"></canvas><p class="t1-cap">${T(TX.zNote)}</p></div>
    <div class="lab-kv t2-kv5" id="t5ZKv"></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p>
    <div class="t5-hist">${HIST.map(h=>`<div class="dz-card"><span class="dz-badge">${T(h[0])}</span><p class="t1-p">${T(h[1])}</p></div>`).join('')}</div>
    <div class="t1-two">
      <div class="dz-card t1-chart"><h4>${T(TX.driftT)}</h4><canvas class="t1-cv" id="t5Drift"></canvas><p class="t1-cap">${T(TX.driftC)}</p></div>
      <div class="dz-card t4-m"><h4>${T(TX.leapT)}</h4><div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.yr)}</span><input type="number" class="lab-date" id="t5Y" min="1" max="9999" value="${now.getFullYear()}" style="width:110px">${chips('yy',[[1900,'1900'],[2000,'2000'],[2024,'2024'],[2100,'2100']])}</div><div class="lab-kv" id="t5YKv"></div><p class="t1-cap">${T(TX.leapR)}</p></div></div>
    <div class="dz-card t4-m"><h4>${T(TX.monT)}</h4><div class="t5-mon">${MONO.map((m,i)=>`<div><b>${i+1}. ${T(m[0])}</b><span>${T(m[1])}</span></div>`).join('')}</div><p class="t1-cap">${T(TX.monC)}</p></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t5Quiz"></div>`)}`;

  /* 01 · Quyosh soati */
  let sday=todayDoy;
  const sunAt=(H,dec)=>{ const f=myLat*D2R, d=dec*D2R, h=(H-12)*15*D2R, sh=Math.sin(f)*Math.sin(d)+Math.cos(f)*Math.cos(d)*Math.cos(h), alt=Math.asin(sh);
    const az=Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(f)-Math.tan(d)*Math.cos(f)); return {alt,az}; };
  const drawDial=K.draw(function(){ const cv=$('#t5Dial'); const {x,w,h}=fit(cv,.8,420), c=C(), dec=K0.sunDec(sday), H=+$('#t5H').value;
    const cx=w/2, cy=h*.42, R=Math.min(w,h)*.42, k=R/3.2;
    x.fillStyle=c.day?'#e6dcc6':'#121a33'; x.beginPath(); x.arc(cx,cy,R,0,TAU); x.fill(); x.strokeStyle=c.brd; x.lineWidth=1.4; x.stroke();
    x.font='700 12px system-ui,sans-serif'; x.fillStyle=c.dim; x.textAlign='center'; [['N',0,-1],['S',0,1],['E',1,0],['W',-1,0]].forEach(([n,a,b])=>x.fillText(n,cx+a*(R+12),cy+b*(R+12)+4));
    const sp=(alt,az)=>{ const L=1/Math.tan(alt), dir=az+Math.PI; return [cx-Math.sin(dir)*L*k, cy+Math.cos(dir)*L*k, L]; };
    x.font='10.5px system-ui,sans-serif';
    for(let t=5;t<=19;t++){ const s=sunAt(t,dec); if(s.alt<=.02) continue; const p=sp(s.alt,s.az), ang=Math.atan2(p[1]-cy,p[0]-cx);
      x.strokeStyle=c.brd; x.lineWidth=1; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.cos(ang)*R,cy+Math.sin(ang)*R); x.stroke();
      x.fillStyle=c.dim; x.fillText(String(t),cx+Math.cos(ang)*(R-12),cy+Math.sin(ang)*(R-12)+4); }
    x.save(); x.beginPath(); x.arc(cx,cy,R,0,TAU); x.clip();
    x.strokeStyle=c.gold; x.setLineDash([2,4]); x.lineWidth=1.4; x.beginPath(); let f=true; for(let t=4;t<=20;t+=.1){ const s=sunAt(t,dec); if(s.alt<.05){ f=true; continue; } const p=sp(s.alt,s.az); f?x.moveTo(p[0],p[1]):x.lineTo(p[0],p[1]); f=false; } x.stroke(); x.setLineDash([]);
    const s=sunAt(H,dec);
    if(s.alt>.02){ const p=sp(s.alt,s.az); x.strokeStyle=c.day?'rgba(40,30,20,.75)':'rgba(0,0,0,.85)'; x.lineWidth=5; x.lineCap='round'; x.beginPath(); x.moveTo(cx,cy); x.lineTo(p[0],p[1]); x.stroke(); }
    x.restore();
    x.fillStyle=c.text; x.beginPath(); x.arc(cx,cy,5,0,TAU); x.fill();
    if(s.alt>.02){ x.fillStyle='#ffc34d'; x.beginPath(); x.arc(cx-Math.sin(s.az)*R,cy+Math.cos(s.az)*R,7,0,TAU); x.fill(); }
    const hh=Math.floor(H), mi=Math.round((H-hh)*60);
    $('#t5HV').textContent=hh+':'+String(mi===60?0:mi).padStart(2,'0'); mark('sd',sday);
    const dirs=[X('janub','юг','S'),X('janubi-g‘arb','юго-запад','SW'),X('g‘arb','запад','W'),X('shimoli-g‘arb','северо-запад','NW'),X('shimol','север','N'),X('shimoli-sharq','северо-восток','NE'),X('sharq','восток','E'),X('janubi-sharq','юго-восток','SE')];
    const dName=dirs[((Math.round(s.az/D2R/45)%8)+8)%8];
    $('#t5DKv').innerHTML=s.alt>.02?kv(T(TX.alt),fmtN(s.alt/D2R,1)+'°')+kv(T(TX.az),T(dName))+kv(T(TX.shad)+' (1 m)',fmtN(1/Math.tan(s.alt),2)+' m',true):kv(T(TX.alt),T(TX.night),true); });
  $('#t5H').oninput=drawDial; on('sd',v=>{ sday=+v; drawDial(); });

  /* 02 · Yulduz va Quyosh sutkasi */
  let sh=0, sRun=false;
  const drawSid=K.draw(function(){ const cv=$('#t5Sid'); const {x,w,h}=fit(cv,.7,380), c=C();
    const sx=w*.22, sy=h*.62, OR=w*.62, oa0=-Math.PI*.04, oa=oa0-sh/24*(TAU/365.25)*10, ex=sx+OR*Math.cos(oa), ey=sy+OR*Math.sin(oa), er=Math.min(w,h)*.1;
    const sidP=23.9345, rot=sh/sidP*TAU;
    x.strokeStyle=c.brd; x.lineWidth=1.2; x.setLineDash([4,5]); x.beginPath(); x.arc(sx,sy,OR,-Math.PI*.22,Math.PI*.05); x.stroke(); x.setLineDash([]);
    const g=x.createRadialGradient(sx,sy,0,sx,sy,34); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(sx,sy,34,0,TAU); x.fill();
    x.fillStyle=c.text; x.font='600 11px system-ui,sans-serif'; x.textAlign='center'; x.fillText(T(X('Quyosh','Солнце','Sun')),sx,sy+48);
    const e0x=sx+OR*Math.cos(oa0), e0y=sy+OR*Math.sin(oa0); x.globalAlpha=.35; x.fillStyle='#3f7fe0'; x.beginPath(); x.arc(e0x,e0y,er*.5,0,TAU); x.fill(); x.globalAlpha=1;
    x.fillStyle='#3f7fe0'; x.beginPath(); x.arc(ex,ey,er,0,TAU); x.fill();
    const sunDir=Math.atan2(sy-ey,sx-ex), starDir=Math.atan2(sy-e0y,sx-e0x);
    x.strokeStyle=c.gold; x.lineWidth=1.4; x.setLineDash([5,4]); x.beginPath(); x.moveTo(ex,ey); x.lineTo(ex+Math.cos(sunDir)*er*3,ey+Math.sin(sunDir)*er*3); x.stroke();
    x.strokeStyle=c.neon2; x.beginPath(); x.moveTo(ex,ey); x.lineTo(ex+Math.cos(starDir)*er*3,ey+Math.sin(starDir)*er*3); x.stroke(); x.setLineDash([]);
    x.fillStyle=c.gold; x.textAlign='left'; x.fillText('☀ '+T(TX.toSun),ex+Math.cos(sunDir)*er*3+4,ey+Math.sin(sunDir)*er*3+14);
    x.fillStyle=c.neon2; x.fillText('✦ '+T(TX.toStar),ex+Math.cos(starDir)*er*3+4,ey+Math.sin(starDir)*er*3-6);
    const md=starDir-rot; x.strokeStyle=c.text; x.lineWidth=3; x.beginPath(); x.moveTo(ex,ey); x.lineTo(ex+Math.cos(md)*er*1.6,ey+Math.sin(md)*er*1.6); x.stroke();
    x.fillStyle=c.text; x.beginPath(); x.arc(ex+Math.cos(md)*er,ey+Math.sin(md)*er,4,0,TAU); x.fill();
    $('#t5SV').textContent=hm(sh);
    const ang=v=>Math.abs(((v%TAU)+TAU*1.5)%TAU-Math.PI), atStar=sh>1&&ang(md-starDir)<.02, atSun=sh>1&&ang(md-sunDir)<.02;
    $('#t5SKv').innerHTML=kv(T(TX.sidD),'23ʰ56ᵐ04ˢ')+kv(T(TX.solD),'24ʰ00ᵐ00ˢ')+kv(T(TX.diff),'≈ 3ᵐ56ˢ ≈ 1°',true)
      +kv(T(TX.hours),hm(sh)+(atStar?' · ✦ '+T(TX.sidD):'')+(atSun?' · ☀ '+T(TX.solD):''),true); });
  $('#t5S').oninput=e=>{ sh=+e.target.value; drawSid(); };
  let sLast=0; const sStep=n=>{ if(!sRun) return; const dt=Math.min(.05,(n-sLast)/1000); sLast=n; sh+=dt*3; if(sh>24.8) sh=0; $('#t5S').value=sh; drawSid(); K.rafs.sid=requestAnimationFrame(sStep); };
  $('#t5SP').onclick=()=>{ sRun=!sRun; $('#t5SP').textContent=sRun?'⏸':'▶'; click(700); if(sRun){ sLast=performance.now(); K.rafs.sid=requestAnimationFrame(sStep); } };

  /* 03 · Vaqt poyaslari */
  let ut=now.getUTCHours()+now.getUTCMinutes()/60;
  const wrap=v=>((v%24)+24)%24;
  function clock(x,cx,cy,r,hrs,label,col,c){ x.fillStyle=c.day?'#f6f1e6':'#0e1430'; x.beginPath(); x.arc(cx,cy,r,0,TAU); x.fill(); x.strokeStyle=col; x.lineWidth=2; x.stroke();
    x.strokeStyle=c.dim; x.lineWidth=1; for(let i=0;i<12;i++){ const a=i/12*TAU; x.beginPath(); x.moveTo(cx+Math.sin(a)*r*.86,cy-Math.cos(a)*r*.86); x.lineTo(cx+Math.sin(a)*r*.96,cy-Math.cos(a)*r*.96); x.stroke(); }
    const H=wrap(hrs), ha=(H%12)/12*TAU, ma=(H%1)*TAU;
    x.strokeStyle=c.text; x.lineCap='round'; x.lineWidth=3.5; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.sin(ha)*r*.5,cy-Math.cos(ha)*r*.5); x.stroke();
    x.lineWidth=2; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.sin(ma)*r*.78,cy-Math.cos(ma)*r*.78); x.stroke();
    x.fillStyle=col; x.beginPath(); x.arc(cx,cy,3.5,0,TAU); x.fill();
    const hh=Math.floor(H), mm=Math.floor((H-hh)*60+1e-6);
    x.fillStyle=c.text; x.font='800 16px system-ui,sans-serif'; x.textAlign='center'; x.fillText(String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0'),cx,cy+r+22);
    x.fillStyle=col; x.font='600 11.5px system-ui,sans-serif'; x.fillText(label,cx,cy+r+38); }
  const drawZ=K.draw(function(){ const ci=CITIES[+$('#t5City').value], lonH=ci.lon/15, N=Math.round(lonH), Tm=ut+lonH, Tp=ut+N;
    { const cv=$('#t5Clk'); const {x,w,h}=fit(cv,.3,200), c=C(), r=Math.min(w/8,h*.3), cy=r+10;
      clock(x,w/6,cy,r,ut,T(TX.ut),c.neon2,c); clock(x,w/2,cy,r,Tm,T(TX.lt),c.gold,c); clock(x,w*5/6,cy,r,Tp,T(TX.zt),c.neon,c); }
    { const cv=$('#t5Zones'); const {x,w,h}=fit(cv,.22,170), c=C(), pl=8, pr=8, top=20, bot=h-34, X0=l=>pl+(l+180)/360*(w-pl-pr);
      for(let z=-12;z<=12;z++){ const a=Math.max(-180,z*15-7.5), b=Math.min(180,z*15+7.5); x.fillStyle=z===N?(c.day?'rgba(45,92,174,.28)':'rgba(78,168,255,.32)'):(((z%2)+2)%2?(c.day?'rgba(95,75,45,.07)':'rgba(255,255,255,.04)'):(c.day?'rgba(95,75,45,.14)':'rgba(255,255,255,.09)')); x.fillRect(X0(a),top,X0(b)-X0(a),bot-top);
        if(z%3===0){ x.fillStyle=c.dim; x.font='10px system-ui,sans-serif'; x.textAlign='center'; x.fillText((z>0?'+':z<0?'−':'')+Math.abs(z),X0(z*15),bot+13); } }
      x.strokeStyle=c.gold; x.lineWidth=1.2; x.setLineDash([4,3]); x.beginPath(); x.moveTo(X0(180)-1,top); x.lineTo(X0(180)-1,bot); x.stroke(); x.setLineDash([]);
      x.fillStyle=c.gold; x.font='10px system-ui,sans-serif'; x.textAlign='right'; x.fillText(T(TX.dline)+' 180°',X0(180)-4,top-6);
      const mk=(l,lab,col,up)=>{ x.strokeStyle=col; x.lineWidth=2; x.beginPath(); x.moveTo(X0(l),top); x.lineTo(X0(l),bot); x.stroke(); x.fillStyle=col; x.font='700 11px system-ui,sans-serif'; x.textAlign=l>120?'right':'left'; x.fillText(lab,X0(l)+(l>120?-4:4),up?top+13:bot-6); };
      mk(0,'Grinvich 0°',c.neon2,true); mk(ci.lon,T(ci.n),c.gold,false);
      x.fillStyle=c.dim; x.font='10px system-ui,sans-serif'; x.textAlign='left'; x.fillText('UTC',pl,bot+26); }
    $('#t5UV').textContent=hm(ut);
    const d=lonH-N;
    $('#t5ZKv').innerHTML=kv(T(TX.lon),(ci.lon>=0?'+':'−')+fmtN(Math.abs(ci.lon),2)+'° = '+hm(lonH,true))+kv(T(TX.zone)+' N',(N>=0?'+':'−')+Math.abs(N)+' (№ '+((N%24)+24)%24+')')+kv('T_m = T₀ + λ',hm(wrap(Tm)))+kv('T_p = T₀ + Nʰ',hm(wrap(Tp)))+kv('T_m − T_p = λ − Nʰ',hm(d,true)); });
  $('#t5City').onchange=drawZ; $('#t5U').value=ut; $('#t5U').oninput=e=>{ ut=+e.target.value; drawZ(); };
  $('#t5Now').onclick=()=>{ click(720); const n=new Date(); ut=n.getUTCHours()+n.getUTCMinutes()/60; $('#t5U').value=ut; drawZ(); };

  /* 04 · Kalendarlar */
  K.draw(function(){ const cv=$('#t5Drift'); const {x,w,h}=fit(cv,.62,320), c=C(), pl=34, pr=12, pt=12, pb=28, X0=y=>pl+y/5000*(w-pl-pr), Y0=d=>pt+(3-d)/3*(h-pt-pb);
    x.font='10.5px system-ui,sans-serif'; x.strokeStyle=c.brd; x.lineWidth=1;
    for(let d=0;d<=3;d++){ x.beginPath(); x.moveTo(pl,Y0(d)); x.lineTo(w-pr,Y0(d)); x.stroke(); x.fillStyle=c.dim; x.textAlign='right'; x.fillText(d,pl-5,Y0(d)+3.5); }
    for(let y=0;y<=5000;y+=1000){ x.fillStyle=c.dim; x.textAlign='center'; x.fillText(y,X0(y),h-10); }
    const ln=(r,col,lab)=>{ const yEnd=Math.min(5000,3/r); x.strokeStyle=col; x.lineWidth=2.4; x.beginPath(); x.moveTo(X0(0),Y0(0)); x.lineTo(X0(yEnd),Y0(yEnd*r)); x.stroke(); x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign='left'; x.fillText(lab,X0(yEnd)+6>w-120?X0(yEnd)-110:X0(yEnd)+6,Y0(yEnd*r)+(yEnd<5000?12:-6)); };
    x.setLineDash([3,4]); x.strokeStyle=c.dim; x.beginPath(); x.moveTo(pl,Y0(1)); x.lineTo(w-pr,Y0(1)); x.stroke(); x.setLineDash([]);
    ln(365.25-365.2422,'#e0604f',T(TX.jul)); ln(365.2425-365.2422,c.neon,T(TX.gre));
    x.fillStyle=c.dim; x.textAlign='left'; x.fillText(T(TX.days),pl+4,pt+10); x.textAlign='right'; x.fillText(T(TX.yrs),w-pr,h-22); });
  function leap(){ const y=Math.round(+$('#t5Y').value||0); mark('yy',y); const jl=y%4===0, gl=y%4===0&&(y%100!==0||y%400===0);
    $('#t5YKv').innerHTML=kv(T(X('Yulian','Юлианский','Julian')),T(jl?TX.leap:TX.comm))+kv(T(X('Grigorian','Григорианский','Gregorian')),T(gl?TX.leap:TX.comm)); }
  $('#t5Y').oninput=leap; on('yy',v=>{ $('#t5Y').value=v; leap(); }); leap();

  K.bindQA(); K.quiz($('#t5Quiz'),QZ);
  return K.start();
}
const add=()=>{ if(!window.DARSLIK||!window.DZK) return setTimeout(add,50); window.DARSLIK.add({ id:'t05', GL, QZ, ico:'🕰', title:TX.title, sub:TX.sub, build }); };
add();
})();
