
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cart,
        cartItemCount,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
    } = useCart();

    if (cart.length === 0) {
        return (
            <main className="cart-page wrapper">

                <Link
                    to="/menu"
                    className="back-button"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Menu
                </Link>

                <div className="empty-cart">
                    <i className="fa-solid fa-cart-shopping"></i>

                    <h2>Your cart is empty</h2>

                    <p>
                        Add some delicious food to
                        your cart!
                    </p>

                    <Link
                        to="/menu"
                        className="btn"
                    >
                        Browse Menu
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page wrapper">

            <Link
                to="/menu"
                className="back-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Menu
            </Link>

            <div className="section-heading">
                <p className="section-subtitle">
                    Your Order
                </p>

                <h2>
                    Shopping <span>Cart</span>
                </h2>
            </div>

            <div className="cart-layout">

                <div className="cart-items">

                    <div className="cart-items-header">
                        <h3>Your Items</h3>

                        <span>
                            {cartItemCount}{" "}
                            {cartItemCount === 1
                                ? "item"
                                : "items"}
                        </span>
                    </div>

                    {cart.map((item) => (
                        <div
                            className="cart-item"
                            key={item.id}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                            />

                            <div className="cart-item-info">

                                <div className="cart-item-top">

                                    <div>
                                        <h3>
                                            {item.name}
                                        </h3>

                                        <span>
                                            {item.category}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="remove-cart"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>

                                </div>

                                <strong className="cart-item-price">
                                    ₹
                                    {Number(
                                        item.price
                                    ).toLocaleString("en-IN")}
                                </strong>

                                <div className="cart-item-bottom">

                                    <div className="quantity-control">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item.id
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.id
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <strong>
                                        ₹
                                        {(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>

                <div className="cart-summary">

                    <h3>Order Summary</h3>

                    <div className="summary-row">
                        <span>Items</span>
                        <span>
                            {cartItemCount}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>
                            ₹
                            {cartTotal.toLocaleString(
                                "en-IN"
                            )}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>
                        <span>Free</span>
                    </div>

                    <div className="summary-total">
                        <span>Total</span>

                        <strong>
                            ₹
                            {cartTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <Link
                        to="/checkout"
                        className="btn checkout-btn"
                    >
                        Order Now
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>

                </div>

            </div>
        </main>
    );
}

export default Cart;

