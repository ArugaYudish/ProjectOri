import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../component/common/admin/Sidebar';
import '../../assets/css/user.css';
import { Table, DatePicker, Button, Space } from 'antd';
import { CalendarSearch, Key } from 'iconsax-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import api from '../../utils/api';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [quarterlySales, setQuarterlySales] = useState([]);
  const [halfYearlySales, setHalfYearlySales] = useState([]);
  const [annuallySales, setAnnuallySales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchSalesData = async (start, end) => {
    try {
      const salesResponse = await api.post(
        '/api/v1/transactions/sales-reporting',
        {
          start_date: start,
          end_date: end,
        },
      );

      const { quarterly_sales, half_yearly_sales, annually_sales } =
        salesResponse.data.data.sales_reporting;
      setQuarterlySales(quarterly_sales || []);
      setHalfYearlySales(half_yearly_sales || []);
      setAnnuallySales(annually_sales || []);
    } catch (error) {
      // console.error("Error fetching sales data:", error)
    }
  };

  const fetchTransactions = async (start, end) => {
    try {
      const transactionResponse = await api.post('/api/v1/transactions/get', {
        start_date: start,
        end_date: end,
      });

      const sortedTransactions = transactionResponse.data.data.transaction.sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time),
      );

      setTransactions(
        sortedTransactions.map((item, index) => ({
          ...item,
          key: index,
        })),
      );
    } catch (error) {
      // console.error("Error fetching transactions:", error)
    }
  };

  useEffect(() => {
    const start = startDate ? startDate.format('YYYY-MM-DD') : '2021-05-01';
    const end = endDate ? endDate.format('YYYY-MM-DD') : '2024-09-03';
    fetchSalesData(start, end);
    fetchTransactions(start, end);
  }, [startDate, endDate]);

  const handleDateChange = dates => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Konfigurasi Highcharts
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Quarterly Sales Chart',
    },
    xAxis: {
      categories: quarterlySales.map(sale => sale.duration),
    },
    yAxis: {
      title: {
        text: 'Jumlah Penjualan',
      },
    },
    colors: ['#ca9700'],

    series: [
      {
        name: 'Sales',
        data: quarterlySales.map(sale => parseFloat(sale.amount)),
      },
    ],
  };

  const options2 = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Half Yearly Sales Chart',
    },
    xAxis: {
      categories: halfYearlySales.map(sale => sale.duration),
    },
    yAxis: {
      title: {
        text: 'Jumlah Penjualan',
      },
    },
    colors: ['#ca9700'],

    series: [
      {
        name: 'Sales',
        data: halfYearlySales.map(sale => parseFloat(sale.amount)),
      },
    ],
  };

  const options3 = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Annualy Sales Chart',
    },
    xAxis: {
      categories: annuallySales.map(sale => sale.duration),
    },
    yAxis: {
      title: {
        text: 'Jumlah Penjualan',
      },
    },
    colors: ['#ca9700'],

    series: [
      {
        name: 'Sales',
        data: annuallySales.map(sale => parseFloat(sale.amount)),
      },
    ],
  };

  // Kolom tabel dan data
  const columns = [
    {
      title: 'Package name',
      dataIndex: 'package_name',
      width: 200,
    },
    {
      title: 'Username',
      dataIndex: 'name',
      width: 200,
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
      render: wallet => `$${wallet}`, // Add $ sign
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 200,
    },
    {
      title: 'Total Payment',
      dataIndex: 'total_payment',
      width: 200,
      render: total_payment => `$${total_payment}`, // Add $ sign
    },
  ];

  return (
    <>
      <SidebarAdmin>
        <div className='mt-4'>
          <div className='text-3xl border-b '>Dashboard</div>

          <div>
            <div className=''>
              <div className='flex justify-between py-4'>
                <div className='font-bold py-2'>Dashboard Sales Report </div>
                <div>
                  <RangePicker onChange={handleDateChange} />
                </div>
              </div>

              <div className='sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='col-span-1 p-4 border'>
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
                <div className='col-span-1 p-4 border'>
                  <HighchartsReact highcharts={Highcharts} options={options2} />
                </div>
                <div className='col-span-1 p-4 border'>
                  <HighchartsReact highcharts={Highcharts} options={options3} />
                </div>
              </div>

              <div className='pt-5'>
                <div className='font-bold py-5 '>Latest Transactions</div>

                <div className='card'>
                  <div className='overflow-hidden overflow-x-auto'>
                    <Table
                      className='table-ant'
                      columns={columns}
                      dataSource={transactions}
                      pagination={{
                        pageSize: 5,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarAdmin>
    </>
  );
};

export default Dashboard;
