const initMongo = require('./init/initMongo').default
const initMongoose = require('./init/initMongoose').default
const initExpress = require('./init/initExpress').default
const initTimers = require('./init/initTimers').default

initMongo()
const { Users, Containers } = initMongoose()
initExpress(Users, Containers)
initTimers(Users, Containers)
