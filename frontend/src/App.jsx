// filepath: /e:/BookHavenWeb/frontend/src/App.jsx
import './App.css';
import ResponsiveAppBar from './components/Navbar';
import Home from './pages/Home';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <ResponsiveAppBar />
        <div className="content">
          <Home />
        </div>
        <Footer />
      </>
    </ThemeProvider>
  );
}

export default App;