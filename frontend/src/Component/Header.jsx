import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom'
import '../CSS/Header.css'
import axios from "axios";
import { toast } from 'react-toastify'
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { FaSearch, FaTh, FaMapMarkedAlt, FaShoppingBag, FaShoppingCart, FaBoxOpen, FaBars, FaListUl, FaAddressBook, FaUser, FaHome, FaAngleDown, FaAngleUp, FaAngleRight } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useContext } from "react";
import { context } from "../Context/context.js";
import { useLocation } from "react-router-dom";

const Header = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const ref = useRef(null);
  const ref2 = useRef(null);
  const navigate = useNavigate()
  const { setLoader2, getUser } = useContext(context)
  const allProduct = useSelector((state) => (state.product.allProduct))
  const user = useSelector((state) => (state.user))
  const path = useLocation().pathname
  const category = useSelector((state) => (state.product.category))
  const [dropdown1, setDropdown1] = useState(false)
  const [dropdown2, setDropdown2] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [showLogoutform, setShowLogoutform] = useState(false)
  const [search, setSearch] = useState('')
  const [searchItem, setSearchItem] = useState([])
  const [showitem, setShowItem] = useState(false)
  const [userProfile, setUserProfile] = useState('/Images/profile.jpg')

  const handleSearch = () => {
    const key = search.toLowerCase().split(' ')
    const searchItem = allProduct.filter((item) => {
      const name = item.name.toLowerCase()
      const description = item.description.toLowerCase()
      const category = item.category.toLowerCase()
      const subCategory = item.subCategory.toLowerCase()
      let match = []
      key.map((keyPoint) => {
        if (name.includes(keyPoint) || description.includes(keyPoint) || category === keyPoint || subCategory === keyPoint || category === search || subCategory === search) {
          match.push(true)
        } else {
          match.push(false)
        }
      })
      if (!match.includes(false)) {
        return item
      }
    })
    setSearchItem(searchItem)
    setShowItem(true)
  }
  const handleClickOnItem = (_id) => {
    setShowItem(false)
    navigate(`/details?_id=${_id}`)
  }
  const submitSearch = (e) => {
    e.preventDefault()
    setShowItem(false)
    navigate(`/products?search=${search}`)
  }

  const handleClickOutside = (e) => {
    try {
      if (!ref.current.contains(e.target)) {
        setShowItem(false)
      }
      if (!ref2.current.contains(e.target)) {
        setDropdown(false)
      }
    } catch (error) {
    }
  }

  const logout = async () => {
    setLoader2(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true })
      if (res.status === 202) {
        getUser()
        setShowLogoutform(false)
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response.data.massage)
    }
    setLoader2(false)
  }
  useEffect(() => {
    handleSearch()
  }, [search])
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => removeEventListener('click', handleClickOutside)
  }, [])
  useEffect(() => {
    if (user.profile && user.profile.secure_url) {
      setUserProfile(user.profile.secure_url)
    } else {
      setUserProfile('/Images/profile.jpg')
    }
  }, [user])
  return (
    <div id="header" className={` ${(path === '/products') ? 'fixed top-0 left-0 ' : ''} ${(path.includes('/admin')) ? 'hidden' : ''} z-50 w-full bg-white top-0 h-36`}>
      {/* section 1 */}
      <div className="flex items-center justify-between h-20 sm:px-8 px-2 border-b border-main-800">
        <Link to="/"><h1 className=" sm:block text-5xl font-serif text-main-800 ml-2 ">Zevon</h1></Link>
        <form className="sm:flex hidden w-full max-w-3xl relative sm:mx-5" onSubmit={(e) => { submitSearch(e) }}>
          <div className="w-full relative " ref={ref}>
            <input className=" w-full border px-4 py-2 rounded-md text-main-800 border-main-800" value={search} onChange={(e) => { setSearch(e.target.value) }} type="text" placeholder="Search product" />
            <div className={`${(search === '' || showitem === false) ? 'hidden' : ''} absolute top-full z-50 w-full overflow-auto scrollbar-hide shadow-2xl border-x-2 mt-1 rounded-md`}>
              {searchItem.map((item, i) => {
                if (i < 6) {
                  return <span key={i} onClick={() => { handleClickOnItem(item._id) }} className="flex bg-white border-y py-2 px-3 cursor-pointer w-full overflow-hidden whitespace-nowrap hover:bg-hover-50"><img className="mr-3 rounded-sm" src={item.thumbnail.secure_url} style={{ width: '30px', height: '30px' }} alt="" />{item.name}</span>
                }
              })}
            </div>
          </div>
          <button className="absolute right-4 top-1/3 text-main-800"><FaSearch /></button>
        </form>
        <Link to="/login"><button className={`bg-main-800 text-white px-6 py-2 mx-3 rounded-full font-semibold ${(user._id) ? 'hidden' : 'block'}`}>Login</button></Link>
        {/* dropdown1  */}
        <div className={`relative px-3 py-3  cursor-pointer hover:border-b-4 border-main-800 h-20 sm:w-full ${(user._id) ? 'block' : 'hidden'} `} style={{ maxWidth: "12rem", minWidth: '6rem' }} onMouseMove={(e) => { setDropdown1(true) }} onMouseOut={(e) => { setDropdown1(false) }}><span className="flex items-center justify-center sm:mr-4"><img className="rounded-full border-2 border-main-800 mr-2 w-14 h-14" src={userProfile} alt="Profile" /><span className="text-lg text-main-800 hidden sm:block">{user.name}</span></span>
          <ul className={`absolute -left-2 sm:-left-0 w-full border-x-2 mt-3 z-50 bg-white ${(dropdown1) ? 'block' : 'hidden'} `} style={{ minWidth: "110px" }}>
            <li className="px-4 py-2 border-b-2 hover:bg-hover-50"><Link onClick={()=>{setDropdown1(false)}} to="/profile" className="flex items-center justify-left text-main-800"><FaUser className="m-3 hidden sm:block text-main-800" />Profile</Link></li>
            <li className={`${(user.type === "Admin") ? "block" : "hidden"} px-4 py-2 border-b-2 hover:bg-hover-50`}><Link onClick={()=>{setDropdown1(false)}} to="/admin/dashboard" className="flex items-center justify-left text-main-800"><FaTh className="m-3 hidden sm:block text-main-800" />Dashboard</Link></li>
            <li className={`${(user.type === 'Worker') ? "block" : "hidden"} px-4 py-2 border-b-2 hover:bg-hover-50`}><Link onClick={()=>{setDropdown1(false)}} to="/admin/dashboard/changestatus" className="flex items-center justify-left text-main-800"><FaMapMarkedAlt className="m-3 hidden sm:block text-main-800" />Change Status</Link></li>
            <li className="md:hidden px-4 py-2 border-b-2 hover:bg-hover-50"><Link onClick={()=>{setDropdown1(false)}} to="/cart" className="flex items-center justify-left text-main-800"><FaShoppingCart className="m-3 hidden sm:block text-main-800" />Cart</Link></li>
            <li className="md:hidden px-4 py-2 border-b-2 hover:bg-hover-50"><Link onClick={()=>{setDropdown1(false)}} to="/orders" className="flex items-center justify-left text-main-800"><FaShoppingBag className="m-3 hidden sm:block text-main-800" />Order</Link></li>
            <li className="px-4 py-2 border-b-2 hover:bg-hover-50"><span onClick={() => { setShowLogoutform(true) }} className="flex items-center justify-left text-main-800"><FaArrowRightFromBracket className="m-3 hidden sm:block text-main-800" />Log Out</span></li>
          </ul>
        </div>
        {/* dropdown1 end */}
      </div>

      <form className="sm:hidden flex relative px-4 py-2 border-b border-main-800" onSubmit={(e) => { submitSearch(e) }}>
        <div className="w-full relative " ref={ref}>
          <input className=" w-full border px-4 py-2 rounded-md text-main-800 border-main-800" value={search} onChange={(e) => { setSearch(e.target.value) }} type="text" placeholder="Search product" />
          <div className={`${(search === '' || showitem === false) ? 'hidden' : ''} absolute top-full z-50 w-full overflow-auto scrollbar-hide shadow-2xl border-x-2 mt-1 rounded-xl`}>
            {searchItem.map((item, i) => {
              if (i < 6) {
                return <span key={i} onClick={() => { handleClickOnItem(item._id) }} className="flex bg-white border-y py-2 px-3 cursor-pointer w-full overflow-hidden whitespace-nowrap hover:bg-hover-50"><img className="mr-3" src={item.thumbnail.secure_url} style={{ width: '30px', height: '30px' }} alt="" />{item.name}</span>
              }
            })}
          </div>
        </div>
        <button className="absolute right-4 top-1/3 text-main-800 pr-3"><FaSearch /></button>
      </form>
      {/* section2 */}
      <div className="relative sm:static flex flex-col sm:flex-row items-center justify-between lg:px-5 border-b border-main-800" ref={ref2}>
        <div className=" w-full sm:hidden flex item-center justify-end px-4 text-2xl bg-main-800 py-2 text-white" onClick={() => { setDropdown(!dropdown) }}><FaBars className=" cursor-pointer" /></div>
        <ul className={` absolute sm:static top-full sm:flex sm:flex-row w-full bg-main-800 sm:bg-white z-40 ${(dropdown) ? '' : 'hidden'}`} >
          <Link onClick={()=>{setDropdown(false)}} to='/'><li className="flex items-center sm:mx-5 sm:border border-y sm:border-b border-white sm:border-main-800 sm:rounded px-4 py-2 sm:my-2 sm:hover:bg-main-800 hover:text-white text-white sm:text-main-800"><FaHome className="mr-2" />Home</li></Link>
          <Link onClick={()=>{setDropdown(false)}} to='/products'><li className="flex items-center sm:mx-5 sm:border border-b border-white sm:border-main-800 sm:rounded px-4 py-2 sm:my-2 sm:hover:bg-main-800 hover:text-white text-white sm:text-main-800"><FaBoxOpen className="mr-2" />Products</li></Link>
          {/* dropdown2 */}
          <li className={`relative sm:mx-5 sm:border border-b border-white sm:border-main-800 sm:rounded px-4 py-2 sm:my-2 sm:hover:bg-main-800 hover:text-white text-white sm:text-main-800 ${(dropdown2) ? '' : 'overflow-hidden'}`} onMouseMove={(e) => { setDropdown2(true) }} onMouseOut={(e) => { setDropdown2(false) }}><span className="flex items-center cursor-pointer"><FaListUl className="mr-2" />Category{(dropdown2) ? <FaAngleDown className="ml-2" /> : <FaAngleUp className="ml-2" />}</span>

            <ul className={`absolute border-t-2 border-x-2 left-5  sm:-left-1  bg-white z-50 w-[150px] ${(dropdown2) ? 'top-full' : 'bottom-full'}`}>
              {/* dropdown3 */}
              {
                category !== '' && category.map((cat, I) => {
                  let subCategory = []
                  return <li key={I} className={`relative px-3 py-2 border-b text-main-800 hover:bg-hover-50 cursor-pointer`} id="dropdown3" ><span className="flex items-center justify-between">{cat}<FaAngleRight /></span>
                    <ul className="absolute hidden top-0 left-full w-full z-50 bg-white border">
                      {
                        allProduct.map((item, i) => {
                          if (item.category === cat) {
                            if (!subCategory.includes(item.subCategory)) {
                              return <Link key={i} onClick={()=>{setDropdown(false)}} to={`/products?subCategory=${item.subCategory}`}><li className="px-3 py-2 border-b text-main-800 hover:bg-hover-50">{item.subCategory}</li><span className='hidden'>{subCategory.push(item.subCategory)}</span></Link>
                            }
                          }
                        })
                      }
                    </ul>
                  </li>
                })
              }

              {/* dropdown3 end */}
            </ul>
            {/* dropdown2 end */}
          </li>
          <Link onClick={()=>{setDropdown(false)}} to='/contact'><li className="flex items-center sm:mx-5 sm:border  sm:border-main-800 sm:rounded px-4 py-2 sm:my-2 sm:hover:bg-main-800 hover:text-white text-white sm:text-main-800"><FaAddressBook className="mr-2" />Contact</li></Link>
        </ul>
        <div className="hidden md:flex">
          <Link to='/orders' className="border border-main-800 rounded p-2 mx-3 text-main-800 hover:bg-main-800 hover:text-white"><FaShoppingBag /></Link>
          <Link to='/cart' className="border border-main-800 rounded p-2 mx-3 text-main-800 hover:bg-main-800 hover:text-white"><FaShoppingCart /></Link>
        </div>
      </div>

      {/* Logoout Form  */}
      <div className={`${(showLogoutform) ? 'flex' : 'hidden'} fixed top-0 left-0 w-full h-full items-center justify-center z-50`} style={{ backgroundColor: "rgba(128, 128, 128, 0.653)" }}>
        <div className=' w-56 h-56 border p-4 fixed top-1/2 left-1/2 bg-white rounded -translate-x-2/4 -translate-y-2/4 flex items-stretch justify-between flex-col text-xl'>
          <h1 className=' text-main-800 text-center'>Are your sure you want to Log Out?</h1>
          <div className='flex items-center justify-between'>
            <button onClick={() => { logout() }} className=' bg-red-700 text-white px-3 py-2 rounded'>YES</button>
            <button onClick={(() => { setShowLogoutform(false) })} className=' bg-main-800 text-white px-3 py-2 rounded'>NO</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
