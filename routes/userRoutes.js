const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/assignRole/:id').patch(
  authController.protect,
  // authController.isAdmin,
  authController.assignRole,
);
// router
//   .route('/makeAdmin/:id')
//   .patch(
//     authController.protect,
//     authController.isAdmin,
//     authController.makeAdmin,
//   );

router.get(
  '/statistics/:year',
  // authController.protect,
  // authController.restrictTo('admin'),
  userController.getStatisticsByYear,
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.delete(
  '/deleteUser/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.deleteUser,
);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.get('/getMe', authController.protect, userController.getMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = router;
