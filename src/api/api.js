import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Tambahkan interceptor untuk menyertakan token dalam setiap permintaan
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

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
        const response = await axios.post(
          `${api.defaults.baseURL}/api/v1/auth/refresh-token`,
          {},
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
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${api.defaults.baseURL}/api/v1/auth/refresh-token`,
      {},
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

export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// // Fungsi untuk memperbarui token menggunakan refresh token
// const refreshToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem('refreshToken');
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/api/v1/auth/refresh-token`,
//       {
//         refreshToken,
//       },
//     );
//     const newAccessToken = response.data.accessToken;
//     localStorage.setItem('accessToken', newAccessToken);
//     console.log('Token refreshed:', newAccessToken);
//     return newAccessToken;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     throw error;
//   }
// };

// // Interceptor untuk menangani permintaan dan respons
// api.interceptors.request.use(
//   async config => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// api.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const newAccessToken = await refreshToken();
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axios(originalRequest);
//       } catch (error) {
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;
