import React, { useEffect, useState } from 'react'
import BACKEND_URL from './baseUrl'
import axios  from 'axios'
import { Routes, Route } from 'react-router-dom';
import Header from './Component/Header'
import Footer from './Component/Footer'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import Detail from './Pages/Detail';
import Shipping from './Pages/Shipping';
import Confirm from './Pages/Confirm';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import SendResetLink from './Pages/SendResetLink'
import ChangePass from './Pages/ChangePass';
import Profile from './Pages/Profile';
import Page404 from './Pages/Page404';
import VerifyEmail from './Pages/VerifyEmail'
import WelcomOrder from './Pages/WelcomOrder';
import TrackOrder from './Pages/TrackOrder';

import Dashboard from './Pages/Dashboard';
import AddProduct from './Pages/AddProduct';


const App = () => {
  const [user,setUser]=useState('')
  const getUser = async()=>{
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/user`,{withCredentials:true})
      if(res.status===200){
        setUser(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
}

useEffect(()=>{
  getUser()
  //  eslint-disable-next-line react-hooks/exhaustive-deps
},[])
  return (
   <>
   <Header user={user}/>
    <Routes>
      <Route path='/' element={<Home user={user}/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/products' element={<Product user={user}/>} />
      <Route path='/details' element={<Detail user={user} getUser={getUser}/>} />
      <Route path='/cart' element={<Cart user={user} getUser={getUser}/>} />
      <Route path='/cart/shipping' element={<Shipping user={user} getUser={getUser}/>} />
      <Route path='/cart/confirm' element={<Confirm user={user}/>} />
      <Route path='/orders' element={<Order user={user}/>} />
      <Route path='/track' element={<TrackOrder/>} />
      <Route path='/welcome' element={<WelcomOrder user={user}/>} />
      {/* ///////////// */}
      <Route path='/profile' element={<Profile getUser={getUser} user={user}/>} />
      <Route path='/login' element={<Login getUser={getUser}/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/verifyemail' element={<VerifyEmail user={user}/>} />
      <Route path='/sendresetlink' element={<SendResetLink/>} />
      <Route path='/changepass' element={<ChangePass/>} />
      {/* ///////////// */}
      <Route path='/admin/dashboard' element={<Dashboard user={user}/>} />
      <Route path='/admin/dashboard/addproduct' element={<AddProduct user={user}/>} />
      {/* ///////////// */}
      <Route path='*' element={<Page404/>} />
    </Routes>
    <Footer/>
   </>
  )
}

export default App
