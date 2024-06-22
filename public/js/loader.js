export const showPreloader = function (el) {
  const elHeight = el.offsetHeight; // Calculate the height of the signup form

  el.innerHTML = `<div id="preloader" class="loader"></div>`;
  el.classList.add('preloader-box');
  el.style.height = `${elHeight}px`; // Set the height of the form to the height of the loader
};

export const hidePreloader = (el, formContent) => {
  el.innerHTML = formContent; // Restore the original form content
  el.classList.remove('preloader-box');
};
