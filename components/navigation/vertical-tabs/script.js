/* Vertical Tabs Component Script */
/* Handles keyboard navigation for vertical tab list */

function initVerticalTabs(root) {
  var links = root.querySelectorAll('.voltz-vertical-tabs__link');

  function isHorizontalMode() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function handleKeydown(event) {
    var linkArray = Array.from(links);
    var index = linkArray.indexOf(event.currentTarget);
    var horizontal = isHorizontalMode();
    var nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    var prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

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

document.querySelectorAll('.voltz-vertical-tabs').forEach(initVerticalTabs);
