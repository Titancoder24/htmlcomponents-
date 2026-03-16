/**
 * File List Component Script
 * Handles view toggle (list/grid), select-all checkbox,
 * individual selection, and sort column clicks.
 */

function initFileList(root) {
  const lists = root.querySelectorAll('.voltz-file-list');
  lists.forEach(function setup(list) {
    setupViewToggle(list);
    setupSelectAll(list);
    setupSelection(list);
    setupSort(list);
  });
}

function setupViewToggle(list) {
  const buttons = list.querySelectorAll('.voltz-file-list__view-btn');

  buttons.forEach(function attachView(btn) {
    btn.addEventListener('click', function handleViewToggle() {
      buttons.forEach(function deactivate(b) {
        b.classList.remove('voltz-file-list__view-btn--active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('voltz-file-list__view-btn--active');
      btn.setAttribute('aria-checked', 'true');
      list.setAttribute('data-view', btn.getAttribute('data-view'));
    });
  });
}

function setupSelectAll(list) {
  const selectAll = list.querySelector('[data-action="select-all"]');
  if (!selectAll) return;

  selectAll.addEventListener('change', function handleSelectAll() {
    const checkboxes = list.querySelectorAll(
      '.voltz-file-list__item .voltz-file-list__checkbox'
    );
    checkboxes.forEach(function toggle(cb) {
      cb.checked = selectAll.checked;
      toggleItemSelected(cb);
    });
  });
}

function setupSelection(list) {
  const items = list.querySelector('.voltz-file-list__items');
  if (!items) return;

  items.addEventListener('change', function handleItemSelect(e) {
    if (!e.target.classList.contains('voltz-file-list__checkbox')) return;
    toggleItemSelected(e.target);
    updateSelectAll(list);
  });
}

function toggleItemSelected(checkbox) {
  const item = checkbox.closest('.voltz-file-list__item');
  if (!item) return;
  if (checkbox.checked) {
    item.classList.add('voltz-file-list__item--selected');
  } else {
    item.classList.remove('voltz-file-list__item--selected');
  }
}

function updateSelectAll(list) {
  const selectAll = list.querySelector('[data-action="select-all"]');
  if (!selectAll) return;
  const checkboxes = list.querySelectorAll(
    '.voltz-file-list__item .voltz-file-list__checkbox'
  );
  const checked = list.querySelectorAll(
    '.voltz-file-list__item .voltz-file-list__checkbox:checked'
  );
  selectAll.checked = checked.length === checkboxes.length;
  selectAll.indeterminate = checked.length > 0 && checked.length < checkboxes.length;
}

function setupSort(list) {
  const sortBtns = list.querySelectorAll('.voltz-file-list__sort');

  sortBtns.forEach(function attachSort(btn) {
    btn.addEventListener('click', function handleSort() {
      const field = btn.getAttribute('data-sort');
      list.dispatchEvent(new CustomEvent('voltz:file-sort', {
        bubbles: true,
        detail: { field: field }
      }));
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initFileList(document);
});
