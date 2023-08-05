import React, { useEffect, useState } from 'react'
import BACKEND_URL from './baseUrl'
import axios  from 'axios'
import { Routes, Route, useLocation } from 'react-router-dom';
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
import Logout from './Pages/Logout';

import Dashboard from './Pages/Dashboard';
import AddProduct from './Pages/AddProduct';


const App = () => {
  const location = useLocation().pathname
  const [path,setPath]=useState('')
  const [user,setUser]=useState('')
  const [allProduct,setAllProduct]=useState([])

  const getUser = async()=>{
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/user`,{withCredentials:true})
      if(res.status===200){
        if(res.data.data.validated){
          setUser(res.data.data)
        }
      } 
    } catch (error) {
      setUser('')
    }
  }
  const fetchProduct = async()=>{
  try {
    const res = await axios.get(`${BACKEND_URL}/products`)
    setAllProduct(res.data)
  } catch (error) {
    alert(error.response.data.massage)
  }
  }

useEffect(()=>{
  getUser()  
  fetchProduct()
  //  eslint-disable-next-line react-hooks/exhaustive-deps
},[])
useEffect(()=>{
  setPath(location)
},[location])
  return (
   <>
   <Header path={path} allProduct={allProduct} user={user}/>
    <Routes>
      <Route path='/' element={<Home user={user} getUser={getUser} allProduct={allProduct}/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/products' element={<Product user={user} allProduct={allProduct}/>} />
      <Route path='/details' element={<Detail user={user} getUser={getUser}/>} />
      <Route path='/cart' element={<Cart user={user} getUser={getUser}/>} />
      <Route path='/cart/shipping' element={<Shipping user={user} getUser={getUser}/>} />
      <Route path='/cart/confirm' element={<Confirm getUser={getUser} user={user}/>} />
      <Route path='/orders' element={<Order user={user}/>} />
      <Route path='/track' element={<TrackOrder/>} />
      <Route path='/welcome' element={<WelcomOrder user={user}/>} />
      {/* ///////////// */}
      <Route path='/profile' element={<Profile getUser={getUser} user={user}/>} />
      <Route path='/login' element={<Login getUser={getUser}/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/verifyemail' element={<VerifyEmail getUser={getUser} user={user}/>} />
      <Route path='/sendresetlink' element={<SendResetLink/>} />
      <Route path='/changepass' element={<ChangePass/>} />
      <Route path='/logout' element={<Logout user={user} getUser={getUser}/>} />
      {/* ///////////// */}
      <Route path='/admin/dashboard' element={<Dashboard user={user}/>} />
      <Route path='/admin/dashboard/addproduct' element={<AddProduct user={user}/>} />
      {/* ///////////// */}
      <Route path='/page404' element={<Page404/>} />
      <Route path='*' element={<Page404/>} />
    </Routes>
    <Footer path={path}/>
   </>
  )
}

export default App
