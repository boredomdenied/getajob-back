const sendResetPassword = require('../mailers/sendResetPassword').default
const { v4 } = require('uuid')

function resetPassword(Users) {
  return async (req, res) => {
    try {
      if (!req.body.email) {
        res.status(403).send('Please fill out all fields for registration')
      } else {
        const user = await Users.findOne({ email: req.body.email }).exec()
        if (!user) {
          res
            .status(403)
            .send({ message: 'This email is not registered to an account' })
        } else if (user.password_reset) {
          res.status(403).send({
            message: 'Email has already been sent. Please check inbox or spam',
          })
        } else {
          const uuid = v4()
          const emailStatus = await sendResetPassword(user, uuid)
          if (emailStatus === 202) {
            await Users.findOneAndUpdate(
              { _id: user },
              { password_reset: true, password_uuid: uuid }
            ).exec()
            res.status(200).send({ message: 'Email was successfully sent' })
          } else {
            res
              .status(403)
              .send({ message: 'The email was not successfully sent' })
          }
        }
      }
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: error.body })
    }
  }
}

exports.default = resetPassword
