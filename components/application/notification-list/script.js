/**
 * Notification List Component Script
 * Handles mark-all-read, dismiss individual notifications,
 * click-to-mark-read, and empty state transitions.
 */

function initNotificationList(root) {
  const panels = root.querySelectorAll('.voltz-notification-list');
  panels.forEach(function setup(panel) {
    setupMarkAllRead(panel);
    setupDismiss(panel);
    setupItemClick(panel);
  });
}

function setupMarkAllRead(panel) {
  const btn = panel.querySelector('[data-action="mark-all-read"]');
  if (!btn) return;

  btn.addEventListener('click', function handleMarkAll() {
    const items = panel.querySelectorAll(
      '.voltz-notification-list__item--unread'
    );
    items.forEach(function markRead(item) {
      item.classList.remove('voltz-notification-list__item--unread');
    });
    panel.dispatchEvent(new CustomEvent('voltz:notifications-read-all', {
      bubbles: true
    }));
    checkEmpty(panel);
  });
}

function setupDismiss(panel) {
  panel.addEventListener('click', function handleDismissClick(e) {
    const dismissBtn = e.target.closest('[data-action="dismiss"]');
    if (!dismissBtn) return;

    e.stopPropagation();
    const item = dismissBtn.closest('.voltz-notification-list__item');
    if (!item) return;

    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = 'opacity 0.2s, transform 0.2s';

    setTimeout(function removeItem() {
      item.remove();
      checkEmpty(panel);
      panel.dispatchEvent(new CustomEvent('voltz:notification-dismiss', {
        bubbles: true,
        detail: { id: item.getAttribute('data-id') }
      }));
    }, 200);
  });
}

function setupItemClick(panel) {
  panel.addEventListener('click', function handleItemClick(e) {
    if (e.target.closest('[data-action="dismiss"]')) return;
    const item = e.target.closest('.voltz-notification-list__item');
    if (!item) return;

    item.classList.remove('voltz-notification-list__item--unread');
    panel.dispatchEvent(new CustomEvent('voltz:notification-click', {
      bubbles: true,
      detail: { id: item.getAttribute('data-id') }
    }));
  });
}

function checkEmpty(panel) {
  const items = panel.querySelectorAll('.voltz-notification-list__item');
  if (items.length === 0) {
    showEmptyState(panel);
  }
}

function showEmptyState(panel) {
  const list = panel.querySelector('.voltz-notification-list__items');
  if (!list) return;

  const empty = document.createElement('div');
  empty.className = 'voltz-notification-list__empty';

  const text = document.createElement('p');
  text.className = 'voltz-notification-list__empty-text';
  text.textContent = 'All caught up!';
  empty.appendChild(text);

  const hint = document.createElement('p');
  hint.className = 'voltz-notification-list__empty-hint';
  hint.textContent = 'No new notifications to show.';
  empty.appendChild(hint);

  list.replaceWith(empty);
}

document.addEventListener('DOMContentLoaded', function () {
  initNotificationList(document);
});
