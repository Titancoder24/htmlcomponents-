/**
 * Pagination Component - script.js
 * Purpose: Manages pagination state, page number generation with ellipsis,
 * button click handling, and keyboard navigation (arrow keys).
 */

const VoltzPagination = (() => {
  'use strict';

  /**
   * Generates the page range array with ellipsis markers.
   */
  function generatePages(totalPages, currentPage, siblingCount) {
    const pages = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    if (totalPages <= (siblingCount * 2) + 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ page: i, isCurrent: i === currentPage });
      }
      return pages;
    }

    pages.push({ page: 1, isCurrent: currentPage === 1 });

    if (showLeftEllipsis) {
      pages.push({ isEllipsis: true });
    } else {
      for (let i = 2; i < leftSibling; i++) {
        pages.push({ page: i, isCurrent: false });
      }
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push({ page: i, isCurrent: i === currentPage });
      }
    }

    if (showRightEllipsis) {
      pages.push({ isEllipsis: true });
    } else {
      for (let i = rightSibling + 1; i < totalPages; i++) {
        pages.push({ page: i, isCurrent: false });
      }
    }

    if (totalPages > 1) {
      pages.push({ page: totalPages, isCurrent: currentPage === totalPages });
    }

    return pages;
  }

  /**
   * Updates the active state of page buttons.
   */
  function updateActiveState(navEl, page) {
    const btns = navEl.querySelectorAll('.voltz-pagination__btn--page');
    btns.forEach((btn) => {
      const btnPage = parseInt(btn.dataset.page, 10);
      btn.classList.toggle('voltz-pagination__btn--active', btnPage === page);
      if (btnPage === page) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Updates disabled state of prev/next/boundary buttons.
   */
  function updateNavButtons(navEl, currentPage, totalPages) {
    const prevBtn = navEl.querySelector('.voltz-pagination__btn--prev');
    const nextBtn = navEl.querySelector('.voltz-pagination__btn--next');
    const firstBtn = navEl.querySelector('.voltz-pagination__btn--first');
    const lastBtn = navEl.querySelector('.voltz-pagination__btn--last');

    const setDisabled = (btn, disabled) => {
      if (!btn) return;
      btn.disabled = disabled;
      btn.setAttribute('aria-disabled', String(disabled));
    };

    setDisabled(prevBtn, currentPage <= 1);
    setDisabled(firstBtn, currentPage <= 1);
    setDisabled(nextBtn, currentPage >= totalPages);
    setDisabled(lastBtn, currentPage >= totalPages);

    const info = navEl.querySelector('.voltz-pagination__info');
    if (info) {
      info.textContent = `Page ${currentPage} of ${totalPages}`;
    }
  }

  /**
   * Navigates to the specified page and dispatches change event.
   */
  function goToPage(navEl, page) {
    const totalPages = parseInt(navEl.dataset.totalPages, 10) || 1;
    const clamped = Math.max(1, Math.min(page, totalPages));
    navEl.dataset.currentPage = String(clamped);

    updateActiveState(navEl, clamped);
    updateNavButtons(navEl, clamped, totalPages);

    navEl.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { page: clamped }
    }));
  }

  /**
   * Handles click events on pagination buttons.
   */
  function handleClick(navEl, event) {
    const btn = event.target.closest('.voltz-pagination__btn');
    if (!btn || btn.disabled) return;

    const current = parseInt(navEl.dataset.currentPage, 10) || 1;
    const action = btn.dataset.page;

    if (action === 'prev') {
      goToPage(navEl, current - 1);
    } else if (action === 'next') {
      goToPage(navEl, current + 1);
    } else {
      goToPage(navEl, parseInt(action, 10));
    }
  }

  /**
   * Handles keyboard navigation with arrow keys.
   */
  function handleKeydown(navEl, event) {
    const current = parseInt(navEl.dataset.currentPage, 10) || 1;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPage(navEl, current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToPage(navEl, current + 1);
    }
  }

  /**
   * Initializes all pagination components in the given root.
   */
  function init(root = document) {
    const navs = root.querySelectorAll(
      '.voltz-pagination:not([data-initialized])'
    );
    navs.forEach((navEl) => {
      navEl.dataset.initialized = 'true';

      navEl.addEventListener('click', (e) => handleClick(navEl, e));
      navEl.addEventListener('keydown', (e) => handleKeydown(navEl, e));
    });
  }

  return { init, goToPage, generatePages };
})();

document.addEventListener('DOMContentLoaded', () => {
  VoltzPagination.init();
});
