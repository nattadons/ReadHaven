import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import Tab from '../components/Tab';
import Search from '../components/Search';
import Pagination from '@mui/material/Pagination';
import axios from 'axios'; 
import MediaCard from '../components/Card'; 

const Book = () => {
  const [books, setBooks] = useState([]); // สำหรับเก็บข้อมูลหนังสือที่ดึงมาจาก API
  const [searchQuery, setSearchQuery] = useState(''); // สำหรับเก็บคำค้นหาจากผู้ใช้

  // ใช้ useEffect เพื่อดึงข้อมูลจาก API เมื่อคอมโพเนนต์เริ่มทำงาน
  useEffect(() => {
    // ดึงข้อมูลจาก API
   

    axios
      .get(`${import.meta.env.VITE_API_URL}/products`) 
      .then((response) => {
        setBooks(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error); 
      });

    // ตรวจสอบว่าเคยมีคำค้นหาที่บันทึกไว้ใน localStorage หรือไม่
    const savedSearchQuery = localStorage.getItem('searchQuery');
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery); // ถ้ามีคำค้นหาเก่าก็ให้โหลดมาแสดง
    }
  }, []); 

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = (query) => {
    setSearchQuery(query); // อัปเดตคำค้นหา
    localStorage.setItem('searchQuery', query); // บันทึกคำค้นหาใน localStorage
  };

  // ฟังก์ชันสำหรับกรองหนังสือตามคำค้นหา
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) || // ค้นหาจากชื่อหนังสือ
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) // ค้นหาจากผู้เขียน
  );

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: '100px',
          mb: '300px',
          mx: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '100%',
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center', mb: '32px' }}>
          <Grid item xs={12} sm={6}>
            <Tab />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Search onSearch={handleSearch} searchQuery={searchQuery} /> {/* ส่ง searchQuery ไปที่ Search */}
          </Grid>
        </Grid>
        
        <Box sx={{ mb: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <Typography fontWeight="medium" fontSize="20px">
            Categories
          </Typography>
          <Grid container spacing={3} sx={{ mt: '32px' }}>
            {filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <MediaCard product={book} /> 
              </Grid>
            ))}
          </Grid>
        </Box>
        <Pagination count={10} shape="rounded" />
      </Box>
    </Container>
  );
};

export default Book;
