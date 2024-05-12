import axios from 'axios';
import { showAlert } from './alerts';

export const searchPerson = async (name) => {
  try {
    window.setTimeout(() => {
      // location.assign('/');
      // Redirect to the search-person page with the name included in the URL

      name = name.toLowerCase();
      window.location.href = `http://127.0.0.1:800/search-person?firstName=${name}`;
    }, 500);
    // // }
    // console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
