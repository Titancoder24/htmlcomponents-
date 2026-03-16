/*
 * FAQ Section Component Script
 * Purpose: Handles accordion toggle, search/filter, and category filtering.
 * No innerHTML, no eval, no inline handlers.
 */

(function () {
  'use strict';

  function initFaq(section) {
    initToggles(section);
    initSearch(section);
    initCategories(section);
  }

  function initToggles(section) {
    var toggles = section.querySelectorAll('[data-faq-toggle]');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        handleToggle(section, toggle);
      });
    });
  }

  function handleToggle(section, toggle) {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    var answer = toggle.parentElement.querySelector('.voltz-faq__answer');

    if (!expanded) {
      closeAllItems(section);
    }

    toggle.setAttribute('aria-expanded', String(!expanded));
    answer.hidden = expanded;
  }

  function closeAllItems(section) {
    var toggles = section.querySelectorAll('[data-faq-toggle]');
    toggles.forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      var ans = t.parentElement.querySelector('.voltz-faq__answer');
      if (ans) ans.hidden = true;
    });
  }

  function initSearch(section) {
    var searchInput = section.querySelector('[data-faq-search]');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      filterBySearch(section, searchInput.value.toLowerCase());
    });
  }

  function filterBySearch(section, query) {
    var items = section.querySelectorAll('[data-faq-item]');
    var noResults = section.querySelector('[data-faq-no-results]');
    var visible = 0;

    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = !query || text.indexOf(query) !== -1;
      item.classList.toggle('voltz-faq__item--hidden', !match);
      if (match) visible++;
    });

    if (noResults) noResults.hidden = visible > 0;
  }

  function initCategories(section) {
    var buttons = section.querySelectorAll('[data-faq-category]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterByCategory(section, buttons, btn);
      });
    });
  }

  function filterByCategory(section, buttons, activeBtn) {
    var category = activeBtn.getAttribute('data-faq-category');

    buttons.forEach(function (b) {
      b.classList.remove('voltz-faq__category--active');
      b.setAttribute('aria-selected', 'false');
    });
    activeBtn.classList.add('voltz-faq__category--active');
    activeBtn.setAttribute('aria-selected', 'true');

    var items = section.querySelectorAll('[data-faq-item]');
    items.forEach(function (item) {
      var itemCat = item.getAttribute('data-category');
      var show = category === 'all' || itemCat === category;
      item.classList.toggle('voltz-faq__item--hidden', !show);
    });
  }

  function init() {
    var sections = document.querySelectorAll('[data-component="faq-section"]');
    sections.forEach(initFaq);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
