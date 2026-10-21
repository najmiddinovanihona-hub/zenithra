/* DARSLIK · 29-mavzu (62-§). Galaktikalarning Koinotda taqsimlanishi */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU;
const LV=[[X('Galaktika','Галактика','Galaxy'),.03,X('≈ 30 kpk, ≈200 mlrd yulduz','≈ 30 кпк, ≈200 млрд звёзд','≈ 30 kpc, ≈200 billion stars')],[X('Mahalliy guruh','Местная группа','Local Group'),3,X('≈ 35 galaktika: Galaktikamiz, M31, M33, Magellan bulutlari…','≈ 35 галактик: наша, M31, M33, Магеллановы Облака…','≈ 35 galaxies: ours, M31, M33, the Magellanic Clouds…')],[X('Galaktikalar to‘dasi','Скопление галактик','Galaxy cluster'),8,X('o‘rtacha ≈8 Mpk; ≈4000 ta to‘da ma’lum; Sunbula — 12 Mpk, Veronika Sochlari — 70 Mpk','в среднем ≈8 Мпк; известно ≈4000 скоплений; Дева — 12 Мпк, Волосы Вероники — 70 Мпк','≈8 Mpc on average; ≈4000 known; Virgo at 12 Mpc, Coma at 70 Mpc')],[X('O‘tagalaktika','Сверхскопление','Supercluster'),40,X('o‘rtacha ≈40 Mpk, o‘nlab to‘dalar; ≈50 tasi ro‘yxatda','в среднем ≈40 Мпк, десятки скоплений; в каталогах ≈50','≈40 Mpc, tens of clusters; ≈50 catalogued')],[X('Metagalaktika','Метагалактика','Metagalaxy'),4000,X('Koinotning ko‘rinadigan qismi','наблюдаемая часть Вселенной','the observable Universe')]];
const TX={
 title:X('Galaktikalarning Koinotda taqsimlanishi','Распределение галактик во Вселенной','How galaxies are distributed in the Universe'),
 sub:X('62-§ · Galaktikalarni sanash (Xabbl, 1934), Mahalliy guruh, galaktikalar to‘dalari, o‘tagalaktikalar, Metagalaktika','§62 · Подсчёты галактик (Хаббл, 1934), Местная группа, скопления галактик, сверхскопления, Метагалактика','§62 · Galaxy counts (Hubble, 1934), the Local Group, galaxy clusters, superclusters, the Metagalaxy'),
 intro:X('Galaktikalarning fazoda taqsimlanishi ham yulduzlarning Galaktikada taqsimlanishi kabi o‘rganiladi: osmonning ma’lum sohasidagi (odatda 1 kvadrat gradus) <b>N_m</b> — yulduz kattaligi m va undan yorug‘roq galaktikalar soni sanaladi.','Распределение галактик изучают так же, как распределение звёзд в Галактике: считают <b>N_m</b> — число галактик ярче величины m на определённом участке неба (обычно 1 кв. градус).','Galaxies are studied like stars in the Galaxy: one counts <b>N_m</b>, the number of galaxies brighter than magnitude m in a patch of sky (usually 1 square degree).'),
 s1:X('Galaktikalarni sanash','Подсчёты галактик','Counting galaxies'),
 s1D:X('Bu masalani 1934-yilda <b>E. Xabbl</b> birinchi bo‘lib 2,5 metrli reflektorda osmonning 1283 sohasida 20ᵐ gacha obyektlar tushirilgan suratlarni tahlil qilib yechdi: 1 kv. gradusga 20ᵐ gacha <b>131</b> galaktika to‘g‘ri keladi. Butun osmon sferasi <b>41 253</b> kv. gradus bo‘lgani uchun unda o‘rtacha <b>5,4·10⁶</b> galaktika bor. Eng yirik teleskoplar bilan 24ᵐ gacha ko‘rilsa, butun sferada <b>1,4 mlrd</b> galaktikani kuzatish mumkin (112-rasm).','Впервые эту задачу решил <b>Э. Хаббл</b> в 1934 г., проанализировав снимки 1283 площадок неба, полученные на 2,5-метровом рефлекторе до 20ᵐ: на 1 кв. градус приходится <b>131</b> галактика ярче 20ᵐ. Вся небесная сфера — <b>41 253</b> кв. градуса, значит, на ней в среднем <b>5,4·10⁶</b> галактик. Если крупнейшие телескопы видят до 24ᵐ, на всей сфере можно наблюдать <b>1,4 млрд</b> галактик (рис. 112).','<b>E. Hubble</b> first did this in 1934, analysing plates of 1283 sky fields taken with a 2.5 m reflector down to 20ᵐ: there are <b>131</b> galaxies brighter than 20ᵐ per square degree. With <b>41,253</b> square degrees on the sky, that is about <b>5.4·10⁶</b> galaxies. Reaching 24ᵐ with the largest telescopes, some <b>1.4 billion</b> galaxies could be seen over the whole sky (Fig. 112).'),
 m:X('Chegaraviy kattalik m','Предельная величина m','Limiting magnitude m'), per:X('1 kv. gradusda','На 1 кв. градус','Per square degree'), all:X('Butun osmonda','На всём небе','Whole sky'), cnt:X('N_m ∝ 10^(0,6·m) — bir tekis taqsimotda','N_m ∝ 10^(0,6·m) — при равномерном распределении','N_m ∝ 10^(0.6·m) for a uniform distribution'),
 cntN:X('Kitobdagi ikki nuqta (20ᵐ → 131, 24ᵐ → 1,4 mlrd) orasidagi qiymatlar logarifmik interpolyatsiya bilan hisoblandi.','Значения между двумя точками учебника (20ᵐ → 131, 24ᵐ → 1,4 млрд) получены логарифмической интерполяцией.','Values between the book’s two points (20ᵐ → 131, 24ᵐ → 1.4 billion) are log-interpolated.'),
 s2:X('Mahalliy guruhdan Metagalaktikagacha','От Местной группы до Метагалактики','From the Local Group to the Metagalaxy'),
 s2D:X('Bizning Galaktika Andromeda (M31), Uchburchakdagi M33, Katta va Kichik Magellan bulutlari va boshqa yulduz sistemalari bilan birga (jami ≈<b>35</b> ta) <b>mahalliy galaktik to‘dani</b> hosil qiladi. Bunday to‘dalardan ≈<b>4000</b> tasi ma’lum, o‘rtacha diametri ≈<b>8 Mpk</b>. Yiriklaridan biri — <b>Veronika Sochlari</b>dagi to‘da: bizdan 70 Mpk, osmonda 12° gacha cho‘zilgan. Bizga eng yaqin to‘da — <b>Sunbula</b>da, 12 Mpk da: unda yettita gigant galaktika (biri — «Sunbula A» radiogalaktikasi) va o‘nta spiral galaktika bor. Bir nechta to‘dani o‘z ichiga olgan, o‘zaro dinamik bog‘langan tuzilma — <b>o‘tagalaktika</b>, o‘rtacha diametri ≈<b>40 Mpk</b>; ≈50 tasi ro‘yxatga olingan. O‘tagalaktikalardan iborat Koinotning ko‘rinadigan qismi — <b>Metagalaktika</b>.','Наша Галактика вместе с Андромедой (M31), M33 в Треугольнике, Большим и Малым Магеллановыми Облаками и другими системами (всего ≈<b>35</b>) образует <b>Местное скопление (группу)</b>. Таких групп известно ≈<b>4000</b>, их средний диаметр ≈<b>8 Мпк</b>. Одно из крупных скоплений — в <b>Волосах Вероники</b>: в 70 Мпк от нас, на небе до 12°. Ближайшее к нам скопление — в <b>Деве</b>, в 12 Мпк: в нём семь гигантских галактик (одна — радиогалактика «Дева A») и десять спиральных. Динамически связанная система из нескольких скоплений — <b>сверхскопление</b>, средний диаметр ≈<b>40 Мпк</b>; в каталогах ≈50. Видимая часть Вселенной из сверхскоплений — <b>Метагалактика</b>.','Our Galaxy, with Andromeda (M31), M33 in Triangulum, the Large and Small Magellanic Clouds and other systems (≈<b>35</b> in all), forms the <b>Local Group</b>. About <b>4000</b> such groups are known, ≈<b>8 Mpc</b> across on average. A large one lies in <b>Coma Berenices</b>, 70 Mpc away and up to 12° on the sky. The nearest cluster is in <b>Virgo</b> at 12 Mpc, with seven giant galaxies (one the radio galaxy Virgo A) and ten spirals. A gravitationally bound set of clusters is a <b>supercluster</b>, ≈<b>40 Mpc</b> across; about 50 are catalogued. The observable Universe made of superclusters is the <b>Metagalaxy</b>.'),
 cNote:X('Kitobda Veronika Sochlari to‘dasida «salkam 40 000» galaktika deyilgan; zamonaviy kataloglarda unda bir necha ming a’zo galaktika qayd etilgan.','В учебнике в скоплении Волос Вероники указано «почти 40 000» галактик; в современных каталогах — несколько тысяч членов.','The book gives “almost 40,000” galaxies in the Coma cluster; modern catalogues list a few thousand members.'),
 lvl:X('Daraja','Уровень','Level'), size:X('O‘lchami','Размер','Size'), note:X('Tarkibi','Состав','Content'), mpc:X('Mpk','Мпк','Mpc')
};
const GL=[
 [X('N_m','N_m','N_m'),X('Osmonning 1 kv. gradusida m kattalikkacha bo‘lgan galaktikalar soni.','Число галактик ярче m на 1 кв. градус неба.','Galaxies brighter than m per square degree.')],
 [X('Mahalliy guruh','Местная группа','Local Group'),X('Galaktikamiz, M31, M33, Magellan bulutlari va boshqalar (≈35 galaktika).','Наша Галактика, M31, M33, Магеллановы Облака и др. (≈35 галактик).','Our Galaxy, M31, M33, the Magellanic Clouds and others (≈35 galaxies).')],
 [X('Galaktikalar to‘dasi','Скопление галактик','Galaxy cluster'),X('O‘zaro bog‘langan o‘nlab–minglab galaktikalar (Sunbula, Veronika Sochlari).','Связанная система из десятков–тысяч галактик (Дева, Волосы Вероники).','A bound group of tens to thousands of galaxies (Virgo, Coma).')],
 [X('O‘tagalaktika','Сверхскопление','Supercluster'),X('Bir necha galaktik to‘dani birlashtirgan ≈40 Mpk li tuzilma.','Структура ≈40 Мпк, объединяющая несколько скоплений.','A ≈40 Mpc structure uniting several clusters.')],
 [X('Metagalaktika','Метагалактика','Metagalaxy'),X('O‘tagalaktikalardan iborat Koinotning ko‘rinadigan qismi.','Видимая часть Вселенной, состоящая из сверхскоплений.','The observable Universe, made of superclusters.')]
];
const QA=[
 [X('Bizning Galaktikamiz haqida nima bilasiz?','Что вы знаете о нашей Галактике?','What do you know about our Galaxy?'),X('Spiral galaktika: diametri ≈100 000 y.y., ≈200 mlrd yulduz, Quyosh markazdan ≈33 000 y.y. da; Mahalliy guruh a’zosi.','Спиральная галактика: диаметр ≈100 000 св. лет, ≈200 млрд звёзд, Солнце в ≈33 000 св. лет от центра; член Местной группы.','A spiral ≈100,000 ly across with ≈200 billion stars; the Sun is ≈33,000 ly from the centre; a Local Group member.')],
 [X('Mahalliy guruh tarkibiga yana qanday galaktikalar kiradi?','Какие галактики входят в Местную группу?','Which galaxies are in the Local Group?'),X('Andromeda (M31), Uchburchakdagi M33, Katta va Kichik Magellan bulutlari va boshqalar — jami ≈35 ta.','Андромеда (M31), M33 в Треугольнике, Большое и Малое Магеллановы Облака и др. — всего ≈35.','Andromeda (M31), M33 in Triangulum, the Large and Small Magellanic Clouds and others — ≈35 in all.')],
 [X('O‘tagalaktikalar qanday sistema?','Что такое сверхскопления?','What are superclusters?'),X('Bir necha mahalliy to‘dani o‘z ichiga olgan, dinamik bog‘langan, ≈40 Mpk li tuzilmalar.','Динамически связанные структуры ≈40 Мпк, включающие несколько скоплений.','Bound structures ≈40 Mpc across containing several clusters.')],
 [X('Metagalaktika deganda Koinotning qanday qismi tushuniladi?','Что понимают под Метагалактикой?','What is meant by the Metagalaxy?'),X('O‘tagalaktikalardan tashkil topgan, kuzatish mumkin bo‘lgan qismi.','Наблюдаемую часть Вселенной, состоящую из сверхскоплений.','The observable part of the Universe, made of superclusters.')]
];
const QZ=[
 [X('20ᵐ gacha 1 kv. gradusdagi galaktikalar soni (Xabbl):','Число галактик ярче 20ᵐ на 1 кв. градус (Хаббл):','Galaxies brighter than 20ᵐ per square degree (Hubble):'),[X('131','131','131'),X('13','13','13'),X('1310','1310','1310')]],
 [X('Butun osmon necha kvadrat gradus?','Сколько кв. градусов на всём небе?','How many square degrees on the whole sky?'),[X('41 253','41 253','41,253'),X('360','360','360'),X('129 600','129 600','129,600')]],
 [X('24ᵐ gacha butun osmonda kuzatish mumkin bo‘lgan galaktikalar:','Галактик ярче 24ᵐ на всём небе:','Galaxies to 24ᵐ over the whole sky:'),[X('≈ 1,4 mlrd','≈ 1,4 млрд','≈ 1.4 billion'),X('≈ 5,4 mln','≈ 5,4 млн','≈ 5.4 million'),X('≈ 131','≈ 131','≈ 131')]],
 [X('Mahalliy guruhdagi galaktikalar soni:','Число галактик в Местной группе:','Galaxies in the Local Group:'),[X('≈ 35','≈ 35','≈ 35'),X('≈ 3500','≈ 3500','≈ 3500'),X('≈ 3','≈ 3','≈ 3')]],
 [X('Bizga eng yaqin galaktikalar to‘dasi:','Ближайшее скопление галактик:','The nearest galaxy cluster:'),[X('Sunbula (12 Mpk)','Дева (12 Мпк)','Virgo (12 Mpc)'),X('Veronika Sochlari (70 Mpk)','Волосы Вероники (70 Мпк)','Coma (70 Mpc)'),X('Andromeda','Андромеда','Andromeda')]],
 [X('O‘tagalaktikaning o‘rtacha diametri:','Средний диаметр сверхскопления:','Mean supercluster diameter:'),[X('≈ 40 Mpk','≈ 40 Мпк','≈ 40 Mpc'),X('≈ 4 kpk','≈ 4 кпк','≈ 4 kpc'),X('≈ 4000 Mpk','≈ 4000 Мпк','≈ 4000 Mpc')]]
];
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t29N"></canvas><p class="t1-cap">${T(TX.cntN)}</p></div>
    <div class="t1-side"><label class="t1-ctl"><span>${T(TX.m)}: <b id="t29MV"></b></span><input type="range" class="lab-range" id="t29M" min="14" max="24" step="0.1" value="20"></label><div class="lab-kv" id="t29NKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><p class="t1-cap">${T(TX.cNote)}</p>
    <div class="lab-row" style="margin:0">${chips('lv',LV.map((l,i)=>[i,T(l[0])]))}</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t29Z"></canvas></div><div class="t1-side"><div class="lab-kv" id="t29ZKv"></div></div></div>`)}
  ${sec('03',K.U.gl,K.glHTML(GL))}
  ${sec('04',K.U.qa,K.qaHTML(QA))}
  ${sec('05',K.U.test,`<div class="dz-card t1-quiz" id="t29Quiz"></div>`)}`;

  /* 01 · Sanash */
  const k=Math.log10(1.4e9/(131*41253))/4, N=m=>131*10**(k*(m-20));
  const drawN=K.draw(function(){ const cv=$('#t29N'); const {x,w,h}=fit(cv,.7,300), c=C(), m=+$('#t29M').value, n=N(m);
    x.fillStyle='#02030a'; x.fillRect(0,0,w,h);
    let s=21; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; const show=Math.min(3000,Math.round(n*1.6));
    for(let i=0;i<show;i++){ const px=r()*w, py=r()*h, sz=.6+r()*2.2*Math.max(.15,(24-m)/10); x.fillStyle=`rgba(${220+r()*35|0},${210+r()*30|0},${190+r()*50|0},${.35+r()*.5})`; x.beginPath(); x.ellipse(px,py,sz*1.4,sz*.7,r()*3,0,TAU); x.fill(); }
    x.strokeStyle='rgba(255,210,120,.6)'; x.strokeRect(6,6,w-12,h-12); lbl(x,'1 kv. gradus · m ≤ '+fmtN(m,1),w/2,h-12,'#ffd27a');
    $('#t29MV').textContent=fmtN(m,1)+'ᵐ';
    $('#t29NKv').innerHTML=kv(T(TX.per),fmtN(n,n<10?1:0))+kv(T(TX.all),n*41253<1e9?fmtN(n*41253/1e6,2)+' mln':fmtN(n*41253/1e9,2)+' mlrd',true)+kv('',T(TX.cnt)); });
  $('#t29M').oninput=drawN;

  /* 02 · Ierarxiya */
  let lv=1;
  const drawZ=K.draw(function(){ const cv=$('#t29Z'); const {x,w,h}=fit(cv,.7,320), c=C(), cx=w/2, cy=h/2;
    x.fillStyle='#02030a'; x.fillRect(0,0,w,h); let s=31+lv*7; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
    if(lv===0){ for(let i=0;i<1600;i++){ const arm=i%2, rr=.08+Math.pow(r(),.8)*.9, th=arm*Math.PI+Math.log(rr/.08+1)*2.4+(r()-.5)*.5; x.fillStyle=r()>.5?'rgba(170,200,255,.65)':'rgba(255,230,200,.5)'; x.fillRect(cx+Math.cos(th)*rr*h*.42,cy+Math.sin(th)*rr*h*.42*.6,1.3,1.3); } }
    else if(lv===1){ [[0,0,26,'Galaktika'],[.42,-.1,30,'M31'],[.3,.22,12,'M33'],[-.08,.12,7,'KMB'],[-.05,.16,5,'KichMB']].forEach(([gx,gy,R,n])=>{ const px=cx+gx*w*.9, py=cy+gy*h*1.2; const g=x.createRadialGradient(px,py,0,px,py,R); g.addColorStop(0,'rgba(255,240,210,.9)'); g.addColorStop(1,'rgba(200,210,255,0)'); x.fillStyle=g; x.beginPath(); x.ellipse(px,py,R,R*.55,.4,0,TAU); x.fill(); lbl(x,n,px,py+R*.6+12,'#cfd6f2'); }); for(let i=0;i<30;i++){ x.fillStyle='rgba(220,220,255,.5)'; x.beginPath(); x.arc(cx+(r()-.5)*w*.95,cy+(r()-.5)*h*.85,1.2+r()*1.4,0,TAU); x.fill(); } }
    else if(lv===2){ for(let i=0;i<500;i++){ const a=r()*TAU, d=Math.pow(r(),1.6)*Math.min(w,h)*.45; x.fillStyle=`rgba(255,${220+r()*35|0},${190+r()*50|0},${.4+r()*.5})`; x.beginPath(); x.ellipse(cx+Math.cos(a)*d,cy+Math.sin(a)*d,1+r()*2.6,.6+r()*1.4,r()*3,0,TAU); x.fill(); } }
    else if(lv===3){ for(let k2=0;k2<14;k2++){ const kx=cx+(r()-.5)*w*.85, ky=cy+(r()-.5)*h*.75; for(let i=0;i<70;i++){ const a=r()*TAU, d=Math.pow(r(),1.5)*28; x.fillStyle='rgba(255,230,200,.6)'; x.fillRect(kx+Math.cos(a)*d,ky+Math.sin(a)*d,1.3,1.3); } } }
    else { for(let i=0;i<6000;i++){ const u=r(), v2=r(), f=(Math.sin(u*18)+Math.sin(v2*15)+Math.sin((u+v2)*11))/3; if(f<.15&&r()>.08) continue; x.fillStyle=`rgba(200,210,255,${.25+r()*.4})`; x.fillRect(u*w,v2*h,1.1,1.1); } }
    const L=LV[lv]; mark('lv',lv); lbl(x,T(L[0]),12,18,'#e8edff','left');
    $('#t29ZKv').innerHTML=kv(T(TX.lvl),T(L[0]),true)+kv(T(TX.size),L[1]<1?fmtN(L[1]*1000)+' kpk':L[1]>=1000?'≈ 14 000 Mpk':'≈ '+fmtN(L[1])+' '+T(TX.mpc))+kv(T(TX.note),T(L[2])); });
  on('lv',v=>{ lv=+v; drawZ(); });

  K.bindQA(); K.quiz($('#t29Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t29', GL, QZ, ico:'🕸', title:TX.title, sub:TX.sub, build });
}; go0();
})();
