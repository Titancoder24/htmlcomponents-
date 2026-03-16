/* Breadcrumb Navigation Component Script */
/* Handles collapsible paths and dropdown for hidden items */

function initBreadcrumbNav(root) {
  var collapsedItems = root.querySelectorAll('.voltz-breadcrumb-nav__collapsed');

  function openDropdown(container) {
    container.setAttribute('data-open', 'true');
    var btn = container.querySelector('.voltz-breadcrumb-nav__ellipsis');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    var firstItem = container.querySelector('.voltz-breadcrumb-nav__dropdown-item');
    if (firstItem) firstItem.focus();
  }

  function closeDropdown(container) {
    container.setAttribute('data-open', 'false');
    var btn = container.querySelector('.voltz-breadcrumb-nav__ellipsis');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  }

  function toggleDropdown(container) {
    var isOpen = container.getAttribute('data-open') === 'true';
    if (isOpen) {
      closeDropdown(container);
    } else {
      openDropdown(container);
    }
  }

  function handleEllipsisClick(event) {
    var container = event.currentTarget.closest(
      '.voltz-breadcrumb-nav__collapsed'
    );
    if (container) toggleDropdown(container);
  }

  function handleEllipsisKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEllipsisClick(event);
    }
    if (event.key === 'Escape') {
      var container = event.currentTarget.closest(
        '.voltz-breadcrumb-nav__collapsed'
      );
      if (container) closeDropdown(container);
    }
  }

  function handleDropdownKeydown(event) {
    var container = event.target.closest('.voltz-breadcrumb-nav__collapsed');
    if (!container) return;

    var items = Array.from(
      container.querySelectorAll('.voltz-breadcrumb-nav__dropdown-item')
    );
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
      closeDropdown(container);
    }
  }

  collapsedItems.forEach(function (container) {
    var btn = container.querySelector('.voltz-breadcrumb-nav__ellipsis');
    if (btn) {
      btn.addEventListener('click', handleEllipsisClick);
      btn.addEventListener('keydown', handleEllipsisKeydown);
    }
    var dropdown = container.querySelector('.voltz-breadcrumb-nav__dropdown');
    if (dropdown) {
      dropdown.addEventListener('keydown', handleDropdownKeydown);
    }
  });

  function handleOutsideClick(event) {
    collapsedItems.forEach(function (container) {
      if (!container.contains(event.target)) {
        closeDropdown(container);
      }
    });
  }

  document.addEventListener('click', handleOutsideClick);

  return function destroy() {
    collapsedItems.forEach(function (container) {
      var btn = container.querySelector('.voltz-breadcrumb-nav__ellipsis');
      if (btn) {
        btn.removeEventListener('click', handleEllipsisClick);
        btn.removeEventListener('keydown', handleEllipsisKeydown);
      }
      var dropdown = container.querySelector('.voltz-breadcrumb-nav__dropdown');
      if (dropdown) {
        dropdown.removeEventListener('keydown', handleDropdownKeydown);
      }
    });
    document.removeEventListener('click', handleOutsideClick);
  };
}

document.querySelectorAll('.voltz-breadcrumb-nav').forEach(initBreadcrumbNav);
