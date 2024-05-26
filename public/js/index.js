import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { foundForm } from './foundPersonForm';
import { searchPerson } from './searchPerson';
import { missingForm } from './missingPersonForm';
import { updatePerson } from './updatePersonForm';

// ! SELECTING ELEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const foundPersonForm = document.querySelector('.reported-form');
const missingPersonForm = document.querySelector('.missing-person-form');
const updatePersonForm = document.querySelector('.update-person-form');
const searchForm = document.querySelector('.nav__search');
const filterForm = document.querySelector('.nav__filter');

// UPDATE PERSON DETAIL

// Show the loader when the page starts loading
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'block'; // Display the loader

  console.log('loading....');
  // Hide the loader after 1 second
  setTimeout(() => {
    loader.style.display = 'none';
  }, 1000); // 1000 milliseconds = 1 second
});

// ! FOUND PERSON FORM. -IF SOMEONE FOUND A PERSON, SO TO INPUT THE PERSON'S DATA
if (foundPersonForm)
  foundPersonForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append('name', document.getElementById('name').value.toLowerCase());
    form.append(
      'gender',
      document.getElementById('gender').value.toLowerCase(),
    );
    form.append('approxAge', document.getElementById('approxAge').value);
    form.append(
      'UniqueIdentifier',
      document.getElementById('UniqueIdentifier').value,
    );
    form.append(
      'clothingDescription',
      document.getElementById('clothingDescription').value,
    );
    form.append('HairColor', document.getElementById('HairColor').value);
    form.append('photo', document.getElementById('photo').files[0]);
    form.append(
      'country',
      document.getElementById('country').value.toLowerCase(),
    );
    form.append('city', document.getElementById('city').value.toLowerCase());
    form.append('lastSeenDate', document.getElementById('lastSeenDate').value);
    form.append(
      'additionalDetails',
      document.getElementById('additionalDetails').value,
    );

    foundForm(form);
  });

if (missingPersonForm) {
  missingPersonForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value.toLowerCase());
    form.append(
      'gender',
      document.getElementById('gender').value.toLowerCase(),
    );
    form.append('age', document.getElementById('age').value.toLowerCase());
    form.append('contact', document.getElementById('contact').value);
    form.append('photo', document.getElementById('photo').files[0]);
    form.append(
      'location[country]',
      document.getElementById('country').value.toLowerCase(),
    );
    form.append(
      'location[city]',
      document.getElementById('city').value.toLowerCase(),
    );
    form.append('location[address]', document.getElementById('address').value);
    form.append(
      'additionalDetails',
      document.getElementById('additionalDetails').value,
    );

    missingForm(form);
  });
}

// ! LOGIN FORM
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// ! SIGNUP FORM
if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, contact, password, passwordConfirm, country, city);
  });

// ! LOGGING USER OUT
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// ! CHANGE USER DATA(NAME, PASSWORD, PHOTO) FROM ACCOUNT PAGE
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    console.log(form);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    updateSettings(form, 'data');
  });

// ! CHANGE PASSWORD FORM FROM USER-ACCOUNT PAGE
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// ! SEARCH BY NAME
if (searchForm)
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('search-person-name').value;

    // searchPerson(name);
    if (name)
      window.location.href = `http://127.0.0.1:800/search-person?name=${name}`;
    else window.location.href = `http://127.0.0.1:800/search-person`;
  });

// ! ADDING FILTER FIELD FUNCTIONALITY
if (filterForm)
  filterForm.addEventListener('change', (e) => {
    e.preventDefault();
    const sort = document.getElementById('sort-by').value || '';
    const country =
      document.getElementById('filter-country').value.toLowerCase() || '';
    const gender =
      document.getElementById('filter-gender').value.toLowerCase() || '';
    const approxAgeField = document.getElementById('approxAge');

    if (sort)
      window.location.href = `http://127.0.0.1:800/search-person?sort=${sort}`;
    else if (country)
      window.location.href = `http://127.0.0.1:800/search-person?country=${country}`;
    else if (gender)
      window.location.href = `http://127.0.0.1:800/search-person?gender=${gender}`;
    // ! APPROXIMATE-AGE FILTER
    else if (approxAgeField) {
      const minAge = e.target.value.split(',')[0];
      const maxAge = e.target.value.split(',')[1];

      // approxAge[gte]=30&approxAge[lte]=40
      window.location.href = `http://127.0.0.1:800/search-person?approxAge[gte]=${minAge}&approxAge[lte]=${maxAge}`;
    } else window.location.href = `http://127.0.0.1:800/search-person`;
  });

// // ! GO NEXT AND PREVIOUS PAGE FUNCTIONS
// // Retrieve the current page number from the URL
// let urlParams = new URLSearchParams(window.location.search);
// let page = parseInt(urlParams.get('page')) || 1;

//  ! USER ACCOUNT DASHBOARD.
const navItems = document.querySelectorAll('.side-nav a');
const contentContainers = document.querySelectorAll(
  '.user-view__form-container',
);

// For update form
const updateFormContainer = document.getElementById('update-form-container');
const foundReports = document.getElementById('my-found-reports');
const updateBtn = document.querySelector('.update-button');

navItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();

    // Remove active class from all nav items and content containers
    navItems.forEach((nav) =>
      nav.parentElement.classList.remove('side-nav--active'),
    );
    contentContainers.forEach((container) =>
      container.classList.remove('active'),
    );

    updateFormContainer.classList.remove('active');

    // Add active class to the clicked nav item
    const sectionId = event.target.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
    const target = event.target;
    event.target.parentElement.classList.add('side-nav--active');

    updateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(sectionId).classList.remove('active');
      // target.parentElement.classList.remove('side-nav--active');
      updateFormContainer.classList.add('active');
    });
  });
});

// ! UPDATE A FOUND PERSON DETAILS
import axios from 'axios';
import { showAlert } from './alerts';

// ? 1) GETTING SELECTED PERSON'S DETAIL
let personId;
document.querySelectorAll('.update-button').forEach((button) => {
  button.addEventListener('click', async (event) => {
    personId = event.target.closest('a').getAttribute('data-id');
    console.log(personId);

    try {
      // Fetch the person's details using Axios
      const response = await axios.get(
        `http://127.0.0.1:800/api/v1/persons/${personId}`,
      );

      console.log(response);
      const person = response.data.data.person;

      // Populate the form fields with the person's details
      document.getElementById('person-name').value = person.name;
      document.getElementById('person-gender').value = person.gender;
      document.getElementById('person-approxAge').value = person.approxAge;
      document.getElementById('person-UniqueIdentifier').value =
        person.UniqueIdentifier;
      document.getElementById('person-clothingDescription').value =
        person.clothingDescription;
      document.getElementById('person-HairColor').value = person.HairColor;
      document.getElementById('person-country').value = person.country;
      document.getElementById('person-city').value = person.city;
      document.getElementById('person-additionalDetails').value =
        person.additionalDetails;

      // Display the update form
      // document.getElementById('update-form-container').style.display = 'block';
    } catch (error) {
      console.error('Error fetching person details:', error);
    }
  });
});

// ? 2) UPDATING WITH AJAX PATCH REQ TO API
document
  .querySelector('.update-person-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    // const personId = document
    //   .querySelector('.update-button[data-id]')
    //   .getAttribute('data-id');
    const updatedDetails = {
      name: document.getElementById('person-name').value,
      gender: document.getElementById('person-gender').value,
      approxAge: document.getElementById('person-approxAge').value,
      UniqueIdentifier: document.getElementById('person-UniqueIdentifier')
        .value,
      clothingDescription: document.getElementById('person-clothingDescription')
        .value,
      HairColor: document.getElementById('person-HairColor').value,
      country: document.getElementById('person-country').value,
      city: document.getElementById('person-city').value,
      additionalDetails: document.getElementById('person-additionalDetails')
        .value,
    };

    try {
      // Update the person's details using Axios
      await axios.patch(
        `http://127.0.0.1:800/api/v1/persons/${personId}`,
        updatedDetails,
      );
      showAlert('success', 'Person updated successfully');
      location.assign('http://127.0.0.1:800/me');

      // Optionally, refresh the page or update the UI to reflect the changes
    } catch (error) {
      console.error('Error updating person:', error);
      showAlert('error', 'Error updating person');
    }
  });

// ! DELETE A FOUND PERSON
document.querySelectorAll('.delete-button').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const personId = event.target.closest('a').getAttribute('data-id');
    if (confirm('Are you sure you want to delete this person?')) {
      try {
        // Delete the person using Axios
        await axios.delete(`http://127.0.0.1:800/api/v1/persons/${personId}`);
        alert('Person deleted successfully');
        // Remove the person's card from the UI
        const personCard = event.target.closest('.person-card');
        personCard.remove();
      } catch (error) {
        console.error('Error deleting person:', error);
      }
    }
  });
});
