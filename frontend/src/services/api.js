import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const vehicleService = {
  getAll: () => axios.get(`${API_URL}/vehicles`),
  getById: (id) => axios.get(`${API_URL}/vehicles/${id}`)
};

export const addonService = {
  getAll: (lang = 'ka') => axios.get(`${API_URL}/addons?lang=${lang}`)
};

export const locationService = {
  getAll: (lang = 'ka') => axios.get(`${API_URL}/locations?lang=${lang}`)
};

export const bookingService = {
  create: (data) => axios.post(`${API_URL}/bookings`, data),
  getById: (id) => axios.get(`${API_URL}/bookings/${id}`),
  calculatePrice: (data) => axios.post(`${API_URL}/calculate-price`, data)
};