const generateToken = require('../generateToken')

function registerUser(Users) {
  return async (req, res) => {
    try {
      if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
        res.status(403).send('Please fill out all fields for registration')
      } else {
        const userExists = await Users.findOne({ email: req.body.email }).exec()
        if (userExists) {
          res.status(403).send({ message: 'This email is already registered to an account'})
        } else {
          const user = await new Users(req.body)
            .save()
            .catch((error) => {
              res.send(error.message)
            })
            await generateToken(res, user._id, user.firstname)
            res.status(200).send({ user: 'Successfully created'})
          }
      }
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: error.body})
    }
  }
}

exports.default = registerUser
