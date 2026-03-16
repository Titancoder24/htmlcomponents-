/**
 * AvatarGroup Component - script.js
 * Purpose: Manages avatar visibility based on the max prop,
 * hiding overflow avatars and updating the +N counter.
 */

'use strict';

/**
 * Initializes all avatar-group components on the page.
 */
function initAvatarGroups() {
  const groups = document.querySelectorAll('.voltz-avatar-group');
  groups.forEach(initSingleGroup);
}

/**
 * Initializes a single avatar-group element.
 * @param {HTMLElement} groupEl - The avatar-group container element.
 */
function initSingleGroup(groupEl) {
  const max = parseInt(groupEl.dataset.max, 10) || 5;
  const children = Array.from(groupEl.children).filter(
    (child) => !child.classList.contains('voltz-avatar-group__overflow')
  );

  applyVisibility(children, max);
  updateOverflowCounter(groupEl, children, max);
}

/**
 * Hides avatars beyond the max count.
 * @param {HTMLElement[]} children - Avatar child elements.
 * @param {number} max - Maximum visible count.
 */
function applyVisibility(children, max) {
  children.forEach((child, index) => {
    if (index >= max) {
      child.style.display = 'none';
      child.setAttribute('aria-hidden', 'true');
    } else {
      child.style.display = '';
      child.removeAttribute('aria-hidden');
    }
  });
}

/**
 * Updates or creates the overflow counter element.
 * @param {HTMLElement} groupEl - The group container.
 * @param {HTMLElement[]} children - Avatar child elements.
 * @param {number} max - Maximum visible count.
 */
function updateOverflowCounter(groupEl, children, max) {
  const overflowCount = children.length - max;
  let counter = groupEl.querySelector(
    '.voltz-avatar-group__overflow'
  );

  if (overflowCount <= 0) {
    if (counter) {
      counter.remove();
    }
    return;
  }

  if (!counter) {
    counter = document.createElement('span');
    counter.classList.add('voltz-avatar-group__overflow');
    const size = getSizeClass(groupEl);
    if (size) {
      counter.classList.add(
        'voltz-avatar-group__overflow--' + size
      );
    }
    groupEl.appendChild(counter);
  }

  counter.textContent = '+' + overflowCount;
  counter.setAttribute(
    'aria-label',
    overflowCount + ' more users'
  );
}

/**
 * Extracts the size modifier from the group element.
 * @param {HTMLElement} groupEl - The group container.
 * @returns {string|null} The size class name or null.
 */
function getSizeClass(groupEl) {
  const sizes = ['sm', 'md', 'lg'];
  for (let i = 0; i < sizes.length; i++) {
    if (
      groupEl.classList.contains(
        'voltz-avatar-group--' + sizes[i]
      )
    ) {
      return sizes[i];
    }
  }
  return null;
}

/* Initialize on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAvatarGroups);
} else {
  initAvatarGroups();
}
