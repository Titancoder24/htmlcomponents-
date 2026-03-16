/*
 * Ripple Component Script
 * Creates a ripple wave span at click position within the container.
 * Wave element is removed after animation completes to prevent DOM bloat.
 * Uses only event delegation pattern.
 */

(function () {
  "use strict";

  function createRipple(event, container) {
    var rect = container.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = event.clientX - rect.left - size / 2;
    var y = event.clientY - rect.top - size / 2;

    var ripple = document.createElement("span");
    ripple.className = "voltz-ripple__wave";
    ripple.style.width = size + "px";
    ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    container.appendChild(ripple);

    ripple.addEventListener("animationend", function () {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    });
  }

  function initRipple() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    var containers = document.querySelectorAll("[data-voltz-ripple]");

    containers.forEach(function (container) {
      container.addEventListener("click", function (e) {
        createRipple(e, container);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRipple);
  } else {
    initRipple();
  }
})();
