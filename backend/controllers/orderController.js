
const Order = require("../models/Order");
const Food = require("../models/Food");

async function createOrder(req, res) {
    try {
        const {
            items,
            deliveryAddress,
            paymentMethod,
            paymentStatus
        } = req.body;

        if (
            !items ||
            items.length === 0 ||
            !deliveryAddress ||
            !paymentMethod
        ) {
            return res.status(400).json({
                message:
                    "Order information is incomplete"
            });
        }

        if (
            !["cod", "online"].includes(
                paymentMethod
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid payment method"
            });
        }

        const foodIds = items.map(
            (item) => item.food
        );

        const foods = await Food.find({
            _id: {
                $in: foodIds
            }
        });

        if (
            foods.length !==
            items.length
        ) {
            return res.status(400).json({
                message:
                    "One or more food items are no longer available"
            });
        }

        const foodMap = new Map();

        foods.forEach((food) => {
            foodMap.set(
                food._id.toString(),
                food
            );
        });

        const verifiedItems = [];

        let calculatedTotal = 0;

        for (const item of items) {
            const food = foodMap.get(
                item.food.toString()
            );

            if (!food) {
                return res.status(400).json({
                    message:
                        "Food item not found"
                });
            }

            if (!food.isAvailable) {
                return res.status(400).json({
                    message:
                        `${food.name} is currently unavailable`
                });
            }

            const quantity =
                Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                return res.status(400).json({
                    message:
                        "Invalid food quantity"
                });
            }

            const verifiedPrice =
                Number(food.price);

            const itemTotal =
                verifiedPrice * quantity;

            calculatedTotal += itemTotal;

            verifiedItems.push({
                food: food._id,
                name: food.name,
                price: verifiedPrice,
                quantity,
                image: food.image
            });
        }

        const order = await Order.create({
            customer: req.user.id,

            items: verifiedItems,

            deliveryAddress,

            totalAmount:
                calculatedTotal,

            paymentMethod,

            paymentStatus:
                paymentMethod === "online"
                    ? "paid"
                    : "pending"
        });

        const populatedOrder =
            await Order.findById(order._id)
                .populate(
                    "customer",
                    "name email"
                );

        res.status(201).json({
            message:
                "Order created successfully",

            order: populatedOrder
        });
    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create order"
        });
    }
}

async function getMyOrders(req, res) {
    try {
        const orders =
            await Order.find({
                customer: req.user.id
            })
                .populate(
                    "customer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        res.json(orders);
    } catch (error) {
        console.error(
            "Get customer orders error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get your orders"
        });
    }
}

async function getAllOrders(req, res) {
    try {
        const orders =
            await Order.find()
                .populate(
                    "customer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });

        res.json(orders);
    } catch (error) {
        console.error(
            "Get all orders error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get orders"
        });
    }
}

async function getOrderById(req, res) {
    try {
        const order =
            await Order.findById(
                req.params.id
            )
                .populate(
                    "customer",
                    "name email"
                )
                .populate(
                    "items.food",
                    "name image category"
                );

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found"
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to get order"
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const {
            orderStatus,
            paymentStatus
        } = req.body;

        const updateData = {};

        if (orderStatus) {
            updateData.orderStatus =
                orderStatus;
        }

        if (paymentStatus) {
            updateData.paymentStatus =
                paymentStatus;
        }

        const order =
            await Order.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate(
                    "customer",
                    "name email"
                );

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found"
            });
        }

        res.json({
            message:
                "Order updated successfully",
            order
        });
    } catch (error) {
        console.error(
            "Update order error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update order"
        });
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};

