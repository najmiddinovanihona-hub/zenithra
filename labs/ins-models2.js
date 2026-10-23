/* Astronomik asboblar — 3D modellar (2-qism): teleskop davri va zamonaviy asboblar. Yordamchilar — window.INS_KIT (ins-models.js). */
(function(){
'use strict';
const IM=window.INS_MODELS=window.INS_MODELS||[], K=window.INS_KIT, t3=K.t3, D=Math.PI/180;
// linza profili (LatheGeometry, o'qi y bo'ylab): k>0 — qavariq, k<0 — botiq
function lens(c,r,t,k,mat,pos,rot,parent){ const pts=[], n=12, e=0.0008;
  for(let i=0;i<=n;i++){ const u=i/n, x=u*r, z=k>0?(t/2-e)*(1-u*u)+e:e+(t/2)*u*u; pts.push([Math.max(0.0001,x),-z]); }
  for(let i=n;i>=0;i--){ const u=i/n, x=u*r, z=k>0?(t/2-e)*(1-u*u)+e:e+(t/2)*u*u; pts.push([Math.max(0.0001,x),z]); }
  const m=K.lathe(c,pts,mat,pos,parent,48); if(rot) m.rotation.set(rot[0],rot[1],rot[2]); return m; }
// yorug'lik nurlari (namoyish uchun): nuqtalar ketma-ketligi → ingichka porlovchi tayoqlar guruhi
function rays(c,paths,col,r,parent){ const THREE=c.THREE, g=new THREE.Group(); (parent||c.root).add(g);
  const m=c.M({ clean:true, color:col, emissive:col, ei:1.4, transparent:true, opacity:0.85 });
  paths.forEach(p=>{ for(let i=1;i<p.length;i++) K.bar(c,p[i-1],p[i],r,m,g,6).castShadow=false; }); g.visible=false; return g; }
function flat(c,p1,p2,w,d,mat,parent,z){ const THREE=c.THREE, dx=p2[0]-p1[0], dy=p2[1]-p1[1], L=Math.hypot(dx,dy);
  return c.mesh(new THREE.BoxGeometry(L,w,d),mat,[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,z||0],[0,0,Math.atan2(dy,dx)],parent); }

/* ---------------- Galiley teleskopi ---------------- */
IM.push({ id:'galileo', use:['observe'], icon:'🔭', yearN:1609,
  name:t3('Galiley teleskopi','Телескоп Галилея','Galileo’s telescope'), year:t3('1609-yil','1609 г.','1609'),
  who:t3('Galileo Galiley (Padua, Italiya); g‘oya — Gollandiya ko‘zoynak ustalari (1608)','Галилео Галилей (Падуя); идея — голландские очковые мастера (1608)','Galileo Galilei (Padua); the idea from Dutch spectacle-makers (1608)'),
  size:t3('Uzunligi 93 sm, obyektiv Ø 37 mm, ~20×','Длина 93 см, объектив Ø 37 мм, ~20×','93 cm long, 37 mm objective, ~20×'),
  short:t3('Osmonga qaratilgan ilk teleskoplardan biri — Yupiter yo‘ldoshlarini ochgan','Один из первых телескопов, направленных на небо, — открыл спутники Юпитера','One of the first telescopes turned to the sky — it found Jupiter’s moons'),
  about:t3('Galiley 1609-yilda gollandiyalik «ko‘rish trubasi» haqida eshitib, o‘z linzalarini o‘zi silliqlab, kattalashtirishni 20 martaga yetkazdi. Teleskop ikki linzadan iborat: oldida qavariq obyektiv, ko‘z oldida botiq okulyar — tasvir to‘g‘ri (teskari emas) ko‘rinadi. Model Florensiyadagi Galiley muzeyida saqlanayotgan, charm bilan qoplangan nusxa asosida.',
    'Узнав в 1609 г. о голландской «зрительной трубе», Галилей сам отшлифовал линзы и довёл увеличение до 20 раз. Телескоп состоит из двух линз: выпуклого объектива и вогнутого окуляра — изображение прямое, не перевёрнутое. Модель основана на обтянутом кожей экземпляре из Музея Галилея во Флоренции.',
    'Hearing in 1609 of the Dutch “spyglass”, Galileo ground his own lenses and pushed the magnification to 20×. The telescope has two lenses: a convex objective and a concave eyepiece, giving an upright image. The model follows the leather-covered example in the Museo Galileo, Florence.'),
  tasks:[t3('Uzoq jismlarni kattalashtirib ko‘rish','Видеть удалённые объекты увеличенными','Magnify distant objects'),
    t3('Oy relyefi, Venera fazalari, Yupiter yo‘ldoshlari va Quyosh dog‘larini kuzatish','Наблюдать рельеф Луны, фазы Венеры, спутники Юпитера, пятна на Солнце','Observe lunar relief, Venus’s phases, Jupiter’s moons and sunspots'),
    t3('Kopernik geliotsentrik tizimini kuzatuv bilan tasdiqlash','Подтвердить наблюдениями гелиоцентрическую систему Коперника','Back the Copernican system with observations')],
  how:[t3('Qavariq obyektiv uzoqdagi yulduz nurlarini to‘playdi va ularni fokus tomon yaqinlashtiradi.','Выпуклый объектив собирает лучи звезды и сводит их к фокусу.','The convex objective gathers starlight and bends it toward a focus.'),
    t3('Fokusga yetmasdan botiq okulyar nurlarni yana parallel qiladi — ko‘z kattalashgan, to‘g‘ri tasvirni ko‘radi.','Не доходя до фокуса, вогнутый окуляр снова делает лучи параллельными — глаз видит увеличенное прямое изображение.','Before the focus, the concave eyepiece makes the rays parallel again — the eye sees a magnified, upright image.'),
    t3('Kattalashtirish = obyektiv fokus masofasi / okulyar fokus masofasi (masalan, 980 mm / 50 mm ≈ 20×).','Увеличение = фокус объектива / фокус окуляра (например, 980 мм / 50 мм ≈ 20×).','Magnification = objective focal length / eyepiece focal length (e.g. 980 mm / 50 mm ≈ 20×).'),
    t3('«Ichini ko‘rish» va «Ishlatib ko‘rish» linzalar va nurlar yo‘lini ko‘rsatadi. Ko‘rish maydoni tor (~15′) — Oyning yarmidan kam.','«Разрез» и «Показать в работе» показывают линзы и ход лучей. Поле зрения узкое (~15′) — меньше половины Луны.','“Cutaway” and “See it work” show the lenses and ray path. The field is narrow (~15′), under half the Moon.')],
  parts:[[t3('Obyektiv (qavariq linza)','Объектив (выпуклая линза)','Objective (convex lens)'),t3('Ø 37 mm, fokus masofasi ~1 m.','Ø 37 мм, фокус ~1 м.','37 mm across, focal length ~1 m.')],
    [t3('Okulyar (botiq linza)','Окуляр (вогнутая линза)','Eyepiece (concave lens)'),t3('Tasvirni to‘g‘ri qoldiradi, lekin maydonni toraytiradi.','Сохраняет прямое изображение, но сужает поле.','Keeps the image upright but narrows the field.')],
    [t3('Charm qoplangan truba','Труба в коже','Leather-covered tube'),t3('Yog‘och tasmalar, qizil-jigarrang charm, oltin naqsh.','Деревянные планки, красно-коричневая кожа, золотое тиснение.','Wooden strips, red-brown leather, gold tooling.')],
    [t3('Muzey tayanchi','Музейная подставка','Museum stand'),t3('Zamonaviy ko‘rgazma tayanchi.','Современная выставочная подставка.','Modern display stand.')]],
  facts:[t3('1610-yil yanvarida Galiley Yupiterning 4 ta yo‘ldoshini topdi; ular hozir «Galiley yo‘ldoshlari» deb ataladi.','В январе 1610 г. Галилей открыл 4 спутника Юпитера — «галилеевы спутники».','In January 1610 Galileo found Jupiter’s four large moons — the “Galilean moons”.'),
    t3('Kashfiyotlari 1610-yil martida «Yulduz xabarchisi» (Sidereus Nuncius) kitobida chop etilgan.','Открытия опубликованы в марте 1610 г. в книге «Звёздный вестник».','His discoveries were published in March 1610 in Sidereus Nuncius (“Starry Messenger”).'),
    t3('Somon yo‘li son-sanoqsiz xira yulduzlardan iborat ekanini ham birinchi bo‘lib Galiley ko‘rgan.','Галилей первым увидел, что Млечный Путь состоит из множества слабых звёзд.','Galileo was also first to see that the Milky Way is countless faint stars.')],
  env:{ sky:'studio', shadow:0.8, size:5, floor:'wood' },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, L=0.93, Y=0.25;
    const lt=c.tex(256,2048,(x,w,h)=>{ const b=c.rgb('#6e2c1c'); c.paint(x,256,[[0,...c.shade(b,0.7)],[0.5,...b],[1,...c.shade(b,1.2)]],{ oct:6, speck:16 }); for(let k=1;k<8;k++) x.drawImage(x.canvas,0,0,256,256,0,k*256,256,256);
      x.strokeStyle='#d9b45a'; x.fillStyle='#d9b45a'; const band=y=>{ x.lineWidth=3; x.beginPath(); x.moveTo(0,y); x.lineTo(w,y); x.stroke(); x.lineWidth=1.2; x.beginPath(); x.moveTo(0,y+8); x.lineTo(w,y+8); x.stroke(); for(let i=0;i<16;i++){ x.beginPath(); x.arc((i+0.5)/16*w,y+20,3,0,7); x.fill(); } };
      [30,330,700,1050,1400,1750,2000].forEach(band); });
    const leather=M({ map:lt, rough:0.6, env:0.6, bump:0.15, clip:true, side:THREE.DoubleSide }), wd=K.wood(c,'#3c2414',{ clip:true }), br=K.brass(c), glass=K.glass(c);
    const tube=mesh(new THREE.CylinderGeometry(0.024,0.018,L,48,1,true),leather,[0,Y,0],[0,0,-Math.PI/2]);
    mesh(new THREE.CylinderGeometry(0.028,0.026,0.04,48,1,true),wd,[L/2-0.015,Y,0],[0,0,-Math.PI/2]); mesh(new THREE.CylinderGeometry(0.019,0.021,0.035,32,1,true),wd,[-L/2+0.012,Y,0],[0,0,-Math.PI/2]);
    mesh(new THREE.TorusGeometry(0.026,0.003,10,48),wd,[L/2+0.005,Y,0],[0,Math.PI/2,0]);
    lens(c,0.019,0.005,1,glass,[L/2-0.008,Y,0],[0,0,-Math.PI/2]); lens(c,0.01,0.004,-1,glass,[-L/2+0.01,Y,0],[0,0,-Math.PI/2]);
    mesh(new THREE.BoxGeometry(0.6,0.025,0.13),K.wood(c,'#2b1a10'),[0,0.0125,0]);
    [-0.24,0.24].forEach(x=>{ K.bar(c,[x,0.025,0],[x,Y-0.03,0],0.005,br); [-1,1].forEach(s=>K.bar(c,[x,Y-0.03,0],[x,Y-0.005,s*0.024],0.003,br)); });
    const rg=rays(c,[0.012,0,-0.012].map(h=>[[0.9,Y+h,0],[L/2-0.008,Y+h,0],[-L/2+0.01,Y+h*0.08,0],[-0.75,Y+h*0.08,0]]),0xffd95a,0.0012);
    lbl(P[0][0],[L/2,Y+0.05,0]); lbl(P[1][0],[-L/2,Y+0.045,0]); lbl(P[2][0],[0.1,Y+0.045,0]); lbl(P[3][0],[0.24,0.08,0.05]);
    anim(()=>{ rg.visible=c.play(); });
    return { cam:[0.3,0.45,0.78], tgt:[0,0.24,0], maxDist:4, minDist:0.08, near:0.005, cutAt:0, cutN:[0,0,-1] }; } });

/* ---------------- Nyuton reflektori ---------------- */
IM.push({ id:'newton', use:['observe'], icon:'🪞', yearN:1668,
  name:t3('Nyuton reflektori','Рефлектор Ньютона','Newton’s reflector'), year:t3('1668-yil','1668 г.','1668'),
  who:t3('Isaak Nyuton (Kembrij, Angliya)','Исаак Ньютон (Кембридж)','Isaac Newton (Cambridge, England)'),
  size:t3('Truba ~15 sm, ko‘zgu Ø 33 mm, ~40×','Труба ~15 см, зеркало Ø 33 мм, ~40×','Tube ~15 cm, mirror 33 mm, ~40×'),
  short:t3('Linza o‘rniga ko‘zgu ishlatgan birinchi amaliy teleskop','Первый практичный телескоп с зеркалом вместо линзы','The first practical telescope to use a mirror instead of a lens'),
  about:t3('Linzali teleskoplarda ranglar turlicha sinib, yulduz atrofida kamalak hoshiya paydo bo‘ladi (xromatik aberratsiya). Nyuton bu muammoni chetlab o‘tish uchun yorug‘likni botiq ko‘zgu bilan to‘pladi: ko‘zgu barcha ranglarni bir xil qaytaradi. Kichkina teleskop o‘zidan 6 baravar uzun linzali teleskop kabi kattalashtirgan. Bugungi barcha yirik teleskoplar — reflektorlar.',
    'В линзовых телескопах цвета преломляются по-разному, и вокруг звезды появляется радужная кайма (хроматическая аберрация). Ньютон обошёл эту проблему, собрав свет вогнутым зеркалом — оно отражает все цвета одинаково. Маленький телескоп увеличивал как рефрактор в 6 раз длиннее. Все крупнейшие телескопы сегодня — рефлекторы.',
    'In lens telescopes colours refract differently, leaving rainbow fringes round stars (chromatic aberration). Newton sidestepped this by gathering light with a concave mirror, which reflects all colours alike. His little telescope matched a refractor six times longer. Every large telescope today is a reflector.'),
  tasks:[t3('Rang hoshiyasisiz tiniq tasvir olish','Получать чёткое изображение без цветной каймы','Give sharp images without colour fringes'),
    t3('Kichik o‘lchamda katta kattalashtirish','Давать большое увеличение при малых размерах','Deliver high power in a small instrument'),
    t3('Yorug‘lik va ranglar tabiatini o‘rganish (Nyuton tajribalari)','Изучать природу света и цвета (опыты Ньютона)','Study light and colour (Newton’s experiments)')],
  how:[t3('Yorug‘lik ochiq trubaga kirib, tubdagi botiq (sferik) ko‘zguga tushadi.','Свет входит в открытую трубу и падает на вогнутое (сферическое) зеркало на дне.','Light enters the open tube and strikes the concave (spherical) mirror at the bottom.'),
    t3('Ko‘zgu nurlarni yuqoriga qaytarib, fokusga yig‘adi.','Зеркало отражает лучи вверх и сводит в фокус.','The mirror reflects the rays back up toward a focus.'),
    t3('Fokusdan oldin 45° burchakdagi kichik yassi ko‘zgu nurlarni yon tomonga, okulyarga buradi.','Перед фокусом маленькое плоское зеркало под 45° отводит лучи вбок, в окуляр.','Before the focus a small flat mirror at 45° turns the rays sideways into the eyepiece.'),
    t3('«Ichini ko‘rish» va «Ishlatib ko‘rish» ko‘zgular va nur yo‘lini ko‘rsatadi.','«Разрез» и «Показать в работе» показывают зеркала и ход лучей.','“Cutaway” and “See it work” reveal the mirrors and ray path.')],
  parts:[[t3('Botiq ko‘zgu','Вогнутое зеркало','Concave mirror'),t3('Mis va qalay qotishmasidan (spekulum), Ø 33 mm.','Из сплава меди и олова (спекулум), Ø 33 мм.','Copper–tin speculum alloy, 33 mm across.')],
    [t3('Diagonal ko‘zgu','Диагональное зеркало','Diagonal mirror'),t3('45° burchakda — nurni yon tomonga buradi.','Под 45° — отводит лучи вбок.','At 45°, turning the light sideways.')],
    [t3('Okulyar','Окуляр','Eyepiece'),t3('Truba yon tomonida — kuzatuvchi yonboshdan qaraydi.','Сбоку трубы — наблюдатель смотрит сбоку.','On the side of the tube; you look in from the side.')],
    [t3('Shar-sharnir','Шаровой шарнир','Ball mount'),t3('Trubani istalgan tomonga burish imkonini beradi.','Позволяет поворачивать трубу в любую сторону.','Lets the tube point in any direction.')]],
  facts:[t3('Nyuton ko‘zgusini o‘zi quyib, o‘zi silliqlagan; ko‘zgu qotishmasi tez xiralashgani uchun tez-tez qayta jilolangan.','Ньютон сам отлил и отшлифовал зеркало; сплав быстро тускнел, и его часто переполировывали.','Newton cast and polished the mirror himself; the alloy tarnished quickly and needed frequent repolishing.'),
    t3('1671-yilda teleskopning nusxasi London Qirollik jamiyatiga ko‘rsatildi va Nyuton jamiyat a’zosi etib saylandi.','В 1671 г. экземпляр показали Лондонскому королевскому обществу, и Ньютона избрали его членом.','In 1671 a copy was shown to the Royal Society, and Newton was elected a Fellow.')],
  env:{ sky:'studio', shadow:0.45, size:3, floor:'wood' },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, CY=0.27;
    const wd=K.wood(c,'#4a2a16'), br=K.brass(c), tubeM=M({ map:c.X.noise('#4a2f1c',0.08,[2,1]), rough:0.55, env:0.7, bump:0.1, clip:true, side:THREE.DoubleSide }), mir=K.steel(c,{ map:c.X.metal('#d6d0c4'), rough:0.08, env:2, side:THREE.DoubleSide });
    K.lathe(c,[[0,0],[0.11,0],[0.11,0.02],[0.09,0.035],[0.04,0.05],[0.025,0.09],[0.02,0.17],[0.03,0.2],[0.04,0.22],[0,0.22]],wd);
    mesh(new THREE.SphereGeometry(0.03,32,24),wd,[0,0.235,0]);
    const tb=new THREE.Group(); tb.position.set(0,CY,0); tb.rotation.z=-55*D; c.root.add(tb);
    mesh(new THREE.CylinderGeometry(0.031,0.031,0.17,48,1,true),tubeM,[0,0.02,0],null,tb);
    mesh(new THREE.CylinderGeometry(0.031,0.031,0.012,48),tubeM,[0,-0.066,0],null,tb); mesh(new THREE.TorusGeometry(0.031,0.003,8,48),br,[0,0.105,0],[Math.PI/2,0,0],tb);
    K.bar(c,[0,-0.03,0],[0.028,-0.03,0],0.008,br,tb);
    mesh(new THREE.SphereGeometry(0.06,32,8,0,Math.PI*2,Math.PI-0.29,0.29),mir,[0,0.0,0],null,tb);
    mesh(new THREE.BoxGeometry(0.012,0.002,0.016),mir,[0,0.075,0],[0,0,Math.PI/4],tb);
    K.bar(c,[0,0.075,0],[0,0.075,-0.03],0.0012,br,tb);
    mesh(new THREE.CylinderGeometry(0.008,0.008,0.03,24),br,[0.042,0.075,0],[0,0,Math.PI/2],tb); lens(c,0.006,0.003,1,K.glass(c),[0.058,0.075,0],[0,0,Math.PI/2],tb);
    const rg=rays(c,[0.018,-0.018].map(h=>[[h,0.25,0],[h,-0.058,0],[h*0.27,0.075,0],[0.07,0.075,0]]).concat([[[0,0.25,0],[0,-0.058,0]]]),0xffd95a,0.0008,tb);
    lbl(P[0][0],[0.08,0.18,0]); lbl(P[1][0],[-0.04,CY+0.11,0]); lbl(P[2][0],[0.12,CY+0.08,0.02]); lbl(P[3][0],[-0.06,0.24,0.02]);
    anim(()=>{ rg.visible=c.play(); });
    return { cam:[0.18,0.38,0.42], tgt:[0,0.25,0], maxDist:2.5, minDist:0.06, near:0.004, cutAt:0, cutN:[0,0,-1] }; } });

/* ---------------- Meridian asbobi ---------------- */
IM.push({ id:'transit', use:['time','angle'], icon:'🧮', yearN:1690,
  name:t3('Meridian asbobi (tranzit doirasi)','Меридианный инструмент (пассажный круг)','Transit circle (meridian instrument)'), year:t3('1690-yil; Eyri doirasi — 1850','1690 г.; круг Эйри — 1850','1690; Airy’s circle — 1850'),
  who:t3('Ole Ryomer (Daniya); Jorj Eyri (Grinvich)','Оле Рёмер (Дания); Джордж Эйри (Гринвич)','Ole Rømer (Denmark); George Airy (Greenwich)'),
  size:t3('Truba ~3 m, doiralar Ø 0,9 m','Труба ~3 м, круги Ø 0,9 м','Tube ~3 m, circles Ø 0.9 m'),
  short:t3('Faqat meridian bo‘ylab buriladigan teleskop: aniq vaqt va yulduz koordinatalari','Телескоп, вращающийся только в меридиане: точное время и координаты звёзд','A telescope that swings only in the meridian: exact time and star positions'),
  about:t3('Meridian asbobi — sharq–g‘arb yo‘nalishidagi gorizontal o‘qqa o‘rnatilgan teleskop. U faqat shimol–janub tekisligida buriladi, shuning uchun yulduzlar uni faqat meridiandan o‘tayotganda kesib o‘tadi. O‘tish vaqti yulduz to‘g‘ri chiqishini, o‘qdagi graduslangan doira esa og‘ishini beradi. Grinvichdagi Eyri tranzit doirasi orqali o‘tgan chiziq 1884-yilda dunyoning Bosh meridiani deb qabul qilingan.',
    'Меридианный инструмент — телескоп на горизонтальной оси восток–запад. Он поворачивается только в плоскости север–юг, поэтому звёзды пересекают поле зрения лишь в момент прохождения меридиана. Время прохождения даёт прямое восхождение звезды, а градуированный круг на оси — склонение. Линия через пассажный круг Эйри в Гринвиче в 1884 г. стала нулевым меридианом мира.',
    'A transit instrument is a telescope on an east–west horizontal axis. It swings only in the north–south plane, so stars cross its view only as they cross the meridian. The crossing time gives a star’s right ascension and a graduated circle on the axis its declination. The line through Airy’s transit circle at Greenwich became the world’s prime meridian in 1884.'),
  tasks:[t3('Aniq vaqtni yulduzlar bo‘yicha aniqlash va soatlarni tekshirish','Определять точное время по звёздам и проверять часы','Keep exact time from the stars and check clocks'),
    t3('Yulduzlarning to‘g‘ri chiqishi va og‘ishini o‘lchash (kataloglar)','Измерять прямое восхождение и склонение звёзд (каталоги)','Measure right ascension and declination (catalogues)'),
    t3('Joyning uzunligini aniqlash','Определять долготу места','Determine longitude')],
  how:[t3('Teleskop ikki tosh ustunga tayangan sharq–g‘arb o‘qida aylanadi — faqat meridian tekisligida.','Труба вращается на оси восток–запад, опирающейся на два каменных столба, — только в плоскости меридиана.','The tube turns on an east–west axis resting on two stone piers — only in the meridian plane.'),
    t3('Ko‘rish maydonida tik iplar to‘ri bor; kuzatuvchi yulduz har bir ipdan o‘tgan paytni soat bo‘yicha qayd etadi.','В поле зрения натянута сетка нитей; наблюдатель отмечает по часам прохождение звезды через каждую нить.','A grid of wires sits in the eyepiece; the observer times the star crossing each wire.'),
    t3('O‘rtacha o‘tish vaqti — to‘g‘ri chiqish; graduslangan doira mikroskoplar orqali o‘qilib, og‘ish topiladi.','Среднее время прохождения — прямое восхождение; по кругу через микроскопы читают склонение.','The mean crossing time gives right ascension; reading the circle through microscopes gives declination.'),
    t3('«Ishlatib ko‘rish» trubaning meridian bo‘ylab burilishini ko‘rsatadi.','«Показать в работе» показывает поворот трубы по меридиану.','“See it work” swings the tube along the meridian.')],
  parts:[[t3('Teleskop trubasi','Труба телескопа','Telescope tube'),t3('Shimol–janub tekisligida buriladi.','Поворачивается в плоскости север–юг.','Swings in the north–south plane.')],
    [t3('Gorizontal o‘q','Горизонтальная ось','Horizontal axis'),t3('Sharq–g‘arb yo‘nalishida, ikki konus shaklida.','Направлена восток–запад, из двух конусов.','Runs east–west, made of two cones.')],
    [t3('Graduslangan doira','Градуированный круг','Graduated circle'),t3('Og‘ishni o‘lchash uchun nozik shkala.','Тонкая шкала для измерения склонения.','Fine scale for declination.')],
    [t3('Tosh ustunlar','Каменные столбы','Stone piers'),t3('Titrashsiz, barqaror tayanch.','Устойчивая опора без вибраций.','Steady, vibration-free supports.')],
    [t3('O‘qish mikroskoplari','Отсчётные микроскопы','Reading microscopes'),t3('Doira shkalasini yoy soniyalarigacha o‘qiydi.','Читают шкалу круга до угловых секунд.','Read the circle to arcseconds.')]],
  facts:[t3('Eyri tranzit doirasi orqali o‘tgan chiziq — Grinvich meridiani, butun dunyoda uzunlik 0°.','Линия через круг Эйри — Гринвичский меридиан, долгота 0° для всего мира.','The line through Airy’s circle is the Greenwich meridian, 0° longitude worldwide.'),
    t3('XX asr o‘rtasigacha aniq vaqt xizmati aynan meridian asboblari kuzatuvlariga asoslangan.','До середины XX в. служба точного времени основывалась на наблюдениях меридианных инструментов.','Until the mid-20th century time services relied on transit observations.')],
  env:{ sky:'studio', shadow:3.2, size:16, floor:'stone' },
  feat:{ play:true },
  build(c){ const {THREE,M,X,mesh,lbl,anim}=c, P=this.parts, AY=1.75;
    const stone=M({ map:X.noise('#cfc8b8',0.12,[1,2]), rough:0.75, bump:0.4 }), paint=M({ color:0x56656c, metal:0.55, rough:0.42, env:1.0, bump:0.05 }), br=K.brass(c), st=K.steel(c);
    [-0.95,0.95].forEach(x=>{ mesh(new THREE.BoxGeometry(0.55,AY-0.1,0.7),stone,[x,(AY-0.1)/2,0]); mesh(new THREE.BoxGeometry(0.62,0.08,0.78),stone,[x,AY-0.06,0]); mesh(new THREE.BoxGeometry(0.16,0.12,0.16),br,[x*0.86,AY-0.0,0]); });
    mesh(new THREE.BoxGeometry(3.2,0.04,1.4),stone,[0,0.02,0]);
    const ax=new THREE.Group(); ax.position.y=AY; c.root.add(ax);
    [-1,1].forEach(s=>{ mesh(new THREE.CylinderGeometry(0.06,0.16,0.62,32),paint,[s*0.35,0,0],[0,0,s*Math.PI/2],ax); mesh(new THREE.CylinderGeometry(0.035,0.035,0.3,20),st,[s*0.8,0,0],[0,0,Math.PI/2],ax); });
    mesh(new THREE.BoxGeometry(0.3,0.3,0.3),paint,null,null,ax);
    mesh(new THREE.CylinderGeometry(0.13,0.15,1.5,48),paint,[0,0,-0.82],[Math.PI/2,0,0],ax); mesh(new THREE.CylinderGeometry(0.11,0.13,1.4,48),paint,[0,0,0.77],[Math.PI/2,0,0],ax);
    mesh(new THREE.CylinderGeometry(0.15,0.15,0.08,48),br,[0,0,-1.6],[Math.PI/2,0,0],ax); mesh(new THREE.CylinderGeometry(0.035,0.035,0.18,24),br,[0,0,1.55],[Math.PI/2,0,0],ax);
    const ct=K.plate(c,1024,'#d8d8d2',(x,w)=>{ const cx=w/2; K.ring(x,cx,cx,w*0.48,3); K.ring(x,cx,cx,w*0.44,2); K.scale(x,cx,cx,w*0.44,w*0.48,720,{ long:i=>i%20===0, mid:i=>i%10===0 }); });
    [-0.62,0.62].forEach(x=>{ const g=new THREE.Group(); g.position.x=x; ax.add(g);
      mesh(new THREE.CylinderGeometry(0.45,0.45,0.03,96),M({ map:ct, metal:0.9, rough:0.3, env:1.3, bump:0.02 }),null,[0,0,Math.PI/2],g).rotation.set(0,0,Math.PI/2);
      for(let i=0;i<6;i++) mesh(new THREE.BoxGeometry(0.03,0.82,0.035),paint,null,[i/6*Math.PI,0,0],g); });
    [-1,1].forEach(s=>{ for(let k=0;k<2;k++){ const a=(k?-1:1)*0.55; K.bar(c,[s*0.95,AY+0.25,Math.sin(a)*0.25],[s*0.67,AY+Math.cos(a)*0.46,Math.sin(a)*0.46],0.018,br); } K.bar(c,[s*0.95,AY+0.06,0],[s*0.95,AY+0.6,0],0.03,paint); K.bar(c,[s*0.95,AY+0.6,0],[s*0.5,AY+0.6,0],0.02,paint); });
    lbl(P[0][0],[0,AY+0.25,-1.2]); lbl(P[1][0],[0.3,AY+0.25,0]); lbl(P[2][0],[0.62,AY+0.55,0.2]); lbl(P[3][0],[-0.95,0.9,0.4]); lbl(P[4][0],[-0.95,AY+0.72,0]);
    let ph=0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.5; ax.rotation.x=0.45*Math.sin(ph)-0.25; });
    return { cam:[4.4,2.6,1.9], tgt:[0,1.4,0], maxDist:16, minDist:0.8 }; } });

/* ---------------- Orreri ---------------- */
IM.push({ id:'orrery', use:['model'], icon:'🪐', yearN:1713,
  name:t3('Orreri (planetariy mexanizmi)','Оррери (механический планетарий)','Orrery'), year:t3('~1704–1713-yillar','~1704–1713 гг.','~1704–1713'),
  who:t3('Jorj Grem va Tomas Tompion; Jon Roulining nusxasi — Orreri grafi uchun','Джордж Грэм и Томас Томпион; копия Джона Роули — для графа Оррери','George Graham and Thomas Tompion; John Rowley’s copy for the Earl of Orrery'),
  size:t3('Ø ~60 sm, balandligi ~0,9 m','Ø ~60 см, высота ~0,9 м','Ø ~60 cm, ~0.9 m tall'),
  short:t3('Sayyoralarning Quyosh atrofidagi harakatini tishli uzatmalar bilan ko‘rsatadi','Показывает движение планет вокруг Солнца с помощью зубчатых передач','Shows the planets circling the Sun, driven by gears'),
  about:t3('Orreri — Quyosh tizimining mexanik modeli. Dasta yoki soat mexanizmi aylantirilganda tishli g‘ildiraklar har bir sayyorani o‘z davriga mos tezlikda harakatlantiradi: Merkuriy tez, Saturn juda sekin. Masofalar va o‘lchamlar haqiqiy nisbatda emas, aks holda Saturn bir necha metr narida bo‘lardi. Nomi 1713-yilda nusxa buyurtma qilgan Orreri grafi Charlz Boyl sharafiga qo‘yilgan.',
    'Оррери — механическая модель Солнечной системы. Когда вращают ручку или часовой механизм, шестерни ведут каждую планету со скоростью, соответствующей её периоду: Меркурий быстро, Сатурн очень медленно. Расстояния и размеры не в масштабе, иначе Сатурн оказался бы за несколько метров. Название — в честь Чарльза Бойля, графа Оррери, заказавшего копию в 1713 г.',
    'An orrery is a mechanical model of the Solar System. Turn a handle or clockwork and the gears carry each planet round at a speed matching its period: Mercury quickly, Saturn very slowly. Distances and sizes are not to scale, or Saturn would be metres away. It is named after Charles Boyle, Earl of Orrery, who ordered a copy in 1713.'),
  tasks:[t3('Sayyoralar harakatini ko‘rgazmali tushuntirish','Наглядно объяснять движение планет','Explain planetary motion visually'),
    t3('Sayyoralarning o‘zaro joylashuvini (konfiguratsiyalarni) ko‘rsatish','Показывать взаимное расположение (конфигурации) планет','Show planetary configurations'),
    t3('Oy fazalari va tutilishlarni tushuntirish','Объяснять фазы Луны и затмения','Explain lunar phases and eclipses')],
  how:[t3('Markazdagi ustun atrofida bir-birining ichiga kiygizilgan quvurlar bor — har biri bitta sayyora qo‘lini aylantiradi.','Вокруг центральной оси надеты вложенные трубки — каждая вращает рычаг одной планеты.','Nested tubes surround the central post; each turns one planet’s arm.'),
    t3('Quvurlar baraban ichidagi tishli g‘ildiraklar bilan bog‘langan; tishlar nisbati sayyora davrlarini beradi (Yer 1 yil, Yupiter 11,86 yil).','Трубки связаны шестернями внутри барабана; отношения зубьев дают периоды (Земля 1 год, Юпитер 11,86 года).','Gears inside the drum link the tubes; tooth ratios give the periods (Earth 1 year, Jupiter 11.86).'),
    t3('Yer qo‘lida alohida uzatma Oyni Yer atrofida yiliga ~13,4 marta aylantiradi.','Отдельная передача на рычаге Земли обращает Луну ~13,4 раза в год.','A separate train on Earth’s arm turns the Moon ~13.4 times a year.'),
    t3('«Ishlatib ko‘rish» vaqtni tezlashtiradi: bir yil — 6 soniya.','«Показать в работе» ускоряет время: год — 6 секунд.','“See it work” speeds time up: a year in 6 seconds.')],
  parts:[[t3('Quyosh','Солнце','Sun'),t3('Markazdagi zarhal shar.','Позолоченный шар в центре.','Gilded sphere at the centre.')],
    [t3('Yer va Oy','Земля и Луна','Earth and Moon'),t3('Yer o‘qi 23,4° og‘gan; Oy alohida qo‘lda aylanadi.','Ось Земли наклонена на 23,4°; Луна на своём рычаге.','Earth tilted 23.4°; the Moon on its own arm.')],
    [t3('Saturn halqasi','Кольца Сатурна','Saturn’s rings'),t3('Eng tashqi va eng sekin sayyora (29,5 yil).','Самая внешняя и медленная планета (29,5 лет).','Outermost and slowest planet (29.5 years).')],
    [t3('Tishli baraban','Барабан с шестернями','Gear drum'),t3('Ichida uzatmalar; yuzasida zodiak va oylar shkalasi.','Внутри передачи; сверху шкала зодиака и месяцев.','Gearing inside; zodiac and month scale on top.')],
    [t3('Sayyora qo‘llari','Рычаги планет','Planet arms'),t3('Guruch qo‘llar ichma-ich quvurlarga mahkamlangan.','Латунные рычаги на вложенных трубках.','Brass arms on nested tubes.')]],
  facts:[t3('Orrerilar XVIII asrda zodagonlar salonlari va universitetlarda ilm-fanni ommalashtirish vositasi bo‘lgan.','В XVIII в. оррери были средством популяризации науки в салонах и университетах.','In the 18th century orreries popularised science in salons and universities.'),
    t3('Gollandiyaning Franeker shahridagi Eyse Eysinga planetariysi (1781) shiftga o‘rnatilgan va hanuz ishlaydi — dunyodagi eng qadimgi ishlaydigan planetariy.','Планетарий Эйсе Эйсинги во Франекере (1781) встроен в потолок и до сих пор работает — старейший действующий в мире.','Eise Eisinga’s planetarium in Franeker (1781), built into a ceiling, still runs — the oldest working one in the world.')],
  env:{ sky:'studio', shadow:1.1, size:7, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, TOP=0.66, PY=0.8;
    const wd=K.wood(c,'#4b2412'), br=K.brass(c);
    const dt=c.tex(1024,1024,(x,w)=>{ const cx=w/2, s=w/0.6; x.fillStyle='#ebdfbf'; x.fillRect(0,0,w,w); x.strokeStyle=x.fillStyle='#3a2812';
      [0.295,0.27,0.245,0.22].forEach(r=>K.ring(x,cx,cx,r*s,2)); K.scale(x,cx,cx,0.27*s,0.295*s,360,{ long:i=>i%30===0, mid:i=>i%5===0 });
      const Z=['ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITT.','CAPRIC.','AQUAR.','PISCES'], Mo=['MART','APREL','MAY','IYUN','IYUL','AVGUST','SENTABR','OKTABR','NOYABR','DEKABR','YANVAR','FEVRAL'];
      K.scale(x,cx,cx,0.245*s,0.27*s,12,{ long:()=>true, lab:i=>Z[i], lr:0.2575*s, font:'bold 16px serif' }); K.scale(x,cx,cx,0.22*s,0.245*s,12,{ long:()=>true, lab:i=>Mo[i], lr:0.2325*s, font:'14px serif' });
      const g=x.createRadialGradient(cx,cx,0,cx,cx,0.22*s); g.addColorStop(0,'#1d2a4a'); g.addColorStop(1,'#0f1830'); x.fillStyle=g; x.beginPath(); x.arc(cx,cx,0.22*s-1,0,7); x.fill();
      for(let i=0;i<220;i++){ const a=Math.random()*7, r=Math.random()*0.21*s; x.fillStyle='rgba(255,240,200,'+(0.3+Math.random()*0.6)+')'; x.beginPath(); x.arc(cx+Math.cos(a)*r,cx+Math.sin(a)*r,0.8+Math.random()*1.4,0,7); x.fill(); } });
    mesh(new THREE.CylinderGeometry(0.3,0.3,0.09,96),wd,[0,TOP-0.045,0]); mesh(new THREE.CircleGeometry(0.3,96).rotateX(-Math.PI/2),M({ map:dt, rough:0.5, env:0.7, clean:true }),[0,TOP+0.0005,0]);
    mesh(new THREE.TorusGeometry(0.3,0.006,8,96),br,[0,TOP,0],[Math.PI/2,0,0]); mesh(new THREE.TorusGeometry(0.3,0.006,8,96),br,[0,TOP-0.09,0],[Math.PI/2,0,0]);
    for(let i=0;i<3;i++){ const a=i/3*Math.PI*2, ca=Math.cos(a), sa=Math.sin(a), cv=new THREE.CatmullRomCurve3([[0.12,TOP-0.09],[0.2,0.42],[0.17,0.25],[0.22,0.08],[0.3,0.01]].map(([r,y])=>new THREE.Vector3(ca*r,y,sa*r)));
      mesh(new THREE.TubeGeometry(cv,40,0.022,12),wd); mesh(new THREE.SphereGeometry(0.028,16,12),wd,[ca*0.3,0.02,sa*0.3]); }
    K.lathe(c,[[0,0.4],[0.1,0.4],[0.06,0.48],[0.12,TOP-0.09],[0,TOP-0.09]],wd);
    K.lathe(c,[[0,TOP],[0.03,TOP],[0.018,TOP+0.03],[0.014,PY-0.05],[0,PY-0.05]],br);
    const sun=mesh(new THREE.SphereGeometry(0.048,48,32),M({ map:c.img('textures/2k_sun.jpg'), emissive:0xffb040, ei:0.6, metal:0.3, rough:0.4, clean:true }),[0,PY,0]);
    const pl=new THREE.PointLight(0xffcf8a,0.7,1.6,2); pl.position.set(0,PY,0); c.root.add(pl);
    const PL=[['mercury',0.008,0.085,0.241],['venus_atmosphere',0.013,0.12,0.615],['earth_daymap',0.014,0.165,1],['mars',0.011,0.205,1.881],['jupiter',0.03,0.25,11.86],['saturn',0.024,0.3,29.46]];
    const arms=PL.map(([tx,r,R,Pd],k)=>{ const g=new THREE.Group(); g.position.y=TOP+0.012+k*0.012; g.rotation.y=k*1.7; c.root.add(g);
      mesh(new THREE.CylinderGeometry(0.02-k*0.0012,0.02-k*0.0012,0.01,24),br,null,null,g); mesh(new THREE.BoxGeometry(R,0.004,0.008),br,[R/2,0,0],null,g);
      const h=PY-g.position.y; K.bar(c,[R,0,0],[R,h,0],0.0025,br,g);
      const pg=new THREE.Group(); pg.position.set(R,h,0); g.add(pg); const ball=mesh(new THREE.SphereGeometry(r,32,24),M({ map:c.img('textures/2k_'+tx+'.jpg'), rough:0.8, clean:true, env:0.4 }),null,null,pg);
      if(tx==='earth_daymap'){ ball.rotation.z=23.44*D; const mg=new THREE.Group(); pg.add(mg); mesh(new THREE.BoxGeometry(0.028,0.002,0.003),br,[0.014,0,0],null,mg); mesh(new THREE.SphereGeometry(0.004,16,12),M({ map:c.img('textures/2k_moon.jpg'), rough:0.9, clean:true }),[0.028,0,0],null,mg); g.userData.moon=mg; }
      if(tx==='saturn'){ const rt=c.img('textures/2k_saturn_ring_alpha.png'), rr=new THREE.RingGeometry(r*1.25,r*2.2,64), uv=rr.attributes.uv, pp=rr.attributes.position;
        for(let i=0;i<uv.count;i++){ const d=Math.hypot(pp.getX(i),pp.getY(i)); uv.setXY(i,(d-r*1.25)/(r*0.95),0.5); }
        mesh(rr,M({ map:rt, clean:true, transparent:true, side:THREE.DoubleSide, rough:0.8 }),null,[Math.PI/2-0.47,0,0],pg); }
      g.userData.ball=ball; g.userData.P=Pd; return g; });
    lbl(P[0][0],[0,PY+0.08,0]); lbl(P[3][0],[0.3,TOP-0.03,0.12]); lbl(P[4][0],[0.1,TOP+0.06,0.1]);
    const eL=K.lblRef(c,P[1][0],[0,0,0]), sL=K.lblRef(c,P[2][0],[0,0,0]), v=new THREE.Vector3();
    anim((t,dt)=>{ const yr=c.play()?6:80; arms.forEach(g=>{ g.rotation.y-=dt*Math.PI*2/(yr*g.userData.P); g.userData.ball.rotation.y+=dt*2; if(g.userData.moon) g.userData.moon.rotation.y-=dt*Math.PI*2*13.37/yr; });
      arms[2].userData.ball.getWorldPosition(v); eL.p.set(v.x,v.y+0.04,v.z); arms[5].userData.ball.getWorldPosition(v); sL.p.set(v.x,v.y+0.05,v.z); });
    return { cam:[0.85,1.15,0.95], tgt:[0,0.72,0], maxDist:5, minDist:0.2, near:0.01 }; } });

/* ---------------- Sekstant ---------------- */
IM.push({ id:'sextant', use:['angle','nav'], icon:'⚓', yearN:1757,
  name:t3('Sekstant','Секстант','Sextant'), year:t3('1757-yil (oktant — 1731)','1757 г. (октант — 1731)','1757 (octant — 1731)'),
  who:t3('Jon Kempbell; oktant — Jon Xedli va Tomas Godfri','Джон Кэмпбелл; октант — Джон Хэдли и Томас Годфри','John Campbell; the octant — John Hadley and Thomas Godfrey'),
  size:t3('Radiusi ~17 sm, yoy 60°','Радиус ~17 см, дуга 60°','Radius ~17 cm, 60° arc'),
  short:t3('Ikki ko‘zgu yordamida chayqalayotgan kemada ham Quyosh balandligini aniq o‘lchaydi','С двумя зеркалами точно измеряет высоту Солнца даже на качающемся судне','Uses two mirrors to measure the Sun’s height precisely, even on a rolling ship'),
  about:t3('Sekstant — dengizchilarning asosiy navigatsiya asbobi. Ikki marta qaytish tamoyili tufayli kuzatuvchi bir vaqtda ham ufqni, ham Quyosh yoki yulduzni ko‘radi — kema chayqalsa ham ikkalasi birga siljiydi. Peshinda Quyosh balandligidan kenglik, aniq soat bilan esa uzunlik topiladi. Yoy osmonning 60° qismiga teng, lekin ikki marta qaytish sababli 120° gacha o‘lchaydi.',
    'Секстант — главный навигационный инструмент моряков. Благодаря двойному отражению наблюдатель одновременно видит горизонт и Солнце или звезду — при качке они смещаются вместе. По полуденной высоте Солнца находят широту, а с точными часами — долготу. Дуга равна 60°, но из-за двойного отражения измеряет до 120°.',
    'The sextant is the sailor’s key navigation instrument. Thanks to double reflection the observer sees the horizon and the Sun or a star at once — when the ship rolls, both move together. The noon Sun’s height gives latitude; with an accurate clock, longitude too. The arc spans 60° of a circle but, by double reflection, measures up to 120°.'),
  tasks:[t3('Quyosh, Oy va yulduzlarning ufqdan balandligini o‘lchash','Измерять высоту Солнца, Луны и звёзд над горизонтом','Measure the height of the Sun, Moon and stars'),
    t3('Dengizda kenglik va (xronometr bilan) uzunlikni aniqlash','Определять в море широту и (с хронометром) долготу','Fix latitude and, with a chronometer, longitude at sea'),
    t3('Oy masofalari usuli bilan vaqtni topish','Определять время методом лунных расстояний','Find the time by lunar distances')],
  how:[t3('Durbin orqali gorizont ko‘zgusining shaffof yarmidan ufq ko‘rinadi.','Через трубу в прозрачную половину зеркала горизонта виден горизонт.','Through the telescope you see the horizon via the clear half of the horizon mirror.'),
    t3('Indeks qo‘li surilganda indeks ko‘zgusi buriladi va Quyosh tasviri ko‘zgulardan ikki marta qaytib, ufq yoniga tushadi.','При сдвиге индекса поворачивается индекс-зеркало, и изображение Солнца, отразившись дважды, опускается к горизонту.','Moving the index arm turns the index mirror, and the Sun’s image, reflected twice, drops to the horizon.'),
    t3('Quyosh pastki cheti ufqqa tekkanda yoydagi shkala va nonius bo‘yicha burchak o‘qiladi (0,1′ aniqlikda).','Когда нижний край Солнца касается горизонта, угол читают по шкале и нониусу (точность 0,1′).','When the Sun’s lower limb touches the horizon, read the angle on the arc and vernier (to 0.1′).'),
    t3('Ko‘z Quyosh nuridan rangli filtrlar bilan himoyalanadi. «Ishlatib ko‘rish» indeks qo‘lini suradi.','Глаза защищают цветные светофильтры. «Показать в работе» двигает индекс.','Coloured shades protect the eye. “See it work” moves the index arm.')],
  parts:[[t3('Graduslangan yoy (limb)','Лимб','Graduated arc (limb)'),t3('60° yoy, 0–120° deb belgilangan.','Дуга 60°, размечена 0–120°.','60° arc marked 0–120°.')],
    [t3('Indeks qo‘li','Алидада (индекс)','Index arm'),t3('Pastida nonius va mikrometr barabani.','Внизу нониус и барабан микрометра.','Vernier and micrometer drum at its foot.')],
    [t3('Indeks ko‘zgusi','Большое (индекс) зеркало','Index mirror'),t3('Qo‘l bilan birga buriladi.','Поворачивается вместе с алидадой.','Turns with the index arm.')],
    [t3('Gorizont ko‘zgusi','Малое зеркало (горизонта)','Horizon mirror'),t3('Yarmi kumushlangan, yarmi shaffof.','Наполовину посеребрено, наполовину прозрачно.','Half silvered, half clear.')],
    [t3('Durbin','Зрительная труба','Telescope'),t3('Ufq va tasvirni kattalashtiradi.','Увеличивает горизонт и изображение светила.','Magnifies horizon and image.')],
    [t3('Himoya filtrlari','Светофильтры','Shades'),t3('Quyoshga qaraganda ko‘zni asraydi.','Защищают глаза при наблюдении Солнца.','Protect the eye from the Sun.')],
    [t3('Dasta','Рукоять','Handle'),t3('Yog‘och dasta orqa tomonda.','Деревянная рукоять сзади.','Wooden grip at the back.')]],
  facts:[t3('Apollon kosmik kemalarida ham yo‘nalishni yulduzlar bo‘yicha aniqlash uchun maxsus sekstant bo‘lgan.','На кораблях «Аполлон» был специальный секстант для ориентации по звёздам.','Apollo spacecraft carried a special sextant for navigating by the stars.'),
    t3('Ko‘plab harbiy-dengiz akademiyalarida GPS ishlamay qolgan holat uchun sekstant bilan ishlash hanuz o‘rgatiladi.','Во многих военно-морских академиях до сих пор учат работать с секстантом — на случай отказа GPS.','Many naval academies still teach the sextant in case GPS fails.')],
  env:{ sky:'studio', shadow:0.5, size:3, floor:'wood' },
  feat:{ play:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, S=new THREE.Group(), R=0.17, A0=-125*D, A1=-55*D;
    S.position.set(0,0.36,0); c.root.add(S); const br=K.brass(c), dk=K.brass(c,{ map:c.X.metal('#2c2a26'), metal:0.6, rough:0.45 }), mirror=K.steel(c,{ map:c.X.metal('#e6eaee'), rough:0.04, env:2.2 }), wd=K.wood(c,'#3a2012');
    const st=c.texB(1024,1024,(x,w,h)=>{ const s=w/(2*R), cx=w/2; c.paint(x,w,[[0,170,170,165],[1,215,215,210]],{ oct:4, speck:6 }); x.strokeStyle=x.fillStyle='rgba(25,25,25,.9)';
      K.ring(x,cx,cx,0.157*s,1.5); K.ring(x,cx,cx,0.173*s,1.5); K.scale(x,cx,cx,0.157*s,0.168*s,140,{ a0:A1, a1:A0, long:i=>i%10===0, mid:i=>i%5===0, lab:i=>i%10===0?String(i-10):null, lr:0.1755*s, font:'bold 18px sans-serif' }); });
    K.ext(c,K.annulus(c,R+0.008,0.152,A0-0.04,A1+0.04),0.006,br,[0,0,0],null,S);
    K.ext(c,K.annulus(c,0.175,0.155,A0,A1),0.0008,M({ map:K.fit(st,-R,-R,2*R), metal:0.95, rough:0.25, env:1.4, bump:0.02 }),[0,0,0.006],null,S);
    [A0,A1].forEach(a=>flat(c,[0,0],[Math.cos(a)*0.155,Math.sin(a)*0.155],0.014,0.006,br,S,0.003));
    K.ext(c,K.annulus(c,0.095,0.083,A0,A1),0.006,br,[0,0,0],null,S);
    [[-0.045,-0.11],[0.045,-0.11],[0,-0.13]].forEach(([x,y])=>K.ext(c,K.annulus(c,0.016,0.011),0.006,br,[x,y,0],null,S));
    // indeks qo'li
    const arm=new THREE.Group(); arm.position.z=0.009; S.add(arm); flat(c,[0,0],[0,-0.178],0.016,0.004,br,arm);
    mesh(new THREE.BoxGeometry(0.03,0.014,0.006),br,[0,-0.172,0.003],null,arm); mesh(new THREE.CylinderGeometry(0.008,0.008,0.012,24),br,[0.022,-0.172,0.005],[0,0,Math.PI/2],arm);
    mesh(new THREE.BoxGeometry(0.004,0.05,0.042),mirror,[0,0.008,0.024],null,arm); mesh(new THREE.BoxGeometry(0.006,0.054,0.045),dk,[-0.004,0.008,0.024],null,arm);
    mesh(new THREE.CylinderGeometry(0.01,0.01,0.006,24),br,[0,0,0.002],[Math.PI/2,0,0],arm);
    // gorizont ko'zgusi va durbin
    const hx=Math.cos(A0)*0.075, hy=Math.sin(A0)*0.075; mesh(new THREE.BoxGeometry(0.004,0.03,0.03),mirror,[hx-0.004,hy+0.01,0.024],[0,0,0.35],S); mesh(new THREE.BoxGeometry(0.006,0.034,0.034),dk,[hx-0.008,hy+0.01,0.024],[0,0,0.35],S);
    mesh(new THREE.CylinderGeometry(0.011,0.011,0.1,24),br,[0.06,hy+0.012,0.03],[0,0,Math.PI/2],S); mesh(new THREE.CylinderGeometry(0.013,0.013,0.015,24),dk,[0.115,hy+0.012,0.03],[0,0,Math.PI/2],S);
    // filtrlar
    [0x2c7a4b,0x9b2d2d,0x2d4f9b].forEach((col,k)=>mesh(new THREE.BoxGeometry(0.026,0.026,0.002),M({ clean:true, color:col, transparent:true, opacity:0.55, rough:0.1, env:1.4 }),[-0.03,-0.035,0.018+k*0.005],[0,0,0.3],S));
    // dasta va tayanch
    K.bar(c,[0.03,-0.06,-0.003],[0.03,-0.06,-0.03],0.004,br,S); K.bar(c,[0.03,-0.13,-0.003],[0.03,-0.13,-0.03],0.004,br,S); K.bar(c,[0.03,-0.055,-0.035],[0.03,-0.135,-0.035],0.012,wd,S);
    mesh(new THREE.BoxGeometry(0.18,0.025,0.12),K.wood(c,'#2b1a10'),[0,0.0125,-0.02]); K.bar(c,[0.03,0.025,-0.035],[0.03,0.36-0.135,-0.035],0.005,br);
    lbl(P[0][0],[-0.13,0.36-0.12,0.01]); lbl(P[2][0],[0,0.36+0.04,0.02]); lbl(P[3][0],[hx-0.02,0.36+hy+0.04,0.03]); lbl(P[4][0],[0.12,0.36+hy+0.035,0.03]); lbl(P[5][0],[-0.07,0.36-0.06,0.04]); lbl(P[6][0],[0.04,0.36-0.1,-0.05]);
    const aL=K.lblRef(c,P[1][0],[0,0,0]), v=new THREE.Vector3();
    let ph=0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.6; const a=-90*D+0.36*Math.sin(ph)-0.05; arm.rotation.z=a+Math.PI/2; const read=2*((A1/D)-(a/D))-10; v.set(Math.cos(a)*0.2,0.36+Math.sin(a)*0.2,0.02); aL.p.copy(v); aL.el.textContent=K.T(P[1][0])+': '+read.toFixed(1)+'°'; });
    return { cam:[0.06,0.38,0.55], tgt:[0,0.26,0], maxDist:2.5, minDist:0.08, near:0.005 }; } });

/* ---------------- Dengiz xronometri ---------------- */
IM.push({ id:'chronometer', use:['time','nav'], icon:'⏱', yearN:1759,
  name:t3('Dengiz xronometri','Морской хронометр','Marine chronometer'), year:t3('1759-yil (H4)','1759 г. (H4)','1759 (H4)'),
  who:t3('Jon Garrison (Angliya); quti xronometrlari — Arnold va Ernshou','Джон Гаррисон (Англия); коробочные хронометры — Арнольд и Эрншоу','John Harrison (England); box chronometers — Arnold and Earnshaw'),
  size:t3('Quti ~19 sm, siferblat Ø 12 sm','Ящик ~19 см, циферблат Ø 12 см','Box ~19 cm, dial Ø 12 cm'),
  short:t3('Dengizda ham aniq yuruvchi soat — uzunlikni topish uchun','Точные даже в море часы — для определения долготы','A clock that keeps exact time at sea — to find longitude'),
  about:t3('Uzunlikni aniqlash uchun ikki joydagi mahalliy vaqt farqini bilish kerak: 4 daqiqa farq = 1°. Kemada Grinvich vaqtini saqlaydigan soat bo‘lsa, Quyosh bo‘yicha topilgan mahalliy vaqt bilan solishtirib, uzunlik hisoblanadi. Jon Garrison chayqalish, harorat va namlikka chidamli soat yaratib, bu muammoni hal qildi. Modeldagi strelkalar hozirgi vaqtni ko‘rsatadi.',
    'Чтобы найти долготу, нужно знать разницу местного времени двух мест: 4 минуты = 1°. Если на судне есть часы с гринвичским временем, их сравнивают с местным временем по Солнцу и вычисляют долготу. Джон Гаррисон создал часы, устойчивые к качке, температуре и влажности, и решил эту задачу. Стрелки модели показывают текущее время.',
    'To find longitude you need the difference in local time between two places: 4 minutes = 1°. If a ship carries a clock keeping Greenwich time, comparing it with local time from the Sun gives the longitude. John Harrison built a clock that resisted rolling, heat and damp and solved the problem. The model’s hands show the current time.'),
  tasks:[t3('Kemada bosh meridian (Grinvich) vaqtini aniq saqlash','Точно хранить на судне время нулевого (гринвичского) меридиана','Keep reference (Greenwich) time precisely aboard'),
    t3('Dengizda geografik uzunlikni hisoblash','Вычислять географическую долготу в море','Work out longitude at sea'),
    t3('Astronomik kuzatuvlar vaqtini qayd etish','Отмечать время астрономических наблюдений','Time astronomical observations')],
  how:[t3('Peshinda sekstant bilan mahalliy peshin aniqlanadi — mahalliy vaqt 12:00.','В полдень секстантом определяют местный полдень — местное время 12:00.','At noon, the sextant fixes local noon — 12:00 local time.'),
    t3('Xronometr shu paytda Grinvich vaqtini ko‘rsatadi, masalan 16:00.','Хронометр в этот момент показывает гринвичское время, например 16:00.','The chronometer reads Greenwich time at that moment, e.g. 16:00.'),
    t3('Farq 4 soat × 15° = 60° — kema Grinvichdan 60° g‘arbda.','Разница 4 ч × 15° = 60° — судно в 60° к западу от Гринвича.','A 4-hour difference × 15° = 60° — the ship is 60° west of Greenwich.'),
    t3('Kardan osmasi soatni doim gorizontal tutadi, yarim soniyali urish va harorat kompensatsiyasi aniqlikni ta’minlaydi.','Карданный подвес держит часы горизонтально, полусекундный ход и термокомпенсация дают точность.','A gimbal keeps the clock level; a half-second beat and temperature compensation give accuracy.')],
  parts:[[t3('Siferblat','Циферблат','Dial'),t3('Rim raqamlari, daqiqa shkalasi.','Римские цифры, минутная шкала.','Roman numerals and minute track.')],
    [t3('Sekund siferblati','Секундный циферблат','Seconds dial'),t3('Strelka har 0,5 soniyada sakraydi.','Стрелка прыгает каждые 0,5 с.','The hand ticks every half second.')],
    [t3('Quvvat zaxirasi','Запас хода','Power reserve'),t3('Necha soatga yetishini ko‘rsatadi (56 soat).','Показывает, на сколько часов хватит завода (56 ч).','Shows hours left on the wind (56 h).')],
    [t3('Kardan osmasi','Карданный подвес','Gimbal'),t3('Kema chayqalsa ham soat gorizontal turadi.','При качке часы остаются горизонтальными.','Keeps the clock level as the ship rolls.')],
    [t3('Maun quti','Ящик из красного дерева','Mahogany box'),t3('Guruch burchaklar, shisha ichki qopqoq.','Латунные уголки, внутренняя стеклянная крышка.','Brass corners and an inner glass lid.')]],
  facts:[t3('Garrisonning H4 soati 1761–62-yillarda Yamaykaga 81 kunlik safarda atigi 5 soniya orqada qolgan.','Часы H4 Гаррисона за 81 день плавания на Ямайку в 1761–62 гг. отстали всего на 5 секунд.','On an 81-day voyage to Jamaica in 1761–62 Harrison’s H4 lost only about 5 seconds.'),
    t3('1714-yilgi «Uzunlik qonuni» bu muammo yechimiga 20 000 funt sterling mukofot va’da qilgan.','«Акт о долготе» 1714 г. обещал за решение 20 000 фунтов.','The Longitude Act of 1714 offered a £20,000 prize for a solution.'),
    t3('Uzunlikda 1° xato ekvatorda ~111 km xatoga teng — kema qoyalarga borib urilishi mumkin edi.','Ошибка в 1° долготы на экваторе — это ~111 км: корабль мог разбиться о скалы.','A 1° longitude error at the equator is ~111 km — enough to wreck a ship.')],
  env:{ sky:'studio', shadow:0.45, size:3, floor:'wood' },
  feat:{},
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, B=0.19, Hh=0.16, DY=0.147, RD=0.058;
    const mah=K.wood(c,'#5a2414'), br=K.brass(c), blue=M({ clean:true, color:0x1c2f6e, metal:0.8, rough:0.25, env:1.5 });
    mesh(new THREE.BoxGeometry(B,0.01,B),mah,[0,0.005,0]);
    [[B/2-0.006,0,0.012,B],[-B/2+0.006,0,0.012,B],[0,B/2-0.006,B,0.012],[0,-B/2+0.006,B,0.012]].forEach(([x,z,w,d])=>mesh(new THREE.BoxGeometry(w,Hh,d),mah,[x,Hh/2,z]));
    const tp=new THREE.Shape(); tp.moveTo(-B/2,-B/2); tp.lineTo(B/2,-B/2); tp.lineTo(B/2,B/2); tp.lineTo(-B/2,B/2); tp.closePath(); const hp=new THREE.Path(); hp.absarc(0,0,0.068,0,Math.PI*2,true); tp.holes.push(hp);
    K.ext(c,tp,0.012,mah,[0,Hh,0],[-Math.PI/2,0,0]).position.y=Hh-0.012;
    mesh(new THREE.CircleGeometry(0.068,64).rotateX(-Math.PI/2),K.glass(c,{ opacity:0.12 }),[0,Hh+0.001,0]);
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx,sz])=>{ mesh(new THREE.BoxGeometry(0.025,0.004,0.025),br,[sx*(B/2-0.012),Hh+0.002,sz*(B/2-0.012)]); mesh(new THREE.BoxGeometry(0.004,0.025,0.025),br,[sx*(B/2+0.001),Hh-0.014,sz*(B/2-0.012)]); });
    mesh(new THREE.BoxGeometry(0.05,0.018,0.002),br,[0,Hh*0.55,B/2+0.001]);
    const lid=new THREE.Group(); lid.position.set(0,Hh,-B/2); lid.rotation.x=-108*D; c.root.add(lid); mesh(new THREE.BoxGeometry(B,0.014,B),mah,[0,0.007,B/2],null,lid); mesh(new THREE.BoxGeometry(0.06,0.002,0.03),br,[0,0.015,B*0.8],null,lid);
    // kardan halqasi va kosa
    mesh(new THREE.TorusGeometry(0.072,0.004,10,64),br,[0,DY-0.008,0],[Math.PI/2,0,0]); [-1,1].forEach(s=>K.bar(c,[s*0.072,DY-0.008,0],[s*(B/2-0.012),DY-0.008,0],0.003,br));
    K.lathe(c,[[0,DY-0.07],[0.03,DY-0.068],[0.05,DY-0.05],[0.062,DY-0.025],[0.066,DY-0.003],[0,DY-0.003]],br);
    mesh(new THREE.TorusGeometry(RD+0.004,0.004,12,64),br,[0,DY,0],[Math.PI/2,0,0]);
    const dt=c.tex(1024,1024,(x,w)=>{ const cx=w/2, s=w/(2*RD); c.paint(x,w,[[0,222,222,218],[1,245,245,242]],{ oct:4, speck:3 }); x.strokeStyle=x.fillStyle='#1a1a1a';
      K.ring(x,cx,cx,0.054*s,2); K.ring(x,cx,cx,0.05*s,1.2); K.scale(x,cx,cx,0.05*s,0.054*s,60,{ long:i=>i%5===0 });
      const RN=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI']; x.font='bold 54px serif'; x.textAlign='center'; x.textBaseline='middle';
      for(let i=0;i<12;i++){ if(i===6||i===0) continue; const a=Math.PI/2-i/12*Math.PI*2; x.fillText(RN[i],cx+Math.cos(a)*0.043*s,cx-Math.sin(a)*0.043*s); }
      x.fillText('XII',cx,cx-0.043*s); const sy=cx+0.024*s; K.ring(x,cx,sy,0.013*s,1.4); K.scale(x,cx,sy,0.0105*s,0.013*s,60,{ long:i=>i%10===0 }); x.font='18px serif'; [0,10,20,30,40,50].forEach((n,i)=>{ const a=Math.PI/2-i/6*Math.PI*2; x.fillText(String(n),cx+Math.cos(a)*0.0085*s,sy-Math.sin(a)*0.0085*s); });
      const py=cx-0.022*s; x.lineWidth=1.4; x.beginPath(); x.arc(cx,py,0.011*s,Math.PI*1.2,Math.PI*1.8); x.stroke(); x.font='16px serif'; x.fillText('UP',cx-0.009*s,py-0.004*s); x.fillText('DOWN',cx+0.01*s,py-0.004*s);
      x.font='italic 24px serif'; x.fillText('Marine Chronometer',cx,cx-0.008*s); x.font='18px serif'; x.fillText('No. 1759',cx,cx+0.006*s); });
    mesh(new THREE.CircleGeometry(RD,96).rotateX(-Math.PI/2),M({ map:dt, rough:0.35, metal:0.2, env:0.9, clean:true }),[0,DY,0]);
    const hand=(len,w,tail,y,parent)=>{ const s=new THREE.Shape(); s.moveTo(-w*0.35,-tail); s.lineTo(w*0.35,-tail); s.lineTo(w/2,0); s.lineTo(w*0.3,len*0.75); s.lineTo(w*0.9,len*0.8); s.lineTo(0,len); s.lineTo(-w*0.9,len*0.8); s.lineTo(-w*0.3,len*0.75); s.lineTo(-w/2,0); s.closePath();
      const g=new THREE.Group(); g.position.y=y; (parent||c.root).add(g); K.ext(c,s,0.0006,blue,null,[-Math.PI/2,0,0],g); return g; };
    const hH=hand(0.03,0.004,0.006,DY+0.0015), mH=hand(0.046,0.0028,0.008,DY+0.0024); const sg=new THREE.Group(); sg.position.z=0.024; c.root.add(sg); const sH=hand(0.011,0.0012,0.003,DY+0.0012,sg);
    const pg=new THREE.Group(); pg.position.z=-0.022; c.root.add(pg); hand(0.009,0.0012,0.002,DY+0.0012,pg).rotation.y=-0.3;
    mesh(new THREE.CylinderGeometry(0.0022,0.0022,0.004,16),br,[0,DY+0.003,0]);
    lbl(P[0][0],[-0.04,DY+0.02,-0.03]); lbl(P[1][0],[0,DY+0.015,0.04]); lbl(P[2][0],[0.02,DY+0.015,-0.035]); lbl(P[3][0],[0.075,DY,0.03]); lbl(P[4][0],[0.08,0.06,B/2]);
    anim(()=>{ const d=new Date(), s=d.getSeconds()+Math.floor(d.getMilliseconds()/500)/2, m=d.getMinutes()+s/60, h=(d.getHours()%12)+m/60;
      hH.rotation.y=-h/12*Math.PI*2; mH.rotation.y=-m/60*Math.PI*2; sH.rotation.y=-s/60*Math.PI*2; });
    return { cam:[0.2,0.4,0.3], tgt:[0,0.12,0], maxDist:2, minDist:0.06, near:0.004 }; } });

/* ---------------- Spektroskop ---------------- */
IM.push({ id:'spectroscope', use:['light'], icon:'🌈', yearN:1859,
  name:t3('Prizmali spektroskop','Призменный спектроскоп','Prism spectroscope'), year:t3('1859-yil','1859 г.','1859'),
  who:t3('Gustav Kirxgof va Robert Bunzen (Geydelberg)','Густав Кирхгоф и Роберт Бунзен (Гейдельберг)','Gustav Kirchhoff and Robert Bunsen (Heidelberg)'),
  size:t3('Stol Ø 18 sm, trubalar ~20 sm','Столик Ø 18 см, трубы ~20 см','Table Ø 18 cm, tubes ~20 cm'),
  short:t3('Yorug‘likni ranglarga ajratib, moddaning kimyoviy tarkibini aniqlaydi','Разлагает свет на цвета и определяет химический состав вещества','Splits light into colours to reveal chemical make-up'),
  about:t3('Har bir kimyoviy element qizdirilganda faqat o‘ziga xos ranglarda — spektral chiziqlarda nur chiqaradi. Kirxgof va Bunzen alangadagi moddalarning chiziqlarini Quyosh spektridagi qora (Fraungofer) chiziqlar bilan solishtirib, Quyoshda natriy, temir va boshqa elementlar borligini isbotladi. Shu tariqa astrofizika — yulduzlar tarkibini o‘rganuvchi fan tug‘ildi.',
    'Каждый химический элемент, нагретый, излучает только свои цвета — спектральные линии. Кирхгоф и Бунзен сравнили линии веществ в пламени с тёмными (фраунгоферовыми) линиями в спектре Солнца и доказали, что на Солнце есть натрий, железо и другие элементы. Так родилась астрофизика — наука о составе звёзд.',
    'Every chemical element, when heated, glows only in its own colours — spectral lines. Kirchhoff and Bunsen compared the lines of substances in a flame with the dark (Fraunhofer) lines in sunlight and proved the Sun contains sodium, iron and more. That was the birth of astrophysics — the study of what stars are made of.'),
  tasks:[t3('Yorug‘likni spektrga ajratish','Разлагать свет в спектр','Split light into a spectrum'),
    t3('Moddalar va yulduzlarning kimyoviy tarkibini aniqlash','Определять химический состав веществ и звёзд','Find the chemical make-up of substances and stars'),
    t3('Yangi elementlarni kashf etish (seziy, rubidiy, geliy)','Открывать новые элементы (цезий, рубидий, гелий)','Discover new elements (caesium, rubidium, helium)')],
  how:[t3('Bunzen gorelkasi alangasiga modda kiritiladi; alanga yorug‘ligi kollimatorning ingichka tirqishiga tushadi.','В пламя горелки Бунзена вносят вещество; свет пламени падает на узкую щель коллиматора.','A substance is put in the Bunsen flame; its light falls on the collimator’s narrow slit.'),
    t3('Kollimator linzasi tirqishdan chiqqan nurlarni parallel dastaga aylantiradi.','Линза коллиматора делает лучи из щели параллельными.','The collimator lens makes the light from the slit a parallel beam.'),
    t3('Shisha prizma turli ranglarni turlicha sindiradi: binafsha ko‘proq, qizil kamroq — rangli yelpig‘ich hosil bo‘ladi.','Стеклянная призма преломляет цвета по-разному: фиолетовый сильнее, красный слабее — получается веер цветов.','The glass prism bends colours differently — violet most, red least — fanning them out.'),
    t3('Ko‘rish trubasida yorqin chiziqlar ko‘rinadi; uchinchi truba ularning o‘rnini o‘lchash uchun shkala tasvirini qo‘shadi. «Ishlatib ko‘rish» spektrni ko‘rsatadi.','В зрительной трубе видны яркие линии; третья труба добавляет изображение шкалы для их измерения. «Показать в работе» показывает спектр.','The viewing telescope shows bright lines; the third tube overlays a scale to measure them. “See it work” shows the spectrum.')],
  parts:[[t3('Kollimator (tirqish)','Коллиматор (щель)','Collimator (slit)'),t3('Ingichka tirqish va linza — parallel nur dastasi.','Узкая щель и линза — параллельный пучок.','Narrow slit and lens — a parallel beam.')],
    [t3('Prizma (qopqoq ostida)','Призма (под крышкой)','Prism (under the cover)'),t3('60° li shisha prizma; qopqoq begona nurni to‘sadi.','Стеклянная призма 60°; крышка задерживает посторонний свет.','60° glass prism; the cover blocks stray light.')],
    [t3('Ko‘rish trubasi','Зрительная труба','Viewing telescope'),t3('Spektral chiziqlarni kattalashtirib ko‘rsatadi.','Показывает спектральные линии увеличенными.','Shows the lines magnified.')],
    [t3('Shkala trubasi','Шкальная труба','Scale tube'),t3('Chiziqlar o‘rnini o‘lchash uchun yoritilgan shkala.','Подсвеченная шкала для измерения положения линий.','Lit scale for measuring line positions.')],
    [t3('Bunzen gorelkasi','Горелка Бунзена','Bunsen burner'),t3('Rangsiz, juda issiq alanga — begona rang qo‘shmaydi.','Бесцветное очень горячее пламя — не добавляет своих цветов.','Colourless, very hot flame adding no colours of its own.')],
    [t3('Spektr','Спектр','Spectrum'),t3('Natriyning sariq D chiziqlari — 589 nm.','Жёлтые D-линии натрия — 589 нм.','Sodium’s yellow D lines — 589 nm.')]],
  facts:[t3('1860–61-yillarda Kirxgof va Bunzen spektroskop yordamida ikki yangi element — seziy va rubidiyni kashf etdi.','В 1860–61 гг. Кирхгоф и Бунзен открыли спектроскопом два новых элемента — цезий и рубидий.','In 1860–61 Kirchhoff and Bunsen used the spectroscope to discover caesium and rubidium.'),
    t3('Geliy 1868-yilda Yerda emas, Quyosh spektrida topilgan — nomi yunoncha «helios» (Quyosh) so‘zidan.','Гелий открыт в 1868 г. не на Земле, а в спектре Солнца — от греческого «гелиос».','Helium was found in 1868 in the Sun’s spectrum, not on Earth — named from Greek “helios”.')],
  env:{ sky:'studio', shadow:0.7, size:4, floor:'stone' },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, TY=0.36, BY=0.395;
    const iron=M({ map:c.X.metal('#2b2b2e'), metal:0.6, rough:0.55, env:0.8 }), br=K.brass(c), blk=M({ map:c.X.metal('#1a1a1c'), metal:0.4, rough:0.6, clip:true, side:THREE.DoubleSide });
    for(let i=0;i<3;i++){ const a=i/3*Math.PI*2; K.bar(c,[0,0.08,0],[Math.cos(a)*0.17,0.005,Math.sin(a)*0.17],0.01,iron); mesh(new THREE.SphereGeometry(0.014,12,8),iron,[Math.cos(a)*0.17,0.008,Math.sin(a)*0.17]); }
    K.lathe(c,[[0,0.06],[0.03,0.06],[0.02,0.1],[0.016,TY-0.03],[0.03,TY-0.01],[0,TY-0.01]],iron);
    const tt=K.plate(c,1024,'#c09a58',(x,w)=>{ const cx=w/2, s=w/0.2; K.ring(x,cx,cx,0.095*s,2); K.scale(x,cx,cx,0.085*s,0.095*s,360,{ long:i=>i%10===0, mid:i=>i%5===0 }); });
    mesh(new THREE.CylinderGeometry(0.1,0.1,0.012,96),br,[0,TY,0]); mesh(new THREE.CircleGeometry(0.1,96).rotateX(-Math.PI/2),M({ map:tt, metal:0.9, rough:0.32, env:1.2, bump:0.03 }),[0,TY+0.0062,0]);
    const pr=new THREE.Shape(); for(let i=0;i<3;i++){ const a=i/3*Math.PI*2+Math.PI/2; pr[i?'lineTo':'moveTo'](Math.cos(a)*0.028,Math.sin(a)*0.028); } pr.closePath();
    K.ext(c,pr,0.045,K.glass(c,{ opacity:0.4, color:0xe6f2ff }),[0,TY+0.007,0],[-Math.PI/2,0,0.2]);
    const cov=K.lathe(c,[[0.05,TY+0.006],[0.05,TY+0.075],[0.0,TY+0.078]],blk); cov.material=blk;
    const tube=(ang,len,lbl2)=>{ const g=new THREE.Group(); g.position.y=BY; g.rotation.y=ang; c.root.add(g);
      mesh(new THREE.CylinderGeometry(0.014,0.014,len,32),br,[0.06+len/2,0,0],[0,0,Math.PI/2],g); K.bar(c,[0.07,-0.03,0],[0.07,0,0],0.004,br,g); mesh(new THREE.BoxGeometry(0.02,0.006,0.012),br,[0.07,-0.03,0],null,g); return g; };
    const col=tube(0,0.2), tel=tube(-2.35,0.22), scl=tube(2.0,0.17);
    mesh(new THREE.BoxGeometry(0.006,0.024,0.024),br,[0.263,0,0],null,col); mesh(new THREE.BoxGeometry(0.007,0.016,0.0012),M({ clean:true, color:0x050505 }),[0.264,0,0],null,col);
    mesh(new THREE.CylinderGeometry(0.009,0.011,0.03,24),M({ map:c.X.metal('#1a1a1a'), metal:0.5, rough:0.5 }),[0.3,0,0],[0,0,Math.PI/2],tel);
    mesh(new THREE.BoxGeometry(0.004,0.022,0.022),M({ clean:true, color:0xfff2d0, emissive:0xffd890, ei:0.5 }),[0.232,0,0],null,scl);
    // Bunzen gorelkasi
    const bx=0.33; K.lathe(c,[[0,0],[0.035,0],[0.03,0.012],[0.008,0.02],[0.007,BY-0.035],[0,BY-0.035]],br,[bx,0,0]);
    const fl=mesh(new THREE.ConeGeometry(0.009,0.06,24,1,true),M({ clean:true, color:0xffc040, emissive:0xffb020, ei:2.2, transparent:true, opacity:0.75, side:THREE.DoubleSide }),[bx,BY+0.0,0],null,null,true);
    const fl2=mesh(new THREE.ConeGeometry(0.005,0.025,20,1,true),M({ clean:true, color:0x6ab4ff, emissive:0x3d8bff, ei:2, transparent:true, opacity:0.7 }),[bx,BY-0.022,0],null,null,true);
    const lt=new THREE.PointLight(0xffc060,0.5,0.6,2); lt.position.set(bx,BY,0); c.root.add(lt);
    // spektr yelpig'ichi
    const sp=new THREE.Group(); sp.position.y=BY; c.root.add(sp); sp.visible=false;
    ['#ff2a1a','#ff8a00','#ffd600','#3ccf3c','#20a6ff','#3a3dff','#9a3cff'].forEach((h,k)=>{ const a=-2.35-0.09+k*0.03, m=c.M({ clean:true, color:h, emissive:h, ei:1.6, transparent:true, opacity:0.85 });
      K.bar(c,[0,0,0],[Math.cos(a)*0.34,0,-Math.sin(a)*0.34],0.0014,m,sp,6); });
    K.bar(c,[bx,0,0],[0.02,0,0],0.0016,c.M({ clean:true, color:0xfff3c0, emissive:0xfff0b0, ei:1.4, transparent:true, opacity:0.8 }),sp,6);
    lbl(P[0][0],[0.25,BY+0.04,0]); lbl(P[1][0],[0,TY+0.11,0]); const tp=(g,r)=>[Math.cos(-g)*r,BY+0.04,Math.sin(-g)*r];
    lbl(P[2][0],tp(-2.35,0.26)); lbl(P[3][0],tp(2.0,0.22)); lbl(P[4][0],[bx,0.15,0.04]); lbl(P[5][0],tp(-2.3,0.36));
    anim((t)=>{ const f=1+0.08*Math.sin(t*23)+0.05*Math.sin(t*37); fl.scale.set(1,f,1); fl2.scale.set(1,2-f,1); lt.intensity=0.45*f; sp.visible=c.play(); });
    return { cam:[0.55,0.72,0.72], tgt:[0.05,0.36,0], maxDist:3, minDist:0.1, near:0.005, cutAt:TY+0.04, cutN:[0,-1,0] }; } });

/* ---------------- Dobson teleskopi ---------------- */
IM.push({ id:'dobson', use:['observe'], icon:'🌌', yearN:1965,
  name:t3('Dobson teleskopi','Телескоп Добсона','Dobsonian telescope'), year:t3('1960-yillar','1960-е','1960s'),
  who:t3('Jon Dobson (San-Fransisko, «Trotuar astronomlari»)','Джон Добсон (Сан-Франциско, «Тротуарные астрономы»)','John Dobson (San Francisco Sidewalk Astronomers)'),
  size:t3('Ko‘zgu Ø 25 sm, truba 1,25 m','Зеркало Ø 25 см, труба 1,25 м','25 cm mirror, 1.25 m tube'),
  short:t3('Arzon va oddiy, lekin katta ko‘zguli havaskorlar teleskopi','Недорогой и простой, но крупнозеркальный любительский телескоп','A cheap, simple, big-mirror telescope for amateurs'),
  about:t3('Dobson teleskopi — Nyuton reflektori, lekin oddiy faner qutiga (rocker box) o‘rnatilgan alt-azimut montirovkada. Jon Dobson uni hamma uchun arzon teleskop sifatida o‘ylab topdi va ko‘chalarda odamlarga osmonni bepul ko‘rsatgan. Katta ko‘zgu xira tumanliklar va galaktikalarni ko‘rish imkonini beradi, buning uchun qimmat montirovka kerak emas.',
    'Телескоп Добсона — рефлектор Ньютона на простой фанерной альт-азимутальной монтировке (rocker box). Джон Добсон придумал его как доступный для всех телескоп и бесплатно показывал небо прохожим на улицах. Большое зеркало позволяет видеть слабые туманности и галактики без дорогой монтировки.',
    'A Dobsonian is a Newtonian reflector on a simple plywood alt-azimuth “rocker box” mount. John Dobson designed it as a telescope anyone could afford and showed passers-by the sky for free on city pavements. Its big mirror reaches faint nebulae and galaxies without an expensive mount.'),
  tasks:[t3('Xira tumanlik, yulduz to‘dalari va galaktikalarni kuzatish','Наблюдать слабые туманности, скопления и галактики','Observe faint nebulae, clusters and galaxies'),
    t3('Oy va sayyoralarni ko‘rish','Рассматривать Луну и планеты','View the Moon and planets'),
    t3('Ommaviy astronomiya va ta’lim','Массовая астрономия и просвещение','Public outreach and teaching')],
  how:[t3('Yorug‘lik trubaga kirib, tubdagi parabolik ko‘zguga tushadi va yuqoriga qaytariladi.','Свет входит в трубу, падает на параболическое зеркало внизу и отражается вверх.','Light goes down the tube to the parabolic mirror and is reflected back up.'),
    t3('Yuqorida 45° li kichik ko‘zgu nurni yon tomondagi fokuserga buradi.','Наверху маленькое зеркало под 45° отводит свет в боковой фокусёр.','A small 45° mirror at the top turns it into the side focuser.'),
    t3('Truba yon tomondagi yarim doira podshipniklarda balandlik bo‘yicha, quti esa asosda aylanib azimut bo‘yicha buriladi — teflon ishqalanishi silliq harakat beradi.','Труба качается по высоте на боковых полукруглых опорах, а ящик вращается по азимуту — тефлон даёт плавность.','The tube tilts in altitude on side bearings and the box turns in azimuth — Teflon pads make it smooth.'),
    t3('«Ichini ko‘rish» ko‘zgularni, «Ishlatib ko‘rish» harakatni ko‘rsatadi.','«Разрез» показывает зеркала, «Показать в работе» — движение.','“Cutaway” shows the mirrors; “See it work” shows the motion.')],
  parts:[[t3('Asosiy ko‘zgu','Главное зеркало','Primary mirror'),t3('Parabolik, Ø 25 sm.','Параболическое, Ø 25 см.','Parabolic, 25 cm across.')],
    [t3('Diagonal ko‘zgu','Диагональное зеркало','Secondary mirror'),t3('To‘rt tayanchli «o‘rgimchak»da.','На четырёхлучевой «растяжке».','On a four-vane spider.')],
    [t3('Fokuser va okulyar','Фокусёр и окуляр','Focuser and eyepiece'),t3('Truba yuqorisida, yon tomonda.','Сбоку вверху трубы.','On the side near the top.')],
    [t3('Rocker quti','Rocker box','Rocker box'),t3('Faner quti — alt-azimut montirovka.','Фанерный ящик — альт-азимутальная монтировка.','Plywood alt-azimuth mount.')],
    [t3('Izlovchi durbin','Искатель','Finder scope'),t3('Kichik kattalashtirish, keng maydon — nishonni topish uchun.','Малое увеличение, широкое поле — для наведения.','Low power, wide field for aiming.')]],
  facts:[t3('Dobson birinchi ko‘zgularini eski kema illyuminatorlari shishasidan silliqlagan.','Первые зеркала Добсон шлифовал из стекла старых корабельных иллюминаторов.','Dobson ground his first mirrors from old ship porthole glass.'),
    t3('Bugun dunyodagi havaskor teleskoplarning juda katta qismi Dobson montirovkasida.','Сегодня огромная доля любительских телескопов в мире — на монтировке Добсона.','Today a large share of amateur telescopes use a Dobsonian mount.')],
  env:{ sky:'dusk', sunAz:285, sunAlt:4, ground:'grass', size:160, shadow:3, nb:0.006, hemiGround:0x3a4a2a },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, PY=0.58, R=0.135;
    const ply=K.wood(c,'#b48a5a',{ clip:true }), dark=M({ map:c.X.metal('#141414'), metal:0.3, rough:0.6, clip:true }), white=M({ color:0xf1f1ee, rough:0.45, metal:0.1, env:0.9, clip:true, side:THREE.DoubleSide }), mir=K.steel(c,{ map:c.X.metal('#e8ecf0'), rough:0.03, env:2.2, side:THREE.DoubleSide });
    mesh(new THREE.CircleGeometry(2.6,64).rotateX(-Math.PI/2),M({ map:c.X.blocks('#8d877b','rgba(40,36,30,.6)',[5,5],4,4), rough:0.9, bump:0.4 }),[0,0.004,0]); mesh(new THREE.CylinderGeometry(0.32,0.32,0.025,48),ply,[0,0.035,0]); for(let i=0;i<3;i++){ const a=i/3*Math.PI*2; mesh(new THREE.BoxGeometry(0.06,0.025,0.06),ply,[Math.cos(a)*0.26,0.012,Math.sin(a)*0.26]); }
    const az=new THREE.Group(); az.position.y=0.05; c.root.add(az);
    mesh(new THREE.BoxGeometry(0.46,0.025,0.46),ply,[0,0.0125,0],null,az);
    [-1,1].forEach(s=>{ const sh=new THREE.Shape(); sh.moveTo(-0.23,0); sh.lineTo(0.23,0); sh.lineTo(0.23,PY-0.05); sh.lineTo(0.17,PY-0.05); sh.absarc(0,PY-0.05,0.17,0,Math.PI,true); sh.lineTo(-0.23,PY-0.05); sh.closePath();
      K.ext(c,sh,0.025,ply,[s*0.2+(s>0?0:-0.025),0.025,0],[0,Math.PI/2,0],az).position.x=s>0?0.2:-0.225; });
    mesh(new THREE.BoxGeometry(0.4,0.3,0.025),ply,[0,0.175,0.22],null,az);
    const alt=new THREE.Group(); alt.position.y=PY; az.add(alt); const tube=new THREE.Group(); alt.add(tube);
    mesh(new THREE.CylinderGeometry(R,R,1.25,64,1,true),white,[0,0.22,0],null,tube);
    [-1,1].forEach(s=>mesh(new THREE.CylinderGeometry(0.17,0.17,0.025,64),dark,[s*0.155,0,0],[0,0,Math.PI/2],tube));
    mesh(new THREE.CylinderGeometry(R+0.006,R+0.006,0.05,64,1,true),dark,[0,-0.385,0],null,tube); mesh(new THREE.CylinderGeometry(R,R,0.01,64),dark,[0,-0.405,0],null,tube);
    mesh(new THREE.CylinderGeometry(0.125,0.125,0.025,64),M({ clean:true, color:0x2a2a2c, rough:0.6 }),[0,-0.388,0],null,tube);
    mesh(new THREE.SphereGeometry(1.2,64,8,0,Math.PI*2,Math.PI-0.105,0.105),mir,[0,0.825,0],null,tube);
    mesh(new THREE.CylinderGeometry(R+0.006,R+0.006,0.06,64,1,true),dark,[0,0.82,0],null,tube);
    for(let i=0;i<4;i++){ const a=i/4*Math.PI*2; mesh(new THREE.BoxGeometry(R,0.03,0.0015),dark,[Math.cos(a)*R/2,0.76,Math.sin(a)*R/2],[0,-a,0],tube); }
    const sec=mesh(new THREE.CylinderGeometry(0.03,0.03,0.006,32),mir,[0,0.76,0],[0,0,Math.PI/4],tube);
    mesh(new THREE.CylinderGeometry(0.025,0.025,0.07,24),dark,[R+0.03,0.76,0],[0,0,Math.PI/2],tube); mesh(new THREE.CylinderGeometry(0.016,0.016,0.05,24),M({ map:c.X.metal('#2a2a2a'), metal:0.6, rough:0.4 }),[R+0.08,0.76,0],[0,0,Math.PI/2],tube);
    mesh(new THREE.CylinderGeometry(0.022,0.022,0.25,24),dark,[0,0.7,-R-0.04],null,tube); K.bar(c,[0,0.65,-R],[0,0.65,-R-0.03],0.006,dark,tube); K.bar(c,[0,0.75,-R],[0,0.75,-R-0.03],0.006,dark,tube);
    const v=new THREE.Vector3(), lab=(k,o,par)=>{ const l=K.lblRef(c,P[k][0],[0,0,0]); return ()=>{ par.localToWorld(v.set(o[0],o[1],o[2])); l.p.copy(v); }; };
    const ups=[lab(0,[0,-0.36,0.0],tube),lab(1,[0,0.82,0],tube),lab(2,[R+0.1,0.8,0],tube),lab(4,[0,0.85,-R-0.04],tube)]; lbl(P[3][0],[0.25,0.35,0.2]);
    let ph=0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.4; alt.rotation.x=-0.75+0.35*Math.sin(ph); az.rotation.y=0.5+0.6*Math.sin(ph*0.6); ups.forEach(f=>f()); });
    return { cam:[2.0,1.4,2.1], tgt:[0,0.65,0], maxDist:12, minDist:0.3, near:0.01, cutAt:0, cutN:[-1,0,0] }; } });

/* ---------------- Radio-teleskop (Reber) ---------------- */
IM.push({ id:'radio', use:['light','observe'], icon:'📡', yearN:1937,
  name:t3('Radio-teleskop (Grout Reber)','Радиотелескоп (Грот Ребер)','Radio telescope (Grote Reber)'), year:t3('1937-yil','1937 г.','1937'),
  who:t3('Grout Reber (Uiton, AQSh); kosmik radio to‘lqinlar — Karl Yanskiy (1932)','Грот Ребер (Уитон, США); космическое радиоизлучение — Карл Янский (1932)','Grote Reber (Wheaton, USA); cosmic radio waves found by Karl Jansky (1932)'),
  size:t3('Ko‘zgu Ø 9,5 m, fokus 6 m','Зеркало Ø 9,5 м, фокус 6 м','9.5 m dish, 6 m focal length'),
  short:t3('Ko‘zga ko‘rinmas radio to‘lqinlarda osmonni «tinglaydi»','«Слушает» небо в невидимых радиоволнах','“Listens” to the sky in invisible radio waves'),
  about:t3('Radioastronomiya Karl Yanskiy 1932-yilda Somon yo‘li markazidan kelayotgan radio shovqinni topgandan keyin boshlandi. Radio muhandis Grout Reber 1937-yilda o‘z hovlisida dunyodagi birinchi parabolik radio-teleskopni qurdi va osmonning ilk radio xaritasini tuzdi. Bugungi ALMA, FAST kabi ulkan radio-teleskoplar xuddi shu tamoyil asosida ishlaydi.',
    'Радиоастрономия началась, когда Карл Янский в 1932 г. обнаружил радиошум из центра Млечного Пути. Радиоинженер Грот Ребер в 1937 г. построил во дворе своего дома первый в мире параболический радиотелескоп и составил первую радиокарту неба. Современные гиганты — ALMA, FAST — работают по тому же принципу.',
    'Radio astronomy began when Karl Jansky detected radio noise from the centre of the Milky Way in 1932. In 1937 radio engineer Grote Reber built the world’s first parabolic radio telescope in his back garden and made the first radio map of the sky. Today’s giants such as ALMA and FAST work on the same principle.'),
  tasks:[t3('Kosmik radio nurlanishni qabul qilish','Принимать космическое радиоизлучение','Receive cosmic radio emission'),
    t3('Changdan o‘tib ko‘rinmaydigan hududlarni — Galaktika markazini o‘rganish','Изучать скрытые пылью области — центр Галактики','Study dust-hidden regions such as the Galactic centre'),
    t3('Pulsarlar, kvazarlar va sovuq gazni kuzatish','Наблюдать пульсары, квазары и холодный газ','Observe pulsars, quasars and cold gas')],
  how:[t3('Parabolik ko‘zgu radio to‘lqinlarni yig‘ib, fokusdagi qabul qilgichga jamlaydi — xuddi optik ko‘zgu kabi.','Параболическое зеркало собирает радиоволны в приёмнике в фокусе — как оптическое зеркало.','The parabolic dish gathers radio waves onto a receiver at the focus — like an optical mirror.'),
    t3('Qabul qilgich juda zaif signalni kuchaytirib, uning kuchini yozib boradi.','Приёмник усиливает очень слабый сигнал и записывает его мощность.','The receiver amplifies the very weak signal and records its strength.'),
    t3('Reber ko‘zgusi faqat balandlik bo‘yicha burilgan: Yer aylangani sari osmonning yangi qismlari meridian orqali o‘tadi.','Зеркало Ребера поворачивалось только по высоте: при вращении Земли через меридиан проходили новые участки неба.','Reber’s dish turned only in elevation; Earth’s rotation swept new sky through the meridian.'),
    t3('Ko‘plab o‘lchovlardan osmonning radio yorqinligi xaritasi tuziladi. «Ishlatib ko‘rish» ko‘zguni buradi.','Из многих измерений строят карту радиояркости неба. «Показать в работе» поворачивает зеркало.','Many scans build a map of radio brightness. “See it work” tilts the dish.')],
  parts:[[t3('Parabolik ko‘zgu','Параболическое зеркало','Parabolic dish'),t3('Galvanizlangan temir listlar, Ø 9,5 m.','Оцинкованные листы, Ø 9,5 м.','Galvanised iron sheets, 9.5 m across.')],
    [t3('Qabul qilgich (fokusda)','Приёмник (в фокусе)','Receiver (at focus)'),t3('Ko‘zgudan 6 m balandda, tayoqlarda.','В 6 м над зеркалом, на опорах.','6 m above the dish on struts.')],
    [t3('Yog‘och minoralar','Деревянные башни','Wooden towers'),t3('Ko‘zguni balandlik o‘qida ushlab turadi.','Держат зеркало на оси высоты.','Hold the dish on its elevation axis.')],
    [t3('Balandlik o‘qi','Ось высоты','Elevation axis'),t3('Faqat shimol–janub bo‘yicha burilish.','Поворот только по направлению север–юг.','Tilts north–south only.')]],
  facts:[t3('Reber 1944-yilda osmonning birinchi radio xaritasini e’lon qilgan.','Ребер опубликовал первую радиокарту неба в 1944 г.','Reber published the first radio map of the sky in 1944.'),
    t3('Uning teleskopi hozir AQShdagi Grin-Benk radio rasadxonasida saqlanadi.','Его телескоп сейчас хранится в радиообсерватории Грин-Бэнк (США).','His telescope now stands at the Green Bank Observatory, USA.'),
    t3('Radio to‘lqinlar bulut va kunduz yorug‘ligidan o‘tadi — radio-teleskoplar kecha-kunduz ishlay oladi.','Радиоволны проходят сквозь облака и дневной свет — радиотелескопы работают круглосуточно.','Radio waves pass through clouds and daylight — radio telescopes work day and night.')],
  env:{ sky:'day', sunAz:200, sunAlt:42, ground:'grass', size:400, shadow:16, hemiGround:0x3a4a2a },
  feat:{ play:true },
  build(c){ const {THREE,M,X,mesh,lbl,anim}=c, P=this.parts, AY=5.2, R=4.75, DEP=R*R/(4*6);
    const wd=K.wood(c,'#8a6a48'), wd2=K.wood(c,'#6f5236');
    const tilt=new THREE.Group(); tilt.position.y=AY; c.root.add(tilt); const dg=new THREE.Group(); dg.position.y=-0.55; tilt.add(dg);
    dg.add(c.dish({ D:9.5, depth:DEP, color:0xb9bec4 }));
    for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; let prev=null; for(let k=0;k<=6;k++){ const r=k/6*R, p=[Math.cos(a)*r,r*r/(R*R)*DEP-0.12,Math.sin(a)*r]; if(prev) K.bar(c,prev,p,0.06,wd,dg,6); prev=p; } }
    mesh(new THREE.TorusGeometry(R,0.07,6,64),wd,[0,DEP,0],[Math.PI/2,0,0],dg);
    mesh(new THREE.CylinderGeometry(0.35,0.35,0.6,20),M({ map:c.X.metal('#8f9499'), metal:0.6, rough:0.5 }),[0,6+0.3,0],null,dg);
    [-1,1].forEach(s=>{ const x=s*5.3; K.bar(c,[x,0,-2.6],[x,AY,0],0.12,wd2,null,8); K.bar(c,[x,0,2.6],[x,AY,0],0.12,wd2,null,8); K.bar(c,[x,0,0],[x,AY,0],0.1,wd2,null,8);
      [1.6,3.2].forEach(h=>K.bar(c,[x,h,-2.6*(1-h/AY)],[x,h,2.6*(1-h/AY)],0.07,wd2,null,6)); K.bar(c,[x,AY,0],[s*R,AY,0],0.08,M({ map:c.X.metal('#6a6e72'), metal:0.7, rough:0.5 }),null,10); });
    // Reber uyi va daraxtlar
    const hs=new THREE.Group(); hs.position.set(-16,0,-10); c.root.add(hs); mesh(new THREE.BoxGeometry(9,4.5,7),M({ map:X.noise('#e8e2d4',0.06,[3,2]), rough:0.85 }),[0,2.25,0],null,hs);
    const roof=new THREE.CylinderGeometry(0.01,5.2,2.6,4,1); roof.rotateY(Math.PI/4); const rm=mesh(roof,M({ map:X.noise('#5a4038',0.2,[3,3]), rough:0.9 }),[0,5.8,0],null,hs); rm.scale.set(1.25,1,1);
    [[-24,4],[18,-14],[22,10],[-8,18],[12,22],[-26,-20]].forEach(([x,z],k)=>c.tree(k%2?'leaf':'pine',x,0,z,1.3));
    lbl(P[0][0],[3,AY+1.6,3]); lbl(P[1][0],[0,AY+6.6,0]); lbl(P[2][0],[5.3,3,2]); lbl(P[3][0],[-5.3,AY+0.6,0]);
    let ph=0; anim((t,dt)=>{ if(c.play()) ph+=dt*0.35; tilt.rotation.x=-0.6+0.45*Math.sin(ph); });
    return { cam:[17,9,16], tgt:[0,4,0], maxDist:90, minDist:4 }; } });

/* ---------------- CCD kamera ---------------- */
IM.push({ id:'ccd', use:['light','observe'], icon:'📷', yearN:1976,
  name:t3('CCD kamera','ПЗС-камера (CCD)','CCD camera'), year:t3('1969 (ixtiro), 1976 (astronomiyada)','1969 (изобретение), 1976 (в астрономии)','1969 (invented), 1976 (in astronomy)'),
  who:t3('Uillard Boyl va Jorj Smit (Bell Labs) — 2009-yil Nobel mukofoti','Уиллард Бойл и Джордж Смит (Bell Labs) — Нобелевская премия 2009 г.','Willard Boyle and George Smith (Bell Labs) — 2009 Nobel Prize'),
  size:t3('Korpus Ø 15 sm, sensor ~36 mm','Корпус Ø 15 см, сенсор ~36 мм','Body Ø 15 cm, sensor ~36 mm'),
  short:t3('Yorug‘likni raqamli tasvirga aylantiruvchi sovutilgan sensor','Охлаждаемый сенсор, превращающий свет в цифровое изображение','A cooled sensor that turns light into a digital image'),
  about:t3('CCD (zaryad bog‘langan qurilma) — millionlab piksellardan iborat kremniy sensor. Har bir pikselga tushgan foton elektron hosil qiladi, ekspozitsiya oxirida zaryadlar navbatma-navbat surilib o‘qiladi. Fotoplastinka yorug‘likning bir necha foizini qayd etgan bo‘lsa, CCD 90% gacha qayd etadi — teleskoplar amalda o‘nlab marta «kattalashgandek» bo‘ldi. Shovqinni kamaytirish uchun sensor kuchli sovutiladi.',
    'ПЗС (прибор с зарядовой связью) — кремниевый сенсор из миллионов пикселей. Каждый фотон, попавший в пиксель, рождает электрон, а в конце экспозиции заряды по очереди сдвигаются и считываются. Фотопластинка регистрировала лишь несколько процентов света, ПЗС — до 90%: телескопы будто стали в десятки раз больше. Для снижения шума сенсор сильно охлаждают.',
    'A CCD (charge-coupled device) is a silicon sensor of millions of pixels. Each photon striking a pixel frees an electron; at the end of the exposure the charges are shifted along and read out one by one. Photographic plates recorded a few per cent of the light; CCDs record up to 90% — as if telescopes had grown tens of times larger. The sensor is cooled hard to cut noise.'),
  tasks:[t3('Osmon jismlarining raqamli tasvirini olish','Получать цифровые изображения небесных объектов','Take digital images of the sky'),
    t3('Yorqinlikni aniq o‘lchash (fotometriya)','Точно измерять яркость (фотометрия)','Measure brightness precisely (photometry)'),
    t3('Spektrlarni yozib olish, ekzosayyora tranzitlarini qayd etish','Записывать спектры, регистрировать транзиты экзопланет','Record spectra and exoplanet transits')],
  how:[t3('Teleskop tasviri oyna orqali sensor yuzasiga tushadi.','Изображение телескопа через окно падает на сенсор.','The telescope image falls through the window onto the sensor.'),
    t3('Fotonlar piksellarda elektronlar hosil qiladi; ekspozitsiya davomida zaryad yig‘iladi.','Фотоны рождают в пикселях электроны; за экспозицию заряд накапливается.','Photons free electrons in the pixels; charge builds up during the exposure.'),
    t3('Keyin zaryadlar qator-qator chetga «surilib», kuchaytirgich orqali raqamga aylantiriladi.','Затем заряды построчно «сдвигаются» к краю и через усилитель превращаются в числа.','The charges are then shifted row by row to the edge and turned into numbers by an amplifier.'),
    t3('Peltier sovutgich sensorni −30…−100 °C gacha sovitadi — issiqlik shovqini keskin kamayadi. «Ishlatib ko‘rish» ekspozitsiyani ko‘rsatadi.','Элемент Пельтье охлаждает сенсор до −30…−100 °C — тепловой шум резко падает. «Показать в работе» показывает экспозицию.','A Peltier cooler chills the sensor to −30…−100 °C, slashing thermal noise. “See it work” shows an exposure.')],
  parts:[[t3('CCD sensor','ПЗС-сенсор','CCD sensor'),t3('Millionlab piksel; keramik korpus, oltin kontaktlar.','Миллионы пикселей; керамический корпус, золотые контакты.','Millions of pixels; ceramic package, gold contacts.')],
    [t3('Peltier sovutgich','Элемент Пельтье','Peltier cooler'),t3('Tok bilan bir tomonini sovitib, issiqlikni radiatorga uzatadi.','Током охлаждает одну сторону и передаёт тепло радиатору.','Uses current to chill one side and pump heat to the fins.')],
    [t3('Optik oyna','Оптическое окно','Optical window'),t3('Sovuq sensorni namlik va changdan himoya qiladi.','Защищает холодный сенсор от влаги и пыли.','Shields the cold sensor from damp and dust.')],
    [t3('Radiator qovurg‘alari','Рёбра радиатора','Heat-sink fins'),t3('Issiqlikni havoga chiqaradi (ventilyator bilan).','Отводят тепло в воздух (с вентилятором).','Shed heat into the air (with a fan).')],
    [t3('Elektronika platasi','Плата электроники','Electronics board'),t3('Signalni o‘qiydi va kompyuterga uzatadi.','Считывает сигнал и передаёт на компьютер.','Reads out the signal and sends it to the computer.')]],
  facts:[t3('Astronomiyadagi ilk CCD tasvirlardan biri 1976-yilda olingan — Uran sayyorasi surati.','Одно из первых ПЗС-изображений в астрономии получено в 1976 г. — снимок Урана.','One of the first astronomical CCD images, taken in 1976, showed Uranus.'),
    t3('Hubble va ko‘plab yirik teleskoplarning kameralari CCD yoki shunga o‘xshash sensorlarga asoslangan.','Камеры «Хаббла» и многих крупных телескопов основаны на ПЗС или похожих сенсорах.','Hubble’s and many big telescopes’ cameras use CCDs or similar sensors.'),
    t3('Xuddi shu ixtiro raqamli fotoapparatlar va telefon kameralariga ham yo‘l ochgan.','Это же изобретение открыло путь цифровым фотоаппаратам и камерам телефонов.','The same invention paved the way for digital and phone cameras.')],
  env:{ sky:'studio', shadow:0.4, size:3, floor:'stone' },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts, CY=0.12, R=0.075;
    const body=M({ clean:true, color:0x2b3c66, metal:0.6, rough:0.32, env:1.2, clip:true, side:THREE.DoubleSide }), al=M({ clean:true, color:0xb8bec6, metal:0.9, rough:0.3, env:1.3, clip:true }), blk=M({ map:c.X.metal('#1b1b1d'), metal:0.5, rough:0.5, clip:true });
    const G=new THREE.Group(); G.position.y=CY; c.root.add(G);
    mesh(new THREE.CylinderGeometry(R,R,0.07,64,1,true),body,[0,0,0.01],[Math.PI/2,0,0],G); mesh(new THREE.CylinderGeometry(R,R,0.006,64),body,[0,0,0.045],[Math.PI/2,0,0],G);
    for(let i=0;i<10;i++) mesh(new THREE.CylinderGeometry(R*0.98,R*0.98,0.0025,64),al,[0,0,-0.03-i*0.006],[Math.PI/2,0,0],G);
    mesh(new THREE.CylinderGeometry(R*0.6,R*0.6,0.06,32),blk,[0,0,-0.055],[Math.PI/2,0,0],G); mesh(new THREE.CylinderGeometry(R*0.55,R*0.55,0.004,32),M({ clean:true, color:0x111111, rough:0.7 }),[0,0,-0.089],[Math.PI/2,0,0],G);
    mesh(new THREE.CylinderGeometry(0.034,0.034,0.03,48,1,true),al,[0,0,0.063],[Math.PI/2,0,0],G); mesh(new THREE.CircleGeometry(0.03,48),K.glass(c,{ opacity:0.18 }),[0,0,0.05],null,G);
    mesh(new THREE.BoxGeometry(0.02,0.03,0.04),blk,[0,-R-0.01,0.0],null,G);
    const ct=c.tex(512,512,(x,w)=>{ const g=x.createLinearGradient(0,0,w,w); g.addColorStop(0,'#3a2a6a'); g.addColorStop(0.35,'#2b5a68'); g.addColorStop(0.6,'#5a3b7a'); g.addColorStop(1,'#2a4a4a'); x.fillStyle=g; x.fillRect(0,0,w,w); x.strokeStyle='rgba(255,255,255,.08)'; for(let i=0;i<w;i+=4){ x.beginPath(); x.moveTo(i,0); x.lineTo(i,w); x.stroke(); x.beginPath(); x.moveTo(0,i); x.lineTo(w,i); x.stroke(); } });
    const et=c.tex(512,512,(x,w)=>{ x.fillStyle='#000'; x.fillRect(0,0,w,w); for(let i=0;i<160;i++){ const px=Math.random()*w, py=Math.random()*w, r=Math.random()<0.1?5:1.5, g=x.createRadialGradient(px,py,0,px,py,r*3); g.addColorStop(0,'#fff'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(px-r*3,py-r*3,r*6,r*6); }
      const g=x.createRadialGradient(w*0.55,w*0.45,0,w*0.55,w*0.45,w*0.25); g.addColorStop(0,'rgba(255,190,220,.55)'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(0,0,w,w); });
    mesh(new THREE.BoxGeometry(0.05,0.05,0.004),M({ clean:true, color:0xe8e4dc, rough:0.6 }),[0,0,0.03],null,G);
    for(let i=0;i<14;i++) [-1,1].forEach(s=>{ mesh(new THREE.BoxGeometry(0.002,0.002,0.0012),M({ clean:true, color:0xd8a23a, metal:1, rough:0.25, env:1.6 }),[-0.0215+i*0.0033,s*0.022,0.0326],null,G); });
    const chip=mesh(new THREE.PlaneGeometry(0.036,0.036),M({ clean:true, map:ct, metal:0.6, rough:0.12, env:1.8, emissive:0xffffff, ei:0 }),[0,0,0.0325],null,G); chip.material.emissiveMap=et;
    mesh(new THREE.BoxGeometry(0.034,0.034,0.006),M({ clean:true, color:0xf2f2f2, rough:0.8 }),[0,0,0.025],null,G);
    mesh(new THREE.BoxGeometry(0.03,0.03,0.018),M({ clean:true, color:0xb87333, metal:1, rough:0.3, env:1.4 }),[0,0,0.013],null,G);
    mesh(new THREE.BoxGeometry(0.11,0.11,0.002),M({ clean:true, color:0x1f6b3a, rough:0.6 }),[0,0,-0.012],null,G);
    [[0.02,0.03],[-0.03,0.02],[0.03,-0.03],[-0.02,-0.035]].forEach(([x,y])=>mesh(new THREE.BoxGeometry(0.014,0.014,0.003),M({ clean:true, color:0x151515, rough:0.4 }),[x,y,-0.0095],null,G));
    mesh(new THREE.BoxGeometry(0.14,0.02,0.1),K.wood(c,'#2b1a10'),[0,0.01,0]); K.bar(c,[0,0.02,0],[0,CY-R-0.025,0],0.01,blk);
    lbl(P[0][0],[0,CY+0.03,0.04]); lbl(P[1][0],[0.02,CY-0.02,0.013]); lbl(P[2][0],[0,CY+0.04,0.07]); lbl(P[3][0],[0.07,CY+0.06,-0.05]); lbl(P[4][0],[-0.05,CY-0.05,-0.012]);
    let e=0; anim((t,dt)=>{ e=c.play()?Math.min(1.6,e+dt*0.4):Math.max(0,e-dt*1.5); chip.material.emissiveIntensity=e; });
    return { cam:[0.3,0.22,0.28], tgt:[0,0.12,0], maxDist:2, minDist:0.06, near:0.004, cutAt:0, cutN:[-1,0,0] }; } });

/* ---------------- Habbl kosmik teleskopi ---------------- */
IM.push({ id:'hubble', use:['observe','light'], icon:'🛰', yearN:1990,
  name:t3('Habbl kosmik teleskopi','Космический телескоп «Хаббл»','Hubble Space Telescope'), year:t3('1990-yil','1990 г.','1990'),
  who:t3('NASA va Yevropa kosmik agentligi (ESA)','NASA и Европейское космическое агентство (ESA)','NASA and the European Space Agency (ESA)'),
  size:t3('13,2 m × 4,2 m, ko‘zgu Ø 2,4 m, 11 t','13,2 × 4,2 м, зеркало Ø 2,4 м, 11 т','13.2 × 4.2 m, 2.4 m mirror, 11 t'),
  short:t3('Atmosferadan yuqorida — tiniq va ultrabinafsha nurda ham kuzatadi','Над атмосферой — видит чётко и даже в ультрафиолете','Above the atmosphere — sharp images, even in ultraviolet'),
  about:t3('Habbl 1990-yil 24-aprelda «Diskaveri» shattli bilan ~540 km balandlikdagi orbitaga chiqarilgan. Atmosfera tasvirni titratmagani uchun u yerdagi teleskoplardan ancha tiniq ko‘radi, ultrabinafsha nurni ham qayd etadi. Ko‘zgusidagi xato 1993-yilda astronavtlar tomonidan tuzatilgan; jami 5 ta ta’mirlash missiyasi bo‘lgan. Habbl koinot yoshi va kengayish tezligini aniqlashda hal qiluvchi rol o‘ynagan.',
    'Хаббл выведен 24 апреля 1990 г. шаттлом «Дискавери» на орбиту ~540 км. Атмосфера не размывает изображение, поэтому он видит гораздо чётче наземных телескопов и регистрирует ультрафиолет. Дефект зеркала исправили астронавты в 1993 г.; всего было 5 миссий обслуживания. Хаббл сыграл ключевую роль в определении возраста и скорости расширения Вселенной.',
    'Hubble was launched on 24 April 1990 by the shuttle Discovery into a ~540 km orbit. With no atmosphere to blur it, it sees far sharper than ground telescopes and records ultraviolet light. Astronauts corrected its mirror flaw in 1993; there were five servicing missions in all. Hubble was key to pinning down the age and expansion rate of the universe.'),
  tasks:[t3('Atmosfera xalaqitisiz tiniq tasvirlar olish','Получать чёткие снимки без помех атмосферы','Take sharp images free of atmospheric blur'),
    t3('Ultrabinafsha, ko‘rinadigan va yaqin infraqizil nurda kuzatish','Наблюдать в ультрафиолете, видимом и ближнем ИК','Observe in ultraviolet, visible and near-infrared'),
    t3('Koinot kengayishi, galaktikalar va ekzosayyoralarni o‘rganish','Изучать расширение Вселенной, галактики, экзопланеты','Study cosmic expansion, galaxies and exoplanets')],
  how:[t3('Yorug‘lik aperturadan kirib, 2,4 m li asosiy ko‘zguga tushadi (Kassegren sxemasi).','Свет входит через апертуру и падает на 2,4-метровое главное зеркало (схема Кассегрена).','Light enters the aperture and hits the 2.4 m primary mirror (Cassegrain design).'),
    t3('Ko‘zgu nurni oldingi kichik ikkilamchi ko‘zguga qaytaradi, u esa asosiy ko‘zgu markazidagi teshik orqali asboblarga yo‘naltiradi.','Зеркало отражает свет на маленькое вторичное, а то через отверстие в центре главного направляет его к приборам.','The mirror reflects light to a small secondary, which sends it back through a hole in the primary to the instruments.'),
    t3('Kameralar va spektrograflar tasvirni yozadi; ma’lumot antennalar orqali Yerga uzatiladi. Quyosh panellari elektr beradi.','Камеры и спектрографы записывают изображение, данные передаются на Землю через антенны. Солнечные панели дают энергию.','Cameras and spectrographs record the image; antennas send data to Earth; solar panels provide power.'),
    t3('«Ichini ko‘rish» ko‘zgularni, «Ishlatib ko‘rish» apertura qopqog‘ini ko‘rsatadi.','«Разрез» показывает зеркала, «Показать в работе» — крышку апертуры.','“Cutaway” shows the mirrors; “See it work” moves the aperture door.')],
  parts:[[t3('Asosiy ko‘zgu','Главное зеркало','Primary mirror'),t3('Ø 2,4 m, alyuminiy qoplamali.','Ø 2,4 м, алюминиевое покрытие.','2.4 m, aluminium-coated.')],
    [t3('Ikkilamchi ko‘zgu','Вторичное зеркало','Secondary mirror'),t3('Ø 0,3 m, oldingi qismda.','Ø 0,3 м, в передней части.','0.3 m, in the forward section.')],
    [t3('Quyosh panellari','Солнечные панели','Solar arrays'),t3('Ikki qanot, ~5,5 kVt.','Два крыла, ~5,5 кВт.','Two wings, ~5.5 kW.')],
    [t3('Apertura qopqog‘i','Крышка апертуры','Aperture door'),t3('Quyoshga qaraganda yopiladi.','Закрывается при наведении близко к Солнцу.','Closes if pointed near the Sun.')],
    [t3('Yuqori kuchaytirishli antennalar','Остронаправленные антенны','High-gain antennas'),t3('Ma’lumotni sun’iy yo‘ldoshlar orqali Yerga uzatadi.','Передают данные на Землю через спутники-ретрансляторы.','Send data to Earth via relay satellites.')],
    [t3('Ilmiy asboblar bo‘limi','Отсек научных приборов','Instrument bay'),t3('Kameralar va spektrograflar (ta’mirlashda almashtirilgan).','Камеры и спектрографы (менялись при обслуживании).','Cameras and spectrographs, swapped on servicing missions.')]],
  facts:[t3('«Habblning chuqur maydoni» (1995) — osmonning kichik qorong‘i qismida ~3000 galaktika topilgan.','«Глубокое поле Хаббла» (1995) — в крошечном тёмном участке неба ~3000 галактик.','The Hubble Deep Field (1995) found ~3,000 galaxies in a tiny dark patch of sky.'),
    t3('Teleskop har ~95 daqiqada Yer atrofini bir marta aylanib chiqadi.','Телескоп облетает Землю примерно каждые 95 минут.','It circles Earth about every 95 minutes.'),
    t3('Nomi koinot kengayishini kashf etgan astronom Edvin Xabbl sharafiga qo‘yilgan.','Назван в честь Эдвина Хаббла, открывшего расширение Вселенной.','Named after Edwin Hubble, who discovered the expanding universe.')],
  env:{ sky:'space', sunAz:120, sunAlt:25, shadow:16 },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,mesh,lbl,anim}=c, P=this.parts;
    const foil=c.texB(512,512,(x,w)=>{ c.paint(x,w,[[0,196,198,202],[0.5,222,224,228],[1,246,246,248]],{ oct:5, persist:0.55, contrast:1.4, speck:6 }); x.strokeStyle='rgba(60,60,60,.35)'; x.lineWidth=2; for(let i=0;i<=4;i++){ x.beginPath(); x.moveTo(0,i*w/4); x.lineTo(w,i*w/4); x.stroke(); } });
    foil.repeat.set(6,2); foil.wrapS=foil.wrapT=THREE.RepeatWrapping;
    const mli=M({ map:foil, metal:0.9, rough:0.22, env:1.6, bump:0.12, clip:true, side:THREE.DoubleSide }), blk=M({ clean:true, color:0x0c0c0e, rough:0.9, clip:true, side:THREE.DoubleSide }), mir=K.steel(c,{ map:c.X.metal('#dfe6ee'), rough:0.03, env:2.4 });
    const H=new THREE.Group(); c.root.add(H);
    const cyl=(r,len,x,m)=>mesh(new THREE.CylinderGeometry(r,r,len,64,1,true),m,[x,0,0],[0,0,Math.PI/2],H);
    cyl(2.1,4,-4.6,mli); cyl(1.55,8.2,1.5,mli); cyl(1.5,8.2,1.5,blk); mesh(new THREE.CylinderGeometry(2.1,2.1,0.05,64),mli,[-6.6,0,0],[0,0,Math.PI/2],H);
    mesh(new THREE.RingGeometry(1.55,2.1,64),mli,[-2.6,0,0],[0,Math.PI/2,0],H);
    for(let k=0;k<4;k++) mesh(new THREE.TorusGeometry(1.57,0.03,6,64),M({ clean:true, color:0xd7c26a, metal:0.6, rough:0.4, clip:true }),[-1.8+k*2.4,0,0],[0,Math.PI/2,0],H);
    mesh(new THREE.CylinderGeometry(1.2,1.2,0.12,64),mir,[-2.3,0,0],[0,0,Math.PI/2],H); mesh(new THREE.CylinderGeometry(0.15,0.15,0.08,32),mir,[2.6,0,0],[0,0,Math.PI/2],H);
    for(let i=0;i<4;i++){ const a=i/4*Math.PI*2; mesh(new THREE.BoxGeometry(0.03,1.5,0.03),blk,[2.66,Math.cos(a)*0.75,Math.sin(a)*0.75],[a,0,0],H); }
    for(let k=0;k<5;k++) mesh(new THREE.TorusGeometry(1.4,0.06,6,48),blk,[-1.4+k*1.2,0,0],[0,Math.PI/2,0],H);
    [[0,1.0],[0.9,-0.7],[-0.9,-0.7]].forEach(([y,z])=>mesh(new THREE.BoxGeometry(1.6,0.7,0.6),M({ map:c.X.metal('#c9ccd2'), metal:0.6, rough:0.5, clip:true }),[-4.4,y,z],null,H));
    const door=new THREE.Group(); door.position.set(5.6,1.55,0); H.add(door); mesh(new THREE.CylinderGeometry(1.6,1.6,0.08,64),mli,[0.04,-1.55,0],[0,0,Math.PI/2],door);
    // quyosh panellari
    const pt=c.tex(256,1024,(x,w,h)=>{ x.fillStyle='#0d1a3a'; x.fillRect(0,0,w,h); for(let j=0;j<32;j++) for(let i=0;i<8;i++){ x.fillStyle=(i+j)%2?'#132a5c':'#10234f'; x.fillRect(i*w/8+1,j*h/32+1,w/8-2,h/32-2); } x.fillStyle='#b9c0c8'; x.fillRect(0,0,w,3); x.fillRect(0,h-3,w,3); x.fillRect(w/2-2,0,4,h); });
    const pm=M({ clean:true, map:pt, metal:0.5, rough:0.25, env:1.3, side:THREE.DoubleSide });
    const wings=[-1,1].map(s=>{ const g=new THREE.Group(); g.position.set(-2.4,0,s*2.1); H.add(g); K.bar(c,[0,0,0],[0,0,s*9.6],0.06,K.steel(c),g);
      mesh(new THREE.PlaneGeometry(2.45,7.1),pm,[0,0,s*6],[-Math.PI/2+0.55,0,0],g); return g; });
    [-1,1].forEach(s=>{ K.bar(c,[-1.6,s*1.6,0],[-1.6,s*3.6,0],0.04,K.steel(c)); const d=c.dish({ D:1.3, depth:0.2, color:0xe2e4e8 }); d.position.set(-1.6,s*3.7,0); d.rotation.z=s>0?0:Math.PI; H.add(d); });
    for(let k=0;k<6;k++) K.bar(c,[-1.5+k*1.2,1.62,0.3],[-0.9+k*1.2,1.62,0.3],0.03,M({ clean:true, color:0xe0b830, rough:0.5 }),H);
    const earth=mesh(new THREE.SphereGeometry(300,96,64),M({ map:c.img('textures/2k_earth_daymap.jpg'), rough:0.95, clean:true, env:0.1, color:0xb8c0cc }),[0,-330,-90],null,null,true); earth.rotation.set(0.4,2.2,0);
    lbl(P[0][0],[-2.3,1.4,0]); lbl(P[1][0],[2.6,0.6,0]); lbl(P[2][0],[-2.4,0.3,7]); lbl(P[3][0],[6.0,2.2,0]); lbl(P[4][0],[-1.6,4.5,0]); lbl(P[5][0],[-4.6,2.5,0]);
    let k=0; anim((t,dt)=>{ k=c.play()?Math.min(1,k+dt*0.5):Math.max(0,k-dt*0.5); door.rotation.z=0.15+k*1.3; H.rotation.y=Math.sin(t*0.05)*0.3; H.rotation.x=Math.sin(t*0.04)*0.08; earth.rotation.y+=dt*0.004; });
    return { cam:[17,7,19], tgt:[0,0,0], maxDist:120, minDist:4, near:0.1, below:true, cutAt:0, cutN:[0,0,-1] }; } });

/* ---------------- LIGO ---------------- */
IM.push({ id:'ligo', use:['light'], icon:'〰️', yearN:2015,
  name:t3('Gravitatsion to‘lqin detektori (LIGO)','Детектор гравитационных волн (LIGO)','Gravitational-wave detector (LIGO)'), year:t3('2015-yil (birinchi qayd)','2015 г. (первая регистрация)','2015 (first detection)'),
  who:t3('Kaltex va MIT; Rayner Vays, Barri Barish, Kip Torn — 2017-yil Nobel mukofoti','Калтех и MIT; Райнер Вайсс, Барри Бэриш, Кип Торн — Нобелевская премия 2017 г.','Caltech and MIT; Rainer Weiss, Barry Barish, Kip Thorne — 2017 Nobel Prize'),
  size:t3('Ikki yelka, har biri 4 km','Два плеча по 4 км','Two arms, 4 km each'),
  short:t3('Fazo-vaqtning «titrashini» lazer bilan sezadi — qora tuynuklar to‘qnashuvi','Лазером улавливает «дрожь» пространства-времени — слияния чёрных дыр','Uses lasers to sense ripples in space-time from colliding black holes'),
  about:t3('LIGO — ulkan L shaklidagi lazer interferometri; AQShda ikkitasi bor (Xenford va Livingston). Gravitatsion to‘lqin o‘tganda bir yelka juda oz cho‘ziladi, ikkinchisi qisqaradi — proton diametrining o‘n mingdan biricha. Lazer nurlari qaytib qo‘shilganda bu farq yorug‘lik o‘zgarishi sifatida seziladi. 2015-yil 14-sentabrda 1,3 milliard yorug‘lik yili naridagi ikki qora tuynuk qo‘shilishidan kelgan to‘lqin birinchi marta qayd etildi.',
    'LIGO — гигантский Г-образный лазерный интерферометр; в США их два (Хэнфорд и Ливингстон). Когда проходит гравитационная волна, одно плечо чуть удлиняется, другое укорачивается — на десятитысячную долю диаметра протона. При сложении вернувшихся лучей лазера это различие проявляется как изменение света. 14 сентября 2015 г. впервые зарегистрирована волна от слияния двух чёрных дыр на расстоянии 1,3 млрд световых лет.',
    'LIGO is a giant L-shaped laser interferometer; the USA has two (Hanford and Livingston). As a gravitational wave passes, one arm stretches and the other shrinks by a ten-thousandth of a proton’s width. When the returning laser beams recombine, that difference shows up as a change in light. On 14 September 2015 it caught, for the first time, a wave from two black holes merging 1.3 billion light years away.'),
  tasks:[t3('Gravitatsion to‘lqinlarni qayd etish','Регистрировать гравитационные волны','Detect gravitational waves'),
    t3('Qora tuynuk va neytron yulduzlar qo‘shilishini o‘rganish','Изучать слияния чёрных дыр и нейтронных звёзд','Study black-hole and neutron-star mergers'),
    t3('Eynshteyn umumiy nisbiylik nazariyasini sinash','Проверять общую теорию относительности Эйнштейна','Test Einstein’s general relativity')],
  how:[t3('Markaziy binoda lazer nuri nur ajratgich yordamida ikkiga bo‘linib, ikki perpendikulyar yelkaga yuboriladi.','В центральном здании луч лазера делится светоделителем и направляется в два перпендикулярных плеча.','In the corner building a beam-splitter divides the laser and sends it down two perpendicular arms.'),
    t3('Har bir yelka oxiridagi osilgan ko‘zgu (sinov massasi) nurni qaytaradi; nur yuzlab marta borib-keladi.','Подвешенное зеркало (пробная масса) в конце плеча отражает луч; свет проходит туда-обратно сотни раз.','A suspended mirror (test mass) at each arm’s end reflects the beam, which bounces hundreds of times.'),
    t3('Qaytgan nurlar qo‘shiladi: yelkalar uzunligi teng bo‘lsa, ular bir-birini so‘ndiradi va detektorga yorug‘lik tushmaydi.','Вернувшиеся лучи складываются: при равных плечах они гасят друг друга, и на детектор свет не падает.','The returning beams recombine; with equal arms they cancel and no light reaches the detector.'),
    t3('To‘lqin yelkalarni o‘zgartirsa, detektorda signal paydo bo‘ladi. Ikki uzoq rasadxona bir vaqtda sezsa — hodisa haqiqiy. «Ishlatib ko‘rish» lazerni yoqadi.','Если волна меняет длины плеч, появляется сигнал. Если его одновременно видят две далёкие обсерватории — событие реально. «Показать в работе» включает лазер.','If a wave changes the arms, a signal appears; when two distant sites see it together, it is real. “See it work” switches on the laser.')],
  parts:[[t3('Markaziy bino','Центральное здание','Corner station'),t3('Lazer, nur ajratgich va detektor.','Лазер, светоделитель и детектор.','Laser, beam-splitter and detector.')],
    [t3('Vakuum quvuri','Вакуумная труба','Beam tube'),t3('Ø 1,2 m, ichi deyarli bo‘shliq (vakuum).','Ø 1,2 м, внутри — сверхвысокий вакуум.','1.2 m across, holding an ultra-high vacuum.')],
    [t3('Beton qoplama','Бетонный кожух','Concrete cover'),t3('Quvurni quyosh va shamoldan himoya qiladi.','Защищает трубу от солнца и ветра.','Protects the tube from sun and wind.')],
    [t3('Sinov massalari','Пробные массы','Test masses'),t3('40 kg li kvars ko‘zgular, maxsus osmalarda.','Кварцевые зеркала по 40 кг на особых подвесах.','40 kg fused-silica mirrors on special suspensions.')],
    [t3('Lazer nuri','Луч лазера','Laser beam'),t3('Infraqizil lazer — model uchun qizil ko‘rsatilgan.','Инфракрасный лазер — для модели показан красным.','Infrared laser, shown red in the model.')]],
  facts:[t3('Birinchi qayd etilgan to‘lqin (GW150914) 7 milli soniyalik farq bilan avval Livingstonda, keyin Xenfordda sezilgan.','Первая волна (GW150914) была зарегистрирована сначала в Ливингстоне, а через 7 мс — в Хэнфорде.','The first wave (GW150914) hit Livingston first, then Hanford 7 milliseconds later.'),
    t3('Model yelkalarning bir qismini ko‘rsatadi: haqiqiy uzunligi 4 km, ufqda ko‘zdan yo‘qoladi.','Модель показывает часть плеч: реальная длина 4 км — они уходят за горизонт видимости.','The model shows part of each arm; the real 4 km runs past the visible horizon.')],
  env:{ sky:'day', sunAz:160, sunAlt:35, ground:'sand', groundColor:'#b9a77e', size:3200, shadow:80, nb:0.08, fogFar:0.42 },
  feat:{ play:true, cut:true },
  build(c){ const {THREE,M,X,mesh,lbl,anim}=c, P=this.parts, LA=1400;
    const conc=M({ map:X.noise('#bdb7aa',0.1,[60,1]), rough:0.9, bump:0.3, clip:true }), wall=M({ map:X.panels('#e9ebee','rgba(90,95,105,.35)',24,3,[3,1]), rough:0.6, metal:0.2, clip:true, side:THREE.DoubleSide }), st=K.steel(c);
    const B=new THREE.Group(); c.root.add(B);
    mesh(new THREE.BoxGeometry(70,14,45),wall,[-10,7,-10],null,B); mesh(new THREE.BoxGeometry(40,9,30),wall,[-48,4.5,-14],null,B); mesh(new THREE.BoxGeometry(70.5,0.6,45.5),M({ color:0x8a9099, rough:0.7, clip:true }),[-10,14.2,-10],null,B);
    [[0,0],[-14,0],[0,-14],[-8,-8],[-20,-8],[-8,-20]].forEach(([x,z])=>{ mesh(new THREE.CylinderGeometry(1.4,1.4,5,32),st,[x-10,2.5,z-10]); mesh(new THREE.CylinderGeometry(1.5,1.5,0.3,32),st,[x-10,5.1,z-10]); });
    const cs=new THREE.Shape(); cs.moveTo(-1.9,0); cs.lineTo(1.9,0); cs.lineTo(0.9,2.6); cs.lineTo(-0.9,2.6); cs.closePath();
    const arm=(dir)=>{ const g=new THREE.Group(); g.rotation.y=dir; c.root.add(g);
      K.ext(c,cs,LA,conc,[0,0,25],null,g); mesh(new THREE.CylinderGeometry(0.6,0.6,LA,24,1,true),st,[0,1.1,25+LA/2],[Math.PI/2,0,0],g);
      for(let k=1;k<12;k++) mesh(new THREE.TorusGeometry(0.62,0.05,6,24),st,[0,1.1,25+k*LA/12],null,g);
      const beam=mesh(new THREE.CylinderGeometry(0.05,0.05,LA+20,8),M({ clean:true, color:0xff2a1a, emissive:0xff2a1a, ei:2.5 }),[0,1.1,15+LA/2],[Math.PI/2,0,0],g,true); beam.visible=false; return beam; };
    const b1=arm(0), b2=arm(Math.PI/2);
    const tm=new THREE.Group(); tm.position.set(0,1.1,LA+40); c.root.add(tm); mesh(new THREE.BoxGeometry(18,9,14),wall,[0,3.4,0],null,tm);
    lbl(P[0][0],[-10,17,-10]); lbl(P[1][0],[0,3.5,180]); lbl(P[2][0],[220,4,0]); lbl(P[3][0],[-10,6.5,-10]); lbl(P[4][0],[0,3,90]);
    anim((t)=>{ const on=c.play(); b1.visible=b2.visible=on; if(on){ const f=1.6+Math.sin(t*9)*0.8; b1.material.emissiveIntensity=f; } });
    return { cam:[-150,70,-110], tgt:[60,0,60], maxDist:1600, minDist:12, far:9000, cutAt:1.8, cutN:[0,-1,0] }; } });
})();
