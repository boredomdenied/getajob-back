const express = require('express')
const initDatabase = require('./initDatabase').default
const initRoutes = require('./routes/initRoutes').default
const initModels = require('./initModels').default
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

require('dotenv').config()

initDatabase()

const models = initModels()


const app = express()

app.disable('x-powered-by')
app.use(function (req, res, next) {
  res.set({
    'Access-Control-Allow-Headers' : 'Content-Type',
    'Access-Control-Allow-Credentials' : 'true',
    'Access-Control-Allow-Origin' : 'http://localhost:3000',
  })
  next()
})
app.use(cookieParser())
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true}))

initRoutes(app, models)
