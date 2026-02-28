const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        required: true,
    },
    sizes: {
        type: [String],
        default: ['S', 'M', 'L', 'XL'],
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    description: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
