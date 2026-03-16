/*
 * Slide In Component Script
 * Uses IntersectionObserver to trigger slide-in animation on scroll.
 * Adds data-visible attribute when element enters viewport.
 */

(function () {
  'use strict';

  function createObserver() {
    return new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.setAttribute('data-visible', '');
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
  }

  function initAll() {
    var observer = createObserver();
    var elements = document.querySelectorAll('[data-voltz-slide-in]');

    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].hasAttribute('data-initialized')) {
        elements[i].setAttribute('data-initialized', '');
        observer.observe(elements[i]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
