
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function MyOrders() {
    const { getToken, isLoggedIn } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${API_URL}/api/orders/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    }
                );

                setOrders(response.data);
            } catch (error) {
                console.error(
                    "Load orders error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load your orders."
                );
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, [getToken, isLoggedIn]);

    function getStatusClass(status) {
        return status
            .toLowerCase()
            .replaceAll(" ", "-");
    }

    function getStatusIcon(status) {
        switch (status) {
            case "pending":
                return "fa-clock";

            case "confirmed":
                return "fa-circle-check";

            case "preparing":
                return "fa-kitchen-set";

            case "out-for-delivery":
                return "fa-motorcycle";

            case "delivered":
                return "fa-house-circle-check";

            case "cancelled":
                return "fa-circle-xmark";

            default:
                return "fa-clock";
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case "out-for-delivery":
                return "Out for Delivery";

            default:
                return status.charAt(0).toUpperCase() +
                    status.slice(1);
        }
    }

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

    if (!isLoggedIn) {
        return (
            <main className="orders-page wrapper">
                <div className="orders-empty">
                    <i className="fa-solid fa-user-lock"></i>

                    <h2>
                        Login Required
                    </h2>

                    <p>
                        Please login to view your orders.
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

    if (loading) {
        return (
            <main className="orders-page wrapper">
                <div className="orders-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>

                    <p>
                        Loading your orders...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="orders-page wrapper">

            <Link
                to="/profile"
                className="back-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Profile
            </Link>

            <div className="section-heading">
                <p className="section-subtitle">
                    Order History
                </p>

                <h1>
                    My <span>Orders</span>
                </h1>

                <p>
                    Track your orders and see their current delivery status.
                </p>
            </div>

            {error && (
                <div className="orders-error">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </div>
            )}

            {!error && orders.length === 0 && (
                <div className="orders-empty">
                    <i className="fa-solid fa-bag-shopping"></i>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <Link
                        to="/menu"
                        className="btn"
                    >
                        Browse Menu
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            )}

            <div className="orders-list">

                {orders.map((order) => {

                    const statusClass =
                        getStatusClass(
                            order.orderStatus
                        );

                    return (
                        <article
                            className="order-card"
                            key={order._id}
                        >

                            <div className="order-card-top">

                                <div>
                                    <span className="order-label">
                                        Order ID
                                    </span>

                                    <strong className="order-id">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </strong>
                                </div>

                                <div className={`order-status ${statusClass}`}>
                                    <i
                                        className={`fa-solid ${getStatusIcon(
                                            order.orderStatus
                                        )}`}
                                    ></i>

                                    {getStatusLabel(
                                        order.orderStatus
                                    )}
                                </div>

                            </div>

                            <div className="order-date">
                                <i className="fa-regular fa-calendar"></i>

                                Ordered on{" "}
                                {formatDate(
                                    order.createdAt
                                )}
                            </div>

                            <div className="order-items">

                                {order.items.map(
                                    (item, index) => (
                                        <div
                                            className="order-item"
                                            key={`${order._id}-${index}`}
                                        >

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />

                                            <div className="order-item-info">
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

                            <div className="order-card-bottom">

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

                                    <strong className="order-total">
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                            </div>

                            <div className="order-tracking">

                                <h3>
                                    <i className="fa-solid fa-location-dot"></i>
                                    Delivery Tracking
                                </h3>

                                {order.orderStatus ===
                                "cancelled" ? (
                                    <div className="tracking-cancelled">
                                        <i className="fa-solid fa-circle-xmark"></i>

                                        <span>
                                            This order has been cancelled.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="tracking-progress">

                                        <div
                                            className={`tracking-step ${
                                                [
                                                    "confirmed",
                                                    "preparing",
                                                    "out-for-delivery",
                                                    "delivered"
                                                ].includes(
                                                    order.orderStatus
                                                )
                                                    ? "completed"
                                                    : ""
                                            }`}
                                        >
                                            <span>
                                                <i className="fa-solid fa-circle-check"></i>
                                            </span>

                                            <small>
                                                Confirmed
                                            </small>
                                        </div>

                                        <div
                                            className={`tracking-step ${
                                                [
                                                    "preparing",
                                                    "out-for-delivery",
                                                    "delivered"
                                                ].includes(
                                                    order.orderStatus
                                                )
                                                    ? "completed"
                                                    : ""
                                            }`}
                                        >
                                            <span>
                                                <i className="fa-solid fa-kitchen-set"></i>
                                            </span>

                                            <small>
                                                Preparing
                                            </small>
                                        </div>

                                        <div
                                            className={`tracking-step ${
                                                [
                                                    "out-for-delivery",
                                                    "delivered"
                                                ].includes(
                                                    order.orderStatus
                                                )
                                                    ? "completed"
                                                    : ""
                                            }`}
                                        >
                                            <span>
                                                <i className="fa-solid fa-motorcycle"></i>
                                            </span>

                                            <small>
                                                Out for Delivery
                                            </small>
                                        </div>

                                        <div
                                            className={`tracking-step ${
                                                order.orderStatus ===
                                                "delivered"
                                                    ? "completed"
                                                    : ""
                                            }`}
                                        >
                                            <span>
                                                <i className="fa-solid fa-house-circle-check"></i>
                                            </span>

                                            <small>
                                                Delivered
                                            </small>
                                        </div>

                                    </div>
                                )}

                            </div>

                        </article>
                    );
                })}

            </div>

        </main>
    );
}

export default MyOrders;

