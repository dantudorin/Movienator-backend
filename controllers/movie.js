const {Movie} = require('../models/Movie');
const fs = require('fs');
const User = require('../models/User');

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

exports.getAllMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find();
        return res.status(200).json({movies});
    } catch (error) {
        next(error);
    }
}

exports.getWatchList = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message : 'User not found'});

        return res.status(200).json({watchList : user.watchList});
    } catch (error) {
        next(error);
    }
}