/**
 * Settings Panel Component Script
 * Handles toggle switches, form dirty state tracking,
 * and save/cancel button actions.
 */

function initSettingsPanel(root) {
  const panel = root.querySelector('.voltz-settings-panel');
  if (!panel) return;

  setupToggles(panel);
  setupActions(panel);
  setupDirtyTracking(panel);
}

function setupToggles(panel) {
  const toggles = panel.querySelectorAll('.voltz-settings-panel__toggle');

  toggles.forEach(function attachToggle(toggle) {
    toggle.addEventListener('click', function handleToggle() {
      const isActive = toggle.classList.toggle('voltz-settings-panel__toggle--active');
      toggle.setAttribute('aria-checked', String(isActive));
      const setting = toggle.getAttribute('data-setting');
      panel.dispatchEvent(new CustomEvent('voltz:setting-change', {
        bubbles: true,
        detail: { setting: setting, value: isActive }
      }));
    });
  });
}

function setupActions(panel) {
  const saveBtn = panel.querySelector('[data-action="save"]');
  const cancelBtn = panel.querySelector('[data-action="cancel"]');

  if (saveBtn) {
    saveBtn.addEventListener('click', function handleSave() {
      const formData = collectFormData(panel);
      panel.dispatchEvent(new CustomEvent('voltz:settings-save', {
        bubbles: true,
        detail: formData
      }));
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function handleCancel() {
      panel.dispatchEvent(new CustomEvent('voltz:settings-cancel', {
        bubbles: true
      }));
    });
  }
}

function collectFormData(panel) {
  const data = {};
  const inputs = panel.querySelectorAll('.voltz-settings-panel__input');
  const selects = panel.querySelectorAll('.voltz-settings-panel__select');
  const toggles = panel.querySelectorAll('.voltz-settings-panel__toggle');

  inputs.forEach(function readInput(input) {
    data[input.id] = input.value;
  });

  selects.forEach(function readSelect(select) {
    data[select.id] = select.value;
  });

  toggles.forEach(function readToggle(toggle) {
    const key = toggle.getAttribute('data-setting');
    data[key] = toggle.getAttribute('aria-checked') === 'true';
  });

  return data;
}

function setupDirtyTracking(panel) {
  const inputs = panel.querySelectorAll(
    '.voltz-settings-panel__input, .voltz-settings-panel__select'
  );

  inputs.forEach(function trackInput(input) {
    input.addEventListener('input', function handleDirty() {
      panel.classList.add('voltz-settings-panel--dirty');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initSettingsPanel(document);
});
