import {
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { tokens } from "../theme";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
// import AttachMoneyIcon from "@mui.icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import AspectRatioIcon from "@mui/icons-material/AspectRatioOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // New icon for Progress
import { green, yellow } from "@mui/material/colors";

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
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "ForSale":
        return colors.greenAccent[500]; // Brighter green
      case "Sold":
        return colors.redAccent[500]; // Brighter red
      case "Pre-sale":
        return colors.blueAccent[500]; // Brighter blue
      default:
        return colors.grey[500];
    }
  };

  const getProgressChipColor = (progress) => {
    switch (progress) {
      case "Completed":
        return green[600]; // Adjusted for consistency
      case "In Progress":
        return colors.blueAccent[500];
      case "Not Started":
        return colors.grey[500];
      case "On Hold":
        return yellow[700]; // Darker yellow for better contrast
      case "Cancelled":
        return colors.redAccent[500];
      default:
        return colors.blueAccent[500];
    }
  };

  const renderDetailItem = (Icon, label, value) => (
    <Grid item xs={12} sm={6}>
      <Box display="flex" alignItems="center">
        <Icon sx={{ mr: 1, fontSize: "1.2rem", color: colors.blueAccent[200] }} />
        <Typography variant="body2" color={colors.grey[300]}>
          <Box component="span" fontWeight="bold">{label}:</Box> {value}
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <Paper
      sx={{
        p: 0, // Remove padding from the main Paper to control it inside
        mb: 3,
        borderRadius: "20px", // More pronounced rounded corners
        boxShadow: `0px 5px 20px ${colors.greenAccent[900]}`, // Deeper shadow
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-12px)", // More dramatic lift on hover
          boxShadow: `0px 5px 30px ${colors.greenAccent[700]}`, // Even larger shadow on hover
        },
        overflow: 'hidden', // Ensures rounded corners clip content
        position: 'relative',
      }}
    >
      {/* Top Section: Title, Project Code, and Sale Status */}
      <Box
        sx={{
          p: 3,
          backgroundColor: colors.primary[700], // Lighter dark shade for the header
          borderBottom: `1px solid ${colors.grey[700]}`,
          display: "flex",
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens, row on larger
          justifyContent: "space-between",
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5, // Space between elements in header
        }}
      >
        <Box>
          <Typography variant="h3" color={colors.greenAccent[300]} fontWeight="bold" sx={{ mb: 0.5 }}>
            {project.title}
          </Typography>
          <Typography variant="h6" color={colors.grey[400]} display="flex" alignItems="center">
            <CodeIcon sx={{ mr: 0.8, fontSize: "1.3rem" }} />
            {project.project_code}
          </Typography>
        </Box>
        <Chip
          label={project.status_of_sale}
          size="medium"
          sx={{
            backgroundColor: getStatusChipColor(project.status_of_sale),
            color: colors.grey[100],
            fontWeight: "bold",
            fontSize: "1rem", // Larger chip font
            py: 0.8, // More vertical padding
            px: 2, // More horizontal padding
            borderRadius: "10px", // More rounded chip
          }}
        />
      </Box>

      {/* Main Content Section */}
      <Box sx={{ p: 3, backgroundColor: colors.primary[800] }}> {/* Slightly lighter background for content */}
        {/* Description Section */}
        <Box mb={3}>
          <Typography variant="h6" color={colors.grey[300]} sx={{ mb: 1 }} display="flex" alignItems="center">
            <InfoOutlinedIcon sx={{ mr: 0.8, fontSize: "1.4rem", color: colors.greenAccent[300] }} />
            Description
          </Typography>
          <Typography variant="body2" color={colors.grey[400]} sx={{ pl: 3.5, lineHeight: 1.7 }}>
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: colors.grey[700] }} />

        {/* Key Details Section */}
        <Typography variant="h6" color={colors.greenAccent[400]} sx={{ mb: 1.5 }} display="flex" alignItems="center">
          Project Details
        </Typography>
        <Grid container spacing={2.5} mb={3}> {/* Increased spacing */}
          {renderDetailItem(LocationOnIcon, "Location", project.location)}
          {renderDetailItem(CategoryIcon, "Type", project.type)}
          {renderDetailItem(LayersIcon, "Floors", project.number_of_floor)}
          {renderDetailItem(AspectRatioIcon, "Area", `${project.area} sqm`)}
          {renderDetailItem(CalendarTodayIcon, "Completion", formatDate(project.expected_date_of_completed))}
          {renderDetailItem(AccountBalanceWalletOutlinedIcon, "Cost", formatCurrency(project.expected_cost))}
        </Grid>

        <Divider sx={{ my: 3, borderColor: colors.grey[700] }} />

        {/* Progress and Associated Parties Section */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
          {/* Progress Status Chip */}
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon sx={{ fontSize: "1.5rem", color: colors.blueAccent[300] }} /> {/* New icon for progress */}
            <Chip
              label={`Progress: ${project.progress_status}`}
              size="large" // Larger chip
              sx={{
                backgroundColor: getProgressChipColor(project.progress_status),
                color: colors.grey[100],
                fontWeight: "bold",
                fontSize: "0.95rem",
                py: 0.8,
                px: 1.8,
                borderRadius: "10px",
              }}
            />
          </Box>

          {/* Owner and Consulting Company */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }} alignItems="flex-start" flexWrap="wrap">
            {project.owner && (
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, fontSize: "1.5rem", color: colors.greenAccent[400] }} />
                <Typography variant="subtitle1" color={colors.grey[200]} fontWeight="bold">
                  Owner: <Box component="span" fontWeight="normal" color={colors.grey[300]}>
                    {project.owner.first_name} {project.owner.last_name}
                  </Box>
                </Typography>
              </Box>
            )}
            {project.consulting_company && (
              <Box display="flex" alignItems="center">
                <BusinessIcon sx={{ mr: 1, fontSize: "1.5rem", color: colors.greenAccent[400] }} />
                <Typography variant="subtitle1" color={colors.grey[200]} fontWeight="bold">
                  Consulting: <Box component="span" fontWeight="normal" color={colors.grey[300]}>
                    {project.consulting_company.name}
                  </Box>
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProjectCard;