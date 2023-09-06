import React ,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'
import ProductsChart from '../../Component/Chart/ProductsChart';
import UserChart from '../../Component/Chart/UserChart';
import OrdersChart from '../../Component/Chart/OrdersChart';
import PaymentChart from '../../Component/Chart/PaymentChart';
import FailedPaymentChart from '../../Component/Chart/FailedPaymentChart';

const Dashboard = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
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
      <div className='dashboard w-full' id='main'>
        <h1>Zevon Dashboard</h1>
        <div className='flex flex-col sm:flex-row'>
        <div className='chartContainer  w-full sm:w-1/2'><ProductsChart allProduct={props.allProduct}/></div>
        <div className='chartContainer  w-full sm:w-1/2'><UserChart allProduct={props.allProduct} setLoader2={props.setLoader2}/></div>
        </div>
        <div className='chartContainer w-full' ><OrdersChart setLoader2={props.setLoader2}/></div>
        <div className='chartContainer w-full'><PaymentChart allProduct={props.allProduct} setLoader2={props.setLoader2}/></div>
        <div className='chartContainer w-full'><FailedPaymentChart allProduct={props.allProduct} setLoader2={props.setLoader2}/></div>
      </div>
    </div>
  </>)
}

export default Dashboard
