import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import { combinedEngineersData, testDataEngineers } from "../../data/testData";
// React
import { useEffect } from "react";

// External libraris
import axios from "axios";
import { Link } from "react-router-dom";

// Mui libraries
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutLinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutLinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutLinedIcon from "@mui/icons-material/SecurityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { baseUrl } from "../../contexts/baseUrl";
import { getAllEngineersApi } from "../../contexts/APIs";

const Engineers = () => {
  useEffect(() => {
    console.log("rendered");
    axios
      .post(`${baseUrl}${getAllEngineersApi}`, {})
      .then(function (response) {
        console.log(response);
        allEngineersResponse = response
          .map((engineer) => {
            return {
              ...engineer, // Spreads all existing properties of the engineer object
              id: engineer.id,
              first_name: engineer.user.first_name,
              last_name: engineer.user.last_name,
              email: engineer.user.email,
              phone_number: engineer.user.phone_number,
              status: engineer.user.status,
              specialization_name: engineer.specialization.name,
        
            };
          })
          .map(({ user, specialization, ...rest }) => rest); // A second map to explicitly remove 'user' and 'specialization' properties
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const allEngineersResponse = [];
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5, // Adjust flex as needed
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

      sortable: false, // Actions columns are usually not sortable
      filterable: false,
      // if you want to specify the cell
      renderCell: (params) => {
        return (
          <Button
            style={{
              fontSize: "10px",
              color: colors.primary[100],
              backgroundColor: params.value === "active" ? "green" : "red",
            }}
            onClick={alert}
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",

      sortable: false, // Actions columns are usually not sortable
      filterable: false,
      // if you want to specify the cell
      renderCell: () => {
        return (
          <Button style={{ color: "red", borderColor: "red" }} onClick={alert}>
            {<DeleteOutlineIcon />}
          </Button>
        );
      },
    },
  ];

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Engineers"} subtitle={"The Engineers in the Company"} />
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
        <DataGrid rows={allEngineersResponse} columns={columns} />
      </Box>
    </Box>
  );
};

export default Engineers;
