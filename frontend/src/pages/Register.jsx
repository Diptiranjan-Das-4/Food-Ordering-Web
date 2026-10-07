import { useState } from "react";
import {
Link,
useNavigate
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function Register() {
const navigate = useNavigate();
const { login } = useAuth();


const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (
        formData.password !==
        formData.confirmPassword
    ) {
        setError(
            "Passwords do not match."
        );

        return;
    }

    if (formData.password.length < 6) {
        setError(
            "Password must be at least 6 characters."
        );

        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(
            `${API_URL}/api/auth/register`,
            {
                name: formData.name,
                email: formData.email,
                password: formData.password
            }
        );

        login(
            response.data.token,
            response.data.user
        );

        navigate("/");
    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
}

return (
    <main className="auth-page">

        <div className="auth-container">

            <Link
                to="/"
                className="auth-logo"
            >
                Foodie<span>.</span>
            </Link>

            <div className="auth-card">

                <div className="auth-heading">

                    <p className="section-subtitle">
                        Welcome to Foodie
                    </p>

                    <h1>
                        Create <span>Account</span>
                    </h1>

                    <p>
                        Create your account and
                        start ordering delicious food.
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

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <div className="auth-input">

                            <i className="fa-solid fa-user"></i>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="auth-input">

                            <i className="fa-solid fa-envelope"></i>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
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

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="auth-input">

                            <i className="fa-solid fa-lock"></i>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="At least 6 characters"
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

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="auth-input">

                            <i className="fa-solid fa-lock"></i>

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={
                                    formData.confirmPassword
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
                            ? "Creating Account..."
                            : "Create Account"}

                        {!loading && (
                            <i className="fa-solid fa-arrow-right"></i>
                        )}
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>

            </div>

        </div>

    </main>
);


}

export default Register;
