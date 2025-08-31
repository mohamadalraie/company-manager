// src/pages/bookDetails/bookDetailsTabs/UnitsTab.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import useBookUnitsData from "../../../hooks/getBookUnitsDataHook";
import ClientInstallmentsModal from "./ClientInstallmentsModal";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const UnitsTab = ({ bookId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { units, loading, error } = useBookUnitsData({ bookId });

  // State to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Function to open the modal with the correct IDs
  const handleViewInstallments = (unitId, clientId) => {
    setSelectedUnitId(unitId);
    setSelectedClientId(clientId);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
    setSelectedUnitId(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "Unit ID",
      width: 90,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      flex: 1,
      // Using valueGetter is slightly more performant for sorting/filtering
      renderCell: (params) =>
        `${params.row.client?.first_name ?? 'N/A'} ${params.row.client?.last_name ?? ''}`,
    },
    {
      field: "clientEmail",
      headerName: "Client Email",
      flex: 1,
      renderCell: (params) => params.row.client?.email ?? 'N/A',
    },
    {
      field: "clientPhone",
      headerName: "Phone Number",
      flex: 1,
      renderCell: (params) => params.row.client?.phone_number ?? 'N/A',
    },
    {
      field: "first_payment_date",
      headerName: "First Payment",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'left' }}>
        <Typography>
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<ReceiptLongIcon />}
          // THE FIX #1: Check for the client on `params.row`
          disabled={!params.row.client}
          onClick={() =>
            // THE FIX #2: Access IDs from `params.row`
            handleViewInstallments(params.row.id, params.row.client?.id)
          }
        >
          Bills
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
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
          rows={units || []}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>

      <ClientInstallmentsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        unitId={selectedUnitId}
        clientId={selectedClientId}
      />
    </>
  );
};

export default UnitsTab;