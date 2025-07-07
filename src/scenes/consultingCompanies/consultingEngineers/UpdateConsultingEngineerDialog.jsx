// src/scenes/consultingCompanies/consultingEngineers/UpdateConsultingEngineerDialog.jsx

import { useState, useRef } from "react";
import {
  Box, Button, IconButton, InputAdornment, useTheme, TextField, InputLabel,
  FormControl, NativeSelect, CircularProgress, Grid, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
import { updateConsultingEngineerApi } from "../../../shared/APIs"; // تأكد من وجود هذا المتغير
import { getAuthToken } from "../../../shared/Permissions";
import CustomSnackbar from "../../../components/CustomSnackbar";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WorkIcon from "@mui/icons-material/Work";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UpdateConsultingEngineerDialog = ({ open, onClose, engineerData, onSuccess,consultingCompanyId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Assuming specializations list is static and can be here
  const specializations = [
    { id: 1, name: "Civil Engineering" }, { id: 2, name: "Electrical Engineering" },
    { id: 3, name: "Mechanical Engineering" }, { id: 4, name: "Architectural Engineering" },
    { id: 5, name: "Computer Engineering" }, { id: 6, name: "Environmental Engineering" },
    { id: 7, name: "Industrial Engineering" }, { id: 8, name: "Structural Engineering" },
    { id: 9, name: "Geotechnical Engineering" }, { id: 10, name: "Chemical Engineering" },
  ];

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const submissionData = { ...values,consulting_company_id:consultingCompanyId };

    if (!submissionData.password) {
      delete submissionData.password;
    }
    
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` }};
      await axios.put(`${baseUrl}${updateConsultingEngineerApi}${engineerData.id}`, submissionData, config);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating engineer:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to update engineer.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const userSchema = yup.object().shape({
    first_name: yup.string().required("Required"),
    last_name: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    phone_number: yup.string().matches(phoneRegExp, "Invalid phone").required("Required"),
    engineer_specialization_id: yup.string().required("Required"),
    password: yup.string().min(6, "Must be at least 6 characters"), // Optional
    years_of_experience: yup.number().typeError("Must be a number").required("Required").min(0),
  });

  if (!engineerData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[800] }}>Edit Consulting Engineer</DialogTitle>
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
            password: "", // Always empty
            consulting_company_id: engineerData.consulting_company_id,
          }}
          validationSchema={userSchema}
          enableReinitialize
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} id="update-consulting-engineer-form">
              <Box sx={{ p: "20px 0", display: "flex", flexDirection: "column", gap: "25px" }}>
                {/* Personal Details */}
                <Typography variant="h5" color={colors.greenAccent[400]}>Personal Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.first_name} name="first_name" error={!!touched.first_name && !!errors.first_name} helperText={touched.first_name && errors.first_name} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.last_name} name="last_name" error={!!touched.last_name && !!errors.last_name} helperText={touched.last_name && errors.last_name} />
                  </Grid>
                </Grid>

                {/* Contact Details */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Contact</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Phone Number" onBlur={handleBlur} onChange={handleChange} value={values.phone_number} name="phone_number" error={!!touched.phone_number && !!errors.phone_number} helperText={touched.phone_number && errors.phone_number} />
                  </Grid>
                </Grid>

                {/* Professional Details */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Professional</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" error={!!touched.engineer_specialization_id && !!errors.engineer_specialization_id}>
                      <InputLabel>Specialization</InputLabel>
                      <NativeSelect value={values.engineer_specialization_id} onChange={handleChange} onBlur={handleBlur} inputProps={{ name: "engineer_specialization_id" }}>
                        <option aria-label="None" value="" />
                        {specializations.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                      </NativeSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" type="number" label="Years of Experience" onBlur={handleBlur} onChange={handleChange} value={values.years_of_experience} name="years_of_experience" error={!!touched.years_of_experience && !!errors.years_of_experience} helperText={touched.years_of_experience && errors.years_of_experience} />
                  </Grid>
                </Grid>

                {/* Account Details */}
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Account (Optional)</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField fullWidth variant="outlined" type={showPassword ? "text" : "password"} label="New Password (leave blank to keep)" onBlur={handleBlur} onChange={handleChange} value={values.password} name="password" error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} />
                  </Grid>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[800], p: "16px" }}>
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>Cancel</Button>
        <Button type="submit" form="update-consulting-engineer-form" disabled={isLoading} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}>
          {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
      <CustomSnackbar ref={snackbarRef} />
    </Dialog>
  );
};

export default UpdateConsultingEngineerDialog;