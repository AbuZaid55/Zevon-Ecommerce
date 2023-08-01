import React,{useEffect, useState} from 'react'
import { FaStar} from 'react-icons/fa';
import BACKEND_URL from '../baseUrl';

const ReviewCard = (props) => {
const proprating = (props.rating)?props.rating:0
const propname = (props.name)?props.name:"Name"
const propcomment = (props.comment)?props.comment:"Wow so good and i like it"
const propimg = (props.profile)?`${BACKEND_URL}/Images/${props.profile}`:"/Images/profile.jpg"
const [rating,setRating]=useState(0)
const [name, setName]=useState('')
const [comment, setComment]=useState('')
const [profile, setProfile]=useState('')
  useEffect(()=>{
    setRating(proprating)
    setName(propname)
    setComment(propcomment)
    setProfile(propimg)
  },[proprating,propname,propcomment,propimg])
  return (
    <div className='flex items-center justify-center flex-col border rounded w-96 p-4 mt-10 '>
        <div style={{width:"80px",height:"80px"}}><img className='w-full h-full rounded-full'  src={profile} alt="User Pic" /></div>
        <h1 className='text-2xl font-semibold mt-2 h-8 w-full text-center overflow-hidden'>{name}</h1>
        <div className='flex my-2'>
          <FaStar className={` text-3xl mx-1 ${(rating>=1)?'text-fuchsia-800':'text-gray-400'}`} />
          <FaStar className={` text-3xl mx-1 ${(rating>=2)?'text-fuchsia-800':'text-gray-400'}`} />
          <FaStar className={` text-3xl mx-1 ${(rating>=3)?'text-fuchsia-800':'text-gray-400'}`} />
          <FaStar className={` text-3xl mx-1 ${(rating>=4)?'text-fuchsia-800':'text-gray-400'}`} />
          <FaStar className={` text-3xl mx-1 ${(rating>=5)?'text-fuchsia-800':'text-gray-400'}`} />
        </div>
        <p className=' h-16 overflow-x-scroll scrollbar-hide text-center'>{comment}</p>
      </div>
  )
}

export default ReviewCard
