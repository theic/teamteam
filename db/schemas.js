const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const userSchema = mongoose.Schema({
    phone: {type: String, required: true, unique: true},
    email: {type: String, unique: true},
    user_id: Number,
    first_name: String,
    last_name: String,
    token: String,
    date: {type: Date, default: Date.now},
    tasks: [{type: mongoose.Schema.ObjectId, ref: 'Task'}]
})

mongoose.model('User', userSchema)

const taskSchema = mongoose.Schema({
    _creator: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    days_from: Number,
    days_to: Number,
    cost: Number,
    cost_type: String,
    date: {type: Date, default: Date.now}
})

mongoose.model('Task', taskSchema)

const storageSchema = mongoose.Schema({
    phone: Number,
    key: {type: mongoose.Schema.Types.Mixed, unique: true},
    value: mongoose.Schema.Types.Mixed
})

mongoose.model('Storage', storageSchema)