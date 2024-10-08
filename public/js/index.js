import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { foundForm } from './foundPersonForm';
import { searchPerson } from './searchPerson';
import { missingForm } from './missingPersonForm';
import { updatePerson } from './updatePersonForm';

import { fetchDataAndCreateChart } from './fetchDataAndCreateChart';
import { generatePDF } from './generatePdf';
import { roleManagement, deleteUser } from './userManagement';
import { searchPersonByName } from './searchPersonByName';
import { updateChart, populateYearDropdown } from './userRegistrationsByYear';

import { getUserLocationDetails } from './getUserLocation';

// LOADER
import LoaderModule from './mainLoader';

// ! SELECTING ELEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const foundPersonForm = document.querySelector('.reported-form');
const missingPersonForm = document.querySelector('.missing-person-form');
// const updatePersonForm = document.querySelector('.update-person-form');
// const searchForm = document.querySelector('.nav__search');
const filterForm = document.querySelector('.nav__filter');

// UPDATE PERSON DETAIL

// ! FOUND PERSON FORM. -IF SOMEONE FOUND A PERSON, SO TO INPUT THE PERSON'S DATA
document.addEventListener('DOMContentLoaded', async () => {
  LoaderModule.showLoader();
  setTimeout(() => {
    LoaderModule.hideLoader();
  }, 1000);

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
      form.append(
        'lastSeenDate',
        document.getElementById('lastSeenDate').value,
      );
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
      form.append(
        'location[address]',
        document.getElementById('address').value,
      );
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
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const contact = document.getElementById('contact').value;
      let country = document.getElementById('country').value;
      let city = document.getElementById('city').value;
      if (!country || !city) {
        try {
          const details = await getUserLocationDetails();
          console.log(`City: ${details.city}, Country: ${details.country}`);
          country = details.country;
          city = details.city;
        } catch (error) {
          console.error(error.message);
        }
      }
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

      document.querySelector('.btn--save-password').textContent =
        'Save Password';

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
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

      if (sort) window.location.href = `/search-person?sort=${sort}`;
      else if (country)
        window.location.href = `/search-person?country=${country}`;
      else if (gender) window.location.href = `/search-person?gender=${gender}`;
      // ! APPROXIMATE-AGE FILTER
      else if (approxAgeField) {
        const minAge = e.target.value.split(',')[0];
        const maxAge = e.target.value.split(',')[1];

        // approxAge[gte]=30&approxAge[lte]=40
        window.location.href = `/search-person?approxAge[gte]=${minAge}&approxAge[lte]=${maxAge}`;
      } else window.location.href = `/search-person`;
    });

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

  // ? 1) GETTING SELECTED PERSON'S DETAIL
  let personId;
  const updateButtons = document.querySelectorAll('.update-button');
  if (updateButtons)
    updateButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        personId = event.target.closest('a').getAttribute('data-id');
        // console.log(personId);

        try {
          // Fetch the person's details using Axios
          const response = await axios.get(`/api/v1/persons/${personId}`);

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
  const updatePersonForm = document.querySelector('.update-person-form');

  if (updatePersonForm)
    updatePersonForm.addEventListener('submit', async (event) => {
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
        clothingDescription: document.getElementById(
          'person-clothingDescription',
        ).value,
        HairColor: document.getElementById('person-HairColor').value,
        country: document.getElementById('person-country').value,
        city: document.getElementById('person-city').value,
        additionalDetails: document.getElementById('person-additionalDetails')
          .value,
      };

      try {
        // Update the person's details using Axios
        await axios.patch(`/api/v1/persons/${personId}`, updatedDetails);
        showAlert('success', 'Person updated successfully');
        location.assign('/me');

        // Optionally, refresh the page or update the UI to reflect the changes
      } catch (error) {
        console.error('Error updating person:', error);
        showAlert('error', 'Error updating person');
      }
    });

  // ! DELETE A FOUND PERSON
  const deleteButtons = document.querySelectorAll('.delete-button');

  if (deleteButtons)
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const personId = event.target.closest('a').getAttribute('data-id');
        if (confirm('Are you sure you want to delete this person?')) {
          try {
            // Delete the person using Axios
            await axios.delete(`/api/v1/persons/${personId}`);
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

  const adminBtn = document.querySelectorAll('#make-admin-btn');
  const userBtn = document.getElementById('make-user-btn');
  const deleteUserButtons = document.querySelectorAll('#delete-user-btn');

  if (deleteUserButtons) {
    deleteUserButtons.forEach((button) =>
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const userId = this.getAttribute('data-user-id');

        console.log(userId);
        deleteUser(userId);
      }),
    );
  }

  if (adminBtn)
    adminBtn.forEach((btn) =>
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const userId = this.getAttribute('data-user-id');

        roleManagement('admin', userId);
      }),
    );

  if (userBtn)
    userBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const userId = this.getAttribute('data-user-id');
      roleManagement('user', userId);
    });

  // Lazy loading images
  const imgTargets = document.querySelectorAll('img[data-src]');

  if (imgTargets.length > 0) {
    const loadImg = function (entries, observer) {
      const [entry] = entries;

      if (!entry.isIntersecting) return;

      // Replace src with data-src
      entry.target.src = entry.target.dataset.src;

      entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
      });

      observer.unobserve(entry.target);
    };

    const imgObserver = new IntersectionObserver(loadImg, {
      root: null,
      threshold: 0,
      rootMargin: '200px',
    });

    imgTargets.forEach((img) => imgObserver.observe(img));
  }

  // ! Function to initialize a chart for a canvas element
  function initializeChart(apiUrl, chartLabel, canvasElement) {
    // Check if canvasElement exists and is not already initialized
    const initialized = canvasElement.dataset.initialized === 'true';
    if (canvasElement && !initialized) {
      fetchDataAndCreateChart(apiUrl, canvasElement, chartLabel);
      canvasElement.dataset.initialized = 'true'; // Mark as initialized
    }
  }

  // Initialize found persons chart if canvas exists
  const personCanvasEl = document.getElementById('countryBarChart');
  if (personCanvasEl) {
    const apiUrl = '/api/v1/persons';
    const chartLabel = 'Found Persons';
    initializeChart(apiUrl, chartLabel, personCanvasEl);
  }

  // Initialize missing persons chart if canvas exists
  const missingCanvasEl = document.getElementById(
    'missingPersonsByCountryChart',
  );
  if (missingCanvasEl) {
    const apiUrl = '/api/v1/missing-persons';
    const chartLabel = 'Missing Persons';
    initializeChart(apiUrl, chartLabel, missingCanvasEl);
  }

  // ! GENERATE PDF FILE AND DOWNLOAD
  const downloadBtn = document.getElementById('download-btn');

  if (downloadBtn && personCanvasEl)
    downloadBtn.addEventListener('click', () => {
      // Example usage: Call generatePDF with specific parameters
      generatePDF(
        'countryBarChart',
        'findReunite',
        'Country Distribution of Reported Found Persons',
        'Reported_Found_Persons.pdf',
      );
    });

  if (downloadBtn && missingCanvasEl)
    downloadBtn.addEventListener('click', () => {
      // Example usage: Call generatePDF with specific parameters
      generatePDF(
        'missingPersonsByCountryChart',
        'findReunite',
        'Country Distribution of Reported Missing Persons',
        'Reported_Missing_Persons.pdf',
      );
    });

  async function initialize() {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Get the year dropdown element
    const yearDropdown = document.getElementById('yearDropdown');

    if (yearDropdown) {
      // Populate the dropdown with years
      populateYearDropdown();

      // Set the dropdown to the current year
      yearDropdown.value = currentYear;

      // Update the chart with data for the current year
      await updateChart(currentYear.toString());

      // Add an event listener to update the chart when the year selection changes
      yearDropdown.addEventListener('change', async (event) => {
        const selectedYear = event.target.value;
        await updateChart(selectedYear);
      });
    }
  }

  initialize();

  // ! GENERATE PDF FILE AND DOWNLOAD
  const userByYearDownloadBtn = document.getElementById(
    'user-reg-by-year-download-btn',
  );

  if (userByYearDownloadBtn)
    userByYearDownloadBtn.addEventListener('click', () => {
      // Example usage: Call generatePDF with specific parameters
      generatePDF(
        'usersByMonthChart',
        'findReunite',
        'User Registered in 2024',
        'User_Reg_in_a_Year.pdf',
      );
    });

  //  !Search by name
  const searchForm = document.getElementById('searchForm');

  if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('search-person-name').value;

      searchPersonByName(name);
    });
  }
});

// ! Compare Image
const imgUploadForm = document.getElementById('uploadForm');

if (imgUploadForm) {
  imgUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const imageInput = document.getElementById('imageInput');
    formData.append('photo', imageInput.files[0]);

    try {
      const response = await fetch('/api/v1/persons/compare-uploaded-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      console.log(formData);
      // Handle response based on your application's logic
    } catch (error) {
      console.error('Error:', error);
    }
  });
}
