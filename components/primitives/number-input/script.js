/**
 * NumberInput Component - script.js
 * Purpose: Manages increment/decrement button clicks, keyboard arrow key
 * support, value clamping within min/max bounds, and ARIA state updates.
 */

/**
 * Initializes all number input components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initNumberInputs(root = document) {
  var containers = root.querySelectorAll('[data-voltz-number-input]');
  containers.forEach(function setup(container) {
    if (container.dataset.voltzNumberInit) {
      return;
    }
    container.dataset.voltzNumberInit = 'true';
    setupNumberInput(container);
  });
}

/**
 * Sets up event listeners for a single number input component.
 * @param {HTMLElement} container - The number input container
 */
function setupNumberInput(container) {
  var input = container.querySelector('[data-voltz-number-input-field]');
  var decBtn = container.querySelector('[data-voltz-number-decrement]');
  var incBtn = container.querySelector('[data-voltz-number-increment]');

  if (!input) {
    return;
  }

  var config = getNumberConfig(container);

  decBtn.addEventListener('click', function onDec() {
    stepValue(container, input, -config.step);
  });

  incBtn.addEventListener('click', function onInc() {
    stepValue(container, input, config.step);
  });

  input.addEventListener('keydown', function onKey(e) {
    handleNumberKeydown(e, container, input, config.step);
  });

  input.addEventListener('change', function onChange() {
    sanitizeInput(container, input);
  });

  updateButtonStates(container, input);
}

/**
 * Reads min/max/step configuration from data attributes.
 * @param {HTMLElement} container - The number input container
 * @returns {object} Configuration with min, max, step values
 */
function getNumberConfig(container) {
  var min = container.dataset.min;
  var max = container.dataset.max;
  return {
    min: min !== undefined && min !== '' ? parseFloat(min) : null,
    max: max !== undefined && max !== '' ? parseFloat(max) : null,
    step: parseFloat(container.dataset.step) || 1
  };
}

/**
 * Increments or decrements the value by the given delta.
 * @param {HTMLElement} container - The number input container
 * @param {HTMLInputElement} input - The input element
 * @param {number} delta - The amount to change (positive or negative)
 */
function stepValue(container, input, delta) {
  var current = parseFloat(input.value) || 0;
  var newVal = current + delta;
  setNumberValue(container, input, newVal);
}

/**
 * Sets the input value, clamping to min/max bounds.
 * @param {HTMLElement} container - The number input container
 * @param {HTMLInputElement} input - The input element
 * @param {number} value - The value to set
 */
function setNumberValue(container, input, value) {
  var config = getNumberConfig(container);
  var clamped = clampValue(value, config.min, config.max);

  input.value = String(clamped);
  input.setAttribute('aria-valuenow', String(clamped));
  updateButtonStates(container, input);

  container.dispatchEvent(new CustomEvent('voltz-number-change', {
    bubbles: true,
    detail: { value: clamped }
  }));
}

/**
 * Clamps a value between optional min and max bounds.
 * @param {number} value - The value to clamp
 * @param {number|null} min - Minimum bound
 * @param {number|null} max - Maximum bound
 * @returns {number} The clamped value
 */
function clampValue(value, min, max) {
  if (min !== null && value < min) { return min; }
  if (max !== null && value > max) { return max; }
  return value;
}

/**
 * Handles keyboard arrow key events on the number input.
 * @param {KeyboardEvent} e - The keydown event
 * @param {HTMLElement} container - The container element
 * @param {HTMLInputElement} input - The input element
 * @param {number} step - The step value
 */
function handleNumberKeydown(e, container, input, step) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    stepValue(container, input, step);
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    stepValue(container, input, -step);
  }
}

/**
 * Sanitizes manual input to ensure it is a valid number.
 * @param {HTMLElement} container - The container element
 * @param {HTMLInputElement} input - The input element
 */
function sanitizeInput(container, input) {
  var val = parseFloat(input.value);
  if (isNaN(val)) {
    input.value = '';
    return;
  }
  setNumberValue(container, input, val);
}

/**
 * Disables increment/decrement buttons when at min/max bounds.
 * @param {HTMLElement} container - The container element
 * @param {HTMLInputElement} input - The input element
 */
function updateButtonStates(container, input) {
  var config = getNumberConfig(container);
  var val = parseFloat(input.value);
  var decBtn = container.querySelector('[data-voltz-number-decrement]');
  var incBtn = container.querySelector('[data-voltz-number-increment]');

  if (decBtn) {
    decBtn.disabled = config.min !== null && val <= config.min;
  }
  if (incBtn) {
    incBtn.disabled = config.max !== null && val >= config.max;
  }
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initNumberInputs();
    });
  } else {
    initNumberInputs();
  }
}
