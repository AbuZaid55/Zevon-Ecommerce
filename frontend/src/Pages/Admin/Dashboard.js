import React ,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'

const Dashboard = (props) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
  const navigate = useNavigate()
  const [user,setUser]=useState({_id:"",email:"",name:"",cart:[],shippingDetails:[],profile:""})
  
  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.type==='Admin'){
      }else{
        navigate('*')
      }
    }
  },[props.user])

  return (<>
    <div className='flex'>
      <Aside/>
      <div className='dashboard' id='main'>
        Dashboard
      </div>
    </div>
  </>)
}

export default Dashboard
