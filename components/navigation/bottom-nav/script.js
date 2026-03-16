/* Bottom Navigation Component Script */
/* Handles keyboard navigation and active state management */

function initBottomNav(root) {
  var links = root.querySelectorAll('.voltz-bottom-nav__link');

  function setActive(target) {
    links.forEach(function (link) {
      link.removeAttribute('aria-current');
    });
    target.setAttribute('aria-current', 'page');
  }

  function handleClick(event) {
    setActive(event.currentTarget);
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

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActive(event.currentTarget);
      event.currentTarget.click();
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

  links.forEach(function (link) {
    link.addEventListener('click', handleClick);
    link.addEventListener('keydown', handleKeydown);
  });

  return function destroy() {
    links.forEach(function (link) {
      link.removeEventListener('click', handleClick);
      link.removeEventListener('keydown', handleKeydown);
    });
  };
}

document.querySelectorAll('.voltz-bottom-nav').forEach(initBottomNav);
