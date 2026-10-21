import React, { useState, useEffect } from 'react';

const LeaveTypeForm = ({ initialData, onSubmit, submitting, error, buttonText }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    yearlyQuota: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        yearlyQuota: initialData.yearlyQuota || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      code: formData.code.toUpperCase(),
      yearlyQuota: Number(formData.yearlyQuota),
      description: formData.description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Leave Type Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Casual Leave"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Leave Code
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. CL, SL, EL"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm uppercase outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Yearly Quota (Days)
        </label>
        <input
          type="number"
          name="yearlyQuota"
          min="1"
          max="365"
          value={formData.yearlyQuota}
          onChange={handleChange}
          placeholder="e.g. 12"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of when this leave is applicable"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm shadow-sm transition disabled:opacity-50"
      >
        {submitting ? 'Saving...' : buttonText || 'Save Leave Type'}
      </button>
    </form>
  );
};

export default LeaveTypeForm;
