const setCookie = require('../setCookie')
const Honeybadger = require('honeybadger').configure({
  apiKey: '3d60d561',
})

function verifyEmail(Users) {
  let web_url = ''
  process.env.NODE_ENV === 'production'
    ? (web_url = 'https://byreference.engineer')
    : (web_url = 'http://localhost:3001')
  return async (req, res) => {
    try {
      const user = await Users.findOneAndUpdate(
        { email_uuid: req.params.uuid },
        { verified: true }
      ).exec()
      if (user) {
        await setCookie(res, user._id, user.firstname, user.username)
        res.redirect(`${web_url}/dashboard`)
      } else {
        console.log('the account was not found')
        res.status(403).send({ message: 'The account was not found' })
      }
    } catch (error) {
      console.error(error)
      await Honeybadger.notify(error)
      res.status(500).send({ message: error })
    }
  }
}
exports.default = verifyEmail
