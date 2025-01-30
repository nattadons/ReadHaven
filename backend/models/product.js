const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    name: { type: String, required: true },
   
    author: { type: String, required: true },
    
    price: { type: Number, required: true },
    detail: { type: String, required: true },
    overview: { type: String, required: true },
    image_product: { type: String, required: true },

   
});

module.exports = mongoose.model('Products', productsSchema);
