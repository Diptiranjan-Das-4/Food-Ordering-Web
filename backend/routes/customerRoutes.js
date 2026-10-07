
const express = require("express");

const {
    getAllCustomers,
    getCustomerById
} = require("../controllers/customerController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    adminOnly,
    getAllCustomers
);

router.get(
    "/:id",
    protect,
    adminOnly,
    getCustomerById
);

module.exports = router;

