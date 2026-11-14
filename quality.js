/* QUALITY — qurilma kuchiga qarab grafika darajasi (barcha 3D sahnalar uchun umumiy).
   Daraja: low (telefon, kuchsiz noutbuk) · mid (oddiy kompyuter) · high (kuchli GPU).
   Tanlash tartibi: ?q=low|mid|high  →  localStorage 'solar_quality'  →  avtomatik aniqlash.
   window.QUALITY = { tier, seg, pts, tex, dpr, set(tier) }:
     seg — sfera segmentlari koeffitsienti, pts — zarralar soni koeffitsienti,
     tex — protsedural tekstura o'lchami koeffitsienti, dpr — ruxsat etilgan eng katta devicePixelRatio. */
(function(){
  const TIERS={
    low: { seg:0.4,  pts:0.4, tex:0.5,  dpr:1.25, realtex:'1k' },
    mid: { seg:0.65, pts:0.7, tex:0.75, dpr:1.5,  realtex:'2k' },
    high:{ seg:1,    pts:1,   tex:1,    dpr:2,    realtex:'2k' },
  };
  function detect(){
    const ua=navigator.userAgent||'';
    const mobile=/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua) || (navigator.maxTouchPoints>1 && Math.min(screen.width,screen.height)<900);
    const cores=navigator.hardwareConcurrency||4, mem=navigator.deviceMemory||4;
    if(mobile || cores<=4 || mem<=4) return 'low';
    if(cores<=8 || mem<=8) return 'mid';
    return 'high';
  }
  let tier=null;
  try{ const m=/[?&]q=(low|mid|high)\b/.exec(location.search); if(m) tier=m[1]; }catch(e){}
  if(!tier){ try{ const s=localStorage.getItem('solar_quality'); if(TIERS[s]) tier=s; }catch(e){} }
  if(!tier) tier=detect();
  const Q=Object.assign({ tier, auto:detect() }, TIERS[tier]);
  Q.seg=function(n){ return Math.max(12, Math.round(n*TIERS[Q.tier].seg)); };
  Q.pts=function(n){ return Math.max(1, Math.round(n*TIERS[Q.tier].pts)); };
  Q.texSize=function(n){ return Math.max(128, Math.round(n*TIERS[Q.tier].tex)); };
  // Darajani qo'lda o'zgartirish (sahifa qayta yuklanadi): QUALITY.set('low')
  Q.set=function(t){ if(!TIERS[t]) return; try{ localStorage.setItem('solar_quality',t); }catch(e){} location.reload(); };
  window.QUALITY=Q;
})();
