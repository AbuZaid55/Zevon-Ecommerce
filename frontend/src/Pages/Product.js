import React, { useEffect, useState } from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import {useLocation} from 'react-router-dom'
import { FaAngleDown,FaAngleUp,FaFilter,FaRupeeSign,FaStar,FaArrowRight,FaArrowLeft} from 'react-icons/fa';
import Card from '../Component/Card'
import axios from 'axios';
import BACKEND_URL from '../baseUrl';
import { no_of_item_page } from '../baseUrl';

const Product = (prop) => {
    const params = (useLocation().search);
    const subCategoryParams = params.slice(params.indexOf('=')+1)
    const urlSubCategory = subCategoryParams.replaceAll('%20',' ')
    const [allProduct,setAllProduct]=useState('')
    const [allFilterProduct,setAllFilterProduct]=useState('')
    const [filterProduct,setFilterProduct]=useState('')
    const [category,setCategory]=useState([])
    const [userId,setUserId]=useState('')
    const [maxPrice,setMaxPrice]=useState(0)
    const [filterPrice,setFilterPrice]=useState(0)
    const [showFilter,setShowFilter]=useState(false)
    const [rating,setRating]=useState(0)
    const [totalPage,setTotalPage]=useState(1)
    const [currentPage,setCurrentPage]=useState(1)
    const [filterSubCategory,setfilterSubCategory]=useState([])
    let subCategory = []

    const showSubCat=(e)=>{
        const xData = e.target.parentElement.getAttribute("data-show")
        const child = e.target.children 
        if(xData==="false"){
            child[0].style.display="none"
            child[1].style.display=""
            e.target.parentElement.setAttribute("data-show","true")
        }else{
            child[0].style.display=""
            child[1].style.display="none"
            e.target.parentElement.setAttribute("data-show","false")
        }
    }
  
    const clearAll = (e)=>{
        e.preventDefault()
        setFilterPrice(maxPrice)
        setRating(0)
        setfilterSubCategory([])
    }
    const filterSubCategoryHandle=(e)=>{
        const {value,checked}=e.target
        if(checked){
            setfilterSubCategory([...filterSubCategory,value])
        }else{
            setfilterSubCategory(filterSubCategory.filter((val)=> val !== value))
        }
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
              let maxPrice = 0
              res.data.map((item)=>{
                if(item.sellprice>maxPrice){
                    maxPrice = item.sellprice
                }
              })
              setMaxPrice(maxPrice)
              setFilterPrice(maxPrice)
        } catch (error) {
            console.log(error)
        }
    }
    
    const searchProduct = async()=>{
        try {
            const res = await axios.get(`${BACKEND_URL}/search/${urlSubCategory}`) 
            console.log(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const filterAllProducts = ()=>{
        const filterallproduct = allProduct!=='' && allProduct.filter((item)=>{
            let rat = 0
            if(item.reviews.length!==0){
                item.reviews.map((review)=>{
                    rat = rat+review.rating
                })
                rat = (rat/item.reviews.length).toFixed(1)
            }
            if(filterSubCategory.length===0){
                if(item.sellprice<=filterPrice && rat>=rating){
                    return item
                }
            }else{
                if(item.sellprice<=filterPrice && rat>=rating ){
                    if(filterSubCategory.includes(item.subCategory) || filterSubCategory.includes(item.category)){
                        return item
                    }
                }
            }
        })
        if(filterallproduct!=='' && filterallproduct!==false){
            setTotalPage(Math.ceil(filterallproduct.length/no_of_item_page))
            setAllFilterProduct(filterallproduct)
        }
    }

    const handlePagination = (action)=>{
        if(action==="Inc"){
            if(totalPage>currentPage){
                setCurrentPage(currentPage+1)
            }else{
                setCurrentPage(totalPage)
            }
        }
        if(action==='Desc'){
            if(currentPage>1){
                setCurrentPage(currentPage-1)
            }else{
                setCurrentPage(1)
            }
        }
    }
    useEffect(()=>{
        const filterproduct = allFilterProduct.slice((currentPage-1)*no_of_item_page,((currentPage-1)*5)+no_of_item_page)
        setFilterProduct(filterproduct)
    },[currentPage,totalPage,allFilterProduct])
    useEffect(()=>{
        setCurrentPage(1)
        if(params.includes('?search=') && urlSubCategory!==''){
            searchProduct()
        }
        else if(urlSubCategory!==null && urlSubCategory!==''){
            setfilterSubCategory([urlSubCategory])
        }else{
            setfilterSubCategory([])
        }
        fetchProduct()
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    },[urlSubCategory])
    useEffect(()=>{
        setCurrentPage(1)
        setUserId(prop.user._id)
    },[prop.user])
    useEffect(()=>{
        setCurrentPage(1)
        filterAllProducts()
    },[filterSubCategory,rating,filterPrice])
  return (
    <div>
        <div className='fixed top-0 left-0 z-50 w-full' style={{height:"20vh"}}><Header user={prop.user}/></div>
        <div className=' mt-44 sm:mt-36 w-full flex fixed'>
        <aside className={` bg-gray-200 ${(showFilter)?'left-0':' -left-60 '} absolute z-20 md:static h-full md:h-auto w-1/5 transition-all`} style={{minWidth:"230px",maxWidth:"300px"}}>
        <span className='absolute left-full py-3 border rounded-lg rounded-l-none bg-white text-fuchsia-800 px-2 cursor-pointer text-xl md:hidden mt-2' onClick={()=>{setShowFilter(!showFilter)}} ><FaFilter/></span>
            <div className=' overflow-y-scroll scrollbar-hide pb-10' style={{height:"80vh"}}>
            <div>
                <div className={`${(filterSubCategory.length===0 && filterPrice===maxPrice && rating===0)?'hidden':''}`}>
                    <h1 className='text-2xl font-semibold px-3 text-fuchsia-950 py-3'>Applied Filters</h1>
                    <div className='p-2'>
                        {filterSubCategory.map((subCategory,i)=>{
                            return <span key={i} className='bg-white rounded-full px-3 md:py-2 py-1 block mt-1'>{subCategory}</span>
                        })}
                        <span className={`${(filterPrice===maxPrice)?'hidden':'flex'} items-center bg-white rounded-full px-3 py-1 mt-1`}><FaRupeeSign/>{filterPrice}</span>
                        <span className={`${(rating===0)?'hidden':'flex'} items-center bg-white rounded-full px-3 py-1 mt-1`}>{rating} <FaStar className='mx-1'/> & above</span>
                    </div>
                </div>
                <h1 className='text-2xl font-semibold px-3 text-fuchsia-950 py-3'>Category</h1>
                {
                    category!=='' && category.map((cat,I)=>{
                        return <div key={I} className='h-12 data-[show=true]:h-full  overflow-hidden mb-1' data-show="false">
                        <h1 className='bg-white px-3 text-xl cursor-pointer h-12 flex items-center justify-between' onClick={(e)=>{showSubCat(e)}}>{cat}<FaAngleUp className=' pointer-events-none'/><FaAngleDown className=' pointer-events-none'  style={{display:"none"}}/></h1>
                        {
                            allProduct.map((item,i)=>{
                                if(item.category===cat){
                                    if(!subCategory.includes(item.subCategory)){
                                        return <div key={i} className='flex flex-col bg-gray-100'>
                                        <label className='w-full px-4 py-1 border-b text-lg cursor-pointer'><input className='mr-4 w-4 h-4 cursor-pointer' value={item.subCategory} onChange={(e)=>{filterSubCategoryHandle(e)}} checked={filterSubCategory.includes(item.subCategory)} type="checkbox"/>{item.subCategory}</label>
                                        <span className='hidden'>{subCategory.push(item.subCategory)}</span>
                                        </div>
                                    }
                                }
                            })
                        }
                    </div>
                    })
                }
            </div>
            <div>
                <h1 className='text-2xl font-semibold px-3 text-fuchsia-950 py-2'>Price</h1>
                <div className='bg-white px-3 py-2'>
                <p className='flex items-center text-xl font-semibold'><FaRupeeSign/>{filterPrice}</p>
                <input className=' w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'  type="range" min={0} max={maxPrice} value={filterPrice} onChange={(e)=>{setFilterPrice(e.target.value)}} />
                </div>
            </div>
            <div>
                <h1 className='text-2xl font-semibold px-3 text-fuchsia-950 py-2'>Rating</h1>
                <div className='flex flex-col bg-white'>
                    <label className='w-full px-4 py-1 border-t text-lg flex items-center cursor-pointer'><input className='mr-4 w-4 h-4' type="checkbox" checked={rating===4} onChange={(e)=>{(e.target.checked)?setRating(4):setRating(0)}}/>4 <FaStar className='mx-1 text-base'/> & above</label>
                    <label className='w-full px-4 py-1 border-t text-lg flex items-center cursor-pointer'><input className='mr-4 w-4 h-4' type="checkbox" checked={rating===3} onChange={(e)=>{(e.target.checked)?setRating(3):setRating(0)}}/>3 <FaStar className='mx-1 text-base'/> & above</label>
                    <label className='w-full px-4 py-1 border-t text-lg flex items-center cursor-pointer'><input className='mr-4 w-4 h-4' type="checkbox" checked={rating===2} onChange={(e)=>{(e.target.checked)?setRating(2):setRating(0)}}/>2 <FaStar className='mx-1 text-base'/> & above</label>
                </div>
            </div>
            <button className=' w-full bg-white text-xl font-bold my-3 py-2 hover:bg-fuchsia-50 ' onClick={(e)=>{clearAll(e)}}>Clear All</button>
            </div>
        </aside>


        <div className='w-full md:w-4/5 relative overflow-y-scroll ' style={{height:'80vh'}}>
       <div className=' relative'>
        <div className={`w-full ${(filterProduct.length===0)?"flex":"hidden"} items-center justify-center flex-col`} style={{height:"60vh"}}><h1 className="text-5xl font-bold text-fuchsia-700">No Product</h1></div>
       <div className={`${(filterProduct.length===0)?'hidden':'flex'} flex-wrap items-center justify-evenly w-full`} style={{minHeight:'60vh'}} >
        {filterProduct!=='' && filterProduct.map((item,i)=>{
            return <Card key={i} product={item} userId={userId}/>        
        })}
        </div>
        <div className='flex items-center justify-between w-full relative bottom-0'>
            <button className=' bg-fuchsia-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Desc")}}><FaArrowLeft/></button>
            <div className='flex'>
            <p className='border p-2 w-10 h-10 text-center '>{currentPage}</p>
            <span className='text-3xl'>/</span>
            <p className='border p-2 w-10 h-10 text-center '>{totalPage}</p>
            </div>
            <button className=' bg-fuchsia-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Inc")}}><FaArrowRight/></button>
        </div>
        <div><Footer/></div>
       </div>
        </div>
    </div>
    </div>
  )
}

export default Product
