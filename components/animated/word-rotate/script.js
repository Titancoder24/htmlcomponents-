/*
 * Word Rotate Component Script
 * Cycles through an array of words with animated transitions.
 * Manages enter/active/exit states for CSS transition classes.
 */

(function () {
  "use strict";

  function initWordRotate() {
    var elements = document.querySelectorAll("[data-voltz-word-rotate]");
    elements.forEach(setupRotation);
  }

  function setupRotation(element) {
    var wordsAttr = element.dataset.words || '["Hello", "World"]';
    var words = JSON.parse(wordsAttr);
    if (words.length === 0) return;

    var container = element.querySelector(".voltz-word-rotate__container");
    if (!container) return;

    var durationStr = getComputedStyle(element)
      .getPropertyValue("--voltz-word-rotate-duration").trim();
    var pauseStr = getComputedStyle(element)
      .getPropertyValue("--voltz-word-rotate-pause").trim();

    var transitionMs = parseFloat(durationStr) * 1000 || 500;
    var pauseMs = parseFloat(pauseStr) * 1000 || 2000;
    var currentIndex = 0;

    setWord(container, words[0]);
    updateContainerWidth(container, words[0]);

    setInterval(function () {
      rotateWord(container, words, currentIndex, transitionMs);
      currentIndex = (currentIndex + 1) % words.length;
    }, pauseMs + transitionMs);
  }

  function setWord(container, text) {
    var activeWord = container.querySelector(".voltz-word-rotate__word");
    if (activeWord) {
      activeWord.textContent = text;
    }
  }

  function updateContainerWidth(container, text) {
    var measure = document.createElement("span");
    measure.className = "voltz-word-rotate__word";
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.opacity = "1";
    measure.textContent = text;
    container.appendChild(measure);
    container.style.width = measure.offsetWidth + "px";
    container.removeChild(measure);
  }

  function rotateWord(container, words, index, transitionMs) {
    var nextIndex = (index + 1) % words.length;
    var currentWord = container.querySelector(
      ".voltz-word-rotate__word--active"
    );

    var newWord = document.createElement("span");
    newWord.className = "voltz-word-rotate__word voltz-word-rotate__word--enter";
    newWord.textContent = words[nextIndex];
    container.appendChild(newWord);

    updateContainerWidth(container, words[nextIndex]);

    if (currentWord) {
      currentWord.classList.remove("voltz-word-rotate__word--active");
      currentWord.classList.add("voltz-word-rotate__word--exit");
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        newWord.classList.remove("voltz-word-rotate__word--enter");
        newWord.classList.add("voltz-word-rotate__word--active");
      });
    });

    setTimeout(function () {
      if (currentWord && currentWord.parentNode) {
        currentWord.parentNode.removeChild(currentWord);
      }
    }, transitionMs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWordRotate);
  } else {
    initWordRotate();
  }
})();
