/*
  BLUE SEAL ENERGY GROUP — MAIN JAVASCRIPT
  Navigation, Scroll Effects, Intersection Observer
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     NAVIGATION SCROLL EFFECT
     =========================== */
  const nav = document.querySelector('.site-nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  /* ===========================
     MOBILE HAMBURGER MENU
     =========================== */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ===========================
     SCROLL REVEAL ANIMATIONS
     =========================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  });

  // Observe all elements with reveal classes
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* ===========================
     SMOOTH SCROLL FOR ANCHOR LINKS
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Ignore empty anchors
      if (href === '#' || href === '') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const offsetTop = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ===========================
     LAZY LOAD IMAGES
     =========================== */
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }

        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px'
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  /* ===========================
     SCROLL INDICATOR (Hide on scroll)
     =========================== */
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollIndicator.style.opacity = '0';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    });
  }

  /* ===========================
     PREVENT WIDOW WORDS IN HEADLINES
     =========================== */
  const preventWidows = (selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const text = el.innerHTML.trim();
      const words = text.split(' ');

      if (words.length > 2) {
        words[words.length - 2] = words[words.length - 2] + '&nbsp;' + words[words.length - 1];
        words.pop();
        el.innerHTML = words.join(' ');
      }
    });
  };

  // Apply to major headlines
  preventWidows('h1, h2');

  /* ===========================
     FORM VALIDATION
     =========================== */
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      // Clear error state on focus
      input.addEventListener('focus', () => {
        input.style.borderColor = '';
      });
    });

    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#e74c3c';
        }
      });

      if (!isValid) {
        e.preventDefault();

        // Scroll to first invalid field
        const firstInvalid = form.querySelector('[style*="border-color: rgb(231, 76, 60)"]');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
      }
    });
  });

  /* ===========================
     DEBOUNCE UTILITY
     =========================== */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /* ===========================
     PERFORMANCE MONITORING (DEV)
     =========================== */
  if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.loadTime > 2500) {
          console.warn('Slow load:', entry.name, entry.loadTime + 'ms');
        }
      }
    });

    try {
      perfObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // PerformanceObserver not fully supported
    }
  }

});

/* ===========================
   EXPORT FOR MODULE USE (if needed)
   =========================== */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
