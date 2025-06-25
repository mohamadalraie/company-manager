// src/scenes/consultingCompanies/AddConsultingCompany.jsx

// imports
import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
import { createConsultingCompanyApi } from "../../../shared/APIs";
import CustomSnackbar from "../../../components/CustomSnackbar";

// react
import { useState, useRef } from "react";

// mui libraries
import {
  Box,
  Button,
  useTheme,
  TextField,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import NumbersIcon from '@mui/icons-material/Numbers';

//External libraries
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { getAuthToken } from "../../../shared/Permissions";


const AddConsultingCompany = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");


  const [isLoading, setIsLoading] = useState(false);
  const snackbarRef = useRef(null);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      }

      console.log("Submitting values:", values);
      const response = await axios.post(
        `${baseUrl}${createConsultingCompanyApi}`,
        values,config
      );

      console.log("Company created successfully:", response.data);
      snackbarRef.current.showSnackbar(
        "Company created successfully!",
        "success"
      );
      resetForm();
    } catch (error) {
      console.error(
        "Error creating Company:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create Company. Please try again.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    name: "",
    email: "",
    focal_point_first_name: "",
    focal_point_last_name: "",
    address: "",
    land_line: "",
    license_number: "",
    phone_number: "",
  };

  const phoneRegExp =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  const validationSchema = yup.object().shape({
    name: yup.string().required("Company Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    focal_point_first_name: yup.string().required("Focal Point First Name is required"),
    focal_point_last_name: yup.string().required("Focal Point Last Name is required"),
    address: yup.string().required("Address is required"),
    land_line: yup
      .string()
      .matches(phoneRegExp, "Land line is invalid")
      .required("Land line is required"),
    license_number: yup.string().required("License Number is required"),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is invalid")
      .required("Phone number is required"),
  });

  return (
    <Box m="10px">
      <Header
        title="Create New Consulting Company"
        subtitle="Add a new consulting company to the system"
      ></Header>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mt: "20px",
          mb: "20px"
        }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                  // Set explicit width for the form container relative to its parent (form)
                  width: isNonMobile ? "75%" : "100%", // On non-mobile, take 75% width, otherwise 100%
                  maxWidth: "900px", // Maintain max width for large screens
                  p: "30px",
                  backgroundColor: colors.primary[800],
                  borderRadius: "12px",
                  boxShadow: `0px 0px 15px -5px ${colors.greenAccent[600]}`,
                  gap: "25px",
                }}
              >
                {/* --- Company Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 1, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[700]}` }}
                >
                  Company Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  {/* Full width fields on all screen sizes */}
                  <Grid item xs={12}> {/* Takes full width on all screen sizes */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Company Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      name="name"
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}> {/* Takes full width on all screen sizes */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      label="Company Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}> {/* Takes full width on all screen sizes */}
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
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}> {/* Takes full width on all screen sizes */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="License Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.license_number}
                      name="license_number"
                      error={!!touched.license_number && !!errors.license_number}
                      helperText={touched.license_number && errors.license_number}
                      InputProps={{ startAdornment: <InputAdornment position="start"><NumbersIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  </Grid>
                  <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[700]}` }}
                >
                  Contact Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  {/* Company Phone Number and Land Line side-by-side on larger screens, full width on small */}
                  <Grid item xs={12} sm={6}> {/* Full width on extra-small, half on small and up */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="tel"
                      label="Company Phone Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone_number}
                      name="phone_number"
                      error={!!touched.phone_number && !!errors.phone_number}
                      helperText={touched.phone_number && errors.phone_number}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}> {/* Full width on extra-small, half on small and up */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="tel"
                      label="Company Land Line"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.land_line}
                      name="land_line"
                      error={!!touched.land_line && !!errors.land_line}
                      helperText={touched.land_line && errors.land_line}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>

                {/* --- Focal Point Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[700]}` }}
                >
                  Focal Point Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  {/* Focal Point Names side-by-side on larger screens, full width on small */}
                  <Grid item xs={12} sm={6}> {/* Full width on extra-small, half on small and up */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Focal Point First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.focal_point_first_name}
                      name="focal_point_first_name"
                      error={!!touched.focal_point_first_name && !!errors.focal_point_first_name}
                      helperText={touched.focal_point_first_name && errors.focal_point_first_name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PermIdentityIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}> {/* Full width on extra-small, half on small and up */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Focal Point Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.focal_point_last_name}
                      name="focal_point_last_name"
                      error={!!touched.focal_point_last_name && !!errors.focal_point_last_name}
                      helperText={touched.focal_point_last_name && errors.focal_point_last_name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PermIdentityIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>

                {/* --- Submit Button --- */}
                <Box display="flex" justifyContent="end" mt="30px" width="100%">
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: colors.greenAccent[700],
                      color: colors.blueAccent[100],
                      padding: "12px 25px",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
                    }}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        '&:hover': {
                            backgroundColor: colors.greenAccent[800],
                            transform: 'translateY(-3px)',
                        }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Company"
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

export default AddConsultingCompany;