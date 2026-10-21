import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../api/leaveApi.js';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats(user.token);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user.token]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500 text-sm">Loading dashboard metrics...</div>;
  }

  if (error || !stats) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error || 'Unable to load dashboard data'}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      badge: 'Active Staff',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
      link: '/admin/requests'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      badge: 'Action Required',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      link: '/admin/requests?status=Pending'
    },
    {
      title: 'On Leave Today',
      value: stats.onLeaveTodayCount,
      badge: 'Today',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      link: '#on-leave-today'
    },
    {
      title: 'Tracked Departments',
      value: stats.departmentWiseCount?.length || 0,
      badge: 'Organization',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      link: '/admin/requests'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time leave metrics and active workforce status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/requests?status=Pending"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm shadow-sm transition"
          >
            Review Pending ({stats.pendingRequests})
          </Link>
          <Link
            to="/admin/leave-types"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-md text-sm shadow-sm transition"
          >
            Manage Quotas
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-blue-400 transition block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mt-3">{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div id="on-leave-today" className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Employees on Leave Today ({stats.onLeaveTodayCount})
            </h2>
            <span className="text-xs text-gray-500">Approved leaves covering current date</span>
          </div>

          {stats.onLeaveToday.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              All staff are present. No employees are on leave today.
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.onLeaveToday.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                        {leave.employee?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {leave.employee?.department}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {leave.leaveType?.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {new Date(leave.fromDate).toLocaleDateString()} -{' '}
                        {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {leave.days}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Department-wise Leaves
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Total approved leaves logged across departments
          </p>

          <div className="space-y-3">
            {stats.departmentWiseCount.map((item) => (
              <div
                key={item.department}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100/70 transition"
              >
                <div className="text-sm font-semibold text-gray-800">{item.department}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-blue-600">{item.count}</span>
                  <span className="text-xs text-gray-400">leaves</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
