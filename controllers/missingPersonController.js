const multer = require('multer');
const sharp = require('sharp');
const MissingPerson = require('../models/missingPersonModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Configure multer storage to use memory storage
const multerStorage = multer.memoryStorage();

// Filter for accepting only image files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Set up multer with storage and filter
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to upload person photo
exports.uploadPersonPhoto = upload.single('photo');

// Middleware to resize the uploaded photo
exports.resizePersonPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // Set the filename for the resized image
  req.file.filename = `missing-person-${req.user.id}-${Date.now()}.jpeg`;

  // Resize the image and save it to the specified directory
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/missing-persons/${req.file.filename}`);

  // Assign the filename to req.body.photo
  req.body.photo = req.file.filename;

  next();
});

const FoundPerson = require('../models/personModel');
// const catchAsync = require('../utils/catchAsync');
const checkSimilarity = require('../utils/checkSimilarity');
const Email = require('../utils/email');

exports.checkForMatches = catchAsync(async (req, res, next) => {
  const missingPerson = req.body;

  // Fetch all found persons
  const foundPersons = await FoundPerson.find();

  // Check for matches
  let matchFound = false;
  let matchedPerson = null;
  foundPersons.forEach((foundPerson) => {
    if (checkSimilarity(missingPerson, foundPerson)) {
      matchFound = true;
      matchedPerson = foundPerson;
    }
  });

  if (matchFound) {
    // http://127.0.0.1:800/persons/6645c185290c8d4e0a5de3ac
    const url = `${req.protocol}://${req.get('host')}/persons/${matchedPerson._id}`;
    // Send email notification
    await new Email(req.user, url).matchNotification();

    res.status(200).json({
      status: 'success',
      data: {
        matchFound,
        matchedPerson,
      },
    });
    // res.status(200).render('matchFound', {
    //   title: 'Match Found',
    //   matchFound,
    //   matchedPerson,
    // });
  }

  next();
});

// Controller to create a missing person entry
exports.createMissingPerson = catchAsync(async (req, res, next) => {
  // Assign the user ID to req.body.user
  // req.body.user = req.user._id;

  // Create the new missing person entry
  const newMissingPerson = await MissingPerson.create(req.body);

  // Update the associated user's missingReportedPersons array
  const user = await User.findById(req.user.id);
  user.missingReportedPersons.push(newMissingPerson._id);
  await user.save({ validateBeforeSave: false });

  // Respond with the created missing person entry
  res.status(201).json({
    status: 'success',
    data: {
      missingPerson: newMissingPerson,
    },
  });
});

exports.getAllMissingPersons = catchAsync(async (req, res, next) => {});
