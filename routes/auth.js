const express = require('express');
const userController = require('../controllers/user');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/login', [
    body('email').not().isEmail().trim().custom(value => {
        return User.findOne({email : value})
                .then(user => {
                    if(!user) return Promise.reject('User not found');
                })
    }),
    body('password').not().isLength({min : 5}).custom((value, {req}) => {
        return User.findOne({email : req.body.email})
                .then(user => {
                    if(!bcrypt.compareSync(value, user.password)) return Promise.reject('Invalid password');
                })
    })
], userController.login);

router.post('/register', [
    body('email').not().isEmail().trim().custom(value => {
        return User.findOne({ email: value })
            .then(user => {
                if (user) return Promise.reject('Email already in use');
            });
    }),
    body('password').not().isLength({ min: 5 }).trim(),
    body('confirm-password').not().trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords mismatched');
        }
        return true;
    })
], userController.register);

module.exports = router;