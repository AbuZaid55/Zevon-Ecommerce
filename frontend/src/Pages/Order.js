import React,{useState,useEffect} from 'react'
import { FaRupeeSign, FaMapMarker} from 'react-icons/fa';
import GoLogin from '../Component/GoLogin';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../baseUrl'
import axios from 'axios'
import { toast } from 'react-toastify'

const Order = (props) => {
  const [login,setLogin]=useState(true)
  const [orders,setOrders]=useState('')
  const [showCancleForm,setShowCancleForm]=useState(false)
  const [cancleOrderId,setCancleOrderId]=useState('')


  const getOrders = async()=>{
    props.setLoader2(true)
    try {
      const orders = await axios.post(`${BACKEND_URL}/order/getOrders`,{_id:props.user._id})
      setOrders(orders.data.data.reverse())
    } catch (error) {
      console.log(error)
    }
    props.setLoader2(false)
  }

  const cancleOrder = async(_id)=>{
    props.setLoader2(true)
    if(_id===''){
      toast.error("Something Went Wrong!")
    }else if(!props.user._id){
      toast.error("Invalid User")
    }else{
      try {
        const res = await axios.post(`${BACKEND_URL}/order/cancleOrder`,{orderId:_id,userId:props.user._id})
        getOrders()
        setShowCancleForm(false)
        toast.success(res.data.massage)
      } catch (error) {
        toast.error(error.response.data.massage)
      }
    }
    props.setLoader2(false)
  }

  useEffect(()=>{
    if(props.user._id){
      setLogin(true)
      getOrders()
    }else{
      setLogin(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.user])
  
  return (<>
    <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
    <div className={`${(login)?"":"hidden"} mt-8 sm:mt-0`}>
      {/* order  */}
      {
        orders!=='' && orders.map((order,I)=>{
          return <div key={I} className="sm:mx-4 p-2 my-3 border">
          <div className=' sm:flex flex-row items-center justify-between py-2 px-3 mb-2 bg-fuchsia-800 text-white'><h1>Order Id : {order._id}</h1><Link to={`/track?orderId=${order._id}`}><button className='flex items-center border px-3 py-1 ml-auto mt-2 sm:mt-0'><FaMapMarker className='mr-2'/> Track</button></Link></div>
            {/* item  */}
          {
            order.item.map((item,i)=>{
              return <div key={i} className="flex border my-1 items-center">
              <img className="m-2" style={{width:"80px" , height:"80px"}} src={`${BACKEND_URL}/Images/${item.thumbnail}`} alt="Pic" />
              <div className='w-full'>
              <Link to={`/details?_id=${item.productId}`}><h1 className=' lg:text-2xl font-semibold'>{item.name}</h1></Link>
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
            <p className='w-full'>ORDERED ON : <span className='font-semibold'>{new Date(order.createdAt).toLocaleString()}</span></p>
            <p className="flex w-full items-center lg:text-xl ml-auto">TOTAL PAID AMOUNT (including GST & Delivery Charge) : <FaRupeeSign className=" font-extralight text-green-600"/><span className="font-bold text-green-600">{order.totalPaidAmount}</span></p>
          </div>
          <div className='border-t py-2 flex items-center justify-between'>
            <p className={`${(order.status==="Delivered" || order.status==="Cancelled" || order.status==="Refund")?'hidden':""}`}>STATUS: <span className=' font-semibold text-fuchsia-700 '>{order.status}</span></p>
            <p className={`${(order.status==="Delivered")?'':"hidden"}`}>STATUS: <span className=' font-semibold text-green-700'>{order.status}</span></p>
            <p className={`${(order.status==="Cancelled")?'':"hidden"}`}>STATUS: <span className=' font-semibold text-red-700'>{order.status}</span></p>
            <p className={`${(order.status==="Refund")?'':"hidden"}`}>STATUS: <span className=' font-semibold text-green-700'>{order.status}</span></p>
            <button className={`${(order.status==="Processing")?'':'hidden'} bg-red-700 text-white  px-3 py-3 rounded font-semibold`} onClick={(()=>{setShowCancleForm(true); setCancleOrderId(order._id)})}>CANCLE</button>
            </div>
          </div>
        })
      }
      {/* order end  */}
       {/* cancle Order Form  */}
       <div className={`${(showCancleForm)?'flex':'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center z-50`} style={{backgroundColor:"rgba(128, 128, 128, 0.653)"}}>
        <div className=' w-56 h-56 border p-4 fixed top-1/2 left-1/2 bg-white rounded -translate-x-2/4 -translate-y-2/4 flex items-stretch justify-between flex-col text-xl'>
          <h1 className=' text-fuchsia-700 text-center'>Are your sure you want to this cancle this order?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={()=>{cancleOrder(cancleOrderId)}} className=' bg-fuchsia-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(()=>{setShowCancleForm(false); setCancleOrderId('')})} className=' bg-fuchsia-700 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
        </div>
    </div>
    </>)
}

export default Order
