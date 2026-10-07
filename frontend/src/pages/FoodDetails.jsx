import { useEffect, useState } from "react";
import {
Link,
useNavigate,
useParams
} from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import API_URL from "../api";

function FoodDetails() {
const { id } = useParams();
const navigate = useNavigate();
const { addToCart } = useCart();


const [food, setFood] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    async function loadFood() {
        try {
            const response = await axios.get(
                `${API_URL}/api/foods/${id}`
            );

            const apiFood = response.data;

            setFood({
                ...apiFood,
                id: apiFood._id
            });
        } catch (error) {
            console.error(
                "Load food details error:",
                error
            );

            setError(
                "Failed to load food details."
            );
        } finally {
            setLoading(false);
        }
    }

    loadFood();
}, [id]);

function handleAddToCart() {
    addToCart(food);
    navigate("/cart");
}

if (loading) {
    return (
        <main className="food-details-page wrapper">

            <div className="menu-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                Loading food...
            </div>

        </main>
    );
}

if (error || !food) {
    return (
        <main className="food-details-page wrapper">

            <Link
                to="/menu"
                className="back-button"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Menu
            </Link>

            <div className="menu-empty">

                <i className="fa-solid fa-utensils"></i>

                <h2>
                    Food not found
                </h2>

                <p>
                    We couldn't find this food item.
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
    <main className="food-details-page wrapper">

        <Link
            to="/menu"
            className="back-button"
        >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Menu
        </Link>

        <div className="food-details-layout">

            <div className="food-details-image">

                <img
                    src={food.image}
                    alt={food.name}
                />

            </div>

            <div className="food-details-content">

                <span className="food-details-category">
                    {food.category}
                </span>

                <h1>
                    {food.name}
                </h1>

                <div className="food-details-rating">

                    <span>
                        <i className="fa-solid fa-star"></i>
                        {Number(
                            food.rating || 0
                        ).toFixed(1)}
                    </span>

                </div>

                <p className="food-details-description">
                    {food.description}
                </p>

                <div className="food-details-price">
                    ₹
                    {Number(
                        food.price
                    ).toLocaleString("en-IN")}
                </div>

                <div className="food-details-info">

                    <div>
                        <i className="fa-solid fa-leaf"></i>

                        <span>
                            {food.isVeg
                                ? "Vegetarian"
                                : "Non-Vegetarian"}
                        </span>
                    </div>

                    <div>
                        <i className="fa-solid fa-circle-check"></i>

                        <span>
                            {food.isAvailable
                                ? "Available"
                                : "Currently unavailable"}
                        </span>
                    </div>

                </div>

                <button
                    type="button"
                    className="btn food-details-add"
                    onClick={handleAddToCart}
                    disabled={!food.isAvailable}
                >
                    Add to Cart

                    <i className="fa-solid fa-cart-plus"></i>
                </button>

            </div>

        </div>

    </main>
);


}

export default FoodDetails;
