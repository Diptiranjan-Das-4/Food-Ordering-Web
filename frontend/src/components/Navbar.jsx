
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { cartItemCount } = useCart();
    const { user, isLoggedIn } = useAuth();

    const [showLoginPopup, setShowLoginPopup] =
        useState(false);

    return (
        <header>
            <nav className="navbar flex between wrapper">

                <Link to="/" className="logo">
                    Foodie.
                </Link>

                <ul className="navlist flex gap-3">
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to="/menu">Menu</Link>
                    </li>

                    <li>
                        <a href="#">Service</a>
                    </li>

                    <li>
                        <a href="#">About us</a>
                    </li>

                    <li>
                        <a href="#">Contacts</a>
                    </li>
                </ul>

                <div className="desktop-action flex gap-2">

                    <Link
                        to="/cart"
                        className="cart-icon"
                    >
                        <i className="fa-solid fa-bag-shopping"></i>

                        <span className="cart-value">
                            {cartItemCount}
                        </span>
                    </Link>

                    {isLoggedIn ? (
                        user?.role === "admin" ? (
                            <Link
                                to="/admin"
                                className="btn"
                            >
                                <i className="fa-solid fa-shield-halved"></i>
                                Admin
                            </Link>
                        ) : (
                            <Link
                                to="/profile"
                                className="btn"
                            >
                                <i className="fa-solid fa-user"></i>
                                Profile
                            </Link>
                        )
                    ) : (
                        <div className="login-popup-wrapper">

                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    setShowLoginPopup(
                                        !showLoginPopup
                                    )
                                }
                            >
                                Sign In
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>

                            {showLoginPopup && (
                                <div className="login-popup">

                                    <div className="login-popup-heading">
                                        <h3>
                                            Sign In
                                        </h3>

                                        <p>
                                            Choose how you want to login
                                        </p>
                                    </div>

                                    <Link
                                        to="/login"
                                        className="login-option"
                                        onClick={() =>
                                            setShowLoginPopup(
                                                false
                                            )
                                        }
                                    >
                                        <span className="login-option-icon">
                                            <i className="fa-solid fa-user"></i>
                                        </span>

                                        <span className="login-option-text">
                                            <strong>
                                                User Login
                                            </strong>

                                            <small>
                                                Login as a customer
                                            </small>
                                        </span>

                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>

                                    <Link
                                        to="/admin-login"
                                        className="login-option"
                                        onClick={() =>
                                            setShowLoginPopup(
                                                false
                                            )
                                        }
                                    >
                                        <span className="login-option-icon">
                                            <i className="fa-solid fa-shield-halved"></i>
                                        </span>

                                        <span className="login-option-text">
                                            <strong>
                                                Admin Login
                                            </strong>

                                            <small>
                                                Login to admin panel
                                            </small>
                                        </span>

                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>

                                </div>
                            )}

                        </div>
                    )}

                    <a
                        href="#"
                        className="hamburger"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </a>

                </div>

            </nav>
        </header>
    );
}

export default Navbar;

