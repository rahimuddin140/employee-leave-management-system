import mongoose from 'mongoose';

const leaveTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    yearlyQuota: {
      type: Number,
      required: true,
      min: 1,
      max: 365
    },
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);
export default LeaveType;
