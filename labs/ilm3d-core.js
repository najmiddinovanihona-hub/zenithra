// Ilmiy bo'lim — umumiy 3D ko'rgazma dvigateli
(function(){
if(typeof THREE==='undefined')return;
const C=THREE.Color;
const H={
 C,
 pts(n,size,col){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));const vc=col==null;if(vc)g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));return new THREE.Points(g,new THREE.PointsMaterial({size,color:vc?0xffffff:col,vertexColors:vc,transparent:true,depthWrite:false}));},
 line(n,col,op){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));return new THREE.Line(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op||1}));},
 segs(n,col,op){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*6),3));return new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op||1}));},
 ball(r,col,seg){return new THREE.Mesh(new THREE.SphereGeometry(r,seg||32,Math.round((seg||32)/2)),new THREE.MeshBasicMaterial({color:col,transparent:true}));},
 lit(r,col,seg){return new THREE.Mesh(new THREE.SphereGeometry(r,seg||40,Math.round((seg||40)/2)),new THREE.MeshStandardMaterial({color:col,roughness:.8,metalness:0}));},
 upd(o){o.geometry.attributes.position.needsUpdate=true;if(o.geometry.attributes.color)o.geometry.attributes.color.needsUpdate=true;},
 fib(n){const a=[];for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),th=i*2.39996;a.push(r*Math.cos(th),y,r*Math.sin(th));}return a;}
};
let R=null,scene,cam,ctl,obj=null,box=null,raf=0,t0=performance.now();const curBy={};
function init(){
 R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
 scene=new THREE.Scene();cam=new THREE.PerspectiveCamera(45,1,.1,400);
 scene.add(new THREE.AmbientLight(0xffffff,.35));const dl=new THREE.PointLight(0xffffff,1.4,0,0);dl.position.set(0,0,0);scene.add(dl);
 if(THREE.OrbitControls){ctl=new THREE.OrbitControls(cam,R.domElement);ctl.enableDamping=true;ctl.minDistance=3;ctl.maxDistance=120;}
 R.domElement.style.cssText='display:block;width:100%;height:100%;cursor:grab';
 new ResizeObserver(fit).observe(R.domElement);
}
function fit(){if(!box)return;const w=box.clientWidth,h=box.clientHeight;if(w&&h){R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}}
function dispose(o){o.traverse(m=>{m.geometry&&m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());});}
function pick(cfg,i){if(obj){scene.remove(obj.G);dispose(obj.G);}obj=cfg.items[i].build(H);scene.add(obj.G);cam.position.set(...obj.cam);if(ctl){ctl.target.set(...obj.tg);ctl.update();}else cam.lookAt(...obj.tg);t0=performance.now();}
function loop(){raf=0;if(!box||!box.isConnected)return;const t=(performance.now()-t0)/1000;obj&&obj.u(t);ctl&&ctl.update();R.render(scene,cam);raf=requestAnimationFrame(loop);}
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const HINT={uz:"Sichqoncha bilan aylantiring, g'ildirakcha bilan yaqinlashtiring",ru:"Вращайте мышью, приближайте колёсиком",en:"Drag to rotate, scroll to zoom"};
const DEF={uz:"3D ko'rgazma",ru:"3D-демонстрация",en:"3D demonstration"};
window.ILM3D={H,reg:{},add(ico,cfg){this.reg[ico]=cfg;}};
const tx=(o,l)=>o==null?'':(typeof o==='string'?o:(o[l]||o.uz));
window.ILMIY_HOOK=function(T,l,art){
 const cfg=window.ILM3D.reg[T.ico];if(!cfg)return;if(!R)init();
 const ci=curBy[T.ico]||0;
 const sec=document.createElement('section');
 sec.innerHTML=`<h4>${esc(tx(cfg.title,l)||DEF[l])}</h4><div class="i3-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${cfg.items.map((x,i)=>`<button class="ilm-btn${i===ci?' on':''}" data-i3="${i}">${esc(tx(x.n,l))}</button>`).join('')}</div>
 <div class="i3-box" style="position:relative;height:clamp(300px,52vh,480px);border-radius:16px;overflow:hidden;border:1px solid rgba(140,170,255,.15);background:radial-gradient(ellipse at 50% 40%,rgba(30,45,110,.45),rgba(3,5,14,.95))"><span style="position:absolute;left:12px;bottom:10px;font-size:12px;opacity:.6;pointer-events:none">${HINT[l]}</span></div>
 <div class="ilm-box i3-info" style="margin-top:12px"></div>${cfg.extra?cfg.extra(l):''}`;
 const hs=art.querySelectorAll('h4');(hs[1]?art.insertBefore(sec,hs[1]):art.appendChild(sec));
 box=sec.querySelector('.i3-box');box.prepend(R.domElement);
 const inf=sec.querySelector('.i3-info');
 const info=i=>{const it=cfg.items[i];inf.innerHTML=cfg.info?cfg.info(l,i):`<div style="font-size:20px;font-weight:800;margin-bottom:8px">${esc(tx(it.n,l))}</div><p style="margin:0">${esc(tx(it.d,l))}</p>`;};
 sec.querySelector('.i3-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-i3]');if(!b)return;const i=+b.dataset.i3;curBy[T.ico]=i;pick(cfg,i);sec.querySelectorAll('[data-i3]').forEach(x=>x.classList.toggle('on',x===b));info(i);});
 pick(cfg,ci);info(ci);requestAnimationFrame(fit);
 if(!raf)raf=requestAnimationFrame(loop);
};
})();
