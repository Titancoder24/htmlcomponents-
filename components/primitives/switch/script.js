/**
 * Switch Component - script.js
 * Purpose: Handles switch interactivity including aria-checked synchronization,
 * keyboard support (Enter key), and dynamic state management.
 */

/**
 * Initializes all voltz-switch elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initSwitches(root = document) {
  const switches = root.querySelectorAll('.voltz-switch__input');
  switches.forEach(setupSwitch);
}

/**
 * Sets up event listeners for a single switch input.
 * @param {HTMLInputElement} switchInput - The switch input to initialize
 */
function setupSwitch(switchInput) {
  if (switchInput.dataset.voltzInit === 'true') return;
  switchInput.dataset.voltzInit = 'true';

  syncAriaChecked(switchInput);
  switchInput.addEventListener('change', handleChange);
  switchInput.addEventListener('keydown', handleKeyDown);
}

/**
 * Syncs aria-checked attribute with the checked property.
 * @param {HTMLInputElement} switchInput
 */
function syncAriaChecked(switchInput) {
  switchInput.setAttribute(
    'aria-checked',
    String(switchInput.checked)
  );
}

/**
 * Handles change events on the switch.
 * @param {Event} event
 */
function handleChange(event) {
  syncAriaChecked(event.currentTarget);
}

/**
 * Handles keydown for Enter key (not native for checkboxes).
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const switchInput = event.currentTarget;
    switchInput.checked = !switchInput.checked;
    switchInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Sets the switch state programmatically.
 * @param {HTMLInputElement} switchInput - The switch input
 * @param {boolean} checked - Whether the switch should be on
 */
function setSwitchState(switchInput, checked) {
  switchInput.checked = checked;
  syncAriaChecked(switchInput);
}

/**
 * Observe DOM for dynamically added switches.
 */
function observeSwitches() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-switch__input')) {
          setupSwitch(node);
        }
        const nested = node.querySelectorAll?.('.voltz-switch__input');
        if (nested) nested.forEach(setupSwitch);
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
      initSwitches();
      observeSwitches();
    });
  } else {
    initSwitches();
    observeSwitches();
  }
}

export { initSwitches, setupSwitch, setSwitchState, observeSwitches };
