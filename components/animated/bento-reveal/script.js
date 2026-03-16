/*
 * Bento Reveal Component Script
 * Indexes bento items for stagger delay and observes visibility.
 * Uses IntersectionObserver for scroll-triggered activation.
 */

(function () {
  'use strict';

  function indexItems(container) {
    var items = container.querySelectorAll('.voltz-bento-reveal__item');
    for (var i = 0; i < items.length; i++) {
      items[i].style.setProperty('--voltz-bento-index', i);
    }
  }

  function createObserver() {
    return new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.setAttribute('data-visible', '');
          }
        }
      },
      { threshold: 0.1 }
    );
  }

  function initAll() {
    var observer = createObserver();
    var elements = document.querySelectorAll('[data-voltz-bento-reveal]');

    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].hasAttribute('data-initialized')) {
        elements[i].setAttribute('data-initialized', '');
        indexItems(elements[i]);
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
