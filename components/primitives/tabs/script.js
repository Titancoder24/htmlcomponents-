/**
 * Tabs Component - script.js
 * Purpose: Manages tab selection, panel visibility, and keyboard
 * navigation (arrow keys, Home, End) with proper ARIA state updates.
 */

'use strict';

/**
 * Initializes all tabs components on the page.
 */
function initTabs() {
  var tabContainers = document.querySelectorAll('.voltz-tabs');
  tabContainers.forEach(initSingleTabs);
}

/**
 * Initializes a single tabs container element.
 * @param {HTMLElement} container - The tabs container element.
 */
function initSingleTabs(container) {
  var tabs = getTabButtons(container);
  var defaultTab = parseInt(container.dataset.defaultTab, 10) || 0;

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activateTab(container, tabs, index);
    });

    tab.addEventListener('keydown', function (event) {
      handleTabKeydown(event, container, tabs, index);
    });
  });

  if (tabs.length > 0) {
    activateTab(container, tabs, defaultTab);
  }
}

/**
 * Activates a tab and shows its associated panel.
 * @param {HTMLElement} container - The tabs container.
 * @param {HTMLElement[]} tabs - All tab button elements.
 * @param {number} index - Index of the tab to activate.
 */
function activateTab(container, tabs, index) {
  deactivateAllTabs(container, tabs);

  var tab = tabs[index];
  if (!tab) return;

  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');

  var panelId = tab.getAttribute('aria-controls');
  var panel = document.getElementById(panelId);
  if (panel) {
    panel.removeAttribute('hidden');
  }
}

/**
 * Deactivates all tabs and hides all panels.
 * @param {HTMLElement} container - The tabs container.
 * @param {HTMLElement[]} tabs - All tab button elements.
 */
function deactivateAllTabs(container, tabs) {
  tabs.forEach(function (tab) {
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
  });

  var panels = container.querySelectorAll('.voltz-tabs__panel');
  panels.forEach(function (panel) {
    panel.setAttribute('hidden', '');
  });
}

/**
 * Handles keyboard navigation within the tab list.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} container - The tabs container.
 * @param {HTMLElement[]} tabs - All tab button elements.
 * @param {number} currentIndex - Index of the focused tab.
 */
function handleTabKeydown(event, container, tabs, currentIndex) {
  var newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
      break;
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = tabs.length - 1;
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      activateTab(container, tabs, currentIndex);
      return;
    default:
      return;
  }

  activateTab(container, tabs, newIndex);
  tabs[newIndex].focus();
}

/**
 * Gets all tab buttons within a tabs container.
 * @param {HTMLElement} container - The tabs container.
 * @returns {HTMLElement[]} Array of tab button elements.
 */
function getTabButtons(container) {
  return Array.from(
    container.querySelectorAll('[role="tab"]')
  );
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabs);
} else {
  initTabs();
}
