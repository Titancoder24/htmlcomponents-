/*
 * Particles Component Script
 * Creates floating particles on a canvas element.
 * Supports connection lines between nearby particles.
 * Uses requestAnimationFrame for smooth animation.
 */

(function () {
  "use strict";

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticleData(width, height, speed) {
    return {
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.5, 0.5) * speed,
      vy: randomBetween(-0.5, 0.5) * speed,
      size: randomBetween(1, 4)
    };
  }

  function updateParticle(p, width, height) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }

  function drawParticles(ctx, particles, color, opacity) {
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + color + ", " + opacity + ")";
      ctx.fill();
    });
  }

  function drawConnections(ctx, particles, color, maxDist) {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          var alpha = (1 - dist / maxDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(" + color + ", " + alpha + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function initParticleSystem(element) {
    var canvas = element.querySelector(".voltz-particles__canvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var count = parseInt(element.dataset.count, 10) || 30;
    var speed = parseFloat(element.dataset.speed) || 1;
    var connected = element.dataset.connected === "true";

    var styles = getComputedStyle(element);
    var color = styles.getPropertyValue("--voltz-particles-color").trim()
      || "99, 102, 241";
    var opacity = parseFloat(
      styles.getPropertyValue("--voltz-particles-opacity")
    ) || 0.6;

    var particles = [];
    var animId = null;

    function resize() {
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push(
          createParticleData(canvas.width, canvas.height, speed)
        );
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        updateParticle(p, canvas.width, canvas.height);
      });

      if (connected) {
        drawConnections(ctx, particles, color, 120);
      }

      drawParticles(ctx, particles, color, opacity);
      animId = requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener("resize", function () {
      resize();
    });

    return function cleanup() {
      cancelAnimationFrame(animId);
    };
  }

  function initParticles() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var elements = document.querySelectorAll("[data-voltz-particles]");

    elements.forEach(function (el) {
      if (prefersReduced) {
        drawStaticParticles(el);
      } else {
        initParticleSystem(el);
      }
    });
  }

  function drawStaticParticles(element) {
    var canvas = element.querySelector(".voltz-particles__canvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var count = parseInt(element.dataset.count, 10) || 30;

    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;

    var styles = getComputedStyle(element);
    var color = styles.getPropertyValue("--voltz-particles-color").trim()
      || "99, 102, 241";

    for (var i = 0; i < count; i++) {
      var x = randomBetween(0, canvas.width);
      var y = randomBetween(0, canvas.height);
      var size = randomBetween(1, 4);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + color + ", 0.4)";
      ctx.fill();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParticles);
  } else {
    initParticles();
  }
})();
