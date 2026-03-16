/* Navbar Component Script */
/* Handles mobile toggle, keyboard navigation, and sticky behavior */

function initNavbar(root) {
  const toggle = root.querySelector('.voltz-navbar__toggle');
  const menu = root.querySelector('.voltz-navbar__menu');
  const links = root.querySelectorAll('.voltz-navbar__links a, .voltz-navbar__links button');

  if (!toggle || !menu) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('data-open', 'true');
    const firstLink = menu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-open', 'false');
    toggle.focus();
  }

  function toggleMenu() {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener('click', toggleMenu);

  function handleToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  }

  toggle.addEventListener('keydown', handleToggleKeydown);

  function handleLinkKeydown(event) {
    const linkArray = Array.from(links);
    const index = linkArray.indexOf(event.target);

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = linkArray[(index + 1) % linkArray.length];
      next.focus();
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = linkArray[(index - 1 + linkArray.length) % linkArray.length];
      prev.focus();
    }

    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  links.forEach(function (link) {
    link.addEventListener('keydown', handleLinkKeydown);
  });

  function handleOutsideClick(event) {
    if (!root.contains(event.target)) {
      closeMenu();
    }
  }

  document.addEventListener('click', handleOutsideClick);

  function handleStickyScroll() {
    if (!root.hasAttribute('data-sticky')) return;
    const scrolled = window.scrollY > 0;
    root.classList.toggle('voltz-navbar--scrolled', scrolled);
  }

  if (root.hasAttribute('data-sticky')) {
    window.addEventListener('scroll', handleStickyScroll, { passive: true });
  }

  return function destroy() {
    toggle.removeEventListener('click', toggleMenu);
    toggle.removeEventListener('keydown', handleToggleKeydown);
    links.forEach(function (link) {
      link.removeEventListener('keydown', handleLinkKeydown);
    });
    document.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('scroll', handleStickyScroll);
  };
}

document.querySelectorAll('.voltz-navbar').forEach(initNavbar);
