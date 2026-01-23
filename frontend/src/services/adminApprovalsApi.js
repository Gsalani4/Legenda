import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const getPendingListings = async (token) => {
  const res = await axios.get(`${API_URL}/admin/pending-listings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const approveListing = async (token, id, days) => {
  const res = await axios.post(`${API_URL}/admin/listings/${id}/approve`, { days }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const rejectListing = async (token, id) => {
  const res = await axios.post(`${API_URL}/admin/listings/${id}/reject`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
