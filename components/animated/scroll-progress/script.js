/*
 * Scroll Progress Component Script
 * Updates progress bar width based on page scroll position.
 * Uses transform scaleX for compositor-friendly animation.
 */

(function () {
  'use strict';

  function initScrollProgress(container) {
    if (container.hasAttribute('data-initialized')) return;
    container.setAttribute('data-initialized', '');

    var bar = container.querySelector('.voltz-scroll-progress__bar');
    if (!bar) return;

    var ticking = false;

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight;
      var winHeight = window.innerHeight;
      var maxScroll = docHeight - winHeight;

      if (maxScroll <= 0) return;

      var progress = Math.min(scrollTop / maxScroll, 1);
      bar.style.transform = 'scaleX(' + progress + ')';
      container.setAttribute('aria-valuenow', Math.round(progress * 100));
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
  }

  function initAll() {
    var elements = document.querySelectorAll('[data-voltz-scroll-progress]');
    for (var i = 0; i < elements.length; i++) {
      initScrollProgress(elements[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
