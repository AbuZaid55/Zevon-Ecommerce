import React, { useEffect } from 'react'
import ImageSlider from '../Component/ImageSlider';
import ItemSlider from '../Component/ItemSlider';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { context } from '../Context/context';
import { useSelector } from 'react-redux';

const Home = () => {
  const { getUser } = useContext(context)
  const path = useLocation().search.includes(`?googleLogin=true`)
  const banner = useSelector((state) => (state.setting.banner))
  const category = useSelector((state) => (state.product.category))
  const allProduct = useSelector((state) => (state.product.allProduct))

  useEffect(() => {
    if (path) {
      getUser()
    }
  }, [path])
  return (
    <div className='mt-9 sm:mt-0'>
      <div className=" h-40 sm:h-64 md:h-80 w-full sm:mt-0 mt-9 border-2 border-main-800 p-2">
        <ImageSlider imgUrl={banner.secure_url} />
      </div>

      <div>
        <ItemSlider category={category} products={allProduct} />
      </div>
    </div>
  )
}

export default Home
