/*
 * Flip Card Component Script
 * Handles click-trigger flip cards by toggling a flipped class.
 * Hover-trigger cards are CSS-only and need no JS.
 */

(function () {
  "use strict";

  function initFlipCards() {
    var cards = document.querySelectorAll(
      '[data-voltz-flip-card][data-trigger="click"]'
    );

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        card.classList.toggle("voltz-flip-card--flipped");
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("voltz-flip-card--flipped");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFlipCards);
  } else {
    initFlipCards();
  }
})();
