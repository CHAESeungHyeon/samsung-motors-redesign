document.addEventListener('DOMContentLoaded', () => {

  const overlayLeft  = document.getElementById('overlay-left');
  const overlayRight = document.getElementById('overlay-right');
  const yearEl       = document.getElementById('year-text');
  const logoIcon     = document.getElementById('logo-icon');
  const engTxt       = document.getElementById('eng-txt');

  const timers = [];
  let loopTimer = null;

  function addTimer(fn, delay) {
    timers.push(setTimeout(fn, delay));
  }

  function clearAllTimers() {
    timers.forEach(t => clearTimeout(t));
    timers.length = 0;
    clearTimeout(loopTimer);
  }

  function countLinear(from, to, duration, el) {
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      el.textContent = Math.floor(progress * (to - from) + from) + '년 3월.';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // 오버레이 초기화 (19% 지점으로 리셋)
  function resetOverlays() {
    overlayLeft.style.transition  = 'none';
    overlayRight.style.transition = 'none';
    overlayLeft.style.clipPath    = 'inset(0 81% 0 19%)'; // 19% 지점에서 숨김
    overlayRight.style.clipPath   = 'inset(0 81% 0 19%)'; // 19% 지점에서 숨김
    overlayLeft.getBoundingClientRect(); // reflow
  }

  // ── 순방향: 1998 → 2028 ──
  // 19% 지점에서 왼쪽(→0%)과 오른쪽(→100%)으로 동시에 열림
  function forwardTransition() {
    clearAllTimers();
    resetOverlays();

    countLinear(1998, 2028, 5000, yearEl);

    // Stage 1: 빠르게 초기 일부 열림 (1초)
    addTimer(() => {
      overlayLeft.style.transition  = 'clip-path 1s ease-in';
      overlayRight.style.transition = 'clip-path 5s ease-in';
      overlayLeft.style.clipPath    = 'inset(0 81% 0 0%)';  // 왼쪽으로 빠르게
      overlayRight.style.clipPath   = 'inset(0 81% 0 19%)'; // 오른쪽으로 빠르게
    }, 0);

    // Stage 2: 2초 대기 후 나머지 천천히 열림 (5초)
    addTimer(() => {
      overlayLeft.style.transition  = 'clip-path 5s ease-out';
      overlayRight.style.transition = 'clip-path 5s ease-out';
      overlayLeft.style.clipPath    = 'inset(0 81% 0 0%)';  // 왼쪽 끝까지
      overlayRight.style.clipPath   = 'inset(0 0% 0 18%)';  // 오른쪽 끝까지
    }, 3000);

    // 완료 후 로고 & 영문 텍스트 등장
    addTimer(() => {
      logoIcon.classList.add('show');
      engTxt.classList.add('show');
    }, 7000);

    loopTimer = setTimeout(() => reverseTransition(), 15000);
  }

  // ── 역방향: 2028 → 1998 ──
  // 19% 지점으로 왼쪽과 오른쪽이 동시에 닫힘
  function reverseTransition() {
    clearAllTimers();

    logoIcon.classList.remove('show');
    engTxt.classList.remove('show');

    countLinear(2028, 1998, 5000, yearEl);

    // Stage 1: 빠르게 초기 일부 닫힘 (1초)
    addTimer(() => {
      overlayLeft.style.transition  = 'clip-path 1s ease-in';
      overlayRight.style.transition = 'clip-path 2s ease-in';
      overlayLeft.style.clipPath    = 'inset(0 81% 0 19%)';  // 왼쪽 일부 닫힘
      overlayRight.style.clipPath   = 'inset(0 81% 0 19%)'; // 오른쪽 일부 닫힘
    }, 0);

    // Stage 2: 2초 대기 후 나머지 천천히 닫힘 (5초)
    addTimer(() => {
      overlayLeft.style.transition  = 'clip-path 1s ease-out';
      overlayRight.style.transition = 'clip-path 5s ease-out';
      overlayLeft.style.clipPath    = 'inset(0 81% 0 19%)'; // 19% 지점으로 닫힘
      overlayRight.style.clipPath   = 'inset(0 81% 0 19%)'; // 19% 지점으로 닫힘
    }, 3000);

    loopTimer = setTimeout(() => forwardTransition(), 14000);
  }

  forwardTransition();

  // ── 햄버거 메뉴 ──
  const hamburger = document.getElementById('hamburger');
  const navbar    = document.querySelector('.navbar');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('open');
  });

  document.querySelectorAll('.navbtn1 a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navbar.classList.remove('open');
    });
  });

}); // DOMContentLoaded 닫는 괄호
