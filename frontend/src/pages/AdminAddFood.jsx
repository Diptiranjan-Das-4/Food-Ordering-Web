
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminAddFood() {
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        rating: "0",
        image: "",
        isVeg: true,
        isAvailable: true
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/foods",
                {
                    ...formData,
                    price: Number(formData.price),
                    rating: Number(formData.rating)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            navigate("/admin/foods");
        } catch (error) {
            console.error(
                "Add food error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to add food."
            );
        } finally {
            setLoading(false);
        }
    }

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
                        to="/admin/foods"
                        className="admin-back"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Foods
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
                            Add <span>Food</span>
                        </h1>

                        <p>
                            Add a new food item to your
                            Foodie menu.
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="admin-error">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {error}
                    </div>
                )}

                <form
                    className="admin-food-form"
                    onSubmit={handleSubmit}
                >

                    <div className="admin-form-grid">

                        <div className="form-group">

                            <label htmlFor="name">
                                Food Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Example: Chicken Biryani"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="category">
                                Category
                            </label>

                            <input
                                id="category"
                                name="category"
                                type="text"
                                placeholder="Example: Biryani"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="price">
                                Price (₹)
                            </label>

                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                placeholder="249"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="rating">
                                Rating
                            </label>

                            <input
                                id="rating"
                                name="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="4.5"
                                value={formData.rating}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Describe the food..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>

                    </div>

                    <div className="form-group">

                        <label htmlFor="image">
                            Image URL
                        </label>

                        <input
                            id="image"
                            name="image"
                            type="url"
                            placeholder="https://example.com/food.jpg"
                            value={formData.image}
                            onChange={handleChange}
                            required
                        />

                        <small className="form-help">
                            Paste a direct image URL.
                        </small>

                    </div>

                    <div className="admin-checkboxes">

                        <label className="admin-checkbox">

                            <input
                                type="checkbox"
                                name="isVeg"
                                checked={formData.isVeg}
                                onChange={handleChange}
                            />

                            <span>
                                Vegetarian
                            </span>

                        </label>

                        <label className="admin-checkbox">

                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={
                                    formData.isAvailable
                                }
                                onChange={handleChange}
                            />

                            <span>
                                Available
                            </span>

                        </label>

                    </div>

                    <div className="admin-form-actions">

                        <Link
                            to="/admin/foods"
                            className="admin-cancel-btn"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding Food..."
                                : "Add Food"}

                            {!loading && (
                                <i className="fa-solid fa-plus"></i>
                            )}
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default AdminAddFood;

