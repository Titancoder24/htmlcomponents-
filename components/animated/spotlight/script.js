/*
 * Spotlight Component Script
 * Tracks mouse position within the component and updates
 * CSS custom properties to position the radial gradient spotlight.
 */

(function () {
  "use strict";

  function handleSpotlightMove(event, element) {
    var rect = element.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    element.style.setProperty("--voltz-spotlight-x", x + "px");
    element.style.setProperty("--voltz-spotlight-y", y + "px");
  }

  function initSpotlight() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    var elements = document.querySelectorAll("[data-voltz-spotlight]");

    elements.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        handleSpotlightMove(e, el);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpotlight);
  } else {
    initSpotlight();
  }
})();
