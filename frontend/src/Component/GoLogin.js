import React from 'react'
import { Link ,Location,useLocation,useNavigate} from 'react-router-dom'

const GoLogin = () => {
  const location = useLocation().pathname
  const navigate = useNavigate()
  const goLogin = (e)=>{
    e.preventDefault()
    navigate('/login',{state:{path:location}})
  }
  return (
    <div className='w-full flex items-center justify-center' style={{height:"49vh"}}>
      <h1 className=" bg-main-800 text-white px-4 py-2 rounded-full cursor-pointer my-5 mx-3" onClick={(e)=>{goLogin(e)}}>Go to Login Page</h1>
    </div>
  )
}

export default GoLogin
