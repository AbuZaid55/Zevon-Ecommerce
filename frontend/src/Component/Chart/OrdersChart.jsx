import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function CustomTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div
        className="custom-tooltip bg-white px-2 py-1 rounded-xl"
        style={{
          color: payload[0].fill,
          border: `1.5px solid ${payload[0].fill}`,
        }}
      >
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}

const OrdersChart = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState();
  const [totalData, setTotalData] = useState(0);
  const navigate = useNavigate()

  const fetchOrders = async () => {
    let data2 = [
      {
        name: "Processing",
        total: 0,
      },
      {
        name: "Confirmed",
        total: 0,
      },
      {
        name: "Shipped",
        total: 0,
      },
      {
        name: "Out For Delivery",
        total: 0,
      },
      {
        name: "Cancelled",
        total: 0,
      },
    ];

    let totalData = 0;

    props.setLoader2(true);
    try {
      const allOrders = await axios.get(`${BACKEND_URL}/order/allOrders`, {
        withCredentials: true,
      });
      allOrders.data.data.filter((order) => {
        if (order.status === "Processing") {
          data2[0].total += 1;
        } else if (order.status === "Confirmed") {
          data2[1].total += 1;
        } else if (order.status === "Shipped") {
          data2[2].total += 1;
        } else if (order.status === "Out For Delivery") {
          data2[3].total += 1;
        } else if (order.status === "Cancelled") {
          data2[4].total += 1;
        }
        totalData += 1;
      });
      setData(data2);
      setTotalData(totalData);
    } catch (error) {}
    props.setLoader2(false);
  };

  const handleChartClick = (data)=>{
    let keyType=["Processing","Confirmed","Shipped","Out For Delivery","Cancelled"]
    if(data){
      if(keyType.includes(data.name)){
        if(data.name==="Cancelled"){
          navigate(`/admin/dashboard/cancleorder?key=${data.name}`)
        }else{
          navigate(`/admin/dashboard/orders?key=${data.name}`)
        }
      }
    }
  }
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="99%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar className=" cursor-pointer"
            dataKey="total"
            stackId="a"
            fill="#8884d8"
            onClick={handleChartClick}
          />
        </BarChart>
      </ResponsiveContainer>
      <h1
        className="w-full text-center text-2xl underline mt-4"
        style={{ color: "#8884d8" }}
      >
        Total Order: {totalData}
      </h1>
    </div>
  );
};

export default OrdersChart;
