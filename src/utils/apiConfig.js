// src/utils/apiConfig.js
const API_BASE_URL = "http://localhost:5000/api/auth"; 
const apiConfig = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
};

export default apiConfig;
