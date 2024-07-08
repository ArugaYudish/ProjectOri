import { useNavigate, useParams } from "react-router-dom"
import Layout from "../../component/common/Layout"
import { ReactComponent as Telegeram } from "../../assets/img/Telegram.svg"
import { useEffect, useState } from "react"
import Kucing from "../../assets/img/NotFoundNeko.png"

const Purchase = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [link, setLink] = useState("")
    const [paymentStatus, setPaymentStatus] = useState("")
    const apiUrl = process.env.REACT_APP_API_URL;
    const accessToken = sessionStorage.getItem("accessToken")
    const [time, setTime] = useState(15000)

    useEffect(() => {
        fetchData().then((status) => {
            if (status === "Process") {
                setTimeout(() => {
                    // console.log(time)
                    setTime(val => val * 2)
                }, time)
            }
        })
    }, [time])

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/transactions/validate-purchase/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "content-type": "application/json"
                }
            });

            if (!response.ok) {
                navigate("/")
                return
            }

            const data = await response.json()
            // console.log(data)

            setLink(data.data.purchase.telegram_url)
            setPaymentStatus(data.data.purchase.payment_status)

            return data.data.purchase.payment_status
        } catch (error) {
            console.log(error.message)
            navigate("/")
        }
    }

    const renderComponent = () => {
        switch (paymentStatus) {
            case "Failed":
                return <div style={{ minHeight: "90vh" }} className="flex justify-center items-center padding-general">
                    <div className="flex flex-col justify-center items-center">
                        <div className='flex flex-col'>
                            <div className='flex items-end'>
                                <div style={{ fontSize: '30px', fontWeight: 600 }}>Failed Purchase</div>
                            </div>
                            <div style={{ fontSize: '20px' }}>
                                Woops, Looks like
                                <br />
                                your purchase
                                <br />
                                was failed.
                            </div>
                            <div
                                className='flex'
                                style={{ fontSize: '20px', color: '#A67B5B' }}>
                                let's
                                <a className="px-4 py-1 flex gap-2 text-sm ml-2" style={{ border: "1px solid #34AADF", borderRadius: "4px", color: "#34AADF", backgroundColor: "#F0FAFF" }} href="/#subscription">Join Again</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img style={{ width: "336px" }} src={Kucing} alt="kucing" />
                    </div>
                </div>
            case "Process":
                return <div style={{ minHeight: "90vh" }} className="flex flex-col justify-center padding-general">
                    <div className="py-5" style={{ borderBottom: "1px solid #898989" }}>
                        <p className="font-bold" style={{ fontSize: "32px" }}>Please Wait a Moment...</p>
                        <p>Thank you for your payment. We are currently processing your transaction. This may take a few minutes.</p>
                    </div>
                    <div className="py-5" style={{ borderBottom: "1px solid #898989" }}>
                        <p className="mb-3 font-semibold">What Should You Do Next?</p>
                        <ol className="list-decimal pl-5">
                            <li className="mb-3">Stay Connected<br />Please do not close or refresh this page until the process is complete.</li>
                            <li className="mb-3">Check Your Email<br />We will send you a confirmation email once your payment has been successfully processed.</li>
                            <li className="mb-3">Need Help?<br />If you encounter any issues or need assistance, please contact our support team at <span className="font-semibold">support@orineko.com.</span></li>
                        </ol>
                    </div>
                    <div className="py-5">
                        <p className="font-semibold mb-3">Thank You!</p>
                        <ol className="list-decimal pl-5">
                            <li>We appreciate your patience. We hope you enjoy our crypto trading signal services.</li>
                        </ol>
                    </div>
                </div>
            case "Success":
                return <div style={{ minHeight: "90vh" }} className="flex flex-col gap-6 justify-center items-center padding-general">
                    <div className="text-2xl font-bold text-center">Your Purchase Was Successfull!😻</div>
                    <div className="text-center">Thank you for subscribing! You now have access to premium crypto trading signals. Click the button below to join our exclusive<br />Telegram group and start trading smarter today.</div>
                    <a className="px-4 py-2 font-semibold flex gap-2" style={{ border: "1px solid #34AADF", borderRadius: "4px", color: "#34AADF", backgroundColor: "#F0FAFF" }} href={link}><Telegeram /> Join Telegram Group</a>
                </div>
            default:
                break
        }
    }

    return (
        <>
            <Layout>
                <div
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '90vh',
                        background:
                            '#FEFAEF',
                        backdropFilter: 'blur(21px)',
                        marginTop: "70px"
                    }}>
                    {renderComponent()}
                </div>
            </Layout>
        </>
    )
}

export default Purchase