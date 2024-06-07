const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const personController = require('../controllers/personController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     person: 'John',
//     reporter: 'Muhammad'
//   });
// });

// router.get('/overview', viewsController.getOverview)
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  `/search-person`,
  authController.protect,
  viewsController.getSearchPerson,
);

// Route to render the form to add new person in found person collection
router.get(
  '/report-found-person',
  authController.protect,
  viewsController.getReportFound,
);

// Route to render the form to add new person to the missing person collection
router.get(
  '/report-missing',
  authController.protect,
  viewsController.getReportMissing,
);

// To render the form to update the foundPerson Date.
// router.get(
//   '/update-person',
//   authController.protect,
//   viewsController.getUpdatePerson,
// );

router.get(
  '/all-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAllUsers,
);

router.get(
  '/persons/:id',
  authController.isLoggedIn,
  viewsController.getPersonDetail,
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);

// Static Pages
router.get('/contact-us', viewsController.getContactUs);
router.get('/about-group', viewsController.getAboutGroup);
router.get('/acknowledge', viewsController.getAcknowledge);
router.get('/privacy-policy', viewsController.getPrivacyPolicy);
router.get('/terms', viewsController.getTerms);

module.exports = router;
