import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import Tab from '../components/Tab';
import Search from '../components/Search';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import MediaCard from '../components/Card';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All'); // เพิ่มสถานะสำหรับหมวดหมู่ที่เลือก
  const booksPerPage = 6;

  // ฟังก์ชั่นดึงข้อมูลหนังสือ
  // แก้ไขฟังก์ชัน fetchBooks ใน Book.jsx
const fetchBooks = async (page = 1, search = '', category = 'All') => {
  setLoading(true);
  try {
    // สร้าง URL พื้นฐาน
    let url = `${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${booksPerPage}`;
    
    // เพิ่มพารามิเตอร์สำหรับหมวดหมู่
    if (category !== 'All') {
      url += `&type=${category}`;
    }
    
    // เพิ่มพารามิเตอร์สำหรับการค้นหา
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await axios.get(url);
    setBooks(response.data.products);
    setTotalPages(response.data.pagination.totalPages);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

  // ปรับปรุง useEffect เมื่อโหลดครั้งแรก และลบโค้ดที่ไม่จำเป็น
  useEffect(() => {
    // โหลดเฉพาะ searchQuery จาก localStorage
    const savedSearchQuery = localStorage.getItem('searchQuery') || '';
    
    // ตั้งค่า state
    setSearchQuery(savedSearchQuery);
    setSelectedCategory('All'); // กำหนดให้เป็น 'All' เสมอเมื่อโหลดหน้าใหม่
    
    // ดึงข้อมูลเมื่อโหลดครั้งแรกด้วยหมวดหมู่ 'All'
    fetchBooks(1, savedSearchQuery, 'All');
  }, []);
 
  // แก้ไขฟังก์ชัน handleSearch
const handleSearch = (query) => {
  setSearchQuery(query);
  localStorage.setItem('searchQuery', query);
  setCurrentPage(1); // รีเซ็ตกลับไปหน้า 1 เมื่อค้นหา
  
  // ดึงข้อมูลใหม่โดยส่งคำค้นหาไปด้วย
  fetchBooks(1, query, selectedCategory);
};

  
const handlePageChange = (event, page) => {
  setCurrentPage(page);
  fetchBooks(page, searchQuery, selectedCategory);
};
  
  // เพิ่มฟังก์ชันจัดการเมื่อเปลี่ยนหมวดหมู่
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    localStorage.setItem('selectedCategory', category);
    setCurrentPage(1); // รีเซ็ตกลับไปหน้า 1 เมื่อเปลี่ยนหมวดหมู่
    
    // ดึงข้อมูลใหม่พร้อมกับส่งคำค้นหาและหมวดหมู่ไปด้วย
    fetchBooks(1, searchQuery, category);
  };
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: '100px', mb: '300px', mx: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
        <Grid container spacing={2} sx={{ alignItems: 'center', mb: '32px' }}>
          <Grid item xs={12} sm={6}>
            <Tab onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Search onSearch={handleSearch} searchQuery={searchQuery} />
          </Grid>
        </Grid>

        <Box sx={{ mb: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <Typography fontWeight="medium" fontSize="20px">
            {selectedCategory === 'All' ? 'All' : `${selectedCategory}`}
          </Typography>
          
          {loading ? (
            <Typography>กำลังโหลด...</Typography>
          ) : (
            <Grid container spacing={3} sx={{ mt: '32px' }}>
              {books.length > 0 ? (
                books.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book._id}>
                    <MediaCard product={book} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>Not Found</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>

        {totalPages > 1 && (
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            shape="rounded" 
          />
        )}
      </Box>
    </Container>
  );
};

export default Book;