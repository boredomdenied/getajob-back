const initMongo = require('./init/initMongo').default
const initExpress = require('./init/initExpress').default
const initMongoose = require('./init/initMongoose').default


initMongo()
const models = initMongoose()
initExpress(models)
