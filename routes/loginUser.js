const generateToken = require('../generateToken')

function loginUser (Users) {
  return async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        res.send('Please provide an email and password for login')
      } else {
        const user = await Users.findOne({ email: req.body.email }).exec()
        if (user) {
          if (req.body.password === user.password) {
            await generateToken(res, user._id, user.firstname)
            res.send('User successfully logged in')
          } else {
            res.status(403).send({ error: 'Incorrect password for user' })
          }
        } else {
          res.status(403).send({ error: 'User does not exist' })
        }
      }
    } catch (err) {
      res.status(500).send(err)
      console.error(err)
    }
  }
}

exports.default = loginUser
