require('dotenv').config()
const generateToken = require('../generateToken')
const argon2 = require('argon2')

function resetPasswordInDatabase(Users) {
  return async (req, res) => {
    try {
      const hash = await argon2.hash(req.body.password)
      const user = await Users.findOneAndUpdate(
        { password_uuid: req.params.uuid },
        { $set: { password_reset: false, password: hash } }
      ).exec()
      if (user) {
        await generateToken(res, user._id, user.firstname)
        res.send({ message: 'Password successfully updated' })
      } else {
        console.log('the uuid was not found')
        res.status(403).send({ message: 'The uuid was not found' })
      }
    } catch (error) {
      console.error(error)
      console.log('stuff')
      res.status(403).send({ message: error })
    }
  }
}

exports.default = resetPasswordInDatabase
