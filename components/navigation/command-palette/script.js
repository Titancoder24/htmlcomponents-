/* Command Palette Component Script */
/* Handles Cmd+K shortcut, search filtering, keyboard nav, focus trap */

function initCommandPalette(root) {
  var input = root.querySelector('.voltz-command-palette__input');
  var listEl = root.querySelector('.voltz-command-palette__list');
  var emptyEl = root.querySelector('.voltz-command-palette__empty');
  var backdrop = root.querySelector('.voltz-command-palette__backdrop');
  if (!input || !listEl) return;

  function getItems() {
    return Array.from(
      listEl.querySelectorAll('.voltz-command-palette__item')
    );
  }

  function getVisibleItems() {
    return getItems().filter(function (item) {
      return item.getAttribute('data-hidden') !== 'true';
    });
  }

  function open() {
    root.setAttribute('data-open', 'true');
    input.value = '';
    filterItems('');
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    root.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    clearSelection();
  }

  function isOpen() {
    return root.getAttribute('data-open') === 'true';
  }

  function clearSelection() {
    getItems().forEach(function (item) {
      item.setAttribute('aria-selected', 'false');
    });
    input.setAttribute('aria-activedescendant', '');
  }

  function selectItem(item) {
    clearSelection();
    if (item) {
      item.setAttribute('aria-selected', 'true');
      item.scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', item.id || '');
    }
  }

  function getSelectedIndex() {
    var visible = getVisibleItems();
    for (var i = 0; i < visible.length; i++) {
      if (visible[i].getAttribute('aria-selected') === 'true') return i;
    }
    return -1;
  }

  function filterItems(query) {
    var lowerQuery = query.toLowerCase().trim();
    var visibleCount = 0;

    getItems().forEach(function (item) {
      var label = item.querySelector('.voltz-command-palette__item-label');
      var keywords = item.getAttribute('data-keywords') || '';
      var text = (label ? label.textContent : '') + ' ' + keywords;
      var match = !lowerQuery || text.toLowerCase().indexOf(lowerQuery) !== -1;
      item.setAttribute('data-hidden', String(!match));
      if (match) visibleCount++;
    });

    emptyEl.setAttribute('data-visible', String(visibleCount === 0));
    clearSelection();
    var visible = getVisibleItems();
    if (visible.length > 0) {
      selectItem(visible[0]);
    }
  }

  function activateSelected() {
    var visible = getVisibleItems();
    var idx = getSelectedIndex();
    if (idx >= 0 && visible[idx]) {
      visible[idx].click();
      close();
    }
  }

  function handleGlobalKeydown(event) {
    var isMac = navigator.platform.indexOf('Mac') !== -1;
    var modKey = isMac ? event.metaKey : event.ctrlKey;
    if (modKey && event.key === 'k') {
      event.preventDefault();
      if (isOpen()) { close(); } else { open(); }
    }
  }

  function handleInputKeydown(event) {
    var visible = getVisibleItems();
    var idx = getSelectedIndex();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      var nextIdx = idx < visible.length - 1 ? idx + 1 : 0;
      selectItem(visible[nextIdx]);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      var prevIdx = idx > 0 ? idx - 1 : visible.length - 1;
      selectItem(visible[prevIdx]);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      activateSelected();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  function handleInput() {
    filterItems(input.value);
  }

  function handleItemClick(event) {
    var item = event.target.closest('.voltz-command-palette__item');
    if (item) {
      var customEvent = new CustomEvent('voltz-command-select', {
        detail: { item: item, id: item.id },
        bubbles: true
      });
      root.dispatchEvent(customEvent);
      close();
    }
  }

  function handleBackdropClick() {
    close();
  }

  document.addEventListener('keydown', handleGlobalKeydown);
  input.addEventListener('keydown', handleInputKeydown);
  input.addEventListener('input', handleInput);
  listEl.addEventListener('click', handleItemClick);
  if (backdrop) backdrop.addEventListener('click', handleBackdropClick);

  return function destroy() {
    document.removeEventListener('keydown', handleGlobalKeydown);
    input.removeEventListener('keydown', handleInputKeydown);
    input.removeEventListener('input', handleInput);
    listEl.removeEventListener('click', handleItemClick);
    if (backdrop) backdrop.removeEventListener('click', handleBackdropClick);
  };
}

document.querySelectorAll('.voltz-command-palette').forEach(initCommandPalette);
