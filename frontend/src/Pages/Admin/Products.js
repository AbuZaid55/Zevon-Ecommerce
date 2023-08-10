import React ,{useEffect,useState} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { FaTrash,FaEdit,FaPlusSquare } from "react-icons/fa";
import Aside from './Aside'


const Products = (props) => {
  const navigate = useNavigate()
  const [itemOnPerPage,setItemOnPerPage]=useState(20)

  const handleItemPerPage = (e)=>{
    if(e.target.value>100){
      setItemOnPerPage(100)
    }else{
      setItemOnPerPage(e.target.value)
    }
  }

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
      <div className='products' id='main'>
        <h1>Products</h1>
        <p className='add'><Link to='/admin/dashboard/addproduct'><button><FaPlusSquare className='mr-3'/>Add Products</button></Link></p>
        <div>
          <input className='search' type="search" placeholder='Search Products' />
          <label  className='noPageLabel'><input className='noPage' value={itemOnPerPage} onChange={((e)=>{handleItemPerPage(e)})} type="number" max={100} />Per Page</label>
          <table>

            <thead>
              <tr>
                <th>Thumbnail</th>
                <th className='name'>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
                <tr>
                  <td><img height={'100%'} width={'100%'} src="/Images/contact.jpg" alt="Pic" /></td>
                  <td className='name'><Link>Maera adsfasd asdfsad fasdfasd asdfsdaf asfsda asdf</Link></td>
                  <td>220</td>
                  <td>&#8377; 20000</td>
                  <td>3.4</td>
                  <td><FaEdit className='icon edit'/></td>
                  <td><FaTrash className='icon delete'/></td>
                </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default Products
