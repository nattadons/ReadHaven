import axios from 'axios';
import { useEffect, useState } from 'react';

const TestImage = () => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            if (!token) {
                setError('No token found - please login first');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (isMounted) {
                    console.log('Image data:', response.data);
                    setImage(response.data);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error:', err);
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [token]);

    console.log('Image:', image?.imageUrl);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!image?.imageUrl) {
        return <div>No image available</div>;
    }

    return (
        <div>
            <h1>My Account</h1>
            {image?.imageUrl && (
                <img 
                    src={image.imageUrl} 
                    referrerPolicy="no-referrer"
                    alt="User profile" 
                    style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '50%'
                    }}
                />
            )}
            <h2>{image.name}</h2>
            <p>{image.email}</p>
        </div>
    );
};

export default TestImage;