/*
 * Text Reveal Component Script
 * Splits text into individual characters or words and applies
 * staggered animation delays. Uses IntersectionObserver to
 * trigger animation when element enters viewport.
 */

(function () {
  "use strict";

  function splitText(element) {
    const variant = element.dataset.variant || "typewriter";
    const splitMode = element.dataset.split || "char";
    const contentEl = element.querySelector(".voltz-text-reveal__content");
    if (!contentEl) return;

    const text = contentEl.textContent;
    const baseDuration = parseFloat(
      getComputedStyle(element).getPropertyValue("--voltz-text-reveal-duration")
    ) || 0.05;

    const fragment = document.createDocumentFragment();
    const units = splitMode === "word" ? text.split(/(\s+)/) : text.split("");

    units.forEach(function (unit, index) {
      if (variant === "slide-up" && splitMode === "word" && unit.trim()) {
        const wrapper = document.createElement("span");
        wrapper.className = "voltz-text-reveal__word-wrapper";
        const span = createUnitSpan(unit, index, baseDuration);
        wrapper.appendChild(span);
        fragment.appendChild(wrapper);
      } else {
        const span = createUnitSpan(unit, index, baseDuration);
        fragment.appendChild(span);
      }
    });

    element.appendChild(fragment);
    element.setAttribute("data-initialized", "");
  }

  function createUnitSpan(unit, index, baseDuration) {
    const span = document.createElement("span");
    span.className = "voltz-text-reveal__unit";
    span.textContent = unit;
    span.style.animationDelay = (index * baseDuration) + "s";
    span.style.animationPlayState = "paused";
    return span;
  }

  function playAnimation(element) {
    var units = element.querySelectorAll(".voltz-text-reveal__unit");
    units.forEach(function (unit) {
      unit.style.animationPlayState = "running";
    });
  }

  function initTextReveal() {
    var elements = document.querySelectorAll("[data-voltz-text-reveal]");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playAnimation(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach(function (el) {
      splitText(el);
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTextReveal);
  } else {
    initTextReveal();
  }
})();
