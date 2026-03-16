/**
 * Dialog Component - script.js
 * Purpose: Manages dialog open/close lifecycle including focus trapping,
 * scroll lock on the body, backdrop click, and Escape key dismissal.
 */

'use strict';

var FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]),' +
  ' textarea:not([disabled]), select:not([disabled]),' +
  ' [tabindex]:not([tabindex="-1"])';

/**
 * Initializes all dialog components on the page.
 */
function initDialogs() {
  var overlays = document.querySelectorAll('.voltz-dialog-overlay');
  overlays.forEach(initSingleDialog);
}

/**
 * Initializes a single dialog overlay element.
 * @param {HTMLElement} overlay - The dialog overlay element.
 */
function initSingleDialog(overlay) {
  var closeBtn = overlay.querySelector('.voltz-dialog__close');
  var backdrop = overlay.querySelector('.voltz-dialog-backdrop');
  var closeOnOverlay = overlay.dataset.closeOnOverlay !== 'false';
  var closeOnEscape = overlay.dataset.closeOnEscape !== 'false';

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      closeDialog(overlay);
    });
  }

  if (backdrop && closeOnOverlay) {
    backdrop.addEventListener('click', function () {
      closeDialog(overlay);
    });
  }

  if (closeOnEscape) {
    overlay.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeDialog(overlay);
      }
    });
  }

  overlay.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      trapDialogFocus(event, overlay);
    }
  });
}

/**
 * Opens a dialog by its overlay element.
 * @param {HTMLElement} overlay - The dialog overlay element.
 */
function openDialog(overlay) {
  overlay._previousFocus = document.activeElement;
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  var focusable = overlay.querySelectorAll(FOCUSABLE_SELECTOR);
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

/**
 * Closes a dialog and restores previous state.
 * @param {HTMLElement} overlay - The dialog overlay element.
 */
function closeDialog(overlay) {
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (overlay._previousFocus) {
    overlay._previousFocus.focus();
    overlay._previousFocus = null;
  }
}

/**
 * Traps focus within the dialog panel.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} overlay - The dialog overlay element.
 */
function trapDialogFocus(event, overlay) {
  var dialog = overlay.querySelector('.voltz-dialog');
  if (!dialog) return;

  var focusable = Array.from(
    dialog.querySelectorAll(FOCUSABLE_SELECTOR)
  );
  if (focusable.length === 0) return;

  var first = focusable[0];
  var last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* Expose open/close functions globally */
window.voltzDialog = {
  open: function (id) {
    var overlay = document.getElementById(id);
    if (overlay) openDialog(overlay);
  },
  close: function (id) {
    var overlay = document.getElementById(id);
    if (overlay) closeDialog(overlay);
  }
};

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDialogs);
} else {
  initDialogs();
}
