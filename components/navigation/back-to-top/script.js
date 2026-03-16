/* Back to Top Component Script */
/* Shows/hides button based on scroll position, smooth scrolls to top */

function initBackToTop(root) {
  var threshold = parseInt(root.getAttribute('data-threshold'), 10) || 300;

  function updateVisibility() {
    var isVisible = window.scrollY > threshold;
    root.setAttribute('data-visible', String(isVisible));
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleClick() {
    scrollToTop();
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  }

  var scrollTimer = null;
  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = requestAnimationFrame(function () {
      updateVisibility();
      scrollTimer = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeydown);

  updateVisibility();

  return function destroy() {
    window.removeEventListener('scroll', onScroll);
    root.removeEventListener('click', handleClick);
    root.removeEventListener('keydown', handleKeydown);
  };
}

document.querySelectorAll('.voltz-back-to-top').forEach(initBackToTop);
