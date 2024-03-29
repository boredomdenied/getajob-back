const mongoose = require('mongoose')

function initMongo() {
  mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('useCreateIndex', true)
  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log('connection established to mongodb')
  })
}

exports.default = initMongo
