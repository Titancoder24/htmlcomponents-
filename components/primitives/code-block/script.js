/**
 * Code Block Component - script.js
 * Purpose: Manages copy-to-clipboard functionality, line number generation,
 * and line highlighting for the code block component.
 */

const VoltzCodeBlock = (() => {
  'use strict';

  /**
   * Copies the code content to the clipboard.
   */
  function copyCode(codeBlockEl) {
    const codeEl = codeBlockEl.querySelector('.voltz-code-block__code');
    if (!codeEl) {
      return;
    }

    const text = codeEl.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      showCopySuccess(codeBlockEl);
      codeBlockEl.dispatchEvent(new CustomEvent('copy', {
        bubbles: true,
        detail: { text }
      }));
    }).catch(() => {
      fallbackCopy(text);
    });
  }

  /**
   * Shows a temporary success state on the copy button.
   */
  function showCopySuccess(codeBlockEl) {
    const copyBtn = codeBlockEl.querySelector('.voltz-code-block__copy');
    if (!copyBtn) {
      return;
    }

    const labelEl = copyBtn.querySelector('.voltz-code-block__copy-label');
    const originalText = labelEl ? labelEl.textContent : '';

    copyBtn.classList.add('voltz-code-block__copy--success');
    if (labelEl) {
      labelEl.textContent = 'Copied!';
    }

    setTimeout(() => {
      copyBtn.classList.remove('voltz-code-block__copy--success');
      if (labelEl) {
        labelEl.textContent = originalText;
      }
    }, 2000);
  }

  /**
   * Fallback copy method for browsers without clipboard API.
   */
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  /**
   * Generates line number elements for the code block.
   */
  function generateLineNumbers(codeBlockEl) {
    const codeEl = codeBlockEl.querySelector('.voltz-code-block__code');
    const linesContainer = codeBlockEl.querySelector('.voltz-code-block__lines');
    if (!codeEl || !linesContainer) {
      return;
    }

    const text = codeEl.textContent || '';
    const lineCount = text.split('\n').length;

    linesContainer.textContent = '';
    for (let i = 1; i <= lineCount; i++) {
      const span = document.createElement('span');
      span.className = 'voltz-code-block__line-number';
      span.textContent = String(i);
      linesContainer.appendChild(span);
    }
  }

  /**
   * Applies highlighting to specified line numbers.
   */
  function highlightLines(codeBlockEl) {
    const highlightAttr = codeBlockEl.dataset.highlightLines;
    if (!highlightAttr) {
      return;
    }

    const lineNums = parseLineNumbers(highlightAttr);
    const codeEl = codeBlockEl.querySelector('.voltz-code-block__code');
    if (!codeEl) {
      return;
    }

    const text = codeEl.textContent || '';
    const lines = text.split('\n');

    codeEl.textContent = '';
    lines.forEach((line, index) => {
      const span = document.createElement('span');
      span.textContent = line + (index < lines.length - 1 ? '\n' : '');
      if (lineNums.includes(index + 1)) {
        span.className = 'voltz-code-block__line--highlighted';
      }
      codeEl.appendChild(span);
    });
  }

  /**
   * Parses a comma-separated string of line numbers.
   */
  function parseLineNumbers(str) {
    return str.split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  /**
   * Binds the copy button click handler.
   */
  function bindCopyButton(codeBlockEl) {
    const copyBtn = codeBlockEl.querySelector('.voltz-code-block__copy');
    if (!copyBtn) {
      return;
    }

    copyBtn.addEventListener('click', () => {
      copyCode(codeBlockEl);
    });
  }

  /**
   * Initializes all code block components in the given root.
   */
  function init(root = document) {
    const blocks = root.querySelectorAll(
      '.voltz-code-block:not([data-initialized])'
    );
    blocks.forEach((blockEl) => {
      blockEl.dataset.initialized = 'true';

      bindCopyButton(blockEl);

      if (blockEl.classList.contains('voltz-code-block--line-numbers')) {
        generateLineNumbers(blockEl);
      }

      highlightLines(blockEl);
    });
  }

  return { init, copyCode };
})();

document.addEventListener('DOMContentLoaded', () => {
  VoltzCodeBlock.init();
});
