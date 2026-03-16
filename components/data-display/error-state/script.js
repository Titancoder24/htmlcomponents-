/**
 * Error State Component Script
 * Purpose: Handles the retry button click, dispatching a custom
 * event for parent components to handle retry logic.
 */

(function () {
  'use strict';

  /**
   * Initialize a single error state component.
   * @param {HTMLElement} el - The .voltz-error-state element.
   */
  function initErrorState(el) {
    var retryBtn = el.querySelector('.voltz-error-state__retry-btn');
    if (!retryBtn) return;

    retryBtn.addEventListener('click', function () {
      handleRetry(el, retryBtn);
    });
  }

  /**
   * Handle retry button click.
   * @param {HTMLElement} el - The error state element.
   * @param {HTMLButtonElement} btn - The retry button.
   */
  function handleRetry(el, btn) {
    btn.disabled = true;
    btn.textContent = 'Retrying...';

    var event = new CustomEvent('voltz-error-retry', {
      bubbles: true,
      detail: { element: el }
    });
    el.dispatchEvent(event);

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = 'Try again';
    }, 3000);
  }

  /** Initialize all error state components. */
  function initAll() {
    var elements = document.querySelectorAll('.voltz-error-state');
    elements.forEach(initErrorState);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
