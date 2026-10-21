// Darslik progressini birlashtirish (merge). Bitta mavzu yozuvi window.DZP formatida:
//   v — o'qilgan (1), s/t — oxirgi test bali/savollar soni, b — eng yaxshi ball, d — oxirgi test vaqti (ms).
// Qoida: "o'qilgan" belgisi yo'qolmaydi, eng yaxshi ball kamaymaydi, oxirgi natija d bo'yicha yangirog'idan olinadi.
export function mergeEntry(a = {}, b = {}) {
  const [older, newer] = (Number(b.d) || 0) >= (Number(a.d) || 0) ? [a, b] : [b, a];
  const out = { ...older, ...newer };
  if (a.v || b.v) out.v = 1;
  const best = Math.max(Number(a.b) || 0, Number(b.b) || 0, Number(a.s) || 0, Number(b.s) || 0);
  if ('b' in a || 'b' in b || 's' in a || 's' in b) out.b = best;
  return out;
}

export function mergeProgress(server = {}, client = {}) {
  const out = { ...server };
  for (const [id, entry] of Object.entries(client)) out[id] = mergeEntry(server[id], entry);
  return out;
}
