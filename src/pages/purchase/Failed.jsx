import Layout from "../../component/common/Layout"

const PurchaseFailed = () => {
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
                    <div className="text-2xl font-bold">Your Purchase Was Failed!🤮</div>
                    <div className="text-center">We apologize, but it seems there was an issue when trying to purchase. If the problem persists, please contact our customer support.<br />We apologize for any inconvenience caused.</div>
                </div>
            </Layout>
        </>
    )
}

export default PurchaseFailed