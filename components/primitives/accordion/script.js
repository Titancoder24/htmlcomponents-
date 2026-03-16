/**
 * Accordion Component - script.js
 * Purpose: Manages accordion expand/collapse behavior with single or
 * multiple open modes, keyboard navigation, and ARIA state updates.
 */

'use strict';

/**
 * Initializes all accordion components on the page.
 */
function initAccordions() {
  var accordions = document.querySelectorAll('.voltz-accordion');
  accordions.forEach(initSingleAccordion);
}

/**
 * Initializes a single accordion element.
 * @param {HTMLElement} accordion - The accordion container element.
 */
function initSingleAccordion(accordion) {
  var mode = accordion.dataset.mode || 'single';
  var defaultOpen = parseInt(accordion.dataset.defaultOpen, 10);
  var headers = getAccordionHeaders(accordion);

  headers.forEach(function (header, index) {
    header.addEventListener('click', function () {
      toggleAccordionItem(header, accordion, mode);
    });

    header.addEventListener('keydown', function (event) {
      handleAccordionKeydown(event, headers, index);
    });

    if (index === defaultOpen) {
      expandItem(header);
    }
  });
}

/**
 * Toggles an accordion item open/closed.
 * @param {HTMLElement} header - The header button element.
 * @param {HTMLElement} accordion - The accordion container.
 * @param {string} mode - 'single' or 'multiple'.
 */
function toggleAccordionItem(header, accordion, mode) {
  var isExpanded = header.getAttribute('aria-expanded') === 'true';

  if (mode === 'single') {
    collapseAllItems(accordion);
  }

  if (isExpanded) {
    collapseItem(header);
  } else {
    expandItem(header);
  }
}

/**
 * Expands an accordion item.
 * @param {HTMLElement} header - The header button element.
 */
function expandItem(header) {
  var panelId = header.getAttribute('aria-controls');
  var panel = document.getElementById(panelId);
  if (!panel) return;

  header.setAttribute('aria-expanded', 'true');
  panel.removeAttribute('hidden');
}

/**
 * Collapses an accordion item.
 * @param {HTMLElement} header - The header button element.
 */
function collapseItem(header) {
  var panelId = header.getAttribute('aria-controls');
  var panel = document.getElementById(panelId);
  if (!panel) return;

  header.setAttribute('aria-expanded', 'false');
  panel.setAttribute('hidden', '');
}

/**
 * Collapses all items within an accordion.
 * @param {HTMLElement} accordion - The accordion container.
 */
function collapseAllItems(accordion) {
  var headers = getAccordionHeaders(accordion);
  headers.forEach(collapseItem);
}

/**
 * Handles keyboard navigation within the accordion.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement[]} headers - All header buttons.
 * @param {number} currentIndex - Index of the focused header.
 */
function handleAccordionKeydown(event, headers, currentIndex) {
  var newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      newIndex = (currentIndex + 1) % headers.length;
      break;
    case 'ArrowUp':
      event.preventDefault();
      newIndex = (currentIndex - 1 + headers.length) % headers.length;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = headers.length - 1;
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      headers[currentIndex].click();
      return;
    default:
      return;
  }

  headers[newIndex].focus();
}

/**
 * Gets all accordion header buttons within a container.
 * @param {HTMLElement} accordion - The accordion container.
 * @returns {HTMLElement[]} Array of header button elements.
 */
function getAccordionHeaders(accordion) {
  return Array.from(
    accordion.querySelectorAll('.voltz-accordion__header')
  );
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}
