// =================================================================
//  LoginComponent - Full Code
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
} from "@mui/material";

// MUI Icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Custom Project Components (Placeholders)
// ملاحظة: هذه مكونات خاصة بمشروعك، تأكد من وجودها أو استبدلها.
import { Header } from "../../components/Header";
import CustomSnackbar from "../../components/CustomSnackbar";
import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { LoginApi } from "../../shared/APIs";
import { setAuthToken } from "../../shared/Permissions";

// =================================================================

const Login = () => {
  // Setup hooks and state
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const snackbarRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // --- HANDLERS ---
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Send login request to the backend API
      const response = await axios.post(`${baseUrl}${LoginApi}`, {
        email: values.email,
        password: values.password,
      });

      // Handle successful login
    //   console.log("Login Successful:", response.data);
      
      // Store authentication token and user data

      const token =response.data.data.token;
      console.log("token"+token)
      // localStorage.setItem("authToken", token);
      setAuthToken(token);
      // Show success message
      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(
          "Login successful! Redirecting...",
          "success"
        );
      }

      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      // Handle login failure
      console.error("Login Error:", error.response?.data || error.message);
      
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(errorMessage, "error");
      }

    } finally {
      // Stop loading indicator regardless of outcome
      setIsLoading(false);
    }
  };

  // --- FORMIK & YUP SETUP ---
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // --- RENDER ---
  return (

    <Box m="20px">
      <Header
        title="ACCOUNT LOGIN"
        subtitle="Welcome back! Please enter your credentials to continue."
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt="40px"
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Box
               sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: isNonMobile ? "50%" : "75%", // Responsive width for form container
                maxWidth: "900px", // Max width for large screens
                p: "30px", // Padding around the form sections
                backgroundColor: colors.primary[800], // Background for the form container
                borderRadius: "12px", // Slightly more rounded corners
                boxShadow: `0px 0px 15px -5px ${colors.greenAccent[600]}`, // Subtle shadow
                gap: "25px", // Gap between main sections
              }}
              >
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
                  Sign In
                </Typography>

                <TextField
                  fullWidth
                  variant="filled"
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

                <TextField
                  fullWidth
                  variant="filled"
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

                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    padding: "14px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    mt: "10px",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* Snackbar component for notifications */}
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default Login;