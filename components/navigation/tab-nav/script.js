/* Tab Navigation Component Script */
/* Handles keyboard navigation and active tab management */

function initTabNav(root) {
  var links = root.querySelectorAll('.voltz-tab-nav__link');
  var scrollContainer = root.querySelector('.voltz-tab-nav__scroll-container');

  function scrollActiveIntoView(link) {
    if (!scrollContainer) return;
    var containerRect = scrollContainer.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    if (linkRect.left < containerRect.left) {
      scrollContainer.scrollLeft -= containerRect.left - linkRect.left + 16;
    }
    if (linkRect.right > containerRect.right) {
      scrollContainer.scrollLeft += linkRect.right - containerRect.right + 16;
    }
  }

  function handleKeydown(event) {
    var linkArray = Array.from(links);
    var index = linkArray.indexOf(event.currentTarget);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      var next = linkArray[(index + 1) % linkArray.length];
      next.focus();
      scrollActiveIntoView(next);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      var prev = linkArray[(index - 1 + linkArray.length) % linkArray.length];
      prev.focus();
      scrollActiveIntoView(prev);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      linkArray[0].focus();
      scrollActiveIntoView(linkArray[0]);
    }

    if (event.key === 'End') {
      event.preventDefault();
      var last = linkArray[linkArray.length - 1];
      last.focus();
      scrollActiveIntoView(last);
    }
  }

  links.forEach(function (link) {
    link.addEventListener('keydown', handleKeydown);
  });

  /* Scroll active tab into view on init */
  var activeTab = root.querySelector('[aria-current="page"]');
  if (activeTab) {
    scrollActiveIntoView(activeTab);
  }

  return function destroy() {
    links.forEach(function (link) {
      link.removeEventListener('keydown', handleKeydown);
    });
  };
}

document.querySelectorAll('.voltz-tab-nav').forEach(initTabNav);
