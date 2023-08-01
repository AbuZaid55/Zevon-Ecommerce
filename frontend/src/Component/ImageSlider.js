import React, { useEffect, useState } from 'react'
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";
import BACKEND_URL from '../baseUrl';

const ImageSlider = (props) => {
    const imgUrl = (props.imgUrl)?props.imgUrl:[]
    const time = (props.time)?props.time:3000
    const [slideIndex,setSlideIndex]=useState(0)

    const rightSlide = ()=>{
      if(-(imgUrl.length-1)<slideIndex){
        setSlideIndex(slideIndex-1)
      }else{
        setSlideIndex(0)
      }
    }
  
    const leftSlide = (e)=>{
      if(slideIndex<0){
        setSlideIndex(slideIndex+1)
      }else{
        setSlideIndex(-(imgUrl.length-1))
      }
    }
  
    useEffect(() => {
      const interval = setInterval(() => {
          rightSlide()
      }, time);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex]);

  useEffect(()=>{
    setSlideIndex(-props.index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.index])

  return (
    <div className='relative h-full w-full overflow-hidden'>
      <span className='absolute text-fuchsia-900 left-0 top-1/2 text-2xl -translate-y-2/4 z-10 sm:px-3 py-3 sm:py-7 rounded-r cursor-pointer bg-white hover:bg-fuchsia-50' onClick={(e)=>{leftSlide(e)}}><FaAngleLeft/></span>
        <div className='flex  relative  h-full transition-all' style={{left:slideIndex*100+'%' }}>
          {imgUrl.map((image,i)=>{
            return <img key={i} className='min-w-full h-full' src={`${BACKEND_URL}/Images/${image}`} alt="" />
          })}
        </div>
        <span className='absolute text-fuchsia-900 right-0 top-1/2 text-2xl -translate-y-2/4 z-10 sm:px-3 py-3 sm:py-7 rounded-l cursor-pointer bg-white hover:bg-fuchsia-50' onClick={(e)=>{rightSlide()}}><FaAngleRight/></span>
        <div className='absolute left-0 bottom-3 flex item-center justify-center w-full'>
          {
            imgUrl.map((item,i)=>{
              return <div key={i} className={`border-2 mx-1 border-fuchsia-700 w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer ${(slideIndex===-i)?' bg-fuchsia-700':''} `} onClick={()=>{setSlideIndex(-i)}}></div>
            })
          }
        </div>
    </div>
  )
}

export default ImageSlider
