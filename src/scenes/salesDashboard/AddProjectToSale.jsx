import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Grid, CircularProgress, useTheme, InputAdornment, Chip
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

// --- المكونات والأدوات المساعدة ---
import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import useProjectsData from "../../hooks/getAllProjectsDataHook"; // Hook لجلب المشاريع
import { createProjectSalingDetailsApi } from "../../shared/APIs";
import CustomSnackbar from "../../components/CustomSnackbar";

// --- الأيقونات ---
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ClassIcon from '@mui/icons-material/Class';


const AddProjectToSale = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);

  // --- جلب بيانات المشاريع للقائمة المنسدلة ---
  const { projects, loading: projectsLoading } = useProjectsData();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    // --- يجب استخدام FormData عند إرسال ملفات ---
    const formData = new FormData();
    
    // إضافة كل قيمة إلى FormData
    Object.keys(values).forEach(key => {
        // تأكد من أن الملف موجود قبل إضافته
        if (key === 'main_image' || key === 'diagram_image' || key === 'video_url') {
            if (values[key]) {
                formData.append(key, values[key]);
            }
        } else {
            formData.append(key, values[key]);
        }
    });

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data', // مهم جدًا عند إرسال ملفات
        }
      };
      
      await axios.post(`${baseUrl}${createProjectSalingDetailsApi}`, formData, config);

      snackbarRef.current.showSnackbar("Project sale details added successfully!", "success");
      resetForm();

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add project sale details.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const initialValues = {
    project_id: "",
    main_title: "",
    marketing_description: "",
    location_link: "",
    address: "",
    video_url: null,
    main_image: null,
    diagram_image: null,
  };
  
  const validationSchema = yup.object().shape({
    project_id: yup.string().required("Project selection is required"),
    main_title: yup.string().required("Main title is required"),
    marketing_description: yup.string().required("Marketing description is required"),
    address: yup.string().required("Address is required"),
    location_link: yup.string().url("Please enter a valid URL").required("Location link is required"),
    main_image: yup.mixed().required("A main image is required."),
    diagram_image: yup.mixed().required("A diagram image is required."),
    video_url: yup.mixed().nullable(), // الفيديو اختياري
  });

  return (
    <Box m="20px">
      <Header title="Add Project to Sales" subtitle="Provide marketing details to list a project for sale" />
      
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Box
              mt="20px"
              p="30px"
              backgroundColor={colors.primary[800]}
              borderRadius="12px"
              boxShadow={`0px 0px 15px -5px ${colors.greenAccent[600]}`}
            >
              <Grid container spacing={3}>

                {/* --- اختيار المشروع --- */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" error={!!touched.project_id && !!errors.project_id}>
                    <InputLabel>Select Project*</InputLabel>
                    <Select
                      name="project_id"
                      value={values.project_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Select Project*"
                      startAdornment={<InputAdornment position="start"><ClassIcon/></InputAdornment>}
                    >
                      {projectsLoading ? (
                        <MenuItem disabled><em>Loading projects...</em></MenuItem>
                      ) : (
                        projects.map(project => (
                          <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                        ))
                      )}
                    </Select>
                    {touched.project_id && errors.project_id && <Typography color="error" variant="caption" sx={{ml: 1.5}}>{errors.project_id}</Typography>}
                  </FormControl>
                </Grid>

                {/* --- الحقول النصية --- */}
                <Grid item xs={12}><TextField fullWidth variant="outlined" label="Main Title*" name="main_title" value={values.main_title} onChange={handleChange} onBlur={handleBlur} error={!!touched.main_title && !!errors.main_title} helperText={touched.main_title && errors.main_title} InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon/></InputAdornment> }} /></Grid>
                <Grid item xs={12}><TextField fullWidth multiline rows={4} variant="outlined" label="Marketing Description*" name="marketing_description" value={values.marketing_description} onChange={handleChange} onBlur={handleBlur} error={!!touched.marketing_description && !!errors.marketing_description} helperText={touched.marketing_description && errors.marketing_description} InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon/></InputAdornment> }} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" label="Address*" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} error={!!touched.address && !!errors.address} helperText={touched.address && errors.address} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon/></InputAdornment> }} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" label="Location Link (URL)*" name="location_link" value={values.location_link} onChange={handleChange} onBlur={handleBlur} error={!!touched.location_link && !!errors.location_link} helperText={touched.location_link && errors.location_link} InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon/></InputAdornment> }} /></Grid>
                
                {/* --- حقول رفع الملفات --- */}
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" component="label" fullWidth startIcon={<ImageIcon/>}>Upload Main Image* <input type="file" hidden name="main_image" onChange={(e) => setFieldValue("main_image", e.currentTarget.files[0])} /></Button>
                  {touched.main_image && errors.main_image && <Typography color="error" variant="caption">{errors.main_image}</Typography>}
                  {values.main_image && <Chip label={values.main_image.name} sx={{mt:1}} onDelete={() => setFieldValue("main_image", null)} />}
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" component="label" fullWidth startIcon={<ImageIcon/>}>Upload Diagram Image* <input type="file" hidden name="diagram_image" onChange={(e) => setFieldValue("diagram_image", e.currentTarget.files[0])} /></Button>
                  {touched.diagram_image && errors.diagram_image && <Typography color="error" variant="caption">{errors.diagram_image}</Typography>}
                  {values.diagram_image && <Chip label={values.diagram_image.name} sx={{mt:1}} onDelete={() => setFieldValue("diagram_image", null)} />}
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" component="label" fullWidth startIcon={<VideocamIcon/>}>Upload Video <input type="file" hidden name="video_url" onChange={(e) => setFieldValue("video_url", e.currentTarget.files[0])} /></Button>
                  {values.video_url && <Chip label={values.video_url.name} sx={{mt:1}} onDelete={() => setFieldValue("video_url", null)} />}
                </Grid>

                {/* --- زر الإرسال --- */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button type="submit" variant="contained" disabled={isLoading} sx={{ backgroundColor: colors.greenAccent[600], color: 'white', '&:hover': { backgroundColor: colors.greenAccent[700] } }}>
                    {isLoading ? <CircularProgress size={24} /> : "Add Project to Sales"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default AddProjectToSale;