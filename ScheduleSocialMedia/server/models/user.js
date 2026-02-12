const mongoose = require('mongoose');
const { timeStamp } = require('node:console');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profilePic: {
        type: String,
        required: false
    }
}, {timeStamps: true})

module.exports = mongoose.model('users', userSchema);