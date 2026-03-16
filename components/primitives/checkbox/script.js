/**
 * Checkbox Component - script.js
 * Purpose: Handles checkbox interactivity including indeterminate state
 * management (which cannot be set via HTML attribute alone) and ARIA
 * attribute synchronization.
 */

/**
 * Initializes all voltz-checkbox elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initCheckboxes(root = document) {
  const checkboxes = root.querySelectorAll('.voltz-checkbox__input');
  checkboxes.forEach(setupCheckbox);
}

/**
 * Sets up event listeners and state for a single checkbox.
 * @param {HTMLInputElement} checkbox - The checkbox input to initialize
 */
function setupCheckbox(checkbox) {
  if (checkbox.dataset.voltzInit === 'true') return;
  checkbox.dataset.voltzInit = 'true';

  syncIndeterminate(checkbox);
  checkbox.addEventListener('change', handleChange);
}

/**
 * Syncs the indeterminate property from a data attribute.
 * The indeterminate state can only be set via JavaScript.
 * @param {HTMLInputElement} checkbox
 */
function syncIndeterminate(checkbox) {
  const wrapper = checkbox.closest('.voltz-checkbox');
  if (!wrapper) return;

  const isIndeterminate = wrapper.hasAttribute('data-indeterminate') ||
    wrapper.dataset.indeterminate === 'true';

  checkbox.indeterminate = isIndeterminate;
}

/**
 * Handles change events on the checkbox.
 * Clears indeterminate state when user interacts.
 * @param {Event} event
 */
function handleChange(event) {
  const checkbox = event.currentTarget;
  checkbox.indeterminate = false;

  const wrapper = checkbox.closest('.voltz-checkbox');
  if (wrapper) {
    wrapper.removeAttribute('data-indeterminate');
  }
}

/**
 * Sets the indeterminate state programmatically.
 * @param {HTMLInputElement} checkbox - The checkbox input
 * @param {boolean} indeterminate - Whether to set indeterminate
 */
function setIndeterminate(checkbox, indeterminate) {
  checkbox.indeterminate = indeterminate;
  const wrapper = checkbox.closest('.voltz-checkbox');
  if (wrapper) {
    if (indeterminate) {
      wrapper.setAttribute('data-indeterminate', 'true');
    } else {
      wrapper.removeAttribute('data-indeterminate');
    }
  }
}

/**
 * Observe DOM for dynamically added checkboxes.
 */
function observeCheckboxes() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-checkbox__input')) {
          setupCheckbox(node);
        }
        const nested = node.querySelectorAll?.('.voltz-checkbox__input');
        if (nested) nested.forEach(setupCheckbox);
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
      initCheckboxes();
      observeCheckboxes();
    });
  } else {
    initCheckboxes();
    observeCheckboxes();
  }
}

export { initCheckboxes, setupCheckbox, setIndeterminate, observeCheckboxes };
