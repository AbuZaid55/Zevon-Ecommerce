import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageSlider from '../Component/ImageSlider';
import { FaStar, FaRupeeSign } from 'react-icons/fa';
import ReviewCard from '../Component/ReviewCard';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { context } from '../Context/context';
import ItemSlider from '../Component/ItemSlider';


const Details = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const user = useSelector((state) => (state.user))
  const allProduct = useSelector((state) => (state.product.allProduct))
  const { setLoader2, fetchProduct, getUser } = useContext(context)
  const productId = new URLSearchParams(useLocation().search).get('_id');
  const fullPath = location.pathname + location.search
  const [similarProduct, setSimilarProduct] = useState([])
  const [product, setProduct] = useState({ name: '', description: '', stock: '', maxprice: '', sellprice: '', category: '', subCategory: '', color: [], size: [], highlight: [], thumbnail: '', images: [], GST: '', reviews: [] })
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [slideIndex, setSlideIndex] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [productRating, setProductRating] = useState(0)

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const handleQty = (action) => {
    if (action === "Inc") {
      if (product.stock < 10) {
        setQty((qty < product.stock) ? qty + 1 : product.stock)
      } else {
        setQty((qty < 10) ? qty + 1 : 10)
      }
    }
    if (action === "Desc") {
      setQty((qty > 1) ? qty - 1 : 1)
    }
  }
  const fetchProductDetails = async () => {
    setLoader2(true)
    const product = allProduct.filter((item) => {
      return item._id === productId
    })
    if (product.length === 0) {
      navigate('*')
    } else {
      setProduct(product[0])
      const subCategory = product[0].subCategory
      const similarProduct = allProduct.filter((item) => {
        if (item.subCategory === subCategory) {
          return item._id !== productId
        }
      })
      setSimilarProduct(similarProduct)

      if (product[0].reviews.length === 0) {
        setProductRating(0)
      } else {
        let rat = 0
        product[0].reviews.map((review) => {
          rat = rat + review.rating
        })
        setProductRating((rat / product[0].reviews.length).toFixed(1))
      }
    }
    setLoader2(false)
  }
  const submitReview = async () => {
    setLoader2(true)
    if (user === '' || user === 'Not Found!') {
      navigate('/login', { state: { path: fullPath } })
    } else {
      try {
        const res = await axios.post(`${BACKEND_URL}/review/product`, { userId: user._id, username: user.name, productId: product._id, rating: rating, comment: comment, profile: user.profile })
        setRating(0)
        setComment('')
        fetchProduct()
        setShowReviewForm(false)
        fetchProductDetails()
        toast.success(res.data.massage)
      } catch (error) {
        const massage = error.response.data.massage
        if (massage === "Invalid User") {
          navigate('/login', { state: { path: fullPath } })
        } else {
          toast.error(massage)
        }
      }
    }
    setLoader2(false)
  }
  const deleteReview = async (userId) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/reviewDelete/product`, { productId: product._id, userId: userId }, { withCredentials: true })
      fetchProductDetails()
      fetchProduct()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
  }
  const addToCart = async (e) => {
    setLoader2(true)
    e.preventDefault()
    if (user === '' || user === 'Not Found!') {
      navigate('/login', { state: { path: fullPath } })
    } else {
      try {
        const res = await axios.post(`${BACKEND_URL}/auth/addToCart`, { userId: user._id, productId: productId, name: product.name, price: product.sellprice, thumbnail: product.thumbnail, size: size, qty: qty, color: color, GST: product.GST, deliveryCharge: product.deliveryCharge }, { withCredentials: true })
        setSize('')
        setQty(1)
        setColor('')
        getUser()
        toast.success(res.data.massage)
      } catch (error) {
        const massage = error.response.data.massage
        if (massage === 'Invalid User') {
          navigate('/login', { state: { path: fullPath } })
        } else {
          toast.error(massage)
        }
      }
    }
    setLoader2(false)
  }
  useEffect(()=>{
    scrollTop()
  },[productId])
  useEffect(() => {
    if (allProduct.length !== 0) {
      fetchProductDetails()
    }
  }, [productId, allProduct])


  return (<>
    <div className='flex flex-col md:flex-row'>

      <div className='w-full md:w-1/2 h-80 sm:h-96 flex justify-center mt-8 sm:mt-0 md:mt-8'>
        <div className=' h-full overflow-y-scroll scrollbar-hide w-20'>
          {
            product.images.secure_url && product.images.secure_url.map((url, i) => {
              return <img key={i} className='w-[90%] h-20 my-2 mx-1 sm:mx-2 cursor-pointer p-2 border-2 border-main-800' src={url} onClick={() => { setSlideIndex(i) }} alt="" />
            })
          }
        </div>
        <div className='w-80 sm:w-96 mx-2 sm:mx-5 my-2 border-2 p-4 border-main-800'><ImageSlider imgUrl={product.images.secure_url} index={slideIndex} /></div>
      </div>


      <div className='md:w-1/2 mt-5 px-4 mb-10'>
        <h1 className='text-2xl sm:text-3xl border-b pb-2 mb-2 font-bold text-main-800'>{product.name}</h1>
        <div className='flex items-center border-b pb-2 mb-3'><span className='flex items-center bg-green-600 text-white rounded px-1 my-1 text-lg lg:text-base '>{productRating}<FaStar className='ml-1' /></span><span className='ml-4'>({product.reviews.length})</span></div>
        <div className='flex items-center border-b pb-3 mb-2'>
          <h1 className='flex items-center text-2xl font-bold'><FaRupeeSign />{product.sellprice} </h1>
          <div><span className=' line-through mx-2 lg:text-xl'>{product.maxprice}</span><span className='font-bold text-green-700 lg:text-xl'>off {100-Math.round((product.sellprice / product.maxprice) * 100)}%</span></div>
        </div>
        <div className=' flex text-xl border-b mb-2 pb-2 '><span>Delivery Charge : </span><span className={` ${(product.deliveryCharge === 0) ? '' : "hidden"} text-green-700 ml-1 `}> Free </span><span className={`${(product.deliveryCharge === 0) ? 'hidden' : 'flex'} items-center font-semibold`}><FaRupeeSign /> {product.deliveryCharge}</span></div>
        <div className='text-xl border-b mb-2 pb-2 '><span>Stock : </span><span className={` ${(product.stock === 0) ? 'hidden' : ""} text-green-700 `}>In Stock</span><span className={` ${(product.stock === 0) ? '' : 'hidden'} text-red-700`}>Out of stock</span></div>
        <div className={`${(product.color.length === 0) ? 'hidden' : ''}`}>
          <h1 className='text-xl border-b mb-2 pb-2'>Color</h1>
          {
            product.color.map((col, i) => {
              return <span key={i} className={` mr-3 inline-block rounded cursor-pointer border-black w-9 h-9 ${(color === col) ? 'border-4' : 'border-2'}`} style={{ backgroundColor: `${col}` }} onClick={(e) => { setColor(col) }}></span>
            })
          }
        </div>
        <div className={`${(product.size.length === 0) ? 'hidden' : ''}`}>
          <h1 className='text-xl border-b mb-2 py-2'>Size</h1>
          <div className='flex'>
            {
              product.size.map((Size, i) => {
                return <span key={i} className={`mr-3 border-2 px-1 flex items-center justify-center cursor-pointer rounded ${(size === Size) ? 'border-black' : ''}`} style={{ minWidth: '30px', minHeight: '30px' }} onClick={() => { setSize(Size) }}>{Size}</span>
              })
            }
          </div>
        </div>
        <div className={`${(product.stock === 0) ? 'hidden' : ''}`}>
          <h1 className='text-xl border-b mb-2 py-2'>Quentity</h1>
          <div className='flex'>
            <span className='mr-3 bg-main-800 text-white text-xl w-9 h-9 flex items-center justify-center cursor-pointer rounded' onClick={() => { handleQty("Desc") }}>-</span>
            <span className='mr-3 border border-main-800 text-main-800 text-xl w-9 h-9 flex items-center justify-center cursor-pointer rounded'>{qty}</span>
            <span className='mr-3 bg-main-800 text-white text-xl w-9 h-9 flex items-center justify-center cursor-pointer rounded' onClick={() => { handleQty("Inc") }}>+</span>
          </div>
        </div>
        <div className='flex items-center justify-end border-b py-2 my-2'>
          <button className=' bg-main-800 text-white py-3 px-7 rounded font-semibold' onClick={(e) => { addToCart(e) }}>Add to Cart</button>
        </div>
        <div>
          <h1 className={`${(product.highlight.length === 0) ? 'hidden' : ''} text-xl border-b mb-2 py-2`}>Highlight</h1>
          {
            product.highlight.map((value, i) => {
              return <li key={i} className=' list-disc marker:text-main-800 my-2'>{value}</li>
            })
          }
        </div>
        <div>
          <h1 className='text-xl border-b mb-2 py-2'>Description</h1>
          <p>
            {product.description}
          </p>
        </div>
        <div className='mt-10'>
          <button className=' bg-main-800 text-white py-3 px-7 rounded font-semibold' onClick={() => { setShowReviewForm(true) }}>Submit Review</button>
        </div>
      </div>
    </div>


    <div className={`w-full my-20 ${(product.reviews.length) ? '' : 'hidden'}`}>
      <div><h1 className='mx-auto border-b-2 border-main-800 text-main-800 text-3xl w-40 font-semibold text-center pb-3'>REVIEWS</h1></div>
      <div className='flex flex-wrap items-center justify-evenly'>
        {
          product.reviews && product.reviews.map((review, i) => {
            return <ReviewCard key={i} userId={review.userId} deleteReview={deleteReview} type={user.type} rating={review.rating} name={review.username} comment={review.comment} profile={review.profile} />
          })
        }
      </div>
    </div>


    <div className={`w-full ${(similarProduct.length === 0) ? 'hidden' : ''}`}>
      <ItemSlider products={similarProduct} category={[product.category]} similarProduct={true} />
    </div>

    <div className={` ${(showReviewForm) ? "" : "hidden"} w-full h-full fixed top-0 left-0 z-50`} style={{ backgroundColor: "rgba(128, 128, 128, 0.653)" }}>
      <div className='w-full h-full flex items-center justify-center'>
        <form className='bg-white p-4 rounded' onSubmit={function (e) { e.preventDefault() }}>
          <h1 className='text-xl text-center font-semibold text-main-800'>Submit Review</h1>
          <div className='flex my-4'>
            <FaStar className={` text-3xl cursor-pointer mx-1 hover:text-hover-600 ${(rating >= 1) ? 'text-main-800' : 'text-gray-400'}`} onClick={(e) => { setRating(1) }} />
            <FaStar className={` text-3xl cursor-pointer mx-1 hover:text-hover-600 ${(rating >= 2) ? 'text-main-800' : 'text-gray-400'}`} onClick={(e) => { setRating(2) }} />
            <FaStar className={` text-3xl cursor-pointer mx-1 hover:text-hover-600 ${(rating >= 3) ? 'text-main-800' : 'text-gray-400'}`} onClick={(e) => { setRating(3) }} />
            <FaStar className={` text-3xl cursor-pointer mx-1 hover:text-hover-600 ${(rating >= 4) ? 'text-main-800' : 'text-gray-400'}`} onClick={(e) => { setRating(4) }} />
            <FaStar className={` text-3xl cursor-pointer mx-1 hover:text-hover-600 ${(rating >= 5) ? 'text-main-800' : 'text-gray-400'}`} onClick={(e) => { setRating(5) }} />
          </div>
          <textarea className=' border w-full resize-none' rows="5" value={comment} onChange={(e) => { setComment(e.target.value) }} />
          <div className='flex items-center justify-between mt-2'>
            <button className=' text-red-700' onClick={(e) => { setShowReviewForm(false) }}>CANCLE</button>
            <button className=' text-green-700' onClick={(e) => { submitReview() }}>SUBMIT</button>
          </div>
        </form>
      </div>
    </div>
  </>)
}

export default Details;
