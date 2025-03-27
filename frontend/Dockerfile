# ใช้ Node.js 18 เป็น base image
FROM node:18

# ตั้ง directory สำหรับการทำงานใน container
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json (ถ้ามี)
COPY package.json ./
COPY package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดจากเครื่อง local ไปยัง container
COPY . .

# สร้างโปรเจกต์ React ด้วย Vite
RUN npm run build

# เปิดพอร์ตที่ Vite ใช้งาน
EXPOSE 5173

# รันคำสั่งเพื่อเริ่มต้นแอปพลิเคชัน React
CMD ["npm", "run", "dev", "--", "--host"]

