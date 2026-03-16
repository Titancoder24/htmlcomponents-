/* Stepper Component Script */
/* Handles clickable steps and keyboard navigation */

function initStepper(root) {
  var isClickable = root.hasAttribute('data-clickable');
  var steps = root.querySelectorAll('.voltz-stepper__step');
  var buttons = root.querySelectorAll('.voltz-stepper__button');
  var isVertical = root.classList.contains('voltz-stepper--vertical');

  function getNavigableButtons() {
    return Array.from(buttons).filter(function (btn) {
      return btn.getAttribute('aria-disabled') !== 'true';
    });
  }

  function handleStepClick(event) {
    if (!isClickable) return;
    var button = event.currentTarget;
    if (button.getAttribute('aria-disabled') === 'true') return;

    var step = button.closest('.voltz-stepper__step');
    var customEvent = new CustomEvent('voltz-step-change', {
      detail: { step: step, index: Array.from(steps).indexOf(step) },
      bubbles: true
    });
    root.dispatchEvent(customEvent);
  }

  function handleKeydown(event) {
    var navButtons = getNavigableButtons();
    var index = navButtons.indexOf(event.currentTarget);
    var nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    var prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    if (event.key === nextKey) {
      event.preventDefault();
      var next = navButtons[(index + 1) % navButtons.length];
      next.focus();
    }

    if (event.key === prevKey) {
      event.preventDefault();
      var prev = navButtons[(index - 1 + navButtons.length) % navButtons.length];
      prev.focus();
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStepClick(event);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      navButtons[0].focus();
    }

    if (event.key === 'End') {
      event.preventDefault();
      navButtons[navButtons.length - 1].focus();
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', handleStepClick);
    btn.addEventListener('keydown', handleKeydown);
  });

  return function destroy() {
    buttons.forEach(function (btn) {
      btn.removeEventListener('click', handleStepClick);
      btn.removeEventListener('keydown', handleKeydown);
    });
  };
}

document.querySelectorAll('.voltz-stepper').forEach(initStepper);
