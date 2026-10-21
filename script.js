/* ==========================================================================
   QUYOSH TIZIMI — 3D Interaktiv tajriba
   Three.js (r128) yordamida. Barcha teksturalar protsedural (canvas) tarzda
   generatsiya qilinadi — internet rasmlariga bog‘liq emas, offlayn ishlaydi.
   ========================================================================== */

(() => {
'use strict';

/* --------------------------------------------------------------------------
   0. ASOSIY O‘RNATISH (renderer, sahna, kamera, boshqaruv)
   -------------------------------------------------------------------------- */
const canvas   = document.getElementById('scene');
// WebGL ishlamasa foydalanuvchiga xabar ko‘rsatamiz (bo‘sh oq ekran o‘rniga)
let renderer;
try{
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
}catch(err){
  const ld = document.getElementById('loader');
  if(ld) ld.innerHTML = '<p style="max-width:420px;text-align:center;line-height:1.7">⚠️ 3D grafika (WebGL) ishga tushmadi.<br>Sahifani yangilang (Ctrl+F5) yoki boshqa brauzerda oching.</p>';
  throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding   = THREE.sRGBEncoding;
renderer.toneMapping      = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
if(renderer.capabilities.isWebGL2) renderer.antialias = true;

const scene = new THREE.Scene();
// Fon mutlaqo qora emas — chuqur ko‘k-binafsha kosmos tusi
scene.background = new THREE.Color(0x05060f);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 2e8);
camera.position.set(0, 90, 320);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping  = true;     // silliq harakat
controls.dampingFactor  = 0.06;
controls.rotateSpeed     = 0.55;
controls.zoomSpeed       = 0.9;
controls.minDistance     = 14;
controls.maxDistance     = 3e7;    // Quyosh tizimi → Somon yo'li → Mahalliy guruh → kosmik to'r
controls.target.set(0, 0, 0);

const clock = new THREE.Clock();
window.__solar = { camera, controls, scene, renderer, get COSMO(){ return COSMO; }, get BLACKHOLES(){ return BLACKHOLES; }, step:(d)=>cosmicStep(d||0.016), halt:()=>{ focusRec=null; flight=null; }, click:(f)=>playClick(f), skyTick:(d)=>{ skyGridStep(d); skyPoleStep(d); }, impact:(c,m)=>impactPlay(c,m) };   // tashqi diagnostika uchun

/* --------------------------------------------------------------------------
   I18N — til holati (UZ / RU / EN) va yordamchilar
   -------------------------------------------------------------------------- */
let LANG = localStorage.getItem('solar_lang') || 'uz';
if(!window.LOC[LANG]) LANG = 'uz';
const tUI = (k) => (window.LOC[LANG].ui[k] ?? k);
const bodyData = (key) => window.LOC[LANG].bodies[key];
let lastSelectedKey = null;   // panel ochilganda qaysi obyekt

/* --------------------------------------------------------------------------
   1. PROTSEDURAL TEKSTURA GENERATORLARI
   -------------------------------------------------------------------------- */
function makeCanvas(w, h){
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function asTexture(canvas, srgb = true){
  const t = new THREE.CanvasTexture(canvas);
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.wrapS = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  if(!t.userData) t.userData = {};
  if (srgb) t.encoding = THREE.sRGBEncoding;
  return t;
}

/* Haqiqiy teksturalar (realtex.js) mavjud bo'lsa, ular bilan almashtiriladigan jismlar uchun og'ir protsedural
   generatsiya qilinmaydi (sahifa ochilishida ~0.7 s asosiy oqim bo'shaydi) — o'rniga bir rangli kichik tekstura.
   Yuklanish ekrani kamida 6 s turadi, haqiqiy xaritalar esa odatda undan oldin yetib keladi; biror fayl
   yuklanmasa, 26b-bo'lim o'sha jism uchun protsedural teksturani yaratadi (zaxira). */
const RT_ON = !!(window.REALTEX && window.REALTEX.ok);
function flatTexture(hex){
  const c=makeCanvas(4,2), x=c.getContext('2d'); x.fillStyle=hex; x.fillRect(0,0,4,2);
  return asTexture(c);
}

/* ---- 3D qiymatli shovqin (value noise) + fBm ------------------------------
   Sferada TIKISH CHIZIG'I va qutb siqilishi bo'lmasligi uchun tekstura
   2D emas, 3D shovqindan — har piksel shar yuzidagi nuqta sifatida olinadi. */
const _NP = new Uint8Array(512);
(function(){
  const p = new Uint8Array(256); for(let i=0;i<256;i++) p[i]=i;
  let s = 1337; const rnd = ()=> (s = (s*1664525 + 1013904223) >>> 0) / 4294967296;
  for(let i=255;i>0;i--){ const j=Math.floor(rnd()*(i+1)); const t=p[i]; p[i]=p[j]; p[j]=t; }
  for(let i=0;i<512;i++) _NP[i]=p[i&255];
})();
function _h3(x,y,z){ return _NP[(_NP[(_NP[x&255]+y)&255]+z)&255]*0.00392156862745098; }
function vnoise3(x,y,z){
  const xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  const xf=x-xi, yf=y-yi, zf=z-zi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf), w=zf*zf*(3-2*zf);
  const c000=_h3(xi,yi,zi),     c100=_h3(xi+1,yi,zi);
  const c010=_h3(xi,yi+1,zi),   c110=_h3(xi+1,yi+1,zi);
  const c001=_h3(xi,yi,zi+1),   c101=_h3(xi+1,yi,zi+1);
  const c011=_h3(xi,yi+1,zi+1), c111=_h3(xi+1,yi+1,zi+1);
  const x00=c000+(c100-c000)*u, x10=c010+(c110-c010)*u;
  const x01=c001+(c101-c001)*u, x11=c011+(c111-c011)*u;
  const y0=x00+(x10-x00)*v, y1=x01+(x11-x01)*v;
  return y0+(y1-y0)*w;
}
function fbm3(x,y,z,oct,gain,lac){
  let a=0.5,f=1,s=0,n=0; const O=oct||5, G=gain||0.5, L=lac||2.03;
  for(let i=0;i<O;i++){ s+=a*vnoise3(x*f,y*f,z*f); n+=a; a*=G; f*=L; }
  return s/n;
}
function ridged3(x,y,z,oct){
  let a=0.5,f=1,s=0,n=0; const O=oct||4;
  for(let i=0;i<O;i++){ const v=1-Math.abs(vnoise3(x*f,y*f,z*f)*2-1); s+=a*v*v; n+=a; a*=0.5; f*=2.07; }
  return s/n;
}
// Har piksel uchun shar yuzida fn(x,y,z,lat01) hisoblab Float32 maydon qaytaradi.
// div>1 — maydon kichik o'lchamda hisoblanib bilinear kattalashtiriladi (4× tezroq,
// shovqin silliq bo'lgani uchun sifat deyarli o'zgarmaydi).
function sphereField(w,h,scale,fn,div){
  div=div||1;
  if(div>1){
    const sw=Math.max(16,Math.round(w/div)), sh=Math.max(8,Math.round(h/div));
    return upsampleField(sphereField(sw,sh,scale,fn),sw,sh,w,h);
  }
  const out=new Float32Array(w*h);
  for(let j=0;j<h;j++){
    const phi=(j+0.5)/h*Math.PI, sp=Math.sin(phi), cp=Math.cos(phi), lat=j/(h-1);
    for(let i=0;i<w;i++){
      const th=(i+0.5)/w*Math.PI*2;
      out[j*w+i]=fn(sp*Math.cos(th)*scale, cp*scale, sp*Math.sin(th)*scale, lat);
    }
  }
  return out;
}
function upsampleField(src,sw,sh,w,h){
  const out=new Float32Array(w*h);
  for(let j=0;j<h;j++){
    const fy=(j+0.5)*sh/h-0.5, j0=Math.floor(fy), ty=fy-j0;
    const ja=Math.max(0,Math.min(sh-1,j0)), jb=Math.max(0,Math.min(sh-1,j0+1));
    for(let i=0;i<w;i++){
      const fx=(i+0.5)*sw/w-0.5, i0=Math.floor(fx), tx=fx-i0;
      const ia=((i0%sw)+sw)%sw, ib=(((i0+1)%sw)+sw)%sw;
      const v0=src[ja*sw+ia]*(1-tx)+src[ja*sw+ib]*tx;
      const v1=src[jb*sw+ia]*(1-tx)+src[jb*sw+ib]*tx;
      out[j*w+i]=v0*(1-ty)+v1*ty;
    }
  }
  return out;
}
// Balandlik maydonidan normal xarita (relyef yoritilishi uchun — bumpMap'dan aniqroq)
function normalTexture(fld,w,h,strength){
  const c=makeCanvas(w,h), ctx=c.getContext('2d'), img=ctx.createImageData(w,h), d=img.data;
  const S=strength||6;
  for(let j=0;j<h;j++){
    const jm=Math.max(0,j-1), jp=Math.min(h-1,j+1);
    for(let i=0;i<w;i++){
      const im=(i-1+w)%w, ip=(i+1)%w;
      const dx=(fld[j*w+ip]-fld[j*w+im])*S, dy=(fld[jp*w+i]-fld[jm*w+i])*S;
      const l=Math.sqrt(dx*dx+dy*dy+1), k=(j*w+i)*4;
      d[k]=(-dx/l*0.5+0.5)*255; d[k+1]=(-dy/l*0.5+0.5)*255; d[k+2]=(1/l*0.5+0.5)*255; d[k+3]=255;
    }
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  t.wrapS=THREE.RepeatWrapping;
  return t;
}
// Bir kanalli (kulrang) xarita — masalan roughnessMap
function grayTexture(w,h,fn){
  const c=makeCanvas(w,h), ctx=c.getContext('2d'), img=ctx.createImageData(w,h), d=img.data;
  for(let j=0;j<h;j++) for(let i=0;i<w;i++){
    const k=j*w+i, o=k*4, v=Math.max(0,Math.min(255, fn(i,j,k)*255));
    d[o]=d[o+1]=d[o+2]=v; d[o+3]=255;
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c); t.wrapS=THREE.RepeatWrapping;
  t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  return t;
}
// Piksel-piksel rang canvas'i
function pixCanvas(w,h,fn){
  const c=makeCanvas(w,h), ctx=c.getContext('2d'), img=ctx.createImageData(w,h), d=img.data;
  for(let j=0;j<h;j++) for(let i=0;i<w;i++){
    const k=j*w+i, o=k*4; fn(i,j,k,d,o);  d[o+3]=255;
  }
  ctx.putImageData(img,0,0); return c;
}
function hexRGB(c){
  const n=parseInt(String(c).replace('#','').slice(0,6),16);
  return [(n>>16)&255,(n>>8)&255,n&255];
}
const _texCache = Object.create(null);
// Kraterlar — balandlik maydoniga kosa + gardish sifatida chiziladi
function addCraters(fld,w,h,count){
  for(let n=0;n<count;n++){
    const cx=Math.random()*w, cy=h*0.03+Math.random()*h*0.94;
    const R=3+Math.pow(Math.random(),2.4)*Math.min(46, w*0.045);
    const lx=1/Math.max(0.22, Math.sin(cy/h*Math.PI));   // qutblarda cho'zilish
    const depth=0.10+Math.random()*0.15;
    const j0=Math.max(0,Math.floor(cy-R)), j1=Math.min(h,Math.ceil(cy+R));
    for(let j=j0;j<j1;j++){
      const dyv=(j-cy)/R, hw=Math.ceil(R*lx);
      for(let ii=Math.floor(cx-hw); ii<=Math.ceil(cx+hw); ii++){
        const dxv=((ii-cx)/lx)/R, dd=Math.sqrt(dxv*dxv+dyv*dyv);
        if(dd>1.18) continue;
        const i=((ii%w)+w)%w, k=j*w+i;
        const hv = dd<0.78 ? -depth*(1-dd*dd*0.55)
                           :  depth*1.25*Math.exp(-Math.pow((dd-0.88)/0.13,2));
        fld[k]=Math.max(0,Math.min(1, fld[k]+hv));
      }
    }
  }
}
// Tekstura + normal xarita juftidan MeshStandardMaterial
function stdFromTex(t, extra){
  const m=new THREE.MeshStandardMaterial(Object.assign({map:t, roughness:0.92, metalness:0.03}, extra||{}));
  if(t && t.userData && t.userData.normalMap){
    m.normalMap=t.userData.normalMap;
    m.normalScale=new THREE.Vector2(t.userData.normalScale||1, t.userData.normalScale||1);
  } else if(t){ m.bumpMap=t; m.bumpScale=0.03; }
  if(t && t.userData && t.userData.roughnessMap) m.roughnessMap=t.userData.roughnessMap;
  return m;
}
// fBm-ga o‘xshash shovqin: ko‘p qatlamli yarim shaffof dog‘lar
function speckle(ctx, w, h, count, colorFn, rMin, rMax){
  for (let i=0;i<count;i++){
    const x = Math.random()*w, y = Math.random()*h;
    const r = rMin + Math.random()*(rMax-rMin);
    ctx.fillStyle = colorFn();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
  }
}

/* Toshli jism (Merkuriy, Mars, oylar, mitti sayyoralar).
   fBm + ridged relyef → rang xaritasi VA normal xarita; kraterlar haqiqiy
   chuqurlik/gardish sifatida balandlikka o'yiladi. Natija keshlanadi. */
function rockyTexture(base, shades, craterCount, res){
  const key='r|'+base+'|'+(shades||[]).join(',')+'|'+craterCount+'|'+(res||0);
  if(_texCache[key]) return _texCache[key];
  const small = (res===0) || craterCount<30;
  const w = res || (small?512:768), h = w>>1;
  const sd = (parseInt(String(base).replace('#','').slice(0,6),16)%997)*0.031;
  const fld = sphereField(w,h,2.1,(x,y,z)=>{
    const b = fbm3(x+sd, y+sd*0.7, z-sd, small?3:4, 0.52, 2.07);
    const r = ridged3(x*1.9+sd, y*1.9, z*1.9, small?2:3);
    return Math.max(0, Math.min(1, b*0.62 + r*0.38));
  },2);
  const reg = sphereField(w,h,0.85,(x,y,z)=> fbm3(x+11.3, y+4.1, z+7.7, 2, 0.5, 2.1),4);
  if(craterCount) addCraters(fld,w,h,craterCount|0);
  const B = hexRGB(base);
  const T = (shades && shades.length ? shades : [base]).map(hexRGB);
  const cv = pixCanvas(w,h,(i,j,k,d,o)=>{
    const hv = fld[k], rg = reg[k];
    const ti = Math.min(T.length-1, Math.floor(rg*T.length*0.999));
    const mixT = 0.3 + rg*0.38;                       // mintaqaviy tus
    const lum  = 0.64 + hv*0.62;                      // balandlik → yorqinlik
    const grain = 0.96 + (_h3(i*3&255, j*7&255, (i+j)&255))*0.08;
    for(let ch=0; ch<3; ch++){
      const base2 = B[ch]*(1-mixT) + T[ti][ch]*mixT;
      d[o+ch] = Math.max(0, Math.min(255, base2*lum*grain));
    }
  });
  const tex = asTexture(cv);
  tex.userData.normalMap = normalTexture(fld,w,h, small?5:8);
  tex.userData.normalScale = 0.65;
  _texCache[key]=tex;
  return tex;
}

// Kamar ranglarini 1×H lentaga chizib, piksel massivi sifatida o'qish
function bandStrip(bands,H){
  const c=makeCanvas(1,H), ctx=c.getContext('2d');
  let y=0; const total=bands.reduce((s,b)=>s+(b.size||1),0);
  bands.forEach(b=>{
    const bh=H*(b.size||1)/total;
    const g=ctx.createLinearGradient(0,y,0,y+bh);
    g.addColorStop(0,b.c1); g.addColorStop(1,b.c2||b.c1);
    ctx.fillStyle=g; ctx.fillRect(0,Math.floor(y),1,Math.ceil(bh)+1); y+=bh;
  });
  return ctx.getImageData(0,0,1,H).data;
}
/* Gaz giganti — kamarlar domen-burilish (domain warp) bilan to'lqinlanadi,
   shuning uchun to'g'ri chiziqlar emas, haqiqiy oqim/uyurma ko'rinadi. */
function gasGiantTexture(bands, opts={}){
  const key='g|'+JSON.stringify(bands)+'|'+JSON.stringify(opts);
  if(_texCache[key]) return _texCache[key];
  const w=1024, h=512;
  const strip = bandStrip(bands, h);
  // Shovqin maydonlari BIR marta hisoblanadi va barcha gaz gigantlari uchun
  // qayta ishlatiladi (ranglar har sayyorada boshqa — naqsh sezilmaydi).
  if(!_texCache._gasW){
    _texCache._gasW = sphereField(w,h,1.0,(x,y,z)=> fbm3(x*1.5, y*2.6, z*1.5, 3, 0.55, 2.1)-0.5, 3);
    _texCache._gasT = sphereField(w,h,1.0,(x,y,z)=> fbm3(x*2.2+31.7, y*11.0, z*2.2-13.1, 4, 0.55, 2.05), 2);
    _texCache._gasN = normalTexture(_texCache._gasT,w,h,2.2);
  }
  const warp=_texCache._gasW, turb=_texCache._gasT;
  const cv = pixCanvas(w,h,(i,j,k,d,o)=>{
    const shift = warp[k]*h*0.085 + (turb[k]-0.5)*h*0.012;
    let fy = j + shift;
    fy = Math.max(0, Math.min(h-1.001, fy));
    const j0=Math.floor(fy), f=fy-j0, j1=Math.min(h-1,j0+1);
    const lum = 0.97 + (turb[k]-0.5)*0.34;
    for(let ch=0; ch<3; ch++){
      const v = strip[j0*4+ch]*(1-f) + strip[j1*4+ch]*f;
      d[o+ch] = Math.max(0, Math.min(255, v*lum));
    }
  });
  const ctx = cv.getContext('2d');
  // Uyurmalar — cho'zilgan oval bo'ronlar
  const storms = opts.storms==null ? 7 : opts.storms;
  for(let n=0;n<storms;n++){
    const x=Math.random()*w, y=h*0.12+Math.random()*h*0.76;
    const rx=30+Math.random()*90, ry=rx*(0.22+Math.random()*0.2);
    const light=Math.random()>0.5;
    const g=ctx.createRadialGradient(x,y,1,x,y,rx);
    g.addColorStop(0, light?'rgba(255,255,250,0.32)':'rgba(40,25,15,0.30)');
    g.addColorStop(1, light?'rgba(255,255,250,0)':'rgba(40,25,15,0)');
    ctx.save(); ctx.translate(x,y); ctx.scale(1,ry/rx); ctx.translate(-x,-y);
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,rx,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
  // Yupiterning Katta Qizil Dog'i — halqasimon oqim bilan
  if (opts.redSpot){
    ctx.save();
    ctx.translate(w*0.72, h*0.62); ctx.scale(1.75,1);
    let g = ctx.createRadialGradient(0,0,3, 0,0,h*0.13);
    g.addColorStop(0,'#f08050'); g.addColorStop(0.35,'#e0552f');
    g.addColorStop(0.72,'#bb3f26'); g.addColorStop(1,'rgba(150,55,35,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,h*0.13,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=0.35; ctx.strokeStyle='#ffd9b0'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(0,0,h*0.085,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  const tex = asTexture(cv);
  tex.userData.normalMap = _texCache._gasN;
  tex.userData.normalScale = 0.35;
  _texCache[key]=tex;
  return tex;
}

/* --- YER -------------------------------------------------------------------
   Qit'alar tasodifiy blob emas: domen-burilishli fBm balandlik maydoni.
   Bir marta hisoblanadi, kunduz/kecha/roughness/normal xaritalar shundan. */
const EW=1024, EH=512;
let _earth=null;
function earthFields(){
  if(_earth) return _earth;
  // domen-burilish → tabiiy, tolali qirg'oq chiziqlari
  const cont = sphereField(EW,EH,1.35,(x,y,z)=>{
    const wx = fbm3(x*2.1+5.2, y*2.1-1.7, z*2.1+9.4, 3, 0.5, 2.1)-0.5;
    const wy = fbm3(x*2.1-3.9, y*2.1+6.3, z*2.1-2.8, 3, 0.5, 2.1)-0.5;
    return fbm3(x+wx*1.6, y+wy*1.6, z+wx*1.1, 5, 0.52, 2.05);
  },2);
  // tog' tizmalari (faqat quruqlikda ko'rinadi)
  const mtn = sphereField(EW,EH,2.6,(x,y,z)=> ridged3(x*1.6+17.1, y*1.6+2.4, z*1.6-8.6, 4),2);
  const detail = sphereField(EW,EH,6.5,(x,y,z)=> fbm3(x,y,z,3,0.5,2.2),2);
  const SEA=0.505;
  const land=new Float32Array(EW*EH), elev=new Float32Array(EW*EH);
  for(let k=0;k<EW*EH;k++){
    const c=cont[k];
    land[k] = c>SEA ? Math.min(1,(c-SEA)/0.16) : 0;
    elev[k] = c>SEA
      ? 0.5 + Math.min(0.5, (c-SEA)*1.6 + mtn[k]*land[k]*0.42 + detail[k]*0.05)
      : 0.5 - Math.min(0.5, (SEA-c)*1.2);
  }
  _earth={cont,mtn,detail,land,elev,SEA};
  return _earth;
}
function earthDayTexture(){
  if(_texCache.earthDay) return _texCache.earthDay;
  const F=earthFields();
  const cv=pixCanvas(EW,EH,(i,j,k,d,o)=>{
    const lat=Math.abs(j/(EH-1)*2-1);          // 0 ekvator → 1 qutb
    const l=F.land[k], c=F.cont[k], m=F.mtn[k], dt=F.detail[k];
    let r,g,b;
    if(l<=0){                                  // OKEAN — chuqurlikka qarab
      const dep=Math.min(1,(F.SEA-c)/0.22);
      r=8+(1-dep)*30; g=38+(1-dep)*68; b=78+(1-dep)*74;
      if(dep<0.12){ r+=40; g+=60; b+=40; }     // qirg'oq sayozligi
    } else {
      const shelf=Math.min(1,l/0.14);
      // iqlim mintaqalari: tropik o'rmon → cho'l kamari → mo'tadil → tayga
      const desert=Math.max(0, 1-Math.abs(lat-0.29)/0.17) * (0.45+dt*0.9);
      const cold=Math.max(0, (lat-0.55)/0.35);
      let lr=58, lg=96, lb=44;                 // o'simlik
      if(dt>0.56){ lr=74; lg=100; lb=50; }
      lr=lr*(1-desert)+186*desert; lg=lg*(1-desert)+158*desert; lb=lb*(1-desert)+96*desert;
      lr=lr*(1-cold)+92*cold;      lg=lg*(1-cold)+104*cold;     lb=lb*(1-cold)+86*cold;
      // tog' jinsi va qor chizig'i
      const rock=Math.max(0,(m-0.62))*2.2*l;
      lr=lr*(1-rock)+132*rock; lg=lg*(1-rock)+122*rock; lb=lb*(1-rock)+110*rock;
      const sw=Math.min(1, Math.max(0,(F.elev[k]-0.86)*7)*(0.35+lat*1.2));
      lr=lr*(1-sw)+246*sw; lg=lg*(1-sw)+250*sw; lb=lb*(1-sw)+255*sw;
      // qirg'oq qumi
      r=lr*shelf+196*(1-shelf); g=lg*shelf+182*(1-shelf); b=lb*shelf+140*(1-shelf);
    }
    // qutb muzliklari — shovqinli chegara bilan
    const ice=Math.min(1, Math.max(0,(lat-(0.845-dt*0.05))/0.06));
    if(ice>0){ r=r*(1-ice)+242*ice; g=g*(1-ice)+247*ice; b=b*(1-ice)+255*ice; }
    d[o]=Math.min(255,r); d[o+1]=Math.min(255,g); d[o+2]=Math.min(255,b);
  });
  const t=asTexture(cv);
  t.userData.normalMap=normalTexture(F.elev,EW,EH,10);
  t.userData.normalScale=1.0;
  t.userData.roughnessMap=grayTexture(EW,EH,(i,j,k)=> F.land[k]>0 ? 0.92 : 0.13);
  _texCache.earthDay=t;
  return t;
}
function earthNightTexture(){
  if(_texCache.earthNight) return _texCache.earthNight;
  const F=earthFields();
  const c=makeCanvas(EW,EH), ctx=c.getContext('2d');
  ctx.fillStyle='#01030a'; ctx.fillRect(0,0,EW,EH);
  // chiroqlar qirg'oqqa va mo'tadil kengliklarga to'planadi (aholi zichligi taqlidi)
  const pop = sphereField(EW>>1,EH>>1,3.2,(x,y,z)=> fbm3(x+41.7,y-13.3,z+7.9,3,0.5,2.1),2);
  for(let n=0;n<90000;n++){
    const i=Math.floor(Math.random()*EW), j=Math.floor(Math.random()*EH), k=j*EW+i;
    if(F.land[k]<=0) continue;
    const lat=Math.abs(j/(EH-1)*2-1);
    if(lat>0.82) continue;
    const coast=1-Math.min(1,F.land[k]/0.35);
    const dens=pop[(j>>1)*(EW>>1)+(i>>1)];
    const p=(0.22+coast*0.55)*Math.pow(dens,2.2)*(1-Math.max(0,(lat-0.5)/0.5)*0.6);
    if(Math.random()>p) continue;
    const b=Math.random();
    ctx.fillStyle = b>0.88 ? 'rgba(255,244,205,0.98)'
                  : b>0.5  ? 'rgba(255,214,132,0.72)'
                           : 'rgba(255,186,96,0.42)';
    ctx.fillRect(i,j, b>0.88?2:1, b>0.88?2:1);
  }
  const t=asTexture(c);
  _texCache.earthNight=t;
  return t;
}
function cloudTexture(){
  if(_texCache.clouds) return _texCache.clouds;
  const w=1024,h=512;
  // kamarli tuzilma: ekvatorial konvergensiya + mo'tadil siklonlar
  const f1=sphereField(w,h,2.4,(x,y,z)=>{
    const wx=fbm3(x*2.6+2.1,y*2.6,z*2.6-4.4,2,0.5,2.1)-0.5;
    return fbm3(x+wx*1.3, y*1.15, z+wx*0.9, 4, 0.55, 2.1);
  },2);
  const cv=makeCanvas(w,h), ctx=cv.getContext('2d');
  const img=ctx.createImageData(w,h), d=img.data;
  for(let j=0;j<h;j++){
    const lat=Math.abs(j/(h-1)*2-1);
    const bandW = 0.62
      + 0.3*Math.exp(-Math.pow((lat-0.02)/0.10,2))     // ITCZ
      + 0.26*Math.exp(-Math.pow((lat-0.58)/0.16,2))    // mo'tadil kamarlar
      - 0.22*Math.exp(-Math.pow((lat-0.30)/0.12,2));   // subtropik quruq kamar
    for(let i=0;i<w;i++){
      const k=j*w+i, o=k*4;
      const a=Math.max(0, Math.min(1, (f1[k]*bandW-0.34)*3.1));
      d[o]=d[o+1]=d[o+2]=255;
      d[o+3]=Math.round(a*255);
    }
  }
  ctx.putImageData(img,0,0);
  const t=asTexture(cv,false);
  _texCache.clouds=t;
  return t;
}

// Saturn halqalari — minglab halqacha (ringlet) + Cassini bo'shlig'i
function ringTexture(){
  if(_texCache.ring) return _texCache.ring;
  const sz=1024, c=makeCanvas(sz,sz), ctx=c.getContext('2d');
  ctx.clearRect(0,0,sz,sz);
  const cx=sz/2, cy=sz/2, r0=sz*0.30, r1=sz*0.5;
  for(let r=r0; r<r1; r+=0.5){
    const t=(r-r0)/(r1-r0);
    // ko'p chastotali halqachalar
    let a = 0.42
      + 0.20*Math.sin(r*0.55) + 0.13*Math.sin(r*1.7+1.3)
      + 0.07*Math.sin(r*3.3+0.7);
    a *= 0.88 + vnoise3(r*0.05, 3.7, 1.1)*0.3;
    if(t>0.44 && t<0.50) a *= 0.10;                        // Cassini bo'shlig'i
    if(t>0.70 && t<0.725) a *= 0.30;                       // Enke
    if(t<0.06) a *= t/0.06;                                // ichki chegara yumshoq
    if(t>0.965) a *= (1-t)/0.035;                          // tashqi chegara yumshoq
    a=Math.max(0,Math.min(0.92,a));
    const ice = 0.55 + 0.45*vnoise3(r*0.02, 8.2, 4.4);     // muz/chang nisbati
    const R=Math.round(196+ice*46), G=Math.round(176+ice*44), Bl=Math.round(140+ice*46);
    ctx.strokeStyle='rgba('+R+','+G+','+Bl+','+a.toFixed(3)+')';
    ctx.lineWidth=0.9;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
  }
  const t=asTexture(c, false);
  _texCache.ring=t;
  return t;
}

// Yumshoq dumaloq nuqta (yulduz/zarra sprite-i)
function dotTexture(){
  const s=64,c=makeCanvas(s,s),ctx=c.getContext('2d');
  const g=ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  g.addColorStop(0,'rgba(255,255,255,1)');
  g.addColorStop(0.2,'rgba(255,255,255,0.8)');
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,s,s);
  return asTexture(c,false);
}
const SPRITE = dotTexture();

const TAU = Math.PI*2;
const sstep=(a,b,x)=>{ const t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); };
function gRand(){ let u=0; while(!u) u=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(Math.PI*2*Math.random()); }
/* Yumshoq nuqtalar (galaktika yulduzlari, kometa dumlari).
   Nuqta 1 pikseldan kichrayganda yorug'lik ps² bilan kamayadi — sirt yorqinligi saqlanadi,
   shuning uchun uzoqlashgan galaktika "yo'qolib" emas, tabiiy kichrayib boradi. */
const PX_SCALE = { value: 1000 };
function softPointsMaterial(o){
  o=o||{};
  return new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ uOpacity:{value:o.opacity==null?1:o.opacity}, uScale:PX_SCALE, uMaxPx:{value:o.maxPx||6},
      uN0:{value:o.n0||0}, uN1:{value:o.n1||0.001} },
    vertexShader:[
      'attribute float aSize; attribute vec3 aColor;',
      'uniform float uOpacity,uScale,uMaxPx,uN0,uN1; varying vec3 vC;',
      'void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); float d=max(-mv.z,0.0001);',
      '  float ps=aSize*uScale/d; float a=uOpacity*smoothstep(uN0,uN1,d);',
      '  if(ps<1.0){ a*=smoothstep(0.3,1.0,ps); ps=1.0; }',   // juda uzoqda nuqtalar so\'nadi, shaklni disk teksturasi beradi
      '  vC=aColor*a; gl_PointSize=min(ps,uMaxPx); gl_Position=projectionMatrix*mv; }'
    ].join('\n'),
    fragmentShader:'varying vec3 vC; void main(){ vec2 p=gl_PointCoord-0.5; float r2=dot(p,p)*4.0; if(r2>1.0) discard; gl_FragColor=vec4(vC*exp(-r2*3.2),1.0); }'
  });
}
// Logarifmik spiral qo'llar — zarralar ham, teksturalar ham AYNAN shu formuladan
function armOff(th, r, g, k, shift){
  const lr=Math.log(Math.max(r,0.015)/0.06)/Math.tan(g.pitch);
  let d=th-(k*TAU/g.arms + lr + (shift||0));
  d=((d%TAU)+TAU)%TAU; if(d>Math.PI) d-=TAU; return d;
}
function armProfile(th, r, g, shift, wMul){
  let a=0; const w=g.armW*(0.55+r*0.9)*(wMul||1);
  for(let k=0;k<g.arms;k++){ const d=armOff(th,r,g,k,shift)*Math.max(r,0.12); a=Math.max(a,Math.exp(-(d*d)/(w*w))); }
  return a;
}
function spiralPixel(x,z,g,n,n2,out){
  const r=Math.hypot(x,z); if(r>=1){ out[0]=out[1]=out[2]=0; return 0; }
  const th=Math.atan2(z,x), edge=1-sstep(0.78,1.0,r);
  const disk=Math.exp(-r/g.rs)*edge;
  const arm=g.arms?armProfile(th,r,g,0,1):0, armI=arm*Math.max(0,0.2+1.6*(n-0.5)+0.5);
  const bul=Math.exp(-(r*r)/(g.rb*g.rb));
  let bar=0; if(g.bar){ const c=Math.cos(g.barA), s=Math.sin(g.barA), bx=x*c+z*s, bz=-x*s+z*c; bar=Math.exp(-(bx*bx)/(g.bar*g.bar)-(bz*bz)/0.0012); }
  const dI=disk*(0.2+0.85*armI)*(0.6+0.8*n2), mA=Math.min(1,armI);
  let R=dI*(1-0.34*mA), G=dI*(0.9-0.1*mA), B=dI*(0.78+0.22*mA);
  const core=bul*1.25+bar*0.7; R+=core; G+=core*0.84; B+=core*0.6;
  if(arm>0.5&&n2>0.64){ const h=(n2-0.64)*3.2*disk; R+=h; G+=h*0.35; B+=h*0.55; }
  out[0]=R; out[1]=G; out[2]=B; return arm;
}

// Tumanlik (nebula) — domen-burilishli fBm: tolali gaz, qora chang yo'laklari,
// ikki tusli ionlashgan gaz (H-alfa / O-III) va ichidagi yosh yulduzlar
function nebulaTexture(tint){
  const key='neb|'+tint; if(_texCache[key]) return _texCache[key];
  const m=tint.match(/rgba\((\d+),(\d+),(\d+)/); const T=[+m[1],+m[2],+m[3]];
  const T2=[235,88,122];                                // H-alfa (ionlashgan vodorod) qizg'ish-pushti
  const seed=(T[0]*0.37+T[1]*0.11+T[2]*0.07)%17;
  const lo=192, S=384;
  const sm=makeCanvas(lo,lo), sx=sm.getContext('2d'), im=sx.createImageData(lo,lo), d=im.data;
  for(let j=0;j<lo;j++) for(let i=0;i<lo;i++){
    const x=i/lo*2-1, y=j/lo*2-1, r=Math.hypot(x,y), o=(j*lo+i)*4;
    const fall=Math.exp(-r*r*2.4)*(1-sstep(0.72,1,r));
    if(fall<0.004) continue;
    const wx=fbm3(x*1.6+seed, y*1.6, 1.3, 3, 0.5, 2.1)-0.5, wy=fbm3(x*1.6-4.2, y*1.6+seed, 7.7, 3, 0.5, 2.1)-0.5;
    const n=fbm3(x*2.2+wx*1.8, y*2.2+wy*1.8, seed, 5, 0.55, 2.05);
    const fil=ridged3(x*3.1+wx*2.2, y*3.1+wy*2.2, seed+3.3, 4);
    let a=(Math.max(0,n-0.38)*2.4 + Math.pow(fil,3)*0.85)*fall;
    a*=1-0.85*sstep(0.55,0.72, fbm3(x*4+11, y*4-3, seed*0.5, 4, 0.5, 2.1));   // chang
    const mc=sstep(0.35,0.7, fbm3(x*1.3+20, y*1.3, seed, 3, 0.5, 2.1));
    const hot=Math.pow(fil,6)*fall*0.5;
    for(let c=0;c<3;c++) d[o+c]=Math.min(255, T[c]*(1-mc)+T2[c]*mc + hot*255);
    d[o+3]=Math.min(255, a*170);
  }
  sx.putImageData(im,0,0);
  const c=makeCanvas(S,S), ctx=c.getContext('2d');
  ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.drawImage(sm,0,0,S,S);
  for(let k=0;k<26;k++){                                 // ichidagi yosh yulduzlar
    const rr=Math.pow(Math.random(),1.5)*S*0.3, aa=Math.random()*TAU;
    const x=S/2+Math.cos(aa)*rr, y=S/2+Math.sin(aa)*rr, R=1+Math.random()*3.5;
    const g=ctx.createRadialGradient(x,y,0,x,y,R*3);
    g.addColorStop(0,'rgba(255,255,255,0.95)'); g.addColorStop(0.3,'rgba(210,225,255,0.35)'); g.addColorStop(1,'rgba(200,220,255,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,R*3,0,TAU); ctx.fill();
  }
  const t=asTexture(c,false); _texCache[key]=t; return t;
}

/* --------------------------------------------------------------------------
   2. YULDUZLAR, TUMANLIKLAR, GALAKTIKALAR, KOSMIK CHANG
   -------------------------------------------------------------------------- */
function buildStarLayer(count, radius, size, opacity){
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count*3);
  const col = new Float32Array(count*3);
  const palette = [
    [1,1,1],[0.8,0.85,1],[1,0.9,0.75],[0.7,0.8,1],[1,0.8,0.7]
  ];
  for(let i=0;i<count;i++){
    // sferada teng taqsimot
    const u=Math.random(), v=Math.random();
    const theta=2*Math.PI*u, phi=Math.acos(2*v-1);
    const r=radius*(0.7+Math.random()*0.3);
    pos[i*3]  =r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
    pos[i*3+2]=r*Math.cos(phi);
    const cc=palette[Math.floor(Math.random()*palette.length)];
    const b=0.6+Math.random()*0.4;
    col[i*3]=cc[0]*b; col[i*3+1]=cc[1]*b; col[i*3+2]=cc[2]*b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  const mat = new THREE.PointsMaterial({
    size, map:SPRITE, vertexColors:true, transparent:true, opacity,
    depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true
  });
  return new THREE.Points(geo, mat);
}
// Parallaks uchun ikki qatlam (turli tezlikda aylanadi)
const starsFar  = buildStarLayer(6000, 3000, 6, 0.9);
const starsNear = buildStarLayer(3000, 1800, 9, 0.8);
scene.add(starsFar, starsNear);

// Tumanliklar (nebula) — katta shaffof tekisliklar
const nebulaGroup = new THREE.Group();
const nebulaSprites = [];   // vizual sayohat uchun
const nebTints = ['rgba(90,120,255,A)','rgba(160,80,220,A)','rgba(60,180,200,A)','rgba(220,90,160,A)'];
for(let i=0;i<8;i++){
  const tex = nebulaTexture(nebTints[i%nebTints.length]);
  const mat = new THREE.SpriteMaterial({ map:tex, transparent:true, opacity:0.55,
    blending:THREE.AdditiveBlending, depthWrite:false });
  const sp = new THREE.Sprite(mat);
  const d=1400+Math.random()*1200;
  const a=Math.random()*Math.PI*2, b=(Math.random()-0.5)*1.2;
  sp.position.set(Math.cos(a)*d, b*d*0.5, Math.sin(a)*d);
  const s=500+Math.random()*700; sp.scale.set(s,s,1);
  nebulaGroup.add(sp);
  nebulaSprites.push(sp);
}
scene.add(nebulaGroup);

// Uzoq galaktikalar — spiral qo'llar, bar, bo'rtiq va chang (spiralPixel)
function galaxyTexture(){
  const S=256, c=makeCanvas(S,S), ctx=c.getContext('2d'), im=ctx.createImageData(S,S), d=im.data;
  const g={arms:2+(Math.random()*2|0), pitch:0.32+Math.random()*0.25, armW:0.08, rs:0.3, rb:0.1+Math.random()*0.06,
    bar:Math.random()<0.5?0.24:0, barA:Math.random()*3, seed:Math.random()*20};
  const inc=0.45+Math.random()*0.5, out=[0,0,0];
  for(let j=0;j<S;j++) for(let i=0;i<S;i++){
    const x=(i/S*2-1)/0.95, z=(j/S*2-1)/0.95/inc, o=(j*S+i)*4;
    const n=fbm3(x*5+g.seed, z*5, g.seed, 3, 0.55, 2.1), n2=fbm3(x*12, z*12-g.seed, 2.2, 2, 0.5, 2.2);
    spiralPixel(x,z,g,n,n2,out);
    d[o]=255*(1-Math.exp(-out[0]*1.3)); d[o+1]=255*(1-Math.exp(-out[1]*1.3)); d[o+2]=255*(1-Math.exp(-out[2]*1.3)); d[o+3]=255;
  }
  ctx.putImageData(im,0,0);
  return asTexture(c,false);
}
const galaxySprites = [];   // vizual sayohat uchun
for(let i=0;i<4;i++){
  const m=new THREE.SpriteMaterial({ map:galaxyTexture(), transparent:true, opacity:0.7,
    blending:THREE.AdditiveBlending, depthWrite:false });
  const sp=new THREE.Sprite(m);
  const d=2200+Math.random()*600, a=Math.random()*Math.PI*2;
  sp.position.set(Math.cos(a)*d,(Math.random()-0.5)*900,Math.sin(a)*d);
  const s=260+Math.random()*220; sp.scale.set(s,s,1);
  scene.add(sp);
  galaxySprites.push(sp);
}

// Harakatlanuvchi kosmik chang
const dustGeo=new THREE.BufferGeometry();
const dustN=900, dpos=new Float32Array(dustN*3);
for(let i=0;i<dustN;i++){
  dpos[i*3]=(Math.random()-0.5)*900;
  dpos[i*3+1]=(Math.random()-0.5)*500;
  dpos[i*3+2]=(Math.random()-0.5)*900;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos,3));
const dust=new THREE.Points(dustGeo, new THREE.PointsMaterial({
  size:2, map:SPRITE, color:0x9fb4ff, transparent:true, opacity:0.5,
  depthWrite:false, blending:THREE.AdditiveBlending }));
scene.add(dust);

/* --------------------------------------------------------------------------
   3. QUYOSH — animatsion shader + korona + nur
   -------------------------------------------------------------------------- */
const SUN_RADIUS = 14;
// 3D simplex shovqin (Ashima) — quyosh yuzasi uchun
const NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*snoise(p); p*=2.0; a*=0.5;} return v;}
`;
const sunMat = new THREE.ShaderMaterial({
  uniforms:{ time:{value:0}, sunTex:{value:null}, realMap:{value:0} },
  vertexShader:`
    varying vec3 vPos; varying vec3 vSN; varying vec3 vSW; varying vec2 vUv;
    void main(){ vPos=position; vUv=uv; vSN=normalize(mat3(modelMatrix)*normal); vSW=(modelMatrix*vec4(position,1.0)).xyz;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: NOISE_GLSL + `
    uniform float time; uniform sampler2D sunTex; uniform float realMap;
    varying vec3 vPos; varying vec3 vSN; varying vec3 vSW; varying vec2 vUv;
    void main(){
      vec3 p=normalize(vPos)*2.2;
      float n=fbm(p+vec3(0.0,0.0,time*0.12));
      float n2=fbm(p*3.0-vec3(time*0.18));
      float v=n*0.6+n2*0.4;
      vec3 dark=vec3(0.9,0.25,0.04);
      vec3 mid =vec3(1.0,0.55,0.10);
      vec3 hot =vec3(1.0,0.92,0.55);
      vec3 col=mix(dark,mid,smoothstep(-0.3,0.3,v));
      col=mix(col,hot,smoothstep(0.25,0.7,v));
      col+=pow(max(v,0.0),3.0)*vec3(1.0,0.7,0.3);  // alanga porlashi
      // Haqiqiy fotosfera surati: granulalar rasmdan, "qaynash" esa shovqin bilan jonlantiriladi
      if(realMap>0.5){
        vec3 tc=texture2D(sunTex, vUv+vec2(time*0.0015,0.0)).rgb;
        // yorqin, oq-sariqqa moyil fotosfera; shovqin faqat yengil "qaynash" beradi (yirik dog'lar yo'q)
        vec3 real=pow(tc,vec3(0.85))*vec3(1.45,1.3,1.1)*(1.0+0.16*v) + pow(max(v,0.0),3.0)*vec3(0.35,0.2,0.06);
        col=mix(col, real, 0.92);
      }
      // chekka qorayishi (limb darkening) — disk chetida xiraroq va qizg'ishroq
      float mu=max(dot(normalize(vSN),normalize(cameraPosition-vSW)),0.0);
      col*=0.38+0.62*pow(mu,0.5);
      col=mix(col*vec3(1.0,0.72,0.5),col,smoothstep(0.0,0.45,mu));
      gl_FragColor=vec4(col,1.0);
    }`
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(SUN_RADIUS, 128, 128), sunMat);
sun.userData = solarData('Quyosh');
sun.userData.key = 'sun';
scene.add(sun);

// Quyosh nuri — atrofdagi obyektlarni yoritadi
const sunLight = new THREE.PointLight(0xffe8c0, 3.2, 0, 1.4);
sun.add(sunLight);
scene.add(new THREE.AmbientLight(0x223055, 0.35)); // engil to‘ldiruvchi yorug‘lik

// Korona / halo — additiv sprite
function glowTexture(){
  const s=256,c=makeCanvas(s,s),ctx=c.getContext('2d');
  const g=ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  g.addColorStop(0,'rgba(255,230,160,0.9)');
  g.addColorStop(0.25,'rgba(255,160,60,0.5)');
  g.addColorStop(0.6,'rgba(255,110,40,0.15)');
  g.addColorStop(1,'rgba(255,80,30,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,s,s);
  return asTexture(c,false);
}
const corona = new THREE.Sprite(new THREE.SpriteMaterial({
  map:glowTexture(), transparent:true, blending:THREE.AdditiveBlending, depthWrite:false }));
corona.scale.set(SUN_RADIUS*7, SUN_RADIUS*7, 1);
sun.add(corona);
// Keng va xira tashqi nur — Quyosh atrofidagi "yorug'lik havosi" (bitta sprite, arzon)
const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({
  map:glowTexture(), color:0xffb35a, transparent:true, opacity:0.32, blending:THREE.AdditiveBlending, depthWrite:false }));
sunHalo.scale.set(SUN_RADIUS*16, SUN_RADIUS*16, 1);
sun.add(sunHalo);

/* --------------------------------------------------------------------------
   4. SAYYORALAR MA'LUMOTLARI (o‘zbek tilida)
   -------------------------------------------------------------------------- */
const PLANETS = [
  { key:'mercury', name:'Merkuriy', type:'SAYYORA', color:0x9c8b7a,
    radius:1.4, orbit:34, speed:0.048, spin:0.004, tilt:0.03,
    desc:'Quyoshga eng yaqin va eng kichik sayyora. Atmosferasi deyarli yo‘q.',
    dist:'57.9 mln km', dia:'4 879 km', mass:'3.30×10²³ kg', atmo:'Deyarli yo‘q',
    moons:'0', temp:'−173°C … +427°C',
    fact:'Bir kuni (quyoshli) ikki yiliga teng — sekin aylanadi, lekin Quyosh atrofida tez uchadi.' },

  { key:'venus', name:'Venera', type:'SAYYORA', color:0xd8a96b,
    radius:2.3, orbit:48, speed:0.035, spin:-0.002, tilt:3.1,
    desc:'Qalin CO₂ atmosferasi tufayli issiqxona effekti kuchli. Teskari aylanadi.',
    dist:'108.2 mln km', dia:'12 104 km', mass:'4.87×10²⁴ kg', atmo:'Zich CO₂',
    moons:'0', temp:'≈ +465°C',
    fact:'Quyosh tizimidagi eng issiq sayyora — Merkuriydan ham issiqroq.' },

  { key:'earth', name:'Yer', type:'SAYYORA', color:0x3b7fd6,
    radius:2.5, orbit:64, speed:0.029, spin:0.02, tilt:23.5, special:'earth',
    desc:'Hayot mavjud yagona sayyora. Suyuq suv, kislorodli atmosfera va Oy bilan.',
    dist:'149.6 mln km', dia:'12 742 km', mass:'5.97×10²⁴ kg', atmo:'N₂ + O₂',
    moons:'1 (Oy)', temp:'≈ +15°C (o‘rtacha)',
    fact:'Yuzasining 71% suv bilan qoplangan — kosmosdan «moviy marvarid» kabi ko‘rinadi.' },

  { key:'mars', name:'Mars', type:'SAYYORA', color:0xc1502e,
    radius:1.9, orbit:80, speed:0.024, spin:0.018, tilt:25.2,
    desc:'Temir oksidi tufayli qizg‘ish yuzaga ega «Qizil sayyora». Kraterlar ko‘p.',
    dist:'227.9 mln km', dia:'6 779 km', mass:'6.42×10²³ kg', atmo:'Yupqa CO₂',
    moons:'2 (Fobos, Deymos)', temp:'≈ −65°C',
    fact:'Tizimdagi eng baland tog‘ — Olimp tog‘i (22 km) shu yerda joylashgan.' },

  { key:'jupiter', name:'Yupiter', type:'GAZ GIGANTI', color:0xd8b48a,
    radius:7.0, orbit:120, speed:0.013, spin:0.04, tilt:3.1, special:'jupiter',
    desc:'Eng katta sayyora — gaz giganti. Mashhur Katta Qizil Dog‘ — ulkan bo‘ron.',
    dist:'778.5 mln km', dia:'139 820 km', mass:'1.90×10²⁷ kg', atmo:'H₂ + He',
    moons:'95+', temp:'≈ −110°C',
    fact:'Katta Qizil Dog‘ — 300+ yildan beri davom etayotgan, Yerdan kattaroq bo‘ron.' },

  { key:'saturn', name:'Saturn', type:'GAZ GIGANTI', color:0xe0c89a,
    radius:6.0, orbit:165, speed:0.0096, spin:0.038, tilt:26.7, special:'saturn',
    desc:'Ajoyib halqalari bilan mashhur. Muz va tosh bo‘laklaridan iborat halqalar.',
    dist:'1.43 mlrd km', dia:'116 460 km', mass:'5.68×10²⁶ kg', atmo:'H₂ + He',
    moons:'146+', temp:'≈ −140°C',
    fact:'Zichligi suvdan kam — agar ulkan okean bo‘lsa, Saturn unda suzib yurardi.' },

  { key:'uranus', name:'Uran', type:'MUZ GIGANTI', color:0x9fe0e6,
    radius:4.2, orbit:205, speed:0.0068, spin:0.03, tilt:97.8, special:'uranus',
    desc:'Yonboshi bilan aylanadigan muz giganti. Metan unga ko‘kish tus beradi.',
    dist:'2.87 mlrd km', dia:'50 724 km', mass:'8.68×10²⁵ kg', atmo:'H₂, He, CH₄',
    moons:'28', temp:'≈ −195°C',
    fact:'O‘qi 98° qiyshaygan — go‘yo «yotgan holda» Quyosh atrofida dumalab yuradi.' },

  { key:'neptune', name:'Neptun', type:'MUZ GIGANTI', color:0x3b5bdb,
    radius:4.0, orbit:240, speed:0.0054, spin:0.032, tilt:28.3,
    desc:'Eng uzoq sayyora. Quyosh tizimidagi eng kuchli shamollar shu yerda.',
    dist:'4.50 mlrd km', dia:'49 244 km', mass:'1.02×10²⁶ kg', atmo:'H₂, He, CH₄',
    moons:'16', temp:'≈ −200°C',
    fact:'Shamol tezligi 2 100 km/soatga yetadi — ovoz tezligidan ham tez.' },
];

function solarData(name){
  return { name, type:'YULDUZ', isSun:true,
    desc:'Quyosh tizimining markazidagi yulduz. Uning tortishish kuchi barcha sayyoralarni ushlab turadi.',
    dist:'0 km (markaz)', dia:'1 392 700 km', mass:'1.99×10³⁰ kg', atmo:'Plazma (H + He)',
    moons:'8 sayyora', temp:'Yuzasi ≈ 5 500°C',
    fact:'Massasi butun tizimning 99.8% ini tashkil etadi. Yorug‘lik undan Yergacha 8 daqiqada yetadi.' };
}

/* Kengaytirilgan ma'lumotlar — fizik ko‘rsatkichlar va tarkib (atmosfera/modda) */
const EXTRA = {
  sun:     { period:'—', day:'≈ 27 kun', gravity:'274 m/s² (28×)', escape:'617.5 km/s', velocity:'≈ 220 km/s (Galaktika)', discovered:'—',
             comp:[['Vodorod',73],['Geliy',25],['Kislorod',1],['Boshqa',1]] },
  mercury: { period:'88 kun', day:'1 408 soat', gravity:'3.7 m/s² (0.38×)', escape:'4.3 km/s', velocity:'47.4 km/s', discovered:'Qadimdan ma’lum',
             comp:[['Kislorod',42],['Natriy',29],['Vodorod',22],['Boshqa',7]] },
  venus:   { period:'225 kun', day:'5 832 soat (teskari)', gravity:'8.9 m/s² (0.90×)', escape:'10.4 km/s', velocity:'35.0 km/s', discovered:'Qadimdan ma’lum',
             comp:[['Karbonat angidrid',96.5],['Azot',3.5]] },
  earth:   { period:'365.25 kun', day:'24 soat', gravity:'9.8 m/s² (1.00×)', escape:'11.2 km/s', velocity:'29.8 km/s', discovered:'—',
             comp:[['Azot',78],['Kislorod',21],['Argon',1]] },
  mars:    { period:'687 kun', day:'24.6 soat', gravity:'3.7 m/s² (0.38×)', escape:'5.0 km/s', velocity:'24.1 km/s', discovered:'Qadimdan ma’lum',
             comp:[['Karbonat angidrid',95],['Azot',2.7],['Argon',1.6],['Boshqa',0.7]] },
  jupiter: { period:'11.9 yil', day:'9.9 soat', gravity:'24.8 m/s² (2.53×)', escape:'59.5 km/s', velocity:'13.1 km/s', discovered:'Qadimdan ma’lum',
             comp:[['Vodorod',90],['Geliy',10]] },
  saturn:  { period:'29.5 yil', day:'10.7 soat', gravity:'10.4 m/s² (1.07×)', escape:'35.5 km/s', velocity:'9.7 km/s', discovered:'Qadimdan ma’lum',
             comp:[['Vodorod',96],['Geliy',3],['Boshqa',1]] },
  uranus:  { period:'84 yil', day:'17.2 soat', gravity:'8.7 m/s² (0.89×)', escape:'21.3 km/s', velocity:'6.8 km/s', discovered:'1781 (V. Herschel)',
             comp:[['Vodorod',83],['Geliy',15],['Metan',2]] },
  neptune: { period:'165 yil', day:'16.1 soat', gravity:'11.2 m/s² (1.14×)', escape:'23.5 km/s', velocity:'5.4 km/s', discovered:'1846 (matematik bashorat)',
             comp:[['Vodorod',80],['Geliy',19],['Metan',1]] },
};

/* --------------------------------------------------------------------------
   5. SAYYORALARNI QURISH (orbita, aylanish, maxsus effektlar)
   -------------------------------------------------------------------------- */
const planetMeshes = [];   // raycasting uchun
const orbitObjects = [];   // animatsiya uchun

function makeOrbitRing(radius){
  const seg=180, pts=[];
  for(let i=0;i<=seg;i++){ const a=i/seg*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius)); }
  const g=new THREE.BufferGeometry().setFromPoints(pts);
  const m=new THREE.LineBasicMaterial({ color:0x4a5b8a, transparent:true, opacity:0.28 });
  return new THREE.LineLoop(g,m);
}

// Sayyora atrofidagi atmosfera/haze halqasi (fresnel, additiv)
function addHaze(mesh, radius, colorHex, power, scale){
  const haze = new THREE.Mesh(
    new THREE.SphereGeometry(radius*scale, 72, 48),
    new THREE.ShaderMaterial({
      transparent:true, side:THREE.BackSide, blending:THREE.AdditiveBlending, depthWrite:false,
      uniforms:{ uColor:{value:new THREE.Color(colorHex)}, uPow:{value:power} },
      vertexShader:`varying vec3 vN; varying vec3 vWP;
        void main(){ vN=normalize(mat3(modelMatrix)*normal);
          vWP=(modelMatrix*vec4(position,1.0)).xyz;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`uniform vec3 uColor; uniform float uPow;
        varying vec3 vN; varying vec3 vWP;
        void main(){ vec3 V=normalize(cameraPosition-vWP);
          float f=pow(1.0-max(dot(-vN,V),0.0), uPow+2.2);
          gl_FragColor=vec4(uColor,1.0)*clamp(f*0.7,0.0,1.0);}` }));
  mesh.add(haze);
}

// Sun'iy yo‘ldosh modeli (korpus + quyosh panellari + antenna)
function makeSatellite(scale){
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.18,0.18,0.3),
    new THREE.MeshStandardMaterial({ color:0xd9b96a, metalness:0.9, roughness:0.35 }));
  g.add(body);
  const panelMat = new THREE.MeshStandardMaterial({ color:0x1c2c66, metalness:0.6, roughness:0.4,
    emissive:0x0a1740, emissiveIntensity:0.5, side:THREE.DoubleSide });
  [-1,1].forEach(s=>{
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.22), panelMat);
    panel.position.x = s*0.42; g.add(panel);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.02,0.02),
      new THREE.MeshStandardMaterial({ color:0x888888, metalness:0.8, roughness:0.4 }));
    arm.position.x = s*0.22; g.add(arm);
  });
  const dish = new THREE.Mesh(new THREE.CircleGeometry(0.1,16),
    new THREE.MeshStandardMaterial({ color:0xeeeeee, metalness:0.3, roughness:0.6, side:THREE.DoubleSide }));
  dish.position.set(0,0.14,0); dish.rotation.x=-0.6; g.add(dish);
  g.scale.setScalar(scale);
  return g;
}

PLANETS.forEach(p=>{
  scene.add(makeOrbitRing(p.orbit));

  // Orbita markazi (Quyosh atrofida aylanadi)
  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random()*Math.PI*2;
  scene.add(pivot);

  // Sayyora teksturasi
  let material;
  if (p.special==='earth'){
    const sunU = {value:new THREE.Vector3(1,0,0)};
    material = new THREE.ShaderMaterial({
      uniforms:{
        // RT_ON: haqiqiy xaritalar keladi — vaqtinchalik bir rangli teksturalar (tekis normal, quruqlik "g'adir-budurligi")
        dayTex:{value:RT_ON?flatTexture('#24507a'):earthDayTexture()},
        nightTex:{value:RT_ON?flatTexture('#000000'):earthNightTexture()},
        normTex:{value:RT_ON?flatTexture('#8080ff'):earthDayTexture().userData.normalMap},
        roughTex:{value:RT_ON?flatTexture('#b3b3b3'):earthDayTexture().userData.roughnessMap},
        realMap:{value:0},
        sunDir:sunU
      },
      vertexShader:`
        varying vec2 vUv; varying vec3 vN; varying vec3 vWP;
        void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal);
          vWP=(modelMatrix*vec4(position,1.0)).xyz;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader:`
        uniform sampler2D dayTex; uniform sampler2D nightTex;
        uniform sampler2D normTex; uniform sampler2D roughTex;
        uniform vec3 sunDir; uniform float realMap;
        varying vec2 vUv; varying vec3 vN; varying vec3 vWP;
        void main(){
          vec3 N=normalize(vN), L=normalize(sunDir);
          // sfera uchun tangens bazis → normal xaritani qo'llash (relyef soyalari)
          vec3 T=normalize(cross(vec3(0.0,1.0,0.0), N));
          vec3 B=cross(N,T);
          vec3 nm=texture2D(normTex,vUv).rgb*2.0-1.0;
          vec3 Np=normalize(N + (T*nm.x + B*nm.y)*0.85*(1.0-realMap));
          float rough=texture2D(roughTex,vUv).r;
          float ocean=1.0-smoothstep(0.3,0.6,rough);
          // haqiqiy xaritada okean — ko'k ustun va qorong'i piksellar (muzliklar yaltiramaydi)
          vec3 dc=texture2D(dayTex,vUv).rgb;
          float oceanR=smoothstep(0.015,0.07,dc.b-max(dc.r,dc.g)*0.9)*(1.0-smoothstep(0.35,0.55,dot(dc,vec3(0.3,0.59,0.11))));
          ocean=mix(ocean, oceanR, realMap);
          float ndl=max(dot(Np,L),0.0);
          float term=smoothstep(-0.06,0.22,dot(N,L));   // yumshoq terminator
          vec3 day=texture2D(dayTex,vUv).rgb;
          // quyosh nuri + havo tarqalishidan ko'k to'ldiruvchi
          vec3 lit=day*(0.10 + 1.18*ndl*term) + vec3(0.035,0.055,0.09)*day*2.0;
          // okean yaltirashi (Blinn-Phong)
          vec3 V=normalize(cameraPosition-vWP);
          vec3 H=normalize(L+V);
          float spec=pow(max(dot(Np,H),0.0), 78.0)*ocean*term*0.9;
          // kunduz chetidagi issiq nur (forward scattering)
          float rim=pow(1.0-max(dot(N,V),0.0), 3.0)*term;
          vec3 night=texture2D(nightTex,vUv).rgb*1.55;
          vec3 col=mix(night, lit, term) + spec + vec3(0.32,0.52,0.85)*rim*0.35;
          gl_FragColor=vec4(col,1.0);
        }`
    });
  } else {
    let tex;
    if (RT_ON) tex=flatTexture('#'+p.color.toString(16).padStart(6,'0'));
    else if (p.key==='mercury') tex=rockyTexture('#8a7a68',['#6f6052','#a89683'],90);
    else if (p.key==='venus') tex=gasGiantTexture([
        {c1:'#e8c98a',c2:'#d8a96b'},{c1:'#d6b074',c2:'#c89a5c'},
        {c1:'#e3c184',c2:'#cfa566'},{c1:'#d2a45e',c2:'#e0bb7c'}]);
    else if (p.key==='mars') tex=rockyTexture('#b04a2a',['#8f3a22','#d06a44','#6f2e1c'],110);
    else if (p.key==='jupiter') tex=gasGiantTexture([
        {c1:'#d8c4a0',c2:'#c9a877'},{c1:'#b98c5a',c2:'#a67a48'},
        {c1:'#e0d2b4',c2:'#cdb389'},{c1:'#a87648',c2:'#946539'},
        {c1:'#ddc9a4',c2:'#c7a472'},{c1:'#b3895a',c2:'#9c7344'}],{redSpot:true});
    else if (p.key==='saturn') tex=gasGiantTexture([
        {c1:'#e8d6ac',c2:'#dcc796'},{c1:'#cfb47e',c2:'#c4a86f'},
        {c1:'#e3d3a3',c2:'#d6c187'},{c1:'#c9ad72',c2:'#dac38a'}]);
    else if (p.key==='uranus') tex=gasGiantTexture([
        {c1:'#bfeef0',c2:'#a6e2e8'},{c1:'#9fe0e6',c2:'#8fd6dd'},
        {c1:'#b4eaee',c2:'#a0e0e6'}]);
    else if (p.key==='neptune') tex=gasGiantTexture([
        {c1:'#4a6be0',c2:'#3b5bdb'},{c1:'#345bd0',c2:'#2e4fc4'},
        {c1:'#4f70e6',c2:'#3d5dd8'},{c1:'#2c4ec0',c2:'#3a5ad4'}]);
    const gassy = (p.key==='venus'||p.key==='jupiter'||p.key==='saturn'||p.key==='uranus'||p.key==='neptune');
    material = stdFromTex(tex, gassy ? { roughness:0.82, metalness:0.0 } : { roughness:0.94, metalness:0.04 });
  }

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.radius, 128, 96), material);
  mesh.position.x = p.orbit;
  mesh.rotation.z = THREE.MathUtils.degToRad(p.tilt);
  mesh.userData = p;
  pivot.add(mesh);
  planetMeshes.push(mesh);

  const rec = { ...p, mesh, pivot, extras:{} };

  // --- Tabiiy yo‘ldoshlar (har sayyoraning mashhurlari) ---
  const MOONS = {
    mars:    [ {n:'Fobos', r:0.16, d:1.7, s:2.2, c:'#8a7f72'}, {n:'Deymos', r:0.12, d:2.4, s:1.4, c:'#9a8f80'} ],
    jupiter: [ {n:'Io', r:0.5, d:1.6, s:1.6, c:'#d9c25a'}, {n:'Yevropa', r:0.44, d:2.0, s:1.2, c:'#cfc4ae'},
               {n:'Ganimed', r:0.7, d:2.5, s:0.9, c:'#9d9486'}, {n:'Kallisto', r:0.62, d:3.1, s:0.65, c:'#7d7468'} ],
    saturn:  [ {n:'Titan', r:0.62, d:2.9, s:0.8, c:'#d8a95e'}, {n:'Reya', r:0.3, d:2.3, s:1.1, c:'#b8b2a6'},
               {n:'Enselad', r:0.22, d:1.8, s:1.5, c:'#e8ecec'} ],
    uranus:  [ {n:'Titaniya', r:0.32, d:1.9, s:1.1, c:'#a8a29a'}, {n:'Oberon', r:0.3, d:2.4, s:0.85, c:'#948e86'},
               {n:'Miranda', r:0.18, d:1.5, s:1.5, c:'#c0bab2'} ],
    neptune: [ {n:'Triton', r:0.4, d:1.9, s:-1.0, c:'#c8d4dc'} ]   // Triton teskari aylanadi
  };
  if(MOONS[p.key]){
    rec.extras.moons = MOONS[p.key].map(m=>{
      const mp = new THREE.Object3D();
      mp.rotation.y = Math.random()*Math.PI*2;
      mp.rotation.x = (Math.random()-0.5)*0.25;
      mesh.add(mp);
      const mm = new THREE.Mesh(new THREE.SphereGeometry(m.r, 48, 32),
        stdFromTex(rockyTexture(m.c, [shadeColor(m.c,-28), shadeColor(m.c,22)], 26, 256), { roughness:0.98, metalness:0.0 }));
      mm.position.x = p.radius * m.d;
      mp.add(mm);
      return { pivot: mp, speed: m.s };
    });
  }

  // --- Maxsus effektlar ---
  if (p.special==='earth'){
    // Bulutlar
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(p.radius*1.02, 96, 64),
      new THREE.MeshStandardMaterial({ map:RT_ON?null:cloudTexture(), transparent:true, opacity:RT_ON?0:0.55, depthWrite:false }));
    mesh.add(clouds); rec.extras.clouds = clouds;
    // Atmosfera — haqiqiy ko'rish yo'nalishiga bog'langan fresnel, quyosh tomonida yorqinroq
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(p.radius*1.22, 96, 64),
      new THREE.ShaderMaterial({
        transparent:true, side:THREE.BackSide, blending:THREE.AdditiveBlending, depthWrite:false,
        uniforms:{ sunDir:material.uniforms.sunDir },
        vertexShader:`varying vec3 vN; varying vec3 vWP;
          void main(){ vN=normalize(mat3(modelMatrix)*normal);
            vWP=(modelMatrix*vec4(position,1.0)).xyz;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader:`varying vec3 vN; varying vec3 vWP; uniform vec3 sunDir;
          void main(){
            vec3 V=normalize(cameraPosition-vWP);
            float f=pow(1.0-max(dot(-vN,V),0.0),2.8);
            float s=max(dot(-vN,normalize(sunDir)),0.0);
            vec3 c=mix(vec3(0.18,0.36,0.85), vec3(0.55,0.72,1.0), s);
            float a=clamp(f*(0.12+1.15*s),0.0,1.0);
            gl_FragColor=vec4(c,1.0)*a;
          }` }));
    mesh.add(atmo);
    // Oy
    const moonPivot = new THREE.Object3D(); mesh.add(moonPivot);
    const moon = new THREE.Mesh(new THREE.SphereGeometry(p.radius*0.27,96,64),
      stdFromTex(RT_ON?flatTexture('#8a8a8a'):rockyTexture('#9a9a9a',['#6e6e6e','#b9b9b9','#8a8a8a'],130,768), { roughness:1.0, metalness:0.0 }));
    moon.position.x = p.radius*3.2; moonPivot.add(moon);
    rec.extras.moonPivot = moonPivot;
    rec.extras.moons = [{ pivot: moonPivot, speed: 0.7 }];   // toggle uchun umumiy ro‘yxat

    // Sun'iy yo‘ldoshlar — turli orbita va qiyalikda
    rec.extras.sats = [];
    const satCount = 7;
    for(let i=0;i<satCount;i++){
      const sp = new THREE.Object3D();
      sp.rotation.x = (Math.random()-0.5)*1.6;
      sp.rotation.z = (Math.random()-0.5)*1.6;
      mesh.add(sp);
      const sat = makeSatellite(0.5+Math.random()*0.5);
      sat.position.x = p.radius*(1.45+Math.random()*0.9);
      sat.rotation.y = Math.random()*Math.PI;
      sp.add(sat);
      // orbita izi (ingichka halqa)
      const trailR = sat.position.x;
      const tg=[]; for(let k=0;k<=64;k++){ const a=k/64*Math.PI*2; tg.push(new THREE.Vector3(Math.cos(a)*trailR,0,Math.sin(a)*trailR)); }
      const trail=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(tg),
        new THREE.LineBasicMaterial({ color:0x6fa8ff, transparent:true, opacity:0.16 }));
      sp.add(trail);
      rec.extras.sats.push({ pivot:sp, speed:0.4+Math.random()*0.9, satMesh:sat, spin:0.5+Math.random() });
    }
  }

  if (p.special==='saturn' || p.key==='uranus'){
    // Halqalar (Saturn to‘liq, Uran ingichka)
    const inner = p.radius*1.4, outer = p.radius*(p.key==='uranus'?1.9:2.4);
    const rg = new THREE.RingGeometry(inner, outer, 180);
    // UV ni radial qilib moslash
    const pos=rg.attributes.position; const uv=rg.attributes.uv; const v3=new THREE.Vector3();
    for(let i=0;i<pos.count;i++){ v3.fromBufferAttribute(pos,i);
      const t=(v3.length()-inner)/(outer-inner); uv.setXY(i, t, 0.5); }
    const ringMat = new THREE.MeshBasicMaterial({ map:ringTexture(), side:THREE.DoubleSide,
      transparent:true, opacity:p.key==='uranus'?0.5:0.95, depthWrite:false });
    const ring = new THREE.Mesh(rg, ringMat);
    ring.rotation.x = Math.PI/2;
    if(p.key==='uranus') ring.rotation.y = THREE.MathUtils.degToRad(0); // o‘q qiyaligini meshdan oladi
    mesh.add(ring);
    rec.extras.ring = ring;
  }

  // Atmosfera / haze halqasi (Yerda o‘ziniki bor)
  if(p.special!=='earth'){
    const gas = (p.key==='jupiter'||p.key==='saturn'||p.key==='uranus'||p.key==='neptune'||p.key==='venus');
    addHaze(mesh, p.radius, p.color, gas?3.0:4.5, gas?1.10:1.04);
  }

  orbitObjects.push(rec);
});
/* --------------------------------------------------------------------------
   6. ASTEROIDLAR KAMARI (Mars va Yupiter orasida)
   -------------------------------------------------------------------------- */
const beltCount = 1400;
const astGeo = displace(new THREE.IcosahedronGeometry(0.35, 3), v=>{
  // notekis tosh shakli: yo'nalishga bog'liq siqilish + mayda o'ydim-chuqur
  const n = 0.72 + fbm3(v.x*7.5+3.1, v.y*7.5-1.4, v.z*7.5+8.8, 3, 0.5, 2.1)*0.56;
  v.multiplyScalar(n);
  v.x*=1.15; v.y*=0.82;
});
const astMat = stdFromTex(rockyTexture('#7d7468',['#5f574d','#9a9287'],0,128),
  { roughness:1, metalness:0.08 });
const belt = new THREE.InstancedMesh(astGeo, astMat, beltCount);
const dummy = new THREE.Object3D();
for(let i=0;i<beltCount;i++){
  const a=Math.random()*Math.PI*2;
  const r=96 + Math.random()*16;
  dummy.position.set(Math.cos(a)*r, (Math.random()-0.5)*4, Math.sin(a)*r);
  const s=0.3+Math.random()*1.4; dummy.scale.set(s,s,s);
  dummy.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6);
  dummy.updateMatrix(); belt.setMatrixAt(i, dummy.matrix);
}
const beltGroup = new THREE.Group(); beltGroup.add(belt); scene.add(beltGroup);

// Yirik «qahramon» asteroidlar — notekis shaklda, o‘z o‘qida dumalab, orbitada harakatlanadi
const heroAsteroids = [];
for(let i=0;i<7;i++){
  const R = 1.0+Math.random()*1.3, seed = 1.3+i*2.71;
  const geo = displace(new THREE.IcosahedronGeometry(1, 4), v=>rockShape(v, R, seed, 1));
  const base = ['#8a8073','#6f665a','#9a8d7c'][i%3];
  const mesh = new THREE.Mesh(geo, stdFromTex(rockyTexture(base,[shadeColor(base,-25),shadeColor(base,18)],20,256), { roughness:1, metalness:0.05 }));
  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random()*Math.PI*2;
  pivot.rotation.x = (Math.random()-0.5)*0.08;   // engil qiyalik
  scene.add(pivot);
  mesh.position.x = 95 + Math.random()*18;
  mesh.position.y = (Math.random()-0.5)*3;
  pivot.add(mesh);
  heroAsteroids.push({ mesh, pivot,
    orbitSpeed: 0.14+Math.random()*0.1,
    spinX: (Math.random()-0.5)*1.6, spinY: (Math.random()-0.5)*1.6 });
}

// Meteorlar (uchar yulduzlar) — yorqin bosh + cho‘ziq iz bilan uchib o‘tadi
const meteors = [];
function spawnMeteor(){
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8),
    new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(),
    color:0xbfe0ff, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false }));
  glow.scale.set(9,9,1);
  // iz — tezlik yo‘nalishi bo‘ylab cho‘zilgan konus
  const trailLen = 28+Math.random()*22;
  const trail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.85, trailLen, 6, 1, true),
    new THREE.MeshBasicMaterial({ color:0x9fd0ff, transparent:true, opacity:0.55,
      blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide }));
  trail.position.y = trailLen/2;   // bosh oldinda, iz orqada
  g.add(head, glow, trail);
  // boshlang‘ich nuqta — tashqi sferada, yo‘nalish — sahna orqali
  const a=Math.random()*Math.PI*2, e=(Math.random()-0.3)*1.0;
  const start = new THREE.Vector3(Math.cos(a)*Math.cos(e), Math.sin(e), Math.sin(a)*Math.cos(e)).multiplyScalar(420+Math.random()*260);
  start.y += 60;
  const target = new THREE.Vector3((Math.random()-0.5)*260, (Math.random()-0.5)*80, (Math.random()-0.5)*260);
  const dir = new THREE.Vector3().subVectors(target, start).normalize();
  g.position.copy(start);
  // konusning Y o‘qini tezlikka teskari yo‘naltiramiz (iz orqada qolsin)
  g.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0), dir);
  scene.add(g);
  meteors.push({ g, head, glow, trail, dir, speed: 220+Math.random()*160,
    life: 0, maxLife: 2.4+Math.random()*1.4 });
}
let meteorTimer = 0.5;   // birinchi meteor tez orada

/* --------------------------------------------------------------------------
   6b. QO‘SHIMCHA ASTRONOMIK OBYEKTLAR — Serera, Pluton, Koyper kamari
   -------------------------------------------------------------------------- */
const EXTRA_BODIES = [];
[
  { key:'ceres', radius:0.9, orbit:104, speed:0.018, spin:0.012,
    tex:()=>RT_ON?flatTexture('#8f8578'):rockyTexture('#8f8578',['#7a7060','#a39885'],55) },
  { key:'pluto', radius:1.0, orbit:285, speed:0.0038, spin:0.008,
    tex:()=>rockyTexture('#c2b09a',['#8a7a68','#e0d2bd','#a08d76'],45) },
].forEach(d=>{
  scene.add(makeOrbitRing(d.orbit));
  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random()*Math.PI*2;
  scene.add(pivot);
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.radius, 96, 64),
    stdFromTex(d.tex(), { roughness:0.96, metalness:0.03 }));
  mesh.position.x = d.orbit;
  pivot.add(mesh);
  EXTRA_BODIES.push({ key:d.key, mesh, pivot, radius:d.radius, speed:d.speed, spin:d.spin });
});

// Koyper kamari — Neptundan naridagi muzli jismlar halqasi
const kuiperCount = 1600;
const kuiperGeo = displace(new THREE.IcosahedronGeometry(0.3, 1), v=>{ v.multiplyScalar(0.75+fbm3(v.x*9+2.2, v.y*9, v.z*9-5.1, 3, 0.5, 2.1)*0.5); v.y*=0.8; });
const kuiperMat = stdFromTex(rockyTexture('#a9b8c9',['#7f8ea3','#d3dde8'],0,128), { roughness:0.82, metalness:0.02 });
const kuiper = new THREE.InstancedMesh(kuiperGeo, kuiperMat, kuiperCount);
for(let i=0;i<kuiperCount;i++){
  const a=Math.random()*Math.PI*2;
  const r=268 + Math.random()*46;
  dummy.position.set(Math.cos(a)*r, (Math.random()-0.5)*10, Math.sin(a)*r);
  const s=0.25+Math.random()*1.1; dummy.scale.set(s,s,s);
  dummy.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6);
  dummy.updateMatrix(); kuiper.setMatrixAt(i, dummy.matrix);
}
const kuiperGroup = new THREE.Group(); kuiperGroup.add(kuiper); scene.add(kuiperGroup);

/* --------------------------------------------------------------------------
   6c. MASHHUR ASTEROIDLAR VA METEOR — haqiqiy shakllari bilan
   -------------------------------------------------------------------------- */
// Takrorlangan cho'qqilarni birlashtirib, indeksli geometriya yasaydi — shunda siljitilgan
// sirt uzilmaydi (yoriq/parchalar yo'q) va normallar silliq chiqadi
function weldGeometry(geo){
  const src = geo.index ? geo.toNonIndexed() : geo;
  const p = src.attributes.position, map = new Map(), verts = [], idx = [];
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), y=p.getY(i), z=p.getZ(i);
    const k=Math.round(x*1e4)+'_'+Math.round(y*1e4)+'_'+Math.round(z*1e4);
    let id=map.get(k); if(id===undefined){ id=verts.length/3; map.set(k,id); verts.push(x,y,z); }
    idx.push(id);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts,3));
  // sferik UV — tekstura uchun
  const uv=[]; for(let i=0;i<verts.length;i+=3){ const x=verts[i], y=verts[i+1], z=verts[i+2], r=Math.hypot(x,y,z)||1;
    uv.push(0.5+Math.atan2(z,x)/(2*Math.PI), 0.5+Math.asin(Math.max(-1,Math.min(1,y/r)))/Math.PI); }
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);
  return g;
}
function displace(geo, fn){
  const g = weldGeometry(geo);
  const pos = g.attributes.position; const v = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){ v.fromBufferAttribute(pos,i); fn(v); pos.setXYZ(i,v.x,v.y,v.z); }
  g.computeVertexNormals();                 // silliq normallar (indeksli holatda)
  // UV tikishini tuzatish: uchburchak 0↔1 chegarasini kesib o'tsa, kichik u larga +1 (RepeatWrapping)
  const out = g.toNonIndexed(), uv = out.attributes.uv;
  for(let t=0;t<uv.count;t+=3){
    const u0=uv.getX(t), u1=uv.getX(t+1), u2=uv.getX(t+2);
    if(Math.max(u0,u1,u2)-Math.min(u0,u1,u2)>0.5){ for(let q=0;q<3;q++){ if(uv.getX(t+q)<0.5) uv.setX(t+q, uv.getX(t+q)+1); } }
  }
  return out;
}
// Tabiiy tosh shakli: yirik notekislik + kraterlar + mayda o'ydim-chuqur (seed bo'yicha)
function rockShape(v, R, seed, amt){
  const n = v.clone().normalize();
  const big = fbm3(n.x*1.6+seed, n.y*1.6-seed*0.7, n.z*1.6+seed*1.3, 3, 0.5, 2.0);
  const fine = fbm3(n.x*6+seed*2.1, n.y*6, n.z*6-seed, 3, 0.5, 2.1);
  let crater = 0;
  for(let c=0;c<5;c++){
    const cx=Math.sin(seed*7.1+c*2.3), cy=Math.cos(seed*3.7+c*1.9), cz=Math.sin(seed*5.3+c*3.1);
    const cl=Math.hypot(cx,cy,cz)||1, d=Math.acos(Math.max(-1,Math.min(1,(n.x*cx+n.y*cy+n.z*cz)/cl)));
    const w=0.28+0.18*Math.abs(Math.sin(seed+c));
    if(d<w*1.3){ const t=d/w; crater += t<1 ? -(1-t*t)*0.12 : 0.05*Math.exp(-Math.pow((t-1.08)/0.12,2)); }
  }
  const k = 1 + (big-0.5)*0.55*(amt||1) + (fine-0.5)*0.12 + crater;
  v.copy(n).multiplyScalar(R*k);
  v.x *= 1 + 0.25*Math.sin(seed*1.7); v.z *= 1 - 0.18*Math.cos(seed*2.3);
}
const FAMOUS = {};
// VESTA — deyarli shar, janubiy qutbida ulkan Reyasilviya krateri
{
  const geo = displace(new THREE.IcosahedronGeometry(1.7, 3), v=>{
    const k = 0.97+Math.sin(v.x*7.3)*Math.cos(v.z*5.1)*0.035;   // mayda notekislik
    v.multiplyScalar(k);
    if(v.y < -1.0){ v.y = -1.0 - (v.y+1.0)*0.25; }              // janubiy krater (tekislangan chuqurlik)
  });
  const mesh = new THREE.Mesh(geo, stdFromTex(rockyTexture('#9a938a',['#7d766c','#b3aca1'],70,512),{ roughness:1 }));
  FAMOUS.vesta = { key:'vesta', mesh, radius:2.0, orbit:101, speed:0.016, spin:0.02 };
}
// EROS — cho‘zinchoq «yeryong‘oq» (34×11 km nisbatida)
{
  const geo = displace(new THREE.IcosahedronGeometry(1.0, 2), v=>{
    v.x *= 2.7;                                                  // cho‘zish
    const pinch = 1 - 0.28*Math.exp(-v.x*v.x*1.2);               // o‘rtasidan siqilgan — yeryong‘oq
    v.y *= pinch; v.z *= pinch;
    v.y += Math.sin(v.x*0.9)*0.12;                               // engil egilish
    const k = 1+Math.sin(v.x*5.7+v.y*8.2)*0.05;
    v.y*=k; v.z*=k;
  });
  const mesh = new THREE.Mesh(geo, stdFromTex(rockyTexture('#8f8a80',['#6f6a60','#a9a296'],50,512),{ roughness:1 }));
  FAMOUS.eros = { key:'eros', mesh, radius:2.2, orbit:84, speed:0.022, spin:0.03 };
}
// BENNU — olmos/pirildoq shakli, ekvatorida tosh belbog‘
{
  const geo = displace(new THREE.IcosahedronGeometry(1.25, 3), v=>{
    const ny = v.y/1.25;
    const rk = 1.12 - Math.abs(ny)*0.5;                          // olmos profili
    v.x *= rk; v.z *= rk;
    if(Math.abs(ny)<0.12){ v.x*=1.07; v.z*=1.07; }               // ekvator belbog‘i
    const k = 1+Math.sin(v.x*9.1)*Math.cos(v.z*7.7)*0.04;
    v.multiplyScalar(k);
  });
  const mesh = new THREE.Mesh(geo, stdFromTex(rockyTexture('#57534c',['#403d37','#6e6961'],40,512),{ roughness:1 }));
  FAMOUS.bennu = { key:'bennu', mesh, radius:1.6, orbit:74, speed:0.026, spin:0.05 };
}
// CHELYABINSK METEORI — alangali bolid: tosh + olov porlashi + qisqa iz
{
  const g = new THREE.Group();
  const rock = new THREE.Mesh(
    displace(new THREE.IcosahedronGeometry(1, 3), v=>rockShape(v, 0.9, 4.4, 0.8)),
    stdFromTex(rockyTexture('#5a4a3a',['#3f342a','#7a6650'],30,256),
      { roughness:1, emissive:0xff5a1e, emissiveIntensity:0.35 }));
  const fire = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(),
    color:0xff8a3a, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending, depthWrite:false }));
  fire.scale.set(7,7,1);
  const tailLen = 16;
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.7, tailLen, 6, 1, true),
    new THREE.MeshBasicMaterial({ color:0xffb060, transparent:true, opacity:0.5,
      blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide }));
  tail.rotation.z = Math.PI/2; tail.position.x = tailLen/2;      // iz orbitada orqada qoladi
  g.add(rock, fire, tail);
  FAMOUS.chelyabinsk = { key:'chelyabinsk', mesh:g, rock, radius:1.5, orbit:66, speed:0.034, spin:0.06 };
}
Object.values(FAMOUS).forEach(f=>{
  scene.add(makeOrbitRing(f.orbit));
  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random()*Math.PI*2;
  scene.add(pivot);
  f.mesh.position.x = f.orbit;
  pivot.add(f.mesh);
  f.pivot = pivot;
  EXTRA_BODIES.push(f);   // animatsiya sikli orbit + spin ni o‘zi yuritadi
});

/* --------------------------------------------------------------------------
   7. UCHIB O‘TUVCHI KOMETALAR
   -------------------------------------------------------------------------- */
const comets = [];
/* Kometa: notekis muzli yadro + yashil-havorang koma + IKKI dum:
   ion dumi — to'g'ri, havorang, Quyoshdan qat'iy teskari;
   chang dumi — sarg'ish, kometa harakatini meros oladi, shuning uchun egilib orqada qoladi.
   Faollik Quyoshga yaqinlashganda keskin oshadi. */
const COMET_N = 650;
function makeComet(){
  const g = new THREE.Group();
  const head = new THREE.Mesh(
    displace(new THREE.IcosahedronGeometry(0.75, 2), v=>{ v.multiplyScalar(0.72+fbm3(v.x*2.6+4.1, v.y*2.6, v.z*2.6-1.3, 3, 0.5, 2.1)*0.56); v.x*=1.4; }),
    stdFromTex(rockyTexture('#403a34',['#2b2622','#5b534a'],0,128), { roughness:1, metalness:0 }));
  const coma = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(), color:0x8fd8ff,
    transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false }));
  coma.scale.set(14,14,1);
  const headGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map:SPRITE, color:0xdff4ff,
    transparent:true, opacity:0.7, blending:THREE.AdditiveBlending, depthWrite:false }));
  headGlow.scale.set(5,5,1);
  const tail = new THREE.Sprite(new THREE.SpriteMaterial({ map:SPRITE, color:0x88c0ff, transparent:true, opacity:0 }));
  tail.visible=false;                                   // eski sprite-dum (moslik uchun saqlangan)
  g.add(head, coma, headGlow, tail);
  scene.add(g);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COMET_N*3),3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(COMET_N*3),3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(COMET_N),1));
  const pts=new THREE.Points(geo, softPointsMaterial({ maxPx:40 })); pts.frustumCulled=false; scene.add(pts);
  const P=[]; for(let i=0;i<COMET_N;i++) P.push({x:0,y:0,z:0,vx:0,vy:0,vz:0,age:1,life:0,ion:false});
  const rec = { g, tail, head, coma, headGlow, pts, P, next:0, acc:0, vel:new THREE.Vector3(),
    a: Math.random()*Math.PI*2,
    ra: 260+Math.random()*120, rb: 150+Math.random()*80,
    speed: 0.12+Math.random()*0.1,
    inc: (Math.random()-0.5)*0.6, t: Math.random()*Math.PI*2 };
  comets.push(rec);
}
makeComet(); makeComet(); makeComet();
// Birinchi kometa — «Galley kometasi» (sayohatda ziyorat qilinadi)
const halleyRec = { key:'halley', mesh:comets[0].g, radius:2.2 };
comets[0].tail.material.color.setHex(0xaad4ff);

/* --------------------------------------------------------------------------
   7b. YULDUZ TURKUMLARI — uzoq osmon sferasida yulduzlar va chiziqlar
   -------------------------------------------------------------------------- */
/* HAQIQIY OSMON KOORDINATALARI:
   RA/Dec (J2000) → 3D. Ekvatorial vektor: x=cosδ·cosα, y=sinδ, z=−cosδ·sinα
   (belgi ichkaridan qaraganda turkumlar TANISH shaklda chiqishi uchun kalibrlangan
   — noto'g'ri belgi butun osmonni ko'zgudagidek teskari qilib qo'yardi).
   So'ng butun osmon X o'qi atrofida −ε ga buriladi (ε=23.4366°, ekvatorial→ekliptik):
   natijada ekliptika sahnaning XZ (sayyoralar) tekisligiga yotadi, osmon qutbi
   esa Y dan 23.44° og'adi — haqiqatdagidek. Zodiak (Chayon) sayyoralar tekisligi
   yaqinida chiqishi — to'g'rilik belgisi.
   Kelajak: shu modul "Bugungi osmon" (gorizontal koordinatalar, kuzatuvchi
   kengligi) rejimiga asos bo'ladi — toza va mustaqil saqlansin. */
const CONST_R = 1500;
const EPS_OBL = 23.4366*Math.PI/180;
function radecToVector(raH, decDeg, R){
  const a=raH*15*Math.PI/180, d=decDeg*Math.PI/180;
  const x=Math.cos(d)*Math.cos(a), y=Math.sin(d), z=-Math.cos(d)*Math.sin(a);
  const ce=Math.cos(EPS_OBL), se=Math.sin(EPS_OBL);
  // X atrofida −ε: y'=y·cosε+z·sinε, z'=−y·sinε+z·cosε
  return new THREE.Vector3(x, y*ce+z*se, -y*se+z*ce).multiplyScalar(R||1);
}
const SKY_STARS = window.STAR_CATALOG.map(s=>Object.assign({}, s, {pos: radecToVector(s.ra,s.dec,CONST_R)}));
const skyStarById = {}; SKY_STARS.forEach(s=>{ skyStarById[s.id]=s; });
// --- Majburiy self-test: konversiya to'g'riligi ---
(function(){
  const pol=radecToVector(2.5303,89.2641,1), np=radecToVector(0,90,1);
  console.assert(pol.angleTo(np)*180/Math.PI<0.8, 'osmon: Polaris qutbdan <0.8°');
  const dub=radecToVector(11.0621,61.751,1), mer=radecToVector(11.0307,56.3824,1);
  const n=new THREE.Vector3().crossVectors(mer,dub).normalize();
  console.assert(Math.asin(Math.abs(n.dot(pol)))*180/Math.PI<5, 'osmon: Dubhe-Merak ko\'rsatkichlari Polarisga ~5° ichida');
  const belt=radecToVector(5.6793,-1.9426,1).angleTo(radecToVector(5.5334,-0.2991,1))*180/Math.PI;
  console.assert(belt>2.2&&belt<3.2, 'osmon: Orion kamari ~2.7°', belt);
  const ant=radecToVector(16.4901,-26.432,1);
  console.assert(Math.asin(Math.abs(ant.y))*180/Math.PI<6, 'osmon: Antares ekliptikadan <6°');
})();
// B−V rang indeksi → RGB (manfiy=havorang-oq, +1.5=qizg'ish)
function bvColor(bv){
  const t=Math.max(-0.3,Math.min(1.8,bv));
  const st=[[-0.3,0.62,0.72,1],[0,0.82,0.88,1],[0.3,1,1,1],[0.6,1,0.95,0.83],[1.0,1,0.86,0.68],[1.8,1,0.74,0.54]];
  for(let i=0;i<st.length-1;i++){ if(t<=st[i+1][0]){ const k=(t-st[i][0])/(st[i+1][0]-st[i][0]);
    return [st[i][1]+(st[i+1][1]-st[i][1])*k, st[i][2]+(st[i+1][2]-st[i][2])*k, st[i][3]+(st[i+1][3]-st[i][3])*k]; } }
  return [1,0.74,0.54];
}
// Katalog qatlami — magnituda guruhlari (size ≈ 34−7·mag chegaralangan), rang — atributda
[[-2,-0.5,42,1],[-0.5,0.5,32,0.98],[0.5,1.5,26,0.93],[1.5,2.2,20,0.88],[2.2,2.7,15,0.8],[2.7,9,12,0.7]].forEach(b=>{
  const set=SKY_STARS.filter(s=>s.mag>=b[0]&&s.mag<b[1]); if(!set.length) return;
  const pos=new Float32Array(set.length*3), col=new Float32Array(set.length*3);
  set.forEach((s,i)=>{ pos[i*3]=s.pos.x; pos[i*3+1]=s.pos.y; pos[i*3+2]=s.pos.z;
    const c=bvColor(s.bv); col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2]; });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const _cp=new THREE.Points(g,new THREE.PointsMaterial({size:b[2],map:SPRITE,vertexColors:true,
    transparent:true,opacity:b[3],depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true}));
  _cp.userData.skyLayer=true; scene.add(_cp);
});
starsFar.material.opacity=Math.min(starsFar.material.opacity,0.5);   // dekorativ fon xiraroq
// Turkumlar — endi katalogdagi haqiqiy yulduz idlari bilan (kalitlar O'ZGARMAGAN)
const CONST_DEFS = [
  { key:'ursaMajor', ids:['dubhe','merak','phecda','megrez','alioth','mizar','alkaid'], links:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]] },
  { key:'ursaMinor', ids:['polaris','yildun','epsUmi','zetaUmi','kochab','pherkad','etaUmi'], links:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] },
  { key:'orion', ids:['betelgeuse','bellatrix','alnitak','alnilam','mintaka','saiph','rigel'], links:[[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[6,5]] },
  { key:'cassiopeia', ids:['caph','schedar','gammaCas','ruchbah','segin'], links:[[0,1],[1,2],[2,3],[3,4]] },
  { key:'cygnus', ids:['deneb','sadr','albireo','deltaCyg','gienahCyg'], links:[[0,1],[1,2],[3,1],[1,4]] },
  { key:'scorpius', ids:['acrab','dschubba','piSco','antares','tauSco','epsSco','sargas','kappaSco','shaula'], links:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8]] },
];
window.SKY_CONST_DEFS = CONST_DEFS;   // turkum chiziqlari — AR rejimi (labs/ar.js) ham ishlatadi
const CONSTELLATIONS = [];
CONST_DEFS.forEach(def=>{
  const world = def.ids.map(id=>skyStarById[id].pos.clone());
  // dir — turkum yulduzlari o'rtacha yo'nalishi (turlar kamerasi shundan foydalanadi)
  const dir = world.reduce((a,p)=>a.add(p.clone().normalize()), new THREE.Vector3()).normalize();
  // Turkum yulduzlari doim boshqalardan YORQINROQ porlaydi
  const pts = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(world),
    new THREE.PointsMaterial({ size:38, map:SPRITE, color:0xffffff, transparent:true, opacity:1,
      depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true }));
  pts.userData.skyLayer=true; scene.add(pts);
  const lpts=[]; def.links.forEach(l=>{ lpts.push(world[l[0]], world[l[1]]); });
  // Bog'lovchi chiziqlar FAQAT sayohat vaqtida ko'rinadi (opacity 0 dan fade bilan)
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(lpts),
    new THREE.LineBasicMaterial({ color:0x7fa8ff, transparent:true, opacity:0,
      blending:THREE.AdditiveBlending, depthWrite:false }));
  lines.userData.skyLayer=true; scene.add(lines);
  CONSTELLATIONS.push({ key:def.key, dir, points:pts, lines });
});
// --- Koordinata to'ri: ekvator, ekliptika+zodiak, RA/Dec, qutblar ---
const skyGrid = new THREE.Group(); skyGrid.visible=false; scene.add(skyGrid);
const skyGridMats = [];
function skyLine(pts, color, op){
  const m=new THREE.LineBasicMaterial({color:color, transparent:true, opacity:0}); m.userData.base=op;
  skyGridMats.push(m);
  skyGrid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m));
}
{ const p=[]; for(let i=0;i<=128;i++) p.push(radecToVector(i/128*24,0,CONST_R)); skyLine(p,0xffe8c0,0.55); }   // osmon ekvatori
[-60,-30,30,60].forEach(dc=>{ const p=[]; for(let i=0;i<=96;i++) p.push(radecToVector(i/96*24,dc,CONST_R)); skyLine(p,0x8fb0ff,0.13); });
for(let h=0;h<24;h+=2){ const p=[]; for(let i=0;i<=48;i++) p.push(radecToVector(h,-90+i/48*180,CONST_R)); skyLine(p,0x8fb0ff,0.11); }
{ const p=[]; for(let i=0;i<=128;i++){ const l=i/128*2*Math.PI; p.push(new THREE.Vector3(Math.cos(l)*CONST_R,0,-Math.sin(l)*CONST_R)); } skyLine(p,0xffd54f,0.6); }   // ekliptika (XZ)
function skyTextSprite(txt, color, w, h, font){
  const c=makeCanvas(256,128), x=c.getContext('2d');
  x.fillStyle=color; x.font=font||'96px sans-serif'; x.textAlign='center'; x.textBaseline='middle';
  x.fillText(txt,128,64);
  const m=new THREE.SpriteMaterial({map:asTexture(c,false), transparent:true, opacity:0, depthWrite:false});
  m.userData.base=0.9; skyGridMats.push(m);
  const sp=new THREE.Sprite(m); sp.scale.set(w,h,1); return sp;
}
['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].forEach((g2,k)=>{
  const l=(k*30+15)*Math.PI/180;   // har burjning o'rtasi (λ=k·30°+15°)
  const sp=skyTextSprite(g2,'#ffd54f',56,28);
  sp.position.set(Math.cos(l)*CONST_R*0.97, 22, -Math.sin(l)*CONST_R*0.97);
  skyGrid.add(sp);
});
/* --- Osmon qutblari: aylanuvchi kompas-halqa, nishon, yorqin yadro, ko'rsatkich chiziqlar,
       presessiya aylanalari va ikki qatorli yorliqlar --- */
const skyNP=radecToVector(0,90,CONST_R), skySP=radecToVector(0,-90,CONST_R);
const POLE_TXT={
  uz:{n:'Osmon shimoliy qutbi', ns:"Qutb yulduzi — atigi 0,7° narida", s:'Osmon janubiy qutbi', ss:"Janubiy Xoch unga yo'l ko'rsatadi", p:"Presessiya aylanasi · 26 000 yil"},
  ru:{n:'Северный полюс мира', ns:'Полярная звезда — всего в 0,7°', s:'Южный полюс мира', ss:'Южный Крест указывает на него', p:'Круг прецессии · 26 000 лет'},
  en:{n:'North celestial pole', ns:'Polaris lies just 0.7° away', s:'South celestial pole', ss:'The Southern Cross points the way', p:'Precession circle · 26,000 years'}
};
function poleMat(tex, base, color){
  const m=new THREE.SpriteMaterial({map:tex, color:color||0xffffff, transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending});
  m.userData.base=base; skyGridMats.push(m); return m;
}
function poleRingTex(col){
  const S=512, c=makeCanvas(S,S), x=c.getContext('2d'), m=S/2, R=212;
  x.strokeStyle=col; x.fillStyle=col; x.lineCap='round';
  x.globalAlpha=0.9; x.lineWidth=2.2; x.beginPath(); x.arc(m,m,R,0,TAU); x.stroke();
  for(let i=0;i<72;i++){                                   // har 5° — mayda, har 15° (1 soat) — uzun
    const a=i/72*TAU, big=i%3===0, L=big?20:9;
    x.lineWidth=big?2.4:1.2; x.globalAlpha=big?0.95:0.5;
    x.beginPath(); x.moveTo(m+Math.cos(a)*(R-L), m+Math.sin(a)*(R-L)); x.lineTo(m+Math.cos(a)*R, m+Math.sin(a)*R); x.stroke();
  }
  for(let k=0;k<4;k++){                                     // 4 ta olmos belgi
    const a=k*TAU/4; x.save(); x.translate(m+Math.cos(a)*(R+18), m+Math.sin(a)*(R+18)); x.rotate(a);
    x.globalAlpha=0.95; x.beginPath(); x.moveTo(9,0); x.lineTo(0,5); x.lineTo(-9,0); x.lineTo(0,-5); x.closePath(); x.fill(); x.restore();
  }
  x.globalAlpha=0.45; x.lineWidth=1.3; x.setLineDash([5,9]); x.beginPath(); x.arc(m,m,R*0.72,0,TAU); x.stroke(); x.setLineDash([]);
  return asTexture(c,false);
}
function poleCrossTex(col){
  const S=256, c=makeCanvas(S,S), x=c.getContext('2d'), m=S/2;
  x.strokeStyle=col; x.lineCap='round';
  x.globalAlpha=0.85; x.lineWidth=2;
  for(let k=0;k<4;k++){ const a=k*TAU/4+TAU/8; x.beginPath(); x.moveTo(m+Math.cos(a)*26, m+Math.sin(a)*26); x.lineTo(m+Math.cos(a)*70, m+Math.sin(a)*70); x.stroke(); }
  x.globalAlpha=0.6; x.lineWidth=1.4; x.beginPath(); x.arc(m,m,92,-0.5,0.5); x.stroke(); x.beginPath(); x.arc(m,m,92,Math.PI-0.5,Math.PI+0.5); x.stroke();
  return asTexture(c,false);
}
function poleLabelTex(title, sub, col){
  const c=makeCanvas(1024,200), x=c.getContext('2d');
  x.textAlign='center'; x.textBaseline='middle';
  x.shadowColor='rgba(0,0,0,0.85)'; x.shadowBlur=6; x.fillStyle=col;   // nursiz — faqat o'qilishi uchun qorong'i soya
  x.font='600 52px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='6px';
  x.fillText(title.toUpperCase(),512,66);
  x.shadowBlur=0; x.globalAlpha=0.55;
  const gr=x.createLinearGradient(392,0,632,0); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(0.5,col); gr.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=gr; x.fillRect(392,110,240,2);
  x.globalAlpha=0.9; x.fillStyle='#e4ecff'; x.font='400 34px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='2px';
  x.fillText(sub,512,150);
  return asTexture(c,false);
}
const POLE_FX=[];
[[skyNP,'#ffdca0',0xffd9a0],[skySP,'#a8dcff',0x9fd4ff]].forEach(([p,col,hex])=>{
  const halo=new THREE.Sprite(poleMat(glowTexture(),0.45,hex)); halo.scale.set(300,300,1); halo.position.copy(p);
  const ring=new THREE.Sprite(poleMat(poleRingTex(col),0.8)); ring.scale.set(440,440,1); ring.position.copy(p);
  const cross=new THREE.Sprite(poleMat(poleCrossTex(col),0.75)); cross.scale.set(220,220,1); cross.position.copy(p);
  const core=new THREE.Sprite(poleMat(SPRITE,1,0xffffff)); core.scale.set(30,30,1); core.position.copy(p);
  skyGrid.add(halo, ring, cross, core);
  POLE_FX.push({ring, cross, core});
});
function skyDashed(pts, color, op){
  const m=new THREE.LineDashedMaterial({color, transparent:true, opacity:0, dashSize:16, gapSize:12, depthWrite:false});
  m.userData.base=op; skyGridMats.push(m);
  const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m); l.computeLineDistances(); skyGrid.add(l);
}
function skyArc(a, b, n){ const out=[], A=a.clone().normalize(), B=b.clone().normalize();
  for(let i=0;i<=n;i++){ const t=i/n; out.push(A.clone().lerp(B,t).normalize().multiplyScalar(CONST_R*0.995)); } return out; }
// Ko'rsatkichlar: Merak→Dubhe chizig'i Qutb yulduziga, Janubiy Xoch (Gacrux→Acrux) janubiy qutbga
if(skyStarById.merak && skyStarById.polaris) skyDashed(skyArc(skyStarById.merak.pos, skyStarById.polaris.pos, 48), 0xffe2b0, 0.42);
if(skyStarById.gacrux) skyDashed(skyArc(skyStarById.gacrux.pos, skySP, 48), 0xa8dcff, 0.42);
// Presessiya: qutb 26 000 yilda ekliptika qutbi atrofida 23,4° radiusli aylana chizadi
[1,-1].forEach(sg=>{ const pts=[];
  for(let i=0;i<=160;i++){ const t=i/160*TAU; pts.push(new THREE.Vector3(Math.sin(EPS_OBL)*Math.cos(t), sg*Math.cos(EPS_OBL), Math.sin(EPS_OBL)*Math.sin(t)).multiplyScalar(CONST_R*0.99)); }
  skyDashed(pts, sg>0?0xffd9a0:0x9fd4ff, 0.22); });
function skyPoleStep(dt){
  if(!skyGrid.visible) return;
  const t=clock.elapsedTime;
  POLE_FX.forEach((p,i)=>{ const s=i?-1:1;
    p.ring.material.rotation += dt*0.035*s; p.cross.material.rotation -= dt*0.09*s;
    const k=0.85+0.18*Math.sin(t*2.1+i*1.7); p.core.scale.set(30*k,30*k,1); });
  // Yorliqlar sfera bilan birga kichrayadi, lekin o'qib bo'lmas darajada emas; sfera juda kichik bo'lganda
  // avval mayda belgilar (soat/gradus), keyin nomlar ham sekin yashiriladi — bir joyga to'planib qolmasin
  const cp=camera.position, PX=PX_SCALE.value, Rpx=CONST_R*PX/Math.max(1,cp.length());
  const fTag=sstep(90,170,Rpx), fTick=sstep(240,400,Rpx);
  // Shar tashqarisidan qaralganda orqa yarim shardagi yorliqlar yashiriladi (oldingilari bilan ustma-ust tushmasin)
  const cl=Math.max(1,cp.length()), out=sstep(CONST_R*0.95,CONST_R*1.35,cl);
  skyPoleLbl.forEach(sp=>{ const L=sp.userData.lbl; if(!L) return;
    const side=sp.position.dot(cp)/cl, back=1-out*(1-sstep(-0.4*CONST_R,-0.12*CONST_R,side));
    const f=(L.kind==='tick'?fTick:fTag)*back; sp.visible=f>0.01; if(!sp.visible) return;
    const d=Math.max(1,sp.position.distanceTo(cp)), px=L.w*PX/d, sc=px<L.min?L.min/px:1;
    sp.scale.set(L.w*sc,L.h*sc,1); sp.material.opacity=sp.material.userData.base*Math.max(0,skyGridK)*f; });
}
let skyPoleLbl=[];
function skyBuildPoleLabel(){   // i18n — til almashganda qayta chiziladi
  skyPoleLbl.forEach(l=>{ skyGrid.remove(l); if(l.material.map!==SPRITE) l.material.map.dispose();
    const ix=skyGridMats.indexOf(l.material); if(ix>-1) skyGridMats.splice(ix,1); l.material.dispose(); });
  skyPoleLbl=[];
  const t=POLE_TXT[LANG]||POLE_TXT.uz, op=skyGrid.visible?0.95:0;
  const mk=(title,sub,col,pos,w,h)=>{ const m=new THREE.SpriteMaterial({map:poleLabelTex(title,sub,col), transparent:true, opacity:op, depthWrite:false});
    m.userData.base=0.95; skyGridMats.push(m); const sp=new THREE.Sprite(m); sp.scale.set(w,h,1); sp.position.copy(pos); sp.userData.lbl={ w, h, min:170, kind:'tag' }; skyGrid.add(sp); skyPoleLbl.push(sp); };
  mk(t.n, t.ns, '#ffdca0', skyNP.clone().multiplyScalar(0.94).add(new THREE.Vector3(0,320,0)), 600, 118);
  mk(t.s, t.ss, '#a8dcff', skySP.clone().multiplyScalar(0.94).add(new THREE.Vector3(0,-320,0)), 600, 118);
  const pp=new THREE.Vector3(Math.sin(EPS_OBL), Math.cos(EPS_OBL), 0).multiplyScalar(CONST_R*0.95).add(new THREE.Vector3(0,40,0));
  const m=new THREE.SpriteMaterial({map:poleLabelTex(t.p,'',"#ffdca0"), transparent:true, opacity:op*0.6, depthWrite:false});
  m.userData.base=0.55; skyGridMats.push(m); const sp=new THREE.Sprite(m); sp.scale.set(380,74,1); sp.position.copy(pp); skyGrid.add(sp); skyPoleLbl.push(sp);
  skyGridLabels(op);
}
/* --- To'r qismlarining nomlari: ekvator, ekliptika, tengkunlik/quyosh turishi nuqtalari, soat va gradus belgilari --- */
const GRID_TXT={
  uz:{eq:'Osmon ekvatori', eqs:'Yer ekvatorining osmondagi davomi', ecl:'Ekliptika', ecls:'Quyoshning yillik yo‘li',
      ve:'Bahorgi tengkunlik', ves:'≈ 20-mart · kun = tun', ae:'Kuzgi tengkunlik', aes:'≈ 22-sentabr · kun = tun',
      ss:'Yozgi quyosh turishi', sss:'≈ 21-iyun · eng uzun kun', ws:'Qishki quyosh turishi', wss:'≈ 21-dekabr · eng qisqa kun',
      ra:'To‘g‘ri chiqish', dec:'Og‘ish', h:'s'},
  ru:{eq:'Небесный экватор', eqs:'Продолжение земного экватора на небе', ecl:'Эклиптика', ecls:'Годовой путь Солнца',
      ve:'Весеннее равноденствие', ves:'≈ 20 марта · день = ночь', ae:'Осеннее равноденствие', aes:'≈ 22 сентября · день = ночь',
      ss:'Летнее солнцестояние', sss:'≈ 21 июня · самый длинный день', ws:'Зимнее солнцестояние', wss:'≈ 21 декабря · самый короткий день',
      ra:'Прямое восхождение', dec:'Склонение', h:'ч'},
  en:{eq:'Celestial equator', eqs:'Earth’s equator projected onto the sky', ecl:'Ecliptic', ecls:'The Sun’s yearly path',
      ve:'March equinox', ves:'≈ Mar 20 · day = night', ae:'September equinox', aes:'≈ Sep 22 · day = night',
      ss:'June solstice', sss:'≈ Jun 21 · longest day', ws:'December solstice', wss:'≈ Dec 21 · shortest day',
      ra:'Right ascension', dec:'Declination', h:'h'}
};
// Shisha "yorliq": qorong'i fon, rangli chegara va nuqta, sarlavha + izoh
function gridTagTex(title, sub, col){
  const W=640, H=sub?168:104, c=makeCanvas(W,H), x=c.getContext('2d'), r=H/2-6;
  x.font='600 40px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='3px';
  const tw=x.measureText(title.toUpperCase()).width;
  x.font='400 28px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='1px';
  const sw=sub?x.measureText(sub).width:0, bw=Math.min(W-12, Math.max(tw, sw)+110), bx=(W-bw)/2;
  x.beginPath(); x.moveTo(bx+r,6); x.arcTo(bx+bw,6,bx+bw,H-6,r); x.arcTo(bx+bw,H-6,bx,H-6,r); x.arcTo(bx,H-6,bx,6,r); x.arcTo(bx,6,bx+bw,6,r); x.closePath();
  x.fillStyle='rgba(6,12,28,0.72)'; x.fill(); x.globalAlpha=0.7; x.strokeStyle=col; x.lineWidth=2.5; x.stroke(); x.globalAlpha=1;
  x.fillStyle=col; x.shadowBlur=0; x.beginPath(); x.arc(bx+36, sub?58:H/2, 9, 0, TAU); x.fill();
  x.textAlign='center'; x.textBaseline='middle'; x.fillStyle=col;
  x.font='600 40px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='3px';
  x.fillText(title.toUpperCase(), W/2+18, sub?60:H/2);
  if(sub){ x.shadowBlur=0; x.fillStyle='#dfe8ff'; x.globalAlpha=0.85; x.font='400 28px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='1px'; x.fillText(sub, W/2+18, 116); }
  return { tex:asTexture(c,false), aspect:H/W };
}
function gridTickTex(txt, col){
  const c=makeCanvas(128,64), x=c.getContext('2d');
  x.font='600 34px "Segoe UI", system-ui, sans-serif'; x.textAlign='center'; x.textBaseline='middle';
  x.shadowColor='rgba(0,0,0,0.9)'; x.shadowBlur=6; x.fillStyle=col; x.fillText(txt,64,33);
  return asTexture(c,false);
}
function skyGridLabels(op){
  const g=GRID_TXT[LANG]||GRID_TXT.uz, R=CONST_R;
  const add=(map, base, pos, w, h, min, kind)=>{ const m=new THREE.SpriteMaterial({map, transparent:true, opacity:op*base, depthWrite:false});
    m.userData.base=base; skyGridMats.push(m); const sp=new THREE.Sprite(m); sp.scale.set(w,h,1); sp.position.copy(pos);
    if(min) sp.userData.lbl={ w, h, min, kind };   // ekranda o'qiladigan eng kichik kenglik (px)
    skyGrid.add(sp); skyPoleLbl.push(sp); return sp; };
  const tag=(title, sub, col, pos, w)=>{ const t=gridTagTex(title, sub, col); add(t.tex, 0.95, pos, w, w*t.aspect, sub?150:110, 'tag'); };
  const up=(v,dy)=>v.add(new THREE.Vector3(0,dy,0));
  // Asosiy aylanalar — har biri ikki qarama-qarshi tomonda (qayerdan qaramang, bittasi ko'rinadi)
  [4.5,16.5].forEach(h=>tag(g.eq, g.eqs, '#ffe8c0', up(radecToVector(h,0,R*0.97),70), 330));
  [130,310].forEach(d=>{ const l=d*Math.PI/180; tag(g.ecl, g.ecls, '#ffd54f', new THREE.Vector3(Math.cos(l)*R*0.97,-72,-Math.sin(l)*R*0.97), 300); });
  // Tengkunlik va quyosh turishi nuqtalari: ekliptikadagi yorqin nishon + yorliq
  [[0,g.ve,g.ves,'#9dffb0'],[180,g.ae,g.aes,'#ffb37a'],[90,g.ss,g.sss,'#ffe066'],[270,g.ws,g.wss,'#8fd0ff']].forEach(([d,t,s,col])=>{
    const l=d*Math.PI/180, p=new THREE.Vector3(Math.cos(l)*R,0,-Math.sin(l)*R);
    add(glowTexture(), 0.75, p, 120, 120).material.color.set(col);
    add(SPRITE, 1, p, 26, 26);
    tag(t, s, col, up(p.clone().multiplyScalar(0.97), d===90||d===270?150:-130), 340);
  });
  // To'g'ri chiqish (soat) — ekvator bo'ylab, og'ish (gradus) — 9ʰ meridiani bo'ylab
  for(let h=0;h<24;h+=2) add(gridTickTex(h+g.h,'#b9cdff'), 0.8, up(radecToVector(h,0,R*0.985),-34), 64, 32, 30, 'tick');
  [-60,-30,30,60].forEach(d=>add(gridTickTex((d>0?'+':'−')+Math.abs(d)+'°','#b9cdff'), 0.75, radecToVector(9,d,R*0.985), 70, 35, 32, 'tick'));
  tag(g.ra, '', '#b9cdff', up(radecToVector(1,0,R*0.97),-90), 230);
  tag(g.dec, '', '#b9cdff', radecToVector(9,45,R*0.97), 170);
}
skyBuildPoleLabel();
// To'r fade — faqat opacity animatsiyasi, geometriya qayta hisoblanmaydi
// To'r Quyosh tizimiga biriktirilgan model (osmon guruhida emas): kichraytirganda tizim bilan birga kichrayadi, so'nmaydi
let skyFade=0, skyFadeT=0, skyGridK=-1;
function skyGridStep(dt2){
  if(skyFade!==skyFadeT){
    skyFade += Math.sign(skyFadeT-skyFade)*dt2*1.6;
    skyFade = Math.max(0, Math.min(1, skyFade));
  }
  if(skyFade===0){ skyGrid.visible=false; skyGridK=0; return; }
  const k=easeInOut(skyFade);
  if(Math.abs(k-skyGridK)<0.002) return;
  skyGridK=k; skyGrid.visible=k>0.003;
  skyGridMats.forEach(m=>{ m.opacity=m.userData.base*k; });
}
document.getElementById('gridBtn').addEventListener('click', ()=>{
  skyFadeT = skyFadeT===1?0:1;
  if(skyFadeT===1) skyGrid.visible=true;
  document.getElementById('gridBtn').classList.toggle('active', skyFadeT===1);
  playClick(skyFadeT===1?760:440);
});
// Yulduz kartasi — nomli yulduzni bosganda yengil tooltip (sayyora paneli EMAS)
const SKY_CON_LATIN = {canisMajor:'Canis Major',carina:'Carina',centaurus:'Centaurus',bootes:'Boötes',lyra:'Lyra',auriga:'Auriga',canisMinor:'Canis Minor',eridanus:'Eridanus',crux:'Crux',aquila:'Aquila',taurus:'Taurus',virgo:'Virgo',gemini:'Gemini',piscisAustrinus:'Piscis Austrinus',leo:'Leo',grus:'Grus',vela:'Vela',perseus:'Perseus',sagittarius:'Sagittarius',triangulumAustrale:'Triangulum Australe',pavo:'Pavo',hydra:'Hydra',aries:'Aries',cetus:'Cetus',andromeda:'Andromeda',ophiuchus:'Ophiuchus',coronaBorealis:'Corona Borealis',draco:'Draco',puppis:'Puppis',cepheus:'Cepheus',lupus:'Lupus',phoenix:'Phoenix',pegasus:'Pegasus',lepus:'Lepus',corvus:'Corvus',libra:'Libra',serpens:'Serpens',columba:'Columba',hercules:'Hercules',hydrus:'Hydrus',capricornus:'Capricornus',aquarius:'Aquarius',canesVenatici:'Canes Venatici'};
function skyFmtRa(ra,t){ const H=Math.floor(ra); return H+t.raH+' '+((ra-H)*60).toFixed(1)+t.raM; }
function skyFmtDec(dec){ const s2=dec<0?'−':'+', a2=Math.abs(dec), D=Math.floor(a2);
  return s2+D+'°'+String(Math.round((a2-D)*60)).padStart(2,'0')+'′'; }
function skyBrightestLine(key){
  const set=SKY_STARS.filter(s=>s.con===key); if(!set.length) return '';
  const b=set.reduce((a2,s)=>s.mag<a2.mag?s:a2);
  const t=window.LOC[LANG].sky||window.LOC.uz.sky;
  return ' ★ '+t.brightest+': '+(b.name||b.id)+' (m='+b.mag.toFixed(1)+', α='+skyFmtRa(b.ra,t)+', δ='+skyFmtDec(b.dec)+')';
}
let skyDown=null;
renderer.domElement.addEventListener('pointerdown', e=>{ skyDown=[e.clientX,e.clientY]; });
renderer.domElement.addEventListener('click', e=>{
  const card=document.getElementById('starCard');
  if(!skyDown || Math.hypot(e.clientX-skyDown[0], e.clientY-skyDown[1])>6) return;   // drag emas
  if((typeof seasonsActive!=='undefined'&&seasonsActive)||(typeof cutActive!=='undefined'&&cutActive)||(typeof ubActive!=='undefined'&&ubActive)) return;
  const w=window.innerWidth, h=window.innerHeight;
  let best=null, bd=18;
  SKY_STARS.forEach(s=>{ if(!s.name) return;
    if(COSMO.skyFade<0.5) return;
    const v=s.pos.clone().add(skyRoot.position).project(camera); if(v.z>=1) return;
    const sx=(v.x*0.5+0.5)*w, sy=(-v.y*0.5+0.5)*h;
    const d=Math.hypot(sx-e.clientX, sy-e.clientY);
    if(d<bd){ bd=d; best={s:s,sx:sx,sy:sy}; }
  });
  if(!best){ card.classList.remove('on'); return; }
  const t=window.LOC[LANG].sky||window.LOC.uz.sky, s=best.s;
  const L2=window.LOC[LANG];
  const conNm=(L2.constellations&&L2.constellations[s.con])?L2.constellations[s.con].name:(SKY_CON_LATIN[s.con]||s.con);
  card.innerHTML='<b>'+s.name+'</b>'
    +'<div>'+t.conLbl+': '+conNm+'</div>'
    +'<div>'+t.magLbl+': '+s.mag.toFixed(2)+'</div>'
    +'<div>'+t.coordLbl+': α = '+skyFmtRa(s.ra,t)+' · δ = '+skyFmtDec(s.dec)+'</div>';
  card.style.left=Math.min(w-240, Math.max(10, best.sx+14))+'px';
  card.style.top=Math.min(h-120, Math.max(10, best.sy-10))+'px';
  card.classList.add('on');
  playClick(820);
});
function highlightConstellation(key){
  CONSTELLATIONS.forEach(c=>{
    const on = c.key===key;
    c.lineTarget = on ? 1.0 : 0;   // fade nishoni — animate() da silliq o'tadi
    c.lines.material.color.setHex(on ? 0xbfd8ff : 0x7fa8ff);
    c.points.material.size = on ? 55 : 38;
  });
}
// Turkum chiziqlarining silliq fade animatsiyasi (sayohatda paydo bo'lib, keyin yo'qoladi)
function constLinesStep(dt2){
  CONSTELLATIONS.forEach(c=>{
    const tgt=c.lineTarget||0, cur=c.lines.material.opacity;
    if(Math.abs(cur-tgt)<0.01){ c.lines.material.opacity=tgt; return; }
    c.lines.material.opacity = cur + Math.sign(tgt-cur)*dt2*1.5;
  });
}
function flyToConstellation(c){
  // Kamera markazga yaqin turib, turkum tomon qaraydi
  flight = { fromCam:camera.position.clone(), toCamFixed:c.dir.clone().multiplyScalar(320),
    fromTgt:controls.target.clone(), toTgtFixed:c.dir.clone().multiplyScalar(900),
    rec:null, t:0, dur:2.2 };
  focusRec = null;
}

/* --------------------------------------------------------------------------
   7c. QORA TUYNUKLAR — Sagittarius A* (Somon yo‘li markazi) va Cygnus X-1
   -------------------------------------------------------------------------- */
/* Qora tuynuk yutish effekti:
   - akkretsion disk shaderi: Kepler bo'yicha aylanuvchi, ICHKARIGA oqayotgan spiral iplar
     (flow-map ikki qatlamli — vaqt o'tsa ham naqsh "o'ralib" buzilmaydi), Doppler yorqinligi
   - hamroh yulduz / gaz bulutidan so'rilayotgan oqim — spiral bo'ylab tezlashib tushadi,
     gorizont yonida qizil siljish bilan so'nadi
   - tosh bo'laklari — yaqinlashganda cho'ziladi ("spagettifikatsiya"), qiziydi va yutilganda chaqnaydi */
const BH_TIME = { value:0 };
function bhDiskMaterial(inner, outer, hot, cool, gain){
  return new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
    uniforms:{ uTime:BH_TIME, uIn:{value:inner}, uOut:{value:outer},
      uHot:{value:new THREE.Color(hot)}, uCool:{value:new THREE.Color(cool)},
      uGain:{value:gain}, uFlash:{value:0} },
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:[
      'uniform float uTime,uIn,uOut,uGain,uFlash; uniform vec3 uHot,uCool; varying vec2 vP;',
      'float h(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }',
      'float n3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);',
      '  return mix(mix(mix(h(i),h(i+vec3(1.0,0.0,0.0)),f.x), mix(h(i+vec3(0.0,1.0,0.0)),h(i+vec3(1.0,1.0,0.0)),f.x),f.y),',
      '             mix(mix(h(i+vec3(0.0,0.0,1.0)),h(i+vec3(1.0,0.0,1.0)),f.x), mix(h(i+vec3(0.0,1.0,1.0)),h(i+vec3(1.0,1.0,1.0)),f.x),f.y), f.z); }',
      'float layer(float a,float r,float tt,float seed){',
      '  float om=pow(uIn/r,1.5)*1.7;',            // Kepler: ichkarida tezroq
      '  float a2=a+tt*om;',
      '  float rr=log(r/uIn)*3.2+tt*0.55+seed;',     // vaqt o'tishi bilan naqsh ichkariga siljiydi
      '  vec3 q=vec3(cos(a2)*2.4,sin(a2)*2.4,rr);',
      '  return n3(q)*0.55+n3(q*2.3+7.1)*0.3+n3(q*5.3-3.3)*0.15; }',
      'void main(){',
      '  float r=length(vP), t=clamp((r-uIn)/(uOut-uIn),0.0,1.0), a=atan(vP.y,vP.x);',
      '  float P=9.0; float f1=fract(uTime/P), f2=fract(uTime/P+0.5);',
      '  float w1=1.0-abs(f1*2.0-1.0);',
      '  float n=layer(a,r,f1*P,0.0)*w1+layer(a,r,f2*P,13.7)*(1.0-w1);',
      '  float streak=smoothstep(0.3,0.8,n);',
      '  float fall=pow(1.0-t,1.5);',
      '  float edge=smoothstep(0.0,0.05,t)*(1.0-smoothstep(0.7,1.0,t));',
      '  vec3 col=mix(uCool,uHot,pow(1.0-t,2.0));',
      '  float dop=0.5+0.5*cos(a-0.6);',             // yaqinlashayotgan tomon yorqinroq
      '  float I=(0.2+1.25*streak)*fall*edge*(0.4+1.0*dop)*uGain*(1.0+uFlash*1.6);',
      '  gl_FragColor=vec4(col*I,1.0); }'
    ].join('\n')
  });
}
const BLACKHOLES = {};
[
  { key:'sagA',  ra:17.7611, dec:-29.0078, theta:5.95, phi:-0.12, dist:1250, size:14, hot:'#fff4e0', cool:'#ff7a2a',
    src:{ r:5.6, color:0xff8f6e, glow:3.4, orbit:0.035 } },   // G2 kabi gaz buluti — galaktika markazi
  { key:'cygX1', ra:19.9722, dec:35.2016, theta:4.7,  phi:0.34,  dist:1250, size:9,  hot:'#eaf2ff', cool:'#ff9a4a',
    src:{ r:6.0, color:0x9cc8ff, glow:2.8, orbit:0.0 } },     // HDE 226868 — ko'k o'ta gigant hamroh
].forEach(def=>{
  const S = def.size;
  const dir = def.ra!=null ? radecToVector(def.ra, def.dec, 1).normalize()   // haqiqiy osmon yo'nalishi
    : new THREE.Vector3(Math.cos(def.phi)*Math.cos(def.theta), Math.sin(def.phi), Math.cos(def.phi)*Math.sin(def.theta)).normalize();
  const g = new THREE.Group();
  const plane = new THREE.Group(); plane.rotation.x = 1.2;   // disk tekisligi — kameraga qiya
  const hole = new THREE.Mesh(new THREE.SphereGeometry(S, 48, 32), new THREE.MeshBasicMaterial({ color:0x000000 }));
  const disk = new THREE.Mesh(new THREE.RingGeometry(S*1.25, S*3.6, 160, 8), bhDiskMaterial(S*1.25, S*3.6, def.hot, def.cool, 1.0));
  const photon = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(),
    color:0xffd9a0, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending, depthWrite:false }));
  photon.scale.set(S*4.2, S*4.2, 1);
  const lensRing = new THREE.Mesh(new THREE.RingGeometry(S*1.04, S*1.55, 128, 2), bhDiskMaterial(S*1.04, S*1.55, def.hot, def.cool, 1.25));
  // Manba: hamroh yulduz / gaz buluti
  const srcSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(), color:def.src.color,
    transparent:true, opacity:0.95, blending:THREE.AdditiveBlending, depthWrite:false }));
  srcSpr.scale.set(S*def.src.glow, S*def.src.glow, 1);
  const srcCol = new THREE.Color(def.src.color);
  // Zarralar: disk changi + manbadan oqim
  const nDust = 240, nStream = 380, pN = nDust+nStream;
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pN*3),3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pN*3),3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size:S*0.2, map:SPRITE, vertexColors:true, transparent:true, opacity:0.95,
    blending:THREE.AdditiveBlending, depthWrite:false }));
  // Yutiladigan tosh bo'laklari
  const chunks = [];
  for(let i=0;i<3;i++){
    const pivot = new THREE.Object3D();
    const mat = astMat.clone(); mat.emissive = new THREE.Color(0xff6a20); mat.emissiveIntensity = 0;
    const m = new THREE.Mesh(astGeo, mat);
    pivot.add(m); pivot.visible=false; plane.add(pivot);
    chunks.push({ pivot, m, r:0, a:0, delay:1.5+i*4.5+Math.random()*2, s:S*(0.5+Math.random()*0.5), spin:0.6+Math.random()*1.4 });
  }
  plane.add(disk, particles, srcSpr);
  g.add(photon, lensRing, plane, hole);                     // qora shar oxirida — orqadagini to'sadi
  g.position.copy(dir.clone().multiplyScalar(def.dist));
  g.lookAt(0,0,0);
  scene.add(g);
  const b = BLACKHOLES[def.key] = { key:def.key, g, disk, dir, dist:def.dist, size:S,
    lensRing, photon, particles, pGeo, pDat:[], chunks, srcSpr, srcCol, src:def.src,
    srcA: def.key==='sagA' ? 2.2 : 0.4, flash:0, nDust };
  for(let i=0;i<pN;i++){ const p={ stream:i>=nDust }; bhSpawn(b,p,true); b.pDat.push(p); }
  for(let k=0;k<320;k++) bhParticles(b, 0.1);             // oldindan "isitish" — oqim darhol to'liq
  bhPlaceSrc(b);
});
function bhPlaceSrc(b){
  const R=b.src.r*b.size; b.srcSpr.position.set(Math.cos(b.srcA)*R, Math.sin(b.srcA)*R, 0);
}
function bhSpawn(b,p,init){
  const S=b.size;
  if(p.stream){
    p.r = b.src.r*S*(0.93+Math.random()*0.05);
    p.a = b.srcA + (Math.random()-0.5)*0.12;
    p.z = (Math.random()-0.5)*S*0.35;
  } else {
    p.r = S*(init ? 1.3+Math.random()*2.4 : 2.9+Math.random()*0.9);
    p.a = Math.random()*Math.PI*2;
    p.z = (Math.random()-0.5)*S*0.12;
  }
  p.k = 0.7+Math.random()*0.6; p.age = init ? 1 : 0;
}
function bhParticles(b, dt){
  const S=b.size, pos=b.pGeo.attributes.position.array, col=b.pGeo.attributes.color.array;
  const R0=b.src.r*S;
  for(let i=0;i<b.pDat.length;i++){
    const p=b.pDat[i];
    // radial tushish gorizontga yaqinlashgan sari keskin tezlashadi
    p.r -= S*0.24*p.k*Math.pow(S*3/p.r,1.25)*dt;
    p.a += dt*0.95*Math.pow(S*2/p.r,1.5)*(0.85+p.k*0.2);
    p.age += dt;
    if(p.r < S*1.03){ bhSpawn(b,p,false); }
    const o=i*3, flat=Math.min(1,p.r/R0);
    pos[o]=Math.cos(p.a)*p.r; pos[o+1]=Math.sin(p.a)*p.r; pos[o+2]=p.z*flat;
    const tr=Math.max(0,Math.min(1,(p.r-S*1.2)/(S*2.6)));
    let r=1, g=0.52+0.48*(1-tr), bl=0.22+0.72*Math.pow(1-tr,2.2);
    if(p.stream){                                         // manba rangidan qizigan gaz rangiga
      const m=Math.max(0,Math.min(1,(p.r-S*3.4)/(R0-S*3.4)));
      r=r*(1-m)+b.srcCol.r*m; g=g*(1-m)+b.srcCol.g*m; bl=bl*(1-m)+b.srcCol.b*m;
    }
    const fo=Math.max(0,Math.min(1,(p.r-S*1.03)/(S*0.45)));   // gorizont: qizil siljish + so'nish
    const fi=Math.min(1,p.age/0.7);
    const I=Math.sqrt(fo)*fi*(p.stream?0.95:0.75);
    col[o]=r*I; col[o+1]=g*fo*I; col[o+2]=bl*fo*fo*I;
  }
  b.pGeo.attributes.position.needsUpdate=true;
  b.pGeo.attributes.color.needsUpdate=true;
}
function bhUpdate(b, dt){
  dt=Math.min(dt,0.05);
  const S=b.size;
  if(b.src.orbit){ b.srcA += dt*b.src.orbit; bhPlaceSrc(b); }
  b.srcSpr.material.opacity = 0.85+0.1*Math.sin(BH_TIME.value*2.3);
  bhParticles(b, dt);
  b.chunks.forEach(c=>{
    if(c.delay>0){
      c.delay-=dt;
      if(c.delay<=0){ c.r=S*(5+Math.random()*1.6); c.a=Math.random()*Math.PI*2; c.pivot.visible=true; }
      return;
    }
    c.r -= S*0.5*Math.pow(S*3/c.r,1.6)*dt;
    c.a += dt*1.0*Math.pow(S*2/c.r,1.5);
    c.pivot.position.set(Math.cos(c.a)*c.r, Math.sin(c.a)*c.r, 0);
    c.pivot.rotation.z = c.a;                              // mahalliy x — markaz tomon
    const st=Math.pow(S*2.3/c.r,3);                         // to'lqin kuchi ~ 1/r^3
    const L=1+Math.min(st*1.6,10);
    c.m.scale.set(c.s*L, c.s/Math.sqrt(L), c.s/Math.sqrt(L));
    c.m.rotation.x += dt*c.spin;
    c.m.material.emissiveIntensity = Math.min(2.4, st*0.9);
    if(c.r < S*1.04){                                        // yutildi — chaqnash
      b.flash = Math.min(1.6, b.flash+1);
      c.pivot.visible=false; c.delay = 2.5+Math.random()*5;
    }
  });
  b.flash = Math.max(0, b.flash - dt*1.1);
  b.disk.material.uniforms.uFlash.value = b.flash;
  b.lensRing.material.uniforms.uFlash.value = b.flash;
  const ps = S*4.2*(1+b.flash*0.3);
  b.photon.scale.set(ps,ps,1);
  b.photon.material.opacity = Math.min(1, 0.85+b.flash*0.15);
  b.lensRing.lookAt(camera.position);
}
function flyToBlackHole(bh){
  const camPos = bh.dir.clone().multiplyScalar(bh.dist - bh.size*11);
  camPos.y += bh.size*1.5;
  // Nishonni biroz pastga suramiz — qora tuynuk ekranning yuqori yarmida,
  // pastdagi matn kartasi uni to‘smaydi
  const tgt = bh.g.position.clone(); tgt.y -= bh.size*2.6;
  flight = { fromCam:camera.position.clone(), toCamFixed:camPos,
    fromTgt:controls.target.clone(), toTgtFixed:tgt,
    rec:null, t:0, dur:2.4 };
  focusRec = null;
}

/* --------------------------------------------------------------------------
   7d. KOINOT MIQYOSI — Somon yo'li, Mahalliy guruh va uzoq galaktikalar
   Uzoqlashgan sari: osmon so'nadi → Somon yo'li paydo bo'ladi → Andromeda, Uchburchak,
   Magellan bulutlari → minglab uzoq galaktikalar (kosmik to'r) kichrayib ketadi.
   Yo'nalishlar haqiqiy (RA/Dec), masofalar yorug'lik yilida (1 y.y. = 1.2 birlik).
   -------------------------------------------------------------------------- */
const LY = 1.2;
const GAL_NGP = radecToVector(12.8567, 27.128, 1).normalize();   // galaktik shimoliy qutb
const GAL_GC  = radecToVector(17.7611, -28.936, 1).normalize();  // galaktika markazi yo'nalishi
const COSMO = { skyFade:1, mwFade:0, camD:0, lang:null, pos:{}, labels:[] };

// Osmon qatlamlari bitta guruhda — uzoqlashganda kamera bilan yuradi (cheksiz uzoq fon) va so'nadi
const skyRoot = new THREE.Group(); scene.add(skyRoot);
[starsFar, starsNear, nebulaGroup, ...galaxySprites,
 ...scene.children.filter(o=>o.userData && o.userData.skyLayer)].forEach(o=>skyRoot.add(o));
const SKY_FADE_MATS = [];
skyRoot.traverse(o=>{
  if(!o.material || o===starsNear || o.isLineSegments || o.isLine) return;
  if(typeof skyGridMats!=='undefined' && skyGridMats.includes(o.material)) return;
  o.material.userData.skyBase = o.material.opacity; SKY_FADE_MATS.push(o.material);
});
dust.material.userData.skyBase = dust.material.opacity; SKY_FADE_MATS.push(dust.material);

/* --- Barcha 88 ta yulduz turkumi (labs/constellations.js): chiziqlar + nomlar, ✨ tugmasi bilan yoqiladi.
       Osmon guruhida — yulduzlar bilan aniq ustma-ust tushadi va kosmik uzoqlashishda ular bilan birga so'nadi. --- */
const CON_ALL = (function(){
  const D=window.SKY_CONSTELLATIONS||[], grp=new THREE.Group(); grp.visible=false; skyRoot.add(grp);
  const R=CONST_R*0.995;
  /* Porlovchi chiziqlar: har bir kesma — ekranga qaragan tasma (WebGL chizig'i 1 px va "quruq" bo'lardi).
     Ko'ndalang kesimi: ingichka oq-issiq o'zak + keng yumshoq nur; bo'ylab sekin oqib o'tadigan yorug'lik;
     yoqilganda har bir chiziq boshidan oxirigacha "chizilib" paydo bo'ladi. Qalinlik — piksellarda (masofaga bog'liq emas). */
  const BLUE=[0.55,0.72,1.0], GOLD=[1.0,0.80,0.45];
  const P=[], O=[], S=[], A=[], SD=[], CL=[], IX=[]; let nv=0;
  const nodeP=[], nodeC=[], nodeS=[];
  D.forEach((c,ci)=>{ const col=c.z?GOLD:BLUE, seed=ci/D.length, seen=new Set();
    c.l.forEach(s=>{ const v=s.map(p=>radecToVector(p[0],p[1],R));
      s.forEach((p,i)=>{ const key=p[0]+','+p[1]; if(seen.has(key)) return; seen.add(key);
        nodeP.push(v[i].x,v[i].y,v[i].z); nodeC.push(...col); nodeS.push(Math.random()); });
      for(let i=0;i<v.length-1;i++){ const a=v[i], b=v[i+1];
        [[a,b,-1,0],[a,b,1,0],[b,a,-1,1],[b,a,1,1]].forEach(([p,o,sd,al])=>{
          P.push(p.x,p.y,p.z); O.push(o.x,o.y,o.z); S.push(sd); A.push(al); SD.push(seed+i*0.137); CL.push(...col); });
        IX.push(nv,nv+2,nv+1, nv+1,nv+2,nv+3); nv+=4; } }); });   // uchburchaklar ekranda soat strelkasiga qarshi — old tomon
  const lg=new THREE.BufferGeometry();
  lg.setAttribute('position',new THREE.Float32BufferAttribute(P,3)); lg.setAttribute('other',new THREE.Float32BufferAttribute(O,3));
  lg.setAttribute('side',new THREE.Float32BufferAttribute(S,1)); lg.setAttribute('along',new THREE.Float32BufferAttribute(A,1));
  lg.setAttribute('seed',new THREE.Float32BufferAttribute(SD,1)); lg.setAttribute('acol',new THREE.Float32BufferAttribute(CL,3)); lg.setIndex(IX);
  // ("acol": "color" nomi three.js bilan to'qnashib 0 bo'lib kelardi)
  const U={ uRes:{value:new THREE.Vector2(1,1)}, uWidth:{value:6}, uOpacity:{value:0}, uTime:{value:0}, uReveal:{value:0} };
  const lineMat=new THREE.ShaderMaterial({ uniforms:U, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,   // FrontSide: barcha tasmalar ekranda bir xil aylanish yo'nalishida; teskarisi — buzilgan (kamera tekisligini kesuvchi) kesma
    vertexShader:[
      'attribute vec3 other; attribute float side; attribute float along; attribute float seed; attribute vec3 acol;',
      'uniform vec2 uRes; uniform float uWidth;',
      'varying float vSide; varying float vAlong; varying float vSeed; varying vec3 vCol;',
      'void main(){',
      '  vSide=side; vAlong=along; vSeed=seed; vCol=acol;',
      '  vec4 a=projectionMatrix*modelViewMatrix*vec4(position,1.0);',
      '  vec4 b=projectionMatrix*modelViewMatrix*vec4(other,1.0);',
      '  if(a.w<=0.0||b.w<=0.0){ gl_Position=vec4(2.0,2.0,2.0,1.0); return; }',   // kamera ortidagi kesma
      '  vec2 sa=a.xy/a.w*uRes*0.5, sb=b.xy/b.w*uRes*0.5;',
      '  vec2 d=sb-sa; if(length(d)<1e-4) d=vec2(1.0,0.0); d=normalize(d); if(along>0.5) d=-d;',
      '  vec2 n=vec2(-d.y,d.x);',
      '  vec2 off=(n*side*uWidth + d*(along>0.5?1.0:-1.0)*uWidth*0.35)/(uRes*0.5);',   // uchlari biroz uzaytiriladi — tugunlarda uzilish yo'q
      '  a.xy+=off*a.w; gl_Position=a;',
      '}'].join('\n'),
    fragmentShader:[
      'uniform float uOpacity; uniform float uTime; uniform float uReveal;',
      'varying float vSide; varying float vAlong; varying float vSeed; varying vec3 vCol;',
      'void main(){',
      '  float d=abs(vSide);',
      '  float core=exp(-d*d*30.0), glow=exp(-d*d*3.2)*0.5;',
      '  float flow=0.72+0.28*sin(vAlong*6.2832-uTime*1.4+vSeed*37.0);',          // chiziq bo'ylab oqib o'tuvchi yorug'lik
      '  float rev=smoothstep(vAlong-0.08,vAlong,uReveal*1.25-fract(vSeed*7.31)*0.25);',   // chizilib paydo bo'lish
      '  vec3 c=mix(vCol,vec3(1.0,0.98,0.95),core*0.7);',
      '  float al=(core+glow)*flow*rev*uOpacity;',
      '  if(al<0.004) discard;',
      '  gl_FragColor=vec4(c,al);',
      '}'].join('\n') });
  const lineMesh=new THREE.Mesh(lg,lineMat); lineMesh.frustumCulled=false; lineMesh.renderOrder=2; grp.add(lineMesh);
  // Tugunlar — chiziqlar uchrashgan yulduzlar: yumshoq miltillovchi nur
  const ng=new THREE.BufferGeometry();
  ng.setAttribute('position',new THREE.Float32BufferAttribute(nodeP,3)); ng.setAttribute('acol',new THREE.Float32BufferAttribute(nodeC,3)); ng.setAttribute('seed',new THREE.Float32BufferAttribute(nodeS,1));
  const NU={ uOpacity:{value:0}, uTime:{value:0}, uPx:{value:1} };
  const nodeMat=new THREE.ShaderMaterial({ uniforms:NU, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:'attribute vec3 acol; attribute float seed; uniform float uTime; uniform float uPx; varying vec3 vCol; varying float vTw;\n'+
      'void main(){ vCol=acol; vTw=0.75+0.25*sin(uTime*(1.3+seed*1.7)+seed*40.0); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=(15.0+5.0*vTw)*uPx; }',
    fragmentShader:'uniform float uOpacity; varying vec3 vCol; varying float vTw;\n'+
      'void main(){ vec2 p=gl_PointCoord-0.5; float r=length(p)*2.0; if(r>1.0) discard;\n'+
      '  float core=exp(-r*r*22.0), halo=exp(-r*r*4.0)*0.55; vec3 c=mix(vCol,vec3(1.0),core*0.8);\n'+
      '  gl_FragColor=vec4(c,(core+halo)*vTw*uOpacity); }' });
  const nodes=new THREE.Points(ng,nodeMat); nodes.frustumCulled=false; nodes.renderOrder=3; grp.add(nodes);
  // Nom joyi — turkum chiziqlari nuqtalarining o'rtacha yo'nalishi
  const cent=D.map(c=>{ const v=new THREE.Vector3(); c.l.flat().forEach(p=>v.add(radecToVector(p[0],p[1],1))); return v.normalize().multiplyScalar(CONST_R*0.97); });
  function tex(txt, zod){
    const c=makeCanvas(512,96), x=c.getContext('2d');
    x.font='500 42px "Segoe UI", system-ui, sans-serif'; if('letterSpacing' in x) x.letterSpacing='2px';
    const w=Math.min(500, x.measureText(txt).width+24);
    const col=zod?'#ffd98a':'#b4cbff';
    x.textAlign='center'; x.textBaseline='middle';
    x.globalAlpha=1; x.shadowColor='rgba(0,0,0,0.9)'; x.shadowBlur=6; x.fillStyle=col; x.fillText(txt,256,50);
    return { map:asTexture(c,false), w:w/512 };
  }
  let labels=[];
  const st={ f:0, t:0, k:-1, r:0 };
  function build(){
    labels.forEach(s=>{ grp.remove(s); s.material.map.dispose(); s.material.dispose(); }); labels=[];
    const li={uz:0,ru:1,en:2}[LANG]; const ix=li==null?0:li;
    D.forEach((c,i)=>{ const t=tex(c.n[ix], c.z);
      const sp=new THREE.Sprite(new THREE.SpriteMaterial({ map:t.map, transparent:true, opacity:0, depthWrite:false }));
      sp.center.set(0.5,0.5); sp.scale.set(300,300*96/512,1); sp.position.copy(cent[i]); grp.add(sp); labels.push(sp); });
    st.k=-1;
  }
  build();
  const _rs=new THREE.Vector2();
  function step(dt){
    if(st.f!==st.t){ st.f=Math.max(0,Math.min(1, st.f+Math.sign(st.t-st.f)*dt*1.6)); }
    // yoqilganda ~1.8 s da chizilib chiqadi — haqiqiy vaqt bo'yicha (kadr tezligiga bog'liq emas)
    if(st.t===1) st.r=Math.min(1, (performance.now()-st.t0)/1800); else if(st.f===0) st.r=0;
    const k=easeInOut(st.f)*COSMO.skyFade;
    grp.visible=k>0.003; if(!grp.visible){ st.k=k; return; }
    // har kadr: vaqt (oqim, miltillash) va ekran o'lchami
    renderer.getDrawingBufferSize(_rs); U.uRes.value.copy(_rs); const dpr=renderer.getPixelRatio();
    U.uWidth.value=6.5*dpr; NU.uPx.value=dpr; U.uTime.value=NU.uTime.value=clock.elapsedTime;
    U.uReveal.value=easeInOut(st.r);
    if(Math.abs(k-st.k)<0.002) return;
    st.k=k; U.uOpacity.value=0.95*k; NU.uOpacity.value=0.9*k; labels.forEach(s=>{ s.material.opacity=0.9*k; });
  }
  function toggle(){ st.t=st.t?0:1; if(st.t===1 && st.r===0) st.t0=performance.now(); return st.t===1; }
  return { step, toggle, build, count:D.length };
})();
const CON_BTN_T={ uz:'Yulduz turkumlari (88)', ru:'Созвездия (88)', en:'Constellations (88)' };
{ const b=document.getElementById('conBtn');
  if(b){ b.title=CON_BTN_T[LANG]||CON_BTN_T.uz;
    b.addEventListener('click', ()=>{ const on=CON_ALL.toggle(); b.classList.toggle('active', on); playClick(on?760:440); }); } }

// Osmondagi Somon yo'li tasmasi — haqiqiy galaktik tekislik bo'ylab, markazi Qavs turkumida,
// Oqqushdan Qavsgacha "Buyuk yoriq" chang lentasi bilan
const mwBand = new THREE.Mesh(new THREE.SphereGeometry(2950, 64, 32), new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.BackSide,
  uniforms:{ uOpacity:{value:0.3}, uNGP:{value:GAL_NGP}, uGC:{value:GAL_GC} },
  vertexShader:'varying vec3 vD; void main(){ vD=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: NOISE_GLSL + [
    'uniform float uOpacity; uniform vec3 uNGP; uniform vec3 uGC; varying vec3 vD;',
    'void main(){',
    '  vec3 d=normalize(vD);',
    '  float b=asin(clamp(dot(d,uNGP),-1.0,1.0));',
    '  vec3 e2=normalize(cross(uNGP,uGC));',
    '  float l=atan(dot(d,e2),dot(d,uGC));',
    '  float cw=exp(-l*l/0.6);',
    '  float w=0.085+0.11*cw;',
    '  float band=exp(-(b*b)/(w*w));',
    '  float core=exp(-(l*l)/0.12-(b*b)/0.018);',
    '  if(band+core<0.015) discard;',
    '  float n=fbm(d*3.4)*0.5+0.5;',
    '  float n2=snoise(d*11.0)*0.5+0.5;',
    '  float I=band*(0.28+0.32*cw+0.55*n)*(0.7+0.5*n2)+core*0.9;',
    '  float rp=b-0.018-0.025*sin(l*2.3);',
    '  float rift=exp(-(rp*rp)/0.0009)*(1.0-smoothstep(0.3,2.0,abs(l)))*smoothstep(0.3,0.62,n);',
    '  I*=1.0-0.8*rift;',
    '  vec3 col=mix(vec3(0.6,0.68,0.88),vec3(1.0,0.85,0.66),cw);',
    '  gl_FragColor=vec4(col*I*uOpacity,1.0);',
    '}'].join('\n')
}));
mwBand.renderOrder=-2; skyRoot.add(mwBand);
// Tasma bo'ylab zich xira yulduzlar
{
  const N=26000, pos=new Float32Array(N*3), col=new Float32Array(N*3);
  const e2=new THREE.Vector3().crossVectors(GAL_NGP,GAL_GC).normalize(), v=new THREE.Vector3();
  for(let i=0;i<N;i++){
    const l = Math.random()<0.5 ? (Math.random()*2-1)*Math.PI : Math.max(-Math.PI,Math.min(Math.PI,gRand()*0.9));
    const cw=Math.exp(-l*l/0.6), b=gRand()*(0.07+0.1*cw)*0.8, r=2700+Math.random()*150;
    v.copy(GAL_GC).multiplyScalar(Math.cos(b)*Math.cos(l)).addScaledVector(e2,Math.cos(b)*Math.sin(l)).addScaledVector(GAL_NGP,Math.sin(b)).multiplyScalar(r);
    pos[i*3]=v.x; pos[i*3+1]=v.y; pos[i*3+2]=v.z;
    const c=bvColor(-0.1+Math.random()*1.5), k=0.25+Math.random()*0.5;
    col[i*3]=c[0]*k; col[i*3+1]=c[1]*k; col[i*3+2]=c[2]*k;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const m=new THREE.PointsMaterial({size:4.5,map:SPRITE,vertexColors:true,transparent:true,opacity:0.75,
    depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
  m.userData.skyBase=m.opacity; SKY_FADE_MATS.push(m);
  skyRoot.add(new THREE.Points(g,m));
}

// Siz shu yerdasiz — uzoqdan Quyosh tizimi yorqin nuqta bo'lib qoladi
const sunMarker = new THREE.Sprite(new THREE.SpriteMaterial({ map:SPRITE, color:0xffe2a8, transparent:true,
  opacity:0, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:false }));
sunMarker.scale.set(0.012,0.012,1); sunMarker.renderOrder=10; scene.add(sunMarker);

function galaxyDiskTextures(g, W){
  const Wn=W>>1, nz=new Float32Array(Wn*Wn), nz2=new Float32Array(Wn*Wn);
  for(let j=0;j<Wn;j++) for(let i=0;i<Wn;i++){
    const x=(i/Wn)*2-1, z=(j/Wn)*2-1, k=j*Wn+i;
    nz[k]=fbm3(x*5+g.seed, z*5-g.seed, g.seed*0.37, 4, 0.55, 2.1);
    nz2[k]=fbm3(x*12-g.seed, z*12+3.3, g.seed, 3, 0.5, 2.2);
  }
  const gc=makeCanvas(W,W), dc=makeCanvas(W,W), gx=gc.getContext('2d'), dx=dc.getContext('2d');
  const gi=gx.createImageData(W,W), di=dx.createImageData(W,W), gd=gi.data, dd=di.data, out=[0,0,0];
  for(let j=0;j<W;j++) for(let i=0;i<W;i++){
    const x=(i+0.5)/W*2-1, z=(j+0.5)/W*2-1, r=Math.hypot(x,z), o=(j*W+i)*4;
    gd[o+3]=255; if(r>=1) continue;
    const kk=(j>>1)*Wn+(i>>1), n=nz[kk], n2=nz2[kk];
    spiralPixel(x,z,g,n,n2,out);
    const k=g.gain||1.3;
    gd[o]=255*(1-Math.exp(-out[0]*k)); gd[o+1]=255*(1-Math.exp(-out[1]*k)); gd[o+2]=255*(1-Math.exp(-out[2]*k));
    if(g.arms){
      const da=armProfile(Math.atan2(z,x),r,g,g.dustShift||-0.22,0.45);
      const D=da*(0.3+1.0*n2)*sstep(0.08,0.22,r)*(1-sstep(0.78,1,r))*(0.6+0.6*n);
      dd[o]=26; dd[o+1]=16; dd[o+2]=10; dd[o+3]=Math.min(255, D*230);
    }
  }
  gx.putImageData(gi,0,0); dx.putImageData(di,0,0);
  return { glow:asTexture(gc,false), dust:asTexture(dc,false) };
}
function galaxyPlaneMat(tex, isDust, n0, n1){
  return new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, side:THREE.DoubleSide,
    blending: isDust ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms:{ map:{value:tex}, uOpacity:{value:1}, uBoost:{value:1}, uN0:{value:n0}, uN1:{value:n1} },
    vertexShader:'varying vec2 vUv; varying vec3 vWP; varying vec3 vN; void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.0); vWP=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:'uniform sampler2D map; uniform float uOpacity,uBoost,uN0,uN1; varying vec2 vUv; varying vec3 vWP; varying vec3 vN;\n'+
      'void main(){ vec4 t=texture2D(map,vUv); vec3 V=normalize(cameraPosition-vWP);'+
      ' float dist=length(cameraPosition-vWP); float e=max(smoothstep(0.03,0.32,abs(dot(V,normalize(vN)))), smoothstep(uN1*3.0,uN1*20.0,dist)); float dn=smoothstep(uN0,uN1,dist);'+
      ' float k=uOpacity*e*dn;'+ (isDust ? ' gl_FragColor=vec4(t.rgb,t.a*k);' : ' gl_FragColor=vec4(t.rgb*k*uBoost,1.0);') + ' }'
  });
}
function buildGalaxy(g){
  const R=g.R, n=g.n, grp=new THREE.Group();
  const pos=new Float32Array(n*3), col=new Float32Array(n*3), siz=new Float32Array(n);
  const base=R*0.0035, clumps=[];
  if(g.type==='irr') for(let c=0;c<14;c++) clumps.push([gRand()*0.42, gRand()*0.1, gRand()*0.3]);
  for(let i=0;i<n;i++){
    let x,y,z,cr,cg,cb,I,s=base;
    const u=Math.random();
    if(g.type==='irr'){
      if(u<0.5){ x=gRand()*0.32; z=gRand()*0.11; y=gRand()*0.06; }
      else { const c=clumps[(Math.random()*clumps.length)|0]; x=c[0]+gRand()*0.07; y=c[1]+gRand()*0.04; z=c[2]+gRand()*0.07; }
      const h=Math.random();
      if(h<0.07){ cr=1; cg=0.45; cb=0.62; s*=2.2; I=0.5; } else if(h<0.55){ cr=0.7; cg=0.8; cb=1; I=0.24; } else { cr=1; cg=0.92; cb=0.8; I=0.2; }
    } else if(u<g.fb){                                   // bo'rtiq
      const r=Math.abs(gRand())*g.rb*0.8, th=Math.random()*TAU, ph=Math.acos(2*Math.random()-1);
      x=r*Math.sin(ph)*Math.cos(th); z=r*Math.sin(ph)*Math.sin(th); y=r*Math.cos(ph)*0.6;
      cr=1; cg=0.84; cb=0.6; I=0.2;
    } else if(u<g.fb+(g.fbar||0)){                       // bar
      const bx=(Math.random()*2-1)*g.bar, bz=gRand()*0.035, c=Math.cos(g.barA), s2=Math.sin(g.barA);
      x=bx*c-bz*s2; z=bx*s2+bz*c; y=gRand()*0.012;
      cr=1; cg=0.86; cb=0.64; I=0.2;
    } else {                                             // disk + spiral qo'llar
      const r=Math.max(0.02, Math.min(0.99, -Math.log(1-Math.random()*0.985)*g.rs));
      const inArm=g.arms && Math.random()<0.72;
      let th;
      if(inArm){
        const k=(Math.random()*g.arms)|0, w=g.armW*(0.55+r*0.9);
        th=k*TAU/g.arms + Math.log(Math.max(r,0.015)/0.06)/Math.tan(g.pitch) + gRand()*w*0.75/Math.max(r,0.12);
      } else th=Math.random()*TAU;
      x=Math.cos(th)*r; z=Math.sin(th)*r; y=gRand()*g.thick*(0.4+0.6*Math.exp(-r/0.35));
      if(inArm && Math.random()<0.06){ cr=1; cg=0.42; cb=0.6; s*=2.6; I=0.55; }       // HII hududlari
      else if(inArm && Math.random()<0.6){ cr=0.66; cg=0.78; cb=1; I=0.2; }          // yosh ko'k yulduzlar
      else { cr=1; cg=0.9; cb=0.78; I=0.15; }
    }
    I*=0.6+Math.random()*0.8;
    pos[i*3]=x*R; pos[i*3+1]=y*R; pos[i*3+2]=z*R;
    col[i*3]=cr*I; col[i*3+1]=cg*I; col[i*3+2]=cb*I; siz[i]=s*(0.7+Math.random()*0.6);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('aColor',new THREE.BufferAttribute(col,3));
  geo.setAttribute('aSize',new THREE.BufferAttribute(siz,1));
  const pts=new THREE.Points(geo, softPointsMaterial({ maxPx:g.maxPx||4, n0:g.n0||0, n1:g.n1||0.001 }));
  pts.renderOrder=1; grp.add(pts);
  const rec={ grp, pts, R };
  if(g.type!=='irr'){
    const tx=galaxyDiskTextures(g, g.tex||512), pg=new THREE.PlaneGeometry(2*R,2*R);
    rec.glow=new THREE.Mesh(pg, galaxyPlaneMat(tx.glow,false,g.pn0||0,g.pn1||0.001));
    rec.dust=new THREE.Mesh(pg, galaxyPlaneMat(tx.dust,true,g.pn0||0,g.pn1||0.001));
    rec.glow.rotation.x=rec.dust.rotation.x=-Math.PI/2;
    rec.glow.renderOrder=0; rec.dust.renderOrder=3;
    rec.glow.material.uniforms.uOpacity.value=0.85; rec.dust.material.uniforms.uOpacity.value=0.85;
    grp.add(rec.glow, rec.dust);
  } else {
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(), color:0x9fb8ff, transparent:true,
      opacity:0.2, blending:THREE.AdditiveBlending, depthWrite:false }));
    sp.scale.set(R*1.5,R*0.9,1); grp.add(sp); rec.sprite=sp;
  }
  grp.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), g.normal.clone().normalize());
  grp.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), g.phase||0));
  grp.position.copy(g.pos);
  scene.add(grp);
  (COSMO.gals=COSMO.gals||[]).push(rec);
  return rec;
}
function incNormal(los, incDeg, paDeg){
  const e1=new THREE.Vector3().crossVectors(los, new THREE.Vector3(0,1,0)).normalize();
  const e2=new THREE.Vector3().crossVectors(e1, los).normalize(), a=paDeg*Math.PI/180, i=incDeg*Math.PI/180;
  const t=e1.multiplyScalar(Math.cos(a)).add(e2.multiplyScalar(Math.sin(a)));
  return los.clone().multiplyScalar(-Math.cos(i)).add(t.multiplyScalar(Math.sin(i))).normalize();
}
// Uzoq galaktikalar atlasi: 9 spiral, 5 elliptik, 2 notekis (har biri 128px katak)
function galaxyAtlas(){
  const C=128, W=C*4, cv=makeCanvas(W,W), ctx=cv.getContext('2d'), im=ctx.createImageData(W,W), d=im.data, out=[0,0,0];
  for(let cell=0;cell<16;cell++){
    const cx=(cell%4)*C, cy=Math.floor(cell/4)*C, type=cell<9?'s':(cell<14?'e':'i');
    const g={arms:2+(cell%3), pitch:0.3+Math.random()*0.3, armW:0.07+Math.random()*0.05, rs:0.26+Math.random()*0.1,
      rb:0.08+Math.random()*0.1, bar:cell%4===1?0.25:0, barA:Math.random()*3, seed:cell*3.7+1};
    const ell=0.35+Math.random()*0.35;
    for(let j=0;j<C;j++) for(let i=0;i<C;i++){
      const x=((i+0.5)/C*2-1)/0.92, z=((j+0.5)/C*2-1)/0.92, r=Math.hypot(x,z), o=((cy+j)*W+cx+i)*4;
      d[o+3]=255; if(r>=1) continue;
      let R=0,G=0,B=0;
      if(type==='s'){ spiralPixel(x,z,g,fbm3(x*5+g.seed,z*5,g.seed,3,0.55,2.1),fbm3(x*12,z*12-g.seed,2.2,2,0.5,2.2),out); R=out[0];G=out[1];B=out[2]; }
      else if(type==='e'){ const I=Math.exp(-3.2*Math.pow(r/ell,0.6))*1.4*(1-sstep(0.7,1,r)); R=I; G=I*0.86; B=I*0.7; }
      else { const n=fbm3(x*3+g.seed,z*3,1.7,4,0.55,2.1), I=Math.max(0,n-0.42)*2.4*Math.exp(-r*2.2)*(1-sstep(0.7,1,r)); R=I*0.78; G=I*0.86; B=I; }
      d[o]=255*(1-Math.exp(-R*1.3)); d[o+1]=255*(1-Math.exp(-G*1.3)); d[o+2]=255*(1-Math.exp(-B*1.3));
    }
  }
  ctx.putImageData(im,0,0);
  const t=new THREE.CanvasTexture(cv); t.minFilter=THREE.LinearFilter; t.generateMipmaps=false; return t;
}
function buildCosmicWeb(){
  const atlas=galaxyAtlas(), P=[], clusters=[];
  const rv=()=>new THREE.Vector3(gRand(),gRand(),gRand());
  for(let c=0;c<80;c++) clusters.push({ p:rv().normalize().multiplyScalar(6e6+Math.pow(Math.random(),0.6)*5.2e7), n:8+(Math.random()*36|0), s:4e5+Math.random()*9e5 });
  clusters.forEach(c=>{ for(let i=0;i<c.n;i++) P.push({ p:c.p.clone().add(rv().multiplyScalar(c.s)), cl:true }); });
  for(let f=0;f<70;f++){                                 // filamentlar — klasterlarni bog'lovchi iplar
    const a=clusters[(Math.random()*80)|0]; let best=null, bd=1e99;
    clusters.forEach(b=>{ if(b===a) return; const dd=a.p.distanceTo(b.p)*(0.7+Math.random()*0.6); if(dd<bd){ bd=dd; best=b; } });
    for(let k=0;k<14;k++) P.push({ p:a.p.clone().lerp(best.p,Math.random()).add(rv().multiplyScalar(3e5)), cl:false });
  }
  for(let i=0;i<500;i++) P.push({ p:rv().normalize().multiplyScalar(4e6+Math.random()*5.6e7), cl:false });
  const N=P.length, pos=new Float32Array(N*3), col=new Float32Array(N*3), siz=new Float32Array(N), prm=new Float32Array(N*3);
  P.forEach((q,i)=>{
    pos[i*3]=q.p.x; pos[i*3+1]=q.p.y; pos[i*3+2]=q.p.z;
    const ell = q.cl ? Math.random()<0.55 : Math.random()<0.2;
    const idx = ell ? 9+((Math.random()*5)|0) : (Math.random()<0.93 ? (Math.random()*9)|0 : 14+((Math.random()*2)|0));
    siz[i]=3.6*(12000+Math.pow(Math.random(),2)*80000)*(ell&&q.cl?1.4:1);
    prm[i*3]=idx; prm[i*3+1]=Math.random()*TAU; prm[i*3+2]= ell ? 0.6+Math.random()*0.4 : 0.2+Math.random()*0.8;
    const k=Math.min(1,q.p.length()/6e7), b=0.8+Math.random()*0.5;
    col[i*3]=b; col[i*3+1]=b*(1-0.18*k); col[i*3+2]=b*(1-0.35*k);  // uzoqdagilar qizg'ishroq (qizil siljish)
  });
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('aColor',new THREE.BufferAttribute(col,3));
  geo.setAttribute('aSize',new THREE.BufferAttribute(siz,1));
  geo.setAttribute('aPrm',new THREE.BufferAttribute(prm,3));
  const mat=new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ uAtlas:{value:atlas}, uScale:PX_SCALE, uMaxPx:{value:96} },
    vertexShader:['attribute float aSize; attribute vec3 aColor; attribute vec3 aPrm;',
      'uniform float uScale,uMaxPx; varying vec3 vC; varying vec3 vP;',
      'void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); float d=max(-mv.z,0.0001);',
      '  float ps=aSize*uScale/d; float a=1.0; if(ps<2.0){ a=ps/2.0; ps=2.0; }',
      '  vC=aColor*a; vP=aPrm; gl_PointSize=min(ps,uMaxPx); gl_Position=projectionMatrix*mv; }'].join('\n'),
    fragmentShader:['uniform sampler2D uAtlas; varying vec3 vC; varying vec3 vP;',
      'void main(){ vec2 p=gl_PointCoord-0.5; float c=cos(vP.y), s=sin(vP.y);',
      '  p=vec2(c*p.x-s*p.y, s*p.x+c*p.y); p.y/=vP.z;',
      '  if(abs(p.x)>0.5||abs(p.y)>0.5) discard;',
      '  float col=floor(mod(vP.x+0.5,4.0)), row=floor((vP.x+0.5)/4.0);',
      '  vec2 uv=(vec2(col,row)+p+0.5)/4.0; uv.y=1.0-uv.y;',
      '  gl_FragColor=vec4(texture2D(uAtlas,uv).rgb*vC,1.0); }'].join('\n')
  });
  const pts=new THREE.Points(geo,mat); pts.frustumCulled=false; scene.add(pts);
  COSMO.web=pts;
}
// Yorliqlar (HTML) — faqat mos miqyosda ko'rinadi
const cosmoLayer=document.createElement('div');
cosmoLayer.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:4;overflow:hidden';
canvas.insertAdjacentElement('afterend', cosmoLayer);
const COSMO_LABEL_DEFS = [
  { key:'sun', a:3500, b:3e6, name:{uz:'Quyosh tizimi',ru:'Солнечная система',en:'Solar System'}, sub:{uz:'siz shu yerdasiz',ru:'вы здесь',en:'you are here'} },
  { key:'mw',  a:3e4,  b:4e7, name:{uz:"Somon yo'li",ru:'Млечный Путь',en:'Milky Way'}, sub:{uz:"diametri ~100 000 yorug'lik yili",ru:'диаметр ~100 000 св. лет',en:'~100,000 light-years across'} },
  { key:'lmc', a:5e4,  b:2e6, name:{uz:'Katta Magellan buluti',ru:'Большое Магелланово Облако',en:'Large Magellanic Cloud'}, sub:{uz:"163 ming yorug'lik yili",ru:'163 тыс. св. лет',en:'163,000 light-years'} },
  { key:'smc', a:5e4,  b:2e6, name:{uz:'Kichik Magellan buluti',ru:'Малое Магелланово Облако',en:'Small Magellanic Cloud'}, sub:{uz:"200 ming yorug'lik yili",ru:'200 тыс. св. лет',en:'200,000 light-years'} },
  { key:'m31', a:4e5,  b:3e7, name:{uz:'Andromeda (M31)',ru:'Андромеда (M31)',en:'Andromeda (M31)'}, sub:{uz:"2,5 mln yorug'lik yili",ru:'2,5 млн св. лет',en:'2.5 million light-years'} },
  { key:'m33', a:8e5,  b:3e7, name:{uz:'Uchburchak (M33)',ru:'Треугольник (M33)',en:'Triangulum (M33)'}, sub:{uz:"2,7 mln yorug'lik yili",ru:'2,7 млн св. лет',en:'2.7 million light-years'} },
  { key:'lg',  a:7e6,  b:9e7, name:{uz:'Mahalliy guruh',ru:'Местная группа',en:'Local Group'}, sub:{uz:"80 dan ortiq galaktika",ru:'более 80 галактик',en:'80+ galaxies'} },
];
COSMO.pos.sun=new THREE.Vector3();
COSMO_LABEL_DEFS.forEach(def=>{
  const el=document.createElement('div');
  el.style.cssText='position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;gap:2px;opacity:0;white-space:nowrap;color:rgba(234,240,255,0.94);text-shadow:0 1px 8px rgba(0,0,0,0.9);will-change:transform';
  const nm=document.createElement('div'); nm.style.cssText='font-size:12.5px;font-weight:600;letter-spacing:0.05em';
  const sb=document.createElement('div'); sb.style.cssText='font-size:10.5px;opacity:0.7;letter-spacing:0.03em';
  const tk=document.createElement('div'); tk.style.cssText='width:1px;height:14px;margin-top:3px;background:linear-gradient(rgba(234,240,255,0.7),rgba(234,240,255,0))';
  el.append(nm,sb,tk); cosmoLayer.appendChild(el);
  COSMO.labels.push({ def, el, nm, sb, op:-1 });
});
// Qurilish — birinchi kadrni kechiktirmaslik uchun bosqichma-bosqich (bir necha kadrdan keyin)
COSMO.frames=0; COSMO.started=false;
COSMO.build=function(){ if(COSMO.started) return; COSMO.started=true;
  const mwC=GAL_GC.clone().multiplyScalar(26000*LY);
  const steps=[
    ()=>{ COSMO.mw=buildGalaxy({ R:52000*LY, n:90000, arms:4, pitch:0.4, armW:0.085, rs:0.32, rb:0.11, bar:0.23, barA:0.45,
            thick:0.012, fb:0.14, fbar:0.06, seed:3.1, gain:1.3, tex:768, phase:1.2, maxPx:4, n0:300, n1:2500, pn0:3000, pn1:20000,
            normal:GAL_NGP, pos:mwC }); COSMO.pos.mw=mwC; },
    ()=>{ const los=radecToVector(0.7123,41.269,1).normalize(), p=los.clone().multiplyScalar(2.54e6*LY);
          buildGalaxy({ R:110000*LY, n:70000, arms:2, pitch:0.3, armW:0.075, rs:0.3, rb:0.13, thick:0.015, fb:0.2, seed:7.7, gain:1.3,
            tex:768, phase:0.4, n0:2000, n1:15000, pn0:5000, pn1:40000, normal:incNormal(los,77,38), pos:p }); COSMO.pos.m31=p; },
    ()=>{ const los=radecToVector(1.5641,30.66,1).normalize(), p=los.clone().multiplyScalar(2.73e6*LY);
          buildGalaxy({ R:30000*LY, n:26000, arms:2, pitch:0.55, armW:0.1, rs:0.35, rb:0.05, thick:0.02, fb:0.04, seed:12.9, gain:1.4,
            tex:512, phase:2.1, n0:600, n1:5000, pn0:2000, pn1:12000, normal:incNormal(los,55,23), pos:p }); COSMO.pos.m33=p; },
    ()=>{ const l1=radecToVector(5.3929,-69.756,1).normalize(), p1=l1.clone().multiplyScalar(1.63e5*LY);
          buildGalaxy({ type:'irr', R:9000, n:14000, n0:200, n1:1500, normal:incNormal(l1,35,170), pos:p1 }); COSMO.pos.lmc=p1;
          const l2=radecToVector(0.8775,-72.83,1).normalize(), p2=l2.clone().multiplyScalar(2.03e5*LY);
          buildGalaxy({ type:'irr', R:5000, n:7000, n0:120, n1:900, normal:incNormal(l2,60,45), pos:p2 }); COSMO.pos.smc=p2; },
    ()=>{ buildCosmicWeb(); COSMO.pos.lg=COSMO.pos.mw.clone().lerp(COSMO.pos.m31,0.5); },
  ];
  let i=0;
  // MessageChannel orqali navbat — fon tabida ham setTimeout kabi sekinlashmaydi
  const ch=new MessageChannel();
  const next=()=>{ if(i>=steps.length) return; try{ steps[i++](); }catch(e){ console.error('cosmos', e); } ch.port2.postMessage(0); };
  ch.port1.onmessage=next; next();
};
setTimeout(COSMO.build, 800);

function cosmicStep(dt){
  if(!COSMO.started && ++COSMO.frames>20) COSMO.build();
  const camD=camera.position.length(); COSMO.camD=camD;
  const tD=camera.position.distanceTo(controls.target);
  const nr=Math.max(0.1, tD*0.0006);
  if(Math.abs(nr-camera.near)/camera.near>0.08){ camera.near=nr; camera.updateProjectionMatrix(); }
  controls.zoomSpeed = 0.9 + 2.0*Math.min(1, Math.max(0, Math.log10(Math.max(tD,1)/2500)/3));
  PX_SCALE.value = renderer.domElement.height/(2*Math.tan(camera.fov*Math.PI/360));
  skyRoot.position.copy(camera.position).multiplyScalar(sstep(1200,3000,camD));
  const sf=1-sstep(2600,14000,camD); COSMO.skyFade=sf;
  skyRoot.visible = sf>0.004;
  for(let i=0;i<SKY_FADE_MATS.length;i++){ const m=SKY_FADE_MATS[i]; m.opacity=m.userData.skyBase*sf; }
  starsNear.material.opacity*=sf;
  dust.visible = sf>0.004;
  mwBand.material.uniforms.uOpacity.value=0.3*sf;
  const mf=sstep(2200,16000,camD); COSMO.mwFade=mf;
  if(COSMO.mw){ const g=COSMO.mw; g.grp.visible=mf>0.003;
    g.pts.material.uniforms.uOpacity.value=mf; g.glow.material.uniforms.uOpacity.value=0.85*mf; g.dust.material.uniforms.uOpacity.value=0.85*mf; }
  // Kichrayib qolgan galaktikalar biroz yorqinroq — nuqtaga aylanib yo'qolib ketmasin
  if(COSMO.gals) COSMO.gals.forEach(g=>{ const pr=g.R*PX_SCALE.value/Math.max(1,camera.position.distanceTo(g.grp.position)), b=1+2.2*(1-sstep(8,100,pr));
    if(g.glow) g.glow.material.uniforms.uBoost.value=b; if(g.sprite) g.sprite.material.opacity=0.2*b; });
  sunMarker.material.opacity = sstep(3500,9000,camD)*(1-sstep(1.5e6,6e6,camD))*(0.8+0.2*Math.sin(clock.elapsedTime*3));
  // yorliqlar
  const langCh = COSMO.lang!==LANG; COSMO.lang=LANG;
  const W=window.innerWidth, H=window.innerHeight, v=new THREE.Vector3();
  COSMO.labels.forEach(L=>{
    const d=L.def, p=COSMO.pos[d.key];
    if(langCh){ L.nm.textContent=d.name[LANG]||d.name.uz; L.sb.textContent=d.sub?(d.sub[LANG]||d.sub.uz):''; }
    let op=0;
    if(p){ op=sstep(d.a,d.a*2,camD)*(1-sstep(d.b*0.5,d.b,camD));
      if(op>0.01){ v.copy(p).project(camera);
        if(v.z>=1||Math.abs(v.x)>1.1||Math.abs(v.y)>1.1) op=0;
        else L.el.style.transform='translate('+((v.x*0.5+0.5)*W)+'px,'+((-v.y*0.5+0.5)*H)+'px) translate(-50%,-100%)'; } }
    if(Math.abs(op-L.op)>0.02){ L.op=op; L.el.style.opacity=op.toFixed(2); }
  });
}

// Kometa: yadro aylanishi, koma faolligi, ion va chang dumlari
function cometStep(c, sdt, dt){
  c.t += sdt*c.speed;
  const x=Math.cos(c.t)*c.ra, z=Math.sin(c.t)*c.rb, y=Math.sin(c.t)*c.inc*60;
  if(dt>0) c.vel.set(x-c.g.position.x, y-c.g.position.y, z-c.g.position.z).divideScalar(dt);
  c.g.position.set(x,y,z);
  c.head.rotation.y += dt*0.3; c.head.rotation.x += dt*0.11;
  const r=Math.max(30, Math.hypot(x,y,z)), act=Math.min(1.5, Math.pow(150/r,1.7));
  const ax=x/r, ay=y/r, az=z/r;
  const cs=8+12*act; c.coma.scale.set(cs,cs,1); c.coma.material.opacity=0.22+0.4*act;
  c.acc += dt*230*(0.15+act);
  const P=c.P, N=P.length;
  while(c.acc>=1){
    c.acc-=1;
    const p=P[c.next]; c.next=(c.next+1)%N;
    p.ion=Math.random()<0.5; p.age=0; p.life=p.ion?1.6+Math.random()*1.2:3+Math.random()*2.5;
    p.x=x+(Math.random()-0.5)*0.8; p.y=y+(Math.random()-0.5)*0.8; p.z=z+(Math.random()-0.5)*0.8;
    const sp=p.ion?22+Math.random()*8:4+Math.random()*3, inh=p.ion?0:0.9, jt=p.ion?0.6:1.1;
    p.vx=ax*sp+c.vel.x*inh+gRand()*jt; p.vy=ay*sp+c.vel.y*inh+gRand()*jt; p.vz=az*sp+c.vel.z*inh+gRand()*jt;
  }
  const pa=c.pts.geometry.attributes.position.array, ca=c.pts.geometry.attributes.aColor.array, sa=c.pts.geometry.attributes.aSize.array;
  const vis=0.35+0.65*Math.min(1,act*1.3);
  for(let i=0;i<N;i++){
    const p=P[i], o=i*3;
    if(p.age>=p.life){ ca[o]=ca[o+1]=ca[o+2]=0; sa[i]=0; continue; }
    p.age+=dt;
    if(!p.ion){ const rr=Math.hypot(p.x,p.y,p.z)||1, f=6*dt/rr; p.vx+=p.x*f; p.vy+=p.y*f; p.vz+=p.z*f; }  // radiatsiya bosimi
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.z+=p.vz*dt;
    const t=p.age/p.life, f=Math.min(1,t*8)*(1-t)*(1-t)*vis;
    if(p.ion){ ca[o]=0.35*f*0.9; ca[o+1]=0.62*f*0.9; ca[o+2]=f*0.9; sa[i]=1.2+t*2.5; }
    else { ca[o]=f*0.7; ca[o+1]=0.86*f*0.7; ca[o+2]=0.62*f*0.7; sa[i]=1.6+t*4.5; }
    pa[o]=p.x; pa[o+1]=p.y; pa[o+2]=p.z;
  }
  c.pts.geometry.attributes.position.needsUpdate=true;
  c.pts.geometry.attributes.aColor.needsUpdate=true;
  c.pts.geometry.attributes.aSize.needsUpdate=true;
}

/* --------------------------------------------------------------------------
   8. KAMERA — sayyoraga silliq «uchib borish»
   -------------------------------------------------------------------------- */
let flight = null;          // joriy uchish animatsiyasi
let focusRec = null;        // diqqat markazidagi sayyora
let eclipseStage = 0;       // 0=yo'q, 2=to'liq tutilish, 3=olmos uzuk
let eclipseT = 0;           // bosqich boshidan o'tgan vaqt (silliq kirish)
const eclipseFromCam = new THREE.Vector3(), eclipseFromTgt = new THREE.Vector3();
const tmpV = new THREE.Vector3();
const focusPrev = new THREE.Vector3();   // fokusdagi sayyoraning oldingi pozitsiyasi
const focusQPrev = new THREE.Quaternion(), _fq = new THREE.Quaternion(), _fdq = new THREE.Quaternion();
const focusTgt = { off:new THREE.Vector3(), goal:new THREE.Vector3(), panel:false };   // aylanuvchi apparat uchun barqaror target ofseti
function followRotDelta(obj){ obj.getWorldQuaternion(_fq); _fdq.copy(focusQPrev).invert().premultiply(_fq); focusQPrev.copy(_fq); return _fdq; }

function easeInOut(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }

// Panel ochiq bo‘lganda sayyora ekran o‘rtasida emas, yon (yoki tepa) tarafga suriladi
function focusTarget(planetPos){
  const out = planetPos.clone();
  const dist = camera.position.distanceTo(planetPos);
  const fwd = new THREE.Vector3(); camera.getWorldDirection(fwd);
  const rightV = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
  const upV = new THREE.Vector3().crossVectors(rightV, fwd).normalize();
  // Hunt o'yinida karta TEPADA → sayyorani pastroqqa suramiz (target yuqoriga)
  if(typeof huntActive!=='undefined' && huntActive){
    out.addScaledVector(upV, dist*0.22);
    return out;
  }
  if(!panel.classList.contains('open')) return out;
  if(window.innerWidth <= 680){
    // mobil: panel pastda → sayyorani yuqoriroqqa (target pastga)
    out.addScaledVector(upV, -dist*0.26);
  } else {
    // desktop: panel o‘ngda → sayyorani chaproqqa (target o‘ngga)
    out.addScaledVector(rightV, dist*0.34);
  }
  return out;
}

function flyTo(rec){
  // Sayyoraga nisbatan BARQAROR ofset — kamera faqat shu sayyoraga yaqinlashadi,
  // Quyoshga intilmaydi va sayyora bilan birga harakatlanadi.
  const planetPos = new THREE.Vector3(); rec.mesh.getWorldPosition(planetPos);
  const radius = rec.radius || SUN_RADIUS;
  const vd = rec.mesh.userData && rec.mesh.userData.viewDist;
  const dist = vd || (radius*5 + 8);
  const dir = new THREE.Vector3().subVectors(camera.position, planetPos).normalize();
  const vo = rec.mesh.userData && rec.mesh.userData.viewOffset;
  const offset = vo ? vo() : dir.multiplyScalar(dist); if(!vo) offset.y += vd ? vd*0.35 : radius*1.5;
  if(rec.mesh.userData && rec.mesh.userData.followRot) rec.mesh.getWorldQuaternion(focusQPrev);
  flight = { fromCam: camera.position.clone(), fromTgt: controls.target.clone(),
    offset, rec, t:0, dur:1.8 };
  focusRec = null;
}

function flyToOverview(){
  flight = {
    fromCam: camera.position.clone(), toCamFixed: new THREE.Vector3(0,90,320),
    fromTgt: controls.target.clone(), toTgtFixed: new THREE.Vector3(0,0,0),
    rec:null, t:0, dur:1.8
  };
  focusRec = null;
  closePanel();
  setActiveDock(null);
  if(typeof hideTourCaption==='function') hideTourCaption();
}

/* --------------------------------------------------------------------------
   9. RAYCASTING — bosishni aniqlash
   -------------------------------------------------------------------------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downXY = null;

renderer.domElement.addEventListener('pointerdown', e=>{ downXY=[e.clientX,e.clientY]; });
renderer.domElement.addEventListener('pointerup', e=>{
  if(!downXY) return;
  const moved = Math.hypot(e.clientX-downXY[0], e.clientY-downXY[1]);
  downXY=null;
    if(moved>6) return; // bu drag edi, bosish emas
  if(typeof lsActive!=='undefined' && lsActive) return;   // demo paytida tanlash o'chiq
  pointer.x = (e.clientX/window.innerWidth)*2-1;
  pointer.y = -(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([sun, ...planetMeshes], false);
  const xh = (typeof PICKABLES!=='undefined' && !(typeof huntActive!=='undefined' && huntActive)) ? raycaster.intersectObjects(PICKABLES, false) : [];
  if(xh.length && (!hits.length || xh[0].distance < hits[0].distance)){ playClick(880); pickSelect(xh[0].object.userData.pickOf); return; }
  if(hits.length){
    const obj = hits[0].object;
    // "Sayyorani top" o'yini faol — javob alohida kartadagi variantlar orqali beriladi
    if(huntActive){ return; }
    playClick(880);
    if(tourActive) stopTour(false);   // qo‘lda bosilsa tur to‘xtaydi
    if(obj===sun){ selectBody(sun.userData); flightToSun(); }
    else {
      const rec = orbitObjects.find(r=>r.mesh===obj);
      if(rec){ selectBody(rec); flyTo(rec); }
    }
  }
});

function flightToSun(){
  const offset = new THREE.Vector3(0, SUN_RADIUS*2, SUN_RADIUS*6);
  flight={ fromCam:camera.position.clone(), fromTgt:controls.target.clone(),
    offset, rec:'sun', t:0, dur:1.8 };
  focusRec=null;
}

/* --------------------------------------------------------------------------
   10. UI — ma'lumot paneli, dock, tugmalar
   -------------------------------------------------------------------------- */
const panel = document.getElementById('panel');
const elName = document.getElementById('panelName');
const elType = document.getElementById('panelType');
const elDesc = document.getElementById('panelDesc');
const elStats= document.getElementById('panelStats');
const elFact = document.getElementById('panelFact');

const elActions = document.getElementById('panelActions');
const elFactLabel = document.getElementById('factLabel');

function compBars(comp){
  const colors=['#4ea8ff','#a06bff','#42d6c4','#ffb347','#ff6b9d'];
  return comp.map((c,i)=>`<div class="comp-row">
    <div class="comp-top"><span>${c[0]}</span><span>${c[1]}%</span></div>
    <div class="comp-bar"><i style="width:${Math.min(c[1],100)}%;background:${colors[i%colors.length]}"></i></div>
  </div>`).join('');
}
function mkBtn(label, cls, fn){
  const b=document.createElement('button'); b.className='pbtn '+cls; b.textContent=label;
  b.addEventListener('click', fn); return b;
}
function buildPanelActions(rec, key){
  const ui = window.LOC[LANG].ui;
  elActions.innerHTML='';
  // Yaqindan ko‘rish
  elActions.appendChild(mkBtn(ui.focusBtn,'primary',()=>{
    playClick(760); key==='sun' ? flightToSun() : flyTo(rec);
  }));
  // Kontekstli: halqalar (Saturn/Uran) — bilan / halqalarsiz
  if(rec && rec.extras && rec.extras.ring){
    const on = rec.extras.ring.visible;
    elActions.appendChild(mkBtn(on?ui.ringsOff:ui.ringsOn,'',()=>{
      rec.extras.ring.visible = !rec.extras.ring.visible; playClick(640); buildPanelActions(rec,key);
    }));
  }
  if(rec && rec.extras && rec.extras.moons){
    const on = rec.extras.moons[0].pivot.visible;
    elActions.appendChild(mkBtn(on?ui.moonsOff:ui.moonsOn,'',()=>{
      rec.extras.moons.forEach(m=>{ m.pivot.visible=!on; }); playClick(640); buildPanelActions(rec,key);
    }));
  }
  // Kontekstli: yo‘ldoshlar (Yer) — bilan / yo‘ldoshsiz
  if(rec && rec.extras && rec.extras.sats){
    const on = rec.extras.sats[0].pivot.visible;
    elActions.appendChild(mkBtn(on?ui.satsOff:ui.satsOn,'',()=>{
      rec.extras.sats.forEach(s=>{ s.pivot.visible=!on; }); playClick(640); buildPanelActions(rec,key);
    }));
  }
  // Umumiy ko‘rinish
  elActions.appendChild(mkBtn(ui.backBtn,'',()=>{ playClick(520); flyToOverview(); }));
  // Ichki tuzilish tugmasi — barcha sayyoralar va Quyosh uchun
  if(typeof STRUCT_GEO!=='undefined' && STRUCT_GEO[key]){
    elActions.appendChild(mkBtn(ui.structBtn,'',()=>{ playClick(760); openCut(key); }));
  }
}
function selectBody(rec){
  const isSun = !!rec.isSun || rec.key==='sun';
  const key = rec.key;
  lastSelectedKey = key;
  const d = bodyData(key); const ui = window.LOC[LANG].ui;
  elType.textContent = d.type;
  elName.textContent = d.name;
  elDesc.textContent = d.desc;
  renderPhotos(key);
  elStats.innerHTML = `
    <div class="sec-title">${ui.secMain}</div>
    <div class="stats-grid">
      <div class="stat"><div class="k">${ui.lDist}</div><div class="v">${d.dist}</div></div>
      <div class="stat"><div class="k">${ui.lDia}</div><div class="v">${d.dia}</div></div>
      <div class="stat"><div class="k">${ui.lMass}</div><div class="v">${d.mass}</div></div>
      <div class="stat"><div class="k">${ui.lMoons}</div><div class="v">${d.moons}</div></div>
    </div>
    <div class="sec-title">${ui.secPhys}</div>
    <div class="stats-grid">
      <div class="stat"><div class="k">${ui.lPeriod}</div><div class="v">${d.period}</div></div>
      <div class="stat"><div class="k">${ui.lDay}</div><div class="v">${d.day}</div></div>
      <div class="stat"><div class="k">${ui.lGravity}</div><div class="v">${d.gravity}</div></div>
      <div class="stat"><div class="k">${ui.lEscape}</div><div class="v">${d.escape}</div></div>
      <div class="stat"><div class="k">${ui.lVelocity}</div><div class="v">${d.velocity}</div></div>
      <div class="stat"><div class="k">${ui.lDensity}</div><div class="v">${d.density}</div></div>
      <div class="stat"><div class="k">${ui.lTilt}</div><div class="v">${d.tilt}</div></div>
      <div class="stat"><div class="k">${ui.lTemp}</div><div class="v">${d.temp}</div></div>
      <div class="stat wide"><div class="k">${ui.lDiscovered}</div><div class="v">${d.discovered}</div></div>
    </div>
    <div class="sec-title">${ui.secComp}</div>
    <div class="comp">${compBars(d.comp)}</div>
  `;
  elFactLabel.textContent = ui.factLabel;
  elFact.textContent = d.fact;
  // Real vaqt rejimida: bugungi geliotsentrik uzunlama + zodiak yo‘nalishi
  if(typeof realTimeMode!=='undefined' && realTimeMode && typeof KEPLER!=='undefined' && KEPLER[key]){
    const lam = heliocentricLongitude(key, rtDate);
    const deg = Math.round(norm360(lam*180/Math.PI));
    elStats.innerHTML += `
    <div class="sec-title">${ui.rtState} — ${rtFmtDate(rtDate)}</div>
    <div class="stats-grid">
      <div class="stat"><div class="k">${ui.rtLon}</div><div class="v">λ = ${deg}°</div></div>
      <div class="stat"><div class="k">${ui.rtDir}</div><div class="v">${rtZodiacName(lam)}</div></div>
    </div>`;
  }
  buildPanelActions(isSun ? null : rec, key);
  panel.classList.add('open');
  setActiveDock(key);
}
function closePanel(){ panel.classList.remove('open'); if(typeof SHW!=='undefined' && SHW.key) stopShower(); }
document.getElementById('panelClose').addEventListener('click', ()=>{ playClick(440); closePanel(); setActiveDock(null); });
document.getElementById('resetBtn').addEventListener('click', ()=>{ playClick(520); if(tourActive) stopTour(false); flyToOverview(); });

// --- Portfolio ichki oynasi: ilovadan chiqmasdan ochish va qaytish ---
const pfView = document.getElementById('portfolioView');
const pfFrame = document.getElementById('portfolioFrame');
const PF_URL = 'https://najmiddinovanihona-hub.github.io/portfolio.html/';
function openPortfolio(e){
  e.preventDefault();
  if(!pfFrame.src) pfFrame.src = PF_URL;   // birinchi ochilishda yuklanadi
  pfView.classList.remove('hidden');
}
document.getElementById('introAuthor').addEventListener('click', openPortfolio);
document.getElementById('credit').addEventListener('click', openPortfolio);
document.getElementById('portfolioBack').addEventListener('click', ()=>{ playClick(440); pfView.classList.add('hidden'); });

// Pastki dock — Quyosh + sayyoralar (tilga qarab qayta quriladi)
const dock = document.getElementById('dock');
function mkDockItem(label, color, onClick, key){
  const b=document.createElement('button');
  b.className='dock-item'; b.dataset.key=key;
  b.innerHTML=`<span class="dock-swatch" style="background:${color};color:${color}"></span>${label}`;
  b.addEventListener('click', onClick);
  dock.appendChild(b);
}
function buildDock(){
  dock.innerHTML='';
  mkDockItem(bodyData('sun').name, '#ffb347', ()=>{ if(tourActive) stopTour(false); playClick(880); selectBody(sun.userData); flightToSun(); }, 'sun');
  orbitObjects.forEach(rec=>{
    const hex = '#'+new THREE.Color(rec.color).getHexString();
    mkDockItem(bodyData(rec.key).name, hex, ()=>{ if(tourActive) stopTour(false); playClick(880); selectBody(rec); flyTo(rec); }, rec.key);
  });
  setActiveDock(lastSelectedKey);
}
function setActiveDock(key){
  dock.querySelectorAll('.dock-item').forEach(el=>{
    el.classList.toggle('active', el.dataset.key===key);
  });
}

/* --------------------------------------------------------------------------
   10a. HAQIQIY SURATLAR — panel galereyasi va to'liq ekran ko'rish
   Suratlar loyiha ichida (photos/) — tashqi havolalar uzilsa ham ishlaydi.
   -------------------------------------------------------------------------- */
const PHOTO_BASE = window.PHOTO_BASE || '';
const PH_T = {
  uz:{ title:'Haqiqiy suratlar', by:'Muallif', src:'manba' },
  ru:{ title:'Реальные снимки', by:'Автор', src:'источник' },
  en:{ title:'Real photos', by:'Credit', src:'source' }
};
const phEsc = s => String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const elPhotos = document.getElementById('panelPhotos');
function phRetry(img, base, done){
  const n = (+img.dataset.try||0)+1; img.dataset.try = n;
  if(n>5){ done && done(false); return; }
  setTimeout(()=>{ img.src = base + (base.includes('?')?'&':'?') + 'r=' + n + '_' + Date.now(); }, 400*n + Math.random()*400);
}
document.addEventListener('error', e=>{
  const im=e.target; if(!(im instanceof HTMLImageElement) || im.id==='phImg') return;
  const s=im.getAttribute('src')||''; if(!/photos\//.test(s)) return;
  phRetry(im, s.split('?')[0]);
}, true);
let phList = [], phIdx = 0, phBoxIdx = 0;
function phCredit(p){ const t=PH_T[LANG]||PH_T.uz;
  return `${t.by}: ${phEsc(p.by)} · ${phEsc(p.lic)}` + (p.page?` · <a href="${phEsc(p.page)}" target="_blank" rel="noopener">${t.src} ↗</a>`:''); }
function renderPhotos(key){
  if(!elPhotos) return;
  const list = (window.REAL_PHOTOS||{})[key];
  if(!list || !list.length){ elPhotos.innerHTML=''; return; }
  phList = list; phIdx = 0;
  const t = PH_T[LANG]||PH_T.uz;
  elPhotos.innerHTML = `<div class="sec-title">${t.title}</div>
    <div class="ph-main" id="phMain"><img id="phImg" alt="" decoding="async" /><span class="ph-zoom">⤢</span></div>
    <p class="ph-cap" id="phCap"></p><p class="ph-by" id="phBy"></p>
    <div class="ph-thumbs">${list.map((p,i)=>`<button class="ph-thumb${i?'':' on'}" data-i="${i}" aria-label="${phEsc(p[LANG]||p.uz)}"><img src="${phEsc(PHOTO_BASE+p.src)}" alt="" loading="lazy" decoding="async" /></button>`).join('')}</div>`;
  elPhotos.querySelectorAll('.ph-thumb').forEach(b=>b.addEventListener('click',()=>{ playClick(720); showPhoto(+b.dataset.i); }));
  document.getElementById('phMain').addEventListener('click',()=>{ playClick(620); openPhotoBox(phIdx); });
  showPhoto(0);
}
function showPhoto(i){
  phIdx = i; const p = phList[i]; if(!p) return;
  const img = document.getElementById('phImg');
  img.classList.add('loading');
  img.onload = ()=>img.classList.remove('loading');
  const base = PHOTO_BASE + p.src; img.dataset.try = 0;
  img.onerror = ()=>{ if(phList[phIdx]!==p) return; phRetry(img, base, ()=>{ img.classList.remove('loading'); img.style.opacity='0.25'; }); };
  img.style.opacity = '';
  img.src = base; img.alt = p[LANG]||p.uz;
  document.getElementById('phCap').textContent = p[LANG]||p.uz;
  document.getElementById('phBy').innerHTML = phCredit(p);
  elPhotos.querySelectorAll('.ph-thumb').forEach((b,k)=>b.classList.toggle('on', k===i));
}
const phBox = document.getElementById('phBox');
function phBoxRender(){
  const p = phList[phBoxIdx]; if(!p) return;
  const img = document.getElementById('phBoxImg');
  img.src = PHOTO_BASE + p.src; img.alt = p[LANG]||p.uz;
  document.getElementById('phBoxCount').textContent = (phBoxIdx+1)+' / '+phList.length;
  document.getElementById('phBoxCap').textContent = p[LANG]||p.uz;
  document.getElementById('phBoxBy').innerHTML = phCredit(p);
}
function openPhotoBox(i){ if(!phBox) return; phBoxIdx=i; phBoxRender(); phBox.classList.add('open'); phBox.setAttribute('aria-hidden','false'); }
function closePhotoBox(){ phBox.classList.remove('open'); phBox.setAttribute('aria-hidden','true'); }
function phStep(d){ phBoxIdx=(phBoxIdx+d+phList.length)%phList.length; phBoxRender(); showPhoto(phBoxIdx); playClick(700); }
if(phBox){
  document.getElementById('phClose').addEventListener('click', ()=>{ playClick(440); closePhotoBox(); });
  document.getElementById('phPrev').addEventListener('click', e=>{ e.stopPropagation(); phStep(-1); });
  document.getElementById('phNext').addEventListener('click', e=>{ e.stopPropagation(); phStep(1); });
  phBox.addEventListener('click', e=>{ if(e.target===phBox) closePhotoBox(); });
  window.addEventListener('keydown', e=>{
    if(!phBox.classList.contains('open')) return;
    if(e.key==='Escape') closePhotoBox(); else if(e.key==='ArrowLeft') phStep(-1); else if(e.key==='ArrowRight') phStep(1);
  });
}

/* --------------------------------------------------------------------------
   10a2. TUGMA EFFEKTI — kursor tekkanda moviy nur va atrofga sochiladigan moviy zarralar
   -------------------------------------------------------------------------- */
(function(){
  const cv=document.createElement('canvas'); cv.id='fxCanvas'; document.body.appendChild(cv);
  const ctx=cv.getContext('2d'); let W=0,H=0,dpr=1;
  function rs(){ dpr=1; W=window.innerWidth; H=window.innerHeight;
    cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px'; }
  rs(); window.addEventListener('resize', rs);
  const SEL='button, .dock-item, a.author-link, .pf-ext, [role="button"]';
  const P=[]; let hot=null, raf=0, acc=0, last=0;
  function spawn(el, n){
    const r=el.getBoundingClientRect(); if(!r.width||!r.height) return;
    const per=2*(r.width+r.height);
    for(let i=0;i<n;i++){
      const t=Math.random()*per; let x,y,nx,ny;
      if(t<r.width){ x=r.left+t; y=r.top; nx=0; ny=-1; }
      else if(t<r.width+r.height){ x=r.right; y=r.top+(t-r.width); nx=1; ny=0; }
      else if(t<2*r.width+r.height){ x=r.right-(t-r.width-r.height); y=r.bottom; nx=0; ny=1; }
      else { x=r.left; y=r.bottom-(t-2*r.width-r.height); nx=-1; ny=0; }
      const sp=16+Math.random()*44;
      P.push({ x, y, vx:nx*sp+(Math.random()-0.5)*24, vy:ny*sp+(Math.random()-0.5)*24-8,
        life:0, max:0.55+Math.random()*0.75, s:0.9+Math.random()*2.1, h:192+Math.random()*26 });
    }
    if(P.length>420) P.splice(0, P.length-420);
    if(!raf){ last=performance.now(); raf=requestAnimationFrame(tick); }
  }
  function tick(now){
    const dt=Math.min(0.05,(now-last)/1000); last=now;
    if(hot && !document.body.contains(hot)){ hot=null; }
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter';
    for(let i=P.length-1;i>=0;i--){
      const p=P[i]; p.life+=dt; if(p.life>=p.max){ P.splice(i,1); continue; }
      p.vx*=0.955; p.vy*=0.955; p.vy-=dt*10; p.x+=p.vx*dt; p.y+=p.vy*dt;
      const a=1-p.life/p.max, R=p.s*4*(1+(1-a)*0.5);
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R);
      g.addColorStop(0,'hsla('+p.h+',100%,88%,'+a+')');
      g.addColorStop(0.3,'hsla('+p.h+',100%,64%,'+(a*0.55)+')');
      g.addColorStop(1,'hsla('+p.h+',100%,55%,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,R,0,TAU); ctx.fill();
    }
    if(P.length||hot) raf=requestAnimationFrame(tick); else { raf=0; ctx.clearRect(0,0,W,H); }
  }
  const find=t=>(t && t.closest) ? t.closest(SEL) : null;
  document.addEventListener('pointerover', e=>{
    if(e.pointerType==='touch') return;
    const el=find(e.target); if(!el || el===hot || el.disabled) return;
    if(hot) hot.classList.remove('fx-glow');
    hot=el; el.classList.add('fx-glow');
  });
  document.addEventListener('pointerout', e=>{
    if(!hot) return; const to=e.relatedTarget;
    if(to && hot.contains(to)) return;
    if(find(e.target)!==hot) return;
    hot.classList.remove('fx-glow'); hot=null;
  });
  document.addEventListener('pointerdown', e=>{
    const el=find(e.target); if(!el) return;
    el.classList.remove('fx-press'); void el.offsetWidth; el.classList.add('fx-press'); setTimeout(()=>el.classList.remove('fx-press'),520);
    if(e.pointerType==='touch'){ el.classList.add('fx-glow'); setTimeout(()=>{ if(el!==hot) el.classList.remove('fx-glow'); }, 480); }
  }, true);
})();

/* --------------------------------------------------------------------------
   10b. TIL ALMASHTIRGICH (UZ / RU / EN)
   -------------------------------------------------------------------------- */
window.applyLanguage=(l)=>applyLanguage(l);   // Darslik ekranidagi til tugmasi uchun
function applyLanguage(lang){
  if(lang==='uz' && typeof narrateStop==='function') narrateStop();
  LANG = lang; localStorage.setItem('solar_lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = tUI(el.getAttribute('data-i18n'));
  });
  document.getElementById('resetBtn').title = tUI('backBtn');
  const pfB = document.getElementById('pfBackLabel');
  if(pfB) pfB.textContent = LANG==='ru' ? 'Назад' : (LANG==='en' ? 'Back' : 'Orqaga');
  const csl = document.getElementById('cutSliderLbl');
  if(csl) csl.textContent = LANG==='ru' ? 'Собрано ⟷ Раскрыто' : (LANG==='en' ? 'Nested ⟷ Exploded' : 'Yig‘ilgan ⟷ Ochilgan');
  if(speedEl) speedEl.title = tUI('speedTitle');
  elFactLabel.textContent = tUI('factLabel');
  const cl=document.getElementById('creditLabel'); if(cl) cl.textContent = tUI('authorLabel');
  const qb=document.getElementById('quizBtn2'); if(qb) qb.title = tUI('quizBtn');
  const rtb=document.getElementById('rtBtn'); if(rtb) rtb.title = tUI('rtBtn');
  const lsb=document.getElementById('lsBtn'); if(lsb) lsb.title = tUI('lsBtn');
  if(typeof lsActive!=='undefined' && lsActive) lsBuildHud();
  const rtt=document.getElementById('rtToday'); if(rtt) rtt.textContent = tUI('rtToday');
  const rtd=document.getElementById('rtDate'); if(rtd) rtd.title = tUI('rtDateLbl');
  if(typeof realTimeMode!=='undefined' && realTimeMode) rtSyncUI();
  // Ichki tuzilish oynasi ochiq bo‘lsa — yangi tilda qayta chiziladi
  if(typeof lastStructKey!=='undefined' && lastStructKey && structView.classList.contains('open')) openStruct(lastStructKey);
  // 3D kesim ochiq bo'lsa — yangi tilda qayta quriladi
  if(typeof cutActive!=='undefined' && cutActive && cutKey){ const ef=cutExplodeF; cutBuildModel(cutKey); cutExplodeF=ef; }
  // Kirish oynasi matnlari yangi tilda (startupda hali yuklanmagan bo'lishi mumkin)
  if(window.__authReady) authBuildUI();
  // Osmon to'ri yorliqlari yangi tilda
  if(typeof CON_ALL!=='undefined'){ CON_ALL.build(); const cb=document.getElementById('conBtn'); if(cb) cb.title=CON_BTN_T[LANG]||CON_BTN_T.uz; }
  if(typeof skyBuildPoleLabel==='function'){ skyBuildPoleLabel(); skyGridK=-1;
    const gb=document.getElementById('gridBtn'), gt=window.LOC[LANG].sky;
    if(gb&&gt) gb.title=gt.btn; }
  const scEl=document.getElementById('starCard'); if(scEl) scEl.classList.remove('on');
  // Ulug'bek moduli ochiq bo'lsa — matn va canvas yorliqlari qayta chiziladi
  if(typeof ubActive!=='undefined'){
    const ub=document.getElementById('ubBtn'), ut=window.LOC[LANG].ulugbek;
    if(ub&&ut) ub.title=ut.btn;
    if(ubActive) ubBuildUI();
  }
  // Fasllar rejimi ochiq bo'lsa — UI matnlari yangi tilda qayta quriladi
  if(typeof seasonsActive!=='undefined'){
    const sb=document.getElementById('seasonsBtn'), st=window.LOC[LANG].seasons;
    if(sb&&st) sb.title=st.btn;
    if(seasonsActive) snBuildUI();
  }
  // O'yin tanlash va hunt kartasi matnlari
  const gpt=document.getElementById('gamePickTitle'); if(gpt) gpt.textContent = tUI('huntPickTitle');
  const pc=document.getElementById('pickClassic'); if(pc) pc.textContent = tUI('huntClassic');
  const ph=document.getElementById('pickHunt'); if(ph) ph.textContent = tUI('huntGame');
  if(typeof huntActive!=='undefined' && huntActive && hList.length && hIdx<hList.length){
    renderHuntQ();
  }
  if(typeof updateTourBtn==='function') updateTourBtn();
  if(typeof cosmos!=='undefined' && cosmos.classList.contains('open')) showCosmos();
  if(typeof tourCaption!=='undefined' && tourCaption.classList.contains('show') && currentTourKey) showTourCaption(currentTourKey);
  buildDock();
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  // ochiq panelni yangi tilda qayta chizish
  if(panel.classList.contains('open') && lastSelectedKey){
    const r = lastSelectedKey==='sun' ? sun.userData : orbitObjects.find(o=>o.key===lastSelectedKey);
    if(r) selectBody(r);
  }
}
function buildLangSwitch(container){
  if(!container) return;
  container.innerHTML='';
  ['uz','ru','en'].forEach(lc=>{
    const b=document.createElement('button'); b.className='lang-btn'; b.dataset.lang=lc;
    b.textContent = window.LOC[lc].langName;
    b.addEventListener('click', ()=>{ playClick(700); applyLanguage(lc); });
    container.appendChild(b);
  });
}

/* --------------------------------------------------------------------------
   10c. SAYOHAT (avtomatik tur) + KOINOT FAKTLARI
   -------------------------------------------------------------------------- */
const tourBtn = document.getElementById('toursBtn');
const toursMenu = document.getElementById('toursMenu');
const cosmos  = document.getElementById('cosmos');
const tourCaption = document.getElementById('tourCaption');
const tcName = document.getElementById('tcName');
const tcText = document.getElementById('tcText');
let tourActive=false, tourTimer=null, tourIdx=0, currentTourKey=null, tourMode='planets';

function updateTourBtn(){
  // Menyu elementlarining nomi va faol holati
  const labels = { planets:'tourBtn', stars:'constBtn', objects:'objBtn', visual:'visualBtn', eclipse:'eclipseBtn', blackholes:'bhBtn' };
  toursMenu.querySelectorAll('.tour-item').forEach(item=>{
    const mode = item.dataset.tour;
    const on = tourActive && tourMode===mode;
    item.classList.toggle('active', on);
    item.querySelector('.ti-label').textContent = on ? tUI('tourStop') : tUI(labels[mode]);
  });
  tourBtn.classList.toggle('active', tourActive);
  tourBtn.title = tUI('toursBtn');
}
function showTourCaption(key){
  const L = window.LOC[LANG];
  currentTourKey = key;
  const cst = L.constellations && L.constellations[key];
  const obj = L.objects && L.objects[key];
  const vis = L.visual && L.visual[key];
  const ecl = L.eclipse && L.eclipse[key];
  const bh = L.blackholes && L.blackholes[key];
  if(cst){ tcName.textContent = cst.name; tcText.textContent = cst.text + skyBrightestLine(key); }
  else if(obj){ tcName.textContent = obj.name; tcText.textContent = obj.text; }
  else if(vis){ tcName.textContent = vis.name; tcText.textContent = vis.text; }
  else if(ecl){ tcName.textContent = ecl.name; tcText.textContent = ecl.text; }
  else if(bh){ tcName.textContent = bh.name; tcText.textContent = bh.text; }
  else { tcName.textContent = bodyData(key).name; tcText.textContent = (L.tour||{})[key] || ''; }
  tourCaption.classList.add('show');
  if(typeof narrate==='function') narrate(tcName.textContent+'. '+tcText.textContent);
}
function hideTourCaption(){ tourCaption.classList.remove('show'); if(typeof narrateStop==='function') narrateStop(); }

function tourStep(){
  if(!tourActive) return;
  let seq;
  if(tourMode==='stars') seq = CONSTELLATIONS.map(c=>({key:c.key, constel:c}));
  else if(tourMode==='objects') seq = [
    {key:'ceres', rec:EXTRA_BODIES.find(b=>b.key==='ceres')},
    {key:'vesta', rec:FAMOUS.vesta},
    {key:'eros', rec:FAMOUS.eros},
    {key:'bennu', rec:FAMOUS.bennu},
    {key:'chelyabinsk', rec:FAMOUS.chelyabinsk},
    {key:'pluto', rec:EXTRA_BODIES.find(b=>b.key==='pluto')},
    {key:'halley', rec:halleyRec},
    {key:'kuiper', kuiper:true},
  ];
  else if(tourMode==='blackholes') seq = [
    {key:'sagA', bh:BLACKHOLES.sagA},
    {key:'cygX1', bh:BLACKHOLES.cygX1},
  ];
  else if(tourMode==='eclipse') seq = [
    {key:'eclipseIntro', rec:orbitObjects.find(r=>r.key==='earth')},
    {key:'eclipseTotality', eclipse:2},
    {key:'eclipseRing', eclipse:3},
  ];
  else if(tourMode==='visual') seq = [
    {key:'sunview', fly:()=>{ flight={ fromCam:camera.position.clone(), toCamFixed:new THREE.Vector3(0, SUN_RADIUS*1.6, SUN_RADIUS*3.4),
      fromTgt:controls.target.clone(), toTgtFixed:new THREE.Vector3(0,0,0), rec:null, t:0, dur:2.2 }; focusRec=null; }},
    {key:'belt', fly:()=>{ flight={ fromCam:camera.position.clone(), toCamFixed:new THREE.Vector3(30, 22, 150),
      fromTgt:controls.target.clone(), toTgtFixed:new THREE.Vector3(85, 0, 40), rec:null, t:0, dur:2.2 }; focusRec=null; }},
    {key:'nebula', fly:()=>{ const dir=nebulaSprites[0].position.clone().normalize();
      flight={ fromCam:camera.position.clone(), toCamFixed:dir.clone().multiplyScalar(300),
      fromTgt:controls.target.clone(), toTgtFixed:dir.clone().multiplyScalar(1100), rec:null, t:0, dur:2.2 }; focusRec=null; }},
    {key:'galaxy', fly:()=>{ const dir=galaxySprites[0].position.clone().normalize();
      flight={ fromCam:camera.position.clone(), toCamFixed:dir.clone().multiplyScalar(320),
      fromTgt:controls.target.clone(), toTgtFixed:galaxySprites[0].position.clone(), rec:null, t:0, dur:2.2 }; focusRec=null; }},
    {key:'milkyway', fly:()=>{ const c=GAL_GC.clone().multiplyScalar(26000*LY);
      flight={ fromCam:camera.position.clone(), toCamFixed:c.clone().addScaledVector(GAL_GC,-80000).addScaledVector(GAL_NGP,95000),
      fromTgt:controls.target.clone(), toTgtFixed:c, rec:null, t:0, dur:3.6 }; focusRec=null; }},
  ];
  else seq = [{key:'sun',rec:null}, ...orbitObjects.map(r=>({key:r.key,rec:r}))];
  if(tourIdx >= seq.length){            // oxirida koinot faktlari
    tourActive=false; clearTimeout(tourTimer); updateTourBtn();
    hideTourCaption(); highlightConstellation(null); eclipseStage=0; showCosmos(tourMode);
    return;
  }
  const item = seq[tourIdx];
  // Sayohatda ma'lumot paneli emas — alohida hikoya matni ko‘rsatiladi
  if(tourMode==='stars'){
    highlightConstellation(item.key);
    flyToConstellation(item.constel);
  } else if(item.bh){
    eclipseStage = 0;
    flyToBlackHole(item.bh);
  } else if(item.eclipse){
    // Tutilish bosqichi — kamera har kadrda Yer-Oy-Quyosh chizig‘iga to‘g‘rilanadi
    eclipseStage = item.eclipse;
    eclipseT = 0;
    eclipseFromCam.copy(camera.position);
    eclipseFromTgt.copy(controls.target);
    flight = null; focusRec = null;
  } else if(item.fly){
    eclipseStage = 0;
    item.fly();
  } else if(item.kuiper){
    // Koyper kamari — tizimni chetdan ko‘rsatuvchi keng plan
    flight = { fromCam:camera.position.clone(), toCamFixed:new THREE.Vector3(0,150,470),
      fromTgt:controls.target.clone(), toTgtFixed:new THREE.Vector3(0,0,0), rec:null, t:0, dur:2.2 };
    focusRec = null;
  } else {
    eclipseStage = 0;
    if(item.key==='sun') flightToSun(); else flyTo(item.rec);
    if(tourMode==='planets') setActiveDock(item.key);
  }
  showTourCaption(item.key);
  tourIdx++;
  tourSchedule();   // ovoz o'qib bo'lgach keyingi jismga o'tadi
}
function startTour(mode){
  if(tourActive) stopTour(false);
  if(typeof realTimeMode!=='undefined' && realTimeMode) setRealTime(false);   // to‘qnashuvni oldini olamiz
  if(typeof lsActive!=='undefined' && lsActive) stopLightSpeed();
  tourMode = mode || 'planets';
  tourActive=true; tourIdx=0; closeCosmos(); closePanel(); playClick(720);
  updateTourBtn();
  tourStep();
}
function stopTour(resetView){
  if(!tourActive) return;
  tourActive=false; clearTimeout(tourTimer); updateTourBtn(); hideTourCaption();
  highlightConstellation(null);
  eclipseStage = 0;
  if(resetView) flyToOverview();
}
// Sayohatlar menyusi: ochish/yopish va tur tanlash
tourBtn.addEventListener('click', (e)=>{
  e.stopPropagation(); playClick(650);
  toursMenu.classList.toggle('open');
});
document.addEventListener('click', (e)=>{
  if(!toursMenu.contains(e.target) && e.target!==tourBtn) toursMenu.classList.remove('open');
});
toursMenu.querySelectorAll('.tour-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const mode = item.dataset.tour;
    toursMenu.classList.remove('open');
    (tourActive && tourMode===mode) ? stopTour(true) : startTour(mode);
  });
});
// Oyna orqa fonga o'tsa sayohat pauza bo'ladi (rAF to'xtaganda taymer oldinlab ketmasin)
document.addEventListener('visibilitychange', ()=>{
  if(!tourActive) return;
  if(document.hidden){ clearTimeout(tourTimer); }
  else { tourIdx = Math.max(0, tourIdx-1); tourStep(); }   // joriy bekatdan davom etadi
});

let lastCosmosMode = null;
function showCosmos(mode){
  const ui = window.LOC[LANG].ui;
  if(mode) lastCosmosMode = mode;
  // Har bir sayohat turi o‘z faktlar to‘plamini ko‘rsatadi
  const set = (ui.cosmosSets && ui.cosmosSets[lastCosmosMode]) || { title:ui.cosmosTitle, facts:ui.cosmosFacts };
  document.getElementById('cosmosTitle').textContent = set.title;
  document.getElementById('cosmosList').innerHTML = set.facts.map(f=>`<li>${f}</li>`).join('');
  cosmos.classList.add('open'); playClick(560);
}
function closeCosmos(){ cosmos.classList.remove('open'); }
document.getElementById('cosmosClose').addEventListener('click', ()=>{ playClick(440); closeCosmos(); });

/* --------------------------------------------------------------------------
   10e. KASHF ETISH — yirik yo'ldoshlar, kosmik apparatlar, meteor yomg'irlari,
        ovozli hikoya. Hammasi sahnada bosiladi va umumiy ma'lumot panelida ochiladi.
   -------------------------------------------------------------------------- */
const XT = {
  uz:{ menu:'Kashf etish', moons:"Yirik yo'ldoshlar", craft:'Kosmik apparatlar', showers:"Meteor yomg'irlari",
       stop:"✕ Meteor yomg'irini to'xtatish", look:'🔭 Radiantga qarash (Yerdan)', voiceOn:'Ovozli hikoya: yoqilgan', voiceOff:'Ovozli hikoya: o\u2019chirilgan', noVoice:"Brauzeringizda o'zbekcha ovoz yo'q — yaqin ovoz ishlatiladi" },
  ru:{ menu:'Исследовать', moons:'Крупные спутники', craft:'Космические аппараты', showers:'Метеорные потоки',
       stop:'✕ Остановить метеорный поток', look:'🔭 Смотреть на радиант (с Земли)', voiceOn:'Озвучка: включена', voiceOff:'Озвучка: выключена', noVoice:'' },
  en:{ menu:'Explore', moons:'Major moons', craft:'Spacecraft', showers:'Meteor showers',
       stop:'✕ Stop meteor shower', look:'🔭 Look at the radiant (from Earth)', voiceOn:'Narration: on', voiceOff:'Narration: off', noVoice:'' }
};
const xt = k => (XT[LANG]||XT.uz)[k];
const xinfo = key => { const L=(window.EXTRA_INFO||{})[key]; return L ? (L[LANG]||L.uz) : null; };

// ---------- Ovozli hikoya (Web Speech) ----------
const VOICE = { on: localStorage.getItem('solar_voice')==='1', len:0, speaking:false, tok:0, onDone:null, male:false };
// Erkak ovozlar nomlari (Edge Natural, Windows, macOS, Google)
const MALE_RX=/\b(male|sardor|ahmet|tolga|dmitry|dmitriy|pavel|maxim|yuri|daulet|guy|andrew|brian|christopher|davis|eric|roger|steffan|tony|ryan|thomas|george|daniel|alex|fred|aaron|arthur|oliver|rishi|mark|david|james|liam|brandon|jacob|jason|kai|luke|gordon|lee|reed|evan|nathan|tom|william|matthew|joey|justin|russell|ravi|prabhat|connor|mitchell|sam|neil|wayne)\b/i;
const FEMALE_RX=/\b(female|madina|emel|seda|filiz|svetlana|dariya|irina|milena|katya|aigul|aria|jenny|michelle|ava|emma|sonia|libby|zira|hazel|susan|samantha|karen|moira|tessa|victoria|allison)\b/i;
function pickVoice(){
  if(!('speechSynthesis' in window)) return null;
  const vs=speechSynthesis.getVoices(), l=LANG;
  const score=v=>{ let s=0; const n=v.name||'';
    if(MALE_RX.test(n)) s+=40; else if(FEMALE_RX.test(n)) s-=40;
    if(/natural|online|neural|premium|enhanced/i.test(n)) s+=20;   // tabiiy (neyron) ovozlar titramaydi
    if(v.localService===false) s+=4; return s; };
  const best=rx=>vs.filter(x=>x.lang && rx.test(x.lang)).sort((p,q)=>score(q)-score(p))[0];
  let v=best(new RegExp('^'+l,'i'));
  if(v && !MALE_RX.test(v.name)){ const m=vs.filter(x=>x.lang && new RegExp('^'+l,'i').test(x.lang) && MALE_RX.test(x.name)).sort((p,q)=>score(q)-score(p))[0]; if(m) v=m; }
  VOICE.native=!!v;
  if(!v && l==='uz') v=best(/^tr/i) || best(/^kk|^ky|^az/i);   // o'zbekcha ovoz bo'lmasa — eng yaqin turkiy til
  VOICE.male=!!(v && MALE_RX.test(v.name));
  return v||null;
}
// ---- O'zbekcha matnni ovozga tayyorlash: raqamlar so'z bilan, qisqartmalar ochiladi ----
const UZ1=['nol','bir','ikki','uch','to\'rt','besh','olti','yetti','sakkiz','to\'qqiz'], UZ10=['','o\'n','yigirma','o\'ttiz','qirq','ellik','oltmish','yetmish','sakson','to\'qson'];
const APOS=/[\u02BB\u02BC\u2018\u2019\u0060]/g;
function uzInt(n){
  if(n<10) return UZ1[n];
  if(n<100) return UZ10[Math.floor(n/10)]+(n%10?' '+UZ1[n%10]:'');
  if(n<1000){ const h=Math.floor(n/100); return (h>1?UZ1[h]+' ':'')+'yuz'+(n%100?' '+uzInt(n%100):''); }
  const U=[[1e12,'trillion'],[1e9,'milliard'],[1e6,'million'],[1e3,'ming']];
  for(const [d,w] of U) if(n>=d){ const q=Math.floor(n/d), r=n%d; return (q===1&&d===1e3?'':uzInt(q)+' ')+w+(r?' '+uzInt(r):''); }
  return String(n);
}
function uzNum(str){
  const s=str.replace(/[\s\u00a0\u202f]/g,'').replace(/(\d),(\d{3})(?!\d)/g,'$1$2');
  const m=s.match(/^(\d+)(?:[.,](\d+))?$/); if(!m) return str;
  let out=uzInt(parseInt(m[1],10)); if(m[2]) out+=' butun '+m[2].split('').map(c=>UZ1[+c]).join(' ');
  return out;
}
const UZ_ABBR=[[/\bmlrd\b\.?/gi,'milliard'],[/\bmln\b\.?/gi,'million'],[/\bkm\/s\b/gi,'kilometr sekundiga'],[/\bkm\/soat\b/gi,'kilometr soatiga'],[/\bkm²/gi,'kvadrat kilometr'],[/\bkm\b/gi,'kilometr'],[/\bm\/s\b/gi,'metr sekundiga'],[/\bsm\b/gi,'santimetr'],[/\bkg\b/gi,'kilogramm'],
  [/\bAB\b/g,'astronomik birlik'],[/°\s?C\b/g,' daraja Selsiy'],[/°/g,' daraja'],[/%/g,' foiz'],[/≈|~/g,'taxminan '],[/×/g,' marta '],[/–|—/g,', '],[/\bXKS\b/g,'Xalqaro kosmik stansiya'],[/\bNASA\b/g,'Nasa']];
function uzOrdinal(t){ return t.replace(/(\d+)-(yil|asr|chi|inchi|sayyora|kuni|oy)/gi,(m,n,w)=>{ let x=uzNum(n); x=x.replace(/(bir|ikki|uch|to'rt|besh|olti|yetti|sakkiz|to'qqiz|o'n|yigirma|o'ttiz|qirq|ellik|oltmish|yetmish|sakson|to'qson|yuz|ming|million|milliard)$/,q=>q+(/[aeiou]$/i.test(q)?'nchi':'inchi')); return x+(/chi$/i.test(w)?'':' '+w); }); }
// Turkcha ovoz o'zbek lotinini to'g'ri o'qishi uchun harflarni moslash
function uzForTurkish(t){
  return t.replace(/o'/gi,m=>m[0]==='O'?'Ö':'ö').replace(/g'/gi,m=>m[0]==='G'?'Ğ':'ğ')
    .replace(/sh/gi,m=>m[0]==='S'?'Ş':'ş').replace(/ch/gi,m=>m[0]==='C'?'Ç':'ç')
    .replace(/j/g,'c').replace(/J/g,'C').replace(/q/g,'k').replace(/Q/g,'K').replace(/x/g,'h').replace(/X/g,'H')
    .replace(/(\w)'(\w)/g,'$1$2');
}
function speechPrep(text){
  let t=String(text).replace(/[✦★☄✈⏹•·]/g,' ').replace(/\s+/g,' ').trim();
  if(LANG!=='uz') return t;
  t=t.replace(APOS,"'");
  t=uzOrdinal(t);
  UZ_ABBR.forEach(([r,w])=>{ t=t.replace(r,w); });
  t=t.replace(/\d[\d\s\u00a0\u202f]*\d(?:[.,]\d+)?|\d+(?:[.,]\d+)?/g,m=>' '+uzNum(m.trim())+' ');
  t=t.replace(/\s+([,.!?])/g,'$1').replace(/\s+/g,' ').trim();
  if(!VOICE.native) t=uzForTurkish(t);
  return t;
}
// Uzun matn bo'laklarga bo'linadi — brauzer uzun jumlada titramaydi va uzib qo'ymaydi
function speechChunks(t){
  const out=[]; (t.match(/[^.!?;:]+[.!?;:]*/g)||[t]).forEach(s=>{ s=s.trim(); if(!s) return;
    while(s.length>170){ let k=s.lastIndexOf(',',170); if(k<60) k=s.lastIndexOf(' ',170); if(k<40) k=170; out.push(s.slice(0,k+1)); s=s.slice(k+1).trim(); }
    if(s) out.push(s); });
  return out;
}
function narrate(text){
  VOICE.len=0; const tok=++VOICE.tok;
  if(!VOICE.on || LANG==='uz' || !('speechSynthesis' in window) || !text){ VOICE.speaking=false; return; }
  speechSynthesis.cancel();
  if(!speechSynthesis.getVoices().length){ VOICE.speaking=true; VOICE.len=String(text).length;   // ovozlar hali yuklanmagan — kutamiz
    let done=false; const retry=()=>{ if(done) return; done=true; speechSynthesis.removeEventListener('voiceschanged',retry); if(tok===VOICE.tok){ VOICE.tok--; narrate(text); } };
    speechSynthesis.addEventListener('voiceschanged',retry); setTimeout(retry,1200); return; }
  const v=pickVoice(), parts=speechChunks(speechPrep(text));
  VOICE.len=parts.join(' ').length; VOICE.speaking=true;
  let i=0, tries=0;
  const next=()=>{ if(tok!==VOICE.tok) return;
    if(i>=parts.length){ VOICE.speaking=false; const f=VOICE.onDone; VOICE.onDone=null; if(f) f(); return; }
    const u=new SpeechSynthesisUtterance(parts[i++]);
    if(v){ u.voice=v; u.lang=v.lang; } else u.lang={uz:'uz-UZ',ru:'ru-RU',en:'en-US'}[LANG]||'en-US';
    u.rate=LANG==='uz'?(VOICE.native?0.95:0.9):0.97;
    u.pitch=VOICE.male?1:0.7;   // erkak ovoz topilmasa — ohangni pasaytiramiz
    u.volume=1;
    u.onend=()=>{ tries=0; setTimeout(next,120); };
    u.onerror=e=>{ if(e.error==='interrupted'||e.error==='canceled') return; if(tries++<1) i--; else tries=0; setTimeout(next,250); };   // xato bo'lsa bo'lakni bir marta qayta o'qiydi
    VOICE.cur=u;   // Chrome: havola saqlanmasa utterance yig'ilib, onend kelmay qoladi
    speechSynthesis.speak(u); };
  setTimeout(next,60);   // cancel() dan keyin darhol speak() Chrome'da ovozni buzadi
}
function narrateStop(){ VOICE.len=0; VOICE.tok++; VOICE.speaking=false; VOICE.onDone=null; if('speechSynthesis' in window) speechSynthesis.cancel(); }
function narrateDelay(){ return VOICE.on && VOICE.len ? Math.max(9500, VOICE.len*72+1800) : 9500; }
// Sayohat: ovoz tugaguncha kutib, keyin keyingi jismga o'tadi
function tourSchedule(){
  clearTimeout(tourTimer);
  const t0=performance.now(), MIN=7000;
  const voiced=VOICE.on && VOICE.speaking && LANG!=='uz' && 'speechSynthesis' in window;
  const est=voiced ? VOICE.len*1000/16 : 0;          // taxminiy o'qish vaqti (~16 belgi/s)
  const minWait=Math.max(MIN, est*0.75), cap=est*2.5+20000;
  const go=()=>{ if(!tourActive) return; clearTimeout(tourTimer);
    const wait=()=>{ if(!tourActive) return; const el=performance.now()-t0;
      // brauzer hali gapirayotgan bo'lsa — kutamiz (onend erta kelsa ham o'tib ketmaydi)
      if(voiced && (speechSynthesis.speaking||speechSynthesis.pending||VOICE.speaking) && el<cap){ tourTimer=setTimeout(wait,400); return; }
      if(el<minWait){ tourTimer=setTimeout(wait,minWait-el); return; }
      tourTimer=setTimeout(tourStep,1400); };
    wait(); };
  if(voiced){ VOICE.onDone=go; tourTimer=setTimeout(()=>{ VOICE.onDone=null; go(); }, cap); }   // zaxira: ovoz hodisasi kelmasa
  else tourTimer=setTimeout(tourStep, 9500);
}
if('speechSynthesis' in window){ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = ()=>{}; }

// ---------- Bosiladigan obyektlar ----------
const PICKABLES = [];
function makePickable(obj, key, r){
  obj.userData.pickKey=key; obj.userData.pickR=r;
  const proxy=new THREE.Mesh(new THREE.SphereGeometry(Math.max(r*2.4,0.9),12,8), new THREE.MeshBasicMaterial({visible:false}));
  proxy.userData.pickOf=obj; obj.add(proxy); PICKABLES.push(proxy);
}
function pickSelect(obj){
  const key=obj.userData.pickKey;
  if(tourActive) stopTour(false);
  showInfo(key);
  flyTo({ mesh:obj, radius:obj.userData.pickR||1, key });
}
function showInfo(key, actions){
  const d=xinfo(key); if(!d) return;
  const ui=window.LOC[LANG].ui;
  lastSelectedKey=null;
  elType.textContent=d.type; elName.textContent=d.name; elDesc.textContent=d.desc;
  renderPhotos(key);
  const st=d.stats||[];
  elStats.innerHTML=`<div class="sec-title">${ui.secMain}</div><div class="stats-grid">${st.map((s,i)=>`<div class="stat${(st.length%2 && i===st.length-1)?' wide':''}"><div class="k">${phEsc(s[0])}</div><div class="v">${phEsc(s[1])}</div></div>`).join('')}</div>`;
  elFactLabel.textContent=ui.factLabel; elFact.textContent=d.fact;
  elActions.innerHTML='';
  (actions||[]).forEach(a=>elActions.appendChild(mkBtn(a.label,'',a.fn)));
  panel.classList.add('open'); setActiveDock(null);
}

// ---------- Yirik yo'ldoshlar: nom → kalit, yaxshiroq teksturalar ----------
const MOON_KEY={ 'Io':'io','Yevropa':'europa','Ganimed':'ganymede','Kallisto':'callisto','Titan':'titan','Enselad':'enceladus','Triton':'triton' };
function europaTexture(){
  const W=512,H=256, c=makeCanvas(W,H), x=c.getContext('2d');
  const base=pixCanvas(W,H,(i,j,k,d,o)=>{ const n=vnoise3(i*0.02,j*0.02,1.3)*0.6+vnoise3(i*0.07,j*0.07,4.1)*0.4;
    d[o]=208+n*30; d[o+1]=200+n*26; d[o+2]=186+n*22; });
  x.drawImage(base,0,0);
  x.lineCap='round';
  for(let n=0;n<150;n++){                                  // lineae — qizg'ish-jigarrang yoriqlar
    let px=Math.random()*W, py=H*0.1+Math.random()*H*0.8, a=Math.random()*Math.PI;
    x.strokeStyle=`rgba(${120+Math.random()*40|0},${62+Math.random()*25|0},${38+Math.random()*20|0},${0.35+Math.random()*0.4})`;
    x.lineWidth=0.6+Math.random()*1.8; x.beginPath(); x.moveTo(px,py);
    for(let s=0;s<14;s++){ a+=(Math.random()-0.5)*0.35; px+=Math.cos(a)*9; py+=Math.sin(a)*5; x.lineTo(px,py); }
    x.stroke();
  }
  const t=asTexture(c); return t;
}
function ioTexture(){
  const W=512,H=256, c=pixCanvas(W,H,(i,j,k,d,o)=>{ const n=vnoise3(i*0.025,j*0.025,7.7)*0.6+vnoise3(i*0.09,j*0.09,2.2)*0.4;
    d[o]=214+n*34; d[o+1]=182+n*44; d[o+2]=70+n*40; });
  const x=c.getContext('2d');
  for(let n=0;n<70;n++){                                    // vulqon dog'lari va lava oqimlari
    const px=Math.random()*W, py=H*0.08+Math.random()*H*0.84, r=2+Math.random()*9;
    const g=x.createRadialGradient(px,py,0,px,py,r*2.4);
    const red=Math.random()<0.35;
    g.addColorStop(0, red?'rgba(40,18,10,0.95)':'rgba(30,24,16,0.9)');
    g.addColorStop(0.35, red?'rgba(180,60,24,0.7)':'rgba(120,90,40,0.45)');
    g.addColorStop(1,'rgba(220,180,80,0)');
    x.fillStyle=g; x.beginPath(); x.arc(px,py,r*2.4,0,TAU); x.fill();
  }
  return asTexture(c);
}
function titanTexture(){
  const W=256,H=128, c=pixCanvas(W,H,(i,j,k,d,o)=>{ const lat=Math.abs(j/(H-1)*2-1), n=vnoise3(i*0.03,j*0.05,3.3);
    d[o]=214-lat*30+n*12; d[o+1]=150-lat*22+n*10; d[o+2]=66-lat*10+n*6; });
  return asTexture(c);
}
orbitObjects.forEach(rec=>{
  (rec.mesh.children||[]).forEach(mp=>{
    (mp.children||[]).forEach(mm=>{
      if(!mm.isMesh || !mm.geometry || !mm.geometry.parameters) return;
      const r=mm.geometry.parameters.radius; if(r==null) return;
      // MOONS ro'yxatidagi tartib bo'yicha nomni tiklaymiz (radius mosligi orqali)
      const def=({jupiter:[['Io',0.5],['Yevropa',0.44],['Ganimed',0.7],['Kallisto',0.62]], saturn:[['Titan',0.62],['Reya',0.3],['Enselad',0.22]], neptune:[['Triton',0.4]]}[rec.key]||[]).find(q=>Math.abs(q[1]-r)<1e-6);
      if(!def) return;
      const key=MOON_KEY[def[0]]; if(!key) return;
      if(key==='io'){ mm.material.map=ioTexture(); mm.material.needsUpdate=true; }
      if(key==='europa'){ mm.material.map=europaTexture(); mm.material.normalMap=null; mm.material.roughness=0.55; mm.material.needsUpdate=true; }   // Yevropa — silliq muz, kraterlar deyarli yo'q
      if(key==='enceladus'){ mm.material.color=new THREE.Color(1.15,1.15,1.2); mm.material.needsUpdate=true; }
      if(key==='titan'){
        mm.material=new THREE.MeshStandardMaterial({ map:titanTexture(), roughness:0.95 });
        const haze=new THREE.Mesh(new THREE.SphereGeometry(r*1.12,48,32), new THREE.ShaderMaterial({
          transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.BackSide,
          vertexShader:'varying vec3 vN; varying vec3 vW; void main(){ vN=normalize(mat3(modelMatrix)*normal); vW=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
          fragmentShader:'varying vec3 vN; varying vec3 vW; void main(){ vec3 V=normalize(cameraPosition-vW); float f=pow(1.0-max(dot(-vN,V),0.0),2.5); gl_FragColor=vec4(vec3(1.0,0.62,0.25)*f*0.9,1.0); }' }));
        mm.add(haze);
      }
      makePickable(mm, key, r);
    });
  });
});
{ const er=orbitObjects.find(r=>r.key==='earth');
  if(er && er.extras.moonPivot && er.extras.moonPivot.children[0]) makePickable(er.extras.moonPivot.children[0], 'moon', er.radius*0.27); }

// ---------- Kosmik apparatlar ----------
const M_WHITE=new THREE.MeshStandardMaterial({ color:0xe6e8ec, roughness:0.55, metalness:0.35 });
const M_GRAY =new THREE.MeshStandardMaterial({ color:0x8a8f98, roughness:0.5, metalness:0.7 });
const M_SOLAR=new THREE.MeshStandardMaterial({ color:0x1b2c5e, roughness:0.3, metalness:0.8, emissive:0x0a1430, emissiveIntensity:0.6, side:THREE.DoubleSide });
const M_GOLD =new THREE.MeshStandardMaterial({ color:0xd9a93a, roughness:0.22, metalness:1.0, emissive:0x3a2600, emissiveIntensity:0.5, side:THREE.DoubleSide });
const M_FOIL =new THREE.MeshStandardMaterial({ color:0xc9b8c8, roughness:0.35, metalness:0.9, side:THREE.DoubleSide });
const M_DARK =new THREE.MeshStandardMaterial({ color:0x222428, roughness:0.8, metalness:0.2 });
const box=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
const cyl=(r1,r2,h,m,seg)=>new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||16),m);
function buildISS(){
  const g=new THREE.Group();
  const W=new THREE.MeshStandardMaterial({ color:0xf0f1f3, roughness:0.5, metalness:0.25, emissive:0x2a2c30, emissiveIntensity:0.6 });
  const T=new THREE.MeshStandardMaterial({ color:0xa7adb6, roughness:0.45, metalness:0.75, emissive:0x1a1c20, emissiveIntensity:0.5 });
  const P=new THREE.MeshStandardMaterial({ color:0xc08a3e, roughness:0.35, metalness:0.7, emissive:0x3a2208, emissiveIntensity:0.55, side:THREE.DoubleSide });
  const PF=new THREE.MeshStandardMaterial({ color:0x6b5130, roughness:0.6, metalness:0.5, side:THREE.DoubleSide });
  const R=new THREE.MeshStandardMaterial({ color:0xf7f7f5, roughness:0.7, metalness:0.1, emissive:0x303234, emissiveIntensity:0.5, side:THREE.DoubleSide });
  const truss=box(2.6,0.09,0.09,T); g.add(truss);
  for(let i=-6;i<=6;i++){ const r=box(0.012,0.11,0.11,T); r.position.x=i*0.2; g.add(r); }
  [-1.18,-0.88,0.88,1.18].forEach(x=>{ [1,-1].forEach(sd=>{
    const mast=box(0.018,0.018,1.0,T); mast.position.set(x,0,sd*0.55); g.add(mast);
    [-1,1].forEach(h=>{ const p=box(0.11,0.004,0.92,P); p.position.set(x+h*0.065,0,sd*0.58); g.add(p);
      const fr=box(0.115,0.006,0.02,PF); fr.position.set(x+h*0.065,0,sd*1.04); g.add(fr); });
  }); });
  [-0.42,0.42].forEach(x=>{ const r=box(0.28,0.004,0.5,R); r.position.set(x,-0.02,-0.34); r.rotation.x=0.15; g.add(r); });
  [[0,0.06,0.72,0.11],[0,0.06,-0.30,0.1],[0,0.06,-0.70,0.08],[0,0.06,1.2,0.09]].forEach(([x,y,z,r],i)=>{ const L=[0.62,0.42,0.38,0.34][i];
    const c=cyl(r,r,L,W,20); c.rotation.x=Math.PI/2; c.position.set(x,y,z); g.add(c);
    [-1,1].forEach(e=>{ const ring=cyl(r*1.04,r*1.04,0.015,T,20); ring.rotation.x=Math.PI/2; ring.position.set(x,y,z+e*L/2); g.add(ring); }); });
  const node=new THREE.Mesh(new THREE.SphereGeometry(0.12,16,12),W); node.position.set(0,0.06,0.38); g.add(node);
  [-1,1].forEach(e=>{ const m=cyl(0.09,0.09,0.36,W,18); m.rotation.z=Math.PI/2; m.position.set(e*0.28,0.06,0.38); g.add(m); });
  const RP=new THREE.MeshStandardMaterial({ color:0x243a78, roughness:0.35, metalness:0.7, emissive:0x0c1638, emissiveIntensity:0.7, side:THREE.DoubleSide });
  [-1,1].forEach(e=>{ const p=box(0.55,0.004,0.16,RP); p.position.set(e*0.38,0.06,-0.62); g.add(p); });
  return g;
}
function buildJWST(){
  const g=new THREE.Group();
  for(let L=0;L<5;L++){                                               // 5 qatlamli quyosh soyaboni
    const sh=new THREE.Shape(); sh.moveTo(-1.6,0); sh.lineTo(0,0.95); sh.lineTo(1.6,0); sh.lineTo(0,-0.95); sh.closePath();
    const m=new THREE.Mesh(new THREE.ShapeGeometry(sh), M_FOIL); m.rotation.x=-Math.PI/2; m.position.y=-0.25+L*0.045; m.scale.setScalar(1-L*0.04); g.add(m);
  }
  const mirror=new THREE.Group();                                     // 18 ta olti burchakli oltin segment
  const hexR=0.19, hexG=new THREE.CircleGeometry(hexR,6);
  const cells=[[0,0]]; for(let q=-2;q<=2;q++) for(let r=-2;r<=2;r++){ const s=-q-r; const d=Math.max(Math.abs(q),Math.abs(r),Math.abs(s)); if(d>=1&&d<=2&&cells.length<19) cells.push([q,r]); }
  cells.slice(1,19).forEach(([q,r])=>{ const m=new THREE.Mesh(hexG,M_GOLD);
    m.position.set(hexR*1.52*q, hexR*1.75*(r+q/2), 0); m.rotation.z=Math.PI/6; mirror.add(m); });
  mirror.position.set(0,0.75,0.25); mirror.rotation.x=-0.25; g.add(mirror);
  const sec=cyl(0.05,0.05,0.04,M_GOLD); sec.position.set(0,0.95,1.05); sec.rotation.x=Math.PI/2; g.add(sec);
  [[-0.35,0],[0.35,0],[0,0.4]].forEach(([x,y])=>{ const s=cyl(0.008,0.008,1.0,M_GRAY,6); s.position.set(x*0.5,0.85+y*0.2,0.65); s.rotation.x=Math.PI/2.4; g.add(s); });
  const bus=box(0.45,0.2,0.45,M_DARK); bus.position.y=-0.45; g.add(bus);
  const sp=box(0.9,0.005,0.35,M_SOLAR); sp.position.set(0,-0.5,-0.55); g.add(sp);
  return g;
}
function buildParker(){
  const g=new THREE.Group();
  const SH=new THREE.MeshStandardMaterial({ color:0xf5f3ec, roughness:0.95, metalness:0, emissive:0x2e2b26, emissiveIntensity:0.4 });
  const CF=new THREE.MeshStandardMaterial({ color:0x3b3e45, roughness:0.75, metalness:0.35, emissive:0x0c0d10, emissiveIntensity:0.5 });
  const BK=new THREE.MeshStandardMaterial({ color:0x1d1f24, roughness:0.6, metalness:0.4, emissive:0x08090b, emissiveIntensity:0.5 });
  const SV=new THREE.MeshStandardMaterial({ color:0xb8bcc4, roughness:0.35, metalness:0.85, emissive:0x1a1c20, emissiveIntensity:0.5 });
  // Issiqlik qalqoni (TPS): oq keramik old yuza +X da Quyoshga qaragan, orqasi uglerod ko'pik
  const shield=cyl(0.62,0.62,0.1,SH,56); shield.rotation.z=Math.PI/2; shield.position.x=0.03; g.add(shield);
  const edge=new THREE.Mesh(new THREE.TorusGeometry(0.62,0.02,8,72),CF); edge.rotation.y=Math.PI/2; edge.position.x=0.03; g.add(edge);
  const back=cyl(0.56,0.56,0.02,CF,56); back.rotation.z=Math.PI/2; back.position.x=-0.07; g.add(back);
  for(let k=0;k<6;k++){ const a=k/6*TAU, p0=new THREE.Vector3(-0.08,Math.cos(a)*0.34,Math.sin(a)*0.34), p1=new THREE.Vector3(-0.24,Math.cos(a)*0.2,Math.sin(a)*0.2);
    const st=cyl(0.01,0.01,p0.distanceTo(p1),SV,5); st.position.copy(p0.clone().add(p1).multiplyScalar(0.5)); st.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p1.clone().sub(p0).normalize()); g.add(st); }
  // Olti qirrali shina
  const bus=cyl(0.3,0.3,0.5,BK,6); bus.rotation.z=Math.PI/2; bus.position.x=-0.5; g.add(bus);
  for(let k=0;k<6;k++){ const a=(k+0.5)/6*TAU, pn=box(0.42,0.004,0.22,k%2?SV:CF);
    pn.position.set(-0.5,Math.cos(a)*0.262,Math.sin(a)*0.262); pn.rotation.x=a; g.add(pn); }
  // Suyuqlik bilan sovutiladigan quyosh panellari — qalqon soyasida, orqaga og'gan
  [1,-1].forEach(s=>{ const arm=cyl(0.012,0.012,0.22,SV,5); arm.rotation.x=Math.PI/2; arm.position.set(-0.3,0,s*0.38); g.add(arm);
    const wing=new THREE.Group(); wing.position.set(-0.3,0,s*0.5); wing.rotation.y=s*0.35; g.add(wing);
    const p=box(0.34,0.008,0.26,M_SOLAR); p.position.z=s*0.13; wing.add(p);
    const fr=box(0.35,0.012,0.012,SV); fr.position.z=s*0.26; wing.add(fr); });
  // Radiatorlar (shina tepasida)
  [-0.42,-0.6].forEach(x=>{ const r=box(0.14,0.004,0.5,SV); r.position.set(x,0.36,0); g.add(r);
    const l=box(0.012,0.06,0.012,SV); l.position.set(x,0.31,0); g.add(l); });
  // Yuqori kuchaytirishli antenna
  const prof=[]; for(let i=0;i<=12;i++){ const r=i/12; prof.push(new THREE.Vector2(r*0.16, r*r*0.05)); }
  const dish=new THREE.Mesh(new THREE.LatheGeometry(prof,28), new THREE.MeshStandardMaterial({ color:0xe8e8e4, roughness:0.5, metalness:0.2, side:THREE.DoubleSide }));
  dish.rotation.x=Math.PI; dish.position.set(-0.58,-0.36,0); g.add(dish);
  // Magnitometr bumi va FIELDS antennalari (qalqon chetidan chiqib turadi)
  const mag=cyl(0.008,0.008,1.0,SV,5); mag.rotation.z=Math.PI/2; mag.position.set(-1.25,0,0); g.add(mag);
  [-1.0,-1.45,-1.72].forEach(x=>{ const m=box(0.05,0.05,0.05,CF); m.position.x=x; g.add(m); });
  for(let k=0;k<4;k++){ const a=k/4*TAU+Math.PI/4, w=cyl(0.004,0.004,0.55,SV,3);
    w.position.set(-0.02,Math.cos(a)*0.9,Math.sin(a)*0.9); w.rotation.x=a; g.add(w); }
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(), color:0xffb060, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false }));
  glow.scale.set(2.8,2.8,1); glow.position.x=0.4; g.add(glow); g.userData.glow=glow;
  return g;
}
const TRAIL_TIME={ value:0 };
function trailTubeMat(col, inten, pw){
  return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ uCol:{value:new THREE.Color(col)}, uI:{value:inten}, uP:{value:pw}, uTime:TRAIL_TIME },
    vertexShader:'varying float vT; varying float vF; void main(){ vT=uv.x; vec4 mv=modelViewMatrix*vec4(position,1.0); vec3 n=normalize(normalMatrix*normal); vF=abs(dot(n,normalize(-mv.xyz))); gl_Position=projectionMatrix*mv; }',
    fragmentShader:'uniform vec3 uCol; uniform float uI,uP,uTime; varying float vT; varying float vF; void main(){ float t=vT;'+
      ' float a=pow(vF,uP)*(0.18+0.82*pow(t,1.4))*smoothstep(0.0,0.05,t)*(1.0-smoothstep(0.993,1.0,t));'+
      ' float pulse=0.8+0.6*pow(0.5+0.5*sin(t*70.0-uTime*2.2),8.0);'+
      ' gl_FragColor=vec4(uCol*a*uI*pulse,1.0); }' });
}
function buildVoyager(){
  const g=new THREE.Group();
  const WH=new THREE.MeshStandardMaterial({ color:0xf4f3ee, roughness:0.55, metalness:0.15, emissive:0x3a3a38, emissiveIntensity:0.5, side:THREE.DoubleSide });
  const GR=new THREE.MeshStandardMaterial({ color:0x9aa0a8, roughness:0.45, metalness:0.8, emissive:0x202328, emissiveIntensity:0.6 });
  const GD=new THREE.MeshStandardMaterial({ color:0xe0b04a, roughness:0.28, metalness:1.0, emissive:0x4a3006, emissiveIntensity:0.7, side:THREE.DoubleSide });
  const DK=new THREE.MeshStandardMaterial({ color:0x2a2c31, roughness:0.7, metalness:0.3, emissive:0x0c0d10, emissiveIntensity:0.6 });
  // 3,7 m antenna — haqiqiy paraboloid
  const prof=[]; for(let i=0;i<=32;i++){ const r=i/32; prof.push(new THREE.Vector2(r*1.0, r*r*0.26)); }
  const dish=new THREE.Mesh(new THREE.LatheGeometry(prof,96), WH); dish.position.y=0.3; g.add(dish);
  // antenna orqasidagi radial qovurg'alar va halqalar
  const ribM=new THREE.LineBasicMaterial({ color:0x8a9098, transparent:true, opacity:0.9 });
  for(let k=0;k<24;k++){ const a=k/24*TAU, pts=[]; for(let i=2;i<=32;i++){ const r=i/32; pts.push(new THREE.Vector3(Math.cos(a)*r*1.002, 0.296+r*r*0.26, Math.sin(a)*r*1.002)); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ribM)); }
  [0.35,0.65].forEach(r=>{ const t=new THREE.Mesh(new THREE.TorusGeometry(r,0.006,4,64),GR); t.rotation.x=Math.PI/2; t.position.y=0.296+r*r*0.26; g.add(t); });
  const rim=new THREE.Mesh(new THREE.TorusGeometry(1.0,0.018,6,64), GR); rim.rotation.x=Math.PI/2; rim.position.y=0.56; g.add(rim);
  const sub=cyl(0.14,0.05,0.06,WH,24); sub.position.y=1.12; g.add(sub);
  for(let k=0;k<4;k++){ const a=k/4*TAU+0.4;
    const p0=new THREE.Vector3(Math.cos(a)*0.72,0.44,Math.sin(a)*0.72), p1=new THREE.Vector3(0,1.1,0), mid=p0.clone().add(p1).multiplyScalar(0.5);
    const st=cyl(0.008,0.008,p0.distanceTo(p1),GR,4); st.position.copy(mid); st.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), p1.clone().sub(p0).normalize()); g.add(st); }
  const feed=cyl(0.05,0.07,0.28,GR,12); feed.position.y=0.42; g.add(feed);
  // 10 qirrali shina — oltin issiqlik qoplamasi
  const bus=cyl(0.48,0.48,0.42,GD,10); bus.position.y=0.02; g.add(bus);
  const top=cyl(0.49,0.49,0.02,DK,10); top.position.y=0.24; g.add(top);
  const tank=new THREE.Mesh(new THREE.SphereGeometry(0.26,20,14), GR); tank.position.y=-0.24; g.add(tank);
  for(let k=0;k<10;k++){ const a=(k+0.5)/10*TAU, sh=box(0.26,0.3,0.006,k%2?GD:DK); sh.position.set(Math.cos(a)*0.46,0.02,Math.sin(a)*0.46); sh.rotation.y=-a+Math.PI/2; g.add(sh); }
  for(let k=0;k<10;k++){ const a=(k+0.5)/10*TAU;                                    // termal jalyuzlar
    for(let j=0;j<4;j++){ const l=box(0.2,0.012,0.004,GR); l.position.set(Math.cos(a)*0.475,-0.07+j*0.055,Math.sin(a)*0.475); l.rotation.y=-a+Math.PI/2; if(k%3===0) g.add(l); } }
  [[0.3,0.3],[-0.3,0.3],[0.3,-0.3],[-0.3,-0.3]].forEach(([x,z])=>{ const th=cyl(0.018,0.03,0.07,DK,8); th.position.set(x,-0.22,z); g.add(th); });   // gidrazin dvigatellari
  const rec=new THREE.Mesh(new THREE.CircleGeometry(0.13,32), GD); rec.position.set(0.5,0.02,0); rec.rotation.y=Math.PI/2; g.add(rec);   // Oltin plastinka
  const recC=new THREE.Mesh(new THREE.RingGeometry(0.02,0.03,24), DK); recC.position.set(0.505,0.02,0); recC.rotation.y=Math.PI/2; g.add(recC);
  // RTG bumi — 3 ta qanotli generator
  const rb=cyl(0.02,0.02,2.0,GR,6); rb.rotation.z=Math.PI/2; rb.position.set(1.4,-0.12,0.22); g.add(rb);
  for(let k=0;k<3;k++){ const x=1.55+k*0.33; const r=cyl(0.12,0.12,0.28,DK,12); r.rotation.z=Math.PI/2; r.position.set(x,-0.12,0.22); g.add(r);
    for(let f=0;f<6;f++){ const a=f/6*TAU, fin=box(0.26,0.004,0.1,DK); fin.position.set(x,-0.12+Math.sin(a)*0.15,0.22+Math.cos(a)*0.15); fin.rotation.x=-a; g.add(fin); } }
  // Ilmiy bum — skanerlovchi platforma va kameralar
  const sb=cyl(0.022,0.022,2.3,GR,6); sb.rotation.z=Math.PI/2; sb.position.set(-1.4,-0.12,-0.22); g.add(sb);
  const plat=box(0.34,0.3,0.3,DK); plat.position.set(-2.5,-0.12,-0.22); g.add(plat);
  const nac=cyl(0.07,0.07,0.5,WH,14); nac.rotation.x=Math.PI/2; nac.position.set(-2.5,0.08,0.02); g.add(nac);
  const wac=cyl(0.05,0.05,0.3,WH,14); wac.rotation.x=Math.PI/2; wac.position.set(-2.34,0.08,-0.02); g.add(wac);
  const cr=box(0.2,0.12,0.14,GD); cr.position.set(-1.9,-0.12,-0.22); g.add(cr);
  const iris=cyl(0.1,0.1,0.26,GD,16); iris.rotation.x=Math.PI/2; iris.position.set(-2.72,0.1,0.0); g.add(iris);      // IRIS spektrometri
  const irisM=new THREE.Mesh(new THREE.CircleGeometry(0.085,24),DK); irisM.position.set(-2.72,0.1,0.131); g.add(irisM);
  const uvs=box(0.1,0.1,0.26,WH); uvs.position.set(-2.3,-0.02,0.0); g.add(uvs);                                       // UVS
  const lecp=cyl(0.1,0.1,0.14,DK,16); lecp.position.set(-1.62,0.02,-0.22); g.add(lecp);                              // LECP barabani
  const lecpT=cyl(0.1,0.1,0.02,GD,16); lecpT.position.set(-1.62,0.1,-0.22); g.add(lecpT);
  [0.08,-0.08].forEach(z=>{ const c=box(0.12,0.1,0.06,GD); c.position.set(-1.25,-0.02,-0.22+z); g.add(c); });         // CRS
  // Magnitometr bumi — 13 m
  const mA=new THREE.Vector3(-0.3,-0.1,-0.4), mB=new THREE.Vector3(-3.4,-0.1,-6.0);
  // uch qirrali panjara bum
  const mdir=mB.clone().sub(mA).normalize(), mp=new THREE.Vector3().crossVectors(mdir,new THREE.Vector3(0,1,0)).normalize(), mq=new THREE.Vector3().crossVectors(mdir,mp);
  for(let k=0;k<3;k++){ const a=k/3*TAU, o=mp.clone().multiplyScalar(Math.cos(a)*0.035).addScaledVector(mq,Math.sin(a)*0.035);
    const a0=mA.clone().add(o), b0=mB.clone().add(o.clone().multiplyScalar(0.4));
    const mb=cyl(0.006,0.006,a0.distanceTo(b0),GR,4); mb.position.copy(a0.clone().add(b0).multiplyScalar(0.5)); mb.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), b0.clone().sub(a0).normalize()); g.add(mb); }
  [0.35,0.68,1].forEach(t=>{ const m=cyl(0.045,0.045,0.09,WH,10); m.position.copy(mA.clone().lerp(mB,t)); g.add(m); });
  // Plazma to'lqin antennalari — V shaklidagi ikki 10 m sim
  [1,-1].forEach(sd=>{ const a0=new THREE.Vector3(0.1*sd,-0.3,0.4), a1=new THREE.Vector3(2.6*sd,-1.4,4.2);
    const w=cyl(0.005,0.005,a0.distanceTo(a1),GR,3); w.position.copy(a0.clone().add(a1).multiplyScalar(0.5)); w.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), a1.clone().sub(a0).normalize()); g.add(w); });
  // Bu masofada Quyosh juda xira — model ko'rinishi uchun lokal yoritish
  const lit=new THREE.PointLight(0xfff2dc, 1.8, 40, 1); lit.position.set(1.5,6,3); g.add(lit);
  const fill=new THREE.PointLight(0x8fb4ff, 0.6, 30, 1); fill.position.set(-3,-3,-4); g.add(fill);
  lit.visible=fill.visible=false; g.userData.lights=[lit,fill];
  const beacon=new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(), color:0x9fe4ff, transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false }));
  beacon.scale.set(5,5,1); g.add(beacon); g.userData.beacon=beacon;
  return g;
}
const CRAFT = {};
{
  const er=orbitObjects.find(r=>r.key==='earth');
  // XKS — Yer atrofida, 51,6° qiyalikda
  const issPivot=new THREE.Object3D(); issPivot.position.copy(er.mesh.position); issPivot.rotation.x=THREE.MathUtils.degToRad(51.6);
  er.pivot.add(issPivot);
  const iss=buildISS(); iss.scale.setScalar(0.5); iss.position.x=er.radius*1.35; iss.rotation.z=Math.PI/2; issPivot.add(iss);
  makePickable(iss,'iss',0.35); iss.userData.viewDist=2.6; iss.userData.followRot=true; CRAFT.iss={obj:iss,pivot:issPivot,k:0.45};
  // kamera: stansiya orqasida, Yerdan tashqariga va biroz yuqoriga — Yer hech qachon kamera va XKS orasiga tushmaydi
  iss.userData.viewOffset=()=>new THREE.Vector3(0.95,0.75,1.9).applyQuaternion(issPivot.getWorldQuaternion(new THREE.Quaternion()));
  // James Webb — Yer–Quyosh L2 nuqtasida (Yerdan Quyoshga teskari tomonda), soyaboni Quyoshga qaragan
  const jw=buildJWST(); jw.scale.setScalar(0.55); jw.position.set(er.orbit+9,1.2,0); jw.rotation.set(0,0,-Math.PI/2);
  er.pivot.add(jw); makePickable(jw,'jwst',0.8); CRAFT.jwst={obj:jw};
  // Parker — Quyosh atrofida cho'ziq elliptik orbita
  const pk=buildParker(); pk.scale.setScalar(0.7); scene.add(pk); makePickable(pk,'parker',0.6); pk.userData.viewDist=4.2; pk.userData.followRot=true;
  CRAFT.parker={obj:pk, M:0.4, a:30, e:0.42, k:0.35};
  pk.userData.viewOffset=()=>new THREE.Vector3(-1.6,1.4,2.8).applyQuaternion(pk.getWorldQuaternion(new THREE.Quaternion()));
  // Voyager 1 va 2 — haqiqiy yo'nalishlarda, Koyper kamaridan ancha narida + trayektoriya izi
  [['voyager1',17.2,12.2,1340],['voyager2',20.1,-58.5,1100]].forEach(([k,ra,dec,dist])=>{
    const dir=radecToVector(ra,dec,1).normalize(), v=buildVoyager(); v.scale.setScalar(1.6);
    v.position.copy(dir.clone().multiplyScalar(dist)); v.lookAt(0,0,0); v.rotateX(Math.PI/2); scene.add(v); makePickable(v,k,2.2);
    v.userData.viewDist=16;
    const path=t=>dir.clone().multiplyScalar(70+(dist-70)*t).add(new THREE.Vector3(0,Math.sin(t*Math.PI)*dist*0.05,0));
    const NL=160, lp=new Float32Array((NL+1)*3), lc=new Float32Array((NL+1)*3);
    for(let i=0;i<=NL;i++){ const t=i/NL, p=path(t); lp.set([p.x,p.y,p.z],i*3); const b=0.35+0.65*Math.pow(t,1.3); lc.set([0.6*b,0.92*b,1.0*b],i*3); }
    const lg=new THREE.BufferGeometry(); lg.setAttribute('position',new THREE.BufferAttribute(lp,3)); lg.setAttribute('color',new THREE.BufferAttribute(lc,3));
    const ln=new THREE.Line(lg,new THREE.LineBasicMaterial({ vertexColors:true, transparent:true, opacity:1, blending:THREE.AdditiveBlending, depthWrite:false }));
    ln.frustumCulled=false; const tg=new THREE.Group(); tg.visible=false; scene.add(tg); tg.add(ln);   // iz faqat tanlanganda ko'rinadi
    // Nurli trayektoriya: ichki yorqin o'zak + keng yumshoq nur
    const cp=[]; for(let i=0;i<=120;i++) cp.push(path(i/120));
    const curve=new THREE.CatmullRomCurve3(cp), tubes=[];
    [[0.7,0xd8f6ff,1.5,1.2],[3.2,0x5fc8ff,0.55,2.4]].forEach(([r,col,I,P])=>{
      const tb=new THREE.Mesh(new THREE.TubeGeometry(curve,420,r,10,false), trailTubeMat(col,I,P)); tb.frustumCulled=false; tg.add(tb); tubes.push(tb); });
    const NP=900, pp=new Float32Array(NP*3), pc=new Float32Array(NP*3), ps=new Float32Array(NP), T=new Float32Array(NP), J=[];
    for(let i=0;i<NP;i++){ T[i]=Math.random(); ps[i]=3+Math.random()*4; J.push(new THREE.Vector3(gRand(),gRand(),gRand()).multiplyScalar(1.4)); }
    const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pp,3)); pg.setAttribute('aColor',new THREE.BufferAttribute(pc,3)); pg.setAttribute('aSize',new THREE.BufferAttribute(ps,1));
    const trail=new THREE.Points(pg, softPointsMaterial({ maxPx:10 })); trail.frustumCulled=false; tg.add(trail);
    CRAFT[k]={obj:v, line:ln, trail, T, J, path, geo:pg, tg, tubes, fade:0};
  });
}


/* ---------- Tarixiy to'qnashuvlar — 3D qayta ijro (labs/impacts.js dan chaqiriladi) ----------
   Effektlar sayyora meshining bolasi — sayyora bilan birga harakatlanadi. Ijro davomida o'z o'qi
   atrofida aylanish to'xtatiladi va zarba nuqtasi Quyoshga qaratiladi. */
const IMPX={ rec:null, grp:null, cfg:null, meta:null, phase:null, t:0, spin0:null, rot0:0, rot1:0, fx:[], imps:[], tmp:null, hud:null, glow:null, Rl:1, done:false };
const IMP_UP=new THREE.Vector3(0,1,0);
function impGlow(){ return IMPX.glow||(IMPX.glow=glowTexture()); }
function impLocalDir(lat,lon){ const la=lat*Math.PI/180, ph=(lon+180)/360*TAU; return new THREE.Vector3(-Math.cos(ph)*Math.cos(la), Math.sin(la), Math.sin(ph)*Math.cos(la)).normalize(); }
function impFrame(n){ const t1=new THREE.Vector3().crossVectors(Math.abs(n.y)>0.95?new THREE.Vector3(1,0,0):IMP_UP, n).normalize(); return { t1, t2:new THREE.Vector3().crossVectors(n,t1).normalize() }; }
function impCapMat(col,rim){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-2,
  uniforms:{ uA:{value:0}, uHot:{value:0}, uCol:{value:new THREE.Color(col)}, uRim:{value:new THREE.Color(rim)} },
  vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:'uniform float uA,uHot; uniform vec3 uCol,uRim; varying vec2 vUv; void main(){ float r=1.0-vUv.y;'+
    ' vec3 c=mix(uCol,uRim,smoothstep(0.45,0.75,r)*(1.0-smoothstep(0.78,0.96,r)));'+
    ' c+=vec3(1.0,0.45,0.12)*uHot*(1.0-smoothstep(0.0,0.75,r))*2.2;'+
    ' gl_FragColor=vec4(c, uA*(1.0-smoothstep(0.8,1.0,r))); }' }); }
function impAdd(o){ IMPX.grp.add(o); return o; }
// Zarba: chaqnash, olovli gumbaz, zarba to'lqini halqasi, krater/kuygan iz va otilgan jinslar
function impHit(P,n,S,o){
  const Rl=IMPX.Rl, {t1,t2}=impFrame(n), air=o.air||0, B=P.clone().addScaledVector(n,Rl*air);
  const flash=impAdd(new THREE.Sprite(new THREE.SpriteMaterial({ map:impGlow(), color:0xfff1d6, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false })));
  flash.position.copy(B).addScaledVector(n,Rl*0.01);
  const fb=impAdd(new THREE.Mesh(new THREE.SphereGeometry(1,32,16), new THREE.MeshBasicMaterial({ color:o.dart?0xffe2b0:0xff8a3a, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending, depthWrite:false })));
  fb.position.copy(B); fb.visible=!!o.dart;
  // Sirt bo'ylab tarqaladigan to'lqin — sferik qopqoqda chiziladi (yassi disk Yer chetidan koinotga "pichoq" bo'lib chiqardi)
  const ringMax=Math.min(Math.PI*0.9, S*(o.dart?1.4:2.2)*1.05);
  const ring=impAdd(new THREE.Mesh(new THREE.SphereGeometry(Rl*1.005,160,48,0,TAU,0,ringMax), impSoftOpacity(impGroundRingMat(0xffd8a8))));
  ring.quaternion.setFromUnitVectors(IMP_UP,n); ring.renderOrder=2;
  const capAng=Math.min(1.45,S*(air?1.25:0.8));
  const cap=impAdd(new THREE.Mesh(new THREE.SphereGeometry(Rl*1.006,64,14,0,TAU,0,capAng), air?impCapMat(0x3a2a1a,0x6a5638):(o.dark?impCapMat(0x140c08,0x3a2618):impCapMat(0x1a120c,0x7a6048))));
  cap.quaternion.setFromUnitVectors(IMP_UP,n); if(o.dart) cap.visible=false;
  const N=o.theia?1400:(air?90:(o.dart?700:360)), pos=new Float32Array(N*3), col=new Float32Array(N*3), vel=[];
  const sp=Rl*S*(o.theia?0.9:(o.dart?2.4:1.3));
  for(let i=0;i<N;i++){ const v=n.clone().multiplyScalar(o.dart?1.2+Math.random()*1.5:0.55+Math.random()*0.9).addScaledVector(t1,gRand()*(o.dart?0.35:0.7)).addScaledVector(t2,gRand()*(o.dart?0.35:0.7)).normalize().multiplyScalar(sp*(0.35+Math.random()));
    vel.push(v); pos.set([B.x,B.y,B.z],i*3); const h=Math.random(); col.set(o.dart?[0.8,0.78,0.72]:[1,0.45+h*0.4,0.15+h*0.2],i*3); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const deb=impAdd(new THREE.Points(g,new THREE.PointsMaterial({ map:impGlow(), size:Rl*(o.theia?0.05:(o.dart?0.12:0.022))*Math.max(1,S*2.2), vertexColors:true, transparent:true, opacity:1, blending:o.dart?THREE.NormalBlending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true })));
  deb.frustumCulled=false;
  const grav=o.dart?0:sp*0.75, life=o.dart?9:3.6;
  IMPX.fx.push({ t:0, S, update(dt){ const t=this.t+=dt, R=Rl;
    const f=Math.min(1,t/0.22); flash.scale.setScalar(R*S*(o.theia?6:4.2)*(0.3+0.7*f)*(1+t*0.4)); flash.material.opacity=Math.max(0,1-Math.max(0,t-0.15)/1.6);
    fb.scale.setScalar(R*S*(o.theia?0.9:0.55)*Math.min(1,t/0.9)**0.5); fb.material.opacity=Math.max(0,0.9-t/2.2);
    const rt=Math.max(0,t-(air?0.25:0.05)); ring.material.uniforms.uR.value=ringMax*0.95*Math.min(1,rt/2.6)**0.7; ring.material.opacity=rt>0?Math.max(0,0.75*(1-rt/2.6)):0; ring.material.uniforms.uCool.value=Math.min(1,rt/2.2); ring.visible=!o.theia;
    cap.material.uniforms.uA.value=Math.min(air?0.55:0.92,t/0.9); cap.material.uniforms.uHot.value=air?Math.max(0,0.5-t/2):Math.max(0,1-t/(o.theia?9:5));
    if(t<life){ const pa=g.attributes.position.array; for(let i=0;i<N;i++){ const v=vel[i]; let x=pa[i*3],y=pa[i*3+1],z=pa[i*3+2];
        const L=Math.hypot(x,y,z)||1; if(grav){ v.x-=x/L*grav*dt; v.y-=y/L*grav*dt; v.z-=z/L*grav*dt; }
        x+=v.x*dt; y+=v.y*dt; z+=v.z*dt; const L2=Math.hypot(x,y,z); if(L2<R*1.002){ const k=R*1.002/L2; x*=k;y*=k;z*=k; v.set(0,0,0); }
        pa[i*3]=x; pa[i*3+1]=y; pa[i*3+2]=z; }
      g.attributes.position.needsUpdate=true; deb.material.opacity=Math.min(1,(life-t)/1.2); if(!o.dart){ const c=Math.min(1,t/life); deb.material.color.setRGB(1,1-0.4*c,1-0.7*c); } } else deb.visible=false;
  } });
  if(o.theia){ // qaynoq disk — Oy shu moddadan yig'iladi
    const M=2600, dp=new Float32Array(M*3), dc=new Float32Array(M*3), ax=t2.clone(), e1=n.clone(), e2=new THREE.Vector3().crossVectors(ax,e1);
    for(let i=0;i<M;i++){ const a=Math.random()*TAU, r=Rl*(1.35+Math.pow(Math.random(),0.7)*2.4), h=gRand()*Rl*0.05;
      dp.set([ (e1.x*Math.cos(a)+e2.x*Math.sin(a))*r+ax.x*h, (e1.y*Math.cos(a)+e2.y*Math.sin(a))*r+ax.y*h, (e1.z*Math.cos(a)+e2.z*Math.sin(a))*r+ax.z*h ],i*3);
      const q=Math.random(); dc.set([1,0.5+q*0.35,0.25+q*0.2],i*3); }
    const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dp,3)); dg.setAttribute('color',new THREE.BufferAttribute(dc,3));
    const disk=new THREE.Points(dg,new THREE.PointsMaterial({ map:impGlow(), size:Rl*0.045, vertexColors:true, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false }));
    const dh=new THREE.Group(); dh.add(disk); impAdd(dh); disk.frustumCulled=false;
    const q=new THREE.Quaternion();
    IMPX.fx.push({ t:0, update(dt){ const t=this.t+=dt; disk.material.opacity=Math.min(0.9,Math.max(0,(t-1.2)/3)); q.setFromAxisAngle(ax,dt*0.35); dh.quaternion.premultiply(q); } });
  }
}
// ---------- Kengaytirilgan zarba effektlari: olovli gumbaz, qo'ziqorin bulut, otilma parda, zarba to'lqini, chang ----------
const IMP_NOISE='float h3(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }'+
 'float n3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f); return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }'+
 'float fb3(vec3 p){ return n3(p)*0.5+n3(p*2.1)*0.25+n3(p*4.3)*0.125+n3(p*8.7)*0.0625; }\n';
function impFireMat(){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false,
  uniforms:{ uT:{value:0}, uHeat:{value:1}, uA:{value:0}, uSeed:{value:Math.random()*50} },
  vertexShader:IMP_NOISE+'uniform float uT,uSeed; varying vec3 vP; varying vec3 vN; varying vec3 vV;'+
   'void main(){ vec3 p=position; float d=fb3(p*2.6+vec3(uSeed,-uT*1.4,0.0)); p+=normal*(d-0.45)*0.4; vP=p;'+
   ' vec4 wp=modelMatrix*vec4(p,1.0); vN=normalize(mat3(modelMatrix)*normal); vV=normalize(cameraPosition-wp.xyz); gl_Position=projectionMatrix*viewMatrix*wp; }',
  fragmentShader:IMP_NOISE+'uniform float uT,uHeat,uA,uSeed; varying vec3 vP; varying vec3 vN; varying vec3 vV;'+
   'void main(){ float f=fb3(vP*3.4+vec3(uSeed,-uT*2.0,uT*0.3)); float fr=abs(dot(normalize(vN),vV));'+
   ' float h=clamp(uHeat*(0.3+0.95*f)*(0.5+0.65*fr),0.0,1.2);'+
   ' vec3 c=mix(vec3(0.09,0.065,0.05),vec3(0.72,0.17,0.04),smoothstep(0.08,0.34,h));'+
   ' c=mix(c,vec3(1.0,0.6,0.16),smoothstep(0.34,0.68,h)); c=mix(c,vec3(1.0,0.96,0.84),smoothstep(0.68,1.05,h));'+
   ' gl_FragColor=vec4(c*(1.0+h*0.5), uA*smoothstep(0.0,0.4,fr)*(0.55+0.45*f)); }' }); }
function impCurtainMat(){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, side:THREE.DoubleSide,
  uniforms:{ uA:{value:0}, uHeat:{value:1}, uSeed:{value:Math.random()*50} },
  vertexShader:'varying vec2 vUv; varying vec3 vP; void main(){ vUv=uv; vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:IMP_NOISE+'uniform float uA,uHeat,uSeed; varying vec2 vUv; varying vec3 vP;'+
   'void main(){ float a=atan(vP.z,vP.x); float s=fb3(vec3(a*7.0,vUv.y*2.5,uSeed)); float st=smoothstep(0.32,0.72,s); float y=vUv.y;'+
   ' vec3 c=mix(vec3(1.3,0.62,0.2),vec3(0.42,0.33,0.26),smoothstep(0.0,0.55,y+(1.0-uHeat)*0.7));'+
   ' gl_FragColor=vec4(c, uA*pow(1.0-y,1.4)*(0.25+0.75*st)*smoothstep(0.0,0.06,y)); }' }); }
// Zarba to'lqini gumbazi: faqat ingichka, notekis "kondensatsiya" qirrasi xira porlaydi (avval qalin oppoq yoylar edi)
function impShockMat(){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{ uA:{value:0} },
  vertexShader:'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP=position; vec4 wp=modelMatrix*vec4(position,1.0); vN=normalize(mat3(modelMatrix)*normal); vV=normalize(cameraPosition-wp.xyz); gl_Position=projectionMatrix*viewMatrix*wp; }',
  fragmentShader:IMP_NOISE+'uniform float uA; varying vec3 vN; varying vec3 vV; varying vec3 vP;'+
   'void main(){ float r=1.0-abs(dot(normalize(vN),vV)); float n=fb3(vP*6.0);'+
   ' gl_FragColor=vec4(mix(vec3(0.95,0.8,0.6),vec3(0.8,0.86,0.98),r)*pow(r,6.0)*uA*0.2*(0.5+0.9*n),1.0); }' }); }
/* Yer bo'ylab tarqaladigan zarba/chang halqasi: yumshoq chetli, ichida notekis chang tolalari; kengaygan sari
   issiq rangdan kulrang changga o'tadi (uCool). Yassi bir xil oq halqa o'rniga. */
function impRingMat(hex, inner){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, side:THREE.DoubleSide, blending:THREE.AdditiveBlending,
  uniforms:{ uA:{value:0}, uCool:{value:0}, uC:{value:new THREE.Color(hex)}, uIn:{value:inner} },
  vertexShader:'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:IMP_NOISE+'uniform float uA,uCool,uIn; uniform vec3 uC; varying vec3 vP;'+
   'void main(){ float r=length(vP.xy); float t=clamp((r-uIn)/(1.0-uIn),0.0,1.0); float a=atan(vP.y,vP.x);'+
   ' float band=smoothstep(0.0,0.55,t)*(1.0-smoothstep(0.82,1.0,t)); float n=fb3(vec3(a*6.0,r*9.0,uCool*3.0));'+
   ' vec3 c=mix(uC,vec3(0.42,0.36,0.3),uCool);'+
   ' gl_FragColor=vec4(c*(0.5+0.9*n), uA*band*(0.35+0.65*n)); }' }); }
// Sferik qopqoqdagi to'lqin: markazdan (qopqoq o'qi +Y) burchakli masofa uR atrofida yumshoq tasma;
// tasma kengaygan sari kengayadi va issiq rangdan kulrang changga o'tadi.
function impGroundRingMat(hex){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  polygonOffset:true, polygonOffsetFactor:-3, polygonOffsetUnits:-3,
  uniforms:{ uA:{value:0}, uR:{value:0}, uCool:{value:0}, uC:{value:new THREE.Color(hex)} },
  vertexShader:'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:IMP_NOISE+'uniform float uA,uR,uCool; uniform vec3 uC; varying vec3 vP;'+
   'void main(){ vec3 d=normalize(vP); float ang=acos(clamp(d.y,-1.0,1.0)); float w=0.02+uR*0.22;'+
   ' float x=(ang-uR)/w; float band=exp(-x*x*2.2)*smoothstep(-2.5,0.0,x+1.2);'+
   ' float n=fb3(vec3(atan(d.z,d.x)*5.0, ang*30.0, uCool*2.0)); vec3 c=mix(uC,vec3(0.45,0.38,0.31),uCool);'+
   ' gl_FragColor=vec4(c*(0.55+0.8*n), uA*band*(0.35+0.65*n)); }' }); }
// Oddiy materialdek ishlatish uchun: .opacity → uA (mavjud animatsiya kodi o'zgarmaydi)
function impSoftOpacity(m){ Object.defineProperty(m,'opacity',{ get:()=>m.uniforms.uA.value, set:v=>{ if(m.uniforms) m.uniforms.uA.value=v; }, configurable:true });
  m.color=m.uniforms.uC.value; return m; }   // .color.setRGB(...) ham ishlaydi
function impDustMat(nL){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false,
  uniforms:{ uA:{value:0}, uAng:{value:0}, uN:{value:nL.clone()}, uT:{value:0} },
  vertexShader:'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader:IMP_NOISE+'uniform float uA,uAng,uT; uniform vec3 uN; varying vec3 vP;'+
   'void main(){ float d=acos(clamp(dot(vP,uN),-1.0,1.0)); float f=fb3(vP*5.0+vec3(uT*0.05,0.0,uT*0.02)); float w=0.25*clamp(uAng,0.2,1.0);'+
   ' float e=uAng+(f-0.5)*0.5*min(1.0,uAng); float a=uA*(1.0-smoothstep(e-w,e,d))*(0.5+0.5*f);'+
   ' gl_FragColor=vec4(mix(vec3(0.15,0.11,0.08),vec3(0.45,0.36,0.27),f),a); }' }); }
function impFlash(wpLocal, s){
  IMPX.grp.updateMatrixWorld(true); const v=IMPX.grp.localToWorld(wpLocal.clone()).project(camera);
  const x=((v.x+1)/2*100).toFixed(1), y=((1-v.y)/2*100).toFixed(1);
  let f=IMPX.flashEl; if(!f){ f=document.createElement('div'); f.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:28;opacity:0'; document.body.appendChild(f); IMPX.flashEl=f; }
  f.style.transition='none'; f.style.opacity='1';
  f.style.background=`radial-gradient(circle at ${x}% ${y}%, rgba(255,250,236,${Math.min(0.95,0.5+s*0.35)}) 0%, rgba(255,196,120,${(0.32*s).toFixed(2)}) 16%, rgba(255,140,60,0) 58%)`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ f.style.transition='opacity 1.6s ease-out'; f.style.opacity='0'; }));
  IMPX.shake=s;
}
function impShake(dt){
  const el=renderer.domElement;
  if(IMPX.shake>0.02){ const a=IMPX.shake*9; el.style.transform=`translate(${((Math.random()-0.5)*a).toFixed(1)}px,${((Math.random()-0.5)*a).toFixed(1)}px)`; IMPX.shake*=Math.pow(0.03,dt); }
  else if(IMPX.shake){ IMPX.shake=0; el.style.transform=''; }
}
function impHitPlus(P,n,S,o){
  const Rl=IMPX.Rl, air=o.air||0, B=P.clone().addScaledVector(n,Rl*air), q=new THREE.Quaternion().setFromUnitVectors(IMP_UP,n), R=Rl*S;
  const fire=impAdd(new THREE.Mesh(new THREE.IcosahedronGeometry(1,5), impFireMat())); fire.quaternion.copy(q); fire.scale.setScalar(1e-4); fire.renderOrder=4;
  let stem=null; if(!air && !o.theia && !o.dart){ stem=impAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.55,1,1,32,6,true).translate(0,0.5,0), impFireMat())); stem.position.copy(P); stem.quaternion.copy(q); stem.scale.setScalar(1e-4); stem.renderOrder=4; }
  let cur=null; if(!air && !o.theia){ cur=impAdd(new THREE.Mesh(new THREE.CylinderGeometry(1,0.28,1,72,1,true).translate(0,0.5,0), impCurtainMat())); cur.position.copy(P); cur.quaternion.copy(q); cur.scale.setScalar(1e-4); cur.renderOrder=3; }
  const sh=impAdd(new THREE.Mesh(air?new THREE.SphereGeometry(1,48,24):new THREE.SphereGeometry(1,48,16,0,TAU,0,Math.PI/2), impShockMat())); sh.position.copy(air?B:P); sh.quaternion.copy(q); sh.scale.setScalar(1e-4); sh.renderOrder=5;
  let rim=null; if(!air && !o.dart){ rim=impAdd(new THREE.Mesh(new THREE.RingGeometry(0.6,1,128,4), impSoftOpacity(impRingMat(0xffa040, 0.6))));
    rim.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n); rim.position.copy(P).addScaledVector(n,Rl*0.004); rim.scale.setScalar(R*(o.theia?0.9:0.42)); rim.renderOrder=3; }
  let dust=null; if(!o.dart && (S>=0.3 || o.theia)){ dust=impAdd(new THREE.Mesh(new THREE.SphereGeometry(Rl*1.026,96,64), impDustMat(n))); dust.renderOrder=1; }
  const gmax=o.theia?2.6:2.2, big=o.theia?2:1;
  IMPX.fx.push({ t:0, update(dt){ const t=this.t+=dt;
    const g=Math.pow(Math.min(1,t/2.2),0.45), heat=Math.exp(-t/(o.theia?3:1.7)), fade=Math.max(0,1-Math.max(0,t-(o.theia?5:3.4))/2.6);
    const rise=(air?0.15:0.6)*R*Math.pow(Math.min(1,t/3.5),0.7);
    const fw=R*(o.theia?0.6:(o.dart?0.35:0.5))*g*big;
    fire.scale.set(fw, fw*(air||o.theia?1:0.72), fw); fire.position.copy(B).addScaledVector(n,rise+fw*0.35);
    const fu=fire.material.uniforms; fu.uT.value=t; fu.uHeat.value=0.25+0.95*heat; fu.uA.value=fade*Math.min(1,t/0.1);
    if(stem){ const su=stem.material.uniforms; stem.scale.set(fw*0.3, rise+fw*0.3, fw*0.3); su.uT.value=t; su.uHeat.value=0.2+0.8*heat; su.uA.value=fade*0.9*Math.min(1,t/0.3); }
    if(cur){ const k=Math.pow(Math.min(1,t/2.6),0.55); cur.scale.set(R*1.05*k*(o.dart?0.6:1), R*0.7*k*(o.dart?2.4:1), R*1.05*k*(o.dart?0.6:1)); const cu=cur.material.uniforms; cu.uHeat.value=o.dart?0:heat; cu.uA.value=Math.max(0,1-t/(o.dart?6:3.4))*Math.min(1,t/0.15)*0.9; }
    const sk=Math.min(1,t/1.8); sh.scale.setScalar(R*(air?2.4:3.2)*Math.pow(sk,0.6)+1e-4); sh.material.uniforms.uA.value=Math.max(0,1-sk)*1.5;
    if(rim){ const c=Math.min(1,t/(o.theia?12:8)); rim.material.opacity=Math.min(1,t/0.4)*(1-c*0.8); rim.material.color.setRGB(1,0.62-0.45*c,0.25-0.2*c); }
    if(dust){ const u=dust.material.uniforms; u.uT.value=t; u.uAng.value=Math.min(gmax, S*1.6*Math.pow(Math.min(1,t/3),0.6)+Math.max(0,t-3)*0.07); u.uA.value=Math.min(0.5,Math.max(0,(t-0.8)/3)); }
  } });
  impFlash(B, o.theia?1.6:(o.dart?0.35:Math.min(1.2,0.35+S*2)));
}
// Atmosferaga kirishdagi plazma izi
/* Plazma izi: boshida oq-sariq, so'ng to'q sariq → qizil va so'nadi; chetlari yumshoq (fresnel), olovli tolalar
   shovqin bilan siljiydi. Silindr: y=0 (vUv.y=0) — jism yonida, y=1 — iz uchi. */
function impTrailMat(dart){ return new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{ uA:{value:0}, uT:{value:0}, uHeat:{value:1}, uDart:{value:dart?1:0} },
  vertexShader:'varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vP;'+
   'void main(){ vUv=uv; vP=position; vec4 wp=modelMatrix*vec4(position,1.0); vN=normalize(mat3(modelMatrix)*normal); vV=normalize(cameraPosition-wp.xyz); gl_Position=projectionMatrix*viewMatrix*wp; }',
  fragmentShader:IMP_NOISE+'uniform float uA,uT,uHeat,uDart; varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vP;'+
   'void main(){ float y=vUv.y; float core=pow(abs(dot(normalize(vN),vV)),1.4);'+
   ' float a=atan(vP.z,vP.x); float fil=fb3(vec3(a*3.0, y*6.0-uT*9.0, uT*0.7));'+
   ' float fade=pow(1.0-y,1.7)*smoothstep(0.0,0.04,y+0.02);'+
   ' vec3 hot=mix(vec3(1.0,0.82,0.5),vec3(1.0,0.5,0.14),smoothstep(0.0,0.3,y)); hot=mix(hot,vec3(0.5,0.1,0.03),smoothstep(0.3,0.95,y));'+
   ' vec3 c=mix(hot, vec3(0.6,0.8,1.0)*(1.0-y), uDart);'+
   // yorqinlik 1 dan oshmasin — aks holda qo'shiluvchi (additive) aralashuvda iz oppoq "chiroq konusi"ga aylanardi
   ' gl_FragColor=vec4(min(c*(0.55+0.45*fil)*min(uHeat,1.0), vec3(1.0)), uA*0.6*fade*core*(0.4+0.6*fil)); }' }); }
function impTrail(im, dt, emit, heat){
  const T=im.tr, pa=T.g.attributes.position.array, ca=T.g.attributes.color.array, dart=IMPX.cfg.target==='dart';
  if(emit){ for(let e=0;e<3;e++){ const i=T.i=(T.i+1)%T.N, j=im.r*0.35;
      pa[i*3]=im.head.position.x+gRand()*j; pa[i*3+1]=im.head.position.y+gRand()*j; pa[i*3+2]=im.head.position.z+gRand()*j; T.age[i]=0; T.h[i]=dart?0.35:0.25+0.9*heat; } }
  for(let i=0;i<T.N;i++){ const a=T.age[i]+=dt, k=Math.max(0,1-a/1.8)*T.h[i];
    if(dart){ ca[i*3]=0.55*k; ca[i*3+1]=0.75*k; ca[i*3+2]=k; } else { ca[i*3]=k; ca[i*3+1]=k*(0.45+0.4*k); ca[i*3+2]=k*0.25*k; } }
  T.g.attributes.position.needsUpdate=true; T.g.attributes.color.needsUpdate=true;
}
// ---------- Zarba beruvchi jismlar: har bir hodisaga mos haqiqiy shakl ----------
function impRng(s){ return ()=>{ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const IMP_BODY={
  vredefort:{ ax:[1.25,0.92,0.84], rough:0.34, f:1.7, cr:14, crR:[0.18,0.5], crD:0.12, c0:0x5f554b, c1:0x8d7f6d, ro:0.95, me:0.02 },   // S-tipli toshli asteroid (~10–15 km)
  chicxulub:{ ax:[1.12,1,0.9], rough:0.3, f:1.5, cr:18, crR:[0.15,0.45], crD:0.13, c0:0x25221f, c1:0x423c35, ro:1, me:0 },          // uglerodli xondrit (~10 km, qorong'i)
  iron:{ ax:[1.32,0.82,0.74], rough:0.2, f:2.2, cr:34, crR:[0.1,0.24], crD:0.07, c0:0x4c4843, c1:0x8f867b, ro:0.42, me:0.8, flat:1 },   // temir-nikel (Canyon Diablo, ~50 m)
  stony:{ ax:[1.22,0.95,0.8], rough:0.32, f:1.9, cr:9, crR:[0.14,0.4], crD:0.1, c0:0x544b42, c1:0x7c6f61, ro:0.95, me:0.02 },          // toshli asteroid (Tunguska ~50 m)
  chondrite:{ ax:[1.62,0.86,0.7], rough:0.26, f:2.1, cr:7, crR:[0.12,0.3], crD:0.08, c0:0x5e5a53, c1:0x8e887d, ro:0.9, me:0.04 },       // LL-xondrit, cho'ziq (Chelyabinsk ~19 m)
  meteoroid:{ ax:[1.35,0.9,0.78], rough:0.36, f:2.4, cr:5, crR:[0.15,0.35], crD:0.09, c0:0x4f463e, c1:0x756756, ro:0.95, me:0.03, flat:1 }, // kichik meteoroid (Mars 2021, ~5–12 m)
  comet:{ ax:[1.3,0.9,0.85], rough:0.4, f:1.6, cr:6, crR:[0.2,0.45], crD:0.14, c0:0x1a1816, c1:0x34302a, ro:1, me:0 }                    // kometa yadrosi (SL9 bo'laklari)
};
function impRock(r,o,seed){
  const rnd=impRng(seed), g=new THREE.IcosahedronGeometry(1,5), p=g.attributes.position, N=p.count, col=new Float32Array(N*3);
  const cr=[]; for(let i=0;i<o.cr;i++){ const z=rnd()*2-1, t=rnd()*TAU, s=Math.sqrt(1-z*z); cr.push({ c:new THREE.Vector3(s*Math.cos(t),z,s*Math.sin(t)), R:o.crR[0]+(o.crR[1]-o.crR[0])*Math.pow(rnd(),1.6), D:o.crD*(0.6+rnd()*0.6) }); }
  const c0=new THREE.Color(o.c0), c1=new THREE.Color(o.c1), cc=new THREE.Color(), v=new THREE.Vector3(), so=rnd()*40;
  for(let i=0;i<N;i++){ v.fromBufferAttribute(p,i).normalize();
    let d=1+(fbm3(v.x*o.f+so,v.y*o.f,v.z*o.f-so,4,0.5,2.1)-0.5)*o.rough*2, pit=0;
    for(const c of cr){ const a=Math.acos(Math.max(-1,Math.min(1,v.dot(c.c))))/c.R;
      if(a<1){ d-=c.D*c.R*(1-a*a); pit=Math.max(pit,1-a); } else if(a<1.5){ d+=c.D*c.R*0.35*Math.exp(-Math.pow((a-1)/0.18,2)); } }
    const nz=fbm3(v.x*6+so,v.y*6,v.z*6,3,0.5,2.2);
    cc.copy(c0).lerp(c1,Math.min(1,Math.max(0,nz*1.25-0.1))).multiplyScalar(1-pit*0.35);
    col[i*3]=cc.r; col[i*3+1]=cc.g; col[i*3+2]=cc.b;
    p.setXYZ(i, v.x*d*o.ax[0]*r, v.y*d*o.ax[1]*r, v.z*d*o.ax[2]*r); }
  g.setAttribute('color',new THREE.BufferAttribute(col,3)); impSmoothNormals(g);
  const m=new THREE.MeshStandardMaterial({ vertexColors:true, roughness:o.ro, metalness:o.me, flatShading:!!o.flat, emissive:0xff4a14, emissiveIntensity:0 });
  impRockShader(m, o.flat?0.55:0.9);
  const mesh=new THREE.Mesh(g,m); mesh.userData.mat=m; return mesh;
}
/* r128 IcosahedronGeometry indekslanmagan — computeVertexNormals() har uchburchakka alohida normal berib, tosh qirrali
   "piksel" bo'lib ko'rinardi. Bir joydagi uchlar birlashtirilib, yuzaga qarab o'rtacha (silliq) normal hisoblanadi. */
function impSmoothNormals(g){
  const p=g.attributes.position, n=p.count, ids=new Map(), map=new Int32Array(n), acc=[];
  for(let i=0;i<n;i++){ const k=Math.round(p.getX(i)*1e6)+','+Math.round(p.getY(i)*1e6)+','+Math.round(p.getZ(i)*1e6);
    let id=ids.get(k); if(id===undefined){ id=acc.length/3; ids.set(k,id); acc.push(0,0,0); } map[i]=id; }
  const a=new THREE.Vector3(), b=new THREE.Vector3(), c=new THREE.Vector3(), cb=new THREE.Vector3(), ab=new THREE.Vector3();
  for(let i=0;i+2<n;i+=3){ a.fromBufferAttribute(p,i); b.fromBufferAttribute(p,i+1); c.fromBufferAttribute(p,i+2);
    cb.subVectors(c,b).cross(ab.subVectors(a,b));   // uzunligi yuzaga proporsional — katta yuzlar ko'proq ta'sir qiladi
    for(let k=0;k<3;k++){ const j=map[i+k]*3; acc[j]+=cb.x; acc[j+1]+=cb.y; acc[j+2]+=cb.z; } }
  const nr=new Float32Array(n*3);
  for(let i=0;i<n;i++){ const j=map[i]*3, x=acc[j], y=acc[j+1], z=acc[j+2], l=Math.hypot(x,y,z)||1; nr[i*3]=x/l; nr[i*3+1]=y/l; nr[i*3+2]=z/l; }
  g.setAttribute('normal',new THREE.BufferAttribute(nr,3));
}
/* Asteroid sirtini realistik qiladi (MeshStandardMaterial'ga kichik qo'shimcha):
   - mayda relyef: obyekt koordinatasidagi shovqindan normal buziladi — poligon qirralari va "plastmassa" silliqligi yo'qoladi;
   - qizish faqat OLDINGI tomonda: atmosferaga kirganda havo jism oldida siqilib qiziydi, orqa tomon qorong'i qoladi
     (avval butun tosh bir tekis to'q sariq-oq porlardi). uLead — dunyo koordinatasida harakat yo'nalishi. */
function impRockShader(m, bumpK){
  m.userData.lead={ value:new THREE.Vector3(0,0,1) };
  m.onBeforeCompile=sh=>{
    sh.uniforms.uLead=m.userData.lead; sh.uniforms.uBump={ value:bumpK };
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vObj;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvObj=position;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vObj; uniform vec3 uLead; uniform float uBump;\n'+IMP_NOISE)
      .replace('#include <normal_fragment_maps>',
        '#include <normal_fragment_maps>\n'+
        '{ vec3 q=normalize(vObj)*7.0; float e=0.05, n0=fb3(q);\n'+
        '  vec3 gr=vec3(fb3(q+vec3(e,0,0))-n0, fb3(q+vec3(0,e,0))-n0, fb3(q+vec3(0,0,e))-n0)/e;\n'+
        '  normal=normalize(normal - (viewMatrix*vec4(gr,0.0)).xyz*0.06*uBump); }')
      .replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n'+
        '{ float lead=max(dot(normal, normalize((viewMatrix*vec4(uLead,0.0)).xyz)),0.0);\n'+
        '  totalEmissiveRadiance*=pow(lead,2.2)*(0.7+0.6*fb3(normalize(vObj)*5.0)); }');
  };
  m.customProgramCacheKey=()=>'impRock';
}
let _theiaTex=null;
function impTheiaTex(){ // Teya: Mars kattaligidagi yosh sayyora — bazalt po'st, kraterlar, yoriqlardan lava
  if(_theiaTex) return _theiaTex;
  const w=512,h=256, c=makeCanvas(w,h), e=makeCanvas(w,h), x=c.getContext('2d'), y=e.getContext('2d'), D=x.createImageData(w,h), E=y.createImageData(w,h);
  for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const la=90-(j+0.5)/h*180, lo=(i+0.5)/w*360-180, v=impLocalDir(la,lo), o=(j*w+i)*4;
    const b=fbm3(v.x*2.2+7,v.y*2.2,v.z*2.2,5,0.5,2.1), m=fbm3(v.x*0.9-3,v.y*0.9,v.z*0.9+5,3,0.5,2), k=ridged3(v.x*2.4+1.3,v.y*2.4,v.z*2.4-4.1,4);
    const lava=Math.pow(Math.max(0,k-0.6)/0.4,1.8)*(0.4+0.6*m), s=0.55+b*0.7;
    D.data[o]=(70+m*50)*s; D.data[o+1]=(52+m*28)*s; D.data[o+2]=(42+m*14)*s; D.data[o+3]=255;
    E.data[o]=255*Math.min(1,lava*1.6); E.data[o+1]=120*lava+80*lava*lava; E.data[o+2]=30*lava*lava; E.data[o+3]=255; }
  x.putImageData(D,0,0); y.putImageData(E,0,0);
  return _theiaTex={ map:asTexture(c), em:asTexture(e) };
}
function impBody(kind,r,seed){
  if(kind==='theia'){ const t=impTheiaTex();
    const m=new THREE.MeshStandardMaterial({ map:t.map, emissiveMap:t.em, emissive:0xffffff, emissiveIntensity:0.9, roughness:0.95, metalness:0 });
    const s=new THREE.Mesh(new THREE.SphereGeometry(r,96,64),m); s.userData.mat=m; s.userData.e0=0.9; return s; }
  if(kind==='dart'){ // DART: ~1,2 m korpus, 2×8,5 m ROSA panellari, DRACO kamerasi, yo'naltirilgan antenna
    const G=new THREE.Group(), bus=new THREE.MeshStandardMaterial({ color:0xc9a650, metalness:0.7, roughness:0.35 }),
      pan=new THREE.MeshStandardMaterial({ color:0x1a2a58, metalness:0.35, roughness:0.4, emissive:0x08122e }), gr=new THREE.MeshStandardMaterial({ color:0x9a9a9a, metalness:0.6, roughness:0.4 });
    const u=r*0.55; G.add(new THREE.Mesh(new THREE.BoxGeometry(u,u,u*1.1),bus));
    [1,-1].forEach(s=>{ const a=new THREE.Mesh(new THREE.CylinderGeometry(u*0.04,u*0.04,u*0.9,8),gr); a.rotation.z=Math.PI/2; a.position.x=s*u*0.95; G.add(a);
      const p=new THREE.Mesh(new THREE.BoxGeometry(u*7,u*0.03,u*1.9),pan); p.position.x=s*u*4.9; G.add(p);
      const rl=new THREE.Mesh(new THREE.CylinderGeometry(u*0.07,u*0.07,u*1.95,10),gr); rl.rotation.x=Math.PI/2; rl.position.x=s*u*8.4; G.add(rl); });
    const cam=new THREE.Mesh(new THREE.CylinderGeometry(u*0.16,u*0.2,u*0.5,16),gr); cam.rotation.x=Math.PI/2; cam.position.z=u*0.8; G.add(cam);
    const dish=new THREE.Mesh(new THREE.SphereGeometry(u*0.55,24,8,0,TAU,0,Math.PI*0.28),gr); dish.material.side=THREE.DoubleSide; dish.position.y=u*0.62; G.add(dish);
    G.userData.noSpin=1; return G; }
  const o=IMP_BODY[kind]||IMP_BODY.stony, rock=impRock(r,o,Math.round(seed*997)+kind.length*31);
  if(kind==='comet'){ const G=new THREE.Group(); G.add(rock); G.userData.mat=rock.userData.mat;
    G.add(new THREE.Sprite(new THREE.SpriteMaterial({ map:impGlow(), color:0xcfe4ff, transparent:true, opacity:0.55, blending:THREE.AdditiveBlending, depthWrite:false })));
    G.children[1].scale.setScalar(r*9); return G; }
  return rock;
}
function impMakeImpactor(P,n,cfg,delay){
  const Rl=IMPX.Rl, {t1,t2}=impFrame(n), a=(cfg.ang||45)*Math.PI/180;
  const dir=n.clone().multiplyScalar(Math.cos(a)).addScaledVector(t1,-Math.sin(a)).addScaledVector(t2,0.25).normalize();
  const tgt=P.clone().addScaledVector(n,Rl*(cfg.air||0)), from=tgt.clone().addScaledVector(dir,Rl*(cfg.target==='dart'?16:(cfg.theia?4.5:3.4)));
  const r=Math.max(Rl*cfg.k, Rl*0.02);
  const head=impBody(cfg.body||(cfg.target==='dart'?'dart':(cfg.theia?'theia':'stony')), r, delay);
  if(cfg.body==='dart'||cfg.target==='dart') head.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), dir.clone().negate());
  impAdd(head); head.position.copy(from);
  const glow=impAdd(new THREE.Sprite(new THREE.SpriteMaterial({ map:impGlow(), color:cfg.target==='dart'?0xbfe0ff:(cfg.body==='comet'?0xd6ecff:0xffc080), transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false })));
  const trail=impAdd(new THREE.Mesh(new THREE.CylinderGeometry(0,1,1,32,24,true), impTrailMat(cfg.target==='dart')));
  trail.quaternion.setFromUnitVectors(IMP_UP, dir);
  const TN=280, tp=new Float32Array(TN*3), tc=new Float32Array(TN*3), tg=new THREE.BufferGeometry();
  for(let i=0;i<TN;i++) tp.set([from.x,from.y,from.z],i*3);
  tg.setAttribute('position',new THREE.BufferAttribute(tp,3)); tg.setAttribute('color',new THREE.BufferAttribute(tc,3));
  // Iz zarralari: mayda va zich — alohida to'q sariq "dog'lar" emas, uzluksiz cho'g' oqimi
  const tpts=impAdd(new THREE.Points(tg,new THREE.PointsMaterial({ map:impGlow(), size:Math.max(r*1.1,Rl*0.009), vertexColors:true, transparent:true, opacity:0.8, blending:THREE.AdditiveBlending, depthWrite:false }))); tpts.frustumCulled=false;
  const tr={ g:tg, N:TN, i:0, age:new Float32Array(TN).fill(9), h:new Float32Array(TN) };
  return { head, glow, trail, tr, from, tgt, P, n, dir, r, delay, tin:Math.max(cfg.tin||2.4, IMPX.chase?4.2:0), hit:false };
}
// ---------- Davr teksturalari: Yer hodisa sodir bo'lgan davrdagidek ----------
const ERA={ cache:{}, saved:null, hidden:[] };
function eraImg(src){ return new Promise(res=>{ let n=0; const im=new Image(); im.decoding='async';
  im.onload=()=>res(im); im.onerror=()=>{ if(++n>5) return res(null); setTimeout(()=>{ im.src=src+'?r='+n; },500*n); }; im.src=src; }); }
function eraFlat(r,g,b){ const c=makeCanvas(2,2), x=c.getContext('2d'); x.fillStyle=`rgb(${r},${g},${b})`; x.fillRect(0,0,2,2); return asTexture(c,false); }
function eraRough(cv){ const w=512,h=256,c=makeCanvas(w,h),x=c.getContext('2d'); x.drawImage(cv,0,0,w,h); const d=x.getImageData(0,0,w,h),p=d.data;
  for(let k=0;k<p.length;k+=4){ const r=p[k],g=p[k+1],b=p[k+2], oc=b>r+14 && b>=g-6 && r+g+b<360; p[k]=p[k+1]=p[k+2]=oc?33:235; }
  x.putImageData(d,0,0); return asTexture(c,false); }
const eraLL=(i,j,w,h)=>[90-(j+0.5)/h*180, (i+0.5)/w*360-180];
async function eraBuild(cfg){
  const era=cfg.era; if(ERA.cache[era]) return ERA.cache[era];
  let day, night=null, rough=null;
  if(era==='now'||era==='k66'||era==='ice'){
    const im=await eraImg(era==='k66'?'photos/earth-66ma.jpg':'photos/earth-now.jpg'); if(!im) return null;
    const w=2048,h=1024; day=makeCanvas(w,h); const x=day.getContext('2d'); x.drawImage(im,0,0,w,h);
    if(era==='ice'){ // ~50 ming yil avval: Laurentide, Kordilyera, Skandinaviya muz qalqonlari + dengiz muzi
      const d=x.getImageData(0,0,w,h), p=d.data;
      const edge=lon=> lon<-141?64 : lon<-120?52 : lon<-60?48.5 : lon<-12?90 : lon<0?54 : lon<62?57 : 90;
      for(let j=0;j<h;j++){ const lat=90-(j+0.5)/h*180; if(lat<44 && lat>-40) continue;
        for(let i=0;i<w;i++){ const lon=(i+0.5)/w*360-180, k=(j*w+i)*4, r=p[k],g=p[k+1],b=p[k+2];
          const ocean=b>r+14 && b>=g-6 && r+g+b<360, v=impLocalDir(lat,lon), nz=fbm3(v.x*4+3,v.y*4,v.z*4-2,3,0.5,2.1)-0.5;
          let ice=0;
          if(!ocean){ const L=edge(lon)+nz*7; ice=sstep(L-1.2,L+1.2,lat); if(lat<-42 && lon>-76 && lon<-68) ice=Math.max(ice,sstep(-42,-45,lat)); }
          else ice=Math.max(sstep(70,76,lat+nz*6), sstep(-58,-64,lat+nz*6))*0.85;
          if(ice>0){ const s=0.9+nz*0.2; p[k]=r+(236*s-r)*ice; p[k+1]=g+(242*s-g)*ice; p[k+2]=b+(250*s-b)*ice; }
          else if(!ocean && lat>30){ const t=0.22; p[k]=r+(150-r)*t; p[k+1]=g+(142-g)*t; p[k+2]=b+(112-b)*t; } } }
      x.putImageData(d,0,0);
    }
    rough=eraRough(day); night=eraFlat(3,5,10);
  } else if(era==='theia'){ // magma okeani: qoraygan po'st yoriqlaridan lava porlaydi
    const cr=sphereField(EW,EH,3.2,(x,y,z)=>ridged3(x*1.3+3.1,y*1.3-7.7,z*1.3+1.9,4),2), F=earthFields();
    const glow=k=>Math.pow(Math.max(0,cr[k]-0.42)/0.58,1.5);
    day=pixCanvas(EW,EH,(i,j,k,d,o)=>{ const g=glow(k), c=0.55+F.detail[k]*0.6;
      d[o]=Math.min(255,46*c+255*g); d[o+1]=Math.min(255,24*c+90*g+110*g*g); d[o+2]=Math.min(255,18*c+40*g*g); });
    const nc=pixCanvas(EW,EH,(i,j,k,d,o)=>{ const g=glow(k); d[o]=Math.min(255,20+230*g); d[o+1]=Math.min(255,6+70*g+60*g*g); d[o+2]=4+20*g*g; });
    night=asTexture(nc); rough=eraFlat(235,235,235);
  } else if(era==='p2ga'){ // ~2 mlrd yil: kichik yalang'och kratonlar, o'simliksiz quruqlik
    const F=earthFields(), T=impLocalDir(cfg.lat,cfg.lon), SEA=F.SEA+0.035;
    const land=new Float32Array(EW*EH);
    day=pixCanvas(EW,EH,(i,j,k,d,o)=>{ const [la,lo]=eraLL(i,j,EW,EH), v=impLocalDir(la,lo), a=Math.acos(Math.max(-1,Math.min(1,v.dot(T))));
      const c=F.cont[k]+0.1*Math.exp(-Math.pow(a/0.22,2)), m=F.mtn[k], dt=F.detail[k];
      if(c<=SEA){ const dep=Math.min(1,(SEA-c)/0.2); d[o]=10+(1-dep)*34; d[o+1]=42+(1-dep)*54; d[o+2]=60+(1-dep)*48; return; }
      land[k]=1; const rock=Math.min(1,Math.max(0,m-0.55)*2.4), s=0.8+dt*0.45;
      d[o]=(118+rock*30)*s; d[o+1]=(86+rock*38)*s; d[o+2]=(64+rock*44)*s; });
    rough=eraRough(day); night=eraFlat(2,3,6);
  }
  const res={ day:asTexture(day), night, rough, norm:eraFlat(128,128,255) };
  ERA.cache[era]=res; return res;
}
async function eraApply(rec,cfg){
  ERA.hidden=[];
  const hide=o=>{ if(o && o.visible){ o.visible=false; ERA.hidden.push(o); } };
  const erR=orbitObjects.find(r=>r.key==='earth'); (erR.extras.sats||[]).forEach(s=>hide(s.pivot));
  Object.values(CRAFT).forEach(c=>{ if(c.pivot) hide(c.obj); else if(c.obj && c.obj.parent===orbitObjects.find(r=>r.key==='earth').pivot) hide(c.obj); });
  if(cfg.target!=='earth' || !cfg.era){ IMPX.ready=true; return; }
  if(cfg.era==='theia' && rec.extras.moonPivot) hide(rec.extras.moonPivot);
  const U=rec.mesh.material.uniforms, cl=rec.extras.clouds;
  ERA.saved={ rec, day:U.dayTex.value, night:U.nightTex.value, norm:U.normTex.value, rough:U.roughTex.value, cl:cl?cl.material.opacity:0, real:U.realMap?U.realMap.value:0 };
  // Bugungi davr (Tunguska, Chelyabinsk): yuklangan haqiqiy NASA xaritasi earth-now.jpg dan sifatliroq — o'sha qoladi
  const t=(cfg.era==='now' && window.__REALTEX && window.__REALTEX.earth) ? null : await eraBuild(cfg);
  if(IMPX.rec!==rec || !ERA.saved) return;
  // Davr xaritasi o'zining relyef/okean xaritalari bilan keladi — "haqiqiy NASA tekstura" rejimi vaqtincha o'chadi
  if(t){ U.dayTex.value=t.day; U.nightTex.value=t.night; U.normTex.value=t.norm; U.roughTex.value=t.rough; if(U.realMap) U.realMap.value=0; }
  if(cl) cl.material.opacity=cfg.era==='theia'?0:0.28;
  IMPX.ready=true;
}
function eraRestore(){
  ERA.hidden.forEach(o=>o.visible=true); ERA.hidden=[];
  const s=ERA.saved; if(!s) return; ERA.saved=null;
  const U=s.rec.mesh.material.uniforms; U.dayTex.value=s.day; U.nightTex.value=s.night; U.normTex.value=s.norm; U.roughTex.value=s.rough; if(U.realMap) U.realMap.value=s.real;
  if(s.rec.extras.clouds) s.rec.extras.clouds.material.opacity=s.cl;
}
// ---------- Ta'sir hududlari: sirtdagi konsentrik zonalar + yorliqlar ----------
const IMP_RKM={ earth:6371, jupiter:69911, mars:3390 };
const ZCOL=['#ff5a3c','#ff9a3c','#ffd25a','#8fd0ff'];
function impZones(n){
  const zs=IMPX.meta.zones||[]; if(!zs.length || !IMPX.grp) return;
  const Rl=IMPX.Rl, Rkm=IMP_RKM[IMPX.cfg.target]||6371, {t1,t2}=impFrame(n), q=new THREE.Quaternion().setFromUnitVectors(IMP_UP,n), sm=IMPX.cfg.small;
  let prev=0;
  if(!IMPX.lblBox){ const b=document.createElement('div'); b.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:29'; document.body.appendChild(b); IMPX.lblBox=b; }
  IMPX.zones=zs.map((z,i)=>{
    let th=Math.min(Math.PI*0.995, z[0]/Rkm); th=Math.max(th, prev+(sm?0.03:0.012), sm?0.025:0.008); prev=th;
    const col=ZCOL[Math.min(i,ZCOL.length-1)], glob=th>2.6;
    const fill=impAdd(new THREE.Mesh(new THREE.SphereGeometry(Rl*1.003,96,Math.max(4,Math.ceil(th*28)),0,TAU,0,th),
      new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:0, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-3, polygonOffsetUnits:-3 })));
    const bw=Math.min(th*0.07+0.003,0.025);
    const edge=impAdd(new THREE.Mesh(new THREE.SphereGeometry(Rl*1.006,160,1,0,TAU,Math.max(0,th-bw),bw),
      new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:0, depthWrite:false, side:THREE.DoubleSide, blending:THREE.AdditiveBlending })));
    fill.quaternion.copy(q); edge.quaternion.copy(q); edge.visible=!glob; fill.renderOrder=2; edge.renderOrder=2;
    const a=0.5+i*0.9, ta=glob?1.1:th;
    const anchor=n.clone().multiplyScalar(Math.cos(ta)).addScaledVector(t2.clone().multiplyScalar(Math.cos(a)).addScaledVector(t1,Math.sin(a)),Math.sin(ta)).multiplyScalar(Rl*1.01);
    const el=document.createElement('div');
    el.style.cssText=`position:absolute;left:0;top:0;display:none;align-items:center;gap:6px;font-size:11.5px;font-weight:700;line-height:1.25;color:#fff;padding:4px 9px;border-radius:9px;background:rgba(6,8,18,.78);border:1px solid ${col};max-width:220px;white-space:normal`;
    el.innerHTML=`<span style="flex:0 0 8px;height:8px;border-radius:50%;background:${col}"></span><span></span>`; el.lastChild.textContent=z[1];
    IMPX.lblBox.appendChild(el);
    return { fill, edge, anchor, glob, el, t0:0.9+i*0.6, op:glob?0.1:Math.max(0.12,0.36-i*0.08) };
  });
  IMPX.zt=0;
}
const _zv=new THREE.Vector3(), _zc=new THREE.Vector3();
function impZonesStep(dt){
  if(!IMPX.zones || !IMPX.grp) return;
  IMPX.zt+=dt; const t=IMPX.zt; IMPX.grp.updateMatrixWorld(true); IMPX.rec.mesh.getWorldPosition(_zc);
  IMPX.zones.forEach(z=>{ const k=Math.min(1,Math.max(0,(t-z.t0)/0.8)), pulse=0.75+0.25*Math.sin(t*2.4-z.t0*3);
    z.fill.material.opacity=z.op*k; z.edge.material.opacity=0.95*k*pulse;
    if(k<=0){ z.el.style.display='none'; return; }
    _zv.copy(z.anchor).applyMatrix4(IMPX.grp.matrixWorld);
    const nrm=_zv.clone().sub(_zc).normalize(), toCam=camera.position.clone().sub(_zv).normalize();
    if(nrm.dot(toCam)<0.05){ z.el.style.display='none'; return; }
    _zv.project(camera); if(_zv.z>1){ z.el.style.display='none'; return; }
    z.el.style.display='flex'; z.el.style.opacity=k;
    z.el.style.transform=`translate(${((_zv.x+1)/2*innerWidth).toFixed(1)}px,${((1-_zv.y)/2*innerHeight).toFixed(1)}px) translate(-50%,-120%)`; });
}
function impHud(show){
  if(!IMPX.hud){ const h=document.createElement('div'); h.className='glass'; h.id='impHud';
    h.style.cssText='position:fixed;left:14px;top:50%;transform:translateY(-50%);z-index:30;display:none;flex-direction:column;gap:6px;padding:10px 12px;border-radius:14px;width:min(250px,calc(100vw - 28px));text-align:left';
    const bs='flex:1 1 0;width:auto;min-width:0;min-height:0;margin:0;padding:6px 4px;font-size:11.5px;border-radius:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    h.innerHTML=`<div id="impHn" style="font-size:13px;font-weight:800;line-height:1.25"></div><div id="impHd" style="font-size:11px;color:var(--neon);font-weight:700"></div><div id="impHe" style="font-size:11px;line-height:1.35;color:var(--text)"></div><div id="impHs" style="font-size:10.5px;color:var(--text-dim)"></div><div id="impHz" style="display:flex;flex-direction:column;gap:3px;font-size:10.5px;line-height:1.3;color:var(--text-dim)"></div><div style="display:flex;gap:5px;margin-top:2px"><button class="pbtn" id="impHr" style="${bs}"></button><button class="pbtn" id="impHc" style="${bs}"></button><button class="pbtn" id="impHx" style="${bs}"></button></div>`;
    document.body.appendChild(h); IMPX.hud=h;
    h.querySelector('#impHr').onclick=()=>{ playClick(700); const c=IMPX.cfg, m=IMPX.meta; impactPlay(c,m,true); };
    h.querySelector('#impHc').onclick=()=>{ playClick(660); IMPX.chase=!IMPX.chase; impHud(true); };
    h.querySelector('#impHx').onclick=()=>{ playClick(440); impactStop(true); }; }
  const h=IMPX.hud; h.style.display=show?'flex':'none'; if(!show) return;
  h.querySelector('#impHn').textContent=IMPX.meta.name||''; h.querySelector('#impHd').textContent=IMPX.meta.date||'';
  h.querySelector('#impHs').textContent=IMPX.meta.note||''; h.querySelector('#impHs').style.display=IMPX.meta.note?'block':'none';
  h.querySelector('#impHr').textContent='↻ '+(LANG==='ru'?'Повтор':(LANG==='en'?'Replay':'Qayta'));
  h.querySelector('#impHx').textContent='✕ '+(LANG==='ru'?'Закрыть':(LANG==='en'?'Close':'Yopish'));
  const cOn=IMPX.chase!==false; h.querySelector('#impHc').classList.toggle('active',cOn);
  h.querySelector('#impHc').textContent='🎥 '+(LANG==='ru'?'Слежение':(LANG==='en'?'Follow':'Ta’qib'));
  h.querySelector('#impHc').style.borderColor=cOn?'var(--neon)':''; h.querySelector('#impHc').style.opacity=cOn?'1':'0.6';
  h.querySelector('#impHe').textContent=IMPX.meta.era||''; h.querySelector('#impHe').style.display=IMPX.meta.era?'block':'none';
  const zs=IMPX.meta.zones||[];
  h.querySelector('#impHz').innerHTML=zs.map((z,i)=>`<span style="display:flex;align-items:flex-start;gap:6px"><span style="flex:0 0 7px;height:7px;margin-top:4px;border-radius:50%;background:${ZCOL[Math.min(i,ZCOL.length-1)]}"></span><span>${phEsc(z[1])}</span></span>`).join('');
}
function impClear(){
  if(IMPX.grp){ IMPX.grp.parent&&IMPX.grp.parent.remove(IMPX.grp); IMPX.grp.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); }
  IMPX.grp=null; IMPX.fx=[]; IMPX.imps=[]; IMPX.zones=null; IMPX.hitDone=false; IMPX.slowT=null;
  IMPX.shake=0; renderer.domElement.style.transform=''; if(IMPX.flashEl) IMPX.flashEl.style.opacity='0';
  if(IMPX.lblBox) IMPX.lblBox.innerHTML='';
  if(IMPX.rec && IMPX.spin0!=null){ IMPX.rec.spin=IMPX.spin0; } IMPX.spin0=null;
}
function impactStop(reopen){
  const lab=IMPX.meta&&IMPX.meta.lab;
  impClear(); eraRestore(); controls.enabled=true;
  if(IMPX.minD!=null){ controls.minDistance=IMPX.minD; IMPX.minD=null; }
  if(reopen && lab && window.LAB) setTimeout(()=>window.LAB.openLab(lab),60);
  if(IMPX.tmp){ IMPX.tmp.parent&&IMPX.tmp.parent.remove(IMPX.tmp); IMPX.tmp.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); IMPX.tmp=null; }
  IMPX.phase=null; IMPX.rec=null; impHud(false);
}
function impDartTarget(){
  const er=orbitObjects.find(r=>r.key==='earth'), g=new THREE.Group(); g.position.set(er.orbit+5,1.6,4.5); er.pivot.add(g);
  const rock=(r,seed)=>{ const geo=new THREE.IcosahedronGeometry(r,4), p=geo.attributes.position, v=new THREE.Vector3();
    for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); const k=1+0.08*Math.sin(v.x*9/r+seed)*Math.cos(v.y*7/r)+0.05*Math.sin(v.z*13/r+seed*2); v.multiplyScalar(k); p.setXYZ(i,v.x,v.y,v.z); }
    geo.computeVertexNormals(); return new THREE.Mesh(geo,new THREE.MeshStandardMaterial({ color:0x8c8378, roughness:1, emissive:0x1a1814, flatShading:true })); };
  const didy=rock(0.4,1.3); g.add(didy);
  const dimo=rock(0.1,4.1); dimo.scale.set(1.15,0.85,1); dimo.position.set(1.05,0,0.2); g.add(dimo);
  IMPX.tmp=g; return { mesh:dimo, radius:0.1, key:'dimorphos', extras:{} };
}
function impactPlay(cfg, meta, replay){
  if(tourActive) stopTour(false);
  if(!replay) eraRestore();
  if(cfg.plat!=null) cfg=Object.assign({},cfg,{lat:cfg.plat,lon:cfg.plon,plat:null});
  if(IMPX.chase==null) IMPX.chase=true;
  if(IMPX.minD==null){ IMPX.minD=controls.minDistance; controls.minDistance=0.05; }
  const keepTmp=replay && cfg.target==='dart' && IMPX.tmp;
  impClear(); if(!keepTmp && IMPX.tmp){ IMPX.tmp.parent.remove(IMPX.tmp); IMPX.tmp=null; }
  closePanel(); setActiveDock(null);
  let rec;
  if(cfg.target==='dart') rec=keepTmp?{ mesh:IMPX.tmp.children[1], radius:0.1, key:'dimorphos', extras:{} }:impDartTarget();
  else rec=orbitObjects.find(r=>r.key===cfg.target);
  if(!rec) return;
  IMPX.rec=rec; IMPX.cfg=cfg; IMPX.meta=meta||{}; IMPX.t=0; IMPX.phase='fly';
  if(!replay){ IMPX.ready=false; eraApply(rec,cfg); }
  const mesh=rec.mesh; IMPX.Rl=rec.radius/(mesh.scale.x||1);
  const dirL=cfg.target==='dart'?new THREE.Vector3(0.2,0.25,1).normalize():impLocalDir(cfg.lat,cfg.lon);
  IMPX.dirL=dirL;
  // zarba nuqtasi Quyoshga qarasin: o'q atrofida eng yaxshi burchakni topamiz
  IMPX.spin0=rec.spin!=null?rec.spin:null; if(rec.spin!=null) rec.spin=0;
  IMPX.rot0=mesh.rotation.y; IMPX.rot1=mesh.rotation.y;
  const c=new THREE.Vector3(); mesh.getWorldPosition(c); const toSun=c.clone().negate().normalize(), v=new THREE.Vector3();
  if(cfg.target!=='dart'){ let bd=-2; for(let i=0;i<72;i++){ const a=IMPX.rot0+i/72*TAU; mesh.rotation.y=a; mesh.updateMatrixWorld(true);
      v.copy(dirL).transformDirection(mesh.matrixWorld); const d=v.dot(toSun)+0.35*v.y; if(d>bd){ bd=d; IMPX.rot1=a; } } }
  mesh.rotation.y=IMPX.rot1; mesh.updateMatrixWorld(true);
  const nW=dirL.clone().transformDirection(mesh.matrixWorld);
  mesh.rotation.y=IMPX.rot0; mesh.updateMatrixWorld(true);
  const side=new THREE.Vector3().crossVectors(nW,IMP_UP); if(side.lengthSq()<1e-4) side.set(1,0,0); side.normalize();
  const dist=rec.radius*(cfg.cam||3);
  const offset=nW.clone().multiplyScalar(1).addScaledVector(side,0.6).addScaledVector(IMP_UP,0.3).normalize().multiplyScalar(dist);
  flight={ fromCam:camera.position.clone(), fromTgt:controls.target.clone(), offset, rec, t:0, dur:replay?1.2:2.6 };
  focusRec=null; impHud(true);
}
function impactStep(dt){
  if(!IMPX.phase) return;
  const rec=IMPX.rec, mesh=rec.mesh, cfg=IMPX.cfg;
  if(IMPX.phase==='fly'){
    const k=flight&&flight.rec===rec?easeInOut(Math.min(1,flight.t)):1;
    mesh.rotation.y=IMPX.rot0+(IMPX.rot1-IMPX.rot0)*k;
    if(!flight || flight.rec!==rec){ if(focusRec!==rec){ impactStop(); return; }   // foydalanuvchi boshqa joyga uchdi
      if(!IMPX.ready) return;   // davr teksturasi hali tayyor emas
      IMPX.cam0=camera.position.clone(); IMPX.tgt0=controls.target.clone();
      if(IMPX.chase){ focusRec=null; controls.enabled=false; }
      mesh.rotation.y=IMPX.rot1; IMPX.phase='play'; IMPX.t=-0.35;
      IMPX.grp=new THREE.Group(); mesh.add(IMPX.grp);
      const frags=cfg.frags||1;
      for(let i=0;i<frags;i++){ const d=frags>1?impLocalDir(cfg.lat+(Math.random()-0.5)*3, cfg.lon-14+i*7):IMPX.dirL;
        IMPX.imps.push(impMakeImpactor(d.clone().multiplyScalar(IMPX.Rl),d,cfg,i*1.1)); } }
    return;
  }
  let sd=dt; if(IMPX.slowT!=null){ IMPX.slowT+=dt; const k=Math.min(1,Math.max(0,(IMPX.slowT-1.4)/1.8)); sd=dt*(0.3+0.7*k); if(k>=1) IMPX.slowT=null; }
  IMPX.t+=sd; const Rl=IMPX.Rl;
  IMPX.imps.forEach(im=>{ const lt=IMPX.t-im.delay; if(im.hit){ impTrail(im,sd,false,0); return; } if(lt<0) return;
    const u=Math.min(1,lt/im.tin), e=u*u*(0.4+0.6*u)*0.55+u*0.45;
    im.head.position.lerpVectors(im.from,im.tgt,e); if(!im.head.userData.noSpin){ im.head.rotation.x+=dt*(cfg.theia?0.25:1.3); im.head.rotation.y+=dt*(cfg.theia?0.35:0.9); }
    const alt=Math.max(0,im.head.position.length()-Rl)/Rl, heat=cfg.target==='dart'?0.5:Math.min(1,Math.max(0,1-alt/0.6));
    const hm=im.head.userData.mat; if(hm){ hm.emissiveIntensity=(im.head.userData.e0||0)+heat*1.5;
      // qizish oldingi tomonda: harakat yo'nalishi (−dir) dunyo koordinatasida
      if(hm.userData.lead){ IMPX.grp.updateMatrixWorld(); hm.userData.lead.value.copy(im.dir).negate().transformDirection(IMPX.grp.matrixWorld); } }
    // Nur — jism OLDIDA (siqilgan qaynoq havo), kichikroq: avval jismni butunlay oqartirib yuborardi
    im.glow.position.copy(im.head.position).addScaledVector(im.dir,-im.r*0.55);
    im.glow.scale.setScalar(Math.max(im.r*3.4,Rl*0.03)*(0.45+heat)); im.glow.material.opacity=Math.min(1,u*3)*(0.12+0.55*heat*heat);
    const len=Rl*(cfg.target==='dart'?1.2:(0.25+0.9*heat))*(cfg.theia?2:1), w=Math.max(im.r*1.25,Rl*0.008);
    im.trail.scale.set(w,len,w); im.trail.position.copy(im.head.position).addScaledVector(im.dir,len/2);
    const tu=im.trail.material.uniforms; tu.uA.value=Math.min(1,u*3)*(0.3+0.7*heat); tu.uT.value=IMPX.t; tu.uHeat.value=cfg.target==='dart'?1:0.45+0.75*heat;
    impTrail(im,sd,true,heat);
    if(u>=1){ im.hit=true; im.head.visible=cfg.theia; im.glow.visible=false; im.trail.visible=false;
      impHit(im.P,im.n,cfg.frags?cfg.s*(0.7+Math.random()*0.6):cfg.s,{ air:cfg.air, theia:cfg.theia, dart:cfg.target==='dart', dark:cfg.target==='jupiter' });
      if(cfg.theia){ const h=im.head; IMPX.fx.push({ t:0, update(dt){ this.t+=dt; h.scale.setScalar(Math.max(0.01,1-this.t/1.4)); h.position.multiplyScalar(1-dt*0.25); if(this.t>1.4) h.visible=false; } }); }
      impHitPlus(im.P,im.n,cfg.frags?cfg.s*0.9:cfg.s,{ air:cfg.air, theia:cfg.theia, dart:cfg.target==='dart' });
      playClick(cfg.target==='dart'?900:180);
      if(!IMPX.hitDone){ IMPX.hitDone=true; IMPX.slowT=0; impZones(im.n); impAffectedView(im.n); } } });
  impChase(); impShake(dt);
  IMPX.fx.forEach(f=>f.update(sd));
  impZonesStep(dt);
}
const _cq1=new THREE.Vector3(), _cq2=new THREE.Vector3(), _cq3=new THREE.Vector3();
// Ta'qib kamerasi: asteroid ortidan, sayyora oldinda ko'rinadi
function impChase(){
  if(!IMPX.chase || IMPX.hitDone || !IMPX.cam0) return;
  const im=IMPX.imps[0]; if(!im) return;
  const rec=IMPX.rec, mesh=rec.mesh; mesh.updateMatrixWorld(true);
  im.head.getWorldPosition(_cq1);
  const dW=_cq2.copy(im.dir).transformDirection(mesh.matrixWorld), side=_cq3.crossVectors(dW,IMP_UP);
  if(side.lengthSq()<1e-4) side.set(1,0,0); side.normalize();
  const D=Math.max(im.r*mesh.scale.x*7, rec.radius*0.22, 0.3);
  const camP=_cq1.clone().addScaledVector(dW,D).addScaledVector(side,D*0.35).addScaledVector(IMP_UP,D*0.22);
  const b=easeInOut(Math.min(1,Math.max(0,(IMPX.t+0.35)/1.3)));
  camera.position.lerpVectors(IMPX.cam0,camP,b); controls.target.lerpVectors(IMPX.tgt0,_cq1,b);
}
// Zarbadan keyin: kamera ta'sir hududi ustiga chiqadi, sayyora shu tomonda to'xtab turadi
function impAffectedView(nL){
  const rec=IMPX.rec, mesh=rec.mesh, cfg=IMPX.cfg; mesh.updateMatrixWorld(true);
  const nW=nL.clone().transformDirection(mesh.matrixWorld);
  let th=0.2; (IMPX.zones||[]).forEach(z=>{ if(!z.glob) th=Math.max(th, Math.acos(Math.max(-1,Math.min(1,z.anchor.clone().normalize().dot(nL))))); });
  if(cfg.target==='dart') th=0.8;
  const dist=rec.radius*Math.min(cfg.target==='dart'?(cfg.cam||22):Math.max(cfg.cam||3,2.2), Math.max(1.5, 1.3+th*1.7));
  const offset=nW.clone().addScaledVector(IMP_UP,0.18).normalize().multiplyScalar(dist);
  controls.enabled=true;
  flight={ fromCam:camera.position.clone(), fromTgt:controls.target.clone(), offset, rec, t:0, dur:IMPX.chase?3.2:2.2 };
}

// ---------- Meteor yomg'irlari ----------
const SHOWERS = {
  perseids:   { ra:3.2,  dec:58.0, q:61, Q:430, inc:113, col:[0.7,0.85,1.0] },
  geminids:   { ra:7.47, dec:32.5, q:20, Q:150, inc:22,  col:[1.0,0.86,0.55] },
  leonids:    { ra:10.2, dec:21.6, q:62, Q:420, inc:162, col:[0.75,1.0,0.8] },
  quadrantids:{ ra:15.33,dec:49.7, q:70, Q:300, inc:72,  col:[0.85,0.8,1.0] }
};
const SHW = { key:null, stream:null, streaks:[], node:new THREE.Vector3(), acc:0, radiant:new THREE.Vector3() };
function buildStream(key){
  const S=SHOWERS[key], er=orbitObjects.find(r=>r.key==='earth');
  const eP=new THREE.Vector3(); er.mesh.getWorldPosition(eP); eP.y=0;
  const a=(S.q+S.Q)/2, e=(S.Q-S.q)/(S.Q+S.q), p=a*(1-e*e), R=eP.length();
  const nu0=Math.acos(Math.max(-1,Math.min(1,(p/R-1)/e)));        // orbita Yer orbitasini kesadigan nuqta
  const thE=Math.atan2(eP.z,eP.x), node=eP.clone().normalize();
  const inc=THREE.MathUtils.degToRad(S.inc);
  const N=3600, pos=new Float32Array(N*3), col=new Float32Array(N*3), siz=new Float32Array(N), P=[];
  for(let i=0;i<N;i++){
    const nu=(Math.random()*2-1)*Math.PI, M=nu;                     // taqsimot — oddiy
    P.push({ nu, dr:gRand()*2.2, dz:gRand()*1.6, sp:0.6+Math.random()*0.8 });
    const b=0.25+Math.random()*0.35; col[i*3]=S.col[0]*b; col[i*3+1]=S.col[1]*b; col[i*3+2]=S.col[2]*b; siz[i]=0.35+Math.random()*0.5;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('aColor',new THREE.BufferAttribute(col,3)); geo.setAttribute('aSize',new THREE.BufferAttribute(siz,1));
  const pts=new THREE.Points(geo, softPointsMaterial({ maxPx:3 })); pts.frustumCulled=false; scene.add(pts);
  // orbita chizig'i
  const lp=[]; for(let i=0;i<=240;i++){ const nu=(i/240*2-1)*Math.PI; lp.push(new THREE.Vector3(Math.cos(nu),0,Math.sin(nu)).multiplyScalar(p/(1+e*Math.cos(nu)))); }
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(lp), new THREE.LineBasicMaterial({ color:new THREE.Color(...S.col), transparent:true, opacity:0.35, depthWrite:false }));
  const grp=new THREE.Group(); grp.add(line);
  // yo'nalish: nu0 nuqtasi Yer yo'nalishiga tushsin, keyin tugunlar chizig'i atrofida qiyalatamiz
  const q1=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -(thE-nu0));
  const q2=new THREE.Quaternion().setFromAxisAngle(node, inc);
  const Q=q2.multiply(q1);
  grp.quaternion.copy(Q); pts.quaternion.copy(Q); scene.add(grp);
  return { pts, grp, P, p, e, geo };
}
function stopShower(){
  if(SHW.stream){ scene.remove(SHW.stream.pts); scene.remove(SHW.stream.grp); SHW.stream.geo.dispose(); SHW.stream=null; }
  SHW.streaks.forEach(s=>scene.remove(s.line)); SHW.streaks=[]; SHW.key=null;
}
function startShower(key){
  stopShower(); if(tourActive) stopTour(false);
  SHW.key=key; SHW.stream=buildStream(key);
  const S=SHOWERS[key]; SHW.radiant.copy(radecToVector(S.ra,S.dec,1).normalize());
  const er=orbitObjects.find(r=>r.key==='earth'); er.mesh.getWorldPosition(SHW.node); SHW.node.y=0;
  showInfo(key, [ { label:xt('look'), fn:()=>{ playClick(700); lookAtRadiant(); } },
                  { label:xt('stop'), fn:()=>{ playClick(440); stopShower(); closePanel(); } } ]);
  const c=SHW.node.clone(); flight={ fromCam:camera.position.clone(), toCamFixed:c.clone().multiplyScalar(0.35).add(new THREE.Vector3(0,120,0)).addScaledVector(c.clone().normalize(),60),
    fromTgt:controls.target.clone(), toTgtFixed:c.clone().multiplyScalar(0.6), rec:null, t:0, dur:2.4 }; focusRec=null;
}
function lookAtRadiant(){
  const er=orbitObjects.find(r=>r.key==='earth'); const eP=new THREE.Vector3(); er.mesh.getWorldPosition(eP);
  const cam=eP.clone().addScaledVector(SHW.radiant,-er.radius*2.2).add(new THREE.Vector3(0,er.radius*0.6,0));
  flight={ fromCam:camera.position.clone(), toCamFixed:cam, fromTgt:controls.target.clone(), toTgtFixed:cam.clone().addScaledVector(SHW.radiant,60), rec:null, t:0, dur:2.0 };
  focusRec=null;
}
const _sv=new THREE.Vector3(), _sa=new THREE.Vector3(), _sb=new THREE.Vector3();
function spawnStreak(){
  const S=SHOWERS[SHW.key];
  const ax=new THREE.Vector3().crossVectors(SHW.radiant, Math.abs(SHW.radiant.y)<0.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0)).normalize();
  ax.applyAxisAngle(SHW.radiant, Math.random()*TAU);
  const start=THREE.MathUtils.degToRad(3+Math.random()*28), len=THREE.MathUtils.degToRad(5+Math.random()*16);
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));
  geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array([S.col[0],S.col[1],S.col[2],0,0,0]),3));
  const line=new THREE.Line(geo,new THREE.LineBasicMaterial({ vertexColors:true, transparent:true, opacity:1, blending:THREE.AdditiveBlending, depthWrite:false, depthTest:false }));
  line.frustumCulled=false; line.renderOrder=20; scene.add(line);
  SHW.streaks.push({ line, ax, start, len, t:0, dur:0.45+Math.random()*0.6 });
}
function showerStep(dt){
  if(!SHW.key) return;
  const st=SHW.stream;
  if(st){ const pa=st.geo.attributes.position.array;                 // chang oqimi orbita bo'ylab siljiydi
    for(let i=0;i<st.P.length;i++){ const q=st.P[i]; const r=st.p/(1+st.e*Math.cos(q.nu));
      q.nu += dt*q.sp*0.9*Math.pow(st.p/r,1.5)/st.p*6; if(q.nu>Math.PI) q.nu-=TAU;
      const rr=r+q.dr*(1+r*0.01); pa[i*3]=Math.cos(q.nu)*rr; pa[i*3+1]=q.dz*(1+r*0.008); pa[i*3+2]=Math.sin(q.nu)*rr; }
    st.geo.attributes.position.needsUpdate=true; }
  // Yer oqimga qanchalik yaqin — shuncha ko'p meteor
  const er=orbitObjects.find(r=>r.key==='earth'); er.mesh.getWorldPosition(_sv); _sv.y=0;
  const d=_sv.distanceTo(SHW.node), rate=1.2+16*Math.exp(-Math.pow(d/18,2));
  SHW.acc+=dt*rate; while(SHW.acc>=1){ SHW.acc-=1; if(SHW.streaks.length<40) spawnStreak(); }
  const R=500;
  for(let i=SHW.streaks.length-1;i>=0;i--){
    const s=SHW.streaks[i]; s.t+=dt; const k=s.t/s.dur;
    if(k>=1){ scene.remove(s.line); s.line.geometry.dispose(); s.line.material.dispose(); SHW.streaks.splice(i,1); continue; }
    const head=s.start+s.len*k, tail=s.start+s.len*Math.max(0,k-0.35);
    _sa.copy(SHW.radiant).applyAxisAngle(s.ax, head).multiplyScalar(R).add(camera.position);
    _sb.copy(SHW.radiant).applyAxisAngle(s.ax, tail).multiplyScalar(R).add(camera.position);
    const pa=s.line.geometry.attributes.position.array; pa[0]=_sa.x; pa[1]=_sa.y; pa[2]=_sa.z; pa[3]=_sb.x; pa[4]=_sb.y; pa[5]=_sb.z;
    s.line.geometry.attributes.position.needsUpdate=true;
    s.line.material.opacity = Math.min(1,k*6)*(1-k*k);
  }
}

// ---------- Har kadr ----------
function featuresStep(dt, sdt){
  if(XT._lang!==LANG){ XT._lang=LANG; if(XT._rebuild) XT._rebuild(); }
  voyagerTrailStep(dt);
  showerStep(dt);
}
// Apparatlar kamera kuzatuvidan OLDIN suriladi — aks holda kamera bir kadr orqada qolib, obyekt titraydi
function craftFocused(obj){ return (focusRec&&focusRec.mesh===obj) || (flight&&flight.rec&&flight.rec!=='sun'&&flight.rec.mesh===obj); }
function craftStep(sdt){
  // Kuzatilayotgan apparat sekinlashadi — aks holda fon (Yer/Quyosh) pirpirak kabi aylanib ketadi
  if(CRAFT.iss){ const c=CRAFT.iss; c.k += ((craftFocused(c.obj)?0.03:0.45)-c.k)*0.04; c.pivot.rotation.y += sdt*c.k; }
  if(CRAFT.parker){ const c=CRAFT.parker; c.k += ((craftFocused(c.obj)?0.05:0.35)-c.k)*0.04; c.M += sdt*c.k;
    let E=c.M; for(let k=0;k<5;k++) E=E-(E-c.e*Math.sin(E)-c.M)/(1-c.e*Math.cos(E));   // Kepler tenglamasi
    const x=c.a*(Math.cos(E)-c.e), z=c.a*Math.sqrt(1-c.e*c.e)*Math.sin(E);
    c.obj.position.set(x, z*0.08, z); c.obj.lookAt(0,0,0); c.obj.rotateY(-Math.PI/2);
    const r=Math.hypot(x,z); c.obj.userData.glow.material.opacity=Math.max(0,1-(r-17)/10)*0.85; }
}
const _vt=new THREE.Vector3();
function voyagerTrailStep(dt){
  const time=performance.now()*0.001; TRAIL_TIME.value=time;
  ['voyager1','voyager2'].forEach(k=>{ const c=CRAFT[k]; if(!c||!c.trail) return;
    const bc0=c.obj.userData.beacon; if(bc0) bc0.material.opacity=0.4+0.2*Math.sin(time*2.2);
    // iz faqat apparat tanlanganda (yoki unga uchilayotganda) yumshoq paydo bo'ladi
    const on=craftFocused(c.obj);
    c.fade+=((on?1:0)-c.fade)*Math.min(1,dt*3); c.tg.visible=c.fade>0.01;
    c.line.material.opacity=c.fade; c.tubes.forEach((tb,j)=>tb.material.uniforms.uI.value=(j?0.55:1.5)*c.fade);
    c.trail.visible=c.fade>0.2;
    const near=camera.position.distanceTo(c.obj.position)<220, L=c.obj.userData.lights;
    if(L && L[0].visible!==near) L.forEach(l=>l.visible=near);
    if(!c.tg.visible) return;
    const pa=c.geo.attributes.position.array, ca=c.geo.attributes.aColor.array;
    for(let i=0;i<c.T.length;i++){ c.T[i]+=dt*(0.012+0.02*(i%7)/7); if(c.T[i]>1) c.T[i]-=1;
      const t=c.T[i]; _vt.copy(c.path(t)).addScaledVector(c.J[i], 0.4+t*1.2);
      pa[i*3]=_vt.x; pa[i*3+1]=_vt.y; pa[i*3+2]=_vt.z;
      const b=(0.25+0.95*Math.pow(t,1.3))*(0.75+0.25*Math.sin(time*3+i))*Math.min(1,(1-t)*40);
      ca[i*3]=0.75*b*1.5; ca[i*3+1]=0.95*b*1.5; ca[i*3+2]=1.0*b*1.5; }
    c.geo.attributes.position.needsUpdate=true; c.geo.attributes.aColor.needsUpdate=true;
  });
}

// ---------- "Kashf etish" menyusi (sarlavha paneli) ----------
(function(){
  const controlsEl=document.querySelector('#topbar .controls') || document.querySelector('.controls'); if(!controlsEl) return;
  const wrap=document.createElement('div'); wrap.className='tours-wrap';
  const btn=document.createElement('button'); btn.id='discBtn'; btn.className='icon-btn'; btn.textContent='🪐';
  const menu=document.createElement('div'); menu.id='discMenu'; menu.className='glass tours-menu'; menu.style.maxHeight='70vh'; menu.style.overflowY='auto';
  wrap.append(btn,menu);
  const tw=controlsEl.querySelector('.tours-wrap'); tw ? tw.insertAdjacentElement('afterend',wrap) : controlsEl.prepend(wrap);
  const vbtn=document.createElement('button'); vbtn.id='voiceBtn'; vbtn.className='tour-item'+(VOICE.on?' active':'');
  const GROUPS=[ ['showers','🌠',['perseids','geminids','leonids','quadrantids']],
                 ['craft','🛰',['iss','jwst','parker','voyager1','voyager2']],
                 ['moons','🌑',['moon','io','europa','ganymede','callisto','titan','enceladus','triton']] ];
  function build(){
    btn.title=xt('menu');
    vbtn.innerHTML=`<span class="ti-ico">${VOICE.on?'🔊':'🔈'}</span><span class="ti-label">${VOICE.on?xt('voiceOn'):xt('voiceOff')}</span>`;
    menu.innerHTML=GROUPS.map(([g,ico,keys])=>`<div style="padding:8px 12px 4px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--neon);font-weight:700">${xt(g)}</div>`+
      keys.map(k=>{ const d=xinfo(k); return d?`<button class="tour-item" data-x="${k}" data-g="${g}"><span class="ti-ico">${ico}</span><span class="ti-label">${phEsc(d.name)}</span></button>`:''; }).join('')).join('');
    if(LANG!=='uz') menu.prepend(vbtn); else if(vbtn.parentNode) vbtn.remove();
    // Laboratoriyalar endi alohida "Laboratoriya → Barcha laboratoriyalar" menyusida (toolbar.js)
    menu.querySelectorAll('[data-x]').forEach(b=>b.addEventListener('click',()=>{
      playClick(820); menu.classList.remove('open'); const k=b.dataset.x;
      if(b.dataset.g==='showers') startShower(k);
      else { const pk=PICKABLES.find(p=>p.userData.pickOf.userData.pickKey===k); if(pk) pickSelect(pk.userData.pickOf); }
    }));
  }
  build(); XT._rebuild=build;
  btn.addEventListener('click',e=>{ e.stopPropagation(); playClick(660); menu.classList.toggle('open'); if(typeof toursMenu!=='undefined') toursMenu.classList.remove('open'); });
  document.addEventListener('click',e=>{ if(!menu.contains(e.target) && e.target!==btn) menu.classList.remove('open'); });
  vbtn.addEventListener('click',e=>{ e.stopPropagation();
    VOICE.on=!VOICE.on; localStorage.setItem('solar_voice',VOICE.on?'1':'0');
    vbtn.classList.toggle('active',VOICE.on); build();
    playClick(VOICE.on?760:420);
    if(!VOICE.on) narrateStop();
    else if(typeof tourCaption!=='undefined' && tourCaption.classList.contains('show')) narrate(tcName.textContent+'. '+tcText.textContent);
  });
})();

/* --------------------------------------------------------------------------
   10d. KOSMIK TEST (viktorina) — ilova ma'lumotlari asosida
   -------------------------------------------------------------------------- */
const quizEl = document.getElementById('quiz');
const qQ = document.getElementById('quizQ');
const qOpts = document.getElementById('quizOpts');
const qExpl = document.getElementById('quizExpl');
const qNext = document.getElementById('quizNext');
const qProg = document.getElementById('quizProgress');
const qScoreEl = document.getElementById('quizScore');
const qBar = document.getElementById('quizBarFill');
let qList=[], qIdx=0, qScore=0, qAnswered=false, qLevel='easy';

function startQuiz(){
  quizEl.classList.add('open'); playClick(700);
  renderLevelPicker();
}
function renderLevelPicker(){
  // Daraja tanlash ekrani
  qProg.textContent='✦'; qScoreEl.textContent='';
  qBar.style.width='0%';
  qQ.textContent = tUI('quizPick');
  qExpl.classList.remove('show');
  qNext.classList.remove('show');
  qOpts.innerHTML='';
  tUI('quizLevels').forEach(lv=>{
    const b=document.createElement('button');
    b.className='quiz-opt'; b.textContent=lv[1];
    b.addEventListener('click', ()=>{ playClick(760); startQuizLevel(lv[0]); });
    qOpts.appendChild(b);
  });
  if(!(window.DZQ && window.DZQ.n()) && window.DZLOAD && !window.DZLOAD.ready){ window.DZLOAD.now(); window.DZLOAD.onReady(()=>{ if(qProg.textContent==='✦') renderLevelPicker(); }); }
  if(window.DZQ && window.DZQ.n()){
    const b=document.createElement('button');
    b.className='quiz-opt'; b.textContent=window.DZQ.tx(window.DZQ.TX.btn,LANG)+' · '+window.DZQ.total()+' '+window.DZQ.tx(window.DZQ.TX.q,LANG);
    b.addEventListener('click', ()=>{ playClick(760); renderDzPicker(); });
    qOpts.appendChild(b);
  }
}
function renderDzPicker(){
  const Z=window.DZQ, tx=o=>Z.tx(o,LANG);
  qProg.textContent='📖'; qScoreEl.textContent=''; qBar.style.width='0%';
  qQ.textContent = tx(Z.TX.pick);
  qExpl.classList.remove('show'); qNext.classList.remove('show'); qOpts.innerHTML='';
  const add=(lab,lv)=>{ const b=document.createElement('button'); b.className='quiz-opt'; b.textContent=lab; b.addEventListener('click', ()=>{ playClick(760); startQuizLevel(lv); }); qOpts.appendChild(b); };
  add(tx(Z.TX.all)+' · '+Z.total()+' '+tx(Z.TX.q), 'dz:1-'+Z.n());
  Z.ranges().forEach(([a,b])=>{ const c=Z.count(a,b); if(c) add(a+'–'+b+' '+tx(Z.TX.t)+' · '+c+' '+tx(Z.TX.q), 'dz:'+a+'-'+b); });
  const bk=document.createElement('button'); bk.className='quiz-opt'; bk.style.opacity='.75'; bk.textContent=tx(Z.TX.back);
  bk.addEventListener('click', ()=>{ playClick(600); renderLevelPicker(); }); qOpts.appendChild(bk);
}
function startQuizLevel(level){
  qLevel = level;
  const dzm = /^dz:(\d+)-(\d+)$/.exec(level);
  const all = dzm && window.DZQ ? window.DZQ.items(+dzm[1],+dzm[2],LANG) : ((window.LOC[LANG].quiz||{})[level]||[]).slice();
  for(let i=all.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; } // aralashtirish
  // Har safar tasodifiy 10 ta savol tushadi, javob variantlari tartibi ham aralashadi
  qList = all.slice(0,10).map(it=>{
    const idx=it.o.map((_,i2)=>i2);
    for(let i2=idx.length-1;i2>0;i2--){ const j2=Math.floor(Math.random()*(i2+1)); [idx[i2],idx[j2]]=[idx[j2],idx[i2]]; }
    return {q:it.q, o:idx.map(i2=>it.o[i2]), c:idx.indexOf(it.c), e:it.e};
  });
  qIdx=0; qScore=0;
  renderQuizQ();
}
function renderQuizQ(){
  qAnswered=false;
  const item = qList[qIdx];
  qProg.textContent = (qIdx+1)+tUI('quizOf')+qList.length;
  qScoreEl.textContent = qScore+' ✦';
  qBar.style.width = (qIdx/qList.length*100)+'%';
  qQ.textContent = item.q;
  qExpl.classList.remove('show');
  qNext.classList.remove('show');
  qOpts.innerHTML='';
  item.o.forEach((opt,i)=>{
    const b=document.createElement('button');
    b.className='quiz-opt'; b.textContent=opt;
    b.addEventListener('click', ()=>answerQuiz(i, b));
    qOpts.appendChild(b);
  });
}
function answerQuiz(i, btn){
  if(qAnswered) return; qAnswered=true;
  const item = qList[qIdx];
  const buttons = qOpts.querySelectorAll('.quiz-opt');
  buttons.forEach(b=>b.disabled=true);
  buttons[item.c].classList.add('correct');
  if(i===item.c){ qScore++; playClick(900); }
  else { btn.classList.add('wrong'); playClick(300); }
  qScoreEl.textContent = qScore+' ✦';
  qExpl.textContent = item.e;
  qExpl.classList.add('show');
  qNext.textContent = (qIdx < qList.length-1) ? tUI('quizNext') : tUI('quizFinish');
  qNext.classList.add('show');
}
qNext.addEventListener('click', ()=>{
  playClick(650);
  if(qIdx < qList.length-1){ qIdx++; renderQuizQ(); }
  else showQuizResult();
});
function showQuizResult(){
  qBar.style.width='100%';
  qProg.textContent = qList.length+tUI('quizOf')+qList.length;
  const ranks = tUI('quizRanks');
  let rank = ranks[ranks.length-1][1];
  for(const r of ranks){ if(qScore>=r[0]){ rank=r[1]; break; } }
  qQ.textContent='';
  qExpl.classList.remove('show'); qNext.classList.remove('show');
  qOpts.innerHTML = `<div class="quiz-result">
    <div class="qr-score">${qScore} / ${qList.length}</div>
    <div class="qr-rank"></div>
    <div style="display:flex; gap:10px; justify-content:center; margin-top:18px; flex-wrap:wrap">
      <button class="quiz-next show" id="quizReplay"></button>
      <button class="quiz-next show" id="quizLevelsBtn" style="background:rgba(255,255,255,.1); box-shadow:none"></button>
    </div>
  </div>`;
  qOpts.querySelector('.qr-rank').textContent = rank;
  const rb = document.getElementById('quizReplay');
  rb.textContent = tUI('quizRestart');
  rb.addEventListener('click', ()=>{ playClick(700); startQuizLevel(qLevel); });
  const lb = document.getElementById('quizLevelsBtn');
  lb.textContent = tUI('quizLevelsBack');
  lb.addEventListener('click', ()=>{ playClick(600); renderLevelPicker(); });
  playClick(qScore>=7 ? 950 : 500);
  if(window.API) window.API.quiz('quiz:'+qLevel, qScore, qList.length);
}
function closeQuiz(){ quizEl.classList.remove('open'); }
document.getElementById('quizClose').addEventListener('click', ()=>{ playClick(440); closeQuiz(); });
// 🎓 tugma endi avval o'yin tanlovini ochadi
const gamePick = document.getElementById('gamePick');
document.getElementById('quizBtn2').addEventListener('click', ()=>{
  if(tourActive) stopTour(false);
  if(typeof lsActive!=='undefined' && lsActive) stopLightSpeed();
  closeCosmos(); closePanel();
  playClick(700);
  gamePick.classList.add('open');
});
document.getElementById('gamePickClose').addEventListener('click', ()=>{ playClick(440); gamePick.classList.remove('open'); });
document.getElementById('pickClassic').addEventListener('click', ()=>{
  playClick(760); gamePick.classList.remove('open'); startQuiz();
});
document.getElementById('pickHunt').addEventListener('click', ()=>{
  playClick(760); gamePick.classList.remove('open'); startHunt();
});

/* --------------------------------------------------------------------------
   16b. "SAYYORANI TOP" O'YINI — savol beriladi, javob 3D sahnada bosiladi
   -------------------------------------------------------------------------- */
let huntActive=false, hList=[], hIdx=0, hScore=0, hTries=0, hLocked=false;
const huntCard = document.getElementById('huntCard');
const hProg = document.getElementById('huntProg');
const hScoreEl = document.getElementById('huntScore');
const hQ = document.getElementById('huntQ');
const hMsg = document.getElementById('huntMsg');
const hOpts = document.getElementById('huntOpts');

// Sayyora nusxa-rasmi (thumbnail) — haqiqiy teksturadan dumaloq shar chiziladi
function planetThumb(key, size){
  const c = makeCanvas(size, size), ctx = c.getContext('2d');
  const R = size/2;
  if(key==='saturn'){
    // orqa halqa qismi
    ctx.strokeStyle='rgba(224,200,154,0.55)'; ctx.lineWidth=size*0.07;
    ctx.beginPath(); ctx.ellipse(R, R, R*0.92, R*0.3, -0.35, Math.PI*0.05, Math.PI*1.05); ctx.stroke();
  }
  ctx.save();
  ctx.beginPath(); ctx.arc(R, R, R*0.62, 0, Math.PI*2); ctx.clip();
  if(key==='sun'){
    const g=ctx.createRadialGradient(R*0.8,R*0.8,2,R,R,R*0.7);
    g.addColorStop(0,'#fff3c0'); g.addColorStop(0.5,'#ffb347'); g.addColorStop(1,'#e05a1a');
    ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
  } else {
    const rec = orbitObjects.find(r=>r.key===key);
    let img = null;
    if(rec){
      const m = rec.mesh.material;
      const tex = m.map || (m.uniforms && m.uniforms.dayTex && m.uniforms.dayTex.value);
      if(tex && tex.image) img = tex.image;
    }
    if(img) ctx.drawImage(img, img.width*0.25, 0, img.height, img.height, R-R*0.62, R-R*0.62, R*1.24, R*1.24);
    else { ctx.fillStyle='#888'; ctx.fillRect(0,0,size,size); }
    // yoritish: yuqori-chapdan yorug', pastki-o'ngdan soya
    const sh=ctx.createRadialGradient(R*0.72,R*0.72,R*0.1,R,R,R*0.75);
    sh.addColorStop(0,'rgba(255,255,255,0.22)'); sh.addColorStop(0.55,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle=sh; ctx.fillRect(0,0,size,size);
  }
  ctx.restore();
  if(key==='sun'){
    const gl=ctx.createRadialGradient(R,R,R*0.55,R,R,R);
    gl.addColorStop(0,'rgba(255,170,60,0.5)'); gl.addColorStop(1,'rgba(255,140,40,0)');
    ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(R,R,R,0,Math.PI*2); ctx.fill();
  }
  if(key==='saturn'){
    // old halqa qismi
    ctx.strokeStyle='rgba(224,200,154,0.85)'; ctx.lineWidth=size*0.07;
    ctx.beginPath(); ctx.ellipse(R, R, R*0.92, R*0.3, -0.35, Math.PI*1.05, Math.PI*2.05); ctx.stroke();
  }
  return c;
}

// Qayta ishlatiladigan flash sprite (yashil/qizil pulsatsiya)
const huntFlash = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(),
  color:0x66ff99, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false }));
huntFlash.visible=false; scene.add(huntFlash);
let huntFlashT=0, huntFlashTarget=null;
function flashBody(obj, color){
  huntFlash.material.color.set(color);
  huntFlashTarget = obj;
  const r = (obj===sun? SUN_RADIUS : (obj.geometry.parameters.radius||2));
  huntFlash.scale.set(r*5.5, r*5.5, 1);
  huntFlashT = 1.2;   // soniyalarda so'nadi
  huntFlash.visible = true;
}

function startHunt(){
  const all = (window.LOC[LANG].hunt||[]).slice();
  for(let i=all.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }
  hList = all.slice(0,10);
  hIdx=0; hScore=0; hTries=0; hLocked=false; huntActive=true;
  document.body.classList.add('hunting');
  closePanel(); flyToOverview();
  renderHuntQ();
  huntCard.classList.add('show');
}
function renderHuntQ(){
  const ui = window.LOC[LANG].ui;
  hTries=0; hLocked=false;
  hProg.textContent = (hIdx+1)+'/'+hList.length;
  hScoreEl.textContent = hScore+' ✦';
  hQ.textContent = hList[hIdx].q;
  hMsg.className='hunt-msg';
  hMsg.textContent = ui.huntHint;
  hOpts.classList.remove('collapsed');
  huntCard.classList.add('show');   // yangi savol bilan karta qaytadi
  // 3 variant: to'g'ri javob + 2 ta chalg'ituvchi
  const pool = ['sun', ...orbitObjects.map(r=>r.key)].filter(k=>k!==hList[hIdx].a);
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  const opts = [hList[hIdx].a, pool[0], pool[1]];
  for(let i=opts.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [opts[i],opts[j]]=[opts[j],opts[i]]; }
  hOpts.innerHTML='';
  opts.forEach(k=>{
    const b=document.createElement('button');
    b.className='hunt-opt'; b.dataset.key=k;
    b.appendChild(planetThumb(k, 72));
    // 3D rasm ostida sayyora nomi (joriy tilda)
    const nm=document.createElement('span'); nm.className='ho-name';
    nm.textContent=(bodyData(k)||{}).name||k;
    b.appendChild(nm);
    b.addEventListener('click', ()=>answerHunt(k, b));
    hOpts.appendChild(b);
  });
}
function answerHunt(key, btn){
  if(hLocked) return;
  const ui = window.LOC[LANG].ui;
  const item = hList[hIdx];
  if(key===item.a){
    hLocked=true;
    hScore += hTries===0 ? 2 : 1;   // 2-urinishda yarim ball
    hScoreEl.textContent = hScore+' ✦';
    playClick(950);
    btn.classList.add('ok');
    hMsg.className='hunt-msg ok';
    hMsg.textContent = ui.huntCorrect+' '+item.e;
    // Javob ko'rsatilgach karta BUTUNLAY yashirinadi — sayyora to'liq ko'rinadi
    setTimeout(()=>{ if(huntActive) huntCard.classList.remove('show'); }, 900);
    // Sahnada ham ko'rsatamiz: kamera o'sha jismga uchadi + yashil flash
    const rec = orbitObjects.find(r=>r.key===key);
    const obj = key==='sun' ? sun : (rec||{}).mesh;
    if(obj) flashBody(obj, 0x66ff99);
    if(key==='sun') flightToSun(); else if(rec) flyTo(rec);
    setTimeout(()=>{ if(!huntActive) return; nextHunt(); }, 4800);
  } else {
    hTries++;
    playClick(300);
    btn.classList.add('bad');
    if(hTries>=2){
      hLocked=true;
      const okBtn = [...hOpts.children].find(b=>b.dataset.key===item.a);
      if(okBtn) okBtn.classList.add('ok');
      const nm = item.a==='sun' ? sun.userData.name : bodyData(item.a).name;
      hMsg.className='hunt-msg bad';
      hMsg.textContent = ui.huntReveal+' '+nm+'. '+item.e;
      // To'g'ri javob bilan tanishgach karta yashirinadi
      setTimeout(()=>{ if(huntActive) huntCard.classList.remove('show'); }, 1800);
      setTimeout(()=>{ if(!huntActive) return; nextHunt(); }, 5000);
    } else {
      hMsg.className='hunt-msg bad';
      hMsg.textContent = ui.huntWrong;
    }
  }
}
function nextHunt(){
  if(hIdx < hList.length-1){ hIdx++; flyToOverview(); renderHuntQ(); }
  else showHuntResult();
}
function showHuntResult(){
  const ui = window.LOC[LANG].ui;
  huntCard.classList.add('show');
  hOpts.innerHTML='';
  hProg.textContent = hList.length+'/'+hList.length;
  const max = hList.length*2;
  const rank = (ui.huntRanks||[]).find(r=>hScore>=r[0]);
  hQ.textContent = hScore+' / '+max+' '+ui.huntScoreWord;
  hMsg.className='hunt-msg ok';
  hMsg.innerHTML='';
  const rankP=document.createElement('div'); rankP.textContent = rank?rank[1]:'';
  const row=document.createElement('div');
  row.style.cssText='display:flex;gap:8px;margin-top:10px';
  const rb=document.createElement('button'); rb.className='quiz-opt'; rb.style.flex='1';
  rb.textContent=ui.huntReplay;
  rb.addEventListener('click', ()=>{ playClick(700); startHunt(); });
  const xb=document.createElement('button'); xb.className='quiz-opt'; xb.style.flex='1';
  xb.textContent=ui.huntExit;
  xb.addEventListener('click', ()=>{ playClick(440); stopHunt(); });
  row.append(rb,xb);
  hMsg.append(rankP,row);
  playClick(hScore>=max*0.7 ? 950 : 500);
  flyToOverview();
}
function stopHunt(){
  huntActive=false; hLocked=false;
  document.body.classList.remove('hunting');
  huntCard.classList.remove('show');
  huntFlash.visible=false;
  flyToOverview();
}
document.getElementById('huntClose').addEventListener('click', ()=>{ playClick(440); stopHunt(); });
window.addEventListener('keydown', e=>{ if(e.key==='Escape' && huntActive) stopHunt(); });

/* --------------------------------------------------------------------------
   11. BOSISH OVOZI (Web Audio — qisqa SFX, fon musiqasi yo‘q)
   -------------------------------------------------------------------------- */
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ audioCtx=null; }
  }
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
}
function playClick(freq=820){
  ensureAudio(); if(!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq*0.55, t+0.13);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t+0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.18);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t); o.stop(t+0.2);
}

/* Aylanish tezligi boshqaruvi (slider + pauza) */
const speedEl = document.getElementById('speed');
const pauseBtn = document.getElementById('pauseBtn');
const speedVal = document.getElementById('speedVal');
function setSpeed(v){
  simSpeed = v;
  if(speedEl) speedEl.value = v;
  if(speedVal) speedVal.textContent = v.toFixed(1)+'×';
  pauseBtn.textContent = simSpeed===0 ? '▶' : '⏸';
  pauseBtn.classList.toggle('active', simSpeed===0);
}
if(speedEl) speedEl.addEventListener('input', e=>{
  const v = parseFloat(e.target.value);
  if(v>0) lastSpeed = v;
  setSpeed(v);
});
pauseBtn.addEventListener('click', ()=>{
  if(simSpeed>0){ lastSpeed = simSpeed; setSpeed(0); }
  else { setSpeed(lastSpeed||1); }
});

/* --------------------------------------------------------------------------
   12. INTRO / START
   -------------------------------------------------------------------------- */
const loader = document.getElementById('loader');
const intro  = document.getElementById('intro');
const topbar = document.getElementById('topbar');

// Yuklanish ekranini yashirish — 'load' allaqachon bo‘lib o‘tgan bo‘lsa ham ishlaydi
const SPLASH_T0 = performance.now(), SPLASH_MIN = 6000;
(function(){ const tg=document.getElementById('spTag'); try{ const L=localStorage.getItem('solar_lang')||'uz'; if(tg) tg.textContent={uz:'Koinot yuklanmoqda…',ru:'Загрузка вселенной…',en:'Loading the universe…'}[L]||tg.textContent; }catch(e){} })();
function revealIntro(){
  const wait = Math.max(300, SPLASH_MIN - (performance.now() - SPLASH_T0));
  setTimeout(()=>{ if(loader.classList.contains('hidden')) return; loader.classList.add('sp-out'); intro.classList.remove('hidden'); setTimeout(()=>loader.classList.add('hidden'),1050); }, wait);
}
if(document.readyState==='complete') revealIntro();
else window.addEventListener('load', revealIntro);
// Zaxira: nima bo‘lganda ham 3 soniyadan keyin ochilsin
setTimeout(()=>{
  if(!loader.classList.contains('hidden')){
    loader.classList.add('hidden');
    if(topbar.classList.contains('hidden')) intro.classList.remove('hidden');
  }
}, 9000);

// Tilni va dock/UI ni dastlabki holatda o‘rnatish
buildLangSwitch(document.getElementById('introLang'));
buildLangSwitch(document.getElementById('topLang'));
applyLanguage(LANG);

// Interfeysni yashirish / ko‘rsatish (kinematik ko‘rinish)
const uiToggle = document.getElementById('uiToggle');
uiToggle.addEventListener('click', ()=>{
  playClick(600);
  const hidden = document.body.classList.toggle('clean');
  uiToggle.textContent = hidden ? '🙈' : '👁';
  uiToggle.title = hidden ? tUI('showUI') : tUI('hideUI');
});

document.getElementById('startBtn').addEventListener('click', ()=>{
  ensureAudio(); playClick(700);
  intro.style.transition='opacity .8s ease'; intro.style.opacity='0';
  setTimeout(()=>intro.classList.add('hidden'), 800);
  topbar.classList.remove('hidden');
  dock.classList.remove('hidden');
  uiToggle.classList.remove('hidden');
  // kinematik kirish: uzoqdan tizimga uchib kirish
  camera.position.set(0, 420, 900);
  flight={ fromCam:camera.position.clone(), toCamFixed:new THREE.Vector3(0,90,320),
    fromTgt:new THREE.Vector3(0,0,0), toTgtFixed:new THREE.Vector3(0,0,0), rec:null, t:0, dur:3.5 };
});

/* --------------------------------------------------------------------------
   21. REAL VAQT REJIMI (Kepler)
   Manba: NASA JPL "Approximate Positions of the Planets" (E.M. Standish),
   J2000 epoxasi elementlari, 1800–2050 oralig‘ida amal qiladi.
   a (AU) sahnada ishlatilmaydi — faqat burchak (geliotsentrik uzunlama) olinadi.
   -------------------------------------------------------------------------- */
const KEPLER = {
  mercury:{ e:0.20563593, L0:252.25032350, Lr:149472.67411175, wb:77.45779628 },
  venus:  { e:0.00677672, L0:181.97909950, Lr:58517.81538729,  wb:131.60246718 },
  earth:  { e:0.01671123, L0:100.46457166, Lr:35999.37244981,  wb:102.93768193 },
  mars:   { e:0.09339410, L0:-4.55343205,  Lr:19140.30268499,  wb:-23.94362959 },
  jupiter:{ e:0.04838624, L0:34.39644051,  Lr:3034.74612775,   wb:14.72847983 },
  saturn: { e:0.05386179, L0:49.95424423,  Lr:1222.49362201,   wb:92.59887831 },
  uranus: { e:0.04725744, L0:313.23810451, Lr:428.48202785,    wb:170.95427630 },
  neptune:{ e:0.00859048, L0:-55.12002969, Lr:218.45945325,    wb:44.96476227 },
  // Pluton — Standish qo‘shimcha jadvalidan (oddiy Kepler yetarli aniq)
  pluto:  { e:0.24882730, L0:238.92903833, Lr:145.20780515,    wb:224.06891629 },
  // Serera — MPC elementlaridan yaqinlashtirilgan (davri ~4.6 yil)
  ceres:  { e:0.0760,     L0:160.7,        Lr:7818.0,          wb:153.9 }
};
const norm360 = a => ((a%360)+360)%360;
// Sanadan geliotsentrik ekliptik uzunlama (radian)
function heliocentricLongitude(key, date){
  const el = KEPLER[key]; if(!el) return null;
  const JD = date.getTime()/86400000 + 2440587.5;      // Julian kun
  const T  = (JD - 2451545.0)/36525;                    // J2000 dan asrlar
  const L  = norm360(el.L0 + el.Lr*T);                  // o‘rtacha uzunlama
  const M  = norm360(L - el.wb) * Math.PI/180;          // o‘rtacha anomaliya
  const e  = el.e;
  let E = M;                                            // Kepler: M = E - e·sin(E)
  for(let i=0;i<8;i++){ E -= (E - e*Math.sin(E) - M)/(1 - e*Math.cos(E)); }
  const nu = 2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2), Math.sqrt(1-e)*Math.cos(E/2));
  return norm360(nu*180/Math.PI + el.wb) * Math.PI/180;
}
// Nazorat nuqtalari (debugLongitudes() bilan tekshirilgan):
//  • 2026-01-01: Yer λ ≈ 100° (Quyosh geosentrik ~280° Jadiyda → Yer +180°) ✓
//  • Merkuriy 88 kunda to‘liq aylanadi, Neptun asrda ~2.2° siljiydi ✓
window.debugLongitudes = function(date){
  date = date || new Date();
  console.table(Object.keys(KEPLER).map(k=>({ jism:k,
    lambda: +(heliocentricLongitude(k,date)*180/Math.PI).toFixed(2) })));
};

var realTimeMode = false;
var rtDate = new Date();            // rejimdagi joriy sana
var rtTransition = null;            // {t,dur,from:Map,to:Map} — silliq o‘tish
var rtCalcTimer = 0;                // sekundiga 1 marta yangilash hisoblagichi
const rtPanel = document.getElementById('rtPanel');
const rtDateEl = document.getElementById('rtDate');
const rtLiveEl = document.getElementById('rtLive');

function rtBodies(){
  // Kepler jadvalida bor jismlar: 8 sayyora + Serera + Pluton
  const list = orbitObjects.filter(r=>KEPLER[r.key]);
  EXTRA_BODIES.forEach(b=>{ if(KEPLER[b.key]) list.push(b); });
  return list;
}
// pivot.rotation.y = λ : Three.js'da +Y atrofidagi musbat aylanish yuqoridan
// qaraganda ekliptik uzunlama o‘sishi bilan bir yo‘nalishda — belgi +1, ofset 0.
function rtApply(date, smooth){
  const bodies = rtBodies();
  if(smooth){
    const from = new Map(), to = new Map();
    bodies.forEach(b=>{
      const cur = b.pivot.rotation.y;
      let target = heliocentricLongitude(b.key, date);
      // eng qisqa yo‘nalish bo‘ylab burilish
      const c = norm360(cur*180/Math.PI)*Math.PI/180;
      let dlt = target - c; if(dlt>Math.PI) dlt-=2*Math.PI; if(dlt<-Math.PI) dlt+=2*Math.PI;
      from.set(b.key, c); to.set(b.key, c+dlt);
    });
    rtTransition = { t:0, dur:1.8, from, to };
  } else {
    bodies.forEach(b=>{ b.pivot.rotation.y = heliocentricLongitude(b.key, date); });
  }
}
function rtFmtDate(dt){
  return dt.toLocaleDateString(LANG==='ru'?'ru-RU':(LANG==='en'?'en-GB':'uz-UZ'),
    { year:'numeric', month:'short', day:'numeric' });
}
function rtSyncUI(){
  if(!rtDateEl) return;
  const iso = new Date(rtDate.getTime()-rtDate.getTimezoneOffset()*60000).toISOString().slice(0,10);
  rtDateEl.value = iso;
  rtLiveEl.textContent = rtFmtDate(rtDate);
}
function setRealTime(on){
  realTimeMode = on;
  document.getElementById('rtBtn').classList.toggle('active', on);
  rtPanel.classList.toggle('on', on);
  if(on){
    rtDate = new Date();
    rtApply(rtDate, true);
    rtSyncUI();
    showToast(tUI('rtHint'));
  }
  // O‘chirilganda: dekorativ tezliklar joriy burchaklardan davom etadi — hech narsa buzilmaydi
}
document.getElementById('rtBtn').addEventListener('click', ()=>{
  playClick(700);
  if(tourActive) stopTour(false);
  if(typeof lsActive!=='undefined' && lsActive) stopLightSpeed();
  setRealTime(!realTimeMode);
});
document.getElementById('rtPrev').addEventListener('click', ()=>{
  playClick(500); rtDate = new Date(rtDate.getTime() - 30*86400000); rtApply(rtDate,true); rtSyncUI();
});
document.getElementById('rtNext').addEventListener('click', ()=>{
  playClick(560); rtDate = new Date(rtDate.getTime() + 30*86400000); rtApply(rtDate,true); rtSyncUI();
});
document.getElementById('rtToday').addEventListener('click', ()=>{
  playClick(640); rtDate = new Date(); rtApply(rtDate,true); rtSyncUI();
});
if(rtDateEl) rtDateEl.addEventListener('change', ()=>{
  const v = rtDateEl.valueAsDate; if(!v) return;
  playClick(600); rtDate = new Date(v.getTime()); rtApply(rtDate,true); rtSyncUI();
});
// Zodiak sektori: 0°=Hamal, har 30° — keyingi belgi
function rtZodiacName(lambdaRad){
  const z = tUI('rtZodiac');
  if(!Array.isArray(z)) return '';
  return z[Math.floor(norm360(lambdaRad*180/Math.PI)/30)%12];
}
// Oddiy toast xabari
let toastTimer=null;
function showToast(msg){
  let t = document.getElementById('rtToast');
  if(!t){
    t = document.createElement('div'); t.id='rtToast'; t.className='glass';
    t.style.cssText='position:fixed;top:130px;left:50%;transform:translateX(-50%);z-index:30;padding:10px 20px;border-radius:12px;font-size:13.5px;color:var(--text);transition:opacity .4s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity='1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.style.opacity='0'; }, 2600);
}

/* --------------------------------------------------------------------------
   22. ICHKI TUZILISH — kesma diagramma (canvas) + qatlam izohlari
   -------------------------------------------------------------------------- */
// Qatlamlar ichkaridan tashqariga: r — nisbiy radius, c — rang
const STRUCT_GEO = {
  sun:    [ {r:0.25,c:'#fff3b0'}, {r:0.70,c:'#ffb347'}, {r:0.95,c:'#ff8c2a'}, {r:1.00,c:'#ffd88a'} ],
  mercury:[ {r:0.85,c:'#d0873f'}, {r:0.97,c:'#9c7a5c'}, {r:1.00,c:'#8a7a68'} ],
  venus:  [ {r:0.50,c:'#e09a4a'}, {r:0.95,c:'#b56b3e'}, {r:1.00,c:'#d8a96b'} ],
  earth:  [ {r:0.19,c:'#ffe28a'}, {r:0.55,c:'#ff9d45'}, {r:0.98,c:'#c25b32'}, {r:1.00,c:'#3b7fd6'} ],
  mars:   [ {r:0.53,c:'#e0955a'}, {r:0.97,c:'#a34a2a'}, {r:1.00,c:'#c1502e'} ],
  jupiter:[ {r:0.12,c:'#cdb691'}, {r:0.78,c:'#8a93b8'}, {r:0.97,c:'#c9a877'}, {r:1.00,c:'#d8c4a0'} ],
  saturn: [ {r:0.16,c:'#cdb691'}, {r:0.50,c:'#98a0c0'}, {r:0.96,c:'#d0b47e'}, {r:1.00,c:'#e0c89a'} ],
  uranus: [ {r:0.22,c:'#b8a888'}, {r:0.80,c:'#5db8c8'}, {r:1.00,c:'#9fe0e6'} ],
  neptune:[ {r:0.26,c:'#b8a888'}, {r:0.85,c:'#3f6fd8'}, {r:1.00,c:'#5b7ae0'} ]
};
const structView = document.getElementById('structView');
const structTitle = document.getElementById('structTitle');
const structCanvas = document.getElementById('structCanvas');
const structLegend = document.getElementById('structLegend');
var lastStructKey = null;
function drawStruct(key){
  const geo = STRUCT_GEO[key];
  const ctx = structCanvas.getContext('2d');
  const W = structCanvas.width, H = structCanvas.height;
  ctx.clearRect(0,0,W,H);
  const cx = W/2, cy = H/2+6, R = Math.min(W,H)/2 - 18;
  // Kesma bo‘lagi (yuqori-o‘ng tomonda ochiladi)
  const a0 = -Math.PI*0.42, a1 = Math.PI*0.08;
  // 1) To‘liq shar — eng tashqi qatlam rangi + yoritish
  const outer = geo[geo.length-1];
  const sg = ctx.createRadialGradient(cx-R*0.35, cy-R*0.35, R*0.1, cx, cy, R);
  sg.addColorStop(0, outer.c);
  sg.addColorStop(1, shadeColor(outer.c, -45));
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.fill();
  // 2) Kesma: qatlamlar tashqaridan ichkariga sektor bo‘lib chiziladi
  for(let i=geo.length-1; i>=0; i--){
    const rr = geo[i].r * R;
    ctx.fillStyle = geo[i].c;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rr, a0, a1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, rr, a0, a1); ctx.stroke();
  }
  // Kesma chetlari
  ctx.strokeStyle='rgba(10,14,30,0.6)'; ctx.lineWidth=2;
  [a0,a1].forEach(a=>{
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R); ctx.stroke();
  });
  // 3) Raqamli belgilar — kesma o‘rtasi bo‘ylab
  const mid = (a0+a1)/2;
  for(let i=0;i<geo.length;i++){
    const rIn = i===0 ? 0 : geo[i-1].r;
    const rl = ((rIn+geo[i].r)/2) * R;
    const lx = cx+Math.cos(mid)*rl, ly = cy+Math.sin(mid)*rl;
    ctx.beginPath(); ctx.arc(lx, ly, 10, 0, Math.PI*2);
    ctx.fillStyle='rgba(10,14,30,0.85)'; ctx.fill();
    ctx.strokeStyle=geo[i].c; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(String(i+1), lx, ly);
  }
}
function shadeColor(hex, amt){
  const n = parseInt(hex.slice(1),16);
  const r = Math.max(0,Math.min(255,(n>>16)+amt));
  const g = Math.max(0,Math.min(255,((n>>8)&255)+amt));
  const b = Math.max(0,Math.min(255,(n&255)+amt));
  return 'rgb('+r+','+g+','+b+')';
}
function openStruct(key){
  const L = window.LOC[LANG];
  const info = L.structure && L.structure[key];
  const geo = STRUCT_GEO[key];
  if(!info || !geo) return;
  lastStructKey = key;
  structTitle.textContent = info.title;
  drawStruct(key);
  structLegend.innerHTML='';
  info.layers.forEach((ly,i)=>{
    const item=document.createElement('div'); item.className='struct-item';
    const num=document.createElement('span'); num.className='struct-num';
    num.textContent=String(i+1); num.style.background=geo[i].c;
    const txt=document.createElement('div');
    const n=document.createElement('div'); n.className='si-n'; n.textContent=ly.n;
    const t=document.createElement('div'); t.className='si-t'; t.textContent=ly.t;
    txt.append(n,t); item.append(num,txt);
    structLegend.appendChild(item);
  });
  structView.classList.add('open');
}
document.getElementById('structClose').addEventListener('click', ()=>{
  playClick(440); structView.classList.remove('open');
});
structView.addEventListener('click', e=>{ if(e.target===structView) structView.classList.remove('open'); });

/* --------------------------------------------------------------------------
   23. YORUG'LIK TEZLIGI DEMOSI — Quyoshdan uchgan foton
   Fizika: c = 299 792.458 km/s, 1 AU = 149 597 870.7 km → yorug'lik 1 AU ni
   499.005 s da bosadi. Sahna radiuslari real masofalarga proporsional emas,
   shuning uchun foton pozitsiyasi VAQTDAN hisoblanadi: d_AU = tSim/499.005,
   so'ng d_AU bo'lakli-chiziqli interpolatsiya bilan sahna radiusiga o'tkaziladi.
   Nazorat qiymatlari: Merkuriy 193 s, Venera 361 s, Yer 499 s, Mars 760 s,
   Yupiter 2596 s, Saturn 4780 s, Uran 9581 s, Neptun 14995 s (≈4 soat 10 daq).
   -------------------------------------------------------------------------- */
const LS_AU_S = 499.005;   // 1 AU uchun yorug'lik vaqti (soniya)
// Nazorat nuqtalari: [d_AU, sahna radiusi] — ichkaridan tashqariga
const LS_MAP = [
  [0.00465, 14],[0.387,34],[0.723,48],[1.000,64],[1.524,80],
  [2.77,104],[5.203,120],[9.58,165],[19.2,205],[30.05,240],[39.48,285]
];
// Bosqichlar (milestone): kalit, d_AU — real o'tish vaqti t = d_AU * 499.005 s
const LS_STOPS = [
  {key:'mercury', au:0.387},{key:'venus', au:0.723},{key:'earth', au:1.000},
  {key:'mars', au:1.524},{key:'ceres', au:2.77},{key:'jupiter', au:5.203},
  {key:'saturn', au:9.58},{key:'uranus', au:19.2},{key:'neptune', au:30.05},{key:'pluto', au:39.48}
];
// Self-test: hisoblangan vaqtlar nazorat qiymatlariga ±1 s mosligi
console.assert(Math.abs(0.387*LS_AU_S-193)<1.5, 'LS: Merkuriy vaqti xato');
console.assert(Math.abs(1.000*LS_AU_S-499)<1.5, 'LS: Yer vaqti xato');
console.assert(Math.abs(30.05*LS_AU_S-14995)<6, 'LS: Neptun vaqti xato');
// d_AU → sahna radiusi (bo'lakli-chiziqli)
function sceneRadiusFromAU(d){
  if(d<=LS_MAP[0][0]) return LS_MAP[0][1];
  for(let i=1;i<LS_MAP.length;i++){
    if(d<=LS_MAP[i][0]){
      const [a0,r0]=LS_MAP[i-1], [a1,r1]=LS_MAP[i];
      return r0 + (r1-r0)*(d-a0)/(a1-a0);
    }
  }
  const [a0,r0]=LS_MAP[LS_MAP.length-2], [a1,r1]=LS_MAP[LS_MAP.length-1];
  return r1 + (r1-r0)*(d-a1)/(a1-a0);   // Plutondan nariga ekstrapolyatsiya
}
var lsActive=false, lsRunning=false;
let lsT=0, lsSpeed=30, lsCamMode='overview', lsStopIdx=0;
let lsLabelWorld=null, lsLabelUntil=0;
const lsFlashRings=[];
const LS_DIR = new THREE.Vector3(0.82,0,-0.57).normalize();   // uchish yo'nalishi
const lsHud = document.getElementById('lsHud');
const lsLabelEl = document.getElementById('lsLabel');
const lsFinalEl = document.getElementById('lsFinal');
// Foton: JUDA kichik, lekin yorqin yadro + kuchli glow + nur dumi + iz
const lsPhoton = new THREE.Group();
lsPhoton.add(new THREE.Mesh(new THREE.SphereGeometry(0.45,16,16), new THREE.MeshBasicMaterial({color:0xffffff})));
const lsGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTexture(), color:0xfff8e0,
  transparent:true, opacity:1, blending:THREE.AdditiveBlending, depthWrite:false }));
lsGlow.scale.set(7,7,1); lsPhoton.add(lsGlow);
// Yorqin nur dumi — uchish yo'nalishi bo'ylab cho'zilgan konus
const lsBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.55, 20, 8, 1, true),
  new THREE.MeshBasicMaterial({ color:0xffe9a8, transparent:true, opacity:0.75,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide }));
lsPhoton.add(lsBeam);
lsPhoton.visible=false; scene.add(lsPhoton);
const LS_TRAIL_N = 90;
const lsTrailPos = new Float32Array(LS_TRAIL_N*3);
const lsTrailGeo = new THREE.BufferGeometry();
lsTrailGeo.setAttribute('position', new THREE.BufferAttribute(lsTrailPos,3));
const lsTrail = new THREE.Line(lsTrailGeo, new THREE.LineBasicMaterial({
  color:0xfff0b8, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending, depthWrite:false }));
lsTrail.visible=false; scene.add(lsTrail);
function lsBodyName(key){
  try{ const b=bodyData(key); if(b&&b.name) return b.name; }catch(e){}
  const L=window.LOC[LANG];
  if(L.objects&&L.objects[key]) return L.objects[key].name;
  return key;
}
function formatLightTime(s){
  const u = tUI('lsUnits')||{h:'h',m:'m',s:'s'};
  s = Math.max(0, Math.round(s));
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
  if(h>0) return h+' '+u.h+' '+m+' '+u.m;
  if(m>0) return m+' '+u.m+' '+ss+' '+u.s;
  return ss+' '+u.s;
}
function lsBuildHud(){
  const sp=document.getElementById('lsSpeeds'); sp.innerHTML='';
  [1,30,120,600].forEach(v=>{
    const b=document.createElement('button'); b.className='ls-btn'+(v===lsSpeed?' active':'');
    b.textContent=v+'×'; b.dataset.v=v;
    b.addEventListener('click', ()=>{ playClick(600); lsSpeed=v;
      sp.querySelectorAll('.ls-btn').forEach(x=>x.classList.toggle('active', +x.dataset.v===v)); });
    sp.appendChild(b);
  });
  const cm=document.getElementById('lsCams'); cm.innerHTML='';
  [['overview', tUI('lsCamO')],['follow', tUI('lsCamF')]].forEach(([mode,label])=>{
    const b=document.createElement('button'); b.className='ls-btn'+(mode===lsCamMode?' active':'');
    b.textContent=label; b.dataset.m=mode;
    b.addEventListener('click', ()=>{ playClick(640); lsCamMode=mode;
      cm.querySelectorAll('.ls-btn').forEach(x=>x.classList.toggle('active', x.dataset.m===mode)); });
    cm.appendChild(b);
  });
  // Progress belgilar — REAL masofa nisbatida (mini-infografika)
  const mk=document.getElementById('lsProgMarks'); mk.innerHTML='';
  LS_STOPS.forEach(st=>{
    const el=document.createElement('div'); el.className='ls-mark';
    el.style.left=(st.au/39.48*100)+'%';
    const s2=document.createElement('span'); s2.textContent=lsBodyName(st.key).slice(0,3);
    el.appendChild(s2); mk.appendChild(el);
  });
  document.getElementById('lsTimeK').textContent=tUI('lsTime');
  document.getElementById('lsDistK').textContent=tUI('lsDist');
  document.getElementById('lsNextK').textContent=tUI('lsNext');
}
function startLightSpeed(){
  if(typeof stopTour==='function' && tourActive) stopTour(false);
  if(typeof stopHunt==='function' && huntActive) stopHunt();
  if(typeof realTimeMode!=='undefined' && realTimeMode) setRealTime(false);
  closePanel(); if(typeof closeCosmos==='function') closeCosmos();
  lsActive=true; lsRunning=true; lsT=0; lsStopIdx=0;
  document.body.classList.add('lightspeed');
  document.getElementById('lsBtn').classList.add('active');
  lsPhoton.visible=true; lsTrail.visible=true;
  const p0 = LS_DIR.clone().multiplyScalar(SUN_RADIUS+0.5);
  for(let i=0;i<LS_TRAIL_N;i++){ lsTrailPos[i*3]=p0.x; lsTrailPos[i*3+1]=p0.y; lsTrailPos[i*3+2]=p0.z; }
  lsTrailGeo.attributes.position.needsUpdate=true;
  lsBuildHud(); lsHud.classList.add('on');
  lsFinalEl.classList.remove('open');
  lsLabelEl.classList.remove('on');
  // Start chaqnashi + fakt
  playClick(950);
  flashBody(sun, 0xffd98a);
  showToast(tUI('lsStartFact'));
  flight={ fromCam:camera.position.clone(), toCamFixed:new THREE.Vector3(60,120,330),
    fromTgt:controls.target.clone(), toTgtFixed:new THREE.Vector3(0,0,0), rec:null, t:0, dur:1.6 };
  focusRec=null;
}
function stopLightSpeed(){
  if(!lsActive) return;
  lsActive=false; lsRunning=false;
  document.body.classList.remove('lightspeed');
  document.getElementById('lsBtn').classList.remove('active');
  lsPhoton.visible=false; lsTrail.visible=false;
  lsHud.classList.remove('on'); lsLabelEl.classList.remove('on');
  lsFinalEl.classList.remove('open');
  lsFlashRings.forEach(f=>scene.remove(f.obj)); lsFlashRings.length=0;
  flyToOverview();
}
function lsShowFinal(){
  lsRunning=false;
  const list=document.getElementById('lsFinalList'); list.innerHTML='';
  LS_STOPS.forEach(st=>{
    const row=document.createElement('div'); row.className='ls-final-row';
    const n=document.createElement('span'); n.textContent=lsBodyName(st.key);
    const t=document.createElement('span'); t.className='t'; t.textContent=formatLightTime(st.au*LS_AU_S);
    row.append(n,t); list.appendChild(row);
  });
  document.getElementById('lsFinalTitle').textContent=tUI('lsFinalTitle');
  document.getElementById('lsFinalFact').textContent=tUI('lsFinalFact');
  document.getElementById('lsReplayBtn').textContent=tUI('lsReplay');
  document.getElementById('lsExitBtn').textContent=tUI('lsExit');
  lsFinalEl.classList.add('open');
  playClick(880);
}
document.getElementById('lsBtn').addEventListener('click', ()=>{
  playClick(760);
  lsActive ? stopLightSpeed() : startLightSpeed();
});
document.getElementById('lsClose').addEventListener('click', ()=>{ playClick(440); stopLightSpeed(); });
document.getElementById('lsReplayBtn').addEventListener('click', ()=>{ playClick(700); startLightSpeed(); });
document.getElementById('lsExitBtn').addEventListener('click', ()=>{ playClick(440); stopLightSpeed(); });
// Har kadrdagi yangilanish — animate() dan chaqiriladi
function lsUpdate(dt){
  if(!lsActive) return;
  if(lsRunning && simSpeed>0) lsT += dt*lsSpeed;   // global pauza demoni ham muzlatadi
  const dAU = lsT / LS_AU_S;
  const r = sceneRadiusFromAU(dAU);
  const pos = LS_DIR.clone().multiplyScalar(r);
  lsPhoton.position.copy(pos);
  const pulse = 1 + Math.sin(clock.elapsedTime*10)*0.15;
  lsGlow.scale.set(7*pulse, 7*pulse, 1);
  // Nur dumi fotondan orqaga qaraydi
  lsBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), LS_DIR.clone().negate());
  lsBeam.position.copy(LS_DIR.clone().multiplyScalar(-10.5));
  // Iz: buferni orqaga surib, boshiga yangi nuqta
  if(lsRunning){
    for(let i=LS_TRAIL_N-1;i>0;i--){
      lsTrailPos[i*3]=lsTrailPos[(i-1)*3]; lsTrailPos[i*3+1]=lsTrailPos[(i-1)*3+1]; lsTrailPos[i*3+2]=lsTrailPos[(i-1)*3+2];
    }
    lsTrailPos[0]=pos.x; lsTrailPos[1]=pos.y; lsTrailPos[2]=pos.z;
    lsTrailGeo.attributes.position.needsUpdate=true;
  }
  // Bosqich kesildi
  while(lsStopIdx<LS_STOPS.length && dAU>=LS_STOPS[lsStopIdx].au){
    const st=LS_STOPS[lsStopIdx];
    playClick(500 + lsStopIdx*50);
    // Orbita halqasi chaqnashi
    const ring = makeOrbitRing(sceneRadiusFromAU(st.au));
    ring.material = ring.material.clone();
    ring.material.color.set(0x9fd0ff); ring.material.opacity=0.9;
    scene.add(ring); lsFlashRings.push({obj:ring, life:1});
    // Yorliq
    lsLabelWorld = LS_DIR.clone().multiplyScalar(sceneRadiusFromAU(st.au));
    lsLabelUntil = clock.elapsedTime + 5;
    const facts = tUI('lsFacts')||{};
    lsLabelEl.innerHTML='';
    const ln=document.createElement('div'); ln.className='ln'; ln.textContent=lsBodyName(st.key);
    const lt=document.createElement('div'); lt.className='lt'; lt.textContent=formatLightTime(st.au*LS_AU_S);
    const lf=document.createElement('div'); lf.className='lf'; lf.textContent=facts[st.key]||'';
    lsLabelEl.append(ln,lt,lf);
    lsLabelEl.classList.add('on');
    lsStopIdx++;
    if(lsStopIdx>=LS_STOPS.length){ lsShowFinal(); }
  }
  // Yorliq pozitsiyasi (Vector3.project)
  if(lsLabelEl.classList.contains('on')){
    if(clock.elapsedTime>lsLabelUntil){ lsLabelEl.classList.remove('on'); }
    else if(lsLabelWorld){
      const v=lsLabelWorld.clone().project(camera);
      if(v.z<1){
        lsLabelEl.style.left=((v.x*0.5+0.5)*window.innerWidth)+'px';
        lsLabelEl.style.top=((-v.y*0.5+0.5)*window.innerHeight)+'px';
      }
    }
  }
  // Halqa chaqnashlari so'nadi
  for(let i=lsFlashRings.length-1;i>=0;i--){
    const f=lsFlashRings[i]; f.life-=dt;
    f.obj.material.opacity=Math.max(0,f.life)*0.9;
    if(f.life<=0){ scene.remove(f.obj); lsFlashRings.splice(i,1); }
  }
  // HUD
  document.getElementById('lsTimeV').textContent = formatLightTime(lsT);
  const km = dAU*149.5978707;
  document.getElementById('lsDistV').textContent = km.toFixed(km<10?2:1)+' mln km · '+dAU.toFixed(2)+' AU';
  const next = LS_STOPS[lsStopIdx];
  document.getElementById('lsNextV').textContent = next
    ? lsBodyName(next.key)+' · '+formatLightTime(next.au*LS_AU_S - lsT) : '—';
  document.getElementById('lsProgFill').style.width = Math.min(100, dAU/39.48*100)+'%';
  // Kamera (foydalanuvchi flight paytida aralashmaydi)
  if(!flight && lsRunning){
    if(lsCamMode==='follow'){
      const camP = pos.clone().sub(LS_DIR.clone().multiplyScalar(22)); camP.y += 7;
      camera.position.lerp(camP, 1-Math.pow(0.005,dt));
      controls.target.lerp(pos.clone().add(LS_DIR.clone().multiplyScalar(25)), 1-Math.pow(0.005,dt));
    } else {
      const dist = Math.max(220, r*1.55+70);
      const camP = new THREE.Vector3(60, dist*0.42, dist); 
      camera.position.lerp(camP, 1-Math.pow(0.02,dt));
      controls.target.lerp(new THREE.Vector3(pos.x*0.4, 0, pos.z*0.4), 1-Math.pow(0.02,dt));
    }
  }
}
window.addEventListener('keydown', e=>{ if(e.key==='Escape' && lsActive) stopLightSpeed(); });

/* --------------------------------------------------------------------------
   24. ICHKI TUZILISH KESIMI — 3D portlagan (exploded) ko'rinish
   Ikkinchi WebGL kontekst OCHILMAYDI: modal ochiq payt asosiy renderer
   alohida cutScene ni chizadi, yopilganda resurslar dispose() qilinadi.
   Qatlam texnikasi: 3/4 sfera (phiLength=1.5π) + ikki yarim-doira kesim
   devori (CircleGeometry, φ=0 — XY tekislik; φ=1.5π — rotation.y=-π/2).
   Kesik bo'shliq bissektrisasi φ=1.75π → model rotation.y=3π/4 bilan kameraga qaratiladi.
   Qatlam nisbatlari (rScale) STRUCT_GEO da: Yer 0.19/0.55/0.98/1.0, Merkuriy yadrosi 0.85.
   -------------------------------------------------------------------------- */
var cutActive=false;
let cutScene=null, cutCamera=null, cutControls=null, cutModel=null;
let cutLayers=[], cutKey=null, cutSel=-1, cutExplodeF=0, cutExplodeTarget=1;
let cutOpenT=0, cutIdleT=99, cutClicksDone=[], cutCoreGlow=null;
const CUT_ORDER=['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
// "Issiqlik dramaturgiyasi" palitralari (ichkaridan tashqariga: cho'g' → sovuq)
const CUT_PAL={
  sun:    ['#fff9e0','#ffd54f','#ff9e1b','#ff6d00'],
  mercury:['#ffe9a3','#e0703c','#b8a88f'],
  venus:  ['#ffe9a3','#d4592f','#f2c07d'],
  earth:  ['#fff7cf','#ff8a50','#c94f2e','#3d8bff'],
  mars:   ['#ffe0a3','#c24d30','#ef6a3c'],
  jupiter:['#fff8d6','#f2c27e','#d6a05e','#c08a4a'],
  saturn: ['#fff8d6','#f5cc85','#dcae6c','#c08a4a'],
  uranus: ['#ffe0a3','#3fc3e8','#bff2f7'],
  neptune:['#ffe0a3','#3f7bff','#6a8dff']
};
const CUT_R = 26;   // displey radiusi (sahna birligi)
const cutViewEl=document.getElementById('cutView');
const cutLabelsEl=document.getElementById('cutLabels');
const cutSvgEl=document.getElementById('cutSvg');
const cutDetailEl=document.getElementById('cutDetail');
// Kesim devori teksturasi: halqa ichki chetida yorqin-issiq → tashqi chetida sovuq rang
// innerFrac — halqa ichki radiusining tashqi radiusga nisbati (gradient shu yerdan boshlanadi)
function crossSectionTexture(cHot, cCold, innerFrac){
  const s=256,c=makeCanvas(s,s),ctx=c.getContext('2d');
  const r0=s/2*Math.max(0.02,(innerFrac||0)*0.92);
  const g=ctx.createRadialGradient(s/2,s/2, r0, s/2,s/2, s/2);
  g.addColorStop(0,cHot); g.addColorStop(0.3,cHot); g.addColorStop(1,cCold);
  ctx.fillStyle=g; ctx.fillRect(0,0,s,s);
  // mayda donador shovqin
  ctx.globalAlpha=0.12;
  speckle(ctx,s,s,1600,()=>Math.random()>0.5?'#000':'#fff',0.5,1.6);
  // konsentrik "geologik" halqalar — kesim tuzilishi yaqqol ko'rinadi
  ctx.globalAlpha=0.22; ctx.strokeStyle='#fff'; ctx.lineWidth=2;
  for(let k=1;k<=4;k++){ ctx.beginPath(); ctx.arc(s/2,s/2, r0+(s/2-r0)*k/5, 0, Math.PI*2); ctx.stroke(); }
  ctx.globalAlpha=1;
  return asTexture(c);
}
// Tashqi qatlam uchun HAQIQIY sirt teksturasi (asosiy sahna generatorlari qayta ishlatiladi)
function cutSurfaceTexture(key){
  if(window.__REALTEX && window.__REALTEX[key]) return window.__REALTEX[key];
  if(key==='earth') return earthDayTexture();   // okean, o'simlik, cho'l, qutb muzliklari
  if(key==='sun') return rockyTexture('#ff9e1b',['#ffd54f','#ff6d00','#ffcf6a'],0);   // fotosfera granulalari
  if(key==='mercury') return rockyTexture('#8a7a68',['#6f6052','#a89683'],90);
  if(key==='mars') return rockyTexture('#b04a2a',['#8f3a22','#d06a44','#6f2e1c'],110);
  if(key==='venus') return gasGiantTexture([{c1:'#e8c98a',c2:'#d8a96b'},{c1:'#d6b074',c2:'#c89a5c'},{c1:'#e3c184',c2:'#cfa566'},{c1:'#d2a45e',c2:'#e0bb7c'}]);
  if(key==='jupiter') return gasGiantTexture([{c1:'#d8c4a0',c2:'#c9a877'},{c1:'#b98c5a',c2:'#a67a48'},{c1:'#e0d2b4',c2:'#cdb389'},{c1:'#a87648',c2:'#946539'},{c1:'#ddc9a4',c2:'#c7a472'},{c1:'#b3895a',c2:'#9c7344'}],{redSpot:true});
  if(key==='saturn') return gasGiantTexture([{c1:'#e8d6ac',c2:'#dcc796'},{c1:'#cfb47e',c2:'#c4a86f'},{c1:'#e3d3a3',c2:'#d6c187'},{c1:'#c9ad72',c2:'#dac38a'}]);
  if(key==='uranus') return gasGiantTexture([{c1:'#bfeef0',c2:'#a6e2e8'},{c1:'#9fe0e6',c2:'#8fd6dd'},{c1:'#b4eaee',c2:'#a0e0e6'}]);
  if(key==='neptune') return gasGiantTexture([{c1:'#4a6be0',c2:'#3b5bdb'},{c1:'#345bd0',c2:'#2e4fc4'},{c1:'#4f70e6',c2:'#3d5dd8'},{c1:'#2c4ec0',c2:'#3a5ad4'}]);
  return null;
}
function cutInitScene(){
  if(cutScene) return;
  cutScene=new THREE.Scene();
  cutScene.background=new THREE.Color(0x05060f);
  cutCamera=new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 800);
  cutCamera.position.set(0, 26, 118);
  cutControls=new THREE.OrbitControls(cutCamera, renderer.domElement);
  cutControls.enableDamping=true; cutControls.dampingFactor=0.07;
  cutControls.enablePan=false; cutControls.minDistance=45; cutControls.maxDistance=240;
  cutControls.target.set(0,0,0); cutControls.enabled=false;
  cutControls.addEventListener('start', ()=>{ cutIdleT=0; });   // drag paytida avtoaylanish to'xtaydi
  // Yoritish: xira ambient + kameradan neytral yo'nalishli (yadro nuri modelda PointLight)
  cutScene.add(new THREE.AmbientLight(0xbbccee, 0.6));
  const d1=new THREE.DirectionalLight(0xffffff, 0.95); d1.position.set(0.3,0.5,1); cutScene.add(d1);
  // orqa fonda xira yulduzlar
  const n=300, pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){ const u=Math.random(),v=Math.random();
    const th=2*Math.PI*u, ph=Math.acos(2*v-1), r=350;
    pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pos[i*3+2]=r*Math.cos(ph); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos,3));
  cutScene.add(new THREE.Points(sg, new THREE.PointsMaterial({size:2.4, map:SPRITE, color:0x8899cc,
    transparent:true, opacity:0.5, depthWrite:false, blending:THREE.AdditiveBlending})));
}
// Umumiy teksturalar (protsedural kesh, haqiqiy NASA xaritalari, SPRITE) asosiy sahnada ham ishlatiladi —
// rejim yopilganda ularni dispose() qilish asosiy sahnani 2K teksturalarni qayta yuklashga majburlab, qotirardi.
function isSharedTex(t){
  if(!t) return true;
  if(typeof ImageBitmap!=='undefined' && t.image instanceof ImageBitmap) return true;   // realtex.js
  if(t===SPRITE) return true;
  for(const k in _texCache){ const v=_texCache[k];
    if(v===t || (v && v.userData && (v.userData.normalMap===t || v.userData.roughnessMap===t))) return true; }
  return false;
}
function disposeOwnedTex(t){ if(t && t.dispose && !isSharedTex(t)) t.dispose(); }
function cutDisposeModel(){
  if(!cutModel) return;
  cutModel.traverse(o=>{
    if(o.geometry) o.geometry.dispose();
    if(o.material){ disposeOwnedTex(o.material.map); disposeOwnedTex(o.material.alphaMap); o.material.dispose(); }
  });
  cutScene.remove(cutModel); cutModel=null; cutLayers=[]; cutCoreGlow=null;
}
function cutBuildModel(key){
  cutDisposeModel();
  cutKey=key; cutSel=-1; cutDetailEl.classList.remove('on');
  const geo=STRUCT_GEO[key];
  const info=(window.LOC[LANG].structure||{})[key]||{layers:[]};
  const pal=CUT_PAL[key]||geo.map(g=>g.c);
  // Displey radiuslari: ilmiy rScale + minimal ko'rinarli qalinlik (0.12), so'ng normallash
  let rs=geo.map(g=>g.r);
  for(let i=1;i<rs.length;i++){ if(rs[i]-rs[i-1]<0.12) rs[i]=rs[i-1]+0.12; }
  const maxRs=rs[rs.length-1]; rs=rs.map(v=>v/maxRs);
  const seg=window.innerWidth<680?32:48;   // mobil uchun kam segment
  cutModel=new THREE.Group();
  cutModel.rotation.y=Math.PI*0.75;        // kesik bo'shliq kameraga ~45° bilan qaraydi
  const N=rs.length;
  cutOpenT=0; cutIdleT=99; cutClicksDone=[];
  // To'liq ajralish: qatlamlar orasi = radiuslar yig'indisi + GAP, so'ng markazlash
  const GAP=CUT_R*0.32, offs=[0];
  for(let i=1;i<N;i++) offs.push(offs[i-1]-(rs[i-1]*CUT_R + GAP + rs[i]*CUT_R));
  const midY=(offs[0]+offs[N-1])/2;
  for(let i=0;i<N;i++){
    const r=rs[i]*CUT_R;
    const rIn=i===0?0:rs[i-1]*CUT_R;
    const grp=new THREE.Group();
    if(i===0){
      // Yadro — modal ichidagi ENG YORQIN obyekt: to'liq shar + glow + ichki nur manbai
      const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,seg),
        new THREE.MeshBasicMaterial({color:pal[0], transparent:true}));
      m.userData.layerIndex=0; grp.add(m);
      cutCoreGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(), color:pal[0],
        transparent:true, opacity:0.95, blending:THREE.AdditiveBlending, depthWrite:false}));
      cutCoreGlow.userData.baseScale=r*4.2;
      cutCoreGlow.scale.set(r*4.2,r*4.2,1); grp.add(cutCoreGlow);
      grp.add(new THREE.PointLight(0xffcf8a, 1.2, CUT_R*7, 2));   // "ichidan nur taraladi"
    } else {
      // Kesik kosa: tashqi sirt (FrontSide) + ichki sirt (BackSide, to'qroq) + 2 halqa devor
      // Eng tashqi qatlam — sayyoraning haqiqiy tashqi ko'rinishi (Yerda okean/qit'a/muz)
      const isSurf=(i===N-1);
      const outer=new THREE.Mesh(new THREE.SphereGeometry(r,seg,seg,0,Math.PI*1.5),
        isSurf
          ? new THREE.MeshBasicMaterial({map:cutSurfaceTexture(key), transparent:true})
          : new THREE.MeshStandardMaterial({color:pal[i], roughness:0.6, transparent:true,
              emissive:new THREE.Color(pal[i]), emissiveIntensity:0.35}));
      const inner=new THREE.Mesh(new THREE.SphereGeometry(Math.max(rIn, r*0.3),seg,seg,0,Math.PI*1.5),
        new THREE.MeshStandardMaterial({color:shadeColor(pal[i],-30), roughness:1,
          emissive:new THREE.Color(shadeColor(pal[i],-30)), emissiveIntensity:0.2,
          side:THREE.BackSide, transparent:true}));
      // Kesim devorlari yoritishsiz (MeshBasic) — ranglar maksimal yorqin
      const wallMat=new THREE.MeshBasicMaterial({
        map:crossSectionTexture(pal[i-1], pal[i], rIn/r),
        side:THREE.DoubleSide, transparent:true});
      const w1=new THREE.Mesh(new THREE.RingGeometry(Math.max(rIn,r*0.04), r, seg, 1, Math.PI/2, Math.PI), wallMat);           // φ=0 devori (XY)
      const w2=new THREE.Mesh(new THREE.RingGeometry(Math.max(rIn,r*0.04), r, seg, 1, Math.PI/2, Math.PI), wallMat.clone());
      w2.rotation.y=-Math.PI/2;                                   // φ=1.5π devori (YZ)
      [outer,inner,w1,w2].forEach(o=>o.userData.layerIndex=i);
      grp.add(outer,inner,w1,w2);
      if(isSurf && key==='earth'){   // Yer ustida yupqa bulut qatlami
        const cl=new THREE.Mesh(new THREE.SphereGeometry(r*1.02,seg,seg,0,Math.PI*1.5),
          new THREE.MeshBasicMaterial({map:RT_ON?null:cloudTexture(), alphaMap:RT_ON?flatTexture('#000000'):null, transparent:true, opacity:0.8, depthWrite:false}));
        cl.userData.layerIndex=i; cl.userData.baseOp=0.8; grp.add(cl);
        if(window.REALTEX) window.REALTEX.clouds(cl, { opacity:0.8 });   // haqiqiy bulut xaritasi
      }
    }
    // Portlagan joylashuv: yadro tepada, har qatlam TO'LIQ ajralgan holda pastga
    grp.userData.yOff=offs[i]-midY;
    grp.userData.layerIndex=i;
    grp.userData.openDelay=(N-1-i)*0.12;   // stagger: pastdan (tashqi) yuqoriga
    grp.userData.openF=0;
    cutModel.add(grp);
    cutLayers.push({grp, r, name:(info.layers[i]||{}).n||'', desc:(info.layers[i]||{}).t||'', color:pal[i]});
    cutClicksDone.push(false);
  }
  // Model balandligi kamera ko'rinishiga sig'sin
  const totalH=(offs[0]-offs[N-1])+rs[0]*CUT_R+rs[N-1]*CUT_R;
  cutModel.scale.setScalar(Math.min(1, 95/totalH));
  cutScene.add(cutModel);
  document.getElementById('cutTitle').textContent=(info.title)||key;
  // DOM yorliqlar
  cutLabelsEl.innerHTML=''; cutSvgEl.innerHTML='';
  cutLayers.forEach((ly,i)=>{
    const el=document.createElement('div'); el.className='cut-label'; el.textContent=(i+1)+'. '+ly.name;
    el.style.borderLeft='3px solid '+ly.color;
    el.addEventListener('click', ()=>cutSelect(i===cutSel?-1:i));
    cutLabelsEl.appendChild(el);
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    cutSvgEl.appendChild(line);
    ly.label=el; ly.line=line;
  });
}
function cutSelect(i){
  cutSel=i; playClick(i<0?440:700+i*60);
  cutLayers.forEach((ly,j)=>{
    const dim=(i>=0 && j!==i);
    ly.grp.traverse(o=>{ if(o.material && o.material.opacity!==undefined) o.material.opacity=dim?0.35:(o.userData&&o.userData.baseOp||1); });
    ly.label.classList.toggle('sel', j===i);
  });
  if(i>=0){
    cutDetailEl.innerHTML='';
    const n=document.createElement('div'); n.className='cd-n'; n.textContent=cutLayers[i].name;
    const t=document.createElement('div'); t.className='cd-t'; t.textContent=cutLayers[i].desc;
    cutDetailEl.append(n,t); cutDetailEl.classList.add('on');
  } else cutDetailEl.classList.remove('on');
}
function openCut(key){
  cutInitScene();
  cutBuildModel(key);
  cutActive=true; cutExplodeF=0; cutExplodeTarget=1;
  document.getElementById('cutExplode').value=100;
  closePanel();
  document.body.classList.add('cutmode');
  cutViewEl.classList.add('on');
  controls.enabled=false; cutControls.enabled=true;
  cutCamera.position.set(0,26,118); cutControls.target.set(0,0,0);
  playClick(600);
}
function closeCut(){
  if(!cutActive) return;
  cutActive=false;
  document.body.classList.remove('cutmode');
  cutViewEl.classList.remove('on');
  cutDisposeModel();
  cutControls.enabled=false; controls.enabled=true;
}
document.getElementById('cutClose').addEventListener('click', ()=>{ playClick(440); closeCut(); });
window.addEventListener('keydown', e=>{ if(e.key==='Escape' && cutActive) closeCut(); });
document.getElementById('cutExplode').addEventListener('input', e=>{
  cutExplodeTarget=+e.target.value/100;
});
function cutStep(dirn){
  const idx=(CUT_ORDER.indexOf(cutKey)+dirn+CUT_ORDER.length)%CUT_ORDER.length;
  playClick(660);
  cutBuildModel(CUT_ORDER[idx]);
  cutExplodeF=0;   // yangi jism yig'ilgan holdan ochiladi
}
document.getElementById('cutPrev').addEventListener('click', ()=>cutStep(-1));
document.getElementById('cutNext').addEventListener('click', ()=>cutStep(1));
// Qatlamni sahnada bosib tanlash
let cutDownXY=null;
renderer.domElement.addEventListener('pointerdown', e=>{ if(cutActive) cutDownXY=[e.clientX,e.clientY]; });
renderer.domElement.addEventListener('pointerup', e=>{
  if(!cutActive || !cutDownXY) return;
  const moved=Math.hypot(e.clientX-cutDownXY[0], e.clientY-cutDownXY[1]);
  cutDownXY=null;
  if(moved>6) return;
  pointer.x=(e.clientX/window.innerWidth)*2-1;
  pointer.y=-(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(pointer, cutCamera);
  const hits=raycaster.intersectObjects(cutModel.children, true);
  const hit=hits.find(h2=>h2.object.userData.layerIndex!==undefined);
  if(hit){ const i=hit.object.userData.layerIndex; cutSelect(i===cutSel?-1:i); }
  else cutSelect(-1);
});
// Har kadr: ochilish animatsiyasi, yorliq proyeksiyasi, render
function cutUpdate(dt){
  // ochilish/yig'ilish: stagger (120 ms) + slayder master koeffitsienti
  cutExplodeF += (cutExplodeTarget-cutExplodeF)*(1-Math.pow(0.002,dt));
  cutOpenT += dt;
  cutLayers.forEach((ly,i)=>{
    const gd=ly.grp.userData;
    const f=Math.min(1, Math.max(0,(cutOpenT-gd.openDelay)/0.6));
    gd.openF=easeInOut(f);
    if(!cutClicksDone[i] && f>0.05){ cutClicksDone[i]=true; playClick(460+(cutLayers.length-1-i)*70); }
    ly.grp.position.y=gd.yOff*cutExplodeF*gd.openF;
  });
  // Yadro glow pulsatsiyasi (2 s sinus, 1.0↔1.08)
  if(cutCoreGlow){
    const p=1+Math.sin(clock.elapsedTime*Math.PI)*0.04;
    const b=cutCoreGlow.userData.baseScale;
    cutCoreGlow.scale.set(b*p,b*p,1);
  }
  // Sekin avtoaylanish — 3 s harakatsizlikdan keyin qaytadi
  cutIdleT+=dt;
  if(cutIdleT>3 && cutModel) cutModel.rotation.y += dt*0.09;
  cutControls.update();
  renderer.render(cutScene, cutCamera);
  // Yorliqlar: chap/o'ng navbatlashib, chizg'ich chiziq bilan
  const w=window.innerWidth, hgt=window.innerHeight;
  cutLayers.forEach((ly,i)=>{
    const p=new THREE.Vector3(0, ly.grp.position.y, 0).applyMatrix4(cutModel.matrixWorld);
    const v=p.project(cutCamera);
    const sx=(v.x*0.5+0.5)*w, sy=(-v.y*0.5+0.5)*hgt;
    const side=i%2? 1 : -1;
    const lx=sx+side*(w<680?120:200);
    ly.label.style.left=lx+'px'; ly.label.style.top=sy+'px';
    const lw=ly.label.offsetWidth/2;
    ly.line.setAttribute('x1', sx+side*8); ly.line.setAttribute('y1', sy);
    ly.line.setAttribute('x2', lx-side*lw); ly.line.setAttribute('y2', sy);
  });
}

/* --------------------------------------------------------------------------
   13. ANIMATSIYA SILVASI
   -------------------------------------------------------------------------- */
const sunWorld = new THREE.Vector3();
let simSpeed = 1;       // aylanish tezligi koeffitsienti (0 = to‘xtagan)
let lastSpeed = 1;      // pauzadan keyin tiklash uchun
let simTime = 0;        // simulyatsiya vaqti (pauzada to‘xtaydi)
// Moslashuvchan sifat: kadrlar sekinlashsa piksel zichligi pasayadi (1.5 → 1.0)
// Sifat (piksel zichligi) HECH QACHON pasaytirilmaydi. Kadrlar sekinlashsa faqat panel ortidagi
// xiralashtirish (blur) vaqtincha o'chadi — sahnaning o'zi o'zgarmaydi; tezlik tiklansa qaytadi.
const PERF={ acc:0, n:0, good:0, lite:false };
function perfStep(raw){
  if(raw>0.25||document.hidden) return;
  PERF.acc+=raw; PERF.n++;
  if(PERF.n<60) return;
  const avg=PERF.acc/PERF.n; PERF.acc=0; PERF.n=0;
  if(avg>0.021){ PERF.good=0; if(!PERF.lite){ PERF.lite=true; document.body.classList.add('perf-lite'); } }
  else if(avg<0.0135){ if(++PERF.good>=6){ PERF.good=0; if(PERF.lite){ PERF.lite=false; document.body.classList.remove('perf-lite'); } } }
  else PERF.good=0;
}
function animate(){
  requestAnimationFrame(animate);
  if(document.hidden || window.__labCover || window.__authCover){ clock.getDelta(); return; }        // yashirin varaqda GPU ishlamaydi
  // Yuklanish ekrani to'liq yopib turganda 3D sahna chizilmaydi (shaderlar uchun dastlabki 3 kadrdan keyin)
  if(loader && !loader.classList.contains('hidden') && !loader.classList.contains('sp-out') && (animate._lf=(animate._lf||0)+1)>3){ clock.getDelta(); return; }
  const rawDt = clock.getDelta();
  perfStep(rawDt);
  const dt  = Math.min(rawDt, 0.05);
  // Tutilish sayohatida orbitalar to‘xtaydi — hodisa aniq ko‘rinadi
  // Teleskop rejimida sayyoralar harakati 20 barobar sekinlashadi — obyekt ko'rish maydonidan qochib ketmaydi
  const scopeSlow = document.body.classList.contains('scope-on') ? (window.__scopeSlow||0.05) : 1;
  const sdt = eclipseStage ? 0 : dt * simSpeed * scopeSlow;     // tezlikka bog‘liq vaqt qadami
  simTime  += sdt;

  // Kesim rejimi: asosiy sahna to'xtaydi, shu renderer kesim sahnasini chizadi
  if(cutActive){ cutUpdate(dt); return; }
  // Fasllar rejimi: asosiy sahna to'xtaydi, shu renderer fasllar sahnasini chizadi
  if(seasonsActive){ snUpdate(dt); return; }

  // Quyosh shader vaqti + korona pulsatsiyasi (pauzada to‘xtaydi)
  sunMat.uniforms.time.value = simTime;
  const pulse = 1 + Math.sin(simTime*1.5)*0.04;
  corona.scale.set(SUN_RADIUS*7*pulse, SUN_RADIUS*7*pulse, 1);
  sun.rotation.y += sdt*0.05;

  // Sayyoralar: orbita + o‘z o‘qi atrofida aylanish
  // (real vaqt rejimida orbital burchakni Kepler bloki boshqaradi)
  orbitObjects.forEach(rec=>{
    if(!realTimeMode && !lsActive && !(IMPX.phase && IMPX.rec===rec)) rec.pivot.rotation.y += rec.speed * sdt * 12;
    rec.mesh.rotation.y  += rec.spin  * sdt * 60;
    if(rec.extras.clouds)   rec.extras.clouds.rotation.y += sdt*0.06;
    if(rec.extras.moons) rec.extras.moons.forEach(m=>{ m.pivot.rotation.y += m.speed * sdt; });
    if(rec.extras.sats) rec.extras.sats.forEach(s=>{
      s.pivot.rotation.y += s.speed * sdt;
      s.satMesh.rotation.y += s.spin * sdt;
    });
    // Yer shaderiga Quyosh yo‘nalishini berish
    if(rec.special==='earth'){
      rec.mesh.getWorldPosition(tmpV);
      sun.getWorldPosition(sunWorld);
      const dir=new THREE.Vector3().subVectors(sunWorld,tmpV).normalize();
      rec.mesh.material.uniforms.sunDir.value.copy(dir);
    }
  });

  // Qo‘shimcha obyektlar (Serera, Pluton) orbitada aylanadi
  EXTRA_BODIES.forEach(b=>{
    if(!lsActive && !(realTimeMode && KEPLER[b.key])) b.pivot.rotation.y += b.speed * sdt * 12;
    b.mesh.rotation.y  += b.spin  * sdt * 60;
  });
  // Yirik asteroidlar: orbita bo‘ylab harakat + o‘z o‘qida dumalash
  heroAsteroids.forEach(ha=>{
    ha.pivot.rotation.y += ha.orbitSpeed * sdt;
    ha.mesh.rotation.x += ha.spinX * sdt;
    ha.mesh.rotation.y += ha.spinY * sdt;
  });
  // Meteorlar: uchish, so‘nish va yangilarini tug‘ilishi
  meteorTimer -= dt;
  if(meteorTimer<=0 && meteors.length<4){
    spawnMeteor();
    meteorTimer = 1.5+Math.random()*4;   // keyingi meteorgacha tasodifiy tanaffus
  }
  for(let mi=meteors.length-1; mi>=0; mi--){
    const m = meteors[mi];
    m.life += dt;
    m.g.position.addScaledVector(m.dir, m.speed*dt);
    const fade = Math.min(1, Math.min(m.life/0.3, (m.maxLife-m.life)/0.6));  // paydo bo‘lish/so‘nish
    m.head.material.opacity = fade;
    m.glow.material.opacity = fade;
    m.trail.material.opacity = 0.55*fade;
    if(m.life>=m.maxLife){
      scene.remove(m.g);
      m.g.traverse(o=>{ if(o.material) o.material.dispose(); if(o.geometry) o.geometry.dispose(); });
      meteors.splice(mi,1);
    }
  }
  // Koyper kamari juda sekin aylanadi
  kuiperGroup.rotation.y += sdt*0.008;

  // Asteroidlar kamari sekin aylanadi
  beltGroup.rotation.y += sdt*0.02;

  // Kometalar elliptik orbitada
  comets.forEach(c=>cometStep(c, sdt, dt));

  // Parallaks: yulduz qatlamlari turli tezlikda aylanadi + jimirlash
  starsFar.rotation.y  += sdt*0.004;
  starsNear.rotation.y -= sdt*0.006;
  starsNear.material.opacity = 0.5 + Math.sin(clock.elapsedTime*1.7)*0.12;   // jimirlash (xiraroq — katalog ustun)
  skyGridStep(dt);
  CON_ALL.step(dt);
  skyPoleStep(dt);
  constLinesStep(dt);
  nebulaGroup.rotation.y += sdt*0.002;
  dust.rotation.y += sdt*0.01;

  // Quyosh tutilishi rejimi: Oy Yer\u2013Quyosh chizig\u2018iga, kamera esa ular orasiga joylashadi
  if(eclipseStage){
    const er = orbitObjects.find(r=>r.key==='earth');
    er.mesh.getWorldPosition(tmpV);                          // Yer dunyo pozitsiyasi
    const dir = tmpV.clone().negate().normalize();           // Yer -> Quyosh yo'nalishi
    // Oy sekin «o‘tib ketadi»: 2-bosqichda kirib yopadi, 3-bosqichda chetga siljiydi
    const perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();
    let ox;
    if(eclipseStage===2) ox = 2.0*(1 - Math.min(1, eclipseT/4.5));          // kirish → to‘liq yopish
    else ox = 0.8*Math.min(1, Math.max(0, eclipseT-1.5)/6.5);              // olmos uzuk → o‘tib ketish
    if(er.extras.moonPivot){
      const moonDirWorld = dir.clone().multiplyScalar(8).addScaledVector(perp, ox).normalize();
      const pLocal = er.mesh.worldToLocal(tmpV.clone().add(moonDirWorld)).normalize();
      er.extras.moonPivot.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0), pLocal);
    }
    // Kamera: 2-bosqich — Oy Quyoshni to'liq yopadi; 3-bosqich — «olmos uzuk» (halqa)
    // 1.2 s silliq kirishdan so'ng kamera AYNAN chiziqda turadi — aks holda
    // Yer orbitada siljib ketadi va kamera doim orqada qolardi
    const d = eclipseStage===2 ? 5.3 : 4.1;
    const camT = tmpV.clone().addScaledVector(dir, d);
    eclipseT += dt;
    const f = easeInOut(Math.min(1, eclipseT/1.2));
    camera.position.lerpVectors(eclipseFromCam, camT, f);
    controls.target.lerpVectors(eclipseFromTgt, new THREE.Vector3(0,0,0), f);
  }

  // Qora tuynuklar: disk oqimi, so'rilayotgan gaz va yutilayotgan bo'laklar
  if(typeof BLACKHOLES!=='undefined'){ BH_TIME.value = clock.elapsedTime;
    Object.values(BLACKHOLES).forEach(b=>bhUpdate(b,dt)); }

  // "Sayyorani top" flash effekti — nishonga ergashadi va so'nadi
  if(huntFlash.visible && huntFlashTarget){
    huntFlashTarget.getWorldPosition(tmpV);
    huntFlash.position.copy(tmpV);
    huntFlashT -= dt;
    const o = Math.max(0, huntFlashT/1.2);
    huntFlash.material.opacity = o * (0.7+0.3*Math.sin(clock.elapsedTime*14));
    if(huntFlashT<=0) huntFlash.visible=false;
  }

  // Real vaqt rejimi: silliq o‘tish yoki vaqt oqimi
  if(realTimeMode){
    if(rtTransition){
      rtTransition.t += dt/rtTransition.dur;
      const k = easeInOut(Math.min(rtTransition.t,1));
      rtBodies().forEach(b=>{
        const f=rtTransition.from.get(b.key), t2=rtTransition.to.get(b.key);
        if(f!==undefined) b.pivot.rotation.y = f+(t2-f)*k;
      });
      if(rtTransition.t>=1) rtTransition=null;
    } else {
      // 1× = real vaqt; 3× ≈ 1 soniya = 1 hafta (logarifmik shkala)
      const ts = (simSpeed<=1 ? simSpeed : Math.pow(604800, (simSpeed-1)/2)) * scopeSlow;
      if(ts>0) rtDate = new Date(rtDate.getTime() + dt*ts*1000);
      rtCalcTimer += dt;
      // real tezlikda burchak o‘zgarishi mikroskopik — sekundiga 1 marta kifoya;
      // tezlashtirilganda har kadrda
      if(ts>3600 || rtCalcTimer>1){ rtCalcTimer=0; rtApply(rtDate,false); rtSyncUI(); }
    }
  }

  // Yorug'lik tezligi demosi
  lsUpdate(dt);

  craftStep(sdt); impactStep(dt);
  // Kamera uchish animatsiyasi
  if(flight){
    flight.t += dt/flight.dur;
    if(flight.rec && flight.rec!=='sun' && flight.rec.mesh.userData.followRot) flight.offset.applyQuaternion(followRotDelta(flight.rec.mesh));
    const k = easeInOut(Math.min(flight.t,1));
    if(flight.rec){
      // Sayyora/Quyoshga nisbatan barqaror ofset — joriy pozitsiyani kuzatadi
      if(flight.rec==='sun') tmpV.set(0,0,0);
      else flight.rec.mesh.getWorldPosition(tmpV);
      const camTarget = tmpV.clone().add(flight.offset);
      camera.position.lerpVectors(flight.fromCam, camTarget, k);
      controls.target.lerpVectors(flight.fromTgt, focusTarget(tmpV), k);
    } else {
      // Umumiy ko‘rinishga qaytish (qat'iy nuqtaga)
      camera.position.lerpVectors(flight.fromCam, flight.toCamFixed, k);
      controls.target.lerpVectors(flight.fromTgt, flight.toTgtFixed, k);
    }
    if(flight.t>=1){
      if(flight.rec && flight.rec!=='sun'){
        focusRec=flight.rec;
        focusRec.mesh.getWorldPosition(focusPrev);
        focusTgt.off.copy(controls.target).sub(focusPrev); focusTgt.goal.copy(focusTgt.off); focusTgt.panel=panel.classList.contains('open');
      }
      flight=null;
    }
  } else if(focusRec){
    // Sayyora bilan birga harakatlanish — kamera u bilan suriladi, atrofida aylanish mumkin
    focusRec.mesh.getWorldPosition(tmpV);
    const off=camera.position.clone().sub(focusPrev);
    if(focusRec.mesh.userData.followRot){
      // apparat burilsa kamera VA target birga buriladi — focusTarget() kamera yo'nalishiga bog'liq, shuning uchun
      // har kadr qayta hisoblansa teskari aloqa hosil bo'lib, tasvir titraydi
      const dq=followRotDelta(focusRec.mesh); off.applyQuaternion(dq);
      const po=panel.classList.contains('open');
      if(po!==focusTgt.panel){ focusTgt.panel=po; focusTgt.goal.copy(focusTarget(tmpV)).sub(tmpV); }
      focusTgt.off.applyQuaternion(dq); focusTgt.goal.applyQuaternion(dq);
      focusTgt.off.lerp(focusTgt.goal, 1-Math.exp(-dt*5));
      camera.position.copy(tmpV).add(off); focusPrev.copy(tmpV);
      controls.target.copy(tmpV).add(focusTgt.off);
    } else {
      camera.position.copy(tmpV).add(off);
      focusPrev.copy(tmpV);
      controls.target.copy(focusTarget(tmpV));
    }
  }

  featuresStep(dt, sdt);
  controls.update();
  cosmicStep(dt);
  renderer.render(scene, camera);
}

/* --------------------------------------------------------------------------
   24. FASLLAR SIMULYATSIYASI — nega yozda issiq, qishda sovuq?
   O'Q FAZODA QOTIB TURADI (eng muhim fizika sharti):
   Yer guruhining WORLD pozitsiyasi orbita formulasi bilan TO'G'RIDAN-TO'G'RI
   o'rnatiladi (x=R·cosθ, z=R·sinθ) — pivot-aylantirish usuli ATAYIN ishlatilmaydi,
   chunki pivot bilan birga og'ish o'qi ham burilib ketardi. Og'ish — guruhning
   O'ZGARMAS rotation.z=23.5° bo'lib, u θ ga HECH QACHON bog'lanmaydi.
   Sutkalik aylanish — guruh ICHIDAGI meshning lokal Y aylanishi (og'gan o'q atrofida).
   Vizual tekshiruv: rotation.z=+23.5° da o'qning gorizontal komponenti doim -X;
   iyunda Yer +X da (Quyosh -X tomonda) → Shimoliy qutb Quyoshga ENGASHGAN,
   dekabrda Yer -X da → qutb Quyoshdan TESKARI. O'q tayoqchasi doim parallel qoladi.
   -------------------------------------------------------------------------- */
var seasonsActive=false;
let snScene=null,snCamera=null,snControls=null,snEarthGrp=null,snEarthMesh=null,snCloudsM=null;
let snRayGeo=null,snTipGeo=null,snRayMat=null,snRayMat2=null,snLatLine=null,snMarkerObjs=[],snAxisTip=null;
let snDayVal=171,snLat=41,snPlaying=false,snToastShown=false,snPolarState=0;
let snDayFly=null,snCamFly=null,snInsetKey='';
const SN_R=95, SN_ER=12, SN_TILT=23.5*Math.PI/180, SN_E=0.0167;
const SN_DATES=[79,171,265,354];   // 21-mart, 21-iyun, 23-sentyabr, 21-dekabr (kun indekslari)
const SN_LATS=[41,0,66.56,-34];    // Toshkent, Ekvator, Qutb doirasi, Sidney
const SN_MDAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
const snViewEl=document.getElementById('seasonsView');
const snMarkersEl=document.getElementById('snMarkers');
const snAxisLblEl=document.getElementById('snAxisLabel');
const snPolarEl=document.getElementById('snPolarLabel');
const snToastEl=document.getElementById('snToast');
const snDayEl=document.getElementById('snDay');
const snInsetEl=document.getElementById('snInset');
const snInsetCv=document.getElementById('snInsetCanvas');
const snT=()=>window.LOC[LANG].seasons||window.LOC.uz.seasons;
// --- Formulalar (darslik formulalari, jadval emas) ---
// Quyosh og'ishi: δ = −23.44°·cos(360°/365·(N+10))
function snDecl(N){ return -23.44*Math.cos(2*Math.PI*(N+10)/365.25); }
// Kun uzunligi: T = (2/15°)·arccos(−tanφ·tanδ) soat; |x|≥1 → qutb kuni/tuni
function snDayLen(latDeg,declDeg){
  const x=-Math.tan(latDeg*Math.PI/180)*Math.tan(declDeg*Math.PI/180);
  if(x<=-1) return 24; if(x>=1) return 0;
  return Math.acos(x)*180/Math.PI*2/15;
}
// Yer–Quyosh masofasi (mln km): perigeliy 3-yanvar (N≈2) — 147.1, afeliy 4-iyul — 152.1
function snDistMln(N){ return 149.6*(1-SN_E*Math.cos(2*Math.PI*(N-2)/365.25)); }
function snTheta(N){ return 2*Math.PI*(N-171)/365.25; }   // θ=0 → 21-iyun (+X)
function snPos(N,out){ const th=snTheta(N), rr=SN_R*snDistMln(N)/149.6;
  return (out||new THREE.Vector3()).set(rr*Math.cos(th),0,rr*Math.sin(th)); }
function snSeasonIdx(N){ if(N>=79&&N<171)return 1; if(N>=171&&N<265)return 2; if(N>=265&&N<354)return 3; return 0; }
function snFmtDate(N){ const t=snT(); let n=Math.floor(N)%365, m=0;
  while(n>=SN_MDAYS[m]){ n-=SN_MDAYS[m]; m++; }
  const d=n+1, mn=t.monthsFull[m];
  return t.fmt==='MD' ? mn+' '+d : d+(t.fmt==='D-M'?'-':' ')+mn; }
// Nazorat qiymatlari: Toshkentda 21-iyun ≈ 15 s, 21-dekabr ≈ 9 s, tengkunlik ≈ 12 s, qutb doirasida iyun = 24 s
console.assert(Math.abs(snDayLen(41,snDecl(171))-15.0)<0.6,'fasllar: iyun kun uzunligi',snDayLen(41,snDecl(171)));
console.assert(Math.abs(snDayLen(41,snDecl(354))-9.1)<0.6,'fasllar: dekabr kun uzunligi',snDayLen(41,snDecl(354)));
console.assert(Math.abs(snDayLen(41,snDecl(79))-12)<0.5,'fasllar: tengkunlik',snDayLen(41,snDecl(79)));
console.assert(snDayLen(66.56,snDecl(171))>23.5,'fasllar: qutb kuni',snDayLen(66.56,snDecl(171)));
// Kun/tun shaderi — asosiy sahnadagi Yer shaderining AYNAN o'zi (sunDir har kadr yangilanadi)
function snEarthMaterial(){
  return new THREE.ShaderMaterial({
    uniforms:{ dayTex:{value:RT_ON?(window.__REALTEX.earth||flatTexture('#24507a')):earthDayTexture()},
      nightTex:{value:RT_ON?(window.__REALTEX.earthNight||flatTexture('#000000')):earthNightTexture()},
      sunDir:{value:new THREE.Vector3(1,0,0)} },
    vertexShader:'varying vec2 vUv; varying vec3 vN;\n'+
      'void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal);\n'+
      '  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:'uniform sampler2D dayTex; uniform sampler2D nightTex; uniform vec3 sunDir;\n'+
      'varying vec2 vUv; varying vec3 vN;\n'+
      'void main(){ float d=dot(normalize(vN), normalize(sunDir));\n'+
      '  float mixf=smoothstep(-0.12,0.28,d);\n'+
      '  vec3 day=texture2D(dayTex,vUv).rgb; vec3 night=texture2D(nightTex,vUv).rgb*1.4;\n'+
      '  gl_FragColor=vec4(mix(night,day,mixf),1.0); }'
  });
}
function snCircle(rad,y,color,op){
  const pts=[]; for(let i=0;i<96;i++){ const a=i/96*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*rad,y,Math.sin(a)*rad)); }
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({color:color,transparent:true,opacity:op}));
}
function snInit(){
  if(snCamera) return;
  snCamera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1500);
  snControls=new THREE.OrbitControls(snCamera,renderer.domElement);
  snControls.enableDamping=true; snControls.dampingFactor=0.07; snControls.enablePan=false;
  snControls.minDistance=40; snControls.maxDistance=460; snControls.enabled=false;
}
function snBuild(){
  snScene=new THREE.Scene(); snScene.background=new THREE.Color(0x05060f);
  const n=350,pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){ const u=Math.random(),v=Math.random(),th=2*Math.PI*u,ph=Math.acos(2*v-1),r=700;
    pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pos[i*3+2]=r*Math.cos(ph); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  snScene.add(new THREE.Points(sg,new THREE.PointsMaterial({size:2.2,map:SPRITE,color:0x8899cc,
    transparent:true,opacity:0.5,depthWrite:false,blending:THREE.AdditiveBlending})));
  // Quyosh (markazda, kichikroq — sahna Yerga bag'ishlangan)
  const sunM=new THREE.Mesh(new THREE.SphereGeometry(9,32,32),
    new THREE.MeshBasicMaterial({map:rockyTexture('#ff9e1b',['#ffd54f','#ff6d00','#ffcf6a'],0)}));
  const glow1=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color:0xffe9a3,
    transparent:true,opacity:0.95,blending:THREE.AdditiveBlending,depthWrite:false}));
  glow1.scale.set(34,34,1);
  const glow2=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color:0xff8f3a,
    transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}));
  glow2.scale.set(70,70,1);
  snScene.add(sunM,glow1,glow2);
  // Elliptik orbita chizig'i — masofa formulasi bilan (sezilar-sezilmas elliptik, haqiqatga mos)
  const opts=[]; for(let i=0;i<=180;i++) opts.push(snPos(i/180*365));
  snScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(opts),
    new THREE.LineBasicMaterial({color:0x4ea8ff,transparent:true,opacity:0.35})));
  // 4 muhim sana markeri (bir marta yaratiladi, qayta ishlatiladi)
  snMarkerObjs=[]; snMarkersEl.innerHTML='';
  const mcol=[0x7fe0a8,0xffd54f,0xffb47a,0x9fc4ff];
  SN_DATES.forEach((dN,i)=>{
    const m=new THREE.Mesh(new THREE.SphereGeometry(1.4,12,12),new THREE.MeshBasicMaterial({color:mcol[i]}));
    m.position.copy(snPos(dN)); snScene.add(m);
    const el=document.createElement('div'); el.className='sn-marker';
    el.addEventListener('click',()=>{ playClick(700); snFlyToDay(dN); });
    snMarkersEl.appendChild(el);
    snMarkerObjs.push({mesh:m,el:el,day:dN});
  });
  // Yer guruhi: og'ish O'ZGARMAS — θ ga bog'lanmaydi!
  snEarthGrp=new THREE.Group();
  snEarthGrp.rotation.z=SN_TILT;               // ← o'q fazoda qotib turadi
  snEarthMesh=new THREE.Mesh(new THREE.SphereGeometry(SN_ER,48,48),snEarthMaterial());
  snCloudsM=new THREE.Mesh(new THREE.SphereGeometry(SN_ER*1.02,48,48),
    new THREE.MeshBasicMaterial({map:RT_ON?null:cloudTexture(),transparent:true,opacity:RT_ON?0:0.4,depthWrite:false}));
  // Haqiqiy teksturalar (NASA asosida): Quyosh fotosferasi, Yer kunduz/tun xaritasi va bulutlar
  if(window.REALTEX && window.REALTEX.ok){
    const RT=window.REALTEX, em=snEarthMesh.material;
    RT.texture('sun').then(t=>{ sunM.material.map=t; sunM.material.color.setScalar(1.15); sunM.material.needsUpdate=true; }).catch(()=>{});
    RT.texture('earth').then(t=>{ em.uniforms.dayTex.value=t; }).catch(()=>{ em.uniforms.dayTex.value=earthDayTexture(); });   // zaxira: protsedural
    RT.texture('earthNight').then(t=>{ em.uniforms.nightTex.value=t; }).catch(()=>{ em.uniforms.nightTex.value=earthNightTexture(); });
    RT.clouds(snCloudsM, { opacity:0.5 });
  }
  // O'q tayoqchasi — doim bir tomonga (Qutb yulduziga) parallel qolishi ko'rinadi
  const axG=new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0,-SN_ER*1.45,0), new THREE.Vector3(0,SN_ER*1.8,0)]);
  const axis=new THREE.Line(axG,new THREE.LineBasicMaterial({color:0xffd54f,transparent:true,opacity:0.9}));
  snAxisTip=new THREE.Object3D(); snAxisTip.position.set(0,SN_ER*1.95,0);
  const eq=snCircle(SN_ER*1.012,0,0x4ea8ff,0.85);   // ekvator
  const atm=new THREE.Mesh(new THREE.SphereGeometry(SN_ER*1.07,48,48),
    new THREE.MeshBasicMaterial({color:0x4ea8ff,transparent:true,opacity:0.14,side:THREE.BackSide,
      blending:THREE.AdditiveBlending,depthWrite:false}));
  snEarthGrp.add(snEarthMesh,snCloudsM,atm,axis,snAxisTip,eq);
  snScene.add(snEarthGrp);
  snSetLat(snLat,true);
  // Nur dastasi: 7 parallel chiziq (bir marta yaratiladi, pozitsiyasi har kadr yangilanadi)
  snRayGeo=new THREE.BufferGeometry();
  snRayGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(5*2*3),3));
  snRayMat=new THREE.LineBasicMaterial({color:0xfff3c4,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending});
  snRayMat2=new THREE.LineBasicMaterial({color:0xffb347,transparent:true,opacity:0.45,blending:THREE.AdditiveBlending});
  snScene.add(new THREE.LineSegments(snRayGeo,snRayMat), new THREE.LineSegments(snRayGeo,snRayMat2));
  snTipGeo=new THREE.BufferGeometry();
  snTipGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(5*3),3));
  snScene.add(new THREE.Points(snTipGeo,new THREE.PointsMaterial({size:4.5,map:SPRITE,color:0xffe08a,
    transparent:true,opacity:0.95,depthWrite:false,blending:THREE.AdditiveBlending})));
}
function snSetLat(lat,silent){
  snLat=lat; snInsetKey='';
  if(snLatLine){ snLatLine.geometry.dispose(); snLatLine.material.dispose(); snEarthGrp.remove(snLatLine); }
  const phi=lat*Math.PI/180;   // tanlangan kenglik chizig'i globus ustida
  snLatLine=snCircle(SN_ER*1.012*Math.cos(phi), SN_ER*1.012*Math.sin(phi), 0xffd54f, 1);
  snEarthGrp.add(snLatLine);
  const lsel=document.getElementById('snLats');
  if(lsel&&lsel.tagName==='SELECT') lsel.value=String(SN_LATS.indexOf(lat));
  if(!silent) playClick(680);
}
function snFlyToDay(target){
  let from=snDayVal, to=target;   // eng qisqa yo'ldan uchish (yil chegarasi orqali ham)
  if(to-from>182.5) from+=365; else if(from-to>182.5) to+=365;
  snDayFly={from:from,to:to,t:0,dur:1.4}; snPlaying=false; snSyncPlayBtn();
}
function snSyncPlayBtn(){ const b=document.getElementById('snPlay'); if(b) b.textContent=snPlaying?'⏸':'▶'; }
function snBuildUI(){
  const t=snT();
  document.getElementById('snTitle').textContent=t.title;
  const sb=document.getElementById('seasonsBtn'); if(sb) sb.title=t.btn;
  document.getElementById('snDateK').textContent=t.kDate;
  document.getElementById('snSeasonK').textContent=t.kSeason;
  document.getElementById('snDayLenK').textContent=t.kDay;
  document.getElementById('snAltK').textContent=t.kAlt;
  document.getElementById('snDistK').textContent=t.kDist;
  document.getElementById('snInsetTitle').textContent='☀ '+t.insetTitle;
  snAxisLblEl.textContent=t.axis;
  const mrow=document.getElementById('snMonths');
  if(mrow){ mrow.innerHTML=''; t.months.forEach(mn=>{ const s=document.createElement('span'); s.textContent=mn; mrow.appendChild(s); }); }
  // Tengkunlik/quyoshturishlar — bitta ochiladigan ro'yxat
  const dr=document.getElementById('snDates'); dr.innerHTML='';
  const ph=document.createElement('option'); ph.value='-1'; ph.textContent='📅 '+(t.datesLbl||'Muhim sanalar'); dr.appendChild(ph);
  t.dates.forEach((lb,i)=>{ const o=document.createElement('option'); o.value=String(i); o.textContent=lb; dr.appendChild(o); });
  dr.onchange=()=>{ const i=+dr.value; if(i>=0){ playClick(700); snFlyToDay(SN_DATES[i]); } dr.value='-1'; };
  // Shaharlar (kengliklar) — bitta ochiladigan ro'yxat
  const lr=document.getElementById('snLats'); lr.innerHTML='';
  t.lats.forEach((lb,i)=>{ const o=document.createElement('option'); o.value=String(i); o.textContent=lb; lr.appendChild(o); });
  lr.value=String(SN_LATS.indexOf(snLat));
  lr.onchange=()=>snSetLat(SN_LATS[+lr.value]);
  snMarkerObjs.forEach((mo,i)=>{ mo.el.textContent=t.dates[i]; });
  snInsetKey='';
}
function snUpdateHUD(N){
  const t=snT(), decl=snDecl(N), T=snDayLen(snLat,decl);
  document.getElementById('snDateV').textContent=snFmtDate(N);
  const si=snSeasonIdx(Math.floor(N)%365);
  document.getElementById('snSeasonV').textContent=t.seasonNames[si];
  document.getElementById('snSouth').textContent=t.southNote+t.seasonNames[(si+2)%4];
  const hh=Math.floor(T), mm=Math.round((T-hh)*60);
  document.getElementById('snDayLenV').textContent=hh+' '+t.hourS+' '+String(mm).padStart(2,'0')+' '+t.minS;
  let alt=90-Math.abs(snLat-decl); if(alt<0)alt=0;   // tushlik balandligi: h = 90° − |φ − δ|
  document.getElementById('snAltV').textContent=alt.toFixed(1)+'°';
  const wEl=document.getElementById('snWhy');
  if(wEl) wEl.textContent='💡 '+(Math.sin(alt*Math.PI/180)>0.62?t.insetDense:t.insetSparse);
  document.getElementById('snDistV').textContent=snDistMln(N).toFixed(1)+' '+t.distU;
  // Inset faqat qiymat o'zgarganda qayta chiziladi (performance)
  const key=Math.round(N)+'|'+snLat+'|'+LANG;
  if(key!==snInsetKey){ snInsetKey=key; snDrawInset(alt); }
  // "Yaqinlik emas!" toasti — perigeliy (3-yanvar) atrofida bir marta
  if(!snToastShown && Math.abs(((N%365)+365)%365-2)<2){
    snToastShown=true; snToastEl.textContent=t.toast; snToastEl.classList.add('on');
    setTimeout(()=>snToastEl.classList.remove('on'),7000);
  }
  // Qutb kuni/tuni bonus-rakursi: 66.5°N + quyoshturish → kamera qutb ustiga
  const nearJun=Math.abs(N-171)<3, nearDec=Math.abs(N-354)<3;
  if(snLat>60 && (nearJun||nearDec)){
    const st=nearJun?1:2;
    if(snPolarState!==st){
      snPolarState=st;
      snPolarEl.textContent=nearJun?t.polarDay:t.polarNight; snPolarEl.classList.add('on');
      const axW=new THREE.Vector3(0,1,0).applyQuaternion(snEarthGrp.quaternion);
      const toP=snEarthGrp.position.clone().addScaledVector(axW,52).add(new THREE.Vector3(0,6,0));
      snCamFly={fromP:snCamera.position.clone(),fromT:snControls.target.clone(),
        toP:toP,toT:snEarthGrp.position.clone(),t:0,dur:1.6};
    }
  } else if(snPolarState){ snPolarState=0; snPolarEl.classList.remove('on'); }
}
// Inset: bir xil nur dastasi yozda KICHIK, qishda KATTA maydonga yoyiladi
function snDrawInset(alt){
  const t=snT(), ctx=snInsetCv.getContext('2d'), W=snInsetCv.width, H=snInsetCv.height;
  ctx.clearRect(0,0,W,H);
  const gy=H-26, h=Math.max(3,alt)*Math.PI/180;
  ctx.strokeStyle='#5a4a3a'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(8,gy); ctx.lineTo(W-8,gy); ctx.stroke();
  const Wb=42, L=Math.min(W-40, Wb/Math.sin(h));
  const x0=W*0.52-L/2, dense=Math.sin(h);
  const c=dense>0.62?'255,140,40':'255,200,90';
  const grad=ctx.createLinearGradient(x0,0,x0+L,0);
  grad.addColorStop(0,'rgba('+c+','+(0.25+dense*0.7)+')');
  grad.addColorStop(1,'rgba('+c+','+(0.15+dense*0.5)+')');
  ctx.fillStyle=grad; ctx.fillRect(x0,gy-5,L,5);
  ctx.strokeStyle='rgba(255,224,138,0.85)'; ctx.lineWidth=1.5;
  const len=Math.min(W*0.75,(gy-14)/Math.sin(h));
  for(let k=0;k<5;k++){
    const gx=x0+L*(k+0.5)/5;
    ctx.beginPath(); ctx.moveTo(gx-Math.cos(h)*len, gy-Math.sin(h)*len); ctx.lineTo(gx,gy); ctx.stroke();
  }
  const sx=x0+L*0.1-Math.cos(h)*len, sy=gy-Math.sin(h)*len;
  ctx.fillStyle='#ffd54f'; ctx.beginPath(); ctx.arc(Math.max(14,sx),Math.max(14,sy),7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e8edff'; ctx.font='bold 12px sans-serif';
  ctx.fillText(alt.toFixed(0)+'°', Math.min(W-30,x0+L+6), gy-8);
  ctx.fillStyle='#9aa6cc'; ctx.font='10px sans-serif';
  ctx.fillText(dense>0.62?t.insetDense:t.insetSparse, 10, H-8);
}
function snUpdate(dt){
  if(snDayFly){ snDayFly.t+=dt/snDayFly.dur; const k=easeInOut(Math.min(1,snDayFly.t));
    snDayVal=((snDayFly.from+(snDayFly.to-snDayFly.from)*k)%365+365)%365;
    snDayEl.value=snDayVal; if(snDayFly.t>=1) snDayFly=null; }
  else if(snPlaying){ snDayVal=(snDayVal+dt*365.25/24)%365; snDayEl.value=snDayVal; }  // 1 yil ≈ 24 s
  snEarthMesh.rotation.y+=dt*(snPlaying?2.6:0.35);   // sutkalik aylanish — og'gan o'q atrofida
  snCloudsM.rotation.y+=dt*0.05;
  const N=snDayVal;
  snPos(N,snEarthGrp.position);   // WORLD pozitsiya to'g'ridan-to'g'ri — o'q qotib qoladi
  const dirS=snEarthGrp.position.clone().negate().normalize();
  snEarthMesh.material.uniforms.sunDir.value.copy(dirS);
  // Nur dastasi: Quyoshdan Yerga 7 parallel chiziq (vertikal yoyilgan)
  const u=dirS.clone().negate();   // Quyosh→Yer yo'nalishi
  const dist=snEarthGrp.position.length();
  const pp=snRayGeo.attributes.position.array, tp=snTipGeo.attributes.position.array;
  for(let k=0;k<5;k++){
    const off=(k-2)*SN_ER*0.42;   // dasta kengligi ≈ Yer diametri
    const reach=dist-Math.sqrt(Math.max(1,SN_ER*SN_ER-off*off));   // yuzagacha
    const a=u.clone().multiplyScalar(11); a.y+=off;
    const b=u.clone().multiplyScalar(reach); b.y+=off;
    pp[k*6]=a.x; pp[k*6+1]=a.y; pp[k*6+2]=a.z;
    pp[k*6+3]=b.x; pp[k*6+4]=b.y; pp[k*6+5]=b.z;
    tp[k*3]=b.x; tp[k*3+1]=b.y; tp[k*3+2]=b.z;   // "tegish" uchquni
  }
  snRayGeo.attributes.position.needsUpdate=true;
  snTipGeo.attributes.position.needsUpdate=true;
  if(snRayMat){ snRayMat.opacity=0.75+Math.sin(clock.elapsedTime*3.2)*0.25;
    snRayMat2.opacity=0.35+Math.sin(clock.elapsedTime*2.1+1.3)*0.2; }
  snUpdateHUD(N);
  if(snCamFly){ snCamFly.t+=dt/snCamFly.dur; const k=easeInOut(Math.min(1,snCamFly.t));
    snCamera.position.lerpVectors(snCamFly.fromP,snCamFly.toP,k);
    snControls.target.lerpVectors(snCamFly.fromT,snCamFly.toT,k);
    if(snCamFly.t>=1) snCamFly=null; }
  snControls.update();
  renderer.render(snScene,snCamera);
  // marker va o'q yorliqlari proyeksiyasi
  const w=window.innerWidth,hg=window.innerHeight;
  snMarkerObjs.forEach(mo=>{
    // yorliq markazdan qochish yo'nalishida, orbita tashqarisida turadi
    const pOut=mo.mesh.position.clone().multiplyScalar(1.28);
    const v=pOut.project(snCamera);
    const vis=v.z<1;
    mo.el.style.display=vis?'block':'none';
    if(vis){ mo.el.style.left=(v.x*0.5+0.5)*w+'px'; mo.el.style.top=(-v.y*0.5+0.5)*hg+'px'; }
    mo.el.classList.toggle('active',Math.abs(snDayVal-mo.day)<2);
    // Yer yaqinlashsa yorliq xiralashadi — globusni bosmaydi
    const near=snEarthGrp.position.distanceTo(mo.mesh.position)<SN_ER*2.5;
    mo.el.style.opacity=near?0.25:1;
  });
  const tip=new THREE.Vector3(); snAxisTip.getWorldPosition(tip); tip.project(snCamera);
  snAxisLblEl.style.display=tip.z<1?'block':'none';
  snAxisLblEl.style.left=Math.min(w-90,Math.max(90,(tip.x*0.5+0.5)*w))+'px';   // ekrandan chiqmaydi
  snAxisLblEl.style.top=Math.max(30,(-tip.y*0.5+0.5)*hg)+'px';
}
function openSeasons(){
  if(seasonsActive) return;
  if(typeof cutActive!=='undefined' && cutActive) closeCut();
  snInit(); snBuild(); snBuildUI();
  seasonsActive=true; snPlaying=false; snToastShown=false; snPolarState=0; snCamFly=null; snDayFly=null;
  snSyncPlayBtn();
  document.body.classList.add('seasonsmode');
  snViewEl.classList.add('on');
  document.getElementById('seasonsBtn').classList.add('active');
  closePanel();
  controls.enabled=false; snControls.enabled=true;
  snCamera.aspect=window.innerWidth/window.innerHeight; snCamera.updateProjectionMatrix();
  snCamera.position.set(0,150,230); snControls.target.set(0,18,0);
  playClick(760);
}
function closeSeasons(){
  if(!seasonsActive) return;
  seasonsActive=false;
  document.body.classList.remove('seasonsmode');
  snViewEl.classList.remove('on'); snToastEl.classList.remove('on'); snPolarEl.classList.remove('on');
  document.getElementById('seasonsBtn').classList.remove('active');
  // barcha resurslarni tozalash (geometriya, material, teksturalar, shader uniformlari)
  if(snScene){ snScene.traverse(o=>{ if(o.geometry)o.geometry.dispose();
    if(o.material){ disposeOwnedTex(o.material.map); disposeOwnedTex(o.material.alphaMap);
      if(o.material.uniforms){ Object.values(o.material.uniforms).forEach(u2=>{ if(u2.value&&u2.value.isTexture) disposeOwnedTex(u2.value); }); }
      o.material.dispose(); } });
    snScene=null; }
  snLatLine=null; snMarkerObjs=[]; snMarkersEl.innerHTML='';
  snControls.enabled=false; controls.enabled=true;
  playClick(440);
}
document.getElementById('seasonsBtn').addEventListener('click',()=>{ seasonsActive?closeSeasons():openSeasons(); });
document.getElementById('snClose').addEventListener('click',()=>closeSeasons());
window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&seasonsActive) closeSeasons(); });
snDayEl.addEventListener('input',e=>{ snDayVal=+e.target.value; snDayFly=null; });
document.getElementById('snPlay').addEventListener('click',()=>{ playClick(640); snPlaying=!snPlaying; snDayFly=null; snSyncPlayBtn(); });
document.getElementById('snInsetTitle').addEventListener('click',()=>snInsetEl.classList.toggle('open'));
window.addEventListener('resize',()=>{ if(snCamera){ snCamera.aspect=window.innerWidth/window.innerHeight; snCamera.updateProjectionMatrix(); } });

/* --------------------------------------------------------------------------
   25. ULUG'BEK RASADXONASI — tarix, interaktiv Faxriy sekstanti, o'lchovlar
   Sekstant geometriyasi: kesim yon tomondan. Yoy markazi = tuynuk (diafragma).
   Quyosh nuri tuynukdan tushlik balandligi h burchak ostida kiradi va yoyga
   zenit masofasi z=90°−h belgisida yorug' dog' tashlaydi. Yoy shkalasi
   vertikaldan (zenitdan) boshlab graduslanadi, δ(N) — snDecl() dan olinadi.
   -------------------------------------------------------------------------- */
var ubActive=false;
let ubDay=171, ubTab=0, ubTry=null, ubDPR=1;
const UB_LAT=39.67;   // Samarqand kengligi
const ubT=()=>window.LOC[LANG].ulugbek||window.LOC.uz.ulugbek;
function ubZ(N){ return Math.abs(UB_LAT-snDecl(N)); }   // z = 90−h = |φ−δ|
// Nazorat: 21-iyun z≈16.2°, tengkunlik z≈39.7°, 21-dekabr z≈63.1°
console.assert(ubZ(171)>15.5&&ubZ(171)<17,'ulugbek: iyun z',ubZ(171));
console.assert(ubZ(81)>39.2&&ubZ(81)<40.2,'ulugbek: tengkunlik z',ubZ(81));   // snDecl formulasida tengkunlik ~81-kun (20-mart)
console.assert(ubZ(354)>62.5&&ubZ(354)<63.7,'ulugbek: dekabr z',ubZ(354));
function ubFmtDate(N){ const t=window.LOC[LANG].seasons; let n=Math.floor(N)%365,m=0;
  while(n>=SN_MDAYS[m]){n-=SN_MDAYS[m];m++;}
  const d=n+1,mn=t.monthsFull[m];
  return t.fmt==='MD'?mn+' '+d:d+(t.fmt==='D-M'?'-':' ')+mn; }
// --- Canvas chizma: faqat qiymat o'zgarganda chaqiriladi (har frame emas) ---
function ubDraw(){
  const cv=document.getElementById('ubCanvas'), t=ubT();
  const cssW=cv.clientWidth, cssH=Math.max(240,Math.round(cssW*0.62));
  ubDPR=Math.min(2,window.devicePixelRatio||1);
  if(cv.width!==cssW*ubDPR){ cv.width=cssW*ubDPR; cv.height=cssH*ubDPR; }
  cv.style.height=cssH+'px';
  const x=cv.getContext('2d'); x.setTransform(ubDPR,0,0,ubDPR,0,0);
  x.clearRect(0,0,cssW,cssH);
  // Geometriya: tuynuk (yoy markazi) chap-yuqorida, yoy pastga-o'ngga tushadi
  const cx=cssW*0.30, cy=cssH*0.18, R=Math.min(cssW*0.62,cssH*0.92);
  const gy=cssH*0.42;   // yer sathi
  // xandaq (yer osti) foni
  x.fillStyle='rgba(30,24,14,0.5)'; x.fillRect(0,gy,cssW,cssH-gy);
  x.strokeStyle='rgba(140,170,255,.5)'; x.lineWidth=1.2;
  x.beginPath(); x.moveTo(0,gy); x.lineTo(cssW,gy); x.stroke();
  x.fillStyle='#9aa6cc'; x.font='10px sans-serif';
  x.fillText(t.ground, 6, gy-6);
  // Yoy: zenit (pastga vertikal) dan boshlab z graduslanadi.
  // Ekranda burchak: pastga = +90°(PI/2). z belgisi = PI/2 - z (janub tomonga og'adi)
  const a0=Math.PI/2-72*Math.PI/180, a1=Math.PI/2;  // 0..72° oralig'i ko'rsatiladi
  x.beginPath(); x.arc(cx,cy,R,a0,a1);
  x.strokeStyle='rgba(255,213,79,.28)'; x.lineWidth=9; x.stroke();
  x.beginPath(); x.arc(cx,cy,R,a0,a1);
  x.strokeStyle='#ffd54f'; x.lineWidth=1.6; x.stroke();
  // Shkala: har 1° mayda, har 10° yirik + raqam
  for(let d=0;d<=72;d++){
    const a=Math.PI/2-d*Math.PI/180, big=d%10===0;
    const r1=R-(big?12:6), r2=R+(big?4:2);
    x.beginPath();
    x.moveTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
    x.lineTo(cx+Math.cos(a)*r2, cy+Math.sin(a)*r2);
    x.strokeStyle=big?'#e8edff':'rgba(232,237,255,.4)'; x.lineWidth=big?1.4:0.7; x.stroke();
    if(big){ x.fillStyle='#9aa6cc'; x.font='10px sans-serif';
      x.fillText(d+'°', cx+Math.cos(a)*(R-26)-6, cy+Math.sin(a)*(R-26)+4); }
  }
  x.fillStyle='#9aa6cc'; x.font='10px sans-serif';
  const aMid=Math.PI/2-36*Math.PI/180;
  x.fillText(t.arcLbl, cx+Math.cos(aMid)*(R+14), cy+Math.sin(aMid)*(R+14));
  // Tuynuk (diafragma)
  x.fillStyle='#fff3c4'; x.beginPath(); x.arc(cx,cy,4,0,Math.PI*2); x.fill();
  x.strokeStyle='rgba(255,243,196,.5)'; x.lineWidth=1;
  x.strokeRect(cx-9,cy-14,18,10);
  x.fillStyle='#9aa6cc'; x.fillText(t.slit, cx+13, cy-4);
  // Nur: tuynukdan z burchak ostida (zenitdan og'ish) yoyga tushadi
  const z=ubZ(ubDay), az=Math.PI/2-z*Math.PI/180;
  const sx=cx+Math.cos(az)*R, sy=cy+Math.sin(az)*R;
  // yarim shaffof sariq tasma
  const g=x.createLinearGradient(cx,cy,sx,sy);
  g.addColorStop(0,'rgba(255,224,138,.85)'); g.addColorStop(1,'rgba(255,224,138,.35)');
  x.strokeStyle=g; x.lineWidth=5; x.lineCap='round';
  x.beginPath(); x.moveTo(cx,cy); x.lineTo(sx,sy); x.stroke();
  // yorug' dog'
  const rg=x.createRadialGradient(sx,sy,0,sx,sy,13);
  rg.addColorStop(0,'rgba(255,243,196,.95)'); rg.addColorStop(1,'rgba(255,158,27,0)');
  x.fillStyle=rg; x.beginPath(); x.arc(sx,sy,13,0,Math.PI*2); x.fill();
  x.fillStyle='#ff9e1b'; x.beginPath(); x.arc(sx,sy,3.4,0,Math.PI*2); x.fill();
  // dog' yonida z qiymati
  x.fillStyle='#fff3c4'; x.font='bold 13px sans-serif';
  x.fillText(z.toFixed(1)+'°', sx+10, sy+4);
}
function ubUpdateHud(){
  const t=ubT(), z=ubZ(ubDay), h=90-z;
  document.getElementById('ubDateV').textContent=ubFmtDate(ubDay);
  document.getElementById('ubHV').textContent=h.toFixed(1)+'°';
  document.getElementById('ubZV').textContent=z.toFixed(1)+'°';
  document.getElementById('ubRead').textContent=t.hudRead+': '+z.toFixed(1)+'°';
  document.getElementById('ubAha').classList.toggle('on', Math.abs(ubDay-79)<3||Math.abs(ubDay-265)<3);
  ubDraw();
}
function ubBuildUI(){
  const t=ubT();
  document.getElementById('ubTitle').textContent=t.title;
  const ub=document.getElementById('ubBtn'); if(ub) ub.title=t.btn;
  // tablar
  const tb=document.getElementById('ubTabs'); tb.innerHTML='';
  t.tabs.forEach((nm,i)=>{ const b=document.createElement('button');
    b.className='ub-tab'+(i===ubTab?' active':''); b.textContent=nm;
    b.addEventListener('click',()=>{ playClick(620); ubTab=i; ubBuildUI(); }); tb.appendChild(b); });
  ['ubHist','ubSext','ubMeas'].forEach((id,i)=>document.getElementById(id).classList.toggle('on',i===ubTab));
  // tarix
  const ht=document.getElementById('ubHistText'); ht.innerHTML='';
  t.history.forEach(p=>{ const el=document.createElement('p'); el.textContent=p; ht.appendChild(el); });
  // sekstant HUD
  document.getElementById('ubDateK').textContent=t.hudDate;
  document.getElementById('ubHK').textContent=t.hudH;
  document.getElementById('ubZK').textContent=t.hudZ;
  document.getElementById('ubAha').textContent=t.ahaLat;
  document.getElementById('ubYearNote').textContent='📏 '+t.yearNote;
  const db=document.getElementById('ubDateBtns'); db.innerHTML='';
  [171,79,354].forEach((dN,i)=>{ const b=document.createElement('button'); b.className='sn-chip';
    b.textContent=t.dates[i===0?0:(i===1?1:2)];
    b.addEventListener('click',()=>{ playClick(700); ubDay=dN;
      document.getElementById('ubDaySl').value=dN; ubUpdateHud(); }); db.appendChild(b); });
  // topshiriq
  document.getElementById('ubTryBtn').textContent='🎯 '+t.tryBtn;
  document.getElementById('ubTryQ').textContent='';
  document.getElementById('ubTryOpts').innerHTML='';
  document.getElementById('ubTryMsg').textContent='';
  ubTry=null;
  // jadval
  const tbl=document.getElementById('ubTable');
  let h2='<tr>'+t.tblHead.map(x2=>'<th>'+x2+'</th>').join('')+'</tr>';
  t.tblRows.forEach(r=>{ h2+='<tr><td>'+r[0]+'</td><td class="ub-uv">'+r[1]+'</td><td>'+r[2]+'</td></tr>'
    +'<tr class="ub-note-row"><td colspan="3">↳ '+r[3]+'</td></tr>'; });
  tbl.innerHTML=h2;
  document.getElementById('ubFoot').textContent='⏳ '+t.tblFoot;
  if(ubTab===1){ ubUpdateHud(); }
}
// --- "O'zingiz o'lchang" mini-seriyasi: 5 savol, faslni z dan topish ---
function ubStartTry(){
  const t=ubT();
  ubTry={n:0,score:0};
  ubNextTry();
}
function ubNextTry(){
  const t=ubT();
  if(ubTry.n>=5){
    document.getElementById('ubTryQ').textContent=t.tryDone+': '+ubTry.score+'/5';
    document.getElementById('ubTryOpts').innerHTML='';
    document.getElementById('ubTryMsg').textContent=ubTry.score>=4?'🏆':'';
    ubTry=null; return;
  }
  // tasodifiy kun — dog' o'sha kunga qo'yiladi
  const pool=[[354,20,0],[79,265,1],[171,150,2]];   // [kun1,kun2,fasl-indeksi]
  const pick=pool[Math.floor(Math.random()*3)];
  ubTry.day=pick[Math.random()<0.5?0:1]; ubTry.ans=pick[2];
  ubDay=ubTry.day; document.getElementById('ubDaySl').value=ubDay; ubUpdateHud();
  document.getElementById('ubTryQ').textContent=(ubTry.n+1)+'/5 · '+t.tryQ;
  const op=document.getElementById('ubTryOpts'); op.innerHTML='';
  t.trySeasons.forEach((nm,i)=>{ const b=document.createElement('button'); b.className='sn-chip';
    b.textContent=nm;
    b.addEventListener('click',()=>{
      if(!ubTry) return;
      const ok=i===ubTry.ans;
      document.getElementById('ubTryMsg').textContent=ok?('✅ '+t.tryOk):('❌ '+t.tryNo);
      playClick(ok?950:300);
      ubTry.score+=ok?1:0; ubTry.n++;
      setTimeout(()=>{ if(ubTry) ubNextTry(); },900);
    }); op.appendChild(b); });
  document.getElementById('ubTryMsg').textContent='';
}
function openUb(){
  if(ubActive) return;
  if(typeof seasonsActive!=='undefined'&&seasonsActive) closeSeasons();
  if(typeof cutActive!=='undefined'&&cutActive) closeCut();
  ubActive=true; ubTab=0;
  document.getElementById('ubView').classList.add('on');
  document.getElementById('ubBtn').classList.add('active');
  document.body.classList.add('ubmode');
  closePanel(); controls.enabled=false;
  ubBuildUI(); playClick(760);
}
function closeUb(){
  if(!ubActive) return;
  ubActive=false;
  document.getElementById('ubView').classList.remove('on');
  document.getElementById('ubBtn').classList.remove('active');
  document.body.classList.remove('ubmode');
  controls.enabled=true; playClick(440);
}
document.getElementById('ubBtn').addEventListener('click',()=>{ ubActive?closeUb():openUb(); });
document.getElementById('ubClose').addEventListener('click',()=>closeUb());
window.addEventListener('keydown',e=>{ if(e.key==='Escape'&&ubActive) closeUb(); });
document.getElementById('ubDaySl').addEventListener('input',e=>{ ubDay=+e.target.value; ubUpdateHud(); });
document.getElementById('ubTryBtn').addEventListener('click',()=>{ playClick(700); ubStartTry(); });
window.addEventListener('resize',()=>{ if(ubActive&&ubTab===1) ubDraw(); });


/* --------------------------------------------------------------------------
   26b. HAQIQIY TEKSTURALAR (NASA ma'lumotlari asosida — Solar System Scope, CC BY 4.0)
   Yuklash umumiy realtex.js modulida (barcha 3D sahnalar bilan bitta kesh). Sahna avval
   protsedural teksturalar bilan darhol ochiladi; so'ng 2K xaritalar fonda NAVBAT bilan
   almashtiriladi — har biri darhol GPU'ga yuklanadi va shader oldindan kompilyatsiya
   qilinadi, shuning uchun sayyora ko'rinishga kirganda qotish bo'lmaydi.
   file:// rejimida (serversiz) yoki ?notex bo'lsa protsedural teksturalar qoladi.
   -------------------------------------------------------------------------- */
window.__REALTEX = {};   // kesim ko'rinishi (cutSurfaceTexture) yuklanganlarini shu yerdan oladi
(function(){
  const RT=window.REALTEX;
  if(!RT || !RT.ok) return;
  const rec=k=>orbitObjects.find(o=>o.key===k);
  const disposeOld=(...ts)=>ts.forEach(t=>{ if(t && t.dispose) t.dispose(); });
  // Sahna yorug'ligi (PointLight 3.2) eski, to'qroq protsedural teksturalarga moslangan — haqiqiy suratlar
  // yorqinroq, shuning uchun rang koeffitsienti bilan pasaytiriladi (aks holda gaz gigantlari oqarib "kuyadi").
  const GAIN={ gas:0.4, rock:0.55 };
  function applyStd(mesh, tex, bump){
    if(!mesh) return;
    const m=mesh.material;
    disposeOld(m.map!==tex?m.map:null, m.normalMap);
    m.map=tex; m.normalMap=null; m.roughnessMap=null;
    m.bumpMap=bump?tex:null; m.bumpScale=bump||0;
    m.color.setScalar(bump?GAIN.rock:GAIN.gas); m.needsUpdate=true;
  }
  const JOBS=[
    ['earth',      t=>{ const m=rec('earth').mesh.material; m.uniforms.dayTex.value=t; m.uniforms.realMap.value=1; __REALTEX.earth=t; }],
    ['sun',        t=>{ sunMat.uniforms.sunTex.value=t; sunMat.uniforms.realMap.value=1; __REALTEX.sun=t; }],
    ['earthNight', t=>{ rec('earth').mesh.material.uniforms.nightTex.value=t; __REALTEX.earthNight=t; }],
    ['clouds',     t=>{ const c=rec('earth').extras.clouds; if(!c) return; const m=c.material;
        disposeOld(m.map); m.map=null; m.alphaMap=t; m.color.set(0xffffff); m.opacity=0.9; m.needsUpdate=true; __REALTEX.clouds=t; }],
    ['moon',       t=>{ const p=rec('earth').extras.moonPivot; applyStd(p&&p.children[0], t, 0.012); __REALTEX.moon=t; }],
    ['mars',       t=>{ applyStd(rec('mars').mesh, t, 0.02); __REALTEX.mars=t; }],
    ['jupiter',    t=>{ applyStd(rec('jupiter').mesh, t); __REALTEX.jupiter=t; }],
    ['saturn',     t=>{ applyStd(rec('saturn').mesh, t); __REALTEX.saturn=t; }],
    ['saturnRing', t=>{ const r=rec('saturn').extras.ring; if(!r) return; const m=r.material;
        disposeOld(m.map); m.map=t; m.opacity=1; m.needsUpdate=true; }],
    ['venus',      t=>{ applyStd(rec('venus').mesh, t); __REALTEX.venus=t; }],
    ['mercury',    t=>{ applyStd(rec('mercury').mesh, t, 0.02); __REALTEX.mercury=t; }],
    ['uranus',     t=>{ applyStd(rec('uranus').mesh, t); __REALTEX.uranus=t; }],
    ['neptune',    t=>{ applyStd(rec('neptune').mesh, t); __REALTEX.neptune=t; }],
    ['ceres',      t=>{ const b=EXTRA_BODIES.find(x=>x.key==='ceres'); applyStd(b&&b.mesh, t, 0.02); }],
  ];
  // Zaxira: fayl yuklanmasa — o'sha jism uchun avvalgi protsedural tekstura (RT_ON da oldindan yaratilmagan)
  const proc=(mesh,key,gas)=>{ if(mesh){ mesh.material=stdFromTex(cutSurfaceTexture(key), gas?{roughness:0.82,metalness:0}:{roughness:0.94,metalness:0.04}); } };
  const FALLBACK={
    earth(){ const u=rec('earth').mesh.material.uniforms, d=earthDayTexture();
      u.dayTex.value=d; u.normTex.value=d.userData.normalMap; u.roughTex.value=d.userData.roughnessMap; },
    earthNight(){ rec('earth').mesh.material.uniforms.nightTex.value=earthNightTexture(); },
    clouds(){ const c=rec('earth').extras.clouds; if(c){ c.material.map=cloudTexture(); c.material.opacity=0.55; c.material.needsUpdate=true; } },
    moon(){ const p=rec('earth').extras.moonPivot; if(p&&p.children[0]) p.children[0].material=stdFromTex(rockyTexture('#9a9a9a',['#6e6e6e','#b9b9b9','#8a8a8a'],130,768),{roughness:1,metalness:0}); },
    mercury(){ proc(rec('mercury').mesh,'mercury'); }, mars(){ proc(rec('mars').mesh,'mars'); },
    venus(){ proc(rec('venus').mesh,'venus',1); }, jupiter(){ proc(rec('jupiter').mesh,'jupiter',1); },
    saturn(){ proc(rec('saturn').mesh,'saturn',1); }, uranus(){ proc(rec('uranus').mesh,'uranus',1); },
    neptune(){ proc(rec('neptune').mesh,'neptune',1); },
    ceres(){ const b=EXTRA_BODIES.find(x=>x.key==='ceres'); if(b) b.mesh.material=stdFromTex(rockyTexture('#8f8578',['#7a7060','#a39885'],55),{roughness:0.96,metalness:0.03}); },
  };
  const pause=ms=>new Promise(r=>setTimeout(r,ms));
  async function run(){
    for(const [key, apply] of JOBS){
      try{
        const t=await RT.texture(key);
        renderer.initTexture(t);          // GPU'ga hozir yuklanadi — sayyora ko'rinishga kirganda emas
        apply(t);
        await pause(16);
        renderer.compile(scene, camera);  // o'zgargan materiallar shaderi oldindan tayyorlanadi
      }catch(e){ if(FALLBACK[key]) try{ FALLBACK[key](); }catch(_){} }
      await pause(120);
    }
  }
  // Yuklanish ekrani yopilgandan keyin boshlanadi — birinchi kadrlar bilan raqobat qilmaydi.
  const start=()=>setTimeout(run, 400);
  if(document.readyState==='complete') start(); else window.addEventListener('load', start, { once:true });
})();

/* --------------------------------------------------------------------------
   27. KIRISH / RO'YXATDAN O'TISH — server orqali (api.js → window.API).
   Server bo'lmasa (file:// yoki statik hosting) 👤 tugma ko'rinmaydi va sayt
   mehmon rejimida ishlayveradi. Kirgan foydalanuvchida darslik progressi,
   test natijalari va sozlamalar serverga sinxronlanadi.
   -------------------------------------------------------------------------- */
var authMode='in', authBusy=false;
function authT(){ return window.LOC[LANG].auth||window.LOC.uz.auth; }
const authEl=id=>document.getElementById(id);
function authBuildUI(){
  const t=authT(), u=window.API&&window.API.user;
  authEl('authForm').style.display=u?'none':'';
  authEl('authAccount').style.display=u?'':'none';
  authEl('authCard').classList.toggle('pf',!!u);
  authEl('authTitle').textContent=u?u.name:t.welcome;
  authEl('authSub').textContent=u?'':t.sub;
  authEl('authTabIn').textContent=t.tabIn;
  authEl('authTabUp').textContent=t.tabUp;
  authEl('authName').placeholder=t.name;
  authEl('authEmail').placeholder=t.email;
  authEl('authPass').placeholder=t.pass;
  authEl('authPass2').placeholder=t.pass2;
  authEl('authSubmitTx').textContent=authMode==='in'?t.btnIn:t.btnUp;
  document.querySelectorAll('#authView .auth-eye').forEach(b=>{ b.title=b.classList.contains('on')?t.hidePass:t.showPass; b.setAttribute('aria-label',b.title); });
  const av=authEl('authAvatar'); av.classList.toggle('guest',!u); av.textContent=u?(u.name.trim()[0]||'✦').toUpperCase():'✦';
  authEl('authClose').title=t.close;
  authEl('authWho').textContent=u?u.email:'';
  authEl('authAdmin').textContent=t.admin;
  authEl('authAdmin').style.display=u&&u.role==='admin'?'':'none';
  authEl('authLogout').textContent=t.logout;
  if(u) pfRender();
  const ub=authEl('userBtn');
  if(ub){ ub.title=u?t.hello+', '+u.name:t.tabIn; ub.classList.toggle('active',!!u); }
}
function authShowErr(msg){ const e=authEl('authErr'); e.textContent=msg; e.classList.add('on');
  clearTimeout(authShowErr.tm); authShowErr.tm=setTimeout(()=>e.classList.remove('on'),3200); }
function authSetMode(m){
  authMode=m;
  authEl('authTabIn').classList.toggle('active',m==='in');
  authEl('authTabUp').classList.toggle('active',m==='up');
  authEl('authTabIn').setAttribute('aria-selected',m==='in'); authEl('authTabUp').setAttribute('aria-selected',m==='up');
  authEl('authTabs').classList.toggle('up',m==='up');
  authEl('authName').style.display=m==='up'?'block':'none';
  authEl('authPass2Wrap').style.display=m==='up'?'':'none';
  authEl('authPass').autocomplete=m==='up'?'new-password':'current-password';
  authEl('authErr').classList.remove('on');
  authBuildUI();
}
// Oyna ochiq paytda 3D sahna pauza qilinadi (__authCover → animate()): blur qotgan kadr ustida bir marta
// hisoblanadi, GPU bo'shaydi — kiritish va animatsiyalar qotmaydi.
let authPrevFocus=null;   // oyna yopilganda fokus shu elementga qaytadi (klaviatura bilan ishlovchilar uchun)
function authOpen(){ if(!window.API||!window.API.online) return; authSetMode(authMode);
  authPrevFocus=document.activeElement;
  window.__authCover=true; authEl('authView').classList.remove('off');
  if(window.API.user) pfLoad();
  setTimeout(()=>{ const f=window.API.user?authEl('authClose'):authEl(authMode==='up'?'authName':'authEmail'); if(f) f.focus({preventScroll:true}); },240); }
function authClose(){ authEl('authView').classList.add('off'); window.__authCover=false;
  if(authPrevFocus && authPrevFocus.focus && document.contains(authPrevFocus)) authPrevFocus.focus({preventScroll:true}); authPrevFocus=null; }
// Server xato kodlari → 3 tilli matn
function authErrText(e){
  const t=authT();
  return ({ INVALID_CREDENTIALS:t.errCreds, EMAIL_EXISTS:t.errExists, CONFLICT:t.errExists, RATE_LIMIT:t.errRate, BLOCKED:t.errBlocked,
    VALIDATION:t.errFill })[e&&e.code] || t.errServer;
}
/* ---------- Profil: statistika, so'nggi natijalar, ism va parolni o'zgartirish ---------- */
const PF_LOCALE={ uz:'uz-UZ', ru:'ru-RU', en:'en-GB' };
let pfData=null;
// O'zbek tili uchun brauzerlar sanani noto'g'ri chiqaradi ("2026 M10 21") — oy nomlari qo'lda.
const PF_UZ_MON=['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
function pfDate(v,withTime){
  const d=new Date(v); if(isNaN(d)) return '';
  const hm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  if(LANG==='uz'||!PF_LOCALE[LANG]) return withTime ? d.getDate()+'-'+PF_UZ_MON[d.getMonth()]+', '+hm : d.getDate()+'-'+PF_UZ_MON[d.getMonth()]+', '+d.getFullYear();
  return withTime ? d.toLocaleDateString(PF_LOCALE[LANG],{day:'numeric',month:'short'})+', '+hm
                  : d.toLocaleDateString(PF_LOCALE[LANG],{day:'numeric',month:'long',year:'numeric'});
}
// Test ID → o'qiladigan nom: quiz:easy · quiz:dz:1-40 · topic:t07
function pfQuizName(r){
  const t=authT(); let m;
  if((m=/^quiz:dz:(\d+)-(\d+)$/.exec(r.quizId))) return t.qDz+' · '+m[1]+'–'+m[2];
  if((m=/^quiz:(\w+)$/.exec(r.quizId))){ const lv={easy:t.lvEasy,medium:t.lvMedium,hard:t.lvHard}[m[1]]; return t.qMain+' · '+(lv||m[1]); }
  if(/^topic:/.test(r.quizId)) return r.title ? (r.title[LANG]||r.title.uz) : t.qTopic;
  return r.quizId;
}
function pfMsg(text,ok){ const e=authEl('pfMsg'); e.textContent=text; e.className='pf-msg on '+(ok?'ok':'err');
  clearTimeout(pfMsg.tm); pfMsg.tm=setTimeout(()=>e.classList.remove('on'),3500); }
function pfRender(){
  const t=authT(), d=pfData, u=window.API&&window.API.user;
  if(!u) return;
  const role=authEl('pfRole'); role.textContent=u.role==='admin'?t.roleAdmin:t.roleUser; role.classList.toggle('admin',u.role==='admin');
  authEl('pfReadL').textContent=t.pfRead; authEl('pfTestsL').textContent=t.pfTests;
  authEl('pfAvgL').textContent=t.pfAvg; authEl('pfBestL').textContent=t.pfBest; authEl('pfRecentL').textContent=t.pfRecent;
  authEl('pfEditL').textContent=t.pfEdit; authEl('pfPassL').textContent=t.pfPass;
  authEl('pfNameSaveTx').textContent=t.pfSave; authEl('pfPassSaveTx').textContent=t.pfPassBtn;
  authEl('pfName').placeholder=t.name; authEl('pfCur').placeholder=t.pfCur; authEl('pfNew').placeholder=t.pfNew; authEl('pfNew2').placeholder=t.pfNew2;
  if(!d){ authEl('pfSince').textContent=''; return; }
  const s=d.stats;
  authEl('pfSince').textContent=t.pfSince+' '+pfDate(d.user.createdAt);
  authEl('pfRead').textContent=s.readCount+' / '+s.totalTopics;
  authEl('pfReadBar').style.width=Math.min(100,s.totalTopics?s.readCount/s.totalTopics*100:0)+'%';
  authEl('pfTests').textContent=s.quizCount;
  authEl('pfAvg').textContent=s.avgPercent==null?'—':Math.round(s.avgPercent)+'%';
  authEl('pfBest').textContent=s.bestPercent==null?'—':Math.round(s.bestPercent)+'%';
  const ul=authEl('pfRecent'); ul.textContent='';
  if(!d.recent.length){ const li=document.createElement('li'); li.className='empty'; li.textContent=t.pfNoTests; ul.appendChild(li); }
  d.recent.forEach(r=>{
    const p=Math.round(r.score/r.total*100), li=document.createElement('li');
    const nm=document.createElement('span'); nm.className='nm'; nm.textContent=pfQuizName(r); nm.title=nm.textContent;
    const dt=document.createElement('small'); dt.textContent=pfDate(r.at,true); nm.appendChild(dt);
    const sc=document.createElement('span'); sc.className='sc'; sc.textContent=r.score+'/'+r.total;
    const pc=document.createElement('span'); pc.className='pc '+(p>=80?'hi':p>=50?'mid':'lo'); pc.textContent=p+'%';
    li.append(nm,sc,pc); ul.appendChild(li);
  });
}
async function pfLoad(){
  if(!window.API||!window.API.user) return;
  authEl('pfName').value=window.API.user.name;
  pfRender();
  try{ pfData=await window.API.profile(); pfRender(); }
  catch(e){ if(window.API.user) pfMsg(authT().pfLoadErr,false); }
}
function pfBusy(btn,on){ btn.disabled=on; btn.classList.toggle('busy',on); }
authEl('pfNameSave').addEventListener('click',async()=>{
  const t=authT(), name=authEl('pfName').value.trim(), btn=authEl('pfNameSave');
  if(!name) return pfMsg(t.errFill,false);
  if(!window.API.user || name===window.API.user.name) return;
  pfBusy(btn,true);
  try{ await window.API.updateName(name); pfMsg(t.pfSaved,true); authEl('pfEditDet').open=false; playClick(880); }
  catch(e){ pfMsg(authErrText(e),false); }
  finally{ pfBusy(btn,false); }
});
authEl('pfName').addEventListener('keydown',e=>{ if(e.key==='Enter') authEl('pfNameSave').click(); });
authEl('pfPassSave').addEventListener('click',async()=>{
  const t=authT(), cur=authEl('pfCur').value, nw=authEl('pfNew').value, nw2=authEl('pfNew2').value, btn=authEl('pfPassSave');
  if(!cur||!nw||!nw2) return pfMsg(t.errFill,false);
  if(nw.length<8) return pfMsg(t.errPassLen,false);
  if(nw!==nw2) return pfMsg(t.errPass2,false);
  pfBusy(btn,true);
  try{
    await window.API.changePassword(cur,nw);
    ['pfCur','pfNew','pfNew2'].forEach(id=>{ authEl(id).value=''; authEl(id).type='password'; });
    document.querySelectorAll('#pfPassDet .auth-eye').forEach(b=>b.classList.remove('on'));
    authEl('pfPassDet').open=false; pfMsg(t.pfPassOk,true); playClick(880);
  }catch(e){ pfMsg(e&&e.code==='WRONG_PASSWORD'?t.errCurPass:authErrText(e),false); }
  finally{ pfBusy(btn,false); }
});
document.querySelectorAll('#pfPassDet input').forEach(i=>i.addEventListener('keydown',e=>{ if(e.key==='Enter') authEl('pfPassSave').click(); }));
// Profildagi ko'z tugmalari kirish formasidagi bilan bir xil ikonka oladi
(function(){ const src=document.querySelector('#authFields .auth-eye'); if(src) document.querySelectorAll('#authAccount .auth-eye').forEach(b=>{ b.innerHTML=src.innerHTML; }); })();
async function authSubmit(){
  if(authBusy) return;
  const t=authT();
  const email=authEl('authEmail').value.trim().toLowerCase();
  const pass=authEl('authPass').value;
  let name='';
  if(authMode==='up'){
    name=authEl('authName').value.trim();
    const pass2=authEl('authPass2').value;
    if(!name||!email||!pass||!pass2) return authShowErr(t.errFill);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authShowErr(t.errEmail);
    if(pass.length<8) return authShowErr(t.errPassLen);
    if(pass!==pass2) return authShowErr(t.errPass2);
  } else if(!email||!pass) return authShowErr(t.errFill);
  authBusy=true; authEl('authSubmit').disabled=true; authEl('authSubmit').classList.add('busy');
  try{
    if(authMode==='up') await window.API.register(name,email,pass);
    else await window.API.login(email,pass);
    authEl('authPass').value=''; authEl('authPass2').value='';
    document.querySelectorAll('#authView .auth-eye').forEach(b=>{ b.classList.remove('on'); authEl(b.dataset.for).type='password'; });
    authClose(); playClick(880);
  }catch(e){ authShowErr(authErrText(e)); }
  finally{ authBusy=false; authEl('authSubmit').disabled=false; authEl('authSubmit').classList.remove('busy'); }
}
authEl('authTabIn').addEventListener('click',()=>{ playClick(620); authSetMode('in'); });
authEl('authTabUp').addEventListener('click',()=>{ playClick(620); authSetMode('up'); });
authEl('authSubmit').addEventListener('click',()=>authSubmit());
authEl('authFields').addEventListener('keydown',e=>{ if(e.key==='Enter') authSubmit(); });
// Parolni ko'rsatish / yashirish
document.querySelectorAll('#authView .auth-eye').forEach(b=>b.addEventListener('click',()=>{
  const inp=authEl(b.dataset.for), show=inp.type==='password';
  inp.type=show?'text':'password'; b.classList.toggle('on',show); authBuildUI();
  inp.focus({preventScroll:true}); const n=inp.value.length; try{ inp.setSelectionRange(n,n); }catch(e){}
}));
authEl('authClose').addEventListener('click',()=>{ playClick(440); authClose(); });
authEl('authView').addEventListener('click',e=>{ if(e.target.id==='authView') authClose(); });
// Escape faqat kirish oynasini yopadi (orqadagi panel/laboratoriyalarning Escape'i ishga tushmaydi);
// Tab fokusni oyna ichida aylantiradi (fokus tuzog'i).
document.addEventListener('keydown',e=>{
  if(authEl('authView').classList.contains('off')) return;
  if(e.key==='Escape'){ e.stopImmediatePropagation(); e.preventDefault(); authClose(); return; }
  if(e.key==='Tab'){
    const f=[...authEl('authCard').querySelectorAll('button,input,summary,a[href]')].filter(x=>x.offsetParent!==null && !x.disabled);
    if(!f.length) return;
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    else if(!authEl('authCard').contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  }
}, true);
authEl('authAdmin').addEventListener('click',()=>{ playClick(760); location.href='/admin'; });
authEl('authLogout').addEventListener('click',async()=>{ playClick(440); authEl('authLogout').disabled=true;
  try{
    await window.API.logout(); pfData=null;
    authEl('pfEditDet').open=false; authEl('pfPassDet').open=false; authSetMode('in');
  }catch(e){ pfMsg(authErrText(e),false); }   // server bilan aloqa yo'q — saqlanmagan progress yo'qolmasin, kirgan holicha qoladi
  finally{ authEl('authLogout').disabled=false; } });
authEl('userBtn').addEventListener('click',()=>{ playClick(620); authOpen(); });
// Server holati o'zgarganda (kirish/chiqish/sessiya tugashi) UI yangilanadi.
function authRefresh(){
  const on=!!(window.API&&window.API.online);
  authEl('userBtn').style.display=on?'':'none';
  authEl('authView').style.display=on?'':'none';
  authBuildUI();
}
window.__authReady=true;
if(window.API){
  window.API.on(authRefresh);
  window.API.ready.then(()=>{ authRefresh(); if(location.hash==='#login'){ history.replaceState(null,'',location.pathname+location.search); authOpen(); } });
}
authRefresh();

animate();

/* --------------------------------------------------------------------------
   14. RESPONSIVE
   -------------------------------------------------------------------------- */
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  if(cutCamera){ cutCamera.aspect = window.innerWidth/window.innerHeight; cutCamera.updateProjectionMatrix(); }
  if(typeof snCamera!=='undefined' && snCamera){ snCamera.aspect = window.innerWidth/window.innerHeight; snCamera.updateProjectionMatrix(); }
  renderer.setSize(window.innerWidth, window.innerHeight);
});

})();
