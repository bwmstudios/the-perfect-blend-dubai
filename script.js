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
