import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

// eslint-disable-next-line react/prop-types
const LabeledTextField = ({ label, id, name, value, onChange, type = 'text', autoComplete, autoFocus = false, required = false }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
                {label}
            </Typography>
            <TextField
                margin="normal"
                required={required}
                fullWidth
                id={id}
                label={label}
                name={name}
                type={type}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                value={value}
                onChange={onChange}
            />
        </Box>
    );
};

export default LabeledTextField;