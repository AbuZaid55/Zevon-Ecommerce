import React,{useState} from 'react'
import { FaHome,FaMapMarkedAlt,FaUserFriends,FaShoppingCart,FaPlusSquare,FaNotesMedical,FaTimes,FaCcAmazonPay,FaCreditCard,FaWhmcs,FaAngleDoubleRight ,FaAngleDoubleLeft} from "react-icons/fa";
import {Link} from 'react-router-dom'

const Aside = () => {
  const [showAside,setShowAside]=useState(false)
  return (
    <>
    <input className='hidden' type="checkbox" id='checkbox'/>
    <div id='aside'>
      <div className=' scrollbar-hide'>
      <label htmlFor="checkbox"><span onClick={()=>{setShowAside(!showAside)}}><FaAngleDoubleRight className={`${(showAside)?'hidden':''}`}/><FaAngleDoubleLeft className={`${(showAside)?'':'hidden'}`}/></span></label>
        <Link to='/admin/dashboard'> <h1 className='logo'>Dashboard</h1></Link>
        <div>
          <p>MAIN</p>
          <Link to='/'><h1><FaHome className='icon'/>Homepage</h1></Link>
          <p>PRODUCTS</p>
          <Link to='/admin/dashboard/products'><h1><FaShoppingCart className='icon'/>Products</h1></Link>
          <Link to='/admin/dashboard/addproduct'><h1><FaPlusSquare className='icon'/>Add Products</h1></Link>
          <p>USERS</p>
          <Link  to='/admin/dashboard/users'><h1><FaUserFriends className='icon'/>Users</h1></Link>
          <p>ORDERS</p>
          <Link to='/admin/dashboard/orders'><h1><FaNotesMedical className='icon'/>Orders</h1></Link>
          <Link to='/admin/dashboard/cancleorder'><h1><FaTimes className='icon'/>Cancelled Orders</h1></Link>
          <Link to='/admin/dashboard/changestatus'><h1><FaMapMarkedAlt className='icon'/>Change Status</h1></Link>
          <p>PAYMENT</p>
          <Link to='/admin/dashboard/payment'><h1><FaCcAmazonPay className='icon'/>Payment</h1></Link>
          <Link to='/admin/dashboard/failedpayment'><h1><FaCreditCard className='icon'/>Failed Payment</h1></Link>
          <p>SETTING</p>
          <Link to='/admin/dashboard/setting'><h1><FaWhmcs className='icon'/>Setting</h1></Link>
        </div>
      </div>
    </div>
    </>
  ) 
}

export default Aside
