import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Aside from './Aside'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { context } from '../../Context/context'

const ChangeStatus = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const [orderId, setOrderId] = useState('')
  const [status, setStatus] = useState('Processing')
  const { setLoader2 } = useContext(context)
  const user = useSelector((state) => (state.user))

  const submitStatus = async (orderId, status) => {
    setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/order/changeStatus`, { orderId: orderId, status: status }, { withCredentials: true })
      toast.success(res.data.massage)
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
  return (
    <div className='flex'>
      <div className={`${(user.type !== 'Admin') ? 'hidden' : ''}`}><Aside /></div>
      <div id={`${(user.type !== 'Admin') ? '' : 'main'}`} className='changeStatus'>
        <div><h1>Change Status</h1></div>
        <div>
          <div>
            <label htmlFor="id">Enter Order Id:-</label>
            <input type="text" placeholder='Enter Order Id' id='id' value={orderId} onChange={(e) => { setOrderId(e.target.value) }} />
            <label htmlFor="select">Select Status:-</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value) }} id='select'>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option className={`${(user.type === 'Admin') ? '' : 'hidden'}`} value="Cancelled">Cancelled</option>
              <option className={`${(user.type === 'Admin') ? '' : 'hidden'}`} value="Refund">Refund</option>
            </select>
            <button onClick={() => { submitStatus(orderId, status) }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeStatus
