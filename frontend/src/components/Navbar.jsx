import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    console.log('Page:', page); // Log the value of page
    if (page === 'Home') {
      navigate('/');
    } else if (page === 'About') {
      navigate('/about');
    } else if (page === 'Books') {
      navigate('/books');
    }
  };

  const handleLogin = () => {
    navigate('/login');
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
              onClose={() => handleCloseNavMenu(null)} // No arguments needed, can pass null directly
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}> {/* Arrow function needed to pass page */}
                  <Typography
                    sx={{
                      textAlign: 'center',
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: {
                        xs: '0.95rem', // small screens
                        sm: '1rem', // medium screens
                        md: '1.1rem', // large screens
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
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <img src={logo} alt="Logo" style={{ height: '40px' }} />
          </Box>

          <Box sx={{ flexGrow: 1 }} />{/*push page to right-side or space-between  */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)} // Arrow function needed to pass page
                sx={{
                  my: 2,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                  width: {
                    xs: '20%', // 50% width on extra-small screens
                    sm: '100px', // 200px width on small screens and above
                  },
                  mx: 1,
                  fontSize: {
                    xs: '0.95rem', // small screens
                    sm: '1rem', // medium screens
                    md: '1.1rem', // large screens
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
          <Button
            onClick={handleLogin} // No arguments needed, can reference directly
            sx={{
              color: 'primary.main',
              backgroundColor: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              width: {
                xs: '20%', // 50% width on extra-small screens
                sm: '160px', // 200px width on small screens and above
              },
              mx: 1, // margin x-axis for spacing
              fontSize: {
                xs: '0.95rem', // small screens
                sm: '1rem', // medium screens
                md: '1.1rem', // large screens
              },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;