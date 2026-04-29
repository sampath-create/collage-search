const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('rtu_token');

const setToken = (token) => {
  if (token) {
    localStorage.setItem('rtu_token', token);
  } else {
    localStorage.removeItem('rtu_token');
  }
};

const clearToken = () => localStorage.removeItem('rtu_token');

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }
  return payload;
};

const fetchColleges = (params) => request(`/api/colleges${buildQuery(params)}`);
const fetchCollege = (id) => request(`/api/colleges/${id}`);
const compareColleges = (ids) => request(`/api/compare?ids=${ids.join(',')}`);
const register = (payload) =>
  request('/api/auth/register', { method: 'POST', body: payload });
const login = (payload) =>
  request('/api/auth/login', { method: 'POST', body: payload });
const fetchMe = (token) => request('/api/auth/me', { token });
const fetchSaved = (token) => request('/api/saved', { token });
const saveCollege = (collegeId, token) =>
  request('/api/saved/colleges', {
    method: 'POST',
    body: { collegeId },
    token
  });
const saveComparison = (collegeIds, token) =>
  request('/api/saved/comparisons', {
    method: 'POST',
    body: { collegeIds },
    token
  });
const deleteSaved = (id, token) =>
  request(`/api/saved/${id}`, { method: 'DELETE', token });

export {
  API_BASE,
  getToken,
  setToken,
  clearToken,
  fetchColleges,
  fetchCollege,
  compareColleges,
  register,
  login,
  fetchMe,
  fetchSaved,
  saveCollege,
  saveComparison,
  deleteSaved
};
