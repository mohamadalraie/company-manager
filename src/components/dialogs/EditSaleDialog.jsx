import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, Grid, CircularProgress, 
  useTheme, Chip, Paper, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import { updateProjectSaleApi } from "../../shared/APIs";
import CustomSnackbar from "../CustomSnackbar";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';

// --- المكون الفرعي لإدارة رفع الوسائط ---
const MediaEditField = ({ label, currentFileUrl, fileType, formikProps }) => {
    const [fileName, setFileName] = useState("");
    const inputName = label.toLowerCase().replace(/ /g, '_');

    return (
        <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px dashed grey' }}>
            <Typography gutterBottom>{label}</Typography>
            {currentFileUrl && (
                <a href={currentFileUrl} target="_blank" rel="noopener noreferrer">View Current</a>
            )}
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
                <ChangeCircleIcon sx={{ mr: 1 }} />
                Change File
                <input 
                    type="file" 
                    hidden 
                    accept={fileType === 'image' ? "image/*" : "video/*"}
                    onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (file) {
                            formikProps.setFieldValue(inputName, file);
                            setFileName(file.name);
                        }
                    }} 
                />
            </Button>
            <Box minHeight="24px" mt={1}>
              {fileName && <Chip label={fileName} onDelete={() => {
                  formikProps.setFieldValue(inputName, null);
                  setFileName("");
              }}/>}
            </Box>
        </Paper>
    );
}

const EditSaleDialog = ({ open, onClose, saleData, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('_method', 'PUT');
formData=
{...formData,projct_id:saleData.id};
    Object.keys(values).forEach(key => {
      if (values[key] instanceof File) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'multipart/form-data' } };
      await axios.put(`${baseUrl}${updateProjectSaleApi}${saleData.id}`, formData, config);
      snackbarRef.current.showSnackbar("Details updated successfully!", "success");
      onSuccess(); // استدعاء دالة النجاح لتحديث البيانات في الخلفية
    } catch (error) {
      snackbarRef.current.showSnackbar(error.response?.data?.message || "Update failed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema = yup.object().shape({
    main_title: yup.string().required("Required"),
    marketing_description: yup.string().required("Required"),
    address: yup.string().required("Required"),
    location_link: yup.string().url("Must be a valid URL").required("Required"),
    main_image: yup.mixed().nullable(),
    diagram_image: yup.mixed().nullable(),
    video_url: yup.mixed().nullable(),
  });

  if (!saleData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[800] }}>Edit Sale Details</DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            main_title: saleData?.main_title || "",
            marketing_description: saleData?.marketing_description || "",
            location_link: saleData?.location_link || "",
            address: saleData?.address || "",
            video_url: null, main_image: null, diagram_image: null,
          }}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit} id="edit-sale-form">
              <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12}><TextField disabled fullWidth label="Project" value={saleData?.project?.title || ''} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Main Title" name="main_title" value={formikProps.values.main_title} onChange={formikProps.handleChange} error={!!formikProps.touched.main_title && !!formikProps.errors.main_title} helperText={formikProps.touched.main_title && formikProps.errors.main_title} /></Grid>
                <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Marketing Description" name="marketing_description" value={formikProps.values.marketing_description} onChange={formikProps.handleChange} error={!!formikProps.touched.marketing_description && !!formikProps.errors.marketing_description} helperText={formikProps.touched.marketing_description && formikProps.errors.marketing_description} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Address" name="address" value={formikProps.values.address} onChange={formikProps.handleChange} error={!!formikProps.touched.address && !!formikProps.errors.address} helperText={formikProps.touched.address && formikProps.errors.address} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Location Link (URL)" name="location_link" value={formikProps.values.location_link} onChange={formikProps.handleChange} error={!!formikProps.touched.location_link && !!formikProps.errors.location_link} helperText={formikProps.touched.location_link && formikProps.errors.location_link} /></Grid>
                
                <Grid item xs={12} sm={4}><MediaEditField label="Main Image" currentFileUrl={saleData.main_image} fileType="image" formikProps={formikProps} /></Grid>
                <Grid item xs={12} sm={4}><MediaEditField label="Diagram Image" currentFileUrl={saleData.diagram_image} fileType="image" formikProps={formikProps} /></Grid>
                <Grid item xs={12} sm={4}><MediaEditField label="Video Url" currentFileUrl={saleData.video_url} fileType="video" formikProps={formikProps} /></Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[800], p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="edit-sale-form" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
      <CustomSnackbar ref={snackbarRef} />
    </Dialog>
  );
};

export default EditSaleDialog;