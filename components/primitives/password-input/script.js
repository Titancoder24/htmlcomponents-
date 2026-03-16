/**
 * PasswordInput Component - script.js
 * Purpose: Manages password visibility toggle, strength calculation,
 * requirements checklist validation, and ARIA state updates.
 */

/**
 * Initializes all password input components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initPasswordInputs(root = document) {
  var containers = root.querySelectorAll('[data-voltz-password-input]');
  containers.forEach(function setup(container) {
    if (container.dataset.voltzPasswordInit) {
      return;
    }
    container.dataset.voltzPasswordInit = 'true';
    setupPasswordInput(container);
  });
}

/**
 * Sets up event listeners for a single password input component.
 * @param {HTMLElement} container - The password input container
 */
function setupPasswordInput(container) {
  var input = container.querySelector('[data-voltz-password-input-field]');
  var toggle = container.querySelector('[data-voltz-password-toggle]');
  var strengthEl = container.querySelector('[data-voltz-password-strength]');
  var reqsEl = container.querySelector('[data-voltz-password-requirements]');
  var minLen = parseInt(container.dataset.minLength, 10) || 8;

  if (!input) {
    return;
  }

  if (toggle) {
    toggle.addEventListener('click', function onToggle() {
      toggleVisibility(input, toggle);
    });
  }

  input.addEventListener('input', function onInput() {
    var val = input.value;
    if (strengthEl) {
      updateStrength(container, strengthEl, val);
    }
    if (reqsEl) {
      updateRequirements(reqsEl, val, minLen);
    }
    dispatchPasswordEvent(container, val);
  });
}

/**
 * Toggles password visibility between text and password types.
 * @param {HTMLInputElement} input - The password input element
 * @param {HTMLButtonElement} toggle - The toggle button element
 */
function toggleVisibility(input, toggle) {
  var isVisible = input.type === 'text';
  input.type = isVisible ? 'password' : 'text';
  toggle.setAttribute('aria-pressed', String(!isVisible));
  toggle.setAttribute(
    'aria-label',
    isVisible ? 'Show password' : 'Hide password'
  );

  var showIcon = toggle.querySelector('.voltz-password-input__icon-show');
  var hideIcon = toggle.querySelector('.voltz-password-input__icon-hide');
  if (showIcon && hideIcon) {
    showIcon.hidden = !isVisible;
    hideIcon.hidden = isVisible;
  }
}

/**
 * Calculates password strength score (0-4).
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score from 0 to 4
 */
function calcStrengthScore(password) {
  var score = 0;
  if (password.length >= 8) { score++; }
  if (/[A-Z]/.test(password)) { score++; }
  if (/[a-z]/.test(password)) { score++; }
  if (/[0-9]/.test(password)) { score++; }
  if (/[^A-Za-z0-9]/.test(password)) { score++; }
  return Math.min(score, 4);
}

/**
 * Updates the strength indicator bar and label.
 * @param {HTMLElement} container - The password input container
 * @param {HTMLElement} strengthEl - The strength container element
 * @param {string} password - The current password value
 */
function updateStrength(container, strengthEl, password) {
  var fill = strengthEl.querySelector('[data-voltz-password-strength-fill]');
  var label = strengthEl.querySelector('[data-voltz-password-strength-label]');
  if (!fill) { return; }

  var levels = ['', 'weak', 'fair', 'good', 'strong'];
  var labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  var score = password.length === 0 ? 0 : calcStrengthScore(password);

  fill.className = 'voltz-password-input__strength-fill';
  if (score > 0) {
    fill.classList.add('voltz-password-input__strength-fill--' + levels[score]);
  }
  if (label) {
    label.textContent = labels[score];
  }

  container.dispatchEvent(new CustomEvent('voltz-password-strength', {
    bubbles: true,
    detail: { strength: levels[score], score: score }
  }));
}

/**
 * Updates the requirements checklist met/unmet states.
 * @param {HTMLElement} reqsEl - The requirements list element
 * @param {string} password - The current password value
 * @param {number} minLen - Minimum required length
 */
function updateRequirements(reqsEl, password, minLen) {
  var checks = {
    length: password.length >= minLen,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  var items = reqsEl.querySelectorAll('[data-req]');
  items.forEach(function updateItem(item) {
    var req = item.dataset.req;
    var met = checks[req] || false;
    item.classList.toggle('voltz-password-input__req--met', met);
  });
}

/**
 * Dispatches the password input custom event.
 * @param {HTMLElement} container - The container element
 * @param {string} value - The current password value
 */
function dispatchPasswordEvent(container, value) {
  container.dispatchEvent(new CustomEvent('voltz-password-input', {
    bubbles: true,
    detail: { value: value }
  }));
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initPasswordInputs();
    });
  } else {
    initPasswordInputs();
  }
}
