import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
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
    showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
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
