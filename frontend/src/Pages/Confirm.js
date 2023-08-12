import React, { useState, useEffect } from "react";
import GoLogin from "../Component/GoLogin";
import BACKEND_URL from '../baseUrl'
import axios from 'axios'
import {
  FaRupeeSign,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Confirm = (props) => {
  const location = useLocation();
  const navigate = useNavigate()
  const [totalPrice,setTotalPrice]=useState(0)
  const [GST,setGST]=useState(0)
  const [deliveryCharge,setDeliveryCharge]=useState(0)
  const [user,setUser]=useState({_id:"",email:"",name:"",cart:[],shippingDetails:[],profile:""})
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState({})
  const makePayment = async(e)=>{
    props.setLoader2(true)
    e.preventDefault()
    const orderDetails = {email:user.email,address:address}
    try {
      if(user.email!=='' || address && address.name && address.address){
        const res = await axios.post(`${BACKEND_URL}/order/payment/createOrder`,orderDetails)
        initPayment(res.data.data)
      }else{
        toast.error("Invvalid shipping details")
      }
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const initPayment = (data)=>{ 
    const options = {
      key: data.razorpay_key_id, 
      amount: data.amount, 
      currency: "INR",
      name: "Zevon Ecommerce",
      order_id: data.id, 
      handler:async function (response){
        try {
            const res = await axios.post(`${BACKEND_URL}/order/payment/verify`,response)
            props.getUser()
            if(res.status===200){
              toast.success(res.data.massage)
              navigate('/welcome')
            }
          } catch (error) {
            toast.error(error.response.data.massage)
        }
      }
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open()
  }


  useEffect(() => {
    if (props.user._id) {
      setUser(props.user)
      setLogin(true);
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
    } else {
      setLogin(false);
    }
    if (location.state && location.state.address) {
      setAddress(location.state.address);
    }
  }, [props.user]);
  return (
    <>
      <div className={`${login ? "hidden" : ""}`}>
        <GoLogin />
      </div>
      <div className={`${login ? "" : "hidden"}`}>
        <div className="sm:flex  mt-9 sm:mt-0">
          <div className="w-full sm:w-4/6">
            {/* shipping details  */}
            <h1 className=" bg-fuchsia-800 text-white font-semibold text-xl py-2 px-4 mb-5">
              Shipping Details
            </h1>
            <div className="border w-80 m-5 p-4">
              <h1>{address.name}</h1>
              <p>{address.houseNo} {address.address} {address.city} {address.state}</p>
              <p>{address.pinCode}</p>
              <p>Phone No : <span>{address.phoneNo}</span></p>
              <p>Email : <span>{user.email}</span></p> 
            </div>

            {/* cart item  */}
            <h1 className=" bg-fuchsia-800 text-white font-semibold text-xl py-2 px-4 my-5">
              Your Cart Items
            </h1>
            {
              user.cart && user.cart.map((item,i)=>{
                return <div key={i} className="flex border p-2 my-3">
              <img
                className="m-2"
                width={"80px"}
                height={"80px"}
                src={`${BACKEND_URL}/Images/${item.thumbnail}`}
                alt="Pic"
              />
              <div className="w-full flex flex-col justify-center">
                <h1 className=" lg:text-2xl font-semibold">
                  {item.name}
                </h1>
                <div className="flex items-center justify-between flex-wrap">
                  <p className="lg:text-xl">Size: {item.size}</p>
                  <p className="flex items-center lg:text-xl">
                    Color:
                    <span
                      className="w-5 h-5 inline-block ml-1 rounded-full"
                      style={{ backgroundColor: `${item.color}` }}
                    ></span>
                  </p>
                  <p className="flex items-center lg:text-xl">
                    Price: <FaRupeeSign className=" font-extralight" />
                    <span className="font-bold">{item.price}</span>
                  </p>
                  <p className="flex items-center lg:text-xl">Quentity: {item.qty}</p>
                  <p className="flex items-center lg:text-xl">
                    Total: <FaRupeeSign className=" font-extralight" />
                    <span className="font-bold">{item.price*item.qty}</span>
                  </p>
                </div>
              </div>
            </div>
              })
            }
          </div>
          <div className="w-full md:w-2/6">
            <h1 className=" bg-fuchsia-800 text-white font-semibold text-xl py-2 px-4 mb-5">
              Order Summery
            </h1>
            <div className="border w-full">
              <div className="flex items-center justify-between my-2 px-4 py-1">
                <span>Total Price ({user.cart.length} item)</span>
                <span className="flex items-center font-semibold ">
                  <FaRupeeSign />
                  {totalPrice}
                </span>
              </div>
              <div className="flex items-center justify-between my-2 px-4 py-1">
                <span>GST</span>
                <span className="flex items-center font-semibold">
                  +<FaRupeeSign />
                  {GST}
                </span>
              </div>
              <div className="flex items-center justify-between my-2 px-4 py-1">
                <span>Delievery Charge</span>
                <span className={`${(deliveryCharge!==0)?'flex':'hidden'} items-center font-semibold`}>
                  +<FaRupeeSign />
                  {deliveryCharge}
                </span>
                <span className={` ${(deliveryCharge!==0)?'hidden':''} text-green-600 font-semibold`}>Free</span>
              </div>
            </div>
            <h1 className="flex items-center justify-between my-2 px-4 py-2 font-bold text-xl border">
              <span>Total Amount</span>
              <span className="flex items-center">
                <FaRupeeSign />
                {totalPrice+GST+deliveryCharge}
              </span>
            </h1>
            <div className="flex items-center justify-end">
              <button className=" bg-fuchsia-800 text-white px-4 py-2 rounded-full cursor-pointer my-5 mx-3" onClick={(e)=>{makePayment(e)}}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
