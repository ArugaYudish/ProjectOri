import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../../component/common/admin/Sidebar';
import '../../assets/css/user.css';
import { Table, Spin, message, DatePicker, Button, Modal, Select } from 'antd';
import moment from 'moment';
import api from '../../utils/api';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export

const Transaction = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('Active');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleExport();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchTransactions(startDate, endDate);
  }, [startDate, endDate, status]);

  const fetchTransactions = async (startDate, endDate) => {
    setLoading(true);
    try {
      const payload = {
        status: status === 'both' ? null : status,
        start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
        end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
      };
      const response = await api.post('/api/v1/transactions/get', payload);
      if (
        response.data &&
        response.data.data &&
        response.data.data.transaction
      ) {
        setData(response.data.data.transaction);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchTransactions(startDate, endDate);
  };

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleExport = () => {
    try {
      let filteredData = data.map(item => {
        let { id, user_id, expired_time, telegram_url, checkout_url, ...rest } = item;
        return rest;
      });

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
      XLSX.writeFile(workbook, 'transactions.xlsx');
    } catch (error) {
      console.error('Failed to export data:', error);
      message.error('Failed to export data');
    }
  };

  const columns = [
    {
      title: 'Package name',
      dataIndex: 'package_name',
      width: 150,
    },
    {
      title: 'Username',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
      width: 150,
      render: wallet => `$${wallet}`,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
    },
    {
      title: 'Total Payment',
      dataIndex: 'total_payment',
      width: 150,
    },
    {
      title: 'Date Time',
      dataIndex: 'date_time',
      width: 200,
    },
  ];

  const statusFilter = [
    {
      value: 'Active',
      label: 'Active',
    },
    {
      value: 'Inactive',
      label: 'Inactive',
    },
    {
      value: 'Both',
      label: 'Both',
    },
  ];

  return (
    <>
      <Modal
        title='Notifications'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
        <p>Are you sure you want to export?</p>
      </Modal>
      <SidebarAdmin>
        <div>
          <div className='text-3xl py-2 border-b'>Transaction</div>
          <div className='mt-5'>
            <div className='block md:flex justify-between'>
              <div className='font-bold py-2 '>Transaction</div>
              <div className='block md:flex justify-between items-center'>
                <DatePicker.RangePicker
                  value={[startDate, endDate]}
                  onChange={dates => {
                    if (dates && dates.length === 2) {
                      setStartDate(dates[0]);
                      setEndDate(dates[1]);
                    } else {
                      setStartDate(null);
                      setEndDate(null);
                    }
                  }}
                />
                <div className='py-2 md:py-0'>
                  <Select
                    onChange={value => {
                      setStatus(value);
                    }}
                    value={status}
                    options={statusFilter}
                    className=' md:px-2 '
                  />

                  <Button onClick={showModal} className='ml-2 md:ml-0'>
                    Export
                  </Button>
                </div>
              </div>
            </div>
            <div className='pt-3'>
              <div className='card'>
                {loading ? (
                  <Spin tip='Loading...' />
                ) : (
                  <div className='overflow-hidden overflow-x-auto'>
                    <Table
                      className='table-ant'
                      columns={columns}
                      dataSource={data}
                      pagination={{
                        pageSize: 5,
                      }}
                      rowKey={record => record.id} // Assuming each record has a unique id
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarAdmin>
    </>
  );
};

export default Transaction;
