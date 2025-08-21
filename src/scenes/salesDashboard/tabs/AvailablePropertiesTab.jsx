// src/components/tabs/AvailablePropertiesTab.jsx

import React from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Card, CardMedia, CardContent, Divider, Stack, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useProjectPropertyBooksData from '../../../hooks/getProjectPropertyBooksDataHook'; // استيراد الـ hook

// --- الأيقونات ---
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";

// --- مكون البطاقة ---
const PropertyBookCard = ({ book }) => {
    const colors = tokens(useTheme().palette.mode);
    return (
        <Card sx={{ backgroundColor: colors.primary[700], borderRadius: '12px', height: '100%' }}>
            <CardMedia component="img" height="160" image={book.diagram_image} alt={book.model} />
            <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{book.model}</Typography>
                <Typography variant="h4" color={colors.greenAccent[400]} sx={{ mb: 2 }}>
                    ${parseFloat(book.price).toLocaleString()}
                </Typography>
                <Divider />
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={6}><Stack direction="row" spacing={1}><SquareFootIcon fontSize="small" /> <Typography variant="body2">{book.space} m²</Typography></Stack></Grid>
                    <Grid item xs={6}><Stack direction="row" spacing={1}><BedIcon fontSize="small" /> <Typography variant="body2">{book.number_of_rooms} Rooms</Typography></Stack></Grid>
                    <Grid item xs={6}><Stack direction="row" spacing={1}><BathtubIcon fontSize="small" /> <Typography variant="body2">{book.number_of_bathrooms} Baths</Typography></Stack></Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};


const AvailablePropertiesTab = ({ projectId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // استدعاء الـ hook داخل المكون نفسه
    const { propertyBooks, loading, error } = useProjectPropertyBooksData({ projectId });

    return (
        <Box p={{ xs: 1, sm: 2, md: 3 }}>
            <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>
                Available Units & Models
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">Failed to load properties.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {propertyBooks.length > 0 ? (
                        propertyBooks.map((book) => (
                            <Grid item xs={12} sm={6} md={4} key={book.id}>
                                <PropertyBookCard book={book} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No specific property models have been added for this project yet.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
};

export default AvailablePropertiesTab;