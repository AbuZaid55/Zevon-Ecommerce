import React ,{useEffect,useState} from 'react'
import { useNavigate ,useLocation } from 'react-router-dom';
import { FaTrash,FaArrowRight,FaArrowLeft } from "react-icons/fa";
import Aside from './Aside'
import {toast} from 'react-toastify'
import axios from 'axios'

const Users = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation().search
  const [userOnPerPage,setUserOnPerPage]=useState(20)
  const [allUsers,setAllUsers]=useState([])
  const [searchUser,setSearchUser]=useState([])
  const [paginationUser,setPaginationUser]=useState([])
  const [userType,setUserType]=useState('All')
  const [showConfirm,setShowConfirm]=useState(false)
  const [userId,setUserId]=useState('')
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPage,setTotalPage]=useState(1)
  const [search,setSearch]=useState('')

  const handleItemPerPage = (e)=>{
    if(e.target.value>100){
      setUserOnPerPage(100)
    }else{
      setUserOnPerPage(e.target.value)
    }
    setCurrentPage(1)
  }

  const deleteUser = async(userId)=>{
    setShowConfirm(false)
    props.setLoader2(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/auth/delete?userId=${userId}`,{withCredentials:true})
      getAllUsers()
      toast.success(res.data.massage)
    } catch (error) {
      if(error.response.data.massage==="Please make admin to another"){
        toast.warning(error.response.data.massage)
      }else{
        toast.error(error.response.data.massage)
      }
    }
    props.setLoader2(false)
  }

  const handlePagination = (action)=>{
    if(action==="Inc"){
        if(totalPage>currentPage){
            setCurrentPage(currentPage+1)
        }else{
            setCurrentPage(totalPage)
        }
    }
    if(action==='Desc'){
        if(currentPage>1){
            setCurrentPage(currentPage-1)
        }else{
            setCurrentPage(1)
        }
    }
  }

  const getAllUsers = async()=>{
    props.setLoader2(true)
    try {
      const allUser = await axios.get(`${BACKEND_URL}/auth/allUser`,{withCredentials:true})
      setAllUsers(allUser.data.data)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const changeType = async(type,userId)=>{
    props.setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/changeType`,{userId:userId,type:type},{withCredentials:true})
      getAllUsers()
      toast.success(res.data.massage)
    } catch (error) {
      if(error.response.data.massage==="Please make admin to another"){
        toast.warning(error.response.data.massage)
      }else{
        toast.error(error.response.data.massage)
      }
    }
    props.setLoader2(false)
  }
  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.type==='Admin'){
      }else{
        navigate('*')
      }
    }
  },[props.user])
  useEffect(()=>{
    if(props.setting && props.setting.noOfRow){
      setUserOnPerPage(props.setting.noOfRow)
    }
  },[props.setting])
  useEffect(()=>{
    getAllUsers()
    if(location!==''){
      setUserType(location.slice(5))
    }
  },[])
  useEffect(()=>{
    const user = searchUser.slice((currentPage-1)*userOnPerPage,currentPage*userOnPerPage)
    setPaginationUser(user)
  },[currentPage,searchUser])
  useEffect(()=>{
    const user = allUsers.filter(((user)=>{
      if(userType!=='All'){
        if(user.type===userType){
          if((user.email.includes(search)|| user._id.includes(search) ) || user.name.includes(search)){
            return user
          }
        }
      }else{
        if(user.email.includes(search)|| user._id.includes(search) || user.name.includes(search)){
          return user
        }
      }
    }))
    setSearchUser(user)
    setTotalPage(Math.ceil(user.length/userOnPerPage))
    setCurrentPage(1)
  },[allUsers,search,userType,userOnPerPage])
  return (
    <div className='flex'>
      <Aside/>
      <div className='user' id='main'>
        <h1>Users</h1>
        <div style={{minHeight:'70vh'}}>
         <div className='top flex items-center justify-between'>
         <div className='search relative'>
         <input  type="search" className='w-full' value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search Users by id or email' />
         </div>
          <div className='top2'>
          <label  className='noPageLabel'><input className='noPage' value={userOnPerPage} onChange={((e)=>{handleItemPerPage(e)})} type="number" max={100} />Per Page</label>
          <span className='totalusers'>Total Result: {searchUser.length}</span>
          </div>
         </div>
         <label className='select1'>User Type:-
         <select value={userType} onChange={(e)=>{setUserType(e.target.value)}}>
          <option value="All">All</option>
          <option value="User">User</option>
          <option value="Worker">Worker</option>
          <option value="Admin">Admin</option>
         </select>
         </label>
          <table>

            <thead>
              <tr>
                <th>Profile</th>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
                {paginationUser.map((item,i)=>{
                  let profile = '/Images/profile.jpg'
                  if(item.profile!==''){
                    if(item.profile.includes('https://')){
                      profile=item.profile
                    }else{
                      profile = `${BACKEND_URL}/Images/${item.profile}`
                    }
                  }
                  return <tr key={i}>
                  <td datalabel={"Profile"}><img style={{height:"60px",width:"60px",margin:" 8px auto",borderRadius:'10px'}} src={profile} alt="Pic" /></td>
                  <td datalabel={"Id"} >{item._id}</td>
                  <td datalabel={"Name"}>{item.name}</td>
                  <td datalabel={"Email"}>{item.email}</td>
                  <td datalabel={"Admin"}>
                    <select className={`select border-2  ${(item.type==='Worker')?'text-blue-800 border-blue-700':''} ${(item.type==='Admin')?'text-green-700 border-green-700':''} ${(item.type==='User')?'text-main-800 border-main-800':''}`} value={item.type} onChange={(e)=>{changeType(e.target.value,item._id)}}>
                      <option className=' text-main-800' value="User">User</option>
                      <option className=' text-blue-700' value="Worker">Worker</option>
                      <option className=' text-green-700' value="Admin">Admin</option>
                    </select>
                  </td>
                  <td datalabel={"Delete"}><FaTrash className='icon delete' onClick={()=>{setUserId(item._id);setShowConfirm(true)}}/></td>
                </tr>
                })}
            </tbody>

          </table>
        </div>

        {/* pagination  */}
        <div className='flex items-center justify-between w-full relative bottom-0'>
            <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Desc")}}><FaArrowLeft/></button>
            <div className='flex'>
            <p className='border p-2 w-10 h-10 text-center '>{currentPage}</p>
            <span className='text-3xl'>/</span>
            <p className='border p-2 w-10 h-10 text-center '>{totalPage}</p>
            </div>
            <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Inc")}}><FaArrowRight/></button>
        </div>
      </div>

        {/* delete popup  */}
        <div className={`${(showConfirm)?'flex':'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center `} style={{backgroundColor:"rgba(128, 128, 128, 0.653)",zIndex:'200'}}>
        <div className=' w-56 h-56 border p-4  bg-white rounded  flex items-stretch justify-between flex-col'>
          <h1 className=' text-main-800 text-center text-2xl'>Are your sure you want to delete?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={()=>{deleteUser(userId)}} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(()=>{setShowConfirm(false)})} className=' bg-main-800 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
        </div>
    </div>
  )
}

export default Users
