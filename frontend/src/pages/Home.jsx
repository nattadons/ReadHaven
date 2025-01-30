
import { Box, Container, Typography, Button } from '@mui/material';
import homeimage from '../assets/images/home.jpg';


const Home = () => {



  return (
    <>


      <Container className="home-content" sx={{mb:'300px'}}>
        <Box className="left-content" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontSize: {
                xs: '24px',
                sm: '32px',
                md: '40px',
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
                xs: '24px',
                sm: '32px',
                md: '40px',
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
                  xs: '14px',
                  sm: '16px',
                  md: '18px',
                },

            }}
          >
            Welcome to a world of books! Whether you are a fan of classic novels, academic knowledge, or thrilling adventures, we have the perfect read waiting for you. Dive into new experiences with every turn of the page.
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Button size='medium'
              variant="contained"
              sx={{
                color: 'primary.main',
                backgroundColor: 'text.primary',
                mt: 4,
                width: '80%',
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                  md: '18px',
                },
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

    </>

  );
};

export default Home;