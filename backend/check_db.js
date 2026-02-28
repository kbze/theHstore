const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const p = await Product.find({});
    console.log("Products in DB:", p.length);
    console.log(JSON.stringify(p, null, 2));
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
