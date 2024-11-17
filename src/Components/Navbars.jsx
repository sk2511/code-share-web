import React, { useState } from 'react'
import Logo from '../images/logo.svg'
import { FaBars, FaTimes } from 'react-icons/fa'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'

export default function Navbars() {
  const [bars, setBars] = useState(false)

  return (
    <>
      <div className="nav_bar mr-b box_shadow">
        <Navbar fixed="top" bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand href="#">
              <img src={Logo} className="header__logo" alt="" />
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="navbarScroll"
              className="menu-icon"
              onClick={() => setBars(!bars)}
            >
              {!bars ? <FaBars /> : <FaTimes />}
            </Navbar.Toggle>
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0">
                <Nav.Link href="#action1">Hire an Expert</Nav.Link>
                <Nav.Link href="#action2">Log In</Nav.Link>
                <Nav.Link href="#action2">Sign Up</Nav.Link>
              </Nav>

              <div className="navlink">
                <div className="user_btn user">
                  <Link to="/">Hire an Expert</Link>
                </div>
                <div className="divider_li user"></div>
                <div className="user">
                  <Link to="/login" className="login_btn">
                    Log In
                  </Link>
                </div>
                <div className="user1">
                  <Link to="/signup" className="signup_btn">
                    Sign Up
                  </Link>
                </div>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  )
}
