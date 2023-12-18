import React, { useEffect, useState } from "react";
import { LineChart, Line, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
import CustomTooltip from "./Tooltip";
import { useNavigate } from 'react-router-dom'
import { useContext } from "react";
import { context } from "../../Context/context";

const FailedPaymentChart = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const { setLoader2 } = useContext(context)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [endDate, setEndDate] = useState(new Date(Date.now()).toISOString().slice(0, 10))
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))

  const fetchAllPayment = async () => {
    let data = [];
    setLoader2(true);
    try {
      const allpayment = await axios.get(`${BACKEND_URL}/order/allFailedPayment`, { withCredentials: true });
      allpayment.data.data.filter((payment) => {
        if (new Date(startDate).getTime() <= new Date(payment.createdAt.slice(0, 10)).getTime() && new Date(endDate).getTime() >= new Date(payment.createdAt.slice(0, 10)).getTime()) {
          let obj = { Amount: 0, paymentId: '' }
          obj.Amount = payment.totalFailedAmount
          obj.paymentId = payment.razorpay_payment_id
          data.push(obj)
        }
      })
      setData(data)
    } catch (error) { }
    setLoader2(false);
  };
  const handleChartClick = (data) => {
    if (data && data.activePayload[0].payload.paymentId) {
      navigate(`/admin/dashboard/failedpayment?key=${data.activePayload[0].payload.paymentId}`)
    }
  }

  useEffect(() => {
    fetchAllPayment();
  }, [startDate, endDate]);
  return (
    <div className=" w-full h-full">
      <div className="mx-10 flex flex-col sm:flex-row justify-end items-end">
        <div>
          <label className="mx-4 text-xl" htmlFor="from">From: </label>
          <input className="border-2 border-black px-2 py-1" type="date" id="from" value={startDate} onChange={((e) => { setStartDate(e.target.value) })} />
        </div>
        <div>
          <label className="mx-4 text-xl" htmlFor="to">To: </label>
          <input className="border-2 border-black px-2 py-1" type="date" id="to" value={endDate} onChange={((e) => { setEndDate(e.target.value) })} />
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
          style={{ cursor: "pointer" }}
          onClick={(data) => { handleChartClick(data) }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="Amount"
            stroke="#db2777"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <h1 className='w-full text-center text-2xl underline mt-6' style={{ color: "#db2777" }}>Total Failed Payment: {data.length}</h1>
    </div>
  )
}

export default FailedPaymentChart
