/**
 * ColorPicker Component - script.js
 * Purpose: Manages preset swatch rendering, swatch selection, hex input
 * validation, native color picker sync, and preview swatch updates.
 */

var DEFAULT_PRESETS = [
  '#ef4444', '#f59e0b', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#64748b',
  '#0f172a', '#ffffff'
];

/**
 * Initializes all color picker components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initColorPickers(root = document) {
  var containers = root.querySelectorAll('[data-voltz-color-picker]');
  containers.forEach(function setup(container) {
    if (container.dataset.voltzColorInit) {
      return;
    }
    container.dataset.voltzColorInit = 'true';
    setupColorPicker(container);
  });
}

/**
 * Sets up a single color picker component.
 * @param {HTMLElement} container - The color picker container
 */
function setupColorPicker(container) {
  var hexInput = container.querySelector('[data-voltz-color-hex-input]');
  var preview = container.querySelector('[data-voltz-color-preview]');
  var nativeInput = container.querySelector('[data-voltz-color-native]');
  var swatchesEl = container.querySelector('[data-voltz-color-swatches]');

  var presets = parsePresets(container.dataset.presets);
  var value = container.dataset.value || '#3b82f6';

  renderSwatches(swatchesEl, presets, value);
  updatePreview(preview, value);

  setupHexInput(container, hexInput, preview, nativeInput, swatchesEl);
  setupNativeInput(container, hexInput, preview, nativeInput, swatchesEl);
  setupSwatchClicks(container, hexInput, preview, nativeInput, swatchesEl);
}

/**
 * Parses the presets data attribute into an array of hex colors.
 * @param {string} presetsStr - JSON or comma-separated preset string
 * @returns {string[]} Array of hex color strings
 */
function parsePresets(presetsStr) {
  if (!presetsStr) {
    return DEFAULT_PRESETS;
  }
  try {
    var parsed = JSON.parse(presetsStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    /* fallback to comma split */
  }
  return presetsStr.split(',').map(function trim(s) {
    return s.trim();
  });
}

/**
 * Renders preset swatch buttons into the swatches container.
 * @param {HTMLElement} swatchesEl - The swatches container
 * @param {string[]} presets - Array of hex colors
 * @param {string} selectedValue - Currently selected hex color
 */
function renderSwatches(swatchesEl, presets, selectedValue) {
  while (swatchesEl.firstChild) {
    swatchesEl.removeChild(swatchesEl.firstChild);
  }

  presets.forEach(function createSwatch(color, idx) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'voltz-color-picker__swatch';
    btn.dataset.color = color;
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-label', 'Color ' + color);
    btn.setAttribute('aria-selected', String(
      color.toLowerCase() === selectedValue.toLowerCase()
    ));

    if (color.toLowerCase() === selectedValue.toLowerCase()) {
      btn.classList.add('voltz-color-picker__swatch--selected');
    }

    var inner = document.createElement('span');
    inner.className = 'voltz-color-picker__swatch-color';
    inner.style.backgroundColor = color;

    btn.appendChild(inner);
    swatchesEl.appendChild(btn);
  });
}

/**
 * Sets up the hex input field event listeners.
 * @param {HTMLElement} container - The color picker container
 * @param {HTMLInputElement} hexInput - The hex input element
 * @param {HTMLElement} preview - The preview swatch element
 * @param {HTMLInputElement} nativeInput - The native color input
 * @param {HTMLElement} swatchesEl - The swatches container
 */
function setupHexInput(container, hexInput, preview, nativeInput, swatchesEl) {
  hexInput.addEventListener('input', function onInput() {
    var val = hexInput.value;
    if (isValidHex(val)) {
      applyColor(container, val, preview, nativeInput, swatchesEl);
    }
  });

  hexInput.addEventListener('change', function onChange() {
    var val = hexInput.value;
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    if (isValidHex(val)) {
      hexInput.value = val;
      applyColor(container, val, preview, nativeInput, swatchesEl);
    }
  });
}

/**
 * Sets up the native color input change listener.
 * @param {HTMLElement} container - The color picker container
 * @param {HTMLInputElement} hexInput - The hex input element
 * @param {HTMLElement} preview - The preview swatch
 * @param {HTMLInputElement} nativeInput - The native color input
 * @param {HTMLElement} swatchesEl - The swatches container
 */
function setupNativeInput(container, hexInput, preview, nativeInput, swatchesEl) {
  nativeInput.addEventListener('input', function onChange() {
    var val = nativeInput.value;
    hexInput.value = val;
    applyColor(container, val, preview, nativeInput, swatchesEl);
  });
}

/**
 * Sets up click/keyboard listeners on swatch buttons.
 * @param {HTMLElement} container - The color picker container
 * @param {HTMLInputElement} hexInput - The hex input element
 * @param {HTMLElement} preview - The preview swatch
 * @param {HTMLInputElement} nativeInput - The native color input
 * @param {HTMLElement} swatchesEl - The swatches container
 */
function setupSwatchClicks(container, hexInput, preview, nativeInput, swatchesEl) {
  swatchesEl.addEventListener('click', function onClick(e) {
    var swatch = e.target.closest('.voltz-color-picker__swatch');
    if (!swatch) { return; }
    var color = swatch.dataset.color;
    hexInput.value = color;
    nativeInput.value = color;
    applyColor(container, color, preview, nativeInput, swatchesEl);
  });

  swatchesEl.addEventListener('keydown', function onKey(e) {
    handleSwatchKeydown(e, swatchesEl);
  });
}

/**
 * Handles arrow key navigation between swatch buttons.
 * @param {KeyboardEvent} e - The keydown event
 * @param {HTMLElement} swatchesEl - The swatches container
 */
function handleSwatchKeydown(e, swatchesEl) {
  var swatches = Array.from(
    swatchesEl.querySelectorAll('.voltz-color-picker__swatch')
  );
  var idx = swatches.indexOf(e.target);
  if (idx === -1) { return; }

  var next = -1;
  if (e.key === 'ArrowRight') { next = idx + 1; }
  if (e.key === 'ArrowLeft') { next = idx - 1; }

  if (next >= 0 && next < swatches.length) {
    e.preventDefault();
    swatches[next].focus();
  }
}

/**
 * Applies a selected color to preview, swatches, and dispatches event.
 * @param {HTMLElement} container - The color picker container
 * @param {string} color - The hex color value
 * @param {HTMLElement} preview - The preview swatch
 * @param {HTMLInputElement} nativeInput - The native color input
 * @param {HTMLElement} swatchesEl - The swatches container
 */
function applyColor(container, color, preview, nativeInput, swatchesEl) {
  updatePreview(preview, color);
  updateSwatchSelection(swatchesEl, color);
  container.dataset.value = color;

  container.dispatchEvent(new CustomEvent('voltz-color-change', {
    bubbles: true,
    detail: { value: color }
  }));
}

/**
 * Updates the preview swatch background color.
 * @param {HTMLElement} preview - The preview element
 * @param {string} color - The hex color value
 */
function updatePreview(preview, color) {
  if (preview) {
    preview.style.backgroundColor = color;
  }
}

/**
 * Updates swatch selected states.
 * @param {HTMLElement} swatchesEl - The swatches container
 * @param {string} color - The selected hex color
 */
function updateSwatchSelection(swatchesEl, color) {
  var swatches = swatchesEl.querySelectorAll('.voltz-color-picker__swatch');
  swatches.forEach(function update(swatch) {
    var match = swatch.dataset.color.toLowerCase() === color.toLowerCase();
    swatch.classList.toggle('voltz-color-picker__swatch--selected', match);
    swatch.setAttribute('aria-selected', String(match));
  });
}

/**
 * Validates a hex color string.
 * @param {string} hex - The string to validate
 * @returns {boolean} Whether the string is a valid hex color
 */
function isValidHex(hex) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initColorPickers();
    });
  } else {
    initColorPickers();
  }
}
