
import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

function AdminOrderDetails() {
    const { id } = useParams();
    const { getToken } = useAuth();

    const [order, setOrder] = useState(null);
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
        fetchOrder();
    }, [id]);

    async function fetchOrder() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `http://localhost:5000/api/orders/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setOrder(response.data);
        } catch (error) {
            console.error(
                "Get order details error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load order."
            );
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(status) {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/orders/${id}/status`,
                {
                    orderStatus: status
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setOrder(response.data.order);
        } catch (error) {
            console.error(
                "Update order status error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order status."
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
                month: "long",
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
                    <p>Loading order details...</p>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="admin-page wrapper">

                <div className="admin-error">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error || "Order not found."}
                </div>

                <Link
                    to="/admin/orders"
                    className="admin-view-order-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Orders
                </Link>

            </main>
        );
    }

    return (
        <main className="admin-page wrapper">

            <Link
                to="/admin/orders"
                className="admin-back-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Orders
            </Link>

            <div className="admin-page-header admin-order-details-header">

                <div>
                    <p className="section-subtitle">
                        Order Details
                    </p>

                    <h1>
                        Order #
                        {order._id
                            .slice(-8)
                            .toUpperCase()}
                    </h1>

                    <p>
                        Placed on{" "}
                        {formatDate(order.createdAt)}
                    </p>
                </div>

                <div className="admin-order-detail-status">

                    <label htmlFor="order-status">
                        Update Status
                    </label>

                    <select
                        id="order-status"
                        value={order.orderStatus}
                        onChange={(event) =>
                            updateOrderStatus(
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

            <div className="admin-detail-grid">

                <section className="admin-detail-card">

                    <div className="admin-detail-card-heading">
                        <i className="fa-solid fa-user"></i>

                        <div>
                            <h2>
                                Customer Information
                            </h2>

                            <p>
                                Customer details
                            </p>
                        </div>
                    </div>

                    <div className="admin-detail-info">

                        <div>
                            <span>Name</span>
                            <strong>
                                {order.customer?.name ||
                                    order.deliveryAddress?.fullName ||
                                    "N/A"}
                            </strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>
                                {order.customer?.email ||
                                    "N/A"}
                            </strong>
                        </div>

                        <div>
                            <span>Mobile</span>
                            <strong>
                                {order.deliveryAddress?.phone ||
                                    "N/A"}
                            </strong>
                        </div>

                    </div>

                </section>


                <section className="admin-detail-card">

                    <div className="admin-detail-card-heading">
                        <i className="fa-solid fa-location-dot"></i>

                        <div>
                            <h2>
                                Delivery Address
                            </h2>

                            <p>
                                Customer delivery location
                            </p>
                        </div>
                    </div>

                    <div className="admin-address-box">

                        <strong>
                            {order.deliveryAddress?.fullName ||
                                "N/A"}
                        </strong>

                        <p>
                            {order.deliveryAddress?.address ||
                                "N/A"}
                        </p>

                        <p>
                            {order.deliveryAddress?.city ||
                                ""}{" "}
                            {order.deliveryAddress?.pincode ||
                                ""}
                        </p>

                        <p>
                            <i className="fa-solid fa-phone"></i>{" "}
                            {order.deliveryAddress?.phone ||
                                "N/A"}
                        </p>

                    </div>

                </section>

            </div>


            <section className="admin-detail-card admin-items-detail-card">

                <div className="admin-detail-card-heading">

                    <i className="fa-solid fa-basket-shopping"></i>

                    <div>
                        <h2>
                            Ordered Items
                        </h2>

                        <p>
                            Food items in this order
                        </p>
                    </div>

                </div>

                <div className="admin-detail-items">

                    {order.items?.map(
                        (item, index) => (
                            <div
                                className="admin-detail-item"
                                key={`${item.food || "food"}-${index}`}
                            >

                                <div className="admin-detail-item-left">

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

            </section>


            <div className="admin-detail-bottom-grid">

                <section className="admin-detail-card">

                    <div className="admin-detail-card-heading">

                        <i className="fa-solid fa-credit-card"></i>

                        <div>
                            <h2>
                                Payment
                            </h2>

                            <p>
                                Payment information
                            </p>
                        </div>

                    </div>

                    <div className="admin-detail-info">

                        <div>
                            <span>Method</span>

                            <strong>
                                {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : "Online Payment"}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>

                            <strong>
                                {formatStatus(
                                    order.paymentStatus
                                )}
                            </strong>
                        </div>

                    </div>

                </section>


                <section className="admin-detail-card admin-total-card">

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

                </section>

            </div>


            <div className="admin-detail-footer">

                <Link
                    to="/admin/orders"
                    className="admin-back-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Orders
                </Link>

            </div>

        </main>
    );
}

export default AdminOrderDetails;

