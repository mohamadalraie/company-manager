import { tokens } from "../../../../theme";
import React from "react";
import {
  Grid,
  Stack,
  Paper,
  Typography,
  Divider,
  Box,
  Chip,
  useTheme,
  Avatar,
} from "@mui/material";

// --- Icons ---
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import AspectRatioIcon from "@mui/icons-material/AspectRatioOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import { green, yellow } from "@mui/material/colors";
import DetailItem from "../../../../components/DetailItem";
import UserCard from "../../../../components/UserCard";

const GeneralInfoTab = ({ project }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- Helper Functions ---
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusChipStyle = (status) => {
    const styles = {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "0.8rem",
      borderRadius: "8px",
      height: "auto",
      py: 0.8,
      px: 1,
    };
    switch (status) {
      case "ForSale":
        return {
          ...styles,
          backgroundColor: green[700],
          // border: `1px solid ${greenAccent[600]}`,
        };
      case "NotForSale":
        return {
          ...styles,
          backgroundColor: colors.redAccent[600],
          // border: `1px solid ${colors.redAccent[400]}`,
        };

      default:
        return { ...styles, backgroundColor: colors.grey[700] };
    }
  };

  const getProgressChipStyle = (progress) => {
    const baseStyle = {
      color: colors.grey[100],
      fontWeight: "bold",
      fontSize: "0.8rem",
      borderRadius: "8px",
      height: "auto",
      py: 0.8,
      px: 1,
    };
    switch (progress) {
      case "Done":
        return { ...baseStyle, backgroundColor: "#2e7d32" };
      case "In Progress":
        return { ...baseStyle, backgroundColor: colors.blueAccent[500] };
      case "Initial":
        return { ...baseStyle, backgroundColor: colors.grey[600] };
      default:
        return { ...baseStyle, backgroundColor: colors.grey[700] };
    }
  };

  return (
    <Grid container spacing={4}>
      {/* Left Column: Details */}
      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          <Box
            sx={{
              p: 3,
              backgroundColor: colors.primary[700],
              borderRadius: "12px",
              border: `1px solid ${colors.greenAccent[500]}`,
            }}
          >
            <Box display={"flex"} justifyContent={"space-between"} mb={"10px"}>
              <Typography
                variant="h3"
                color={colors.greenAccent[300]}
                fontWeight="bold"
              >
                {project.title}
              </Typography>
              <Typography
                variant="h6"
                color={colors.grey[400]}
                display="flex"
                alignItems="center"
                mt={1}
              >
                <CodeIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                {project.project_code}
              </Typography>
            </Box>
            <Divider sx={{ my: 2, borderColor: colors.grey[800] }} />
            <Typography
              variant="body1"
              color={colors.grey[300]}
              sx={{ lineHeight: 1.7 }}
            >
              {project.description}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem
                icon={<LocationOnIcon color="primary" />}
                label="Location"
              >
                {project.location || "N/A"}
              </DetailItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem icon={<CategoryIcon color="primary" />} label="Type">
                {project.type || "N/A"}
              </DetailItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem icon={<LayersIcon color="primary" />} label="Floors">
                {project.number_of_floor || "N/A"}
              </DetailItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                icon={<AspectRatioIcon color="primary" />}
                label="Area"
              >
                {project.area || "N/A"} sqm
              </DetailItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                icon={<CalendarTodayIcon color="primary" />}
                label="Completion Date"
              >
                {formatDate(project.expected_date_of_completed) || "N/A"}
              </DetailItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                icon={<AccountBalanceWalletOutlinedIcon color="primary" />}
                label="Expected Cost"
              >
                {formatCurrency(project.expected_cost) || "N/A"}
              </DetailItem>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                icon={
                  <BusinessIcon
                    fontSize="large"
                    sx={{ color: colors.blueAccent[300] }}
                  />
                }
                label="Consulting Company"
              >
                {project.consultingCompany.name || "N/A"}
              </DetailItem>
            </Grid>
          </Grid>
        </Stack>
      </Grid>

      {/* --- RIGHT COLUMN (RESTRUCTURED) --- */}
      <Grid item xs={12} lg={4}>
        <Stack display="flex" spacing={5} direction={"row"}>
          {/* Card 1: Status */}
          <Stack spacing={4}>
            <Box
              sx={{
                p: 2,
                backgroundColor: colors.primary[700],
                borderRadius: "12px",
                border: `1px solid ${colors.greenAccent[600]}`,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                color={colors.grey[300]}
                mb={1.5}
                textAlign="center"
              >
                Progress Status
              </Typography>
              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Chip
                  label={project.progress_status}
                  sx={getProgressChipStyle(project.progress_status)}
                />
              </Stack>
            </Box>
            <Box
              sx={{
                p: 2,
                backgroundColor: colors.primary[700],
                borderRadius: "12px",
                border: `1px solid ${colors.greenAccent[600]}`,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                color={colors.grey[300]}
                mb={1.5}
                textAlign="center"
              >
                Sale Status
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ justifyContent: "center" }}
              >
                <Chip
                  label={project.status_of_sale}
                  sx={getStatusChipStyle(project.status_of_sale)}
                />
              </Stack>
            </Box>
          </Stack>

          {/* Card 2: Project Owner (New and Detailed) */}
          {project.owner &&
            <UserCard
              label="Project Owner"
              firstName= {project.owner.user.first_name}
              lastName= {project.owner.user.last_name}
              email= {project.owner.user.email}
              phoneNumber= {project.owner.user.phone_number}
              address= {project.owner.address}
            />}

        </Stack>
      </Grid>
    </Grid>
  );
};

export default GeneralInfoTab;
