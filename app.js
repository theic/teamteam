const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const db = require('./db/init')

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Task = mongoose.model('Task')
const Storage = mongoose.model('Storage')

const app = express()

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
app.use(session({
    secret: 'raining-dicks',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true
}))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const telegram = require('./telegram/tg-init')

app.listen(3000, _ => {
    console.log('Listening on port 3000!')

    // User.find({}, (e, arr) => {
    //     console.log('Current users:')
    //     arr.map(u => {
    //         console.log(u.email)
    //     })
    // })
    //
    // Task.find({}, (e, arr) => {
    //     console.log('Current tasks:')
    //     arr.map(u => {
    //         console.log(u.title)
    //     })
    // })

    setTimeout(_ => {
        Storage.find({}, (err, value) => {
            console.log('Current state: ', value)
        })
    }, 500)

    // telegram.getState().then(r => {
    //     console.log(r)
    // }).catch(e => console.error(e))
})

let user_routes = require('./api/index')

app.use('/', user_routes)

app.get('*', (req, res, next) => {
    res.json({isok: true})
    // res.sendFile(path.join(__dirname, './public/src/teamteam-app/index.html'))
})