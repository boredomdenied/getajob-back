const setCookie = require('../setCookie')
const argon2 = require('argon2')

const Honeybadger = require('honeybadger').configure({
  apiKey: '3d60d561',
})

function loginUser(Users) {
  return async (req, res) => {
    try {
      console.log(Users)
      if (!req.body.email || !req.body.password) {
        res.send('Please provide an email and password for login')
      } else {
        // Find user
        const user = await Users.findOne({ email: req.body.email }).exec()
        if (user && user.verified === true) {
          // User found we check password & setCookie
          if (await argon2.verify(user.password, req.body.password)) {
            await setCookie(res, user._id, user.firstname, user.username)
            console.log('User successfully logged in')
            console.log('Cookies: ', req.cookies)
            res.send({ message: 'User successfully logged in' })
          } else {
            console.error('Incorrect password for user')
            res.status(403).send({ message: 'Incorrect password for user' })
          }
        } else {
          console.error('User does not exist')
          res.status(403).send({ message: 'User does not exist' })
        }
      }
    } catch (error) {
      console.error(error)
      await Honeybadger.notify(error)
      res.status(500).send({
        message:
          'Something went wrong on our end. Please try again in a moment',
      })
    }
  }
}

exports.default = loginUser
