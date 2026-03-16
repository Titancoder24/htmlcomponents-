/* Sidebar Navigation Component Script */
/* Handles collapsible groups and keyboard navigation */

function initSidebarNav(root) {
  const groupToggles = root.querySelectorAll('.voltz-sidebar-nav__group-toggle');
  const allLinks = root.querySelectorAll('.voltz-sidebar-nav__link');

  function toggleGroup(button) {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
  }

  function handleToggleClick(event) {
    toggleGroup(event.currentTarget);
  }

  function handleToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleGroup(event.currentTarget);
    }
  }

  groupToggles.forEach(function (btn) {
    btn.addEventListener('click', handleToggleClick);
    btn.addEventListener('keydown', handleToggleKeydown);
  });

  function handleLinkKeydown(event) {
    const linkArray = Array.from(allLinks).filter(function (link) {
      return link.offsetParent !== null;
    });
    const index = linkArray.indexOf(event.target);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      var next = linkArray[(index + 1) % linkArray.length];
      next.focus();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      var prev = linkArray[(index - 1 + linkArray.length) % linkArray.length];
      prev.focus();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      linkArray[0].focus();
    }

    if (event.key === 'End') {
      event.preventDefault();
      linkArray[linkArray.length - 1].focus();
    }
  }

  allLinks.forEach(function (link) {
    link.addEventListener('keydown', handleLinkKeydown);
  });

  return function destroy() {
    groupToggles.forEach(function (btn) {
      btn.removeEventListener('click', handleToggleClick);
      btn.removeEventListener('keydown', handleToggleKeydown);
    });
    allLinks.forEach(function (link) {
      link.removeEventListener('keydown', handleLinkKeydown);
    });
  };
}

document.querySelectorAll('.voltz-sidebar-nav').forEach(initSidebarNav);
