import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Degree from '../models/degreeModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/generalFunctions.js';
import { password_regex, email_regex } from '../utils/consts.js';
import _ from 'lodash';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const register = asyncHandler(async (req, res, next) => {
    const {name, email, password, degree, school} = req.body;
    if(!name, !email, !password, !degree, !school) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    if(!email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
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
        password: hashedPassword
    });
    const newDegree = await Degree.create({
        name: degree,
        school: school,
        userId: user._id
    });
    user.degree = newDegree._id;
    await user.save();
    try {
        success = await sendEmail(user.email, 'Verify your email', `Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`);
    } catch(err) {
        console.log(err);
        user.isVerified = true;
        await user.save();
    }
    if(!success) {
        user.isVerified = true;
        await user.save();
    }
    let specialMessage;
    const clean = _.escapeRegExp(process.env.SPECIAL_EMAIL);
    const specialEmailRegex = new RegExp(`^${clean}$`, 'i');
    if(specialEmailRegex.test(user.email)) {
        specialMessage = process.env.SPECIAL_MESSAGE_REGISTER;
    }
    res.status(201).json({
        success: true,
        specialMessage
    });
});


const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    var user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } }).populate('degree');
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
    delete user._doc["__v"];
    let specialMessage;
    const clean = _.escapeRegExp(process.env.SPECIAL_EMAIL);
    const specialEmailRegex = new RegExp(`^${clean}$`, 'i');
    if(specialEmailRegex.test(user.email)) {
        specialMessage = process.env.SPECIAL_MESSAGE_LOGIN;
    }
    res.status(200).json({
        success: true,
        specialMessage,
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
    const user_degrees = await Degree.find({ userId: req.user._id });
    const degree = user_degrees.find(degree => degree._id.toString() === user.degree.toString());
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            degree: {
                _id: degree._id,
                name: degree.name,
                school: degree.school
            }
        },
        degrees: user_degrees
    });
});

const updateUserInfo = asyncHandler(async (req, res, next) => {
    const { name, email, degree } = req.body;
    if(!name || !email || !degree) {
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
    await user.save();
    let specialMessage;
    const clean = _.escapeRegExp(process.env.SPECIAL_EMAIL);
    const specialEmailRegex = new RegExp(`^${clean}$`, 'i');
    if(specialEmailRegex.test(user.email)) {
        specialMessage = process.env.SPECIAL_MESSAGE_UPDATE;
    }
    res.status(200).json({
        success: true,
        user,
        specialMessage
    });
});

const updateDegree = asyncHandler(async (req, res, next) => {
    const { id } = req.body;
    const degree = await Degree.findById(id);
    if(!degree) {
        res.status(400);
        throw new Error('Degree not found');
    }
    if (degree.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const user = await User.findById(req.user._id);
    user.degree = degree._id;
    await user.save();
    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            degree: {
                _id: degree._id,
                name: degree.name,
                school: degree.school
            }
        }
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

const resetPasswordEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if(!email_regex.test(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }
    const user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } });
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    user.resetPasswordToken = token;
    await user.save();
    let success = true;
    try {
        success = await sendEmail(user.email, 'Reset your password', `Please reset your password by clicking on the link: ${process.env.HOST_ADDRESS}/reset-password/${token}`);
    } catch(err) {
        console.log("email error: " + err);
        user.resetPasswordToken = undefined;
        await user.save();
        success = false;
    }
    res.status(200).json({
        success
    });
});


const resetPasswordToken = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ "resetPasswordToken" : { $regex : new RegExp(`^${token}$`, 'i') } });
    if(!user) {
        res.status(400);
        throw new Error('Invalid token');
    }
    if(!password_regex.test(password)) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    await user.save();
    res.status(200).json({
        success: true
    });
});


export {login, register, verify, getUser, updateUserInfo, updateUserPassword, resetPasswordEmail, resetPasswordToken, updateDegree};