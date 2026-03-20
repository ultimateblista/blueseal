/*
  BLUE SEAL ENERGY GROUP — HERO PARTICLE FIELD
  Canvas-based subtle particle system with connection lines

  Spec: 60 particles, very subtle, white circles
  Connect pairs within 120px with lines at 4% opacity
*/

document.addEventListener('DOMContentLoaded', () => {

  const heroSection = document.querySelector('.hero');

  if (!heroSection) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  /* ===========================
     CANVAS SETUP
     =========================== */
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';

  heroSection.style.position = 'relative';
  heroSection.appendChild(canvas);

  /* ===========================
     RESIZE HANDLER
     =========================== */
  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  /* ===========================
     PARTICLE CLASS
     =========================== */
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.5 + 0.5; // 0.5 - 2px radius
      this.opacity = Math.random() * 0.25 + 0.05; // 0.05 - 0.3 opacity
      this.vx = (Math.random() - 0.5) * 0.15; // Very slow movement
      this.vy = (Math.random() - 0.5) * 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -1;
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -1;
      }

      // Keep within bounds
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  /* ===========================
     INITIALIZE PARTICLES
     =========================== */
  const particles = [];
  const particleCount = 60;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  /* ===========================
     DRAW CONNECTION LINES
     =========================== */
  function drawConnections() {
    const maxDistance = 120;
    const lineOpacity = 0.04;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Fade line based on distance
          const opacity = lineOpacity * (1 - distance / maxDistance);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  /* ===========================
     ANIMATION LOOP
     =========================== */
  let animationFrameId;
  let lastTime = performance.now();
  const targetFPS = 30; // Lower FPS for performance
  const frameDelay = 1000 / targetFPS;

  function animate(currentTime) {
    animationFrameId = requestAnimationFrame(animate);

    // Throttle to target FPS
    const elapsed = currentTime - lastTime;
    if (elapsed < frameDelay) return;

    lastTime = currentTime - (elapsed % frameDelay);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connection lines
    drawConnections();
  }

  animate(performance.now());

  /* ===========================
     PAUSE/RESUME ON VISIBILITY CHANGE
     =========================== */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    } else {
      lastTime = performance.now();
      animate(lastTime);
    }
  });

  /* ===========================
     CLEANUP ON PAGE UNLOAD
     =========================== */
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

});

/* ===========================
   EXPORT FOR MODULE USE
   =========================== */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
