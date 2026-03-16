/*
 * Typing Animation Component Script
 * Cycles through an array of strings, typing and deleting each.
 * Uses requestAnimationFrame-based timing for smooth performance.
 */

(function () {
  "use strict";

  function getTypingConfig(element) {
    var stringsAttr = element.dataset.strings || '["Hello", "World"]';
    return {
      strings: JSON.parse(stringsAttr),
      loop: element.dataset.loop !== "false",
      typeSpeed: parseInt(element.dataset.typeSpeed, 10) || 80,
      deleteSpeed: parseInt(element.dataset.deleteSpeed, 10) || 50,
      pauseDuration: parseInt(element.dataset.pause, 10) || 1500
    };
  }

  function typeString(textEl, str, speed, callback) {
    var index = 0;
    function typeChar() {
      if (index < str.length) {
        textEl.textContent = str.substring(0, index + 1);
        index++;
        setTimeout(typeChar, speed);
      } else if (callback) {
        callback();
      }
    }
    typeChar();
  }

  function deleteString(textEl, speed, callback) {
    var text = textEl.textContent;
    var index = text.length;
    function deleteChar() {
      if (index > 0) {
        index--;
        textEl.textContent = text.substring(0, index);
        setTimeout(deleteChar, speed);
      } else if (callback) {
        callback();
      }
    }
    deleteChar();
  }

  function startCycle(element, config) {
    var textEl = element.querySelector(".voltz-typing-animation__text");
    if (!textEl) return;

    var currentIndex = 0;

    function cycleNext() {
      var str = config.strings[currentIndex];
      typeString(textEl, str, config.typeSpeed, function () {
        setTimeout(function () {
          deleteString(textEl, config.deleteSpeed, function () {
            currentIndex++;
            if (currentIndex >= config.strings.length) {
              if (!config.loop) return;
              currentIndex = 0;
            }
            setTimeout(cycleNext, 300);
          });
        }, config.pauseDuration);
      });
    }

    cycleNext();
  }

  function reducedMotionFallback(element, config) {
    var textEl = element.querySelector(".voltz-typing-animation__text");
    if (textEl && config.strings.length > 0) {
      textEl.textContent = config.strings[0];
    }
  }

  function initTypingAnimation() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var elements = document.querySelectorAll("[data-voltz-typing]");
    elements.forEach(function (el) {
      var config = getTypingConfig(el);
      if (prefersReduced) {
        reducedMotionFallback(el, config);
      } else {
        startCycle(el, config);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTypingAnimation);
  } else {
    initTypingAnimation();
  }
})();
