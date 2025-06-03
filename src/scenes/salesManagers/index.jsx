import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// import { mockDataTeam } from "../../data/mockData";
import { Link } from "react-router-dom";

import AdminPanelSettingsOutLinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutLinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutLinedIcon from "@mui/icons-material/SecurityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const SalesManagers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email" },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      Align: "left",
    },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "role",
      headerName: "Role",
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
        <Header
          title={"Sales Managers"}
          subtitle={"The Slaes Managers in the Company"}
        />
        <Link to="/salesManagers">
        <Button variant="standard" style={{backgroundColor:colors.greenAccent[700], color:colors.blueAccent[100]}}> add</Button>
        </Link>
      </Box>
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-cell": {},

          "& .MuiDataGrid-columnHeaders": {
            color: colors.greenAccent[400],
            backgroundColor: colors.greenAccent[100],
          },
        }}
      >
        <DataGrid rows={[]} columns={columns} />
      </Box>
    </Box>
  );
};

export default SalesManagers;
