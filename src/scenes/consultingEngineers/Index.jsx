

import { Header } from "../../components/Header";
import { tokens } from "../../theme";
// تأكد من أن هذا هو المسار الصحيح لـ hook الخاص بك
import useConsultingEngineersData from "../../hooks/getAllConsultingEngineersDataHook"; // يجب أن يرجع refetchEngineers

import { Link } from "react-router-dom";

import { Box, Typography, useTheme, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// استيراد المكون الجديد للحذف
import DeleteConfirmationComponent from "../../components/DeleteConfirmation";// تأكد من المسار الصحيح

import { baseUrl } from "../../shared/baseUrl";
import { deleteEngineerApi } from "../../shared/APIs";


const ConsultingEngineers = () => {
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
            deleteApi={`${baseUrl}${deleteEngineerApi}`}
            onDeleteSuccess={()=>{}} // 🚨 استدعاء refetchEngineers عند النجاح
            onDeleteError={() => { /* يمكنك وضع منطق للتعامل مع الأخطاء هنا إذا أردت */ }}
          />
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box m="10px">
         <Box display="flex" justifyContent="space-between" alignItems="center">
         <Header title={"Consulting Engineers"} subtitle={"The Consulting Engineers in the Company"} />
         <Link to="/engineers/add">
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
     

      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
        <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
          Loading engineers...
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
      <Header title={"Consulting Engineers"} subtitle={"The Consulting Engineers in the Company"} />
        <Link to="/engineers/add">
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
      <Box
        m="20px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-cell": {},
          "& .MuiDataGrid-columnHeaders": {
            color: colors.greenAccent[400],
            backgroundColor: colors.greenAccent[100],
          },
        }}
      >
        <DataGrid rows={engineers} columns={columns} />
      </Box>

    </Box>
  );
};

export default ConsultingEngineers;