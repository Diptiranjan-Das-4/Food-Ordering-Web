
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";


import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../api";

function AdminDashboard() {
    const { user, logout, getToken } = useAuth();
    
const navigate = useNavigate();



    const [stats, setStats] = useState({
        foods: 0,
        orders: 0,
        customers: 0,
        revenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0
    });

    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const response = await axios.get(
                    `${API_URL}/api/admin/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    }
                );

                setStats(response.data);
            } catch (error) {
                console.error(
                    "Load dashboard stats error:",
                    error
                );
            } finally {
                setLoadingStats(false);
            }
        }

        loadStats();
    }, [getToken]);

    return (
        <main className="admin-page">

            <header className="admin-header">

                <div className="admin-header-inner">

                    <Link
                        to="/"
                        className="admin-logo"
                    >
                        Foodie.
                    </Link>

                    <div className="admin-user">

                        <div className="admin-user-info">
                            <strong>
                                {user?.name || "Admin"}
                            </strong>

                            <span>
                                {user?.email}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="admin-logout"
                            onClick={() => { logout(); navigate("/"); }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>

                    </div>

                </div>

            </header>

            <section className="admin-content wrapper">

                <div className="admin-welcome">

                    <div>
                        <p className="section-subtitle">
                            Admin Panel
                        </p>

                        <h1>
                            Welcome,{" "}
                            <span>
                                {user?.name || "Admin"}
                            </span>
                        </h1>

                        <p>
                            Manage your Foodie restaurant
                            from one place.
                        </p>
                    </div>

                </div>

                {/* MAIN STATISTICS */}

                <div className="admin-stats">

                    <Link
                        to="/admin/foods"
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-icon">
                            <i className="fa-solid fa-utensils"></i>
                        </div>

                        <div>
                            <span>Foods</span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : stats.foods}
                            </strong>
                        </div>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </div>

                        <div>
                            <span>Orders</span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : stats.orders}
                            </strong>
                        </div>
                    </Link>

                    <Link
                        to="/admin/customers"
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-icon">
                            <i className="fa-solid fa-users"></i>
                        </div>

                        <div>
                            <span>Customers</span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : stats.customers}
                            </strong>
                        </div>
                    </Link>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon">
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                        </div>

                        <div>
                            <span>Revenue</span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : `₹${Number(
                                          stats.revenue
                                      ).toLocaleString(
                                          "en-IN"
                                      )}`}
                            </strong>
                        </div>
                    </div>

                </div>

                {/* EXTRA STATISTICS */}

                <div className="admin-extra-stats">

                    <div className="admin-extra-stat-card">

                        <div className="admin-extra-stat-icon">
                            <i className="fa-solid fa-calendar-day"></i>
                        </div>

                        <div>
                            <span>
                                Today's Orders
                            </span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : stats.todayOrders}
                            </strong>
                        </div>

                    </div>

                    <div className="admin-extra-stat-card">

                        <div className="admin-extra-stat-icon">
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                        </div>

                        <div>
                            <span>
                                Today's Revenue
                            </span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : `₹${Number(
                                          stats.todayRevenue
                                      ).toLocaleString(
                                          "en-IN"
                                      )}`}
                            </strong>
                        </div>

                    </div>

                    <Link
                        to="/admin/orders"
                        className="admin-extra-stat-card"
                    >

                        <div className="admin-extra-stat-icon">
                            <i className="fa-solid fa-clock"></i>
                        </div>

                        <div>
                            <span>
                                Pending Orders
                            </span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : stats.pendingOrders}
                            </strong>
                        </div>

                    </Link>

                    <Link
                        to="/admin/orders"
                        className="admin-extra-stat-card"
                    >

                        <div className="admin-extra-stat-icon">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>

                        <div>
                            <span>
                                Delivered Orders
                            </span>

                            <strong>
                                {loadingStats
                                    ? "..."
                                    : stats.deliveredOrders}
                            </strong>
                        </div>

                    </Link>

                </div>

                <div className="admin-section">

                    <div className="admin-section-heading">
                        <div>
                            <p className="section-subtitle">
                                Management
                            </p>

                            <h2>
                                Admin <span>Tools</span>
                            </h2>
                        </div>
                    </div>

                    <div className="admin-tools">

                        <Link
                            to="/admin/foods"
                            className="admin-tool-card"
                        >
                            <div className="admin-tool-icon">
                                <i className="fa-solid fa-bowl-food"></i>
                            </div>

                            <div>
                                <h3>Manage Foods</h3>

                                <p>
                                    Add, edit and delete
                                    food items.
                                </p>
                            </div>

                            <i className="fa-solid fa-arrow-right admin-tool-arrow"></i>
                        </Link>

                        <Link
                            to="/admin/orders"
                            className="admin-tool-card"
                        >
                            <div className="admin-tool-icon">
                                <i className="fa-solid fa-receipt"></i>
                            </div>

                            <div>
                                <h3>Manage Orders</h3>

                                <p>
                                    View and update
                                    customer orders.
                                </p>
                            </div>

                            <i className="fa-solid fa-arrow-right admin-tool-arrow"></i>
                        </Link>

                        <Link
                            to="/admin/customers"
                            className="admin-tool-card"
                        >
                            <div className="admin-tool-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <div>
                                <h3>Customers</h3>

                                <p>
                                    View registered
                                    customers.
                                </p>
                            </div>

                            <i className="fa-solid fa-arrow-right admin-tool-arrow"></i>
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default AdminDashboard;

