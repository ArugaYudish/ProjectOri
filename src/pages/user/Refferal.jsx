import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/common/Sidebar';
import '../../assets/css/user.css';
import { Card, Table, message } from 'antd';

const Refferal = () => {
  const [referralData, setReferralData] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalReferral, setTotalReferral] = useState(0);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${apiUrl}/api/v1/transactions/refferal`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.meta.code === 200) {
          const { referral_code, total_amount, total_refferal, refferal_user } =
            result.data.refferal;
          setReferralCode(referral_code);
          setTotalAmount(total_amount);
          setTotalReferral(total_refferal);
          setReferralData(refferal_user);
        } else {
          console.error('Error fetching referral data:', result.meta.message);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    fetchReferralData();
  }, [apiUrl]);

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'package_name',
      width: 150,
    },
    {
      title: 'Persentage Fee',
      dataIndex: 'persentage_fee',
      width: 200,
      render: fee => `${fee}%`,
    },
    {
      title: 'Date Time',
      dataIndex: 'date_time',
      width: 200,
      render: date_time => new Date(date_time).toLocaleString(),
    },
    {
      title: 'Amount Payment',
      dataIndex: 'amount',
      width: 150,
      render: amount => `$${amount.toFixed(2)}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralCode)
      .then(() => {
        message.success('Referral code copied to clipboard');
      })
      .catch(error => {
        message.error('Failed to copy referral code');
        console.error('Error copying to clipboard:', error);
      });
  };

  return (
    <>
      <Sidebar>
        <div>
          <div className='text-3xl py-2 border-b '>Refferal</div>
          <div>
            <div className='mt-5'>
              <Card className='border shadow mt-5'>
                <div>
                  <div>Refferal Code</div>
                  <div className='font-bold text-2xl'>{referralCode}</div>
                  <div>
                    <button
                      size='large'
                      className='mt-3 px-2 bg-color-orineko text-white py-2'
                      style={{ borderRadius: '4px' }}
                      onClick={copyToClipboard}>
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </Card>
              <div className='pt-10 pb-2 text-2xl'>Statistics</div>
              <div className='flex gap-5 pb-5'>
                <div>
                  <div className='text-xl'>${totalAmount.toFixed(2)}</div>
                  <div>Earned in USD</div>
                </div>
                <div className='border-l px-4'>
                  <div className='text-xl'>{totalReferral}</div>
                  <div>Refferal Used</div>
                </div>
              </div>
              <div className='pb-5'>
                <div className='text-2xl pt-5'>Your referrals</div>
              </div>
              <div className='card'>
              <div className="overflow-hidden overflow-x-auto">
                <Table
                  className='table-ant'
                  columns={columns}
                  dataSource={referralData}
                  pagination={{ pageSize: 5 }}
                  rowKey='id'
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Refferal;
