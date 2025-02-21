import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MediaCard from '../components/Card';
import Search from '../components/Search';

const MyAccountAdmin = () => {
    const [books, setBooks] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [newBook, setNewBook] = useState({
        name: '',
        author: '',
        price: '',
        detail: '',
        imageUrl: null
    });

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchBooks();
        const savedSearchQuery = localStorage.getItem('adminSearchQuery');
        if (savedSearchQuery) {
            setSearchQuery(savedSearchQuery);
        }
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        localStorage.setItem('adminSearchQuery', query);
    };

    const filteredBooks = books.filter(
        (book) =>
            book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleBookChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageUrl' && files) {
            setNewBook({ ...newBook, [name]: files[0] });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newBook).forEach(key => {
            formData.append(key, newBook[key]);
        });

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setOpenDialog(false);
            fetchBooks();
            setNewBook({ name: '', author: '', price: '', detail: '', imageUrl: null });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleEditBook = (book) => {
        setIsEditing(true);
        setSelectedBook(book);
        setNewBook({
            name: book.name,
            author: book.author,
            price: book.price,
            detail: book.detail,
            imageUrl: book.imageUrl
        });
        setOpenDialog(true);
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newBook).forEach(key => {
            formData.append(key, newBook[key]);
        });

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/products/${selectedBook._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setOpenDialog(false);
            setIsEditing(false);
            setSelectedBook(null);
            fetchBooks();
            setNewBook({ name: '', author: '', price: '', detail: '', imageUrl: null });
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedBook(null);
        setNewBook({ name: '', author: '', price: '', detail: '', imageUrl: null });
    };

    return (
        <Container maxWidth="lg" sx={{ mb: '300px' }}>
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h4">Book Inventory</Typography>
                <Box sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2
                }}>
                    <Box sx={{ flex: 1, maxWidth: '600px' }}>
                        <Search onSearch={handleSearch} searchQuery={searchQuery} />
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        color="success"
                        onClick={() => setOpenDialog(true)}
                    >
                        Add Book
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {filteredBooks.map((book) => (
                    <Grid item xs={12} sm={6} md={3} key={book._id}>
                        <MediaCard product={book} />
                        <Box sx={{
                            mt: 1,
                            display: 'flex',
                            
                            gap: 1
                        }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteBook(book._id)}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="outlined"
                                color="text.primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditBook(book)}
                            >
                                Edit
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={isEditing ? handleUpdateBook : handleAddBook} sx={{ mt: 2 }}>
                        <input type="text" name="name" value={newBook.name} onChange={handleBookChange} placeholder="Book Name" className="w-full p-2 border rounded" />
                        <input type="text" name="author" value={newBook.author} onChange={handleBookChange} placeholder="Author" className="w-full p-2 border rounded" />
                        <input type="number" name="price" value={newBook.price} onChange={handleBookChange} placeholder="Price" className="w-full p-2 border rounded" />
                        <textarea name="detail" value={newBook.detail} onChange={handleBookChange} placeholder="Detail" className="w-full p-2 border rounded" rows={4} />
                        <input type="file" name="imageUrl" onChange={handleBookChange} accept="image/*" className="w-full p-2 border rounded" />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button type="submit" variant="contained">
                                {isEditing ? 'Update' : 'Save'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default MyAccountAdmin;