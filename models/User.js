const mongoose = require('mongoose');
const {movieSchema}  = require('./Movie');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    role: String,
    watchList: {
        type: [movieSchema],
        default: []
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;