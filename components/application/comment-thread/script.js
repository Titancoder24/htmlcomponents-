/**
 * Comment Thread Component Script
 * Handles like/upvote toggling, reply button clicks,
 * and dispatches custom events for integration.
 */

function initCommentThread(root) {
  const threads = root.querySelectorAll('.voltz-comment-thread');
  threads.forEach(function setup(thread) {
    setupLikes(thread);
    setupReplies(thread);
  });
}

function setupLikes(thread) {
  thread.addEventListener('click', function handleLikeClick(e) {
    const btn = e.target.closest('[data-action="like"]');
    if (!btn) return;

    const isLiked = btn.classList.toggle('voltz-comment-thread__action--liked');
    const countEl = btn.querySelector('.voltz-comment-thread__action-count');
    if (countEl) {
      updateLikeCount(countEl, isLiked);
    }

    const comment = btn.closest('.voltz-comment-thread__comment');
    thread.dispatchEvent(new CustomEvent('voltz:comment-like', {
      bubbles: true,
      detail: {
        commentId: comment ? comment.getAttribute('data-id') : null,
        liked: isLiked
      }
    }));
  });
}

function updateLikeCount(countEl, isLiked) {
  var count = parseInt(countEl.textContent, 10) || 0;
  count = isLiked ? count + 1 : Math.max(0, count - 1);
  countEl.textContent = String(count);
}

function setupReplies(thread) {
  thread.addEventListener('click', function handleReplyClick(e) {
    const btn = e.target.closest('[data-action="reply"]');
    if (!btn) return;

    const comment = btn.closest('.voltz-comment-thread__comment');
    if (!comment) return;

    const commentId = comment.getAttribute('data-id');
    thread.dispatchEvent(new CustomEvent('voltz:comment-reply', {
      bubbles: true,
      detail: { parentId: commentId }
    }));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initCommentThread(document);
});
