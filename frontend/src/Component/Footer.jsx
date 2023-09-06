import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { FaInstagram,FaDiscord,FaLinkedin,FaGithub,FaHome,FaRegAddressBook,FaPhoneAlt ,FaBoxOpen,FaShoppingCart,FaShoppingBag} from "react-icons/fa";

const Footer = () => {
  const path = useSelector((state)=>(state.location))
  const setting = useSelector((state)=>(state.setting))

  return (
    <div className={` ${(path==='/products' || path.includes('/admin'))?'hidden':'flex'} bg-gray-300 items-center justify-around py-5 flex-wrap`}>
      <div className='hidden lg:block'><Link to="/"><h1 className="mx-3 text-5xl font-serif text-main-800 ml-2 ">Zevon</h1></Link></div>
      <div className='hidden lg:block mt-0 mx-3' style={{width:'260px'}}>
        <h1 className='text-3xl border-b-4 p-2 border-black font-bold mb-3'>Pages</h1>
        <ul className=' px-3 h-32'>
          <li><Link to='/' className='flex items-center pt-1'><FaHome className='mr-2'/>Home</Link></li>
          <li><Link to='/products' className='flex items-center pt-1'><FaBoxOpen className='mr-2'/>Product</Link></li>
          <li><Link to='/cart' className='flex items-center pt-1'><FaShoppingCart className='mr-2'/>Cart</Link></li>
          <li><Link to='/orders' className='flex items-center pt-1'><FaShoppingBag className='mr-2'/>Order</Link></li>
        </ul>
      </div>
      <div className='mx-3' style={{width:'260px'}}>
        <h1 className='text-xl sm:text-3xl border-b-2 sm:border-b-4 p-2 border-black font-bold mb-3'>Contact Us</h1>
       <ul className='px-1 h-32'>
        <li ><Link className='p-1'><span><FaRegAddressBook className='m-2 inline-flex items-center'/>Email:</span>{setting.email}</Link></li>
        <li><Link className='p-1'><span><FaPhoneAlt className='m-2 inline-flex items-center'/>Phone :</span> {setting.phoneNo}</Link></li>
       <li className='p-1'><span><FaHome className='m-2 inline-flex items-center'/>Office:</span> {setting.office}</li>
       </ul>
      </div>
      <div className='mx-3' style={{width:'260px'}}>
        <h1 className='text-xl sm:text-3xl border-b-2 sm:border-b-4 p-2 border-black font-bold mb-3'>Follow Us</h1>
        <ul className='px-3 flex items-center justify-between h-32'>
          <li className='text-2xl sm:text-3xl'><Link target='_blank' to={setting.instaLink}><FaInstagram/></Link></li>
          <li className='text-2xl sm:text-3xl'><Link target='_blank' to={setting.linkedInLink}><FaLinkedin/></Link></li>
          <li className='text-2xl sm:text-3xl'><Link target='_blank' to={setting.discordLink}><FaDiscord/></Link></li>
          <li className='text-2xl sm:text-3xl'><Link target='_blank' to={setting.githubLink}><FaGithub/></Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
