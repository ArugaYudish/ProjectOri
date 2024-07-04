import React, { useEffect, useState } from 'react'
import Layout from '../../component/common/Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import Logo from "../../assets/img/OriNeko-Logo.png"

const InvoiceForm = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const apiUrl = process.env.REACT_APP_API_URL;
    const id = location.state && location.state.id !== null ? location.state.id : null;
    const currency = location.state && location.state.currency !== null ? location.state.currency : null;
    const discount = location.state && location.state.discount !== null ? location.state.discount : null;
    const link = location.state && location.state.link !== null ? location.state.link : null;
    const invoiceNumber = location.state && location.state.invoiceNumber !== null ? location.state.invoiceNumber : null;
    const userId = sessionStorage.getItem("userId")
    const token = sessionStorage.getItem('accessToken');
    const [date, setDate] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pack, setPack] = useState("")
    const [payment, setPayment] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (id === null) {
            navigate("/")
        }

        if (userId === null || token === null) {
            navigate("/login")
        }

        getTransaction()
    }, [])

    const getTransaction = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/v1/transactions/get`,
                {
                    start_date: moment().subtract(3, 'years').format('YYYY-MM-DD'),
                    end_date: moment().add(5, 'years').format('YYYY-MM-DD')
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            switch (response.data.meta.code) {
                case 200:
                    const data = response.data.data.transaction

                    let isDataExist = false
                    console.log(data)
                    data.forEach((item) => {
                        if (item.id === id) {
                            isDataExist = true
                            const dateOnly = item.date_time.split("WIB ")[1]
                            setDate(dateOnly)
                            setName(item.name)
                            setEmail(item.email)
                            setPack(item.package_name)
                            setPayment(item.total_payment)
                        }
                    })

                    if (!isDataExist) {
                        navigate("/")
                    }

                    setIsLoading(false)
                    break
                default:
                    navigate("/")
            }
        } catch (error) {
            navigate("/")
        }
    }

    return (
        <>
            <Layout>
                {
                    isLoading ?
                        null
                        :
                        <div
                            style={{
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                background:
                                    'radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(245, 206, 91, 0.40) 0%, rgba(245, 206, 91, 0.00) 100%)',
                                backdropFilter: 'blur(21px)',
                                paddingBottom: "50px"
                            }}
                            className='flex flex-col gap-6 justify-center items-center padding-general'>
                            <p style={{ fontSize: "32px", marginTop: "100px" }} className='font-black'>Invoice🧾</p>
                            <div style={{ width: "1160px", backgroundColor: "white", border: "1px solid #F5CE5B" }} className='flex flex-col gap-6 p-5 font-semibold rounded-md'>
                                <img style={{ width: "158px" }} src={Logo} alt='logo' />
                                <div className='flex flex-col'>
                                    <div className='flex justify-between'>
                                        <p>Orineko Crypto Trading Signals</p>
                                        <p>Customer Details</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Invoice Payment Date: <span className='font-black'>{date}</span></p>
                                        <p>Name: <span className='font-black'>{name}</span></p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Invoice Number: <span className='font-black'>{invoiceNumber}</span></p>
                                        <p>Email: <span className='font-black'>{email}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ borderRadius: "10px", overflow: "hidden", backgroundColor: "#CA9700" }}>
                                        <table className='w-full text-center'>
                                            <thead style={{ color: "white" }}>
                                                <tr>
                                                    <th className='py-4'>Package</th>
                                                    <th className='py-4'>Discount(Referral)</th>
                                                    <th className='py-4'>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ backgroundColor: "white", color: "black" }}>
                                                <tr>
                                                    <td className='py-4'>{pack}</td>
                                                    <td className='py-4'>{discount}%</td>
                                                    <td className='py-4'>${payment}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p>Total Payment: <span className='font-black'>${payment}</span></p>
                                    <p>Currency: <span className='font-black'>{currency}</span></p>
                                    <p>Status: <span className='font-black'>Awaiting Payment</span></p>
                                </div>
                            </div>
                            <div style={{ width: "1160px" }} className='flex justify-between gap-5'>
                                <a href="/" style={{ backgroundColor: "white", border: "1px solid #CA9700", color: "#CA9700" }} className='py-3 w-full rounded-md text-center'>Cancel</a>
                                <a href={link} style={{ backgroundColor: "#CA9700", color: "white" }} className='py-3 w-full rounded-md text-center'>Continue to Payment</a>
                            </div>
                        </div>
                }
            </Layout>
        </>
    )
}

export default InvoiceForm