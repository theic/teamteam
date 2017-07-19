const express = require('express')
const path = require('path')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Task = mongoose.model('Task')
require('./index')

router.post('/content', auth, (req, res) => {
    res.status(200).json({
        status: req.user
    })
})

router.post('/task', auth, (req, res) => {
    Task.create({
        title: req.body.title,
        body: req.body.description,
        days_from: req.body.days_from,
        days_to: req.body.days_to,
        cost: req.body.cost,
        cost_type: req.body.cost_type,
        _creator: req.user._id
    }, (e, t) => {
        if (e) return console.error(e);

        res.status(200).json({
            success: true,
            status: t
        })
    })
})

router.post('/get-tasks', (req, res) => {
    Task.find({}, (e, arr) => {
        if (e) return res.send('Failed to load tasks.')
        res.json(JSON.stringify(arr))
    })
})

module.exports = router