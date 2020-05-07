const validator = require('validator')
const mongoose = require('mongoose')

function initMongoose() {
  const User = new mongoose.Schema({
    firstname: {
      type: String,
      required: true,
      validate: (value) => {
        return validator.isAlpha(value) && validator.isLength(value, 2, 50)
      },
    },
    lastname: {
      type: String,
      required: true,
      validate: (value) => {
        return validator.isAlpha(value) && validator.isLength(value, 2, 50)
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value)
      },
    },
    password: {
      type: String,
      required: true,
    },
  })

  return {
    Users: mongoose.model('User', User)
  }
}

exports.default = initMongoose
