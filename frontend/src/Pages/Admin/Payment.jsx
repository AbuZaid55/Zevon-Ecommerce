import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Aside from './Aside'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { context } from '../../Context/context';

const Payment = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation().search
  const [paymentOnPerPage, setPaymentOnPerPage] = useState(20)
  const [allPayment, setAllPayment] = useState([])
  const [searchPayment, setSearchPayment] = useState([])
  const [paginationPayment, setPaginationPayment] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [id, setId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [search, setSearch] = useState('')
  const user = useSelector((state) => (state.user))
  const setting = useSelector((state) => (state.setting))
  const { setLoader2 } = useContext(context)

  const handleItemPerPage = (e) => {
    if (e.target.value > 100) {
      setPaymentOnPerPage(100)
    } else {
      setPaymentOnPerPage(e.target.value)
    }
    setCurrentPage(1)
  }

  const deletePayment = async (_id) => {
    setShowConfirm(false)
    setLoader2(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/order/deletePayment?_id=${_id}`, { withCredentials: true })
      getAllPayment()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }

  const handlePagination = (action) => {
    if (action === "Inc") {
      if (totalPage > currentPage) {
        setCurrentPage(currentPage + 1)
      } else {
        setCurrentPage(totalPage)
      }
    }
    if (action === 'Desc') {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        setCurrentPage(1)
      }
    }
  }

  const getAllPayment = async () => {
    setLoader2(true)
    try {
      const allpayment = await axios.get(`${BACKEND_URL}/order/allPayment`, { withCredentials: true })
      setAllPayment(allpayment.data.data.reverse())
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }

  useEffect(() => {
    if (user === 'Not Found!') {
      navigate('*')
    } else {
      if (user._id && user.type !== 'Admin') {
        navigate('*')
      }
    }
  }, [user])
  useEffect(() => {
    if (setting && setting.noOfRow) {
      setPaymentOnPerPage(setting.noOfRow)
    }
  }, [setting])
  useEffect(() => {
    getAllPayment()
    if (location !== '') {
      setSearch(location.slice(5))
    }
  }, [])
  useEffect(() => {
    const payments = allPayment.filter(((payment) => {
      if ((payment.razorpay_payment_id.includes(search) || payment.razorpay_order_id.includes(search)) || payment.userId.includes(search) || payment.email.includes(search) || payment.createdAt.includes(search.split("-").reverse().join("-"))) {
        return payment
      }
    }))
    setSearchPayment(payments)
    setTotalPage(Math.ceil(payments.length / paymentOnPerPage))
    setCurrentPage(1)
  }, [allPayment, search, paymentOnPerPage])
  useEffect(() => {
    const payment = searchPayment.slice((currentPage - 1) * paymentOnPerPage, currentPage * paymentOnPerPage)
    setPaginationPayment(payment)
  }, [currentPage, searchPayment])
  
  return (
    <div className='flex'>
      <Aside />
      <div className='payment' id='main'>
        <h1>Payment Details</h1>
        <div>
          <div className=' top flex items-center justify-between'>
            <div className='search relative'>
              <input type="search" className='w-full' value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder='Search Payments' />
            </div>
            <div className='top2'>
              <label className='noPageLabel'><input className='noPage' value={paymentOnPerPage} onChange={((e) => { handleItemPerPage(e) })} type="number" max={100} />Per Page</label>
              <span className='noOfPay'>No of Payment: {searchPayment.length}</span>
            </div>
          </div>
          <table>

            <thead>
              <tr>
                <th>Payment Id</th>
                <th>Order Id</th>
                <th>User Id</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {paginationPayment.map((item, i) => {
                return <tr key={i}>
                  <td datalabel={"Payment Id"}>{item.razorpay_payment_id}</td>
                  <td datalabel={'Order Id'}>{item.razorpay_order_id}</td>
                  <td datalabel={'User Id'}>{item.userId}</td>
                  <td datalabel={'Amount'}>&#8377; {item.totalPaidAmount}</td>
                  <td datalabel={'Date'}>{item.createdAt.slice(0, 10).split("-").reverse().join("-")}</td>
                  <td datalabel={'Delete'}><FaTrash className='icon delete' onClick={() => { setId(item._id); setShowConfirm(true) }} /></td>
                </tr>
              })}
            </tbody>

          </table>
        </div>

        {/* pagination  */}
        <div className='flex items-center justify-between w-full relative bottom-0'>
          <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={() => { handlePagination("Desc") }}><FaArrowLeft /></button>
          <div className='flex'>
            <p className='border p-2 w-10 h-10 text-center '>{currentPage}</p>
            <span className='text-3xl'>/</span>
            <p className='border p-2 w-10 h-10 text-center '>{totalPage}</p>
          </div>
          <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={() => { handlePagination("Inc") }}><FaArrowRight /></button>
        </div>
      </div>

      {/* delete popup  */}
      <div className={`${(showConfirm) ? 'flex' : 'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center `} style={{ backgroundColor: "rgba(128, 128, 128, 0.653)", zIndex: '200' }}>
        <div className=' w-56 h-56 border p-4  bg-white rounded  flex items-stretch justify-between flex-col'>
          <h1 className=' text-main-800 text-center text-2xl'>Are your sure you want to delete?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={() => { deletePayment(id) }} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(() => { setShowConfirm(false) })} className=' bg-main-800 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
