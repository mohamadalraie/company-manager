// src/scenes/sales/SalesDashboardPage.jsx

import React, { useState, useRef } from "react";
import { Box, CircularProgress, Alert, IconButton, Button } from "@mui/material";
import { Link } from "react-router-dom";

// --- أيقونات ---
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// --- المكونات والأدوات ---
import { Header } from "../../components/Header";
import useProjectSalesData from "../../hooks/getAllProjectsToSaleDataHook";
import { havePermission } from "../../shared/Permissions";
import SaleCard from "../../components/SaleCard"; // <-- استيراد البطاقة
import SaleDetailDialog from "../../components/dialogs/SaleDetailDialog"; // <-- استيراد الديالوج

const SalesDashboardPage = () => {
  const { sales, loading, error,refetchSales } = useProjectSalesData();
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleCardClick = (saleData) => {
    setSelectedSale(saleData);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailDialogOpen(false);
  };

  const handleUpdateSuccess = () => {
    refetchSales(); // أعد تحميل البيانات بعد التحديث الناجح
    handleCloseDialog();
};
  
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
        const scrollAmount = direction === 'left' ? -350 : 350;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="Projects Showcase" subtitle="Browse all projects currently available for sale" />
        {havePermission("create sales listing") && (
          <Link to="/sales/add">
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>Add Project to Sale</Button>
          </Link>
        )}
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}
      
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => scroll('left')} sx={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2, backgroundColor: 'rgba(0,0,0,0.3)', '&:hover': {backgroundColor: 'rgba(0,0,0,0.5)'} }}><ArrowBackIosNewIcon /></IconButton>
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex', overflowX: 'auto', py: 2, gap: 3,
              '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none',
            }}
          >
            {sales.map(sale => (
              <SaleCard key={sale.id} sale={sale} onClick={() => handleCardClick(sale)} />
            ))}
          </Box>
          <IconButton onClick={() => scroll('right')} sx={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2, backgroundColor: 'rgba(0,0,0,0.3)', '&:hover': {backgroundColor: 'rgba(0,0,0,0.5)'} }}><ArrowForwardIosIcon /></IconButton>
      </Box>

      {selectedSale && (
        <SaleDetailDialog 
          key={selectedSale.id}
          open={isDetailDialogOpen}
          onClose={handleCloseDialog}
          sale={selectedSale}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default SalesDashboardPage;