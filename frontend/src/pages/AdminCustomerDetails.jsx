
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminCustomerDetails() {
    const { id } = useParams();
    const { getToken } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCustomer() {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/customers/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    }
                );

                setData(response.data);
            } catch (error) {
                console.error(
                    "Load customer error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load customer."
                );
            } finally {
                setLoading(false);
            }
        }

        loadCustomer();
    }, [id, getToken]);

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

    function getStatusClass(status) {
        return status
            .toLowerCase()
            .replaceAll(" ", "-");
    }

    function getStatusLabel(status) {
        switch (status) {
            case "out-for-delivery":
                return "Out for Delivery";

            default:
                return (
                    status.charAt(0).toUpperCase() +
                    status.slice(1)
                );
        }
    }

    if (loading) {
        return (
            <main className="admin-page wrapper">
                <div className="admin-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading customer...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-page wrapper">
                <div className="admin-error">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </div>

                <Link
                    to="/admin/customers"
                    className="admin-back-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Customers
                </Link>
            </main>
        );
    }

    const customer = data.customer;
    const orders = data.orders || [];

    return (
        <main className="admin-page wrapper">

            <div className="admin-order-details-header">

                <div>
                    <p className="section-subtitle">
                        Customer Details
                    </p>

                    <h1>
                        {customer.name}
                    </h1>

                    <p>
                        View customer information and
                        complete order history.
                    </p>
                </div>

                <Link
                    to="/admin/customers"
                    className="admin-back-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Customers
                </Link>

            </div>

            <div className="admin-customer-profile-card">

                <div className="admin-customer-large-avatar">
                    <i className="fa-solid fa-user"></i>
                </div>

                <div className="admin-customer-profile-info">

                    <h2>
                        {customer.name}
                    </h2>

                    <p>
                        <i className="fa-solid fa-envelope"></i>
                        {customer.email}
                    </p>

                    <span>
                        <i className="fa-regular fa-calendar"></i>
                        Customer since{" "}
                        {formatDate(
                            customer.createdAt
                        )}
                    </span>

                </div>

                <div className="admin-customer-profile-stats">

                    <div>
                        <strong>
                            {data.orderCount}
                        </strong>

                        <span>
                            Total Orders
                        </span>
                    </div>

                    <div>
                        <strong>
                            ₹
                            {Number(
                                data.totalSpent
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

            <div className="admin-section-title">
                <div>
                    <p className="section-subtitle">
                        Purchase History
                    </p>

                    <h2>
                        Customer <span>Orders</span>
                    </h2>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="admin-empty">
                    <i className="fa-solid fa-bag-shopping"></i>

                    <h2>
                        No Orders
                    </h2>

                    <p>
                        This customer has not placed any
                        orders yet.
                    </p>
                </div>
            ) : (
                <div className="admin-customer-orders">

                    {orders.map((order) => (
                        <article
                            className="admin-customer-order-card"
                            key={order._id}
                        >

                            <div className="admin-customer-order-top">

                                <div>
                                    <span>
                                        Order ID
                                    </span>

                                    <strong>
                                        #
                                        {order._id
                                            .slice(-8)
                                            .toUpperCase()}
                                    </strong>
                                </div>

                                <div
                                    className={`order-status ${getStatusClass(
                                        order.orderStatus
                                    )}`}
                                >
                                    {getStatusLabel(
                                        order.orderStatus
                                    )}
                                </div>

                            </div>

                            <div className="admin-customer-order-date">
                                <i className="fa-regular fa-calendar"></i>

                                {formatDate(
                                    order.createdAt
                                )}
                            </div>

                            <div className="admin-customer-order-items">

                                {order.items.map(
                                    (item, index) => (
                                        <div
                                            className="admin-customer-order-item"
                                            key={`${order._id}-${index}`}
                                        >

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />

                                            <div>
                                                <h3>
                                                    {item.name}
                                                </h3>

                                                <p>
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}{" "}
                                                    ×{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <strong>
                                                ₹
                                                {(
                                                    Number(
                                                        item.price
                                                    ) *
                                                    Number(
                                                        item.quantity
                                                    )
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>
                                    )
                                )}

                            </div>

                            <div className="admin-customer-order-bottom">

                                <div>
                                    <span>
                                        Payment
                                    </span>

                                    <strong>
                                        {order.paymentMethod ===
                                        "cod"
                                            ? "Cash on Delivery"
                                            : "Online Payment"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </article>
                    ))}

                </div>
            )}

            <Link
                to="/admin"
                className="admin-home-button"
            >
                <i className="fa-solid fa-house"></i>
                Admin Home
            </Link>

        </main>
    );
}

export default AdminCustomerDetails;

