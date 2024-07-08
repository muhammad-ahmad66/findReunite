import { showAlert } from './alerts';
import axios from 'axios';

export const roleManagement = async (role, userId) => {
  try {
    const response = await axios.patch(`/api/v1/users/assignRole/${userId}`, {
      role,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'User has been Updated successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      showAlert('error', response.data.message);
    }
  } catch (error) {
    showAlert('error', 'Something went wrong while updating');
    console.log(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/api/v1/users/deleteUser/${userId}`);

    if (response.status === 204) {
      showAlert('success', 'User has been deleted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      showAlert('error', 'Failed to delete user.');
    }
  } catch (error) {
    showAlert('error', 'Something went wrong while deleting the user.');
  }
};
