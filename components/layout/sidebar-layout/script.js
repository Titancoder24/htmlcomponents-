/*
 * Sidebar Layout Component - script.js
 * Purpose: Handles sidebar toggle/collapse functionality on mobile.
 * No innerHTML, no eval, no inline handlers.
 */

/**
 * Initialize all sidebar layout components on the page.
 * Attaches toggle event listeners for mobile collapse behavior.
 */
function initSidebarLayouts() {
  const layouts = document.querySelectorAll(".voltz-sidebar-layout");
  layouts.forEach(initSingleSidebarLayout);
}

/**
 * Initialize a single sidebar layout instance.
 * @param {HTMLElement} layout - The sidebar layout root element.
 */
function initSingleSidebarLayout(layout) {
  const toggle = layout.querySelector(".voltz-sidebar-layout__toggle");
  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", function handleToggleClick() {
    toggleSidebar(layout, toggle);
  });
}

/**
 * Toggle the collapsed state of the sidebar.
 * @param {HTMLElement} layout - The sidebar layout root element.
 * @param {HTMLButtonElement} toggle - The toggle button element.
 */
function toggleSidebar(layout, toggle) {
  const isCollapsed = layout.getAttribute("data-collapsed") === "true";
  const newState = !isCollapsed;

  layout.setAttribute("data-collapsed", String(newState));
  toggle.setAttribute("aria-expanded", String(!newState));
}

/* === Auto-initialize on DOM ready === */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarLayouts);
} else {
  initSidebarLayouts();
}
