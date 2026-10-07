
const User = require("../models/User");
const Order = require("../models/Order");

async function getAllCustomers(req, res) {
    try {
        const customers = await User.find({
            role: "customer"
        })
            .select("-password")
            .sort({
                createdAt: -1
            });

        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const orders = await Order.find({
                    customer: customer._id
                }).select(
                    "totalAmount orderStatus createdAt"
                );

                const totalSpent = orders.reduce(
                    (total, order) =>
                        total +
                        Number(
                            order.totalAmount || 0
                        ),
                    0
                );

                return {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    role: customer.role,
                    createdAt: customer.createdAt,
                    orderCount: orders.length,
                    totalSpent
                };
            })
        );

        res.json(customersWithStats);
    } catch (error) {
        console.error(
            "Get customers error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get customers"
        });
    }
}

async function getCustomerById(req, res) {
    try {
        const customer = await User.findOne({
            _id: req.params.id,
            role: "customer"
        }).select("-password");

        if (!customer) {
            return res.status(404).json({
                message:
                    "Customer not found"
            });
        }

        const orders = await Order.find({
            customer: customer._id
        })
            .sort({
                createdAt: -1
            });

        const totalSpent = orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.totalAmount || 0
                ),
            0
        );

        res.json({
            customer: {
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                role: customer.role,
                createdAt: customer.createdAt
            },
            orders,
            orderCount: orders.length,
            totalSpent
        });
    } catch (error) {
        console.error(
            "Get customer error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get customer"
        });
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById
};

