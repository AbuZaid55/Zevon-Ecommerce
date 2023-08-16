import React, { useEffect, useState } from 'react'
import { PieChart, Pie,Tooltip, Cell,ResponsiveContainer} from 'recharts';

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
    const [totalData,setTotalData]=useState(0)
    const [data,setData]=useState()
      
useEffect(()=>{
  let data = [{name:"In Stock",value:0,color:'#38bdf8'},{name:"Out Of Stock", value:0,color:'#f472b6'}]
    if(props.allProduct.length!==0){
        let totalData = 0
        const inStockProdcut = props.allProduct.filter((product)=>{
            totalData = totalData+1 
            return product.stock!==0
        })
        data[0].value = inStockProdcut.length
        data[1].value = totalData-inStockProdcut.length
        setData(data)
        setTotalData(totalData)
    }
},[props.allProduct])
  return (
    <div className='w-full h-full'>
        <ResponsiveContainer width="99%" height="80%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={90}
            endAngle={450}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
          >

          {data && data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
            
          </Pie>
          <Tooltip content={<CustomTooltip/>}/>
        </PieChart>
        </ResponsiveContainer>
        <h1 className='w-full text-center text-2xl underline -mt-4' style={{color:"#f472b6"}}>Total Products: {totalData}</h1>
    </div>
  )
}

export default ProductsChart
