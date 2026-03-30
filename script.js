/* ========================================
   Portfolio — Interactive Scripts
   ======================================== */

(function () {
  'use strict';

  // ---- Particle Canvas Background ----
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animFrame;

    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function createParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 12000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          color: Math.random() > 0.5 ? '#6366f1' : '#06b6d4',
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.06 * (1 - dist / 150);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        if (mouse.x !== null) {
          const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (md < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = '#6366f1';
            ctx.globalAlpha = 0.1 * (1 - md / 200);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // ---- Navbar scroll effect ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Intersection Observer for reveal animations ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards
  document.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(card);
  });

  // Observe circuit art
  const circuitArt = document.getElementById('circuitArt');
  if (circuitArt) revealObserver.observe(circuitArt);

  // Observe value items
  document.querySelectorAll('.value-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.15}s`;
    revealObserver.observe(item);
  });

  // Observe stats
  document.querySelectorAll('.stat').forEach((stat, i) => {
    stat.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(stat);
  });

  // ---- Counter animation ----
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number').forEach((el) => {
    counterObserver.observe(el);
  });

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---- Smooth scroll for nav links (fallback) ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Subtle card tilt on hover (desktop only) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();
