import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function ScrollableTabsButtonAuto() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
            <Tabs
                value={value}
                onChange={handleChange}

                textColor="secondary"
                indicatorColor='secondary'
                variant="scrollable" // ใช้การเลื่อนแบบ scrollable
                scrollButtons="auto" // ทำให้ปุ่ม scroll แสดงตลอดเวลา
                aria-label="scrollable auto tabs example"
            >
                <Tab label="Categories" />
                <Tab label="Categories" />
                <Tab label="Categories" />
                <Tab label="Categories" />
                <Tab label="Categories" />
                <Tab label="Categories" />
                <Tab label="Categories" />
            </Tabs>
        </Box>
    );
}