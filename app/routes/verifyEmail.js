function verifyEmail(Users) {
  let web_url = ''
  process.env.NODE_ENV === 'production'
    ? (web_url = 'https://byreference.engineer')
    : (web_url = 'http://localhost:3001')
  return async (req, res) => {
    try {
      const uuidExists = await Users.findOneAndUpdate(
        { email_uuid: req.params.uuid },
        { verified: true }
      ).exec()
      if (uuidExists) {
        console.log('found uuid')
        res.redirect(`${web_url}/dashboard`)
      } else {
        console.log('the account was not found')
        res.status(403).send({ message: 'The account was not found' })
      }
    } catch (error) {
      console.error(error)
      console.log('stuff')
      res.status(403).send({ message: error })
    }
  }
}
exports.default = verifyEmail
