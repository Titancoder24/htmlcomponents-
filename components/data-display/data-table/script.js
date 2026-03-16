/**
 * Data Table Component Script
 * Purpose: Handles pagination, sort indicators, row selection,
 * column resizing, and select-all functionality for the data table.
 */

(function () {
  'use strict';

  /**
   * Initialize a data table component.
   * @param {HTMLElement} el - The .voltz-data-table element.
   */
  function initDataTable(el) {
    var state = {
      currentPage: 1,
      totalPages: 1,
      selectedRows: new Set()
    };

    initSortableHeaders(el);
    initRowSelection(el, state);
    initPagination(el, state);
    initColumnResize(el);
  }

  /**
   * Set up sortable column headers with click cycling.
   * @param {HTMLElement} el - The data table element.
   */
  function initSortableHeaders(el) {
    var headers = el.querySelectorAll(
      '.voltz-data-table__head th[data-sortable]'
    );
    headers.forEach(function (th) {
      th.setAttribute('aria-sort', 'none');
      th.addEventListener('click', function () {
        handleSort(el, th);
      });
    });
  }

  /**
   * Handle sort header click, cycling asc/desc/none.
   * @param {HTMLElement} el - The data table element.
   * @param {HTMLElement} th - The clicked header.
   */
  function handleSort(el, th) {
    var current = th.getAttribute('data-sort') || 'none';
    var headers = el.querySelectorAll(
      '.voltz-data-table__head th[data-sortable]'
    );
    headers.forEach(function (h) {
      h.removeAttribute('data-sort');
      h.setAttribute('aria-sort', 'none');
    });

    var next = current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none';
    if (next !== 'none') {
      th.setAttribute('data-sort', next);
      var ariaVal = next === 'asc' ? 'ascending' : 'descending';
      th.setAttribute('aria-sort', ariaVal);
    }
  }

  /**
   * Set up row selection and select-all checkbox.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   */
  function initRowSelection(el, state) {
    var selectAll = el.querySelector('.voltz-data-table__select-all');
    if (!selectAll) return;

    selectAll.addEventListener('change', function () {
      handleSelectAll(el, state, selectAll.checked);
    });

    var rowCheckboxes = el.querySelectorAll(
      '.voltz-data-table__body input[type="checkbox"]'
    );
    rowCheckboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        handleRowSelect(el, state, cb);
      });
    });
  }

  /**
   * Handle select-all checkbox toggle.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   * @param {boolean} checked - Whether select all is checked.
   */
  function handleSelectAll(el, state, checked) {
    var checkboxes = el.querySelectorAll(
      '.voltz-data-table__body input[type="checkbox"]'
    );
    checkboxes.forEach(function (cb) {
      cb.checked = checked;
      var row = cb.closest('tr');
      if (row) {
        row.setAttribute('aria-selected', String(checked));
      }
    });
    state.selectedRows = checked
      ? new Set(Array.from(checkboxes))
      : new Set();
    updateSelectionCount(el, state);
  }

  /**
   * Handle individual row selection.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   * @param {HTMLInputElement} cb - The row checkbox.
   */
  function handleRowSelect(el, state, cb) {
    var row = cb.closest('tr');
    if (row) {
      row.setAttribute('aria-selected', String(cb.checked));
    }
    if (cb.checked) {
      state.selectedRows.add(cb);
    } else {
      state.selectedRows.delete(cb);
    }
    updateSelectionCount(el, state);
  }

  /**
   * Update the selected count display.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   */
  function updateSelectionCount(el, state) {
    var countEl = el.querySelector('.voltz-data-table__selected-count');
    if (countEl) {
      countEl.textContent = String(state.selectedRows.size);
    }
  }

  /**
   * Initialize pagination button handlers.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   */
  function initPagination(el, state) {
    var prevBtn = el.querySelector('.voltz-data-table__page-btn--prev');
    var nextBtn = el.querySelector('.voltz-data-table__page-btn--next');
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', function () {
      if (state.currentPage > 1) {
        state.currentPage--;
        updatePagination(el, state);
      }
    });

    nextBtn.addEventListener('click', function () {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        updatePagination(el, state);
      }
    });

    calculateTotalPages(el, state);
    updatePagination(el, state);
  }

  /**
   * Calculate total pages from row count and page size.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   */
  function calculateTotalPages(el, state) {
    var rows = el.querySelectorAll(
      '.voltz-data-table__body tr:not(.voltz-data-table__empty-row)'
    );
    var pageSize = parseInt(el.getAttribute('data-page-size'), 10) || 10;
    state.totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  }

  /**
   * Update pagination UI state.
   * @param {HTMLElement} el - The data table element.
   * @param {Object} state - Component state.
   */
  function updatePagination(el, state) {
    var currentEl = el.querySelector('.voltz-data-table__current-page');
    var totalEl = el.querySelector('.voltz-data-table__total-pages');
    var prevBtn = el.querySelector('.voltz-data-table__page-btn--prev');
    var nextBtn = el.querySelector('.voltz-data-table__page-btn--next');

    if (currentEl) currentEl.textContent = String(state.currentPage);
    if (totalEl) totalEl.textContent = String(state.totalPages);
    if (prevBtn) prevBtn.disabled = state.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = state.currentPage >= state.totalPages;
  }

  /**
   * Initialize column resize handles.
   * @param {HTMLElement} el - The data table element.
   */
  function initColumnResize(el) {
    var handles = el.querySelectorAll('.voltz-data-table__resize-handle');
    handles.forEach(function (handle) {
      handle.addEventListener('mousedown', function (e) {
        startResize(e, handle);
      });
    });
  }

  /**
   * Start a column resize drag operation.
   * @param {MouseEvent} e - The mousedown event.
   * @param {HTMLElement} handle - The resize handle.
   */
  function startResize(e, handle) {
    var th = handle.closest('th');
    if (!th) return;
    var startX = e.pageX;
    var startWidth = th.offsetWidth;

    function onMouseMove(ev) {
      var newWidth = startWidth + (ev.pageX - startX);
      th.style.width = Math.max(50, newWidth) + 'px';
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  }

  /**
   * Initialize all data tables on the page.
   */
  function initAll() {
    var tables = document.querySelectorAll('.voltz-data-table');
    tables.forEach(initDataTable);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
