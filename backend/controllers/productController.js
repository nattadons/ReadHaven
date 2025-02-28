const Products = require('../models/product');

// ดึงข้อมูลสินค้าทั้งหมด
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงข้อมูลสินค้าตาม ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่มฟังก์ชันดึงหนังสือแนะนำ
exports.getRecommendedProducts = async (req, res) => {
  try {
    // ดึงหนังสือมา 3 เล่มที่ไม่ใช่เล่มปัจจุบัน
    const currentProductId = req.params.id;
    const recommendedProducts = await Products.find(
      { _id: { $ne: currentProductId } }
    ).limit(3);
    
    res.status(200).json(recommendedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// เพิ่มสินค้าใหม่
exports.addProduct = async (req, res) => {
  try {
    console.log('req ที่ส่งมามีอะไรบ้าง',req.body);
    const { name, author, price, detail, overview } = req.body;
    const image_product = req.file ? req.file.path : "";
    

    const newProduct = new Products({
      name,
      author,
      price,
      detail,
      overview,
      image_product
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อัพเดทสินค้า
exports.updateProduct = async (req, res) => {
  try {
    const { name, author, price, detail, overview } = req.body;
    const updates = {
      name,
      author,
      price,
      detail,
      overview
    };
    
    // ถ้ามีการอัพโหลดไฟล์ใหม่
    if (req.file) {
      updates.imageUrl = req.file.path;
      
      // ลบรูปเก่าถ้ามี
      const product = await Products.findById(req.params.id);
      if (product && product.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบสินค้า
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // ลบรูปภาพถ้ามี
    if (product.image_product) {
      const imagePath = path.join(__dirname, '..', product.image_product);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};