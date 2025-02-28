import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
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
    // เพิ่ม state สำหรับ dialog ยืนยันการลบและบันทึก
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [openSaveConfirm, setOpenSaveConfirm] = useState(false);
    

    const [newBook, setNewBook] = useState({
        name: '',
        author: '',
        price: '',
        detail: '',
        overview: '',
        image_product: '',
    });





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
                withCredentials: true,
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


   
    // ปรับปรุงฟังก์ชัน handleAddBook ให้แสดง dialog ยืนยันก่อน
    const handleAddBook = (e) => {
        e.preventDefault();

        if (newBook.name.trim() === '') {
            alert("please enter the correct name of the product");
            return false;
        }

        if (newBook.price.trim() === '' || newBook.price <= 0) {
            alert("please enter the correct price of the product");
            return false;
        }

        // เปิด dialog ยืนยันการบันทึก
        setOpenSaveConfirm(true);
    };

    // เพิ่มฟังก์ชันสำหรับการบันทึกหลังจากยืนยัน
    const confirmSave = async () => {
        try {
            if (isEditing) {
                // กรณีแก้ไข
                const formData = new FormData();
                Object.keys(newBook).forEach(key => {
                    formData.append(key, newBook[key]);
                });
                
                await axios.put(`${import.meta.env.VITE_API_URL}/products/update/${selectedBook._id}`, formData, {
                    withCredentials: true,
                });
                setIsEditing(false);
                setSelectedBook(null);
            } else {
                // กรณีเพิ่มใหม่
                await axios.post(`${import.meta.env.VITE_API_URL}/products/add`, newBook, {
                    withCredentials: true,
                });
            }
            
            setOpenSaveConfirm(false);
            setOpenDialog(false);
            fetchBooks();
            setNewBook({ name: '', author: '', price: '', detail: '', overview: '', image_product: '' });
        } catch (error) {
            console.error('Error saving book:', error);
            setOpenSaveConfirm(false);
        }
    };

    const handleEditBook = (book) => {
        setIsEditing(true);
        setSelectedBook(book);


        // [ปรับปรุง 3] เพิ่ม overview ในการตั้งค่า newBook สำหรับการแก้ไข
        setNewBook({
            name: book.name,
            author: book.author,
            price: book.price,
            detail: book.detail,
            overview: book.overview || '',
            image_product: book.image_product || '',
        });
        setOpenDialog(true);
    };

    // ปรับเปลี่ยนฟังก์ชัน handleUpdateBook ให้เปิด dialog ยืนยัน
    const handleUpdateBook = (e) => {
        e.preventDefault();

        if (newBook.name.trim() === '') {
            alert("please enter the correct name of the product");
            return false;
        }

        if (newBook.price.trim() === '' || newBook.price <= 0) {
            alert("please enter the correct price of the product");
            return false;
        }

        // เปิด dialog ยืนยันการบันทึก
        setOpenSaveConfirm(true);
    };

    // ปรับเปลี่ยนการลบให้แสดง dialog ยืนยันก่อน
    const handleDeleteConfirmation = (book) => {
        setBookToDelete(book);
        setOpenDeleteConfirm(true);
    };

    // เพิ่มฟังก์ชันสำหรับการลบหลังจากยืนยัน
    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/delete/${bookToDelete._id}`, {
                withCredentials: true,
            });
            setOpenDeleteConfirm(false);
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            setOpenDeleteConfirm(false);
        }
    };

    
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedBook(null);
        // [ปรับปรุง 5] เพิ่ม overview ในการ reset สถานะ newBook เมื่อปิด dialog
        setNewBook({ name: '', author: '', price: '', detail: '', overview: '', image_product: '' });
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
                                onClick={() => handleDeleteConfirmation(book)}
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






            {/* [ปรับปรุง 6] แทนที่ Dialog ทั้งหมดด้วยโค้ดใหม่ที่ปรับปรุงตาม UI ในภาพ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{
                sx: {
                    borderRadius: '8px',

                }
            }}>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {isEditing ? 'Edit Book' : 'Your Product'}
                </DialogTitle>
                <DialogContent sx={{ mt: "30px", mb: "30px" }}>
                    <Box component="form" onSubmit={isEditing ? handleUpdateBook : handleAddBook} sx={{ mt: 2, mx: 2 }}>
                        {/* Name Field */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Name
                            </Typography>
                            <input
                                type="text"
                                name="name"
                                value={newBook.name}
                                onChange={handleBookChange}
                                placeholder="Name"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </Box>

                        {/* Author Field */}
                        <Box sx={{ mb: 3, width: '100%' }} >
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Author
                            </Typography>
                            <input
                                type="text"
                                name="author"
                                value={newBook.author}
                                onChange={handleBookChange}
                                placeholder="Author"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </Box>

                        {/* Price Field */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Price
                            </Typography>
                            <input
                                type="number"
                                name="price"
                                value={newBook.price}
                                onChange={handleBookChange}
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </Box>

                        {/* Detail Field */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Detail
                            </Typography>

                            <textarea
                                name="detail"
                                value={newBook.detail}
                                onChange={handleBookChange}
                                placeholder="Detail"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    minHeight: '100px',
                                    resize: 'vertical',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </Box>

                        {/* Image Upload Field */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    border: '1px dashed #ccc',
                                    borderRadius: '4px',
                                    p: 2,
                                    boxSizing: 'border-box',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, }}>

                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',

                                        }}
                                    >

                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            Upload Image
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Select and upload the files of your choice
                                        </Typography>


                                    </Box>

                                </Box>

                                <Box
                                    sx={{
                                        border: '1px dashed #ccc',
                                        borderRadius: '4px',
                                        p: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#f9f9f9'
                                    }}
                                >
                                    <img
                                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E"
                                        alt="Upload"
                                        style={{ marginBottom: '16px' }}
                                    />
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Choose a file or drag & drop it here
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        JPEG, PNG, PDF, and MP4 formats, up to 50MB
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '20px',
                                            px: 3
                                        }}
                                    >
                                        Browse File
                                    </Button>
                                    <input
                                        type="file"
                                        name="image_product"
                                        onChange={handleBookChange}
                                        accept="image/*"
                                        style={{
                                            opacity: 0,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Overview Field - เพิ่มฟิลด์ใหม่ */}

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Overview
                            </Typography>

                            <textarea
                                name="overview"
                                value={newBook.overview}
                                onChange={handleBookChange}
                                placeholder="Overview"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    minHeight: '100px',
                                    resize: 'vertical',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </Box>



                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={handleCloseDialog}
                                sx={{
                                    flex: 1,
                                    mr: 1,
                                    borderColor: '#ddd',
                                    color: '#333',
                                    borderRadius: '4px',
                                    py: 1.5
                                }}
                            >
                                CANCEL
                            </Button>
                            <Button
                                type="submit"
                                
                                variant="contained"
                                sx={{
                                    flex: 1,
                                    ml: 1,
                                    bgcolor: '#222',
                                    borderRadius: '4px',
                                    py: 1.5,
                                    color: '#fff'

                                }}
                            >
                                SAVE
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* เพิ่ม Dialog สำหรับยืนยันการลบ */}
            <Dialog
                open={openDeleteConfirm}
                onClose={() => setOpenDeleteConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        width: '400px'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete <strong>{bookToDelete?.name}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button 
                        onClick={() => setOpenDeleteConfirm(false)} 
                        sx={{
                            borderColor: '#ddd',
                            color: '#333',
                            borderRadius: '4px',
                            py: 1
                        }}
                        variant="outlined"
                    >
                        CANCEL
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        color="error"
                        variant="contained"
                        autoFocus
                        sx={{
                            borderRadius: '4px',
                            py: 1
                        }}
                    >
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>

            {/* เพิ่ม Dialog สำหรับยืนยันการบันทึก */}
            <Dialog
                open={openSaveConfirm}
                onClose={() => setOpenSaveConfirm(false)}
                aria-labelledby="save-dialog-title"
                aria-describedby="save-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        width: '400px'
                    }
                }}
            >
                <DialogTitle id="save-dialog-title" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Confirm Save
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="save-dialog-description">
                        {isEditing 
                            ? `Are you sure you want to update "${newBook.name}"?` 
                            : `Are you sure you want to add "${newBook.name}" to your products?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button 
                        onClick={() => setOpenSaveConfirm(false)} 
                        sx={{
                            borderColor: '#ddd',
                            color: '#333',
                            borderRadius: '4px',
                            py: 1
                        }}
                        variant="outlined"
                    >
                        CANCEL
                    </Button>
                    <Button 
                        onClick={confirmSave} 
                        variant="contained"
                        autoFocus
                        sx={{
                            bgcolor: '#222',
                            borderRadius: '4px',
                            py: 1,
                            color: '#fff'
                        }}
                    >
                        CONFIRM
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyAccountAdmin;