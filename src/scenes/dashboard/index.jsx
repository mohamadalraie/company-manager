import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../components/Header";
import { getAuthToken, getPermissions, getRole } from "../../shared/Permissions";
// import { Chrono } from "react-chrono";


export default function Dashboard() {

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={"Dashboard"}
          subtitle={`${getAuthToken()}`}
        />
      </Box>
      <Typography variant="h6">{getRole()}</Typography>
      <Typography variant="h6">{getPermissions()}</Typography>
    </Box>
  );
}
