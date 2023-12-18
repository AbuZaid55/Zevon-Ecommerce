import React from 'react'
import { useSelector } from 'react-redux'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Card from '../Component/Card';
import { Link } from 'react-router-dom';

const ItemSlider = (props) => {
  const setting = useSelector((state) => (state.setting))
  const userId = useSelector((state) => (state.user))._id
  const sliderItemNo = setting.sliderItemNo

  const leftSlider = (id) => {
    const slider = document.getElementById(id)
    slider.scrollLeft = slider.scrollLeft - 400
  }
  const rightSlider = (id) => {
    const slider = document.getElementById(id)
    slider.scrollLeft = slider.scrollLeft + 400
  }
  return (
    <div>
      {props.category && props.category.map((category, I) => {
        let iteminSlider = 0
        return <div key={(I)} className='sm:my-4 relative'>
          <div className='flex items-center justify-between'><h1 className='text-2xl sm:text-3xl ml-1 sm:ml-5 mt-3 font-bold text-main-800'>{category}</h1><span className='sm:text-xl p-2 bg-main-800 text-white rounded-full m-2 cursor-pointer'><Link to={`/products?category=${category}`}><FaAngleRight /></Link></span></div>
          <div className='flex overflow-x-scroll w-full relative scroll scrollbar-hide scroll-smooth' id={`slider${I}`}>
            {props.products && props.products.map((item, i) => {
              if (category==="Similar Products" || item.category === category) {
                iteminSlider = iteminSlider + 1
                if (iteminSlider <= sliderItemNo) {
                  return <Card key={i} product={item} userId={userId} />
                }
              }
            })}
          </div>
          <button className='absolute text-white left-0 top-1/2 sm:text-2xl -translate-y-2/4 z-10 px-2 sm:px-3 py-4 sm:py-7 rounded-r cursor-pointer bg-main-800' onClick={(e) => { leftSlider(`slider${I}`) }}><FaAngleLeft /></button>
          <button className='absolute text-white right-0 top-1/2 sm:text-2xl -translate-y-2/4 z-10 px-2 sm:px-3 py-4 sm:py-7 rounded-l cursor-pointer bg-main-800' onClick={(e) => { rightSlider(`slider${I}`) }} ><FaAngleRight /></button>
          <span className='hidden'>{iteminSlider = 0}</span>
        </div>
      })}
    </div>
  )
}

export default ItemSlider
