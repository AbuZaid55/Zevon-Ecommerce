import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'


const Payment = (props) => {
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
      <div className='payment' id='main'>
        Payments
      </div>
    </div>
  )
}

export default Payment
