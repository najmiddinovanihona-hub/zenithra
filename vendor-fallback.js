/* three.js va OrbitControls CDN'dan yuklanmasa (internet yo'q, bloklangan, SRI mos kelmadi) — loyihadagi nusxa.
   Ilgari index.html ichida inline edi; CSP inline skriptlarni bloklagani uchun alohida faylda (sinxron, CDN
   skriptlaridan keyin). document.write bilan qo'shilgan skriptlar shu fayldan keyin, tartib bilan bajariladi. */
if (!window.THREE) {
  // three.js yo'q bo'lsa, CDN'dagi OrbitControls ham ishlamagan (THREE'siz xato beradi) — ikkalasi ham yuklanadi
  document.write('<script src="labs/vendor/three.min.js"><\/script><script src="labs/vendor/OrbitControls.js"><\/script>');
} else if (!window.THREE.OrbitControls) {
  document.write('<script src="labs/vendor/OrbitControls.js"><\/script>');
}
