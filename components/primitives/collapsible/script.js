/**
 * Collapsible Component - script.js
 * Purpose: Manages the expand/collapse toggle behavior, ARIA state updates,
 * and dispatches custom toggle events.
 */

/**
 * Initializes all collapsible components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initCollapsibles(root = document) {
  const triggers = root.querySelectorAll(
    '[data-voltz-collapsible-trigger]'
  );

  triggers.forEach(function attachTrigger(trigger) {
    if (trigger.dataset.voltzCollapsibleInit) {
      return;
    }
    trigger.dataset.voltzCollapsibleInit = 'true';
    trigger.addEventListener('click', handleTriggerClick);
  });
}

/**
 * Handles click events on collapsible trigger buttons.
 * Toggles the open state and updates ARIA attributes.
 * @param {MouseEvent} event - The click event
 */
function handleTriggerClick(event) {
  const trigger = event.currentTarget;

  if (trigger.disabled) {
    return;
  }

  const collapsible = trigger.closest('.voltz-collapsible');
  if (!collapsible) {
    return;
  }

  const isOpen = collapsible.classList.contains(
    'voltz-collapsible--open'
  );
  toggleCollapsible(collapsible, trigger, !isOpen);
}

/**
 * Toggles a collapsible to the specified state.
 * @param {HTMLElement} collapsible - The collapsible container
 * @param {HTMLElement} trigger - The trigger button element
 * @param {boolean} open - Whether to open or close
 */
function toggleCollapsible(collapsible, trigger, open) {
  collapsible.classList.toggle('voltz-collapsible--open', open);
  trigger.setAttribute('aria-expanded', String(open));

  const toggleEvent = new CustomEvent('voltz-collapsible-toggle', {
    bubbles: true,
    detail: { open: open }
  });
  collapsible.dispatchEvent(toggleEvent);
}

/**
 * Programmatically sets a collapsible's open state by its id.
 * @param {string} id - The collapsible id suffix
 * @param {boolean} open - Whether to open or close
 */
function setCollapsibleState(id, open) {
  const trigger = document.getElementById(
    'voltz-collapsible-trigger-' + id
  );
  if (!trigger) {
    return;
  }

  const collapsible = trigger.closest('.voltz-collapsible');
  if (!collapsible) {
    return;
  }

  toggleCollapsible(collapsible, trigger, open);
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      function onReady() { initCollapsibles(); }
    );
  } else {
    initCollapsibles();
  }
}
