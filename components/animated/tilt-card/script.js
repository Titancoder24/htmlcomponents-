/*
 * Tilt Card Component Script
 * Tracks mouse position over the card and computes tilt angles.
 * Sets CSS custom properties for rotateX/rotateY transforms.
 * Optionally updates glare position.
 */

(function () {
  "use strict";

  function handleTiltMove(event, card, maxTilt) {
    var rect = card.getBoundingClientRect();
    var x = (event.clientX - rect.left) / rect.width;
    var y = (event.clientY - rect.top) / rect.height;

    var tiltX = (0.5 - y) * maxTilt;
    var tiltY = (x - 0.5) * maxTilt;

    card.style.setProperty("--voltz-tilt-x", tiltX + "deg");
    card.style.setProperty("--voltz-tilt-y", tiltY + "deg");

    if (card.dataset.glare === "true") {
      card.style.setProperty("--voltz-glare-x", (x * 100) + "%");
      card.style.setProperty("--voltz-glare-y", (y * 100) + "%");
    }
  }

  function handleTiltLeave(card) {
    card.style.setProperty("--voltz-tilt-x", "0deg");
    card.style.setProperty("--voltz-tilt-y", "0deg");
  }

  function initTiltCards() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    var cards = document.querySelectorAll("[data-voltz-tilt-card]");

    cards.forEach(function (card) {
      var maxTilt = parseFloat(card.dataset.maxTilt) || 15;

      card.addEventListener("mousemove", function (e) {
        handleTiltMove(e, card, maxTilt);
      });

      card.addEventListener("mouseleave", function () {
        handleTiltLeave(card);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTiltCards);
  } else {
    initTiltCards();
  }
})();
