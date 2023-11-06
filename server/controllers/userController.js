import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const register = asyncHandler(async (req, res, next) => {
    const {name, email, password, degree, school} = req.body;
    const userExists = await User.findOne({ "email" : { $regex : new RegExp(email, "i") } });
    if (userExists) {
        res.status(400)
        throw new Error('User with that email already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email: email,
        password: hashedPassword,
        degree,
        school
    });
    sendEmail(user.email, 'Verify your email', `Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`);
    res.status(201).json({
        success: true
    });
});


const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    var user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    if(!user.isVerified) {
        res.status(400);
        throw new Error('Please verify your email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id);
    delete user._doc["password"]
    delete user._doc["createdAt"]
    delete user._doc["updatedAt"]
    delete user._doc["__v"]
    res.status(200).json({
        success: true,
        user: {
            ...user._doc,
            token: token
        }
    });
});

const verify = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({
        success: true
    });
});

const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    res.status(200).json({
        success: true,
        user: user
    });
});

const updateUserInfo = asyncHandler(async (req, res, next) => {
    const { name, email, degree, school } = req.body;
    if(!name, !email, !degree, !school) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const user = await User.findById(req.user._id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.name = name;
    user.email = email;
    user.degree = degree;
    user.school = school;
    await user.save();
    res.status(200).json({
        success: true,
        user
    });
});

const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    if(!password) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const user = await User.findById(req.user._id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        success: true
    });
});


export {login, register, verify, getUser, updateUserInfo, updateUserPassword};