/*
 * Magnetic Button Component Script
 * Tracks mouse position relative to button center and applies
 * a proportional transform offset. Resets smoothly on mouse leave.
 * Uses only transform for compositor-friendly animation.
 */

(function () {
  "use strict";

  function handleMouseMove(event, button, strength) {
    var rect = button.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var deltaX = (event.clientX - centerX) * strength;
    var deltaY = (event.clientY - centerY) * strength;

    button.style.transform =
      "translate(" + deltaX + "px, " + deltaY + "px)";
    button.style.transition = "transform 0.15s ease-out";
  }

  function handleMouseLeave(button) {
    button.style.transform = "translate(0, 0)";
    button.style.transition =
      "transform " +
      getComputedStyle(button)
        .getPropertyValue("--voltz-magnetic-btn-transition")
        .trim();
  }

  function initMagneticButton() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    var buttons = document.querySelectorAll("[data-voltz-magnetic-btn]");

    buttons.forEach(function (button) {
      var strength = parseFloat(button.dataset.strength) || 0.3;

      button.addEventListener("mousemove", function (e) {
        handleMouseMove(e, button, strength);
      });

      button.addEventListener("mouseleave", function () {
        handleMouseLeave(button);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMagneticButton);
  } else {
    initMagneticButton();
  }
})();
