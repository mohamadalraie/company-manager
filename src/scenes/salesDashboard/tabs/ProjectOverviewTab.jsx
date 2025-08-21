// src/components/tabs/ProjectOverviewTab.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Divider, Stack, useTheme } from '@mui/material';
import { tokens } from '../../../theme';

// --- الأيقونات ---
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import MapIcon from '@mui/icons-material/Map';
import VideocamIcon from '@mui/icons-material/Videocam';

// --- (مكون FeatureCard يبقى كما هو) ---
const FeatureCard = ({ icon, label, value }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box sx={{ p: 2, backgroundColor: colors.primary[700], borderRadius: '10px', display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box color={colors.greenAccent[400]} sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {React.cloneElement(icon, { style: { fontSize: '2rem' } })}
            </Box>
            <Box>
                <Typography variant="h5" fontWeight="bold">{value}</Typography>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
        </Box>
    );
};


const ProjectOverviewTab = ({ sale }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [activeMedia, setActiveMedia] = useState({ url: '', type: 'image' });

    useEffect(() => {
        if (sale && sale.main_image) {
            setActiveMedia({ url: sale.main_image, type: 'image' });
        }
    }, [sale]);

    if (!sale) return null;

    const mediaItems = [
        { url: sale.main_image, type: 'image', label: 'Main' },
        { url: sale.diagram_image, type: 'image', label: 'Diagram' },
        { url: sale.video_url, type: 'video', label: 'Video' },
    ].filter(item => item && item.url);

    return (
        <Box p={{ xs: 1, sm: 2, md: 3 }}>
            <Stack spacing={4}>
                {/* --- (الأقسام الأخرى تبقى كما هي) --- */}
                <Box>
                    <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom> About This Project </Typography>
                    <Typography sx={{ lineHeight: 1.8, color: colors.grey[300] }}> {sale.marketing_description} </Typography>
                    <Button sx={{ mt: 2, backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] } }} variant="contained" startIcon={<MapIcon />} href={sale.location_link} target="_blank" > View Location on Map </Button>
                </Box>
                <Divider />
                <Box>
                     <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom> Project Main Features </Typography>
                    <Grid container spacing={2}>
                       <Grid item xs={6} md={3}> <FeatureCard icon={<SquareFootIcon />} label="Area" value={`${sale.project.area} m²`} /> </Grid>
                       <Grid item xs={6} md={3}> <FeatureCard icon={<HouseOutlinedIcon />} label="Properties" value={sale.project.number_of_floor} /> </Grid>
                       <Grid item xs={6} md={3}> <FeatureCard icon={<AttachMoneyIcon />} label="Expected Cost" value={`$${sale.project.expected_cost?.toLocaleString()}`} /> </Grid>
                       <Grid item xs={6} md={3}> <FeatureCard icon={<EventIcon />} label="Completion date" value={new Date(sale.project.expected_date_of_completed).toLocaleDateString()} /> </Grid>
                    </Grid>
                </Box>
                <Divider />

                {/* --- Section 3: Media Gallery (النسخة المصححة) --- */}
                <Box>
                    <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>
                        Media Gallery
                    </Typography>
                    <Box sx={{ width: '100%', height: { xs: '300px', md: '450px' }, backgroundColor: colors.primary[900], mb: 1.5, borderRadius: '8px', overflow: 'hidden' }}>
                        {activeMedia.url && ( activeMedia.type === 'image' ? ( <img src={activeMedia.url} alt="Project media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> ) : ( <video src={activeMedia.url} controls autoPlay muted loop style={{ width: '100%', height: '100%' }} /> ))}
                    </Box>
                    
                    {/* --- الصور المصغرة مع الأسماء --- */}
                    <Stack direction="row" spacing={1.5} justifyContent="center">
                        {mediaItems.map((media) => (
                            <Box
                                key={media.url}
                                onClick={() => setActiveMedia(media)}
                                sx={{
                                    position: 'relative', // ✅ لجعل النص يتمركز بالنسبة للصورة
                                    width: 100,
                                    height: 70,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    border: `3px solid ${activeMedia.url === media.url ? colors.greenAccent[400] : 'transparent'}`,
                                    transition: 'border-color 0.2s ease',
                                }}
                            >
                                {media.type === 'image' ? (
                                    <img src={media.url} alt={media.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary[900], color: colors.grey[300] }}>
                                        <VideocamIcon />
                                    </Box>
                                )}
                                {/* ✅ --- هذا هو الجزء المضاف لعرض الاسم --- */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        textAlign: 'center',
                                        py: 0.5,
                                    }}
                                >
                                    <Typography variant="caption">{media.label}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default ProjectOverviewTab;