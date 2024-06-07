import axios from 'axios';
import { showAlert } from './alerts';

const signupForm = document.getElementById('signup-btn');
function showPreloader() {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = '<div class="loader"></div>';
  signupForm.innerHTML = '';
  signupForm.appendChild(preloader);
}

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.remove();
    signupForm.innerHTML = 'Sign Up';
  }
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

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    hidePreloader();
    showAlert('success', 'Sig up successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    hidePreloader();
    showAlert('error', err.response.data.message);
  }
};
