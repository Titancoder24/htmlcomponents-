/*
 * Wavy Text Component Script
 * Splits text into individual character spans for wave animation.
 * Sets stagger index CSS custom properties on each character.
 */

(function () {
  'use strict';

  function initWavyText(container) {
    if (container.hasAttribute('data-initialized')) return;

    var content = container.querySelector('.voltz-wavy-text__content');
    if (!content) return;

    var text = content.textContent;
    container.setAttribute('data-initialized', '');

    buildChars(container, content, text);
  }

  function buildChars(container, content, text) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'voltz-wavy-text__char';
      span.style.setProperty('--voltz-wavy-char-index', i);
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      fragment.appendChild(span);
    }

    container.appendChild(fragment);
  }

  function initAll() {
    var elements = document.querySelectorAll('[data-voltz-wavy-text]');
    for (var i = 0; i < elements.length; i++) {
      initWavyText(elements[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
