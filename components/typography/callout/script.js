/*
 * Callout Component Script
 * Purpose: Handles collapsible callout toggle behavior with
 * keyboard accessibility (Enter/Space) and aria-expanded state.
 */

(function () {
  'use strict';

  /**
   * Initialize all collapsible callouts on the page.
   * Attaches click and keyboard event listeners.
   */
  function initCallouts() {
    var toggles = document.querySelectorAll('[data-voltz-callout-toggle]');
    toggles.forEach(function (toggle) {
      attachToggleListeners(toggle);
    });
  }

  /**
   * Attaches click and keydown listeners to a toggle element.
   * @param {Element} toggle - The callout header toggle element
   */
  function attachToggleListeners(toggle) {
    toggle.addEventListener('click', function () {
      handleToggle(toggle);
    });

    toggle.addEventListener('keydown', function (event) {
      handleKeydown(event, toggle);
    });
  }

  /**
   * Handles keydown events on the toggle.
   * @param {KeyboardEvent} event
   * @param {Element} toggle
   */
  function handleKeydown(event, toggle) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(toggle);
    }
  }

  /**
   * Toggles the collapsed state of a callout.
   * Updates aria-expanded and CSS classes.
   * @param {Element} toggle - The callout header toggle element
   */
  function handleToggle(toggle) {
    var callout = toggle.closest('[data-voltz-callout]');
    if (!callout) {
      return;
    }

    var isCollapsed = callout.classList.contains(
      'voltz-callout--collapsed'
    );

    callout.classList.toggle('voltz-callout--collapsed');
    toggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
  }

  /* Initialize on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCallouts);
  } else {
    initCallouts();
  }
})();
