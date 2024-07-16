import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../../../component/common/admin/Sidebar';
import '../../../assets/css/user.css';
import { Table, Button, Spin, message, Select, Modal, Alert } from 'antd';
import { AddCircle, Data } from 'iconsax-react';
import api from '../../../utils/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Users = () => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Active');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [column, setColumn] = useState([]);
  // const [status, setStatus] = useState("Active")
  const location = useLocation()
  const message = location.state && location.state.message ? location.state.message : undefined
  const alert = location.state && location.state.alert ? location.state.alert : undefined

  const showModal = record => {
    setRecord(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleRemove(record);
    // setRecord(null)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRecord(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/v1/users');
        if (response.data && response.data.data) {
          const users = response.data.data.users;

          const filtered = users.filter(item => item.status === status);
          setData(users); // Sesuaikan dengan struktur respons API
          setShowData(filtered);
        }
        setLoading(false);
      } catch (error) {
        // console.error('Failed to fetch users:', error);
        // message.error('Failed to fetch users');
        setLoading(false);
      }
    };
    fetchUsers();
    setColumn(columns);
  }, []);

  const handleEdit = record => {
    navigate(`/asdhakdls/users/edit/${record.id}`);
  };

  const handleRemove = async record => {
    try {
      const response = await api.post('/api/v1/users/change-status', {
        userid: record.id,
        status: 0,
      });

      if (response.data && response.data.meta.code === 200) {
        navigate("/asdhakdls/users", {
          state: {
            message: "Successfully Remove User!",
            alert: "success"
          }
        })
        window.location.reload()
      } else {
        setError('Failed to update user');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  //   const handleStatusFilter = e => {
  //     setStatus(e);

  //     let filtered;
  //     switch (e) {
  //       case 'Both':
  //         filtered = data;
  //         break;
  //       default:
  //         filtered = data.filter(item => item.status === e);
  //     }

  //     setShowData(filtered);
  //   };

  const handleStatusFilter = e => {
    setStatus(e);

    if (e === 'Inactive') {
      setColumn(prev => {
        const newCol = [...prev];
        newCol.pop();
        return newCol;
      });
    } else {
      setColumn(columns);
    }

    let filtered;
    switch (e) {
      case 'Both':
        filtered = data;
        break;
      default:
        filtered = data.filter(item => item.status === e);
    }

    setShowData(filtered);
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
      // filters: [
      // 	{
      // 		text: 'Active',
      // 		value: 'Active',
      // 	},
      // 	{
      // 		text: 'Inactive',
      // 		value: 'Inactive',
      // 	},
      // ],
      // onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {record.status !== 'Inactive' ? (
            <div className='flex gap-2'>
              <Button
                className='bg-orineko-primary text-white border justify-center flex gap-2 items-center rounded-lg text-sm'
                onClick={() => handleEdit(record)}>
                Edit
              </Button>
              <Button
                className='bg-orineko-danger text-white border justify-center flex gap-2 items-center rounded-lg text-sm'
                onClick={() => showModal(record)}>
                Remove
              </Button>
            </div>
          ) : (
            <div>-</div>
          )}
        </>
      ),
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
      {
        message && <div style={{ zIndex: 100 }} className='fixed top-0 right-0 left-0 p-4 flex justify-center'>
          <Alert
            message={message && message}
            type={alert && alert}
            showIcon
            closable
          />
        </div>
      }
      <Modal
        title='Notifications'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
        <p>Are you sure you want to remove?</p>
      </Modal>
      <SidebarAdmin>
        <div className='mt-4'>
          <div className='text-3xl py-2 border-b'>User Management</div>
          <div className='mt-5'>
            <div className='flex justify-between'>
              <div className='font-bold py-2'>Users</div>
              <div className='flex gap-5 justify-between items-center'>
                <Select
                  onChange={e => {
                    handleStatusFilter(e);
                  }}
                  value={status}
                  options={statusFilter}
                />
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
                  <Spin size='large' />
                ) : (
                  <>
                    {error && <div className='text-red-500 pb-3'>{error}</div>}
                    <div className='overflow-hidden overflow-x-auto'>
                      <Table
                        className='table-ant'
                        columns={column}
                        dataSource={showData}
                        pagination={{
                          pageSize: 5,
                        }}
                        rowKey={record => record.id} // Asumsikan setiap record memiliki id unik
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarAdmin>
    </>
  );
};

export default Users;
