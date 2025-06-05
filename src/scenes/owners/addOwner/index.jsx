// src/scenes/owners/addOwner/index.jsx

// imports
import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
// Assuming you have an API endpoint for creating owners
import { createOwnerApi } from "../../../shared/APIs";
import CustomSnackbar from "../../../components/CustomSnackbar";

// react
import { useState, useRef } from "react";

// mui libraries
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  TextField,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import PersonIcon from "@mui/icons-material/Person"; // For first/last name
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // For password
import HomeIcon from '@mui/icons-material/Home'; // For address
import ArticleIcon from '@mui/icons-material/Article'; // For national_id
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


//External libraries
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const AddOwner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // State for API loading
  const [isLoading, setIsLoading] = useState(false);
  const snackbarRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      console.log("Submitting values:", values);
      const response = await axios.post(
        `${baseUrl}${createOwnerApi}`,
        values,
        {
          headers: {
            // Add any required headers here (e.g., Authorization token)
          },
        }
      );

      console.log("Owner created successfully:", response.data);
      snackbarRef.current.showSnackbar(
        "Owner created successfully!",
        "success"
      );
      resetForm();
    } catch (error) {
      console.error(
        "Error creating owner:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create owner. Please try again.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial form values for owner
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    national_id: "",
  };

  // Regular expression for phone number validation
  const phoneRegExp =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  // Validation schema for owner creation using yup
  const ownerSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is invalid")
      .required("Phone Number is required"),
    address: yup.string().required("Address is required"),
    national_id: yup.string().required("National ID is required"),
  });

  // The main return
  return (
    <Box m="10px">
      <Header
        title="Create New Owner"
        subtitle="Add a new owner to the system"
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
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={ownerSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
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
                  boxShadow: `0px 6px 15px ${colors.grey[900]}`,
                  gap: "25px",
                }}
              >
                {/* --- Personal Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 1, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                >
                  Personal Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  {/* First Name and Last Name side-by-side on larger screens */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.first_name}
                      name="first_name"
                      error={!!touched.first_name && !!errors.first_name}
                      helperText={touched.first_name && errors.first_name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.last_name}
                      name="last_name"
                      error={!!touched.last_name && !!errors.last_name}
                      helperText={touched.last_name && errors.last_name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>

                {/* --- Contact Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                >
                  Contact Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="tel"
                      label="Phone Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone_number}
                      name="phone_number"
                      error={!!touched.phone_number && !!errors.phone_number}
                      helperText={touched.phone_number && errors.phone_number}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      name="address"
                      error={!!touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                      InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>

                {/* --- Security & Identification Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                >
                  Security & Identification
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: colors.grey[500] }} /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="National ID"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.national_id}
                      name="national_id"
                      error={!!touched.national_id && !!errors.national_id}
                      helperText={touched.national_id && errors.national_id}
                      InputProps={{ startAdornment: <InputAdornment position="start"><ArticleIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
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
                      "Create Owner"
                    )}
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default AddOwner;