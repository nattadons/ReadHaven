import  { useState } from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';


const Book = () => {
  const [books] = useState([
    { id: 1, title: 'Book 1', description: 'Description of book 1' },
    { id: 2, title: 'Book 2', description: 'Description of book 2' },
    { id: 3, title: 'Book 3', description: 'Description of book 3' },
  ]);

  return (
    <>
    
    <Container  sx={{mb:'300px'}}>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Book Collection
          </Typography>
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2">{book.description}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    View Details
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Book;
