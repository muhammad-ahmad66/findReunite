const express = require('express');

const viewsController = require('../controllers/viewsController');

const authController = require('../controllers/authController');
const missingPersonController = require('../controllers/missingPersonController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, missingPersonController.getAllMissingPersons)
  .post(
    authController.protect,
    missingPersonController.uploadPersonPhoto,
    missingPersonController.resizePersonPhoto,
    missingPersonController.checkForMatches,
    missingPersonController.createMissingPerson,
  );

module.exports = router;
