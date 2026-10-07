
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

function AdminOrders() {
    const { getToken } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const orderStatuses = [
        "pending",
        "confirmed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled"
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setOrders(response.data);
        } catch (error) {
            console.error(
                "Get admin orders error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(
        orderId,
        orderStatus
    ) {
        try {
            await axios.put(
                `http://localhost:5000/api/orders/${orderId}/status`,
                {
                    orderStatus
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              orderStatus
                          }
                        : order
                )
            );
        } catch (error) {
            console.error(
                "Update order status error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order."
            );
        }
    }

    function formatStatus(status) {
        return status
            .split("-")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    }

    function formatDate(date) {
        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    if (loading) {
        return (
            <main className="admin-page wrapper">
                <div className="admin-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading orders...</p>
                </div>
            </main>
        );
    }

    return (
        
<main className="admin-page wrapper">

    <Link
        to="/admin"
        className="admin-home-button"
    >
        <i className="fa-solid fa-arrow-left"></i>
          Admin Home
    </Link>

    <div className="admin-page-header">



                <div>
                    <p className="section-subtitle">
                        Order Management
                    </p>

                    <h1>
                        Manage <span>Orders</span>
                    </h1>

                    <p>
                        View customer orders and update
                        their delivery status.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-refresh-button"
                    onClick={fetchOrders}
                >
                    <i className="fa-solid fa-rotate"></i>
                    Refresh
                </button>

            </div>

            {error && (
                <div className="admin-error">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="admin-empty">
                    <i className="fa-solid fa-box-open"></i>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        Customer orders will appear here
                        after they place an order.
                    </p>
                </div>
            ) : (
                <div className="admin-orders-list">

                    {orders.map((order) => (
                        <div
                            className="admin-order-card"
                            key={order._id}
                        >

                            <div className="admin-order-top">

                                <div>
                                    <span className="admin-order-label">
                                        Order ID
                                    </span>

                                    <h2>
                                        #
                                        {order._id
                                            .slice(-8)
                                            .toUpperCase()}
                                    </h2>
                                </div>

                                <div className="admin-order-date">
                                    <i className="fa-regular fa-calendar"></i>
                                    {formatDate(
                                        order.createdAt
                                    )}
                                </div>

                            </div>

                            <div className="admin-order-details">

                                <div className="admin-order-customer">

                                    <div className="admin-order-icon">
                                        <i className="fa-solid fa-user"></i>
                                    </div>

                                    <div>
                                        <span>
                                            Customer
                                        </span>

                                        <strong>
                                            {order.customer?.name ||
                                                "Unknown Customer"}
                                        </strong>

                                        <small>
                                            {order.customer?.email ||
                                                ""}
                                        </small>
                                    </div>

                                </div>

                                <div className="admin-order-customer">

                                    <div className="admin-order-icon">
                                        <i className="fa-solid fa-phone"></i>
                                    </div>

                                    <div>
                                        <span>
                                            Mobile
                                        </span>

                                        <strong>
                                            {order.deliveryAddress?.phone ||
                                                "N/A"}
                                        </strong>
                                    </div>

                                </div>

                                <div className="admin-order-customer">

                                    <div className="admin-order-icon">
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>

                                    <div>
                                        <span>
                                            Delivery Address
                                        </span>

                                        <strong>
                                            {order.deliveryAddress?.address ||
                                                "N/A"}
                                        </strong>

                                        <small>
                                            {order.deliveryAddress?.city ||
                                                ""}{" "}
                                            {order.deliveryAddress?.pincode ||
                                                ""}
                                        </small>
                                    </div>

                                </div>

                            </div>

                            <div className="admin-order-items">

                                <h3>
                                    Ordered Items
                                </h3>

                                {order.items?.map(
                                    (item, index) => (
                                        <div
                                            className="admin-order-item"
                                            key={`${order._id}-${index}`}
                                        >

                                            <div className="admin-order-item-info">

                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                )}

                                                <div>
                                                    <strong>
                                                        {item.name}
                                                    </strong>

                                                    <span>
                                                        ₹
                                                        {Number(
                                                            item.price
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}{" "}
                                                        ×{" "}
                                                        {item.quantity}
                                                    </span>
                                                </div>

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

                            <div className="admin-order-bottom">

                                <div className="admin-order-payment">

                                    <span>
                                        Payment
                                    </span>

                                    <strong>
                                        {order.paymentMethod ===
                                        "cod"
                                            ? "Cash on Delivery"
                                            : "Online Payment"}
                                    </strong>

                                    <small
                                        className={
                                            order.paymentStatus ===
                                            "paid"
                                                ? "payment-paid"
                                                : "payment-pending"
                                        }
                                    >
                                        {formatStatus(
                                            order.paymentStatus
                                        )}
                                    </small>

                                </div>

                                <div className="admin-order-total">

                                    <span>
                                        Total Amount
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

                                <div className="admin-order-status">

                                    <label htmlFor={`status-${order._id}`}>
                                        Order Status
                                    </label>

                                    <select
                                        id={`status-${order._id}`}
                                        value={
                                            order.orderStatus
                                        }
                                        onChange={(event) =>
                                            updateOrderStatus(
                                                order._id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        {orderStatuses.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {formatStatus(
                                                        status
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>

                            </div>

                            <div className="admin-order-actions">

                                <Link
                                    to={`/admin/orders/${order._id}`}
                                    className="admin-view-order-button"
                                >
                                    <i className="fa-solid fa-eye"></i>
                                    View Order
                                </Link>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </main>
    );
}

export default AdminOrders;

