/**
 * Voltz UI - Particle Field Background Script
 * Floating particles with optional connection lines
 * @version 1.0.0
 */

(function () {
  "use strict";

  const DEFAULTS = {
    count: 80,
    speed: 1,
    size: 2,
    color: "#6366f1",
    connections: false,
    connectionDistance: 120,
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /**
   * Parse a hex color to RGB components.
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 99, g: 102, b: 241 };
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }

  /**
   * Read configuration from element data attributes.
   */
  function getConfig(el) {
    return {
      count: parseInt(el.dataset.count, 10) || DEFAULTS.count,
      speed: parseFloat(el.dataset.speed) || DEFAULTS.speed,
      size: parseFloat(el.dataset.size) || DEFAULTS.size,
      color: el.dataset.color || DEFAULTS.color,
      connections: el.dataset.connections === "true",
      connectionDistance:
        parseInt(el.dataset.connectionDistance, 10) ||
        DEFAULTS.connectionDistance,
    };
  }

  /**
   * Create a single particle with random position and velocity.
   */
  function createParticle(width, height, config) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * config.speed * 0.5,
      vy: (Math.random() - 0.5) * config.speed * 0.5,
      size: config.size * (0.5 + Math.random() * 0.8),
      opacity: 0.3 + Math.random() * 0.7,
    };
  }

  /**
   * Update particle positions and handle boundary wrapping.
   */
  function updateParticles(particles, width, height) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  /**
   * Draw all particles onto the canvas context.
   */
  function drawParticles(ctx, particles, rgb) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${p.opacity})`;
      ctx.fill();
    }
  }

  /**
   * Draw connection lines between nearby particles.
   */
  function drawConnections(ctx, particles, rgb, maxDist) {
    const maxDistSq = maxDist * maxDist;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          const alpha = 1 - Math.sqrt(distSq) / maxDist;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /**
   * Initialize a particle field on a given container element.
   */
  function initParticleField(container) {
    const canvas = container.querySelector(".voltz-particle-field__canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = getConfig(container);
    const rgb = hexToRgb(config.color);
    let particles = [];
    let animationId = null;
    let isReducedMotion = prefersReducedMotion.matches;

    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    }

    function initParticles() {
      const rect = container.getBoundingClientRect();
      particles = [];
      for (let i = 0; i < config.count; i++) {
        particles.push(createParticle(rect.width, rect.height, config));
      }
    }

    function render() {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (!isReducedMotion) {
        updateParticles(particles, rect.width, rect.height);
      }

      if (config.connections) {
        drawConnections(ctx, particles, rgb, config.connectionDistance);
      }

      drawParticles(ctx, particles, rgb);

      if (!isReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    }

    function start() {
      resize();
      initParticles();
      render();
    }

    function cleanup() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    /* Handle reduced motion changes */
    function onMotionChange(e) {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        cleanup();
        render();
      } else {
        render();
      }
    }

    prefersReducedMotion.addEventListener("change", onMotionChange);

    const resizeObserver = new ResizeObserver(function () {
      resize();
      initParticles();
    });
    resizeObserver.observe(container);

    start();

    /* Store cleanup reference */
    container._voltzCleanup = function () {
      cleanup();
      resizeObserver.disconnect();
      prefersReducedMotion.removeEventListener("change", onMotionChange);
    };
  }

  /* Initialize all particle field instances */
  function initAll() {
    const containers = document.querySelectorAll(".voltz-particle-field");
    containers.forEach(initParticleField);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
