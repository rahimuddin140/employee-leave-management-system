import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee'
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'HR', 'Sales', 'Finance', 'Operations']
    },
    designation: {
      type: String,
      required: true,
      trim: true
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
