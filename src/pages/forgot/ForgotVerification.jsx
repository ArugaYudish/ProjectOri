import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ForgotVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialized = useRef(false);

  const activateUser = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(
        `${apiUrl}/api/v1/users/forgot-password/${id}`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();
      data.id = id;

      console.log(data.meta.message, data);
      switch (data.meta.code) {
        case 200:
          navigate('/forgot', { state: data });
          break;
        default:
          navigate('/login', { state: data });
          break;
      }
    } catch (error) {
      console.log(error.message);
      const data = {
        meta: {
          code: 500,
          message: error.message,
        },
      };

      navigate('/login', { state: data });
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      activateUser();
    }
  });
};

export default ForgotVerification;
