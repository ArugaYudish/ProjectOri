import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../component/common/Sidebar';
import { Table, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TelegramIcon from '../../assets/img/Telegram.svg';
import '../../assets/css/user.css';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTable, setActiveTable] = useState('openOrder');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTransactions();
  }, [activeTable]);

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('accessToken');
      const status = activeTable === 'openOrder' ? 'Active' : 'Inactive';

      const response = await axios.post(
        `${apiUrl}/api/v1/transactions/get`,
        {
          user_id: userId,
          status: status,
          start_date: '2023-06-01 11:04:05+07',
          end_date: '2024-09-03 11:04:05+07',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.transaction
      ) {
        setTransactions(response.data.data.transaction);
      } else {
        console.error('Gagal mengambil transaksi:', response.data.meta.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleButtonClick = record => {
    console.log('Button clicked for record:', record);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <span style={{ fontWeight: 'bold' }}>{text}</span>
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'package_name',
      key: 'package_name',
      ...getColumnSearchProps('package_name'),
    },
    {
      title: 'Date Time',
      dataIndex: 'date_time',
      key: 'date_time',
      ...getColumnSearchProps('date_time'),
    },
    {
      title: 'Expired Time',
      dataIndex: 'expired_time',
      key: 'expired_time',
      ...getColumnSearchProps('expired_time'),
    },
    {
      title: 'Total Payment',
      dataIndex: 'total_payment',
      key: 'total_payment',
      ...getColumnSearchProps('total_payment'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) =>
        activeTable === 'openOrder' ? (
          <Button
            onClick={() => handleButtonClick(record)}
            className='mx-auto bg-color-orineko-telegram border justify-center flex gap-2 items-center rounded-lg text-sm'>
            <img src={TelegramIcon} alt='' />
            Telegram
          </Button>
        ) : (
          <Button
            onClick={() => handleButtonClick(record)}
            className='mx-auto bg-color-orineko border justify-center flex gap-2 items-center rounded-lg text-sm'>
            Join Again!
          </Button>
        ),
    },
  ];

  return (
    <Sidebar>
      <div>
        <div className='text-3xl py-2 border-b'>History</div>

        <div className='py-5 flex justify-between aligns-center'>
          <div className='w-1/2'>
            <button
              type='button'
              className={`text-gray-900 border bg-color-orineko-ternary border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                activeTable === 'openOrder'
                  ? 'bg-color-orineko text-white'
                  : 'bg-white'
              }`}
              onClick={() => setActiveTable('openOrder')}>
              Open Order
            </button>

            <button
              type='button'
              className={`py-2.5 px-5 me-2 mb-2 text-sm bg-color-orineko-ternary font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${
                activeTable === 'historyOrder'
                  ? 'bg-color-orineko text-white'
                  : 'bg-white'
              }`}
              onClick={() => setActiveTable('historyOrder')}>
              History Order
            </button>
          </div>
        </div>

        <div className='py-3'>
          <div className='card'>
            <Table
              className='table-ant'
              scroll={{ x: 600 }}
              columns={columns}
              dataSource={transactions}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default History;
