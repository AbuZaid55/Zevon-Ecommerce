import React,{useState,useEffect} from "react";
import { FaRupeeSign,FaTrash } from 'react-icons/fa';
import {useNavigate,Link} from 'react-router-dom'
import GoLogin from '../Component/GoLogin';
import axios from 'axios'
import { toast } from 'react-toastify'

const Cart = (props) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
  const navigate = useNavigate()
  const [totalPrice,setTotalPrice]=useState(0)
  const [GST,setGST]=useState(0)
  const [deliveryCharge,setDeliveryCharge]=useState(0)
  const [login,setLogin]=useState(false)
  const [user,setUser]=useState({_id:"",email:"",name:"",cart:[],shippingDetails:[],profile:""})

const goShipping = (e)=>{
  e.preventDefault()
  navigate('/cart/shipping',{state:{orderItme:"thisisorderitem",paymentDetails:""}})
}


const setQty = async(e,act,productId,i)=>{
  props.setLoader2(true)
  e.preventDefault()
  try {
    await axios.post(`${BACKEND_URL}/auth/setQty`,{action:act,productId:productId,userId:user._id,index:i})
    props.getUser()
  } catch (error) {
    const massage = error.response.data.massage
    if(massage==="Invalid User"){
      navigate('/login',{state:{path:'/cart'}})
    }else{
      toast.error(error.response.data.massage)
    }
  }
  props.setLoader2(false)
}

const removeItem = async(e,i)=>{
  props.setLoader2(true)
  e.preventDefault()
  try {
    await axios.post(`${BACKEND_URL}/auth/removeCartItem`,{userId:user._id,index:i})
    props.getUser()
  } catch (error) {
    const massage = error.response.data.massage
    if(massage==="Invalid User"){
      navigate('/login',{state:{path:'/cart'}})
    }else{
      toast.error(error.response.data.massage)
    }
  }
  props.setLoader2(false)
}


useEffect(()=>{
  if(props.user._id){
    setLogin(true)
    setUser(props.user)
    let totalPrice = 0
    let GST = 0
    let deliveryCharge = 0
    props.user.cart.map((item)=>{
      totalPrice = totalPrice+(item.price*item.qty)
      GST = GST+(item.GST*item.qty)
      deliveryCharge=deliveryCharge+(item.deliveryCharge*item.qty)
    })
    setGST(GST)
    setDeliveryCharge(deliveryCharge)
    setTotalPrice(totalPrice)
  }else{
    setLogin(false)
  }
},[props.user])
  return (<>
  <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
  <div className={`w-full ${(login && user.cart.length===0)?"flex":"hidden"} items-center justify-center flex-col`} style={{height:"49vh"}}><h1 className="text-5xl font-bold text-main-800">No Cart Item</h1><Link to="/products" className="px-4 py-3 bg-main-800 text-white font-semibold mt-5 rounded-full">Go to Shopping</Link></div>
    <div className={`w-full ${(login && user.cart.length!==0)?"flex":"hidden"} flex-col sm:flex-row mt-10 sm:mt-0 `} style={{minHeight:"49vh"}}>
      <div className="w-full sm:w-4/6 ">
        {/* item  */}
    {
      user.cart.map((item,i)=>{
        return <div key={i} className="mx-4 p-1 sm:p-4 my-3 border">
        <div className="flex items-center">
        <div className="w-20 h-20 bg-black mx-2"><img className="w-full h-full" src={`${BACKEND_URL}/Images/${item.thumbnail}`} alt="Pic" /></div>
        <div>
        <Link to={`/details?_id=${item.productId}`}><h1 className=' lg:text-2xl font-semibold'>{item.name} </h1></Link>
        <p className={`${(item.size && item.size!=='')?'':'hidden'} lg:text-xl`}>Size: {`${(item.size!=='')?item.size:''}`}</p>
        <p className={`${(item.color && item.color!=='')?'flex':'hidden'} items-center lg:text-xl`}>Color: <span className="w-5 h-5 inline-block ml-1 rounded-full" style={{backgroundColor:`${(item.color!=='')?item.color:''}`}}></span></p>
        <p className="flex items-center lg:text-xl">Price: <FaRupeeSign className=" font-extralight"/><span className="font-bold">{item.price}</span></p>
        </div>
        </div>
        <div className="flex items-center mt-3">
          <div className="flex">
            <span className='mr-1 sm:mr-3 bg-main-800 text-white text-xl w-7 h-7 flex items-center justify-center cursor-pointer rounded' onClick={(e)=>{setQty(e,"Dec",item.productId,i)}}>-</span>
            <span className='mr-1 sm:mr-3 border border-main-800 text-main-800 text-xl w-7 h-7 flex items-center justify-center cursor-pointer rounded'>{item.qty}</span>
            <span className='mr-1 sm:mr-3 bg-main-800 text-white text-xl w-7 h-7 flex items-center justify-center cursor-pointer rounded' onClick={(e)=>{setQty(e,"Inc",item.productId,i)}}>+</span>
          </div>
          <p className="text-xl sm:mx-4 mx-1 cursor-pointer hover:text-red-700" onClick={(e)=>{removeItem(e,i)}}><FaTrash/></p>
          <p className="flex items-center lg:text-xl ml-auto">Total Price: <FaRupeeSign className=" font-extralight text-green-700"/><span className="font-bold text-green-700">{item.price*item.qty}</span></p>
        </div>
        </div>
      })
    }
      {/* item end  */}
      </div>
      {/* price details  */}
      <div className={`${(login && user.cart.length!==0)?"":"hidden"} w-full sm:w-2/6 mt-4 `}>
        <h1 className=" bg-main-800 text-white px-4 py-1">PRICE DETAILS</h1>
        <div className="border-b w-full">
          <div className="flex items-center justify-between my-2 px-4 py-1"><span>Total Price ({user.cart.length} item)</span><span className="flex items-center font-semibold "><FaRupeeSign />{totalPrice}</span></div>
          <div className="flex items-center justify-between my-2 px-4 py-1"><span>GST</span><span className="flex items-center font-semibold">+<FaRupeeSign />{GST}</span></div>
          <div className="flex items-center justify-between my-2 px-4 py-1"><span>Delievery Charge</span><span className={` ${(deliveryCharge!==0)?'flex':'hidden'} items-center font-semibold`}>+<FaRupeeSign />{deliveryCharge}</span><span className={` ${(deliveryCharge===0)?'':'hidden'} text-green-700 font-semibold`}>Free</span></div>
        </div>
        <h1 className="flex items-center justify-between my-2 px-4 py-2 font-bold text-xl border-b"><span>Total Amount</span><span className="flex items-center"><FaRupeeSign/>{totalPrice+GST+deliveryCharge}</span></h1>
        <div className="flex items-center justify-end" ><button className=" bg-main-800 text-white px-4 py-2 rounded-full cursor-pointer my-5 mx-3" onClick={(e)=>{goShipping(e)}}>CHECK OUT</button></div>
      </div>
    </div>
  </>);
};

export default Cart;