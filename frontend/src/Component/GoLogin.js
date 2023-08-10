import React from 'react'
import { Link } from 'react-router-dom'

const GoLogin = () => {
  return (
    <div className='w-full flex items-center justify-center' style={{height:"49vh"}}>
      <Link to="/login"><h1 className=" bg-fuchsia-800 text-white px-4 py-2 rounded-full cursor-pointer my-5 mx-3">Go to Login Page</h1></Link>
    </div>
  )
}

export default GoLogin
