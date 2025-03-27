# ใช้ Node.js official image เป็น base image
FROM node:18

# กำหนด directory เริ่มต้นใน container (ตอน run ขึ้นมา)
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json เข้าไปใน container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมด (รวมถึงโฟลเดอร์ routes และไฟล์อื่นๆ) เข้าไปใน container
COPY . .

# เปิดพอร์ตที่แอปจะใช้งาน
EXPOSE 3000

# กำหนด command สำหรับเริ่มต้น run application (ตอน run container)
ENV NODE_ENV=production

CMD ["node", "index.js"]
