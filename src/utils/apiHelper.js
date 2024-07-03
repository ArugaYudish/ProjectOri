// utils/apiHelper.js

import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL;

export const fetchUsers = async () => {
  const token = sessionStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `${apiBaseUrl}/api/v1/transactions/refferal`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
