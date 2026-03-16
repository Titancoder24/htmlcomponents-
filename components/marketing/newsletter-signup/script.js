/*
 * Newsletter Signup Component Script
 * Purpose: Handles email validation, form submission, and success/error states.
 * No innerHTML, no eval, no inline handlers.
 */

(function () {
  'use strict';

  function initNewsletter(section) {
    var form = section.querySelector('[data-newsletter-form]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSubmit(section, form);
    });
  }

  function handleSubmit(section, form) {
    var input = form.querySelector('.voltz-newsletter__input');
    var errorEl = form.querySelector('[data-newsletter-error]');
    var email = input.value.trim();

    clearError(errorEl);

    if (!isValidEmail(email)) {
      showError(errorEl, 'Please enter a valid email address.');
      input.focus();
      return;
    }

    var btn = form.querySelector('.voltz-newsletter__btn');
    btn.disabled = true;
    btn.textContent = 'Subscribing...';

    simulateSubscribe(section, form, btn);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(errorEl, message) {
    errorEl.textContent = message;
  }

  function clearError(errorEl) {
    errorEl.textContent = '';
  }

  function simulateSubscribe(section, form, btn) {
    setTimeout(function () {
      form.hidden = true;
      var successEl = section.querySelector('[data-newsletter-success]');
      successEl.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Subscribe';
    }, 1200);
  }

  function init() {
    var sections = document.querySelectorAll(
      '[data-component="newsletter-signup"]'
    );
    sections.forEach(initNewsletter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
