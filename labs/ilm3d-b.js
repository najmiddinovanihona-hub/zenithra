// 3D ko'rgazmalar — Galaktikalar, Ekzosayyoralar
(function(){
if(!window.ILM3D)return;
const lerp=(a,b,k)=>a+(b-a)*k,sm=k=>{k=Math.max(0,Math.min(1,k));return k*k*(3-2*k);};
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
function spiral(n,R,arms,bar){const p=[],c=[];for(let i=0;i<n;i++){const k=Math.random();let x,y,z,col;
 if(k<.18){const r=Math.abs(gauss())*R*.12;const a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);x=r*Math.sin(b)*Math.cos(a);y=r*Math.cos(b)*.6;z=r*Math.sin(b)*Math.sin(a);col=[1,.85,.55];}
 else if(bar&&k<.28){x=(Math.random()-.5)*R*.55;z=gauss()*R*.04;y=gauss()*.1;col=[1,.8,.55];}
 else{const r=R*(.15+Math.pow(Math.random(),.8)*.85),arm=Math.floor(Math.random()*arms),th=arm*2*Math.PI/arms+Math.log(r/(R*.15))*2.1+gauss()*.22;x=r*Math.cos(th);z=r*Math.sin(th);y=gauss()*.12;const b=Math.random();col=b<.3?[.7,.82,1]:b<.4?[1,.6,.75]:[.92,.95,1];}
 p.push(x,y,z);c.push(...col);}return [p,c];}
function cloud(H,arr,size){const P=H.pts(arr[0].length/3,size);P.geometry.attributes.position.array.set(arr[0]);P.geometry.attributes.color.array.set(arr[1]);return P;}

ILM3D.add('🌌',{title:{uz:"Galaktikalar — 3D ko'rgazma",ru:"Галактики — 3D-демонстрация",en:"Galaxies — 3D demonstration"},items:[
 {n:{uz:"To'siqli spiral galaktika",ru:"Спиральная галактика с перемычкой",en:"Barred spiral galaxy"},
  d:{uz:"Somon Yo'li shunday ko'rinadi: markazda sariq eski yulduzlardan iborat bulj va to'siq, undan spiral qo'llar chiqadi. Qo'llarda yosh ko'k yulduzlar va pushti yulduz tug'iladigan tumanliklar ko'p.",ru:"Так выглядит Млечный Путь: в центре — балдж и перемычка из старых жёлтых звёзд, из неё выходят спиральные рукава. В рукавах много молодых голубых звёзд и розовых областей звездообразования.",en:"This is what the Milky Way looks like: a bulge and bar of old yellow stars at the centre, with spiral arms coming off it. The arms are full of young blue stars and pink star-forming nebulae."},
  build(H){const G=new THREE.Group(),P=cloud(H,spiral(16000,11,2,true),.09);G.add(P);return {G,cam:[0,12,16],tg:[0,0,0],u(t){P.rotation.y=-t*.08;}};}},
 {n:{uz:"Galaktika turlari",ru:"Типы галактик",en:"Galaxy types"},
  d:{uz:"Xabbl tasnifi: spiral (disk va qo'llar), elliptik (qo'llarsiz, eski qizg'ish yulduzlardan iborat tuxumsimon) va noto'g'ri (aniq shakli yo'q, ko'pincha to'qnashuv natijasi — masalan, Magellan bulutlari).",ru:"Классификация Хаббла: спиральные (диск и рукава), эллиптические (без рукавов, яйцевидные, из старых красноватых звёзд) и неправильные (без чёткой формы, часто после столкновений — например, Магеллановы облака).",en:"Hubble's classes: spiral (disc and arms), elliptical (armless, egg-shaped, made of old reddish stars) and irregular (no clear shape, often from collisions — like the Magellanic Clouds)."},
  build(H){const G=new THREE.Group(),s=cloud(H,spiral(6000,4,2,false),.07);s.position.x=-10;s.rotation.x=.5;
   const ep=[],ec=[];for(let i=0;i<5000;i++){const r=Math.abs(gauss())*1.6;const a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);ep.push(r*Math.sin(b)*Math.cos(a)*1.4,r*Math.cos(b),r*Math.sin(b)*Math.sin(a));ec.push(1,.78,.55);}
   const e=cloud(H,[ep,ec],.07);
   const ip=[],ic=[];for(let k=0;k<7;k++){const cx=(Math.random()-.5)*5,cy=(Math.random()-.5)*2.5,cz=(Math.random()-.5)*3;for(let i=0;i<600;i++){ip.push(cx+gauss()*.6,cy+gauss()*.5,cz+gauss()*.6);const b=Math.random();ic.push(...(b<.5?[.7,.82,1]:b<.7?[1,.6,.75]:[.95,.95,1]));}}
   const ir=cloud(H,[ip,ic],.07);ir.position.x=10;G.add(s,e,ir);
   const L={uz:["Spiral","Elliptik","Noto'g'ri"],ru:["Спиральная","Эллиптическая","Неправильная"],en:["Spiral","Elliptical","Irregular"]}[lg()]||["Spiral","Elliptik","Noto'g'ri"];
   [-10,0,10].forEach((x,i)=>{const lb=H.label(L[i],'#cfe0ff',1.1);lb.position.set(x,-5,0);G.add(lb);});
   return {G,cam:[0,3,24],tg:[0,0,0],u(t){s.rotation.y=-t*.15;e.rotation.y=t*.05;ir.rotation.y=t*.08;}};}},
 {n:{uz:"Somon Yo'li va Andromeda to'qnashuvi",ru:"Столкновение Млечного Пути и Андромеды",en:"Milky Way–Andromeda collision"},
  d:{uz:"~4,5 mlrd yildan keyin ikki galaktika to'qnashadi. Yulduzlar orasidagi masofa juda katta bo'lgani uchun ular deyarli urilmaydi, lekin tortishish disklarni buzib, oxirida ulkan elliptik galaktika — «Milkomeda» hosil bo'ladi.",ru:"Примерно через 4,5 млрд лет две галактики столкнутся. Звёзды почти не сталкиваются — расстояния между ними огромны, но гравитация разрушит диски, и в итоге возникнет гигантская эллиптическая галактика «Млекомеда».",en:"In ~4.5 billion years the two galaxies will collide. Stars will hardly ever hit each other — the gaps are vast — but gravity will wreck both discs, ending in one giant elliptical galaxy, 'Milkomeda'."},
  build(H){const G=new THREE.Group(),A=spiral(5000,4,2,true),B=spiral(6000,5,2,false),n1=A[0].length/3,n2=B[0].length/3,N=n1+n2,P=H.pts(N,.08),cols=P.geometry.attributes.color.array;
   cols.set(A[1]);cols.set(B[1],n1*3);G.add(P);const E=[];for(let i=0;i<N;i++){const r=Math.abs(gauss())*2.4,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);E.push(r*Math.sin(b)*Math.cos(a)*1.3,r*Math.cos(b),r*Math.sin(b)*Math.sin(a));}
   const ra=new THREE.Euler(.4,0,.2),rb=new THREE.Euler(-.9,0,.6),v=new THREE.Vector3();
   return {G,cam:[0,8,30],tg:[0,0,0],u(t){const T=t%18,k=sm((T-7)/6),d=lerp(14,0,sm(T/7)),p=P.geometry.attributes.position.array,sp=T*.25;
    for(let i=0;i<N;i++){const isA=i<n1,src=isA?A[0]:B[0],j=isA?i:i-n1;v.set(src[j*3],src[j*3+1],src[j*3+2]).applyAxisAngle(new THREE.Vector3(0,1,0),isA?sp:-sp*.8).applyEuler(isA?ra:rb);
     const ox=isA?-d:d,oz=isA?-d*.25:d*.25;p.set([lerp(v.x+ox,E[i*3],k),lerp(v.y,E[i*3+1],k),lerp(v.z+oz,E[i*3+2],k)],i*3);}H.upd(P);G.rotation.y=t*.03;}};}}
]});

ILM3D.add('🪐',{title:{uz:"Ekzosayyoralar — 3D ko'rgazma",ru:"Экзопланеты — 3D-демонстрация",en:"Exoplanets — 3D demonstration"},items:[
 {n:{uz:"Tranzit usuli",ru:"Транзитный метод",en:"Transit method"},
  d:{uz:"Sayyora yulduz oldidan o'tganda yulduz yorug'ligi biroz kamayadi. Pastdagi «yorug'lik egri chizig'i» shu xiralashishni ko'rsatadi: chuqurlik sayyora o'lchamini, takrorlanish oralig'i esa uning yilini beradi. Kepler va TESS shu usulda minglab sayyora topgan.",ru:"Когда планета проходит перед звездой, её свет немного ослабевает. «Кривая блеска» внизу показывает этот провал: глубина даёт размер планеты, а период повторения — длину её года. Kepler и TESS нашли так тысячи планет.",en:"When a planet crosses its star, the starlight dims slightly. The 'light curve' below shows that dip: its depth gives the planet's size and its repeat interval gives the planet's year. Kepler and TESS found thousands of planets this way."},
  build(H){const G=new THREE.Group(),st=H.ball(2.2,0xffd27a,48),pl=H.lit(.55,0x4a7bd0,32);G.add(st,pl);{const RT=window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;if(RT){RT.star(st,0xffd27a);RT.apply(pl,'neptune',{srgb:false});}}
   const N=240,cv=H.line(N,0x7fe8ff),ax=H.line(2,0xffffff,.25),dot=H.ball(.18,0xffffff,12);G.add(cv,ax,dot);ax.geometry.attributes.position.array.set([-9,-5.6,0,9,-5.6,0]);
   const R=6,inc=.05,flux=a=>{const x=R*Math.cos(a),z=R*Math.sin(a),y=z*inc;if(z<0)return 1;const d=Math.hypot(x,y);return d<2.2-.55?.86:d<2.2+.55?1-.14*(2.2+.55-d)/1.1:1;};
   const p=cv.geometry.attributes.position.array;for(let i=0;i<N;i++){const a=i/(N-1)*Math.PI*2-Math.PI/2+Math.PI;p.set([-9+18*i/(N-1),-5.6+(flux(a+Math.PI/2-Math.PI)-.86)/.14*1.6+1.2-1.6,0],i*3);}H.upd(cv);
   for(let i=0;i<N;i++){const a=i/(N-1)*Math.PI*2-Math.PI/2;p[i*3+1]=-5.6+(flux(a)-.86)/.14*1.8;}H.upd(cv);
   return {G,cam:[0,0,20],tg:[0,-1.5,0],u(t){const ph=(t*.35)%1,a=ph*Math.PI*2-Math.PI/2;pl.position.set(R*Math.cos(a),R*Math.sin(a)*inc,R*Math.sin(a));dot.position.set(-9+18*ph,-5.6+(flux(a)-.86)/.14*1.8,0);st.material.color.setHex(0xffd27a).multiplyScalar(.75+.25*(flux(a)-.86)/.14);}};}},
 {n:{uz:"Radial tezlik usuli",ru:"Метод лучевых скоростей",en:"Radial-velocity method"},
  d:{uz:"Sayyora va yulduz umumiy massa markazi atrofida aylanadi, shuning uchun yulduz ham kichik doira chizib «tebranadi». Bizga yaqinlashganda nuri ko'kka, uzoqlashganda qizilga siljiydi (Doppler effekti). 51 Pegas b shu usulda topilgan.",ru:"Планета и звезда вращаются вокруг общего центра масс, поэтому звезда тоже «покачивается» по маленькому кругу. Приближаясь, её свет смещается в синюю сторону, удаляясь — в красную (эффект Доплера). Так открыли 51 Пегаса b.",en:"A planet and its star orbit a shared centre of mass, so the star 'wobbles' in a small circle. Moving toward us its light shifts blue, moving away it shifts red (the Doppler effect). 51 Pegasi b was found this way."},
  build(H){const G=new THREE.Group(),st=H.ball(1.6,0xfff0d0,40),pl=H.lit(.7,0xd99a5a,32),bc=H.ball(.08,0xffffff,8),orb=H.line(121,0xffffff,.2),so=H.line(121,0xffffff,.35);G.add(st,pl,bc,orb,so);{const RT=window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;if(RT){RT.star(st,0xfff0d0);RT.apply(pl,'jupiter',{srgb:false});}}
   [[orb,8],[so,1.1]].forEach(([l,r])=>{const p=l.geometry.attributes.position.array;for(let i=0;i<=120;i++){const a=i/120*6.283;p.set([r*Math.cos(a),0,r*Math.sin(a)],i*3);}H.upd(l);});
   const blue=new H.C(0x7fb2ff),white=new H.C(0xfff0d0),red=new H.C(0xff7a5a);
   return {G,cam:[0,5,16],tg:[0,0,0],u(t){const a=t*.8;pl.position.set(8*Math.cos(a),0,8*Math.sin(a));st.position.set(-1.1*Math.cos(a),0,-1.1*Math.sin(a));const vz=-1.1*Math.cos(a)*-1;const k=Math.cos(a);st.material.color.copy(white).lerp(k>0?blue:red,Math.abs(k));}};}},
 {n:{uz:"Yashash zonasi",ru:"Зона обитаемости",en:"Habitable zone"},
  d:{uz:"Yashil halqa — yulduzdan shunday masofaki, u yerda sayyora yuzasida suv suyuq bo'lishi mumkin. Yaqinroqdagi sayyora juda issiq (suv bug'lanadi), uzoqroqdagisi muzlagan. Yulduz qancha xira bo'lsa, zona shuncha yaqin bo'ladi.",ru:"Зелёное кольцо — расстояние от звезды, на котором вода на поверхности может быть жидкой. Ближняя планета слишком горячая (вода испаряется), дальняя — замёрзшая. Чем тусклее звезда, тем ближе зона.",en:"The green ring is the distance at which water could be liquid on a planet's surface. The inner planet is too hot (water boils away), the outer one frozen. The dimmer the star, the closer in the zone lies."},
  build(H){const G=new THREE.Group(),st=H.ball(1.3,0xffd27a,40),zone=new THREE.Mesh(new THREE.RingGeometry(4,6,96),new THREE.MeshBasicMaterial({color:0x5fe0b0,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));zone.rotation.x=-Math.PI/2;G.add(st,zone);if(window.REALTEX&&window.REALTEX.ok)window.REALTEX.star(st,0xffd27a);
   const PL=[[2.3,.4,0xd0603a,1.6],[5,.55,0x3f8fd8,.85],[9,.6,0xcfe6ff,.4]].map(d=>{const m=H.lit(d[1],d[2],32);G.add(m);const o=H.line(121,0xffffff,.15),p=o.geometry.attributes.position.array;for(let i=0;i<=120;i++){const a=i/120*6.283;p.set([d[0]*Math.cos(a),0,d[0]*Math.sin(a)],i*3);}G.add(o);return [m,d[0],d[3]];});
   const L={uz:"Yashash zonasi",ru:"Зона обитаемости",en:"Habitable zone"}[lg()]||"Yashash zonasi",lb=H.label(L,'#5fe0b0',1.2);lb.position.set(0,1.4,-5);G.add(lb);
   return {G,cam:[0,10,15],tg:[0,0,0],u(t){PL.forEach(([m,r,w])=>{const a=t*w*.6;m.position.set(r*Math.cos(a),0,r*Math.sin(a));});}};}}
]});
})();
