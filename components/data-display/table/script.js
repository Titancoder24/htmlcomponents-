/**
 * Table Component Script
 * Purpose: Handles visual-only sort indicator toggling on sortable
 * table headers. No data manipulation — presentation only.
 */

(function () {
  'use strict';

  /**
   * Initialize a single table wrapper element.
   * Attaches click listeners to sortable headers.
   * @param {HTMLElement} wrapper - The .voltz-table-wrapper element.
   */
  function initTable(wrapper) {
    const headers = wrapper.querySelectorAll(
      '.voltz-table__head th[data-sortable]'
    );

    if (headers.length === 0) return;

    headers.forEach(function (th) {
      th.setAttribute('aria-sort', 'none');
      th.setAttribute('role', 'columnheader');
      th.addEventListener('click', function () {
        handleSortClick(wrapper, th);
      });
    });
  }

  /**
   * Handle a click on a sortable header.
   * Cycles sort state: none -> asc -> desc -> none.
   * @param {HTMLElement} wrapper - The table wrapper.
   * @param {HTMLElement} clickedTh - The clicked th element.
   */
  function handleSortClick(wrapper, clickedTh) {
    var currentSort = clickedTh.getAttribute('data-sort') || 'none';
    var nextSort = getNextSortState(currentSort);

    resetAllHeaders(wrapper);

    if (nextSort !== 'none') {
      clickedTh.setAttribute('data-sort', nextSort);
      clickedTh.setAttribute('aria-sort', nextSort === 'asc' ? 'ascending' : 'descending');
    }
  }

  /**
   * Get the next sort state in the cycle.
   * @param {string} current - Current sort state.
   * @returns {string} Next sort state.
   */
  function getNextSortState(current) {
    if (current === 'none') return 'asc';
    if (current === 'asc') return 'desc';
    return 'none';
  }

  /**
   * Reset all sortable headers to unsorted state.
   * @param {HTMLElement} wrapper - The table wrapper.
   */
  function resetAllHeaders(wrapper) {
    var headers = wrapper.querySelectorAll(
      '.voltz-table__head th[data-sortable]'
    );
    headers.forEach(function (th) {
      th.removeAttribute('data-sort');
      th.setAttribute('aria-sort', 'none');
    });
  }

  /**
   * Initialize all table components on the page.
   */
  function initAllTables() {
    var wrappers = document.querySelectorAll('.voltz-table-wrapper');
    wrappers.forEach(initTable);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllTables);
  } else {
    initAllTables();
  }
})();
