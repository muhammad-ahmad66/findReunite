import axios from 'axios';
import { showAlert } from './alerts';

const signupForm = document.getElementById('signup-form');

let formContent;

if (signupForm) formContent = signupForm.innerHTML; // Save the original form content

function showPreloader() {
  const formHeight = signupForm.offsetHeight; // Calculate the height of the signup form

  signupForm.innerHTML = `<div id="preloader" class="loader"></div>`;
  signupForm.classList.add('preloader-box');
  signupForm.style.height = `${formHeight}px`; // Set the height of the form to the height of the loader
}

function hidePreloader() {
  // signupForm.innerHTML = formContent; // Restore the original form content
  signupForm.classList.remove('preloader-box');
}

export const signup = async (
  name,
  email,
  contact,
  password,
  passwordConfirm,
  country,
  city,
) => {
  try {
    showPreloader();
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:800/api/v1/users/signup',
      data: {
        name,
        email,
        contact,
        password,
        passwordConfirm,
        country,
        city,
      },
    });

    showAlert('success', 'Sign up successfully!');
    window.setTimeout(() => {
      hidePreloader();
      location.assign('/');
    }, 500);
    console.log(result);
  } catch (err) {
    signupForm.innerHTML = formContent;
    hidePreloader();
    showAlert('error', err.response.data.message);
  }
};
