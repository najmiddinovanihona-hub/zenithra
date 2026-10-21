/* O'QUV QISMI: Sayyorada men · Sayyoralarni qiyoslash · Kosmik missiyalar */
(function(){
const {register,T,L,esc,fmt,hiDPI,click}=window.LAB;
const GROUP={uz:'O‘quv',ru:'Обучение',en:'Learn'};
const IMG=k=>(window.PHOTO_BASE||'')+'photos/'+k+'-1.jpg';
// g m/s², yil (Yer kunlari), quyosh kuni (soat), diametr km, masofa AU, o'rtacha °C, yo'ldosh, massa (Yer=1)
const P={
  sun:    {g:274,  yr:null,  day:609.1, dia:1392700, au:0,     t:5500, m:'—', ms:332950, col:'#ffb347', disc:.95},
  mercury:{g:3.7,  yr:87.97, day:4222.6,dia:4879,    au:0.387, t:167,  m:0,   ms:0.055,  col:'#a9a39b', disc:.95},
  venus:  {g:8.87, yr:224.7, day:2802,  dia:12104,   au:0.723, t:464,  m:0,   ms:0.815,  col:'#e6c27a', disc:.95},
  earth:  {g:9.81, yr:365.25,day:24,    dia:12742,   au:1,     t:15,   m:1,   ms:1,      col:'#4ea8ff', disc:.95},
  moon:   {g:1.62, yr:null,  day:708.7, dia:3474,    au:1,     t:-20,  m:0,   ms:0.0123, col:'#cfcac0', disc:.9},
  mars:   {g:3.71, yr:686.98,day:24.66, dia:6779,    au:1.524, t:-65,  m:2,   ms:0.107,  col:'#d2694a', disc:.95},
  jupiter:{g:24.79,yr:4332.6,day:9.93,  dia:139820,  au:5.204, t:-110, m:95,  ms:317.8,  col:'#d9b38c', disc:.95},
  saturn: {g:10.44,yr:10759, day:10.66, dia:116460,  au:9.58,  t:-140, m:274, ms:95.2,   col:'#e3cf9a', disc:.71},
  uranus: {g:8.87, yr:30687, day:17.24, dia:50724,   au:19.2,  t:-195, m:28,  ms:14.5,   col:'#9fe0e6', disc:.95},
  neptune:{g:11.15,yr:60190, day:16.11, dia:49244,   au:30.07, t:-200, m:16,  ms:17.1,   col:'#4f74e3', disc:.95}
};
const KEYS=Object.keys(P);
const NM={
  uz:{sun:'Quyosh',mercury:'Merkuriy',venus:'Venera',earth:'Yer',moon:'Oy',mars:'Mars',jupiter:'Yupiter',saturn:'Saturn',uranus:'Uran',neptune:'Neptun',pluto:'Pluton',dimorphos:'Dimorf',iss:'Yer orbitasi',l2:'L2 nuqtasi',space:'Yulduzlararo fazo'},
  ru:{sun:'Солнце',mercury:'Меркурий',venus:'Венера',earth:'Земля',moon:'Луна',mars:'Марс',jupiter:'Юпитер',saturn:'Сатурн',uranus:'Уран',neptune:'Нептун',pluto:'Плутон',dimorphos:'Диморф',iss:'Орбита Земли',l2:'Точка L2',space:'Межзвёздное пространство'},
  en:{sun:'Sun',mercury:'Mercury',venus:'Venus',earth:'Earth',moon:'Moon',mars:'Mars',jupiter:'Jupiter',saturn:'Saturn',uranus:'Uranus',neptune:'Neptune',pluto:'Pluto',dimorphos:'Dimorphos',iss:'Earth orbit',l2:'L2 point',space:'Interstellar space'}
};
const nm=k=>(NM[L()]||NM.uz)[k]||k;
const U={
  kg:{uz:'kg',ru:'кг',en:'kg'}, m:{uz:'m',ru:'м',en:'m'}, yr:{uz:'yil',ru:'лет',en:'yrs'}, d:{uz:'kun',ru:'дн.',en:'days'}, h:{uz:'soat',ru:'ч',en:'h'}, km:{uz:'km',ru:'км',en:'km'}, cm:{uz:'sm',ru:'см',en:'cm'}
};
// Kamera: dock tugmasi orqali (asosiy sahnadagi mavjud xatti-harakat)
function focus(key){ const k=key==='moon'?'earth':key; const b=document.querySelector('#dock .dock-item[data-key="'+k+'"]'); if(b){ b.click(); return true; } return false; }
const hasFocus=key=>!!document.querySelector('#dock .dock-item[data-key="'+(key==='moon'?'earth':key)+'"]');
function thumb(k,size){ const z=k==='saturn'?1.45:1.06;
  return `<span class="ed-th" style="width:${size}px;height:${size}px"><img src="${IMG(k)}" alt="" style="transform:scale(${z})" loading="lazy" onerror="this.remove()" /></span>`; }

/* ---------------- 1. SAYYORADA MEN ---------------- */
const W={
  name:{uz:'Sayyorada men',ru:'Я на другой планете',en:'Me on other worlds'},
  sub:{uz:'Boshqa sayyorada vazningiz, yoshingiz va sakrash balandligingiz',ru:'Ваш вес, возраст и высота прыжка на других планетах',en:'Your weight, age and jump height across the Solar System'},
  w:{uz:'Vazningiz',ru:'Ваш вес',en:'Your weight'}, b:{uz:'Tug‘ilgan sana',ru:'Дата рождения',en:'Birthday'},
  weight:{uz:'Tarozida',ru:'На весах',en:'On scales'}, age:{uz:'Yoshingiz',ru:'Возраст',en:'Your age'},
  jump:{uz:'Sakrash',ru:'Прыжок',en:'Jump'}, next:{uz:'Keyingi tug‘ilgan kun',ru:'След. день рождения',en:'Next birthday'},
  in:{uz:'kundan keyin',ru:'дн.',en:'days'}, noYr:{uz:'orbitasi yo‘q',ru:'нет орбиты',en:'no orbit'},
  moonYr:{uz:'Yer bilan bir xil',ru:'как у Земли',en:'same as Earth'},
  fly:{uz:'Sahnada ko‘rish',ru:'Показать в 3D',en:'Show in 3D'},
  note:{uz:'Tarozi kg ko‘rsatadi, lekin aslida og‘irlik kuchini o‘lchaydi: massangiz hamma joyda bir xil, o‘zgaradigan narsa tortishish. Sakrash Yerdagi 50 sm dan hisoblanadi. Quyosh va gaz gigantlarida turib bo‘lmaydi, raqamlar bulutlar yuqori qatlami uchun.',
        ru:'Весы показывают кг, но на деле измеряют силу тяжести: масса везде одна, меняется притяжение. Прыжок — от 50 см на Земле. На Солнце и газовых гигантах стоять нельзя: значения для верхнего слоя облаков.',
        en:'Scales show kg but really measure gravity’s pull: your mass is the same everywhere, only gravity changes. Jump scaled from 50 cm on Earth. You can’t stand on the Sun or gas giants; values are for the cloud tops.'}
};
register('weight',{ ico:'⚖', group:GROUP, name:W.name, sub:W.sub,
  build(body, lab){
    lab.kg=lab.kg||+(localStorage.getItem('edu_kg')||45); lab.bd=lab.bd||localStorage.getItem('edu_bd')||'2012-09-01';
    body.innerHTML=`<div class="ed-form">
      <label class="ed-f"><span>${esc(T(W.w))}</span><span class="ed-in"><input type="range" class="lab-range" id="wKg" min="5" max="150" step="1" value="${lab.kg}" /><b id="wKgV"></b></span></label>
      <label class="ed-f"><span>${esc(T(W.b))}</span><input type="date" class="lab-date" id="wBd" value="${lab.bd}" min="1920-01-01" /></label>
    </div><div class="ed-cards" id="wCards"></div><p class="lab-note">${esc(T(W.note))}</p>`;
    const $=id=>body.querySelector('#'+id);
    $('wKg').oninput=e=>{ lab.kg=+e.target.value; localStorage.setItem('edu_kg',lab.kg); render(); };
    $('wBd').onchange=e=>{ if(e.target.value){ lab.bd=e.target.value; localStorage.setItem('edu_bd',lab.bd); render(); } };
    function render(){
      $('wKgV').textContent=lab.kg+' '+T(U.kg);
      const ageD=Math.max(0,(Date.now()-new Date(lab.bd+'T12:00:00'))/86400000);
      $('wCards').innerHTML=KEYS.map(k=>{ const p=P[k], kg=lab.kg*p.g/9.81, jump=0.5*9.81/p.g;
        let age, nxt='';
        if(k==='moon') age=`<small>${esc(T(W.moonYr))}</small>`;
        else if(!p.yr) age=`<small>${esc(T(W.noYr))}</small>`;
        else { const y=ageD/p.yr, left=Math.round((Math.ceil(y+1e-9)-y)*p.yr);
          age=fmt(y,y<10?2:1)+' <small>'+esc(T(U.yr))+'</small>';
          nxt=`<div class="ed-nx">${esc(T(W.next))}: <b>${fmt(left,0)}</b> ${esc(T(W.in))}</div>`; }
        return `<div class="ed-card${k==='earth'?' home':''}" style="--c:${p.col}">
          <div class="ed-ch">${thumb(k,40)}<b>${esc(nm(k))}</b>${hasFocus(k)?`<button class="ed-go" data-k="${k}" title="${esc(T(W.fly))}">↗</button>`:''}</div>
          <div class="ed-big">${fmt(kg,kg<100?1:0)} <small>${esc(T(U.kg))}</small></div><div class="ed-lb">${esc(T(W.weight))}</div>
          <div class="ed-row"><div><div class="ed-lb">${esc(T(W.age))}</div><div class="ed-v">${age}</div></div>
            <div><div class="ed-lb">${esc(T(W.jump))}</div><div class="ed-v">${jump<0.1?fmt(jump*100,1)+' <small>'+esc(T(U.cm))+'</small>':fmt(jump,jump<10?2:1)+' <small>'+esc(T(U.m))+'</small>'}</div></div></div>
          <div class="ed-bar"><i style="width:${Math.min(100,Math.log10(1+jump*10)/Math.log10(1+3.1*10)*100)}%"></i></div>${nxt}</div>`; }).join('');
      $('wCards').querySelectorAll('.ed-go').forEach(b=>b.onclick=()=>{ window.LAB.closeLab('weight'); focus(b.dataset.k); });
    }
    lab.render=render; render();
  },
  open(){ this.render&&this.render(); }
});

/* ---------------- 2. QIYOSLASH ---------------- */
const C={
  name:{uz:'Sayyoralarni qiyoslash',ru:'Сравнение планет',en:'Compare worlds'},
  sub:{uz:'Ikki jismni haqiqiy o‘lchamda yonma-yon qo‘ying',ru:'Два тела рядом в реальном масштабе',en:'Two bodies side by side, true to scale'},
  swap:{uz:'Almashtirish',ru:'Поменять',en:'Swap'},
  rows:{dia:{uz:'Diametri',ru:'Диаметр',en:'Diameter'}, ms:{uz:'Massasi (Yer = 1)',ru:'Масса (Земля = 1)',en:'Mass (Earth = 1)'},
    g:{uz:'Tortishish',ru:'Тяготение',en:'Gravity'}, day:{uz:'Bir kun',ru:'Сутки',en:'Day length'}, yr:{uz:'Bir yil',ru:'Год',en:'Year'},
    au:{uz:'Quyoshdan (AB)',ru:'От Солнца (а.е.)',en:'From Sun (AU)'}, t:{uz:'O‘rtacha harorat',ru:'Средняя темп.',en:'Mean temp.'}, m:{uz:'Yo‘ldoshlar',ru:'Спутники',en:'Moons'}},
  fit:{uz:'ichiga ≈ {n} ta {a} sig‘adi',ru:'вмещает ≈ {n} тел «{a}»',en:'could hold ≈ {n} × {a}'},
  big:{uz:'{b} {a} dan {x} marta katta',ru:'{b} больше, чем {a}, в {x} раза',en:'{b} is {x}× wider than {a}'},
  same:{uz:'Bir xil jism',ru:'Одно и то же тело',en:'Same body'},
  note:{uz:'Disklar bir xil masshtabda chizilgan. AB — astronomik birlik, Yer va Quyosh orasidagi masofa (149,6 mln km).',ru:'Диски в одном масштабе. а.е. — расстояние Земля–Солнце (149,6 млн км).',en:'Discs are drawn to the same scale. AU = Earth–Sun distance (149.6 million km).'}
};
const fmtV=(k,v)=>{ if(v==null||v==='—') return '—';
  if(k==='dia') return fmt(v,0)+' '+T(U.km);
  if(k==='g') return fmt(v,2)+' m/s²';
  if(k==='day') return v>=72?fmt(v/24,1)+' '+T(U.d):fmt(v,1)+' '+T(U.h);
  if(k==='yr') return v>=730?fmt(v/365.25,1)+' '+T(U.yr):fmt(v,v<100?1:0)+' '+T(U.d);
  if(k==='t') return (v>0?'+':'')+fmt(v,0)+' °C';
  if(k==='ms') return v>=1000?fmt(v,0):fmt(v,v<1?3:1);
  return fmt(v,2); };
register('compare',{ ico:'⇄', group:GROUP, name:C.name, sub:C.sub,
  build(body, lab){
    lab.a=lab.a||'earth'; lab.b=lab.b||'jupiter';
    const opts=s=>KEYS.map(k=>`<option value="${k}"${k===s?' selected':''}>${esc(nm(k))}</option>`).join('');
    body.innerHTML=`<div class="lab-row ed-pick"><select class="lab-date" id="cA">${opts(lab.a)}</select><button class="lab-chip" id="cSw">⇄ ${esc(T(C.swap))}</button><select class="lab-date" id="cB">${opts(lab.b)}</select></div>
      <canvas class="lab-cv" id="cCv"></canvas><div class="ed-fact" id="cFact"></div><div class="ed-tbl" id="cTbl"></div><p class="lab-note">${esc(T(C.note))}</p>`;
    const $=id=>body.querySelector('#'+id), imgs={};
    const im=k=>{ if(!imgs[k]){ imgs[k]=new Image(); imgs[k].onload=()=>draw(); imgs[k].src=IMG(k); } return imgs[k]; };
    $('cA').onchange=e=>{ lab.a=e.target.value; click(760); render(); };
    $('cB').onchange=e=>{ lab.b=e.target.value; click(760); render(); };
    $('cSw').onclick=()=>{ [lab.a,lab.b]=[lab.b,lab.a]; $('cA').value=lab.a; $('cB').value=lab.b; click(700); render(); };
    function disc(x,k,cx,cy,R){
      const p=P[k], I=im(k);
      if(I.complete&&I.naturalWidth){ const s=R*2/p.disc, w=s*I.naturalWidth/I.naturalHeight;
        x.save(); if(k!=='saturn'){ x.beginPath(); x.arc(cx,cy,R,0,Math.PI*2); x.clip(); }
        x.drawImage(I,cx-w/2,cy-s/2,w,s); x.restore(); }
      else { x.fillStyle=p.col; x.beginPath(); x.arc(cx,cy,Math.max(R,1),0,Math.PI*2); x.fill(); }
      if(R<3){ x.fillStyle=p.col; x.beginPath(); x.arc(cx,cy,2,0,Math.PI*2); x.fill(); }
    }
    function draw(){
      const cv=$('cCv'), w=Math.max(280,cv.parentElement.clientWidth), h=Math.round(Math.min(380,Math.max(230,w*0.42))); cv.style.height=h+'px';
      const x=hiDPI(cv,w,h); x.fillStyle='#02030a'; x.fillRect(0,0,w,h);
      let s=7; for(let i=0;i<70;i++){ s=(s*9301+49297)%233280; const r=s/233280; s=(s*9301+49297)%233280; x.fillStyle='rgba(255,255,255,'+(0.15+0.4*(s/233280))+')'; x.fillRect(r*w,(s/233280)*h,1,1); }
      const A=P[lab.a], B=P[lab.b], big=Math.max(A.dia,B.dia), Rmax=Math.min(h*0.36, w*0.2);
      const ra=Rmax*A.dia/big, rb=Rmax*B.dia/big, cy=h*0.46;
      const ringA=lab.a==='saturn'?ra*1.2:ra, ringB=lab.b==='saturn'?rb*1.2:rb;
      const gap=Math.max(30,w*0.06), tot=ringA*2+ringB*2+gap, x0=(w-tot)/2;
      const ca=x0+ringA, cb=x0+ringA*2+gap+ringB;
      disc(x,lab.a,ca,cy,ra); disc(x,lab.b,cb,cy,rb);
      x.textAlign='center'; x.font='700 15px "Segoe UI",system-ui,sans-serif'; x.fillStyle='#e8edff';
      x.fillText(nm(lab.a),ca,h-34); x.fillText(nm(lab.b),cb,h-34);
      x.font='12px "Segoe UI",system-ui,sans-serif'; x.fillStyle='#9aa6cc';
      x.fillText(fmtV('dia',A.dia),ca,h-16); x.fillText(fmtV('dia',B.dia),cb,h-16);
    }
    function render(){
      draw();
      const A=P[lab.a], B=P[lab.b];
      if(lab.a===lab.b) $('cFact').textContent=T(C.same);
      else { const [bk,sk]=A.dia>=B.dia?[lab.a,lab.b]:[lab.b,lab.a], r=P[bk].dia/P[sk].dia, n=Math.pow(r,3);
        $('cFact').innerHTML=esc(T(C.big).replace('{b}',nm(bk)).replace('{a}',nm(sk)).replace('{x}',fmt(r,r<10?1:0)))
          +' · '+esc(nm(bk))+' '+esc(T(C.fit).replace('{n}',fmt(n,n<10?1:0)).replace('{a}',nm(sk))); }
      $('cTbl').innerHTML=`<div class="ed-tr ed-thd"><span></span><span>${thumb(lab.a,22)}${esc(nm(lab.a))}</span><span>${thumb(lab.b,22)}${esc(nm(lab.b))}</span></div>`+
        Object.keys(C.rows).map(k=>{ const va=A[k], vb=B[k], num=typeof va==='number'&&typeof vb==='number';
          let ba=0, bb=0; if(num){ const lg=v=>Math.log10(1+Math.abs(v)); const mx=Math.max(lg(va),lg(vb))||1; ba=lg(va)/mx*100; bb=lg(vb)/mx*100; }
          const bar=(v,p,c)=>`<span class="ed-cell"><b>${esc(fmtV(k,v))}</b>${num?`<i class="ed-mb"><i style="width:${p}%;background:${c}"></i></i>`:''}</span>`;
          return `<div class="ed-tr"><span class="ed-k">${esc(T(C.rows[k]))}</span>${bar(va,ba,A.col)}${bar(vb,bb,B.col)}</div>`; }).join('');
    }
    lab.render=render; render();
  },
  open(){ this.render&&this.render(); }
});

/* ---------------- 3. KOSMIK MISSIYALAR ---------------- */
const M={
  name:{uz:'Kosmik missiyalar',ru:'Космические миссии',en:'Space missions'},
  sub:{uz:'Sputnikdan Jeyms Uebbgacha: insoniyatning koinotga qadamlari',ru:'От Спутника до «Джеймса Уэбба»: шаги человечества в космос',en:'From Sputnik to Webb: humanity’s steps into space'},
  ag:{uz:'Tashkilot',ru:'Агентство',en:'Agency'}, tg:{uz:'Manzil',ru:'Цель',en:'Target'}, yr:{uz:'Uchirilgan',ru:'Запуск',en:'Launched'},
  fly:{uz:'Manzilni 3D da ko‘rish',ru:'Цель в 3D',en:'Show target in 3D'}, all:{uz:'Hammasi',ru:'Все',en:'All'},
  f:{earth:{uz:'Yer',ru:'Земля',en:'Earth'},moon:{uz:'Oy',ru:'Луна',en:'Moon'},inner:{uz:'Ichki sayyoralar',ru:'Внутренние',en:'Inner planets'},outer:{uz:'Uzoq dunyolar',ru:'Дальние миры',en:'Outer worlds'}}
};
const MS=[
  {y:1957,n:'Sputnik-1',p:'mission-sputnik.jpg',cr:'NASA / NSSDC',a:'SSSR / СССР / USSR',t:'earth',g:'earth',
   d:{uz:'Birinchi sun’iy yo‘ldosh. 58 sm li shar 92 kun davomida «bip-bip» signalini yubordi va kosmik asrni boshlab berdi.',ru:'Первый искусственный спутник. Шар диаметром 58 см 92 дня передавал «бип-бип» и открыл космическую эру.',en:'The first artificial satellite. A 58 cm sphere beeped for 92 days and opened the space age.'}},
  {y:1961,n:'Vostok-1',p:'mission-vostok.jpg',cr:'Arto Jousi / Alma Media',a:'SSSR / СССР / USSR',t:'earth',g:'earth',
   d:{uz:'Yuriy Gagarin koinotga chiqqan birinchi inson bo‘ldi: Yer atrofini 108 daqiqada bir marta aylanib chiqdi.',ru:'Юрий Гагарин — первый человек в космосе: один виток вокруг Земли за 108 минут.',en:'Yuri Gagarin became the first human in space, circling Earth once in 108 minutes.'}},
  {y:1969,n:'Apollo 11',p:'mission-apollo11.jpg',cr:'NASA / Neil Armstrong',a:'NASA',t:'moon',g:'moon',
   d:{uz:'Nil Armstrong va Bazz Oldrin Oyga qadam qo‘ygan birinchi insonlar. Ular 21,5 kg Oy jinsini olib qaytdi.',ru:'Нил Армстронг и Базз Олдрин — первые люди на Луне. Они привезли 21,5 кг лунного грунта.',en:'Neil Armstrong and Buzz Aldrin were the first people on the Moon, returning 21.5 kg of lunar rock.'}},
  {y:1970,n:'Venera-7',p:'mission-venera7.jpg',cr:'Emerezhko, CC BY-SA 4.0',a:'SSSR / СССР / USSR',t:'venus',g:'inner',
   d:{uz:'Boshqa sayyoraga yumshoq qo‘nib, yuzadan signal yuborgan birinchi apparat: +475 °C va 90 atmosfera bosimini o‘lchadi.',ru:'Первый аппарат, мягко севший на другую планету и передавший данные с поверхности: +475 °C и 90 атм.',en:'First craft to soft-land on another planet and transmit from the surface: +475 °C and 90 atmospheres.'}},
  {y:1976,n:'Viking 1',p:'mission-viking1.jpg',cr:'NASA / JPL',a:'NASA',t:'mars',g:'inner',
   d:{uz:'Marsda 6 yil ishlagan birinchi uzoq muddatli qo‘nish moduli. Tuproqda hayot izlarini qidirgan.',ru:'Первый долговременный посадочный модуль на Марсе: работал 6 лет и искал признаки жизни в грунте.',en:'The first long-lived Mars lander. It worked for 6 years and searched the soil for signs of life.'}},
  {y:1977,n:'Voyager 1 · 2',p:'mission-voyager.png',cr:'NASA / JPL',a:'NASA',t:'jupiter',g:'outer',
   d:{uz:'Ikki egizak zond Yupiter, Saturn, Uran va Neptunni yaqindan suratga oldi. Voyager 1 2012-yilda yulduzlararo fazoga chiqdi.',ru:'Два зонда-близнеца сняли Юпитер, Сатурн, Уран и Нептун. «Вояджер-1» в 2012 г. вышел в межзвёздное пространство.',en:'Twin probes imaged Jupiter, Saturn, Uranus and Neptune. Voyager 1 reached interstellar space in 2012.'}},
  {y:1990,n:'Hubble',p:'mission-hubble.jpg',cr:'NASA / STS-125',a:'NASA / ESA',t:'earth',g:'earth',
   d:{uz:'Orbitadagi teleskop koinot yoshini (≈13,8 mlrd yil) aniqlashga va qorong‘u energiyani kashf etishga yordam berdi.',ru:'Орбитальный телескоп помог уточнить возраст Вселенной (≈13,8 млрд лет) и открыть тёмную энергию.',en:'The orbiting telescope helped pin down the universe’s age (≈13.8 billion years) and discover dark energy.'}},
  {y:1997,n:'Cassini–Huygens',p:'mission-cassini.jpg',cr:'NASA / JPL',a:'NASA / ESA / ASI',t:'saturn',g:'outer',
   d:{uz:'Saturnni 13 yil o‘rgandi. Huygens moduli 2005-yilda Titanga qo‘ndi: bu tashqi Quyosh tizimidagi birinchi qo‘nish.',ru:'13 лет изучал Сатурн. Зонд «Гюйгенс» в 2005 г. сел на Титан — первая посадка во внешней Солнечной системе.',en:'Studied Saturn for 13 years. Huygens landed on Titan in 2005, the first landing in the outer Solar System.'}},
  {y:1998,n:'XKS / МКС / ISS',p:'mission-iss.jpg',cr:'NASA / STS-132',a:'NASA · Roscosmos · ESA · JAXA · CSA',t:'earth',g:'earth',
   d:{uz:'Xalqaro kosmik stansiya 2000-yildan beri uzluksiz odamli. U Yer atrofini 90 daqiqada aylanadi.',ru:'Международная космическая станция обитаема непрерывно с 2000 года и облетает Землю за 90 минут.',en:'The International Space Station has been continuously crewed since 2000, orbiting Earth every 90 minutes.'}},
  {y:2004,n:'MESSENGER',p:'mission-messenger.jpg',cr:'NASA / JHU APL',a:'NASA',t:'mercury',g:'inner',
   d:{uz:'Merkuriy orbitasiga chiqqan birinchi apparat (2011–2015). Qutb kraterlarining soyasida muz topdi.',ru:'Первый аппарат на орбите Меркурия (2011–2015). Нашёл лёд в затенённых полярных кратерах.',en:'First spacecraft to orbit Mercury (2011–2015). Found ice in shadowed polar craters.'}},
  {y:2006,n:'New Horizons',p:'mission-newhorizons.jpg',cr:'NASA / JHU APL / SwRI',a:'NASA',t:'pluto',g:'outer',
   d:{uz:'9,5 yillik parvozdan so‘ng 2015-yilda Pluton yonidan uchib o‘tdi va uning yurak shaklidagi muz tekisligini suratga oldi.',ru:'После 9,5 лет полёта в 2015 г. пролетел мимо Плутона и снял его ледяное «сердце».',en:'After a 9.5-year cruise it flew past Pluto in 2015 and photographed its heart-shaped ice plain.'}},
  {y:2011,n:'Juno',p:'mission-juno.jpg',cr:'NASA / JPL',a:'NASA',t:'jupiter',g:'outer',
   d:{uz:'2016-yildan beri Yupiterni qutblari ustidan aylanib, uning ichki tuzilishi va kuchli magnit maydonini o‘rganmoqda.',ru:'С 2016 г. облетает Юпитер над полюсами, изучая его недра и мощное магнитное поле.',en:'Orbiting over Jupiter’s poles since 2016, probing its interior and powerful magnetic field.'}},
  {y:2011,n:'Curiosity',p:'mission-curiosity.jpg',cr:'NASA / JPL-Caltech / MSSS',a:'NASA',t:'mars',g:'inner',
   d:{uz:'Avtomobil kattaligidagi marsoxod Geyl kraterida qadimgi ko‘l izlarini topdi: Mars bir paytlar hayot uchun yaroqli bo‘lgan.',ru:'Марсоход размером с автомобиль нашёл в кратере Гейл следы древнего озера: Марс когда-то был пригоден для жизни.',en:'The car-sized rover found an ancient lakebed in Gale Crater: Mars was once habitable.'}},
  {y:2020,n:'Perseverance',p:'mission-perseverance.jpg',cr:'NASA / JPL-Caltech / MSSS',a:'NASA',t:'mars',g:'inner',
   d:{uz:'Marsoxod Yerga qaytarish uchun tosh namunalarini yig‘moqda. Uning Ingenuity vertolyoti boshqa sayyorada birinchi boshqariladigan parvozni amalga oshirdi.',ru:'Марсоход собирает образцы для доставки на Землю; его вертолёт Ingenuity совершил первый управляемый полёт на другой планете.',en:'The rover is caching samples for return to Earth; its Ingenuity helicopter made the first powered flight on another planet.'}},
  {y:2021,n:'James Webb',p:'mission-jwst.png',cr:'NASA',a:'NASA / ESA / CSA',t:'l2',g:'earth',
   d:{uz:'Eng kuchli kosmik teleskop Yerdan 1,5 mln km uzoqlikda turadi va infraqizil nurda ilk galaktikalarni ko‘rmoqda.',ru:'Самый мощный космический телескоп в 1,5 млн км от Земли видит первые галактики в инфракрасном свете.',en:'The most powerful space telescope, 1.5 million km from Earth, sees the first galaxies in infrared.'}},
  {y:2021,n:'DART',p:'impact-dart-1.png',cr:'NASA / JHU APL',a:'NASA',t:'dimorphos',g:'inner',lab:'impacts',
   d:{uz:'Sayyoraviy mudofaa sinovi: zond Dimorf asteroidiga urilib, uning orbital davrini 32 daqiqaga qisqartirdi.',ru:'Испытание планетарной защиты: зонд врезался в астероид Диморф и сократил его период обращения на 32 минуты.',en:'A planetary-defence test: the probe hit asteroid Dimorphos and shortened its orbit by 32 minutes.'}},
  {y:2023,n:'Chandrayaan-3',p:'mission-chandrayaan.png',cr:'ISRO, CC BY 2.0',a:'ISRO',t:'moon',g:'moon',
   d:{uz:'Hindiston Oyning janubiy qutbi yaqiniga qo‘ngan birinchi davlat bo‘ldi. U yerda muz zaxiralari bo‘lishi mumkin.',ru:'Индия первой посадила аппарат у южного полюса Луны, где могут быть запасы льда.',en:'India became the first to land near the Moon’s south pole, where water ice may be stored.'}}
];
const LAB_T={uz:'Laboratoriyada ochish',ru:'Открыть в лаборатории',en:'Open in the lab'};
register('missions',{ ico:'🛰', group:GROUP, name:M.name, sub:M.sub,
  build(body, lab){
    lab.i=lab.i==null?2:lab.i; lab.f=lab.f||'all';
    const fl=['all','earth','moon','inner','outer'];
    body.innerHTML=`<div class="lab-row" id="mF">${fl.map(f=>`<button class="lab-chip" data-f="${f}">${esc(T(f==='all'?M.all:M.f[f]))}</button>`).join('')}</div>
      <div class="ed-tl" id="mTl"></div><div class="lab-grid ed-mgrid"><div class="ed-md" id="mD"></div><div class="lab-list ed-ml" id="mL"></div></div>`;
    const $=id=>body.querySelector('#'+id);
    $('mF').querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ lab.f=b.dataset.f; click(700); const vis=list(); if(!vis.includes(lab.i)) lab.i=vis[0]; render(); });
    const list=()=>MS.map((m,i)=>i).filter(i=>lab.f==='all'||MS[i].g===lab.f);
    function render(){
      $('mF').querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===lab.f));
      const vis=list(), y0=1955, y1=2026;
      $('mTl').innerHTML='<div class="ed-axis"></div>'+[1960,1970,1980,1990,2000,2010,2020].map(y=>`<span class="ed-yr" style="left:${(y-y0)/(y1-y0)*100}%">${y}</span>`).join('')+
        MS.map((m,i)=>`<button class="ed-dot${i===lab.i?' on':''}${vis.includes(i)?'':' off'}" data-i="${i}" style="left:${(m.y+(i%2?0.35:0)-y0)/(y1-y0)*100}%;--c:${(P[m.t]||{col:'#9aa6cc'}).col}" title="${m.y} · ${esc(m.n)}"></button>`).join('');
      $('mTl').querySelectorAll('.ed-dot').forEach(b=>b.onclick=()=>{ lab.i=+b.dataset.i; click(820); render(); });
      $('mL').innerHTML=vis.map(i=>{ const m=MS[i]; return `<button class="it ed-mi${i===lab.i?' on':''}" data-i="${i}"><span class="ed-my">${m.y}</span><span class="ed-mn">${esc(m.n)}</span><span class="ed-mt">${esc(nm(m.t))}</span></button>`; }).join('');
      $('mL').querySelectorAll('.ed-mi').forEach(b=>b.onclick=()=>{ lab.i=+b.dataset.i; click(820); render(); });
      const m=MS[lab.i], ph=P[m.t]?m.t:(m.t==='l2'?'earth':(m.t==='dimorphos'?null:null));
      const canFly=hasFocus(m.t)||(m.t==='pluto'&&hasFocus('pluto'));
      $('mD').innerHTML=`${m.p?`<figure class="ed-mph"><img src="${(window.PHOTO_BASE||'')+'photos/'+m.p}" alt="${esc(m.n)}" onerror="this.parentNode.remove()" /><figcaption>${esc(m.cr)}</figcaption></figure>`:''}<div class="ed-mh">${ph?thumb(ph,84):`<span class="ed-th ed-thx" style="width:84px;height:84px">${m.t==='pluto'?'♇':'☄'}</span>`}
          <div><div class="ed-myr">${m.y}</div><h4 class="ed-mnm">${esc(m.n)}</h4></div></div>
        <p class="lab-p">${esc(T(m.d))}</p>
        <div class="lab-kv"><div><div class="k">${esc(T(M.ag))}</div><div class="v">${esc(m.a)}</div></div><div><div class="k">${esc(T(M.tg))}</div><div class="v">${esc(nm(m.t))}</div></div></div>
        <div class="lab-row">${canFly?`<button class="lab-chip on" id="mGo">↗ ${esc(T(M.fly))}</button>`:''}${m.lab?`<button class="lab-chip" id="mLab">☄ ${esc(T(LAB_T))}</button>`:''}
          <span style="margin-left:auto;display:flex;gap:6px"><button class="lab-chip" id="mPv" aria-label="prev">◀</button><button class="lab-chip" id="mNx" aria-label="next">▶</button></span></div>`;
      const step=d=>{ const k=vis.indexOf(lab.i); lab.i=vis[(k+d+vis.length)%vis.length]; click(780); render(); };
      $('mPv').onclick=()=>step(-1); $('mNx').onclick=()=>step(1);
      if($('mGo')) $('mGo').onclick=()=>{ window.LAB.closeLab('missions'); focus(m.t); };
      if($('mLab')) $('mLab').onclick=()=>window.LAB.openLab(m.lab);
    }
    lab.render=render; render();
  },
  open(){ this.render&&this.render(); }
});
})();
