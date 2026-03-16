/**
 * SearchInput Component - script.js
 * Purpose: Manages clear button visibility, Escape-to-clear keyboard support,
 * and dispatches custom input/clear events for the search input.
 */

/**
 * Initializes all search input components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initSearchInputs(root = document) {
  var containers = root.querySelectorAll('[data-voltz-search-input]');
  containers.forEach(function setup(container) {
    if (container.dataset.voltzSearchInputInit) {
      return;
    }
    container.dataset.voltzSearchInputInit = 'true';
    setupSearchInput(container);
  });
}

/**
 * Sets up event listeners for a single search input component.
 * @param {HTMLElement} container - The search input container
 */
function setupSearchInput(container) {
  var input = container.querySelector('[data-voltz-search-input-field]');
  var clearBtn = container.querySelector('[data-voltz-search-input-clear]');

  if (!input) {
    return;
  }

  updateClearVisibility(input, clearBtn);

  input.addEventListener('input', function onInput() {
    updateClearVisibility(input, clearBtn);
    dispatchSearchEvent(container, 'voltz-search-input', input.value);
  });

  input.addEventListener('keydown', function onKeydown(e) {
    if (e.key === 'Escape' && input.value) {
      e.preventDefault();
      clearSearch(container, input, clearBtn);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function onClear() {
      clearSearch(container, input, clearBtn);
      input.focus();
    });
  }
}

/**
 * Shows or hides the clear button based on input value.
 * @param {HTMLInputElement} input - The search input element
 * @param {HTMLButtonElement|null} clearBtn - The clear button element
 */
function updateClearVisibility(input, clearBtn) {
  if (!clearBtn) {
    return;
  }
  if (input.value.length > 0) {
    clearBtn.removeAttribute('hidden');
  } else {
    clearBtn.setAttribute('hidden', '');
  }
}

/**
 * Clears the search input and dispatches the clear event.
 * @param {HTMLElement} container - The search input container
 * @param {HTMLInputElement} input - The search input element
 * @param {HTMLButtonElement|null} clearBtn - The clear button element
 */
function clearSearch(container, input, clearBtn) {
  input.value = '';
  updateClearVisibility(input, clearBtn);
  dispatchSearchEvent(container, 'voltz-search-clear', '');
  dispatchSearchEvent(container, 'voltz-search-input', '');
}

/**
 * Dispatches a custom event from the search input container.
 * @param {HTMLElement} container - The container element
 * @param {string} eventName - The event name to dispatch
 * @param {string} value - The current input value
 */
function dispatchSearchEvent(container, eventName, value) {
  container.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    detail: { value: value }
  }));
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initSearchInputs();
    });
  } else {
    initSearchInputs();
  }
}
