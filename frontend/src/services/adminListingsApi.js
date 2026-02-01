import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const getAdminListings = async (token, { status = 'active', q = '' } = {}) => {
  const params = { status };
  if (q) params.q = q;
  const res = await axios.get(`${API_URL}/admin/listings`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const setAdminListingStatus = async (token, listingId, { status, days } = {}) => {
  const payload = { status };
  if (days != null) payload.days = days;
  const res = await axios.post(`${API_URL}/admin/listings/${listingId}/status`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
