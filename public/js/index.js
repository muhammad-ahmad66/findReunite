import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { foundForm } from './foundPersonForm';
import { searchPerson } from './searchPerson';
import { missingForm } from './missingPersonForm';

// ! SELECTING ELEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const foundPersonForm = document.querySelector('.reported-form');
const missingPersonForm = document.querySelector('.missing-person-form');
const searchForm = document.querySelector('.nav__search');
const filterForm = document.querySelector('.nav__filter');

const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');

// Show the loader when the page starts loading
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'block'; // Display the loader

  console.log('loding....');
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

// ! GO NEXT AND PREVIOUS PAGE FUNCTIONS
// Retrieve the current page number from the URL
let urlParams = new URLSearchParams(window.location.search);
let page = parseInt(urlParams.get('page')) || 1;

// // Function to handle click event on the next button
// if (btnNext) {
//   btnNext.addEventListener('click', (e) => {
//     e.preventDefault();
//     // Increment page number
//     ++page;
//     // Update URL with new page number
//     window.location.href = `http://127.0.0.1:800/search-person?page=${page}`;
//   });
// }

// if (btnPrev)
//   btnPrev.addEventListener('click', (e) => {
//     e.preventDefault();
//     // Increment page number
//     --page;
//     // Update URL with new page number
//     window.location.href = `http://127.0.0.1:800/search-person?page=${page}`;
//   });
// if (page == 1) {
//   btnPrev.style.display = 'none';
// }
