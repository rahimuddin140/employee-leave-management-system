import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchAllLeaves, updateLeaveStatusApi } from '../api/leaveApi.js';

const AdminRequests = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'All';
  const departmentFilter = searchParams.get('department') || 'All';

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [remarksText, setRemarksText] = useState({});
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllLeaves(statusFilter, departmentFilter, user.token);
      setLeaves(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter, departmentFilter]);

  const handleStatusUpdate = async (id, status) => {
    setActionId(id);
    setError('');
    try {
      const remarks = remarksText[id] || '';
      await updateLeaveStatusApi(id, { status, remarks }, user.token);
      await loadRequests();
      setRemarksText((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleFilterChange = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'All') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">Approved</span>;
    }
    if (status === 'Pending') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</span>;
    }
    if (status === 'Rejected') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Rejected</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">Cancelled</span>;
  };

  const departments = ['All', 'Engineering', 'HR', 'Sales', 'Finance', 'Operations'];
  const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Employee Leave Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review, approve, or reject employee leave applications
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Status:</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange('status', s)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-medium text-gray-500">Department:</label>
          <select
            value={departmentFilter}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="text-xs border border-gray-300 rounded-md px-2.5 py-1.5 outline-none bg-white focus:ring-1 focus:ring-blue-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading leave applications...</div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No leave requests found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Period</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Days</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Reason</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50/70 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{leave.employee?.name}</div>
                      <div className="text-xs text-gray-500">{leave.employee?.employeeId}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-xs">
                      <div>{leave.employee?.department}</div>
                      <div className="text-gray-400">{leave.employee?.designation}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-xs font-semibold">
                        {leave.leaveType?.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                      {new Date(leave.fromDate).toLocaleDateString()} to{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {leave.days}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate text-xs">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {leave.status === 'Pending' ? (
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder="Add remarks (optional)"
                            value={remarksText[leave._id] || ''}
                            onChange={(e) =>
                              setRemarksText({ ...remarksText, [leave._id]: e.target.value })
                            }
                            className="w-48 px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                              disabled={actionId === leave._id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded text-xs transition disabled:opacity-50"
                            >
                              {actionId === leave._id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                              disabled={actionId === leave._id}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium px-2.5 py-1 rounded text-xs transition disabled:opacity-50"
                            >
                              {actionId === leave._id ? '...' : 'Reject'}
                            </button>
                            <Link
                              to={`/my-leaves/${leave._id}`}
                              className="text-xs text-blue-600 hover:underline font-medium ml-1"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          <span>{leave.remarks ? `Remarks: "${leave.remarks}"` : 'No remarks'}</span>
                          <Link
                            to={`/my-leaves/${leave._id}`}
                            className="block text-blue-600 hover:underline font-medium mt-0.5"
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
