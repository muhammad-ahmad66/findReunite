const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { detectFaces } = require('./detectFacesHelper');
const Person = require('../models/personModel');

// Define the project root and image directory
const projectRoot = path.resolve(__dirname, '..');
const imagesDirectory = path.join(projectRoot, 'public', 'img', 'persons');

// Multer configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadStaticImage = upload.single('staticImage');

exports.resizeStaticImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file uploaded'));
  }

  req.file.filename = `static-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(imagesDirectory, req.file.filename));

  req.file.path = path.join(imagesDirectory, req.file.filename);
  next();
};

const getImages = async () => {
  try {
    const personPhotos = await Person.aggregate([
      {
        $project: {
          photo: 1, // Include the `photo` field
          _id: 0, // Exclude the `_id` field
        },
      },
    ]);
    return personPhotos.map((person) =>
      path.join(imagesDirectory, person.photo),
    );
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

const detectFacesForPersons = async () => {
  const persons = await getImages();
  const detectionResults = [];

  for (const imagePath of persons) {
    if (fs.existsSync(imagePath)) {
      try {
        const faceId = await detectFaces(imagePath);
        if (faceId) {
          detectionResults.push({
            image: imagePath,
            faceId,
          });
        }
      } catch (error) {
        console.error(
          `Error detecting face for image ${imagePath}:`,
          error.message,
        );
      }
    } else {
      console.error(`Image file does not exist: ${imagePath}`);
    }
  }

  return detectionResults;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.detectFacesBatch = async (req, res, next) => {
  try {
    const detectionResults = await detectFacesForPersons();
    console.log('Detection Results:', detectionResults);
    req.detectionResults = detectionResults; // Pass data to next middleware
    next(); // Call next middleware
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.compareFace = async (req, res) => {
  const staticImagePath = req.file
    ? req.file.path
    : path.join(projectRoot, 'public', 'img', 'persons', 'default.jpg');

  if (!fs.existsSync(staticImagePath)) {
    return res.status(500).json({ error: 'Static image file is missing' });
  }

  try {
    const { default: pLimit } = await import('p-limit');
    const apiKey = 'acc_d56c327e74087cb';
    const apiSecret = '06615fe79777a2b5248051388e88b9b2';
    const limit = pLimit(3); // Reduce the limit to avoid hitting the API limits

    const faceIdStaticImage = await detectFaces(staticImagePath);
    const images = await getImages();
    const comparisonResults = [];

    const retry = async (fn, retries = 3, delayMs = 2000) => {
      try {
        return await fn();
      } catch (error) {
        if (retries > 0) {
          console.warn(
            `Retrying due to error: ${error.message}. Retries left: ${retries}`,
          );
          await delay(delayMs);
          return retry(fn, retries - 1, delayMs * 2); // Exponential backoff
        } else {
          throw error;
        }
      }
    };

    const requests = images.map((imgPath) => {
      return limit(async () => {
        try {
          const faceIdPersonImage = await detectFaces(imgPath);
          if (!faceIdPersonImage || !faceIdStaticImage) {
            console.error(`Face ID missing for one of the images`);
            return;
          }

          const similarityUrl = `https://api.imagga.com/v2/faces/similarity?face_id=${faceIdStaticImage}&second_face_id=${faceIdPersonImage}`;

          const { default: got } = await import('got');
          const response = await retry(() =>
            got(similarityUrl, {
              username: apiKey,
              password: apiSecret,
            }),
          );

          const similarityResult = JSON.parse(response.body);
          if (similarityResult.result.score > 75) {
            comparisonResults.push({
              image: imgPath,
              result: similarityResult,
            });
          }
        } catch (error) {
          console.error(
            `Error comparing face for image ${imgPath}:`,
            error.message,
          );
        }
      });
    });

    await Promise.all(requests);

    res.json(comparisonResults);
  } catch (error) {
    const errorMsg = error.response ? error.response.body : error.message;
    console.error('Error during face comparison:', errorMsg);
    try {
      res.status(500).json({ error: JSON.parse(errorMsg) });
    } catch (parseError) {
      res.status(500).json({ error: errorMsg });
    }
  }
};
