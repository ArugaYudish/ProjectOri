import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/common/Sidebar';
import '../../assets/css/user.css';
import { Card, Input, Spin, message, Modal } from 'antd';
import { Bitcoin, Wallet } from 'iconsax-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Wallets = ({ children }) => {
  const [activeButton, setActiveButton] = useState('BTC');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const isTransaction = sessionStorage.getItem('isTransaction');
    if (isTransaction === 'false') {
      navigate('*');
    }
  }, [navigate]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleWithdraw();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await api.post(`/api/v1/transactions/rates`);
        const rateData = response.data.data.currency;
        setRates({
          BTC: rateData['BTC'],
          'USDT.TRC20': rateData['USDT.TRC20'],
          LTC: rateData['LTC'],
          LTCT: rateData['LTCT'],
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch exchange rates');
        setLoading(false);
      }
    };

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await api.get(`/api/v1/users/${userId}`);
        if (response.data && response.data.data && response.data.data.users) {
          const user = response.data.data.users[0];
          if (user.balance !== undefined) {
            setBalance(parseFloat(user.balance));
          }
        }
      } catch (error) {
        // console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    fetchBalance();
  }, []);

  const handleButtonClick = buttonName => {
    setActiveButton(buttonName);
  };

  const handleWithdraw = async () => {
    if (amount >= 10) {
      try {
        const response = await api.post(`/api/v1/withdrawal/create`, {
          currency: activeButton,
          address: walletAddress,
          amount: amount,
        });

        if (response.data.meta.status === 'success') {
          // message.success('Withdrawal request submitted successfully');
          const newBalance = balance - parseFloat(amount);
          setBalance(newBalance);
          sessionStorage.setItem('Balance', newBalance.toString());
          setWalletAddress('');
          setAmount('');
        } else {
          // message.error(response.data.meta.reason);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.meta) {
          // message.error(error.response.data.meta.reason);
        } else {
          // message.error('Failed to submit withdrawal request');
        }
      }
    } else {
      // message.error('Minimum withdraw $10');
      setWalletAddress('');
      setAmount('');
    }
  };

  const renderRates = () => {
    if (loading) {
      return <Spin size='large' />;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return null;
  };

  return (
    <>
      <Sidebar>
        <div>
          <div className='text-3xl py-2 font-bold border-b '>Withdraw</div>

          <div>
            <Card className='border shadow mt-5'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-3'>
                  <div>
                    <Wallet size='40' color='#ca9700' variant='Bold' />
                  </div>
                  <div>
                    <p>Your Balance</p>
                    <p className='text-2xl font-bold'>{`$${parseFloat(
                      balance,
                    ).toFixed(3)}`}</p>{' '}
                  </div>
                </div>
              </div>
            </Card>

            <div className='py-5'>
              <div className='text-xl border-b w-1/2 py-3 flex gap-1 items-center'>
                <Bitcoin size='28' color='#ca9700' variant='Bold' />
                <p>Crypto</p>
              </div>
              <div className='text-gray-400 py-5'>
                Do not withdraw directly to a crowdfunding or ICO address, as
                your account will not be credited with tokens from such sales
              </div>

              <div>
                <div className='inline-flex rounded-md shadow-sm' role='group'>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium ${activeButton === 'BTC'
                      ? 'bg-color-orineko text-white'
                      : 'text-gray-'
                      } border border-gray-400 rounded-s-lg`}
                    onClick={() => handleButtonClick('BTC')}>
                    BTC
                  </button>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium ${activeButton === 'USDT.TRC20'
                      ? 'bg-color-orineko text-white'
                      : 'text-gray-'
                      } border-t border-b border-gray-400`}
                    onClick={() => handleButtonClick('USDT.TRC20')}>
                    USDT (TRC20)
                  </button>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium ${activeButton === 'LTC'
                      ? 'bg-color-orineko text-white'
                      : 'text-gray-'
                      } border border-gray-400 rounded-e-lg`}
                    onClick={() => handleButtonClick('LTC')}>
                    LTC
                  </button>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium ${activeButton === 'LTCT'
                      ? 'bg-color-orineko text-white'
                      : 'text-gray-'
                      } border border-gray-400 rounded-e-lg`}
                    onClick={() => handleButtonClick('LTCT')}>
                    LTCT
                  </button>
                </div>

                <div className='py-5'>
                  {renderRates()}

                  <div className='py-2'>
                    <div>Wallet Address</div>
                    <Input
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value)}
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        borderColor: 'grey',
                      }}
                    />
                  </div>

                  <div className='py-2'>
                    <div>Amount</div>
                    <Input
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      style={{
                        width: '100%',
                        borderRadius: '10px',
                        borderColor: 'grey',
                      }}
                    />
                  </div>

                  <button
                    size='large'
                    className='w-full mt-3 bg-color-orineko text-white py-2'
                    style={{ borderRadius: '10px' }}
                    onClick={showModal}>
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>

      <Modal
        title='Notifications'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
        <p>Are you sure you want to withdraw?</p>
      </Modal>
    </>
  );
};

export default Wallets;

// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../component/common/Sidebar';
// import '../../assets/css/user.css';
// import { Card, Input, Spin, message, Modal } from 'antd';
// import { Bitcoin, Wallet } from 'iconsax-react';
// import axios from 'axios';
// import api from '../../utils/api';
// import { useNavigate } from 'react-router-dom';

// const Wallets = ({ children }) => {
//   const [activeButton, setActiveButton] = useState('BTC');
//   const [rates, setRates] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [balance, setBalance] = useState(0); // Tambahkan state untuk balance
//   const [walletAddress, setWalletAddress] = useState('');
//   const [amount, setAmount] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const navigate = useNavigate()

//   useEffect(() => {
//     const isTransaction = sessionStorage.getItem("isTransaction")
//       if (isTransaction === 'false') {
//         navigate('*')
//     }
//   }, [navigate])

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = async () => {
//     await handleWithdraw();
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         const response = await api.post(`/api/v1/transactions/rates`);
//         const rateData = response.data.data.currency;
//         setRates({
//           BTC: rateData['BTC'],
//           'USDT.TRC20': rateData['USDT.TRC20'],
//           LTC: rateData['LTC'],
//           LTCT: rateData['LTCT'],
//         });
//         setLoading(false);
//       } catch (error) {
//         setError('Failed to fetch exchange rates');
//         setLoading(false);
//       }
//     };

//     const fetchBalance = () => {
//       const userBalance = sessionStorage.getItem('Ballance'); // Ambil balance dari sessionStorage
//       setBalance(userBalance ? parseFloat(userBalance) : 0); // Set state balance
//     };

//     fetchRates();
//     fetchBalance();
//   }, []);

//   const handleButtonClick = buttonName => {
//     setActiveButton(buttonName);
//   };

//   const handleWithdraw = async () => {
//     if (amount >= 10) {
//       try {
//         const response = await api.post(
//           `/api/v1/withdrawal/create`,
//           {
//             currency: activeButton,
//             address: walletAddress,
//             amount: amount,
//           }
//         );

//         if (response.data.meta.status === 'success') {
//           message.success('Withdrawal request submitted successfully');
//           // Update balance locally if needed
//           const newBalance = balance - parseFloat(amount);
//           setBalance(newBalance);
//           sessionStorage.setItem('Balance', newBalance.toString());
//           // Kosongkan form
//           setWalletAddress('');
//           setAmount('');
//         } else {
//           message.error(response.data.meta.reason);
//         }
//       } catch (error) {
//         if (error.response && error.response.data && error.response.data.meta) {
//           console.log(error)
//           message.error(error.response.data.meta.reason);
//         } else {
//           message.error('Failed to submit withdrawal request');
//         }
//       }
//     } else {
//       message.error('Minimun withdraw $10');
//       setWalletAddress('');
//       setAmount('');
//     }
//   };

//   const renderRates = () => {
//     if (loading) {
//       return <Spin size='large' />;
//     }

//     if (error) {
//       return <div>{error}</div>;
//     }

//     return null;
//   };

//   return (
//     <>
//       <Sidebar>
//         <div>
//           <div className='text-3xl py-2 font-bold border-b '>Withdraw</div>

//           <div>
//             <Card className='border shadow mt-5'>
//               <div className='flex justify-between'>
//                 <div className='flex items-center gap-3'>
//                   <div>
//                     <Wallet size='40' color='#ca9700' variant='Bold' />
//                   </div>
//                   <div>
//                     <p>Your Balance</p>
//                     <p className='text-2xl font-bold'>${balance}</p>{' '}
//                     {/* Tampilkan balance dari state */}
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             <div className='py-5'>
//               <div className='text-xl border-b w-1/2 py-3 flex gap-1 items-center'>
//                 <Bitcoin size='28' color='#ca9700' variant='Bold' />
//                 <p>Crypto</p>
//               </div>
//               <div className='text-gray-400 py-5'>
//                 Do not withdraw directly to a crowdfunding or ICO address, as
//                 your account will not be credited with tokens from such sales
//               </div>

//               <div>
//                 <div className='inline-flex rounded-md shadow-sm' role='group'>
//                   <button
//                     type='button'
//                     className={`px-4 py-2 text-sm font-medium ${
//                       activeButton === 'BTC'
//                         ? 'bg-color-orineko text-white'
//                         : 'text-gray-'
//                     } border border-gray-400 rounded-s-lg`}
//                     onClick={() => handleButtonClick('BTC')}>
//                     BTC
//                   </button>
//                   <button
//                     type='button'
//                     className={`px-4 py-2 text-sm font-medium ${
//                       activeButton === 'USDT.TRC20'
//                         ? 'bg-color-orineko text-white'
//                         : 'text-gray-'
//                     } border-t border-b border-gray-400`}
//                     onClick={() => handleButtonClick('USDT.TRC20')}>
//                     USDT (TRC20)
//                   </button>
//                   <button
//                     type='button'
//                     className={`px-4 py-2 text-sm font-medium ${
//                       activeButton === 'LTC'
//                         ? 'bg-color-orineko text-white'
//                         : 'text-gray-'
//                     } border border-gray-400 rounded-e-lg`}
//                     onClick={() => handleButtonClick('LTC')}>
//                     LTC
//                   </button>
//                   <button
//                     type='button'
//                     className={`px-4 py-2 text-sm font-medium ${
//                       activeButton === 'LTCT'
//                         ? 'bg-color-orineko text-white'
//                         : 'text-gray-'
//                     } border border-gray-400 rounded-e-lg`}
//                     onClick={() => handleButtonClick('LTCT')}>
//                     LTCT
//                   </button>
//                 </div>

//                 <div className='py-5'>
//                   {renderRates()}

//                   <div className='py-2'>
//                     <div>Wallet Address</div>
//                     <Input
//                       value={walletAddress}
//                       onChange={e => setWalletAddress(e.target.value)}
//                       style={{
//                         width: '100%',
//                         borderRadius: '10px',
//                         borderColor: 'grey',
//                       }}
//                     />
//                   </div>

//                   <div className='py-2'>
//                     <div>Amount</div>
//                     <Input
//                       value={amount}
//                       onChange={e => setAmount(e.target.value)}
//                       style={{
//                         width: '100%',
//                         borderRadius: '10px',
//                         borderColor: 'grey',
//                       }}
//                     />
//                   </div>

//                   <button
//                     size='large'
//                     className='w-full mt-3 bg-color-orineko text-white py-2'
//                     style={{ borderRadius: '10px' }}
//                     onClick={showModal}>
//                     Withdraw
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Sidebar>

//       <Modal
//         title='Notifications'
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
//         <p>Are you sure you want to withdraw?</p>
//       </Modal>
//     </>
//   );
// };

// export default Wallets;
