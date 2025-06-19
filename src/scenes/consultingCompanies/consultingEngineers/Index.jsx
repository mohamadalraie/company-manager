import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
// تأكد من أن هذا هو المسار الصحيح لـ hook الخاص بك
import useConsultingEngineersData from "../../../hooks/getAllConsultingEngineersDataHook"; // يجب أن يرجع refetchEngineers

import { Link } from "react-router-dom";

import {
  Box,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// استيراد المكون الجديد للحذف
import DeleteConfirmationComponent from "../../../components/DeleteConfirmation"; // تأكد من المسار الصحيح

import { baseUrl } from "../../../shared/baseUrl";
import { deleteConsultingEngineerApi } from "../../../shared/APIs";

const ConsultingEngineers = ({consultingCompanyId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // استقبل refetchEngineers من الـ hook
  const { engineers, loading, error } = useConsultingEngineersData();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "specialization_name", headerName: "Specialization", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },

    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Button
              style={{
                fontSize: "10px",
                color: colors.primary[100],
                backgroundColor: params.value === "active" ? "green" : "red",
              }}
              onClick={() => alert(`Status: ${params.value}`)}
            >
              {params.value ? params.value : "null"}
            </Button>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <DeleteConfirmationComponent
              itemId={params.row.id}
              deleteApi={`${baseUrl}${deleteConsultingEngineerApi}`}
              onDeleteSuccess={() => {}} // 🚨 استدعاء refetchEngineers عند النجاح
              onDeleteError={() => {
                /* يمكنك وضع منطق للتعامل مع الأخطاء هنا إذا أردت */
              }}
            />
          </Box>
        );
      },
    },
  ];
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
      <Header
        title={"Consulting Engineers"}
        subtitle={"The Consulting Engineers in the Company"}
      />
      <Link  to={`/ConsultingCompanies/${consultingCompanyId}/ConsultingEngineers/add`}>
        <Button
          variant="standard"
          style={{
            backgroundColor: colors.greenAccent[700],
            color: colors.blueAccent[100],
          }}
        >
          add
        </Button>
      </Link>
    </Box>

    {/* --- Conditional Rendering Based on State --- */}
    {loading ? (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh" // Use a percentage or specific height for the loader box
      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
        <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
          Loading engineers...
        </Typography>
      </Box>
    ) : error ? ( // If not loading, check for error
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Typography variant="h5" color="error">
          Error: {error}
        </Typography>
        <Button
          onClick={() => window.location.reload()} // Simple refresh to retry
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    ) : ( // If not loading and no error, show the data
      <Box
        m="20px 0 0 0"
        height="70vh"
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
      
          <DataGrid rows={engineers} columns={columns}     
               pageSize={10} // Default number of rows per page
          rowsPerPageOptions={[5, 10, 20]} // Options for rows per page 
          />
      </Box>
    )}
  </Box>
);
};

export default ConsultingEngineers;
