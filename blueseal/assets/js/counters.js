/*
  BLUE SEAL ENERGY GROUP — STAT COUNTERS
  Animated number counters with smart formatting

  Usage:
  <span class="stat-num" data-target="5000000" data-format="M" data-suffix="L/Day">0</span>
  Displays as: 5M L/Day
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     NUMBER FORMATTING FUNCTION
     =========================== */
  function formatNumber(value, format) {
    if (format === 'M') {
      // Millions
      return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1).replace('.0', '') + 'M';
    }

    if (format === 'K') {
      // Thousands
      return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1).replace('.0', '') + 'K';
    }

    if (format === 'B') {
      // Billions
      return (value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1).replace('.0', '') + 'B';
    }

    // Auto-format based on value size
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1).replace('.0', '') + 'B';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace('.0', '') + 'K';
    }

    // Small numbers - use locale formatting with commas
    return value.toLocaleString();
  }

  /* ===========================
     COUNTER ANIMATION FUNCTION
     =========================== */
  function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const format = element.dataset.format || 'auto';
    const suffix = element.dataset.suffix || '';
    const duration = parseInt(element.dataset.duration, 10) || 2000;

    // Use easeOutExpo easing for natural deceleration
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(easedProgress * target);

      // Format and display
      const formattedNumber = formatNumber(current, format);
      element.textContent = formattedNumber + (suffix ? ' ' + suffix : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure final value is exact
        const finalNumber = formatNumber(target, format);
        element.textContent = finalNumber + (suffix ? ' ' + suffix : '');
        element.classList.add('counting-complete');
      }
    }

    requestAnimationFrame(update);
  }

  /* ===========================
     INTERSECTION OBSERVER
     =========================== */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');

        // Small delay for stagger effect if multiple counters
        const delay = parseInt(entry.target.dataset.delay, 10) || 0;

        setTimeout(() => {
          animateCounter(entry.target);
        }, delay);

        // Unobserve after counting (only count once)
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  // Initialize all stat counters
  document.querySelectorAll('.stat-num').forEach((el, index) => {
    // Set initial value to 0
    el.textContent = '0';

    // Add stagger delay if multiple counters in same section
    if (!el.dataset.delay) {
      el.dataset.delay = index * 100;
    }

    counterObserver.observe(el);
  });

  /* ===========================
     MANUAL TRIGGER (Optional)
     =========================== */
  window.triggerCounters = function(selector = '.stat-num') {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('counted')) {
        el.classList.add('counted');
        animateCounter(el);
      }
    });
  };

  /* ===========================
     RESET COUNTERS (Optional - for demos)
     =========================== */
  window.resetCounters = function(selector = '.stat-num') {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.remove('counted', 'counting-complete');
      el.textContent = '0';
      counterObserver.observe(el);
    });
  };

});

/* ===========================
   EXPORT FOR MODULE USE
   =========================== */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatNumber: (value, format) => {
      // Export formatNumber for testing or external use
      if (format === 'M') return (value / 1000000).toFixed(1).replace('.0', '') + 'M';
      if (format === 'K') return (value / 1000).toFixed(1).replace('.0', '') + 'K';
      if (format === 'B') return (value / 1000000000).toFixed(1).replace('.0', '') + 'B';
      return value.toLocaleString();
    }
  };
}
