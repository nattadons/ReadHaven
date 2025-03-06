import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import Tab from '../components/Tab';
import Search from '../components/Search';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import MediaCard from '../components/Card';

const Book = () => {
  const [books, setBooks] = useState([]); // เก็บข้อมูลหนังสือจาก API
  const [searchQuery, setSearchQuery] = useState(''); // คำค้นหา
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันของ pagination
  const booksPerPage = 6; // จำนวนหนังสือต่อหน้า

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    const savedSearchQuery = localStorage.getItem('searchQuery');
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    localStorage.setItem('searchQuery', query);
    setCurrentPage(1); // รีเซ็ตหน้าเป็น 1 เมื่อมีการค้นหาใหม่
  };

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // คำนวณขอบเขตของหนังสือที่จะแสดงในหน้านั้น ๆ
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const displayedBooks = filteredBooks.slice(startIndex, endIndex);
  
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: '100px', mb: '300px', mx: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
        <Grid container spacing={2} sx={{ alignItems: 'center', mb: '32px' }}>
          <Grid item xs={12} sm={6}>
            <Tab />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Search onSearch={handleSearch} searchQuery={searchQuery} />
          </Grid>
        </Grid>

        <Box sx={{ mb: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <Typography fontWeight="medium" fontSize="20px">
            Categories
          </Typography>
          <Grid container spacing={3} sx={{ mt: '32px' }}>
            {displayedBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <MediaCard product={book} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Pagination></Pagination>

        {totalPages > 1 && (
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" />
        )}
      </Box>
    </Container>
  );
};

export default Book;
