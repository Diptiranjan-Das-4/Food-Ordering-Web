import { useEffect, useState } from "react";
import axios from "axios";

function Categories({
selectedCategory,
setSelectedCategory
}) {
const [foods, setFoods] = useState([]);


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
                "Load categories error:",
                error
            );
        }
    }

    loadFoods();
}, []);

const categories = [];

foods.forEach((food) => {
    const category = String(
        food.category || ""
    ).trim();

    if (!category) {
        return;
    }

    const exists = categories.some(
        (item) =>
            item.toLowerCase() ===
            category.toLowerCase()
    );

    if (!exists) {
        categories.push(category);
    }
});

const categoryItems = [
    "Popular",
    ...categories.filter(
        (category) =>
            category.toLowerCase() !==
            "popular"
    )
];

return (
    <section className="categories-section wrapper">

        <div className="section-heading">

            <p className="section-subtitle">
                Explore
            </p>

            <h2>
                Food <span>Categories</span>
            </h2>

        </div>

        <div className="home-category-slider">

            {categoryItems.map((category) => {

                let categoryFood;

                if (category === "Popular") {
                    categoryFood = foods[0];
                } else {
                    categoryFood = foods.find(
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
                                alt={category}
                            />

                        </div>

                        <span>
                            {category}
                        </span>

                    </button>
                );
            })}

        </div>

    </section>
);


}

export default Categories;
