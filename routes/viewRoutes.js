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
  '/search-person',
  authController.isLoggedIn,
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
module.exports = router;
