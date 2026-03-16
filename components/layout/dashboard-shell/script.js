/*
 * Dashboard Shell Component - script.js
 * Purpose: Handles sidebar toggle and overlay dismiss for dashboard layout.
 * No innerHTML, no eval, no inline handlers.
 */

/**
 * Initialize all dashboard shell components on the page.
 */
function initDashboardShells() {
  const shells = document.querySelectorAll(".voltz-dashboard-shell");
  shells.forEach(initSingleDashboardShell);
}

/**
 * Initialize a single dashboard shell instance.
 * @param {HTMLElement} shell - The dashboard shell root element.
 */
function initSingleDashboardShell(shell) {
  const menuBtn = shell.querySelector(".voltz-dashboard-shell__menu-btn");
  const overlay = shell.querySelector(".voltz-dashboard-shell__overlay");

  if (menuBtn) {
    menuBtn.addEventListener("click", function handleMenuClick() {
      toggleDashboardSidebar(shell, menuBtn);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function handleOverlayClick() {
      closeDashboardSidebar(shell, menuBtn);
    });
  }
}

/**
 * Toggle the sidebar open/closed state.
 * @param {HTMLElement} shell - The dashboard shell root element.
 * @param {HTMLButtonElement} menuBtn - The menu toggle button.
 */
function toggleDashboardSidebar(shell, menuBtn) {
  const isOpen = shell.getAttribute("data-sidebar-open") === "true";
  const newState = !isOpen;

  shell.setAttribute("data-sidebar-open", String(newState));
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", String(newState));
  }
}

/**
 * Close the sidebar.
 * @param {HTMLElement} shell - The dashboard shell root element.
 * @param {HTMLButtonElement} menuBtn - The menu toggle button.
 */
function closeDashboardSidebar(shell, menuBtn) {
  shell.setAttribute("data-sidebar-open", "false");
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
  }
}

/* === Auto-initialize on DOM ready === */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboardShells);
} else {
  initDashboardShells();
}
