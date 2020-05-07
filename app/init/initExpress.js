const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const registerUser = require('../routes/registerUser').default
const loginUser = require('../routes/loginUser').default
const logoutUser = require('../routes/logoutUser').default
const getDashboard = require('../routes/getDashboard').default

function initExpress({Users}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(function (req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.set({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'https://byreference.engineer',
      })
    } else {
      res.set({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3001',
      })
    }
    next()
  })
  app.use(cookieParser())
  app.use(bodyParser.json())

  app.get('/api/user/dashboard', getDashboard(Users))
  app.post('/api/auth/register', registerUser(Users))
  app.post('/api/auth/login/', loginUser(Users))
  app.post('/api/auth/logout/', logoutUser())
  app.post('/api/docker/provision', async (req, res) => {})
  app.post('/api/docker/run/:uuid', async (req, res) => {})
  app.delete('/api/docker/destroy/:uuid', async (req, res) => {})

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Listening at port :${port}...`)
  })
}

exports.default = initExpress
