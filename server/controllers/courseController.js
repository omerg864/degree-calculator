import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';

const getUserCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.aggregate([
        {
            $match: {
                userId: req.user._id
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
    const specialEmailRegex = new RegExp(`^${process.env.SPECIAL_EMAIL}$`, 'i');
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
    const course = await Course.create({
        name,
        points,
        grade,
        assignments,
        year,
        semester,
        userId: req.user._id
    });
    let specialMessage;
    const specialEmailRegex = new RegExp(`^${process.env.SPECIAL_EMAIL}$`, 'i');
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
    const {name, points, grade, assignments, binaryPass } = req.body;
    course.name = name;
    course.points = points;
    course.grade = grade;
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
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Course deleted'
    });
});




export {getUserCourses, createCourse, deleteCourse, updateCourse};