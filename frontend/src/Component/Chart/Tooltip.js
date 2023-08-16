function CustomTooltip({ payload, label, active }) {
    if (active && payload) {
      return (
        <div className="custom-tooltip bg-white px-2 py-1 rounded-xl" style={{color:payload[0].stroke,border:`1.5px solid ${payload[0].stroke}`}}>
          <p className="label">{`${payload[0].dataKey}`} : &#8377;  {`${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
  }

export default CustomTooltip;