
import { useEffect, useState } from 'react';
import  {CircularProgress,Box} from '@mui/material';

const TestImage = () => {
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
    }, []);


    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
               <CircularProgress color='text.primary'size="4rem" />
            </Box>
        );
    }
    return (
        <div>
            <h1>My Account</h1>
           
        </div>
    );
};

export default TestImage;