import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const getMyListings = async (token) => {
  const res = await axios.get(`${API_URL}/user/listings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createMyListing = async (token, payload) => {
  const res = await axios.post(`${API_URL}/user/listings`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateMyListing = async (token, id, payload) => {
  const res = await axios.put(`${API_URL}/user/listings/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteMyListing = async (token, id) => {
  const res = await axios.delete(`${API_URL}/user/listings/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
