import axios from 'axios';
import { showAlert } from './alerts';

export const searchPersonByName = async (name) => {
  try {
    window.setTimeout(() => {
      // location.assign('/');
      // Redirect to the search-person page with the name included in the URL

      name = name.toLowerCase();
      window.location.href = `/search-person/${name}`;
    }, 500);
    // // }
    // console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
