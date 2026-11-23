/* Test savollarining barqaror identifikatori (qid) — sayt, admin paneli va server (node:vm orqali) bir xil faylni ishlatadi.
   Admin qo'shgan savol:  "c:<id>"                              (masalan c:12)
   Kod ichidagi savol:    "b:<scope>:<level>:<hash>"            (masalan b:quiz:easy:1x9k2p, b:dz:t07:k3m0aa)
     hash — savolning O'ZBEKCHA matnidan FNV-1a (32 bit, base36). Shu bois qid interfeys tiliga bog'liq emas.
     Bir ro'yxatda matni bir xil savollar uchrasa, 2-, 3-si ".2", ".3" qo'shimchasini oladi (fayldagi tartib bo'yicha). */
(function(g){
const norm = s => String(s == null ? '' : s).normalize('NFC').replace(/\s+/g, ' ').trim();
function hash(s){
  s = norm(s);
  let h = 0x811c9dc5;
  for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return (h >>> 0).toString(36);
}
const CUSTOM = /^c:([1-9]\d{0,8})$/;
const BUILTIN = /^b:(quiz|dz):([a-z0-9_-]{1,24}):([0-9a-z]{1,7})(?:\.([2-9]|[1-9]\d))?$/;
const custom = id => 'c:' + id;
const builtin = (scope, level, uzText) => 'b:' + scope + ':' + level + ':' + hash(uzText);
// Ro'yxat (bitta scope + level) uchun qid'lar — takroriy matnlar ajratiladi
function forList(scope, level, uzTexts){
  const seen = {};
  return uzTexts.map(t => { const q = builtin(scope, level, t), n = seen[q] = (seen[q] || 0) + 1; return n > 1 ? q + '.' + n : q; });
}
function parse(qid){
  let m;
  if(typeof qid !== 'string') return null;
  if((m = CUSTOM.exec(qid))) return { kind:'c', id:+m[1] };
  if((m = BUILTIN.exec(qid))) return { kind:'b', scope:m[1], level:m[2] };
  return null;
}
g.QIDS = { hash, custom, builtin, forList, parse, valid: q => !!parse(q) };
})(typeof window !== 'undefined' ? window : globalThis);
