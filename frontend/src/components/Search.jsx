
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PropTypes from 'prop-types'; // เพิ่มการนำเข้า PropTypes


export default function Search({ onSearch, searchQuery }) {
  const handleInputChange = (event) => {
    onSearch(event.target.value); // เรียกใช้ฟังก์ชัน onSearch เมื่อมีการพิมพ์
  };
  const handleKeyPress = (event) => {
    // ตรวจจับการกด Enter
    if (event.key === 'Enter') {
      onSearch(event.target.value); // เมื่อกด Enter ให้บันทึกคำค้นหา
      localStorage.setItem('searchQuery', event.target.value); // บันทึกคำค้นหาลงใน localStorage
    }
  };

  return (
    <FormControl sx={{ width: "100%", height: "48px" }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        value={searchQuery} // แสดงคำค้นหาจาก props
        onChange={handleInputChange} // เมื่อมีการพิมพ์ จะเรียก handleInputChange
        onKeyDown={handleKeyPress} // ตรวจจับการกดปุ่ม
        placeholder="Search…"
        sx={{
          flexGrow: 1,
          fontSize: '16px', // ตั้งค่า font-size ของข้อความใน input
        }}
        endAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
          style: { fontSize: '16px' }, // ตั้งค่า font-size เพิ่มเติมใน inputProps
        }}
      />
    </FormControl>
  );
}
// กำหนด propTypes สำหรับ props ที่คาดหวัง
Search.propTypes = {
  onSearch: PropTypes.func.isRequired, // ตรวจสอบว่า onSearch เป็นฟังก์ชันและต้องมีการส่งค่าเข้ามา
  searchQuery: PropTypes.string.isRequired, // ตรวจสอบว่า searchQuery เป็น string และต้องมีค่า
};
