import { useState, useRef } from "react";
import {
  Box, Button, IconButton, InputAdornment, useTheme, TextField,
  CircularProgress, Grid, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { updateSalesManagerApi } from "../../shared/APIs";
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

const UpdateSalesManagerDialog = ({ open, onClose, managerData, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const submissionData = { ...values };

    // إذا لم يتم إدخال كلمة مرور جديدة، احذفها من البيانات المرسلة
    if (!submissionData.password) {
      delete submissionData.password;
    }
    
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` }};
      // استخدام PUT للتحديث مع ID المدير
      await axios.put(`${baseUrl}${updateSalesManagerApi}${managerData.id}`, submissionData, config);
      
      onSuccess(); // استدعاء دالة النجاح لإعادة تحميل البيانات في الواجهة الأم
      onClose();   // إغلاق الديالوج
    } catch (error) {
      console.error("Error updating sales manager:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to update sales manager.";
      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  
  // كلمة المرور اختيارية في حالة التعديل
  const userSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().matches(phoneRegExp, "Phone number is invalid").required("Phone Number is required"),
    password: yup.string().min(6, "Password must be at least 6 characters"), // Not required
 });

  if (!managerData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.grey[100] }}>
        Edit Sales Manager
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            first_name: managerData.first_name || "",
            last_name: managerData.last_name || "",
            email: managerData.email || "",
            phone_number: managerData.phone_number || "",
            password: "", // حقل كلمة المرور يبدأ فارغًا دائمًا
          }}
          validationSchema={userSchema}
          enableReinitialize
        >
          {({
            values, errors, touched, handleBlur, handleChange, handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} id="update-sales-manager-form">
              <Box sx={{ p: "20px 0", display: "flex", flexDirection: "column", gap: "25px" }}>
                
                <Typography variant="h5" color={colors.greenAccent[400]}>Personal Details</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.first_name} name="first_name" error={!!touched.first_name && !!errors.first_name} helperText={touched.first_name && errors.first_name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.last_name} name="last_name" error={!!touched.last_name && !!errors.last_name} helperText={touched.last_name && errors.last_name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
                  </Grid>
                </Grid>

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Contact & Professional</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" label="Phone Number" onBlur={handleBlur} onChange={handleChange} value={values.phone_number} name="phone_number" error={!!touched.phone_number && !!errors.phone_number} helperText={touched.phone_number && errors.phone_number} InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon /></InputAdornment> }} />
                  </Grid>
                </Grid>

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 2 }}>Account Details (Optional)</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField fullWidth variant="outlined" type={showPassword ? "text" : "password"} label="New Password (leave blank to keep)" onBlur={handleBlur} onChange={handleChange} value={values.password} name="password" error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={{
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
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>Cancel</Button>
        <Button type="submit" form="update-sales-manager-form" disabled={isLoading} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
        </Button>
      </DialogActions>
      <CustomSnackbar ref={snackbarRef} />
    </Dialog>
  );
};

export default UpdateSalesManagerDialog;