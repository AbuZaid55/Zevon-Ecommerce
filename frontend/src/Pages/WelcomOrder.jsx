import React,{useEffect,useState} from 'react'
import GoLogin from '../Component/GoLogin';
import { FaCheck } from "react-icons/fa";
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux';

const WelcomOrder = () => {
  const user = useSelector((state) => (state.user))
  const [login,setLogin]=useState(false)

  useEffect(()=>{
    if(user._id){
      setLogin(true)
    }else{
      setLogin(false)
    }
  },[user])
  return (
    <>
    <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
    <div className={`${(login)?"":"hidden"}`}>
    <div className='flex items-center justify-center flex-col text-center' style={{height:"70vh"}}>
      <FaCheck className=' bg-main-800 text-white  p-3 text-6xl rounded-full'/>
      <h1 className='text-2xl my-4'>Your Order has been Placed successfully</h1>
      <Link to="/orders"><button className=' bg-main-800 text-white px-4 py-2 rounded-full'>View Order</button></Link>
    </div>
    </div>
    </>
  )
}

export default WelcomOrder
