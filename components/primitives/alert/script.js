/**
 * Alert Component - script.js
 * Purpose: Manages dismissible alert behavior including the dismiss
 * button click handler and Escape key support for dismissal.
 */

'use strict';

/**
 * Initializes all alert components on the page.
 */
function initAlerts() {
  var alerts = document.querySelectorAll('.voltz-alert');
  alerts.forEach(initSingleAlert);
}

/**
 * Initializes a single alert element.
 * @param {HTMLElement} alertEl - The alert element.
 */
function initSingleAlert(alertEl) {
  var dismissBtn = alertEl.querySelector('.voltz-alert__dismiss');
  if (!dismissBtn) return;

  dismissBtn.addEventListener('click', function () {
    dismissAlert(alertEl);
  });

  alertEl.addEventListener('keydown', function (event) {
    handleAlertKeydown(event, alertEl);
  });
}

/**
 * Dismisses an alert element with a fade-out effect.
 * @param {HTMLElement} alertEl - The alert element to dismiss.
 */
function dismissAlert(alertEl) {
  alertEl.style.opacity = '0';

  var handleTransitionEnd = function () {
    alertEl.setAttribute('hidden', '');
    alertEl.removeEventListener('transitionend', handleTransitionEnd);
    dispatchDismissEvent(alertEl);
  };

  alertEl.addEventListener('transitionend', handleTransitionEnd);

  /* Fallback if transition is disabled */
  setTimeout(function () {
    if (!alertEl.hasAttribute('hidden')) {
      alertEl.setAttribute('hidden', '');
      dispatchDismissEvent(alertEl);
    }
  }, 300);
}

/**
 * Dispatches a custom dismiss event on the alert element.
 * @param {HTMLElement} alertEl - The alert element.
 */
function dispatchDismissEvent(alertEl) {
  var event = new CustomEvent('voltz-alert:dismiss', {
    bubbles: true,
    detail: { alertId: alertEl.id }
  });
  alertEl.dispatchEvent(event);
}

/**
 * Handles keydown events on the alert element.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} alertEl - The alert element.
 */
function handleAlertKeydown(event, alertEl) {
  if (event.key === 'Escape') {
    var dismissBtn = alertEl.querySelector('.voltz-alert__dismiss');
    if (dismissBtn) {
      dismissAlert(alertEl);
    }
  }
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAlerts);
} else {
  initAlerts();
}
