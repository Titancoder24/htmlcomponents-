/*
 * Number Counter Component Script
 * Counts from 0 to target number with easing.
 * Uses IntersectionObserver to trigger on scroll.
 * Supports decimal places and thousand separators.
 */

(function () {
  "use strict";

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatNumber(value, decimals, separator) {
    var fixed = value.toFixed(decimals);
    var parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(".");
  }

  function animateCounter(element) {
    var valueEl = element.querySelector(".voltz-number-counter__value");
    if (!valueEl) return;

    var target = parseFloat(element.dataset.target) || 0;
    var duration = parseInt(element.dataset.duration, 10) || 2000;
    var decimals = parseInt(element.dataset.decimals, 10) || 0;
    var separator = element.dataset.separator || ",";
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var currentValue = easedProgress * target;

      valueEl.textContent = formatNumber(currentValue, decimals, separator);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function initNumberCounter() {
    var elements = document.querySelectorAll("[data-voltz-counter]");
    if (elements.length === 0) return;

    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      elements.forEach(function (el) {
        showFinalValue(el);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function showFinalValue(element) {
    var valueEl = element.querySelector(".voltz-number-counter__value");
    if (!valueEl) return;
    var target = parseFloat(element.dataset.target) || 0;
    var decimals = parseInt(element.dataset.decimals, 10) || 0;
    var separator = element.dataset.separator || ",";
    valueEl.textContent = formatNumber(target, decimals, separator);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNumberCounter);
  } else {
    initNumberCounter();
  }
})();
