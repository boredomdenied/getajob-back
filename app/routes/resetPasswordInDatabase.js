require('dotenv').config()
const generateToken = require('../generateToken')

function resetPasswordInDatabase(Users) {
  let web_url = ''
  process.env.NODE_ENV === 'production'
    ? (web_url = 'https://byreference.engineer')
    : (web_url = 'http://localhost:3001')
  return async (req, res) => {
    try {
      const user = await Users.findOneAndUpdate(
        { password_uuid: req.params.uuid },
        { $set: { password_reset: false, password: req.body.password }}
      ).exec()
      if (user) {
        await generateToken(res, user._id, user.firstname)
        res.send({message: 'Password successfully updated'})
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
