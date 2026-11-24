/* Sahifa boshidagi skriptlar (ilgari index.html ichida inline edi). Content-Security-Policy inline skriptlarga ruxsat
   bermaydi — shuning uchun alohida faylda. Yuklanish ekrani (#loader) belgilaridan keyin, sinxron ulanadi. */
  /* Yuklanish ekranidagi "yulduzlar oqimi". Iloji bo'lsa alohida oqimda (Web Worker + OffscreenCanvas) chiziladi —
     shunda asosiy oqim sahna va teksturalarni tayyorlayotganda ham animatsiya qotmaydi. Aks holda — asosiy oqimda. */
  (function(){
    var cv=document.getElementById('spWarp'),ld=document.getElementById('loader');if(!cv)return;
    var reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
    var dpr=Math.min(window.devicePixelRatio||1,2);
    // Animatsiya yadrosi — tashqi o'zgaruvchilarga bog'liq emas (Worker ichiga matn sifatida ham uzatiladi)
    function WarpCore(cx,reduce){
      var W=1,H=1,N=420,S=[],sp=reduce?.0015:.009,last=0;
      var COLS=['#ffffff','#9fc4ff','#ffd9a0'],NB=8,B=[],b;for(b=0;b<NB*3;b++)B.push([]);
      function mk(s,far){s.x=(Math.random()-.5)*2;s.y=(Math.random()-.5)*2;s.z=far?1:Math.random();s.pz=s.z;var r=Math.random();s.c=r<.15?1:(r<.24?2:0);return s;}
      for(var i=0;i<N;i++)S.push(mk({},false));
      this.size=function(w,h,d){W=w;H=h;cx.canvas.width=Math.max(1,w*d|0);cx.canvas.height=Math.max(1,h*d|0);cx.setTransform(d,0,0,d,0,0);};
      // Chiziqlar chuqurlik (8 qatlam) va rang bo'yicha guruhlab bir martada chiziladi — 420 o'rniga ~24 chizish chaqiruvi
      this.frame=function(t){
        var dt=last?Math.min(50,t-last)/16.7:1;last=t;
        cx.globalAlpha=1;cx.fillStyle='rgba(3,5,14,.35)';cx.fillRect(0,0,W,H);
        var k=Math.max(W,H)*.5,ox=W/2,oy=H/2,i,j,l;
        for(i=0;i<B.length;i++)B[i].length=0;
        for(i=0;i<N;i++){var s=S[i];s.pz=s.z;s.z-=sp*dt;if(s.z<=.02){mk(s,true);continue;}
          var x=ox+s.x/s.z*k,y=oy+s.y/s.z*k;
          if(x<-50||x>W+50||y<-50||y>H+50){mk(s,true);continue;}
          B[Math.min(NB-1,((1-s.z)*NB)|0)*3+s.c].push(s);}
        for(l=0;l<NB;l++){var d=(l+.5)/NB;cx.globalAlpha=Math.min(1,d*1.4);cx.lineWidth=Math.max(.5,d*2.4);
          for(j=0;j<3;j++){var g=B[l*3+j];if(!g.length)continue;cx.strokeStyle=COLS[j];cx.beginPath();
            for(i=0;i<g.length;i++){var q=g[i];cx.moveTo(ox+q.x/q.pz*k,oy+q.y/q.pz*k);cx.lineTo(ox+q.x/q.z*k,oy+q.y/q.z*k);}
            cx.stroke();}}
        cx.globalAlpha=1;
      };
    }
    function dims(){return [cv.clientWidth||innerWidth,cv.clientHeight||innerHeight];}
    var done=function(){return !ld.isConnected||ld.classList.contains('hidden');};
    var worker=null;
    if(cv.transferControlToOffscreen&&window.Worker&&window.Blob&&window.URL){
      try{
        var src=WarpCore.toString()+';\nvar core=null,stop=false;\n'+
          'var raf=self.requestAnimationFrame?function(f){self.requestAnimationFrame(f);}:function(f){setTimeout(function(){f(performance.now());},16);};\n'+
          'function loop(t){if(stop)return;core.frame(t);raf(loop);}\n'+
          'onmessage=function(e){var m=e.data;if(m.canvas){core=new WarpCore(m.canvas.getContext("2d"),m.reduce);core.size(m.w,m.h,m.dpr);raf(loop);}'+
          'else if(m.size&&core)core.size(m.w,m.h,m.dpr);else if(m.stop){stop=true;close();}};';
        var url=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));
        var off=cv.transferControlToOffscreen(),d0=dims();
        worker=new Worker(url);URL.revokeObjectURL(url);
        worker.postMessage({canvas:off,w:d0[0],h:d0[1],dpr:dpr,reduce:reduce},[off]);
        window.addEventListener('resize',function(){if(worker){var d=dims();worker.postMessage({size:1,w:d[0],h:d[1],dpr:dpr});}});
        new MutationObserver(function(){if(worker&&done()){worker.postMessage({stop:1});worker=null;}}).observe(ld,{attributes:true,attributeFilter:['class']});
        return;
      }catch(e){worker=null;}   // transferControlToOffscreen bir martalik — xato bo'lsa canvas allaqachon band bo'lishi mumkin
    }
    var cx=cv.getContext&&cv.getContext('2d');if(!cx)return;
    var core=new WarpCore(cx,reduce),size=function(){var d=dims();core.size(d[0],d[1],dpr);};
    size();window.addEventListener('resize',size);
    (function fr(t){if(done())return;core.frame(t);requestAnimationFrame(fr);})(performance.now());
  })();
  /* 3D sahnaning WebGL kontekstini skriptlar yuklanayotgan bo'sh vaqtda oldindan yaratish (birinchi yaratish ~1 s
     asosiy oqimni band qiladi). Atributlar three.js (script.js dagi WebGLRenderer) bilan AYNAN bir xil —
     keyin three.js shu kontekstni oladi; natija o'zgarmaydi. Yuklanish ekrani avval chizilib olinadi. */
  (function(){
    var cv=document.getElementById('scene');if(!cv||!cv.getContext||!window.requestAnimationFrame)return;
    requestAnimationFrame(function(){setTimeout(function(){
      try{cv.getContext('webgl2',{alpha:false,depth:true,stencil:true,antialias:true,premultipliedAlpha:true,
        preserveDrawingBuffer:false,powerPreference:'high-performance',failIfMajorPerformanceCaveat:false});}catch(e){}
    },0);});
  })();
  /* Kirish ekranining paydo bo'lish animatsiyasi. #intro bu skriptdan keyin keladi — DOM tayyor bo'lgach ulanadi
     (intro baribir keyinroq, yuklanish tugagach ochiladi). */
  (function(){
    function introFx(){
      var el=document.getElementById('intro');if(!el)return;
      if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      var was=el.classList.contains('hidden');
      function play(){el.classList.remove('intro-play');void el.offsetWidth;el.classList.add('intro-play');}
      if(!was)play();
      new MutationObserver(function(){var h=el.classList.contains('hidden');if(was&&!h)play();was=h;}).observe(el,{attributes:true,attributeFilter:['class']});
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',introFx); else introFx();
  })();
  /* Rasm yuklanmasa: <img data-err="self"> — rasm o'chiriladi, data-err="parent" — ota elementi bilan birga.
     (CSP inline onerror="..." atributlarini bloklaydi — o'rniga bitta umumiy tinglovchi; error hodisasi
     ko'tarilmaydi, shuning uchun capture bosqichida ushlanadi.) */
  document.addEventListener('error',function(e){
    var t=e.target;if(!t||t.tagName!=='IMG'||!t.getAttribute)return;
    var m=t.getAttribute('data-err');if(!m)return;
    if(m==='parent'){if(t.parentNode&&t.parentNode.parentNode)t.parentNode.parentNode.removeChild(t.parentNode);}
    else if(t.parentNode)t.parentNode.removeChild(t);
  },true);
