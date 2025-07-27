import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'
import Footer from '../../Pages/Home/Footer'

const Layout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout