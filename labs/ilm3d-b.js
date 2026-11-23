// 3D ko'rgazmalar — Galaktikalar, Ekzosayyoralar (realistik: HDR, qora jism ranglari, NASA teksturalari)
(function(){
if(!window.ILM3D)return;
const lerp=(a,b,k)=>a+(b-a)*k,sm=k=>{k=Math.max(0,Math.min(1,k));return k*k*(3-2*k);};
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const R=(a,b)=>a+Math.random()*(b-a);
const circ=(r,n,y)=>{const a=[];for(let i=0;i<n;i++){const t=i/(n-1)*Math.PI*2;a.push(r*Math.cos(t),y||0,r*Math.sin(t));}return a;};
const tr=o=>o[lg()]||o.uz;

// ---- Galaktika: yulduzlar (additiv) + chang yo'laklari (oddiy aralashtirish — yorug'likni to'sadi) ----
// Bulj/to'siq — eski sariq-to'q sariq yulduzlar (3500–5200 K), disk — aralash, qo'llar — yosh ko'k (9–25 ming K), HII — pushti Hα tumanliklar
function galaxy(H,n,Rg,arms,bar,o){o=o||{};const P=H.particles(n,{size:o.size||.09,twinkle:.15}),p=P.pos,c=P.col,s=P.size,hii=H.lin(0xff7a9a);
 const armPt=r=>{const arm=Math.floor(Math.random()*arms);return arm*2*Math.PI/arms+Math.log(r/(Rg*.15))*2.1;};
 for(let i=0;i<n;i++){const k=Math.random();let x,y,z,col,b=1,sz=R(.6,1.2);
  if(k<.17){const r=Math.abs(gauss())*Rg*.1,a=Math.random()*6.283,bb=Math.acos(2*Math.random()-1);x=r*Math.sin(bb)*Math.cos(a);y=r*Math.cos(bb)*.6;z=r*Math.sin(bb)*Math.sin(a);col=H.bb(R(3500,5200));b=.55;}
  else if(bar&&k<.27){x=(Math.random()-.5)*Rg*.55;z=gauss()*Rg*.045;y=gauss()*.1;col=H.bb(R(3600,5400));b=.6;}
  else if(k<.55){const r=Math.min(Rg,-Rg*.32*Math.log(1-Math.random()*.96)+Rg*.08),a=Math.random()*6.283;x=r*Math.cos(a);z=r*Math.sin(a);y=gauss()*.1;col=H.bb(R(4200,7000));b=.42;sz=R(.6,1);}
  else{const r=Rg*(.15+Math.pow(Math.random(),.8)*.85),th=armPt(r)+gauss()*.27;x=r*Math.cos(th);z=r*Math.sin(th);y=gauss()*.1;
   if(k<.572){col=hii;b=.16;sz=R(2,3.5);}else if(Math.random()<.04){col=H.bb(R(12000,25000));b=1.6;sz=R(1.6,2.4);}else{col=H.bb(Math.random()<.7?R(9000,22000):R(5000,7000));b=.75;}}
  p[i*3]=x;p[i*3+1]=y;p[i*3+2]=z;c[i*3]=col.r*b;c[i*3+1]=col.g*b;c[i*3+2]=col.b*b;s[i]=sz;}
 P.upd();
 // chang: qo'llarning ichki chekkasi bo'ylab qora-jigarrang bulutchalar
 const nd=Math.round(n*.14),D=H.particles(nd,{size:(o.size||.09)*3.2,color:0x0a0603,opacity:.55,blend:'normal'});
 for(let i=0;i<nd;i++){const r=Rg*(.2+Math.pow(Math.random(),.8)*.75),th=armPt(r)-.16+gauss()*.08;D.pos.set([r*Math.cos(th),gauss()*.05,r*Math.sin(th)],i*3);D.size[i]=R(.6,1.4);}
 D.upd();D.renderOrder=6;
 const g=new THREE.Group();g.add(P,D);const core=H.glow(0xffd9a8,Rg*.55,.9);g.add(core);g.stars=P;return g;}
function elliptical(H,n,Rg){const P=H.particles(n,{size:.08,twinkle:.1});
 for(let i=0;i<n;i++){const r=Math.pow(Math.random(),2.2)*Rg+Math.abs(gauss())*Rg*.05,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);
  P.pos.set([r*Math.sin(b)*Math.cos(a)*1.4,r*Math.cos(b),r*Math.sin(b)*Math.sin(a)],i*3);const c=H.bb(R(3300,4900)),k=.5;P.col.set([c.r*k,c.g*k,c.b*k],i*3);P.size[i]=R(.6,1.2);}
 P.upd();const g=new THREE.Group();g.add(P,H.glow(0xffc890,Rg*1.4,.8));return g;}
function irregular(H,n){const P=H.particles(n,{size:.08,twinkle:.2}),hii=H.lin(0xff5a8c),per=Math.ceil(n/7);
 for(let k=0,i=0;k<7;k++){const cx=(Math.random()-.5)*5,cy=(Math.random()-.5)*2.5,cz=(Math.random()-.5)*3,sp=R(.4,.75);
  for(let j=0;j<per&&i<n;j++,i++){P.pos.set([cx+gauss()*sp,cy+gauss()*sp*.8,cz+gauss()*sp],i*3);const u=Math.random();let c,b=.7;
   if(u<.05){c=hii;b=.18;P.size[i]=R(2,3.2);}else if(u<.62){c=H.bb(R(10000,25000));P.size[i]=R(.6,1.3);}else{c=H.bb(R(4500,7000));b=.45;P.size[i]=R(.5,1);}
   P.col.set([c.r*b,c.g*b,c.b*b],i*3);}}
 P.upd();return P;}

ILM3D.add('🌌',{title:{uz:"Galaktikalar — 3D ko'rgazma",ru:"Галактики — 3D-демонстрация",en:"Galaxies — 3D demonstration"},items:[
 {n:{uz:"To'siqli spiral galaktika",ru:"Спиральная галактика с перемычкой",en:"Barred spiral galaxy"},
  d:{uz:"Somon Yo'li shunday ko'rinadi: markazda sariq eski yulduzlardan iborat bulj va to'siq, undan spiral qo'llar chiqadi. Qo'llarda yosh ko'k yulduzlar va pushti yulduz tug'iladigan tumanliklar ko'p.",ru:"Так выглядит Млечный Путь: в центре — балдж и перемычка из старых жёлтых звёзд, из неё выходят спиральные рукава. В рукавах много молодых голубых звёзд и розовых областей звездообразования.",en:"This is what the Milky Way looks like: a bulge and bar of old yellow stars at the centre, with spiral arms coming off it. The arms are full of young blue stars and pink star-forming nebulae."},
  build(H){const G=new THREE.Group(),gx=galaxy(H,H.n(22000),11,2,true,{size:.1});gx.rotation.x=.08;G.add(gx);
   return {G,cam:[0,12,16],tg:[0,0,0],bg:'stars',bloom:{strength:.75,threshold:.9,radius:1},u(t){gx.rotation.y=-t*.06;}};}},
 {n:{uz:"Galaktika turlari",ru:"Типы галактик",en:"Galaxy types"},
  d:{uz:"Xabbl tasnifi: spiral (disk va qo'llar), elliptik (qo'llarsiz, eski qizg'ish yulduzlardan iborat tuxumsimon) va noto'g'ri (aniq shakli yo'q, ko'pincha to'qnashuv natijasi — masalan, Magellan bulutlari).",ru:"Классификация Хаббла: спиральные (диск и рукава), эллиптические (без рукавов, яйцевидные, из старых красноватых звёзд) и неправильные (без чёткой формы, часто после столкновений — например, Магеллановы облака).",en:"Hubble's classes: spiral (disc and arms), elliptical (armless, egg-shaped, made of old reddish stars) and irregular (no clear shape, often from collisions — like the Magellanic Clouds)."},
  build(H){const G=new THREE.Group(),s=galaxy(H,H.n(8000),4,2,false,{size:.08});s.position.x=-10;s.rotation.x=.5;
   const e=elliptical(H,H.n(6000),2.6),ir=irregular(H,H.n(4500));ir.position.x=10;G.add(s,e,ir);
   const L=tr({uz:["Spiral","Elliptik","Noto'g'ri"],ru:["Спиральная","Эллиптическая","Неправильная"],en:["Spiral","Elliptical","Irregular"]});
   [-10,0,10].forEach((x,i)=>{const lb=H.label(L[i],'#cfe0ff',1.1);lb.position.set(x,-5,0);G.add(lb);});
   return {G,cam:[0,3,24],tg:[0,0,0],bg:'stars',bloom:{strength:.7,threshold:.9,radius:1},u(t){s.rotation.y=-t*.15;e.rotation.y=t*.05;ir.rotation.y=t*.08;}};}},
 {n:{uz:"Somon Yo'li va Andromeda to'qnashuvi",ru:"Столкновение Млечного Пути и Андромеды",en:"Milky Way–Andromeda collision"},
  d:{uz:"~4,5 mlrd yildan keyin ikki galaktika to'qnashadi. Yulduzlar orasidagi masofa juda katta bo'lgani uchun ular deyarli urilmaydi, lekin tortishish disklarni buzib, oxirida ulkan elliptik galaktika — «Milkomeda» hosil bo'ladi.",ru:"Примерно через 4,5 млрд лет две галактики столкнутся. Звёзды почти не сталкиваются — расстояния между ними огромны, но гравитация разрушит диски, и в итоге возникнет гигантская эллиптическая галактика «Млекомеда».",en:"In ~4.5 billion years the two galaxies will collide. Stars will hardly ever hit each other — the gaps are vast — but gravity will wreck both discs, ending in one giant elliptical galaxy, 'Milkomeda'."},
  build(H){const G=new THREE.Group(),n1=H.n(5000),n2=H.n(6000),N=n1+n2,ga=galaxy(H,n1,4,2,true),gb=galaxy(H,n2,5,2,false);
   // yulduz koordinatalari va ranglari bitta zarralar to'plamiga ko'chiriladi
   const P=H.particles(N,{size:.09,twinkle:.15}),src=new Float32Array(N*3);src.set(ga.stars.pos);src.set(gb.stars.pos,n1*3);P.col.set(ga.stars.col);P.col.set(gb.stars.col,n1*3);P.size.set(ga.stars.size);P.size.set(gb.stars.size,n1);
   [ga,gb].forEach(g=>g.traverse(o=>{o.geometry&&o.geometry.dispose();o.material&&o.material.dispose();}));
   const E=new Float32Array(N*3);for(let i=0;i<N;i++){const r=Math.abs(gauss())*2.4,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);E[i*3]=r*Math.sin(b)*Math.cos(a)*1.3;E[i*3+1]=r*Math.cos(b);E[i*3+2]=r*Math.sin(b)*Math.sin(a);}
   const cA=H.glow(0xffd9a8,3,.9),cB=H.glow(0xffd9a8,3.6,.9);G.add(P,cA,cB);P.upd();
   const mA=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(.4,0,.2)).elements,mB=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-.9,0,.6)).elements;
   return {G,cam:[0,8,30],tg:[0,0,0],bg:'stars',bloom:{strength:.75,threshold:.9,radius:1},u(t){const T=t%18,k=sm((T-7)/6),d=lerp(14,0,sm(T/7)),p=P.pos,sp=T*.25;
    for(let g=0;g<2;g++){const A=g===0,ang=A?sp:-sp*.8,cs=Math.cos(ang),sn=Math.sin(ang),m=A?mA:mB,ox=A?-d:d,oz=A?-d*.25:d*.25,i0=A?0:n1,i1=A?n1:N;
     for(let i=i0;i<i1;i++){const j=i*3,x0=src[j],y0=src[j+1],z0=src[j+2],x=x0*cs+z0*sn,z=-x0*sn+z0*cs;
      const X=m[0]*x+m[4]*y0+m[8]*z,Y=m[1]*x+m[5]*y0+m[9]*z,Z=m[2]*x+m[6]*y0+m[10]*z;
      p[j]=lerp(X+ox,E[j],k);p[j+1]=lerp(Y,E[j+1],k);p[j+2]=lerp(Z+oz,E[j+2],k);}}
    P.upd();cA.position.set(-d*(1-k),0,-d*.25*(1-k));cB.position.set(d*(1-k),0,d*.25*(1-k));cA.uniforms.uInt.value=.9+k*.6;cB.uniforms.uInt.value=.9*(1-k);G.rotation.y=t*.03;}};}}
]});

// ---- Spektr chizig'i (radial tezlik): kamalak + yutilish chiziqlari ----
function wl2rgb(l){let r=0,g=0,b=0;if(l<440){r=-(l-440)/60;b=1;}else if(l<490){g=(l-440)/50;b=1;}else if(l<510){g=1;b=-(l-510)/20;}else if(l<580){r=(l-510)/70;g=1;}else if(l<645){r=1;g=-(l-645)/65;}else r=1;
 const f=l<420?.3+.7*(l-380)/40:l>700?.3+.7*(780-l)/80:1;return [r*f,g*f,b*f];}
const LINES=[397,410,434,486,517,527,589,656];
function specTex(lines){const c=document.createElement('canvas'),W=1024,Hh=64;c.width=W;c.height=Hh;const x=c.getContext('2d');
 if(!lines){for(let i=0;i<W;i++){const [r,g,b]=wl2rgb(390+i/W*320);x.fillStyle=`rgb(${r*255|0},${g*255|0},${b*255|0})`;x.fillRect(i,0,1,Hh);}
  x.fillStyle='rgba(255,255,255,.85)';LINES.forEach(l=>x.fillRect((l-390)/320*W-1,0,2,9));}   // tinch holatdagi chiziqlar o'rni (belgilar)
 else{x.clearRect(0,0,W,Hh);x.fillStyle='rgba(0,0,0,.92)';LINES.forEach(l=>{const X=(l-390)/320*W;x.fillRect(X-2.5,12,5,Hh-12);});}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.anisotropy=4;return t;}

// Tranzit: ikki doira kesishish yuzasi
function overlap(d,R,r){if(d>=R+r)return 0;if(d<=R-r)return Math.PI*r*r;
 const a=r*r*Math.acos((d*d+r*r-R*R)/(2*d*r)),b=R*R*Math.acos((d*d+R*R-r*r)/(2*d*R)),c=.5*Math.sqrt(Math.max(0,(-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R)));return a+b-c;}

ILM3D.add('🪐',{title:{uz:"Ekzosayyoralar — 3D ko'rgazma",ru:"Экзопланеты — 3D-демонстрация",en:"Exoplanets — 3D demonstration"},items:[
 {n:{uz:"Tranzit usuli",ru:"Транзитный метод",en:"Transit method"},
  d:{uz:"Sayyora yulduz oldidan o'tganda yulduz yorug'ligi biroz kamayadi. Pastdagi «yorug'lik egri chizig'i» shu xiralashishni ko'rsatadi: chuqurlik sayyora o'lchamini, takrorlanish oralig'i esa uning yilini beradi. Kepler va TESS shu usulda minglab sayyora topgan.",ru:"Когда планета проходит перед звездой, её свет немного ослабевает. «Кривая блеска» внизу показывает этот провал: глубина даёт размер планеты, а период повторения — длину её года. Kepler и TESS нашли так тысячи планет.",en:"When a planet crosses its star, the starlight dims slightly. The 'light curve' below shows that dip: its depth gives the planet's size and its repeat interval gives the planet's year. Kepler and TESS found thousands of planets this way."},
  build(H){const G=new THREE.Group(),Rs=2.2,rp=.55,st=H.star(Rs,5600,{intensity:1.25,halo:5,glow:.7}),pl=H.planet('neptune',rp,{sun:[0,0,0],spin:.25});G.add(st,pl);
   // Kuzatuvchi +z da (masofa 20): proyeksiyadagi kesishish × chekka qorayishi (I(μ)=1−0.6(1−μ))
   const CZ=20,Rorb=6,inc=.05,u=.6,F0=Math.PI*Rs*Rs*(1-u/3);
   const drop=a=>{const x=Rorb*Math.cos(a),z=Rorb*Math.sin(a),y=z*inc;if(z<=0)return 0;const k=CZ/(CZ-z),d=Math.hypot(x,y)*k,r=rp*k;
    const mu=Math.sqrt(Math.max(0,1-Math.pow(Math.min(d,Rs)/Rs,2)));return overlap(d,Rs,r)*(1-u*(1-mu))/F0;};
   const dMax=drop(Math.PI/2),N=H.n(260),cv=H.fatLine(N,0x7fe8ff,{width:2.4,glow:.5,intensity:1.3}),ax=H.fatLine(2,0xffffff,{width:1,glow:0,opacity:.25,intensity:.6}),Y0=-5.4,HY=1.9;
   const yOf=a=>Y0-drop(a)/dMax*HY,pts=[];for(let i=0;i<N;i++){const ph=i/(N-1),a=ph*Math.PI*2-Math.PI/2;pts.push(-9+18*ph,yOf(a),0);}cv.set(pts);ax.set([-9,Y0,-.02,9,Y0,-.02]);
   const dot=H.glow(0xbff6ff,1.1,2.2);G.add(cv,ax,dot);
   const lb=H.label(tr({uz:"Yulduz yorqinligi",ru:"Яркость звезды",en:"Star brightness"}),{color:'#7fe8ff',scale:.85});lb.position.set(-7.2,Y0+.75,0);G.add(lb);
   return {G,cam:[0,0,20],tg:[0,-1.5,0],bloom:{strength:.6,threshold:1,radius:1},u(t){const ph=(t*.35)%1,a=ph*Math.PI*2-Math.PI/2;pl.position.set(Rorb*Math.cos(a),Rorb*Math.sin(a)*inc,Rorb*Math.sin(a));
    const f=drop(a);dot.position.set(-9+18*ph,Y0-f/dMax*HY,.05);st.setIntensity(1.25*(1-f));if(st.glow)st.glow.uniforms.uInt.value=.7*(1-f);}};}},
 {n:{uz:"Radial tezlik usuli",ru:"Метод лучевых скоростей",en:"Radial-velocity method"},
  d:{uz:"Sayyora va yulduz umumiy massa markazi atrofida aylanadi, shuning uchun yulduz ham kichik doira chizib «tebranadi». Bizga yaqinlashganda nuri ko'kka, uzoqlashganda qizilga siljiydi (Doppler effekti). 51 Pegas b shu usulda topilgan.",ru:"Планета и звезда вращаются вокруг общего центра масс, поэтому звезда тоже «покачивается» по маленькому кругу. Приближаясь, её свет смещается в синюю сторону, удаляясь — в красную (эффект Доплера). Так открыли 51 Пегаса b.",en:"A planet and its star orbit a shared centre of mass, so the star 'wobbles' in a small circle. Moving toward us its light shifts blue, moving away it shifts red (the Doppler effect). 51 Pegasi b was found this way."},
  build(H){const G=new THREE.Group(),T0=5800,st=H.star(1.6,T0,{intensity:1.3,halo:5,glow:.8}),pl=H.planet('jupiter',.7,{sun:[0,0,0],spin:.35});
   const orb=H.fatLine(121,0xffffff,{width:1,glow:0,opacity:.22,intensity:.7}),so=H.fatLine(121,0xffd9a0,{width:1.4,glow:.3,opacity:.5,intensity:.9}),bc=H.glow(0xffffff,.5,1.6);
   orb.set(circ(8,121));so.set(circ(1.1,121));G.add(st,pl,orb,so,bc);
   // Spektr: kamalak ustida qora yutilish chiziqlari; oq belgilar — tinch holatdagi o'rni
   const sw=12,sh=.95,spec=new THREE.Group(),bg=new THREE.Mesh(new THREE.PlaneGeometry(sw,sh),new THREE.MeshBasicMaterial({map:specTex(),color:new H.C(.8,.8,.8)})),
    lnT=specTex(true),ln=new THREE.Mesh(new THREE.PlaneGeometry(sw,sh),new THREE.MeshBasicMaterial({map:lnT,transparent:true,depthWrite:false}));
   ln.position.z=.01;ln.renderOrder=7;spec.add(bg,ln);spec.position.set(0,-4.3,3);spec.rotation.x=-.3;G.add(spec);
   const lb=H.label(tr({uz:"Yulduz spektri (chapda ko'k, o'ngda qizil)",ru:"Спектр звезды (слева синий, справа красный)",en:"Star spectrum (blue left, red right)"}),{color:'#cfe0ff',scale:.85});lb.position.set(0,-5.25,3.3);G.add(lb);
   return {G,cam:[0,5,16],tg:[0,-.6,0],bloom:{strength:.6,threshold:1,radius:1},u(t){const a=t*.8;pl.position.set(8*Math.cos(a),0,8*Math.sin(a));st.position.set(-1.1*Math.cos(a),0,-1.1*Math.sin(a));pl.setSun(st.position);
    const k=Math.cos(a);/* kuzatuvchi +z da: k>0 — yulduz bizdan uzoqlashadi (qizilga siljish), k<0 — yaqinlashadi (ko'kka) */
    st.setTemp(k>0?T0-2400*k:T0+4500*(-k));lnT.offset.x=-k*.035;}};}},   // offset<0 → chiziqlar o'ngga (qizil tomonga) siljiydi
 {n:{uz:"Yashash zonasi",ru:"Зона обитаемости",en:"Habitable zone"},
  d:{uz:"Yashil halqa — yulduzdan shunday masofaki, u yerda sayyora yuzasida suv suyuq bo'lishi mumkin. Yaqinroqdagi sayyora juda issiq (suv bug'lanadi), uzoqroqdagisi muzlagan. Yulduz qancha xira bo'lsa, zona shuncha yaqin bo'ladi.",ru:"Зелёное кольцо — расстояние от звезды, на котором вода на поверхности может быть жидкой. Ближняя планета слишком горячая (вода испаряется), дальняя — замёрзшая. Чем тусклее звезда, тем ближе зона.",en:"The green ring is the distance at which water could be liquid on a planet's surface. The inner planet is too hot (water boils away), the outer one frozen. The dimmer the star, the closer in the zone lies."},
  build(H){const G=new THREE.Group(),st=H.star(1.3,5772,{intensity:1.3,halo:6,glow:.8});G.add(st);
   // Zona: yumshoq yashil halqa (4–6), ichkarida iliq, tashqarida sovuq tus — barchasi shaffof
   const zm=new THREE.ShaderMaterial({uniforms:{cG:{value:H.lin(0x46e08c)},cW:{value:H.lin(0xff7a3a)},cC:{value:H.lin(0x6fa8ff)},uT:{value:0}},transparent:true,depthWrite:false,side:THREE.DoubleSide,
    vertexShader:'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 cG,cW,cC;uniform float uT;varying vec2 vP;void main(){float r=length(vP);float g=smoothstep(3.55,4.25,r)*(1.0-smoothstep(5.75,6.45,r));float e=exp(-pow((r-4.0)/.06,2.0))+exp(-pow((r-6.0)/.06,2.0));'+
     'float w=(1.0-smoothstep(1.6,4.1,r))*smoothstep(1.35,1.9,r);float c=smoothstep(6.0,7.5,r)*(1.0-smoothstep(8.5,11.5,r));'+
     'float s=g+e+w+c+1e-3;vec3 col=(cG*(g+e)+cW*w+cC*c)/s;float a=clamp(g*0.15+e*0.12+w*0.08+c*0.05,0.0,1.0);gl_FragColor=vec4(col*(0.8+e*0.6),a);}'});
   const zone=new THREE.Mesh(new THREE.RingGeometry(1.3,12,160,1),zm);zone.rotation.x=-Math.PI/2;zone.renderOrder=-1;G.add(zone);
   const PL=[[2.3,'venus',.4,1.6],[5,'earth',.55,.85],[9,0xe4f0ff,.6,.4]].map(([r,nm,s,w])=>{const m=H.planet(nm,s,Object.assign({sun:[0,0,0],spin:.2},typeof nm==='number'?{atm:0xcfe6ff,atmI:.25}:{}));G.add(m);
    const o=H.fatLine(121,0xffffff,{width:1,glow:0,opacity:.2,intensity:.6});o.set(circ(r,121));G.add(o);return [m,r,w];});
   const L=tr({uz:["Yashash zonasi","Juda issiq","Muzlagan"],ru:["Зона обитаемости","Слишком жарко","Замёрзшая"],en:["Habitable zone","Too hot","Frozen"]}),lb=H.label(L[0],'#5fe0b0',1.2);lb.position.set(0,1.4,-5);G.add(lb);
   const l1=H.label(L[1],{color:'#ffb08a',scale:.85}),l2=H.label(L[2],{color:'#9fc8ff',scale:.85});l1.position.set(0,.3,2.6);l2.position.set(9.3,.5,0);G.add(l1,l2);
   return {G,cam:[0,10,15],tg:[0,0,0],bloom:{strength:.55,threshold:1,radius:1},u(t){PL.forEach(([m,r,w])=>{const a=t*w*.6;m.position.set(r*Math.cos(a),0,r*Math.sin(a));});}};}}
]});
})();
