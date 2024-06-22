import axios from 'axios';
import { showAlert } from './alerts';
import { showPreloader, hidePreloader } from './loader';

const signupForm = document.getElementById('signup-form');

let formContent;

if (signupForm) formContent = signupForm.innerHTML; // Save the original form content

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
    showPreloader(signupForm);
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
    hidePreloader(signupForm, formContent);
    window.setTimeout(() => {
      location.assign('/');
    }, 500);
    console.log(result);
  } catch (err) {
    hidePreloader(signupForm, formContent);
    showAlert('error', err.response.data.message);
  }
};
