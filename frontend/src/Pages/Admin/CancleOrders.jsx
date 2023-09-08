import React ,{useEffect,useRef,useState} from 'react'
import { useNavigate,Link,useLocation } from 'react-router-dom';
import { FaArrowRight,FaArrowLeft ,FaPrint,FaTrash} from "react-icons/fa";
import Aside from './Aside'
import {toast} from 'react-toastify'
import axios from 'axios'
import QRCode from "react-qr-code";
import {useReactToPrint} from 'react-to-print';

const Orders = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation().search
  const ref = useRef()
  const [ordersOnPerPage,setOrdersOnPerPage]=useState(20)
  const [allOrders,setAllOrders]=useState([])
  const [searchOrders,setSearchOrders]=useState([])
  const [paginationOrders,setPaginationOrders]=useState([])
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPage,setTotalPage]=useState(1)
  const [search,setSearch]=useState('')
  const [status,setStatus]=useState('All')

  const handleItemPerPage = (e)=>{
    if(e.target.value>100){
      setOrdersOnPerPage(100)
    }else{
      setOrdersOnPerPage(e.target.value)
    }
    setCurrentPage(1)
  }


  const handlePagination = (action)=>{
    if(action==="Inc"){
        if(totalPage>currentPage){
            setCurrentPage(currentPage+1)
        }else{
            setCurrentPage(totalPage)
        }
    }
    if(action==='Desc'){
        if(currentPage>1){
            setCurrentPage(currentPage-1)
        }else{
            setCurrentPage(1)
        }
    }
}

const getAllOrders = async()=>{
  props.setLoader2(true)
  try {
    const allpayment = await axios.get(`${BACKEND_URL}/order/allOrders`,{withCredentials:true})
    setAllOrders(allpayment.data.data.reverse())
  } catch (error) {
    toast.error(error.response.data.massage)
  }
  props.setLoader2(false)
}

const changeStatus = async(orderId,status)=>{
  try {
    const res = await axios.post(`${BACKEND_URL}/order/changeStatus`,{orderId:orderId,status:status},{withCredentials:true})
    getAllOrders()
    toast.success(res.data.massage)
  } catch (error) {
    toast.error(error.response.data.massage)
  }
}

const print = useReactToPrint({
  content:()=>ref.current,
  documentTitle:"Zevon Order Slip"
})
const printPDF = (elementId)=>{
  const element = document.getElementById(elementId)
  element.style.display='block'
  ref.current=element
  print()
  element.style.display='none'
}

const deleteOrder = async(orderId)=>{
  props.setLoader2(true)
  try {
    const res = await axios.post(`${BACKEND_URL}/order/deleteOrder`,{orderId:orderId},{withCredentials:true})
    getAllOrders()
    toast.success(res.data.massage)
  } catch (error) {
    toast.error(error.response.data.massage)
  }
  props.setLoader2(false)
}
  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.type==='Admin'){
      }else{
        navigate('*')
      }
    }
  },[props.user])
  useEffect(()=>{
    if(props.setting && props.setting.noOfRow){
      setOrdersOnPerPage(props.setting.noOfRow)
    }
  },[props.setting])
  useEffect(()=>{
    getAllOrders()
    if(location!==''){
      setStatus(location.slice(5).replaceAll('%20' , ' '))
      console.log(status)
    }
  },[])
  useEffect(()=>{
    const payments = allOrders.filter(((order)=>{
      if(order.status==='Cancelled' || order.status==='Refund'){
        if(status!=='All'){
          if(order.status===status){
            if((order._id.includes(search)|| order.userId.includes(search) ) || order.email.includes(search) || order.phoneNo.toString().includes(search) || order.createdAt.includes(search.split("-").reverse().join("-"))){
              return order
            }
          }
        }else{
          if((order._id.includes(search)|| order.userId.includes(search) ) || order.email.includes(search) || order.phoneNo.toString().includes(search) || order.createdAt.includes(search.split("-").reverse().join("-"))){
            return order
          }
        }
      }
    }))
    setSearchOrders(payments)
    setTotalPage(Math.ceil(payments.length/ordersOnPerPage))
    setCurrentPage(1)
  },[allOrders,search,status,ordersOnPerPage])
  useEffect(()=>{
    const payment = searchOrders.slice((currentPage-1)*ordersOnPerPage,currentPage*ordersOnPerPage)
    setPaginationOrders(payment)
  },[currentPage,searchOrders])
  return (
    <div className='flex'>
      <Aside/>
      <div className='orders' id='main'>
        <h1>Cancelled Orders</h1>
        <div style={{minHeight:'70vh'}} >
         <div className='top flex items-center justify-between'>
         <div className='search relative'>
         <input  type="search" className='w-full' value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search Products' />
         <label className='searchType'>Status :- 
         <select value={status} onChange={(e)=>{setStatus(e.target.value)}} >
          <option value={"All"}>All</option>
          <option value={"Cancelled"}>Cancelled</option>
          <option value={"Refund"}>Refund</option>
         </select>
         </label>
         </div>
          <div className='top2'>
          <label  className='noPageLabel'><input className='noPage' value={ordersOnPerPage} onChange={((e)=>{handleItemPerPage(e)})} type="number" max={100} />Per Page</label>
          <span className='noOfPay'>Total Order: {searchOrders.length}</span>
          </div>
         </div>

         {/* Order  */}
         {paginationOrders.map((order,I)=>{
          let totalPrice = 0
          let GST =0
          let deliverCharge = 0
          return <div key={I}  className="mx-2 sm:mx-4 my-5 border-2 border-main-800 rounded-xl overflow-hidden relative">
            <div className=' bg-main-800 text-white p-2 text-lg'>
            <div>Razorpay Payment Id: {order.razorpay_payment_id}</div>
            <div>Razorpay Order Id: {order.razorpay_order_id}</div>
            </div>
            <span className='absolute top-1 right-1 cursor-pointer p-2 text-main-800 border-2 border-main-800 rounded bg-white' onClick={(e)=>{printPDF(`print${order._id}`)}}><FaPrint className=' pointer-events-none'/></span>
          {/* item  */}
           {
            order.item.map((item,i)=>{
              return <div key={i} className="flex item  items-center">
              <img className="m-2" style={{width:"80px" , height:"80px"}} src={item.thumbnail} alt="Pic" />
              <div className='w-full'>
              <Link to={`/details?_id=${item.productId}`}><h1 className=' lg:text-2xl'>{item.name}</h1></Link>
              <div className='flex items-center justify-start flex-wrap'>
              <p className={`${(item.size && item.size!=='')?'':'hidden'} lg:text-xl mx-2`}>Size: {item.size}</p>
              <p className={`${(item.color && item.color!=='')?'':'hidden'} flex items-center lg:text-xl mx-2`}>Color: <span className="w-5 h-5 inline-block ml-1 rounded-full border-2 border-black " style={{backgroundColor:item.color}}></span></p>
              <p className="flex items-center lg:text-xl mx-2">Quentity: {item.qty}</p>
              <span className='hidden'>{totalPrice=totalPrice+item.price*item.qty}{GST = GST+item.GST*item.qty}{deliverCharge=deliverCharge+item.deliveryCharge*item.qty}</span>
              </div>
              </div>
              </div>
            })
           }

        {/* item end  */}
          <div className='p-2 text-main-800 border-t-2 border-main-800 text-lg relative'>
          <span className={`${(order.status==='Refund')?'':'hidden'} absolute top-1 right-1 cursor-pointer p-2 text-red-700 border-2 border-red-700 rounded bg-white`} onClick={()=>{deleteOrder(order._id)}}><FaTrash className=' pointer-events-none'/></span>
          <p>Order Id: {order._id}</p>
          <p className='w-full'>Order On : {order.createdAt.slice(0,10).split("-").reverse().join("-")}</p>
          <p>Status :-  
            <select className='select' value={order.status} onChange={(e)=>{changeStatus(order._id,e.target.value)}}>
              <option value={"Cancelled"}>Cancelled</option>
              <option value={"Refund"}>Refund</option>
            </select>
          </p>
          </div>

          {/* Print Page  */}
          <div className='printPage  'ref={ref} id={`print${order._id}`}>
            <h1>Zevon</h1>
            <div className='date'>Date:- {order.createdAt.slice(0,10).split("-").reverse().join("-")}</div>
            <div>
            <div>
              <h1>Order Id: {order._id}</h1>
              <h1>User Id: {order.userId}</h1>
              <h1>Name: {order.username}</h1>
              <h1>Email: {order.email}</h1>
              <h1>Phone No: {order.phoneNo}</h1>
              <div className='shipping'>
                <h1>Shipping Details:-</h1>
                <div>
                  <h1>House No : {order.shippingDetails.houseNo}</h1>
                  <h1>Address : {order.shippingDetails.address}</h1>
                  <h1>Pin code : {order.shippingDetails.pinCode}</h1>
                  <h1>City : {order.shippingDetails.city}</h1>
                  <h1>State : {order.shippingDetails.state}</h1>
                </div>
              </div>    
            </div>
            <div><QRCode style={{ height: "auto", maxWidth: "250px"}} value={`Date:- ${order.createdAt.slice(0,10).split("-").reverse().join("-")}\nOrder Id: ${order._id}\nUser Id: ${order.userId}\nName: ${order.username}\nEmail: ${order.email}\nPhone No: ${order.phoneNo}\nTotal Amount: ${deliverCharge+GST+totalPrice} rupees\nHouse No: ${order.shippingDetails.houseNo}\nAddress: ${order.shippingDetails.address}\nPin code: ${order.shippingDetails.pinCode}\nCity: ${order.shippingDetails.city}\nState: ${order.shippingDetails.state}`} /></div>
            </div>


            <div className="w-full flex flex-col">
            <h1 className=" bg-main-800 text-white font-semibold text-xl py-2 px-4 mb-5">
              Order Summery
            </h1>
            <div className="border w-full">
              <div className="flex items-center justify-between my-2 px-4 py-1">
                <span>Total Price ({order.item.length} item)</span>
                <span className="flex items-center font-semibold ">
                &#8377; {totalPrice}
                </span>
              </div>
              <div className="flex items-center justify-between my-2 px-4 py-1">
                <span>GST</span>
                <span className="flex items-center font-semibold">
                +&#8377; {GST}
                </span>
              </div>
              <div className="flex items-center justify-between my-2 px-4 py-1">
                <span>Delievery Charge</span>
                <span className={` items-center font-semibold`}>
                  +&#8377;
                  {deliverCharge}
                </span>
              </div>
            </div>
            <h1 className="flex items-center justify-between my-2 px-4 py-2 font-bold text-xl border">
              <span>Total Amount</span>
              <span className="flex items-center">
                &#8377;
                {totalPrice+GST+deliverCharge}
              </span>
            </h1>
          </div>

          </div>
          {/* Print Page End */}

        </div>
         })}
         {/* Order End */}
        </div>

        {/* pagination  */}
        <div className='flex items-center justify-between w-full relative bottom-0'>
            <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Desc")}}><FaArrowLeft/></button>
            <div className='flex'>
            <p className='border p-2 w-10 h-10 text-center '>{currentPage}</p>
            <span className='text-3xl'>/</span>
            <p className='border p-2 w-10 h-10 text-center '>{totalPage}</p>
            </div>
            <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Inc")}}><FaArrowRight/></button>
        </div>
      </div>
    </div>
    
  )
}

export default Orders

