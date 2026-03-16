/* Table of Contents Component Script */
/* Auto-generates TOC from headings, highlights active section on scroll */

function initTableOfContents(root) {
  var selector = root.getAttribute('data-selector') || 'h2, h3, h4';
  var offset = parseInt(root.getAttribute('data-offset'), 10) || 80;
  var list = root.querySelector('.voltz-toc__list');
  if (!list) return;

  var headings = [];
  var links = [];

  function generateId(text, index) {
    var slug = text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return slug || 'section-' + index;
  }

  function getLevel(heading) {
    return parseInt(heading.tagName.charAt(1), 10);
  }

  function buildToc() {
    var elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    var fragment = document.createDocumentFragment();

    elements.forEach(function (heading, index) {
      if (!heading.id) {
        heading.id = generateId(heading.textContent, index);
      }
      headings.push(heading);

      var level = getLevel(heading);
      var li = document.createElement('li');
      li.className = 'voltz-toc__item voltz-toc__item--level-' + level;

      var a = document.createElement('a');
      a.className = 'voltz-toc__link';
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      a.setAttribute('aria-current', 'false');

      li.appendChild(a);
      fragment.appendChild(li);
      links.push(a);
    });

    list.appendChild(fragment);
  }

  function getActiveHeading() {
    var scrollY = window.scrollY + offset + 1;
    var active = null;

    for (var i = 0; i < headings.length; i++) {
      if (headings[i].offsetTop <= scrollY) {
        active = i;
      }
    }
    return active;
  }

  function updateActive() {
    var activeIndex = getActiveHeading();

    links.forEach(function (link, index) {
      var isCurrent = index === activeIndex;
      link.setAttribute('aria-current', String(isCurrent));
    });
  }

  function handleClick(event) {
    var link = event.target.closest('.voltz-toc__link');
    if (!link) return;

    event.preventDefault();
    var targetId = link.getAttribute('href').slice(1);
    var target = document.getElementById(targetId);
    if (!target) return;

    var top = target.offsetTop - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      var index = links.indexOf(event.target);
      var next;
      if (event.key === 'ArrowDown') {
        next = links[(index + 1) % links.length];
      } else {
        next = links[(index - 1 + links.length) % links.length];
      }
      next.focus();
    }
  }

  buildToc();

  var scrollTimer = null;
  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = requestAnimationFrame(function () {
      updateActive();
      scrollTimer = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  list.addEventListener('click', handleClick);
  list.addEventListener('keydown', handleKeydown);

  updateActive();

  return function destroy() {
    window.removeEventListener('scroll', onScroll);
    list.removeEventListener('click', handleClick);
    list.removeEventListener('keydown', handleKeydown);
  };
}

document.querySelectorAll('.voltz-toc').forEach(initTableOfContents);
