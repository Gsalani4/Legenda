import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const getUsers = async (token) => {
  const res = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
