/* ═══════════════════════════════════════════════════════
   Mohammad Abusaa — Portfolio JavaScript
   Features: Preloader, AOS, Typing, Durations, Counters,
   Scroll spy, Navbar, Theme toggle, Language bars,
   AJAX contact form
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initAOS();
  initTypingEffect();
  initNavbar();
  initScrollSpy();
  initDurations();   // must run before counters read data-count
  initCounters();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initThemeToggle();
  initLanguageBars();
  initFooterYear();
});

/* ── Preloader ── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hide = () => {
    if (preloader.classList.contains('hidden')) return;
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  };

  window.addEventListener('load', () => setTimeout(hide, 400));
  setTimeout(hide, 2500); // fallback — never block the page
}

/* ── Theme Toggle (Dark/Light) ── */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!toggle || !icon) return;

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }

  if (saved === 'light') {
    document.body.classList.add('light-mode');
    icon.className = 'bi bi-sun';
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    icon.className = isLight ? 'bi bi-sun' : 'bi bi-moon-stars';
    toggle.setAttribute('aria-pressed', String(isLight));
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) { /* ignore */ }
  });
}

/* ── AOS (Animate on Scroll) ── */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });
}

/* ── Typing Effect ── */
function initTypingEffect() {
  const element = document.getElementById('typedText');
  if (!element) return;

  const phrases = [
    'SD-WAN & Catalyst Switching',
    'Enterprise Network Troubleshooting',
    'IOS-XE Platform Diagnostics',
    'Controller Upgrades & Migrations',
    'IPsec/BFD Tunnel Debugging',
    'CCIE Enterprise Infrastructure'
  ];

  // Respect reduced-motion: show the first phrase statically
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1500);
}

/* ── Navbar Scroll Effect + auto-collapse on mobile ── */
function initNavbar() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.getElementById('navMenu');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show') && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* ── Scroll Spy — Active Nav Link ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = null;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) currentId = section.id;
    });

    navLinks.forEach(link => {
      const isActive = currentId !== null && link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ── Durations — computed from data-start / data-end so they never go stale ──
   Convention matches LinkedIn: both the start and end month count
   (Jan 2026 – Feb 2026 = 2 mos). An open-ended role uses the current month. */
function initDurations() {
  const items = document.querySelectorAll('.timeline-date[data-start]');
  if (!items.length) return;

  const now = new Date();
  const nowYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let totalMonths = 0;

  items.forEach(el => {
    const months = monthsInclusive(el.dataset.start, el.dataset.end || nowYM);
    if (months < 1) return;
    totalMonths += months;

    const span = document.createElement('span');
    span.className = 'timeline-duration';
    span.textContent = ` · ${formatDuration(months)}`;
    el.appendChild(span);
  });

  const years = document.getElementById('yearsExperience');
  if (years && totalMonths >= 12) {
    years.setAttribute('data-count', String(Math.floor(totalMonths / 12)));
  }
}

function monthsInclusive(startYM, endYM) {
  const [sy, sm] = String(startYM).split('-').map(Number);
  const [ey, em] = String(endYM).split('-').map(Number);
  if (!sy || !sm || !ey || !em) return 0;
  return (ey - sy) * 12 + (em - sm) + 1;
}

function formatDuration(months) {
  if (months < 12) return `${months} ${months === 1 ? 'mo' : 'mos'}`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const years = `${y} ${y === 1 ? 'yr' : 'yrs'}`;
  return m ? `${years} ${m} ${m === 1 ? 'mo' : 'mos'}` : years;
}

/* ── Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduce) el.textContent = target;
      else animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -20px 0px' });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = target;
  }

  requestAnimationFrame(update);
}

/* ── Language Bar Animation ── */
function initLanguageBars() {
  const bars = document.querySelectorAll('.lang-progress');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = targetWidth; }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── Back to Top Button ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Smooth Scroll for Anchor Links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', targetId);
      }
    });
  });
}

/* ── Contact Form — submit in-page via Formspree's JSON endpoint ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const btn = form.querySelector('button[type="submit"]');
  const originalHtml = btn ? btn.innerHTML : '';

  const setStatus = (type, message) => {
    if (!status) return;
    status.className = 'form-status' + (type ? ` form-status-${type}` : '');
    status.textContent = message;
    status.hidden = !message;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — silently drop bot submissions
    const trap = form.querySelector('input[name="_gotcha"]');
    if (trap && trap.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending…';
    }
    setStatus('', '');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        setStatus('success', 'Thanks — your message is on its way. I\'ll get back to you soon.');
      } else {
        const data = await res.json().catch(() => ({}));
        const detail = Array.isArray(data.errors) ? data.errors.map(er => er.message).join(', ') : '';
        setStatus('error', detail || 'Something went wrong. Please email me directly at mohammadabusaa66@gmail.com.');
      }
    } catch (err) {
      setStatus('error', 'Network error — please try again, or email me directly at mohammadabusaa66@gmail.com.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    }
  });
}

/* ── Footer year ── */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
