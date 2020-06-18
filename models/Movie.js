const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema =new Schema({
    title : String, 
    releaseYear : Number, 
    imdbRating : Number, 
    description : String, image : String,
    coverPath : String
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = {Movie, movieSchema};
