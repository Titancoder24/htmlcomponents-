/**
 * Tooltip Component - script.js
 * Purpose: Manages tooltip show/hide behavior on hover and focus,
 * with configurable delay and Escape key dismissal.
 */

'use strict';

/**
 * Initializes all tooltip components on the page.
 */
function initTooltips() {
  const wrappers = document.querySelectorAll('.voltz-tooltip-wrapper');
  wrappers.forEach(initSingleTooltip);
}

/**
 * Initializes a single tooltip wrapper element.
 * @param {HTMLElement} wrapper - The tooltip wrapper element.
 */
function initSingleTooltip(wrapper) {
  const trigger = wrapper.querySelector('.voltz-tooltip-trigger');
  const tooltip = wrapper.querySelector('.voltz-tooltip');
  if (!trigger || !tooltip) return;

  const delay = parseInt(tooltip.dataset.delay, 10) || 200;
  let showTimeout = null;
  let hideTimeout = null;

  function showTooltip() {
    clearTimeout(hideTimeout);
    showTimeout = setTimeout(function () {
      tooltip.setAttribute('aria-hidden', 'false');
    }, delay);
  }

  function hideTooltip() {
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(function () {
      tooltip.setAttribute('aria-hidden', 'true');
    }, 100);
  }

  trigger.addEventListener('mouseenter', showTooltip);
  trigger.addEventListener('mouseleave', hideTooltip);
  trigger.addEventListener('focus', showTooltip);
  trigger.addEventListener('blur', hideTooltip);

  trigger.addEventListener('keydown', function (event) {
    handleEscapeKey(event, tooltip);
  });
}

/**
 * Handles Escape key to dismiss tooltip.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} tooltip - The tooltip element.
 */
function handleEscapeKey(event, tooltip) {
  if (event.key === 'Escape') {
    tooltip.setAttribute('aria-hidden', 'true');
  }
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTooltips);
} else {
  initTooltips();
}
