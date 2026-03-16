/*
 * Scramble Text Component Script
 * Scrambles and unscrambles characters to reveal text.
 * Uses IntersectionObserver for scroll-triggered activation.
 */

(function () {
  'use strict';

  var CHAR_SETS = {
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    binary: '01',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  function getCharSet(variant) {
    return CHAR_SETS[variant] || CHAR_SETS.default;
  }

  function randomChar(charSet) {
    return charSet[Math.floor(Math.random() * charSet.length)];
  }

  function scrambleElement(container) {
    if (container.hasAttribute('data-animating')) return;
    container.setAttribute('data-animating', '');

    var content = container.querySelector('.voltz-scramble-text__content');
    var text = content.textContent;
    var variant = container.dataset.variant || 'default';
    var charSet = getCharSet(variant);
    var speed = parseFloat(
      getComputedStyle(container)
        .getPropertyValue('--voltz-scramble-text-speed')
    ) || 50;

    content.textContent = '';
    var chars = [];

    buildCharSpans(content, text, chars);
    animateChars(chars, charSet, speed, container);
  }

  function buildCharSpans(content, text, chars) {
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'voltz-scramble-text__char';
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.setAttribute('data-target', text[i]);
      content.appendChild(span);
      chars.push(span);
    }
  }

  function animateChars(chars, charSet, speed, container) {
    var resolved = 0;
    var total = chars.length;

    var interval = setInterval(function () {
      for (var i = resolved; i < total; i++) {
        var target = chars[i].getAttribute('data-target');
        if (target === ' ') continue;
        chars[i].textContent = randomChar(charSet);
        chars[i].className =
          'voltz-scramble-text__char voltz-scramble-text__char--scrambling';
      }

      if (resolved < total) {
        resolveChar(chars[resolved]);
        resolved++;
      }

      if (resolved >= total) {
        clearInterval(interval);
        container.removeAttribute('data-animating');
      }
    }, speed);
  }

  function resolveChar(charSpan) {
    var target = charSpan.getAttribute('data-target');
    charSpan.textContent = target === ' ' ? '\u00A0' : target;
    charSpan.className =
      'voltz-scramble-text__char voltz-scramble-text__char--resolved';
  }

  function initScrambleText(container) {
    if (container.hasAttribute('data-initialized')) return;
    container.setAttribute('data-initialized', '');

    var trigger = container.dataset.trigger || 'visible';

    if (trigger === 'visible') {
      observeVisibility(container);
    }
  }

  function observeVisibility(container) {
    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            scrambleElement(container);
            observer.unobserve(container);
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
  }

  function initAll() {
    var containers = document.querySelectorAll('[data-voltz-scramble-text]');
    for (var i = 0; i < containers.length; i++) {
      initScrambleText(containers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
