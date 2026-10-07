import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FoodCard from "../components/FoodCard";

function Menu() {
const [foods, setFoods] = useState([]);
const [selectedCategory, setSelectedCategory] =
useState("All");


const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    async function loadFoods() {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/foods"
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

            setError(
                "Failed to load menu. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    loadFoods();
}, []);

const categories = useMemo(() => {
    const uniqueCategories = [];

    foods.forEach((food) => {
        const category = String(
            food.category || ""
        ).trim();

        if (!category) {
            return;
        }

        const exists =
            uniqueCategories.some(
                (item) =>
                    item.toLowerCase() ===
                    category.toLowerCase()
            );

        if (!exists) {
            uniqueCategories.push(category);
        }
    });

    return uniqueCategories;
}, [foods]);

const categoryItems = ["All", ...categories];

const filteredFoods =
    selectedCategory === "All"
        ? foods
        : foods.filter(
              (food) =>
                  String(
                      food.category || ""
                  )
                      .trim()
                      .toLowerCase() ===
                  selectedCategory
                      .trim()
                      .toLowerCase()
          );

if (loading) {
    return (
        <main className="menu-page wrapper">

            <div className="menu-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                Loading menu...
            </div>

        </main>
    );
}

return (
    <main className="menu-page wrapper">

        <Link
            to="/"
            className="back-button"
        >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Home
        </Link>

        <div className="section-heading">

            <p className="section-subtitle">
                Explore Our Menu
            </p>

            <h1>
                Delicious <span>Food</span>
            </h1>

            <p>
                Choose from our freshly prepared
                dishes and order your favorites.
            </p>

        </div>

        {error ? (
            <div className="menu-error">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
            </div>
        ) : (
            <>

                <div className="menu-category-boxes">

                    {categoryItems.map(
                        (category) => {

                            let categoryFood;

                            if (
                                category ===
                                "All"
                            ) {
                                categoryFood =
                                    foods[0];
                            } else {
                                categoryFood =
                                    foods.find(
                                        (food) =>
                                            String(
                                                food.category
                                            )
                                                .trim()
                                                .toLowerCase() ===
                                            category
                                                .trim()
                                                .toLowerCase()
                                    );
                            }

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    className={`home-category-card ${
                                        selectedCategory ===
                                        category
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category
                                        )
                                    }
                                >

                                    <div className="home-category-image">

                                        <img
                                            src={
                                                categoryFood?.image
                                            }
                                            alt={
                                                category
                                            }
                                        />

                                    </div>

                                    <span>
                                        {category}
                                    </span>

                                </button>
                            );
                        }
                    )}

                </div>

                {filteredFoods.length === 0 ? (
                    <div className="menu-empty">

                        <i className="fa-solid fa-utensils"></i>

                        <h2>
                            No food available
                        </h2>

                        <p>
                            There are no foods in
                            this category right now.
                        </p>

                    </div>
                ) : (
                    <div className="food-grid">

                        {filteredFoods.map(
                            (food) => (
                                <FoodCard
                                    key={food.id}
                                    food={food}
                                />
                            )
                        )}

                    </div>
                )}

            </>
        )}

    </main>
);


}

export default Menu;
