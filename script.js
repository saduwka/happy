// Фейерверк при открытии — реалистичная физика (гравитация, параболы, затухание)
function launchFireworks() {
  const container = document.getElementById('fireworks');
  if (!container) return;
  const colors = ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#f97316', '#fbbf24', '#fff3a3', '#a78bfa'];
  const positions = [
    { x: 35, y: 32 }, { x: 65, y: 35 }, { x: 45, y: 45 }, { x: 55, y: 40 }
  ];
  const burstDelay = 0.9;
  const gravity = 0.22;
  const initialSpeedMin = 2.8;
  const initialSpeedMax = 5.2;
  const particleCount = 65;
  const burstDuration = 3500;

  function runBurst(pos) {
    const burst = document.createElement('div');
    burst.className = 'firework-burst';
    burst.style.left = pos.x + '%';
    burst.style.top = pos.y + '%';
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
      const speed = initialSpeedMin + Math.random() * (initialSpeedMax - initialSpeedMin);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 3 + Math.floor(Math.random() * 4);
      const el = document.createElement('div');
      el.className = 'firework-particle firework-particle--physics';
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.background = color;
      el.style.color = color;
      el.style.boxShadow = `0 0 ${size * 2}px ${size}px currentColor`;
      el.style.borderRadius = Math.random() > 0.2 ? '50%' : '2px';
      burst.appendChild(el);
      particles.push({
        el,
        x: 0,
        y: 0,
        vx,
        vy,
        life: 1,
        decay: 0.008 + Math.random() * 0.008
      });
    }

    container.appendChild(burst);
    const start = performance.now();
    let lastTime = start;
    let rafId;
    const scale = 38;

    function frame(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      particles.forEach((p) => {
        p.x += p.vx * dt * scale;
        p.y += p.vy * dt * scale;
        p.vy += gravity * dt * scale;
        p.vx *= 0.998;
        p.vy *= 0.998;
        p.life = Math.max(0, p.life - p.decay);
        p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        p.el.style.opacity = p.life;
      });
      if (now - start < burstDuration && burst.parentNode) {
        rafId = requestAnimationFrame(frame);
      } else if (burst.parentNode) {
        burst.remove();
      }
    }

    rafId = requestAnimationFrame(frame);
    setTimeout(() => {
      if (burst.parentNode) burst.remove();
      if (rafId) cancelAnimationFrame(rafId);
    }, burstDuration + 300);
  }

  positions.forEach((pos, i) => {
    setTimeout(() => runBurst(pos), i * burstDelay * 1000);
  });
}

// Конфетти — сыпется постоянно
function createConfetti(batchSize = 20) {
  const container = document.getElementById('confetti');
  if (!container) return;
  const colors = ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#f97316'];
  for (let i = 0; i < batchSize; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDelay = Math.random() * 1.5 + 's';
    piece.style.animationDuration = 3 + Math.random() * 2 + 's';
    piece.style.background = colors[i % colors.length];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  launchFireworks();
  createConfetti(40);
  // Новые конфетти каждые 1.5 сек — сыпятся всегда
  setInterval(() => createConfetti(15), 1500);

  const confirmBtn = document.getElementById('confirmBtn');
  const runawayBtn = document.getElementById('runawayBtn');
  const ctaButtons = document.querySelector('.cta-buttons');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');

  // Карусель с фотографиями
  const carousel = document.getElementById('carousel');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDots = document.getElementById('carouselDots');
  if (carousel && carouselPrev && carouselNext && carouselDots) {
    const images = carousel.querySelectorAll('.carousel-img');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateCarousel() {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === currentIndex);
      });
      const dots = carouselDots.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function createDots() {
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Перейти к фото ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          resetAutoSlide();
        });
        carouselDots.appendChild(dot);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateCarousel();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    carouselPrev.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
    carouselNext.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    // Свайп на мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoSlide();
      }
    }, { passive: true });

    createDots();
    startAutoSlide();
  }

  // Кнопка "Не приду" прыгает по всему экрану при приближении курсора/пальца
  if (runawayBtn) {
    const runDistance = 100;
    const padding = 16;
    const safeTop = Math.max(padding, 8);
    const safeBottom = Math.max(padding, 8);

    function moveRunawayBtn() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const btnW = runawayBtn.offsetWidth;
      const btnH = runawayBtn.offsetHeight;
      const maxX = w - btnW - padding * 2;
      const maxY = h - btnH - safeTop - safeBottom;
      const rangeX = Math.max(0, maxX);
      const rangeY = Math.max(0, maxY);

      const isMobile = window.innerWidth < 768;
      let newX, newY;

      if (isMobile && rangeX > 0 && rangeY > 0) {
        // На мобилке — в противоположную часть экрана (прыжок дальше)
        const btnRect = runawayBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const oppositeHalfX = btnCenterX < w / 2 ? 1 : 0;
        const oppositeHalfY = btnCenterY < h / 2 ? 1 : 0;
        const halfW = rangeX / 2;
        const halfH = rangeY / 2;
        newX = padding + oppositeHalfX * halfW + Math.random() * halfW;
        newY = safeTop + oppositeHalfY * halfH + Math.random() * halfH;
      } else {
        newX = padding + Math.random() * rangeX;
        newY = safeTop + Math.random() * rangeY;
      }

      runawayBtn.classList.add('is-running');
      runawayBtn.style.transform = 'none';
      runawayBtn.style.left = newX + 'px';
      runawayBtn.style.top = newY + 'px';
    }

    function checkAndRun(clientX, clientY) {
      const btnRect = runawayBtn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);
      if (dist < runDistance) moveRunawayBtn();
    }

    // Отслеживаем по всему экрану
    document.addEventListener('mousemove', (e) => checkAndRun(e.clientX, e.clientY));
    runawayBtn.addEventListener('mouseenter', moveRunawayBtn);
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length) checkAndRun(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length) checkAndRun(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  confirmBtn.addEventListener('click', () => {
    modal.classList.add('open');
    createConfetti();
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
});
