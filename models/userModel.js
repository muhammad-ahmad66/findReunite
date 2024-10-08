const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pasConfirm) {
        return pasConfirm === this.password;
      },
      message: 'Passwords are not the same! Please try again',
    },
  },
  contact: {
    type: String,
    required: [true, 'Please provide your contact number'],
    // validate: [
    //   {
    //     validator: function (contactNumber) {
    //       return validator.isMobilePhone(contactNumber, 'any', {
    //         strictMode: true,
    //       });
    //     },
    //     message: 'Please provide a valid phone number.',
    //   },
    // ],
  },

  location: {
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,

  associatedPersons: [
    // to store the ids of uploaded found persons.
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
    },
  ],
  missingReportedPersons: [
    // To store ids of reported missing persons
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MissingPerson',
    },
  ],
});

userSchema.pre('save', async function (next) {
  try {
    // Only run if the password field is changed
    if (!this.isModified('password')) next();

    // Hash the password with code 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete Confirm Password
    this.passwordConfirm = undefined;

    // Set createdAt if it's not already set
    if (!this.createdAt) {
      this.createdAt = Date.now();
    }

    next();
  } catch (err) {
    console.log(err);
  }
});

// query middleware
userSchema.pre(/^find/, function (next) {
  // query middleware: 'this' points to the current query.
  this.find({ active: { $ne: false } });
  next();
});

// Instance Method: Will available on all docs of the collection.
// And 'this' will point to the current document
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// Compare function will check plan password(candidate) with hashed one(userPass).
// and will return true or false.

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(passwordChangedAt, JWTTimestamp);
    const changedTimestamp = parseInt(
      // parsed into the number with based 10 number
      this.passwordChangedAt.getTime() / 1000, // getTime will convert to timestamp
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false; // false means not changed
};

const User = mongoose.model('User', userSchema);

module.exports = User;
