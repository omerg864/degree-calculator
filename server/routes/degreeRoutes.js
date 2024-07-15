import express from 'express';
import { protectUser } from '../middleware/authMiddleware.js';
import { addDegree, deleteDegree, updateDegree, transition } from '../controllers/degreeController.js';

const router = express.Router();


router.route('/').post(protectUser, addDegree);
router.route('/:id').delete(protectUser, deleteDegree);
router.route('/:id').put(protectUser, updateDegree);
//router.route('/transition').get(transition);


export default router;