import React , {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Aside from './Aside'
import {toast} from 'react-toastify'
import axios from 'axios'

const ChangeStatus = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const [orderId,setOrderId]=useState('')
  const [status,setStatus]=useState('Processing')
  
  const submitStatus = async(orderId,status)=>{
    props.setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/order/changeStatus`,{orderId:orderId,status:status},{withCredentials:true})
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }
useEffect(()=>{
    if(props.user!==''){
        if(props.user.type==='Admin' || props.user.type==='Worker'){
        }else{
            navigate('*')
        }
    }
},[props.user])
  return (
    <div className='flex'>
      <div className={`${(props.user.type!=='Admin')?'hidden':''}`}><Aside/></div>
      <div id={`${(props.user.type!=='Admin')?'':'main'}`} className='changeStatus'>
        <div><h1>Change Status</h1></div>
         <div>
         <div>
         <label htmlFor="id">Enter Order Id:-</label>
          <input type="text" placeholder='Enter Order Id' id='id' value={orderId} onChange={(e)=>{setOrderId(e.target.value)}} />
          <label htmlFor="select">Select Status:-</label>
          <select value={status} onChange={(e)=>{setStatus(e.target.value)}} id='select'>
            <option value="Processing">Processing</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option className={`${(props.user.type==='Admin')?'':'hidden'}`} value="Cancelled">Cancelled</option>
            <option className={`${(props.user.type==='Admin')?'':'hidden'}`} value="Refund">Refund</option>
          </select>
          <button onClick={()=>{submitStatus(orderId,status)}}>Submit</button>
         </div>
         </div>
        </div>
    </div>
  )
}

export default ChangeStatus
