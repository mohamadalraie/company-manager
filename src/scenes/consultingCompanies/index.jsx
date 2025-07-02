

import { Header } from "../../components/Header";
import { tokens } from "../../theme";
// تأكد من أن هذا هو المسار الصحيح لـ hook الخاص بك
import useConsultingCompaniesData from "../../hooks/getAllConsultingCompaniesDataHook"; // يجب أن يرجع refetchEngineers

import { Link } from "react-router-dom";

import { Box, Typography, useTheme, Button,IconButton, CircularProgress, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Icon for the Add button

// استيراد المكون الجديد للحذف
import DeleteConfirmationComponent from "../../components/DeleteConfirmation";// تأكد من المسار الصحيح

import { baseUrl } from "../../shared/baseUrl";
import { deleteConsultingCompanyApi } from "../../shared/APIs";
import { havePermission } from "../../shared/Permissions";


const ConsultingCompanies = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // استقبل refetchEngineers من الـ hook
  const { companies, loading, error ,refetchCompanies} = useConsultingCompaniesData();



  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.4,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1.2 },
    { field: "manager_name", headerName: "Manager Name", flex: 1 },

    { field: "address", headerName: "Address", flex: 1.2 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.4,
      renderCell: (params) => {
        return (
          <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="100%"
          >
            {havePermission("edit consulting company")&&
            <Link to={`/ConsultingCompanies/edit/${params.row.id}`} style={{ textDecoration: "none" }}>
              <IconButton
                aria-label="edit"
                sx={{ color: colors.blueAccent[400], "&:hover": { color: colors.blueAccent[300] } }}
              >
                <EditIcon />
              </IconButton>
            </Link>
      }
            {havePermission("delete consulting company")&&
          <DeleteConfirmationComponent
            itemId={params.row.id}
            deleteApi={`${baseUrl}${deleteConsultingCompanyApi}`}
            onDeleteSuccess={()=>{refetchCompanies()}} // 🚨 استدعاء refetchEngineers عند النجاح
            onDeleteError={() => { /* يمكنك وضع منطق للتعامل مع الأخطاء هنا إذا أردت */ }}
          />}
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box m="10px">
         <Box display="flex" justifyContent="space-between" alignItems="center">
         <Header title={"Consulting Companies"} subtitle={"Managing The Consulting Companies that work with us"} />
         {havePermission("create consulting company")&&
         <Link to="/ConsultingCompanies/add">
         <Button
              variant="contained" // Use contained for a more prominent button
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.greenAccent[800],
                },
              }}
              startIcon={<AddIcon />} // Icon for the Add button
            >
              Add Company
            </Button>
        </Link>
  }
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
     

      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
        <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
          Loading Companies...
        </Typography>
      </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        position="fixed"
        top={0}
        left={0}
        zIndex={9999}
        bgcolor={theme.palette.background.default}
      >
        <Typography variant="h5" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title={"Consulting Companies"} subtitle={"Managing The Consulting Companies that work with us"} />
      {havePermission("create consulting company")&&
         <Link to="/ConsultingCompanies/add">
         <Button
              variant="contained" // Use contained for a more prominent button
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.greenAccent[800],
                },
              }}
              startIcon={<AddIcon />} // Icon for the Add button
            >
              Add Company
            </Button>
        </Link>
}
      </Box>
      <Box
        m="20px 0 0 0"
        height="90vh"
        sx={{
          // Custom styles for DataGrid
          "& .MuiDataGrid-root": {
            border: "none", // Remove outer border of the table
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none", // Remove bottom borders between cells
          },
          "& .name-column--cell": {
            // color: colors.greenAccent[300], // Distinct color for engineer names
            fontWeight: "bold", // Bold font for names
          },
          "& .MuiDataGrid-columnHeaders": {
            
            color: colors.greenAccent[400],
            // backgroundColor: colors.primary[800], // Background color for column headers
            borderBottom: "none",
            // fontSize: "1rem", // Larger font size for column headers
            fontWeight: "bold",
          },

        }}
      >
        <DataGrid rows={companies} columns={columns} />
      </Box>

    </Box>
  );
};

export default ConsultingCompanies;