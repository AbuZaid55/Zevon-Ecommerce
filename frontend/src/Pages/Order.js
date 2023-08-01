import React,{useState,useEffect} from 'react'
import { FaRupeeSign,FaTimes ,FaMapMarker} from 'react-icons/fa';
import GoLogin from '../Component/GoLogin';
import { Link } from 'react-router-dom';

const Order = (props) => {
  const [qty,setQty]=useState(1)
  const [login,setLogin]=useState(true)
  const [user,setUser]=useState({_id:"",email:"",name:"",cart:[],shippingDetails:[],profile:""})

  useEffect(()=>{
    if(props.user._id){
      setLogin(true)
      setUser(props.user)
    }else{
      setLogin(false)
    }
  },[props.user])
  
  return (<>
    <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
    <div className={`${(login)?"":"hidden"} mt-8 sm:mt-0`}>
      {/* order  */}
      <div className="sm:mx-4 p-2 my-3 border">
      <div className=' sm:flex flex-row items-center justify-between py-2 px-3 mb-2 bg-fuchsia-800 text-white'><h1>Order Id : 20234564035113azfh44</h1><Link to="/track"><button className='flex items-center border px-3 py-1 ml-auto mt-2 sm:mt-0'><FaMapMarker className='mr-2'/> Track</button></Link></div>
        {/* item  */}
      <div className="flex border my-2 py-1">
      <img className="m-2" width={"80px"} height={"80px"} src="/Images/Products/Mens-Lightweight-Puffer-Jacket01-600x764.jpg" alt="Pic" />
      <div className='w-full'>
      <h1 className=' lg:text-2xl font-semibold'>Mens-Lightweight-Puffer-Jacket </h1>
      <div className='flex items-center justify-between flex-wrap'>
      <p className="lg:text-xl">Size: M</p>
      <p className="flex items-center lg:text-xl">Color: <span className="w-5 h-5 inline-block ml-1 rounded-full" style={{backgroundColor:"red"}}></span></p>
      <p className="flex items-center lg:text-xl">Price: <FaRupeeSign className=" font-extralight"/><span className="font-bold">2500</span></p>
      <p className="flex items-center lg:text-xl">Quentity: 4</p>
      <p className="flex items-center lg:text-xl">Total: <FaRupeeSign className=" font-extralight"/><span className="font-bold">2500</span></p>
      </div>
      <p className="lg:text-xl my-1">Status : <span className=' text-fuchsia-800 font-semibold'>Processing</span><span className='hidden text-green-800 font-semibold'>Delivered</span></p>
      <button className='flex items-center lg:text-xl border px-2 py-1 cursor-pointer my-1 hover:bg-fuchsia-50 rounded-full border-fuchsia-800'><FaTimes className='mr-2'/>Cancle</button>
      </div>
      </div>
      <div className="flex border my-1">
      <img className="m-2" width={"80px"} height={"80px"} src="/Images/Products/Mens-Lightweight-Puffer-Jacket01-600x764.jpg" alt="Pic" />
      <div className='w-full'>
      <h1 className=' lg:text-2xl font-semibold'>Mens-Lightweight-Puffer-Jacket </h1>
      <div className='flex items-center justify-between flex-wrap'>
      <p className="lg:text-xl">Size: M</p>
      <p className="flex items-center lg:text-xl">Color: <span className="w-5 h-5 inline-block ml-1 rounded-full" style={{backgroundColor:"red"}}></span></p>
      <p className="flex items-center lg:text-xl">Price: <FaRupeeSign className=" font-extralight"/><span className="font-bold">2500</span></p>
      <p className="flex items-center lg:text-xl">Quentity: 4</p>
      <p className="flex items-center lg:text-xl">Total: <FaRupeeSign className=" font-extralight"/><span className="font-bold">2500</span></p>
      </div>
      <p className="lg:text-xl my-1">Status : <span className=' text-fuchsia-800 font-semibold'>Processing</span><span className='hidden text-green-800 font-semibold'>Delivered</span></p>
      <button className='flex items-center lg:text-xl border px-2 py-1 cursor-pointer my-1 hover:bg-fuchsia-50 rounded-full border-fuchsia-800'><FaTimes className='mr-2'/>Cancle</button>
      </div>
      </div>
      <div className="flex border my-1">
      <img className="m-2" width={"80px"} height={"80px"} src="/Images/Products/Mens-Lightweight-Puffer-Jacket01-600x764.jpg" alt="Pic" />
      <div className='w-full'>
      <h1 className=' lg:text-2xl font-semibold'>Mens-Lightweight-Puffer-Jacket </h1>
      <div className='flex items-center justify-between flex-wrap'>
      <p className="lg:text-xl">Size: M</p>
      <p className="flex items-center lg:text-xl">Color: <span className="w-5 h-5 inline-block ml-1 rounded-full" style={{backgroundColor:"red"}}></span></p>
      <p className="flex items-center lg:text-xl">Price: <FaRupeeSign className=" font-extralight"/><span className="font-bold">2500</span></p>
      <p className="flex items-center lg:text-xl">Quentity: 4</p>
      <p className="flex items-center lg:text-xl">Total: <FaRupeeSign className=" font-extralight"/><span className="font-bold">2500</span></p>
      </div>
      <p className="lg:text-xl my-1">Status : <span className=' text-fuchsia-800 font-semibold'>Processing</span><span className='hidden text-green-800 font-semibold'>Delivered</span></p>
      <button className='flex items-center lg:text-xl border px-2 py-1 cursor-pointer my-1 hover:bg-fuchsia-50 rounded-full border-fuchsia-800'><FaTimes className='mr-2'/>Cancle</button>
      </div>
      </div>
      {/* item end  */}
      <div className="flex flex-col sm:flex-row sm:items-center mt-3">
        <p>Ordered On : <span className='font-semibold'>Sat, Jul 29th'23</span></p>
        <p className="flex items-center lg:text-xl ml-auto">Order Total : <FaRupeeSign className=" font-extralight text-green-600"/><span className="font-bold text-green-600">{2500*qty}</span></p>
      </div>
      </div>
      {/* order end  */}
    </div>
    </>)
}

export default Order
