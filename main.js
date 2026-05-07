/* ===========================
   MULLIN SECURITY — main.js
=========================== */

// ── Navbar scroll effect ──────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ── Navbar offset (account for promo banner) ──────
function setNavTop() {
  const banner = document.getElementById('promoBanner');
  if (banner && banner.style.display !== 'none') {
    navbar.style.top = banner.offsetHeight + 'px';
  } else {
    navbar.style.top = '0';
  }
}
setNavTop();
window.addEventListener('resize', setNavTop);

const promoClose = document.querySelector('.promo-close');
if (promoClose) {
  promoClose.addEventListener('click', () => {
    navbar.style.top = '0';
  });
}

// ── Mobile overlay menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('mobileOverlay');
const overlayClose = document.getElementById('overlayClose');
const overlayLinks = document.querySelectorAll('.overlay-link');

function openOverlay() {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openOverlay);
overlayClose.addEventListener('click', closeOverlay);
overlayLinks.forEach(link => link.addEventListener('click', closeOverlay));

// ── Smooth scroll & active nav ────────────────────
const navLinks = document.querySelectorAll('.nav-link, .overlay-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
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

window.addEventListener('scroll', updateActiveNav);

// ── Scroll reveal ─────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(delay) * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ── Form submission feedback ──────────────────────
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = '<i class="fas fa-check"></i> Enquiry Sent!';
        btn.style.background = '#25D366';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Network error');
      }
    } catch {
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error — Try WhatsApp';
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
}

// ── Hamburger animation ───────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
});

overlayClose.addEventListener('click', () => {
  hamburger.classList.remove('active');
});

overlayLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
  });
});

// ── Counter animation for stats ───────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.textContent);
    const suffix = el.textContent.replace(/[\d.]/g, '');
    const isDecimal = el.textContent.includes('.');
    const duration = 1500;
    const step = duration / 60;
    let current = 0;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal
        ? current.toFixed(0) + suffix
        : Math.floor(current) + suffix;
    }, step);
  });
}

// Trigger counter when stats come into view
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ── Sticky nav active link style ─────────────────
const style = document.createElement('style');
style.textContent = `
  .nav-link.active { color: var(--yellow) !important; }
`;
document.head.appendChild(style);
