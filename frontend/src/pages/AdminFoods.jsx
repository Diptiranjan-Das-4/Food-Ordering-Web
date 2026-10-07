
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function AdminFoods() {
    const { getToken } = useAuth();

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadFoods() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/foods/${id}`
            );

            setFoods(response.data);
        } catch (error) {
            console.error(
                "Load foods error:",
                error
            );

            setError(
                "Failed to load foods."
            );
        } finally {
            setLoading(false);
        }
    }

    async function deleteFood(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${API_URL}/api/foods/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setFoods((previousFoods) =>
                previousFoods.filter(
                    (food) => food._id !== id
                )
            );
        } catch (error) {
            console.error(
                "Delete food error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete food."
            );
        }
    }

    useEffect(() => {
        loadFoods();
    }, []);

    return (
        <main className="admin-page">

            <header className="admin-header">

                <div className="admin-header-inner">

                    <Link
                        to="/admin"
                        className="admin-logo"
                    >
                        Foodie.
                    </Link>

                    <Link
                        to="/admin"
                        className="admin-back"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Dashboard
                    </Link>

                </div>

            </header>

            <section className="admin-content wrapper">

                <div className="admin-page-heading">

                    <div>
                        <p className="section-subtitle">
                            Food Management
                        </p>

                        <h1>
                            Manage <span>Foods</span>
                        </h1>

                        <p>
                            Add and manage the food items
                            available on your menu.
                        </p>
                    </div>

                    <Link
                        to="/admin/foods/add"
                        className="btn"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add Food
                    </Link>

                </div>

                {error && (
                    <div className="admin-error">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="admin-loading">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Loading foods...
                    </div>
                ) : foods.length === 0 ? (
                    <div className="admin-empty">

                        <i className="fa-solid fa-utensils"></i>

                        <h3>
                            No foods found
                        </h3>

                        <p>
                            Add your first food item
                            to get started.
                        </p>

                        <Link
                            to="/admin/foods/add"
                            className="btn"
                        >
                            Add First Food
                        </Link>

                    </div>
                ) : (
                    <div className="admin-food-table-wrapper">

                        <table className="admin-food-table">

                            <thead>
                                <tr>
                                    <th>Food</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {foods.map((food) => (
                                    <tr key={food._id}>

                                        <td>
                                            <div className="admin-food-name">

                                                <img
                                                    src={food.image}
                                                    alt={food.name}
                                                />

                                                <div>
                                                    <strong>
                                                        {food.name}
                                                    </strong>

                                                    <span>
                                                        ⭐ {food.rating}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            {food.category}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                food.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    food.isVeg
                                                        ? "food-status veg-status"
                                                        : "food-status nonveg-status"
                                                }
                                            >
                                                {food.isVeg
                                                    ? "VEG"
                                                    : "NON-VEG"}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    food.isAvailable
                                                        ? "food-status available-status"
                                                        : "food-status unavailable-status"
                                                }
                                            >
                                                {food.isAvailable
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="admin-food-actions">

                                                <Link
                                                    to={`/admin/foods/edit/${food._id}`}
                                                    className="food-action edit-action"
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="food-action delete-action"
                                                    onClick={() =>
                                                        deleteFood(
                                                            food._id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </main>
    );
}

export default AdminFoods;

