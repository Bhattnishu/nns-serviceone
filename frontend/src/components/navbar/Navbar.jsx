import "./Navbar.css"
import React from 'react'

const Navbar = () => {
  return (  
    <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-brand">
                ServiceOne
            </div>
            <div className="navbar-links">
                <a href="/">Home</a>
                <a href="/">Find Services</a>
                <a href="/">My Bookings</a>
            </div>
            <div className="navbar-actions">
                <button className="login-btn">
                    LogIn
                </button>
                <button className="signup-btn">
                    Get Started
                </button>
            </div>

        </div>
    </nav>
  )
}

export default Navbar
