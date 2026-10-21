const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const applyLeaveApi = async (leaveData, token) => {
  const res = await fetch(`${BASE_URL}/leaves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(leaveData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit leave request');
  return data;
};

export const fetchMyLeaves = async (status, token) => {
  let url = `${BASE_URL}/leaves/my`;
  if (status && status !== 'All') {
    url += `?status=${status}`;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch your leaves');
  return data;
};

export const fetchMyBalances = async (token) => {
  const res = await fetch(`${BASE_URL}/leaves/balance`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leave balance');
  return data;
};

export const fetchLeaveById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/leaves/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leave details');
  return data;
};

export const cancelLeaveApi = async (id, token) => {
  const res = await fetch(`${BASE_URL}/leaves/${id}/cancel`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to cancel leave request');
  return data;
};

export const fetchAllLeaves = async (status, department, token) => {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.append('status', status);
  if (department && department !== 'All') params.append('department', department);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/leaves${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leave requests');
  return data;
};

export const updateLeaveStatusApi = async (id, payload, token) => {
  const res = await fetch(`${BASE_URL}/leaves/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update leave status');
  return data;
};

export const fetchDashboardStats = async (token) => {
  const res = await fetch(`${BASE_URL}/leaves/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load dashboard metrics');
  return data;
};
