import express from 'express';
import {login, register, verify, getUser, updateUserInfo, updateUserPassword, resetPasswordEmail, resetPasswordToken, updateDegree, googleAuth} from '../controllers/userController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/').get( protectUser, getUser);
router.route('/').put( protectUser, updateUserInfo);
router.route('/password').put( protectUser, updateUserPassword);
router.route('/degree').put( protectUser, updateDegree);

router.route('/reset-password').post(resetPasswordEmail);
router.route('/reset-password/:token').put(resetPasswordToken);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google').post(googleAuth);
router.route('/verify/:id').get(verify);




export default router;