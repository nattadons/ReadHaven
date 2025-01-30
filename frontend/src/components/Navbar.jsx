import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // นำเข้า useAuth จาก AuthContext
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import logo from '../assets/images/logo.svg';
import BookIcon from '../assets/icons/bookicon.svg';

const pages = ['Home', 'About', 'Books'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();  // ดึงค่า isLoggedIn จาก AuthContext


  // ใช้ useEffect เพื่อปริ้นค่า isLoggedIn ทุกครั้งที่มันเปลี่ยน
  React.useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);  // ปริ้นค่า isLoggedIn
  }, [isLoggedIn]);  // useEffect จะทำงานทุกครั้งที่ isLoggedIn เปลี่ยนแปลง


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    console.log('Page:', page);
    if (page === 'Home') {
      navigate('/');
    } else if (page === 'About') {
      navigate('/about');
    } else if (page === 'Books') {
      navigate('/book');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={logo} alt="Logo" style={{ height: '40px' }} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: 'text.primary' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                        md: '18px',
                      },
                    }}
                  >
                    {page === 'Books' && (
                      <img
                        src={BookIcon}
                        alt="Books Icon"
                        style={{ marginRight: '10px', height: '24px' }}
                      />
                    )}
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                  width: {
                    xs: '20%',
                    sm: '100px',
                  },
                  mx: 1,
                  fontSize: {
                    xs: '14px',
                    sm: '16px',
                    md: '18px',
                  },
                }}
              >
                {page === 'Books' && (
                  <img
                    src={BookIcon}
                    alt="Books Icon"
                    style={{ marginRight: '10px', height: '24px' }}
                  />
                )}
                {page}
              </Button>
            ))}
          </Box>
          {isLoggedIn ? (
            <Button size='medium'
              onClick={handleLogout}
              sx={{
                color: 'primary.main',
                backgroundColor: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                width: {
                  xs: '20%',
                  sm: '160px',
                },
                mx: 1,
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                  md: '18px',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button size='medium'
              onClick={handleLogin}
              sx={{
                color: 'primary.main',
                backgroundColor: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                width: {
                  xs: '20%',
                  sm: '160px',
                },
                mx: 1,
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                  md: '18px',
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
