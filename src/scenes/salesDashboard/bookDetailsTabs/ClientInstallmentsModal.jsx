// src/pages/bookDetails/bookDetailsTabs/ClientInstallmentsModal.jsx

import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box,
  useTheme, CircularProgress, Alert, Typography, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import useClientInstallmentsData from '../../../hooks/useClientInstallmentsData';

const ClientInstallmentsModal = ({ open, onClose, unitId, clientId }) => { // <-- CHANGED: from bookId to unitId
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // <-- CHANGED: Pass unitId to the hook
  const { installments, loading, error, fetchInstallments } = useClientInstallmentsData({ unitId, clientId });

  useEffect(() => {
    if (open && clientId && unitId) { 
      fetchInstallments();
    }
  }, [open, clientId, unitId, fetchInstallments]); // <-- CHANGED: Added unitId dependency

  
const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 90,
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    // Formats the number as a currency string (e.g., $3,000,000.00)
    renderCell: (params) => (
      <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'left' }}>
            <Typography color={colors.greenAccent[400]} sx={{ fontWeight: '600' }}>
        {`$${parseFloat(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      </Typography>
      </Box>
    ),
  },
  {
    field: "due_date",
    headerName: "Due Date",
    flex: 1,
    // Formats the date string into a more readable format
    renderCell: (params) => (
      <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'left' }}>
      <Typography color={colors.grey[100]}>
        {new Date(params.value).toLocaleDateString()}
      </Typography>
      </Box>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1, // Gives more space for the description
    // DataGrid will automatically display a blank cell for null values
  },
  {
    field: "is_paid",
    headerName: "Status",
    flex: 0.5,
    // Displays a colored chip based on the boolean status
    renderCell: (params) => (
      <Chip
        label={params.value ? "Paid" : "not Paid"}
        color={params.value ? "success" : "error"}
        size="small"
        sx={{ 
          fontWeight: 'bold', 
          fontSize:"caption",
          width: '80px', // Ensures consistent width
        }}
      />
    ),
  },
];


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[700] }}>
        Client Installments
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800], minHeight: '400px' }}>
      <Box m="20px 0 0 0" height="90vh" sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { fontWeight: "bold" },
        "& .MuiDataGrid-columnHeaders": {
            color: colors.greenAccent[400],
            borderBottom: "none",
            fontWeight: "bold",
        },
      }}>
        <DataGrid
          rows={installments || []}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[700] }}>
        <Button onClick={onClose} >Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientInstallmentsModal;