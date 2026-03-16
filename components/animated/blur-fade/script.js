/*
 * Blur Fade Component Script
 * Uses IntersectionObserver to detect when elements enter the viewport
 * and adds the visible class to trigger CSS transitions.
 */

(function () {
  "use strict";

  function initBlurFade() {
    var elements = document.querySelectorAll("[data-voltz-blur-fade]");
    if (elements.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("voltz-blur-fade--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBlurFade);
  } else {
    initBlurFade();
  }
})();
