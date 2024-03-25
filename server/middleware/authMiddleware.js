import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protectUser = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.userToken) {
        try{
            token = req.cookies.userToken;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
})

export {protectUser};