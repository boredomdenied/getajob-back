const validator = require('validator')
const mongoose = require('mongoose')

function initMongoose() {
  mongoose.set('useFindAndModify', false)

  const Container = new mongoose.Schema({
    created: {
      type: Date,
      default: Date.now,
    },
    last_modified: {
      type: Date,
      default: Date.now,
    },
  })

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
    email_uuid: {
      type: String,
      unique: true,
      validate: (value) => {
        return validator.isUUID(value)
      },
    },
    password: {
      type: String,
      required: true,
    },
    password_reset: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password_uuid: {
      type: String,
      unique: true,
      validate: (value) => {
        return validator.isUUID(value)
      },
      container: {
        type: String,
        unique: true,
      },
    },
  })

  return {
    Users: mongoose.model('User', User),
    Containers: mongoose.model('Container', Container),
  }
}

exports.default = initMongoose
