
const Food = require("../models/Food");
const Order = require("../models/Order");
const User = require("../models/User");

async function getDashboardStats(req, res) {
    try {
        const foodCount = await Food.countDocuments();

        const orderCount = await Order.countDocuments();

        const customerCount =
            await User.countDocuments({
                role: "customer"
            });

        const pendingOrders =
            await Order.countDocuments({
                orderStatus: "pending"
            });

        const deliveredOrders =
            await Order.countDocuments({
                orderStatus: "delivered"
            });

        const revenueResult =
            await Order.aggregate([
                {
                    $match: {
                        orderStatus: {
                            $ne: "cancelled"
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const startOfTomorrow = new Date(
            startOfToday
        );

        startOfTomorrow.setDate(
            startOfTomorrow.getDate() + 1
        );

        const todayOrders =
            await Order.countDocuments({
                createdAt: {
                    $gte: startOfToday,
                    $lt: startOfTomorrow
                }
            });

        const todayRevenueResult =
            await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfToday,
                            $lt: startOfTomorrow
                        },

                        orderStatus: {
                            $ne: "cancelled"
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]);

        const todayRevenue =
            todayRevenueResult.length > 0
                ? todayRevenueResult[0]
                      .totalRevenue
                : 0;

        res.json({
            foods: foodCount,
            orders: orderCount,
            customers: customerCount,
            revenue: totalRevenue,

            todayOrders,
            todayRevenue,

            pendingOrders,
            deliveredOrders
        });
    } catch (error) {
        console.error(
            "Dashboard stats error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load dashboard statistics"
        });
    }
}

module.exports = {
    getDashboardStats
};

