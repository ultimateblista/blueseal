/* Blue Seal Energy Group — Modern Interactions */
/* Premium Microinteractions, Parallax, and Smooth Animations */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     ANIMATED COUNTER FOR STATS
     =========================== */

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const isLarge = target > 1000000; // For formatting large numbers

    const formatNumber = (num) => {
      if (isLarge && num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return num.toLocaleString();
      }
      return num.toString();
    };

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * target);

      element.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = formatNumber(target) + suffix;
      }
    };

    requestAnimationFrame(animate);
  };

  // Observe stat numbers and animate when in view
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(stat => {
    statObserver.observe(stat);
  });

  /* ===========================
     PARALLAX SCROLL EFFECT
     =========================== */

  const parallaxElements = document.querySelectorAll('[data-parallax]');

  const handleParallax = () => {
    if (window.innerWidth < 768) return; // Disable on mobile

    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      }
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ===========================
     SMOOTH HOVER TRACKING (MAGNETIC EFFECT)
     =========================== */

  const magneticButtons = document.querySelectorAll('.btn-gradient-gold, .btn-glass-border');

  magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-4px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });

  /* ===========================
     GLASSMORPHIC CARD TILT EFFECT
     =========================== */

  const tiltCards = document.querySelectorAll('.stat-glass-card, .product-card-elevated, .feature-card-depth');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return; // Disable on tablets and mobile

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ===========================
     SMOOTH SCROLL WITH EASING
     =========================== */

  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ===========================
     INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
     =========================== */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: unobserve after revealing to improve performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* ===========================
     PREMIUM NAVIGATION SCROLL EFFECT
     =========================== */

  const nav = document.querySelector('.nav-premium, .site-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (nav) {
      // Add scrolled class
      if (currentScroll > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Hide on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    }
  });

  /* ===========================
     GRADIENT MESH MOUSE TRACKING
     =========================== */

  const heroMesh = document.querySelector('.hero-mesh-gradient');

  if (heroMesh) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      heroMesh.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    });
  }

  /* ===========================
     CARD STAGGER ANIMATION ON SCROLL
     =========================== */

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.children;
        Array.from(cards).forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.grid-3, .grid-4').forEach(grid => {
    // Set initial state for cards
    Array.from(grid.children).forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    staggerObserver.observe(grid);
  });

  /* ===========================
     LOADING ANIMATION FOR PRODUCT CARDS
     =========================== */

  const productCards = document.querySelectorAll('.product-card-elevated');

  productCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  /* ===========================
     BUTTON RIPPLE EFFECT
     =========================== */

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  // Add ripple CSS dynamically
  const style = document.createElement('style');
  style.textContent = `
    .btn-gradient-gold, .btn-glass-border, .btn-primary {
      position: relative;
      overflow: hidden;
    }
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.btn-gradient-gold, .btn-glass-border, .btn-primary').forEach(button => {
    button.addEventListener('click', createRipple);
  });

  /* ===========================
     LAZY LOAD ANIMATIONS
     =========================== */

  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          lazyObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('.lazy-load').forEach(el => {
      lazyObserver.observe(el);
    });
  }

  /* ===========================
     CURSOR GLOW EFFECT (PREMIUM)
     =========================== */

  const createCursorGlow = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Add cursor glow styles
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .cursor-glow {
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(27, 143, 232, 0.15) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: opacity 0.3s ease;
        opacity: 0;
      }
      body:hover .cursor-glow {
        opacity: 1;
      }
      @media (max-width: 1024px) {
        .cursor-glow {
          display: none;
        }
      }
    `;
    document.head.appendChild(cursorStyle);
  };

  // Enable cursor glow on desktop only
  if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
    createCursorGlow();
  }

  /* ===========================
     PERFORMANCE OPTIMIZATION
     =========================== */

  // Debounce function for resize events
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Handle window resize
  window.addEventListener('resize', debounce(() => {
    // Recalculate parallax and other position-dependent effects
    handleParallax();
  }, 250));

  /* ===========================
     ACCESSIBILITY ENHANCEMENTS
     =========================== */

  // Add focus indicators for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Add keyboard nav styles
  const a11yStyle = document.createElement('style');
  a11yStyle.textContent = `
    body.keyboard-nav *:focus {
      outline: 3px solid #C9A94A;
      outline-offset: 4px;
    }
  `;
  document.head.appendChild(a11yStyle);

  /* ===========================
     CONSOLE MESSAGE
     =========================== */

  console.log('%c✨ Blue Seal Energy Group', 'font-size: 20px; font-weight: bold; color: #1B8FE8;');
  console.log('%cModern UI Components Loaded Successfully', 'font-size: 14px; color: #C9A94A;');
  console.log('%cManufacturing Africa\'s Future', 'font-size: 12px; color: #0B1E3D;');

});

/* ===========================
   EXPORT FOR MODULE USAGE (OPTIONAL)
   =========================== */

// If using as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Export any functions you want to make available
  };
}
