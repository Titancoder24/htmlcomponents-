/*
 * CTA Split Component Script
 * Purpose: Handles form submission with validation and success state display.
 * No innerHTML, no eval, no inline handlers.
 */

(function () {
  'use strict';

  function initCtaSplit(section) {
    const form = section.querySelector('[data-cta-form]');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!validateForm(form)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    simulateSubmission(form, submitBtn);
  }

  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let valid = true;

    inputs.forEach(function (input) {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });

    return valid;
  }

  function simulateSubmission(form, submitBtn) {
    setTimeout(function () {
      showSuccessState(form, submitBtn);
    }, 1000);
  }

  function showSuccessState(form, submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submitted!';
    submitBtn.style.background = '#10b981';

    const inputs = form.querySelectorAll('input');
    inputs.forEach(function (input) {
      input.value = '';
    });

    setTimeout(function () {
      submitBtn.textContent = 'Get Started';
      submitBtn.style.background = '';
    }, 3000);
  }

  function init() {
    const sections = document.querySelectorAll('[data-component="cta-split"]');
    sections.forEach(initCtaSplit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
