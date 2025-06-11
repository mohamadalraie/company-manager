// src/scenes/projects/ProjectCard.jsx (Updated)

import {
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
  Grid,
  Divider, // Added for visual separation
} from "@mui/material";
import { tokens } from "../theme";// Corrected path assumption
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined"; // Changed to Outlined for subtlety
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import AspectRatioIcon from "@mui/icons-material/AspectRatioOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // For description section title
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'; // For financial details

const ProjectCard = ({ project }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // You can change this currency code
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "ForSale":
        return colors.greenAccent[600]; // Slightly darker for better contrast
      case "Sold":
        return colors.redAccent[600];
      case "Pre-sale":
        return colors.blueAccent[600];
      default:
        return colors.grey[600];
    }
  };

  const getProgressChipColor = (progress) => {
    switch (progress) {
      case "Completed":
        return colors.greenAccent[600];
      case "In Progress":
        return colors.blueAccent[600];
      case "Not Started":
        return colors.grey[600];
      case "On Hold":
        return colors.yellowAccent[600];
      case "Cancelled":
        return colors.redAccent[600];
      default:
        return colors.grey[600];
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: colors.primary[800],
        borderRadius: "12px", // Slightly more rounded corners
        boxShadow: `0px 6px 15px ${colors.grey[900]}`, // More pronounced shadow
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)", // More pronounced lift
          boxShadow: `0px 10px 20px ${colors.grey[900]}`, // Larger shadow on hover
        },
        border: `1px solid ${colors.grey[700]}`, // Subtle border
      }}
    >
      {/* Header Section: Title, Project Code, and Sale Status Chip */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="bold" sx={{ mb: 0.5 }}>
            {project.title}
          </Typography>
          <Typography variant="h6" color={colors.grey[400]}>
            <CodeIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1.1rem" }} />
            {project.project_code}
          </Typography>
        </Box>
        <Chip
          label={project.status_of_sale}
          size="medium" // Slightly larger chip
          sx={{
            backgroundColor: getStatusChipColor(project.status_of_sale),
            color: colors.grey[100],
            fontWeight: "bold",
            fontSize: "0.85rem",
            py: 0.5, // Padding on y-axis
            px: 1, // Padding on x-axis
          }}
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: colors.grey[700] }} /> {/* Divider */}

      {/* Description Section */}
      <Box mb={2}>
        <Typography variant="h6" color={colors.grey[300]} sx={{ mb: 1 }}>
          <InfoOutlinedIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1.2rem" }} />
          Description
        </Typography>
        <Typography variant="body2" color={colors.grey[400]} sx={{ pl: 3, lineHeight: 1.6 }}>
          {project.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: colors.grey[700] }} /> {/* Divider */}

      {/* Key Details Section */}
      <Typography variant="h6" color={colors.greenAccent[400]} sx={{ mb: 1 }}>
        Project Details
      </Typography>
      <Grid container spacing={2} mb={2}> {/* Increased spacing */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color={colors.grey[300]}>
            <LocationOnIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
            <Box component="span" fontWeight="bold">Location:</Box> {project.location}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color={colors.grey[300]}>
            <CategoryIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
            <Box component="span" fontWeight="bold">Type:</Box> {project.type}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color={colors.grey[300]}>
            <LayersIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
            <Box component="span" fontWeight="bold">Floors:</Box> {project.number_of_floor}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color={colors.grey[300]}>
            <AspectRatioIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
            <Box component="span" fontWeight="bold">Area:</Box> {project.area} sqm
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color={colors.grey[300]}>
            <CalendarTodayIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
            <Box component="span" fontWeight="bold">Completion:</Box> {formatDate(project.expected_date_of_completed)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color={colors.grey[300]}>
            <AccountBalanceWalletOutlinedIcon sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
            <Box component="span" fontWeight="bold">Cost:</Box> {formatCurrency(project.expected_cost)}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2, borderColor: colors.grey[700] }} /> {/* Divider */}

      {/* Footer Section: Progress Chip and Associated Parties */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2} flexWrap="wrap" rowGap={1}>
        <Chip
          label={`Progress: ${project.progress_status}`}
          size="medium"
          sx={{
            backgroundColor: getProgressChipColor(project.progress_status),
            color: colors.grey[100],
            fontWeight: "bold",
            fontSize: "0.85rem",
            py: 0.5,
            px: 1,
          }}
        />
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {project.owner && (
            <Typography variant="caption" color={colors.grey[400]} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
              <Box component="span" fontWeight="bold">Owner:</Box> {project.owner.first_name} {project.owner.last_name}
            </Typography>
          )}
          {project.consulting_company && (
            <Typography variant="caption" color={colors.grey[400]} sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 0.5, fontSize: "1rem", color: colors.blueAccent[300] }} />
              <Box component="span" fontWeight="bold">Consulting:</Box> {project.consulting_company.name}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProjectCard;