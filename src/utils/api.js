import axios from "axios"

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL
})

// Tambahkan interceptor untuk menyertakan token dalam setiap permintaan
api.interceptors.request.use((config) => {
	const token = sessionStorage.getItem("accessToken")
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Tambahkan interceptor untuk refresh token
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (
			error.response &&
			error.response.status === 200 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true
			try {
				const refreshToken = sessionStorage.getItem("accessToken")
				const response = await axios.get(
					`${api.defaults.baseURL}/api/v1/auth/refresh-token`,
					{
						headers: {
							Authorization: `Bearer ${refreshToken}`
						}
					}
				)

				if (
					response.data &&
					response.data.data &&
					response.data.data.access_token
				) {
					const newAccessToken = response.data.data.access_token
					sessionStorage.setItem("accessToken", newAccessToken)
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
					return api(originalRequest)
				}
			} catch (refreshError) {
				console.error("Failed to refresh token:", refreshError)
				sessionStorage.clear()
				return Promise.reject(refreshError)
			}
		}

		if (
			error.response &&
			error.response.data.meta.message === "Failed to create withdrawal" &&
			!originalRequest._retry
		) {
			return Promise.reject(error)
		}

		if (
			error.response &&
			error.response.data.meta.reason === "Key: 'UpdatePackageInput.Price' Error:Field validation for 'Price' failed on the 'numeric' tag" &&
			!originalRequest._retry
		) {
			return Promise.reject(error)
		}
    
		sessionStorage.clear()
		console.log(error)
		return Promise.reject(error)
	}
)

export const refreshToken = async () => {
	try {
		const refreshToken = sessionStorage.getItem("accessToken")
		const response = await axios.get(
			`${api.defaults.baseURL}/api/v1/auth/refresh-token`,
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`
				}
			}
		)

		if (
			response.data &&
			response.data.data &&
			response.data.data.access_token
		) {
			const newAccessToken = response.data.data.access_token
			sessionStorage.setItem("accessToken", newAccessToken)
			return newAccessToken
		}
	} catch (error) {
		console.error("Failed to refresh token:", error)
		throw error
	}
}

export const decryptUserData = async (userData) => {
	try {
		const response = await api.post("/api/v1/decrypt", { data: userData })
		return response.data.data
	} catch (error) {
		console.error("Failed to decrypt user data:", error)
		throw error
	}
}

export default api
