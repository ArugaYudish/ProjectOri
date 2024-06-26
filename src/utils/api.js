import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Tambahkan interceptor untuk menyertakan token dalam setiap permintaan
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tambahkan interceptor untuk refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${api.defaults.baseURL}/api/v1/auth/refresh-token`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        if (
          response.data &&
          response.data.data &&
          response.data.data.access_token
        ) {
          const newAccessToken = response.data.data.access_token;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Handle refresh token failure, logout user or show error message
        // You might want to log out the user here or clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page or handle error accordingly
      }
    }
    return Promise.reject(error);
  },
);

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${api.defaults.baseURL}/api/v1/auth/refresh-token`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    if (
      response.data &&
      response.data.data &&
      response.data.data.access_token
    ) {
      const newAccessToken = response.data.data.access_token;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

export const decryptUserData = async userData => {
  try {
    const response = await api.post('/api/v1/decrypt', { data: userData });
    return response.data.data;
  } catch (error) {
    console.error('Failed to decrypt user data:', error);
    throw error;
  }
};

export default api;
