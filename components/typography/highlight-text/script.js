/*
 * Highlight Text Component Script
 * Purpose: Handles animated reveal of highlighted text using
 * IntersectionObserver to trigger the animation on scroll.
 */

(function () {
  'use strict';

  /**
   * Initialize highlight text animations using IntersectionObserver.
   * Reveals animated highlights when they scroll into view.
   */
  function initHighlightText() {
    var elements = document.querySelectorAll(
      '.voltz-highlight-text--animated:not(.voltz-highlight-text--revealed)'
    );

    if (elements.length === 0) {
      return;
    }

    if (!window.IntersectionObserver) {
      revealAllElements(elements);
      return;
    }

    var observer = createObserver();
    observeElements(elements, observer);
  }

  /**
   * Creates an IntersectionObserver for highlight reveal.
   * @returns {IntersectionObserver}
   */
  function createObserver() {
    return new IntersectionObserver(
      function handleIntersection(entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
  }

  /**
   * Observes a list of elements with the given observer.
   * @param {NodeList} elements
   * @param {IntersectionObserver} observer
   */
  function observeElements(elements, observer) {
    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Adds the revealed class to a single element.
   * @param {Element} element
   */
  function revealElement(element) {
    element.classList.add('voltz-highlight-text--revealed');
  }

  /**
   * Fallback: reveal all elements immediately.
   * @param {NodeList} elements
   */
  function revealAllElements(elements) {
    elements.forEach(function (el) {
      revealElement(el);
    });
  }

  /* Initialize on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHighlightText);
  } else {
    initHighlightText();
  }
})();
