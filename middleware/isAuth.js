const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuth = async (req, res, next) => {
    try{
        const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);

        const user = await User.findOne({email : decoded.email});
        if(!user) return res.status(403).json({message : 'User not found'});
    } catch (error) {
        return res.status(403).json({message : 'User not logged in'});
    }
}