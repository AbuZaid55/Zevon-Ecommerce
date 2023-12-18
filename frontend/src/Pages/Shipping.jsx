import React, { useState, useEffect } from 'react'
import GoLogin from '../Component/GoLogin';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { context } from '../Context/context';

const Shipping = () => {
  const navigate = useNavigate()
  const [login, setLogin] = useState(false)
  const [address, setAddress] = useState({})
  const { setLoader2, getUser } = useContext(context)
  const user = useSelector((state) => (state.user))
  const [checkboxIndex, setCheckboxIndex] = useState(-1)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [showAddressForm, setshowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ name: "", houseNo: "", address: "", pinCode: "", city: "", state: "", phoneNo: "" })

  const handleAddress = (e, index) => {
    setCheckboxIndex(index)
    const value = JSON.parse(e.target.value)
    setAddress(value)
  }

  const handleNewAddress = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value })
  }

  const addShippingDetails = async (e) => {
    setLoader2(true)
    e.preventDefault()
    try {
      newAddress["_id"] = user._id
      const res = await axios.post(`${BACKEND_URL}/auth/addShippingDetails`, newAddress)
      setNewAddress({ name: "", houseNo: "", address: "", pinCode: "", city: "", state: "", phoneNo: "" })
      setshowAddressForm(false)
      getUser()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }

  const goConfirm = (e) => {
    e.preventDefault()
    if (address && address.name && address.address && address.phoneNo) {
      navigate('/cart/confirm', { state: { address: address } })
    } else {
      toast.error("Please Select Shipping Details")
    }
  }
  useEffect(() => {
    if (user._id) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [user])
  return (
    <>
      <div className={`${(login) ? "hidden" : ""}`}><GoLogin /></div>
      <div className={`${(login) ? "" : "hidden"}`}>
        <div className='my-9 sm:mt-0'>
          <h1 className='w-full bg-main-800 text-white px-4 text-xl py-2'>Select Address</h1>

          <div className='flex flex-wrap items-center justify-evenly'>
            {
              login && user.shippingDetails.map((data, i) => {
                return <label key={i} className={`flex items-center w-80 p-1 sm:p-4 m-1 sm:m-4 cursor-pointer ${(checkboxIndex === i) ? 'border-green-700 border-4' : ' border-main-800 border'}`} ><input className='hidden' type="checkbox" value={JSON.stringify(data)} checked={checkboxIndex === i} onChange={(e) => { handleAddress(e, i) }} />
                  <div className=' pointer-events-none'>
                    <h1>{data.name}</h1>
                    <p>{data.houseNo} {data.address} {data.city} {data.state}</p>
                    <p>{data.pinCode}</p>
                    <p>Phone No : <span>{data.phoneNo}</span></p>
                    <p>Email : <span>{user.email}</span></p>
                  </div>
                </label>
              })
            }
          </div>

          <button className={`${(login && user.shippingDetails.length === 0) ? 'hidden' : 'flex'} items-center justify-center py-2 px-4 bg-main-800 text-white font-bold m-5 rounded-full mx-auto my-10`} onClick={(e) => { goConfirm(e) }} > Continue</button>

          <button className='flex items-center justify-center py-2 px-4 bg-main-800 text-white font-bold m-5 rounded-full ml-auto' onClick={() => { setshowAddressForm(!showAddressForm) }}><FaPlus className='mr-2' /> Add Address</button>

          <div className={`${(showAddressForm) ? 'flex' : 'hidden'} items-center justify-center`}>
            <form className='flex justify-center flex-col w-3/6' onSubmit={(e) => { addShippingDetails(e) }}>
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
    </>
  )
}

export default Shipping
