/* Yulduzning hayot yo'li — tumanlikdan oq mitti / neytron yulduz / qora tuynukkacha */
(function(){
const {register,T,esc,fmt,hiDPI,sstep}=window.LAB;
const TX={ name:{uz:'Yulduzning hayot yo\'li',ru:'Жизнь звезды',en:'Life of a star'},
  sub:{uz:'Massani tanlang va yulduzning tug\'ilishidan o\'limigacha kuzating',ru:'Выберите массу и проследите путь звезды от рождения до гибели',en:'Pick a mass and follow a star from birth to death'},
  mass:{uz:'Massa',ru:'Масса',en:'Mass'}, dur:{uz:'Davomiyligi',ru:'Длительность',en:'Duration'}, rad:{uz:'Radiusi',ru:'Радиус',en:'Radius'},
  temp:{uz:'Harorat',ru:'Температура',en:'Temperature'}, lum:{uz:'Yorqinlik',ru:'Светимость',en:'Luminosity'},
  play:{uz:'▶ Ijro',ru:'▶ Пуск',en:'▶ Play'}, pause:{uz:'⏸ Pauza',ru:'⏸ Пауза',en:'⏸ Pause'},
  hr:{uz:'Gersshprung–Rassel diagrammasi',ru:'Диаграмма Герцшпрунга–Рассела',en:'Hertzsprung–Russell diagram'},
  ms:{uz:'bosh ketma-ketlik',ru:'главная последовательность',en:'main sequence'}, earth:{uz:'Yer orbitasi',ru:'орбита Земли',en:'Earth’s orbit'},
  yr:{uz:'yil',ru:'лет',en:'years'}, mln:{uz:'mln',ru:'млн',en:'million'}, mlrd:{uz:'mlrd',ru:'млрд',en:'billion'}, trl:{uz:'trln',ru:'трлн',en:'trillion'} };
const S={
 neb:{n:{uz:'Molekulyar bulut',ru:'Молекулярное облако',en:'Molecular cloud'},d:{uz:'Sovuq gaz va chang buluti o\'z og\'irligi ostida siqila boshlaydi.',ru:'Холодное облако газа и пыли начинает сжиматься под собственной тяжестью.',en:'A cold cloud of gas and dust begins to collapse under its own gravity.'}},
 pro:{n:{uz:'Protoyulduz',ru:'Протозвезда',en:'Protostar'},d:{uz:'Markaz qiziydi, atrofida chang disk aylanadi, qutblardan gaz oqimlari otiladi. Sayyoralar shu diskdan tug\'iladi.',ru:'Центр разогревается, вокруг вращается пылевой диск, из полюсов бьют струи газа. Из диска рождаются планеты.',en:'The core heats up, a dusty disk spins around it and jets shoot from the poles. Planets form from this disk.'}},
 ms:{n:{uz:'Bosh ketma-ketlik',ru:'Главная последовательность',en:'Main sequence'},d:{uz:'Yadroda vodorod geliyga aylanadi. Yulduz umrining 90% shu bosqichda o\'tadi.',ru:'В ядре водород превращается в гелий. 90% жизни звезды проходит на этой стадии.',en:'Hydrogen fuses into helium in the core. A star spends 90% of its life here.'}},
 rg:{n:{uz:'Qizil gigant',ru:'Красный гигант',en:'Red giant'},d:{uz:'Vodorod tugagach yulduz 100 barobar kengayadi. Quyosh shu bosqichda Merkuriy, Venera va ehtimol Yerni yutadi.',ru:'Когда водород заканчивается, звезда раздувается в 100 раз. Солнце поглотит Меркурий, Венеру и, возможно, Землю.',en:'Once hydrogen runs out the star swells 100-fold. The Sun will swallow Mercury, Venus and probably Earth.'}},
 rsg:{n:{uz:'Qizil o\'ta gigant',ru:'Красный сверхгигант',en:'Red supergiant'},d:{uz:'Massiv yulduz 1000 barobar kengayadi — Betelgeyze kabi. Yadroda temirgacha elementlar hosil bo\'ladi.',ru:'Массивная звезда раздувается в 1000 раз — как Бетельгейзе. В ядре синтезируются элементы вплоть до железа.',en:'A massive star swells 1,000-fold — like Betelgeuse. Its core forges elements all the way up to iron.'}},
 pn:{n:{uz:'Planetar tumanlik',ru:'Планетарная туманность',en:'Planetary nebula'},d:{uz:'Tashqi qatlamlar kosmosga uchib ketadi va rangli qobiq hosil qiladi.',ru:'Внешние слои улетают в космос, образуя светящуюся оболочку.',en:'The outer layers drift into space, forming a glowing shell.'}},
 wd:{n:{uz:'Oq mitti',ru:'Белый карлик',en:'White dwarf'},d:{uz:'Yer kattaligidagi o\'ta zich yadro qoladi va trillion yillar davomida soviydi. Bir choy qoshig\'i moddasi ~5 tonna.',ru:'Остаётся сверхплотное ядро размером с Землю, остывающее триллионы лет. Чайная ложка вещества весит ~5 т.',en:'An Earth-sized, ultra-dense core remains and cools for trillions of years. A teaspoon weighs about 5 tonnes.'}},
 sn:{n:{uz:'O\'ta yangi yulduz',ru:'Сверхновая',en:'Supernova'},d:{uz:'Temir yadro soniyalar ichida qulaydi va yulduz portlaydi — butun galaktikadan yorqinroq porlaydi. Oltin va uran shunday tug\'iladi.',ru:'Железное ядро коллапсирует за секунды, и звезда взрывается ярче целой галактики. Так рождаются золото и уран.',en:'The iron core collapses in seconds and the star explodes, outshining a whole galaxy. Gold and uranium are born this way.'}},
 ns:{n:{uz:'Neytron yulduz (pulsar)',ru:'Нейтронная звезда (пульсар)',en:'Neutron star (pulsar)'},d:{uz:'Diametri ~20 km, lekin massasi Quyoshdan katta. Sekundiga yuzlab marta aylanib, mayoqdek nur taratadi.',ru:'Диаметр ~20 км, но масса больше солнечной. Вращается сотни раз в секунду, светя как маяк.',en:'About 20 km across yet heavier than the Sun. It spins hundreds of times a second, beaming like a lighthouse.'}},
 bh:{n:{uz:'Qora tuynuk',ru:'Чёрная дыра',en:'Black hole'},d:{uz:'Yadro shunchalik siqiladiki, undan hatto yorug\'lik ham chiqolmaydi.',ru:'Ядро сжимается так сильно, что даже свет не может вырваться.',en:'The core collapses so far that not even light can escape.'}},
 fut:{n:{uz:'Kelajak: moviy mitti',ru:'Будущее: голубой карлик',en:'Future: blue dwarf'},d:{uz:'Qizil mittilar shunchalik uzoq yashaydiki, koinotda hali birortasi ham o\'lmagan.',ru:'Красные карлики живут так долго, что во Вселенной ещё ни один не погиб.',en:'Red dwarfs live so long that none has died yet in the entire Universe.'}}
};
// har bir bosqich: [kalit, davomiylik (yil), R (R☉), T (K), L (L☉)]
const TRACK={
 0.2:[['neb',1e6,1e4,20,0],['pro',1e8,1.5,3000,0.05],['ms',1e12,0.25,3200,0.005],['fut',1e11,0.1,8000,0.001]],
 1:  [['neb',1e6,1e4,20,0],['pro',5e7,2,4000,1.5],['ms',1e10,1,5800,1],['rg',1e9,150,3500,2500],['pn',5e4,0.1,100000,1000],['wd',1e12,0.012,25000,0.01]],
 20: [['neb',5e5,1e4,20,0],['pro',1e5,6,20000,1e3],['ms',8e6,7,33000,5e4],['rsg',1e6,900,3600,1.2e5],['sn',0.1,1e5,1e4,5e9],['ns',1e10,1.4e-5,6e5,0.1]],
 40: [['neb',3e5,1e4,20,0],['pro',5e4,10,25000,5e3],['ms',5e6,11,42000,3e5],['rsg',5e5,1500,3500,5e5],['sn',0.1,1e5,1e4,8e9],['bh',1e20,1e-4,0,0]]
};
const MORDER=[0.2,1,20,40];
const MNAME={0.2:{uz:'0,2 M☉ · qizil mitti',ru:'0,2 M☉ · красный карлик',en:'0.2 M☉ · red dwarf'},1:{uz:'1 M☉ · Quyosh',ru:'1 M☉ · Солнце',en:'1 M☉ · the Sun'},20:{uz:'20 M☉ · massiv',ru:'20 M☉ · массивная',en:'20 M☉ · massive'},40:{uz:'40 M☉ · gigant',ru:'40 M☉ · гигант',en:'40 M☉ · giant'}};
function yrs(v){ if(v<1) return '<1 '+T(TX.yr); if(v>=1e12) return fmt(v/1e12,0)+' '+T(TX.trl)+' '+T(TX.yr)+'+'; if(v>=1e9) return fmt(v/1e9,1)+' '+T(TX.mlrd)+' '+T(TX.yr);
  if(v>=1e6) return fmt(v/1e6,1)+' '+T(TX.mln)+' '+T(TX.yr); return fmt(v,0)+' '+T(TX.yr); }
function tColor(K){ if(K<2500) return [255,120,70]; if(K>30000) return [160,190,255]; const t=Math.log(K/2500)/Math.log(12);
  return [255-t*95|0, 150+t*45|0, 90+t*165|0]; }
const rnd=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(7);
const NEB=[...Array(70)].map(()=>({a:rnd()*6.28,r:rnd(),s:0.4+rnd(),c:rnd()}));
function drawStage(x,w,h,st,t,time){
  const cx=w/2, cy=h/2, U=Math.min(w,h), key=st[0];
  x.fillStyle='#02030a'; x.fillRect(0,0,w,h);
  for(let i=0;i<60;i++){ x.fillStyle='rgba(255,255,255,0.35)'; x.fillRect((i*97)%w,(i*57)%h,1,1); }
  const glow=(r,c,a)=>{ const g=x.createRadialGradient(cx,cy,0,cx,cy,r); g.addColorStop(0,`rgba(${c},${a})`); g.addColorStop(1,`rgba(${c},0)`); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r,0,6.283); x.fill(); };
  const disk=(r,col)=>{ const g=x.createRadialGradient(cx-r*0.25,cy-r*0.25,r*0.1,cx,cy,r); g.addColorStop(0,`rgb(${Math.min(255,col[0]+50)},${Math.min(255,col[1]+50)},${Math.min(255,col[2]+50)})`); g.addColorStop(1,`rgb(${col[0]*0.7|0},${col[1]*0.6|0},${col[2]*0.55|0})`); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r,0,6.283); x.fill(); };
  x.globalCompositeOperation='lighter';
  if(key==='neb'){ const k=1-t*0.55; NEB.forEach(p=>{ const a=p.a+time*0.05*p.s, r=p.r*U*0.45*k; const X=cx+Math.cos(a)*r*1.3, Y=cy+Math.sin(a)*r*0.8;
      const g=x.createRadialGradient(X,Y,0,X,Y,U*0.12*p.s); const c=p.c<0.5?'120,90,200':'200,90,130'; g.addColorStop(0,`rgba(${c},0.16)`); g.addColorStop(1,`rgba(${c},0)`); x.fillStyle=g; x.beginPath(); x.arc(X,Y,U*0.12*p.s,0,6.283); x.fill(); });
    glow(U*0.08*(0.3+t),'255,170,120',0.5*t); }
  else if(key==='pro'){ x.save(); x.translate(cx,cy); x.scale(1,0.28); const g=x.createRadialGradient(0,0,U*0.05,0,0,U*0.4); g.addColorStop(0,'rgba(255,170,90,0.7)'); g.addColorStop(0.6,'rgba(150,80,50,0.35)'); g.addColorStop(1,'rgba(80,40,30,0)'); x.fillStyle=g; x.beginPath(); x.arc(0,0,U*0.4,0,6.283); x.fill(); x.restore();
    for(const s of [-1,1]){ const g=x.createLinearGradient(cx,cy,cx,cy+s*U*0.45); g.addColorStop(0,'rgba(150,200,255,0.6)'); g.addColorStop(1,'rgba(150,200,255,0)'); x.fillStyle=g; x.beginPath(); x.moveTo(cx-4,cy); x.lineTo(cx+4,cy); x.lineTo(cx+U*0.03,cy+s*U*0.45); x.lineTo(cx-U*0.03,cy+s*U*0.45); x.fill(); }
    glow(U*0.12,'255,190,120',0.9); }
  else if(key==='ms'||key==='fut'){ const col=tColor(st[3]), r=U*(key==='fut'?0.05:0.12)*Math.min(1.8,Math.max(0.5,Math.pow(st[2],0.3)));
    glow(r*3.2,col.join(','),0.55); x.globalCompositeOperation='source-over'; disk(r,col); }
  else if(key==='rg'||key==='rsg'){ const col=tColor(st[3]), r=U*(0.18+0.18*t)*(key==='rsg'?1.15:1);
    glow(r*1.7,col.join(','),0.35); x.globalCompositeOperation='source-over'; disk(r,col);
    for(let i=0;i<40;i++){ const a=i*2.4+time*0.08, rr=r*Math.sqrt((i*0.618)%1); x.fillStyle='rgba(255,210,150,0.08)'; x.beginPath(); x.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,r*0.18,0,6.283); x.fill(); }
    if(key==='rg'){ x.setLineDash([4,6]); x.strokeStyle='rgba(140,200,255,0.7)'; x.beginPath(); x.arc(cx,cy,U*0.3,0,6.283); x.stroke(); x.setLineDash([]);
      x.fillStyle='#8fc8ff'; x.font='12px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.fillText(T(TX.earth),cx,cy-U*0.3-8); } }
  else if(key==='pn'){ const R=U*(0.12+0.3*t);
    for(const [k,c,a] of [[1,'255,90,120',0.45],[0.72,'90,220,210',0.5],[0.45,'120,170,255',0.35]]){ x.lineWidth=U*0.05*k; x.strokeStyle=`rgba(${c},${a})`; x.beginPath(); x.ellipse(cx,cy,R*k,R*k*0.82,0.4,0,6.283); x.stroke(); }
    glow(U*0.03,'230,240,255',1); }
  else if(key==='wd'){ glow(U*0.06,'200,220,255',0.8); glow(U*0.012,'255,255,255',1); }
  else if(key==='sn'){ const R=U*(0.05+0.5*t); glow(R,'255,240,210',1-t*0.6); glow(R*1.3,'255,140,90',0.5*(1-t));
    for(let i=0;i<120;i++){ const a=i*2.399, rr=R*(0.7+((i*0.37)%0.3)); x.fillStyle='rgba(255,200,150,'+(0.6*(1-t))+')'; x.fillRect(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,2,2); } }
  else if(key==='ns'){ const a=time*3; for(const s of [0,Math.PI]){ const g=x.createLinearGradient(cx,cy,cx+Math.cos(a+s)*U*0.5,cy+Math.sin(a+s)*U*0.5); g.addColorStop(0,'rgba(170,210,255,0.7)'); g.addColorStop(1,'rgba(170,210,255,0)');
      x.fillStyle=g; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.cos(a+s-0.08)*U*0.5,cy+Math.sin(a+s-0.08)*U*0.5); x.lineTo(cx+Math.cos(a+s+0.08)*U*0.5,cy+Math.sin(a+s+0.08)*U*0.5); x.fill(); }
    glow(U*0.05,'180,210,255',0.9); glow(U*0.01,'255,255,255',1); }
  else if(key==='bh'){ x.save(); x.translate(cx,cy); x.scale(1,0.3); const g=x.createRadialGradient(0,0,U*0.07,0,0,U*0.34); g.addColorStop(0,'rgba(255,230,190,0.95)'); g.addColorStop(0.5,'rgba(255,130,50,0.55)'); g.addColorStop(1,'rgba(120,40,10,0)'); x.fillStyle=g; x.beginPath(); x.arc(0,0,U*0.34,0,6.283); x.fill(); x.restore();
    glow(U*0.11,'255,200,140',0.6); x.globalCompositeOperation='source-over'; x.fillStyle='#000'; x.beginPath(); x.arc(cx,cy,U*0.075,0,6.283); x.fill();
    x.globalCompositeOperation='lighter'; x.strokeStyle='rgba(255,220,170,0.8)'; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,U*0.082,0,6.283); x.stroke(); }
  x.globalCompositeOperation='source-over';
}
const STAR_FRAG=`
precision highp float;
uniform vec2 uRes; uniform float uTime,uT,uSize,uW; uniform vec3 uCol;
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y); }
float fbm(vec2 p){ float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<4;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v+a*.5; }
float h31(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float v=0.,a=.5; for(int i=0;i<3;i++){ v+=a*noise3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5; } return v+a*.5; }
vec3 stars(vec2 p){ vec3 c=vec3(0.);
  for(int k=0;k<3;k++){ float sc=34.+float(k)*48.; vec2 g=p*sc+float(k)*13.7; vec2 id=floor(g), f=fract(g)-.5; float r=h21(id+float(k)*7.1);
    if(r>.9){ vec2 o=vec2(h21(id+3.1),h21(id+5.7))-.5; float d=length(f-o*.6); float tw=.65+.35*sin(uTime*(1.+r*3.)+r*40.);
      c+=mix(vec3(.7,.8,1.),vec3(1.,.86,.7),h21(id+9.))*smoothstep(.08,0.,d)*tw*(r-.9)*9.; } }
  return c*.55; }
vec3 starBody(vec2 p, float R, vec3 col, float turb, float cells){
  float r=length(p); vec3 c=vec3(0.);
  if(r<R){ float z=sqrt(R*R-r*r)/R; vec3 n=vec3(p/R,z);
    float a=uTime*.05; n.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*n.xz;
    float g=fbm3(n*cells+vec3(0.,0.,uTime*.15*turb)), g2=fbm3(n*cells*3.2+vec3(uTime*.22*turb));
    float limb=pow(z,.5);
    vec3 hot=mix(col,vec3(1.),.5);
    c=mix(col*.5,hot,smoothstep(.32,.9,g*limb+.1))*(.6+.8*g+.3*g2)*(.35+.9*limb);
    c*=1.-.55*smoothstep(.7,.78,fbm3(n*2.3+11.))*step(.5,turb);
    c=mix(c*vec3(1.,.75,.55),c,smoothstep(0.,.5,z)); }
  float d=max(r-R,0.); vec2 cs=p/max(r,1e-4);
  float rays=.55+.45*fbm(cs*3.5+vec2(r*3.,uTime*.08));
  float glow=exp(-d/(R*.18))*.8+exp(-d/(R*.9))*.35*rays+exp(-d/(R*3.5))*.08;
  c+=col*glow*(r>R?1.:.12);
  return c; }
vec3 pointStar(vec2 p, vec3 col, float sz){ float r=length(p);
  float core=exp(-r/sz)*1.4+exp(-r/(sz*7.))*.3;
  float sp=exp(-abs(p.x)/(sz*.22))*exp(-abs(p.y)/(sz*22.))+exp(-abs(p.y)/(sz*.22))*exp(-abs(p.x)/(sz*22.));
  return col*(core+sp*.45); }
vec3 nebula(vec2 p, float t){
  float k=1.+t*.9; vec2 q=p*k*1.7; float a=uTime*.025+t*.8; q=mat2(cos(a),-sin(a),sin(a),cos(a))*q;
  vec2 w=vec2(fbm(q*1.2+uTime*.02),fbm(q*1.2+5.2-uTime*.02));
  float n=fbm(q*1.5+w*2.2), n2=fbm(q*3.+w*3.+2.);
  float fall=exp(-dot(p,p)*k*k*2.);
  float dens=smoothstep(.36,.9,n)*fall;
  vec3 c=mix(vec3(.32,.16,.62),vec3(1.,.34,.52),n2)*dens*1.6;
  c+=vec3(.3,.55,1.)*smoothstep(.62,.92,n2)*fall*.4;
  c*=1.-.75*smoothstep(.52,.72,fbm(q*2.3-w+7.))*fall;
  float core=exp(-length(p)/(.012+.04*t))*t*t;
  c+=vec3(1.,.72,.5)*core*2.2+vec3(1.,.5,.4)*exp(-length(p)/.12)*t*.25;
  return c; }
vec3 protostar(vec2 p, float t, vec3 col, float R){
  vec3 c=nebula(p*1.25,1.)*.3*(1.-.6*t);
  vec2 d=vec2(p.x,p.y/.26); float r=length(d), ang=atan(d.y,d.x), sp=uTime*.9/(r+.15);
  float sw=fbm(vec2(r*10.,0.)+2.*vec2(cos(ang-sp),sin(ang-sp)));
  float disk=smoothstep(.62,.18,r)*smoothstep(R*1.1,R*2.2,r);
  vec3 dc=mix(vec3(1.,.64,.32),vec3(.55,.22,.12),smoothstep(.08,.5,r))*(.3+1.15*sw)*disk;
  float jy=abs(p.y), jx=abs(p.x+.015*sin(p.y*22.-uTime*4.)*jy*6.);
  float jw=.008+jy*.065;
  float jet=exp(-jx*jx/(jw*jw))*smoothstep(.48,.03,jy)*(.45+.75*fbm(vec2(jx*30.,jy*10.-uTime*2.5)));
  c+=vec3(.5,.75,1.)*jet*(.35+.9*t);
  float front=step(p.y,0.);
  c+=dc*(1.-front)*.7;
  c+=starBody(p,R,col,1.,4.);
  c=c*(1.-disk*front*.85)+dc*front;
  return c; }
vec3 giant(vec2 p, float t, float R, vec3 col, bool earth){
  R*=1.+.018*sin(uTime*1.2);
  vec3 c=starBody(p,R,col,.35,1.35);
  float r=length(p);
  c+=col*.22*exp(-max(r-R,0.)/(R*.5))*fbm(p*4.+uTime*.05);
  if(earth){ float orb=.34;
    float dash=step(.5,fract(atan(p.y,p.x)*26./6.2832));
    c+=vec3(.45,.7,1.)*exp(-pow((r-orb)/.0022,2.))*dash*(r>R?.9:.15);
    float ea=uTime*.35; vec2 ep=orb*vec2(cos(ea),sin(ea));
    float alive=1.-smoothstep(orb-.012,orb+.004,R);
    c+=vec3(.35,.6,1.)*(exp(-length(p-ep)/.0045)*1.5+exp(-length(p-ep)/.02)*.2)*alive; }
  return c; }
vec3 pneb(vec2 p, float t){
  float s=.1+.28*sqrt(t); vec2 q=p/s; float a=.6; q=mat2(cos(a),-sin(a),sin(a),cos(a))*q; q.y*=1.2;
  float r=length(q), ang=atan(q.y,q.x); vec2 cs=vec2(cos(ang),sin(ang));
  float n=fbm(q*2.5+uTime*.04), st=fbm(cs*5.+vec2(r*1.3,uTime*.02));
  float outer=exp(-pow((r-.95-.13*n)/.17,2.)), mid=exp(-pow((r-.6-.1*n)/.2,2.)), inner=exp(-r*r*2.4);
  vec3 c=vec3(1.,.27,.33)*outer*(.45+1.*st)+vec3(.22,.95,.86)*mid*(.4+.85*n)+vec3(.35,.5,1.)*inner*.45;
  c+=vec3(1.,.5,.4)*exp(-pow((r-1.25-.2*st)/.25,2.))*.18;
  c*=1.-.55*smoothstep(.58,.8,fbm(q*7.))*(outer+mid*.5);
  return c*(1.35-.4*t); }
vec3 wdwarf(vec2 p, float t){
  vec3 wc=mix(vec3(.75,.86,1.),vec3(1.,.6,.35),t*.85);
  return pneb(p,1.)*.4*(1.-t)+pointStar(p,wc,.008*(1.-.4*t)); }
vec3 snova(vec2 p, float t){
  float r=length(p), ang=atan(p.y,p.x); vec2 cs=vec2(cos(ang),sin(ang));
  float flash=exp(-t*5.);
  vec3 c=vec3(1.,.95,.86)*exp(-r/(.015+.35*flash))*(.3+3.5*flash);
  float R=.04+.46*pow(t,.6);
  float n=fbm(cs*5.+t*2.), n2=fbm(p*8.+t);
  float shock=exp(-pow((r-R*(.88+.24*n))/(.012+.05*t),2.));
  c+=mix(vec3(1.,.7,.32),vec3(.4,.7,1.),n2)*shock*(1.5-t*.6);
  float fil=smoothstep(.55,.8,fbm(p*6./max(R,.05)+3.))*smoothstep(R,R*.15,r);
  c+=vec3(1.,.35,.25)*fil*(.25+.9*t);
  float Rg=.3*(1.-smoothstep(0.,.05,t));
  if(Rg>.003) c+=starBody(p,Rg,vec3(1.,.5,.3),.35,1.35)*(Rg/.3);
  return c; }
vec3 pulsar(vec2 p, float t){
  float r=length(p); float n=fbm(p*5.+2.);
  vec3 c=vec3(1.,.4,.3)*smoothstep(.5,.8,fbm(p*9.+n*2.))*exp(-r*r*7.)*.65+vec3(.35,.5,1.)*exp(-r*r*14.)*n*.55;
  c+=vec3(.4,.6,1.)*exp(-pow((length(vec2(p.x,p.y/.35))-.05)/.012,2.))*.35;
  float a=uTime*2.4; vec2 dir=normalize(vec2(cos(a),sin(a)*.4));
  float al=dot(p,dir); vec2 pe=p-dir*al; float w=.006+abs(al)*.11;
  c+=vec3(.55,.75,1.)*exp(-dot(pe,pe)/(w*w))*exp(-abs(al)*2.2)*1.8;
  c+=pointStar(p,vec3(.75,.86,1.),.005)*(1.1+.5*sin(uTime*28.));
  return c; }
vec3 bhole(vec2 p, float t){
  float Rs=.055*(.55+.45*smoothstep(0.,.35,t));
  float r=length(p); float ra=max(r,1e-4);
  vec3 c=stars(p*(1.-Rs*Rs*3./max(r*r,Rs*Rs*1.5)))*1.1;
  vec2 d=vec2(p.x,p.y/.2); float dr=length(d), ang=atan(d.y,d.x), sp=uTime*.7/(dr+.05);
  float sw=fbm(vec2(dr*9.,0.)+2.5*vec2(cos(ang-sp),sin(ang-sp)));
  float disk=smoothstep(Rs*2.,Rs*3.,dr)*smoothstep(.62,.2,dr);
  float dop=1.+.65*(-d.x/(dr+1e-3));
  vec3 dc=mix(vec3(1.,.93,.78),vec3(1.,.42,.1),smoothstep(Rs*2.5,.45,dr))*(.3+1.25*sw)*disk*dop;
  float pa=atan(p.y,p.x); float swA=fbm(vec2(r*30.,0.)+2.*vec2(cos(pa-uTime*.5),sin(pa-uTime*.5)));
  float arcW=Rs*(.3+.55*(p.y/ra*.5+.5));
  vec3 ac=vec3(1.,.74,.42)*exp(-pow((r-Rs*2.3)/arcW,2.))*(.35+.95*swA)*(1.+.5*(-p.x/ra))*.95;
  float photon=exp(-pow((r-Rs*1.55)/(Rs*.08),2.))*1.3;
  float shadow=smoothstep(Rs*1.35,Rs*1.5,r);
  float front=step(p.y,0.);
  c=(c+ac+dc*(1.-front))*shadow+vec3(1.,.86,.62)*photon;
  c=c*(1.-disk*front*.9)+dc*front;
  c+=vec3(1.,.6,.3)*exp(-r/.25)*.05;
  return c*smoothstep(0.,.25,t)+snova(p,1.)*.35*(1.-smoothstep(0.,.4,t)); }
vec3 stageCol(vec2 p){
#if STAGE==0
  return nebula(p,uT);
#elif STAGE==1
  return protostar(p,uT,uCol,uSize);
#elif STAGE==3
  return giant(p,uT,uSize,uCol,true);
#elif STAGE==4
  return giant(p,uT,uSize,uCol,false);
#elif STAGE==5
  return pneb(p,uT)+pointStar(p,vec3(.8,.9,1.),.006);
#elif STAGE==6
  return wdwarf(p,uT);
#elif STAGE==7
  return snova(p,uT);
#elif STAGE==8
  return pulsar(p,uT);
#elif STAGE==9
  return bhole(p,uT);
#else
  return starBody(p,uSize,uCol,1.,4.);
#endif
}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 c=stageCol(p);
#if STAGE!=9
  c+=stars(p);
#endif
  c=1.-exp(-c*1.25);
  vec2 uv=gl_FragCoord.xy/uRes; c*=1.-.4*pow(length(uv-.5)*1.25,2.);
  gl_FragColor=vec4(pow(c,vec3(.92))*uW,1.);
}`;
const SID={neb:0,pro:1,ms:2,rg:3,rsg:4,pn:5,wd:6,sn:7,ns:8,bh:9,fut:10};
function stageSize(st,t){ const k=st[0];
  if(k==='ms') return 0.075*Math.min(1.7,Math.max(0.6,Math.pow(st[2],0.3)));
  if(k==='fut') return 0.035+0.012*t; if(k==='rg') return 0.1+0.26*t; if(k==='rsg') return 0.15+0.24*t; if(k==='pro') return 0.045; return 0.1; }
function makeGL(cv){
  try{
    if(!window.THREE) return null;
    const R=new THREE.WebGLRenderer({canvas:cv, antialias:false, powerPreference:'high-performance'}); R.autoClear=false;
    const pr0=Math.min(1,window.devicePixelRatio||1); R.setPixelRatio(pr0);
    const sc=new THREE.Scene(), cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const shared={uRes:{value:new THREE.Vector2(1,1)},uTime:{value:0}};
    const mats={};
    const mat=id=>mats[id]||(mats[id]=new THREE.ShaderMaterial({ defines:{STAGE:id},
      uniforms:{uRes:shared.uRes,uTime:shared.uTime,uT:{value:0},uSize:{value:.1},uW:{value:1},uCol:{value:new THREE.Color()}},
      depthTest:false, depthWrite:false, blending:id>=0?THREE.NoBlending:THREE.NoBlending,
      vertexShader:'void main(){ gl_Position=vec4(position.xy,0.,1.); }', fragmentShader:STAR_FRAG }));
    const matB={};   // ikkinchi (o'tish) qatlami — qo'shiluvchi
    const matAdd=id=>matB[id]||(matB[id]=(()=>{ const m=mat(id).clone(); m.uniforms.uRes=shared.uRes; m.uniforms.uTime=shared.uTime; m.blending=THREE.AdditiveBlending; return m; })());
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2), mat(2)); mesh.frustumCulled=false; sc.add(mesh);
    const warm=m=>{ const o=mesh.material; mesh.material=m; R.compile(sc,cam); mesh.material=o; };
    return {R,sc,cam,mesh,shared,mat,matAdd,warm,warmed:{},v:new THREE.Vector2(),pr:pr0,acc:0,n:0};
  }catch(e){ console.warn('star GL', e); return null; } }
function fade(el){ el.classList.remove('lab-fade'); void el.offsetWidth; el.classList.add('lab-fade'); }
function drawHR(x,w,h,track,i){
  x.fillStyle='rgba(2,3,10,1)'; x.fillRect(0,0,w,h);
  const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
  const px=K=>w-22-cl((Math.log10(Math.max(2000,K))-3.3)/(5.3-3.3),0,1)*(w-44), py=Lm=>h-20-cl((Math.log10(Math.max(1e-4,Lm))+4)/(10.2+4),0,1)*(h-34);
  x.strokeStyle='rgba(140,170,255,0.25)'; x.strokeRect(18,8,w-36,h-24);
  x.strokeStyle='rgba(120,160,255,0.35)'; x.lineWidth=8; x.lineCap='round'; x.beginPath(); x.moveTo(px(3000),py(0.003)); x.lineTo(px(5800),py(1)); x.lineTo(px(40000),py(3e5)); x.stroke(); x.lineWidth=1;
  x.fillStyle='rgba(160,180,230,0.8)'; x.font='10px "Segoe UI",system-ui,sans-serif'; x.fillText(T(TX.ms),px(9000)+6,py(8)+16);
  const pts=track.filter(s=>s[3]>0&&s[4]>0);
  x.strokeStyle='rgba(255,200,120,0.6)'; x.setLineDash([3,4]); x.beginPath(); pts.forEach((s,k)=>{ const X=px(s[3]),Y=py(s[4]); k?x.lineTo(X,Y):x.moveTo(X,Y); }); x.stroke(); x.setLineDash([]);
  const cur=track[i]; if(cur[3]>0&&cur[4]>0){ const X=px(cur[3]),Y=py(cur[4]); x.fillStyle='#fff'; x.beginPath(); x.arc(X,Y,5,0,6.283); x.fill(); x.strokeStyle='#4ea8ff'; x.lineWidth=2; x.beginPath(); x.arc(X,Y,9,0,6.283); x.stroke(); }
  x.fillStyle='rgba(160,180,230,0.7)'; x.fillText('T →',w-40,h-3); x.save(); x.translate(10,h/2); x.rotate(-Math.PI/2); x.fillText('L',0,0); x.restore();
}
register('star',{ ico:'⭐', name:TX.name, sub:TX.sub,
  build(body, lab){
    lab.m=1; lab.pos=0; lab.play=true;
    body.innerHTML=`<div class="lab-row" id="stM" style="margin-top:0">${MORDER.map(m=>`<button class="lab-chip${+m===1?' on':''}" data-m="${m}">${esc(T(MNAME[m]))}</button>`).join('')}</div>
      <div class="lab-grid"><div style="position:relative"><canvas class="lab-cv" id="stCv"></canvas><div class="st-lbl" id="stLbl"></div>
        <div class="lab-row"><button class="lab-chip" id="stPlay">${esc(T(TX.pause))}</button><input type="range" class="lab-range" id="stPos" min="0" max="1000" value="0" style="flex:1" /></div>
        <div class="lab-steps" id="stSteps"></div></div>
      <div><h4 id="stName" style="font-size:20px;margin:0 0 6px"></h4><p class="lab-p" id="stDesc"></p><div class="lab-kv" id="stKv"></div>
        <div class="sec-title" style="margin-top:14px">${esc(T(TX.hr))}</div><canvas class="lab-cv" id="stHr"></canvas></div></div>`;
    const $=id=>body.querySelector('#'+id);
    body.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ lab.m=+b.dataset.m; lab.pos=0; body.querySelectorAll('[data-m]').forEach(q=>q.classList.toggle('on',q===b)); steps(); });
    $('stPlay').onclick=()=>{ lab.play=!lab.play; $('stPlay').textContent=T(lab.play?TX.pause:TX.play); };
    $('stPos').oninput=e=>{ lab.pos=e.target.value/1000*(TRACK[lab.m].length-0.001); lab.play=false; $('stPlay').textContent=T(TX.play); };
    function steps(){ $('stSteps').innerHTML=TRACK[lab.m].map((s,i)=>`<button class="lab-chip" data-i="${i}">${esc(T(S[s[0]].n))}</button>`).join('');
      $('stSteps').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ lab.pos=+b.dataset.i+0.02; }); lab.shown=-1; }
    steps();
    let last=performance.now();
    lab.frame=now=>{ const dt=Math.min(0.05,Math.max(0,(now-last)/1000)); last=now;
      const tr=TRACK[lab.m]; if(lab.play){ lab.pos+=dt/7; if(lab.pos>=tr.length) lab.pos=0; }
      const i=Math.min(tr.length-1,Math.floor(lab.pos)), t=lab.pos-i, st=tr[i];
      const cv=$('stCv'); const w=Math.max(260,cv.parentElement.clientWidth), h=Math.round(w*0.62);
      if(lab.gl===undefined) lab.gl=makeGL(cv);
      const G=lab.gl, lbl=$('stLbl');
      if(G){
        // moslashuvchan o'lcham: sekin kadrlarda ichki piksel zichligi pasayadi (shovqin shaderi piksel soniga bog'liq)
        G.acc+=dt; G.n++; if(G.n>=40){ const av=G.acc/G.n; G.acc=0; G.n=0;
          if(av>0.024 && G.pr>0.5){ G.pr=Math.max(0.5,G.pr-0.15); G.R.setPixelRatio(G.pr); cv._w=0; } }
        if(cv._w!==w){ cv._w=w; cv.style.height=h+'px'; G.R.setSize(w,h,false); G.R.getDrawingBufferSize(G.v); G.shared.uRes.value.copy(G.v); }
        const ni=(i+1)%tr.length, nx=tr[ni], mx=sstep(0.8,1,t);
        G.shared.uTime.value=now/1000;
        const set=(m,s,tt,w)=>{ const c=tColor(s[3]||5800); m.uniforms.uT.value=tt; m.uniforms.uSize.value=stageSize(s,tt); m.uniforms.uW.value=w; m.uniforms.uCol.value.setRGB(c[0]/255,c[1]/255,c[2]/255); };
        const mA=G.mat(SID[st[0]]); set(mA,st,t,1-mx); G.mesh.material=mA; G.R.render(G.sc,G.cam);
        if(mx>0.001){ const mB=G.matAdd(SID[nx[0]]); set(mB,nx,0,mx); G.mesh.material=mB; G.R.render(G.sc,G.cam); }
        // keyingi bosqich shaderini oldindan tayyorlab qo'yish — o'tish paytida qotmasin
        if(t>0.3){ const k=SID[nx[0]]; if(!G.warmed[k]){ G.warmed[k]=1; setTimeout(()=>{ try{ G.warm(G.mat(k)); G.warm(G.matAdd(k)); }catch(e){} },0); } }
        const showE=st[0]==='rg'; if(showE){ lbl.textContent=T(TX.earth); lbl.style.top=(h/2-0.34*h-20)+'px'; }
        lbl.style.opacity=showE?(1-sstep(0.86,1,t))*(1-sstep(0.55,0.75,t)*0.6):0;
      } else {
        if(cv._w!==w){ cv._w=w; cv.style.height=h+'px'; cv._x=hiDPI(cv,w,h); }
        drawStage(cv._x,w,h,st,t,now/1000);
      }
      $('stPos').value=Math.round(lab.pos/tr.length*1000);
      if(lab.shown!==i){ lab.shown=i;
        $('stName').textContent=T(S[st[0]].n); $('stDesc').textContent=T(S[st[0]].d); fade($('stName')); fade($('stDesc')); fade($('stKv'));
        const kv=[[T(TX.dur),yrs(st[1])],[T(TX.rad),st[2]>=1e3?fmt(st[2],0)+' R☉':(st[2]<0.001?(st[0]==='bh'?'~120 km':'~10 km'):fmt(st[2],st[2]<1?3:1)+' R☉')],
          [T(TX.temp),st[3]?fmt(st[3],0)+' K':'—'],[T(TX.lum),st[4]?fmt(st[4],st[4]<1?3:0)+' L☉':'—']];
        $('stKv').innerHTML=kv.map(([k,v])=>`<div><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('');
        $('stSteps').querySelectorAll('[data-i]').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));
        const hr=$('stHr'); const hw=Math.max(240,hr.parentElement.clientWidth), hh=Math.round(hw*0.55); hr.style.height=hh+'px'; drawHR(hiDPI(hr,hw,hh),hw,hh,tr,i); } };
    lab.resetClock=()=>{ last=performance.now(); };
  },
  open(){ const lab=this; lab.shown=-1; lab.play=true; lab.resetClock();
    const b=lab.body.querySelector('#stPlay'); if(b) b.textContent=T(TX.pause);
    const tok=lab.tok=(lab.tok||0)+1;                    // eski zanjirlar o'z-o'zidan to'xtaydi
    const loop=now=>{ if(!lab.isOpen || lab.tok!==tok) return; try{ lab.frame(now); }catch(e){ console.error('star lab', e); } requestAnimationFrame(loop); };
    requestAnimationFrame(loop); }
});
})();
