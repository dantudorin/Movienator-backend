const userType = require('../helpers/user-types');

exports.isMovieWather = (req, res, next) => {
    if(req.user) {
        const role = req.user.role;

        if(role !== userType.MOVIE_WATCHER) return res.status(401).json({message : 'Unauthorized'})
        
        next();
    }

    return res.status(403).json({message : 'User not logged in'});
}