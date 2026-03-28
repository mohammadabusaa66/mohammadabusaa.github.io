/* ═══════════════════════════════════════════════════════
   Mohammad Abusaa — Portfolio JavaScript
   Features: AOS init, Typing effect, Particles, 
   Counter animation, Scroll spy, Navbar, Back to top
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initAOS();
  initTypingEffect();
  initParticles();
  initNavbar();
  initScrollSpy();
  initCounters();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initTiltEffect();
  initNavHighlight();
});

/* ── AOS (Animate on Scroll) ── */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: window.innerWidth < 768 ? 'phone' : false
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
    'IPsec/BFD Tunnel Debugging'
  ];

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
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  // Start after a delay
  setTimeout(type, 1500);
}

/* ── Floating Particles ── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random properties
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 15 + 10;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${opacity};
    `;

    container.appendChild(particle);
  }
}

/* ── Navbar Scroll Effect ── */
function initNavbar() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Close mobile menu on link click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.getElementById('navMenu');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
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

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // Initial check
}

/* ── Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current >= target) {
      element.textContent = target;
      return;
    }
    element.textContent = Math.floor(current);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ── Back to Top Button ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
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
      }
    });
  });
}

/* ── Contact Form Handler ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Show loading
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    btn.disabled = true;

    // If using Formspree, let form submit naturally
    // If no Formspree ID set, prevent default and show demo
    if (form.action.includes('xplaceholder')) {
      e.preventDefault();
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-accent');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success');
          btn.classList.add('btn-accent');
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1000);
    }
  });
}

/* ── Card Tilt Effect ── */
function initTiltEffect() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.project-card, .award-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Navbar Active Section Highlight ── */
function initNavHighlight() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
