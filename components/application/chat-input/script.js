/**
 * Chat Input Component Script
 * Auto-resizes textarea, manages send button state,
 * tracks character count, and dispatches send events.
 */

function initChatInput(root) {
  const inputs = root.querySelectorAll('.voltz-chat-input');
  inputs.forEach(function setup(container) {
    setupAutoResize(container);
    setupSendButton(container);
    setupCharCount(container);
    setupSend(container);
  });
}

function setupAutoResize(container) {
  const textarea = container.querySelector('.voltz-chat-input__textarea');
  if (!textarea) return;

  textarea.addEventListener('input', function handleResize() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });
}

function setupSendButton(container) {
  const textarea = container.querySelector('.voltz-chat-input__textarea');
  const sendBtn = container.querySelector('[data-action="send"]');
  if (!textarea || !sendBtn) return;

  textarea.addEventListener('input', function toggleSend() {
    sendBtn.disabled = textarea.value.trim().length === 0;
  });
}

function setupCharCount(container) {
  const textarea = container.querySelector('.voltz-chat-input__textarea');
  const counter = container.querySelector('.voltz-chat-input__char-count');
  const maxLen = parseInt(container.getAttribute('data-max-length'), 10);
  if (!textarea || !counter || !maxLen) return;

  counter.removeAttribute('hidden');
  const currentEl = counter.querySelector('.voltz-chat-input__char-current');
  const maxEl = counter.querySelector('.voltz-chat-input__char-max');
  if (maxEl) maxEl.textContent = String(maxLen);

  textarea.addEventListener('input', function updateCount() {
    const len = textarea.value.length;
    if (currentEl) currentEl.textContent = String(len);

    counter.classList.remove(
      'voltz-chat-input__char-count--warn',
      'voltz-chat-input__char-count--over'
    );

    if (len > maxLen) {
      counter.classList.add('voltz-chat-input__char-count--over');
    } else if (len > maxLen * 0.85) {
      counter.classList.add('voltz-chat-input__char-count--warn');
    }
  });
}

function setupSend(container) {
  const textarea = container.querySelector('.voltz-chat-input__textarea');
  const sendBtn = container.querySelector('[data-action="send"]');
  if (!textarea || !sendBtn) return;

  sendBtn.addEventListener('click', function handleSendClick() {
    dispatchSend(container, textarea);
  });

  textarea.addEventListener('keydown', function handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (textarea.value.trim().length > 0) {
        dispatchSend(container, textarea);
      }
    }
  });
}

function dispatchSend(container, textarea) {
  const message = textarea.value.trim();
  if (!message) return;

  container.dispatchEvent(new CustomEvent('voltz:chat-send', {
    bubbles: true,
    detail: { message: message }
  }));

  textarea.value = '';
  textarea.style.height = 'auto';

  const sendBtn = container.querySelector('[data-action="send"]');
  if (sendBtn) sendBtn.disabled = true;

  const currentEl = container.querySelector('.voltz-chat-input__char-current');
  if (currentEl) currentEl.textContent = '0';
}

document.addEventListener('DOMContentLoaded', function () {
  initChatInput(document);
});
