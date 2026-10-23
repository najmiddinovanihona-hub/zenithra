/* 🌍 Dunyo rasadxonalari — alohida ekran: chapda ro'yxat (filtr bilan), o'ngda 3D model va ma'lumot.
   Modellar labs/obs-models.js da (window.OBS_MODELS); bu fayl — umumiy 3D "dvigatel" va qurilish bloklari:
   osmon, yer/relyef, yorug'lik, kesib ko'rish (clipping), ochiladigan gumbaz, refraktor, reflektor, radio-antenna,
   olti burchakli ko'zgu, notekis tosh. Koordinatalar: x — sharq, y — yuqori, z — janub (metr). */
(function(){
'use strict';
const LANGS=['uz','ru','en'];
const L=()=>{ const l=document.documentElement.lang; return LANGS.indexOf(l)>=0?l:'uz'; };
const T=o=>o==null?'':(typeof o==='string'?o:(o[L()]!=null?o[L()]:o.uz));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const click=f=>{ try{ window.__solar&&window.__solar.click&&window.__solar.click(f); }catch(e){} };
const D2R=Math.PI/180;

const TX={
  title:{uz:'Dunyo rasadxonalari',ru:'Обсерватории мира',en:'Observatories of the world'},
  sub:{uz:'Tosh doiralardan kosmik teleskopgacha — har biri 3D, ichki qismi bilan',ru:'От каменных кругов до космического телескопа — каждая в 3D, с внутренним устройством',en:'From stone circles to a space telescope — each in 3D, inside and out'},
  cats:{ all:{uz:'Hammasi',ru:'Все',en:'All'}, naked:{uz:'Teleskopsiz davr',ru:'До телескопа',en:'Before telescopes'},
    classic:{uz:'Klassik teleskoplar',ru:'Классические телескопы',en:'Classic telescopes'}, modern:{uz:'Zamonaviy',ru:'Современные',en:'Modern'}, space:{uz:'Kosmosda',ru:'В космосе',en:'In space'} },
  cut:{uz:'✂ Kesib ko‘rish',ru:'✂ Разрез',en:'✂ Cutaway'}, domeO:{uz:'🪟 Gumbazni ochish',ru:'🪟 Открыть купол',en:'🪟 Open dome'}, domeC:{uz:'🪟 Gumbazni yopish',ru:'🪟 Закрыть купол',en:'🪟 Close dome'},
  spin:{uz:'⟳ Aylantirish',ru:'⟳ Вращать',en:'⟳ Spin'}, view:{uz:'↺ Umumiy',ru:'↺ Общий вид',en:'↺ Overview'},
  back:{uz:'← Ro‘yxat',ru:'← Список',en:'← List'}, loading:{uz:'Model qurilmoqda…',ru:'Строим модель…',en:'Building the model…'},
  place:{uz:'Joyi',ru:'Место',en:'Location'}, year:{uz:'Yili',ru:'Год',en:'Year'}, instr:{uz:'Asosiy asbob',ru:'Главный инструмент',en:'Main instrument'}, coords:{uz:'Koordinatalar',ru:'Координаты',en:'Coordinates'},
  facts:{uz:'Qiziqarli faktlar',ru:'Интересные факты',en:'Did you know?'},
  hint:{uz:'Sichqoncha bilan aylantiring, g‘ildirakcha bilan yaqinlashtiring.',ru:'Вращайте мышью, приближайте колёсиком.',en:'Drag to rotate, scroll to zoom.'},
  noGl:{uz:'Bu qurilmada 3D ko‘rinish ishlamadi (WebGL yo‘q).',ru:'На этом устройстве 3D недоступно (нет WebGL).',en:'3D is not available on this device (no WebGL).'},
  count:{uz:' ta rasadxona',ru:' обсерваторий',en:' observatories'},
};

/* ======================= 3D dvigatel ======================= */
const E={ ok:false, r:null, sc:null, cam:null, ctl:null, raf:0, last:0, root:null, envObjs:[], disp:[], labels:[], anims:[], domeFns:[],
  domeK:0, domeOpen:false, cut:false, clip:null, cur:null, host:null, ro:null, sun:null, hemi:null, skyU:null, sky:null, spin:false, camGoal:null, t:0 };
let seed=11; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };

function tex(w,h,draw,rep){ const THREE=window.THREE, c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8;
  if(rep){ t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rep[0],rep[1]); } E.disp.push(t); return t; }
// --- Realistik teksturalar: fBm (bir necha masshtabdagi silliq shovqin) + tabiiy palitra; relyef (bump) uchun ham ishlatiladi ---
function fbm(size,oct,persist){ const out=new Float32Array(size*size); let amp=1, tot=0;
  for(let o=0;o<oct;o++){ const n=4<<o, g=new Float32Array(n*n); for(let i=0;i<n*n;i++) g[i]=rnd();
    for(let y=0;y<size;y++){ const fy=y/size*n, y0=fy|0, ty0=fy-y0, ty=ty0*ty0*(3-2*ty0), r0=(y0%n)*n, r1=((y0+1)%n)*n;
      for(let x=0;x<size;x++){ const fx=x/size*n, x0=fx|0, tx0=fx-x0, tx=tx0*tx0*(3-2*tx0), x1=(x0+1)%n, xa=x0%n;
        const a=g[r0+xa], b=g[r0+x1], c=g[r1+xa], d=g[r1+x1]; out[y*size+x]+=amp*((a+(b-a)*tx)+((c+(d-c)*tx)-(a+(b-a)*tx))*ty); } }
    tot+=amp; amp*=persist; }
  for(let i=0;i<out.length;i++) out[i]/=tot; return out; }
const rgb=h=>{ h=String(h).replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join(''); const n=parseInt(h,16); return [n>>16&255,n>>8&255,n&255]; };
function paint(x,size,stops,o){ o=o||{}; const f=fbm(size,o.oct||6,o.persist||0.55), id=x.createImageData(size,size), con=o.contrast||1.6;
  const f2=o.patch?fbm(size,4,0.6):null;
  for(let i=0;i<size*size;i++){ let t=Math.max(0,Math.min(1,(f[i]-0.5)*con+0.5)); if(f2) t=Math.max(0,Math.min(1,t*0.8+(f2[i]-0.5)*0.6+0.1));
    let k=0; while(k<stops.length-2&&t>stops[k+1][0]) k++; const A=stops[k], B=stops[k+1], u=Math.max(0,Math.min(1,(t-A[0])/((B[0]-A[0])||1)));
    const sp=o.speck?(rnd()-0.5)*o.speck:0;
    id.data[i*4]=A[1]+(B[1]-A[1])*u+sp; id.data[i*4+1]=A[2]+(B[2]-A[2])*u+sp; id.data[i*4+2]=A[3]+(B[3]-A[3])*u+sp; id.data[i*4+3]=255; }
  x.putImageData(id,0,0); }
const shade=(c,k)=>c.map(v=>Math.max(0,Math.min(255,v*k)));
function texB(w,h,draw,rep){ const t=tex(w,h,draw,rep); t.userData=t.userData||{}; t.userData.bump=true; return t; }   // r128 teksturasida userData yo'q
const X={
  // tosh/beton: asosiy rang atrofida tabiiy dog'lar; spots — lishaynik/mox dog'lari
  noise(base,amt,rep,spots){ const b=rgb(base), a=Math.max(0.04,amt||0.2); return texB(256,256,(x,w)=>{ paint(x,w,[[0,...shade(b,1-a*1.6)],[0.45,...b],[1,...shade(b,1+a*0.9)]],{ oct:6, speck:22 });
    if(spots) for(let i=0;i<spots.n;i++){ x.globalAlpha=0.08+rnd()*0.22; x.fillStyle=spots.c; const cx=rnd()*w, cy=rnd()*w; for(let k=0;k<6;k++){ x.beginPath(); x.arc(cx+(rnd()-0.5)*spots.r*2,cy+(rnd()-0.5)*spots.r*2,1+rnd()*spots.r*0.7,0,7); x.fill(); } }
    x.globalAlpha=1; },rep||[1,1]); },
  brick(c1,mortar,rep){ const b=rgb(c1); return texB(256,256,(x,w,h)=>{ x.fillStyle=mortar; x.fillRect(0,0,w,h); const bh=16, bw=44;
    for(let r=0;r*bh<h;r++) for(let c=-1;c*bw<w;c++){ const k=0.82+rnd()*0.3; x.fillStyle='rgb('+shade(b,k).join(',')+')'; x.fillRect(c*bw+(r%2?bw/2:0)+1.5,r*bh+1.5,bw-3,bh-3); }
    const f=fbm(w,5,0.6), id=x.getImageData(0,0,w,h); for(let i=0;i<w*h;i++){ const k=0.8+f[i]*0.4+(rnd()-0.5)*0.08; for(let j=0;j<3;j++) id.data[i*4+j]=Math.min(255,id.data[i*4+j]*k); } x.putImageData(id,0,0); },rep||[1,1]); },
  blocks(base,line,rep,rows,cols){ const b=rgb(base); return texB(256,256,(x,w,h)=>{ paint(x,w,[[0,...shade(b,0.78)],[0.5,...b],[1,...shade(b,1.12)]],{ oct:6, speck:18 }); const rh=h/(rows||6), cw=w/(cols||4);
    for(let r=0;r<(rows||6);r++) for(let c=-1;c<=(cols||4);c++){ const v=rnd()*0.16-0.08; x.fillStyle=v>0?'rgba(255,255,255,'+v+')':'rgba(0,0,0,'+(-v)+')'; x.fillRect(c*cw+(r%2?cw/2:0),r*rh,cw,rh); }
    x.strokeStyle=line; x.lineWidth=2; for(let r=0;r<=(rows||6);r++){ x.beginPath(); x.moveTo(0,r*rh); x.lineTo(w,r*rh); x.stroke(); for(let c=-1;c<=(cols||4);c++){ x.beginPath(); x.moveTo(c*cw+(r%2?cw/2:0),r*rh); x.lineTo(c*cw+(r%2?cw/2:0),(r+1)*rh); x.stroke(); } } },rep||[1,1]); },
  panels(base,seam,n,rings,rep){ return tex(512,256,(x,w,h)=>{ const b=rgb(base); paint(x,256,[[0,...shade(b,0.93)],[1,...b]],{ oct:4 }); x.drawImage(x.canvas,0,0,256,256,0,0,w,h); x.strokeStyle=seam; x.lineWidth=1.5;
    for(let i=0;i<n;i++){ x.beginPath(); x.moveTo(i*w/n,0); x.lineTo(i*w/n,h); x.stroke(); } for(let j=1;j<rings;j++){ x.beginPath(); x.moveTo(0,j*h/rings); x.lineTo(w,j*h/rings); x.stroke(); } },rep||[1,1]); },
  // o't: xira zaytun-yashil, quruq dog'lar, mayda o't tolalari
  grass(rep){ return texB(512,512,(x,w,h)=>{ paint(x,w,[[0,38,50,26],[0.35,60,76,38],[0.62,82,94,48],[0.8,112,112,64],[1,142,132,88]],{ oct:7, persist:0.58, speck:26, patch:true });
    for(let i=0;i<9000;i++){ const g=rnd(); x.fillStyle=g<0.5?'rgba(20,30,12,'+(0.15+rnd()*0.2)+')':'rgba(170,170,110,'+(0.06+rnd()*0.12)+')'; x.fillRect(rnd()*w,rnd()*h,1,1+rnd()*3); } },rep||[40,40]); },
  // tuproq/qum/tosh yer: asosiy rang, qoramtir chuqurliklar, mayda toshlar
  ground(base,amt,rep){ const b=rgb(base), a=amt||0.18; return texB(512,512,(x,w,h)=>{ paint(x,w,[[0,...shade(b,1-a*2.2)],[0.4,...shade(b,0.94)],[0.7,...b],[1,...shade(b,1+a*0.9)]],{ oct:7, persist:0.6, speck:24, patch:true });
    for(let i=0;i<2600;i++){ const r=0.6+rnd()*1.8, cx=rnd()*w, cy=rnd()*h; x.fillStyle='rgba(0,0,0,'+(0.12+rnd()*0.18)+')'; x.beginPath(); x.arc(cx+0.6,cy+0.6,r,0,7); x.fill(); x.fillStyle='rgba('+shade(b,1.15+rnd()*0.2).join(',')+',0.7)'; x.beginPath(); x.arc(cx,cy,r*0.85,0,7); x.fill(); } },rep||[40,40]); },
  bark(){ return texB(128,256,(x,w,h)=>{ paint(x,128,[[0,40,30,22],[0.5,74,58,42],[1,104,88,66]],{ oct:5, speck:20 }); x.drawImage(x.canvas,0,0,128,128,0,128,128,128); for(let i=0;i<40;i++){ x.strokeStyle='rgba(20,14,8,.45)'; x.lineWidth=1+rnd()*2; const xx=rnd()*w; x.beginPath(); x.moveTo(xx,0); x.bezierCurveTo(xx+rnd()*8-4,h/3,xx+rnd()*8-4,h*0.66,xx+rnd()*6-3,h); x.stroke(); } },[1,2]); },
  leaves(c){ const b=rgb(c); return texB(256,256,(x,w)=>{ paint(x,w,[[0,...shade(b,0.45)],[0.5,...b],[1,...shade(b,1.35)]],{ oct:6, persist:0.65, speck:40, contrast:2.2 }); },[2,2]); },
};
// Teksturasiz sirtlarga yengil eskirish/chang qatlami — "plastik", multfilmdek tekislik yo'qoladi
function grime(){ if(!E.grime) E.grime=texB(256,256,(x,w)=>{ paint(x,w,[[0,216,214,210],[0.5,238,237,234],[1,252,252,252]],{ oct:6, persist:0.6, speck:8, patch:true }); },[2,2]); return E.grime; }
function M(o){ const THREE=window.THREE; o=o||{};
  if(!o.map&&!o.clean){ o=Object.assign({},o,{ map:grime(), bump:o.bump!=null?o.bump:0.12 }); }
  const m=new THREE.MeshStandardMaterial({ color:o.color!=null?o.color:0xffffff, map:o.map||null, roughness:o.rough!=null?o.rough:0.8, metalness:o.metal||0,
    side:o.side||THREE.FrontSide, transparent:!!o.transparent, opacity:o.opacity!=null?o.opacity:1, emissive:o.emissive!=null?o.emissive:0x000000, emissiveIntensity:o.ei!=null?o.ei:1, flatShading:!!o.flat, vertexColors:!!o.vc });
  // r128: hex ranglar chiziqli deb olinadi va oqarib chiqadi — sRGB dan o'tkazamiz (rang yozilganidek ko'rinsin)
  m.color.convertSRGBToLinear(); m.emissive.convertSRGBToLinear();
  if(m.map&&m.map.userData&&m.map.userData.bump&&o.bump!==0){ m.bumpMap=m.map; m.bumpScale=o.bump!=null?o.bump:0.45; }
  if(o.env!=null) m.envMapIntensity=o.env;
  if(o.clip){ m.clippingPlanes=[E.clip]; m.clipShadows=true; } return m; }
function mesh(geo,mat,pos,rot,parent,noShadow){ const THREE=window.THREE, m=new THREE.Mesh(geo,mat); if(pos) m.position.set(pos[0],pos[1],pos[2]); if(rot) m.rotation.set(rot[0]||0,rot[1]||0,rot[2]||0);
  if(!noShadow){ m.castShadow=true; m.receiveShadow=true; } (parent||E.root).add(m); return m; }
// Tosh kabi notekislik: bir xil nuqtadagi barcha uchlar bir xil siljiydi (yoriq paydo bo'lmaydi)
function jitter(geo,a){ const p=geo.attributes.position, h=(x,y,z,k)=>{ const s=Math.sin(x*12.9898+y*78.233+z*37.719+k*11.3)*43758.5453; return (s-Math.floor(s))-0.5; };
  for(let i=0;i<p.count;i++){ const x=p.getX(i), y=p.getY(i), z=p.getZ(i); p.setXYZ(i,x+h(x,y,z,1)*a,y+h(x,y,z,2)*a,z+h(x,y,z,3)*a); } geo.computeVertexNormals(); return geo; }
function lbl(text,pos){ const el=document.createElement('div'); el.className='obsw-lbl'; el.textContent=T(text); E.host.querySelector('.obsw-lbls').appendChild(el);
  E.labels.push({ el, p:new window.THREE.Vector3(pos[0],pos[1],pos[2]), t:text }); }

/* --- Qurilish bloklari --- */
// Gumbazli bino: silindr devor + yarim shar gumbaz, tirqish (slit) qopqog'i yon tomonga suriladi. setOpen(0..1), dome — buriladigan guruh
function domeHouse(o){ const THREE=window.THREE, g=new THREE.Group(), r=o.r, h=o.h, sh=o.slit||0.28;
  const wallM=M({ map:o.wallMap||X.noise('#'+(o.wall!=null?o.wall:0xf2f2ee).toString(16).padStart(6,'0'),0.06,[6,2]), rough:0.75, clip:true, bump:0.15 });
  mesh(new THREE.CylinderGeometry(r,r,h,72,1,true),wallM,[0,h/2,0],null,g);
  mesh(new THREE.CylinderGeometry(r*0.97,r*0.97,h,72,1,true),M({ color:o.inner!=null?o.inner:0x5a6070, rough:0.9, side:THREE.BackSide, clip:true }),[0,h/2,0],null,g);
  mesh(new THREE.CylinderGeometry(r,r,0.3,72),M({ color:o.floor!=null?o.floor:0x6d6f76, rough:0.9, clip:true }),[0,0.15,0],null,g);
  const dome=new THREE.Group(); dome.position.y=h; g.add(dome);
  const dHex='#'+(o.dome!=null?o.dome:0xffffff).toString(16).padStart(6,'0');
  const dM=M({ map:o.domeMap||X.panels(dHex,'rgba(60,64,72,.35)',24,4,[1,1]), rough:0.32, metal:o.domeMetal!=null?Math.max(0.25,o.domeMetal):0.3, side:THREE.DoubleSide, clip:true, env:1.1 });
  mesh(new THREE.SphereGeometry(r,72,24,sh,Math.PI*2-2*sh,0,Math.PI/2),dM,null,null,dome);
  const shut=new THREE.Group(); dome.add(shut);
  mesh(new THREE.SphereGeometry(r*1.012,16,24,-sh,2*sh,0,Math.PI/2),dM,null,null,shut);
  mesh(new THREE.TorusGeometry(r,0.04*r,8,72),M({ color:o.ring!=null?o.ring:0x9aa0aa, rough:0.5, metal:0.5, clip:true }),[0,0,0],[Math.PI/2,0,0],dome);
  // gumbaz ichidagi yumshoq yoritgich (shom/tunda ham ichki qism ko'rinsin)
  const lamp=new THREE.PointLight(0xffe2b8,o.light!=null?o.light:0.9,r*3.2,1.6); lamp.position.set(0,h*0.85,0); g.add(lamp);
  g.userData.setOpen=k=>{ shut.rotation.y=k*(2*sh+0.12); };
  g.userData.dome=dome; return g; }
// Refraktor (linzali) ekvatorial montirovkada: lat — kenglik (qutb o'qi og'ishi), L — truba uzunligi, D — obyektiv diametri
function refractor(o){ const THREE=window.THREE, g=new THREE.Group(), L=o.L, D=o.D, ph=o.pier||L*0.35, lat=o.lat||45;
  const pierM=M({ color:o.pierColor!=null?o.pierColor:0x50463e, rough:0.8, clip:o.clip }), metal=M({ color:o.color!=null?o.color:0x1d2a3d, rough:0.35, metal:0.6, clip:o.clip }), brass=M({ color:0xb08d4a, rough:0.35, metal:0.85, clip:o.clip });
  mesh(new THREE.CylinderGeometry(D*0.9,D*1.4,ph,24),pierM,[0,ph/2,0],null,g);
  const polar=new THREE.Group(); polar.position.y=ph; polar.rotation.x=-(90-lat)*D2R; g.add(polar);
  mesh(new THREE.CylinderGeometry(D*0.35,D*0.35,D*2.6,16),brass,[0,D*0.6,0],null,polar);
  const dec=new THREE.Group(); dec.position.y=D*1.9; polar.add(dec); dec.rotation.y=o.ha!=null?o.ha:0.5;
  mesh(new THREE.CylinderGeometry(D*0.28,D*0.28,D*3.2,16),brass,[0,0,0],[0,0,Math.PI/2],dec);
  mesh(new THREE.CylinderGeometry(D*0.55,D*0.55,D*0.9,16),metal,[-D*2.0,0,0],[0,0,Math.PI/2],dec);
  const tube=new THREE.Group(); tube.position.x=D*1.1; dec.add(tube); tube.rotation.z=o.decl!=null?o.decl:0.35;
  mesh(new THREE.CylinderGeometry(D*0.62,D*0.5,L,32,1,false),metal,[0,L*0.18,0],[0,0,0],tube);
  mesh(new THREE.CylinderGeometry(D*0.66,D*0.66,L*0.08,32,1,true),brass,[0,L*0.18+L*0.48,0],null,tube);
  mesh(new THREE.CircleGeometry(D*0.6,32),M({ clean:true, color:0x9ec6ff, rough:0.05, metal:0.2, emissive:0x1a3355, ei:0.6, transparent:true, opacity:0.85, clip:o.clip }),[0,L*0.18+L*0.5-0.01,0],[-Math.PI/2,0,0],tube);
  mesh(new THREE.CylinderGeometry(D*0.12,D*0.12,L*0.08,12),brass,[0,L*0.18-L*0.5-L*0.03,0],null,tube);
  g.userData.tube=tube; return g; }
// Reflektor (ko'zguli): Serrurier panjarali truba, mount: 'horseshoe' | 'fork' | 'altaz'
function reflector(o){ const THREE=window.THREE, g=new THREE.Group(), D=o.D, L=o.L, lat=o.lat||35;
  const steel=M({ color:o.color!=null?o.color:0x6e7a88, rough:0.45, metal:0.6, clip:o.clip }), dark=M({ color:0x2a2f38, rough:0.6, metal:0.4, clip:o.clip });
  const mirM=M({ clean:true, color:o.mirror!=null?o.mirror:0xdfe8f0, rough:0.25, metal:0.55, emissive:0x223344, ei:0.4, clip:o.clip });
  const tube=new THREE.Group();
  mesh(new THREE.CylinderGeometry(D*0.6,D*0.6,D*0.22,48),dark,[0,0,0],null,tube);
  mesh(new THREE.CylinderGeometry(D*0.5,D*0.5,0.06*D,48),mirM,[0,D*0.12,0],null,tube);
  const top=L; mesh(new THREE.TorusGeometry(D*0.6,D*0.04,8,48),steel,[0,top,0],[Math.PI/2,0,0],tube);
  mesh(new THREE.TorusGeometry(D*0.6,D*0.05,8,48),steel,[0,L*0.42,0],[Math.PI/2,0,0],tube);
  for(let i=0;i<8;i++){ const a=i/8*Math.PI*2, b=(i+(i%2?1:-1))/8*Math.PI*2, y0=i<8?(0.1*D):0, p1=new THREE.Vector3(Math.cos(a)*D*0.6,y0,Math.sin(a)*D*0.6), p2=new THREE.Vector3(Math.cos(b)*D*0.6,L*0.42,Math.sin(b)*D*0.6);
    [[p1,p2],[p2.clone(),new THREE.Vector3(Math.cos(a)*D*0.6,top,Math.sin(a)*D*0.6)]].forEach(([q1,q2])=>{ const len=q1.distanceTo(q2), m=mesh(new THREE.CylinderGeometry(D*0.025,D*0.025,len,8),steel,null,null,tube);
      m.position.copy(q1).add(q2).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q2.clone().sub(q1).normalize()); }); }
  mesh(new THREE.CylinderGeometry(D*0.12,D*0.12,D*0.25,16),dark,[0,top,0],null,tube);
  for(let i=0;i<4;i++){ const a=i/4*Math.PI*2; mesh(new THREE.BoxGeometry(D*0.01,D*0.01,D*0.6),steel,[Math.cos(a)*D*0.3,top,Math.sin(a)*D*0.3],[0,-a,0],tube); }
  const mount=o.mount||'fork';
  if(mount==='horseshoe'){ // Palomar: qutb o'qiga og'gan taqasimon halqa va uzun ramka
    const ax=new THREE.Group(); ax.rotation.x=-(90-lat)*D2R; ax.position.y=o.axisH||D*1.6; g.add(ax);
    mesh(new THREE.TorusGeometry(D*1.45,D*0.16,12,64,Math.PI*1.45),steel,[0,D*1.1,0],[0,Math.PI/2,Math.PI*0.775],ax);
    [-1,1].forEach(s=>mesh(new THREE.BoxGeometry(D*0.25,D*2.8,D*0.25),steel,[s*D*1.35,0,0],null,ax));
    mesh(new THREE.BoxGeometry(D*2.9,D*0.25,D*0.25),steel,[0,-D*1.3,0],null,ax);
    const hold=new THREE.Group(); ax.add(hold); hold.rotation.x=0.25; hold.add(tube); tube.position.y=-L*0.42;
    [[-1.6,-1],[1.6,-1]].forEach(([sx])=>mesh(new THREE.BoxGeometry(D*0.5,o.axisH||D*1.6,D*0.6),M({ color:0x9aa3ad, rough:0.8, clip:o.clip }),[sx*D,(o.axisH||D*1.6)/2,0],null,g));
    g.userData.point=k=>{ hold.rotation.x=0.25+k*0.35; };
  } else if(mount==='altaz'){ // Keck: aylanuvchi taglik va U-shaklidagi bo'yinturuq
    const az=new THREE.Group(); az.position.y=o.axisH||D*0.9; g.add(az);
    mesh(new THREE.CylinderGeometry(D*0.9,D*1.0,D*0.25,48),dark,[0,-D*0.1,0],null,az);
    [-1,1].forEach(s=>mesh(new THREE.BoxGeometry(D*0.18,D*1.1,D*0.5),steel,[s*D*0.75,D*0.5,0],null,az));
    const el=new THREE.Group(); el.position.y=D*0.95; az.add(el); el.add(tube); tube.position.y=-D*0.2; el.rotation.x=-0.5;
    mesh(new THREE.CylinderGeometry(D*1.1,D*1.2,o.axisH||D*0.9,48),M({ color:0x8b929c, rough:0.8, clip:o.clip }),[0,(o.axisH||D*0.9)/2,0],null,g);
    g.userData.point=k=>{ el.rotation.x=-0.5-k*0.35; az.rotation.y=k*0.6; };
  } else { // vilkali (fork) — o'rta teleskoplar
    const ax=new THREE.Group(); ax.rotation.x=-(90-lat)*D2R; ax.position.y=o.axisH||D*1.5; g.add(ax);
    mesh(new THREE.CylinderGeometry(D*0.5,D*0.55,D*0.3,32),dark,[0,-D*0.15,0],null,ax);
    [-1,1].forEach(s=>mesh(new THREE.BoxGeometry(D*0.14,D*1.2,D*0.35),steel,[s*D*0.72,D*0.55,0],null,ax));
    const el=new THREE.Group(); el.position.y=D*1.0; ax.add(el); el.add(tube); tube.position.y=-L*0.35; el.rotation.x=0.4;
    mesh(new THREE.CylinderGeometry(D*0.45,D*0.7,o.axisH||D*1.5,24),M({ color:0x9aa3ad, rough:0.8, clip:o.clip }),[0,(o.axisH||D*1.5)/2,0],null,g);
    g.userData.point=k=>{ el.rotation.x=0.4+k*0.3; };
  }
  return g; }
// Olti burchakli segmentli ko'zgu (Keck — 36, JWST — 18): halqalar soni, segment "radiusi", rang
function hexMirror(o){ const THREE=window.THREE, g=new THREE.Group(), s=o.s, gap=o.gap||0.02*s, f=o.f||s*20;
  const mat=M({ clean:true, color:o.color!=null?o.color:0xd8e2ea, rough:o.rough!=null?o.rough:0.3, metal:o.metal!=null?o.metal:0.55, emissive:o.emissive!=null?o.emissive:0x111111, ei:0.6, clip:o.clip });
  const cells=[]; for(let q=-o.rings;q<=o.rings;q++) for(let r=-o.rings;r<=o.rings;r++){ const ss=-q-r, d=Math.max(Math.abs(q),Math.abs(r),Math.abs(ss)); if(d===0||d>o.rings) continue; cells.push([q,r]); }
  const geo=new THREE.CylinderGeometry(s-gap,s-gap,s*0.08,6);
  cells.forEach(([q,r])=>{ const x=(s*Math.sqrt(3))*(q+r/2), z=s*1.5*r, rr=x*x+z*z; mesh(geo,mat,[x,rr/(4*f),z],[0,Math.PI/6,0],g); });
  g.userData.count=cells.length; return g; }
// Parabolik radio-antenna: D — diametr, depth — chuqurlik; feed — qabul qiluvchi
function dish(o){ const THREE=window.THREE, g=new THREE.Group(), R=o.D/2, d=o.depth||o.D*0.18, n=24, pts=[];
  for(let i=0;i<=n;i++){ const r=i/n*R; pts.push(new THREE.Vector2(Math.max(0.001,r),r*r/(R*R)*d)); }
  mesh(new THREE.LatheGeometry(pts,64),M({ color:o.color!=null?o.color:0xf3f4f6, rough:0.45, metal:0.2, side:THREE.DoubleSide, clip:o.clip }),null,null,g);
  const f=R*R/(4*d), legM=M({ color:0xd5d8dd, rough:0.5, metal:0.3, clip:o.clip });
  for(let i=0;i<4;i++){ const a=i/4*Math.PI*2+Math.PI/4, p1=new THREE.Vector3(Math.cos(a)*R*0.62,(R*0.62)*(R*0.62)/(R*R)*d,Math.sin(a)*R*0.62), p2=new THREE.Vector3(0,f,0);
    const m=mesh(new THREE.CylinderGeometry(R*0.012,R*0.012,p1.distanceTo(p2),6),legM,null,null,g); m.position.copy(p1).add(p2).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p2.clone().sub(p1).normalize()); }
  mesh(new THREE.CylinderGeometry(R*0.06,R*0.04,R*0.14,16),M({ color:0x9aa0a8, rough:0.5, metal:0.5, clip:o.clip }),[0,f,0],null,g);
  return g; }

/* --- Muhit: osmon, yer/relyef, yorug'lik --- */
function buildEnv(env){ const THREE=window.THREE, sc=E.sc;
  E.envObjs.forEach(o=>{ sc.remove(o); }); E.envObjs=[];
  const add=o=>{ sc.add(o); E.envObjs.push(o); return o; };
  const kind=env.sky||'day', sunDir=new THREE.Vector3().setFromSphericalCoords(1,(90-(env.sunAlt!=null?env.sunAlt:45))*D2R,(env.sunAz!=null?env.sunAz:135)*D2R);
  // setFromSphericalCoords: theta — y o'qi atrofida, +z dan +x ga. Azimut: 0 — shimol (−z), 90 — sharq (+x)
  sunDir.set(Math.sin((env.sunAz!=null?env.sunAz:135)*D2R)*Math.cos((env.sunAlt!=null?env.sunAlt:45)*D2R), Math.sin((env.sunAlt!=null?env.sunAlt:45)*D2R), -Math.cos((env.sunAz!=null?env.sunAz:135)*D2R)*Math.cos((env.sunAlt!=null?env.sunAlt:45)*D2R));
  E.skyU={ uSun:{ value:sunDir.clone() }, uDay:{ value:kind==='day'?1:kind==='dusk'?0.45:0 }, uSpace:{ value:kind==='space'?1:0 } };
  E.sky=add(new THREE.Mesh(new THREE.SphereGeometry(4000,48,24),new THREE.ShaderMaterial({ uniforms:E.skyU, side:THREE.BackSide, depthWrite:false,
    vertexShader:'varying vec3 vD; void main(){ vD=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:[
      'uniform vec3 uSun; uniform float uDay; uniform float uSpace; varying vec3 vD;',
      'float hs(vec3 p){ return fract(sin(dot(p,vec3(12.9898,78.233,45.164)))*43758.5453); }',
      'void main(){ vec3 d=normalize(vD); vec3 s=normalize(uSun); float up=clamp(d.y,0.0,1.0);',
      ' vec3 zen=mix(vec3(0.008,0.012,0.04),vec3(0.10,0.27,0.62),uDay);',
      ' vec3 hor=mix(vec3(0.03,0.045,0.1),vec3(0.62,0.77,0.92),uDay);',
      ' float dusk=uDay*(1.0-uDay)*4.0; float tow=max(dot(normalize(vec3(d.x,0.0,d.z)+1e-4),normalize(vec3(s.x,0.0,s.z)+1e-4)),0.0);',
      ' hor=mix(hor,vec3(1.0,0.5,0.22),dusk*0.8*(0.3+0.7*tow));',
      ' vec3 c=mix(hor,zen,pow(up,0.5)); c=mix(c,hor*1.06+vec3(0.03),exp(-up*9.0)*0.55*uDay); if(d.y<0.0) c=mix(hor*1.02,hor*0.55,clamp(-d.y*3.0,0.0,1.0)*(1.0-uDay*0.8));',
      ' float sd=max(dot(d,s),0.0); c+=vec3(1.0,0.92,0.75)*(smoothstep(0.9994,0.9997,sd)*5.0*(1.0-uSpace*0.2)+pow(sd,30.0)*0.25*uDay+pow(sd,6.0)*0.12*dusk);',
      ' float st=step(0.9975-0.0015*uSpace,hs(floor(d*360.0)))*(1.0-uDay); if(uSpace<0.5) st*=up; c+=vec3(st)*(0.6+0.4*hs(floor(d*361.0)));',
      ' float mw=exp(-pow(dot(d,normalize(vec3(0.3,0.6,-0.74)))*5.0,2.0))*(1.0-uDay)*0.09; c+=vec3(0.55,0.6,0.8)*mw*(uSpace>0.5?1.0:up);',
      ' if(uSpace>0.5) c=mix(vec3(0.0),c,1.0)*vec3(1.0) + vec3(0.0); gl_FragColor=vec4(c,1.0); }'].join('\n') })));
  E.sky.renderOrder=-1;
  E.hemi=add(new THREE.HemisphereLight(env.hemiSky!=null?env.hemiSky:0xbfd6ff, env.hemiGround!=null?env.hemiGround:0x5b4b38, kind==='day'?0.32:kind==='dusk'?0.26:kind==='space'?0.12:0.22));
  const sun=new THREE.DirectionalLight(kind==='dusk'?0xffc58a:0xfff0dc, kind==='day'?1.8:kind==='dusk'?1.4:kind==='space'?2.2:0.55);
  if(kind==='night'){ sun.color.set(0x9fb4ff); }
  sun.position.copy(sunDir).multiplyScalar(env.shadow?env.shadow*2.2:220); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  const ss=env.shadow||90, c=sun.shadow.camera; c.left=-ss; c.right=ss; c.top=ss; c.bottom=-ss; c.near=1; c.far=ss*5; sun.shadow.bias=-0.0006; sun.shadow.normalBias=0.04*Math.max(1,ss/45);   // katta sahnada soya "nuqtalari" chiqmasin
  add(sun); add(sun.target); E.sun=sun; E.sunBase=sun.intensity;
  E.r.toneMappingExposure=kind==='night'?1.2:kind==='space'?1.05:0.95;
  if(kind!=='space'){ // yer yoki relyef
    const size=env.size||900, gt=env.ground||'sand';
    const map=gt==='grass'?X.grass([size/26,size/26]):X.ground(env.groundColor||'#b99d70',0.18,[size/45,size/45]);
    let geo;
    if(env.terrain){ geo=new THREE.PlaneGeometry(size,size,env.seg||160,env.seg||160); geo.rotateX(-Math.PI/2); const p=geo.attributes.position;
      for(let i=0;i<p.count;i++) p.setY(i,env.terrain(p.getX(i),p.getZ(i))); geo.computeVertexNormals(); }
    else { geo=new THREE.CircleGeometry(size/2,96); geo.rotateX(-Math.PI/2); }
    const gm=add(new THREE.Mesh(geo,M({ map, color:env.groundTint!=null?env.groundTint:0xffffff, rough:1, env:0.35, bump:0.9 }))); gm.receiveShadow=true;
  }
  // Muhit yoritilishi: osmon (va yer rangi) PMREM orqali atrofdan keladigan yorug'likka aylanadi — metall, bo'yoq, shisha osmonni aks ettiradi
  if(E.envRT){ E.envRT.dispose(); E.envRT=null; }
  // (osmon sheyderidan to'g'ridan-to'g'ri PMREM qilinganda NaN chiqib, sahna qorayardi — shuning uchun oddiy panorama rasmidan)
  try{ const W=256, Hh=128, cv=document.createElement('canvas'); cv.width=W; cv.height=Hh; const x=cv.getContext('2d');
    const P={ day:['#3f74c4','#9cc0e6','#d9e6f2'], dusk:['#2a2c4a','#b77a6a','#f0a070'], night:['#03060f','#0b1226','#141c33'], space:['#000000','#020306','#05070c'] }[kind];
    const gcol=kind==='space'?'#000000':(env.ground==='grass'?'#4b5a34':(env.groundColor||'#b99d70'));
    let g=x.createLinearGradient(0,0,0,Hh/2); g.addColorStop(0,P[0]); g.addColorStop(0.75,P[1]); g.addColorStop(1,P[2]); x.fillStyle=g; x.fillRect(0,0,W,Hh/2);
    g=x.createLinearGradient(0,Hh/2,0,Hh); g.addColorStop(0,gcol); g.addColorStop(1,'#000000'); x.fillStyle=g; x.globalAlpha=kind==='day'?0.9:0.6; x.fillRect(0,Hh/2,W,Hh/2); x.globalAlpha=1;
    // Quyosh dog'i (yo'nalishi bo'yicha)
    const az=(env.sunAz!=null?env.sunAz:135), al=(env.sunAlt!=null?env.sunAlt:45), sx=((az/360)+0.75)%1*W, sy=(0.5-al/180)*Hh;
    const rg=x.createRadialGradient(sx,sy,0,sx,sy,18); rg.addColorStop(0,'rgba(255,248,230,1)'); rg.addColorStop(1,'rgba(255,230,180,0)'); x.fillStyle=rg; x.fillRect(sx-18,sy-18,36,36);
    const et=new THREE.CanvasTexture(cv); et.mapping=THREE.EquirectangularReflectionMapping; et.encoding=THREE.sRGBEncoding;
    const pm=new THREE.PMREMGenerator(E.r); E.envRT=pm.fromEquirectangular(et); pm.dispose(); et.dispose(); sc.environment=E.envRT.texture; }catch(e){ sc.environment=null; }
  // Havo pardasi: uzoqdagi narsalar ufq rangiga singadi (masofa hissi)
  const fogCol={ day:0xaec4da, dusk:0x8a7c82, night:0x0b1122 }[kind];
  if(env.fog===false||kind==='space'||!fogCol) sc.fog=null;
  else { const size=env.size||900; sc.fog=new THREE.Fog(new THREE.Color(env.fogColor||fogCol).convertSRGBToLinear(), size*(env.fogNear!=null?env.fogNear:0.06), size*(env.fogFar!=null?env.fogFar:0.47)); }
}
// Daraxtlar: tabiiy, notekis shakl (barglar to'dasi / qarag'ay qatlamlari); geometriya va materiallar bir sahnada umumiy
function treeKit(){ if(E.tkit) return E.tkit; const THREE=window.THREE;
  E.tkit={ bark:M({ map:X.bark(), rough:0.95, bump:0.8 }),
    leafM:['#3f5a2a','#4d6630','#35502a'].map(c=>M({ map:X.leaves(c), rough:0.92, bump:0.9, env:0.4 })),
    needleM:['#25361f','#2d4026'].map(c=>M({ map:X.leaves(c), rough:0.95, bump:0.9, env:0.4 })),
    blobs:[0,1,2].map(()=>jitter(new THREE.IcosahedronGeometry(1,2),0.3)), cones:[0,1].map(()=>jitter(new THREE.ConeGeometry(1,1.6,11,4),0.1)),
    trunk:new THREE.CylinderGeometry(0.16,0.3,1,8) }; return E.tkit; }
function tree(kind,x,y,z,s,parent){ const THREE=window.THREE, k=treeKit(), g=new THREE.Group(); g.position.set(x,y,z); g.rotation.y=rnd()*6.28; (parent||E.root).add(g); s=s||1;
  if(kind==='pine'){ const h=(9+rnd()*6)*s; mesh(k.trunk,k.bark,[0,h*0.25,0],null,g).scale.set(s*1.3,h*0.5,s*1.3);
    const m=k.needleM[(rnd()*2)|0]; for(let i=0;i<5;i++){ const f=i/5, r=(2.7-1.9*f)*s*(0.88+rnd()*0.24), hh=(3.3-1.4*f)*s;
      mesh(k.cones[i%2],m,[(rnd()-0.5)*0.25*s,h*0.26+f*h*0.62,(rnd()-0.5)*0.25*s],null,g).scale.set(r,hh,r); } }
  else { const h=(3.6+rnd()*2.4)*s; mesh(k.trunk,k.bark,[0,h*0.5,0],null,g).scale.set(s*1.5,h,s*1.5);
    const m=k.leafM[(rnd()*3)|0]; for(let i=0;i<7;i++){ const a=rnd()*6.28, r=(0.4+rnd()*1.4)*s, sc=(1.3+rnd()*1.1)*s;
      mesh(k.blobs[i%3],m,[Math.cos(a)*r,h+(rnd()*1.8-0.2)*s,Math.sin(a)*r],null,g).scale.set(sc,sc*(0.72+rnd()*0.3),sc); } }
  return g; }
// Relyef yordamchisi: tepalik/vodiy shakllari
const terrain={ noise(x,z,f){ return Math.sin(x*f*1.3+Math.cos(z*f*0.7))*0.5+Math.sin(z*f*1.1+x*f*0.3)*0.5; } };

// Quyoshni qayta joylash (azimut 0 — shimol, 90 — sharq; balandlik gradusda)
function setSun(az,alt){ if(!E.sun) return; const v=new window.THREE.Vector3(Math.sin(az*D2R)*Math.cos(alt*D2R),Math.sin(alt*D2R),-Math.cos(az*D2R)*Math.cos(alt*D2R));
  E.skyU.uSun.value.copy(v); const ss=E.sun.shadow.camera.right; E.sun.position.copy(v).multiplyScalar(ss*2.2); E.sun.intensity=E.sunBase*Math.max(0,Math.min(1,(alt+2)/8)); }

/* ======================= Ko'rgich ======================= */
function engineInit(host){ const THREE=window.THREE; if(!THREE||!THREE.OrbitControls) return false;
  const cv=host.querySelector('canvas'); let r; try{ r=new THREE.WebGLRenderer({ canvas:cv, antialias:true, powerPreference:'high-performance' }); }catch(e){ return false; }
  E.r=r; E.host=host; r.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); r.shadowMap.enabled=true; r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.localClippingEnabled=true; r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping;
  E.sc=new THREE.Scene(); E.cam=new THREE.PerspectiveCamera(42,1.6,0.2,12000);
  E.ctl=new THREE.OrbitControls(E.cam,cv); E.ctl.enableDamping=true; E.ctl.dampingFactor=0.08; E.ctl.autoRotateSpeed=0.8;
  E.ctl.addEventListener('start',()=>{ E.camGoal=null; });
  E.clip=new THREE.Plane(new THREE.Vector3(-1,0,0),1e5);
  const resize=()=>{ const w=host.clientWidth, h=host.clientHeight||Math.round(w*0.6); r.setSize(w,h,false); E.cam.aspect=w/Math.max(1,h); E.cam.updateProjectionMatrix(); };
  resize(); E.ro=new ResizeObserver(resize); E.ro.observe(host);
  E.ok=true; return true; }
function clearModel(){ const THREE=window.THREE; if(!E.sc) return;
  if(E.root){ E.root.traverse(o=>{ if(o.geometry) o.geometry.dispose(); const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(m=>{ if(m.map&&E.disp.indexOf(m.map)<0) m.map.dispose(); m.dispose(); }); }); E.sc.remove(E.root); }
  E.envObjs.forEach(o=>{ E.sc.remove(o); if(o.geometry) o.geometry.dispose(); if(o.material){ if(o.material.map&&E.disp.indexOf(o.material.map)<0) o.material.map.dispose(); o.material.dispose(); } }); E.envObjs=[];
  E.disp.forEach(t=>t.dispose()); E.disp=[];
  E.labels.forEach(l=>l.el.remove()); E.labels=[]; E.anims=[]; E.domeFns=[]; E.root=null; E.tkit=null; E.grime=null; }
function loadModel(m){ const THREE=window.THREE; clearModel(); seed=11;
  E.cur=m; E.domeK=0; E.domeOpen=false; E.cut=false; E.clip.constant=1e5; E.t=0;
  E.root=new THREE.Group(); E.sc.add(E.root);
  E.clip.constant=1e5; buildEnv(m.env||{});
  const ctx={ THREE, root:E.root, M, X, mesh, jitter, lbl, D2R, rnd, domeHouse, refractor, reflector, hexMirror, dish, terrain,
    anim:fn=>E.anims.push(fn), onDome:fn=>E.domeFns.push(fn), sun:setSun, tex, tree };
  const res=m.build(ctx)||{};
  E.home={ pos:new THREE.Vector3().fromArray(res.cam||[60,30,60]), tgt:new THREE.Vector3().fromArray(res.tgt||[0,5,0]) };
  E.cam.position.copy(E.home.pos); E.ctl.target.copy(E.home.tgt); E.ctl.maxDistance=res.maxDist||E.home.pos.length()*3; E.ctl.minDistance=res.minDist||2;
  E.ctl.maxPolarAngle=res.below?Math.PI:Math.PI*0.495; E.cam.near=res.near||0.2; E.cam.far=res.far||12000; E.cam.updateProjectionMatrix();
  E.cutAt=res.cutAt!=null?res.cutAt:0; E.clip.normal.fromArray(res.cutN||[-1,0,0]); E.domeFns.forEach(f=>f(0));
  syncTools(); }
function frame(t){ E.raf=requestAnimationFrame(frame); if(!E.ok||!E.root||document.hidden) return;
  const dt=Math.min(0.25,(t-(E.last||t))/1000); E.last=t; E.t+=dt;
  const dg=E.domeOpen?1:0; if(Math.abs(E.domeK-dg)>0.001){ E.domeK+=Math.sign(dg-E.domeK)*Math.min(Math.abs(dg-E.domeK),dt*0.5); E.domeFns.forEach(f=>f(E.domeK)); }
  const cg=E.cut?E.cutAt:1e5; E.clip.constant=E.cut?(E.clip.constant>1e4?60:E.clip.constant+(cg-E.clip.constant)*Math.min(1,dt*3.5)):1e5;
  if(E.camGoal){ E.cam.position.lerp(E.camGoal.pos,Math.min(1,dt*2.4)); E.ctl.target.lerp(E.camGoal.tgt,Math.min(1,dt*2.4)); if(E.cam.position.distanceTo(E.camGoal.pos)<0.1) E.camGoal=null; }
  E.anims.forEach(f=>f(E.t,dt));
  E.ctl.update(); if(E.sky) E.sky.position.copy(E.cam.position);
  E.r.render(E.sc,E.cam);
  const w=E.host.clientWidth, h=E.host.clientHeight, v=new window.THREE.Vector3();
  E.labels.forEach(l=>{ v.copy(l.p).project(E.cam); const vis=v.z<1&&Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05; l.el.style.opacity=vis?1:0;
    if(vis) l.el.style.transform='translate('+((v.x*0.5+0.5)*w)+'px,'+((-v.y*0.5+0.5)*h)+'px) translate(-50%,-100%)'; }); }
function engineStart(){ if(!E.raf){ E.last=0; E.raf=requestAnimationFrame(frame); } }
function engineStop(){ if(E.raf){ cancelAnimationFrame(E.raf); E.raf=0; } }
function engineDispose(){ engineStop(); clearModel(); if(E.envRT){ E.envRT.dispose(); E.envRT=null; } if(!E.r) return; if(E.ro) E.ro.disconnect(); E.ctl.dispose(); E.r.dispose(); try{ E.r.forceContextLoss(); }catch(e){}
  // majburan o'chirilgan kontekstli canvasda yangi WebGL ochilmaydi — keyingi ochilish uchun yangi canvas qo'yamiz
  const old=E.host&&E.host.querySelector('canvas'); if(old) old.replaceWith(document.createElement('canvas'));
  Object.assign(E,{ ok:false, r:null, sc:null, cam:null, ctl:null, host:null, ro:null, cur:null }); }

/* ======================= Ekran (UI) ======================= */
const U={ el:null, open:false, cat:'all', sel:null };
const list=()=>(window.OBS_MODELS||[]).slice().sort((a,b)=>a.yearN-b.yearN);
function syncTools(){ if(!U.el) return; const m=E.cur, q=s=>U.el.querySelector(s);
  q('#obswCut').style.display=m&&m.feat&&m.feat.cut?'':'none'; q('#obswCut').classList.toggle('on',E.cut);
  q('#obswDome').style.display=m&&m.feat&&m.feat.dome?'':'none'; q('#obswDome').textContent=T(E.domeOpen?TX.domeC:TX.domeO);
  q('#obswSpin').classList.toggle('on',E.spin); }
function renderList(){ const box=U.el.querySelector('.obsw-items'), items=list().filter(m=>U.cat==='all'||m.cat===U.cat);
  box.innerHTML=items.map(m=>'<button class="obsw-it'+(U.sel===m.id?' on':'')+'" data-id="'+m.id+'"><span class="obsw-ic">'+m.icon+'</span><span class="obsw-tx"><b>'+esc(T(m.name))+'</b><small>'+esc(T(m.place))+'</small></span><span class="obsw-yr">'+esc(T(m.year))+'</span></button>').join('');
  box.querySelectorAll('.obsw-it').forEach(b=>b.addEventListener('click',()=>{ click(700); select(b.dataset.id); }));
  U.el.querySelector('.obsw-count').textContent=list().length+T(TX.count); }
function renderInfo(m){ const i=U.el.querySelector('.obsw-info');
  i.innerHTML='<h4>'+m.icon+' '+esc(T(m.name))+'</h4><div class="obsw-kv"><div><span>'+esc(T(TX.place))+'</span><b>'+esc(T(m.place))+'</b></div><div><span>'+esc(T(TX.year))+'</span><b>'+esc(T(m.year))+'</b></div>'+
    '<div><span>'+esc(T(TX.coords))+'</span><b>'+esc(T(m.coords))+'</b></div><div><span>'+esc(T(TX.instr))+'</span><b>'+esc(T(m.instr))+'</b></div></div>'+
    '<h5>'+esc(T(TX.facts))+'</h5><ul>'+m.facts.map(f=>'<li>'+esc(T(f))+'</li>').join('')+'</ul>'+
    (m.link==='ulugbek'?'<button class="auth-btn obsw-more" id="obswMore"><span class="auth-btn-tx">'+esc(T(m.linkText))+'</span></button>':'')+'<p class="obsw-hint">'+esc(T(TX.hint))+'</p>';
  const mb=i.querySelector('#obswMore'); if(mb) mb.addEventListener('click',()=>{ click(760); close(); const ub=document.getElementById('ubBtn'); if(ub) setTimeout(()=>ub.click(),60); }); }
function select(id){ const m=list().find(x=>x.id===id); if(!m) return; U.sel=id; U.el.classList.add('viewing');
  U.el.querySelectorAll('.obsw-it').forEach(b=>b.classList.toggle('on',b.dataset.id===id)); renderInfo(m);
  const host=U.el.querySelector('.obsw-3d');
  if(!E.ok && !engineInit(host)){ host.classList.add('nogl'); host.querySelector('.obsw-msg').textContent=T(TX.noGl); return; }
  const ld=U.el.querySelector('.obsw-load'); ld.classList.add('on');
  setTimeout(()=>{ try{ loadModel(m); }catch(e){ console.error('[obs]',m.id,e); } ld.classList.remove('on'); engineStart(); },30); }
function build(){
  const el=document.createElement('div'); el.id='obsWorld'; el.className='obsw'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  el.innerHTML='<div class="obsw-card glass"><div class="obsw-head"><button class="ac-link obsw-back" type="button"></button><div><h3></h3><p></p></div><span class="obsw-count"></span><button class="panel-close obsw-x" type="button" aria-label="close">✕</button></div>'+
    '<div class="obsw-main"><aside class="obsw-list"><div class="obsw-cats"></div><div class="obsw-items"></div></aside>'+
    '<section class="obsw-view"><div class="obsw-3d"><canvas></canvas><div class="obsw-lbls"></div><div class="obsw-msg"></div><div class="obsw-load"><i></i><span></span></div>'+
    '<div class="obsw-tools"><button class="sn-chip" id="obswCut"></button><button class="sn-chip" id="obswDome"></button><button class="sn-chip" id="obswSpin"></button><button class="sn-chip" id="obswHome"></button></div></div>'+
    '<div class="obsw-info"></div></section></div></div>';
  document.body.appendChild(el); U.el=el;
  el.querySelector('.obsw-x').addEventListener('click',close);
  el.querySelector('.obsw-back').addEventListener('click',()=>{ click(520); el.classList.remove('viewing'); });
  el.querySelector('#obswCut').addEventListener('click',()=>{ click(620); E.cut=!E.cut; syncTools(); });
  el.querySelector('#obswDome').addEventListener('click',()=>{ click(700); E.domeOpen=!E.domeOpen; syncTools(); });
  el.querySelector('#obswSpin').addEventListener('click',()=>{ click(620); E.spin=!E.spin; if(E.ctl) E.ctl.autoRotate=E.spin; syncTools(); });
  el.querySelector('#obswHome').addEventListener('click',()=>{ click(620); if(E.home) E.camGoal={ pos:E.home.pos.clone(), tgt:E.home.tgt.clone() }; });
  el.addEventListener('pointerdown',e=>{ if(e.target===el) close(); });
  texts(); }
function texts(){ if(!U.el) return; const q=s=>U.el.querySelector(s);
  q('h3').textContent='🌍 '+T(TX.title); q('.obsw-head p').textContent=T(TX.sub); q('.obsw-back').textContent=T(TX.back); q('.obsw-load span').textContent=T(TX.loading);
  q('#obswCut').textContent=T(TX.cut); q('#obswSpin').textContent=T(TX.spin); q('#obswHome').textContent=T(TX.view);
  q('.obsw-cats').innerHTML=['all','naked','classic','modern','space'].map(c=>'<button class="sn-chip'+(U.cat===c?' on':'')+'" data-c="'+c+'">'+esc(T(TX.cats[c]))+'</button>').join('');
  q('.obsw-cats').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ click(620); U.cat=b.dataset.c; texts(); }));
  renderList(); const m=list().find(x=>x.id===U.sel); if(m){ renderInfo(m); E.labels.forEach(l=>{ l.el.textContent=T(l.t); }); } syncTools();
  const b=document.getElementById('obsWorldBtn'); if(b) b.title=T(TX.title); }
function open(){ if(U.open) return; if(!U.el) build(); const ubv=document.getElementById('ubView'); if(ubv&&ubv.classList.contains('on')){ const c=document.getElementById('ubClose'); if(c) c.click(); }
  U.open=true; U.el.classList.add('on'); document.body.classList.add('obswmode'); window.__labCover=true; texts(); click(760);
  const first=U.sel||(list()[0]&&list()[0].id); if(window.innerWidth>760&&first) select(first); }
function close(){ if(!U.open) return; U.open=false; U.el.classList.remove('on','viewing'); document.body.classList.remove('obswmode'); engineDispose(); window.__labCover=false; click(440); }
window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&U.open) close(); });
new MutationObserver(()=>{ texts(); }).observe(document.documentElement,{ attributes:true, attributeFilter:['lang'] });
function wireBtn(){ const b=document.getElementById('obsWorldBtn'); if(b&&!b._obs){ b._obs=1; b.title=T(TX.title); b.addEventListener('click',()=>{ U.open?close():open(); }); } }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wireBtn); else wireBtn();
window.OBS_WORLD={ open, close, select, _E:E };
})();
