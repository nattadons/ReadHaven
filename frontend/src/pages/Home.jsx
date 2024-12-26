
import { Box, Container, Typography, Button } from '@mui/material';
import homeimage from '../assets/images/home.jpg';
import  { useEffect, useState } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);



  return (
    <>


      <Container className="home-content" >
        <Box className="left-content" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontSize: {
                xs: '1.5rem', // small screens
                sm: '2rem',   // medium screens
                md: '2.5rem', // large screens

              },
              fontWeight: 'bold',
              
            }}
          >
            Discover Your Next
          </Typography>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              whiteSpace: 'nowrap',
              fontSize: {
                xs: '1.5rem', // small screens
                sm: '2rem',   // medium screens
                md: '2.5rem', // large screens


              },
              fontWeight: 'bold',
             
            }}
          >
            Adventure on Every Page
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: {
                xs: '1rem', // small screens
                sm: '1.15rem',   // medium screens
                md: '1.25rem', // large screens
              },
            
            }}
          >
            Welcome to a world of books! Whether you are a fan of classic novels, academic knowledge, or thrilling adventures, we have the perfect read waiting for you. Dive into new experiences with every turn of the page.
          </Typography>
          <Box sx={{   width: '100%' }}>
            <Button
              variant="contained"
              sx={{
                color: 'primary.main',
                backgroundColor: 'text.primary',
                mt: 4,
                width: '80%',
              }}
            >
              Get Started!
            </Button>
          </Box>
        </Box>
        <Box className="right-content">
          <img src={homeimage} alt="Books" className="home-image" />
        </Box>
      </Container>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </>

  );
};

export default Home;