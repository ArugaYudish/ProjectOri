import React, { useState, useEffect } from "react"
import logo from "../../assets/img/OriNeko-Logo.png"
import "../../assets/css/navbar.css"
import { Dropdown, Space } from "antd"

const Navbar = () => {
	const [scrollBackground, setScrollBackground] = useState(false)
	const name = sessionStorage.getItem("userName")
	const role = sessionStorage.getItem("role")

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 20
			if (isScrolled !== scrollBackground) {
				setScrollBackground(isScrolled)
			}
		}

		window.addEventListener("scroll", handleScroll)

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [scrollBackground])

	const items = [
		{
			key: "1",
			label: (
				<a href="/wallet" className="p-1 flex justify-center">
					Dashboard
				</a>
			)
		},
		{
			key: "2",
			label: (
				<a href="#about" className="p-1 flex justify-center">
					About Us
				</a>
			)
		},
		{
			key: "3",
			label: (
				<a href="#contact" className="p-1 flex justify-center">
					Contact Us
				</a>
			)
		},
		{
			key: "4",
			label: (
				<a href="#key-features" className="p-1 flex justify-center">
					Key Features
				</a>
			)
		},
		{
			key: "5",
			label: (
				<a href="#performance" className="p-1 flex justify-center">
					Performance
				</a>
			)
		},
		{
			key: "6",
			label: (
				<a href="#subscription" className="p-1 flex justify-center">
					Subscription Plan
				</a>
			)
		},
		{
			key: "7",
			label: (
				<>
					{name && role ? (
						<span className="register-button flex justify-center m-1">
							{name} - {role}
						</span>
					) : (
						<a
							href={"/register"}
							className="register-button flex justify-center m-1"
						>
							Register
						</a>
					)}
				</>
			)
		}
	]

	return (
		<>
			<nav
				className={` navbar-color fixed w-full z-20 top-0 start-0 ${scrollBackground ? "navbar-gradient-bg" : "navbar-default-bg"
					}`}
			>
				<div class="sticky padding-general  mx-auto flex flex-wrap items-center justify-between mx-auto p-4">
					<a
						href="/"
						class="flex items-center space-x-3 rtl:space-x-reverse"
					>
						<img src={logo} class="h-8" alt="Flowbite Logo" />
					</a>
					<Dropdown
						menu={{ items }}
						trigger={["click"]}
						className="block sm:hidden items-center inline-flex"
						overlayClassName="w-64"
					>
						<button onClick={(e) => e.preventDefault()}>
							<Space>
								<svg
									className="w-6 h-6 fill-current"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
									/>
								</svg>
							</Space>
						</button>
					</Dropdown>
					<div class="hidden w-full md:block md:w-auto" id="navbar-default">
						<ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
							<li>
								<a
									href="/history"
									class="navbar-text-color block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>
									Dashboard
								</a>
							</li>
							<li>
								<a
									href="#about"
									class="navbar-text-color block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#contact"
									class="block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>
									Contact Us
								</a>
							</li>
							<li>
								<a
									href="#key-features"
									class="block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>
									Key Features
								</a>
							</li>
							<li>
								<a
									href="#performance"
									class="block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>
									Performance
								</a>
							</li>
							<li>
								<a
									href="#subscription"
									class="block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>
									Subscription Plan
								</a>
							</li>
							<li>
								{name && role ? (
									<span className="register-button">
										{name} - {role}
									</span>
								) : (
									<a href={"/register"} className="register-button">
										Register
									</a>
								)}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}

export default Navbar
