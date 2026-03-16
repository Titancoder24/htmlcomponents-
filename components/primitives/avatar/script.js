/**
 * Avatar Component - script.js
 * Purpose: Handles avatar image loading with graceful fallback to initials
 * or generic icon when the image fails to load. Manages the fallback
 * cascade: image -> initials -> icon -> generic silhouette.
 */

/**
 * Initializes all voltz-avatar elements within a given root.
 * @param {HTMLElement|Document} root - The root element to query within
 */
function initAvatars(root = document) {
  const avatars = root.querySelectorAll('.voltz-avatar');
  avatars.forEach(setupAvatar);
}

/**
 * Sets up image error handling for a single avatar.
 * @param {HTMLElement} avatar - The avatar element to initialize
 */
function setupAvatar(avatar) {
  if (avatar.dataset.voltzInit === 'true') return;
  avatar.dataset.voltzInit = 'true';

  const img = avatar.querySelector('.voltz-avatar__image');
  if (img) {
    img.addEventListener('error', handleImageError);
    img.addEventListener('load', handleImageLoad);
  }
}

/**
 * Handles image load failure by hiding the image and showing fallback.
 * @param {Event} event
 */
function handleImageError(event) {
  const img = event.currentTarget;
  img.style.display = 'none';

  const avatar = img.closest('.voltz-avatar');
  if (!avatar) return;

  showFallback(avatar);
}

/**
 * Handles successful image load.
 * @param {Event} event
 */
function handleImageLoad(event) {
  const img = event.currentTarget;
  img.style.display = '';

  const avatar = img.closest('.voltz-avatar');
  if (!avatar) return;

  hideFallbacks(avatar);
}

/**
 * Shows the appropriate fallback content (initials, icon, or generic).
 * @param {HTMLElement} avatar
 */
function showFallback(avatar) {
  const initials = avatar.querySelector('.voltz-avatar__initials');
  const icon = avatar.querySelector('.voltz-avatar__icon');
  const fallback = avatar.querySelector('.voltz-avatar__fallback');

  if (initials) {
    initials.style.display = 'flex';
  } else if (icon) {
    icon.style.display = 'flex';
  } else if (fallback) {
    fallback.style.display = 'flex';
  }
}

/**
 * Hides all fallback content when image is available.
 * @param {HTMLElement} avatar
 */
function hideFallbacks(avatar) {
  const initials = avatar.querySelector('.voltz-avatar__initials');
  const icon = avatar.querySelector('.voltz-avatar__icon');
  const fallback = avatar.querySelector('.voltz-avatar__fallback');

  if (initials) initials.style.display = 'none';
  if (icon) icon.style.display = 'none';
  if (fallback) fallback.style.display = 'none';
}

/**
 * Sets the avatar image source programmatically with fallback handling.
 * @param {HTMLElement} avatar - The avatar element
 * @param {string} src - The image URL
 */
function setAvatarImage(avatar, src) {
  let img = avatar.querySelector('.voltz-avatar__image');
  if (!img) {
    img = document.createElement('img');
    img.className = 'voltz-avatar__image';
    img.addEventListener('error', handleImageError);
    img.addEventListener('load', handleImageLoad);
    avatar.prepend(img);
  }
  img.src = src;
  img.style.display = '';
}

/**
 * Observe DOM for dynamically added avatars.
 */
function observeAvatars() {
  const observer = new MutationObserver(function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.classList?.contains('voltz-avatar')) {
          setupAvatar(node);
        }
        const nested = node.querySelectorAll?.('.voltz-avatar');
        if (nested) nested.forEach(setupAvatar);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

/* Auto-initialize when DOM is ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initAvatars();
      observeAvatars();
    });
  } else {
    initAvatars();
    observeAvatars();
  }
}

export { initAvatars, setupAvatar, setAvatarImage, observeAvatars };
