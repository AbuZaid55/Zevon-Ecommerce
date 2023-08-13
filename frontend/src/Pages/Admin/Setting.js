import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'


const Setting = (props) => {
  const navigate = useNavigate()
  useEffect(()=>{ 
    if(props.user!==''){
      if(props.user.type==='Admin'){
      }else{
        navigate('*')
      }
    }
  },[props.user])
  return (
    <div className='flex'>
      <Aside/>
      <div className='setting' id='main'>
        setting
      </div>
    </div>
  )
}

export default Setting;
