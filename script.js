/* ============================================
   HAPPY BIRTHDAY - COMPLETE LOGIC
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- State ----------
  let currentPage = 1;
  const totalPages = 11;

  // ---------- Elements ----------
  const pages = document.querySelectorAll('.page');
  const matrixCanvas = document.getElementById('matrixCanvas');
  const ctx = matrixCanvas.getContext('2d');
  const countdownOverlay = document.querySelector('.countdown-overlay');
  const countdownNumber = document.querySelector('.countdown-number');
  const cakeGifContainer = document.querySelector('.cake-gif-container');
  const modalOverlay = document.getElementById('noModal');
  const fireworksCanvas = document.getElementById('fireworksCanvas');
  const cakeCutting = document.getElementById('cakeCutting');
  const cakeMessage = document.getElementById('cakeMessage');
  const cakeNextBtn = document.getElementById('cakeNextBtn');
  const greetingCard = document.getElementById('greetingCard');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = musicToggle ? musicToggle.querySelector('.music-icon') : null;
  let fireworksRunning = false;
  let fireworksAnimId = null;

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
  // MUSIC TOGGLE
  // ======================
  let musicPlaying = false;

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        musicToggle.classList.remove('playing');
        musicIcon.textContent = '🔇';
      } else {
        bgMusic.play().then(() => {
          musicPlaying = true;
          musicToggle.classList.add('playing');
          musicIcon.textContent = '🔊';
        }).catch(() => {
          // autoplay blocked – nothing we can do until next interaction
        });
      }
    });

  }

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

    // Start countdown after 1 seconds
    setTimeout(() => startCountdown(), 1000);
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

    // Play music on click on continue button in hii gif
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.classList.add('playing');
      musicIcon.textContent = '🔊';
    }).catch(() => {
      // Autoplay blocked by browser – user will need to click the toggle
    });
  };

  // ======================
  // TYPEWRITER EFFECT
  // ======================
  function typeWriter(elementId, text, speed = 60, callback) {
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
  // CANVAS FIREWORKS (Page 3)
  // ======================
  const fwParticles = [];
  const fwRockets = [];
  let fwCtx = null;

  function initFireworksCanvas() {
    if (!fireworksCanvas) return;
    fwCtx = fireworksCanvas.getContext('2d');
    resizeFireworksCanvas();
    window.addEventListener('resize', resizeFireworksCanvas);
  }

  function resizeFireworksCanvas() {
    if (!fireworksCanvas) return;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }

  function launchRocket() {
    if (!fwCtx) return;
    const x = Math.random() * fireworksCanvas.width;
    const targetY = fireworksCanvas.height * (0.15 + Math.random() * 0.35);
    fwRockets.push({
      x: x,
      y: fireworksCanvas.height,
      targetY: targetY,
      speed: 4 + Math.random() * 3,
      hue: Math.floor(Math.random() * 360),
      trail: []
    });
  }

  function explodeRocket(rocket) {
    const count = 30 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 4;
      const hueVariation = rocket.hue + Math.floor(Math.random() * 60 - 30);
      fwParticles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.008 + Math.random() * 0.012,
        hue: hueVariation,
        size: 1.5 + Math.random() * 2.5,
        trail: []
      });
    }

    // Inner ring with different hue
    const innerCount = 12 + Math.floor(Math.random() * 8);
    const innerHue = (rocket.hue + 180) % 360;
    for (let i = 0; i < innerCount; i++) {
      const angle = (Math.PI * 2 / innerCount) * i;
      const speed = 0.8 + Math.random() * 1.5;
      fwParticles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.012 + Math.random() * 0.008,
        hue: innerHue,
        size: 1 + Math.random() * 1.5,
        trail: []
      });
    }
  }

  function animateFireworks() {
    if (!fireworksRunning || !fwCtx) return;

    // Fade with translucent fill
    fwCtx.fillStyle = 'rgba(9, 3, 13, 0.15)';
    fwCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    // Update & draw rockets
    for (let i = fwRockets.length - 1; i >= 0; i--) {
      const r = fwRockets[i];
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 8) r.trail.shift();

      r.y -= r.speed;

      // Draw rocket trail
      for (let t = 0; t < r.trail.length; t++) {
        const alpha = (t / r.trail.length) * 0.6;
        fwCtx.beginPath();
        fwCtx.arc(r.trail[t].x, r.trail[t].y, 2, 0, Math.PI * 2);
        fwCtx.fillStyle = `hsla(${r.hue}, 100%, 70%, ${alpha})`;
        fwCtx.fill();
      }

      // Draw rocket head
      fwCtx.beginPath();
      fwCtx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      fwCtx.fillStyle = `hsl(${r.hue}, 100%, 85%)`;
      fwCtx.shadowColor = `hsl(${r.hue}, 100%, 70%)`;
      fwCtx.shadowBlur = 12;
      fwCtx.fill();
      fwCtx.shadowBlur = 0;

      if (r.y <= r.targetY) {
        explodeRocket(r);
        fwRockets.splice(i, 1);
      }
    }

    // Update & draw particles
    for (let i = fwParticles.length - 1; i >= 0; i--) {
      const p = fwParticles[i];
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.vx *= 0.985; // drag
      p.vy *= 0.985;
      p.life -= p.decay;

      if (p.life <= 0) {
        fwParticles.splice(i, 1);
        continue;
      }

      // Draw trail
      for (let t = 0; t < p.trail.length; t++) {
        const alpha = (t / p.trail.length) * p.life * 0.4;
        fwCtx.beginPath();
        fwCtx.arc(p.trail[t].x, p.trail[t].y, p.size * 0.5, 0, Math.PI * 2);
        fwCtx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha})`;
        fwCtx.fill();
      }

      // Draw particle
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life})`;
      fwCtx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${p.life * 0.8})`;
      fwCtx.shadowBlur = 8;
      fwCtx.fill();
      fwCtx.shadowBlur = 0;
    }

    fireworksAnimId = requestAnimationFrame(animateFireworks);
  }

  function startFireworks() {
    if (!fireworksCanvas) return;
    fireworksRunning = true;
    fwParticles.length = 0;
    fwRockets.length = 0;
    resizeFireworksCanvas();

    // Clear canvas
    if (fwCtx) {
      fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }

    // Initial burst of rockets
    for (let i = 0; i < 4; i++) {
      setTimeout(launchRocket, i * 300);
    }

    // Continuous launches
    const launchInterval = setInterval(() => {
      if (!fireworksRunning) {
        clearInterval(launchInterval);
        return;
      }
      launchRocket();
      if (Math.random() > 0.5) {
        setTimeout(launchRocket, 150);
      }
    }, 400);

    animateFireworks();
  }

  function stopFireworks() {
    fireworksRunning = false;
    if (fireworksAnimId) {
      cancelAnimationFrame(fireworksAnimId);
      fireworksAnimId = null;
    }
  }

  initFireworksCanvas();

  // ======================
  // PAGE NAVIGATION
  // ====================== 
  function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;

    // hide all pages
    pages.forEach(p => p.classList.remove('active'));

    // Stop fireworks when leaving page 3
    if (currentPage === 3 && pageNum !== 3) {
      stopFireworks();
    }

    currentPage = pageNum;
    const target = document.getElementById('page' + pageNum);
    target.classList.add('active');

    // trigger typewriter on page entry
    triggerPageEffects(pageNum);
  }

  function triggerPageEffects(pageNum) {
    switch (pageNum) {
      case 2:
        typeWriter('typeText2', 'Get Ready for Something Special 🫠', 60);
        break;
      case 3:
        typeWriter('typeText3', 'Happy Birthday to you, Kulsum ❤️', 80);
        startFireworks();
        break;
      case 4:
        typeWriter('typeText4', 'Cake Cutting Time 🎂', 80);
        break;
      case 5:
        // Reset greeting card to closed state every time we enter this page
        if (greetingCard) greetingCard.classList.remove('open');
        typeWriter('typeText5', 'A Special Greeting Card For You!', 80);
        break;
      case 6:
        typeWriter('typeText6', 'My wish for You ✍️', 80);
        break;
      case 7:
        typeWriter('typeText7', 'Virtual hug for you! 🤗🩷', 80);
        break;
      case 8:
        typeWriter('typeText8', 'Will You Be Mine? 💕', 80, () => {
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
      case 9:
        typeWriter('typeText9', 'Will you be my pookie? 🎀', 80);
        initPookieNoButton();
        break;
      case 10:
        typeWriter('typeText10', 'Party Time! 🎉🥳', 80);
        break;
      case 11:
        typeWriter('typeText11', 'Happy Birthday Once Again! 🎂💕', 80);
        break;
    }
  }

  function openImage(img) {
    const popup = document.getElementById("imagePopup");
    const popupImg = document.getElementById("popupImg");

    popup.classList.add("show");
    popupImg.src = img.src;
  }

  function closeImage() {
    document.getElementById("imagePopup").classList.remove("show");
  }

  // expose navigation
  window.goToPage = goToPage;
  window.openImage = openImage;
  window.closeImage = closeImage;

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
  // CAKE CUTTING
  // ======================
  if (cakeCutting) {
    cakeCutting.addEventListener('click', () => {
      if (cakeCutting.classList.contains('cut')) return;
      cakeCutting.classList.add('cut');
      cakeMessage.classList.add('show');
      cakeNextBtn.classList.remove('hidden-btn');
    });
  }

  // ======================
  // GREETING CARD TOGGLE
  // ======================
  if (greetingCard) {
    greetingCard.addEventListener('click', () => {
      greetingCard.classList.toggle('open');
    });
  }

  // ======================
  // POOKIE DODGING NO BUTTON
  // ======================
  function initPookieNoButton() {
    const noBtn = document.getElementById('pookieNoBtn');
    const container = document.getElementById('pookieBtnContainer');
    if (!noBtn || !container) return;

    // Make container relative for absolute positioning of No button
    container.style.position = 'relative';
    container.style.minHeight = '80px';

    function dodgeButton() {
      const containerRect = container.getBoundingClientRect();
      const btnWidth = noBtn.offsetWidth;
      const btnHeight = noBtn.offsetHeight;

      // Random position within the card (not just the btn-group)
      const card = container.closest('.card');
      const cardRect = card.getBoundingClientRect();

      const maxX = cardRect.width - btnWidth - 20;
      const maxY = cardRect.height - btnHeight - 20;

      const randomX = Math.floor(Math.random() * maxX) + 10;
      const randomY = Math.floor(Math.random() * maxY) + 10;

      noBtn.style.position = 'fixed';
      noBtn.style.left = (cardRect.left + randomX) + 'px';
      noBtn.style.top = (cardRect.top + randomY) + 'px';
      noBtn.style.zIndex = '50';
      noBtn.style.transition = 'none';
    }

    noBtn.addEventListener('mouseover', dodgeButton);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeButton();
    });
  }

  window.pookieYes = function () {
    // Show a sweet message then advance
    const card = document.querySelector('.pookie-card');
    if (card) {
      const showText = document.querySelector('#pookieConfirm');
      showText.innerHTML = '<h2 style="color: var(--pink-hot); font-family: var(--font-title); font-size: 2rem; margin-top: 16px;">Yay! 💖🥰💍</h2>';
      showText.style.animation = 'cardFloat 0.5s ease';
      // showText.appendChild(msg);
      setTimeout(() => goToPage(currentPage + 1), 1500);
    } else {
      goToPage(currentPage + 1);
    }
  };

  // ======================
  // INITIALIZE
  // ======================
  // Start with page 1
  goToPage(1);
  initMatrix();
});
