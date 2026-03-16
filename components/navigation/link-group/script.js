/* Link Group Component Script */
/* Handles keyboard navigation within link groups */

function initLinkGroup(root) {
  var links = root.querySelectorAll('.voltz-link-group__link');
  var isHorizontal = root.classList.contains('voltz-link-group--horizontal');

  function handleKeydown(event) {
    var linkArray = Array.from(links);
    var index = linkArray.indexOf(event.currentTarget);
    var nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    var prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    if (event.key === nextKey) {
      event.preventDefault();
      var next = linkArray[(index + 1) % linkArray.length];
      next.focus();
    }

    if (event.key === prevKey) {
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

  links.forEach(function (link) {
    link.addEventListener('keydown', handleKeydown);
  });

  return function destroy() {
    links.forEach(function (link) {
      link.removeEventListener('keydown', handleKeydown);
    });
  };
}

document.querySelectorAll('.voltz-link-group').forEach(initLinkGroup);
