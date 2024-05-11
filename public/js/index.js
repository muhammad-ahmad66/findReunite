import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { foundForm } from './foundPersonForm';

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const foundPersonForm = document.querySelector('.reported-form');

if (foundPersonForm)
  foundPersonForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append('firstName', document.getElementById('firstName').value);
    form.append('lastName', document.getElementById('lastName').value);
    form.append('gender', document.getElementById('gender').value);
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
    form.append('country', document.getElementById('country').value);
    form.append('city', document.getElementById('city').value);
    form.append('lastSeenDate', document.getElementById('lastSeenDate').value);
    form.append(
      'additionalDetails',
      document.getElementById('additionalDetails').value,
    );

    foundForm(form);
  });

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

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
