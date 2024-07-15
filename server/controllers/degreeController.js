import asyncHandler from 'express-async-handler';
import Degree from '../models/degreeModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';


const addDegree =  asyncHandler(async (req, res, next) => {
    const {name, school} = req.body;
    if(!name || !school) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const degree = await Degree.create({
        name: name,
        school: school,
        userId: req.user._id
    });
    res.status(201).json({
        success: true,
        degree
    });
});

const deleteDegree = asyncHandler(async (req, res, next) => {
    // delete degree
    const { id } = req.params;
    const degree = await Degree.findById(id);
    const user = await User.findById(req.user._id);
    if(!degree) {
        res.status(400);
        throw new Error('Degree not found');
    }
    if (degree.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const degrees = await Degree.find({userId: req.user._id});
    if(degrees.length === 1) {
        res.status(400);
        throw new Error('You must have at least one degree');
    }
    if (degree._id.toString() === req.user.degree.toString()) {
        const newDegree = degrees.find(degree => degree._id.toString() !== req.user.degree.toString());
        user.degree = newDegree._id;
        await user.save();
    }
    const newDegree = await Degree.findById(user.degree);
    const courses = await Course.deleteMany({degreeId: degree._id});
    await Degree.deleteOne({_id: id});
    res.status(200).json({
        success: true,
        message: 'Degree deleted',
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            degree: {
                _id: newDegree._id,
                name: newDegree.name,
                school: newDegree.school
            }
        }
    });
});

const updateDegree = asyncHandler(async (req, res, next) => {
    // update degree
    const { id } = req.params;
    const {name, school} = req.body;
    if(!name || !school) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    const degree = await Degree.findById(id);
    if(!degree) {
        res.status(400);
        throw new Error('Degree not found');
    }
    if (degree.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    degree.name = name;
    degree.school = school;
    await degree.save();
    res.status(200).json({
        success: true,
        degree
    });
});

const transition = asyncHandler(async (req, res, next) => {
    // transition degree
    const courses = await Course.find({});
    for(let i = 0; i < courses.length; i++) {
        let course = courses[i];
        console.log(course);
        let user = await User.findById(course.userId);
        course.degreeId = user.degree;
        await course.save();
    }
    res.status(201).json({
        success: true,
        message: 'Transition successful'
    });
});


export { addDegree, deleteDegree, updateDegree, transition }