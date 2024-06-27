import React, { useEffect, useState } from 'react'
import SidebarAdmin from '../../component/common/admin/Sidebar'
import '../../assets/css/user.css'
import { Table, Spin, message, DatePicker, Button } from 'antd'
import moment from 'moment'
import api from '../../utils/api'
import * as XLSX from 'xlsx' // Import xlsx for Excel export

const Transaction = () => {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)

	useEffect(() => {
		fetchTransactions(startDate, endDate)
	}, [startDate, endDate])

	const fetchTransactions = async (startDate, endDate) => {
		setLoading(true)
		try {
			const payload = {
				start_date: startDate ? startDate.format('YYYY-MM-DD') : moment().subtract(3, 'years').format('YYYY-MM-DD'),
				end_date: endDate ? endDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
			}
			const response = await api.post('/api/v1/transactions/get', payload)
			if (response.data && response.data.data && response.data.data.transaction) {
				setData(response.data.data.transaction)
			}
		} catch (error) {
			console.error('Failed to fetch transactions:', error)
			message.error('Failed to fetch transactions')
		} finally {
			setLoading(false)
		}
	}

	const handleFilter = () => {
		fetchTransactions(startDate, endDate)
	}

	const handleResetFilter = () => {
		setStartDate(null)
		setEndDate(null)
	}

	const handleExport = () => {
		try {
			const worksheet = XLSX.utils.json_to_sheet(data)
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
			XLSX.writeFile(workbook, 'transactions.xlsx')
		} catch (error) {
			console.error('Failed to export data:', error)
			message.error('Failed to export data')
		}
	}

	const columns = [
		{
			title: 'Package name',
			dataIndex: 'package_name',
			width: 150
		},
		{
			title: 'Username',
			dataIndex: 'name',
			width: 150
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200
		},
		{
			title: 'Wallet',
			dataIndex: 'wallet',
			width: 150,
			render: (wallet) => `$${wallet}`
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: 150
		},
		{
			title: 'Total Payment',
			dataIndex: 'total_payment',
			width: 150
		},
		{
			title: 'Date Time',
			dataIndex: 'date_time',
			width: 200
		}
	]

	return (
		<SidebarAdmin>
			<div>
				<div className="text-3xl py-2 border-b">Transaction</div>
				<div className="mt-5">
					<div className="flex justify-between">
						<div className="font-bold py-2">Transaction</div>
						<div>
							<DatePicker.RangePicker
								value={[startDate, endDate]}
								onChange={(dates) => {
									if (dates && dates.length === 2) {
										setStartDate(dates[0])
										setEndDate(dates[1])
									} else {
										setStartDate(null)
										setEndDate(null)
									}
								}}
							/>

							<Button
								onClick={handleExport}
								className="ml-2"
							>
								Export
							</Button>
						</div>
					</div>
					<div className="pt-3">
						<div className="card">
							{loading ? (
								<Spin tip="Loading..." />
							) : (
								<div className="overflow-hidden overflow-x-auto">
									<Table
										className="table-ant"
										columns={columns}
										dataSource={data}
										pagination={{
											pageSize: 5
										}}
										rowKey={(record) => record.id} // Assuming each record has a unique id
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</SidebarAdmin>
	)
}

export default Transaction
