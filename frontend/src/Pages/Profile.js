import React ,{useState,useEffect} from 'react'
import GoLogin from '../Component/GoLogin';
import { FaCamera,FaPlus, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import BACKEND_URL from '../baseUrl';
import axios from 'axios';

const Profile = (props) => {
  const [login,setLogin]=useState(false)
  const [showAddressForm,setshowAddressForm]=useState(false)
  const [user,setUser]=useState({_id:"",email:"",name:"",cart:[],shippingDetails:[],profile:""})
  const [newAddress,setNewAddress]=useState({name:"",houseNo:"",address:"",pinCode:"",city:"",state:"",phoneNo:""})
  
  const handleNewAddress=(e)=>{
    setNewAddress({...newAddress,[e.target.name]:e.target.value})
  }

  const addShippingDetails=async(e)=>{
    e.preventDefault()
    try {
      newAddress["_id"]=user._id
      const res = await axios.post(`${BACKEND_URL}/auth/addShippingDetails`,newAddress)
      setNewAddress({name:"",houseNo:"",address:"",pinCode:"",city:"",state:"",phoneNo:""})
      setshowAddressForm(false)
      props.getUser()
      alert(res.data.massage)
    } catch (error) {
      alert(error.response.data.massage)
    }
  }

  const deleteShippingDetails=async(i)=>{
    console.log(i)
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/deleteShippingDetails`,{_id:user._id,index:i})
      props.getUser()
      alert(res.data.massage)
    } catch (error) {
      alert(error.response.data.massage)
    }
  }

  const uploadProfile=async(e)=>{
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("_id",user._id)
    formdata.append("profile",e.target.files[0])
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/uploadProfile`,formdata)
      alert(res.data.massage)
      props.getUser()
    } catch (error) {
      alert(error.response.data.massage)
    }
  }

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
    <div className={`${(login)?"":"hidden"}`}>
      <div className='w-full flex flex-col sm:flex-row my-10'>
        <div className='w-full sm:w-1/2 flex items-center justify-center'>
          <div className='w-64 h-64 sm:w-72 sm:h-72 border-2 rounded-full relative mt-3'><img className='w-full h-full rounded-full border-4 border-fuchsia-800' src={(user.profile!=='')?`${BACKEND_URL}/Images/${user.profile}`:"/Images/profile.jpg"} alt="Pic" />
          <label htmlFor="upload" className=' cursor-pointer absolute top-3/4 right-4 border shadow-md bg-white p-2 text-xl text-fuchsia-800 rounded-full'><FaCamera/></label>
          <input type="file" className='hidden' id='upload' onChange={(e)=>{uploadProfile(e)}}/>
          </div>
        </div>
        <div className='w-full sm:w-1/2 flex items-center sm:items-start justify-center flex-col mt-10'>
          <h1 className='text-3xl px-3'>Hello</h1>
          <h1 className='text-5xl sm:text-7xl font-semibold'>{user.name}</h1>
          <div className='flex flex-col w-60'>
          <Link to="/orders"><button className=' bg-fuchsia-800 text-white w-full mt-5 py-2 rounded'>My Orders</button></Link>
          <Link to="/sendresetlink"><button className=' bg-fuchsia-800 text-white w-full mt-3 py-2 rounded'>Change Password</button></Link>
          </div>
        </div>
      </div>
      <div>
        <h1 className='text-center text-3xl sm:text-4xl font-semibold my-10'>Prosonal Information</h1>
        <div className='w-full lg:w-5/6 mx-auto my-10 flex items-center sm:items-start flex-col '>
          <div className='pl-3'>
          <h1 className='text-xl sm:text-3xl my-5 px-5'>Name: {user.name}</h1>
          <h1 className='text-xl sm:text-3xl my-5 px-5'>Email:{user.email}</h1>
          <h1 className='text-xl sm:text-3xl my-5 px-5'>Shipping Address:-</h1>
          </div>
          <div className='flex flex-wrap items-center justify-evenly'>
          {user.shippingDetails.map((data,i)=>{
            return <div key={i} className='border w-72 sm:w-80 m-5 p-4 relative'>
              <button className='absolute top-0 right-0 p-2 text-fuchsia-700' onClick={()=>{deleteShippingDetails(i)}}><FaTrash/></button>
              <h1>{data.name}</h1>
              <p>{data.houseNo} {data.address} {data.city} {data.state}</p>
              <p>{data.pinCode}</p>
              <p>Phone No : <span>{data.phoneNo}</span></p>
              <p>Email : <span>{user.email}</span></p>
            </div>
          })}
          </div>
          <button className='flex items-center justify-center py-2 px-4 bg-fuchsia-800 text-white font-bold m-5 rounded-full ml-auto' onClick={()=>{setshowAddressForm(!showAddressForm)}}><FaPlus className='mr-2'/> Add New Address</button>

          <div className={`${(showAddressForm)?'flex':'hidden'} items-center justify-center w-full`}>
        <form className='flex justify-center flex-col w-full mx-3 sm:w-4/5' onSubmit={(e)=>{addShippingDetails(e)}}>
          <h1 className=' bg-fuchsia-800 text-white font-semibold text-xl py-2 px-4 my-5'>Add Shipping Address</h1>
          <label className='text-lg' htmlFor="name">Name</label>
          <input className='border-b border-fuchsia-950 py-1' name='name' placeholder='Enter your name' type="text" id='name' value={newAddress.name} onChange={(e)=>{handleNewAddress(e)}}/>
          <label className='text-lg' htmlFor="houseNo">House No</label>
          <input className='border-b border-fuchsia-950 py-1' name='houseNo' placeholder='Enter House No' type="text" id='houseNo' value={newAddress.houseNo} onChange={(e)=>{handleNewAddress(e)}}/>
          <label className='text-lg' htmlFor="address">Address</label>
          <input className='border-b border-fuchsia-950 py-1' name='address' placeholder='Enter Address' type="text" id='address' value={newAddress.address} onChange={(e)=>{handleNewAddress(e)}}/>
          <label className='text-lg' htmlFor="pinCode">Pin Code</label>
          <input className='border-b border-fuchsia-950 py-1' name='pinCode' placeholder='Enter Pincode' type="number" id='pinCode' value={newAddress.pinCode} onChange={(e)=>{handleNewAddress(e)}}/>
          <label className='text-lg' htmlFor="city">City</label>
          <input className='border-b border-fuchsia-950 py-1' name='city' placeholder='Enter City' type="text" id='city' value={newAddress.city} onChange={(e)=>{handleNewAddress(e)}}/>
          <label className='text-lg' htmlFor="state">State</label>
          <input className='border-b border-fuchsia-950 py-1' name='state' placeholder='Enter State' type="text" id='state' value={newAddress.state} onChange={(e)=>{handleNewAddress(e)}}/>
          <label className='text-lg' htmlFor="phoneNo">Phone No</label>
          <input className='border-b border-fuchsia-950 py-1' name='phoneNo' placeholder='Enter Phone No' type="number" id='phoneNo' value={newAddress.phoneNo} onChange={(e)=>{handleNewAddress(e)}}/>
          <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 mt-4' type='submit'>Submit</button>
        </form>
        </div>
        </div>
      </div>
    </div>
  </>)
}

export default Profile
