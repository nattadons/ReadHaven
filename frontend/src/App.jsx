import 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ResponsiveAppBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Footer from './components/Footer';

import Signup from './pages/Signup'; // Import the Signup component






function App() {


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar />
        <div className="content" >
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Add other routes here */}
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;