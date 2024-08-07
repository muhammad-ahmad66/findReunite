const express = require('express');
const router = express.Router();

const compareController = require('../controllers/compareController');

router.post(
  '/upload-static-image',
  compareController.uploadStaticImage,
  compareController.resizeStaticImage,
  compareController.detectFacesBatch,
  compareController.compareFace,
);

module.exports = router;
