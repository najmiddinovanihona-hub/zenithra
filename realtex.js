/* REALTEX — haqiqiy sayyora teksturalari (NASA ma'lumotlari asosida, Solar System Scope, CC BY 4.0)
   barcha 3D sahnalar uchun umumiy yuklovchi: asosiy sahna, fasllar, kesim, darslik, ilmiy bo'lim, simulyator.

   - Har bir fayl BIR marta yuklanadi va createImageBitmap orqali asosiy oqimdan tashqarida dekodlanadi.
   - Yuklashlar navbat bilan (bir vaqtda bittadan) — tarmoq va dekoder bir lahzada band bo'lib qolmaydi.
   - REALTEX.texture(key, {srgb}) har chaqiruvda bitta rasmga ulangan Texture beradi:
       srgb:true  — renderer.outputEncoding = sRGBEncoding bo'lgan sahnalar (asosiy sahna, simulyator);
       srgb:false — chiqishi chiziqli (standart) bo'lgan sahnalar (darslik, ilmiy bo'lim).
   - Server bo'lmasa (file://), brauzer createImageBitmap bilmasa yoki ?notex bo'lsa — REALTEX.ok=false,
     hamma joyda avvalgi protsedural teksturalar qoladi. */
(function(){
const FILES={
  sun:'2k_sun.jpg', mercury:'2k_mercury.jpg', venus:'2k_venus_atmosphere.jpg',
  earth:'2k_earth_daymap.jpg', earthNight:'2k_earth_nightmap.jpg', clouds:'2k_earth_clouds.jpg',
  moon:'2k_moon.jpg', mars:'2k_mars.jpg', jupiter:'2k_jupiter.jpg', saturn:'2k_saturn.jpg',
  saturnRing:'2k_saturn_ring_alpha.png', uranus:'2k_uranus.jpg', neptune:'2k_neptune.jpg', ceres:'2k_ceres_fictional.jpg',
};
const DIR='textures/', V='?v=1';
const ok = typeof THREE!=='undefined' && /^https?:$/.test(location.protocol)
  && typeof createImageBitmap==='function' && !/[?&]notex\b/.test(location.search);

const bitmaps={};            // key → Promise<ImageBitmap>
let queue=Promise.resolve();  // navbat: keyingi fayl oldingisi tugagach yuklanadi
function bitmap(key){
  if(!ok || !FILES[key]) return Promise.reject(new Error('no-realtex'));
  if(!bitmaps[key]){
    bitmaps[key]=queue=queue.catch(()=>{}).then(async()=>{
      const r=await fetch(DIR+FILES[key]+V);
      if(!r.ok) throw new Error(FILES[key]+' '+r.status);
      return createImageBitmap(await r.blob(), { imageOrientation:'flipY' });
    });
    bitmaps[key].catch(e=>console.warn('[tekstura]', e.message||e));
  }
  return bitmaps[key];
}
const texCache={};
function texture(key, opts){
  const srgb=!opts || opts.srgb!==false;
  const ck=key+(srgb?'|s':'|l');
  if(!texCache[ck]) texCache[ck]=bitmap(key).then(bmp=>{
    const t=new THREE.Texture(bmp);
    t.flipY=false;                                   // bitmap allaqachon aylantirilgan
    t.anisotropy=8;
    t.wrapS = key==='saturnRing' ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
    t.minFilter=THREE.LinearMipmapLinearFilter; t.magFilter=THREE.LinearFilter;
    t.encoding = srgb && key!=='clouds' ? THREE.sRGBEncoding : THREE.LinearEncoding;
    t.needsUpdate=true;
    return t;
  });
  return texCache[ck];
}

/* Mesh materialiga haqiqiy teksturani qo'yish (yuklangach). opts:
     srgb   — yuqoridagi kabi;
     gain   — rang koeffitsienti (sahna yorug'ligi kuchli bo'lsa haqiqiy suratlar oqarib ketmasligi uchun);
     bump   — toshli jismlarda relyef shu rasmdan (bumpScale);
     tint   — rang bilan bo'yash (masalan, boshqa yulduz yoki ekzosayyora uchun);
     renderer — berilsa, tekstura darhol GPU'ga yuklanadi (ko'rinishga kirganda qotmaydi). */
function apply(mesh, key, opts){
  opts=opts||{};
  if(!mesh || !mesh.material) return Promise.resolve(null);
  return texture(key, opts).then(t=>{
    const m=mesh.material;
    if(!m) return null;
    m.map=t;
    if('normalMap' in m){ m.normalMap=null; m.roughnessMap=null; m.bumpMap=opts.bump?t:null; m.bumpScale=opts.bump||0; }
    if(m.color){ if(opts.tint!=null) m.color.set(opts.tint); else m.color.setScalar(opts.gain!=null?opts.gain:1); }
    if(m.color && opts.tint!=null && opts.gain!=null) m.color.multiplyScalar(opts.gain);
    if(opts.renderer && opts.renderer.initTexture) opts.renderer.initTexture(t);
    m.needsUpdate=true;
    return t;
  }).catch(()=>null);
}
// Bulut qatlami: oq-qora bulut xaritasi shaffoflik (alphaMap) sifatida
function clouds(mesh, opts){
  opts=opts||{};
  if(!mesh || !mesh.material) return Promise.resolve(null);
  return texture('clouds', { srgb:false }).then(t=>{
    const m=mesh.material;
    m.map=null; m.alphaMap=t; m.transparent=true; m.depthWrite=false;
    if(m.color) m.color.set(0xffffff);
    m.opacity = opts.opacity!=null ? opts.opacity : 0.9;
    if(opts.renderer && opts.renderer.initTexture) opts.renderer.initTexture(t);
    m.needsUpdate=true;
    return t;
  }).catch(()=>null);
}

/* Yulduz: Quyosh fotosferasi suratidan faqat granulalar naqshi (yorqinlik) olinadi, rang esa `tint` dan —
   shu bilan ko'k O-sinf ham, qizil M-mitti ham haqiqiy yulduz sirtidek ko'rinadi. Chekka qorayishi (limb darkening) bor.
   material.color o'sha tint rangining o'zi — mavjud kod (Doppler rangi, tranzit xiralashuvi) ishlayveradi. */
let _glow=null;
function glowTex(){
  if(_glow) return _glow;
  const c=document.createElement('canvas'); c.width=c.height=128;
  const x=c.getContext('2d'), g=x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,0.9)'); g.addColorStop(0.32,'rgba(255,255,255,0.45)');
  g.addColorStop(0.6,'rgba(255,255,255,0.1)'); g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g; x.fillRect(0,0,128,128);
  return _glow=new THREE.CanvasTexture(c);
}
function star(mesh, tint, opts){
  opts=opts||{};
  if(!mesh || !mesh.material) return Promise.resolve(null);
  return texture('sun', { srgb:false }).then(t=>{
    const old=mesh.material;
    const col=old.color ? old.color.clone() : new THREE.Color(tint!=null?tint:0xffffff);
    if(tint!=null) col.set(tint);
    const U={ map:{value:t}, tint:{value:col}, gain:{value:opts.gain||1.2}, opacity:{value:old.opacity!=null?old.opacity:1} };
    const m=new THREE.ShaderMaterial({
      uniforms:U, transparent:!!old.transparent, depthWrite:old.depthWrite!==false,
      vertexShader:'varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n'+
        'void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
      fragmentShader:'uniform sampler2D map; uniform vec3 tint; uniform float gain; uniform float opacity;\n'+
        'varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n'+
        'void main(){\n'+
        // Quyosh suratidan faqat yorqinlik naqshi olinadi; kontrast past — yulduz "oy"ga o'xshab qolmaydi
        '  float l=dot(texture2D(map,vUv).rgb,vec3(0.4,0.45,0.15));\n'+
        '  float mu=max(dot(normalize(vN),normalize(vV)),0.0); float limb=0.42+0.58*pow(mu,0.5);\n'+
        '  vec3 col=tint*gain*(0.86+0.5*(l-0.5))*limb;\n'+
        '  col=mix(col, vec3(1.0), 0.32*pow(mu,2.0));\n'+          // issiq, oqarib turgan markaz
        '  gl_FragColor=vec4(col, opacity); }'
    });
    m.color=col;                                         // mavjud kod material.color ni o'zgartiradi
    Object.defineProperty(m,'opacity',{ get:()=>U.opacity.value, set:v=>{ U.opacity.value=v; } });
    mesh.material=m; old.dispose();
    // yulduz atrofidagi nur (bir marta, bitta sprite) — rangi material.color ga ergashadi
    if(opts.glow!==false && !mesh.userData.rtGlow){
      const r=(mesh.geometry.parameters && mesh.geometry.parameters.radius) || 1;
      const g=new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex(), color:col, transparent:true,
        opacity:opts.glowOpacity||0.85, blending:THREE.AdditiveBlending, depthWrite:false }));
      g.scale.set(r*4, r*4, 1); mesh.add(g); mesh.userData.rtGlow=g;
    }
    return t;
  }).catch(()=>null);
}

window.REALTEX={ ok, FILES, bitmap, texture, apply, clouds, star };
})();
