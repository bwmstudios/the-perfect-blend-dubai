/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== HERO PARTICLES ===== */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#E91E8C', '#FBE3F1', '#C9A26B', '#ffffff'];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 3.5),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.6, -0.1),
      alpha: rand(0.2, 0.7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: rand(180, 400),
    };
  }

  for (let i = 0; i < 80; i++) {
    const p = createParticle();
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  let raf;
  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.life++;
      if (p.life > p.maxLife) { particles[i] = createParticle(); return; }

      const progress = p.life / p.maxLife;
      const fade = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;

      ctx.save();
      ctx.globalAlpha = p.alpha * fade;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });

    raf = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { if (!raf) animate(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  });
  observer.observe(canvas.parentElement);
})();

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, [data-aos], .service-card, .location-card').forEach(el => {
  revealObserver.observe(el);
});

/* ===== HERO REVEAL (immediate) ===== */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  }, 200);
});

/* ===== TABS ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const target = document.getElementById('tab-' + this.dataset.tab);
    if (target) target.classList.add('active');
  });
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

/* ===== GALLERY LIGHTBOX ===== */
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lightboxImg');
const lbCaption  = document.getElementById('lightboxCaption');
let lbCurrent    = 0;

function openLightbox(el) {
  const idx = galleryItems.indexOf(el);
  if (idx === -1) return;
  lbCurrent = idx;
  showLbItem(lbCurrent);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLbItem(idx) {
  const item = galleryItems[idx];
  const img  = item.querySelector('img');
  const cap  = item.querySelector('.gallery-overlay span');
  lbImg.src  = img.src.replace(/w=\d+/, 'w=1400');
  lbCaption.textContent = cap ? cap.textContent : '';
}

document.getElementById('lbPrev').addEventListener('click', e => {
  e.stopPropagation();
  lbCurrent = (lbCurrent - 1 + galleryItems.length) % galleryItems.length;
  showLbItem(lbCurrent);
});
document.getElementById('lbNext').addEventListener('click', e => {
  e.stopPropagation();
  lbCurrent = (lbCurrent + 1) % galleryItems.length;
  showLbItem(lbCurrent);
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { lbCurrent = (lbCurrent - 1 + galleryItems.length) % galleryItems.length; showLbItem(lbCurrent); }
  if (e.key === 'ArrowRight') { lbCurrent = (lbCurrent + 1) % galleryItems.length; showLbItem(lbCurrent); }
});

/* ===== REEL DRAG-SCROLL ===== */
(function () {
  const track = document.getElementById('reelTrack');
  if (!track) return;
  let isDown = false, startX = 0, scrollLeft = 0;

  const wrapper = track.parentElement;
  wrapper.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
    track.style.animationPlayState = 'paused';
  });
  wrapper.addEventListener('mouseleave', () => { isDown = false; });
  wrapper.addEventListener('mouseup', () => {
    isDown = false;
    track.style.animationPlayState = 'running';
  });
  wrapper.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });
  wrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX;
    track.style.animationPlayState = 'paused';
  }, { passive: true });
  wrapper.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ===== SMOOTH ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navA.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) a.style.color = 'var(--pink)';
  });
}, { passive: true });
