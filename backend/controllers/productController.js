const Products = require('../models/product');
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
require('dotenv').config(); // โหลดค่าใน .env

// กำหนดค่าสำหรับ Google Drive API

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.CREDENTIALS_TYPE,
    project_id: process.env.CREDENTIALS_PROJECT_ID,
    private_key_id: process.env.CREDENTIALS_PRIVATE_KEY_ID,
    private_key: process.env.CREDENTIALS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CREDENTIALS_CLIENT_EMAIL,
    client_id: process.env.CREDENTIALS_CLIENT_ID,
    auth_uri: process.env.CREDENTIALS_AUTH_URI,
    token_uri: process.env.CREDENTIALS_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.CREDENTIALS_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.CREDENTIALS_CLIENT_CERT_URL,
    universe_domain: process.env.CREDENTIALS_UNIVERSE_DOMAIN
  },
  scopes: SCOPES
});
const FOLDER_ID = process.env.FOLDER_ID; // รหัสโฟลเดอร์ของ Google Drive ที่จะใช้เก็บไฟล์


// ดึงข้อมูลสินค้าทั้งหมด
// Get products with pagination
// ดึงข้อมูลสินค้าทั้งหมด
// แก้ไขฟังก์ชัน getAllProducts ในไฟล์ productController.js
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const type = req.query.type; // รับค่าหมวดหมู่จาก query string
    const search = req.query.search || ''; // เพิ่มการรับค่า search

    // สร้างเงื่อนไขการค้นหา
    let query = {};
    
    // ถ้ามีการระบุหมวดหมู่
    if (type && type !== 'All') {
      query.type = type;
    }
    
    // ถ้ามีการค้นหา ให้เพิ่มเงื่อนไขในการค้นหา
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },  // ค้นหาจากชื่อ (case insensitive)
        { author: { $regex: search, $options: 'i' } } // ค้นหาจากชื่อผู้แต่ง (case insensitive)
      ];
    }

    // นับจำนวนสินค้าทั้งหมดตามเงื่อนไข
    const totalProducts = await Products.countDocuments(query);

    // ดึงสินค้าสำหรับหน้าปัจจุบันตามเงื่อนไข
    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ดึงข้อมูลสินค้าตามรายการ ID
exports.getProductsByOrder = async (req, res) => {
  try {
    const ids = req.query.ids; // ดึง IDs จาก query string

    if (!ids) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }

    const productIds = Array.isArray(ids) ? ids : ids.split(','); // แปลงเป็นอาเรย์ถ้าเป็น String

    const products = await Products.find({ _id: { $in: productIds } });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ products });
  } catch (err) {
    console.error('Error fetching products by IDs:', err);
    res.status(500).json({ error: err.message });
  }
};





// ดึงข้อมูลสินค้าตาม ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecommendedProducts = async (req, res) => {
  try {
    const currentProductId = req.params.id;
    
    // ดึงข้อมูลของหนังสือที่กำลังแสดงอยู่
    const currentProduct = await Products.findById(currentProductId);
    
    // ถ้าหากไม่พบหนังสือปัจจุบัน ให้ส่งข้อผิดพลาด
    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ดึงหนังสือที่มีประเภทเดียวกันและไม่ใช่หนังสือปัจจุบัน
    let recommendedProducts = await Products.find(
      { 
        _id: { $ne: currentProductId },   // ไม่ให้แสดงหนังสือปัจจุบัน
        type: currentProduct.type         // มีประเภทเดียวกับหนังสือปัจจุบัน
      }
    ).limit(3);  // จำกัดจำนวนหนังสือที่แนะนำ

    // ถ้าไม่พบหนังสือที่มีประเภทเดียวกัน ให้แสดงหนังสือที่อัปเดตล่าสุด 3 เล่ม
    if (recommendedProducts.length === 0) {
      recommendedProducts = await Products.find()
        .sort({ _id: -1 })  // จัดเรียงตามวันที่อัปเดตล่าสุด
        .limit(3);  // จำกัดจำนวนหนังสือที่แนะนำ
    }

    res.status(200).json(recommendedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// ฟังก์ชันสำหรับอัพโหลดไฟล์ไป Google Drive
async function uploadToDrive(file) {
  try {
    const drive = google.drive({ version: "v3", auth: auth });
    console.log("FolderID:", FOLDER_ID);
    const { data } = await drive.files.create({
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path)
      },
      requestBody: {
        name: file.originalname,
        parents: [FOLDER_ID] // folder ID ของคุณ
      },
      fields: "id,name,webViewLink" // เพิ่ม webViewLink เพื่อรับลิงก์เข้าถึง
    });

    // สร้าง URL สำหรับเข้าถึงไฟล์
    const fileUrl = `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`;

    console.log(`File uploaded successfully to Google Drive -> ${JSON.stringify(data)}`);

    // ลบไฟล์ชั่วคราวหลังจากอัพโหลดสำเร็จ
    fs.unlinkSync(file.path);

    return { fileId: data.id, fileName: data.name, fileUrl };
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
}





// เพิ่มสินค้าใหม่พร้อมอัพโหลดรูปภาพไป Google Drive
exports.addProduct = async (req, res) => {
  try {


    const { name, author, type,price, detail, overview } = req.body;
    let image_product = "";

    // ถ้ามีไฟล์รูปภาพ ให้อัพโหลดไป Google Drive ก่อน
    if (req.file) {
      try {
        const driveUploadResult = await uploadToDrive(req.file);
        // เก็บ URL ของภาพจาก Google Drive
        image_product = driveUploadResult.fileUrl;
        console.log("Upload Google Drive success:", driveUploadResult);
      } catch (uploadError) {
        console.error("Upload to Google Drive failed:", uploadError);
        return res.status(500).json({ error: "Upload to Google Drive failed" });
      }
    }

    // สร้างสินค้าใหม่โดยใช้ลิงก์ของรูปภาพจาก Google Drive
    const newProduct = new Products({
      name,
      author,
      type,
      price,
      detail,
      overview,
      image_product // เก็บลิงก์รูปภาพจาก Google Drive
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Failed to save the product:", err);
    res.status(500).json({ error: err.message });
  }
};

// อัพเดทสินค้า
exports.updateProduct = async (req, res) => {
  try {


    const { name, author, type, price, detail, overview } = req.body;
    const updates = {
      name,
      author,
      type,
      price,
      detail,
      overview
    };

    // ค้นหาข้อมูลสินค้าเดิมก่อนอัพเดท
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ถ้ามีการอัพโหลดไฟล์รูปภาพใหม่
    if (req.file) {
      try {
        // อัพโหลดรูปภาพใหม่ไปยัง Google Drive
        const driveUploadResult = await uploadToDrive(req.file);
        updates.image_product = driveUploadResult.fileUrl;
        console.log("Upload Google Drive success:", driveUploadResult);

        // ลบรูปภาพเก่าจาก Google Drive ถ้ามี
        if (product.image_product) {
          try {
            const deleteResult = await deleteFromDrive(product.image_product);
            if (deleteResult) {
              console.log("Deleted old image from Google Drive");
            } else {
              console.warn("Could not delete old image from Google Drive");
            }
          } catch (deleteError) {
            console.error("Failed to delete the old image from Google Drive:", deleteError);
          }
        }
      } catch (uploadError) {
        console.error("Could not upload new image:", uploadError);
        return res.status(500).json({ error: "Could not upload new image" });
      }
    }

    // อัพเดทข้อมูลสินค้าใน MongoDB
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Could not update product:", err);
    res.status(500).json({ error: err.message });
  }
};



// ฟังก์ชันสำหรับลบไฟล์จาก Google Drive ด้วย fileId
async function deleteFromDrive(fileUrl) {
  try {
    // แยก fileId จาก URL ของรูปภาพ
    const urlPattern = /id=([^&]+)/;
    const match = fileUrl.match(urlPattern);

    if (!match || !match[1]) {
      console.error("Not found fileID in link:", fileUrl);
      return false;
    }

    const fileId = match[1];
    const drive = google.drive({ version: "v3", auth: auth });

    // ลบไฟล์จาก Google Drive ด้วย fileId
    await drive.files.delete({
      fileId: fileId
    });

    console.log(`Deleted file in Google Drive success: ${fileId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete file in Google Drive", error);
    return false;
  }
}



// ลบสินค้า
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ลบรูปภาพจาก Google Drive ถ้ามี
    if (product.image_product) {
      try {
        const deleteResult = await deleteFromDrive(product.image_product);
        if (deleteResult) {
          console.log("Deleted image from Google Drive success");
        } else {
          console.warn("Could not delete image from Google Drive");
        }
      } catch (deleteError) {
        console.error("Error to delete image from Google Drive:", deleteError);
        // ลบผลิตภัณฑ์จาก MongoDB ถึงแม้จะลบรูปจาก Drive ไม่สำเร็จ
      }
    }

    // ลบผลิตภัณฑ์จาก MongoDB
    await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted product success' });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ error: err.message });
  }
};