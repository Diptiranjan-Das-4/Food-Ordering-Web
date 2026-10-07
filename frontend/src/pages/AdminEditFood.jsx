
import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function AdminEditFood() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        rating: "",
        image: "",
        isVeg: true,
        isAvailable: true
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFood() {
            try {
                const response = await axios.get(
                    `${API_URL}/api/foods/${id}`
                );

                const food = response.data;

                setFormData({
                    name: food.name || "",
                    category: food.category || "",
                    description:
                        food.description || "",
                    price: food.price ?? "",
                    rating: food.rating ?? "",
                    image: food.image || "",
                    isVeg: food.isVeg ?? true,
                    isAvailable:
                        food.isAvailable ?? true
                });
            } catch (error) {
                console.error(
                    "Load food error:",
                    error
                );

                setError(
                    "Failed to load food."
                );
            } finally {
                setLoading(false);
            }
        }

        loadFood();
    }, [id]);

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
        setSaving(true);

        try {
            await axios.put(
                `${API_URL}/api/foods/${id}`,
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
                "Update food error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update food."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="admin-page">
                <div className="admin-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Loading food...
                </div>
            </main>
        );
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
                            Edit <span>Food</span>
                        </h1>

                        <p>
                            Update the details of this
                            menu item.
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
                            value={formData.image}
                            onChange={handleChange}
                            required
                        />

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
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                            {!saving && (
                                <i className="fa-solid fa-check"></i>
                            )}
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default AdminEditFood;

