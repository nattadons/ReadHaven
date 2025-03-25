import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function ScrollableTabsButtonAuto({ onCategoryChange }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        
        // ส่งค่าหมวดหมู่ที่เลือกกลับไปยัง parent component
        const categories = ["All", "Fantasy", "Novel", "Horror", "Knowledge", "Comics", "Drama"];
        onCategoryChange(categories[newValue]);
    };

    return (
        <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor='secondary'
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                <Tab label="All" />
                <Tab label="Fantasy" />
                <Tab label="Novel" />
                <Tab label="Horror" />
                <Tab label="Knowledge" />
                <Tab label="Comics" />
                <Tab label="Drama" />
            </Tabs>
        </Box>
    );


    
}
// ส่งค่า propTypes ให้กับ props ที่คาดหวัง    
ScrollableTabsButtonAuto.propTypes = {  
    onCategoryChange: PropTypes.func.isRequired, // ตรวจสอบว่า onCategoryChange เป็นฟังก์ชันและต้องมีการส่งค่าเข้ามา
    selectedCategory: PropTypes.string.isRequired, // ตรวจสอบว่า selectedCategory เป็น string และต้องมีค่า
};