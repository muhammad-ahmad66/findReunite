import axios from 'axios';
import { showAlert } from './alerts';
import { showPreloader, hidePreloader } from './loader';

const loginForm = document.getElementById('login-form');
let formContent;
if (loginForm) formContent = loginForm.innerHTML; // Save the original form content

export const login = async (email, password) => {
  try {
    showPreloader(loginForm);
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:800/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    hidePreloader(loginForm, formContent);
    showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 500);
    // }
    console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
    signupForm.innerHTML = formContent;
    hidePreloader(loginForm, formContent);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:800/api/v1/users/logout',
    });
    location.reload(true);
    location.href = '/';
  } catch (err) {
    showAlert('error', 'Error logging out! Please try again.');
  }
};
