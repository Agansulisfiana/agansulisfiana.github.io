/* ============================================================
   Agan Sulisfiana — Portfolio interactions
   Vanta background · typing effect · counters · reveal ·
   scroll spy · tilt cards · mobile menu
   ============================================================ */

/* ---------- Vanta animated background ---------- */
if (window.VANTA && window.VANTA.NET) {
  VANTA.NET({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x3b82f6,
    backgroundColor: 0x09090b,
    points: 12.00,
    maxDistance: 22.00,
    spacing: 18.00
  });
}

/* ---------- Typing effect for hero title ---------- */
const title = document.getElementById('typing-title');
const roles = ['IT Support Engineer', 'Field Service Engineer', 'Web Development Enthusiast'];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const currentRole = roles[roleIndex];

  title.textContent = currentRole.slice(0, charIndex);

  if (!deleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(typeRole, 75);
    return;
  }

  if (!deleting) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 45);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 250);
}

setTimeout(typeRole, 1150);

/* ---------- Counters + reveal on scroll ---------- */
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');

function animateCounter(counter) {
  if (counter.dataset.counted === 'true') return;

  counter.dataset.counted = 'true';

  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || '';
  const duration = 1200;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(easedProgress * target);

    counter.textContent = `${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      /* Staggered reveal: assign incremental delay to siblings in a grid */
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        if (idx > -1) {
          entry.target.style.setProperty('--reveal-delay', `${idx * 0.06}s`);
        }
      }

      entry.target.classList.add('show');

      entry.target.querySelectorAll('.counter').forEach(animateCounter);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));
counters.forEach(counter => {
  const parentReveal = counter.closest('.reveal');

  if (!parentReveal) animateCounter(counter);
});

/* ---------- Back to top + scroll spy ---------- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);

  document.querySelectorAll('section[id]').forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

    if (!link) return;

    const top = section.offsetTop - 130;
    const bottom = top + section.offsetHeight;

    link.classList.toggle('active', window.scrollY >= top && window.scrollY < bottom);
  });
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- 3D tilt cards (desktop only) ---------- */
const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canTilt) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    const maxTilt = 2.5;

    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      card.style.setProperty('--tilt-x', `${-y * maxTilt * 2}deg`);
      card.style.setProperty('--tilt-y', `${x * maxTilt * 2}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

/* ---------- Mobile menu toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  /* Close menu when a link is clicked (mobile) */
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', (event) => {
    if (!navMenu.classList.contains('open')) return;
    if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
    closeMenu();
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* Reset menu state when resizing to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
      closeMenu();
    }
  });
}

/* ---------- E. Scroll progress bar ---------- */
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ---------- C. Spotlight hover on cards ---------- */
const canSpotlight = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canSpotlight) {
  document.querySelectorAll('.skill-card, .project-card, .certificate-card, .education-card, .stat').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty('--spot-x', `${x}%`);
      card.style.setProperty('--spot-y', `${y}%`);
    });
  });
}
