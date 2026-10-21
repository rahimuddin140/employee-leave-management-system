import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LeaveTypeForm from '../components/LeaveTypeForm.jsx';
import { fetchLeaveTypeById, updateLeaveTypeApi } from '../api/leaveTypeApi.js';

const EditLeaveType = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadType = async () => {
      try {
        const data = await fetchLeaveTypeById(id, user.token);
        setInitialData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadType();
  }, [id, user.token]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      await updateLeaveTypeApi(id, formData, user.token);
      navigate('/admin/leave-types');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 text-sm">Loading leave type details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Leave Type</h1>
          <p className="text-sm text-gray-500 mt-1">Modify leave category and annual quota</p>
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
          initialData={initialData}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          buttonText="Update Leave Type"
        />
      </div>
    </div>
  );
};

export default EditLeaveType;
