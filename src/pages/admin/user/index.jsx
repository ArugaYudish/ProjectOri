import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../../../component/common/admin/Sidebar';
import '../../../assets/css/user.css';
import { Table, Button, Spin, message } from 'antd';
import { AddCircle } from 'iconsax-react';
import api from '../../../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/v1/users');
        if (response.data && response.data.data) {
          setData(response.data.data.users); // Sesuaikan dengan struktur respons API
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        message.error('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleButtonClick = record => {
    navigate(`/asdhakdls/users/edit/${record.id}`);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Wallet',
      dataIndex: 'balance',
      width: 200,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: status => (status === 1 ? 'Active' : 'Inactive'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <div className='flex gap-2'>
          <Button
            className='bg-orineko-primary text-white border justify-center flex gap-2 items-center rounded-lg text-sm'
            onClick={() => handleButtonClick(record)}>
            Edit
          </Button>
          <Button
            className='bg-orineko-danger text-white border justify-center flex gap-2 items-center rounded-lg text-sm'
            onClick={() => handleButtonClick(record)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SidebarAdmin>
      <div>
        <div className='text-3xl py-2 border-b'>User Management</div>
        <div className='mt-5'>
          <div className='flex justify-between'>
            <div className='font-bold py-2'>Users</div>
            <div>
              <Link
                to={'/asdhakdls/users/add'}
                className='text-white flex gap-2 items-center bg-color-orineko focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
                <AddCircle size='16' color='#FFFFFF' />
                Create New
              </Link>
            </div>
          </div>
          <div className='pt-3'>
            <div className='card'>
              {loading ? (
                <Spin tip='Loading...' />
              ) : (
                <Table
                  className='table-ant'
                  columns={columns}
                  dataSource={data}
                  pagination={{
                    pageSize: 5,
                  }}
                  rowKey={record => record.id} // Asumsikan setiap record memiliki id unik
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarAdmin>
  );
};

export default Users;
