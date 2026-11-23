// To'lqin turlari — 3D (〰 mavzusi). Realistik rejim: HDR + bloom, nurli chiziqlar, silliq fazo-vaqt varag'i.
(function(){
if(!window.ILM3D||!window.WAVES_TXT)return;
// Doimiy materiallar: element almashganda dispose qilinmaydi — shader dasturi keshda qoladi, qayta tanlashda kompilyatsiya to'xtashi bo'lmaydi
const KM={},keepM=(k,f)=>{let m=KM[k];if(!m){m=f();m.dispose=()=>{};KM[k]=m;}return m;};
const kStd=(H,c,o)=>keepM('s'+c+JSON.stringify(o||{}),()=>H.std(c,o)),kB=(H,c,k)=>keepM('b'+c+'|'+k,()=>new THREE.MeshBasicMaterial({color:H.lin(c).multiplyScalar(k)}));
const warmStd=()=>{if(window.__ilmStdW)return;const R=window.ILM3D.renderer&&window.ILM3D.renderer();if(!R)return;window.__ilmStdW=1;   // MeshStandard dasturini bo'sh vaqtda oldindan kompilyatsiya (bir marta)
 (window.requestIdleCallback||(f=>setTimeout(f,60)))(()=>{try{const s=new THREE.Scene(),m=new THREE.MeshStandardMaterial();m.dispose=()=>{};s.add(new THREE.AmbientLight(),new THREE.PointLight(),new THREE.Mesh(new THREE.BoxGeometry(),m));R.compile(s,new THREE.PerspectiveCamera());}catch(e){}},{timeout:1500});};
const B=[
 // 0 — Elektromagnit to'lqin: E (qizil) va B (ko'k) maydonlar, vektor strelkalari, tarqalish yo'nalishi
 H=>{const G=new THREE.Group(),N=240,NS=40,cE=0xff4a5e,cB=0x4ea8ff,E=H.fatLine(N,cE,{width:3,glow:.8,intensity:1.6}),Bm=H.fatLine(N,cB,{width:3,glow:.8,intensity:1.6});G.add(E,Bm);
  // maydon vektorlari: o'q chizig'i (additiv ingichka chiziqlar) + konus uchlari
  const spk=c=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NS*6),3));const l=new THREE.LineSegments(g,keepM('l'+c,()=>new THREE.LineBasicMaterial({color:H.lin(c).multiplyScalar(1.4),transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})));l.frustumCulled=false;return l;};
  const sE=spk(cE),sB=spk(cB);G.add(sE,sB);
  const cone=new THREE.ConeGeometry(.11,.32,10);cone.translate(0,-.16,0);
  const mkA=c=>{const m=kB(H,c,2.2);return Array.from({length:NS},()=>{const a=new THREE.Mesh(cone,m);G.add(a);return a;});};
  const aE=mkA(cE),aB=mkA(cB);
  // tarqalish o'qi va yo'nalish strelkasi (k)
  G.add(H.fatLine(2,0xffffff,{width:1.2,glow:.3,intensity:.6,opacity:.7}).set([-12.5,0,0,12.2,0,0]));
  const kh=new THREE.Mesh(new THREE.ConeGeometry(.22,.6,14),kB(H,0xffffff,1.5));kh.rotation.z=-Math.PI/2;kh.position.x=12.4;G.add(kh);
  const lE=H.label('E',{color:'#ff6b7c',scale:1.3}),lB=H.label('B',{color:'#6fb8ff',scale:1.3}),lc=H.label('c →',{color:'#ffffff',scale:1.1});lc.position.set(11,.7,0);lE.position.set(-11.6,3.4,0);lB.position.set(-11.6,.3,3.4);G.add(lE,lB,lc);
  const e=new Float32Array(N*3),b=new Float32Array(N*3),Q=new THREE.Quaternion(),UP=new THREE.Vector3(0,1,0),DN=new THREE.Vector3(0,-1,0),ZP=new THREE.Vector3(0,0,1),ZN=new THREE.Vector3(0,0,-1);
  const setA=(a,x,v,ax)=>{const s=Math.abs(v);a.visible=s>.25;if(!a.visible)return;if(ax)a.position.set(x,0,v);else a.position.set(x,v,0);
   a.quaternion.setFromUnitVectors(UP,ax?(v>0?ZP:ZN):(v>0?UP:DN));a.scale.setScalar(Math.min(1,s/1.2));};
  return {G,cam:[4,6,17],tg:[0,0,0],bg:'space',bloom:{strength:.75,threshold:1,radius:1},u(t){const se=sE.geometry.attributes.position.array,sb=sB.geometry.attributes.position.array;
   for(let i=0;i<N;i++){const x=-12+24*i/(N-1),v=2.6*Math.sin(1.1*x-3*t);e[i*3]=x;e[i*3+1]=v;e[i*3+2]=0;b[i*3]=x;b[i*3+1]=0;b[i*3+2]=v;}
   E.set(e);Bm.set(b);
   for(let j=0;j<NS;j++){const x=-12+24*(j+.5)/NS,v=2.6*Math.sin(1.1*x-3*t);se.set([x,0,0,x,v,0],j*6);sb.set([x,0,0,x,0,v],j*6);setA(aE[j],x,v,0);setA(aB[j],x,v,1);}
   sE.geometry.attributes.position.needsUpdate=sB.geometry.attributes.position.needsUpdate=true;
}};},
 // 1 — Gravitatsion to'lqin: aylanuvchi ikki ixcham jism fazo-vaqt varag'ida spiral to'lqinlar hosil qiladi
 H=>{const G=new THREE.Group(),S=H.surface(32,H.q==='low'?80:110,{color:0x0b2550,line:0x58a6ff,deep:0x9a6bff,cell:1,depth:2.6,opacity:.75,glow:.6});G.add(S);
  const a=H.star(.42,14000,{intensity:2.4,halo:3.2,glow:.9,gran:.4,seg:H.seg(32)}),b=H.star(.42,9500,{intensity:2.4,halo:3.2,glow:.9,gran:.4,seg:H.seg(32)});G.add(a,b);
  const TA=H.fatLine(90,0xbcd8ff,{width:2,glow:.7,intensity:1.1,fade:1}),TB=H.fatLine(90,0xffd9b0,{width:2,glow:.7,intensity:1.1,fade:1});G.add(TA,TB);
  const W=1.3,ta=new Float32Array(270),tb=new Float32Array(270);
  const f=t=>(x,z)=>{const r=Math.hypot(x,z),th=Math.atan2(z,x);return -2.4/(1+.35*r*r)+.75*Math.cos(2*th-2*W*t+1.1*r)*Math.min(1,r/2.5)/(1+.06*r);};
  return {G,cam:[0,13,19],tg:[0,-1,0],bg:'space',bloom:{strength:.7,threshold:1,radius:1},u(t){S.deform(f(t));const q=W*t;
   a.position.set(1.3*Math.cos(q),-1.35,1.3*Math.sin(q));b.position.set(-1.3*Math.cos(q),-1.35,-1.3*Math.sin(q));
   for(let i=0;i<90;i++){const p=q-(89-i)*.035;ta.set([1.3*Math.cos(p),-1.35,1.3*Math.sin(p)],i*3);tb.set([-1.3*Math.cos(p),-1.35,-1.3*Math.sin(p)],i*3);}TA.set(ta);TB.set(tb);}};},
 // 2 — Tovush (bo'ylama) to'lqin: karnay membranasi havo zarralarini siqib-siyraklashtiradi
 H=>{const nx=70,ny=7,nz=7,N=nx*ny*nz,P=H.particles(N,{size:.17,intensity:1.5}),G=new THREE.Group();G.add(P);
  const c1=H.lin(0x12306e),c2=H.lin(0x8ff0ff);
  // karnay: korpus, membrana (konus) va magnit
  const spk=new THREE.Group(),box=new THREE.Mesh(new THREE.BoxGeometry(1.4,4.4,4.4),kStd(H,0x1a1d24,{roughness:.6,metalness:.2})),cone=new THREE.Mesh(new THREE.ConeGeometry(1.7,.7,40,1,true),kStd(H,0x30343c,{roughness:.8})),cap=new THREE.Mesh(new THREE.SphereGeometry(.45,24,12,0,Math.PI*2,0,Math.PI/2),kStd(H,0x50555e,{roughness:.5,metalness:.3}));
  box.position.x=-.75;cone.rotation.z=-Math.PI/2;cone.position.x=.25;cap.rotation.z=-Math.PI/2;cap.position.x=.05;const mem=new THREE.Group();mem.add(cone,cap);spk.add(box,mem);spk.position.x=-12.6;G.add(spk);G.position.set(6,-8,-10);;
  return {G,cam:[9,-3,6],tg:[6,-8,-10],bg:'space',bloom:{strength:.6,threshold:1,radius:1},u(t){const p=P.pos,cl=P.col;let k=0;
   for(let i=0;i<nx;i++){const x0=-11+22*i/(nx-1),ph=1.2*x0-3*t,x=x0+.42*Math.sin(ph),d=(1-Math.cos(ph))/2,I=.45+1.5*d*d,r=(c1.r+(c2.r-c1.r)*d)*I,g=(c1.g+(c2.g-c1.g)*d)*I,bb=(c1.b+(c2.b-c1.b)*d)*I;
    for(let j=0;j<ny;j++)for(let l=0;l<nz;l++){const o=k*3;p[o]=x;p[o+1]=-1.5+3*j/(ny-1);p[o+2]=-1.5+3*l/(nz-1);cl[o]=r;cl[o+1]=g;cl[o+2]=bb;k++;}}P.upd();
   mem.position.x=.42*Math.sin(1.2*-12.6-3*t)*.6;}};},
 // 3 — Seysmik (Reley) yuza to'lqini: grunt yuzasi va zarralar ellips bo'ylab aylanadi, chuqurlikda so'nadi
 H=>{const nx=60,ny=9,nz=10,N=nx*ny*nz,P=H.particles(N,{size:.16,intensity:.9}),G=new THREE.Group();G.add(P);const top=H.lin(0xffc861),bot=H.lin(0x6b3a1c);
  const SX=120,SZ=12,sg=new THREE.PlaneGeometry(22,6,SX,SZ);sg.rotateX(-Math.PI/2);const base=sg.attributes.position.array.slice();
  const ground=new THREE.Mesh(sg,kStd(H,0x6e5a3e,{roughness:.95,metalness:0}));G.add(ground);G.position.set(-6,-12,-10);;
  // uylar (o'lchov uchun) — yuza bilan birga tebranadi
  const hm=kStd(H,0xd8d2c4,{roughness:.8}),rm=kStd(H,0x8a3a2a,{roughness:.7}),HS=[-7,-1.5,4.5].map(x0=>{const h=new THREE.Group(),w=new THREE.Mesh(new THREE.BoxGeometry(1,.9,1),hm),r=new THREE.Mesh(new THREE.ConeGeometry(.82,.55,4),rm);w.position.y=.45;r.position.y=1.17;r.rotation.y=Math.PI/4;h.add(w,r);h.userData.x0=x0;G.add(h);return h;});
  return {G,cam:[2,-6,5],tg:[-6,-14,-10],bg:'space',bloom:{strength:.5,threshold:1,radius:1},u(t){const p=P.pos,cl=P.col;let k=0;
   for(let j=0;j<ny;j++){const y0=-5*j/(ny-1),dec=Math.exp(y0*.55),f=j/(ny-1),r=top.r+(bot.r-top.r)*f,g=top.g+(bot.g-top.g)*f,b=top.b+(bot.b-top.b)*f;
    for(let i=0;i<nx;i++){const x0=-11+22*i/(nx-1),ph=1.1*x0-2.6*t;for(let l=0;l<nz;l++){const o=k*3;p[o]=x0+.55*dec*Math.sin(ph);p[o+1]=y0+.55*dec*Math.cos(ph)-.12;p[o+2]=-3+6*l/(nz-1);cl[o]=r;cl[o+1]=g;cl[o+2]=b;k++;}}}P.upd();
   const a=sg.attributes.position.array;for(let i=0;i<a.length;i+=3){const x0=base[i],ph=1.1*x0-2.6*t;a[i]=x0+.55*Math.sin(ph);a[i+1]=.55*Math.cos(ph)+.12;}sg.attributes.position.needsUpdate=true;sg.computeVertexNormals();
   HS.forEach(h=>{const x0=h.userData.x0,ph=1.1*x0-2.6*t;h.position.set(x0+.55*Math.sin(ph),.55*Math.cos(ph)+.12,0);h.rotation.z=-.3*Math.cos(ph)*.55*1.1*.5;});}};},
 // 4 — Alfven to'lqini: Quyosh yuzasidan chiqqan magnit maydon chiziqlari tortilgan tor kabi tebranadi
 H=>{const G=new THREE.Group(),RS=40,sun=H.star(RS,3700,{intensity:.7,halo:0,gran:1.3,spots:.15,seg:H.seg(96)});sun.position.y=-RS-.05;G.add(sun);
  const ys=(x,z)=>Math.sqrt(RS*RS-x*x-z*z)-RS-.05;
  const Ls=[],N=90;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const l=H.fatLine(N,(a+b)%2?0x9fdcff:0x6fb4ff,{width:2.2,glow:.8,intensity:1.4,fade:1});l.userData={x:a*2.2,z:b*2.2,f:(a*3+b)*.6,y0:ys(a*2.2,b*2.2)};Ls.push(l);G.add(l);
   const fp=H.glow(0xfff0c0,1.4,1.2);fp.position.set(a*2.2,l.userData.y0+.05,b*2.2);G.add(fp);}   // oyoq nuqtalari — yorqin fakulalar
  // maydon chiziqlari bo'ylab oqayotgan plazma zarralari
  const NP=H.n(25*14),pp=H.particles(NP,{size:.12,color:0xd8f0ff,intensity:1.6}),pu=new Float32Array(NP).map(()=>Math.random());G.add(pp);
  const arr=new Float32Array(N*3);
  return {G,cam:[13,9,13],tg:[0,5,0],bg:'space',bloom:{strength:.75,threshold:1,radius:1},u(t){Ls.forEach(l=>{const {x,z,f,y0}=l.userData;
    for(let i=0;i<N;i++){const y=y0+(12-y0)*(N-1-i)/(N-1),yy=12*(N-1-i)/(N-1),ph=.9*yy-3*t+f,amp=.9*(yy/12);arr[i*3]=x+amp*Math.sin(ph);arr[i*3+1]=y;arr[i*3+2]=z+amp*.5*Math.cos(ph);}l.set(arr);});
   const ps=pp.pos;for(let i=0;i<NP;i++){const l=Ls[i%25].userData,u=(pu[i]+t*.05)%1,yy=12*u,ph=.9*yy-3*t+l.f,amp=.9*u;ps[i*3]=l.x+amp*Math.sin(ph);ps[i*3+1]=l.y0+(12-l.y0)*u;ps[i*3+2]=l.z+amp*.5*Math.cos(ph);pp.size[i]=Math.sin(u*Math.PI);}pp.upd();}};},
 // 5 — Zarba to'lqini: portlashdan kengayuvchi qobiqlar; o'tganda muhit gazi siqilib qiziydi (yorishadi)
 H=>{const G=new THREE.Group(),core=H.star(.6,20000,{intensity:3,halo:5,glow:1.2,gran:.6,spikes:.3,seg:H.seg(32)});G.add(core);
  const n=H.n(900),unit=H.fib(n),SC=[0xff7a8a,0xffc861,0xff9a4d,0xffe08a];
  const sh=SC.map((c,i)=>{const P=H.particles(n,{size:.2,color:c,intensity:1.6});for(let k=0;k<n;k++){const j=1+(Math.random()-.5)*.06;P.pos[k*3]=unit[k*3]*j;P.pos[k*3+1]=unit[k*3+1]*j;P.pos[k*3+2]=unit[k*3+2]*j;P.size[k]=.5+Math.random();}
   P.upd();G.add(P);return P;});
  // yulduzlararo muhit: tinch gaz zarralari (siyrak, sovuq), zarba fronti o'tganda yorishadi
  const NM=H.n(2200),M=H.particles(NM,{size:.13,intensity:1}),MR=new Float32Array(NM),cold=H.lin(0x2a3c7a),hot=H.lin(0xffd9a0);
  for(let i=0;i<NM;i++){const z=Math.random()*2-1,a=Math.random()*6.2832,s=Math.sqrt(1-z*z),r=1.5+Math.pow(Math.random(),.6)*11.5;M.pos.set([r*s*Math.cos(a),r*z,r*s*Math.sin(a)],i*3);MR[i]=r;}G.add(M);
  const R=[0,0,0,0];
  return {G,cam:[0,8,24],tg:[0,0,0],bg:'space',bloom:{strength:.8,threshold:1,radius:1},u(t){sh.forEach((P,i)=>{const r=.8+((t*2.2+i*3)%12);R[i]=r;P.scale.setScalar(r);P.uniforms.uOp.value=Math.max(0,1-r/12.8);});
   const cl=M.col;for(let i=0;i<NM;i++){let s=0;for(let j=0;j<4;j++){const d=(MR[i]-R[j])/.55;if(d<3&&d>-3)s+=Math.exp(-d*d)*Math.max(0,1-R[j]/12.8);}s=Math.min(1.5,s);
    cl[i*3]=cold.r+(hot.r*2.2-cold.r)*s;cl[i*3+1]=cold.g+(hot.g*2.2-cold.g)*s;cl[i*3+2]=cold.b+(hot.b*2.2-cold.b)*s;}M.upd();
   const k=1+.15*Math.sin(t*6);core.scale.setScalar(.6*k);core.setIntensity(3*k);}};},
 // 6 — Zichlik to'lqini: spiral qo'llar — yulduzlar o'tib ketadigan aylanuvchi zichlik to'lqini
 H=>{const N=H.n(7000),P=H.particles(N,{size:.13,intensity:1}),G=new THREE.Group();G.add(P);
  const R0=new Float32Array(N),T0=new Float32Array(N),Y0=new Float32Array(N),K=new Uint8Array(N);for(let i=0;i<N;i++){R0[i]=1+Math.pow(Math.random(),.8)*10;T0[i]=Math.random()*Math.PI*2;Y0[i]=(Math.random()-.5)*.35*(1.2-R0[i]/12);K[i]=Math.random()<.06?1:0;}
  // markaziy bo'rtma: keksa sarg'ish yulduzlar
  const NB=H.n(1200),Bp=H.particles(NB,{size:.12,color:0xffd9a0,intensity:1.1});for(let i=0;i<NB;i++){const z=Math.random()*2-1,a=Math.random()*6.2832,s=Math.sqrt(1-z*z),r=Math.pow(Math.random(),1.8)*2.2;Bp.pos.set([r*s*Math.cos(a),r*z*.55,r*s*Math.sin(a)],i*3);}Bp.upd();
  G.add(Bp,H.glow(0xffe2b0,7,1.3));
  const old=H.lin(0xffd2a0).multiplyScalar(.28),young=H.lin(0xbcd6ff).multiplyScalar(1.8),hii=H.lin(0xff6f9a).multiplyScalar(2.2);
  return {G,cam:[0,15,14],tg:[0,0,0],bg:'space',bloom:{strength:.75,threshold:1,radius:1},u(t){const p=P.pos,cl=P.col,sz=P.size;
   for(let i=0;i<N;i++){const r=R0[i],th=T0[i]+1.6/r*t,s=Math.max(0,Math.cos(2*(th-.12*t)-2.4*Math.log(r))),q=s*s*s,c=K[i]&&s>.85?hii:young;
    p[i*3]=r*Math.cos(th);p[i*3+1]=Y0[i];p[i*3+2]=r*Math.sin(th);cl[i*3]=old.r+(c.r-old.r)*q;cl[i*3+1]=old.g+(c.g-old.g)*q;cl[i*3+2]=old.b+(c.b-old.b)*q;sz[i]=.8+.9*q;}P.upd();}};}
];
const W=window.WAVES_TXT,esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
window.ILM3D.add('〰',{
 title:{uz:W.uz.h,ru:W.ru.h,en:W.en.h},
 items:B.map((b,i)=>({n:{uz:W.uz.w[i].n,ru:W.ru.w[i].n,en:W.en.w[i].n},build:H=>{warmStd();return b(H);}})),
 info(l,i){const w=W[l]||W.uz,x=w.w[i];return `<div style="font-size:20px;font-weight:800;margin-bottom:8px">${esc(x.n)}</div><p style="margin-bottom:10px">${esc(x.d)}</p><div style="display:flex;flex-wrap:wrap;gap:8px 22px;font-size:14px"><span><b style="color:var(--neon)">${w.speed}:</b> ${esc(x.s)}</span><span><b style="color:var(--neon)">${w.where}:</b> ${esc(x.x)}</span></div>`;},
 extra(l){const w=W[l]||W.uz;return `<h4>${w.spec}</h4><div class="ilm-box" style="overflow-x:auto"><table class="ilm-tbl"><thead><tr>${w.specH.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${w.specR.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
});
})();
