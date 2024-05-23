import axios from 'axios';
import { showAlert } from './alerts';

export const missingForm = async (data) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:800/api/v1/missing-persons',
      data,
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    showAlert('success', 'Data Inserted successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
