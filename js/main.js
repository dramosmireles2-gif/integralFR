/* ═══════════════════════════════════════════════
   INTEGRAL FR – JavaScript principal
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgress');

  /* ─────────────────────────────────────────────
     NAVBAR – sticky shadow
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    // Progress bar
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─────────────────────────────────────────────
     HAMBURGER – menú móvil
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  document.querySelectorAll('.has-dropdown > .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        toggle.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });

  /* ─────────────────────────────────────────────
     HERO PARALLAX
  ───────────────────────────────────────────── */
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.35}px)`;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     REVEAL ON SCROLL
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.closest('.products-grid, .partners-grid, .beneficios__grid')
          ? [...entry.target.parentElement.children].indexOf(entry.target) * 100
          : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────────
     SCROLL TOP
  ───────────────────────────────────────────── */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────────
     ACTIVE NAV LINK
  ───────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ─────────────────────────────────────────────
     CONTADORES ANIMADOS
  ───────────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-item__number');

  function formatNumber(n) {
    if (n >= 1000000) {
      return (n / 1000000).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ',000,000';
    }
    return n.toLocaleString('es-MX');
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const prefix   = el.dataset.prefix  || '';
    const suffix   = el.dataset.suffix  || '';
    const duration = 1800;
    const start    = performance.now();

    el.classList.add('counted');

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = prefix + formatNumber(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + formatNumber(target) + suffix;
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-item__number');
        nums.forEach((el, i) => setTimeout(() => animateCounter(el), i * 150));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);

});
