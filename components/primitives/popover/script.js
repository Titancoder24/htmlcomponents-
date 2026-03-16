/**
 * Popover Component - script.js
 * Purpose: Manages popover open/close behavior on click, including
 * close on outside click, focus trapping, and Escape key handling.
 */

'use strict';

/**
 * Initializes all popover components on the page.
 */
function initPopovers() {
  const wrappers = document.querySelectorAll('.voltz-popover-wrapper');
  wrappers.forEach(initSinglePopover);
}

/**
 * Initializes a single popover wrapper element.
 * @param {HTMLElement} wrapper - The popover wrapper element.
 */
function initSinglePopover(wrapper) {
  const trigger = wrapper.querySelector('.voltz-popover-trigger');
  const popover = wrapper.querySelector('.voltz-popover');
  if (!trigger || !popover) return;

  const closeOnOutside = popover.dataset.closeOnOutside !== 'false';

  trigger.addEventListener('click', function () {
    togglePopover(trigger, popover);
  });

  trigger.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePopover(trigger, popover);
    }
  });

  if (closeOnOutside) {
    document.addEventListener('click', function (event) {
      handleOutsideClick(event, wrapper, trigger, popover);
    });
  }

  popover.addEventListener('keydown', function (event) {
    handlePopoverKeydown(event, trigger, popover);
  });
}

/**
 * Toggles the popover open/closed state.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} popover - The popover element.
 */
function togglePopover(trigger, popover) {
  const isOpen = popover.getAttribute('aria-hidden') === 'false';
  if (isOpen) {
    closePopover(trigger, popover);
  } else {
    openPopover(trigger, popover);
  }
}

/**
 * Opens the popover and moves focus inside.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} popover - The popover element.
 */
function openPopover(trigger, popover) {
  popover.setAttribute('aria-hidden', 'false');
  trigger.setAttribute('aria-expanded', 'true');
  var focusable = getFocusableElements(popover);
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

/**
 * Closes the popover and returns focus to trigger.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} popover - The popover element.
 */
function closePopover(trigger, popover) {
  popover.setAttribute('aria-hidden', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.focus();
}

/**
 * Handles clicks outside the popover to close it.
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} wrapper - The wrapper element.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} popover - The popover element.
 */
function handleOutsideClick(event, wrapper, trigger, popover) {
  if (!wrapper.contains(event.target)) {
    if (popover.getAttribute('aria-hidden') === 'false') {
      closePopover(trigger, popover);
    }
  }
}

/**
 * Handles keydown events within the popover.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} popover - The popover element.
 */
function handlePopoverKeydown(event, trigger, popover) {
  if (event.key === 'Escape') {
    closePopover(trigger, popover);
    return;
  }
  if (event.key === 'Tab') {
    trapFocus(event, popover);
  }
}

/**
 * Traps focus within the popover element.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} container - The container to trap focus within.
 */
function trapFocus(event, container) {
  var focusable = getFocusableElements(container);
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

/**
 * Returns all focusable elements within a container.
 * @param {HTMLElement} container - The container element.
 * @returns {HTMLElement[]} Array of focusable elements.
 */
function getFocusableElements(container) {
  var selector = 'a[href], button:not([disabled]), input:not([disabled]),'
    + ' textarea:not([disabled]), select:not([disabled]),'
    + ' [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll(selector));
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopovers);
} else {
  initPopovers();
}
