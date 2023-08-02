import React, {useEffect, useState } from 'react'
import ImageSlider from '../Component/ImageSlider';
import Card from '../Component/Card';
import { FaAngleLeft ,FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios'
import BACKEND_URL from '../baseUrl'
import { no_of_item_silder } from '../baseUrl';

const Home = (props) => {
  const userId = props.user._id
  const [allProduct,setAllProduct]=useState([])
  const [category,setCategory]=useState([])
  let iteminSlider = 0
  const [imgUrl,]=useState([
    "banner1.webp",
    "banner2.webp",
    "banner3.webp",
    "banner4.webp",
    "banner5.webp",
  ])

  const leftSlider = (id)=>{
    const slider = document.getElementById(id)
    slider.scrollLeft = slider.scrollLeft - 400
  }
  const rightSlider = (id)=>{
    const slider = document.getElementById(id)
    slider.scrollLeft = slider.scrollLeft + 400
  }

  const fetchProduct = async()=>{
    try {
      const res = await axios.get(`${BACKEND_URL}/products`)
      setAllProduct(res.data)
      res.data.map((item)=>{
        const isExist = category.includes(item.category)
        if(!isExist){
          category.push(item.category)
          setCategory(category)
        }
      })
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  
useEffect(()=>{
  fetchProduct()
  //  eslint-disable-next-line react-hooks/exhaustive-deps
},[])
  return (
    <div className='mt-9 sm:mt-0'>
      {/* section1 */}
      <div className=" h-40 sm:h-64 w-full sm:mt-0 mt-9">
        <ImageSlider imgUrl={imgUrl}/>
      </div>
      {/* section2 */}
    {category.map((category,I)=>{
      return <div key={(I)} className='sm:my-4 relative'>
      <div className='flex items-center justify-between'><h1 className='text-2xl sm:text-3xl ml-1 sm:ml-5 mt-3 font-bold text-fuchsia-950'>{category}</h1><span className='sm:text-xl p-2 bg-fuchsia-800 text-white rounded-full m-2 cursor-pointer'><Link to={`/products?category=${category}`}><FaAngleRight/></Link></span></div>
      <div className='flex overflow-x-scroll w-full relative scroll scrollbar-hide scroll-smooth' id={`slider${I}`}>
        {allProduct.map((item,i)=>{
          if(item.category===category){
              iteminSlider = iteminSlider+1
              if(iteminSlider<=no_of_item_silder){
                return <Card key={i} product={item} userId={userId}/>  
              }
          }
        })}
        <span className='hidden'>{iteminSlider=0}</span>
      </div>
      <button className='absolute text-white left-0 top-1/2 sm:text-2xl -translate-y-2/4 z-10 px-2 sm:px-3 py-4 sm:py-7 rounded-r cursor-pointer bg-fuchsia-800' onClick={(e)=>{leftSlider(`slider${I}`)}}><FaAngleLeft/></button>
      <button className='absolute text-white right-0 top-1/2 sm:text-2xl -translate-y-2/4 z-10 px-2 sm:px-3 py-4 sm:py-7 rounded-l cursor-pointer bg-fuchsia-800' onClick={(e)=>{rightSlider(`slider${I}`)}} ><FaAngleRight/></button>
    </div>
    })}
      {/* section2 end  */}
    </div>
    )
}

export default Home
