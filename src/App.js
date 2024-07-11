import React, { useEffect, useState, useRef } from "react"
import Routes from "./routes"
import { refreshToken } from "./utils/api"

const App = () => {
	const [isAfk, setIsAfk] = useState(false)
	const timeoutIdRef = useRef(null)
	const intervalRef = useRef(null)

	useEffect(() => {
		const resetTimeout = () => {
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}
			timeoutIdRef.current = setTimeout(() => {
				setIsAfk(true)
			}, 3600000)
		}

		const checkActivityInterval = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
			intervalRef.current = setInterval(async () => {
				const token = sessionStorage.getItem("accessToken")
				if (token) {
					if (!isAfk) {
						await refreshToken()
						console.log("User is active. Fetching refreshToken...")
					} else {
						console.log("User has been inactive for more than 1 hour. Logging out...")
						sessionStorage.clear()
					}
				}
			}, 3540000)
		}

		const handleActivity = () => {
			if (isAfk) {
				setIsAfk(false)
			}
			resetTimeout()
		}

		document.addEventListener("click", handleActivity)
		document.addEventListener("mousemove", handleActivity)
		document.addEventListener("keydown", handleActivity)
		document.addEventListener("visibilitychange", handleActivity)
		document.addEventListener("touchstart", handleActivity)
		document.addEventListener("scroll", handleActivity)

		checkActivityInterval()
		resetTimeout()

		return () => {
			document.removeEventListener("click", handleActivity)
			document.removeEventListener("mousemove", handleActivity)
			document.removeEventListener("keydown", handleActivity)
			document.removeEventListener("visibilitychange", handleActivity)
			document.removeEventListener("touchstart", handleActivity)
			document.removeEventListener("scroll", handleActivity)

			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isAfk])

	return (
		<div className="App">
			<Routes />
		</div>
	)
}

export default App
