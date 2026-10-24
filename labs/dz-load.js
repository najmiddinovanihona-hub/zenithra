/* Darslik fayllarini sahifa ochilgandan keyin, fonda ketma-ket yuklaydi (asosiy 3D sahifa tezroq ochilishi uchun).
   Darslik yoki test tugmasi bosilsa — darhol yuklashni boshlaydi. */
(function(){
const FILES=["labs/dz-t01.js?v=5",
 "labs/dz-t02.js?v=3",
 "labs/dz-t03.js?v=2",
 "labs/dz-t04.js?v=2",
 "labs/dz-t05.js?v=2",
 "labs/dz-t06.js?v=3",
 "labs/dz-t07d.js?v=1",
 "labs/dz-t07.js?v=3",
 "labs/dz-t08d.js?v=1",
 "labs/dz-t08.js?v=2",
 "labs/dz-t09d.js?v=1",
 "labs/dz-t09.js?v=2",
 "labs/dz-t10.js?v=3",
 "labs/dz-t11d.js?v=1",
 "labs/dz-t11.js?v=2",
 "labs/dz-t12.js?v=2",
 "labs/dz-t13.js?v=2",
 "labs/dz-t14.js?v=2",
 "labs/dz-t15d.js?v=1",
 "labs/dz-t15.js?v=3",
 "labs/dz-t16d.js?v=1",
 "labs/dz-t16.js?v=2",
 "labs/dz-t17.js?v=2",
 "labs/dz-t18.js?v=2",
 "labs/dz-t19.js?v=2",
 "labs/dz-t20.js?v=2",
 "labs/dz-t21.js?v=3",
 "labs/dz-t22.js?v=3",
 "labs/dz-t23d.js?v=1",
 "labs/dz-t23.js?v=2",
 "labs/dz-t24.js?v=2",
 "labs/dz-t25.js?v=2",
 "labs/dz-t26.js?v=2",
 "labs/dz-t27.js?v=2",
 "labs/dz-t28.js?v=3",
 "labs/dz-t29.js?v=2",
 "labs/dz-t30.js?v=2",
 "labs/dz-t31.js?v=2",
 "labs/dz-t32.js?v=2",
 "labs/dz-t33.js?v=4",
 "labs/dz-t34.js?v=3",
 "labs/dz-t35.js?v=3",
 "labs/dz-t36.js?v=4",
 "labs/dz-t37.js?v=3",
 "labs/dz-t38.js?v=3",
 "labs/dz-t39.js?v=3",
 "labs/dz-t40.js?v=3",
 "labs/dz-ilova.js?v=2",
 "labs/dz-formulas.js?v=3",
 "labs/dz-extra.js?v=2",
 "labs/dz-masala.js?v=1",
 "labs/dz-tarix.js?v=1",
 "labs/dz-quizbridge.js?v=1"];
let started=false, done=0; const cbs=[];
function start(){ if(started) return; started=true;
  FILES.forEach(f=>{ const s=document.createElement('script'); s.src=f; s.async=false; s.onload=s.onerror=()=>{ done++; if(done===FILES.length){ window.DZLOAD.ready=true; cbs.splice(0).forEach(c=>{ try{ c(); }catch(e){} }); } }; document.body.appendChild(s); }); }
window.DZLOAD={ now:start, ready:false, progress:()=>done/FILES.length, onReady(c){ if(this.ready) c(); else cbs.push(c); } };
const idle=window.requestIdleCallback||(f=>setTimeout(f,300));
if(document.readyState==='complete') idle(start,{timeout:1500}); else window.addEventListener('load',()=>idle(start,{timeout:1500}));
document.addEventListener('pointerdown',e=>{ if(e.target.closest&&e.target.closest('#darsBtn,#quizBtn2')) start(); },true);
})();
