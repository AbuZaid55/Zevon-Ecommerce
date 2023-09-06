import React ,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'
import {toast} from 'react-toastify'
import axios from 'axios'


const Setting = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const [inputData,setInputData]=useState({sliderItemNo:10,banner:[],productPageItemNo:30,office:'',email:'',phoneNo:1234567890,instaLink:'',linkedInLink:'',discordLink:'',githubLink:'',noOfRow:20})


  const handleInput = (e) =>{
    if(e.target.name==='banner'){
      for(let i=0; i<e.target.files.length; i++){
        inputData.banner.push(e.target.files[i])
        setInputData({...inputData,'banner':inputData.banner})
      }
    }else{
      setInputData({...inputData,[e.target.name]:e.target.value})
    }
  }


  const submitForm = async()=>{
    props.setLoader2(true)
    try {
      const formdata = new FormData()
      formdata.append('sliderItemNo',inputData.sliderItemNo)
      formdata.append('productPageItemNo',inputData.productPageItemNo)
      formdata.append('office',inputData.office)
      formdata.append('email',inputData.email)
      formdata.append('phoneNo',inputData.phoneNo)
      formdata.append('instaLink',inputData.instaLink)
      formdata.append('linkedInLink',inputData.linkedInLink)
      formdata.append('discordLink',inputData.discordLink)
      formdata.append('githubLink',inputData.githubLink)
      formdata.append('noOfRow',inputData.noOfRow)
      inputData.banner.map((banner)=>(
        formdata.append('banner',banner)
      ))
      const res = await axios.post(`${BACKEND_URL}/site/siteSetting`,formdata,{withCredentials:true})
      props.getSiteSettings()
      toast.success(res.data.massage)
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    props.setLoader2(false)
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
    if(props.setting!==''){
      props.setting.banner=[]
      setInputData(props.setting)
    }
  },[props.setting])
  return (
    <div className='flex'>
      <Aside/>
      <div className='setting' id='main'>
          <div>
            <h1>Site Setting And Customer Support</h1>
            <div>
              <span>Home Page</span>
              <label htmlFor="cardno">Enter no of item in card Slider <span>*</span></label>
              <input type="number" id='cardno' name='sliderItemNo' value={inputData.sliderItemNo} onChange={(e)=>{handleInput(e)}} placeholder='Enter no of item in card Slider' />

              <label htmlFor="banner">Select Home Page Banner</label>
              <label htmlFor="banner" className='file' >Select Home Page Banner</label>
              <input type="file" id='banner' name='banner' multiple={true} onChange={(e)=>{handleInput(e)}}/>

              <span>Product Page</span>
              <label htmlFor="productno">Enter no of item on product page <span>*</span></label>
              <input type="number" id='productno' name='productPageItemNo' value={inputData.productPageItemNo} onChange={(e)=>{handleInput(e)}}  placeholder='Enter no of item on product page' />

              <span>Footer</span>
              <label htmlFor="office">Enter Office Location <span>*</span></label>
              <input type="text" id='office' name='office' value={inputData.office} onChange={(e)=>{handleInput(e)}}  placeholder='Enter Office Location' />

              <label htmlFor="email">Enter your email <span>*</span></label>
              <input type="text" id='email' name='email' value={inputData.email} onChange={(e)=>{handleInput(e)}}  placeholder='Enter your email' />

              <label htmlFor="phone">Enter your phone no <span>*</span></label>
              <input type="number" name='phoneNo' value={inputData.phoneNo}  onChange={(e)=>{handleInput(e)}} placeholder='Enter your phone no' />

              <label htmlFor="instalink">Enter your Instagram Link</label>
              <input type="text" id='instalink' name='instaLink' value={inputData.instaLink} onChange={(e)=>{handleInput(e)}}  placeholder='Enter your Instagram Link' />
              <label htmlFor="linkedinlink">Enter your LinkedIn Link</label>
              <input type="text" id='linkedinlink' name='linkedInLink' value={inputData.linkedInLink} onChange={(e)=>{handleInput(e)}}  placeholder='Enter your LinkedIn Link' />
              <label htmlFor="discordlink">Enter your Discord Link</label>
              <input type="text" id='discordlink' name='discordLink' value={inputData.discordLink}  onChange={(e)=>{handleInput(e)}} placeholder='Enter your Discord Link' />
              <label htmlFor="githublink">Enter your Github Link</label>
              <input type="text" id='githublink' name='githubLink' value={inputData.githubLink} onChange={(e)=>{handleInput(e)}}  placeholder='Enter your Github Link' />

              <span>Admin</span>
              <label htmlFor="noOfRow">Enter no of row in table <span>*</span></label>
              <input type="number" id='noOfRow' name='noOfRow' value={inputData.noOfRow} onChange={(e)=>{handleInput(e)}}  placeholder='Enter no of row in table' />

              <p><button onClick={()=>{submitForm()}}>Save</button></p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Setting;
