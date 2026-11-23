// CSV eksport (Excel uchun): UTF-8 BOM, "," ajratgich, CRLF. "=", "+", "-", "@" (tab, CR) bilan boshlanuvchi qiymatlar
// formula bo'lib ishlamasligi uchun oldiga ' qo'shiladi.
export function csvCell(v) {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

export function sendCsv(res, name, lines) {
  const csv = '﻿' + lines.map((l) => l.map(csvCell).join(',')).join('\r\n') + '\r\n';
  const stamp = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${name}-${stamp}.csv"`);
  res.send(csv);
}
