const mongoose = require('mongoose')

// Подключаемся к базе teamteam
mongoose.connect('mongodb://localhost/teamteam')
mongoose.Promise = global.Promise
const conn = mongoose.connection

conn.on('error', e => {
    console.error('DB connection error: ', e)
})

conn.once('connected', _ => {
    console.log('DB connection opened.')
})

conn.once('disconnected', _ => {
    console.log('DB connection closed.')
})

require('../db/schemas')