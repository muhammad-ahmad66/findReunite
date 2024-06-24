// loader.js

const LoaderModule = (() => {
  const loaderId = 'dynamic-loader';
  const contentId = 'content';

  let loaderElement;

  function createLoader() {
    loaderElement = document.createElement('div');
    loaderElement.id = loaderId;
    loaderElement.classList.add('loader', 'hidden');
    loaderElement.innerHTML = `
          <style>
              .loader {
                  position: fixed;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  border: 16px solid #f3f3f3;
                  border-radius: 50%;
                  border-top: 16px solid #55c57a;
                  width: 120px;
                  height: 120px;
                  animation: spin 2s linear infinite;
                  z-index: 9999;
              }

              @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
              }

              .hidden {
                  display: none;
              }
          </style>
      `;
    document.body.appendChild(loaderElement);
    console.log('Loader created:', loaderElement);
  }

  function showLoader() {
    if (!loaderElement) {
      console.error('Loader element is not initialized.');
      return;
    }
    loaderElement.classList.remove('hidden');
    const content = document.getElementById(contentId);
    if (content) {
      content.classList.add('hidden');
    } else {
      console.warn(`Content element with ID '${contentId}' not found.`);
    }
  }

  function hideLoader() {
    if (!loaderElement) {
      console.error('Loader element is not initialized.');
      return;
    }
    loaderElement.classList.add('hidden');
    const content = document.getElementById(contentId);
    if (content) {
      content.classList.remove('hidden');
    } else {
      console.warn(`Content element with ID '${contentId}' not found.`);
    }
  }

  // Initialize the loader when the module is imported
  document.addEventListener('DOMContentLoaded', () => {
    createLoader();
  });

  return {
    showLoader,
    hideLoader,
  };
})();

export default LoaderModule;
