
import { useCart } from "../context/CartContext";

function FoodCard({ food }) {
    const { addToCart } = useCart();

    return (
        <div className="food-card menu-food-card">
            <div className="food-image food-image-large">
                <img
                    src={food.image}
                    alt={food.name}
                />

                <span
                    className={`food-type ${
                        food.isVeg
                            ? "veg"
                            : "non-veg"
                    }`}
                >
                    {food.isVeg ? "VEG" : "NON-VEG"}
                </span>

                <span className="food-rating">
                    ⭐ {food.rating}
                </span>
            </div>

            <div className="food-info">
                <div className="food-title-row">
                    <h3>{food.name}</h3>

                    <strong>
                        ₹{food.price}
                    </strong>
                </div>

                <p className="food-description">
                    {food.description}
                </p>

                <div className="food-card-bottom">
                    <span className="food-category">
                        {food.category}
                    </span>

                    <button
                        type="button"
                        className="add-food-btn"
                        onClick={() => addToCart(food)}
                    >
                        <i className="fa-solid fa-cart-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FoodCard;

