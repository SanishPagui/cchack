import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './components/About'
import Home from './components/Home'
import Spline from '@splinetool/react-spline/next'

const Page = () => {
  return (
    <div>
      <Navbar />
      <Home />

      <div className="w-screen h-screen z-10 ">
        <Spline
          scene="https://prod.spline.design/hPgUWe7J7bq53w58/scene.splinecode"
          className="w-full h-full"
        />

        {/* cover the watermark */}
        <div className="absolute bottom-0 w-full h-10 bg-black z-20 "></div>
      </div>
      <About />
      <Footer />
    </div>
  )
}

export default Page
