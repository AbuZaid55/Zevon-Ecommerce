import React ,{useState,useEffect} from 'react'
import GoLogin from '../Component/GoLogin';

const Dashboard = (props) => {
  const [login,setLogin]=useState(false)
  const [user,setUser]=useState({_id:"",email:"",name:"",cart:[],shippingDetails:[],profile:""})
  
  useEffect(()=>{
    if(props.user._id){
      setLogin(true)
      setUser(props.user)
    }else{
      setLogin(false)
    }
  },[props.user])

  return (<>
   <div className={`${(login)?"hidden":""}`}><GoLogin/></div>
    <div className={`${(login)?"":"hidden"}`}>
      Dashboard
    </div>
  </>)
}

export default Dashboard
