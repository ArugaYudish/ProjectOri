// utils/token.js

import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL;

const setupTokenRefresh = () => {
  axios.interceptors.response.use(
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
          const refreshToken = sessionStorage.getItem('refreshToken');
          // console.log('Refresh token:', refreshToken);
          if (!refreshToken) {
            console.error('No refresh token available');
            throw new Error('No refresh token available');
          }

          const response = await axios.post(
            `${apiBaseUrl}/api/v1/auth/refresh-token`,
            {
              refresh_token: refreshToken,
            },
          );

          if (
            response.data &&
            response.data.data &&
            response.data.data.access_token
          ) {
            const newAccessToken = response.data.data.access_token;
            // console.log('New access token:', newAccessToken);

            // Simpan access token baru di sessionStorage
            sessionStorage.setItem('accessToken', newAccessToken);

            // Perbarui header Authorization dari request asli
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Kirim ulang request asli dengan token baru
            return axios(originalRequest);
          } else {
            console.error('Invalid refresh token response:', response.data);
            throw new Error('Invalid refresh token response');
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Handle refresh token failure, logout user or show error message
          // For example:
          // logoutUser();
          // showMessage('Session expired, please login again');
          throw refreshError; // Propagate the error so that the original request fails
        }
      }
      return Promise.reject(error);
    },
  );
};

export { setupTokenRefresh };
