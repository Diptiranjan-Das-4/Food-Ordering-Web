const Food = require("../models/Food");

async function getFoods(req, res) {
try {
const foods = await Food.find({
isAvailable: true
}).sort({
createdAt: -1
});


    res.json(foods);
} catch (error) {
    console.error("Get foods error:", error);

    res.status(500).json({
        message: "Failed to get foods"
    });
}


}

async function getFoodById(req, res) {
try {
const food = await Food.findById(
req.params.id
);


    if (!food) {
        return res.status(404).json({
            message: "Food not found"
        });
    }

    res.json(food);
} catch (error) {
    res.status(500).json({
        message: "Failed to get food"
    });
}


}

async function createFood(req, res) {
try {
const {
name,
category,
description,
price,
rating,
image,
isVeg,
isAvailable
} = req.body;


    if (
        !name ||
        !category ||
        !description ||
        price === undefined ||
        !image
    ) {
        return res.status(400).json({
            message:
                "Name, category, description, price and image are required"
        });
    }

    const food = await Food.create({
        name,
        category,
        description,
        price,
        rating,
        image,
        isVeg,
        isAvailable
    });

    res.status(201).json({
        message: "Food created successfully",
        food
    });
} catch (error) {
    console.error("Create food error:", error);

    res.status(500).json({
        message: "Failed to create food"
    });
}


}

async function updateFood(req, res) {
try {
const food =
await Food.findByIdAndUpdate(
req.params.id,
req.body,
{
new: true,
runValidators: true
}
);


    if (!food) {
        return res.status(404).json({
            message: "Food not found"
        });
    }

    res.json({
        message: "Food updated successfully",
        food
    });
} catch (error) {
    console.error("Update food error:", error);

    res.status(500).json({
        message: "Failed to update food"
    });
}


}

async function deleteFood(req, res) {
try {
const food =
await Food.findByIdAndDelete(
req.params.id
);


    if (!food) {
        return res.status(404).json({
            message: "Food not found"
        });
    }

    res.json({
        message: "Food deleted successfully"
    });
} catch (error) {
    console.error("Delete food error:", error);

    res.status(500).json({
        message: "Failed to delete food"
    });
}


}

module.exports = {
getFoods,
getFoodById,
createFood,
updateFood,
deleteFood
};
