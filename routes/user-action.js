const express = require('express');
const userController = require('../controllers/user');
const multer = require('multer');
const isAuth = require('../middleware/isAuth').isAuth;
const isMovieAdder = require('../middleware/isMovieAdder').isMovieAdder;
const path = require('path');
const router = express.Router();

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
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('movie-picture');

router.post('/add-movie', (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            console.log('De aici se apeleaza eroarea pt imagine' + error);
            next(err);
        }
        console.log('Nu are nicio eroare la incarcarea imaginii.');
        next();
    });
}, isAuth,  userController.addMovie);

module.exports = router;