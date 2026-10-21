/* DARSLIK · 36-mavzu (71–72-§). Orbital manyovrlar. Orbita tekisligini o'zgartirish. Yo'ldoshni orbitadan tushirish */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU, D2R=K0.D2R;
const KE=3.986e5, RE=6371, KLIM=2*Math.asin(Math.SQRT2-1)/D2R;
const TX={
 title:X('Orbital manyovrlar. Orbita tekisligini o‘zgartirish. Yo‘ldoshni orbitadan tushirish','Орбитальные манёвры. Изменение плоскости орбиты. Спуск спутника с орбиты','Orbital manoeuvres. Changing the orbital plane. De-orbiting a satellite'),
 sub:X('71–72-§ · Δυ = 2υ₀ sin(α/2), joyida burish va «cheksizlik orqali burish», chegaraviy burchak 48°54′, tushishning uch uchastkasi, kirish burchagi, ballistik va aerodinamik tushish, aerodinamik sifat k = c_y/c_x','§71–72 · Δυ = 2υ₀ sin(α/2), поворот на месте и «поворот через бесконечность», предельный угол 48°54′, три участка спуска, угол входа, баллистический и аэродинамический спуск, аэродинамическое качество k = c_y/c_x','§71–72 · Δυ = 2υ₀ sin(α/2), turning in place and “turning via infinity”, the limiting angle 48°54′, three stages of descent, entry angle, ballistic and lifting descent, lift-to-drag ratio k = c_y/c_x'),
 intro:X('Sun’iy yo‘ldosh orbitasini ma’lum maqsadda har qanday o‘zgartirish — tezlatish, tormozlash yoki burish — <b>orbital manyovr</b> deyiladi. Bunda dvigatel KAga <b>tezlik impulsi</b> Δυ beradi; manyovrning «narxi» — shu Δυ ning kattaligi, ya’ni sarflanadigan yonilg‘i.','Любое целенаправленное изменение орбиты спутника — разгон, торможение или поворот — называют <b>орбитальным манёвром</b>. Двигатель сообщает КА <b>импульс скорости</b> Δυ; «цена» манёвра — величина Δυ, то есть расход топлива.','Any deliberate change of a satellite’s orbit — speeding up, braking or turning — is an <b>orbital manoeuvre</b>. The engine gives the craft a <b>velocity impulse</b> Δυ; the manoeuvre’s “price” is the size of Δυ, i.e. the propellant burned.'),
 s1:X('1-metod: orbita tekisligini joyida burish','Метод 1: поворот плоскости на месте','Method 1: turning the plane in place'),
 s1D:X('Aylanma orbitada υ₀ tezlik bilan harakatlanayotgan SY tezligining qiymatini o‘zgartirmasdan orbitasini α burchakka burish uchun υ₀, natijaviy υ_n.t va Δυ vektorlari teng yonli uchburchak hosil qiladi (121-rasm): <b>Δυ = 2υ₀·sin(α/2)</b> (1). α = 90° bo‘lsa, <b>Δυ = √2·υ₀</b> (2) — ya’ni ikkinchi kosmik tezlikka teng! Orbitani bunday burish juda katta energiya talab qiladi.','Чтобы повернуть круговую орбиту ИС со скоростью υ₀ на угол α, не меняя величины скорости, векторы υ₀, результирующей υ_р и Δυ образуют равнобедренный треугольник (рис. 121): <b>Δυ = 2υ₀·sin(α/2)</b> (1). При α = 90° <b>Δυ = √2·υ₀</b> (2) — равно второй космической скорости! Такой поворот требует огромной энергии.','To turn a circular orbit (speed υ₀) by angle α without changing the speed, the vectors υ₀, the resulting υ_r and Δυ form an isosceles triangle (Fig. 121): <b>Δυ = 2υ₀·sin(α/2)</b> (1). For α = 90°, <b>Δυ = √2·υ₀</b> (2) — equal to the second cosmic velocity! Such a turn costs enormous energy.'),
 al:X('Burilish burchagi α','Угол поворота α','Turn angle α'), h:X('Orbita balandligi h','Высота орбиты h','Orbit height h'), v0:X('Orbital tezlik υ₀','Орбитальная скорость υ₀','Orbital speed υ₀'), dv:X('Kerakli impuls Δυ','Нужный импульс Δυ','Required impulse Δυ'),
 s2:X('2-metod: «cheksizlik orqali burish»','Метод 2: «поворот через бесконечность»','Method 2: “turning via infinity”'),
 s2D:X('Yo‘ldosh avval parabolik orbitaga yaqin trayektoriyaga chiqariladi (+(√2−1)υ₀). Cheksizlikda tezligi nolga yaqin, shuning uchun tekislikni burish uchun impuls Δu ham (1) ga ko‘ra nolga intiladi. Qaytib kelgach, parabolik tezlik yana υ₀ gacha kamaytiriladi (−(√2−1)υ₀). Jami: <b>Δυ′ = 2(√2 − 1)·υ₀ ≈ 0,83·υ₀</b> (3) — burchakka bog‘liq emas. (2) va (3) ni tenglab chegaraviy burchak topiladi: <b>α ≈ 48°54′</b> (6). Bundan katta burchakka burishda «cheksizlik orqali» burish tejamli, kichikroq burchakda esa joyida burish.','Сначала спутник переводят на почти параболическую траекторию (+(√2−1)υ₀). На бесконечности скорость близка к нулю, поэтому импульс поворота Δu по (1) тоже стремится к нулю. После возвращения параболическую скорость снова уменьшают до υ₀ (−(√2−1)υ₀). Итого: <b>Δυ′ = 2(√2 − 1)·υ₀ ≈ 0,83·υ₀</b> (3) — не зависит от угла. Приравнивая (2) и (3), находим предельный угол <b>α ≈ 48°54′</b> (6). Для больших углов выгоднее «через бесконечность», для меньших — на месте.','First the satellite is sent onto a nearly parabolic path (+(√2−1)υ₀). Far away its speed is almost zero, so by (1) the turning impulse Δu also tends to zero. On return the parabolic speed is cut back to υ₀ (−(√2−1)υ₀). Total: <b>Δυ′ = 2(√2 − 1)·υ₀ ≈ 0.83·υ₀</b> (3), independent of the angle. Equating (2) and (3) gives the limiting angle <b>α ≈ 48°54′</b> (6). Beyond it “via infinity” is cheaper; below it, turn in place.'),
 m1:X('Joyida burish','Поворот на месте','Turn in place'), m2:X('Cheksizlik orqali','Через бесконечность','Via infinity'), best:X('Tejamli usul','Выгоднее','Cheaper method'), lim:X('chegara','предел','limit'),
 s3:X('Yo‘ldoshni orbitadan tushirish','Спуск спутника с орбиты','De-orbiting a satellite'),
 s3D:X('Orbital manyovrlarning eng soddasi — KAni Yerga tushirish. Trayektoriya uch qismga bo‘linadi (122-rasm). <b>I — pasayish</b>: tormozlovchi impulsdan so‘ng KA orbitadan juda kichik burchak ostida chiqib, atmosferaning qalin qatlami chegarasigacha (shartli ravishda ≈ 100 km) tushadi. Tejamli bo‘lishi uchun chiqish nuqtasidan kirishgacha ≈ 180° yoy olinadi, kirish burchagi ≈ 5°; impulsning transversal tashkil etuvchisidan tashqari Yer tomon radial tashkil etuvchi ham kerak, jami 150–200 m/s dan kam emas. <b>II — qalin atmosferadan o‘tish</b>: ortiqcha yuklama bir necha g ga yetadi, korpus keskin qiziydi, tezlik birinchi kosmikdan 150–250 m/s gacha kamayadi. <b>III — qo‘nish</b>: trayektoriya Yer markazi tomon keskin buriladi, qarshilik og‘irlik kuchi proyeksiyasiga tenglashadi; parashut ochiladi. Quyidagi model faqat transversal tormozlashni hisoblaydi.','Простейший орбитальный манёвр — спуск КА на Землю. Траектория делится на три участка (рис. 122). <b>I — снижение</b>: после тормозного импульса КА сходит с орбиты под очень малым углом и опускается до границы плотных слоёв атмосферы (условно ≈ 100 км). Для экономии от точки схода до входа берут дугу ≈ 180°, угол входа ≈ 5°; кроме трансверсальной составляющей импульса нужна и радиальная к Земле, в сумме не менее 150–200 м/с. <b>II — проход плотной атмосферы</b>: перегрузки достигают нескольких g, корпус сильно нагревается, скорость падает с первой космической до 150–250 м/с. <b>III — посадка</b>: траектория круто поворачивает к центру Земли, сопротивление уравнивает проекцию силы тяжести; раскрывается парашют. Модель ниже учитывает только трансверсальное торможение.','The simplest manoeuvre is bringing a craft back to Earth. The path has three stages (Fig. 122). <b>I — descent</b>: after a braking impulse the craft leaves orbit at a very shallow angle and falls to the top of the dense atmosphere (taken as ≈ 100 km). For economy the arc from de-orbit to entry is ≈ 180° and the entry angle ≈ 5°; besides the transverse part of the impulse a radial part toward Earth is needed, in total not less than 150–200 m/s. <b>II — passage through dense air</b>: loads reach several g, the hull heats strongly and speed drops from orbital to 150–250 m/s. <b>III — landing</b>: the path turns steeply toward Earth’s centre, drag balances the weight component, and the parachute opens. The model below includes only transverse braking.'),
 db:X('Tormozlovchi impuls Δυ','Тормозной импульс Δυ','Braking impulse Δυ'), h0:X('Orbita balandligi','Высота орбиты','Orbit height'), ent:X('100 km dagi kirish burchagi','Угол входа на 100 км','Entry angle at 100 km'), ve:X('Kirish tezligi','Скорость входа','Entry speed'), arc:X('Chiqishdan kirishgacha yoy','Дуга от схода до входа','Arc from de-orbit to entry'), hpp:X('Yangi perigey balandligi','Новая высота перигея','New perigee height'), stay:X('atmosferaga yetmaydi','не достигает атмосферы','misses the atmosphere'), exag:X('balandliklar 10× kattalashtirilgan','высоты увеличены в 10×','heights exaggerated 10×'),
 s4:X('Ballistik va aerodinamik tushish','Баллистический и аэродинамический спуск','Ballistic and lifting descent'),
 s4D:X('Qarshilik va ko‘tarish kuchlari: <b>F_qarsh = c_x·S·ρυ²/2</b>, <b>F_ko‘tar = c_y·S·ρυ²/2</b>. Ularning nisbati — <b>aerodinamik sifat</b>: <b>k = F_ko‘tar / F_qarsh = c_y / c_x</b>. c_y = 0 bo‘lsa, tushish <b>ballistik</b> (aerodinamik sifatsiz): yuklama koeffitsiyenti 8–10, qobiq keskin qiziydi — ekipaj uchun xavfli. Ko‘tarish kuchi ishtirok etsa, yuklama 3–4 gacha kamayadi. «Soyuz» tipidagi kemalarda 9,5 km balandlikda parashut tizimi ochiladi, yerga 1 m qolganda qattiq yonilg‘ili dvigatellar ishga tushib, kema 3–4 m/s tezlik bilan ohista qo‘nadi.','Силы сопротивления и подъёмная: <b>F_сопр = c_x·S·ρυ²/2</b>, <b>F_под = c_y·S·ρυ²/2</b>. Их отношение — <b>аэродинамическое качество</b>: <b>k = F_под / F_сопр = c_y / c_x</b>. При c_y = 0 спуск <b>баллистический</b>: коэффициент перегрузки 8–10, оболочка сильно нагревается — опасно для экипажа. С подъёмной силой перегрузка снижается до 3–4. На кораблях типа «Союз» парашютная система вводится на высоте 9,5 км, а за 1 м до земли включаются твердотопливные двигатели, и корабль садится со скоростью 3–4 м/с.','Drag and lift: <b>F_drag = c_x·S·ρυ²/2</b>, <b>F_lift = c_y·S·ρυ²/2</b>. Their ratio is the <b>lift-to-drag ratio</b> <b>k = F_lift / F_drag = c_y / c_x</b>. With c_y = 0 the descent is <b>ballistic</b>: the load factor is 8–10 and the shell heats severely — dangerous for the crew. With lift, the load falls to 3–4. Soyuz-type craft open their parachutes at 9.5 km, and 1 m above the ground solid-fuel engines fire so the capsule touches down at 3–4 m/s.'),
 cx:X('c_x','c_x','c_x'), cy:X('c_y','c_y','c_y'), kk:X('Aerodinamik sifat k','Аэродинамическое качество k','Lift-to-drag ratio k'), mode:X('Tushish turi','Тип спуска','Descent type'), load:X('Yuklama koeffitsiyenti','Коэффициент перегрузки','Load factor'),
 mBal:X('ballistik (aerodinamik sifatsiz)','баллистический (без качества)','ballistic (no lift)'), mAer:X('aerodinamik sifat bilan','с аэродинамическим качеством','lifting (with L/D)'),
 st:[X('Tormozlovchi impuls · orbitadan chiqish','Тормозной импульс · сход с орбиты','Braking burn · leaving orbit'),X('≈ 100 km · qalin atmosferaga ≈ 5° burchak bilan kirish','≈ 100 км · вход в плотные слои под ≈ 5°','≈ 100 km · entering dense air at ≈ 5°'),X('Aerodinamik tormozlanish · qizish, yuklama','Аэродинамическое торможение · нагрев, перегрузка','Aerobraking · heating, high loads'),X('9,5 km · parashut tizimi','9,5 км · парашютная система','9.5 km · parachute system'),X('1 m · yumshoq qo‘nish dvigatellari → 3–4 m/s','1 м · двигатели мягкой посадки → 3–4 м/с','1 m · soft-landing engines → 3–4 m/s')]
};
const GL=[
 [X('Orbital manyovr','Орбитальный манёвр','Orbital manoeuvre'),X('Orbitani maqsadli o‘zgartirish: tezlatish, tormozlash, burish.','Целенаправленное изменение орбиты: разгон, торможение, поворот.','A deliberate change of orbit: speeding up, braking, turning.')],
 [X('Joyida burish','Поворот на месте','Turning in place'),X('Δυ = 2υ₀ sin(α/2); 90° uchun Δυ = √2·υ₀.','Δυ = 2υ₀ sin(α/2); для 90° Δυ = √2·υ₀.','Δυ = 2υ₀ sin(α/2); for 90° Δυ = √2·υ₀.')],
 [X('Cheksizlik orqali burish','Поворот через бесконечность','Turning via infinity'),X('Parabolik orbitaga chiqib, uzoqda burib, qaytgach tormozlash: Δυ′ ≈ 0,83·υ₀.','Выход на параболу, поворот вдали, торможение после возврата: Δυ′ ≈ 0,83·υ₀.','Go parabolic, turn far away, brake on return: Δυ′ ≈ 0.83·υ₀.')],
 [X('Chegaraviy burchak','Предельный угол','Limiting angle'),X('α ≈ 48°54′: bundan kattasida cheksizlik orqali burish tejamli.','α ≈ 48°54′: при больших углах выгоднее поворот через бесконечность.','α ≈ 48°54′: above it, turning via infinity is cheaper.')],
 [X('Tushish uchastkalari','Участки спуска','Descent stages'),X('I — orbitadan ≈ 100 km gacha; II — qalin atmosfera; III — qo‘nish.','I — с орбиты до ≈ 100 км; II — плотная атмосфера; III — посадка.','I — orbit to ≈ 100 km; II — dense atmosphere; III — landing.')],
 [X('Aerodinamik sifat k','Аэродинамическое качество k','Lift-to-drag ratio k'),X('k = c_y / c_x; c_y = 0 — ballistik tushish (yuklama 8–10), aks holda 3–4.','k = c_y / c_x; c_y = 0 — баллистический спуск (перегрузка 8–10), иначе 3–4.','k = c_y / c_x; c_y = 0 means ballistic descent (8–10 g), otherwise 3–4 g.')]
];
const QA=[
 [X('Orbital manyovrlar deganda nimani tushunasiz?','Что понимают под орбитальными манёврами?','What are orbital manoeuvres?'),X('Orbitani ma’lum maqsadda o‘zgartirish — tezlatish, tormozlash, burish; ular dvigatelning tezlik impulslari bilan bajariladi.','Целенаправленное изменение орбиты — разгон, торможение, поворот — импульсами двигателя.','Purposeful changes of an orbit — speeding up, braking, turning — made with engine impulses.')],
 [X('SY orbitasini joyida o‘zgartirish qanday bajariladi?','Как выполняется поворот орбиты на месте?','How is the orbit turned in place?'),X('Tezlik qiymatini saqlagan holda yo‘nalishini α ga burish: Δυ = 2υ₀ sin(α/2).','Поворачивают вектор скорости на α, сохраняя модуль: Δυ = 2υ₀ sin(α/2).','The velocity is rotated by α at constant magnitude: Δυ = 2υ₀ sin(α/2).')],
 [X('Orbitani cheksizlik orqali o‘zgartirish qanday hollarda tejamli?','Когда выгоден поворот через бесконечность?','When is turning via infinity cheaper?'),X('Burilish burchagi ≈ 48°54′ dan katta bo‘lganda.','Когда угол поворота больше ≈ 48°54′.','When the turn exceeds ≈ 48°54′.')],
 [X('SYni tushirishda orbitadan chiqish qanday amalga oshiriladi?','Как выполняется сход с орбиты при спуске?','How does a satellite leave orbit for descent?'),X('Tormozlovchi impuls beriladi: transversal va Yer tomon radial tashkil etuvchilar bilan, kamida 150–200 m/s; atmosferaga ≈ 180° yoydan so‘ng ≈ 5° burchak ostida kiradi.','Дают тормозной импульс с трансверсальной и радиальной (к Земле) составляющими, не менее 150–200 м/с; вход в атмосферу через ≈ 180° дуги под углом ≈ 5°.','A braking impulse with transverse and Earthward radial parts, at least 150–200 m/s; entry after ≈ 180° of arc at ≈ 5°.')],
 [X('Tushishning ikkinchi qismida tezlik qanday kamaytiriladi?','Как снижается скорость на втором участке?','How is speed reduced in the second stage?'),X('Atmosferada aerodinamik tormozlanish bilan — birinchi kosmik tezlikdan 150–250 m/s gacha.','Аэродинамическим торможением в атмосфере — с первой космической до 150–250 м/с.','By aerodynamic braking in the atmosphere — from orbital speed to 150–250 m/s.')],
 [X('Uchinchi qismida yo‘ldosh qanday qo‘ndiriladi?','Как спутник садится на третьем участке?','How does it land in the third stage?'),X('Parashut tizimi (Soyuz uchun 9,5 km da) va yerdan 1 m qolganda yumshoq qo‘nish dvigatellari — 3–4 m/s.','Парашютной системой (у «Союза» с 9,5 км) и двигателями мягкой посадки за 1 м до земли — 3–4 м/с.','By parachutes (from 9.5 km for Soyuz) and soft-landing engines 1 m above the ground — 3–4 m/s.')]
];
const QZ=[
 [X('Orbita tekisligini α ga joyida burish uchun:','Для поворота плоскости на α на месте:','To turn the plane by α in place:'),[X('Δυ = 2υ₀ sin(α/2)','Δυ = 2υ₀ sin(α/2)','Δυ = 2υ₀ sin(α/2)'),X('Δυ = υ₀ sin α','Δυ = υ₀ sin α','Δυ = υ₀ sin α'),X('Δυ = υ₀α','Δυ = υ₀α','Δυ = υ₀α')]],
 [X('90° ga burish uchun Δυ =','Для поворота на 90° Δυ =','For a 90° turn, Δυ ='),[X('√2·υ₀','√2·υ₀','√2·υ₀'),X('υ₀','υ₀','υ₀'),X('2υ₀','2υ₀','2υ₀')]],
 [X('Chegaraviy burchak:','Предельный угол:','The limiting angle:'),[X('≈ 48°54′','≈ 48°54′','≈ 48°54′'),X('90°','90°','90°'),X('30°','30°','30°')]],
 [X('«Cheksizlik orqali» burish narxi:','Цена поворота «через бесконечность»:','Cost of turning via infinity:'),[X('≈ 0,83·υ₀ (burchakka bog‘liq emas)','≈ 0,83·υ₀ (не зависит от угла)','≈ 0.83·υ₀ (independent of angle)'),X('2υ₀ sin(α/2)','2υ₀ sin(α/2)','2υ₀ sin(α/2)'),X('√2·υ₀','√2·υ₀','√2·υ₀')]],
 [X('Qalin atmosferaning shartli chegarasi:','Условная граница плотной атмосферы:','Conventional top of the dense atmosphere:'),[X('≈ 100 km','≈ 100 км','≈ 100 km'),X('≈ 400 km','≈ 400 км','≈ 400 km'),X('≈ 10 km','≈ 10 км','≈ 10 km')]],
 [X('Ballistik tushishda yuklama koeffitsiyenti:','Коэффициент перегрузки при баллистическом спуске:','Load factor in a ballistic descent:'),[X('8–10','8–10','8–10'),X('3–4','3–4','3–4'),X('1','1','1')]],
 [X('Aerodinamik sifat k =','Аэродинамическое качество k =','Lift-to-drag ratio k ='),[X('c_y / c_x','c_y / c_x','c_y / c_x'),X('c_x / c_y','c_x / c_y','c_x / c_y'),X('c_x · c_y','c_x · c_y','c_x · c_y')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,$,fmtN,C,fit,sec,chips,mark,on}=K;
  const kv=(k,v,f)=>K.kv(String(k).split(' ').map(w=>/[_\u0370-\u03FF\u2080-\u209F⊕☉∞′\/]|^[A-Za-z]$/.test(w)?'<span style="text-transform:none">'+w+'</span>':w).join(' '),v,f);
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const arrow=(x,x0,y0,x1,y1,col,lw)=>{ const a=Math.atan2(y1-y0,x1-x0), L=Math.hypot(x1-x0,y1-y0); if(L<2) return; x.strokeStyle=col; x.fillStyle=col; x.lineWidth=lw||2; x.beginPath(); x.moveTo(x0,y0); x.lineTo(x1,y1); x.stroke(); x.beginPath(); x.moveTo(x1,y1); x.lineTo(x1-9*Math.cos(a-.4),y1-9*Math.sin(a-.4)); x.lineTo(x1-9*Math.cos(a+.4),y1-9*Math.sin(a+.4)); x.closePath(); x.fill(); };
  const rng=(id,lab,min,max,step,val)=>`<label class="t1-ctl"><span>${T(lab)}: <b id="${id}V"></b></span><input type="range" class="lab-range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  const dm=d=>{ const g=Math.floor(d), m=Math.round((d-g)*60); return m===60?(g+1)+'°00′':g+'°'+String(m).padStart(2,'0')+'′'; };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-formula">Δυ = 2 υ₀ sin(α/2) · α = 90° → Δυ = √2 υ₀</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t36V"></canvas></div>
      <div class="t1-side">${rng('t36A',TX.al,0,180,1,30)}${rng('t36H',TX.h,200,36000,100,400)}<div class="lab-kv" id="t36VKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">Δυ′ = (√2υ₀ − υ₀) + Δu + (√2υ₀ − υ₀) ≈ 2(√2 − 1) υ₀</div>
    <div class="dz-card t1-chart"><canvas class="t1-cv" id="t36C"></canvas>
      <div class="t1-p" style="font-size:12px;margin:6px 0 0;display:flex;gap:16px;flex-wrap:wrap"><span style="color:#3f7fe0">━ ${T(TX.m1)}</span><span style="color:#d0861f">━ ${T(TX.m2)}</span></div><div class="lab-kv" id="t36CKv"></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p>
    <div class="dz-card t4-m">${rng('t36B',TX.db,20,600,5,200)}${rng('t36O',TX.h0,200,600,10,300)}<canvas class="t1-cv" id="t36D"></canvas><div class="lab-kv" id="t36DKv"></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-formula">k = F_ko‘tar / F_qarsh = c_y / c_x</div>
    <div class="t1-split"><div class="dz-card t4-m">${rng('t36X',TX.cx,.5,2,.05,1.3)}${rng('t36Y',TX.cy,0,.6,.01,.3)}<div class="lab-kv" id="t36KKv"></div></div>
      <div class="t1-side"><ol style="margin:0;padding-left:20px;display:grid;gap:8px" class="t1-p">${TX.st.map(s=>`<li>${T(s)}</li>`).join('')}</ol></div></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t36Quiz"></div>`)}`;

  /* 01 · Tezliklar uchburchagi */
  const dV=K.draw(function(){ const cv=$('#t36V'); const {x,w,h}=fit(cv,.75,340), c=C(), al=+$('#t36A').value*D2R, hh=+$('#t36H').value, v0=Math.sqrt(KE/(RE+hh)), dv=2*v0*Math.sin(al/2);
    const ox=w*.18, oy=h*.82, L=Math.min(w*.62,h*.68), p1=[ox+L,oy], p2=[ox+L*Math.cos(-al),oy+L*Math.sin(-al)];
    x.strokeStyle=c.brd; x.lineWidth=1; x.setLineDash([3,4]); x.beginPath(); x.arc(ox,oy,L,-Math.PI,0); x.stroke(); x.setLineDash([]);
    arrow(x,ox,oy,p1[0],p1[1],'#4f8fe8',2.4); arrow(x,ox,oy,p2[0],p2[1],'#5fd39a',2.4); arrow(x,p1[0],p1[1],p2[0],p2[1],'#e0952f',2.6);
    if(al>.02){ x.strokeStyle=c.text; x.lineWidth=1.2; x.beginPath(); x.arc(ox,oy,L*.22,-al,0); x.stroke(); lbl(x,'α',ox+L*.28*Math.cos(-al/2),oy+L*.28*Math.sin(-al/2)+4,c.text); }
    lbl(x,'υ₀',(ox+p1[0])/2,oy+18,'#4f8fe8'); lbl(x,'υ_n.t',(ox+p2[0])/2-14,(oy+p2[1])/2-6,'#3fae78'); lbl(x,'Δυ',(p1[0]+p2[0])/2+18,(p1[1]+p2[1])/2+4,'#d0861f'); dot(x,ox,oy,4,c.text);
    $('#t36AV').textContent=fmtN(al/D2R)+'°'; $('#t36HV').textContent=fmtN(hh)+' km';
    $('#t36VKv').innerHTML=kv(T(TX.v0),fmtN(v0,3)+' km/s')+kv(T(TX.dv),fmtN(dv,3)+' km/s',true)+kv('Δυ / υ₀',fmtN(dv/v0,3)); });

  /* 02 · Ikki usul */
  const dC=K.draw(function(){ const cv=$('#t36C'); const {x,w,h}=fit(cv,.42,260), c=C(), al=+$('#t36A').value, pl=40, pr=12, pt=12, pb=28, sx=a=>pl+a/180*(w-pl-pr), sy=r=>pt+(1-r/2)*(h-pt-pb), m2=2*(Math.SQRT2-1);
    x.fillStyle='rgba(79,143,232,.10)'; x.fillRect(pl,pt,sx(KLIM)-pl,h-pt-pb); x.fillStyle='rgba(255,179,71,.12)'; x.fillRect(sx(KLIM),pt,w-pr-sx(KLIM),h-pt-pb);
    [0,.5,1,1.5,2].forEach(r=>{ x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,sy(r)); x.lineTo(w-pr,sy(r)); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText(fmtN(r,1),pl-4,sy(r)+3); });
    [0,30,60,90,120,150,180].forEach(a=>lbl(x,a+'°',sx(a),h-12,c.dim)); lbl(x,'Δυ/υ₀',pl+4,pt+10,c.dim,'left');
    x.strokeStyle='#3f7fe0'; x.lineWidth=2.2; x.beginPath(); for(let a=0;a<=180;a++){ const y=sy(2*Math.sin(a*D2R/2)); a?x.lineTo(sx(a),y):x.moveTo(sx(a),y); } x.stroke();
    x.strokeStyle='#e0952f'; x.beginPath(); x.moveTo(sx(0),sy(m2)); x.lineTo(sx(180),sy(m2)); x.stroke();
    x.setLineDash([4,4]); x.strokeStyle=c.dim; x.lineWidth=1; x.beginPath(); x.moveTo(sx(KLIM),pt); x.lineTo(sx(KLIM),h-pb); x.stroke(); x.setLineDash([]); lbl(x,T(TX.lim)+' ≈ 48°54′',sx(KLIM)+5,pt+12,c.text,'left');
    x.strokeStyle=c.neon; x.lineWidth=1.5; x.beginPath(); x.moveTo(sx(al),pt); x.lineTo(sx(al),h-pb); x.stroke(); dot(x,sx(al),sy(2*Math.sin(al*D2R/2)),5,'#3f7fe0'); dot(x,sx(al),sy(m2),5,'#e0952f');
    const v0=Math.sqrt(KE/(RE+ +$('#t36H').value)), d1=2*v0*Math.sin(al*D2R/2), d2=m2*v0;
    $('#t36CKv').innerHTML=kv(T(TX.m1),fmtN(d1,3)+' km/s')+kv(T(TX.m2),fmtN(d2,3)+' km/s')+kv(T(TX.best),T(d1<=d2?TX.m1:TX.m2),true); });

  /* 03 · Orbitadan tushirish */
  const drawD=K.draw(function(){ const cv=$('#t36D'); const {x,w,h}=fit(cv,.6,400), db=+$('#t36B').value/1000, h0=+$('#t36O').value, r0=RE+h0, v0=Math.sqrt(KE/r0), va=v0-db, ex=10;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const Rd=Math.min(w,h)*.3, cx=w/2, cy=h/2, rr=r=>Rd*(1+(r-RE)/RE*ex);
    const g=x.createRadialGradient(cx-Rd*.3,cy-Rd*.3,0,cx,cy,Rd); g.addColorStop(0,'#6fb0ff'); g.addColorStop(1,'#16336a'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,Rd,0,TAU); x.fill();
    x.fillStyle='rgba(120,190,255,.16)'; x.beginPath(); x.arc(cx,cy,rr(RE+100),0,TAU); x.arc(cx,cy,Rd,0,TAU,true); x.fill();
    x.setLineDash([3,4]); x.strokeStyle='rgba(120,190,255,.6)'; x.lineWidth=1; x.beginPath(); x.arc(cx,cy,rr(RE+100),0,TAU); x.stroke(); x.setLineDash([]);
    x.strokeStyle='rgba(255,255,255,.35)'; x.beginPath(); x.arc(cx,cy,rr(r0),0,TAU); x.stroke();
    const P=(r,th)=>[cx+rr(r)*Math.cos(th),cy-rr(r)*Math.sin(th)], th0=Math.PI/2;
    const hm=r0*va, En=va*va/2-KE/r0, a=-KE/(2*En), e=Math.sqrt(Math.max(0,1+2*En*hm*hm/KE/KE)), p=hm*hm/KE, rE=RE+100;
    let thE=null; x.strokeStyle='#ffc65c'; x.lineWidth=2.2; x.beginPath(); x.moveTo(...P(r0,th0));
    for(let d=0;d<=Math.PI*2;d+=.005){ const r=p/(1+e*Math.cos(Math.PI-d)); if(r<=rE){ thE=d; break; } x.lineTo(...P(r,th0+d)); } x.stroke();
    const B=P(r0,th0); arrow(x,B[0],B[1],B[0]+26,B[1],'#e0604f',2); lbl(x,'Δυ',B[0]+30,B[1]-6,'#e0604f','left'); dot(x,B[0],B[1],4.5,'#fff'); lbl(x,'I',...P(r0+60,th0+.9),'#ffc65c');
    let ang=null, vE=null;
    if(thE!==null){ vE=Math.sqrt(va*va+2*KE*(1/rE-1/r0)); ang=Math.acos(Math.min(1,hm/(rE*vE)))/D2R;
      const E=P(rE,th0+thE); x.strokeStyle='#ff7a3c'; x.lineWidth=2.2; x.beginPath(); x.moveTo(E[0],E[1]); const s=th0+thE; x.quadraticCurveTo(...P(RE+40,s+.12),...P(RE,s+.16)); x.stroke(); dot(x,E[0],E[1],5,'#ff7a3c');
      lbl(x,'II',...P(RE+150,s+.06),'#ff7a3c'); const L=P(RE,s+.16); dot(x,L[0],L[1],4,'#5fd39a'); lbl(x,'III',L[0]+(L[0]<cx?-14:14),L[1]+4,'#5fd39a'); }
    lbl(x,'100 km',cx,cy-rr(RE+100)+14,'rgba(160,210,255,.8)'); lbl(x,T(TX.exag),10,h-10,'rgba(255,255,255,.45)','left');
    $('#t36BV').textContent=fmtN(db*1000)+' m/s'; $('#t36OV').textContent=fmtN(h0)+' km';
    $('#t36DKv').innerHTML=kv(T(TX.hpp),fmtN(a*(1-e)-RE)+' km')+(thE===null?kv(T(TX.ent),T(TX.stay),true):kv(T(TX.ent),fmtN(ang,2)+'°')+kv(T(TX.ve),fmtN(vE,3)+' km/s')+kv(T(TX.arc),fmtN(thE/D2R)+'°')); });
  ['#t36B','#t36O'].forEach(s=>$(s).oninput=drawD);

  /* 04 · Aerodinamik sifat */
  const setK=()=>{ const cx=+$('#t36X').value, cy=+$('#t36Y').value, k=cy/cx; $('#t36XV').textContent=fmtN(cx,2); $('#t36YV').textContent=fmtN(cy,2);
    $('#t36KKv').innerHTML=kv(T(TX.kk),fmtN(k,2))+kv(T(TX.mode),T(cy===0?TX.mBal:TX.mAer))+kv(T(TX.load),cy===0?'8–10':'3–4',true); };
  ['#t36X','#t36Y'].forEach(s=>$(s).oninput=setK); setK();

  ['#t36A','#t36H'].forEach(s=>$(s).oninput=()=>{ dV(); dC(); });
  K.bindQA(); K.quiz($('#t36Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t36', GL, QZ, ico:'🔄', title:TX.title, sub:TX.sub, build });
}; go0();
})();
