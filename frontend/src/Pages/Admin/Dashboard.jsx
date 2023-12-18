import React ,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Aside from './Aside'
import ProductsChart from '../../Component/Chart/ProductsChart';
import UserChart from '../../Component/Chart/UserChart';
import OrdersChart from '../../Component/Chart/OrdersChart';
import PaymentChart from '../../Component/Chart/PaymentChart';
import FailedPaymentChart from '../../Component/Chart/FailedPaymentChart';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => (state.user))
  
  useEffect(()=>{ 
      if(user==='Not Found!'){
        navigate('*')
      }else{
        if(user._id && user.type!=='Admin'){
          navigate('*')
        }
      }
  },[user])

  return (<>
    <div className='flex'>
      <Aside/>
      <div className='dashboard w-full' id='main'>
        <h1>Zevon Dashboard</h1>
        <div className='flex flex-col sm:flex-row'>
        <div className='chartContainer  w-full sm:w-1/2'><ProductsChart/></div>
        <div className='chartContainer  w-full sm:w-1/2'><UserChart/></div>
        </div>
        <div className='chartContainer w-full' ><OrdersChart/></div>
        <div className='chartContainer w-full'><PaymentChart/></div>
        <div className='chartContainer w-full'><FailedPaymentChart/></div>
      </div>
    </div>
  </>)
}

export default Dashboard
