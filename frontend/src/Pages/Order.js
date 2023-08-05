import React,{useState,useEffect} from 'react'
import { FaRupeeSign,FaTimes ,FaMapMarker} from 'react-icons/fa';
import GoLogin from '../Component/GoLogin';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../baseUrl'
import axios from 'axios'

const Order = (props) => {
  const [login,setLogin]=useState(true)
  const [orders,setOrders]=useState('')
  const [status,setStatus]=useState("Processing")


  const getOrders = async()=>{
    try {
      const orders = await axios.post(`${BACKEND_URL}/order/getOrders`,{_id:props.user._id})
      setOrders(orders.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(props.user._id){
      setLogin(true)
      getOrders()
    }else{
      setLogin(false)
    }
  },[props.user])
  
  return (<>
    <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
    <div className={`${(login)?"":"hidden"} mt-8 sm:mt-0`}>
      {/* order  */}
      {
        orders!=='' && orders.map((order)=>{
          return <div className="sm:mx-4 p-2 my-3 border">
          <div className=' sm:flex flex-row items-center justify-between py-2 px-3 mb-2 bg-fuchsia-800 text-white'><h1>Order Id : 20234564035113azfh44</h1><Link to="/track"><button className='flex items-center border px-3 py-1 ml-auto mt-2 sm:mt-0'><FaMapMarker className='mr-2'/> Track</button></Link></div>
            {/* item  */}
          {
            order.item.map((item)=>{
              return <div className="flex border my-1 items-center">
              <img className="m-2" style={{width:"80px" , height:"80px"}} src={`${BACKEND_URL}/Images/${item.thumbnail}`} alt="Pic" />
              <div className='w-full'>
              <h1 className=' lg:text-2xl font-semibold'>{item.name}</h1>
              <div className='flex items-center justify-between flex-wrap'>
              <p className="lg:text-xl mx-2">Size: {item.size}</p>
              <p className="flex items-center lg:text-xl mx-2">Color: <span className="w-5 h-5 inline-block ml-1 rounded-full" style={{backgroundColor:item.color}}></span></p>
              <p className="flex items-center lg:text-xl mx-2">Price: <FaRupeeSign className=" font-extralight"/><span className="font-bold">{item.price}</span></p>
              <p className="flex items-center lg:text-xl mx-2">Quentity: {item.qty}</p>
              <p className="flex items-center lg:text-xl mx-2">Total: <FaRupeeSign className=" font-extralight"/><span className="font-bold">{item.price*item.qty}</span></p>
              </div>
              </div>
              </div>
            })
          }
          {/* item end  */}
          <div className=" mt-3 py-2 ">
            <p className='w-full'>ORDERED ON : <span className='font-semibold'>{order.createdAt}</span></p>
            <p className="flex w-full items-center lg:text-xl ml-auto">TOTAL PAID AMOUNT (including GST & Delivery Charge) : <FaRupeeSign className=" font-extralight text-green-600"/><span className="font-bold text-green-600">{order.totalPaidAmount}</span></p>
          </div>
          <div className='border-t py-2 flex items-center justify-between'>
            <p>STATUS: <span className=''>{order.status}</span></p>
            <button className=' bg-red-700 text-white  px-3 py-3 rounded font-semibold'>CANCLE</button></div>
          </div>
        })
      }
      {/* order end  */}
    </div>
    </>)
}

export default Order
