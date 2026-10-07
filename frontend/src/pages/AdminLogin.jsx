
import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function AdminLogin() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email: formData.email,
                    password: formData.password
                }
            );

            const loggedInUser =
                response.data.user;

            if (loggedInUser.role !== "admin") {
                setError(
                    "This account does not have admin access."
                );

                return;
            }

            login(
                response.data.token,
                loggedInUser
            );

            navigate("/admin");

        } catch (error) {
            console.error(
                "Admin login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Admin login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page admin-login-page">

            <div className="auth-container">

                <Link
                    to="/"
                    className="auth-logo"
                >
                    Foodie<span>.</span>
                </Link>

                <div className="auth-card">

                    <div className="admin-login-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>

                    <div className="auth-heading">

                        <p className="section-subtitle">
                            Foodie Administration
                        </p>

                        <h1>
                            Admin <span>Login</span>
                        </h1>

                        <p>
                            Login to manage Foodie orders, foods and customers.
                        </p>

                    </div>

                    {error && (
                        <div className="auth-error">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="admin-email">
                                Admin Email
                            </label>

                            <div className="auth-input">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    id="admin-email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter admin email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="admin-password">
                                Password
                            </label>

                            <div className="auth-input">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    id="admin-password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter admin password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing In..."
                                : "Admin Sign In"}

                            {!loading && (
                                <i className="fa-solid fa-arrow-right"></i>
                            )}
                        </button>

                    </form>

                    <div className="auth-footer">

                        <p>
                            Are you a customer?
                        </p>

                        <Link to="/login">
                            User Login
                        </Link>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default AdminLogin;
