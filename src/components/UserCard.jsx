import {
  Stack,
  Typography,
  Divider,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import PersonIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const UserCard = ({label, firstName, lastName, phoneNumber, email, address }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: colors.primary[700],
        borderRadius: "12px",
        border: `1px solid ${colors.greenAccent[600]}`,
      }}
    >
      <Typography variant="h5" fontWeight="600" color={colors.grey[200]} mb={2}>
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            backgroundColor: colors.greenAccent[600],
          }}
        >
          <PersonIcon />
        </Avatar>
        <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
          {firstName} {lastName}
        </Typography>
      </Box>
      <Divider sx={{ my: 2, borderColor: colors.grey[800] }} />
      <Stack spacing={1.5}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <PhoneOutlinedIcon sx={{ color: colors.greenAccent[300] }} />
          <Typography variant="body1" color={colors.grey[300]}>
            {phoneNumber || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <EmailOutlinedIcon sx={{ color: colors.greenAccent[300] }} />
          <Typography variant="body1" color={colors.grey[300]}>
            {email || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <HomeOutlinedIcon sx={{ color: colors.greenAccent[300] }} />
          <Typography variant="body1" color={colors.grey[300]}>
            {address || "N/A"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
export default UserCard;
