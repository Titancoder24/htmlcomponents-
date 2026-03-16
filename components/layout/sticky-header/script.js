/*
 * Sticky Header Component - script.js
 * Purpose: Detects scroll position to apply shadow and transparent-to-solid transition.
 * No innerHTML, no eval, no inline handlers.
 */

/**
 * Initialize all sticky header components on the page.
 */
function initStickyHeaders() {
  const headers = document.querySelectorAll(".voltz-sticky-header");
  headers.forEach(initSingleStickyHeader);
}

/**
 * Initialize a single sticky header instance.
 * @param {HTMLElement} header - The sticky header root element.
 */
function initSingleStickyHeader(header) {
  const scrollThreshold = 10;

  function handleScroll() {
    updateScrollState(header, scrollThreshold);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  updateScrollState(header, scrollThreshold);
}

/**
 * Update the scrolled data attribute based on scroll position.
 * @param {HTMLElement} header - The sticky header element.
 * @param {number} threshold - Scroll threshold in pixels.
 */
function updateScrollState(header, threshold) {
  const scrolled = window.scrollY > threshold;
  const current = header.getAttribute("data-scrolled");
  const newValue = String(scrolled);

  if (current !== newValue) {
    header.setAttribute("data-scrolled", newValue);
  }
}

/* === Auto-initialize on DOM ready === */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStickyHeaders);
} else {
  initStickyHeaders();
}
