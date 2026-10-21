import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchLeaveById, cancelLeaveApi } from '../api/leaveApi.js';

const LeaveDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeave = async () => {
      try {
        const data = await fetchLeaveById(id, user.token);
        setLeave(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadLeave();
  }, [id, user.token]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this pending leave request?')) return;
    setCancelling(true);
    try {
      await cancelLeaveApi(id, user.token);
      navigate(user.role === 'admin' ? '/admin/requests' : '/my-leaves');
    } catch (err) {
      setError(err.message);
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">Approved</span>;
    }
    if (status === 'Pending') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</span>;
    }
    if (status === 'Rejected') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Rejected</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">Cancelled</span>;
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 text-sm">Loading leave details...</div>;
  }

  if (error || !leave) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md mb-4">
          {error || 'Leave request not found'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Back
        </button>
        <div>{getStatusBadge(leave.status)}</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">
            {leave.leaveType?.name} ({leave.leaveType?.code})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Application ID: {leave._id} • Applied on {new Date(leave.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">Employee Name</span>
              <span className="text-sm font-semibold text-gray-800">{leave.employee?.name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">Employee ID</span>
              <span className="text-sm font-semibold text-gray-800">{leave.employee?.employeeId}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">Department</span>
              <span className="text-sm font-semibold text-gray-800">{leave.employee?.department}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">Designation</span>
              <span className="text-sm font-semibold text-gray-800">{leave.employee?.designation}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-gray-100 py-4">
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">From Date</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(leave.fromDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">To Date</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(leave.toDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block uppercase font-medium">Working Days</span>
              <span className="text-base font-bold text-blue-600">{leave.days} days</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Reason for Leave
            </h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              {leave.reason}
            </p>
          </div>

          {leave.remarks && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Admin / HR Remarks
              </h3>
              <p className="text-sm text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-md">
                {leave.remarks}
              </p>
            </div>
          )}

          {user.role === 'employee' && leave.status === 'Pending' && (
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel This Leave Request'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetail;
