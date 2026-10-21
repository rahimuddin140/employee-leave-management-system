import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeaveTypes, deleteLeaveTypeApi } from '../api/leaveTypeApi.js';

const LeaveTypeList = ({ user }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const loadTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchLeaveTypes(user.token);
      setTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, [user.token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave type?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteLeaveTypeApi(id, user.token);
      await loadTypes();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Types Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure annual quotas and categories for employee leave requests
          </p>
        </div>
        <Link
          to="/admin/leave-types/new"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm shadow-sm transition"
        >
          + Add Leave Type
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Loading leave types...</div>
        ) : types.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No leave types found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Yearly Quota</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {types.map((type) => (
                  <tr key={type._id} className="hover:bg-gray-50/70 transition">
                    <td className="px-4 py-3 font-bold text-blue-600 whitespace-nowrap">
                      <span className="bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                        {type.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {type.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {type.yearlyQuota} days / year
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-sm truncate">
                      {type.description || '—'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-3">
                      <Link
                        to={`/admin/leave-types/${type._id}/edit`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(type._id)}
                        disabled={deletingId === type._id}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingId === type._id ? 'Deleting...' : 'Delete'}
                      </button>
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

export default LeaveTypeList;
