/* OB-HAVO — joylashuv bo'yicha bugungi va 5 kunlik prognoz + butun dunyo ob-havo xaritasi (Open-Meteo, kalitsiz) */
(function(){
const {register,T,L,esc,fmt,hiDPI,loc,locPicker,locName,click,CITIES}=window.LAB;
const API='https://api.open-meteo.com/v1/forecast';
const TX={ name:{uz:'Ob-havo',ru:'Погода',en:'Weather'},
  sub:{uz:'Bugungi va 5 kunlik prognoz hamda butun dunyo ob-havo xaritasi',ru:'Прогноз на сегодня и 5 дней и карта погоды мира',en:'Today and 5-day forecast plus a live world weather map'},
  here:{uz:'Joylashuvim',ru:'Моё место',en:'My place'}, world:{uz:'Dunyo xaritasi',ru:'Карта мира',en:'World map'},
  feels:{uz:'His qilinadi',ru:'Ощущается',en:'Feels like'}, hum:{uz:'Namlik',ru:'Влажность',en:'Humidity'}, wind:{uz:'Shamol',ru:'Ветер',en:'Wind'}, gust:{uz:'Shamol zarbi',ru:'Порывы',en:'Gusts'},
  pres:{uz:'Bosim',ru:'Давление',en:'Pressure'}, cloud:{uz:'Bulutlilik',ru:'Облачность',en:'Cloud cover'}, uv:{uz:'UV indeks',ru:'УФ-индекс',en:'UV index'},
  rise:{uz:'Quyosh chiqishi',ru:'Восход',en:'Sunrise'}, set:{uz:'Quyosh botishi',ru:'Закат',en:'Sunset'}, prec:{uz:'Yog‘in',ru:'Осадки',en:'Precip.'},
  h24:{uz:'Keyingi 24 soat',ru:'Ближайшие 24 часа',en:'Next 24 hours'}, d5:{uz:'5 kunlik prognoz',ru:'Прогноз на 5 дней',en:'5-day forecast'},
  now:{uz:'Hozir',ru:'Сейчас',en:'Now'}, today:{uz:'Bugun',ru:'Сегодня',en:'Today'},
  lT:{uz:'Harorat',ru:'Температура',en:'Temperature'}, lP:{uz:'Yog‘in',ru:'Осадки',en:'Precipitation'}, lW:{uz:'Shamol',ru:'Ветер',en:'Wind'}, lC:{uz:'Bulutlar',ru:'Облака',en:'Clouds'},
  max:{uz:'Kunduzi',ru:'Днём',en:'Day'}, min:{uz:'Tunda',ru:'Ночью',en:'Night'},
  cities:{uz:'Dunyo shaharlari',ru:'Города мира',en:'World cities'}, hot:{uz:'Eng issiq',ru:'Самый жаркий',en:'Hottest'}, cold:{uz:'Eng sovuq',ru:'Самый холодный',en:'Coldest'},
  back:{uz:'Joylashuvimga qaytish',ru:'Вернуться к моему месту',en:'Back to my place'}, open5:{uz:'5 kunlik prognozni ochish',ru:'Открыть прогноз',en:'Open forecast'},
  load:{uz:'Ob-havo yuklanmoqda…',ru:'Загрузка погоды…',en:'Loading weather…'}, err:{uz:'Ob-havo ma’lumotini olib bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.',ru:'Не удалось загрузить погоду. Проверьте интернет и попробуйте снова.',en:'Couldn’t load the weather. Check your connection and try again.'},
  uz:{uz:'O‘zbekiston',ru:'Узбекистан',en:'Uzbekistan'}, backUz:{uz:'Hududlar ro‘yxatiga',ru:'К списку регионов',en:'Back to regions'}, backW:{uz:'Dunyo xaritasiga',ru:'К карте мира',en:'Back to world map'},
  region:{uz:'Viloyat',ru:'Регион',en:'Region'}, allReg:{uz:'Barcha hududlar',ru:'Все регионы',en:'All regions'}, place:{uz:'Tuman / shahar',ru:'Район / город',en:'District / city'}, pick:{uz:'— tanlang —',ru:'— выберите —',en:'— choose —'},
  fAll:{uz:'Hammasi',ru:'Все',en:'All'}, fCity:{uz:'Shaharlar',ru:'Города',en:'Cities'}, fDist:{uz:'Tumanlar',ru:'Районы',en:'Districts'}, sName:{uz:'Nomi',ru:'Название',en:'Name'}, sTemp:{uz:'Harorat',ru:'Температура',en:'Temperature'},
  avg:{uz:'O‘rtacha',ru:'В среднем',en:'Average'}, cap:{uz:'markaz',ru:'центр',en:'centre'}, nPlaces:{uz:'ta hudud',ru:'мест',en:'places'}, search:{uz:'Qidirish…',ru:'Поиск…',en:'Search…'},
  bases:{uz:'Xarita',ru:'Карта',en:'Map'}, bDark:{uz:'To‘q',ru:'Тёмная',en:'Dark'}, bColor:{uz:'Rangli',ru:'Цветная',en:'Colour'}, bPol:{uz:'Siyosiy',ru:'Политическая',en:'Political'}, bSat:{uz:'Sun’iy yo‘ldosh',ru:'Спутник',en:'Satellite'},
  zin:{uz:'Yaqinlashtirish',ru:'Приблизить',en:'Zoom in'}, zout:{uz:'Uzoqlashtirish',ru:'Отдалить',en:'Zoom out'}, zworld:{uz:'Butun dunyo',ru:'Весь мир',en:'Whole world'},
  hint:{uz:'Sichqoncha g‘ildiragi yoki ikki barmoq bilan yaqinlashtiring, sudrab suring — davlat va shahar nomlari chiqadi. Istalgan joyni bosing.',ru:'Приближайте колёсиком или двумя пальцами, перетаскивайте — появятся страны и города. Нажмите на любое место.',en:'Scroll or pinch to zoom, drag to pan — country and city names appear. Click anywhere.'},
  rate:{uz:'Ob-havo serveri band. 1 daqiqadan so‘ng avtomatik qayta yuklanadi.',ru:'Сервер погоды перегружен. Повтор через минуту.',en:'Weather server is busy. Retrying automatically in a minute.'},
  retry:{uz:'Qayta urinish',ru:'Повторить',en:'Retry'}, upd:{uz:'yangilangan',ru:'обновлено',en:'updated'}, refresh:{uz:'Yangilash',ru:'Обновить',en:'Refresh'},
  ms:{uz:'m/s',ru:'м/с',en:'m/s'}, hpa:{uz:'gPa',ru:'гПа',en:'hPa'}, mm:{uz:'mm',ru:'мм',en:'mm'},
  note:{uz:'Ma’lumot: Open-Meteo (milliy meteorologiya xizmatlari modellari asosida). Xarita 10° li to‘rda, shaharlar alohida nuqtalar bo‘yicha; har 15 daqiqada yangilanadi.',
        ru:'Данные: Open-Meteo (на основе моделей национальных метеослужб). Карта — сетка 10°, города — отдельными точками; обновление каждые 15 минут.',
        en:'Data: Open-Meteo (built on national weather-service models). The map uses a 10° grid, cities are sampled individually; refreshed every 15 minutes.'} };
const WMO={0:['☀','Ochiq osmon','Ясно','Clear sky'],1:['🌤','Asosan ochiq','Преимущественно ясно','Mainly clear'],2:['⛅','Qisman bulutli','Переменная облачность','Partly cloudy'],3:['☁','Bulutli','Пасмурно','Overcast'],
  45:['🌫','Tuman','Туман','Fog'],48:['🌫','Qirovli tuman','Изморозь, туман','Rime fog'],51:['🌦','Yengil shivalama','Слабая морось','Light drizzle'],53:['🌦','Shivalama','Морось','Drizzle'],55:['🌧','Kuchli shivalama','Сильная морось','Dense drizzle'],
  56:['🌧','Muzli shivalama','Ледяная морось','Freezing drizzle'],57:['🌧','Muzli shivalama','Ледяная морось','Freezing drizzle'],61:['🌦','Yengil yomg‘ir','Небольшой дождь','Light rain'],63:['🌧','Yomg‘ir','Дождь','Rain'],65:['🌧','Kuchli yomg‘ir','Сильный дождь','Heavy rain'],
  66:['🌧','Muzli yomg‘ir','Ледяной дождь','Freezing rain'],67:['🌧','Muzli yomg‘ir','Ледяной дождь','Freezing rain'],71:['🌨','Yengil qor','Небольшой снег','Light snow'],73:['🌨','Qor','Снег','Snow'],75:['❄','Kuchli qor','Сильный снег','Heavy snow'],77:['🌨','Qor donalari','Снежная крупа','Snow grains'],
  80:['🌦','Jala','Ливень','Rain showers'],81:['🌧','Kuchli jala','Сильный ливень','Heavy showers'],82:['⛈','Juda kuchli jala','Очень сильный ливень','Violent showers'],85:['🌨','Qor yog‘ishi','Снегопад','Snow showers'],86:['❄','Kuchli qor yog‘ishi','Сильный снегопад','Heavy snow showers'],
  95:['⛈','Momaqaldiroq','Гроза','Thunderstorm'],96:['⛈','Do‘lli momaqaldiroq','Гроза с градом','Thunder with hail'],99:['⛈','Kuchli do‘lli momaqaldiroq','Сильная гроза с градом','Severe thunder with hail']};
const wi=(c,day)=>{ const w=WMO[c]||WMO[3]; return (day===0&&(c===0||c===1))?(c===0?'🌙':'🌙'):w[0]; };
const wd=c=>{ const w=WMO[c]||WMO[3]; return w[{uz:1,ru:2,en:3}[L()]||1]; };
const WDAY={uz:['Yak','Dush','Sesh','Chor','Pay','Jum','Shan'],ru:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']};
const MON={uz:['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'],ru:['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const dayLbl=(s,i)=>{ if(i===0) return T(TX.today); const [y,m,d]=s.split('-').map(Number), w=new Date(Date.UTC(y,m-1,d)).getUTCDay(); return T(WDAY)[w]+', '+d+' '+T(MON)[m-1]; };
const DIR8={uz:['Sh','ShSh','Shq','JSh','J','JG‘','G‘','ShG‘'],ru:['С','СВ','В','ЮВ','Ю','ЮЗ','З','СЗ'],en:['N','NE','E','SE','S','SW','W','NW']};
const dir8=d=>T(DIR8)[Math.round(d/45)%8];
const arrow=d=>`<i class="wx-ar" style="transform:rotate(${(d+180)%360}deg)">↑</i>`;
const tC=v=>(v>0?'+':'')+fmt(v,0)+'°';
// Rang shkalalari
const TS=[[-40,[145,60,190]],[-25,[90,80,210]],[-12,[50,130,230]],[0,[90,200,235]],[8,[110,215,160]],[16,[200,225,90]],[24,[250,200,60]],[32,[245,120,40]],[40,[210,40,40]],[48,[140,20,60]]];
const PS=[[0,[0,0,0,0]],[0.3,[110,180,255,.35]],[2,[60,130,255,.6]],[8,[90,80,230,.75]],[20,[190,70,220,.85]],[50,[250,90,160,.9]]];
const WS=[[0,[60,90,160,.15]],[4,[80,190,200,.45]],[8,[120,220,120,.6]],[13,[250,210,60,.75]],[19,[245,120,40,.85]],[27,[210,40,60,.9]]];
const CS=[[0,[230,236,245,0]],[40,[230,236,245,.25]],[80,[235,240,250,.6]],[100,[245,248,255,.8]]];
const ramp=(S,v)=>{ if(v<=S[0][0]) return S[0][1]; for(let i=1;i<S.length;i++){ if(v<=S[i][0]){ const a=S[i-1], b=S[i], k=(v-a[0])/(b[0]-a[0]); return a[1].map((x,j)=>x+(b[1][j]-x)*k); } } return S[S.length-1][1]; };
const rgba=c=>`rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c.length>3?c[3]:1})`;
const LEG={T:[TS,'°C'],P:[PS,'mm'],W:[WS,'m/s'],C:[CS,'%']};
// Dunyo shaharlari
const WC=[['Toshkent','Ташкент','Tashkent',41.30,69.24,1],['Samarqand','Самарканд','Samarkand',39.65,66.96,0],['Nukus','Нукус','Nukus',42.46,59.61,0],['Moskva','Москва','Moscow',55.76,37.62,1],
 ['London','Лондон','London',51.51,-0.13,1],['Parij','Париж','Paris',48.86,2.35,0],['Berlin','Берлин','Berlin',52.52,13.40,0],['Rim','Рим','Rome',41.90,12.50,0],['Madrid','Мадрид','Madrid',40.42,-3.70,1],
 ['Istanbul','Стамбул','Istanbul',41.01,28.98,1],['Qohira','Каир','Cairo',30.04,31.24,1],['Lagos','Лагос','Lagos',6.52,3.38,1],['Nayrobi','Найроби','Nairobi',-1.29,36.82,1],['Keyptaun','Кейптаун','Cape Town',-33.92,18.42,1],
 ['Dubay','Дубай','Dubai',25.20,55.27,1],['Ar-Riyod','Эр-Рияд','Riyadh',24.71,46.68,0],['Tehron','Тегеран','Tehran',35.69,51.39,0],['Dehli','Дели','Delhi',28.61,77.21,1],['Mumbay','Мумбаи','Mumbai',19.08,72.88,0],
 ['Pekin','Пекин','Beijing',39.90,116.41,1],['Shanxay','Шанхай','Shanghai',31.23,121.47,0],['Tokio','Токио','Tokyo',35.68,139.69,1],['Seul','Сеул','Seoul',37.57,126.98,0],['Bangkok','Бангкок','Bangkok',13.76,100.50,1],
 ['Singapur','Сингапур','Singapore',1.35,103.82,0],['Jakarta','Джакарта','Jakarta',-6.21,106.85,1],['Sidney','Сидней','Sydney',-33.87,151.21,1],['Pert','Перт','Perth',-31.95,115.86,0],['Oklend','Окленд','Auckland',-36.85,174.76,1],
 ['Nyu-York','Нью-Йорк','New York',40.71,-74.01,1],['Los-Anjeles','Лос-Анджелес','Los Angeles',34.05,-118.24,1],['Chikago','Чикаго','Chicago',41.88,-87.63,0],['Toronto','Торонто','Toronto',43.65,-79.38,0],['Mexiko','Мехико','Mexico City',19.43,-99.13,1],
 ['Bogota','Богота','Bogotá',4.71,-74.07,0],['Lima','Лима','Lima',-12.05,-77.04,1],['San-Paulu','Сан-Паулу','São Paulo',-23.55,-46.63,1],['Buenos-Ayres','Буэнос-Айрес','Buenos Aires',-34.60,-58.38,1],
 ['Ankorij','Анкоридж','Anchorage',61.22,-149.90,1],['Reykyavik','Рейкьявик','Reykjavik',64.15,-21.94,1],['Yakutsk','Якутск','Yakutsk',62.03,129.73,1],['Novosibirsk','Новосибирск','Novosibirsk',55.01,82.93,0],
 ['Vostok stansiyasi','Станция Восток','Vostok Station',-78.46,106.84,1]].map(c=>({n:{uz:c[0],ru:c[1],en:c[2]},lat:c[3],lon:c[4],p:c[5]}));
// To'r: 10° qadam, kenglik 75…−65
const GLAT=[], GLON=[]; for(let y=75;y>=-65;y-=10) GLAT.push(y); for(let x=-175;x<=175;x+=10) GLON.push(x);
async function getJSON(u,tries){ for(let i=0;i<(tries||3);i++){ try{ const c=new AbortController(), t=setTimeout(()=>c.abort(),15000); const r=await fetch(u,{signal:c.signal}); clearTimeout(t); if(r.status===429) throw new Error('rate'); if(r.ok) return await r.json(); }catch(e){ if(e.message==='rate') throw e; } await new Promise(r=>setTimeout(r,800*(i+1))); } throw new Error('net'); }
const CACHE={}; const fresh=k=>CACHE[k]&&Date.now()-CACHE[k].t<15*60000;
async function local(lat,lon,force){ const k='L'+lat.toFixed(2)+','+lon.toFixed(2); if(!force&&fresh(k)) return CACHE[k].d;
  const d=await getJSON(`${API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=6&wind_speed_unit=ms`);
  CACHE[k]={t:Date.now(),d}; return d; }
async function grid(force){ if(!force&&fresh('G')) return CACHE.G.d;
  if(!force){ try{ const o=JSON.parse(localStorage.getItem('wx_grid')||'null'); if(o&&Date.now()-o.t<30*60000){ CACHE.G=o; return o.d; } }catch(e){} } const la=[], lo=[]; GLAT.forEach(y=>GLON.forEach(x=>{ la.push(y); lo.push(x); }));
  const d=await getJSON(`${API}?latitude=${la.join(',')}&longitude=${lo.join(',')}&current=temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&forecast_days=5&wind_speed_unit=ms`);
  CACHE.G={t:Date.now(),d}; try{ localStorage.setItem('wx_grid',JSON.stringify({t:CACHE.G.t,d:d.map(p=>({current:p.current,daily:p.daily}))})); }catch(e){} return d; }
async function cities(force){ if(!force&&fresh('C')) return CACHE.C.d;
  const d=await getJSON(`${API}?latitude=${WC.map(c=>c.lat).join(',')}&longitude=${WC.map(c=>c.lon).join(',')}&current=temperature_2m,weather_code,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=5&wind_speed_unit=ms`);
  CACHE.C={t:Date.now(),d}; return d; }
const hm=s=>s?s.slice(11,16):'—';

register('weather',{ ico:'⛅', nomenu:true, name:TX.name, sub:TX.sub,
  build(body, lab){
    lab.tab=lab.tab||'here'; lab.layer=lab.layer||'T'; lab.day=lab.day==null?-1:lab.day; lab.mm=lab.mm||'max'; lab.place=null;
    body.innerHTML=`<div class="lab-row wx-top" style="margin-top:0"><div class="wx-tabs" id="wxTabs"><button class="lab-chip" data-t="here">📍 ${esc(T(TX.here))}</button><button class="lab-chip" data-t="uz">🇺🇿 ${esc(T(TX.uz))}</button><button class="lab-chip" data-t="world">🌍 ${esc(T(TX.world))}</button></div><div class="lab-row" id="wxLoc" style="margin:0"></div></div>
      <div id="wxHere"></div><div id="wxUz" style="display:none"></div><div id="wxWorld" style="display:none"></div><div class="lab-row wx-foot"><span class="wx-upd" id="wxUpd"></span><button class="lab-chip" id="wxRef">↻ ${esc(T(TX.refresh))}</button></div><p class="lab-note">${esc(T(TX.note))}</p>`;
    const $=id=>body.querySelector('#'+id);
    locPicker($('wxLoc'));
    $('wxTabs').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ lab.tab=b.dataset.t; click(720); show(); });
    $('wxRef').onclick=()=>{ click(700); lab.tab==='here'?loadHere(true):(lab.tab==='uz'?loadUz(true):loadWorld(true)); };
    lab.onLoc=()=>{ locPicker($('wxLoc')); if(lab.tab==='here'){ lab.place=null; lab.from=null; loadHere(false); } };
    const upd=t=>{ const d=new Date(t); $('wxUpd').textContent=T(TX.upd)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); };
    const loading=el=>{ el.innerHTML=`<div class="wx-msg"><span class="wx-spin"></span>${esc(T(TX.load))}</div>`; };
    const failed=(el,fn)=>{ el.innerHTML=`<div class="wx-msg">⚠ ${esc(T(TX.err))} <button class="lab-chip" id="wxRetry">${esc(T(TX.retry))}</button></div>`; el.querySelector('#wxRetry').onclick=()=>fn(true); };
    function show(){
      $('wxTabs').querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===lab.tab));
      $('wxHere').style.display=lab.tab==='here'?'':'none'; $('wxUz').style.display=lab.tab==='uz'?'':'none'; $('wxWorld').style.display=lab.tab==='world'?'':'none'; $('wxLoc').style.display=lab.tab==='here'?'':'none';
      lab.tab==='here'?loadHere(false):(lab.tab==='uz'?loadUz(false):loadWorld(false));
      if(lab.tab==='world'&&lab.mapFix) lab.mapFix();
    }
    /* ---- Joylashuv bo'yicha ---- */
    async function loadHere(force){
      const el=$('wxHere'), p=lab.place||loc(), name=lab.place?T(lab.place.n):locName(p);
      if(!force&&!fresh('L'+p.lat.toFixed(2)+','+p.lon.toFixed(2))) loading(el);
      let d; try{ d=await local(p.lat,p.lon,force); }catch(e){ failed(el,loadHere); return; }
      if(lab.tab!=='here') return; upd(CACHE['L'+p.lat.toFixed(2)+','+p.lon.toFixed(2)].t);
      const c=d.current, D=d.daily, H=d.hourly, day=c.is_day;
      const kv=(k,v)=>`<div><div class="k">${esc(k)}</div><div class="v">${v}</div></div>`;
      el.innerHTML=`${lab.place?`<button class="lab-chip wx-back" id="wxBack">← ${esc(T(lab.from==='uz'?TX.backUz:(lab.from==='world'?TX.backW:TX.back)))}</button>`:''}
        <div class="wx-now"><div class="wx-main"><div class="wx-place">${esc(name)}</div>
          <div class="wx-big"><span class="wx-ico">${wi(c.weather_code,day)}</span><span class="wx-t">${tC(c.temperature_2m)}</span></div>
          <div class="wx-desc">${esc(wd(c.weather_code))}</div>
          <div class="wx-sub">${esc(T(TX.feels))} ${tC(c.apparent_temperature)} · ↑ ${tC(D.temperature_2m_max[0])} ↓ ${tC(D.temperature_2m_min[0])}</div></div>
        <div class="lab-kv wx-kv">${kv(T(TX.wind),`${arrow(c.wind_direction_10m)} ${fmt(c.wind_speed_10m,1)} ${esc(T(TX.ms))} <small>${esc(dir8(c.wind_direction_10m))}</small>`)}${kv(T(TX.gust),fmt(c.wind_gusts_10m,1)+' '+esc(T(TX.ms)))}
          ${kv(T(TX.hum),fmt(c.relative_humidity_2m,0)+'%')}${kv(T(TX.pres),fmt(c.pressure_msl,0)+' '+esc(T(TX.hpa))+' <small>('+fmt(c.pressure_msl*0.750062,0)+' mm sim. ust.)</small>')}
          ${kv(T(TX.cloud),fmt(c.cloud_cover,0)+'%')}${kv(T(TX.uv),fmt(D.uv_index_max[0],1))}
          ${kv(T(TX.rise),hm(D.sunrise[0]))}${kv(T(TX.set),hm(D.sunset[0]))}</div></div>
        <div class="sec-title" style="margin-top:16px">${esc(T(TX.h24))}</div><div class="wx-hr"><canvas class="lab-cv" id="wxHr"></canvas></div>
        <div class="sec-title" style="margin-top:16px">${esc(T(TX.d5))}</div>
        <div class="wx-days">${[0,1,2,3,4].map(i=>`<div class="wx-day${i===0?' on':''}"><div class="wx-dn">${esc(dayLbl(D.time[i],i))}</div><div class="wx-di" title="${esc(wd(D.weather_code[i]))}">${wi(D.weather_code[i],1)}</div>
          <div class="wx-dd">${esc(wd(D.weather_code[i]))}</div><div class="wx-mm"><b>${tC(D.temperature_2m_max[i])}</b><span>${tC(D.temperature_2m_min[i])}</span></div>
          <div class="wx-dx"><span>💧 ${fmt(D.precipitation_probability_max[i]??0,0)}% · ${fmt(D.precipitation_sum[i],1)} ${esc(T(TX.mm))}</span><span>${arrow(D.wind_direction_10m_dominant[i])} ${fmt(D.wind_speed_10m_max[i],0)} ${esc(T(TX.ms))}</span></div></div>`).join('')}</div>`;
      if($('wxBack')) $('wxBack').onclick=()=>{ lab.place=null; click(700); if(lab.from){ lab.tab=lab.from; lab.from=null; show(); } else loadHere(false); };
      drawHourly(d);
    }
    function drawHourly(d){
      const cv=$('wxHr'); if(!cv) return; const w=Math.max(280,cv.parentElement.clientWidth), h=170, x=hiDPI(cv,w,h); cv.style.height=h+'px';
      const H=d.hourly, nowH=d.current.time.slice(0,13); let i0=H.time.findIndex(t=>t.slice(0,13)>=nowH); if(i0<0) i0=0;
      const n=25, T_=H.temperature_2m.slice(i0,i0+n), PP=H.precipitation_probability.slice(i0,i0+n), WC_=H.weather_code.slice(i0,i0+n), DY=H.is_day.slice(i0,i0+n), TM=H.time.slice(i0,i0+n);
      const mn=Math.min(...T_), mx=Math.max(...T_), pl=18, pr=18, top=44, bot=40, cw=(w-pl-pr)/(n-1);
      const Y=v=>top+(1-(v-mn)/Math.max(1,mx-mn))*(h-top-bot), X=i=>pl+i*cw;
      PP.forEach((p,i)=>{ if(!p) return; const bh=(p/100)*(h-top-bot)*0.6; x.fillStyle=`rgba(90,160,255,${0.18+p/250})`; x.fillRect(X(i)-cw*0.32,h-bot-bh,cw*0.64,bh); });
      const g=x.createLinearGradient(0,top,0,h-bot); g.addColorStop(0,'rgba(250,190,70,.35)'); g.addColorStop(1,'rgba(250,190,70,0)');
      x.beginPath(); T_.forEach((v,i)=>i?x.lineTo(X(i),Y(v)):x.moveTo(X(i),Y(v))); x.lineTo(X(n-1),h-bot); x.lineTo(X(0),h-bot); x.closePath(); x.fillStyle=g; x.fill();
      x.beginPath(); T_.forEach((v,i)=>i?x.lineTo(X(i),Y(v)):x.moveTo(X(i),Y(v))); x.strokeStyle='#ffc857'; x.lineWidth=2.2; x.stroke();
      x.textAlign='center'; x.fillStyle='#e8edff';
      for(let i=0;i<n;i+=3){ x.font='700 12px "Segoe UI",system-ui,sans-serif'; x.fillText(tC(T_[i]),X(i),Y(T_[i])-9);
        x.font='16px "Segoe UI Emoji","Apple Color Emoji",sans-serif'; x.fillText(wi(WC_[i],DY[i]),X(i),20);
        x.font='11px "Segoe UI",system-ui,sans-serif'; x.fillStyle='#9aa6cc'; x.fillText(i===0?T(TX.now):TM[i].slice(11,16),X(i),h-22);
        if(PP[i]>=20){ x.fillStyle='#8cc0ff'; x.fillText(PP[i]+'%',X(i),h-8); } x.fillStyle='#e8edff';
        x.beginPath(); x.arc(X(i),Y(T_[i]),3,0,6.283); x.fillStyle='#ffc857'; x.fill(); x.fillStyle='#e8edff'; }
    }
    /* ---- Dunyo xaritasi: yaqinlashtirish, surish, davlat va shahar nomlari ---- */
    let G=null, C=null, M=null, LF=null, wxLayer=null, cityLayer=null, detLayer=null, meLayer=null, DET=null, detT=0, cityMk=[];
    const msg=(h,show)=>{ const m=$('wxMsg'); if(!m) return; m.innerHTML=h; m.style.display=show?'':'none'; };
    async function loadWorld(force){
      const el=$('wxWorld');
      if(!el.dataset.built){ el.dataset.built=1;
        el.innerHTML=`<div class="lab-row wx-ctl" style="margin-top:0"><div class="wx-seg" id="wxLay">${['T','P','W','C'].map(k=>`<button class="lab-chip" data-l="${k}">${esc(T(TX['l'+k]))}</button>`).join('')}</div>
            <div class="wx-seg wx-bases" id="wxBase"><span>${esc(T(TX.bases))}:</span>${['dark','color','pol','sat'].map(k=>`<button class="lab-chip" data-b="${k}">${esc(T(TX['b'+{dark:'Dark',color:'Color',pol:'Pol',sat:'Sat'}[k]]))}</button>`).join('')}</div>
            <div class="wx-seg" id="wxMM"><button class="lab-chip" data-m="max">${esc(T(TX.max))}</button><button class="lab-chip" data-m="min">${esc(T(TX.min))}</button></div></div>
          <div class="wx-daysel" id="wxDay"></div>
          <div class="wx-map"><div id="wxMap" class="wx-lf"></div><div class="lab-tip" id="wxTip"></div>
            <div class="wx-zb"><button id="wxZi" title="${esc(T(TX.zin))}">+</button><button id="wxZo" title="${esc(T(TX.zout))}">−</button><button id="wxZw" title="${esc(T(TX.zworld))}">🌍</button><button id="wxZme" title="${esc(T(TX.here))}">📍</button></div>
            <div class="wx-hint" id="wxHint">${esc(T(TX.hint))}</div><div class="wx-msg wx-ov" id="wxMsg"></div></div>
          <div class="wx-leg" id="wxLeg"></div><div class="wx-ext" id="wxExt"></div>
          <div class="sec-title" style="margin-top:14px">${esc(T(TX.cities))}</div><div class="wx-cities" id="wxCities"></div>`;
        el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ lab.layer=b.dataset.l; click(740); renderWorld(); });
        el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ lab.mm=b.dataset.m; click(740); renderWorld(); });
        el.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{ click(740); setBase(b.dataset.b); });
      }
      if(!G) msg(`<span class="wx-spin"></span>${esc(T(TX.load))}`,true);
      try{ await loadLeaflet(); }catch(e){ msg('⚠ '+esc(T(TX.err)),true); return; }
      initMap();
      try{ C=await cities(force); G=await grid(force); }
      catch(e){ if(e.message==='rate'){ msg('⏳ '+esc(T(TX.rate)),true); setTimeout(()=>{ if(lab.isOpen&&lab.tab==='world') loadWorld(false); },61000); } else msg('⚠ '+esc(T(TX.err)),true); if(!C) return; }
      if(G) msg('',false); if(lab.tab==='world'){ if(CACHE.G) upd(CACHE.G.t); renderWorld(); }
    }
    function loadLeaflet(){ if(window.L&&window.L.GridLayer) return Promise.resolve(LF=window.L);
      if(!document.getElementById('lfCss')){ const l=document.createElement('link'); l.id='lfCss'; l.rel='stylesheet'; l.href='labs/leaflet/leaflet.css'; document.head.appendChild(l); }
      const add=src=>new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=()=>res(); s.onerror=rej; document.head.appendChild(s); });
      return add('labs/leaflet/leaflet.js').catch(()=>add('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')).then(()=>LF=window.L); }
    const openCity=(c,from)=>{ lab.place={n:c.n,lat:c.lat,lon:c.lon}; lab.from=from||'world'; lab.tab='here'; click(800); show(); };
    lab.openCity=openCity;
    function initMap(){
      if(M){ setTimeout(()=>M.invalidateSize(),60); return; }
      const box=$('wxMap'); box.style.height=Math.round(Math.min(window.innerHeight*0.62,Math.max(300,box.clientWidth*0.56)))+'px';
      M=LF.map(box,{zoomControl:false,worldCopyJump:true,minZoom:1,maxZoom:11,zoomSnap:0.5,zoomDelta:1,wheelPxPerZoomLevel:100,maxBounds:[[-86,-400],[86,400]],maxBoundsViscosity:1,attributionControl:true});
      M.attributionControl.setPrefix(false);
      M.createPane('wx').style.zIndex=350; M.getPane('wx').style.pointerEvents='none';
      M.createPane('lbl').style.zIndex=420; M.getPane('lbl').style.pointerEvents='none';
      M.createPane('pol').style.zIndex=300; M.getPane('pol').style.pointerEvents='none';
      const WX=LF.GridLayer.extend({ createTile(c){ const cv=document.createElement('canvas'); cv.width=cv.height=256; paintTile(cv,c); return cv; } });
      wxLayer=new WX({pane:'wx',tileSize:256,updateWhenZooming:false,keepBuffer:1,opacity:1}).addTo(M);
      setBase(localStorage.getItem('wx_base')||'dark');
      detLayer=LF.layerGroup().addTo(M); cityLayer=LF.layerGroup().addTo(M); meLayer=LF.layerGroup().addTo(M);
      M.setView([28,35],box.clientWidth<700?1:2);
      $('wxZi').onclick=()=>{ click(760); M.zoomIn(); }; $('wxZo').onclick=()=>{ click(700); M.zoomOut(); };
      $('wxZw').onclick=()=>{ click(720); M.flyTo([28,35],box.clientWidth<700?1:2,{duration:0.8}); };
      $('wxZme').onclick=()=>{ click(800); const o=loc(); M.flyTo([o.lat,o.lon],8,{duration:1.2}); };
      let hintOff=false; M.on('zoomstart movestart',()=>{ if(!hintOff){ hintOff=true; $('wxHint').style.opacity=0; } });
      M.on('zoomend',()=>{ box.dataset.z=Math.floor(M.getZoom()); declutter(); detLabels(); });
      M.on('moveend',()=>{ declutter(); detLabels(); clearTimeout(detT); detT=setTimeout(fetchDetail,700); });
      const tip=$('wxTip');
      M.on('mousemove',e=>{ if(!G) return; const v=field(e.latlng.lat,e.latlng.lng); if(v==null){ tip.style.opacity=0; return; }
        tip.textContent=fmtV(v)+' · '+fmt(Math.abs(e.latlng.lat),1)+'°'+(e.latlng.lat>=0?'N':'S')+' '+fmt(Math.abs(wrap(e.latlng.lng)),1)+'°'+(wrap(e.latlng.lng)>=0?'E':'W');
        tip.style.left=e.containerPoint.x+'px'; tip.style.top=(e.containerPoint.y-12)+'px'; tip.style.opacity=1; });
      M.on('mouseout',()=>tip.style.opacity=0);
      M.on('click',e=>pointPopup(e.latlng));
      box.dataset.z=Math.floor(M.getZoom());
      window.addEventListener('resize',()=>{ if(M&&lab.isOpen&&lab.tab==='world'){ box.style.height=Math.round(Math.min(window.innerHeight*0.62,Math.max(300,box.clientWidth*0.56)))+'px'; M.invalidateSize(); } });
    }
    // Xarita asoslari: to'q, rangli, siyosiy (davlatlar rangda), sun'iy yo'ldosh
    const ESRI='https://server.arcgisonline.com/ArcGIS/rest/services/', ATT='Esri, HERE, Garmin, © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> · Open-Meteo';
    const POLC=['#f3d9a4','#c8e0a8','#f2b8a8','#bcd3ee','#e8c6e4','#f6e7a1','#b9e2d8','#d9c9b4'];
    let baseL=[], polGeo=null;
    const tl=(p,o)=>LF.tileLayer(ESRI+p+'/MapServer/tile/{z}/{y}/{x}',Object.assign({maxZoom:19,maxNativeZoom:16},o||{}));
    async function setBase(k){ if(!M) return; lab.base=k; localStorage.setItem('wx_base',k); baseL.forEach(l=>M.removeLayer(l)); baseL=[];
      const box=$('wxMap'); box.dataset.base=k;
      if(k==='dark') baseL=[tl('Canvas/World_Dark_Gray_Base',{attribution:ATT}),tl('Canvas/World_Dark_Gray_Reference',{pane:'lbl'})];
      else if(k==='color') baseL=[tl('World_Street_Map',{attribution:ATT})];
      else if(k==='sat') baseL=[tl('World_Imagery',{attribution:'Esri, Maxar, Earthstar Geographics · Open-Meteo'}),tl('Reference/World_Boundaries_and_Places',{pane:'lbl'})];
      else { baseL=[tl('Ocean/World_Ocean_Base',{attribution:ATT+' · Natural Earth',maxNativeZoom:13}),tl('Canvas/World_Light_Gray_Reference',{pane:'lbl'})];
        if(!polGeo){ try{ if(!window.WORLD_C) await new Promise((ok,no)=>{ const s=document.createElement('script'); s.src='labs/world-countries.js'; s.onload=ok; s.onerror=no; document.head.appendChild(s); });
          polGeo=LF.geoJSON({type:'FeatureCollection',features:window.WORLD_C.map(f=>({type:'Feature',properties:{c:f.c},geometry:{type:'MultiPolygon',coordinates:f.p}}))},
            {pane:'pol',interactive:false,renderer:LF.canvas({pane:'pol',padding:0.3}),style:f=>({fillColor:POLC[(f.properties.c-1)%POLC.length],fillOpacity:1,color:'#ffffff',weight:0.9,opacity:0.95})}); }catch(e){} }
        if(polGeo&&lab.base==='pol') baseL.push(polGeo); }
      if(lab.base!==k) return; baseL.forEach(l=>l.addTo(M));
      const el=$('wxWorld'); el.querySelectorAll('[data-b]').forEach(b=>b.classList.toggle('on',b.dataset.b===k));
      if(wxLayer) wxLayer.redraw(); }
    const OVA=()=>({dark:0.46,color:0.5,pol:0.42,sat:0.5}[lab.base||'dark']);
    const wrap=lon=>((lon+180)%360+360)%360-180;
    function val(p){ const dly=lab.day>=0; if(!p) return null;
      if(lab.layer==='T') return dly?p.daily[lab.mm==='max'?'temperature_2m_max':'temperature_2m_min'][lab.day]:p.current.temperature_2m;
      if(lab.layer==='P') return dly?p.daily.precipitation_sum[lab.day]:p.current.precipitation;
      if(lab.layer==='W') return dly?p.daily.wind_speed_10m_max[lab.day]:p.current.wind_speed_10m;
      return dly?null:p.current.cloud_cover; }
    const wdir=p=>lab.day>=0?p.daily.wind_direction_10m_dominant[lab.day]:p.current.wind_direction_10m;
    function fmtV(v){ const u={T:'°C',P:' '+T(TX.mm),W:' '+T(TX.ms),C:'%'}[lab.layer]; return (lab.layer==='T'?tC(v).replace('°',''):fmt(v,lab.layer==='P'?1:0))+u; }
    // Ikki chiziqli interpolyatsiya: global 10° to'r + yaqinlashganda batafsil to'r (chetlari silliq qo'shiladi)
    function bil(get,fx,fy,nx,ny,wrapX){ const x0=Math.floor(fx), y0=Math.floor(fy), kx=fx-x0, ky=fy-y0;
      const X=i=>wrapX?((i%nx)+nx)%nx:Math.max(0,Math.min(nx-1,i)), Y=j=>Math.max(0,Math.min(ny-1,j));
      const a=get(Y(y0),X(x0)), b=get(Y(y0),X(x0+1)), c=get(Y(y0+1),X(x0)), d=get(Y(y0+1),X(x0+1)); if(a==null||b==null||c==null||d==null) return null;
      return (a*(1-kx)+b*kx)*(1-ky)+(c*(1-kx)+d*kx)*ky; }
    function gField(lat,lon,fn){ const gw=GLON.length, gh=GLAT.length; return bil((j,i)=>fn(G[j*gw+i]),(wrap(lon)+175)/10,(75-lat)/10,gw,gh,true); }
    function field(lat,lon,fn){ fn=fn||val; if(!G) return null; let v=gField(lat,lon,fn); if(v==null) return null;
      if(DET&&M&&M.getZoom()>=4){ const D=DET, ln=wrap(lon); if(lat<=D.n&&lat>=D.s&&ln>=D.w&&ln<=D.e){
        const fx=(ln-D.w)/(D.e-D.w)*(D.nx-1), fy=(D.n-lat)/(D.n-D.s)*(D.ny-1), dv=bil((j,i)=>fn(D.p[j*D.nx+i]),fx,fy,D.nx,D.ny,false);
        if(dv!=null){ const ed=Math.min(fx,D.nx-1-fx,fy,D.ny-1-fy), k=Math.max(0,Math.min(1,ed/1.2)); v=v+(dv-v)*k; } } }
      return v; }
    function paintTile(cv,c){ if(!G||!M) return; const ctx=cv.getContext('2d'), N=64, st=256/N, S=LEG[lab.layer][0];
      const sm=document.createElement('canvas'); sm.width=sm.height=N; const sx=sm.getContext('2d'), im=sx.createImageData(N,N), nw=c.scaleBy(LF.point(256,256));
      for(let j=0;j<N;j++){ const ll0=M.unproject(LF.point(nw.x,nw.y+(j+0.5)*st),c.z); for(let i=0;i<N;i++){ const ll=M.unproject(LF.point(nw.x+(i+0.5)*st,nw.y+(j+0.5)*st),c.z);
          const v=field(ll0.lat,ll.lng), k=(j*N+i)*4; if(v==null) continue; const col=ramp(S,v); im.data[k]=col[0]; im.data[k+1]=col[1]; im.data[k+2]=col[2]; im.data[k+3]=Math.round((col.length>3?col[3]*0.85:OVA())*255); } }
      sx.putImageData(im,0,0); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(sm,-st/2,-st/2,256+st,256+st);
      if(lab.layer==='W'){ const g=36, ox=((g/2-nw.x)%g+g)%g, oy=((g/2-nw.y)%g+g)%g; ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=1.3; ctx.lineCap='round';
        for(let py=oy;py<256;py+=g) for(let px=ox;px<256;px+=g){ const ll=M.unproject(LF.point(nw.x+px,nw.y+py),c.z), sp=field(ll.lat,ll.lng), dr=field(ll.lat,ll.lng,p=>p?wdir(p):null); if(sp==null||dr==null) continue;
          const Ln=Math.min(15,5+sp*0.8), a=(dr+180)*Math.PI/180, dx=Math.sin(a)*Ln, dy=-Math.cos(a)*Ln, hx=px+dx/2, hy=py+dy/2, aa=Math.atan2(dy,dx);
          ctx.beginPath(); ctx.moveTo(px-dx/2,py-dy/2); ctx.lineTo(hx,hy); ctx.moveTo(hx,hy); ctx.lineTo(hx-Math.cos(aa-0.5)*4.5,hy-Math.sin(aa-0.5)*4.5); ctx.moveTo(hx,hy); ctx.lineTo(hx-Math.cos(aa+0.5)*4.5,hy-Math.sin(aa+0.5)*4.5); ctx.stroke(); } } }
    // Yaqinlashganda ko'rinayotgan hudud uchun batafsil to'r (9×7 nuqta)
    const DETC={};
    async function fetchDetail(){ if(!M||!G||M.getZoom()<4) return; const b=M.getBounds(), z=M.getZoom(), q=z>=7?0.5:(z>=5?2:4);
      const n=Math.min(80,Math.ceil((b.getNorth()+ (b.getNorth()-b.getSouth())*0.1)/q)*q), s=Math.max(-80,Math.floor((b.getSouth()-(b.getNorth()-b.getSouth())*0.1)/q)*q);
      let w=Math.floor((wrap(b.getWest())-(b.getEast()-b.getWest())*0.1)/q)*q, e=Math.ceil((wrap(b.getWest())+(b.getEast()-b.getWest())*1.1)/q)*q; if(e-w>170){ return; } w=Math.max(-180,w); e=Math.min(180,e);
      const key=[n,s,w,e].join(','); if(DETC[key]&&Date.now()-DETC[key].t<20*60000){ DET=DETC[key].d; wxLayer.redraw(); detLabels(); return; }
      const nx=9, ny=7, la=[], lo=[]; for(let j=0;j<ny;j++) for(let i=0;i<nx;i++){ la.push(+(n-(n-s)*j/(ny-1)).toFixed(3)); lo.push(+(w+(e-w)*i/(nx-1)).toFixed(3)); }
      try{ const p=await getJSON(`${API}?latitude=${la.join(',')}&longitude=${lo.join(',')}&current=temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&forecast_days=5&wind_speed_unit=ms`,1);
        const d={n,s,w,e,nx,ny,p:Array.isArray(p)?p:[p],la,lo}; DETC[key]={t:Date.now(),d}; DET=d; wxLayer.redraw(); detLabels(); }catch(e){} }
    // Batafsil to'r qiymatlari xaritada (zoom ≥ 5)
    function detLabels(){ if(!detLayer) return; detLayer.clearLayers(); if(!DET||M.getZoom()<5) return; const b=M.getBounds().pad(-0.04), placed=[];
      DET.p.forEach((p,i)=>{ const v=val(p); if(v==null) return; const ll=LF.latLng(DET.la[i],DET.lo[i]); if(!b.contains(ll)) return;
        const pt=M.latLngToContainerPoint(ll); if(placed.some(q=>Math.abs(q.x-pt.x)<56&&Math.abs(q.y-pt.y)<26)) return; placed.push(pt);
        const col=lab.layer==='T'?rgba(ramp(TS,v)):'#e8edff';
        detLayer.addLayer(LF.marker(ll,{interactive:false,keyboard:false,icon:LF.divIcon({className:'wx-dv',iconSize:[0,0],html:`<span style="color:${col}">${esc(fmtV(v))}</span>`})})); }); }
    function cityMarkers(){ cityLayer.clearLayers(); cityMk=[]; if(!C) return; const dl=lab.day;
      WC.forEach((c,i)=>{ const p=C[i]; if(!p||!p.current) return; const t=dl<0?p.current.temperature_2m:p.daily[lab.mm==='min'?'temperature_2m_min':'temperature_2m_max'][dl], code=dl<0?p.current.weather_code:p.daily.weather_code[dl];
        const mk=LF.marker([c.lat,c.lon],{riseOnHover:true,icon:LF.divIcon({className:'wx-pinw',iconSize:[0,0],html:`<div class="wx-pin${c.p?' pr':''}"><span class="i">${wi(code,dl<0?p.current.is_day:1)}</span><b style="color:${rgba(ramp(TS,t))}">${tC(t)}</b><span class="n">${esc(T(c.n))}</span></div><i class="wx-pd"></i>`})});
        mk.bindTooltip(`<b>${esc(T(c.n))}</b><br>${esc(wd(code))} · ${tC(t)}${dl<0?' · '+fmt(p.current.wind_speed_10m,0)+' '+esc(T(TX.ms)):''}<br><small>${esc(T(TX.open5))}</small>`,{direction:'top',offset:[0,-26],className:'wx-tt'});
        mk.on('click',()=>openCity(c)); mk.addTo(cityLayer); cityMk.push({mk,c}); });
      const o=loc(); meLayer.clearLayers(); LF.marker([o.lat,o.lon],{interactive:false,icon:LF.divIcon({className:'wx-me',iconSize:[0,0],html:'<i></i>'})}).addTo(meLayer);
      setTimeout(declutter,0); }
    // Ustma-ust tushgan shahar belgilarini yashirish (asosiylari ustun)
    function declutter(){ if(!M) return; const placed=[]; [...cityMk].sort((a,b)=>b.c.p-a.c.p).forEach(({mk})=>{ const el=mk.getElement(); if(!el) return; const pin=el.firstElementChild; if(!pin) return;
      el.style.display=''; const r=pin.getBoundingClientRect(); const hit=placed.some(q=>r.left<q.right+3&&r.right+3>q.left&&r.top<q.bottom+3&&r.bottom+3>q.top);
      if(hit) el.style.display='none'; else placed.push(r); }); }
    async function pointPopup(ll){ if(!G) return; const lat=ll.lat, lon=wrap(ll.lng), v=field(lat,ll.lng);
      const id='wxPp'+Date.now(), pop=LF.popup({className:'wx-pop',maxWidth:240}).setLatLng(ll)
        .setContent(`<div class="wx-pp"><b id="${id}">${fmt(Math.abs(lat),2)}°${lat>=0?'N':'S'}, ${fmt(Math.abs(lon),2)}°${lon>=0?'E':'W'}</b>${v!=null?`<div class="v">${esc(T(TX['l'+lab.layer]))}: <b>${esc(fmtV(v))}</b></div>`:''}<button class="lab-chip" id="${id}b">${esc(T(TX.open5))} →</button></div>`).openOn(M);
      let nm={uz:null,ru:null,en:null};
      const go=()=>{ const f=fmt(Math.abs(lat),1)+'°, '+fmt(Math.abs(lon),1)+'°'; openCity({n:{uz:nm.uz||f,ru:nm.ru||nm.uz||f,en:nm.en||nm.uz||f},lat:+lat.toFixed(3),lon:+lon.toFixed(3)}); M.closePopup(); };
      setTimeout(()=>{ const b=document.getElementById(id+'b'); if(b) b.onclick=go; },0);
      try{ const j=await (await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+lat+'&longitude='+lon+'&localityLanguage='+L())).json();
        const name=[j.locality||j.city,j.countryName].filter((x,i,a)=>x&&a.indexOf(x)===i).join(', ') || j.localityInfo?.informative?.[0]?.name; if(name){ nm[L()]=name; nm.uz=nm.uz||name; const e=document.getElementById(id); if(e) e.textContent=name; } }catch(e){} }
    function renderWorld(){
      const el=$('wxWorld'); if(!C) return;
      if(lab.layer==='C'&&lab.day>=0) lab.day=-1;
      el.querySelectorAll('[data-l]').forEach(b=>b.classList.toggle('on',b.dataset.l===lab.layer));
      el.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===lab.mm));
      $('wxMM').style.display=(lab.layer==='T'&&lab.day>=0)?'':'none';
      const days=C[0].daily.time;
      $('wxDay').innerHTML=`<button class="lab-chip${lab.day<0?' on':''}" data-d="-1">● ${esc(T(TX.now))}</button>`+days.map((s,i)=>`<button class="lab-chip${lab.day===i?' on':''}" data-d="${i}"${lab.layer==='C'?' disabled':''}>${esc(dayLbl(s,i))}</button>`).join('');
      $('wxDay').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{ lab.day=+b.dataset.d; click(760); renderWorld(); });
      if(M){ wxLayer.redraw(); cityMarkers(); detLabels(); }
      const [S,u]=LEG[lab.layer], lo=S[0][0], hi=S[S.length-1][0];
      $('wxLeg').innerHTML=`<div class="wx-lb" style="background:linear-gradient(90deg,${S.map(s=>rgba(s[1].length>3?[...s[1].slice(0,3),Math.max(.25,s[1][3])]:s[1])+' '+((s[0]-lo)/(hi-lo)*100)+'%').join(',')})"></div><div class="wx-lt">${S.map(s=>`<span style="left:${(s[0]-lo)/(hi-lo)*100}%">${s[0]}</span>`).join('')}<em>${u}</em></div>`;
      const rows=WC.map((c,i)=>({c,p:C[i]})).filter(r=>r.p&&r.p.current);
      const tv=r=>lab.day<0?r.p.current.temperature_2m:r.p.daily[lab.mm==='min'?'temperature_2m_min':'temperature_2m_max'][lab.day];
      const sorted=[...rows].sort((a,b)=>tv(b)-tv(a));
      $('wxExt').innerHTML=`<span>🔥 ${esc(T(TX.hot))}: <b>${esc(T(sorted[0].c.n))} ${tC(tv(sorted[0]))}</b></span><span>🧊 ${esc(T(TX.cold))}: <b>${esc(T(sorted[sorted.length-1].c.n))} ${tC(tv(sorted[sorted.length-1]))}</b></span>`;
      $('wxCities').innerHTML=rows.map(r=>{ const p=r.p, dl=lab.day; const code=dl<0?p.current.weather_code:p.daily.weather_code[dl], dy=dl<0?p.current.is_day:1;
        const t=dl<0?`<b>${tC(p.current.temperature_2m)}</b>`:`<b>${tC(p.daily.temperature_2m_max[dl])}</b><span>${tC(p.daily.temperature_2m_min[dl])}</span>`;
        const lt=(p.current.time||'').slice(11,16);
        return `<button class="wx-city" data-i="${WC.indexOf(r.c)}" title="${esc(T(TX.open5))}"><span class="wx-ci">${wi(code,dy)}</span><span class="wx-cn"><b>${esc(T(r.c.n))}</b><small>${esc(wd(code))}${dl<0&&lt?' · '+lt:''}</small></span><span class="wx-ct">${t}</span></button>`; }).join('');
      $('wxCities').querySelectorAll('.wx-city').forEach(b=>b.onclick=()=>openCity(WC[+b.dataset.i]));
    }
    /* ---- O'zbekiston: viloyatlar, shaharlar va tumanlar kesimida ---- */
    const NM=a=>({uz:a[0],ru:a[1],en:a[2]}), isCity=d=>/shahri$/.test(d[0])||/City$/.test(d[2]);
    lab.uzR=lab.uzR||''; lab.uzF=lab.uzF||'all'; lab.uzS=lab.uzS||'name'; lab.uzQ='';
    async function uzData(pts,key,force){ const k='U'+key; if(!force&&fresh(k)) return CACHE[k].d;
      const d=await getJSON(`${API}?latitude=${pts.map(p=>p[0]).join(',')}&longitude=${pts.map(p=>p[1]).join(',')}&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTashkent&forecast_days=1&wind_speed_unit=ms`);
      const arr=Array.isArray(d)?d:[d]; CACHE[k]={t:Date.now(),d:arr}; return arr; }
    function loadAdm(){ if(window.UZ_ADM) return Promise.resolve(window.UZ_ADM);
      return new Promise((ok,no)=>{ const sc=document.createElement('script'); sc.src='labs/uz-adm.js'; sc.onload=()=>ok(window.UZ_ADM); sc.onerror=no; document.head.appendChild(sc); }); }
    async function loadUz(force){
      const el=$('wxUz'); let A; try{ A=await loadAdm(); }catch(e){ failed(el,loadUz); return; }
      if(!el.dataset.built){ el.dataset.built=1;
        el.innerHTML=`<div class="wx-uzc"><label class="wx-fl"><span>${esc(T(TX.region))}</span><select class="lab-date lab-loc" id="uzR"></select></label>
            <label class="wx-fl"><span>${esc(T(TX.place))}</span><select class="lab-date lab-loc" id="uzP"></select></label>
            <label class="wx-fl wx-q"><span>&nbsp;</span><input class="lab-date" id="uzQ" type="search" placeholder="${esc(T(TX.search))}" /></label></div>
          <div class="lab-row wx-uzf" id="uzBar"><div class="wx-seg" id="uzF">${['all','city','dist'].map(k=>`<button class="lab-chip" data-f="${k}">${esc(T(TX['f'+{all:'All',city:'City',dist:'Dist'}[k]]))}</button>`).join('')}</div>
            <div class="wx-seg" id="uzS"><button class="lab-chip" data-s="name">${esc(T(TX.sName))}</button><button class="lab-chip" data-s="temp">${esc(T(TX.sTemp))} ↓</button></div></div>
          <div id="uzSum"></div><div id="uzBody"></div>`;
        $('uzR').onchange=e=>{ lab.uzR=e.target.value; click(760); loadUz(false); };
        $('uzP').onchange=e=>{ const v=e.target.value; if(!v) return; const [ri,di]=v.split(':').map(Number), d=A[ri].d[di]; openCity({n:NM(d),lat:d[3],lon:d[4]},'uz'); };
        $('uzQ').oninput=e=>{ lab.uzQ=e.target.value.trim().toLowerCase(); renderUz(); };
        el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{ lab.uzF=b.dataset.f; click(720); renderUz(); });
        el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ lab.uzS=b.dataset.s; click(720); renderUz(); });
      }
      const ri=A.findIndex(r=>r.k===lab.uzR);
      $('uzR').innerHTML=`<option value="">${esc(T(TX.allReg))}</option>`+A.map(r=>`<option value="${r.k}"${r.k===lab.uzR?' selected':''}>${esc(T(NM(r.n)))}</option>`).join('');
      $('uzP').innerHTML=`<option value="">${esc(T(TX.pick))}</option>`+(ri<0?A.map((r,i)=>`<optgroup label="${esc(T(NM(r.n)))}">${r.d.map((d,j)=>`<option value="${i}:${j}">${esc(T(NM(d)))}</option>`).join('')}</optgroup>`).join('')
        :A[ri].d.map((d,j)=>`<option value="${ri}:${j}">${esc(T(NM(d)))}</option>`).join(''));
      $('uzBar').style.display=ri<0?'none':'';
      const body=$('uzBody'); const pts=ri<0?A.map(r=>r.c):A[ri].d.map(d=>[d[3],d[4]]), key=ri<0?'all':A[ri].k;
      if(!fresh('U'+key)||force) body.innerHTML=`<div class="wx-msg"><span class="wx-spin"></span>${esc(T(TX.load))}</div>`;
      try{ lab.uzD=await uzData(pts,key,force); }catch(e){ body.innerHTML=`<div class="wx-msg">${e.message==='rate'?'⏳ '+esc(T(TX.rate)):'⚠ '+esc(T(TX.err))} <button class="lab-chip" id="uzRetry">${esc(T(TX.retry))}</button></div>`; $('uzRetry').onclick=()=>loadUz(true); return; }
      lab.uzRi=ri; if(lab.tab==='uz'){ upd(CACHE['U'+key].t); renderUz(); }
    }
    function renderUz(){
      const A=window.UZ_ADM, ri=lab.uzRi, D=lab.uzD; if(!A||!D) return;
      const el=$('wxUz'); el.querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===lab.uzF)); el.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===lab.uzS));
      const card=(o,i)=>{ const p=D[i]; if(!p||!p.current) return ''; const c=p.current, dl=p.daily;
        return `<button class="wx-uzr" data-i="${i}"><span class="wx-ci">${wi(c.weather_code,c.is_day)}</span>
          <span class="wx-cn"><b>${esc(o.name)}</b><small>${esc(o.sub)}</small></span>
          <span class="wx-uzx"><span>${arrow(c.wind_direction_10m)} ${fmt(c.wind_speed_10m,1)} ${esc(T(TX.ms))}</span><span>💧 ${fmt(dl.precipitation_probability_max[0]??0,0)}% · ${fmt(c.relative_humidity_2m,0)}%</span></span>
          <span class="wx-ct"><b style="color:${rgba(ramp(TS,c.temperature_2m))}">${tC(c.temperature_2m)}</b><span>↑${tC(dl.temperature_2m_max[0])} ↓${tC(dl.temperature_2m_min[0])}</span></span></button>`; };
      let rows;
      if(ri<0) rows=A.map((r,i)=>{ const cd=r.d.find(d=>d[3]===r.c[0]&&d[4]===r.c[1]); return {i,name:T(NM(r.n)),sub:(cd?T(NM(cd)):'')+' · '+T(TX.cap)+' · '+r.d.length+' '+T(TX.nPlaces),t:D[i]&&D[i].current?D[i].current.temperature_2m:-99,city:true}; });
      else rows=A[ri].d.map((d,i)=>({i,name:T(NM(d)),sub:wd(D[i]&&D[i].current?D[i].current.weather_code:3),t:D[i]&&D[i].current?D[i].current.temperature_2m:-99,city:isCity(d)}));
      if(ri>=0&&lab.uzF!=='all') rows=rows.filter(r=>lab.uzF==='city'?r.city:!r.city);
      if(lab.uzQ) rows=rows.filter(r=>r.name.toLowerCase().includes(lab.uzQ));
      if(lab.uzS==='temp'||ri<0&&lab.uzS==='temp') rows.sort((a,b)=>b.t-a.t); else if(ri>=0) rows.sort((a,b)=>a.name.localeCompare(b.name,L()));
      const ts=rows.map(r=>r.t).filter(t=>t>-90);
      if(ts.length){ const mx=rows.reduce((a,b)=>b.t>a.t?b:a), mn=rows.reduce((a,b)=>b.t<a.t?b:a);
        $('uzSum').innerHTML=`<div class="wx-ext wx-uzs"><span>${ri<0?'🇺🇿':'📍'} <b>${esc(ri<0?T(TX.uz):T(NM(A[ri].n)))}</b></span><span>${esc(T(TX.avg))}: <b>${tC(ts.reduce((a,b)=>a+b,0)/ts.length)}</b></span><span>🔥 ${esc(mx.name)} <b>${tC(mx.t)}</b></span><span>🧊 ${esc(mn.name)} <b>${tC(mn.t)}</b></span></div>`; }
      else $('uzSum').innerHTML='';
      $('uzBody').innerHTML=`<div class="wx-uzl">${rows.map(r=>card(r,r.i)).join('')}</div>`;
      $('uzBody').querySelectorAll('.wx-uzr').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i;
        if(ri<0){ lab.uzR=A[i].k; click(760); loadUz(false); } else { const d=A[ri].d[i]; openCity({n:NM(d),lat:d[3],lon:d[4]},'uz'); } });
    }
    lab.resize=()=>{ if(lab.tab==='here'){ const p=lab.place||loc(), k='L'+p.lat.toFixed(2)+','+p.lon.toFixed(2); if(CACHE[k]) drawHourly(CACHE[k].d); } };
    window.addEventListener('resize',()=>{ if(lab.isOpen) lab.resize(); });
    lab.mapFix=()=>{ if(M) setTimeout(()=>M.invalidateSize(),80); };
    lab.show=show; show();
  },
  open(){ this.show&&this.show(); }
});
// Yuqori paneldagi ⛅ tugmasi
function hook(){ const b=document.getElementById('weatherBtn'); if(!b) return; b.addEventListener('click',()=>{ click(720); window.LAB.openLab('weather'); }); b.title=T(TX.name); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook); else hook();
})();
