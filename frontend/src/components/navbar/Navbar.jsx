
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        navigate("/", { replace: true });
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={closeMenu}
                >
                    <img src="/serviceone-icon.png" alt="ServiceOne" />

                    <span className="brand-wordmark">
                        <span className="brand-service">Service</span>
                        <span className="brand-one">One</span>
                    </span>
                </Link>

                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/services">Find Services</Link>
                    <Link to="/my-bookings">My Bookings</Link>
                </div>

                <div className="navbar-actions">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="login-btn">
                                Login
                            </Link>

                            <Link to="/register" className="signup-btn">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="profile-container">
                            <button
                                type="button"
                                className="profile-btn"
                                aria-label="Open profile menu"
                                aria-expanded={isProfileOpen}
                                onClick={() =>
                                    setIsProfileOpen((previous) => !previous)
                                }
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="23"
                                    height="23"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                </svg>
                            </button>
                           
                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        My Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="menu-btn"
                    aria-label={
                        isMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={isMenuOpen}
                    onClick={() =>
                        setIsMenuOpen((previous) => !previous)
                    }
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                {isMenuOpen && (
                    <div className="mobile-menu">
                        <Link to="/" onClick={closeMenu}>
                            Home
                        </Link>

                        <Link to="/services" onClick={closeMenu}>
                            Find Services
                        </Link>

                        <Link to="/my-bookings" onClick={closeMenu}>
                            My Bookings
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" onClick={closeMenu}>
                                    Login
                                </Link>

                                <Link to="/register" onClick={closeMenu}>
                                    Get Started
                                </Link>
                            </>

                        ) : (
                            <>
                                <Link to="/profile" onClick={closeMenu}>
                                    My Profile
                                </Link>

                                <button
                                    type="button"
                                    className="mobile-logout-btn"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </>
                        )}

                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
