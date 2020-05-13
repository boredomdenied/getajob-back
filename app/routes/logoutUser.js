const util = require('util')

function logoutUser() {
  return async (req, res) => {
    try {
      res.clearCookie('token')
      res.send({ message: 'User successfully logged out' })
    } catch (error) {
      res.status(403).send({ message: error })
      console.error(error)
    }
  }
}

exports.default = logoutUser
