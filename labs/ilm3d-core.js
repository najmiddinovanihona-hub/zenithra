// Ilmiy bo'lim — umumiy 3D ko'rgazma dvigateli (bitta WebGLRenderer, bitta kontekst)
/* ============================ API (ko'rgazma yozuvchilar uchun) ============================
 Element: { n, d, build(H) → { G:Object3D, cam:[x,y,z], tg:[x,y,z], u(t), ...fx } }.
 REALISTIK REJIM: build ichida yangi yordamchilardan (star/planet/glow/particles/disk/surface/fatLine/tube/std/sunLight)
 birortasi chaqirilsa YOKI natijada real:true bo'lsa — sahna HDR (half-float) nishonga chiziladi, so'ng
 bloom + ACES filmic tone mapping + sRGB chiqish. Eski elementlar (faqat ball/pts/line…) avvalgidek chiziladi.
 Natijadagi ixtiyoriy fx maydonlari (yoki build/u ichida H.fx({...})):
   real:true|false        — rejimni majburlash
   bg:'space'|'stars'|'dark'|'none'  — yulduzlar+Somon yo'li | faqat yulduzlar | qop-qora | shaffof (CSS fon)  [standart 'space']
   bloom:0.7 | {strength,threshold,radius} | false — nurlanish (HDR yorqinlik > threshold≈1 bo'lgan joylar)
   exposure:1             — ekspozitsiya (H.fx({exposure:3}) bilan u(t) ichida chaqnash qilish mumkin)
   amb:0.05               — umumiy AmbientLight (realistik rejimda; eski rejimda 0.35). Markazdagi PointLight(1.4) doim bor.
 RANG: yordamchilar sRGB rang oladi (0xffaa33, '#fff', Color) va ichkarida chiziqliga o'giradi.
   H.lin(c), H.bb(K) natijalari chiziqli deb belgilangan — qayta o'girilmaydi. O'zingiz yasagan oddiy
   materiallarga (MeshBasic/Standard) realistik rejimda rangni H.lin(0x...) orqali bering.
 Yordamchilar:
   H.q / H.n(n) / H.seg(n)       — sifat darajasi ('low'|'mid'|'high'), zarralar va sfera segmentlari soni (QUALITY bo'yicha)
   H.lin(c) → Color             — sRGB → chiziqli rang
   H.bb(K) → Color              — qora jism (Planck × CIE 1931) rangi, chiziqli, eng katta kanal=1. H.bb(5772) ≈ Quyosh
   H.tick(fn(t,dt))             — har kadrda chaqiriladi (element almashganda o'chadi)
   H.fx({bg,bloom,exposure,amb})— joriy element effektlarini o'zgartirish (build yoki u ichida)
   H.star(r,K,{intensity:1.5,halo:6,glow:1,gran:1,spots:0,spikes:0,seg}) → Mesh
        emissiv yulduz: qora jism rangi, chekka qorayishi (to'lqin uzunligiga bog'liq), harakatlanuvchi granulyatsiya,
        dog'lar, toj nuri (s.glow). s.setTemp(K), s.setIntensity(x). Masalan: G.add(H.star(2,5772,{spots:.5}))
   H.planet(nom|Texture|rang, r, {sun:[0,0,0]|sunDir:[x,y,z], sunColor, sunI:1.6, falloff:0, spin:0.1, tilt:0,
        atm(false=o'chirish), atmI, clouds, night, nightI:1.4, spec, ring, gain, amb, seg}) → Group {body, atm, ring, uniforms, setSun(v), setSunDir(v)}
        nom: earth|mars|venus|moon|mercury|jupiter|saturn|uranus|neptune|ceres (REALTEX NASA teksturalari).
        Terminator, Yer: tungi chiroqlar + bulutlar + okean yaltirashi; atmosfera qatlami va chekka nuri;
        gaz gigantlarida chekka qorayishi; Saturn halqasi (sayyora soyasi halqada, halqa soyasi sayyorada).
        sun: yorug'lik manbai OLAM koordinatasi (standart — markaz), sunDir: yo'nalish. falloff:d0 — teskari kvadrat (d0/d)².
   H.glow(rang, o'lcham, kuch=1, {spikes:0, falloff:12}) → Mesh  — additiv yumshoq nur (billboard, teksturasiz)
   H.particles(n, {size:.1, color, intensity:1, opacity:1, twinkle:0, blend:'add'|'normal', atten:true}) → Points
        yumaloq yumshoq nuqtalar; p.pos(n*3), p.col(n*3, chiziqli), p.size(n, ko'paytuvchi); p.setColor(i,c); p.upd()
        size — olam birligida diametr (atten:false bo'lsa — CSS piksel). p.uniforms.uInt/uOp/uSize — kadrda o'zgartirish mumkin
   H.disk(ichki, tashqi, {mode:'accretion'|'dust', temp:7500, beta:.45, speed:1.2, spin:1, intensity:1.1,
        opacity:1, gaps:[[r,w],[r,w]] (ko'pi bilan 2), dust, light}) → Mesh (XZ tekisligida; d.uniforms)
        mode:'dust' — protoplanetar chang disk (oddiy aralashtirish, markazdan yoritiladi, ichki issiq cheti)
        harorat gradienti T∝r^-3/4, differensial aylanuvchi turbulentlik, Doppler yorqinlashuvi (yaqinlashayotgan tomon).
   H.surface(o'lcham, seg, {color, line, deep, cell:1, depth, opacity:.7, glow:.6}) → Mesh (alias H.grid), XZ tekisligi, markaz 0
        silliq yoritilgan fazo-vaqt varag'i + anti-aliased katak chiziqlari; S.deform((x,z)=>y) — balandlik va normallar
        (u(t) ichida har kadr chaqirish mumkin; seg standart 128, low'da 80). depth — 'chuqur' rang to'liq bo'ladigan chuqurlik
   H.fatLine(n, rang, {width:3(px), glow:.6, intensity:1.2, opacity:1, fade:0, additive:true}) → Mesh
        qalin, silliq (AA) va nurli chiziq; L.set(arr) — [x,y,z,...] yoki Vector3[]; fade:1 — boshi (0-indeks) xiralashadi; L.setWidth(px)
   H.tube(nuqtalar, r, rang, {glow:0, seg}) → Mesh  — 3D quvur (glow>0 bo'lsa nurlanuvchi)
   H.std(rang, {roughness,metalness,emissive}) → MeshStandardMaterial (chiziqli rang bilan)
   H.sunLight(pos, rang, kuch, masofa) → PointLight (masofa berilsa — 2-darajali so'nish)
   H.label(matn, rang|{color,scale}, sc) → Sprite — eski rejimda tiniq sprite; realistik rejimda HTML yorliq
        (tone mapping'dan o'tmaydi, har doim o'qiladi). lb.visible / lb.material.opacity ishlaydi. Yorliqlarni build ichida yarating.
 Eski yordamchilar (o'zgarmagan): pts, line, segs, ball, lit, upd, fib, C. Realistik sahnada pts o'rniga particles, line o'rniga fatLine.
 Element almashganda G ichidagi hamma narsa dispose qilinadi (umumiy NASA teksturalari va dvigatel teksturalari bundan mustasno).
 ========================================================================================== */
(function(){
if(typeof THREE==='undefined')return;
const C=THREE.Color;
const QL=window.QUALITY||{tier:'mid',dpr:1.5};
const TIER={low:1,mid:1,high:1}[QL.tier]?QL.tier:'mid';
// Sifat darajalari: MSAA namunalari, bloom pog'onalari, fon yulduzlari, Somon yo'li kubi, granulyatsiya oktavalari
const TQ={low:{ms:2,mips:4,stars:1600,sky:128,oct:1},mid:{ms:4,mips:5,stars:3600,sky:256,oct:2},high:{ms:4,mips:6,stars:6500,sky:512,oct:2}}[TIER];
const nQ=n=>QL.pts?QL.pts(n):n, segQ=n=>QL.seg?QL.seg(n):n;

// ---------- Ranglar ----------
const linC=c=>{if(c&&c.isColor&&c.lin){const k=c.clone();k.lin=true;return k;}const k=new C(c==null?0xffffff:c).convertSRGBToLinear();k.lin=true;return k;};
// Qora jism: Planck × CIE 1931 (Wyman–Sloan–Shirley 2013 ko'p bo'lakli yaqinlashuvi) → XYZ → chiziqli sRGB
const gs=(x,m,a,b)=>{const t=(x-m)/(x<m?a:b);return Math.exp(-.5*t*t);};
function bbRGB(T){T=Math.max(800,Math.min(40000,T));let X=0,Y=0,Z=0;
 for(let l=380;l<=780;l+=5){const lm=l*1e-9,B=1/(Math.pow(lm,5)*(Math.exp(1.4388e-2/(lm*T))-1));
  X+=B*(1.056*gs(l,599.8,37.9,31)+.362*gs(l,442,16,26.7)-.065*gs(l,501.1,20.4,26.2));
  Y+=B*(.821*gs(l,568.8,46.9,40.5)+.286*gs(l,530.9,16.3,31.1));
  Z+=B*(1.217*gs(l,437,11.8,36)+.681*gs(l,459,26,13.8));}
 let r=3.2406*X-1.5372*Y-.4986*Z,g=-.9689*X+1.8758*Y+.0415*Z,b=.0557*X-.204*Y+1.057*Z;
 const m=Math.min(r,g,b);if(m<0){r-=m;g-=m;b-=m;}const M=Math.max(r,g,b);return [r/M,g/M,b/M];}
const bbCache={};
const bb=K=>{const k=Math.round(K/25)*25;const a=bbCache[k]||(bbCache[k]=bbRGB(k));const c=new C(a[0],a[1],a[2]);c.lin=true;return c;};
// Shaderlar uchun qora jism jadvali: 1000–40000 K, logarifmik
let bbTex=null;
function bbT(){if(bbTex)return bbTex;const N=256,d=new Uint8Array(N*4);
 for(let i=0;i<N;i++){const T=Math.exp(Math.log(1000)+(Math.log(40000)-Math.log(1000))*i/(N-1)),c=bbRGB(T);d[i*4]=c[0]*255;d[i*4+1]=c[1]*255;d[i*4+2]=c[2]*255;d[i*4+3]=255;}
 bbTex=new THREE.DataTexture(d,N,1,THREE.RGBAFormat);bbTex.minFilter=bbTex.magFilter=THREE.LinearFilter;bbTex.wrapS=bbTex.wrapT=THREE.ClampToEdgeWrapping;bbTex.needsUpdate=true;bbTex.userData={shared:true};return bbTex;}

// ---------- GLSL bo'laklari ----------
// 3D simpleks shovqin (Ashima Arts / S. Gustavson, MIT)
const NOISE=`
vec3 m289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 m289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 perm(vec4 x){return m289(((x*34.0)+1.0)*x);}vec4 tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
 vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=m289(i);
 vec4 p=perm(perm(perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
 vec3 ns=0.142857142857*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
 vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
 vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
 vec4 nr=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=nr.x;p1*=nr.y;p2*=nr.z;p3*=nr.w;
 vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
 return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
`;
const TOLIN='vec3 toLin(vec3 c){return mix(pow((c+0.055)/1.055,vec3(2.4)),c/12.92,step(c,vec3(0.04045)));}\n';
const BBF='uniform sampler2D tBB;vec3 bbc(float T){return texture2D(tBB,vec2(clamp((log(T)-6.9078)/3.6888,0.0,1.0),0.5)).rgb;}\n';
const SUNF=`uniform vec4 uSun;uniform vec3 uSunCol;uniform float uSunI,uFall;
vec3 sunDir(vec3 w,out float fall){vec3 L=uSun.w>0.5?uSun.xyz-w:uSun.xyz;   // w — jism markazi (olam koord.)
float d=length(L);fall=1.0;
 if(uSun.w>0.5&&uFall>0.0)fall=min(pow(uFall/max(d,1e-3),2.0),4.0);return d<1e-4?normalize(vec3(1.0,0.3,0.5)):L/d;}
`;

// ---------- Umumiy uniformlar (vaqt, ko'rinish o'lchami) ----------
const GU={time:{value:0},vp:{value:new THREE.Vector2(800,500)},pr:{value:1}};
const keep=[];   // isitilgan materiallar — shader dasturlari keshda qolishi uchun (dispose qilinmaydi)
let cur={ticks:[],real:false,fx:{}};

const SM=(o)=>new THREE.ShaderMaterial(o);
// ---- Yulduz ----
const STAR_V='varying vec3 vO,vN,vV;void main(){vO=normalize(position);vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}';
const STAR_F=`#define OCT ${TQ.oct}
uniform vec3 uCol;uniform float uInt,uGran,uSpot,uTime;varying vec3 vO,vN,vV;${NOISE}
void main(){float mu=clamp(dot(normalize(vN),normalize(vV)),0.0,1.0);vec3 p=vO;
 float g=snoise(p*13.0+vec3(0.0,uTime*0.07,uTime*0.03));
 #if OCT>1
 g=g*0.6+0.4*snoise(p*31.0-vec3(uTime*0.11));
 #endif
 float s=uSpot>0.0?smoothstep(0.5,0.72,snoise(p*2.1+vec3(uTime*0.004)))*uSpot:0.0;
 vec3 ld=1.0-vec3(0.36,0.47,0.62)*(1.0-pow(vec3(mu),vec3(0.5,0.55,0.62)));      // chekka qorayishi (ko'k ko'proq so'nadi)
 float fac=1.0+0.25*smoothstep(0.75,0.95,1.0-mu)*smoothstep(0.2,0.6,snoise(p*6.0));  // chekkadagi fakulalar
 vec3 c=uCol*uInt*ld*(1.0+uGran*0.3*g)*(1.0-0.8*s)*fac;gl_FragColor=vec4(c,1.0);}`;
// ---- Billboard nur ----
const GLOW_V='uniform float uSize;varying vec2 vQ;void main(){vQ=position.xy*2.0;vec4 mv=modelViewMatrix*vec4(0.0,0.0,0.0,1.0);mv.xy+=position.xy*uSize*length(modelMatrix[0].xyz);gl_Position=projectionMatrix*mv;}';
const GLOW_F=`uniform vec3 uCol;uniform float uInt,uSpk,uK;varying vec2 vQ;
void main(){float r2=dot(vQ,vQ);if(r2>1.0)discard;float f=(1.0-r2);f*=f;
 float I=exp(-r2*70.0)*0.7+0.05/(r2*uK+0.05);
 if(uSpk>0.0)I+=uSpk*(exp(-abs(vQ.x)*90.0)*exp(-abs(vQ.y)*3.0)+exp(-abs(vQ.y)*90.0)*exp(-abs(vQ.x)*3.0));
 gl_FragColor=vec4(uCol*uInt*I*f,1.0);}`;
// ---- Zarralar ----
const PART_V=`attribute vec3 aCol;attribute float aSize,aPh;uniform float uSize,uTw,uTime,uAtt,uPR;uniform vec2 uVP;varying vec3 vC;varying float vA;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;
 float px=uAtt>0.5?uSize*aSize*projectionMatrix[1][1]*uVP.y*0.5/max(-mv.z,1e-3):uSize*aSize*uPR;
 float tw=1.0+uTw*(0.5*sin(uTime*(1.6+aPh*2.2)+aPh*37.0)-0.25);
 vA=clamp(px*px/4.0,0.0,1.0)*tw;gl_PointSize=clamp(px,2.0,256.0);vC=aCol;}`;
const PART_F='uniform float uInt,uOp;varying vec3 vC;varying float vA;void main(){vec2 q=gl_PointCoord*2.0-1.0;float r2=dot(q,q);if(r2>1.0)discard;float a=exp(-r2*3.2)*(1.0-r2);gl_FragColor=vec4(vC*uInt,a*vA*uOp);}';
// ---- Disk ----
const DISK_V='uniform float uSpin;varying vec3 vP,vW,vVel;void main(){vP=position;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vVel=normalize(mat3(modelMatrix)*vec3(-position.z,0.0,position.x)*uSpin+1e-6);gl_Position=projectionMatrix*viewMatrix*w;}';
const DISK_F=`uniform float uIn,uOut,uT,uBeta,uInt,uOp,uSpeed,uSpin,uMode,uTime;uniform vec4 uGap;uniform vec3 uDust,uLit;varying vec3 vP,vW,vVel;${NOISE}${BBF}
float dn(float a,float r,float o){vec3 q=vec3(cos(a)*3.2,sin(a)*3.2,r/uOut*8.0+o);return 0.65*snoise(q)+0.35*snoise(q*2.3+vec3(0.0,0.0,uTime*0.15));}
void main(){float r=length(vP.xz);float x=clamp((r-uIn)/(uOut-uIn),0.0,1.0);float rr=max(r/uIn,1.0);
 // differensial (Kepler) aylanish; o'ralish cheksiz o'smasligi uchun ikki fazali oqim (flow-map) almashinuvi
 float ph=atan(vP.z,vP.x),w=uSpin*uSpeed*pow(rr,-1.5),P=6.0,t1=mod(uTime,P),t2=mod(uTime+P*0.5,P),k=abs(1.0-2.0*t1/P);
 float n=mix(dn(ph-w*t1,r,0.0),dn(ph-w*t2,r,7.3),k);
 float dens=smoothstep(0.0,0.05,x)*(1.0-smoothstep(0.6,1.0,x))*clamp(0.6+0.55*n,0.05,1.6);
 if(uGap.y>0.0)dens*=1.0-0.92*exp(-pow((r-uGap.x)/uGap.y,2.0));
 if(uGap.w>0.0)dens*=1.0-0.92*exp(-pow((r-uGap.z)/uGap.w,2.0));
 if(uMode<0.5){
  float T=uT*pow(rr,-0.75);float b=uBeta*sqrt(1.0/rr);float cv=dot(normalize(vVel),normalize(cameraPosition-vW));
  float D=1.0/(inversesqrt(max(1.0-b*b,1e-3))*(1.0-b*cv));         // relyativistik Doppler omili
  vec3 c=bbc(T*D)*pow(D,3.0)*pow(T/uT,1.6)*dens*uInt;gl_FragColor=vec4(c,1.0);
 }else{
  float il=pow(clamp(uIn*1.6/r,0.0,1.0),1.3);
  vec3 c=mix(uDust,uDust*uLit*1.6,0.5)*il*uInt+bbc(uT*pow(rr,-0.75))*exp(-x*25.0)*uInt*0.6;
  gl_FragColor=vec4(c,clamp(dens*uOp,0.0,1.0));}}`;
// ---- Fazo-vaqt varag'i ----
const SURF_V='varying vec3 vL,vW,vN;void main(){vL=position;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}';
const SURF_F=`uniform vec3 uCol,uLine,uDeep;uniform float uCell,uOp,uDepth,uHalf,uGlow;varying vec3 vL,vW,vN;
void main(){vec2 g=vL.xz/uCell;vec2 fw=max(fwidth(g),vec2(1e-4));vec2 gg=abs(fract(g-0.5)-0.5)/fw;float ln=1.0-min(min(gg.x,gg.y),1.0);
 ln*=1.0-smoothstep(0.25,0.7,max(fw.x,fw.y));                       // uzoqda moire bo'lmasin
 vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 V=normalize(cameraPosition-vW);vec3 L=normalize(vec3(0.35,1.0,0.45));
 float dif=0.25+0.75*max(dot(N,L),0.0);float fr=pow(1.0-abs(dot(N,V)),4.0);float k=clamp(-vL.y/uDepth,0.0,1.0);
 vec3 base=mix(uCol,uDeep,k);vec3 c=base*dif*0.55+uLine*ln*(0.55+0.9*k)+uLine*fr*0.25+uDeep*k*k*uGlow;
 float e=1.0-smoothstep(0.55,0.98,length(vL.xz)/uHalf);gl_FragColor=vec4(c,e*mix(uOp,1.0,ln*0.8));}`;
// ---- Qalin chiziq ----
const FAT_V=`attribute vec3 aPrev,aNext;attribute float aSide,aU;uniform vec2 uVP;uniform float uW,uPR;varying float vS,vU;
vec2 scr(vec4 c){return c.xy/c.w*uVP*0.5;}
void main(){mat4 m=projectionMatrix*modelViewMatrix;vec4 c=m*vec4(position,1.0);vec2 cs=scr(c),ps=scr(m*vec4(aPrev,1.0)),ns=scr(m*vec4(aNext,1.0));
 vec2 d1=cs-ps,d2=ns-cs;if(dot(d1,d1)<1e-8)d1=d2;if(dot(d2,d2)<1e-8)d2=d1;vec2 d=normalize(normalize(d1+1e-6)+normalize(d2+1e-6)+1e-6);
 vec2 nr=vec2(-d.y,d.x);float ml=1.0/max(dot(nr,vec2(-normalize(d1+1e-6).y,normalize(d1+1e-6).x)),0.5);
 c.xy+=nr*aSide*uW*uPR*ml/(uVP*0.5)*c.w;vS=aSide;vU=aU;gl_Position=c;}`;
const FAT_F='uniform vec3 uCol;uniform float uInt,uOp,uCore,uGlow,uFade,uW,uPR;varying float vS,vU;void main(){float v=abs(vS);float aa=1.0/(uW*uPR);float core=1.0-smoothstep(uCore-aa,uCore+aa*0.5,v);float g=exp(-v*v*6.0)*uGlow;float a=clamp(core+g*(1.0-core),0.0,1.0)*uOp*mix(1.0,vU,uFade);gl_FragColor=vec4(uCol*uInt*(core+g*0.6),a);}';
// ---- Sayyora / halqa / atmosfera ----
const PL_V='varying vec2 vUv;varying vec3 vW,vN,vC,vRn;varying float vS;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vC=(modelMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;vS=length(modelMatrix[0].xyz);vRn=normalize(mat3(modelMatrix)*vec3(0.0,1.0,0.0));gl_Position=projectionMatrix*viewMatrix*w;}';
const PL_F=`uniform sampler2D tDay,tNight,tCloud,tRing;uniform vec4 uHas;uniform vec3 uBase,uAtm;uniform float uAmb,uSpec,uLimb,uNightI,uCloudOff,uAtmI,uRIn,uROut,uRad,uGain;
varying vec2 vUv;varying vec3 vW,vN,vC,vRn;varying float vS;${TOLIN}${SUNF}
void main(){float fall;vec3 L=sunDir(vC,fall);vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vW);float ndl=dot(N,L);float ndv=max(dot(N,V),0.0);
 vec3 day=uHas.x>0.5?toLin(texture2D(tDay,vUv).rgb)*uGain:uBase;
 float cl=uHas.z>0.5?texture2D(tCloud,vUv+vec2(uCloudOff,0.0)).r:0.0;
 float ocean=uSpec>0.0?smoothstep(0.015,0.08,day.b-day.r)*(1.0-cl):0.0;
 vec3 alb=mix(day,vec3(0.9),cl*0.92)*mix(1.0,pow(ndv,0.3),uLimb);
 float dif=clamp((ndl+0.03)/1.03,0.0,1.0);
 #ifdef RING
 float den=dot(L,vRn);if(abs(den)>1e-3){float t=dot(vC-vW,vRn)/den;if(t>0.0){float q=length(vW+L*t-vC)/(vS*uRad);
  if(q>uRIn&&q<uROut)dif*=1.0-0.85*(uHas.w>0.5?texture2D(tRing,vec2((q-uRIn)/(uROut-uRIn),0.5)).a:0.6);}}
 #endif
 vec3 E=uSunCol*uSunI*fall;vec3 c=alb*(dif*E+uAmb);
 vec3 Hh=normalize(L+V);c+=E*ocean*uSpec*pow(max(dot(N,Hh),0.0),70.0)*step(0.0,ndl)*2.0;
 if(uHas.y>0.5)c+=toLin(texture2D(tNight,vUv).rgb)*uNightI*(1.0-smoothstep(-0.18,0.06,ndl))*(1.0-cl*0.85);
 vec3 ac=mix(vec3(1.0,0.45,0.2),uAtm,smoothstep(-0.05,0.25,ndl));
 c+=ac*pow(1.0-ndv,3.0)*uAtmI*smoothstep(-0.12,0.35,ndl)*E*0.6+uAtm*0.05*uAtmI*dif*E;
 gl_FragColor=vec4(c,1.0);}`;
const ATM_V='varying vec3 vW,vN,vC;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vC=(modelMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}';
const ATM_F=`uniform vec3 uAtm;uniform float uAtmI,uK;varying vec3 vW,vN,vC;${SUNF}
void main(){float fall;vec3 L=sunDir(vC,fall);vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vW);float k=clamp(-dot(N,V)/uK,0.0,1.0);float a=k*k*(3.0-2.0*k);a*=a;
 float nl=dot(N,L);vec3 c=mix(vec3(1.0,0.4,0.15),uAtm,smoothstep(-0.15,0.4,nl));gl_FragColor=vec4(c*a*smoothstep(-0.35,0.45,nl)*uAtmI*uSunI*fall*1.1,1.0);}`;
const RING_V='varying vec2 vUv;varying vec3 vW,vN,vC;varying float vS;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vN=normalize(mat3(modelMatrix)*vec3(0.0,0.0,1.0));vC=(modelMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;vS=length(modelMatrix[0].xyz);gl_Position=projectionMatrix*viewMatrix*w;}';
const RING_F=`uniform sampler2D tRing;uniform float uHasR,uRad,uOp;uniform vec3 uBase;varying vec2 vUv;varying vec3 vW,vN,vC;varying float vS;${TOLIN}${SUNF}
void main(){float fall;vec3 L=sunDir(vC,fall);vec4 tx=uHasR>0.5?texture2D(tRing,vec2(vUv.x,0.5)):vec4(uBase,0.55+0.35*sin(vUv.x*70.0)*sin(vUv.x*23.0));
 vec3 N=normalize(vN);vec3 V=normalize(cameraPosition-vW);float nl=dot(N,L),nv=dot(N,V);float lit=0.12+0.88*abs(nl);
 if(nl*nv<0.0)lit*=0.25+0.5*(1.0-tx.a);                              // yoritilmagan tomondan — o'tgan yorug'lik
 vec3 oc=vC-vW;float b=dot(oc,L);if(b>0.0){float d2=dot(oc,oc)-b*b;float R=uRad*vS;lit*=mix(0.03,1.0,smoothstep(R*R*0.94,R*R*1.03,d2));}
 gl_FragColor=vec4(toLin(tx.rgb)*lit*uSunCol*uSunI*fall,tx.a*uOp);}`;
// ---- Fon: yulduzlar (cheksizlikda) va Somon yo'li (kub teksturaga bir marta pishiriladi) ----
const SKYP_V='attribute vec3 aCol;attribute float aSize;uniform float uPR;varying vec3 vC;varying float vA;void main(){vec4 p=projectionMatrix*vec4(mat3(viewMatrix)*position,1.0);p.z=p.w*0.99999;gl_Position=p;float px=aSize*uPR;vA=clamp(px*px/2.25,0.0,1.0);gl_PointSize=max(px,1.5);vC=aCol;}';
const SKYP_F='varying vec3 vC;varying float vA;void main(){vec2 q=gl_PointCoord*2.0-1.0;float r2=dot(q,q);if(r2>1.0)discard;gl_FragColor=vec4(vC*exp(-r2*4.0)*(1.0-r2)*vA,1.0);}';
const SKYB_V='varying vec3 vD;void main(){vD=position;vec4 p=projectionMatrix*vec4(mat3(viewMatrix)*position,1.0);p.z=p.w*0.99999;gl_Position=p;}';
const SKYB_F='uniform samplerCube tSky;uniform float uI;varying vec3 vD;void main(){gl_FragColor=vec4(textureCube(tSky,normalize(vD)).rgb*uI,1.0);}';
const GN=new THREE.Vector3(-.35,1,.25).normalize();   // galaktika tekisligi normali (yulduzlar zichligi ham shunga mos)
const BAKE_F=`uniform vec3 uGN;varying vec3 vD;${NOISE}
float fbm(vec3 p){float s=0.0,a=0.5;for(int i=0;i<5;i++){s+=a*snoise(p);p*=2.03;a*=0.5;}return s;}
void main(){vec3 d=normalize(vD);vec3 gc=normalize(cross(uGN,vec3(0.0,0.0,1.0)));float lat=dot(d,uGN);float lon=dot(normalize(d-uGN*lat+1e-5),gc);
 float n=fbm(d*3.0),n2=fbm(d*7.0+11.0);float w=0.11+0.05*n;float band=exp(-lat*lat/(w*w));
 float bul=exp(-(1.0-lon)*2.2)*exp(-lat*lat/0.035);float dust=smoothstep(-0.05,0.45,n2)*exp(-lat*lat/0.006);
 vec3 c=vec3(0.55,0.62,0.85)*band*(0.55+0.45*n)+vec3(1.0,0.8,0.58)*bul*1.3;c*=1.0-0.8*dust;
 c+=vec3(0.7,0.16,0.22)*smoothstep(0.3,0.7,fbm(d*2.3+3.0))*band*0.6+vec3(0.12,0.2,0.45)*smoothstep(0.35,0.8,fbm(d*1.4+7.0))*0.35;
 gl_FragColor=vec4(c*0.55,1.0);}`;
// ---- Post-ishlov: bloom (dual-filter piramida) + ACES + sRGB ----
const FS_V='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}';
const PRE_F='uniform sampler2D tSrc;uniform vec2 uTx;uniform float uTh,uKnee;varying vec2 vUv;vec3 tp(vec2 o){vec3 c=texture2D(tSrc,vUv+o*uTx).rgb;return c/(1.0+max(c.r,max(c.g,c.b))*0.25);}void main(){vec3 c=(tp(vec2(-1.0,-1.0))+tp(vec2(1.0,-1.0))+tp(vec2(-1.0,1.0))+tp(vec2(1.0,1.0)))*0.25;float br=max(c.r,max(c.g,c.b));float s=clamp(br-uTh+uKnee,0.0,2.0*uKnee);s=s*s/(4.0*uKnee+1e-4);c*=max(s,br-uTh)/max(br,1e-4);gl_FragColor=vec4(c,1.0);}';
const DN_F='uniform sampler2D tSrc;uniform vec2 uTx;varying vec2 vUv;void main(){vec2 h=uTx;vec3 s=texture2D(tSrc,vUv).rgb*4.0+texture2D(tSrc,vUv-h).rgb+texture2D(tSrc,vUv+h).rgb+texture2D(tSrc,vUv+vec2(h.x,-h.y)).rgb+texture2D(tSrc,vUv-vec2(h.x,-h.y)).rgb;gl_FragColor=vec4(s/8.0,1.0);}';
const UP_F='uniform sampler2D tSrc;uniform vec2 uTx;uniform float uR;varying vec2 vUv;vec3 t(vec2 o){return texture2D(tSrc,vUv+o*uTx*uR).rgb;}void main(){vec3 s=t(vec2(-2.0,0.0))+t(vec2(2.0,0.0))+t(vec2(0.0,-2.0))+t(vec2(0.0,2.0))+2.0*(t(vec2(-1.0,1.0))+t(vec2(1.0,1.0))+t(vec2(1.0,-1.0))+t(vec2(-1.0,-1.0)));gl_FragColor=vec4(s/12.0,1.0);}';
const CMP_F=`uniform sampler2D tScene,tBloom;uniform float uBloom,uExp,uOpaque;varying vec2 vUv;
vec3 rrt(vec3 v){vec3 a=v*(v+0.0245786)-0.000090537;vec3 b=v*(0.983729*v+0.4329510)+0.238081;return a/b;}
vec3 aces(vec3 c){const mat3 I=mat3(vec3(0.59719,0.07600,0.02840),vec3(0.35458,0.90834,0.13383),vec3(0.04823,0.01566,0.83777));
 const mat3 O=mat3(vec3(1.60475,-0.10208,-0.00327),vec3(-0.53108,1.10813,-0.07276),vec3(-0.07367,-0.00605,1.07602));return clamp(O*rrt(I*(c/0.6)),0.0,1.0);}
void main(){vec4 s=texture2D(tScene,vUv);vec3 h=s.rgb+texture2D(tBloom,vUv).rgb*uBloom;vec3 c=aces(h*uExp);
 c=mix(1.055*pow(c,vec3(1.0/2.4))-0.055,c*12.92,step(c,vec3(0.0031308)));
 c+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-0.5)/255.0;   // dithering — gradientlarda pog'ona bo'lmasin
 float a=uOpaque>0.5?1.0:clamp(max(s.a,max(c.r,max(c.g,c.b))),0.0,1.0);gl_FragColor=vec4(c,a);}`;

// ---------- Yordamchilar ----------
const real=()=>{cur.real=true;};
const sharedSphere={};
function sphereGeo(seg){const k=seg|0;return new THREE.SphereGeometry(1,k,Math.max(8,k>>1));}
const PRESET={
 earth:{base:0x2f5f9f,atm:0x5590ff,atmI:1,spec:.55,night:1,clouds:1},
 mars:{base:0xc1440e,atm:0xd59a70,atmI:.3}, venus:{base:0xe8cda0,atm:0xfff0c8,atmI:.7},
 moon:{base:0x9a9a9a}, mercury:{base:0x8f8a86}, ceres:{base:0x8a8580},
 jupiter:{base:0xd8b48a,limb:.55,atm:0xd8c0a0,atmI:.25}, saturn:{base:0xe3c98f,limb:.55,atm:0xe8d8b0,atmI:.2,ring:1},
 uranus:{base:0x9fd8e0,limb:.45,atm:0xa8e8ff,atmI:.45}, neptune:{base:0x4a70d0,limb:.45,atm:0x6f9fff,atmI:.45},
};
const RT=()=>window.REALTEX&&window.REALTEX.ok?window.REALTEX:null;
function getTex(key,cb){const rt=RT();if(!rt||!rt.FILES[key])return;rt.texture(key,{srgb:false}).then(t=>{if(t)idle(()=>{if(R&&R.initTexture)R.initTexture(t);cb(t);},true);}).catch(()=>{});}
function sunU(o){const s=o.sunDir?new THREE.Vector4(...o.sunDir,0):new THREE.Vector4(...(o.sun||[0,0,0]),1);
 return {uSun:{value:s},uSunCol:{value:linC(o.sunColor!=null?o.sunColor:0xfff6ea)},uSunI:{value:o.sunI!=null?o.sunI:1.6},uFall:{value:o.falloff||0}};}

const H={
 C,
 // --- eski yordamchilar (o'zgarmagan) ---
 pts(n,size,col){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));const vc=col==null;if(vc)g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));return new THREE.Points(g,new THREE.PointsMaterial({size,color:vc?0xffffff:col,vertexColors:vc,transparent:true,depthWrite:false}));},
 line(n,col,op){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));return new THREE.Line(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op||1}));},
 segs(n,col,op){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*6),3));return new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op||1}));},
 ball(r,col,seg){return new THREE.Mesh(new THREE.SphereGeometry(r,seg||32,Math.round((seg||32)/2)),new THREE.MeshBasicMaterial({color:col,transparent:true}));},
 lit(r,col,seg){return new THREE.Mesh(new THREE.SphereGeometry(r,seg||40,Math.round((seg||40)/2)),new THREE.MeshStandardMaterial({color:col,roughness:.8,metalness:0}));},
 upd(o){o.geometry.attributes.position.needsUpdate=true;if(o.geometry.attributes.color)o.geometry.attributes.color.needsUpdate=true;},
 fib(n){const a=[];for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),th=i*2.39996;a.push(r*Math.cos(th),y,r*Math.sin(th));}return a;},
 // --- umumiy ---
 q:TIER, n:nQ, seg:segQ, lin:linC, bb,
 tick(fn){cur.ticks.push(fn);},
 fx(o){Object.assign(cur.fx,o);if(cur===act)applyFx();},
 // Tiniq yorliq: eski imzo (matn, rang, masshtab) saqlangan — 4:1 sprite; realistik rejimda HTML yorliq bo'lib chiziladi
 label(txt,col,sc){let o={};if(col&&typeof col==='object'&&!col.isColor){o=col;col=o.color;sc=o.scale!=null?o.scale:sc;}
  const c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=128;let fs=60;x.font=`600 ${fs}px system-ui,sans-serif`;
  const w=x.measureText(txt).width;if(w>490){fs=Math.floor(fs*490/w);x.font=`600 ${fs}px system-ui,sans-serif`;}
  x.textAlign='center';x.textBaseline='middle';x.shadowColor='rgba(0,0,0,.85)';x.shadowBlur=8;
  const cs=typeof col==='number'?'#'+col.toString(16).padStart(6,'0'):(col&&col.isColor?'#'+col.getHexString():(col||'#fff'));x.fillStyle=cs;x.fillText(txt,256,64);
  const t=new THREE.CanvasTexture(c);t.anisotropy=4;t.userData=t.userData||{};
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(4*(sc||1),1*(sc||1),1);
  s.userData.lbl={txt:String(txt),col:cs,sc:sc||1};cur.labels&&cur.labels.push(s);return s;},
 // --- realistik ---
 star(r,K,o){o=o||{};real();const U={uCol:{value:bb(K||5772)},uInt:{value:o.intensity!=null?o.intensity:1.5},uGran:{value:o.gran!=null?o.gran:1},uSpot:{value:o.spots||0},uTime:GU.time};
  const m=new THREE.Mesh(sphereGeo(o.seg||segQ(64)),SM({uniforms:U,vertexShader:STAR_V,fragmentShader:STAR_F}));m.scale.setScalar(r);
  if(o.halo!==0){const g=H.glow(U.uCol.value,(o.halo||6)*2,o.glow!=null?o.glow:1,{spikes:o.spikes||0,lin:1});m.add(g);m.glow=g;g.material.uniforms.uCol=U.uCol;}
  m.uniforms=U;m.setTemp=k=>{U.uCol.value.copy(bb(k));};m.setIntensity=v=>{U.uInt.value=v;};return m;},
 glow(col,size,I,o){o=o||{};real();const U={uCol:{value:o.lin&&col.isColor?col:linC(col)},uInt:{value:I!=null?I:1},uSize:{value:size||1},uSpk:{value:o.spikes||0},uK:{value:o.falloff||12}};
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),SM({uniforms:U,vertexShader:GLOW_V,fragmentShader:GLOW_F,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  m.frustumCulled=false;m.renderOrder=5;m.uniforms=U;return m;},
 particles(n,o){o=o||{};real();const g=new THREE.BufferGeometry(),pos=new Float32Array(n*3),col=new Float32Array(n*3),siz=new Float32Array(n).fill(1),ph=new Float32Array(n);
  const c=linC(o.color!=null?o.color:0xffffff);for(let i=0;i<n;i++){col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;ph[i]=Math.random();}
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aCol',new THREE.BufferAttribute(col,3));g.setAttribute('aSize',new THREE.BufferAttribute(siz,1));g.setAttribute('aPh',new THREE.BufferAttribute(ph,1));
  const U={uSize:{value:o.size||.1},uTw:{value:o.twinkle||0},uTime:GU.time,uAtt:{value:o.atten===false?0:1},uPR:GU.pr,uVP:GU.vp,uInt:{value:o.intensity!=null?o.intensity:1},uOp:{value:o.opacity!=null?o.opacity:1}};
  const add=o.blend!=='normal';const p=new THREE.Points(g,SM({uniforms:U,vertexShader:PART_V,fragmentShader:PART_F,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending}));
  p.frustumCulled=false;p.pos=pos;p.col=col;p.size=siz;p.uniforms=U;
  p.setColor=(i,cc)=>{const k=linC(cc);col[i*3]=k.r;col[i*3+1]=k.g;col[i*3+2]=k.b;};
  p.upd=()=>{g.attributes.position.needsUpdate=true;g.attributes.aCol.needsUpdate=true;g.attributes.aSize.needsUpdate=true;};return p;},
 disk(rin,rout,o){o=o||{};real();const dust=o.mode==='dust';const geo=new THREE.RingGeometry(rin,rout,TIER==='low'?96:160,12);geo.rotateX(-Math.PI/2);
  const gp=(o.gaps||[]).concat([[0,0],[0,0]]);
  const U={uIn:{value:rin},uOut:{value:rout},uT:{value:o.temp||(dust?1500:7500)},uBeta:{value:o.beta!=null?o.beta:(dust?0:.45)},uInt:{value:o.intensity!=null?o.intensity:(dust?1:1.1)},uOp:{value:o.opacity!=null?o.opacity:1},
   uSpeed:{value:o.speed!=null?o.speed:1.2},uSpin:{value:o.spin||1},uMode:{value:dust?1:0},uTime:GU.time,uGap:{value:new THREE.Vector4(gp[0][0],gp[0][1],gp[1][0],gp[1][1])},
   uDust:{value:linC(o.dust!=null?o.dust:0xb08060)},uLit:{value:linC(o.light!=null?o.light:0xfff0d8)},tBB:{value:bbT()}};
  const m=new THREE.Mesh(geo,SM({uniforms:U,vertexShader:DISK_V,fragmentShader:DISK_F,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:dust?THREE.NormalBlending:THREE.AdditiveBlending}));m.uniforms=U;return m;},
 surface(size,seg,o){o=o||{};real();seg=seg||(TIER==='low'?80:128);const N=seg+1,pos=new Float32Array(N*N*3),nor=new Float32Array(N*N*3),hs=size/2,st=size/seg;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=(j*N+i)*3;pos[k]=-hs+i*st;pos[k+2]=-hs+j*st;nor[k+1]=1;}
  const idx=[];for(let j=0;j<seg;j++)for(let i=0;i<seg;i++){const a=j*N+i,b=a+1,c=a+N,d=c+1;idx.push(a,c,b,b,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setIndex(idx);
  const U={uCol:{value:linC(o.color!=null?o.color:0x123a78)},uLine:{value:linC(o.line!=null?o.line:0x6fa8ff)},uDeep:{value:linC(o.deep!=null?o.deep:0x6a3cff)},uCell:{value:o.cell||1},uOp:{value:o.opacity!=null?o.opacity:.7},uDepth:{value:o.depth||size*.15},uHalf:{value:hs},uGlow:{value:o.glow!=null?o.glow:.6}};
  const mat=SM({uniforms:U,vertexShader:SURF_V,fragmentShader:SURF_F,transparent:true,side:THREE.DoubleSide});mat.extensions.derivatives=true;
  const m=new THREE.Mesh(g,mat);m.frustumCulled=false;m.uniforms=U;
  m.deform=fn=>{for(let k=0;k<N*N;k++)pos[k*3+1]=fn(pos[k*3],pos[k*3+2]);
   for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,l=pos[(j*N+Math.max(i-1,0))*3+1],r=pos[(j*N+Math.min(i+1,seg))*3+1],u=pos[(Math.max(j-1,0)*N+i)*3+1],d=pos[(Math.min(j+1,seg)*N+i)*3+1];
    const dx=(r-l)/((Math.min(i+1,seg)-Math.max(i-1,0))*st),dz=(d-u)/((Math.min(j+1,seg)-Math.max(j-1,0))*st),il=1/Math.hypot(dx,1,dz);nor[k*3]=-dx*il;nor[k*3+1]=il;nor[k*3+2]=-dz*il;}
   g.attributes.position.needsUpdate=true;g.attributes.normal.needsUpdate=true;return m;};
  return m;},
 fatLine(n,col,o){o=o||{};real();const P=new Float32Array(n*6),Pp=new Float32Array(n*6),Pn=new Float32Array(n*6),S=new Float32Array(n*2),Uu=new Float32Array(n*2),idx=[];
  for(let i=0;i<n;i++){S[i*2]=1;S[i*2+1]=-1;Uu[i*2]=Uu[i*2+1]=n>1?i/(n-1):1;}
  for(let i=0;i<n-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+2,a+1,a+3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('aPrev',new THREE.BufferAttribute(Pp,3));g.setAttribute('aNext',new THREE.BufferAttribute(Pn,3));
  g.setAttribute('aSide',new THREE.BufferAttribute(S,1));g.setAttribute('aU',new THREE.BufferAttribute(Uu,1));g.setIndex(idx);
  const w=o.width||3,gl=o.glow!=null?o.glow:.6,tw=w*.5*(1+gl*3);
  const U={uVP:GU.vp,uPR:GU.pr,uW:{value:tw},uCol:{value:linC(col)},uInt:{value:o.intensity!=null?o.intensity:1.2},uOp:{value:o.opacity!=null?o.opacity:1},uCore:{value:w*.5/tw},uGlow:{value:gl},uFade:{value:o.fade||0}};
  const m=new THREE.Mesh(g,SM({uniforms:U,vertexShader:FAT_V,fragmentShader:FAT_F,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:o.additive===false?THREE.NormalBlending:THREE.AdditiveBlending}));
  m.frustumCulled=false;m.uniforms=U;
  m.setWidth=px=>{const t2=px*.5*(1+U.uGlow.value*3);U.uW.value=t2;U.uCore.value=px*.5/t2;};
  m.set=a=>{const f=a.length&&a[0]&&a[0].isVector3?a.flatMap(v=>[v.x,v.y,v.z]):a;const k=Math.min(n,(f.length/3)|0);
   for(let i=0;i<n;i++){const ii=Math.min(i,k-1),p=Math.max(ii-1,0),q=Math.min(ii+1,k-1);for(let s=0;s<2;s++)for(let c=0;c<3;c++){const o2=(i*2+s)*3+c;P[o2]=f[ii*3+c];Pp[o2]=f[p*3+c];Pn[o2]=f[q*3+c];}}
   g.attributes.position.needsUpdate=g.attributes.aPrev.needsUpdate=g.attributes.aNext.needsUpdate=true;return m;};
  return m;},
 tube(pts,r,col,o){o=o||{};real();const v=pts[0]&&pts[0].isVector3?pts:Array.from({length:pts.length/3|0},(_,i)=>new THREE.Vector3(pts[i*3],pts[i*3+1],pts[i*3+2]));
  const cv=pts.isCurve?pts:new THREE.CatmullRomCurve3(v);const geo=new THREE.TubeGeometry(cv,o.seg||Math.max(16,v.length*2),r,TIER==='low'?6:10,!!o.closed);
  let mat;if(o.glow){const c=linC(col).multiplyScalar(o.glow);mat=new THREE.MeshBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});}else mat=H.std(col,o);
  return new THREE.Mesh(geo,mat);},
 std(col,o){o=o||{};real();return new THREE.MeshStandardMaterial({color:linC(col),roughness:o.roughness!=null?o.roughness:.85,metalness:o.metalness||0,emissive:o.emissive!=null?linC(o.emissive):0x000000,emissiveIntensity:o.emissiveIntensity||1});},
grid(...a){return H.surface(...a);},
 sunLight(pos,col,I,dist){real();const l=new THREE.PointLight(linC(col!=null?col:0xffffff),I!=null?I:1.5,dist||0,dist?2:0);if(pos)l.position.set(...pos);return l;},
 planet(name,r,o){o=o||{};real();const key=typeof name==='string'?name:null,pr=Object.assign({},PRESET[key]||{base:typeof name==='number'?name:0x888888},o);
  const ring=!!(o.ring!=null?o.ring:pr.ring),S=sunU(o);
  const U=Object.assign({tDay:{value:null},tNight:{value:null},tCloud:{value:null},tRing:{value:null},uHas:{value:new THREE.Vector4()},uBase:{value:linC(pr.base)},uAtm:{value:linC(pr.atm||0x8fb0ff)},
   uAmb:{value:o.amb!=null?o.amb:.004},uSpec:{value:o.spec!=null?o.spec:(pr.spec||0)},uLimb:{value:pr.limb||0},uNightI:{value:o.nightI!=null?o.nightI:1.4},uCloudOff:{value:0},
   uAtmI:{value:o.atm===false?0:(o.atmI!=null?o.atmI:(pr.atmI||0))},uRIn:{value:1.24},uROut:{value:2.27},uRad:{value:1},uGain:{value:o.gain||1}},S);
  const grp=new THREE.Group(),body=new THREE.Mesh(sphereGeo(o.seg||segQ(64)),SM({uniforms:U,vertexShader:PL_V,fragmentShader:PL_F,defines:ring?{RING:1}:{}}));
  body.scale.setScalar(r);grp.add(body);grp.body=body;grp.uniforms=U;if(o.tilt)grp.rotation.z=o.tilt;
  if(name&&name.isTexture){U.tDay.value=name;U.uHas.value.x=1;}
  if(key){getTex(key,t=>{U.tDay.value=t;U.uHas.value.x=1;});
   if(key==='earth'){if(o.night!==false)getTex('earthNight',t=>{U.tNight.value=t;U.uHas.value.y=1;});if(o.clouds!==false)getTex('clouds',t=>{U.tCloud.value=t;U.uHas.value.z=1;});}}
  if(U.uAtmI.value>0){const K=1.06,AU={uAtm:U.uAtm,uAtmI:U.uAtmI,uK:{value:Math.sqrt(1-1/(K*K))}};Object.assign(AU,S);
   const a=new THREE.Mesh(sphereGeo(segQ(48)),SM({uniforms:AU,vertexShader:ATM_V,fragmentShader:ATM_F,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));a.scale.setScalar(K);body.add(a);grp.atm=a;}
  if(ring){const ri=1.24,ro=2.27,geo=new THREE.RingGeometry(ri,ro,TIER==='low'?96:160,1),p=geo.attributes.position,uv=geo.attributes.uv;
   for(let i=0;i<p.count;i++){uv.setXY(i,(Math.hypot(p.getX(i),p.getY(i))-ri)/(ro-ri),.5);}
   const RU=Object.assign({tRing:U.tRing,uHasR:{value:0},uRad:{value:1},uOp:{value:1},uBase:{value:linC(0xd8c4a0)}},S);
   const rm=new THREE.Mesh(geo,SM({uniforms:RU,vertexShader:RING_V,fragmentShader:RING_F,transparent:true,depthWrite:false,side:THREE.DoubleSide}));rm.rotation.x=-Math.PI/2;body.add(rm);grp.ring=rm;
   getTex('saturnRing',t=>{U.tRing.value=t;U.uHas.value.w=1;RU.uHasR.value=1;});}
  const spin=o.spin!=null?o.spin:.1;H.tick((t,dt)=>{body.rotation.y+=spin*dt;U.uCloudOff.value=(t*.004)%1;});
  grp.setSun=v=>{S.uSun.value.set(v.x!=null?v.x:v[0],v.y!=null?v.y:v[1],v.z!=null?v.z:v[2],1);};grp.setSunDir=v=>{S.uSun.value.set(v.x!=null?v.x:v[0],v.y!=null?v.y:v[1],v.z!=null?v.z:v[2],0);};
  return grp;},
};

// ---------- Renderer, sahna, post-ishlov ----------
let R=null,scene,cam,ctl,amb,pl,obj=null,box=null,raf=0,t0=performance.now(),last=t0;const curBy={};
let act=cur;            // hozir ko'rsatilayotgan elementning konteksti
let FX={real:false,bg:'space',bloom:{strength:.7,threshold:1,radius:1},exposure:1,amb:.05};
const ST={warm:[],sky:0,pipe:0};let skyQ=0,pipe=null,skyPts=null,skyBox=null,skyRT=null,lblLayer=null,clearA=0;
function init(){
 R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,QL.dpr||2));clearA=R.getClearAlpha();
 scene=new THREE.Scene();cam=new THREE.PerspectiveCamera(45,1,.1,400);
 amb=new THREE.AmbientLight(0xffffff,.35);scene.add(amb);pl=new THREE.PointLight(0xffffff,1.4,0,0);pl.position.set(0,0,0);scene.add(pl);
 if(THREE.OrbitControls){ctl=new THREE.OrbitControls(cam,R.domElement);ctl.enableDamping=true;ctl.minDistance=3;ctl.maxDistance=120;}
 R.domElement.style.cssText='display:block;width:100%;height:100%;cursor:grab';
 new ResizeObserver(fit).observe(R.domElement);
 lblLayer=document.createElement('div');lblLayer.className='i3-lbl';lblLayer.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden;font:600 13px system-ui,sans-serif';
}
function fit(){if(!box)return;const w=box.clientWidth,h=box.clientHeight;if(w&&h){R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
 const v=new THREE.Vector2();R.getDrawingBufferSize(v);GU.vp.value.copy(v);GU.pr.value=R.getPixelRatio();}
// Post-ishlov konveyeri (realistik rejim birinchi kerak bo'lganda yaratiladi)
function mkPipe(){
 const gl=R.getContext(),w2=R.capabilities.isWebGL2;
 const hf=w2?!!(gl.getExtension('EXT_color_buffer_float')||gl.getExtension('EXT_color_buffer_half_float')):!!(gl.getExtension('OES_texture_half_float')&&gl.getExtension('EXT_color_buffer_half_float'));
 const type=hf?THREE.HalfFloatType:THREE.UnsignedByteType;
 const opt={type,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false,stencilBuffer:false};
 const P={type,hf,w:0,h:0,rt:null,mips:[],cam:new THREE.OrthographicCamera(-1,1,1,-1,0,1),sc:new THREE.Scene()};
 P.quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2));P.quad.frustumCulled=false;P.sc.add(P.quad);
 const fm=(f,u,b)=>SM({uniforms:u,vertexShader:FS_V,fragmentShader:f,depthTest:false,depthWrite:false,blending:b||THREE.NoBlending});
 P.pre=fm(PRE_F,{tSrc:{value:null},uTx:{value:new THREE.Vector2()},uTh:{value:1},uKnee:{value:.5}});
 P.dn=fm(DN_F,{tSrc:{value:null},uTx:{value:new THREE.Vector2()}});
 P.up=fm(UP_F,{tSrc:{value:null},uTx:{value:new THREE.Vector2()},uR:{value:1}},THREE.AdditiveBlending);
 P.cmp=fm(CMP_F,{tScene:{value:null},tBloom:{value:null},uBloom:{value:0},uExp:{value:1},uOpaque:{value:1}});
 P.size=(w,h)=>{if(w===P.w&&h===P.h&&P.rt)return;P.w=w;P.h=h;if(P.rt)P.rt.dispose();P.mips.forEach(m=>m.dispose());P.mips=[];
  const so={type,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter};
  if(w2&&THREE.WebGLMultisampleRenderTarget&&TQ.ms){P.rt=new THREE.WebGLMultisampleRenderTarget(w,h,so);P.rt.samples=TQ.ms;}else P.rt=new THREE.WebGLRenderTarget(w,h,so);
  let mw=w,mh=h;for(let i=0;i<TQ.mips;i++){mw=Math.max(1,mw>>1);mh=Math.max(1,mh>>1);P.mips.push(new THREE.WebGLRenderTarget(mw,mh,opt));}};
 P.pass=(m,target)=>{P.quad.material=m;R.setRenderTarget(target);R.render(P.sc,P.cam);};
 return P;}
// Fon: yulduzlar — kattaliklar taqsimoti N(<m)∝10^(0.5m), ranglar harorat bo'yicha; ~35% galaktika tekisligida
function mkSky(){const t0s=performance.now();
 const n=TQ.stars,pos=new Float32Array(n*3),col=new Float32Array(n*3),siz=new Float32Array(n),v=new THREE.Vector3(),a=new THREE.Vector3(1,0,0).cross(GN).normalize(),b=GN.clone().cross(a);
 for(let i=0;i<n;i++){
  if(Math.random()<.35){const th=Math.random()*6.2832,la=(Math.random()+Math.random()+Math.random()-1.5)*.16;v.copy(a).multiplyScalar(Math.cos(th)).addScaledVector(b,Math.sin(th)).addScaledVector(GN,la).normalize();}
  else{const z=Math.random()*2-1,t=Math.random()*6.2832,s=Math.sqrt(1-z*z);v.set(s*Math.cos(t),z,s*Math.sin(t));}
  pos.set([v.x,v.y,v.z],i*3);
  const m=Math.max(-1.4,6.5+2*Math.log10(Math.random()+1e-6)),f=Math.pow(10,-.4*(m-6.5));       // kattalik → nisbiy oqim
  const u=Math.random(),T=u<.62?3200+Math.random()*2800:u<.9?6000+Math.random()*3500:9500+Math.random()*16000,c=bb(Math.round(T/250)*250).toArray();
  const I=Math.min(1.6,.07*Math.sqrt(f)*1.6),sat=.55;
  for(let k=0;k<3;k++)col[i*3+k]=(c[k]*sat+(1-sat))*I;siz[i]=1.1+Math.min(2.4,.45*Math.log(1+f));}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aCol',new THREE.BufferAttribute(col,3));g.setAttribute('aSize',new THREE.BufferAttribute(siz,1));
 skyPts=new THREE.Points(g,SM({uniforms:{uPR:GU.pr},vertexShader:SKYP_V,fragmentShader:SKYP_F,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending}));   // shaffof emas — opaque ro'yxatda birinchi chiziladi
 skyPts.frustumCulled=false;skyPts.renderOrder=-1000;skyPts.visible=false;scene.add(skyPts);
 // Somon yo'li: bir marta kub teksturaga pishiriladi, keyin har kadr — bitta tekstura o'qish
 skyRT=new THREE.WebGLCubeRenderTarget(TQ.sky,{format:THREE.RGBAFormat,generateMipmaps:false,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
 const bs=new THREE.Scene(),bm=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),SM({uniforms:{uGN:{value:GN}},vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position*50.0,1.0);}',fragmentShader:BAKE_F,side:THREE.BackSide,depthWrite:false}));
 bs.add(bm);const cc=new THREE.CubeCamera(.1,100,skyRT);cc.updateMatrixWorld();
 const sU={tSky:{value:skyRT.texture},uI:{value:0}};
 const steps=[()=>{const c0=new THREE.Scene();c0.add(new THREE.Mesh(bm.geometry,bm.material));R.compile(c0,cc.children[0]);}];
 for(let i=0;i<6;i++)steps.push(()=>{const rt=R.getRenderTarget();R.setRenderTarget(skyRT,i);R.render(bs,cc.children[i]);R.setRenderTarget(rt);
  if(i===5){bm.geometry.dispose();bm.material.dispose();sU.uI.value=.07;}});
 idle(steps,true);
 skyBox=new THREE.Mesh(new THREE.SphereGeometry(1,24,12),SM({uniforms:sU,vertexShader:SKYB_V,fragmentShader:SKYB_F,side:THREE.BackSide,depthTest:false,depthWrite:false}));
 skyBox.frustumCulled=false;skyBox.renderOrder=-1001;skyBox.visible=false;scene.add(skyBox);ST.sky=performance.now()-t0s;}
function applyFx(){const f=Object.assign({},FX,act.fx);
 FX.cur=f;f.real=!!f.real;const bl=f.bloom;f.bl=bl===false||bl===0?null:Object.assign({strength:.7,threshold:1,radius:1},typeof bl==='number'?{strength:bl}:bl);
 amb.intensity=f.real?(f.amb!=null?f.amb:.05):.35;
 const sky=f.real&&(f.bg==='space'||f.bg==='stars');
 // fon alohida vazifalarda quriladi — element tanlash (pick) uzun to'xtamasin
 if(sky&&!skyPts&&!skyQ){skyQ=1;idle(()=>{if(!skyPts)mkSky();applyFx();},true);}
 if(skyPts){skyPts.visible=sky;skyBox.visible=sky&&f.bg==='space';}}
const vS=new THREE.Vector2();
function renderReal(f){
 if(!pipe)pipe=mkPipe();const P=pipe;R.getDrawingBufferSize(vS);P.size(vS.x,vS.y);
 R.autoClear=false;R.setRenderTarget(P.rt);R.setClearColor(0x000000,f.bg==='none'?0:1);R.clear(true,true,false);R.render(scene,cam);
 let bt=null,N=P.mips.length;
 if(f.bl&&f.bl.strength>0&&N){
  P.pre.uniforms.tSrc.value=P.rt.texture;P.pre.uniforms.uTx.value.set(1/P.w,1/P.h);P.pre.uniforms.uTh.value=f.bl.threshold;P.pass(P.pre,P.mips[0]);
  for(let i=1;i<N;i++){const s=P.mips[i-1];P.dn.uniforms.tSrc.value=s.texture;P.dn.uniforms.uTx.value.set(1/s.width,1/s.height);P.pass(P.dn,P.mips[i]);}
  for(let i=N-2;i>=0;i--){const s=P.mips[i+1];P.up.uniforms.tSrc.value=s.texture;P.up.uniforms.uTx.value.set(1/s.width,1/s.height);P.up.uniforms.uR.value=f.bl.radius;P.pass(P.up,P.mips[i]);}
  bt=P.mips[0].texture;}
 const U=P.cmp.uniforms;U.tScene.value=P.rt.texture;U.tBloom.value=bt||P.rt.texture;U.uBloom.value=bt?f.bl.strength*1.6/N:0;U.uExp.value=f.exposure;U.uOpaque.value=f.bg==='none'?0:1;
 P.pass(P.cmp,null);R.autoClear=true;R.setClearColor(0x000000,clearA);}
// HTML yorliqlar (realistik rejimda sprite yorliqlar o'rniga)
let lbls=[];const vL=new THREE.Vector3();
function mkLabels(list){lblLayer.textContent='';lbls=[];
 list.forEach(s=>{const d=s.userData.lbl;if(!d)return;s.layers.set(1);const e=document.createElement('div');e.textContent=d.txt;
  e.style.cssText=`position:absolute;left:0;top:0;white-space:nowrap;color:${d.col};font-size:${Math.round(13*d.sc)}px;text-shadow:0 0 4px #000,0 0 2px #000;will-change:transform`;lblLayer.appendChild(e);lbls.push({s,e,k:''});});}
function visUp(o){for(;o;o=o.parent)if(!o.visible)return false;return true;}
function updLabels(){if(!lbls.length)return;const w=box.clientWidth,h=box.clientHeight;
 for(const L of lbls){vL.setFromMatrixPosition(L.s.matrixWorld).project(cam);const op=L.s.material.opacity;const on=visUp(L.s)&&vL.z<1&&op>.02;
  const k=on?`translate(-50%,-50%) translate(${((vL.x*.5+.5)*w).toFixed(1)}px,${((-vL.y*.5+.5)*h).toFixed(1)}px)|${op.toFixed(2)}`:'off';
  if(k!==L.k){L.k=k;if(on){L.e.style.display='';const p=k.split('|');L.e.style.transform=p[0];L.e.style.opacity=p[1];}else L.e.style.display='none';}}}
// Tab almashganda o'z teksturalari ham (yorliqlar, chiziqlar) bo'shatiladi; umumiy NASA teksturalari va nur saqlanadi
const ownTex=t=>t&&t.isTexture&&!(t.userData&&t.userData.shared)&&!(window.REALTEX&&window.REALTEX.isShared&&window.REALTEX.isShared(t));
function dispose(o){o.traverse(m=>{m.geometry&&m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>{[x.map,x.alphaMap].forEach(t=>{if(ownTex(t))t.dispose();});
 if(x.uniforms)for(const k in x.uniforms){const v=x.uniforms[k]&&x.uniforms[k].value;if(ownTex(v))v.dispose();}x.dispose();});});}
function pick(cfg,i){const ts=performance.now();
 if(obj){scene.remove(obj.G);dispose(obj.G);}
 cur={ticks:[],real:false,fx:{},labels:[]};
 obj=cfg.items[i].build(H);
 const r=obj;['real','bg','bloom','exposure','amb'].forEach(k=>{if(r[k]!==undefined&&cur.fx[k]===undefined)cur.fx[k]=r[k];});
 if(cur.fx.real===undefined)cur.fx.real=cur.real;
 act=cur;applyFx();mkLabels(cur.fx.real?cur.labels:[]);
 scene.add(obj.G);cam.position.set(...obj.cam);if(ctl){ctl.target.set(...obj.tg);ctl.update();}else cam.lookAt(...obj.tg);t0=last=performance.now();
 window.ILM3D.lastPick={ms:performance.now()-ts,real:cur.fx.real};}
// Faqat ilmiy oyna ochiq bo'lganda chiziladi (avval yopiq oynada ham har kadrda yashirin canvas chizilardi)
function loop(){raf=0;if(!box||!box.isConnected||!box.closest('.open'))return;const now=performance.now(),t=(now-t0)/1000,dt=Math.min(.1,(now-last)/1000);last=now;GU.time.value=t;
 obj&&obj.u&&obj.u(t);for(const f of act.ticks)f(t,dt);ctl&&ctl.update();
 const f=FX.cur;if(f&&f.real)renderReal(f);else R.render(scene,cam);
 updLabels();raf=requestAnimationFrame(loop);}
// Shader dasturlarini bo'sh vaqtda oldindan kompilyatsiya qilish — element almashganda uzun to'xtash bo'lmasin
// Bo'sh vaqt navbati: har vazifa alohida (requestIdleCallback) — uzun to'xtashlar bo'lib tashlanadi
const IQ=[];let iqOn=0;const ric=window.requestIdleCallback||(f=>setTimeout(f,40));
function idle(fn,front){const a=Array.isArray(fn)?fn:[fn];front?IQ.unshift(...a):IQ.push(...a);if(!iqOn){iqOn=1;ric(runIQ,{timeout:800});}}
function runIQ(){iqOn=0;const fn=IQ.shift();if(!fn||!R)return;const tj=performance.now();
 try{fn();}catch(e){console.warn('[ilm3d idle] '+(e&&e.message||e));}ST.warm.push(Math.round(performance.now()-tj));
 if(IQ.length){iqOn=1;ric(runIQ,{timeout:800});}}
// Shader dasturlarini oldindan kompilyatsiya qilish: har materialga bitta vazifa; materiallar saqlanadi (dastur keshda qoladi)
let warmed=false;
function warm(){if(warmed)return;warmed=true;
 const comp=objs=>{objs.forEach(o=>o.traverse(m=>{if(!m.material)return;const sc=new THREE.Scene();sc.add(new THREE.AmbientLight(),new THREE.PointLight());const c=m.isPoints?new THREE.Points(m.geometry,m.material):new THREE.Mesh(m.geometry,m.material);
  c.frustumCulled=false;sc.add(c);keep.push(m.material);idle(()=>R.compile(sc,cam));}));};
 const mk=f=>idle(()=>{const sv=cur;cur={ticks:[],real:false,fx:{},labels:[]};try{comp(f());}finally{cur=sv;}});
 mk(()=>{if(!pipe)pipe=mkPipe();return [pipe.cmp,pipe.pre,pipe.dn,pipe.up].map(m=>new THREE.Mesh(pipe.quad.geometry,m));});
 [()=>[H.star(1,5800)],()=>[H.planet(0x888888,1,{atm:false})],()=>[H.planet(0x888888,1,{ring:true,atmI:1})],()=>[H.disk(1,3)],()=>[H.particles(4)],()=>[H.surface(2,4)],()=>[H.fatLine(4,0xffffff)]].forEach(mk);
 mk(()=>{if(!skyPts){skyQ=1;mkSky();}return [skyPts,skyBox];});}
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const HINT={uz:"Sichqoncha bilan aylantiring, g'ildirakcha bilan yaqinlashtiring",ru:"Вращайте мышью, приближайте колёсиком",en:"Drag to rotate, scroll to zoom"};
const DEF={uz:"3D ko'rgazma",ru:"3D-демонстрация",en:"3D demonstration"};
window.ILM3D={H,reg:{},add(ico,cfg){this.reg[ico]=cfg;},fx:()=>FX.cur,stats:ST,idleLeft:()=>IQ.length+iqOn,pipe:()=>pipe&&{hf:pipe.hf,w:pipe.w,h:pipe.h,ms:pipe.rt&&pipe.rt.samples||0,mips:pipe.mips.length},renderer:()=>R};
const tx=(o,l)=>o==null?'':(typeof o==='string'?o:(o[l]||o.uz));
window.ILMIY_HOOK=function(T,l,art){
 const cfg=window.ILM3D.reg[T.ico];if(!cfg)return;
 if(!art.closest('.open'))return;   // yopiq oynada 3D qurilmaydi — WebGL konteksti birinchi ochilishda yaratiladi
 if(!R)init();
 const ci=curBy[T.ico]||0;
 const sec=document.createElement('section');
 sec.innerHTML=`<h4>${esc(tx(cfg.title,l)||DEF[l])}</h4><div class="i3-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${cfg.items.map((x,i)=>`<button class="ilm-btn${i===ci?' on':''}" data-i3="${i}">${esc(tx(x.n,l))}</button>`).join('')}</div>
 <div class="i3-box" style="position:relative;height:clamp(300px,52vh,480px);border-radius:16px;overflow:hidden;border:1px solid rgba(140,170,255,.15);background:radial-gradient(ellipse at 50% 40%,rgba(30,45,110,.45),rgba(3,5,14,.95))"><span style="position:absolute;left:12px;bottom:10px;font-size:12px;opacity:.6;pointer-events:none;z-index:1">${HINT[l]}</span></div>
 <div class="ilm-box i3-info" style="margin-top:12px"></div>${cfg.extra?cfg.extra(l):''}`;
 const hs=art.querySelectorAll('h4');(hs[1]?art.insertBefore(sec,hs[1]):art.appendChild(sec));
 box=sec.querySelector('.i3-box');box.prepend(R.domElement);box.appendChild(lblLayer);fit();
 const inf=sec.querySelector('.i3-info');
 const info=i=>{const it=cfg.items[i];inf.innerHTML=cfg.info?cfg.info(l,i):`<div style="font-size:20px;font-weight:800;margin-bottom:8px">${esc(tx(it.n,l))}</div><p style="margin:0">${esc(tx(it.d,l))}</p>`;};
 sec.querySelector('.i3-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-i3]');if(!b)return;const i=+b.dataset.i3;curBy[T.ico]=i;pick(cfg,i);sec.querySelectorAll('[data-i3]').forEach(x=>x.classList.toggle('on',x===b));info(i);});
 pick(cfg,ci);info(ci);requestAnimationFrame(fit);
 if(!raf)raf=requestAnimationFrame(loop);
 warm();
};
})();
