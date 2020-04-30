function registerUser(Users) {
  return async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        res.send('Please provide an email and password for registration')
      } else {
        const user = await Users.findOne({ email: req.body.email }).exec()
        if (!user) {
          new Users(req.body)
            .save()
            .catch((err) => {
              res.send(err.message)
            })
            res.status(200).send({ user: 'Successfully created'})
        } else {
          res.status(403).send({ error: 'This email is already registered to an account'})
        }
      }
    } catch (err) {
      res.status(500).send(err)
      console.log(err)
    }
  }
}

exports.default = registerUser
