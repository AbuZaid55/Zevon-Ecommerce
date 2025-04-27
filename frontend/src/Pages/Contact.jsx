import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { context } from '../Context/context'

const Contact = () => {
  const user = useSelector((state) => (state.user))
  const { setLoader2 } = useContext(context)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [details, setDetails] = useState({ name: user.name, email: user.email, phone: "", subject: "", massage: "" })
  const navigate = useNavigate()

  const handleInput = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }
  const submitForm = async (e) => {
    setLoader2(true)
    e.preventDefault()
    if (user.name) {
      try {
        const res = await axios.post(`${BACKEND_URL}/auth/contact`, details)
        setDetails({ name: "", email: '', phone: "", subject: "", massage: "" })
        toast.success(res.data.massage)
      } catch (error) {
        toast.error(error.response.data.massage)
      }
    } else {
      navigate('/login', { state: { path: '/contact' } })
    }
    setLoader2(false)
  }

  return (
    <div>
      <div className='flex w-full m-auto border sm:mt-0 mt-5 '>
        <img className='hidden md:block w-1/2 p-4' src="/Images/contact.jpg" alt="Pic" />
        <form className='w-full md:w-1/2 p-4 flex flex-col' onSubmit={(e) => { submitForm(e) }}>
          <h1 className='text-3xl text-center font-bold text-main-800 mb-3 mt-2'>Contact Us</h1>
          <label className='mt-3 text-main-800 font-semibold' htmlFor="name">Name</label>
          <input className='w-full border-b border-main-800 mb-3' name='name' type="text" placeholder='Enter your Name' id='name' value={details.name} onChange={(e) => { handleInput(e) }} />
          <label className='mt-3 text-main-800 font-semibold' htmlFor="phone">Phone</label>
          <input className='w-full border-b border-main-800 mb-3' name='phone' type="text" placeholder='Enter phone no' id='phone' value={details.phone} onChange={(e) => { handleInput(e) }} />
          <label className='mt-3 text-main-800 font-semibold' htmlFor="email">Email</label>
          <input className='w-full border-b border-main-800 mb-3' name='email' type="text" placeholder='Enter your email' id='email' value={details.email} onChange={(e) => { handleInput(e) }} />
          <label className='mt-3 text-main-800 font-semibold' htmlFor="subject">Subject</label>
          <input className='w-full border-b border-main-800 mb-3' name='subject' type="text" placeholder='Enter subject' id='subject' value={details.subject} onChange={(e) => { handleInput(e) }} />
          <label className='mt-3 text-main-800 font-semibold' htmlFor="massage">Massage</label>
          <textarea className='w-full border-b border-main-800 mb-3 text-main-800 resize-none' name='massage' type="textarea" placeholder='Massage' id='massage' value={details.massage} onChange={(e) => { handleInput(e) }} />
          <button className=' bg-main-800 text-white text-xl font-semibold py-2 mt-4' type='submit'>Submit</button>
        </form>
      </div>
      <div className='w-full p-5'>
        <iframe title='Office' className={` w-full ${(import.meta.env.VITE_GOOGLE_MAP_SRC) ? '' : 'hidden'}`} src={import.meta.env.VITE_GOOGLE_MAP_SRC} width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  )
}

export default Contact
