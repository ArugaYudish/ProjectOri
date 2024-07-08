import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../component/common/admin/Sidebar';
import '../../assets/css/user.css';
import { Table, Button, message, DatePicker, Spin, Modal } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import axios from 'axios'; // Menggunakan axios untuk permintaan API
import api from '../../utils/api';

const AdminWithdraw = () => {
  const [data, setData] = useState([]); // State untuk menyimpan data withdrawal
  const [loading, setLoading] = useState(false); // State untuk status loading
  const [startDate, setStartDate] = useState(null); // State untuk tanggal awal filter
  const [endDate, setEndDate] = useState(null); // State untuk tanggal akhir filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalExportOpen, setIsModalExportOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [action, setAction] = useState(null);

  const showModal = (record, action) => {
    setRecord(record); // store the record for use in handleOk
    setAction(action);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleButtonClick(record, action);
    setIsModalOpen(false);
    setRecord(null);
    setAction(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRecord(null);
    setAction(null);
  };

  const showModalExport = () => {
    setIsModalExportOpen(true);
  };

  const handleOkExport = () => {
    handleExport();
    setIsModalExportOpen(false);
  };

  const handleCancelExport = () => {
    setIsModalExportOpen(false);
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  // Fungsi untuk mengambil token akses dari localStorage
  const getToken = () => {
    return sessionStorage.getItem('accessToken');
  };

  // Fungsi untuk mengambil data withdrawal dari API
  const fetchData = async (startDate, endDate) => {
    setLoading(true); // Set loading menjadi true saat sedang fetching data
    try {
      // Membuat payload dengan filter tanggal
      const payload = {
        start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
        end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
      };
      const response = await api.post(
        `${apiUrl}/api/v1/withdrawal/get`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Tambahkan header Authorization
          },
        },
      );
      // console.log(response)
      if (
        response.data &&
        response.data.data &&
        response.data.data.withdrawals
      ) {
        const withdrawals = response.data.data.withdrawals;

        // Filter withdrawals based on specific condition, e.g., status 'Waiting Approval'
        const filteredWithdrawals = withdrawals.filter(
          withdrawal => withdrawal.status === 'Waiting Approval',
        );

        setData(filteredWithdrawals); // Update state data with the filtered withdrawals
      }
    } catch (error) {
      // console.error('Gagal mengambil data withdrawal:', error);
      message.error('Failed to retrieve withdrawal data');
    } finally {
      setLoading(false); // Set loading menjadi false setelah selesai fetching data
    }
  };

  // Mengambil data secara otomatis saat komponen pertama kali dirender dan setiap kali startDate atau endDate berubah
  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  // Fungsi untuk menangani klik filter
  const handleFilter = () => {
    fetchData(startDate, endDate); // Memanggil fetchData dengan parameter startDate dan endDate
  };

  // Fungsi untuk mereset filter
  const handleResetFilter = () => {
    setStartDate(null); // Mengatur startDate menjadi null
    setEndDate(null); // Mengatur endDate menjadi null
  };

  // Fungsi untuk menangani ekspor data ke Excel
  const handleExport = () => {
    try {
      // Mengonversi data menjadi format Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Withdraw Data');
      // Mengexport file Excel
      XLSX.writeFile(workbook, 'withdraw_data.xlsx');
    } catch (error) {
      console.error('Gagal mengekspor data:', error);
      message.error('Gagal mengekspor data');
    }
  };

  // Fungsi untuk menangani klik tombol Approve atau Decline
  const handleButtonClick = async (record, status) => {
    setLoading(true); // Set loading menjadi true saat melakukan aksi
    try {
      const response = await api.post(
        `${apiUrl}/api/v1/withdrawal/change-status`,
        {
          id: record.id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Tambahkan header Authorization
          },
        },
      );
      if (response.data.meta.status === 'success') {
        message.success(
          `Withdrawal ${status === 1 ? 'approved' : 'declined'} successfully`,
        );
        // Perbarui data withdrawal setelah aksi
        fetchData(startDate, endDate);
      } else {
        message.error(response.data.meta.message);
      }
    } catch (error) {
      console.error(
        `Failed ${status === 1 ? 'approved' : 'declined'} withdrawal:`,
        error,
      );
      message.error(
        `Failed ${status === 1 ? 'approved' : 'declined'} withdrawal`,
      );
    } finally {
      setLoading(false); // Set loading menjadi false setelah selesai aksi
    }
  };

  // Konfigurasi kolom-kolom untuk tabel
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 150,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <div className='flex gap-2'>
          <Button
            className='bg-orineko-primary text-white border justify-center flex gap-2 items-center rounded-lg text-sm'
            onClick={() => showModal(record, 1)}>
            Approve
          </Button>
          <Button
            className='bg-orineko-danger text-white border justify-center flex gap-2 items-center rounded-lg text-sm'
            onClick={() => showModal(record, 2)}>
            Decline
          </Button>
        </div>
      ),
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
        <p>Are you sure you want to {action === 1 ? 'approve' : 'decline'}?</p>
      </Modal>
      <Modal
        title='Notifications'
        open={isModalExportOpen}
        onOk={handleOkExport}
        onCancel={handleCancelExport}
        okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
        <p>Are you sure you want to export?</p>
      </Modal>
      <SidebarAdmin>
        <div className='container mx-auto p-4'>
          <div className='text-3xl py-2 border-b'>Approve Withdraw</div>
          <div className='mt-5'>
            <div className='flex flex-wrap justify-between'>
              <div className='font-bold py-2'>Withdraw Data</div>
              <div className='flex flex-wrap items-center gap-2'>
                {/* Komponen DateRangePicker untuk memilih rentang tanggal */}
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
                {/* Tombol Filter */}
                {/* <Button onClick={handleFilter} className='ml-2'>
                Filter
              </Button> */}
                {/* Tombol Reset Filter */}
                {/* <Button onClick={handleResetFilter} className='ml-2'>
                Reset Filter
              </Button> */}
                {/* Tombol Export untuk mengekspor data */}
                <Button onClick={showModalExport} className='ml-2'>
                  Export
                </Button>
              </div>
            </div>
            <div className='pt-3'>
              <div className='card'>
                {loading ? ( // Tampilkan spinner jika loading true, atau tabel jika false
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
                      rowKey={record => record.id}
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

export default AdminWithdraw;
