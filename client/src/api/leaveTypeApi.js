const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const fetchLeaveTypes = async (token) => {
  const res = await fetch(`${BASE_URL}/leave-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leave types');
  return data;
};

export const fetchLeaveTypeById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/leave-types/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leave type');
  return data;
};

export const createLeaveTypeApi = async (typeData, token) => {
  const res = await fetch(`${BASE_URL}/leave-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(typeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create leave type');
  return data;
};

export const updateLeaveTypeApi = async (id, typeData, token) => {
  const res = await fetch(`${BASE_URL}/leave-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(typeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update leave type');
  return data;
};

export const deleteLeaveTypeApi = async (id, token) => {
  const res = await fetch(`${BASE_URL}/leave-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete leave type');
  return data;
};
