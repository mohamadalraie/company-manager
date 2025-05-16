import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutLinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutLinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutLinedIcon from "@mui/icons-material/SecurityOutlined";

const Engineers = () => {
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
    { field: "role", headerName: "Role" ,
    // if you want to specify the cell
    renderCell: ()=>{return (<Typography variant="h6">hamoda</Typography>)}},
 ];

  return (
    <Box  m="20px">
      <Header title={"Engineers"} subtitle={"The Engineers in the Company"} />
      <Box m="40px 0 0 0" height="70vh">
        <DataGrid rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Engineers;
