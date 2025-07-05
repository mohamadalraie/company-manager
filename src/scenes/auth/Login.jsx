// =================================================================
//  LoginComponent - Full Code (Updated Design)
// =================================================================

// React & Hooks
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// External Libraries
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

// Material-UI (MUI) Components
import {
  Box,
  Button,
  TextField,
  useTheme,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  Avatar, // New!
} from "@mui/material";

// MUI Icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // New!

// Custom Project Components
import CustomSnackbar from "../../components/CustomSnackbar";
import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { LoginApi, getMyPermissions } from "../../shared/APIs";
import { getAuthToken, setAuthToken, setPermissions, setRole } from "../../shared/Permissions";

// =================================================================

const Login = () => {
  // --- Setup hooks and state ---
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const snackbarRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Handlers ---
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}${LoginApi}`, {
        email: values.email,
        password: values.password,
      });

      const token = response.data.data.token;
      setAuthToken(token);

      const config = {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      };
      const permissionResponse = await axios.get(`${baseUrl}${getMyPermissions}`, config);

      setRole(permissionResponse.data.data.role);
      setPermissions(permissionResponse.data.data.permissions);

      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(
          "Login successful! Redirecting...",
          "success"
        );
      }

      setTimeout(() => {
        // Redirect to the main dashboard or home page
        navigate("/"); 
      }, 1500);

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Formik & Yup Setup ---
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // --- Render ---
  return (
    // New! Full-screen container to center the login form
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: colors.primary[900] }}
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="25px"
              sx={{
                width: isNonMobile ? "450px" : "90vw",
                p: "30px",
                backgroundColor: colors.primary[800],
                borderRadius: "12px",
                boxShadow: `0px 10px 25px -5px rgba(0,0,0,0.5)`,
              }}
            >
              {/* New! Avatar with Lock Icon */}
              <Avatar sx={{ m: 1, bgcolor: colors.greenAccent[600] }}>
                <LockOutlinedIcon />
              </Avatar>

              <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
                Sign In
              </Typography>
              <Typography variant="body1" color={colors.grey[300]} textAlign="center">
                Welcome back! Please enter your credentials.
              </Typography>

              {/* New! Styled 'outlined' TextField */}
              <TextField
                fullWidth
                variant="outlined" // Changed from 'filled'
                type="email"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* New! Styled 'outlined' TextField */}
              <TextField
                fullWidth
                variant="outlined" // Changed from 'filled'
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
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

              {/* New! Styled primary action button */}
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{
                  padding: "14px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  mt: "10px",
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[900],
                  '&:hover': {
                    backgroundColor: colors.greenAccent[700],
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: colors.grey[900]}} />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar component for notifications */}
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default Login;