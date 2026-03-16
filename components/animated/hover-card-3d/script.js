/*
 * Hover Card 3D Component Script
 * Tracks mouse position and applies 3D rotation transform.
 * Uses CSS custom properties for compositor-friendly transforms.
 */

(function () {
  'use strict';

  function initHoverCard(container) {
    if (container.hasAttribute('data-initialized')) return;
    container.setAttribute('data-initialized', '');

    var inner = container.querySelector('.voltz-hover-card-3d__inner');
    if (!inner) return;

    container.addEventListener('mousemove', function (e) {
      handleMouseMove(e, container, inner);
    });

    container.addEventListener('mouseleave', function () {
      handleMouseLeave(inner);
    });
  }

  function handleMouseMove(e, container, inner) {
    var rect = container.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var y = (e.clientY - rect.top) / rect.height;

    var style = getComputedStyle(container);
    var maxRot = parseFloat(
      style.getPropertyValue('--voltz-hover-card-3d-rotation')
    ) || 15;
    var scale = parseFloat(
      style.getPropertyValue('--voltz-hover-card-3d-scale')
    ) || 1.02;

    var rotateY = (x - 0.5) * maxRot;
    var rotateX = (0.5 - y) * maxRot;

    inner.style.transform =
      'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(' + scale + ')';

    inner.style.setProperty(
      '--voltz-hover-card-3d-mouse-x',
      (x * 100) + '%'
    );
    inner.style.setProperty(
      '--voltz-hover-card-3d-mouse-y',
      (y * 100) + '%'
    );
  }

  function handleMouseLeave(inner) {
    inner.style.transform = '';
  }

  function initAll() {
    var elements = document.querySelectorAll('[data-voltz-hover-card-3d]');
    for (var i = 0; i < elements.length; i++) {
      initHoverCard(elements[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
