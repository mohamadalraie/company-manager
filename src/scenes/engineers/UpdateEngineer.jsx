// src/scenes/engineers/addEngineer/UpdateEngineerDialog.jsx

import { useState, useRef, useEffect } from "react";
import {
  Box, Button, IconButton, InputAdornment, useTheme, TextField, InputLabel,
  FormControl, NativeSelect, CircularProgress, Grid, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle // MUI Dialog components
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { updateEngineerApi } from "../../shared/APIs"; // Assuming an update API exists
import { getAuthToken } from "../../shared/Permissions";
import CustomSnackbar from "../../components/CustomSnackbar";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WorkIcon from "@mui/icons-material/Work";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// The form component, now wrapped in a Dialog
const UpdateEngineerDialog = ({ open, onClose, engineerData, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);

  // State for loading and password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Hardcoded specializations, assuming they are the same as in the add form
  const specializations = [
    { id: 1, name: "Civil Engineering" },
    { id: 2, name: "Electrical Engineering" },
    { id: 3, name: "Mechanical Engineering" },
    { id: 4, name: "Architectural Engineering" },
    { id: 5, name: "Computer Engineering" },
    { id: 6, name: "Environmental Engineering" },
    { id: 7, name: "Industrial Engineering" },
    { id: 8, name: "Structural Engineering" },
    { id: 9, name: "Geotechnical Engineering" },
    { id: 10, name: "Chemical Engineering" },
  ];

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    // Create a copy of values to modify
    const submissionData = { ...values };

    // If password is not changed, don't send it in the request
    if (!submissionData.password) {
      delete submissionData.password;
    }
    
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` }};
      // Use the correct API endpoint for updating, including the engineer's ID
      await axios.put(`${baseUrl}${updateEngineerApi}${engineerData.id}`, submissionData, config);
      
      onSuccess(); // Trigger refetch and show success snackbar in parent
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error updating engineer:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to update engineer.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validation schema for the update form
  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const userSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().matches(phoneRegExp, "Phone number is invalid").required("Phone Number is required"),
    engineer_specialization_id: yup.string().required("Specialization is required"),
    password: yup.string().min(6, "Password must be at least 6 characters"), // Password is now optional
    years_of_experience: yup.number().typeError("Experience must be a number").required("Years of Experience is required").min(0, "Cannot be negative"),
  });

  if (!engineerData) return null; // Don't render if there's no data

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.grey[100] }}>
        Edit Engineer Details
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            first_name: engineerData.first_name || "",
            last_name: engineerData.last_name || "",
            email: engineerData.email || "",
            phone_number: engineerData.phone_number || "",
            engineer_specialization_id: engineerData.engineer_specialization_id || "",
            years_of_experience: engineerData.years_of_experience || "",
            password: "", // Always start with an empty password field
          }}
          validationSchema={userSchema}
          enableReinitialize // Important: allows the form to re-initialize with new data
        >
          {({
            values, errors, touched, handleBlur, handleChange, handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} id="update-engineer-form">
                {/* Form content is the same as AddEngineer, wrapped in DialogContent */}
                {/* You can copy the content from the <Box> in AddEngineer here */}
                 <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                   p: "20px 0", // Padding for inside the dialog
                  gap: "25px",
                }}
              >
                {/* Personal Details Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ width: "100%", textAlign: "left" }}>
                  Personal Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" type="text" label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.first_name} name="first_name" error={!!touched.first_name && !!errors.first_name} helperText={touched.first_name && errors.first_name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" type="text" label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.last_name} name="last_name" error={!!touched.last_name && !!errors.last_name} helperText={touched.last_name && errors.last_name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
                  </Grid>
                </Grid>

                {/* Contact Details Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ width: "100%", textAlign: "left", mt: 2 }}>
                  Contact Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth variant="outlined" type="email" label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth variant="outlined" type="tel" label="Phone Number" onBlur={handleBlur} onChange={handleChange} value={values.phone_number} name="phone_number" error={!!touched.phone_number && !!errors.phone_number} helperText={touched.phone_number && errors.phone_number} InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon /></InputAdornment> }} />
                    </Grid>
                </Grid>

                {/* Professional Details Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ width: "100%", textAlign: "left", mt: 2 }}>
                  Professional Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" name="engineer_specialization_id" error={!!touched.engineer_specialization_id && !!errors.engineer_specialization_id}>
                            <InputLabel>Specialization</InputLabel>
                            <NativeSelect value={values.engineer_specialization_id} onChange={handleChange} onBlur={handleBlur} inputProps={{ name: "engineer_specialization_id" }}>
                                <option value=""></option>
                                {specializations.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </NativeSelect>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth variant="outlined" type="number" label="Years of Experience" onBlur={handleBlur} onChange={handleChange} value={values.years_of_experience} name="years_of_experience" error={!!touched.years_of_experience && !!errors.years_of_experience} helperText={touched.years_of_experience && errors.years_of_experience} InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon /></InputAdornment> }} />
                    </Grid>
                </Grid>

                 {/* Account Details Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ width: "100%", textAlign: "left", mt: 2 }}>
                  Account Details (Optional)
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth variant="outlined" type={showPassword ? "text" : "password"} label="New Password (leave blank to keep current)" onBlur={handleBlur} onChange={handleChange} value={values.password} name="password" error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                            endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={e => e.preventDefault()} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                        }} />
                    </Grid>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[800], p: "16px" }}>
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="update-engineer-form" // Link button to the form
          disabled={isLoading}
          variant="contained"
          sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
      <CustomSnackbar ref={snackbarRef} />
    </Dialog>
  );
};

export default UpdateEngineerDialog;