import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'


const Customer = (props) => {
  const navigate = useNavigate()
  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.admin===true){
      }else{
        navigate('/page404')
      }
    }
  },[props.user])
  return (
    <div className='flex'>
      <Aside/>
      <div className='customer' id='main'>
        Customer Services
      </div>
    </div>
  )
}

export default Customer
