
// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ─── MOBILE NAV TOGGLE ───
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ─── ACTIVE NAV LINK HIGHLIGHT ───
const sections = document.querySelectorAll('section[id], header.hero');
const navAnchors = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));

// ─── REVEAL ON SCROLL ───
const reveals = document.querySelectorAll('.reveal');

const observerReveal = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observerReveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observerReveal.observe(el));

// ─── HERO PARALLAX ───
const hero = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    hero.style.opacity = 1 - window.scrollY / 600;
  }
}, { passive: true });

// ─── STAT COUNTER ANIMATION ───
function animateCounter(el, target, suffix = '') {
  const isDecimal = target !== Math.floor(target);
  let start = 0;
  const duration = 1400;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('de-DE') + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('de-DE') + suffix;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.trim();
      // Parse number from text like "156.000" or "~4.400" or "11 Mo."
      const cleaned = raw.replace(/[~.\s]/g, '').replace(',', '.');
      const num = parseFloat(cleaned);
      const suffix = raw.match(/[A-Za-z.]+$/) ? raw.match(/[A-Za-z.\s]+$/)[0] : '';
      if (!isNaN(num) && num > 9) {
        animateCounter(el, num, suffix.trim() ? ' ' + suffix.trim() : '');
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));