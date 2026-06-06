/* ===========================
   PRO 6 – LANDING PAGE SCRIPT
   =========================== */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---- Hamburger / Mobile menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  /* ---- Color selector ---- */
  const colorDots = document.querySelectorAll('.color-dot');
  const colorNameEl = document.getElementById('colorName');
  const heroImg = document.getElementById('heroImg');

  const colorImageMap = {
    white: "img/AudifonosBlancos_sinFondo.png",
    black: "img/AudifonosNegros_sinFondo.png",
    pink:  "img/AudifonosRosas_sinFondo.png",
  };

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Update active state
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Update label
      colorNameEl.textContent = dot.dataset.name;

      // Swap hero image with fade
      const color = dot.dataset.color;
      const targetImg = colorImageMap[color];

      if (targetImg) {
        heroImg.style.opacity = '0';
        heroImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
          heroImg.src = targetImg;
          heroImg.alt = `Audífonos ${dot.dataset.name.toLowerCase()}`;
          heroImg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 220);
      }
    });
  });

  /* ---- Intersection Observer for reveal animations ---- */
  const revealEls = document.querySelectorAll('.spec-card, .inbox-card, .cta-box');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  /* ---- CTA / Buy buttons → Toast ---- */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast() {
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) ctaBtn.addEventListener('click', showToast);

  // Also intercept all .btn-primary anchors pointing to #comprar
  document.querySelectorAll('a.btn-primary[href="#comprar"], .btn-nav[href="#comprar"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow scroll, but also show toast after a small delay
      setTimeout(showToast, 600);
    });
  });

  /* ---- Smooth active nav highlight ---- */
  const sections = document.querySelectorAll('section[id], .specs, .inbox, .cta');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Parallax subtle on hero image ---- */
  const heroImgWrap = document.querySelector('.hero-image-wrap');
  if (heroImgWrap && window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroImgWrap.style.transform = `translateY(${scrolled * 0.08}px)`;
    }, { passive: true });
  }

  /* ---- Tilt effect on spec cards (desktop) ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.spec-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

})();
