/*
 * Morphing Card Component Script
 * Handles click-variant toggle for the morphing card.
 * Hover variant is CSS-only and needs no JS.
 */

(function () {
  "use strict";

  function initMorphingCard() {
    var cards = document.querySelectorAll(
      '[data-voltz-morphing-card][data-variant="click"]'
    );

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        card.classList.toggle("voltz-morphing-card--active");
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("voltz-morphing-card--active");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMorphingCard);
  } else {
    initMorphingCard();
  }
})();
