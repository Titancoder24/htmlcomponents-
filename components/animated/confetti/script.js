/*
 * Confetti Component Script
 * Creates confetti burst particles with randomized trajectories.
 * Supports on-load, on-click, and manual triggers.
 * Particles are cleaned up after animation completes.
 */

(function () {
  "use strict";

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createPiece(canvas, colors, spread) {
    var piece = document.createElement("span");
    piece.className = "voltz-confetti__piece";

    var color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.background = color;

    var x = randomBetween(-spread, spread);
    var y = randomBetween(-spread * 1.5, -spread * 0.2);
    var rotate = randomBetween(360, 1080);
    var delay = randomBetween(0, 0.3);

    piece.style.setProperty("--confetti-x", x + "px");
    piece.style.setProperty("--confetti-y", y + "px");
    piece.style.setProperty("--confetti-rotate", rotate + "deg");
    piece.style.setProperty("--confetti-delay", delay + "s");

    canvas.appendChild(piece);
    return piece;
  }

  function burst(element) {
    var canvas = element.querySelector(".voltz-confetti__canvas");
    if (!canvas) return;

    var count = parseInt(element.dataset.count, 10) || 30;
    var colorsStr = element.dataset.colors ||
      '["#6366f1","#ec4899","#fbbf24","#34d399","#f97316"]';
    var colors = JSON.parse(colorsStr);
    var spreadStr = getComputedStyle(element)
      .getPropertyValue("--voltz-confetti-spread").trim();
    var spread = parseInt(spreadStr, 10) || 200;

    var pieces = [];
    for (var i = 0; i < count; i++) {
      pieces.push(createPiece(canvas, colors, spread));
    }

    cleanupPieces(pieces);
  }

  function cleanupPieces(pieces) {
    var durationStr = "2000";
    var timeout = parseInt(durationStr, 10) + 500;

    setTimeout(function () {
      pieces.forEach(function (piece) {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      });
    }, timeout);
  }

  function initConfetti() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var elements = document.querySelectorAll("[data-voltz-confetti]");

    elements.forEach(function (el) {
      var trigger = el.dataset.trigger || "on-click";

      if (trigger === "on-load" && !prefersReduced) {
        burst(el);
      }

      if (trigger === "on-click") {
        el.addEventListener("click", function () {
          if (!prefersReduced) {
            burst(el);
          }
        });
      }

      /* Manual trigger: expose burst via custom event */
      el.addEventListener("voltz-confetti-burst", function () {
        if (!prefersReduced) {
          burst(el);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConfetti);
  } else {
    initConfetti();
  }
})();
