import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchMyLeaves, fetchMyBalances, cancelLeaveApi } from '../api/leaveApi.js';

const MyLeaves = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'All';

  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [balanceData, leaveData] = await Promise.all([
        fetchMyBalances(user.token),
        fetchMyLeaves(statusFilter, user.token)
      ]);
      setBalances(balanceData);
      setLeaves(leaveData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending leave request?')) {
      return;
    }

    setCancellingId(id);
    try {
      await cancelLeaveApi(id, user.token);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
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

  const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leave Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Check your annual leave balance and application status
          </p>
        </div>
        <Link
          to="/apply-leave"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm shadow-sm transition"
        >
          + Apply for Leave
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {balances.map((item) => (
          <div
            key={item.leaveType._id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {item.leaveType.code}
              </span>
              <span className="text-xs text-gray-500">Yearly Quota: {item.yearlyQuota} days</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mt-2">{item.leaveType.name}</h3>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Used</span>
                <span className="font-semibold text-gray-700">{item.usedDays} days</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Available</span>
                <span className="font-bold text-emerald-600 text-base">{item.remainingDays} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-bold text-gray-900">Leave History</h2>

          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((status) => (
              <button
                key={status}
                onClick={() => setSearchParams(status === 'All' ? {} : { status })}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading leave records...</div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} leave requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Dates</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Days</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Reason</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Remarks</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {leave.leaveType?.name} ({leave.leaveType?.code})
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(leave.fromDate).toLocaleDateString()} to{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {leave.days}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs italic">
                      {leave.remarks || '—'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/my-leaves/${leave._id}`}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Details
                      </Link>
                      {leave.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(leave._id)}
                          disabled={cancellingId === leave._id}
                          className="text-xs text-red-600 hover:text-red-800 font-medium ml-2 disabled:opacity-50"
                        >
                          {cancellingId === leave._id ? 'Cancelling...' : 'Cancel'}
                        </button>
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

export default MyLeaves;
