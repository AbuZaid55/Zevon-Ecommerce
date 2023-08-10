import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'

const CancleOrders = (props) => {
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
      <div className='CancleOrders' id='main'>
        Cancle Orders
      </div>
    </div>
  )
}

export default CancleOrders
