const Products = require('../models/product');
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
require('dotenv').config(); // โหลดค่าใน .env

// กำหนดค่าสำหรับ Google Drive API
const KEY_FILE_PATH = path.join(__dirname, "../credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});
const FOLDER_ID = process.env.FOLDER_ID; // รหัสโฟลเดอร์ของ Google Drive ที่จะใช้เก็บไฟล์


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
      return res.status(404).json({ message: 'Product not found' });
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
   
    
    const { name, author, price, detail, overview } = req.body;
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
   
    
    const { name, author, price, detail, overview } = req.body;
    const updates = {
      name,
      author,
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