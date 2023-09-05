import React, { useState, useEffect } from 'react'
import GoLogin from '../Component/GoLogin';
import { FaCamera, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'

const Profile = (props) => {
  const [newAddress, setNewAddress] = useState({ name: "", houseNo: "", address: "", pinCode: "", city: "", state: "", phoneNo: "" })
  const [user, setUser] = useState({ _id: "", email: "", name: "", cart: [], shippingDetails: [], profile: "" })
  const [userProfile, setUserProfile] = useState('/Images/profile.jpg')
  const [showAddressForm, setshowAddressForm] = useState(false)
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
  const [showInput, setShowInput] = useState(false)
  const [changeName, setChangeName] = useState('')
  const [login, setLogin] = useState(false)

  const handleNewAddress = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value })
  }

  const addShippingDetails = async (e) => {
    props.setLoader2(true)
    e.preventDefault()
    try {
      newAddress["_id"] = user._id
      const res = await axios.post(`${BACKEND_URL}/auth/addShippingDetails`, newAddress)
      setNewAddress({ name: "", houseNo: "", address: "", pinCode: "", city: "", state: "", phoneNo: "" })
      setshowAddressForm(false)
      props.getUser()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const deleteShippingDetails = async (i) => {
    props.setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/deleteShippingDetails`, { _id: user._id, index: i })
      props.getUser()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const uploadProfile = async (e) => {
    props.setLoader2(true)
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("_id", user._id)
    formdata.append("profile", e.target.files[0])
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/uploadProfile`, formdata)
      toast.success(res.data.massage)
      props.getUser()
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const submitName = async () => {
    props.setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/changeName`, { name: changeName, userId: user._id }, { withCredentials: true })
      props.getUser()
      setShowInput(false)
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  useEffect(() => {
    if (props.user._id) {
      setLogin(true)
      setUser(props.user)
      setChangeName(props.user.name)
      if (props.user.profile !== '' && props.user.profile.includes('https://')) {
        setUserProfile(props.user.profile)
      } else if (props.user.profile !== '') {
        setUserProfile(`${BACKEND_URL}/Images/${props.user.profile}`)
      } else {
        setUserProfile('/Images/profile.jpg')
      }
    } else {
      setLogin(false)
    }
  }, [props.user])

  return (<>
    <div className={`${(login) ? "hidden" : ""}`}><GoLogin /></div>
    <div className={`${(login) ? "" : "hidden"}`}>
      <div className='w-full flex flex-col sm:flex-row my-10'>
        <div className='w-full sm:w-1/2 flex items-center justify-center'>
          <div className='w-64 h-64 sm:w-72 sm:h-72 border-2 rounded-full relative mt-3'><img className='w-full h-full rounded-full border-4 border-main-800' src={userProfile} alt="Pic" />
            <label htmlFor="upload" className=' cursor-pointer absolute top-3/4 right-4 border shadow-md bg-white p-2 text-xl text-main-800 rounded-full'><FaCamera /></label>
            <input type="file" className='hidden' id='upload' onChange={(e) => { uploadProfile(e) }} />
          </div>
        </div>
        <div className='w-full sm:w-1/2 flex items-center sm:items-start justify-center flex-col mt-10'>
          <h1 className='text-3xl px-3'>Hello</h1>
          <div className='relative'>
            <input type="text" placeholder='Name' autoComplete="new-off" className={`text-center text-5xl sm:text-7xl font-semibold w-60 ${(showInput) ? '' : 'hidden'}`} style={{ maxWidth: "300px" }} value={changeName} onChange={(e) => { setChangeName(e.target.value) }} />
            <div className={`flex items-center text-white justify-center ${(showInput) ? '' : 'hidden'} w-60`}>
              <button className='mx-2 bg-red-700 px-3 py-1 rounded' onClick={() => { setShowInput(false) }}>CANCLE</button>
              <button className='mx-2 bg-green-700 px-3 py-1 rounded' onClick={() => { submitName() }}>SAVE</button>
            </div>
            <h1 className={`text-5xl sm:text-7xl font-semibold ${(showInput) ? 'hidden' : ''} whitespace-nowrap w-60 overflow-hidden overflow-x-auto text-center`}>{user.name}</h1>
            <span className='absolute -top-5 right-0 bg-green-700 cursor-pointer text-white p-1 rounded' onClick={() => { setShowInput(true) }}>Edit</span>
          </div>
          <div className='flex flex-col w-60'>
            <Link to="/orders"><button className=' bg-main-800 text-white w-full mt-5  py-2 rounded'>My Orders</button></Link>
            <Link to="/sendresetlink"><button className=' bg-main-800 text-white w-full mt-3 py-2 rounded'>Change Password</button></Link>
          </div>
        </div>
      </div>
      <div>
        <h1 className='text-center text-3xl sm:text-4xl font-semibold my-10'>Prosonal Information</h1>
        <div className='w-full lg:w-5/6 mx-auto my-10 flex items-center sm:items-start flex-col '>
          <div className='pl-3'>
            <h1 className='text-xl sm:text-3xl my-5 px-5'>Name : {user.name}</h1>
            <h1 className='text-xl sm:text-3xl my-5 px-5'>Email : {user.email}</h1>
            <h1 className='text-xl sm:text-3xl my-5 px-5'>User Id : {user._id}</h1>
            <h1 className={`${(user.type === 'Admin' || user.type === 'Worker') ? '' : 'hidden'} text-xl sm:text-3xl my-5 px-5`}>Account Type: <span className={`${(user.type === 'Admin') ? 'text-green-700' : ''} ${(user.type === 'Worker') ? 'text-blue-700' : ''} font-semibold`}>{user.type}</span></h1>
            <h1 className='text-xl sm:text-3xl my-5 px-5'>Shipping Address :-</h1>
          </div>
          <div className='flex flex-wrap items-center justify-evenly'>
            {user.shippingDetails.map((data, i) => {
              return <div key={i} className='border w-72 sm:w-80 m-5 p-4 relative'>
                <button className='absolute top-0 right-0 p-2 text-main-800' onClick={() => { deleteShippingDetails(i) }}><FaTrash /></button>
                <h1>{data.name}</h1>
                <p>{data.houseNo} {data.address} {data.city} {data.state}</p>
                <p>{data.pinCode}</p>
                <p>Phone No : <span>{data.phoneNo}</span></p>
                <p>Email : <span>{user.email}</span></p>
              </div>
            })}
          </div>
          <button className='flex items-center justify-center py-2 px-4 bg-main-800 text-white font-bold m-5 rounded-full ml-auto' onClick={() => { setshowAddressForm(!showAddressForm) }}><FaPlus className='mr-2' /> Add New Address</button>

          <div className={`${(showAddressForm) ? 'flex' : 'hidden'} items-center justify-center w-full`}>
            <form className='flex justify-center flex-col w-full mx-3 sm:w-4/5' onSubmit={(e) => { addShippingDetails(e) }}>
              <h1 className=' bg-main-800 text-white font-semibold text-xl py-2 px-4 my-5'>Add Shipping Address</h1>
              <label className='text-lg' htmlFor="name">Name</label>
              <input className='border-b border-main-800 py-1' name='name' placeholder='Enter your name' type="text" id='name' value={newAddress.name} onChange={(e) => { handleNewAddress(e) }} />
              <label className='text-lg' htmlFor="houseNo">House No</label>
              <input className='border-b border-main-800 py-1' name='houseNo' placeholder='Enter House No' type="text" id='houseNo' value={newAddress.houseNo} onChange={(e) => { handleNewAddress(e) }} />
              <label className='text-lg' htmlFor="address">Address</label>
              <input className='border-b border-main-800 py-1' name='address' placeholder='Enter Address' type="text" id='address' value={newAddress.address} onChange={(e) => { handleNewAddress(e) }} />
              <label className='text-lg' htmlFor="pinCode">Pin Code</label>
              <input className='border-b border-main-800 py-1' name='pinCode' placeholder='Enter Pincode' type="number" id='pinCode' value={newAddress.pinCode} onChange={(e) => { handleNewAddress(e) }} />
              <label className='text-lg' htmlFor="city">City</label>
              <input className='border-b border-main-800 py-1' name='city' placeholder='Enter City' type="text" id='city' value={newAddress.city} onChange={(e) => { handleNewAddress(e) }} />
              <label className='text-lg' htmlFor="state">State</label>
              <input className='border-b border-main-800 py-1' name='state' placeholder='Enter State' type="text" id='state' value={newAddress.state} onChange={(e) => { handleNewAddress(e) }} />
              <label className='text-lg' htmlFor="phoneNo">Phone No</label>
              <input className='border-b border-main-800 py-1' name='phoneNo' placeholder='Enter Phone No' type="number" id='phoneNo' value={newAddress.phoneNo} onChange={(e) => { handleNewAddress(e) }} />
              <button className=' bg-main-800 text-white text-xl font-semibold py-2 mt-4' type='submit'>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default Profile
