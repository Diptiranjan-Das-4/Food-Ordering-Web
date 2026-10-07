import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FoodCard from "./FoodCard";
import API_URL from "../api";

function PopularFoods({ selectedCategory }) {
const [foods, setFoods] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
    async function loadFoods() {
        try {
            const response = await axios.get(
                `${API_URL}/api/foods`
            );

            const normalizedFoods =
                response.data.map((food) => ({
                    ...food,
                    id: food._id
                }));

            setFoods(normalizedFoods);
        } catch (error) {
            console.error(
                "Load foods error:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    loadFoods();
}, []);

let displayedFoods = [];

if (selectedCategory === "Popular") {
    displayedFoods = foods.slice(0, 8);
} else if (selectedCategory) {
    displayedFoods = foods.filter(
        (food) =>
            String(food.category)
                .trim()
                .toLowerCase() ===
            String(selectedCategory)
                .trim()
                .toLowerCase()
    );
} else {
    displayedFoods = foods.slice(0, 8);
}

if (loading) {
    return (
        <section className="popular-foods">

            <div className="wrapper">

                <div className="menu-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Loading foods...
                </div>

            </div>

        </section>
    );
}

return (
    <section className="popular-foods">

        <div className="wrapper">

            <div className="section-heading">

                <p className="section-subtitle">
                    {selectedCategory ===
                    "Popular"
                        ? "Customer Favorites"
                        : "Category"}
                </p>

                <h2>

                    {selectedCategory ===
                    "Popular" ? (
                        <>
                            Popular{" "}
                            <span>Foods</span>
                        </>
                    ) : (
                        <>
                            {selectedCategory}{" "}
                            <span>Foods</span>
                        </>
                    )}

                </h2>

                <p>
                    {selectedCategory ===
                    "Popular"
                        ? "Discover some of our most loved dishes."
                        : `Explore our delicious ${selectedCategory.toLowerCase()} dishes.`}
                </p>

            </div>

            {displayedFoods.length === 0 ? (
                <div className="menu-empty">

                    <i className="fa-solid fa-utensils"></i>

                    <h2>
                        No food available
                    </h2>

                    <p>
                        There are no foods in this
                        category right now.
                    </p>

                </div>
            ) : (
                <div className="food-grid">

                    {displayedFoods.map(
                        (food) => (
                            <FoodCard
                                key={food.id}
                                food={food}
                            />
                        )
                    )}

                </div>
            )}

            <div className="popular-foods-button">

                <Link
                    to="/menu"
                    className="btn"
                >
                    View Full Menu

                    <i className="fa-solid fa-arrow-right"></i>
                </Link>

            </div>

        </div>

    </section>
);

}

export default PopularFoods;
