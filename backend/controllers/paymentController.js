
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Food = require("../models/Food");

async function createRazorpayOrder(req, res) {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Cart items are required"
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

        if (foods.length !== items.length) {
            return res.status(400).json({
                message:
                    "One or more food items are unavailable"
            });
        }

        const foodMap = new Map();

        foods.forEach((food) => {
            foodMap.set(
                food._id.toString(),
                food
            );
        });

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

            calculatedTotal +=
                Number(food.price) * quantity;
        }

    
console.log(
    "Razorpay calculated total:",
    calculatedTotal
);

if (calculatedTotal <= 0) {
    return res.status(400).json({
        message:
            "Invalid payment amount",
        calculatedTotal
    });
}



        const options = {
            amount: Math.round(
                calculatedTotal * 100
            ),
            currency: "INR",
            receipt: `foodie_${Date.now()}`
        };

        const order =
            await razorpay.orders.create(
                options
            );

        res.status(201).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error(
            "Create Razorpay order error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create payment order"
        });
    }
}

async function verifyRazorpayPayment(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message:
                    "Payment verification details are missing"
            });
        }

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        if (
            generatedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment verification failed"
            });
        }

        res.json({
            success: true,
            message:
                "Payment verified successfully",
            paymentId:
                razorpay_payment_id,
            orderId:
                razorpay_order_id
        });
    } catch (error) {
        console.error(
            "Verify Razorpay payment error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Payment verification failed"
        });
    }
}

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment
};

