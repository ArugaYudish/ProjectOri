import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { decryptUserData } from "../../utils/api";
import axios from "axios";

const Activation = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const initialized = useRef(false)
    const [loginStatus, setLoginStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [userData, setUserData] = useState(null);

    const activateUser = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const resRegister = await fetch(`${apiUrl}/api/v1/users/register/${id}`, {
                method: 'GET'
            });

            const data = await resRegister.json();

            console.log(data.meta.message, data);
            const email = localStorage.getItem("email")
            const password = localStorage.getItem("password")
            if (data.meta.code === 200 && email !== null && password !== null) {
                const response = await axios.post(`${apiUrl}/api/v1/auth/login`, {
                    email,
                    password
                });

                // Check if response contains data and access token
                if (
                    response.data &&
                    response.data.data &&
                    response.data.data.access_token &&
                    response.data.data.user_data
                ) {
                    const accessToken = response.data.data.access_token;
                    const encryptedUserData = response.data.data.user_data;

                    console.log(accessToken);
                    console.log(encryptedUserData);

                    // Store access token in localStorage
                    localStorage.setItem('accessToken', accessToken);
                    console.log('Token stored:', localStorage.getItem('accessToken'));

                    // Decrypt user data
                    const decryptedUserData = await decryptUserData(encryptedUserData);
                    setUserData(decryptedUserData);
                    localStorage.setItem('userId', decryptedUserData.id); // Assuming decryptedUserData contains id field
                    localStorage.setItem('role', decryptedUserData.role);
                    localStorage.setItem('Ballance', decryptedUserData.balance); // Assuming decryptedUserData contains id field

                    // Set login status to success
                    setLoginStatus('success');
                    setErrorMessage('');
                    localStorage.removeItem("email")
                    localStorage.removeItem("password")

                    if (decryptedUserData.role === 'admin') {
                        navigate('/asdhakdls/dashboard');
                    } else {
                        navigate('/wallet');
                    }
                    // Redirect user or handle successful login here
                } else {
                    // Handle unexpected response format
                    setLoginStatus('error');
                    setErrorMessage('Login Failed: Unexpected response format');
                }
            } else {
                navigate('/login', { state: data });
            }
        } catch (error) {
            console.log(error.message)
            const data = {
                meta: {
                    code: 500,
                    message: error.message
                }
            }

            navigate('/login', { state: data });
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            activateUser()
        }
    }, [])
}

export default Activation