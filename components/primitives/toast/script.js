/**
 * Toast Component - script.js
 * Purpose: Manages toast lifecycle including creation, auto-dismiss with
 * progress timer, stack management, keyboard dismissal, and animations.
 */

const VoltzToast = (() => {
  'use strict';

  const CONTAINER_CLASS = 'voltz-toast-container';
  const containers = new Map();

  /**
   * Gets or creates a toast container for the given position.
   */
  function getContainer(position) {
    if (containers.has(position)) {
      return containers.get(position);
    }
    const container = document.createElement('div');
    container.className = `${CONTAINER_CLASS} ${CONTAINER_CLASS}--${position}`;
    container.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(container);
    containers.set(position, container);
    return container;
  }

  /**
   * Creates the close button element with SVG icon using DOM APIs.
   */
  function createCloseButton() {
    const btn = document.createElement('button');
    btn.className = 'voltz-toast__close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Dismiss notification');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'voltz-toast__close-icon');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z');
    path.setAttribute('clip-rule', 'evenodd');

    svg.appendChild(path);
    btn.appendChild(svg);
    return btn;
  }

  /**
   * Starts the auto-dismiss timer and animates the progress bar.
   */
  function startTimer(toastEl, duration, onComplete) {
    if (!duration || duration <= 0) {
      return null;
    }

    const progressBar = toastEl.querySelector('.voltz-toast__progress');
    if (progressBar) {
      progressBar.style.transitionDuration = `${duration}ms`;
      requestAnimationFrame(() => {
        progressBar.style.transform = 'scaleX(0)';
      });
    }

    const timerId = setTimeout(() => {
      onComplete();
    }, duration);

    return timerId;
  }

  /**
   * Dismisses a toast with exit animation.
   */
  function dismiss(toastEl) {
    if (toastEl.dataset.dismissed === 'true') {
      return;
    }
    toastEl.dataset.dismissed = 'true';
    toastEl.classList.add('voltz-toast--exiting');

    const onEnd = () => {
      toastEl.removeEventListener('animationend', onEnd);
      toastEl.remove();
      toastEl.dispatchEvent(new CustomEvent('dismiss', { bubbles: true }));
    };

    toastEl.addEventListener('animationend', onEnd);

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      onEnd();
    }
  }

  /**
   * Binds keyboard and close button events to the toast.
   */
  function bindEvents(toastEl, timerId) {
    const closeBtn = toastEl.querySelector('.voltz-toast__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (timerId) {
          clearTimeout(timerId);
        }
        dismiss(toastEl);
      });
    }

    toastEl.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (timerId) {
          clearTimeout(timerId);
        }
        dismiss(toastEl);
      }
    });
  }

  /**
   * Pauses the timer when hovering over the toast.
   */
  function bindHoverPause(toastEl, state) {
    toastEl.addEventListener('mouseenter', () => {
      if (state.timerId) {
        clearTimeout(state.timerId);
        state.timerId = null;
      }
      const progressBar = toastEl.querySelector('.voltz-toast__progress');
      if (progressBar) {
        const computed = getComputedStyle(progressBar);
        progressBar.style.transform = computed.transform;
        progressBar.style.transitionDuration = '0ms';
      }
    });

    toastEl.addEventListener('mouseleave', () => {
      const duration = parseInt(toastEl.dataset.duration, 10) || 0;
      if (duration > 0) {
        state.timerId = startTimer(toastEl, duration / 2, () => {
          dismiss(toastEl);
        });
      }
    });
  }

  /**
   * Initializes all toast elements found in the DOM.
   */
  function init(root = document) {
    const toasts = root.querySelectorAll('.voltz-toast:not([data-initialized])');
    toasts.forEach((toastEl) => {
      toastEl.dataset.initialized = 'true';

      const duration = parseInt(toastEl.dataset.duration, 10) || 5000;
      const state = { timerId: null };

      state.timerId = startTimer(toastEl, duration, () => {
        dismiss(toastEl);
      });

      bindEvents(toastEl, state.timerId);
      bindHoverPause(toastEl, state);

      toastEl.dispatchEvent(new CustomEvent('show', { bubbles: true }));
    });
  }

  /**
   * Programmatically creates and shows a toast notification.
   */
  function show(options = {}) {
    const {
      type = 'info',
      position = 'top-right',
      message = '',
      title = '',
      duration = 5000,
      dismissible = true
    } = options;

    const container = getContainer(position);
    const toastEl = document.createElement('div');
    toastEl.className = `voltz-toast voltz-toast--${type}`;
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.dataset.duration = String(duration);

    const contentEl = document.createElement('div');
    contentEl.className = 'voltz-toast__content';

    if (title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'voltz-toast__title';
      titleEl.textContent = title;
      contentEl.appendChild(titleEl);
    }

    const msgEl = document.createElement('div');
    msgEl.className = 'voltz-toast__message';
    msgEl.textContent = message;
    contentEl.appendChild(msgEl);

    toastEl.appendChild(contentEl);

    if (dismissible) {
      toastEl.appendChild(createCloseButton());
    }

    const progress = document.createElement('div');
    progress.className = 'voltz-toast__progress';
    progress.setAttribute('aria-hidden', 'true');
    toastEl.appendChild(progress);

    container.appendChild(toastEl);
    init(container);

    return toastEl;
  }

  return { init, show, dismiss };
})();

document.addEventListener('DOMContentLoaded', () => {
  VoltzToast.init();
});
