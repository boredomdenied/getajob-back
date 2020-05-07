const generateToken = require('../generateToken')

function loginUser (Users) {
  return async (req, res) => {
    try {
      console.log(Users)
      if (!req.body.email || !req.body.password) {
        res.send('Please provide an email and password for login')
      } else {
        const user = await Users.findOne({ email: req.body.email }).exec()
        if (user) {
          if (req.body.password === user.password) {
            await generateToken(res, user._id, user.firstname)
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
      res.status(500).send({ message: 'Something went wrong' })
    }
  }
}

exports.default = loginUser
