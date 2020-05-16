const jwt = require('jsonwebtoken')

function getDashboard(Users) {
  return async (req, res) => {
    const token = req.cookies.token
    try {
      if (!token) {
        const error = 'User must be logged in'
        console.error(error)
        return res.status(403).send({ error })
      }
      const { firstname, id } = jwt.verify(token, process.env.JWT_SECRET)
      if (firstname) {
        return res.send({ firstname })
      } else {
        const error = 'User token not found'
        console.error(error)
        return res.status(403).send({ error })
      }
    } catch (err) {
      console.error(err)
      return res.status(500).send({ error: err.message })
    }
  }
}

exports.default = getDashboard
