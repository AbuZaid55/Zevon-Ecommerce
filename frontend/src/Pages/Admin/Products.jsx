import React ,{useEffect,useState} from 'react'
import { useNavigate,Link,useLocation } from 'react-router-dom';
import { FaTrash,FaEdit,FaPlusSquare,FaStar,FaArrowRight,FaArrowLeft } from "react-icons/fa";
import Aside from './Aside'
import {toast} from 'react-toastify'
import axios from 'axios'


const Products = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const location = useLocation().search
  const [itemOnPerPage,setItemOnPerPage]=useState(20)
  const [allProduct,setAllProduct]=useState([])
  const [productOnPage,setProductOnPage]=useState([])
  const [deleteItemId,setDeleteItemId]=useState('')
  const [showConfirm,setShowConfirm]=useState(false)
  const [currentPage,setCurrentPage]=useState(1)
  const [totalPage,setTotalPage]=useState(1)
  const [search,setSearch]=useState('')
  const [searchType,setSearchType]=useState('default')
  const [onlyInStock,setOnlyInStock]=useState(false)

  const handleItemPerPage = (e)=>{
    if(e.target.value>100){
      setItemOnPerPage(100)
    }else{
      setItemOnPerPage(e.target.value)
    }
    setCurrentPage(1)
  }

  const getSearchProduct = ()=>{
    const key = search.toLowerCase().split(' ')
    const searchItem = props.allProduct.filter((item)=>{
      if(onlyInStock===false){
        if(search!==''){
          let rat = 0
        item.reviews.map((review)=>{
          rat = rat+review.rating
        })
        if(item.reviews.length===0){
          rat = 0
        }else{
          rat= (rat/item.reviews.length).toFixed(1)
        }
        const name = item.name.toLowerCase()
        const stock = item.stock
        const price = item.sellprice
        const description = item.description.toLowerCase()
        const category = item.category.toLowerCase()
        const subCategory = item.subCategory.toLowerCase()
        let match = []
        if(searchType==='default'){
          key.map((keyPoint)=>{
            if(name.includes(keyPoint) || item._id.includes(search)|| stock==search || price==search || item.createdAt.includes(search.split("-").reverse().join("-")) ||description.includes(keyPoint) || category===keyPoint || subCategory===keyPoint || category===search || subCategory===search){
                match.push(true)
            }else{
                match.push(false)
            }
          })
        }
        else if(searchType==='stock'){
          if(stock==search){
            match.push(true)
          }else{
            match.push(false)
          }
        }else if(searchType==='price'){
          if(price==search){
            match.push(true)
          }else{
            match.push(false)
          }
        }else if(searchType==='rating'){
          if(rat==search){
            match.push(true)
          }else{
            match.push(false)
          }
        }else if(searchType==='id'){
          if(item._id.includes(search)){
            match.push(true)
          }else{
            match.push(false)
          }
        }
        if(!match.includes(false)){
          return item
        }
        }else{
          return item
        }
      }else{
        return item.stock!==0
      }
    })
    setAllProduct(searchItem)
    setTotalPage(Math.ceil(searchItem.length/itemOnPerPage))
    setCurrentPage(1)
  }

  const deleteItem = async()=>{
    setShowConfirm(false)
    props.setLoader2(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/delete/product?productId=${deleteItemId}`,{withCredentials:true})
      props.fetchProduct()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
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
    if(props.user!==''){
      if(props.user.type==='Admin'){
      }else{
        navigate('*')
      }
    }
  },[props.user])
  useEffect(()=>{
    if(props.setting && props.setting.noOfRow){
      setItemOnPerPage(props.setting.noOfRow)
    }
  },[props.setting])
  useEffect(()=>{
    getSearchProduct()
  },[props.allProduct,search,onlyInStock,itemOnPerPage,searchType])
  useEffect(()=>{
    const products = allProduct.slice((currentPage-1)*itemOnPerPage,currentPage*itemOnPerPage)
    setProductOnPage(products)
  },[currentPage,allProduct])

  useEffect(()=>{
    if(location!==''){
      if(location.slice(5)==='OutOfStock'){
        setSearch('0')
        setSearchType("stock")
      }
      if(location.slice(5)==='InStock'){
        setOnlyInStock(true)
      }
    }
  },[])


  return (
    <div className='flex'>
      <Aside/>
      <div className='products' id='main'>
        <h1>Products</h1>
        <p className='add'><Link to='/admin/dashboard/addproduct'><button><FaPlusSquare className='mr-3'/>Add Products</button></Link></p>
        <div>
         <div className='top flex items-center justify-between'>
         <div className='search relative'>
         <input  type="search" className='w-full' value={search} onChange={(e)=>{setOnlyInStock(false);setSearch(e.target.value)}} placeholder='Search Products' />
         <label className='searchType'>Search Type :- 
         <select  value={searchType} onChange={(e)=>{setOnlyInStock(false);setSearchType(e.target.value)}}>
          <option value={"default"}>Default</option>
          <option value={"stock"}>Stock</option>
          <option value={"price"}>Price</option>
          <option value={"rating"}>Rating</option>
          <option value={"id"}>Product Id</option>
         </select>
         </label>
         </div>
          <div className='top2'>
          <label  className='noPageLabel'><input className='noPage' value={itemOnPerPage} onChange={((e)=>{handleItemPerPage(e)})} type="number" max={100} />Per Page</label>
          <span className='totalproducts'>Total Products: {allProduct.length}</span>
          </div>
         </div>
          <table className='mt-4 '>

            <thead>
              <tr>
                <th>Thumbnail</th>
                <th className='name'>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
                {productOnPage.map((item,i)=>{
                   let rat = 0
                   item.reviews.map((review)=>{
                     rat = rat+review.rating
                   })
                   if(item.reviews.length===0){
                     rat = 0
                   }else{
                     rat= (rat/item.reviews.length).toFixed(1)
                   }
                  return <tr key={i}>
                  <td datalabel={"Thumbnail"}><img style={{height:"60px",width:"60px",margin:" 8px auto",borderRadius:'10px'}} src={`${BACKEND_URL}/Images/${item.thumbnail}`} alt="Pic" /></td>
                  <td datalabel={"Name"} className='name'><Link to={`/details?_id=${item._id}`}>{item.name}</Link></td>
                  <td datalabel={"Stock"}>{item.stock}</td>
                  <td datalabel={"Price"}>&#8377; {item.sellprice}</td>
                  <td datalabel={"Rating"}><span className={`${(rat>=3)?'bg-green-700':""} ${(rat<3 && rat>1)?'bg-yellow-500':""} ${(rat<=1)?'bg-red-700':""} text-white flex m-auto items-center justify-evenly`} style={{width:'50px',height:"30px", borderRadius:'8px'}}>{rat}<FaStar/></span></td>
                  <td datalabel={"Edit"}><Link to={`/admin/dashboard/updateproduct?_id=${item._id}`}><FaEdit className='icon edit'/></Link></td>
                  <td datalabel={"Delete"}><FaTrash className='icon delete' onClick={()=>{setDeleteItemId(item._id);setShowConfirm(true)}}/></td>
                </tr>
                })}
            </tbody>

          </table>
        </div>
        <div className='flex items-center justify-between w-full relative bottom-0'>
            <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Desc")}}><FaArrowLeft/></button>
            <div className='flex'>
            <p className='border p-2 w-10 h-10 text-center '>{currentPage}</p>
            <span className='text-3xl'>/</span>
            <p className='border p-2 w-10 h-10 text-center '>{totalPage}</p>
            </div>
            <button className=' bg-main-800 text-white px-4 py-3 m-8 text-2xl' onClick={()=>{handlePagination("Inc")}}><FaArrowRight/></button>
        </div>
      </div>
        <div className={`${(showConfirm)?'flex':'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center `} style={{backgroundColor:"rgba(128, 128, 128, 0.653)",zIndex:'200'}}>
        <div className=' w-56 h-56 border p-4  bg-white rounded  flex items-stretch justify-between flex-col'>
          <h1 className=' text-main-800 text-center text-2xl'>Are your sure you want to delete?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={()=>{deleteItem()}} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(()=>{setShowConfirm(false)})} className=' bg-main-800 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
        </div>
    </div>
  )
}

export default Products
