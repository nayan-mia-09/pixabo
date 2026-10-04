const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    title: {type: String},
    images: [String],
    short_description: {type: String},
    price: {type: Number},
    is_discount: {type: Boolean},
    discount_price: {type: Number},
    remark: {type: String},
    stock: {type: Number},
    color: [String],
    size: [String],
    description: {type: String},
    category_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    brand_id: {type: mongoose.Schema.Types.ObjectId, required: true}
},{
    timestamps: true,
    versionKey: false,
});

const productModel = mongoose.model("products", DataSchema);

module.exports = productModel;