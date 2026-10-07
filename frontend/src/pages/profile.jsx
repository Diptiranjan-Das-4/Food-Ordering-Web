
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();

    function handleLogout() {
        logout();
        navigate("/");
    }

    if (!user) {
        return (
            <main className="profile-page wrapper">
                <div className="profile-empty">
                    <i className="fa-solid fa-user-lock"></i>

                    <h2>
                        Please login first
                    </h2>

                    <p>
                        You need to login to view your profile.
                    </p>

                    <Link
                        to="/login"
                        className="btn"
                    >
                        Login
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page wrapper">

            <Link
                to="/"
                className="back-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Home
            </Link>

            <div className="section-heading">
                <p className="section-subtitle">
                    My Account
                </p>

                <h1>
                    My <span>Profile</span>
                </h1>

                <p>
                    Manage your account and track your orders.
                </p>
            </div>

            <div className="profile-layout">

                <div className="profile-card">

                    <div className="profile-avatar">
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <h2>
                        {user.name}
                    </h2>

                    <p className="profile-email">
                        {user.email}
                    </p>

                    <span className="profile-role">
                        Customer
                    </span>

                    <div className="profile-info">

                        <div className="profile-info-item">
                            <i className="fa-solid fa-user"></i>

                            <div>
                                <small>
                                    Full Name
                                </small>

                                <strong>
                                    {user.name}
                                </strong>
                            </div>
                        </div>

                        <div className="profile-info-item">
                            <i className="fa-solid fa-envelope"></i>

                            <div>
                                <small>
                                    Email Address
                                </small>

                                <strong>
                                    {user.email}
                                </strong>
                            </div>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="profile-logout"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </button>

                </div>

                <div className="profile-actions">

                    <Link
                        to="/my-orders"
                        className="profile-action-card"
                    >
                        <div className="profile-action-icon">
                            <i className="fa-solid fa-bag-shopping"></i>
                        </div>

                        <div>
                            <h3>
                                My Orders
                            </h3>

                            <p>
                                View your orders and track delivery status.
                            </p>
                        </div>

                        <i className="fa-solid fa-chevron-right"></i>
                    </Link>

                    <Link
                        to="/menu"
                        className="profile-action-card"
                    >
                        <div className="profile-action-icon">
                            <i className="fa-solid fa-utensils"></i>
                        </div>

                        <div>
                            <h3>
                                Browse Menu
                            </h3>

                            <p>
                                Explore delicious food and order your favorites.
                            </p>
                        </div>

                        <i className="fa-solid fa-chevron-right"></i>
                    </Link>

                </div>

            </div>

        </main>
    );
}

export default Profile;

