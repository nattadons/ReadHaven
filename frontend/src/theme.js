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
    
    // สำหรับการปรับแต่ง TextField ที่ใช้ OutlinedInput
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000', // สีกรอบปกติ
            },
            '&:hover fieldset': {
              borderColor: '#000000', // สีกรอบเมื่อ hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000', // สีกรอบเมื่อ focus
            },
          },
        },
      },
    },

    // สำหรับการปรับแต่ง OutlinedInput (กรณีใช้ FormControl)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000', // สีกรอบปกติ
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000', // สีกรอบเมื่อ hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000', // สีกรอบเมื่อ focus
          },
        },
      },
    },

    // ปรับแต่งสีของ InputLabel
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#000000', // สีของ label เมื่อ focus
          },
        },
      },
    },
  },
});

export default theme;
