import Layout from "../../component/common/Layout"

const PurchaseSuccess = () => {
    return (
        <>
            <Layout>
                <div
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100vh',
                        background:
                            'radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(245, 206, 91, 0.40) 0%, rgba(245, 206, 91, 0.00) 100%)',
                        backdropFilter: 'blur(21px)',
                    }}
                    className='flex flex-col gap-6 justify-center items-center padding-general'>
                    <div className="text-2xl font-bold">Your Purchase Was Successfull!🐺</div>
                    <div className="text-center">Thank you for subscribing! You now have access to permium crypto trading signals. Click the button below to join our productive<br />Telegram group and start trading smarter today.</div>
                    <button className="px-5 py-1 rounded-sm" style={{ border: "2px solid #37B7C3", backgroundColor: "#EEF7FF" }}><a href="#">✈️ Join Telegram Group</a></button>
                </div>
            </Layout>
        </>
    )
}

export default PurchaseSuccess