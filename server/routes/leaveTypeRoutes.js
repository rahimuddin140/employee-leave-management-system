import express from 'express';
import {
  getLeaveTypes,
  getLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
} from '../controllers/leaveTypeController.js';
import { protect, allowRoles } from '../middleware/authHandler.js';

const router = express.Router();

router.use(protect);

router.get('/', getLeaveTypes);
router.get('/:id', getLeaveTypeById);
router.post('/', allowRoles('admin'), createLeaveType);
router.put('/:id', allowRoles('admin'), updateLeaveType);
router.delete('/:id', allowRoles('admin'), deleteLeaveType);

export default router;
