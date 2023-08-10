import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'


const Users = (props) => {
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
      <div className='users' id='main'>
        Users
      </div>
    </div>
  )
}

export default Users
