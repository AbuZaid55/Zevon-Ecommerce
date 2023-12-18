import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom';
import Header from './Component/Header.jsx';
import Footer from './Component/Footer.jsx';
import Home from './Pages/Home.jsx';
import Contact from './Pages/Contact.jsx';
import Product from './Pages/Product.jsx';
import Cart from './Pages/Cart.jsx';
import Order from './Pages/Order.jsx';
import Detail from './Pages/Detail.jsx';
import Shipping from './Pages/Shipping.jsx';
import Confirm from './Pages/Confirm.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import SendResetLink from './Pages/SendResetLink.jsx';
import ChangePass from './Pages/ChangePass.jsx';
import Profile from './Pages/Profile.jsx';
import Page404 from './Pages/Page404.jsx';
import VerifyEmail from './Pages/VerifyEmail.jsx';
import WelcomOrder from './Pages/WelcomOrder.jsx';
import TrackOrder from './Pages/TrackOrder.jsx';

import Dashboard from './Pages/Admin/Dashboard.jsx';
import Products from './Pages/Admin/Products.jsx';
import AddProduct from './Pages/Admin/AddProduct.jsx';
import UpdateProduct from './Pages/Admin/UpdateProduct.jsx';
import Users from './Pages/Admin/Users.jsx';
import Orders from './Pages/Admin/Orders.jsx';
import CancleOrder from './Pages/Admin/CancleOrders.jsx';
import ChangeStatus from './Pages/Admin/ChangeStatus.jsx';
import Payment from './Pages/Admin/Payment.jsx';
import FailedPayment from './Pages/Admin/FailedPayment.jsx';
import Setting from './Pages/Admin/Setting.jsx';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Sass/Admin.scss'
import Loading1 from './Pages/Loader1.jsx';
import Loading2 from './Pages/Loader2.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './Redux/slice/user.js';
import { setProduct } from './Redux/slice/product.js';
import { setSetting } from './Redux/slice/setting.js';

import { context } from './Context/context';

const App = () => {
  const dispatch = useDispatch()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [loader1, setLoader1] = useState(true)
  const [loader2, setLoader2] = useState(false)

  const getUser = async () => {
    setLoader1(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/user`, { withCredentials: true })
      if (res.status === 200) {
        if (res.data.data.validated) {
          dispatch(setUser(res.data.data))
        }
      }
    } catch (error) {
      dispatch(setUser('Not Found!'))
    }
    setLoader1(false)
  }
  const fetchProduct = async () => {
    setLoader2(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/products`)
      dispatch(setProduct(res.data.data))
    } catch (error) {
    }
    setLoader2(false)
  }
  const getSiteSettings = async () => {
    setLoader2(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/site/siteSetting`)
      dispatch(setSetting(res.data.data))
    } catch (error) {
      console.log(error)
    }
    setLoader2(false)
  }

  useEffect(() => {
    getUser()
    fetchProduct()
    getSiteSettings()
  }, [])
  return (
    <context.Provider value={{ setLoader2, getUser, fetchProduct,getSiteSettings }}>
      <div className={`${(loader1) ? '' : 'hidden'}`}><Loading1 /></div>
      <div className={`${(loader2) ? '' : 'hidden'}`}><Loading2 /></div>
      <div className={`${(loader1) ? 'hidden' : ''}`}>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/products' element={<Product />} />
          <Route path='/details' element={<Detail />} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/cart/shipping' element={<Shipping/>} />
          <Route path='/cart/confirm' element={<Confirm/>} />
          <Route path='/orders' element={<Order/>} />
          <Route path='/track' element={<TrackOrder/>} />
          <Route path='/welcome' element={<WelcomOrder/>} />

          <Route path='/profile' element={<Profile/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/verifyemail' element={<VerifyEmail/>} />
          <Route path='/sendresetlink' element={<SendResetLink/>} />
          <Route path='/changepass' element={<ChangePass/>} />

          <Route path='/admin/dashboard' element={<Dashboard/>} />
          <Route path='/admin/dashboard/products' element={<Products/>} />
          <Route path='/admin/dashboard/addproduct' element={<AddProduct/>} />
          <Route path='/admin/dashboard/updateproduct' element={<UpdateProduct/>} />
          <Route path='/admin/dashboard/users' element={<Users/>} />
          <Route path='/admin/dashboard/orders' element={<Orders/>} />
          <Route path='/admin/dashboard/cancleorder' element={<CancleOrder/>} />
          <Route path='/admin/dashboard/changestatus' element={<ChangeStatus/>} />
          <Route path='/admin/dashboard/payment' element={<Payment/>} />
          <Route path='/admin/dashboard/failedpayment' element={<FailedPayment/>} />
          <Route path='/admin/dashboard/setting' element={<Setting/>} />

          <Route path='*' element={<Page404 />} />
        </Routes>
        <Footer />

        <ToastContainer position="bottom-right"/>
      </div>
    </context.Provider>
  )
}

export default App
