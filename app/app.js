const initTimers = require('./init/initTimers').default
const initMongo = require('./init/initMongo').default
const initMongoose = require('./init/initMongoose').default
const initExpress = require('./init/initExpress').default

initTimers()
initMongo()
const models = initMongoose()
initExpress(models)
