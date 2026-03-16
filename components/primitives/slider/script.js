/**
 * Slider Component - script.js
 * Purpose: Handles slider interactivity including ARIA attribute updates
 * (aria-valuenow), value display synchronization, and track fill
 * rendering via CSS custom property.
 */

/**
 * Initializes all voltz-slider elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initSliders(root = document) {
  const sliders = root.querySelectorAll('.voltz-slider__input');
  sliders.forEach(setupSlider);
}

/**
 * Sets up event listeners and initial state for a single slider.
 * @param {HTMLInputElement} slider - The range input to initialize
 */
function setupSlider(slider) {
  if (slider.dataset.voltzInit === 'true') return;
  slider.dataset.voltzInit = 'true';

  slider.addEventListener('input', handleSliderInput);
  slider.addEventListener('change', handleSliderChange);

  updateTrackFill(slider);
  updateValueDisplay(slider);
  syncAriaValue(slider);
}

/**
 * Handles real-time input events on the slider.
 * @param {InputEvent} event
 */
function handleSliderInput(event) {
  const slider = event.currentTarget;
  updateTrackFill(slider);
  updateValueDisplay(slider);
  syncAriaValue(slider);
}

/**
 * Handles change events (value committed).
 * @param {Event} event
 */
function handleSliderChange(event) {
  syncAriaValue(event.currentTarget);
}

/**
 * Updates the CSS custom property for the filled track portion.
 * Uses a gradient background on webkit browsers.
 * @param {HTMLInputElement} slider
 */
function updateTrackFill(slider) {
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const value = parseFloat(slider.value) || 0;
  const percent = ((value - min) / (max - min)) * 100;

  const wrapper = slider.closest('.voltz-slider');
  if (wrapper) {
    wrapper.style.setProperty('--voltz-slider-fill', percent + '%');
  }

  /* Apply gradient for webkit fill visualization */
  const fillColor = getComputedStyle(wrapper).getPropertyValue(
    '--voltz-slider-track-fill'
  ).trim() || '#2563eb';
  const trackColor = getComputedStyle(wrapper).getPropertyValue(
    '--voltz-slider-track-bg'
  ).trim() || '#e5e7eb';

  slider.style.background =
    `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${trackColor} ${percent}%, ${trackColor} 100%)`;
  slider.style.borderRadius =
    'calc(var(--voltz-slider-track-h) / 2)';
  slider.style.height = 'var(--voltz-slider-track-h)';
}

/**
 * Updates the visible output element with the current value.
 * @param {HTMLInputElement} slider
 */
function updateValueDisplay(slider) {
  const wrapper = slider.closest('.voltz-slider');
  if (!wrapper) return;

  const output = wrapper.querySelector('.voltz-slider__value');
  if (output) {
    output.textContent = slider.value;
  }
}

/**
 * Synchronizes ARIA value attributes with the current slider value.
 * @param {HTMLInputElement} slider
 */
function syncAriaValue(slider) {
  slider.setAttribute('aria-valuenow', slider.value);
}

/**
 * Sets the slider value programmatically.
 * @param {HTMLInputElement} slider - The range input
 * @param {number} value - The new value
 */
function setSliderValue(slider, value) {
  slider.value = String(value);
  updateTrackFill(slider);
  updateValueDisplay(slider);
  syncAriaValue(slider);
}

/**
 * Observe DOM for dynamically added sliders.
 */
function observeSliders() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-slider__input')) {
          setupSlider(node);
        }
        const nested = node.querySelectorAll?.('.voltz-slider__input');
        if (nested) nested.forEach(setupSlider);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

/* Auto-initialize when DOM is ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initSliders();
      observeSliders();
    });
  } else {
    initSliders();
    observeSliders();
  }
}

export { initSliders, setupSlider, setSliderValue, observeSliders };
