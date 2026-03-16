/*
 * Orbit Component Script
 * Distributes child items evenly around the orbit track.
 * Uses CSS custom properties for angle positioning.
 */

(function () {
  'use strict';

  function initOrbit(container) {
    const track = container.querySelector('.voltz-orbit__track');
    if (!track || container.hasAttribute('data-initialized')) return;

    const items = track.querySelectorAll('.voltz-orbit__item');
    const count = items.length;

    if (count === 0) return;

    distributeItems(items, count);
    container.setAttribute('data-initialized', '');
  }

  function distributeItems(items, count) {
    var step = 360 / count;
    for (var i = 0; i < items.length; i++) {
      var angle = step * i;
      items[i].style.setProperty('--voltz-orbit-angle', angle + 'deg');
    }
  }

  function initAll() {
    var containers = document.querySelectorAll('[data-voltz-orbit]');
    for (var i = 0; i < containers.length; i++) {
      initOrbit(containers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
