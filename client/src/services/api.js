import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getPortfolio = async (userId) => {
  return await axios.get(`${API_BASE_URL}/portfolio/${userId}`);
};

export const buyCrypto = async (userId, coin, virtualMoney) => {
  return await axios.post(`${API_BASE_URL}/portfolio/buy`, { userId, coin, virtualMoney });
};

export const sellCrypto = async (userId, coin, amount) => {
  return await axios.post(`${API_BASE_URL}/portfolio/sell`, { userId, coin, amount });
};

export const getCryptoPrice = async (coin) => {
  return await axios.get(`${API_BASE_URL}/crypto/price/${coin}`);
};
