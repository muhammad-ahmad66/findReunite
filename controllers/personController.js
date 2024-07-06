const multer = require('multer');
const sharp = require('sharp');

const Person = require('./../models/personModel');
const User = require('./../models/userModel');

const APIFeatures = require('./../utils/apiFeature');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// const personData = require('./../dev-data/person-sample-data');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPersonPhoto = upload.single('photo');

exports.resizePersonPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `person-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/persons/${req.file.filename}`);

  next();
});

exports.createPerson = catchAsync(async (req, res, next) => {
  // const newPerson = await Promise.All(
  //   personsData.map((person) => {
  //     return Person.create(person);
  //   }),
  // );

  /* This code snippet is from the `createPerson` controller function in a Node.js application. */

  if (req.file) req.body.photo = req.file.filename;
  else req.body.photo = `default.jpg`;

  req.body.user = req.user._id;

  const newPerson = await Person.create(req.body);

  // Updating AssociatedUser
  const user = await User.findById(req.user.id);
  user.associatedPersons.push(newPerson._id);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: {
      person: newPerson,
    },
  });
});

exports.getAllPersons = async (req, res) => {
  try {
    // CREATING INSTANCE
    const features = new APIFeatures(Person.find(), req.query);
    features.filter().sort().limitFields().paginate();

    // EXECUTE QUERY
    const persons = await features.query;

    res.status(200).json({
      status: 'success',
      result: persons.length,
      data: {
        persons,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getPerson = async (req, res, next) => {
  try {
    // const person = await Person.findOne({ _id: req.params.id });
    // const tour = await Tour.findById(req.params.id).populate('guides');

    const person = await Person.findById(req.params.id);

    if (!person) {
      return next(new AppError('No person found with that id', 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        person,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePerson = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        person: updatedPerson,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);

    if (!deletedPerson) {
      return res.status(404).json({
        status: 'fail',
        message: 'Person not found',
      });
    }

    // Find the user associated with this person and remove the person's ID from their associatedPersons field
    await User.findByIdAndUpdate(deletedPerson.user, {
      $pull: { associatedPersons: req.params.id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
    // 204 means no content
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.personByName = catchAsync(async (req, res, next) => {
  const name = req.params.name.trim();

  // Build a query to find a person by name
  const query = {
    name: { $regex: name, $options: 'i' },
  };

  // Find the persons matching the query
  const persons = await Person.find(query);

  if (!persons || persons.length === 0) {
    // Handle case where no persons are found
    return res.status(200).json({
      status: 'success',
      result: 0,
      data: {
        persons: [],
      },
    });
  }

  // Persons found, respond with the data
  res.status(200).json({
    status: 'success',
    result: persons.length,
    data: {
      persons,
    },
  });
});
