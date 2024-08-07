const User = require('../models/userModel');
const Person = require('../models/personModel');
const MissingPerson = require('../models/missingPersonModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeature');

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Home Page',
  });
};

exports.getSearchPersonByName = catchAsync(async (req, res, next) => {
  const name = req.params.name.trim();

  // Build a query to find a person by name
  const query = {
    name: { $regex: name, $options: 'i' },
  };

  const page = req.query.page ? parseInt(req.query.page, 10) : 1;

  // Find the persons matching the query
  const persons = await Person.find(query);
  const totalPersons = persons.length;

  // Persons found, respond with the data
  res.status(200).render('search-person', {
    title: 'Search-Person',
    query: req.query,
    persons,
    totalResults: totalPersons,
    page,
    name,
  });
});

const mongoose = require('mongoose');

exports.getSearchPerson = catchAsync(async (req, res, next) => {
  let filter = {};
  let persons = [];
  let totalPersons = 0;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;

  // Check if personIds are provided in the query
  if (req.query.personIds) {
    const personIds = req.query.personIds.split(',').map((id) => id.trim());

    // Validate the IDs
    const validPersonIds = personIds.filter(mongoose.Types.ObjectId.isValid);

    filter = { _id: { $in: validPersonIds } };

    console.log('Filter:', filter);

    // Execute query to get the persons without APIFeatures
    persons = await Person.find(filter);
    totalPersons = persons.length;

    console.log('Persons:', persons);
  } else {
    // If personIds are not provided, use APIFeatures
    console.log('Using APIFeatures');

    // Initialize APIFeatures instance without pagination to get the total count
    const featuresWithoutPagination = new APIFeatures(
      Person.find(filter),
      req.query,
    )
      .filter()
      .sort()
      .limitFields();

    // Execute query to get total persons count
    totalPersons = await featuresWithoutPagination.query.countDocuments();
    console.log('Total Persons:', totalPersons);

    // Initialize APIFeatures instance with pagination
    const featuresWithPagination = new APIFeatures(
      Person.find(filter),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query to get paginated results
    persons = await featuresWithPagination.query;
    console.log('Persons:', persons);
  }

  // Render the template with the data
  res.status(200).render('search-person', {
    title: 'Search-Person',
    query: req.query,
    persons,
    totalResults: totalPersons,
    page,
  });
});

exports.getSearchByImage = catchAsync(async function (req, res, next) {
  res.status(200).render('searchByImage', {
    title: 'Search by Image',
  });
});

exports.getReportFound = catchAsync(async (req, res, next) => {
  res.status(200).render('foundPersonForm', {
    title: 'Report Found Person',
  });
});

exports.getReportMissing = (req, res) => {
  res.status(200).render('missingPersonForm', {
    title: 'Report Missing Person',
  });
};

exports.getPersonDetail = catchAsync(async (req, res, next) => {
  //* 1) GET THE DATA FROM THE DATABASE FOR THE REQUESTED PERSON (INCLUDING USER'S DATA AS WELL)
  const person = await Person.findById(req.params.id);
  // .populate({
  //   path: 'users',
  //   fields: 'name email',
  // });
  if (!person)
    return next(new AppError('There is no person with that name/id.', 404));

  //* 2) BUILD TEMPLATE
  //* 3) RENDER THAT TEMPLATE USING THE DATA FROM STEP#01
  res.status(200).render('person', {
    title: person.name,
    person,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up to your account',
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).render('all-users', {
    title: 'All Users',
    users,
  });
});

// !To get Missing Persons Reports
exports.getMissingPersonReports = catchAsync(async (req, res, next) => {
  const Persons = await MissingPerson.find();
  res.status(200).render('missing-persons-reports', {
    title: 'Missing Persons Reports',
    Persons,
  });
});

exports.getFoundPersonReports = catchAsync(async (req, res, next) => {
  const Persons = await Person.find();
  res.status(200).render('found-persons-reports', {
    title: 'Found Persons Reports',
    Persons,
  });
});

exports.getUserRegistrationsByYear = catchAsync(async (req, res, next) => {
  res.status(200).render('userRegistrationsByYear', {
    title: 'user registrations by year',
    user: req.user,
  });
});

exports.getAccount = async (req, res) => {
  req.params.id = req.user.id;
  let query = User.findById(req.params.id).populate([
    {
      path: 'associatedPersons',
      select: 'name photo additionalDetails country city',
    },
    {
      path: 'missingReportedPersons',
      select: 'name photo additionalDetails location.country location.city',
    },
  ]);
  // if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).render('account', {
    title: 'Your account',
    user: doc,
  });
};

// ! RENDER STATIC PAGES
exports.getAboutGroup = (req, res) => {
  res.status(200).render('about-group', {
    title: 'About our Group || CS-MUST-2020-24',
  });
};

exports.getAcknowledge = (req, res) => {
  res.status(200).render('acknowledge', {
    title: 'Acknowledgement for Supervisory Guidance',
  });
};

exports.getPrivacyPolicy = (req, res) => {
  res.status(200).render('privacy-policy', {
    title: 'Privacy Policy',
  });
};

exports.getTerms = (req, res) => {
  res.status(200).render('terms', {
    title: 'Terms of Service',
  });
};

exports.getContactUs = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
    page: 'contact-us',
  });
};

// const MissingPerson = require('../models/missingPersonModel');
const FoundPerson = require('../models/personModel');
// const catchAsync = require('../utils/catchAsync');
const checkSimilarity = require('../utils/checkSimilarity');
const sendNotificationEmail = require('../utils/email');

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
    // Send email notification
    await sendNotificationEmail(req.user.email, matchedPerson);
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

exports.getUploadImageForm = (req, res) => {
  res.status(200).render('upload-image-form', {
    title: 'Upload Image',
  });
};
