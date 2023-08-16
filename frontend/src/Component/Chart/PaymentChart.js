import React, { useEffect, useState } from "react";
import { LineChart, Line, YAxis, CartesianGrid,ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
import CustomTooltip from "./Tooltip";

const PaymentChart = (props) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [data,setData]=useState([])
  const [startDate,setStartDate]=useState(new Date(Date.now()-7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10))
  const [endDate,setEndDate]=useState(new Date(Date.now()).toISOString().slice(0,10))
  
  const fetchAllPayment = async () => {
    let data = [];
    props.setLoader2(true);
    try {
      const allpayment = await axios.get(`${BACKEND_URL}/order/allPayment`, {
        withCredentials: true,
      });
      allpayment.data.data.filter((payment)=>{
        if(new Date(startDate).getTime()<=new Date(payment.createdAt.slice(0,10)).getTime() && new Date(endDate).getTime()>=new Date(payment.createdAt.slice(0,10)).getTime() ){
            let obj = {
                Amount: 0,
                userId:''
              }
            obj.Amount = payment.totalPaidAmount
            obj.userId = payment.userId
            data.push(obj)
        }
      })
      setData(data)
    } catch (error) {}
    props.setLoader2(false);
  };

  useEffect(() => {
    fetchAllPayment();
  }, [startDate,endDate]);
  return (
    <div className=" w-full h-full">
      <div className="mx-10 flex flex-col sm:flex-row justify-end items-end">
      <div>
      <label className="mx-4 text-xl" htmlFor="from">From: </label>
      <input className="border-2 border-black px-2 py-1" type="date" id="from" value={startDate} onChange={((e)=>{setStartDate(e.target.value)})}/>
      </div>
      <div>
      <label className="mx-4 text-xl" htmlFor="to">To: </label>
      <input className="border-2 border-black px-2 py-1" type="date" id="to" value={endDate} onChange={((e)=>{setEndDate(e.target.value)})}/>
      </div>
      </div>
     <ResponsiveContainer width="99%" height="80%">
     <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="Amount"
          stroke="#00C49F"
          activeDot={{ r: 8 }}
        />
      </LineChart>
     </ResponsiveContainer>
     <h1 className='w-full text-center text-2xl underline mt-6' style={{color:"#00C49F"}}>Total Successfull Payment: {data.length}</h1>
    </div>
  );
};

export default PaymentChart;
