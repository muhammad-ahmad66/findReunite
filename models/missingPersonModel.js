const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'Please specify the city'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Please specify the country'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
});

const missingPersonSchema = new mongoose.Schema(
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
    age: {
      type: Number,
      required: [true, 'Please specify the age'],
      min: [1, 'Age must be greater than or equal to 1'],
      max: [120, 'Age must be less than or equal to 120'],
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact information'],
      trim: true,
    },
    location: {
      type: locationSchema,
      required: [true, 'Please provide the last known location'],
    },
    additionalDetails: {
      type: String,
      trim: true,
      required: [
        true,
        'Please provide additional details about the missing person',
      ],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    reportedDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: 'missingPersons' },
);

const MissingPerson = mongoose.model('MissingPerson', missingPersonSchema);

module.exports = MissingPerson;
