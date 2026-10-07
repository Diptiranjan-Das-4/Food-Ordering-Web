
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";
import AdminLogin from "./pages/AdminLogin";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFoods from "./pages/AdminFoods";
import AdminAddFood from "./pages/AdminAddFood";
import AdminEditFood from "./pages/AdminEditFood";
import AdminCustomers from "./pages/AdminCustomers";

import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminCustomerDetails from "./pages/AdminCustomerDetails";

import AdminOrders from "./pages/AdminOrders";



function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/menu"
                    element={<Menu />}
                />

                <Route
                    path="/food/:id"
                    element={<FoodDetails />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/order-confirmation"
                    element={<OrderConfirmation />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/foods"
                    element={<AdminFoods />}
                />

                <Route
                    path="/admin/foods/add"
                    element={<AdminAddFood />}
                />

                <Route
                    path="/admin/foods/edit/:id"
                    element={<AdminEditFood />}
                />

                <Route
                    path="/my-orders"
                    element={<MyOrders />}
                />


                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />

<Route
    path="/admin/orders/:id"
    element={<AdminOrderDetails />}
/>

<Route
    path="/admin/customers"
    element={<AdminCustomers />}
/>

<Route
    path="/admin/customers/:id"
    element={<AdminCustomerDetails />}
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;

