import {useEffect, useState,useRef} from 'react'
import axios from 'axios'
import BACKEND_URL from '../../baseUrl'
import Aside from './Aside'
import {toast} from 'react-toastify'
import { useLocation,useNavigate } from 'react-router-dom'


function UpdateProduct(props) {
  const location = useLocation().search
  const navigate = useNavigate()
  const ref1 = useRef()
  const ref2 = useRef()
  const [product,setProduct]=useState({name:'',description:'',stock:'', maxprice:'',sellprice:'',deliveryCharge:'',GST:'',category:'',subCategory:'',color:[],size:[],highlight:[],thumbnail:'',images:[]})
  const [color,setColor]=useState('#000000')
  const [size,setSize]=useState('')
  const [highlightPoint,setHighlightPoint]=useState('')

  const handleInput = (e)=>{
    if(e.target.name==='thumbnail'){
      setProduct({...product,'thumbnail':e.target.files[0]})
    }else if(e.target.name==='images'){
      for(let i=0;i<e.target.files.length;i++){
        product.images.push(e.target.files[i])
        setProduct({...product,'images':product.images})
      }
    }else{
      setProduct({...product,[e.target.name]:e.target.value})
    }
  }

  const addColor=(e)=>{
    e.preventDefault()
    product.color.push(color)
    setProduct({...product,'color':product.color})
    setColor('#000000')
  }

  const addSize = (e)=>{
    e.preventDefault()
    if(size===''){
      toast.error("Enter size")
    }else{
      product.size.push(size)
      setProduct({...product,'size':product.size})
      setSize('')
    }
  }

  const addHighlight = (e)=>{
    e.preventDefault()
    if(highlightPoint==='' ){ 
      toast.error("Enter Highlight Point")
    }else{
      product.highlight.push(highlightPoint)
      setProduct({...product,'highlight':product.highlight})
      setHighlightPoint('')
    }
  }

  const clearColor=(e)=>{
    e.preventDefault()
    setProduct({...product,"color":[]})
  }

  const clearSize=(e)=>{
    e.preventDefault()
    setProduct({...product,"size":[]})
  }

  const clearHighlight=(e)=>{
    e.preventDefault()
    setProduct({...product,"highlight":[]})
  }

const submitForm = async(e)=>{
    e.preventDefault()
    let formdata = new FormData()
    formdata.append('productId',product._id)
    formdata.append('name',product.name)
    formdata.append('description',product.description)
    formdata.append('stock',product.stock)
    formdata.append('maxprice',product.maxprice)
    formdata.append('sellprice',product.sellprice)
    formdata.append('category',product.category)
    formdata.append('subCategory',product.subCategory)
    formdata.append('deliveryCharge',product.deliveryCharge)
    formdata.append('GST',product.GST)
    formdata.append('thumbnail',product.thumbnail)
    formdata.append('highlight',JSON.stringify(product.highlight))
    product.color.map((item)=>(
      formdata.append('color',item)
    ))
    product.size.map((item)=>(
      formdata.append('size',item)
    ))
    product.images.map((item)=>(
      formdata.append('images',item)
    ))
    try {
      const res = await axios.put(`${BACKEND_URL}/update/product`,formdata,{withCredentials:true})
      if(res.status===200){
        toast.success(res.data.massage)
        setProduct({...product,"thumbnail":'',"images":[]})
        ref1.current.value=null
        ref2.current.value=null
        props.fetchProduct()
      }
    } catch (error) {
      toast.error(error.response.data.massage)
    }
  }

  useEffect(()=>{
    let _id = ''
    if(location!=='' & location.includes('?_id=')){
       _id = location.slice(5) 
    }
    if(props.allProduct.length!==0){
      const allData = props.allProduct
      const data=allData.filter((item)=>{
        return item._id===_id
      })
    if(data.length!==0){
      data[0].thumbnail=''
      data[0].images=[]
      setProduct(data[0])
    }
    else{
      toast.error("Product Not Found!")
    }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.allProduct,location])
  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.type==='Admin'){
      }else{
        navigate('*')
      }
    }
  },[props.user])
  return (<div className='flex'>
    <Aside/>
   <div id='updateProduct'>
   <div className='form' id='main'>
   <h1>Update Product</h1>
    {/* <input type="text" placeholder="enter description" name='description' value={product.description} onChange={(e)=>{handleInput(e)}}/> */}
    <div id='inputName'>
   <label htmlFor="name">Enter Product Name</label>
    <input type="text" id='name' placeholder="Enter Name" name='name' value={product.name} onChange={(e)=>{handleInput(e)}}/>
   </div>
    
    <div>
      <label htmlFor="stock">Enter Stock</label>
    <input id='stock' type="number" placeholder="Enter Stock" name='stock' value={product.stock} onChange={(e)=>{handleInput(e)}}/>
    </div>
    <div>
      <label htmlFor="maxprice">Enter Max Price</label>
    <input id='maxprice' type="number" placeholder="Enter Maxprice" name='maxprice' value={product.maxprice} onChange={(e)=>{handleInput(e)}}/>
    </div>
    
    <div>
      <label htmlFor="sellprice">Enter Sell Price</label>
    <input id='sellprice' type="number" placeholder="Enter Sellprice" name='sellprice' value={product.sellprice} onChange={(e)=>{handleInput(e)}}/>
    </div>
    
    <div>
      <label htmlFor="DC">Enter Delivery Charge</label>
    <input id='DC' type="number" placeholder="Enter Delivery charge" name='deliveryCharge' value={product.deliveryCharge} onChange={(e)=>{handleInput(e)}}/>
    </div>
    
    <div>
      <label htmlFor="GST">Enter GST Charge</label>
    <input id='GST' type="number" placeholder="Enter GST Charge" name='GST' value={product.GST} onChange={(e)=>{handleInput(e)}}/>
    </div>
    
    <div>
      <label htmlFor="category">Enter Category</label>
    <input id='category' type="text" placeholder="Enter Category" name='category' value={product.category} onChange={(e)=>{handleInput(e)}}/>
    </div>
    
    <div>
      <label htmlFor="subCategory">Enter SubCategory</label>
    <input id='subCategory' type="text" placeholder="Enter SubCategory" name='subCategory' value={product.subCategory} onChange={(e)=>{handleInput(e)}}/>
    </div>


    <div className='file'>
      <label htmlFor="thumbnail">Select Thumbnail</label>
      <label htmlFor="thumbnail">Select Thumbnail</label>
    <input id='thumbnail' ref={ref1} type="file" placeholder="select Thumbnail" name='thumbnail' onChange={(e)=>{handleInput(e)}}/>
    </div>
   
   <div className='file'>
    <label htmlFor="images">Select Images</label>
    <label htmlFor="images">Select Images</label>
   <input id='images' ref={ref2} type="file" multiple name='images' onChange={(e)=>{handleInput(e)}}/>
   </div>

   <div id='inputColor'>
      <label htmlFor="color">Select Color</label>
      <label htmlFor="color"></label>
      <input id='color' type="color" value={color} onChange={(e)=>{setColor(e.target.value)}} />
      <div id='inputButton'>
        <button onClick={(e)=>{clearColor(e)}}>Clear Color</button>
        <button onClick={(e)=>{addColor(e)}}>Add Color</button>
      </div>
    </div>


    <div>
      <label htmlFor="size">Enter Size</label>
      <input id='size' type="text" placeholder='Enter Size' value={size} onChange={(e)=>{setSize(e.target.value)}} />
      <div id='inputButton'>
        <button onClick={(e)=>{clearSize(e)}}>Clear Size</button>
        <button onClick={(e)=>{addSize(e)}}>Add Size</button>
      </div>  
    </div>

    <div>
      <label htmlFor="highlight">Enter Highlight Point</label>
      <input id='highlight' type="text" value={highlightPoint} onChange={(e)=>{setHighlightPoint(e.target.value)}} placeholder='Enter Highlight Point' />
      <div id='inputButton'>
        <button onClick={(e)=>{clearHighlight(e)}}>Clear Highlight</button>
        <button onClick={(e)=>{addHighlight(e)}}>Add Highlight</button>
      </div>
    </div>

    <div className='preview'>
    {product.color.map((item,i)=>{
      return <span key={i} style={{backgroundColor:`${item}`}}></span>
    })}
    </div>
   <div className='preview'>
   {product.size.map((item,i)=>{
      return <span key={i} style={{border:'2px solid black'}}>{item}</span>
    })}
   </div>
    <div className='preview'>
    {product.highlight.map((item,i)=>{
      return <li key={i}>{item}</li>
    })}
    </div>

    
    <div id='inputTextarea'>
    <label htmlFor="description">Enter Description</label>
   <textarea id='description' style={{minHeight:'250px', maxHeight:"250px", resize:'none'}} type="text" placeholder="Enter Description" name='description' value={product.description} onChange={(e)=>{handleInput(e)}}/>
   </div>

    <div id='mainButton'>
    <button style={{justifySelf:"end"}} onClick={(e)=>{submitForm(e)}}>Submit</button>
    </div>
   </div>
   </div>
  </div>);
}

export default UpdateProduct;
