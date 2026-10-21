/* Birinchi marta kirganlar uchun yo'riqnoma (spotlight tur) */
(function(){
  const KEY='solar_guide_done';
  const L=()=>{ try{ return (typeof LANG!=='undefined'&&LANG)||localStorage.getItem('solar_lang')||'uz'; }catch(e){ return 'uz'; } };
  const UI={
    uz:{next:'Keyingisi',prev:'Orqaga',skip:'O‘tkazish',done:'Boshladik!',help:'Yo‘riqnoma'},
    ru:{next:'Далее',prev:'Назад',skip:'Пропустить',done:'Начнём!',help:'Инструкция'},
    en:{next:'Next',prev:'Back',skip:'Skip',done:'Let’s go!',help:'Guide'}
  };
  const STEPS=[
    {sel:null, ico:'👋',
      t:{uz:'Xush kelibsiz!',ru:'Добро пожаловать!',en:'Welcome aboard!'},
      d:{uz:'Bu — interaktiv 3D Quyosh tizimi. 1 daqiqada asosiy imkoniyatlarni ko‘rsatamiz.',ru:'Это интерактивная 3D Солнечная система. За минуту покажем главное.',en:'This is an interactive 3D Solar System. Here’s a one-minute tour of the essentials.'},
      keys:[
        {k:{uz:'Sudrash',ru:'Перетащить',en:'Drag'},v:{uz:'aylantirish',ru:'вращение',en:'rotate'}},
        {k:{uz:'G‘ildirak / 2 barmoq',ru:'Колёсико / 2 пальца',en:'Wheel / pinch'},v:{uz:'yaqinlashtirish',ru:'масштаб',en:'zoom'}},
        {k:{uz:'Bosish',ru:'Клик',en:'Click'},v:{uz:'obyekt haqida',ru:'об объекте',en:'object info'}}
      ]},
    {sel:'#dock', ico:'🪐',
      t:{uz:'Sayyoralar menyusi',ru:'Меню планет',en:'Planet dock'},
      d:{uz:'Istalgan sayyora nomini bosing — kamera unga uchib boradi va ma’lumot paneli ochiladi.',ru:'Нажмите на название планеты — камера полетит к ней и откроется панель с данными.',en:'Tap any planet name — the camera flies there and an info panel opens.'}},
    {sel:'#toursBtn', ico:'🚀',
      t:{uz:'Sayohatlar va laboratoriya',ru:'Туры и лаборатория',en:'Tours & laboratory'},
      d:{uz:'Ovozli sayohatlar, laboratoriya (jumladan, tarixiy asteroid zarbalari) va o‘quv bo‘limi shu yerda.',ru:'Туры с озвучкой, чёрные дыры, затмения и лаборатория (включая исторические падения астероидов).',en:'Narrated tours, black holes, eclipses and the laboratory — including historic asteroid impacts.'}},
    {sel:'#skyBtn', ico:'🌃',
      t:{uz:'Osmon',ru:'Небо',en:'Sky'},
      d:{uz:'Bugungi osmon, XKS, kosmik ob-havo, meteor yomg‘irlari, raketa uchirilishlari va tutilishlar.',ru:'Небо сегодня, МКС, космическая погода, метеорные потоки, запуски ракет и затмения.',en:'Tonight’s sky, the ISS, space weather, meteor showers, rocket launches and eclipses.'}},
    {sel:'#weatherBtn', ico:'⛅',
      t:{uz:'Ob-havo',ru:'Погода',en:'Weather'},
      d:{uz:'Joylashuvingiz uchun bugungi va 5 kunlik prognoz hamda butun dunyo ob-havo xaritasi.',ru:'Прогноз на сегодня и 5 дней для вашего места и карта погоды мира.',en:'Today and 5-day forecast for your place, plus a world weather map.'}},
    {sel:'#darsBtn', ico:'📖',
      t:{uz:'Darslik',ru:'Учебник',en:'Textbook'},
      d:{uz:'Astronomiya mavzulari alohida ekranda: 3D modellar, grafiklar va izohlar.',ru:'Темы астрономии на отдельном экране: 3D-модели, графики и пояснения.',en:'Astronomy topics on their own screen: 3D models, charts and explanations.'}},
    {sel:'#quizBtn2', ico:'🎓',
      t:{uz:'Bilimingizni sinang',ru:'Проверьте знания',en:'Test yourself'},
      d:{uz:'Klassik test yoki “Sayyorani top” o‘yini.',ru:'Классический тест или игра «Найди планету».',en:'A classic quiz or the “Find the planet” game.'}},
    {sel:'#rtBtn', ico:'📅',
      t:{uz:'Real vaqt',ru:'Реальное время',en:'Real time'},
      d:{uz:'Sayyoralar bugun yoki 1800–2050 yillardagi istalgan sanada qayerda bo‘lganini ko‘ring.',ru:'Где планеты сегодня или в любую дату 1800–2050 гг.',en:'See where the planets are today — or on any date from 1800 to 2050.'}},
    {sel:'#lsBtn', ico:'⚡',
      t:{uz:'Yorug‘lik tezligi',ru:'Скорость света',en:'Speed of light'},
      d:{uz:'Foton bilan birga Quyoshdan sayyoralargacha uching.',ru:'Летите вместе с фотоном от Солнца к планетам.',en:'Ride a photon from the Sun out to the planets.'}},
    {sel:'#seasonsBtn', ico:'🍂',
      t:{uz:'Fasllar',ru:'Времена года',en:'Seasons'},
      d:{uz:'Fasllar nima uchun almashishini o‘q og‘ishi orqali tushuning.',ru:'Почему меняются времена года — через наклон оси.',en:'Why seasons change — explained through axial tilt.'}},
    {sel:'#ubBtn', ico:'🔭',
      t:{uz:'Ulug‘bek rasadxonasi',ru:'Обсерватория Улугбека',en:'Ulugh Beg Observatory'},
      d:{uz:'Tarix va sekstant bilan haqiqiy o‘lchash tajribasi.',ru:'История и измерения на секстанте.',en:'History plus hands-on sextant measurements.'}},
    {sel:'.speed-ctl', ico:'⏱',
      t:{uz:'Vaqt tezligi',ru:'Скорость времени',en:'Time speed'},
      d:{uz:'Harakatni to‘xtating yoki tezlashtiring.',ru:'Остановите или ускорьте движение.',en:'Pause or speed up the orbits.'}},
    {sel:'#langDrop', ico:'🌐',
      t:{uz:'Til',ru:'Язык',en:'Language'},
      d:{uz:'O‘zbek, rus yoki ingliz tili. Rus va ingliz tillarida ovozli hikoya bor.',ru:'Узбекский, русский или английский. На русском и английском есть озвучка.',en:'Uzbek, Russian or English. Russian and English include voice narration.'}},
    {sel:'#resetBtn', ico:'⤢',
      t:{uz:'Umumiy ko‘rinish',ru:'Общий вид',en:'Overview'},
      d:{uz:'Adashib qolsangiz — shu tugma butun tizimga qaytaradi.',ru:'Потерялись? Эта кнопка вернёт к общему виду.',en:'Lost? This button flies you back to the full system.'}},
    {sel:'#guideBtn', ico:'?',
      t:{uz:'Tayyor!',ru:'Готово!',en:'All set!'},
      d:{uz:'Yo‘riqnomani istalgan vaqtda shu tugma orqali qayta ochishingiz mumkin.',ru:'Инструкцию можно открыть снова этой кнопкой.',en:'You can reopen this guide anytime with this button.'}}
  ];
  const tx=o=>o?(o[L()]||o.uz):'';
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  let root,spot,card,i=0,list=[];
  function build(){
    root=document.createElement('div'); root.id='guide';
    root.innerHTML='<div class="gd-shade"></div><div class="gd-spot"></div><div class="gd-card glass" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(root);
    spot=root.querySelector('.gd-spot'); card=root.querySelector('.gd-card');
    card.addEventListener('click',e=>{
      const a=e.target.closest('[data-a]'); if(!a) return;
      const act=a.dataset.a; click(act==='skip'?440:760);
      if(act==='next') go(i+1); else if(act==='prev') go(i-1); else finish();
    });
    window.addEventListener('resize',()=>{ if(root.classList.contains('open')) place(); });
    window.addEventListener('keydown',e=>{
      if(!root.classList.contains('open')) return;
      if(e.key==='Escape') finish(); else if(e.key==='ArrowRight'||e.key==='Enter') go(i+1); else if(e.key==='ArrowLeft') go(i-1);
    });
  }
  const click=f=>{ try{ window.LAB&&window.LAB.click&&window.LAB.click(f); }catch(e){} };
  const visible=s=>{ if(!s) return true; const el=document.querySelector(s); if(!el) return false; const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; };

  function render(){
    const s=list[i], u=UI[L()]||UI.uz, last=i===list.length-1;
    const keys=s.keys?'<div class="gd-keys">'+s.keys.map(k=>`<div class="gd-key"><b>${esc(tx(k.k))}</b><span>${esc(tx(k.v))}</span></div>`).join('')+'</div>':'';
    const dots=list.map((_,j)=>`<span class="${j===i?'on':''}"></span>`).join('');
    card.innerHTML=`<div class="gd-top"><span class="gd-ico">${s.ico}</span><span class="gd-step">${i+1} / ${list.length}</span></div>
      <h3 class="gd-title">${esc(tx(s.t))}</h3><p class="gd-desc">${esc(tx(s.d))}</p>${keys}
      <div class="gd-foot"><div class="gd-dots">${dots}</div><div class="gd-btns">
        ${last?'':`<button class="gd-skip" data-a="skip">${esc(u.skip)}</button>`}
        ${i>0?`<button class="gd-btn gd-ghost" data-a="prev">${esc(u.prev)}</button>`:''}
        <button class="gd-btn" data-a="${last?'done':'next'}">${esc(last?u.done:u.next)} ${last?'':'→'}</button>
      </div></div>`;
    place();
  }
  function place(){
    const s=list[i], W=innerWidth, H=innerHeight, el=s.sel&&document.querySelector(s.sel);
    card.style.visibility='hidden'; card.className='gd-card glass';
    if(!el){
      root.classList.add('center'); spot.style.opacity=0;
      card.style.left=(W-card.offsetWidth)/2+'px'; card.style.top=Math.max(16,(H-card.offsetHeight)/2)+'px';
    }else{
      root.classList.remove('center');
      const r=el.getBoundingClientRect(), p=8;
      Object.assign(spot.style,{left:r.left-p+'px',top:r.top-p+'px',width:r.width+p*2+'px',height:r.height+p*2+'px',opacity:1});
      const cw=card.offsetWidth, ch=card.offsetHeight, g=18;
      let top=r.bottom+p+g, below=true;
      if(top+ch>H-12){ top=r.top-p-g-ch; below=false; }
      top=Math.max(12,Math.min(H-ch-12,top));
      const left=Math.max(12,Math.min(W-cw-12,r.left+r.width/2-cw/2));
      card.style.left=left+'px'; card.style.top=top+'px';
      card.classList.add(below?'below':'above');
      card.style.setProperty('--ax',Math.max(18,Math.min(cw-18,r.left+r.width/2-left))+'px');
    }
    card.style.visibility='';
  }
  function go(n){ if(n<0) return; if(n>=list.length) return finish(); i=n; card.classList.remove('in'); void card.offsetWidth; render(); card.classList.add('in'); }
  function start(){
    if(!root) build();
    list=STEPS.filter(s=>visible(s.sel));
    if(!list.length) return;
    i=0; root.classList.add('open'); render(); card.classList.add('in');
  }
  function finish(){ if(!root) return; root.classList.remove('open'); try{ localStorage.setItem(KEY,'1'); }catch(e){} }

  function addHelpBtn(){
    const reset=document.getElementById('resetBtn'); if(!reset||document.getElementById('guideBtn')) return;
    const b=document.createElement('button'); b.id='guideBtn'; b.className='icon-btn'; b.textContent='?';
    b.title=(UI[L()]||UI.uz).help;
    b.addEventListener('click',()=>{ click(700); start(); });
    reset.parentNode.insertBefore(b,reset);
  }
  function init(){
    addHelpBtn();
    // til: bitta tugma + ochiladigan ro'yxat
    const dr=document.getElementById('langDrop'), tr=document.getElementById('langTrig'), mn=document.getElementById('topLang'), cur=document.getElementById('langCur');
    if(dr&&tr&&mn){
      const upd=()=>{ const a=mn.querySelector('.lang-btn.active'); if(a&&cur) cur.textContent=a.dataset.lang.toUpperCase(); };
      const set=o=>{ dr.classList.toggle('open',o); tr.setAttribute('aria-expanded',o); };
      tr.addEventListener('click',e=>{ e.stopPropagation(); click(700); set(!dr.classList.contains('open')); });
      mn.addEventListener('click',e=>{ if(e.target.closest('.lang-btn')) setTimeout(()=>{ set(false); upd(); },0); });
      document.addEventListener('click',e=>{ if(!dr.contains(e.target)) set(false); });
      document.addEventListener('keydown',e=>{ if(e.key==='Escape') set(false); });
      new MutationObserver(upd).observe(mn,{subtree:true,attributes:true,attributeFilter:['class'],childList:true}); upd();
    }
    const sb=document.getElementById('startBtn');
    if(sb) sb.addEventListener('click',()=>{
      let seen=false; try{ seen=localStorage.getItem(KEY)==='1'; }catch(e){}
      if(!seen) setTimeout(start,4000);   // kinematik kirish (3.5 s) tugagach
    });
  }
  window.SOLAR_GUIDE={start};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
