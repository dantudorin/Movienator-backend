const { validationResult } = require('express-validator');
const User = require('../models/User');
const userType = require('../helpers/user-types');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const {Movie} = require('../models/Movie');
const fs = require('fs');

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors : errors.array() });

        const user = await User.findOne({ email: req.body.email });
        const token = jwt.sign({
            email: user.email,
            role: user.role, 
            id: user.id
        }, process.env.SECRET_KEY, {expiresIn : '24h'});

        return res.status(200).json({token});

    } catch (error) {
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        await User.create({
            email: req.body.email,
            password: hashedPassword,
            role: userType.MOVIE_ADDER
        });

        return res.status(200).json({ message: 'User has been created' });

    } catch (error) {
        next(error);
    }
}