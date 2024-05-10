const mongoose = require("mongoose");

const productSchema = new mongoose.Schema ({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    img: {
        type: String
    },
    code: {
        type: String,
        require: true,
        unique: true
    },
    category: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    thumbnail: {
        type: [String],
    }
})

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;