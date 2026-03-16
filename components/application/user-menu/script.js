/**
 * User Menu Component Script
 * Manages dropdown open/close, keyboard navigation (arrow keys,
 * Escape, Enter), and click-outside-to-close behavior.
 */

function initUserMenu(root) {
  const menus = root.querySelectorAll('.voltz-user-menu');
  menus.forEach(function setup(menu) {
    setupTrigger(menu);
    setupKeyboard(menu);
    setupClickOutside(menu);
  });
}

function setupTrigger(menu) {
  const trigger = menu.querySelector('.voltz-user-menu__trigger');
  if (!trigger) return;

  trigger.addEventListener('click', function handleTrigger() {
    const isOpen = menu.classList.contains('voltz-user-menu--open');
    if (isOpen) {
      closeMenu(menu);
    } else {
      openMenu(menu);
    }
  });
}

function openMenu(menu) {
  const dropdown = menu.querySelector('.voltz-user-menu__dropdown');
  const trigger = menu.querySelector('.voltz-user-menu__trigger');
  menu.classList.add('voltz-user-menu--open');
  dropdown.removeAttribute('hidden');
  dropdown.setAttribute('aria-hidden', 'false');
  trigger.setAttribute('aria-expanded', 'true');

  const firstItem = dropdown.querySelector('[role="menuitem"]');
  if (firstItem) firstItem.focus();
}

function closeMenu(menu) {
  const dropdown = menu.querySelector('.voltz-user-menu__dropdown');
  const trigger = menu.querySelector('.voltz-user-menu__trigger');
  menu.classList.remove('voltz-user-menu--open');
  dropdown.setAttribute('hidden', '');
  dropdown.setAttribute('aria-hidden', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.focus();
}

function setupKeyboard(menu) {
  const dropdown = menu.querySelector('.voltz-user-menu__dropdown');
  if (!dropdown) return;

  dropdown.addEventListener('keydown', function handleKeydown(e) {
    const items = Array.from(
      dropdown.querySelectorAll('[role="menuitem"]')
    );
    const current = document.activeElement;
    const idx = items.indexOf(current);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = idx < items.length - 1 ? idx + 1 : 0;
      items[next].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = idx > 0 ? idx - 1 : items.length - 1;
      items[prev].focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(menu);
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  });
}

function setupClickOutside(menu) {
  document.addEventListener('click', function handleOutsideClick(e) {
    if (!menu.contains(e.target)) {
      if (menu.classList.contains('voltz-user-menu--open')) {
        closeMenu(menu);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initUserMenu(document);
});
