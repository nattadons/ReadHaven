// filepath: /e:/BookHavenWeb/frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // White background
    },
    text: {
      primary: '#000000', // Black text
      secondary:'#837F7F' // gray text
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

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000', // Set the border color for the text field
            },
            '&:hover fieldset': {
              borderColor: '#000000', // Set the border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000', // Set the border color when focused
            },
          },
        },
      },
    },


  },


});

export default theme;