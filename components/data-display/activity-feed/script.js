/**
 * Activity Feed Component Script
 * Purpose: Handles the "Load more" button interaction for the
 * activity feed. Dispatches a custom event for parent integration.
 */

(function () {
  'use strict';

  /**
   * Initialize a single activity feed component.
   * @param {HTMLElement} feed - The .voltz-activity-feed element.
   */
  function initActivityFeed(feed) {
    var loadMoreBtn = feed.querySelector(
      '.voltz-activity-feed__load-more-btn'
    );
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function () {
      handleLoadMore(feed, loadMoreBtn);
    });
  }

  /**
   * Handle load more button click.
   * Sets loading state and dispatches custom event.
   * @param {HTMLElement} feed - The feed element.
   * @param {HTMLButtonElement} btn - The load more button.
   */
  function handleLoadMore(feed, btn) {
    btn.disabled = true;
    btn.textContent = 'Loading...';

    var event = new CustomEvent('voltz-feed-load-more', {
      bubbles: true,
      detail: { feed: feed }
    });
    feed.dispatchEvent(event);

    /* Reset after timeout in case no handler responds */
    setTimeout(function () {
      resetLoadMoreBtn(btn);
    }, 5000);
  }

  /**
   * Reset the load more button to its default state.
   * @param {HTMLButtonElement} btn - The button element.
   */
  function resetLoadMoreBtn(btn) {
    btn.disabled = false;
    btn.textContent = 'Load more activities';
  }

  /** Initialize all activity feeds. */
  function initAll() {
    var feeds = document.querySelectorAll('.voltz-activity-feed');
    feeds.forEach(initActivityFeed);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
