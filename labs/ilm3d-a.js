// 3D ko'rgazmalar — Yulduzlar, Katta portlash, Qorong'i materiya (realistik rejim: ilm3d-core HDR + bloom)
(function(){
if(!window.ILM3D)return;const H0=window.ILM3D.H;
// Yorliq endi ilm3d-core.js da (H.label, xuddi shu imzo) — bu faqat zaxira
if(!H0.label)H0.label=function(txt,col,sc){const c=document.createElement('canvas'),x=c.getContext('2d');c.width=256;c.height=64;x.font='600 30px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=col||'#fff';x.fillText(txt,128,32);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.set(4*(sc||1),1*(sc||1),1);return s;};
const lerp=(a,b,k)=>a+(b-a)*k,cl=k=>Math.max(0,Math.min(1,k)),sm=k=>{k=cl(k);return k*k*(3-2*k);};
const rnd=n=>{const a=[];for(let i=0;i<n;i++){let x,y,z;do{x=Math.random()*2-1;y=Math.random()*2-1;z=Math.random()*2-1;}while(x*x+y*y+z*z>1);a.push(x,y,z);}return a;};
const lg=()=>{try{return LANG;}catch(e){return 'uz';}};
const tr=o=>typeof o==='string'?o:(o[lg()]||o.uz);
const R=(a,b)=>a+Math.random()*(b-a);
const gn=()=>(Math.random()+Math.random()+Math.random()+Math.random()-2)*1.732;   // ~N(0,1)
const pc=(p,i,c,k)=>{k=k==null?1:k;p.col[i*3]=c.r*k;p.col[i*3+1]=c.g*k;p.col[i*3+2]=c.b*k;};   // zarra rangi (chiziqli)
const lab=(H,G,txt,col,x,y,z,s)=>{const l=H.label(tr(txt),col||'#cfe0ff',s||1);l.position.set(x,y,z);G.add(l);return l;};
const sRGB=c=>'#'+c.clone().convertLinearToSRGB().getHexString();
// Chekka nuri (+ ixtiyoriy kenglik-uzunlik to'ri) — shar, additiv
const RIM_V='varying vec3 vN,vV;varying vec2 vUv;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}';
const RIM_F='uniform vec3 uCol;uniform float uOp,uGrid,uRim;varying vec3 vN,vV;varying vec2 vUv;void main(){float f=clamp(1.0-abs(dot(normalize(vN),normalize(vV))),0.0,1.0);float c=pow(f,3.0)*uRim+0.02;if(uGrid>0.0){vec2 g=vUv*vec2(36.0,18.0);vec2 w=max(fwidth(g),vec2(1e-4));vec2 q=abs(fract(g-0.5)-0.5)/w;c+=(1.0-min(min(q.x,q.y),1.0))*uGrid*(0.3+f);}gl_FragColor=vec4(uCol*c*uOp,1.0);}';
function rimMat(H,col,o){o=o||{};const m=new THREE.ShaderMaterial({uniforms:{uCol:{value:H.lin(col)},uOp:{value:o.op!=null?o.op:1},uGrid:{value:o.grid||0},uRim:{value:o.rim!=null?o.rim:.8}},vertexShader:RIM_V,fragmentShader:RIM_F,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:o.side||THREE.FrontSide});m.extensions.derivatives=true;return m;}
// Pulsar nur dastasi — ochiq konus, markazi yorqin, uzoqlashgan sari so'nadi
const BEAM_V='varying float vL;varying vec3 vN,vV;void main(){vL=-position.y/12.0;vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}';
const BEAM_F='uniform vec3 uCol;uniform float uInt;varying float vL;varying vec3 vN,vV;void main(){float d=abs(dot(normalize(vN),normalize(vV)));float l=clamp(vL,0.0,1.0);float a=pow(min(d,1.0),2.5)*pow(1.0-l,1.7)*smoothstep(0.0,0.05,l);gl_FragColor=vec4(uCol*a*uInt,1.0);}';
// Relikt nurlanish: ko'p oktavali shovqin + Planck rang shkalasi (uBar=1 — rang shkalasi chizig'i)
const CMB_V='varying vec3 vP;varying vec2 vUv;void main(){vP=normalize(position);vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
const CMB_F=`uniform float uBar,uI;uniform vec3 uSeed;varying vec3 vP;varying vec2 vUv;
float h3(vec3 p){p=fract(p*vec3(0.1031,0.1030,0.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(h3(i),h3(i+vec3(1.0,0.0,0.0)),f.x),mix(h3(i+vec3(0.0,1.0,0.0)),h3(i+vec3(1.0,1.0,0.0)),f.x),f.y),
            mix(mix(h3(i+vec3(0.0,0.0,1.0)),h3(i+vec3(1.0,0.0,1.0)),f.x),mix(h3(i+vec3(0.0,1.0,1.0)),h3(i+vec3(1.0,1.0,1.0)),f.x),f.y),f.z)*2.0-1.0;}
vec3 cmap(float v){float s=clamp(v*0.5+0.5,0.0,1.0)*6.0;vec3 c;
 vec3 c0=vec3(0.0,0.0,0.3),c1=vec3(0.0,0.3,0.85),c2=vec3(0.45,0.78,1.0),c3=vec3(1.0,0.95,0.85),c4=vec3(1.0,0.72,0.3),c5=vec3(0.92,0.28,0.05),c6=vec3(0.45,0.0,0.0);
 if(s<1.0)c=mix(c0,c1,s);else if(s<2.0)c=mix(c1,c2,s-1.0);else if(s<3.0)c=mix(c2,c3,s-2.0);else if(s<4.0)c=mix(c3,c4,s-3.0);else if(s<5.0)c=mix(c4,c5,s-4.0);else c=mix(c5,c6,s-5.0);
 return pow(c,vec3(2.2));}
void main(){float v;if(uBar>0.5)v=vUv.x*2.0-1.0;else{vec3 p=vP*1.0+uSeed;
 v=vn(p*2.5)*0.28+vn(p*6.0)*0.34+vn(p*13.0)*0.36+vn(p*27.0)*0.28+vn(p*55.0)*0.12;v*=1.75;}
 gl_FragColor=vec4(cmap(v)*uI,1.0);}`;

ILM3D.add('⭐',{title:{uz:"Yulduzlar — 3D ko'rgazma",ru:"Звёзды — 3D-демонстрация",en:"Stars — 3D demonstration"},items:[
 {n:{uz:"Yulduz hayot sikli",ru:"Жизненный цикл звезды",en:"Stellar life cycle"},
  d:{uz:"20 soniyalik siklda: gaz-chang buluti siqiladi → protoyulduz qiziydi → asosiy ketma-ketlikdagi sariq yulduz → qizil gigantga kengayadi → tashqi qobiqlar sayyoraviy tumanlik bo'lib tarqaladi, markazda oq mitti qoladi.",ru:"Цикл 20 секунд: газопылевое облако сжимается → протозвезда разогревается → жёлтая звезда главной последовательности → расширение в красного гиганта → внешние слои уходят планетарной туманностью, в центре остаётся белый карлик.",en:"A 20-second cycle: a gas-and-dust cloud collapses → a protostar heats up → a yellow main-sequence star → it swells into a red giant → its outer layers drift off as a planetary nebula, leaving a white dwarf."},
  build(H){const G=new THREE.Group();
   // Molekulyar bulut: Hα (qizil), aks ettiruvchi (ko'k) gaz — additiv; chang — qoramtir, oddiy aralashtirish
   // to'dalar: har birining rangi bitta (Hα / iliq / ko'k aks ettiruvchi) — rang aralashib binafsha bo'lib ketmasin
   const ha=H.lin(0xff3a5a),rf=H.lin(0x5f86ff),wm=H.lin(0xff8a6a),cs=[];for(let i=0;i<30;i++){const v=rnd(1),u=Math.random();cs.push([v[0]*.8,v[1]*.5,v[2]*.8,R(.12,.3),u<.7?ha:u<.85?wm:rf]);}
   const nBig=H.n(380),nF=H.n(1600),nG=nBig+nF,gas=H.particles(nG,{size:.7,intensity:.3}),nD=H.n(260),dust=H.particles(nD,{size:.7,color:0x0d0705,opacity:.4,blend:'normal'});dust.renderOrder=2;
   for(let i=0;i<nG;i++){const c=cs[i%cs.length],big=i<nBig,k=big?1.3:1;gas.pos.set([c[0]+gn()*c[3]*k,c[1]+gn()*c[3]*.8*k,c[2]+gn()*c[3]*k],i*3);pc(gas,i,c[4],big?R(.12,.25):R(.4,1));gas.size[i]=big?R(3.5,5.5):R(.6,1.5);}
   for(let i=0;i<nD;i++){const c=cs[(i*7)%9];dust.pos.set([c[0]+gn()*c[3]*.8,c[1]+gn()*c[3]*.5,c[2]+gn()*c[3]*.8],i*3);dust.size[i]=R(2.5,4.5);}
   gas.upd();dust.upd();const cloud=new THREE.Group();cloud.add(gas,dust);G.add(cloud);
   // Yulduz (qora jism rangi harorat bo'yicha) + protoplanetar disk + bipolyar oqimlar
   const st=H.star(1,3000,{halo:5,glow:.9,intensity:1.3});G.add(st);
   const pd=H.disk(1.15,4.2,{mode:'dust',temp:1400,dust:0x8a5a3c,opacity:0});pd.rotation.x=.3;G.add(pd);
   const jets=[1,-1].map(s=>{const j=H.fatLine(2,0x8fc8ff,{width:3,glow:.9,intensity:1.4,fade:1});j.set([0,6.5*s,0,0,1.1*s,0]);j.rotation.x=.3;G.add(j);return j;});
   // Sayyoraviy tumanlik: ichi — ionlashgan kislorod [O III] (moviy-yashil), tashqi qobiq — Hα/[N II] (qizil)
   const nS=H.n(2600),sh=H.particles(nS,{size:1.1,intensity:.14}),oc=H.lin(0x3fe6d0),rc=H.lin(0xff3a4a),v3=new THREE.Vector3();
   for(let i=0;i<nS;i++){v3.set(gn(),gn()*1.2,gn()).normalize();const out=Math.random()<.6,r=out?1+gn()*.05:R(.2,.9);sh.pos.set([v3.x*r,v3.y*r*1.12,v3.z*r],i*3);pc(sh,i,out?rc:oc,out?R(.6,1.2):R(.3,.7));sh.size[i]=out?R(.6,1.3):R(1,2);}
   sh.upd();const shell=new THREE.Group();shell.add(sh);G.add(shell);
   const PH=[{uz:"Molekulyar bulut",ru:"Молекулярное облако",en:"Molecular cloud"},{uz:"Protoyulduz va chang disk",ru:"Протозвезда и пылевой диск",en:"Protostar and dusty disk"},
    {uz:"Asosiy ketma-ketlik · ~5 800 K",ru:"Главная последовательность · ~5 800 K",en:"Main sequence · ~5,800 K"},{uz:"Qizil gigant · ~3 500 K",ru:"Красный гигант · ~3 500 K",en:"Red giant · ~3,500 K"},
    {uz:"Sayyoraviy tumanlik + oq mitti",ru:"Планетарная туманность + белый карлик",en:"Planetary nebula + white dwarf"}].map(o=>lab(H,G,o,'#dfe8ff',0,-5.8,0,1.15));
   let spin=0,lt=0;
   return {G,cam:[0,4,16],tg:[0,0,0],bloom:.8,u(t){const T=t%20,dt=Math.min(.1,Math.max(0,t-lt));lt=t;
    // bulut siqiladi: impuls momenti saqlanadi — kichraygan sari tezroq aylanadi
    const s=lerp(7,.45,sm(T/5));cloud.scale.setScalar(s);spin+=dt*.12*Math.sqrt(7/s);cloud.rotation.y=spin;
    const co=1-sm((T-3.6)/1.5);cloud.visible=co>0;gas.uniforms.uOp.value=co;dust.uniforms.uOp.value=.4*co;
    gas.uniforms.uSize.value=.7*Math.max(.2,s/7);dust.uniforms.uSize.value=.7*Math.max(.2,s/7);gas.uniforms.uInt.value=.3*(1+1.5*sm((T-2)/2.5));
    let r=1,K=5772,I=.55;const wu=t<.3;
    if(T<3.5){r=0;}else if(T<6){const k=sm((T-3.5)/2.5);r=lerp(.3,1,k);K=lerp(2400,5772,k);I=lerp(.5,.55,k);}
    else if(T<10){}else if(T<14){const k=sm((T-10)/4);r=lerp(1,4.2,k);K=lerp(5772,3400,k);I=lerp(.55,.6,k);}
    else if(T<15.2){const k=sm((T-14)/1.2);r=lerp(4.2,.22,k);K=lerp(3400,30000,k);I=lerp(.6,2.4,k);}else{r=.22;K=lerp(30000,22000,(T-15.2)/4.8);I=2.4;}
    st.visible=r>0||wu;if(r>0||wu){st.scale.setScalar(Math.max(r,1e-3));st.setTemp(K);st.setIntensity(I);st.glow.uniforms.uInt.value=T>=14.5?2.2:(T>=10?.5:.7);st.rotation.y=t*.05;}
    const dk=sm((T-3.6)/1)*(1-sm((T-7.5)/2));pd.visible=dk>0||wu;pd.uniforms.uOp.value=dk;pd.rotation.y=-t*.3;
    const jk=sm((T-4)/.8)*(1-sm((T-6.5)/1.2));jets.forEach(j=>{j.visible=jk>0||wu;j.uniforms.uOp.value=jk;});
    const sk=T>=14?sm((T-14)/.8)*(1-sm((T-17.5)/2.5)):0;shell.visible=sk>0||wu;shell.scale.setScalar(lerp(3.6,7.5,sm((T-14)/6)));sh.uniforms.uOp.value=sk;shell.rotation.y=t*.04;
    const p=T<3.5?0:T<6?1:T<10?2:T<14?3:4;PH.forEach((l,i)=>{l.visible=i===p;});}};}},
 {n:{uz:"Pulsar",ru:"Пульсар",en:"Pulsar"},
  d:{uz:"Neytron yulduz (~20 km) soniyasiga o'nlab–yuzlab marta aylanadi. Magnit qutblaridan chiqqan nur dastalari aylanish o'qiga qiya bo'lgani uchun mayoqdek aylanadi — Yerga tushganda biz «puls» qayd etamiz.",ru:"Нейтронная звезда (~20 км) делает десятки–сотни оборотов в секунду. Лучи из магнитных полюсов наклонены к оси вращения и вращаются, как маяк — попадая на Землю, они дают «импульсы».",en:"A neutron star (~20 km wide) spins tens to hundreds of times per second. Beams from its magnetic poles are tilted from the spin axis and sweep like a lighthouse — when one crosses Earth we see a 'pulse'."},
  build(H){const G=new THREE.Group(),rot=new THREE.Group(),tilt=new THREE.Group();tilt.rotation.z=.9;G.add(rot);rot.add(tilt);
   const ns=H.star(.55,40000,{halo:7,glow:1,intensity:2,gran:.5});rot.add(ns);
   // Nur dastalari (magnit qutblaridan)
   const bU={uCol:{value:H.lin(0x8fcfff)},uInt:{value:.9}};
   [1,-1].forEach(s=>{const g=new THREE.ConeGeometry(1.9,12,32,1,true);g.translate(0,-6,0);
    const m=new THREE.Mesh(g,new THREE.ShaderMaterial({uniforms:bU,vertexShader:BEAM_V,fragmentShader:BEAM_F,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));m.rotation.x=s>0?Math.PI:0;tilt.add(m);});
   // Dipol magnit maydon chiziqlari: r = Rmax·sin²θ (yulduz sirtidan boshlanadi)
   for(let k=0;k<12;k++){const ph=k/12*Math.PI*2,Rm=k%2?3.2:5.4,N=90,a=[],t0=Math.asin(Math.sqrt(.55/Rm));
    for(let i=0;i<N;i++){const th=t0+i/(N-1)*(Math.PI-2*t0),r=Rm*Math.sin(th)**2;a.push(r*Math.sin(th)*Math.cos(ph),r*Math.cos(th),r*Math.sin(th)*Math.sin(ph));}
    const l=H.fatLine(N,0xa080ff,{width:1.4,glow:.7,intensity:.55});l.set(a);tilt.add(l);}
   const mAx=H.fatLine(2,0xb69cff,{width:1,glow:.3,intensity:.35});mAx.set([0,-7,0,0,7,0]);tilt.add(mAx);
   const sAx=H.fatLine(2,0xffffff,{width:1.2,glow:.3,intensity:.3});sAx.set([0,-8.5,0,0,8.5,0]);G.add(sAx);
   // Dastalar bo'ylab uchayotgan relyativistik zarralar
   const nP=H.n(700),P=H.particles(nP,{size:.14,intensity:1.6}),s0=new Float32Array(nP),aa=new Float32Array(nP),rr=new Float32Array(nP),sg=new Float32Array(nP),pcol=H.lin(0xcfe8ff);
   for(let i=0;i<nP;i++){s0[i]=Math.random();aa[i]=Math.random()*6.283;rr[i]=Math.sqrt(Math.random());sg[i]=i%2?1:-1;}tilt.add(P);
   // Pulsar shamoli tumanligi (sinxrotron, ekvator tekisligida)
   const nT=H.n(900),Tn=H.particles(nT,{size:1.6,intensity:.035,color:0x6fa8ff});
   for(let i=0;i<nT;i++){const r=R(1.8,4.8),a=Math.random()*6.283;Tn.pos.set([r*Math.cos(a),gn()*.22,r*Math.sin(a)],i*3);Tn.size[i]=R(.7,1.3);}Tn.upd();G.add(Tn);
   lab(H,G,{uz:"Aylanish o'qi",ru:"Ось вращения",en:"Spin axis"},'#e0e8ff',0,9.2,0,1);
   lab(H,tilt,{uz:"Magnit o'qi",ru:"Магнитная ось",en:"Magnetic axis"},'#c8b4ff',0,-7.6,0,.95);
   lab(H,tilt,{uz:"Nur dastasi",ru:"Луч",en:"Radio beam"},'#9fd8ff',0,10.5,0,.95);
   lab(H,G,{uz:"Neytron yulduz",ru:"Нейтронная звезда",en:"Neutron star"},'#ffffff',0,-1.5,0,.9);
   // «Puls»: dasta kuzatuvchi (kamera) tomon qaraganda yulduz chaqnaydi — mayoq effekti
   const ax=new THREE.Vector3(),cd=new THREE.Vector3();
   ns.onBeforeRender=(r,s,c)=>{ax.set(0,1,0).transformDirection(tilt.matrixWorld);cd.copy(c.position).normalize();const d=Math.abs(ax.dot(cd)),p=Math.exp(-(1-d)/.006);
    ns.glow.uniforms.uInt.value=1+6*p;ns.uniforms.uInt.value=2+2*p;bU.uInt.value=.9+1.4*p;};
   return {G,cam:[10,10.2,10],tg:[0,0,0],bloom:.9,u(t){rot.rotation.y=t*2.2;
    for(let i=0;i<nP;i++){const s=(s0[i]+t*.22)%1,d=.6+s*11,w=d*1.9/12*rr[i];P.pos[i*3]=w*Math.cos(aa[i]);P.pos[i*3+1]=d*sg[i];P.pos[i*3+2]=w*Math.sin(aa[i]);pc(P,i,pcol,Math.pow(1-s,1.5));}
    P.upd();Tn.rotation.y=t*.05;}};}},
 {n:{uz:"Spektral sinflar",ru:"Спектральные классы",en:"Spectral classes"},
  d:{uz:"O dan M gacha bo'lgan asosiy ketma-ketlik yulduzlari: issiqroq yulduzlar ko'kish va kattaroq, sovuqlari qizg'ish va kichikroq. O'lchamlar nisbiy (taxminiy), Quyosh — G sinf.",ru:"Звёзды главной последовательности от O до M: горячие — голубоватые и крупнее, холодные — красноватые и меньше. Размеры относительные (приблизительно), Солнце — класс G.",en:"Main-sequence stars from O to M: hotter stars are bluer and larger, cooler ones redder and smaller. Sizes are relative (approximate); the Sun is class G."},
  build(H){const G=new THREE.Group(),S=[],D=[['O',40000,3,'40 000 K'],['B',20000,2.2,'20 000 K'],['A',8500,1.5,'8 500 K'],['F',6600,1.2,'6 600 K'],['G',5772,1,'5 800 K'],['K',4400,.8,'4 400 K'],['M',3200,.45,'3 200 K']];let x=-14;
   const sun={uz:"Quyosh",ru:"Солнце",en:"Sun"};
   D.forEach((d,i)=>{x+=d[2];const s=H.star(d[2],d[1],{halo:2.6,glow:.55,intensity:.85,spots:d[0]==='G'?.35:(d[0]==='M'?.5:0),gran:1,seg:H.seg(56)});s.position.x=x;G.add(s);S.push(s);
    const ly=-d[2]-1.75-(i%2)*.6;lab(H,G,d[0],sRGB(H.bb(d[1])),x,-d[2]-1,0,1.35);lab(H,G,d[3],'#9fb0cc',x,ly,0,.85);if(d[0]==='G')lab(H,G,sun,'#ffe9a8',x,ly-.55,0,.85);x+=d[2]+1.1;});
   G.position.x=-(x-14)/2-0.5;
   return {G,cam:[0,3,22],tg:[0,0,0],bloom:.55,u(t){G.rotation.y=Math.sin(t*.3)*.25;S.forEach((s,i)=>{s.rotation.y=t*(.06+i*.01);});}};}}
]});

ILM3D.add('💥',{title:{uz:"Katta portlash — 3D ko'rgazma",ru:"Большой взрыв — 3D-демонстрация",en:"Big Bang — 3D demonstration"},items:[
 {n:{uz:"Koinot vaqt chizig'i",ru:"Временная шкала Вселенной",en:"Timeline of the Universe"},
  d:{uz:"Chapdan o'ngga: Katta portlash → inflyatsiya (keskin kengayish) → relikt nurlanish → «qorong'i asrlar» → birinchi yulduzlar va galaktikalar → bugungi tezlashayotgan kengayish (qorong'i energiya).",ru:"Слева направо: Большой взрыв → инфляция (резкое расширение) → реликтовое излучение → «тёмные века» → первые звёзды и галактики → нынешнее ускоренное расширение (тёмная энергия).",en:"Left to right: Big Bang → inflation (sudden expansion) → background radiation → 'dark ages' → first stars and galaxies → today's accelerating expansion (dark energy)."},
  build(H){const G=new THREE.Group(),Tb=new THREE.Group();G.add(Tb);
   const rad=k=>k<.06?lerp(.05,2.2,sm(k/.06)):2.2+k*2.2+Math.pow(k,3)*3.2,X=k=>-13+26*k;
   // «Karnay» sirti — fazo: issiq plazma → relikt nurlanish yuzasi → qorong'i asrlar → bugungi fazo
   const n1=H.n(10000),S=H.particles(n1,{size:.22,intensity:1}),cH=H.bb(14000),cO=H.bb(2900),cD=H.lin(0x8a3018),cF=H.lin(0x4a6cff),c=new THREE.Color();
   for(let i=0;i<n1;i++){const k=Math.random(),r=rad(k)*(1+gn()*.015),a=Math.random()*6.283;S.pos.set([X(k),r*Math.cos(a),r*Math.sin(a)],i*3);let b;
    if(k<.1){c.copy(cH).lerp(cO,k/.1);b=2.2-k*14;}else if(k<.14){c.copy(cO);b=.7+1.1*Math.exp(-Math.pow((k-.12)/.012,2));}
    else if(k<.33){c.copy(cO).lerp(cD,sm((k-.14)/.06));b=lerp(.5,.13,sm((k-.14)/.06));}else{c.copy(cD).lerp(cF,sm((k-.33)/.1));b=.12;}
    pc(S,i,c,b);S.size[i]=R(.7,1.3);}
   S.upd();Tb.add(S);
   // Ichki tarkib: birinchi yulduzlar (ko'k-oq) va galaktikalar (to'dalar)
   const n2=H.n(5200),nF=Math.round(n2*.12),Q=H.particles(n2,{size:.13,intensity:1.2,twinkle:.35});
   for(let i=0;i<nF;i++){const k=R(.33,.43),r=rad(k)*.85*Math.sqrt(Math.random()),a=Math.random()*6.283;Q.pos.set([X(k),r*Math.cos(a),r*Math.sin(a)],i*3);pc(Q,i,H.bb(R(15000,30000)),R(1,2.2));Q.size[i]=R(.8,1.4);}
   for(let i=nF;i<n2;){const k=.43+.57*Math.random(),r=rad(k)*.82*Math.sqrt(Math.random()),a=Math.random()*6.283,cx=X(k),cy=r*Math.cos(a),cz=r*Math.sin(a),yng=1-sm((k-.45)/.5),sp=R(.1,.2);
    for(let j=0;j<14&&i<n2;j++,i++){Q.pos.set([cx+gn()*sp,cy+gn()*sp*.6,cz+gn()*sp],i*3);pc(Q,i,H.bb(Math.random()<yng*.7+.15?R(9000,16000):R(4200,5600)),R(.5,1.2));Q.size[i]=R(.6,1.2);}}
   Q.upd();Tb.add(Q);
   const bb=H.glow(0xfff0d8,4.5,1.6);bb.position.x=X(0);G.add(bb);
   const ring=H.fatLine(91,0xbfe0ff,{width:1.6,glow:.6,intensity:.6});Tb.add(ring);const rp=new Float32Array(91*3);
   const E=[[0,{uz:"Katta portlash",ru:"Большой взрыв",en:"Big Bang"},'0','#fff0d0'],[.05,{uz:"Inflyatsiya",ru:"Инфляция",en:"Inflation"},'10⁻³² s','#ffd9a0'],
    [.12,{uz:"Relikt nurlanish",ru:"Реликтовое излучение",en:"CMB released"},{uz:"380 ming yil",ru:"380 тыс. лет",en:"380,000 yr"},'#ffb070'],[.23,{uz:"Qorong'i asrlar",ru:"Тёмные века",en:"Dark ages"},'','#d09a80'],
    [.38,{uz:"Birinchi yulduzlar",ru:"Первые звёзды",en:"First stars"},{uz:"~200 mln yil",ru:"~200 млн лет",en:"~200 Myr"},'#bcd4ff'],[.63,{uz:"Galaktikalar",ru:"Галактики",en:"Galaxies"},{uz:"~1 mlrd yil",ru:"~1 млрд лет",en:"~1 Gyr"},'#ffe6b0'],
    [.93,{uz:"Qorong'i energiya: tezlashish",ru:"Тёмная энергия: ускорение",en:"Dark energy: acceleration"},{uz:"bugun · 13,8 mlrd yil",ru:"сегодня · 13,8 млрд лет",en:"today · 13.8 Gyr"},'#d0b8ff']];
   E.forEach(([k,t1,t2,col],i)=>{const up=i%2===1,y=(rad(k)+1.3)*(up?1:-1),x=i===0?X(0)-1.6:X(k);lab(H,G,t1,col,x,y,0,1.05);if(t2)lab(H,G,t2,'#9fb0cc',x,y+(up?.75:-.75),0,.8);});
   return {G,cam:[2,6,22],tg:[0,0,0],bloom:.8,u(t){const k=(t*.06)%1,r=rad(k)+.15;for(let j=0;j<=90;j++){const a=j/90*Math.PI*2;rp[j*3]=X(k);rp[j*3+1]=r*Math.cos(a);rp[j*3+2]=r*Math.sin(a);}ring.set(rp);Tb.rotation.x=t*.1;}};}},
 {n:{uz:"Kengayayotgan fazo",ru:"Расширяющееся пространство",en:"Expanding space"},
  d:{uz:"Galaktikalar fazoda «uchib» ketmaydi — fazoning o'zi kengayadi, shar sirtidagi nuqtalar kabi. Har bir galaktikadan qaraganda boshqalari uzoqlashayotgandek ko'rinadi, uzoqroqlari esa tezroq — bu Xabbl qonuni. Kengaygan sari nur qizil tomonga siljiydi.",ru:"Галактики не «летят» сквозь пространство — расширяется само пространство, как поверхность воздушного шара. Из любой галактики видно, что остальные удаляются, причём дальние — быстрее: это закон Хаббла. С расширением свет краснеет.",en:"Galaxies don't fly through space — space itself expands, like dots on an inflating balloon. From any galaxy the others appear to recede, the farther ones faster — Hubble's law. As space stretches, light shifts toward red."},
  build(H){const G=new THREE.Group(),S=new THREE.Group();G.add(S);
   const bm=rimMat(H,0x3f8cff,{grid:.45,rim:.7,side:THREE.DoubleSide}),ball=new THREE.Mesh(new THREE.SphereGeometry(1,H.seg(64),H.seg(32)),bm);S.add(ball);
   // Galaktikalar sirtda: ular o'zi kattalashmaydi (tortishish bilan bog'langan), faqat oralig'idagi masofa o'sadi
   const n=H.n(600),P=H.particles(n,{size:.3,intensity:1.1}),f=H.fib(n),v=new THREE.Vector3();
   for(let i=0;i<n;i++){v.set(f[i*3]+gn()*.03,f[i*3+1]+gn()*.03,f[i*3+2]+gn()*.03).normalize().multiplyScalar(1.004);P.pos.set([v.x,v.y,v.z],i*3);const el=Math.random()<.35;pc(P,i,H.bb(el?R(4200,5200):R(6500,11000)),R(.5,1.1));P.size[i]=el?R(.6,1):R(.7,1.4);}
   P.upd();S.add(P);
   const A=new THREE.Vector3(.15,.35,1).normalize(),B=new THREE.Vector3(.95,.55,.25).normalize();
   const me=H.glow(0x9fd0ff,1,1.2);me.position.copy(A).multiplyScalar(1.004);S.add(me);
   const lMe=lab(H,S,{uz:"Biz",ru:"Мы",en:"Us"},'#bfe0ff',A.x*1.14,A.y*1.14+.04,A.z*1.14,1);
   // Ikki galaktika orasidagi nur to'lqini: fazo bilan birga cho'ziladi → to'lqin uzunligi ortadi (qizil siljish)
   const NW=160,W=H.fatLine(NW,0x6fb8ff,{width:2.4,glow:.8,intensity:1.5}),wp=new Float32Array(NW*3),cb=H.lin(0x6fb8ff),cr=H.lin(0xff3a2a),q=new THREE.Vector3(),om=A.angleTo(B);S.add(W);
   const M=A.clone().add(B).normalize();const lW=lab(H,S,{uz:"Nur cho'ziladi → qizil siljish",ru:"Свет растягивается → красное смещение",en:"Light stretches → redshift"},'#ffc0a8',M.x*1.25,M.y*1.25,M.z*1.25,.95);
   return {G,cam:[0,4,20],tg:[0,0,0],bloom:.8,u(t){const k=(t%10)/10,s=1.5+k*6,fo=sm(k/.06)*(1-sm((k-.92)/.08));S.scale.setScalar(s);me.scale.setScalar(1/s);
    bm.uniforms.uOp.value=.9*fo;P.uniforms.uOp.value=fo;W.uniforms.uOp.value=fo;lMe.material.opacity=fo;lW.material.opacity=fo*sm((s-3.2)/1.2);
    for(let i=0;i<NW;i++){const u=i/(NW-1),sa=Math.sin((1-u)*om)/Math.sin(om),sb=Math.sin(u*om)/Math.sin(om);q.copy(A).multiplyScalar(sa).addScaledVector(B,sb);
     q.multiplyScalar(1.01+.035*Math.sin(u*Math.PI*2*7-t*5)*Math.sin(u*Math.PI));wp[i*3]=q.x;wp[i*3+1]=q.y;wp[i*3+2]=q.z;}
    W.set(wp);W.uniforms.uCol.value.copy(cb).lerp(cr,sm(k*1.1));G.rotation.y=t*.15;}};}},
 {n:{uz:"Relikt nurlanish xaritasi",ru:"Карта реликтового излучения",en:"Background radiation map"},
  d:{uz:"Butun osmondagi relikt nurlanishning harorat farqlari (taxminiy tasvir). Farq atigi ~0,00001 daraja, lekin aynan shu «dog'lar» keyinchalik galaktikalar va klasterlar urug'iga aylangan.",ru:"Перепады температуры реликтового излучения по всему небу (схематично). Разница всего ~0,00001 градуса, но именно эти «пятна» стали зародышами галактик и скоплений.",en:"Temperature differences of the background radiation across the whole sky (illustrative). They are only ~0.00001 degrees, yet these 'spots' became the seeds of galaxies and clusters."},
  build(H){const G=new THREE.Group(),mk=bar=>{const m=new THREE.ShaderMaterial({uniforms:{uBar:{value:bar},uI:{value:.85},uSeed:{value:new THREE.Vector3(R(0,50),R(0,50),R(0,50))}},vertexShader:CMB_V,fragmentShader:CMB_F});H.fx({real:true});return m;};
   const m=new THREE.Mesh(new THREE.SphereGeometry(4.6,H.seg(96),H.seg(64)),mk(0));G.add(m);
   const halo=new THREE.Mesh(new THREE.SphereGeometry(4.75,H.seg(48),H.seg(24)),rimMat(H,0xffd9b0,{rim:.18}));G.add(halo);
   const bar=new THREE.Mesh(new THREE.PlaneGeometry(7,.32),mk(1));bar.position.set(0,-5.75,0);G.add(bar);
   lab(H,G,{uz:"sovuqroq",ru:"холоднее",en:"colder"},'#7fb0ff',-4.7,-5.75,0,.9);lab(H,G,{uz:"issiqroq",ru:"теплее",en:"warmer"},'#ff9a6a',4.7,-5.75,0,.9);
   lab(H,G,'T₀ = 2,725 K','#e8e0d0',0,-6.3,0,.9);
   return {G,cam:[0,0,15],tg:[0,-.6,0],real:true,bloom:.2,u(t){m.rotation.y=t*.12;}};}}
]});

ILM3D.add('🌑',{title:{uz:"Qorong'i materiya — 3D ko'rgazma",ru:"Тёмная материя — 3D-демонстрация",en:"Dark matter — 3D demonstration"},items:[
 {n:{uz:"Galaktika va qorong'i gala",ru:"Галактика и тёмное гало",en:"Galaxy and dark halo"},
  d:{uz:"Yulduzlar (oq) diskda aylanadi, tashqi yulduzlar ham ichkaridagidek tez harakatlanadi. Buni faqat galaktikani o'rab turgan ko'rinmas qorong'i materiya galasi (binafsha) tushuntira oladi — uning massasi ko'rinadigan moddadan ~5 marta ko'p.",ru:"Звёзды (белые) вращаются в диске, и внешние движутся так же быстро, как внутренние. Объяснить это может только невидимое гало тёмной материи (фиолетовое) — его масса примерно в 5 раз больше видимой.",en:"Stars (white) orbit in the disc, and the outer ones move as fast as the inner ones. Only an invisible dark-matter halo (purple) around the galaxy can explain this — it outweighs visible matter about 5 to 1."},
  build(H){const G=new THREE.Group(),V=1.25,vr=r=>V*(1-Math.exp(-r/1.2));
   // Disk yulduzlari: tekis aylanish egri chizig'i v(r)≈const → burchak tezligi v/r
   const nD=H.n(8000),D=H.particles(nD,{size:.13,intensity:.55}),Rd=new Float32Array(nD),Th=new Float32Array(nD),Yd=new Float32Array(nD),Wd=new Float32Array(nD);
   for(let i=0;i<nD;i++){const r=Math.min(9.5,.4-2.6*Math.log(1-Math.random()*.97));Rd[i]=r;Th[i]=Math.random()*6.283;Yd[i]=gn()*.12;Wd[i]=vr(r)/r;pc(D,i,H.bb(R(4200,7000)),R(.4,1));D.size[i]=R(.6,1.4);}
   G.add(D);
   // Balj — keksa sarg'ish yulduzlar
   const bulge=new THREE.Group(),nB=H.n(3000),B=H.particles(nB,{size:.17,intensity:.6});
   for(let i=0;i<nB;i++){B.pos.set([gn()*1,gn()*.55,gn()*1],i*3);pc(B,i,H.bb(R(3600,5000)),R(.5,1));B.size[i]=R(.6,1.4);}B.upd();bulge.add(B,H.glow(0xffdcaa,5,1.1));G.add(bulge);
   // Spiral qo'llar (to'lqin naqshi sekin aylanadi): yosh ko'k yulduzlar, pushti HII hududlar, ichki chetida chang yo'laklari
   const arms=new THREE.Group(),pk=1/Math.tan(14*Math.PI/180),arm=(a,r)=>a*Math.PI-Math.log(r/1.6)*pk;
   const nA=H.n(5500),A=H.particles(nA,{size:.13,intensity:.95});
   for(let i=0;i<nA;i++){const r=1.6+7.6*Math.pow(Math.random(),.8),th=arm(i%2,r)+gn()*.13,rr=r+gn()*.18;A.pos.set([rr*Math.cos(th),gn()*.07,rr*Math.sin(th)],i*3);pc(A,i,H.bb(R(9000,26000)),R(.5,1.3));A.size[i]=R(.6,1.4);}
   const nH=H.n(240),HII=H.particles(nH,{size:.5,intensity:.8,color:0xff4f86});
   for(let i=0;i<nH;i++){const r=2+7*Math.random(),th=arm(i%2,r)+.06+gn()*.06;HII.pos.set([r*Math.cos(th)+gn()*.12,gn()*.05,r*Math.sin(th)+gn()*.12],i*3);HII.size[i]=R(.5,1.3);}
   const nU=H.n(1300),Du=H.particles(nU,{size:.4,color:0x1c120a,opacity:.2,blend:'normal'});Du.renderOrder=3;
   for(let i=0;i<nU;i++){const r=1.4+7.4*Math.pow(Math.random(),.9),th=arm(i%2,r)-.2+gn()*.06;Du.pos.set([r*Math.cos(th),gn()*.04,r*Math.sin(th)],i*3);Du.size[i]=R(.6,1.4);}
   A.upd();HII.upd();Du.upd();arms.add(A,HII,Du);G.add(arms);
   // Qorong'i materiya galasi — yumshoq hajmli binafsha tuman (markazga zichlashgan)
   const nX=H.n(700),X=H.particles(nX,{size:3.2,intensity:.022,color:0x8a55ff}),v=new THREE.Vector3();
   for(let i=0;i<nX;i++){v.set(gn(),gn(),gn()).normalize().multiplyScalar(13*Math.pow(Math.random(),.6));X.pos.set([v.x,v.y,v.z],i*3);X.size[i]=R(.6,1.4);}X.upd();
   const hG=new THREE.Group();hG.add(X);G.add(hG);
   // Ikki kuzatuvchi yulduz: ichki (r=3) va tashqi (r=8) — iz uzunligi teng = tezlik teng
   const trc=[3,8].map(r=>{const m=H.particles(1,{size:.5,intensity:2.5,color:0x7fe8ff}),L=H.fatLine(40,0x7fe8ff,{width:2.2,glow:.7,fade:1,intensity:1.1});G.add(m,L);
    const l=lab(H,G,'≈ 220 km/s','#9ff0ff',0,0,0,.9);return {r,m,L,l,p:new Float32Array(120)};});
   // Aylanish egri chizig'i grafigi
   const gr=new THREE.Group();gr.position.set(14.5,-2,-1);gr.rotation.y=-.35;G.add(gr);
   const vexp=r=>6*r/Math.pow(1.44+r*r,.75),vobs=r=>Math.sqrt(vexp(r)**2+(3.2*(1-Math.exp(-r/3)))**2),curve=(f,col)=>{const a=[];for(let i=0;i<64;i++){const r=.05+i/63*9;a.push(r,f(r),0);}const l=H.fatLine(64,col,{width:2.4,glow:.6,intensity:1.2});l.set(a);gr.add(l);};
   const axs=H.fatLine(3,0x8899bb,{width:1.3,glow:.2,intensity:.7});axs.set([0,4.8,0,0,0,0,9.4,0,0]);gr.add(axs);curve(vobs,0x7fe8ff);curve(vexp,0xffa060);
   lab(H,gr,{uz:"Aylanish egri chizig'i",ru:"Кривая вращения",en:"Rotation curve"},'#e0e8ff',4.6,5.5,0,1);
   lab(H,gr,{uz:"kuzatilgan",ru:"наблюдаемая",en:"observed"},'#9ff0ff',8,vobs(9)+.5,0,.9);
   lab(H,gr,{uz:"faqat ko'rinadigan modda",ru:"только видимое вещество",en:"visible matter only"},'#ffb880',6.6,vexp(9)-.6,0,.9);
   lab(H,gr,'r','#aab8d0',9.8,0,0,.9);lab(H,gr,'v','#aab8d0',0,5.2,0,.9);
   lab(H,G,{uz:"Qorong'i materiya galasi",ru:"Гало тёмной материи",en:"Dark-matter halo"},'#b89cff',-7,6.5,0,1.05);
   return {G,cam:[3,10,22],tg:[4,0,0],bloom:.75,u(t){const p=D.pos;for(let i=0;i<nD;i++){const r=Rd[i],th=Th[i]+Wd[i]*t;p[i*3]=r*Math.cos(th);p[i*3+1]=Yd[i];p[i*3+2]=r*Math.sin(th);}
    D.geometry.attributes.position.needsUpdate=true;bulge.rotation.y=-t*.5;arms.rotation.y=-t*.05;hG.rotation.y=t*.02;
    trc.forEach(o=>{const w=vr(o.r)/o.r,th=w*t,L=V*2.6/o.r;for(let i=0;i<40;i++){const a=th-L*(1-i/39);o.p[i*3]=o.r*Math.cos(a);o.p[i*3+1]=.05;o.p[i*3+2]=o.r*Math.sin(a);}
     o.L.set(o.p);o.m.pos[0]=o.p[117];o.m.pos[1]=.05;o.m.pos[2]=o.p[119];o.m.geometry.attributes.position.needsUpdate=true;o.l.position.set(o.p[117],.9,o.p[119]);});}};}},
 {n:{uz:"Gravitatsion linzalanish",ru:"Гравитационное линзирование",en:"Gravitational lensing"},
  d:{uz:"Old tomondan o'tayotgan massiv klaster (sariq) orqadagi galaktikalar (ko'k nuqtalar) nurini egadi. To'liq bir chiziqqa tushganda «Eynshteyn halqasi» paydo bo'ladi. Tasvirlar buzilishidan ko'rinmas massa xaritasi tuziladi.",ru:"Массивное скопление (жёлтое), проходя впереди, искривляет свет галактик позади (синие точки). При точном совпадении возникает «кольцо Эйнштейна». По искажениям строят карту невидимой массы.",en:"A massive cluster (yellow) passing in front bends light from galaxies behind it (blue dots). When perfectly aligned an 'Einstein ring' appears. The distortions are used to map invisible mass."},
  build(H){const G=new THREE.Group(),NG=72,m=Math.max(12,H.n(28)),N=NG*m,E=2.4;
   // Orqa fondagi galaktikalar (manba tekisligi) — har biri elliptik zarralar to'dasi; har zarra alohida linzalanadi → yoysimon tasvirlar
   const gal=[];for(let g=0;g<NG;g++){const c=g===0;gal.push({x:c?0:R(-12,12),y:c?0:R(-8,8),a:c?.5:R(.15,.42),q:R(.35,1),ph:R(0,3.14),blue:c||Math.random()<.72});}
   const P=H.particles(N*2,{size:.42,intensity:.45}),sx=new Float32Array(N),sy=new Float32Array(N),bs=new Float32Array(N);
   for(let g=0;g<NG;g++){const o=gal[g],cs=Math.cos(o.ph),sn=Math.sin(o.ph);for(let j=0;j<m;j++){const i=g*m+j,u=gn()*o.a*.6,w=gn()*o.a*.6*o.q;sx[i]=o.x+u*cs-w*sn;sy[i]=o.y+u*sn+w*cs;
    const col=o.blue?H.bb(R(11000,22000)):H.bb(R(3800,5200)),br=Math.exp(-(u*u+w*w)/(o.a*o.a*.5))*.9+.25;pc(P,i,col,br);pc(P,i+N,col,br);bs[i]=R(.8,1.25)*(o.a/.3);}}
   G.add(P);
   // Old fondagi klaster: markaziy gigant elliptik galaktika, a'zo galaktikalar va klasterichi diffuz nur
   const lens=new THREE.Group();G.add(lens);lens.add(H.glow(0xffd9a0,2.6,1.4),H.glow(0xffc880,10,.18));
   for(let i=0;i<14;i++){const g=H.glow(0xffcf8a,R(.6,1.3),R(.5,.9));g.position.set(gn()*1.6,gn()*1.3,gn()*.5);lens.add(g);}
   lab(H,lens,{uz:"Galaktika klasteri (linza)",ru:"Скопление галактик (линза)",en:"Galaxy cluster (lens)"},'#ffd890',0,-3.6,0,1);
   return {G,cam:[0,0,22],tg:[0,0,0],bloom:.7,u(t){const lx=Math.sin(t*.35)*8,ly=Math.sin(t*.23)*1.5,ps=P.pos,sz=P.size;lens.position.set(lx,ly,3);
    for(let k=0;k<N;k++){const dx=sx[k]-lx,dy=sy[k]-ly,b=Math.hypot(dx,dy)||1e-3,sq=Math.sqrt(b*b+4*E*E),tp=(b+sq)/2,tm=(b-sq)/2,ex=dx/b,ey=dy/b;
     ps[k*3]=lx+ex*tp;ps[k*3+1]=ly+ey*tp;ps[k*3+2]=-4;const j=k+N;ps[j*3]=lx+ex*tm;ps[j*3+1]=ly+ey*tm;ps[j*3+2]=-4;
     sz[k]=bs[k]*Math.min(3,Math.sqrt(tp/b));sz[j]=bs[k]*Math.min(3,Math.sqrt(-tm/b))*.8;}
    P.geometry.attributes.position.needsUpdate=true;P.geometry.attributes.aSize.needsUpdate=true;}};}},
 {n:{uz:"Kosmik to'r",ru:"Космическая паутина",en:"Cosmic web"},
  d:{uz:"Eng katta masshtabda qorong'i materiya iplar va tugunlardan iborat «to'r» hosil qiladi. Galaktikalar shu iplar bo'ylab joylashadi, tugunlarda esa ulkan klasterlar to'planadi; oralig'ida bo'shliqlar qoladi.",ru:"На самых больших масштабах тёмная материя образует «паутину» из нитей и узлов. Галактики располагаются вдоль нитей, в узлах собираются гигантские скопления, между ними — пустоты.",en:"On the largest scales dark matter forms a 'web' of filaments and nodes. Galaxies line the filaments, giant clusters gather at the nodes, and voids lie in between."},
  build(H){const G=new THREE.Group(),K=45,nd=[],deg=new Array(K).fill(0),fil=[];for(let i=0;i<K;i++)nd.push([(Math.random()-.5)*24,(Math.random()-.5)*24,(Math.random()-.5)*24]);
   nd.forEach((p,i)=>{nd.map((q,j)=>[j,Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])]).filter(x=>x[0]!==i).sort((x,y)=>x[1]-y[1]).slice(0,3).forEach(([j])=>{if(j<i&&fil.some(f=>f[0]===j&&f[1]===i))return;fil.push([i,j]);deg[i]++;deg[j]++;});});
   // Har bir ip — egilgan (kvadratik Bezier) quvur shaklidagi zarralar buluti; zichlik o'qda yuqori
   const per=H.n(300),nn=H.n(110),N=fil.length*per+K*nn,P=H.particles(N,{size:.45,intensity:.15}),cV=H.lin(0x5b3cff),cB=H.lin(0x6f9bff),cO=H.lin(0xffa24a),cW=H.lin(0xfff0d8),c=new THREE.Color();
   const bz=fil.map(([i,j])=>{const a=nd[i],b=nd[j],L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);return [a,[(a[0]+b[0])/2+gn()*L*.12,(a[1]+b[1])/2+gn()*L*.12,(a[2]+b[2])/2+gn()*L*.12],b];});
   const bp=(z,f,o)=>{const u=1-f;for(let k=0;k<3;k++)o[k]=u*u*z[0][k]+2*u*f*z[1][k]+f*f*z[2][k];return o;},o3=[0,0,0];let q=0;
   bz.forEach(z=>{for(let s=0;s<per;s++,q++){const f=Math.random();bp(z,f,o3);const dx=gn()*.32,dy=gn()*.32,dz=gn()*.32,d=Math.sqrt(dx*dx+dy*dy+dz*dz)/.55;P.pos.set([o3[0]+dx,o3[1]+dy,o3[2]+dz],q*3);
    c.copy(cB).lerp(cV,cl(d));const e=Math.min(f,1-f);if(e<.12)c.lerp(cO,(1-e/.12)*.6);pc(P,q,c,.5+.8*Math.exp(-d*d*2));P.size[q]=R(.6,1.4);}});
   nd.forEach((p,i)=>{const sg=.35+.15*deg[i];for(let s=0;s<nn;s++,q++){const dx=gn()*sg,dy=gn()*sg,dz=gn()*sg,d=Math.sqrt(dx*dx+dy*dy+dz*dz)/sg;P.pos.set([p[0]+dx,p[1]+dy,p[2]+dz],q*3);c.copy(cW).lerp(cO,cl(d*.6));pc(P,q,c,1.2*Math.exp(-d*.6));P.size[q]=R(.6,1.4);}});
   P.upd();G.add(P);
   // Galaktikalar — iplar bo'ylab mayda yorqin nuqtalar; tugunlarda — klaster nuri
   const nGx=H.n(2600),Q=H.particles(nGx,{size:.09,intensity:1.6,twinkle:.3});
   for(let i=0;i<nGx;i++){const z=bz[(Math.random()*bz.length)|0];bp(z,Math.random(),o3);Q.pos.set([o3[0]+gn()*.14,o3[1]+gn()*.14,o3[2]+gn()*.14],i*3);pc(Q,i,H.bb(R(4500,9500)),R(.5,1.2));Q.size[i]=R(.6,1.5);}Q.upd();G.add(Q);
   let big=0;nd.forEach((p,i)=>{if(deg[i]>deg[big])big=i;if(deg[i]>=4){const g=H.glow(0xffb070,1.2+deg[i]*.45,.55);g.position.set(...p);G.add(g);}});
   lab(H,G,{uz:"Tugun — galaktika klasteri",ru:"Узел — скопление галактик",en:"Node — galaxy cluster"},'#ffc890',nd[big][0],nd[big][1]-2.2,nd[big][2],1);
   let lf=0,ll=0;bz.forEach((z,i)=>{const L=Math.hypot(z[2][0]-z[0][0],z[2][1]-z[0][1],z[2][2]-z[0][2]);if(L>ll){ll=L;lf=i;}});bp(bz[lf],.5,o3);
   lab(H,G,{uz:"Ip (filament)",ru:"Нить (филамент)",en:"Filament"},'#a9b8ff',o3[0],o3[1]+1.2,o3[2],1);
   let vb=null,vd=0;for(let i=0;i<300;i++){const p=[R(-8,8),R(-8,8),R(-8,8)];let md=1e9;nd.forEach(n=>{md=Math.min(md,Math.hypot(p[0]-n[0],p[1]-n[1],p[2]-n[2]));});bz.forEach(z=>{for(let f=.25;f<.8;f+=.25){bp(z,f,o3);md=Math.min(md,Math.hypot(p[0]-o3[0],p[1]-o3[1],p[2]-o3[2]));}});if(md>vd){vd=md;vb=p;}}
   lab(H,G,{uz:"Bo'shliq (void)",ru:"Пустота (войд)",en:"Void"},'#8090b0',vb[0],vb[1],vb[2],1);
   return {G,cam:[0,6,34],tg:[0,0,0],bloom:.8,u(t){G.rotation.y=t*.06;G.rotation.x=Math.sin(t*.05)*.2;}};}}
]});
})();
