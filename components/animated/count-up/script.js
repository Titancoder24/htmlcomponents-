/*
 * Count Up Component Script
 * Animates number counting up when element enters viewport.
 * Uses IntersectionObserver for scroll trigger.
 */

(function () {
  'use strict';

  function formatNumber(value, variant, decimals) {
    var fixed = value.toFixed(decimals);

    if (variant === 'comma') {
      return addCommas(fixed);
    }
    if (variant === 'decimal' && decimals === 0) {
      return value.toFixed(1);
    }
    return fixed;
  }

  function addCommas(str) {
    var parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function animateCount(container) {
    if (container.hasAttribute('data-animating')) return;
    container.setAttribute('data-animating', '');

    var valueEl = container.querySelector('.voltz-count-up__value');
    if (!valueEl) return;

    var start = parseFloat(container.dataset.start) || 0;
    var end = parseFloat(container.dataset.end) || 100;
    var variant = container.dataset.variant || 'default';
    var decimals = parseInt(container.dataset.decimals, 10) || 0;

    var style = getComputedStyle(container);
    var durationStr = style.getPropertyValue('--voltz-count-up-duration');
    var duration = parseFloat(durationStr) * 1000 || 2000;

    runAnimation(valueEl, start, end, duration, variant, decimals);
  }

  function runAnimation(el, start, end, duration, variant, decimals) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);

      var eased = easeOutExpo(progress);
      var current = start + (end - start) * eased;

      el.textContent = formatNumber(current, variant, decimals);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(end, variant, decimals);
      }
    }

    requestAnimationFrame(step);
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function initCountUp(container) {
    if (container.hasAttribute('data-initialized')) return;
    container.setAttribute('data-initialized', '');

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            animateCount(container);
            observer.unobserve(container);
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(container);
  }

  function initAll() {
    var elements = document.querySelectorAll('[data-voltz-count-up]');
    for (var i = 0; i < elements.length; i++) {
      initCountUp(elements[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
