import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/style.css';

import Layout from '../component/common/Layout';
import Paw from '../assets/img/Necats.svg';
import '../assets/css/style.css';
import Efficient from '../assets/img/Efficient.svg';
import Transparent from '../assets/img/Transparent.svg';
import Optimized from '../assets/img/Optimized.svg';
import Precision from '../assets/img/Precision.svg';
import Proven from '../assets/img/Proven.svg';
import Expertise from '../assets/img/Expertise.svg';
import Feedback from '../assets/img/Feedback.png';
import nekoMoney from '../assets/img/nekoMoney.png';
import binance from '../assets/img/binance.svg';
import bybit from '../assets/img/bybit.svg';
import bitget from '../assets/img/bitget.svg';
import okx from '../assets/img/okx.svg';
import mexc from '../assets/img/mexc.svg';
import coinbase from '../assets/img/coinbase.svg';
import kucoin from '../assets/img/kucoin.svg';
import iconPaw from '../assets/img/icon-paw.svg';
import bgKucing from '../assets/img/Rocket.svg';
import { Alert, Modal } from 'antd';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [open, setOpen] = useState(false)
  const [currencies, setCurrencies] = useState([])
  const [currency, setCurrency] = useState("")
  const [id, setId] = useState("")
  const [refferalCode, setRefferalCode] = useState("")
  const [pack, setPack] = useState("")
  const apiUrl = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("accessToken")
  const [error, setError] = useState("")
  const [isError, setIsError] = useState(false)

  useEffect(() => {
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
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const navigate = useNavigate();

  const handleStartNowClick = async id => {
    if (accessToken === null) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/transactions/rates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      const currenciesData = data.data.currency
      const currenciesName = [];
      const currenciesCode = [];
      const currencies = []

      let i = 1
      for (let currencyCode in currenciesData) {
        currenciesCode.push({
          index: i,
          data: currencyCode
        })
        i++
      }

      i = 1
      for (let currencyName of Object.values(currenciesData)) {
        currenciesName.push({
          index: i,
          data: currencyName.name
        })
        i++
      }

      currenciesCode.forEach(code => {
        currenciesName.forEach(name => {
          if (code.index === name.index) {
            const tempData = {
              name: name.data,
              code: code.data
            }

            currencies.push(tempData)
          }
        })
      })

      setCurrencies(currencies);
      setCurrency(currencies[0].code)

      console.log(data.meta.message, data);
      switch (data.meta.code) {
        case 200:
          console.log(currencies)
          break;
        default:
          console.log(data)
          break;
      }
    } catch (err) {
      throw new Error(err.message)
    }

    setId(id)
    setOpen(true)
  };

  const handleCreateTransaction = async event => {
    event.preventDefault()
    setIsError(false)

    try {
      console.log(id, refferalCode, currency)
      const response = await fetch(`${apiUrl}/api/v1/transactions/buy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_package: id,
          refferal_code: refferalCode,
          currency
        }),
      })

      const data = await response.json()
      switch (data.meta.code) {
        case 200:
          const link = data.data.transaction.detail_checkout.checkout_url
          window.location.href = link
          break;
        default:
          const errMessage = data.meta.message
          const errReason = data.meta.reason
          setError(`${errMessage}, ${errReason}`)
          setIsError(true)
          console.log(data)
          break;
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return (
    <>
      <Modal
        title={pack}
        open={open}
        onOk={() => { setOpen(false) }}
        onCancel={() => { setOpen(false) }}
        cancelButtonProps={{
          hidden: true
        }}
        okButtonProps={{
          hidden: true
        }}
      >
        <form className='flex flex-col max-w-sm mx-auto w-full' onSubmit={handleCreateTransaction}>
          <div className='pb-2'>
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='currency'>Select your currency</label>
            <select name='currency' className='cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required value={currency} onChange={(e) => { setCurrency(e.target.value) }}>
              {currencies.map((item, index) => (
                <option className='cursor-pointer' key={index} value={item.code}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='pb-2'>
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='referral'>Input your referral code</label>
            <input className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e) => { setRefferalCode(e.target.value) }} type='text' name='referral' />
          </div>
          <Alert className={isError ? "" : "hidden"} message={error} type="error" showIcon />
          <button style={{ backgroundColor: "#d2a41a" }} className='w-full my-4 text-center text-white font-medium rounded-lg px-5 py-3 mb-2' type='submit'>Checkout</button>
        </form>
      </Modal>

      <Layout>
        {/* Landing Page */}
        <div
          style={{
            // backgroundImage: `url(${bgOrineko})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            background:
              'radial-gradient(231% 135.8% at 0.9% 2.98%, rgba(245, 206, 91, 0.40) 0%, rgba(245, 206, 91, 0.00) 100%)',
            backdropFilter: 'blur(21px)',
          }}
          className='pt-20  flex items-center padding-general'>
          <div className='sm:flex '>
            <div className='flex items-center justify-between container '>
              <div className=''>
                <div className='text-5xl font-extrabold title-landing '>
                  Join Neko
                </div>
                <div className='py-3 text-5xl font-extrabold title-landing '>
                  Exclusive Channel
                </div>
                <div className=' text-base'>
                  Make Every Trade Profitable with the Best Trading Signals.
                </div>
                <div className='py-5'>
                  <button
                    type='button'
                    class='flex gap-4 items-center focus:outline-none  bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900'>
                    <div>Join Neko!</div>
                    <div>
                      <img src={iconPaw} alt='' />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className='flex items-center'>
              <img className='w-full' src={bgKucing} alt='' />
            </div>
          </div>
        </div>

        {/* About */}
        <div
          id='about'
          className=' padding-general md:px-0  gap-8 text-about-us  text-justify mx-auto sm:grid grid-cols-5 about-padding'>
          <div className='col-span-2 flex items-center'>
            <img className='' style={{}} src={Paw} alt='' />
          </div>
          <div className='col-span-3 '>
            <div className='capt-landing font-bold pb-3'>HI, NECATS 👋</div>
            <div className='capt-landing-detail pb-10 text-gray-500'>
              <p>
                Established in 2017, Neko is committed to empowering traders for
                informed decision-making. We provide daily signals that go
                beyond the ordinary, ensuring you navigate the complexities of
                the crypto market with knowledge, precision, and timely
                insights.
              </p>
              <p className='pt-4'>
                Our vision is to be your trusted partner in crypto trading
                signals, offering reliable guidance every step of the way. We
                aim to be the name you trust for accurate and timely trading
                signals
              </p>
            </div>

            <div className='flex justify-between text-center'>
              <div>
                <div className='text-2xl font-bold pb-3'>20k</div>
                <div className='text-gray-500'>Follow Us</div>
              </div>
              <div>
                <div className='text-2xl font-bold pb-3'>10k</div>
                <div className='text-gray-500'>Trades</div>
              </div>
              <div>
                <div className='text-2xl font-bold pb-3'>95%</div>
                <div className='text-gray-500'>Accuracy</div>
              </div>
              <div>
                <div className='text-2xl font-bold pb-3'>7+</div>
                <div className='text-gray-500'>
                  <div>Years of</div>
                  <div>Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className='padding-general mx-auto set-feedback'>
          <div className='sm:grid grid-cols-2 gap-12  sm:px-0 '>
            <div className='col-span-1 mx-auto'>
              <img src={Feedback} alt='' />
            </div>
            <div className='col-span-1 flex items-center'>
              <div className=''>
                <div className='font-bold py-5 text-3xl'>
                  PAWSITIVE FEEDBACK
                </div>
                <div className='desc-feedback'>
                  We share common trends and strategies for improving your
                  rental income and making sure you stay in high demand.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Neko*/}
        <div id='contact' className='why-neko'>
          <div className='md:px-0 padding-general mx-auto text-justify'>
            <div className='title-features font-bold'>WHY NEKO?</div>
            <div className='sm:grid grid-cols-3 gap-16 pt-10'>
              <div class='col-span-1 py-5 sm:p-0'>
                <div className='mx-auto justify-center '>
                  <div className='flex justify-center pb-4'>
                    <img src={Efficient} alt='' />
                  </div>
                  <div className='text-2xl font-bold py-3'>EFFICIENT</div>
                  <div className='text-base'>
                    Clear analysis that helps guide informed trading decisions
                    with easy-to-follow signals
                  </div>
                </div>
              </div>
              <div class='col-span-1 py-5 sm:p-0'>
                <div className='mx-auto justify-center '>
                  <div className='flex justify-center pb-4'>
                    <img src={Transparent} alt='' />
                  </div>
                  <div className='text-2xl font-bold py-3'>TRANSPARENT</div>
                  <div className='text-base'>
                    Clear analysis that helps guide informed trading decisions
                    with easy-to-follow signals
                  </div>
                </div>
              </div>
              <div class='col-span-1 py-5 sm:p-0'>
                <div className='mx-auto justify-center '>
                  <div className='flex justify-center pb-4'>
                    <img src={Optimized} alt='' />
                  </div>
                  <div className='text-2xl font-bold py-3'>OPTIMIZED</div>
                  <div className='text-base'>
                    Clear analysis that helps guide informed trading decisions
                    with easy-to-follow signals
                  </div>
                </div>
              </div>
              <div class='col-span-1 py-5 sm:p-0'>
                <div className='mx-auto justify-center '>
                  <div className='flex justify-center pb-4'>
                    <img src={Precision} alt='' />
                  </div>
                  <div className='text-2xl font-bold py-3'>PRECISION</div>
                  <div className='text-base'>
                    Clear analysis that helps guide informed trading decisions
                    with easy-to-follow signals
                  </div>
                </div>
              </div>
              <div class='col-span-1 py-5 sm:p-0'>
                <div className='mx-auto justify-center '>
                  <div className='flex justify-center pb-4'>
                    <img src={Proven} alt='' />
                  </div>
                  <div className='text-2xl font-bold py-3'>PROVEN</div>
                  <div className='text-base'>
                    Clear analysis that helps guide informed trading decisions
                    with easy-to-follow signals
                  </div>
                </div>
              </div>
              <div class='col-span-1 py-5 sm:p-0'>
                <div className='mx-auto justify-center '>
                  <div className='flex justify-center pb-4'>
                    <img src={Expertise} alt='' />
                  </div>
                  <div className='text-2xl font-bold py-3'>Expertise</div>
                  <div className='text-base'>
                    Handled by experienced trader and skilled by analyst with a
                    proven track record
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Feature */}
        <div
          id='key-features'
          className='key-features px-16 sm:px-0 padding-general mx-auto'>
          <div className='text-2xl capt-key-features font-bold'>
            KEY FEATURES
          </div>
          <div className='sub-key-features font-bold'>
            What does Neko VIP include?{' '}
          </div>

          <div class='sm:grid grid-cols-3 gap-12 pb-10'>
            <div class='col-span-1 mt-6 border card-features p-5'>
              <div className='title-card-features font-bold pb-2'>
                Exclusive Signals by Neko
              </div>
              <div>
                Exclusive Signals by Neko: High-quality signals for futures,
                spot, and long-term trading. Access to new project and early
                gems information. Available for Auto-Trading
              </div>
            </div>
            <div class='col-span-1 mt-6 border card-features p-5'>
              <div className='title-card-features font-bold pb-2'>
                Market Outlook Analysis & Updates{' '}
              </div>
              <div>
                Market Outlook Analysis & Updates: Insider insights into market
                trends to maximize trading potential.
              </div>
            </div>
            <div class='col-span-1 mt-6 border card-features p-5'>
              <div className='title-card-features font-bold pb-2'>
                24/7 Support & Portfolio Consultation{' '}
              </div>
              <div>
                24/7 Support & Portfolio Consultation: Professional guidance and
                support about risk management
              </div>
            </div>
          </div>
        </div>

        {/* Subscription */}

        <div
          id='subscription'
          className='padding-general mx-auto py-6  sm:px-0'>
          <div className='text-center text-3xl font-bold py-6'>
            SUBSCRIPTION PLAN
          </div>
          <div className='text-center sm:w-1/2 mx-auto subs-detail pb-4'>
            <div>
              With lots of unique signal, you can easily make money without
            </div>
            <div>analysis. Be the rich one!</div>
          </div>
          <div className='sm:grid grid-cols-3 gap-12 pb-10'>
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
                      handleStartNowClick(pack.id)
                      setPack(pack.package_name)
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
        {/* Exchange */}

        <div className='padding-general mx-auto px-16 sm:px-0'>
          <div className='py-4'>
            <div className='title-exchange'>EXCHANGE</div>
            <div className='desc-exchange'>
              Compatible with All Major Exchanges
            </div>
          </div>
          <div className='flex justify-between items-center py-5'>
            <div>
              <img className='set-image-exchange' src={binance} alt='' />{' '}
            </div>
            <div>
              <img className='set-image-exchange' src={bybit} alt='' />
            </div>
            <div>
              <img className='set-image-exchange' src={bitget} alt='' />
            </div>
          </div>
          <div className='flex justify-between items-center py-5'>
            <div>
              <img className='set-image-exchange' src={okx} alt='' />{' '}
            </div>
            <div>
              <img className='set-image-exchange' src={mexc} alt='' />
            </div>
            <div>
              <img className='set-image-exchange' src={coinbase} alt='' />
            </div>
          </div>
          <div className='flex justify-center items-center py-5 px-16 sm:px-0'>
            <div>
              <img className='set-image-exchange' src={kucoin} alt='' />
            </div>
          </div>
        </div>

        {/* Neko Money */}
        <div className='container mx-auto px-16 sm:px-0 py-6'>
          <div className='sm:flex set-neko-money mx-auto py-6 '>
            <div>
              <img className='h-auto max-w-full' src={nekoMoney} alt='' />
            </div>
            <div className='sm:text-6xl text-5xl color-capt italic flex items-center font-extrabold'>
              TRY <br />
              NEKO <br />
              TODAY!
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
