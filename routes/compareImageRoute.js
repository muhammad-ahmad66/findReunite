const express = require('express');
const router = express.Router();

const compareController = require('../controllers/compareController');

// router.get('/compare-faces', compareController.compareFace);

// router.get('/detect-face', compareController.detectFace);
// router.get('/detect-faces-batch', detectFacesBatch, compareFace);

router.get(
  '/detect-faces-batch',
  compareController.detectFacesBatch,
  compareController.compareFace,
);

module.exports = router;
