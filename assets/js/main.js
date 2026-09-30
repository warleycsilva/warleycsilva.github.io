const i18n = window.i18n;

// ─── LANGUAGE ENGINE ──────────────────────────────────────────────────────────
let currentLang = 'en';
let typewriterPhrases = i18n.en.typewriter;

function applyLang(lang) {
  const dict = i18n[lang];
  if (!dict) return;

  // Fade out
  document.body.classList.add('lang-switching');

  setTimeout(() => {
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!dict[key]) return;
      if (key.endsWith('.html')) {
        el.innerHTML = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    });

    // Update html lang attr
    document.documentElement.lang = lang;

    // Update typewriter phrases
    typewriterPhrases = dict.typewriter || i18n.en.typewriter;

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    currentLang = lang;

    // Fade back in
    document.body.classList.remove('lang-switching');
  }, 200);
}

// Lang toggle click
document.getElementById('langToggle').addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (btn && btn.dataset.lang !== currentLang) {
    applyLang(btn.dataset.lang);
  }
});

// ─── THEME ───────────────────────────────────────────────────────────────────
// Light is the default. The saved choice is applied early by the inline script in <head>.
document.getElementById('themeToggle').addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (next === 'dark') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ─── CURSOR ──────────────────────────────────────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  dot.style.transform = 'translate(-50%,-50%)';
});
(function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  ring.style.transform = 'translate(-50%,-50%)';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '48px';
    ring.style.height = '48px';
    ring.style.borderColor = 'rgba(var(--fg-rgb),.5)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = '';
  });
});

// ─── NAV SCROLL ───────────────────────────────────────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
let pi = 0;
let ci = 0;
let del = false;
const te = document.getElementById('typed-text');
function tw() {
  const phrases = typewriterPhrases;
  const c = phrases[pi % phrases.length];
  if (!del) {
    te.textContent = c.substring(0, ci + 1);
    ci++;
    if (ci === c.length) {
      del = true;
      setTimeout(tw, 1800);
      return;
    }
  } else {
    te.textContent = c.substring(0, ci - 1);
    ci--;
    if (ci === 0) {
      del = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(tw, del ? 45 : 75);
}
setTimeout(tw, 1200);

// ─── INTERSECTION OBSERVER ────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.timeline-item,.stack-group,.project-card,.case-card,.cert-card,.edu-card').forEach((el, i) => {
  if (!el.classList.contains('reveal')) el.style.transitionDelay = (i % 5) * .08 + 's';
  obs.observe(el);
});

// ─── PARALLAX ORBS ───────────────────────────────────────────────────────────
window.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - .5) * 30;
  const y = (e.clientY / innerHeight - .5) * 30;
  document.querySelector('.hero-bg-orb-1').style.transform = `translate(${x}px,${y}px)`;
  document.querySelector('.hero-bg-orb-2').style.transform = `translate(${-x * .5}px,${-y * .5}px)`;
});

// ─── 3D TILT ─────────────────────────────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
  });
  c.addEventListener('mouseleave', () => {
    c.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});
