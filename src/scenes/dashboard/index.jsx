import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../components/Header";
// import { Chrono } from "react-chrono";


export default function Dashboard() {
  const token=localStorage.getItem("authToken");
  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={"Dashboard"}
          subtitle={`${token}`}
        />
      </Box>
    </Box>
  );
}
