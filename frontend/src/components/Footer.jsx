
import { Box, Container, Typography, Grid, Link, IconButton ,Divider} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YoutubeIcon from '@mui/icons-material/YouTube';
import LinkinIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: 'text.primary', color: 'primary.main', py: 3 ,}}>
            <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                <Grid container spacing={4} justifyContent="space-between" sx={{mb: 4}}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="body1" gutterBottom
                            sx={{
                                mb: 2,
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            At ReadHaven, we believe stories and knowledge can transform lives.
                        </Typography>
                        <Box>
                            <IconButton href="https://www.facebook.com" target="_blank" color="inherit">
                                <FacebookIcon />
                            </IconButton>
                            <IconButton href="https://www.instagram.com" target="_blank" color="inherit">
                                <InstagramIcon />
                            </IconButton>
                            <IconButton href="https://www.twitter.com" target="_blank" color="inherit">
                                <TwitterIcon />
                            </IconButton>
                            <IconButton href="https://www.youtube.com" target="_blank" color="inherit">
                                <YoutubeIcon />
                            </IconButton>
                            <IconButton href="https://www.linkin.com" target="_blank" color="inherit">
                                <LinkinIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography  variant="body1" gutterBottom sx ={{fontWeight:'bold'}}>
                            Product
                        </Typography>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Features
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
                            Pricing
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Reviews
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="body1" gutterBottom sx ={{fontWeight:'bold'}}>
                            Company
                        </Typography>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            About
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Contact us
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Blog
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="body1" gutterBottom sx ={{fontWeight:'bold'}}>
                            Support
                        </Typography>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
                            Getting started
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Help center
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Server status
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography  variant="body1" gutterBottom sx ={{fontWeight:'bold'}}>
                            Contacts us
                        </Typography>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
                            fnik567@gmail.com
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
                            083-0003469
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block', mb: 1 , textDecoration: 'none'}}>
                            Suthep, Muang Chiang Mai, Chiang Mai 50200
                        </Link>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4, borderColor: 'primary.main' }} />
                <Typography variant="body1" align="left" sx={{ mt: 4 }}>
                    &copy; {new Date().getFullYear()} BookHaven. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;