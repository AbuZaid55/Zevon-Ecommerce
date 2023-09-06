import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell ,ResponsiveContainer } from "recharts";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

function CustomTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="custom-tooltip bg-white px-2 py-1 rounded-xl" style={{color:payload[0].payload.color,border:`1.5px solid ${payload[0].payload.color}`}}>
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
}

const ProductsChart = (props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState();
  const [totalData,setTotalData]=useState(0)
  const navigate = useNavigate()

  const getAllUsers = async () => {
    let data = [
      { name: "Admin", value: 0, color: "#00C49F" },
      { name: "Worker", value: 0, color: "#0088FE" },
      { name: "User", value: 0, color: "#FF8042" },
    ]
    props.setLoader2(true);
    try {
      const allUsers = await axios.get(`${BACKEND_URL}/auth/allUser`, { withCredentials: true});
      setTotalData(allUsers.data.data.length)
      allUsers.data.data.filter((user)=>{
        if(user.type==='Admin'){
          data[0].value +=1
        }else if(user.type==='Worker'){
          data[1].value +=1
        }else{
          data[2].value +=1
        }
      })
      setData(data)
    } catch (error) {}
    props.setLoader2(false);
  };

  const handleChartClick = (data)=>{
    if(data){
      if(data.name==="Admin"){
        navigate(`/admin/dashboard/users?key=Admin`)
      }
      if(data.name==='Worker'){
        navigate(`/admin/dashboard/users?key=Worker`)
      }
      if(data.name==='User'){
        navigate(`/admin/dashboard/users?key=User`)
      }
    }
  }
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="99%" height="80%">
      <PieChart>
        <Pie
          className=" cursor-pointer"
          dataKey="value"
          startAngle={90}
          endAngle={450}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          fill="#8884d8"
          paddingAngle={5}
          onClick={handleChartClick}
          >
          {data && data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
            ))}
        </Pie>
        <Tooltip content={<CustomTooltip/>}/>
      </PieChart>
      </ResponsiveContainer>
      <h1 className='w-full text-center text-2xl underline -mt-4' style={{color:"#FF8042"}}>Total User: {totalData}</h1>
    </div>
  );
};

export default ProductsChart;
