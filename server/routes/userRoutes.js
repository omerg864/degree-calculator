import express from 'express';
import {login, register, verify} from '../controllers/userController.js';

const router = express.Router();


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/verify/:id').get(verify);


export default router;