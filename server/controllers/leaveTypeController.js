import LeaveType from '../models/LeaveType.js';
import LeaveRequest from '../models/LeaveRequest.js';

export const getLeaveTypes = async (req, res, next) => {
  try {
    const types = await LeaveType.find().sort({ createdAt: 1 });
    res.status(200).json(types);
  } catch (error) {
    next(error);
  }
};

export const getLeaveTypeById = async (req, res, next) => {
  try {
    const type = await LeaveType.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    res.status(200).json(type);
  } catch (error) {
    next(error);
  }
};

export const createLeaveType = async (req, res, next) => {
  try {
    const { name, code, yearlyQuota, description } = req.body;

    if (!name || !code || !yearlyQuota) {
      return res.status(400).json({ message: 'Name, code and yearly quota are required' });
    }

    const type = await LeaveType.create({
      name,
      code: code.toUpperCase(),
      yearlyQuota: Number(yearlyQuota),
      description: description || ''
    });

    res.status(201).json(type);
  } catch (error) {
    next(error);
  }
};

export const updateLeaveType = async (req, res, next) => {
  try {
    const { name, code, yearlyQuota, description } = req.body;

    const type = await LeaveType.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Leave type not found' });
    }

    if (name) type.name = name;
    if (code) type.code = code.toUpperCase();
    if (yearlyQuota) type.yearlyQuota = Number(yearlyQuota);
    if (description !== undefined) type.description = description;

    const updated = await type.save();
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteLeaveType = async (req, res, next) => {
  try {
    const type = await LeaveType.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Leave type not found' });
    }

    const hasRequests = await LeaveRequest.findOne({ leaveType: req.params.id });
    if (hasRequests) {
      return res.status(400).json({ message: 'Cannot delete leave type that has associated leave requests' });
    }

    await LeaveType.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave type deleted successfully' });
  } catch (error) {
    next(error);
  }
};
