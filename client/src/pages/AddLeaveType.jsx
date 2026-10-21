import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LeaveTypeForm from '../components/LeaveTypeForm.jsx';
import { createLeaveTypeApi } from '../api/leaveTypeApi.js';

const AddLeaveType = ({ user }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      await createLeaveTypeApi(formData, user.token);
      navigate('/admin/leave-types');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Leave Type</h1>
          <p className="text-sm text-gray-500 mt-1">Define quota and rules for a new leave category</p>
        </div>
        <Link
          to="/admin/leave-types"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ← Back to List
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <LeaveTypeForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          buttonText="Create Leave Type"
        />
      </div>
    </div>
  );
};

export default AddLeaveType;
