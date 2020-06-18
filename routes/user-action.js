const express = require('express');
const userController = require('../controllers/user');
const multer = require('multer');
const isAuth = require('../middleware/isAuth').isAuth;
const isMovieAdder = require('../middleware/isMovieAdder').isMovieAdder;
const isMovieWatcher = require('../middleware/isMovieWatcher').isMovieWatcher;
const path = require('path');
const { body } = require('express-validator');
const { Movie } = require('../models/Movie');
const router = express.Router();
const movieController = require('../controllers/movie');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '/movie-covers'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return cb(new Error(process.env.ONLY_IMAGES))
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('moviePicture');

router.post('/add-movie', (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            if (err.message === process.env.ONLY_IMAGES) {
                return res.status(400).json({ message: process.env.ONLY_IMAGES });
            } else {
                next(err);
            }
        }

        next();
    });
}, [isAuth, isMovieAdder], [
    body('title').notEmpty().trim().custom(value => {
        value = value.toUpperCase();
        return Movie.findOne({ title: value })
            .then(movie => {
                if (movie) return Promise.reject('Movie already exists');
            })
    }),
    body('releaseYear').notEmpty().trim().isDecimal(),
    body('imdbRating').notEmpty().trim().isFloat(),
    body('description').notEmpty().trim().isLength({ min: 10 })
], movieController.addMovie);

router.put('/add-toWatchList/:movieId', [isAuth, isMovieWatcher], movieController.addToWatchList);
router.delete('/remove-fromWatchList/:movieId', [isAuth, isMovieWatcher], movieController.removeFromWatchList);
router.get('/getMovies', movieController.getAllMovies);
router.get('/getWatchlist', [isAuth, isMovieWatcher], movieController.getWatchList);

module.exports = router;