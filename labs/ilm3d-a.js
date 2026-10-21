// 3D ko'rgazmalar — Yulduzlar, Katta portlash, Qorong'i materiya
(function(){
if(!window.ILM3D)return;const H0=window.ILM3D.H;
H0.label=function(txt,col,sc){const c=document.createElement('canvas'),x=c.getContext('2d');c.width=256;c.height=64;x.font='600 30px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=col||'#fff';x.fillText(txt,128,32);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.set(4*(sc||1),1*(sc||1),1);return s;};
const lerp=(a,b,k)=>a+(b-a)*k,cl=k=>Math.max(0,Math.min(1,k)),sm=k=>{k=cl(k);return k*k*(3-2*k);};
const rnd=n=>{const a=[];for(let i=0;i<n;i++){let x,y,z;do{x=Math.random()*2-1;y=Math.random()*2-1;z=Math.random()*2-1;}while(x*x+y*y+z*z>1);a.push(x,y,z);}return a;};

ILM3D.add('⭐',{title:{uz:"Yulduzlar — 3D ko'rgazma",ru:"Звёзды — 3D-демонстрация",en:"Stars — 3D demonstration"},items:[
 {n:{uz:"Yulduz hayot sikli",ru:"Жизненный цикл звезды",en:"Stellar life cycle"},
  d:{uz:"20 soniyalik siklda: gaz-chang buluti siqiladi → protoyulduz qiziydi → asosiy ketma-ketlikdagi sariq yulduz → qizil gigantga kengayadi → tashqi qobiqlar sayyoraviy tumanlik bo'lib tarqaladi, markazda oq mitti qoladi.",ru:"Цикл 20 секунд: газопылевое облако сжимается → протозвезда разогревается → жёлтая звезда главной последовательности → расширение в красного гиганта → внешние слои уходят планетарной туманностью, в центре остаётся белый карлик.",en:"A 20-second cycle: a gas-and-dust cloud collapses → a protostar heats up → a yellow main-sequence star → it swells into a red giant → its outer layers drift off as a planetary nebula, leaving a white dwarf."},
  build(H){const G=new THREE.Group(),n=2500,u=rnd(n),cloud=H.pts(n,.12,0xc9a0ff),star=H.ball(1,0xffffff,40),shell=H.pts(1200,.12,0x7fe8ff),su=H.fib(1200);
   cloud.geometry.attributes.position.array.set(u);shell.geometry.attributes.position.array.set(su);G.add(cloud,star,shell);
   const cs=[[0,0x000000],[4,0xff6a3d],[6,0xffe7a0],[10,0xffe7a0],[13,0xff5a3a],[15,0xffffff],[20,0xdfe8ff]],c=new H.C(),c2=new H.C();
   return {G,cam:[0,4,16],tg:[0,0,0],u(t){const T=t%20;
    cloud.scale.setScalar(lerp(9,.5,sm(T/5)));cloud.material.opacity=1-sm((T-3.5)/1.5);cloud.rotation.y=T*.15;
    let r=T<4?0.01:T<6?lerp(.3,1,sm((T-4)/2)):T<10?1:T<14?lerp(1,4.2,sm((T-10)/4)):lerp(4.2,.25,sm((T-14)/1.2));star.scale.setScalar(r);
    for(let i=0;i<cs.length-1;i++)if(T>=cs[i][0]&&T<cs[i+1][0]){c.setHex(cs[i][1]);c2.setHex(cs[i+1][1]);c.lerp(c2,(T-cs[i][0])/(cs[i+1][0]-cs[i][0]));break;}
    star.material.color.copy(c);const s=T>=14?lerp(4.2,9,sm((T-14)/6)):0;shell.scale.setScalar(Math.max(.01,s));shell.material.opacity=T>=14?.9*(1-sm((T-17)/3)):0;}};}},
 {n:{uz:"Pulsar",ru:"Пульсар",en:"Pulsar"},
  d:{uz:"Neytron yulduz (~20 km) soniyasiga o'nlab–yuzlab marta aylanadi. Magnit qutblaridan chiqqan nur dastalari aylanish o'qiga qiya bo'lgani uchun mayoqdek aylanadi — Yerga tushganda biz «puls» qayd etamiz.",ru:"Нейтронная звезда (~20 км) делает десятки–сотни оборотов в секунду. Лучи из магнитных полюсов наклонены к оси вращения и вращаются, как маяк — попадая на Землю, они дают «импульсы».",en:"A neutron star (~20 km wide) spins tens to hundreds of times per second. Beams from its magnetic poles are tilted from the spin axis and sweep like a lighthouse — when one crosses Earth we see a 'pulse'."},
  build(H){const G=new THREE.Group(),rot=new THREE.Group(),ns=H.ball(1,0xbfe0ff,32);G.add(rot);rot.add(ns);
   const tilt=new THREE.Group();tilt.rotation.z=.5;rot.add(tilt);
   [1,-1].forEach(s=>{const g=new THREE.ConeGeometry(1.6,12,32,1,true);g.translate(0,-6,0);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x7fd4ff,transparent:true,opacity:.22,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.x=s>0?Math.PI:0;tilt.add(m);});
   for(let k=0;k<8;k++){const l=H.line(80,0xa26bff,.6),p=l.geometry.attributes.position.array,ph=k/8*Math.PI*2;for(let i=0;i<80;i++){const th=.15+i/79*(Math.PI-.3),r=4.5*Math.sin(th)**2;p.set([r*Math.sin(th)*Math.cos(ph),r*Math.cos(th),r*Math.sin(th)*Math.sin(ph)],i*3);}tilt.add(l);}
   const ax=H.line(2,0xffffff,.35);ax.geometry.attributes.position.array.set([0,-7,0,0,7,0]);G.add(ax);
   return {G,cam:[12,4,12],tg:[0,0,0],u(t){rot.rotation.y=t*2.2;}};}},
 {n:{uz:"Spektral sinflar",ru:"Спектральные классы",en:"Spectral classes"},
  d:{uz:"O dan M gacha bo'lgan asosiy ketma-ketlik yulduzlari: issiqroq yulduzlar ko'kish va kattaroq, sovuqlari qizg'ish va kichikroq. O'lchamlar nisbiy (taxminiy), Quyosh — G sinf.",ru:"Звёзды главной последовательности от O до M: горячие — голубоватые и крупнее, холодные — красноватые и меньше. Размеры относительные (приблизительно), Солнце — класс G.",en:"Main-sequence stars from O to M: hotter stars are bluer and larger, cooler ones redder and smaller. Sizes are relative (approximate); the Sun is class G."},
  build(H){const G=new THREE.Group(),D=[['O',3,0x9bb0ff],['B',2.2,0xaabfff],['A',1.5,0xcad7ff],['F',1.2,0xf8f7ff],['G',1,0xffe9a8],['K',.8,0xffc98a],['M',.45,0xff9a5a]];let x=-14;
   D.forEach(d=>{x+=d[1];const b=H.ball(d[1],d[2],40);b.position.x=x;G.add(b);if(window.REALTEX&&window.REALTEX.ok)window.REALTEX.star(b,d[2]);const s=H.label(d[0],'#cfe0ff',1);s.position.set(x,-d[1]-1,0);G.add(s);x+=d[1]+1.1;});
   G.position.x=-(x-14)/2-0.5;return {G,cam:[0,3,22],tg:[0,0,0],u(t){G.rotation.y=Math.sin(t*.3)*.25;}};}}
]});

ILM3D.add('💥',{title:{uz:"Katta portlash — 3D ko'rgazma",ru:"Большой взрыв — 3D-демонстрация",en:"Big Bang — 3D demonstration"},items:[
 {n:{uz:"Koinot vaqt chizig'i",ru:"Временная шкала Вселенной",en:"Timeline of the Universe"},
  d:{uz:"Chapdan o'ngga: Katta portlash → inflyatsiya (keskin kengayish) → relikt nurlanish → «qorong'i asrlar» → birinchi yulduzlar va galaktikalar → bugungi tezlashayotgan kengayish (qorong'i energiya).",ru:"Слева направо: Большой взрыв → инфляция (резкое расширение) → реликтовое излучение → «тёмные века» → первые звёзды и галактики → нынешнее ускоренное расширение (тёмная энергия).",en:"Left to right: Big Bang → inflation (sudden expansion) → background radiation → 'dark ages' → first stars and galaxies → today's accelerating expansion (dark energy)."},
  build(H){const G=new THREE.Group(),NR=70,NP=90,P=H.pts(NR*NP,.1),p=P.geometry.attributes.position.array,c=P.geometry.attributes.color.array,col=new H.C();G.add(P);
   const rad=x=>{const k=x/(NR-1);return k<.06?lerp(.05,2.2,sm(k/.06)):2.2+k*2.2+Math.pow(k,3)*3.2;};let q=0;
   for(let i=0;i<NR;i++){const k=i/(NR-1),r=rad(i);col.setHSL(k<.12?.08:k<.3?.66:.6-.1*k,.8,k<.12?.75:k<.3?.25:.6);for(let j=0;j<NP;j++){const a=j/NP*Math.PI*2+i*.3;p.set([-13+26*k,r*Math.cos(a),r*Math.sin(a)],q*3);c.set([col.r,col.g,col.b],q*3);q++;}}
   const ring=H.line(91,0xffffff,.9);G.add(ring);
   return {G,cam:[2,6,22],tg:[0,0,0],u(t){const i=Math.floor((t*6)%NR),r=rad(i)+.15,rp=ring.geometry.attributes.position.array;for(let j=0;j<=90;j++){const a=j/90*Math.PI*2;rp.set([-13+26*i/(NR-1),r*Math.cos(a),r*Math.sin(a)],j*3);}H.upd(ring);G.rotation.x=t*.1;}};}},
 {n:{uz:"Kengayayotgan fazo",ru:"Расширяющееся пространство",en:"Expanding space"},
  d:{uz:"Galaktikalar fazoda «uchib» ketmaydi — fazoning o'zi kengayadi, shar sirtidagi nuqtalar kabi. Har bir galaktikadan qaraganda boshqalari uzoqlashayotgandek ko'rinadi, uzoqroqlari esa tezroq — bu Xabbl qonuni. Kengaygan sari nur qizil tomonga siljiydi.",ru:"Галактики не «летят» сквозь пространство — расширяется само пространство, как поверхность воздушного шара. Из любой галактики видно, что остальные удаляются, причём дальние — быстрее: это закон Хаббла. С расширением свет краснеет.",en:"Galaxies don't fly through space — space itself expands, like dots on an inflating balloon. From any galaxy the others appear to recede, the farther ones faster — Hubble's law. As space stretches, light shifts toward red."},
  build(H){const G=new THREE.Group(),n=700,P=H.pts(n,.22,0xffffff),w=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),new THREE.MeshBasicMaterial({color:0x4ea8ff,wireframe:true,transparent:true,opacity:.18}));
   P.geometry.attributes.position.array.set(H.fib(n));G.add(P,w);const a=new H.C(0xbfe0ff),b=new H.C(0xff6a4d);
   return {G,cam:[0,4,20],tg:[0,0,0],u(t){const k=(t%10)/10,s=1.5+k*6.5;P.scale.setScalar(s);w.scale.setScalar(s);P.material.color.copy(a).lerp(b,k);G.rotation.y=t*.15;}};}},
 {n:{uz:"Relikt nurlanish xaritasi",ru:"Карта реликтового излучения",en:"Background radiation map"},
  d:{uz:"Butun osmondagi relikt nurlanishning harorat farqlari (taxminiy tasvir). Farq atigi ~0,00001 daraja, lekin aynan shu «dog'lar» keyinchalik galaktikalar va klasterlar urug'iga aylangan.",ru:"Перепады температуры реликтового излучения по всему небу (схематично). Разница всего ~0,00001 градуса, но именно эти «пятна» стали зародышами галактик и скоплений.",en:"Temperature differences of the background radiation across the whole sky (illustrative). They are only ~0.00001 degrees, yet these 'spots' became the seeds of galaxies and clusters."},
  build(H){const g=new THREE.SphereGeometry(5,96,64),pp=g.attributes.position.array,cc=new Float32Array(pp.length),c=new H.C(),cold=new H.C(0x1d3fbf),mid=new H.C(0xf2e6a8),hot=new H.C(0xd2402a);
   const W=[];for(let i=0;i<40;i++)W.push([Math.random()*2-1,Math.random()*2-1,Math.random()*2-1,2+Math.random()*7,Math.random()*6]);
   for(let i=0;i<pp.length;i+=3){const x=pp[i]/5,y=pp[i+1]/5,z=pp[i+2]/5;let v=0;W.forEach(w=>{v+=Math.sin((x*w[0]+y*w[1]+z*w[2])*w[3]+w[4]);});v=v/Math.sqrt(W.length)*.55;
    v<0?c.copy(mid).lerp(cold,Math.min(1,-v)):c.copy(mid).lerp(hot,Math.min(1,v));cc.set([c.r,c.g,c.b],i);}
   g.setAttribute('color',new THREE.BufferAttribute(cc,3));const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true}));const G=new THREE.Group();G.add(m);
   return {G,cam:[0,0,15],tg:[0,0,0],u(t){m.rotation.y=t*.12;}};}}
]});

ILM3D.add('🌑',{title:{uz:"Qorong'i materiya — 3D ko'rgazma",ru:"Тёмная материя — 3D-демонстрация",en:"Dark matter — 3D demonstration"},items:[
 {n:{uz:"Galaktika va qorong'i gala",ru:"Галактика и тёмное гало",en:"Galaxy and dark halo"},
  d:{uz:"Yulduzlar (oq) diskda aylanadi, tashqi yulduzlar ham ichkaridagidek tez harakatlanadi. Buni faqat galaktikani o'rab turgan ko'rinmas qorong'i materiya galasi (binafsha) tushuntira oladi — uning massasi ko'rinadigan moddadan ~5 marta ko'p.",ru:"Звёзды (белые) вращаются в диске, и внешние движутся так же быстро, как внутренние. Объяснить это может только невидимое гало тёмной материи (фиолетовое) — его масса примерно в 5 раз больше видимой.",en:"Stars (white) orbit in the disc, and the outer ones move as fast as the inner ones. Only an invisible dark-matter halo (purple) around the galaxy can explain this — it outweighs visible matter about 5 to 1."},
  build(H){const G=new THREE.Group(),N=5000,P=H.pts(N,.1,0xe6efff),R0=new Float32Array(N),T0=new Float32Array(N);for(let i=0;i<N;i++){R0[i]=.5+Math.pow(Math.random(),.7)*8;T0[i]=Math.random()*6.283;}
   const halo=H.pts(3000,.18,0xa26bff);halo.geometry.attributes.position.array.set(rnd(3000).map(v=>v*14));halo.material.opacity=.35;
   const sh=new THREE.Mesh(new THREE.SphereGeometry(14,32,20),new THREE.MeshBasicMaterial({color:0x6a3cff,transparent:true,opacity:.06,depthWrite:false}));G.add(P,halo,sh,H.ball(.8,0xffe2a0,24));
   return {G,cam:[0,12,26],tg:[0,0,0],u(t){const p=P.geometry.attributes.position.array;for(let i=0;i<N;i++){const r=R0[i],th=T0[i]+1.2/r*t;p.set([r*Math.cos(th),Math.sin(i)*.15,r*Math.sin(th)],i*3);}H.upd(P);halo.rotation.y=t*.03;}};}},
 {n:{uz:"Gravitatsion linzalanish",ru:"Гравитационное линзирование",en:"Gravitational lensing"},
  d:{uz:"Old tomondan o'tayotgan massiv klaster (sariq) orqadagi galaktikalar (ko'k nuqtalar) nurini egadi. To'liq bir chiziqqa tushganda «Eynshteyn halqasi» paydo bo'ladi. Tasvirlar buzilishidan ko'rinmas massa xaritasi tuziladi.",ru:"Массивное скопление (жёлтое), проходя впереди, искривляет свет галактик позади (синие точки). При точном совпадении возникает «кольцо Эйнштейна». По искажениям строят карту невидимой массы.",en:"A massive cluster (yellow) passing in front bends light from galaxies behind it (blue dots). When perfectly aligned an 'Einstein ring' appears. The distortions are used to map invisible mass."},
  build(H){const G=new THREE.Group(),n=60,N=n*n,P=H.pts(N,.16,0x7fd4ff),src=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)src.push(-12+24*i/(n-1)+(Math.random()-.5)*.2,-8+16*j/(n-1)+(Math.random()-.5)*.2);
   const L=H.ball(.7,0xffc861,24);G.add(P,L);
   return {G,cam:[0,0,22],tg:[0,0,0],u(t){const lx=Math.sin(t*.35)*8,ly=Math.sin(t*.23)*1.5,E=2.4,p=P.geometry.attributes.position.array;L.position.set(lx,ly,3);
    for(let k=0;k<N;k++){const dx=src[k*2]-lx,dy=src[k*2+1]-ly,r=Math.hypot(dx,dy)||.001,r2=(r+Math.sqrt(r*r+4*E*E))/2,f=r2/r;p.set([lx+dx*f,ly+dy*f,-4],k*3);}H.upd(P);}};}},
 {n:{uz:"Kosmik to'r",ru:"Космическая паутина",en:"Cosmic web"},
  d:{uz:"Eng katta masshtabda qorong'i materiya iplar va tugunlardan iborat «to'r» hosil qiladi. Galaktikalar shu iplar bo'ylab joylashadi, tugunlarda esa ulkan klasterlar to'planadi; oralig'ida bo'shliqlar qoladi.",ru:"На самых больших масштабах тёмная материя образует «паутину» из нитей и узлов. Галактики располагаются вдоль нитей, в узлах собираются гигантские скопления, между ними — пустоты.",en:"On the largest scales dark matter forms a 'web' of filaments and nodes. Galaxies line the filaments, giant clusters gather at the nodes, and voids lie in between."},
  build(H){const G=new THREE.Group(),K=45,nd=[];for(let i=0;i<K;i++)nd.push([(Math.random()-.5)*24,(Math.random()-.5)*24,(Math.random()-.5)*24]);const a=[];
   nd.forEach((p,i)=>{const s=nd.map((q,j)=>[j,Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])]).filter(x=>x[0]!==i).sort((x,y)=>x[1]-y[1]).slice(0,3);
    s.forEach(([j])=>{if(j<i)return;const q=nd[j];for(let k=0;k<140;k++){const f=Math.random(),sp=.35;a.push(p[0]+(q[0]-p[0])*f+(Math.random()-.5)*sp,p[1]+(q[1]-p[1])*f+(Math.random()-.5)*sp,p[2]+(q[2]-p[2])*f+(Math.random()-.5)*sp);}});
    for(let k=0;k<60;k++){a.push(p[0]+(Math.random()-.5)*1.2,p[1]+(Math.random()-.5)*1.2,p[2]+(Math.random()-.5)*1.2);}});
   const P=H.pts(a.length/3,.09,0xb9a6ff);P.geometry.attributes.position.array.set(a);P.material.opacity=.85;G.add(P);
   return {G,cam:[0,6,34],tg:[0,0,0],u(t){G.rotation.y=t*.06;G.rotation.x=Math.sin(t*.05)*.2;}};}}
]});
})();
