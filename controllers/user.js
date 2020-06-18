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
            role: userType.MOVIE_WATCHER
        });

        return res.status(200).json({ message: 'User has been created' });

    } catch (error) {
        next(error);
    }

}

exports.addMovie = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(422).json({ errors: errors.array()[0].msg });
        
        await Movie.create({
            title : req.body.title.toUpperCase(),
            releaseYear : req.body.releaseYear,
            imdbRating : req.body.imdbRating,
            description : req.body.description,
            coverPath : req.file.path
        });
        return res.status(200).json({message : 'Movie added'});
    } catch (error) {
        fs.unlinkSync(req.file.path);
        next(error);
    }
}

exports.addToWatchList = async (req, res, next) => {
    try{
        const movieId = req.params.movieId;

        const movie = await Movie.findById(movieId);
        if(!movie) return res.status(404).json({message : 'Movie not found'});

        const user = await User.findById(req.user.id);

        const find = user.watchList.find(movie => movie.id === movieId);
        if(find) return res.status(400).json({message : 'Movie already in watchlist'});

        user.watchList.push(movie);
        user.save();
        
        return res.status(200).json({message : 'Movie added to watchlist'});
    } catch(error) {
        next(error);
    }
}

exports.removeFromWatchList = async (req, res, next) => {
    try{
        const moviedId = req.params.movieId;

        const movie = await Movie.findById(moviedId);
        if(!movie) return res.status(404).json({message : 'Movie not found'});

        const user = await User.findById(req.user.id);
        console.log(user.watchList);
        if(user.watchList.length === 0) return res.status(400).json({message : 'Watchlist empty'});

        user.watchList = user.watchList.filter(movie => movie.id !== moviedId);
        user.save();

        return res.status(200).json({message : 'Movie removed from watchlist'});
    } catch(error) {
        next(error);
    }
}