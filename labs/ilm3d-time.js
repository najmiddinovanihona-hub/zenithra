// Koinotda vaqt — 3D ko'rgazmalar va qo'shimcha grafiklar (⏳)
(function(){
if(!window.ILM3D)return;
const lerp=(a,b,k)=>a+(b-a)*k;
// Doimiy materiallar: element almashganda dispose qilinmaydi — shader dasturi keshda qoladi, qayta tanlashda kompilyatsiya to'xtashi bo'lmaydi
const KM={},keepM=(k,f)=>{let m=KM[k];if(!m){m=f();m.dispose=()=>{};KM[k]=m;}return m;};
const kStd=(H,c,o)=>keepM('s'+c+JSON.stringify(o||{}),()=>H.std(c,o)),kB=(H,c,k)=>keepM('b'+c+'|'+k,()=>new THREE.MeshBasicMaterial({color:H.lin(c).multiplyScalar(k)}));
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const X={
 uz:{g:"Lorents omili: harakatdagi soat necha marta sekin yuradi",gl:["0,1c","0,5c","0,9c","0,99c","0,999c","0,9999c"],
  gps:"GPS soatlari: sutkalik tuzatish",gpsH:["Ta'sir","Sabab","Sutkasiga"],gpsR:[["Maxsus nisbiylik","Yo'ldosh ~3,9 km/s tezlikda harakatlanadi","−7 mks"],["Umumiy nisbiylik","Orbitada (20 200 km) tortishish kuchsizroq","+45 mks"],["Natija","Soatlar Yerdagidan oldinga ketadi","+38 mks"]],
  cal:"Kosmik kalendar: koinot tarixi bir yilga siqilsa (1 kun ≈ 37,8 mln yil)",calH:["Voqea","Necha yil oldin","Kalendarda"],
  calR:[["Katta portlash","13,8 mlrd","1-yanvar, 00:00"],["Birinchi yulduzlar","~13,6 mlrd","~6-yanvar"],["Quyosh tizimi shakllanadi","4,6 mlrd","31-avgust"],["Yerdagi ilk hayot izlari","~3,8 mlrd","~21-sentabr"],["Kembriy portlashi","~538 mln","17-dekabr"],["Birinchi dinozavrlar","~230 mln","~25-dekabr"],["Dinozavrlar qirilishi","66 mln","30-dekabr, ~06:00"],["Homo sapiens","~300 ming","31-dekabr, 23:48"],["Yozuv ixtirosi","~5 200","31-dekabr, 23:59:48"],["Ulug'bek rasadxonasi","~600","yarim tunga 1,4 soniya qolganda"]]},
 ru:{g:"Фактор Лоренца: во сколько раз медленнее идут движущиеся часы",gl:["0,1c","0,5c","0,9c","0,99c","0,999c","0,9999c"],
  gps:"Часы GPS: суточная поправка",gpsH:["Эффект","Причина","За сутки"],gpsR:[["Специальная относительность","Спутник движется со скоростью ~3,9 км/с","−7 мкс"],["Общая относительность","На орбите (20 200 км) гравитация слабее","+45 мкс"],["Итог","Часы уходят вперёд относительно земных","+38 мкс"]],
  cal:"Космический календарь: история Вселенной, сжатая в один год (1 день ≈ 37,8 млн лет)",calH:["Событие","Сколько лет назад","В календаре"],
  calR:[["Большой взрыв","13,8 млрд","1 января, 00:00"],["Первые звёзды","~13,6 млрд","~6 января"],["Образование Солнечной системы","4,6 млрд","31 августа"],["Первые следы жизни на Земле","~3,8 млрд","~21 сентября"],["Кембрийский взрыв","~538 млн","17 декабря"],["Первые динозавры","~230 млн","~25 декабря"],["Вымирание динозавров","66 млн","30 декабря, ~06:00"],["Homo sapiens","~300 тыс.","31 декабря, 23:48"],["Изобретение письменности","~5 200","31 декабря, 23:59:48"],["Обсерватория Улугбека","~600","за 1,4 секунды до полуночи"]]},
 en:{g:"Lorentz factor: how many times slower a moving clock runs",gl:["0.1c","0.5c","0.9c","0.99c","0.999c","0.9999c"],
  gps:"GPS clocks: daily correction",gpsH:["Effect","Cause","Per day"],gpsR:[["Special relativity","The satellite moves at ~3.9 km/s","−7 µs"],["General relativity","Gravity is weaker in orbit (20,200 km)","+45 µs"],["Net","Clocks run ahead of ground clocks","+38 µs"]],
  cal:"Cosmic calendar: the Universe's history squeezed into one year (1 day ≈ 37.8 million years)",calH:["Event","Years ago","On the calendar"],
  calR:[["Big Bang","13.8 billion","1 January, 00:00"],["First stars","~13.6 billion","~6 January"],["Solar System forms","4.6 billion","31 August"],["Earliest traces of life on Earth","~3.8 billion","~21 September"],["Cambrian explosion","~538 million","17 December"],["First dinosaurs","~230 million","~25 December"],["Dinosaurs wiped out","66 million","30 December, ~06:00"],["Homo sapiens","~300,000","31 December, 23:48"],["Invention of writing","~5,200","31 December, 23:59:48"],["Ulugbek's observatory","~600","1.4 seconds before midnight"]]}
};
const GV=[1.005,1.155,2.294,7.089,22.37,70.71];
function barSVG(vals,labels,l){const n=vals.length,rowH=36,lw=110,W=600,bw=W-lw-80,H=n*rowH+8,lo=-0.15,hi=Math.log10(Math.max(...vals)),COL=['#4ea8ff','#7fd4ff','#5fe0b0','#ffc861','#ff9a4d','#ff7a8a'];
 let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">`;vals.forEach((v,i)=>{const y=i*rowH+4,w=Math.max(4,(Math.log10(v)-lo)/(hi-lo)*bw);
  s+=`<text x="${lw-10}" y="${y+20}" text-anchor="end" fill="currentColor" font-size="13" opacity=".85">${labels[i]}</text><rect x="${lw}" y="${y+5}" width="${bw}" height="22" rx="6" fill="rgba(255,255,255,.05)"></rect><rect x="${lw}" y="${y+5}" width="${w}" height="22" rx="6" fill="${COL[i]}"></rect><text x="${lw+w+8}" y="${y+21}" fill="currentColor" font-size="13" font-weight="700">×${new Intl.NumberFormat({uz:'uz-UZ',ru:'ru-RU',en:'en-US'}[l],{maximumSignificantDigits:4}).format(v)}</text>`;});return s+'</svg>';}
const warmStd=()=>{if(window.__ilmStdW)return;const R=window.ILM3D.renderer&&window.ILM3D.renderer();if(!R)return;window.__ilmStdW=1;   // MeshStandard dasturini bo'sh vaqtda oldindan kompilyatsiya (bir marta)
 (window.requestIdleCallback||(f=>setTimeout(f,60)))(()=>{try{const s=new THREE.Scene(),m=new THREE.MeshStandardMaterial();m.dispose=()=>{};s.add(new THREE.AmbientLight(),new THREE.PointLight(),new THREE.Mesh(new THREE.BoxGeometry(),m));R.compile(s,new THREE.PerspectiveCamera());}catch(e){}},{timeout:1500});};
const tbl=(h,r)=>`<div class="ilm-box" style="overflow-x:auto"><table class="ilm-tbl"><thead><tr>${h.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${r.map(x=>`<tr>${x.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

// Realistik soat: metall gardish, qora siferblat, nurlanuvchi belgilar va mil (HDR — bloom beradi)
function clock(H,col){const g=new THREE.Group(),bez=kStd(H,col,{metalness:.75,roughness:.28,emissive:col,emissiveIntensity:.35}),
 ring=new THREE.Mesh(new THREE.TorusGeometry(.7,.07,12,56),bez),back=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.1,40),kStd(H,0x10131c,{metalness:.4,roughness:.5})),
 face=new THREE.Mesh(new THREE.CircleGeometry(.66,40),kB(H,0x060a18,1)),
 tkm=kB(H,col,2.2),hm=kB(H,0xffffff,3),
 hand=new THREE.Mesh(new THREE.BoxGeometry(.05,.56,.03),hm),hub=new THREE.Mesh(new THREE.CircleGeometry(.06,16),hm);
 back.rotation.x=Math.PI/2;back.position.z=-.06;face.position.z=.001;hand.geometry.translate(0,.26,0);hand.position.z=.03;hub.position.z=.05;
 g.add(back,face,ring,hand,hub);for(let i=0;i<12;i++){const tk=new THREE.Mesh(new THREE.BoxGeometry(i%3?.03:.05,i%3?.09:.15,.02),tkm);const a=i/12*Math.PI*2;tk.position.set(Math.sin(a)*.55,Math.cos(a)*.55,.01);tk.rotation.z=-a;g.add(tk);}
 const gl=H.glow(col,3.2,.35);gl.position.z=-.2;g.add(gl);g.userData.hand=hand;return g;}

ILM3D.add('⏳',{title:{uz:"Vaqt — 3D ko'rgazma",ru:"Время — 3D-демонстрация",en:"Time — 3D demonstration"},
 extra(l){const x=X[l]||X.uz;return `<h4>${esc(x.g)}</h4><div class="ilm-box">${barSVG(GV,x.gl,l)}</div><h4>${esc(x.gps)}</h4>${tbl(x.gpsH,x.gpsR)}<h4>${esc(x.cal)}</h4>${tbl(x.calH,x.calR)}`;},
 items:[
 {n:{uz:"Tortishish vaqtni sekinlashtiradi",ru:"Гравитация замедляет время",en:"Gravity slows time"},
  d:{uz:"Massiv jism atrofidagi fazo-vaqt chuqurligida to'rtta soat turibdi. Markazga yaqin soat sekinroq, uzoqdagisi tezroq yuradi. Ko'rgazmadagi farq ko'rinarli bo'lishi uchun kattalashtirilgan: Yerda bu farq milliarddan bir ulushlarda, neytron yulduz yuzasida esa ~20% ni tashkil qiladi.",ru:"В «воронке» пространства-времени вокруг массивного тела стоят четверо часов. Ближние к центру идут медленнее, дальние — быстрее. Разница здесь увеличена для наглядности: на Земле она составляет миллиардные доли, а на поверхности нейтронной звезды — около 20%.",en:"Four clocks sit in the spacetime well around a massive body. The one nearest the centre runs slowest, the farthest runs fastest. The effect is exaggerated to be visible: on Earth it is parts per billion, on a neutron star's surface about 20%."},
  build(H){const G=new THREE.Group(),hgt=r=>-Math.min(7,6/Math.sqrt(Math.max(.7,r))*1.4-1.2);
   // silliq yoritilgan fazo-vaqt varag'i (chuqurlikda iliq rang)
   G.add(H.surface(34,H.q==='low'?80:120,{color:0x0d2650,line:0x5aa6ff,deep:0xff8a3d,cell:1.4,depth:11,opacity:.72,glow:.3}).deform((x,z)=>hgt(Math.hypot(x,z))));
   // markazdagi massiv ixcham jism (neytron yulduz) — issiq, oq-ko'kish
   const core=H.star(.9,9000,{intensity:2.2,halo:3.5,glow:.9,gran:.5});core.position.y=-6.4;G.add(core);
   G.position.set(0,-12,-14);// yorug'lik: dvigatelning markaziy PointLight'i (olam koordinatasi 0,0,0) — G siljitiladi, shunda u kerakli joyda bo'ladi (qo'shimcha chiroq shader dasturlarini qayta kompilyatsiya qildirardi)

   const C=[[2.6,0xff7a8a],[5,0xffc861],[8.5,0x5fe0b0],[13,0x7fd4ff]].map(([r,c],i)=>{const k=clock(H,c),a=i*1.7+.4;k.position.set(r*Math.cos(a),hgt(r)+1.1,r*Math.sin(a));G.add(k);const f=Math.sqrt(1-2.2/r);
    // soat turgan joy — varaqdagi nurli halqa
    const rg=[];for(let s=0;s<=48;s++){const b=s/48*6.2832,x=k.position.x+.55*Math.cos(b),z=k.position.z+.55*Math.sin(b);rg.push(x,hgt(Math.hypot(x,z))+.03,z);}G.add(H.fatLine(49,c,{width:2,glow:.6,intensity:1.3}).set(rg),H.fatLine(2,c,{width:1.4,glow:.2,intensity:.7}).set([k.position.x,hgt(r)+.03,k.position.z,k.position.x,k.position.y-.76,k.position.z]));
    const lb=H.label('×'+f.toFixed(2).replace('.',lg()==='en'?'.':','),'#'+c.toString(16).padStart(6,'0'),.9);lb.position.copy(k.position).add(new THREE.Vector3(0,1.1,0));G.add(lb);return [k,f];});
   return {G,cam:[0,-3,8],tg:[0,-13.5,-14],u(t){C.forEach(([k,f])=>{k.userData.hand.rotation.z=-t*f*2.2;k.lookAt(k.position.x*0+0,k.position.y,22);});}};}},
 {n:{uz:"Yorug'lik soati (maxsus nisbiylik)",ru:"Световые часы (специальная относительность)",en:"Light clock (special relativity)"},
  d:{uz:"Ikki ko'zgu orasida yorug'lik zarrasi borib-keladi — har bir borib-kelish bitta «tiq». Harakatdagi soatda (o'ngda, 0,87c) foton qiya yo'l bosadi, yorug'lik tezligi esa o'zgarmas, shuning uchun uning «tiq»i 2 marta uzoq davom etadi (γ = 2). Tinch turgan kuzatuvchi uchun harakatdagi soat sekinroq yuradi.",ru:"Между двумя зеркалами туда-обратно летает фотон — каждый пролёт это один «тик». В движущихся часах (справа, 0,87c) фотон идёт по диагонали, а скорость света неизменна, поэтому «тик» длится в 2 раза дольше (γ = 2). Для неподвижного наблюдателя движущиеся часы идут медленнее.",en:"A photon bounces between two mirrors — each round trip is one 'tick'. In the moving clock (right, 0.87c) the photon travels a diagonal path, and since light speed is fixed each tick takes twice as long (γ = 2). To a stationary observer, the moving clock runs slow."},
  build(H){const G=new THREE.Group(),
    // ko'zgu: kumush qoplamali shisha plastina + rangli ramka (yorug'lik tomonida nurlanuvchi chiziq)
    mir=(c,up)=>{const m=new THREE.Group(),gl=new THREE.Mesh(new THREE.BoxGeometry(2,.1,1),kStd(H,0xd8e2f0,{metalness:.9,roughness:.12,emissive:0x1a2233})),fr=new THREE.Mesh(new THREE.BoxGeometry(2.12,.14,1.12),kStd(H,c,{metalness:.6,roughness:.35,emissive:c,emissiveIntensity:.25}));
     fr.position.y=up?.05:-.05;m.add(fr,gl);const e=H.fatLine(2,c,{width:2.5,glow:.8,intensity:1.6}).set([-1,up?-.06:.06,.5,1,up?-.06:.06,.5]);m.add(e);return m;};
   const A1=mir(0x9fc4ff,0),A2=mir(0x9fc4ff,1),B1=mir(0xffc861,0),B2=mir(0xffc861,1);A1.position.set(-9,0,0);A2.position.set(-9,4,0);G.add(A1,A2,B1,B2);G.position.set(0,-10,-12);;
   // tinch soat — foton yo'li (vertikal nur izi)
   G.add(H.fatLine(2,0x9fc4ff,{width:1.5,glow:.4,intensity:.45,opacity:.6}).set([-9,.05,0,-9,3.95,0]));
   // harakat yo'nalishi (relslar)
   G.add(H.fatLine(2,0x6f86b8,{width:1,glow:0,intensity:.35}).set([-11,-.7,0,15,-.7,0]));
   const ph=()=>{const g=new THREE.Group(),b=new THREE.Mesh(new THREE.SphereGeometry(.12,16,8),kB(H,0xfff4d8,6));g.add(b,H.glow(0xffe6a8,2.2,1.4,{spikes:.25}));return g;};
   const pa=ph(),pb=ph();G.add(pa,pb);const tr=H.fatLine(400,0xffc861,{width:2.4,glow:.9,intensity:1.5});G.add(tr);
   const L=lg(),la=H.label({uz:"Tinch soat",ru:"Покоящиеся часы",en:"Clock at rest"}[L]||"Tinch soat",'#9fc4ff',1.1),lb=H.label({uz:"Harakatdagi soat",ru:"Движущиеся часы",en:"Moving clock"}[L]||"Harakatdagi soat",'#ffc861',1.1);la.position.set(-9,5.4,0);G.add(la,lb);
   const c=4,v=c*Math.sqrt(3)/2,span=18;let hist=[];
   const tri=(t,P)=>{const k=(t%P)/P;return k<.5?k*2:2-k*2;};
   return {G,cam:[2,-7,8],tg:[0,-8,-12],u(t){pa.position.set(-9,4*tri(t,2),0);const T=t%(span/v),x=-4+v*T;B1.position.set(x,0,0);B2.position.set(x,4,0);lb.position.set(x,5.4,0);pb.position.set(x,4*tri(t,4),0);
    if(T<.05||(hist.length&&pb.position.x<hist[hist.length-3]))hist=[];hist.push(pb.position.x,pb.position.y,0);if(hist.length>1200)hist=hist.slice(-1200);tr.visible=hist.length>3;if(hist.length>3)tr.set(hist);}};}},
 {n:{uz:"GPS sun'iy yo'ldoshlari",ru:"Спутники GPS",en:"GPS satellites"},
  d:{uz:"GPS turkumi 6 ta orbita tekisligida (55° qiyalik) ~20 200 km balandlikda uchadigan kamida 24 ta yo'ldoshdan iborat; har biri Yerni ~12 soatda aylanadi. Ulardagi atom soatlari nisbiylik tufayli sutkasiga +38 mikrosoniyaga tuzatiladi — aks holda navigatsiya bir kunda ~10 km ga adashardi.",ru:"Группировка GPS — не менее 24 спутников в 6 орбитальных плоскостях (наклон 55°) на высоте ~20 200 км; каждый облетает Землю примерно за 12 часов. Их атомные часы корректируют на +38 микросекунд в сутки из-за относительности — иначе навигация за день ошибалась бы примерно на 10 км.",en:"The GPS constellation has at least 24 satellites in 6 orbital planes (55° tilt) at ~20,200 km; each circles Earth in about 12 hours. Their atomic clocks are corrected by +38 microseconds a day for relativity — otherwise navigation would drift by ~10 km in a day."},
  build(H){const G=new THREE.Group(),SD=new THREE.Vector3(5,3,4).normalize();
   // Yer: NASA teksturalari, Quyoshdan yoritilgan (terminator, tungi chiroqlar, bulutlar, atmosfera)
   const earth=H.planet('earth',1,{sunDir:[SD.x,SD.y,SD.z],spin:0,seg:H.seg(72)});G.add(earth);const LP=SD.clone().multiplyScalar(60);G.position.copy(LP).negate();;
   // qabul qiluvchi: Toshkent (41,3° sh.k., 69,2° sh.u.) — Yer bilan birga aylanadi
   const la=41.3*Math.PI/180,ph=(69.2+180)/360*Math.PI*2,rcv=new THREE.Group();rcv.position.set(-Math.cos(ph)*Math.cos(la),Math.sin(la),Math.sin(ph)*Math.cos(la)).multiplyScalar(1.015);
   rcv.add(H.glow(0x7dffb0,.55,1.6));earth.body.add(rcv);
   const BM=[0,1,2,3].map(()=>{const l=H.fatLine(2,0x7dffb0,{width:1.3,glow:.5,intensity:.9,opacity:.75});G.add(l);return l;});
   // yo'ldosh: oltin rang issiqlik qoplamali korpus + ikki quyosh paneli + antenna; uzoqdan ko'rinishi uchun yengil nur
   const gB=new THREE.BoxGeometry(.13,.13,.17),gP=new THREE.BoxGeometry(.34,.012,.13),gA=new THREE.CylinderGeometry(.03,.05,.06,10),
    mB=kStd(H,0xd9a441,{metalness:.85,roughness:.32,emissive:0x2a1a04}),mP=kStd(H,0x1d3a8c,{metalness:.45,roughness:.3,emissive:0x050c22}),mA=kStd(H,0xe6e9ef,{metalness:.6,roughness:.4});
   const S=[],R=4.17;for(let pl=0;pl<6;pl++){const og=new THREE.Group();og.rotation.y=pl*Math.PI/3;const inner=new THREE.Group();inner.rotation.x=55*Math.PI/180;og.add(inner);G.add(og);
    const a0=[];for(let i=0;i<=128;i++){const a=i/128*6.2832;a0.push(R*Math.cos(a),0,R*Math.sin(a));}inner.add(H.fatLine(129,0x7fd4ff,{width:1.2,glow:.4,intensity:.45,opacity:.6}).set(a0));
    for(let k=0;k<4;k++){const s=new THREE.Group(),b=new THREE.Mesh(gB,mB),p1=new THREE.Mesh(gP,mP),p2=new THREE.Mesh(gP,mP),an=new THREE.Mesh(gA,mA);
     p1.position.x=.24;p2.position.x=-.24;an.rotation.x=Math.PI/2;an.position.z=-.11;s.add(b,p1,p2,an,H.glow(0xffe2a8,.9,.45));inner.add(s);S.push([s,k/4*6.283+pl*.5]);}}
   const wp=new THREE.Vector3(),rp=new THREE.Vector3(),nr=new THREE.Vector3(),cand=[];
   return {G,cam:[-LP.x,4-LP.y,13-LP.z],tg:[-LP.x,-LP.y,-LP.z],bg:'space',bloom:{strength:.6,threshold:1,radius:1},amb:.03,u(t){/* yo'ldoshlar to'g'ri yo'nalishda, ~12 soatda bir aylanadi — Yer sutkasidan 2 marta tez */
    S.forEach(([s,o])=>{const a=o+t*.35;s.position.set(R*Math.cos(a),0,-R*Math.sin(a));s.rotation.y=a;});earth.body.rotation.y=t*.175;
    // qabul qiluvchi ufqidan yuqoridagi eng yaqin 4 ta yo'ldosh — trilateratsiya
    G.updateMatrixWorld();rcv.getWorldPosition(rp).sub(G.position);nr.copy(rp).normalize();cand.length=0;
    S.forEach(([s])=>{s.getWorldPosition(wp).sub(G.position);const d=wp.clone().sub(rp);if(d.dot(nr)>.05)cand.push([d.length(),wp.clone()]);});cand.sort((a,b)=>a[0]-b[0]);
    BM.forEach((l,i)=>{const c=cand[i];l.visible=!!c;if(c)l.set([rp.x,rp.y,rp.z,c[1].x,c[1].y,c[1].z]);});}};}},
 {n:{uz:"O'tmishga nazar",ru:"Взгляд в прошлое",en:"Looking into the past"},
  d:{uz:"Markazda Yer. Har bir halqa — yorug'lik bizga qancha vaqtda yetib kelishi (logarifmik masshtab): Oy 1,3 soniya, Quyosh 8,3 daqiqa, Neptun ~4 soat, Proksima 4,2 yil, Galaktika markazi ~26 ming yil, Andromeda 2,5 mln yil, relikt nurlanish ~13,8 mlrd yil. Uzoqqa qaragan sari biz koinotning qadimroq holatini ko'ramiz.",ru:"В центре — Земля. Каждое кольцо — время, за которое свет доходит до нас (логарифмический масштаб): Луна 1,3 с, Солнце 8,3 мин, Нептун ~4 ч, Проксима 4,2 года, центр Галактики ~26 тыс. лет, Андромеда 2,5 млн лет, реликтовое излучение ~13,8 млрд лет. Чем дальше смотрим, тем более древнюю Вселенную видим.",en:"Earth is at the centre. Each ring is how long light takes to reach us (log scale): Moon 1.3 s, Sun 8.3 min, Neptune ~4 h, Proxima 4.2 years, galactic centre ~26,000 years, Andromeda 2.5 million years, background radiation ~13.8 billion years. The farther we look, the older the Universe we see."},
  build(H){const G=new THREE.Group(),earth=H.planet('earth',.6,{sunDir:[.8,.35,.5],spin:.15,seg:H.seg(56)});G.add(earth);const L=lg();
   const D=[[1.28,{uz:"Oy · 1,3 s",ru:"Луна · 1,3 с",en:"Moon · 1.3 s"},0xcfd6e6],[499,{uz:"Quyosh · 8,3 daq",ru:"Солнце · 8,3 мин",en:"Sun · 8.3 min"},0xffc861],[14800,{uz:"Neptun · ~4 soat",ru:"Нептун · ~4 ч",en:"Neptune · ~4 h"},0x5f8fff],[1.34e8,{uz:"Proksima · 4,2 yil",ru:"Проксима · 4,2 года",en:"Proxima · 4.2 yr"},0xff9a5a],[8.2e11,{uz:"Galaktika markazi · 26 ming yil",ru:"Центр Галактики · 26 тыс. лет",en:"Galactic centre · 26,000 yr"},0xffe08a],[7.9e13,{uz:"Andromeda · 2,5 mln yil",ru:"Андромеда · 2,5 млн лет",en:"Andromeda · 2.5 Myr"},0xa26bff],[4.35e17,{uz:"Relikt nurlanish · 13,8 mlrd yil",ru:"Реликтовое излучение · 13,8 млрд лет",en:"Background radiation · 13.8 Gyr"},0xff7a8a]];
   // har bir halqadagi manba — realistik ko'rinishda (yorug'lik shu joydan Yerga yo'l oladi)
   const SRC=[
    a=>H.planet('moon',.17,{sunDir:[.8,.35,.5],spin:.05,seg:H.seg(32)}),
    a=>H.star(.34,5772,{intensity:1.8,halo:3.2,glow:.8,spots:.3,seg:H.seg(40)}),
    a=>H.planet('neptune',.26,{sunDir:[.8,.35,.5],seg:H.seg(32)}),
    a=>H.star(.2,3042,{intensity:2,halo:4,glow:1,gran:.6,seg:H.seg(24)}),          // Proksima — qizil mitti, 3042 K
    a=>{const g=new THREE.Group(),n=H.n(500),p=H.particles(n,{size:.09,intensity:1.3});for(let i=0;i<n;i++){const r=Math.pow(Math.random(),2)*.9,t=Math.random()*6.2832,z=(Math.random()-.5)*.25*(1-r);p.pos.set([r*Math.cos(t),z,r*Math.sin(t)],i*3);p.setColor(i,Math.random()<.7?0xffd9a0:0xffefd8);}
     p.upd();g.add(p,H.glow(0xffd9a0,2.4,1.2));return g;},                                   // Galaktika markazi — bo'rtma
    a=>{const g=new THREE.Group(),n=H.n(700),p=H.particles(n,{size:.08,intensity:1.2});for(let i=0;i<n;i++){const arm=i%2,r=.1+Math.random()*1.1,t=arm*Math.PI+r*2.6+(Math.random()-.5)*.7,c=r<.35?0xffe2b8:(Math.random()<.5?0xbcd4ff:0xe8ecff);
      p.pos.set([r*Math.cos(t),(Math.random()-.5)*.05,r*Math.sin(t)],i*3);p.setColor(i,c);}p.upd();g.add(p,H.glow(0xfff0d8,1.2,1));g.rotation.set(.9,0,.35);return g;},   // Andromeda — spiral galaktika
    null];
   const P=[];D.forEach(([s,n,c],i)=>{const r=1+Math.log10(s)*.92,a=Math.random()*6.283,ra=[];for(let k=0;k<=160;k++){const b=k/160*6.2832;ra.push(r*Math.cos(b),0,r*Math.sin(b));}
    G.add(H.fatLine(161,c,{width:1.5,glow:.5,intensity:.8,opacity:.75}).set(ra));
    const lb=H.label(n[L]||n.uz,'#'+c.toString(16).padStart(6,'0'),1.25);const la=[-1.95,-.45,.55,.79,.79,.79,.79][i];lb.position.set(r*Math.cos(la),.55,r*Math.sin(la));lb.scale.set(6.5,1.6,1);G.add(lb);
    if(SRC[i]){const o=SRC[i]();o.position.set(r*Math.cos(a),0,r*Math.sin(a));G.add(o);}
    const ph=H.glow(c,1.1,1.8);G.add(ph);P.push([ph,r,a]);});
   // relikt nurlanish — eng chekka halqa bo'ylab notekis (anizotrop) issiq-sovuq dog'lar
   {const r=1+Math.log10(4.35e17)*.92,n=H.n(1400),p=H.particles(n,{size:.3,intensity:.6,opacity:.8});for(let i=0;i<n;i++){const t=Math.random()*6.2832,rr=r+(Math.random()-.5)*1.1,y=(Math.random()-.5)*.6;p.pos.set([rr*Math.cos(t),y,rr*Math.sin(t)],i*3);
     const v=Math.sin(t*7.0)+Math.sin(t*17.0+1.3)*.6+(Math.random()-.5)*.8;p.setColor(i,v>.4?0xff8a5c:v<-.4?0x4a7dff:0xffd2a0);}p.upd();G.add(p);}
   return {G,cam:[0,19,24],tg:[0,0,0],bg:'space',bloom:{strength:.7,threshold:1,radius:1},amb:.02,u(t){P.forEach(([ph,r,a],i)=>{const k=((t*.18+i*.13)%1),rr=lerp(r,.6,k);ph.position.set(rr*Math.cos(a),0,rr*Math.sin(a));ph.uniforms.uInt.value=1.8*(1-k*.6)*Math.min(1,(1-k)*8);});G.rotation.y=t*.04;}};}}
 ]});
window.ILM3D.reg['⏳'].items.forEach(it=>{const b=it.build;it.build=H=>{warmStd();return b(H);};});
})();
