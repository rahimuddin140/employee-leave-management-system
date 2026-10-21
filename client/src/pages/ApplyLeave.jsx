import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchLeaveTypes } from '../api/leaveTypeApi.js';
import { applyLeaveApi } from '../api/leaveApi.js';

const ApplyLeave = ({ user }) => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchLeaveTypes(user.token);
        setTypes(data);
        if (data.length > 0) {
          setLeaveType(data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    loadTypes();
  }, [user.token]);

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (end >= start) {
        let count = 0;
        let cur = new Date(start);
        while (cur <= end) {
          if (cur.getDay() !== 0) {
            count++;
          }
          cur.setDate(cur.getDate() + 1);
        }
        setCalculatedDays(count);
      } else {
        setCalculatedDays(0);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [fromDate, toDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (calculatedDays <= 0) {
      setError('Please choose valid dates (at least one working day excluding Sundays)');
      return;
    }

    setLoading(true);
    try {
      await applyLeaveApi(
        { leaveType, fromDate, toDate, reason },
        user.token
      );
      navigate('/my-leaves');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
          <p className="text-sm text-gray-500 mt-1">Submit your leave request for manager approval</p>
        </div>
        <Link
          to="/my-leaves"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Back to My Leaves
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-white focus:ring-1 focus:ring-blue-500"
            >
              {types.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.code}) — {t.yearlyQuota} days yearly quota
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {fromDate && toDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 flex items-center justify-between">
              <span>Working Days (excluding Sundays):</span>
              <span className="font-bold text-base">{calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Leave
            </label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the reason clearly for HR review..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md text-sm shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Submit Leave Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
