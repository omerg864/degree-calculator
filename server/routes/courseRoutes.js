import express from 'express';
import { getUserCourses, createCourse, deleteCourse, updateCourse } from '../controllers/courseController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/').get(protectUser, getUserCourses);
router.route('/').post(protectUser, createCourse);
router.route('/:id').delete(protectUser, deleteCourse);
router.route('/:id').put(protectUser, updateCourse);


export default router;