import React, { useState, useEffect } from "react";
import {
  Box, Typography, useTheme, Grid, Dialog, DialogTitle,
  DialogContent, IconButton, Stack, Button, Divider, Paper, Chip
} from "@mui/material";

import { useNavigate } from "react-router-dom"; 

import { tokens } from "../../theme";
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import LayersIcon from '@mui/icons-material/Layers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // أيقونة للفيديو
import ImageIcon from '@mui/icons-material/Image'; // أيقونة للصور
import EditSaleDialog from "./EditSaleDialog";

const SaleDetailDialog = ({ open, onClose, sale,onUpdateSuccess }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    // الحالة لتتبع أي وسائط (صورة/فيديو) يتم عرضها حاليًا
    const [activeMedia, setActiveMedia] = useState({ url: '', type: 'image', label: 'Main' });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        if (sale && sale.main_image) {
            setActiveMedia({ url: sale.main_image, type: 'image', label: 'Main' });
        }
    }, [sale]);

    if (!sale) return null;


    const handleEditClick = () => {
        setIsEditDialogOpen(true); // فقط افتح ديالوج التعديل
    };
    
    const handleEditSuccess = () => {
        setIsEditDialogOpen(false); // أغلق ديالوج التعديل
        onUpdateSuccess(); // أبلغ المكون الأب بالتحديث
    };


    const mediaItems = [
        { url: sale.main_image, type: 'image', label: 'Main' },
        { url: sale.diagram_image, type: 'image', label: 'Diagram' },
        { url: sale.video_url, type: 'video', label: 'Video' }
    ].filter(item => item && item.url);

    return (
        <>
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="lg" 
            PaperProps={{ 
                sx: { 
                    backgroundColor: colors.primary[800], 
                    height: '95vh',
                    borderRadius: '15px'
                } 
            }}
        >
            <DialogTitle sx={{ p: 0, position: 'relative' }}>
                 <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, display: 'flex', gap: 1 }}>
                    
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        Edit
                    </Button>
                    <IconButton onClick={onClose} sx={{ backgroundColor: 'rgba(0,0,0,0.4)', '&:hover': {backgroundColor: 'rgba(0,0,0,0.6)'} }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, overflowY: 'auto' }}>

                <Box 
                    sx={{ 
                        height: '400px', position: 'relative', display: 'flex', flexDirection: 'column',
                        justifyContent: 'flex-end', color: 'white', backgroundImage: `url(${sale.main_image})`,
                        backgroundSize: 'cover', backgroundPosition: 'center', p: 4
                    }}
                >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 80%)' }} />
                    <Box sx={{ zIndex: 1 }}>
                        <Chip label={sale.type} size="small" sx={{ mb: 1, backgroundColor: colors.greenAccent[600], color: 'white' }} />
                        <Typography variant="h2" fontWeight="bold">{sale.main_title}</Typography>
                        <Typography variant="h6" color={colors.grey[300]}>{sale.address}</Typography>
                    </Box>
                </Box>

                <Box p={{ xs: 2, sm: 3, md: 4 }}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>About This Project</Typography>
                            <Typography paragraph sx={{ mb: 3, lineHeight: 1.8 }}>{sale.marketing_description}</Typography>
                            <Paper elevation={0} sx={{ p: 2, backgroundColor: colors.primary[700], borderRadius: '8px' }}>
                                <Typography variant="h6" gutterBottom>Key Features</Typography>
                                <Divider sx={{ mb: 2 }}/>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><Stack direction="row" spacing={1}><SquareFootIcon fontSize="small" color="secondary"/> <Typography variant="body2">Area: {sale.area} m²</Typography></Stack></Grid>
                                    <Grid item xs={6}><Stack direction="row" spacing={1}><LayersIcon fontSize="small" color="secondary"/> <Typography variant="body2">Floors: {sale.number_of_floor}</Typography></Stack></Grid>
                                    <Grid item xs={6}><Stack direction="row" spacing={1}><AttachMoneyIcon fontSize="small" color="secondary"/> <Typography variant="body2">Cost: ${sale.expected_cost?.toLocaleString()}</Typography></Stack></Grid>
                                    <Grid item xs={6}><Stack direction="row" spacing={1}><EventIcon fontSize="small" color="secondary"/> <Typography variant="body2">Completion: {new Date(sale.expected_date_of_completed).toLocaleDateString()}</Typography></Stack></Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} md={5}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h5" color={colors.greenAccent[400]}>Media Gallery</Typography>
                                {/* --- عرض اسم الوسائط الحالية --- */}
                                <Chip icon={<ImageIcon/>} label={activeMedia.label} variant="outlined" size="small"/>
                            </Box>
                            <Box sx={{ width: '100%', height: '200px', backgroundColor: colors.primary[900], mb: 1.5, borderRadius: '8px', overflow: 'hidden' }}>
                                {activeMedia.type === 'image' ? (
                                    <img src={activeMedia.url} alt={activeMedia.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <video src={activeMedia.url} controls autoPlay muted loop style={{ width: '100%', height: '100%' }} />
                                )}
                            </Box>
                            <Stack direction="row" spacing={1.5}>
                                {mediaItems.map(media => (
                                    <Box 
                                        key={media.url}
                                        onClick={() => setActiveMedia(media)}
                                        sx={{ 
                                            position: 'relative', // لجعل أيقونة الفيديو تتمركز
                                            width: 80, height: 60, borderRadius: '8px', cursor: 'pointer', overflow: 'hidden',
                                            border: `3px solid ${activeMedia.url === media.url ? colors.greenAccent[400] : 'transparent'}`,
                                            transition: 'border-color 0.2s ease',
                                            '&:hover > .overlay': { opacity: 1 } // إظهار الأيقونة عند الـ hover
                                        }}
                                    >
                                        <img src={media.type === 'image' ? media.url : sale.main_image} alt={media.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                        {/* --- إضافة أيقونة الفيديو فوق الصورة المصغرة --- */}
                                        {media.type === 'video' && (
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', opacity: activeMedia.url === media.url ? 1 : 0.6,
                                                    transition: 'opacity 0.2s ease'
                                                }}
                                            >
                                                <PlayCircleOutlineIcon fontSize="large"/>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                            <Button variant="contained" startIcon={<MapIcon />} href={sale.location_link} target="_blank" fullWidth sx={{ mt: 4, backgroundColor: colors.blueAccent[600], '&:hover': { backgroundColor: colors.blueAccent[700] } }}>
                                View Location on Map
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>

{isEditDialogOpen && (
    <EditSaleDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        saleData={sale}
        onSuccess={handleEditSuccess}
    />
)}
</>
    );
};

export default SaleDetailDialog;