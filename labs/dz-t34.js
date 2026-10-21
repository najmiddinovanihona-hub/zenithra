/* DARSLIK · 34-mavzu (68-§). Ta'sir sferasi va KA trayektoriyalarini taxminiy hisoblash */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU;
const KE=3.986e5, KS=1.327e11, AU=1.496e8, SOI=AU*Math.pow(3.003e-6,.4);
const BO=[
 [X('Merkuriy','Меркурий','Mercury'),5.79e7,1.66e-7,2440,'#b5a493'],
 [X('Venera','Венера','Venus'),1.082e8,2.448e-6,6052,'#e8c27a'],
 [X('Yer','Земля','Earth'),AU,3.003e-6,6371,'#4f8fe8'],
 [X('Mars','Марс','Mars'),2.279e8,3.227e-7,3390,'#d9693f'],
 [X('Yupiter','Юпитер','Jupiter'),7.785e8,9.546e-4,69911,'#d8b48a'],
 [X('Saturn','Сатурн','Saturn'),1.433e9,2.858e-4,58232,'#e3cf96'],
 [X('Uran','Уран','Uranus'),2.872e9,4.366e-5,25362,'#8fd6e0'],
 [X('Neptun','Нептун','Neptune'),4.495e9,5.151e-5,24622,'#6f8ff0'],
 [X('Oy · Yerga nisbatan','Луна · относительно Земли','Moon · relative to Earth'),384400,.0123,1737,'#cfcfcf'],
 [X('Quyosh · Galaktikaga nisbatan','Солнце · относительно Галактики','Sun · relative to the Galaxy'),2.6e17,1/1.5e11,696000,'#ffb347']];
const TX={
 title:X('Ta’sir sferasi va kosmik apparat trayektoriyalarini taxminiy hisoblash','Сфера действия и приближённый расчёт траекторий КА','Sphere of influence and approximate calculation of spacecraft trajectories'),
 sub:X('68-§ · Tayanch Kepler orbitasi, chetlantiruvchi tezlanish, geosentrik va geliosentrik harakat, Yer, Oy va Quyosh ta’sir sferalari, ρ = a(m/M)^2/5, konus kesimlarini tutashtirish metodi','§68 · Опорная кеплерова орбита, возмущающее ускорение, геоцентрическое и гелиоцентрическое движение, сферы действия Земли, Луны и Солнца, ρ = a(m/M)^2/5, метод сопряжения конических сечений','§68 · The reference Kepler orbit, perturbing acceleration, geocentric and heliocentric motion, spheres of influence of Earth, Moon and Sun, ρ = a(m/M)^2/5, the patched-conics method'),
 intro:X('KAning keplercha orbitalari real osmon jismlari uchun aslida amalga oshmaydi: markaziy jism aniq sferik simmetriyaga ega emas, shuning uchun uning maydoni ham markaziy bo‘la olmaydi; tashqi osmon jismlari va boshqa omillar ham ta’sir qiladi. Biroq keplercha harakat shu qadar sodda va yaxshi o‘rganilganki, undan voz kechib bo‘lmaydi. Shuning uchun Kepler orbitasi <b>tayanch orbita</b> sifatida olinadi, boshqa ta’sirlar beradigan <b>chetlanishlar</b> esa alohida hisobga olinib, trayektoriya aniqlashtiriladi.','Кеплеровы орбиты КА для реальных небесных тел на самом деле неосуществимы: центральное тело не обладает точной сферической симметрией, поэтому и его поле не может быть строго центральным; влияют и внешние тела, и другие факторы. Однако кеплерово движение настолько просто и хорошо изучено, что отказаться от него нельзя. Поэтому кеплерову орбиту берут как <b>опорную</b>, а <b>возмущения</b> от остальных воздействий учитывают отдельно, уточняя траекторию.','Keplerian orbits are never exactly realised around real bodies: the central body is not perfectly spherical, so its field is not strictly central, and other bodies and factors also act. Yet Keplerian motion is so simple and so well understood that it cannot be abandoned. So the Kepler orbit is taken as the <b>reference orbit</b>, and the <b>perturbations</b> from everything else are accounted for separately to refine the trajectory.'),
 s1:X('Kim «markaziy jism»: Yermi yoki Quyosh?','Кто «центральное тело»: Земля или Солнце?','Which is the “central body”: Earth or the Sun?'),
 s1D:X('KA Yer–Quyosh chizig‘ida, Yerdan d masofada turibdi (117-rasm). <b>Geosentrik</b> harakatda chetlantiruvchi tezlanish — Quyoshning KAga va Yerga beradigan tezlanishlari farqi; uni KAga Yer beradigan tezlanish bilan solishtiramiz. <b>Geliosentrik</b> harakatda chetlantiruvchi — Yerning KAga va Quyoshga beradigan tezlanishlari farqi; uni Quyoshning KAga beradigan tezlanishi bilan solishtiramiz. Qaysi tavsifda chetlanish nisbatan kichik bo‘lsa, o‘shasi to‘g‘riroq. <b>I hol</b> (d = 500 000 km): Quyosh chetlanishi 0,040·10⁻⁶ km/s² — Yer tezlanishining atigi 2,5 %, Yer chetlanishi esa Quyosh tezlanishining 26,7 % — harakat <b>geosentrik</b>. <b>II hol</b> (d = 1 500 000 km): 68,3 % ga qarshi atigi 3 % — harakat <b>geliosentrik</b>.','КА находится на линии Земля–Солнце на расстоянии d от Земли (рис. 117). В <b>геоцентрическом</b> движении возмущающее ускорение — разность ускорений, сообщаемых Солнцем КА и Земле; сравниваем его с ускорением КА от Земли. В <b>гелиоцентрическом</b> — разность ускорений, сообщаемых Землёй КА и Солнцу; сравниваем с ускорением КА от Солнца. Вернее то описание, где возмущение относительно меньше. <b>Случай I</b> (d = 500 000 км): возмущение от Солнца 0,040·10⁻⁶ км/с² — всего 2,5 % ускорения от Земли, а возмущение от Земли — 26,7 % солнечного: движение <b>геоцентрическое</b>. <b>Случай II</b> (d = 1 500 000 км): 68,3 % против 3 % — движение <b>гелиоцентрическое</b>.','The craft sits on the Earth–Sun line at distance d from Earth (Fig. 117). For <b>geocentric</b> motion the perturbing acceleration is the difference between the Sun’s pull on the craft and on Earth, compared with Earth’s pull on the craft. For <b>heliocentric</b> motion it is the difference between Earth’s pull on the craft and on the Sun, compared with the Sun’s pull on the craft. The description with the relatively smaller perturbation is the better one. <b>Case I</b> (d = 500 000 km): the solar perturbation is 0.040·10⁻⁶ km/s², only 2.5 % of Earth’s pull, while Earth’s perturbation is 26.7 % of the Sun’s — the motion is <b>geocentric</b>. <b>Case II</b> (d = 1 500 000 km): 68.3 % versus 3 % — <b>heliocentric</b>.'),
 cases:X('Hollar','Случаи','Cases'), c1:X('I hol · 0,5 mln km','Случай I · 0,5 млн км','Case I · 0.5 M km'), c2:X('II hol · 1,5 mln km','Случай II · 1,5 млн км','Case II · 1.5 M km'),
 d:X('KAning Yerdan masofasi d','Расстояние КА от Земли d','Craft’s distance from Earth d'), mkm:X('mln km','млн км','M km'),
 gE:X('Yer → KA','Земля → КА','Earth → craft'), gS:X('Quyosh → KA','Солнце → КА','Sun → craft'), gSE:X('Quyosh → Yer','Солнце → Земля','Sun → Earth'),
 geo:X('Geosentrik: Quyosh chetlanishi','Геоцентрически: возмущение от Солнца','Geocentric: solar perturbation'), hel:X('Geliosentrik: Yer chetlanishi','Гелиоцентрически: возмущение от Земли','Heliocentric: Earth’s perturbation'),
 verd:X('Xulosa','Вывод','Verdict'), vGeo:X('KA Yer atrofida geosentrik harakatlanyapti deb qarash to‘g‘ri','Движение КА правильнее считать геоцентрическим','Treat it as geocentric motion around Earth'), vHel:X('KA Quyosh atrofida geliosentrik harakatlanyapti deb qarash to‘g‘ri','Движение КА правильнее считать гелиоцентрическим','Treat it as heliocentric motion around the Sun'),
 cGeo:X('geosentrik','геоцентрическое','geocentric'), cHel:X('geliosentrik','гелиоцентрическое','heliocentric'), eq:X('tenglik nuqtasi','точка равенства','crossover'),
 cvG:X('Quyosh chetlanishi / Yer tezlanishi','возмущение Солнца / ускорение от Земли','solar perturbation / Earth’s pull'), cvH:X('Yer chetlanishi / Quyosh tezlanishi','возмущение Земли / ускорение от Солнца','Earth’s perturbation / Sun’s pull'),
 s2:X('Ta’sir sferasi','Сфера действия','Sphere of influence'),
 s2D:X('Hisobni Yer–Quyosh chizig‘ida yotmaydigan nuqtalar uchun ham bajarsak (bunda tezlanish vektorlarining farqi olinadi), geosentrik tavsif ma’qul bo‘lgan soha chegarasi Yer atrofidagi sferaga juda yaqin chiqadi. Soddalik uchun kosmodinamikada u aniq sfera deb olinadi — <b>ta’sir sferasi</b>. Oralig‘i a bo‘lgan M massali jism yaqinidagi m massali jism (m ≪ M) ta’sir sferasining radiusi: <b>ρ = a·(m/M)^2/5</b>. Yerning Quyoshga nisbatan ta’sir sferasi — 925 000 km, Oyning Yerga nisbatan — 66 000 km, Quyoshning Galaktika markaziga nisbatan — 9·10¹² km ≈ 1 yorug‘lik yili.','Если провести расчёт и для точек вне линии Земля–Солнце (беря разность векторов ускорений), граница области, где выгоднее геоцентрическое описание, окажется очень близкой к сфере вокруг Земли. Для простоты в космодинамике её считают точной сферой — <b>сферой действия</b>. Радиус сферы действия тела массы m вблизи тела массы M (m ≪ M) на расстоянии a: <b>ρ = a·(m/M)^2/5</b>. Сфера действия Земли относительно Солнца — 925 000 км, Луны относительно Земли — 66 000 км, Солнца относительно центра Галактики — 9·10¹² км ≈ 1 световой год.','Repeating the calculation for points off the Earth–Sun line (taking the difference of acceleration vectors), the boundary of the region where the geocentric description wins turns out very close to a sphere around Earth. For simplicity cosmodynamics treats it as an exact sphere — the <b>sphere of influence</b>. For a body of mass m near a body of mass M (m ≪ M) at distance a its radius is <b>ρ = a·(m/M)^2/5</b>. Earth’s sphere relative to the Sun is 925 000 km, the Moon’s relative to Earth 66 000 km, the Sun’s relative to the Galactic centre 9·10¹² km ≈ 1 light year.'),
 a:X('Masofa a','Расстояние a','Distance a'), rho:X('Ta’sir sferasi radiusi ρ','Радиус сферы действия ρ','Sphere radius ρ'), rhoR:X('Jism radiuslarida','В радиусах тела','In body radii'), rhoA:X('Astronomik birlikda','В астрономических единицах','In AU'), rhoL:X('Yorug‘lik yilida','В световых годах','In light years'),
 au:X('1 a.b.','1 а. е.','1 AU'), ly:X('1 y.y.','1 св. год','1 ly'),
 s3:X('Konus kesimlarini tutashtirish metodi','Метод сопряжения конических сечений','The patched-conics method'),
 s3D:X('KA ta’sir sferasi chegarasini kesib o‘tganda tortishishning bir markaziy maydonidan ikkinchisiga o‘tadi. Har bir maydonda harakat shu maydonga nisbatan alohida keplercha orbita — konus kesimlaridan biri bo‘ladi, chegarada esa trayektoriya bo‘laklari ma’lum qoidalar bo‘yicha «ulanadi». KA trayektoriyalarini taxminiy hisoblash metodining asl mohiyati shu — u <b>konus kesimlarini tutashtirish metodi</b> deb ham ataladi. Masalan, sayyoraga uchishda: Yer ta’sir sferasi ichida — geosentrik giperbola, undan tashqarida — Quyosh atrofidagi geliosentrik ellips; sferadan chiqishdagi qoldiq tezlik υ∞ Yerning orbital tezligiga qo‘shiladi.','Пересекая границу сферы действия, КА переходит из одного центрального поля тяготения в другое. В каждом поле движение — отдельная кеплерова орбита (одно из конических сечений) относительно этого поля, а на границе куски траектории «сшиваются» по определённым правилам. В этом суть приближённого метода расчёта траекторий КА — его называют <b>методом сопряжения конических сечений</b>. Например, при полёте к планете: внутри сферы действия Земли — геоцентрическая гипербола, вне её — гелиоцентрический эллипс вокруг Солнца; остаточная скорость υ∞ на выходе из сферы складывается с орбитальной скоростью Земли.','When the craft crosses the boundary of a sphere of influence it passes from one central field into another. In each field the motion is a separate Keplerian orbit (a conic section) relative to that field, and at the boundary the pieces are “patched” by definite rules. That is the essence of the approximate method — the <b>patched-conics method</b>. For a flight to a planet: inside Earth’s sphere a geocentric hyperbola, outside it a heliocentric ellipse around the Sun; the residual speed υ∞ at the boundary adds to Earth’s orbital speed.'),
 tgt:X('Maqsad','Цель','Target'), inset:X('Yer ta’sir sferasi · giperbola (sxema)','Сфера действия Земли · гипербола (схема)','Earth’s sphere · hyperbola (schematic)'), ell:X('geliosentrik ellips','гелиоцентрический эллипс','heliocentric ellipse'), join:X('ulanish','сопряжение','patch'),
 vinf:X('Sferadan chiqishdagi qoldiq tezlik υ∞','Остаточная скорость на границе υ∞','Residual speed at the boundary υ∞'), v0:X('200 km balandlikdan start tezligi','Скорость старта с высоты 200 км','Launch speed from 200 km'), eh:X('Geosentrik giperbola ekssentrisiteti','Эксцентриситет геоцентрической гиперболы','Eccentricity of the geocentric hyperbola'), tt:X('Geliosentrik uchish vaqti (Gohman ellipsi)','Время гелиоцентрического перелёта (эллипс Гомана)','Heliocentric transfer time (Hohmann ellipse)'), soi:X('Yer ta’sir sferasi','Сфера действия Земли','Earth’s sphere of influence'), day:X('sutka','сут','days')
};
const GL=[
 [X('Tayanch orbita','Опорная орбита','Reference orbit'),X('Asos qilib olingan Kepler orbitasi; boshqa ta’sirlar chetlanish sifatida alohida hisoblanadi.','Кеплерова орбита, принятая за основу; прочие воздействия учитываются как возмущения.','The Kepler orbit taken as the basis; other effects are added as perturbations.')],
 [X('Chetlantiruvchi tezlanish','Возмущающее ускорение','Perturbing acceleration'),X('Tashqi jismning KAga va markaziy jismga beradigan tezlanishlari farqi.','Разность ускорений, сообщаемых внешним телом КА и центральному телу.','The difference between an outside body’s pull on the craft and on the central body.')],
 [X('Geosentrik / geliosentrik harakat','Геоцентрическое / гелиоцентрическое движение','Geocentric / heliocentric motion'),X('Markazi Yer / Quyosh bo‘lgan keplercha trayektoriya bo‘ylab harakat.','Движение по кеплеровой траектории с центром в Земле / Солнце.','Motion along a Keplerian path centred on Earth / the Sun.')],
 [X('Ta’sir sferasi','Сфера действия','Sphere of influence'),X('Ichida KA harakatini shu jism atrofida deb qarash ma’qul bo‘lgan soha; ρ = a(m/M)^2/5.','Область, внутри которой движение КА выгодно рассматривать вокруг этого тела; ρ = a(m/M)^2/5.','The region inside which motion is best described around that body; ρ = a(m/M)^2/5.')],
 [X('Ta’sir sferalari radiuslari','Радиусы сфер действия','Sphere radii'),X('Yer — 925 000 km, Oy — 66 000 km, Quyosh (Galaktikaga nisbatan) — ≈ 9·10¹² km ≈ 1 y.y.','Земля — 925 000 км, Луна — 66 000 км, Солнце (относительно Галактики) — ≈ 9·10¹² км ≈ 1 св. год.','Earth 925 000 km, Moon 66 000 km, Sun (relative to the Galaxy) ≈ 9·10¹² km ≈ 1 ly.')],
 [X('Konus kesimlarini tutashtirish','Сопряжение конических сечений','Patched conics'),X('Har bir ta’sir sferasida alohida Kepler orbitasi olinib, bo‘laklar chegarada ulanadigan taxminiy metod.','Приближённый метод: в каждой сфере действия — своя кеплерова орбита, куски сшиваются на границе.','Approximate method: a separate Kepler orbit in each sphere, joined at the boundaries.')]
];
const QA=[
 [X('Nega keplercha orbitalar real osmon jismlari atrofida aniq amalga oshmaydi?','Почему кеплеровы орбиты не реализуются точно у реальных тел?','Why are Keplerian orbits never exact around real bodies?'),X('Markaziy jism aniq sferik emas, shuning uchun maydoni ham markaziy emas; tashqi jismlar va boshqa omillar ta’sir qiladi. Shu bois Kepler orbitasi tayanch sifatida olinib, chetlanishlar alohida hisoblanadi.','Центральное тело не строго сферично, его поле не центрально; влияют внешние тела и другие факторы. Поэтому кеплерову орбиту берут как опорную, а возмущения учитывают отдельно.','The central body isn’t perfectly spherical, so its field isn’t central, and other bodies act too. So the Kepler orbit is a reference and perturbations are added separately.')],
 [X('Yerdan 500 000 km dagi KA harakatini qanday deb qarash to‘g‘ri?','Как правильнее описывать движение КА в 500 000 км от Земли?','How should a craft 500 000 km from Earth be described?'),X('Geosentrik: Quyosh chetlanishi Yer tezlanishining atigi 2,5 % i, geliosentrik tavsifda esa Yer chetlanishi 26,7 % bo‘lardi.','Геоцентрически: возмущение от Солнца — лишь 2,5 % ускорения от Земли, а в гелиоцентрическом описании возмущение от Земли было бы 26,7 %.','Geocentrically: the solar perturbation is only 2.5 % of Earth’s pull, whereas heliocentrically Earth’s perturbation would be 26.7 %.')],
 [X('1 500 000 km masofada-chi?','А на расстоянии 1 500 000 км?','And at 1 500 000 km?'),X('Geliosentrik: Yer chetlanishi Quyosh tezlanishining ≈ 3 % i, geosentrik tavsifda Quyosh chetlanishi 68,3 % bo‘lardi.','Гелиоцентрически: возмущение от Земли ≈ 3 % солнечного ускорения, а в геоцентрическом описании возмущение от Солнца было бы 68,3 %.','Heliocentrically: Earth’s perturbation is ≈ 3 % of the Sun’s pull, while geocentrically the solar perturbation would be 68.3 %.')],
 [X('Ta’sir sferasining radiusi qanday topiladi?','Как находится радиус сферы действия?','How is the sphere-of-influence radius found?'),X('ρ = a·(m/M)^2/5; Yer uchun a = 149,6 mln km, m/M = 3·10⁻⁶ → ρ ≈ 925 000 km.','ρ = a·(m/M)^2/5; для Земли a = 149,6 млн км, m/M = 3·10⁻⁶ → ρ ≈ 925 000 км.','ρ = a·(m/M)^2/5; for Earth a = 149.6 M km, m/M = 3·10⁻⁶ → ρ ≈ 925 000 km.')],
 [X('Konus kesimlarini tutashtirish metodining mohiyati nimada?','В чём суть метода сопряжения конических сечений?','What is the essence of the patched-conics method?'),X('Har bir ta’sir sferasida harakat alohida Kepler orbitasi deb hisoblanadi, sfera chegarasida esa bo‘laklar ma’lum qoidalar bo‘yicha ulanadi.','В каждой сфере действия движение считают отдельной кеплеровой орбитой, а на границе куски сшивают по определённым правилам.','In each sphere the motion is treated as a separate Kepler orbit, and the pieces are joined at the boundary by definite rules.')]
];
const QZ=[
 [X('Yerning Quyoshga nisbatan ta’sir sferasi radiusi:','Радиус сферы действия Земли относительно Солнца:','Radius of Earth’s sphere of influence relative to the Sun:'),[X('925 000 km','925 000 км','925 000 km'),X('66 000 km','66 000 км','66 000 km'),X('384 400 km','384 400 км','384 400 km')]],
 [X('Oyning Yerga nisbatan ta’sir sferasi radiusi:','Радиус сферы действия Луны относительно Земли:','Radius of the Moon’s sphere relative to Earth:'),[X('66 000 km','66 000 км','66 000 km'),X('925 000 km','925 000 км','925 000 km'),X('1 737 km','1 737 км','1 737 km')]],
 [X('Ta’sir sferasi radiusi formulasi:','Формула радиуса сферы действия:','Formula for the sphere radius:'),[X('ρ = a(m/M)^2/5','ρ = a(m/M)^2/5','ρ = a(m/M)^2/5'),X('ρ = a·m/M','ρ = a·m/M','ρ = a·m/M'),X('ρ = a(M/m)^2/5','ρ = a(M/m)^2/5','ρ = a(M/m)^2/5')]],
 [X('Yerdan 500 000 km dagi KA harakati:','Движение КА в 500 000 км от Земли:','Motion of a craft 500 000 km from Earth:'),[X('geosentrik','геоцентрическое','geocentric'),X('geliosentrik','гелиоцентрическое','heliocentric'),X('to‘g‘ri chiziqli','прямолинейное','straight-line')]],
 [X('1,5 mln km da Yer chetlanishi Quyosh tezlanishining:','На 1,5 млн км возмущение от Земли составляет от солнечного ускорения:','At 1.5 M km Earth’s perturbation is, of the Sun’s pull:'),[X('≈ 3 %','≈ 3 %','≈ 3 %'),X('≈ 68 %','≈ 68 %','≈ 68 %'),X('≈ 27 %','≈ 27 %','≈ 27 %')]],
 [X('KA ta’sir sferasi chegarasini kesib o‘tganda:','Пересекая границу сферы действия, КА:','Crossing a sphere boundary, the craft:'),[X('bir markaziy maydondan ikkinchisiga o‘tadi','переходит из одного центрального поля в другое','passes from one central field into another'),X('to‘xtab qoladi','останавливается','stops'),X('orbitasi aylanaga aylanadi','переходит на круговую орбиту','switches to a circular orbit')]],
 [X('Quyoshning Galaktika markaziga nisbatan ta’sir sferasi:','Сфера действия Солнца относительно центра Галактики:','The Sun’s sphere relative to the Galactic centre:'),[X('≈ 1 yorug‘lik yili','≈ 1 световой год','≈ 1 light year'),X('≈ 1 a.b.','≈ 1 а. е.','≈ 1 AU'),X('≈ 100 y.y.','≈ 100 св. лет','≈ 100 ly')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,$,fmtN,C,fit,sec,chips,mark,on}=K;
  const kv=(k,v,f)=>K.kv(String(k).split(' ').map(w=>/[_\u0370-\u03FF\u2080-\u209F⊕☉∞′\/]|^[A-Za-z]$/.test(w)?'<span style="text-transform:none">'+w+'</span>':w).join(' '),v,f);
  const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹', sci=(n,d)=>{ const e=Math.floor(Math.log10(n)); return fmtN(n/10**e,d==null?2:d)+'·10'+(e<0?'⁻':'')+String(Math.abs(e)).split('').map(q=>SUP[+q]).join(''); };
  const km=n=>(n<1e9?fmtN(n):sci(n))+' km', g6=v=>fmtN(v*1e6,3)+'·10⁻⁶ km/s²';
  const dot=(x,px,py,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill(); };
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.cases)}</span>${chips('cs',[[500000,T(TX.c1)],[1500000,T(TX.c2)],[925000,'ρ = 925 000 km']])}</div>
      <label class="t1-ctl"><span>${T(TX.d)}: <b id="t34DV"></b></span><input type="range" class="lab-range" id="t34D" min="5" max="6.699" step="0.0001" value="5.699"></label>
      <canvas class="t1-cv" id="t34P"></canvas>
      <div class="t1-p" style="font-size:12px;margin:6px 0 0;display:flex;gap:16px;flex-wrap:wrap"><span style="color:#3f7fe0">━ ${T(TX.cvG)}</span><span style="color:#d0861f">━ ${T(TX.cvH)}</span></div>
      <div class="lab-kv" id="t34PKv"></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="t1-formula">ρ = a · (m / M)^2/5</div>
    <div class="lab-row" style="margin:0">${chips('sb',BO.map((b,i)=>[i,T(b[0])]))}</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t34S"></canvas></div><div class="t1-side"><div class="lab-kv" id="t34SKv"></div></div></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p>
    <div class="dz-card t4-m"><div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.tgt)}</span>${chips('tg',[[1,T(BO[1][0])],[3,T(BO[3][0])],[4,T(BO[4][0])]])}</div>
      <canvas class="t1-cv" id="t34H"></canvas><div class="lab-kv" id="t34HKv"></div></div>`)}
  ${sec('04',K.U.gl,K.glHTML(GL))}
  ${sec('05',K.U.qa,K.qaHTML(QA))}
  ${sec('06',K.U.test,`<div class="dz-card t1-quiz" id="t34Quiz"></div>`)}`;

  /* 01 · Geosentrik yoki geliosentrik */
  const gE=d=>KE/d/d, gS=d=>KS/(AU-d)**2, gSE=KS/AU/AU, gES=KE/AU/AU;
  const geoR=d=>(gS(d)-gSE)/gE(d)*100, helR=d=>(gE(d)-gES)/gS(d)*100;
  const cross=(()=>{ let lo=5, hi=6.7; for(let k=0;k<50;k++){ const m=(lo+hi)/2; if(geoR(10**m)<helR(10**m)) lo=m; else hi=m; } return 10**lo; })();
  const drawP=K.draw(function(){ const cv=$('#t34P'); const {x,w,h}=fit(cv,.5,300), c=C(), d=10**+$('#t34D').value, pl=54, pr=12, pt=24, pb=30, L0=5, L1=Math.log10(5e6), Y0=-2, Y1=4;
    const sx=v=>pl+(Math.log10(v)-L0)/(L1-L0)*(w-pl-pr), sy=p=>pt+(1-(Math.log10(Math.max(p,1e-3))-Y0)/(Y1-Y0))*(h-pt-pb), xc=sx(cross);
    x.fillStyle='rgba(79,143,232,.10)'; x.fillRect(pl,pt,xc-pl,h-pt-pb); x.fillStyle='rgba(255,179,71,.12)'; x.fillRect(xc,pt,w-pr-xc,h-pt-pb);
    lbl(x,T(TX.cGeo),(pl+xc)/2,pt-8,'#3f7fe0'); lbl(x,T(TX.cHel),(xc+w-pr)/2,pt-8,'#d0861f');
    for(let e=Y0;e<=Y1;e++){ const yy=sy(10**e); x.strokeStyle=c.brd; x.lineWidth=1; x.beginPath(); x.moveTo(pl,yy); x.lineTo(w-pr,yy); x.stroke(); x.fillStyle=c.dim; x.font='10px system-ui'; x.textAlign='right'; x.fillText((e<0?fmtN(10**e,-e):fmtN(10**e))+' %',pl-4,yy+3); }
    [1e5,2e5,5e5,1e6,2e6,5e6].forEach(v=>lbl(x,fmtN(v/1e6,1),sx(v),h-14,c.dim)); lbl(x,T(TX.mkm),w-pr,h-2,c.dim,'right');
    [[geoR,'#3f7fe0'],[helR,'#e0952f']].forEach(([f,col])=>{ x.strokeStyle=col; x.lineWidth=2.2; x.beginPath(); for(let i=0;i<=200;i++){ const v=10**(L0+(L1-L0)*i/200); i?x.lineTo(sx(v),sy(f(v))):x.moveTo(sx(v),sy(f(v))); } x.stroke(); });
    x.setLineDash([4,4]); x.strokeStyle=c.dim; x.lineWidth=1; [[cross,T(TX.eq)],[SOI,'ρ']].forEach(([v,t],k)=>{ x.beginPath(); x.moveTo(sx(v),pt); x.lineTo(sx(v),h-pb); x.stroke(); lbl(x,t,sx(v)+4,pt+14+k*14,c.text,'left'); }); x.setLineDash([]);
    x.strokeStyle=c.neon; x.lineWidth=1.5; x.beginPath(); x.moveTo(sx(d),pt); x.lineTo(sx(d),h-pb); x.stroke();
    dot(x,sx(d),sy(geoR(d)),5,'#3f7fe0'); dot(x,sx(d),sy(helR(d)),5,'#e0952f');
    $('#t34DV').textContent=fmtN(d)+' km';
    $('#t34PKv').innerHTML=kv(T(TX.gE),g6(gE(d)))+kv(T(TX.gS),g6(gS(d)))+kv(T(TX.gSE),g6(gSE))+kv(T(TX.geo),g6(gS(d)-gSE)+' · '+fmtN(geoR(d),1)+' %')+kv(T(TX.hel),g6(gE(d)-gES)+' · '+fmtN(helR(d),1)+' %')+kv(T(TX.verd),T(geoR(d)<helR(d)?TX.vGeo:TX.vHel),true); });
  $('#t34D').oninput=()=>{ mark('cs',''); drawP(); };
  on('cs',v=>{ $('#t34D').value=Math.log10(+v); mark('cs',v); drawP(); }); mark('cs','500000');

  /* 02 · Ta'sir sferalari */
  let sb=2;
  const drawS=K.draw(function(){ const cv=$('#t34S'); const n=BO.length, {x,w,h}=fit(cv,.8,340), c=C(), pl=Math.min(96,w*.26), pr=14, pt=6, pb=28, rh=(h-pt-pb)/n, L0=4, L1=13.5, sx=v=>pl+(Math.log10(v)-L0)/(L1-L0)*(w-pl-pr);
    [1e4,1e6,1e8,1e10,1e12].forEach(v=>{ x.strokeStyle=c.brd; x.lineWidth=1; x.beginPath(); x.moveTo(sx(v),pt); x.lineTo(sx(v),h-pb); x.stroke(); lbl(x,sci(v,0),sx(v),h-14,c.dim); }); lbl(x,'km',w-pr,h-2,c.dim,'right');
    x.setLineDash([3,4]); [[AU,T(TX.au)],[9.46e12,T(TX.ly)]].forEach(([v,t])=>{ x.strokeStyle=c.neon; x.beginPath(); x.moveTo(sx(v),pt); x.lineTo(sx(v),h-pb); x.stroke(); lbl(x,t,sx(v)-3,h-pb-4,c.neon,'right'); }); x.setLineDash([]);
    BO.forEach((b,i)=>{ const r=b[1]*Math.pow(b[2],.4), y=pt+i*rh, sel=i===sb; x.globalAlpha=sel?1:.45; x.fillStyle=b[4]; x.fillRect(pl,y+rh*.2,Math.max(2,sx(r)-pl),rh*.6); x.globalAlpha=1;
      x.fillStyle=sel?c.text:c.dim; x.font=(sel?'700':'500')+' 11px system-ui,sans-serif'; x.textAlign='right'; x.fillText(T(b[0]).split(' · ')[0],pl-6,y+rh*.5+4); });
    const b=BO[sb], r=b[1]*Math.pow(b[2],.4); mark('sb',sb);
    $('#t34SKv').innerHTML=kv(T(TX.a),km(b[1]))+kv('m / M',sci(b[2]))+kv(T(TX.rho),km(r<1e9?Math.round(r/1000)*1000:r),true)+kv(T(TX.rhoR),fmtN(r/b[3])+' R')+(sb===9?kv(T(TX.rhoL),fmtN(r/9.46e12,2)):kv(T(TX.rhoA),fmtN(r/AU,4))); });
  on('sb',v=>{ sb=+v; drawS(); });

  /* 03 · Konus kesimlarini tutashtirish */
  let tg=3, hu=0;
  const orbitOf=()=>{ const r1=AU, r2=BO[tg][1], out=r2>r1, at=(r1+r2)/2, et=Math.abs(r2-r1)/(r1+r2), vE=Math.sqrt(KS/r1), vd=Math.sqrt(KS*(2/r1-1/at)), vinf=Math.abs(vd-vE), rp=6571;
    return {r1,r2,out,at,et,bt:at*Math.sqrt(1-et*et),vinf,rp,v0:Math.sqrt(vinf*vinf+2*KE/rp),Ttr:Math.PI*Math.sqrt(at**3/KS),eh:1+rp*vinf*vinf/KE}; };
  const drawH=K.draw(function(){ const cv=$('#t34H'); const {x,w,h}=fit(cv,.6,420), o=orbitOf(), col=BO[tg][4];
    const nE=Math.sqrt(KS/o.r1**3), nT=Math.sqrt(KS/o.r2**3), PA=.22, inA=hu<PA, uB=inA?0:(hu-PA)/(1-PA), uA=inA?hu/PA:1;
    x.fillStyle='#03050f'; x.fillRect(0,0,w,h);
    const rmax=Math.max(o.r1,o.r2), cx=w*.6, cy=h/2, s=Math.min(w*.38,h*.45)/rmax, P=(r,a)=>[cx+r*Math.cos(a)*s, cy-r*Math.sin(a)*s];
    x.lineWidth=1.2; x.globalAlpha=.45; [[o.r1,'#4f8fe8'],[o.r2,col]].forEach(([r,cl])=>{ x.strokeStyle=cl; x.beginPath(); x.arc(cx,cy,r*s,0,TAU); x.stroke(); }); x.globalAlpha=1;
    const g=x.createRadialGradient(cx,cy,0,cx,cy,13); g.addColorStop(0,'#fff3c4'); g.addColorStop(.5,'#ffb347'); g.addColorStop(1,'rgba(255,179,71,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,13,0,TAU); x.fill();
    const tp=M=>{ let E=M; for(let k=0;k<12;k++) E-=(E-o.et*Math.sin(E)-M)/(1-o.et*Math.cos(E)); let px=o.at*(Math.cos(E)-o.et), py=o.bt*Math.sin(E); if(!o.out){ px=-px; py=-py; } return [cx+px*s, cy-py*s]; }, M0=o.out?0:Math.PI;
    x.setLineDash([4,5]); x.strokeStyle='rgba(255,198,92,.45)'; x.lineWidth=1.2; x.beginPath(); for(let k=0;k<=120;k++){ const q=tp(M0+Math.PI*k/120); k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]); } x.stroke(); x.setLineDash([]);
    if(!inA){ x.strokeStyle='#ffc65c'; x.lineWidth=2.2; x.beginPath(); const N=Math.max(2,Math.round(120*uB)); for(let k=0;k<=N;k++){ const q=tp(M0+Math.PI*uB*k/N); k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]); } x.stroke(); }
    const mq=tp(M0+Math.PI/2); lbl(x,T(TX.ell),mq[0],mq[1]+(o.out?-10:18),'#ffc65c');
    const pe=P(o.r1,nE*o.Ttr*uB), pT=P(o.r2,Math.PI-nT*o.Ttr*(1-uB));
    dot(x,pT[0],pT[1],5,col); lbl(x,T(BO[tg][0]),pT[0],pT[1]-10,col);
    dot(x,pe[0],pe[1],5,'#4f8fe8'); x.strokeStyle='rgba(111,176,255,.85)'; x.lineWidth=1; x.setLineDash([2,3]); x.beginPath(); x.arc(pe[0],pe[1],Math.max(9,SOI*s),0,TAU); x.stroke(); x.setLineDash([]); lbl(x,T(BO[2][0]),pe[0]+14,pe[1]+18,'#6fb0ff','left');
    const cr=inA?P(o.r1,0):tp(M0+Math.PI*uB); dot(x,cr[0],cr[1],3.5,'#fff');
    const Rin=Math.min(w*.16,h*.3), ix=Rin+14, iy=Rin+30, an=Math.atan2(pe[1]-iy,pe[0]-ix);
    x.strokeStyle='rgba(111,176,255,.35)'; x.lineWidth=1; x.beginPath(); x.moveTo(ix+Rin*Math.cos(an),iy+Rin*Math.sin(an)); x.lineTo(pe[0]-9*Math.cos(an),pe[1]-9*Math.sin(an)); x.stroke();
    x.fillStyle='rgba(10,18,44,.95)'; x.beginPath(); x.arc(ix,iy,Rin,0,TAU); x.fill(); x.strokeStyle='#6fb0ff'; x.setLineDash([4,4]); x.lineWidth=1.2; x.stroke(); x.setLineDash([]);
    dot(x,ix,iy,4,'#4f8fe8');
    const p=o.rp*(1+o.eh), nus=Math.acos((p/SOI-1)/o.eh), nui=Math.acos(-1/o.eh), psi=(o.out?1:-1)*Math.PI/2-nui;
    const HP=nu=>{ const r=p/(1+o.eh*Math.cos(nu)), rr=Rin*Math.sqrt(r/SOI), a=nu+psi; return [ix+rr*Math.cos(a), iy-rr*Math.sin(a)]; };
    x.strokeStyle='#ffc65c'; x.lineWidth=2; x.beginPath(); for(let k=0;k<=80;k++){ const q=HP(nus*k/80); k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]); } x.stroke();
    const ex=HP(nus); x.save(); x.translate(ex[0],ex[1]); x.rotate(Math.PI/4); x.fillStyle='#ffc65c'; x.fillRect(-4,-4,8,8); x.restore();
    const ea=Math.atan2(ex[1]-iy,ex[0]-ix); lbl(x,T(TX.join),ex[0]+16*Math.cos(ea),ex[1]+16*Math.sin(ea)+4,'#ffc65c');
    if(inA){ const q=HP(nus*uA); dot(x,q[0],q[1],3.5,'#fff'); }
    lbl(x,T(TX.inset),ix,iy+Rin+16,'#9ad0ff'); });
  const setH=()=>{ const o=orbitOf(); mark('tg',tg);
    $('#t34HKv').innerHTML=kv(T(TX.soi),km(Math.round(SOI/1000)*1000))+kv(T(TX.vinf),fmtN(o.vinf,2)+' km/s')+kv(T(TX.v0),fmtN(o.v0,2)+' km/s')+kv(T(TX.eh),fmtN(o.eh,3))+kv(T(TX.tt),fmtN(o.Ttr/86400)+' '+T(TX.day),true); };
  on('tg',v=>{ tg=+v; setH(); drawH(); }); setH();
  const hStep=n=>{ hu=(n/1000/10)%1; drawH(); K.rafs.h=requestAnimationFrame(hStep); }; K.rafs.h=requestAnimationFrame(hStep);

  K.bindQA(); K.quiz($('#t34Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t34', GL, QZ, ico:'🌐', title:TX.title, sub:TX.sub, build });
}; go0();
})();
