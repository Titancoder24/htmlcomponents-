/**
 * Textarea Component - script.js
 * Purpose: Handles textarea interactivity including auto-resize behavior,
 * character counter updates, and focus state management. Manages ARIA
 * attributes for dynamic state changes.
 */

/**
 * Initializes all voltz-textarea elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initTextareas(root = document) {
  const textareas = root.querySelectorAll('.voltz-textarea');
  textareas.forEach(setupTextarea);
}

/**
 * Sets up event listeners for a single textarea element.
 * @param {HTMLElement} textarea - The textarea element to initialize
 */
function setupTextarea(textarea) {
  if (textarea.dataset.voltzInit === 'true') return;
  textarea.dataset.voltzInit = 'true';

  textarea.addEventListener('input', handleTextareaInput);
  textarea.addEventListener('focus', handleFocus);
  textarea.addEventListener('blur', handleBlur);

  updateCounter(textarea);

  if (isAutoResize(textarea)) {
    adjustHeight(textarea);
  }
}

/**
 * Checks if the textarea has auto-resize enabled.
 * @param {HTMLElement} textarea
 * @returns {boolean}
 */
function isAutoResize(textarea) {
  const wrapper = textarea.closest('.voltz-textarea-wrapper');
  return wrapper?.classList.contains(
    'voltz-textarea-wrapper--auto-resize'
  ) ?? false;
}

/**
 * Handles input event for counter and auto-resize.
 * @param {InputEvent} event
 */
function handleTextareaInput(event) {
  const textarea = event.currentTarget;
  updateCounter(textarea);

  if (isAutoResize(textarea)) {
    adjustHeight(textarea);
  }
}

/**
 * Updates the character counter display.
 * @param {HTMLElement} textarea
 */
function updateCounter(textarea) {
  const wrapper = textarea.closest('.voltz-textarea-wrapper');
  if (!wrapper) return;

  const currentEl = wrapper.querySelector(
    '.voltz-textarea__counter-current'
  );
  if (currentEl) {
    currentEl.textContent = String(textarea.value.length);
  }
}

/**
 * Adjusts the height of an auto-resize textarea.
 * @param {HTMLElement} textarea
 */
function adjustHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Handles focus event, adds focused class to wrapper.
 * @param {FocusEvent} event
 */
function handleFocus(event) {
  const wrapper = event.currentTarget.closest('.voltz-textarea-wrapper');
  if (wrapper) {
    wrapper.classList.add('voltz-textarea-wrapper--focused');
  }
}

/**
 * Handles blur event, removes focused class from wrapper.
 * @param {FocusEvent} event
 */
function handleBlur(event) {
  const wrapper = event.currentTarget.closest('.voltz-textarea-wrapper');
  if (wrapper) {
    wrapper.classList.remove('voltz-textarea-wrapper--focused');
  }
}

/**
 * Observe DOM for dynamically added textareas.
 */
function observeTextareas() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-textarea')) {
          setupTextarea(node);
        }
        const nested = node.querySelectorAll?.('.voltz-textarea');
        if (nested) nested.forEach(setupTextarea);
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
      initTextareas();
      observeTextareas();
    });
  } else {
    initTextareas();
    observeTextareas();
  }
}

export { initTextareas, setupTextarea, adjustHeight, observeTextareas };
