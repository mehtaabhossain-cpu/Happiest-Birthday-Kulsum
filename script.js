/* ============================================
   HAPPY BIRTHDAY - COMPLETE LOGIC
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- State ----------
  let currentPage = 1;
  const totalPages = 6;

  // ---------- Elements ----------
  const pages = document.querySelectorAll('.page');
  const matrixCanvas = document.getElementById('matrixCanvas');
  const ctx = matrixCanvas.getContext('2d');
  const countdownOverlay = document.querySelector('.countdown-overlay');
  const countdownNumber = document.querySelector('.countdown-number');
  const cakeGifContainer = document.querySelector('.cake-gif-container');
  const modalOverlay = document.getElementById('noModal');

  // ---------- Floating Hearts Background ----------
  function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const hearts = ['💕', '💖', '💗', '💝', '💘', '🩷', '♥'];
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('span');
      heart.classList.add('floating-heart');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      heart.style.animationDuration = (8 + Math.random() * 12) + 's';
      heart.style.animationDelay = Math.random() * 10 + 's';
      container.appendChild(heart);
    }
  }
  createFloatingHearts();

  // ======================
  // MATRIX RAIN (Page 1)
  // ======================
  let matrixRunning = true;

  function initMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const phrases = [
      'Happy Birthday', 'Happy Birthday', 'Happy Birthday',
      'HBD 🎂', '🎉 Happy Birthday 🎉', '💕 Birthday 💕',
      'Happy Birthday ✨', '🥳 Birthday', 'Happy Birthday 🎁'
    ];
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];
    const columnText = [];
    const columnCharIndex = [];
    const columnSpeed = [];

    // initialize columns with random starting positions and speeds
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50; // staggered starts
      columnText[i] = phrases[Math.floor(Math.random() * phrases.length)];
      columnCharIndex[i] = 0;
      columnSpeed[i] = 0.3 + Math.random() * 0.7; // varied speeds
    }

    function drawMatrix() {
      if (!matrixRunning) return;

      // semi-transparent black to create fade trail
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < columns; i++) {
        if (drops[i] < 0) {
          drops[i] += columnSpeed[i];
          continue;
        }

        // pick color - pink/magenta gradient with brightness variation
        const hue = 330 + Math.random() * 30;
        const lightness = 50 + Math.random() * 30;
        const alpha = 0.7 + Math.random() * 0.3;
        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;

        // show one character at a time from the phrase
        const text = columnText[i];
        const charIdx = columnCharIndex[i] % text.length;
        const char = text[charIdx];

        const y = Math.floor(drops[i]) * fontSize;
        ctx.fillText(char, i * fontSize, y);

        // add glow to leading character
        if (Math.random() > 0.7) {
          ctx.shadowColor = 'rgba(255, 64, 129, 0.8)';
          ctx.shadowBlur = 8;
          ctx.fillText(char, i * fontSize, y);
          ctx.shadowBlur = 0;
        }

        columnCharIndex[i]++;

        // reset drop to top randomly after screen pass
        if (y > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
          columnText[i] = phrases[Math.floor(Math.random() * phrases.length)];
          columnCharIndex[i] = 0;
          columnSpeed[i] = 0.3 + Math.random() * 0.7;
        }
        drops[i] += columnSpeed[i];
      }

      requestAnimationFrame(drawMatrix);
    }

    drawMatrix();

    // handle resize
    window.addEventListener('resize', () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    });

    // Start countdown after 4 seconds
    setTimeout(() => startCountdown(), 4000);
  }

  // ---------- Countdown 3-2-1 ----------
  function startCountdown() {
    let count = 3;
    countdownOverlay.classList.add('visible');
    countdownNumber.textContent = count;

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownNumber.textContent = count;
        // re-trigger animation
        countdownNumber.style.animation = 'none';
        void countdownNumber.offsetHeight;
        countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
      } else if (count === 0) {
        countdownNumber.textContent = '🎂';
        countdownNumber.style.animation = 'none';
        void countdownNumber.offsetHeight;
        countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
      } else {
        clearInterval(interval);
        matrixRunning = false; // stop the matrix rain
        countdownOverlay.classList.remove('visible');
        // show cake gif
        cakeGifContainer.classList.add('visible');
      }
    }, 1000);
  }

  // ---------- Skip / advance from cake GIF ----------
  window.skipCakeGif = function () {
    goToPage(2);
  };

  // ======================
  // TYPEWRITER EFFECT
  // ======================
  function typeWriter(elementId, text, speed = 70, callback) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';

    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('typewriter-cursor');
    el.appendChild(textSpan);
    el.appendChild(cursorSpan);

    let i = 0;
    function type() {
      if (i < text.length) {
        textSpan.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // keep cursor blinking for a bit then remove
        setTimeout(() => {
          cursorSpan.style.display = 'none';
          if (callback) callback();
        }, 1500);
      }
    }
    type();
  }

  // ======================
  // PAGE NAVIGATION
  // ======================
  function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;

    // hide all pages
    pages.forEach(p => p.classList.remove('active'));

    currentPage = pageNum;
    const target = document.getElementById('page' + pageNum);
    target.classList.add('active');

    // trigger typewriter on page entry
    triggerPageEffects(pageNum);
  }

  function triggerPageEffects(pageNum) {
    switch (pageNum) {
      case 2:
        typeWriter('typeText2', 'I made something special for you, wanna see? 💝', 60);
        break;
      case 3:
        typeWriter('typeText3', 'Happy Birthday to You! 🎂🎉', 80);
        break;
      case 4:
        typeWriter('typeText4', 'My Wish For You 💌', 80);
        break;
      case 5:
        typeWriter('typeText5', 'Virtual Hug For You 🤗💕', 80);
        break;
      case 6:
        typeWriter('typeText6', 'Will You Be Mine? 💕', 80, () => {
          // animate hearts appearing
          const hearts = document.querySelectorAll('.heart-frame');
          hearts.forEach((h, i) => {
            setTimeout(() => {
              h.style.opacity = '1';
              h.style.transform = 'scale(1)';
            }, i * 300);
          });
        });
        break;
    }
  }

  // expose navigation
  window.goToPage = goToPage;

  window.nextPage = function () {
    goToPage(currentPage + 1);
  };

  window.prevPage = function () {
    goToPage(currentPage - 1);
  };

  // ======================
  // MODAL (No button popup)
  // ======================
  window.showNoModal = function () {
    modalOverlay.classList.add('visible');
  };

  window.closeNoModal = function () {
    modalOverlay.classList.remove('visible');
  };

  // ======================
  // INITIALIZE
  // ======================
  // Start with page 1
  goToPage(1);
  initMatrix();
});
