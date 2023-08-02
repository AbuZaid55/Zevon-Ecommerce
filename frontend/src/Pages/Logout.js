import React, { useEffect } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import BACKEND_URL  from '../baseUrl'

const Logout = (props) => {
    const navigate = useNavigate()
    const checkLogin = ()=>{
        if(props.user===''){
            navigate('/page404')
        }
    }
    const Logout = async()=>{
        try {
            const res = await axios.get(`${BACKEND_URL}/auth/logout`,{withCredentials:true})
            if(res.status===202){
                props.getUser()
                navigate('/login')
            }
        } catch (error) {
            alert(error.response.data.massage)
        }
    }
    useEffect(()=>{
        checkLogin()
    },[props.user])
  return (
    <div className='flex items-center justify-center flex-col' style={{minHeight:'70vh'}}>
      <h1 className="text-5xl font-bold text-fuchsia-700">Do you want to Log Out?</h1>
      <div className='mt-10 z'>
        <button onClick={()=>{Logout()}} className=' bg-fuchsia-700 text-white  px-5 py-2 mt-4 mx-10 text-xl font-semibold rounded'>YES</button>
        <Link to="/" className=' bg-fuchsia-700 text-white  px-5 py-2 mt-4 mx-10 text-xl font-semibold rounded'>No</Link>
      </div>
    </div>
  )
}

export default Logout
