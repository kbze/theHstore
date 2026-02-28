const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/the8store').then(async () => {
    try {
        await Product.deleteMany({});

        const sampleProducts = [
            {
                name: 'Noir Emblem Zip-Up Hoodie',
                price: 35,
                image: '/images/product1.png',
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 100,
                description: 'Premium monochromatic zip-up hoodie.'
            },
            {
                name: 'Noir Emblem Sweatpants',
                price: 35,
                image: '/images/product2.png',
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 100,
                description: 'Premium monochromatic sweatpants.'
            },
            {
                name: 'Syria Pullover Hoodie',
                price: 35,
                image: '/images/product3.png',
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 100,
                description: 'Heavyweight pullover hoodie.'
            },
            {
                name: 'Syria Pullover II',
                price: 35,
                image: '/images/product4.png',
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 100,
                description: 'Alternative heavyweight pullover hoodie.'
            },
            {
                name: 'Syria Zip-Up Hoodie',
                price: 35,
                image: '/images/product5.png',
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 100,
                description: 'Alternative zip-up hoodie.'
            }
        ];

        const createdProducts = await Product.insertMany(sampleProducts);
        console.log("SEEDED DATABASE WITH PRODUCTS:");
        console.log(createdProducts.map(p => ({ _id: p._id, name: p.name })));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}).catch(e => {
    console.error(e);
    process.exit(1);
});
