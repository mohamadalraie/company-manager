import { useState, useRef } from "react";
import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
import { createSalesManagerApi } from "../../../shared/APIs"; // <-- API جديد
import CustomSnackbar from "../../../components/CustomSnackbar";
import {
  Box, Button, IconButton, InputAdornment, useTheme, TextField,
  CircularProgress, Grid, Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WorkIcon from "@mui/icons-material/Work";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { getAuthToken } from "../../../shared/Permissions";

const AddSalesManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const [isLoading, setIsLoading] = useState(false);
  const snackbarRef = useRef(null);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      
      // <-- استخدام API إنشاء مدير مبيعات
      await axios.post(`${baseUrl}${createSalesManagerApi}`, values, config);

      snackbarRef.current.showSnackbar("Sales Manager created successfully!", "success");
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create Sales Manager.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
  };

  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  const userSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().matches(phoneRegExp, "Phone number is invalid").required("Phone Number is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  });

  return (
    <Box m="10px">
      <Header title="Create New Sales Manager" subtitle="Add a new sales manager to the system" />
      <Box sx={{ display: "flex", justifyContent: "center", mt: "20px", mb: "20px" }}>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={userSchema}>
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Box sx={{
                display: "flex", flexDirection: "column", alignItems: "center",
                width: isNonMobile ? "75%" : "100%", maxWidth: "900px", p: "30px",
                backgroundColor: colors.primary[800], borderRadius: "12px",
                boxShadow: `0px 0px 15px -5px ${colors.greenAccent[600]}`, gap: "25px",
              }}>
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mb: 1, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}>
                  Personal Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" type="text" label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.first_name} name="first_name" error={!!touched.first_name && !!errors.first_name} helperText={touched.first_name && errors.first_name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon/></InputAdornment> }} /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" type="text" label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.last_name} name="last_name" error={!!touched.last_name && !!errors.last_name} helperText={touched.last_name && errors.last_name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon/></InputAdornment> }} /></Grid>
                </Grid>

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}>
                  Contact Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" type="email" label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon/></InputAdornment> }} /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" type="tel" label="Phone Number" onBlur={handleBlur} onChange={handleChange} value={values.phone_number} name="phone_number" error={!!touched.phone_number && !!errors.phone_number} helperText={touched.phone_number && errors.phone_number} InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon/></InputAdornment> }} /></Grid>
                </Grid>
                
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}>
                  Account & Professional Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" type={showPassword ? "text" : "password"} label="Password" onBlur={handleBlur} onChange={handleChange} value={values.password} name="password" error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon/></InputAdornment>, endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>),}}/></Grid>
                </Grid>

                <Box display="flex" justifyContent="end" mt="30px" width="100%">
                  <Button type="submit" variant="contained" disabled={isLoading} sx={{ backgroundColor: colors.greenAccent[700], color: colors.blueAccent[100], padding: "12px 25px", fontWeight: "bold", borderRadius: "5px" }}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Sales Manager"}
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

export default AddSalesManager;