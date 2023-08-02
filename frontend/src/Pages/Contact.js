import React, { useState } from 'react'
import axios from 'axios'
import BACKEND_URL from '../baseUrl'

const Contact = () => {
  const [details,setDetails]=useState({name:"",email:'',phone:"",subject:"",massage:""})
  const handleInput = (e)=>{
    setDetails({...details,[e.target.name]:e.target.value})
  }
  const submitForm = async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/contact`,details)
      setDetails({name:"",email:'',phone:"",subject:"",massage:""})
      alert(res.data.massage)
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  return (
    <div>
      <div className='flex w-full m-auto border sm:mt-0 mt-5 '>
        <img className='hidden md:block w-1/2 p-4' src="/Images/contact2.jpg" alt="Pic" />
        <form className='w-full md:w-1/2 p-4 flex flex-col' onSubmit={(e)=>{submitForm(e)}}>
            <h1 className='text-3xl text-center font-bold text-fuchsia-950 mb-3 mt-2'>Contact Us</h1>
            <label className='mt-3 text-fuchsia-950' htmlFor="name">Name</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='name' type="text" placeholder='Enter your Name' id='name' value={details.name} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="phone">Phone</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='phone' type="text" placeholder='Enter phone no' id='phone' value={details.phone} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="email">Email</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='email' type="text" placeholder='Enter your email'id='email' value={details.email} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="subject">Subject</label>
            <input className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950' name='subject' type="text" placeholder='Enter subject' id='subject' value={details.subject} onChange={(e)=>{handleInput(e)}}/>
            <label className='mt-3 text-fuchsia-950' htmlFor="massage">Massage</label>
            <textarea className='w-full border-b border-fuchsia-950 mb-3 text-fuchsia-950 resize-none' name='massage' type="textarea" placeholder='Massage' id='massage' value={details.massage} onChange={(e)=>{handleInput(e)}}/>
            <button className=' bg-fuchsia-800 text-white text-xl font-semibold py-2 mt-4' type='submit'>Submit</button>
        </form>
      </div>
      <div className='w-full p-5'>
      <iframe title='Office' className='w-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.692417905629!2d83.5560296761307!3d25.945322377236902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39918b5bb24c8d6f%3A0x6ce31a93bfba2299!2sChittan%20pura!5e0!3m2!1sen!2sin!4v1690383323020!5m2!1sen!2sin" width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  )
}

export default Contact
