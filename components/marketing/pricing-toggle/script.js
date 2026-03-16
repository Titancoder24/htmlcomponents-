/**
 * Pricing Toggle Component Script
 * Handles monthly/yearly toggle with animated price transitions.
 * No innerHTML, no eval, no inline handlers.
 */

(function pricingToggleInit() {
  "use strict";

  /**
   * Initializes a single pricing-toggle component.
   * Binds toggle buttons to update displayed prices.
   */
  function initPricingToggle(section) {
    var switchContainer = section.querySelector(
      ".voltz-pricing-toggle__switch"
    );
    var options = section.querySelectorAll(".voltz-pricing-toggle__option");
    var amounts = section.querySelectorAll(".voltz-pricing-toggle__amount");

    if (!switchContainer || options.length === 0) return;

    options.forEach(function bindOption(option) {
      option.addEventListener("click", function handleClick() {
        var period = option.getAttribute("data-period");
        setActivePeriod(section, switchContainer, options, amounts, period);
      });
    });
  }

  /**
   * Sets the active billing period and animates price changes.
   */
  function setActivePeriod(section, sw, options, amounts, period) {
    sw.setAttribute("data-active", period);

    options.forEach(function updateOption(opt) {
      var isActive = opt.getAttribute("data-period") === period;
      opt.classList.toggle("voltz-pricing-toggle__option--active", isActive);
      opt.setAttribute("aria-pressed", String(isActive));
    });

    animatePrices(amounts, period);
  }

  /**
   * Animates price amount transitions with fade effect.
   */
  function animatePrices(amounts, period) {
    amounts.forEach(function animateAmount(el) {
      el.classList.add("is-changing");

      setTimeout(function updateValue() {
        var newValue = el.getAttribute("data-" + period);
        if (newValue !== null) {
          el.textContent = newValue;
        }
        el.classList.remove("is-changing");
      }, 200);
    });
  }

  /**
   * Discovers and initializes all pricing-toggle components.
   */
  function initAll() {
    var sections = document.querySelectorAll(
      '[data-component="pricing-toggle"]'
    );
    sections.forEach(initPricingToggle);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
