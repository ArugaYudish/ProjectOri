import Layout from "../../component/common/Layout"
import Kucing from "../../assets/img/kucing.png"

const NotFound = () => {
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
                    className='flex justify-center items-center padding-general'>
                    <div className="flex flex-col">
                        <div className="flex items-end">
                            <div style={{ fontSize: '40px', fontWeight: 600 }}>404</div>
                            <div style={{ fontSize: '20px', color: "#A67B5B" }}>. Error occured,</div>
                        </div>
                        <div style={{ fontSize: '20px' }}>Woops, Looks like<br />this page doesn't<br />exist.</div>
                        <div className="flex" style={{ fontSize: '20px', color: "#A67B5B" }}>back to<a href="/" style={{ paddingLeft: "5px", color: "#EE4E4E", textDecoration: "underline" }}>home</a></div>
                    </div>
                    <div>
                        <img src={Kucing} alt="kucing" />
                    </div>
                </div>
            </Layout >
        </>
    )
}

export default NotFound