/* Hamburger Menu Component Script */
/* Handles toggle state, keyboard interaction, and ARIA updates */

function initHamburger(root) {
  function toggle() {
    var expanded = root.getAttribute('aria-expanded') === 'true';
    root.setAttribute('aria-expanded', String(!expanded));

    var controlsId = root.getAttribute('aria-controls');
    if (controlsId) {
      var target = document.getElementById(controlsId);
      if (target) {
        target.setAttribute('data-open', String(!expanded));
      }
    }

    var customEvent = new CustomEvent('voltz-hamburger-toggle', {
      detail: { expanded: !expanded },
      bubbles: true
    });
    root.dispatchEvent(customEvent);
  }

  function handleClick() {
    toggle();
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }

  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeydown);

  return function destroy() {
    root.removeEventListener('click', handleClick);
    root.removeEventListener('keydown', handleKeydown);
  };
}

document.querySelectorAll('.voltz-hamburger').forEach(initHamburger);
