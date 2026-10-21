import LeaveRequest from '../models/LeaveRequest.js';
import LeaveType from '../models/LeaveType.js';
import User from '../models/User.js';

const countWorkingDays = (start, end) => {
  let count = 0;
  let cur = new Date(start);
  while (cur <= end) {
    if (cur.getDay() !== 0) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

const getApprovedDays = async (employeeId, leaveTypeId) => {
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const yearEnd = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

  const leaves = await LeaveRequest.find({
    employee: employeeId,
    leaveType: leaveTypeId,
    status: 'Approved',
    fromDate: { $gte: yearStart, $lte: yearEnd }
  });

  return leaves.reduce((sum, item) => sum + item.days, 0);
};

export const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    const days = countWorkingDays(start, end);
    if (days <= 0) {
      return res.status(400).json({ message: 'Selected range only contains Sundays' });
    }

    const typeDoc = await LeaveType.findById(leaveType);
    if (!typeDoc) {
      return res.status(404).json({ message: 'Leave type not found' });
    }

    const overlapping = await LeaveRequest.findOne({
      employee: req.user._id,
      status: { $in: ['Pending', 'Approved'] },
      fromDate: { $lte: end },
      toDate: { $gte: start }
    });

    if (overlapping) {
      return res.status(409).json({ message: 'Leave dates overlap with an existing request' });
    }

    const usedDays = await getApprovedDays(req.user._id, typeDoc._id);
    if (usedDays + days > typeDoc.yearlyQuota) {
      return res.status(400).json({ message: 'Insufficient leave balance for this leave type' });
    }

    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType: typeDoc._id,
      fromDate: start,
      toDate: end,
      days,
      reason,
      status: 'Pending'
    });

    const populated = await LeaveRequest.findById(leave._id)
      .populate('employee', 'name email employeeId department designation')
      .populate('leaveType', 'name code yearlyQuota');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getMyLeaves = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { employee: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    const leaves = await LeaveRequest.find(filter)
      .populate('leaveType', 'name code yearlyQuota')
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const getMyBalance = async (req, res, next) => {
  try {
    const types = await LeaveType.find().sort({ createdAt: 1 });
    const balances = [];

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const usedDays = await getApprovedDays(req.user._id, type._id);
      balances.push({
        leaveType: type,
        yearlyQuota: type.yearlyQuota,
        usedDays,
        remainingDays: Math.max(0, type.yearlyQuota - usedDays)
      });
    }

    res.status(200).json(balances);
  } catch (error) {
    next(error);
  }
};

export const getLeaveById = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate('employee', 'name email employeeId department designation')
      .populate('leaveType', 'name code yearlyQuota');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (req.user.role !== 'admin' && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(leave);
  } catch (error) {
    next(error);
  }
};

export const cancelLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own requests' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending leave requests can be cancelled' });
    }

    leave.status = 'Cancelled';
    await leave.save();

    res.status(200).json(leave);
  } catch (error) {
    next(error);
  }
};

export const getAllLeaves = async (req, res, next) => {
  try {
    const { status, department } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    let leaves = await LeaveRequest.find(filter)
      .populate('employee', 'name email employeeId department designation')
      .populate('leaveType', 'name code yearlyQuota')
      .sort({ createdAt: -1 });

    if (department && department !== 'All') {
      leaves = leaves.filter(l => l.employee && l.employee.department === department);
    }

    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: `Cannot change status of a ${leave.status} request` });
    }

    if (status === 'Approved') {
      const typeDoc = await LeaveType.findById(leave.leaveType);
      const usedDays = await getApprovedDays(leave.employee, leave.leaveType);
      if (usedDays + leave.days > typeDoc.yearlyQuota) {
        return res.status(400).json({ message: 'Employee has insufficient remaining leave balance' });
      }
    }

    leave.status = status;
    leave.remarks = remarks || '';
    await leave.save();

    const populated = await LeaveRequest.findById(leave._id)
      .populate('employee', 'name email employeeId department designation')
      .populate('leaveType', 'name code yearlyQuota');

    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const pendingRequests = await LeaveRequest.countDocuments({ status: 'Pending' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const onLeaveToday = await LeaveRequest.find({
      status: 'Approved',
      fromDate: { $lte: todayEnd },
      toDate: { $gte: todayStart }
    })
      .populate('employee', 'name email employeeId department designation')
      .populate('leaveType', 'name code');

    const departments = ['Engineering', 'HR', 'Sales', 'Finance', 'Operations'];
    const departmentWiseCount = [];

    const allApproved = await LeaveRequest.find({ status: 'Approved' }).populate('employee', 'department');
    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];
      const count = allApproved.filter(l => l.employee && l.employee.department === dept).length;
      departmentWiseCount.push({ department: dept, count });
    }

    res.status(200).json({
      totalEmployees,
      pendingRequests,
      onLeaveTodayCount: onLeaveToday.length,
      onLeaveToday,
      departmentWiseCount
    });
  } catch (error) {
    next(error);
  }
};
