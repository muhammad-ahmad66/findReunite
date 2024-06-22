import axios from 'axios';
import { showAlert } from './alerts';
import { showPreloader, hidePreloader } from './loader';

const missingFormEl = document.querySelector('#missing-form-container');
let originalContent;
if (missingFormEl) originalContent = missingFormEl.innerHTML;

export const missingForm = async (data) => {
  try {
    showPreloader(missingFormEl);
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:800/api/v1/missing-persons',
      data,
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    showAlert('success', 'Data Inserted successfully!');
    hidePreloader(missingFormEl, originalContent);
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    hidePreloader(missingFormEl, originalContent);
    showAlert('error', err.response.data.message);
  }
};
