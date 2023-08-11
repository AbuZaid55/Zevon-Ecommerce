import React ,{useEffect,useState} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { FaTrash,FaEdit,FaPlusSquare,FaStar,FaArrowRight,FaArrowLeft } from "react-icons/fa";
import BACKEND_URL from '../../baseUrl';
import Aside from './Aside'
import {toast} from 'react-toastify'
import axios from 'axios'

const Products = (props) => {
  const navigate = useNavigate()
  const [userOnPerPage,setUserOnPerPage]=useState(20)
  const [allUsers,setAllUsers]=useState([])
  const [searchUser,setSearchUser]=useState([])
  const [paginationUser,setPaginationUser]=useState([])
  const [onlyAdmin,setOnlyAdmin]=useState(false)
  const [showConfirm,setShowConfirm]=useState(false)
  const [showMakeAdminPopup,setShowMakeAdminPopup]=useState(false)
  const [showRemoveAdminPopup,setShowRemoveAdminPopup]=useState(false)
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
      const res = await axios.delete(`${BACKEND_URL}/auth/delete?userId=${userId}`)
      getAllUsers()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const makeAdmin = async (userId)=>{
    setShowMakeAdminPopup(false)
    props.setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/makeadmin`,{userId:userId})
      getAllUsers()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
  }

  const removeAdmin = async(userId)=>{
    setShowRemoveAdminPopup(false)
    props.setLoader2(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/removeadmin`,{userId:userId})
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

  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.admin===true){
      }else{
        navigate('/page404')
      }
    }
  },[props.user])
  useEffect(()=>{
    getAllUsers()
  },[])
  useEffect(()=>{
    const user = searchUser.slice((currentPage-1)*userOnPerPage,currentPage*userOnPerPage)
    setPaginationUser(user)
  },[currentPage,searchUser])
  useEffect(()=>{
    const user = allUsers.filter(((user)=>{
      if(onlyAdmin){
        if((user.email.includes(search)|| user._id.includes(search) ) && user.admin){
          return user
        }
      }else{
        if(user.email.includes(search)|| user._id.includes(search)){
          return user
        }
      }
    }))
    setSearchUser(user)
    setTotalPage(Math.ceil(user.length/userOnPerPage))
    setCurrentPage(1)
  },[allUsers,search,onlyAdmin,userOnPerPage])
  return (
    <div className='flex'>
      <Aside/>
      <div className='user' id='main'>
        <h1>Users</h1>
        <div>
         <div className='flex items-center justify-between'>
         <div className='search relative'>
         <input  type="search" className='w-full' value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search Users by id or email' />
         </div>
          <label  className='noPageLabel'><input className='noPage' value={userOnPerPage} onChange={((e)=>{handleItemPerPage(e)})} type="number" max={100} />Per Page</label>
          <span className='totalusers'>Total User: {searchUser.length}</span>
         </div>
         <label className='onlyadmin' htmlFor="onlyadmin"><input type="checkbox" id='onlyadmin' checked={onlyAdmin} onChange={(e)=>{(e.target.checked)?setOnlyAdmin(true):setOnlyAdmin(false)}} />Show Only Admin</label>
          <table>

            <thead>
              <tr>
                <th>Profile</th>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
                {paginationUser.map((item,i)=>{
                  return <tr key={i}>
                  <td><img style={{height:"60px",width:"60px",margin:" 8px auto",borderRadius:'10px'}} src={`${BACKEND_URL}/Images/${item.profile}`} alt="Pic" /></td>
                  <td >{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td><button className={`makeadminbtn ${(item.admin)?'hidden':''}`} onClick={()=>{setShowMakeAdminPopup(true);setUserId(item._id)}}>Make Admin</button><button className={`removeadminbtn ${(item.admin)?'':'hidden'}`} onClick={()=>{setShowRemoveAdminPopup(true);setUserId(item._id)}}>Remove Admin</button></td>
                  <td><FaTrash className='icon delete' onClick={()=>{setUserId(item._id);setShowConfirm(true)}}/></td>
                </tr>
                })}
            </tbody>

          </table>
        </div>

        {/* pagination  */}
        <div className='flex items-center justify-between w-full relative bottom-0'>
            <button className=' bg-fuchsia-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Desc")}}><FaArrowLeft/></button>
            <div className='flex'>
            <p className='border p-2 w-10 h-10 text-center '>{currentPage}</p>
            <span className='text-3xl'>/</span>
            <p className='border p-2 w-10 h-10 text-center '>{totalPage}</p>
            </div>
            <button className=' bg-fuchsia-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Inc")}}><FaArrowRight/></button>
        </div>
      </div>

        {/* delete popup  */}
        <div className={`${(showConfirm)?'flex':'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center `} style={{backgroundColor:"rgba(128, 128, 128, 0.653)",zIndex:'200'}}>
        <div className=' w-56 h-56 border p-4  bg-white rounded  flex items-stretch justify-between flex-col'>
          <h1 className=' text-fuchsia-700 text-center text-2xl'>Are your sure you want to delete?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={()=>{deleteUser(userId)}} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(()=>{setShowConfirm(false)})} className=' bg-fuchsia-700 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
        </div>


        {/* make admin popup  */}
        <div className={`${(showMakeAdminPopup)?'flex':'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center`} style={{backgroundColor:"rgba(128, 128, 128, 0.653)",zIndex:'200'}}>
        <div className=' w-56 h-56 border p-4 fixed top-1/2 left-1/2 bg-white rounded -translate-x-2/4 -translate-y-2/4 flex items-stretch justify-between flex-col text-xl'>
          <h1 className=' text-fuchsia-700 text-center'>Are your sure you want to make admin?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={()=>{makeAdmin(userId)}} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(()=>{setShowMakeAdminPopup(false)})} className=' bg-fuchsia-700 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
        </div>

        {/* Remove admin popup  */}
        <div className={`${(showRemoveAdminPopup)?'flex':'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center`} style={{backgroundColor:"rgba(128, 128, 128, 0.653)",zIndex:'200'}}>
        <div className=' w-56 h-56 border p-4 fixed top-1/2 left-1/2 bg-white rounded -translate-x-2/4 -translate-y-2/4 flex items-stretch justify-between flex-col text-xl'>
          <h1 className=' text-fuchsia-700 text-center'>Are your sure you want to remove admin?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={()=>{removeAdmin(userId)}} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(()=>{setShowRemoveAdminPopup(false)})} className=' bg-fuchsia-700 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
        </div>
    </div>
  )
}

export default Products
