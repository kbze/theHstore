const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Create new order
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, shippingDetails } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            shippingDetails,
        });

        const createdOrder = await order.save();

        // Deduct stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = product.stock - item.quantity;
                await product.save();
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin routes have been removed per user request (managing via WhatsApp instead)

module.exports = router;
