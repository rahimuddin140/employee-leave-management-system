import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import LeaveType from './models/LeaveType.js';
import LeaveRequest from './models/LeaveRequest.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await LeaveRequest.deleteMany({});
    await LeaveType.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('admin123', 10);
    const empPasswordHash = await bcrypt.hash('emp123', 10);

    const admin = await User.create({
      name: 'Vikram Sharma',
      email: 'admin@quickems.com',
      password: passwordHash,
      role: 'admin',
      employeeId: 'ADM-001',
      department: 'HR',
      designation: 'HR Manager',
      joiningDate: new Date('2023-01-15')
    });

    const emp1 = await User.create({
      name: 'Aarav Mehta',
      email: 'aarav@quickems.com',
      password: empPasswordHash,
      role: 'employee',
      employeeId: 'EMP-101',
      department: 'Engineering',
      designation: 'Software Engineer',
      joiningDate: new Date('2023-03-01')
    });

    const emp2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@quickems.com',
      password: empPasswordHash,
      role: 'employee',
      employeeId: 'EMP-102',
      department: 'Engineering',
      designation: 'Frontend Developer',
      joiningDate: new Date('2023-06-15')
    });

    const emp3 = await User.create({
      name: 'Rohan Verma',
      email: 'rohan@quickems.com',
      password: empPasswordHash,
      role: 'employee',
      employeeId: 'EMP-103',
      department: 'Sales',
      designation: 'Account Executive',
      joiningDate: new Date('2023-08-01')
    });

    const emp4 = await User.create({
      name: 'Sneha Gupta',
      email: 'sneha@quickems.com',
      password: empPasswordHash,
      role: 'employee',
      employeeId: 'EMP-104',
      department: 'Finance',
      designation: 'Financial Analyst',
      joiningDate: new Date('2024-01-10')
    });

    const emp5 = await User.create({
      name: 'Kabir Khan',
      email: 'kabir@quickems.com',
      password: empPasswordHash,
      role: 'employee',
      employeeId: 'EMP-105',
      department: 'Operations',
      designation: 'Operations Associate',
      joiningDate: new Date('2024-02-01')
    });

    const cl = await LeaveType.create({
      name: 'Casual Leave',
      code: 'CL',
      yearlyQuota: 12,
      description: 'Casual and urgent personal matters'
    });

    const sl = await LeaveType.create({
      name: 'Sick Leave',
      code: 'SL',
      yearlyQuota: 10,
      description: 'Medical and health related leaves'
    });

    const el = await LeaveType.create({
      name: 'Earned Leave',
      code: 'EL',
      yearlyQuota: 15,
      description: 'Annual planned vacation time'
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const dayAfter = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const threeDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);

    const leaves = [
      {
        employee: emp1._id,
        leaveType: cl._id,
        fromDate: today,
        toDate: tomorrow,
        days: 2,
        reason: 'Personal family work',
        status: 'Approved',
        remarks: 'Approved by HR'
      },
      {
        employee: emp2._id,
        leaveType: sl._id,
        fromDate: yesterday,
        toDate: today,
        days: 2,
        reason: 'Fever and viral infection',
        status: 'Approved',
        remarks: 'Get well soon'
      },
      {
        employee: emp3._id,
        leaveType: el._id,
        fromDate: today,
        toDate: dayAfter,
        days: 3,
        reason: 'Out of town travel',
        status: 'Approved',
        remarks: 'Granted'
      },
      {
        employee: emp1._id,
        leaveType: sl._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6),
        days: 2,
        reason: 'Dental appointment and root canal',
        status: 'Pending',
        remarks: ''
      },
      {
        employee: emp2._id,
        leaveType: cl._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        days: 1,
        reason: 'Attending college convocation',
        status: 'Pending',
        remarks: ''
      },
      {
        employee: emp4._id,
        leaveType: cl._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        days: 2,
        reason: 'Home shifting and renovation',
        status: 'Pending',
        remarks: ''
      },
      {
        employee: emp5._id,
        leaveType: el._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
        days: 3,
        reason: 'Attending family wedding ceremony',
        status: 'Pending',
        remarks: ''
      },
      {
        employee: emp3._id,
        leaveType: sl._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9),
        days: 2,
        reason: 'Migraine headache',
        status: 'Approved',
        remarks: 'Approved'
      },
      {
        employee: emp4._id,
        leaveType: el._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 12),
        days: 4,
        reason: 'Annual family holiday',
        status: 'Approved',
        remarks: 'Approved on time'
      },
      {
        employee: emp5._id,
        leaveType: cl._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
        days: 2,
        reason: 'Urgent personal errand',
        status: 'Rejected',
        remarks: 'Critical team deployment scheduled on these dates'
      },
      {
        employee: emp1._id,
        leaveType: el._id,
        fromDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20),
        toDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 22),
        days: 3,
        reason: 'Trip postponed',
        status: 'Cancelled',
        remarks: ''
      }
    ];

    await LeaveRequest.insertMany(leaves);
    console.log('Database seeded successfully with demo users, leave types, and leave requests.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
