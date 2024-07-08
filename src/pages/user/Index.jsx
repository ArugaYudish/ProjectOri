import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../component/common/Sidebar';
import '../../assets/css/user.css';
import { Table, Card, Spin, Input, Button, Space } from 'antd';
import { Wallet } from 'iconsax-react';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Wallets = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isTransaction = sessionStorage.getItem('isTransaction');
    if (isTransaction === 'false') {
      navigate('*');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      try {
        const response = await api.post('/api/v1/withdrawal/get', {
          user_id: sessionStorage.getItem('userId'),
          status: '',
          start_date: null,
          end_date: null,
        });
        if (
          response.data &&
          response.data.data &&
          response.data.data.withdrawals
        ) {
          setWithdrawals(response.data.data.withdrawals);
        }
      } catch (error) {
        console.error('Failed to fetch withdrawals:', error);
      } finally {
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
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
    fetchBalance();
  }, []);

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
        setTimeout(() => searchInput.current.select());
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
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      width: 150,
      ...getColumnSearchProps('currency'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 200,
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 150,
      ...getColumnSearchProps('amount'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      ...getColumnSearchProps('status'),
    },
  ];

  return (
    <Sidebar>
      <div>
        <div className='text-3xl py-2 font-bold border-b'>Wallets</div>

        <Card className='border shadow mt-5'>
          <div className='flex w-full justify-between'>
            <div className='flex items-center gap-3'>
              <div>
                <Wallet size='40' color='#ca9700' variant='Bold' />
              </div>
              <div>
                <p>Your Balance</p>
                <p className='text-2xl font-bold'>{`$${parseFloat(
                  balance,
                ).toFixed(3)}`}</p>
              </div>
            </div>
            <div className='pt-2'>
              <a
                href='/withdraw'
                className='bg-color-orineko-sec border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'>
                Withdraw
              </a>
            </div>
          </div>
        </Card>

        <div className='py-5'>
          <div className='flex items-center justify-between py-4'>
            <div className='text-xl font-bold py-5'>Withdrawal Status</div>
            <div className='pb-4 flex justify-end'></div>
          </div>

          <Card className='card'>
            {loading ? (
              <Spin tip='Loading...' />
            ) : (
              <div className='overflow-hidden overflow-x-auto'>
                <Table
                  className='table-ant'
                  columns={columns}
                  dataSource={withdrawals}
                  pagination={{
                    pageSize: 5,
                  }}
                  rowKey={record => record.id}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </Sidebar>
  );
};

export default Wallets;

// import React, { useState, useEffect, useRef } from 'react';
// import Sidebar from '../../component/common/Sidebar';
// import '../../assets/css/user.css';
// import { Table, Card, Spin, Input, Button, Space } from 'antd';
// import { Wallet } from 'iconsax-react';
// import { SearchOutlined } from '@ant-design/icons';
// import api from '../../utils/api';
// import { useNavigate } from 'react-router-dom';

// const Wallets = () => {
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [balance, setBalance] = useState(0);
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const searchInput = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isTransaction = sessionStorage.getItem('isTransaction');
//     if (isTransaction === 'false') {
//       navigate('*');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchWithdrawals = async () => {
//       setLoading(true);
//       try {
//         const response = await api.post('/api/v1/withdrawal/get', {
//           user_id: sessionStorage.getItem('userId'),
//           status: '',
//           start_date: null,
//           end_date: null,
//         });
//         if (
//           response.data &&
//           response.data.data &&
//           response.data.data.withdrawals
//         ) {
//           setWithdrawals(response.data.data.withdrawals);
//         }
//       } catch (error) {
//         console.error('Failed to fetch withdrawals:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchBalance = () => {
//       const balanceFromStorage = sessionStorage.getItem('Ballance');
//       if (balanceFromStorage) {
//         setBalance(parseFloat(balanceFromStorage));
//       }
//     };

//     fetchWithdrawals();
//     fetchBalance();
//   }, []);

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = clearFilters => {
//     clearFilters();
//     setSearchText('');
//   };

//   const getColumnSearchProps = dataIndex => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//     }) => (
//       <div style={{ padding: 8 }}>
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={e =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{ marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type='primary'
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size='small'
//             style={{ width: 90 }}>
//             Search
//           </Button>
//           <Button
//             onClick={() => handleReset(clearFilters)}
//             size='small'
//             style={{ width: 90 }}>
//             Reset
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: filtered => (
//       <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownVisibleChange: visible => {
//       if (visible) {
//         setTimeout(() => searchInput.current.select());
//       }
//     },
//     render: text =>
//       searchedColumn === dataIndex ? (
//         <span style={{ fontWeight: 'bold' }}>{text}</span>
//       ) : (
//         text
//       ),
//   });

//   const columns = [
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       width: 150,
//       ...getColumnSearchProps('email'),
//     },
//     {
//       title: 'Currency',
//       dataIndex: 'currency',
//       width: 150,
//       ...getColumnSearchProps('currency'),
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       width: 200,
//       ...getColumnSearchProps('address'),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       width: 150,
//       ...getColumnSearchProps('amount'),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       width: 150,
//       ...getColumnSearchProps('status'),
//     },
//   ];

//   return (
//     <Sidebar>
//       <div>
//         <div className='text-3xl py-2 font-bold border-b'>Wallets</div>

//         <Card className='border shadow mt-5'>
//           <div className='flex w-full justify-between'>
//             <div className='flex items-center gap-3'>
//               <div>
//                 <Wallet size='40' color='#ca9700' variant='Bold' />
//               </div>
//               <div>
//                 <p>Your Balance</p>
//                 <p className='text-2xl font-bold'>{`$${parseFloat(
//                   balance,
//                 ).toFixed(3)}`}</p>
//               </div>
//             </div>
//             <div className='pt-2'>
//               <a
//                 href='/withdraw'
//                 className='bg-color-orineko-sec border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'>
//                 Withdraw
//               </a>
//             </div>
//           </div>
//         </Card>

//         <div className='py-5'>
//           <div className='flex items-center justify-between py-4'>
//             <div className='text-xl font-bold py-5'>Withdrawal Status</div>
//             <div className='pb-4 flex justify-end'></div>
//           </div>

//           <Card className='card'>
//             {loading ? (
//               <Spin tip='Loading...' />
//             ) : (
//               <div className='overflow-hidden overflow-x-auto'>
//                 <Table
//                   className='table-ant'
//                   columns={columns}
//                   dataSource={withdrawals}
//                   pagination={{
//                     pageSize: 5,
//                   }}
//                   rowKey={record => record.id}
//                 />
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>
//     </Sidebar>
//   );
// };

// export default Wallets;
