/**
 * Meter Component - script.js
 * Purpose: Calculates the fill width percentage and applies threshold-based
 * color classes (low/medium/high) based on the meter's value and thresholds.
 */

/**
 * Initializes all meter components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initMeters(root = document) {
  var meters = root.querySelectorAll('[data-voltz-meter]');
  meters.forEach(function initMeter(meterEl) {
    updateMeter(meterEl);
  });
}

/**
 * Updates a single meter element's fill width and color class.
 * @param {HTMLElement} meterEl - The meter track element
 */
function updateMeter(meterEl) {
  var value = parseFloat(meterEl.dataset.value) || 0;
  var min = parseFloat(meterEl.dataset.min) || 0;
  var max = parseFloat(meterEl.dataset.max) || 100;
  var low = parseFloat(meterEl.dataset.low) || 33;
  var high = parseFloat(meterEl.dataset.high) || 66;

  var fill = meterEl.querySelector('[data-voltz-meter-fill]');
  if (!fill) {
    return;
  }

  var percentage = calculatePercentage(value, min, max);
  fill.style.width = percentage + '%';

  applyThresholdColor(fill, value, low, high);
}

/**
 * Calculates the percentage of the value within the min-max range.
 * @param {number} value - Current value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Percentage clamped between 0 and 100
 */
function calculatePercentage(value, min, max) {
  if (max <= min) {
    return 0;
  }
  var raw = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, raw));
}

/**
 * Applies the appropriate threshold color class to the fill element.
 * @param {HTMLElement} fill - The fill bar element
 * @param {number} value - Current value
 * @param {number} low - Low threshold
 * @param {number} high - High threshold
 */
function applyThresholdColor(fill, value, low, high) {
  fill.classList.remove(
    'voltz-meter__fill--low',
    'voltz-meter__fill--medium',
    'voltz-meter__fill--high'
  );

  if (value <= low) {
    fill.classList.add('voltz-meter__fill--low');
  } else if (value <= high) {
    fill.classList.add('voltz-meter__fill--medium');
  } else {
    fill.classList.add('voltz-meter__fill--high');
  }
}

/**
 * Programmatically updates a meter's value and re-renders.
 * @param {HTMLElement} meterEl - The meter track element
 * @param {number} newValue - The new value to set
 */
function setMeterValue(meterEl, newValue) {
  meterEl.dataset.value = String(newValue);
  meterEl.setAttribute('aria-valuenow', String(newValue));
  updateMeter(meterEl);
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initMeters();
    });
  } else {
    initMeters();
  }
}
