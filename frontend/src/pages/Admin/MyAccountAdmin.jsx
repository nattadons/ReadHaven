import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MediaCard from '../../components/Card';
import Search from '../../components/Search';
import Pagination from '@mui/material/Pagination';

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
    const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading
    // เพิ่ม state ใหม่เพื่อติดตามไฟล์ที่เลือกและตัวอย่างของมัน
    const [filePreview, setFilePreview] = useState(null);

    const [newBook, setNewBook] = useState({
        name: '',
        author: '',
        type: '',
        price: '',
        detail: '',
        overview: '',
        image_product: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const booksPerPage = 8; // Keep your existing value

    useEffect(() => {
        fetchBooks();
        const savedSearchQuery = localStorage.getItem('adminSearchQuery');
        if (savedSearchQuery) {
            setSearchQuery(savedSearchQuery);
        }
    }, []);

    // Update fetchBooks to include pagination
    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${booksPerPage}`, {
                withCredentials: true,
            });
            setBooks(response.data.products);
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        localStorage.setItem('adminSearchQuery', query);
        setCurrentPage(1);

        if (query) {
            // When searching, we might need to fetch all products first
            axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                withCredentials: true,
            })
                .then((response) => {
                    const allProducts = response.data.products || [];
                    const filtered = allProducts.filter(
                        (book) =>
                            book.name.toLowerCase().includes(query.toLowerCase()) ||
                            (book.author && book.author.toLowerCase().includes(query.toLowerCase()))
                    );
                    setBooks(filtered);
                })
                .catch((error) => {
                    console.error('Error fetching data for search:', error);
                    setBooks([]);
                });
        } else {
            // If search is cleared, get regular paginated results
            fetchBooks(1);
        }
    };

    // Update the page change handler
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        fetchBooks(page);
    };

    const filteredBooks = books.filter(
        (book) =>
            book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    
    const displayedBooks = searchQuery
        ? filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)
        : books; // If not searching, books already contains the right page from the server

        
    const handleBookChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image_product' && files) {

            if (filePreview?.url) {
                URL.revokeObjectURL(filePreview.url); // เคลียร์ URL เก่าก่อน
            }
        
            const previewUrl = URL.createObjectURL(files[0]);
            setFilePreview({
                name: files[0].name,
                size: files[0].size,
                url: previewUrl
            });
        
            setNewBook({ ...newBook, [name]: files[0] });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    // ปรับปรุงฟังก์ชัน handleAddBook ให้แสดง dialog ยืนยันก่อน
    const handleAddBook = (e) => {
        e.preventDefault();

        // แก้ไขการตรวจสอบ: ต้องแน่ใจว่า name เป็น string ก่อนใช้ trim()
        if (typeof newBook.name === 'string' && newBook.name.trim() === '') {
            alert("please enter the correct name of the product");
            return false;
        }

        // แก้ไขการตรวจสอบ: ตรวจสอบว่า price เป็นค่าที่ถูกต้อง
        const price = parseFloat(newBook.price);
        if (isNaN(price) || price <= 0) {
            alert("please enter the correct price of the product");
            return false;
        }

        // เปิด dialog ยืนยันการบันทึก
        setOpenSaveConfirm(true);
    };

    // เพิ่มฟังก์ชันสำหรับการบันทึกหลังจากยืนยัน
    const confirmSave = async () => {
        try {
            setLoading(true); // เริ่มโหลด

            // FormData สำหรับเก็บข้อมูลและไฟล์รูปภาพ
            const formData = new FormData();
            Object.keys(newBook).forEach(key => {
                formData.append(key, newBook[key]);
            });

            if (isEditing) {
                // กรณีแก้ไข


                await axios.put(`${import.meta.env.VITE_API_URL}/products/update/${selectedBook._id}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("แก้ไขข้อมูลเรียบร้อยแล้ว");

                setIsEditing(false);
                setSelectedBook(null);
            } else {
                // กรณีเพิ่มใหม่
                await axios.post(`${import.meta.env.VITE_API_URL}/products/add`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("เพิ่มข้อมูลเรียบร้อยแล้ว");
            }
            setLoading(false);
            setOpenSaveConfirm(false);
            setOpenDialog(false);
            fetchBooks();
            setNewBook({ name: '', author: '', price: '', detail: '', overview: '', image_product: '' });
        } catch (error) {
            console.error('Error saving book:', error);
            setLoading(false);
            setOpenSaveConfirm(false);
        }
    };

    const handleEditBook = (book) => {
        setIsEditing(true);
        setSelectedBook(book);

        // [ปรับปรุง 3] เพิ่ม overview ในการตั้งค่า newBook สำหรับการแก้ไข
        setNewBook({
            name: book.name || '',
            author: book.author || '',
            type: book.type || '',
            price: book.price || '',
            detail: book.detail || '',
            overview: book.overview || '',
            image_product: book.image_product || '',
        });

        // ถ้าหนังสือมีรูปภาพ ให้สร้างตัวอย่าง
        if (book.image_product && typeof book.image_product === 'string' && book.image_product.startsWith('http')) {
            setFilePreview({
                name: 'รูปภาพปัจจุบัน',
                size: 0,
                url: book.image_product
            });
        } else {
            setFilePreview(null);
        }

        setOpenDialog(true);
    };

    // ปรับเปลี่ยนฟังก์ชัน handleUpdateBook ให้เปิด dialog ยืนยัน
    const handleUpdateBook = (e) => {
        e.preventDefault();

        // แก้ไขการตรวจสอบ: เมื่อแก้ไข ไม่จำเป็นต้องตรวจสอบทุกฟิลด์
        // เราจะเปิด dialog ยืนยันการบันทึกได้เลย
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
            setLoading(true); // เริ่มโหลด
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/delete/${bookToDelete._id}`, {
                withCredentials: true,
            });

            console.log("ลบข้อมูลเรียบร้อยแล้ว");
            setLoading(false);
            setOpenDeleteConfirm(false);
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            setLoading(false);
            setOpenDeleteConfirm(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditing(false);
        setSelectedBook(null);
        // [ปรับปรุง 5] เพิ่ม overview ในการ reset สถานะ newBook เมื่อปิด dialog
        setNewBook({ name: '', author: '', type: '', price: '', detail: '', overview: '', image_product: '' });
        setFilePreview(null); // ล้างตัวอย่างไฟล์
    };

    // ล้าง URL objects เพื่อหลีกเลี่ยงการรั่วไหลของหน่วยความจำ
    useEffect(() => {
        return () => {
            if (filePreview?.url){
                URL.revokeObjectURL(filePreview.url);
            }
        };
    }, [filePreview]);




    // เพิ่มฟังก์ชันใหม่สำหรับการลบรูปภาพ 
    const handleDeleteImage = () => {
        // ล้าง URL ของรูปภาพ preview เพื่อป้องกันการรั่วไหลของหน่วยความจำ
        if (filePreview && filePreview.url) {
            URL.revokeObjectURL(filePreview.url);
        }

        // รีเซ็ตค่า filePreview และ image_product ใน newBook
        setFilePreview(null);
        setNewBook({ ...newBook, image_product: '' });
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
                {displayedBooks.map((book) => (
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
                                sx={{ minWidth: '100px' }}


                            >
                                Delete
                            </Button>
                            <Button
                                variant="outlined"
                                color="text.primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditBook(book)}
                                sx={{ minWidth: '100px' }}
                            >
                                Edit
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>




            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        shape="rounded"
                    />
                </Box>
            )}

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
                          {/* type Field */}
                          <Box sx={{ mb: 3, width: '100%' }} >
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                Type
                            </Typography>
                            <input
                                type="text"
                                name="type"
                                value={newBook.type}
                                onChange={handleBookChange}
                                placeholder="Type"
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
                        {/* ส่วนอัพโหลดรูปภาพ */}
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
                                    {/* ปุ่มลบรูปภาพ - เพิ่มปุ่มลบที่มุมขวาบน */}
                                    <Button
                                        onClick={handleDeleteImage}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            minWidth: '32px',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            p: 0,
                                            color: 'error.main',
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 1)',
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </Button>
                                </Box>

                                {filePreview ? (
                                    // แสดงตัวอย่างถ้ามีการเลือกไฟล์
                                    <Box
                                        sx={{
                                            border: '1px dashed #ccc',
                                            borderRadius: '4px',
                                            p: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#f9f9f9',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* ตัวอย่างรูปภาพ */}
                                        <Box sx={{ mb: 2, position: 'relative', width: '100%', maxWidth: '200px', height: '150px' }}>
                                            <img
                                                src={filePreview.url}
                                                alt="ตัวอย่าง"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </Box>

                                        {/* ข้อมูลไฟล์ */}
                                        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                            {filePreview.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {(filePreview.size / 1024).toFixed(1)} KB
                                        </Typography>

                                        {/* ปุ่มเปลี่ยน */}
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderRadius: '20px',
                                                px: 3,
                                                color: 'green',
                                            }}
                                        >
                                            Change Image
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
                                ) : (
                                    // UI การอัพโหลดเดิมเมื่อไม่มีการเลือกไฟล์
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
                                            alt="อัพโหลด"
                                            style={{ marginBottom: '16px' }}
                                        />
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Select files or drag and drop here
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            JPEG, PNG, PDF and MP4 formats, size not exceeding 10MB.
                                        </Typography>

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
                                )}
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
                    {loading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <CircularProgress color='text.primary' size="4rem" />
                        </Box>
                    ) : (
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete <strong>{bookToDelete?.name}</strong>? This action cannot be undone.
                        </DialogContentText>
                    )}
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
                        disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
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
                        disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
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
                        width: '400px',
                        position: 'relative'
                    }
                }}
            >
                <DialogTitle id="save-dialog-title" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Confirm Save
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', minHeight: '80px' }}>
                    {loading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <CircularProgress color='text.primary' size="4rem" />
                        </Box>
                    ) : (
                        <DialogContentText id="save-dialog-description">
                            {isEditing
                                ? `Are you sure you want to update "${newBook.name}"?`
                                : `Are you sure you want to add "${newBook.name}" to your products?`}
                        </DialogContentText>
                    )}
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
                        disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
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
                        disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
                    >
                        CONFIRM
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyAccountAdmin;