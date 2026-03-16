/**
 * Changelog Component Script
 * Purpose: Handles collapsible version sections with expand/collapse
 * toggle, keyboard support, and aria-expanded state management.
 */

(function () {
  'use strict';

  /**
   * Initialize a single changelog component.
   * @param {HTMLElement} changelog - The .voltz-changelog element.
   */
  function initChangelog(changelog) {
    var headers = changelog.querySelectorAll(
      '.voltz-changelog__version-header[role="button"]'
    );
    headers.forEach(function (header) {
      header.addEventListener('click', function () {
        toggleVersion(header);
      });
      header.addEventListener('keydown', function (e) {
        handleKeydown(e, header);
      });
    });
  }

  /**
   * Toggle expand/collapse state of a version section.
   * @param {HTMLElement} header - The version header element.
   */
  function toggleVersion(header) {
    var expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
  }

  /**
   * Handle keyboard events on version headers.
   * @param {KeyboardEvent} e - The keydown event.
   * @param {HTMLElement} header - The version header.
   */
  function handleKeydown(e, header) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleVersion(header);
    }
  }

  /** Initialize all changelog components. */
  function initAll() {
    var changelogs = document.querySelectorAll('.voltz-changelog');
    changelogs.forEach(initChangelog);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
