import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';


const MediaCard = ({ product }) => {
    const navigate = useNavigate();


    const handleCardClick = () => {
        navigate(`/book/${product._id}`);
    };


    return (
        <Card sx={{ maxWidth: 350 }} onClick={handleCardClick}>
            <CardMedia
                component="img"
                sx={{ height: 230 }}
                image={product.image_product}
                alt={product.name}
                referrerPolicy="no-referrer"
            />

            <CardContent sx={{ height: 120 }}>
                <Typography gutterBottom fontWeight="medium" fontSize="20px" sx={{ color: 'text.primary' }}>
                    {product.name}
                </Typography>
                <Typography sx={{ fontSize: '18px', color: 'text.primary' }} >
                    By {product.author}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 2, // จำกัดจำนวนบรรทัดที่แสดง
                        fontSize: '16px'
                    }}
                >
                    {product.detail}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button size="large" sx={{ fontSize: "20px", backgroundColor: 'text.primary', color: "primary.main" }} > ฿ {product.price.toFixed(2)}</Button>
                </Box>
            </CardActions>
        </Card>
    );
};

// กำหนด propTypes ให้กับ props ของคอมโพเนนต์
MediaCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        author: PropTypes.string,
        type: PropTypes.string,
        price: PropTypes.number,
        detail: PropTypes.string,
        overview: PropTypes.string,
        image_product: PropTypes.string.isRequired,
    }).isRequired,
};

export default MediaCard;