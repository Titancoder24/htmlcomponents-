/*
 * CTA Banner Component Script
 * Purpose: Handles banner dismiss functionality with smooth animation.
 * No innerHTML, no eval, no inline handlers.
 */

(function () {
  'use strict';

  function initCtaBanner(banner) {
    const dismissBtn = banner.querySelector('[data-dismiss-banner]');
    if (!dismissBtn) return;

    dismissBtn.addEventListener('click', function () {
      dismissBanner(banner);
    });
  }

  function dismissBanner(banner) {
    banner.style.maxHeight = banner.offsetHeight + 'px';

    requestAnimationFrame(function () {
      banner.classList.add('voltz-cta-banner--hidden');
    });

    banner.addEventListener('transitionend', function handler() {
      banner.removeEventListener('transitionend', handler);
      banner.setAttribute('aria-hidden', 'true');
      storeDismissal(banner);
    });
  }

  function storeDismissal(banner) {
    var bannerId = banner.getAttribute('data-banner-id');
    if (bannerId) {
      try {
        localStorage.setItem('voltz-banner-' + bannerId, 'dismissed');
      } catch (e) {
        /* Storage not available */
      }
    }
  }

  function checkDismissed(banner) {
    var bannerId = banner.getAttribute('data-banner-id');
    if (!bannerId) return;

    try {
      if (localStorage.getItem('voltz-banner-' + bannerId) === 'dismissed') {
        banner.classList.add('voltz-cta-banner--hidden');
        banner.setAttribute('aria-hidden', 'true');
      }
    } catch (e) {
      /* Storage not available */
    }
  }

  function init() {
    var banners = document.querySelectorAll('[data-component="cta-banner"]');
    banners.forEach(function (banner) {
      checkDismissed(banner);
      initCtaBanner(banner);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
