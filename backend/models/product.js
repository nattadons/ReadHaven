const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    name: { type: String, required: true },
   
    author: { type: String,  },
    
    price: { type: Number, required: true },
    detail: { type: String,  },
    overview: { type: String, },
    image_product: { type: String, default: ""  },

   
});

module.exports = mongoose.model('Products', productsSchema);
