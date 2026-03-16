/*
 * Fade In Component Script
 * Uses IntersectionObserver to trigger fade-in animation on scroll.
 * Adds data-visible attribute when element enters viewport.
 */

(function () {
  'use strict';

  function createObserver() {
    return new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          handleEntry(entries[i]);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
  }

  function handleEntry(entry) {
    if (entry.isIntersecting) {
      entry.target.setAttribute('data-visible', '');
    }
  }

  function initAll() {
    var observer = createObserver();
    var elements = document.querySelectorAll('[data-voltz-fade-in]');

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
