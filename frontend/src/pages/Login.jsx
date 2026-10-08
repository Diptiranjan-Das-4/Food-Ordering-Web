
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                formData
            );

            const {
                token,
                user
            } = response.data;

            login(token, user);

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card">

                <Link
                    to="/"
                    className="auth-logo"
                >
                    Foodie.
                </Link>

                <div className="section-heading auth-heading">
                    <p className="section-subtitle">
                        Welcome Back
                    </p>

                    <h2>
                        Sign <span>In</span>
                    </h2>

                    <p>
                        Login to continue ordering
                        delicious food.
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

                        <label htmlFor="email">
                            Email
                        </label>

                        <div className="auth-input">
                            <i className="fa-solid fa-envelope"></i>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="auth-input">
                            <i className="fa-solid fa-lock"></i>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
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
                            ? "Signing in..."
                            : "Sign In"}

                        {!loading && (
                            <i className="fa-solid fa-arrow-right"></i>
                        )}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create account
                    </Link>
                </p>

            </div>

        </main>
    );
}

export default Login;

