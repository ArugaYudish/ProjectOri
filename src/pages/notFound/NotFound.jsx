import Layout from '../../component/common/Layout';
import Kucing from '../../assets/img/NotFoundNeko.png';

const NotFound = () => {
  return (
    <>
      <Layout>
        <div
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginTop: "70px",
            minHeight: '90vh',
            background:
              '#FEFAEF',
            backdropFilter: 'blur(21px)',
          }}
          className='flex justify-center items-center padding-general'>
          <div className='flex flex-col'>
            <div className='flex items-end'>
              <div style={{ fontSize: '40px', fontWeight: 600 }}>404</div>
              <div style={{ fontSize: '20px', color: '#A67B5B' }}>
                . Error occured,
              </div>
            </div>
            <div style={{ fontSize: '20px' }}>
              Woops, Looks like
              <br />
              this page doesn't
              <br />
              exist.
            </div>
            <div
              className='flex'
              style={{ fontSize: '20px', color: '#A67B5B' }}>
              back to
              <a
                href='/'
                style={{
                  paddingLeft: '5px',
                  color: '#EE4E4E',
                  textDecoration: 'underline',
                }}>
                home
              </a>
            </div>
          </div>
          <div>
            <img style={{ width: "336px" }} src={Kucing} alt='kucing' />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NotFound;
