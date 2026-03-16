/**
 * Breadcrumb Component - script.js
 * Purpose: Manages collapsible breadcrumb behavior, expanding hidden
 * middle items when the ellipsis button is clicked.
 */

const VoltzBreadcrumb = (() => {
  'use strict';

  /**
   * Collapses middle items in a breadcrumb list if collapsible is enabled.
   */
  function collapseItems(navEl) {
    const items = navEl.querySelectorAll(
      '.voltz-breadcrumb__item:not(.voltz-breadcrumb__item--ellipsis)'
    );
    const maxVisible = parseInt(navEl.dataset.maxVisible, 10) || 4;

    if (items.length <= maxVisible) {
      const ellipsis = navEl.querySelector('.voltz-breadcrumb__item--ellipsis');
      if (ellipsis) {
        ellipsis.style.display = 'none';
      }
      return;
    }

    const keepStart = 1;
    const keepEnd = 1;

    for (let i = keepStart; i < items.length - keepEnd; i++) {
      items[i].classList.add('voltz-breadcrumb__item--collapsed');
    }
  }

  /**
   * Expands all collapsed breadcrumb items and hides the ellipsis.
   */
  function expandItems(navEl) {
    const collapsed = navEl.querySelectorAll('.voltz-breadcrumb__item--collapsed');
    collapsed.forEach((item) => {
      item.classList.remove('voltz-breadcrumb__item--collapsed');
    });

    const ellipsis = navEl.querySelector('.voltz-breadcrumb__item--ellipsis');
    if (ellipsis) {
      ellipsis.style.display = 'none';
      ellipsis.setAttribute('aria-hidden', 'true');
    }

    navEl.dispatchEvent(new CustomEvent('expand', { bubbles: true }));
  }

  /**
   * Binds click event to the expand button.
   */
  function bindExpandButton(navEl) {
    const expandBtn = navEl.querySelector('.voltz-breadcrumb__expand');
    if (!expandBtn) {
      return;
    }

    expandBtn.addEventListener('click', () => {
      expandItems(navEl);
    });

    expandBtn.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        expandItems(navEl);
      }
    });
  }

  /**
   * Initializes all breadcrumb components in the given root.
   */
  function init(root = document) {
    const breadcrumbs = root.querySelectorAll(
      '.voltz-breadcrumb:not([data-initialized])'
    );
    breadcrumbs.forEach((navEl) => {
      navEl.dataset.initialized = 'true';

      const isCollapsible = navEl.classList.contains('voltz-breadcrumb--collapsible')
        || navEl.dataset.collapsible === 'true';

      if (isCollapsible) {
        collapseItems(navEl);
        bindExpandButton(navEl);
      }
    });
  }

  return { init, expandItems };
})();

document.addEventListener('DOMContentLoaded', () => {
  VoltzBreadcrumb.init();
});
