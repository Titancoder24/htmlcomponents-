/*
 * Meteors Component Script
 * Generates meteor elements with randomized positions and delays.
 * CSS handles the falling animation; JS only creates DOM elements.
 */

(function () {
  "use strict";

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createMeteor(field) {
    var meteor = document.createElement("span");
    meteor.className = "voltz-meteors__meteor";

    meteor.style.setProperty("--meteor-left", randomBetween(0, 100) + "%");
    meteor.style.setProperty("--meteor-top", randomBetween(-20, -5) + "%");
    meteor.style.setProperty("--meteor-delay", randomBetween(0, 5) + "s");

    var speed = randomBetween(2, 6);
    meteor.style.animationDuration = speed + "s";

    field.appendChild(meteor);
  }

  function initMeteors() {
    var elements = document.querySelectorAll("[data-voltz-meteors]");

    elements.forEach(function (el) {
      var field = el.querySelector(".voltz-meteors__field");
      if (!field) return;

      var count = parseInt(el.dataset.count, 10) || 8;

      for (var i = 0; i < count; i++) {
        createMeteor(field);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMeteors);
  } else {
    initMeteors();
  }
})();
