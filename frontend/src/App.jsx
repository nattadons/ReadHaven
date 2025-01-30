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
import Book from './pages/ฺBook';
import MyAccount from './pages/MyAccount';
import { AuthProvider } from './context/AuthContext';
import BookDetail from './pages/BookDetail';







function App() {


  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <Router>
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
            {/* Add other routes here */}
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;