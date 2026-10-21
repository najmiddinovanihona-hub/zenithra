/* DARSLIK · 12-mavzu (33-§). Nurlanish qonunlari va spektral metodlar */
(function(){
const go0=()=>{ if(!window.DZK||!window.DARSLIK) return setTimeout(go0,50); const K0=window.DZK, X=K0.X, TAU=K0.TAU;
const STARS=[[X('Betelgeyze','Бетельгейзе','Betelgeuse'),3500],[X('Quyosh','Солнце','Sun'),5800],[X('Sirius','Сириус','Sirius'),9900],[X('Rigel','Ригель','Rigel'),12100],[X('Qizdirilgan temir','Раскалённое железо','Red-hot iron'),1100]];
const LINES=[[X('Hα (vodorod)','Hα (водород)','Hα (hydrogen)'),656.28],[X('Hβ (vodorod)','Hβ (водород)','Hβ (hydrogen)'),486.13],[X('Na D (natriy)','Na D (натрий)','Na D (sodium)'),589.0],[X('Ca K (kalsiy)','Ca K (кальций)','Ca K (calcium)'),393.37]];
const FRA=[393.4,396.8,430.8,486.1,517.3,527.0,589.0,589.6,656.3,686.7];
const TX={
 title:X('Nurlanish qonunlari. Spektral metodlar','Законы излучения. Спектральные методы','Laws of radiation. Spectral methods'),
 sub:X('33-§ · Stefan–Bolsman va Vin qonunlari, tutash va yutilish spektrlari, Dopler effekti, Zeeman effekti','§33 · Законы Стефана–Больцмана и Вина, сплошной и линейчатый спектры, эффект Доплера, эффект Зеемана','§33 · Stefan–Boltzmann and Wien laws, continuous and absorption spectra, the Doppler effect, the Zeeman effect'),
 intro:X('Ko‘pchilik osmon yoritgichlarining nurlanishi ular haqidagi fizik ma’lumotlarning manbayi. Nurlanish spektrini o‘rganib, manbaning <b>kimyoviy tarkibi, temperaturasi, magnit maydoni</b> va qarash chizig‘i bo‘ylab harakat tezligi (<b>nuriy tezlik</b>) aniqlanadi. Bu metod — <b>spektral analiz</b>, u yorug‘likning dispersiya hodisasiga asoslangan.','Излучение большинства светил — источник физических сведений о них. Изучая спектр, определяют <b>химический состав, температуру, магнитное поле</b> и скорость вдоль луча зрения (<b>лучевую скорость</b>). Этот метод — <b>спектральный анализ</b>, он основан на дисперсии света.','The light of most celestial bodies is our source of physical facts about them. Its spectrum reveals <b>composition, temperature, magnetic field</b> and speed along the line of sight (<b>radial velocity</b>). This is <b>spectral analysis</b>, based on the dispersion of light.'),
 s1:X('Stefan–Bolsman va Vin qonunlari','Законы Стефана–Больцмана и Вина','Stefan–Boltzmann and Wien laws'),
 s1D:X('Qizdirilgan jism sirtining 1 m² yuzasidan chiqayotgan energiya absolut temperaturaning 4-darajasiga proporsional: <b>ε = σT⁴</b>, σ = 5,67·10⁻⁸ J/(m²·K⁴·s). Jism qip-qizil qizdirilsa, spektrning qizil qismi ravshan; yanada qizdirilsa, ravshan soha sariq, yashil, keyin havorangga siljiydi. Nurlanish maksimumiga mos to‘lqin uzunligi temperaturaga bog‘liq — <b>Vin qonuni</b>: λ_max·T = 0,29 sm·K.','Энергия, излучаемая 1 м² поверхности нагретого тела, пропорциональна четвёртой степени абсолютной температуры: <b>ε = σT⁴</b>, σ = 5,67·10⁻⁸ Дж/(м²·К⁴·с). При нагреве докрасна ярче красная часть спектра; при дальнейшем нагреве яркая область смещается к жёлтой, зелёной, затем голубой. Длина волны максимума зависит от температуры — <b>закон Вина</b>: λ_max·T = 0,29 см·К.','Energy radiated by 1 m² of a hot body is proportional to the fourth power of its absolute temperature: <b>ε = σT⁴</b>, σ = 5.67·10⁻⁸ J/(m²·K⁴·s). Red-hot, the red end is brightest; hotter, the bright region moves to yellow, green, then blue. The wavelength of peak emission depends on temperature — <b>Wien’s law</b>: λ_max·T = 0.29 cm·K.'),
 temp:X('Temperatura T','Температура T','Temperature T'), peak:X('Maksimum λ_max','Максимум λ_max','Peak λ_max'), eps:X('Nurlanish ε = σT⁴','Излучение ε = σT⁴','Emission ε = σT⁴'), vsSun:X('Quyosh sirtiga nisbatan','Относительно Солнца','Relative to the Sun'), col:X('Ko‘rinma rangi','Видимый цвет','Apparent colour'),
 s2:X('Tutash va yutilish spektrlari','Сплошной и линейчатый спектры','Continuous and absorption spectra'),
 s2D:X('Quyosh va yulduzlar qaynoq gaz bilan qoplangan. Ularning <b>uzluksiz (tutash) spektri</b> atmosferadan o‘tishda u yerdagi atomlar tomonidan yutiladi va <b>qora chiziqlar</b> bilan kesilgan <b>yutilish spektri</b> ko‘rinishini oladi. Shuning uchun Quyosh va yulduzlarning spektri — yutilish spektrlari (43-rasm). Har bir kimyoviy element o‘z chiziqlarini beradi.','Солнце и звёзды окружены горячим газом. Их <b>сплошной спектр</b>, проходя через атмосферу, поглощается атомами и превращается в <b>спектр поглощения</b>, пересечённый <b>тёмными линиями</b>. Поэтому спектры Солнца и звёзд — спектры поглощения (рис. 43). Каждый элемент даёт свои линии.','The Sun and stars are wrapped in hot gas. Their <b>continuous spectrum</b> is absorbed by atoms as it passes through, becoming an <b>absorption spectrum</b> crossed by <b>dark lines</b>. So solar and stellar spectra are absorption spectra (Fig. 43). Every element produces its own lines.'),
 cont:X('1 · Tutash spektr','1 · Сплошной спектр','1 · Continuous'), comp:X('2–4 · Solishtirish (nurlanish) spektrlari: H, Na, Ca','2–4 · Спектры сравнения (излучения): H, Na, Ca','2–4 · Comparison (emission) spectra: H, Na, Ca'), sun:X('5 · Quyoshning chiziqli spektri','5 · Линейчатый спектр Солнца','5 · Solar line spectrum'),
 s3:X('Dopler effekti: nuriy tezlik','Эффект Доплера: лучевая скорость','The Doppler effect: radial velocity'),
 s3D:X('Manba Yerga <b>yaqinlashsa</b>, spektridagi chiziqlar qisqa to‘lqinli (binafsha) tomonga, <b>uzoqlashsa</b> — uzun to‘lqinli (qizil) tomonga siljiydi: <b>λ = λ₀(1 + υ/c)</b> yoki <b>υ = c·(λ − λ₀)/λ₀</b>, bunda λ₀ — qo‘zg‘almas manba to‘lqin uzunligi, λ — harakatdagi manbaniki, c — yorug‘lik tezligi.','Если источник <b>приближается</b>, линии смещаются к коротким (фиолетовым) волнам, если <b>удаляется</b> — к длинным (красным): <b>λ = λ₀(1 + υ/c)</b>, или <b>υ = c·(λ − λ₀)/λ₀</b>, где λ₀ — длина волны неподвижного источника, λ — движущегося, c — скорость света.','If the source <b>approaches</b>, lines shift toward short (violet) wavelengths; if it <b>recedes</b>, toward long (red) ones: <b>λ = λ₀(1 + υ/c)</b>, or <b>υ = c·(λ − λ₀)/λ₀</b>, where λ₀ is the rest wavelength, λ the observed one and c the speed of light.'),
 v:X('Nuriy tezlik υ','Лучевая скорость υ','Radial velocity υ'), line:X('Chiziq','Линия','Line'), shift:X('Siljish Δλ','Сдвиг Δλ','Shift Δλ'), dir:X('Yo‘nalish','Направление','Direction'),
 appr:X('yaqinlashmoqda — binafsha siljish','приближается — фиолетовое смещение','approaching — blueshift'), rec:X('uzoqlashmoqda — qizil siljish','удаляется — красное смещение','receding — redshift'), rest:X('qo‘zg‘almas','неподвижен','at rest'),
 lab:X('laboratoriya λ₀','лаборатория λ₀','laboratory λ₀'), star:X('yulduz λ','звезда λ','star λ'),
 s4:X('Zeeman effekti: magnit maydon','Эффект Зеемана: магнитное поле','The Zeeman effect: magnetic fields'),
 s4D:X('Nurlanayotgan plazma atomlari magnit maydonida (ayniqsa Quyosh dog‘i yadrosida) bo‘lsa, spektral chiziq bo‘laklarga bo‘linadi — <b>Zeeman effekti</b>. Maydon kuchlanganligi vektori qarash chizig‘iga nisbatan qanday joylashganiga qarab chiziq <b>ikkita yoki uchta</b> komponentaga bo‘linadi. Kuchlanganlik chetki komponentalar orasidagi Δλ ga proporsional: <b>H = k·Δλ_H</b>, k — chiziqning magnit sezgirligiga bog‘liq koeffitsiyent.','Если излучающие атомы плазмы находятся в магнитном поле (особенно в ядре солнечного пятна), спектральная линия расщепляется — <b>эффект Зеемана</b>. В зависимости от ориентации вектора поля относительно луча зрения линия делится на <b>две или три</b> компоненты. Напряжённость пропорциональна расстоянию Δλ между крайними компонентами: <b>H = k·Δλ_H</b>, k зависит от магнитной чувствительности линии.','When radiating plasma atoms sit in a magnetic field (especially in a sunspot core), a spectral line splits — the <b>Zeeman effect</b>. Depending on how the field vector lies relative to the line of sight, it splits into <b>two or three</b> components. Field strength is proportional to the gap Δλ between the outer components: <b>H = k·Δλ_H</b>, with k depending on the line’s magnetic sensitivity.'),
 B:X('Magnit maydon','Магнитное поле','Magnetic field'), view:X('Qarash yo‘nalishi','Направление наблюдения','Viewing direction'), along:X('maydon bo‘ylab — 2 komponenta','вдоль поля — 2 компоненты','along the field — 2 components'), across:X('maydonga tik — 3 komponenta','поперёк поля — 3 компоненты','across the field — 3 components'), dl:X('Chetki komponentalar orasi Δλ','Расстояние крайних компонент Δλ','Outer-component gap Δλ'), spot:X('Quyosh dog‘i: 0,1–0,4 T','Солнечное пятно: 0,1–0,4 Тл','Sunspot: 0.1–0.4 T')
};
const GL=[
 [X('Spektral analiz','Спектральный анализ','Spectral analysis'),X('Yoritgich spektriga ko‘ra uning tarkibi, temperaturasi, magnit maydoni va nuriy tezligini aniqlash.','Определение состава, температуры, магнитного поля и лучевой скорости светила по спектру.','Finding a body’s composition, temperature, magnetic field and radial velocity from its spectrum.')],
 [X('Stefan–Bolsman qonuni','Закон Стефана–Больцмана','Stefan–Boltzmann law'),X('ε = σT⁴: 1 m² sirt nurlanishi T⁴ ga proporsional.','ε = σT⁴: излучение 1 м² поверхности ∝ T⁴.','ε = σT⁴: emission per m² ∝ T⁴.')],
 [X('Vin qonuni','Закон Вина','Wien’s law'),X('λ_max·T = 0,29 sm·K — issiqroq jism qisqaroq to‘lqinda eng ko‘p nurlanadi.','λ_max·T = 0,29 см·К — горячее тело ярче всего в более коротких волнах.','λ_max·T = 0.29 cm·K — hotter bodies peak at shorter wavelengths.')],
 [X('Yutilish spektri','Спектр поглощения','Absorption spectrum'),X('Atmosfera atomlari yutgan qora chiziqlar bilan kesilgan tutash spektr.','Сплошной спектр, пересечённый тёмными линиями поглощения атомов атмосферы.','A continuous spectrum crossed by dark lines absorbed by atmospheric atoms.')],
 [X('Nuriy tezlik','Лучевая скорость','Radial velocity'),X('Jismning qarash chizig‘i bo‘ylab tezligi; υ = c·(λ − λ₀)/λ₀.','Скорость тела вдоль луча зрения; υ = c·(λ − λ₀)/λ₀.','Velocity along the line of sight; υ = c·(λ − λ₀)/λ₀.')],
 [X('Zeeman effekti','Эффект Зеемана','Zeeman effect'),X('Magnit maydonda spektral chiziqning 2 yoki 3 komponentaga bo‘linishi; H = k·Δλ_H.','Расщепление линии в магнитном поле на 2 или 3 компоненты; H = k·Δλ_H.','A line splitting into 2 or 3 components in a magnetic field; H = k·Δλ_H.')]
];
const QA=[
 [X('Optik nurlar elektromagnit to‘lqinlar shkalasida qanday intervalda yotadi?','В каком интервале шкалы ЭМ-волн лежат оптические лучи?','Where do optical rays lie on the EM scale?'),X('Ko‘rinadigan nurlar ≈ 0,4–0,7 mkm; optik diapazon yaqin ultrabinafsha va infraqizilni ham o‘z ichiga oladi (≈ 0,3–1 mkm).','Видимые ≈ 0,4–0,7 мкм; оптический диапазон включает и ближние УФ и ИК (≈ 0,3–1 мкм).','Visible light ≈ 0.4–0.7 µm; the optical range also covers near UV and IR (≈ 0.3–1 µm).')],
 [X('Shkalada ko‘rinadigan va ko‘rinmaydigan nurlar qanday sohalarni egallaydi?','Какие области занимают видимые и невидимые лучи?','Which regions do visible and invisible rays occupy?'),X('Ko‘rinadigan — tor 0,4–0,7 mkm oraliq; qisqaroq tomonda ultrabinafsha, rentgen, gamma; uzunroq tomonda infraqizil va radio.','Видимые — узкий интервал 0,4–0,7 мкм; короче — УФ, рентген, гамма; длиннее — ИК и радио.','Visible is the narrow 0.4–0.7 µm band; shorter lie UV, X-ray, gamma; longer lie infrared and radio.')],
 [X('Hozir yoritgichlar shkalaning qaysi to‘lqin uzunliklarida o‘rganiladi?','На каких длинах волн сейчас изучают светила?','At which wavelengths are bodies studied today?'),X('Barcha diapazonlarda: optik va radio Yerdan, ultrabinafsha, rentgen va gamma — kosmik stansiyalardagi teleskoplardan, infraqizil va radio — maxsus qayd qilgichlar bilan.','Во всех: оптика и радио — с Земли, УФ, рентген и гамма — с космических телескопов, ИК и радио — специальными приёмниками.','All of them: optical and radio from the ground, UV, X-ray and gamma from space telescopes, infrared and radio with special detectors.')],
 [X('Spektrdagi nurlanish maksimumiga ko‘ra temperatura qanday aniqlanadi?','Как по максимуму излучения определить температуру?','How is temperature found from the spectrum’s peak?'),X('Vin qonuni bilan: T = 0,29 sm·K / λ_max.','По закону Вина: T = 0,29 см·К / λ_max.','With Wien’s law: T = 0.29 cm·K / λ_max.')],
 [X('Manbaning magnit maydoni kuchlanganligi spektrdan qanday topiladi?','Как найти напряжённость магнитного поля по спектру?','How is magnetic field strength found from a spectrum?'),X('Zeeman effekti bo‘yicha: chiziqning chetki komponentalari orasidagi Δλ o‘lchanadi, H = k·Δλ_H.','По эффекту Зеемана: измеряют Δλ между крайними компонентами, H = k·Δλ_H.','From the Zeeman effect: measure Δλ between the outer components, H = k·Δλ_H.')]
];
const QZ=[
 [X('Stefan–Bolsman qonuni:','Закон Стефана–Больцмана:','Stefan–Boltzmann law:'),[X('ε = σT⁴','ε = σT⁴','ε = σT⁴'),X('ε = σT²','ε = σT²','ε = σT²'),X('λT = const','λT = const','λT = const')]],
 [X('Temperatura 2 marta oshsa, 1 m² nurlanishi:','Если T вырастет в 2 раза, излучение 1 м²:','If T doubles, emission per m²:'),[X('16 marta oshadi','вырастет в 16 раз','rises 16×'),X('2 marta oshadi','вырастет в 2 раза','rises 2×'),X('4 marta oshadi','вырастет в 4 раза','rises 4×')]],
 [X('Quyosh (T ≈ 5800 K) nurlanish maksimumi:','Максимум излучения Солнца (T ≈ 5800 K):','The Sun’s (T ≈ 5800 K) peak:'),[X('≈ 500 nm','≈ 500 нм','≈ 500 nm'),X('≈ 1000 nm','≈ 1000 нм','≈ 1000 nm'),X('≈ 200 nm','≈ 200 нм','≈ 200 nm')]],
 [X('Quyosh spektri qanday spektr?','Каков спектр Солнца?','What kind of spectrum is the Sun’s?'),[X('Yutilish spektri','Спектр поглощения','Absorption'),X('Faqat tutash','Только сплошной','Purely continuous'),X('Nurlanish chiziqlari','Линии излучения','Emission lines')]],
 [X('Yulduz spektri qizil tomonga siljigan. Yulduz:','Спектр звезды смещён в красную сторону. Звезда:','A star’s spectrum is redshifted. The star is:'),[X('uzoqlashmoqda','удаляется','receding'),X('yaqinlashmoqda','приближается','approaching'),X('qizimoqda','нагревается','heating up')]],
 [X('Hα (656,3 nm) chizig‘i 656,5 nm da kuzatildi. υ ≈','Линия Hα (656,3 нм) наблюдается на 656,5 нм. υ ≈','Hα (656.3 nm) is seen at 656.5 nm. υ ≈'),[X('+91 km/s','+91 км/с','+91 km/s'),X('−91 km/s','−91 км/с','−91 km/s'),X('+0,2 km/s','+0,2 км/с','+0.2 km/s')]],
 [X('Zeeman effekti nimani o‘lchashga imkon beradi?','Что позволяет измерить эффект Зеемана?','What does the Zeeman effect measure?'),[X('Magnit maydonni','Магнитное поле','Magnetic field'),X('Temperaturani','Температуру','Temperature'),X('Masofani','Расстояние','Distance')]]
];
const wlRGB=l=>{ let r=0,g=0,b=0; if(l<440){ r=-(l-440)/60; b=1; } else if(l<490){ g=(l-440)/50; b=1; } else if(l<510){ g=1; b=-(l-510)/20; } else if(l<580){ r=(l-510)/70; g=1; } else if(l<645){ r=1; g=-(l-645)/65; } else r=1; const f=l<420?.3+.7*(l-380)/40:l>700?.3+.7*(780-l)/80:1; return [r*f,g*f,b*f].map(v=>Math.round(255*Math.max(0,Math.min(1,v)))); };
const planck=(lnm,T)=>{ const l=lnm*1e-9; return 1/(l**5*(Math.exp(0.014388/(l*T))-1)); };
function build(el, api){
  const K=K0.kit(el,api), {T,click,$,fmtN,C,fit,sec,chips,mark,on,kv}=K;
  const lbl=(x,s,px,py,col,al)=>{ x.fillStyle=col; x.font='600 11px system-ui,sans-serif'; x.textAlign=al||'center'; x.fillText(s,px,py); };
  const strip=(x,a,y,w,hh,fn)=>{ for(let i=0;i<w;i++){ const l=380+i/w*400, c=wlRGB(l), k=fn(l); x.fillStyle=`rgb(${c[0]*k|0},${c[1]*k|0},${c[2]*k|0})`; x.fillRect(a+i,y,1.2,hh); } };
  el.innerHTML=`
  <section class="dz-sec dz-card t1-hero"><p class="t1-def t2-intro">${T(TX.intro)}</p></section>
  ${sec('01',TX.s1,`<p class="t1-p">${T(TX.s1D)}</p><div class="t1-formula">ε = σT⁴ · λ_max · T = 0,29 sm·K</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t12P"></canvas></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.temp)}: <b id="t12TV"></b></span><input type="range" class="lab-range" id="t12T" min="800" max="15000" step="50" value="5800"></label>
        <div class="lab-row" style="margin:0">${chips('st',STARS.map((s,i)=>[i,T(s[0])]))}</div>
        <div class="t12-sw" id="t12Sw"></div><div class="lab-kv" id="t12PKv"></div></div></div>`)}
  ${sec('02',TX.s2,`<p class="t1-p">${T(TX.s2D)}</p><div class="dz-card t1-chart"><canvas class="t1-cv" id="t12Sp"></canvas></div>`)}
  ${sec('03',TX.s3,`<p class="t1-p">${T(TX.s3D)}</p><div class="t1-formula">υ = c · (λ − λ₀) / λ₀</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t12D"></canvas></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.v)}: <b id="t12VV"></b></span><input type="range" class="lab-range" id="t12V" min="-3000" max="3000" step="10" value="1200"></label>
        <div class="lab-row" style="margin:0"><span class="t1-lab">${T(TX.line)}</span>${chips('ln',LINES.map((l,i)=>[i,T(l[0])]))}</div><div class="lab-kv" id="t12DKv"></div></div></div>`)}
  ${sec('04',TX.s4,`<p class="t1-p">${T(TX.s4D)}</p><div class="t1-formula">H = k · Δλ_H</div>
    <div class="t1-split"><div class="dz-card t1-chart"><canvas class="t1-cv" id="t12Z"></canvas><p class="t1-cap">${T(TX.spot)}</p></div>
      <div class="t1-side"><label class="t1-ctl"><span>${T(TX.B)}: <b id="t12BV"></b></span><input type="range" class="lab-range" id="t12B" min="0" max="0.5" step="0.005" value="0.25"></label>
        <div class="lab-row" style="margin:0">${chips('zv',[['l',T(TX.along)],['t',T(TX.across)]])}</div><div class="lab-kv" id="t12ZKv"></div></div></div>`)}
  ${sec('05',K.U.gl,K.glHTML(GL))}
  ${sec('06',K.U.qa,K.qaHTML(QA))}
  ${sec('07',K.U.test,`<div class="dz-card t1-quiz" id="t12Quiz"></div>`)}`;

  /* 01 · Planck egri chizig'i */
  const drawP=K.draw(function(){ const cv=$('#t12P'); const {x,w,h}=fit(cv,.62,360), c=C(), Tk=+$('#t12T').value, pl=36, pr=12, pt=12, pb=40, L1=3000, sx=l=>pl+l/L1*(w-pl-pr);
    const pk=0.0029/Tk*1e9, ymax=planck(Math.max(100,pk),Tk), sy=v=>pt+(1-v/ymax)*(h-pt-pb);
    strip(x,sx(380),h-pb+6,sx(780)-sx(380),10,()=>1);
    x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,h-pb); x.lineTo(w-pr,h-pb); x.stroke();
    [0,500,1000,1500,2000,2500,3000].forEach(l=>lbl(x,String(l),sx(l),h-pb+30,c.dim));
    lbl(x,'λ, nm',w-pr,h-pb-6,c.dim,'right');
    x.fillStyle=c.day?'rgba(45,92,174,.12)':'rgba(78,168,255,.14)'; x.beginPath(); x.moveTo(sx(50),h-pb); for(let l=50;l<=L1;l+=8) x.lineTo(sx(l),sy(planck(l,Tk))); x.lineTo(sx(L1),h-pb); x.closePath(); x.fill();
    x.strokeStyle=c.neon; x.lineWidth=2.2; x.beginPath(); for(let l=50;l<=L1;l+=8){ const yy=sy(planck(l,Tk)); l===50?x.moveTo(sx(l),yy):x.lineTo(sx(l),yy); } x.stroke();
    if(Tk!==5800){ x.strokeStyle=c.gold; x.setLineDash([4,4]); x.lineWidth=1.3; x.beginPath(); for(let l=50;l<=L1;l+=10){ const yy=Math.max(pt,sy(planck(l,5800))); l===50?x.moveTo(sx(l),yy):x.lineTo(sx(l),yy); } x.stroke(); x.setLineDash([]); }
    if(pk<L1){ x.strokeStyle=c.text; x.setLineDash([3,3]); x.beginPath(); x.moveTo(sx(pk),pt); x.lineTo(sx(pk),h-pb); x.stroke(); x.setLineDash([]); lbl(x,'λ_max = '+fmtN(pk)+' nm',Math.min(sx(pk)+6,w-110),pt+12,c.text,'left'); }
    let r=0,g=0,b=0,n=0; for(let l=400;l<=700;l+=5){ const p=planck(l,Tk), cc=wlRGB(l); r+=cc[0]*p; g+=cc[1]*p; b+=cc[2]*p; } const m=Math.max(r,g,b); const sw=`rgb(${255*r/m|0},${255*g/m|0},${255*b/m|0})`;
    $('#t12Sw').style.background=`radial-gradient(circle at 40% 40%, #fff 0%, ${sw} 45%, ${sw} 70%, transparent 72%)`;
    const ctag=Tk<3800?X('qizil','красный','red'):Tk<5200?X('to‘q sariq','оранжевый','orange'):Tk<6500?X('sariq-oq','жёлто-белый','yellow-white'):Tk<9000?X('oq','белый','white'):X('havorang-oq','голубовато-белый','bluish white');
    $('#t12TV').textContent=fmtN(Tk)+' K';
    $('#t12PKv').innerHTML=kv(T(TX.peak),fmtN(pk)+' nm',true)+kv(T(TX.eps),(5.67e-8*Tk**4/1e6).toFixed(Tk<3000?3:1).replace('.',',')+' MW/m²')+kv(T(TX.vsSun),fmtN((Tk/5800)**4,2)+'×')+kv(T(TX.col),T(ctag)); });
  $('#t12T').oninput=()=>{ mark('st',''); drawP(); }; on('st',v=>{ $('#t12T').value=STARS[+v][1]; mark('st',v); drawP(); });

  /* 02 · Spektrlar (43-rasm) */
  K.draw(function(){ const cv=$('#t12Sp'); const {x,w,h}=fit(cv,.42,300), c=C(), pl=12, pr=12, W=w-pl-pr, rh=(h-56)/5, L=l=>pl+(l-380)/400*W;
    const rows=[[TX.cont,()=>1,null],[X('2 · H','2 · H','2 · H'),null,[656.3,486.1,434.0,410.2]],[X('3 · Na','3 · Na','3 · Na'),null,[589.0,589.6]],[X('4 · Ca','4 · Ca','4 · Ca'),null,[393.4,396.8,422.7]],[TX.sun,l=>FRA.some(f=>Math.abs(l-f)<.9)?.08:FRA.some(f=>Math.abs(l-f)<1.8)?.5:1,null]];
    rows.forEach((r,i)=>{ const y=10+i*(rh+4); if(r[1]) strip(x,pl,y,W,rh-14,r[1]); else { x.fillStyle='#05070d'; x.fillRect(pl,y,W,rh-14); r[2].forEach(l=>{ const cc=wlRGB(l); x.fillStyle=`rgb(${cc})`; x.fillRect(L(l)-1.2,y,2.4,rh-14); }); }
      lbl(x,T(i===1||i===2||i===3?r[0]:r[0]),pl,y+rh-2,c.dim,'left'); });
    [400,500,600,700].forEach(l=>{ lbl(x,l+' nm',L(l),h-8,c.dim); x.strokeStyle=c.brd; x.beginPath(); x.moveTo(L(l),h-22); x.lineTo(L(l),h-16); x.stroke(); });
    [[393.4,'K'],[396.8,'H'],[486.1,'F'],[589.3,'D'],[656.3,'C']].forEach(([l,n])=>lbl(x,n,L(l),10+4*(rh+4)-3,c.gold)); });

  /* 03 · Dopler */
  let li=0;
  const drawD=K.draw(function(){ const cv=$('#t12D'); const {x,w,h}=fit(cv,.6,320), c=C(), v=+$('#t12V').value, l0=LINES[li][1], l=l0*(1+v/299792.458), pl=12, pr=12, W=w-pl-pr, span=14, L=q=>pl+(q-(l0-span))/(2*span)*W, sh=h*.22;
    const band=(y,lam,lab)=>{ strip(x,pl,y,W,sh,q=>1); for(let i=0;i<W;i++){} x.fillStyle='rgba(0,0,0,.9)'; x.fillRect(L(lam)-2,y,4,sh); lbl(x,lab,pl,y-6,c.dim,'left'); };
    const sstrip=(y)=>{ for(let i=0;i<W;i++){ const q=l0-span+i/W*2*span, cc=wlRGB(Math.max(380,Math.min(780,q))); x.fillStyle=`rgb(${cc})`; x.fillRect(pl+i,y,1.2,sh); } };
    const y1=22, y2=y1+sh+30; sstrip(y1); sstrip(y2); x.fillStyle='rgba(0,0,0,.9)'; x.fillRect(L(l0)-2,y1,4,sh); if(l>l0-span&&l<l0+span) x.fillRect(L(l)-2,y2,4,sh);
    lbl(x,T(TX.lab)+' = '+fmtN(l0,2)+' nm',pl,y1-6,c.dim,'left'); lbl(x,T(TX.star)+' = '+fmtN(l,3)+' nm',pl,y2-6,c.dim,'left');
    x.strokeStyle=c.gold; x.setLineDash([3,3]); x.beginPath(); x.moveTo(L(l0),y1+sh); x.lineTo(L(l0),y2+sh); x.stroke(); x.setLineDash([]);
    if(Math.abs(l-l0)>.05){ x.strokeStyle=c.gold; x.lineWidth=2; const yy=y2+sh+14; x.beginPath(); x.moveTo(L(l0),yy); x.lineTo(L(l),yy); x.stroke(); const d=Math.sign(l-l0); x.beginPath(); x.moveTo(L(l),yy); x.lineTo(L(l)-d*6,yy-4); x.moveTo(L(l),yy); x.lineTo(L(l)-d*6,yy+4); x.stroke(); }
    const cy=h*.82, ex=w*.12, sx=w*.62+v/3000*w*.22; x.fillStyle='#3f7fe0'; x.beginPath(); x.arc(ex,cy,10,0,TAU); x.fill(); lbl(x,T(X('Yer','Земля','Earth')),ex,cy+24,c.text);
    const sc=v>0?'#ff7a5a':v<0?'#6fa8ff':'#ffd27a'; x.fillStyle=sc; x.beginPath(); x.arc(sx,cy,12,0,TAU); x.fill();
    for(let k=1;k<=5;k++){ x.strokeStyle=sc; x.globalAlpha=.5-k*.08; x.beginPath(); x.arc(sx-v/3000*k*4,cy,12+k*9,0,TAU); x.stroke(); } x.globalAlpha=1;
    if(v){ const d=Math.sign(v); x.strokeStyle=c.text; x.lineWidth=2; x.beginPath(); x.moveTo(sx+d*20,cy); x.lineTo(sx+d*44,cy); x.lineTo(sx+d*38,cy-5); x.moveTo(sx+d*44,cy); x.lineTo(sx+d*38,cy+5); x.stroke(); }
    $('#t12VV').textContent=(v>0?'+':'')+fmtN(v)+' km/s'; mark('ln',li);
    $('#t12DKv').innerHTML=kv('λ₀',fmtN(l0,2)+' nm')+kv('λ',fmtN(l,3)+' nm')+kv(T(TX.shift),(l-l0>=0?'+':'')+fmtN(l-l0,3)+' nm',true)+kv(T(TX.dir),T(v>0?TX.rec:v<0?TX.appr:TX.rest)); });
  $('#t12V').oninput=drawD; on('ln',v=>{ li=+v; drawD(); });

  /* 04 · Zeeman */
  let zv='t';
  const drawZ=K.draw(function(){ const cv=$('#t12Z'); const {x,w,h}=fit(cv,.5,280), c=C(), B=+$('#t12B').value, l0=630.25, g=2.5, dl=4.67e-13*g*l0**2*B*1e4/10, pl=16, pr=16, W=w-pl-pr, span=.08, L=q=>pl+(q-(l0-span))/(2*span)*W, top=24, sh=h*.34;
    for(let i=0;i<W;i++){ x.fillStyle='rgb(255,'+(150+i/W*20|0)+',60)'; x.fillRect(pl+i,top,1.2,sh); }
    const comps=zv==='t'?[-1,0,1]:[-1,1];
    const prof=q=>{ let a=0; comps.forEach(k=>{ const cc=l0+k*dl, d=(q-cc)/.008; a+=(k===0?.85:zv==='t'?.5:.8)*Math.exp(-d*d); }); return Math.min(1,a); };
    for(let i=0;i<W;i++){ const q=l0-span+i/W*2*span, a=prof(q); x.fillStyle=`rgba(10,8,6,${a})`; x.fillRect(pl+i,top,1.2,sh); }
    lbl(x,'Fe I 630,25 nm · g = 2,5',pl,top-8,c.dim,'left');
    const py=top+sh+20, ph=h-py-22; x.strokeStyle=c.brd; x.beginPath(); x.moveTo(pl,py+ph); x.lineTo(w-pr,py+ph); x.stroke();
    x.strokeStyle=c.neon; x.lineWidth=2; x.beginPath(); for(let i=0;i<=W;i+=2){ const q=l0-span+i/W*2*span, yy=py+prof(q)*ph*.9; i?x.lineTo(pl+i,yy):x.moveTo(pl+i,yy); } x.stroke();
    if(B>0.01){ x.strokeStyle=c.gold; x.lineWidth=1.5; const yy=py+ph+12; x.beginPath(); x.moveTo(L(l0-dl),yy); x.lineTo(L(l0+dl),yy); x.stroke(); lbl(x,'Δλ_H',(L(l0-dl)+L(l0+dl))/2,yy+12,c.gold); }
    $('#t12BV').textContent=fmtN(B,3)+' T ('+fmtN(B*1e4)+' G)'; mark('zv',zv);
    $('#t12ZKv').innerHTML=kv(T(TX.view),T(zv==='t'?TX.across:TX.along))+kv(T(TX.dl),fmtN(2*dl*1000,1)+' pm',true)+kv('H',fmtN(B*1e4)+' G'); });
  $('#t12B').oninput=drawZ; on('zv',v=>{ zv=v; drawZ(); });

  K.bindQA(); K.quiz($('#t12Quiz'),QZ);
  return K.start();
}
window.DARSLIK.add({ id:'t12', GL, QZ, ico:'🌈', title:TX.title, sub:TX.sub, build });
}; go0();
})();
