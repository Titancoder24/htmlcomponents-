/**
 * FileUpload Component - script.js
 * Purpose: Manages drag-and-drop file handling, click-to-browse, file validation,
 * preview list rendering with remove functionality, and custom event dispatch.
 */

/**
 * Initializes all file upload components within a root element.
 * @param {HTMLElement|Document} root - The root element to search within
 */
function initFileUploads(root = document) {
  var uploads = root.querySelectorAll('[data-voltz-file-upload]');
  uploads.forEach(function setup(el) {
    if (el.dataset.voltzFileUploadInit) {
      return;
    }
    el.dataset.voltzFileUploadInit = 'true';
    setupFileUpload(el);
  });
}

/**
 * Sets up event listeners for a single file upload component.
 * @param {HTMLElement} container - The file upload container element
 */
function setupFileUpload(container) {
  var dropzone = container.querySelector('[data-voltz-file-upload-dropzone]');
  var input = container.querySelector('[data-voltz-file-upload-input]');
  var previewList = container.querySelector('[data-voltz-file-upload-preview]');

  if (!dropzone || !input) {
    return;
  }

  container._files = [];

  dropzone.addEventListener('click', function onClick() {
    input.click();
  });

  dropzone.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      input.click();
    }
  });

  input.addEventListener('change', function onChange() {
    handleFiles(container, input.files, previewList);
    input.value = '';
  });

  setupDragDrop(container, dropzone, previewList);
}

/**
 * Sets up drag-and-drop event listeners on the dropzone.
 * @param {HTMLElement} container - The file upload container
 * @param {HTMLElement} dropzone - The dropzone element
 * @param {HTMLElement} previewList - The preview list element
 */
function setupDragDrop(container, dropzone, previewList) {
  var dragCounter = 0;

  dropzone.addEventListener('dragenter', function onDragEnter(e) {
    e.preventDefault();
    dragCounter++;
    dropzone.classList.add('voltz-file-upload__dropzone--drag-over');
  });

  dropzone.addEventListener('dragleave', function onDragLeave(e) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      dropzone.classList.remove('voltz-file-upload__dropzone--drag-over');
    }
  });

  dropzone.addEventListener('dragover', function onDragOver(e) {
    e.preventDefault();
  });

  dropzone.addEventListener('drop', function onDrop(e) {
    e.preventDefault();
    dragCounter = 0;
    dropzone.classList.remove('voltz-file-upload__dropzone--drag-over');
    handleFiles(container, e.dataTransfer.files, previewList);
  });
}

/**
 * Processes selected files and updates the preview list.
 * @param {HTMLElement} container - The file upload container
 * @param {FileList} fileList - The selected files
 * @param {HTMLElement} previewList - The preview list element
 */
function handleFiles(container, fileList, previewList) {
  var isMultiple = container.dataset.multiple === 'true';
  var maxSize = parseInt(container.dataset.maxSize, 10) || 0;
  var newFiles = Array.from(fileList);

  if (maxSize > 0) {
    newFiles = newFiles.filter(function checkSize(f) {
      return f.size <= maxSize;
    });
  }

  if (isMultiple) {
    container._files = container._files.concat(newFiles);
  } else {
    container._files = newFiles.slice(0, 1);
  }

  renderPreviews(container, previewList);
  dispatchFilesEvent(container);
}

/**
 * Renders the file preview list items.
 * @param {HTMLElement} container - The file upload container
 * @param {HTMLElement} previewList - The preview list element
 */
function renderPreviews(container, previewList) {
  while (previewList.firstChild) {
    previewList.removeChild(previewList.firstChild);
  }

  container._files.forEach(function renderItem(file, index) {
    var li = document.createElement('li');
    li.className = 'voltz-file-upload__preview-item';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'voltz-file-upload__preview-name';
    nameSpan.textContent = file.name;

    var sizeSpan = document.createElement('span');
    sizeSpan.className = 'voltz-file-upload__preview-size';
    sizeSpan.textContent = formatFileSize(file.size);

    var removeBtn = document.createElement('button');
    removeBtn.className = 'voltz-file-upload__preview-remove';
    removeBtn.type = 'button';
    removeBtn.setAttribute('aria-label', 'Remove ' + file.name);
    removeBtn.dataset.index = String(index);
    removeBtn.textContent = '\u00D7';

    removeBtn.addEventListener('click', function onRemove() {
      removeFile(container, index, previewList);
    });

    li.appendChild(nameSpan);
    li.appendChild(sizeSpan);
    li.appendChild(removeBtn);
    previewList.appendChild(li);
  });
}

/**
 * Formats a file size in bytes to a human-readable string.
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
  if (bytes === 0) { return '0 B'; }
  var units = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  var size = (bytes / Math.pow(1024, i)).toFixed(1);
  return size + ' ' + units[i];
}

/**
 * Removes a file from the list and re-renders previews.
 * @param {HTMLElement} container - The file upload container
 * @param {number} index - Index of the file to remove
 * @param {HTMLElement} previewList - The preview list element
 */
function removeFile(container, index, previewList) {
  var removed = container._files.splice(index, 1)[0];
  renderPreviews(container, previewList);

  container.dispatchEvent(new CustomEvent('voltz-file-removed', {
    bubbles: true,
    detail: { file: removed, index: index }
  }));
}

/**
 * Dispatches the files-selected custom event.
 * @param {HTMLElement} container - The file upload container
 */
function dispatchFilesEvent(container) {
  container.dispatchEvent(new CustomEvent('voltz-files-selected', {
    bubbles: true,
    detail: { files: container._files.slice() }
  }));
}

/* Auto-initialize on DOM ready */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      initFileUploads();
    });
  } else {
    initFileUploads();
  }
}
