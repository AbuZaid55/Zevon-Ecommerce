import React, { useEffect, useState } from 'react'
import axios from 'axios'
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

import Dashboard from './Pages/Admin/Dashboard';
import Products from './Pages/Admin/Products';
import AddProduct from './Pages/Admin/AddProduct';
import UpdateProduct from './Pages/Admin/UpdateProduct';
import Users from './Pages/Admin/Users';
import Orders from './Pages/Admin/Orders';
import CancleOrder from './Pages/Admin/CancleOrders';
import ChangeStatus from './Pages/Admin/ChangeStatus';
import Payment from './Pages/Admin/Payment';
import FailedPayment from './Pages/Admin/FailedPayment';
import Setting from './Pages/Admin/Setting';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Sass/Admin.scss'
import Loading1 from './Pages/Loader1';
import Loading2 from './Pages/Loader2';

const App = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
  const location = useLocation().pathname
  const [path, setPath] = useState('')
  const [user, setUser] = useState('')
  const [allProduct, setAllProduct] = useState([])
  const [loader1, setLoader1] = useState(true)
  const [loader2, setLoader2] = useState(false)
  const [loading1, setLoading1] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [setting,setSetting]=useState('')

  const getUser = async () => {
    setLoading1(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/user`, { withCredentials: true })
      if (res.status === 200) {
        if (res.data.data.validated) {
          setUser(res.data.data)
        }
      }
    } catch (error) {
      setUser('Not Found!')
      console.log(error)
    }
    setLoading1(false)
  }
  const fetchProduct = async () => {
    setLoading2(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/products`)
      setAllProduct(res.data.data)
    } catch (error) {
      console.log(error)
    }
    setLoading2(false)
  }

  const getSiteSettings = async()=>{
    setLoading2(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/site/siteSetting`,{withCredentials:true})
      setSetting(res.data.data)
    } catch (error) {
      console.log(error)
    }
    setLoading2(false)
  }
  useEffect(() => {
    getUser()
    fetchProduct()
    getSiteSettings()
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    setPath(location)
  }, [location])
  useEffect(() => {
    if (!loading1 && !loading2) {
      setLoader1(false)
    }
  }, [loading1, loading2])
  return (
    <>
      <div className={`${(loader1) ? '' : 'hidden'}`}><Loading1 /></div>
      <div className={`${(loader2) ? '' : 'hidden'}`}><Loading2 /></div>
      <div className={`${(loader1) ? 'hidden' : ''}`}>
        <Header path={path} setLoader2={setLoader2} allProduct={allProduct} getUser={getUser} user={user} />
        <Routes>
          <Route path='/' element={<Home user={user} setting={setting} getUser={getUser} allProduct={allProduct} />} />
          <Route path='/contact' element={<Contact user={user} setLoader2={setLoader2} />} />
          <Route path='/products' element={<Product user={user} getUser={getUser} setting={setting} allProduct={allProduct} />} />
          <Route path='/details' element={<Detail setting={setting} setLoader2={setLoader2} fetchProduct={fetchProduct} user={user} getUser={getUser} />} />
          <Route path='/cart' element={<Cart user={user} setLoader2={setLoader2} getUser={getUser} />} />
          <Route path='/cart/shipping' element={<Shipping setLoader2={setLoader2} user={user} getUser={getUser} />} />
          <Route path='/cart/confirm' element={<Confirm setLoader2={setLoader2} getUser={getUser} user={user} />} />
          <Route path='/orders' element={<Order setLoader2={setLoader2} user={user} />} />
          <Route path='/track' element={<TrackOrder setLoader2={setLoader2} />} />
          <Route path='/welcome' element={<WelcomOrder user={user} />} />

          <Route path='/profile' element={<Profile setLoader2={setLoader2} getUser={getUser} user={user} />} />
          <Route path='/login' element={<Login setLoader2={setLoader2} getUser={getUser} />} />
          <Route path='/signup' element={<SignUp setLoader2={setLoader2} />} />
          <Route path='/verifyemail' element={<VerifyEmail setLoader2={setLoader2} getUser={getUser} user={user} />} />
          <Route path='/sendresetlink' element={<SendResetLink setLoader2={setLoader2} />} />
          <Route path='/changepass' element={<ChangePass setLoader2={setLoader2} />} />

          <Route path='/admin/dashboard' element={<Dashboard setLoader2={setLoader2} allProduct={allProduct} user={user} />} />
          <Route path='/admin/dashboard/products' element={<Products setting={setting} allProduct={allProduct} setLoader2={setLoader2} fetchProduct={fetchProduct} user={user} />} />
          <Route path='/admin/dashboard/addproduct' element={<AddProduct setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/updateproduct' element={<UpdateProduct allProduct={allProduct} fetchProduct={fetchProduct} setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/users' element={<Users setting={setting} setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/orders' element={<Orders setting={setting} setLoader2={setLoader2} fetchProduct={fetchProduct} user={user} />} />
          <Route path='/admin/dashboard/cancleorder' element={<CancleOrder setting={setting} setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/changestatus' element={<ChangeStatus setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/payment' element={<Payment setting={setting} setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/failedpayment' element={<FailedPayment setting={setting} setLoader2={setLoader2} user={user} />} />
          <Route path='/admin/dashboard/setting' element={<Setting setting={setting} getSiteSettings={getSiteSettings} setLoader2={setLoader2} user={user} />} />

          <Route path='*' element={<Page404 />} />
        </Routes>
        <Footer path={path} setting={setting}/>

        <ToastContainer />
      </div>
    </>
  )
}

export default App
