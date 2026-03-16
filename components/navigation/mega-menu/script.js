/* Mega Menu Component Script */
/* Handles open/close, keyboard navigation, and focus management */

function initMegaMenu(root) {
  var trigger = root.querySelector('.voltz-mega-menu__trigger');
  var panel = root.querySelector('.voltz-mega-menu__panel');
  if (!trigger || !panel) return;

  var menuItems = panel.querySelectorAll('.voltz-mega-menu__link');

  function openMenu() {
    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('data-open', 'true');
    if (menuItems.length > 0) {
      menuItems[0].focus();
    }
  }

  function closeMenu() {
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('data-open', 'false');
    trigger.focus();
  }

  function isOpen() {
    return trigger.getAttribute('aria-expanded') === 'true';
  }

  function handleTriggerClick() {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleTriggerKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu();
    }
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  function getVisibleItems() {
    return Array.from(menuItems).filter(function (item) {
      return item.offsetParent !== null;
    });
  }

  function handleItemKeydown(event) {
    var items = getVisibleItems();
    var index = items.indexOf(event.target);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      var next = items[(index + 1) % items.length];
      next.focus();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      var prev = items[(index - 1 + items.length) % items.length];
      prev.focus();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    }

    if (event.key === 'Tab') {
      closeMenu();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      items[0].focus();
    }

    if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  }

  function handleOutsideClick(event) {
    if (isOpen() && !root.contains(event.target)) {
      closeMenu();
    }
  }

  trigger.addEventListener('click', handleTriggerClick);
  trigger.addEventListener('keydown', handleTriggerKeydown);
  menuItems.forEach(function (item) {
    item.addEventListener('keydown', handleItemKeydown);
  });
  document.addEventListener('click', handleOutsideClick);

  return function destroy() {
    trigger.removeEventListener('click', handleTriggerClick);
    trigger.removeEventListener('keydown', handleTriggerKeydown);
    menuItems.forEach(function (item) {
      item.removeEventListener('keydown', handleItemKeydown);
    });
    document.removeEventListener('click', handleOutsideClick);
  };
}

document.querySelectorAll('.voltz-mega-menu').forEach(initMegaMenu);
