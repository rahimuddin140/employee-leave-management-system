import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getLeaveById,
  cancelLeave,
  getAllLeaves,
  updateLeaveStatus,
  getDashboardStats
} from '../controllers/leaveController.js';
import { protect, allowRoles } from '../middleware/authHandler.js';

const router = express.Router();

router.use(protect);

router.post('/', allowRoles('employee'), applyLeave);
router.get('/my', allowRoles('employee'), getMyLeaves);
router.get('/balance', allowRoles('employee'), getMyBalance);
router.get('/dashboard/stats', allowRoles('admin'), getDashboardStats);
router.get('/', allowRoles('admin'), getAllLeaves);
router.get('/:id', getLeaveById);
router.patch('/:id/cancel', allowRoles('employee'), cancelLeave);
router.patch('/:id/status', allowRoles('admin'), updateLeaveStatus);

export default router;
