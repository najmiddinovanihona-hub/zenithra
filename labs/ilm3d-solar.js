// Chiroyli 3D Quyosh tizimi — sayyoralar haqiqiy yil nisbatlarida (⏳ va ☀ mavzularida)
// Realistik rejim: Quyosh — qora jism (5772 K) granulyatsiya va dog'lar bilan; sayyoralar — NASA teksturalari,
// Quyoshdan yoritiladi (terminator, atmosfera, Saturn halqasi soyalari); asteroidlar kamari.
(function(){
if(!window.ILM3D)return;
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
const P=[
 {k:'mercury',n:{uz:"Merkuriy",ru:"Меркурий",en:"Mercury"},au:.39,r:.26,y:.241,spin:.3},
 {k:'venus',n:{uz:"Venera",ru:"Венера",en:"Venus"},au:.72,r:.42,y:.615,spin:-.1},
 {k:'earth',n:{uz:"Yer",ru:"Земля",en:"Earth"},au:1,r:.45,y:1,moon:1,spin:1,tilt:.41},
 {k:'mars',n:{uz:"Mars",ru:"Марс",en:"Mars"},au:1.52,r:.32,y:1.881,spin:1,tilt:.44},
 {k:'jupiter',n:{uz:"Yupiter",ru:"Юпитер",en:"Jupiter"},au:5.2,r:1.5,y:11.86,spin:1.4,tilt:.05},
 {k:'saturn',n:{uz:"Saturn",ru:"Сатурн",en:"Saturn"},au:9.58,r:1.25,y:29.46,spin:1.3,tilt:.47},
 {k:'uranus',n:{uz:"Uran",ru:"Уран",en:"Uranus"},au:19.2,r:.82,y:84,spin:-.8,tilt:1.71},
 {k:'neptune',n:{uz:"Neptun",ru:"Нептун",en:"Neptune"},au:30.1,r:.8,y:164.8,spin:.9,tilt:.49}
];
const YEAR=6;
const RA=au=>2.4+5.6*Math.sqrt(au);
const item={n:{uz:"Quyosh tizimi (haqiqiy yil nisbatlari)",ru:"Солнечная система (реальные соотношения лет)",en:"Solar System (true year ratios)"},
 d:{uz:"Yer Quyosh atrofini ~6 soniyada aylanadi, qolgan sayyoralar esa haqiqiy nisbatda harakatlanadi: Merkuriy Yerdan ~4 marta tez (88 kun), Yupiter 11,9 marta, Neptun esa 165 marta sekin aylanadi. Ko'rinarli bo'lishi uchun masofa va o'lchamlar ixchamlashtirilgan — aslida Quyosh Yerdan 109 marta katta va sayyoralar bir-biridan juda uzoq.",ru:"Земля облетает Солнце примерно за 6 секунд, остальные планеты движутся в реальных соотношениях: Меркурий примерно в 4 раза быстрее Земли (88 дней), Юпитер в 11,9 раза, а Нептун в 165 раз медленнее. Для наглядности расстояния и размеры сжаты — на самом деле Солнце в 109 раз больше Земли, а планеты очень далеко друг от друга.",en:"Earth circles the Sun in about 6 seconds, and the other planets move in their true ratios: Mercury about 4 times faster than Earth (88 days), Jupiter 11.9 times and Neptune 165 times slower. Distances and sizes are compressed to fit — in reality the Sun is 109 times wider than Earth and the planets are very far apart."},
 build(H){const G=new THREE.Group(),L=lg();
  // Quyosh: 5772 K, chekka qorayishi, granulyatsiya, dog'lar, toj nuri
  const sun=H.star(2.6,5772,{intensity:1.6,halo:4.2,glow:.9,spots:.45,seg:H.seg(72)});G.add(sun);
  // Orbitalar — ingichka nurli chiziqlar
  P.forEach(p=>{const R=RA(p.au),a=[];for(let k=0;k<=192;k++){const t=k/192*6.2832;a.push(R*Math.cos(t),0,R*Math.sin(t));}
   G.add(H.fatLine(193,0x8fb4ff,{width:1.1,glow:.25,intensity:.32,opacity:.55}).set(a));});
  // Asteroidlar kamari (Mars va Yupiter orasida, ~2,2–3,3 a.b.) — Kepler bo'yicha differensial aylanish
  const NA=H.n(1400),ast=H.particles(NA,{size:.07,color:0xb9a58c,intensity:.55,blend:'normal'}),AR=new Float32Array(NA),AA=new Float32Array(NA),AY=new Float32Array(NA),AW=new Float32Array(NA);
  for(let i=0;i<NA;i++){const au=2.2+Math.random()*1.1;AR[i]=RA(au)+(Math.random()-.5)*.35;AA[i]=Math.random()*6.2832;AY[i]=(Math.random()-.5)*.35;AW[i]=6.2832/(Math.pow(au,1.5)*YEAR);ast.size[i]=.5+Math.random()*1.1;}
  G.add(ast);
  const O=P.map((p,i)=>{const R=RA(p.au),piv=new THREE.Group();G.add(piv);
   const m=H.planet(p.k,p.r,{sun:[0,0,0],spin:p.spin,tilt:p.tilt||0,seg:H.seg(p.r>1?64:48)});piv.add(m);
   let moon=null;if(p.moon){moon=H.planet('moon',.12,{sun:[0,0,0],spin:.6,seg:H.seg(24)});piv.add(moon);}
   const lb=H.label(p.n[L]||p.n.uz,'#dfe8ff',.8);lb.position.y=p.r*(p.k==='saturn'?1.3:1)+.9;piv.add(lb);
   return {piv,moon,R,w:6.283/(p.y*YEAR),a0:i*1.3};});
  return {G,cam:[0,20,36],tg:[0,0,0],bg:'space',bloom:{strength:.65,threshold:1,radius:1},amb:.02,u(t){
   O.forEach(o=>{const a=o.a0+o.w*t;o.piv.position.set(o.R*Math.cos(a),0,-o.R*Math.sin(a));
    if(o.moon)o.moon.position.set(.9*Math.cos(t*4),0,-.9*Math.sin(t*4));/* Oy ham shimoldan qaraganda soat miliga teskari */});
   const ps=ast.pos;for(let i=0;i<NA;i++){const a=AA[i]+AW[i]*t;ps[i*3]=AR[i]*Math.cos(a);ps[i*3+1]=AY[i];ps[i*3+2]=-AR[i]*Math.sin(a);}ast.upd();}};}};
const add=()=>{const r=window.ILM3D.reg;if(r['⏳'])r['⏳'].items.unshift(item);if(r['☀'])r['☀'].items.unshift(item);};
add();
})();
