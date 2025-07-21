import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 👈 استيراد أدوات التوجيه
import {
  Box, Typography, useTheme, Grid, Paper, Chip,
  Tab, Card, CardMedia, CardContent, CircularProgress, Alert,
  Stack, Button, Divider
} from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';

// --- الأيقونات ---
import ApartmentIcon from '@mui/icons-material/Apartment';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import MapIcon from '@mui/icons-material/Map';
import LayersIcon from '@mui/icons-material/Layers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- المكونات والأدوات ---
import { tokens } from "../../theme";
import { Header } from "../../components/Header";
import useProjectPropertyBooksData from "../../hooks/getProjectPropertyBooksDataHook";
import useSingleProjectSaleData from "../../hooks/getSingleProjectToSaleDataHook"; // 👈 Hook لجلب بيانات المشروع الواحد

// ====================================================================
// == مكونات فرعية (تبقى كما هي)
// ====================================================================
// ====================================================================
// == مكون فرعي لعرض بطاقة العقار (Property Book)
// ====================================================================
const PropertyBookCard = ({ book }) => {
  const colors = tokens(useTheme().palette.mode);
  return (
      <Card sx={{ backgroundColor: colors.primary[700], borderRadius: '12px', height: '100%' }}>
          <CardMedia
              component="img"
              height="160"
              image={book.diagram_image}
              alt={book.model}
          />
          <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>{book.model}</Typography>
              <Typography variant="h4" color={colors.greenAccent[400]} sx={{ mb: 2 }}>
                  ${parseFloat(book.price).toLocaleString()}
              </Typography>
              <Divider />
              <Grid container spacing={1} mt={1}>
                  <Grid item xs={6}><Stack direction="row" spacing={1}><SquareFootIcon fontSize="small"/> <Typography variant="body2">{book.space} m²</Typography></Stack></Grid>
                  <Grid item xs={6}><Stack direction="row" spacing={1}><BedIcon fontSize="small"/> <Typography variant="body2">{book.number_of_rooms} Rooms</Typography></Stack></Grid>
                  <Grid item xs={6}><Stack direction="row" spacing={1}><BathtubIcon fontSize="small"/> <Typography variant="body2">{book.number_of_bathrooms} Baths</Typography></Stack></Grid>
              </Grid>
          </CardContent>
      </Card>
  );
};
// ------------------------------------------------------------------------------------------

// ====================================================================
// == 1. Redesigned Feature Card (Horizontal Layout)
// ====================================================================
const FeatureCard = ({ icon, label, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return(
      <Paper 
          elevation={0} 
          sx={{ 
              p: 2, 
              backgroundColor: colors.primary[700], 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center'
          }}
      >
          <Box color={colors.greenAccent[400]} sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {React.cloneElement(icon, { style: { fontSize: '2rem' } })}
          </Box>
          <Box>
              <Typography variant="h5" fontWeight="bold">{value}</Typography>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
          </Box>
      </Paper>
  )
}

const SaleDetailPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { saleId } = useParams(); // 👈 جلب الـ ID من الرابط
    const navigate = useNavigate(); // 👈 للتحكم بالعودة والتنقل

    // --- جلب البيانات الخاصة بالصفحة ---
    const { saleData: sale, loading, error } = useSingleProjectSaleData({ saleId });
    const { propertyBooks, loading: booksLoading, error: booksError } = useProjectPropertyBooksData({ projectId: sale?.project_id });
    
    const [activeTab, setActiveTab] = useState('1');
    const [activeMedia, setActiveMedia] = useState({ url: '', type: 'image', label: 'Main' });

    useEffect(() => {
        if (sale && sale.main_image) {
            setActiveMedia({ url: sale.main_image, type: 'image', label: 'Main' });
        }
    }, [sale]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (error || !sale) return <Alert severity="error">Could not load project details.</Alert>;

    const mediaItems = [
        { url: sale.main_image, type: 'image', label: 'Main' },
        { url: sale.diagram_image, type: 'image', label: 'Diagram' },
        { url: sale.video_url, type: 'video', label: 'Video' }
    ].filter(item => item && item.url);

    return (
        <Box m="20px">
            {/* --- الهيدر الرئيسي للصفحة مع أزرار التحكم --- */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title={sale.main_title} subtitle={`Details for project listing #${sale.id}`} />
                <Stack direction="row" spacing={2}>
                    <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIcon />}>Back</Button>
                    <Button onClick={() => navigate(`/sales/saleDetails/${sale.id}/edit`)} variant="contained" startIcon={<EditIcon />}>Edit</Button>
                </Stack>
            </Box>

            {/* --- Hero Section --- */}
            <Box sx={{ height: '400px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: 'white', backgroundImage: `url(${sale.main_image})`, backgroundSize: 'cover', backgroundPosition: 'center', p: 4, borderRadius: '15px', mt: 3 }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 80%)', borderRadius: '15px' }} />
                <Box sx={{ zIndex: 1 }}>
                    <Chip label={sale.type} size="small" sx={{ mb: 1, backgroundColor: colors.greenAccent[600], color: 'white' }} />
                    <Typography variant="h2" fontWeight="bold">{sale.main_title}</Typography>
                    <Typography variant="h6" color={colors.grey[300]}>{sale.address}</Typography>
                </Box>
            </Box>

            {/* --- قسم التبويبات --- */}
            <Box mt={2}>
                <TabContext value={activeTab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: colors.primary[800], borderRadius: '12px 12px 0 0' }}>
                        <TabList onChange={handleTabChange} aria-label="project details tabs">
                            <Tab label="Project Overview" value="1" />
                            <Tab label="Available Properties" value="2" />
                        </TabList>
                    </Box>
                    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, backgroundColor: colors.primary[800], borderRadius: '0 0 12px 12px' }}>
                                     <TabPanel value="1">
                        <Stack spacing={4} p={{ xs: 0, sm: 1, md: 2 }}>
                            {/* --- Section 1: About This Project --- */}
                            <Box>
                                <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>About This Project</Typography>
                                <Typography paragraph sx={{ lineHeight: 1.8, color: colors.grey[300] }}>
                                    {sale.marketing_description}
                                </Typography>
                                <Button variant="contained" startIcon={<MapIcon />} href={sale.location_link} target="_blank" sx={{ mt: 2 }}>
                                    View Location on Map
                                </Button>
                            </Box>
                            
                            <Divider />

                            {/* --- Section 2: Key Features --- */}
                            <Box>
                                <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>Key Features</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={3}><FeatureCard icon={<SquareFootIcon/>} label="Area" value={`${sale.area} m²`} /></Grid>
                                    <Grid item xs={6} md={3}><FeatureCard icon={<LayersIcon/>} label="Floors" value={sale.number_of_floor} /></Grid>
                                    <Grid item xs={6} md={3}><FeatureCard icon={<AttachMoneyIcon/>} label="Cost" value={`$${sale.expected_cost?.toLocaleString()}`} /></Grid>
                                    <Grid item xs={6} md={3}><FeatureCard icon={<EventIcon/>} label="Completion" value={new Date(sale.expected_date_of_completed).getFullYear()} /></Grid>
                                </Grid>
                            </Box>
                            
                            <Divider />

                            {/* --- Section 3: Media Gallery --- */}
                            <Box>
                                <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>Media Gallery</Typography>
                                <Box sx={{ width: '100%', height: {xs: '300px', md: '450px'}, backgroundColor: colors.primary[900], mb: 1.5, borderRadius: '8px', overflow: 'hidden' }}>
                                    {activeMedia.type === 'image' ? (
                                        <img src={activeMedia.url} alt={activeMedia.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <video src={activeMedia.url} controls autoPlay muted loop style={{ width: '100%', height: '100%' }} />
                                    )}
                                </Box>
                                <Stack direction="row" spacing={1.5} justifyContent="center">
  {mediaItems.map(media => (
    <Box 
      key={media.url}
      onClick={() => setActiveMedia(media)}
      sx={{ 
        position: 'relative',
        width: 100, 
        height: 75, 
        borderRadius: '8px', 
        cursor: 'pointer', 
        overflow: 'hidden',
        border: `3px solid ${activeMedia.url === media.url ? colors.greenAccent[400] : 'transparent'}`,
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* --- This is the main change --- */}
      {media.type === 'image' ? (
        // If it's an image, show the image
        <img 
          src={media.url} 
          alt={media.label} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        // If it's a video, show an icon box
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary[900],
          color: colors.grey[300]
        }}>
          <VideocamIcon sx={{ fontSize: '2.5rem' }} />
        </Box>
      )}
    </Box>
  ))}
</Stack>
                            </Box>
                        </Stack>
                    </TabPanel>

                         <TabPanel value="2">
                        <Box p={{ xs: 0, sm: 1, md: 2 }}>
                            <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>Available Units & Models</Typography>
                            {booksLoading ? <CircularProgress /> : booksError ? <Alert severity="error">Failed to load properties.</Alert> : (
                                <Grid container spacing={3}>
                                    {propertyBooks.length > 0 ? propertyBooks.map(book => (
                                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                                            <PropertyBookCard book={book} />
                                        </Grid>
                                    )) : (
                                        <Grid item xs={12}><Alert severity="info">No specific property models have been added for this project yet.</Alert></Grid>
                                    )}
                                </Grid>
                            )}
                        </Box>
                    </TabPanel>
                    </Box>
                </TabContext>
            </Box>
        </Box>
    );
};

export default SaleDetailPage;