/* Oy fazalari va tutilishlar taqvimi */
(function(){
const {register,T,L,esc,fmt,jd,hiDPI}=window.LAB;
const SYN=29.530588853, NM0=2451550.1;               // o'rtacha sinodik oy; 2000-01-06 yangi oy (JD)
const age=d=>((jd(d)-NM0)%SYN+SYN)%SYN;
const illum=a=>(1-Math.cos(2*Math.PI*a/SYN))/2;
const TX={
  name:{uz:'Oy fazalari va tutilishlar',ru:'Фазы Луны и затмения',en:'Moon phases & eclipses'},
  sub:{uz:'Har kunlik faza, oylik taqvim va yaqin tutilishlar',ru:'Фаза на каждый день, календарь и ближайшие затмения',en:'Daily phase, monthly calendar and upcoming eclipses'},
  ph:{uz:['Yangi oy','O\'sayotgan o\'roq','Birinchi chorak','O\'sayotgan Oy','To\'lin oy','Kamayayotgan Oy','Oxirgi chorak','Kamayayotgan o\'roq'],
      ru:['Новолуние','Растущий серп','Первая четверть','Растущая Луна','Полнолуние','Убывающая Луна','Последняя четверть','Убывающий серп'],
      en:['New Moon','Waxing crescent','First quarter','Waxing gibbous','Full Moon','Waning gibbous','Last quarter','Waning crescent']},
  lit:{uz:'Yoritilgan',ru:'Освещённость',en:'Illuminated'}, age:{uz:'Oy yoshi',ru:'Возраст Луны',en:'Moon age'},
  nf:{uz:'Keyingi to\'lin oy',ru:'Следующее полнолуние',en:'Next full Moon'}, nn:{uz:'Keyingi yangi oy',ru:'Следующее новолуние',en:'Next new Moon'},
  days:{uz:'kun',ru:'сут',en:'days'}, today:{uz:'Bugun',ru:'Сегодня',en:'Today'},
  ecl:{uz:'Yaqin tutilishlar',ru:'Ближайшие затмения',en:'Upcoming eclipses'},
  inD:{uz:'kundan keyin',ru:'дн. осталось',en:'days away'},
  note:{uz:'Fazalar o\'rtacha sinodik oy bo\'yicha hisoblanadi (±1 kun). Tutilish sanalari — NASA katalogidan.',ru:'Фазы рассчитаны по среднему синодическому месяцу (±1 сут). Даты затмений — каталог NASA.',en:'Phases use the mean synodic month (±1 day). Eclipse dates are from the NASA catalog.'},
  wd:{uz:['Du','Se','Ch','Pa','Ju','Sh','Ya'],ru:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],en:['Mo','Tu','We','Th','Fr','Sa','Su']},
  mo:{uz:['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],ru:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],en:['January','February','March','April','May','June','July','August','September','October','November','December']},
  type:{ sT:{uz:'To\'liq Quyosh tutilishi',ru:'Полное солнечное',en:'Total solar'}, sA:{uz:'Halqasimon Quyosh tutilishi',ru:'Кольцеобразное солнечное',en:'Annular solar'},
    sP:{uz:'Qisman Quyosh tutilishi',ru:'Частное солнечное',en:'Partial solar'}, lT:{uz:'To\'liq Oy tutilishi',ru:'Полное лунное',en:'Total lunar'},
    lP:{uz:'Qisman Oy tutilishi',ru:'Частное лунное',en:'Partial lunar'}, lN:{uz:'Yarim soyali Oy tutilishi',ru:'Полутеневое лунное',en:'Penumbral lunar'} }
};
const RG={ ant:{uz:'Antarktida',ru:'Антарктида',en:'Antarctica'}, gis:{uz:'Grenlandiya, Islandiya, Ispaniya',ru:'Гренландия, Исландия, Испания',en:'Greenland, Iceland, Spain'},
  saf:{uz:'Janubiy Amerika, Afrika',ru:'Южная Америка, Африка',en:'South America, Africa'}, nae:{uz:'Ispaniya, Shimoliy Afrika, Misr, Arabiston',ru:'Испания, Сев. Африка, Египет, Аравия',en:'Spain, North Africa, Egypt, Arabia'},
  sas:{uz:'Janubiy Amerika, Ispaniya',ru:'Южная Америка, Испания',en:'South America, Spain'}, anz:{uz:'Avstraliya, Yangi Zelandiya',ru:'Австралия, Новая Зеландия',en:'Australia, New Zealand'},
  eur:{uz:'Shimoliy Afrika, Yevropa, Rossiya',ru:'Сев. Африка, Европа, Россия',en:'North Africa, Europe, Russia'}, saa:{uz:'Janubiy Afrika, Avstraliya',ru:'Южная Африка, Австралия',en:'Southern Africa, Australia'},
  asi:{uz:'Osiyo, Yevropa, Afrika',ru:'Азия, Европа, Африка',en:'Asia, Europe, Africa'}, ame:{uz:'Amerika, Afrika, Yevropa',ru:'Америка, Африка, Европа',en:'Americas, Africa, Europe'},
  aas:{uz:'Osiyo, Avstraliya, Amerika',ru:'Азия, Австралия, Америка',en:'Asia, Australia, Americas'} };
const ECL=[['2026-02-17','sA','ant'],['2026-03-03','lT','aas'],['2026-08-12','sT','gis'],['2026-08-28','lP'],['2027-02-06','sA','saf'],['2027-02-20','lN'],
  ['2027-07-18','lN'],['2027-08-02','sT','nae'],['2027-08-17','lN'],['2028-01-12','lP'],['2028-01-26','sA','sas'],['2028-07-06','lP'],['2028-07-22','sT','anz'],
  ['2028-12-31','lT','asi'],['2029-01-14','sP'],['2029-06-12','sP'],['2029-06-26','lT','ame'],['2029-07-11','sP'],['2029-12-05','sP'],['2029-12-20','lT','asi'],
  ['2030-06-01','sA','eur'],['2030-06-15','lP'],['2030-11-25','sT','saa'],['2030-12-09','lN']];
const eclMap={}; ECL.forEach(e=>{ eclMap[e[0]]=e; });
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const img=new Image(); img.src=(window.PHOTO_BASE||'')+'photos/moon-1.jpg';
// Oy diskini chizish: surat + terminator soyasi (shimoliy yarimshar ko'rinishi)
function drawMoon(x, cx, cy, R, a, photo){
  const phi=2*Math.PI*a/SYN, waxing=phi<Math.PI, c=Math.cos(phi);
  x.save(); x.beginPath(); x.arc(cx,cy,R,0,Math.PI*2); x.clip();
  if(photo && img.complete && img.naturalWidth){ const s=R*2/0.9; x.drawImage(img, cx-s/2, cy-s/2, s, s); }
  else { const g=x.createRadialGradient(cx-R*0.3,cy-R*0.3,R*0.1,cx,cy,R); g.addColorStop(0,'#e8e6df'); g.addColorStop(1,'#9d9a92'); x.fillStyle=g; x.fillRect(cx-R,cy-R,2*R,2*R); }
  x.beginPath();
  if(waxing){ x.moveTo(cx,cy-R); x.arc(cx,cy,R,-Math.PI/2,Math.PI/2,true); for(let i=0;i<=64;i++){ const y=R-2*R*i/64, w=Math.sqrt(Math.max(0,R*R-y*y)); x.lineTo(cx+w*c, cy+y); } }
  else { x.moveTo(cx,cy-R); x.arc(cx,cy,R,-Math.PI/2,Math.PI/2,false); for(let i=0;i<=64;i++){ const y=R-2*R*i/64, w=Math.sqrt(Math.max(0,R*R-y*y)); x.lineTo(cx-w*c, cy+y); } }
  x.closePath();
  if(photo && 'filter' in x) x.filter='blur('+Math.max(1,R*0.012)+'px)';
  x.fillStyle=photo?'rgba(2,3,10,0.9)':'rgba(8,10,22,0.93)'; x.fill(); x.filter='none';
  x.restore();
  if(photo){ const g=x.createRadialGradient(cx,cy,R*0.98,cx,cy,R*1.25); g.addColorStop(0,'rgba(220,225,255,'+(0.1+0.25*illum(a))+')'); g.addColorStop(1,'rgba(220,225,255,0)');
    x.fillStyle=g; x.beginPath(); x.arc(cx,cy,R*1.25,0,Math.PI*2); x.fill(); }
}
register('moon',{ ico:'🌗', name:TX.name, sub:TX.sub,
  build(body, lab){
    lab.date=new Date(); lab.view=new Date(lab.date.getFullYear(), lab.date.getMonth(), 1);
    body.innerHTML=`<div class="lab-grid"><div>
      <canvas class="lab-cv" id="mnCv"></canvas>
      <div class="lab-row"><button class="lab-chip" id="mnPrev">◀</button><input type="date" class="lab-date" id="mnDate" /><button class="lab-chip" id="mnNext">▶</button><button class="lab-chip" id="mnToday">${esc(T(TX.today))}</button></div>
      <div class="lab-kv" id="mnKv"></div></div>
      <div><div class="lab-row" style="justify-content:space-between;margin-top:0"><button class="lab-chip" id="mnMp">‹</button><b id="mnMonth"></b><button class="lab-chip" id="mnMn">›</button></div>
      <div class="lab-cal" id="mnCal"></div>
      <div class="sec-title" style="margin-top:16px">${esc(T(TX.ecl))}</div><div class="lab-list" id="mnEcl"></div>
      <p class="lab-note">${esc(T(TX.note))}</p></div></div>`;
    const $=id=>body.querySelector('#'+id);
    const setDate=d=>{ lab.date=d; lab.view=new Date(d.getFullYear(), d.getMonth(), 1); render(); };
    $('mnPrev').onclick=()=>setDate(new Date(lab.date.getTime()-86400000));
    $('mnNext').onclick=()=>setDate(new Date(lab.date.getTime()+86400000));
    $('mnToday').onclick=()=>setDate(new Date());
    $('mnDate').onchange=e=>{ const v=e.target.value; if(v){ const [y,m,d]=v.split('-').map(Number); setDate(new Date(y,m-1,d,21)); } };
    $('mnMp').onclick=()=>{ lab.view=new Date(lab.view.getFullYear(), lab.view.getMonth()-1, 1); renderCal(); };
    $('mnMn').onclick=()=>{ lab.view=new Date(lab.view.getFullYear(), lab.view.getMonth()+1, 1); renderCal(); };
    function render(){
      const cv=$('mnCv'), w=Math.max(260,cv.parentElement.clientWidth), h=Math.round(w*0.72); cv.style.height=h+'px';
      const x=hiDPI(cv,w,h); x.fillStyle='#02030a'; x.fillRect(0,0,w,h);
      for(let i=0;i<90;i++){ x.fillStyle='rgba(255,255,255,'+(0.2+Math.random()*0.5)+')'; x.fillRect(Math.random()*w,Math.random()*h,1,1); }
      const a=age(lab.date), R=Math.min(w,h)*0.36; drawMoon(x,w/2,h/2,R,a,true);
      const idx=Math.floor(a/SYN*8+0.5)%8;
      x.fillStyle='#e8edff'; x.font='700 18px "Segoe UI",system-ui,sans-serif'; x.textAlign='center'; x.fillText(T(TX.ph)[idx], w/2, h-18);
      $('mnDate').value=ymd(lab.date);
      const toFull=(a<SYN/2?SYN/2-a:SYN*1.5-a), toNew=SYN-a;
      const dd=n=>{ const t=new Date(lab.date.getTime()+n*86400000); return t.getDate()+' '+T(TX.mo)[t.getMonth()].slice(0,3).toLowerCase(); };
      $('mnKv').innerHTML=[[T(TX.lit),Math.round(illum(a)*100)+'%'],[T(TX.age),fmt(a,1)+' '+T(TX.days)],[T(TX.nf),dd(toFull)],[T(TX.nn),dd(toNew)]]
        .map(([k,v])=>`<div><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('');
      renderCal(); renderEcl();
    }
    function renderCal(){
      const y=lab.view.getFullYear(), m=lab.view.getMonth(); $('mnMonth').textContent=T(TX.mo)[m]+' '+y;
      const first=(new Date(y,m,1).getDay()+6)%7, n=new Date(y,m+1,0).getDate(), sel=ymd(lab.date), tod=ymd(new Date());
      let html=T(TX.wd).map(d=>`<div class="wd">${d}</div>`).join('');
      for(let i=0;i<first;i++) html+='<div></div>';
      for(let d=1;d<=n;d++){ const k=ymd(new Date(y,m,d)), e=eclMap[k];
        html+=`<button class="day${k===sel?' on':''}${k===tod?' today':''}${e?' ecl':''}" data-d="${d}" title="${e?esc(T(TX.type[e[1]])):''}"><canvas width="44" height="44"></canvas><span>${d}</span></button>`; }
      const cal=$('mnCal'); cal.innerHTML=html;
      cal.querySelectorAll('.day').forEach(b=>{ const d=+b.dataset.d, dt=new Date(y,m,d,21), cx=b.querySelector('canvas').getContext('2d');
        drawMoon(cx,22,22,17,age(dt),false); b.onclick=()=>{ lab.date=dt; render(); }; });
    }
    function renderEcl(){
      const t0=new Date(lab.date.getFullYear(),lab.date.getMonth(),lab.date.getDate());
      const up=ECL.filter(e=>new Date(e[0]+'T12:00:00')>=t0).slice(0,8);
      $('mnEcl').innerHTML=up.map(e=>{ const dt=new Date(e[0]+'T12:00:00'), dn=Math.round((dt-t0)/86400000);
        return `<div class="it"><span><b>${dt.getDate()} ${esc(T(TX.mo)[dt.getMonth()])} ${dt.getFullYear()}</b> — ${esc(T(TX.type[e[1]]))}${e[2]?`<br><small style="color:var(--text-dim)">${esc(T(RG[e[2]]))}</small>`:''}</span><span style="white-space:nowrap;color:var(--neon)">${dn} ${esc(T(TX.inD))}</span></div>`; }).join('');
    }
    img.onload=render; lab.render=render; render();
  },
  open(){ this.render&&this.render(); }
});
})();
