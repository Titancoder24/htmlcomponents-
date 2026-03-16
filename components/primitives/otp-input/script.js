/**
 * OTPInput Component - script.js
 * Purpose: Generates individual digit input cells, manages auto-focus-next,
 * backspace navigation, paste support, and dispatches change/complete events.
 */

/**
 * Initializes all OTP input components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initOTPInputs(root = document) {
  var containers = root.querySelectorAll('[data-voltz-otp-input]');
  containers.forEach(function setup(container) {
    if (container.dataset.voltzOtpInit) {
      return;
    }
    container.dataset.voltzOtpInit = 'true';
    setupOTPInput(container);
  });
}

/**
 * Creates the digit input cells and attaches event listeners.
 * @param {HTMLElement} container - The OTP input container
 */
function setupOTPInput(container) {
  var length = parseInt(container.dataset.length, 10) || 6;
  var isDisabled = container.dataset.disabled === 'true';

  for (var i = 0; i < length; i++) {
    var cell = createOTPCell(i, length, isDisabled);
    container.appendChild(cell);
  }

  container.addEventListener('input', handleOTPInput);
  container.addEventListener('keydown', handleOTPKeydown);
  container.addEventListener('paste', handleOTPPaste);
}

/**
 * Creates a single OTP digit input cell element.
 * @param {number} index - The cell index (0-based)
 * @param {number} total - Total number of cells
 * @param {boolean} isDisabled - Whether the cell is disabled
 * @returns {HTMLInputElement} The created input element
 */
function createOTPCell(index, total, isDisabled) {
  var cell = document.createElement('input');
  cell.type = 'text';
  cell.inputMode = 'numeric';
  cell.maxLength = 1;
  cell.pattern = '[0-9]';
  cell.autocomplete = 'one-time-code';
  cell.className = 'voltz-otp-input__cell';
  cell.dataset.index = String(index);
  cell.setAttribute(
    'aria-label',
    'Digit ' + (index + 1) + ' of ' + total
  );
  if (isDisabled) {
    cell.disabled = true;
  }
  return cell;
}

/**
 * Handles input events on OTP cells for auto-focus-next behavior.
 * @param {InputEvent} e - The input event
 */
function handleOTPInput(e) {
  var cell = e.target;
  if (!cell.classList.contains('voltz-otp-input__cell')) {
    return;
  }

  var value = cell.value.replace(/[^0-9]/g, '');
  cell.value = value.slice(0, 1);

  cell.classList.toggle('voltz-otp-input__cell--filled', cell.value !== '');

  if (cell.value && cell.nextElementSibling) {
    cell.nextElementSibling.focus();
  }

  dispatchOTPEvents(cell.closest('[data-voltz-otp-input]'));
}

/**
 * Handles keydown events for backspace and arrow navigation.
 * @param {KeyboardEvent} e - The keydown event
 */
function handleOTPKeydown(e) {
  var cell = e.target;
  if (!cell.classList.contains('voltz-otp-input__cell')) {
    return;
  }

  if (e.key === 'Backspace' && !cell.value) {
    e.preventDefault();
    var prev = cell.previousElementSibling;
    if (prev && prev.classList.contains('voltz-otp-input__cell')) {
      prev.value = '';
      prev.classList.remove('voltz-otp-input__cell--filled');
      prev.focus();
      dispatchOTPEvents(cell.closest('[data-voltz-otp-input]'));
    }
  }

  if (e.key === 'ArrowRight' && cell.nextElementSibling) {
    e.preventDefault();
    cell.nextElementSibling.focus();
  }

  if (e.key === 'ArrowLeft' && cell.previousElementSibling) {
    e.preventDefault();
    cell.previousElementSibling.focus();
  }
}

/**
 * Handles paste events to distribute digits across cells.
 * @param {ClipboardEvent} e - The paste event
 */
function handleOTPPaste(e) {
  var container = e.currentTarget;
  var pastedData = (e.clipboardData || window.clipboardData)
    .getData('text')
    .replace(/[^0-9]/g, '');

  if (!pastedData) {
    return;
  }

  e.preventDefault();

  var cells = container.querySelectorAll('.voltz-otp-input__cell');
  var digits = pastedData.split('');

  cells.forEach(function fillCell(cell, idx) {
    var digit = digits[idx] || '';
    cell.value = digit;
    cell.classList.toggle('voltz-otp-input__cell--filled', digit !== '');
  });

  var focusIdx = Math.min(digits.length, cells.length - 1);
  cells[focusIdx].focus();

  dispatchOTPEvents(container);
}

/**
 * Collects all cell values and dispatches change/complete events.
 * @param {HTMLElement} container - The OTP input container
 */
function dispatchOTPEvents(container) {
  if (!container) {
    return;
  }
  var cells = container.querySelectorAll('.voltz-otp-input__cell');
  var value = '';
  cells.forEach(function collect(cell) {
    value += cell.value;
  });

  container.dispatchEvent(new CustomEvent('voltz-otp-change', {
    bubbles: true,
    detail: { value: value }
  }));

  var length = parseInt(container.dataset.length, 10) || 6;
  if (value.length === length) {
    container.dispatchEvent(new CustomEvent('voltz-otp-complete', {
      bubbles: true,
      detail: { value: value }
    }));
  }
}

/**
 * Programmatically gets the current OTP value.
 * @param {HTMLElement} container - The OTP input container
 * @returns {string} The current OTP value
 */
function getOTPValue(container) {
  var cells = container.querySelectorAll('.voltz-otp-input__cell');
  var value = '';
  cells.forEach(function collect(cell) {
    value += cell.value;
  });
  return value;
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initOTPInputs();
    });
  } else {
    initOTPInputs();
  }
}
