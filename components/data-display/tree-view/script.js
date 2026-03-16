/**
 * Tree View Component Script
 * Purpose: Handles expand/collapse toggling, keyboard navigation
 * (ArrowUp/Down/Left/Right, Enter, Space), and checkbox selection
 * for the tree view component.
 */

(function () {
  'use strict';

  /**
   * Initialize a single tree view.
   * @param {HTMLElement} tree - The .voltz-tree-view element.
   */
  function initTreeView(tree) {
    attachToggleListeners(tree);
    attachKeyboardNav(tree);
    attachCheckboxListeners(tree);
  }

  /**
   * Attach click handlers to all toggle buttons.
   * @param {HTMLElement} tree - The tree view element.
   */
  function attachToggleListeners(tree) {
    tree.addEventListener('click', function (e) {
      var toggle = e.target.closest('.voltz-tree-view__toggle');
      if (!toggle) return;
      var node = toggle.closest('.voltz-tree-view__node');
      if (node) {
        toggleNode(node);
      }
    });

    tree.addEventListener('click', function (e) {
      var content = e.target.closest('.voltz-tree-view__node-content');
      if (!content) return;
      if (e.target.closest('.voltz-tree-view__toggle')) return;
      if (e.target.closest('.voltz-tree-view__checkbox')) return;
      var node = content.closest('.voltz-tree-view__node');
      if (node) {
        selectNode(tree, node);
      }
    });
  }

  /**
   * Toggle expand/collapse state of a node.
   * @param {HTMLElement} node - The tree node element.
   */
  function toggleNode(node) {
    var expanded = node.getAttribute('aria-expanded');
    if (expanded === null) return;
    var isExpanded = expanded === 'true';
    node.setAttribute('aria-expanded', String(!isExpanded));
  }

  /**
   * Select a node in the tree.
   * @param {HTMLElement} tree - The tree view element.
   * @param {HTMLElement} node - The node to select.
   */
  function selectNode(tree, node) {
    var multi = tree.getAttribute('aria-multiselectable') === 'true';
    if (!multi) {
      var allNodes = tree.querySelectorAll('.voltz-tree-view__node');
      allNodes.forEach(function (n) {
        n.setAttribute('aria-selected', 'false');
      });
    }
    var current = node.getAttribute('aria-selected') === 'true';
    node.setAttribute('aria-selected', String(!current));
    node.focus();
  }

  /**
   * Attach keyboard navigation to the tree.
   * @param {HTMLElement} tree - The tree view element.
   */
  function attachKeyboardNav(tree) {
    tree.addEventListener('keydown', function (e) {
      var node = e.target.closest('.voltz-tree-view__node');
      if (!node) return;
      handleKeydown(e, tree, node);
    });
  }

  /**
   * Handle keydown events for tree navigation.
   * @param {KeyboardEvent} e - The keydown event.
   * @param {HTMLElement} tree - The tree view element.
   * @param {HTMLElement} node - The currently focused node.
   */
  function handleKeydown(e, tree, node) {
    var key = e.key;
    var handled = true;

    if (key === 'ArrowDown') {
      focusNextNode(tree, node);
    } else if (key === 'ArrowUp') {
      focusPrevNode(tree, node);
    } else if (key === 'ArrowRight') {
      handleArrowRight(node);
    } else if (key === 'ArrowLeft') {
      handleArrowLeft(tree, node);
    } else if (key === 'Enter' || key === ' ') {
      selectNode(tree, node);
    } else {
      handled = false;
    }

    if (handled) {
      e.preventDefault();
    }
  }

  /**
   * Handle ArrowRight: expand if collapsed, or focus first child.
   * @param {HTMLElement} node - The current node.
   */
  function handleArrowRight(node) {
    var expanded = node.getAttribute('aria-expanded');
    if (expanded === 'false') {
      node.setAttribute('aria-expanded', 'true');
    } else if (expanded === 'true') {
      var firstChild = node.querySelector(
        '.voltz-tree-view__children > .voltz-tree-view__node'
      );
      if (firstChild) firstChild.focus();
    }
  }

  /**
   * Handle ArrowLeft: collapse if expanded, or focus parent.
   * @param {HTMLElement} tree - The tree view element.
   * @param {HTMLElement} node - The current node.
   */
  function handleArrowLeft(tree, node) {
    var expanded = node.getAttribute('aria-expanded');
    if (expanded === 'true') {
      node.setAttribute('aria-expanded', 'false');
    } else {
      var parentGroup = node.closest('.voltz-tree-view__children');
      if (parentGroup) {
        var parentNode = parentGroup.closest('.voltz-tree-view__node');
        if (parentNode) parentNode.focus();
      }
    }
  }

  /**
   * Focus the next visible tree node.
   * @param {HTMLElement} tree - The tree view element.
   * @param {HTMLElement} current - The current node.
   */
  function focusNextNode(tree, current) {
    var visibleNodes = getVisibleNodes(tree);
    var idx = visibleNodes.indexOf(current);
    if (idx < visibleNodes.length - 1) {
      visibleNodes[idx + 1].focus();
    }
  }

  /**
   * Focus the previous visible tree node.
   * @param {HTMLElement} tree - The tree view element.
   * @param {HTMLElement} current - The current node.
   */
  function focusPrevNode(tree, current) {
    var visibleNodes = getVisibleNodes(tree);
    var idx = visibleNodes.indexOf(current);
    if (idx > 0) {
      visibleNodes[idx - 1].focus();
    }
  }

  /**
   * Get all visible (not hidden by collapsed parents) tree nodes.
   * @param {HTMLElement} tree - The tree view element.
   * @returns {HTMLElement[]} Array of visible nodes.
   */
  function getVisibleNodes(tree) {
    var all = Array.from(
      tree.querySelectorAll('.voltz-tree-view__node')
    );
    return all.filter(function (node) {
      return isNodeVisible(node, tree);
    });
  }

  /**
   * Check if a node is visible (all ancestors expanded).
   * @param {HTMLElement} node - The node to check.
   * @param {HTMLElement} tree - The tree root.
   * @returns {boolean} Whether the node is visible.
   */
  function isNodeVisible(node, tree) {
    var parent = node.parentElement;
    while (parent && parent !== tree) {
      if (parent.classList.contains('voltz-tree-view__children')) {
        var parentNode = parent.closest('.voltz-tree-view__node');
        if (parentNode && parentNode.getAttribute('aria-expanded') !== 'true') {
          return false;
        }
      }
      parent = parent.parentElement;
    }
    return true;
  }

  /**
   * Attach checkbox change listeners for tree selection.
   * @param {HTMLElement} tree - The tree view element.
   */
  function attachCheckboxListeners(tree) {
    tree.addEventListener('change', function (e) {
      if (!e.target.classList.contains('voltz-tree-view__checkbox')) return;
      var node = e.target.closest('.voltz-tree-view__node');
      if (!node) return;
      var checked = e.target.checked;
      propagateCheckDown(node, checked);
    });
  }

  /**
   * Propagate checkbox state to child nodes.
   * @param {HTMLElement} node - The parent node.
   * @param {boolean} checked - The checked state to apply.
   */
  function propagateCheckDown(node, checked) {
    var childCbs = node.querySelectorAll('.voltz-tree-view__checkbox');
    childCbs.forEach(function (cb) {
      cb.checked = checked;
    });
  }

  /** Initialize all tree views on the page. */
  function initAll() {
    var trees = document.querySelectorAll('.voltz-tree-view');
    trees.forEach(initTreeView);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
