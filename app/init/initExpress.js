const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const Honeybadger = require('honeybadger').configure({ apiKey: '3d60d561' })
const registerUser = require('../routes/registerUser').default
const loginUser = require('../routes/loginUser').default
const logoutUser = require('../routes/logoutUser').default
const getDashboard = require('../routes/getDashboard').default
const verifyEmail = require('../routes/verifyEmail').default
const resetPassword = require('../routes/resetPassword').default
const redirecResetPassword = require('../routes/redirectResetPassword').default
const resetPwDatabase = require('../routes/resetPwDatabase').default
const createContainer = require('../routes/createContainer').default
const dockerRun = require('../routes/dockerRun').default

function initExpress(Users, Containers) {
  const app = express()

  app.use(Honeybadger.requestHandler)
  app.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    })
    process.env.NODE_ENV === 'production'
      ? res.set({
        'Access-Control-Allow-Origin': 'https://byreference.engineer',
      })
      : res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3001',
      })
    next()
  })
  app.disable('x-powered-by')
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(Honeybadger.errorHandler)

  app.get('/api/user/dashboard', getDashboard(Users))
  app.get('/api/user/verify/:uuid', verifyEmail(Users))
  app.get('/api/user/reset/:uuid', redirecResetPassword(Users))
  app.post('/api/user/reset/', resetPassword(Users))
  app.post('/api/user/reset/:uuid', resetPwDatabase(Users))
  app.post('/api/auth/register', registerUser(Users))
  app.post('/api/auth/login/', loginUser(Users, Containers))
  app.post('/api/auth/logout/', logoutUser(Users, Containers))
  app.post('/api/docker/provision', createContainer(Users, Containers))
  app.post('/api/docker/run/', dockerRun(Users, Containers))
  app.post('/api/docker/stop/:uuid', async (req, res) => {
    Users, Containers
  })
  app.delete('/api/docker/destroy/:uuid', async (req, res) => {
    Users, Containers
  })

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Listening at port :${port}...`)
  })
}

exports.default = initExpress
