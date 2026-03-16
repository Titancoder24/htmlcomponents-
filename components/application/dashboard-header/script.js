/**
 * Dashboard Header Component Script
 * Handles search focus, notification toggle, user menu trigger,
 * and mobile menu toggle interactions.
 */

function initDashboardHeader(root) {
  const header = root.querySelector('.voltz-dashboard-header');
  if (!header) return;

  setupSearch(header);
  setupNotifications(header);
  setupUserMenu(header);
  setupMobileMenu(header);
}

function setupSearch(header) {
  const searchInput = header.querySelector('.voltz-dashboard-header__search-input');
  if (!searchInput) return;

  document.addEventListener('keydown', function handleSearchShortcut(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('keydown', function handleSearchEscape(e) {
    if (e.key === 'Escape') {
      searchInput.blur();
    }
  });
}

function setupNotifications(header) {
  const btn = header.querySelector('[data-action="notifications"]');
  if (!btn) return;

  btn.addEventListener('click', function handleNotificationClick() {
    const badge = btn.querySelector('.voltz-dashboard-header__badge');
    btn.classList.toggle('voltz-dashboard-header__icon-btn--active');
    header.dispatchEvent(new CustomEvent('voltz:notifications-toggle', {
      bubbles: true,
      detail: { open: btn.classList.contains('voltz-dashboard-header__icon-btn--active') }
    }));
  });
}

function setupUserMenu(header) {
  const btn = header.querySelector('[data-action="user-menu"]');
  if (!btn) return;

  btn.addEventListener('click', function handleUserMenuClick() {
    btn.classList.toggle('voltz-dashboard-header__user--active');
    const isOpen = btn.classList.contains('voltz-dashboard-header__user--active');
    btn.setAttribute('aria-expanded', String(isOpen));
    header.dispatchEvent(new CustomEvent('voltz:user-menu-toggle', {
      bubbles: true,
      detail: { open: isOpen }
    }));
  });
}

function setupMobileMenu(header) {
  const toggle = header.querySelector('.voltz-dashboard-header__menu-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function handleMobileMenuClick() {
    toggle.classList.toggle('voltz-dashboard-header__menu-toggle--active');
    const isOpen = toggle.classList.contains('voltz-dashboard-header__menu-toggle--active');
    toggle.setAttribute('aria-expanded', String(isOpen));
    header.dispatchEvent(new CustomEvent('voltz:mobile-menu-toggle', {
      bubbles: true,
      detail: { open: isOpen }
    }));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initDashboardHeader(document);
});
