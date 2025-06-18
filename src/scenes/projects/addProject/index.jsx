// src/scenes/projects/addProject/index.jsx (Create this new file)

// imports
import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
// Assuming you have an API endpoint for creating projects
import { createProjectApi } from "../../../shared/APIs"; // **UPDATE THIS PATH/API**
import CustomSnackbar from "../../../components/CustomSnackbar";

// react
import { useState, useRef, useEffect } from "react";

// mui libraries
import {
  Box,
  Button,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import TitleIcon from "@mui/icons-material/Title";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import LayersIcon from "@mui/icons-material/Layers";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person"; // For owner_id
import BusinessIcon from "@mui/icons-material/Business"; // For consulting_company_id

//External libraries
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

// Assuming you have API endpoints to fetch owners and consulting companies
// You'll need to create these if they don't exist
import { getAllOwnersApi, getAllConsultingCompaniesApi } from "../../../shared/APIs";
import { projectTypeOptions,progressStatusOptions,statusOfSaleOptions } from "../../../shared/statics.jsx/projectStatics";


const AddProject = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // State for API loading and data for dropdowns
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [consultingCompanies, setConsultingCompanies] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true); // For initial data fetch
  const snackbarRef = useRef(null);

  // Fetch owners and consulting companies on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const ownersResponse = await axios.get(`${baseUrl}${getAllOwnersApi}`);
        setOwners(ownersResponse.data.data);

        const companiesResponse = await axios.get(`${baseUrl}${getAllConsultingCompaniesApi}`);
        setConsultingCompanies(companiesResponse.data.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        snackbarRef.current.showSnackbar(
          "Failed to load owners or consulting companies.",
          "error"
        );
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      console.log("Submitting project values:", values);
      const response = await axios.post(
        `${baseUrl}${createProjectApi}`,
        values,
        {
          headers: {
            // Add any required headers here (e.g., Authorization token)
          },
        }
      );

      console.log("Project created successfully:", response.data);
      snackbarRef.current.showSnackbar(
        "Project created successfully!",
        "success"
      );
      resetForm();
    } catch (error) {
      console.error(
        "Error creating project:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create project. Please try again.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial form values for project
  const initialValues = {
    title: "",
    project_code: "",
    description: "",
    location: "",
    area: "",
    number_of_floor: "",
    status_of_sale: "",
    expected_date_of_completed: "",
    type: "",
    progress_status: "",
    expected_cost: "",
    owner_id: "",
    consulting_company_id: "",
  };

  // Validation schema for project creation using yup
  const projectSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    project_code: yup.string().required("Project Code is required"),
    description: yup.string().required("Description is required"),
    location: yup.string().required("Location is required"),
    area: yup.number().typeError("Area must be a number").positive("Area must be positive").required("Area is required"),
    number_of_floor: yup.number().typeError("Number of floors must be a number").integer("Number of floors must be an integer").min(0, "Cannot be negative").required("Number of floors is required"),
    status_of_sale: yup.string().required("Status of Sale is required"),
    expected_date_of_completed: yup.date().typeError("Invalid date").required("Expected Date of Completion is required"),
    type: yup.string().required("Type is required"),
    progress_status: yup.string().required("Progress Status is required"),
    expected_cost: yup.number().typeError("Expected Cost must be a number").positive("Expected Cost must be positive").required("Expected Cost is required"),
    owner_id: yup.string().required("Owner is required"),
    consulting_company_id: yup.string().required("Consulting Company is required"),
  });



  return (
    <Box m="10px">
      <Header
        title="Create New Project"
        subtitle="Add a new project to the system"
      ></Header>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mt: "20px",
          mb: "20px",
        }}
      >
        {isDataLoading ? (
          <CircularProgress />
        ) : (
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={projectSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: isNonMobile ? "75%" : "100%",
                    maxWidth: "900px",
                    p: "30px",
                    backgroundColor: colors.primary[800],
                    borderRadius: "12px",
                    boxShadow: `0px 0px 15px -5px ${colors.greenAccent[600]}`,
                    gap: "25px",
                  }}
                >
                  {/* --- Project Basic Information --- */}
                  <Typography
                    variant="h5"
                    color={colors.greenAccent[400]}
                    sx={{ mb: 1, mt: 1, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                  >
                    Basic Information
                  </Typography>
                  <Grid container spacing={3} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Project Title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        name="title"
                        error={!!touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                        InputProps={{ startAdornment: <TitleIcon sx={{ color: colors.grey[500] }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Project Code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.project_code}
                        name="project_code"
                        error={!!touched.project_code && !!errors.project_code}
                        helperText={touched.project_code && errors.project_code}
                        InputProps={{ startAdornment: <CodeIcon sx={{ color: colors.grey[500] }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Description"
                        multiline
                        rows={3}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.description}
                        name="description"
                        error={!!touched.description && !!errors.description}
                        helperText={touched.description && errors.description}
                        InputProps={{ startAdornment: <DescriptionIcon sx={{ color: colors.grey[500], mr: 1 }} /> }}
                      />
                    </Grid>
                  </Grid>

                  {/* --- Project Details --- */}
                  <Typography
                    variant="h5"
                    color={colors.greenAccent[400]}
                    sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                  >
                    Project Details
                  </Typography>
                  <Grid container spacing={3} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Location"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.location}
                        name="location"
                        error={!!touched.location && !!errors.location}
                        helperText={touched.location && errors.location}
                        InputProps={{ startAdornment: <LocationOnIcon sx={{ color: colors.grey[500] }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        label="Area (sqm)"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.area}
                        name="area"
                        error={!!touched.area && !!errors.area}
                        helperText={touched.area && errors.area}
                        InputProps={{ startAdornment: <AspectRatioIcon sx={{ color: colors.grey[500] }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        label="Number of Floors"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.number_of_floor}
                        name="number_of_floor"
                        error={!!touched.number_of_floor && !!errors.number_of_floor}
                        helperText={touched.number_of_floor && errors.number_of_floor}
                        InputProps={{ startAdornment: <LayersIcon sx={{ color: colors.grey[500] }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" error={!!touched.type && !!errors.type} sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
      minWidth: '220px', // أضف هذا لفرض عرض أدنى للمكون
    }}>
                        <InputLabel>Project Type</InputLabel>
                        <Select
                          value={values.type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Project Type"
                          name="type"
                          startAdornment={<CategoryIcon sx={{ color: colors.grey[500], mr: 1 }} />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {projectTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.type && errors.type && (
                          <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                            {errors.type}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        label="Expected Date of Completion"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.expected_date_of_completed}
                        name="expected_date_of_completed"
                        error={!!touched.expected_date_of_completed && !!errors.expected_date_of_completed}
                        helperText={touched.expected_date_of_completed && errors.expected_date_of_completed}
                        InputLabelProps={{ shrink: true }} // Ensures label is always above input
                        InputProps={{ startAdornment: <EventIcon sx={{ color: colors.grey[500], mr: 1 }} /> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        label="Expected Cost"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.expected_cost}
                        name="expected_cost"
                        error={!!touched.expected_cost && !!errors.expected_cost}
                        helperText={touched.expected_cost && errors.expected_cost}
                        InputProps={{ startAdornment: <AttachMoneyIcon sx={{ color: colors.grey[500] }} /> }}
                      />
                    </Grid>
                  </Grid>

                  {/* --- Project Status and Progress --- */}
                  <Typography
                    variant="h5"
                    color={colors.greenAccent[400]}
                    sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                  >
                    Status & Progress
                  </Typography>
                  <Grid container spacing={3} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" error={!!touched.status_of_sale && !!errors.status_of_sale} sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
      minWidth: '220px', // أضف هذا لفرض عرض أدنى للمكون
    }}>
                        <InputLabel>Status of Sale</InputLabel>
                        <Select
                          value={values.status_of_sale}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Status of Sale"
                          name="status_of_sale"
                          startAdornment={<CheckCircleOutlineIcon sx={{ color: colors.grey[500], mr: 1 }} />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {statusOfSaleOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.status_of_sale && errors.status_of_sale && (
                          <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                            {errors.status_of_sale}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" error={!!touched.progress_status && !!errors.progress_status} sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
      minWidth: '220px', // أضف هذا لفرض عرض أدنى للمكون
    }}>
                        <InputLabel>Progress Status</InputLabel>
                        <Select
                          value={values.progress_status}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Progress Status"
                          name="progress_status"
                          startAdornment={<TrendingUpIcon sx={{ color: colors.grey[500], mr: 1 }} />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {progressStatusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.progress_status && errors.progress_status && (
                          <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                            {errors.progress_status}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* --- Project Associations --- */}
                  <Typography
                    variant="h5"
                    color={colors.greenAccent[400]}
                    sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                  >
                    Associations
                  </Typography>
                  <Grid container spacing={3} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" error={!!touched.owner_id && !!errors.owner_id} sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
      minWidth: '220px', // أضف هذا لفرض عرض أدنى للمكون
    }}>
                        <InputLabel>Owner</InputLabel>
                        <Select
                          value={values.owner_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Owner"
                          name="owner_id"
                          startAdornment={<PersonIcon sx={{ color: colors.grey[500], mr: 1 }} />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {owners.map((owner) => (
                            <MenuItem key={owner.id} value={owner.id}>
                              {owner.user.first_name} {owner.user.last_name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.owner_id && errors.owner_id && (
                          <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                            {errors.owner_id}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" error={!!touched.consulting_company_id && !!errors.consulting_company_id} sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
      minWidth: '220px', // أضف هذا لفرض عرض أدنى للمكون
    }}>
                        <InputLabel>Consulting Company</InputLabel>
                        <Select
                          value={values.consulting_company_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Consulting Company"
                          name="consulting_company_id"
                          startAdornment={<BusinessIcon sx={{ color: colors.grey[500], mr: 1 }} />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {consultingCompanies.map((company) => (
                            <MenuItem key={company.id} value={company.id}>
                              {company.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.consulting_company_id && errors.consulting_company_id && (
                          <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                            {errors.consulting_company_id}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* --- Submit Button --- */}
                  <Box display="flex" justifyContent="end" mt="30px" width="100%">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        backgroundColor: colors.greenAccent[700],
                        color: colors.blueAccent[100],
                        padding: "12px 25px",
                        fontWeight: "bold",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
                        '&:hover': {
                          backgroundColor: colors.greenAccent[800],
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Create Project"
                      )}
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        )}
      </Box>
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default AddProject;