const wrap = document.getElementById('sticky-wrap');
const style = getComputedStyle(wrap);
console.log('sticky-wrap position:', style.position);
console.log('sticky-wrap overflow:', style.overflow);