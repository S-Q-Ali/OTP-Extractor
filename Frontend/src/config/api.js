// // src/config/api.js
// const API_BASE_URL = 'http://localhost:3000';

// export const API_ENDPOINTS = {
//   REGISTER: `${API_BASE_URL}/auth/register`,
//   LOGIN: `${API_BASE_URL}/auth/login`,
//   VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
// };

// export const apiRequest = async (url, options = {}) => {
//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   };

//   try {
//     const response = await fetch(url, { ...defaultOptions, ...options });
//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`);
//     }
    
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };



// src/config/api.js
const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
};

export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(data.message || 'Invalid email or password');
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request failed:', error.message);
    throw error;
  }
};