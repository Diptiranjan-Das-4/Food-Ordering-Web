
import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/orders"
                );

                setOrders(response.data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchOrders();

    }, []);


    return (
        <div className="orders-page">

            <h1>Customer Orders</h1>

            <div className="orders-list">

                {orders.map((order) => (

                    <div
                        className="order-card"
                        key={order._id}
                    >

                        <h3>
                            Order #{order._id.slice(-6)}
                        </h3>

                        <p>
                            Customer:{" "}
                            {order.customer?.name}
                        </p>

                        <p>
                            Phone: {order.phone}
                        </p>

                        <p>
                            Address:{" "}
                            {order.deliveryAddress}
                        </p>

                        <h4>
                            Items
                        </h4>

                        {order.items.map((item) => (

                            <p key={item._id}>
                                {item.name} × {item.quantity}
                            </p>

                        ))}

                        <strong>
                            Total: ₹{order.totalAmount}
                        </strong>

                        <p>
                            Status: {order.orderStatus}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Orders;

