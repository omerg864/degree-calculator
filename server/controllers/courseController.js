import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import Degree from '../models/degreeModel.js';
import _ from 'lodash';

const getUserCourses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const courses = await Course.aggregate([
        {
            $match: {
                degreeId: user.degree
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                points: 1,
                grade: 1,
                assignments: 1,
                year: 1,
                semester: 1,
                binaryPass: 1,
            }
        },
        {
            $group: {
                _id: {
                    year: "$year",
                    semester: "$semester"
                },
                courses: {
                    $push: {
                        _id: "$_id",
                        name: "$name",
                        points: "$points",
                        grade: "$grade",
                        assignments: "$assignments",
                        year: "$year",
                        semester: "$semester",
                        binaryPass: "$binaryPass",
                    }
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);
    let specialMessage;
    const clean = _.escapeRegExp(process.env.SPECIAL_EMAIL);
    const specialEmailRegex = new RegExp(`^${clean}$`, 'i');
    if(specialEmailRegex.test(req.user.email)) {
        specialMessage = process.env.SPECIAL_MESSAGE_HOME;
    }
    res.status(200).json({
        success: true,
        courses,
        specialMessage
    });
});

const createCourse = asyncHandler(async (req, res, next) => {
    const {name, points, grade, assignments, year, semester} = req.body;
    if (!name || !points || !year || !semester) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    let tempGrade;
    if(assignments.length) {
        tempGrade = null;
    }
    else {
        tempGrade = grade;
    }
    const user = await User.findById(req.user._id);
    const course = await Course.create({
        name,
        points,
        grade: tempGrade,
        assignments,
        year,
        semester,
        degreeId: user.degree
    });
    let specialMessage;
    const clean = _.escapeRegExp(process.env.SPECIAL_EMAIL);
    const specialEmailRegex = new RegExp(`^${clean}$`, 'i');
    if(specialEmailRegex.test(req.user.email)) {
        specialMessage = process.env.SPECIAL_MESSAGE_CREATE_COURSE;
    }
    res.status(201).json({
        success: true,
        course,
        specialMessage
    });
});

const updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    const degree = await Degree.findById(course.degreeId);
    if(!degree) {
        res.status(404);
        throw new Error('Degree not found');
    }
    if (degree.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const {name, points, grade, assignments, binaryPass } = req.body;
    course.name = name;
    course.points = points;
    if(assignments.length) {
        course.grade = null;
    } else {
        course.grade = grade;
    }
    course.assignments = assignments;
    course.binaryPass = binaryPass;
    const updatedCourse = await course.save();
    res.status(200).json({
        success: true,
        course: updatedCourse
    });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    const degree = await Degree.findById(course.degreeId);
    if(!degree) {
        res.status(404);
        throw new Error('Degree not found');
    }
    if (degree.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Course deleted'
    });
});




export {getUserCourses, createCourse, deleteCourse, updateCourse};