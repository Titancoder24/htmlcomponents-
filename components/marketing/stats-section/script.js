/*
 * Stats Section Component Script
 * Purpose: Animated count-up effect for statistics numbers on scroll.
 * Uses IntersectionObserver for performance. No innerHTML, no eval.
 */

(function () {
  'use strict';

  var DURATION = 2000;
  var FRAME_RATE = 60;

  function initStats(section) {
    var items = section.querySelectorAll('[data-stat-value]');
    if (!items.length) return;

    var observer = createObserver(items);
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function createObserver(items) {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
  }

  function animateValue(el) {
    var target = parseFloat(el.getAttribute('data-stat-value'));
    if (isNaN(target)) return;

    var prefix = el.getAttribute('data-stat-prefix') || '';
    var suffix = el.getAttribute('data-stat-suffix') || '';
    var isDecimal = target % 1 !== 0;
    var steps = Math.ceil(DURATION / (1000 / FRAME_RATE));
    var current = 0;
    var step = 0;

    function update() {
      step++;
      var progress = easeOutQuart(step / steps);
      current = target * progress;

      var display = isDecimal
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString();

      el.textContent = prefix + display + suffix;

      if (step < steps) {
        requestAnimationFrame(update);
      } else {
        var finalDisplay = isDecimal
          ? target.toFixed(1)
          : target.toLocaleString();
        el.textContent = prefix + finalDisplay + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function init() {
    var sections = document.querySelectorAll(
      '[data-component="stats-section"]'
    );
    sections.forEach(initStats);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
