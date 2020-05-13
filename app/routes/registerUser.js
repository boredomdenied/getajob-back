const generateToken = require('../generateToken')
const sendVerifyEmail = require('../mailers/sendVerifyEmail').default
const { v4 } = require('uuid')
const argon2 = require('argon2')

const Honeybadger = require('honeybadger').configure({
  apiKey: '3d60d561',
})

function registerUser(Users) {
  return async (req, res) => {
    try {
      if (
        !req.body.email ||
        !req.body.password ||
        !req.body.firstname ||
        !req.body.lastname
      ) {
        res
          .status(403)
          .send({ message: 'Please fill out all fields for registration' })
      } else {
        const userExists = await Users.findOne({ email: req.body.email }).exec()
        if (userExists) {
          res
            .status(403)
            .send({ message: 'This email is already registered to an account' })
        } else {
          let email_uuid = v4()
          req.body.email_uuid = email_uuid
          let password_uuid = v4()
          req.body.password_uuid = password_uuid

          const hash = await argon2.hash(req.body.password)
          req.body.password = hash
          const user = await new Users(req.body).save().catch((error) => {
            res.send({ message: error.message })
          })
          await generateToken(res, user._id, user.firstname)
          const cb = await sendVerifyEmail(user)
          if (cb >= 200 && cb < 300) {
            res.send({ message: 'user successfully created' })
          } else {
            if (cb.response) {
              // Extract error msg
              const { message, code, response } = cb
              // Extract response msg
              const { headers, body } = response
              Honeybadger.notify(body.errors[0].message)
              console.error(body.errors[0].message)
            }
            await Users.findOneAndDelete({ email: req.body.email })
            res.status(403).send({
              message:
                'An error occured sending an email to this user. Please try a different email for registration',
            })
          }
        }
      }
    } catch (error) {
      console.error(error)
      await Users.findOneAndDelete({ email: req.body.email })
      res.status(500).send({
        message:
          'Oops! Something went wrong on our end. Please try again in a moment',
      })
    }
  }
}

exports.default = registerUser
