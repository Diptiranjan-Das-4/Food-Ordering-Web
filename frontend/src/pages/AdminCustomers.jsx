
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminCustomers() {
    const { getToken } = useAuth();

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadCustomers() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/customers",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setCustomers(response.data);
        } catch (error) {
            console.error(
                "Load customers error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load customers."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCustomers();
    }, []);

    function formatDate(date) {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }

    return (
        <main className="admin-page wrapper">

            <div className="admin-page-header">

                <div>
                    <p className="section-subtitle">
                        Customer Management
                    </p>

                    <h1>
                        All <span>Customers</span>
                    </h1>

                    <p>
                        View registered customers and their
                        order activity.
                    </p>
                </div>

                <button
                    className="admin-refresh-button"
                    onClick={loadCustomers}
                >
                    <i className="fa-solid fa-rotate"></i>
                    Refresh
                </button>

            </div>

            <Link
                to="/admin"
                className="admin-home-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Admin Home
            </Link>

            {error && (
                <div className="admin-error">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </div>
            )}

            {loading ? (
                <div className="admin-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading customers...</p>
                </div>
            ) : customers.length === 0 ? (
                <div className="admin-empty">
                    <i className="fa-solid fa-users"></i>

                    <h2>
                        No Customers Found
                    </h2>

                    <p>
                        No customer accounts have been
                        registered yet.
                    </p>
                </div>
            ) : (
                <div className="admin-customers-list">

                    {customers.map((customer) => (
                        <article
                            className="admin-customer-card"
                            key={customer._id}
                        >

                            <div className="admin-customer-main">

                                <div className="admin-customer-avatar">
                                    <i className="fa-solid fa-user"></i>
                                </div>

                                <div className="admin-customer-info">
                                    <h2>
                                        {customer.name}
                                    </h2>

                                    <p>
                                        <i className="fa-solid fa-envelope"></i>
                                        {customer.email}
                                    </p>

                                    <span>
                                        Customer since{" "}
                                        {formatDate(
                                            customer.createdAt
                                        )}
                                    </span>
                                </div>

                            </div>

                            <div className="admin-customer-stats">

                                <div className="admin-customer-stat">
                                    <i className="fa-solid fa-bag-shopping"></i>

                                    <div>
                                        <strong>
                                            {customer.orderCount}
                                        </strong>

                                        <span>
                                            Orders
                                        </span>
                                    </div>
                                </div>

                                <div className="admin-customer-stat">
                                    <i className="fa-solid fa-indian-rupee-sign"></i>

                                    <div>
                                        <strong>
                                            ₹
                                            {Number(
                                                customer.totalSpent
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <span>
                                            Total Spent
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <Link
                                to={`/admin/customers/${customer._id}`}
                                className="admin-view-customer-button"
                            >
                                View Customer
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>

                        </article>
                    ))}

                </div>
            )}

        </main>
    );
}

export default AdminCustomers;

