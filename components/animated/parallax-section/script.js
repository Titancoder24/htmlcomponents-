/*
 * Parallax Section Component Script
 * Applies parallax transform based on scroll position.
 * Uses requestAnimationFrame for smooth updates.
 */

(function () {
  'use strict';

  var parallaxElements = [];
  var ticking = false;

  function initParallax(container) {
    if (container.hasAttribute('data-initialized')) return;
    container.setAttribute('data-initialized', '');

    var content = container.querySelector('.voltz-parallax__content');
    if (!content) return;

    var speed = parseFloat(container.dataset.speed) || 0.5;
    var variant = container.dataset.variant || 'vertical';

    parallaxElements.push({
      container: container,
      content: content,
      speed: speed,
      variant: variant
    });
  }

  function updateParallax() {
    var scrollTop = window.pageYOffset;

    for (var i = 0; i < parallaxElements.length; i++) {
      updateElement(parallaxElements[i], scrollTop);
    }
    ticking = false;
  }

  function updateElement(item, scrollTop) {
    var rect = item.container.getBoundingClientRect();
    var viewH = window.innerHeight;

    if (rect.bottom < 0 || rect.top > viewH) return;

    var center = rect.top + rect.height / 2;
    var offset = (center - viewH / 2) * item.speed;

    if (item.variant === 'horizontal') {
      item.content.style.transform = 'translateX(' + offset + 'px)';
    } else {
      item.content.style.transform = 'translateY(' + offset + 'px)';
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function initAll() {
    var elements = document.querySelectorAll('[data-voltz-parallax]');
    for (var i = 0; i < elements.length; i++) {
      initParallax(elements[i]);
    }

    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateParallax();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
