import 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import image1 from '../assets/images/about1.jpg';
import image2 from '../assets/images/about2.jpg';
import image3 from '../assets/images/about3.jpg';

const About = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: '100px', mb: '300px', mx: "50px", display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
                <Typography component="h1" variant="h5" fontWeight="bold" fontSize={"32px"}>
                    About Us
                </Typography>
                <Typography
                    component="p"
                    sx={{
                        mt: 2,
                        width: '100%',
                        fontSize: "20px",
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center', // Center the text
                    }}
                >
                    &quot;At ReadHaven, we believe stories and knowledge can transform lives. More than a bookstore,
                </Typography>
                <Typography
                    component="p"
                    sx={{

                        width: '100%',
                        fontSize: "20px",
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'center', // Center the text
                    }}
                >
                    we’re a community for readers seeking inspiration, learning, and connection.&quot;
                </Typography>
                <Grid container spacing={4} sx={{ mt: 8, width: '100%', justifyContent: 'center' }}>
                    <Grid item xs={12} sm={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // Horizontal centering
                                justifyContent: 'flex-start', // Vertical alignment to the top
                                height: '100%',
                                textAlign: 'center',
                            }}
                        >
                            <img src={image1} alt="Image 1" style={{ width: '250px', height: 'auto' }} />
                            <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 'bold' }}>BOOKS</Typography>
                            <Typography
                                component="p"
                                sx={{
                                    mt: 2,
                                    fontSize: '18px',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                }}
                            >
                                We offer a diverse selection of books that inspire, educate, and entertain, ensuring something for every reader—whether it’s bestsellers, hidden gems, or classics.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // Horizontal centering
                                justifyContent: 'flex-start', // Vertical alignment to the top
                                height: '100%',
                                textAlign: 'center',
                            }}
                        >
                            <img src={image2} alt="Image 2" style={{ width: '250px', height: 'auto' }} />
                            <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 'bold' }}>READERS</Typography>
                            <Typography
                                component="p"
                                sx={{
                                    mt: 2,
                                    fontSize: '18px',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                }}
                            >
                                Our community is built around readers who share a passion for literature. We create an inclusive space where everyone feels valued, and we support your unique reading journey.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // Horizontal centering
                                justifyContent: 'flex-start', // Vertical alignment to the top
                                height: '100%',
                                textAlign: 'center',
                            }}
                        >
                            <img src={image3} alt="Image 3" style={{ width: '250px', height: 'auto' }} />
                            <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 'bold' }}>CONNECT READERS</Typography>
                            <Typography
                                component="p"
                                sx={{
                                    mt: 2,
                                    fontSize: '18px',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                }}
                            >
                                We foster connections among readers through events and discussions, encouraging sharing and collaboration within our vibrant community.
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>

            </Box>
        </Container>
    );
};

export default About;