const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuth = async (req, res, next) => {
    try{
        
        const token = req.body.token;
        console.log(token);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({email : decoded.email});
        if(!user) {
            console.log('Din isAuth');
            return res.status(403).json({message : 'User not found'});
        }
        console.log('Din auth si apeleaza next()');
        req.user = decoded;
        next();

    } catch (error) {
        console.log('Din isAuth');
        return res.status(403).json({message : 'User not logged in'});
    }
}