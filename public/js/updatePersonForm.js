import axios from 'axios';
import { showAlert } from './alerts';

export const updatePerson = async (data) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: `/api/v1/persons/${personId}`,
    });

    // from our api
    // if (res.data.status === 'success') {
    // alert('Logged in successfully');
    showAlert('success', 'Data Updated successfully!');
    window.setTimeout(() => {
      location.assign('/update-person');
    }, 1500);
    // }
    console.log(result);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
