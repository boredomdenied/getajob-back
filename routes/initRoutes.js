const registerUser = require('./registerUser').default
const loginUser = require('./loginUser').default
const logoutUser = require('./logoutUser').default
const getDashboard = require('./getDashboard').default

function initRoutes(app, { Users }) {

  app.get('/user/dashboard', getDashboard(Users))
  app.post('/api/auth/register', registerUser(Users))
  app.post('/api/auth/login/', loginUser(Users))
  app.post('/api/auth/logout/', logoutUser(Users))
  app.post('/api/docker/provision', async (req, res) => {})
  app.post('/api/docker/run/:uuid', async (req, res) => {})
  app.delete('/api/docker/destroy/:uuid', async (req, res) => {})

  app.listen(process.env.port || 5000, () => {
    console.log('Listening at :5000...')
  })
}

exports.default = initRoutes
