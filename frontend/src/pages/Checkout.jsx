
import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function Checkout() {
    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        clearCart
    } = useCart();

    const {
        user,
        getToken,
        isLoggedIn
    } = useAuth();

    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        phone: "",
        address: "",
        city: "",
        pincode: ""
    });

    const [paymentMethod, setPaymentMethod] =
        useState("cod");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

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

    async function createFoodieOrder(
        paymentStatus
    ) {
        const orderItems = cart.map(
            (item) => ({
                food:
                    item._id || item.id,

                name: item.name,

                price: Number(
                    item.price
                ),

                quantity: Number(
                    item.quantity
                ),

                image: item.image
            })
        );

        const response =
            await axios.post(
                `${API_URL}/api/orders`,
                {
                    items: orderItems,

                    deliveryAddress: {
                        fullName:
                            formData.fullName,

                        phone:
                            formData.phone,

                        address:
                            formData.address,

                        city:
                            formData.city,

                        pincode:
                            formData.pincode
                    },

                    totalAmount:
                        Number(cartTotal),

                    paymentMethod:
                        paymentMethod,

                    paymentStatus:
                        paymentStatus
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

        return response.data.order;
    }

    async function handleOnlinePayment() {
        try {
           
const response = await axios.post(
    `${API_URL}/api/payments/create-order`,
    {
        items: cart.map((item) => ({
            food: item._id || item.id,
            quantity: Number(item.quantity)
        }))
    },
    {
        headers: {
            Authorization:
                `Bearer ${getToken()}`
        }
    }
);



            const razorpayOrder = response.data;

            if (
                !window.Razorpay
            ) {
                throw new Error(
                    "Razorpay checkout failed to load. Please refresh the page and try again."
                );
            }

            const options = {
                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,

                amount:
                    razorpayOrder.amount,

                currency:
                    razorpayOrder.currency,

                name: "Foodie",

                description:
                    "Foodie Food Order",

                order_id:
                    razorpayOrder.id,

                prefill: {
                    name:
                        formData.fullName,

                    email:
                        user?.email || "",

                    contact:
                        formData.phone
                },

                theme: {
                    color: "#ff5a36"
                },

                handler:
                    async function (
                        paymentResponse
                    ) {
                        try {
                            const verifyResponse =
                                await axios.post(
                                    `${API_URL}/api/payments/verify`,
                                    {
                                        razorpay_order_id:
                                            paymentResponse.razorpay_order_id,

                                        razorpay_payment_id:
                                            paymentResponse.razorpay_payment_id,

                                        razorpay_signature:
                                            paymentResponse.razorpay_signature
                                    },
                                    {
                                        headers: {
                                            Authorization:
                                                `Bearer ${getToken()}`
                                        }
                                    }
                                );

                            if (
                                !verifyResponse
                                    .data
                                    .success
                            ) {
                                throw new Error(
                                    "Payment verification failed."
                                );
                            }

                            const order =
                                await createFoodieOrder(
                                    "paid"
                                );

                            sessionStorage.setItem(
                                "foodie-last-order",
                                JSON.stringify(
                                    order
                                )
                            );

                            clearCart();

                            navigate(
                                "/order-confirmation"
                            );
                        } catch (error) {
                            console.error(
                                "Payment verification error:",
                                error
                            );

                            setError(
                                error.response
                                    ?.data
                                    ?.message ||
                                error.message ||
                                "Payment verification failed. Please contact support if money was deducted."
                            );

                            setLoading(false);
                        }
                    },

                modal: {
                    ondismiss:
                        function () {
                            setLoading(false);

                            setError(
                                "Payment was cancelled. Your order has not been placed."
                            );
                        }
                }
            };

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Razorpay payment failed:",
                        response.error
                    );

                    setError(
                        response.error
                            ?.description ||
                        "Payment failed. Please try again."
                    );

                    setLoading(false);
                }
            );

            razorpay.open();
        } catch (error) {
            console.error(
                "Online payment error:",
                error
            );

            setError(
                error.response
                    ?.data
                    ?.message ||
                error.message ||
                "Unable to start online payment. Please try again."
            );

            setLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (cart.length === 0) {
            setError(
                "Your cart is empty."
            );

            return;
        }

        if (
            formData.phone.length < 10 ||
            formData.phone.length > 15
        ) {
            setError(
                "Please enter a valid mobile number."
            );

            return;
        }

        if (formData.pincode.length !== 6) {
            setError(
                "Please enter a valid 6-digit pincode."
            );

            return;
        }

        setLoading(true);

        try {
            if (
                paymentMethod ===
                "online"
            ) {
                await handleOnlinePayment();
                return;
            }

            const order =
                await createFoodieOrder(
                    "pending"
                );

            sessionStorage.setItem(
                "foodie-last-order",
                JSON.stringify(
                    order
                )
            );

            clearCart();

            navigate(
                "/order-confirmation"
            );
        } catch (error) {
            console.error(
                "Place order error:",
                error
            );

            setError(
                error.response
                    ?.data
                    ?.message ||
                "Unable to place your order. Please try again."
            );

            setLoading(false);
        }
    }

    if (!isLoggedIn) {
        return (
            <main className="checkout-page wrapper">

                <div className="checkout-login-required">

                    <i className="fa-solid fa-lock"></i>

                    <h2>
                        Login Required
                    </h2>

                    <p>
                        Please login to continue with your order.
                    </p>

                    <Link
                        to="/login"
                        className="btn"
                    >
                        Login to Continue
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>

                </div>

            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="checkout-page wrapper">

                <div className="checkout-login-required">

                    <i className="fa-solid fa-cart-shopping"></i>

                    <h2>
                        Your Cart is Empty
                    </h2>

                    <p>
                        Add some delicious food before checking out.
                    </p>

                    <Link
                        to="/menu"
                        className="btn"
                    >
                        Browse Menu
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>

                </div>

            </main>
        );
    }

    return (
        <main className="checkout-page wrapper">

            <Link
                to="/cart"
                className="back-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Cart
            </Link>

            <div className="section-heading">

                <p className="section-subtitle">
                    Complete Your Order
                </p>

                <h1>
                    Checkout <span>Details</span>
                </h1>

                <p>
                    Enter your delivery details and choose your payment method.
                </p>

            </div>

            {error && (
                <div className="checkout-error">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </div>
            )}

            <div className="checkout-layout">

                <form
                    className="checkout-form-card"
                    onSubmit={handleSubmit}
                >

                    <div className="checkout-section">

                        <div className="checkout-section-heading">

                            <span>
                                <i className="fa-solid fa-location-dot"></i>
                            </span>

                            <div>
                                <h2>
                                    Delivery Address
                                </h2>

                                <p>
                                    Where should we deliver your order?
                                </p>
                            </div>

                        </div>

                        <div className="checkout-form-grid">

                            <div className="form-group">

                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={
                                        formData.fullName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="phone">
                                    Mobile Number
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="Enter mobile number"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength="15"
                                    required
                                />

                            </div>

                            <div className="form-group checkout-full-width">

                                <label htmlFor="address">
                                    Full Address
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    rows="4"
                                    placeholder="House / Flat No., Street, Area, Landmark"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                ></textarea>

                            </div>

                            <div className="form-group">

                                <label htmlFor="city">
                                    City
                                </label>

                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Enter city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="pincode">
                                    Pincode
                                </label>

                                <input
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="6-digit pincode"
                                    value={
                                        formData.pincode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength="6"
                                    required
                                />

                            </div>

                        </div>

                    </div>

                    <div className="checkout-section">

                        <div className="checkout-section-heading">

                            <span>
                                <i className="fa-solid fa-credit-card"></i>
                            </span>

                            <div>
                                <h2>
                                    Payment Method
                                </h2>

                                <p>
                                    Choose how you want to pay.
                                </p>
                            </div>

                        </div>

                        <div className="payment-options">

                            <label
                                className={`payment-option ${
                                    paymentMethod === "cod"
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={
                                        paymentMethod === "cod"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span className="payment-icon">
                                    <i className="fa-solid fa-money-bill-wave"></i>
                                </span>

                                <span className="payment-content">

                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <small>
                                        Pay when your order arrives
                                    </small>

                                </span>

                                <i className="fa-solid fa-circle-check payment-check"></i>

                            </label>

                            <label
                                className={`payment-option ${
                                    paymentMethod === "online"
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={
                                        paymentMethod === "online"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                <span className="payment-icon">
                                    <i className="fa-solid fa-credit-card"></i>
                                </span>

                                <span className="payment-content">

                                    <strong>
                                        Online Payment
                                    </strong>

                                    <small>
                                        Secure payment with Razorpay
                                    </small>

                                </span>

                                <i className="fa-solid fa-circle-check payment-check"></i>

                            </label>

                        </div>

                        {paymentMethod === "online" && (
                            <div className="payment-notice">

                                <i className="fa-solid fa-shield-halved"></i>

                                <span>
                                    You will be securely redirected to Razorpay to complete your payment.
                                </span>

                            </div>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="btn checkout-submit"
                        disabled={loading}
                    >
                        {loading
                            ? paymentMethod === "online"
                                ? "Opening Payment..."
                                : "Placing Order..."
                            : paymentMethod === "online"
                            ? "Pay & Place Order"
                            : "Place Order"}

                        {!loading && (
                            <i className="fa-solid fa-arrow-right"></i>
                        )}
                    </button>

                </form>

                <aside className="checkout-summary">

                    <div className="checkout-summary-header">

                        <h2>
                            Order Summary
                        </h2>

                        <span>
                            {cart.length}{" "}
                            {cart.length === 1
                                ? "item"
                                : "items"}
                        </span>

                    </div>

                    <div className="checkout-summary-items">

                        {cart.map((item) => (
                            <div
                                className="checkout-summary-item"
                                key={item.id}
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
                                        ).toLocaleString("en-IN")}{" "}
                                        ×{" "}
                                        {item.quantity}
                                    </p>

                                </div>

                                <strong>
                                    ₹
                                    {(
                                        Number(item.price) *
                                        Number(item.quantity)
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>
                        ))}

                    </div>

                    <div className="checkout-total">

                        <div>
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    cartTotal
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Delivery
                            </span>

                            <strong className="free-delivery">
                                FREE
                            </strong>
                        </div>

                        <div className="checkout-grand-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    cartTotal
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>

                    </div>

                    <div className="checkout-secure">

                        <i className="fa-solid fa-shield-halved"></i>

                        <span>
                            Your order information is securely processed.
                        </span>

                    </div>

                </aside>

            </div>

        </main>
    );
}

export default Checkout;

