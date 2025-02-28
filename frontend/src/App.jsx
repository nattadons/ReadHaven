import 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Footer from './components/Footer';
import About from './pages/About';
import Signup from './pages/Signup'; // Import the Signup component
import Book from './pages/Book';
import MyAccount from './pages/MyAccount';
import { AuthProvider } from './context/AuthContext';
import BookDetail from './pages/BookDetail';
import TestImage from './pages/TestImage';
import Payment from './pages/Payment';
import Cart from './pages/Cart';
import MyAccountAdmin from './pages/MyAccountAdmin';



import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


function App() {


  return (
    <GoogleOAuthProvider clientId={clientId}> {/* ✅ เพิ่ม GoogleOAuthProvider */}
    <Router>
    <AuthProvider>
    <ThemeProvider theme={theme}>
      
        <Navbar />
        <div className="content" >
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/book" element={<Book />} />
            <Route path="/myaccount" element={<MyAccount />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/testimage" element={<TestImage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/myaccountadmin" element={<MyAccountAdmin />} />
            {/* Add other routes here */}
          </Routes>
        </div>
        <Footer />
      
    </ThemeProvider>
    </AuthProvider>
    </Router>
    </GoogleOAuthProvider>
    
  );
}

export default App;