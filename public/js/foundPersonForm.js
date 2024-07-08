import axios from 'axios';
import { showAlert } from './alerts';
import { showPreloader, hidePreloader } from './loader';

const foundPersonEl = document.querySelector('#found-person-form-container');
let originalContent;
if (foundPersonEl) originalContent = foundPersonEl.innerHTML;

export const foundForm = async (data) => {
  try {
    showPreloader(foundPersonEl);
    const result = await axios({
      method: 'POST',
      // url: 'http://127.0.0.1:800/api/v1/persons',
      url: '/api/v1/persons', // now using relative url. b/c our website and api are at same server
      data,
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    showAlert('success', 'Data Inserted successfully!');
    hidePreloader(foundPersonEl, originalContent);
    window.setTimeout(() => {
      location.assign('/search-person');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    hidePreloader(foundPersonEl, originalContent);
    showAlert('error', err.response.data.message);
  }
};
