const Honeybadger = require('honeybadger').configure({
  apiKey: '3d60d561',
})

function redirecResetPassword(Users) {
  let web_url = ''
  process.env.NODE_ENV === 'production'
    ? (web_url = 'https://byreference.engineer')
    : (web_url = 'http://localhost:3001')
  return async (req, res) => {
    try {
      const uuidExists = await Users.findOneAndUpdate(
        { password_uuid: req.params.uuid },
        { verified: true }
      ).exec()
      if (uuidExists) {
        res.redirect(`${web_url}/reset/${req.params.uuid}`)
      } else {
        console.log('the uuid was not found')
        res.status(403).send({ message: 'The uuid was not found' })
      }
    } catch (error) {
      console.error(error)
      console.log('stuff')
      await Honeybadger.notify(error)
      res.status(500).send({ message: error })
    }
  }
}

exports.default = redirecResetPassword
