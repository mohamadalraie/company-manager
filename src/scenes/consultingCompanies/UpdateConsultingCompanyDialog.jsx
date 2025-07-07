// src/scenes/consultingCompanies/UpdateConsultingCompanyDialog.jsx

import { useState, useRef } from "react";
import {
  Box, Button, InputAdornment, useTheme, TextField,
  CircularProgress, Grid, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { updateConsultingCompanyApi } from "../../shared/APIs"; // تأكد من وجود هذا المتغير
import { getAuthToken } from "../../shared/Permissions";
import CustomSnackbar from "../../components/CustomSnackbar";

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import NumbersIcon from '@mui/icons-material/Numbers';

const UpdateConsultingCompanyDialog = ({ open, onClose, companyData, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` }};
      await axios.put(`${baseUrl}${updateConsultingCompanyApi}${companyData.id}`, values, config);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating company:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to update company.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const validationSchema = yup.object().shape({
    name: yup.string().required("Company Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    focal_point_first_name: yup.string().required("Focal Point First Name is required"),
    focal_point_last_name: yup.string().required("Focal Point Last Name is required"),
    address: yup.string().required("Address is required"),
    land_line: yup.string().matches(phoneRegExp, "Land line is invalid").required("Land line is required"),
    license_number: yup.string().required("License Number is required"),
    phone_number: yup.string().matches(phoneRegExp, "Phone number is invalid").required("Phone number is required"),
  });

  if (!companyData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.grey[100] }}>
        Edit Consulting Company
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            name: companyData.name || "",
            email: companyData.email || "",
            focal_point_first_name: companyData.focal_point_first_name || "",
            focal_point_last_name: companyData.focal_point_last_name || "",
            address: companyData.address || "",
            land_line: companyData.land_line || "",
            license_number: companyData.license_number || "",
            phone_number: companyData.phone_number || "",
          }}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} id="update-company-form">
              <Box sx={{ p: "20px 0", display: "flex", flexDirection: "column", gap: "25px" }}>
                <Typography variant="h5" color={colors.greenAccent[400]}>Company Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Company Name" onBlur={handleBlur} onChange={handleChange} value={values.name} name="name" error={!!touched.name && !!errors.name} helperText={touched.name && errors.name} InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="License Number" onBlur={handleBlur} onChange={handleChange} value={values.license_number} name="license_number" error={!!touched.license_number && !!errors.license_number} helperText={touched.license_number && errors.license_number} InputProps={{ startAdornment: <InputAdornment position="start"><NumbersIcon /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth variant="outlined" label="Address" onBlur={handleBlur} onChange={handleChange} value={values.address} name="address" error={!!touched.address && !!errors.address} helperText={touched.address && errors.address} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment> }} />
                  </Grid>
                </Grid>

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Contact Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Company Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} />
                  </Grid>
                   <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Company Phone" onBlur={handleBlur} onChange={handleChange} value={values.phone_number} name="phone_number" error={!!touched.phone_number && !!errors.phone_number} helperText={touched.phone_number && errors.phone_number} InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon /></InputAdornment> }} />
                  </Grid>
                   <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Company Landline" onBlur={handleBlur} onChange={handleChange} value={values.land_line} name="land_line" error={!!touched.land_line && !!errors.land_line} helperText={touched.land_line && errors.land_line} InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon /></InputAdornment> }} />
                  </Grid>
                </Grid>
                
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Focal Point Details</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth variant="outlined" label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.focal_point_first_name} name="focal_point_first_name" error={!!touched.focal_point_first_name && !!errors.focal_point_first_name} helperText={touched.focal_point_first_name && errors.focal_point_first_name} InputProps={{ startAdornment: <InputAdornment position="start"><PermIdentityIcon /></InputAdornment> }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth variant="outlined" label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.focal_point_last_name} name="focal_point_last_name" error={!!touched.focal_point_last_name && !!errors.focal_point_last_name} helperText={touched.focal_point_last_name && errors.focal_point_last_name} InputProps={{ startAdornment: <InputAdornment position="start"><PermIdentityIcon /></InputAdornment> }} />
                    </Grid>
                </Grid>

              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[800], p: "16px" }}>
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>Cancel</Button>
        <Button type="submit" form="update-company-form" disabled={isLoading} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
      <CustomSnackbar ref={snackbarRef} />
    </Dialog>
  );
};

export default UpdateConsultingCompanyDialog;