/**
 * Drawer Component - script.js
 * Purpose: Manages drawer open/close lifecycle including slide transitions,
 * focus trapping, scroll lock, backdrop click, and Escape key dismissal.
 */

'use strict';

var DRAWER_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]),' +
  ' textarea:not([disabled]), select:not([disabled]),' +
  ' [tabindex]:not([tabindex="-1"])';

/**
 * Initializes all drawer components on the page.
 */
function initDrawers() {
  var overlays = document.querySelectorAll('.voltz-drawer-overlay');
  overlays.forEach(initSingleDrawer);
}

/**
 * Initializes a single drawer overlay element.
 * @param {HTMLElement} overlay - The drawer overlay element.
 */
function initSingleDrawer(overlay) {
  var closeBtn = overlay.querySelector('.voltz-drawer__close');
  var backdrop = overlay.querySelector('.voltz-drawer-backdrop');
  var closeOnOverlay = overlay.dataset.closeOnOverlay !== 'false';
  var closeOnEscape = overlay.dataset.closeOnEscape !== 'false';

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      closeDrawer(overlay);
    });
  }

  if (backdrop && closeOnOverlay) {
    backdrop.addEventListener('click', function () {
      closeDrawer(overlay);
    });
  }

  if (closeOnEscape) {
    overlay.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeDrawer(overlay);
      }
    });
  }

  overlay.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      trapDrawerFocus(event, overlay);
    }
  });
}

/**
 * Opens a drawer by its overlay element.
 * @param {HTMLElement} overlay - The drawer overlay element.
 */
function openDrawer(overlay) {
  overlay._previousFocus = document.activeElement;
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  var focusable = overlay.querySelectorAll(DRAWER_FOCUSABLE);
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

/**
 * Closes a drawer and restores previous state.
 * @param {HTMLElement} overlay - The drawer overlay element.
 */
function closeDrawer(overlay) {
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (overlay._previousFocus) {
    overlay._previousFocus.focus();
    overlay._previousFocus = null;
  }
}

/**
 * Traps focus within the drawer panel.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} overlay - The drawer overlay element.
 */
function trapDrawerFocus(event, overlay) {
  var drawer = overlay.querySelector('.voltz-drawer');
  if (!drawer) return;

  var focusable = Array.from(
    drawer.querySelectorAll(DRAWER_FOCUSABLE)
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
window.voltzDrawer = {
  open: function (id) {
    var overlay = document.getElementById(id);
    if (overlay) openDrawer(overlay);
  },
  close: function (id) {
    var overlay = document.getElementById(id);
    if (overlay) closeDrawer(overlay);
  }
};

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDrawers);
} else {
  initDrawers();
}
