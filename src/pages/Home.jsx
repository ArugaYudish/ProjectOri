import React, { useState, useEffect, useRef } from 'react';
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
import nekoMoney from '../assets/img/tryneko.svg';
import binance from '../assets/img/binance.svg';
import bybit from '../assets/img/bybit.svg';
import bitget from '../assets/img/bitget.svg';
import okx from '../assets/img/okx.svg';
import mexc from '../assets/img/mexc.svg';
import coinbase from '../assets/img/coinbase.svg';
import kucoin from '../assets/img/kucoin.svg';
import iconPaw from '../assets/img/icon-paw.svg';
import bgKucing from '../assets/img/Rocket.svg';
import RightArrow from '../assets/img/DirectRight-Linear-32px 1.png';
import PawsiteNew from '../assets/img/PawsiteNew.svg';
import { Alert } from 'antd';
import RightIcon from '../assets/img/RightIcon.png';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [display, setDisplay] = useState('none');
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState('Choose Currency');
  const [id, setId] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isreferralOk, setIsReferralOk] = useState(false);
  const [referralDisplay, setReferralDIsplay] = useState('none');
  const [setPack] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const accessToken = sessionStorage.getItem('accessToken');
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [payment, setPayment] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [percentageFee, setPercentageFee] = useState(0);
  const packDesc = localStorage.getItem('packDesc');
  const packId = localStorage.getItem('packId');
  const navigate = useNavigate();
  const aboutUs = useRef(null);
  const contactUs = useRef(null);
  const keyFeatures = useRef(null);
  const performance = useRef(null);
  const subscription = useRef(null);
  const role = sessionStorage.getItem('role');
  const [reminder, setReminder] = useState([]);
  const [viewModal, setViewModal] = useState('buy');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const admin = sessionStorage.getItem('role');
    if (admin === 'admin') {
      navigate('/asdhakdls/dashboard');
    }
  }, [navigate]);

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
        // console.log(data.data);
      } catch (error) {
        // console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
    if (accessToken !== null) {
      fetchCurrencies();
      fetchReminder();
      if (packDesc !== null && packId !== null && role === 'user') {
        subscription.current.scrollIntoView();
        handleStartNowClick({ desc_2: packDesc, id: packId });
        localStorage.removeItem('packDesc');
        localStorage.removeItem('packId');
      }
    }

    localStorage.removeItem('packDesc');
    localStorage.removeItem('packId');

    const loc = window.location.href.split('/');
    switch (loc[3]) {
      case '#about':
        aboutUs.current.scrollIntoView();
        break;
      case '#contact':
        contactUs.current.scrollIntoView();
        break;
      case '#key-features':
        keyFeatures.current.scrollIntoView();
        break;
      case '#performance':
        performance.current.scrollIntoView();
        break;
      case '#subscription':
        subscription.current.scrollIntoView();
        break;
      default:
        break;
    }
  }, []);

  const handleCloseModal = () => {
    setDisplay('none');
    setReferralDIsplay('none');
    setCurrency('Choose Currency');
    setReferralCode('');
    setPayment(0);
    setDiscount(0);
    setTotalPayment(0);
    setIsError(false);
    setPercentageFee(0);
    if (reminder.length === 0) {
      setViewModal('buy');
    } else {
      setViewModal('reminder');
    }
  };

  const handleStartNowClick = async selectedPack => {
    if (accessToken === null) {
      sessionStorage.clear();
      localStorage.setItem('packDesc', selectedPack.desc_2);
      localStorage.setItem('packId', selectedPack.id);
      navigate('/login');
      return;
    }

    const paymentStr = selectedPack.desc_2.replace(
      'Billed as one payment of $',
      '',
    );
    const price = Number(paymentStr);
    setPayment(price);
    setTotalPayment(price);
    setId(selectedPack.id);
    setDisplay('flex');
  };

  const fetchReminder = async () => {
    if (accessToken === null) {
      sessionStorage.clear();
      navigate('/login');
      return;
    }

    const response = await fetch(`${apiUrl}/api/v1/transactions/reminder`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('Ballance');
      sessionStorage.removeItem('email');
      navigate('/login');
      return;
    }

    const data = await response.json();

    if (data.data.transaction !== null) {
      setReminder(data.data.transaction);
      setViewModal('reminder');
    }
  };

  const getUserById = async () => {
    const response = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // console.log(response)
      return data.meta.reason;
    }

    // console.log(data.data.users[0].is_transaction)
    sessionStorage.setItem('isTransaction', data.data.users[0].is_transaction);
    // console.log("get user", data)
    // console.log(data.data.users[0].is_transaction)
    return 'success';
  };

  const fetchCurrencies = async () => {
    if (accessToken === null) {
      sessionStorage.clear();
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/transactions/rates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('Ballance');
        sessionStorage.removeItem('email');
        navigate('/login');
        return;
      }

      const currenciesData = data.data.currency;
      const currenciesName = [];
      const currenciesCode = [];
      const currencies = [];

      let i = 1;
      for (let currencyCode in currenciesData) {
        currenciesCode.push({
          index: i,
          data: currencyCode,
        });
        i++;
      }

      i = 1;
      for (let currencyName of Object.values(currenciesData)) {
        currenciesName.push({
          index: i,
          data: currencyName.name,
        });
        i++;
      }

      currenciesCode.forEach(code => {
        currenciesName.forEach(name => {
          if (code.index === name.index) {
            const tempData = {
              name: name.data,
              code: code.data,
            };

            currencies.push(tempData);
          }
        });
      });

      setCurrencies(currencies);
      // console.log(data)
    } catch (err) {
      // console.log(err)
    }
  };

  const checkReferral = async () => {
    const response = await fetch(
      `${apiUrl}/api/v1/transactions/validate-refferal`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refferal_code: referralCode,
        }),
      },
    );

    const data = await response.json();
    switch (data.meta.code) {
      case 200:
        const referral = data.data.refferal;
        if (referral === referralCode) {
          setIsReferralOk(true);
          setReferralDIsplay('flex');
          setPercentageFee(10);
          setDiscount(payment - ((100 - 10) / 100) * payment);
          setTotalPayment(((100 - 10) / 100) * payment);
        } else {
          setIsReferralOk(false);
          setReferralDIsplay('flex');
          setDiscount(0);
          setPercentageFee(0);
          setTotalPayment(payment);
        }
        break;
      case 401:
        // console.log(data)
        navigate('/login');
        break;
      default:
        const errMessage = data.meta.message;
        const errReason = data.meta.reason;
        setError(`${errMessage}, ${errReason}`);
        setIsError(true);
        // console.log(data);
        break;
    }
  };

  const handleCreateTransaction = async event => {
    event.preventDefault();
    setIsError(false);

    if (currency === 'Choose Currency') {
      setError('Choose your currency first.');
      setIsError(true);
      return;
    }

    try {
      // console.log(id, referralCode, currency);
      const response = await fetch(`${apiUrl}/api/v1/transactions/buy`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_package: id,
          refferal_code: referralCode,
          currency,
        }),
      });

      const data = await response.json();
      switch (data.meta.code) {
        case 200:
          const res = await getUserById();
          if (res !== 'success') {
            const err = res;
            setError(err);
            setIsError(true);
          }
          // console.log("success", data)
          const state = {
            id: data.data.transaction.id,
            currency: currency,
            discount: data.data.transaction.persentage_fee,
            link: data.data.transaction.detail_checkout.checkout_url,
            invoiceNumber: data.data.transaction.detail_checkout.txn_id,
          };
          navigate(`/invoice/${state.id}`, { state: state });
          break;
        case 401:
          // console.log(data)
          navigate('/login');
          break;
        default:
          const errMessage = data.meta.message;
          const errReason = data.meta.reason;
          setError(`${errMessage}, ${errReason}`);
          setIsError(true);
          // console.log(data);
          break;
      }
    } catch (error) {
      // throw new Error(error.message);
    }
  };

  function buyPackage() {
    navigate('/#subscription');
    subscription.current.scrollIntoView();
  }

  return (
    <>
      {/* Buy Popup */}
      <div
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', display: display }}
        className='fixed z-50 inset-0 flex justify-center items-center'>
        {viewModal === 'buy' ? (
          <form
            onSubmit={e => {
              handleCreateTransaction(e);
            }}
            className='buy-modal m-2 flex flex-col text-lg rounded-sm'
            style={{ backgroundColor: 'white' }}>
            <div className='flex justify-between py-5 px-8'>
              <p className='font-bold text-xl'>Choose Payment</p>
              <button
                onClick={() => {
                  handleCloseModal();
                }}
                type='button'
                style={{ fontSize: '2rem' }}>
                x
              </button>
            </div>
            <hr />
            <div className='flex flex-col py-5 px-8 gap-3'>
              <select
                onChange={e => {
                  setCurrency(e.target.value);
                }}
                value={currency}
                style={{
                  backgroundColor: '#fdf5de',
                  color: '#d2a41a',
                  border: '2px solid #d2a41a',
                  boxShadow: 'none',
                  cursor: 'pointer',
                }}
                className='mt-3 rounded-sm py-3 font-bold text-lg'>
                <option hidden>Choose Currency</option>
                {currencies.map((item, index) => (
                  <option key={index} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className='border-2 rounded-sm flex justify-between'>
                <input
                  value={referralCode}
                  onChange={e => {
                    setReferralCode(e.target.value);
                  }}
                  style={{ boxShadow: 'none' }}
                  className='border-0 p-3 w-full text-lg'
                  type='text'
                />
                <button
                  onClick={() => {
                    setReferralDIsplay('none');
                    checkReferral();
                  }}
                  type='button'
                  style={{
                    borderLeftWidth: '2px',
                    backgroundColor: '#fdf5de',
                    color: '#FF8A65',
                    padding: '12px 7% 12px 7%',
                  }}
                  className='font-bold flex gap-1 justify-center items-center'>
                  Redeem
                  <img src={RightArrow} alt='>' />
                </button>
              </div>
              {isreferralOk ? (
                <Alert
                  message='Referral code found.'
                  type='success'
                  style={{ display: referralDisplay }}
                />
              ) : (
                <Alert
                  message='Referral code not found.'
                  type='error'
                  style={{ display: referralDisplay }}
                />
              )}
              <div className='flex flex-col items-end'>
                <p>
                  Billed as one payment of :{' '}
                  <span className='font-bold'>${payment}</span>
                </p>
                <p>
                  Referral Discount ({percentageFee}%) :{' '}
                  <span className='font-bold'>${discount}</span>
                </p>
                <p>
                  Amount Payment :{' '}
                  <span className='font-bold'>${totalPayment}</span>
                </p>
              </div>
              {isError ? <Alert message={error} type='error' /> : null}
            </div>
            <hr />
            <div className='flex justify-end py-3 px-5 gap-3 rounded-sm'>
              <button
                onClick={() => {
                  handleCloseModal();
                }}
                type='button'
                className='border-2 py-2 px-5'>
                Cancel
              </button>
              <button
                type='submit'
                className='py-2 px-5 rounded-sm'
                style={{ backgroundColor: '#d2a41a', color: 'white' }}>
                Continue Payment
              </button>
            </div>
          </form>
        ) : (
          <div
            className='buy-modal m-2 flex flex-col text-lg rounded-sm'
            style={{ backgroundColor: 'white' }}>
            <div className='flex justify-between px-8 py-5'>
              <p className='font-bold'>You Have a Panding Payment</p>
              <button
                onClick={() => {
                  handleCloseModal();
                }}>
                X
              </button>
            </div>
            <hr />
            <div className='p-8 modal-body'>
              <p>
                It looks like you have a remaining payment for your previous
                purchase.
              </p>
              <p className='font-semibold'>Remaining Payment Details:</p>
              <div
                className='payment-item'
                style={{ maxHeight: '200px', overflow: 'auto' }}>
                {reminder.map((item, key) => (
                  <div
                    style={{ border: '1px solid #E5E5E5' }}
                    key={key}
                    className='flex justify-between items-center my-2 py-2 px-5'>
                    <p>
                      Amount Due:{' '}
                      <span className='font-semibold'>
                        ${item.total_payment} ({item.package_name})
                      </span>
                    </p>
                    <a
                      className='flex justify-between items-center gap-1'
                      style={{ color: 'red' }}
                      href={item.checkout_url}>
                      Continue Payment{' '}
                      <img
                        style={{ width: '14px', height: '10px' }}
                        src={RightIcon}
                        alt='->'
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div className='flex justify-end py-3 px-5 gap-3'>
              <button
                onClick={() => {
                  handleCloseModal();
                }}
                style={{ border: '1px solid #D9D9D9', borderRadius: '2px' }}
                className='px-5 py-1'>
                Cancel
              </button>
              <button
                onClick={() => {
                  setViewModal('buy');
                }}
                style={{
                  backgroundColor: '#CEA017',
                  color: 'white',
                  borderRadius: '2px',
                }}
                className='px-5 py-1'>
                Create New Payment
              </button>
            </div>
          </div>
        )}
      </div>

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
                    onClick={buyPackage}
                    type='button'
                    className='flex gap-4 items-center focus:outline-none  bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900'>
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
          ref={aboutUs}
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
        <div
          id='performance'
          ref={performance}
          className='padding-general mx-auto set-feedback'>
          <div className='sm:grid grid-cols-2 gap-12  sm:px-0 '>
            <div className='col-span-1 mx-auto'>
              <img src={PawsiteNew} alt='' />
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
        <div id='contact' ref={contactUs} className='why-neko'>
          <div className='md:px-0 padding-general mx-auto text-justify'>
            <div className='title-features font-bold'>WHY NEKO?</div>
            <div className='sm:grid grid-cols-3 gap-16 pt-10'>
              <div className='col-span-1 py-5 sm:p-0'>
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
              <div className='col-span-1 py-5 sm:p-0'>
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
              <div className='col-span-1 py-5 sm:p-0'>
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
              <div className='col-span-1 py-5 sm:p-0'>
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
              <div className='col-span-1 py-5 sm:p-0'>
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
              <div className='col-span-1 py-5 sm:p-0'>
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
          ref={keyFeatures}
          className='key-features px-16 sm:px-0 padding-general mx-auto'>
          <div className='text-2xl capt-key-features font-bold'>
            KEY FEATURES
          </div>
          <div className='sub-key-features font-bold'>
            What does Neko VIP include?{' '}
          </div>

          <div className='sm:grid grid-cols-3 gap-12 pb-10'>
            <div className='col-span-1 mt-6 border card-features p-5'>
              <div className='title-card-features font-bold pb-2'>
                Exclusive Signals by Neko
              </div>
              <div>
                Exclusive Signals by Neko: High-quality signals for futures,
                spot, and long-term trading. Access to new project and early
                gems information. Available for Auto-Trading
              </div>
            </div>
            <div className='col-span-1 mt-6 border card-features p-5'>
              <div className='title-card-features font-bold pb-2'>
                Market Outlook Analysis & Updates{' '}
              </div>
              <div>
                Market Outlook Analysis & Updates: Insider insights into market
                trends to maximize trading potential.
              </div>
            </div>
            <div className='col-span-1 mt-6 border card-features p-5'>
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
          ref={subscription}
          className='padding-general mx-auto py-6  sm:px-0'>
          <div className='text-center text-3xl font-bold py-6'>
            SUBSCRIPTION PLAN
          </div>
          <div className='text-center sm:w-1/2  mx-auto subs-detail pb-4'>
            <div>
              With lots of unique signal, you can easily make money without
            </div>
            <div>analysis. Be the rich one!</div>
          </div>
          <div className='sm:grid grid-cols-3 gap-12  pb-10'>
            {packages.map((pack, index) => (
              <div
                key={pack.id}
                className='col-span-1 mt-5 mb-5 border card-subs p-6'>
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
                      handleStartNowClick(pack);
                      setPack(pack);
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
              <a href=''>
                <img className='set-image-exchange' src={binance} alt='' />
              </a>
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
            {/* <div className='sm:text-6xl text-5xl color-capt italic flex items-center font-extrabold'>
              TRY <br />
              NEKO <br />
              TODAY!
            </div> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
