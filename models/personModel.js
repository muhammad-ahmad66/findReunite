const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A person must have a name'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Must specify a gender'],
      enum: {
        values: ['male', 'female', 'non-binary'],
        message:
          '{VALUE} is not supported. Gender is either: male, female, non-binary',
      },
      trim: true,
    },
    approxAge: {
      type: Number,
      required: [true, 'Should specify some approximate age'],
      min: [1, 'Approximate Age must be greater or equal then 1'],
      max: [120, 'Approximate Age must be less or equal then 120'],
    },
    UniqueIdentifier: {
      type: String,
      trim: true,
    },
    clothingDescription: {
      type: String,
      trim: true,
    },
    HairColor: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    country: {
      type: String,
      required: [true, 'Should specify last seen country'],
      trim: true,
      minlength: [3, 'Country name must at least one character'],
      maxlength: [50, 'Country name must be at most 40 characters'],
    },
    city: {
      type: String,
      trim: true,
      required: [true, 'Should specify city name'],
      minlength: [3, 'City name must at least 3 character'],
      maxlength: [50, 'City name must be at most 50 characters'],
    },
    lastSeenDate: {
      type: Date,
      default: Date.now(),
    },
    additionalDetails: {
      type: String,
      trim: true,
      required: [
        true,
        'Add some details about person, like about medical, physical or mental conditions.',
      ],
      minlength: [5, 'Additional details must be at least 5 character'],
      maxlength: [900, 'Additional details must be at most 900 characters'],
    },
    foundAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { collection: 'persons' },
);

// Pre Save Middleware

// Pre Query Middleware
// personSchema.pre(/^find/, function (next) {
//   console.log('This:::', this);
//   this.find({ gender: { $ne: 'male' } });
//   next();
// });

// CODE TO MEASURE HOW LONG TOOK THE CURRENT QUERY
personSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

personSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v',
  });

  next();
});

personSchema.post(/^find/, function (docs, next) {
  console.log(`This query took ${Date.now() - this.start} milliseconds`);
  next();
});

// // Middleware to execute before saving a person document
// personSchema.pre('save', { validateBeforeSave: false }, async function (next) {
//   // Ensure associated user exists
//   if (!this.user) {
//     throw new Error('Associated user not provided.');
//   }

//   try {
//     // Find the associated user
//     const user = await User.findById(this.user);

//     if (!user) {
//       throw new Error('Associated user not found.');
//     }

//     // Add the current person's ID to the user's associatedPersons array
//     user.associatedPersons.push(this._id);

//     // Save the updated user document
//     await user.save();

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Middleware to execute before removing a person document
// personSchema.pre(
//   'remove',
//   { validateBeforeSave: false },
//   async function (next) {
//     // Ensure associated user exists
//     if (!this.user) {
//       throw new Error('Associated user not provided.');
//     }

//     try {
//       // Find the associated user
//       const user = await User.findById(this.user);

//       if (!user) {
//         throw new Error('Associated user not found.');
//       }

//       // Remove the current person's ID from the user's associatedPersons array
//       user.associatedPersons.pull(this._id);

//       // Save the updated user document
//       await user.save();

//       next();
//     } catch (error) {
//       next(error);
//     }
//   },
// );

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
