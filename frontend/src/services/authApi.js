import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const userRegister = async ({ firstName, lastName, phone, email, password }) => {
  const res = await axios.post(`${API_URL}/auth/register`, {
    first_name: firstName,
    last_name: lastName,
    phone,
    email: email || null,
    password
  });
  return res.data;
};

export const userLogin = async ({ identifier, password }) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    identifier,
    password
  });
  return res.data;
};

export const adminLogin = async ({ username, password }) => {
  const res = await axios.post(`${API_URL}/admin/login`, {
    username,
    password
  });
  return res.data;
};
