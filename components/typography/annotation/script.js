/*
 * Annotation Component Script
 * Purpose: Handles tooltip dismiss on Escape key and ensures
 * proper aria-describedby linkage for accessibility.
 */

(function () {
  'use strict';

  /**
   * Initialize all annotation components.
   * Sets up aria-describedby and Escape key handling.
   */
  function initAnnotations() {
    var annotations = document.querySelectorAll('[data-voltz-annotation]');
    annotations.forEach(function (annotation) {
      setupAriaDescribedBy(annotation);
      attachEscapeListener(annotation);
    });
  }

  /**
   * Links the annotation marker to its tooltip via aria-describedby.
   * @param {Element} annotation - The annotation wrapper element
   */
  function setupAriaDescribedBy(annotation) {
    var tooltip = annotation.querySelector('[role="tooltip"]');
    if (!tooltip || !tooltip.id) {
      return;
    }
    annotation.setAttribute('aria-describedby', tooltip.id);
  }

  /**
   * Attaches an Escape key listener to dismiss the tooltip.
   * @param {Element} annotation - The annotation wrapper element
   */
  function attachEscapeListener(annotation) {
    annotation.addEventListener('keydown', function (event) {
      handleEscapeKey(event, annotation);
    });
  }

  /**
   * Handles Escape key to blur the annotation and hide tooltip.
   * @param {KeyboardEvent} event
   * @param {Element} annotation
   */
  function handleEscapeKey(event, annotation) {
    if (event.key === 'Escape') {
      annotation.blur();
    }
  }

  /* Initialize on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnnotations);
  } else {
    initAnnotations();
  }
})();
