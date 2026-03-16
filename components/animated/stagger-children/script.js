/*
 * Stagger Children Component Script
 * Sets stagger index on children and observes visibility.
 * Uses IntersectionObserver for scroll-triggered activation.
 */

(function () {
  'use strict';

  function indexChildren(container) {
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      children[i].style.setProperty('--voltz-stagger-index', i);
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
    var elements = document.querySelectorAll('[data-voltz-stagger]');

    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].hasAttribute('data-initialized')) {
        elements[i].setAttribute('data-initialized', '');
        indexChildren(elements[i]);
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
