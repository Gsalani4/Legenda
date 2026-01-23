import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const getUserDetail = async (token, userId) => {
  const res = await axios.get(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateUserDetail = async (token, userId, payload) => {
  const res = await axios.put(`${API_URL}/admin/users/${userId}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const resetUserPassword = async (token, userId) => {
  const res = await axios.post(`${API_URL}/admin/users/${userId}/reset-password`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserListingsAdmin = async (token, userId) => {
  const res = await axios.get(`${API_URL}/admin/users/${userId}/listings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const archiveListingAdmin = async (token, listingId) => {
  const res = await axios.post(`${API_URL}/admin/listings/${listingId}/archive`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteListingAdmin = async (token, listingId) => {
  const res = await axios.delete(`${API_URL}/admin/listings/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const setListingExpiryAdmin = async (token, listingId, days) => {
  const res = await axios.post(`${API_URL}/admin/listings/${listingId}/set-expiry`, { days }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
