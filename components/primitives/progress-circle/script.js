/**
 * Progress Circle Component - script.js
 * Purpose: Manages the stroke-dashoffset calculation for the circular
 * progress indicator based on the current value prop.
 */

const VoltzProgressCircle = (() => {
  'use strict';

  const CIRCUMFERENCE = 2 * Math.PI * 16; // r=16, ~100.53

  /**
   * Calculates the stroke-dashoffset for a given percentage value.
   */
  function calculateOffset(value) {
    const clamped = Math.max(0, Math.min(100, value));
    return CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  }

  /**
   * Updates the progress circle fill to reflect the current value.
   */
  function updateCircle(circleEl) {
    const value = parseInt(circleEl.getAttribute('aria-valuenow'), 10) || 0;
    const fill = circleEl.querySelector('.voltz-progress-circle__fill');
    if (!fill) {
      return;
    }

    const offset = calculateOffset(value);
    fill.setAttribute('stroke-dasharray', String(CIRCUMFERENCE));
    fill.setAttribute('stroke-dashoffset', String(offset));

    const label = circleEl.querySelector('.voltz-progress-circle__value');
    if (label) {
      label.textContent = `${value}%`;
    }
  }

  /**
   * Sets the progress value and updates the visual indicator.
   */
  function setValue(circleEl, value) {
    const clamped = Math.max(0, Math.min(100, value));
    circleEl.setAttribute('aria-valuenow', String(clamped));
    updateCircle(circleEl);
  }

  /**
   * Initializes all progress circle elements in the given root.
   */
  function init(root = document) {
    const circles = root.querySelectorAll(
      '.voltz-progress-circle:not([data-initialized])'
    );
    circles.forEach((circleEl) => {
      circleEl.dataset.initialized = 'true';
      updateCircle(circleEl);
    });
  }

  return { init, setValue, calculateOffset };
})();

document.addEventListener('DOMContentLoaded', () => {
  VoltzProgressCircle.init();
});
