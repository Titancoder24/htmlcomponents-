/* Floating Navigation Component Script */
/* Handles show/hide on scroll direction and keyboard navigation */

function initFloatingNav(root) {
  var links = root.querySelectorAll('.voltz-floating-nav__link');
  var hideOnScroll = root.getAttribute('data-hide-on-scroll') === 'true';
  var lastScrollY = window.scrollY;
  var scrollThreshold = 10;

  function show() {
    root.setAttribute('data-visible', 'true');
  }

  function hide() {
    root.setAttribute('data-visible', 'false');
  }

  function handleScroll() {
    if (!hideOnScroll) return;

    var currentScrollY = window.scrollY;
    var diff = currentScrollY - lastScrollY;

    if (diff > scrollThreshold) {
      hide();
    } else if (diff < -scrollThreshold) {
      show();
    }

    if (currentScrollY < 100) {
      show();
    }

    lastScrollY = currentScrollY;
  }

  var scrollTimer = null;
  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = requestAnimationFrame(function () {
      handleScroll();
      scrollTimer = null;
    });
  }

  function handleKeydown(event) {
    var linkArray = Array.from(links);
    var index = linkArray.indexOf(event.currentTarget);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      var next = linkArray[(index + 1) % linkArray.length];
      next.focus();
    }

    if (event.key === 'ArrowLeft') {
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

  window.addEventListener('scroll', onScroll, { passive: true });
  links.forEach(function (link) {
    link.addEventListener('keydown', handleKeydown);
  });

  return function destroy() {
    window.removeEventListener('scroll', onScroll);
    links.forEach(function (link) {
      link.removeEventListener('keydown', handleKeydown);
    });
  };
}

document.querySelectorAll('.voltz-floating-nav').forEach(initFloatingNav);
