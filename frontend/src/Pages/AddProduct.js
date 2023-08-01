import {useRef, useState} from 'react'
import axios from 'axios'
import BACKEND_URL from '../baseUrl'
function AddProduct() {
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
      alert("Enter size")
    }else{
      product.size.push(size)
      setProduct({...product,'size':product.size})
      setSize('')
    }
  }

  const addHighlight = (e)=>{
    e.preventDefault()
    if(highlightPoint==='' ){ 
      alert("Enter Highlight Point")
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

  const resetForm = (e)=>{
    e.preventDefault()
    setProduct({name:'',description:'',stock:'', maxprice:'', sellprice:'',deliveryCharge:"",GST:"",category:'',subCategory:'',color:[],size:[],highlight:[],thumbnail:'',images:[]})
    setColor('#000000')
    setSize('')
    setHighlightPoint('')
    ref1.current.value=null
    ref2.current.value=null
  }

  const submitForm = async(e)=>{
    e.preventDefault()
    let formdata = new FormData()
    formdata.append('name',product.name)
    formdata.append('description',product.description)
    formdata.append('stock',product.stock)
    formdata.append('maxprice',product.maxprice)
    formdata.append('sellprice',product.sellprice)
    formdata.append('deliveryCharge',product.deliveryCharge)
    formdata.append('GST',product.GST)
    formdata.append('category',product.category)
    formdata.append('subCategory',product.subCategory)
    formdata.append('COD',product.COD) 
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
      const res = await axios.post(`${BACKEND_URL}/add/product`,formdata)
      if(res.status===200){
        alert(res.data.massage)
        // setProduct({name:'',description:'',stock:'',maxprice:'', sellprice:'',deliveryCharge:"",GST:"",category:'',subCategory:'', color:[],size:[],highlight:[],thumbnail:'',images:[]})
        //   setColor('#000000')
        //   setSize('')
        //   setHighlightPoint('')
        //   ref1.current.value=null
        //   ref2.current.value=null
      }
    } catch (error) {
      alert(error.response.data.massage)
    }
  }
  console.log(product)
  return (<>

   <h1>Add product</h1>
   <form className='flex flex-col'>
    <input type="text" placeholder="enter name" name='name' value={product.name} onChange={(e)=>{handleInput(e)}}/>
    <input type="text" placeholder="enter description" name='description' value={product.description} onChange={(e)=>{handleInput(e)}}/>
    <input type="number" placeholder="enter stock" name='stock' value={product.stock} onChange={(e)=>{handleInput(e)}}/>
    <input type="number" placeholder="enter maxprice" name='maxprice' value={product.maxprice} onChange={(e)=>{handleInput(e)}}/>
    <input type="number" placeholder="enter sellprice" name='sellprice' value={product.sellprice} onChange={(e)=>{handleInput(e)}}/>
    <input type="number" placeholder="enter delivery charge" name='deliveryCharge' value={product.deliveryCharge} onChange={(e)=>{handleInput(e)}}/>
    <input type="number" placeholder="enter GST Charge" name='GST' value={product.GST} onChange={(e)=>{handleInput(e)}}/>
    <input type="text" placeholder="enter category" name='category' value={product.category} onChange={(e)=>{handleInput(e)}}/>
    <input type="text" placeholder="enter subCategory" name='subCategory' value={product.subCategory} onChange={(e)=>{handleInput(e)}}/>
    <input type="color" value={color} onChange={(e)=>{setColor(e.target.value)}} />
    <button onClick={(e)=>{addColor(e)}}>Add Color</button>
    <button onClick={(e)=>{clearColor(e)}}>Clear Color</button>
    {product.color.map((item,i)=>{
      return <span key={i} style={{display:"inline-block",width:'30px',height:'30px',backgroundColor:`${item}`}}></span>
    })}
    <input type="text" placeholder='enter size' value={size} onChange={(e)=>{setSize(e.target.value)}} />
    <button onClick={(e)=>{addSize(e)}}>Add Size</button>
    <button onClick={(e)=>{clearSize(e)}}>Clear Size</button>
    {product.size.map((item,i)=>{
      return <span key={i} style={{display:"inline-block",width:'30px',height:'30px',border:'1px solid black'}}>{item}</span>
    })}
    <input type="text" value={highlightPoint} onChange={(e)=>{setHighlightPoint(e.target.value)}} placeholder='enter highlight point' />
    <button onClick={(e)=>{addHighlight(e)}}>Add Highlight</button>
    <button onClick={(e)=>{clearHighlight(e)}}>Clear Highlight</button>
    {product.highlight.map((item,i)=>{
      return <li key={i}>{item}</li>
    })}
    <input ref={ref1} type="file" placeholder="select thumbnail" name='thumbnail' onChange={(e)=>{handleInput(e)}}/>
    <input ref={ref2} type="file" multiple name='images' onChange={(e)=>{handleInput(e)}}/>
    <button onClick={(e)=>{submitForm(e)}} type='submit'>Submit</button>
    <button onClick={(e)=>{resetForm(e)}} >Reset</button>
   </form>
  </>);
}

export default AddProduct;
