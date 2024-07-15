import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../../component/common/admin/Sidebar';
import '../../../assets/css/user.css';
import api from '../../../utils/api'; // Pastikan path ini sesuai dengan struktur proyek Anda
import { Alert, message, Modal } from 'antd'; // Menggunakan message dari Ant Design untuk menampilkan notifikasi

const Content = () => {
  // State untuk menyimpan daftar paket, paket yang dipilih, dan harga baru
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [price, setPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, SetMessage] = useState(undefined);
  const [alert, setAlert] = useState(undefined)

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleSubmit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Fungsi untuk mengambil paket dari API
  const fetchPackages = async () => {
    try {
      const response = await api.get('/api/v1/packages');
      if (response.data && response.data.data && response.data.data.packages) {
        setPackages(response.data.data.packages);
      }
    } catch (error) {
      // console.error('Gagal mengambil data paket:', error);
    }
  };

  // Gunakan useEffect untuk melakukan fetch data ketika komponen pertama kali dimuat
  useEffect(() => {
    fetchPackages();
  }, []);

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async () => {
    // Validate input
    if (!selectedPackage || !price) {
      // message.error('Please select a package and enter price.');
      return;
    }

    try {
      // Find the package ID based on selected package name
      const selectedPackageObj = packages.find(
        pkg => pkg.package_name === selectedPackage,
      );
      if (!selectedPackageObj) {
        // message.error('Selected package not found.');
        return;
      }

      // Prepare update data
      const updateData = {
        id: selectedPackageObj.id,
        price: price.toString(), // Convert price to string if it's not already
      };

      // Call API to update package
      const response = await api.post('/api/v1/packages/update', updateData, {
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if required (e.g., Authorization header)
        },
      });

      // Check if response status is not in 2xx range (indicating error)
      if (response.status < 200 || response.status >= 300) {
        // throw new Error(`Failed to update package: ${response.statusText}`);
        SetMessage(response.data.meta.message)
        setAlert("error")
      }

      // console.log("Package updated successfully:", response.data)

      // Optionally, show success message or navigate to another page
      // message.success('Package updated successfully.');

      // You may want to refetch packages after update
      SetMessage(response.data.meta.message)
      setAlert("success")
      fetchPackages();
      setSelectedPackage('');
      setPrice('');
    } catch (error) {
      SetMessage(error.message)
      setAlert("error")
      // console.error('Failed to update package:', error);
      // message.error('Failed to update package. Please try again later.');
    }
  };

  return (
    <>
      {
        message && <div style={{ zIndex: 100 }} className='fixed top-0 right-0 left-0 p-4 flex justify-center'>
          <Alert
            message={message && message}
            type={alert && alert}
            showIcon
            closable
            onClose={() => {
              SetMessage(undefined)
              setAlert(undefined)
            }}
          />
        </div>
      }

      <Modal
        title='Notifications'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
        <p>Are you sure you want to submit?</p>
      </Modal>

      <SidebarAdmin>
        <div className='mt-4'>
          <div className='text-3xl py-2 border-b '>Content Management</div>

          <div>
            <div className='mt-5'>
              <div>
                {/* <div className='font-bold py-2'>Ubah Daftar Harga</div> */}

                <form>
                  <div className='py-2'>
                    <label
                      htmlFor='packages'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Select Package{' '}
                    </label>
                    <select
                      id='packages'
                      className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      value={selectedPackage}
                      onChange={e => setSelectedPackage(e.target.value)}>
                      <option value=''>Select Package</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.package_name}>
                          {pkg.package_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='py-2'>
                    <label
                      htmlFor='price'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Price{' '}
                    </label>
                    <input
                      type='number'
                      id='price'
                      className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='Prices are in USD'
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      required
                    />
                    <div className='py-2'></div>
                    <button
                      type='button'
                      className='text-white w-full bg-color-orineko focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
                      onClick={showModal}>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SidebarAdmin>
    </>
  );
};

export default Content;
