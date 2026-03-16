/**
 * Hero Animated Component Script
 * Handles intersection observer for triggering animations on scroll.
 * Resets animations when section enters viewport.
 * No innerHTML, no eval, no inline handlers.
 */

(function heroAnimatedInit() {
  "use strict";

  /**
   * Initializes a hero-animated section with IntersectionObserver.
   * Adds 'is-visible' class when section enters viewport.
   */
  function initHeroAnimated(section) {
    const words = section.querySelectorAll(".voltz-hero-animated__word");
    const subheadline = section.querySelector(
      ".voltz-hero-animated__subheadline"
    );
    const staggerEls = section.querySelectorAll(
      ".voltz-hero-animated__stagger"
    );

    if (!window.IntersectionObserver) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      function handleIntersect(entries) {
        entries.forEach(function processEntry(entry) {
          if (entry.isIntersecting) {
            section.classList.add("is-visible");
            restartAnimations(words, subheadline, staggerEls);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
  }

  /**
   * Restarts CSS animations by removing and re-adding animation class.
   */
  function restartAnimations(words, subheadline, staggerEls) {
    var allEls = [];
    words.forEach(function collectWord(el) { allEls.push(el); });
    if (subheadline) allEls.push(subheadline);
    staggerEls.forEach(function collectStagger(el) { allEls.push(el); });

    allEls.forEach(function restartEl(el) {
      el.style.animationPlayState = "running";
    });
  }

  /**
   * Discovers and initializes all hero-animated components.
   */
  function initAll() {
    var sections = document.querySelectorAll(
      '[data-component="hero-animated"]'
    );
    sections.forEach(initHeroAnimated);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
