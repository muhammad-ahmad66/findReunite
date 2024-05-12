const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

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

router.get('/report-found-person', viewsController.getReportFound);

router.get(
  '/persons/:id',
  authController.isLoggedIn,
  viewsController.getPersonDetail,
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);

// Static Pages
router.get('/about-group', viewsController.getAboutGroup);
router.get('/acknowledge', viewsController.getAcknowledge);
router.get('/privacy-policy', viewsController.getPrivacyPolicy);
router.get('/terms', viewsController.getTerms);

module.exports = router;
