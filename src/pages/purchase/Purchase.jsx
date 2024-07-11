import { useNavigate, useParams } from "react-router-dom"
import Layout from "../../component/common/Layout"
import { ReactComponent as Telegeram } from "../../assets/img/Telegram.svg"
import { useEffect, useState } from "react"
import { Spin } from "antd"

const Purchase = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const [link, setLink] = useState("")
    const [paymentStatus, setPaymentStatus] = useState("")
    const apiUrl = process.env.REACT_APP_API_URL;
    const accessToken = sessionStorage.getItem("accessToken")
    const [time, setTime] = useState(`15000`)
    const [packages, setPackages] = useState([]);
    const [isfetchingPack, setIsFetchingPack] = useState(true)

    useEffect(() => {
        setPaymentStatus("")
        fetchData().then(status => {
            if (status === "Process") {
                setTimeout(() => {
                    // console.log(time)
                    setTime(val => val * 2)
                }, time)
            } else if (status === "Failed") {
                fetchPackages()
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
            // console.log(error.message)
            navigate("/")
        }
    }

    const fetchPackages = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/packages`);
            const data = await response.json();
            // Urutkan paket-paket berdasarkan package_name di sini
            const sortedPackages = data.data.packages.sort((a, b) => {
                if (a.package_name < b.package_name) return -1;
                if (a.package_name > b.package_name) return 1;
                return 0;
            });
            setPackages(sortedPackages);
            setIsFetchingPack(false)
            // console.log(data.data);
        } catch (error) {
            // console.error('Error fetching packages:', error);
        }
    }

    const renderComponent = () => {
        switch (paymentStatus) {
            case "Failed":
                return <div style={{ minHeight: "90vh" }} className="flex flex-col pt-8 md:pt-0 gap-6 justify-center items-center padding-general">
                    <div className="text-2xl font-bold text-center">Payment Failed!😿</div>
                    <div className="text-center">Oops! Something went wrong with your payment. But don’t worry, you can try again and get access to our premium trading<br />signals. Choose your subscription package below to complete your purchase.</div>
                    {/* subscription */}
                    {
                        isfetchingPack ?
                            <Spin size="large" />
                            :
                            <div
                                className='mx-auto py-6 px-0'>
                                <div className='flex flex-wrap gap-4 md:gap-12 pb-10'>
                                    {packages.map((pack, index) => (
                                        <div
                                            key={pack.id}
                                            className='col-span-1 mt-5 border card-subs p-6'>
                                            <div className='title-card-subs font-bold pb-2'>
                                                {pack.package_name}
                                            </div>
                                            <div className='w-full'>
                                                <p className='py-2'>
                                                    <span className='font-bold'>$</span>
                                                    <span className='text-3xl font-bold'>{pack.price}</span>
                                                    <span className=''>month </span>
                                                </p>
                                                <p className='subs-detail'>{pack.desc_1}</p>
                                                <button
                                                    onClick={() => {
                                                        localStorage.setItem("packDesc", pack.desc_2)
                                                        localStorage.setItem('packId', pack.id);
                                                        navigate('/');
                                                    }}
                                                    type='button'
                                                    className='my-4 text-justify btn-card-subs text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 '>
                                                    <span className='flex justify-between'>
                                                        Start Now
                                                        <svg
                                                            className='w-4 h-6 text-blue dark:text-white'
                                                            aria-hidden='true'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            fill='none'
                                                            viewBox='0 0 14 10'>
                                                            <path
                                                                stroke='currentColor'
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                strokeWidth='2'
                                                                d='M1 5h12m0 0L9 1m4 4L9 9'
                                                            />
                                                        </svg>
                                                    </span>
                                                </button>
                                                <p className='subs-detail pb-4'>{pack.desc_2}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                    }
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
                return <div style={{ minHeight: "90vh" }} className="w-full flex justify-center items-center">
                    <Spin size="large" />
                </div>
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