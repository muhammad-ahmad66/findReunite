// const personRoutes = express.Router();
const express = require('express');
const personController = require('../controllers/personController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', personController.checkId);

router
  .route('/')
  .get(authController.protect, personController.getAllPersons)
  .post(
    authController.protect,
    personController.uploadPersonPhoto,
    personController.resizePersonPhoto,
    personController.createPerson,
  );

router
  .route('/:id')
  .get(personController.getPerson)
  .patch(personController.updatePerson)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    personController.deletePerson,
  );

router.get('/search/:name', personController.personByName);

module.exports = router;
