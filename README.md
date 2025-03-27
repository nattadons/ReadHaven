# Book Haven - Online Bookstore

## 📚 Project Overview

Book Haven is a full-stack e-commerce web application for buying and selling books, built using modern web technologies.

## 🚀 Technologies Used

### Frontend
- React (Vite)
- React Router
- Material-UI
- Google OAuth

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)
- Google OAuth

## ✨ Features

- User Authentication (Email/Password & Google Sign-in)
- Book Browsing and Search
- Detailed Book Information
- Shopping Cart
- Checkout Process (Transaction system/stripe)
- Order Tracking
- Admin Management Panel

## 🛠 Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm or yarn

## 📦 Installation

### Clone the Repository
```bash
git clone https://github.com/[YOUR_USERNAME]/book-haven.git
cd book-haven
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
CLIENT_URL=your_frontend_url
GOOGLE_CLIENT_ID=your_google_client_id
FOLDER_ID =your_google_drive_id
SK_LIVE = your_stripe_api_key
CREDENTIALS.JSON (form your Google Drive Api)
```

### Frontend (.env)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL= http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY = your_google_maps_api_key
VITE_PK_LIVE = your_stripe_api_key

```

## 🏃 Running the Application

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## 🔒 Authentication

The application supports:
- Email/Password Registration
- Google OAuth Sign-in
- JWT-based Authentication

## 📡 API Endpoints

- `/users`: User authentication and management
- `/products`: Book catalog and details
- `/cart`: Shopping cart operations
- `/orders`: Order processing
- `/payment`: Payment handling

## 🌐 Deployment

- Frontend: Vercel
- Backend: Render or Heroku
- Database: MongoDB Atlas

