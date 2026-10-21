/* ASTRO service worker — faqat osmon eslatmalari (Web Push). Fayllarni keshlamaydi: sayt har doim yangi versiyada ochiladi. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: 'ASTRO', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'ASTRO', {
    body: d.body || '', icon: '/logo.svg', badge: '/logo.svg', tag: d.tag || undefined,
    data: { url: d.url || '/' },
  }));
});

// Bildirishnoma bosilganda: ochiq sayt bo'lsa — o'sha oynada eslatmalar ochiladi, bo'lmasa yangi oyna
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) {
      if (c.url.startsWith(self.location.origin)) { c.postMessage({ astro: 'open-reminders' }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
