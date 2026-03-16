/**
 * Dropdown Component - script.js
 * Purpose: Manages dropdown menu open/close, keyboard navigation
 * (arrow keys, Home, End, Enter, Escape), and outside click handling.
 */

'use strict';

/**
 * Initializes all dropdown components on the page.
 */
function initDropdowns() {
  var dropdowns = document.querySelectorAll('.voltz-dropdown');
  dropdowns.forEach(initSingleDropdown);
}

/**
 * Initializes a single dropdown component.
 * @param {HTMLElement} container - The dropdown container element.
 */
function initSingleDropdown(container) {
  var trigger = container.querySelector('.voltz-dropdown__trigger');
  var menu = container.querySelector('.voltz-dropdown__menu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', function () {
    toggleDropdownMenu(trigger, menu);
  });

  trigger.addEventListener('keydown', function (event) {
    handleTriggerKeydown(event, trigger, menu);
  });

  menu.addEventListener('keydown', function (event) {
    handleMenuKeydown(event, trigger, menu);
  });

  document.addEventListener('click', function (event) {
    if (!container.contains(event.target)) {
      closeDropdownMenu(trigger, menu);
    }
  });
}

/**
 * Toggles the dropdown menu visibility.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} menu - The menu element.
 */
function toggleDropdownMenu(trigger, menu) {
  var isOpen = menu.getAttribute('aria-hidden') === 'false';
  if (isOpen) {
    closeDropdownMenu(trigger, menu);
  } else {
    openDropdownMenu(trigger, menu);
  }
}

/**
 * Opens the dropdown menu and focuses the first item.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} menu - The menu element.
 */
function openDropdownMenu(trigger, menu) {
  menu.setAttribute('aria-hidden', 'false');
  trigger.setAttribute('aria-expanded', 'true');
  var items = getMenuItems(menu);
  if (items.length > 0) {
    items[0].focus();
  }
}

/**
 * Closes the dropdown menu and returns focus to trigger.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} menu - The menu element.
 */
function closeDropdownMenu(trigger, menu) {
  menu.setAttribute('aria-hidden', 'true');
  trigger.setAttribute('aria-expanded', 'false');
}

/**
 * Handles keydown events on the trigger element.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} menu - The menu element.
 */
function handleTriggerKeydown(event, trigger, menu) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleDropdownMenu(trigger, menu);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    openDropdownMenu(trigger, menu);
  }
}

/**
 * Handles keydown events within the menu.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} menu - The menu element.
 */
function handleMenuKeydown(event, trigger, menu) {
  var items = getMenuItems(menu);
  var currentIndex = items.indexOf(document.activeElement);

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusMenuItem(items, currentIndex + 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusMenuItem(items, currentIndex - 1);
      break;
    case 'Home':
      event.preventDefault();
      focusMenuItem(items, 0);
      break;
    case 'End':
      event.preventDefault();
      focusMenuItem(items, items.length - 1);
      break;
    case 'Escape':
      event.preventDefault();
      closeDropdownMenu(trigger, menu);
      trigger.focus();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      activateMenuItem(document.activeElement, trigger, menu);
      break;
  }
}

/**
 * Focuses a menu item by index with wrapping.
 * @param {HTMLElement[]} items - Array of menu items.
 * @param {number} index - Target index.
 */
function focusMenuItem(items, index) {
  if (items.length === 0) return;
  var wrapped = ((index % items.length) + items.length) % items.length;
  items[wrapped].focus();
}

/**
 * Activates a menu item if it is not disabled.
 * @param {HTMLElement} item - The menu item element.
 * @param {HTMLElement} trigger - The trigger element.
 * @param {HTMLElement} menu - The menu element.
 */
function activateMenuItem(item, trigger, menu) {
  if (!item || item.getAttribute('aria-disabled') === 'true') return;
  item.click();
  closeDropdownMenu(trigger, menu);
  trigger.focus();
}

/**
 * Gets all enabled menu items within the menu.
 * @param {HTMLElement} menu - The menu element.
 * @returns {HTMLElement[]} Array of menu item elements.
 */
function getMenuItems(menu) {
  return Array.from(
    menu.querySelectorAll(
      '[role="menuitem"]:not([aria-disabled="true"])'
    )
  );
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDropdowns);
} else {
  initDropdowns();
}
