// To'lqin turlari — 3D (〰 mavzusi)
(function(){
if(!window.ILM3D||!window.WAVES_TXT)return;
const B=[
 H=>{const G=new THREE.Group(),N=240,E=H.line(N,0xff5a6e),Bm=H.line(N,0x4ea8ff),sE=H.segs(60,0xff5a6e,.45),sB=H.segs(60,0x4ea8ff,.45),ax=H.line(2,0xffffff,.5);
  ax.geometry.attributes.position.array.set([-12,0,0,12,0,0]);G.add(E,Bm,sE,sB,ax);
  return {G,cam:[4,6,17],tg:[0,0,0],u(t){const e=E.geometry.attributes.position.array,b=Bm.geometry.attributes.position.array,se=sE.geometry.attributes.position.array,sb=sB.geometry.attributes.position.array;
   for(let i=0;i<N;i++){const x=-12+24*i/(N-1),v=2.6*Math.sin(1.1*x-3*t);e.set([x,v,0],i*3);b.set([x,0,v],i*3);if(i%4===0){const j=i/4;se.set([x,0,0,x,v,0],j*6);sb.set([x,0,0,x,0,v],j*6);}}
   [E,Bm,sE,sB].forEach(H.upd);}};},
 H=>{const G=new THREE.Group(),geo=new THREE.PlaneGeometry(32,32,110,110);geo.rotateX(-Math.PI/2);
  G.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x4ea8ff,wireframe:true,transparent:true,opacity:.45})));
  const a=H.ball(.55,0xffc861,24),b=H.ball(.55,0xa26bff,24);G.add(a,b);const base=geo.attributes.position.array.slice();
  return {G,cam:[0,13,19],tg:[0,-1,0],u(t){const p=geo.attributes.position.array,W=1.3;
   for(let i=0;i<p.length;i+=3){const x=base[i],z=base[i+2],r=Math.hypot(x,z),th=Math.atan2(z,x);p[i+1]=-2.4/(1+.35*r*r)+.75*Math.cos(2*th-2*W*t+1.1*r)*Math.min(1,r/2.5)/(1+.06*r);}
   geo.attributes.position.needsUpdate=true;const q=W*t;a.position.set(1.3*Math.cos(q),-1.6,1.3*Math.sin(q));b.position.set(-1.3*Math.cos(q),-1.6,-1.3*Math.sin(q));}};},
 H=>{const nx=70,ny=7,nz=7,N=nx*ny*nz,P=H.pts(N,.13),G=new THREE.Group();G.add(P);const c1=new H.C(0x16306a),c2=new H.C(0x7fe8ff),c=new H.C();
  return {G,cam:[3,5,16],tg:[0,0,0],u(t){const p=P.geometry.attributes.position.array,cl=P.geometry.attributes.color.array;let k=0;
   for(let i=0;i<nx;i++){const x0=-11+22*i/(nx-1),ph=1.2*x0-3*t,x=x0+.42*Math.sin(ph),d=(1-Math.cos(ph))/2;c.copy(c1).lerp(c2,d);
    for(let j=0;j<ny;j++)for(let l=0;l<nz;l++){p.set([x,-1.5+3*j/(ny-1),-1.5+3*l/(nz-1)],k*3);cl.set([c.r,c.g,c.b],k*3);k++;}}H.upd(P);}};},
 H=>{const nx=60,ny=9,nz=10,N=nx*ny*nz,P=H.pts(N,.14),G=new THREE.Group();G.add(P);const top=new H.C(0xffc861),bot=new H.C(0x6b3a1c),c=new H.C();
  return {G,cam:[8,6,15],tg:[0,-2,0],u(t){const p=P.geometry.attributes.position.array,cl=P.geometry.attributes.color.array;let k=0;
   for(let j=0;j<ny;j++){const y0=-5*j/(ny-1),dec=Math.exp(y0*.55);c.copy(top).lerp(bot,j/(ny-1));
    for(let i=0;i<nx;i++){const x0=-11+22*i/(nx-1),ph=1.1*x0-2.6*t;for(let l=0;l<nz;l++){p.set([x0+.55*dec*Math.sin(ph),y0+.55*dec*Math.cos(ph),-3+6*l/(nz-1)],k*3);cl.set([c.r,c.g,c.b],k*3);k++;}}}H.upd(P);}};},
 H=>{const G=new THREE.Group(),disc=new THREE.Mesh(new THREE.CircleGeometry(7,48),new THREE.MeshBasicMaterial({color:0xff8a3d,transparent:true,opacity:.35,side:THREE.DoubleSide}));disc.rotation.x=-Math.PI/2;G.add(disc);
  const Ls=[],N=90;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const l=H.line(N,(a+b)%2?0xffc861:0xff8a3d,.9);l.userData={x:a*2.2,z:b*2.2,f:(a*3+b)*.6};Ls.push(l);G.add(l);}
  return {G,cam:[13,9,13],tg:[0,5,0],u(t){Ls.forEach(l=>{const p=l.geometry.attributes.position.array,{x,z,f}=l.userData;
   for(let i=0;i<N;i++){const y=12*i/(N-1),ph=.9*y-3*t+f,amp=.9*(y/12);p.set([x+amp*Math.sin(ph),y,z+amp*.5*Math.cos(ph)],i*3);}H.upd(l);});}};},
 H=>{const G=new THREE.Group(),core=H.ball(.6,0xfff2c0,24);G.add(core);const n=900,unit=H.fib(n);
  const sh=[0xff7a8a,0xffc861,0xff9a4d,0xffe08a].map(c=>{const P=H.pts(n,.16,c);P.geometry.attributes.position.array.set(unit);G.add(P);return P;});
  return {G,cam:[0,8,24],tg:[0,0,0],u(t){sh.forEach((P,i)=>{const r=.8+((t*2.2+i*3)%12);P.scale.setScalar(r);P.material.opacity=Math.max(0,1-r/12.8);});core.scale.setScalar(1+.15*Math.sin(t*6));}};},
 H=>{const N=7000,P=H.pts(N,.11),G=new THREE.Group();G.add(P,H.ball(.9,0xffd98a,24));
  const R0=new Float32Array(N),T0=new Float32Array(N),Y0=new Float32Array(N);for(let i=0;i<N;i++){R0[i]=1+Math.pow(Math.random(),.8)*10;T0[i]=Math.random()*Math.PI*2;Y0[i]=(Math.random()-.5)*.35;}
  const hi=new H.C(0xcfe6ff),lo=new H.C(0x1a2450),c=new H.C();
  return {G,cam:[0,15,14],tg:[0,0,0],u(t){const p=P.geometry.attributes.position.array,cl=P.geometry.attributes.color.array;
   for(let i=0;i<N;i++){const r=R0[i],th=T0[i]+1.6/r*t,s=Math.max(0,Math.cos(2*(th-.12*t)-2.4*Math.log(r)));c.copy(lo).lerp(hi,s*s);p.set([r*Math.cos(th),Y0[i],r*Math.sin(th)],i*3);cl.set([c.r,c.g,c.b],i*3);}H.upd(P);}};}
];
const W=window.WAVES_TXT,esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
window.ILM3D.add('〰',{
 title:{uz:W.uz.h,ru:W.ru.h,en:W.en.h},
 items:B.map((b,i)=>({n:{uz:W.uz.w[i].n,ru:W.ru.w[i].n,en:W.en.w[i].n},build:b})),
 info(l,i){const w=W[l]||W.uz,x=w.w[i];return `<div style="font-size:20px;font-weight:800;margin-bottom:8px">${esc(x.n)}</div><p style="margin-bottom:10px">${esc(x.d)}</p><div style="display:flex;flex-wrap:wrap;gap:8px 22px;font-size:14px"><span><b style="color:var(--neon)">${w.speed}:</b> ${esc(x.s)}</span><span><b style="color:var(--neon)">${w.where}:</b> ${esc(x.x)}</span></div>`;},
 extra(l){const w=W[l]||W.uz;return `<h4>${w.spec}</h4><div class="ilm-box" style="overflow-x:auto"><table class="ilm-tbl"><thead><tr>${w.specH.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${w.specR.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
});
})();
