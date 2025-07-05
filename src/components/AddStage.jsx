import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  // Select, MenuItem, FormControl, InputLabel are no longer needed for priority
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { tokens } from "../theme";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import { createStageApi } from '../shared/APIs';
import { getAuthToken } from '../shared/Permissions';

// --- External Libraries ---
import { Formik } from "formik";
import * as yup from "yup";

// --- Icons for form fields ---
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LowPriorityIcon from '@mui/icons-material/LowPriority';


// --- The Refactored Add Stage Component ---
const AddNewStage = ({ projectId,onStageAdded }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      await axios.post(`${baseUrl}${createStageApi}`, values, config);
      setSnackbar({ open: true, message: "Stage created successfully!", severity: "success" });
      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating stage:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to create stage. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsLoading(false);
      onStageAdded();
    }
  };

  const handleCancel = (resetForm) => {
    setIsAdding(false);
    resetForm();
  };
  
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const initialValues = {
    name: "",
    description: "",
    start_date: "",
    expected_closed_date: "",
    priority: "", // Changed to empty string for the number field
    project_id:projectId
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Stage name is required"),
    description: yup.string().required("Description is required"),
    start_date: yup.date().required("Start date is required"),
    expected_closed_date: yup.date()
      .required("Expected close date is required")
      .min(yup.ref('start_date'), "Close date cannot be before start date"),
    // --- 1. Updated Priority Validation ---
    priority: yup.number()
      .typeError("Priority must be a number")
      .positive("Priority must be a positive number")
      .integer()
      .required("Priority is required"),
  });

  // --- Main Render Logic ---
  const renderContent = () => {
    if (isAdding) {
      return (
        <Box
          sx={{
            p: 2,
            mt: 1,
            backgroundColor: colors.primary[800],
            borderRadius: '8px',
            border: `1px solid ${colors.grey[700]}`,
          }}
        >
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm }) => (
              <form onSubmit={handleSubmit}>
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mb: 2, pb: 1, borderBottom: `1px solid ${colors.grey[700]}` }}>
                  Add New Stage
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth variant="outlined" type="text" label="Stage Name"
                      onBlur={handleBlur} onChange={handleChange} value={values.name} name="name"
                      error={!!touched.name && !!errors.name} helperText={touched.name && errors.name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon /></InputAdornment> }}
                    />
                  </Grid>
                  {/* --- 2. Description is now on its own line --- */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth variant="outlined" type="text" label="Description"
                      onBlur={handleBlur} onChange={handleChange} value={values.description} name="description"
                      error={!!touched.description && !!errors.description} helperText={touched.description && errors.description}
                      multiline rows={3}
                      InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth variant="outlined" type="date" label="Start Date"
                      onBlur={handleBlur} onChange={handleChange} value={values.start_date} name="start_date"
                      error={!!touched.start_date && !!errors.start_date} helperText={touched.start_date && errors.start_date}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><DateRangeIcon /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth variant="outlined" type="date" label="Expected Closed Date"
                      onBlur={handleBlur} onChange={handleChange} value={values.expected_closed_date} name="expected_closed_date"
                      error={!!touched.expected_closed_date && !!errors.expected_closed_date} helperText={touched.expected_closed_date && errors.expected_closed_date}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><DateRangeIcon /></InputAdornment> }}
                    />
                  </Grid>
                  {/* --- 3. Priority is now a number TextField --- */}
                  <Grid item xs={12}>
                     <TextField
                        fullWidth variant="outlined" type="number" label="Priority"
                        onBlur={handleBlur} onChange={handleChange} value={values.priority} name="priority"
                        error={!!touched.priority && !!errors.priority} helperText={touched.priority && errors.priority}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LowPriorityIcon /></InputAdornment> }}
                     />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
                  <Button onClick={() => handleCancel(resetForm)} sx={{ color: colors.grey[300] }}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Stage"}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      );
    }
    // --- The "Add" Button ---
    return (
      <Box onClick={() => setIsAdding(true)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, mt: 1, border: `2px dashed ${colors.grey[700]}`, borderRadius: '8px', color: colors.grey[400], cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { color: colors.greenAccent[400], borderColor: colors.greenAccent[400], backgroundColor: colors.primary[800] } }}>
        <AddCircleOutlineIcon sx={{ mr: 1 }} />
        <Typography fontWeight="600">Add New Stage</Typography>
      </Box>
    );
  };

  return (
    <>
      {renderContent()}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddNewStage;