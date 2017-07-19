const express = require('express')
const path = require('path')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Task = mongoose.model('Task')
const telegram = require('../telegram/tg-init')

const app = express()

const auth = function (req, res, next) {
    if (req.isAuthenticated())
        return next()
    else {
        return res.sendStatus(401)
            .json({error: 'Авторизуйся потом выебуйся.'})
    }
}

router.use((req, res, next) => {

    // log each request to the console
    console.log(req.method, req.url)
    console.log('Session: ', req.session)

    // continue doing what we were doing and go to the route
    next()
})

router.post('/logout', (req, res) => {
    // req.logout();
    telegram.logOut().then(r => {
        res.status(200).json({
            status: r
        })
    }).catch(e => console.error('Попытка выхода: ', e))
})

router.post('/login', (req, res) => {
    if (req.body.code) {
        console.log('Отправляем телефон ', req.session.phone, ' хэш ', req.session.phone_code_hash, ' и код ', req.body.code)

        req.session.code = req.body.code
        telegram.signIn(req.session.phone,
            req.session.phone_code_hash,
            req.body.code).then(r => {
            res.json(r)
        }).catch(e => console.error(e))

    } else if (req.body.phone) {
        const p = '7' + req.body.phone.replace(/[^0-9]/g, '')
        console.log('Отправляем номер: ', p)

        telegram.sendCode(p).then(r => {
            req.session.phone_code_hash = r.phone_code_hash
            req.session.phone = p
            res.json(r)
        }).catch(e => console.error(e))
    }
})

router.post('/test', (req, res) => {
    telegram.getState().then(r => {
        console.log(r)
    }).catch(e => console.error(e))

    res.sendStatus(200)
})

module.exports = router