/**
 * Input Component - script.js
 * Purpose: Handles input interactivity including focus state management,
 * validation feedback, and addon interaction. Manages ARIA attributes
 * for dynamic error and disabled states.
 */

/**
 * Initializes all voltz-input elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initInputs(root = document) {
  const inputs = root.querySelectorAll('.voltz-input');
  inputs.forEach(setupInput);
}

/**
 * Sets up event listeners for a single input element.
 * @param {HTMLElement} input - The input element to initialize
 */
function setupInput(input) {
  if (input.dataset.voltzInit === 'true') return;
  input.dataset.voltzInit = 'true';

  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  input.addEventListener('input', handleInput);
}

/**
 * Handles focus event, adds focused class to wrapper.
 * @param {FocusEvent} event
 */
function handleFocus(event) {
  const wrapper = event.currentTarget.closest('.voltz-input-wrapper');
  if (wrapper) {
    wrapper.classList.add('voltz-input-wrapper--focused');
  }
}

/**
 * Handles blur event, removes focused class from wrapper.
 * @param {FocusEvent} event
 */
function handleBlur(event) {
  const wrapper = event.currentTarget.closest('.voltz-input-wrapper');
  if (wrapper) {
    wrapper.classList.remove('voltz-input-wrapper--focused');
  }
}

/**
 * Handles input event for live validation feedback.
 * @param {InputEvent} event
 */
function handleInput(event) {
  const input = event.currentTarget;
  const wrapper = input.closest('.voltz-input-wrapper');
  if (!wrapper) return;

  if (input.validity && !input.validity.valid) {
    wrapper.classList.add('voltz-input-wrapper--error');
    input.setAttribute('aria-invalid', 'true');
  }
}

/**
 * Sets the error state of an input programmatically.
 * @param {HTMLElement} input - The input element
 * @param {boolean} hasError - Whether to show error state
 * @param {string} [message] - Optional error message
 */
function setInputError(input, hasError, message) {
  const wrapper = input.closest('.voltz-input-wrapper');
  if (!wrapper) return;

  if (hasError) {
    wrapper.classList.add('voltz-input-wrapper--error');
    input.setAttribute('aria-invalid', 'true');
  } else {
    wrapper.classList.remove('voltz-input-wrapper--error');
    input.removeAttribute('aria-invalid');
  }

  if (message !== undefined) {
    const helper = wrapper.querySelector('.voltz-input__helper');
    if (helper) {
      helper.textContent = message;
    }
  }
}

/**
 * Observe DOM for dynamically added inputs.
 */
function observeInputs() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-input')) {
          setupInput(node);
        }
        const nested = node.querySelectorAll?.('.voltz-input');
        if (nested) nested.forEach(setupInput);
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
      initInputs();
      observeInputs();
    });
  } else {
    initInputs();
    observeInputs();
  }
}

export { initInputs, setupInput, setInputError, observeInputs };
