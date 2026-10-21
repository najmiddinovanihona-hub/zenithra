/* Klassik test ↔ Darslik: mavzular testlarini klassik testga alohida daraja sifatida beradi */
(function(){
const TX={ btn:{uz:'📖 Darslik testlari',ru:'📖 Тесты учебника',en:'📖 Textbook tests'}, pick:{uz:'Mavzular oralig‘ini tanlang',ru:'Выберите диапазон тем',en:'Choose a range of topics'},
  all:{uz:'Barcha mavzular',ru:'Все темы',en:'All topics'}, t:{uz:'mavzular',ru:'темы',en:'topics'}, q:{uz:'savol',ru:'вопр.',en:'questions'}, back:{uz:'← Darajalar',ru:'← Уровни',en:'← Levels'},
  ans:{uz:'To‘g‘ri javob',ru:'Правильный ответ',en:'Correct answer'}, topic:{uz:'mavzu',ru:'тема',en:'topic'} };
const tx=(o,L)=>o==null?'':typeof o==='string'?o:(o[L]||o.uz||'');
const mains=()=>window.DARSLIK?window.DARSLIK.list().filter(t=>/^t\d+$/.test(t.id)):[];
const qzOf=t=>{ try{ return t.QZ||[]; }catch(e){ return []; } };
function ranges(){ const M=mains(), out=[]; for(let i=0;i<M.length;i+=5){ const a=i+1, b=Math.min(M.length,i+5); out.push([a,b]); } return out; }
function items(a,b,L){ const M=mains(), res=[];
  M.slice(a-1,b).forEach((t,k)=>{ const n=a+k; qzOf(t).forEach(q=>{ if(!q||!q[1]||q[1].length<2) return;
    res.push({q:tx(q[0],L), o:q[1].map(o=>tx(o,L)), c:0, e:'✓ '+tx(TX.ans,L)+': '+tx(q[1][0],L)+' · '+n+'-'+tx(TX.topic,L)+': '+tx(t.title,L)}); }); });
  return res; }
const count=(a,b)=>mains().slice(a-1,b).reduce((s,t)=>s+qzOf(t).length,0);
window.DZQ={ TX, tx, ranges, items, count, total:()=>count(1,mains().length), n:()=>mains().length };
})();
