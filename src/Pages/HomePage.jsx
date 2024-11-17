import React from 'react'
import MainHomePage from '../Components/MainHomePage/MainHomePage'
import HomeFooter from '../Components/HomeFooter'
import Footer from '../Components/Footer'
import Navbars from '../Components/Navbars'

export default function HomePage() {
  return (
    <div className="home">
      <Navbars />
      <MainHomePage />
      <HomeFooter />
      <Footer />
    </div>
  )
}
