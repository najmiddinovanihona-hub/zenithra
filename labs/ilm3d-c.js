// 3D ko'rgazmalar — Qora tuynuklar, Quyosh (realistik: HDR, akkretsiya diski, foton halqasi, NASA teksturalari)
(function(){
if(!window.ILM3D)return;
const lerp=(a,b,k)=>a+(b-a)*k,sm=k=>{k=Math.max(0,Math.min(1,k));return k*k*(3-2*k);};
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const tr=o=>o[lg()]||o.uz;
const SM=(o)=>new THREE.ShaderMaterial(o);
const ADD={transparent:true,depthWrite:false,blending:THREE.AdditiveBlending};

// ---- Qora tuynuk soyasi + foton halqasi (kameraga qaragan billboard) ----
// Ingichka yorqin halqa soya chetida; ustida — diskning orqa qismining gravitatsion linzalangan tasviri (yoy), pastda — ostki tomoni.
// Doppler: +x tomoni (bizga yaqinlashayotgan disk qismi) yorqinroq — H.disk(spin:1) bilan mos.
const RING_V='uniform float uS;varying vec2 vQ;void main(){vQ=position.xy;vec4 mv=modelViewMatrix*vec4(0.0,0.0,0.0,1.0);mv.xy+=position.xy*uS;gl_Position=projectionMatrix*mv;}';
const RING_F=`uniform vec3 uC,uL;uniform float uR,uW,uI,uDop,uLens;varying vec2 vQ;
void main(){float r=length(vQ);if(r>1.0)discard;float cx=vQ.x/max(r,1e-3),sy=vQ.y/max(r,1e-3);
 float ring=exp(-pow((r-uR)/uW,2.0))+0.22*exp(-pow((r-uR)/(uW*7.0),2.0));
 float top=exp(-pow((r-uR*1.3)/(uR*0.17),2.0))*smoothstep(-0.15,0.85,sy);
 float bot=exp(-pow((r-uR*1.08)/(uR*0.06),2.0))*smoothstep(0.1,1.0,-sy)*0.55;
 float d=max(0.12,1.0+uDop*cx);
 gl_FragColor=vec4((uC*ring*uI+uL*(top+bot)*uLens)*d*(1.0-smoothstep(0.8,1.0,r)),1.0);}`;
function blackHole(H,Rb,o){o=o||{};const g=new THREE.Group(),bh=new THREE.Mesh(new THREE.SphereGeometry(Rb,H.seg(48),H.seg(24)),new THREE.MeshBasicMaterial({color:0x000000}));
 const uR=.42,U={uS:{value:Rb*1.04/uR},uR:{value:uR},uW:{value:o.w||.012},uI:{value:o.ring!=null?o.ring:3},uDop:{value:o.dop!=null?o.dop:.6},uLens:{value:o.lens!=null?o.lens:1.4},uC:{value:H.lin(0xffe2b8)},uL:{value:H.lin(0xffa858)}};
 const ring=new THREE.Mesh(new THREE.PlaneGeometry(2,2),SM(Object.assign({uniforms:U,vertexShader:RING_V,fragmentShader:RING_F},ADD)));ring.frustumCulled=false;ring.renderOrder=4;
 g.add(bh,ring);g.ring=ring;g.U=U;return g;}
// ---- Relyativistik jet: konus, markazi yorqin, tashqariga yuguruvchi tugunlar ----
const JET_V='uniform float uL;varying vec3 vN,vV;varying float vY;void main(){vY=position.y/uL;vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}';
const JET_F=`uniform vec3 uC;uniform float uT,uI;varying vec3 vN,vV;varying float vY;
void main(){float f=pow(abs(dot(normalize(vN),normalize(vV))),2.2);float L=exp(-vY*2.4)*smoothstep(0.0,0.05,vY)*(1.0-smoothstep(0.7,1.0,vY));
 float k=0.5+0.5*sin(vY*34.0-uT*7.0);gl_FragColor=vec4(uC*uI*f*L*(0.35+0.9*k*k),1.0);}`;
function jet(H,len,r0,r1,col,I){const U={uL:{value:len},uC:{value:H.lin(col)},uT:{value:0},uI:{value:I||3}};
 const geo=new THREE.CylinderGeometry(r1,r0,len,24,1,true);geo.translate(0,len/2,0);
 const m=new THREE.Mesh(geo,SM(Object.assign({uniforms:U,vertexShader:JET_V,fragmentShader:JET_F,side:THREE.DoubleSide},ADD)));m.U=U;return m;}

ILM3D.add('🕳',{title:{uz:"Qora tuynuklar — 3D ko'rgazma",ru:"Чёрные дыры — 3D-демонстрация",en:"Black holes — 3D demonstration"},items:[
 {n:{uz:"Akkretsiya diski va jetlar",ru:"Аккреционный диск и джеты",en:"Accretion disc and jets"},
  d:{uz:"Qora tuynukka tushayotgan gaz aylanib, disk hosil qiladi: ichki qismi tezroq aylanadi va millionlab gradusgacha qiziydi (oq-sariq), tashqisi sovuqroq (qizil). Magnit maydon moddaning bir qismini qutblardan deyarli yorug'lik tezligidagi jetlar (ko'k) bo'lib otadi.",ru:"Падающий газ закручивается в диск: внутренняя часть вращается быстрее и раскаляется до миллионов градусов (бело-жёлтая), внешняя холоднее (красная). Магнитное поле выбрасывает часть вещества из полюсов джетами почти со скоростью света (синие).",en:"Infalling gas swirls into a disc: the inner part spins faster and heats to millions of degrees (white-yellow), the outer part is cooler (red). Magnetic fields fling some matter out of the poles as near-light-speed jets (blue)."},
  build(H){const G=new THREE.Group(),B=blackHole(H,1.5),D=H.disk(2.1,9.5,{temp:5200,beta:.5,intensity:1.25,speed:1.2});G.add(B,D);
   const L=16,j1=jet(H,L,.1,1.1,0x8fc4ff,2.3),j2=jet(H,L,.1,1.1,0x8fc4ff,2.3);j1.position.y=1.2;j2.position.y=-1.2;j2.rotation.x=Math.PI;G.add(j1,j2);
   const J=H.n(900),Jp=H.particles(J,{size:.16,color:0xb8dcff,intensity:1.5}),js=new Float32Array(J),ja=new Float32Array(J);for(let i=0;i<J;i++){js[i]=Math.random();ja[i]=Math.random();}G.add(Jp);
   return {G,cam:[0,4.5,20],tg:[0,0,0],bloom:{strength:.9,threshold:1,radius:1},u(t){j1.U.uT.value=j2.U.uT.value=t;const q=Jp.pos;
    for(let i=0;i<J;i++){const s=(js[i]+t*.22)%1,y=1.4+s*L*.92,w=(.08+s*.95)*Math.sqrt(ja[i]),a=i*2.39996+t*.3;q[i*3]=w*Math.cos(a);q[i*3+1]=i&1?y:-y;q[i*3+2]=w*Math.sin(a);Jp.size[i]=1-s*.6;}Jp.upd();}};}},
 {n:{uz:"Fazo-vaqt chuqurligi",ru:"Воронка пространства-времени",en:"Spacetime well"},
  d:{uz:"Massa fazo-vaqtni egadi — qora tuynuk atrofida bu «chuqurlik» cheksiz chuqurlashadi. Yaqinlashgan jismlar spiral bo'ylab tobora tezroq aylanadi va hodisalar gorizontidan o'tgach, qaytib chiqa olmaydi.",ru:"Масса искривляет пространство-время — вокруг чёрной дыры эта «воронка» бесконечно углубляется. Приближающиеся тела всё быстрее закручиваются по спирали и, пересёкши горизонт событий, уже не возвращаются.",en:"Mass curves spacetime — around a black hole this 'well' deepens without limit. Objects that come close spiral faster and faster, and once past the event horizon they never return."},
  build(H){const G=new THREE.Group(),well=r=>-10/Math.sqrt(1+r*r/.5)+.4,S=H.surface(30,null,{color:0x0c2558,line:0x6fa8ff,deep:0x7a3cff,cell:1,depth:7,opacity:.72,glow:.6});
   S.deform((x,z)=>well(Math.hypot(x,z)));G.add(S);
   const B=blackHole(H,.6,{ring:2.5,lens:.6});B.position.y=well(0)+.3;G.add(B);
   const K=6,NT=40,cols=[0xffc861,0xff7a8a,0x5fe0b0,0xa26bff,0x7fd4ff,0xffffff],pos=(o,tt)=>{const s=tt*.08+o,f=s-Math.floor(s),r=lerp(13,.8,Math.pow(f,.7)),th=o*6.283+Math.pow(1/r,1.5)*tt*6+f*20;return [r*Math.cos(th),well(r)+.25,r*Math.sin(th),Math.floor(s),f];};
   const b=cols.map((c,k)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.24,16,8),new THREE.MeshBasicMaterial({color:H.lin(c).multiplyScalar(2.2)})),tl=H.fatLine(NT,c,{width:2.2,glow:.6,fade:1,intensity:1.4});G.add(m,tl);return [m,tl,k/K];});
   const arr=new Float32Array(NT*3);
   return {G,cam:[0,10,22],tg:[0,-3,0],bloom:{strength:.75,threshold:1,radius:1},u(t){b.forEach(([m,tl,o])=>{const p=pos(o,t);m.position.set(p[0],p[1],p[2]);m.visible=tl.visible=p[4]<.97;
     for(let i=0;i<NT;i++){let q=pos(o,t-(NT-1-i)*.035);if(q[3]!==p[3])q=pos(o,p[3]/.08-o/.08+1e-4);arr[i*3]=q[0];arr[i*3+1]=q[1];arr[i*3+2]=q[2];}tl.set(arr);});}};}},
 {n:{uz:"Spagettilashuv",ru:"Спагеттификация",en:"Spaghettification"},
  d:{uz:"Qora tuynuk yaqinida tortishish jismning yaqin tomoniga uzoq tomonidan ancha kuchliroq ta'sir qiladi (to'lqin kuchlari). Natijada jism tushish yo'nalishida cho'zilib, yon tomondan siqiladi — xuddi spagettidek.",ru:"Вблизи чёрной дыры гравитация действует на ближнюю сторону тела намного сильнее, чем на дальнюю (приливные силы). В итоге тело вытягивается вдоль направления падения и сжимается с боков — как спагетти.",en:"Near a black hole gravity pulls much harder on an object's near side than its far side (tidal forces). The object is stretched along the direction of the fall and squeezed from the sides — like spaghetti."},
  build(H){const G=new THREE.Group(),B=blackHole(H,1.2,{lens:.5,dop:.3}),n=H.n(1800),P=H.particles(n,{size:.07,twinkle:.2}),u=new Float32Array(n*3);G.add(B,P);
   for(let i=0;i<n;i++){let x,y,z;do{x=Math.random()*2-1;y=Math.random()*2-1;z=Math.random()*2-1;}while(x*x+y*y+z*z>1);u.set([x,y,z],i*3);const c=H.bb(5200+Math.random()*2200),k=.12+.16*(1-Math.hypot(x,y,z));P.col.set([c.r*k,c.g*k,c.b*k],i*3);P.size[i]=.6+Math.random()*.8;}P.upd();
   const gl=H.glow(0xffe8c8,2.4,.5);G.add(gl);G.rotation.y=-.6;
   return {G,cam:[0,4,18],tg:[0,0,0],bloom:{strength:.75,threshold:1,radius:1},u(t){const s=(t*.12)%1,d=lerp(14,1.3,Math.pow(s,1.8)),st=Math.min(12,1+18/(d*d*.6)),sq=1/Math.sqrt(st),p=P.pos;
    for(let i=0;i<n;i++){p[i*3]=d+u[i*3]*st*.6;p[i*3+1]=u[i*3+1]*sq*.6;p[i*3+2]=u[i*3+2]*sq*.6;}P.upd();
    // cho'zilganda gaz siqilib qiziydi — yorqinroq; gorizontga yetganda yo'qoladi
    const heat=Math.min(1,(st-1)/8);P.uniforms.uInt.value=1+heat*.8;P.uniforms.uOp.value=s>.95?0:1;gl.position.set(d,0,0);gl.uniforms.uInt.value=s>.95?0:.8*(1-heat*.6);}};}}
]});

// ---- Quyosh: fotosfera (NASA teksturasi + chekka qorayishi) va kesim yuzasi (yadro → nurlanish → konveksiya) ----
// Fotosfera: NASA teksturasi (iliq rang, granulyatsiya) + chekka qorayishi + dog'lar (qora-jigarrang soya, to'q sariq yarim soya)
const PH_V='varying vec2 vUv;varying vec3 vN,vV,vO;void main(){vUv=uv;vO=normalize(position);vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}';
const PH_F=`uniform sampler2D tS;uniform float uHas,uI,uT;uniform vec3 uSp[6];uniform float uSpR[6];varying vec2 vUv;varying vec3 vN,vV,vO;
void main(){vec3 tx=uHas>0.5?pow(texture2D(tS,vec2(fract(vUv.x+uT*0.004),vUv.y)).rgb,vec3(2.2)):vec3(1.0,0.45,0.1);
 float um=0.0,pe=0.0;for(int i=0;i<6;i++){float r=uSpR[i];if(r<=0.0)continue;float d=1.0-dot(vO,uSp[i]);pe=max(pe,1.0-smoothstep(r*0.5,r,d));um=max(um,1.0-smoothstep(r*0.16,r*0.3,d));}
 tx*=mix(vec3(1.0),vec3(0.6,0.32,0.12),pe*0.9);tx=mix(tx,vec3(0.06,0.022,0.006),um*0.92);
 float mu=clamp(dot(normalize(vN),normalize(vV)),0.0,1.0);vec3 ld=1.0-vec3(0.4,0.55,0.7)*(1.0-pow(vec3(mu),vec3(0.5,0.55,0.65)));
 gl_FragColor=vec4(tx*uI*ld,1.0);}`;
// Kesim yuzasi — harorat bo'yicha illyustrativ (iliq) ranglar: yadro (0–0.25 R☉) oq-sariq → nurlanish zonasi (0.25–0.7) sariq-to'q sariq →
// konveksiya zonasi (0.7–1) to'q sariq-qizil, silliq yumaloq harakatlanuvchi konveksiya hujayralari (Worley shovqini)
const CUT_V='varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
const CUT_F=`uniform float uT;varying vec2 vP;
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
float wor(vec2 p,float t,out float f2){vec2 i=floor(p),f=fract(p);float d1=8.0,d2=8.0;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y)),o=h2(i+g);o=0.5+0.38*sin(t*0.5+6.2831*o);vec2 r=g+o-f;float d=dot(r,r);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
 f2=sqrt(d2);return sqrt(d1);}
void main(){float r=length(vP)/5.0;vec3 c;
 if(r<0.25){c=mix(vec3(4.4,3.7,2.3),vec3(2.7,1.7,0.5),smoothstep(0.0,0.25,r))*(1.0+0.05*sin(uT*3.0));}
 else if(r<0.7){float q=smoothstep(0.25,0.7,r);c=mix(vec3(2.2,1.2,0.3),vec3(1.35,0.5,0.1),q)*(0.95+0.05*sin(r*150.0-uT*1.5));}
 else{float q=smoothstep(0.7,1.0,r),f2;float f1=wor(vP*1.15,uT,f2);float cell=1.0-smoothstep(0.15,0.8,f1);cell*=smoothstep(0.0,0.22,f2-f1)*0.4+0.6;
  c=mix(vec3(0.42,0.08,0.012),vec3(1.25,0.4,0.065),cell)*(1.1-0.25*q);}
 c*=1.0-0.35*exp(-pow((r-0.25)/0.006,2.0))-0.35*exp(-pow((r-0.7)/0.006,2.0));
 c=mix(c,vec3(1.8,0.8,0.17),smoothstep(0.975,0.997,r));gl_FragColor=vec4(c,1.0);}`;
// Toj: kameraga qaragan halqa-nur — faqat yulduz diskidan tashqarida (ichida chizilmaydi: kesim yuzasida iz qolmaydi), nurli oqimlar bilan
const COR_F=`uniform vec3 uC;uniform float uR,uI;varying vec2 vQ;
void main(){float r=length(vQ),x=r/uR;if(x<0.9)discard;float th=atan(vQ.y,vQ.x);float st=0.7+0.3*sin(th*6.0+1.3)*sin(th*3.0-0.7);
 float I=(0.55*pow(1.0/x,4.0)+0.45*exp(-(x-1.0)*3.0)*st)*smoothstep(0.9,1.01,x)*(1.0-smoothstep(0.7,1.0,r));gl_FragColor=vec4(uC*uI*I,1.0);}`;
function sunTex(U){const RT=window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;if(RT)RT.texture('sun',{srgb:false}).then(t=>{if(t){U.tS.value=t;U.uHas.value=1;}}).catch(()=>{});}
const SPOTS=[[.3,.25,.92,.012],[.38,.18,.9,.006],[-.4,-.2,.89,.009],[.7,-.3,.65,.007],[-.75,.3,.6,.01],[.1,-.45,.88,.005]];
function spotU(on){return {uSp:{value:SPOTS.map(a=>new THREE.Vector3(a[0],a[1],a[2]).normalize())},uSpR:{value:SPOTS.map(a=>on?a[3]:0)}};}
function corona(H,R,I){const U={uS:{value:R*3.2},uR:{value:1/3.2},uI:{value:I||1},uC:{value:H.lin(0xffc078)}};
 const m=new THREE.Mesh(new THREE.PlaneGeometry(2,2),SM(Object.assign({uniforms:U,vertexShader:RING_V,fragmentShader:COR_F},ADD)));m.frustumCulled=false;m.renderOrder=4;m.U=U;return m;}
function sunBall(H,r,I){const U=Object.assign({tS:{value:null},uHas:{value:0},uI:{value:I||2},uT:{value:0}},spotU(true));sunTex(U);
 const m=new THREE.Mesh(new THREE.SphereGeometry(r,H.seg(64),H.seg(32)),SM({uniforms:U,vertexShader:PH_V,fragmentShader:PH_F}));m.U=U;m.add(corona(H,r,.8));return m;}
// Bow shock: Quyosh tomonga qaragan paraboloid qobiq (chetlari yorqin)
const SH_V='varying vec3 vN,vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}';
const SH_F='uniform vec3 uC;uniform float uI;varying vec3 vN,vV;void main(){float f=1.0-abs(dot(normalize(vN),normalize(vV)));gl_FragColor=vec4(uC*uI*pow(f,2.5),1.0);}';

ILM3D.add('☀',{title:{uz:"Quyosh — 3D ko'rgazma",ru:"Солнце — 3D-демонстрация",en:"The Sun — 3D demonstration"},items:[
 {n:{uz:"Ichki tuzilishi (kesim)",ru:"Внутреннее строение (разрез)",en:"Interior (cutaway)"},
  d:{uz:"Quyoshning chorak qismi kesib ko'rsatilgan: markazda termoyadro yadrosi, keyin energiya o'n minglab yil davomida sekin o'tadigan nurlanish zonasi, so'ng plazma qaynaydigan konveksiya zonasi va ko'rinadigan yuza — fotosfera. Atrofida siyrak, lekin juda issiq toj.",ru:"Четверть Солнца вырезана: в центре — термоядерное ядро, затем зона лучистого переноса, через которую энергия идёт десятки тысяч лет, конвективная зона с «кипящей» плазмой и видимая поверхность — фотосфера. Вокруг — разреженная, но очень горячая корона.",en:"A quarter of the Sun is cut away: the fusion core at the centre, then the radiative zone that energy crawls through for tens of thousands of years, the convective zone of 'boiling' plasma, and the visible surface — the photosphere. Around it lies the thin but scorching corona."},
  build(H){const G=new THREE.Group(),PU=Object.assign({tS:{value:null},uHas:{value:0},uI:{value:2},uT:{value:0}},spotU(true)),CU={uT:{value:0}};sunTex(PU);
   const ph=new THREE.Mesh(new THREE.SphereGeometry(5,H.seg(72),H.seg(36),Math.PI*.5,Math.PI*1.5),SM({uniforms:PU,vertexShader:PH_V,fragmentShader:PH_F}));G.add(ph);
   const cm=SM({uniforms:CU,vertexShader:CUT_V,fragmentShader:CUT_F,side:THREE.DoubleSide});
   [0,1].forEach(k=>{const m=new THREE.Mesh(new THREE.CircleGeometry(5,H.seg(96),k?Math.PI/2:-Math.PI/2,Math.PI),cm);if(!k)m.rotation.y=-Math.PI/2;G.add(m);});
      const nC=H.n(3000),co=H.particles(nC,{size:.12,color:0xffd8a8,intensity:.3,twinkle:.3});
   for(let i=0;i<nC;i++){const r=5.1+Math.pow(Math.random(),2.6)*4.5,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);co.pos.set([r*Math.sin(b)*Math.cos(a),r*Math.cos(b),r*Math.sin(b)*Math.sin(a)],i*3);co.size[i]=.5+Math.random();}co.upd();
   const halo=corona(H,5,.6);G.add(co,halo);
   const L=tr({uz:["Yadro","Nurlanish zonasi","Konveksiya zonasi","Fotosfera","Toj"],ru:["Ядро","Зона лучистого переноса","Конвективная зона","Фотосфера","Корона"],en:["Core","Radiative zone","Convective zone","Photosphere","Corona"]})||[];
   [[0,-.15,.1],[0,-2.3,1.5],[0,-3.7,2.7],[-3.6,4.1,-1.6],[-6.2,5.4,-5]].forEach((p,i)=>{if(!L[i])return;const s=H.label(L[i],'#ffffff',1);s.position.set(...p);G.add(s);});
   return {G,cam:[-13,5,13],tg:[0,0,0],bloom:{strength:.7,threshold:1,radius:1},u(t){PU.uT.value=CU.uT.value=t;co.rotation.y=t*.03;}};}},
 {n:{uz:"Quyosh shamoli va magnitosfera",ru:"Солнечный ветер и магнитосфера",en:"Solar wind and magnetosphere"},
  d:{uz:"Quyoshdan uchib kelayotgan zaryadli zarralar (sariq) Yerning magnit maydoniga urilib, uning atrofidan aylanib o'tadi. Magnit maydon Quyosh tomondan siqiladi, orqa tomonda esa uzun «dum» hosil qiladi. Qutblar yaqinida ichkariga kirgan zarralar qutb nurlarini yoqadi.",ru:"Заряженные частицы от Солнца (жёлтые) налетают на магнитное поле Земли и обтекают его. С солнечной стороны поле сжато, с ночной — вытянуто в длинный «хвост». Частицы, проникшие у полюсов, зажигают полярные сияния.",en:"Charged particles from the Sun (yellow) strike Earth's magnetic field and flow around it. The field is squashed on the Sun-facing side and stretched into a long 'tail' behind. Particles that leak in near the poles light up the auroras."},
  build(H){const G=new THREE.Group(),earth=H.planet('earth',1,{sun:[-22,0,0],spin:.15}),sun=sunBall(H,3,2.1);sun.position.x=-22;G.add(earth,sun);
   for(let k=0;k<10;k++){const ph=k/10*Math.PI*2;[2.5,4,6].forEach(Ls=>{const l=H.fatLine(100,0x9a7bff,{width:1.5,glow:.4,intensity:.9,opacity:.65}),p=[];
    for(let i=0;i<100;i++){const th=.12+i/99*(Math.PI-.24),r=Ls*Math.sin(th)**2;let x=r*Math.sin(th)*Math.cos(ph),y=r*Math.cos(th),z=r*Math.sin(th)*Math.sin(ph);x*=x<0?.65:1.9;p.push(x,y,z);}l.set(p);G.add(l);});}
   // Zarba to'lqini (bow shock): x = ρ²/9 − 4.5 — shamol zarralari shu sirtdan aylanib o'tadi
   const sp=[];for(let i=0;i<=24;i++){const rho=i/24*9.5;sp.push(new THREE.Vector2(rho,rho*rho/9-4.5));}
   const bs=new THREE.Mesh(new THREE.LatheGeometry(sp,48),SM(Object.assign({uniforms:{uC:{value:H.lin(0x7fbfff)},uI:{value:.22}},vertexShader:SH_V,fragmentShader:SH_F,side:THREE.DoubleSide},ADD)));bs.rotation.z=-Math.PI/2;G.add(bs);
   const N=H.n(2500),W=H.particles(N,{size:.12,color:0xffe0a0,intensity:1.3}),S=new Float32Array(N*3);for(let i=0;i<N;i++){S[i*3]=Math.random();S[i*3+1]=(Math.random()-.5)*16;S[i*3+2]=(Math.random()-.5)*16;}G.add(W);
   const au=[1,-1].map(s=>{const a=H.fatLine(64,0x5fe0b0,{width:3,glow:1,intensity:2.2});a.set(circ(.42,64,s*.93));G.add(a);return a;});
   return {G,cam:[2,8,26],tg:[-4,0,0],bloom:{strength:.7,threshold:1,radius:1},u(t){sun.rotation.y=t*.04;const p=W.pos;for(let i=0;i<N;i++){const s=(S[i*3]+t*.12)%1,x=-19+s*36;let y=S[i*3+1],z=S[i*3+2];const rho=Math.hypot(y,z)||.01,req=x>-4.5?Math.sqrt(9*(x+4.5)):0;if(rho<req){y*=req/rho;z*=req/rho;}p[i*3]=x;p[i*3+1]=y;p[i*3+2]=z;}W.upd();
    au.forEach((a,i)=>{a.uniforms.uInt.value=1.6+.8*Math.sin(t*2.3+i*1.7)*Math.sin(t*.7+i);});}};}},
 {n:{uz:"Toj halqalari va massa otilishi",ru:"Корональные петли и выброс массы",en:"Coronal loops and mass ejection"},
  d:{uz:"Magnit maydon chiziqlari Quyosh yuzasidan halqa bo'lib ko'tariladi va ular bo'ylab issiq plazma oqadi. Chiziqlar buralib uzilganda toj massasi otilishi sodir bo'ladi — milliardlab tonna plazma fazoga uchadi va Yerga yetsa, geomagnit bo'ron keltirib chiqaradi.",ru:"Силовые линии магнитного поля поднимаются над поверхностью петлями, по которым течёт горячая плазма. Когда линии закручиваются и рвутся, происходит выброс корональной массы — миллиарды тонн плазмы летят в космос и, достигнув Земли, вызывают геомагнитную бурю.",en:"Magnetic field lines arch above the surface as loops that hot plasma flows along. When they twist and snap, a coronal mass ejection erupts — billions of tonnes of plasma fly into space and, if they reach Earth, trigger a geomagnetic storm."},
  build(H){const G=new THREE.Group(),sun=sunBall(H,5,2);G.add(sun);const loops=[],v=new THREE.Vector3(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
   const NL=12,NP=60,PP=14,pl=H.particles(NL*PP,{size:.15,color:0xffc070,intensity:.8});
   const AR=[new THREE.Vector3(-.95,.25,.25).normalize(),new THREE.Vector3(.95,-.1,.3).normalize()];   // faol hududlar chekka (limb) yaqinida — halqalar yondan ko'rinadi
   for(let k=0;k<NL;k++){const j=k>>1,dir=AR[k%2].clone().add(new THREE.Vector3(gauss(),gauss(),gauss()).multiplyScalar(.04)).normalize(),l=H.fatLine(NP,k%3?0xffa040:0xff7a30,{width:2.4,glow:.9,intensity:1.7}),w=.8+j*.25,h=.6+j*.32,rot=gauss()*.12;
    q.setFromUnitVectors(up,dir);const p=new Float32Array(NP*3);for(let i=0;i<NP;i++){const a=i/(NP-1)*Math.PI;v.set(Math.cos(a)*w,0,0).applyAxisAngle(up,rot);v.y=Math.sqrt(25-v.x*v.x-v.z*v.z)+Math.sin(a)*h;v.applyQuaternion(q);p[i*3]=v.x;p[i*3+1]=v.y;p[i*3+2]=v.z;}l.set(p);G.add(l);loops.push([l,p]);}
   G.add(pl);
   const n=H.n(2600),C=H.particles(n,{size:.13,color:0xffc890,intensity:.9,twinkle:.3}),u=[];for(let i=0;i<n;i++){const a=Math.random()*6.283,b=Math.random()*.9;u.push(Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a));C.size[i]=.5+Math.random();}C.upd();G.add(C);
   return {G,cam:[0,4,24],tg:[0,2,0],bloom:{strength:.75,threshold:1,radius:1},u(t){loops.forEach(([l],i)=>{l.uniforms.uOp.value=.55+.45*Math.sin(t*2+i);});
    // halqalar bo'ylab oqayotgan plazma
    const pp=pl.pos;for(let k=0;k<NL;k++){const a=loops[k][1];for(let j=0;j<PP;j++){const f=((j/PP+t*.18*(k%2?1:-1))%1+1)%1,x=f*(NP-1),i0=x|0,i1=Math.min(i0+1,NP-1),w=x-i0,o=(k*PP+j)*3;
     pp[o]=lerp(a[i0*3],a[i1*3],w);pp[o+1]=lerp(a[i0*3+1],a[i1*3+1],w);pp[o+2]=lerp(a[i0*3+2],a[i1*3+2],w);}}pl.upd();
    const s=(t*.15)%1,r=5+s*16,p=C.pos;for(let i=0;i<n;i++){const k=1+(i%7)*.03;p[i*3]=u[i*3]*r*.55*k+r*.15;p[i*3+1]=u[i*3+1]*r*k;p[i*3+2]=u[i*3+2]*r*.55*k;}C.upd();C.uniforms.uOp.value=1-s;sun.rotation.y=t*.03;}};}}
]});
function circ(r,n,y){const a=[];for(let i=0;i<n;i++){const t=i/(n-1)*Math.PI*2;a.push(r*Math.cos(t),y||0,r*Math.sin(t));}return a;}
})();
