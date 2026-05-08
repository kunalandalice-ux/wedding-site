/* ============================================================
   WEDDING SITE — SCRIPTS
   ============================================================ */

// ── NAV SCROLL EFFECT ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── PARALLAX ───────────────────────────────────────────────
const heroParallax  = document.getElementById('heroParallax');
const stripParallax = document.getElementById('stripParallax');

function updateParallax() {
  const sy = window.scrollY;

  // Hero parallax (moves up slower than scroll)
  if (heroParallax) {
    heroParallax.style.transform = `translateY(${sy * 0.35}px)`;
  }

  // Strip parallax
  if (stripParallax) {
    const strip = stripParallax.closest('.parallax-strip');
    const rect  = strip.getBoundingClientRect();
    const mid   = window.innerHeight / 2;
    const dist  = (rect.top + rect.height / 2) - mid;
    stripParallax.style.transform = `translateY(${dist * 0.25}px)`;
  }
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.reveal-fade, .reveal-slide-up, .reveal-from-left, .reveal-from-right, .reveal-zoom'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);          // fire once only
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// Hero elements are already in view on load — trigger immediately
document.querySelectorAll('#hero .reveal-fade, #hero .reveal-slide-up').forEach((el, i) => {
  const delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
  setTimeout(() => el.classList.add('in-view'), 120 + delay);
});

// ── COUNTDOWN ──────────────────────────────────────────────
const weddingDate = new Date('2026-09-12T16:00:00');

function updateCountdown() {
  const now   = new Date();
  const diff  = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent  = '0';
    document.getElementById('cd-secs').textContent  = '0';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── RSVP FORM ─────────────────────────────────────────────
function handleRSVP(e) {
  e.preventDefault();
  document.querySelector('.rsvp-form').style.display = 'none';
  document.getElementById('rsvp-thanks').style.display = 'block';
}

function handleDecline() {
  const form = document.querySelector('.rsvp-form');
  form.style.display = 'none';
  const thanks = document.getElementById('rsvp-thanks');
  thanks.style.display = 'block';
  thanks.querySelector('h3').textContent = 'We'll miss you 💛';
  thanks.querySelector('p').textContent  = 'Thank you for letting us know.';
}

// ── SMOOTH ACTIVE NAV ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── GALLERY LIGHTBOX (simple) ─────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    const lb  = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<div class="lb-backdrop"></div><img src="${src}" class="lb-img" /><button class="lb-close">✕</button>`;
    document.body.appendChild(lb);
    requestAnimationFrame(() => lb.classList.add('lb-open'));

    const close = () => {
      lb.classList.remove('lb-open');
      lb.addEventListener('transitionend', () => lb.remove(), { once: true });
    };
    lb.querySelector('.lb-backdrop').addEventListener('click', close);
    lb.querySelector('.lb-close').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
  });
});

// Lightbox styles injected via JS
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  .lightbox {
    position: fixed; inset: 0; z-index: 999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.35s ease;
  }
  .lightbox.lb-open { opacity: 1; }
  .lb-backdrop {
    position: absolute; inset: 0;
    background: rgba(10,8,7,0.92);
  }
  .lb-img {
    position: relative; z-index: 1;
    max-width: 90vw; max-height: 88vh;
    object-fit: contain; border-radius: 2px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    transform: scale(0.96);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    width: auto; height: auto;
  }
  .lightbox.lb-open .lb-img { transform: scale(1); }
  .lb-close {
    position: absolute; top: 1.5rem; right: 1.5rem; z-index: 2;
    background: none; border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.8); font-size: 1rem;
    width: 2.5rem; height: 2.5rem; border-radius: 50%;
    cursor: pointer; transition: all 0.2s;
  }
  .lb-close:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }
`;
document.head.appendChild(lbStyle);
