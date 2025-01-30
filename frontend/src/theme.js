import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // White background
    },
    text: {
      primary: '#2B2B2B', // Black text
      secondary: '#837F7F' // gray text
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
          fontSize: '0.875rem',
        },
      },
    },

    // สำหรับการปรับแต่ง TextField ที่ใช้ OutlinedInput
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#2B2B2B', // สีกรอบปกติ
            },
            '&:hover fieldset': {
              borderColor: '#2B2B2B', // สีกรอบเมื่อ hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2B2B2B', // สีกรอบเมื่อ focus
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
            borderColor: '#2B2B2B', // สีกรอบปกติ
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2B2B2B', // สีกรอบเมื่อ hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2B2B2B', // สีกรอบเมื่อ focus
          },
        },
      },
    },

    // ปรับแต่งสีของ InputLabel
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#2B2B2B', // สีของ label เมื่อ focus
          },
        },
      },
    },


    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // สีพื้นหลังของ Tabs
          '& .MuiTabs-indicator': {
            backgroundColor: '#2B2B2B', // สีของ indicator
          },
        },
        scrollButtons: {
          '&.Mui-disabled': {
            opacity: 0.3, // ความโปร่งใสของปุ่มเมื่อถูก disabled
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#837F7F', // สีของ Tab
          textTransform: 'none', // ไม่แปลงตัวอักษรเป็นตัวพิมพ์ใหญ่
          fontSize: '16px', // ขนาดฟอนต์ของ Tab
          '&.Mui-selected': {
            color: '#2B2B2B', // สีของ Tab เมื่อถูกเลือก
          },
        },
      },
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          width: '48px', // ความกว้างของ ScrollButton
          height: '48px', // ความสูงของ ScrollButton
          '&.Mui-disabled': {
            opacity: 0.3, // ความโปร่งใสเมื่อ ScrollButton ถูกปิดใช้งาน
          },
        },


      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontSize: '16px', // ขนาดฟอนต์ของตัวเลขใน Pagination
          color: '#2B2B2B', // สีฟอนต์
          
        },
      },
    },











  },
});

export default theme;
