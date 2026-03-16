/**
 * Button Component - script.js
 * Purpose: Handles button interactivity including loading state management,
 * keyboard event handling, and ripple effect cleanup. Ensures proper ARIA
 * attribute updates for dynamic state changes.
 */

/**
 * Initializes all voltz-button elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initButtons(root = document) {
  const buttons = root.querySelectorAll('.voltz-button');
  buttons.forEach(setupButton);
}

/**
 * Sets up event listeners and ARIA attributes for a single button.
 * @param {HTMLElement} button - The button element to initialize
 */
function setupButton(button) {
  if (button.dataset.voltzInit === 'true') return;
  button.dataset.voltzInit = 'true';

  button.addEventListener('keydown', handleKeyDown);
  button.addEventListener('click', handleClick);

  syncAriaState(button);
}

/**
 * Handles keydown events on the button for accessibility.
 * Ensures Space key triggers the button (native behavior for Enter).
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

/**
 * Handles click events, preventing action when loading or disabled.
 * @param {MouseEvent} event
 */
function handleClick(event) {
  const button = event.currentTarget;
  const isDisabled = button.disabled ||
    button.getAttribute('aria-disabled') === 'true';
  const isLoading = button.classList.contains('voltz-button--loading');

  if (isDisabled || isLoading) {
    event.preventDefault();
    event.stopPropagation();
  }
}

/**
 * Synchronizes ARIA attributes with the current visual state.
 * @param {HTMLElement} button
 */
function syncAriaState(button) {
  const isLoading = button.classList.contains('voltz-button--loading');
  button.setAttribute('aria-busy', String(isLoading));

  if (isLoading) {
    button.setAttribute('aria-disabled', 'true');
  }
}

/**
 * Sets the loading state of a button programmatically.
 * @param {HTMLElement} button - The button element
 * @param {boolean} loading - Whether to enable loading state
 */
function setButtonLoading(button, loading) {
  if (loading) {
    button.classList.add('voltz-button--loading');
    button.setAttribute('aria-busy', 'true');
    button.setAttribute('aria-disabled', 'true');
  } else {
    button.classList.remove('voltz-button--loading');
    button.setAttribute('aria-busy', 'false');
    button.removeAttribute('aria-disabled');
  }
}

/**
 * Observe DOM for dynamically added buttons.
 */
function observeButtons() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-button')) {
          setupButton(node);
        }
        const nested = node.querySelectorAll?.('.voltz-button');
        if (nested) nested.forEach(setupButton);
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
      initButtons();
      observeButtons();
    });
  } else {
    initButtons();
    observeButtons();
  }
}

export { initButtons, setupButton, setButtonLoading, observeButtons };
