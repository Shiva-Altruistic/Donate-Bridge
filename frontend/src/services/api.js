import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const getMyDonations = async () => {
  const response = await axios.get(`${API_URL}/donations`, getAuthHeaders());
  return response.data;
};

export const getAllDonations = async () => {
  const response = await axios.get(`${API_URL}/donations/all`, getAuthHeaders());
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/user/all`, getAuthHeaders());
  return response.data;
};

export const getAllNGOs = async () => {
  const response = await axios.get(`${API_URL}/ngos`, getAuthHeaders());
  return response.data;
};

export const createNGO = async (ngoData) => {
  const response = await axios.post(`${API_URL}/ngos`, ngoData, getAuthHeaders());
  return response.data;
};

export const createDonation = async (amount, category, type, ngoId, paymentId) => {
  const response = await axios.post(
    `${API_URL}/donations`,
    { amount, category, type, ngoId, paymentId },
    getAuthHeaders()
  );
  return response.data;
};

export const createRazorpayOrder = async (amount) => {
  const response = await axios.post(
    `${API_URL}/donations/order`,
    { amount },
    getAuthHeaders()
  );
  return response.data;
};

export const assignDonation = async (id, ngoId) => {
  const response = await axios.put(
    `${API_URL}/donations/${id}/assign`,
    { ngoId },
    getAuthHeaders()
  );
  return response.data;
};


export const updateDonationStatus = async (id, status) => {
  const response = await axios.put(
    `${API_URL}/donations/${id}/status`,
    { status },
    getAuthHeaders()
  );
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await axios.put(
    `${API_URL}/user/change-password`,
    { oldPassword, newPassword },
    getAuthHeaders()
  );
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axios.delete(
    `${API_URL}/user/delete-account`,
    getAuthHeaders()
  );
  return response.data;
};
