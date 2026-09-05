/* ═══════════════════════════════════════════════════════
   Mohammad Abusaa — Portfolio JavaScript
   Features: AOS, Durations, Counters, Scroll spy, Navbar,
   Theme toggle, AJAX contact form
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initNavbar();
  initScrollSpy();
  initDurations();   // must run before counters read data-count
  initCounters();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initThemeToggle();
  initFooterYear();
});

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    toggle.setAttribute('aria-pressed', 'true');
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
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: REDUCED_MOTION
  });
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (REDUCED_MOTION) el.textContent = target;
      else animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -20px 0px' });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 1200;
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

/* ── Back to Top Button ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
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
        target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', targetId);
        // Keep keyboard focus in sync for the skip link and nav
        if (this.classList.contains('skip-link')) target.setAttribute('tabindex', '-1'), target.focus();
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
      btn.innerHTML = '<i class="bi bi-hourglass-split me-2" aria-hidden="true"></i>Sending…';
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
