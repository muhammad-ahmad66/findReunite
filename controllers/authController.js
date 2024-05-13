// const jwt = require('jsonwebtoken');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// // const util = require('util');
// const { promisify } = require('util'); // destructuring

// const User = require('../models/userModel');

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
//     ),
//     httpOnly: true,
//   };
//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

//   res.cookie('jwt', token, cookieOptions);

//   // Remove password from output
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };

// exports.signup = async (req, res, next) => {
//   try {
//     // const newUser = await User.create({
//     //   name: req.body.name,
//     //   email: req.body.email,
//     //   password: req.body.password,
//     //   passwordConfirm: req.body.passwordConfirm,
//     // });'

//     const newUser = await User.create(req.body);
//     // // sign(payload,  secret, options);
//     // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     // expiresIn: process.env.JWT_EXPIRES_IN,
//     // });

//     createSendToken(newUser, 201, res);

//     // res.status(201).json({
//     //   status: 'success',
//     //   token,
//     //   data: {
//     //     user: newUser,
//     //   },
//     // });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// // exports.login = async (req, res, next) => {
// //   try {
// //     // 1) Getting email & password from body
// //     const { email, password } = req.body;

// //     // 2) Check if email and password exist in body
// //     if (!email || !password) {
// //       // throw new Error('Not provided email or password');
// //       return next(new AppError('Please provide email and password!', 400));
// //     }

// //     // 3) Check user exist with the inputted password and email
// //     const user = await User.findOne({ email: email }).select('+password');
// //     // const correct = await user.correctPassword(password, user.password); // either true or false
// //     // console.log(correct);

// //     if (!user || !(await user.correctPassword(password, user.password))) {
// //       // throw new Error('Incorrect Email or Password');
// //       return next(new AppError('Incorrect email or password', 401));
// //     }

// //     // 4) If everything is ok? send the token to client
// //     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
// //     //   expiresIn: process.env.JWT_EXPIRES_IN,
// //     // });

// //     // res.status(200).json({
// //     //   status: 'success',
// //     //   token,
// //     //   data: {
// //     //     user,
// //     //   },
// //     // });
// //     createSendToken(user, 200, res);
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'fail',
// //       message: err.message,
// //     });
// //   }
// // };

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // 1) Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError('Please provide email and password!', 400));
//   }
//   // 2) Check if user exists && password is correct
//   const user = await User.findOne({ email }).select('+password');

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('Incorrect email or password', 401));
//   }

//   // 3) If everything ok, send token to client
//   createSendToken(user, 200, res);
// });

// exports.logout = (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });
//   res.status(200).json({ status: 'success' });
// };

// // exports.protect = async (req, res, next) => {
// //   // console.log(req.headers);
// //   try {
// //     let token;

// //     console.log(req.cookies);
// //     // 1) Getting token and check of it's there
// //     if (
// //       req.headers.authorization &&
// //       req.headers.authorization.startsWith('Bearer')
// //     ) {
// //       token = req.headers.authorization.split(' ')[1];
// //     } else if (req.cookies.jwt) {
// //       token = req.cookies.jwt;
// //       console.log('hiii');
// //     }
// //     // console.log('token: ', token);
// //     if (!token) throw new Error("You'r not logged in!!");

// //     // 2) Verification the token
// //     // now we use sign function from JWT, it takes: jwt.sign(token, SecretKey, callback func), this callback function will run as soon as the verification step is completed.
// //     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
// //     console.log(decoded);

// //     // 3) Check if User still Exist
// //     const currentUser = await User.findById(decoded.id);
// //     if (!currentUser) {
// //       throw new Error('The user belonging to this token does no longer exist.');
// //     }

// //     // 4) Check if user changed password after the token was issued
// //     if (currentUser.changedPasswordAfter(decoded.iat)) {
// //       throw new Error('User recently changed password! Please log in again.');
// //     }

// //     req.user = currentUser;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({
// //       status: 'fail',
// //       message: err.message,
// //     });
// //   }
// // };

// exports.protect = catchAsync(async (req, res, next) => {
//   // 1) Getting token and check of it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   console.log(req.cookies.jwt);
//   if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//     console.log('hiii');
//   }

//   if (!token) {
//     return next(
//       new AppError('You are not logged in! Please log in to get access.', 401),
//     );
//   }

//   // 2) Verification token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   // 3) Check if user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return next(
//       new AppError(
//         'The user belonging to this token does no longer exist.',
//         401,
//       ),
//     );
//   }

//   // 4) Check if user changed password after the token was issued
//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     return next(
//       new AppError('User recently changed password! Please log in again.', 401),
//     );
//   }

//   // GRANT ACCESS TO PROTECTED ROUTE
//   req.user = currentUser;
//   res.locals.user = currentUser;
//   next();
// });

// // Goal of this⤵ middleware is to only for render pages/endpoints based on user's log in or not. This is not for protect any route.
// // exports.isLoggedIn = catchAsync(async (req, res, next) => {
// //   // 1) Getting token and check of it's there
// //   if (req.cookies.jwt) {
// //     // 2) Verification token
// //     const decoded = await promisify(jwt.verify)(
// //       req.cookies.jwt,
// //       process.env.JWT_SECRET,
// //     );

// //     // 3) Check if user still exists
// //     const currentUser = await User.findById(decoded.id);
// //     if (!currentUser) {
// //       return next();
// //     }

// //     // 4) Check if user changed password after the token was issued
// //     if (currentUser.changedPasswordAfter(decoded.iat)) {
// //       return next();
// //     }

// //     // THERE IS A LOGGED IN USER
// //     res.locals.user = currentUser; // In our pug templates, we'll get access to this user variable. Each and every templates will have access to res.locals
// //     // So if there is a logged in user, then the user will be available on the res object.
// //     return next();
// //   }
// //   next();
// // });

// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET,
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     try {
//       // roles ['admin', 'lead-guide']. role='user'
//       if (!roles.includes(req.user.role)) {
//         throw new Error('You do not have permission to perform this action');
//       }

//       next();
//     } catch (err) {
//       // return next(err);
//       res.status(403).json({
//         status: 'fail',
//         message: err.message,
//       });
//     }
//   };
// };

const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    contact: req.body.contact,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError('There is no user with email address.', 404));
//   }

//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send it to user's email
//   const resetURL = `${req.protocol}://${req.get(
//     'host',
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Your password reset token (valid for 10 min)',
//       message,
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Token sent to email!',
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       new AppError('There was an error sending the email. Try again later!'),
//       500,
//     );
//   }
// });

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new AppError('Token is invalid or has expired', 400));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   createSendToken(user, 200, res);
// });

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
