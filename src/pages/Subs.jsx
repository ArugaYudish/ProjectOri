import React from 'react';
import Layout from '../component/common/Layout';
import '../assets/css/style.css';

const Subscription = () => {
  return (
    <>
      <Layout>
        <div className='mt-5 pt-5 '>
          <div className='mt-5 package-page'>
            <div className='pt-5 capt-subs'>Subscription Plan</div>
            <div className='pt-4 desc-subs'>
              Explore our subscription plans tailored to fit every trader's
              needs. Whether you're just starting out or a seasoned investor, we{' '}
              <br />
              have a plan designed to elevate your trading experience. Unlock
              exclusive benefits, gain access to premium signals, and join a{' '}
              <br />
              thriving community of traders. Select your plan today and take
              your crypto trading journey to new heights.
            </div>
            <div className='pos-card'>
              <div className='card-subs'>
                <div className='col-span-1 mt-5 border card-subs p-6'>
                  <div className='title-card-subs font-bold pb-2'>Nama</div>
                  <div className='w-full'>
                    <p className='py-2'>
                      <span className='font-bold'>$</span>
                      <span className='text-3xl font-bold'>Price </span>
                      <span className=''>month </span>
                    </p>
                    <p className='subs-detail'>deskripsi 1</p>
                    <button
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
                    <p className='subs-detail pb-4'>deskripsi 2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Subscription;
