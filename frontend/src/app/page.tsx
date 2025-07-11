import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'

const page = () => {
  return (
    <div>
      <Navbar />
      <Home/>
      {/* <Footer /> */}
    </div>
  )
}

export default page