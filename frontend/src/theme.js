// filepath: /e:/BookHavenWeb/frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // White background
    },
    text: {
      primary: '#000000', // Black text
    },
  },
  typography: {
    fontFamily: 'inter, serif', // Set the global font family

  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: 'inter, serif', // Set the font family for Link
          textDecoration: 'none', // Remove underline from Link
          fontSize:'0.875rem',
        },
      },
    },
  },


});

export default theme;