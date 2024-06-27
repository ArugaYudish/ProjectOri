import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/common/Sidebar';
import '../../assets/css/user.css';
import { Card, Input, Spin, message } from 'antd';
import { Bitcoin, Wallet } from 'iconsax-react';
import axios from 'axios';

const Wallets = ({ children }) => {
  const [activeButton, setActiveButton] = useState('BTC');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0); // Tambahkan state untuk balance
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchRates = async () => {
      const token = localStorage.getItem('accessToken'); // Ambil token dari localStorage

      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/transactions/rates`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Tambahkan header Authorization
            },
          },
        );
        const rateData = response.data.data.currency;
        setRates({
          BTC: rateData['BTC'],
          'USDT.TRC20': rateData['USDT.TRC20'],
          LTC: rateData['LTC'],
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch exchange rates');
        setLoading(false);
      }
    };

    const fetchBalance = () => {
      const userBalance = localStorage.getItem('Ballance'); // Ambil balance dari localStorage
      setBalance(userBalance ? parseFloat(userBalance) : 0); // Set state balance
    };

    fetchRates();
    fetchBalance();
  }, []);

  const handleButtonClick = buttonName => {
    setActiveButton(buttonName);
  };

  const handleWithdraw = async () => {
    const token = localStorage.getItem('accessToken'); // Ambil token dari localStorage

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/withdrawal/create`,
        {
          currency: activeButton,
          address: walletAddress,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan header Authorization
          },
        },
      );

      if (response.data.meta.status === 'success') {
        message.success('Withdrawal request submitted successfully');
        // Update balance locally if needed
        const newBalance = balance - parseFloat(amount);
        setBalance(newBalance);
        localStorage.setItem('Balance', newBalance.toString());
        // Kosongkan form
        setWalletAddress('');
        setAmount('');
      } else {
        message.error(response.data.meta.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.meta) {
        message.error(error.response.data.meta.message);
      } else {
        message.error('Failed to submit withdrawal request');
      }
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
                    <p className='text-2xl font-bold'>${balance}</p>{' '}
                    {/* Tampilkan balance dari state */}
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
                    className={`px-4 py-2 text-sm font-medium ${
                      activeButton === 'BTC'
                        ? 'bg-color-orineko text-white'
                        : 'text-gray-'
                    } border border-gray-400 rounded-s-lg`}
                    onClick={() => handleButtonClick('BTC')}>
                    BTC
                  </button>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium ${
                      activeButton === 'USDT.TRC20'
                        ? 'bg-color-orineko text-white'
                        : 'text-gray-'
                    } border-t border-b border-gray-400`}
                    onClick={() => handleButtonClick('USDT.TRC20')}>
                    USDT (TRC20)
                  </button>
                  <button
                    type='button'
                    className={`px-4 py-2 text-sm font-medium ${
                      activeButton === 'LTC'
                        ? 'bg-color-orineko text-white'
                        : 'text-gray-'
                    } border border-gray-400 rounded-e-lg`}
                    onClick={() => handleButtonClick('LTC')}>
                    LTC
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
                    onClick={handleWithdraw}>
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Wallets;
