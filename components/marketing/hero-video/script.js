/**
 * Hero Video Component Script
 * Handles play/pause toggle for background video.
 * No innerHTML, no eval, no inline handlers.
 */

(function heroVideoInit() {
  "use strict";

  /**
   * Initializes a single hero-video component instance.
   * Binds play/pause toggle button to the background video.
   */
  function initHeroVideo(section) {
    const video = section.querySelector(".voltz-hero-video__video");
    const toggleBtn = section.querySelector(".voltz-hero-video__play-toggle");

    if (!video || !toggleBtn) return;

    toggleBtn.addEventListener("click", function handleToggle() {
      const isPlaying = toggleBtn.getAttribute("data-playing") === "true";

      if (isPlaying) {
        video.pause();
        toggleBtn.setAttribute("data-playing", "false");
        toggleBtn.setAttribute("aria-label", "Play background video");
      } else {
        video.play();
        toggleBtn.setAttribute("data-playing", "true");
        toggleBtn.setAttribute("aria-label", "Pause background video");
      }
    });

    /* Sync state if video ends or is paused externally */
    video.addEventListener("pause", function handlePause() {
      toggleBtn.setAttribute("data-playing", "false");
      toggleBtn.setAttribute("aria-label", "Play background video");
    });

    video.addEventListener("play", function handlePlay() {
      toggleBtn.setAttribute("data-playing", "true");
      toggleBtn.setAttribute("aria-label", "Pause background video");
    });
  }

  /**
   * Discovers and initializes all hero-video components on the page.
   */
  function initAll() {
    const sections = document.querySelectorAll(
      '[data-component="hero-video"]'
    );
    sections.forEach(initHeroVideo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
