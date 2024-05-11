const Person = require('../models/personModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeature');

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Persons',
  });
};

exports.getSearchPerson = catchAsync(async (req, res, next) => {
  //* 1) GET PERSON DATA FROM DB COLLECTION
  // const persons = await Person.find();

  const features = new APIFeatures(Person.find(), req.query);
  // features.filter().sort().limitFields().paginate();
  features.sort().paginate();

  // EXECUTE QUERY
  const persons = await features.query;

  // res.status(200).json({
  //   status: 'success',
  //   result: persons.length,
  //   data: {
  //     persons,
  //   },
  // });

  //* 2) BUILD TEMPLATE
  //? Built in views folder, search-person.pug

  //* 3) RENDER THAT TEMPLATE USING THE DATA FROM STEP#01

  res.status(200).render('search-person', {
    title: 'Search-Person',
    persons,
  });
});

exports.getReportFound = catchAsync(async (req, res, next) => {
  res.status(200).render('foundPersonForm', {
    title: 'Report Found Person',
  });
});

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
    title: 'Muhammad Ahmad',
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

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
