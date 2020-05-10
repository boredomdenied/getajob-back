const validator = require('validator')
const mongoose = require('mongoose')

function initMongoose() {
  const User = new mongoose.Schema({
    firstname: {
      type: String,
      required: true,
      validate: value => {
        return validator.isAlpha(value) && validator.isLength(value, 2, 50)
      },
    },
    lastname: {
      type: String,
      required: true,
      validate: value => {
        return validator.isAlpha(value) && validator.isLength(value, 2, 50)
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: value => {
        return validator.isEmail(value)
      },
    },
    password: {
      type: String,
      required: true,
      validate: value => {
        return validator.isAlpha(value) && validator.isLength(value, 8, 50)
      },
    },
    verified: {
      type: Boolean,
      default: false,
      validate: value  => {
        return validator.isBool(value)
      },
    },
    email_uuid: {
      type: String,
      unique: true,
      validate: value => {
        return validator.isUUID(value)
    },
  },
  })

  return {
    Users: mongoose.model('User', User)
  }
}

exports.default = initMongoose
