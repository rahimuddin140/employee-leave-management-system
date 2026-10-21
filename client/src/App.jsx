import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ApplyLeave from './pages/ApplyLeave.jsx';
import MyLeaves from './pages/MyLeaves.jsx';
import LeaveDetail from './pages/LeaveDetail.jsx';
import LeaveTypeList from './pages/LeaveTypeList.jsx';
import AddLeaveType from './pages/AddLeaveType.jsx';
import EditLeaveType from './pages/EditLeaveType.jsx';
import AdminRequests from './pages/AdminRequests.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar user={user} setUser={setUser} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-leaves'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-leaves'} replace />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />

          <Route
            path="/register"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-leaves'} replace />
              ) : (
                <Register setUser={setUser} />
              )
            }
          />

          <Route
            path="/apply-leave"
            element={
              <ProtectedRoute user={user} allowedRole="employee">
                <ApplyLeave user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute user={user} allowedRole="employee">
                <MyLeaves user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-leaves/:id"
            element={
              <ProtectedRoute user={user}>
                <LeaveDetail user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leave-types"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <LeaveTypeList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leave-types/new"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <AddLeaveType user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leave-types/:id/edit"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <EditLeaveType user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <AdminRequests user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        QuickEMS • Full Stack MERN Employee Leave Management System (PS4)
      </footer>
    </div>
  );
};

export default App;
