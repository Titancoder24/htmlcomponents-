/**
 * Tag Component - script.js
 * Purpose: Manages tag removal interactions including close button clicks
 * and keyboard-based removal (Backspace/Delete keys).
 */

const VoltzTag = (() => {
  'use strict';

  /**
   * Removes a tag element with optional animation.
   */
  function removeTag(tagEl) {
    tagEl.dispatchEvent(new CustomEvent('remove', {
      bubbles: true,
      detail: { label: getLabel(tagEl) }
    }));
    tagEl.remove();
  }

  /**
   * Gets the text label from a tag element.
   */
  function getLabel(tagEl) {
    const labelEl = tagEl.querySelector('.voltz-tag__label');
    return labelEl ? labelEl.textContent.trim() : '';
  }

  /**
   * Binds the close button click handler.
   */
  function bindCloseButton(tagEl) {
    const closeBtn = tagEl.querySelector('.voltz-tag__close');
    if (!closeBtn) {
      return;
    }

    closeBtn.addEventListener('click', () => {
      if (tagEl.classList.contains('voltz-tag--disabled')) {
        return;
      }
      removeTag(tagEl);
    });
  }

  /**
   * Binds keyboard removal handlers (Backspace/Delete).
   */
  function bindKeyboard(tagEl) {
    tagEl.addEventListener('keydown', (event) => {
      if (tagEl.classList.contains('voltz-tag--disabled')) {
        return;
      }

      const isRemovable = tagEl.querySelector('.voltz-tag__close');
      if (!isRemovable) {
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeTag(tagEl);
      }
    });
  }

  /**
   * Initializes all tag components in the given root.
   */
  function init(root = document) {
    const tags = root.querySelectorAll('.voltz-tag:not([data-initialized])');
    tags.forEach((tagEl) => {
      tagEl.dataset.initialized = 'true';

      if (tagEl.querySelector('.voltz-tag__close')) {
        tagEl.setAttribute('tabindex', '0');
      }

      bindCloseButton(tagEl);
      bindKeyboard(tagEl);
    });
  }

  return { init, removeTag };
})();

document.addEventListener('DOMContentLoaded', () => {
  VoltzTag.init();
});
