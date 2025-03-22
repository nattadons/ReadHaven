import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import Tab from '../components/Tab';
import Search from '../components/Search';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import MediaCard from '../components/Card';

const Book = () => {
  const [books, setBooks] = useState([]); // store books from API
  const [searchQuery, setSearchQuery] = useState(''); // search query
  const [currentPage, setCurrentPage] = useState(1); // current pagination page
  const [totalPages, setTotalPages] = useState(1); // total pages
  const [loading, setLoading] = useState(true); // loading state
  const booksPerPage = 6; // books per page

  // Function to fetch books with pagination
  const fetchBooks = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${booksPerPage}`;
      
      // If there's a search query, we could handle it in different ways:
      // 1. Send it to the backend and filter there (requires backend implementation)
      // 2. Get all results and filter in the frontend (not ideal for large datasets)
      
      // For now, we'll implement frontend filtering when searching
      const response = await axios.get(url);
      
      if (search) {
        // Filter results on the frontend for search
        // Note: In a real app, you'd want to handle search on the backend for better performance
        const filtered = response.data.products.filter(
          (book) =>
            book.name.toLowerCase().includes(search.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(search.toLowerCase()))
        );
        setBooks(filtered);
        // For this example, we're not updating pagination for search results
      } else {
        setBooks(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load saved search query from localStorage
    const savedSearchQuery = localStorage.getItem('searchQuery') || '';
    setSearchQuery(savedSearchQuery);
    
    // Fetch books on initial load
    fetchBooks(1, savedSearchQuery);
  }, []);

  useEffect(() => {
    // When current page changes, fetch new data
    if (!searchQuery) {
      fetchBooks(currentPage);
    }
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    localStorage.setItem('searchQuery', query);
    setCurrentPage(1); // Reset to page 1 when searching
    
    if (query) {
      // When searching, fetch all results and filter on frontend
      // This is a temporary solution; a better approach would be server-side search
      axios.get(`${import.meta.env.VITE_API_URL}/products`)
        .then((response) => {
          const filtered = response.data.products.filter(
            (book) =>
              book.name.toLowerCase().includes(query.toLowerCase()) ||
              (book.author && book.author.toLowerCase().includes(query.toLowerCase()))
          );
          setBooks(filtered);
          setTotalPages(Math.ceil(filtered.length / booksPerPage));
        })
        .catch((error) => {
          console.error('Error fetching data for search:', error);
        });
    } else {
      // If search is cleared, get regular paginated results
      fetchBooks(1);
    }
  };
  
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
          
          {loading ? (
            <Typography>Loading...</Typography>
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
                  <Typography>No books found.</Typography>
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