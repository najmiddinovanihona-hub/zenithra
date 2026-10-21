// Chiroyli 3D Quyosh tizimi — sayyoralar haqiqiy yil nisbatlarida (⏳ va ☀ mavzularida)
(function(){
if(!window.ILM3D)return;
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);return t;}
const glowTex=()=>tex(256,256,(x,w)=>{const g=x.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);g.addColorStop(0,'rgba(255,240,200,1)');g.addColorStop(.18,'rgba(255,200,90,.85)');g.addColorStop(.45,'rgba(255,140,40,.25)');g.addColorStop(1,'rgba(255,120,30,0)');x.fillStyle=g;x.fillRect(0,0,w,w);});
const bands=(cols)=>tex(64,256,(x,w,h)=>{let y=0;while(y<h){const c=cols[Math.floor(Math.random()*cols.length)],bh=4+Math.random()*18;x.fillStyle=c;x.fillRect(0,y,w,bh);y+=bh;}x.globalAlpha=.25;for(let i=0;i<40;i++){x.fillStyle=cols[i%cols.length];x.fillRect(0,Math.random()*h,w,1+Math.random()*2);}});
const ringTex=()=>tex(512,8,(x,w)=>{for(let i=0;i<w;i++){const k=i/w,a=(k<.12?0:k<.42?.55+.3*Math.sin(k*90):k<.47?.08:k<.85?.75+.2*Math.sin(k*140):k<.88?.1:.45)*(.7+.3*Math.random());x.fillStyle=`rgba(${220-k*40|0},${200-k*50|0},${160-k*60|0},${a})`;x.fillRect(i,0,1,8);}});
const P=[
 {n:{uz:"Merkuriy",ru:"Меркурий",en:"Mercury"},au:.39,r:.26,y:.241,c:0x9d9a94},
 {n:{uz:"Venera",ru:"Венера",en:"Venus"},au:.72,r:.42,y:.615,c:0xe6c27a},
 {n:{uz:"Yer",ru:"Земля",en:"Earth"},au:1,r:.45,y:1,c:0x3f7fe6,moon:1},
 {n:{uz:"Mars",ru:"Марс",en:"Mars"},au:1.52,r:.32,y:1.881,c:0xd0603a},
 {n:{uz:"Yupiter",ru:"Юпитер",en:"Jupiter"},au:5.2,r:1.5,y:11.86,b:['#d9b38c','#c49a6c','#efe0c8','#a9744f','#e6cfa8']},
 {n:{uz:"Saturn",ru:"Сатурн",en:"Saturn"},au:9.58,r:1.25,y:29.46,b:['#e8d3a0','#d6bd85','#f0e2bc','#c9a96e'],ring:1},
 {n:{uz:"Uran",ru:"Уран",en:"Uranus"},au:19.2,r:.82,y:84,c:0x9fe3e8,tilt:1.71},
 {n:{uz:"Neptun",ru:"Нептун",en:"Neptune"},au:30.1,r:.8,y:164.8,c:0x4a6cf0}
];
const YEAR=6;
// Haqiqiy teksturalar (realtex.js, NASA asosida). Bu sahna chiziqli chiqishda (sRGB emas) chiziladi.
const RT=window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;
const KEYS=['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
const ROCKY={mercury:1,mars:1};
const item={n:{uz:"Quyosh tizimi (haqiqiy yil nisbatlari)",ru:"Солнечная система (реальные соотношения лет)",en:"Solar System (true year ratios)"},
 d:{uz:"Yer Quyosh atrofini ~6 soniyada aylanadi, qolgan sayyoralar esa haqiqiy nisbatda harakatlanadi: Merkuriy Yerdan ~4 marta tez (88 kun), Yupiter 11,9 marta, Neptun esa 165 marta sekin aylanadi. Ko'rinarli bo'lishi uchun masofa va o'lchamlar ixchamlashtirilgan — aslida Quyosh Yerdan 109 marta katta va sayyoralar bir-biridan juda uzoq.",ru:"Земля облетает Солнце примерно за 6 секунд, остальные планеты движутся в реальных соотношениях: Меркурий примерно в 4 раза быстрее Земли (88 дней), Юпитер в 11,9 раза, а Нептун в 165 раз медленнее. Для наглядности расстояния и размеры сжаты — на самом деле Солнце в 109 раз больше Земли, а планеты очень далеко друг от друга.",en:"Earth circles the Sun in about 6 seconds, and the other planets move in their true ratios: Mercury about 4 times faster than Earth (88 days), Jupiter 11.9 times and Neptune 165 times slower. Distances and sizes are compressed to fit — in reality the Sun is 109 times wider than Earth and the planets are very far apart."},
 build(H){const G=new THREE.Group(),L=lg();
  const sn=H.fib(2500),sp=H.pts(2500,.35,0xffffff);sp.geometry.attributes.position.array.set(sn.map(v=>v*160));sp.material.opacity=.7;sp.material.sizeAttenuation=false;sp.material.size=1.3;G.add(sp);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(2.6,64,32),new THREE.MeshBasicMaterial({map:tex(256,128,(x,w,h)=>{x.fillStyle='#ffb43c';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`rgba(255,${200+Math.random()*55|0},${90+Math.random()*80|0},${Math.random()*.5})`;x.beginPath();x.arc(Math.random()*w,Math.random()*h,Math.random()*3,0,7);x.fill();}})}));
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));glow.scale.set(16,16,1);G.add(sun,glow);
  if(RT) RT.apply(sun,'sun',{srgb:false,gain:1.15});
  const O=P.map((p,i)=>{const R=2.4+5.6*Math.sqrt(p.au),ob=H.line(193,0x8fb4ff,.18),a=ob.geometry.attributes.position.array;for(let k=0;k<=192;k++){const t=k/192*6.283;a.set([R*Math.cos(t),0,R*Math.sin(t)],k*3);}H.upd(ob);G.add(ob);
   const mat=p.b?new THREE.MeshStandardMaterial({map:bands(p.b),roughness:.9}):new THREE.MeshStandardMaterial({color:p.c,roughness:.85});
   const piv=new THREE.Group(),m=new THREE.Mesh(new THREE.SphereGeometry(p.r,48,24),mat);if(p.tilt)m.rotation.z=p.tilt;piv.add(m);G.add(piv);
   if(RT) RT.apply(m,KEYS[i],{srgb:false,gain:ROCKY[KEYS[i]]?1:.9,bump:ROCKY[KEYS[i]]?.004:0});
   if(p.ring){const rg=new THREE.RingGeometry(p.r*1.25,p.r*2.3,96,1),uv=rg.attributes.uv,pos=rg.attributes.position,v=new THREE.Vector3();for(let k=0;k<uv.count;k++){v.fromBufferAttribute(pos,k);uv.setXY(k,(v.length()-p.r*1.25)/(p.r*1.05),.5);}
    const ring=new THREE.Mesh(rg,new THREE.MeshBasicMaterial({map:ringTex(),transparent:true,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2+.47;piv.add(ring);
    if(RT) RT.texture('saturnRing',{srgb:false}).then(t=>{ring.material.map=t;ring.material.needsUpdate=true;}).catch(()=>{});}
   let moon=null;if(p.moon){moon=new THREE.Mesh(new THREE.SphereGeometry(.12,20,10),new THREE.MeshStandardMaterial({color:0xcfd2d8,roughness:1}));piv.add(moon);if(RT) RT.apply(moon,'moon',{srgb:false,bump:.002});}
   const lb=H.label(p.n[L]||p.n.uz,'#dfe8ff',.8);lb.position.y=p.r+.9;piv.add(lb);
   return {piv,m,moon,R,w:6.283/(p.y*YEAR),a0:i*1.3};});
  return {G,cam:[0,20,36],tg:[0,0,0],u(t){sun.rotation.y=t*.08;glow.material.rotation=t*.02;
   O.forEach(o=>{const a=o.a0+o.w*t;o.piv.position.set(o.R*Math.cos(a),0,-o.R*Math.sin(a));o.m.rotation.y=t*1.5;if(o.moon)o.moon.position.set(.9*Math.cos(t*4),0,.9*Math.sin(t*4));});}};}};
const add=()=>{const r=window.ILM3D.reg;if(r['⏳'])r['⏳'].items.unshift(item);if(r['☀'])r['☀'].items.unshift(item);};
add();
})();
