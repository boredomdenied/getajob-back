require('dotenv').config()
const setCookie = require('../setCookie')
const argon2 = require('argon2')

const Honeybadger = require('honeybadger').configure({
  apiKey: '3d60d561',
})

function resetPasswordInDatabase(Users) {
  return async (req, res) => {
    try {
      const hash = await argon2.hash(req.body.password)
      const user = await Users.findOneAndUpdate(
        { password_uuid: req.params.uuid },
        { $set: { password_reset: false, password: hash } }
      ).exec()
      if (user) {
        await setCookie(res, user._id, user.firstname)
        res.send({ message: 'Password successfully updated' })
      } else {
        console.log('the uuid was not found')
        res.status(403).send({ message: 'The uuid was not found' })
      }
    } catch (error) {
      console.error(error)
      await Honeybadger.notify(error)
      res.status(403).send({ message: error })
    }
  }
}

exports.default = resetPasswordInDatabase
