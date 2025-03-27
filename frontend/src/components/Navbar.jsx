import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
const pages = ['Home', 'About', 'Books'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (page === 'Home') {
      navigate('/');
    } else if (page === 'About') {
      navigate('/about');
    } else if (page === 'Books') {
      navigate('/book');
    } else if (page === 'My Account') {
      navigate('/myaccount');
    }
    else if (page === 'Cart') {
      navigate('/cart');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDialog = () => {
    setOpenLoginDialog(true)
  };

  const handleLogout = async () => {

    const success = await logout();
    if (success) {
      navigate('/login');
      handleCloseNavMenu();
      setOpenLoginDialog(false);
    } else {
      // แจ้งเตือน error ถ้าต้องการ
      console.error('Logout failed');
      setOpenLoginDialog(false);
    }
  };

  const handleMyAccount = () => {
    navigate('/myaccount');
  };

  const buttonStyles = {
    my: 2,
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    width: {
      xs: '20%',
      sm: '100px',
    },
    mx: { xs: 1, sm: 1, md: 1 },
    fontSize: {
      xs: '14px',
      sm: '16px',
      md: '18px',
    },
  };

  // สร้างรายการเมนูตามสถานะการล็อกอิน
  const getMobileMenuItems = () => {
    const menuItems = [...pages];
    if (isLoggedIn) {
      menuItems.push('My Account');
      menuItems.push('Logout');
      menuItems.push('Cart');
    }
    return menuItems;
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={logo} alt="Logo" style={{ height: '40px' }} />
          </Box>

          {/* Mobile Menu */}
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
              {getMobileMenuItems().map((item) => (
                <MenuItem
                  key={item}
                  onClick={() => item === 'Logout' ? handleLogout() : handleCloseNavMenu(item)}
                >
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
                      px: { xs: 2, sm: 3, md: 4 },
                    }}
                  >
                    {item === 'Books' && (
                      <img
                        src={BookIcon}
                        alt="Books Icon"
                        style={{ marginRight: '10px', height: '24px' }}
                      />
                    )}
                    {item}
                  </Typography>
                </MenuItem>
              ))}
              {!isLoggedIn && (
                <MenuItem onClick={handleLogin}>
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
                      px: { xs: 2, sm: 3, md: 4 },
                    }}
                  >
                    Login
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={buttonStyles}
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

            {/* Account/Login Section */}
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 2, sm: 3, md: 4 } }}>
                <Button
                  onClick={() => navigate('/cart')}
                  sx={{
                    mr: 2,
                    color: 'text.primary',
                    fontSize: {
                      xs: '14px',
                      sm: '16px',
                      md: '18px',
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ mr: 1 }} />
                  Cart
                </Button>
                <Button
                  onClick={handleMyAccount}
                  sx={{
                    color: 'text.primary',
                    fontSize: {
                      xs: '14px',
                      sm: '16px',
                      md: '18px',
                    },
                  }}
                >
                  My Account
                </Button>
                <Typography
                  sx={{
                    color: 'text.primary',
                    mx: 1,
                    fontSize: {
                      xs: '14px',
                      sm: '16px',
                      md: '18px',
                    },
                  }}
                >
                  |
                </Typography>
                <Button

                  onClick={handleDialog}
                  sx={{
                    color: 'text.primary',
                    fontSize: {
                      xs: '14px',
                      sm: '16px',
                      md: '18px',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                size='medium'
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
                  mx: { xs: 2, sm: 3, md: 4 },
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
          </Box>
        </Toolbar>



        {/* Login Dialog */}
        <Dialog
          open={openLoginDialog}
          onClose={() => setOpenLoginDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              width: '100%',
              maxWidth: '400px',
              p: 2,
              textAlign: 'center',
            }
          }}
        >
          <DialogTitle>Logout</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to log out?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color='text.primary' onClick={() => setOpenLoginDialog(false)}    >Cancel</Button>
            <Button onClick={handleLogout} variant="contained" sx={{
              backgroundColor: 'text.primary',
              color: 'primary.main'
            }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>


      </Container>
    </AppBar>
  );
}

export default Navbar;