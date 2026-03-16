/*
 * Sparkles Component Script
 * Generates sparkle particle elements with randomized positions,
 * sizes, and animation delays. Pure DOM creation, no innerHTML.
 */

(function () {
  "use strict";

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createSparkle(container) {
    var particle = document.createElement("span");
    particle.className = "voltz-sparkles__particle";
    particle.style.top = randomBetween(0, 100) + "%";
    particle.style.left = randomBetween(0, 100) + "%";
    particle.style.animationDelay = randomBetween(0, 2) + "s";
    particle.style.animationDuration =
      randomBetween(1, 2.5) + "s";

    var scale = randomBetween(0.5, 1.2);
    particle.style.transform = "scale(" + scale + ")";

    container.appendChild(particle);
  }

  function initSparkles() {
    var elements = document.querySelectorAll("[data-voltz-sparkles]");

    elements.forEach(function (el) {
      var container = el.querySelector(".voltz-sparkles__container");
      if (!container) return;

      var count = parseInt(el.dataset.count, 10) || 6;

      for (var i = 0; i < count; i++) {
        createSparkle(container);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSparkles);
  } else {
    initSparkles();
  }
})();
