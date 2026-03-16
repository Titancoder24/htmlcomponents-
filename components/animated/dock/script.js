/*
 * Dock Component Script
 * Applies proximity-based magnification to dock items.
 * Uses transform scale for compositor-friendly animation.
 */

(function () {
  'use strict';

  function initDock(container) {
    if (container.hasAttribute('data-initialized')) return;
    container.setAttribute('data-initialized', '');

    var dockContainer = container.querySelector('.voltz-dock__container');
    if (!dockContainer) return;

    var items = dockContainer.querySelectorAll('.voltz-dock__item');
    if (items.length === 0) return;

    dockContainer.addEventListener('mousemove', function (e) {
      handleMouseMove(e, items, container);
    });

    dockContainer.addEventListener('mouseleave', function () {
      resetItems(items);
    });
  }

  function handleMouseMove(e, items, container) {
    var style = getComputedStyle(container);
    var maxScale = parseFloat(
      style.getPropertyValue('--voltz-dock-magnification')
    ) || 1.8;
    var isVertical = container.dataset.variant === 'vertical';

    for (var i = 0; i < items.length; i++) {
      var rect = items[i].getBoundingClientRect();
      var center = isVertical
        ? rect.top + rect.height / 2
        : rect.left + rect.width / 2;
      var mousePos = isVertical ? e.clientY : e.clientX;
      var distance = Math.abs(mousePos - center);
      var scale = calculateScale(distance, maxScale);

      items[i].style.transform = 'scale(' + scale + ')';
    }
  }

  function calculateScale(distance, maxScale) {
    var maxDistance = 120;
    var normalized = Math.min(distance / maxDistance, 1);
    var factor = 1 - normalized;
    var eased = factor * factor;
    return 1 + (maxScale - 1) * eased;
  }

  function resetItems(items) {
    for (var i = 0; i < items.length; i++) {
      items[i].style.transform = '';
    }
  }

  function initAll() {
    var elements = document.querySelectorAll('[data-voltz-dock]');
    for (var i = 0; i < elements.length; i++) {
      initDock(elements[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
