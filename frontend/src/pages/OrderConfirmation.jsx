
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderConfirmation() {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        try {
            const savedOrder =
                sessionStorage.getItem(
                    "foodie-last-order"
                );

            if (savedOrder) {
                setOrder(JSON.parse(savedOrder));
            }
        } catch (error) {
            console.error(
                "Order confirmation error:",
                error
            );
        }
    }, []);

    return (
        <main className="confirmation-page wrapper">
            <div className="confirmation-card">

                <div className="confirmation-icon">
                    <i className="fa-solid fa-check"></i>
                </div>

                <p className="section-subtitle">
                    Order Successful
                </p>

                <h1>
                    Thank You for <span>Ordering!</span>
                </h1>

                <p className="confirmation-message">
                    Your order has been placed successfully.
                    We are preparing your delicious food.
                </p>

                {order && (
                    <div className="confirmation-order-info">

                        <div>
                            <span>Order ID</span>
                            <strong>
                                #
                                {order._id
                                    ?.slice(-8)
                                    .toUpperCase()}
                            </strong>
                        </div>

                        <div>
                            <span>Payment</span>
                            <strong>
                                {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : "Online Payment"}
                            </strong>
                        </div>

                        <div>
                            <span>Total</span>
                            <strong>
                                ₹
                                {Number(
                                    order.totalAmount
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>

                    </div>
                )}

                <div className="confirmation-status">

                    <div className="confirmation-status-icon">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div>
                        <strong>
                            Order Status: Pending
                        </strong>

                        <p>
                            Your restaurant will confirm the
                            order shortly.
                        </p>
                    </div>

                </div>

                <div className="confirmation-actions">

                    <Link
                        to="/my-orders"
                        className="btn"
                    >
                        Track My Order
                        <i className="fa-solid fa-location-dot"></i>
                    </Link>

                    <Link
                        to="/menu"
                        className="confirmation-secondary-btn"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>
        </main>
    );
}

export default OrderConfirmation;

