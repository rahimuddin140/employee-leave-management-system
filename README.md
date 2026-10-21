# QuickEMS - Employee Leave Management System (PS4)

Full Stack MERN project for Problem Statement **PS4: Employee Leave Management System** built with GreatStack EMS tutorial layout and student_admin_project rubric.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + React Router DOM
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Authentication**: JWT + bcryptjs

## Project Layout

```text
├── server/
│   ├── config/db.js
│   ├── models/ (User.js, LeaveType.js, LeaveRequest.js)
│   ├── middleware/ (authHandler.js, errorHandler.js)
│   ├── controllers/ (authController.js, leaveTypeController.js, leaveController.js)
│   ├── routes/ (authRoutes.js, leaveTypeRoutes.js, leaveRoutes.js)
│   ├── .env.example
│   ├── seed.js
│   └── server.js
└── client/
    ├── src/
    │   ├── api/ (authApi.js, leaveTypeApi.js, leaveApi.js)
    │   ├── components/ (Navbar.jsx, ProtectedRoute.jsx, LeaveTypeForm.jsx)
    │   ├── pages/ (Login, Register, ApplyLeave, MyLeaves, LeaveDetail, LeaveTypeList, AddLeaveType, EditLeaveType, AdminRequests, AdminDashboard, NotFound)
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json
    └── vite.config.js
```

## Setup & Running

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and enter your MONGO_URI
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The frontend will run at `http://localhost:5173` and connect to backend at `http://localhost:4000/api`.

## Demo Logins

| Role | Email | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@quickems.com` | `admin123` | HR Manager |
| **Employee** | `aarav@quickems.com` | `emp123` | Engineering |
| **Employee** | `priya@quickems.com` | `emp123` | Engineering |
| **Employee** | `rohan@quickems.com` | `emp123` | Sales |
| **Employee** | `sneha@quickems.com` | `emp123` | Finance |
| **Employee** | `kabir@quickems.com` | `emp123` | Operations |

## Core Business Rules Implemented

1. **Working Days Calculation**: Automatically counts days between start and end dates excluding Sundays.
2. **Date Order Check**: Rejects requests where end date is before start date (400).
3. **Overlap Prevention**: Rejects requests that overlap with existing Pending or Approved leaves for the same employee (409 Conflict).
4. **Quota Balance Enforcement**: Verifies remaining yearly quota before allowing leave application (400 Bad Request).
5. **Approval Deduction**: Balance is deducted only upon Admin approval; re-verifies quota at approval time.
6. **Cancellation**: Employees can cancel only their own Pending requests.
7. **Admin Dashboard**: Real-time counts for Total Employees, Pending Requests, Employees On Leave Today, and Department-wise leave distribution.
