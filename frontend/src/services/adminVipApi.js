import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const setVipAdmin = async (token, listingId, { enable, days, rank } = {}) => {
  const payload = { enable };
  if (days != null) payload.days = days;
  if (rank != null) payload.rank = rank;
  const res = await axios.post(`${API_URL}/admin/listings/${listingId}/vip`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getVipAdmin = async (token) => {
  const res = await axios.get(`${API_URL}/admin/vip-listings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
